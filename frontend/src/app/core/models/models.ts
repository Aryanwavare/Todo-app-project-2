// Shared application models

export type Role = 'user' | 'admin';

export type TaskStatus = 'pending' | 'completed';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
  active?: boolean;
  password?: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  dueDate: string | null;
}

export type Filter = 'all' | TaskStatus;