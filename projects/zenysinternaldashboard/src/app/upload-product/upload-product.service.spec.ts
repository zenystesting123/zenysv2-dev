import { TestBed } from '@angular/core/testing';

import { UploadProductService } from './upload-product.service';

describe('UploadProductService', () => {
  let service: UploadProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
