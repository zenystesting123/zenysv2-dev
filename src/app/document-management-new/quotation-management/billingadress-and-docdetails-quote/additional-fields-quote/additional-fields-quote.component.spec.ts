import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalFieldsQuoteComponent } from './additional-fields-quote.component';

describe('AdditionalFieldsQuoteComponent', () => {
  let component: AdditionalFieldsQuoteComponent;
  let fixture: ComponentFixture<AdditionalFieldsQuoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalFieldsQuoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalFieldsQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
