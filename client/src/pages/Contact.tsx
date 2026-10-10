import { useState, type FormEvent } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { api } from "../services/api";
export default function Contact() {
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const body = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const result = await api("/contact", {
        method: "POST",
        body: JSON.stringify(body),
      });
      setStatus(result.message);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="section contact-page">
      <span className="eyebrow page-enter">LET’S START SOMETHING</span>
      <h1 className="page-enter">
        HAVE SOMETHING
        <br />
        <i>EXTRAORDINARY</i>
        <br />
        IN MIND?
      </h1>
      <div className="contact-layout">
        <div>
          <p className="lead">
            A big idea. A small question.
            <br />
            We’d love to hear it.
          </p>
          <span className="contact-symbol">↗</span>
          <p className="muted">
            This is a demo studio. Submissions are saved
            <br />
            to the configured database, not sent by email.
          </p>
        </div>
        {status ? (
          <div className="success" role="status">
            <Check size={44} />
            <h2>
              GOOD THINGS
              <br />
              ARE IN MOTION.
            </h2>
            <p>{status}</p>
            <button className="pill" onClick={() => setStatus("")}>
              Send another enquiry
            </button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="form-grid">
              <label>
                Full name *
                <input
                  name="name"
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={200}
                  placeholder="Your name"
                />
              </label>
              <label>
                Email *
                <input
                  name="email"
                  autoComplete="email"
                  type="email"
                  required
                  maxLength={254}
                  placeholder="you@company.com"
                />
              </label>
              <label>
                Company
                <input
                  name="company"
                  autoComplete="organization"
                  maxLength={200}
                  placeholder="Where you work"
                />
              </label>
              <label>
                Project type *
                <select name="projectType" required defaultValue="">
                  <option value="" disabled>
                    Select a direction
                  </option>
                  {[
                    "Brand identity",
                    "Website",
                    "Digital product",
                    "Motion",
                    "3D experience",
                    "Something else",
                  ].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label className="full">
                Estimated budget *
                <select name="budgetRange" required defaultValue="">
                  <option value="" disabled>
                    A rough idea is fine
                  </option>
                  {[
                    "Under $10,000",
                    "$10,000–$25,000",
                    "$25,000–$50,000",
                    "$50,000+",
                    "Let’s discuss",
                  ].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label className="full">
                Tell us about the idea *
                <textarea
                  name="message"
                  minLength={20}
                  maxLength={5000}
                  required
                  placeholder="The ambition, the challenge, the possibilities…"
                  rows={4}
                />
              </label>
            </div>
            <label className="honeypot" aria-hidden="true">
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
            <p className="form-note">
              Submitting stores these details for review by the studio
              administrator. Please avoid sensitive personal information.
            </p>
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            <button className="submit-btn" disabled={busy}>
              {busy ? "Sending your idea…" : "Send your idea"}
              <ArrowUpRight />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
