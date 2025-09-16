import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonBranchComponent } from './common-branch.component';

describe('CommonBranchComponent', () => {
  let component: CommonBranchComponent;
  let fixture: ComponentFixture<CommonBranchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonBranchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
