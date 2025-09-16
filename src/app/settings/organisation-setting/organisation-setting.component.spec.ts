import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationSettingComponent } from './organisation-setting.component';

describe('OrganisationSettingComponent', () => {
  let component: OrganisationSettingComponent;
  let fixture: ComponentFixture<OrganisationSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganisationSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
