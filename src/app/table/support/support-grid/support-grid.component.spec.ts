import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportGridComponent } from './support-grid.component';

describe('SupportGridComponent', () => {
  let component: SupportGridComponent;
  let fixture: ComponentFixture<SupportGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
