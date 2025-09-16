import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicemodalComponent } from './invoicemodal.component';

describe('InvoicemodalComponent', () => {
  let component: InvoicemodalComponent;
  let fixture: ComponentFixture<InvoicemodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoicemodalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicemodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
