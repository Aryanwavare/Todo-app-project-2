
import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

const match = (g: AbstractControl) =>
  g.get('password')?.value === g.get('confirm')?.value
    ? null
    : { mismatch: true };

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],

  template: `
  <main class="register-page">

    <div class="brand">
      <span class="brand-icon">✓</span>
      <span>Tally</span>
    </div>

    <form class="register-card"
      [formGroup]="form"
      (ngSubmit)="submit()">

      <div class="welcome-icon">✦</div>

      <h1>Create your account</h1>

      <p class="subtitle">
        Start organizing your day, one task at a time.
      </p>

      @if (error()) {
        <div class="error-box" role="alert">
          {{ error() }}
        </div>
      }

      <div class="field">
        <label for="name">Full name</label>
        <input id="name"
          type="text"
          formControlName="name"
          placeholder="Enter your full name"
          autocomplete="name">

        @if (c.name.touched && c.name.invalid) {
          <span class="err">Please enter your full name.</span>
        }
      </div>

      <div class="field">
        <label for="email">Email address</label>
        <input id="email"
          type="email"
          formControlName="email"
          placeholder="Enter your email"
          autocomplete="email">

        @if (c.email.touched && c.email.invalid) {
          <span class="err">Enter a valid email address.</span>
        }
      </div>

      <div class="field">
        <label for="password">Password</label>

        <div class="password-wrap">
          <input id="password"
            [type]="showPassword() ? 'text' : 'password'"
            formControlName="password"
            placeholder="Create a password"
            autocomplete="new-password">

          <button type="button"
            class="toggle-btn"
            (click)="togglePassword()">
            {{ showPassword() ? 'Hide' : 'Show' }}
          </button>
        </div>

        @if (c.password.touched && c.password.invalid) {
          <span class="err">Password must contain at least 6 characters.</span>
        }
      </div>

      <div class="field">
        <label for="confirm">Confirm password</label>

        <div class="password-wrap">
          <input id="confirm"
            [type]="showConfirm() ? 'text' : 'password'"
            formControlName="confirm"
            placeholder="Re-enter your password"
            autocomplete="new-password">

          <button type="button"
            class="toggle-btn"
            (click)="toggleConfirm()">
            {{ showConfirm() ? 'Hide' : 'Show' }}
          </button>
        </div>

        @if (c.confirm.touched && form.hasError('mismatch')) {
          <span class="err">Passwords do not match.</span>
        }
      </div>

      <button class="create-btn"
        type="submit"
        [disabled]="form.invalid">
        Create account <span>→</span>
      </button>

      <div class="login-link">
        Already have an account?
        <a routerLink="/login">Log in</a>
      </div>

    </form>

    <p class="footer-text">
      © 2026 Tally. Make every day productive.
    </p>

  </main>
  `,

  styles: [`
    :host {
      display: block;
      min-height: 100%;
      font-family: 'Figtree', system-ui, sans-serif;
    }

    .register-page {
      min-height: 100dvh;
      padding: 35px 18px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background:
        radial-gradient(circle at 10% 10%, #e5ddff 0, transparent 32%),
        radial-gradient(circle at 90% 90%, #e8e1ff 0, transparent 32%),
        linear-gradient(135deg, #f8f6ff, #eeebff);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 11px;
      font-size: 27px;
      font-weight: 800;
      letter-spacing: -1px;
      color: #241c4b;
      margin-bottom: 25px;
    }

    .brand-icon {
      width: 45px;
      height: 45px;
      display: grid;
      place-items: center;
      background: linear-gradient(135deg, #8069ef, #a18ce9);
      color: white;
      border-radius: 14px;
      font-size: 26px;
      box-shadow: 0 7px 18px #7960ed40;
    }

    .register-card {
      width: 100%;
      max-width: 465px;
      background: rgba(255,255,255,.96);
      padding: 38px 40px;
      border: 1px solid rgba(255,255,255,.9);
      border-radius: 25px;
      box-shadow:
        0 25px 70px #39227c18,
        0 3px 12px #39227c08;
    }

    .welcome-icon {
      width: 53px;
      height: 53px;
      display: grid;
      place-items: center;
      border-radius: 16px;
      background: linear-gradient(135deg, #f0ecff, #e9e2ff);
      color: #7960ed;
      font-size: 25px;
      margin-bottom: 19px;
    }

    h1 {
      color: #241c4b;
      font-size: 29px;
      font-weight: 800;
      letter-spacing: -.8px;
      margin: 0 0 9px;
      line-height: 1.25;
    }

    .subtitle {
      color: #85809f;
      font-size: 14px;
      margin: 0 0 26px;
      line-height: 1.6;
    }

    .field {
      display: grid;
      gap: 8px;
      margin-bottom: 19px;
    }

    .field label {
      color: #302951;
      font-size: 13px;
      font-weight: 700;
    }

    .field input {
      width: 100%;
      height: 52px;
      padding: 0 15px;
      border: 1px solid #e7e3f2;
      border-radius: 11px;
      background: #fbfaff;
      color: #302951;
      font: inherit;
      font-size: 14px;
      transition: border-color .2s, box-shadow .2s, background .2s;
    }

    .field input::placeholder {
      color: #aaa5bf;
    }

    .field input:focus {
      outline: none;
      border-color: #8b76ef;
      background: white;
      box-shadow: 0 0 0 4px #7960ed16;
    }

    .password-wrap {
      position: relative;
      width: 100%;
    }

    .password-wrap input {
      padding-right: 65px;
    }

    .toggle-btn {
      position: absolute;
      right: 13px;
      top: 50%;
      transform: translateY(-50%);
      border: none;
      background: transparent;
      color: #7960ed;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
    }

    .toggle-btn:hover {
      color: #5842c5;
    }

    .err {
      color: #d04455;
      font-size: 12px;
    }

    .error-box {
      background: #fff0f0;
      color: #b83245;
      border: 1px solid #f8dada;
      border-radius: 10px;
      padding: 12px;
      margin-bottom: 17px;
      font-size: 13px;
    }

    .create-btn {
      width: 100%;
      height: 53px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      border: none;
      border-radius: 11px;
      background: linear-gradient(110deg, #8069ef, #a18ce9);
      color: white;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      margin-top: 7px;
      transition: transform .2s, box-shadow .2s, opacity .2s;
      box-shadow: 0 8px 20px #8069ef30;
    }

    .create-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 12px 25px #8069ef45;
    }

    .create-btn:active:not(:disabled) {
      transform: translateY(0);
    }

    .create-btn:disabled {
      opacity: .55;
      cursor: not-allowed;
    }

    .create-btn span {
      font-size: 20px;
    }

    .login-link {
      text-align: center;
      margin-top: 24px;
      color: #85809f;
      font-size: 13px;
    }

    .login-link a {
      color: #7960ed;
      font-weight: 700;
      text-decoration: none;
      margin-left: 4px;
    }

    .login-link a:hover {
      text-decoration: underline;
    }

    .footer-text {
      color: #9690b1;
      font-size: 12px;
      margin-top: 23px;
      text-align: center;
    }

    @media (max-width: 480px) {
      .register-card {
        padding: 29px 22px;
        border-radius: 21px;
      }

      h1 {
        font-size: 25px;
      }

      .register-page {
        padding: 25px 14px;
      }

      .brand {
        font-size: 24px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .field input,
      .create-btn {
        transition: none;
      }
    }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  error = signal('');
  showPassword = signal(false);
  showConfirm = signal(false);

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirm: ['', Validators.required],
  }, { validators: match });

  get c() {
    return this.form.controls;
  }

  togglePassword() {
    this.showPassword.update(value => !value);
  }

  toggleConfirm() {
    this.showConfirm.update(value => !value);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, email, password } = this.form.getRawValue();

    const err = this.auth.register(name, email, password);

    if (err) {
      this.error.set(err);
      return;
    }

    this.auth.login(email, password);
    this.router.navigate(['/dashboard']);
  }
}
