import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReportService, Report } from '../../services/report.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-view-reports',
  imports: [CommonModule, IonicModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>My Reports</ion-title>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/dashboard"></ion-back-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="reports-container">
        <ion-refresher slot="fixed" (ionRefresh)="refresh($any($event))">
          <ion-refresher-content pullingIcon="arrow-down" refreshingSpinner="circles"></ion-refresher-content>
        </ion-refresher>

        <ion-list *ngIf="reports$ | async as reports; else emptyState">
          <ion-item *ngFor="let report of reports" class="report-item">
            <ion-thumbnail slot="start" *ngIf="report.imageUrl">
              <img [src]="report.imageUrl" alt="Report image">
            </ion-thumbnail>
            
            <ion-label>
              <h2>{{ report.title }}</h2>
              <p>{{ report.description | slice:0:100 }}{{ report.description.length > 100 ? '...' : '' }}</p>
              <p class="report-meta">
                <ion-badge [color]="getStatusColor(report.status)">{{ report.status | titlecase }}</ion-badge>
                <span class="category">{{ report.category | titlecase }}</span>
                <span class="date">{{ report.createdAt | date:'short' }}</span>
              </p>
            </ion-label>
            
            <ion-button
              fill="clear"
              slot="end"
              (click)="viewReportDetails(report.id)"
              *ngIf="report.id">
              <ion-icon name="chevron-forward"></ion-icon>
            </ion-button>
          </ion-item>
        </ion-list>
        
        <ng-template #emptyState>
          <div class="empty-state">
            <ion-icon name="document-outline" class="empty-icon"></ion-icon>
            <h3>No Reports Yet</h3>
            <p>You haven't submitted any reports yet. Create your first report!</p>
            <ion-button 
              fill="outline" 
              (click)="createNewReport()"
              class="create-btn">
              Create Report
            </ion-button>
          </div>
        </ng-template>
      </div>
    </ion-content>
  `,
  styles: [`
    .reports-container {
      padding-top: 20px;
      background-color: white;
      color: black;
    }

    .report-item {
      --border-radius: 12px;
      --background: white;
      --color: black;
      margin-bottom: 1rem;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      border: 1px solid #ccc;
    }

    ion-item {
      --background: white;
      --color: black;
    }

    ion-thumbnail {
      --border-radius: 8px;
      width: 80px;
      height: 80px;
      margin: 0 10px 0 0;
    }

    ion-thumbnail img {
      object-fit: cover;
      border-radius: 8px;
    }

    .report-meta {
      margin-top: 8px;
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      color: #000000;
    }

    .category {
      color: #000000;
      font-size: 0.85em;
    }

    .date {
      color: #000000;
      font-size: 0.85em;
    }

    .empty-state {
      text-align: center;
      padding: 40px 20px;
      margin-top: 40px;
      background-color: white;
      color: black;
    }

    .empty-icon {
      font-size: 4rem;
      color: #3880ff;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      margin: 1rem 0 0.5rem 0;
      color: #000000;
    }

    .empty-state p {
      color: #000000;
      margin-bottom: 1.5rem;
    }

    .create-btn {
      --border-radius: 12px;
      --background: #3880ff; /* Blue background */
      --background-hover: #3171e0;
      --color: #ffffff; /* White text */
    }

    ion-title {
      color: #000000;
    }

    ion-buttons ion-button {
      --color: #000000 !important; /* Ensure header buttons are visible */
    }

    ion-icon {
      --color: #000000; /* Ensure icons are visible */
    }
  `]
})
export class ViewReportsComponent implements OnInit {
  reports$: Observable<Report[]>;

  constructor(private reportService: ReportService) {
    this.reports$ = this.reportService.getUserReports();
  }

  ngOnInit() {}

  refresh(event: any) {
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'resolved': return 'success';
      case 'in-progress': return 'warning';
      case 'pending': 
      default: return 'medium';
    }
  }

  viewReportDetails(reportId: string | undefined) {
    if (!reportId) {
      console.error('Report ID is undefined');
      return;
    }
    // Navigate to report details page
    console.log('View report details:', reportId);
  }

  createNewReport() {
    // Navigate to create report page
    console.log('Create new report');
  }
}