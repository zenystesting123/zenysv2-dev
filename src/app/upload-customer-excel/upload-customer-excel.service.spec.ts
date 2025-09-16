import { TestBed } from '@angular/core/testing';

import { UploadCustomerExcelService } from './upload-customer-excel.service';

describe('UploadCustomerExcelService', () => {
  let service: UploadCustomerExcelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadCustomerExcelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
