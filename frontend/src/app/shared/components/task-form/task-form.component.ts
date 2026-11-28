import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../../../core/models/models';

/** Used for both Add and Edit: pass [task] to edit. */
@Component({
  selector: 'app-task-form', standalone: true, imports: [ReactiveFormsModule],
  template: `
  <form class="card" [formGroup]="form" (ngSubmit)="submit()">
    <h2 style="margin-bottom:14px">{{ task() ? 'Edit task' : 'Add task' }}</h2>
    <div class="field"><label for="t">Title</label>
      <input id="t" formControlName="title" placeholder="e.g. Book dentist appointment">
      @if (form.controls.title.touched && form.controls.title.invalid) { <span class="err">Add a title (max 80 characters).</span> }
    </div>
    <div class="field"><label for="d">Details (optional)</label><textarea id="d" rows="3" formControlName="description"></textarea></div>
    <div class="field">
  <label for="dueDate">Due Date</label>
  <input id="dueDate" type="date" formControlName="dueDate">
</div>
    <div class="row">
      <button class="btn" [disabled]="form.invalid">{{ task() ? 'Save changes' : 'Add task' }}</button>
      @if (task()) { <button type="button" class="btn ghost" (click)="cancel.emit()">Cancel</button> }
    </div>
  </form>`
})
export class TaskFormComponent {
  private fb = inject(FormBuilder);
  task = input<Task | null>(null);
  save = output<{
  title: string;
  description: string;
  dueDate: string | null;
}>();
  cancel = output<void>();
  form = this.fb.nonNullable.group({
  title: ['', [Validators.required, Validators.maxLength(80)]],
  description: [''],
  dueDate: ['']
});

constructor() {
  effect(() => {
    const t = this.task();

    this.form.reset({
      title: t?.title ?? '',
      description: t?.description ?? '',
      dueDate: t?.dueDate ?? ''
    });
  });
}

submit() {
  if (this.form.invalid) return;

  const value = this.form.getRawValue();

  this.save.emit({
    title: value.title,
    description: value.description,
    dueDate: value.dueDate || null
  });

  if (!this.task()) {
    this.form.reset({
      title: '',
      description: '',
      dueDate: ''
    });
  }
}
}