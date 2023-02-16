import { LocalStorageService } from './localstorage.service';
import { WebSocketSubject } from 'rxjs/webSocket';
import { SessionService } from './session.service';
import { LocalStorageKeys } from './models/local-storage';


export function appInitializer(sessionService: SessionService, localStorageService : LocalStorageService) {
  return () => new Promise<void>(resolve => {
    // attempt to socket connect on app initialization
    // if the user is logged in, the socket will connect
    // if the user is not logged in, the socket will not connect
    // either way, we want to resolve the promise
    if (localStorageService.getItem(LocalStorageKeys.TOKEN)) {
      sessionService.startSessionSocket();
      console.log("Session Socket Started on APP INITIALIZER");
    } else {
      console.log("Session Socket CAN NOT Started on APP INITIALIZER");
    }

    document.body && document.body.classList.add('loaded');

    resolve();
  });
}
