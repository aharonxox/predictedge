"use client";

import { useState, useEffect, useCallback } from "react";

interface Attachment {
  filename: string;
  url: string;
  originalName: string;
  type: string;
  size: number;
}

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  attachments?: Attachment[];
}

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
}

type CoachMode = "overview" | "business" | "health" | "communication" | "relationships";

interface CoachInsight {
  domain: string;
  title: string;
  feedback: string;
  actionItems: string[];
  rating: number;
}

interface CoachResponse {
  overallScore: number;
  summary: string;
  insights: CoachInsight[];
  mode: CoachMode;
}

interface ProgressEntry {
  date: string;
  mode: CoachMode;
  score: number;
  summary: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  url?: string;
  status: "active" | "paused" | "completed" | "idea";
  type: "website" | "app" | "business" | "other";
  createdAt: string;
}

type Tab = "dashboard" | "import" | "add" | "categories" | "coach" | "projects";

const PIN_CODE = "242766";

function PinLockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const handleDigit = (digit: string) => {
    if (pin.length >= 6) return;
    const newPin = pin + digit;
    setPin(newPin);
    setError(false);
    if (newPin.length === 6) {
      if (newPin === PIN_CODE) {
        localStorage.setItem("kb_auth", "true");
        onUnlock();
      } else {
        setError(true);
        setTimeout(() => { setPin(""); setError(false); }, 800);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card p-8 w-full max-w-sm text-center">
        <h1 className="text-2xl font-extrabold tracking-tight gradient-text mb-2">Knowledge Base</h1>
        <p className="text-[var(--text-secondary)] text-sm mb-8">Enter your 6-digit PIN</p>

        {/* PIN dots */}
        <div className="flex justify-center gap-3 mb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition-all ${
                error ? "border-red-400 bg-red-400" :
                i < pin.length ? "border-[var(--accent)] bg-[var(--accent)]" :
                "border-[var(--border)] bg-transparent"
              } ${error ? "animate-pulse" : ""}`}
            />
          ))}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 max-w-[240px] mx-auto">
          {["1","2","3","4","5","6","7","8","9","","0",""].map((digit, i) => {
            if (i === 9) return <div key="empty1" />;
            if (i === 11) return (
              <button key="del" onClick={handleDelete} className="w-16 h-16 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--accent)]/10 transition-colors text-sm font-medium mx-auto">
                DEL
              </button>
            );
            return (
              <button
                key={digit}
                onClick={() => handleDigit(digit)}
                className="w-16 h-16 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center text-xl font-bold hover:bg-[var(--accent)]/10 hover:border-[var(--accent)]/30 transition-colors mx-auto"
              >
                {digit}
              </button>
            );
          })}
        </div>

        {error && <p className="text-red-400 text-sm mt-4">Wrong PIN</p>}
      </div>
    </div>
  );
}

export default function Home() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (localStorage.getItem("kb_auth") === "true") {
      setAuthed(true);
    }
  }, []);

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
    if (authed) fetchData();
  }, [fetchData, authed]);

  if (!authed) {
    return <PinLockScreen onUnlock={() => setAuthed(true)} />;
  }

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
            ["projects", "Projects"],
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

      {/* Projects */}
      {tab === "projects" && <ProjectsView />}

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
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const PER_PAGE = 12;

  const getCategoryName = (catId: string) =>
    categories.find((c) => c.id === catId)?.name || catId;
  const getCategoryColor = (catId: string) =>
    categories.find((c) => c.id === catId)?.color || "#6b7280";

  const totalPages = Math.ceil(knowledge.length / PER_PAGE);
  const paged = knowledge.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  return (
    <div className="fade-in">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="glass-card p-3 text-center">
          <div className="text-2xl font-bold gradient-text">{knowledge.length}</div>
          <div className="text-xs text-[var(--text-secondary)]">Total Items</div>
        </div>
        <div className="glass-card p-3 text-center">
          <div className="text-2xl font-bold gradient-text">{categories.length}</div>
          <div className="text-xs text-[var(--text-secondary)]">Categories</div>
        </div>
        <div className="glass-card p-3 text-center">
          <div className="text-2xl font-bold gradient-text">
            {new Set(knowledge.map((k) => k.category)).size}
          </div>
          <div className="text-xs text-[var(--text-secondary)]">Active</div>
        </div>
        <div className="glass-card p-3 text-center">
          <div className="text-2xl font-bold gradient-text">
            {knowledge.length > 0
              ? new Date(
                  Math.max(...knowledge.map((k) => new Date(k.createdAt).getTime()))
                ).toLocaleDateString()
              : "\u2014"}
          </div>
          <div className="text-xs text-[var(--text-secondary)]">Last Added</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="input-field flex-1"
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
        />
        <select
          className="input-field md:w-48"
          value={filterCategory}
          onChange={(e) => { setFilterCategory(e.target.value); setPage(0); }}
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Compact Knowledge List */}
      {knowledge.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <p className="text-[var(--text-secondary)]">No knowledge yet. Import or add notes to get started.</p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {paged.map((item) => (
              <div key={item.id} className="glass-card p-3 fade-in">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}>
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: getCategoryColor(item.category) }} />
                  <h3 className="font-medium text-sm flex-1 truncate">{item.title}</h3>
                  <span className="text-xs text-[var(--text-secondary)] shrink-0">{getCategoryName(item.category)}</span>
                  <span className="text-xs text-[var(--text-secondary)] opacity-50 shrink-0">{expandedId === item.id ? "\u25B2" : "\u25BC"}</span>
                </div>
                {expandedId === item.id && (
                  <div className="mt-3 pt-3 border-t border-[var(--border)]">
                    <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap break-words mb-3">{item.content}</p>
                    {item.attachments && item.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {item.attachments.map((att) => (
                          <a key={att.filename} href={att.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 rounded bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-xs text-[var(--accent)]">
                            {att.type.startsWith("image/") ? "\u{1F5BC}" : "\u{1F4CE}"} {att.originalName}
                          </a>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[var(--text-secondary)] opacity-60">{new Date(item.createdAt).toLocaleDateString()}</span>
                      <button onClick={() => onDelete(item.id)} className="text-xs text-red-400 hover:text-red-300">Delete</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="tab-btn px-3 py-1 text-sm">Prev</button>
              <span className="text-sm text-[var(--text-secondary)]">{page + 1} / {totalPages}</span>
              <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1} className="tab-btn px-3 py-1 text-sm">Next</button>
            </div>
          )}
        </>
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
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/files", { method: "POST", body: formData });
        if (res.ok) {
          const data = await res.json();
          setAttachments((prev) => [...prev, data]);
        }
      } catch {
        setResult("File upload failed");
      }
    }
    setUploading(false);
    e.target.value = "";
  };

  const removeAttachment = (filename: string) => {
    setAttachments((prev) => prev.filter((a) => a.filename !== filename));
    fetch(`/api/files?filename=${filename}`, { method: "DELETE" });
  };

  const handleAdd = async () => {
    if (!text.trim() && attachments.length === 0) return;
    setLoading(true);
    setResult("");

    try {
      if (useAI) {
        const res = await fetch("/api/organize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, mode: "single", attachments }),
        });
        const data = await res.json();
        if (res.ok) {
          setResult("Added and organized!");
          setText("");
          setAttachments([]);
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
          body: JSON.stringify({ title: manualTitle, content: text, category: manualCategory, attachments }),
        });
        const data = await res.json();
        if (res.ok) {
          setResult("Added!");
          setText("");
          setManualTitle("");
          setAttachments([]);
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

  const isImage = (type: string) => type.startsWith("image/");

  return (
    <div className="fade-in max-w-2xl">
      <div className="glass-card p-8">
        <h2 className="text-2xl font-bold mb-2">Add Knowledge</h2>
        <p className="text-[var(--text-secondary)] mb-6">
          Add notes, files, photos, links — anything. AI will auto-categorize or you can assign manually.
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
          className="input-field mb-4"
          placeholder="Type or paste your note here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
        />

        {/* File Upload */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-[var(--text-secondary)]">
            Attach Files / Photos
          </label>
          <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-[var(--border)] rounded-xl cursor-pointer hover:border-[var(--accent)] transition-colors">
            <span className="text-[var(--text-secondary)]">
              {uploading ? "Uploading..." : "Click to upload files, photos, PDFs..."}
            </span>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,.pdf,.txt,.doc,.docx,.xls,.xlsx,.csv,.json,.zip"
            />
          </label>

          {/* Attachment previews */}
          {attachments.length > 0 && (
            <div className="mt-3 grid gap-2">
              {attachments.map((att) => (
                <div key={att.filename} className="flex items-center gap-3 p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)]">
                  {isImage(att.type) ? (
                    <img src={att.url} alt={att.originalName} className="w-10 h-10 object-cover rounded" />
                  ) : (
                    <div className="w-10 h-10 rounded bg-[var(--accent)]/20 flex items-center justify-center text-xs font-bold text-[var(--accent)]">
                      {att.originalName.split(".").pop()?.toUpperCase()}
                    </div>
                  )}
                  <span className="flex-1 text-sm truncate">{att.originalName}</span>
                  <span className="text-xs text-[var(--text-secondary)]">{(att.size / 1024).toFixed(0)}KB</span>
                  <button onClick={() => removeAttachment(att.filename)} className="text-red-400 hover:text-red-300 text-lg">&times;</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleAdd}
          disabled={loading || (!text.trim() && attachments.length === 0)}
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
  const [openCat, setOpenCat] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newColor, setNewColor] = useState("#6366f1");
  const [showAdd, setShowAdd] = useState(false);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, description: newDesc, color: newColor }),
    });
    setNewName("");
    setNewDesc("");
    setShowAdd(false);
    onRefresh();
  };

  const handleDeleteItem = async (id: string) => {
    await fetch(`/api/knowledge?id=${id}`, { method: "DELETE" });
    onRefresh();
  };

  const handleSaveEdit = async (id: string) => {
    await fetch("/api/knowledge", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, content: editContent }),
    });
    setEditingId(null);
    onRefresh();
  };

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold gradient-text">Categories</h2>
        <button onClick={() => setShowAdd(!showAdd)} className="glow-btn px-4 py-1.5 text-sm">
          {showAdd ? "Cancel" : "+ New Category"}
        </button>
      </div>

      {showAdd && (
        <div className="glass-card p-4 mb-4">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input type="text" placeholder="Name" className="input-field flex-1" value={newName} onChange={(e) => setNewName(e.target.value)} />
              <input type="color" value={newColor} onChange={(e) => setNewColor(e.target.value)} className="w-10 h-10 rounded-lg border border-[var(--border)] cursor-pointer" />
            </div>
            <input type="text" placeholder="Description" className="input-field" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
            <button onClick={handleAdd} className="glow-btn px-4 py-1.5 text-sm w-fit">Add</button>
          </div>
        </div>
      )}

      {/* Category accordion */}
      <div className="space-y-2">
        {categories.map((cat) => {
          const items = knowledge.filter((k) => k.category === cat.id);
          const isOpen = openCat === cat.id;
          return (
            <div key={cat.id} className="glass-card overflow-hidden">
              <div
                className="flex items-center gap-3 p-4 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setOpenCat(isOpen ? null : cat.id)}
              >
                <span className="w-3 h-3 rounded-full shrink-0" style={{ background: cat.color }} />
                <h3 className="font-semibold flex-1">{cat.name}</h3>
                <span className="text-sm text-[var(--text-secondary)]">{items.length} items</span>
                <span className="text-xs text-[var(--text-secondary)]">{isOpen ? "\u25B2" : "\u25BC"}</span>
              </div>
              {isOpen && (
                <div className="border-t border-[var(--border)] max-h-96 overflow-y-auto">
                  {items.length === 0 ? (
                    <p className="p-4 text-sm text-[var(--text-secondary)]">No items in this category</p>
                  ) : (
                    items.map((item) => (
                      <div key={item.id} className="p-3 border-b border-[var(--border)] last:border-b-0 hover:bg-white/5">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium text-sm">{item.title}</h4>
                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={() => { setEditingId(editingId === item.id ? null : item.id); setEditContent(item.content); }}
                              className="text-xs text-[var(--accent)] hover:underline"
                            >
                              {editingId === item.id ? "Cancel" : "Edit"}
                            </button>
                            <button onClick={() => handleDeleteItem(item.id)} className="text-xs text-red-400 hover:text-red-300">Del</button>
                          </div>
                        </div>
                        {editingId === item.id ? (
                          <div className="mt-2">
                            <textarea className="input-field text-sm w-full" rows={4} value={editContent} onChange={(e) => setEditContent(e.target.value)} />
                            <button onClick={() => handleSaveEdit(item.id)} className="glow-btn px-3 py-1 text-xs mt-1">Save</button>
                          </div>
                        ) : (
                          <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2 whitespace-pre-wrap">{item.content}</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PROJECTS VIEW
// ═══════════════════════════════════════════════════════════════

function ProjectsView() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newProject, setNewProject] = useState<{ name: string; description: string; url: string; status: Project["status"]; type: Project["type"] }>({ name: "", description: "", url: "", status: "active", type: "website" });

  useEffect(() => {
    fetch("/api/projects").then(r => r.json()).then(setProjects);
  }, []);

  const addNewProject = async () => {
    if (!newProject.name) return;
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newProject, id: crypto.randomUUID() }),
    });
    if (res.ok) {
      const p = await res.json();
      setProjects([...projects, p]);
      setNewProject({ name: "", description: "", url: "", status: "active", type: "website" });
      setShowAdd(false);
    }
  };

  const removeProject = async (id: string) => {
    await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
    setProjects(projects.filter(p => p.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "paused": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "completed": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "idea": return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      default: return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "website": return "\u{1F310}";
      case "app": return "\u{1F4F1}";
      case "business": return "\u{1F4BC}";
      default: return "\u{1F4E6}";
    }
  };

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold gradient-text">My Projects</h2>
        <button onClick={() => setShowAdd(!showAdd)} className="glow-btn px-4 py-2">
          {showAdd ? "Cancel" : "+ New Project"}
        </button>
      </div>

      {showAdd && (
        <div className="glass-card p-6 mb-6">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Project name"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              className="input-field"
            />
            <input
              type="text"
              placeholder="URL (optional)"
              value={newProject.url}
              onChange={(e) => setNewProject({ ...newProject, url: e.target.value })}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Description"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              className="input-field md:col-span-2"
            />
            <select
              value={newProject.type}
              onChange={(e) => setNewProject({ ...newProject, type: e.target.value as Project["type"] })}
              className="input-field"
            >
              <option value="website">Website</option>
              <option value="app">App</option>
              <option value="business">Business</option>
              <option value="other">Other</option>
            </select>
            <select
              value={newProject.status}
              onChange={(e) => setNewProject({ ...newProject, status: e.target.value as Project["status"] })}
              className="input-field"
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="idea">Idea</option>
            </select>
          </div>
          <button onClick={addNewProject} className="glow-btn px-6 py-2 mt-4">
            Add Project
          </button>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-[var(--text-secondary)] text-lg">No projects yet. Add your first project above.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="glass-card p-5 group relative">
              <button
                onClick={() => removeProject(project.id)}
                className="absolute top-3 right-3 text-[var(--text-secondary)] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                &times;
              </button>
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">{getTypeIcon(project.type)}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg truncate">{project.name}</h3>
                  {project.url && (
                    <a
                      href={project.url.startsWith("http") ? project.url : `https://${project.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[var(--accent)] hover:underline truncate block"
                    >
                      {project.url}
                    </a>
                  )}
                </div>
              </div>
              {project.description && (
                <p className="text-sm text-[var(--text-secondary)] mb-3">{project.description}</p>
              )}
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs border ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// AI LIFE COACH VIEW — Multi-mode with progress tracking
// ═══════════════════════════════════════════════════════════════

const COACH_MODES: { key: CoachMode; label: string; icon: string; desc: string; gradient: string }[] = [
  { key: "overview", label: "Full Assessment", icon: "\u{1F3AF}", desc: "All domains", gradient: "from-purple-500/20 to-violet-600/10 border-purple-500/30" },
  { key: "business", label: "Business & Finance", icon: "\u{1F4B0}", desc: "Money, strategy, taxes, scaling", gradient: "from-emerald-500/20 to-green-600/10 border-emerald-500/30" },
  { key: "health", label: "Health & Fitness", icon: "\u{1F4AA}", desc: "Workout, diet, sleep, energy", gradient: "from-orange-500/20 to-red-600/10 border-orange-500/30" },
  { key: "communication", label: "Communication", icon: "\u{1F399}\u{FE0F}", desc: "Speaking, persuasion, networking", gradient: "from-cyan-500/20 to-blue-600/10 border-cyan-500/30" },
  { key: "relationships", label: "Relationships", icon: "\u{2764}\u{FE0F}", desc: "Social, emotional, connections", gradient: "from-pink-500/20 to-rose-600/10 border-pink-500/30" },
];

function LifeCoachView() {
  const [mode, setMode] = useState<CoachMode>("overview");
  const [coaching, setCoaching] = useState<CoachResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("kb_coach_progress");
      if (saved) setProgress(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const saveProgress = (entry: ProgressEntry) => {
    const updated = [...progress, entry];
    setProgress(updated);
    localStorage.setItem("kb_coach_progress", JSON.stringify(updated));
  };

  const getCoaching = async (selectedMode: CoachMode) => {
    setMode(selectedMode);
    setLoading(true);
    setError("");
    setCoaching(null);
    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: selectedMode }),
      });
      const data = await res.json();
      if (res.ok) {
        setCoaching(data);
        saveProgress({
          date: new Date().toISOString(),
          mode: selectedMode,
          score: data.overallScore,
          summary: data.summary,
        });
      } else {
        setError(data.error || "Failed to get coaching");
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "text-emerald-400";
    if (rating >= 6) return "text-yellow-400";
    if (rating >= 4) return "text-orange-400";
    return "text-red-400";
  };

  const getModeInfo = (m: CoachMode) => COACH_MODES.find((cm) => cm.key === m);

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold gradient-text">AI Life Coach</h2>
          <p className="text-sm text-[var(--text-secondary)]">Brutally honest. Based on your actual notes.</p>
        </div>
        <button onClick={() => setShowProgress(!showProgress)} className="tab-btn px-3 py-1.5 text-sm">
          {showProgress ? "Back" : `Progress (${progress.length})`}
        </button>
      </div>

      {showProgress ? (
        /* Progress History */
        <div className="space-y-2">
          {progress.length === 0 ? (
            <div className="glass-card p-6 text-center text-[var(--text-secondary)]">No coaching sessions yet. Pick a mode below to start.</div>
          ) : (
            [...progress].reverse().map((entry, i) => {
              const info = getModeInfo(entry.mode);
              return (
                <div key={i} className="glass-card p-3 flex items-center gap-3">
                  <span className="text-xl">{info?.icon || "\u{1F3AF}"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{info?.label || entry.mode}</span>
                      <span className={`font-black text-sm ${getRatingColor(entry.score)}`}>{entry.score}/10</span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] truncate">{entry.summary}</p>
                  </div>
                  <span className="text-xs text-[var(--text-secondary)] shrink-0">{new Date(entry.date).toLocaleDateString()}</span>
                </div>
              );
            })
          )}
        </div>
      ) : coaching ? (
        /* Results */
        <div className="fade-in">
          <button onClick={() => setCoaching(null)} className="tab-btn px-3 py-1.5 text-sm mb-4">&larr; Back to modes</button>

          <div className="glass-card p-6 mb-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">{getModeInfo(mode)?.icon}</span>
              <span className="font-bold text-lg">{getModeInfo(mode)?.label}</span>
            </div>
            <div className={`text-5xl font-black mb-2 ${getRatingColor(coaching.overallScore)}`}>
              {coaching.overallScore}/10
            </div>
            <p className="text-sm text-[var(--text-secondary)] max-w-xl mx-auto">{coaching.summary}</p>
          </div>

          <div className="space-y-4">
            {coaching.insights.map((insight, i) => {
              const info = getModeInfo(insight.domain as CoachMode);
              return (
                <div key={i} className={`rounded-2xl border p-5 bg-gradient-to-br ${info?.gradient || "from-purple-500/20 to-violet-600/10 border-purple-500/30"} backdrop-blur-sm`}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-bold capitalize">{insight.domain}</h3>
                      <p className="text-sm text-[var(--text-secondary)]">{insight.title}</p>
                    </div>
                    <div className={`text-2xl font-black ${getRatingColor(insight.rating)}`}>{insight.rating}/10</div>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">{insight.feedback}</p>
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Action Items</h4>
                    {insight.actionItems.map((item, j) => (
                      <div key={j} className="flex items-start gap-2 text-sm">
                        <span className="text-[var(--accent)] mt-0.5">&#x25B8;</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Mode Selection */
        <div className="space-y-3">
          {error && <div className="p-3 rounded-xl bg-red-500/10 text-red-300 text-sm">{error}</div>}

          {loading ? (
            <div className="glass-card p-12 text-center">
              <div className="spinner mx-auto mb-4" />
              <p className="text-[var(--text-secondary)]">Analyzing your life...</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">This takes 10-20 seconds</p>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {COACH_MODES.map((cm) => (
                <button
                  key={cm.key}
                  onClick={() => getCoaching(cm.key)}
                  className={`rounded-2xl border p-5 bg-gradient-to-br ${cm.gradient} backdrop-blur-sm text-left hover:scale-[1.02] transition-transform`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{cm.icon}</span>
                    <h3 className="font-bold">{cm.label}</h3>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">{cm.desc}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
