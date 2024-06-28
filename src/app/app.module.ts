import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule, getAuth, provideAuth } from '@angular/fire/auth';
import { Test2Component } from './components/test2/test2.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environment/environment.dev';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { HeaderComponent } from './components/header/header.component';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoAutorizadoComponent } from './components/no-autorizado/no-autorizado.component';



@NgModule({
  declarations: [
    AppComponent,
    Test2Component,
    HeaderComponent,
    NoAutorizadoComponent,
  ],
  imports: [
    MatIconModule,
    BrowserModule,
    AuthModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)), 
    provideFirestore(() => getFirestore()), 
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage())
  ],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
