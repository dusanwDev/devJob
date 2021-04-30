import { TestBed } from '@angular/core/testing';

import { FeedCompanyGuard } from './feed-company.guard';

describe('FeedCompanyGuard', () => {
  let guard: FeedCompanyGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(FeedCompanyGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
