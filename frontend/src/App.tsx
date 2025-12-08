import { BrowserRouter, Routes, Route } from "react-router-dom";
import ArticlesListPage from "./pages/ArticlesListPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="app-header">
          <div className="app-header-inner">
            <div>
              <div className="app-title">
                <span className="app-title-gradient">Assimetria</span>
                <span className="app-title-pill">Auto-generated blog</span>
              </div>
              <p className="app-subtitle">
                Daily AI-generated tech articles — React, Node, Docker & AWS.
              </p>
            </div>
          </div>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<ArticlesListPage />} />
            <Route path="/articles/:id" element={<ArticleDetailPage />} />
          </Routes>
        </main>

        <footer className="app-footer">
          Powered by AI · React · Node.js · Docker · AWS
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;