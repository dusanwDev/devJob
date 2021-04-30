import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Company } from 'src/app/models/company.model';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  job = new Subject();
  constructor() {}
}
