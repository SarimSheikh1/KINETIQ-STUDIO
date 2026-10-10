import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { ArrowUpRight, Plus, Minus } from "lucide-react";
import { Cursor, Intro, MotionSystem } from "../animations/Experience";
export default function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="progress" />
      <Intro />
      <Cursor />
      <MotionSystem />
      <header>
        <Link className="wordmark" to="/" onClick={() => setOpen(false)}>
          KINETIQ<span className="brand-star">✳</span>
          <small>STUDIO®</small>
        </Link>
        <nav className="desktop-nav">
          <NavLink to="/work">Work</NavLink>
          <NavLink to="/about">Studio</NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/journal">Journal</NavLink>
        </nav>
        <div className="header-actions">
          <Link className="talk-link" to="/contact">
            Let’s talk <ArrowUpRight size={16} />
          </Link>
          <button
            className="menu-toggle"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <Minus /> : <Plus />}
          </button>
        </div>
      </header>
      {open && (
        <nav className="menu" aria-label="All pages">
          {[
            "Work",
            "About",
            "Services",
            "Process",
            "Team",
            "Journal",
            "Careers",
            "Contact",
          ].map((n, i) => (
            <Link
              key={n}
              to={"/" + n.toLowerCase()}
              onClick={() => setOpen(false)}
            >
              <small>0{i + 1}</small>
              {n}
              <ArrowUpRight />
            </Link>
          ))}
        </nav>
      )}
      <main id="main" key={location.pathname}>
        <Outlet />
      </main>
      <footer>
        <div className="footer-top">
          <span className="eyebrow">
            GOOD THINGS START WITH A CONVERSATION.
          </span>
          <Link to="/contact" className="footer-cta">
            LET’S MAKE
            <br />
            SOME <i>MOVE.</i>
            <ArrowUpRight />
          </Link>
        </div>
        <div className="footer-bottom">
          <Link className="wordmark" to="/">
            KINETIQ✳
          </Link>
          <div>
            <Link to="/team">Team</Link>
            <Link to="/careers">Careers</Link>
            <Link to="/process">Our process</Link>
            <Link to="/admin">Admin</Link>
          </div>
          <span>
            © 2026 KINETIQ STUDIO
            <br />
            Independent fictional studio / Demo concept
          </span>
        </div>
      </footer>
    </>
  );
}
