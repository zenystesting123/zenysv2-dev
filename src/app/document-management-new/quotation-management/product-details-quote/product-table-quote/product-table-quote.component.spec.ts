import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTableQuoteComponent } from './product-table-quote.component';

describe('ProductTableQuoteComponent', () => {
  let component: ProductTableQuoteComponent;
  let fixture: ComponentFixture<ProductTableQuoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductTableQuoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTableQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
