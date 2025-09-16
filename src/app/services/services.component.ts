import { Component, Inject, OnInit, } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { NetworkCheckService } from '../networkcheck.service';
import { ServicesService } from './services.service';
export interface DialogData {
  superUserId: string;
  email: string;
  contactNumber: string;
  countryCode: string;
  contactName: string;
}
@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent implements OnInit {
  selectedService: string;
  contactNumber: string = '';
  preferredTime: string = '';
  networkConnection: boolean; //for checking is connection active or not
  constructor(
    public networkCheck: NetworkCheckService,
    public dialogRef: MatDialogRef<ServicesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private servicesService: ServicesService,
    private _snackBar: MatSnackBar,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.contactNumber = this.data.contactNumber;
  }
  OnSelectedService(serviceSelected) {
    this.selectedService = serviceSelected;
  }
  //checking network enabled or not
  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }
  onSubmit() {
    let date = new Date().getTime(); //Get TimeStamp
    let month = new Date().getMonth(); //
    let year = new Date().getFullYear();
    let message ='Internal inquiry for service \n'+'Service Type : ' +this.selectedService +'\n'+ 'Time: ' + this.preferredTime;
    this.servicesService.createService(
      date,
      this.data.email,
      message,
      this.data.contactName,
      month,
      year,
      this.contactNumber
    );
    this._snackBar.open('Your inquiry has been submitted successfully', ' ', {
      duration: 2000,
    });
    this.dialogRef.close();
  }
}
