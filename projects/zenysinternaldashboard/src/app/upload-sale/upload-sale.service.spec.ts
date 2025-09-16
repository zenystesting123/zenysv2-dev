import { TestBed } from '@angular/core/testing';

import { UploadSaleService } from './upload-sale.service';

describe('UploadSaleService', () => {
  let service: UploadSaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadSaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
