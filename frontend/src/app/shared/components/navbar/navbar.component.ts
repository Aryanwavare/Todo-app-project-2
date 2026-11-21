import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar', standalone: true,
  template: `
  <header class="bar"><div class="shell row between" style="padding-block:12px">
    <h2>Tally</h2>
    <div class="row">
      <span>{{ auth.currentUser()?.name }}</span>
      <span class="badge" [class.admin]="auth.role()==='admin'" [class.active]="auth.role()==='user'">{{ auth.role() }}</span>
      <button class="btn ghost sm" (click)="logout()">Log out</button>
    </div>
  </div></header>`,
  styles: [`.bar{background:#fff;border-bottom:1px solid var(--line)}`]
})
export class NavbarComponent {
  auth = inject(AuthService); private router = inject(Router);
  logout() { this.router.navigate(['/login']).then(() => this.auth.logout()); }
}