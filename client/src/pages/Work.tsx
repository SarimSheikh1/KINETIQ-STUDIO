import { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import { useContent } from "../contexts/Content";
import Art from "../components/Art";
import NotFound from "./NotFound";
gsap.registerPlugin(Flip);
export default function Work() {
  const { data } = useContent();
  const { slug } = useParams();
  const [filter, setFilter] = useState("All");
  const grid = useRef<HTMLDivElement>(null);
  const project = data.projects.find((p: any) => p.slug === slug);
  const filterBy = (v: string) => {
    const state = Flip.getState(grid.current?.children || []);
    setFilter(v);
    requestAnimationFrame(() => {
      if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
        Flip.from(state, {
          duration: 0.6,
          absolute: true,
          ease: "power2.inOut",
        });
    });
  };
  if (slug) {
    if (!project) return <NotFound />;
    const next =
      data.projects[
        (data.projects.indexOf(project) + 1) % data.projects.length
      ];
    return (
      <>
        <section className="section case-intro">
          <Link className="text-link" to="/work">
            <ArrowLeft size={18} /> All work
          </Link>
          <span className="eyebrow page-enter">
            CONCEPT CASE STUDY / {project.category} / 2026
          </span>
          <h1 className="page-enter">{project.title}</h1>
          <div className="case-summary">
            <h2>{project.summary}</h2>
            <p>{project.description}</p>
          </div>
        </section>
        <div className="case-cover">
          <Art project={project} />
        </div>
        <section className="section case-body">
          <span className="eyebrow">THE CHALLENGE</span>
          <h2 data-reveal>
            MAKE THE FAMILIAR
            <br />
            FEEL <i>UNFAMILIAR.</i>
          </h2>
          <div className="two-columns">
            <p>
              Our brief was to give {project.title} an unmistakable point of
              view. This original fictional concept explores how a clear idea
              can travel across identity, experience and motion.
            </p>
            <p>
              We started with the audience, found the central tension and
              translated it into a visual system. Every interaction and every
              composition grows from that single thought.
            </p>
          </div>
          <div className="case-details">
            <div>
              <span>DISCIPLINES</span>
              <p>
                Creative strategy
                <br />
                {project.category}
                <br />
                Art direction
                <br />
                Motion system
              </p>
            </div>
            <div>
              <span>THE APPROACH</span>
              <p>Discover → Imagine → Design → Develop → Launch</p>
            </div>
            <div>
              <span>PROJECT TYPE</span>
              <p>
                Fictional studio concept
                <br />
                Original procedural artwork
              </p>
            </div>
          </div>
          <div className="case-gallery" data-cursor="DRAG" tabIndex={0}>
            {[0, 1, 2].map((i) => (
              <Art key={i} project={project} className={"variant-" + i} />
            ))}
          </div>
          <h2 data-reveal>
            A SYSTEM WITH
            <br />
            ROOM TO <i>MOVE.</i>
          </h2>
          <p className="reading-width">
            Rather than relying on a single static expression, the concept
            combines a recognisable typographic core with a flexible graphic
            language. The gallery above shows how a consistent idea adapts to
            different formats.
          </p>
        </section>
        <Link to={"/work/" + next.slug} className="next-project">
          <span>NEXT CONCEPT</span>
          <h2>
            {next.title}
            <ArrowUpRight />
          </h2>
        </Link>
      </>
    );
  }
  return (
    <section className="section">
      <span className="eyebrow page-enter">OUR WORK / OUR WORLD</span>
      <h1 className="page-enter">
        MADE TO
        <br />
        <i>MAKE A MARK.</i>
      </h1>
      <div className="filter-bar" aria-label="Project categories">
        {["All", "Branding", "Digital", "Experience", "Motion"].map((c) => (
          <button
            key={c}
            className={c === filter ? "selected" : ""}
            aria-pressed={c === filter}
            onClick={() => filterBy(c)}
          >
            {c}
            {c === "All" && <sup> {data.projects.length}</sup>}
          </button>
        ))}
        <span>FICTIONAL CONCEPT PROJECTS</span>
      </div>
      <div className="portfolio-grid" ref={grid}>
        {data.projects
          .filter((p: any) => filter === "All" || p.category === filter)
          .map((p: any) => (
            <Link
              key={p.slug}
              to={"/work/" + p.slug}
              className="project-link"
              data-cursor="VIEW"
            >
              <Art project={p} />
              <div className="project-caption">
                <h3>{p.title}</h3>
                <span>
                  {p.category}
                  <ArrowUpRight size={20} />
                </span>
              </div>
              <p>{p.summary}</p>
            </Link>
          ))}
      </div>
      {!data.projects.length && <p>No published projects yet.</p>}
    </section>
  );
}
