import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="login-container">
        <form [formGroup]="loginForm" (ngSubmit)="onLogin()">
          <ion-item>
            <ion-label position="floating">Email</ion-label>
            <ion-input 
              type="email" 
              formControlName="email"
              placeholder="Enter your email">
            </ion-input>
          </ion-item>
          
          <ion-item>
            <ion-label position="floating">Password</ion-label>
            <ion-input 
              type="password" 
              formControlName="password"
              placeholder="Enter your password">
            </ion-input>
          </ion-item>
          
          <ion-button 
            expand="block" 
            type="submit" 
            [disabled]="loginForm.invalid || isSubmitting"
            class="ion-margin-top">
            {{ isSubmitting ? 'Logging in...' : 'Login' }}
          </ion-button>
        </form>
        
        <div class="links ion-margin-top">
          <ion-button 
            fill="clear" 
            size="small" 
            (click)="forgotPassword()">
            Forgot Password?
          </ion-button>
          
          <ion-button 
            fill="clear" 
            size="small" 
            (click)="goToRegister()">
            Don't have an account? Register
          </ion-button>
        </div>
        
        <ion-card *ngIf="errorMessage" class="error-card">
          <ion-card-content>
            {{ errorMessage }}
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  `,
  styles: [`
    .login-container {
      max-width: 400px;
      margin: 0 auto;
      background-color: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    form {
      margin-top: 2rem;
    }

    ion-item {
      --border-radius: 8px;
      --background: white;
      --color: black;
      margin-bottom: 1rem;
      border: 1px solid #ccc;
      --border-color: #ccc;
    }

    ion-label {
      --color: #000000;
    }

    ion-input, ion-textarea {
      --background: white;
      --color: #000000;
      --placeholder-color: #888;
      --border-color: #ccc;
    }

    ion-button {
      --border-radius: 8px;
      --background: #3880ff; /* Blue background */
      --background-hover: #3171e0;
      --color: #ffffff; /* White text */
      margin-top: 1rem;
    }

    .links {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;
    }

    ion-button[fill="clear"] {
      --color: #000000; /* Black text for better contrast */
    }

    .error-card {
      --ion-background-color: #ffebee;
      --ion-text-color: #c62828;
      margin-top: 1rem;
      --background: #ffebee;
      --color: #c62828;
    }

    ion-title {
      color: #000000;
    }

    ion-buttons ion-button {
      --color: #000000 !important; /* Ensure header buttons are visible */
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {}

  async onLogin() {
    if (this.loginForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = null;
      
      try {
        const { email, password } = this.loginForm.value;
        await this.authService.login(email, password);
        this.router.navigate(['/dashboard']); // Redirect to dashboard after login
      } catch (error: any) {
        this.errorMessage = error.message;
      } finally {
        this.isSubmitting = false;
      }
    }
  }

  async forgotPassword() {
    if (this.loginForm.get('email')?.valid) {
      const email = this.loginForm.get('email')?.value;
      try {
        await this.authService.resetPassword(email);
        alert('Password reset email sent. Please check your inbox.');
      } catch (error: any) {
        this.errorMessage = error.message;
      }
    } else {
      alert('Please enter a valid email address');
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}