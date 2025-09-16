import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonCurrencyComponent } from './common-currency.component';

describe('CommonCurrencyComponent', () => {
  let component: CommonCurrencyComponent;
  let fixture: ComponentFixture<CommonCurrencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonCurrencyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
