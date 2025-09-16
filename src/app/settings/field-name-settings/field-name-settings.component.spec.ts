import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldNameSettingsComponent } from './field-name-settings.component';

describe('FieldNameSettingsComponent', () => {
  let component: FieldNameSettingsComponent;
  let fixture: ComponentFixture<FieldNameSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldNameSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldNameSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
