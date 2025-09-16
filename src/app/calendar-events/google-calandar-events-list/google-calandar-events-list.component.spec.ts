import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleCalandarEventsListComponent } from './google-calandar-events-list.component';

describe('GoogleCalandarEventsListComponent', () => {
  let component: GoogleCalandarEventsListComponent;
  let fixture: ComponentFixture<GoogleCalandarEventsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoogleCalandarEventsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleCalandarEventsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
