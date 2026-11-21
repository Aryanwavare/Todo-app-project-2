import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

const match = (g: AbstractControl) => g.get('password')?.value === g.get('confirm')?.value ? null : { mismatch: true };

@Component({
  selector: 'app-register', standalone: true, imports: [ReactiveFormsModule, RouterLink],
  template: `
  <main class="auth"><form class="card" [formGroup]="form" (ngSubmit)="submit()">
    <h1 style="margin-bottom:6px">Create your account</h1><p class="muted" style="margin-bottom:20px">It takes under a minute.</p>
    @if (error()) { <div class="alert" role="alert">{{ error() }}</div> }
    <div class="field"><label for="n">Full name</label><input id="n" formControlName="name" autocomplete="name">
      @if (c.name.touched && c.name.invalid) { <span class="err">Enter your name.</span> }</div>
    <div class="field"><label for="e">Email</label><input id="e" type="email" formControlName="email" autocomplete="email">
      @if (c.email.touched && c.email.invalid) { <span class="err">Enter a valid email address.</span> }</div>
    <div class="field"><label for="p">Password</label><input id="p" type="password" formControlName="password" autocomplete="new-password">
      @if (c.password.touched && c.password.invalid) { <span class="err">Use at least 6 characters.</span> }</div>
    <div class="field"><label for="c">Confirm password</label><input id="c" type="password" formControlName="confirm" autocomplete="new-password">
      @if (c.confirm.touched && form.hasError('mismatch')) { <span class="err">Passwords don't match.</span> }</div>
    <button class="btn" style="width:100%" [disabled]="form.invalid">Create account</button>
    <p class="muted" style="margin-top:14px">Already registered? <a routerLink="/login">Log in</a></p>
  </form></main>`
})
export class RegisterComponent {
  private fb = inject(FormBuilder); private auth = inject(AuthService); private router = inject(Router);
  error = signal('');
  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirm: ['', Validators.required],
  }, { validators: match });
  get c() { return this.form.controls; }

  submit() {
    const { name, email, password } = this.form.getRawValue();
    const err = this.auth.register(name, email, password);
    if (err) return this.error.set(err);
    this.auth.login(email, password);
    this.router.navigate(['/dashboard']);
  }
}