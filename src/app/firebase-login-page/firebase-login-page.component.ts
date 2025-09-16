import { FirebaseLoginPageService } from './firebase-login-page.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormControl, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Gallery, ProfileServices } from 'projects/customers/src/app/data-models';
import { Observable } from 'rxjs';
import { SearchService } from '../search/search.service';
import { finalize, take } from 'rxjs/operators';
import { AddNewServiceComponent } from '../add-new-service/add-new-service.component';
import { ConfirmationpopupComponent } from 'projects/customers/src/app/confirmationpopup/confirmationpopup.component';
import { ProfileConfirmationComponent } from '../profilemodule/profile-confirmation/profile-confirmation.component';
import { GalleryImagesComponent } from '../profilemodule/gallery-images/gallery-images.component';
import { AdminProfile, customFieldNamesData, SubUserProfile, SuperUserProfile } from '../data-models';
interface CountryCode {
  name: string,
  dial_code: string,
  code: string
};
export interface DialogDataOpinions {

  taskId: string
  smode: string;
  path: string;
  stage: string;
}
@Component({
  selector: 'app-firebase-login-page',
  templateUrl: './firebase-login-page.component.html',
  styleUrls: ['./firebase-login-page.component.scss']
})
export class FirebaseLoginPageComponent implements OnInit {
  user: firebase.default.UserInfo;
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  @ViewChild("placesRef") placesRef: GooglePlaceDirective;
  filteredOptions: Observable<string[]>;
  formattedAddress = "";
  profileState: string;
  filesvalue: File[] = [];
  files: File[] = [];
  isHovering: boolean;
  submittedPro: boolean = false;
  uploadReset: Observable<number>

  options = {
    componentRestrictions: {
      //  country:['IND']
    }
  }




  CountryCodes: Array<CountryCode> = [
    {
      "name": "Afghanistan",
      "dial_code": "+93",
      "code": "AF"
    },
    {
      "name": "Aland Islands",
      "dial_code": "+358",
      "code": "AX"
    },
    {
      "name": "Albania",
      "dial_code": "+355",
      "code": "AL"
    },
    {
      "name": "Algeria",
      "dial_code": "+213",
      "code": "DZ"
    },
    {
      "name": "AmericanSamoa",
      "dial_code": "+1 684",
      "code": "AS"
    },
    {
      "name": "Andorra",
      "dial_code": "+376",
      "code": "AD"
    },
    {
      "name": "Angola",
      "dial_code": "+244",
      "code": "AO"
    },
    {
      "name": "Anguilla",
      "dial_code": "+1 264",
      "code": "AI"
    },
    {
      "name": "Antarctica",
      "dial_code": "+672",
      "code": "AQ"
    },
    {
      "name": "Antigua and Barbuda",
      "dial_code": "+1268",
      "code": "AG"
    },
    {
      "name": "Argentina",
      "dial_code": "+54",
      "code": "AR"
    },
    {
      "name": "Armenia",
      "dial_code": "+374",
      "code": "AM"
    },
    {
      "name": "Aruba",
      "dial_code": "+297",
      "code": "AW"
    },
    {
      "name": "Australia",
      "dial_code": "+61",
      "code": "AU"
    },
    {
      "name": "Austria",
      "dial_code": "+43",
      "code": "AT"
    },
    {
      "name": "Azerbaijan",
      "dial_code": "+994",
      "code": "AZ"
    },
    {
      "name": "Bahamas",
      "dial_code": "+1 242",
      "code": "BS"
    },
    {
      "name": "Bahrain",
      "dial_code": "+973",
      "code": "BH"
    },
    {
      "name": "Bangladesh",
      "dial_code": "+880",
      "code": "BD"
    },
    {
      "name": "Barbados",
      "dial_code": "+1 246",
      "code": "BB"
    },
    {
      "name": "Belarus",
      "dial_code": "+375",
      "code": "BY"
    },
    {
      "name": "Belgium",
      "dial_code": "+32",
      "code": "BE"
    },
    {
      "name": "Belize",
      "dial_code": "+501",
      "code": "BZ"
    },
    {
      "name": "Benin",
      "dial_code": "+229",
      "code": "BJ"
    },
    {
      "name": "Bermuda",
      "dial_code": "+1 441",
      "code": "BM"
    },
    {
      "name": "Bhutan",
      "dial_code": "+975",
      "code": "BT"
    },
    {
      "name": "Bolivia, Plurinational State of",
      "dial_code": "+591",
      "code": "BO"
    },
    {
      "name": "Bosnia and Herzegovina",
      "dial_code": "+387",
      "code": "BA"
    },
    {
      "name": "Botswana",
      "dial_code": "+267",
      "code": "BW"
    },
    {
      "name": "Brazil",
      "dial_code": "+55",
      "code": "BR"
    },
    {
      "name": "British Indian Ocean Territory",
      "dial_code": "+246",
      "code": "IO"
    },
    {
      "name": "Brunei Darussalam",
      "dial_code": "+673",
      "code": "BN"
    },
    {
      "name": "Bulgaria",
      "dial_code": "+359",
      "code": "BG"
    },
    {
      "name": "Burkina Faso",
      "dial_code": "+226",
      "code": "BF"
    },
    {
      "name": "Burundi",
      "dial_code": "+257",
      "code": "BI"
    },
    {
      "name": "Cambodia",
      "dial_code": "+855",
      "code": "KH"
    },
    {
      "name": "Cameroon",
      "dial_code": "+237",
      "code": "CM"
    },
    {
      "name": "Canada",
      "dial_code": "+1",
      "code": "CA"
    },
    {
      "name": "Cape Verde",
      "dial_code": "+238",
      "code": "CV"
    },
    {
      "name": "Cayman Islands",
      "dial_code": "+ 345",
      "code": "KY"
    },
    {
      "name": "Central African Republic",
      "dial_code": "+236",
      "code": "CF"
    },
    {
      "name": "Chad",
      "dial_code": "+235",
      "code": "TD"
    },
    {
      "name": "Chile",
      "dial_code": "+56",
      "code": "CL"
    },
    {
      "name": "China",
      "dial_code": "+86",
      "code": "CN"
    },
    {
      "name": "Christmas Island",
      "dial_code": "+61",
      "code": "CX"
    },
    {
      "name": "Cocos (Keeling) Islands",
      "dial_code": "+61",
      "code": "CC"
    },
    {
      "name": "Colombia",
      "dial_code": "+57",
      "code": "CO"
    },
    {
      "name": "Comoros",
      "dial_code": "+269",
      "code": "KM"
    },
    {
      "name": "Congo",
      "dial_code": "+242",
      "code": "CG"
    },
    {
      "name": "Congo, The Democratic Republic of the Congo",
      "dial_code": "+243",
      "code": "CD"
    },
    {
      "name": "Cook Islands",
      "dial_code": "+682",
      "code": "CK"
    },
    {
      "name": "Costa Rica",
      "dial_code": "+506",
      "code": "CR"
    },
    {
      "name": "Cote d'Ivoire",
      "dial_code": "+225",
      "code": "CI"
    },
    {
      "name": "Croatia",
      "dial_code": "+385",
      "code": "HR"
    },
    {
      "name": "Cuba",
      "dial_code": "+53",
      "code": "CU"
    },
    {
      "name": "Cyprus",
      "dial_code": "+357",
      "code": "CY"
    },
    {
      "name": "Czech Republic",
      "dial_code": "+420",
      "code": "CZ"
    },
    {
      "name": "Denmark",
      "dial_code": "+45",
      "code": "DK"
    },
    {
      "name": "Djibouti",
      "dial_code": "+253",
      "code": "DJ"
    },
    {
      "name": "Dominica",
      "dial_code": "+1 767",
      "code": "DM"
    },
    {
      "name": "Dominican Republic",
      "dial_code": "+1 849",
      "code": "DO"
    },
    {
      "name": "Ecuador",
      "dial_code": "+593",
      "code": "EC"
    },
    {
      "name": "Egypt",
      "dial_code": "+20",
      "code": "EG"
    },
    {
      "name": "El Salvador",
      "dial_code": "+503",
      "code": "SV"
    },
    {
      "name": "Equatorial Guinea",
      "dial_code": "+240",
      "code": "GQ"
    },
    {
      "name": "Eritrea",
      "dial_code": "+291",
      "code": "ER"
    },
    {
      "name": "Estonia",
      "dial_code": "+372",
      "code": "EE"
    },
    {
      "name": "Ethiopia",
      "dial_code": "+251",
      "code": "ET"
    },
    {
      "name": "Falkland Islands (Malvinas)",
      "dial_code": "+500",
      "code": "FK"
    },
    {
      "name": "Faroe Islands",
      "dial_code": "+298",
      "code": "FO"
    },
    {
      "name": "Fiji",
      "dial_code": "+679",
      "code": "FJ"
    },
    {
      "name": "Finland",
      "dial_code": "+358",
      "code": "FI"
    },
    {
      "name": "France",
      "dial_code": "+33",
      "code": "FR"
    },
    {
      "name": "French Guiana",
      "dial_code": "+594",
      "code": "GF"
    },
    {
      "name": "French Polynesia",
      "dial_code": "+689",
      "code": "PF"
    },
    {
      "name": "Gabon",
      "dial_code": "+241",
      "code": "GA"
    },
    {
      "name": "Gambia",
      "dial_code": "+220",
      "code": "GM"
    },
    {
      "name": "Georgia",
      "dial_code": "+995",
      "code": "GE"
    },
    {
      "name": "Germany",
      "dial_code": "+49",
      "code": "DE"
    },
    {
      "name": "Ghana",
      "dial_code": "+233",
      "code": "GH"
    },
    {
      "name": "Gibraltar",
      "dial_code": "+350",
      "code": "GI"
    },
    {
      "name": "Greece",
      "dial_code": "+30",
      "code": "GR"
    },
    {
      "name": "Greenland",
      "dial_code": "+299",
      "code": "GL"
    },
    {
      "name": "Grenada",
      "dial_code": "+1 473",
      "code": "GD"
    },
    {
      "name": "Guadeloupe",
      "dial_code": "+590",
      "code": "GP"
    },
    {
      "name": "Guam",
      "dial_code": "+1 671",
      "code": "GU"
    },
    {
      "name": "Guatemala",
      "dial_code": "+502",
      "code": "GT"
    },
    {
      "name": "Guernsey",
      "dial_code": "+44",
      "code": "GG"
    },
    {
      "name": "Guinea",
      "dial_code": "+224",
      "code": "GN"
    },
    {
      "name": "Guinea-Bissau",
      "dial_code": "+245",
      "code": "GW"
    },
    {
      "name": "Guyana",
      "dial_code": "+595",
      "code": "GY"
    },
    {
      "name": "Haiti",
      "dial_code": "+509",
      "code": "HT"
    },
    {
      "name": "Holy See (Vatican City State)",
      "dial_code": "+379",
      "code": "VA"
    },
    {
      "name": "Honduras",
      "dial_code": "+504",
      "code": "HN"
    },
    {
      "name": "Hong Kong",
      "dial_code": "+852",
      "code": "HK"
    },
    {
      "name": "Hungary",
      "dial_code": "+36",
      "code": "HU"
    },
    {
      "name": "Iceland",
      "dial_code": "+354",
      "code": "IS"
    },
    {
      "name": "India",
      "dial_code": "+91",
      "code": "IN"
    },
    {
      "name": "Indonesia",
      "dial_code": "+62",
      "code": "ID"
    },
    {
      "name": "Iran, Islamic Republic of Persian Gulf",
      "dial_code": "+98",
      "code": "IR"
    },
    {
      "name": "Iraq",
      "dial_code": "+964",
      "code": "IQ"
    },
    {
      "name": "Ireland",
      "dial_code": "+353",
      "code": "IE"
    },
    {
      "name": "Isle of Man",
      "dial_code": "+44",
      "code": "IM"
    },
    {
      "name": "Israel",
      "dial_code": "+972",
      "code": "IL"
    },
    {
      "name": "Italy",
      "dial_code": "+39",
      "code": "IT"
    },
    {
      "name": "Jamaica",
      "dial_code": "+1 876",
      "code": "JM"
    },
    {
      "name": "Japan",
      "dial_code": "+81",
      "code": "JP"
    },
    {
      "name": "Jersey",
      "dial_code": "+44",
      "code": "JE"
    },
    {
      "name": "Jordan",
      "dial_code": "+962",
      "code": "JO"
    },
    {
      "name": "Kazakhstan",
      "dial_code": "+7 7",
      "code": "KZ"
    },
    {
      "name": "Kenya",
      "dial_code": "+254",
      "code": "KE"
    },
    {
      "name": "Kiribati",
      "dial_code": "+686",
      "code": "KI"
    },
    {
      "name": "Korea, Democratic People's Republic of Korea",
      "dial_code": "+850",
      "code": "KP"
    },
    {
      "name": "Korea, Republic of South Korea",
      "dial_code": "+82",
      "code": "KR"
    },
    {
      "name": "Kuwait",
      "dial_code": "+965",
      "code": "KW"
    },
    {
      "name": "Kyrgyzstan",
      "dial_code": "+996",
      "code": "KG"
    },
    {
      "name": "Laos",
      "dial_code": "+856",
      "code": "LA"
    },
    {
      "name": "Latvia",
      "dial_code": "+371",
      "code": "LV"
    },
    {
      "name": "Lebanon",
      "dial_code": "+961",
      "code": "LB"
    },
    {
      "name": "Lesotho",
      "dial_code": "+266",
      "code": "LS"
    },
    {
      "name": "Liberia",
      "dial_code": "+231",
      "code": "LR"
    },
    {
      "name": "Libyan Arab Jamahiriya",
      "dial_code": "+218",
      "code": "LY"
    },
    {
      "name": "Liechtenstein",
      "dial_code": "+423",
      "code": "LI"
    },
    {
      "name": "Lithuania",
      "dial_code": "+370",
      "code": "LT"
    },
    {
      "name": "Luxembourg",
      "dial_code": "+352",
      "code": "LU"
    },
    {
      "name": "Macao",
      "dial_code": "+853",
      "code": "MO"
    },
    {
      "name": "Macedonia",
      "dial_code": "+389",
      "code": "MK"
    },
    {
      "name": "Madagascar",
      "dial_code": "+261",
      "code": "MG"
    },
    {
      "name": "Malawi",
      "dial_code": "+265",
      "code": "MW"
    },
    {
      "name": "Malaysia",
      "dial_code": "+60",
      "code": "MY"
    },
    {
      "name": "Maldives",
      "dial_code": "+960",
      "code": "MV"
    },
    {
      "name": "Mali",
      "dial_code": "+223",
      "code": "ML"
    },
    {
      "name": "Malta",
      "dial_code": "+356",
      "code": "MT"
    },
    {
      "name": "Marshall Islands",
      "dial_code": "+692",
      "code": "MH"
    },
    {
      "name": "Martinique",
      "dial_code": "+596",
      "code": "MQ"
    },
    {
      "name": "Mauritania",
      "dial_code": "+222",
      "code": "MR"
    },
    {
      "name": "Mauritius",
      "dial_code": "+230",
      "code": "MU"
    },
    {
      "name": "Mayotte",
      "dial_code": "+262",
      "code": "YT"
    },
    {
      "name": "Mexico",
      "dial_code": "+52",
      "code": "MX"
    },
    {
      "name": "Micronesia, Federated States of Micronesia",
      "dial_code": "+691",
      "code": "FM"
    },
    {
      "name": "Moldova",
      "dial_code": "+373",
      "code": "MD"
    },
    {
      "name": "Monaco",
      "dial_code": "+377",
      "code": "MC"
    },
    {
      "name": "Mongolia",
      "dial_code": "+976",
      "code": "MN"
    },
    {
      "name": "Montenegro",
      "dial_code": "+382",
      "code": "ME"
    },
    {
      "name": "Montserrat",
      "dial_code": "+1664",
      "code": "MS"
    },
    {
      "name": "Morocco",
      "dial_code": "+212",
      "code": "MA"
    },
    {
      "name": "Mozambique",
      "dial_code": "+258",
      "code": "MZ"
    },
    {
      "name": "Myanmar",
      "dial_code": "+95",
      "code": "MM"
    },
    {
      "name": "Namibia",
      "dial_code": "+264",
      "code": "NA"
    },
    {
      "name": "Nauru",
      "dial_code": "+674",
      "code": "NR"
    },
    {
      "name": "Nepal",
      "dial_code": "+977",
      "code": "NP"
    },
    {
      "name": "Netherlands",
      "dial_code": "+31",
      "code": "NL"
    },
    {
      "name": "Netherlands Antilles",
      "dial_code": "+599",
      "code": "AN"
    },
    {
      "name": "New Caledonia",
      "dial_code": "+687",
      "code": "NC"
    },
    {
      "name": "New Zealand",
      "dial_code": "+64",
      "code": "NZ"
    },
    {
      "name": "Nicaragua",
      "dial_code": "+505",
      "code": "NI"
    },
    {
      "name": "Niger",
      "dial_code": "+227",
      "code": "NE"
    },
    {
      "name": "Nigeria",
      "dial_code": "+234",
      "code": "NG"
    },
    {
      "name": "Niue",
      "dial_code": "+683",
      "code": "NU"
    },
    {
      "name": "Norfolk Island",
      "dial_code": "+672",
      "code": "NF"
    },
    {
      "name": "Northern Mariana Islands",
      "dial_code": "+1 670",
      "code": "MP"
    },
    {
      "name": "Norway",
      "dial_code": "+47",
      "code": "NO"
    },
    {
      "name": "Oman",
      "dial_code": "+968",
      "code": "OM"
    },
    {
      "name": "Pakistan",
      "dial_code": "+92",
      "code": "PK"
    },
    {
      "name": "Palau",
      "dial_code": "+680",
      "code": "PW"
    },
    {
      "name": "Palestinian Territory, Occupied",
      "dial_code": "+970",
      "code": "PS"
    },
    {
      "name": "Panama",
      "dial_code": "+507",
      "code": "PA"
    },
    {
      "name": "Papua New Guinea",
      "dial_code": "+675",
      "code": "PG"
    },
    {
      "name": "Paraguay",
      "dial_code": "+595",
      "code": "PY"
    },
    {
      "name": "Peru",
      "dial_code": "+51",
      "code": "PE"
    },
    {
      "name": "Philippines",
      "dial_code": "+63",
      "code": "PH"
    },
    {
      "name": "Pitcairn",
      "dial_code": "+872",
      "code": "PN"
    },
    {
      "name": "Poland",
      "dial_code": "+48",
      "code": "PL"
    },
    {
      "name": "Portugal",
      "dial_code": "+351",
      "code": "PT"
    },
    {
      "name": "Puerto Rico",
      "dial_code": "+1 939",
      "code": "PR"
    },
    {
      "name": "Qatar",
      "dial_code": "+974",
      "code": "QA"
    },
    {
      "name": "Romania",
      "dial_code": "+40",
      "code": "RO"
    },
    {
      "name": "Russia",
      "dial_code": "+7",
      "code": "RU"
    },
    {
      "name": "Rwanda",
      "dial_code": "+250",
      "code": "RW"
    },
    {
      "name": "Reunion",
      "dial_code": "+262",
      "code": "RE"
    },
    {
      "name": "Saint Barthelemy",
      "dial_code": "+590",
      "code": "BL"
    },
    {
      "name": "Saint Helena, Ascension and Tristan Da Cunha",
      "dial_code": "+290",
      "code": "SH"
    },
    {
      "name": "Saint Kitts and Nevis",
      "dial_code": "+1 869",
      "code": "KN"
    },
    {
      "name": "Saint Lucia",
      "dial_code": "+1 758",
      "code": "LC"
    },
    {
      "name": "Saint Martin",
      "dial_code": "+590",
      "code": "MF"
    },
    {
      "name": "Saint Pierre and Miquelon",
      "dial_code": "+508",
      "code": "PM"
    },
    {
      "name": "Saint Vincent and the Grenadines",
      "dial_code": "+1 784",
      "code": "VC"
    },
    {
      "name": "Samoa",
      "dial_code": "+685",
      "code": "WS"
    },
    {
      "name": "San Marino",
      "dial_code": "+378",
      "code": "SM"
    },
    {
      "name": "Sao Tome and Principe",
      "dial_code": "+239",
      "code": "ST"
    },
    {
      "name": "Saudi Arabia",
      "dial_code": "+966",
      "code": "SA"
    },
    {
      "name": "Senegal",
      "dial_code": "+221",
      "code": "SN"
    },
    {
      "name": "Serbia",
      "dial_code": "+381",
      "code": "RS"
    },
    {
      "name": "Seychelles",
      "dial_code": "+248",
      "code": "SC"
    },
    {
      "name": "Sierra Leone",
      "dial_code": "+232",
      "code": "SL"
    },
    {
      "name": "Singapore",
      "dial_code": "+65",
      "code": "SG"
    },
    {
      "name": "Slovakia",
      "dial_code": "+421",
      "code": "SK"
    },
    {
      "name": "Slovenia",
      "dial_code": "+386",
      "code": "SI"
    },
    {
      "name": "Solomon Islands",
      "dial_code": "+677",
      "code": "SB"
    },
    {
      "name": "Somalia",
      "dial_code": "+252",
      "code": "SO"
    },
    {
      "name": "South Africa",
      "dial_code": "+27",
      "code": "ZA"
    },
    {
      "name": "South Georgia and the South Sandwich Islands",
      "dial_code": "+500",
      "code": "GS"
    },
    {
      "name": "Spain",
      "dial_code": "+34",
      "code": "ES"
    },
    {
      "name": "Sri Lanka",
      "dial_code": "+94",
      "code": "LK"
    },
    {
      "name": "Sudan",
      "dial_code": "+249",
      "code": "SD"
    },
    {
      "name": "Suriname",
      "dial_code": "+597",
      "code": "SR"
    },
    {
      "name": "Svalbard and Jan Mayen",
      "dial_code": "+47",
      "code": "SJ"
    },
    {
      "name": "Swaziland",
      "dial_code": "+268",
      "code": "SZ"
    },
    {
      "name": "Sweden",
      "dial_code": "+46",
      "code": "SE"
    },
    {
      "name": "Switzerland",
      "dial_code": "+41",
      "code": "CH"
    },
    {
      "name": "Syrian Arab Republic",
      "dial_code": "+963",
      "code": "SY"
    },
    {
      "name": "Taiwan",
      "dial_code": "+886",
      "code": "TW"
    },
    {
      "name": "Tajikistan",
      "dial_code": "+992",
      "code": "TJ"
    },
    {
      "name": "Tanzania, United Republic of Tanzania",
      "dial_code": "+255",
      "code": "TZ"
    },
    {
      "name": "Thailand",
      "dial_code": "+66",
      "code": "TH"
    },
    {
      "name": "Timor-Leste",
      "dial_code": "+670",
      "code": "TL"
    },
    {
      "name": "Togo",
      "dial_code": "+228",
      "code": "TG"
    },
    {
      "name": "Tokelau",
      "dial_code": "+690",
      "code": "TK"
    },
    {
      "name": "Tonga",
      "dial_code": "+676",
      "code": "TO"
    },
    {
      "name": "Trinidad and Tobago",
      "dial_code": "+1 868",
      "code": "TT"
    },
    {
      "name": "Tunisia",
      "dial_code": "+216",
      "code": "TN"
    },
    {
      "name": "Turkey",
      "dial_code": "+90",
      "code": "TR"
    },
    {
      "name": "Turkmenistan",
      "dial_code": "+993",
      "code": "TM"
    },
    {
      "name": "Turks and Caicos Islands",
      "dial_code": "+1 649",
      "code": "TC"
    },
    {
      "name": "Tuvalu",
      "dial_code": "+688",
      "code": "TV"
    },
    {
      "name": "Uganda",
      "dial_code": "+256",
      "code": "UG"
    },
    {
      "name": "Ukraine",
      "dial_code": "+380",
      "code": "UA"
    },
    {
      "name": "United Arab Emirates",
      "dial_code": "+971",
      "code": "AE"
    },
    {
      "name": "United Kingdom",
      "dial_code": "+44",
      "code": "GB"
    },
    {
      "name": "United States",
      "dial_code": "+1",
      "code": "US"
    },
    {
      "name": "Uruguay",
      "dial_code": "+598",
      "code": "UY"
    },
    {
      "name": "Uzbekistan",
      "dial_code": "+998",
      "code": "UZ"
    },
    {
      "name": "Vanuatu",
      "dial_code": "+678",
      "code": "VU"
    },
    {
      "name": "Venezuela, Bolivarian Republic of Venezuela",
      "dial_code": "+58",
      "code": "VE"
    },
    {
      "name": "Vietnam",
      "dial_code": "+84",
      "code": "VN"
    },
    {
      "name": "Virgin Islands, British",
      "dial_code": "+1 284",
      "code": "VG"
    },
    {
      "name": "Virgin Islands, U.S.",
      "dial_code": "+1 340",
      "code": "VI"
    },
    {
      "name": "Wallis and Futuna",
      "dial_code": "+681",
      "code": "WF"
    },
    {
      "name": "Yemen",
      "dial_code": "+967",
      "code": "YE"
    },
    {
      "name": "Zambia",
      "dial_code": "+260",
      "code": "ZM"
    },
    {
      "name": "Zimbabwe",
      "dial_code": "+263",
      "code": "ZW"
    }
  ];
  uploadProgress2$: Observable<number>
  uploadProgress3$: Observable<number>
  uploadProgress4$: Observable<number>
  snapshot: Observable<any>;
  saleStatus: any = ['Inquiry', 'Opportunity', 'Confirmed', 'Completed', 'Dropped'];
  customerStatus: any = ['Lead', 'Prospect', 'Opportunity', 'Customer', 'Rejected']
  customerStatusOpn: string = 'Lead,Prospect,Opportunity,Customer,Rejected';
  saleStatusOpn: string = 'Inquiry,Opportunity,Confirmed,Completed,Dropped';
  custLeadOpn: string = 'Online,Offline';
  custLead: any = ['Online', 'Offline'];
  date = new Date().getTime();
  createdOnce: boolean = false;
  freeDateend = new Date();
  dpUploaded: boolean;
  profileDistrict: any[];
  submitted: boolean;
  imageURL: string; l
  form: any;
  profileAct: boolean = true;
  forms: any;
  locationId: any;
  thumbnailURL2: any;
  isTabletsize: boolean = false;
  isMobilesize: boolean = false;
  districtVar: boolean;
  categories: string;
  templatePath: any;
  templatePath2: any;
  templatePathP1: any;
  templatePathP12: any;
  templatePathP13: any;
  templatePathP2: any;
  templatePathP22: any;
  templatePathP23: any;
  templatePathP3: any;
  templatePathP32: any;
  templatePathP33: any;
  thumbnailP1: string;
  thumbnailP1s: string
  thumbnailP1vs: string
  thumbnailP2: string;
  thumbnailP2s: string
  thumbnailP2vs: string
  isCompleted:boolean=false;
  thumbnailP3: string;
  thumbnailP3vs: string
  thumbnailP3s: string
  sublocality: any = "";
  data: any;
  plan: string = 'free';
  thumb2: boolean = false;
  thumb1: boolean = false;
  thumbnailURL: any;
  profileCountry: string;
  uid: string;
  value: any;
  category: boolean = false;
  id: any;
  profileLocality: any;
  superUserProfileData: any;
  AdminProfileData: any;
  SubUserProfileData: any;
  profileStreet: any;
  gallery: Gallery[];
  ProfileImage1: any = "assets/images/default.png";
  ProfileImage2: any = "assets/images/default.png";
  ProfileImage3: any = "assets/images/default.png";
  profileImages: Gallery[];
  profileService: ProfileServices[];
  mode: string;
  fullAddress: any;
  locationIds: any;

  countryCode: any;
  checked: boolean;
  pricing: boolean;
  districts: any = [];
  districted: any;
  hiddenProfile: boolean = true;
  profileId: string;
  myControl = new FormControl();
  categoryList: string[] = [];
  tasks: any;
  userId: any;
  publicProfileId: any;
  loggedIn: boolean;
  downloadURL1: Observable<any>;
  userDp: any;



  constructor(private searchService: SearchService, private _bottomSheet: MatBottomSheet, public dialog: MatDialog, private afAuth: AngularFireAuth, private storage: AngularFireStorage,
    private router: Router, private _snackBar: MatSnackBar, private breakpointObserver: BreakpointObserver,
    private dbs: AngularFirestore, private db: FirebaseLoginPageService, private _location: Location) {
      breakpointObserver.observe([
        Breakpoints.TabletLandscape,
        Breakpoints.TabletPortrait
      ]).subscribe(result => {
        if (result.matches) {
          this.isTabletsize = true;
        }
        else {
          this.isTabletsize = false;
        }
      });
      breakpointObserver.observe([
        Breakpoints.HandsetLandscape,
        Breakpoints.HandsetPortrait
      ]).subscribe(result => {
        if (result.matches) {
          this.isMobilesize = true;
        }
        else {
          this.isMobilesize = false;
        }
      });
  
    this.categoryList = this.searchService.getCategory()
  }

  ngOnInit(): void {
    this.mode = 'create';
    // this.createdOnce=false;
    this.loggedIn = false;
    this.superUserProfileData = SuperUserProfile.data;
    this.AdminProfileData = AdminProfile.data2;
    this.SubUserProfileData = SubUserProfile.data3;
    this.afAuth.authState.subscribe(user => {
      if (user) {

        this.userId = user.uid;
        if (this.userId) {
          this.loggedIn = true;
        }
        this.db.getProfile('/users', this.userId).pipe(take(1)).subscribe(p => {
          if (p) {

            this.mode = 'update';
            this.isCompleted=true;
            this.publicProfileId = p.publicProfileID;

          
            this.hiddenProfile = false;
            this.db.getProfile('/public-profile', this.publicProfileId).pipe(take(1)).subscribe(p => {
              if (p) {
                this.form = p;
                this.countryCode = this.form?.countryCode
                if (!this.form?.countryCode) {
                  this.countryCode = "+91";
                }
                this.profileCountry = this.form?.profileCountry;
                this.profileState = this.form?.profileState;
                this.profileDistrict = this.form?.profileDistrict;
                this.categories = this.form?.category;
                this.profileStreet = this.form?.profileStreet;
                this.profileLocality = this.form?.profileLocality;
                this.fullAddress = this.form?.fullAddress;
                this.locationIds = this.form?.locationId;
                this.sublocality = this.form?.sublocality;
                this.profileAct = this.form?.publicProfileActv;
                if (this.form?.dpImage == true) {
                  if (this.userId) {
                    //getting dp image using id
                    const userStorageRef3 = firebase.default.storage().ref().child('dp/' + this.userId);
                    userStorageRef3.getDownloadURL().then(url3 => {
                      this.userDp = url3
                    });
                  }
                }
                //getting gallery images
                this.afAuth.authState.subscribe(user => {
                  if (user) {
                    this.user = user;
                    this.db.getGallery(this.publicProfileId).subscribe(data => {
                      this.gallery = data.map(e => {
                        return {
                          id: e.payload.doc.id,
                          ...e.payload.doc.data() as {}
                        } as Gallery
                      });
                    })
                  }
                })
                //getting profile images
                this.afAuth.authState.subscribe(user => {
                  if (user) {
                    this.user = user;
                    this.db.getProfileImages(this.publicProfileId).subscribe(data => {
                      this.profileImages = data.map(e => {
                        return {
                          id: e.payload.doc.id,
                          ...e.payload.doc.data() as {}
                        } as Gallery
                      });
                    })
                  }
                })
                //getting services
                this.afAuth.authState.subscribe(user => {
                  if (user) {
                    this.user = user;
                    this.db.getServices(this.publicProfileId).subscribe(data => {
                      this.profileService = data.map(e => {
                        return {
                          id: e.payload.doc.id,
                          ...e.payload.doc.data() as {}
                        } as ProfileServices;

                      })
                    });
                  }
                })
                //set a interval such that Top 3 images to load faster and not connected to db
                setInterval(() => {
                  if (this.profileImages?.length != 0) {

                    let check1 = "1";
                    let check2 = "2";
                    let check3 = "3"

                    if (this.profileImages) {
                      let images1 = (check1) ? this.profileImages?.filter((p) =>
                        p.id?.includes(check1)) : this.profileImages;
                      this.ProfileImage1 = images1[0]?.thumbnailURL;
                      let images2 = (check2) ? this.profileImages?.filter((p) =>
                        p.id?.includes(check2)) : this.profileImages;
                      this.ProfileImage2 = images2[0]?.thumbnailURL;
                      let images3 = (check3) ? this.profileImages?.filter((p) =>
                        p.id?.includes(check3)) : this.profileImages;
                      this.ProfileImage3 = images3[0]?.thumbnailURL;
                      if (!this.ProfileImage1) {
                        this.ProfileImage1 = "assets/images/default.png";
                      }
                      if (!this.ProfileImage2) {
                        this.ProfileImage2 = "assets/images/default.png";
                      }
                      if (!this.ProfileImage3) {
                        this.ProfileImage3 = "assets/images/default.png";
                      }
                    }

                  }
                  //for checking current category

                }, 400)



              }
            });
          }
        })


      }
      setInterval(() => {
        if (this.categories == "Others") {
          this.value = "on";

        }
        else {
          this.value = "off";
        }
      }, 200)
    })

  }

  async loginWithGoogle() {

    await this.afAuth.signInWithPopup(new firebase.default.auth.GoogleAuthProvider()).then(() => {
      // this.router.navigate(['admin/list']);
    })



  }
  preview(){
    
   
    window.open(`https://zenys.org/profilessr/`+this.publicProfileId);
  }
  addService() {
    
    if (this.profileService?.length < 5) {
      this.dialog.open(AddNewServiceComponent, {
        width: '700px',
        // height:'470px',
        data: {
          profileId: this.publicProfileId
        }
      });
    }
    else {
      this.dialog.open(ConfirmationpopupComponent, {
        data: {
          smode: "profileServiceMax"
        }
      });
    }
  }
  openL() {
    //logo selector fn
    let element: HTMLElement = document.getElementsByClassName('logo-selector')[0] as HTMLElement;
    element.click();

  }
  logOut() {
    this.afAuth.signOut();
    window.location.reload()
  }
  onDrop(files: FileList) {
    console.log(files)
    //funtion for drag and drop gallery images
    for (let i = 0; i < files.length; i++) {
      this.files.push(files.item(i));
      
    }
  

  }
  deleteServices(id, filename, url) {
    this.dialog.open(ProfileConfirmationComponent, {
      data: {
        taskId: id, smode: "serviceDeleteProfile", title: filename,
        userId: this.publicProfileId, url: url

      }
    });
  }
  editServices(id) {
    this.dialog.open(AddNewServiceComponent, {
      width: '700px',
      data: {
        serviceId: id,
        profileId: this.publicProfileId
        // imageLink:link,
      }
    });
  }
  viewImage(id: string, link: string) {

    this.dialog.open(GalleryImagesComponent, {
      // maxWidth:'80%',
      // maxHeight:'80%',
      data: {
        imageId: id,
        imageLink: link,
        userId: this.publicProfileId,
      },
      backdropClass: 'backdropBackground' // This is the "wanted" line
    });
  }
  deleteImage(id: string, path: string, path1: string) {

    this.dialog.open(ProfileConfirmationComponent, {
      data: {
        taskId: id, smode: "imageDelete", path: path,
        orginalPath: path1
      }
    });
  }
  //google maps api funtion call
  public handleAddressChange(address: any) {
    this.profileCountry = "";
    this.profileDistrict = null;
    this.profileState = "";
    this.profileStreet = "";
    this.profileLocality = "";
    let addressArray = address.address_components
    this.locationId = address.place_id
    //  console.log(addressArray)
    //  console.log(addressArray[1].long_name)
    addressArray.forEach(element => {
      if (element.types[0] == 'country') {
        this.profileCountry = element.long_name;
      }
      else if (element.types[0] == 'administrative_area_level_2') {
        this.profileDistrict = element.long_name;
      }
      else if (element.types[0] == 'administrative_area_level_1') {
        this.profileState = element.long_name;
      }
      else if (element.types[0] == 'route') {
        this.profileStreet = element.long_name;
      }
      else if (element.types[0] == 'locality') {
        this.profileLocality = element.long_name;
      }
      else if (element.types[0] == 'sublocality_level_1') {
        this.sublocality = element.long_name;
      }


    });
    this.fullAddress = address.formatted_address
    this.formattedAddress = address.formatted_address
  }
  TypeError() {
    //showing error in the toastng window
    this.submitted = true;
  }
  refreshSubscription() {
    setTimeout(() => {
      this.db.getProfile('/users', this.userId).pipe(take(1)).subscribe(p => {
        if (p) {

          this.mode = 'update';
          this.publicProfileId = p.publicProfileID;
          this.afAuth.authState.subscribe(user => {
            if (user) {
              this.user = user;
              this.db.getGallery(this.publicProfileId).subscribe(data => {
                this.gallery = data.map(e => {
                  return {
                    id: e.payload.doc.id,
                    ...e.payload.doc.data() as {}
                  } as Gallery
                });
              })
            }
          })
          //getting profile images
          this.afAuth.authState.subscribe(user => {
            if (user) {
              this.user = user;
              this.db.getProfileImages(this.publicProfileId).subscribe(data => {
                this.profileImages = data.map(e => {
                  return {
                    id: e.payload.doc.id,
                    ...e.payload.doc.data() as {}
                  } as Gallery
                });
              })
            }
          })
          //getting services
          this.afAuth.authState.subscribe(user => {
            if (user) {
              this.user = user;
              this.db.getServices(this.publicProfileId).subscribe(data => {
                this.profileService = data.map(e => {
                  return {
                    id: e.payload.doc.id,
                    ...e.payload.doc.data() as {}
                  } as ProfileServices;

                })
              });
            }
          })
        }
      })
    }, 5000)
  }
 
  onSubmit(form) {
    let first;
    let firstValue;
    let path;
    let publicProfileId
    let datePlaced = new Date().getTime();

    if (!form.value.website) {
      form.value.website = ""
    }

    if (!form.value.linkedin) {
      form.value.linkedin = ""
    }
    if (!form.value.instagram) {
      form.value.instagram = ""
    }
    if (!form.value.facebook) {
      form.value.facebook = ""
    }
    if (this.mode == 'create' && this.createdOnce == false) {
      //creating profile
    

      if (form.value.profileCompany) {
        firstValue = form.value.profileCompany;
        first = firstValue.replace(/[^a-zA-Z ]/g, "");
      } else {
        firstValue = form.value.profileFirstname;
        first = firstValue.replace(/[^a-zA-Z ]/g, "");
      }
      form.value.profileState = this.profileState

      form.value.profileDistrict = this.profileDistrict
      form.value.fullAddress = this.fullAddress
      form.value.locationId = this.locationId
      if (!form.value.locationId) {
        form.value.locationId = this.locationIds
      }
      form.value.profileCountry = this.profileCountry
      var interv = setInterval(() => {
        let random = Math.floor((Math.random() * 100000) + 1);

        publicProfileId = first + random;
        this.db.getpublicProf(publicProfileId).pipe(take(1)).subscribe(p => this.data = p);
        if (!this.data) {

          clearInterval(interv)
          this.isCompleted=true;
          // this.db.createProfile(this.userId);
          this.db.getProfile('/public-profile', publicProfileId).pipe(take(1)).subscribe(p => {
            if (p) {
             
              this.db.publicProfileUpdate(publicProfileId, form.value, this.userId, datePlaced).then(()=>{
                this.db.create(this.superUserProfileData,this.userId).catch((e) => {
                  console.log(e);
                });
                // adding Admin profile to DB
                this.db.create(this.AdminProfileData,this.userId).catch((e) => {
                  console.log(e);
                });
                // adding SubUser profile to DB
                this.db.create(this.SubUserProfileData,this.userId).catch((e) => {
                  console.log(e);

                });
                let customf = customFieldNamesData.data
                this.db.createCustomFieldNames(customf,this.userId)
                .then(res => {
                  console.log("field names added")
                })
              });
              this.publicProfileId = publicProfileId;
              this.createdOnce = true;
            }
            else {
              
              this.db.publicProfile(publicProfileId, form.value, this.userId, datePlaced);
              let publicId = publicProfileId; let email = form.value.profileEmail; let firstName = form.value.profileFirstname; let lastName = form.value.profileLastname; let code = form.value.countryCode; let phone = form.value.profilePhone; let company = form.value.profileCompany; let category = form.value.category
              this.db.createProfileValues(this.userId, publicId, firstName, lastName, code, phone, company, category, this.date, this.saleStatus, this.customerStatus, this.plan, this.freeDateend, this.customerStatusOpn, this.saleStatusOpn, this.custLeadOpn, this.custLead, email).then(()=>{
                this.db.create(this.superUserProfileData,this.userId).catch((e) => {
                  console.log(e);
                });
                // adding Admin profile to DB
                this.db.create(this.AdminProfileData,this.userId).catch((e) => {
                  console.log(e);
                });
                // adding SubUser profile to DB
                this.db.create(this.SubUserProfileData,this.userId).catch((e) => {
                  console.log(e);

                });
                let customf = customFieldNamesData.data
                this.db.createCustomFieldNames(customf,this.userId)
                .then(res => {
                  console.log("field names added")
                })
              });
              this.publicProfileId = publicProfileId;
            }
          })



        }


      }, 500)

      if (this.dpUploaded == true) {
        setTimeout(() => {
          //added timeout that we can update boolean after data being created

          this.db.dpTrue(this.publicProfileId);
        }, 5000)

      }


      this.refreshSubscription()
      this._snackBar.open("Public profile created successfully", "done", {
        duration: 5000,
      });
      this.hiddenProfile = false;
      this.submittedPro = true;
      this.createdOnce = true;



    }
    else {
      //updating profile
      form.value.profileState = this.profileState
      form.value.profileCountry = this.profileCountry
      form.value.profileDistrict = this.profileDistrict
      form.value.fullAddress = this.fullAddress
      form.value.locationId = this.locationId
      if (!form.value.locationId) {
        form.value.locationId = this.locationIds
      }


      this.db.updatePublicProfile(this.publicProfileId, form.value, this.userId, datePlaced)
      if (this.dpUploaded == true) {

        this.db.dpTrue(this.publicProfileId);
      }
      this._snackBar.open("Profile updated successfully", "done", {
        duration: 5000,
      });




    }
  }
  toggleHover(event: boolean) {
    this.isHovering = event;
  }
  close() {
    this._location.back();
  }
  // --------------------------profile images upload 1--------------------------
  open1() {

    let element: HTMLElement = document.getElementsByClassName('dp-selector')[0] as HTMLElement;
    element.click();
  }
  startUpload1(event: FileList) {
    const file = event.item(0)


    const dpPath = `dp/${this.userId}`;
    this.tasks = this.storage.upload(dpPath, file)

    const ref = this.storage.ref(dpPath);
    // console.log( this.publicProfileId)
    // console.log('Image uploaded!');
    this.tasks.snapshotChanges().pipe(
      finalize(() => {

        this.downloadURL1 = ref.getDownloadURL()
        this.downloadURL1.subscribe(url1 => (this.userDp = url1));
        this.dpUploaded = true;

      })
    )
      .subscribe();

  }
  upload1() {
    let element: HTMLElement = document.getElementsByClassName('proImg1-selector')[0] as HTMLElement;
    element.click();
  }
  proImg1(filesvalue: FileList) {
    for (let i = 0; i < filesvalue.length; i++) {
      this.filesvalue.push(filesvalue.item(i));
    }
    // The storage path
    let str1 = filesvalue[0].name.split(".");
  
    let thumbname = str1[0] + "_720x480.webp";
    let thumbname2 = str1[0] + "_1920x1080.webp";
    let thumbname3 = str1[0] + "_375x250.webp";
    const path = `gallery/${this.userId}/${Date.now()}_${filesvalue[0].name}`;
    this.templatePathP1 = `gallery/${this.userId}/thumbnails/${Date.now()}_${thumbname}`
    this.templatePathP12 = `gallery/${this.userId}/thumbnails/${Date.now()}_${thumbname2}`
    this.templatePathP13 = `gallery/${this.userId}/thumbnails/${Date.now()}_${thumbname3}`
    // Reference to storage bucket
    const ref = this.storage.ref(path);

    // The main task
    this.tasks = this.storage.upload(path, filesvalue[0])

    // Progress monitoring
    this.uploadProgress2$ = this.tasks.percentageChanges();

    // console.log("1",this.urlArray)
  }
  resetBar1() {



    this.uploadProgress2$ = this.uploadReset;

    setTimeout(() => {
      let intv = setInterval(() => {
        firebase.default.storage()
          .ref(this.templatePathP1).getDownloadURL()
          .then((url) => {
            this.thumbnailP1 = url;
            this.ProfileImage1 = url;
          })
        firebase.default.storage()
          .ref(this.templatePathP12).getDownloadURL()
          .then((url) => {
            this.thumbnailP1s = url;
          })
        firebase.default.storage()
          .ref(this.templatePathP13).getDownloadURL()
          .then((url) => {
            this.thumbnailP1vs = url;

          })
        
        if (this.thumbnailP1 && this.thumbnailP1s) {
          let datePlaced = new Date().getTime();
          // console.log( this.publicProfileId)
          this.db.createProfileImage(this.publicProfileId, this.thumbnailP1s, this.thumbnailP1, this.thumbnailP1vs, datePlaced, this.templatePathP12, this.templatePathP1, this.templatePathP13, "1");
          this.db.getProfile('/public-profile', this.publicProfileId).pipe(take(1)).subscribe(p => {
            if (p) {
             
              this.db.ProfileImage1(this.publicProfileId, this.thumbnailP1);
            }
            else {
              
              this.db.ProfileImage1Set(this.publicProfileId, this.thumbnailP1);
            }
          })

          // this.dbs.collection('public-profile/' + this.profileId + '/profile-Images/' ).doc("1").set( { downloadURL: this.thumbnailP2s,thumbnailURL:this.thumbnailP2, date:datePlaced,path:this.templatePathP12,templatePath:this.templatePathP1,imageNumber:1 })
          clearInterval(intv)
          console.log("written to db")

        }
      }, 200)
    }, 5000)
  }

  upload2() {
    let element: HTMLElement = document.getElementsByClassName('proImg2-selector')[0] as HTMLElement;
    element.click();
  }
  proImg2(filesvalue: FileList) {
    for (let i = 0; i < filesvalue.length; i++) {
      this.filesvalue.push(filesvalue.item(i));
    }


    // The storage path


    let str1 = filesvalue[0].name.split(".");

    let thumbname = str1[0] + "_720x480.webp";
    let thumbname2 = str1[0] + "_1920x1080.webp";
    let thumbname3 = str1[0] + "_375x250.webp";
    const path = `gallery/${this.userId}/${Date.now()}_${filesvalue[0].name}`;
    this.templatePathP2 = `gallery/${this.userId}/thumbnails/${Date.now()}_${thumbname}`
    this.templatePathP22 = `gallery/${this.userId}/thumbnails/${Date.now()}_${thumbname2}`
    this.templatePathP23 = `gallery/${this.userId}/thumbnails/${Date.now()}_${thumbname3}`
    // Reference to storage bucket
    const ref = this.storage.ref(path);

    // The main task
    this.tasks = this.storage.upload(path, filesvalue[0])

    // Progress monitoring
    this.uploadProgress3$ = this.tasks.percentageChanges();





    // console.log("1",this.urlArray)
  }
  resetBar2() {
    if (this.profileId == 'new') {
      this.profileId == this.publicProfileId;
    }
    this.uploadProgress3$ = this.uploadReset;

    setTimeout(() => {
      let intv = setInterval(() => {
        firebase.default.storage()
          .ref(this.templatePathP2).getDownloadURL()
          .then((url) => {
            this.thumbnailP2 = url;
            this.ProfileImage2 = url;

          })
        firebase.default.storage()
          .ref(this.templatePathP22).getDownloadURL()
          .then((url) => {
            this.thumbnailP2s = url;

          })
        firebase.default.storage()
          .ref(this.templatePathP23).getDownloadURL()
          .then((url) => {
            this.thumbnailP2vs = url;


          })
        if (this.thumbnailP2 && this.thumbnailP2s) {
          let datePlaced = new Date().getTime();
          this.db.createProfileImage(this.publicProfileId, this.thumbnailP2s, this.thumbnailP2, this.thumbnailP2vs, datePlaced, this.templatePathP22, this.templatePathP2, this.templatePathP23, "2");
          this.db.getProfile('/public-profile', this.publicProfileId).pipe(take(1)).subscribe(p => {
            if (p) {
             
              this.db.ProfileImage2(this.publicProfileId, this.thumbnailP1);
            }
            else {
              
              this.db.ProfileImage2Set(this.publicProfileId, this.thumbnailP1);
            }
          })
          clearInterval(intv)
          console.log("written to db")
        }
      }, 200)
    }, 5000)
  }

  upload3() {
    let element: HTMLElement = document.getElementsByClassName('proImg3-selector')[0] as HTMLElement;
    element.click();
  }
  proImg3(filesvalue: FileList) {
    for (let i = 0; i < filesvalue.length; i++) {
      this.filesvalue.push(filesvalue.item(i));
    }


    // The storage path


    let str1 = filesvalue[0].name.split(".");

    let thumbname = str1[0] + "_720x480.webp";
    let thumbname2 = str1[0] + "_1920x1080.webp";
    let thumbname3 = str1[0] + "_375x250.webp";
    const path = `gallery/${this.userId}/${Date.now()}_${filesvalue[0].name}`;
    this.templatePathP3 = `gallery/${this.userId}/thumbnails/${Date.now()}_${thumbname}`
    this.templatePathP32 = `gallery/${this.userId}/thumbnails/${Date.now()}_${thumbname2}`
    this.templatePathP33 = `gallery/${this.userId}/thumbnails/${Date.now()}_${thumbname3}`
    // Reference to storage bucket
    const ref = this.storage.ref(path);

    // The main task
    this.tasks = this.storage.upload(path, filesvalue[0])

    // Progress monitoring
    this.uploadProgress4$ = this.tasks.percentageChanges();

    // console.log("1",this.urlArray)
  }
  resetBar3() {
    if (this.profileId == 'new') {
      this.profileId == this.publicProfileId;
    }

    this.uploadProgress4$ = this.uploadReset;


    setTimeout(() => {
      let intv = setInterval(() => {
        firebase.default.storage()
          .ref(this.templatePathP3).getDownloadURL()
          .then((url) => {
            this.thumbnailP3 = url;
            this.ProfileImage3 = url;

          })
        firebase.default.storage()
          .ref(this.templatePathP33).getDownloadURL()
          .then((url) => {
            this.thumbnailP3vs = url;


          })
        firebase.default.storage()
          .ref(this.templatePathP32).getDownloadURL()
          .then((urls) => {
            this.thumbnailP3s = urls;


          })

        if (this.thumbnailP3 && this.thumbnailP3s) {

          let datePlaced = new Date().getTime();
          this.db.createProfileImage(this.publicProfileId, this.thumbnailP3s, this.thumbnailP3, this.thumbnailP3vs, datePlaced, this.templatePathP32, this.templatePathP3, this.templatePathP33, "3");
          // this.dbs.collection('public-profile/' + this.profileId + '/profile-Images/' ).doc("3").set( { downloadURL:  this.thumbnailP3s,thumbnailURL: this.thumbnailP3, date:datePlaced,path:this.templatePathP32,templatePath:this.templatePathP3,imageNumber:3 })
          this.db.getProfile('/public-profile', this.publicProfileId).pipe(take(1)).subscribe(p => {
            if (p) {
             
              this.db.ProfileImage3(this.publicProfileId, this.thumbnailP1);
            }
            else {
              
              this.db.ProfileImage3Set(this.publicProfileId, this.thumbnailP1);
            }
          })
          console.log("written to db")
          clearInterval(intv)

        }
      }, 200)
    }, 5000)
  }

}
