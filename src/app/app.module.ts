import { GreetingService } from './core/greeting.service';
import { Home2Component } from './site/home2/home2.component';
import { httpInterceptorProviders } from './core/interceptors/index';
import { SessionService } from './core/session.service';
import { HomeComponent } from './site/home/home.component';
import { SignInComponent } from './site/signin/signin.component';
import { NotFoundComponent } from './site/notfound/notfound.component';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { appInitializer } from './core/app.initializer';
import { LocalStorageService } from './core/localstorage.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule, ToastrService } from 'ngx-toastr';


@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    SignInComponent,
    HomeComponent,
    Home2Component
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [SessionService,
      LocalStorageService] },
    SessionService,
    LocalStorageService,
    httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
