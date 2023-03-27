import React from "react";
import { PostWidget, PostDetail } from "../../components";
import getPostContent from "../../services/getPostContent";
import getAllPosts from "../../services/getAllPosts";

interface PostDetailsProps {
  markdown: string;
  posts: any[];
}

const PostDetails = ({ markdown, posts }: PostDetailsProps) => {
  return (
    <>
      <div className="container mx-auto px-10 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="col-span-1 lg:col-span-8">
            <PostDetail markdown={markdown} />
            {/* <Author author={post.author} /> */}
            {/* <AdjacentPosts slug={post.slug} createdAt={post.createdAt} /> */}
          </div>
          <div className="col-span-1 lg:col-span-4">
            <div className="relative lg:sticky top-8">
              <PostWidget posts={posts} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export async function getStaticPaths() {
  const data = await getAllPosts();

  const paths = data.map((post: { file: any }) => ({
    params: { slug: post.file },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps(ctx: any) {
  const fileName = ctx.params.slug;

  const markdown = await getPostContent(fileName);
  const posts = await getAllPosts();

  return {
    props: {
      markdown,
      posts,
    },
  };
}

export default PostDetails;
