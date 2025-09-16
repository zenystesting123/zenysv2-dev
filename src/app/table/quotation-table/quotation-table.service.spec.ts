import { TestBed } from '@angular/core/testing';

import { QuotationTableService } from './quotation-table.service';

describe('QuotationTableService', () => {
  let service: QuotationTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuotationTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
