import fs from "fs";
import path from "path";
import sqlite3 from "sqlite3";
import sanitizeHtml from "sanitize-html";

const db = new sqlite3.Database(path.join(__dirname, "../blog.db"));
const posts = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/posts.json"), "utf-8"),
);

db.serialize(() => {
  posts.forEach((post: any) => {
    const cleanContent = sanitizeHtml(post.content);
    db.run(
      `INSERT OR IGNORE INTO posts (id, title, author, teaser, content, image, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        post.id,
        post.title,
        post.author,
        post.teaser,
        cleanContent,
        post.image,
        post.createdAt,
      ],
    );
  });
});

db.close();
console.log("Fiinished importing posts into the database.");
