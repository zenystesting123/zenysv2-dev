import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadshareComponent } from './leadshare.component';

describe('LeadshareComponent', () => {
  let component: LeadshareComponent;
  let fixture: ComponentFixture<LeadshareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadshareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadshareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
