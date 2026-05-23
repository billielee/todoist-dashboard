// All field names are raw snake_case — the Todoist API v1 HTTP responses
// are snake_case. The official SDK applies camelCaseKeys() on top; we do not.

export interface ApiProject {
  id: string;
  name: string;
  parent_id: string | null;
  color: string;
  inbox_project?: boolean;   // v1 renamed from is_inbox_project
  workspace_id?: string;     // present on workspace projects
}

export interface ApiDue {
  date: string;
  is_recurring: boolean;
  datetime?: string | null;
  string: string;
  timezone?: string | null;
}

export interface ApiTask {
  id: string;
  project_id: string;
  content: string;
  description: string;
  due: ApiDue | null;
  priority: number;
}

export interface ApiPaginatedResponse<T> {
  results: T[];
  next_cursor: string | null;
}

export type StatusType =
  | 'due-today'
  | 'this-week'
  | 'needs-next-steps'
  | 'close-to-done'
  | 'active';

export type FilterType = 'all' | StatusType;

export interface ProjectCardData {
  id: string;
  name: string;
  area: string;
  areaColorIndex: number;
  taskCount: number;
  nextTask: string | null;
  nextDate: string | null;
  endDate: string | null;
  endDescription: string | null;
  status: StatusType;
}
