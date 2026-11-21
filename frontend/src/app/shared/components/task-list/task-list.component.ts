import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Task } from '../../../core/models/models';

@Component({
  selector: 'app-task-list', standalone: true, imports: [DatePipe],
  template: `
  <ul class="list">
    @for (t of tasks(); track t.id) {
      <li class="card item">
        <input type="checkbox" [checked]="t.status==='completed'" (change)="toggle.emit(t.id)"
               [attr.aria-label]="'Mark ' + t.title + ' as ' + (t.status==='completed' ? 'pending' : 'completed')">
        <div class="body">
          <div class="row"><strong [class.done]="t.status==='completed'">{{ t.title }}</strong><span [class]="'badge ' + t.status">{{ t.status }}</span></div>
          @if (t.description) { <p class="muted" style="margin:4px 0 0">{{ t.description }}</p> }
          <span class="muted">{{ t.createdAt | date:'mediumDate' }}</span>
        </div>
        <div class="row">
          @if (editable()) { <button class="btn ghost sm" (click)="edit.emit(t)">Edit</button> }
          <button class="btn danger sm" (click)="remove.emit(t.id)">Delete</button>
        </div>
      </li>
    } @empty { <li class="card muted">{{ emptyText() }}</li> }
  </ul>`,
  styles: [`
  .list{list-style:none;margin:0;padding:0;display:grid;gap:10px}
  .item{display:grid;grid-template-columns:auto 1fr;gap:12px;align-items:start;padding:14px 16px}
  .item>.row{grid-column:2}
  .item input{width:20px;height:20px;margin-top:3px;accent-color:var(--pine)}
  .done{text-decoration:line-through;color:var(--muted)}
  @media(min-width:640px){.item{grid-template-columns:auto 1fr auto}.item>.row{grid-column:auto}}`]
})
export class TaskListComponent {
  tasks = input.required<Task[]>();
  editable = input(true);
  emptyText = input('No tasks yet. Add your first one above.');
  toggle = output<string>(); edit = output<Task>(); remove = output<string>();
}