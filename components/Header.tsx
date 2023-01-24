import React from 'react'

import Link from 'next/link'

const Header = () => {
  return (
    <div className='container mx-auto px-10 mb-10'>
      <div className='w-full inline-block'>
        <div className='md:float-left block'>
          <Link href='/'>
            <span className='cursor-pointer font-bold text-4xl'>
              Eddie's Blog
            </span>
          </Link>
        </div>
        <div className='hidden md:contents'>
          <span className='mt-2 float-right align-middle ml-4'>
            teffffff
          </span>
        </div>
      </div>
      <div className='border-b w-full inline-block'>

      </div>
    </div>
  )
}

export default Header