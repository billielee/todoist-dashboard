import type { ApiProject, ApiTask, ProjectCardData } from '../types/todoist';
import { computeStatus } from './status';

const END_DATE_RE = /^project end date:\s*(\d{4}-\d{2}-\d{2})$/i;

export const AREA_COLORS = [
  '#6366f1', // indigo
  '#f59e0b', // amber
  '#10b981', // emerald
  '#ef4444', // red
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#f97316', // orange
  '#84cc16', // lime
  '#ec4899', // pink
  '#14b8a6', // teal
];

export function buildProjectCards(
  projects: ApiProject[],
  tasks: ApiTask[],
): ProjectCardData[] {
  const projectMap = new Map<string, ApiProject>();
  for (const p of projects) projectMap.set(p.id, p);

  // Build children set: parent_id → child ids
  const childrenOf = new Map<string, string[]>();
  for (const p of projects) {
    if (p.parent_id !== null) {
      const list = childrenOf.get(p.parent_id) ?? [];
      list.push(p.id);
      childrenOf.set(p.parent_id, list);
    }
  }

  // Tasks grouped by project
  const tasksByProject = new Map<string, ApiTask[]>();
  for (const t of tasks) {
    const list = tasksByProject.get(t.project_id) ?? [];
    list.push(t);
    tasksByProject.set(t.project_id, list);
  }

  // Assign a stable color index to each top-level area
  const areaColorIndex = new Map<string, number>();
  let colorCursor = 0;
  for (const p of projects) {
    if (p.parent_id === null && !p.is_inbox_project && !p.is_team_inbox) {
      areaColorIndex.set(p.id, colorCursor++ % AREA_COLORS.length);
    }
  }

  function topLevelAncestor(id: string): ApiProject | null {
    let cur = projectMap.get(id);
    while (cur && cur.parent_id !== null) {
      cur = projectMap.get(cur.parent_id);
    }
    return cur ?? null;
  }

  const cards: ProjectCardData[] = [];

  for (const project of projects) {
    if (project.is_inbox_project || project.is_team_inbox) continue;

    const isLeaf = !childrenOf.has(project.id);
    const projectTasks = tasksByProject.get(project.id) ?? [];
    const hasDirectTasks = projectTasks.length > 0;

    // Include if leaf OR has direct tasks; skip pure containers
    if (!isLeaf && !hasDirectTasks) continue;

    const topLevel = topLevelAncestor(project.id);
    const area = topLevel?.name ?? project.name;
    const colorIdx = topLevel ? (areaColorIndex.get(topLevel.id) ?? 0) : 0;

    // Separate the end-date marker task from real tasks
    let endDate: string | null = null;
    const realTasks = projectTasks.filter((t) => {
      const m = t.content.match(END_DATE_RE);
      if (m) { endDate = m[1]; return false; }
      return true;
    });

    const taskCount = realTasks.length;

    // Next task: earliest due date, fallback to first in list
    const withDates = realTasks
      .filter((t) => t.due !== null)
      .sort((a, b) => (a.due!.date < b.due!.date ? -1 : 1));

    let nextTask: string | null = null;
    let nextDate: string | null = null;
    if (withDates.length > 0) {
      nextTask = withDates[0].content;
      nextDate = withDates[0].due!.date.slice(0, 10);
    } else if (realTasks.length > 0) {
      nextTask = realTasks[0].content;
    }

    cards.push({
      id: project.id,
      name: project.name,
      area,
      areaColorIndex: colorIdx,
      taskCount,
      nextTask,
      nextDate,
      endDate,
      status: computeStatus(taskCount, nextDate),
    });
  }

  return cards;
}
