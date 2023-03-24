import type { NextPage } from "next";
import Head from "next/head";
import { PostCard, PostWidget } from "../components";
import { uniqueId } from "lodash";

interface HomeProps {
  posts: any[];
}

const Home: NextPage<HomeProps> = ({ posts }) => {
  return (
    <div className="container mx-auto items-center justify-center py-2 mb-8">
      <Head>
        <title>My Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 col-span-1">
          {/* Posts */}
          {posts.map((post: any) => (
            <PostCard post={post} key={uniqueId("post_")} />
          ))}
        </div>
        <div className="lg:col-span-4 col-span-1">
          <div className="lg:sticky relative top-8">
            {/* Show recent posts */}
            <PostWidget />
            {/* Still thinking how to implement Category */}
            {/* <Category /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getStaticProps() {
  // Fetch data from an API or database
  const res = await fetch('https://raw.githubusercontent.com/chengr4/my-blog/main/data/posts/index.json');
  const data = await res.json();

  return {
    props: {
      posts: data
    }
  };
}

export default Home;
