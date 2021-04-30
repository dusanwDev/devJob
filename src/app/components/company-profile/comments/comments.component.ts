import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Company } from 'src/app/models/company.model';
import { Utility } from 'src/app/models/utility.model';
import { CompanyService } from '../company.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit, AfterViewChecked {
  constructor(
    private companyService: CompanyService,
    private activatedRoute: ActivatedRoute,
    private angularFirestore: AngularFirestore
  ) {}
  ngAfterViewChecked(): void {}
  commentsForm: FormGroup;
  paramsURL: string;
  company: Company;
  displaySubmitBtn: boolean;
  ngOnInit(): void {
    this.initialiseForm();
    this.companyService.userIdBeh.subscribe((params) => {
      this.paramsURL = params;
      this.angularFirestore
        .collection<Company>(Utility.dataBase)
        .doc(params)
        .valueChanges()
        .subscribe((company) => {
          this.company = company;
          this.companyService
            .forbidCommentPosting(params)
            .subscribe((obsData) => {
              this.displaySubmitBtn = obsData;
            });
          console.log('DISPLAY BTN', this.displaySubmitBtn);
        });
    });
    this.activatedRoute.params.subscribe((data) => {
      // this.companyService.userId.next(data['companyid']);
      // this.angularFirestore
      //   .collection<Company>(Utility.dataBase)
      //   .doc(data['companyid'])
      //   .valueChanges()
      //   .subscribe((company) => {
      //     this.company = company;
      //     this.companyService
      //       .forbidCommentPosting(data['companyid'])
      //       .subscribe((obsData) => {
      //         this.displaySubmitBtn = obsData;
      //       });
      //     console.log('DISPLAY BTN', this.displaySubmitBtn);
      //   });
    });
  }
  initialiseForm() {
    this.commentsForm = new FormGroup({
      positive: new FormControl(null, Validators.required),
      negative: new FormControl(null, Validators.required),
    });
  }
  submitForm() {
    if (typeof this.company.comments === 'undefined') {
      this.company.comments = [{ positive: '', negative: '' }];
      this.company.comments.shift();
    }
    console.log(this.company.comments);
    this.company.comments.push({
      positive: this.commentsForm.get('positive').value,
      negative: this.commentsForm.get('negative').value,
    });
    this.angularFirestore
      .collection<Company>(Utility.dataBase)
      .doc(this.paramsURL)
      .update({ comments: this.company.comments });
  }
}
