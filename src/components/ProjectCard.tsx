import type { ProjectCardData } from '../types/todoist';
import { AREA_COLORS } from '../utils/projectTree';

const STATUS_LABEL: Record<string, string> = {
  'due-today': 'Due today',
  'this-week': 'This week',
  'needs-next-steps': 'Needs next steps',
  'close-to-done': 'Close to done',
  'active': 'Active',
};

const STATUS_BADGE: Record<string, string> = {
  'due-today': 'badge-due-today',
  'this-week': 'badge-this-week',
  'needs-next-steps': 'badge-needs-next-steps',
  'close-to-done': 'badge-close-to-done',
  'active': 'badge-active',
};

function fmtDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

interface Props {
  card: ProjectCardData;
}

export default function ProjectCard({ card }: Props) {
  const borderColor = AREA_COLORS[card.areaColorIndex];

  function open() {
    window.open(
      `https://app.todoist.com/app/project/${card.id}`,
      '_blank',
      'noopener,noreferrer',
    );
  }

  return (
    <div
      className="project-card"
      style={{ borderLeftColor: borderColor }}
      onClick={open}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && open()}
    >
      <div className="card-header">
        <span className="card-title">{card.name}</span>
        <span className={`status-badge ${STATUS_BADGE[card.status]}`}>
          {STATUS_LABEL[card.status]}
        </span>
      </div>

      {card.area !== card.name && (
        <span className="area-label" style={{ color: borderColor }}>
          {card.area}
        </span>
      )}

      {card.nextTask && (
        <p className="task-preview" title={card.nextTask}>
          {card.nextTask}
        </p>
      )}

      <div className="card-meta">
        <span>
          {card.taskCount} {card.taskCount === 1 ? 'task' : 'tasks'}
        </span>
        {card.nextDate && <span>Next: {fmtDate(card.nextDate)}</span>}
      </div>

      {(card.endDescription || card.endDate) && (
        <div className="end-state">
          {card.endDescription && (
            <p className="end-description" title={card.endDescription}>
              {card.endDescription}
            </p>
          )}
          {card.endDate && (
            <span className="end-date">Target: {fmtDate(card.endDate)}</span>
          )}
        </div>
      )}
    </div>
  );
}
