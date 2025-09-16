import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullchatComponent } from './fullchat.component';

describe('FullchatComponent', () => {
  let component: FullchatComponent;
  let fixture: ComponentFixture<FullchatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullchatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FullchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
