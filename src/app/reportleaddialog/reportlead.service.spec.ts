import { TestBed } from '@angular/core/testing';

import { ReportleadService } from './reportlead.service';

describe('ReportleadService', () => {
  let service: ReportleadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportleadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
