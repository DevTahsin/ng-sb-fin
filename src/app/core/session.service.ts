import { SignInRequest, SignInResult, SignInResultStatus } from './models';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, EMPTY } from 'rxjs';

export interface SessionState {
  loggedIn: boolean;
  message: string;
  token: string;
}

const notSignedInMessage = `Not signed in`;

@Injectable({ providedIn: 'root' })
export class SessionService {
  private _isLoggedIn = false;
  private sessionStateSubject = new BehaviorSubject<SessionState>({
    loggedIn: false,
    token: null,
    message: notSignedInMessage,
  });
  accessToken: string;

  public get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  readOnly = false;

  sessionState$ = this.sessionStateSubject.asObservable();

  constructor(private http: HttpClient) { }

  signin(email: string, password: string) {
    const root = environment.API;
    const signinUrl = `${root}/Authorize/`;
    const body: SignInRequest = {
      email,
      password,
    };
    return this.http.post<SignInResult>(signinUrl, body).pipe(
      catchError((_) => {
        this.logout('Internal Server Error');
        return EMPTY;
      }),
      map((res) => {
        if (res?.status == SignInResultStatus.Ok) {
          this.accessToken = res.data.token;
          this.sessionStateSubject.next({ loggedIn: true, message: '', token: res.data.token });
          this._isLoggedIn = true;
          return true;
        } else {
          this.logout(res.error);
          return false;
        }
      }),
    );
  }

  logout(message: string) {
    this.accessToken = null;
    this._isLoggedIn = false;
    this.sessionStateSubject.next({
      loggedIn: false,
      message: message,
      token: null,
    });
  }
}
