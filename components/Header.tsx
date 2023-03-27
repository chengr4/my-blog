import React, { useEffect, useState } from "react";
import Link from "next/link";
import getCategories from "../services/getCategories";

const Header = () => {
  const [categories, setCategories] = useState<any[]>([]);

  // fetch data from public/categories.json
  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data);
    });
  }, []);

  return (
    <div className="container mx-auto px-10 mb-8">
      <div className="border-b w-full inline-block py-8">
        <div className="md:float-left block">
          <Link href="/">
            <span className="cursor-pointer font-bold text-4xl text-white">
              Eddie&apos;s Blog
            </span>
          </Link>
        </div>
        <div className="hidden md:float-left md:contents">
          <Link href={`/about`}>
            <span className="md:float-right mt-2 align-middle text-white ml-4 font-semibold cursor-pointer">
              About
            </span>
          </Link>
          {categories.map((category, index) => (
            <Link key={index} href={`/categories/${category.slug}`}>
              <span className="md:float-right mt-2 align-middle text-white ml-4 font-semibold cursor-pointer">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;
