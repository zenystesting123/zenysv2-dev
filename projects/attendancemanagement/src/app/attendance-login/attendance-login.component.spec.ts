import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceLoginComponent } from './attendance-login.component';

describe('AttendanceLoginComponent', () => {
  let component: AttendanceLoginComponent;
  let fixture: ComponentFixture<AttendanceLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendanceLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
