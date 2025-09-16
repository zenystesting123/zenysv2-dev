import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillFromQuoteComponent } from './bill-from-quote.component';

describe('BillFromQuoteComponent', () => {
  let component: BillFromQuoteComponent;
  let fixture: ComponentFixture<BillFromQuoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillFromQuoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillFromQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
