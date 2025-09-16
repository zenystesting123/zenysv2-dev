import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CommonService } from 'src/app/common.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserAccessDetails } from 'src/app/data-models';
import { DocumentsetttingsService } from '../documentsettings/documentsetttings.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GeneralSettingsService } from './general-settings.service';
import { NetworkCheckService } from 'src/app/networkcheck.service';
@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss'],
})
export class GeneralSettingsComponent implements OnInit {
  progressBarStatus: boolean = false;
  /** Subject that emits when the component has been destroyed. */
  private onDestroy$: Subject<void> = new Subject<void>();
  usrProfileData: UserAccessDetails; //user profile data
  notEdit: Boolean = true; //direct route blocking variable according to user access permission
  selectedTime: number = 900000;
  superUserId: string; // super user id
  userId: string; //current user id
  accountType: string = 'Super User';
  lockLogout = false; //checkbox variable to enable lock user prfoile on max autologouts
  maxLogout: number = null; //maximum number of auto logouts permitted
  autoLogoutActive: boolean = false;
  fieldNameContact: string = 'Contact'; // for storing contact field name
  fieldNameSale: string = 'Sale'; // for storing sale field name
  duplicateEmailDisable: boolean = false;
  duplicateContactNumberDisable: boolean = false;
  isProdCheckMandatory: boolean = false;
  // isCustomerIndividual:boolean = false;

  constructor(
    private location: Location,
    public commonService: CommonService,
    public db: DocumentsetttingsService,
    private snack: MatSnackBar,
    private serviceInstance: GeneralSettingsService,
    public networkCheck: NetworkCheckService
  ) {}

  ngOnInit(): void {
    this.commonService.userDatas
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((allData) => {
        if (allData) {
          this.userId = allData.authDetails.uid;
          if (allData.userDetails) {
            this.accountType = allData.userDetails.accountType;
            // superuserId assigning
            if (allData.userDetails.superUserId) {
              this.superUserId = allData.userDetails.superUserId;
            } else {
              //If for some reason the superuser id is not set (cases such as legacy data), then use the user id as super user id to read the data
              this.superUserId = this.userId;
            }
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
              if (allData.superUserDetails.logOutTime) {
                this.selectedTime = allData.superUserDetails.logOutTime;
              }
              if (allData.superUserDetails.lockAccessAutoLogout) {
                this.lockLogout = allData.superUserDetails.lockAccessAutoLogout;
                this.maxLogout =
                  allData.superUserDetails.accessLockAutoLogoutThreshold;
              }
              if(allData.superUserDetails.autoLogoutActive){
                this.autoLogoutActive = allData.superUserDetails.autoLogoutActive;
              }
              if(allData.superUserDetails.duplicateEmailDisable){
                this.duplicateEmailDisable = allData.superUserDetails.duplicateEmailDisable;
              }
              if(allData.superUserDetails.duplicateContactNumberDisable){
                this.duplicateContactNumberDisable = allData.superUserDetails.duplicateContactNumberDisable;
              }
             
              
              if(allData.superUserDetails.isProdCheckMandatory){
                this.isProdCheckMandatory = allData.superUserDetails.isProdCheckMandatory;
              }
              // if(allData.superUserDetails.isCustomerIndividual){
              //   this.isCustomerIndividual = allData.superUserDetails.isCustomerIndividual;
              // }

            }
            if (allData.superUserDetails.fieldNames) {
              this.fieldNameContact =
                allData.superUserDetails.fieldNames.fieldNameContact;
              this.fieldNameSale =
                allData.superUserDetails.fieldNames.fieldNameSale;
            }
          }
        }
        this.progressBarStatus = true;
      });
  }

  onBack() {
    this.location.back();
  }

  saveTime() {
    if (this.selectedTime) {
      this.db
        .logOutTimeUpdate(this.superUserId, this.selectedTime)
        .then((res) => {
          this.snack.open('Successfully Updated', '', {
            duration: 2000,
          });
        });
    } else {
      this.snack.open('Please Choose a Time', '', {
        duration: 2000,
      });
    }
  }

  // method on enabling user profile lock on exceeding max allowed auto logouts
  saveLockEnable() {
    this.serviceInstance
      .enableProfileLock(this.superUserId, this.lockLogout, this.maxLogout)
      .then((response) => {
        this.snack.open('Successfully Updated', '', {
          duration: 2000,
        });
      });
  }

  logoutEnableFunction(event) {
    // console.log(event)
    this.serviceInstance.enableAutoLogout(this.superUserId, event.checked);
  }

  onSaveDupliacteDisable(){
    this.serviceInstance.disableDuplicate(this.superUserId,this.duplicateEmailDisable,this.duplicateContactNumberDisable)
    .then((response) => {
      this.snack.open('Successfully Updated', '', {
        duration: 2000,
      });
    });
  }

  //toggle isProdMandatoryCheck in database, which enables mandatory check for adding products in addnewsale popup
  onSaveDisableProductCheck() {
    this.serviceInstance.disableProductCheck(this.superUserId,this.isProdCheckMandatory)
    .then((response) => {
      this.snack.open('Successfully Updated', '', {
        duration: 2000,
      });
    });
  }

  // //to set customer type as individual by default
  // onSaveCustomerType(){
  //   this.serviceInstance.defaultCustomerType(this.superUserId,this.isCustomerIndividual)
  //   .then((response) => {
  //     this.snack.open('Successfully Updated', '', {
  //       duration: 2000,
  //     });
  //   });
  // }
}
