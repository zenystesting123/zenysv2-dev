import { TestBed } from '@angular/core/testing';

import { GridContainerService } from './grid-container.service';

describe('GridContainerService', () => {
  let service: GridContainerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GridContainerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
