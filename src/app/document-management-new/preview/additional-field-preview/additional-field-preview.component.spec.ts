import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalFieldPreviewComponent } from './additional-field-preview.component';

describe('AdditionalFieldPreviewComponent', () => {
  let component: AdditionalFieldPreviewComponent;
  let fixture: ComponentFixture<AdditionalFieldPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalFieldPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalFieldPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
