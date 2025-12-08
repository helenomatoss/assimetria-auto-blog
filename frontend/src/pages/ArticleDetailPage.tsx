import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { type Article, fetchArticleById } from "../api/client";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function ArticleDetailPage() {
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

  return (
    <div className="article-layout">
      <Link to="/articles" className="back-link">
        ← Back to all articles
      </Link>

      {loading && <p className="state-message">Loading article…</p>}
      {error && <p className="state-message error">{error}</p>}

      {article && !loading && !error && (
        <>
          <header className="article-detail-header">
            <p className="page-kicker">Article</p>
            <h1 className="article-detail-title">{article.title}</h1>
            <div className="article-detail-meta">
              <span>{formatDate(article.createdAt)}</span>
              <span className="article-detail-meta-badge">
                Generated automatically
              </span>
            </div>
          </header>

          <div className="article-detail-body">
            {article.content.split("\n\n").map((block, idx) => (
              <p key={idx} style={{ marginBottom: "0.9em" }}>
                {block}
              </p>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ArticleDetailPage;
