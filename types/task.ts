export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  created_at: string;
}

export interface CreateTaskInput {
  title: string;
  status?: TaskStatus;
}

export interface UpdateTaskStatusInput {
  status: TaskStatus;
}