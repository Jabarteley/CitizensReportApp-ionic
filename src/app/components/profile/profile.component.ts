import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, DatePipe, IonicModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>User Profile</ion-title>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/dashboard"></ion-back-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="profile-container">
        <div class="profile-header">
          <ion-avatar class="profile-avatar">
            <ion-icon name="person-circle" class="avatar-icon"></ion-icon>
          </ion-avatar>
          <h1 class="profile-name">{{ userProfile?.displayName || 'User' }}</h1>
          <p class="profile-email">{{ userProfile?.email }}</p>
        </div>

        <ion-list class="profile-details">
          <ion-item>
            <ion-label>Full Name</ion-label>
            <ion-note slot="end">{{ userProfile?.displayName || 'Not set' }}</ion-note>
          </ion-item>
          
          <ion-item>
            <ion-label>Email</ion-label>
            <ion-note slot="end">{{ userProfile?.email }}</ion-note>
          </ion-item>
          
          <ion-item>
            <ion-label>Member Since</ion-label>
            <ion-note slot="end">{{ userProfile?.metadata?.creationTime | date:'mediumDate' }}</ion-note>
          </ion-item>
        </ion-list>

        <div class="profile-actions">
          <ion-button 
            expand="block" 
            fill="outline"
            (click)="updateProfile()"
            class="action-btn">
            <ion-icon name="create" slot="start"></ion-icon>
            Update Profile
          </ion-button>
          
          <ion-button 
            expand="block" 
            fill="outline"
            color="danger"
            (click)="changePassword()"
            class="action-btn">
            <ion-icon name="key" slot="start"></ion-icon>
            Change Password
          </ion-button>
          
          <ion-button 
            expand="block" 
            fill="clear"
            color="medium"
            (click)="logout()"
            class="action-btn logout-btn">
            <ion-icon name="log-out" slot="start"></ion-icon>
            Logout
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .profile-container {
      max-width: 500px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .profile-header {
      text-align: center;
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--ion-color-light);
    }
    
    .profile-avatar {
      width: 100px;
      height: 100px;
      margin: 0 auto 1rem;
      background-color: #3dc2ff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .avatar-icon {
      font-size: 5rem;
      color: #ffffff;
    }
    
    .profile-name {
      margin: 0 0 0.5rem;
      font-size: 1.8rem;
      color: var(--ion-color-dark);
    }
    
    .profile-email {
      margin: 0;
      color: var(--ion-color-medium);
    }
    
    .profile-details {
      margin-bottom: 2rem;
    }
    
    ion-item {
      --border-radius: 8px;
      margin-bottom: 0.5rem;
    }
    
    .profile-actions {
      margin-top: 2rem;
    }
    
    .action-btn {
      --border-radius: 12px;
      --background: #3880ff; /* Blue background */
      --background-hover: #3171e0;
      --color: #ffffff; /* White text */
      margin-bottom: 1rem;
    }
    
    .logout-btn {
      --border-radius: 12px;
      --background: #ff6b6b; /* Red for logout */
      --background-hover: #ff5252;
      --color: #ffffff; /* White text */
      margin-top: 1rem;
    }

    ion-title {
      color: #000000;
    }

    ion-button {
      --color: #000000;
    }

    ion-buttons ion-button {
      --color: #000000 !important; /* Ensure header buttons are visible */
    }
  `]
})
export class ProfileComponent implements OnInit {
  userProfile: any = null;

  constructor(
    private authService: AuthService,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.afAuth.user.subscribe(user => {
      if (user) {
        this.userProfile = user;
      }
    });
  }

  updateProfile() {
    // Navigate to update profile page
    console.log('Update profile clicked');
  }

  changePassword() {
    // Handle password change
    console.log('Change password clicked');
  }

  async logout() {
    await this.authService.logout();
  }
}