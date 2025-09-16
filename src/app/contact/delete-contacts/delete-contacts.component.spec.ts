import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteContactsComponent } from './delete-contacts.component';

describe('DeleteContactsComponent', () => {
  let component: DeleteContactsComponent;
  let fixture: ComponentFixture<DeleteContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteContactsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
