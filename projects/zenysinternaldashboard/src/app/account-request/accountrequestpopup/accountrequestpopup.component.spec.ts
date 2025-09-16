import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountrequestpopupComponent } from './accountrequestpopup.component';

describe('AccountrequestpopupComponent', () => {
  let component: AccountrequestpopupComponent;
  let fixture: ComponentFixture<AccountrequestpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountrequestpopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountrequestpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
