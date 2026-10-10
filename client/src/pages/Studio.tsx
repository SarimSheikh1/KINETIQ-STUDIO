import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Plus, Minus, X } from "lucide-react";
import { useContent } from "../contexts/Content";
const services = [
  [
    "Creative strategy",
    "Find the idea worth building.",
    "Research, positioning, creative direction and a clear roadmap.",
  ],
  [
    "Branding & identity",
    "An identity with a point of view.",
    "Naming, visual systems, typography, guidelines and brand worlds.",
  ],
  [
    "Web design",
    "An experience worth exploring.",
    "Art direction, responsive interfaces and accessible interaction design.",
  ],
  [
    "Web development",
    "Beautiful ideas, built properly.",
    "React experiences, API integration, performance and maintainable systems.",
  ],
  [
    "3D experiences",
    "Add another dimension.",
    "Procedural sculpture, immersive storytelling and interactive WebGL.",
  ],
  [
    "Motion graphics",
    "Give your ideas a rhythm.",
    "Motion identities, animated campaigns and expressive transitions.",
  ],
  [
    "Digital product design",
    "Make the complex feel intuitive.",
    "Research, prototypes, design systems and product experiences.",
  ],
  [
    "UI/UX consulting",
    "A fresh perspective on the details.",
    "Experience audits, usability reviews and practical improvement plans.",
  ],
];
const steps = [
  [
    "Discover",
    "Ask better questions.",
    "We listen, research the landscape and challenge assumptions. A shared brief turns ambition into a clear direction.",
  ],
  [
    "Imagine",
    "Explore the unexpected.",
    "We sketch, write, experiment and prototype. The strongest ideas are tested early, while there is still room to change.",
  ],
  [
    "Design",
    "Make the idea tangible.",
    "We create an expressive visual system and shape an accessible experience. Each detail connects back to the central idea.",
  ],
  [
    "Develop",
    "Build with intention.",
    "Design and engineering move together. We test across screen sizes, optimise performance and refine the interaction.",
  ],
  [
    "Launch",
    "Put it into the world.",
    "We verify, document and hand over. Launch is the beginning of learning, with a plan for what happens next.",
  ],
];
export default function Studio({ kind }: { kind: string }) {
  const { data } = useContent();
  const [expanded, setExpanded] = useState<number | null>(0);
  const [member, setMember] = useState<any>(null);
  const [step, setStep] = useState(0);
  if (kind === "services")
    return (
      <section className="section">
        <span className="eyebrow page-enter">OUR CAPABILITIES</span>
        <h1 className="page-enter">
          IMAGINATION.
          <br />
          MEET <i>EXECUTION.</i>
        </h1>
        <p className="lead">
          From the first question to the final pixel.
          <br />
          One connected team, a world of possibilities.
        </p>
        <div className="service-list">
          {services.map(([title, subtitle, description], i) => (
            <article id={"service-" + i} key={title}>
              <button
                aria-expanded={expanded === i}
                aria-controls={"service-panel-" + i}
                onClick={() => setExpanded(expanded === i ? null : i)}
              >
                <span>0{i + 1}</span>
                <h2>{title}</h2>
                {expanded === i ? <Minus /> : <Plus />}
              </button>
              <AnimatePresence initial={false}>
                {expanded === i && (
                  <motion.div
                    id={"service-panel-" + i}
                    className="service-panel"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      duration: matchMedia("(prefers-reduced-motion: reduce)")
                        .matches
                        ? 0
                        : 0.3,
                    }}
                  >
                    <div className="service-shape">
                      {["✳", "↗", "◉", "⌘"][i % 4]}
                    </div>
                    <div>
                      <h3>{subtitle}</h3>
                      <p>{description}</p>
                      <Link to="/contact" className="text-link">
                        Let’s talk about {title.toLowerCase()}{" "}
                        <ArrowUpRight size={18} />
                      </Link>
                      <Link
                        to={
                          "/work/" +
                          data.projects[i % data.projects.length]?.slug
                        }
                        className="related-project"
                      >
                        Related concept:{" "}
                        {data.projects[i % data.projects.length]?.title}
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </article>
          ))}
        </div>
      </section>
    );
  if (kind === "process")
    return (
      <>
        <section className="section process-intro">
          <span className="eyebrow page-enter">HOW WE GET THERE</span>
          <h1 className="page-enter">
            FROM A SPARK.
            <br />
            TO <i>SOMETHING.</i>
          </h1>
          <p className="lead">
            A clear process. An open mind.
            <br />
            Enough room for the unexpected.
          </p>
          <div
            className="process-tabs"
            role="tablist"
            aria-label="Creative process"
          >
            {steps.map(([name], i) => (
              <button
                key={name}
                role="tab"
                aria-selected={step === i}
                aria-controls="process-panel"
                onClick={() => setStep(i)}
                className={step === i ? "active" : ""}
              >
                <span>0{i + 1}</span>
                {name}
              </button>
            ))}
          </div>
          <div className="process-panel" id="process-panel" role="tabpanel">
            <svg
              viewBox="0 0 300 200"
              className="process-drawing"
              aria-hidden="true"
            >
              <path
                d="M20 150C40 10 100 10 140 100S240 200 280 30"
                pathLength="1"
              />
              <circle cx={30 + step * 55} cy={100} r="20" />
            </svg>
            <div key={step}>
              <span className="eyebrow">
                0{step + 1} / {steps[step][0]}
              </span>
              <h2>{steps[step][1]}</h2>
              <p>{steps[step][2]}</p>
              <button
                className="text-link"
                onClick={() => setStep((step + 1) % 5)}
              >
                Next step <ArrowUpRight />
              </button>
            </div>
          </div>
        </section>
      </>
    );
  if (kind === "team")
    return (
      <section className="section">
        <span className="eyebrow page-enter">THE PEOPLE BEHIND THE IDEAS</span>
        <h1 className="page-enter">
          MANY MINDS.
          <br />
          ONE <i>ENERGY.</i>
        </h1>
        <p className="lead">
          Meet our fictional creative collective.
          <br />
          Original illustrated portraits, imagined people.
        </p>
        <div className="team-grid">
          {data.team.map((m: any) => (
            <button
              className="team-card"
              key={m.name}
              onClick={() => setMember(m)}
            >
              <div className="portrait">
                <img
                  src={m.image}
                  alt={`Illustration of fictional ${m.name}`}
                  loading="lazy"
                />
              </div>
              <div>
                <h3>{m.name}</h3>
                <ArrowUpRight />
              </div>
              <p>{m.role}</p>
            </button>
          ))}
        </div>
        {member && (
          <div className="modal-backdrop" onClick={() => setMember(null)}>
            <dialog
              open
              className="member-modal"
              aria-labelledby="member-title"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === "Escape") setMember(null);
              }}
            >
              <button
                autoFocus
                className="modal-close"
                aria-label="Close member details"
                onClick={() => setMember(null)}
              >
                <X />
              </button>
              <img src={member.image} alt="" />
              <span className="eyebrow">FICTIONAL TEAM MEMBER</span>
              <h2 id="member-title">{member.name}</h2>
              <h3>{member.role}</h3>
              <p>{member.biography}</p>
              <Link to="/contact" className="text-link">
                Work with us <ArrowUpRight />
              </Link>
            </dialog>
          </div>
        )}
      </section>
    );
  return (
    <>
      <section className="section about-intro">
        <span className="eyebrow page-enter">HELLO. WE’RE KINETIQ.</span>
        <h1 className="page-enter">
          A STUDIO WITH
          <br />A <i>RESTLESS</i>
          <br />
          IMAGINATION.
        </h1>
        <div className="about-graphic">
          <span>✳</span>
          <p>THINK / MAKE / MOVE</p>
        </div>
        <div className="two-columns">
          <h2>
            Independent minds.
            <br />
            Connected by craft.
          </h2>
          <div>
            <p>
              KINETIQ is an original fictional studio concept exploring the
              space where strategy, design and technology meet. We believe great
              work begins with curiosity and grows through collaboration.
            </p>
            <p>
              Our mission is simple: turn ambitious ideas into experiences
              people can feel. This website presents imagined projects, people
              and positions, rather than claims about a real agency.
            </p>
          </div>
        </div>
      </section>
      <section className="section values-section">
        <span className="eyebrow">WHAT MOVES US</span>
        {[
          [
            "Curiosity first.",
            "Ask the next question. Look beyond the obvious.",
          ],
          [
            "Craft always.",
            "Care about the details that people notice — and the ones they feel.",
          ],
          [
            "Together, better.",
            "Invite different perspectives. Make the work a shared adventure.",
          ],
          [
            "Leave room for play.",
            "Experiment with purpose. Let surprise become part of the process.",
          ],
        ].map(([title, copy], i) => (
          <div className="value-row" key={title} data-reveal>
            <span>0{i + 1}</span>
            <h2>{title}</h2>
            <p>{copy}</p>
          </div>
        ))}
      </section>
      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">OUR IMAGINED STORY</span>
            <h2>
              ALWAYS
              <br />
              IN <i>PROGRESS.</i>
            </h2>
          </div>
          <p>A fictional history, created for this concept.</p>
        </div>
        <div className="history-grid">
          {[
            [
              "2022",
              "A shared sketchbook",
              "Four curious minds and a belief in connected creative work.",
            ],
            [
              "2024",
              "A wider canvas",
              "From identity to interactive worlds, our imagined practice grows.",
            ],
            [
              "2026",
              "Still asking questions",
              "A studio concept built around experimentation and thoughtful craft.",
            ],
          ].map(([year, title, copy]) => (
            <article key={year}>
              <span>{year}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
        <Link to="/team" className="pill">
          Meet the minds <ArrowUpRight />
        </Link>
      </section>
    </>
  );
}
