import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NgToastModule } from 'ng-angular-popup';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { StationDetailsComponent } from './components/station-details/station-details.component';
//import { AgmCoreModule } from '@agm/core';
//import { GoogleMapsModule } from '@angular/google-maps';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { SidebarModule } from 'ng-cdbangular';
import { MDBBootstrapModule, NavbarModule } from 'angular-bootstrap-md';
import { HeaderComponent } from './components/header/header.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
//import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ListStationComponent } from './components/list-station/list-station.component';
import { CreatStationComponent } from './components/creat-station/creat-station.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxMapLibreGLModule } from '@maplibre/ngx-maplibre-gl';
import { DeletestationComponent } from './components/deletestation/deletestation.component';
import { ImportComponent } from './components/import/import.component';
import { JourneysComponent } from './components/journeys/journeys.component';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    StationDetailsComponent,
    HeaderComponent,
    SideNavComponent,
    ListStationComponent,
    CreatStationComponent,
    DeletestationComponent,
    ImportComponent,
    JourneysComponent,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgToastModule,
    HttpClientModule,
   FormsModule,
   //GoogleMapsModule,
   //AgmCoreModule.forRoot({
   // apiKey:'AIzaSyCGnhpPwnFmbTAdqi1iEMsxMsLYoAFmX5Y'
   //}),
  //GoogleMapsModule,
   NgbModule,
   RouterModule.forRoot([]),
   SidebarModule,
   MDBBootstrapModule,
   NavbarModule,
   //NgxDatatableModule,
   NgxPaginationModule,
   NgxMapLibreGLModule,
   NgSelectModule,
   CommonModule,
  ],
  providers: [{
    provide:HTTP_INTERCEPTORS,
    useClass:TokenInterceptor,
    multi:true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { 

}
