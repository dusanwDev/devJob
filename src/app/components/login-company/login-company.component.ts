import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-company',
  templateUrl: './login-company.component.html',
  styleUrls: ['./login-company.component.scss'],
})
export class LoginCompanyComponent implements OnInit {
  loginCompany: FormGroup;
  errorMessage: string;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loginCompany = new FormGroup({
      email: new FormControl(null, [Validators.email, Validators.required]),
      password: new FormControl(null, [
        Validators.minLength(6),
        Validators.required,
      ]),
    });
  }
  submitDemo() {
    this.authService.logInCompany('kompanija1@gmail.com', '123456').subscribe();
  }
  submit() {
    this.authService
      .logInCompany(
        this.loginCompany.get('email').value,
        this.loginCompany.get('password').value
      )
      .subscribe(
        (data) => console.log(),
        (error) => {
          this.errorMessage = error;
        }
      );
  }
}
