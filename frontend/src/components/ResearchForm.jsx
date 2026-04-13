import React, { useState } from 'react';

const ResearchForm = ({ onSubmit, isGenerating, planError, onInputChange }) => {
  const [inputVal, setInputVal] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setInputVal(e.target.value);
    if (onInputChange) onInputChange();
    if (e.target.value.length > 0 && e.target.value.length < 5) {
      setErrorMsg('Topic must be at least 5 characters long.');
    } else {
      setErrorMsg('');
    }
  };

  const handleBlur = () => {
    if (inputVal.length > 0 && inputVal.length < 5) {
      setErrorMsg('Topic must be at least 5 characters long.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputVal.length < 5) {
      setErrorMsg('Topic must be at least 5 characters long before submitting.');
      return;
    }
    setErrorMsg('');
    onSubmit(inputVal);
  };

  const isDisabled = isGenerating || planError || (inputVal.length > 0 && inputVal.length < 5);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full">
      <div className="relative flex items-center justify-between group">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input
          type="text"
          value={inputVal}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isGenerating}
          placeholder="What would you like to research today?"
          className="w-full pl-12 pr-40 py-4 bg-slate-900/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-100 placeholder-slate-500 disabled:opacity-50 transition-all duration-300 ease-in-out hover:border-slate-500"
        />
        <button
          type="submit"
          disabled={isDisabled}
          className="absolute right-2 top-2 bottom-2 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium rounded-lg transition-colors shadow-md disabled:cursor-not-allowed group-focus-within:bg-indigo-500 flex items-center justify-center min-w-[120px]"
        >
          {isGenerating ? (
             <span className="flex items-center">
             <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
             Working...
             </span>
          ) : (
            'Start Research'
          )}
        </button>
      </div>
      {errorMsg && (
        <p className="text-red-400 text-sm font-medium mt-3 ml-2 flex items-center shadow-red-900 drop-shadow-sm">
           <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
           {errorMsg}
        </p>
      )}
    </form>
  );
};

export default ResearchForm;
