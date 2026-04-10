import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, AGENTS } from '../store/AppContext';

export function OutputPage() {
  const { output, query, agentStats, iteration, reset, swarmMeta } = useApp();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  if (!output) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: 16,
          textAlign: 'center'
        }}
      >
        <h2 style={{ color: 'var(--text-3)' }}>No output yet.</h2>
        <p style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>
          Run a query first to see the emerged output here.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/chat')}>
          ← Start a Query
        </button>
      </div>
    );
  }

  const topIdeas = swarmMeta?.topIdeas || [];
  const agentSummary = swarmMeta?.agentSummary || [];
  const totalIdeas = swarmMeta?.totalIdeas ?? ideasCountFromSummary(agentSummary);
  const iterationsRun = swarmMeta?.iterationsRun ?? iteration ?? 0;
  const agentsStarted = swarmMeta?.agentsStarted ?? AGENTS.length;
  const agentsSurvived = swarmMeta?.agentsSurvived ?? AGENTS.length;

  function ideasCountFromSummary(summary) {
    if (!Array.isArray(summary)) return 0;
    return summary.reduce((acc, item) => acc + (Number(item?.ideas) || 0), 0);
  }

  const handleCopy = async () => {
    const txt = [
      `Query: ${query}`,
      '',
      'Final Output:',
      output,
      '',
      ...(topIdeas.length
        ? [
            'Top Ideas:',
            ...topIdeas.map((idea, i) =>
              typeof idea === 'string'
                ? `${i + 1}. ${idea}`
                : `${i + 1}. ${idea.text || idea.content || 'Idea'}`
            ),
            ''
          ]
        : []),
      'Run Statistics:',
      `- Agents Started: ${agentsStarted}`,
      `- Agents Survived: ${agentsSurvived}`,
      `- Iterations Run: ${iterationsRun}`,
      `- Total Ideas: ${totalIdeas}`,
    ].join('\n');

    await navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const txt = [
      `Query: ${query}`,
      '',
      'Final Output:',
      output,
      '',
      ...(topIdeas.length
        ? [
            'Top Ideas:',
            ...topIdeas.map((idea, i) =>
              typeof idea === 'string'
                ? `${i + 1}. ${idea}`
                : `${i + 1}. ${idea.text || idea.content || 'Idea'}`
            ),
            ''
          ]
        : []),
      'Run Statistics:',
      `- Agents Started: ${agentsStarted}`,
      `- Agents Survived: ${agentsSurvived}`,
      `- Iterations Run: ${iterationsRun}`,
      `- Total Ideas: ${totalIdeas}`,
    ].join('\n');

    const url = URL.createObjectURL(
      new Blob([txt], { type: 'text/plain' })
    );

    const a = document.createElement('a');
    a.href = url;
    a.download = 'chitti-output.txt';
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="output-page">
      <div className="anim-up">
        <div className="output-eyebrow">✦ Chitti Output — Emerged via Swarm Intelligence</div>
        <h1 className="output-h1 grad-main">{query || 'Final Response'}</h1>
        <div className="output-meta">
          <span className="badge badge-teal">➡ {agentsStarted} Agents</span>
          <span className="badge badge-teal">{iterationsRun} Iterations</span>
          <span className="badge badge-accent">{totalIdeas} Ideas Processed</span>
          <span className="badge badge-accent">✦ Intelligence Emerged</span>
        </div>
      </div>

      <div className="output-grid">
        <div>
          <div className="day-card anim-up" style={{ borderLeftColor: 'var(--accent)' }}>
            <div className="day-hd">
              <div className="day-num" style={{ color: 'var(--accent)' }}>
                ✓
              </div>
              <div>
                <div className="day-title">Final Answer</div>
                <div className="day-sub">Synthesized by Chitti</div>
              </div>
            </div>

            <div className="task-list">
              <div className="task-item" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                {output}
              </div>
            </div>
          </div>

          {topIdeas.length > 0 && (
            <div
              className="day-card anim-up"
              style={{ borderLeftColor: 'var(--teal)', animationDelay: '0.06s' }}
            >
              <div className="day-hd">
                <div className="day-num" style={{ color: 'var(--teal)' }}>
                  ✦
                </div>
                <div>
                  <div className="day-title">Top Ideas</div>
                  <div className="day-sub">Best candidates from the swarm</div>
                </div>
              </div>

              <div className="task-list">
                {topIdeas.map((idea, i) => {
                  const text =
                    typeof idea === 'string'
                      ? idea
                      : idea?.text || idea?.content || `Idea ${i + 1}`;

                  return (
                    <div key={i} className="task-item">
                      <span className="task-arrow" style={{ color: 'var(--teal)' }}>▸</span>
                      {text}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="output-actions">
            <button id="copy-btn" className="btn" onClick={handleCopy}>
              {copied ? '✓ Copied!' : '⊕ Copy'}
            </button>
            <button id="dl-btn" className="btn" onClick={handleDownload}>
              ↓ Download
            </button>
            <button id="process-btn" className="btn" onClick={() => navigate('/thinking')}>
              ← View Process
            </button>
            <button
              id="new-btn"
              className="btn btn-primary"
              onClick={() => {
                reset();
                navigate('/chat');
              }}
            >
              ✦ New Query
            </button>
          </div>
        </div>

        <div className="sidebar">
          <div className="scard glass anim-up d2">
            <div className="scard-title">Agent Contributions</div>
            {AGENTS.map((a, i) => {
              const sc = agentStats[i]?.score || 0;
              return (
                <div key={i} className="contrib-row">
                  <div className="contrib-name" style={{ color: a.color }}>
                    {a.emoji} {a.name.slice(0, 9)}
                  </div>
                  <div className="contrib-track">
                    <div
                      className="contrib-bar"
                      style={{ width: `${Math.max(4, sc)}%`, background: a.color }}
                    />
                  </div>
                  <div className="contrib-score">{sc}</div>
                </div>
              );
            })}
          </div>

          <div className="scard glass anim-up d3">
            <div className="scard-title">Run Statistics</div>
            {[
              ['Total Agents', `${agentsStarted} active`],
              ['Agents Survived', `${agentsSurvived}`],
              ['Iterations', `${iterationsRun}`],
              ['Raw Ideas', `${totalIdeas}`],
              ['Top Ideas', `${topIdeas.length}`],
              ['Best Score', `${Math.max(...agentStats.map(a => a.score || 0), 0)}`],
            ].map(([l, v]) => (
              <div key={l} className="stat-row">
                <span style={{ color: 'var(--text-2)' }}>{l}</span>
                <span className="stat-val">{v}</span>
              </div>
            ))}
          </div>

          {agentSummary.length > 0 && (
            <div className="scard glass anim-up d4">
              <div className="scard-title">Agent Summary</div>
              {agentSummary.map((item, i) => {
                const name = item?.agent_id || item?.agent || `Agent ${i + 1}`;
                const style = item?.agent_style || item?.style || 'unknown';
                const score = item?.score ?? '-';

                return (
                  <div key={i} className="stat-row">
                    <span style={{ color: 'var(--text-2)' }}>
                      {name} · {style}
                    </span>
                    <span className="stat-val">{score}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
