import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterPreviewComponent } from './footer-preview.component';

describe('FooterPreviewComponent', () => {
  let component: FooterPreviewComponent;
  let fixture: ComponentFixture<FooterPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
