import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTableInvoiceComponent } from './product-table-invoice.component';

describe('ProductTableInvoiceComponent', () => {
  let component: ProductTableInvoiceComponent;
  let fixture: ComponentFixture<ProductTableInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductTableInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTableInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
