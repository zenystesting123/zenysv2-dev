import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallViewAudioPlayerComponent } from './call-view-audio-player.component';

describe('CallViewAudioPlayerComponent', () => {
  let component: CallViewAudioPlayerComponent;
  let fixture: ComponentFixture<CallViewAudioPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallViewAudioPlayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CallViewAudioPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
