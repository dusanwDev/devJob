import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyProfileComponent } from './company.component';
import { AboutCompanyComponent } from './about-company/about-company.component';
import { CommentsComponent } from './comments/comments.component';
import { InterviewComponent } from './interview/interview.component';
import { JobsCompanyComponent } from './jobs-company/jobs-company.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AppliedDevelopersComponent } from './applied-developers/applied-developers.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { CompanyGuard } from './company.guard';

@NgModule({
  declarations: [
    CompanyProfileComponent,
    AboutCompanyComponent,
    CommentsComponent,
    InterviewComponent,
    JobsCompanyComponent,
    AppliedDevelopersComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: 'company/:companyid',
        canActivate: [CompanyGuard],
        component: CompanyProfileComponent,
        children: [
          { path: 'about', component: AboutCompanyComponent },
          { path: 'comments', component: CommentsComponent },
          { path: 'interviews', component: InterviewComponent },
          { path: 'jobs-company', component: JobsCompanyComponent },
          { path: 'applied-developers', component: AppliedDevelopersComponent },
        ],
      },
    ]),
    ReactiveFormsModule,
  ],
})
export class CompanyModule {}
