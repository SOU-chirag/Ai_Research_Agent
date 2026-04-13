import React from 'react';

const steps = [
  { id: 1, name: 'Generating Sub-questions' },
  { id: 2, name: 'Extracting Insights' },
  { id: 3, name: 'Finalizing Report' },
];

const ProgressStepper = ({ currentStep, isGenerating }) => {
  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <span className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-md text-sm mr-3 border border-indigo-500/30 text-[1xs] uppercase tracking-wider">Live Progress</span>
        {isGenerating ? 'Synthesizing knowledge...' : (currentStep >= 3 ? 'Research Complete' : 'Waiting...')}
      </h2>
      <div className="relative flex justify-between">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-700/50 rounded-full z-0"></div>
        <div 
           className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-indigo-500 rounded-full z-0 transition-all duration-700 ease-in-out"
           style={{ width: `${(Math.max(0, currentStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step, idx) => {
          const isActive = currentStep === step.id;
          const isPast = currentStep > step.id;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all duration-500 
                  ${
                    isPast 
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]' 
                      : isActive
                      ? 'bg-slate-800 border-indigo-400 text-indigo-400 shadow-[0_0_20px_rgba(129,140,248,0.7)] animate-pulse-slow'
                      : 'bg-slate-800 border-slate-600 text-slate-500'
                  }
                `}
              >
                {isPast ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                ) : (
                  step.id
                )}
              </div>
              <p 
                className={`mt-4 text-sm font-medium transition-colors duration-300 absolute -bottom-8 w-max text-center
                  ${
                    isPast ? 'text-slate-300' 
                    : isActive ? 'text-indigo-400 font-semibold' 
                    : 'text-slate-500'
                  }
                `}
              >
                {step.name}
              </p>
            </div>
          );
        })}
      </div>
      <div className="h-10"></div>
    </div>
  );
};

export default ProgressStepper;
