import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './main/header/header.component';
//import { LoginComponent } from './fonctionnalite/login/login.component';
//import { RegisterComponent } from './fonctionnalite/register/register.component';
import { UnauthorizedComponent } from './fonctionnalite/unauthorized/unauthorized.component';
import { BodyComponent } from './main/body/body.component';
import { FooterComponent } from './main/footer/footer.component';
import { VeterinaireSearchComponent } from './components/veterinaire-search/veterinaire-search.component';
import { ProfileCompletionModalComponent } from './components/profile-completion-modal/profile-completion-modal.component';
import { VeterinaireProfileComponent } from './components/veterinaire-profile/veterinaire-profile.component';
import { AuthentificationComponent } from './fonctionnalite/authentification/authentification.component';
import { FileUrlPipe } from './pipes/file-url.pipe';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { Aside1Component } from './main/aside1/aside1.component';
import { Aside2Component } from './main/aside2/aside2.component';

@NgModule({
  declarations: [
    AppComponent,
    //LoginComponent,
    //RegisterComponent,
    UnauthorizedComponent,
    HeaderComponent,
    BodyComponent,
    FooterComponent,
    VeterinaireSearchComponent,
    ProfileCompletionModalComponent,
    VeterinaireProfileComponent,
    AuthentificationComponent,
    DashboardComponent,
    FileUrlPipe,
    Aside1Component,
    Aside2Component,
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    BrowserAnimationsModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
