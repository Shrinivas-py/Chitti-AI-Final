import React, { useState, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { buildOutput } from '../store/simulation';
import { runSimulation } from '../store/simulation';
import { AGENTS } from '../store/AppContext';

// Lazy load the 3D scene so it doesn't block first render
const Scene3D = lazy(() => import('../components/Three/Scene3D').then(m => ({ default: m.Scene3D })));

export function LandingPage() {
  const navigate = useNavigate();
  const {
    setQuery, setStep, setActiveAgents, setIdeas,
    setIteration, setAgentStats, setIsThinking, setOutput,
  } = useApp();
  const [val, setVal] = useState('');

  const start = (q) => {
    const query = (q || val).trim();
    if (!query) return;
    setQuery(query);
    setOutput(buildOutput(query));
    navigate('/chat');
    // Keep query visible on chat page, simulation fires from chat page submit
  };

  const tryLive = (q) => {
    const query = q.trim();
    if (!query) return;
    setQuery(query);
    setOutput(buildOutput(query));
    navigate('/thinking');
    setTimeout(() => {
      runSimulation({ setStep, setActiveAgents, setIdeas, setIteration, setAgentStats, setIsThinking, AGENTS });
    }, 300);
  };

  const examples = [
    { title: '7-day web dev plan',    q: 'Create a 7-day web development plan for a complete beginner' },
    { title: 'Startup idea for students', q: 'Suggest a profitable startup idea for college students with no capital' },
    { title: 'Study schedule',        q: 'Optimise a daily study schedule for UPSC preparation' },
    { title: '30-day fitness plan',   q: 'Design a progressive 30-day home workout plan for beginners' },
  ];

  return (
    <div className="landing-wrap">
      {/* 3D canvas — behind everything */}
      <div className="landing-canvas">
        <Suspense fallback={null}>
          <Scene3D isThinking={false} />
        </Suspense>
      </div>

      {/* Dark vignette so text stays readable */}
      <div style={{
        position:'absolute', inset:0, zIndex:1, pointerEvents:'none',
        background:`
          radial-gradient(ellipse 80% 60% at 50% 100%, var(--bg) 0%, transparent 65%),
          radial-gradient(ellipse 100% 40% at 50% 0%, var(--bg) 0%, transparent 60%)
        `,
      }} />

      <div className="landing-content" style={{ position:'relative', zIndex:2 }}>

        {/* Eyebrow */}
        <div className="landing-eyebrow">
          <span className="badge badge-teal">
            <div className="landing-eyebrow-dot" />
            Multi-Agent Swarm Intelligence
          </span>
        </div>

        {/* Headline */}
        <h1 className="landing-h1">
          The output is not generated —<br />
          <span className="grad-main">it is emerged</span>
        </h1>

        <p className="landing-desc">
          Chitti deploys 6 specialised agents that independently brainstorm,
          challenge each other through shared memory, and iteratively converge
          into a structured, high-quality solution.
        </p>

        {/* CTAs */}
        <div className="landing-ctas">
          <button
            id="get-started-btn"
            className="btn btn-accent btn-lg"
            onClick={() => navigate('/chat')}
          >
            Get Started
          </button>
          <button
            id="see-demo-btn"
            className="btn btn-lg"
            onClick={() => tryLive(examples[0].q)}
          >
            See a Live Demo →
          </button>
        </div>

        {/* Stats */}
        <div className="landing-stats" style={{ marginTop: 60 }}>
          {[
            { n:'6',          l:'Specialised Agents' },
            { n:'6',          l:'Iteration Rounds'   },
            { n:'∞',          l:'Query Types'        },
            { n:'100%',       l:'Emergent Output'    },
          ].map((s, i) => (
            <div className="stat-item" key={i}>
              <div className="stat-num">{s.n}</div>
              <div className="stat-label">{s.l}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
