import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewprintComponent } from './previewprint.component';

describe('PreviewprintComponent', () => {
  let component: PreviewprintComponent;
  let fixture: ComponentFixture<PreviewprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewprintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
