import { Router } from "express";
import {
  getAllArticles,
  getArticleById
} from "../models/articleModel.js";

const router = Router();

// GET /articles - list all articles
router.get("/", async (req, res) => {
  try {
    const articles = await getAllArticles();
    res.json(articles);
  } catch (err) {
    console.error("Error fetching articles", err);
    res.status(500).json({ error: "Failed to fetch articles" });
  }
});

// GET /articles/:id - get a single article
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid article id" });
    }

    const article = await getArticleById(id);

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    res.json(article);
  } catch (err) {
    console.error("Error fetching article by id", err);
    res.status(500).json({ error: "Failed to fetch article" });
  }
});

export default router;
