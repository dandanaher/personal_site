import { motion } from 'framer-motion';

export const Projects = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      style={{
        padding: '4rem',
        color: 'var(--color-text-primary)',
      }}
    >
      <h1>Projects</h1>
      <p style={{ marginTop: '1rem', color: 'var(--color-text-secondary)' }}>
        Things I've built
      </p>
      <div style={{ marginTop: '2rem' }}>
        {/* Placeholder - projects will be added later */}
        <p>Project portfolio coming soon...</p>
      </div>
    </motion.div>
  );
};
