import { TestBed } from '@angular/core/testing';

import { FbLeadsServService } from './fb-leads-serv.service';

describe('FbLeadsServService', () => {
  let service: FbLeadsServService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FbLeadsServService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
