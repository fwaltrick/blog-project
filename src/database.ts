import sqlite3 from "sqlite3";
import path from "path";
import type { Post, Posts } from "../types/model";

// Initialize database connection
const dbPath = path.join(__dirname, "../blog.db");
const db = new sqlite3.Database(dbPath);

// Get database instance
export function getDB(): sqlite3.Database {
  return db;
}

// Initialize database tables
export function initializeDB(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        `
        CREATE TABLE IF NOT EXISTS posts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          author TEXT NOT NULL,
          teaser TEXT,
          content TEXT,
          image TEXT,
          createdAt INTEGER NOT NULL
        )
      `,
        (err: Error | null) => {
          if (err) {
            reject(err);
          } else {
            console.log("Database initialized successfully");
            resolve();
          }
        },
      );
    });
  });
}

// Database functions for posts
export async function getAllPosts(): Promise<Post[]> {
  const db = getDB();
  return new Promise((resolve, reject) => {
    db.all<Post>(
      `SELECT * FROM posts ORDER BY createdAt DESC`,
      [],
      (err: Error | null, rows: Post[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      },
    );
  });
}

export async function getPostById(id: string): Promise<Post | undefined> {
  const db = getDB();
  return new Promise((resolve, reject) => {
    db.get<Post>(
      `SELECT * FROM posts WHERE id = ?`,
      [id],
      (err: Error | null, row: Post | undefined) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      },
    );
  });
}

export async function createPost(postData: Post): Promise<Post> {
  const db = getDB();
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO posts (title, author, teaser, content, image, createdAt)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        postData.title,
        postData.author,
        postData.teaser,
        postData.content,
        postData.image,
        postData.createdAt,
      ],
      function (err: Error | null) {
        if (err) {
          reject(err);
        } else {
          // Return the created post with the new ID
          getPostById(this.lastID.toString())
            .then((post) => {
              if (post) {
                resolve(post);
              } else {
                reject(new Error("Failed to retrieve created post"));
              }
            })
            .catch(reject);
        }
      },
    );
  });
}

export async function updatePost(
  id: string,
  postData: Post,
): Promise<Post | null> {
  const db = getDB();
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE posts 
       SET title = ?, author = ?, teaser = ?, content = ?, image = ?, createdAt = ?
       WHERE id = ?`,
      [
        postData.title,
        postData.author,
        postData.teaser,
        postData.content,
        postData.image,
        postData.createdAt,
        id,
      ],
      function (err: Error | null) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          resolve(null); // No rows affected = post not found
        } else {
          // Return the updated post
          getPostById(id)
            .then((post) => resolve(post || null))
            .catch(reject);
        }
      },
    );
  });
}

export async function deletePost(id: string): Promise<boolean> {
  const db = getDB();
  return new Promise((resolve, reject) => {
    db.run(
      `DELETE FROM posts WHERE id = ?`,
      [id],
      function (err: Error | null) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0); // Returns true if a row was deleted
        }
      },
    );
  });
}
