import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import articlesRouter from "./routes/articles.js";
import { initializeDatabase } from "./models/articleModel.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Article routes
app.use("/articles", articlesRouter);

// Simple health check route
app.get("/", (req, res) => {
  res.json({ message: "Assimetria Blog API is running" });
});

// Initialize database first, then start the server
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log("✅ Database initialized");
      console.log(`✅ Backend listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to initialize database", err);
    process.exit(1);
  });
