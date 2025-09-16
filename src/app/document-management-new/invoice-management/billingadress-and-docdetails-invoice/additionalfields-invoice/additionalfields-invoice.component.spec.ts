import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalfieldsInvoiceComponent } from './additionalfields-invoice.component';

describe('AdditionalfieldsInvoiceComponent', () => {
  let component: AdditionalfieldsInvoiceComponent;
  let fixture: ComponentFixture<AdditionalfieldsInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalfieldsInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalfieldsInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
