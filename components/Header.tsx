import React from 'react'

import Link from 'next/link'

const Header = () => {
  return (
    <div className='container mx-auto px-10 mb-8'>
      <div className='border-b w-full inline-block py-8'>
        <div className='md:float-left block'>
          <Link href='/'>
            <span className='cursor-pointer font-bold text-4xl text-white'>
              Eddie&apos;s Blog
            </span>
          </Link>
        </div>
        <div className='hidden md:float-left md:contents'>
          <span className='md:float-right mt-2 align-middle text-white ml-4 font-semibold cursor-pointer'>
            About
          </span>
          <span className='md:float-right mt-2 align-middle text-white ml-4 font-semibold cursor-pointer'>
            Others
          </span>
          <span className='md:float-right mt-2 align-middle text-white ml-4 font-semibold cursor-pointer'>
            CS
          </span>
          <span className='md:float-right mt-2 align-middle text-white ml-4 font-semibold cursor-pointer'>
            Web
          </span>
        </div>
      </div>
    </div>
  )
}

export default Header