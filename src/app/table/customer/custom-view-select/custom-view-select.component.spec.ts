import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomViewSelectComponent } from './custom-view-select.component';

describe('CustomViewSelectComponent', () => {
  let component: CustomViewSelectComponent;
  let fixture: ComponentFixture<CustomViewSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomViewSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomViewSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
