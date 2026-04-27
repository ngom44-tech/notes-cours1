import { useState, useRef, useEffect } from "react";

const COLORS = ["#FFD166", "#06D6A0", "#118AB2", "#EF476F", "#9B5DE5", "#F15BB5"];

const DEFAULT_COURSES = [
  { id: 1, name: "Mathematiques", color: "#118AB2" },
  { id: 2, name: "Physique-Chimie", color: "#06D6A0" },
  { id: 3, name: "Histoire", color: "#EF476F" }
];

const DEFAULT_NOTES = { 1: [], 2: [], 3: [] };

let ID = Date.now();
function uid() { return ++ID; }

function fmt(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
  });
}

function loadState() {
  try {
    var c = JSON.parse(localStorage.getItem("nc_courses"));
    var n = JSON.parse(localStorage.getItem("nc_notes"));
    return { courses: c || DEFAULT_COURSES, notes: n || DEFAULT_NOTES };
  } catch(e) {
    return { courses: DEFAULT_COURSES, notes: DEFAULT_NOTES };
  }
}

export default function App() {
  var saved = loadState();
  var [courses, setCourses] = useState(saved.courses);
  var [notes, setNotes] = useState(saved.notes);
  var [courseId, setCourseId] = useState(saved.courses[0] ? saved.courses[0].id : null);
  var [noteId, setNoteId] = useState(null);
  var [view, setView] = useState("courses");
  var [newName, setNewName] = useState("");
  var [newColor, setNewColor] = useState(COLORS[0]);
  var [adding, setAdding] = useState(false);
  var ta = useRef(null);

  useEffect(function() {
    localStorage.setItem("nc_courses", JSON.stringify(courses));
  }, [courses]);

  useEffect(function() {
    localStorage.setItem("nc_notes", JSON.stringify(notes));
  }, [notes]);

  var course = courses.find(function(c) { return c.id === courseId; });
  var courseNotes = notes[courseId] || [];
  var note = courseNotes.find(function(n) { return n.id === noteId; }) || null;
  var accent = course ? course.color : "#118AB2";

  function setField(field, value) {
    setNotes(function(prev) {
      var list = (prev[courseId] || []).map(function(n) {
        if (n.id === noteId) {
          var updated = {};
          Object.keys(n).forEach(function(k) { updated[k] = n[k]; });
          updated[field] = value;
          updated.updated = new Date();
          return updated;
        }
        return n;
      });
      var result = {};
      Object.keys(prev).forEach(function(k) { result[k] = prev[k]; });
      result[courseId] = list;
      return result;
    });
  }

  function insertAt(text) {
    var el = ta.current;
    if (!el || !note) return;
    var s = el.selectionStart;
    var e = el.selectionEnd;
    var body = note.body;
    var newBody = body.substring(0, s) + text + body.substring(e);
    setField("body", newBody);
    setTimeout(function() {
      el.focus();
      el.setSelectionRange(s + text.length, s + text.length);
    }, 10);
  }

  function newNote() {
    var id = uid();
    var n = { id: id, title: "", body: "", color: "#1e1e2c", created: new Date(), updated: new Date() };
    setNotes(function(prev) {
      var result = {};
      Object.keys(prev).forEach(function(k) { result[k] = prev[k]; });
      result[courseId] = [n].concat(prev[courseId] || []);
      return result;
    });
    setNoteId(id);
    setView("editor");
  }

  function deleteNote(id) {
    setNotes(function(prev) {
      var result = {};
      Object.keys(prev).forEach(function(k) { result[k] = prev[k]; });
      result[courseId] = (prev[courseId] || []).filter(function(n) { return n.id !== id; });
      return result;
    });
    if (noteId === id) { setNoteId(null); setView("notes"); }
  }

  function newCourse() {
    if (!newName.trim()) return;
    var id = uid();
    setCourses(function(prev) { return prev.concat([{ id: id, name: newName.trim(), color: newColor }]); });
    setNotes(function(prev) {
      var result = {};
      Object.keys(prev).forEach(function(k) { result[k] = prev[k]; });
      result[id] = [];
      return result;
    });
    setCourseId(id);
    setNoteId(null);
    setNewName("");
    setAdding(false);
    setView("notes");
  }

  function deleteCourse(id) {
    var rest = courses.filter(function(c) { return c.id !== id; });
    setCourses(rest);
    if (courseId === id) {
      setCourseId(rest[0] ? rest[0].id : null);
      setNoteId(null);
      setView("courses");
    }
  }

  var SYMBOLS = [
    { label: "racine", val: "racine(" },
    { label: "x2", val: "^2" },
    { label: "x3", val: "^3" },
    { label: "pi", val: "pi" },
    { label: "infini", val: "infini" },
    { label: "+-", val: "+-" },
    { label: "alpha", val: "alpha" },
    { label: "beta", val: "beta" },
    { label: "delta", val: "delta" },
    { label: "theta", val: "theta" },
    { label: "lambda", val: "lambda" },
    { label: "sigma", val: "sigma" },
    { label: "integrale", val: "integrale" },
    { label: "somme", val: "somme" },
    { label: "<=", val: "<=" },
    { label: ">=", val: ">=" },
    { label: "!=", val: "!=" },
    { label: "~=", val: "~=" },
    { label: "->", val: " -> " },
    { label: "<->", val: " <-> " },
    { label: "(s)", val: "(s)" },
    { label: "(l)", val: "(l)" },
    { label: "(g)", val: "(g)" },
    { label: "(aq)", val: "(aq)" },
    { label: "H+", val: "H+" },
    { label: "OH-", val: "OH-" },
    { label: "e-", val: "e-" },
    { label: "pH", val: "pH" },
    { label: "Ohm", val: "Ohm" },
    { label: "degC", val: " degC" },
    { label: "U=", val: "U = " },
    { label: "I=", val: "I = " },
    { label: "R=", val: "R = " },
    { label: "e-3", val: "x10^-3" },
    { label: "e-6", val: "x10^-6" },
    { label: "e3", val: "x10^3" },
    { label: "e6", val: "x10^6" }
  ];

  var DOT_COLORS = ["#1e1e2c", "#FFD166", "#06D6A0", "#118AB2", "#EF476F", "#9B5DE5"];

  if (view === "editor" && note) {
    return (
      React.createElement("div", { style: { minHeight: "100vh", background: "#111117", color: "#ddd", fontFamily: "sans-serif", display: "flex", flexDirection: "column" } },
        React.createElement("div", { style: { padding: "12px 16px", background: "#18181f", borderBottom: "1px solid #2a2a35", display: "flex", alignItems: "center", gap: 12 } },
          React.createElement("button", { onClick: function() { setView("notes"); }, style: { background: "none", border: "none", color: accent, cursor: "pointer", fontSize: 26, padding: 0 } }, "<"),
          React.createElement("span", { style: { flex: 1, fontSize: 13, color: "#777" } }, course ? course.name : ""),
          React.createElement("span", { style: { fontSize: 11, color: "#444" } }, fmt(note.updated))
        ),
        React.createElement("div", { style: { padding: "8px 12px", background: "#16161f", borderBottom: "1px solid #2a2a35", display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" } },
          DOT_COLORS.map(function(col) {
            return React.createElement("div", {
              key: col,
              onClick: function() { setField("color", col); },
              style: { width: 18, height: 18, borderRadius: "50%", background: col === "#1e1e2c" ? "#444" : col, cursor: "pointer", border: (note.color || "#1e1e2c") === col ? "2px solid #fff" : "2px solid transparent" }
            });
          })
        ),
        React.createElement("div", { style: { padding: "8px 12px", background: "#13131a", borderBottom: "1px solid #2a2a35", display: "flex", gap: 5, flexWrap: "wrap" } },
          SYMBOLS.map(function(s) {
            return React.createElement("button", {
              key: s.label,
              onClick: function() { insertAt(s.val); },
              style: { background: "#1e1e2c", border: "1px solid #2a2a3a", color: "#fff", borderRadius: 6, padding: "6px 10px", cursor: "pointer", fontSize: 13, whiteSpace: "nowrap" }
            }, s.label);
          })
        ),
        React.createElement("div", { style: { flex: 1, background: note.color || "#1e1e2c", display: "flex", flexDirection: "column" } },
          React.createElement("input", {
            value: note.title,
            onChange: function(e) { setField("title", e.target.value); },
            placeholder: "Titre",
            style: { padding: "20px 20px 10px", background: "none", border: "none", outline: "none", color: "#fff", fontSize: 22, fontWeight: 700, width: "100%", boxSizing: "border-box" }
          }),
          React.createElement("textarea", {
            ref: ta,
            value: note.body,
            onChange: function(e) { setField("body", e.target.value); },
            placeholder: "Ecris ta note ici...",
            style: { flex: 1, padding: "10px 20px", background: "none", border: "none", outline: "none", color: "#ccc", fontSize: 15, lineHeight: 1.8, resize: "none", width: "100%", boxSizing: "border-box", minHeight: 300 }
          })
        ),
        React.createElement("div", { style: { padding: "8px 20px", fontSize: 11, color: "#444", background: "#111117" } },
          (note.body.trim().split(/\s+/).filter(Boolean).length) + " mots"
        )
      )
    );
  }

  if (view === "notes") {
    return (
      React.createElement("div", { style: { minHeight: "100vh", background: "#111117", color: "#ddd", fontFamily: "sans-serif", display: "flex", flexDirection: "column" } },
        React.createElement("div", { style: { padding: "12px 16px", background: "#18181f", borderBottom: "1px solid #2a2a35", display: "flex", alignItems: "center", gap: 12 } },
          React.createElement("button", { onClick: function() { setView("courses"); }, style: { background: "none", border: "none", color: accent, cursor: "pointer", fontSize: 26, padding: 0 } }, "<"),
          React.createElement("span", { style: { flex: 1, fontWeight: 700, fontSize: 16, color: "#fff" } }, course ? course.name : ""),
          React.createElement("button", { onClick: newNote, style: { background: accent, color: "#000", border: "none", borderRadius: 8, padding: "7px 16px", cursor: "pointer", fontWeight: 700, fontSize: 13 } }, "+ Note")
        ),
        React.createElement("div", { style: { flex: 1 } },
          courseNotes.length === 0 && React.createElement("div", { style: { color: "#444", textAlign: "center", padding: "60px 20px", fontSize: 14 } },
            React.createElement("div", { style: { fontSize: 48, marginBottom: 12 } }, "📝"),
            "Appuie sur + Note pour commencer"
          ),
          courseNotes.map(function(n) {
            return React.createElement("div", {
              key: n.id,
              onClick: function() { setNoteId(n.id); setView("editor"); },
              style: { padding: "14px 20px", borderBottom: "1px solid #1e1e26", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, borderLeft: "4px solid " + (n.color && n.color !== "#1e1e2c" ? n.color : "transparent") }
            },
              React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                React.createElement("div", { style: { fontSize: 15, fontWeight: 600, color: "#fff", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" } }, n.title || "Sans titre"),
                React.createElement("div", { style: { fontSize: 12, color: "#555", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", marginTop: 2 } }, n.body || "Note vide"),
                React.createElement("div", { style: { fontSize: 10, color: "#383838", marginTop: 4 } }, fmt(n.updated))
              ),
              React.createElement("button", {
                onClick: function(e) { e.stopPropagation(); deleteNote(n.id); },
                style: { background: "none", border: "none", color: "#EF476F", cursor: "pointer", fontSize: 20, padding: "0 4px" }
              }, "x")
            );
          })
        )
      )
    );
  }

  return (
    React.createElement("div", { style: { minHeight: "100vh", background: "#111117", color: "#ddd", fontFamily: "sans-serif", display: "flex", flexDirection: "column" } },
      React.createElement("div", { style: { padding: "24px 20px 12px" } },
        React.createElement("div", { style: { fontSize: 11, letterSpacing: 3, color: "#555", textTransform: "uppercase", marginBottom: 16 } }, "Mes cours")
      ),
      React.createElement("div", { style: { flex: 1 } },
        courses.map(function(c) {
          return React.createElement("div", {
            key: c.id,
            onClick: function() { setCourseId(c.id); setNoteId(null); setView("notes"); },
            style: { padding: "16px 20px", borderBottom: "1px solid #1e1e26", cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }
          },
            React.createElement("span", { style: { width: 14, height: 14, borderRadius: "50%", background: c.color, flexShrink: 0 } }),
            React.createElement("span", { style: { flex: 1, fontSize: 16, color: "#fff", fontWeight: 500 } }, c.name),
            React.createElement("span", { style: { fontSize: 12, color: "#555", marginRight: 8 } }, (notes[c.id] || []).length + " notes"),
            React.createElement("button", {
              onClick: function(e) { e.stopPropagation(); deleteCourse(c.id); },
              style: { background: "none", border: "none", color: "#EF476F", cursor: "pointer", fontSize: 20, padding: "0 4px" }
            }, "x")
          );
        })
      ),
      React.createElement("div", { style: { padding: 20 } },
        adding ? React.createElement("div", { style: { background: "#18181f", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 10 } },
          React.createElement("input", {
            autoFocus: true,
            value: newName,
            onChange: function(e) { setNewName(e.target.value); },
            onKeyDown: function(e) { if (e.key === "Enter") newCourse(); },
            placeholder: "Nom du cours",
            style: { background: "#222", border: "1px solid #333", borderRadius: 8, color: "#fff", padding: "10px 12px", fontSize: 15, outline: "none" }
          }),
          React.createElement("div", { style: { display: "flex", gap: 8 } },
            COLORS.map(function(col) {
              return React.createElement("div", {
                key: col,
                onClick: function() { setNewColor(col); },
                style: { width: 28, height: 28, borderRadius: "50%", background: col, cursor: "pointer", border: newColor === col ? "3px solid #fff" : "3px solid transparent", flexShrink: 0 }
              });
            })
          ),
          React.createElement("div", { style: { display: "flex", gap: 10 } },
            React.createElement("button", { onClick: newCourse, style: { flex: 1, background: newColor, color: "#000", border: "none", borderRadius: 8, padding: "10px", cursor: "pointer", fontWeight: 700, fontSize: 14 } }, "Creer"),
            React.createElement("button", { onClick: function() { setAdding(false); }, style: { flex: 1, background: "#222", color: "#888", border: "none", borderRadius: 8, padding: "10px", cursor: "pointer", fontSize: 14 } }, "Annuler")
          )
        ) : React.createElement("button", {
          onClick: function() { setAdding(true); },
          style: { width: "100%", background: "none", border: "2px dashed #2a2a35", color: "#555", borderRadius: 12, padding: "14px", cursor: "pointer", fontSize: 15 }
        }, "+ Nouveau cours")
      )
    )
  );
}
