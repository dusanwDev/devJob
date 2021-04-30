import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Company } from 'src/app/models/company.model';
import { Developer } from 'src/app/models/developer.model';
import { Utility } from 'src/app/models/utility.model';
import { AuthService } from 'src/app/services/auth.service';
import { JobDescService } from 'src/app/services/job-desc.service';
import { CompanyService } from '../../company-profile/company.service';
import { JobService } from '../job.service';

@Component({
  selector: 'app-job-description',
  templateUrl: './job-description.component.html',
  styleUrls: ['./job-description.component.scss'],
})
export class JobDescriptionComponent implements OnInit {
  @Input() job;
  @ViewChild('jobDesc') jobDesc: ElementRef;
  @ViewChild('jobInner') jobInner: ElementRef;
  constructor(
    private jobService: JobService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private afs: AngularFirestore,
    private jobDescService: JobDescService,
    private companyService: CompanyService
  ) {}

  jobEmited: {};
  appliedDevelopers: Developer[] = [];
  jobApplications = [];
  removeApplyBtn = true;
  developerPath: string;
  companyPath: string;
  innerWidth: any;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.jobService.job.subscribe((data) => {
      // if (this.innerWidth < 736) {
      //   this.jobDesc.nativeElement.style.width = '100%';
      //   this.jobDesc.nativeElement.style.padding = '0.5em';
      // } else {
      //   this.jobDesc.nativeElement.style.width = '0%';
      //   this.jobDesc.nativeElement.style.padding = '0.5em';
      // }
    });
  }
  datePosted: string;
  ngOnInit(): void {
    // this.activatedRoute.url.subscribe((url) => {
    //   url.forEach((path) => {
    //     if (path.path === 'job-applications') {
    //       this.removeApplyBtn = false;
    //     }
    //   });
    // });

    this.jobService.job.subscribe((data) => {
      this.jobEmited = data;

      this.datePosted = new Date(
        this.jobEmited['date']['seconds'] * 1000
      ).toDateString();

      if (window.innerWidth < 736) {
        this.jobDesc.nativeElement.style.width = '100%';
        this.jobDesc.nativeElement.style.padding = '0.5em';
      } else {
        this.jobDesc.nativeElement.style.width = '50%';
        this.jobInner.nativeElement.style.minWidth = '600px';
        this.jobDesc.nativeElement.style.padding = '0.5em';
      }
    });
    this.companyService.userIdBeh.subscribe((data) => {
      if (data !== null) {
        this.companyPath = data;

        this.afs
          .collection<Company>(Utility.dataBase)
          .doc(this.companyPath)
          .valueChanges()
          .subscribe((company) => {
            if (typeof company.appliedDevelopers !== 'undefined') {
              this.appliedDevelopers = company.appliedDevelopers;
            }
          });
      }
    });
    this.authService.developer.subscribe((developer) => {
      this.afs
        .collection<Developer & Company>(Utility.dataBase)
        .doc(developer._userId)
        .valueChanges()
        .subscribe((devData) => {
          this.removeApplyBtn = devData.companyId ? false : true;
          if (
            devData.developerId &&
            typeof devData.jobAplications !== 'undefined'
          ) {
            this.jobApplications = devData.jobAplications;
          }
          this.developerPath = devData.developerId;
        });
    });
  }

  remove() {
    this.jobDesc.nativeElement.style.width = '0%';
    this.jobDesc.nativeElement.style.padding = '0em';
  }
  follow() {}
  apply(applyButton: HTMLDivElement) {
    this.afs
      .collection<Developer>(Utility.dataBase)
      .doc(this.developerPath)
      .valueChanges()
      .subscribe((developerData) => {
        this.appliedDevelopers.push(developerData);
        this.appliedDevelopers = this.appliedDevelopers.filter(
          (v, i, a) => a.findIndex((t) => t.developerId === v.developerId) === i
        );

        this.afs
          .collection(Utility.dataBase)
          .doc(this.jobEmited['companyId'])
          .update({
            appliedDevelopers: this.appliedDevelopers,
          });
      });

    this.jobApplications.push(this.jobEmited);
    this.jobApplications = this.jobApplications.filter(
      (v, i, a) =>
        a.findIndex((t) => t['jobDescription'] === v['jobDescription']) === i
    );

    this.afs
      .collection(Utility.dataBase)
      .doc(this.developerPath)
      .update({
        jobAplications: this.jobApplications,
      })
      .then(() => {});
    applyButton.style.display = 'block';
    setTimeout(() => {
      applyButton.style.display = 'none';
    }, 3000);
  }
}
