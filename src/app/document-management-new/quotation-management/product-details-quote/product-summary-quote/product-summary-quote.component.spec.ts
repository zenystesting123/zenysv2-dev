import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSummaryQuoteComponent } from './product-summary-quote.component';

describe('ProductSummaryQuoteComponent', () => {
  let component: ProductSummaryQuoteComponent;
  let fixture: ComponentFixture<ProductSummaryQuoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductSummaryQuoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSummaryQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
