import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptCustomfieldsComponent } from './script-customfields.component';

describe('ScriptCustomfieldsComponent', () => {
  let component: ScriptCustomfieldsComponent;
  let fixture: ComponentFixture<ScriptCustomfieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScriptCustomfieldsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScriptCustomfieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
