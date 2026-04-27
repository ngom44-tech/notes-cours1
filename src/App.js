import { useState } from "react";

const COLORS = ["#FFD166","#06D6A0","#118AB2","#EF476F","#9B5DE5","#F15BB5"];
let ID = Date.now();
const uid = () => ++ID;

export default function App() {
  const [courses, setCourses] = useState([
    {id:1,name:"Mathematiques",color:"#118AB2"},
    {id:2,name:"Physique-Chimie",color:"#06D6A0"},
    {id:3,name:"Histoire",color:"#EF476F"}
  ]);
  const [notes, setNotes] = useState({1:[],2:[],3:[]});
  const [cid, setCid] = useState(1);
  const [nid, setNid] = useState(null);
  const [view, setView] = useState("courses");
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(COLORS[0]);
  const [adding, setAdding] = useState(false);

  const course = courses.find(c => c.id === cid);
  const cNotes = notes[cid] || [];
  const note = cNotes.find(n => n.id === nid) || null;
  const accent = course ? course.color : "#118AB2";

  const setField = (field, value) => {
    setNotes(prev => ({
      ...prev,
      [cid]: prev[cid].map(n => n.id === nid ? {...n, [field]: value} : n)
    }));
  };

  const addNote = () => {
    const id = uid();
    setNotes(prev => ({...prev, [cid]: [{id,title:"",body:"",color:"#1e1e2c"},...(prev[cid]||[])]}));
    setNid(id);
    setView("editor");
  };

  const delNote = id => {
    setNotes(prev => ({...prev, [cid]: prev[cid].filter(n => n.id !== id)}));
    if (nid === id) { setNid(null); setView("notes"); }
  };

  const addCourse = () => {
    if (!newName.trim()) return;
    const id = uid();
    setCourses(prev => [...prev, {id, name:newName.trim(), color:newColor}]);
    setNotes(prev => ({...prev, [id]:[]}));
    setCid(id);
    setNewName("");
    setAdding(false);
    setView("notes");
  };

  const delCourse = id => {
    const rest = courses.filter(c => c.id !== id);
    setCourses(rest);
    if (cid === id) { setCid(rest[0]?.id||null); setView("courses"); }
  };

  const SYMS = [
    "racine(","^2","^3","pi","infini","+-","alpha","beta","delta","theta",
    "lambda","sigma","<=",">=","!=","->","<->","(s)","(l)","(g)","(aq)",
    "H+","OH-","e-","pH","Ohm","degC","U=","I=","R=","x10^-3","x10^3","x10^6"
  ];

  const s = {
    page: {minHeight:"100vh",background:"#111117",color:"#ddd",fontFamily:"sans-serif",display:"flex",flexDirection:"column"},
    bar: {padding:"12px 16px",background:"#18181f",borderBottom:"1px solid #2a2a35",display:"flex",alignItems:"center",gap:12},
    back: {background:"none",border:"none",color:accent,cursor:"pointer",fontSize:26,padding:0},
    btn: {background:accent,color:"#000",border:"none",borderRadius:8,padding:"7px 16px",cursor:"pointer",fontWeight:700,fontSize:13},
  };

  if (view === "editor" && note) return (
    <div style={s.page}>
      <div style={s.bar}>
        <button style={s.back} onClick={() => setView("notes")}>{"<"}</button>
        <span style={{flex:1,fontSize:13,color:"#777"}}>{course?.name}</span>
      </div>
      <div style={{padding:"8px 12px",background:"#13131a",borderBottom:"1px solid #2a2a35",display:"flex",gap:6,flexWrap:"wrap"}}>
        {["#1e1e2c","#FFD166","#06D6A0","#118AB2","#EF476F","#9B5DE5"].map(col => (
          <div key={col} onClick={() => setField("color",col)}
            style={{width:18,height:18,borderRadius:"50%",background:col==="#1e1e2c"?"#444":col,cursor:"pointer",border:(note.color||"#1e1e2c")===col?"2px solid #fff":"2px solid transparent"}}/>
        ))}
      </div>
      <div style={{padding:"6px 12px",background:"#16161f",borderBottom:"1px solid #2a2a35",display:"flex",gap:5,flexWrap:"wrap"}}>
        {SYMS.map(sym => (
          <button key={sym} onClick={() => {
            const ta = document.getElementById("ta");
            if (!ta) return;
            const s2 = ta.selectionStart;
            const newBody = note.body.substring(0,s2)+sym+note.body.substring(ta.selectionEnd);
            setField("body", newBody);
            setTimeout(() => { ta.focus(); ta.setSelectionRange(s2+sym.length,s2+sym.length); },10);
          }} style={{background:"#1e1e2c",border:"1px solid #333",color:"#fff",borderRadius:6,padding:"5px 8px",cursor:"pointer",fontSize:12,whiteSpace:"nowrap"}}>
            {sym}
          </button>
        ))}
      </div>
      <div style={{flex:1,background:note.color||"#1e1e2c",display:"flex",flexDirection:"column"}}>
        <input value={note.title} onChange={e => setField("title",e.target.value)} placeholder="Titre"
          style={{padding:"20px 20px 10px",background:"none",border:"none",outline:"none",color:"#fff",fontSize:22,fontWeight:700,width:"100%",boxSizing:"border-box"}}/>
        <textarea id="ta" value={note.body} onChange={e => setField("body",e.target.value)} placeholder="Ecris ta note ici..."
          style={{flex:1,padding:"10px 20px",background:"none",border:"none",outline:"none",color:"#ccc",fontSize:15,lineHeight:1.8,resize:"none",width:"100%",boxSizing:"border-box",minHeight:300}}/>
      </div>
    </div>
  );

  if (view === "notes") return (
    <div style={s.page}>
      <div style={s.bar}>
        <button style={s.back} onClick={() => setView("courses")}>{"<"}</button>
        <span style={{flex:1,fontWeight:700,fontSize:16,color:"#fff"}}>{course?.name}</span>
        <button style={s.btn} onClick={addNote}>+ Note</button>
      </div>
      <div style={{flex:1}}>
        {cNotes.length === 0 && <div style={{color:"#444",textAlign:"center",padding:"60px 20px"}}>
          <div style={{fontSize:48,marginBottom:12}}>📝</div>Appuie sur + Note
        </div>}
        {cNotes.map(n => (
          <div key={n.id} onClick={() => {setNid(n.id);setView("editor");}}
            style={{padding:"14px 20px",borderBottom:"1px solid #1e1e26",cursor:"pointer",display:"flex",alignItems:"center",gap:12,borderLeft:"4px solid "+(n.color&&n.color!=="#1e1e2c"?n.color:"transparent")}}>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:15,fontWeight:600,color:"#fff",overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{n.title||"Sans titre"}</div>
              <div style={{fontSize:12,color:"#555",overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis",marginTop:2}}>{n.body||"Note vide"}</div>
            </div>
            <button onClick={e => {e.stopPropagation();delNote(n.id);}} style={{background:"none",border:"none",color:"#EF476F",cursor:"pointer",fontSize:20,padding:"0 4px"}}>x</button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={s.page}>
      <div style={{padding:"24px 20px 12px"}}>
        <div style={{fontSize:11,letterSpacing:3,color:"#555",textTransform:"uppercase",marginBottom:16}}>Mes cours</div>
      </div>
      <div style={{flex:1}}>
        {courses.map(c => (
          <div key={c.id} onClick={() => {setCid(c.id);setNid(null);setView("notes");}}
            style={{padding:"16px 20px",borderBottom:"1px solid #1e1e26",cursor:"pointer",display:"flex",alignItems:"center",gap:14}}>
            <span style={{width:14,height:14,borderRadius:"50%",background:c.color,flexShrink:0}}/>
            <span style={{flex:1,fontSize:16,color:"#fff",fontWeight:500}}>{c.name}</span>
            <span style={{fontSize:12,color:"#555",marginRight:8}}>{(notes[c.id]||[]).length} notes</span>
            <button onClick={e => {e.stopPropagation();delCourse(c.id);}} style={{background:"none",border:"none",color:"#EF476F",cursor:"pointer",fontSize:20,padding:"0 4px"}}>x</button>
          </div>
        ))}
      </div>
      <div style={{padding:20}}>
        {adding ? (
          <div style={{background:"#18181f",borderRadius:12,padding:16,display:"flex",flexDirection:"column",gap:10}}>
            <input autoFocus value={newName} onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key==="Enter"&&addCourse()} placeholder="Nom du cours"
              style={{background:"#222",border:"1px solid #333",borderRadius:8,color:"#fff",padding:"10px 12px",fontSize:15,outline:"none"}}/>
            <div style={{display:"flex",gap:8}}>
              {COLORS.map(col => (
                <div key={col} onClick={() => setNewColor(col)}
                  style={{width:28,height:28,borderRadius:"50%",background:col,cursor:"pointer",border:newColor===col?"3px solid #fff":"3px solid transparent",flexShrink:0}}/>
              ))}
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={addCourse} style={{flex:1,background:newColor,color:"#000",border:"none",borderRadius:8,padding:"10px",cursor:"pointer",fontWeight:700,fontSize:14}}>Creer</button>
              <button onClick={() => setAdding(false)} style={{flex:1,background:"#222",color:"#888",border:"none",borderRadius:8,padding:"10px",cursor:"pointer",fontSize:14}}>Annuler</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setAdding(true)}
            style={{width:"100%",background:"none",border:"2px dashed #2a2a35",color:"#555",borderRadius:12,padding:"14px",cursor:"pointer",fontSize:15}}>
            + Nouveau cours
          </button>
        )}
      </div>
    </div>
  );
      }
