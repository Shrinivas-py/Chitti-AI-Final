import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, AGENTS } from '../store/AppContext';

export function OutputPage() {
  const { output, query, agentStats, iteration, reset } = useApp();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  if (!output) {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'60vh', gap:16, textAlign:'center' }}>
        <h2 style={{ color:'var(--text-3)' }}>No output yet.</h2>
        <p style={{ color:'var(--text-3)', fontSize:'0.9rem' }}>Run a query first to see the emerged output here.</p>
        <button className="btn btn-primary" onClick={() => navigate('/chat')}>← Start a Query</button>
      </div>
    );
  }

  const handleCopy = () => {
    const txt = output.days.map(d =>
      `Day ${d.n} — ${d.title}\n` + d.tasks.map(t => `  • ${t}`).join('\n')
    ).join('\n\n');
    navigator.clipboard.writeText(`${output.title}\n\n${txt}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const txt = output.days.map(d =>
      `Day ${d.n} — ${d.title}\n` + d.tasks.map(t => `  • ${t}`).join('\n')
    ).join('\n\n');
    const url = URL.createObjectURL(new Blob([`${output.title}\n\n${txt}`], { type:'text/plain' }));
    Object.assign(document.createElement('a'), { href:url, download:'chitti-output.txt' }).click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="output-page">

      {/* Header */}
      <div className="anim-up">
        <div className="output-eyebrow">✦ Chitti Output — Emerged via Swarm Intelligence</div>
        <h1 className="output-h1 grad-main">{output.title}</h1>
        <div className="output-meta">
          <span className="badge badge-teal">⬡ 6 Agents</span>
          <span className="badge badge-teal">{iteration}/6 Iterations</span>
          <span className="badge badge-accent">{output.days.length} Days Structured</span>
          <span className="badge badge-accent">✦ Intelligence Emerged</span>
        </div>
      </div>

      <div className="output-grid">

        {/* Days */}
        <div>
          {output.days.map((day, i) => (
            <div
              key={day.n}
              className="day-card anim-up"
              style={{ borderLeftColor: day.color, animationDelay:`${i*0.06}s` }}
            >
              <div className="day-hd">
                <div className="day-num" style={{ color: day.color }}>
                  {String(day.n).padStart(2,'0')}
                </div>
                <div>
                  <div className="day-title">{day.title}</div>
                  <div className="day-sub">Day {day.n}</div>
                </div>
              </div>
              <div className="task-list">
                {day.tasks.map((t, j) => (
                  <div key={j} className="task-item">
                    <span className="task-arrow" style={{ color: day.color }}>▸</span>
                    {t}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Actions */}
          <div className="output-actions">
            <button id="copy-btn"    className="btn" onClick={handleCopy}>
              {copied ? '✓ Copied!' : '⊕ Copy'}
            </button>
            <button id="dl-btn"      className="btn" onClick={handleDownload}>↓ Download</button>
            <button id="process-btn" className="btn" onClick={() => navigate('/thinking')}>
              ← View Process
            </button>
            <button id="new-btn"     className="btn btn-primary" onClick={() => { reset(); navigate('/chat'); }}>
              ✦ New Query
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar">

          <div className="scard glass anim-up d2">
            <div className="scard-title">Agent Contributions</div>
            {AGENTS.map((a, i) => {
              const sc = agentStats[i]?.score || 0;
              return (
                <div key={i} className="contrib-row">
                  <div className="contrib-name" style={{ color: a.color }}>{a.emoji} {a.name.slice(0,9)}</div>
                  <div className="contrib-track">
                    <div className="contrib-bar" style={{ width:`${sc}%`, background: a.color }}/>
                  </div>
                  <div className="contrib-score">{sc}</div>
                </div>
              );
            })}
          </div>

          <div className="scard glass anim-up d3">
            <div className="scard-title">Run Statistics</div>
            {[
              ['Total Agents', '6 active'],
              ['Iterations',    `${iteration}/6`],
              ['Raw Ideas',     '9 generated'],
              ['Refined Ideas', '5 filtered'],
              ['Filtered Out',  '2 weak ideas'],
              ['Best Score',    '94 / 100'],
            ].map(([l,v]) => (
              <div key={l} className="stat-row">
                <span style={{ color:'var(--text-2)' }}>{l}</span>
                <span className="stat-val">{v}</span>
              </div>
            ))}
          </div>

          <div className="scard glass anim-up d4" style={{ textAlign:'center' }}>
            <div className="scard-title">Feedback</div>
            <p style={{ fontSize:'0.78rem', color:'var(--text-3)', marginBottom:12 }}>Was this output useful?</p>
            <div style={{ display:'flex', gap:8 }}>
              <button id="fb-yes"    className="btn" style={{ flex:1 }}>👍 Yes</button>
              <button id="fb-refine" className="btn" style={{ flex:1 }}>↩ Refine</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
