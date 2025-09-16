import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeCheckoutLinkComponent } from './stripe-checkout-link.component';

describe('StripeCheckoutLinkComponent', () => {
  let component: StripeCheckoutLinkComponent;
  let fixture: ComponentFixture<StripeCheckoutLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StripeCheckoutLinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StripeCheckoutLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
