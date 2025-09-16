import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubUserChatComponent } from './sub-user-chat.component';

describe('SubUserChatComponent', () => {
  let component: SubUserChatComponent;
  let fixture: ComponentFixture<SubUserChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubUserChatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubUserChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
