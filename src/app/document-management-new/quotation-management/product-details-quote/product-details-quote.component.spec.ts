import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsQuoteComponent } from './product-details-quote.component';

describe('ProductDetailsQuoteComponent', () => {
  let component: ProductDetailsQuoteComponent;
  let fixture: ComponentFixture<ProductDetailsQuoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductDetailsQuoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailsQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
