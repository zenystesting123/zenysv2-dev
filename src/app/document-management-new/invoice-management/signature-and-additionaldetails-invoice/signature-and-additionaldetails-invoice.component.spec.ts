import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureAndAdditionaldetailsInvoiceComponent } from './signature-and-additionaldetails-invoice.component';

describe('SignatureAndAdditionaldetailsInvoiceComponent', () => {
  let component: SignatureAndAdditionaldetailsInvoiceComponent;
  let fixture: ComponentFixture<SignatureAndAdditionaldetailsInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignatureAndAdditionaldetailsInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureAndAdditionaldetailsInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
