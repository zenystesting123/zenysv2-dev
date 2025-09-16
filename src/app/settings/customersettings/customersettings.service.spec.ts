import { TestBed } from '@angular/core/testing';

import { CustomersettingsService } from './customersettings.service';

describe('CustomersettingsService', () => {
  let service: CustomersettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomersettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
