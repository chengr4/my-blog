import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface PostWidgetProps {

}

const PostWidget = () => {
  const [posts, setPosts] = useState<any[]>([]);

  // fetch data from public/posts.json
  useEffect(() => {
    fetch('/posts/example.json')
      .then((res) => res.json())
      .then((data) => setPosts(data));
  });

  return (
    <div className='bg-white shadow-lg rounded-lg p-8 mb-8'>
      <h3 className='text-xl mb-8 font-semibold border-b pd-4'>
        Recent Posts
      </h3>
      {posts.map((post) => (
        <div key={post.title} className='flex items-center w-full mb-4'>
          <div className='flew-grow ml-4'>
            <p className='text-gray-500 font-xs'>
              {post.date}
            </p>
            <Link href={`/post/${post.file}`} key={post.title}>
              {post.title}
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
};

export default PostWidget;