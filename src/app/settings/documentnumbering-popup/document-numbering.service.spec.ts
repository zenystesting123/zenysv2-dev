import { TestBed } from '@angular/core/testing';

import { DocumentNumberingService } from './document-numbering.service';

describe('DocumentNumberingService', () => {
  let service: DocumentNumberingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentNumberingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
