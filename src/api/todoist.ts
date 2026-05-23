import type { ApiProject, ApiTask, ApiPaginatedResponse } from '../types/todoist';

const BASE = '/api';

async function get<T>(token: string, path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Todoist API ${res.status}`);
  return res.json() as Promise<T>;
}

async function fetchAll<T>(token: string, path: string): Promise<T[]> {
  const items: T[] = [];
  let cursor: string | null = null;
  let more = true;
  while (more) {
    const sep = path.includes('?') ? '&' : '?';
    const qs: string = cursor ? `${sep}cursor=${encodeURIComponent(cursor)}` : '';
    const page: ApiPaginatedResponse<T> = await get<ApiPaginatedResponse<T>>(token, `${path}${qs}`);
    items.push(...page.results);
    cursor = page.next_cursor;
    more = cursor !== null;
  }
  return items;
}

export function fetchProjects(token: string): Promise<ApiProject[]> {
  return fetchAll<ApiProject>(token, '/projects');
}

export async function fetchTasks(token: string, projectIds: string[]): Promise<ApiTask[]> {
  const pages = await Promise.all(
    projectIds.map((id) =>
      fetchAll<ApiTask>(token, `/tasks?projectId=${encodeURIComponent(id)}`),
    ),
  );
  return pages.flat();
}
