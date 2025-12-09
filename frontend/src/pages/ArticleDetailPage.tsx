import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { type Article, fetchArticleById } from "../api/client";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB");
}

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        setLoading(true);
        const data = await fetchArticleById(id);
        setArticle(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load article.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <main className="max-w-3xl mx-auto py-16 text-slate-300">
        Loading article...
      </main>
    );
  }

  if (error || !article) {
    return (
      <main className="max-w-3xl mx-auto py-16 text-red-400">
        {error ?? "Article not found."}
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto py-12 space-y-6">
      <Link
        to="/"
        className="inline-flex text-xs text-sky-300 hover:text-sky-200"
      >
        ← Back to all articles
      </Link>

      <header className="space-y-3">
        <p className="text-xs text-slate-400">
          {formatDate(article.createdAt)} • ~3–5 min read
        </p>
        <h1 className="text-3xl font-semibold text-slate-50">
          {article.title}
        </h1>
      </header>

      <article className="text-slate-100 whitespace-pre-line text-sm leading-relaxed">
        {article.content}
      </article>
    </main>
  );
}
