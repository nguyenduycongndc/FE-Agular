import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '../_services';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService, private router: Router,) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        // auto logout if 401 response returned from api
        this.authenticationService.logout();
        const error = err.error.message || err.statusText;
        return throwError(error);
      } else if (err.status === 404) {
        // this.router.navigate(['/404']);
        const errors = err.error || err.statusText;
        return throwError(errors);
      } else if (err.status === 422) {
        const errors = err.error || err.status;
        return throwError(errors);
      } else if (err.status === 429) {
        // this.router.navigate(['/404']);
        const errors = err.error.message || err.statusText;
        return throwError(errors);
      } else {
        // const errors = err.error.message || err.status;
        // location.reload(true);
        // return throwError(errors);
      }
      const error = err.error.message || err.statusText;
      return throwError(error);
    }))
  }
}
