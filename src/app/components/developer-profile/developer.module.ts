import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OffersComponent } from './offers/offers.component';
import { DeveloperComponent } from './developer.component';
import { AboutProfileComponent } from './about-profile/about.component';
import { JobApplicationsComponent } from './job-applications/job-applications.component';
import { SavedJobsComponent } from './saved-jobs/saved-jobs.component';
import { CompaniesFollowComponent } from './companies-follow/companies.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { DeveloperGuardGuard } from './developer-guard.guard';

@NgModule({
  declarations: [
    DeveloperComponent,
    AboutProfileComponent,
    JobApplicationsComponent,
    SavedJobsComponent,
    OffersComponent,
    CompaniesFollowComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'developer/:developerid',
        component: DeveloperComponent,
        canActivate: [DeveloperGuardGuard],
        children: [
          { path: 'about', component: AboutProfileComponent },
          { path: 'companies', component: CompaniesFollowComponent },
          {
            path: 'job-applications',
            component: JobApplicationsComponent,
          },
          { path: 'offers', component: OffersComponent },
          { path: 'saved-jobs', component: SavedJobsComponent },
          { path: 'companies-follow', component: CompaniesFollowComponent },
        ],
      },
    ]),
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class DeveloperModule {}
