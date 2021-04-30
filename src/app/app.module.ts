import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire/';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { environment } from 'src/environments/environment';

import { LoginDeveloperComponent } from './components/login-user/login-user.component';
import { RegisterDeveloperComponent } from './components/register-developer/register-developer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ErrorComponent } from './components/error/error.component';

import { SearchPipe } from './components/feed/companies/search.pipe';
import { CompanyModule } from './components/company-profile/company.module';
import { LoginCompanyComponent } from './components/login-company/login-company.component';
import { RegisterCompanyComponent } from './components/register-company/register-company.component';
import { DeveloperModule } from './components/developer-profile/developer.module';
import { FeedModule } from './components/feed/feed.module';
import { SharedModule } from './components/shared/shared.module';
import { HomeComponent } from './components/home/home.component';
@NgModule({
  declarations: [
    AppComponent,

    LoginDeveloperComponent,
    RegisterDeveloperComponent,
    LoginCompanyComponent,
    RegisterCompanyComponent,

    ErrorComponent,
    SearchPipe,
    HomeComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    CompanyModule,
    DeveloperModule,
    FeedModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
