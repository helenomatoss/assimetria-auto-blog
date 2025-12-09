// frontend/src/api/client.ts
export interface Article {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not set");
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `API request failed with status ${response.status}: ${text}`
    );
  }
  return response.json();
}

export async function fetchArticles(): Promise<Article[]> {
  const data = (await handleResponse(
    await fetch(`${API_BASE_URL}/articles`)
  )) as Article[];

  // newest first (continua atendendo ao desafio "Latest")
  return data
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export async function fetchArticleById(
  id: number | string
): Promise<Article> {
  const data = (await handleResponse(
    await fetch(`${API_BASE_URL}/articles/${id}`)
  )) as Article;
  return data;
}
