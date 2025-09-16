// *********************************************************************************
// Description: create and edit automations
// Inputs:
// Outputs:
// ***********************************************************************************

import { Component, HostListener, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../common.service';
import { AutomationService } from '../automations/automation.service';
import { ActivatedRoute } from '@angular/router';
import { NetworkCheckService } from '../networkcheck.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Currencies } from '../currencies';
import { addFieldsArr, changeLogModel, contactSettings, customFieldNamesData, defaultContactSettings, defaultSaleSettings, defaultfollowUpSettings, followUpSettings, messageTemplateModel, saleSettings } from '../data-models';
import { serviceSettings } from '../data-models';
import { defaultServiceSettings } from '../data-models';
import { paymentSettings } from '../data-models';
import { defaultPaymentSettings } from '../data-models';
@Component({
  selector: 'app-automation',
  templateUrl: './automation.component.html',
  styleUrls: ['./automation.component.scss'],
})
export class AutomationComponent implements OnInit {
  CountryCodes: Array<any> = [
    {
      name: 'Afghanistan',
      dial_code: '+93',
      code: 'AF',
    },
    {
      name: 'Aland Islands',
      dial_code: '+358',
      code: 'AX',
    },
    {
      name: 'Albania',
      dial_code: '+355',
      code: 'AL',
    },
    {
      name: 'Algeria',
      dial_code: '+213',
      code: 'DZ',
    },
    {
      name: 'AmericanSamoa',
      dial_code: '+1 684',
      code: 'AS',
    },
    {
      name: 'Andorra',
      dial_code: '+376',
      code: 'AD',
    },
    {
      name: 'Angola',
      dial_code: '+244',
      code: 'AO',
    },
    {
      name: 'Anguilla',
      dial_code: '+1 264',
      code: 'AI',
    },
    {
      name: 'Antarctica',
      dial_code: '+672',
      code: 'AQ',
    },
    {
      name: 'Antigua and Barbuda',
      dial_code: '+1268',
      code: 'AG',
    },
    {
      name: 'Argentina',
      dial_code: '+54',
      code: 'AR',
    },
    {
      name: 'Armenia',
      dial_code: '+374',
      code: 'AM',
    },
    {
      name: 'Aruba',
      dial_code: '+297',
      code: 'AW',
    },
    {
      name: 'Australia',
      dial_code: '+61',
      code: 'AU',
    },
    {
      name: 'Austria',
      dial_code: '+43',
      code: 'AT',
    },
    {
      name: 'Azerbaijan',
      dial_code: '+994',
      code: 'AZ',
    },
    {
      name: 'Bahamas',
      dial_code: '+1 242',
      code: 'BS',
    },
    {
      name: 'Bahrain',
      dial_code: '+973',
      code: 'BH',
    },
    {
      name: 'Bangladesh',
      dial_code: '+880',
      code: 'BD',
    },
    {
      name: 'Barbados',
      dial_code: '+1 246',
      code: 'BB',
    },
    {
      name: 'Belarus',
      dial_code: '+375',
      code: 'BY',
    },
    {
      name: 'Belgium',
      dial_code: '+32',
      code: 'BE',
    },
    {
      name: 'Belize',
      dial_code: '+501',
      code: 'BZ',
    },
    {
      name: 'Benin',
      dial_code: '+229',
      code: 'BJ',
    },
    {
      name: 'Bermuda',
      dial_code: '+1 441',
      code: 'BM',
    },
    {
      name: 'Bhutan',
      dial_code: '+975',
      code: 'BT',
    },
    {
      name: 'Bolivia, Plurinational State of',
      dial_code: '+591',
      code: 'BO',
    },
    {
      name: 'Bosnia and Herzegovina',
      dial_code: '+387',
      code: 'BA',
    },
    {
      name: 'Botswana',
      dial_code: '+267',
      code: 'BW',
    },
    {
      name: 'Brazil',
      dial_code: '+55',
      code: 'BR',
    },
    {
      name: 'British Indian Ocean Territory',
      dial_code: '+246',
      code: 'IO',
    },
    {
      name: 'Brunei Darussalam',
      dial_code: '+673',
      code: 'BN',
    },
    {
      name: 'Bulgaria',
      dial_code: '+359',
      code: 'BG',
    },
    {
      name: 'Burkina Faso',
      dial_code: '+226',
      code: 'BF',
    },
    {
      name: 'Burundi',
      dial_code: '+257',
      code: 'BI',
    },
    {
      name: 'Cambodia',
      dial_code: '+855',
      code: 'KH',
    },
    {
      name: 'Cameroon',
      dial_code: '+237',
      code: 'CM',
    },
    {
      name: 'Canada',
      dial_code: '+1',
      code: 'CA',
    },
    {
      name: 'Cape Verde',
      dial_code: '+238',
      code: 'CV',
    },
    {
      name: 'Cayman Islands',
      dial_code: '+ 345',
      code: 'KY',
    },
    {
      name: 'Central African Republic',
      dial_code: '+236',
      code: 'CF',
    },
    {
      name: 'Chad',
      dial_code: '+235',
      code: 'TD',
    },
    {
      name: 'Chile',
      dial_code: '+56',
      code: 'CL',
    },
    {
      name: 'China',
      dial_code: '+86',
      code: 'CN',
    },
    {
      name: 'Christmas Island',
      dial_code: '+61',
      code: 'CX',
    },
    {
      name: 'Cocos (Keeling) Islands',
      dial_code: '+61',
      code: 'CC',
    },
    {
      name: 'Colombia',
      dial_code: '+57',
      code: 'CO',
    },
    {
      name: 'Comoros',
      dial_code: '+269',
      code: 'KM',
    },
    {
      name: 'Congo',
      dial_code: '+242',
      code: 'CG',
    },
    {
      name: 'Congo, The Democratic Republic of the Congo',
      dial_code: '+243',
      code: 'CD',
    },
    {
      name: 'Cook Islands',
      dial_code: '+682',
      code: 'CK',
    },
    {
      name: 'Costa Rica',
      dial_code: '+506',
      code: 'CR',
    },
    {
      name: "Cote d'Ivoire",
      dial_code: '+225',
      code: 'CI',
    },
    {
      name: 'Croatia',
      dial_code: '+385',
      code: 'HR',
    },
    {
      name: 'Cuba',
      dial_code: '+53',
      code: 'CU',
    },
    {
      name: 'Cyprus',
      dial_code: '+357',
      code: 'CY',
    },
    {
      name: 'Czech Republic',
      dial_code: '+420',
      code: 'CZ',
    },
    {
      name: 'Denmark',
      dial_code: '+45',
      code: 'DK',
    },
    {
      name: 'Djibouti',
      dial_code: '+253',
      code: 'DJ',
    },
    {
      name: 'Dominica',
      dial_code: '+1 767',
      code: 'DM',
    },
    {
      name: 'Dominican Republic',
      dial_code: '+1 849',
      code: 'DO',
    },
    {
      name: 'Ecuador',
      dial_code: '+593',
      code: 'EC',
    },
    {
      name: 'Egypt',
      dial_code: '+20',
      code: 'EG',
    },
    {
      name: 'El Salvador',
      dial_code: '+503',
      code: 'SV',
    },
    {
      name: 'Equatorial Guinea',
      dial_code: '+240',
      code: 'GQ',
    },
    {
      name: 'Eritrea',
      dial_code: '+291',
      code: 'ER',
    },
    {
      name: 'Estonia',
      dial_code: '+372',
      code: 'EE',
    },
    {
      name: 'Ethiopia',
      dial_code: '+251',
      code: 'ET',
    },
    {
      name: 'Falkland Islands (Malvinas)',
      dial_code: '+500',
      code: 'FK',
    },
    {
      name: 'Faroe Islands',
      dial_code: '+298',
      code: 'FO',
    },
    {
      name: 'Fiji',
      dial_code: '+679',
      code: 'FJ',
    },
    {
      name: 'Finland',
      dial_code: '+358',
      code: 'FI',
    },
    {
      name: 'France',
      dial_code: '+33',
      code: 'FR',
    },
    {
      name: 'French Guiana',
      dial_code: '+594',
      code: 'GF',
    },
    {
      name: 'French Polynesia',
      dial_code: '+689',
      code: 'PF',
    },
    {
      name: 'Gabon',
      dial_code: '+241',
      code: 'GA',
    },
    {
      name: 'Gambia',
      dial_code: '+220',
      code: 'GM',
    },
    {
      name: 'Georgia',
      dial_code: '+995',
      code: 'GE',
    },
    {
      name: 'Germany',
      dial_code: '+49',
      code: 'DE',
    },
    {
      name: 'Ghana',
      dial_code: '+233',
      code: 'GH',
    },
    {
      name: 'Gibraltar',
      dial_code: '+350',
      code: 'GI',
    },
    {
      name: 'Greece',
      dial_code: '+30',
      code: 'GR',
    },
    {
      name: 'Greenland',
      dial_code: '+299',
      code: 'GL',
    },
    {
      name: 'Grenada',
      dial_code: '+1 473',
      code: 'GD',
    },
    {
      name: 'Guadeloupe',
      dial_code: '+590',
      code: 'GP',
    },
    {
      name: 'Guam',
      dial_code: '+1 671',
      code: 'GU',
    },
    {
      name: 'Guatemala',
      dial_code: '+502',
      code: 'GT',
    },
    {
      name: 'Guernsey',
      dial_code: '+44',
      code: 'GG',
    },
    {
      name: 'Guinea',
      dial_code: '+224',
      code: 'GN',
    },
    {
      name: 'Guinea-Bissau',
      dial_code: '+245',
      code: 'GW',
    },
    {
      name: 'Guyana',
      dial_code: '+595',
      code: 'GY',
    },
    {
      name: 'Haiti',
      dial_code: '+509',
      code: 'HT',
    },
    {
      name: 'Holy See (Vatican City State)',
      dial_code: '+379',
      code: 'VA',
    },
    {
      name: 'Honduras',
      dial_code: '+504',
      code: 'HN',
    },
    {
      name: 'Hong Kong',
      dial_code: '+852',
      code: 'HK',
    },
    {
      name: 'Hungary',
      dial_code: '+36',
      code: 'HU',
    },
    {
      name: 'Iceland',
      dial_code: '+354',
      code: 'IS',
    },
    {
      name: 'India',
      dial_code: '+91',
      code: 'IN',
    },
    {
      name: 'Indonesia',
      dial_code: '+62',
      code: 'ID',
    },
    {
      name: 'Iran, Islamic Republic of Persian Gulf',
      dial_code: '+98',
      code: 'IR',
    },
    {
      name: 'Iraq',
      dial_code: '+964',
      code: 'IQ',
    },
    {
      name: 'Ireland',
      dial_code: '+353',
      code: 'IE',
    },
    {
      name: 'Isle of Man',
      dial_code: '+44',
      code: 'IM',
    },
    {
      name: 'Israel',
      dial_code: '+972',
      code: 'IL',
    },
    {
      name: 'Italy',
      dial_code: '+39',
      code: 'IT',
    },
    {
      name: 'Jamaica',
      dial_code: '+1 876',
      code: 'JM',
    },
    {
      name: 'Japan',
      dial_code: '+81',
      code: 'JP',
    },
    {
      name: 'Jersey',
      dial_code: '+44',
      code: 'JE',
    },
    {
      name: 'Jordan',
      dial_code: '+962',
      code: 'JO',
    },
    {
      name: 'Kazakhstan',
      dial_code: '+7 7',
      code: 'KZ',
    },
    {
      name: 'Kenya',
      dial_code: '+254',
      code: 'KE',
    },
    {
      name: 'Kiribati',
      dial_code: '+686',
      code: 'KI',
    },
    {
      name: "Korea, Democratic People's Republic of Korea",
      dial_code: '+850',
      code: 'KP',
    },
    {
      name: 'Korea, Republic of South Korea',
      dial_code: '+82',
      code: 'KR',
    },
    {
      name: 'Kuwait',
      dial_code: '+965',
      code: 'KW',
    },
    {
      name: 'Kyrgyzstan',
      dial_code: '+996',
      code: 'KG',
    },
    {
      name: 'Laos',
      dial_code: '+856',
      code: 'LA',
    },
    {
      name: 'Latvia',
      dial_code: '+371',
      code: 'LV',
    },
    {
      name: 'Lebanon',
      dial_code: '+961',
      code: 'LB',
    },
    {
      name: 'Lesotho',
      dial_code: '+266',
      code: 'LS',
    },
    {
      name: 'Liberia',
      dial_code: '+231',
      code: 'LR',
    },
    {
      name: 'Libyan Arab Jamahiriya',
      dial_code: '+218',
      code: 'LY',
    },
    {
      name: 'Liechtenstein',
      dial_code: '+423',
      code: 'LI',
    },
    {
      name: 'Lithuania',
      dial_code: '+370',
      code: 'LT',
    },
    {
      name: 'Luxembourg',
      dial_code: '+352',
      code: 'LU',
    },
    {
      name: 'Macao',
      dial_code: '+853',
      code: 'MO',
    },
    {
      name: 'Macedonia',
      dial_code: '+389',
      code: 'MK',
    },
    {
      name: 'Madagascar',
      dial_code: '+261',
      code: 'MG',
    },
    {
      name: 'Malawi',
      dial_code: '+265',
      code: 'MW',
    },
    {
      name: 'Malaysia',
      dial_code: '+60',
      code: 'MY',
    },
    {
      name: 'Maldives',
      dial_code: '+960',
      code: 'MV',
    },
    {
      name: 'Mali',
      dial_code: '+223',
      code: 'ML',
    },
    {
      name: 'Malta',
      dial_code: '+356',
      code: 'MT',
    },
    {
      name: 'Marshall Islands',
      dial_code: '+692',
      code: 'MH',
    },
    {
      name: 'Martinique',
      dial_code: '+596',
      code: 'MQ',
    },
    {
      name: 'Mauritania',
      dial_code: '+222',
      code: 'MR',
    },
    {
      name: 'Mauritius',
      dial_code: '+230',
      code: 'MU',
    },
    {
      name: 'Mayotte',
      dial_code: '+262',
      code: 'YT',
    },
    {
      name: 'Mexico',
      dial_code: '+52',
      code: 'MX',
    },
    {
      name: 'Micronesia, Federated States of Micronesia',
      dial_code: '+691',
      code: 'FM',
    },
    {
      name: 'Moldova',
      dial_code: '+373',
      code: 'MD',
    },
    {
      name: 'Monaco',
      dial_code: '+377',
      code: 'MC',
    },
    {
      name: 'Mongolia',
      dial_code: '+976',
      code: 'MN',
    },
    {
      name: 'Montenegro',
      dial_code: '+382',
      code: 'ME',
    },
    {
      name: 'Montserrat',
      dial_code: '+1664',
      code: 'MS',
    },
    {
      name: 'Morocco',
      dial_code: '+212',
      code: 'MA',
    },
    {
      name: 'Mozambique',
      dial_code: '+258',
      code: 'MZ',
    },
    {
      name: 'Myanmar',
      dial_code: '+95',
      code: 'MM',
    },
    {
      name: 'Namibia',
      dial_code: '+264',
      code: 'NA',
    },
    {
      name: 'Nauru',
      dial_code: '+674',
      code: 'NR',
    },
    {
      name: 'Nepal',
      dial_code: '+977',
      code: 'NP',
    },
    {
      name: 'Netherlands',
      dial_code: '+31',
      code: 'NL',
    },
    {
      name: 'Netherlands Antilles',
      dial_code: '+599',
      code: 'AN',
    },
    {
      name: 'New Caledonia',
      dial_code: '+687',
      code: 'NC',
    },
    {
      name: 'New Zealand',
      dial_code: '+64',
      code: 'NZ',
    },
    {
      name: 'Nicaragua',
      dial_code: '+505',
      code: 'NI',
    },
    {
      name: 'Niger',
      dial_code: '+227',
      code: 'NE',
    },
    {
      name: 'Nigeria',
      dial_code: '+234',
      code: 'NG',
    },
    {
      name: 'Niue',
      dial_code: '+683',
      code: 'NU',
    },
    {
      name: 'Norfolk Island',
      dial_code: '+672',
      code: 'NF',
    },
    {
      name: 'Northern Mariana Islands',
      dial_code: '+1 670',
      code: 'MP',
    },
    {
      name: 'Norway',
      dial_code: '+47',
      code: 'NO',
    },
    {
      name: 'Oman',
      dial_code: '+968',
      code: 'OM',
    },
    {
      name: 'Pakistan',
      dial_code: '+92',
      code: 'PK',
    },
    {
      name: 'Palau',
      dial_code: '+680',
      code: 'PW',
    },
    {
      name: 'Palestinian Territory, Occupied',
      dial_code: '+970',
      code: 'PS',
    },
    {
      name: 'Panama',
      dial_code: '+507',
      code: 'PA',
    },
    {
      name: 'Papua New Guinea',
      dial_code: '+675',
      code: 'PG',
    },
    {
      name: 'Paraguay',
      dial_code: '+595',
      code: 'PY',
    },
    {
      name: 'Peru',
      dial_code: '+51',
      code: 'PE',
    },
    {
      name: 'Philippines',
      dial_code: '+63',
      code: 'PH',
    },
    {
      name: 'Pitcairn',
      dial_code: '+872',
      code: 'PN',
    },
    {
      name: 'Poland',
      dial_code: '+48',
      code: 'PL',
    },
    {
      name: 'Portugal',
      dial_code: '+351',
      code: 'PT',
    },
    {
      name: 'Puerto Rico',
      dial_code: '+1 939',
      code: 'PR',
    },
    {
      name: 'Qatar',
      dial_code: '+974',
      code: 'QA',
    },
    {
      name: 'Romania',
      dial_code: '+40',
      code: 'RO',
    },
    {
      name: 'Russia',
      dial_code: '+7',
      code: 'RU',
    },
    {
      name: 'Rwanda',
      dial_code: '+250',
      code: 'RW',
    },
    {
      name: 'Reunion',
      dial_code: '+262',
      code: 'RE',
    },
    {
      name: 'Saint Barthelemy',
      dial_code: '+590',
      code: 'BL',
    },
    {
      name: 'Saint Helena, Ascension and Tristan Da Cunha',
      dial_code: '+290',
      code: 'SH',
    },
    {
      name: 'Saint Kitts and Nevis',
      dial_code: '+1 869',
      code: 'KN',
    },
    {
      name: 'Saint Lucia',
      dial_code: '+1 758',
      code: 'LC',
    },
    {
      name: 'Saint Martin',
      dial_code: '+590',
      code: 'MF',
    },
    {
      name: 'Saint Pierre and Miquelon',
      dial_code: '+508',
      code: 'PM',
    },
    {
      name: 'Saint Vincent and the Grenadines',
      dial_code: '+1 784',
      code: 'VC',
    },
    {
      name: 'Samoa',
      dial_code: '+685',
      code: 'WS',
    },
    {
      name: 'San Marino',
      dial_code: '+378',
      code: 'SM',
    },
    {
      name: 'Sao Tome and Principe',
      dial_code: '+239',
      code: 'ST',
    },
    {
      name: 'Saudi Arabia',
      dial_code: '+966',
      code: 'SA',
    },
    {
      name: 'Senegal',
      dial_code: '+221',
      code: 'SN',
    },
    {
      name: 'Serbia',
      dial_code: '+381',
      code: 'RS',
    },
    {
      name: 'Seychelles',
      dial_code: '+248',
      code: 'SC',
    },
    {
      name: 'Sierra Leone',
      dial_code: '+232',
      code: 'SL',
    },
    {
      name: 'Singapore',
      dial_code: '+65',
      code: 'SG',
    },
    {
      name: 'Slovakia',
      dial_code: '+421',
      code: 'SK',
    },
    {
      name: 'Slovenia',
      dial_code: '+386',
      code: 'SI',
    },
    {
      name: 'Solomon Islands',
      dial_code: '+677',
      code: 'SB',
    },
    {
      name: 'Somalia',
      dial_code: '+252',
      code: 'SO',
    },
    {
      name: 'South Africa',
      dial_code: '+27',
      code: 'ZA',
    },
    {
      name: 'South Georgia and the South Sandwich Islands',
      dial_code: '+500',
      code: 'GS',
    },
    {
      name: 'Spain',
      dial_code: '+34',
      code: 'ES',
    },
    {
      name: 'Sri Lanka',
      dial_code: '+94',
      code: 'LK',
    },
    {
      name: 'Sudan',
      dial_code: '+249',
      code: 'SD',
    },
    {
      name: 'Suriname',
      dial_code: '+597',
      code: 'SR',
    },
    {
      name: 'Svalbard and Jan Mayen',
      dial_code: '+47',
      code: 'SJ',
    },
    {
      name: 'Swaziland',
      dial_code: '+268',
      code: 'SZ',
    },
    {
      name: 'Sweden',
      dial_code: '+46',
      code: 'SE',
    },
    {
      name: 'Switzerland',
      dial_code: '+41',
      code: 'CH',
    },
    {
      name: 'Syrian Arab Republic',
      dial_code: '+963',
      code: 'SY',
    },
    {
      name: 'Taiwan',
      dial_code: '+886',
      code: 'TW',
    },
    {
      name: 'Tajikistan',
      dial_code: '+992',
      code: 'TJ',
    },
    {
      name: 'Tanzania, United Republic of Tanzania',
      dial_code: '+255',
      code: 'TZ',
    },
    {
      name: 'Thailand',
      dial_code: '+66',
      code: 'TH',
    },
    {
      name: 'Timor-Leste',
      dial_code: '+670',
      code: 'TL',
    },
    {
      name: 'Togo',
      dial_code: '+228',
      code: 'TG',
    },
    {
      name: 'Tokelau',
      dial_code: '+690',
      code: 'TK',
    },
    {
      name: 'Tonga',
      dial_code: '+676',
      code: 'TO',
    },
    {
      name: 'Trinidad and Tobago',
      dial_code: '+1 868',
      code: 'TT',
    },
    {
      name: 'Tunisia',
      dial_code: '+216',
      code: 'TN',
    },
    {
      name: 'Turkey',
      dial_code: '+90',
      code: 'TR',
    },
    {
      name: 'Turkmenistan',
      dial_code: '+993',
      code: 'TM',
    },
    {
      name: 'Turks and Caicos Islands',
      dial_code: '+1 649',
      code: 'TC',
    },
    {
      name: 'Tuvalu',
      dial_code: '+688',
      code: 'TV',
    },
    {
      name: 'Uganda',
      dial_code: '+256',
      code: 'UG',
    },
    {
      name: 'Ukraine',
      dial_code: '+380',
      code: 'UA',
    },
    {
      name: 'United Arab Emirates',
      dial_code: '+971',
      code: 'AE',
    },
    {
      name: 'United Kingdom',
      dial_code: '+44',
      code: 'GB',
    },
    {
      name: 'United States',
      dial_code: '+1',
      code: 'US',
    },
    {
      name: 'Uruguay',
      dial_code: '+598',
      code: 'UY',
    },
    {
      name: 'Uzbekistan',
      dial_code: '+998',
      code: 'UZ',
    },
    {
      name: 'Vanuatu',
      dial_code: '+678',
      code: 'VU',
    },
    {
      name: 'Venezuela, Bolivarian Republic of Venezuela',
      dial_code: '+58',
      code: 'VE',
    },
    {
      name: 'Vietnam',
      dial_code: '+84',
      code: 'VN',
    },
    {
      name: 'Virgin Islands, British',
      dial_code: '+1 284',
      code: 'VG',
    },
    {
      name: 'Virgin Islands, U.S.',
      dial_code: '+1 340',
      code: 'VI',
    },
    {
      name: 'Wallis and Futuna',
      dial_code: '+681',
      code: 'WF',
    },
    {
      name: 'Yemen',
      dial_code: '+967',
      code: 'YE',
    },
    {
      name: 'Zambia',
      dial_code: '+260',
      code: 'ZM',
    },
    {
      name: 'Zimbabwe',
      dial_code: '+263',
      code: 'ZW',
    },
  ];
  loadComplete = false; // for loader
  fieldToCopy = ''; // variable used in notes for users to copy and paste in the final form
  //fieldNameInitialsation from data_model.ts
  fieldNameContact: string = customFieldNamesData.data.fieldNameContact;
  fieldNameService: string = customFieldNamesData.data.fieldNameService;
  fieldNameSale: string = customFieldNamesData.data.fieldNameSale;
  fieldNameTask: string = customFieldNamesData.data.fieldNameTask;
  fieldNameCollection: string = customFieldNamesData.data.fieldNameCollection;
  fieldNameExpense: string = customFieldNamesData.data.fieldNameExpense;
  fieldNameEstimate: string = customFieldNamesData.data.fieldNameEstimate;
  fieldNameFollowUp: string = customFieldNamesData.data.fieldNameFollowup;
  fieldNameQuatation: string = customFieldNamesData.data.fieldNameQuotation;
  fieldNameOrganization: string = customFieldNamesData.data.fieldNameOrganization;
  fieldNameMeeting: string = customFieldNamesData.data.fieldNameMeeting;
  fieldNameInvoice: string = customFieldNamesData.data.fieldNameInvoice;
  fieldNameItemsCategory: string = customFieldNamesData.data.fieldNameItemsCategory;
  fieldNameItems: string = customFieldNamesData.data.fieldNameItems;

  triggeredAction = []; // used to select all the fields corresponding t selected trigger
  conditionAdder = []; // array of conditions
  buttonClicked: Boolean = false; // boolean value to disable button
  allCurrencies = Currencies.getCurencies(); //currency values
  // form groups for the 4 tabs in the automation creator
  zeroFormGroup: FormGroup;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  conditionObject = {};
  alwaysorCondition: Boolean = false; // checks if condition is required or always trigger
  pipelineNames: any = {
    contact: [],
    sale: [],
    service: []
  }
  pipelineStatus: any = {
    contact: [],
    sales: [],
    service: []
  }

  assignedToSelection: any; // array of object where each element is users id and name 

  // the different values of list fields. If in the fieldList array the valueType field of element is List the possible values are shown as drop down from this list
  valueList = {
    priority: [{ name: 'Low', value: 'Low' }, { name: 'High', value: 'High' }, { name: 'Medium', value: 'Medium' }],
    contactstatus: [],
    salesStage: [],
    servicesStage: [],
    companyName: [{ name: 'Individual', value: 'Individual' }],
    customerCompany: [{ name: 'Individual', value: 'Individual' },],
    code: this.CountryCodes,
    currency: this.allCurrencies,
    paymentType: [{ name: 'Against Invoice', value: 'Against Invoice' }, { name: 'Advance payment', value: 'Advance payment' }],
    paymentMode: [{ name: 'Cash', value: 'Cash' }, { name: 'Account Transfer', value: 'Account Transfer' }, { name: 'Cheque', value: 'Cheque' }],
    custLeadValue: [],
    direction: [{ name: 'Inbound', value: 'Inbound' }, { name: 'Outbound', value: 'Outbound' }, { name: 'Missed', value: 'Missed' }],
    outcome: [],
    selectedSalePipeline: [],
    selectedContactPipeline: [],
    selectedServPipeline: [],
    followupstatus: [],
    completedStatus: [{ name: 'true', value: true }, { name: 'false', value: false }]
  };
  userPlan: any; // store subscribed plan of the user
  subUsers: any; // array of all sub users
  superUserData: any; // super user Details
  conditionfullString: string; // the complete condition as a string foe eval function to work
  allEmailTemplates: any = []; //array of all email templates
  emailTemplates: any; //array to filter out conditonally
  allSMSTemplates: any = []; //array of all SMS templates
  SMSTemplatesFiltered: any; //array to filter SMS templated out conditonally based on type of triggering record
  WaTemplatesFiltered: messageTemplateModel[] = []; // to store whatsapp templates
  mode: string; // create or edit mode
  automationId: string; // if its in edit mode the id of the automation document
  networkConnection: boolean; // to check network connection

  // Subscriptions
  userDataSubscription: Subscription; // subscription for user data
  emailTemplateSubscription: Subscription; //subscription for email template
  smsTemplateSubscription: Subscription; //subscription for sms template
  routeSubscription: Subscription;//subscription for routing to get automation id and scenario
  taskAddFArray = <addFieldsArr>{}; //
  follAddFArray = <addFieldsArr>{}; //
  plan: any; //user plan
  triggers: { name: string; value: string; }[];
  triggers_invoicing: { name: string; value: string; }[];
  actions: { name: string; value: string; triggers: string[]; }[]; // actions
  saleSettings: saleSettings = defaultSaleSettings.CONST_VALUE; //customisation settings for sale module,used for field customisation
  contactSettings: contactSettings = defaultContactSettings.CONST_VALUE;//customisation settings for contact module,used for field customisation
  serviceSettings: serviceSettings = defaultServiceSettings.CONST_VALUE;//customisation settings for service module,used for field customisation
  collectionSettings: paymentSettings = defaultPaymentSettings.CONST_VALUE;//customisation settings for collection module,used for field customisation
  followUpSettings: followUpSettings = defaultfollowUpSettings.CONST_VALUE;//customisation settings for sale module,used for field customisation
  fieldList: {
    contact: ({ name: string; value: string; type: string; valueType: string; } | {
      name: {
        displayName: string; display:
        boolean; mandatory: boolean;
      }; value: string; type: string; valueType: string;
    })[]; sale: { name: string; value: string; type: string; valueType: string; }[]; service: { name: string; value: string; type: string; valueType: string; }[]; invoice: { name: string; value: string; type: string; valueType: string; }[]; estimate: { name: string; value: string; type: string; valueType: string; }[]; quotation: { name: string; value: string; type: string; valueType: string; }[]; collection: { name: string; value: string; type: string; valueType: string; }[]; followup: { name: string; value: string; type: string; valueType: string; }[];
  };
  triggers_leadManagement: { name: string; value: string; }[];// list of all triggers for lead management plan
  actions_leadManagement: { name: string; value: string; triggers: string[]; }[];// list of all possible operations for a particular module
  fieldsToUse: { service: { name: string; value: string; }[]; sale: { name: string; value: string; }[]; contact: { name: string; value: string; }[]; estimate: { name: string; value: string; }[]; invoice: { name: string; value: string; }[]; quotation: { name: string; value: string; }[]; collection: { name: string; value: string; }[]; followup: { name: string; value: string; }[]; };
  dateFields: { contact: { name: string; value: string; type: string; }[]; sale: { name: string; value: string; type: string; }[]; estimate: { name: string; value: string; type: string; }[]; quotation: { name: string; value: string; type: string; }[]; invoice: { name: string; value: string; type: string; }[]; collection: { name: string; value: string; type: string; }[]; followup: { name: string; value: string; type: string; }[]; service: { name: string; value: string; type: string; }[]; };
  operations: { name: string; value: string[]; }[];// list of all possible operations for a particular module
  actions_invoicing: { name: string; value: string; triggers: string[]; }[]; //actions for invoicing plan
  operationsPerTrigger: any; // operation scenarios for automation.When an automation is to be  enabled, while creating / editing a module document
  pipelineSubReset: boolean = true; // to prevent reset,when superuser data is updated
  defaultTaskStatus:any[]=['Open',"Completed"] // default task status options
  constructor(
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private common: CommonService,
    private db: AutomationService,
    public networkCheck: NetworkCheckService,
    private location: Location
  ) {
    this.userPlan = this.common.userPlan;// getting userplan from common service file
    //subscribing to userDatas from common service file
    this.common.userDatas.subscribe((data) => {
      this.plan = data.superUserDetails.plan;
      var contactAddtFields = [];
      var saleAddtFields = [];
      var serviceAddtFields = [];
      var taskAddtFields = [];
      var followUpAddtFields = [];
      this.pipelineNames.contact = []
      this.pipelineNames.sale = []
      this.valueList.contactstatus = []
      this.valueList.salesStage = []
      this.valueList.servicesStage = []
      this.valueList.outcome = []

      if (!!data.superUserDetails.followUpOutcome)
        data.superUserDetails.followUpOutcome.forEach((inele) => {
          this.valueList.outcome.push({ name: inele, value: inele })
        })
      if(this.pipelineSubReset){
        // to prevent reset issue,when superuser details updated
        this.pipelineSubReset = false; 
        // adding  pipeline names and pipeline id to valuelist array
        data.customerPipelines.forEach((ele, i) => {
          this.valueList.selectedContactPipeline.push({ name: ele.pipelineName, value: ele.pipelineId })
        })
        data.salePipelines.forEach((ele, i) => {
          this.valueList.selectedSalePipeline.push({ name: ele.pipelineName, value: ele.pipelineId })
        })
        data.servicePipelines.forEach((ele, i) => {
          this.valueList.selectedServPipeline.push({ name: ele.pipelineName, value: ele.pipelineId })
        })
        
    }

      //customFieldNames if it exist under superuser
      if (data.superUserDetails.fieldNames) {
        this.fieldNameContact = data.superUserDetails.fieldNames.fieldNameContact ? data.superUserDetails.fieldNames.fieldNameContact : customFieldNamesData.data.fieldNameContact;
        this.fieldNameSale = data.superUserDetails.fieldNames.fieldNameSale ? data.superUserDetails.fieldNames.fieldNameSale : customFieldNamesData.data.fieldNameSale;
        this.fieldNameService = data.superUserDetails.fieldNames.fieldNameService ? data.superUserDetails.fieldNames.fieldNameService : customFieldNamesData.data.fieldNameService;
        this.fieldNameTask = data.superUserDetails.fieldNames.fieldNameTask ? data.superUserDetails.fieldNames.fieldNameTask : customFieldNamesData.data.fieldNameTask;
        this.fieldNameCollection = data.superUserDetails.fieldNames.fieldNameCollection ? data.superUserDetails.fieldNames.fieldNameCollection : customFieldNamesData.data.fieldNameCollection;
        this.fieldNameEstimate = data.superUserDetails.fieldNames.fieldNameEstimate ? data.superUserDetails.fieldNames.fieldNameEstimate : customFieldNamesData.data.fieldNameEstimate;
        this.fieldNameExpense = data.superUserDetails.fieldNames.fieldNameExpense ? data.superUserDetails.fieldNames.fieldNameExpense : customFieldNamesData.data.fieldNameExpense;
        this.fieldNameFollowUp = data.superUserDetails.fieldNames.fieldNameFollowup ? data.superUserDetails.fieldNames.fieldNameFollowup : customFieldNamesData.data.fieldNameFollowup;
        this.fieldNameQuatation = data.superUserDetails.fieldNames.fieldNameQuotation ? data.superUserDetails.fieldNames.fieldNameQuotation : customFieldNamesData.data.fieldNameQuotation;
        this.fieldNameOrganization = data.superUserDetails.fieldNames.fieldNameOrganization ? data.superUserDetails.fieldNames.fieldNameOrganization : customFieldNamesData.data.fieldNameOrganization;
        this.fieldNameInvoice = data.superUserDetails.fieldNames.fieldNameInvoice ? data.superUserDetails.fieldNames.fieldNameInvoice : customFieldNamesData.data.fieldNameInvoice;
        this.fieldNameItems = data.superUserDetails.fieldNames.fieldNameItems ? data.superUserDetails.fieldNames.fieldNameItems : customFieldNamesData.data.fieldNameItems;
        this.fieldNameItemsCategory = data.superUserDetails.fieldNames.fieldNameItemsCategory ? data.superUserDetails.fieldNames.fieldNameItemsCategory : customFieldNamesData.data.fieldNameItemsCategory;
      }
      //customisation field
      if (
        typeof data.superUserDetails.contactSettings === 'undefined' ||
        data.superUserDetails.contactSettings === null
      ) {
        this.contactSettings = this.contactSettings;
      } else {
        this.contactSettings = data.superUserDetails.contactSettings;
      }
      //sale customisation
      if (
        typeof data.superUserDetails.saleSettings === 'undefined' ||
        data.superUserDetails.saleSettings === null
      ) {
        this.saleSettings = this.saleSettings;
      } else {
        this.saleSettings = data.superUserDetails.saleSettings;
      }
      //service customisation
      if (
        typeof data.superUserDetails.serviceSettings === 'undefined' ||
        data.superUserDetails.serviceSettings === null
      ) {
        this.serviceSettings = this.serviceSettings;
      } else {
        this.serviceSettings = data.superUserDetails.serviceSettings;
      }
      //collection customisation
      if (
        typeof data.superUserDetails.paymentSettings === 'undefined' ||
        data.superUserDetails.paymentSettings === null
      ) {
        this.collectionSettings = this.collectionSettings;
      } else {
        this.collectionSettings = data.superUserDetails.paymentSettings;
      }
      //followUp customisation
      if (
        typeof data.superUserDetails.followUpSettings === 'undefined' ||
        data.superUserDetails.followUpSettings === null
      ) {
        this.followUpSettings = this.followUpSettings;
      } else {
        this.followUpSettings = data.superUserDetails.followUpSettings;
      }
      // list of all triggers (modules for which automations are to be triggered. Value is used in code for check, name is used in UI )
      this.triggers = [
        { name: this.fieldNameContact, value: 'contact' },
        { name: this.fieldNameSale, value: 'sale' },
        { name: this.fieldNameEstimate, value: 'estimate' },
        { name: this.fieldNameQuatation, value: 'quotation' },
        { name: this.fieldNameInvoice, value: 'invoice' },
        { name: this.fieldNameCollection, value: 'collection' },
        { name: this.fieldNameFollowUp, value: 'followup' },
        { name: this.fieldNameService, value: "service" }
      ];
      // list of all triggers for invoicing plan

      this.triggers_invoicing = [
        { name: this.fieldNameContact, value: 'contact' },
        { name: this.fieldNameEstimate, value: 'estimate' },
        { name: this.fieldNameQuatation, value: 'quotation' },
        { name: this.fieldNameInvoice, value: 'invoice' },
      ];
      // list of all possible actions the trigger fields
      // shows the triggers corresponding to each action
      this.actions = [
        {
          name: `Create ${this.fieldNameFollowUp}`,
          value: 'createfollowupTask',
          triggers: ['contact', 'followup', 'sale', 'service'],

        },
        {
          name: `Create ${this.fieldNameTask}`,
          value: 'createTask',
          triggers: [
            'contact',
            'sale',
            'estimate',
            'quotation',
            'invoice',
            'collection',
            'service'
          ],
        },
        {
          name: 'Send Email',
          value: 'sendEmail',
          triggers: [
            'contact',
            'sale',
            'quotation',
            'invoice',
            'estimate',
            'collection',
            'service'
          ],
        },
        // {
        //   name: 'Send SMS',
        //   value: 'sendSMS',
        //   triggers: [
        //     'contact',
        //     'sale',
        //     'quotation',
        //     'invoice',
        //     'estimate',
        //     'collection',
        //     'service'
        //   ],
        // },
        {
          name: 'Send Whatsapp message',
          value: 'sendSMS',
          triggers: [
            'contact',
            'sale',
            'quotation',
            'invoice',
            'estimate',
            'collection',
            'service'
          ],
        },

        // {name:"Create Invoice",value:"this.createInvoice(this.currentRule)",triggers:["contact","sale"]},
        // {name:"Create Estimate",value:"this.createEstimate(this.currentRule)",triggers:["contact","sale"]},
        // {name:"Create Quotation",value:"this.createQuotation(this.currentRule)",triggers:["contact","sale"]},
      ];
      // array used for selection of fields corresponding to each trigger
      this.fieldList = {
        contact: [
          { name: 'Email', value: 'email', type: 'String', valueType: 'String' },
          {
            name: `Customer ${this.contactSettings.firstName.displayName ? this.contactSettings.firstName.displayName : defaultContactSettings.CONST_VALUE.firstName.displayName}`,
            value: 'firstName',
            type: 'specialType',
            valueType: 'String',
          },
          {
            name: `Customer ${this.contactSettings.secondName.displayName ? this.contactSettings.secondName.displayName : defaultContactSettings.CONST_VALUE.secondName.displayName}`,
            value: 'secondName',
            type: 'String',
            valueType: 'String',
          },
          {
            name: this.contactSettings.companyName.displayName ? this.contactSettings.companyName.displayName : defaultContactSettings.CONST_VALUE.companyName.displayName,
            value: 'companyName',
            type: 'specialType',
            valueType: 'String',
          },
          {
            name: 'Country Code',
            value: 'code',
            type: 'String',
            valueType: 'List',
          },
          {
            name: 'Assigned To',
            value: 'assignedTo',
            type: 'specialType',
            valueType: 'assignedTo',
          },
          // {name:"Date created",value:"dateCreated",type:'Number',valueType:'String'},
          {
            name: this.contactSettings.priority.displayName ? this.contactSettings.priority.displayName : defaultContactSettings.CONST_VALUE.priority.displayName,
            value: 'priority',
            type: 'specialType',
            valueType: 'List',
          },
          {
            name: 'Customer Type',
            value: 'companyName',
            type: 'customerType',
            valueType: 'List',
          },
          {
            name: this.contactSettings.status.displayName ? this.contactSettings.status.displayName : defaultContactSettings.CONST_VALUE.status.displayName,
            value: 'status',
            type: 'specialType',
            valueType: 'List',
          },
          {
            name: this.contactSettings.selectedContactPipeline.displayName ? this.contactSettings.selectedContactPipeline.displayName : defaultContactSettings.CONST_VALUE.selectedContactPipeline.displayName,
            value: 'selectedContactPipeline',
            type: 'specialType',
            valueType: 'List',
          },
          {
            name: this.contactSettings.custLeadValue.displayName ? this.contactSettings.custLeadValue.displayName : defaultContactSettings.CONST_VALUE.custLeadValue.displayName,
            value: 'custLeadValue',
            type: 'String',
            valueType: 'List',
          },
        ],
        sale: [
          {
            name: this.saleSettings.salesStage.displayName ? this.saleSettings.salesStage.displayName : defaultSaleSettings.CONST_VALUE.salesStage.displayName,
            value: 'salesStage',
            type: 'specialType',
            valueType: 'List',
          },
          {
            name: this.saleSettings.selectedSalePipeline.displayName ? this.saleSettings.selectedSalePipeline.displayName : defaultSaleSettings.CONST_VALUE.selectedSalePipeline.displayName,
            value: 'selectedSalePipeline',
            type: 'specialType',
            valueType: 'List',
          },
          {
            name: 'Assigned To',
            value: 'assignedTo',
            type: 'specialType',
            valueType: 'assignedTo',
          },
          {
            name: this.saleSettings.priority.displayName ? this.saleSettings.priority.displayName : defaultSaleSettings.CONST_VALUE.priority.displayName,
            value: 'priority',
            type: 'specialType',
            valueType: 'List',
          },
          {
            name: `Customer ${this.contactSettings.firstName.displayName ? this.contactSettings.firstName.displayName : defaultContactSettings.CONST_VALUE.firstName.displayName}`,
            value: 'firstName',
            type: 'specialType',
            valueType: 'String',
          },
          {
            name: `Customer ${this.contactSettings.secondName.displayName ? this.contactSettings.secondName.displayName : defaultContactSettings.CONST_VALUE.secondName.displayName}`,
            value: 'secondName',
            type: 'String',
            valueType: 'String',
          },
          {
            name: this.contactSettings.companyName.displayName ? this.contactSettings.companyName.displayName : defaultContactSettings.CONST_VALUE.companyName.displayName,
            value: 'companyName',
            type: 'specialType',
            valueType: 'String',
          },
          {
            name: 'Customer Type',
            value: 'companyName',
            type: 'customerType',
            valueType: 'List',
          },

        ],
        service: [
          {
            name: this.serviceSettings.servicesStage.displayName ? this.serviceSettings.servicesStage.displayName : defaultServiceSettings.CONST_VALUE.servicesStage.displayName,
            value: 'servicesStage',
            type: 'specialType',
            valueType: 'List',
          },
          {
            name: this.serviceSettings.selectedServPipeline.displayName ? this.serviceSettings.selectedServPipeline.displayName : defaultServiceSettings.CONST_VALUE.selectedServPipeline.displayName,
            value: 'selectedServPipeline',
            type: 'specialType',
            valueType: 'List',
          },
          {
            name: 'Assigned To',
            value: 'assignedTo',
            type: 'specialType',
            valueType: 'assignedTo',
          },
          {
            name: this.serviceSettings.priority.displayName ? this.serviceSettings.priority.displayName : defaultServiceSettings.CONST_VALUE.priority.displayName,
            value: 'priority',
            type: 'specialType',
            valueType: 'List',
          },
          {
            name: `Customer ${this.contactSettings.firstName.displayName ? this.contactSettings.firstName.displayName : defaultContactSettings.CONST_VALUE.firstName.displayName}`,
            value: 'firstName',
            type: 'specialType',
            valueType: 'String',
          },
          {
            name: `Customer ${this.contactSettings.secondName.displayName ? this.contactSettings.secondName.displayName : defaultContactSettings.CONST_VALUE.secondName.displayName}`,
            value: 'secondName',
            type: 'String',
            valueType: 'String',
          },
          {
            name: this.contactSettings.companyName.displayName ? this.contactSettings.companyName.displayName : defaultContactSettings.CONST_VALUE.companyName.displayName,
            value: 'companyName',
            type: 'specialType',
            valueType: 'String',
          },
          {
            name: 'Customer Type',
            value: 'companyName',
            type: 'customerType',
            valueType: 'List',
          },

        ],

        invoice: [
          {
            name: 'Customer Email',
            value: 'email',
            type: 'String',
            valueType: 'String',
          },
          {
            name: `Customer ${this.contactSettings.firstName.displayName ? this.contactSettings.firstName.displayName : defaultContactSettings.CONST_VALUE.firstName.displayName}`,
            value: 'firstName',
            type: 'specialType',
            valueType: 'String',
          },
          {
            name: `Customer ${this.contactSettings.secondName.displayName ? this.contactSettings.secondName.displayName : defaultContactSettings.CONST_VALUE.secondName.displayName}`,
            value: 'secondName',
            type: 'String',
            valueType: 'String',
          },
          {
            name: `Customer ${this.contactSettings.companyName.displayName ? this.contactSettings.companyName.displayName : defaultContactSettings.CONST_VALUE.companyName.displayName}`,
            value: 'companyName',
            type: 'specialType',
            valueType: 'String',
          },
          {
            name: 'Sale Assigned To',
            value: 'assignedTo',
            type: 'specialType',
            valueType: 'assignedTo',
          },
          {
            name: 'Customer Country Code',
            value: 'code',
            type: 'String',
            valueType: 'List',
          },
          // {name:"Phone Number",value:"${invoice.code}-${invoice.contactNo}"},
          {
            name: `${this.saleSettings.saleTitle.displayName && !this.saleSettings.saleTitle.displayName.includes(defaultSaleSettings.CONST_VALUE.saleTitle.displayName) ? `${this.saleSettings.saleTitle.displayName} Title` : this.saleSettings.saleTitle.displayName || ''}`,
            value: 'docData.saleTitle',
            type: 'specialType',
            valueType: 'String',
          },
          {
            name: `Total ${this.fieldNameInvoice} value`,
            value: 'docData.totalInclTax',
            type: 'Number',
            valueType: 'String',
          },
        ],
        estimate: [
          {
            name: 'Customer Email',
            value: 'email',
            type: 'String',
            valueType: 'String',
          },
          {
            name: `Customer ${this.contactSettings.firstName.displayName ? this.contactSettings.firstName.displayName : defaultContactSettings.CONST_VALUE.firstName.displayName}`,
            value: 'firstName',
            type: 'specialType',
            valueType: 'String',
          },
          {
            name: `Customer ${this.contactSettings.secondName.displayName ? this.contactSettings.secondName.displayName : defaultContactSettings.CONST_VALUE.secondName.displayName}`,
            value: 'secondName',
            type: 'String',
            valueType: 'String',
          },
          {
            name: `Customer ${this.contactSettings.companyName.displayName ? this.contactSettings.companyName.displayName : defaultContactSettings.CONST_VALUE.companyName.displayName}`,
            value: 'companyName',
            type: 'specialType',
            valueType: 'String',
          },
          {
            name: 'Sale Assigned To',
            value: 'assignedTo',
            type: 'specialType',
            valueType: 'assignedTo',
          },
          {
            name: 'Customer Country Code',
            value: 'code',
            type: 'String',
            valueType: 'List',
          },
          // {name:"Phone Number",value:"${invoice.code}-${invoice.contactNo}"},
          {
            name: `${this.saleSettings.saleTitle.displayName && !this.saleSettings.saleTitle.displayName.includes(defaultSaleSettings.CONST_VALUE.saleTitle.displayName) ? `${this.saleSettings.saleTitle.displayName} Title` : this.saleSettings.saleTitle.displayName || ''}`,
            value: 'docData.saleTitle',
            type: 'specialType',
            valueType: 'String',
          },
          {
            name: `Total ${this.saleSettings.estimatedValue.displayName ? this.saleSettings.estimatedValue.displayName : defaultSaleSettings.CONST_VALUE.estimatedValue.displayName} `,
            value: 'docData.totalInclTax',
            type: 'Number',
            valueType: 'String',
          },
        ],
        quotation: [
          {
            name: 'Customer Email',
            value: 'email',
            type: 'String',
            valueType: 'String',
          },
          {
            name: `Customer ${this.contactSettings.firstName.displayName ? this.contactSettings.firstName.displayName : defaultContactSettings.CONST_VALUE.firstName.displayName}`,
            value: 'firstName',
            type: 'specialType',
            valueType: 'String',
          },
          {
            name: `Customer ${this.contactSettings.secondName.displayName ? this.contactSettings.secondName.displayName : defaultContactSettings.CONST_VALUE.secondName.displayName}`,
            value: 'secondName',
            type: 'String',
            valueType: 'String',
          },
          {
            name: `Customer ${this.contactSettings.companyName.displayName ? this.contactSettings.companyName.displayName : defaultContactSettings.CONST_VALUE.companyName.displayName}`,
            value: 'companyName',
            type: 'specialType',
            valueType: 'String',
          },
          {
            name: 'Sale Assigned To',
            value: 'assignedTo',
            type: 'specialType',
            valueType: 'assignedTo',
          },
          {
            name: 'Customer Country Code',
            value: 'code',
            type: 'String',
            valueType: 'List',
          },
          // {name:"Phone Number",value:"${invoice.code}-${invoice.contactNo}"},
          {
            name: `${this.saleSettings.saleTitle.displayName && !this.saleSettings.saleTitle.displayName.includes(defaultSaleSettings.CONST_VALUE.saleTitle.displayName) ? `${this.saleSettings.saleTitle.displayName} Title` : this.saleSettings.saleTitle.displayName || ''}`,
            value: 'docData.saleTitle',
            type: 'specialType',
            valueType: 'String',
          },
          {
            name: `Total ${this.fieldNameQuatation} value`,
            value: 'docData.totalInclTax',
            type: 'Number',
            valueType: 'String',
          },
        ],
        collection: [
          {
            name: `${this.collectionSettings.amountCollected.displayName ? this.collectionSettings.amountCollected.displayName : defaultPaymentSettings.CONST_VALUE.amountCollected.displayName} Collected`,
            value: 'amountCollected',
            type: 'Number',
            valueType: 'String',
          },
          {
            name: 'Created by',
            value: 'createdById',
            type: 'specialType',
            valueType: 'assignedTo',
          },
          {
            name: `Customer ${this.contactSettings.firstName.displayName ? this.contactSettings.firstName.displayName : defaultContactSettings.CONST_VALUE.firstName.displayName}`,
            value: 'customerName',
            type: 'specialType',
            valueType: 'String',
          },
          {
            name: `Customer ${this.contactSettings.secondName.displayName ? this.contactSettings.secondName.displayName : defaultContactSettings.CONST_VALUE.secondName.displayName}`,
            value: 'customerSecondName',
            type: 'String',
            valueType: 'String',
          },

          {
            name: `Customer ${this.contactSettings.companyName.displayName ? this.contactSettings.companyName.displayName : defaultContactSettings.CONST_VALUE.companyName.displayName}`,
            value: 'customerCompany',
            type: 'specialType',
            valueType: 'String',
          },
          {
            name: `${this.collectionSettings.saletitle.displayName ? this.collectionSettings.saletitle.displayName : defaultPaymentSettings.CONST_VALUE.saletitle.displayName}`,
            value: 'saleTitle',
            type: 'specialType',
            valueType: 'String',
          },
          {
            name: `${this.collectionSettings.currency.displayName ? this.collectionSettings.currency.displayName : defaultPaymentSettings.CONST_VALUE.currency.displayName}`,
            value: 'currency',
            type: 'specialType',
            valueType: 'List',
          },
          // {name:"Phone Number",value:"${invoice.code}-${invoice.contactNo}"},
          {
            name: `${this.collectionSettings.paymentMode.displayName ? this.collectionSettings.paymentMode.displayName : defaultPaymentSettings.CONST_VALUE.paymentMode.displayName}`,
            value: 'paymentMode',
            type: 'specialType',
            valueType: 'List',
          },
          {
            name: `${this.collectionSettings.paymentType.displayName ? this.collectionSettings.paymentType.displayName : defaultPaymentSettings.CONST_VALUE.paymentType.displayName}`,
            value: 'paymentType',
            type: 'specialType',
            valueType: 'List',
          },
          {
            name: 'Customer Type',
            value: 'customerCompany',
            type: 'customerType',
            valueType: 'List',
          },
        ],
        followup: [
          {
            name: `${this.followUpSettings.direction.displayName ? this.followUpSettings.direction.displayName : defaultfollowUpSettings.CONST_VALUE.direction.displayName}`,
            value: 'direction',
            type: 'specialType',
            valueType: 'List',
          },
          {
            name: `${this.followUpSettings.outcome.displayName ? this.followUpSettings.outcome.displayName : defaultfollowUpSettings.CONST_VALUE.outcome.displayName}`,
            value: 'outcome',
            type: 'specialType',
            valueType: 'List',
          },
          {
            name: `${this.followUpSettings.status.displayName ? this.followUpSettings.status.displayName : defaultfollowUpSettings.CONST_VALUE.status.displayName}`,
            value: 'status',
            type: 'specialType',
            valueType: 'List',
          },
          {
            name: `${this.followUpSettings.completedStatus.displayName ? this.followUpSettings.completedStatus.displayName : defaultfollowUpSettings.CONST_VALUE.completedStatus.displayName}`,
            value: 'completedStatus',
            type: 'boolean',
            valueType: 'List',
          },

        ],

      };
      // // list of all possible operations for a particular module
      this.operations = [
        { name: 'Created', value: ['create'] },
        { name: 'Edited', value: ['edit'] },
        { name: 'Created or Edited', value: ['edit', 'create'] },
      ];
      //For follow ups we are only providing edited triggers, this
      //Note that the value in triggers and key provided in operationPerTrigger are matching
      this.operationsPerTrigger = {
        contact: this.operations,
        sale: this.operations,
        estimate: this.operations,
        invoice: this.operations,
        collection: this.operations,
        quotation: this.operations,
        service: this.operations,
        followup: [
          { name: 'Edited', value: ['edit'] },
        ]
      }
      // actions for invoicing plan
      this.actions_invoicing = [

        {
          name: 'Send Email',
          value: 'sendEmail',
          triggers: [
            'contact',
            'quotation',
            'invoice',
            'estimate'

          ],
        },
        // {
        //   name: 'Send SMS',
        //   value: 'sendSMS',
        //   triggers: [
        //     'contact',
        //     'quotation',
        //     'invoice',
        //     'estimate'
        //   ],
        // },

        // {name:"Create Invoice",value:"this.createInvoice(this.currentRule)",triggers:["contact","sale"]},
        // {name:"Create Estimate",value:"this.createEstimate(this.currentRule)",triggers:["contact","sale"]},
        // {name:"Create Quotation",value:"this.createQuotation(this.currentRule)",triggers:["contact","sale"]},
      ];
      // list of all triggers for lead management plan
      this.triggers_leadManagement = [
        { name: this.fieldNameContact, value: 'contact' },
        { name: this.fieldNameFollowUp, value: 'followup' }
      ];
      // actions for leadManagement plan
      this.actions_leadManagement = [
        {
          name: `Create ${this.fieldNameFollowUp}`,
          value: 'createfollowupTask',
          triggers: ['contact', 'followup'],
        },
        {
          name: `Create ${this.fieldNameTask}`,
          value: 'createTask',
          triggers: [
            'contact'
          ],
        },
        {
          name: 'Send Email',
          value: 'sendEmail',
          triggers: [
            'contact'
          ],
        },
        // {
        //   name: 'Send SMS',
        //   value: 'sendSMS',
        //   triggers: [
        //     'contact'
        //   ],
        // },

        // {name:"Create Invoice",value:"this.createInvoice(this.currentRule)",triggers:["contact","sale"]},
        // {name:"Create Estimate",value:"this.createEstimate(this.currentRule)",triggers:["contact","sale"]},
        // {name:"Create Quotation",value:"this.createQuotation(this.currentRule)",triggers:["contact","sale"]},
      ];
      //  used for notes section in last form for selecting a field
      this.fieldsToUse = {
        service: [
          { name: 'Email', value: '${service.email}' },
          { name: 'Phone Number', value: '${service.code}-${service.contactNo}' },
        ],
        sale: [
          { name: 'Email', value: '${sale.email}' },
          { name: `${this.contactSettings.firstName.displayName ? this.contactSettings.firstName.displayName : defaultContactSettings.CONST_VALUE.firstName.displayName}`, value: '${sale.firstName}' },
          { name: `${this.contactSettings.secondName.displayName ? this.contactSettings.secondName.displayName : defaultContactSettings.CONST_VALUE.secondName.displayName}`, value: '${sale.secondName}' },
          { name: `${this.saleSettings.saleTitle.displayName ? this.saleSettings.saleTitle.displayName : defaultSaleSettings.CONST_VALUE.saleTitle.displayName}`, value: '${sale.saleTitle}' },
          { name: `${this.saleSettings.estimatedValue.displayName ? this.saleSettings.estimatedValue.displayName : defaultSaleSettings.CONST_VALUE.estimatedValue.displayName}`, value: '${sale.estimatedValue}' },
          { name: 'Phone Number', value: '${sale.code}-${sale.contactNo}' },
        ],
        contact: [
          { name: 'Email', value: '${contact.email}' },
          { name: `${this.contactSettings.firstName.displayName ? this.contactSettings.firstName.displayName : defaultContactSettings.CONST_VALUE.firstName.displayName}`, value: '${contact.firstName}' },
          { name: `${this.contactSettings.secondName.displayName ? this.contactSettings.secondName.displayName : defaultContactSettings.CONST_VALUE.secondName.displayName}`, value: '${contact.secondName}' },
          { name: `${this.contactSettings.companyName.displayName ? this.contactSettings.companyName.displayName : defaultContactSettings.CONST_VALUE.companyName.displayName}`, value: '${contact.companyName}' },
          { name: 'Country Code', value: '${contact.code}' },
          { name: 'Phone Number', value: '${contact.code}-${contact.contactNo}' },
        ],
        estimate: [
          { name: 'Customer Email', value: '${estimate.email}' },
          { name: `Customer ${this.contactSettings.firstName.displayName ? this.contactSettings.firstName.displayName : defaultContactSettings.CONST_VALUE.firstName.displayName}`, value: '${estimate.firstName}' },
          { name: `Customer ${this.contactSettings.secondName.displayName ? this.contactSettings.secondName.displayName : defaultContactSettings.CONST_VALUE.secondName.displayName}`, value: '${estimate.secondName}' },
          { name: `Customer ${this.contactSettings.companyName.displayName ? this.contactSettings.companyName.displayName : defaultContactSettings.CONST_VALUE.companyName.displayName}`, value: '${estimate.companyName}' },
          { name: 'Customer Country Code', value: '${estimate.code}' },
          {
            name: 'Customer Phone Number',
            value: '${estimate.code}-${estimate.contactNo}',
          },
          { name: `${this.saleSettings.saleTitle.displayName ? this.saleSettings.saleTitle.displayName : defaultSaleSettings.CONST_VALUE.saleTitle.displayName}`, value: '${estimate.docData.saleTitle}' },
          {
            name: `Total ${this.saleSettings.estimatedValue.displayName ? this.saleSettings.estimatedValue.displayName : defaultSaleSettings.CONST_VALUE.estimatedValue.displayName}`,
            value: '${estimate.docData.totalInclTax}',
          },
        ],
        invoice: [
          { name: 'Customer Email', value: '${invoice.email}' },
          { name: `Customer ${this.contactSettings.firstName.displayName ? this.contactSettings.firstName.displayName : defaultContactSettings.CONST_VALUE.firstName.displayName}`, value: '${invoice.firstName}' },
          { name: `Customer ${this.contactSettings.secondName.displayName ? this.contactSettings.secondName.displayName : defaultContactSettings.CONST_VALUE.secondName.displayName}`, value: '${invoice.secondName}' },
          { name: `Customer ${this.contactSettings.companyName.displayName ? this.contactSettings.companyName.displayName : defaultContactSettings.CONST_VALUE.companyName.displayName}`, value: '${invoice.companyName}' },
          { name: 'Customer Country Code', value: '${invoice.code}' },
          {
            name: 'Customer Phone Number',
            value: '${invoice.code}-${invoice.contactNo}',
          },
          { name: `${this.saleSettings.saleTitle.displayName ? this.saleSettings.saleTitle.displayName : defaultSaleSettings.CONST_VALUE.saleTitle.displayName}`, value: '${invoice.docData.saleTitle}' },
          {
            name: `Total ${this.fieldNameInvoice} value`,
            value: '${invoice.docData.totalInclTax}',
          },
        ],
        quotation: [
          { name: 'Customer Email', value: '${quotation.email}' },
          { name: `Customer ${this.contactSettings.firstName.displayName ? this.contactSettings.firstName.displayName : defaultContactSettings.CONST_VALUE.firstName.displayName}`, value: '${quotation.firstName}' },
          { name: `Customer ${this.contactSettings.secondName.displayName ? this.contactSettings.secondName.displayName : defaultContactSettings.CONST_VALUE.secondName.displayName}`, value: '${quotation.secondName}' },
          { name: `Customer ${this.contactSettings.companyName.displayName ? this.contactSettings.companyName.displayName : defaultContactSettings.CONST_VALUE.companyName.displayName}`, value: '${quotation.companyName}' },
          { name: 'Customer Country Code', value: '${quotation.code}' },
          {
            name: 'Customer Phone Number',
            value: '${quotation.code}-${quotation.contactNo}',
          },
          { name: `${this.saleSettings.saleTitle.displayName ? this.saleSettings.saleTitle.displayName : defaultSaleSettings.CONST_VALUE.saleTitle.displayName}`, value: '${quotation.docData.saleTitle}' },
          {
            name: `Total ${this.fieldNameQuatation} value`,
            value: '${quotation.docData.totalInclTax}',
          },
        ],
        collection: [
          { name: 'Customer Email', value: '${collection.email}' },
          { name: 'Customer customer', value: '${collection.customerName}' },
          { name: 'Customer company ', value: '${collection.customerCompany}' },
          { name: `Collected ${this.fieldNameCollection}`, value: '${collection.amountCollected}' },
          { name: 'Customer Phone Number', value: '${collection.code}-${collection.contactNo}' },

        ],
        followup: [
          { name: 'Contact Email', value: '${followup.email}' },
          { name: `Contact ${this.contactSettings.firstName.displayName ? this.contactSettings.firstName.displayName : defaultContactSettings.CONST_VALUE.firstName.displayName}`, value: '${followup.firstName}' },
          { name: `Contact ${this.contactSettings.secondName.displayName ? this.contactSettings.secondName.displayName : defaultContactSettings.CONST_VALUE.secondName.displayName}`, value: '${followup.secondName}' },
          { name: `Contact ${this.contactSettings.companyName.displayName ? this.contactSettings.companyName.displayName : defaultContactSettings.CONST_VALUE.companyName.displayName}`, value: '${followup.companyName}' },
          { name: 'Contact Country Code', value: '${followup.code}' },
          { name: 'Contact Phone Number', value: '${followup.code}-${followup.contactNo}' },
        ]

      };
      //date fields provide the options for populating date reference in last tab of operations
      //When we are adding date fields we need to check whether it is being saved as reguular timestamp or firebase timestamp
      // timestamp refers to normal date format (number)
      // firebasetimestamp refers to firebase time stamp which gets saved in db from date picker

      this.dateFields = {
        contact: [
          {
            name: `${this.fieldNameContact} created date`,
            value: 'contact.dateCreated',
            type: 'timestamp',
          },
          { name: 'triggered date', value: 'Date.now()', type: 'timestamp' },
          // {name:"created date",value:"contact.createdDate" },
          // {name:"created date",value:"contact.createdDate" },
        ],
        sale: [
          {
            name: `${this.fieldNameSale} created date`,
            value: 'sale.createdDate',
            type: 'timestamp',
          },
          { name: 'triggered date', value: 'Date.now()', type: 'timestamp' },
          {
            name: `${this.fieldNameSale} ${this.saleSettings.expCompletionDate.displayName ? this.saleSettings.expCompletionDate.displayName : defaultSaleSettings.CONST_VALUE.expCompletionDate.displayName}`,
            value: 'sale.expCompletionDate',
            type: 'firebasetimestamp',
          },
          {
            name: `${this.fieldNameSale}  ${this.saleSettings.startDate.displayName ? this.saleSettings.startDate.displayName : defaultSaleSettings.CONST_VALUE.startDate.displayName}`,
            value: 'sale.startDate',
            type: 'firebasetimestamp',
          },
        ],
        estimate: [
          {
            name: `${this.fieldNameEstimate} created date`,
            value: 'estimate.docData.createdDate',
            type: 'timestamp',
          },
          { name: 'triggered date', value: 'Date.now()', type: 'timestamp' },
          {
            name: `${this.fieldNameEstimate} date`,
            value: 'estimate.docData.docDate',
            type: 'firebasetimestamp',
          },
          {
            name: `${this.fieldNameEstimate} valid till date`,
            value: 'estimate.docData.docValidity',
            type: 'firebasetimestamp',
          },
        ],
        quotation: [
          {
            name: `${this.fieldNameQuatation} created date`,
            value: 'quotation.docData.createdDate',
            type: 'timestamp',
          },
          { name: 'triggered date', value: 'Date.now()', type: 'timestamp' },
          {
            name: 'created date',
            value: 'quotation.docData.docDate',
            type: 'firebasetimestamp',
          },
          {
            name: `${this.fieldNameQuatation} valid till date`,
            value: 'quotation.docData.docValidity',
            type: 'firebasetimestamp',
          },
        ],
        invoice: [
          {
            name: `${this.fieldNameInvoice} created date`,
            value: 'invoice.docData.createdDate',
            type: 'timestamp',
          },
          {
            name: 'triggered date',
            value: 'Date.now()',
            type: 'timestamp'
          },
          {
            name: `${this.fieldNameInvoice} date`,
            value: 'invoice.docData.docDate',
            type: 'firebasetimestamp',
          },
          {
            name: `${this.fieldNameInvoice} due date`,
            value: 'invoice.docData.dueDate',
            type: 'firebasetimestamp',
          },
        ],
        collection: [
          {
            name: 'created date',
            value: 'collection.createDate',
            type: 'timestamp'
          },
          {
            name: `${this.fieldNameCollection} date`,
            value: 'collection.paymentDate',
            type: 'firebasetimestamp',
          },
        ],
        followup: [
          {
            name: 'created date',
            value: 'followup.dateCreated',
            type: 'timestamp'
          },
          {
            name: ` ${this.followUpSettings.callStartDate.displayName ? this.followUpSettings.callStartDate.displayName : defaultfollowUpSettings.CONST_VALUE.callStartDate.displayName}`,
            value: 'followup.callStartDate',
            type: 'firebasetimestamp'
          },
          {
            name: `Next ${this.fieldNameFollowUp} date`,
            value: 'followup.nextFollowUpDate',
            type: 'firebasetimestamp'
          },
        ],
        service: [{
          name: `${this.serviceSettings.startDate.displayName ? this.serviceSettings.startDate.displayName : defaultServiceSettings.CONST_VALUE.startDate.displayName}`,
          value: 'service.startDate',
          type: 'firebasetimestamp'

        },
        {
          name: 'created Date',
          value: 'service.createdDate',
          type: 'timestamp'

        },
        {
          name: 'Confirmed Date',
          value: 'service.confirmedserviceDate',
          type: 'firebasetimestamp'

        },
        {
          name: 'Completed Date',
          value: 'service.completedserviceDate',
          type: 'firebasetimestamp'

        },
        {
          name: `${this.serviceSettings.expCompletionDate.displayName ? this.serviceSettings.expCompletionDate.displayName : defaultServiceSettings.CONST_VALUE.expCompletionDate.displayName}`,
          value: 'service.expCompletionDate',
          type: 'firebasetimestamp'

        },



        ]
      };
      this.pipelineNames.contact = data.customerPipelines;//contact pipelines
      this.pipelineNames.sale =  data.salePipelines; // sale pipelines
      this.pipelineNames.service = data.servicePipelines; // service pipelines
      
      for (let index = 0; index < this.pipelineNames.contact.length; index++) {
       this.pipelineStatus.contact[index] = this.pipelineNames.contact[index].pipelineStages
        
      }
      for (let index = 0; index < this.pipelineNames.sale.length; index++) {
       this.pipelineStatus.sales[index] = this.pipelineNames.sale[index].pipelineStages
        
      }
      for (let index = 0; index < this.pipelineNames.service.length; index++) {
       this.pipelineStatus.service[index] = this.pipelineNames.service[index].pipelineStages
      }
     

      // For displaying pipeline name along with the status 
      this.pipelineStatus.contact.forEach((ele, i) => {
        ele.forEach((inele) => {
          this.valueList.contactstatus.push({
            name: inele.name + "(" + this.pipelineNames.contact[i].pipelineName + ")", value: inele.stageId
          })
        })
      })
      // For displaying pipeline name along with the stage
      this.pipelineStatus.sales.forEach((ele, i) => {
        ele.forEach((inele) => {
          this.valueList.salesStage.push({
            name: inele.name + "(" + this.pipelineNames.sale[i].pipelineName  + ")", value: inele.stageId
          })
        })
      })
      // For displaying pipeline name along with the stage
      this.pipelineStatus.service.forEach((ele, i) => {
        ele.forEach((inele) => {
          this.valueList.servicesStage.push({
            name: inele.name + "(" + this.pipelineNames.service[i].pipelineName  + ")", value: inele.stageId
          })
        })
      })

      this.valueList.followupstatus = []
      if (!!data.superUserDetails.followUpStatus)
        data.superUserDetails.followUpStatus.forEach((inele) => {
          this.valueList.followupstatus.push({ name: inele, value: inele })
        })
      //Add custom fields to the options and values
      if (!!data.superUserDetails.customFieldsContact)
        contactAddtFields = data.superUserDetails.customFieldsContact;
      if (!!data.superUserDetails.customFieldsSale)
        saleAddtFields = data.superUserDetails.customFieldsSale;
      if (!!data.superUserDetails.customFieldsService)
        serviceAddtFields = data.superUserDetails.customFieldsSale;
      if (!!data.superUserDetails.customFieldsTask)
        taskAddtFields = data.superUserDetails.customFieldsTask;
      if (!!data.superUserDetails.customFieldsFollowUp)
        followUpAddtFields = data.superUserDetails.customFieldsFollowUp;

      // if default value present for additional field use them
      taskAddtFields.forEach((field, index) => {
        this.taskAddFArray[index] = {
          fieldValue: field.defaultValue
        };
      })
    // if default value present for additional field use them
      followUpAddtFields.forEach((field, index) => {
        this.follAddFArray[index] = {
          fieldValue: field.defaultValue
        };
      })
      // adding active additional fields to fieldList
      if (contactAddtFields.length > 0) {
        contactAddtFields.forEach((e, i) => {
          if (e.isActive) {
            if (e.fieldType == 'category') {
              this.fieldList.contact.push({
                name: e.fieldName,
                value: 'additionalFieldsArr["' + i + '"].fieldValue',
                type: 'String',
                valueType: 'List',
              });
              this.valueList[
                'contactadditionalFieldsArr["' + i + '"].fieldValue'
              ] = e.categories;
            } else if (e.fieldType == 'number') {
              this.fieldList.contact.push({
                name: e.fieldName,
                value: 'additionalFieldsArr["' + i + '"].fieldValue',
                type: 'Number',
                valueType: 'String',
              });
            } else if (e.fieldType == 'inputField') {
              this.fieldList.contact.push({
                name: e.fieldName,
                value: 'additionalFieldsArr["' + i + '"].fieldValue',
                type: 'specialType',
                valueType: 'String',
              });
            } else if (e.fieldType == 'date') {
              this.dateFields.contact.push({
                name: e.fieldName,
                value: 'contact.additionalFieldsArr["' + i + '"].fieldValue',
                type: 'firebasetimestamp',
              });
            } else if (e.fieldType == 'date_time') {
              this.dateFields.contact.push({
                name: e.fieldName,
                value: 'contact.additionalFieldsArr["' + i + '"].fieldValue',
                type: 'firebasetimestamp',
              });
            }
          }
        });
      }

      if (saleAddtFields.length > 0) {
        saleAddtFields.forEach((e, i) => {
          if (e.isActive) {
            if (e.fieldType == 'category') {
              this.fieldList.sale.push({
                name: e.fieldName,
                value: 'additionalFieldsArr["' + i + '"].fieldValue',
                type: 'String',
                valueType: 'List',
              });
              this.valueList[
                'saleadditionalFieldsArr["' + i + '"].fieldValue'
              ] = e.categories;
            } else if (e.fieldType == 'number') {
              this.fieldList.sale.push({
                name: e.fieldName,
                value: 'additionalFieldsArr["' + i + '"].fieldValue',
                type: 'Number',
                valueType: 'String',
              });
            } else if (e.fieldType == 'inputField') {
              this.fieldList.sale.push({
                name: e.fieldName,
                value: 'additionalFieldsArr["' + i + '"].fieldValue',
                type: 'specialType',
                valueType: 'String',
              });
            } else if (e.fieldType == 'date') {
              this.dateFields.sale.push({
                name: e.fieldName,
                value: 'sale.additionalFieldsArr["' + i + '"].fieldValue',
                type: 'firebasetimestamp',
              });
            } else if (e.fieldType == 'date_time') {
              this.dateFields.sale.push({
                name: e.fieldName,
                value: 'sale.additionalFieldsArr["' + i + '"].fieldValue',
                type: 'firebasetimestamp',
              });
            }
          }
        });
      }
      if (serviceAddtFields) {
        if (serviceAddtFields.length > 0) {
          serviceAddtFields.forEach((e, i) => {
            if (e.isActive) {
              if (e.fieldType == 'category') {
                this.fieldList.service.push({
                  name: e.fieldName,
                  value: 'additionalFieldsArr["' + i + '"].fieldValue',
                  type: 'String',
                  valueType: 'List',
                });
                this.valueList[
                  'serviceadditionalFieldsArr["' + i + '"].fieldValue'
                ] = e.categories;
              } else if (e.fieldType == 'number') {
                this.fieldList.service.push({
                  name: e.fieldName,
                  value: 'additionalFieldsArr["' + i + '"].fieldValue',
                  type: 'Number',
                  valueType: 'String',
                });
              } else if (e.fieldType == 'inputField') {
                this.fieldList.service.push({
                  name: e.fieldName,
                  value: 'additionalFieldsArr["' + i + '"].fieldValue',
                  type: 'specialType',
                  valueType: 'String',
                });
              } else if (e.fieldType == 'date') {
                this.dateFields.service.push({
                  name: e.fieldName,
                  value: 'service.additionalFieldsArr["' + i + '"].fieldValue',
                  type: 'firebasetimestamp',
                });
              } else if (e.fieldType == 'date_time') {
                this.dateFields.service.push({
                  name: e.fieldName,
                  value: 'service.additionalFieldsArr["' + i + '"].fieldValue',
                  type: 'firebasetimestamp',
                });
              }
            }
          });
        }
      }
    });
    this.routeSubscription = route.params.subscribe((val) => {
      this.automationId = this.route.snapshot.paramMap.get('id');
      this.mode = this.route.snapshot.paramMap.get('mode'); //whether edit or create mode
    });
    //get the email templates
    this.emailTemplateSubscription = this.db
      .getEmailTemplates()
      .subscribe((data) => {
        this.allEmailTemplates = data;
      });
    //get SMS templates
    this.smsTemplateSubscription = this.db
      .getSMSTemplates()
      .subscribe((data) => {
        this.allSMSTemplates = data;
      });

    this.assignedToSelection = [];
    this.superUserData = this.common.superUserData;
    this.valueList.custLeadValue = []
    this.superUserData.custLead.forEach((ele) => {
      this.valueList.custLeadValue.push({ name: ele, value: ele })
    });
    // adding superuser detaisl to assigneto array
    this.assignedToSelection.push({
      name:
        this.superUserData.firstname +
        ' ' +
        (this.superUserData.lastname ? this.superUserData.lastname : ''),
      Id: this.superUserData.superUserId,
    });
  // ssubscription for adding subuser details to assigneto array
    this.userDataSubscription = this.common.userDatas.subscribe((data) => {
      this.subUsers = data.subUsers;
      this.subUsers.forEach((element) => {
        this.assignedToSelection.push({
          name:
            element.firstname +
            ' ' +
            (element.lastname ? element.lastname : ''),
          Id: element.userId,
        });
      });


    });

    //Initialization of form groups
    this.zeroFormGroup = this._formBuilder.group({
      name: ['', Validators.required],
    });

    this.firstFormGroup = this._formBuilder.group({
      trigger: ['', Validators.required],
      operation: ['', Validators.required],
      action: ['', Validators.required],
    });

    // for(let )

    this.secondFormGroup = this._formBuilder.group({
      conditions: this._formBuilder.array([this.initCondition('', '', null)]),
    });
    // for edit mode
    if (this.mode == 'edit') {
      this.db
        .getAutomationDoc(this.automationId)
        .pipe(take(1))
        .subscribe((data: any) => {
          this.conditionAdder = data.conditionAdder;
          this.alwaysorCondition = data.alwaysorCondition
            ? data.alwaysorCondition
            : false;
            let compareVal;
            if (data.form1.trigger.value === "contact") {
              compareVal = "Contact"
            } else if (data.form1.trigger.value === "sale") {
              compareVal = "Sale"
            } else if (data.form1.trigger.value === "service") {
              compareVal = "Service"
            } else if (data.form1.trigger.value === "estimate") {
              compareVal = "Estimate"
            } else if (data.form1.trigger.value === "quotation") {
              compareVal = "Quotation"
            } else if (data.form1.trigger.value === "invoice") {
              compareVal = "Invoice"
            } else if (data.form1.trigger.value === "collection") {
              compareVal = "Collection"
            }
            else if (data.form1.trigger.name === "followup") {
              compareVal = "FollowUp"
            }
          this.triggeredAction = this.actions.filter((ele) =>
            ele.triggers.includes(data.form1.trigger.value)
          );
          this.emailTemplates = this.allEmailTemplates.filter(
            (ele) => ele.templateType == compareVal
          );
          this.SMSTemplatesFiltered = this.allSMSTemplates.filter(
            (ele) => ((ele.tempRecType == compareVal) && (ele.templateType === 'SMS'))
          );
          this.WaTemplatesFiltered = this.allSMSTemplates.filter(
            (ele) => ((ele.tempRecType == compareVal) && (ele.templateType === 'WhatsApp'))
          );

          this.zeroFormGroup.patchValue({
            name: data.name,
          });
          //actions 
          if (data.form1.action.value == "createfollowupTask") {
            data.form1.action.name = `Create ${this.fieldNameFollowUp}`;
          } if (data.form1.action.value == "createTask") {
            data.form1.action.name = `Create ${this.fieldNameTask}`;
          } if (data.form1.action.value == "sendEmail") {
            data.form1.action.name = "Send Email";
          }
          if (data.form1.action.value == "sendSMS" && data.form3?.SMSTemplate?.templateType === "WhatsApp") {
            data.form1.action.name = "Send Whatsapp message";
          }
          if (data.form1.action.value == "sendSMS" && data.form3?.SMSTemplate?.templateType === "SMS") {
            data.form1.action.name = "Send SMS";
          }
          
          //trigger values
          if (data.form1.trigger.value == "contact") {
            data.form1.trigger.name = this.fieldNameContact;
          } else if (data.form1.trigger.value == "sale") {
            data.form1.trigger.name = this.fieldNameSale;
          } else if (data.form1.trigger.value == "estimate") {
            data.form1.trigger.name = this.fieldNameEstimate;

          } else if (data.form1.trigger.value == "quotation") {
            data.form1.trigger.name = this.fieldNameQuatation;

          } else if (data.form1.trigger.value == "invoice") {
            data.form1.trigger.name = this.fieldNameInvoice;

          } else if (data.form1.trigger.value == "collection") {
            data.form1.trigger.name = this.fieldNameCollection;

          } else if (data.form1.trigger.value == "followup") {
            data.form1.trigger.name = this.fieldNameFollowUp;
          } else if (data.form1.trigger.value == "service") {
            data.form1.trigger.name = this.fieldNameService;
          }
          this.firstFormGroup.setValue({
            trigger: data.form1.trigger,
            operation: data.form1.operation,
            action: data.form1.action,
          });
          this.fieldToCopy =
            this.fieldsToUse[data.form1.trigger.value][0].value;
          this.secondFormGroup = this._formBuilder.group({
            conditions: this._formBuilder.array([]),
          });
          this.loadComplete = true;
          var conditionForm = data.form2.conditions;
          for (let i = 0; i < conditionForm.length; i++) {
            //customisation
            if (conditionForm[i].field.value == "firstName") {
              conditionForm[i].field.name = `Customer ${this.contactSettings.firstName.displayName ? this.contactSettings.firstName.displayName : defaultContactSettings.CONST_VALUE.firstName.displayName}`;
            }
            else if (conditionForm[i].field.value == "secondName") {
              conditionForm[i].field.name = `Customer ${this.contactSettings.secondName.displayName ? this.contactSettings.secondName.displayName : defaultContactSettings.CONST_VALUE.secondName.displayName}`;
            }
            else if (conditionForm[i].field.value === "companyName") {
              conditionForm[i].field.name = `Customer ${this.contactSettings.companyName.displayName ? this.contactSettings.companyName.displayName : defaultContactSettings.CONST_VALUE.companyName.displayName}`;
            }
            else if (conditionForm[i].field.value == "status") {
              conditionForm[i].field.name = this.contactSettings.status.displayName ? this.contactSettings.status.displayName : defaultContactSettings.CONST_VALUE.status.displayName
            }
            else if (conditionForm[i].field.value == "priority") {
              conditionForm[i].field.name = this.contactSettings.priority.displayName ? this.contactSettings.priority.displayName : defaultContactSettings.CONST_VALUE.priority.displayName
            }
            else if (conditionForm[i].field.value == "custLeadValue") {
              conditionForm[i].field.name = this.contactSettings.custLeadValue.displayName ? this.contactSettings.custLeadValue.displayName : defaultContactSettings.CONST_VALUE.custLeadValue.displayName
            }
            else if (conditionForm[i].field.value === "selectedContactPipeline") {
              conditionForm[i].field.name = this.contactSettings.selectedContactPipeline.displayName ? this.contactSettings.selectedContactPipeline.displayName : defaultContactSettings.CONST_VALUE.selectedContactPipeline.displayName
            }
            else if (conditionForm[i].field.value === "selectedSalePipeline") {
              conditionForm[i].field.name = this.saleSettings.selectedSalePipeline.displayName ? this.saleSettings.selectedSalePipeline.displayName : defaultSaleSettings.CONST_VALUE.selectedSalePipeline.displayName
            }
            else if (conditionForm[i].field.value === "selectedServPipeline") {
              conditionForm[i].field.name = this.serviceSettings.selectedServPipeline.displayName ? this.serviceSettings.selectedServPipeline.displayName : defaultServiceSettings.CONST_VALUE.selectedServPipeline.displayName
            }
            else if (conditionForm[i].field.value === "servicesStage") {
              conditionForm[i].field.name = this.serviceSettings.servicesStage.displayName ? this.serviceSettings.servicesStage.displayName : defaultServiceSettings.CONST_VALUE.servicesStage.displayName
            }
            else if (conditionForm[i].field.value === "salesStage") {
              conditionForm[i].field.name = this.saleSettings.salesStage.displayName ? this.saleSettings.salesStage.displayName : defaultSaleSettings.CONST_VALUE.salesStage.displayName
            }
            // this.addCondition()
            if (i - 1 < 0) {
              this.addCondition(
                '',
                conditionForm[i].field,
                conditionForm[i].condition,
                conditionForm[i].value
              );
            } else
              this.addCondition(
                '',
                conditionForm[i].field,
                conditionForm[i].condition,
                conditionForm[i].value
              );

          } // If follow up creation is the action then update thhe form accordingly
          if (data.form1.action.value == 'createfollowupTask') {
            this.thirdFormGroup = this._formBuilder.group({
              dateFieldType: ['', Validators.required],
              afterorBefore: ['', Validators.required],
              followUpDate: [
                '',
                [Validators.required, Validators.pattern(/^[0-9]\d*$/)],
              ],
              // callStartDate: ['', Validators.required],
              notes: ['', Validators.required],
              assignedTo: ['', Validators.required],
            });
          }
          if (data.form1.action.value == 'createTask') {
            this.thirdFormGroup = this._formBuilder.group({
              dateFieldType: ['', Validators.required],
              afterorBefore: ['', Validators.required],
              dueDate: [
                '',
                [Validators.required, Validators.pattern(/^[0-9]\d*$/)],
              ],
              description: ['', Validators.required],
              title: ['', Validators.required],
              assignedTo: ['', Validators.required],
              priority: ['', Validators.required],
            });
          }
          if (data.form1.action.value == 'sendEmail') {
            this.thirdFormGroup = this._formBuilder.group({
              To: ['', Validators.required],
              cc: [''],
              template: ['', Validators.required],
            });
          }
          if (data.form1.action.value == 'sendSMS') {
            this.thirdFormGroup = this._formBuilder.group({
              To: ['', Validators.required],
              SMSTemplate: ['', Validators.required],
            });
          }
          if (data.form1.action.value == 'sendSMS') {
            this.thirdFormGroup = this._formBuilder.group({
              To: ['', Validators.required],
              SMSTemplate: ['', Validators.required],
            });
          }
          if (data.form3.dateFieldType?.value == "contact.dateCreated") {
            data.form3.dateFieldType.name = `${this.fieldNameContact} created date`;
          }
          else if (data.form3.dateFieldType?.value == "sale.createdDate") {
            data.form3.dateFieldType.name = `${this.fieldNameSale} created date`;
          }
          else if (data.form3.dateFieldType?.value == "sale.expCompletionDate") {
            data.form3.dateFieldType.name = `${this.fieldNameSale} expected completion date`;
          }
          else if (data.form3.dateFieldType?.value == "sale.startDate") {
            data.form3.dateFieldType.name = `${this.fieldNameSale} start date`;
          }
          else if (data.form3.dateFieldType?.value == "estimate.docData.createdDate") {
            data.form3.dateFieldType.name = `${this.fieldNameEstimate} created date`;
          }
          else if (data.form3.dateFieldType?.value == "estimate.docData.docDate") {
            data.form3.dateFieldType.name = `${this.fieldNameEstimate} date`;
          }
          else if (data.form3.dateFieldType?.value == "estimate.docData.docValidity") {
            data.form3.dateFieldType.name = `${this.fieldNameEstimate} valid till date`;
          }
          else if (data.form3.dateFieldType?.value == "quotation.docData.createdDate") {
            data.form3.dateFieldType.name = `${this.fieldNameQuatation} created date`;
          }
          else if (data.form3.dateFieldType?.value == "quotation.docData.docDate") {
            data.form3.dateFieldType.name = `created date`;
          }
          else if (data.form3.dateFieldType?.value == "quotation.docData.docValidity") {
            data.form3.dateFieldType.name = `${this.fieldNameQuatation} valid till date`;
          }
          else if (data.form3.dateFieldType?.value == "invoice.docData.createdDate") {
            data.form3.dateFieldType.name = `${this.fieldNameInvoice} created date`;
          }
          else if (data.form3.dateFieldType?.value == "Date.now()") {
            data.form3.dateFieldType.name = `triggered date`;
          }
          else if (data.form3.dateFieldType?.value == "invoice.docData.docDate") {
            data.form3.dateFieldType.name = `${this.fieldNameInvoice} date`;
          }
          else if (data.form3.dateFieldType?.value == "invoice.docData.dueDate") {
            data.form3.dateFieldType.name = `${this.fieldNameInvoice} due date`;
          }//collection
          else if (data.form3.dateFieldType?.value == "collection.createDate") {
            data.form3.dateFieldType.name = `created date`;
          }
          else if (data.form3.dateFieldType?.value == "collection.paymentDate") {
            data.form3.dateFieldType.name = `${this.fieldNameCollection} date`;
          }//followup
          else if (data.form3.dateFieldType?.value == "followup.dateCreated") {
            data.form3.dateFieldType.name = `created date`;
          }
          else if (data.form3.dateFieldType?.value == "followup.callStartDate") {
            data.form3.dateFieldType.name = `Call Date`;
          }
          else if (data.form3.dateFieldType?.value == "followup.nextFollowUpDate") {
            data.form3.dateFieldType.name = `Next ${this.fieldNameFollowUp} date`;
          }//services
          else if (data.form3.dateFieldType?.value == "service.startDate") {
            data.form3.dateFieldType.name = `${this.serviceSettings.startDate.displayName ? this.serviceSettings.startDate.displayName : defaultServiceSettings.CONST_VALUE.startDate.displayName}`;
          }
          else if (data.form3.dateFieldType?.value == "service.createdDate") {
            data.form3.dateFieldType.name = `created Date`;
          }
          else if (data.form3.dateFieldType?.value == "service.confirmedserviceDate") {
            data.form3.dateFieldType.name = `Confirmed Date`;
          }
          else if (data.form3.dateFieldType?.value == "service.completedserviceDate") {
            data.form3.dateFieldType.name = `Completed Date`;
          }
          else if (data.form3.dateFieldType?.value == "service.expCompletionDate") {
            data.form3.dateFieldType.name = `${this.serviceSettings.expCompletionDate.displayName ? this.serviceSettings.expCompletionDate.displayName : defaultServiceSettings.CONST_VALUE.expCompletionDate.displayName}`;
          }
          if (this.thirdFormGroup) {
            this.thirdFormGroup.patchValue(data.form3);
         }
        });
    }
  }

  ngOnInit() {


    if (this.mode == 'create') {
      this.loadComplete = true;
    }
    if (this.plan == 'invoicing') {
      this.triggers = this.triggers_invoicing;
      this.actions = this.actions_invoicing;
    } else if (this.plan == 'leadManagement') {
      this.triggers = this.triggers_leadManagement;
      this.actions = this.actions_leadManagement;
    }

  }

  // function to convert the condition into a single string for eval
  formGroup2() {
    if (this.alwaysorCondition == false) {
      var conditions = this.secondFormGroup.value.conditions;
      this.conditionfullString = '';
      var secondCondition = '&&((true)';
      for (let i = 0; i < conditions.length; i++) {
        if (
          !(
            conditions[i].condition.value == '!!' || //service.expCompletionDate
            conditions[i].condition.value == '!'
          )
        ) {
          secondCondition +=
            '&&(!!' +
            this.firstFormGroup.value.trigger.value +
            '.' +
            conditions[i].field.value +
            ')';
        }
        // if ((i != conditions.length - 1)&&(!((conditions[i].condition.value == '!!') ||
        // (conditions[i].condition.value == '!'))))
        // secondCondition += '&&';
        var conditionString = '(';
        if (
          conditions[i].condition.value == '!!' ||
          conditions[i].condition.value == '!'
        ) {

          conditionString +=
            conditions[i].condition.value + // !!
            this.firstFormGroup.value.trigger.value + // sale
            '.' +
            conditions[i].field.value + // estimatedAmount
            ')';//!!sale.estimatedValue
        } else if (conditions[i].condition.value == 'specialValue1') {

          conditionString +=
            '((old' +
            this.firstFormGroup.value.trigger.value + //sale
            '.' +
            conditions[i].field.value + //estimatedValue
            '!=' +
            this.firstFormGroup.value.trigger.value + //sale
            '.' +
            conditions[i].field.value + //estimatedValue
            ')&&(' +
            this.firstFormGroup.value.trigger.value + //sale
            '.' +
            conditions[i].field.value + //estimatedValue
            "=='" +
            conditions[i].value + //1000
            "')))"; //(oldsale.estimatedValue!=sale.estimatedValue)&&(sale.estimatedValue==1000)
          (')');
        } else if (conditions[i].condition.value == 'specialValue2') {

          conditionString +=
            'old' +
            this.firstFormGroup.value.trigger.value +
            '.' +
            conditions[i].field.value +
            '!=' +
            this.firstFormGroup.value.trigger.value +
            '.' +
            conditions[i].field.value +
            ')';
        } else {
          if (conditions[i].field.type == 'String') {

            conditionString +=
              this.firstFormGroup.value.trigger.value +
              '.' +
              conditions[i].field.value +
              conditions[i].condition.value +
              "'" +
              conditions[i].value +
              "')";
          }
          if (conditions[i].field.type == 'specialType') {

            conditionString +=
              this.firstFormGroup.value.trigger.value +
              '.' +
              conditions[i].field.value +
              conditions[i].condition.value +
              "'" +
              conditions[i].value +
              "')";
          }
          if (conditions[i].field.type == 'boolean') {

            conditionString +=
              this.firstFormGroup.value.trigger.value +
              '.' +
              conditions[i].field.value +
              conditions[i].condition.value +
              "" +
              conditions[i].value +
              ")";
          }
          if (conditions[i].field.type == 'Number') {

            conditionString +=
              this.firstFormGroup.value.trigger.value +
              '.' +
              conditions[i].field.value +
              conditions[i].condition.value +
              conditions[i].value +
              ')';
          }
          if (conditions[i].field.type == 'customerType') {

            conditionString +=
              this.firstFormGroup.value.trigger.value +
              '.' +
              conditions[i].field.value +
              conditions[i].condition.value +
              "'" +
              conditions[i].value +
              "')";
          }
        }
        this.conditionfullString +=
          conditionString +
          (this.conditionAdder[i] ? this.conditionAdder[i] : '');
      }
      secondCondition += ')';
      this.conditionfullString += secondCondition;

    } else this.conditionfullString = 'true';
  }

  // function to initialise the second form group of conditions
  initCondition(initialField, initialCondition, initialValue) {
    return this._formBuilder.group({
      field: [initialField],
      condition: [initialCondition],
      value: [initialValue],
    });
  }

  //  function to add conditions in second form group
  addCondition(x, initialField, initialCondition, initialValue) {
    if (x != '') this.conditionAdder.push(x);

    const control = <FormArray>this.secondFormGroup.controls['conditions'];
    control.push(
      this.initCondition(initialField, initialCondition, initialValue)
    );
  }

  // function to remove condition
  removeAddress(i: number) {
    // remove address from the list
    const control = <FormArray>this.secondFormGroup.controls['conditions'];
    control.removeAt(i);
    this.conditionAdder.splice(i - 1, 1);
  }

  // variable to set the condition for specific data types
  conditioncreator = {
    createString: [
      { name: 'is present', value: '!!' },
      { name: 'is not present', value: '!' },
      { name: 'is equal to', value: '==' },
      { name: 'is not equal to', value: '!=' },
    ],
    createcustomerType: [
      { name: 'is an', value: '==' },
      { name: 'is not an', value: '!=' },
      // {name:"is not an Organization",value:'!="Individual"'},
    ],
    createspecialType: [ // type specialType is used for mandatory fields
      { name: 'is equal to', value: '==' },
      { name: 'is not equal to', value: '!=' },
    ],
    createboolean: [ // type boolean
      { name: 'is equal to', value: '==' },
      { name: 'is not equal to', value: '!=' },
    ],
    createNumber: [
      // {name:"is present",value:'!!'},
      // {name:"is not present",value:'!'},
      { name: 'is equal to', value: '==' },
      { name: 'is not equal to', value: '!=' },
      { name: 'is greater than', value: '>' },
      { name: 'is less than', value: '<' },
      { name: 'is greater than or equal to', value: '>=' },
      { name: 'is less than or equal to', value: '<=' },
    ],
    editString: [
      { name: 'is present', value: '!!' },
      { name: 'is not present', value: '!' },
      { name: 'is equal to', value: '==' },
      { name: 'is not equal to', value: '!=' },
      { name: 'is changed to', value: 'specialValue1' },
      { name: 'is changed', value: 'specialValue2' },
    ],
    editcustomerType: [
      { name: 'is an', value: '==' },
      { name: 'is not an', value: '!=' },
      { name: 'is changed to', value: 'specialValue1' },
      { name: 'is changed', value: 'specialValue2' },
      // {name:"is not an Organization",value:'!="Individual"'},
    ],
    editspecialType: [
      { name: 'is equal to', value: '==' },
      { name: 'is not equal to', value: '!=' },
      { name: 'is changed to', value: 'specialValue1' },
      { name: 'is changed', value: 'specialValue2' },
    ],
    editboolean: [
      { name: 'is equal to', value: '==' },
      { name: 'is not equal to', value: '!=' },
    ],
    editNumber: [
      // {name:"is present",value:'!!'},
      // {name:"is not present",value:'!'},
      { name: 'is equal to', value: '==' },
      { name: 'is not equal to', value: '!=' },
      { name: 'is greater than', value: '>' },
      { name: 'is less than', value: '<' },
      { name: 'is greater than or equal to', value: '>=' },
      { name: 'is less than or equal to', value: '<=' },
      { name: 'is changed to', value: 'specialValue1' },
      { name: 'is changed', value: 'specialValue2' },
    ],
    editDate: [{ name: 'is changed', value: 'specialValue2' }],
  };

  //
  valueInputSwitch(trigger, field) {
    if (field == 'status') {
      return trigger + field;
    } else if (field.includes('additionalFieldsArr[')) {
      return trigger + field;
    } else {
      return field;
    }
  }

  // function that selects the actions for selected triggers
  triggerableActions(trigger) {
    this.fieldToCopy = this.fieldsToUse[trigger.value][0].value;
    this.triggeredAction = this.actions.filter((ele) =>
      ele.triggers.includes(trigger.value)
    );
    let compareVal ;
    if (trigger.value === "contact") {
      compareVal = "Contact"
    } else if (trigger.value === "sale") {
      compareVal = "Sale"
    } else if (trigger.value === "service") {
      compareVal = "Service"
    } else if (trigger.value === "estimate") {
      compareVal = "Estimate"
    } else if (trigger.value === "quotation") {
      compareVal = "Quotation"
    } else if (trigger.value === "invoice") {
      compareVal = "Invoice"
    } else if (trigger.value === "collection") {
      compareVal = "Collection"
    }
    else if (trigger.value === "followup") {
      compareVal = "FollowUp"
    }
    this.emailTemplates = this.allEmailTemplates.filter(
      (ele) => ele.templateType === compareVal
    );
    this.SMSTemplatesFiltered = this.allSMSTemplates.filter(
      (ele) =>((ele.tempRecType == compareVal) && (ele.templateType === 'SMS'))
    );

    this.WaTemplatesFiltered = this.allSMSTemplates.filter(
      (ele) => ((ele.tempRecType == compareVal) && (ele.templateType == 'WhatsApp'))
    );
    let actionNameValue
    if (this.mode == 'edit')
      if (this.firstFormGroup.value.action.value == "createfollowupTask") {
        actionNameValue = this.fieldNameFollowUp;
      } else if (this.firstFormGroup.value.action.value == "createTask") {
        actionNameValue = this.fieldNameTask;
      } else if (this.firstFormGroup.value.action.value == "sendEmail") {
        actionNameValue = "Send Email";
      } else if (this.firstFormGroup.value.action.value == "sendSMS") {
        actionNameValue = "sendSMS";
      }
    this.createthirdFormGroup(actionNameValue);
  }

  // initialising thirdform group
  createthirdFormGroup(actionName) {
    if (actionName == 'createfollowupTask') {
      this.thirdFormGroup = this._formBuilder.group({
        dateFieldType: ['', Validators.required],
        afterorBefore: ['', Validators.required],
        followUpDate: [
          '',
          [Validators.required, Validators.pattern(/^[0-9]\d*$/)],
        ],
        // callStartDate: ['', Validators.required],
        notes: [''],
        assignedTo: ['', Validators.required],
      });
    }
    if (actionName == 'createTask') {
      this.thirdFormGroup = this._formBuilder.group({
        dateFieldType: ['', Validators.required],
        afterorBefore: ['', Validators.required],
        dueDate: ['', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]],
        description: [''],
        title: ['', Validators.required],
        assignedTo: ['', Validators.required],
        priority: ['', Validators.required],
      });
    }
    if (actionName == 'sendEmail') {
      this.thirdFormGroup = this._formBuilder.group({
        To: ['', Validators.required],
        cc: [''],
        template: ['', Validators.required],
      });
    }
    if (actionName == 'sendSMS') {
      this.thirdFormGroup = this._formBuilder.group({
        To: ['', Validators.required],
        SMSTemplate: ['', Validators.required],
      });
    }
    if (actionName == 'sendSMS') {
      this.thirdFormGroup = this._formBuilder.group({
        To: ['', Validators.required],
        SMSTemplate: ['', Validators.required],
      });
    }
  }

  // saving the automation
  addAutomation(thirdform) {
    this.buttonClicked = true;
    this.formGroup2();
    var switchControl = this.firstFormGroup.value.action.value;

    if (this.mode == 'create')
      this._snackBar.open('Automation created ', '', { duration: 2000 });
    else if (this.mode == 'edit') {
      this._snackBar.open('Automation updated', '', { duration: 2000 });
    }

    switch (switchControl) {
      case 'createTask':
        this.taskData(thirdform);
        break;
      case 'sendEmail':
        this.sendEmaildata(thirdform);
        break;
      case 'sendSMS':
        this.sendSMSdata(thirdform);
        break;
      case 'sendSMS':
        this.sendSMSdata(thirdform);
        break;
      case 'createfollowupTask':
        this.followUpData(thirdform);
        break;
    }
  }

  // if automation action is followup
  followUpData(thirdform) {
    const superUserName = !!this.superUserData.lastname ? (this.superUserData.firstname + ' ' + this.superUserData.lastname) : this.superUserData.firstname
    let changeLog = <changeLogModel>{};
    changeLog[0] = {
      changedBy: this.superUserData.superUserId,
      changedByName: superUserName,
      changesFrom: 'Automation task',
      dateModified: new Date().getTime(),
      currentValues: '',
      previousValues: '',
    };
    let associatedBranch = 'NA';

    var type = this.firstFormGroup.value.trigger.value;

    var followupdata: any;
    var assignedTo: any = {};
    if (this.assignedToSelection.includes(thirdform.value.assignedTo)) {
      assignedTo = thirdform.value.assignedTo;
    } else


      assignedTo = {
        name: '${' + type + '.assignedToName}',
        Id: '${' + type + '.assignedTo}',
      };


    if (!!this.superUserData.associatedBranch && assignedTo.Id === this.superUserData.superUserId) {
      associatedBranch = this.superUserData.associatedBranch
    } else if (!this.superUserData.associatedBranch && assignedTo.Id === this.superUserData.superUserId) {
      associatedBranch = 'NA'
    } else {
      for (let i = 0; i < this.subUsers.length; i++) {
        if (assignedTo.Id === this.subUsers[i].userId) {
          if (this.subUsers[i].branchId) {
            associatedBranch = this.subUsers[i].branchId;
          } else {
            associatedBranch = 'NA';
          }
        }
      }
    }
    var data = {
      // newly added field starts here
      createdBy: '`' + this.superUserData.superUserId + '`',
      associatedBranch: '`' + associatedBranch + '`',
      additionalFieldsArr: this.follAddFArray,
      orgId: type + '.orgId',
      outcome: null,
      status: '`' + 'Scheduled' + '`',
      serviceId: null,
      serviceTitle: null,
      saleId: null,
      saleTitle: null,
      // newly added field ends here
      dueDateType: this.thirdFormGroup.value.dateFieldType,
      dateAfterorBefore: this.thirdFormGroup.value.afterorBefore,
      followUpDate: this.thirdFormGroup.value.followUpDate,
      assignedTo: '`' + assignedTo.Id + '`',
      assignedToName: '`' + assignedTo.name + '`',
      companyName: type + '.companyName',
      completedStatus: false,
      customerId: type + '.customerId',
      customerName:
        type +
        '.firstName' +
        '+(' +
        type +
        '.secondName?' +
        type +
        ".secondName:'')" +
        '+(' +
        type +
        '.surname?' +
        type +
        ".surname:'')",
      dateCreated: '',
      // callStartDate: this.thirdFormGroup.value.callStartDate,
      // callStartTime:
      notes: '`' + thirdform.value.notes + '`',
      changeLog
    };
    if (type == "contact" || type == "followup")
      data.dateCreated = type + ".dateCreated"
    else if (type == "sale" || type == "service")
      data.dateCreated = type + ".createdDate"

    if (type == "followup")
      data.customerName = type + ".customerName"
    if (type == "sale") {
      data["saleId"] = "sale.saleId"
      data["saleTitle"] = "sale.saleTitle"
    }
    if (type == "service") {
      data["serviceId"] = "service.serviceId"
      data["serviceTitle"] = "service.serviceTitle"
    }
    if (type == "followup") {
      data["saleId"] = "followup.saleId"
      data["saleTitle"] = "followup.saleTitle"
      data["serviceId"] = "followup.serviceId"
      data["serviceTitle"] = "followup.serviceTitle"
    }
    followupdata = {
      editTrigger: this.firstFormGroup.value.operation.value.includes("edit"),
      createTrigger: this.firstFormGroup.value.operation.value.includes("create"),
      active: true,
      name: this.zeroFormGroup.value.name,
      do: this.firstFormGroup.value.action.value,
      condition: this.conditionfullString,
      queryArray: [
        this.firstFormGroup.value.trigger.value,
        ...this.firstFormGroup.value.operation.value,
      ],
      data: data,
      form1: this.firstFormGroup.value,
      form2: this.secondFormGroup.value,
      form3: this.thirdFormGroup.value,
      alwaysorCondition: this.alwaysorCondition,
      conditionAdder: this.conditionAdder,
    };

    if (this.mode == 'create') {
      this.db.saveAutomation(this.superUserData.superUserId, followupdata);
      this.router.navigate(['/dash/automation-list']);
    }
    if (this.mode == 'edit') {
      this.db.updateAutomationDoc(this.automationId, followupdata);
      this.router.navigate(['/dash/automation-list']);
    }
  }

  // if automation action is send mail
  sendEmaildata(thirdForm) {
    var type = this.firstFormGroup.value.trigger.value;
    var data: any = {
      templateId: thirdForm.value.template.Id,
      To: '`' + thirdForm.value.To + '`',
      cc: thirdForm.value.cc,
      customerId: type + '.customerId',
    };
    var emailData = {
      editTrigger: this.firstFormGroup.value.operation.value.includes("edit"),
      createTrigger: this.firstFormGroup.value.operation.value.includes("create"),
      active: true,
      name: this.zeroFormGroup.value.name,
      do: this.firstFormGroup.value.action.value,
      condition: this.conditionfullString,
      queryArray: [
        this.firstFormGroup.value.trigger.value,
        ...this.firstFormGroup.value.operation.value,
      ],
      data: data,
      form1: this.firstFormGroup.value,
      form2: this.secondFormGroup.value,
      form3: this.thirdFormGroup.value,
      conditionAdder: this.conditionAdder,
      alwaysorCondition: this.alwaysorCondition,
    };
    if (this.mode == 'create') {
      this.db
        .saveAutomation(this.superUserData.superUserId, emailData)
        .then((data) => {
          this.router.navigate(['/dash/automation-list']);
        });
    }
    if (this.mode == 'edit') {
      this.db.updateAutomationDoc(this.automationId, emailData).then((data) => {
        this.router.navigate(['/dash/automation-list']);
      });
    }

  }

  //If automation action is to send SMS
  sendSMSdata(thirdForm) {
    var type = this.firstFormGroup.value.trigger.value;
    var data: any = {
      templateId: thirdForm.value.SMSTemplate.Id,
      To: '`' + thirdForm.value.To + '`',
      customerId: type + '.customerId',
    };
    var smsData = {
      editTrigger: this.firstFormGroup.value.operation.value.includes("edit"),
      createTrigger: this.firstFormGroup.value.operation.value.includes("create"),
      active: true,
      name: this.zeroFormGroup.value.name,
      do: this.firstFormGroup.value.action.value,
      condition: this.conditionfullString,
      queryArray: [
        this.firstFormGroup.value.trigger.value,
        ...this.firstFormGroup.value.operation.value,
      ],
      data: data,
      form1: this.firstFormGroup.value,
      form2: this.secondFormGroup.value,
      form3: this.thirdFormGroup.value,
      conditionAdder: this.conditionAdder,
      alwaysorCondition: this.alwaysorCondition,
    };
    if (this.mode == 'create') {
      this.db
        .saveAutomation(this.superUserData.superUserId, smsData)
        .then((data) => {
          this.router.navigate(['/dash/automation-list']);
        });
    }
    if (this.mode == 'edit') {
      this.db.updateAutomationDoc(this.automationId, smsData).then((data) => {
        this.router.navigate(['/dash/automation-list']);
      });
    }

  }
  // if automations action is task
  taskData(thirdform) {
    var taskData: any;
    var assignedTo: any = {};
    const superUserName = !!this.superUserData.lastname ? (this.superUserData.firstname + ' ' + this.superUserData.lastname) : this.superUserData.firstname
    let changeLog = <changeLogModel>{};
    changeLog[0] = {
      changedBy: this.superUserData.superUserId,
      changedByName: superUserName,
      changesFrom: 'Automation task',
      dateModified: new Date().getTime(),
      currentValues: '',
      previousValues: '',
    };
    let associatedBranch = 'NA';
    // let taskAddFArray = <addFieldsArr>{};
    // this.taskAddtFields.forEach((field, index)=>{
    //   taskAddFArray[index] = {
    //     fieldValue: field.,
    //   };
    // })

    var type = this.firstFormGroup.value.trigger.value;

    if (this.assignedToSelection.includes(thirdform.value.assignedTo)) {
      assignedTo = thirdform.value.assignedTo;
    } else
      assignedTo = {
        name: '${' + type + '.assignedToName}',
        Id: '${' + type + '.assignedTo}',
      };

    if (!!this.superUserData.associatedBranch && assignedTo.Id === this.superUserData.superUserId) {
      associatedBranch = this.superUserData.associatedBranch
    } else if (!this.superUserData.associatedBranch && assignedTo.Id === this.superUserData.superUserId) {
      associatedBranch = 'NA'
    } else {
      for (let i = 0; i < this.subUsers.length; i++) {
        if (assignedTo.Id === this.subUsers[i].userId) {
          if (this.subUsers[i].branchId) {
            associatedBranch = this.subUsers[i].branchId;
          } else {
            associatedBranch = 'NA';
          }
        }
      }
    }

    var data = {
      // newly added field starts here
      changeLog,
      associatedBranch: '`' + associatedBranch + '`',
      additionalFieldsArr: this.taskAddFArray,
      createdByName: '`' + superUserName + '`',
      lastModifiedDate: new Date().getTime(),
      orgId: type + '.orgId',
      surname: type + '.surname',
      // newly added field endss here
      dueDateType: this.thirdFormGroup.value.dateFieldType,
      dateAfterorBefore: this.thirdFormGroup.value.afterorBefore,
      assignedTo: '`' + assignedTo.Id + '`',
      assignedToName: '`' + assignedTo.name + '`',
      company: type + '.companyName',
      createdBy: this.superUserData.superUserId,
      customerId: type + '.customerId',
      description: '`' + thirdform.value.description + '`',
      serviceId: null,
      serviceTitle: null,
      saleOrServ: null,
      // date:"",
      dueDate: this.thirdFormGroup.value.dueDate,
      lastName: type + '.secondName',
      name: type + '.firstName',
      priority: thirdform.value.priority,
      saleId: type + '.saleId',
      saleTitle:
        type +
        (type == 'invoice' || type == 'quotation' || type == 'estimate'
          ? '.docData'
          : '') +
        '.saleTitle',
      status: this.superUserData.taskStatusOpn?this.superUserData?.taskStatusOpn[0]:this.defaultTaskStatus[0],
      title: '`' + thirdform.value.title + '`',
    };

    if (type == "service") {
      data.serviceId = "service.serviceId";
      data.serviceTitle = 'service.serviceTitle';
      data.saleOrServ = 'Service'
    }
    if (type == 'sale') {
      data.saleOrServ = 'Sale'
    }


    taskData = {
      editTrigger: this.firstFormGroup.value.operation.value.includes("edit"),
      createTrigger: this.firstFormGroup.value.operation.value.includes("create"),
      active: true,
      alwaysorCondition: this.alwaysorCondition,
      name: this.zeroFormGroup.value.name,
      do: this.firstFormGroup.value.action.value,
      condition: this.conditionfullString,
      queryArray: [
        this.firstFormGroup.value.trigger.value,
        ...this.firstFormGroup.value.operation.value,
      ],
      data: data,
      form1: this.firstFormGroup.value,
      form2: this.secondFormGroup.value,
      form3: this.thirdFormGroup.value,
      conditionAdder: this.conditionAdder,
    };
    if (this.mode == 'create') {
      this.db
        .saveAutomation(this.superUserData.superUserId, taskData)
        .then((data) => {
          this.router.navigate(['/dash/automation-list']);
        });
    }
    if (this.mode == 'edit') {
      this.db.updateAutomationDoc(this.automationId, taskData).then((data) => {
        this.router.navigate(['/dash/automation-list']);
      });
    }
  }

  //  function detects the change in notes
  fieldsToUsechange(event) {

    this.fieldToCopy = event;
  }

  //  following functions are currently not used but might need in
  //  future to import the fields into the input fields
  functionChanged(value) {

    var text = value.target.value;

    if (value.target.value) {
      var selected = document.getElementById('mySelect');

      selected.remove();
    }
    var sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      var range = sel.getRangeAt(0);
      range.insertNode(document.createTextNode(text));
    }
  }
  onKeyup(event) {

    var templateType = this.firstFormGroup.value.trigger.name;
    var select = document.createElement('SELECT');
    select.id = 'mySelect';
    select.onchange = this.functionChanged;

    if (templateType == 'Contact') {
      select.innerHTML = `
    <option value=" ">Select</option>
    <option value="[FirstName]">FirstName</option>
    <option value="[LastName]">LastName</option>
    <option value="[CompanyName]">CompanyName</option>
    `;
    } else if (templateType == 'Sale') {
      select.innerHTML = `
    <option value=" ">Select</option>
    <option value="[SaleTitle]">SaleTitle</option>
    <option value="[Customer]">Customer</option>
    <option value="[Assigned To]">Assigned To</option>
    `;
    } else if (templateType == 'Quotation') {
      select.innerHTML = `
    <option value=" ">Select</option>
    <option value="[Quotation No]">Quotation No</option>
    <option value="[Quotation Date]">Quotation Date</option>
    <option value="[Amount]">Amount</option>
    `;
    } else if (templateType == 'Invoice') {
      select.innerHTML = `
    <option value=" ">Select</option>
    <option value="[Invoice No]">Invoice No</option>
    <option value="[Invoice Date]">Invoice Date</option>
    <option value="[Amount]">Amount</option>
    `;
    } else if (templateType == 'Task') {
      select.innerHTML = `
    <option value=" ">Select</option>
    <option value="[Task Title]">Task Title</option>
    <option value="[Due Date]">Due Date</option>
    <option value="[Assigned To]">Assigned To</option>
    `;
    }

    if (event.key == '#') {
      var sel = window.getSelection();

      if (sel.getRangeAt && sel.rangeCount) {
        var range = sel.getRangeAt(0);

        range.insertNode(select);
      }
    }
  }

  // these functions are used so that during edit the values are correctly initialised
  compareFn(x: any, y: any) {
    return x && y ? x.name === y.name : x === y;
  }
  compareFn1(o1: any, o2: any) {
    if (
      o1.name == o2.name &&
      o1.value == o2.value &&
      o1.triggers == o2.triggers
    )
      return true;
    else return false;
  }
  compareFn2(o1: any, o2: any) {
    if (
      o1.body == o2.body &&
      o1.subject == o2.subject &&
      o1.templateName == o2.templateName &&
      o1.templateId == o2.templateId &&
      o1.templateType == o2.templateType
    )
      return true;
    else return false;
  }

  onCheckNetwork() {
    return (this.networkConnection = this.networkCheck.onNetworkCheck());
  }

  onBack() {
    this.location.back();
  }
  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.userDataSubscription.unsubscribe();
    this.emailTemplateSubscription.unsubscribe();
  }
}
