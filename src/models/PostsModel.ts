import type { Post } from "../../types/model";
import slugify from "slugify";
import dayjs from "dayjs";
import postsData from "../../data/posts.json";
import fs from "fs";
import path from "path";
import { getDB } from "../db/database";

export class PostsModel {
  private static posts: Post[] = [];

  //   private static loadPosts(): Post[] {
  //     return postsData.map((post: any) => ({
  //       ...post,
  //       id: post.id || this.generateNextId(), // Generate sequential ID if it doesn't exist
  //       image: post.image ?? "",
  //       slug: slugify(post.title, { lower: true, strict: true }),
  //       formattedDate: dayjs(post.createdAt * 1000).format("MMMM D, YYYY"),
  //     }));
  //   }

  static async loadPosts(): Promise<void> {
    const db = getDB();
    return new Promise<void>((resolve, reject) => {
      db.all("SELECT * FROM posts", [], (err: Error | null, rows: Post[]) => {
        if (err) {
          reject(err);
        } else {
          // Map the rows to Post format
          const posts = rows.map((post) => ({
            ...post,
            id: post.id,
            image: post.image ?? "",
            slug: slugify(post.title, { lower: true, strict: true }),
            formattedDate: dayjs(Number(post.createdAt) * 1000).format(
              "MMMM D, YYYY",
            ),
          }));
          this.posts = posts;
          resolve();
        }
      });
    });
  }

  static getAllPosts(): Post[] {
    return this.posts;
  }

  static getPostBySlug(slug: string): Post | undefined {
    return this.posts.find((post) => post.slug === slug);
  }

  static getPostById(id: string): Post | undefined {
    return this.posts.find((post) => String(post.id) === id);
  }

  // REMOVIDO: versão antiga addPost
  static async addPost(postData: Post): Promise<Post> {
    const db = getDB();
    const createdAt = postData.createdAt
      ? Number(postData.createdAt)
      : Date.now();
    return new Promise<Post>(async (resolve, reject) => {
      db.run(
        `INSERT INTO posts (title, teaser, author, createdAt, image, content)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          postData.title,
          postData.teaser,
          postData.author,
          createdAt,
          postData.image ?? "",
          postData.content,
        ],
        async function (err: Error | null) {
          if (err) {
            reject(err);
          } else {
            await PostsModel.loadPosts();
            const newPost = PostsModel.posts.find(
              (p) =>
                p.id === (this.lastID ? this.lastID.toString() : undefined),
            );
            resolve(newPost!);
          }
        },
      );
    });
  }

  static async updatePost(id: string, postData: Post): Promise<Post | null> {
    const db = getDB();
    return new Promise<Post | null>(async (resolve, reject) => {
      db.run(
        `UPDATE posts SET title = ?, teaser = ?, author = ?, createdAt = ?, image = ?, content = ? WHERE id = ?`,
        [
          postData.title,
          postData.teaser,
          postData.author,
          postData.createdAt ? Number(postData.createdAt) : Date.now(),
          postData.image ?? "",
          postData.content,
          id,
        ],
        async function (err: Error | null) {
          if (err) {
            reject(err);
          } else {
            await PostsModel.loadPosts();
            const updatedPost = PostsModel.posts.find(
              (p) => String(p.id) === String(id),
            );
            resolve(updatedPost ?? null);
          }
        },
      );
    });
  }

  static async deletePost(id: string): Promise<boolean> {
    const db = getDB();
    return new Promise<boolean>(async (resolve, reject) => {
      db.run(
        `DELETE FROM posts WHERE id = ?`,
        [id],
        async function (err: Error | null) {
          if (err) {
            reject(false);
          } else {
            await PostsModel.loadPosts();
            resolve(true);
          }
        },
      );
    });
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
