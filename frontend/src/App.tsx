import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ArticlesListPage } from "./pages/ArticlesListPage";
import { ArticleDetailPage } from "./pages/ArticleDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ArticlesListPage />} />
        <Route path="/articles/:id" element={<ArticleDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
