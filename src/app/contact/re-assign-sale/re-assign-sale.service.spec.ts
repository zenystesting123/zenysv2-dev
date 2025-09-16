import { TestBed } from '@angular/core/testing';

import { ReAssignSaleService } from './re-assign-sale.service';

describe('ReAssignSaleService', () => {
  let service: ReAssignSaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReAssignSaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
