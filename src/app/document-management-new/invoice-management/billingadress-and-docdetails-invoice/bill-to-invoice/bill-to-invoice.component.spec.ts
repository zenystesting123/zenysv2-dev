import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillToInvoiceComponent } from './bill-to-invoice.component';

describe('BillToInvoiceComponent', () => {
  let component: BillToInvoiceComponent;
  let fixture: ComponentFixture<BillToInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillToInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillToInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
