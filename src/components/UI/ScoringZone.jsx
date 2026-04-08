import React, { useState } from 'react';
import { IconThumbUp, IconThumbDown } from './Icons';

export function ScoringZone({ ideas }) {
  const [votes, setVotes] = useState({});

  const handleVote = (id, dir) => {
    setVotes(v => ({ ...v, [id]: v[id] === dir ? null : dir }));
  };

  if (!ideas.length) return null;

  return (
    <div className="scoring-panel">
      <p className="panel-title" style={{ marginBottom: '4px' }}>💡 Live Ideas</p>
      {ideas.map((idea) => {
        const isTop = idea.score >= 82;
        return (
          <div
            key={idea.id}
            className={`idea-card glass${isTop ? ' glow-purple' : ''}`}
            style={{
              borderColor: isTop ? 'rgba(124,58,237,0.5)' : 'var(--border)',
              animation: 'fadeUp 0.4s ease both',
            }}
          >
            <p className="idea-card-text">{idea.text}</p>
            <div className="idea-score-bar">
              <div
                className="idea-score-fill"
                style={{
                  width: `${idea.score}%`,
                  background: isTop
                    ? 'linear-gradient(90deg, var(--primary), var(--accent))'
                    : 'var(--secondary)',
                  transition: 'width 1.2s ease',
                }}
              />
            </div>
            <div className="idea-card-footer">
              <span className="idea-score-num">Score {idea.score}/100</span>
              <div className="vote-row">
                <button
                  className="vote-btn"
                  id={`vote-up-${idea.id}`}
                  onClick={() => handleVote(idea.id, 'up')}
                  style={{ color: votes[idea.id] === 'up' ? 'var(--secondary)' : 'var(--txt-dim)' }}
                >
                  <IconThumbUp />
                </button>
                <button
                  className="vote-btn"
                  id={`vote-down-${idea.id}`}
                  onClick={() => handleVote(idea.id, 'down')}
                  style={{ color: votes[idea.id] === 'down' ? 'var(--accent)' : 'var(--txt-dim)' }}
                >
                  <IconThumbDown />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
