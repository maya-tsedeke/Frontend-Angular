import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../Services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private auth:AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const myToken=this.auth.getToken();

    if(myToken) {
     // console.log(`Bearer ${myToken}`);
      request=request.clone({
        setHeaders: { Authorization: `Bearer ${myToken}` }
      });

      const userId = this.auth.getUserId();
      if (userId) {
        this.auth.updateUserId(userId); // Update the user ID in the session storage
      }
    }

    return next.handle(request);
  }
}

