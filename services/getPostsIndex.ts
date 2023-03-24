export default async function getPostsIndex() {
  const res = await fetch('https://raw.githubusercontent.com/chengr4/my-blog/main/data/posts/index.json');
  const data = await res.json();

  return data;
}