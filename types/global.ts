export interface Post {
  title: string;
  createdDate: string;
  editedDate?: string;
  categories: string[];
  file: string;
  excerpt: string;
}