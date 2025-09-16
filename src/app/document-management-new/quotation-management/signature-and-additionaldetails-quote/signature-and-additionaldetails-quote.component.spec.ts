import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureAndAdditionaldetailsQuoteComponent } from './signature-and-additionaldetails-quote.component';

describe('SignatureAndAdditionaldetailsQuoteComponent', () => {
  let component: SignatureAndAdditionaldetailsQuoteComponent;
  let fixture: ComponentFixture<SignatureAndAdditionaldetailsQuoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignatureAndAdditionaldetailsQuoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureAndAdditionaldetailsQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
