import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Developer } from 'src/app/models/developer.model';
import { Utility } from 'src/app/models/utility.model';
import { DeveloperService } from '../developer.service';

@Component({
  selector: 'app-job-applications',
  templateUrl: './job-applications.component.html',
  styleUrls: ['./job-applications.component.scss'],
})
export class JobApplicationsComponent implements OnInit {
  constructor(
    private afs: AngularFirestore,
    private developerService: DeveloperService
  ) {}
jobAplications= []
  ngOnInit(): void {
    this.developerService.userIdFromParam.subscribe((userId) => {
      this.afs.collection<Developer>(Utility.dataBase).doc(userId).valueChanges().subscribe(developer=>{
this.jobAplications = developer.jobAplications
      });
    });
  }
}
