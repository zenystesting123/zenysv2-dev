import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/common.service';
import { RazorpaysubmerchantService } from './razorpaysubmerchant.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getCountryCodes,CountryCodeModel } from 'src/app/countryCode';

@Component({
  selector: 'app-razorpaysubmerchant',
  templateUrl: './razorpaysubmerchant.component.html',
  styleUrls: ['./razorpaysubmerchant.component.scss']
})
export class RazorpaysubmerchantComponent implements OnInit {
  countryCodes= getCountryCodes.CountryCodes
businessTypes=["proprietorship",
    "partnership",
    "private_limited",
    "public_limited",
    "llp",
    "ngo",
    "trust",
    "society",
    "not_yet_registered"]
allCountries=[
  "Australia",
  "Austria",
  "Belgium",
  "Brazil",
  "Bulgaria",
  "Canada",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Estonia",
  "Finland",
  "France",
  "Germany",
  "Greece",
  "Hong Kong",
  "Hungary",
  "India",
  "Ireland",
  "Italy",
  "Japan",
  "Latvia",
  "Lithuania",
  "Luxembourg",
  "Malaysia",
  "Malta",
  "Mexico",
  "Netherlands",
  "New Zealand",
  "Norway",
  "Poland",
  "Portugal",
  "Romania",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Spain",
  "Sweden",
  "Switzerland",
  "United Arab Emirates",
  "United Kingdom",
  "United States"
]

businessModels=["B2B","B2C","B2B+B2C"]

businessCategories=[
  "financial_services", "education", "healthcare", "utilities", "government", "logistics", "tours_and_travel", "transport", "ecommerce", "food", "it_and_software", "gaming", "media_and_entertainment", "services", "housing", "not_for_profit", "social", "others"
]
businessSubCategories={
  null:[],
  "financial_services":["mutual_fund", "lending", "cryptocurrency", "insurance", "nbfc", "cooperatives", "pension_fund", "forex", "securities", "commodities", "accounting", "financial_advisor", "crowdfunding", "trading", "betting", "get_rich_schemes", "moneysend_funding",
  "wire_transfers_and_money_orders", "tax_preparation_services",
  "tax_payments", "digital_goods", "atms"], 
  "education":["college", "schools", "university", "professional_courses", "distance_learning", "day_care", "coaching", "elearning", "vocational_and_trade_schools", "sporting_clubs", "dance_halls_studios_and_schools", "correspondence_schools"],
  "healthcare":["pharmacy",
  "clinic",
  "hospital",
  "lab",
  "dietician",
  "fitness",
  "health_coaching",
  "health_products",
  "drug_stores",
  "healthcare_marketplace",
  "osteopaths",
  "medical_equipment_and_supply_stores",
  "podiatrists_and_chiropodists",
  "dentists_and_orthodontists",
  "hardware_stores",
  "ophthalmologists",
  "orthopedic_goods_stores",
  "testing_laboratories",
  "doctors",
  "health_practitioners_medical_services",
  "testing_laboratories"],
  "utilities":["electricity",
  "gas",
  "telecom",
  "water",
  "cable",
  "broadband",
  "dth",
  "internet_provider",
  "bill_and_recharge_aggregators"],
  "government":["central",
  "state",
  "intra_government_purchases",
  "goverment_postal_services",
  ],
  "logistics":["freight", "courier", "warehousing", "distribution", "end_to_end_logistics", "courier_services"],
  "tours_and_travel":["aviation",
  "accommodation",
  "ota",
  "travel_agency",
  "tourist_attractions_and_exhibits",
  "timeshares",
  "aquariums_dolphinariums_and_seaquariums"],
  "transport":["cab_hailing",
  "bus",
  "train_and_metro",
  "automobile_rentals",
  "cruise_lines",
  "parking_lots_and_garages",
  "transportation",
  "bridge_and_road_tolls",
  "freight_transport",
  "truck_and_utility_trailer_rentals"],
  "ecommerce":["ecommerce_marketplace",
  "agriculture",
  "books",
  "electronics_and_furniture",
  "coupons",
  "rental",
  "fashion_and_lifestyle",
  "gifting",
  "grocery",
  "baby_products",
  "office_supplies",
  "wholesale",
  "religious_products",
  "pet_products",
  "sports_products",
  "arts_and_collectibles",
  "sexual_wellness_products",
  "drop_shipping",
  "crypto_machinery",
  "tobacco",
  "weapons_and_ammunitions",
  "stamps_and_coins_stores",
  "office_equipment",
  "automobile_parts_and_equipements",
  "garden_supply_stores",
  "household_appliance_stores",
  "non_durable_goods",
  "pawn_shops",
  "electrical_parts_and_equipment",
  "wig_and_toupee_shops",
  "gift_novelty_and_souvenir_shops",
  "duty_free_stores",
  "office_and_commercial_furniture",
  "dry_goods",
  "books_and_publications",
  "camera_and_photographic_stores",
  "record_shops",
  "meat_supply_stores",
  "leather_goods_and_luggage",
  "snowmobile_dealers",
  "men_and_boys_clothing_stores",
  "paint_supply_stores",
  "automotive_parts",
  "jewellery_and_watch_stores",
  "auto_store_home_supply_stores",
  "tent_stores",
  "shoe_stores_retail",
  "petroleum_and_petroleum_products",
  "department_stores",
  "automotive_tire_stores",
  "sport_apparel_stores",
  "variety_stores",
  "chemicals_and_allied_products",
  "commercial_equipments",
  "fireplace_parts_and_accessories",
  "family_clothing_stores",
  "fabric_and_sewing_stores",
  "home_supply_warehouse",
  "art_supply_stores",
  "camper_recreational_and_utility_trailer_dealers",
  "clocks_and_silverware_stores",
  "discount_stores",
  "school_supplies_and_stationery",
  "second_hand_stores",
  "watch_and_jewellery_repair_stores",
  "liquor_stores",
  "boat_dealers",
  "opticians_optical_goods_and_eyeglasse_stores",
  "wholesale_footwear_stores",
  "cosmetic_stores",
  "home_furnishing_stores",
  "antique_stores",
  "plumbing_and_heating_equipment",
  "telecommunication_equipment_stores",
  "women_clothing",
  "florists",
  "computer_software_stores",
  "building_matrial_stores",
  "candy_nut_confectionery_shops",
  "glass_and_wallpaper_stores",
  "commercial_photography_and_graphic_design_services",
  "video_game_supply_stores",
  "fuel_dealers",
  "drapery_and_window_coverings_stores",
  "hearing_aids_stores",
  "automotive_paint_shops",
  "durable_goods_stores",
  "uniforms_and_commercial_clothing_stores",
  "fur_shops",
  "industrial_supplies",
  "bicycle_stores",
  "second_hand_stores",
  ],
  "food":["online_food_ordering",
  "restaurant",
  "food_court",
  "catering",
  "alcohol",
  "restaurant_search_and_booking",
  "dairy_products",
  "bakeries"],
  "it_and_software":["saas",
   "paas",
    "iaas",
     "consulting_and_outsourcing",
      "web_development",
       "technical_support",
        "data_processing"],
  "gaming":["game_developer",
  "esports",
  "online_casino",
  "fantasy_sports",
  "gaming_marketplace"],
  "media_and_entertainment":["video_on_demand",
  "music_streaming",
  "multiplex",
  "content_and_publishing",
  "ticketing",
  "news",
  "video_game_arcades",
  "video_tape_production_and_distribution",
  "bowling_alleys",
  "billiard_and_pool_establishments",
  "amusement_parks_and_circuses",
  "ticket_agencies"],
  "services":["repair_and_cleaning",
  "interior_design_and_architect",
  "movers_and_packers",
  "legal",
  "event_planning",
  "service_centre",
  "consulting",
  "ad_and_marketing",
  "services_classifieds",
  "multi_level_marketing",
  "construction_services",
  "architectural_services",
  "car_washes",
  "motor_home_rentals",
  "stenographic_and_secretarial_support_services",
  "chiropractors",
  "automotive_service_shops",
  "shoe_repair_shops",
  "telecommunication_service",
  "fines",
  "security_agencies",
  "tailors",
  "type_setting_and_engraving_services",
  "small_appliance_repair_shops",
  "photography_labs",
  "dry_cleaners",
  "massage_parlors",
  "electronic_repair_shops",
  "cleaning_and_sanitation_services",
  "nursing_care_facilities",
  "direct_marketing",
  "lottery",
  "veterinary_services",
  "affliated_auto_rental",
  "alimony_and_child_support",
  "airport_flying_fields",
  "golf_courses",
  "tire_retreading_and_repair_shops",
  "television_cable_services",
  "recreational_and_sporting_camps",
  "barber_and_beauty_shops",
  "agricultural_cooperatives",
  "carpentry_contractors",
  "wrecking_and_salvaging_services",
  "automobile_towing_services",
  "video_tape_rental_stores",
  "miscellaneous_repair_shops",
  "motor_homes_and_parts",
  "horse_or_dog_racing",
  "laundry_services",
  "electrical_contractors",
  "debt_marriage_personal_counseling_service",
  "air_conditioning_and_refrigeration_repair_shops",
  "credit_reporting_agencies",
  "heating_and_plumbing_contractors",
  "carpet_and_upholstery_cleaning_services",
  "swimming_pools",
  "roofing_and_metal_work_contractors",
  "internet_service_providers",
  "recreational_camps",
  "masonry_contractors",
  ],
  "housing":["developer", "facility_management", "rwa", "coworking", "realestate_classifieds", "space_rental",],
  "not_for_profit":["charity", "educational", "religious", "personal"],
  "social":["matchmaking",
  "social_network",
  "messaging",
  "professional_network",
  "neighbourhood_network",
  "political_organizations",
  "automobile_associations_and_clubs",
  "country_and_athletic_clubs",
  "associations_and_membership",
  ],
  "others":[]
}
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  superUserId:any
  stripeFormGroup: FormGroup;
  rzrAccountId:string
  stripeAccountId:string
  payLinkMode:string
  rzrwebhookEnable:Boolean=false
  firstName: string;
  secondName: string;
  razorpayPartner:string;
  stripeConnect:string;
  radioselected:string;
  loader:boolean=false
  filteredCountries: Array<CountryCodeModel>;
// businessSubCategories=[
//   "FINANCIAL_SERVICES","EDUCATION","HEALTHCARE","ECOMMERCE","SERVICES","HOUSING","NOT_FOR_PROFIT","SOCIAL","MEDIA_AND_ENTERTAINMENT","GAMING","IT_AND_SOFTWARE","FOOD","UTILITIES","GOVERNMENT","LOGISTICS","TOURS_AND_TRAVEL","TRANSPORT"
// ]
  
  constructor(
    private _formBuilder: FormBuilder,
    private serv:RazorpaysubmerchantService,
    private common:CommonService,
    private _snackBar: MatSnackBar,

  ) {
    this.filteredCountries=this.countryCodes.filter((el)=>this.allCountries.includes(el.name))
    // console.log(this.filteredCountries)
    this.firstFormGroup = this._formBuilder.group({
email: ['', [Validators.email,Validators.required]],
phNumber: ['', Validators.required],
legalBusinessName: ['', Validators.required],
customerFacingName: [''],
})

this.secondFormGroup = this._formBuilder.group({
businessType: ['', Validators.required],
businessCategory: [null, Validators.required],
businessSubCategory: ['', Validators.required],
description: ['',Validators.required],
businessModel: [''],
  });

this.thirdFormGroup = this._formBuilder.group({
address1: ['', Validators.required],
address2: [null, Validators.required],
city: ['', Validators.required],
state: ['',Validators.required],
postalCode: ['',Validators.required],
country: ['',Validators.required],

  });
this.stripeFormGroup=this._formBuilder.group({
email:['', [Validators.required,Validators.email]],
country:['',Validators.required]
})


this.common.userDatas.subscribe((data)=>{
  this.superUserId=data.superUserDetails.superUserId
  this.firstName=data.superUserDetails.firstname
  this.secondName=data.superUserDetails.lastname?data.superUserDetails.lastname:""
  // console.log(data)
  this.rzrAccountId=data.superUserDetails.rzrAccountId
  this.stripeAccountId=data.superUserDetails.stripeAccountId
  this.payLinkMode=data.superUserDetails.payLinkMode
  this.razorpayPartner=data.superUserDetails?.razorpayPartner
  this.stripeConnect=data.superUserDetails?.stripeConnect
  if(this.razorpayPartner=="active")
  this.rzrwebhookEnable=!!data.superUserDetails.rzrPartnerAccountDetails.webhookId
  if(this.payLinkMode=="StripeInitiated"||this.payLinkMode=="StripeConnect")
  this.radioselected="StripeConnect"
  else if(this.payLinkMode=="RazorpayPartner")
  this.radioselected="RazorpayPartner"

})
   }

  ngOnInit(): void {
  }
  //create submerchant for razorpay
submit(){
  this.loader=true
  const data={email:this.firstFormGroup.value.email,
    phNumber:this.firstFormGroup.value.phNumber,
    legalBusinessName:this.firstFormGroup.value.legalBusinessName,
businessType:this.secondFormGroup.value.businessType,
customerFacingName:this.firstFormGroup.value.customerFacingName,
businessCategory:this.secondFormGroup.value.businessCategory,
businessSubCategory:this.secondFormGroup.value.businessSubCategory,
description:this.secondFormGroup.value.description,
address1:this.thirdFormGroup.value.address1,
address2:this.thirdFormGroup.value.address2,
city:this.thirdFormGroup.value.city,
state:this.thirdFormGroup.value.state,
postalCode:this.thirdFormGroup.value.postalCode,
country:this.thirdFormGroup.value.country,
businessModel:this.secondFormGroup.value.businessModel
  }
  // console.log(data)
  this.serv.createSub(data).subscribe((data:any)=>{
    // console.log("test")
    // console.log(data.account)
  this.loader=false
    if(!!!data.account){
      // console.log("Im here")
      this._snackBar.open('There was an issue creating your Sub Merchant Account. Check if all the data you entered is valid. Try after sometime. Contact our customer care if issue persists', '', {
        duration: 4000,
      });
    }
    if(data?.account.id){
      this.serv.updateSuperUser(this.superUserId,{rzrAccountId:data.account.id,payLinkMode:"RazorpayPartner",razorpayPartner:"active",rzrPartnerAccountDetails:{provider:"RazorpayPartner",status:data.account.status,LinkedMail:data.account.email,webhookId:data.webhook?.id}}).then(()=>{
        // console.log("Superuser saved")
      })
    }
    
  },(error)=>{
  this.loader=false
    // console.log("Its an error")
    this._snackBar.open('There was an issue creating your Sub Merchant Account. Try after sometime. Contact our customer care if issue persists', '', {
      duration: 4000,
    });
  })
}
//create partner for stripe
submitStripe(){
  this.loader=true
  // console.log(this.stripeFormGroup.value.country)
  const data={
    email:this.stripeFormGroup.value.email,
    country:this.stripeFormGroup.value.country
  }
  this.serv.createStripe(data).subscribe((data:any)=>{
    // console.log(data)
  this.loader=false
  if(!!!data.accountId){
    this._snackBar.open('There was an issue creating your Partner Account. Check if all the data you entered is valid. Try after sometime. Contact our customer care if issue persists', '', {
      duration: 4000,
    });
  }
    if(data.accountId){
      this.serv.updateSuperUser(this.superUserId,{stripeAccountId:data.accountId,payLinkMode:"StripeInitiated",stripeConnect:"initiated",stripeConnectAccountDetails:{provider:"StripeConnect",linkCreation:data.created,linkExipry:data.expires_at,url:data.url}})
      this.serv.sendEmail({
        to: this.stripeFormGroup.value.email,
        template: {
          name: 'stripeCreateLink',
          data: {
            userName: this.firstName+" "+this.secondName, 
            createLink: data.url,
          },
        },
      });
    }
    // console.log(data)
  })
}
retrieveStripe(){
  this.loader=true
  this.serv.retrieveStripe({stripeAccountId:this.stripeAccountId}).subscribe((data:any)=>{
    // console.log(data)
    this.loader=false
    if(data.id){
      if(this.payLinkMode=="StripeInitiated" && data.capabilities.card_payments=="active"){
        this.serv.updateSuperUser(this.superUserId,{payLinkMode:"StripeConnect",stripeConnect:"active"})
      }  
      else 
      this._snackBar.open('Complete your stripe onboarding', '', {
        duration: 2000,
      });
    }
  })
}
switchMethod(method){
  this.serv.updateSuperUser(this.superUserId,{payLinkMode:method})
}
}
