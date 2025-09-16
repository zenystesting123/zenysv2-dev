import { TestBed } from '@angular/core/testing';

import { ToolBarSearchService } from './tool-bar-search.service';

describe('ToolBarSearchService', () => {
  let service: ToolBarSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToolBarSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
