import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComposemobileComponent } from './composemobile.component';

describe('ComposemobileComponent', () => {
  let component: ComposemobileComponent;
  let fixture: ComponentFixture<ComposemobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComposemobileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComposemobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
