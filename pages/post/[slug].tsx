import React from 'react'
import { PostWidget, PostDetail } from '../../components';

const PostDetails = () => {
  return (
    <>
      <div className="container mx-auto px-10 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="col-span-1 lg:col-span-8">
            <PostDetail />
            {/* <Author author={post.author} /> */}
            {/* <AdjacentPosts slug={post.slug} createdAt={post.createdAt} /> */}
            {/* <CommentsForm slug={post.slug} /> */}
            {/* <Comments slug={post.slug} /> */}
          </div>
          <div className="col-span-1 lg:col-span-4">
            <div className="relative lg:sticky top-8">
              <PostWidget />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PostDetails;