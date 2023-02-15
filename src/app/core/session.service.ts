import { Router } from '@angular/router';
import { SocketMessageResponse, SocketMessageType } from './models/socket-message';
import { LocalStorageService } from './localstorage.service';
import { SignInRequest, SignInResult, SignInResultStatus } from './models';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, EMPTY } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { LocalStorageKeys } from './models/local-storage';

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

  activeSessionSocket$: WebSocketSubject<unknown> = new WebSocketSubject<unknown>(null);

  private _accesstoken: string;

  public get accessToken(): string {
    if (!this._accesstoken) {
      this._accesstoken = this.localStorageService.getItem(LocalStorageKeys.TOKEN);
    }
    return this._accesstoken;
  }
  public set accessToken(value: string) {
    this._accesstoken = value;
    if (!value) {
      this.localStorageService.removeItem(LocalStorageKeys.TOKEN);
    } else {
      this.localStorageService.setItem(LocalStorageKeys.TOKEN, value);
    }
  }

  public get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  sessionState$ = this.sessionStateSubject.asObservable();

  constructor(private http: HttpClient, private localStorageService: LocalStorageService, private router: Router) { }

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
          this.sessionStateSubject.next({ loggedIn: true, message: 'Signed In', token: res.data.token });
          this._isLoggedIn = true;
          this.startSessionSocket();
          return true;
        } else {
          this.logout(res.error);
          return false;
        }
      }),
    );
  }

  startSessionSocket() {
    if (this.activeSessionSocket$) {
      this.activeSessionSocket$.complete();
    }

    if(this.accessToken){
      this.handleSessionSocket();
    }
  }

  closeSessionSocket() {
    if (this.activeSessionSocket$) {
      this.activeSessionSocket$.complete();
    }
  }

  private liveSessionSocket(token: string): WebSocketSubject<unknown> {
    if (!token) {
      return null;
    }
    const root = environment.WS;
    const liveSessionUrl = `${root}/${token}`;
    return webSocket(liveSessionUrl);
  }

  private handleSessionSocket() {
    this.activeSessionSocket$ = this.liveSessionSocket(this.accessToken);
    if (this.activeSessionSocket$) {
      this.activeSessionSocket$.subscribe(
        (msg) => {
          const socketMessage = msg as SocketMessageResponse;
          if (socketMessage?.MessageType == SocketMessageType.LogOff) {
            this.logout('Logged out by session socket');
          } else {
            console.log('session socket ping: ' + socketMessage?.TimeStamp);
          }
        },
        (err) => {
          console.log('session socket socket error: ' + err);
        },
        () => {
          console.log('session socket closed');
        },
      );
    }
  }

  logout(message: string) {
    this.accessToken = null;
    this._isLoggedIn = false;
    this.sessionStateSubject.next({
      loggedIn: false,
      message: message,
      token: null,
    });
    if (this.activeSessionSocket$) {
      this.activeSessionSocket$.next({ messageType: SocketMessageType.LogOff });
    }
    this.closeSessionSocket();

    this.router.navigate(['/signin']);
  }
}
