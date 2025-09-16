import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutlookCalendarEventsDetailsComponent } from './outlook-calendar-events-details.component';

describe('OutlookCalendarEventsDetailsComponent', () => {
  let component: OutlookCalendarEventsDetailsComponent;
  let fixture: ComponentFixture<OutlookCalendarEventsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutlookCalendarEventsDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutlookCalendarEventsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
