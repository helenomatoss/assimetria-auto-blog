import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

sqlite3.verbose();

// Resolve a stable path for the database file: backend/data/blog.db
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "..", "..", "data", "blog.db");

// Open (or create) the SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Failed to connect to SQLite database", err);
  } else {
    console.log("✅ Connected to SQLite database at", dbPath);
  }
});

export default db;
