import { CommonResult } from './models/api-result';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable()
export class GreetingService {

  constructor(private http: HttpClient) { }

  getGreeting(): Observable<string> {
    return this.http.get<CommonResult<string>>(`${environment.API}/GetGreeting/`, {withCredentials: true}).pipe(
      catchError((_) => {
        console.log('Error in GetGreeting()');
        return EMPTY;
      }),
      map((res) => {
        if (res.isSuccessfull) {
          return res.data;
        } else {
          return '';
        }
      }),
    );
  }
}
