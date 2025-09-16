import { TestBed } from '@angular/core/testing';

import { DocumentsetttingsService } from './documentsetttings.service';

describe('DocumentsetttingsService', () => {
  let service: DocumentsetttingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentsetttingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
