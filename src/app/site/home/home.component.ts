import { SessionService } from './../../core/session.service';
import { Observable } from 'rxjs';
import { GreetingService } from './../../core/greeting.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  providers : [GreetingService]
})
export class HomeComponent implements OnInit {
  constructor(private greetingService: GreetingService, private sessionService: SessionService) { }
  greetingMessage : Observable<string>;
  ngOnInit(): void {
    this.greetingMessage = this.greetingService.getGreeting();
  }

  logout() {
    this.sessionService.logout("You have been logged out.",true);
  }
}
