import { SessionService } from './../../core/session.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html'
})
export class SignInComponent implements OnDestroy, OnInit {

  private subs = new Subscription();
  fgSignIn: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  constructor(
    private session: SessionService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.subs.add(
      this.session.sessionState$.subscribe((isLoggedIn) => {
        if (isLoggedIn.loggedIn) {
          let params = this.route.snapshot.queryParams;
          if (params['redirectTo']) {
            this.router.navigate([params['redirectTo']]);
          } else {
            this.router.navigate(['/home']);
          }
        }
      })
    );
  }

  onSubmit() {
    if(this.fgSignIn.invalid) {
      return;
    }
    const formValue = this.fgSignIn.value;
    this.subs.add(
      this.session
        .signin(formValue.email, formValue.password)
        .pipe(
          mergeMap((result) => this.route.queryParams),
          map((qp) => qp['redirectTo']),
        )
        .subscribe((redirectTo) => {
          if (this.session.isLoggedIn) {
            const url = redirectTo ? [redirectTo] : ['/home'];
            this.router.navigate(url);
          }
        }),
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
