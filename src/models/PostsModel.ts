import type { Post } from "../../types/model";
import slugify from "slugify";
import dayjs from "dayjs";
import postsData from "../../data/posts.json";
import fs from "fs";
import path from "path";

export class PostsModel {
  private static posts: Post[] = PostsModel.loadPosts();

  private static loadPosts(): Post[] {
    return postsData.map((post: any) => ({
      ...post,
      id: post.id || this.generateNextId(), // Generate sequential ID if it doesn't exist
      image: post.image ?? "",
      slug: slugify(post.title, { lower: true, strict: true }),
      formattedDate: dayjs(post.createdAt * 1000).format("MMMM D, YYYY"),
    }));
  }

  private static generateNextId(): string {
    // Get all current posts from the data, not this.posts which might be empty during loading
    const currentPosts = postsData as Post[];
    const existingIds = currentPosts
      .map((post) => parseInt(post.id!))
      .filter((id) => !isNaN(id));
    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
    return (maxId + 1).toString();
  }

  static getAllPosts(): Post[] {
    return this.posts;
  }

  static getPostBySlug(slug: string): Post | undefined {
    return this.posts.find((post) => post.slug === slug);
  }

  static getPostById(id: string): Post | undefined {
    return this.posts.find((post) => post.id === id);
  }

  static addPost(postData: Post): Post {
    const newPost: Post = {
      ...postData,
      id: this.generateNextId(),
      slug: slugify(postData.title, { lower: true, strict: true }),
      formattedDate: dayjs(postData.createdAt * 1000).format("MMMM D, YYYY"),
    };

    this.posts.push(newPost);
    this.savePosts();
    return newPost;
  }

  static updatePost(id: string, postData: Post): Post | null {
    const index = this.posts.findIndex((post) => post.id === id);
    if (index === -1) {
      return null;
    }

    const updatedPost: Post = {
      ...postData,
      id,
      slug: slugify(postData.title, { lower: true, strict: true }),
      formattedDate: dayjs(postData.createdAt * 1000).format("MMMM D, YYYY"),
    };

    this.posts[index] = updatedPost;
    this.savePosts();
    return updatedPost;
  }

  static deletePost(id: string): boolean {
    const index = this.posts.findIndex((post) => post.id === id);
    if (index === -1) {
      return false;
    }

    this.posts.splice(index, 1);
    this.savePosts();
    return true;
  }

  private static savePosts(): void {
    const dataPath = path.join(__dirname, "../../data/posts.json");
    const postsToSave = this.posts.map(
      ({ slug, formattedDate, ...post }) => post,
    );

    try {
      fs.writeFileSync(dataPath, JSON.stringify(postsToSave, null, 2));
    } catch (error) {
      console.error("Error saving posts:", error);
      throw new Error("Failed to save posts");
    }
  }
}
