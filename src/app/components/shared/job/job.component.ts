import { AfterViewChecked, Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from 'src/app/models/company.model';
import { Developer } from 'src/app/models/developer.model';
import { Paths, Utility } from 'src/app/models/utility.model';
import { AuthService } from 'src/app/services/auth.service';
import { JobService } from '../job.service';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss'],
})
export class JobComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private afs: AngularFirestore,
    private jobService: JobService
  ) {}

  displayRemovebtn = true;
  @Input() jobs;
  ngOnInit(): void {
    this.displayRemove();
  }
  displayJobInfoAndSaveBtns = true;
  displaySaveBtn = true;
  developer: Developer;
  company: Company;
  path: string;
  displayRemove() {
    this.authService.developer.subscribe((data) => {
      this.path = data._userId;
      this.afs
        .collection<Company & Developer>(Utility.dataBase)
        .doc(data._userId)
        .valueChanges()
        .subscribe((userData) => {
          if (
            (userData.developerId || userData.companyId) &&
            this.activatedRoute.snapshot.routeConfig.path === 'job-applications'
          ) {
            this.displayJobInfoAndSaveBtns = false;
            this.displayRemovebtn = false;
          } else if (
            userData.developerId &&
            this.activatedRoute.snapshot.routeConfig.path === 'saved-jobs'
          ) {
            this.displayRemovebtn = true;
            this.displayJobInfoAndSaveBtns = true;
            this.displaySaveBtn = false;
            this.developer = userData;
          } else if (
            userData.companyId &&
            this.activatedRoute.snapshot.routeConfig.path === 'jobs-company'
          ) {
            this.displayRemovebtn = true;
            this.displayJobInfoAndSaveBtns = true;
            this.displaySaveBtn = false;
            this.company = userData;
          } else if (
            userData.developerId &&
            this.activatedRoute.snapshot.routeConfig.path === 'jobs-company'
          ) {
            this.displayRemovebtn = false;
            this.displaySaveBtn = true;
            this.displayJobInfoAndSaveBtns = true;
            this.developer = userData;
          } else if (
            userData.developerId &&
            this.activatedRoute.snapshot.routeConfig.path === 'jobs'
          ) {
            this.displayRemovebtn = false;
          }
        });
    });
    // this.activatedRoute.params.subscribe((params) => {
    //   console.log('JOB', params['userid']);
    //   console.log('JOB', params['developerid']);
    //   // const user: {
    //   //   expdate: string;
    //   //   refreshToken: string;
    //   //   userId;
    //   //   _token;
    //   // } = JSON.parse(localStorage.getItem(Utility.localStorageKey));
    //   this.authService.developer.pipe(
    //     take(1),
    //     map((userData) => {
    //       if (userData._userId === params['userid']) {
    //         this.displayRemovebtn = true;
    //       } else {
    //         this.displayRemovebtn = false;
    //       }
    //     })
    //   );

    //   // this.displayRemovebtn =
    //   //   this.activatedRoute.snapshot.routeConfig.path ===
    //   //     ':developerid/saved-jobs' ||
    //   //   this.activatedRoute.snapshot.routeConfig.path ===
    //   //     ':developerid/job-applications' ||
    //   //   (this.activatedRoute.snapshot.routeConfig.path === 'jobs-company' &&
    //   //     user.userId === data['developerid']);
    //   console.log(this.displayRemovebtn);
    // });
  }
  save(job) {
    if (typeof this.developer.savedJobs === 'undefined') {
      this.developer.savedJobs = [];
    }
    this.developer.savedJobs.push(job);
    //removing duplicates
    this.developer.savedJobs = this.developer.savedJobs.filter(
      (v, i, a) =>
        a.findIndex((t) => t['jobDescription'] === v['jobDescription']) === i
    );

    this.afs
      .collection(Utility.dataBase)
      .doc(this.developer.developerId)
      .update({
        savedJobs: this.developer.savedJobs,
      });
  }
  displayJobDescription(job) {
    // this.router.navigate(['developer', 'cRC10457zNOo0TWUeVZLpFeGjFy1']);
    this.jobService.job.next(job);
  }
  remove(index: number, jobPassed) {
    if (this.activatedRoute.snapshot.routeConfig.path === 'saved-jobs') {
      this.developer.savedJobs.splice(index, 1);

      this.afs
        .collection(Utility.dataBase)
        .doc(this.developer.developerId)
        .update({
          savedJobs: this.developer.savedJobs,
        });
    } else if (
      this.activatedRoute.snapshot.routeConfig.path === 'jobs-company'
    ) {
      this.company.jobs.splice(index, 1);

      this.afs.collection(Utility.dataBase).doc(this.company.companyId).update({
        jobs: this.company.jobs,
      });
      //trigger to remove jobs from all developers
      this.afs
        .collection(Utility.dataBase, (ref) =>
          ref.where('developerId', '!=', 'null')
        )
        .valueChanges()
        .subscribe((q) => {
          q.forEach((developer: Developer) => {
            if (typeof developer.savedJobs !== 'undefined') {
              //ako developer ima poslove onda pretraži i vidi da li ima duplikat
              developer.savedJobs.filter((job, i) => {
                if (job['jobDescription'] === jobPassed['jobDescription']) {
                  developer.savedJobs.splice(i, 1);
                  this.afs
                    .collection(Utility.dataBase)
                    .doc(developer.developerId)
                    .update({
                      savedJobs: developer.savedJobs,
                    });
                } else {
                  return developer['savedJobs'];
                }
              });
            }
          });
        });
    }
  }
}
