
import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';

import { AuthService } from '../../../core/services/auth.service';
import { TaskService } from '../../../core/services/task.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

type Tab = 'overview' | 'users' | 'tasks';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [NavbarComponent, DatePipe, DecimalPipe],

  template: `
    <app-navbar />

    <main class="admin-page">
      <div class="container">

        <!-- Welcome Section -->
        <section class="welcome-section">
          <div>
            <span class="eyebrow">TALLY ADMIN PANEL</span>
            <h1>Admin Dashboard<span>.</span></h1>
            <p>Manage your users, monitor tasks and track productivity.</p>
          </div>

          <div class="welcome-icon">✦</div>
        </section>

        <!-- Navigation Tabs -->
        <nav class="tabs" aria-label="Dashboard sections">
          <button
            class="tab"
            [class.active]="tab() === 'overview'"
            (click)="tab.set('overview')">
            <span>◫</span> Overview
          </button>

          <button
            class="tab"
            [class.active]="tab() === 'users'"
            (click)="tab.set('users')">
            <span>♙</span> Users
          </button>

          <button
            class="tab"
            [class.active]="tab() === 'tasks'"
            (click)="tab.set('tasks')">
            <span>☷</span> Tasks
          </button>
        </nav>

        <!-- OVERVIEW -->
        @if (tab() === 'overview') {

          <section class="section-heading">
            <div>
              <h2>Overview</h2>
              <p>Here's what's happening in your workspace.</p>
            </div>
          </section>

          <section class="stats-grid">

            <article class="stat-card">
              <div class="stat-top">
                <span class="stat-icon purple">♙</span>
                <span class="stat-label">USERS</span>
              </div>
              <h3>{{ members().length }}</h3>
              <p>Registered users</p>
            </article>

            <article class="stat-card">
              <div class="stat-top">
                <span class="stat-icon blue">☷</span>
                <span class="stat-label">TASKS</span>
              </div>
              <h3>{{ count('all') }}</h3>
              <p>Total tasks created</p>
            </article>

            <article class="stat-card">
              <div class="stat-top">
                <span class="stat-icon orange">◷</span>
                <span class="stat-label">PENDING</span>
              </div>
              <h3>{{ count('pending') }}</h3>
              <p>Tasks in progress</p>
            </article>

            <article class="stat-card">
              <div class="stat-top">
                <span class="stat-icon green">✓</span>
                <span class="stat-label">COMPLETED</span>
              </div>
              <h3>{{ count('completed') }}</h3>
              <p>Tasks completed</p>
            </article>

            <article class="stat-card completion-card">
              <div class="stat-top">
                <span class="stat-icon pink">↗</span>
                <span class="stat-label">COMPLETION RATE</span>
              </div>
              <h3>{{ completionRate() | number:'1.0-0' }}%</h3>
              <p>Overall productivity</p>
            </article>

          </section>

          <!-- Completion Progress -->
          <section class="content-card">
            <div class="section-heading">
              <div>
                <h2>Completion by User</h2>
                <p>Track individual user productivity.</p>
              </div>
            </div>

            @if (perUser().length > 0) {
              <div class="user-progress-list">

                @for (user of perUser(); track user.id) {
                  <div class="progress-item">

                    <div class="progress-info">
                      <div>
                        <strong>{{ user.name }}</strong>
                        <span>{{ user.email }}</span>
                      </div>

                      <div class="progress-count">
                        {{ user.completedCount }}/{{ user.taskCount }}
                      </div>
                    </div>

                    <div class="progress-track">
                      <div
                        class="progress-fill"
                        [style.width.%]="user.taskCount
                          ? (user.completedCount / user.taskCount) * 100
                          : 0">
                      </div>
                    </div>

                  </div>
                }

              </div>
            } @else {
              <div class="empty-state">
                <span>✦</span>
                <h3>No users yet</h3>
                <p>User activity will appear here.</p>
              </div>
            }
          </section>
        }

        <!-- USERS -->
        @if (tab() === 'users') {

          <section class="section-heading">
            <div>
              <h2>Manage Users</h2>
              <p>View, manage and control registered accounts.</p>
            </div>

            <span class="count-badge">
              {{ members().length }} Users
            </span>
          </section>

          <section class="content-card">

            @if (members().length > 0) {

              <div class="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Joined</th>
                      <th>Tasks</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    @for (user of perUser(); track user.id) {
                      <tr>

                        <td>
                          <div class="user-cell">
                            <div class="avatar">
                              {{ user.name.charAt(0).toUpperCase() }}
                            </div>

                            <div>
                              <strong>{{ user.name }}</strong>
                              <span>{{ user.email }}</span>
                            </div>
                          </div>
                        </td>

                        <td>
                          {{ user.createdAt | date:'mediumDate' }}
                        </td>

                        <td>
                          <span class="task-number">
                            {{ user.taskCount }}
                          </span>
                        </td>

                        <td>
                          <span
                            class="status"
                            [class.enabled]="user.active"
                            [class.disabled]="!user.active">
                            {{ user.active ? 'Active' : 'Inactive' }}
                          </span>
                        </td>

                        <td>
                          <div class="actions">
                            <button
                              class="action-btn toggle-btn"
                              (click)="toggleUser(user.id, user.active)">
                              {{ user.active ? 'Disable' : 'Enable' }}
                            </button>

                            <button
                              class="action-btn delete-btn"
                              (click)="removeUser(user.id, user.name)">
                              Delete
                            </button>
                          </div>
                        </td>

                      </tr>
                    }
                  </tbody>
                </table>
              </div>

            } @else {
              <div class="empty-state">
                <span>♙</span>
                <h3>No users found</h3>
                <p>Registered users will appear here.</p>
              </div>
            }

          </section>
        }

        <!-- TASKS -->
        @if (tab() === 'tasks') {

          <section class="section-heading">
            <div>
              <h2>Manage Tasks</h2>
              <p>View and manage all tasks created by users.</p>
            </div>

            <span class="count-badge">
              {{ allTasks().length }} Tasks
            </span>
          </section>

          <section class="content-card">

            @if (allTasks().length > 0) {

              <div class="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Task</th>
                      <th>Owner</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    @for (task of allTasks(); track task.id) {
                      <tr>

                        <td>
                          <div class="task-cell">
                            <strong>{{ task.title }}</strong>
                            <span>{{ task.description }}</span>
                          </div>
                        </td>

                        <td>
                          {{ owner(task.userId) }}
                        </td>

                        <td>
                          <span
                            class="status"
                            [class.enabled]="task.status === 'completed'"
                            [class.pending]="task.status === 'pending'">
                            {{ task.status }}
                          </span>
                        </td>

                        <td>
                          {{ task.createdAt | date:'mediumDate' }}
                        </td>

                        <td>
                          <button
                            class="action-btn delete-btn"
                            (click)="removeTask(task.id)">
                            Delete
                          </button>
                        </td>

                      </tr>
                    }
                  </tbody>
                </table>
              </div>

            } @else {
              <div class="empty-state">
                <span>☷</span>
                <h3>No tasks found</h3>
                <p>Tasks created by users will appear here.</p>
              </div>
            }

          </section>
        }

        <footer class="footer">
          <span>✦</span>
          Tally Admin Panel · Manage smarter, work better.
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

    .admin-page {
      min-height: calc(100vh - 60px);
      padding: 38px 24px;
      box-sizing: border-box;
      background:
        radial-gradient(circle at 5% 5%, #e9e3ff 0, transparent 28%),
        linear-gradient(135deg, #f8f7ff, #f4f1ff 55%, #faf8ff);
    }

    .container {
      width: 100%;
      max-width: 1180px;
      margin: 0 auto;
    }

    .welcome-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 35px 40px;
      border-radius: 23px;
      color: white;
      background: linear-gradient(115deg, #7965e8, #6550d3);
      box-shadow: 0 12px 30px #7965e82b;
      margin-bottom: 28px;
      position: relative;
      overflow: hidden;
    }

    .welcome-section::after {
      content: '';
      position: absolute;
      width: 230px;
      height: 230px;
      border: 1px solid #ffffff25;
      border-radius: 50%;
      right: 70px;
      top: -135px;
    }

    .eyebrow {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 2px;
      color: #e1dbff;
    }

    .welcome-section h1 {
      font-size: 35px;
      font-weight: 800;
      letter-spacing: -1.3px;
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

    .welcome-icon {
      width: 75px;
      height: 75px;
      border-radius: 22px;
      background: #ffffff20;
      border: 1px solid #ffffff35;
      display: grid;
      place-items: center;
      font-size: 39px;
      z-index: 1;
    }

    .tabs {
      display: flex;
      gap: 10px;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }

    .tab {
      padding: 12px 22px;
      border: 1px solid #e8e3f5;
      border-radius: 11px;
      background: white;
      color: #77718f;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .tab span {
      margin-right: 7px;
      font-size: 16px;
    }

    .tab:hover {
      border-color: #a99af5;
      color: #725ce0;
    }

    .tab.active {
      background: #7965e8;
      border-color: #7965e8;
      color: white;
      box-shadow: 0 5px 13px #7965e833;
    }

    .section-heading {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 15px;
      margin-bottom: 18px;
    }

    .section-heading h2 {
      color: #28234c;
      font-size: 20px;
      font-weight: 800;
      margin: 0 0 5px;
      letter-spacing: -0.4px;
    }

    .section-heading p {
      color: #89849f;
      font-size: 13px;
      margin: 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 17px;
      margin-bottom: 30px;
    }

    .stat-card {
      padding: 23px;
      background: white;
      border: 1px solid #eae6f7;
      border-radius: 17px;
      box-shadow: 0 7px 25px #362b6f08;
      transition: transform 0.2s ease;
    }

    .stat-card:hover {
      transform: translateY(-3px);
    }

    .stat-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 17px;
    }

    .stat-icon {
      width: 39px;
      height: 39px;
      display: grid;
      place-items: center;
      border-radius: 12px;
      font-size: 20px;
    }

    .purple { background: #f0edff; color: #7965e8; }
    .blue { background: #eaf3ff; color: #4386d8; }
    .orange { background: #fff2e5; color: #e89a42; }
    .green { background: #e8f8ef; color: #38a66a; }
    .pink { background: #ffedf5; color: #d75b92; }

    .stat-label {
      color: #a09bb5;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 1px;
    }

    .stat-card h3 {
      color: #28234c;
      font-size: 31px;
      font-weight: 800;
      margin: 0 0 5px;
    }

    .stat-card p {
      color: #9691a9;
      font-size: 12px;
      margin: 0;
    }

    .content-card {
      background: rgba(255, 255, 255, 0.92);
      border: 1px solid #eae6f7;
      border-radius: 20px;
      padding: 26px;
      box-shadow: 0 8px 28px #362b6f08;
      margin-bottom: 30px;
    }

    .user-progress-list {
      display: flex;
      flex-direction: column;
      gap: 23px;
    }

    .progress-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 15px;
      margin-bottom: 10px;
    }

    .progress-info strong {
      display: block;
      color: #302b50;
      font-size: 13px;
      margin-bottom: 4px;
    }

    .progress-info span {
      display: block;
      color: #9994ab;
      font-size: 11px;
    }

    .progress-count {
      color: #7965e8 !important;
      font-size: 12px !important;
      font-weight: 800;
      white-space: nowrap;
    }

    .progress-track {
      height: 9px;
      border-radius: 20px;
      background: #f0edfa;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      min-width: 0;
      border-radius: 20px;
      background: linear-gradient(90deg, #7965e8, #a394f5);
      transition: width 0.3s ease;
    }

    .count-badge {
      padding: 8px 13px;
      border-radius: 9px;
      color: #725ce0;
      background: #f0edff;
      font-size: 12px;
      font-weight: 800;
      white-space: nowrap;
    }

    .table-wrapper {
      width: 100%;
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      min-width: 700px;
    }

    th {
      padding: 15px 13px;
      background: #f8f7ff;
      color: #89849f;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      white-space: nowrap;
    }

    th:first-child {
      border-radius: 9px 0 0 9px;
    }

    th:last-child {
      border-radius: 0 9px 9px 0;
    }

    td {
      padding: 16px 13px;
      border-bottom: 1px solid #f0edf7;
      color: #69647e;
      font-size: 12px;
      white-space: nowrap;
    }

    tbody tr:last-child td {
      border-bottom: none;
    }

    tbody tr:hover {
      background: #fcfbff;
    }

    .user-cell {
      display: flex;
      align-items: center;
      gap: 11px;
    }

    .avatar {
      width: 36px;
      height: 36px;
      flex-shrink: 0;
      display: grid;
      place-items: center;
      border-radius: 11px;
      background: #eeeaff;
      color: #725ce0;
      font-size: 14px;
      font-weight: 800;
    }

    .user-cell strong,
    .task-cell strong {
      display: block;
      color: #302b50;
      font-size: 12px;
      margin-bottom: 4px;
    }

    .user-cell span,
    .task-cell span {
      display: block;
      color: #9994ab;
      font-size: 11px;
      max-width: 220px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .task-cell {
      max-width: 240px;
    }

    .task-number {
      color: #725ce0;
      font-weight: 800;
    }

    .status {
      display: inline-block;
      padding: 6px 10px;
      border-radius: 20px;
      font-size: 10px;
      font-weight: 800;
      text-transform: capitalize;
    }

    .status.enabled {
      color: #26975b;
      background: #e8f8ef;
    }

    .status.disabled {
      color: #bd5b58;
      background: #fff0ef;
    }

    .status.pending {
      color: #c7832e;
      background: #fff4e5;
    }

    .actions {
      display: flex;
      gap: 7px;
    }

    .action-btn {
      padding: 7px 11px;
      border: 1px solid transparent;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .toggle-btn {
      color: #725ce0;
      background: #f0edff;
      border-color: #e8e2ff;
    }

    .toggle-btn:hover {
      background: #e5dfff;
    }

    .delete-btn {
      color: #c04d57;
      background: #fff0f0;
      border-color: #ffe0e0;
    }

    .delete-btn:hover {
      background: #ffe1e1;
    }

    .empty-state {
      text-align: center;
      padding: 40px 15px;
    }

    .empty-state > span {
      display: inline-grid;
      place-items: center;
      width: 55px;
      height: 55px;
      border-radius: 17px;
      background: #f0edff;
      color: #7965e8;
      font-size: 25px;
      margin-bottom: 13px;
    }

    .empty-state h3 {
      color: #302b50;
      font-size: 16px;
      margin: 0 0 7px;
    }

    .empty-state p {
      color: #9994ab;
      font-size: 12px;
      margin: 0;
    }

    .footer {
      text-align: center;
      color: #a09bb5;
      font-size: 12px;
      padding: 10px 0;
    }

    .footer span {
      color: #7965e8;
      margin-right: 5px;
    }

    @media (max-width: 850px) {
      .stats-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 600px) {
      .admin-page {
        padding: 24px 14px;
      }

      .welcome-section {
        padding: 27px 22px;
        border-radius: 18px;
      }

      .welcome-section h1 {
        font-size: 27px;
      }

      .welcome-icon {
        width: 52px;
        height: 52px;
        font-size: 27px;
        border-radius: 16px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
        gap: 12px;
      }

      .content-card {
        padding: 18px 13px;
      }

      .section-heading h2 {
        font-size: 17px;
      }

      .tab {
        padding: 10px 13px;
      }
    }

    @media (max-width: 400px) {
      .welcome-icon {
        display: none;
      }

      .section-heading {
        align-items: flex-start;
      }
    }
  `]
})

export class AdminDashboardComponent {

  private auth = inject(AuthService);
  private tasks = inject(TaskService);

  tab = signal<Tab>('overview');

  // Registered users
  members = computed(() => this.auth.users());

  // Tasks belonging to each user
  perUser = computed(() =>
    this.members().map(user => {
      const userTasks = this.tasks.forUser(user.id);

      const completedCount = userTasks.filter(
        task => task.status === 'completed'
      ).length;

      return {
        ...user,
        taskCount: userTasks.length,
        completedCount,
        pendingCount: userTasks.length - completedCount
      };
    })
  );

  // All tasks
  allTasks = computed(() =>
    this.perUser().flatMap(user =>
      this.tasks.forUser(user.id)
    )
  );

  // Count tasks by status
  count(status: 'all' | 'pending' | 'completed'): number {
    if (status === 'all') {
      return this.allTasks().length;
    }

    return this.allTasks().filter(
      task => task.status === status
    ).length;
  }

  // Overall completion percentage
  completionRate = computed(() => {
    const total = this.count('all');

    if (total === 0) {
      return 0;
    }

    return (this.count('completed') / total) * 100;
  });

  // Find task owner
  owner(userId: string): string {
    const user = this.members().find(
      member => member.id === userId
    );

    return user?.name ?? 'Unknown user';
  }

  // Enable or disable user
  toggleUser(id: string, active: boolean) {
    this.auth.setActive(id, !active);
  }

  // Delete task
  removeTask(id: string) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.tasks.remove(id);
    }
  }

  // Delete user and all their tasks
  
removeUser(id: string, name: string) {
  if (!confirm('Delete ' + name + ' and all of their tasks?')) {
    return;
  }

  this.tasks.removeByUser(id);
  this.auth.remove(id);
}

}
