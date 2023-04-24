import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface PostWidgetProps {
  posts: any[];
}

const PostWidget = ({ posts }: PostWidgetProps) => {
  const [modifiedPosts, setModifiedPosts] = useState<any[]>([]);

  useEffect(() => {
      setModifiedPosts(posts.slice(0, 3));
  }, [posts]);

  return (
    <div className='bg-white shadow-lg rounded-lg p-8 mb-8'>
      <h3 className='text-xl mb-8 font-semibold border-b pd-4'>
        Recent Posts
      </h3>
      {modifiedPosts.map((post) => (
        <div key={post.title} className='flex items-center w-full mb-4'>
          <div className='flew-grow ml-4'>
            <p className='text-gray-500 font-xs'>
              {post.editedDate || post.createdDate}
            </p>
            <Link href={`/posts/${post.file}`} key={post.title}>
              {post.title}
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
};

export default PostWidget;