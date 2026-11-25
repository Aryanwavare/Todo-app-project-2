// Task CRUD, status toggling, and statistics service (talks to the backend API).
import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Task } from '../models/models';

const API = 'http://localhost:3000/api/tasks';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private _tasks = signal<Task[]>([]);
  readonly tasks = this._tasks.asReadonly();
  readonly loading = signal(false);
  readonly error = signal('');
  readonly stats = computed(() => {
    const t = this._tasks(), done = t.filter(x => x.status === 'completed').length;
    return { total: t.length, completed: done, pending: t.length - done, rate: t.length ? Math.round((done / t.length) * 100) : 0 };
  });

  constructor(private http: HttpClient, private auth: AuthService, private router: Router) {}

  // samet
  private toTask(a: any, userId: string): Task {
    return {
      id: String(a.id),
      userId,
      title: a.title,
      description: a.description ?? '',
      status: a.status,
      createdAt: a.created_at,
    } as Task;
  }
  private fail(err: any, fallback: string) {
    if (err?.status === 401) {
      this.auth.logout();
      this.error.set('Your session expired. Please log in again.');
      void this.router.navigate(['/login']);
      return;
    }
    this.error.set(err?.error?.error || fallback);
  }

  /** Call this once when the tasks page opens. */
  load(userId: string) {
    this.loading.set(true);
    this.error.set('');
    this.http.get<any[]>(API).subscribe({
      next: list => { this._tasks.set(list.map(a => this.toTask(a, userId))); this.loading.set(false); },
      error: err => { this.fail(err, 'Could not load tasks'); this.loading.set(false); },
    });
  }

  forUser(userId: string) { return this._tasks().filter(t => t.userId === userId); }

  add(userId: string, title: string, description: string) {
    this.error.set('');
    this.http.post<any>(API, {  title, description }).subscribe({
      next: created => this._tasks.set([this.toTask(created, userId), ...this._tasks()]),
      error: err => this.fail(err, 'Could not add task'),
    });
  }

  update(id: string, patch: Partial<Pick<Task, 'title' | 'description'>>) {
    this.error.set('');
    this.http.put<any>(`${API}/${id}`, patch).subscribe({
      next: saved => this._tasks.set(this._tasks().map(t => t.id === id ? this.toTask(saved, t.userId) : t)),
      error: err => this.fail(err, 'Could not update task'),
    });
  }

  toggle(id: string) {
    const task = this._tasks().find(t => t.id === id);
    if (!task) return;
    this.error.set('');
    const status = task.status === 'pending' ? 'completed' : 'pending';
    this.http.put<any>(`${API}/${id}`, { status }).subscribe({
      next: saved => this._tasks.set(this._tasks().map(t => t.id === id ? this.toTask(saved, t.userId) : t)),
      error: err => this.fail(err, 'Could not change status'),
    });
  }

  remove(id: string) {
    this.error.set('');
    this.http.delete(`${API}/${id}`).subscribe({
      next: () => this._tasks.set(this._tasks().filter(t => t.id !== id)),
      error: err => this.fail(err, 'Could not delete task'),
    });
  }

  // Backend has no route for this yet, so it only clears the local list.
  removeByUser(userId: string) { this._tasks.set(this._tasks().filter(t => t.userId !== userId)); }
}