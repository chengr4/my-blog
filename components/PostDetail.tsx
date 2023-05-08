import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { codeBlockStyle } from '../config';

interface PostDetailProps {
  markdown: string;
};

const PostDetail = ({ markdown }: PostDetailProps) => {
  return (
    <div className='bg-white shadow-lg rounded-lg p-8 pb-12 mb-8'>
      <article className='markdown-body'>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <SyntaxHighlighter
                  language={match[1]}
                  PreTag="div"
                  {...props}
                  style={codeBlockStyle}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            }
          }}
        >
          {markdown}
        </ReactMarkdown>
      </article>
    </div>
  );
};

export default PostDetail;