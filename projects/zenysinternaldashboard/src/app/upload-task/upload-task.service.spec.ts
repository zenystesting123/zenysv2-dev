import { TestBed } from '@angular/core/testing';

import { UploadTaskService } from './upload-task.service';

describe('UploadTaskService', () => {
  let service: UploadTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
