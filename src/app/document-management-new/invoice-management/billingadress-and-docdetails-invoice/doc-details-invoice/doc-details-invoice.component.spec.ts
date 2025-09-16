import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocDetailsInvoiceComponent } from './doc-details-invoice.component';

describe('DocDetailsInvoiceComponent', () => {
  let component: DocDetailsInvoiceComponent;
  let fixture: ComponentFixture<DocDetailsInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocDetailsInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocDetailsInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
