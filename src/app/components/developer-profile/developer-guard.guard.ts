import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Developer } from 'src/app/models/developer.model';
import { Utility } from 'src/app/models/utility.model';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class DeveloperGuardGuard implements CanActivate {
  constructor(
    private activatedRoute: ActivatedRoute,
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
    // return this.authService.developer.pipe(
    //   map((data) => {
    //     console.log('DEV GUARD', data);
    //     if (!data) {
    //       return this.router.createUrlTree(['/error']);
    //     }
    //     return true;

    //   })
    // );
    return this.afs
      .collection<Developer>(Utility.dataBase)
      .doc(route.params['developerid'])
      .valueChanges()
      .pipe(
        map((data) => {
          if (typeof data !== 'undefined' && data.developerId) {
            return true;
          }
          return this.router.createUrlTree(['/error']);
        })
      );
  }
}
