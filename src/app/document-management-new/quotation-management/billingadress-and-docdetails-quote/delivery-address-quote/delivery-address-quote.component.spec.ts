import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryAddressQuoteComponent } from './delivery-address-quote.component';

describe('DeliveryAddressQuoteComponent', () => {
  let component: DeliveryAddressQuoteComponent;
  let fixture: ComponentFixture<DeliveryAddressQuoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryAddressQuoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryAddressQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
