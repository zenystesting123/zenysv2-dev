import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillToQuoteComponent } from './bill-to-quote.component';

describe('BillToQuoteComponent', () => {
  let component: BillToQuoteComponent;
  let fixture: ComponentFixture<BillToQuoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillToQuoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillToQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
