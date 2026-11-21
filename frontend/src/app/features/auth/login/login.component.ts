import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login', standalone: true, imports: [ReactiveFormsModule, RouterLink],
  template: `
  <main class="auth"><form class="card" [formGroup]="form" (ngSubmit)="submit()">
    <h1 style="margin-bottom:6px">Welcome back</h1><p class="muted" style="margin-bottom:20px">Log in to see your tasks.</p>
    @if (error()) { <div class="alert" role="alert">{{ error() }}</div> }
    <div class="field"><label for="e">Email</label><input id="e" type="email" formControlName="email" autocomplete="email"></div>
    <div class="field"><label for="p">Password</label><input id="p" type="password" formControlName="password" autocomplete="current-password"></div>
    <button class="btn" style="width:100%" [disabled]="form.invalid">Log in</button>
    <div class="social-auth" aria-describedby="social-auth-note">
      <div class="divider"><span>Or continue with</span></div>
      <div class="social-buttons">
        <button class="btn social-btn" type="button" disabled><span class="google-icon" aria-hidden="true">G</span>Google</button>
        <button class="btn social-btn" type="button" disabled><span class="facebook-icon" aria-hidden="true">f</span>Facebook</button>
      </div>
      <p id="social-auth-note" class="muted social-note">Google and Facebook sign-in are not configured yet.</p>
    </div>
    <p class="muted" style="margin-top:14px">New here? <a routerLink="/register">Create an account</a></p>
  </form></main>`,
  styles: [`
    .social-auth{margin-top:18px}
    .divider{display:flex;align-items:center;gap:12px;color:var(--muted);font-size:.85rem}
    .divider::before,.divider::after{content:'';height:1px;flex:1;background:var(--line)}
    .social-buttons{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}
    .social-btn{display:flex;align-items:center;justify-content:center;gap:8px;background:#fff;color:var(--ink);border-color:var(--line)}
    .social-btn:disabled{opacity:.65}
    .google-icon{font-weight:700;color:#4285f4}
    .facebook-icon{font-size:1.2rem;font-weight:700;color:#1877f2}
    .social-note{margin:8px 0 0;text-align:center;font-size:.8rem}
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder); private auth = inject(AuthService); private router = inject(Router);
  error = signal('');
  form = this.fb.nonNullable.group({ email: ['', [Validators.required, Validators.email]], password: ['', Validators.required] });

  submit() {
    const { email, password } = this.form.getRawValue();
    const res = this.auth.login(email, password);
    if (res.error) return this.error.set(res.error);
    this.router.navigate([res.user!.role === 'admin' ? '/admin' : '/dashboard']);
  }
}