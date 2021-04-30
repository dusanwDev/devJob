import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.scss'],
})
export class LoginDeveloperComponent implements OnInit {
  loginUser: FormGroup;
  errorMessage: string;
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginUser = new FormGroup({
      email: new FormControl(null, [Validators.email, Validators.required]),
      password: new FormControl(null, [
        Validators.minLength(6),
        Validators.required,
      ]),
    });
  }
  submit() {
    this.auth
      .logIn(
        this.loginUser.get('email').value,
        this.loginUser.get('password').value
      )
      .subscribe(
        (data) => console.log(),
        (error) => {
          this.errorMessage = error;
        }
      );
  }
  submitDemo() {
    this.auth.logIn('developer1@gmail.com', '123456').subscribe();
  }
}
