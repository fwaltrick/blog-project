import express from "express";
import nunjucks from "nunjucks";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import { routes } from "./routes";
import { connectDB } from "./db/database";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true })); // For form data
app.use(express.json()); // For JSON data

// For static files like CSS, JS, images
app.use(express.static(path.join(__dirname, "..", "public")));

// Set up Nunjucks templating engine
nunjucks.configure(path.join(__dirname, "..", "views"), {
  autoescape: true,
  express: app,
});

app.set("view engine", "njk");

// Initialize database connection
connectDB()
  .then(() => {
    // Routes
    app.use("/", routes);

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err);
    process.exit(1);
  });
