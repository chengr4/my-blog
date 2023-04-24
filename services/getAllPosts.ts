import { Post } from "../types/global";

// get all posts and sort them by editedDate and createdDate
export default async function getAllPosts() {
  const res = await fetch('https://raw.githubusercontent.com/chengr4/my-blog/main/data/posts/index.json');
  const data: Post[] = await res.json();

  // sort posts by editedDate and createdDate
  data.sort((a, b) => {
    const aDate = new Date(a.editedDate || a.createdDate);
    const bDate = new Date(b.editedDate || b.createdDate);
    return bDate.getTime() - aDate.getTime();
  });

  return data;
}