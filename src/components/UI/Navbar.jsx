import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useApp } from '../../store/AppContext';

export function Navbar() {
  const { step, reset, theme, toggleTheme } = useApp();
  const navigate     = useNavigate();
  const { pathname } = useLocation();

  const links = [
    { path: '/',         label: 'Home'    },
    { path: '/chat',     label: 'Chat'    },
    { path: '/thinking', label: 'Process' },
    { path: '/output',   label: 'Output'  },
  ];

  return (
    <nav className="navbar">
      {/* Logo — cyan box with white robot icon */}
      <div
        className="nav-logo"
        onClick={() => { reset(); navigate('/'); }}
      >
        <div className="nav-logo-mark">
          <img
            src="/logo.png"
            alt="Chitti"
            style={{ width: 26, height: 26, objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
          />
        </div>
        <div>
          <div className="nav-brand">Chitti</div>
          <div className="nav-tagline">Where intelligence emerges</div>
        </div>
      </div>

      {/* All navigation + controls on the RIGHT */}
      <div className="nav-right">
        {/* Nav links */}
        {links.map(l => (
          <Link
            key={l.path}
            to={l.path}
            className={`nav-link${pathname === l.path ? ' active' : ''}`}
          >
            {l.label}
          </Link>
        ))}

        {/* Separator */}
        <div style={{ width: 1, height: 18, background: 'var(--border)', margin: '0 4px' }} />

        {/* Thinking indicator */}
        {step > 0 && step < 6 && (
          <div className="badge badge-teal">
            <span style={{ width:5, height:5, borderRadius:'50%', background:'var(--primary)', display:'inline-block', animation:'pulse-dot 1.2s infinite' }} />
            Thinking
          </div>
        )}

        {/* Dark / Light toggle */}
        <button
          id="theme-toggle-btn"
          className="theme-toggle"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? '☀' : '☾'}
        </button>
      </div>
    </nav>
  );
}
