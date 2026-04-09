// Simulation data & engine — drives the multi-page swarm flow

export const RAW_IDEAS = [
  { id:'r1', agentIdx:0, text:'Break the problem into clear, sequential day-by-day milestones.', score:55 },
  { id:'r2', agentIdx:1, text:'Lead with projects, not theory — build from the very first day.', score:62 },
  { id:'r3', agentIdx:2, text:'Daily practice of at least 30 minutes accelerates skill formation.', score:49 },
  { id:'r4', agentIdx:3, text:'Include review loops after every 2 days to reinforce learning.', score:58 },
];

export const REFINED_IDEAS = [
  { id:'f1', agentIdx:1, text:'Day 1: Core concept overview + instantly build a working mini project.', score:89 },
  { id:'f2', agentIdx:3, text:'Combine daily practice with structured feedback loops every 48h.', score:94 },
  { id:'f3', agentIdx:0, text:'Week structure: Concepts → Build → Review → Ship. Repeat.', score:87 },
  { id:'f4', agentIdx:2, text:'Integrate spaced-repetition after each session for retention.', score:79 },
];

export function buildOutput(q) {
  return {
    title: `Response: "${q}"`,
    subtitle: 'Swarm-Refined · 3 Iterations · 4 Agents',
    days: [
      {
        n: 1,
        title: 'Foundation + First Build',
        color: '#7C3AED',
        tasks: [
          'Study the core concepts (theory-first, max 20% of the day)',
          'Immediately build a small but fully working project (80% of the day)',
          'Goal: something visible and shipped before end of day',
        ],
      },
      {
        n: 2,
        title: 'Deepen + Style',
        color: '#06B6D4',
        tasks: [
          'Expand your Day 1 project with new techniques learned today',
          'Learn responsible patterns, clean code, and best practices',
          'Compare your approach against 2 professional examples',
        ],
      },
      {
        n: 3,
        title: 'Layouts & Structure',
        color: '#EC4899',
        tasks: [
          'Master structural/layout concepts and responsive thinking',
          'Rebuild Day 1 project completely using today\'s knowledge',
          'Note gaps in understanding — they become tomorrow\'s focus',
        ],
      },
      {
        n: 4,
        title: 'Logic & Interactivity',
        color: '#A855F7',
        tasks: [
          'Add dynamic behaviour — make everything respond and react',
          'Study 2 real-world examples and deconstruct how they work',
          'Solve 3 focused coding challenges independently',
        ],
      },
      {
        n: 5,
        title: 'Full Project Day',
        color: '#22D3EE',
        tasks: [
          'Build a complete mini-project from scratch — no tutorials',
          'Apply all 4 previous days of concepts end-to-end',
          'Share or deploy it somewhere for visibility and accountability',
        ],
      },
      {
        n: 6,
        title: 'Advanced Patterns',
        color: '#F472B6',
        tasks: [
          'Learn advanced concepts that your Day 5 project needed',
          'Refactor your project using these new patterns',
          'Move to reading primary documentation — no more tutorials',
        ],
      },
      {
        n: 7,
        title: 'Ship & Reflect',
        color: '#7C3AED',
        tasks: [
          'Polish and deploy your final project publicly',
          'Write a 1-page learning summary of what you mastered',
          'Design your next 7-day iteration with harder goals',
        ],
      },
    ],
  };
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

export async function runSimulation({
  setStep, setActiveAgents, setIdeas, setIteration, setAgentStats, setIsThinking,
  AGENTS,
}) {
  setIsThinking(true);

  // Phase 1: Swarm activation
  setStep(1); setIteration(1);
  for (let i = 1; i <= 4; i++) {
    await sleep(350);
    setActiveAgents(i);
    setAgentStats(prev => prev.map((a, idx) =>
      idx === i - 1 ? { ...a, ideas: 0 } : a
    ));
  }

  // Phase 2: Raw idea gen
  await sleep(600);
  setStep(2); setIteration(2);
  for (const idea of RAW_IDEAS) {
    await sleep(500);
    setIdeas(prev => [...prev, idea]);
    setAgentStats(prev => prev.map((a, i) =>
      i === idea.agentIdx ? { ...a, ideas: a.ideas + 1, score: Math.min(a.score + 15, 65) } : a
    ));
  }

  // Phase 3: Refinement + Done
  await sleep(800);
  setStep(3); setIteration(3);
  setIdeas(REFINED_IDEAS);
  setAgentStats(prev => prev.map((a) => ({
    ...a,
    ideas: a.ideas + Math.floor(Math.random() * 3) + 1,
    score: Math.min(a.score + 28, 97),
  })));

  await sleep(1400);
  setIsThinking(false);
}
