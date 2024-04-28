import React from "react";
import { PostDetail } from "../../components";
import getPostContent from "../../services/getPostContent";
import getAllPosts from "../../services/getAllPosts";

interface PostDetailsProps {
  markdown: string;
  posts: any[];
}

const PostDetails = ({ markdown }: PostDetailsProps) => {
  return (
    <>
      <div className="container mx-auto px-10 mb-8">
          <div className="">
            <PostDetail markdown={markdown} />
            {/* <Author author={post.author} /> */}
            {/* <AdjacentPosts slug={post.slug} createdAt={post.createdAt} /> */}
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

  return {
    props: {
      markdown,
    },
  };
}

export default PostDetails;
