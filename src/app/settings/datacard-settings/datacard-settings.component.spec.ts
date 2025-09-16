import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatacardSettingsComponent } from './datacard-settings.component';

describe('DatacardSettingsComponent', () => {
  let component: DatacardSettingsComponent;
  let fixture: ComponentFixture<DatacardSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatacardSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatacardSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
