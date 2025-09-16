import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceMarkingComponent } from './attendance-marking.component';

describe('AttendanceMarkingComponent', () => {
  let component: AttendanceMarkingComponent;
  let fixture: ComponentFixture<AttendanceMarkingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendanceMarkingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceMarkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
