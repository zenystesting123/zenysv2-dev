import { TestBed } from '@angular/core/testing';

import { GoogleCalendarEventService } from './google-calendar-event.service';

describe('GoogleCalendarEventService', () => {
  let service: GoogleCalendarEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleCalendarEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
