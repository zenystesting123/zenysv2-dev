import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchableDatePickerComponent } from './searchable-date-picker.component';

describe('SearchableDatePickerComponent', () => {
  let component: SearchableDatePickerComponent;
  let fixture: ComponentFixture<SearchableDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchableDatePickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchableDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
