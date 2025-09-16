import { TestBed } from '@angular/core/testing';

import { SaleGridViewService } from './sale-grid-view.service';

describe('SaleGridViewService', () => {
  let service: SaleGridViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaleGridViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
