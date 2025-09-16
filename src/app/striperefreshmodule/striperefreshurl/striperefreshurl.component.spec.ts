import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StriperefreshurlComponent } from './striperefreshurl.component';

describe('StriperefreshurlComponent', () => {
  let component: StriperefreshurlComponent;
  let fixture: ComponentFixture<StriperefreshurlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StriperefreshurlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StriperefreshurlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
