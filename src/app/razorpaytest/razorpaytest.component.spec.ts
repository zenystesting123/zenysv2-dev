import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RazorpaytestComponent } from './razorpaytest.component';

describe('RazorpaytestComponent', () => {
  let component: RazorpaytestComponent;
  let fixture: ComponentFixture<RazorpaytestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RazorpaytestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RazorpaytestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
