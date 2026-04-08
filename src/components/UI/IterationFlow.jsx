import React from 'react';

const STEPS = [
  {
    n: 1,
    title: 'Swarm Activation',
    desc: '6 agents wake and read the problem context',
  },
  {
    n: 2,
    title: 'Raw Idea Generation',
    desc: 'Each agent writes independent candidate ideas',
  },
  {
    n: 3,
    title: 'Cross-Agent Refinement',
    desc: 'Agents improve each other\'s ideas using shared MCP',
  },
  {
    n: 4,
    title: 'Score & Vote',
    desc: 'Ideas are ranked; weak ones filtered out',
  },
  {
    n: 5,
    title: 'Evolution',
    desc: 'Best agent role duplicated; weakest replaced',
  },
  {
    n: 6,
    title: 'Final Output',
    desc: 'Top ideas converge into a structured plan',
  },
];

export function IterationFlow({ currentStep }) {
  return (
    <div className="flow-panel">
      <p className="panel-title" style={{ marginBottom: '16px' }}>⚡ Iteration Flow</p>
      {STEPS.map((s) => {
        const done   = currentStep > s.n;
        const active = currentStep === s.n;
        return (
          <div
            key={s.n}
            className={`flow-step${done ? ' done' : ''}${active ? ' active' : ''}`}
          >
            <div className="flow-step-dot">{done ? '✓' : s.n}</div>
            <div className="flow-step-body">
              <div
                className="flow-step-title"
                style={{ color: active ? 'var(--secondary)' : done ? 'var(--txt)' : 'var(--txt-dim)' }}
              >
                {s.title}
              </div>
              {(active || done) && (
                <div className="flow-step-desc">{s.desc}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
