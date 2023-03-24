import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'

interface PostDetailProps {
  markdown: string;
};

const PostDetail = ({ markdown }: PostDetailProps) => {
  return (
    <div className='bg-white shadow-lg rounded-lg p-8 pb-12 mb-8'>
      <article className='markdown-body'>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {markdown}
        </ReactMarkdown>
      </article>
    </div>

  )
};

export default PostDetail;