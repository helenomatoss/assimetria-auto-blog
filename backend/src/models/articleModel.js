import db from "./db.js";

// Helper to run db.run as a Promise
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        return reject(err);
      }
      resolve(this); // 'this' has lastID, changes, etc.
    });
  });
}

// Helper to run db.get as a Promise
function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        return reject(err);
      }
      resolve(row);
    });
  });
}

// Helper to run db.all as a Promise
function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

// Create articles table if it does not exist
export async function createArticlesTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `;
  await run(sql);
}

// Seed initial 3 articles if the table is empty
export async function seedInitialArticlesIfEmpty() {
  const row = await get("SELECT COUNT(*) as count FROM articles");
  const count = row?.count ?? 0;

  if (count > 0) {
    console.log(`ℹ️ Articles table already has ${count} rows. Skipping seed.`);
    return;
  }

  console.log("🌱 Seeding initial articles...");

  const now = new Date().toISOString();

  const initialArticles = [
    {
      title: "Getting started with the Assimetria auto-generated blog",
      content:
        "This is the first automatically seeded article. It explains the purpose of this technical challenge and how the system works.",
      createdAt: now
    },
    {
      title: "How the daily AI-generated articles work",
      content:
        "This article describes how the backend will use an AI provider to generate one new article per day using a scheduled job.",
      createdAt: now
    },
    {
      title: "Infrastructure overview: React, Node, Docker and AWS",
      content:
        "This article gives a high-level overview of the stack: React on the frontend, Node.js on the backend, Docker for containers and AWS for deployment.",
      createdAt: now
    }
  ];

  for (const article of initialArticles) {
    await createArticle(article);
  }

  console.log("✅ Seeded 3 initial articles.");
}

// Public function to be called on startup
export async function initializeDatabase() {
  await createArticlesTable();
  await seedInitialArticlesIfEmpty();
}

// CRUD-like helpers

export async function getAllArticles() {
  const sql = `
    SELECT
      id,
      title,
      content,
      created_at AS createdAt
    FROM articles
    ORDER BY datetime(created_at) DESC
  `;
  const rows = await all(sql);
  return rows;
}

export async function getArticleById(id) {
  const sql = `
    SELECT
      id,
      title,
      content,
      created_at AS createdAt
    FROM articles
    WHERE id = ?
  `;
  const row = await get(sql, [id]);
  return row;
}

export async function createArticle({ title, content, createdAt }) {
  const sql = `
    INSERT INTO articles (title, content, created_at)
    VALUES (?, ?, ?)
  `;
  const result = await run(sql, [title, content, createdAt]);
  return {
    id: result.lastID,
    title,
    content,
    createdAt
  };
}
