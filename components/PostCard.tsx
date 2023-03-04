import React from 'react';
import Link from 'next/link';

interface PostCardProps {
  post: {
    title: string
    excerpt: string
    file: string
    date: string
  }
};

const PostCard = ({ post }: PostCardProps) => {
  return (
    <div className='bg-white shadow-lg rounded-lg p-0 lg:p-8 pb-12 mb-8'>
      <Link href={`/post/${post.file}`} >
        <h1 className='transition duration-700 mb-8 cursor:pointer text-center hover:text-pink-600 text-3xl font-semibold'>
          {post.title}
        </h1>
        <p className='text-center text-lg text-gray-700 font-normal px-4 lg:px-20 mb-8'>{post.excerpt}</p>
      </Link>
      <div className='block lg:flex text-center item-center justify-center mb-8 w-full'>
        {/* Post Date */}
        <div className='font-medium text-gray-700'>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="align-middle">{post.date}</span>
        </div>
      </div>
    </div>
  )
};

export default PostCard;