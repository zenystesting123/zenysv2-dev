import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTodaysReportComponent } from './employee-todays-report.component';

describe('EmployeeTodaysReportComponent', () => {
  let component: EmployeeTodaysReportComponent;
  let fixture: ComponentFixture<EmployeeTodaysReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeTodaysReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeTodaysReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
