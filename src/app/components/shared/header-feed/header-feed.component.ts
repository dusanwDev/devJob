import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { map, take } from 'rxjs/operators';
import { Company } from 'src/app/models/company.model';
import { Developer } from 'src/app/models/developer.model';
import { Utility } from 'src/app/models/utility.model';
import { AuthService } from 'src/app/services/auth.service';
import { DeveloperService } from '../../developer-profile/developer.service';

@Component({
  selector: 'app-header-feed',
  templateUrl: './header-feed.component.html',
  styleUrls: ['./header-feed.component.scss'],
})
export class HeaderFeedComponent implements OnInit {
  constructor(
    private afs: AngularFirestore,
    private developerService: DeveloperService,
    private authService: AuthService,
    private afsStorage: AngularFireStorage
  ) {}
  user: Developer & Company;
  company: Company;
  developer: Developer;
  userPath: string;
  selectedFile: File = null;
  @ViewChild('menu') menu: ElementRef;
  @ViewChild('menuInner') menuInner: ElementRef;
  ngOnInit(): void {
    this.authService.developer.subscribe((data) => {
      if (!data) {
        return;
      }
      this.afs
        .collection<Developer & Company>(Utility.dataBase)
        .doc(data._userId)
        .valueChanges()
        .subscribe((userData) => {
          if (userData.developerId) {
            this.developer = userData;
          } else if (userData.companyId) {
            this.company = userData;
          }
        });
    });
  }
  dropDown(logOut: HTMLDivElement) {
    if (logOut.style.display === 'block') {
      logOut.style.display = 'none';
    } else {
      logOut.style.display = 'block';
    }
  }
  logginOut() {
    console.log('ULAZ');
    this.authService.logOut();
  }
  menuActivate() {
    this.menu.nativeElement.style.width = '100%';
    this.menuInner.nativeElement.style.minWidth = '320px';
  }
  removeMenu() {
    this.menu.nativeElement.style.width = '0%';
  }
  onFileSelectedListener(event, user: string) {
    console.log(user);
    if (user === 'developer') {
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
    } else if (user === 'company') {
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
  }
}
