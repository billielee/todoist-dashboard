import { useState } from 'react';

interface Props {
  onSave: (token: string) => void;
}

export default function TokenInput({ onSave }: Props) {
  const [value, setValue] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) onSave(trimmed);
  }

  return (
    <div className="token-screen">
      <div className="token-card">
        <h1>Todoist Dashboard</h1>
        <p className="token-subtitle">
          Paste your Todoist API token to get started. Find it in{' '}
          <strong>Settings → Integrations → Developer</strong>.
          <br />
          <br />
          Your token stays in your browser's localStorage and is only ever sent
          to Todoist.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            className="token-input-field"
            type="password"
            placeholder="Paste your API token here"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
            autoComplete="off"
          />
          <button className="btn-primary" type="submit" disabled={!value.trim()}>
            Connect to Todoist
          </button>
        </form>
      </div>
    </div>
  );
}
