import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FunctionstesterComponent } from './functionstester.component';

describe('FunctionstesterComponent', () => {
  let component: FunctionstesterComponent;
  let fixture: ComponentFixture<FunctionstesterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FunctionstesterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FunctionstesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
