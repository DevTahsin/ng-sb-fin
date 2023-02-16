import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { Observable} from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AllowCorsInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {

    // remove referer header
    const allowCorsReq = req.clone({
      setHeaders: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Max-Age": "3600"
      },
      headers: req.headers.delete('Referer')
    });

    return next.handle(allowCorsReq);
  }
}
