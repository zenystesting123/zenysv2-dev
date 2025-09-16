import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolBarSearchComponent } from './tool-bar-search.component';

describe('ToolBarSearchComponent', () => {
  let component: ToolBarSearchComponent;
  let fixture: ComponentFixture<ToolBarSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolBarSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolBarSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
