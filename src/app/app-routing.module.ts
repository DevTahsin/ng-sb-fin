import { NotFoundComponent } from './site/notfound/notfound.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './site/signin/signin.component';
import { HomeComponent } from './site/home/home.component';
import { AuthGuard } from './core/auth-guard.service';
import { Home2Component } from './site/home2/home2.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home', component: HomeComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    canLoad: [AuthGuard],
  },
  {
    path: 'home2', component: Home2Component,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    canLoad: [AuthGuard],
  },
  { path: 'signin', component: SignInComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
