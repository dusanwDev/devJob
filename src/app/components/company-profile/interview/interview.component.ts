import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Company } from 'src/app/models/company.model';
import { Utility } from 'src/app/models/utility.model';
import { CompanyService } from '../company.service';

@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.scss'],
})
export class InterviewComponent implements OnInit, AfterViewChecked {
  constructor(
    private companyService: CompanyService,
    private activatedRoute: ActivatedRoute,
    private angularFirestore: AngularFirestore
  ) {}
  ngAfterViewChecked(): void {}
  interviewForm: FormGroup;
  company: Company;
  paramsURL: string;
  displaySubmitBtn: boolean;
  ngOnInit(): void {
    this.initialiseForm();
    this.companyService.userIdBeh.subscribe((params) => {
      this.paramsURL = params;
      this.angularFirestore
        .collection<Company>(Utility.dataBase)
        .doc(params)
        .valueChanges()
        .subscribe((data) => {
          this.company = data;
          this.companyService
            .forbidCommentPosting(params)
            .subscribe((obsBoolean) => {
              this.displaySubmitBtn = obsBoolean;
            });
        });
    });
    // this.activatedRoute.params.subscribe((data) => {
    //   // this.paramsURL = data['companyid'];
    //   this.companyService.userId.next(data['companyid']);

    //   this.angularFirestore
    //     .collection<Company>(Utility.dataBase)
    //     .doc(data['companyid'])
    //     .valueChanges()
    //     .subscribe((data) => {
    //       this.company = data;
    //       this.companyService
    //         .forbidCommentPosting(data['companyid'])
    //         .subscribe((obsBoolean) => {
    //           this.displaySubmitBtn = obsBoolean;
    //         });
    //       console.log('DISPLAY BTN', this.displaySubmitBtn);
    //       console.log(this.company);
    //     });
    // });
  }

  initialiseForm() {
    this.interviewForm = new FormGroup({
      technical: new FormControl(null, Validators.required),
      hr: new FormControl(null, Validators.required),
    });
  }
  submitForm() {
    if (typeof this.company.interviews === 'undefined') {
      console.log('UNDEFINED', this.company.interviews);
      this.company.interviews = [{ technicalInterview: '', hrInterview: '' }];
      this.company.interviews.shift();
      console.log('SHIFTED', this.company.interviews);
    }
    console.log(this.company.interviews);
    this.company.interviews.push({
      technicalInterview: this.interviewForm.get('technical').value,
      hrInterview: this.interviewForm.get('hr').value,
    });
    console.log('PUSHED', this.company.interviews);

    this.angularFirestore
      .collection<Company>(Utility.dataBase)
      .doc(this.paramsURL)
      .update({ interviews: this.company.interviews });
  }
}
