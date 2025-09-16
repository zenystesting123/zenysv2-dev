import { TestBed } from '@angular/core/testing';

import { OutlookCalendarEventService } from './outlook-calendar-event.service';

describe('OutlookCalendarEventService', () => {
  let service: OutlookCalendarEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OutlookCalendarEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
