import { TestBed } from '@angular/core/testing';

import { ContactsreportService } from './contactsreport.service';

describe('ContactsreportService', () => {
  let service: ContactsreportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactsreportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
