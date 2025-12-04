import cron from "node-cron";
import { generateArticle } from "./aiClient.js";
import { createArticle, getAllArticles } from "../models/articleModel.js";

/**
 * Generates a single article using AI and saves it to the database.
 */
export async function generateAndSaveArticle(topic) {
  console.log("🧠 Generating new article via AI...");

  try {
    const articleData = await generateArticle(topic);
    const saved = await createArticle(articleData);

    console.log(
      `✅ New article saved with id=${saved.id} and title="${saved.title}"`
    );

    return saved;
  } catch (err) {
    console.error("❌ Failed to generate and save article:", err);
    throw err;
  }
}

/**
 * Ensures there are at least 3 articles in the database.
 * If there are fewer, generates the missing ones using AI.
 */
export async function ensureMinimumArticles(minCount = 3) {
  const articles = await getAllArticles();
  const currentCount = articles.length;

  if (currentCount >= minCount) {
    console.log(
      `ℹ️ Database already has ${currentCount} articles (>= ${minCount}).`
    );
    return;
  }

  console.log(
    `ℹ️ Only ${currentCount} article(s) found. Generating ${
      minCount - currentCount
    } more via AI...`
  );

  const missing = minCount - currentCount;

  for (let i = 0; i < missing; i++) {
    await generateAndSaveArticle();
  }

  console.log("✅ Minimum number of articles ensured.");
}

/**
 * Starts a cron job that generates 1 new article per day.
 * Example schedule: every day at 03:00 server time.
 */
export function startArticleJob() {
  console.log("⏰ Starting daily article generation job...");

  // Runs every day at 03:00 (server local time)
  cron.schedule("0 3 * * *", async () => {
    console.log("⏰ Cron triggered: generating daily article...");
    try {
      await generateAndSaveArticle();
    } catch (err) {
      console.error("❌ Error in scheduled article generation:", err);
    }
  });
}
