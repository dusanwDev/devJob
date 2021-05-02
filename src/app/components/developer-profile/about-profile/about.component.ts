import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Company } from 'src/app/models/company.model';
import { Developer } from 'src/app/models/developer.model';
import {
  educationFieldsForm,
  Utility,
  workExpirienceFields,
} from 'src/app/models/utility.model';
import { AuthService } from 'src/app/services/auth.service';
import { DeveloperService } from '../developer.service';

@Component({
  selector: 'app-profile-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutProfileComponent implements OnInit {
  @ViewChild('universityEdit') universityEdit: ElementRef;
  @ViewChild('workEdit') workEdit: ElementRef;
  @ViewChild('position') positionEdit: ElementRef;
  @ViewChild('employment') employmentEdit: ElementRef;
  @ViewChild('seniority') seniorityEdit: ElementRef;
  @ViewChild('languages') languages: ElementRef;

  private paramsURL: string;
  userData: Developer;
  errorMessage: string;
  educationForm: FormGroup;
  workForm: FormGroup;
  coverLetterForm: FormGroup;
  errorMessageYearWork: string;
  errorMessageYearEducation: string;
  displayRemoveLang = true;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private afs: AngularFirestore,
    private developerService: DeveloperService
  ) {}
  ngOnInit(): void {
    this.initialiseForms();

    this.authService.developer.subscribe((dev) => {
      this.afs
        .collection<Company>(Utility.dataBase)
        .doc(dev._userId)
        .valueChanges()
        .subscribe((companyData) => {
          if (companyData.companyId) {
            this.displayRemoveLang = false;
          }
        });
    });
    this.developerService.userIdFromParam.subscribe((paramsURL) => {
      this.paramsURL = paramsURL;
      //  this.developerService.userIdFromParam.next(paramsURL);
      this.afs
        .collection<Developer>(Utility.dataBase)
        .doc(paramsURL)
        .valueChanges()
        .subscribe((userData) => {
          this.userData = userData;

          // this.educationArr = this.userData['education'];
        });
    });
    this.developerService.checkIfUserCanEdit(this.paramsURL);
  }
  positionForm: FormGroup;
  employmentForm: FormGroup;
  seniorityForm: FormGroup;
  labguagesForm: FormGroup;
  initialiseForms() {
    this.labguagesForm = new FormGroup({
      languages: new FormControl(null),
    });
    this.seniorityForm = new FormGroup({
      seniority: new FormControl(null),
    });
    this.employmentForm = new FormGroup({
      employmeent: new FormControl(null),
    });
    this.positionForm = new FormGroup({
      position: new FormControl(null),
    });
    this.educationForm = new FormGroup({
      university: new FormControl(null, [
        Validators.required,
        this.checkForNumbers.bind(this),
      ]),
      fieldOfStudy: new FormControl(null, [
        Validators.required,
        this.checkForNumbers.bind(this),
      ]),
      degree: new FormControl(null, [
        Validators.required,
        this.checkForNumbers.bind(this),
      ]),
      startEducation: new FormControl(null, [
        Validators.required,
        this.checkForLetters.bind(this),
      ]),
      endEducation: new FormControl(null, [
        Validators.required,
        this.checkForLetters.bind(this),
      ]),
    });
    this.workForm = new FormGroup({
      company: new FormControl(null, [
        Validators.required,
        this.checkForNumbers.bind(this),
      ]),
      position: new FormControl(null, [
        Validators.required,
        this.checkForNumbers.bind(this),
      ]),
      start: new FormControl(null, [
        Validators.required,
        this.checkForLetters.bind(this),
      ]),
      end: new FormControl(null, [
        Validators.required,
        this.checkForLetters.bind(this),
      ]),
    });
    this.coverLetterForm = new FormGroup({
      coverLetter: new FormControl(null),
    });
  }
  positionSubmit() {
    this.afs
      .collection(Utility.dataBase)
      .doc(this.userData.developerId)
      .update({
        position: this.positionForm.get('position').value,
      });
    this.positionEdit.nativeElement.style.display = 'none';
  }
  submitLanguages() {
    if (typeof this.userData.languages === 'undefined') {
      this.userData.languages = [];
      this.userData.languages.shift();
    }
    this.userData.languages.push(this.labguagesForm.get('languages').value);
    this.userData.languages = this.userData.languages.filter(
      (v, i, a) => a.findIndex((t) => t === v) === i
    );
    this.afs
      .collection(Utility.dataBase)
      .doc(this.userData.developerId)
      .update({
        languages: this.userData.languages,
      });
    this.languages.nativeElement.style.display = 'none';
  }
  removeLang(i: number) {
    this.userData.languages.splice(i, 1);
    this.afs
      .collection(Utility.dataBase)
      .doc(this.userData.developerId)
      .update({
        languages: this.userData.languages,
      });
  }
  employmentSubmit() {
    this.afs
      .collection(Utility.dataBase)
      .doc(this.userData.developerId)
      .update({
        employment: this.employmentForm.get('employmeent').value,
      });
    this.employmentEdit.nativeElement.style.display = 'none';
  }
  senioritySubmit() {
    this.afs
      .collection(Utility.dataBase)
      .doc(this.userData.developerId)
      .update({
        seniority: this.seniorityForm.get('seniority').value,
      });
    this.seniorityEdit.nativeElement.style.display = 'none';
  }

  submitFormEducation() {
    if (typeof this.userData.education === 'undefined') {
      this.userData.education = [
        {
          degree: '',
          endEducation: 0,
          fieldOfStudy: '',
          startEducation: 0,
          university: '',
        },
      ];
      this.userData.education.shift();
    }
    let bool = true;
    this.errorMessage = '';
    this.userData.education.filter((edu) => {
      if (
        edu.degree.toLowerCase() ===
          this.educationForm
            .get(educationFieldsForm.degree)
            .value.toLowerCase() &&
        edu.university.toLowerCase() ===
          this.educationForm
            .get(educationFieldsForm.university)
            .value.toLowerCase() &&
        edu.fieldOfStudy.toLowerCase() ===
          this.educationForm
            .get(educationFieldsForm.fieldOfStudy)
            .value.toLowerCase()
      ) {
        this.errorMessage = 'You already entered that education';

        bool = false;
      }
    });
    if (
      !bool ||
      this.educationForm.get(educationFieldsForm.startEducation).value >
        this.educationForm.get(educationFieldsForm.endEducation).value
    ) {
      this.errorMessageYearEducation =
        'Start year cannot be greater then end year';

      return;
    }
    this.userData.education.push({
      university: this.educationForm.get(educationFieldsForm.university).value,
      degree: this.educationForm.get(educationFieldsForm.degree).value,
      fieldOfStudy: this.educationForm.get(educationFieldsForm.fieldOfStudy)
        .value,
      startEducation: +this.educationForm.get(
        educationFieldsForm.startEducation
      ).value,
      endEducation: +this.educationForm.get(educationFieldsForm.endEducation)
        .value,
    });
    this.afs
      .collection(Utility.dataBase)
      .doc(this.userData.developerId)
      .update({
        education: this.userData.education,
      });
    this.educationForm.reset();
    this.universityEdit.nativeElement.style.display = 'none';
  }
  submitWorkForm() {
    if (typeof this.userData.workExpirience === 'undefined') {
      this.userData.workExpirience = [
        {
          company: '',
          start: 0,
          position: '',
          end: 0,
        },
      ];
      this.userData.workExpirience.shift();
    }
    let bool = true;
    this.errorMessage = '';
    this.userData.workExpirience.filter((edu) => {
      if (
        edu.company.toLowerCase() ===
          this.workForm.get(workExpirienceFields.company).value.toLowerCase() &&
        edu.position.toLowerCase() ===
          this.workForm.get(workExpirienceFields.position).value.toLowerCase()
      ) {
        this.errorMessage = 'You already entered that work expirience';

        bool = false;
      }
    });
    if (
      !bool ||
      this.workForm.get(workExpirienceFields.start).value >
        this.workForm.get(workExpirienceFields.end).value
    ) {
      this.errorMessageYearWork = 'Start year cannot be greater then end year';

      return;
    }
    this.userData.workExpirience.push({
      company: this.workForm.get(workExpirienceFields.company).value,
      position: this.workForm.get(workExpirienceFields.position).value,
      start: this.workForm.get(workExpirienceFields.start).value,
      end: this.workForm.get(workExpirienceFields.end).value,
    });
    this.afs
      .collection(Utility.dataBase)
      .doc(this.userData.developerId)
      .update({
        workExpirience: this.userData.workExpirience,
      });

    this.workEdit.nativeElement.style.display = 'none';
    this.workForm.reset();
  }
  coverSubmit() {
    this.afs
      .collection(Utility.dataBase)
      .doc(this.userData.developerId)
      .update({
        coverLetter: this.coverLetterForm.get('coverLetter').value,
        shortCoverLetter: this.coverLetterForm
          .get('coverLetter')
          .value.split(' ')
          .map((word, index) => {
            if (index < 15) {
              return word;
            }
          })
          .join(' '),
      });
  }
  delete(i: number, educationOrWorkExpirience: HTMLDivElement) {
    if (educationOrWorkExpirience.classList.contains('education-inner')) {
      this.userData.education.splice(i, 1);
      this.afs
        .collection<Developer>(Utility.dataBase)
        .doc(this.userData.developerId)
        .update({
          education: this.userData.education,
        });
    } else if (
      educationOrWorkExpirience.classList.contains('work-expirience-inner')
    ) {
      this.userData.workExpirience.splice(i, 1);
      this.afs
        .collection(Utility.dataBase)
        .doc(this.userData.developerId)
        .update({
          workExpirience: this.userData.workExpirience,
        });
    }
  }
  edit(edit) {
    edit.style.display = 'flex';
  }
  removeEdit(edit) {
    edit.style.display = 'none';
  }

  checkForNumbers(formControl: FormControl): { [key: string]: boolean } {
    let format = /\d/gi.test(formControl.value);
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
