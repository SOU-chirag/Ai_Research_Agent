import React from 'react';
import ReactMarkdown from 'react-markdown';

const ReportViewer = ({ markdown }) => {
  return (
    <div className="prose prose-invert prose-indigo max-w-none text-slate-300">
      <ReactMarkdown
        components={{
          h1: ({node, ...props}) => <h1 className="text-3xl md:text-5xl font-extrabold pb-6 border-b border-slate-700/50 mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 leading-tight" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-10 mb-4 text-slate-100" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-xl font-semibold mt-8 mb-3 text-slate-200" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc list-outside ml-6 space-y-2 text-slate-300 marker:text-indigo-500" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-6 space-y-2 text-slate-300 marker:text-indigo-500 font-medium" {...props} />,
          li: ({node, ...props}) => <li className="pl-2 leading-relaxed" {...props} />,
          p: ({node, ...props}) => <p className="leading-relaxed text-slate-300 mb-6 text-[1.05rem]" {...props} />,
          strong: ({node, ...props}) => <strong className="font-semibold text-slate-100 tracking-wide" {...props} />,
          blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-indigo-500 pl-6 italic text-slate-400 pb-2 mb-6 bg-slate-800/30 py-4 rounded-r-xl shadow-inner font-serif" {...props} />,
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

export default ReportViewer;
