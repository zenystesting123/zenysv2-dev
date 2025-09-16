import { TestBed } from '@angular/core/testing';

import { ChannelpartnerService } from './channelpartner.service';

describe('ChannelpartnerService', () => {
  let service: ChannelpartnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChannelpartnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
