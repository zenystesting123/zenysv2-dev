import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutlookCalendarEventsListComponent } from './outlook-calendar-events-list.component';

describe('OutlookCalendarEventsListComponent', () => {
  let component: OutlookCalendarEventsListComponent;
  let fixture: ComponentFixture<OutlookCalendarEventsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutlookCalendarEventsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutlookCalendarEventsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
