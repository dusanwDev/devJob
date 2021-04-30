import { Component, OnInit } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { Developer } from 'src/app/models/developer.model';
import { Utility } from 'src/app/models/utility.model';
import { DeveloperService } from '../developer.service';

@Component({
  selector: 'app-companies-follow',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
})
export class CompaniesFollowComponent implements OnInit {
  constructor(
    private developerService: DeveloperService,
    private afs: AngularFirestore
  ) {}
  developer: Developer;
  ngOnInit(): void {
    this.developerService.userIdFromParam.subscribe((params) => {
      this.afs
        .collection<Developer>(Utility.dataBase)
        .doc(params)
        .valueChanges()
        .subscribe((developerData) => {
          this.developer = developerData;
        });
    });
  }
}
