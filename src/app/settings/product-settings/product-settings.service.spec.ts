import { TestBed } from '@angular/core/testing';

import { ProductSettingsService } from './product-settings.service';

describe('ProductSettingsService', () => {
  let service: ProductSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
