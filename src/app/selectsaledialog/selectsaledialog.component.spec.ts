import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectsaledialogComponent } from './selectsaledialog.component';

describe('SelectsaledialogComponent', () => {
  let component: SelectsaledialogComponent;
  let fixture: ComponentFixture<SelectsaledialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectsaledialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectsaledialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
