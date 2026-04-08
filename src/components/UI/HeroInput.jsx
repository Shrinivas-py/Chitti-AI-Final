import React, { useState, useRef, useEffect } from 'react';
import { IconSend, SpinnerIcon } from './Icons';

export function HeroInput({ onSubmit, isThinking, disabled }) {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isThinking && inputRef.current) inputRef.current.focus();
  }, [isThinking]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = value.trim();
    if (!q || isThinking || disabled) return;
    onSubmit(q);
    setValue('');
  };

  const canSubmit = value.trim().length > 0 && !isThinking && !disabled;

  return (
    <form
      className="hero-form"
      onSubmit={handleSubmit}
      style={{ animationDelay: '0.1s' }}
    >
      <div
        className="hero-input-wrap glass grad-border"
        style={{
          boxShadow: isThinking
            ? '0 0 30px rgba(6,182,212,0.35), 0 0 80px rgba(6,182,212,0.1)'
            : '0 8px 40px rgba(0,0,0,0.5)',
          transition: 'box-shadow 0.5s ease',
        }}
      >
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask Chitti anything — e.g. Create a 7-day web dev plan"
          disabled={isThinking}
          style={{ fontSize: '0.95rem' }}
          id="chitti-input"
        />
        <button
          type="submit"
          id="chitti-submit-btn"
          className="btn btn-primary"
          disabled={!canSubmit}
          style={{
            borderRadius: '9999px',
            padding: '10px 22px',
            opacity: canSubmit ? 1 : 0.45,
            transition: 'opacity 0.25s, transform 0.25s, box-shadow 0.25s',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            gap: '8px',
            whiteSpace: 'nowrap',
          }}
        >
          {isThinking ? (
            <><SpinnerIcon size={16} /> Thinking…</>
          ) : (
            <><IconSend size={15} /> Start Thinking</>
          )}
        </button>
      </div>
    </form>
  );
}
