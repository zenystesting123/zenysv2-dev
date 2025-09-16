import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalfieldCommonComponent } from './additionalfield-common.component';

describe('AdditionalfieldCommonComponent', () => {
  let component: AdditionalfieldCommonComponent;
  let fixture: ComponentFixture<AdditionalfieldCommonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalfieldCommonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalfieldCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
