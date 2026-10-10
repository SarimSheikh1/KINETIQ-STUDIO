import { Component, lazy, Suspense, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useContent } from "../contexts/Content";
import Art from "../components/Art";
const Sculpture = lazy(() => import("../three/Sculpture"));
class SculptureBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="fallback-sculpture">✳</div>
    ) : (
      this.props.children
    );
  }
}
export default function Home() {
  const { data } = useContent();
  const [scene] = useState(
    () =>
      innerWidth > 760 &&
      !matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  return (
    <>
      <section className="hero">
        <div className="hero-meta page-enter">
          <span>
            <b className="status-dot" /> INDEPENDENT CREATIVE STUDIO
          </span>
          <span>STRATEGY · DESIGN · TECHNOLOGY</span>
          <span>BASED EVERYWHERE. THINKING BEYOND.</span>
        </div>
        <div className="hero-title">
          <h1 className="page-enter">
            <span className="hero-word">IDEAS</span>{" "}
            <span className="hero-word">THAT</span>
            <br />
            <span className="move-line">
              MOVE<span className="hero-outline">↗</span>
            </span>
            <br />
            <i>PEOPLE.</i>
          </h1>
          <div className="sculpture-wrap">
            {scene ? (
              <SculptureBoundary>
                <Suspense
                  fallback={<div className="fallback-sculpture">✳</div>}
                >
                  <Sculpture />
                </Suspense>
              </SculptureBoundary>
            ) : (
              <div className="fallback-sculpture">✳</div>
            )}
            <span className="sculpture-label">FIG. 01 — AN IDEA IN MOTION</span>
            <svg className="orbit" viewBox="0 0 400 400" aria-hidden="true">
              <circle cx="200" cy="200" r="175" />
              <path d="M10 200H390M200 10V390" />
            </svg>
          </div>
        </div>
        <div className="hero-bottom page-enter">
          <a className="scroll-hint" href="#selected">
            <ArrowDown size={20} /> SCROLL TO EXPLORE
          </a>
          <p>
            We turn ambitious ideas into
            <br />
            remarkable digital experiences.
          </p>
          <Link
            to="/work"
            className="round-link"
            aria-label="Explore selected work"
          >
            <ArrowUpRight size={34} />
          </Link>
        </div>
        <div className="hero-baseline">
          <span>WE MAKE THE DIGITAL WORLD MOVE.</span>
          <span>© STUDIO / 2026</span>
        </div>
      </section>
      <div className="ticker" aria-hidden="true">
        <div>
          GOOD IDEAS DON’T STAND STILL. ✳ GOOD IDEAS DON’T STAND STILL. ✳ GOOD
          IDEAS DON’T STAND STILL. ✳{" "}
        </div>
      </div>
      <section id="selected" className="section work-section">
        <div className="section-heading" data-reveal>
          <div>
            <span className="eyebrow">01 / SELECTED WORK</span>
            <h2>
              A LITTLE LESS
              <br />
              EXPECTED.
            </h2>
          </div>
          <p>
            Different worlds. Shared ambition.
            <br />A selection of fictional projects
            <br />
            from our ever-curious studio.
          </p>
        </div>
        <div className="home-work-grid">
          {data.projects
            .filter((p: any) => p.featured)
            .slice(0, 4)
            .map((p: any, i: number) => (
              <Link
                to={"/work/" + p.slug}
                key={p.slug}
                className={"project-link project-" + i}
                data-cursor="VIEW"
                data-reveal
              >
                <Art project={p} />
                <div className="project-caption">
                  <h3>{p.title}</h3>
                  <span>
                    {p.category} / 2026 <ArrowUpRight size={19} />
                  </span>
                </div>
                <p>{p.summary}</p>
              </Link>
            ))}
        </div>
        <Link to="/work" className="text-link">
          Explore all projects <ArrowUpRight />
        </Link>
      </section>
      <section className="philosophy">
        <span className="eyebrow">02 / A RESTLESS POINT OF VIEW</span>
        <h2 className="future-word">
          WE DON’T
          <br />
          FOLLOW
          <br />
          THE FUTURE.
        </h2>
        <h2 className="design-word">
          WE <i>DESIGN</i> IT.<span>✳</span>
        </h2>
        <div className="philosophy-bottom">
          <p>
            Part thinkers. Part makers. Entirely curious.
            <br />
            We connect strategy, design and technology
            <br />
            to make things that matter.
          </p>
          <Link to="/about" className="pill light">
            Meet the studio <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
      <section className="section services-home">
        <div className="section-heading" data-reveal>
          <div>
            <span className="eyebrow">03 / WHAT WE BRING TO THE TABLE</span>
            <h2>
              BIG THINKING.
              <br />
              <i>DEEP</i> CRAFT.
            </h2>
          </div>
          <Link className="text-link" to="/services">
            Our capabilities <ArrowUpRight />
          </Link>
        </div>
        <div
          className="service-strip"
          data-cursor="DRAG"
          tabIndex={0}
          aria-label="Scroll through capabilities"
        >
          {[
            "Brand identity",
            "Creative development",
            "Digital experiences",
            "Interactive 3D",
            "Motion design",
            "Product design",
          ].map((s, i) => (
            <Link to={"/services#service-" + i} key={s} className="capability">
              <span>0{i + 1} / CAPABILITY</span>
              <div className={"cap-symbol symbol-" + i}>
                {["✳", "↗", "◉", "⌘", "≈", "⊞"][i]}
              </div>
              <h3>{s}</h3>
              <ArrowUpRight />
            </Link>
          ))}
        </div>
      </section>
      <section className="impact section">
        <div data-reveal>
          <span className="eyebrow">04 / FROM IDEA TO IMPACT</span>
          <h2>
            SMALL STUDIO.
            <br />
            BOUNDLESS ENERGY.
          </h2>
          <p>Illustrative studio metrics. These are fictional demo values.</p>
        </div>
        <div className="stats">
          <div>
            <strong data-counter="32">32</strong>
            <span>Imagined collaborations</span>
          </div>
          <div>
            <strong data-counter="12">12</strong>
            <span>Creative disciplines</span>
          </div>
          <div>
            <strong data-counter="100">100</strong>
            <span>Percent curiosity</span>
          </div>
        </div>
        <Link to="/process" className="text-link">
          See how we work <ArrowUpRight />
        </Link>
      </section>
      <section className="section journal-preview">
        <div className="section-heading">
          <div>
            <span className="eyebrow">05 / NOTES FROM THE STUDIO</span>
            <h2>
              THINKING
              <br />
              OUT <i>LOUD.</i>
            </h2>
          </div>
          <Link to="/journal" className="text-link">
            Read the journal <ArrowUpRight />
          </Link>
        </div>
        {data.articles.slice(0, 2).map((a: any) => (
          <Link
            className="journal-row"
            to={"/journal/" + a.slug}
            key={a.slug}
            data-reveal
          >
            <span>{a.category}</span>
            <h3>{a.title}</h3>
            <ArrowUpRight />
          </Link>
        ))}
      </section>
    </>
  );
}
