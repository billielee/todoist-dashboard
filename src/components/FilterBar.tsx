import type { FilterType } from '../types/todoist';

const FILTERS: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'due-today', label: 'Due today' },
  { value: 'this-week', label: 'This week' },
  { value: 'needs-next-steps', label: 'Needs next steps' },
  { value: 'close-to-done', label: 'Close to done' },
  { value: 'active', label: 'Active' },
];

interface Props {
  filter: FilterType;
  onFilter: (f: FilterType) => void;
}

export default function FilterBar({ filter, onFilter }: Props) {
  return (
    <div className="filter-bar">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          className={`filter-btn${filter === f.value ? ' active' : ''}`}
          onClick={() => onFilter(f.value)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
