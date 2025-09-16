import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentselectorComponent } from './paymentselector.component';

describe('PaymentselectorComponent', () => {
  let component: PaymentselectorComponent;
  let fixture: ComponentFixture<PaymentselectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentselectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentselectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
