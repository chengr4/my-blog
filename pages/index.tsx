import type { NextPage } from 'next'
import Head from 'next/head'
import { PostCard, PostWidget, Category } from '../components';
import { uniqueId } from 'lodash';

const posts = [
  { title: 'test1', des: 'tttttt' },
  { title: 'test2', des: 'geageag' },
];

const Home: NextPage = () => {
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
              <PostWidget />
              <Category />
            </div>
        </div>
      </div>
    </div>
  )
}

export default Home
