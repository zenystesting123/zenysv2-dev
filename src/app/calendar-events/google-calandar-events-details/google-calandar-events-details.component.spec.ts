import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleCalandarEventsDetailsComponent } from './google-calandar-events-details.component';

describe('GoogleCalandarEventsDetailsComponent', () => {
  let component: GoogleCalandarEventsDetailsComponent;
  let fixture: ComponentFixture<GoogleCalandarEventsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoogleCalandarEventsDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleCalandarEventsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
