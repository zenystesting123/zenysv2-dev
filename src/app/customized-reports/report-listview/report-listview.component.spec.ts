import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportListviewComponent } from './report-listview.component';

describe('ReportListviewComponent', () => {
  let component: ReportListviewComponent;
  let fixture: ComponentFixture<ReportListviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportListviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportListviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
