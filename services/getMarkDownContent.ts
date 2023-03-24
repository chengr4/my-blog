export default async function getMarkDownContent(fileName: string) {
  const res = await fetch(`https://raw.githubusercontent.com/chengr4/my-blog/main/data/posts/contents/${fileName}.md`)
  const text = await res.text()
  return text;
}