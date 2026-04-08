import React, { useState } from 'react';
import { IconCopy, IconDownload, IconCheck, IconRefresh } from './Icons';

export function MCPStatus({ problem, iteration, totalIdeas, isThinking }) {
  if (!problem) return null;
  const progress = Math.min((iteration / 6) * 100, 100);

  return (
    <div
      className="mcp-status glass"
      style={{
        animation: 'fadeUp 0.5s ease both',
        borderColor: isThinking ? 'rgba(6,182,212,0.3)' : 'var(--border)',
        transition: 'border-color 0.5s ease',
      }}
    >
      <div className="mcp-row">
        <span className="mcp-label">🧠 MCP Core — Problem</span>
        <span style={{ fontSize: '0.7rem', color: 'var(--secondary)' }}>
          Iteration {iteration}/6
        </span>
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--txt-dim)', lineHeight: 1.5, marginTop: 2 }}>
        {problem}
      </p>
      <div className="mcp-bar-wrap">
        <div
          className="mcp-bar"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, var(--secondary), var(--primary), var(--accent))',
          }}
        />
      </div>
      <div className="mcp-row">
        <span className="mcp-label">{totalIdeas} ideas in pool</span>
        {isThinking && (
          <span style={{ fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '1px' }}>
            ● LIVE
          </span>
        )}
      </div>
    </div>
  );
}

export function OutputPanel({ output, onReset }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'chitti-output.txt'; a.click();
    URL.revokeObjectURL(url);
  };

  if (!output) return null;

  return (
    <div
      className="output-panel glass glow-purple"
      style={{ animation: 'fadeUp 0.6s ease both', borderColor: 'rgba(124,58,237,0.35)' }}
    >
      <div className="output-header">
        <div className="output-title font-display">
          <span style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>✦</span>
          Final Structured Output
          <span
            style={{
              fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase',
              padding: '3px 10px', borderRadius: '999px',
              background: 'rgba(124,58,237,0.2)', color: 'var(--primary-lt)',
              border: '1px solid rgba(124,58,237,0.3)',
            }}
          >
            Emerged
          </span>
        </div>
        <div className="output-actions">
          <button
            id="copy-output-btn"
            className="btn btn-sm"
            onClick={handleCopy}
            title="Copy to clipboard"
          >
            {copied ? <><IconCheck size={14} /> Copied!</> : <><IconCopy size={14} /> Copy</>}
          </button>
          <button
            id="download-output-btn"
            className="btn btn-sm"
            onClick={handleDownload}
            title="Download as .txt"
          >
            <IconDownload size={14} /> Export
          </button>
          <button
            id="new-query-btn"
            className="btn btn-sm btn-primary"
            onClick={onReset}
            title="Ask another question"
          >
            <IconRefresh size={14} /> New Query
          </button>
        </div>
      </div>

      <pre className="output-body">{output}</pre>

      <div className="output-feedback">
        <span className="output-feedback-label">Was this output helpful?</span>
        <button id="feedback-up"   className="btn btn-sm" style={{ gap: '5px' }}>👍 Yes</button>
        <button id="feedback-down" className="btn btn-sm" style={{ gap: '5px' }}>👎 Refine</button>
      </div>
    </div>
  );
}
