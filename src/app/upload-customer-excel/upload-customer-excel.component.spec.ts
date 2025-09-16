import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadCustomerExcelComponent } from './upload-customer-excel.component';

describe('UploadCustomerExcelComponent', () => {
  let component: UploadCustomerExcelComponent;
  let fixture: ComponentFixture<UploadCustomerExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadCustomerExcelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadCustomerExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
