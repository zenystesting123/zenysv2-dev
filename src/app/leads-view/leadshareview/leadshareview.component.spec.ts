import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadshareviewComponent } from './leadshareview.component';

describe('LeadshareviewComponent', () => {
  let component: LeadshareviewComponent;
  let fixture: ComponentFixture<LeadshareviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadshareviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadshareviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
