import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnglishChannelSaleTab1Component } from './english-channel-sale-tab1.component';

describe('EnglishChannelSaleTab1Component', () => {
  let component: EnglishChannelSaleTab1Component;
  let fixture: ComponentFixture<EnglishChannelSaleTab1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnglishChannelSaleTab1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnglishChannelSaleTab1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
