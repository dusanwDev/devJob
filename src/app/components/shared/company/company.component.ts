import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Utility } from 'src/app/models/utility.model';
import { DeveloperService } from '../../developer-profile/developer.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
})
export class CompanyComponent implements OnInit {
  @Input() companies;
  userPath: string;

  constructor(
    private afs: AngularFirestore,
    private developerService: DeveloperService
  ) {}

  ngOnInit(): void {}
  remove(index: number) {
    this.companies.splice(index, 1);
    this.developerService.userIdFromParam.subscribe((params) => {
      this.userPath = params;
      this.afs.collection(Utility.dataBase).doc(params).update({
        followCompanies: this.companies,
      });
    });
  }
}
