import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservableTableComponent } from './observable-table.component';

describe('ObservableTableComponent', () => {
  let component: ObservableTableComponent;
  let fixture: ComponentFixture<ObservableTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObservableTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservableTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
