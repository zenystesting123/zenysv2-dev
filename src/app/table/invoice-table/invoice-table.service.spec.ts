import { TestBed } from '@angular/core/testing';

import { InvoiceTableService } from './invoice-table.service';

describe('InvoiceTableService', () => {
  let service: InvoiceTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoiceTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
