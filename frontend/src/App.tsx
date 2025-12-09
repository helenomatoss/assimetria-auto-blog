// frontend/src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ArticlesListPage from "./pages/ArticlesListPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";

function App() {
  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <div className="app-shell__header-inner">
          <div className="brand">
            <div className="brand__logo" />
            <div className="brand__text">
              <div className="brand__name">Assimetria</div>
              <div className="brand__badge">
                <span className="brand__badge-dot" />
                Auto-generated blog
              </div>
            </div>
          </div>

          <div className="app-shell__header-meta">
            <div>Daily AI-generated tech articles</div>
            <div>React · Node · Docker · AWS</div>
          </div>
        </div>
      </header>

      <main className="app-shell__main">
        <div className="app-shell__main-inner">
          <Router>
            <Routes>
              <Route path="/" element={<ArticlesListPage />} />
              <Route path="/articles/:id" element={<ArticleDetailPage />} />
            </Routes>
          </Router>
        </div>
      </main>
    </div>
  );
}

export default App;
