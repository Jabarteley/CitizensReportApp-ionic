import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private messageSource = new BehaviorSubject<any>(null);
  currentMessage = this.messageSource.asObservable();

  constructor(private angularFireMessaging: AngularFireMessaging) {
    this.requestPermission();
    this.receiveMessages();
  }

  // Request permission for notifications
  requestPermission() {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        console.log('FCM Token:', token);
        // Store token in your database for sending targeted notifications
      },
      (error) => {
        console.error('Unable to get permission to notify.', error);
      }
    );
  }

  // Receive messages
  receiveMessages() {
    this.angularFireMessaging.messages.subscribe(
      (payload) => {
        console.log('Message received: ', payload);
        this.messageSource.next(payload);
      });
  }

  // Send notification to specific user (admin function)
  async sendNotification(userId: string, title: string, body: string) {
    // This would typically be called from your backend
    // Frontend can't directly send FCM notifications to other users
    console.warn('Sending notifications from frontend is not recommended. Use your backend for this.');
  }

  // Subscribe to topic
  subscribeToTopic(topic: string) {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        // Subscribe to topic using Firebase Functions or backend
        console.log(`Subscribed to topic: ${topic}`, token);
      });
  }

  // Unsubscribe from topic
  unsubscribeFromTopic(topic: string) {
    // Unsubscribe from topic using Firebase Functions or backend
    console.log(`Unsubscribed from topic: ${topic}`);
  }
}