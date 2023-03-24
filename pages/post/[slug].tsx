import React from "react";
import { PostWidget, PostDetail } from "../../components";

interface PostDetailsProps {
  markdown: string;
}

const PostDetails = (props: PostDetailsProps) => {
  return (
    <>
      <div className="container mx-auto px-10 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="col-span-1 lg:col-span-8">
            <PostDetail markdown={props.markdown} />
            {/* <Author author={post.author} /> */}
            {/* <AdjacentPosts slug={post.slug} createdAt={post.createdAt} /> */}
          </div>
          <div className="col-span-1 lg:col-span-4">
            <div className="relative lg:sticky top-8">
              <PostWidget />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export async function getStaticPaths() {
  const data = await getPostsIndex();

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

  const markdown = await getMarkDownContent(fileName);
  const posts = await getPostsIndex();

  return {
    props: {
      markdown,
      posts,
    },
  };
}

export default PostDetails;
