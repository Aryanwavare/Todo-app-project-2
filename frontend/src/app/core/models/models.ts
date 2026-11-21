// Shared application models: User, Task, Role, and Filter.
export type Role = 'user' | 'admin';
export type TaskStatus = 'pending' | 'completed';
export interface User { id: string; name: string; email: string; password: string; role: Role; active: boolean; createdAt: string; }
export interface Task { id: string; userId: string; title: string; description: string; status: TaskStatus; createdAt: string; }
export type Filter = 'all' | TaskStatus;