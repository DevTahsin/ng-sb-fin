import { ToastrService } from 'ngx-toastr';
import { SessionService } from './core/session.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'stockbridge-finance';
  /**
   *
   */
  constructor(private sessionService: SessionService, private toastrService: ToastrService) {
    this.sessionService.sessionState$.subscribe((isLoggedIn) => {
      if (isLoggedIn.loggedIn) {
        this.toastrService.success(isLoggedIn.message);
      } else {
        this.toastrService.info(isLoggedIn.message);
      }
    });
  }
}
