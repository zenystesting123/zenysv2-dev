import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocDetailsPreviewQuotationComponent } from './doc-details-preview-quotation.component';

describe('DocDetailsPreviewQuotationComponent', () => {
  let component: DocDetailsPreviewQuotationComponent;
  let fixture: ComponentFixture<DocDetailsPreviewQuotationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocDetailsPreviewQuotationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocDetailsPreviewQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
