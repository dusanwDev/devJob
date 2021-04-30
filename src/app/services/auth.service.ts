import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { Utility } from 'src/app/models/utility.model';
export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  //for logIn
  registered?: boolean;
}
type typeOfRegister =
  | 'companyRegister'
  | 'developerRegister'
  | 'developerLogin'
  | 'companyLogin';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  developer = new BehaviorSubject<User>(null);
  private timeoutId: any;
  constructor(
    private afs: AngularFirestore,
    private http: HttpClient,
    private router: Router
  ) {}
  logIn(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(Utility.logInPath, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(
        tap((data) =>
          this.handleAuth(
            data.idToken,
            data.localId,
            +data.expiresIn,
            data.refreshToken,
            'developerLogin'
          )
        )
      )
      .pipe(catchError(this.handleError));
  }
  logInCompany(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(Utility.logInPath, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(
        tap((data) =>
          this.handleAuth(
            data.idToken,
            data.localId,
            +data.expiresIn,
            data.refreshToken,
            'companyLogin'
          )
        )
      )
      .pipe(catchError(this.handleError));
  }
  registerDeveloper(
    name: string,
    lastName: string,
    email: string,
    password: string
  ) {
    return this.http
      .post<AuthResponseData>(Utility.registerPath, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(
        tap((data) =>
          this.handleAuth(
            data.idToken,
            data.localId,
            +data.expiresIn,
            data.refreshToken,
            'developerRegister',
            name,
            lastName
          )
        )
      )
      .pipe(catchError(this.handleError));
  }
  registerCompany(name: string, email: string, password: string) {
    return this.http
      .post<AuthResponseData>(Utility.registerPath, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(
        catchError(this.handleError),
        tap((data) =>
          this.handleAuth(
            data.idToken,
            data.localId,
            +data.expiresIn,
            data.refreshToken,
            'companyRegister',
            name
          )
        )
      );
  }
  handleAuth(
    idToken: string,
    userId: string,
    expiresIn: number,
    refreshToken: string,
    typeOfRegister: typeOfRegister,
    name?: string,
    lastName?: string
  ) {
    const expDate = new Date(new Date(new Date().getTime() + expiresIn * 1000));
    const user = new User(userId, idToken, expDate, refreshToken);
    localStorage.setItem(Utility.localStorageKey, JSON.stringify(user));
    this.developer.next(user);
    this.autoLogOut(expiresIn * 1000);
    console.log(typeOfRegister);

    switch (typeOfRegister) {
      case 'companyRegister':
        this.afs.collection(Utility.dataBase).doc(userId).set({
          companyName: name,
          companyId: userId,
        });
        this.router.navigate(['/company', user._userId, 'about']);
        break;
      case 'developerRegister':
        this.afs.collection(Utility.dataBase).doc(userId).set({
          firstName: name,
          lastName: lastName,
          developerId: userId,
        });
        this.router.navigate(['/developer', user._userId, 'about']);
        break;
      case 'companyLogin':
        this.router.navigate(['/company', user._userId, 'about']);
        break;
      case 'developerLogin':
        this.router.navigate(['/developer', user._userId, 'about']);
        break;
      default:
        break;
    }
  }
  logOut() {
    localStorage.removeItem(Utility.localStorageKey);
    this.router.navigate(['']);
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.timeoutId = null;
  }
  autoLogOut(expiresIn: number) {
    this.timeoutId = setTimeout(() => {
      this.logOut();
    }, expiresIn);
  }
  autoLogIn() {
    const user: {
      expdate: string;
      refreshToken: string;
      userId;
      _token;
    } = JSON.parse(localStorage.getItem(Utility.localStorageKey));
    if (!user) {
      return;
    }
    const logedInUser = new User(
      user.userId,
      user._token,
      new Date(user.expdate),
      user.refreshToken
    );
    if (logedInUser.token) {
      this.developer.next(logedInUser);
      const expDuration =
        new Date(user.expdate).getTime() - new Date().getTime();

      this.autoLogOut(expDuration);
    }
  }
  handleError(httpMessage: HttpErrorResponse) {
    let message = 'An unknown error has occured';
    if (!httpMessage.error) {
      return throwError(message);
    }
    console.log(httpMessage.error.error.message);
    switch (httpMessage.error.error.message) {
      case 'EMAIL_EXISTS':
        message = 'Email exists';
        break;
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        message = 'We detected some unusual activity';
        break;
      case 'EMAIL_NOT_FOUND':
        message = 'Email not found';
        break;
      case 'INVALID_PASSWORD':
        message = 'Password is invalid';
        break;
      default:
        message = 'An unknown error has occured';
        break;
    }
    return throwError(message);
  }
}
