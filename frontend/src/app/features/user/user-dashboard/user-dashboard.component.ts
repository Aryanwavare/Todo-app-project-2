import { Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { TaskService } from '../../../core/services/task.service';
import { Filter, Task } from '../../../core/models/models';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { TaskFormComponent } from '../../../shared/components/task-form/task-form.component';
import { TaskListComponent } from '../../../shared/components/task-list/task-list.component';

@Component({
  selector: 'app-user-dashboard', standalone: true,
  imports: [NavbarComponent, StatCardComponent, TaskFormComponent, TaskListComponent],
  template: `
  <app-navbar />
  <main class="shell stack">
    <h1>Your tasks</h1>
    <section class="stats">
      <app-stat-card label="Total" [value]="mine().length" />
      <app-stat-card label="Pending" [value]="pendingCount()" />
      <app-stat-card label="Completed" [value]="mine().length - pendingCount()" />
    </section>
    <app-task-form [task]="editing()" (save)="onSave($event)" (cancel)="editing.set(null)" />
    <div class="tabs" role="tablist">
      @for (f of filters; track f) {
        <button class="tab" role="tab" [class.on]="filter()===f" [attr.aria-selected]="filter()===f" (click)="filter.set(f)">{{ f[0].toUpperCase() + f.slice(1) }}</button>
      }
    </div>
    <app-task-list [tasks]="visible()" [emptyText]="emptyText()" (toggle)="tasks.toggle($event)" (edit)="editing.set($event)" (remove)="remove($event)" />
  </main>`
})
export class UserDashboardComponent {
  private auth = inject(AuthService);
  tasks = inject(TaskService);
  filters: Filter[] = ['all', 'pending', 'completed'];
  filter = signal<Filter>('all');
  editing = signal<Task | null>(null);

  mine = computed(() => this.tasks.forUser(this.auth.currentUser()?.id ?? ''));
  pendingCount = computed(() => this.mine().filter(t => t.status === 'pending').length);
  visible = computed(() => this.filter() === 'all' ? this.mine() : this.mine().filter(t => t.status === this.filter()));
  emptyText = computed(() => this.filter() === 'all' ? 'No tasks yet. Add your first one above.' : `No ${this.filter()} tasks.`);

  onSave(v: { title: string; description: string }) {
    const e = this.editing();
    if (e) { this.tasks.update(e.id, v); this.editing.set(null); }
    else this.tasks.add(this.auth.currentUser()!.id, v.title, v.description);
  }
  remove(id: string) { if (confirm('Delete this task?')) this.tasks.remove(id); }
}