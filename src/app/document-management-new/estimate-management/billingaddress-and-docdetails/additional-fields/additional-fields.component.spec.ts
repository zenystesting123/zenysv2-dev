import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalFieldsComponent } from './additional-fields.component';

describe('AdditionalFieldsComponent', () => {
  let component: AdditionalFieldsComponent;
  let fixture: ComponentFixture<AdditionalFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalFieldsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
