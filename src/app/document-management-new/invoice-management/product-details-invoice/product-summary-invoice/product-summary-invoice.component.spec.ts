import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSummaryInvoiceComponent } from './product-summary-invoice.component';

describe('ProductSummaryInvoiceComponent', () => {
  let component: ProductSummaryInvoiceComponent;
  let fixture: ComponentFixture<ProductSummaryInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductSummaryInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSummaryInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
