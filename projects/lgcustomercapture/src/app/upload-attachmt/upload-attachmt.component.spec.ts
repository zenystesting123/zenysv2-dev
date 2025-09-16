import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadAttachmtComponent } from './upload-attachmt.component';

describe('UploadAttachmtComponent', () => {
  let component: UploadAttachmtComponent;
  let fixture: ComponentFixture<UploadAttachmtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadAttachmtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadAttachmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
