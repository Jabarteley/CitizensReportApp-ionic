import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReportService } from '../../services/report.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-create-report',
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Create Report</ion-title>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/dashboard"></ion-back-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form [formGroup]="reportForm" (ngSubmit)="onSubmit()">
        <ion-item>
          <ion-label position="stacked">Title *</ion-label>
          <ion-input 
            type="text" 
            formControlName="title"
            placeholder="Enter report title">
          </ion-input>
        </ion-item>
        
        <ion-item>
          <ion-label position="stacked">Category *</ion-label>
          <ion-select formControlName="category" placeholder="Select category">
            <ion-select-option value="road">Road Issues</ion-select-option>
            <ion-select-option value="security">Security Concerns</ion-select-option>
            <ion-select-option value="environment">Environmental Issues</ion-select-option>
            <ion-select-option value="public-service">Public Service Complaints</ion-select-option>
            <ion-select-option value="other">Other</ion-select-option>
          </ion-select>
        </ion-item>
        
        <ion-item>
          <ion-label position="stacked">Description *</ion-label>
          <ion-textarea 
            formControlName="description"
            placeholder="Describe the issue in detail"
            rows="4">
          </ion-textarea>
        </ion-item>
        
        <ion-item class="image-upload">
          <ion-label position="stacked">Add Photo (Optional)</ion-label>
          <div class="image-preview-container" *ngIf="imagePreview">
            <img [src]="imagePreview" alt="Preview" class="image-preview">
            <ion-button 
              fill="clear" 
              color="danger" 
              size="small"
              (click)="removeImage()"
              class="remove-image-btn">
              <ion-icon name="close-circle"></ion-icon>
            </ion-button>
          </div>
          <ion-button 
            expand="block" 
            fill="outline"
            (click)="captureImage()"
            *ngIf="!imagePreview">
            <ion-icon name="camera" slot="start"></ion-icon>
            Capture Image
          </ion-button>
          <ion-button 
            expand="block" 
            fill="outline"
            (click)="selectImage()"
            *ngIf="!imagePreview">
            <ion-icon name="image" slot="start"></ion-icon>
            Select from Gallery
          </ion-button>
        </ion-item>
        
        <ion-button 
          expand="block" 
          type="submit" 
          [disabled]="reportForm.invalid || isSubmitting"
          class="ion-margin-top submit-btn">
          {{ isSubmitting ? 'Submitting...' : 'Submit Report' }}
        </ion-button>
      </form>
      
      <ion-card *ngIf="successMessage" class="success-card">
        <ion-card-content>
          {{ successMessage }}
        </ion-card-content>
      </ion-card>
      
      <ion-card *ngIf="errorMessage" class="error-card">
        <ion-card-content>
          {{ errorMessage }}
        </ion-card-content>
      </ion-card>
    </ion-content>
  `,
  styles: [`
    form {
      margin-top: 1rem;
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

    .image-upload {
      flex-direction: column;
      align-items: stretch;
    }

    .image-preview-container {
      position: relative;
      width: 100%;
      margin-bottom: 1rem;
    }

    .image-preview {
      width: 100%;
      height: auto;
      border-radius: 8px;
      max-height: 300px;
      object-fit: cover;
      border: 1px solid #ccc;
    }

    .remove-image-btn {
      position: absolute;
      top: -10px;
      right: -10px;
      --padding-start: 4px;
      --padding-end: 4px;
    }

    .submit-btn {
      --border-radius: 12px;
      --background: #3880ff; /* Blue background */
      --background-hover: #3171e0;
      --color: #ffffff; /* White text */
    }

    .success-card {
      --ion-background-color: #e8f5e9;
      --ion-text-color: #2e7d32;
      margin-top: 1rem;
      --background: #e8f5e9;
      --color: #2e7d32;
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
export class CreateReportComponent implements OnInit {
  reportForm: FormGroup;
  isSubmitting = false;
  imagePreview: string | null = null;
  capturedFile: File | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private reportService: ReportService
  ) {
    this.reportForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      category: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit() {}

  async captureImage() {
    try {
      const image = await Camera.getPhoto({
        quality: 50,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });

      // Convert to blob and then to file
      const response = await fetch(image.webPath!);
      const blob = await response.blob();
      this.capturedFile = new File([blob], `report_image_${Date.now()}.jpg`, { type: blob.type });
      this.imagePreview = image.webPath!;
      this.errorMessage = null;
    } catch (error) {
      this.errorMessage = 'Failed to capture image. Please try again.';
      console.error('Camera error:', error);
    }
  }

  async selectImage() {
    try {
      const image = await Camera.getPhoto({
        quality: 50,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos
      });

      // Convert to blob and then to file
      const response = await fetch(image.webPath!);
      const blob = await response.blob();
      this.capturedFile = new File([blob], `report_image_${Date.now()}.jpg`, { type: blob.type });
      this.imagePreview = image.webPath!;
      this.errorMessage = null;
    } catch (error) {
      this.errorMessage = 'Failed to select image. Please try again.';
      console.error('Gallery selection error:', error);
    }
  }

  removeImage() {
    this.imagePreview = null;
    this.capturedFile = null;
  }

  async onSubmit() {
    if (this.reportForm.valid) {
      this.isSubmitting = true;
      this.successMessage = null;
      this.errorMessage = null;

      try {
        const formData = this.reportForm.value;
        await this.reportService.createReport(formData, this.capturedFile || undefined);
        
        this.successMessage = 'Report submitted successfully!';
        this.reportForm.reset();
        this.removeImage();
        
        // Optionally navigate back after a delay
        setTimeout(() => {
          window.history.back();
        }, 2000);
      } catch (error: any) {
        this.errorMessage = error.message || 'Failed to submit report. Please try again.';
      } finally {
        this.isSubmitting = false;
      }
    }
  }
}