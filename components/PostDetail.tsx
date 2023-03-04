import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'

const PostDetail = () => {
  const markdown = `# A paragraph with *emphasis* and **strong importance**.

  > A block quote with ~strikethrough~ and a URL: https://reactjs.org.
  
  * Lists
  * [ ] todo
  * [x] done
  
  A table:
  
  | a | b |
  | - | - |
  | fefe | fefe |

  `;
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