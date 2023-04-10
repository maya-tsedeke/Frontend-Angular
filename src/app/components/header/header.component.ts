import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
@Output() sideNavToggled = new EventEmitter<boolean>();
menuStatus:boolean=false;
constructor(private auth: AuthService){}
ngOnInit(): void {
  console.log('IsLoggedIn:', this.auth.isLoggedIn());
console.log('UserName:', this.auth.getUserName());
 
}
SideNavToggle(){
  this.menuStatus = !this.menuStatus;
  this.sideNavToggled.emit(this.menuStatus);
}
isLoggedIn(): boolean {
  return this.auth.isLoggedIn();
}

getUserName(): string {
  return this.auth.getUserName();
}

logOut(): void {
  this.auth.signOut();
}
}
