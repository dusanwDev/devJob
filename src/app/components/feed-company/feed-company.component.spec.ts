import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedCompanyComponent } from './feed-company.component';

describe('FeedCompanyComponent', () => {
  let component: FeedCompanyComponent;
  let fixture: ComponentFixture<FeedCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedCompanyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
