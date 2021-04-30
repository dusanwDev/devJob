import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Company } from 'src/app/models/company.model';
import { Utility } from 'src/app/models/utility.model';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss'],
})
export class JobsComponent implements OnInit {
  constructor(private afs: AngularFirestore) {}
  jobs: {
    city: string;
    companyId: string;
    companyName: string;
    companyPicture: string;
    country: string;
    employment: string;
    jobDescription: string;
    position: string;
    salary: number;
    seniority: string;
    shortDescription: string;
    technology: string[];
    yearsOfExpirience: number;
    date: Date;
  }[] = [];
  technologies: string[] = [];
  city: string[] = [];
  companyNames: string[] = [];
  salary: number[] = [];
  searchForm: FormGroup;
  employmentTypeForm: FormGroup;
  filtered = [];
  showMessage = false;
  ngOnInit(): void {
    for (let job of this.jobs) {
      job.technology;
    }

    this.loadData();
    this.searchForm = new FormGroup({
      technology: new FormControl(null),
      city: new FormControl(null),
      companyName: new FormControl(null),
      employment: new FormControl(null),
      seniority: new FormControl(null),
      salary: new FormControl(null),
    });
  }
  loadData() {
    this.afs
      .collection<Company>(Utility.dataBase, (ref) =>
        ref.where('jobs', '!=', 'null')
      )
      .valueChanges()
      .subscribe((companies) => {
        companies.filter((company, index) => {
          company.jobs.forEach((job) => {
            this.jobs.push(job);
            this.jobs = this.jobs.filter(
              (v, i, a) =>
                a.findIndex((t) => t.jobDescription === v.jobDescription) === i
            );
            job.technology.forEach((tech) => {
              this.technologies.push(tech);
            });
            this.technologies = this.technologies.filter(
              (v, i, a) =>
                a.findIndex((t) => t.toLowerCase() === v.toLowerCase()) === i
            );
            this.companyNames.push(job.companyName);
            this.companyNames = this.companyNames.filter(
              (v, i, a) => a.findIndex((t) => t === v) === i
            );
            this.city.push(job.city);
            this.city = this.city.filter(
              (v, i, a) => a.findIndex((t) => t === v) === i
            );
            this.salary.push(job.salary);
            this.salary = this.salary.filter(
              (v, i, a) => a.findIndex((t) => t === v) === i
            );
          });
        });
      });
  }

  search() {
    this.filtered = [];

    this.filtered = this.jobs.filter((job, index) => {
      let tech = job.technology.filter((techSearch) => {
        if (techSearch === this.searchForm.get('technology').value) {
          return techSearch;
        }
      });
      if (
        job.companyName === this.searchForm.get('companyName').value ||
        job.city === this.searchForm.get('city').value ||
        tech[0] === this.searchForm.get('technology').value ||
        job.employment === this.searchForm.get('employment').value ||
        job.seniority === this.searchForm.get('seniority').value
      ) {
        this.showMessage = false;

        return job;
      } else {
        this.showMessage = true;
      }
    });
    this.searchForm.reset();
  }

  mySelectHandler(event) {
    console.log(event);
    switch (event) {
      case 'Highest Paid':
        this.filtered = this.jobs.sort((jobA, jobB) => {
          return jobB.salary - jobA.salary;
        });
        break;

      case 'Lowest Paid':
        this.filtered = this.jobs.sort((jobA, jobB) => {
          return jobA.salary - jobB.salary;
        });
        break;
      case 'Newest':
        this.filtered = this.jobs.sort((jobA, jobB) => {
          return (
            new Date(jobA.date['seconds']).getSeconds() -
            new Date(jobB.date['seconds']).getSeconds()
          );
        });
        break;
      case 'Odlest':
        this.filtered = this.jobs.sort((jobA, jobB) => {
          return (
            new Date(jobB.date['seconds']).getSeconds() -
            new Date(jobA.date['seconds']).getSeconds()
          );
        });
        break;
      default:
        break;
    }
  }
}
