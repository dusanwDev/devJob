import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedComponent } from './feed.component';
import { JobsComponent } from './jobs/jobs.component';
import { CompaniesComponent } from './companies/companies.component';
import { FeedCompanyComponent } from '../feed-company/feed-company.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    FeedComponent,
    JobsComponent,
    CompaniesComponent,
    FeedCompanyComponent,
  ],
  imports: [CommonModule, SharedModule, ReactiveFormsModule, RouterModule],
})
export class FeedModule {}
