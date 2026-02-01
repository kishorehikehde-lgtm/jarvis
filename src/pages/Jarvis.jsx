import { useEffect, useState, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════
   INJECTED STYLESHEET
   All animations, hover states, and transitions live here.
   ═══════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&family=Exo+2:wght@300;400;600&display=swap');

.jarvis-root {
  --bg-0:#020408; --bg-1:#0a0e1a; --bg-2:#111828;
  --accent:#00e5ff; --accent-dim:rgba(0,229,255,.15); --accent-glow:rgba(0,229,255,.4);
  --hot:#ff3c6e; --hot-dim:rgba(255,60,110,.15);
  --gold:#f0c040; --gold-dim:rgba(240,192,64,.15);
  --text:#c8d4e6; --text-dim:#5a6a84;
  --font-d:'Rajdhani',sans-serif;
  --font-m:'Share Tech Mono',monospace;
  --font-b:'Exo 2',sans-serif;

  position:relative; min-height:100vh;
  background:var(--bg-0); color:var(--text);
  font-family:var(--font-b); font-weight:300;
  overflow:hidden;
}

/* scanline texture */
.jarvis-root::after {
  content:''; position:fixed; inset:0; z-index:999; pointer-events:none;
  background:repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(0,0,0,.028) 3px, rgba(0,0,0,.028) 4px);
}

/* canvas */
.jarvis-canvas { position:fixed; inset:0; width:100%; height:100%; pointer-events:none; z-index:0; }

/* ─── LAYOUT ─── */
.jarvis-layout {
  position:relative; z-index:1;
  display:grid; grid-template-columns:1fr 1fr;
  gap:36px; max-width:1080px;
  margin:0 auto; padding:84px 44px 64px;
  align-items:start;
}
@media(max-width:800px){
  .jarvis-layout { grid-template-columns:1fr; max-width:480px; padding:72px 20px 52px; }
}

/* ─── LEFT COL ─── */
.jarvis-left { display:flex; flex-direction:column; gap:22px; }

/* eyebrow */
.jarvis-eyebrow {
  font-family:var(--font-m); font-size:.67rem;
  letter-spacing:4px; color:var(--accent); text-transform:uppercase;
  opacity:0; animation:jUp .65s .12s forwards;
}

/* title */
.jarvis-title {
  font-family:var(--font-d);
  font-size:clamp(2.1rem,5.2vw,3.1rem);
  font-weight:700; color:#fff; line-height:1.05; letter-spacing:-1px;
  opacity:0; animation:jUp .75s .28s forwards;
}
.jarvis-title .ac { color:var(--accent); text-shadow:0 0 34px var(--accent-glow); }

/* month nav */
.jarvis-nav {
  display:flex; align-items:center; justify-content:space-between;
  background:var(--bg-1); border:1px solid rgba(0,229,255,.08);
  border-radius:12px; padding:9px 14px;
  opacity:0; animation:jUp .65s .42s forwards;
}
.jarvis-nav-btn {
  background:transparent; border:1px solid rgba(0,229,255,.18);
  color:var(--accent); width:31px; height:31px; border-radius:8px;
  cursor:pointer; font-size:.85rem; font-family:var(--font-m);
  display:flex; align-items:center; justify-content:center;
  transition:all .22s cubic-bezier(.25,.46,.45,.94);
}
.jarvis-nav-btn:hover { border-color:var(--accent); background:var(--accent-dim); box-shadow:0 0 10px var(--accent-dim); }
.jarvis-nav-month { font-family:var(--font-d); font-size:1.12rem; font-weight:600; color:#fff; letter-spacing:2px; }

/* ─── CALENDAR ─── */
.jarvis-cal {
  display:grid; grid-template-columns:repeat(7,1fr); gap:5px;
  opacity:0; animation:jUp .65s .56s forwards;
}
.jarvis-cal-hdr {
  font-family:var(--font-m); font-size:.57rem;
  letter-spacing:2px; color:var(--text-dim);
  text-transform:uppercase; text-align:center; padding-bottom:7px;
}

/* day cell */
.jarvis-day {
  position:relative; aspect-ratio:1;
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  border-radius:9px; border:1px solid rgba(0,229,255,.07);
  background:var(--bg-1); color:#fff;
  font-family:var(--font-d); font-size:.9rem; font-weight:500;
  cursor:pointer;
  transition:all .2s cubic-bezier(.25,.46,.45,.94);
  opacity:0; animation:jCellPop .4s cubic-bezier(.22,.61,0,1) forwards;
}
.jarvis-day:hover { border-color:rgba(0,229,255,.3); background:rgba(0,229,255,.09); transform:scale(1.09); z-index:2; }
.jarvis-day.filled { border-color:rgba(0,229,255,.22); background:rgba(0,229,255,.07); }
.jarvis-day.today { color:var(--accent); font-weight:700; }
.jarvis-day.selected {
  border-color:var(--accent); background:var(--accent-dim);
  box-shadow:0 0 18px var(--accent-dim), inset 0 0 14px rgba(0,229,255,.07);
  color:#fff;
}
.jarvis-day.selected:hover { transform:scale(1); }

/* filled dot */
.jarvis-dot {
  width:4px; height:4px; border-radius:50%;
  background:var(--accent); margin-top:2px;
  box-shadow:0 0 5px var(--accent-glow);
}
.jarvis-day.selected .jarvis-dot { background:#fff; box-shadow:0 0 5px rgba(255,255,255,.4); }

/* ─── PROGRESS ROW ─── */
.jarvis-prog-row {
  display:flex; align-items:center; gap:16px;
  background:var(--bg-1); border:1px solid rgba(0,229,255,.08);
  border-radius:12px; padding:12px 16px;
  opacity:0; animation:jUp .65s .82s forwards;
}
.jarvis-ring-wrap { position:relative; width:40px; height:40px; flex-shrink:0; }
.jarvis-ring-svg { width:40px; height:40px; transform:rotate(-90deg); }
.jarvis-ring-bg { fill:none; stroke:var(--bg-2); stroke-width:4; }
.jarvis-ring-fill {
  fill:none; stroke:var(--accent); stroke-width:4; stroke-linecap:round;
  transition:stroke-dashoffset .9s cubic-bezier(.22,.61,0,1);
  filter:drop-shadow(0 0 4px var(--accent-glow));
}
.jarvis-ring-pct {
  position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
  font-family:var(--font-d); font-size:.7rem; font-weight:700; color:var(--accent);
}
.jarvis-prog-text { display:flex; flex-direction:column; gap:2px; }
.jarvis-prog-lbl { font-family:var(--font-m); font-size:.58rem; letter-spacing:2px; color:var(--text-dim); text-transform:uppercase; }
.jarvis-prog-val { font-family:var(--font-b); font-size:.8rem; color:var(--text); font-weight:300; }

/* ─── RIGHT COL ─── */
.jarvis-right { display:flex; flex-direction:column; gap:14px; }

/* streak card */
.jarvis-streak {
  display:flex; align-items:center; gap:16px;
  background:var(--bg-1); border:1px solid rgba(240,192,64,.2);
  border-radius:12px; padding:16px 20px;
  position:relative; overflow:hidden;
  opacity:0; animation:jUp .65s .5s forwards;
}
.jarvis-streak::before {
  content:''; position:absolute; top:0; left:0; right:0; height:2px;
  background:linear-gradient(90deg, transparent, var(--gold), transparent);
}
.jarvis-streak-fire { font-size:1.7rem; line-height:1; animation:jFire 1.9s ease-in-out infinite; }
.jarvis-streak-num { font-family:var(--font-d); font-size:2.2rem; font-weight:700; color:var(--gold); line-height:1; }
.jarvis-streak-lbl { font-family:var(--font-m); font-size:.58rem; letter-spacing:2px; color:var(--text-dim); text-transform:uppercase; margin-top:2px; }

/* detail panel */
.jarvis-panel {
  background:var(--bg-1); border:1px solid rgba(0,229,255,.08);
  border-radius:14px; padding:24px 22px 20px;
  position:relative; overflow:hidden;
  opacity:0; animation:jUp .65s .66s forwards;
}
.jarvis-panel-glow {
  position:absolute; top:0; left:0; right:0; height:2px;
  background:linear-gradient(90deg, transparent, var(--accent), transparent);
}
.jarvis-panel-date {
  font-family:var(--font-m); font-size:.67rem;
  letter-spacing:2px; color:var(--accent); margin-bottom:20px;
}

/* fields */
.jarvis-field { margin-bottom:14px; }
.jarvis-flbl {
  font-family:var(--font-m); font-size:.57rem;
  letter-spacing:2px; color:var(--text-dim);
  text-transform:uppercase; margin-bottom:6px;
  display:flex; align-items:center; gap:6px;
}
.jarvis-flbl .ico { font-size:.74rem; }
.jarvis-input, .jarvis-textarea {
  width:100%; background:var(--bg-2);
  border:1px solid rgba(0,229,255,.1); border-radius:9px;
  padding:11px 14px; color:#fff;
  font-family:var(--font-b); font-size:.84rem; font-weight:300;
  outline:none; transition:border-color .3s, box-shadow .3s;
}
.jarvis-input::placeholder, .jarvis-textarea::placeholder { color:var(--text-dim); }
.jarvis-input:focus, .jarvis-textarea:focus { border-color:var(--accent); box-shadow:0 0 14px var(--accent-dim); }
.jarvis-textarea { min-height:86px; resize:vertical; line-height:1.6; }

/* save button */
.jarvis-save {
  width:100%; padding:13px 0; border:none; border-radius:10px;
  background:var(--accent); color:var(--bg-0);
  font-family:var(--font-m); font-size:.71rem;
  letter-spacing:3px; text-transform:uppercase; font-weight:600;
  cursor:pointer; margin-top:4px;
  box-shadow:0 4px 24px var(--accent-glow);
  transition:all .3s cubic-bezier(.25,.46,.45,.94);
  position:relative; overflow:hidden;
}
.jarvis-save:hover { transform:translateY(-2px); box-shadow:0 8px 36px var(--accent-glow); }
.jarvis-save:active { transform:translateY(0); }
.jarvis-save.saved { background:#33ecff; }

/* ripple */
.jarvis-ripple {
  position:absolute; border-radius:50%;
  background:rgba(255,255,255,.32);
  transform:scale(0); animation:jRipple .55s linear forwards;
  pointer-events:none;
}

/* ─── KEYFRAMES ─── */
@keyframes jUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
@keyframes jCellPop { from{opacity:0;transform:scale(.65)} to{opacity:1;transform:scale(1)} }
@keyframes jRipple { to{transform:scale(3.6);opacity:0} }
@keyframes jFire { 0%,100%{transform:scale(1)} 50%{transform:scale(1.2)} }
`;

/* ═══ PARTICLE CANVAS ═══ */
function ParticleCanvas({ canvasRef }) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, id;
    const ps = [];

    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    class P {
      constructor(i) { this.reset(i); }
      reset(i) {
        this.x = Math.random() * W;
        this.y = i ? Math.random() * H : H + Math.random() * 180;
        this.r = Math.random() * 1.8 + 0.4;
        this.vy = -(Math.random() * 0.55 + 0.15);
        this.vx = (Math.random() - 0.5) * 0.25;
        this.o = Math.random() * 0.45 + 0.08;
        const t = Math.random();
        this.h = t < 0.55 ? 190 : t < 0.78 ? 340 : 45;
      }
      tick() { this.x += this.vx; this.y += this.vy; if (this.y < -12) this.reset(false); }
      draw() {
        ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.h},88%,64%,${this.o})`; ctx.fill();
      }
    }
    for (let i = 0; i < 110; i++) ps.push(new P(true));

    const lines = () => {
      for (let i = 0; i < ps.length; i++)
        for (let j = i + 1; j < ps.length; j++) {
          const d = Math.hypot(ps[i].x - ps[j].x, ps[i].y - ps[j].y);
          if (d < 95) {
            ctx.beginPath(); ctx.moveTo(ps[i].x, ps[i].y); ctx.lineTo(ps[j].x, ps[j].y);
            ctx.strokeStyle = `rgba(0,229,255,${(1 - d / 95) * 0.11})`; ctx.lineWidth = 0.55; ctx.stroke();
          }
        }
    };

    const loop = () => { ctx.clearRect(0, 0, W, H); ps.forEach(p => { p.tick(); p.draw(); }); lines(); id = requestAnimationFrame(loop); };
    loop();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, [canvasRef]);

  return <canvas ref={canvasRef} className="jarvis-canvas" />;
}

/* ═══ PROGRESS RING ═══ */
function ProgressRing({ pct }) {
  const R = 14, C = 2 * Math.PI * R;
  return (
    <div className="jarvis-ring-wrap">
      <svg className="jarvis-ring-svg" viewBox="0 0 40 40">
        <circle className="jarvis-ring-bg" cx="20" cy="20" r={R} />
        <circle className="jarvis-ring-fill" cx="20" cy="20" r={R}
          style={{ strokeDasharray: C, strokeDashoffset: C - (pct / 100) * C }} />
      </svg>
      <div className="jarvis-ring-pct">{pct}%</div>
    </div>
  );
}

/* ═══ MAIN ═══ */
function fmtKey(y, m, d) { return `${y}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}`; }

export default function Jarvis() {
  useEffect(() => { if (!sessionStorage.getItem("jarvis-auth")) window.location.href = "/"; }, []);

  /* inject CSS once */
  useEffect(() => {
    if (document.getElementById("jarvis-css")) return;
    const s = document.createElement("style"); s.id = "jarvis-css"; s.textContent = CSS;
    document.head.appendChild(s);
  }, []);

  const canvasRef = useRef(null);
  const saveRef  = useRef(null);

  const now = new Date();
  const [month, setMonth]           = useState(now.getMonth());
  const [year, setYear]             = useState(now.getFullYear());
  const todayKey                    = now.toISOString().split("T")[0];
  const [selectedDate, setSelected] = useState(todayKey);
  const [data, setData]             = useState({});
  const [calories, setCalories]     = useState("");
  const [study, setStudy]           = useState("");
  const [journal, setJournal]       = useState("");
  const [streak, setStreak]         = useState(0);
  const [saved, setSaved]           = useState(false);
  const isLocked = data[selectedDate]?.locked === true;


  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  useEffect(() => {
    const r = localStorage.getItem("jarvis-data");
    if (r) setData(JSON.parse(r));
    const s = localStorage.getItem("jarvis-streak");
    if (s) setStreak(Number(s));
  }, []);

  useEffect(() => {
    const d = data[selectedDate] || {};
    setCalories(d.calories || ""); setStudy(d.study || ""); setJournal(d.journal || "");
  }, [selectedDate, data]);

  /* save + ripple */
  function saveDay(e) {
    const btn = saveRef.current;
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const sp = document.createElement("span");
      sp.className = "jarvis-ripple";
      const sz = Math.max(rect.width, rect.height);
      sp.style.cssText = `width:${sz}px;height:${sz}px;left:${e.clientX-rect.left-sz/2}px;top:${e.clientY-rect.top-sz/2}px`;
      btn.appendChild(sp);
      setTimeout(() => sp.remove(), 580);
    }
    const copy = {
  ...data,
  [selectedDate]: {
    calories,
    study,
    journal,
    locked: true
  }
};

    localStorage.setItem("jarvis-data", JSON.stringify(copy));
    setData(copy);
    const last = localStorage.getItem("jarvis-last-date");
    if (selectedDate === todayKey && last !== todayKey) {
      const ns = streak + 1; setStreak(ns);
      localStorage.setItem("jarvis-streak", String(ns));
      localStorage.setItem("jarvis-last-date", todayKey);
    }
    setSaved(true); setTimeout(() => setSaved(false), 1500);
  }

  /* month nav */
  function nav(dir) {
    if (dir < 0) { if (month === 0) { setMonth(11); setYear(y=>y-1); } else setMonth(m=>m-1); }
    else         { if (month === 11){ setMonth(0);  setYear(y=>y+1); } else setMonth(m=>m+1); }
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthStart  = new Date(year, month, 1).getDay();
  const key         = (d) => fmtKey(year, month + 1, d);

  const hasDayData = useCallback((d) => {
    const v = data[key(d)];
    return v && (v.calories || v.study || v.journal);
  }, [data, year, month]);

  /* monthly % */
  let filledCount = 0;
  for (let d = 1; d <= daysInMonth; d++) if (hasDayData(d)) filledCount++;
  const pct = Math.round((filledCount / daysInMonth) * 100);

  /* ═══ RENDER ═══ */
  return (
    <div className="jarvis-root">
      <ParticleCanvas canvasRef={canvasRef} />

      <div className="jarvis-layout">
        {/* ──── LEFT ──── */}
        <div className="jarvis-left">
          <div>
            <div className="jarvis-eyebrow">// Daily Tracker</div>
            <div className="jarvis-title"><span className="ac">JARVIS</span><br/>Calendar</div>
          </div>

          {/* month nav */}
          <div className="jarvis-nav">
            <button className="jarvis-nav-btn" onClick={()=>nav(-1)}>◀</button>
            <span className="jarvis-nav-month">{MONTHS[month]} {year}</span>
            <button className="jarvis-nav-btn" onClick={()=>nav(1)}>▶</button>
          </div>

          {/* grid */}
          <div className="jarvis-cal">
            {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => <div key={d} className="jarvis-cal-hdr">{d}</div>)}
            {Array.from({length:monthStart}).map((_,i)=> <div key={"e"+i}/>)}
            {Array.from({length:daysInMonth}).map((_,i)=> {
              const d = i+1, k = key(d), filled = hasDayData(d);
              return (
                <div
                  key={k}
                  className={`jarvis-day${filled?" filled":""}${k===todayKey?" today":""}${selectedDate===k?" selected":""}`}
                  style={{animationDelay:`${.56 + i*.03}s`}}
                  onClick={()=>setSelected(k)}
                >
                  {d}
                  {filled && <div className="jarvis-dot"/>}
                </div>
              );
            })}
          </div>

          {/* progress */}
          <div className="jarvis-prog-row">
            <ProgressRing pct={pct}/>
            <div className="jarvis-prog-text">
              <span className="jarvis-prog-lbl">Monthly Progress</span>
              <span className="jarvis-prog-val">{filledCount} of {daysInMonth} days logged</span>
            </div>
          </div>
        </div>

        {/* ──── RIGHT ──── */}
        <div className="jarvis-right">
          {/* streak */}
          <div className="jarvis-streak">
            <div className="jarvis-streak-fire">🔥</div>
            <div>
              <div className="jarvis-streak-num">{streak}</div>
              <div className="jarvis-streak-lbl">Day Streak</div>
            </div>
          </div>

          {/* panel */}
          <div className="jarvis-panel">
            <div className="jarvis-panel-glow"/>
            <div className="jarvis-panel-date">{selectedDate}</div>

            <div className="jarvis-field">
              <div className="jarvis-flbl"><span className="ico">🍽</span> Calories</div>
              <input
  className="jarvis-input"
  placeholder="e.g. 1800 kcal"
  value={calories}
  onChange={e=>setCalories(e.target.value)}
  disabled={isLocked}
/>

            </div>
            <div className="jarvis-field">
              <div className="jarvis-flbl"><span className="ico">📚</span> Study</div>
              <input
  className="jarvis-input"
  placeholder="What did you study?"
  value={study}
  onChange={e=>setStudy(e.target.value)}
  disabled={isLocked}
/>

            </div>
            <div className="jarvis-field">
              <div className="jarvis-flbl"><span className="ico">💭</span> Journal</div>
              <textarea
  className="jarvis-textarea"
  placeholder="What's on your mind…"
  value={journal}
  onChange={e=>setJournal(e.target.value)}
  disabled={isLocked}
/>

            </div>

            <button
  ref={saveRef}
  className={`jarvis-save${saved ? " saved" : ""}`}
  onClick={saveDay}
  disabled={isLocked}
>
  {isLocked ? "ENTRY LOCKED" : saved ? "✓  Saved" : "Save Entry"}
</button>

          </div>
        </div>
      </div>
    </div>
  );
}