export default async function getCategories() {
  const res = await fetch('https://raw.githubusercontent.com/chengr4/my-blog/main/data/categories.json');
  const categories: any[] = await res.json();

  return categories;
}