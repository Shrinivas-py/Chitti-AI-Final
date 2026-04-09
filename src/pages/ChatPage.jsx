import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, AGENTS } from '../store/AppContext';
import { buildOutput, runSimulation } from '../store/simulation';

const SUGGESTIONS = [
  {
    title: '7-day learning plan',
    sub:   'Build a structured week-by-week curriculum for any skill',
    q:     'Create a 7-day web development plan for a complete beginner',
  },
  {
    title: 'Startup idea generator',
    sub:   'Identify viable business opportunities with minimal resources',
    q:     'Suggest a profitable startup idea for college students with zero capital',
  },
  {
    title: 'Daily schedule optimiser',
    sub:   'Structure your day for maximum focus and output',
    q:     'Optimise a daily 8-hour study schedule for competitive exam preparation',
  },
  {
    title: 'Fitness plan creator',
    sub:   'Build progressive plans tailored to specific goals',
    q:     'Design a 30-day progressive home workout plan for a complete beginner',
  },
];

export function ChatPage() {
  const navigate = useNavigate();
  const { setQuery, setStep, setActiveAgents, setIdeas, setIteration, setAgentStats, setIsThinking, setOutput, query } = useApp();
  const [val, setVal] = useState(query || '');
  const taRef = useRef(null);

  useEffect(() => {
    taRef.current?.focus();
  }, []);

  // Auto-resize textarea
  const handleInput = (e) => {
    const ta = e.target;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 180) + 'px';
    setVal(ta.value);
  };

  const submit = (q) => {
    const query = (q || val).trim();
    if (!query) return;

    setQuery(query);
    setOutput(buildOutput(query));
    navigate('/thinking');

    setTimeout(() => {
      runSimulation({ setStep, setActiveAgents, setIdeas, setIteration, setAgentStats, setIsThinking, AGENTS });
    }, 250);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="chat-page">

      {/* Header */}
      <div className="chat-header anim-up">
        <h1 className="grad-main">What do you want Chitti to solve?</h1>
        <p>4 agents will independently think, refine, and converge on your answer.</p>
      </div>

      {/* Main input */}
      <div className="chat-input-wrap glass anim-up d1">
        <textarea
          id="chat-textarea"
          ref={taRef}
          rows={1}
          placeholder="Describe your problem, goal, or question… (Enter to submit, Shift+Enter for newline)"
          value={val}
          onInput={handleInput}
          onChange={handleInput}
          onKeyDown={handleKey}
        />
        <button
          id="chat-send-btn"
          className="chat-send-btn"
          onClick={() => submit()}
          disabled={!val.trim()}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>

      {/* Hint */}
      <p className="chat-note anim-up d2">Shift+Enter for new line · Enter to send · Esc to clear</p>

      {/* Suggestion chips */}
      <div className="suggestions anim-up d3">
        {SUGGESTIONS.map((s, i) => (
          <button
            key={i}
            id={`suggest-${i}`}
            className="suggest-chip"
            onClick={() => submit(s.q)}
          >
            <div className="suggest-title">{s.title}</div>
            <div className="suggest-sub">{s.sub}</div>
          </button>
        ))}
      </div>

    </div>
  );
}
