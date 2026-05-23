import { useState } from 'react';
import TokenInput from './components/TokenInput';
import Dashboard from './components/Dashboard';

const TOKEN_KEY = 'todoist_token';

export default function App() {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem(TOKEN_KEY),
  );

  function saveToken(t: string) {
    localStorage.setItem(TOKEN_KEY, t);
    setToken(t);
  }

  function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }

  if (!token) return <TokenInput onSave={saveToken} />;
  return <Dashboard token={token} onClearToken={clearToken} />;
}
