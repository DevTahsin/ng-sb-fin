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

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    SignInComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [SessionService,LocalStorageService] },
    SessionService,
    LocalStorageService,
    httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
