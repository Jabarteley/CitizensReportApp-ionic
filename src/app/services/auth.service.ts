import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
    // Subscribe to auth state changes
    this.afAuth.authState.subscribe(user => {
      this.userSubject.next(user);
    });
  }

  // Register user with email and password
  async register(email: string, password: string, displayName?: string) {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
      
      if (result.user && displayName) {
        await result.user.updateProfile({ displayName });
      }
      
      return result;
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Login user with email and password
  async login(email: string, password: string) {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(email, password);
      return result;
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Logout user
  async logout() {
    try {
      await this.afAuth.signOut();
      this.router.navigate(['/login']);
    } catch (error: any) {
      throw new Error('Logout failed');
    }
  }

  // Reset password
  async resetPassword(email: string) {
    try {
      await this.afAuth.sendPasswordResetEmail(email);
      return true;
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Get current user
  getCurrentUser(): Observable<any> {
    return this.afAuth.user;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.userSubject.value !== null;
  }

  // Helper method to get error messages
  private getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Email is already in use';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/operation-not-allowed':
        return 'Operation not allowed';
      case 'auth/weak-password':
        return 'Password is too weak';
      case 'auth/user-disabled':
        return 'User account is disabled';
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
        return 'Incorrect password';
      default:
        return 'An error occurred';
    }
  }
}