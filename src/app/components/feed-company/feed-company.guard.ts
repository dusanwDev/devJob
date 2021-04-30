import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Company } from 'src/app/models/company.model';
import { Utility } from 'src/app/models/utility.model';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class FeedCompanyGuard implements CanActivate {
  constructor(private afs: AngularFirestore, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.afs
      .collection<Company>(Utility.dataBase)
      .doc(route.params['userid'])
      .valueChanges()
      .pipe(
        map((data) => {
          if (typeof data !== 'undefined' && data.companyId) {
            return true;
          }
          return this.router.createUrlTree(['/error']);
        })
      );
  }
}
