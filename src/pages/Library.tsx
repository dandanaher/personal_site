export const Library = () => {
  return (
    <div
      style={{
        padding: '4rem',
        color: 'var(--color-text-primary)',
      }}
    >
      <h1>Library</h1>
      <p style={{ marginTop: '1rem', color: 'var(--color-text-secondary)' }}>
        Books I've read and recommend
      </p>
      <div style={{ marginTop: '2rem' }}>
        {/* Placeholder - book collection will be added later */}
        <p>Book collection coming soon...</p>
      </div>
    </div>
  );
};
