import type { NextPage } from 'next'
import Head from 'next/head'
import { PostCard, PostWidget } from '../components';
import { uniqueId } from 'lodash';
import { useEffect, useState } from 'react';


const Home: NextPage = () => {
  const [posts, setPosts] = useState([]);

  // fetch data from public/posts.json
  useEffect(() => {
    fetch('/posts/index.json')
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);


  return (
    <div className="container mx-auto items-center justify-center py-2 mb-8">
      <Head>
        <title>My Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-12'>
        <div className='lg:col-span-8 col-span-1'>
          {/* Posts */}
          {posts.map((post, index) => ( <PostCard post={post} key={uniqueId('post_')} /> ))}
        </div>
        <div className='lg:col-span-4 col-span-1'>
            <div className='lg:sticky relative top-8'>
              {/* Show recent posts */}
              <PostWidget />
              {/* Still thinking how to implement Category */}
              {/* <Category /> */}
            </div>
        </div>
      </div>
    </div>
  )
}

export default Home;