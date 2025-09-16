import { TestBed } from '@angular/core/testing';

import { InvoicemanagmentService } from './invoicemanagment.service';

describe('InvoicemanagmentService', () => {
  let service: InvoicemanagmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoicemanagmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
