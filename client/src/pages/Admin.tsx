import { useEffect, useState, type FormEvent } from "react";
import { Plus, LogOut, Trash2, Pencil, Upload, X } from "lucide-react";
import { api } from "../services/api";
import { useContent } from "../contexts/Content";
const defaults: Record<string, any> = {
  projects: {
    title: "",
    slug: "",
    category: "Branding",
    summary: "",
    description: "",
    color: "#C7B8FF",
    media: [],
    featured: false,
    displayOrder: 0,
    published: false,
  },
  articles: {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "/images/monoform.svg",
    category: "Design",
    status: "draft",
    publishedAt: new Date().toISOString(),
  },
  team: {
    name: "",
    role: "",
    biography: "",
    image: "/images/portrait-0.svg",
    displayOrder: 0,
  },
  positions: {
    title: "",
    slug: "",
    department: "Design",
    type: "Remote / Full-time",
    description: "",
    status: "open",
    sample: false,
  },
};
const labels: Record<string, string> = {
  projects: "Projects",
  articles: "Journal",
  team: "Team",
  positions: "Careers",
  enquiries: "Enquiries",
  applications: "Applications",
};
export default function Admin() {
  const { reload } = useContent();
  const [user, setUser] = useState<any>(null);
  const [csrf, setCsrf] = useState("");
  const [ready, setReady] = useState(false);
  const [module, setModule] = useState("overview");
  const [records, setRecords] = useState<any[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [edit, setEdit] = useState<any>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    api("/auth/me")
      .then((r) => {
        setUser(r.user);
        setCsrf(r.csrf);
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);
  async function load() {
    setLoading(true);
    setError("");
    try {
      if (module === "overview") {
        const results = await Promise.all(
          Object.keys(labels).map(async (k) => [
            k,
            (await api("/admin/" + k)).length,
          ]),
        );
        setCounts(Object.fromEntries(results));
      } else setRecords(await api("/admin/" + module));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (user) void load();
  }, [user, module]);
  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const r = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
      });
      setUser(r.user);
      setCsrf(r.csrf);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function mutate(path: string, method: string, body?: any) {
    return api(path, {
      method,
      headers: { "x-csrf-token": csrf },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  }
  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const base = defaults[module];
      const body = Object.fromEntries(
        Object.keys(base).map((k) => [k, edit[k]]),
      );
      await mutate(
        "/admin/" + module + (edit._id ? "/" + edit._id : ""),
        edit._id ? "PATCH" : "POST",
        body,
      );
      setEdit(null);
      setNotice("Changes saved.");
      reload();
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function remove(r: any) {
    if (!confirm(`Delete ${r.title || r.name}? This cannot be undone.`)) return;
    setError("");
    try {
      await mutate(`/admin/${module}/${r._id}`, "DELETE");
      setNotice("Record deleted.");
      reload();
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  }
  async function updateStatus(r: any, status: string) {
    try {
      await mutate(`/admin/${module}/${r._id}`, "PATCH", { status });
      setNotice("Status updated.");
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  }
  async function upload(file: File) {
    setBusy(true);
    setError("");
    try {
      const form = new FormData();
      form.append("image", file);
      const r = await api("/admin/media", {
        method: "POST",
        body: form,
        headers: { "x-csrf-token": csrf },
      });
      setEdit((v: any) => ({
        ...v,
        ...(module === "projects"
          ? { media: [...v.media, r.url] }
          : { [module === "team" ? "image" : "coverImage"]: r.url }),
      }));
      setNotice("Image uploaded. Save the record to attach it.");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  if (!ready)
    return (
      <section className="section" role="status">
        Checking sessionâ€¦
      </section>
    );
  if (!user)
    return (
      <section className="section admin-login">
        <span className="eyebrow">STUDIO CONTROL ROOM</span>
        <h1>
          BEHIND
          <br />
          THE <i>SCENES.</i>
        </h1>
        <form onSubmit={login}>
          <h2>Administrator sign in</h2>
          <label>
            Email
            <input name="email" type="email" required autoComplete="username" />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </label>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <button className="submit-btn" disabled={busy}>
            {busy ? "Signing inâ€¦" : "Sign in"}
          </button>
          <p className="muted">
            Create your first administrator with the secure terminal setup
            described in the README. No public registration.
          </p>
        </form>
      </section>
    );
  const readonly = ["enquiries", "applications"].includes(module);
  const canWrite = user.role === "admin";
  const visible = records.filter(
    (r) => filter === "all" || r.status === filter,
  );
  return (
    <section className="section admin">
      <div className="admin-top">
        <div>
          <span className="eyebrow">
            {user.email} / {user.role}
          </span>
          <h1>CONTROL ROOM.</h1>
        </div>
        <button
          className="pill"
          onClick={async () => {
            try {
              await mutate("/auth/logout", "POST");
              setUser(null);
              setEdit(null);
            } catch (e) {
              setError((e as Error).message);
            }
          }}
        >
          Sign out <LogOut size={17} />
        </button>
      </div>
      <nav className="admin-nav">
        {["overview", ...Object.keys(labels)].map((k) => (
          <button
            key={k}
            className={module === k ? "selected" : ""}
            onClick={() => {
              setModule(k);
              setFilter("all");
              setEdit(null);
              setNotice("");
            }}
          >
            {labels[k] || "Overview"}
          </button>
        ))}
      </nav>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className="notice" role="status">
          {notice}
        </p>
      )}
      {loading ? (
        <p role="status">Loading recordsâ€¦</p>
      ) : module === "overview" ? (
        <div className="overview-grid">
          {Object.entries(counts).map(([k, n]) => (
            <button key={k} onClick={() => setModule(k)}>
              <span>{labels[k]}</span>
              <strong>{n}</strong>
            </button>
          ))}
        </div>
      ) : (
        <>
          <div className="admin-toolbar">
            <h2>
              {labels[module]} <sup>{records.length}</sup>
            </h2>
            {!readonly && canWrite && (
              <button
                className="pill"
                onClick={() => setEdit({ ...defaults[module] })}
              >
                <Plus size={18} /> Create{" "}
                {module === "articles" ? "article" : "record"}
              </button>
            )}
            {readonly && (
              <label>
                Filter status
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  {[
                    "all",
                    "new",
                    "reviewed",
                    ...(module === "enquiries"
                      ? ["archived"]
                      : ["shortlisted", "rejected"]),
                  ].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
            )}
          </div>
          <div className="admin-records">
            {visible.map((r) => (
              <article key={r._id}>
                <div>
                  <h3>{r.title || r.name || r.applicantName}</h3>
                  <p>{r.email || r.category || r.role || r.department}</p>
                  {readonly && (
                    <>
                      <p>
                        {r.company} {r.projectType} {r.budgetRange}
                      </p>
                      <p className="record-message">
                        {r.message || r.coverLetter}
                      </p>
                      {r.portfolioUrl && (
                        <a
                          href={r.portfolioUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View portfolio
                        </a>
                      )}
                      <small>
                        {new Date(r.createdAt).toLocaleString()}{" "}
                        {r.position && ` / Position ID: ${r.position}`}
                      </small>
                    </>
                  )}
                  <span className="badge">
                    {r.status || (r.published ? "Published" : "Draft")}
                  </span>
                  {module === "projects" && (
                    <span className="badge">
                      Order {r.displayOrder} {r.featured ? " / Featured" : ""}
                    </span>
                  )}
                </div>
                {canWrite &&
                  (readonly ? (
                    <select
                      aria-label="Record status"
                      value={r.status}
                      onChange={(e) => updateStatus(r, e.target.value)}
                    >
                      {[
                        "new",
                        "reviewed",
                        ...(module === "enquiries"
                          ? ["archived"]
                          : ["shortlisted", "rejected"]),
                      ].map((v) => (
                        <option key={v}>{v}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="record-actions">
                      <button
                        aria-label="Edit record"
                        onClick={() => setEdit(r)}
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        aria-label="Delete record"
                        onClick={() => remove(r)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
              </article>
            ))}
            {!visible.length && <p>No records to show.</p>}
          </div>
        </>
      )}
      {edit && (
        <div className="editor-panel">
          <div className="admin-toolbar">
            <h2>
              {edit._id ? "Edit" : "Create"} {labels[module]}
            </h2>
            <button aria-label="Close editor" onClick={() => setEdit(null)}>
              <X />
            </button>
          </div>
          <form onSubmit={save}>
            <div className="form-grid">
              {Object.keys(defaults[module]).map((key) => (
                <label
                  className={
                    ["content", "description", "biography", "media"].includes(
                      key,
                    )
                      ? "full"
                      : ""
                  }
                  key={key}
                >
                  {key.replace(/([A-Z])/g, " $1")}
                  {typeof edit[key] === "boolean" ? (
                    <input
                      type="checkbox"
                      checked={edit[key]}
                      onChange={(e) =>
                        setEdit({ ...edit, [key]: e.target.checked })
                      }
                    />
                  ) : typeof edit[key] === "number" ? (
                    <input
                      type="number"
                      min="0"
                      value={edit[key]}
                      onChange={(e) =>
                        setEdit({ ...edit, [key]: Number(e.target.value) })
                      }
                    />
                  ) : key === "media" ? (
                    <textarea
                      rows={3}
                      value={edit.media.join("\n")}
                      onChange={(e) =>
                        setEdit({
                          ...edit,
                          media: e.target.value.split("\n").filter(Boolean),
                        })
                      }
                    />
                  ) : [
                      "description",
                      "content",
                      "biography",
                      "excerpt",
                    ].includes(key) ? (
                    <textarea
                      required
                      rows={key === "content" ? 12 : 4}
                      value={edit[key]}
                      onChange={(e) =>
                        setEdit({ ...edit, [key]: e.target.value })
                      }
                    />
                  ) : key === "status" ? (
                    <select
                      value={edit[key]}
                      onChange={(e) =>
                        setEdit({ ...edit, [key]: e.target.value })
                      }
                    >
                      {(module === "articles"
                        ? ["draft", "published"]
                        : ["open", "closed"]
                      ).map((v) => (
                        <option key={v}>{v}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      required
                      type={key === "color" ? "color" : "text"}
                      value={edit[key]}
                      onChange={(e) =>
                        setEdit({ ...edit, [key]: e.target.value })
                      }
                    />
                  )}
                </label>
              ))}
            </div>
            {module !== "positions" && (
              <label className="upload-label">
                <Upload size={17} /> Upload image (max 5 MB)
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/avif"
                  disabled={busy}
                  onChange={(e) => {
                    if (e.target.files?.[0]) void upload(e.target.files[0]);
                  }}
                />
              </label>
            )}
            <p className="muted">
              Project display order controls portfolio sorting. Articles remain
              private while in draft. Uploaded images use the configured server
              storage directory.
            </p>
            <button className="submit-btn" disabled={busy}>
              {busy ? "Savingâ€¦" : "Save changes"}
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
