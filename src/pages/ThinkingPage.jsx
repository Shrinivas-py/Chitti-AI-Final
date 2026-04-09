import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, AGENTS } from '../store/AppContext';
import { NetworkGraph, BarChart, IterArc } from '../components/UI/Graphs';

const STEPS = [
  { n:1, title:'Swarm Activation',       desc:'All 4 agents read the problem context' },
  { n:2, title:'Idea Generation',        desc:'Independent candidate ideas generated' },
  { n:3, title:'Refinement & Output',    desc:'Agents cross-refine and converge into final answer' },
];

const STATE_MAP = ['idle','activating','generating','refining','done'];

export function ThinkingPage() {
  const { query, step, activeAgents, ideas, iteration, agentStats, isThinking } = useApp();
  const navigate = useNavigate();

  const currentState = STATE_MAP[Math.min(step, STATE_MAP.length - 1)];

  return (
    <div className="process-page">

      {/* Problem banner */}
      <div className="problem-banner glass">
        <div className="problem-q">
          <strong>Problem: </strong>
          {query || 'No query — go to Home and enter one.'}
        </div>
        <div className="iter-arc-wrap">
          <IterArc iteration={iteration} />
          {step === 3 && (
            <button id="view-output-btn" className="btn btn-accent" onClick={() => navigate('/output')}>
              View Output →
            </button>
          )}
          {isThinking && (
            <div className="badge badge-teal">
              <span style={{ width:5, height:5, borderRadius:'50%', background:'var(--primary)', display:'inline-block', animation:'pulse-dot 1s infinite' }} />
              Live
            </div>
          )}
        </div>
      </div>

      {/* Agent list */}
      <div className="agents-list">
        <div className="col-label">⬡ Agent Network</div>
        {AGENTS.map((a, i) => {
          const active = i < activeAgents;
          return (
            <div key={i}
              className={`agent-item${active ? ' active' : ' inactive'}`}
              style={{ borderColor: active ? `${a.color}25` : 'var(--border)' }}
            >
              <div className="agent-icon" style={{ background: a.bg }}>
                <span style={{ color: a.color, fontSize: '0.9rem' }}>{a.emoji}</span>
              </div>
              <div className="agent-text">
                <div className="agent-name">{a.name}</div>
                <div className="agent-role">{a.role}</div>
                <div className="agent-state" style={{ color: active ? a.color : 'var(--text-3)' }}>
                  {active ? currentState : 'idle'}
                  {active && agentStats[i].ideas > 0 && ` · ${agentStats[i].ideas} ideas`}
                </div>
              </div>
              <div className="agent-pulse-dot" style={{
                background: a.color,
                opacity: active ? 1 : 0.15,
                animation: active && isThinking ? `pulse-dot ${1.2+i*0.1}s infinite` : 'none',
              }} />
            </div>
          );
        })}
      </div>

      {/* Graphs */}
      <div className="graph-area">

        <div className="graph-card glass">
          <div className="graph-card-title">
            <span style={{ background:'var(--primary)' }} />
            Agent Communication Network
            {isThinking && (
              <span className="badge badge-teal" style={{ marginLeft:'auto', padding:'2px 9px', fontSize:'0.6rem' }}>LIVE</span>
            )}
          </div>
          <NetworkGraph activeAgents={activeAgents} step={step} />
        </div>

        <div className="graph-card glass">
          <div className="graph-card-title">
            <span style={{ background:'var(--accent)' }} />
            Idea Contributions per Agent
          </div>
          <BarChart agentStats={agentStats} activeAgents={activeAgents} />
        </div>

        {/* Idea pool */}
        {ideas.length > 0 && (
          <div>
            <div className="col-label" style={{ marginBottom:10, paddingLeft:0 }}>💡 Live Idea Pool</div>
            <div className="idea-pool">
              {ideas.map((idea, idx) => {
                const a = AGENTS[idea.agentIdx] || AGENTS[0];
                return (
                  <div key={idea.id}
                    className="idea-chip"
                    style={{
                      borderLeftColor: a.color,
                      boxShadow: idea.score >= 85 ? `0 0 12px ${a.color}18` : 'none',
                      animationDelay: `${idx * 0.06}s`,
                    }}
                  >
                    {idea.text}
                    <div className="idea-chip-meta" style={{ color: a.color }}>
                      {a.emoji} {a.name} · {a.role} · Score {idea.score}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Flow */}
      <div className="flow-col">
        <div className="col-label" style={{ marginBottom:14 }}>⚡ Iteration Flow</div>
        {STEPS.map(s => {
          const done   = step > s.n;
          const active = step === s.n;
          return (
            <div key={s.n} className={`step-row${done?' done':''}${active?' active':''}`}>
              <div className="step-num">{done ? '✓' : s.n}</div>
              <div className="step-info">
                <div className="step-title" style={{ color: active ? 'var(--primary-lt)' : done ? 'var(--text)' : 'var(--text-3)' }}>
                  {s.title}
                </div>
                {(active || done) && <div className="step-desc">{s.desc}</div>}
              </div>
            </div>
          );
        })}

        {step === 3 && (
          <button
            id="view-output-side"
            className="btn btn-accent"
            style={{ width:'100%', marginTop:16, justifyContent:'center' }}
            onClick={() => navigate('/output')}
          >
            View Full Output →
          </button>
        )}
      </div>
    </div>
  );
}
