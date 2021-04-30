import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Utility } from 'src/app/models/utility.model';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class DeveloperService {
  userIdFromParam = new BehaviorSubject<string>(null);
  checkIfUserCanEdit(paramsURL: string) {
    const user: {
      expdate: string;
      refreshToken: string;
      userId;
      _token;
    } = JSON.parse(localStorage.getItem(Utility.localStorageKey));
    if (user.userId !== paramsURL) {
      document
        .querySelectorAll<HTMLFontElement>('.fas.fa-plus')
        .forEach((item) => {
          item.style.display = 'none';
        });
    } else {
      document
        .querySelectorAll<HTMLFontElement>('.fas.fa-plus')
        .forEach((item) => {
          item.style.display = 'inline-block';
        });
    }
  }
  removeImageUploadAndOffer(params: string) {
    // const user: {
    //   expdate: string;
    //   refreshToken: string;
    //   userId;
    //   _token;
    // } = JSON.parse(localStorage.getItem(Utility.localStorageKey));
    return this.authService.developer.pipe(
      map((userData) => {
        if (userData._userId !== params) {
          return false;
        } else {
          return true;
        }
      })
    );
  }
  constructor(private authService: AuthService) {}
}
