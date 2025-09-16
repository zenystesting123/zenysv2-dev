import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportGridViewComponent } from './support-grid-view.component';

describe('SupportGridViewComponent', () => {
  let component: SupportGridViewComponent;
  let fixture: ComponentFixture<SupportGridViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportGridViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportGridViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
