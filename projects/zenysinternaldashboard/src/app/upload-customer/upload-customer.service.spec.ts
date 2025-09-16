import { TestBed } from '@angular/core/testing';

import { UploadCustomerService } from './upload-customer.service';

describe('UploadCustomerService', () => {
  let service: UploadCustomerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadCustomerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
