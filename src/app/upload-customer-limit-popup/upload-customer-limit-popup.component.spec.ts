import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadCustomerLimitPopupComponent } from './upload-customer-limit-popup.component';

describe('UploadCustomerLimitPopupComponent', () => {
  let component: UploadCustomerLimitPopupComponent;
  let fixture: ComponentFixture<UploadCustomerLimitPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadCustomerLimitPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadCustomerLimitPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
