import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchArticles } from "../api/client";
import type { Article } from "../api/client";

export function ArticlesListPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchArticles();
        setArticles(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load articles.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return <p>Loading articles...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (articles.length === 0) {
    return <p>No articles found.</p>;
  }

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>Assimetria Auto-Generated Blog</h1>
      <p style={{ opacity: 0.7, marginBottom: "1.5rem" }}>
        Daily AI-generated technical articles.
      </p>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {articles.map((article) => (
          <li
            key={article.id}
            style={{
              marginBottom: "1.5rem",
              paddingBottom: "1rem",
              borderBottom: "1px solid #eee"
            }}
          >
            <h2 style={{ marginBottom: "0.25rem" }}>
              <Link to={`/articles/${article.id}`}>{article.title}</Link>
            </h2>
            <p style={{ fontSize: "0.8rem", opacity: 0.7 }}>
              {new Date(article.createdAt).toLocaleString()}
            </p>
            <p style={{ marginTop: "0.5rem" }}>
              {article.content.length > 220
                ? article.content.slice(0, 220) + "..."
                : article.content}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
