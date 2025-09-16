import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationformfaqComponent } from './quotationformfaq.component';

describe('QuotationformfaqComponent', () => {
  let component: QuotationformfaqComponent;
  let fixture: ComponentFixture<QuotationformfaqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationformfaqComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationformfaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
