// src/api/client.ts
export interface Article {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `API request failed with status ${response.status}: ${text}`
    );
  }
  return response.json() as Promise<T>;
}

export async function fetchArticles(): Promise<Article[]> {
  const res = await fetch(`${API_BASE_URL}/articles`);
  return handleResponse<Article[]>(res);
}

export async function fetchArticleById(id: number): Promise<Article> {
  const res = await fetch(`${API_BASE_URL}/articles/${id}`);
  return handleResponse<Article>(res);
}
