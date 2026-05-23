import type { ApiProject, ApiTask } from '../types/todoist';

const BASE = 'https://api.todoist.com/rest/v2';

async function get<T>(token: string, path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Todoist API ${res.status}`);
  return res.json() as Promise<T>;
}

export function fetchProjects(token: string): Promise<ApiProject[]> {
  return get<ApiProject[]>(token, '/projects');
}

export function fetchTasks(token: string): Promise<ApiTask[]> {
  return get<ApiTask[]>(token, '/tasks');
}
