import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Import environment variables
const firebaseConfig = {
  apiKey: "AIzaSyDQ8EM2uIFexmji-bXj1RPzi1SYYY5A1pE",
  authDomain: "citizen-reportapp-ionic.firebaseapp.com",
  projectId: "citizen-reportapp-ionic",
  storageBucket: "citizen-reportapp-ionic.firebasestorage.app",
  messagingSenderId: "690462514480",
  appId: "1:690462514480:web:9b499d409de3e6768bfcf5"
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireMessagingModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
