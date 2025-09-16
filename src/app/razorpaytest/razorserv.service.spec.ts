import { TestBed } from '@angular/core/testing';

import { RazorservService } from './razorserv.service';

describe('RazorservService', () => {
  let service: RazorservService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RazorservService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
