// import React from 'react'
// import ReactMarkdown from 'react-markdown'
// // // import remarkGfm from 'remark-gfm'
// // import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
// // import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs' // docco is a clean style



// const RevisionNotes = ({ content }: { content: string }) => (
//     <div className="prose mx-auto">
//       {/* <CodeBlock code={content} /> */}
//       <ReactMarkdown >{content}</ReactMarkdown>

//     </div>
//   )
  
//   export default RevisionNotes
  



import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css'; // Light mode theme
import 'highlight.js/styles/github-dark.css'; // Dark mode theme

const RevisionNotes = ({ content }: { content: string }) => {
  useEffect(() => {
    hljs.highlightAll(); // Highlight code blocks
  }, []);

  return (
    <div className="prose mx-auto w-full dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
            
          code({ inline, className, children, ...props }: { inline?: boolean, className?: string, children?: React.ReactNode }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <pre className="bg-gray-100 dark:bg-gray-800 rounded p-4 overflow-auto">
                <code className={`hljs ${className}`} {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code
                {...props}
                className="bg-gray-200 dark:bg-gray-800 text-sm px-1 rounded"
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default RevisionNotes;
