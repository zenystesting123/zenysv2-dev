import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocDetailPreviewEstimateComponent } from './doc-detail-preview-estimate.component';

describe('DocDetailPreviewEstimateComponent', () => {
  let component: DocDetailPreviewEstimateComponent;
  let fixture: ComponentFixture<DocDetailPreviewEstimateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocDetailPreviewEstimateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocDetailPreviewEstimateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
