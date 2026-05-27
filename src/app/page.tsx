"use client";

import { useState, useEffect, useCallback } from "react";

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
}

interface CoachInsight {
  domain: "business" | "health" | "relationships" | "learning";
  title: string;
  feedback: string;
  actionItems: string[];
  rating: number;
}

interface CoachResponse {
  overallScore: number;
  summary: string;
  insights: CoachInsight[];
}

type Tab = "dashboard" | "import" | "add" | "categories" | "coach";

export default function Home() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = useCallback(async () => {
    const [kRes, cRes] = await Promise.all([
      fetch("/api/knowledge"),
      fetch("/api/categories"),
    ]);
    const kData = await kRes.json();
    const cData = await cRes.json();
    setKnowledge(kData);
    setCategories(cData);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredKnowledge = knowledge.filter((item) => {
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    const matchesSearch =
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight gradient-text mb-2">
          Knowledge Base
        </h1>
        <p className="text-[var(--text-secondary)] text-lg">
          AI-powered organization for all your notes
        </p>
      </header>

      {/* Navigation Tabs */}
      <nav className="flex gap-2 mb-8 flex-wrap">
        {(
          [
            ["dashboard", "Dashboard"],
            ["import", "Bulk Import"],
            ["add", "Add Note"],
            ["categories", "Categories"],
            ["coach", "AI Coach"],
          ] as [Tab, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`tab-btn ${tab === key ? "active" : ""}`}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* Dashboard */}
      {tab === "dashboard" && (
        <DashboardView
          knowledge={filteredKnowledge}
          categories={categories}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onDelete={async (id) => {
            await fetch(`/api/knowledge?id=${id}`, { method: "DELETE" });
            fetchData();
          }}
        />
      )}

      {/* Bulk Import */}
      {tab === "import" && (
        <BulkImportView
          loading={loading}
          setLoading={setLoading}
          onComplete={() => {
            fetchData();
            setTab("dashboard");
          }}
        />
      )}

      {/* Add Single Note */}
      {tab === "add" && (
        <AddNoteView
          categories={categories}
          loading={loading}
          setLoading={setLoading}
          onComplete={() => {
            fetchData();
            setTab("dashboard");
          }}
        />
      )}

      {/* Categories */}
      {tab === "categories" && (
        <CategoriesView categories={categories} knowledge={knowledge} onRefresh={fetchData} />
      )}

      {/* AI Life Coach */}
      {tab === "coach" && <LifeCoachView />}
    </div>
  );
}

function DashboardView({
  knowledge,
  categories,
  filterCategory,
  setFilterCategory,
  searchQuery,
  setSearchQuery,
  onDelete,
}: {
  knowledge: KnowledgeItem[];
  categories: Category[];
  filterCategory: string;
  setFilterCategory: (v: string) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  onDelete: (id: string) => void;
}) {
  const getCategoryName = (catId: string) =>
    categories.find((c) => c.id === catId)?.name || catId;
  const getCategoryColor = (catId: string) =>
    categories.find((c) => c.id === catId)?.color || "#6b7280";

  return (
    <div className="fade-in">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold gradient-text">{knowledge.length}</div>
          <div className="text-sm text-[var(--text-secondary)]">Total Items</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold gradient-text">{categories.length}</div>
          <div className="text-sm text-[var(--text-secondary)]">Categories</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold gradient-text">
            {new Set(knowledge.map((k) => k.category)).size}
          </div>
          <div className="text-sm text-[var(--text-secondary)]">Active Categories</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold gradient-text">
            {knowledge.length > 0
              ? new Date(
                  Math.max(...knowledge.map((k) => new Date(k.createdAt).getTime()))
                ).toLocaleDateString()
              : "—"}
          </div>
          <div className="text-sm text-[var(--text-secondary)]">Last Added</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search your knowledge..."
          className="input-field flex-1"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="input-field md:w-48"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Knowledge Items */}
      {knowledge.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-xl text-[var(--text-secondary)] mb-4">No knowledge yet</p>
          <p className="text-[var(--text-secondary)]">
            Use &quot;Bulk Import&quot; to paste all your notes, or &quot;Add Note&quot; to add one at a time.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {knowledge.map((item) => (
            <div key={item.id} className="glass-card p-5 flex flex-col gap-3 fade-in">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-lg leading-tight">{item.title}</h3>
                <button
                  onClick={() => onDelete(item.id)}
                  className="text-[var(--text-secondary)] hover:text-red-400 text-sm shrink-0"
                  title="Delete"
                >
                  ✕
                </button>
              </div>
              <div
                className="category-badge w-fit"
                style={{ borderColor: getCategoryColor(item.category) + "40" }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: getCategoryColor(item.category) }}
                />
                {getCategoryName(item.category)}
              </div>
              <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap break-words flex-1 line-clamp-6">
                {item.content}
              </p>
              <div className="text-xs text-[var(--text-secondary)] opacity-60">
                {new Date(item.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BulkImportView({
  loading,
  setLoading,
  onComplete,
}: {
  loading: boolean;
  setLoading: (v: boolean) => void;
  onComplete: () => void;
}) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string>("");

  const handleBulkImport = async () => {
    if (!text.trim() && !file) return;
    setLoading(true);
    setResult("");

    try {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (res.ok) {
          setResult(`Organized ${data.count} items from "${data.filename}"`);
          setTimeout(onComplete, 1500);
        } else {
          setResult(`Error: ${data.error}`);
        }
      } else {
        const res = await fetch("/api/organize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, mode: "bulk" }),
        });
        const data = await res.json();
        if (res.ok) {
          setResult(`Organized ${data.count} items into categories`);
          setTimeout(onComplete, 1500);
        } else {
          setResult(`Error: ${data.error}`);
        }
      }
    } catch {
      setResult("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in max-w-3xl">
      <div className="glass-card p-8">
        <h2 className="text-2xl font-bold mb-2">Bulk Import</h2>
        <p className="text-[var(--text-secondary)] mb-6">
          Paste all your notes below or upload a .txt file. The AI will organize everything into
          categories while preserving all links, passwords, and important context.
        </p>

        {/* File Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Upload a file</label>
          <input
            type="file"
            accept=".txt,.md,.csv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[var(--accent)] file:text-white file:font-medium file:cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-[var(--border)]" />
          <span className="text-[var(--text-secondary)] text-sm">or paste your notes</span>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>

        {/* Text Area */}
        <textarea
          className="input-field mb-6"
          placeholder="Paste all your notes here... Everything will be organized automatically. Links, passwords, and important data will be preserved exactly as-is."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={12}
        />

        {/* Submit */}
        <button
          onClick={handleBulkImport}
          disabled={loading || (!text.trim() && !file)}
          className="glow-btn px-8 py-3 text-lg w-full md:w-auto"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <span className="spinner" /> Organizing with AI...
            </span>
          ) : (
            "Organize Everything"
          )}
        </button>

        {result && (
          <div
            className={`mt-4 p-4 rounded-xl ${
              result.startsWith("Error") ? "bg-red-500/10 text-red-300" : "bg-green-500/10 text-green-300"
            }`}
          >
            {result}
          </div>
        )}
      </div>
    </div>
  );
}

function AddNoteView({
  categories,
  loading,
  setLoading,
  onComplete,
}: {
  categories: Category[];
  loading: boolean;
  setLoading: (v: boolean) => void;
  onComplete: () => void;
}) {
  const [text, setText] = useState("");
  const [useAI, setUseAI] = useState(true);
  const [manualCategory, setManualCategory] = useState("");
  const [manualTitle, setManualTitle] = useState("");
  const [result, setResult] = useState("");

  const handleAdd = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult("");

    try {
      if (useAI) {
        const res = await fetch("/api/organize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, mode: "single" }),
        });
        const data = await res.json();
        if (res.ok) {
          setResult("Added and organized!");
          setText("");
          setTimeout(onComplete, 1000);
        } else {
          setResult(`Error: ${data.error}`);
        }
      } else {
        if (!manualCategory || !manualTitle) {
          setResult("Please provide a title and category");
          setLoading(false);
          return;
        }
        const res = await fetch("/api/knowledge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: manualTitle, content: text, category: manualCategory }),
        });
        const data = await res.json();
        if (res.ok) {
          setResult("Added!");
          setText("");
          setManualTitle("");
          setTimeout(onComplete, 1000);
        } else {
          setResult(`Error: ${data.error}`);
        }
      }
    } catch {
      setResult("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in max-w-2xl">
      <div className="glass-card p-8">
        <h2 className="text-2xl font-bold mb-2">Add Knowledge</h2>
        <p className="text-[var(--text-secondary)] mb-6">
          Add a new note. Toggle AI to have it auto-categorize, or manually assign a category.
        </p>

        {/* AI Toggle */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setUseAI(!useAI)}
            className={`w-12 h-6 rounded-full transition-colors ${
              useAI ? "bg-[var(--accent)]" : "bg-[var(--bg-card)]"
            } relative border border-[var(--border)]`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                useAI ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
          <span className="text-sm">AI auto-organize</span>
        </div>

        {!useAI && (
          <>
            <input
              type="text"
              placeholder="Title"
              className="input-field mb-4"
              value={manualTitle}
              onChange={(e) => setManualTitle(e.target.value)}
            />
            <select
              className="input-field mb-4"
              value={manualCategory}
              onChange={(e) => setManualCategory(e.target.value)}
            >
              <option value="">Select category...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </>
        )}

        <textarea
          className="input-field mb-6"
          placeholder="Type or paste your note here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
        />

        <button
          onClick={handleAdd}
          disabled={loading || !text.trim()}
          className="glow-btn px-8 py-3"
        >
          {loading ? (
            <span className="flex items-center gap-3">
              <span className="spinner" /> Processing...
            </span>
          ) : useAI ? (
            "Add & Auto-Organize"
          ) : (
            "Add Note"
          )}
        </button>

        {result && (
          <div
            className={`mt-4 p-4 rounded-xl ${
              result.startsWith("Error") || result.startsWith("Please")
                ? "bg-red-500/10 text-red-300"
                : "bg-green-500/10 text-green-300"
            }`}
          >
            {result}
          </div>
        )}
      </div>
    </div>
  );
}

function CategoriesView({
  categories,
  knowledge,
  onRefresh,
}: {
  categories: Category[];
  knowledge: KnowledgeItem[];
  onRefresh: () => void;
}) {
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newColor, setNewColor] = useState("#6366f1");

  const handleAdd = async () => {
    if (!newName.trim()) return;
    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, description: newDesc, color: newColor }),
    });
    setNewName("");
    setNewDesc("");
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
    onRefresh();
  };

  return (
    <div className="fade-in">
      {/* Add Category */}
      <div className="glass-card p-6 mb-8 max-w-xl">
        <h3 className="font-bold text-lg mb-4">New Category</h3>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Category name"
            className="input-field"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description (optional)"
            className="input-field"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
          />
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="w-10 h-10 rounded-lg border border-[var(--border)] cursor-pointer"
            />
            <span className="text-sm text-[var(--text-secondary)]">Pick a color</span>
          </div>
          <button onClick={handleAdd} className="glow-btn px-6 py-2 w-fit">
            Add Category
          </button>
        </div>
      </div>

      {/* Existing Categories */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => {
          const count = knowledge.filter((k) => k.category === cat.id).length;
          return (
            <div key={cat.id} className="glass-card p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{ background: cat.color }}
                  />
                  <h3 className="font-semibold">{cat.name}</h3>
                </div>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="text-[var(--text-secondary)] hover:text-red-400 text-sm"
                  title="Delete category"
                >
                  ✕
                </button>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-2">{cat.description}</p>
              <span className="text-xs text-[var(--text-secondary)]">{count} items</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// AI LIFE COACH VIEW
// ═══════════════════════════════════════════════════════════════

function LifeCoachView() {
  const [coaching, setCoaching] = useState<CoachResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getCoaching = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/coach", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setCoaching(data);
      } else {
        setError(data.error || "Failed to get coaching insights");
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const getDomainIcon = (domain: string) => {
    switch (domain) {
      case "business": return "\u{1F4B0}";
      case "health": return "\u{1F4AA}";
      case "relationships": return "\u{2764}\u{FE0F}";
      case "learning": return "\u{1F4DA}";
      default: return "\u{2B50}";
    }
  };

  const getDomainGradient = (domain: string) => {
    switch (domain) {
      case "business": return "from-emerald-500/20 to-green-600/10 border-emerald-500/30";
      case "health": return "from-orange-500/20 to-red-600/10 border-orange-500/30";
      case "relationships": return "from-pink-500/20 to-rose-600/10 border-pink-500/30";
      case "learning": return "from-blue-500/20 to-indigo-600/10 border-blue-500/30";
      default: return "from-purple-500/20 to-violet-600/10 border-purple-500/30";
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "text-emerald-400";
    if (rating >= 6) return "text-yellow-400";
    if (rating >= 4) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <div className="fade-in">
      {/* Coach Header */}
      <div className="glass-card p-8 mb-8 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight gradient-text mb-3">
          AI Life Coach
        </h2>
        <p className="text-[var(--text-secondary)] mb-6 max-w-xl mx-auto">
          Brutally honest performance review across business, health, relationships, and learning.
          Based on your actual notes and activity.
        </p>
        <button
          onClick={getCoaching}
          disabled={loading}
          className="glow-btn px-8 py-3 text-lg"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <span className="spinner" /> Analyzing your life...
            </span>
          ) : coaching ? (
            "Refresh Coaching"
          ) : (
            "Get My Assessment"
          )}
        </button>
        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-500/10 text-red-300">{error}</div>
        )}
      </div>

      {/* Results */}
      {coaching && (
        <div className="fade-in">
          {/* Overall Score */}
          <div className="glass-card p-8 mb-8 text-center">
            <div className={`text-6xl font-black mb-2 ${getRatingColor(coaching.overallScore)}`}>
              {coaching.overallScore}/10
            </div>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              {coaching.summary}
            </p>
          </div>

          {/* Domain Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {coaching.insights.map((insight, i) => (
              <div
                key={i}
                className={`rounded-2xl border p-6 bg-gradient-to-br ${getDomainGradient(insight.domain)} backdrop-blur-sm`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getDomainIcon(insight.domain)}</span>
                    <div>
                      <h3 className="font-bold text-lg capitalize">{insight.domain}</h3>
                      <p className="text-sm text-[var(--text-secondary)]">{insight.title}</p>
                    </div>
                  </div>
                  <div className={`text-3xl font-black ${getRatingColor(insight.rating)}`}>
                    {insight.rating}
                  </div>
                </div>

                <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">
                  {insight.feedback}
                </p>

                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                    Action Items
                  </h4>
                  {insight.actionItems.map((item, j) => (
                    <div key={j} className="flex items-start gap-2 text-sm">
                      <span className="text-[var(--accent)] mt-0.5">&#x25B8;</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
