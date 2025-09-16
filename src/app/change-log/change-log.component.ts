/*********************************************************************************
  Description: Component used for accepting previous and updated values from various 
    components and generating a changelog object to save in database
  Inputs: 
    constructorName: string – Component name from which the change was made
    userId: string – user's id, responsible for the change
    userName: string – user's name, responsible for the change
    previousValues: any – values before change. Can be an object or a FormGroup
    currentValues: any - updated values. Can be an object or a FormGroup
    changeLog: any – current changeLog object fetched from db
  Outputs:
    changeLog: any – new changeLog object after adding the changes
      {
        changesFrom: constructorName,       //Component name from which the change was made
        changedBy: userId,                  //current userId
        changedByName: userName,            //current username
        previousValues: {status: Lead},     //values before change
        currentValues: {status: Prospect},  //updated values
        dateModified: new Date().getTime(), //timestamp when change was made
	    };

***********************************************************************************/
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { formatDate } from '@angular/common';
import { Pipelines } from '../model/pipeline.modal';
@Component({
  selector: 'app-change-log',
  templateUrl: './change-log.component.html',
  styleUrls: ['./change-log.component.scss'],
})
export class ChangeLogComponent implements OnInit {
  static prevKey1: any; //to store the current control in previous values
  static prevKey2: any; //to store the current control in current values

  constructor(private fb: FormBuilder) {}

  //function to generate new changelog object with updated changes
  //Used when we are manually providing the changes from anywhere other than a reactive form.
  static saveLog(
    constructorName: string,
    userId: string,
    userName: string,
    previousValues,
    currentValues,
    changeLog
  ) {
    //set changeLog object as empty object if passed object is undefined
    if (changeLog == undefined) changeLog = {};
    //get the current length of changeLog
    const changeLogLen = Object.keys(changeLog).length;
    //write the changes obtained through parameters, on the current length of the object to get 
    //the modified changeLog appended with the latest change
    changeLog[changeLogLen] = {
      changesFrom: constructorName,
      changedBy: userId,
      changedByName: userName,
      previousValues: previousValues,
      currentValues: currentValues,
      dateModified: new Date().getTime(),
    };
    //return the modified changeLog object
    return changeLog;
  }
  //function to generate changelog for reactive forms
  static saveLogReactiveForm(
    constructorName: string,
    userId: string,
    userName: string,
    previousForm: FormGroup,
    currentForm: FormGroup,
    changeLog: any,
    additionalData: any
  ) {
    //get previous values of the form as object by passing previousForm as FormGroup
    let previousValues = this.getPreviousValues(previousForm, currentForm);
    //get current values of the form as object by passing currentForm as FormGroup
    let currentValues = this.getCurrentValues(currentForm);
    
    //additionalData: contains all changes that are not passed as controls through the form
    //additionalData: contains products added, deleted and assignedTo info
    //Values passed through additionalData object are now taken separately and changes are added to currentValues and previousValues objects

    //if additionalData has assignedTo current value, add it to currentValues
    if (additionalData.curAssignedTo?.assignedTo != null) {
      currentValues = Object.assign(currentValues, {
        assignedToName: additionalData.curAssignedTo.assignedToName,
        assignedTo: additionalData.curAssignedTo.assignedTo,
      });
      //previous values are also added to previousValues object
      previousValues = Object.assign(previousValues, {
        assignedToName: additionalData.prevAssignedTo.assignedToName,
        assignedTo: additionalData.prevAssignedTo.assignedTo,
      });
    }

    //country code changes from organisation module are added to currentValues and previousValues
    if (additionalData.curCode) {
      if (additionalData.curCode.code != null) {
        currentValues = Object.assign(currentValues, {
          code: additionalData.curCode.code,
        });
        previousValues = Object.assign(previousValues, {
          code: additionalData.prevCode.code,
        });
      }
    }
    //countryCode values passed from other modules are added to currentValues and previousValues
    if (additionalData.curCountryCode) {
      if (additionalData.curCountryCode.countryCode != null) {
        currentValues = Object.assign(currentValues, {
          countryCode: additionalData.curCountryCode.countryCode,
        });
        previousValues = Object.assign(previousValues, {
          countryCode: additionalData.prevCountryCode.countryCode,
        });
      }
    }
    //alternate contact code changes are added to currentValues and previousValues
    if (additionalData.curAltContactCode) {
      if (additionalData.curAltContactCode.altCountryCode != null) {
        currentValues = Object.assign(currentValues, {
          altCountryCode: additionalData.curAltContactCode.altCountryCode,
        });
        previousValues = Object.assign(previousValues, {
          altCountryCode: additionalData.prevAltContactCode.altCountryCode,
        });
      }
    }

    //associated branch values are added to currentValues and previousValues
    if (additionalData.currentAssBranch != null) {
      currentValues = Object.assign(currentValues, {
        associatedBranch: additionalData.currentAssBranch,
      });
      previousValues = Object.assign(previousValues, {
        associatedBranch: additionalData.previousAssBranch,
      });
    }
    //organisation id values are added to currentValues and previousValues
    if (additionalData.currentOrgId != null) {
      currentValues = Object.assign(currentValues, {
        orgId: additionalData.currentOrgId.orgId,
        companyName: additionalData.currentOrgId.companyName,
      });
      previousValues = Object.assign(previousValues, {
        orgId: additionalData.prevOrgId.orgId,
        companyName: additionalData.prevOrgId.companyName,
      });
    }
    //adding contact name which is not passed through reactive form to currentValues and previousValues 
    if (additionalData.currentContact != null) {
      //contact full name is obtained through selectedcust
      currentValues = Object.assign(currentValues, {
        selectedCust: additionalData.currentContact.selectedCust,
      });
      //previous contact name
      previousValues = Object.assign(previousValues, {
        selectedCust: additionalData.prevContact.selectedCust,
        
      });
    }
    // if new products added in sale popup, include it in currentValues and previous values as addedProducts
    if (additionalData.addedProducts) {
      if (Object.keys(additionalData.addedProducts).length > 0) {
        currentValues = Object.assign(currentValues, {
          addedProducts: additionalData.addedProducts,
        });
      }
    }

    //if products are deleted in sale popup, include it in currentValues and previous values as deletedProducts
    if (additionalData.deletedProducts) {
      if (Object.keys(additionalData.deletedProducts).length > 0) {
        currentValues = Object.assign(currentValues, {
          deletedProducts: additionalData.deletedProducts,
        });
      }
    }

    // if new attachments are added through popups, include in currentValues and previousValues as addedAttachments
    if (additionalData.addedAttachments) {
      if (Object.keys(additionalData.addedAttachments).length > 0) {
        currentValues = Object.assign(currentValues, {
          addedAttachments: additionalData.addedAttachments,
        });
      }
    }
    // if attachments are deleted, include in currentValues and previousValues as deletedAttachments
    if (additionalData.deletedAttachments) {
      if (Object.keys(additionalData.deletedAttachments).length > 0) {
        currentValues = Object.assign(currentValues, {
          deletedAttachments: additionalData.deletedAttachments,
        });
      }
    }

    // if new comments are added through popup, include in currentValues and previousValues as addedComments
    if (additionalData.addedComments) {
      if (Object.keys(additionalData.addedComments).length > 0) {
        currentValues = Object.assign(currentValues, {
          addedComments: additionalData.addedComments,
        });
      }
    }

    //if comments are deleted through popup, include in currentValues and previousValues as deletedComments
    if (additionalData.deletedComments) {
      if (Object.keys(additionalData.deletedComments).length > 0) {
        currentValues = Object.assign(currentValues, {
          deletedComments: additionalData.deletedComments,
        });
      }
    }
    if (additionalData.curComments && additionalData.prevComments) {
      if (
        Object.keys(additionalData.curComments).length ==
        Object.keys(additionalData.prevComments).length
      ) {
        if (additionalData.curComments) {
          if (Object.keys(additionalData.curComments).length > 0) {
            currentValues = Object.assign(currentValues, {
              comments: additionalData.curComments,
            });
          }
        }

        if (additionalData.prevComments) {
          if (Object.keys(additionalData.prevComments).length > 0) {
            previousValues = Object.assign(previousValues, {
              comments: additionalData.prevComments,
            });
          }
        }
      }
    }
    //Following is the section to handle pipeline names and status names in changelog. 
    //We always get the pipelineId and status Id of respective fields from the reactive form. 
    //Now we need to store their names in changeLog object. 
    //For that we obtain pipeLineArray, the complete pipelines collection values for respective modules by passing them through the additionalData object.
    let pipelineArray: Pipelines[] = [];
    if (additionalData.pipelineArray) {
      pipelineArray = additionalData.pipelineArray;
    }
    //get sale pipeline name by calling the function this.getPipelineName() by passing the pipelineArray
    //get previous sale pipeline value to be displayed as text
    if (previousValues['selectedSalePipeline'])
      previousValues['selectedSalePipeline'] = this.getPipelineName(
        previousValues['selectedSalePipeline'],
        pipelineArray
      );
    //get current sale pipeline value to be displayed as text
    if (currentValues['selectedSalePipeline'])
      currentValues['selectedSalePipeline'] = this.getPipelineName(
        currentValues['selectedSalePipeline'],
        pipelineArray
      );
    //get previous contact pipeline value to be displayed as text
    if (previousValues['selectedContactPipeline'])
      previousValues['selectedContactPipeline'] = this.getPipelineName(
        previousValues['selectedContactPipeline'],
        pipelineArray
      );
    //get current contact pipeline value to be displayed as text
    if (currentValues['selectedContactPipeline'])
      currentValues['selectedContactPipeline'] = this.getPipelineName(
        currentValues['selectedContactPipeline'],
        pipelineArray
      );
    //get previous service pipeline value to be displayed as text
    if (previousValues['selectedServPipeline'])
      previousValues['selectedServPipeline'] = this.getPipelineName(
        previousValues['selectedServPipeline'],
        pipelineArray
      );
    //get current service pipeline value to be displayed as text
    if (currentValues['selectedServPipeline'])
      currentValues['selectedServPipeline'] = this.getPipelineName(
        currentValues['selectedServPipeline'],
        pipelineArray
      );

    //Similarly get status names by calling this.getStatusName().
    //Here we have a variable name conflict in CrudModal1Component & FollowupTaskCreateComponent, since in that popups also we have field named ‘status’. 
    //If this condition check is not provided, status values in task and followup will be overwritten
    if (
      previousValues['status'] &&
      constructorName != 'CrudModal1Component' &&
      constructorName != 'FollowupTaskCreateComponent'
    )
    //get previous contact status value to be displayed as text
      previousValues['status'] = this.getStatusName(
        previousValues['status'],
        pipelineArray
      );
    //get current contact status value to be displayed as text
    if (
      currentValues['status'] &&
      constructorName != 'CrudModal1Component' &&
      constructorName != 'FollowupTaskCreateComponent'
    )
      currentValues['status'] = this.getStatusName(
        currentValues['status'],
        pipelineArray
      );
    //get previous sale stage value to be displayed as text
    if (previousValues['salesStage'])
      previousValues['salesStage'] = this.getStatusName(
        previousValues['salesStage'],
        pipelineArray
      );
    //get current sale stage value to be displayed as text
    if (currentValues['salesStage'])
      currentValues['salesStage'] = this.getStatusName(
        currentValues['salesStage'],
        pipelineArray
      );
    //get previous service stage value to be displayed as text
    if (previousValues['servicesStage'])
      previousValues['servicesStage'] = this.getStatusName(
        previousValues['servicesStage'],
        pipelineArray
      );
    //get current service stage value to be displayed as text
    if (currentValues['servicesStage'])
      currentValues['servicesStage'] = this.getStatusName(
        currentValues['servicesStage'],
        pipelineArray
      );

    //check if current values and previous values are of same value, ie there is no change in previous and current values, 
    //if it is there, we need to eliminate it by calling this.eliminateSameValues().
    let objVal = this.eliminateSameValues(previousValues, currentValues);
    //get the return values from the above function and separate previous values and current values
    previousValues = objVal['previousValues'];
    currentValues = objVal['currentValues'];

    //check if changes are present by comparing previousValues and currentValues, log if changes are there else return null
    if (
      Object.keys(currentValues).length == 0 &&
      Object.keys(previousValues).length == 0
    ) {
      return null;
    } else {
        //if changeLog is undefined, return empty object 
        if (changeLog == undefined) changeLog = {};
        //add the generated changes to the existing changeLog object
        const changeLogLen = Object.keys(changeLog).length;
        changeLog[changeLogLen] = {
          changesFrom: constructorName,
          changedBy: userId,
          changedByName: userName,
          previousValues: previousValues,
          currentValues: currentValues,
          dateModified: new Date().getTime(),
        };
        //return the changeLog
        return changeLog;
    }
  }

  //convert the previous form data to a json object based on changes in the form
  static getPreviousValues(previousForm: any, currentForm: any) {
    let previousValues = {};
    Object.keys(currentForm.controls).forEach((key1) => {
      //Skip the following fields. These fields are not shown in the changeLog and hence not stored in changeLog object. 
      //If you need to skip any fields that are obtained with the reactive form, do it here
      if (
        key1 == 'selectedProduct' ||
        key1 == 'selProdCat' ||
        key1 == 'commentTask' ||
        key1 == 'saleOrServ' ||
        key1 == 'isCompany' ||
        key1 == 'comments' ||
        key1 == 'itemErrorMessage' ||
        key1 == 'qtyErrorMessage' ||
        key1 == 'rateErrorMessage' ||
        key1 == 'sgstPercentageErrorMessage' ||
        key1 == 'cgstPercentageErrorMessage' ||
        key1 == 'igstPercentageErrorMessage' ||
        key1 == 'cessPercentageErrorMessage' ||
        key1 == 'discountPercentageErrorMessage' ||
        key1 == 'vatPercentageErrorMessage' ||
        key1 == 'amountInclTax' ||
        key1 == 'vatPercentage' ||
        key1 == 'showDeleteButton' ||
        key1 == 'showTags' ||
        key1 == 'showDiscount' ||
        key1 == 'showUnit' ||
        key1 == 'showDiscount' ||
        key1 == 'showVat' ||
        key1 == 'showcgst' ||
        key1 == 'showSgst' ||
        key1 == 'showIgst' ||
        key1 == 'showCess' ||
        key1 == 'showTaxtype' ||
        key1 == 'showLogo' ||
        key1 == 'showSignature' ||
        key1 == 'signature' ||
        key1 == 'logo' ||
        key1 == 'invoiced'
      ) {
        return;
      }
      //get the currently looped control from current form
      let currentControl = currentForm.controls[key1];
      let previousControl;
      //get the currently looped control from previous form
      if (previousForm.controls[key1]) {
        previousControl = previousForm.controls[key1];
      } 
      //return if no control present
      else return;
      //check if current form's control is dirty to check if the form value is changed. 
      //If it is changed, then only we need to get its corresponding previous value
      if (currentControl.dirty) {
        //To get previousValues in case of additional fields, we need to check if its key is ‘additionalFields’. 
        //Also, check if its parent instance is FormArray, since additionalFields are saved as formArray.
        if (
          this.prevKey1 == 'additionalFields' &&
          previousControl._parent instanceof FormArray
        ) {
          //We need to check the following cases before adding the values to previous values
          //If the fieldValue has a valid value
          if (
            previousControl.value.fieldValue !== null &&
            previousControl.value.fieldValue !== undefined
          ) {
            //If it is a date. If it is a date then, it has a field ‘fieldValue2’
            if (
              Object.getPrototypeOf(previousControl.value.fieldValue)
                .constructor.name == 'Date' &&
              previousControl.value.fieldValue2
            ) {
              //If the field value is a date, convert the date to required format. 
              //If it is not a date, save the value as it is and the fieldName
              previousValues[key1] = {
                fieldValue:
                  Object.getPrototypeOf(previousControl.value.fieldValue)
                    .constructor.name == 'Date' &&
                  previousControl.value.fieldName
                    ? formatDate(
                        previousControl.value.fieldValue,
                        'MMM d, y, hh:mm a',
                        'en_US'
                      )
                    : previousControl.value.fieldValue,
                fieldName: previousControl.value.fieldName,
              };
            } else {
              previousValues[key1] = {
                fieldValue:
                  Object.getPrototypeOf(previousControl.value.fieldValue)
                    .constructor.name == 'Date' &&
                  previousControl.value.fieldName
                    ? formatDate(
                        previousControl.value.fieldValue,
                        'mediumDate',
                        'en_US'
                      )
                    : previousControl.value.fieldValue,
                fieldName: previousControl.value.fieldName,
              };
            }
          } else {
            //if the fieldValue is null or undefined, save previous values as null
            previousValues[key1] = {
              //we store the field value and field name in changelog
              fieldValue: null,
              fieldName: previousControl.value.fieldName,
            };
          }
        }
        //get previousValues in case of prodFormArray fields - These are the products added from sale popup. 
        //Implementation  is similar to additional fields. Products are also saved as FormArray in the reactive form so check the parent’s instance if its is a formArray

        else if (
          this.prevKey1 == 'prodFormArray' &&
          previousControl._parent instanceof FormArray
        ) {
          previousValues[key1] = Object.assign(
            {
              //we store the product name and id in changelog
              productName: previousControl.value.prodName,
              id: previousControl.value.id,
            },
            //recursively loop if the control has a nested object
            this.getPreviousValues(previousControl, currentControl)
          );
        }
        //next section is to handle itemList Array from sales Documents module. The items added in sales documents are also saved as FormArray. 
        //get previousValues in case of itemList from sales docs
        else if (
          this.prevKey1 == 'itemList' &&
          previousControl._parent instanceof FormArray
        ) {
          previousValues[key1] = Object.assign(
            {
              item: previousControl.value.item,
            },
            //recursively loop if the control has a nested object
            this.getPreviousValues(previousControl, currentControl)
          );
        //saleTitle from sales module is saved as ‘salesDetails’ in the reactive form. This section handles the saleTitle 
        } else if (key1 == 'salesDetails') {
          //if the value is null or undefined, save null value to changelog
          if (
            previousControl.value == null ||
            previousControl.value == undefined
          ) {
            previousValues['saleTitle'] = null;
          } else {
            //if value is present, save the value to changelog as ‘saleTitle’
            previousValues['saleTitle'] = previousControl.value.saleTitle;
          }
        //This section is used to add serviceTitle value to change log. ‘servicesDetails’ in the reactive form contains the serviceTitle value
        } else if (key1 == 'servicesDetails') {
          //If the value from the form is null or undefined, save values as null in changelog
          if (
            previousControl.value == null ||
            previousControl.value == undefined
          ) {
            previousValues['serviceTitle'] = null;
          } else {
            previousValues['serviceTitle'] = previousControl.value.serviceTitle;
          }
        //This section is used to save the org name to changeLog. Organisation name is stored as ‘org’ as defined in the customizable field names present in the data-model file  
        } else if (key1 == 'org') {
          if (
            previousControl.value == null ||
            previousControl.value == undefined
          ) {
            previousValues['org'] = null;
          } else {
            previousValues['org'] = previousControl.value.companyName;
          }
        //This section is used to store the customer name to changelog. Customer Name is stored as’ selectedCust’ in changelog
        } else if (key1 == 'selectedCust') {
          if (previousControl.value) {
            previousValues['selectedCust'] = previousControl.value.lastName
              ? previousControl.value.firstName +
                ' ' +
                previousControl.value.lastName
              : previousControl.value.firstName;
          } else {
            previousValues['selectedCust'] = null;
          }
        } else {
          //Now if the key is not present in the abode condition checks, we can store the value directly into the changelog. 
          //if current control is an object, again recursively  loop 
          if (currentControl.controls) {
            this.prevKey1 = key1;
            previousValues[key1] = this.getPreviousValues(
              previousControl,
              currentControl
            );
          } else {
            //else if the value does not contain any nested object, we can check if it has a value or not. If value is present, check if it is date or not. 
            //If it's a date, we need to convert its format to the required format. We display dates as mediumDate format in changeLog. 
            //SO store the value as medium format string in changelog. If it is not a date, save the value as it is in changelog
            //get the values if not an object
            if (
              previousControl.value !== null &&
              previousControl.value !== undefined
            ) {
              previousValues[key1] =
                Object.getPrototypeOf(previousControl.value).constructor.name ==
                'Date'
                  ? formatDate(previousControl.value, 'mediumDate', 'en_US')
                  : previousControl.value;
            } else {
              //If the value is null or undefined, save the value as null in changelog
              previousValues[key1] = null;
            }
          }
        }
      }
    });
    //return the previousValues object back to  saveLogReactiveForm()
    return previousValues;
  }
  
  //convert the current form data to a json object based on changes in the current form
  static getCurrentValues(currentForm: any) {
    let currentValues = {};
    Object.keys(currentForm.controls).forEach((key2) => {
      //Skip the following fields if obtained through the reactive form. These fields are not required in the changelog
      if (
        key2 == 'selectedProduct' ||
        key2 == 'selProdCat' ||
        key2 == 'commentTask' ||
        key2 == 'saleOrServ' ||
        key2 == 'isCompany' ||
        key2 == 'comments' ||
        key2 == 'itemErrorMessage' ||
        key2 == 'qtyErrorMessage' ||
        key2 == 'rateErrorMessage' ||
        key2 == 'sgstPercentageErrorMessage' ||
        key2 == 'cgstPercentageErrorMessage' ||
        key2 == 'igstPercentageErrorMessage' ||
        key2 == 'cessPercentageErrorMessage' ||
        key2 == 'discountPercentageErrorMessage' ||
        key2 == 'vatPercentageErrorMessage' ||
        key2 == 'amountInclTax' ||
        key2 == 'vatPercentage' ||
        key2 == 'showDeleteButton' ||
        key2 == 'showTags' ||
        key2 == 'showDiscount' ||
        key2 == 'showUnit' ||
        key2 == 'showDiscount' ||
        key2 == 'showVat' ||
        key2 == 'showcgst' ||
        key2 == 'showSgst' ||
        key2 == 'showIgst' ||
        key2 == 'showCess' ||
        key2 == 'showTaxtype' ||
        key2 == 'showLogo' ||
        key2 == 'showSignature' ||
        key2 == 'signature' ||
        key2 == 'logo' ||
        key2 == 'invoiced'
      ) {
        return;
      }
      //get the current control
      let currentControl = currentForm.controls[key2];
       //check if the control is dirty. We need to process only the dirty values in the form
      if (currentControl.dirty) {
        //To get currentValues in case of additional fields, we need to check if its key is ‘additionalFields’. 
        //Also, check if its parent instance is FormArray, since additionalFields are saved as formArray. 
        if (
          this.prevKey2 == 'additionalFields' &&
          currentControl._parent instanceof FormArray
        ) {
          //We need to check the following cases before adding the values to current values
          //If the fieldValue has a valid value
          if (
            currentControl.value.fieldValue !== null &&
            currentControl.value.fieldValue !== undefined
          ) {
            //If it is a date. If it is a date then, it has a field ‘fieldValue2’
            if (
              Object.getPrototypeOf(currentControl.value.fieldValue).constructor
                .name == 'Date' &&
              currentControl.value.fieldValue2
            ) {
              var time_splitEdit = currentControl.value.fieldValue2.split(':');
              const date_timEditVal = new Date(
                new Date(currentControl.value.fieldValue).getFullYear(),
                new Date(currentControl.value.fieldValue).getMonth(),
                new Date(currentControl.value.fieldValue).getDate(),
                Number(time_splitEdit ? time_splitEdit[0] : null),
                Number(time_splitEdit ? time_splitEdit[1] : null)
              );
              const daTime = date_timEditVal;
              //If the field value is a date, convert the date to required format. If it is not a date, save the value as it is and the fieldName
              currentValues[key2] = {
                fieldValue: formatDate(daTime, 'MMM d, y, hh:mm a', 'en_US'),
                fieldName: currentControl.value.fieldName,
              };
            } else {
              currentValues[key2] = {
                fieldValue:
                  Object.getPrototypeOf(currentControl.value.fieldValue)
                    .constructor.name == 'Date'
                    ? formatDate(
                        currentControl.value.fieldValue,
                        'mediumDate',
                        'en_US'
                      )
                    : currentControl.value.fieldValue,
                fieldName: currentControl.value.fieldName,
              };
            }
          } else {
            //if field value not available, assign it to null
            currentValues[key2] = {
              fieldValue: null,
              fieldName: currentControl.value.fieldName,
            };
          }
        //get currentValues in case of prodFormArray fields - These are the products added from sale popup. Implementation  is similar to additional fields. 
        //Products are also saved as FormArray in the reactive form so check the parent’s instance if its is a formArray
        } else if (
          this.prevKey2 == 'prodFormArray' &&
          currentControl._parent instanceof FormArray
        ) {
          //we store the product name and id in changelog
          currentValues[key2] = Object.assign(
            {
              productName: currentControl.value.prodName,
              id: currentControl.value.id,
            },
            //recursively loop if the control has a nested object
            this.getPreviousValues(currentControl, currentControl)
          );
        }
        //next section is to handle itemList Array from sales Documents module. The items added in sales documents are also saved as FormArray. 
        //get currentValues in case of itemList from sales docs
        else if (
          this.prevKey2 == 'itemList' &&
          currentControl._parent instanceof FormArray
        ) {
          currentValues[key2] = Object.assign(
            {
              item: currentControl.value.item,
            },
            //recursively loop if the control has a nested object
            this.getPreviousValues(currentControl, currentControl)
          );
        //saleTitle from sales module is saved as ‘salesDetails’ in the reactive form. This section handles the saleTitle 
        } else if (key2 == 'salesDetails') {
          //if the value is null or undefined, save null value to changelog
          if (
            currentControl.value == null ||
            currentControl.value == undefined
          ) {
            currentValues['saleTitle'] = null;
          } else {
            //if value is present, save the value to changelog as ‘saleTitle’
            currentValues['saleTitle'] = currentControl.value.saleTitle;
          }
        //This section is used to add serviceTitle value to change log. ‘servicesDetails’ in the reactive form contains the serviceTitle value
        } else if (key2 == 'servicesDetails') {
          //If the value from the form is null or undefined, save values as null in changelog
          if (
            currentControl.value == null ||
            currentControl.value == undefined
          ) {
            currentValues['serviceTitle'] = null;
          } else {
            currentValues['serviceTitle'] = currentControl.value.serviceTitle;
          }
        //This section is used to save the org name to changeLog. Organisation name is stored as ‘org’ as defined in the customizable field names present in the data-model file
        } else if (key2 == 'org') {
          if (
            currentControl.value == null ||
            currentControl.value == undefined
          ) {
            currentValues['org'] = null;
          } else {
            currentValues['org'] = currentControl.value.companyName;
          }
        //This section is used to store the customer name to changelog. Customer Name is stored as ’selectedCust’ in changelog
        } else if (key2 == 'selectedCust') {
          if (currentControl.value) {
            currentValues['selectedCust'] = currentControl.value.lastName
              ? currentControl.value.firstName +
                ' ' +
                currentControl.value.lastName
              : currentControl.value.firstName;
          } else {
            currentValues['selectedCust'] = null;
          }
        } else {
          //Now if the key is not present in the above condition checks, we can store the value directly into the changelog. 
          //if current control is an object, again recursively  loop 
          if (currentControl.controls) {
            this.prevKey2 = key2;
            currentValues[key2] = this.getCurrentValues(currentControl);
          } else {
            //else if the value does not contain any nested object, we can check if it has a value or not. If value is present, check if it is date or not. If it's a date, 
            //we need to convert its format to the required format. We display dates as mediumDate format in changeLog. 
            //So store the value as medium format string in changelog. If it is not a date, save the value as it is in changelog
            if (
              currentControl.value !== null &&
              currentControl.value !== undefined
            ) {
              currentValues[key2] =
                Object.getPrototypeOf(currentControl.value).constructor.name ==
                'Date'
                  ? formatDate(currentControl.value, 'mediumDate', 'en_US')
                  : currentControl.value;
            } else {
              //If the value is null or undefined, save the value as null in changelog
              currentValues[key2] = null;
            }
          }
        }
      }
    });
    //return the currentValues object back to  saveLogReactiveForm()
    return currentValues;
  }

  //Used to accept the previousValues and  currentValues object, compare the values and eliminate if previous value and current value is same.
  static eliminateSameValues(previousValues, currentValues) {
    //Loop through every values in the previous and current values
    Object.keys(previousValues).forEach((key1) => {
      Object.keys(currentValues).forEach((key2) => {
        //if the keys are same and not below mentioned keys, we need to compare their values.
        //Below mentioned keys will always contain same values are we need them in changeLog to display some fields for eg, productCategory name / additional field’s fieldname,etc
        if (
          key1 == key2 &&
          !(
            key1 == 'item' ||
            key1 == 'prodCategory' ||
            key1 == 'prodName' ||
            key1 == 'fieldName'
          )
        ) {
          //Now we check if the value is a nested object. 
          //If it is, then we need to recursively loop through the same function and obtain the previous and currentValues from returned object
          if (
            previousValues[key1] instanceof Object &&
            currentValues[key2] instanceof Object
          ) {
            let objVal = this.eliminateSameValues(
              previousValues[key1],
              currentValues[key2]
            );
            previousValues[key1] = objVal['previousValues'];
            currentValues[key2] = objVal['currentValues'];
          }
          //Now eliminate same values, null values, empty strings
          if (
            previousValues[key1] == currentValues[key2] ||
            ((previousValues[key1] == '' || previousValues[key1] == null) &&
              (currentValues[key2] == '' || currentValues[key2] == null))
          ) {
            delete previousValues[key1];
            delete currentValues[key2];
          }
        }
      });
    });
    //return previousValues and currentValues
    return { previousValues: previousValues, currentValues: currentValues };
  }

  //Used to find the pipeline name since we get only pipeline id through the reactive form
  static getPipelineName(selectedPipeline, pipelineArray) {
    let pipelineName: string;
    //loop through each values in the pipelineArray object and check if its id is matching with the selected pipeline id. If it is matching, save it as the pipeline name
    pipelineArray.forEach((pipeline) => {
      if (pipeline.pipelineId == selectedPipeline) {
        pipelineName = pipeline.pipelineName;
      }
    });
    //return pipeline name if it is obtained from the array else return ‘N/A’
    return pipelineName ? pipelineName : 'N/A';
  }

  //Used to find the status name by passing the status id obtained from the reactive form
  static getStatusName(statusId, pipelineArray) {
    let statusName: string;
    //loop through every value in the pipelineArray
    pipelineArray.forEach((pipeline) => {
      //loop through every status available in the pipeline
      pipeline.pipelineStages.forEach((stage) => {
        //if selected status id matches the status id in the pipelineArray, save it as the status name
        if (stage.stageId == statusId) {
          statusName = stage.name;
        }
      });
    });
    //return status name if available, else return ‘N/A’
    return statusName ? statusName : 'N/A';
  }

  
  /**  Used to generate a deep copy of the reactive form without creating a reference
   * Deep clones the given AbstractControl, preserving values, validators, async validators, and disabled status.
   * @param control AbstractControl
   * @returns AbstractControl
   */
  static cloneAbstractControl<T extends AbstractControl>(control: T): T {
    let newControl: T;
    //check if the form control passed is a form group, if it is then we create a new formgroup instance with validator and async validator as that of the form group
    if (control instanceof FormGroup) {
      const formGroup = new FormGroup(
        {},
        control.validator,
        control.asyncValidator
      );
      //now create the new controls as same as the form group
      const controls = control.controls;
      //Now loop through each control 
      Object.keys(controls).forEach((key) => {
        //Now add the controls in the formGroup to the new copy
        formGroup.addControl(key, this.cloneAbstractControl(controls[key]));
      });
      newControl = formGroup as any;
    } else if (control instanceof FormArray) {
      //create the formArray if the control is an instance of formArray
      const formArray = new FormArray(
        [],
        control.validator,
        control.asyncValidator
      );
      control.controls.forEach((formControl) =>
      //push the controls to the formArray
        formArray.push(this.cloneAbstractControl(formControl))
      );
      newControl = formArray as any;
    } else if (control instanceof FormControl) {
      //Now create formControl if the control is an instance of formControl
      newControl = new FormControl(
        control.value,
        control.validator,
        control.asyncValidator
      ) as any;
    } else {
      //if it is not a formControl, FormArray / FormGroup, throw error
      throw new Error('Error: unexpected control value');
    }
    //disable control if it is disabled in the reactive form
    if (control.disabled) newControl.disable({ emitEvent: false });
    //return the new control
    return newControl;
  }

  ngOnInit(): void {}
}
