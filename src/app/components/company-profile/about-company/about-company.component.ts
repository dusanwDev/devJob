import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Company } from 'src/app/models/company.model';
import { Developer } from 'src/app/models/developer.model';
import { Utility } from 'src/app/models/utility.model';
import { AuthService } from 'src/app/services/auth.service';
import { DeveloperService } from '../../developer-profile/developer.service';
import { CompanyService } from '../company.service';

@Component({
  selector: 'app-company-about',
  templateUrl: './about-company.component.html',
  styleUrls: ['./about-company.component.scss'],
})
export class AboutCompanyComponent implements OnInit, AfterViewChecked {
  constructor(
    private activatedRoute: ActivatedRoute,
    private afs: AngularFirestore,
    private companyService: CompanyService,
    private developerService: DeveloperService,
    private authService: AuthService
  ) {}
  ngAfterViewChecked(): void {
    this.developerService.checkIfUserCanEdit(this.params);
  }
  company: Company;
  whatWeDoForm: FormGroup;
  aboutUsForm: FormGroup;
  @ViewChild('aboutUs') aboutUs: ElementRef;
  @ViewChild('whatWeDo') whatWeDo: ElementRef;
  @ViewChild('salaryRange') salaryRange: ElementRef;
  @ViewChild('numberOfEmployees') numberOfEmployees: ElementRef;
  @ViewChild('city') city: ElementRef;
  @ViewChild('languages') languages: ElementRef;
  displayRemoveLang = true;
  params: string;
  salaryRangeForm: FormGroup;
  numberOfEmployeesForm: FormGroup;
  cityForm: FormGroup;
  errorMessage: string;
  labguagesForm: FormGroup;
  ngOnInit(): void {
    this.initialiseForms();
    this.authService.developer.subscribe((dev) => {
      this.afs
        .collection<Developer>(Utility.dataBase)
        .doc(dev._userId)
        .valueChanges()
        .subscribe((companyData) => {
          if (companyData.developerId) {
            this.displayRemoveLang = false;
          }
        });
    });
    this.companyService.userIdBeh.subscribe((params) => {
      this.params = params;
      this.afs
        .collection<Company>(Utility.dataBase)
        .doc(params)
        .valueChanges()
        .subscribe((companyData) => {
          this.company = companyData;
        });
    });
    this.activatedRoute.params.subscribe((data) => {
      // this.params = data['companyid'];
      // console.log(data['companyid']);
      // this.companyService.userId.next(this.params);
      // this.afs
      //   .collection<Company>(Utility.dataBase)
      //   .doc(data['companyid'])
      //   .valueChanges()
      //   .subscribe((companyData) => {
      //     this.company = companyData;
      //   });
    });
  }
  initialiseForms() {
    this.labguagesForm = new FormGroup({
      languages: new FormControl(null),
    });
    this.aboutUsForm = new FormGroup({
      aboutUs: new FormControl(null, [
        Validators.required,
        this.checkForNumbers.bind(this),
      ]),
    });
    this.whatWeDoForm = new FormGroup({
      whatWeDo: new FormControl(null, [
        Validators.required,
        this.checkForNumbers.bind(this),
      ]),
    });
    this.salaryRangeForm = new FormGroup({
      salaryRangeFrom: new FormControl(null, [
        Validators.required,
        this.checkForLetters.bind(this),
      ]),
      salaryRangeTo: new FormControl(null, [
        Validators.required,
        this.checkForLetters.bind(this),
      ]),
    });
    this.numberOfEmployeesForm = new FormGroup({
      numberOfEmployees: new FormControl(null),
    });
    this.cityForm = new FormGroup({
      city: new FormControl(null, [
        Validators.required,
        this.checkForNumbers.bind(this),
      ]),
    });
  }
  edit(edit) {
    console.log(edit);
    edit.style.display = 'flex';
  }
  removeEdit(element: HTMLDivElement) {
    element.style.display = 'none';
  }
  submitWhatWeDo() {
    this.afs
      .collection(Utility.dataBase)
      .doc(this.company.companyId)
      .update({
        whatWeDo: this.whatWeDoForm.get('whatWeDo').value,
      });
    this.whatWeDoForm.reset();
    this.whatWeDo.nativeElement.style.display = 'none';
  }
  submitAbout() {
    this.afs
      .collection(Utility.dataBase)
      .doc(this.company.companyId)
      .update({
        aboutUs: this.aboutUsForm.get('aboutUs').value,
      });
    this.aboutUsForm.reset();
    console.log(this.aboutUs);

    this.aboutUs.nativeElement.style.display = 'none';
  }
  submitsalaryRange() {
    if (
      +this.salaryRangeForm.get('salaryRangeFrom').value >
      +this.salaryRangeForm.get('salaryRangeTo').value
    ) {
      this.errorMessage =
        'Salary range from cannot be greater then sallarty range to';
      return;
    }
    this.afs
      .collection(Utility.dataBase)
      .doc(this.company.companyId)
      .update({
        salaryRangeFrom: +this.salaryRangeForm.get('salaryRangeFrom').value,
        salaryRangeTo: +this.salaryRangeForm.get('salaryRangeTo').value,
      });
    this.salaryRangeForm.reset();
    this.salaryRange.nativeElement.style.display = 'none';
  }
  submitnumberOfEmployees() {
    this.afs
      .collection(Utility.dataBase)
      .doc(this.company.companyId)
      .update({
        numberOfEmployees: +this.numberOfEmployeesForm.get('numberOfEmployees')
          .value,
      });
    this.numberOfEmployeesForm.reset();
    this.numberOfEmployees.nativeElement.style.display = 'none';
  }
  submitCity() {
    this.afs
      .collection(Utility.dataBase)
      .doc(this.company.companyId)
      .update({
        city: this.cityForm
          .get('city')
          .value.split(' ')
          .map((word) => {
            return word[0].toUpperCase() + word.substring(1);
          })
          .join(' '),
      });
    this.cityForm.reset();
    this.city.nativeElement.style.display = 'none';
  }
  submitLanguages() {
    if (typeof this.company.languages === 'undefined') {
      this.company.languages = [];
      this.company.languages.shift();
    }
    console.log(this.company.languages);
    this.company.languages.push(this.labguagesForm.get('languages').value);
    this.company.languages = this.company.languages.filter(
      (v, i, a) => a.findIndex((t) => t === v) === i
    );
    console.log(this.company.languages);
    this.afs.collection(Utility.dataBase).doc(this.company.companyId).update({
      languages: this.company.languages,
    });
    this.languages.nativeElement.style.display = 'none';
  }
  checkForLetters(formControl: FormControl): { [key: string]: boolean } {
    let format = /[a-zA-Z]/g.test(formControl.value);
    if (format) {
      return { inputCannotBeLetter: true };
    } else {
      return null;
    }
  }
  removeLang(i: number) {
    this.company.languages.splice(i, 1);
    console.log(this.company.languages);
    console.log(i);

    this.afs.collection(Utility.dataBase).doc(this.company.companyId).update({
      languages: this.company.languages,
    });
  }
  checkForNumbers(formControl: FormControl): { [key: string]: boolean } {
    let format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~\d]/.test(
      formControl.value
    );
    if (format) {
      return { inputCannotBeNumber: true };
    } else {
      return null;
    }
  }
}
