import { DebugElement, NgModule } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserModule, By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbAccordion, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ColorPickerModule } from 'ngx-color-picker';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ToastrModule } from 'ngx-toastr';
import { Routes }  from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DocFormsComponent } from './doc-form.component';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { PortalModule } from '@angular/cdk/portal';
import { MatTreeModule } from '@angular/material/tree';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatStepperModule } from '@angular/material/stepper';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggle, MatButtonToggleGroup, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkTreeModule } from '@angular/cdk/tree';
import { NgxPrintModule } from 'ngx-print';
import { CommonModule } from '@angular/common';
import {HarnessLoader} from '@angular/cdk/testing';
import {MatFormFieldHarness} from '@angular/material/form-field/testing';
import {MatInputHarness} from '@angular/material/input/testing';
import {ContentContainerComponentHarness} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {DOWN_ARROW, ENTER, ESCAPE, RIGHT_ARROW, UP_ARROW} from '@angular/cdk/keycodes';

let comp: DocFormsComponent;
  let fixture: ComponentFixture<DocFormsComponent>;
  let loader: HarnessLoader;
  let de: DebugElement;
  let el: HTMLElement;
  var originalTimeout;
  let checkboxDebugElement: DebugElement;
  let checkboxNativeElement: HTMLElement;
  let checkboxInstance: MatCheckbox;
  let testComponent: DocFormsComponent;
  let inputElement: HTMLInputElement;
  let labelElement: HTMLLabelElement;
  let groupDebugElement: DebugElement;
  let buttonToggleDebugElements: DebugElement[];
  let groupInstance: MatButtonToggleGroup;
  let buttonToggleInstances: MatButtonToggle[];
 
  let groupNgModel: NgModel;
  let innerButtons: HTMLElement[];
  const SUPPORTS_INTL = typeof Intl != 'undefined';
describe('DocFormComponent', () => {
  
  beforeAll(() => {
    //TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
  });
  beforeEach(async () => {
  
    await TestBed.configureTestingModule({
      declarations: [DocFormsComponent],
      imports: [
        
        FormsModule,
        BrowserModule,
       
        ReactiveFormsModule,
        ImageCropperModule,
        MatBadgeModule,
        NgbModalModule,
        MatFormFieldModule,
        MatExpansionModule,
        BrowserAnimationsModule,
        
        NgbModule,
        ColorPickerModule,
        ToastrModule.forRoot(),
        BrowserDynamicTestingModule,
       // RouterTestingModule.withRoutes(routes),
        NgxPrintModule,

        BrowserModule.withServerTransition({ appId: 'serverApp' }),
        BrowserAnimationsModule,
        NgbModule,
        CommonModule,

        FormsModule,
      
        DragDropModule,
        MatAutocompleteModule,
        MatBottomSheetModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatStepperModule,
        MatDatepickerModule,
        MatDialogModule,
        MatDividerModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        MatTreeModule,

        PortalModule,
        ScrollingModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatRippleModule,

      ],
      providers: [

      ]


    })
      .compileComponents();
        
    fixture = TestBed.createComponent(DocFormsComponent);
    comp = fixture.componentInstance;

    loader = TestbedHarnessEnvironment.loader(fixture);
      
    de=fixture.debugElement;
    
    el=de.nativeElement;
    fixture.detectChanges();
  });

  
  // beforeEach(() => {
   //testComponent = fixture.debugElement.componentInstance;

  //     groupDebugElement = fixture.debugElement.query(By.directive(MatButtonToggleGroup))!;
  //     groupInstance = groupDebugElement.injector.get<MatButtonToggleGroup>(MatButtonToggleGroup);
  //     groupNgModel = groupDebugElement.injector.get<NgModel>(NgModel);

  //     buttonToggleDebugElements = fixture.debugElement.queryAll(By.directive(MatButtonToggle));
  //     buttonToggleInstances = buttonToggleDebugElements.map(debugEl => debugEl.componentInstance);
  //     innerButtons = buttonToggleDebugElements.map(
  //       debugEl => debugEl.query(By.css('button'))!.nativeElement);

  //     fixture.detectChanges();
  //   checkboxDebugElement = fixture.debugElement.query(By.directive(MatCheckbox))!;
  //     checkboxNativeElement = checkboxDebugElement.nativeElement;
  //     checkboxInstance = checkboxDebugElement.componentInstance;
  //     testComponent = fixture.debugElement.componentInstance;
  //     inputElement = <HTMLInputElement>checkboxNativeElement.querySelector('input');
  //     labelElement = <HTMLLabelElement>checkboxNativeElement.querySelector('label');
  // });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('supports textarea', fakeAsync(() => {
    //let fixture = createComponent(MatInputTextareaWithBindings);
   // fixture = TestBed.createComponent(MatInputTextareaWithBindings);
    fixture.detectChanges();

    const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
    expect(textarea).not.toBeNull();
  }));

  it('supports select', fakeAsync(() => {
    //const fixture = createComponent(MatInputSelect);
    fixture.detectChanges();
    const nativeSelect: HTMLTextAreaElement = fixture.nativeElement.querySelector('select');
    console.log(nativeSelect);
    expect(nativeSelect).not.toBeNull();
  }));
   it('supports date', fakeAsync(() => {
    //const fixture = createComponent(MatInputSelect);
    fixture.detectChanges();
    const nativeSelect: HTMLTextAreaElement = fixture.nativeElement.querySelector('datepicker');
    console.log(nativeSelect);
    expect(nativeSelect).not.toBeNull();
  }));

  // it('should update the placeholder when input entered', fakeAsync(() => {
  //   //let fixture = createComponent(MatInputWithStaticLabel);
  //   fixture.detectChanges();

  //   let inputEl = fixture.debugElement.query(By.css('input'))!;
  //   let labelEl = fixture.debugElement.query(By.css('label'))!.nativeElement;

  //   expect(labelEl.classList).toContain('mat-form-field-empty');
  //   expect(labelEl.classList).not.toContain('mat-form-field-float');

  //   // Update the value of the input.
  //   inputEl.nativeElement.value = 'Text';

  //   // Fake behavior of the `(input)` event which should trigger a change detection.
  //   fixture.detectChanges();

  //   expect(labelEl.classList).not.toContain('mat-form-field-empty');
  //   expect(labelEl.classList).not.toContain('mat-form-field-float');
  // }));


  // it('should update the placeholder when input entered', fakeAsync(() => {
  //   //let fixture = createComponent(MatInputWithStaticLabel);
  //   fixture.detectChanges();

  //   let inputEl = fixture.debugElement.query(By.css('input'))!;
  //   let labelEl = fixture.debugElement.query(By.css('label'))!.nativeElement;

  //   expect(labelEl.classList).toContain('mat-form-field-empty');
  //   expect(labelEl.classList).not.toContain('mat-form-field-float');

  //   // Update the value of the input.
  //   inputEl.nativeElement.value = 'Text';

  //   // Fake behavior of the `(input)` event which should trigger a change detection.
  //   fixture.detectChanges();

  //   expect(labelEl.classList).not.toContain('mat-form-field-empty');
  //   expect(labelEl.classList).not.toContain('mat-form-field-float');
  // }));
  // it('should set individual radio names based on the group name', () => {
  //   expect(groupInstance.name).toBeTruthy();
  //   for (let buttonToggle of buttonToggleInstances) {
  //     expect(buttonToggle.name).toBe(groupInstance.name);
  //   }

  //   groupInstance.name = 'new name';
  //   for (let buttonToggle of buttonToggleInstances) {
  //     expect(buttonToggle.name).toBe(groupInstance.name);
  //   }
  // });


  // it('should check the corresponding button toggle on a group value change', () => {
  //   expect(groupInstance.value).toBeFalsy();
  //   for (let buttonToggle of buttonToggleInstances) {
  //     expect(buttonToggle.checked).toBeFalsy();
  //   }

  //   groupInstance.value = 'red';
  //   for (let buttonToggle of buttonToggleInstances) {
  //     expect(buttonToggle.checked).toBe(groupInstance.value === buttonToggle.value);
  //   }

  //   const selected = groupInstance.selected as MatButtonToggle;

  //   expect(selected.value).toBe(groupInstance.value);
  // });

  // it('should have the correct FormControl state initially and after interaction',
  //   fakeAsync(() => {
  //     expect(groupNgModel.valid).toBe(true);
  //     expect(groupNgModel.pristine).toBe(true);
  //     expect(groupNgModel.touched).toBe(false);

  //     buttonToggleInstances[1].checked = true;
  //     fixture.detectChanges();
  //     tick();

  //     expect(groupNgModel.valid).toBe(true);
  //     expect(groupNgModel.pristine).toBe(true);
  //     expect(groupNgModel.touched).toBe(false);

  //     innerButtons[2].click();
  //     fixture.detectChanges();
  //     tick();

  //     expect(groupNgModel.valid).toBe(true);
  //     expect(groupNgModel.pristine).toBe(false);
  //     expect(groupNgModel.touched).toBe(true);
  //   }));

  // it('should update the ngModel value when selecting a button toggle', fakeAsync(() => {
  //   innerButtons[1].click();
  //   fixture.detectChanges();

  //   tick();

  //   //expect(testComponent.modelValue).toBe('green');
  // }));
  // it('should add and remove the checked state', () => {
  //   expect(checkboxInstance.checked).toBe(false);
  //   expect(checkboxNativeElement.classList).not.toContain('mat-checkbox-checked');
  //   expect(inputElement.checked).toBe(false);

  //   testComponent.isChecked = true;
  //   fixture.detectChanges();

  //   expect(checkboxInstance.checked).toBe(true);
  //   expect(checkboxNativeElement.classList).toContain('mat-checkbox-checked');
  //   expect(inputElement.checked).toBe(true);

  //   testComponent.isChecked = false;
  //   fixture.detectChanges();

  //   expect(checkboxInstance.checked).toBe(false);
  //   expect(checkboxNativeElement.classList).not.toContain('mat-checkbox-checked');
  //   expect(inputElement.checked).toBe(false);
  // });

  // it('should initialize with correct value shown in input', () => {
  //   if (SUPPORTS_INTL) {
  //     expect(fixture.nativeElement.querySelector('mat-datepicker').value).toBe('1/1/2020');
  //   }
  // });

  

  
  // it('should add and remove the checked state', () => {
  //   expect(checkboxInstance.checked).toBe(false);
  //   expect(checkboxNativeElement.classList).not.toContain('mat-checkbox-checked');
  //   expect(inputElement.checked).toBe(false);

  //   //testComponent.isChecked = true;
  //   fixture.detectChanges();

  //   expect(checkboxInstance.checked).toBe(true);
  //   expect(checkboxNativeElement.classList).toContain('mat-checkbox-checked');
  //   expect(inputElement.checked).toBe(true);

  //   testComponent.isCollapsed= false;
  //   fixture.detectChanges();

  //   expect(checkboxInstance.checked).toBe(false);
  //   expect(checkboxNativeElement.classList).not.toContain('mat-checkbox-checked');
  //   expect(inputElement.checked).toBe(false);
  // });

  // it('should render input elements', () => {
  //   const compiled = fixture.debugElement.nativeElement;
  //   const addressInput = compiled.querySelector('mat input[id="address"]');
  //   const nameInput = compiled.querySelector('mat input[id="name"]');

  //   expect(addressInput).toBeTruthy();
  //   expect(nameInput).toBeTruthy();
  // });
 

  // it('form should be invalid when empty', () => {
  //   expect(comp.gstForm.valid).toBeFalsy();
  // });
  // it('form should be invalid', () => {
  //       comp.gstForm.controls['name'].setValue('');
  //       //comp.gtForm.controls['text'].setValue(' ');
  //       expect(comp.gstForm.valid).toBeFalsy();
  //     });
  // it('should call method  ', () => {
  //   fixture.detectChanges();
  //   let x=spyOn(comp,'addFieldValue').and.callThrough();
  //   el=fixture.debugElement.query(By.css('button')).nativeElement;
  //   el.click();
  //   expect(x).toHaveBeenCalledTimes(0);
  // });


  // it('should not be empty after input entered', fakeAsync(() => {

  //   fixture.detectChanges();

  //   let inputEl = fixture.debugElement.query(By.css('input'))!;
  //   let el = fixture.debugElement.query(By.css('label'))!.nativeElement;
  //   expect(el).not.toBeNull();
  //   expect(el.classList.contains('mat-form-field-empty')).toBe(true, 'should be empty');

  //   inputEl.nativeElement.value = 'hello';
  //   // Simulate input event.
  //   inputEl.triggerEventHandler('input', {target: inputEl.nativeElement});
  //   fixture.detectChanges();

  //   el = fixture.debugElement.query(By.css('label'))!.nativeElement;
  //   expect(el.classList.contains('mat-form-field-empty')).toBe(false, 'should not be empty');
  // }));

  // it('should update the placeholder when input entered', fakeAsync(() => {
  // ;
  //   fixture.detectChanges();

  //   let inputEl = fixture.debugElement.query(By.css('input'))!;
  //   let labelEl = fixture.debugElement.query(By.css('label'))!.nativeElement;

  //   expect(labelEl.classList).toContain('mat-form-field-empty');
  //   expect(labelEl.classList).not.toContain('mat-form-field-float');

  //   // Update the value of the input.
  //   inputEl.nativeElement.value = 'Text';

  //   // Fake behavior of the `(input)` event which should trigger a change detection.
  //   fixture.detectChanges();

  //   expect(labelEl.classList).not.toContain('mat-form-field-empty');
  //   expect(labelEl.classList).not.toContain('mat-form-field-float');
  // }));
   
 
});


function routes(routes: any): any {
  throw new Error('Function not implemented.');
}
// describe("jhh0",()=>{
//   it('should be able to load harnesses', async () => {
//       fixture.detectChanges();
//       const formFields = await loader.getAllHarnesses(MatFormFieldHarness);
//       expect(formFields.length).toBe(1);
//     });
//     it('should be able to get control of form-field', async () => {
//       fixture.detectChanges();
//       const formField = await loader.getHarness(MatFormFieldHarness);
//       expect(formField.getControl()instanceof MatInputHarness).toBe(true);
//     });
  
//     it('should be able to get error messages and hints of form-field', async () => {
//       const formField = await loader.getHarness(MatFormFieldHarness);
//       expect(await formField.getTextErrors()).toEqual([]);
//       expect(await formField.getTextHints()).toEqual(['Hint']);
  
//       fixture.componentInstance.requiredControl.setValue('');
//       await (await formField.getControl())?.blur();
//       expect(await formField.getTextErrors()).toEqual(['Error']);
//       expect(await formField.getTextHints()).toEqual([]);
//     });
  
//     it('should be able to check if form field is invalid', async () => {
    
//       const formField =  await loader.getHarness(MatFormFieldHarness);
//       fixture.detectChanges();
//       expect(await formField.isControlValid()).toBe(true);
    
//       fixture.componentInstance.requiredControl.setValue('');
//       fixture.detectChanges();
//       expect(await formField.isControlValid()).toBe(false);
//     });
   
// })
