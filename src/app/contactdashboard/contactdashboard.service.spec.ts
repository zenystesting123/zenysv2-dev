import { TestBed } from '@angular/core/testing';

import { ContactdashboardService } from './contactdashboard.service';

describe('ContactdashboardService', () => {
  let service: ContactdashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactdashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
