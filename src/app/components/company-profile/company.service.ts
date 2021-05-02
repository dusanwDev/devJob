import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Utility } from 'src/app/models/utility.model';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  userId = new Subject<string>();
  userIdBeh = new BehaviorSubject<string>(null);

  constructor(private authService: AuthService) {}
  forbidCommentPosting(params: string) {
    // const user: {
    //   expdate: string;
    //   refreshToken: string;
    //   userId;
    //   _token;
    // } = JSON.parse(localStorage.getItem(Utility.localStorageKey));
    return this.authService.developer.pipe(
      take(1),
      map((userData) => {
        if (userData._userId !== params) {
          return true;
        } else {
          return false;
        }
      })
    );

  }
}
