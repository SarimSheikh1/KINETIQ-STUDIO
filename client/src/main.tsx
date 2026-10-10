import React, { Suspense, lazy, Component, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import { ContentProvider } from "./contexts/Content";
import "./styles/global.css";
const Home = lazy(() => import("./pages/Home"));
const Work = lazy(() => import("./pages/Work"));
const Studio = lazy(() => import("./pages/Studio"));
const Journal = lazy(() => import("./pages/Journal"));
const Careers = lazy(() => import("./pages/Careers"));
const Contact = lazy(() => import("./pages/Contact"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));
class Boundary extends Component<{ children: ReactNode }, { error: boolean }> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <div className="section">
        <h1>Let’s try that again.</h1>
        <p>The experience could not load.</p>
        <button onClick={() => location.reload()}>Reload page</button>
      </div>
    ) : (
      this.props.children
    );
  }
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Boundary>
      <BrowserRouter>
        <ContentProvider>
          <Suspense
            fallback={
              <div className="route-loading" role="status">
                KINETIQ <span>Loading experience…</span>
              </div>
            }
          >
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="work" element={<Work />} />
                <Route path="work/:slug" element={<Work />} />
                {["about", "services", "process", "team"].map((page) => (
                  <Route
                    key={page}
                    path={page}
                    element={<Studio kind={page} />}
                  />
                ))}
                <Route path="journal" element={<Journal />} />
                <Route path="journal/:slug" element={<Journal />} />
                <Route path="careers" element={<Careers />} />
                <Route path="careers/:slug" element={<Careers />} />
                <Route path="contact" element={<Contact />} />
                <Route path="admin" element={<Admin />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </ContentProvider>
      </BrowserRouter>
    </Boundary>
  </React.StrictMode>,
);
