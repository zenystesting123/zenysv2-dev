import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryAddressInvoiceComponent } from './delivery-address-invoice.component';

describe('DeliveryAddressInvoiceComponent', () => {
  let component: DeliveryAddressInvoiceComponent;
  let fixture: ComponentFixture<DeliveryAddressInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryAddressInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryAddressInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
