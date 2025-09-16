import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMailthreadComponent } from './show-mailthread.component';

describe('ShowMailthreadComponent', () => {
  let component: ShowMailthreadComponent;
  let fixture: ComponentFixture<ShowMailthreadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowMailthreadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowMailthreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
