import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsreportComponent } from './contactsreport.component';

describe('ContactsreportComponent', () => {
  let component: ContactsreportComponent;
  let fixture: ComponentFixture<ContactsreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactsreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
