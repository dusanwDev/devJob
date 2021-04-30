import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Company } from 'src/app/models/company.model';
import { Developer } from 'src/app/models/developer.model';
import { Utility } from 'src/app/models/utility.model';
import { AuthService } from 'src/app/services/auth.service';
import { CompanyService } from '../company.service';

@Component({
  selector: 'app-applied-developers',
  templateUrl: './applied-developers.component.html',
  styleUrls: ['./applied-developers.component.scss'],
})
export class AppliedDevelopersComponent implements OnInit {
  developers: Developer[] = [];
  constructor(
    private afs: AngularFirestore,
    private companySevice: CompanyService,
    private authService: AuthService
  ) {}
  displayRemoveBtn = true;
  companyPath: string;
  ngOnInit(): void {
    this.companySevice.userIdBeh.subscribe((companyPath) => {
      this.companyPath = companyPath;
      this.afs
        .collection<Company>(Utility.dataBase)
        .doc(companyPath)
        .valueChanges()
        .subscribe((company) => {
          this.developers = company.appliedDevelopers;
        });
    });
    this.authService.developer.subscribe((user) => {
      this.afs
        .collection<Company & Developer>(Utility.dataBase)
        .doc(user._userId)
        .valueChanges()
        .subscribe((user) => {
          if (user.developerId) {
            this.displayRemoveBtn = false;
          } else {
            this.displayRemoveBtn = true;
          }
        });
    });
  }
  remove(index: number) {
    this.developers.splice(index, 1);
    this.afs.collection(Utility.dataBase).doc(this.companyPath).update({
      appliedDevelopers: this.developers,
    });
  }
}
