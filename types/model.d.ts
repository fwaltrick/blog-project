export interface Post {
  id?: string;
  title: string;
  image: string;
  author: string;
  createdAt: number;
  teaser: string;
  content: string;
  slug?: string;
  formattedDate?: string;
}

export type Posts = Post[];
