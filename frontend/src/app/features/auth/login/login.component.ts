
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <main class="login-page">
      <div class="background-shape shape-one"></div>
      <div class="background-shape shape-two"></div>

      <section class="login-wrapper">

        <div class="brand">
          <div class="brand-icon">✓</div>
          <span>Tally</span>
        </div>

        <form class="login-card"
          [formGroup]="form"
          (ngSubmit)="submit()">

          <div class="welcome-icon">✦</div>

          <h1>Welcome back!</h1>

          <p class="subtitle">
            Stay organized. Get things done.
            <br>
            Log in to continue your journey.
          </p>

          @if (registered()) {
            <div class="success-message" role="status">
              ✓ Account created successfully. Please log in.
            </div>
          }

          @if (error()) {
            <div class="error-message" role="alert">
              ⚠ {{ error() }}
            </div>
          }

          <div class="form-group">
            <label for="email">Email address</label>

            <div class="input-wrapper">
              <span class="input-icon">✉</span>
              <input
                id="email"
                type="email"
                formControlName="email"
                placeholder="Enter your email"
                autocomplete="email"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>

            <div class="input-wrapper">
              <span class="input-icon">♙</span>
              <input
                id="password"
                [type]="showPassword() ? 'text' : 'password'"
                formControlName="password"
                placeholder="Enter your password"
                autocomplete="current-password"
              />

              <button
                type="button"
                class="toggle-password"
                (click)="togglePassword()"
                [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'">
                {{ showPassword() ? 'Hide' : 'Show' }}
              </button>
            </div>
          </div>

          <button
            class="login-button"
            type="submit"
            [disabled]="form.invalid">
            Sign in <span>→</span>
          </button>

          <div class="divider">
            <span>OR CONTINUE WITH</span>
          </div>

          <div class="social-buttons">
            <button type="button" class="social-button" disabled>
              <span class="google">G</span>
              Google
            </button>

            <button type="button" class="social-button" disabled>
              <span class="facebook">f</span>
              Facebook
            </button>
          </div>

          <p class="social-note">
            Social sign-in is coming soon.
          </p>

          <div class="register-link">
            Don't have an account?
            <a routerLink="/register">Create account</a>
          </div>

        </form>

        <p class="footer-text">
          © 2026 Tally. Make every day productive.
        </p>

      </section>
    </main>
  `,

  styles: [`
    :host {
      display: block;
      font-family: 'Figtree', system-ui, sans-serif;
    }

    .login-page {
      min-height: 100vh;
      min-height: 100dvh;
      background: linear-gradient(135deg, #f8f7ff, #eeebff, #f8f5ff);
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 35px 20px;
      position: relative;
      overflow-x: clip;
      box-sizing: border-box;
    }

    .background-shape {
      position: absolute;
      border-radius: 50%;
      filter: blur(2px);
      pointer-events: none;
    }

    .shape-one {
      width: 350px;
      height: 350px;
      background: #dcd5ff;
      opacity: 0.4;
      top: -130px;
      left: -100px;
    }

    .shape-two {
      width: 400px;
      height: 400px;
      background: #e5ddff;
      opacity: 0.55;
      bottom: -180px;
      right: -100px;
    }

    .login-wrapper {
      width: 100%;
      max-width: 500px;
      position: relative;
      z-index: 1;
      margin: auto;
    }

    .brand {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 26px;
      font-size: 27px;
      font-weight: 800;
      color: #28234c;
      letter-spacing: -1px;
    }

    .brand-icon {
      width: 48px;
      height: 48px;
      border-radius: 15px;
      background: #7965e8;
      color: white;
      display: grid;
      place-items: center;
      font-size: 27px;
      box-shadow: 0 7px 18px #7965e850;
    }

    .login-card {
      background: rgba(255, 255, 255, 0.96);
      padding: 40px;
      border: 1px solid #e9e5fa;
      border-radius: 25px;
      box-shadow: 0 20px 60px rgba(54, 43, 111, 0.10);
      box-sizing: border-box;
    }

    .welcome-icon {
      width: 56px;
      height: 56px;
      background: #f0edff;
      color: #7965e8;
      display: grid;
      place-items: center;
      border-radius: 17px;
      font-size: 27px;
      margin-bottom: 21px;
    }

    h1 {
      color: #242044;
      font-size: 30px;
      font-weight: 800;
      letter-spacing: -1px;
      margin: 0 0 9px;
    }

    .subtitle {
      color: #85819e;
      font-size: 14px;
      line-height: 1.7;
      margin: 0 0 29px;
    }

    .form-group {
      margin-bottom: 21px;
    }

    .form-group label {
      display: block;
      font-size: 13px;
      font-weight: 700;
      color: #302b50;
      margin-bottom: 10px;
    }

    .input-wrapper {
      display: flex;
      align-items: center;
      border: 1px solid #e6e3f0;
      border-radius: 12px;
      background: #fbfaff;
      padding: 0 15px;
      transition: all 0.2s ease;
    }

    .input-wrapper:focus-within {
      border-color: #7965e8;
      box-shadow: 0 0 0 4px #7965e818;
      background: white;
    }

    .input-icon {
      color: #9389bd;
      font-size: 18px;
      margin-right: 11px;
    }

    .input-wrapper input {
      border: none;
      outline: none;
      box-shadow: none;
      background: transparent;
      padding: 16px 0;
      font-size: 14px;
      color: #242044;
      width: 100%;
      min-width: 0;
    }

    .input-wrapper input::placeholder {
      color: #aaa6bc;
    }

    .toggle-password {
      border: none;
      background: transparent;
      color: #7965e8;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      padding: 8px 0 8px 10px;
    }

    .login-button {
      width: 100%;
      margin-top: 7px;
      padding: 16px;
      border: none;
      border-radius: 12px;
      background: linear-gradient(110deg, #7965e8, #6550d3);
      color: white;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      box-shadow: 0 7px 18px #7965e840;
      transition: all 0.2s ease;
    }

    .login-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 22px #7965e850;
    }

    .login-button:disabled {
      opacity: 0.55;
      cursor: not-allowed;
      box-shadow: none;
    }

    .login-button span {
      font-size: 19px;
    }

    .divider {
      display: flex;
      align-items: center;
      gap: 13px;
      margin: 26px 0 19px;
      color: #a09bb5;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1px;
    }

    .divider::before,
    .divider::after {
      content: '';
      height: 1px;
      flex: 1;
      background: #ebe8f3;
    }

    .social-buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .social-button {
      padding: 13px 8px;
      border: 1px solid #e9e6f1;
      background: white;
      color: #48435f;
      border-radius: 11px;
      font-size: 13px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 9px;
      opacity: 0.7;
      cursor: not-allowed;
    }

    .google {
      color: #4285f4;
      font-size: 17px;
      font-weight: 800;
    }

    .facebook {
      color: #1877f2;
      font-size: 19px;
      font-weight: 800;
    }

    .social-note {
      color: #aaa5bb;
      font-size: 11px;
      text-align: center;
      margin: 11px 0 0;
    }

    .register-link {
      text-align: center;
      border-top: 1px solid #eeebf5;
      padding-top: 22px;
      margin-top: 24px;
      font-size: 13px;
      color: #85819e;
    }

    .register-link a {
      color: #725ce0;
      font-weight: 800;
      text-decoration: none;
      margin-left: 4px;
    }

    .register-link a:hover {
      text-decoration: underline;
    }

    .error-message {
      padding: 12px;
      border-radius: 10px;
      background: #fff0ee;
      color: #b5412f;
      font-size: 13px;
      margin-bottom: 19px;
    }

    .success-message {
      padding: 12px;
      border-radius: 10px;
      background: #edf8f0;
      color: #347a45;
      font-size: 13px;
      margin-bottom: 19px;
    }

    .footer-text {
      text-align: center;
      color: #a09bb5;
      font-size: 11px;
      margin-top: 23px;
    }

    @media (max-width: 480px) {
      .login-page {
        padding: 22px 14px;
      }

      .login-card {
        padding: 28px 21px;
        border-radius: 20px;
      }

      h1 {
        font-size: 26px;
      }

      .brand {
        margin-bottom: 20px;
      }
    }
  `]
})
export class LoginComponent {

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  error = signal('');
  registered = signal(this.route.snapshot.queryParamMap.get('registered') === 'true');
  showPassword = signal(false);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  togglePassword() {
    this.showPassword.update(value => !value);
  }

  submit() {
    const { email, password } = this.form.getRawValue();
    this.auth.login(email, password).subscribe(res => {
      if (res.error) { this.error.set(res.error); return; }
      this.router.navigate([res.user!.role === 'admin' ? '/admin' : '/dashboard']);
    });
  }
}
