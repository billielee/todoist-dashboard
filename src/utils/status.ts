import type { StatusType } from '../types/todoist';

export function computeStatus(taskCount: number, nextDate: string | null): StatusType {
  if (taskCount === 0) return 'needs-next-steps';

  if (nextDate !== null) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const next = new Date(nextDate + 'T00:00:00');

    if (next <= today) return 'due-today';

    const weekOut = new Date(today);
    weekOut.setDate(weekOut.getDate() + 7);
    if (next <= weekOut) return 'this-week';
  }

  if (taskCount <= 2) return 'close-to-done';
  return 'active';
}
