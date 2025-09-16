import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatsheadComponent } from './chatshead.component';

describe('ChatsheadComponent', () => {
  let component: ChatsheadComponent;
  let fixture: ComponentFixture<ChatsheadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatsheadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatsheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
