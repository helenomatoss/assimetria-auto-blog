import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchArticleById } from "../api/client";
import type { Article } from "../api/client";

export function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        const data = await fetchArticleById(Number(id));
        setArticle(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load article.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) {
    return <p>Loading article...</p>;
  }

  if (error) {
    return (
      <div style={{ maxWidth: 800, margin: "2rem auto", padding: "0 1rem" }}>
        <p style={{ color: "red" }}>{error}</p>
        <Link to="/">← Back to articles</Link>
      </div>
    );
  }

  if (!article) {
    return (
      <div style={{ maxWidth: 800, margin: "2rem auto", padding: "0 1rem" }}>
        <p>Article not found.</p>
        <Link to="/">← Back to articles</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", padding: "0 1rem" }}>
      <Link to="/">← Back to articles</Link>
      <h1 style={{ marginTop: "1rem" }}>{article.title}</h1>
      <p style={{ fontSize: "0.8rem", opacity: 0.7 }}>
        {new Date(article.createdAt).toLocaleString()}
      </p>
      <div style={{ marginTop: "1rem", whiteSpace: "pre-line" }}>
        {article.content}
      </div>
    </div>
  );
}
