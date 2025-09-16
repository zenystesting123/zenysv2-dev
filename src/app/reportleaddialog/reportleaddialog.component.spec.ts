import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportleaddialogComponent } from './reportleaddialog.component';

describe('ReportleaddialogComponent', () => {
  let component: ReportleaddialogComponent;
  let fixture: ComponentFixture<ReportleaddialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportleaddialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportleaddialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
