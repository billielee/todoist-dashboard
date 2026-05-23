export interface ApiProject {
  id: string;
  name: string;
  parent_id: string | null;
  color: string;
  order: number;
  is_inbox_project?: boolean;
  is_team_inbox?: boolean;
}

export interface ApiDue {
  date: string;
  is_recurring: boolean;
  datetime?: string;
  string: string;
  timezone: string | null;
}

export interface ApiTask {
  id: string;
  project_id: string;
  content: string;
  due: ApiDue | null;
  order: number;
  priority: number;
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
  status: StatusType;
}
