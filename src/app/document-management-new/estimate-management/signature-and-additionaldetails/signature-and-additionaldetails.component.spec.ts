import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureAndAdditionaldetailsComponent } from './signature-and-additionaldetails.component';

describe('SignatureAndAdditionaldetailsComponent', () => {
  let component: SignatureAndAdditionaldetailsComponent;
  let fixture: ComponentFixture<SignatureAndAdditionaldetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignatureAndAdditionaldetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureAndAdditionaldetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
