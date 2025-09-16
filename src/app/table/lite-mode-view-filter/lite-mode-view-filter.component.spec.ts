import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiteModeViewFilterComponent } from './lite-mode-view-filter.component';

describe('LiteModeViewFilterComponent', () => {
  let component: LiteModeViewFilterComponent;
  let fixture: ComponentFixture<LiteModeViewFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiteModeViewFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiteModeViewFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
