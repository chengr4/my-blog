import React, { useEffect, useState } from 'react'

const Category = () => {
  const [categories, setCategories] = useState<any[]>([]);

  // fetch data from public/posts.json
  useEffect(() => {
    fetch('/posts/example.json')
      .then((res) => res.json())
      .then((data) => setCategories(data));
  });
  return (
    <div className='bg-white shadow-lg rounded-lg p-8 mb-8'>
      <h3 className='text-xl mb-8 font-semibold border-b pd-4'>
        Categories
      </h3>
      {/* TODO: map categories like PostWidget */}
    </div>
  )
}

export default Category