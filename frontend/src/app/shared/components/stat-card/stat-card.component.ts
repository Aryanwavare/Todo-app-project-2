import { Component, input } from '@angular/core';

@Component({
  selector: 'app-stat-card', standalone: true,
  template: `<div class="card"><div class="muted">{{ label() }}</div><div class="n">{{ value() }}</div></div>`,
  styles: [`.n{font:700 2rem 'Bricolage Grotesque',sans-serif}`]
})
export class StatCardComponent { label = input.required<string>(); value = input.required<string | number>(); }