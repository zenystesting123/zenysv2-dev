import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatenamePlaceofsupplyComponent } from './statename-placeofsupply.component';

describe('StatenamePlaceofsupplyComponent', () => {
  let component: StatenamePlaceofsupplyComponent;
  let fixture: ComponentFixture<StatenamePlaceofsupplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatenamePlaceofsupplyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatenamePlaceofsupplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
