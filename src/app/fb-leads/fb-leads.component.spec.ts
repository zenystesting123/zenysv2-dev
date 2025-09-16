import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FbLeadsComponent } from './fb-leads.component';

describe('FbLeadsComponent', () => {
  let component: FbLeadsComponent;
  let fixture: ComponentFixture<FbLeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FbLeadsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FbLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
