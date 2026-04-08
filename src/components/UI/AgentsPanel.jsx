import React from 'react';

const AGENTS = [
  { name: 'Brainstormer', emoji: '🧠', color: '#7C3AED', bg: 'rgba(124,58,237,0.18)' },
  { name: 'Refiner',      emoji: '✨', color: '#06B6D4', bg: 'rgba(6,182,212,0.18)'  },
  { name: 'Analyst',      emoji: '📊', color: '#EC4899', bg: 'rgba(236,72,153,0.18)' },
  { name: 'Critic',       emoji: '🔍', color: '#A855F7', bg: 'rgba(168,85,247,0.18)' },
  { name: 'Synthesiser',  emoji: '🔗', color: '#22D3EE', bg: 'rgba(34,211,238,0.18)' },
  { name: 'Evaluator',    emoji: '⚖️', color: '#F472B6', bg: 'rgba(244,114,182,0.18)'},
];

const STATE_LABELS = ['idle', 'thinking', 'refining', 'evaluating', 'converging', 'done'];

export function AgentsPanel({ activeAgents, phase }) {
  return (
    <div className="agents-panel">
      <p className="panel-title">⬡ Agent Network</p>
      {AGENTS.map((a, i) => {
        const isActive  = i < activeAgents;
        const stateIdx  = isActive ? Math.min(phase, STATE_LABELS.length - 1) : 0;
        const stateLabel = STATE_LABELS[stateIdx];

        return (
          <div
            key={i}
            className="agent-card glass"
            style={{
              opacity: isActive ? 1 : 0.35,
              borderColor: isActive ? `${a.color}44` : 'var(--border)',
              transition: 'all 0.5s ease',
              animationDelay: `${i * 0.07}s`,
            }}
          >
            <div
              className="agent-orb"
              style={{ background: a.bg, color: a.color, border: `1px solid ${a.color}44` }}
            >
              {a.emoji}
            </div>
            <div className="agent-info">
              <div className="agent-name">{a.name}</div>
              <div className="agent-state" style={{ color: isActive ? a.color : 'var(--txt-faint)' }}>
                {stateLabel}
              </div>
            </div>
            <div
              className="agent-pulse"
              style={{
                background: a.color,
                opacity: isActive ? 1 : 0.2,
                animation: isActive ? `pulse ${1.2 + i * 0.15}s ease-in-out infinite` : 'none',
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
