import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationTableComponent } from './quotation-table.component';

describe('QuotationTableComponent', () => {
  let component: QuotationTableComponent;
  let fixture: ComponentFixture<QuotationTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
