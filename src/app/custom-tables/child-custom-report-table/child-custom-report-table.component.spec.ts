import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildCustomReportTableComponent } from './child-custom-report-table.component';

describe('ChildCustomReportTableComponent', () => {
  let component: ChildCustomReportTableComponent;
  let fixture: ComponentFixture<ChildCustomReportTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChildCustomReportTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildCustomReportTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
