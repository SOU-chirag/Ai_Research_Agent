import React, { useState } from 'react';
import ResearchForm from './components/ResearchForm';
import ProgressStepper from './components/ProgressStepper';
import ReactMarkdown from 'react-markdown';
import useLLM from './hooks/useLLM';

function App() {
  const llm = useLLM();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
     llm.copyReport();
     setCopied(true);
     setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center py-12 px-4 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-indigo-900/50 to-transparent pointer-events-none"></div>
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="z-10 w-full max-w-4xl space-y-12">
        <header className="text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 drop-shadow-sm mb-4">
            AI Research Agent
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Uncover deep insights on any topic in seconds. 
          </p>
        </header>

        <section className="bg-slate-800/50 p-8 rounded-2xl shadow-xl backdrop-blur-md border border-slate-700/50">
          <ResearchForm 
            onSubmit={llm.startResearch} 
            isGenerating={llm.isGenerating} 
            planError={llm.planError}
            onInputChange={llm.handleInputChange}
          />
        </section>

        {llm.error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-6 rounded-xl shadow-lg flex flex-col items-center mt-6 backdrop-blur-md">
             <div className="flex items-center space-x-3 mb-4 font-semibold text-lg">
                <p>{llm.error}</p>
             </div>
             <button
               onClick={llm.retryResearch}
               className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-medium rounded shadow transition-colors w-max flex items-center shadow-red-900/50"
             >
               <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
               Retry
             </button>
          </div>
        )}

        {llm.planError && (
          <div className="bg-orange-500/10 border border-orange-500/50 rounded-xl p-6 shadow-lg flex flex-col items-center mt-6 backdrop-blur-md">
             <div className="flex items-center space-x-3 mb-4 text-orange-400 font-semibold text-lg">
                <svg className="w-6 h-6 border-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 9a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"></path></svg>
                <p>The Agent had trouble structuring the plan. Please try again.</p>
             </div>
             <button
               onClick={llm.retryResearch}
               className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded shadow transition-colors w-max flex items-center shadow-indigo-900/50"
             >
               <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
               Retry
             </button>
          </div>
        )}

        {(llm.isGenerating || llm.summary || llm.currentStep > 0) && !llm.planError && (
          <section className="bg-slate-800/30 p-8 rounded-2xl shadow-xl backdrop-blur-md border border-slate-700/50 space-y-8">
            <ProgressStepper currentStep={llm.currentStep} isGenerating={llm.isGenerating} />
            
            {llm.agentPlan.length > 0 && (
               <div className="mt-8 bg-slate-900/50 border border-indigo-500/30 p-6 rounded-xl shadow-inner animate-fade-in-up">
                  <h3 className="text-xl font-semibold mb-4 text-indigo-400 border-b border-indigo-500/30 pb-2">The Agent's Plan</h3>
                  <ul className="space-y-3">
                     {llm.agentPlan.map((question, index) => (
                        <li key={index} className="flex items-start">
                           <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">{index + 1}</span>
                           <span className="text-slate-200">{question}</span>
                        </li>
                     ))}
                  </ul>
               </div>
            )}
            
            {llm.insights.length > 0 && (
               <div className="mt-8 space-y-6">
                  <h3 className="text-xl font-semibold text-indigo-400 border-b border-indigo-500/30 pb-2">Gathered Insights</h3>
                  <div className="space-y-4">
                     {llm.insights.map((item, index) => (
                        <div key={index} className="bg-slate-800/80 border border-slate-700/50 p-5 rounded-xl shadow-lg animate-fade-in-up flex flex-col" style={{ animationFillMode: 'forwards' }}>
                           <h4 className="text-md font-bold text-slate-200 mb-3 border-l-4 border-indigo-500 pl-3">Phase {index + 1}: {item.question}</h4>
                           <div className="text-slate-300 text-sm leading-relaxed prose prose-invert prose-p:my-1 prose-li:my-0.5"><ReactMarkdown>{item.insight}</ReactMarkdown></div>
                        </div>
                     ))}
                  </div>
               </div>
            )}
            
            {llm.summary && (
               <div className="mt-8 bg-indigo-900/40 border border-indigo-500/50 p-7 rounded-xl shadow-lg animate-fade-in-up">
                  <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-4 pb-3 border-b border-indigo-500/30">Executive Summary</h3>
                  <div className="text-slate-200 leading-relaxed text-[15px] font-medium"><ReactMarkdown>{llm.summary}</ReactMarkdown></div>
                  
                  <div className="flex flex-wrap items-center mt-8 pt-5 space-x-4 border-t border-indigo-500/30 justify-end">
                     <button
                        onClick={handleCopy}
                        className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold rounded-lg shadow-md transition-colors flex items-center"
                     >
                        {copied ? (
                           <><svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Copied!</>
                        ) : (
                           <><svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg> Copy Report</>
                        )}
                     </button>
                     <button
                        onClick={llm.newResearch}
                        className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold rounded-lg shadow-md transition-all flex items-center shadow-indigo-900/50"
                     >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg> New Research
                     </button>
                  </div>
               </div>
            )}
            
          </section>
        )}
      </div>
    </div>
  );
}

export default App;
