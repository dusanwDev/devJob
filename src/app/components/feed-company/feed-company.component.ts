import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Developer } from 'src/app/models/developer.model';
import { Utility } from 'src/app/models/utility.model';

@Component({
  selector: 'app-feed-company',
  templateUrl: './feed-company.component.html',
  styleUrls: ['./feed-company.component.scss'],
})
export class FeedCompanyComponent implements OnInit {
  formCompany: FormGroup;
  constructor(
    private afs: AngularFirestore,
    private activatedRoute: ActivatedRoute
  ) {}
  developers: Developer[] = [];
  displayRemoveBtn = false;
  ngOnInit(): void {
    this.formCompany = new FormGroup({
      position: new FormControl(null),
      employment: new FormControl(null),
      seniority: new FormControl(null),
    });
    this.afs
      .collection<Developer>(Utility.dataBase, (ref) =>
        ref.where('developerId', '!=', 'null')
      )
      .valueChanges()
      .subscribe((developer) => {
        this.developers = developer;
        console.log(this.developers);
      });
    if (this.activatedRoute.snapshot.routeConfig.path === 'feed-company') {
      this.displayRemoveBtn = false;
    }
  }
  filtered = [];
  search() {
    this.filtered = this.developers.filter((developer) => {
      if (
        this.formCompany.get('position').value === developer.position ||
        this.formCompany.get('employment').value === developer.employment ||
        this.formCompany.get('seniority').value === developer.seniority
      ) {
        return developer;
      }
    });
  }
}
