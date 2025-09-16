import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicProfileReportComponent } from './public-profile-report.component';

describe('PublicProfileReportComponent', () => {
  let component: PublicProfileReportComponent;
  let fixture: ComponentFixture<PublicProfileReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicProfileReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicProfileReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
