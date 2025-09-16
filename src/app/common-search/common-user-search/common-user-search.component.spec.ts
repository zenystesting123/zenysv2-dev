import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonUserSearchComponent } from './common-user-search.component';

describe('CommonUserSearchComponent', () => {
  let component: CommonUserSearchComponent;
  let fixture: ComponentFixture<CommonUserSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonUserSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonUserSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
