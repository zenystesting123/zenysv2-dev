import { TestBed } from '@angular/core/testing';

import { UploadAttachmtService } from './upload-attachmt.service';

describe('UploadAttachmtService', () => {
  let service: UploadAttachmtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadAttachmtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
