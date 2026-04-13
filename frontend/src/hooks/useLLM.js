import { useState, useCallback } from 'react';

const useLLM = () => {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [agentPlan, setAgentPlan] = useState([]);
  const [insights, setInsights] = useState([]);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [planError, setPlanError] = useState(false);

  const startResearch = useCallback((searchTopic) => {
    setTopic(searchTopic);
    setIsGenerating(true);
    setCurrentStep(1); 
    setSummary('');
    setError('');
    setAgentPlan([]);
    setPlanError(false);
    setInsights([]);

    const wsUrl = `ws://127.0.0.1:8000/ws/research`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ topic: searchTopic }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.error === "RATE_LIMIT_EXCEEDED") {
         setError("Daily API limit reached. Please try again in a few hours or use a different API key.");
         setIsGenerating(false);
         ws.close();
         return;
      }
      
      if (data.error && data.error !== "MALFORMED_JSON") {
        setError(data.error);
        setIsGenerating(false);
        ws.close();
        return;
      }

      if (data.bundled_insights_json) {
         try {
             let cleanedJson = data.bundled_insights_json.trim();
             if (cleanedJson.startsWith("```json")) cleanedJson = cleanedJson.substring(7);
             else if (cleanedJson.startsWith("```")) cleanedJson = cleanedJson.substring(3);
             if (cleanedJson.endsWith("```")) cleanedJson = cleanedJson.substring(0, cleanedJson.length - 3);

             const parsedBundle = JSON.parse(cleanedJson.trim());
             const insightsDict = parsedBundle.insights;
             const keys = Object.keys(insightsDict);
             const originQs = data.original_questions;
             
             let index = 0;
             const streamInterval = setInterval(() => {
                if (index >= keys.length) {
                   clearInterval(streamInterval);
                   return;
                }
                
                const qKey = keys[index];
                const bullets = insightsDict[qKey] || [];
                const formattedInsight = bullets.map(b => `- ${b}`).join("\n");
                const ogStr = originQs ? originQs[index] : `Question ${index+1}`;
                
                setInsights((prev) => [...prev, { question: ogStr, insight: formattedInsight }]);
                
                index++;
             }, 1000);

         } catch (e) {
             setPlanError(true);
             setIsGenerating(false);
             ws.close();
             return;
         }
      }

      if (data.raw_json) {
         try {
             let cleanedJson = data.raw_json.trim();
             if (cleanedJson.startsWith("```json")) cleanedJson = cleanedJson.substring(7);
             else if (cleanedJson.startsWith("```")) cleanedJson = cleanedJson.substring(3);
             if (cleanedJson.endsWith("```")) cleanedJson = cleanedJson.substring(0, cleanedJson.length - 3);

             const parsedPlan = JSON.parse(cleanedJson.trim());
             if (!parsedPlan.subQuestions || !Array.isArray(parsedPlan.subQuestions)) {
                 throw new Error("Missing subQuestions");
             }
             setAgentPlan(parsedPlan.subQuestions);
             setPlanError(false);
         } catch (e) {
             setPlanError(true);
             setIsGenerating(false);
             ws.close();
             return; 
         }
      }

      if (data.error === "MALFORMED_JSON") {
          setPlanError(true);
          setIsGenerating(false);
          ws.close();
          return;
      }

      if (data.step) {
        setCurrentStep(data.step);
      }

      if (data.summary) {
        setSummary(data.summary);
        setIsGenerating(false);
        ws.close();
      }
    };

    ws.onerror = (err) => {
      console.error("WS Error:", err);
      setError("Failed to connect to the backend server. Is it running on port 8000?");
      setIsGenerating(false);
    };
  }, []);

  const newResearch = useCallback(() => {
    setTopic('');
    setIsGenerating(false);
    setCurrentStep(0);
    setAgentPlan([]);
    setInsights([]);
    setSummary('');
    setError('');
    setPlanError(false);
  }, []);

  const retryResearch = useCallback(() => {
     startResearch(topic);
  }, [topic, startResearch]);

  const copyReport = useCallback(() => {
     let text = `Research Topic: ${topic}\n\n`;
     
     text += `--- The Agent's Execution Plan ---\n`;
     agentPlan.forEach((q, i) => text += `${i+1}. ${q}\n`);
     
     text += `\n--- Gathered Insights ---\n`;
     insights.forEach((ins, i) => {
        text += `\nPhase ${i+1}: ${ins.question}\n${ins.insight}\n`;
     });
     
     if (summary) {
        text += `\n--- Executive Summary ---\n${summary}\n`;
     }
     
     navigator.clipboard.writeText(text).catch(err => console.error("Could not copy text: ", err));
  }, [topic, agentPlan, insights, summary]);

  const handleInputChange = () => {
    if (planError) setPlanError(false);
  };

  return {
    topic,
    isGenerating,
    currentStep,
    agentPlan,
    insights,
    summary,
    error,
    planError,
    startResearch,
    newResearch,
    retryResearch,
    copyReport,
    handleInputChange
  };
};

export default useLLM;
