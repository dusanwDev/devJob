import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute } from '@angular/router';
import { Company } from 'src/app/models/company.model';
import { Developer } from 'src/app/models/developer.model';
import { Utility } from 'src/app/models/utility.model';
import { AuthService } from 'src/app/services/auth.service';
import { DeveloperService } from '../developer-profile/developer.service';
import { CompanyService } from './company.service';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
})
export class CompanyProfileComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private afs: AngularFirestore,
    private authService: AuthService,
    private companyService: CompanyService,
    private afsStorage: AngularFireStorage,
    private developerService: DeveloperService
  ) {}

  @ViewChild('addImage') addImage: ElementRef;
  company: Company;
  companyPath: string;
  selectedFile: File = null;
  enableImageAndOfferEdditing: boolean;
  developer: Developer;
  ngOnInit(): void {
    this.authService.developer.subscribe((developer) => {
      this.afs
        .collection<Developer & Company>(Utility.dataBase)
        .doc(developer._userId)
        .valueChanges()
        .subscribe((developerData) => {
          if (developerData.developerId) {
            this.developer = developerData;
          }
        });
    });

    this.activatedRoute.params.subscribe((data) => {
      this.companyService.userIdBeh.next(data['companyid']);
      this.developerService
        .removeImageUploadAndOffer(data['companyid'])
        .subscribe((devBool) => {
          this.enableImageAndOfferEdditing = devBool;
        });
      this.afs
        .collection<Company>(Utility.dataBase)
        .doc(data['companyid'])
        .valueChanges()
        .subscribe((companyData) => {
          this.company = companyData;
        });
    });
  }
  check() {
    const user: {
      expdate: string;
      refreshToken: string;
      userId;
      _token;
    } = JSON.parse(localStorage.getItem(Utility.localStorageKey));
    if (user.userId !== this.companyPath) {
      return false;
    } else {
      return true;
    }
  }

  onFileSelectedListener(event) {
    this.selectedFile = <File>event.target.files[0];
    if (this.selectedFile.type === 'image/jpeg' || 'image/png') {
      this.afsStorage
        .upload(this.company.companyId, this.selectedFile)
        .then(() => {
          this.afsStorage.storage
            .ref()
            .child(this.company.companyId)
            .getDownloadURL()
            .then((data) => {
              this.company.image = data;
              this.afs
                .collection<Company>(Utility.dataBase)
                .doc(this.company.companyId)
                .update({
                  image: data,
                });
            });
        });
    } else {
      alert('FILE IS NOT A IMAGE');
    }
  }
  followClick() {
    if (typeof this.developer.followCompanies === 'undefined') {
      this.developer.followCompanies = [
        {
          aboutUs: '',
          appliedDevelopers: [],
          city: '',
          comments: [{ positive: '', negative: '' }],
          companyId: '',
          companyName: '',
          image: '',
          interviews: [{ hrInterview: '', technicalInterview: '' }],
          languages: [],
          jobs: [
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
          ],
          numberOfEmployees: 0,
          salaryRangeFrom: 0,
          salaryRangeTo: 0,
          whatWeDo: '',
        },
      ];
      this.developer.followCompanies.shift();
    }

    this.developer.followCompanies.push(this.company);

    this.developer.followCompanies = this.developer.followCompanies.filter(
      (v, i, a) => a.findIndex((t) => t.companyId === v.companyId) === i
    );

    this.afs
      .collection<Developer>(Utility.dataBase)
      .doc(this.developer.developerId)
      .update({
        followCompanies: this.developer.followCompanies,
      });
  }
}
