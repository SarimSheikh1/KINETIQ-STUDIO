import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowUpRight, ArrowLeft, Search } from "lucide-react";
import { useContent } from "../contexts/Content";
import NotFound from "./NotFound";
export default function Journal() {
  const { data } = useContent();
  const { slug } = useParams();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  useEffect(() => setPage(1), [search, category]);
  const article = data.articles.find((a: any) => a.slug === slug);
  if (slug) {
    if (!article) return <NotFound />;
    return (
      <section className="section article-page">
        <Link to="/journal" className="text-link">
          <ArrowLeft size={18} /> The journal
        </Link>
        <span className="eyebrow">
          {article.category} / ORIGINAL DEMO EDITORIAL
        </span>
        <h1 className="page-enter">{article.title}</h1>
        <p className="lead">{article.excerpt}</p>
        <img
          className="article-cover"
          src={article.coverImage}
          alt={`Graphic cover for ${article.title}`}
        />
        <div className="article-copy">
          {article.content.split("\n\n").map((p: string, i: number) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <h2>More food for thought.</h2>
        {data.articles
          .filter((a: any) => a.slug !== slug)
          .slice(0, 2)
          .map((a: any) => (
            <Link
              key={a.slug}
              className="journal-row"
              to={"/journal/" + a.slug}
            >
              <span>{a.category}</span>
              <h3>{a.title}</h3>
              <ArrowUpRight />
            </Link>
          ))}
      </section>
    );
  }
  const filtered = data.articles.filter(
    (a: any) =>
      (category === "All" || category === a.category) &&
      (a.title + " " + a.excerpt).toLowerCase().includes(search.toLowerCase()),
  );
  const pages = Math.ceil(filtered.length / 4);
  return (
    <section className="section">
      <span className="eyebrow page-enter">THE STUDIO JOURNAL</span>
      <h1 className="page-enter">
        A FEW THINGS
        <br />
        ON OUR <i>MIND.</i>
      </h1>
      <div className="journal-controls">
        <div className="filter-bar">
          {[
            "All",
            ...new Set<string>(data.articles.map((a: any) => a.category)),
          ].map((c) => (
            <button
              key={c}
              aria-pressed={category === c}
              className={category === c ? "selected" : ""}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <label className="search">
          <Search size={18} />
          <input
            aria-label="Search articles"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search the journal"
          />
        </label>
      </div>
      <div className="journal-grid">
        {filtered.slice((page - 1) * 4, page * 4).map((a: any) => (
          <Link
            className="article-card"
            key={a.slug}
            to={"/journal/" + a.slug}
            data-cursor="READ"
          >
            <div>
              <img
                src={a.coverImage}
                alt={`Original graphic for ${a.title}`}
                loading="lazy"
              />
            </div>
            <span className="eyebrow">{a.category} / 5 MIN READ</span>
            <h2>{a.title}</h2>
            <p>{a.excerpt}</p>
            <ArrowUpRight />
          </Link>
        ))}
      </div>
      {!filtered.length && (
        <p role="status">No notes match your search. Try another word.</p>
      )}
      <div className="pagination">
        {Array.from({ length: pages }, (_, i) => (
          <button
            key={i}
            aria-label={`Page ${i + 1}`}
            aria-current={page === i + 1 ? "page" : undefined}
            className={page === i + 1 ? "selected" : ""}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </section>
  );
}
