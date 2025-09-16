import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowemailthreadComponent } from './showemailthread.component';

describe('ShowemailthreadComponent', () => {
  let component: ShowemailthreadComponent;
  let fixture: ComponentFixture<ShowemailthreadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowemailthreadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowemailthreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
