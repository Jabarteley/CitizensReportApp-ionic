import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ReportService, Report } from '../../services/report.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, IonicModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Dashboard</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="goToProfile()">
            <ion-icon name="person"></ion-icon>
          </ion-button>
          <ion-button (click)="logout()">
            <ion-icon name="log-out"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="welcome-container">
        <h1>Welcome to Citizen Report!</h1>
        <p>Report issues in your community and track their status.</p>
        
        <div class="actions">
          <ion-button 
            expand="block" 
            fill="solid" 
            size="large"
            (click)="createReport()"
            class="action-btn">
            <ion-icon name="add" slot="start"></ion-icon>
            Create New Report
          </ion-button>
          
          <ion-button 
            expand="block" 
            fill="outline" 
            size="large"
            (click)="viewReports()"
            class="action-btn">
            <ion-icon name="list" slot="start"></ion-icon>
            View My Reports
          </ion-button>
        </div>
        
        <div class="quick-stats">
          <ion-card>
            <ion-card-content>
              <h3>Total Reports</h3>
              <p>{{ totalReports$ | async }}</p>
            </ion-card-content>
          </ion-card>
          
          <ion-card>
            <ion-card-content>
              <h3>Pending</h3>
              <p>{{ pendingReports$ | async }}</p>
            </ion-card-content>
          </ion-card>
          
          <ion-card>
            <ion-card-content>
              <h3>Resolved</h3>
              <p>{{ resolvedReports$ | async }}</p>
            </ion-card-content>
          </ion-card>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .welcome-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      text-align: center;
      background-color: white;
      color: black;
    }

    h1 {
      font-size: 1.8rem;
      margin-bottom: 1rem;
      color: #32CD32; /* Lime green color */
    }

    p {
      font-size: 1.1rem;
      color: #000000; /* Black color */
      margin-bottom: 2rem;
    }

    .actions {
      margin-top: 2rem;
    }

    .action-btn {
      margin-bottom: 1rem;
      --border-radius: 12px;
      --background: #3880ff; /* Blue background */
      --background-hover: #3171e0;
      --color: #ffffff; /* White text */
    }

    ion-button[fill="outline"] {
      --border-color: #3880ff;
      --color: #3880ff;
      --border-radius: 12px;
    }

    .quick-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 1rem;
      margin-top: 2rem;
    }

    ion-card {
      text-align: center;
      --border-radius: 12px;
      --background: #f4f5f8; /* Light background */
      color: black;
    }

    ion-card h3 {
      font-size: 0.9rem;
      color: #000000; /* Black color */
      margin: 0 0 0.5rem 0;
    }

    ion-card p {
      font-size: 1.5rem;
      font-weight: bold;
      margin: 0;
      color: #000000; /* Black color */
    }

    ion-button {
      --color: #000000; /* Black text for buttons */
    }

    ion-buttons ion-button {
      --color: #000000 !important; /* Ensure header buttons are visible */
    }
  `]
})
export class DashboardComponent implements OnInit {
  totalReports$: Observable<number>;
  pendingReports$: Observable<number>;
  resolvedReports$: Observable<number>;

  constructor(
    private authService: AuthService,
    private reportService: ReportService,
    private router: Router
  ) {
    // Calculate stats from user reports
    const userReports$ = this.reportService.getUserReports();
    
    this.totalReports$ = userReports$.pipe(
      map(reports => reports.length)
    );
    
    this.pendingReports$ = userReports$.pipe(
      map(reports => reports.filter(report => report.status === 'pending').length)
    );
    
    this.resolvedReports$ = userReports$.pipe(
      map(reports => reports.filter(report => report.status === 'resolved').length)
    );
  }

  ngOnInit() {
  }

  async logout() {
    await this.authService.logout();
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  createReport() {
    this.router.navigate(['/create-report']);
  }

  viewReports() {
    this.router.navigate(['/my-reports']);
  }
}