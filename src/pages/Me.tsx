import { motion } from 'framer-motion';

export const Me = () => {
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
      <h1>Dan Danaher</h1>
      <p style={{ marginTop: '1rem', color: 'var(--color-text-secondary)' }}>
        Aerospace Engineering Student | 21 | London
      </p>
      <div style={{ marginTop: '2rem', maxWidth: '720px' }}>
        <p>
          Welcome! I'm an aerospace engineering student with a passion for technology,
          design, and exploring the intersection of the physical and digital worlds.
        </p>
        {/* Placeholder content - will be filled in later */}
      </div>
    </motion.div>
  );
};
