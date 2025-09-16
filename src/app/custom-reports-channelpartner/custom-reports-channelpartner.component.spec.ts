import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomReportsChannelpartnerComponent } from './custom-reports-channelpartner.component';

describe('CustomReportsChannelpartnerComponent', () => {
  let component: CustomReportsChannelpartnerComponent;
  let fixture: ComponentFixture<CustomReportsChannelpartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomReportsChannelpartnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomReportsChannelpartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
