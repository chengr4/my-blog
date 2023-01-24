import React from 'react'

interface PostCardProps {
  post: {
    title: string
    des: string
  }
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <div>
      {post.title}
      {post.des}
    </div>
  )
}

export default PostCard