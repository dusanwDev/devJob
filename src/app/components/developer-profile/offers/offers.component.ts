import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Developer } from 'src/app/models/developer.model';
import { Utility } from 'src/app/models/utility.model';
import { DeveloperService } from '../developer.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss'],
})
export class OffersComponent implements OnInit {
  constructor(
    private developerService: DeveloperService,
    private afs: AngularFirestore
  ) {}
  developer: Developer;
  @ViewChild('viewMessageBox') viewMessageBox: ElementRef;
  ngOnInit(): void {
    this.developerService.userIdFromParam.subscribe((param) => {
      this.afs
        .collection<Developer>(Utility.dataBase)
        .doc(param)
        .valueChanges()
        .subscribe((userData) => {
          this.developer = userData;
        });
    });
  }
  offer: { from: string; message: string; shortedMessage: string };
  remove() {
    this.viewMessageBox.nativeElement.style.display = 'none';
  }
  viewMessage(offer: {
    from: string;
    message: string;
    shortedMessage: string;
  }) {
    this.viewMessageBox.nativeElement.style.display = 'block';

    this.offer = offer;
  }
  removeOffer(i: number) {
    this.developer.offers.splice(i, 1);
    this.afs
      .collection<Developer>(Utility.dataBase)
      .doc(this.developer.developerId)
      .update({
        offers: this.developer.offers,
      });
  }
}
