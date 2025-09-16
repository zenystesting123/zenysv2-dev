// import { DebugElement } from '@angular/core';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { BrowserModule, By } from '@angular/platform-browser';

// import { ContactComponent } from './contact.component';

// describe('ContactComponent', () => {
//   let comp: ContactComponent;
//   let fixture: ComponentFixture<ContactComponent>;
// let de:DebugElement;
// let el:HTMLElement;
//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [ ContactComponent ],
//       imports:[
//         BrowserModule,
//         FormsModule,
//         ReactiveFormsModule
//       ]
//     })
//     .compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(ContactComponent);
//     comp = fixture.componentInstance;
//     de=fixture.debugElement.query(By.css('form'));
//     el=de.nativeElement;
//     fixture.detectChanges();
//   });

//   // it(`should have text 'mypage' `, () => {
//   //   expect(comp.text1).toEqual('mypage');
//   // });
//   it('should submitted true ', () => {
//     comp.onSubmit();
//     expect(comp.submitted).toBeTruthy();
//   });
//   it('should call onSubmit method ', () => {
//     fixture.detectChanges();
//     let x=spyOn(comp,'onSubmit').and.callThrough();
//     el=fixture.debugElement.query(By.css('button')).nativeElement;
//     el.click();
//     expect(x).toHaveBeenCalledTimes(0);
//   });
//   it('form should be invalid', () => {
//     comp.contactForm.controls['name'].setValue(' ');
//     comp.contactForm.controls['text'].setValue(' ');
//     expect(comp.contactForm.valid).toBeFalsy();
//   });
//   it('form should be valid', () => {
//     comp.contactForm.controls['name'].setValue('nimisha');
//     comp.contactForm.controls['text'].setValue('text');
//     expect(comp.contactForm.valid).toBeTruthy();
//   });
 
// });


import {TestBed, ComponentFixture} from '@angular/core/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {MatFormFieldHarness} from '@angular/material/form-field/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import {MatFormFieldModule} from '@angular/material/form-field';

import {MatInputModule} from '@angular/material/input';
import {ReactiveFormsModule} from '@angular/forms';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputHarness} from '@angular/material/input/testing';
import { ContactComponent } from './contact.component';

describe('FormFieldHarnessExample', () => {
  let fixture: ComponentFixture<ContactComponent>;
  let loader: HarnessLoader;

  beforeAll(() => {
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, NoopAnimationsModule],
      declarations: [ContactComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(ContactComponent);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should be able to load harnesses', async () => {
    const formFields = await loader.getAllHarnesses(MatFormFieldHarness);
    expect(formFields.length).toBe(1);
  });

  it('should be able to get control of form-field', async () => {
    const formField = await loader.getHarness(MatFormFieldHarness);
    expect(await formField.getControl() instanceof MatInputHarness).toBe(true);
  });

 

  it('should be able to check if form field is invalid', async () => {
    const formField = await loader.getHarness(MatFormFieldHarness);
    expect(await formField.isControlValid()).toBe(true);

    fixture.componentInstance.requiredControl.setValue('');
    expect(await formField.isControlValid()).toBe(false);
  });
});


/**  Copyright 2020 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
