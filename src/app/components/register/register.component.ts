import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Register</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="register-container">
        <form [formGroup]="registerForm" (ngSubmit)="onRegister()">
          <ion-item>
            <ion-label position="floating">Full Name</ion-label>
            <ion-input 
              type="text" 
              formControlName="displayName"
              placeholder="Enter your full name">
            </ion-input>
          </ion-item>
          
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
          
          <ion-item>
            <ion-label position="floating">Confirm Password</ion-label>
            <ion-input 
              type="password" 
              formControlName="confirmPassword"
              placeholder="Confirm your password">
            </ion-input>
          </ion-item>
          
          <ion-button 
            expand="block" 
            type="submit" 
            [disabled]="registerForm.invalid || isSubmitting"
            class="ion-margin-top">
            {{ isSubmitting ? 'Creating Account...' : 'Register' }}
          </ion-button>
        </form>
        
        <div class="links ion-margin-top">
          <ion-button 
            fill="clear" 
            size="small" 
            (click)="goToLogin()">
            Already have an account? Login
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
    .register-container {
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
    }

    ion-label {
      --color: #000000;
    }

    ion-input, ion-textarea, ion-select {
      --background: white;
      --color: #000000;
      --placeholder-color: #888;
      --border-color: #ccc;
      --border-style: solid;
      --border-width: 1px;
      --border-radius: 8px;
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
      justify-content: center;
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
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      displayName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {}

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
    
    return null;
  }

  async onRegister() {
    if (this.registerForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = null;
      
      try {
        const { displayName, email, password } = this.registerForm.value;
        await this.authService.register(email, password, displayName);
        alert('Registration successful! You can now login.');
        this.router.navigate(['/login']);
      } catch (error: any) {
        this.errorMessage = error.message;
      } finally {
        this.isSubmitting = false;
      }
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}