import React from 'react';

const STEPS = [
  {
    n: 1,
    title: 'Swarm Activation',
    desc: '4 agents wake and read the problem context',
  },
  {
    n: 2,
    title: 'Raw Idea Generation',
    desc: 'Each agent writes independent candidate ideas',
  },
  {
    n: 3,
    title: 'Refinement & Output',
    desc: 'Agents cross-refine and converge into final answer',
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
