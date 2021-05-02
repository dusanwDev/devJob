import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Company } from 'src/app/models/company.model';
import { Utility } from 'src/app/models/utility.model';
import { AuthService } from 'src/app/services/auth.service';
import { CompanyService } from '../company.service';

@Component({
  selector: 'app-company-jobs',
  templateUrl: './jobs-company.component.html',
  styleUrls: ['./jobs-company.component.scss'],
})
export class JobsCompanyComponent implements OnInit {
  constructor(
    private afs: AngularFirestore,
    private activatedRoute: ActivatedRoute,
    private companyService: CompanyService,
    private authService: AuthService
  ) {}
  uploadJob: FormGroup;
  companyPath: string;
  jobs = [];
  imagePath: string;
  techArr: string[] = [];
  placeholderArr: string[] = [];
  displayUploadButton = true;
  company: Company;
  @ViewChild('uploadJobForm') uploadJobFormElement: ElementRef;
  ngOnInit(): void {
    this.initialiseForm();

    this.companyService.userIdBeh.subscribe((data) => {
      this.afs
        .collection<Company>(Utility.dataBase)
        .doc(data)
        .valueChanges()
        .subscribe((data) => {
          // this.jobs = data.jobs;
          // this.imagePath = data.image;
          this.company = data;
          this.authService.developer.subscribe((userData) => {
            if (userData._userId === this.company.companyId) {
              this.displayUploadButton = true;
            } else {
              this.displayUploadButton = false;
            }
          });
        });
    });
  }
  initialiseForm() {
    this.uploadJob = new FormGroup({
      position: new FormControl(null, [
        Validators.required,
        this.checkForNumbers.bind(this),
      ]),
      technology: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[a-z A-Z]+$'),
      ]),
      city: new FormControl(null, [
        Validators.required,
        this.checkForNumbers.bind(this),
      ]),
      country: new FormControl(null, [
        Validators.required,
        this.checkForNumbers.bind(this),
      ]),
      salary: new FormControl(null, [
        Validators.required,
        this.checkForLetters.bind(this),
      ]),
      yearsOfExpirience: new FormControl(null, [
        Validators.required,
        this.checkForLetters.bind(this),
      ]),
      jobDescription: new FormControl(null, Validators.required),
      employment: new FormControl(null),
      seniority: new FormControl(null),
    });
  }
  submit() {
    if (typeof this.company.jobs === 'undefined') {
      this.company.jobs = [
        {
          city: '',
          companyId: '',
          companyName: '',
          companyPicture: '',
          country: '',
          employment: '',
          jobDescription: '',
          position: '',
          salary: 0,
          seniority: '',
          shortDescription: '',
          technology: [''],
          yearsOfExpirience: 0,
          date: new Date(),
        },
      ];
      this.company.jobs.shift();
    }
    this.company.jobs.push({
      companyName: this.company.companyName,
      companyId: this.company.companyId,
      date: new Date(),
      position: this.uploadJob.get('position').value,
      jobDescription: this.uploadJob.get('jobDescription').value,
      technology: this.addTech(),
      city: this.uploadJob.get('city').value,
      country: this.uploadJob.get('country').value,
      seniority: this.uploadJob.get('seniority').value,
      employment: this.uploadJob.get('employment').value,
      salary: +this.uploadJob.get('salary').value,
      yearsOfExpirience: +this.uploadJob.get('yearsOfExpirience').value,
      companyPicture: this.company.image
        ? this.company.image
        : 'https://tppwebsolutions.com/wp-content/uploads/logo-demo3.png',
      shortDescription: this.uploadJob
        .get('jobDescription')
        .value.split(' ')
        .map((word, index) => {
          if (index < 12) {
            return word;
          }
        })
        .join(' '),
    });

    this.afs
      .collection<Company>(Utility.dataBase)
      .doc(this.company.companyId)
      .update({
        jobs: this.company.jobs,
      });
    this.uploadJob.reset();
    this.techArr = [];
    this.uploadJobFormElement.nativeElement.style = 'none';
  }
  addTech() {
    let arr = this.uploadJob.get('technology').value.split(' ');

    return arr;
  }
  removeTech(index: number) {
    this.techArr.splice(index, 1);
  }
  displayForm() {
    this.uploadJobFormElement.nativeElement.style.display = 'block';
  }
  removeForm() {
    this.uploadJobFormElement.nativeElement.style.display = 'none';
  }
  checkForNumbers(formControl: FormControl): { [key: string]: boolean } {
    let format = /\d/.test(formControl.value);
    if (format) {
      return { inputCannotBeNumber: true };
    } else {
      return null;
    }
  }
  checkForLetters(formControl: FormControl): { [key: string]: boolean } {
    let format = /[a-zA-Z]/g.test(formControl.value);
    if (format) {
      return { inputCannotBeLetter: true };
    } else {
      return null;
    }
  }
}
