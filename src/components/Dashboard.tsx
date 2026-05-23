import { useState, useEffect, useCallback } from 'react';
import { fetchProjects, fetchTasks } from '../api/todoist';
import { buildProjectCards } from '../utils/projectTree';
import type { ProjectCardData, FilterType, StatusType } from '../types/todoist';
import StatCard from './StatCard';
import FilterBar from './FilterBar';
import ProjectCard from './ProjectCard';

const FILTER_KEY = 'todoist_filter';

interface Props {
  token: string;
  onClearToken: () => void;
}

export default function Dashboard({ token, onClearToken }: Props) {
  const [cards, setCards] = useState<ProjectCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>(
    () => (localStorage.getItem(FILTER_KEY) as FilterType) ?? 'all',
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [projects, tasks] = await Promise.all([
        fetchProjects(token),
        fetchTasks(token),
      ]);
      setCards(buildProjectCards(projects, tasks));
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      setError(
        msg.includes('401')
          ? 'Invalid token. Click ⚙ to update it.'
          : `Failed to load: ${msg}`,
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  function handleFilter(f: FilterType) {
    setFilter(f);
    localStorage.setItem(FILTER_KEY, f);
  }

  function handleStatClick(s: StatusType) {
    handleFilter(filter === s ? 'all' : s);
  }

  const filtered = filter === 'all' ? cards : cards.filter((c) => c.status === filter);

  const count = (s: StatusType) => cards.filter((c) => c.status === s).length;

  return (
    <div className="app">
      <header className="header">
        <h1>Project Dashboard</h1>
        <div className="header-actions">
          <button
            className={`btn-icon${loading ? ' spinning' : ''}`}
            onClick={load}
            disabled={loading}
            title="Refresh"
            aria-label="Refresh"
          >
            ↺
          </button>
          <button
            className="btn-icon"
            onClick={onClearToken}
            title="Update token"
            aria-label="Settings"
          >
            ⚙
          </button>
        </div>
      </header>

      <div className="stats-grid">
        <StatCard
          label="Due today"
          count={count('due-today')}
          color="#dc2626"
          active={filter === 'due-today'}
          onClick={() => handleStatClick('due-today')}
        />
        <StatCard
          label="This week"
          count={count('this-week')}
          color="#d97706"
          active={filter === 'this-week'}
          onClick={() => handleStatClick('this-week')}
        />
        <StatCard
          label="Needs next steps"
          count={count('needs-next-steps')}
          color="#64748b"
          active={filter === 'needs-next-steps'}
          onClick={() => handleStatClick('needs-next-steps')}
        />
        <StatCard
          label="Close to done"
          count={count('close-to-done')}
          color="#16a34a"
          active={filter === 'close-to-done'}
          onClick={() => handleStatClick('close-to-done')}
        />
      </div>

      <FilterBar filter={filter} onFilter={handleFilter} />

      {loading && <div className="state-center">Loading projects…</div>}

      {!loading && error && (
        <div className="state-center error">{error}</div>
      )}

      {!loading && !error && (
        <div className="card-grid">
          {filtered.map((card) => (
            <ProjectCard key={card.id} card={card} />
          ))}
          {filtered.length === 0 && (
            <p
              style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                color: '#94a3b8',
                padding: '60px 0',
              }}
            >
              No projects match this filter.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
