import { TestBed } from '@angular/core/testing';

import { ProductsAndServicesService } from './products-and-services.service';

describe('ProductsAndServicesService', () => {
  let service: ProductsAndServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductsAndServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
