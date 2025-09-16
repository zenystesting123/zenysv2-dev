import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectcustsaleComponent } from './selectcustsale.component';

describe('SelectcustsaleComponent', () => {
  let component: SelectcustsaleComponent;
  let fixture: ComponentFixture<SelectcustsaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectcustsaleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectcustsaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
