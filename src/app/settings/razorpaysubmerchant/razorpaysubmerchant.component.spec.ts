import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RazorpaysubmerchantComponent } from './razorpaysubmerchant.component';

describe('RazorpaysubmerchantComponent', () => {
  let component: RazorpaysubmerchantComponent;
  let fixture: ComponentFixture<RazorpaysubmerchantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RazorpaysubmerchantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RazorpaysubmerchantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
