import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { TaskService } from '../../../core/services/task.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';

type Tab = 'overview' | 'users' | 'tasks';

@Component({
  selector: 'app-admin-dashboard', standalone: true, imports: [NavbarComponent, StatCardComponent, DatePipe],
  template: `
  <app-navbar />
  <main class="shell stack">
    <h1>Admin dashboard</h1>
    <div class="tabs" role="tablist">
      @for (t of tabs; track t) { <button class="tab" role="tab" [class.on]="tab()===t" (click)="tab.set(t)">{{ t[0].toUpperCase() + t.slice(1) }}</button> }
    </div>

    @switch (tab()) {
      @case ('overview') {
        <section class="stats">
          <app-stat-card label="Registered users" [value]="members().length" />
          <app-stat-card label="Total tasks" [value]="stats().total" />
          <app-stat-card label="Pending" [value]="stats().pending" />
          <app-stat-card label="Completed" [value]="stats().completed" />
          <app-stat-card label="Completion rate" [value]="stats().rate + '%'" />
        </section>
        <section class="card"><h2 style="margin-bottom:12px">Completion by user</h2>
          @for (r of perUser(); track r.id) {
            <div class="bar-row"><span>{{ r.name }}</span>
              <div class="track"><div class="fill" [style.width.%]="r.rate"></div></div>
              <span class="muted">{{ r.done }}/{{ r.total }}</span></div>
          } @empty { <p class="muted">No users have signed up yet.</p> }
        </section>
      }
      @case ('users') {
        <section class="card table-wrap"><table>
          <thead><tr><th>Name</th><th>Email</th><th>Joined</th><th>Tasks</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            @for (u of members(); track u.id) {
              <tr><td>{{ u.name }}</td><td>{{ u.email }}</td><td>{{ u.createdAt | date:'mediumDate' }}</td><td>{{ count(u.id) }}</td>
                <td><span [class]="'badge ' + (u.active ? 'active' : 'disabled')">{{ u.active ? 'active' : 'disabled' }}</span></td>
                <td><div class="row"><button class="btn ghost sm" (click)="auth.setActive(u.id, !u.active)">{{ u.active ? 'Disable' : 'Enable' }}</button>
                  <button class="btn danger sm" (click)="removeUser(u.id, u.name)">Delete</button></div></td></tr>
            } @empty { <tr><td colspan="6" class="muted">No registered users yet.</td></tr> }
          </tbody></table></section>
      }
      @case ('tasks') {
        <section class="card table-wrap"><table>
          <thead><tr><th>Task</th><th>Owner</th><th>Status</th><th>Created</th><th></th></tr></thead>
          <tbody>
            @for (t of tasks.tasks(); track t.id) {
              <tr><td>{{ t.title }}</td><td>{{ owner(t.userId) }}</td>
                <td><span [class]="'badge ' + t.status">{{ t.status }}</span></td>
                <td>{{ t.createdAt | date:'mediumDate' }}</td>
                <td><button class="btn danger sm" (click)="tasks.remove(t.id)">Delete</button></td></tr>
            } @empty { <tr><td colspan="5" class="muted">No tasks have been created yet.</td></tr> }
          </tbody></table></section>
      }
    }
  </main>`,
  styles: [`
  .bar-row{display:grid;grid-template-columns:minmax(80px,160px) 1fr auto;gap:12px;align-items:center;margin-bottom:10px}
  .track{height:10px;background:#E6EBE7;border-radius:99px;overflow:hidden}
  .fill{height:100%;background:var(--pine)}`]
})
export class AdminDashboardComponent {
  auth = inject(AuthService);
  tasks = inject(TaskService);
  tabs: Tab[] = ['overview', 'users', 'tasks'];
  tab = signal<Tab>('overview');
  stats = this.tasks.stats;

  members = computed(() => this.auth.users().filter(u => u.role === 'user'));
  perUser = computed(() => this.members().map(u => {
    const t = this.tasks.forUser(u.id), done = t.filter(x => x.status === 'completed').length;
    return { id: u.id, name: u.name, total: t.length, done, rate: t.length ? (done / t.length) * 100 : 0 };
  }));

  count(id: string) { return this.tasks.forUser(id).length; }
  owner(id: string) { return this.auth.users().find(u => u.id === id)?.name ?? 'Deleted user'; }
  removeUser(id: string, name: string) {
    if (!confirm(`Delete ${name} and all of their tasks?`)) return;
    this.tasks.removeByUser(id); this.auth.remove(id);
  }
}