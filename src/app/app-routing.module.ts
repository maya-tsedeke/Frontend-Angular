import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ListStationComponent } from './components/list-station/list-station.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { StationDetailsComponent } from './components/station-details/station-details.component';
import { AuthGuard } from './guard/auth.guard';
import { CreatStationComponent } from './components/creat-station/creat-station.component';
import { MapComponent } from '@maplibre/ngx-maplibre-gl';
import { ImportComponent } from './components/import/import.component';
import { JourneysComponent } from './components/journeys/journeys.component';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full' },
  {path:'login',component:LoginComponent, data: { title: 'User Login' }},
  {path:'signup',component:SignupComponent, data: { title: 'User SignUp' }},
  {path:'dashboard',component:DashboardComponent,canActivate:[AuthGuard], data: { title: 'User Dashboard' }},
  { path: '', redirectTo: 'login', pathMatch: 'full',data: { title: 'User Login' }},
  { path: 'report/:id', component: StationDetailsComponent,canActivate:[AuthGuard],data: { title: 'Single view and Location on the map' }},
  {path:'station-list',component:ListStationComponent, canActivate:[AuthGuard],data: { title: 'Bike station list' }},
  {path:'creat-station',component:CreatStationComponent, canActivate:[AuthGuard],data: { title: 'Create new station' }},
  { path: 'update-station/:id', component: CreatStationComponent,canActivate:[AuthGuard],data: { title: 'Update existing Station Details' }},
  { path: 'import', component: ImportComponent,canActivate:[AuthGuard],data: { title: 'Import station or Journey' }},
  { path: 'journey', component: JourneysComponent,canActivate:[AuthGuard],data: { title: 'Customer Service' }},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
