import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Download, CheckCircle } from 'lucide-react';

export const OutputPanel = ({ output, currentPhase }) => {
  if (currentPhase < 3 || !output) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', bounce: 0.4, duration: 0.8 }}
      style={{
        position: 'absolute',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        width: '80%',
        maxWidth: '800px'
      }}
    >
      <div
        className="glass-panel neon-glow-primary"
        style={{
          padding: '30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          background: 'rgba(11, 15, 25, 0.6)' // Slightly darker background for readability
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle color="var(--primary)" />
            Structured Output
          </h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn" style={{ padding: '8px 12px' }}>
              <Copy size={16} />
            </button>
            <button className="btn" style={{ padding: '8px 12px' }}>
              <Download size={16} />
            </button>
          </div>
        </div>

        <div style={{
          background: 'var(--glass)',
          padding: '20px',
          borderRadius: '12px',
          maxHeight: '300px',
          overflowY: 'auto',
          lineHeight: '1.6',
          whiteSpace: 'pre-line'
        }}>
          {output}
        </div>
      </div>
    </motion.div>
  );
};
