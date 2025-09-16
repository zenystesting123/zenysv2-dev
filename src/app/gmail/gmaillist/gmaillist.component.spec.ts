import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmaillistComponent } from './gmaillist.component';

describe('GmaillistComponent', () => {
  let component: GmaillistComponent;
  let fixture: ComponentFixture<GmaillistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GmaillistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GmaillistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
