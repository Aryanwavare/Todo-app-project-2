// Authentication and user management service.
import { HttpClient } from '@angular/common/http';
import { Observable , map , catchError , of } from 'rxjs';
const API = 'http://localhost:5000/api/auth';
import { Injectable, computed, signal } from '@angular/core';
import { Role, User } from '../models/models';

const USERS = 'todo_users', SESSION = 'todo_session';
const uid = () => Math.random().toString(36).slice(2, 10);

/** Mock auth backed by localStorage. Swap method bodies for HttpClient calls later. */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private _users = signal<User[]>(this.load());
  private _session = signal<string | null>(localStorage.getItem(SESSION));
  readonly users = this._users.asReadonly();
  readonly currentUser = computed(() => this._users().find(u => u.id === this._session()) ?? null);
  readonly isLoggedIn = computed(() => !!this.currentUser());
  readonly role = computed<Role | null>(() => this.currentUser()?.role ?? null);
   
  constructor(private http: HttpClient) {}
  private load(): User[] {
    const raw = localStorage.getItem(USERS);
    if (raw) return JSON.parse(raw);
    const admin: User = { id: 'admin-1', name: 'Site Admin', email: 'admin@todo.app', password: 'admin123', role: 'admin', active: true, createdAt: new Date().toISOString() };
    localStorage.setItem(USERS, JSON.stringify([admin]));
    return [admin];
  }
  private persist(list: User[]) { this._users.set(list); localStorage.setItem(USERS, JSON.stringify(list)); }

  register(name: string, email: string, password: string): Observable<string | null> {
  return this.http.post(`${API}/register`, { name, email, password }).pipe(
    map(() => null),
    catchError(err => of(err.error?.message || 'Registration failed. Is the auth server running?'))
  );
}

login(email: string, password: string): Observable<{ error?: string; user?: User }> {
  return this.http.post<any>(`${API}/login`, { email, password }).pipe(
    map(res => {
      const user: User = {
        id: String(res.user.id), name: res.user.name, email: res.user.email,
        password: '', role: 'user', active: true, createdAt: res.user.created_at,
      };
      localStorage.setItem('todo_token', res.token);
      localStorage.setItem(SESSION, user.id);
      this.persist([user]);
      this._session.set(user.id);
      return { user };
    }),
    catchError(err => of({ error: err.error?.message || 'Login failed. Is the auth server running?' }))
  );
}
  logout() { this._session.set(null); localStorage.removeItem(SESSION); localStorage.removeItem('todo_token'); }
  setActive(id: string, active: boolean) { this.persist(this._users().map(u => u.id === id ? { ...u, active } : u)); }
  remove(id: string) { this.persist(this._users().filter(u => u.id !== id)); }

}