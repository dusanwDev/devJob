import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, take, takeWhile } from 'rxjs/operators';
import { Company } from 'src/app/models/company.model';
import { Developer } from 'src/app/models/developer.model';
import { Utility } from 'src/app/models/utility.model';
import { AuthService } from 'src/app/services/auth.service';
import { DeveloperService } from './developer.service';

@Component({
  selector: 'app-developer',
  templateUrl: './developer.component.html',
  styleUrls: ['./developer.component.scss'],
})
export class DeveloperComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private afs: AngularFirestore,
    private auth: AuthService,
    private developerService: DeveloperService,
    private afsStorage: AngularFireStorage,
    private router: Router
  ) {}

  selectedFile: File = null;
  developer: Developer;
  paramsURL: string;
  enableImageAndOfferEdditing: boolean;
  offerForm: FormGroup;
  company: Company;
  removeOffers = true;
  @ViewChild('offerFormGroup') offerFormGroup: ElementRef;
  ngOnInit(): void {
    this.offerForm = new FormGroup({
      offer: new FormControl(null, Validators.required),
    });
    this.auth.developer.subscribe((dev) => {
      this.afs
        .collection<Company>(Utility.dataBase)
        .doc(dev._userId)
        .valueChanges()
        .subscribe((company) => {
          if (company.companyId) {
            this.company = company;
            this.removeOffers = false;
          }
        });
    });
    this.developerService.userIdFromParam.subscribe((data) => {
      // this.developerService.removeImageUpload(data, this.addImage);
      // this.afs
      //   .collection<Developer>(Utility.dataBase)
      //   .doc(data)
      //   .valueChanges()
      //   .subscribe((userData) => {
      //     this.developer = userData;
      //     this.developerService
      //       .removeImageUpload(data.toString())
      //       .subscribe((devBool) => {
      //         this.enableImageAndOfferEdditing = devBool;
      //       });
      //   });
    });

    this.activatedRoute.params.subscribe((paramsUrl) => {
      this.developerService.userIdFromParam.next(paramsUrl['developerid']);
      console.log('AAAAAAAAAAAAAAAAAAAAAAA');

      this.afs
        .collection<Developer>(Utility.dataBase)
        .doc(paramsUrl['developerid'])
        .valueChanges()
        .subscribe((userData) => {
          this.developer = userData;
          this.developerService
            .removeImageUploadAndOffer(paramsUrl['developerid'])
            .subscribe((devBool) => {
              this.enableImageAndOfferEdditing = devBool;
            });
        });
    });
    // this.auth.developer.subscribe((devData) => {
    //   this.afs
    //     .collection<Developer>(Utility.dataBase)
    //     .doc(devData._userId)
    //     .valueChanges()
    //     .subscribe((userData) => {
    //       console.log('DEV LEFT', userData);
    //       this.developer = userData;
    //     });
    // });

    // .subscribe((data) =>
    //   this.afs
    //     .collection<Developer>(Utility.dataBase)
    //     .doc(data)
    //     .valueChanges()
    //     .subscribe((userData) => {

    //       console.log(this.developer);
    //     })
    // );
    this.offerForm = new FormGroup({
      offer: new FormControl(null, Validators.required),
    });
  }
  // userData() {
  //   const user: {
  //     expdate: string;
  //     refreshToken: string;
  //     userId;
  //     _token;
  //   } = JSON.parse(localStorage.getItem(Utility.localStorageKey));
  //   this.afs;
  // }

  onFileSelectedListener(event) {
    this.selectedFile = <File>event.target.files[0];
    if (this.selectedFile.type === 'image/jpeg' || 'image/png') {
      this.afsStorage
        .upload(this.developer.developerId, this.selectedFile)
        .then(() => {
          this.afsStorage.storage
            .ref()
            .child(this.developer.developerId)
            .getDownloadURL()
            .then((data) => {
              this.developer.image = data;
              this.afs
                .collection<Developer>(Utility.dataBase)
                .doc(this.developer.developerId)
                .update({
                  image: data,
                });
            });
        });
    } else {
      alert('FILE IS NOT A IMAGE');
    }
  }
  offer() {
    this.offerFormGroup.nativeElement.style.display = 'flex';
  }
  removeOfferForm() {
    this.offerFormGroup.nativeElement.style.display = 'none';
  }
  sendOffer() {
    if (typeof this.developer.offers === 'undefined') {
      this.developer.offers = [
        { from: '', message: '', shortedMessage: '', companyLink: '' },
      ];
      this.developer.offers.shift();
    }
    this.developer.offers.push({
      companyLink: this.company.companyId,
      message: this.offerForm.get('offer').value,
      from: this.company.companyName,
      shortedMessage: this.offerForm
        .get('offer')
        .value.split(' ')
        .map((word, index) => {
          if (index < 10) {
            return word;
          }
        })
        .join(' '),
    });
    this.afs
      .collection<Developer>(Utility.dataBase)
      .doc(this.developer.developerId)
      .update({
        offers: this.developer.offers,
      });
    this.offerFormGroup.nativeElement.style = 'none';
    this.offerForm.reset();
  }
  logout() {
    this.auth.logOut();
    this.router.navigate(['/']);
  }
}
