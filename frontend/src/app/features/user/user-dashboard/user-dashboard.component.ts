import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { TaskService } from '../../../core/services/task.service';
import { Filter, Task } from '../../../core/models/models';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { TaskFormComponent } from '../../../shared/components/task-form/task-form.component';
import { TaskListComponent } from '../../../shared/components/task-list/task-list.component';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [
    NavbarComponent,
    StatCardComponent,
    TaskFormComponent,
    TaskListComponent
  ],
  template: `
    <app-navbar />

    <main class="dashboard-page">
      <div class="dashboard-container">

        <!-- Welcome Section -->
        <section class="welcome-section">
          <div>
            <span class="eyebrow">YOUR PERSONAL WORKSPACE</span>
            <h1>Your tasks<span>.</span></h1>
            <p>Stay focused, stay organized, and make today count.</p>
          </div>

          <div class="welcome-decoration">
            <span>✦</span>
          </div>
        </section>

        <!-- Statistics -->
        <section class="stats-section">
          <div class="section-heading">
            <div>
              <h2>Overview</h2>
              <p>Here's how your productivity looks.</p>
            </div>
          </div>

          <div class="stats">
            <app-stat-card
              label="Total Tasks"
              [value]="mine().length"
            />

            <app-stat-card
              label="Pending"
              [value]="pendingCount()"
            />

            <app-stat-card
              label="Completed"
              [value]="mine().length - pendingCount()"
            />
          </div>
        </section>

        <!-- Task Form -->
        <section class="task-form-section">
          <div class="section-heading">
            <div>
              <h2>{{ editing() ? 'Update your task' : 'Create a task' }}</h2>
              <p>{{ editing() ? 'Make changes to your task.' : 'What would you like to accomplish today?' }}</p>
            </div>
          </div>

          <app-task-form
            [task]="editing()"
            (save)="onSave($event)"
            (cancel)="editing.set(null)"
          />
        </section>

        <!-- Task List -->
        <section class="task-list-section">
          <div class="section-heading">
            <div>
              <h2>Your task list</h2>
              <p>Manage and track your daily progress.</p>
            </div>
          </div>

          <div class="tabs" role="tablist" aria-label="Filter tasks">
            @for (f of filters; track f) {
              <button
                class="tab"
                role="tab"
                [class.on]="filter() === f"
                [attr.aria-selected]="filter() === f"
                (click)="filter.set(f)">
                {{ f[0].toUpperCase() + f.slice(1) }}
              </button>
            }
          </div>

          <div class="task-list-card">
            <app-task-list
              [tasks]="visible()"
              [emptyText]="emptyText()"
              (toggle)="tasks.toggle($event)"
              (edit)="editing.set($event)"
              (remove)="remove($event)"
            />
          </div>
        </section>

        <footer class="dashboard-footer">
          <span>✦</span>
          Make every day productive with Tally.
        </footer>

      </div>
    </main>
  `,

  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      font-family: 'Figtree', system-ui, sans-serif;
      background: #f8f7ff;
    }

    .dashboard-page {
      min-height: calc(100vh - 60px);
      background:
        radial-gradient(circle at 5% 5%, #e9e3ff 0, transparent 28%),
        linear-gradient(135deg, #f8f7ff, #f4f1ff 55%, #faf8ff);
      padding: 42px 24px 30px;
      box-sizing: border-box;
    }

    .dashboard-container {
      width: 100%;
      max-width: 1120px;
      margin: 0 auto;
    }

    .welcome-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(115deg, #7965e8, #6550d3);
      padding: 35px 40px;
      border-radius: 23px;
      color: white;
      box-shadow: 0 12px 30px #7965e82b;
      margin-bottom: 32px;
      position: relative;
      overflow: hidden;
    }

    .welcome-section::after {
      content: '';
      position: absolute;
      width: 240px;
      height: 240px;
      border: 1px solid #ffffff25;
      border-radius: 50%;
      right: 65px;
      top: -135px;
    }

    .eyebrow {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 2px;
      color: #e1dbff;
    }

    .welcome-section h1 {
      font-size: 36px;
      font-weight: 800;
      letter-spacing: -1.5px;
      margin: 10px 0 7px;
    }

    .welcome-section h1 span {
      color: #d7ccff;
    }

    .welcome-section p {
      font-size: 14px;
      color: #e7e2ff;
      margin: 0;
    }

    .welcome-decoration {
      width: 76px;
      height: 76px;
      border-radius: 23px;
      background: #ffffff20;
      border: 1px solid #ffffff35;
      display: grid;
      place-items: center;
      font-size: 40px;
      color: white;
      z-index: 1;
    }

    .stats-section,
    .task-form-section,
    .task-list-section {
      margin-bottom: 32px;
    }

    .section-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 17px;
    }

    .section-heading h2 {
      color: #28234c;
      font-size: 19px;
      font-weight: 800;
      margin: 0 0 5px;
      letter-spacing: -0.4px;
    }

    .section-heading p {
      color: #89849f;
      font-size: 13px;
      margin: 0;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 18px;
    }

    .task-form-section,
    .task-list-section {
      background: rgba(255, 255, 255, 0.88);
      border: 1px solid #eae6f7;
      border-radius: 20px;
      padding: 25px;
      box-shadow: 0 8px 28px #362b6f08;
    }

    .tabs {
      display: flex;
      align-items: center;
      gap: 9px;
      margin-bottom: 18px;
      flex-wrap: wrap;
    }

    .tab {
      border: 1px solid #e8e3f5;
      background: white;
      color: #77718f;
      padding: 10px 19px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
      text-transform: capitalize;
    }

    .tab:hover {
      border-color: #a99af5;
      color: #725ce0;
    }

    .tab.on {
      background: #7965e8;
      border-color: #7965e8;
      color: white;
      box-shadow: 0 5px 13px #7965e833;
    }

    .task-list-card {
      background: white;
      border: 1px solid #eae6f7;
      border-radius: 16px;
      padding: 20px;
      min-height: 100px;
    }

    .dashboard-footer {
      text-align: center;
      padding: 12px 0;
      color: #a09bb5;
      font-size: 12px;
    }

    .dashboard-footer span {
      color: #7965e8;
      margin-right: 5px;
    }

    @media (max-width: 700px) {
      .dashboard-page {
        padding: 25px 15px;
      }

      .welcome-section {
        padding: 27px 23px;
        border-radius: 19px;
      }

      .welcome-section h1 {
        font-size: 29px;
      }

      .welcome-decoration {
        width: 55px;
        height: 55px;
        font-size: 29px;
        border-radius: 17px;
      }

      .stats {
        grid-template-columns: 1fr;
        gap: 12px;
      }

      .task-form-section,
      .task-list-section {
        padding: 19px 15px;
      }
    }

    @media (max-width: 420px) {
      .welcome-decoration {
        display: none;
      }

      .welcome-section p {
        line-height: 1.6;
      }

      .tab {
        padding: 9px 14px;
      }
    }
  `]
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

  mine = computed(() =>
    this.tasks.forUser(this.auth.currentUser()?.id ?? '')
  );

  pendingCount = computed(() =>
    this.mine().filter(t => t.status === 'pending').length
  );

  visible = computed(() =>
    this.filter() === 'all'
      ? this.mine()
      : this.mine().filter(t => t.status === this.filter())
  );

  emptyText = computed(() =>
    this.filter() === 'all'
      ? 'No tasks yet. Add your first one above.'
      : `No ${this.filter()} tasks.`
  );

  onSave(v: { title: string; description: string }) {
    const e = this.editing();

    if (e) {
      this.tasks.update(e.id, v);
      this.editing.set(null);
    } else {
      this.tasks.add(this.auth.currentUser()!.id, v.title, v.description);
    }
  }

  remove(id: string) {
    if (confirm('Delete this task?')) {
      this.tasks.remove(id);
    }
  }
}
