import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocDetailsPreviewInvoiceComponent } from './doc-details-preview-invoice.component';

describe('DocDetailsPreviewInvoiceComponent', () => {
  let component: DocDetailsPreviewInvoiceComponent;
  let fixture: ComponentFixture<DocDetailsPreviewInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocDetailsPreviewInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocDetailsPreviewInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
