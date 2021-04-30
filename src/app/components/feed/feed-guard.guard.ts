import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
  CanActivate,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Company } from 'src/app/models/company.model';
import { Developer } from 'src/app/models/developer.model';
import { Utility } from 'src/app/models/utility.model';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class FeedGuardGuard implements CanActivate {
  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,
    private router: Router
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.afs
      .collection<Developer>(Utility.dataBase)
      .doc(route.params['userid'])
      .valueChanges()
      .pipe(
        map((data) => {
          if (typeof data !== 'undefined' && data.developerId) {
            return true;
          }
          return this.router.createUrlTree(['/error']);
        })
      );
    // return this.authService.developer.pipe(
    //   take(1),
    //   map((data) => {
    //     if (typeof data !== 'undefined' && data.token) {
    //       return true;
    //     }
    //     return this.router.createUrlTree(['/error']);
    //   })
    // );
  }
}
