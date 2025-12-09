// frontend/src/pages/ArticleDetailPage.tsx
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Article } from "../api/client";
import { fetchArticleById } from "../api/client";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    const loadArticle = async () => {
      try {
        const numericId = Number(id);
        const data = await fetchArticleById(numericId);
        if (isMounted) {
          setArticle(data);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error(err);
          setError("Failed to load article. Please try again.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadArticle();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <main className="page">
      <header className="page-header article-detail-header">
        <div className="page-header-left">
          <Link to="/" className="back-link">
            ← Back to latest articles
          </Link>
          {article && (
            <>
              <h1 className="page-title article-detail-title">
                {article.title}
              </h1>
              <p className="article-meta">
                <span>{formatDate(article.createdAt)}</span>
                <span className="dot">•</span>
                <span>~3–5 min read</span>
              </p>
            </>
          )}
        </div>
      </header>

      {loading && (
        <section className="page-section">
          <div className="page-status">Loading article…</div>
        </section>
      )}

      {error && (
        <section className="page-section">
          <div className="page-status page-status-error">{error}</div>
        </section>
      )}

      {!loading && !error && article && (
        <section className="page-section">
          <article className="article-detail-card">
            {article.content.split("\n").map((paragraph, index) => (
              <p key={index} className="article-paragraph">
                {paragraph}
              </p>
            ))}
          </article>
        </section>
      )}
    </main>
  );
};

export default ArticleDetailPage;
