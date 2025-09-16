import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasedleadsComponent } from './purchasedleads.component';

describe('PurchasedleadsComponent', () => {
  let component: PurchasedleadsComponent;
  let fixture: ComponentFixture<PurchasedleadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchasedleadsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasedleadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
