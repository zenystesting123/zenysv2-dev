import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllpayssubsComponent } from './allpayssubs.component';

describe('AllpayssubsComponent', () => {
  let component: AllpayssubsComponent;
  let fixture: ComponentFixture<AllpayssubsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllpayssubsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllpayssubsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
