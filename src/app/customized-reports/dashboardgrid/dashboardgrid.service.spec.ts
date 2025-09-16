import { TestBed } from '@angular/core/testing';

import { DashboardgridService } from './dashboardgrid.service';

describe('DashboardgridService', () => {
  let service: DashboardgridService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardgridService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
