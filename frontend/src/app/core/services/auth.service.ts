// Authentication and user management service.
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

  private load(): User[] {
    const raw = localStorage.getItem(USERS);
    if (raw) return JSON.parse(raw);
    const admin: User = { id: 'admin-1', name: 'Site Admin', email: 'admin@todo.app', password: 'admin123', role: 'admin', active: true, createdAt: new Date().toISOString() };
    localStorage.setItem(USERS, JSON.stringify([admin]));
    return [admin];
  }
  private persist(list: User[]) { this._users.set(list); localStorage.setItem(USERS, JSON.stringify(list)); }

  register(name: string, email: string, password: string): string | null {
    if (this._users().some(u => u.email.toLowerCase() === email.toLowerCase())) return 'That email is already registered.';
    this.persist([...this._users(), { id: uid(), name, email, password, role: 'user', active: true, createdAt: new Date().toISOString() }]);
    return null;
  }
  login(email: string, password: string): { error?: string; user?: User } {
    const u = this._users().find(x => x.email.toLowerCase() === email.toLowerCase() && x.password === password);
    if (!u) return { error: 'Email or password is incorrect.' };
    if (!u.active) return { error: 'This account is disabled. Contact an admin.' };
    this._session.set(u.id); localStorage.setItem(SESSION, u.id);
    return { user: u };
  }
  logout() { this._session.set(null); localStorage.removeItem(SESSION); }
  setActive(id: string, active: boolean) { this.persist(this._users().map(u => u.id === id ? { ...u, active } : u)); }
  remove(id: string) { this.persist(this._users().filter(u => u.id !== id)); }
}