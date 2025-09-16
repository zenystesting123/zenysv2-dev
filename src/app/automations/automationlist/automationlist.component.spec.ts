import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomationlistComponent } from './automationlist.component';

describe('AutomationlistComponent', () => {
  let component: AutomationlistComponent;
  let fixture: ComponentFixture<AutomationlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutomationlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomationlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
