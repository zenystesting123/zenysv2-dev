import { DatacardSettingsService } from './datacard-settings.service';
import { ContactForm, ContactForms } from './../../data-models';
import { Subscription } from 'rxjs';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/common.service';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
export interface customForm {
  fieldName: string;
  fieldType: string;
  fieldRequired: boolean;

}
@Component({
  selector: 'app-datacard-settings',
  templateUrl: './datacard-settings.component.html',
  styleUrls: ['./datacard-settings.component.scss']
})

export class DatacardSettingsComponent implements OnInit {
  addNewField: boolean = false;
  fieldsValue: customForm[];
  superUserId: string;
  nameEdit: boolean = false;
  contactFormSubscription: Subscription;
  userDetailsSubscription: Subscription;
  contactForms: any = [];
  addNewForm: boolean = false;
  noItem: number = 0; // no of line item
  contactFormsArrayCurrent: any = [];
  defaultValue: string = "";
  categories: string = "";
  nameSaved: boolean = false;
  formValueFound:boolean=false;
  fieldName: string = "";
  onceLoader: boolean = false;
  additionalListDefaultForm1: FormGroup;//for storing additionalfields data while creating
  additionalListDefaultForm2: FormGroup;//for storing additionalfields data while creating
  additionalListDefaultForm3: FormGroup;//for storing additionalfields data while creating
  additionalListDefaultForm4: FormGroup;//for storing additionalfields data while creating
  editIndex: number;
  formNewName: string;
  editedField: boolean = false;
  newFormName: string;
  identify: any;
  editFname: any;//to store fieldname while editing
  editFieldType: any;//to store fieldtype while editing
  editMandatory: any;//to store set mandatory or not while editing
  editDefaultValue: any;//to store default value while editing
  editCategoriesOpn: any;//to store category options while editing
  mandatory: boolean;
  dummyValue: string = "abbba"
  currentTemplate: string;
  newField: ContactForm = {//to store values of additional field while editing and adding
    fieldName: null,//to store fields name
    fieldType: null,//to store the fields type
    categoriesOpn: null,//to store options if category type selected
    defaultValue: null,//to store default values
    mandatory: null,//to check where field is set as mandatory
    categories: null,//array to store options of category
  };
  lineItemForm: FormGroup; // form group for line item
  lineItem: ContactForms = {
    fieldName: null,//to store fields name
    fieldType: null,//to store the fields type
    categories: null,//to store options if category type selected
    description: null,//to store default values
    mandatory: null,//to check where field is set as mandatory
  }
  fieldType: string = "";
  selectedForm: string;
  contactFormsArray: any = []
  itemList: any = [this.lineItem]; // item list input
  constructor(
    public commonService: CommonService,
    private db: DatacardSettingsService,
    private ref: ChangeDetectorRef,
    private _snackBar: MatSnackBar, private location: Location
  ) {
    this.lineItemForm = new FormGroup({
      // initialize line item form
      itemList: new FormArray([]),
    });
  }

  ngOnInit(): void {

    this.userDetailsSubscription = this.commonService.userDatas.subscribe(
      (allData) => {
        if (allData) {
          this.superUserId = allData.userDetails.superUserId;
        }
        this.db.getAllContactForms(this.superUserId).subscribe(data => {
          let contactForm = data.map(e => {
            return {
              id: e.payload.doc.id,
              ...e.payload.doc.data() as {}
            };
          })
          this.contactFormsArray = contactForm
          if (!this.onceLoader) {
            this.contactFormsArrayCurrent = this.contactFormsArray[0]
            this.selectedForm = this.contactFormsArray[0]?.id
            this.itemList = this.contactFormsArrayCurrent?.form

            this.lineItemForm = new FormGroup({
              itemList: new FormArray([]),
            });
            if (this.contactFormsArray.length==0) {
              this.formValueFound=false
              this.itemList=[];
              var emptyPayOff = {
                description: null,
                fieldName: null,
                fieldType: null,
                categories: null,
                categoriesOpn: null,
                mandatory: false,
              };
              // push newly added item
              this.itemList.push(emptyPayOff);
              (<FormArray>this.lineItemForm.get('itemList')).push(
                this.createItemFormGroup(emptyPayOff)
              );
            }
            else{
           
              this.formValueFound=true
              this.itemList?.forEach((lineItem) =>
              (<FormArray>this.lineItemForm.get('itemList')).push(
                this.createItemFormGroup(lineItem)
              )
            );
            }
            // console.log(this.contactFormsArrayCurrent)
        


            this.onceLoader = true;
          }

        })

      })

  }


  addField() {
    this.addNewField = true;
  }
  cancelAddField() {
    this.addNewField = false;
  }
  onBack() {
    this.location.back();
  }
  editFormName() {
    this.nameEdit = true
    this.formNewName = this.contactFormsArrayCurrent.formName
  }
  saveFormName() {
    this.nameEdit = false
    this.db.updateContactFormName(this.superUserId, this.formNewName, this.selectedForm);
    this.contactFormsArrayCurrent.formName = this.formNewName
  }
  selectFormFn(selected, index) {
    this.addNewForm = false
    this.selectedForm = selected
    this.contactFormsArrayCurrent = this.contactFormsArray[index]
    this.itemList = this.contactFormsArrayCurrent.form
    this.lineItemForm = new FormGroup({
      itemList: new FormArray([]),
    });
    // console.log(this.contactFormsArrayCurrent.form)
    // console.log(this.contactFormsArrayCurrent)
    this.itemList.forEach((lineItem) =>
      (<FormArray>this.lineItemForm.get('itemList')).push(
        this.createItemFormGroup(lineItem)
      )
    );
  }
  // editField(i) {
  //   this.editIndex = i;

  //   this.editedField = true

  //   this.editFname = this.contactFormsArrayCurrent.form[i].fieldName
  //   this.editFieldType = this.contactFormsArrayCurrent.form[i].fieldType
  //   this.editMandatory = this.contactFormsArrayCurrent.form[i].mandatory
  //   this.editDefaultValue = this.contactFormsArrayCurrent.form[i].defaultValue
  //   this.editCategoriesOpn = this.contactFormsArrayCurrent.form[i].categoriesOpn

  // }
  saveData() {

    for (let i = 0; i < this.itemList.length; i++) {
      if (this.itemList[i].categories) {
        let options = this.itemList[i].categories.split(",");
        // optionArray.push(options.trim());
        this.itemList[i].categoriesOpn = options;
        // console.log(optionArray)
      }

    }
    this.db.updateContactForm(this.superUserId, this.itemList, this.selectedForm);
    this._snackBar.open('Form saved sucessfully', '', {
      duration: 2000,
    });

  }
  addForm() {
    this.selectedForm = ""
    this.addNewForm = true
  }
  saveNewFormName() {
    this.addNewForm = false;
    let contactFormLength = (this.contactFormsArray.length + 1);
    let contactForm = "contact-form" + contactFormLength;
    // console.log(this.newFormName,contactForm)
    this.nameSaved = true;
    this.db.saveFormName(this.superUserId, this.newFormName, contactForm).then(res => {
      console.log(res)
      this._snackBar.open('New form added sucessfully', '', {
        duration: 2000,
      });
      let arrayLength = (this.contactFormsArray.length - 1);
      this.selectedForm = this.contactFormsArray[arrayLength]?.id
      this.contactFormsArrayCurrent = this.contactFormsArray[arrayLength]
      // console.log(this.contactFormsArrayCurrent)
      // console.log(this.selectedForm)
      this.formValueFound=true
      this.itemList = this.contactFormsArrayCurrent.form
      this.lineItemForm = new FormGroup({
        itemList: new FormArray([]),
      });
      var emptyPayOff = {
        description: null,
        fieldName: null,
        fieldType: null,
        categories: null,
        categoriesOpn: null,
        mandatory: false,
      };
      // push newly added item
      this.itemList.push(emptyPayOff);
      (<FormArray>this.lineItemForm.get('itemList')).push(
        this.createItemFormGroup(emptyPayOff)
      );
    })


  }
  deleteField(index) {
    let fields = this.contactFormsArrayCurrent.form
    let deletedArray = fields.splice(index, 1)
    this.db.updateContactForm(this.superUserId, deletedArray, this.selectedForm);

  }
  deleteForm(id) {
    this.db.deleteContactForms(this.superUserId, id).then((res)=>{
      this.contactFormsArrayCurrent = this.contactFormsArray[0]
      this.selectedForm = this.contactFormsArray[0]?.id
      if(!this.selectedForm){
        this.formValueFound=false
      }
      this.itemList = this.contactFormsArrayCurrent?.form
      this.lineItemForm = new FormGroup({
        itemList: new FormArray([]),
      });

      // console.log(this.contactFormsArrayCurrent)
      this.itemList.forEach((lineItem) =>
        (<FormArray>this.lineItemForm.get('itemList')).push(
          this.createItemFormGroup(lineItem)
        )
      );
      // console.log(this.itemList)
    })


  }
  cancelEditField() {
    this.editedField = false
  }

  addFieldValue() {
    this.noItem += 1;
    var emptyPayOff = {
      description: null,
      fieldName: null,
      fieldType: null,
      categories: null,
      categoriesOpn: null,
      mandatory: false,
    };
    // push newly added item
    this.itemList.push(emptyPayOff);
    (<FormArray>this.lineItemForm.get('itemList')).push(
      this.createItemFormGroup(emptyPayOff)
    );
  }
  createItemFormGroup(lineItem) {


    return new FormGroup({
      fieldName: new FormControl(lineItem.fieldName),
      fieldType: new FormControl(lineItem.fieldType),
      categories: new FormControl(lineItem.categories),
      categoriesOpn: new FormControl(lineItem.categoriesOpn),
      description: new FormControl(lineItem.description),
      mandatory: new FormControl(lineItem.mandatory),
    });
  }
  deleteFieldValue(index: number) {
    // this.noItem -=1;
    this.itemList.splice(index, 1);
    (<FormArray>this.lineItemForm.get('itemList')).removeAt(index);
  }


}


