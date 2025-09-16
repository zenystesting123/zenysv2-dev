import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadSaleComponent } from './upload-sale.component';

describe('UploadSaleComponent', () => {
  let component: UploadSaleComponent;
  let fixture: ComponentFixture<UploadSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadSaleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
