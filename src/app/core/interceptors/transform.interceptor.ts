import { ToastrService } from 'ngx-toastr';
import { ApiResult, ApiStatus, CommonResult } from './../models/api-result';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { prefixRes } from './http-config';
import { logMessage } from './log';

@Injectable()
export class TransformInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      map((event) => {
        if (event instanceof HttpResponse) {
          if (event.body.status === ApiStatus.Ok) {
            const body = event.body?.data;
            let transformedData: CommonResult<any> = {isSuccessfull: true, data: body};
            logMessage(`${prefixRes} 🚧 Transform Response SUCCESS ✔`, [], [body]);
            return event.clone({body:transformedData});
          } else {
            logMessage(`${prefixRes} 🚧 Transform Response ERROR ❌`, [], [event.body?.error]);
            let transformedData: CommonResult<any> = {isSuccessfull: false, data: event.body?.error};
            return event.clone({ body: transformedData});
          }
        } else {
          return event;
        }
      }),
    );
  }
}
