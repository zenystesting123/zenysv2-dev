import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonOrgTagComponent } from './common-org-tag.component';

describe('CommonOrgTagComponent', () => {
  let component: CommonOrgTagComponent;
  let fixture: ComponentFixture<CommonOrgTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonOrgTagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonOrgTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
