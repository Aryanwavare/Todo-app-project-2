// Task CRUD, status toggling, and statistics service.
import { Injectable, computed, signal } from '@angular/core';
import { Task } from '../models/models';

const KEY = 'todo_tasks';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private _tasks = signal<Task[]>(JSON.parse(localStorage.getItem(KEY) ?? '[]'));
  readonly tasks = this._tasks.asReadonly();
  readonly stats = computed(() => {
    const t = this._tasks(), done = t.filter(x => x.status === 'completed').length;
    return { total: t.length, completed: done, pending: t.length - done, rate: t.length ? Math.round((done / t.length) * 100) : 0 };
  });
  private persist(list: Task[]) { this._tasks.set(list); localStorage.setItem(KEY, JSON.stringify(list)); }

  forUser(userId: string) { return this._tasks().filter(t => t.userId === userId); }
  add(userId: string, title: string, description: string) {
    this.persist([{ id: crypto.randomUUID(), userId, title, description, status: 'pending', createdAt: new Date().toISOString() }, ...this._tasks()]);
  }
  update(id: string, patch: Partial<Pick<Task, 'title' | 'description'>>) { this.persist(this._tasks().map(t => t.id === id ? { ...t, ...patch } : t)); }
  toggle(id: string) { this.persist(this._tasks().map(t => t.id === id ? { ...t, status: t.status === 'pending' ? 'completed' : 'pending' } : t)); }
  remove(id: string) { this.persist(this._tasks().filter(t => t.id !== id)); }
  removeByUser(userId: string) { this.persist(this._tasks().filter(t => t.userId !== userId)); }
}