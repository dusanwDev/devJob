import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Developer } from 'src/app/models/developer.model';
import { Utility } from 'src/app/models/utility.model';
import { DeveloperService } from '../developer.service';

@Component({
  selector: 'app-saved-jobs',
  templateUrl: './saved-jobs.component.html',
  styleUrls: ['./saved-jobs.component.scss'],
})
export class SavedJobsComponent implements OnInit {
  constructor(
    private developerService: DeveloperService,
    private afs: AngularFirestore
  ) {}
  developer: Developer;
  ngOnInit(): void {
    this.developerService.userIdFromParam.subscribe((paramsURL) => {
      this.afs
        .collection<Developer>(Utility.dataBase)
        .doc(paramsURL)
        .valueChanges()
        .subscribe((dev) => {
          this.developer = dev;
          console.log(this.developer);
        });
    });
  }
}
