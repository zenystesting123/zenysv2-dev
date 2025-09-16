import { TestBed } from '@angular/core/testing';

import { PaymentSettingsService } from './payment-settings.service';

describe('PaymentSettingsService', () => {
  let service: PaymentSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
