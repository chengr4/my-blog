import { Post } from "../types/global";
import getAllPosts from "./getAllPosts";

export default async function getCategoryPosts(category: string) {
  const posts = await getAllPosts();
  // each post has a categories array and returns the one match the category
  return posts.filter((post: Post) => post.categories.includes(category));
}