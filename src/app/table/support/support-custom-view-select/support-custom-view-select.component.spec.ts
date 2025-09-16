import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportCustomViewSelectComponent } from './support-custom-view-select.component';

describe('SupportCustomViewSelectComponent', () => {
  let component: SupportCustomViewSelectComponent;
  let fixture: ComponentFixture<SupportCustomViewSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportCustomViewSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportCustomViewSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
