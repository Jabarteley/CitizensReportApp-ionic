import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { map, finalize, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Cloudinary } from 'cloudinary-core';

export interface Report {
  id?: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  userId: string;
  status: 'pending' | 'in-progress' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private reportsCollection: AngularFirestoreCollection<Report>;
  private cloudinary: Cloudinary;

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private authService: AuthService
  ) {
    this.reportsCollection = this.afs.collection<Report>('reports');
    
    // Initialize Cloudinary
    this.cloudinary = new Cloudinary({
      cloud_name: 'dru0vlphj', // Extracted from CLOUDINARY_URL
      api_key: '176712116954317', // Extracted from CLOUDINARY_URL
    });
  }

  // Create a new report
  async createReport(reportData: Omit<Report, 'id' | 'userId' | 'createdAt' | 'updatedAt'>, imageFile?: File) {
    try {
      const user = await this.authService.getCurrentUser().toPromise();
      if (!user) {
        throw new Error('User not authenticated');
      }

      let imageUrl = '';
      if (imageFile) {
        imageUrl = await this.uploadImageToCloudinary(imageFile);
      }

      const report: Report = {
        ...reportData,
        userId: user.uid,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (imageUrl) {
        report.imageUrl = imageUrl;
      }

      const docRef = await this.reportsCollection.add(report);
      return docRef.id;
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  }

  // Upload image to Cloudinary
  private async uploadImageToCloudinary(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const url = `https://api.cloudinary.com/v1_1/dru0vlphj/image/upload`;
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'default'); // You might need to create and use an upload preset
      
      fetch(url, {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        if (data.secure_url) {
          resolve(data.secure_url);
        } else {
          reject(new Error('Upload failed'));
        }
      })
      .catch(error => {
        console.error('Cloudinary upload error:', error);
        reject(error);
      });
    });
  }

  // Get all reports for the current user
  getUserReports(): Observable<Report[]> {
    return this.authService.getCurrentUser().pipe(
      map(user => user?.uid),
      switchMap(userId => {
        if (!userId) return [];
        return this.afs.collection<Report>('reports', ref => 
          ref.where('userId', '==', userId).orderBy('createdAt', 'desc')
        ).snapshotChanges().pipe(
          map(actions => {
            return actions.map(action => {
              const data = action.payload.doc.data();
              const id = action.payload.doc.id;
              return { id, ...data };
            });
          })
        );
      })
    );
  }

  // Get all reports (for admin)
  getAllReports(): Observable<Report[]> {
    return this.afs.collection<Report>('reports', ref => 
      ref.orderBy('createdAt', 'desc')
    ).snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data();
          const id = action.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  // Get a specific report by ID
  getReportById(id: string): Observable<Report | undefined> {
    return this.afs.collection('reports').doc<Report>(id).valueChanges();
  }

  // Update a report
  async updateReport(id: string, reportData: Partial<Omit<Report, 'id' | 'userId' | 'createdAt'>>) {
    try {
      const reportRef = this.afs.collection('reports').doc(id);
      const updateData = {
        ...reportData,
        updatedAt: new Date()
      };
      await reportRef.update(updateData);
    } catch (error) {
      console.error('Error updating report:', error);
      throw error;
    }
  }

  // Delete a report
  async deleteReport(id: string) {
    try {
      await this.afs.collection('reports').doc(id).delete();
    } catch (error) {
      console.error('Error deleting report:', error);
      throw error;
    }
  }

  // Update report status (for admin)
  async updateReportStatus(id: string, status: 'pending' | 'in-progress' | 'resolved') {
    try {
      const reportRef = this.afs.collection('reports').doc(id);
      await reportRef.update({
        status,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating report status:', error);
      throw error;
    }
  }
}