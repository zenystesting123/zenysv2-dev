/*********************************************
 Description : can configure folloup outcome and mandatory check

 ********************************************************* */

import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { CommonService } from 'src/app/common.service';
import { Location } from '@angular/common';
import {
  defaultfollowUpSettings,
  fieldNameLEngth,
  FollowupOutcome,
  followUpSettings,
  FollowupStatus,
  Profile,
  SubUsers,
  subUsersCheck,
  UserAccessDetails,
} from 'src/app/data-models';
import { DocumentsetttingsService } from '../documentsettings/documentsetttings.service';
import { takeUntil } from 'rxjs/operators';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

@Component({
  selector: 'app-followups-settings',
  templateUrl: './followups-settings.component.html',
  styleUrls: ['./followups-settings.component.scss'],
})
export class FollowupsSettingsComponent implements OnInit, OnDestroy {
  progressBarStatus: boolean = false;
  /** Subject that emits when the component has been destroyed. */
  private onDestroy$: Subject<void> = new Subject<void>();
  usrProfileData: UserAccessDetails; //user profile data
  notEdit: Boolean = true; //direct route blocking variable according to user access permission
  superUserId: string; // super user id
  userId: string; //current user id
  fieldNameFollowup: string = 'FollowUp';
  isEditMode = false; //for setting edit mode disabled
  isEditModeOutcome = false;
  isEditModestatus = false;
  followUpOutcome: string[]=FollowupOutcome.DATA;
  followUpOutcomeReqCheck: boolean = false;
  followUpOutcomeDisplayCheck: boolean = false;
  followUpStatus: string[]=FollowupStatus.DATA;
  followUpStatusReqCheck: boolean = false;
  followUpStatusDisplayCheck: boolean = false;
  ivrIntegrationEnable: boolean = false; // to check if IvR enabled
  enableOutboundCallsViaCallBridging: boolean = false; //to check if outbondCall enabled
  callBridgingType:boolean = true;// to store type of oubound call
  accountType: string;
  serviceProviderIvr: String[] = ['Bonvoice','Voxbay'];
  serviceProviderCallBridging: String[] = ['Bonvoice','Voxbay'];
  ivrServiceProvider: string = ''; //to store IVR service provider name
  callBridgingServiceProviders: string[] = ['Bonvoice','Voxbay'];
  callBridgingServiceProvider: string = '' //to store outgoing call service provider name
  ivrToken: string = '';
  autoCallToken: string = '';
  subUsersList: SubUsers[];
  subUsers: subUsersCheck[];
  callerList: string[];
  superUserDetails: Profile; //to store super user details
followUpSettings: followUpSettings = defaultfollowUpSettings.CONST_VALUE;
  settingsConfigured: boolean;
  fieldCustomisationForm: FormGroup;
  currentCustomField: any = []; //to store additional fields
  editFollowUp: boolean = false;
  fieldMaxLength = fieldNameLEngth.FIELD_NAME_LENGTH; //maxlength from datamodel.ts, but not implemented for products and services
  DIDNumber:string='';// to configure did number for autocall
  autoCallURL:string='';// to configure URL for autocall
  channelID:string='';// to configure channel ID for autocall
  networkConnection: boolean; //network check
  uId_voxBay: string = ''//voxBay mobile to mobile
  pin_voxBay: string = ''//voxBay Pin
  source_voxBay: string = ''//source number
  extension_voxBay:string =''//extension number voxBay
  destination_voxBay:string=''//destination mobile number
  callerid_voxBay:string=''//DID number
  outboundCallBridgingType: string;

  constructor(
    private location: Location,
    public commonService: CommonService,
    public db: DocumentsetttingsService,
    private snack: MatSnackBar,
    public networkCheck: NetworkCheckService,

  ) {}
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  ngOnInit(): void {
    this.commonService.userDatas
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((allData) => {
        if (allData) {
          this.userId = allData.authDetails.uid;
          if (allData.userDetails) {
            // superuserId assigning
            if (allData.userDetails.superUserId) {
              this.superUserId = allData.userDetails.superUserId;
            } else {
              //If for some reason the superuser id is not set (cases such as legacy data), then use the user id as super user id to read the data
              this.superUserId = this.userId;
            }
            this.accountType = allData.userDetails.accountType;
            // check for access control and thus block settings view
            this.usrProfileData = allData.usrProfileData;
            if (this.usrProfileData) {
              // disable settings view
              if (this.usrProfileData.isCheckedSett == false) {
                this.notEdit = true;
              } else {
                if (this.usrProfileData.settView == false) {
                  this.notEdit = true;
                } else {
                  this.notEdit = false;
                }
              }
            }
            this.superUserDetails = allData.superUserDetails;
            if (allData.superUserDetails.fieldNames) {
              this.fieldNameFollowup =
                allData.superUserDetails.fieldNames.fieldNameFollowup;
            }
          this.currentCustomField = allData.superUserDetails.customFieldsFollowUp;

            if (allData.superUserDetails.followUpOutcome) {
              this.followUpOutcome = allData.superUserDetails.followUpOutcome;
            }
            if (allData.superUserDetails.followUpOutcomeReqCheck) {
              this.followUpOutcomeReqCheck =
                allData.superUserDetails.followUpOutcomeReqCheck;
            }
            if (allData.superUserDetails.followUpOutcomeDisplayCheck) {
              this.followUpOutcomeDisplayCheck =
                allData.superUserDetails.followUpOutcomeDisplayCheck;
            }
            if (allData.superUserDetails.followUpStatus) {
              this.followUpStatus = allData.superUserDetails.followUpStatus;
            }
            if (allData.superUserDetails.followUpStatusReqCheck) {
              this.followUpStatusReqCheck =
                allData.superUserDetails.followUpStatusReqCheck;
            }
            if (allData.superUserDetails.followUpStatusDisplayCheck) {
              this.followUpStatusDisplayCheck =
                allData.superUserDetails.followUpStatusDisplayCheck;
            }
            if (allData.superUserDetails.ivrIntegrationEnable) {
              this.ivrIntegrationEnable =
                allData.superUserDetails.ivrIntegrationEnable;
            }
            if (allData.superUserDetails.enableOutboundCallsViaCallBridging) {
              this.enableOutboundCallsViaCallBridging =
                allData.superUserDetails.enableOutboundCallsViaCallBridging;
            }
           
            if (allData.superUserDetails.ivrServiceProvider) {
              this.ivrServiceProvider =
                allData.superUserDetails.ivrServiceProvider;
            }
            if (allData.superUserDetails.callBridgingServiceProvider) {
              this.callBridgingServiceProvider =
                allData.superUserDetails.callBridgingServiceProvider;
            }
            if (allData.superUserDetails.outboundCallType) {
              this.outboundCallBridgingType = allData.superUserDetails.outboundCallType;
              if (this.outboundCallBridgingType === "mobileToMobile" || this.callBridgingServiceProvider === "Bonvoice") {
                this.callBridgingType = true;
              } else if (this.outboundCallBridgingType === "extensionToMobile") {
                this.callBridgingType = false;
              }
              // console.log(" this.callBridgingType", this.callBridgingType)
            }
            if (allData.superUserDetails.ivrToken) {
              this.ivrToken = allData.superUserDetails.ivrToken;
            }
            if (allData.superUserDetails.autoCallToken) {
              this.autoCallToken = allData.superUserDetails.autoCallToken;
            }
            if (allData.superUserDetails.DIDNumber) {
              this.DIDNumber = allData.superUserDetails.DIDNumber;
            }
            if (allData.superUserDetails.autoCallURL) {
              this.autoCallURL = allData.superUserDetails.autoCallURL;
            }
            if (allData.superUserDetails.channelID) {
              this.channelID = allData.superUserDetails.channelID;
            }
             //voxBay
         
            if (allData.superUserDetails.voxbayUid) {
              this.uId_voxBay = allData.superUserDetails.voxbayUid;
            }
            if (allData.superUserDetails.voxbayPin) {
              this.pin_voxBay = allData.superUserDetails.voxbayPin;
            }
            if (this.superUserId === this.userId) {
              if (allData.superUserDetails.extensionNumber) {
                this.extension_voxBay = allData.superUserDetails.extensionNumber;
              }
              if (allData.superUserDetails.voxbayCallerid) {
                this.callerid_voxBay = allData.superUserDetails.voxbayCallerid;
              }
            } else {
              const userObject = allData.subUsers.find(user => user.userId === this.userId)
              this.extension_voxBay = userObject ? userObject.extensionNumber : null;
              this.callerid_voxBay = userObject ? userObject.callerId : null;
            }
            this.subUsersList = [];
            this.subUsersList.push({
              id: null,
              userId: this.superUserId,
              firstname: allData.superUserDetails.firstname,
              lastname: allData.superUserDetails.lastname,
              accountType: allData.superUserDetails.accountType,
              dataAccessRule: allData.superUserDetails.dataAccessRule,
              email: allData.superUserDetails.email,
              userRole: allData.superUserDetails.userRole,
              reportsToId: allData.superUserDetails.superUserId,
              reportsToName: allData.superUserDetails.firstname,
              accessLockAutologout: null,
              branchId:'',
              branchName:'',
              status: null,
              code: allData.superUserDetails.countryCode,
              contactNo: allData.superUserDetails.phone,
              extensionNumber:this.extension_voxBay,
              callerId:this.callerid_voxBay
            });
            this.subUsersList.push(...allData.subUsers);
            this.callerList = [];
            this.subUsers = [];
            if (allData.superUserDetails.callerList) {
              this.callerList = allData.superUserDetails.callerList;
            }

            this.subUsersList.forEach((element) => {
              let list = [];
              list = this.callerList.filter((data) => data == element.userId);

              this.subUsers.push(
                new subUsersCheck(
                  element.userId,
                  element.firstname,
                  element.lastname,
                  list.length > 0 ? true : false
                )
              );
            });
          }
          if (
            typeof allData.superUserDetails.followUpSettings === 'undefined' ||
            allData.superUserDetails.followUpSettings === null
          ) {
            this.settingsConfigured = false;
          } else {
            this.settingsConfigured = true;
            this.
            followUpSettings = allData.superUserDetails.followUpSettings;
          }
          this.fieldCustomisationForm = new FormGroup({
            customerControl: new FormGroup({
              displayName: new FormControl(
                this.followUpSettings?.customerControl.displayName,
                [Validators.required, Validators.minLength(2)]
              ),
              display: new FormControl(
                this.followUpSettings?.customerControl?.display,
                Validators.required
              ),
              mandatory: new FormControl(
                this.followUpSettings?.customerControl?.mandatory,
                Validators.required
              ),
            }),
            callStartDate: new FormGroup({
              displayName: new FormControl(
                this.followUpSettings?.callStartDate.displayName,
                [Validators.required]
              ),
              display: new FormControl(
                this.followUpSettings?.callStartDate?.display,
                Validators.required
              ),
              mandatory: new FormControl(
                this.followUpSettings?.callStartDate?.mandatory,
                Validators.required
              ),
            }),
            direction: new FormGroup({
              displayName: new FormControl(
                this.followUpSettings?.direction.displayName,
                [Validators.required, Validators.minLength(2)]
              ),
              display: new FormControl(
                this.followUpSettings?.direction?.display,
                Validators.required
              ),
              mandatory: new FormControl(
                this.followUpSettings?.direction?.mandatory,
                Validators.required
              ),
            }),
            status: new FormGroup({
              displayName: new FormControl(
                this.followUpSettings?.status.displayName
              ),
              display: new FormControl(
                this.followUpSettings?.status?.display
              ),
              mandatory: new FormControl(
                this.followUpSettings?.status?.mandatory
              ),
            }),
            outcome: new FormGroup({
              displayName: new FormControl(
                this.followUpSettings?.outcome.displayName
              ),
              display: new FormControl(
                this.followUpSettings?.outcome?.display
              ),
              mandatory: new FormControl(
                this.followUpSettings?.outcome?.mandatory
              ),
            }),
            notes: new FormGroup({
              displayName: new FormControl(
                this.followUpSettings?.notes.displayName
              ),
              display: new FormControl(
                this.followUpSettings?.notes?.display
              ),
              mandatory: new FormControl(
                this.followUpSettings?.notes?.mandatory
              ),
            }),
            callStartTime: new FormGroup({
              displayName: new FormControl(
                this.followUpSettings?.callStartTime.displayName
              ),
              display: new FormControl(
                this.followUpSettings?.callStartTime?.display
              ),
              mandatory: new FormControl(
                this.followUpSettings?.callStartTime?.mandatory
              ),
            }),
            //doubt
            completedStatus: new FormGroup({
              displayName: new FormControl(
                this.followUpSettings?.completedStatus.displayName
              ),
              display: new FormControl(
                this.followUpSettings?.completedStatus?.display
              ),
              mandatory: new FormControl(
                this.followUpSettings?.completedStatus?.mandatory
              ),
            }),
            nextFollowUpNotes: new FormGroup({
              displayName: new FormControl(
                this.followUpSettings?.nextFollowUpNotes.displayName
              ),
              display: new FormControl(
                this.followUpSettings?.nextFollowUpNotes?.display
              ),
              mandatory: new FormControl(
                this.followUpSettings?.nextFollowUpNotes?.mandatory
              ),
            }),
            nextFollowUpTime: new FormGroup({
              displayName: new FormControl(
                this.followUpSettings?.nextFollowUpTime.displayName
              ),
              display: new FormControl(
                this.followUpSettings?.nextFollowUpTime?.display
              ),
              mandatory: new FormControl(
                this.followUpSettings?.nextFollowUpTime?.mandatory
              ),
            }),
            nextFollowUpDate: new FormGroup({
              displayName: new FormControl(
                this.followUpSettings?.nextFollowUpDate.displayName
              ),
              display: new FormControl(
                this.followUpSettings?.nextFollowUpDate?.display
              ),
              mandatory: new FormControl(
                this.followUpSettings?.nextFollowUpDate?.mandatory
              ),
            }),
            followUpStatus: new FormGroup({
              followUpStatus: new FormControl({value:this.followUpStatus, disabled: true }),
            }),
            followUpOutcome: new FormGroup({
              followUpOutcome: new FormControl(this.followUpOutcome ),
            }),

        })
    // this.fieldCustomisationForm.controls.followUpOutcome.disable()
    // this.fieldCustomisationForm.controls.followUpStatus.disable()

        //customer control
        this.fieldCustomisationForm.get('customerControl.display').setValue(true);
        this.fieldCustomisationForm.get('customerControl.display').disable();
        this.fieldCustomisationForm.get('customerControl.mandatory').setValue(true);
        this.fieldCustomisationForm.get('customerControl.mandatory').disable();
        //callStartDate
        this.fieldCustomisationForm.get('callStartDate.display').setValue(true);
        this.fieldCustomisationForm.get('callStartDate.display').disable();
        this.fieldCustomisationForm.get('callStartDate.mandatory').setValue(true);
        this.fieldCustomisationForm.get('callStartDate.mandatory').disable();
        //direction
        this.fieldCustomisationForm.get('direction.display').setValue(true);
        this.fieldCustomisationForm.get('direction.display').disable();
        this.fieldCustomisationForm.get('direction.mandatory').setValue(true);
        this.fieldCustomisationForm.get('direction.mandatory').disable();
        // if(this.isEditModeOutcome = true){
        // this.fieldCustomisationForm.controls.followUpOutcome.disable()
        // }
        // else {
        // this.fieldCustomisationForm.controls.followUpOutcome.enable()

        // }
        this.disableStatus();
        this.disableNotes();
          this.disableOutcome()
      }
        this.progressBarStatus = true;
      });
  }
  
  disableStatus() {
    // status
    if (this.fieldCustomisationForm.get('status.mandatory').value === true) {
      this.fieldCustomisationForm.get('status.display').setValue(true);
      this.fieldCustomisationForm.get('status.display').disable();
    } else {
      let val = this.followUpSettings.status.display;
      this.fieldCustomisationForm.get('status.display').setValue(val);
      this.fieldCustomisationForm.get('status.display').enable();
    }
  }
  disableOutcome() {
    // outcome
    if (this.fieldCustomisationForm.get('outcome.mandatory').value === true) {
      this.fieldCustomisationForm.get('outcome.display').setValue(true);
      this.fieldCustomisationForm.get('outcome.display').disable();
    } else {
      let val = this.followUpSettings.outcome.display;
      this.fieldCustomisationForm.get('outcome.display').setValue(val);
      this.fieldCustomisationForm.get('outcome.display').enable();
    }
  }
  disableNotes() {
    // status
    if (this.fieldCustomisationForm.get('notes.mandatory').value === true) {
      this.fieldCustomisationForm.get('notes.display').setValue(true);
      this.fieldCustomisationForm.get('notes.display').disable();
    } else {
      let val = this.followUpSettings.notes.display;
      this.fieldCustomisationForm.get('notes.display').setValue(val);
      this.fieldCustomisationForm.get('notes.display').enable();
    }
  }
    // field customisation submit button
    onSubmit() {
      //status
      if (this.fieldCustomisationForm.getRawValue().status.displayName === '') {
        this.fieldCustomisationForm
          .get('status.displayName')
          .setValue(defaultfollowUpSettings.CONST_VALUE.status.displayName);
      }
      //
      //outcome
      if (this.fieldCustomisationForm.getRawValue().outcome.displayName === '') {
        this.fieldCustomisationForm
          .get('outcome.displayName')
          .setValue(defaultfollowUpSettings.CONST_VALUE.outcome.displayName);
      }
      //
      //notes
      if (this.fieldCustomisationForm.getRawValue().notes.displayName === '') {
        this.fieldCustomisationForm
          .get('notes.displayName')
          .setValue(defaultfollowUpSettings.CONST_VALUE.notes.displayName);
      }
      //

      this.db.updateFieldCustomization(
        this.superUserId,
        this.fieldCustomisationForm.getRawValue()
      );
      this.snack.open('Successfully updated', '', {
        duration: 2000,
      });
    }
  onBack() {
    this.location.back();
  }
  onToggle(){
    this.fieldCustomisationForm.controls.followUpOutcome.enable()
    this.isEditModeOutcome = !this.isEditModeOutcome;
  }
  onToggleStatus(){
    this.fieldCustomisationForm.controls.followUpStatus.enable()
    this.isEditModestatus = !this.isEditModestatus;
  }
  onToggleCancel(){
  this.fieldCustomisationForm.controls.followUpOutcome.disable()
    this.isEditModeOutcome = !this.isEditModeOutcome;
  }
  statusToggleCancel(){
  // this.fieldCustomisationForm.controls.followUpStatus.disable()
    // control.status === 'DISABLED' ? control.enable() : control.disable();
    this.isEditModestatus = !this.isEditModestatus;
  }
  //to enable and disable edit mode
  onTogglenotEditMode() {
    this.isEditMode = !this.isEditMode;
  }
  onUpdatingFollowUpOutcome(form) {
    let outComeArray: string[] = [];
    //outcome store as a array
    this.followUpOutcome = form.value.followUpOutcome.followUpOutcome;
    if (this.followUpOutcome) {

      let outcome = this.followUpOutcome.toString();

      let options = outcome?.split(',');
      for (var i = options?.length - 1; i >= 0; i--) {
        outComeArray.push(options[i].trim());
      }
      if (!outComeArray) {
        outComeArray = [];
      }

      outComeArray.reverse();
    }
    this.isEditModeOutcome = !this.isEditModeOutcome;
    this.db
    .customUpOutcomeUpdate(
      this.superUserId,
      outComeArray,
    )
    .then((res) => {
      this.snack.open('Successfully Updated', '', {
        duration: 2000,
      });
    });
  }
  onUpdatingFollowUpStatus(form){
    let statusArray: string[] = [];
    //outcome store as a array
    this.followUpStatus = form.value.followUpStatus.followUpStatus;
    if (this.followUpStatus) {
      let status = this.followUpStatus.toString();
      let optionsStaus = status?.split(',');
      for (var i = optionsStaus?.length - 1; i >= 0; i--) {
        statusArray.push(optionsStaus[i].trim());
      }
      if (!statusArray) {
        statusArray = [];
      }
      if(statusArray.includes("Missed")){
        statusArray.reverse();
      }
      else{
        statusArray.reverse();
        statusArray.push("Missed")
      }
    }
    if(statusArray.length<=0){
      statusArray=['Missed']
    }
    this.isEditModestatus = !this.isEditModestatus;
    this.db
    .customStatusUpdate(
      this.superUserId,
      statusArray,
    )
    .then((res) => {
      this.snack.open('Successfully Updated', '', {
        duration: 2000,
      });
    });

  }
  // update details
  onUpdatingFollowUpDetails() {
    // let outComeArray: string[] = [];
    // //outcome store as a array
    // console.log(this.followUpOutcome)
    // if (this.followUpOutcome) {
    //   let outcome = this.followUpOutcome.toString();
    // console.log("Outcome",outcome)

    //   let options = outcome?.split(',');
    //   for (var i = options?.length - 1; i >= 0; i--) {
    //     outComeArray.push(options[i].trim());
    //   }
    //   if (!outComeArray) {
    //     outComeArray = [];
    //   }
    //   outComeArray.reverse();
    // console.log("Outcome arr",outComeArray)

    // }
    // let statusArray: string[] = [];
    // //outcome store as a array
    // if (this.followUpStatus) {
    //   let status = this.followUpStatus.toString();
    //   let optionsStaus = status?.split(',');
    //   for (var i = optionsStaus?.length - 1; i >= 0; i--) {
    //     statusArray.push(optionsStaus[i].trim());
    //   }
    //   if (!statusArray) {
    //     statusArray = [];
    //   }
    //   if(statusArray.includes("Missed")){
    //     statusArray.reverse();
    //   }
    //   else{
    //     statusArray.push("Missed")
    //     statusArray.reverse();
    //   }
    // }

    // this.isEditMode = !this.isEditMode;
    // if (!this.followUpStatusDisplayCheck) {
    //   this.followUpStatusReqCheck = false;
    // }
    // if (!this.followUpOutcomeDisplayCheck) {
    //   this.followUpOutcomeReqCheck = false;
    // }
    if ((this.ivrIntegrationEnable && this.enableOutboundCallsViaCallBridging)) {
      if (this.ivrServiceProvider === this.callBridgingServiceProvider) {
        this.db
         .followUpOutComesUpdate(
        this.superUserId,
        this.ivrIntegrationEnable,
        this.ivrServiceProvider,
        this.ivrToken,
        this.callerList,
        this.enableOutboundCallsViaCallBridging,
        this.callBridgingServiceProvider,
        this.autoCallToken,
        this.DIDNumber,
        this.autoCallURL,
        this.channelID,
      )
          .then((res) => {
            this.snack.open('Successfully Updated', '', {
              duration: 2000,
            });
            this.onTogglenotEditMode();
          });
      } else {
        this.snack.open('Please select same service provider', '', {
          duration: 2000,
        });
      }
    }
    else{
      this.db
          .followUpOutComesUpdate(
            this.superUserId,
            this.ivrIntegrationEnable,
            this.ivrServiceProvider,
            this.ivrToken,
            this.callerList,
            this.enableOutboundCallsViaCallBridging,
            this.callBridgingServiceProvider,
            this.autoCallToken,
            this.DIDNumber,
            this.autoCallURL,
            this.channelID,
          )
          .then((res) => {
            this.snack.open('Successfully Updated', '', {
              duration: 2000,
            });
            this.onTogglenotEditMode();
          });
    }
  }
  //for updating configuration of voxbay to subuser
  onUpdatingFollowUpDetailsVoxBay() {
    let callerlist = []
    this.outboundCallBridgingType = this.callBridgingType ? 'mobileToMobile' : 'extensionToMobile';

    if ((this.ivrIntegrationEnable && this.enableOutboundCallsViaCallBridging)) { //if ivr and calll bridging enabled, preventing selection of different providers
      if (this.ivrServiceProvider === this.callBridgingServiceProvider) {
        this.db
          .followUpOutComesUpdateVoxbay(
            this.superUserId,
            this.ivrIntegrationEnable,
            this.ivrServiceProvider,
            callerlist,
            this.enableOutboundCallsViaCallBridging,
            this.callBridgingServiceProvider,
            this.uId_voxBay,
            this.callerid_voxBay,
            this.pin_voxBay,
            this.extension_voxBay,
            this.outboundCallBridgingType
          )
          .then((res) => {
            this.snack.open('Successfully Updated', '', {
              duration: 2000,
            });
            this.onTogglenotEditMode();
          });
      } else {
        this.snack.open('Please select same service provider', '', {
          duration: 2000,
        });
      }
    }
    else{
      this.db
          .followUpOutComesUpdateVoxbay(
            this.superUserId,
            this.ivrIntegrationEnable,
            this.ivrServiceProvider,
            callerlist,
            this.enableOutboundCallsViaCallBridging,
            this.callBridgingServiceProvider,
            this.uId_voxBay,
            this.callerid_voxBay,
            this.pin_voxBay,
            this.extension_voxBay,
            this.outboundCallBridgingType
          )
          .then((res) => {
            this.snack.open('Successfully Updated', '', {
              duration: 2000,
            });
            this.onTogglenotEditMode();
          });
    }
    
  }
  onChange(select: MatCheckboxChange, userId) {
    if (select.checked) {
      this.callerList.push(userId);
    } else {
      this.callerList.forEach((element, index) => {
        if (element == userId) {
          this.callerList.splice(index, 1);
        }
      });
    }
  }
      // FollowUp field actions
      editFollowUpfn() {
        this.editFollowUp = true;
      }
      // clear button on FollowUp field actions
      clearFollowUp() {
        this.editFollowUp = false;
        this.fieldNameFollowup = this.superUserDetails.fieldNames.fieldNameFollowup;
      }
      // save button on FollowUp field actions
      saveFollowUp() {
        this.editFollowUp = false;
        this.db.updateFollowupfieldName(
          this.superUserId,
          this.fieldNameFollowup
        );
        this.snack.open('Successfully updated', '', {
          duration: 500,
        });
      }
      onCheckNetwork() {
        return (this.networkConnection = this.networkCheck.onNetworkCheck());
      }
  @HostListener('window:beforeunload')
  ngOnDestroy() {
    // on destroy
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
