import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'

const PostDetail = () => {
  const [markdown, setMarkdown] = useState('');  

  useEffect(() => {
    async function fetchContent() {
      // remove /post from the path
      const path = window.location.pathname.replace('/post', '');
      const response = await fetch(`/posts/contents/${path}.md`);
      const data = await response.text();
      setMarkdown(data);
    }
    fetchContent();
  }, []);

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