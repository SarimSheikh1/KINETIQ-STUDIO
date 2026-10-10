import { useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import { useContent } from "../contexts/Content";
import { api } from "../services/api";
import NotFound from "./NotFound";
export default function Careers() {
  const { data, live } = useContent();
  const { slug } = useParams();
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const role = data.positions.find((p: any) => p.slug === slug);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const body = {
        ...Object.fromEntries(new FormData(e.currentTarget)),
        position: role._id,
      };
      setStatus(
        (
          await api("/applications", {
            method: "POST",
            body: JSON.stringify(body),
          })
        ).message,
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  if (slug) {
    if (!role) return <NotFound />;
    return (
      <section className="section role-page">
        <Link to="/careers" className="text-link">
          <ArrowLeft /> All roles
        </Link>
        <span className="eyebrow">
          {role.sample ? "SAMPLE POSITION / " : ""}
          {role.department}
        </span>
        <h1 className="page-enter">{role.title}</h1>
        <span className="pill">{role.type}</span>
        <div className="contact-layout">
          <div>
            <h2>
              Make your
              <br />
              next move.
            </h2>
            <p>{role.description}</p>
            <h3>What you’ll bring</h3>
            <p>
              A considered portfolio, curiosity and a collaborative approach.
              Tell us how you think, what you make, and what you want to explore
              next.
            </p>
          </div>
          {status ? (
            <div className="success" role="status">
              <h2>YOU’RE IN.</h2>
              <p>{status}</p>
            </div>
          ) : (
            <form onSubmit={submit}>
              <h2>Introduce yourself.</h2>
              {role.sample && (
                <p className="notice">
                  This is a sample role. Applying creates a demo database
                  record, not a real job application.
                </p>
              )}
              <label>
                Full name *
                <input
                  name="applicantName"
                  required
                  minLength={2}
                  maxLength={200}
                  autoComplete="name"
                />
              </label>
              <label>
                Email *
                <input
                  name="email"
                  type="email"
                  required
                  maxLength={254}
                  autoComplete="email"
                />
              </label>
              <label>
                Portfolio URL *
                <input
                  name="portfolioUrl"
                  type="url"
                  pattern="https?://.*"
                  required
                  placeholder="https://"
                />
              </label>
              <label>
                Your story *
                <textarea
                  name="coverLetter"
                  required
                  minLength={30}
                  maxLength={5000}
                  rows={5}
                />
              </label>
              <label className="honeypot" aria-hidden="true">
                Website
                <input name="website" tabIndex={-1} />
              </label>
              {!live && (
                <p className="notice">
                  Connect and seed the API database to enable applications.
                </p>
              )}
              {error && (
                <p className="error" role="alert">
                  {error}
                </p>
              )}
              <button className="submit-btn" disabled={busy || !live}>
                {busy ? "Saving…" : "Submit application"}
                <ArrowUpRight />
              </button>
            </form>
          )}
        </div>
      </section>
    );
  }
  return (
    <section className="section">
      <span className="eyebrow page-enter">ROOM FOR ANOTHER PERSPECTIVE</span>
      <h1 className="page-enter">
        YOUR NEXT
        <br />
        <i>CREATIVE MOVE.</i>
      </h1>
      <p className="lead">
        Bring your curiosity. Make something meaningful.
        <br />
        Sample roles in our fictional studio.
      </p>
      <div className="benefits">
        {[
          [
            "Work from anywhere",
            "Our imagined team connects across places and perspectives.",
          ],
          [
            "Keep learning",
            "Time for experiments, conversations and new creative skills.",
          ],
          [
            "Make it together",
            "Designers, strategists and developers share the same table.",
          ],
        ].map(([title, copy]) => (
          <article key={title}>
            <span>✳</span>
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </div>
      <h2>
        OPEN POSSIBILITIES <sup>({data.positions.length})</sup>
      </h2>
      <div className="jobs">
        {data.positions.map((p: any) => (
          <Link to={"/careers/" + p.slug} key={p.slug}>
            <div>
              <span className="eyebrow">
                {p.sample ? "SAMPLE ROLE / " : ""}
                {p.department}
              </span>
              <h3>{p.title}</h3>
            </div>
            <span>{p.type}</span>
            <ArrowUpRight />
          </Link>
        ))}
      </div>
      <div className="faq">
        <h2>A FEW ANSWERS.</h2>
        {[
          [
            "Are these real vacancies?",
            "The seeded roles are sample positions for this fictional concept. Administrators can replace them with real listings and remove the sample flag.",
          ],
          [
            "Can I work remotely?",
            "The sample roles illustrate a distributed working model. Check each published role for its current requirements.",
          ],
          [
            "What should I include?",
            "A portfolio link and a short introduction are enough. Show us the thinking behind the work.",
          ],
        ].map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
