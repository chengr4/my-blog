import React from "react";
import PostCard from "../../components/PostCard";
import getCategories from "../../services/getCategories";
import getCategoryPosts from "../../services/getCategoryPosts";
import { Post } from "../../types/global";

interface CategoryPostsProps {
  posts: Post[];
}

export default function CategoryPosts({ posts }: CategoryPostsProps) {
  return (
    <div className="container mx-auto px-10 mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* set span-8 to 12 */}
        <div className="col-span-1 lg:col-span-12"> 
          {posts.map((post, index) => (
            <PostCard key={index} post={post} />
          ))}
        </div>
        {/* hide right span-4 area */}
        {/* <div className="col-span-1 lg:col-span-4"> */}
          {/* <div className="relative lg:sticky top-8"> */}
            {/* <Categories /> */}
          {/* </div> */}
        {/* </div> */}
      </div>
    </div>
  );
}

// Specify dynamic routes to pre-render pages based on data.
// The HTML is generated at build time and will be reused on each request.
export async function getStaticPaths() {
  const categories = await getCategories();
  return {
    paths: categories.map(({ slug }) => ({ params: { slug } })),
    fallback: false,
  };
}

// Fetch data at build time
export async function getStaticProps(ctx: any) {
  const category = ctx.params.slug;
  const matchedPosts = await getCategoryPosts(category);

  return {
    props: { posts: matchedPosts },
  };
}
