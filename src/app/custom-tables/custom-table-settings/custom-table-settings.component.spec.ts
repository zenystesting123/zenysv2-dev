import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTableSettingsComponent } from './custom-table-settings.component';

describe('CustomTableSettingsComponent', () => {
  let component: CustomTableSettingsComponent;
  let fixture: ComponentFixture<CustomTableSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomTableSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomTableSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
