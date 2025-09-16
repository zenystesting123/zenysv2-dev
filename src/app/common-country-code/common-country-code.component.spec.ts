import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonCountryCodeComponent } from './common-country-code.component';

describe('CommonCountryCodeComponent', () => {
  let component: CommonCountryCodeComponent;
  let fixture: ComponentFixture<CommonCountryCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonCountryCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonCountryCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
