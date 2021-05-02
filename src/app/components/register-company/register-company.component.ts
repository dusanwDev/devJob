import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register-company',
  templateUrl: './register-company.component.html',
  styleUrls: ['./register-company.component.scss'],
})
export class RegisterCompanyComponent implements OnInit {
  constructor(private authService: AuthService) {}
  registerCompany: FormGroup;
  errorMessage: string;

  ngOnInit(): void {
    this.registerCompany = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
      companyName: new FormControl(null, [Validators.required]),
    });
  }

  submit() {
    this.authService
      .registerCompany(
        this.registerCompany
          .get('companyName')
          .value.split(' ')
          .map((word) => {
            return word[0].toUpperCase() + word.substring(1);
          })
          .join(' '),
        this.registerCompany.get('email').value,
        this.registerCompany.get('password').value
      )
      .subscribe(
        (data) => console.log(),
        (error) => {
          this.errorMessage = error;
        }
      );
  }
}
