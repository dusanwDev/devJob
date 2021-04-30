import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { FeedCompanyComponent } from './components/feed-company/feed-company.component';
import { FeedCompanyGuard } from './components/feed-company/feed-company.guard';
import { CompaniesComponent } from './components/feed/companies/companies.component';
import { FeedGuardGuard } from './components/feed/feed-guard.guard';
import { FeedComponent } from './components/feed/feed.component';
import { JobsComponent } from './components/feed/jobs/jobs.component';
import { HomeComponent } from './components/home/home.component';
import { LoginCompanyComponent } from './components/login-company/login-company.component';
import { LoginDeveloperComponent } from './components/login-user/login-user.component';
import { RegisterCompanyComponent } from './components/register-company/register-company.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'feed', redirectTo: 'feed/:userid/jobs', pathMatch: 'full' },
  {
    path: 'feed-user/:userid',
    component: FeedComponent,
    canActivate: [FeedGuardGuard],
    children: [
      { path: 'jobs', component: JobsComponent },
      { path: 'companies', component: CompaniesComponent },
    ],
  },
  {
    path: 'feed-company/:userid',
    component: FeedCompanyComponent,
    canActivate: [FeedCompanyGuard],
  },
  // {
  //   path: 'company/:companyid',
  //   redirectTo: 'company/:companyid/about',
  //   pathMatch: 'full',
  // },
  {
    path: 'company/:companyid',
    loadChildren: './components/company-profile/company.module#CompanyModule',
  },
  {
    path: 'developer/:developerid',
    redirectTo: 'developer/:developerid/about',
    pathMatch: 'full',
  },
  {
    path: 'developer/:developerid',
    loadChildren:
      './components/developer-profile/developer.module#DeveloperModule',
  },
  {
    path: 'login-developer',
    component: LoginDeveloperComponent,
  },
  {
    path: 'login-company',
    component: LoginCompanyComponent,
  },
  {
    path: 'register-company',
    component: RegisterCompanyComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      relativeLinkResolution: 'legacy',
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
