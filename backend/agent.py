import os
import json
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from dotenv import load_dotenv
from prompts import SUB_QUESTIONS_PROMPT, INSIGHTS_PROMPT, EXECUTIVE_SUMMARY_PROMPT

load_dotenv()

groq_api_key = os.environ.get("GROQ_API_KEY", "")

llm = ChatGroq(model="llama-3.3-70b-versatile", api_key=groq_api_key, temperature=0.0)

async def run_research(topic: str):
    if not groq_api_key:
        yield {"step": 1, "error": "Groq API Key Error: Please check your .env file."}
        return

    # Phase 1: Sub-Questions
    yield {"step": 1, "status": "Generating Sub-questions..."}
    
    prompt1 = PromptTemplate(input_variables=["topic"], template=SUB_QUESTIONS_PROMPT)
    try:
        res1 = await (prompt1 | llm).ainvoke({"topic": topic})
        raw_response = res1.content.strip()
    except Exception as e:
        err_str = str(e).lower()
        if "401" in err_str or "unauthorized" in err_str or "api_key" in err_str or "authentication" in err_str:
            yield {"step": 1, "error": "Groq API Key Error: Please check your .env file."}
        else:
            yield {"step": 1, "error": "LLM Connection Error"}
        return
        
    yield {"step": 1, "raw_json": raw_response}
    
    try:
        json_str = raw_response.strip()
        if json_str.startswith("```json"): json_str = json_str[7:]
        if json_str.startswith("```"): json_str = json_str[3:]
        if json_str.endswith("```"): json_str = json_str[:-3]
            
        parsed = json.loads(json_str.strip())
        sub_questions = parsed.get("subQuestions", [])
        if not isinstance(sub_questions, list) or len(sub_questions) == 0: raise ValueError()
    except Exception:
        yield {"step": 1, "error": "MALFORMED_JSON"}
        return
    
    sub_questions = sub_questions[:3]
    yield {"step": 1, "result": sub_questions}
    
    # Phase 2: Sequential Insights Extraction
    yield {"step": 2, "status": "Extracting Insights..."}
    
    subq_str = "\n".join([f"q{i+1}: {q}" for i, q in enumerate(sub_questions)])
    
    q_prompt = PromptTemplate(input_variables=["questions", "topic"], template=INSIGHTS_PROMPT)
    try:
        res2 = await (q_prompt | llm).ainvoke({"questions": subq_str, "topic": topic})
        step2_raw = res2.content.strip()
        yield {"step": 2, "bundled_insights_json": step2_raw, "original_questions": sub_questions}
    except Exception as e:
        err_str = str(e).lower()
        if "429" in err_str or "resource" in err_str or "exhausted" in err_str or "quota" in err_str or "rate_limit" in err_str:
            yield {"step": 2, "error": "RATE_LIMIT_EXCEEDED"}
            return
        elif "401" in err_str or "unauthorized" in err_str or "api_key" in err_str or "authentication" in err_str:
            yield {"step": 2, "error": "Groq API Key Error: Please check your .env file."}
            return
        else:
            yield {"step": 2, "error": "MALFORMED_JSON"}
            return
            
    # Bridge for Phase 3 Execution
    try:
        if step2_raw.startswith("```json"): step2_raw = step2_raw[7:]
        if step2_raw.startswith("```"): step2_raw = step2_raw[3:]
        if step2_raw.endswith("```"): step2_raw = step2_raw[:-3]
        parsed_insights = json.loads(step2_raw.strip())['insights']
        
        insights = []
        for i, q in enumerate(sub_questions):
            key = f"q{i+1}"
            bullets = parsed_insights.get(key, [])
            formatted = "\n".join([f"- {b}" for b in bullets])
            insights.append({"question": q, "insight": formatted})
    except Exception:
        yield {"step": 2, "error": "MALFORMED_JSON"}
        return
    
    # Phase 3: Executive Summary
    yield {"step": 3, "status": "Finalizing Details..."}
    
    context = ""
    for ins in insights:
        context += f"Q: {ins['question']}\nInsights:\n{ins['insight']}\n\n"
        
    prompt3 = PromptTemplate(input_variables=["topic", "context"], template=EXECUTIVE_SUMMARY_PROMPT)
    try:
        res3 = await (prompt3 | llm).ainvoke({"topic": topic, "context": context})
        summary = res3.content.strip()
    except Exception as e:
        err_str = str(e).lower()
        if "401" in err_str or "unauthorized" in err_str or "api_key" in err_str or "authentication" in err_str:
            yield {"step": 3, "error": "Groq API Key Error: Please check your .env file."}
        else:
            yield {"step": 3, "error": "LLM Connection Error"}
        return
    
    yield {"step": 3, "status": "Complete", "summary": summary}
