import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CommonService } from '../common.service';
import { CountryCodeModel, getCountryCodes } from '../countryCode';
@Component({
  selector: 'app-common-country-code',
  templateUrl: './common-country-code.component.html',
  styleUrls: ['./common-country-code.component.scss']
})
export class CommonCountryCodeComponent implements OnInit {
  userDetailsSubscription: Subscription; //for subscribing to user details
  userCode: any; //to store default phone code
  defaultCode = []
  myControl = new FormControl('');
  filteredOptions: any;
  CountryCodes = getCountryCodes.CountryCodes; //country codes fetch from countrycodes.ts
  @Output() countryCodeEvent = new EventEmitter<string>();
  @Input() code: string;
  @Input() contactNumber :string;


  constructor(
    public commonService: CommonService,
  ) {
    //to get usercode of user
    this.userDetailsSubscription = this.commonService.userDatas.subscribe(
      (allData) => {
        this.userCode = allData.superUserDetails.countryCode;
        this.CountryCodes.filter(((val) => {
          if (val.dial_code == this.userCode) {
            this.defaultCode.push(val);
          }
        }))

        if (!this.userCode) {
          this.defaultCode = [{
            "name": "India",
            "dial_code": "+91",
            "code": "IN"
          }]
        }
      });
  }
  ngOnInit(): void {

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value?.name)),
      map((name) =>
        name ? this._filter(name) : this.CountryCodes.slice()
      )
    );
    if (this.code) {

      let data;
      data = this.CountryCodes.filter((data) => data.dial_code === this.code);
      let tempArr = [...data];
      this.myControl.setValue(tempArr[0]);
    } else if(!this.code && !this.contactNumber) {
      this.code = this.defaultCode[0].dial_code;
      this.countryCodeEvent.emit(this.code);

      let data;
      data = this.CountryCodes.filter((data) => data.dial_code === this.code);
      let tempArr = [...data];
      this.myControl.setValue(tempArr[0]);
    }
    // else if(!this.code && this.contactNumber){
    //   let data;
    //   data = this.CountryCodes.filter((data) => data.dial_code === this.code);
    //   let tempArr = [...data];
    //   this.myControl.setValue(tempArr[0]);
    // }
    else{}

  }

  private _filter(value: string): CountryCodeModel[] {
    const filterValue = value.toLowerCase();
    return this.CountryCodes.filter((selctList) =>
      selctList.name.toLowerCase().includes(filterValue)
    );
  }

  // display data selected
  displayData(data) {
    return data && data?.dial_code;
  }
  //emited data
  select(selectedData) {
    this.countryCodeEvent.emit(selectedData?.dial_code);
  }
  //to clear control
  onClear() {
    this.myControl.setValue(null);
  }
}


