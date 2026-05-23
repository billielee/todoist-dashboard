export interface ApiProject {
  id: string;
  name: string;
  parentId: string | null;
  color: string;
  childOrder: number;
  inboxProject?: boolean;
  workspaceId?: string;
}

export interface ApiDue {
  date: string;
  isRecurring: boolean;
  datetime?: string | null;
  string: string;
  timezone?: string | null;
}

export interface ApiTask {
  id: string;
  projectId: string;
  content: string;
  due: ApiDue | null;
  childOrder: number;
  priority: number;
}

export interface ApiPaginatedResponse<T> {
  results: T[];
  nextCursor: string | null;
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
