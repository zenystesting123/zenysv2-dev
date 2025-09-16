import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillFromInvoiceComponent } from './bill-from-invoice.component';

describe('BillFromInvoiceComponent', () => {
  let component: BillFromInvoiceComponent;
  let fixture: ComponentFixture<BillFromInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillFromInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillFromInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
