import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addnewsale1Component } from './addnewsale1.component';

describe('Addnewsale1Component', () => {
  let component: Addnewsale1Component;
  let fixture: ComponentFixture<Addnewsale1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Addnewsale1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Addnewsale1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
