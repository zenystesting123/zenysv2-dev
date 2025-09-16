import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsInvoiceComponent } from './product-details-invoice.component';

describe('ProductDetailsInvoiceComponent', () => {
  let component: ProductDetailsInvoiceComponent;
  let fixture: ComponentFixture<ProductDetailsInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductDetailsInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailsInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
