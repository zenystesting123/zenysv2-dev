import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveredToPreviewComponent } from './delivered-to-preview.component';

describe('DeliveredToPreviewComponent', () => {
  let component: DeliveredToPreviewComponent;
  let fixture: ComponentFixture<DeliveredToPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveredToPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveredToPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
