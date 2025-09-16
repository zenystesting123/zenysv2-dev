import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesettingsComponent } from './salesettings.component';

describe('SalesettingsComponent', () => {
  let component: SalesettingsComponent;
  let fixture: ComponentFixture<SalesettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
