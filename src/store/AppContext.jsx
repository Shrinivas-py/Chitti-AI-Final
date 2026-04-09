import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppCtx = createContext(null);
export const useApp = () => useContext(AppCtx);

export const AGENTS = [
  { id:0, name:'Agent 1', role:'Divergent Thinking',   emoji:'🧠', color:'#0F8C8C', bg:'rgba(15,140,140,0.12)'  },
  { id:1, name:'Agent 2', role:'Idea Polishing',       emoji:'✦',  color:'#BF3F57', bg:'rgba(191,63,87,0.12)'   },
  { id:2, name:'Agent 3', role:'Pattern Recognition',  emoji:'◈',  color:'#025959', bg:'rgba(2,89,89,0.15)'     },
  { id:3, name:'Agent 4', role:'Quality Control',      emoji:'◉',  color:'#732047', bg:'rgba(115,32,71,0.15)'   },
];

export function AppProvider({ children }) {
  const [theme,        setTheme]        = useState('dark');
  const [query,        setQuery]        = useState('');
  const [step,         setStep]         = useState(0);
  const [isThinking,   setIsThinking]   = useState(false);
  const [activeAgents, setActiveAgents] = useState(0);
  const [ideas,        setIdeas]        = useState([]);
  const [output,       setOutput]       = useState(null);
  const [iteration,    setIteration]    = useState(0);
  const [agentStats,   setAgentStats]   = useState(AGENTS.map(a => ({ ...a, ideas:0, score:0 })));

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(t => t === 'dark' ? 'light' : 'dark');
  }, []);

  const reset = useCallback(() => {
    setQuery(''); setStep(0); setIsThinking(false);
    setActiveAgents(0); setIdeas([]); setOutput(null); setIteration(0);
    setAgentStats(AGENTS.map(a => ({ ...a, ideas:0, score:0 })));
  }, []);

  return (
    <AppCtx.Provider value={{
      theme, toggleTheme,
      query, setQuery,
      step, setStep,
      isThinking, setIsThinking,
      activeAgents, setActiveAgents,
      ideas, setIdeas,
      output, setOutput,
      iteration, setIteration,
      agentStats, setAgentStats,
      reset,
    }}>
      {children}
    </AppCtx.Provider>
  );
}
