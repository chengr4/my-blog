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
  const res = await fetch(
    "https://raw.githubusercontent.com/chengr4/my-blog/main/data/posts/index.json"
  );
  const data = await res.json();

  const paths = data.map((post: { file: any }) => ({
    params: { slug: post.file },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps(ctx: any) {
  const file = ctx.params.slug;
  // Fetch data from an API or database
  const res = await fetch(
    `https://raw.githubusercontent.com/chengr4/my-blog/main/data/posts/contents/${file}.md`
  );
  const data = await res.text();

  return {
    props: {
      markdown: data,
    },
  };
}

export default PostDetails;
