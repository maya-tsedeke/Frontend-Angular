import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = "https://csharp-dotnet7-test.scm.azurewebsites.net/api/User/";
  constructor(private http: HttpClient, private router: Router) { }
  signUp(signupObj: any) {
    return this.http.post<any>(`${this.baseUrl}register`, signupObj)
  }
  login(loginObj: any) {
    return this.http.post<any>(`${this.baseUrl}authenticate`, loginObj)
      .pipe(
        tap((res) => {
          this.storeToken(res.token);
          this.storeUserId(res.id);
          this.setUserName(res.username)
        })
      );
  }
  signOut() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
  storeToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue);

  }
  getToken() {
    return localStorage.getItem('token')
  }
  //storeSession
  private userIdKey = 'id';
  private userNameKey = 'username';
  storeUserId(userId: number) {
    sessionStorage.setItem(this.userIdKey, userId.toString());
  }

  getUserId(): number {
    const userId = sessionStorage.getItem(this.userIdKey);

    return userId ? +userId : 0
  }

  updateUserId(userId: number) {

    sessionStorage.setItem(this.userIdKey, userId.toString());
  }

  getUserName(): string {
    const userName = sessionStorage.getItem(this.userNameKey);

    if (userName === null) {
      return ''; // or any other default value 
    }

    return userName;
  }

  setUserName(userName: string) {
    sessionStorage.setItem(this.userNameKey, userName.toString());
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}


