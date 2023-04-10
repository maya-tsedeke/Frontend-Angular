import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  @Input() sideNavStatus: boolean = false;

  list = [
    { number: '5', name: 'login', icon: 'fas fa-sign-in-alt', routerLink: '/login' },
    { number: '6', name: 'signup', icon: 'fas fa-user-plus', routerLink: '/signup' }];

  loggedInList = [
    { number: '1', name: 'home', icon: 'fas fa-tachometer-alt', routerLink: '/dashboard' }, 
      { number: '3', name: 'Import', icon: 'fa fa-upload', routerLink: '/import' }, 
      { number: '7', name: 'Create', icon: 'fas fa-add', routerLink: 'creat-station' }, 
    { number: '2', name: 'return', icon: 'fas fa-bicycle', routerLink: '/journey' }, 
    { number: '8', name: 'Map', icon: 'fas fa-map-marker-alt', routerLink: '/station-list' },
  
  ];

  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit(): void { }

  navigateTo(link: string): void {
    this.router.navigate([link]);
  }
  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }
  logOut(): void {
    this.auth.signOut();
  }
}
