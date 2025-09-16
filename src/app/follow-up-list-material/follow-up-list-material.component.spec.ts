import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowUpListMaterialComponent } from './follow-up-list-material.component';

describe('FollowUpListMaterialComponent', () => {
  let component: FollowUpListMaterialComponent;
  let fixture: ComponentFixture<FollowUpListMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowUpListMaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowUpListMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
