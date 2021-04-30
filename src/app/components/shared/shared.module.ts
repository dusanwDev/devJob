import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderFeedComponent } from './header-feed/header-feed.component';
import { CompanyComponent } from './company/company.component';
import { JobDescriptionComponent } from './job-description/job-description.component';
import { JobComponent } from './job/job.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    CompanyComponent,
    JobDescriptionComponent,
    JobComponent,
    HeaderFeedComponent,
  ],
  exports: [
    CompanyComponent,
    JobDescriptionComponent,
    JobComponent,
    HeaderFeedComponent,
  ],
  imports: [CommonModule, RouterModule],
})
export class SharedModule {}
