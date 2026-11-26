import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { TaskService } from '../../../core/services/task.service';
import { Filter, Task } from '../../../core/models/models';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { TaskFormComponent } from '../../../shared/components/task-form/task-form.component';
import { TaskListComponent } from '../../../shared/components/task-list/task-list.component';
import { AiService } from '../../../core/services/ai.service';
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
    <section class="ai-box">
  <h2>AI Task Breakdown</h2>
  <input #aiInput placeholder="e.g. Prepare for exams" />
  <button type="button"
  [disabled]="aiLoading() && aiActive() === 'gemini'"
  (click)="generate(aiInput.value, 'gemini')">
  {{ aiLoading() && aiActive() === 'gemini' ? 'Generating...' : 'Generate with Gemini' }}
</button>

<button type="button"
  [disabled]="aiLoading() && aiActive() === 'groq'"
  (click)="generate(aiInput.value, 'groq')">
  {{ aiLoading() && aiActive() === 'groq' ? 'Generating...' : 'Generate with Groq' }}
</button>
  @if (aiLoading()) { <p>Thinking...</p> }
  @if (aiError()) { <p style="color:red">{{ aiError() }}</p> }
  @if (subtasks().length) {
    <h3>Subtasks ({{ aiProvider() }})</h3>
    <ul>
      @for (s of subtasks(); track s) { <li>{{ s }}</li> }
    </ul>
  }
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
export class UserDashboardComponent  implements OnInit{
  private auth = inject(AuthService);
  tasks = inject(TaskService);
  filters: Filter[] = ['all', 'pending', 'completed'];
  filter = signal<Filter>('all');
  editing = signal<Task | null>(null);
  ngOnInit() {
    const user = this.auth.currentUser();
    if (user) this.tasks.load(user.id);
    
  }
  private ai = inject(AiService);
aiLoading = signal(false);
aiError = signal('');
subtasks = signal<string[]>([]);
aiProvider = signal('');
aiActive = signal(' ');

generate(title: string, provider: 'gemini' | 'groq') {
  title = title.trim();
  if (!title) { this.aiError.set('Type a task first.'); return; }
  this.aiLoading.set(true);
  this.aiActive.set(provider);
  this.aiError.set('');
  this.subtasks.set([]);
  this.ai.breakdown(title, provider).subscribe({
    next: (res) => {
      this.subtasks.set(res.subtasks);
      this.aiProvider.set(res.provider);
      this.aiLoading.set(false);
    },
    error: (err) => {
      this.aiError.set(err.error?.message || 'AI request failed.');
      this.aiLoading.set(false);
    },
  });
}

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