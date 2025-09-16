import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationmanagementComponent } from './quotationmanagement.component';

describe('QuotationmanagementComponent', () => {
  let component: QuotationmanagementComponent;
  let fixture: ComponentFixture<QuotationmanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationmanagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
