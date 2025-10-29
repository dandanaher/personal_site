import { motion } from 'framer-motion';

export const Thoughts = () => {
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
      <h1>Thoughts</h1>
      <p style={{ marginTop: '1rem', color: 'var(--color-text-secondary)' }}>
        Writing and reflections
      </p>
      <div style={{ marginTop: '2rem' }}>
        {/* Placeholder - blog posts will be added later */}
        <p>Blog coming soon...</p>
      </div>
    </motion.div>
  );
};
