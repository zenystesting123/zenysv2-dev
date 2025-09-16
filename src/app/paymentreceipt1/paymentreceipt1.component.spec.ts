import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Paymentreceipt1Component } from './paymentreceipt1.component';

describe('Paymentreceipt1Component', () => {
  let component: Paymentreceipt1Component;
  let fixture: ComponentFixture<Paymentreceipt1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Paymentreceipt1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Paymentreceipt1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
