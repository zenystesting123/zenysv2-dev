import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingAmountDetailsComponent } from './billing-amount-details.component';

describe('BillingAmountDetailsComponent', () => {
  let component: BillingAmountDetailsComponent;
  let fixture: ComponentFixture<BillingAmountDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillingAmountDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingAmountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
