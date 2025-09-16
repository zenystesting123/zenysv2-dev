import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocSettingsBottomSheetComponent } from './doc-settings-bottom-sheet.component';

describe('DocSettingsBottomSheetComponent', () => {
  let component: DocSettingsBottomSheetComponent;
  let fixture: ComponentFixture<DocSettingsBottomSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocSettingsBottomSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocSettingsBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
