import React from 'react';
import { AGENTS } from '../../store/AppContext';

/*
  Lightweight SVG-only graphs — no external lib, no heavy dependencies.
  Designed for readability and performance.
*/

/* ── Agent Network ──────────────────────────────────── */
// Fixed node positions (percent of viewBox 0 0 100 100)
const NODES = [
  { x:50, y:48 }, // 0 = MCP center
  { x:25, y:18 }, // 1
  { x:78, y:22 }, // 2
  { x:85, y:68 }, // 3
  { x:18, y:72 }, // 4
];

export function NetworkGraph({ activeAgents, step }) {
  const [ticks, setTicks] = React.useState(0);
  const [packets, setPackets] = React.useState([]);

  React.useEffect(() => {
    if (activeAgents === 0) return;
    const id = setInterval(() => {
      setTicks(t => t + 1);
      const src = (Math.floor(Math.random() * Math.min(activeAgents, 4)) + 1);
      setPackets(p => [...p.slice(-5), { src, id: Date.now() }]);
    }, 900);
    return () => clearInterval(id);
  }, [activeAgents]);

  return (
    <svg className="net-svg" viewBox="0 0 100 100">
      <defs>
        <filter id="f-glow">
          <feGaussianBlur stdDeviation="1.2" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        {AGENTS.map((a,i) => (
          <radialGradient key={i} id={`ng-${i}`} cx="35%" cy="35%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.8"/>
            <stop offset="100%" stopColor={a.color} stopOpacity="0.9"/>
          </radialGradient>
        ))}
        <radialGradient id="ng-mcp" cx="35%" cy="35%">
          <stop offset="0%" stopColor="#1AAFAF" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#025959" stopOpacity="0.8"/>
        </radialGradient>
      </defs>

      {/* Spokes from agents to MCP */}
      {NODES.slice(1).map((n, i) => {
        const active = i < activeAgents;
        const mc = NODES[0];
        return (
          <line key={i}
            x1={mc.x} y1={mc.y} x2={n.x} y2={n.y}
            stroke={active ? AGENTS[i].color : 'rgba(255,255,255,0.04)'}
            strokeWidth={active ? 0.5 : 0.3}
            strokeOpacity={active ? 0.38 : 0.08}
            strokeDasharray={active ? '2 2' : 'none'}
          />
        );
      })}

      {/* Cross connections during refinement phase */}
      {step >= 3 && NODES.slice(1).map((n, i) => {
        if (i >= activeAgents) return null;
        const j = (i + 1) % Math.min(activeAgents, 4);
        const n2 = NODES[j + 1];
        return (
          <line key={`x${i}`}
            x1={n.x} y1={n.y} x2={n2.x} y2={n2.y}
            stroke={AGENTS[i].color} strokeWidth={0.3} strokeOpacity={0.18}
            strokeDasharray="1 3"
          />
        );
      })}

      {/* Animated packets */}
      {packets.map(pk => {
        const src = NODES[pk.src];
        const mc  = NODES[0];
        return (
          <circle key={pk.id} r="0.9" fill={AGENTS[pk.src-1]?.color || '#0F8C8C'} filter="url(#f-glow)">
            <animate attributeName="cx" from={src.x} to={mc.x} dur="0.75s" fill="freeze"/>
            <animate attributeName="cy" from={src.y} to={mc.y} dur="0.75s" fill="freeze"/>
            <animate attributeName="opacity" from="1" to="0" begin="0.5s" dur="0.25s" fill="freeze"/>
          </circle>
        );
      })}

      {/* Agent nodes */}
      {NODES.slice(1).map((n, i) => {
        const active = i < activeAgents;
        const a = AGENTS[i];
        return (
          <g key={i}>
            {active && (
              <circle cx={n.x} cy={n.y} r="3.5" fill={a.color} opacity="0.1">
                <animate attributeName="r" values="3;4.5;3" dur={`${1.4+i*0.12}s`} repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.1;0.03;0.1" dur={`${1.4+i*0.12}s`} repeatCount="indefinite"/>
              </circle>
            )}
            <circle
              cx={n.x} cy={n.y} r="2.6"
              fill={active ? `url(#ng-${i})` : 'rgba(255,255,255,0.03)'}
              stroke={active ? a.color : 'rgba(255,255,255,0.07)'}
              strokeWidth="0.5"
              filter={active ? 'url(#f-glow)' : 'none'}
            />
            <text x={n.x} y={n.y+0.7} textAnchor="middle" dominantBaseline="middle"
              fontSize="2.2" fill={active ? '#fff' : 'rgba(255,255,255,0.18)'} style={{fontFamily:'sans-serif'}}>
              {a.emoji}
            </text>
            {active && (
              <text x={n.x} y={n.y+5.2} textAnchor="middle" fontSize="2.1"
                fill={a.color} style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:600}} opacity="0.85">
                {a.name}
              </text>
            )}
          </g>
        );
      })}

      {/* MCP Core node */}
      <g>
        <circle cx={NODES[0].x} cy={NODES[0].y} r="5.5" fill="#025959" opacity="0.12">
          <animate attributeName="r" values="5;7;5" dur="2.2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.12;0.03;0.12" dur="2.2s" repeatCount="indefinite"/>
        </circle>
        <circle cx={NODES[0].x} cy={NODES[0].y} r="4.2"
          fill="url(#ng-mcp)" stroke="#0F8C8C" strokeWidth="0.6" filter="url(#f-glow)"/>
        <text x={NODES[0].x} y={NODES[0].y+0.7} textAnchor="middle" dominantBaseline="middle"
          fontSize="2.8" fill="#fff" style={{fontFamily:'sans-serif'}}>
          ⬡
        </text>
        <text x={NODES[0].x} y={NODES[0].y+7} textAnchor="middle" fontSize="2.3"
          fill="#0F8C8C" style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:700}}>
          MCP Core
        </text>
      </g>
    </svg>
  );
}

/* ── Contribution Bar Chart ─────────────────────────── */
export function BarChart({ agentStats, activeAgents }) {
  const max = Math.max(...agentStats.map(a => a.ideas), 1);

  return (
    <svg className="bar-svg" viewBox="0 0 120 60">
      <defs>
        {AGENTS.map((a,i) => (
          <linearGradient key={i} id={`bar-${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={a.color} stopOpacity="1"/>
            <stop offset="100%" stopColor={a.color} stopOpacity="0.3"/>
          </linearGradient>
        ))}
      </defs>
      {agentStats.map((a, i) => {
        const active = i < activeAgents;
        const maxH = 36;
        const h = active ? Math.max((a.ideas / max) * maxH, active ? 3 : 0) : 0;
        const x = 8 + i * 18;
        const y = 46 - h;
        return (
          <g key={i}>
            <rect x={x} y={10} width={11} height={36} rx={3} fill="rgba(255,255,255,0.03)"/>
            <rect x={x} y={y} width={11} height={h} rx={3}
              fill={active ? `url(#bar-${i})` : 'rgba(255,255,255,0.05)'}
              style={{transition:'height 0.8s ease, y 0.8s ease'}}
            />
            <text x={x+5.5} y={54} textAnchor="middle" fontSize="3.2"
              fill={active ? a.color : 'rgba(255,255,255,0.18)'} style={{fontFamily:'sans-serif'}}>
              {a.emoji}
            </text>
            {active && a.ideas > 0 && (
              <text x={x+5.5} y={y-1.5} textAnchor="middle" fontSize="2.8"
                fill={a.color} style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:700}}>
                {a.ideas}
              </text>
            )}
          </g>
        );
      })}
      <line x1="5" y1="46" x2="115" y2="46" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5"/>
    </svg>
  );
}

/* ── Iteration Arc ──────────────────────────────────── */
export function IterArc({ iteration, total = 3 }) {
  const R = 20; const cx = 28; const cy = 28;
  const C = 2 * Math.PI * R;
  const filled = C * (iteration / total);

  return (
    <svg viewBox="0 0 56 56" style={{ width:72, height:72, flexShrink:0 }}>
      <defs>
        <linearGradient id="arc-g" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--primary)"/>
          <stop offset="100%" stopColor="var(--accent)"/>
        </linearGradient>
      </defs>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(15,140,140,0.1)" strokeWidth="4"/>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="url(#arc-g)" strokeWidth="4"
        strokeDasharray={`${filled} ${C-filled}`} strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{transition:'stroke-dasharray 0.7s ease'}}
      />
      <text x={cx} y={cy+1} textAnchor="middle" dominantBaseline="middle"
        fontSize="8" fill="var(--text)" style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:800}}>
        {iteration}/{total}
      </text>
      <text x={cx} y={cy+10} textAnchor="middle" fontSize="3.5"
        fill="var(--text-3)" style={{fontFamily:'sans-serif'}}>
        iter
      </text>
    </svg>
  );
}
