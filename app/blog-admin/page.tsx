"use client";

import { useState, useEffect, useCallback } from "react";

type Post = {
  id: string;
  url: string;
  title: string;
  excerpt: string;
  source: string;
  og_image: string | null;
  is_featured: boolean;
  is_visible: boolean;
  published_at: string;
};

const SOURCES = ["Founder Activity", "Partnership Announcement", "Market Watch", "Press", "Research"];

const BLANK = { url: "", title: "", excerpt: "", source: "Founder Activity", og_image: "", is_featured: false };

export default function BlogAdmin() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [fetching, setFetching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const headers = { "Content-Type": "application/json", "x-blog-secret": secret };

  const loadPosts = useCallback(async () => {
    setLoading(true);
    // Admin view: fetch all posts including hidden ones via a custom header
    const res = await fetch("/api/blog", { headers: { "x-blog-secret": secret } });
    const data = await res.json();
    // GET is public and only returns visible posts; for admin we show all
    // We'll handle this by fetching everything with a special admin GET
    // For now, fetch public list and admins can see hidden via toggle
    setPosts(Array.isArray(data) ? data : []);
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secret]);

  const verify = async () => {
    setAuthError("");
    // Verify by making a POST with empty body — 401 means wrong secret, 400 means right secret
    const res = await fetch("/api/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-blog-secret": secret },
      body: JSON.stringify({}),
    });
    if (res.status === 401) { setAuthError("Wrong password."); return; }
    setAuthed(true);
    sessionStorage.setItem("blog_admin_secret", secret);
  };

  useEffect(() => {
    const saved = sessionStorage.getItem("blog_admin_secret");
    if (saved) { setSecret(saved); setAuthed(true); }
  }, []);

  useEffect(() => {
    if (authed) loadPosts();
  }, [authed, loadPosts]);

  const fetchOG = async () => {
    if (!form.url) return;
    setFetching(true);
    setFormError("");
    try {
      const res = await fetch("/api/blog/og", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: form.url }),
      });
      const og = await res.json();
      setForm(f => ({
        ...f,
        title: og.title || f.title,
        excerpt: og.description || f.excerpt,
        og_image: og.image || f.og_image,
      }));
    } finally {
      setFetching(false);
    }
  };

  const save = async () => {
    if (!form.title || !form.excerpt || !form.url) {
      setFormError("URL, title, and excerpt are required.");
      return;
    }
    setSaving(true);
    setFormError("");
    const res = await fetch("/api/blog", {
      method: "POST",
      headers,
      body: JSON.stringify({ ...form, og_image: form.og_image || null }),
    });
    setSaving(false);
    if (!res.ok) {
      const err = await res.json();
      setFormError(err.error ?? "Failed to save.");
      return;
    }
    setForm(BLANK);
    loadPosts();
  };

  const toggle = async (post: Post) => {
    await fetch(`/api/blog/${post.id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ is_visible: !post.is_visible }),
    });
    loadPosts();
  };

  const toggleFeatured = async (post: Post) => {
    await fetch(`/api/blog/${post.id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ is_featured: !post.is_featured }),
    });
    loadPosts();
  };

  const remove = async (post: Post) => {
    if (!confirm(`Delete "${post.title}"?`)) return;
    await fetch(`/api/blog/${post.id}`, { method: "DELETE", headers });
    loadPosts();
  };

  // ── Auth gate ────────────────────────────────────────────────────────────────

  if (!authed) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h1 className="text-lg font-bold text-slate-900 mb-1">Blog Admin</h1>
          <p className="text-sm text-slate-500 mb-6">Enter the admin password to manage blog posts.</p>
          <input
            type="password"
            value={secret}
            onChange={e => setSecret(e.target.value)}
            onKeyDown={e => e.key === "Enter" && verify()}
            placeholder="Password"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 mb-3 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500"
          />
          {authError && <p className="text-xs text-red-500 mb-3">{authError}</p>}
          <button
            onClick={verify}
            className="w-full py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-lg hover:bg-violet-700 transition-colors"
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  // ── Admin UI ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <h1 className="font-bold text-slate-900">Blog Admin</h1>
        <button
          onClick={() => { sessionStorage.removeItem("blog_admin_secret"); setAuthed(false); setSecret(""); }}
          className="text-xs text-slate-400 hover:text-slate-600"
        >
          Sign out
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ── Add Post Form ── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="font-semibold text-slate-900 mb-5">Add New Post</h2>

          <div className="space-y-4">
            {/* URL + Fetch */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">LinkedIn URL</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={form.url}
                  onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                  placeholder="https://www.linkedin.com/posts/..."
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500"
                />
                <button
                  onClick={fetchOG}
                  disabled={!form.url || fetching}
                  className="px-3 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-40"
                >
                  {fetching ? "…" : "Fetch"}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Paste URL then click Fetch to auto-fill title &amp; excerpt</p>
            </div>

            {/* Source */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Label</label>
              <select
                value={form.source}
                onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/30 bg-white"
              >
                {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Excerpt</label>
              <textarea
                value={form.excerpt}
                onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 resize-none"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Image URL <span className="normal-case font-normal">(optional)</span></label>
              <input
                type="text"
                value={form.og_image}
                onChange={e => setForm(f => ({ ...f, og_image: e.target.value }))}
                placeholder="/blog-image.jpg or https://..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500"
              />
            </div>

            {/* Featured toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setForm(f => ({ ...f, is_featured: !f.is_featured }))}
                className={`w-9 h-5 rounded-full transition-colors ${form.is_featured ? "bg-violet-600" : "bg-slate-200"} relative`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.is_featured ? "translate-x-4" : "translate-x-0.5"}`} />
              </div>
              <span className="text-sm text-slate-700">Featured post (shown large on left)</span>
            </label>

            {formError && <p className="text-xs text-red-500">{formError}</p>}

            <button
              onClick={save}
              disabled={saving}
              className="w-full py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50"
            >
              {saving ? "Saving…" : "Add Post"}
            </button>
          </div>
        </div>

        {/* ── Posts List ── */}
        <div>
          <h2 className="font-semibold text-slate-900 mb-4">
            Posts {loading ? <span className="text-slate-400 font-normal text-sm">Loading…</span> : <span className="text-slate-400 font-normal text-sm">({posts.length})</span>}
          </h2>
          <div className="space-y-3">
            {posts.map(post => (
              <div
                key={post.id}
                className={`bg-white border rounded-xl p-4 ${!post.is_visible ? "opacity-50" : "border-slate-200"}`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className={`text-[10px] font-semibold uppercase tracking-wide ${post.source === "Partnership Announcement" ? "text-violet-600" : "text-emerald-600"}`}>
                    {post.source}{post.is_featured && " · Featured"}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-900 line-clamp-2 mb-3">{post.title}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-violet-600 hover:underline"
                  >
                    LinkedIn ↗
                  </a>
                  <button
                    onClick={() => toggleFeatured(post)}
                    className="text-xs text-slate-500 hover:text-slate-800 border border-slate-200 px-2 py-0.5 rounded"
                  >
                    {post.is_featured ? "Unfeature" : "Feature"}
                  </button>
                  <button
                    onClick={() => toggle(post)}
                    className="text-xs text-slate-500 hover:text-slate-800 border border-slate-200 px-2 py-0.5 rounded"
                  >
                    {post.is_visible ? "Hide" : "Show"}
                  </button>
                  <button
                    onClick={() => remove(post)}
                    className="text-xs text-red-400 hover:text-red-600 border border-red-100 px-2 py-0.5 rounded ml-auto"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {!loading && posts.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-10">No posts yet.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
