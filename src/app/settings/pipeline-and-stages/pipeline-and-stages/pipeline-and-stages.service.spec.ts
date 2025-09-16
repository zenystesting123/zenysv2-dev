import { TestBed } from '@angular/core/testing';

import { PipelineAndStagesService } from './pipeline-and-stages.service';

describe('PipelineAndStagesService', () => {
  let service: PipelineAndStagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PipelineAndStagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
