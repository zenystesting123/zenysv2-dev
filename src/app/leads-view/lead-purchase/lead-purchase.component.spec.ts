import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadPurchaseComponent } from './lead-purchase.component';

describe('LeadPurchaseComponent', () => {
  let component: LeadPurchaseComponent;
  let fixture: ComponentFixture<LeadPurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadPurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
