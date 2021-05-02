import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Utility } from 'src/app/models/utility.model';
import { AuthService } from '../../services/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-register-developer',
  templateUrl: './register-developer.component.html',
  styleUrls: ['./register-developer.component.scss'],
})
export class RegisterDeveloperComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private afs: AngularFirestore,
    private afsStorage: AngularFireStorage
  ) {}
  registerDeveloperForm: FormGroup;
  selectedFile: File = null;

  ngOnInit(): void {
    this.registerDeveloperForm = new FormGroup({
      firstName: new FormControl(null, [
        Validators.required,
        this.checkForNumbers.bind(this),
      ]),
      lastName: new FormControl(null, [
        Validators.required,
        this.checkForNumbers.bind(this),
      ]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
      img: new FormControl(null),
    });
  }
  onFileSelectedListener(event) {
    this.selectedFile = <File>event.target.files[0];
  }
  image: string;
  errorMessage: string;
  submit() {
    this.authService
      .registerDeveloper(
        this.registerDeveloperForm
          .get('firstName')
          .value.split(' ')
          .map((word) => {
            return word[0].toUpperCase() + word.substring(1);
          })
          .join(' '),
        this.registerDeveloperForm
          .get('lastName')
          .value.split(' ')
          .map((word) => {
            return word[0].toUpperCase() + word.substring(1);
          })
          .join(' '),
        this.registerDeveloperForm.get('email').value,
        this.registerDeveloperForm.get('password').value
      )
      .subscribe(
        (data) => console.log(),

        (error) => {
          this.errorMessage = error;
        }
      );
  }
  checkFiletype(formControl: FormControl): { [key: string]: boolean } {
    if (this.selectedFile.type === 'image/jpeg' || 'image/png') {
      this.afsStorage.upload('M', this.selectedFile);
      return null;
    } else {
      alert('FILE IS NOT A IMAGE');
      return { FileMustBeAnImage: true };
    }
  }
  checkForNumbers(formControl: FormControl): { [key: string]: boolean } {
    let format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~\d]/.test(
      formControl.value
    );
    if (format) {
      return { inputCannotBeNumber: true };
    } else {
      return null;
    }
  }
  getImage() {
    this.afsStorage.storage
      .ref()
      .child('/M')
      .getDownloadURL()
      .then((data) => {
        this.image = data;
      });
  }
}
