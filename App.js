import { useState, useRef, useEffect } from "react";

const COURSE_COLORS = ["#FFD166", "#06D6A0", "#118AB2", "#EF476F", "#9B5DE5", "#F15BB5"];
const NOTE_DOT_COLORS = ["#1e1e2c", "#FFD166", "#06D6A0", "#118AB2", "#EF476F", "#9B5DE5"];

const SYMBOL_TABS = [
  {
    id: "math", label: "∑ Maths",
    groups: [
      { name: "Opérations", symbols: [
        { label: "√", insert: "√" }, { label: "∛", insert: "∛" }, { label: "²", insert: "²" },
        { label: "³", insert: "³" }, { label: "×", insert: "×" }, { label: "÷", insert: "÷" },
        { label: "±", insert: "±" }, { label: "∞", insert: "∞" }, { label: "π", insert: "π" },
      ]},
      { name: "Comparaisons", symbols: [
        { label: "≠", insert: "≠" }, { label: "≈", insert: "≈" }, { label: "≤", insert: "≤" },
        { label: "≥", insert: "≥" }, { label: "≡", insert: "≡" },
      ]},
      { name: "Calcul", symbols: [
        { label: "∑", insert: "∑" }, { label: "∏", insert: "∏" }, { label: "∫", insert: "∫" },
        { label: "∂", insert: "∂" }, { label: "Δ", insert: "Δ" }, { label: "∇", insert: "∇" },
      ]},
      { name: "Lettres grecques", symbols: [
        { label: "α", insert: "α" }, { label: "β", insert: "β" }, { label: "γ", insert: "γ" },
        { label: "θ", insert: "θ" }, { label: "λ", insert: "λ" }, { label: "μ", insert: "μ" },
        { label: "σ", insert: "σ" }, { label: "ω", insert: "ω" }, { label: "φ", insert: "φ" },
      ]},
      { name: "Ensembles & logique", symbols: [
        { label: "∈", insert: "∈" }, { label: "∉", insert: "∉" }, { label: "⊂", insert: "⊂" },
        { label: "∪", insert: "∪" }, { label: "∩", insert: "∩" }, { label: "∅", insert: "∅" },
        { label: "∀", insert: "∀" }, { label: "∃", insert: "∃" }, { label: "⇒", insert: "⇒" },
        { label: "⇔", insert: "⇔" },
      ]},
    ],
  },
  {
    id: "physics", label: "⚡ Physique",
    groups: [
      { name: "Unités SI", symbols: [
        { label: "Ω", insert: "Ω" }, { label: "μ", insert: "μ" }, { label: "η", insert: "η" },
        { label: "°C", insert: "°C" }, { label: "K", insert: "K" }, { label: "Hz", insert: "Hz" },
        { label: "J", insert: "J" }, { label: "W", insert: "W" }, { label: "eV", insert: "eV" },
      ]},
      { name: "Mécanique", symbols: [
        { label: "F⃗", insert: "F⃗" }, { label: "v⃗", insert: "v⃗" }, { label: "a⃗", insert: "a⃗" },
        { label: "p⃗", insert: "p⃗" }, { label: "Σ", insert: "Σ" }, { label: "ρ", insert: "ρ" },
      ]},
      { name: "Électricité", symbols: [
        { label: "U=", insert: "U = " }, { label: "I=", insert: "I = " }, { label: "R=", insert: "R = " },
        { label: "P=", insert: "P = " }, { label: "ε", insert: "ε" }, { label: "φ", insert: "φ" },
      ]},
      { name: "Optique & ondes", symbols: [
        { label: "λ", insert: "λ" }, { label: "ν", insert: "ν" },
        { label: "c=", insert: "c = 3×10⁸ m/s" }, { label: "h=", insert: "h = 6.626×10⁻³⁴ J·s" },
        { label: "∠", insert: "∠" },
      ]},
      { name: "Puissances de 10", symbols: [
        { label: "×10⁻⁹", insert: "×10⁻⁹" }, { label: "×10⁻⁶", insert: "×10⁻⁶" },
        { label: "×10⁻³", insert: "×10⁻³" }, { label: "×10³", insert: "×10³" },
        { label: "×10⁶", insert: "×10⁶" }, { label: "×10⁹", insert: "×10⁹" },
        { label: "⁻¹", insert: "⁻¹" }, { label: "⁻²", insert: "⁻²" },
      ]},
    ],
  },
  {
    id: "chemistry", label: "⚗️ Chimie",
    groups: [
      { name: "Réactions", symbols: [
        { label: "→", insert: " → " }, { label: "⇌", insert: " ⇌ " },
        { label: "↑", insert: "↑" }, { label: "↓", insert: "↓" },
        { label: "Δ", insert: "Δ" }, { label: "⚡", insert: "⚡" },
      ]},
      { name: "États", symbols: [
        { label: "(s)", insert: "(s)" }, { label: "(l)", insert: "(l)" },
        { label: "(g)", insert: "(g)" }, { label: "(aq)", insert: "(aq)" },
      ]},
      { name: "Charges", symbols: [
        { label: "δ+", insert: "δ+" }, { label: "δ-", insert: "δ-" },
        { label: "⁺", insert: "⁺" }, { label: "⁻", insert: "⁻" },
        { label: "e⁻", insert: "e⁻" }, { label: "H⁺", insert: "H⁺" }, { label: "OH⁻", insert: "OH⁻" },
      ]},
      { name: "Indices", symbols: [
        { label: "₁", insert: "₁" }, { label: "₂", insert: "₂" }, { label: "₃", insert: "₃" },
        { label: "₄", insert: "₄" }, { label: "₆", insert: "₆" }, { label: "ₙ", insert: "ₙ" },
      ]},
      { name: "Constantes", symbols: [
        { label: "Kₐ", insert: "Kₐ" }, { label: "pH", insert: "pH" }, { label: "pKₐ", insert: "pKₐ" },
        { label: "Nₐ", insert: "Nₐ = 6.022×10²³" }, { label: "R=", insert: "R = 8.314 J/mol·K" },
      ]},
    ],
  },
];

let ID = Date.now();
const uid = () => ++ID;
const fmt = (d) => d ? new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "";

const DEFAULT_COURSES = [
  { id: 1, name: "Mathématiques", color: "#118AB2" },
  { id: 2, name: "Physique-Chimie", color: "#06D6A0" },
  { id: 3, name: "Histoire", color: "#EF476F" },
];
const DEFAULT_NOTES = { 1: [], 2: [], 3: [] };

function loadState() {
  try {
    const courses = JSON.parse(localStorage.getItem("nc_courses"));
    const notes = JSON.parse(localStorage.getItem("nc_notes"));
    return { courses: courses || DEFAULT_COURSES, notes: notes || DEFAULT_NOTES };
  } catch { return { courses: DEFAULT_COURSES, notes: DEFAULT_NOTES }; }
}

export default function App() {
  const saved = loadState();
  const [courses, setCourses] = useState(saved.courses);
  const [notesByCourse, setNotesByCourse] = useState(saved.notes);
  const [activeCourseId, setActiveCourseId] = useState(saved.courses[0]?.id || null);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseColor, setNewCourseColor] = useState(COURSE_COLORS[0]);
  const [addingCourse, setAddingCourse] = useState(false);
  const [view, setView] = useState("courses");
  const [activeSymTab, setActiveSymTab] = useState(null);
  const taRef = useRef(null);

  // Persist to localStorage
  useEffect(() => { localStorage.setItem("nc_courses", JSON.stringify(courses)); }, [courses]);
  useEffect(() => { localStorage.setItem("nc_notes", JSON.stringify(notesByCourse)); }, [notesByCourse]);

  const activeCourse = courses.find((c) => c.id === activeCourseId);
  const allNotes = notesByCourse[activeCourseId] || [];
  const activeNote = allNotes.find((n) => n.id === activeNoteId) || null;
  const accent = activeCourse?.color || "#118AB2";
  const currentTab = SYMBOL_TABS.find((t) => t.id === activeSymTab);

  function updateNote(field, value) {
    setNotesByCourse((prev) => ({
      ...prev,
      [activeCourseId]: prev[activeCourseId].map((n) =>
        n.id === activeNoteId ? { ...n, [field]: value, updated: new Date() } : n
      ),
    }));
  }

  function insertSymbol(symbol) {
    const ta = taRef.current;
    if (!ta || !activeNote) return;
    const start = ta.selectionStart, end = ta.selectionEnd;
    const newBody = activeNote.body.substring(0, start) + symbol + activeNote.body.substring(end);
    updateNote("body", newBody);
    setTimeout(() => { ta.focus(); ta.setSelectionRange(start + symbol.length, start + symbol.length); }, 10);
  }

  function wrap(before, after = before) {
    const ta = taRef.current;
    if (!ta || !activeNote) return;
    const start = ta.selectionStart, end = ta.selectionEnd;
    const selected = activeNote.body.substring(start, end);
    const newBody = activeNote.body.substring(0, start) + before + selected + after + activeNote.body.substring(end);
    updateNote("body", newBody);
    setTimeout(() => { ta.focus(); ta.setSelectionRange(start + before.length, end + before.length); }, 10);
  }

  function insertLine(prefix) {
    const ta = taRef.current;
    if (!ta || !activeNote) return;
    const start = ta.selectionStart;
    const before = activeNote.body.substring(0, start);
    const after = activeNote.body.substring(start);
    const lineStart = before.lastIndexOf("\n") + 1;
    const newBody = before.substring(0, lineStart) + prefix + before.substring(lineStart) + after;
    updateNote("body", newBody);
    setTimeout(() => { ta.focus(); ta.setSelectionRange(start + prefix.length, start + prefix.length); }, 10);
  }

  function createNote() {
    const id = uid();
    setNotesByCourse((prev) => ({
      ...prev,
      [activeCourseId]: [{ id, title: "", body: "", color: "#1e1e2c", created: new Date(), updated: new Date() }, ...(prev[activeCourseId] || [])],
    }));
    setActiveNoteId(id);
    setView("editor");
    setActiveSymTab(null);
  }

  function removeNote(id) {
    setNotesByCourse((prev) => ({
      ...prev,
      [activeCourseId]: prev[activeCourseId].filter((n) => n.id !== id),
    }));
    if (activeNoteId === id) { setActiveNoteId(null); setView("notes"); }
  }

  function createCourse() {
    if (!newCourseName.trim()) return;
    const id = uid();
    setCourses((prev) => [...prev, { id, name: newCourseName.trim(), color: newCourseColor }]);
    setNotesByCourse((prev) => ({ ...prev, [id]: [] }));
    setActiveCourseId(id);
    setActiveNoteId(null);
    setNewCourseName("");
    setAddingCourse(false);
    setView("notes");
  }

  function removeCourse(id) {
    const rest = courses.filter((c) => c.id !== id);
    setCourses(rest);
    setNotesByCourse((prev) => { const n = { ...prev }; delete n[id]; return n; });
    if (activeCourseId === id) { setActiveCourseId(rest[0]?.id || null); setActiveNoteId(null); setView("courses"); }
  }

  function exportPDF() {
    if (!activeNote) return;
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>body{font-family:Georgia,serif;max-width:700px;margin:40px auto;color:#222;line-height:1.8}
h1{font-size:26px;border-bottom:2px solid #ddd;padding-bottom:10px}
.meta{color:#888;font-size:12px;margin-bottom:24px}
pre{white-space:pre-wrap;font-family:Georgia,serif;font-size:15px}
</style></head><body>
<h1>${activeNote.title || "Sans titre"}</h1>
<div class="meta">${activeCourse?.name} · Modifié le ${fmt(activeNote.updated)}</div>
<pre>${activeNote.body
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
  .replace(/\*(.+?)\*/g, "<em>$1</em>")
  .replace(/^# (.+)$/gm, "<h2>$1</h2>")
  .replace(/^## (.+)$/gm, "<h3>$1</h3>")
  .replace(/^- (.+)$/gm, "• $1")
}</pre></body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${activeNote.title || "note"}.html`; a.click();
    URL.revokeObjectURL(url);
  }

  // ── EDITOR ────────────────────────────────────────────────
  if (view === "editor" && activeNote) return (
    <div style={{ minHeight: "100vh", background: "#111117", color: "#ddd", fontFamily: "sans-serif", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "12px 16px", background: "#18181f", borderBottom: "1px solid #2a2a35", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => setView("notes")} style={{ background: "none", border: "none", color: accent, cursor: "pointer", fontSize: 26, padding: 0, lineHeight: 1 }}>‹</button>
        <span style={{ fontSize: 13, color: "#777", flex: 1 }}>{activeCourse?.name}</span>
        <span style={{ fontSize: 11, color: "#444" }}>{fmt(activeNote.updated)}</span>
        <button onClick={exportPDF} style={{ background: accent, color: "#000", border: "none", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>↓ PDF</button>
      </div>

      {/* Format bar */}
      <div style={{ display: "flex", gap: 5, padding: "8px 12px", background: "#16161f", borderBottom: "1px solid #2a2a35", alignItems: "center", flexWrap: "wrap" }}>
        <button onClick={() => wrap("**")} style={{ background: "#222", border: "1px solid #333", color: "#ccc", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>G</button>
        <button onClick={() => wrap("*")} style={{ background: "#222", border: "1px solid #333", color: "#ccc", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: 13, fontStyle: "italic" }}>I</button>
        <button onClick={() => insertLine("# ")} style={{ background: "#222", border: "1px solid #333", color: "#ccc", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: 13 }}>H1</button>
        <button onClick={() => insertLine("- ")} style={{ background: "#222", border: "1px solid #333", color: "#ccc", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: 13 }}>•</button>
        <div style={{ width: 1, height: 22, background: "#333", margin: "0 2px" }} />
        {SYMBOL_TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveSymTab(activeSymTab === tab.id ? null : tab.id)}
            style={{ background: activeSymTab === tab.id ? accent : "#222", color: activeSymTab === tab.id ? "#000" : "#ccc", border: `1px solid ${activeSymTab === tab.id ? accent : "#333"}`, borderRadius: 6, padding: "5px 8px", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>
            {tab.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        {NOTE_DOT_COLORS.map((col) => (
          <div key={col} onClick={() => updateNote("color", col)}
            style={{ width: 17, height: 17, borderRadius: "50%", background: col === "#1e1e2c" ? "#444" : col, cursor: "pointer", border: (activeNote.color || "#1e1e2c") === col ? "2px solid #fff" : "2px solid transparent" }} />
        ))}
      </div>

      {/* Symbol keyboard */}
      {currentTab && (
        <div style={{ background: "#13131a", borderBottom: "1px solid #2a2a35", padding: "10px 12px", maxHeight: 240, overflowY: "auto" }}>
          {currentTab.groups.map((group) => (
            <div key={group.name} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, color: "#555", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{group.name}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {group.symbols.map(({ label, insert }) => (
                  <button key={label} onClick={() => insertSymbol(insert)}
                    style={{ background: "#1e1e2c", border: "1px solid #2a2a3a", color: "#fff", borderRadius: 8, padding: "7px 10px", cursor: "pointer", fontSize: 16, minWidth: 40, fontFamily: "serif", lineHeight: 1, whiteSpace: "nowrap" }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ flex: 1, background: activeNote.color || "#1e1e2c", display: "flex", flexDirection: "column" }}>
        <input value={activeNote.title} onChange={(e) => updateNote("title", e.target.value)} placeholder="Titre de la note…"
          style={{ padding: "20px 20px 10px", background: "none", border: "none", outline: "none", color: "#fff", fontSize: 22, fontWeight: 700, fontFamily: "sans-serif", width: "100%", boxSizing: "border-box" }} />
        <textarea ref={taRef} value={activeNote.body} onChange={(e) => updateNote("body", e.target.value)} placeholder="Écris ta note ici…"
          style={{ flex: 1, padding: "10px 20px 20px", background: "none", border: "none", outline: "none", color: "#ccc", fontSize: 15, lineHeight: 1.8, resize: "none", fontFamily: "monospace", width: "100%", boxSizing: "border-box", minHeight: 300 }} />
      </div>
      <div style={{ padding: "8px 20px", borderTop: "1px solid #1e1e28", fontSize: 11, color: "#444", background: "#111117" }}>
        {activeNote.body.trim().split(/\s+/).filter(Boolean).length} mots · {activeNote.body.length} caractères
      </div>
    </div>
  );

  // ── NOTES LIST ────────────────────────────────────────────
  if (view === "notes") return (
    <div style={{ minHeight: "100vh", background: "#111117", color: "#ddd", fontFamily: "sans-serif", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "12px 16px", background: "#18181f", borderBottom: "1px solid #2a2a35", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => setView("courses")} style={{ background: "none", border: "none", color: accent, cursor: "pointer", fontSize: 26, padding: 0, lineHeight: 1 }}>‹</button>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: accent, boxShadow: `0 0 8px ${accent}88`, flexShrink: 0 }} />
        <span style={{ fontWeight: 700, fontSize: 16, color: "#fff", flex: 1 }}>{activeCourse?.name}</span>
        <button onClick={createNote} style={{ background: accent, color: "#000", border: "none", borderRadius: 8, padding: "7px 16px", cursor: "pointer", fontWeight: 700, fontSize: 13 }}>+ Note</button>
      </div>
      <div style={{ flex: 1 }}>
        {allNotes.length === 0 && (
          <div style={{ color: "#444", fontSize: 14, textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📝</div>
            Appuie sur "+ Note" pour commencer
          </div>
        )}
        {allNotes.map((note) => (
          <div key={note.id} onClick={() => { setActiveNoteId(note.id); setView("editor"); }}
            style={{ padding: "14px 20px", borderBottom: "1px solid #1e1e26", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, borderLeft: `4px solid ${note.color && note.color !== "#1e1e2c" ? note.color : "transparent"}` }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#fff", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{note.title || "Sans titre"}</div>
              <div style={{ fontSize: 12, color: "#555", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", marginTop: 2 }}>{note.body || "Note vide"}</div>
              <div style={{ fontSize: 10, color: "#383838", marginTop: 4 }}>{fmt(note.updated)}</div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); removeNote(note.id); }}
              style={{ background: "none", border: "none", color: "#EF476F", cursor: "pointer", fontSize: 20, padding: "0 4px", lineHeight: 1, flexShrink: 0 }}>×</button>
          </div>
        ))}
      </div>
    </div>
  );

  // ── COURSES ───────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#111117", color: "#ddd", fontFamily: "sans-serif", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "24px 20px 12px" }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: "#555", textTransform: "uppercase", marginBottom: 16 }}>📓 Mes cours</div>
      </div>
      <div style={{ flex: 1 }}>
        {courses.map((c) => (
          <div key={c.id} onClick={() => { setActiveCourseId(c.id); setActiveNoteId(null); setView("notes"); }}
            style={{ padding: "16px 20px", borderBottom: "1px solid #1e1e26", cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ width: 14, height: 14, borderRadius: "50%", background: c.color, flexShrink: 0, boxShadow: `0 0 10px ${c.color}88` }} />
            <span style={{ flex: 1, fontSize: 16, color: "#fff", fontWeight: 500 }}>{c.name}</span>
            <span style={{ fontSize: 12, color: "#555", marginRight: 8 }}>{(notesByCourse[c.id] || []).length} notes</span>
            <button onClick={(e) => { e.stopPropagation(); removeCourse(c.id); }}
              style={{ background: "none", border: "none", color: "#EF476F", cursor: "pointer", fontSize: 20, padding: "0 4px", lineHeight: 1 }}>×</button>
          </div>
        ))}
      </div>
      <div style={{ padding: 20 }}>
        {addingCourse ? (
          <div style={{ background: "#18181f", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            <input autoFocus value={newCourseName} onChange={(e) => setNewCourseName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createCourse()} placeholder="Nom du cours"
              style={{ background: "#222", border: "1px solid #333", borderRadius: 8, color: "#fff", padding: "10px 12px", fontSize: 15, outline: "none" }} />
            <div style={{ display: "flex", gap: 8 }}>
              {COURSE_COLORS.map((col) => (
                <div key={col} onClick={() => setNewCourseColor(col)}
                  style={{ width: 28, height: 28, borderRadius: "50%", background: col, cursor: "pointer", border: newCourseColor === col ? "3px solid #fff" : "3px solid transparent", flexShrink: 0 }} />
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={createCourse} style={{ flex: 1, background: newCourseColor, color: "#000", border: "none", borderRadius: 8, padding: "10px", cursor: "pointer", fontWeight: 700, fontSize: 14 }}>Créer</button>
              <button onClick={() => setAddingCourse(false)} style={{ flex: 1, background: "#222", color: "#888", border: "none", borderRadius: 8, padding: "10px", cursor: "pointer", fontSize: 14 }}>Annuler</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setAddingCourse(true)}
            style={{ width: "100%", background: "none", border: "2px dashed #2a2a35", color: "#555", borderRadius: 12, padding: "14px", cursor: "pointer", fontSize: 15 }}>
            + Nouveau cours
          </button>
        )}
      </div>
    </div>
  );
}
