
import { SearchService } from './search.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { publicProfile } from '../data-models';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { BreakpointObserver ,Breakpoints} from '@angular/cdk/layout';
import { ThisReceiver } from '@angular/compiler';
import { MatDialog } from '@angular/material/dialog';
import { FullLayoutService } from '../full-layout/full-layout.service';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  location = [
    {
      state: 'Andhra Pradesh',
      districts: [
        'Anantapur',
        'Chittoor',
        'East Godavari',
        'Guntur',
        'Krishna',
        'Kurnool',
        'Nellore',
        'Prakasam',
        'Srikakulam',
        'Visakhapatnam',
        'Vizianagaram',
        'West Godavari',
        'YSR Kadapa',
      ],
    },
    {
      state: 'Arunachal Pradesh',
      districts: [
        'Tawang',
        'West Kameng',
        'East Kameng',
        'Papum Pare',
        'Kurung Kumey',
        'Kra Daadi',
        'Lower Subansiri',
        'Upper Subansiri',
        'West Siang',
        'East Siang',
        'Siang',
        'Upper Siang',
        'Lower Siang',
        'Lower Dibang Valley',
        'Dibang Valley',
        'Anjaw',
        'Lohit',
        'Namsai',
        'Changlang',
        'Tirap',
        'Longding',
      ],
    },
    {
      state: 'Assam',
      districts: [
        'Baksa',
        'Barpeta',
        'Biswanath',
        'Bongaigaon',
        'Cachar',
        'Charaideo',
        'Chirang',
        'Darrang',
        'Dhemaji',
        'Dhubri',
        'Dibrugarh',
        'Goalpara',
        'Golaghat',
        'Hailakandi',
        'Hojai',
        'Jorhat',
        'Kamrup Metropolitan',
        'Kamrup',
        'Karbi Anglong',
        'Karimganj',
        'Kokrajhar',
        'Lakhimpur',
        'Majuli',
        'Morigaon',
        'Nagaon',
        'Nalbari',
        'Dima Hasao',
        'Sivasagar',
        'Sonitpur',
        'South Salmara-Mankachar',
        'Tinsukia',
        'Udalguri',
        'West Karbi Anglong',
      ],
    },
    {
      state: 'Bihar',
      districts: [
        'Araria',
        'Arwal',
        'Aurangabad',
        'Banka',
        'Begusarai',
        'Bhagalpur',
        'Bhojpur',
        'Buxar',
        'Darbhanga',
        'East Champaran (Motihari)',
        'Gaya',
        'Gopalganj',
        'Jamui',
        'Jehanabad',
        'Kaimur (Bhabua)',
        'Katihar',
        'Khagaria',
        'Kishanganj',
        'Lakhisarai',
        'Madhepura',
        'Madhubani',
        'Munger (Monghyr)',
        'Muzaffarpur',
        'Nalanda',
        'Nawada',
        'Patna',
        'Purnia (Purnea)',
        'Rohtas',
        'Saharsa',
        'Samastipur',
        'Saran',
        'Sheikhpura',
        'Sheohar',
        'Sitamarhi',
        'Siwan',
        'Supaul',
        'Vaishali',
        'West Champaran',
      ],
    },
    {
      state: 'Chandigarh (UT)',
      districts: ['Chandigarh'],
    },
    {
      state: 'Chhattisgarh',
      districts: [
        'Balod',
        'Baloda Bazar',
        'Balrampur',
        'Bastar',
        'Bemetara',
        'Bijapur',
        'Bilaspur',
        'Dantewada (South Bastar)',
        'Dhamtari',
        'Durg',
        'Gariyaband',
        'Janjgir-Champa',
        'Jashpur',
        'Kabirdham (Kawardha)',
        'Kanker (North Bastar)',
        'Kondagaon',
        'Korba',
        'Korea (Koriya)',
        'Mahasamund',
        'Mungeli',
        'Narayanpur',
        'Raigarh',
        'Raipur',
        'Rajnandgaon',
        'Sukma',
        'Surajpur  ',
        'Surguja',
      ],
    },
    {
      state: 'Dadra and Nagar Haveli (UT)',
      districts: ['Dadra & Nagar Haveli'],
    },
    {
      state: 'Daman and Diu (UT)',
      districts: ['Daman', 'Diu'],
    },
    {
      state: 'Delhi (NCT)',
      districts: [
        'Central Delhi',
        'East Delhi',
        'New Delhi',
        'North Delhi',
        'North East  Delhi',
        'North West  Delhi',
        'Shahdara',
        'South Delhi',
        'South East Delhi',
        'South West  Delhi',
        'West Delhi',
      ],
    },
    {
      state: 'Goa',
      districts: ['North Goa', 'South Goa'],
    },
    {
      state: 'Gujarat',
      districts: [
        'Ahmedabad',
        'Amreli',
        'Anand',
        'Aravalli',
        'Banaskantha (Palanpur)',
        'Bharuch',
        'Bhavnagar',
        'Botad',
        'Chhota Udepur',
        'Dahod',
        'Dangs (Ahwa)',
        'Devbhoomi Dwarka',
        'Gandhinagar',
        'Gir Somnath',
        'Jamnagar',
        'Junagadh',
        'Kachchh',
        'Kheda (Nadiad)',
        'Mahisagar',
        'Mehsana',
        'Morbi',
        'Narmada (Rajpipla)',
        'Navsari',
        'Panchmahal (Godhra)',
        'Patan',
        'Porbandar',
        'Rajkot',
        'Sabarkantha (Himmatnagar)',
        'Surat',
        'Surendranagar',
        'Tapi (Vyara)',
        'Vadodara',
        'Valsad',
      ],
    },
    {
      state: 'Haryana',
      districts: [
        'Ambala',
        'Bhiwani',
        'Charkhi Dadri',
        'Faridabad',
        'Fatehabad',
        'Gurgaon',
        'Hisar',
        'Jhajjar',
        'Jind',
        'Kaithal',
        'Karnal',
        'Kurukshetra',
        'Mahendragarh',
        'Mewat',
        'Palwal',
        'Panchkula',
        'Panipat',
        'Rewari',
        'Rohtak',
        'Sirsa',
        'Sonipat',
        'Yamunanagar',
      ],
    },
    {
      state: 'Himachal Pradesh',
      districts: [
        'Bilaspur',
        'Chamba',
        'Hamirpur',
        'Kangra',
        'Kinnaur',
        'Kullu',
        'Lahaul &amp; Spiti',
        'Mandi',
        'Shimla',
        'Sirmaur (Sirmour)',
        'Solan',
        'Una',
      ],
    },
    {
      state: 'Jammu and Kashmir',
      districts: [
        'Anantnag',
        'Bandipore',
        'Baramulla',
        'Budgam',
        'Doda',
        'Ganderbal',
        'Jammu',
        'Kargil',
        'Kathua',
        'Kishtwar',
        'Kulgam',
        'Kupwara',
        'Leh',
        'Poonch',
        'Pulwama',
        'Rajouri',
        'Ramban',
        'Reasi',
        'Samba',
        'Shopian',
        'Srinagar',
        'Udhampur',
      ],
    },
    {
      state: 'Jharkhand',
      districts: [
        'Bokaro',
        'Chatra',
        'Deoghar',
        'Dhanbad',
        'Dumka',
        'East Singhbhum',
        'Garhwa',
        'Giridih',
        'Godda',
        'Gumla',
        'Hazaribag',
        'Jamtara',
        'Khunti',
        'Koderma',
        'Latehar',
        'Lohardaga',
        'Pakur',
        'Palamu',
        'Ramgarh',
        'Ranchi',
        'Sahibganj',
        'Seraikela-Kharsawan',
        'Simdega',
        'West Singhbhum',
      ],
    },
    {
      state: 'Karnataka',
      districts: [
        'Bagalkot',
        'Ballari (Bellary)',
        'Belagavi (Belgaum)',
        'Bengaluru (Bangalore) Rural',
        'Bengaluru (Bangalore) Urban',
        'Bidar',
        'Chamarajanagar',
        'Chikballapur',
        'Chikkamagaluru (Chikmagalur)',
        'Chitradurga',
        'Dakshina Kannada',
        'Davangere',
        'Dharwad',
        'Gadag',
        'Hassan',
        'Haveri',
        'Kalaburagi (Gulbarga)',
        'Kodagu',
        'Kolar',
        'Koppal',
        'Mandya',
        'Mysuru (Mysore)',
        'Raichur',
        'Ramanagara',
        'Shivamogga (Shimoga)',
        'Tumakuru (Tumkur)',
        'Udupi',
        'Uttara Kannada (Karwar)',
        'Vijayapura (Bijapur)',
        'Yadgir',
      ],
    },
    {
      state: 'Kerala',
      districts: [
        'Alappuzha',
        'Ernakulam',
        'Idukki',
        'Kannur',
        'Kasaragod',
        'Kollam',
        'Kottayam',
        'Kozhikode',
        'Malappuram',
        'Palakkad',
        'Pathanamthitta',
        'Thiruvananthapuram',
        'Thrissur',
        'Wayanad',
      ],
    },
    {
      state: 'Lakshadweep (UT)',
      districts: [
        'Agatti',
        'Amini',
        'Androth',
        'Bithra',
        'Chethlath',
        'Kavaratti',
        'Kadmath',
        'Kalpeni',
        'Kilthan',
        'Minicoy',
      ],
    },
    {
      state: 'Madhya Pradesh',
      districts: [
        'Agar Malwa',
        'Alirajpur',
        'Anuppur',
        'Ashoknagar',
        'Balaghat',
        'Barwani',
        'Betul',
        'Bhind',
        'Bhopal',
        'Burhanpur',
        'Chhatarpur',
        'Chhindwara',
        'Damoh',
        'Datia',
        'Dewas',
        'Dhar',
        'Dindori',
        'Guna',
        'Gwalior',
        'Harda',
        'Hoshangabad',
        'Indore',
        'Jabalpur',
        'Jhabua',
        'Katni',
        'Khandwa',
        'Khargone',
        'Mandla',
        'Mandsaur',
        'Morena',
        'Narsinghpur',
        'Neemuch',
        'Panna',
        'Raisen',
        'Rajgarh',
        'Ratlam',
        'Rewa',
        'Sagar',
        'Satna',
        'Sehore',
        'Seoni',
        'Shahdol',
        'Shajapur',
        'Sheopur',
        'Shivpuri',
        'Sidhi',
        'Singrauli',
        'Tikamgarh',
        'Ujjain',
        'Umaria',
        'Vidisha',
      ],
    },
    {
      state: 'Maharashtra',
      districts: [
        'Ahmednagar',
        'Akola',
        'Amravati',
        'Aurangabad',
        'Beed',
        'Bhandara',
        'Buldhana',
        'Chandrapur',
        'Dhule',
        'Gadchiroli',
        'Gondia',
        'Hingoli',
        'Jalgaon',
        'Jalna',
        'Kolhapur',
        'Latur',
        'Mumbai City',
        'Mumbai Suburban',
        'Nagpur',
        'Nanded',
        'Nandurbar',
        'Nashik',
        'Osmanabad',
        'Palghar',
        'Parbhani',
        'Pune',
        'Raigad',
        'Ratnagiri',
        'Sangli',
        'Satara',
        'Sindhudurg',
        'Solapur',
        'Thane',
        'Wardha',
        'Washim',
        'Yavatmal',
      ],
    },
    {
      state: 'Manipur',
      districts: [
        'Bishnupur',
        'Chandel',
        'Churachandpur',
        'Imphal East',
        'Imphal West',
        'Jiribam',
        'Kakching',
        'Kamjong',
        'Kangpokpi',
        'Noney',
        'Pherzawl',
        'Senapati',
        'Tamenglong',
        'Tengnoupal',
        'Thoubal',
        'Ukhrul',
      ],
    },
    {
      state: 'Meghalaya',
      districts: [
        'East Garo Hills',
        'East Jaintia Hills',
        'East Khasi Hills',
        'North Garo Hills',
        'Ri Bhoi',
        'South Garo Hills',
        'South West Garo Hills ',
        'South West Khasi Hills',
        'West Garo Hills',
        'West Jaintia Hills',
        'West Khasi Hills',
      ],
    },
    {
      state: 'Mizoram',
      districts: [
        'Aizawl',
        'Champhai',
        'Kolasib',
        'Lawngtlai',
        'Lunglei',
        'Mamit',
        'Saiha',
        'Serchhip',
      ],
    },
    {
      state: 'Nagaland',
      districts: [
        'Dimapur',
        'Kiphire',
        'Kohima',
        'Longleng',
        'Mokokchung',
        'Mon',
        'Peren',
        'Phek',
        'Tuensang',
        'Wokha',
        'Zunheboto',
      ],
    },
    {
      state: 'Odisha',
      districts: [
        'Angul',
        'Balangir',
        'Balasore',
        'Bargarh',
        'Bhadrak',
        'Boudh',
        'Cuttack',
        'Deogarh',
        'Dhenkanal',
        'Gajapati',
        'Ganjam',
        'Jagatsinghapur',
        'Jajpur',
        'Jharsuguda',
        'Kalahandi',
        'Kandhamal',
        'Kendrapara',
        'Kendujhar (Keonjhar)',
        'Khordha',
        'Koraput',
        'Malkangiri',
        'Mayurbhanj',
        'Nabarangpur',
        'Nayagarh',
        'Nuapada',
        'Puri',
        'Rayagada',
        'Sambalpur',
        'Sonepur',
        'Sundargarh',
      ],
    },
    {
      state: 'Puducherry (UT)',
      districts: ['Karaikal', 'Mahe', 'Pondicherry', 'Yanam'],
    },
    {
      state: 'Punjab',
      districts: [
        'Amritsar',
        'Barnala',
        'Bathinda',
        'Faridkot',
        'Fatehgarh Sahib',
        'Fazilka',
        'Ferozepur',
        'Gurdaspur',
        'Hoshiarpur',
        'Jalandhar',
        'Kapurthala',
        'Ludhiana',
        'Mansa',
        'Moga',
        'Muktsar',
        'Nawanshahr (Shahid Bhagat Singh Nagar)',
        'Pathankot',
        'Patiala',
        'Rupnagar',
        'Sahibzada Ajit Singh Nagar (Mohali)',
        'Sangrur',
        'Tarn Taran',
      ],
    },
    {
      state: 'Rajasthan',
      districts: [
        'Ajmer',
        'Alwar',
        'Banswara',
        'Baran',
        'Barmer',
        'Bharatpur',
        'Bhilwara',
        'Bikaner',
        'Bundi',
        'Chittorgarh',
        'Churu',
        'Dausa',
        'Dholpur',
        'Dungarpur',
        'Hanumangarh',
        'Jaipur',
        'Jaisalmer',
        'Jalore',
        'Jhalawar',
        'Jhunjhunu',
        'Jodhpur',
        'Karauli',
        'Kota',
        'Nagaur',
        'Pali',
        'Pratapgarh',
        'Rajsamand',
        'Sawai Madhopur',
        'Sikar',
        'Sirohi',
        'Sri Ganganagar',
        'Tonk',
        'Udaipur',
      ],
    },
    {
      state: 'Sikkim',
      districts: ['East Sikkim', 'North Sikkim', 'South Sikkim', 'West Sikkim'],
    },
    {
      state: 'Tamil Nadu',
      districts: [
        'Ariyalur',
        'Chennai',
        'Coimbatore',
        'Cuddalore',
        'Dharmapuri',
        'Dindigul',
        'Erode',
        'Kanchipuram',
        'Kanyakumari',
        'Karur',
        'Krishnagiri',
        'Madurai',
        'Nagapattinam',
        'Namakkal',
        'Nilgiris',
        'Perambalur',
        'Pudukkottai',
        'Ramanathapuram',
        'Salem',
        'Sivaganga',
        'Thanjavur',
        'Theni',
        'Thoothukudi (Tuticorin)',
        'Tiruchirappalli',
        'Tirunelveli',
        'Tiruppur',
        'Tiruvallur',
        'Tiruvannamalai',
        'Tiruvarur',
        'Vellore',
        'Viluppuram',
        'Virudhunagar',
      ],
    },
    {
      state: 'Telangana',
      districts: [
        'Adilabad',
        'Bhadradri Kothagudem',
        'Hyderabad',
        'Jagtial',
        'Jangaon',
        'Jayashankar Bhoopalpally',
        'Jogulamba Gadwal',
        'Kamareddy',
        'Karimnagar',
        'Khammam',
        'Komaram Bheem Asifabad',
        'Mahabubabad',
        'Mahabubnagar',
        'Mancherial',
        'Medak',
        'Medchal',
        'Nagarkurnool',
        'Nalgonda',
        'Nirmal',
        'Nizamabad',
        'Peddapalli',
        'Rajanna Sircilla',
        'Rangareddy',
        'Sangareddy',
        'Siddipet',
        'Suryapet',
        'Vikarabad',
        'Wanaparthy',
        'Warangal (Rural)',
        'Warangal (Urban)',
        'Yadadri Bhuvanagiri',
      ],
    },
    {
      state: 'Tripura',
      districts: [
        'Dhalai',
        'Gomati',
        'Khowai',
        'North Tripura',
        'Sepahijala',
        'South Tripura',
        'Unakoti',
        'West Tripura',
      ],
    },
    {
      state: 'Uttarakhand',
      districts: [
        'Almora',
        'Bageshwar',
        'Chamoli',
        'Champawat',
        'Dehradun',
        'Haridwar',
        'Nainital',
        'Pauri Garhwal',
        'Pithoragarh',
        'Rudraprayag',
        'Tehri Garhwal',
        'Udham Singh Nagar',
        'Uttarkashi',
      ],
    },
    {
      state: 'Uttar Pradesh',
      districts: [
        'Agra',
        'Aligarh',
        'Allahabad',
        'Ambedkar Nagar',
        'Amethi (Chatrapati Sahuji Mahraj Nagar)',
        'Amroha (J.P. Nagar)',
        'Auraiya',
        'Azamgarh',
        'Baghpat',
        'Bahraich',
        'Ballia',
        'Balrampur',
        'Banda',
        'Barabanki',
        'Bareilly',
        'Basti',
        'Bhadohi',
        'Bijnor',
        'Budaun',
        'Bulandshahr',
        'Chandauli',
        'Chitrakoot',
        'Deoria',
        'Etah',
        'Etawah',
        'Faizabad',
        'Farrukhabad',
        'Fatehpur',
        'Firozabad',
        'Gautam Buddha Nagar',
        'Ghaziabad',
        'Ghazipur',
        'Gonda',
        'Gorakhpur',
        'Hamirpur',
        'Hapur (Panchsheel Nagar)',
        'Hardoi',
        'Hathras',
        'Jalaun',
        'Jaunpur',
        'Jhansi',
        'Kannauj',
        'Kanpur Dehat',
        'Kanpur Nagar',
        'Kanshiram Nagar (Kasganj)',
        'Kaushambi',
        'Kushinagar (Padrauna)',
        'Lakhimpur - Kheri',
        'Lalitpur',
        'Lucknow',
        'Maharajganj',
        'Mahoba',
        'Mainpuri',
        'Mathura',
        'Mau',
        'Meerut',
        'Mirzapur',
        'Moradabad',
        'Muzaffarnagar',
        'Pilibhit',
        'Pratapgarh',
        'RaeBareli',
        'Rampur',
        'Saharanpur',
        'Sambhal (Bhim Nagar)',
        'Sant Kabir Nagar',
        'Shahjahanpur',
        'Shamali (Prabuddh Nagar)',
        'Shravasti',
        'Siddharth Nagar',
        'Sitapur',
        'Sonbhadra',
        'Sultanpur',
        'Unnao',
        'Varanasi',
      ],
    },
    {
      state: 'West Bengal',
      districts: [
        'Alipurduar',
        'Bankura',
        'Birbhum',
        'Burdwan (Bardhaman)',
        'Cooch Behar',
        'Dakshin Dinajpur (South Dinajpur)',
        'Darjeeling',
        'Hooghly',
        'Howrah',
        'Jalpaiguri',
        'Kalimpong',
        'Kolkata',
        'Malda',
        'Murshidabad',
        'Nadia',
        'North 24 Parganas',
        'Paschim Medinipur (West Medinipur)',
        'Purba Medinipur (East Medinipur)',
        'Purulia',
        'South 24 Parganas',
        'Uttar Dinajpur (North Dinajpur)',
      ],
    },
  ];
  publicProfile: publicProfile[];
  filteredProfile: publicProfile[];
  loadProfile:publicProfile[];
  testProfile: publicProfile[];
  progressBarStatus: boolean = false;
  dist: boolean = false;
  profileDistrict: string = null;
  profileState: string = null;
  districted: any;
  districts: any = [];
  formattedAddress:any;
  locationId:any;
  fullAddress:any;
  profileCountry: string;
  profileLocality:any;
  profileStreet:any;
  category: string = null;
  categoryList:string[]=[];
  isTabletsize: Boolean = false;
  isMobilesize: Boolean = false;
  isLocatonClicked:boolean=false;
  mobToolbar:Boolean=false;
  mobMarginTop=112;
  hubSpotChat:any;
  routeFilterApplied:boolean=false;
  routeCategory:any;
  routeLocType:any;
  routeLocation:any;
  pageTitle : string ='Find top service providers near you with Zenys';
  constructor(
    private db1: SearchService,
    private ref: ChangeDetectorRef,
    private router: Router,
    public dialog: MatDialog,
    private locations: Location,
    private route: ActivatedRoute,  
    private breakpointObserver: BreakpointObserver,public razorserv:FullLayoutService,
    private titleService: Title,private meta: Meta,
  ) {

    breakpointObserver
    .observe([Breakpoints.TabletLandscape, Breakpoints.TabletPortrait])
    .subscribe((result) => {
      if (result.matches) {
        this.isTabletsize = true;
      } else {
        this.isTabletsize = false;
      }
    });
  breakpointObserver
    .observe([Breakpoints.HandsetLandscape, Breakpoints.HandsetPortrait])
    .subscribe((result) => {
      if (result.matches) {
        this.isMobilesize = true;
      } else {
        this.isMobilesize = false;
      }
    });

    this.routeCategory = this.route.snapshot.paramMap.get('category');
    this.routeLocType = this.route.snapshot.paramMap.get('locType');
    this.routeLocation = this.route.snapshot.paramMap.get('location');
    // console.log("Categ",this.routeCategory,"locType",this.routeLocType,"locat",this.routeLocation)


    //Set the page title dynamically
    switch(this.routeCategory) { 
      case 'Interior Designer': { 
        this.pageTitle = "Top interior designers in " + this.routeLocation ;
         break; 
      } 
      case 'Architect': { 
        this.pageTitle = "Top architects and construction services in " + this.routeLocation ;
         break; 
      } 
      case 'Photography': { 
        this.pageTitle = "Top photographers in " + this.routeLocation ;
         break; 
      } 
      case 'Accounting': { 
        this.pageTitle = "Top accounting professionals in " + this.routeLocation ;
         break; 
      } 
      case 'Legal': { 
        this.pageTitle = "Top lawyers and legal prosessionals in " + this.routeLocation ;
         break; 
      } 
      default: { 
         //statements; 
         break; 
      } 
   }
    if (this.routeCategory)
    this.titleService.setTitle( this.pageTitle );
    this.meta.updateTag({ name: 'robots', content: 'all' })

    //end of section for setting page title

    this.categoryList=this.db1.getCategory();
    this.db1.getProfile().subscribe((data) => {
      this.publicProfile = data.map((e) => {
        return {
          id: e.payload.doc.id,
          ...(e.payload.doc.data() as {}),
        } as publicProfile;
      });
      if(this.routeCategory||this.routeLocType||this.routeLocation){
        if(this.routeCategory){
         this.category=this.routeCategory
        }
        this.routeFilterApplied=true;
        this.routeFilter()
      }
    });
    setInterval(() => {
      if (this.profileState) {
        this.dist = true;
      } else {
        this.dist = false;
      }
    }, 200);

  }
  profileStat() {
    // this.districts = null;
    // this.districted = null;
    // this.profileDistrict = null;
    // this.db1.filterDistrict = null;
    // if (this.profileState) {
    //   this.db1.filterState=this.profileState
    //   this.districts = this.location.find(
    //     (con) => con.state == this.profileState
    //   );
    //   this.districted = this.districts.districts;
    // }

    //  this.filteredProfile = (this.profileState) ? this.publicProfile?.filter(p => p.profileState?.toLowerCase().includes(this.profileState.toLowerCase())) : this.publicProfile;
  }
  routeFilter(){
    var val=setInterval(()=>{

    if(this.routeCategory){
      this.filteredProfile = (this.routeCategory) ? this.loadProfile?.filter(p => p.category?.toLowerCase().includes(this.routeCategory.toLowerCase())) : this.publicProfile;
    }
    if(this.routeLocType){
      if(this.routeLocType=="district"){
        this.filteredProfile = (this.routeLocation) ? this.loadProfile?.filter(p => p.profileDistrict?.includes(this.routeLocation)):this.loadProfile;
      }
      if(this.routeLocType=="state"){
        // console.log("entereed")
        this.filteredProfile = (this.routeLocation) ? this.filteredProfile?.filter(p => p.profileState?.includes(this.routeLocation)):this.filteredProfile;
      }
    }
    // console.log(this.filteredProfile)

    if(this.loadProfile){
      clearInterval(val)
    }
          
  },200)
    // if(this.)
  }
  public handleAddressChange(address: any) {
    this.profileCountry="";
    this.profileDistrict=null;
    this.profileState= "";
    this.profileStreet="";
    this.profileLocality= "";
    let addressArray=address.address_components
    this.locationId=address.place_id
    //  console.log(addressArray[1].types[0])
    //  console.log(addressArray[1].long_name)
     addressArray.forEach(element => {
        if(element.types[0]=='country'){
          this.profileCountry= element.long_name;
        }
        else if(element.types[0]=='administrative_area_level_2'){
          this.profileDistrict= element.long_name;
        }
        else if(element.types[0]=='administrative_area_level_1'){
          this.profileState= element.long_name;
        }
        else if(element.types[0]=='route'){
          this.profileStreet= element.long_name;
        }
        else if(element.types[0]=='locality'){
          this.profileLocality= element.long_name;
        }
        
        
     });
    this.fullAddress =address.formatted_address
    this.formattedAddress = address.formatted_address
    // console.log(this.profileDistrict,this.profileState,this.profileLocality)
 }
  profileDist() {
   this.db1.filterDistrict=this.profileDistrict
    // this.filteredProfile = (this.profileDistrict) ? this.publicProfile?.filter(p => p.profileDistrict?.toLowerCase().includes(this.profileDistrict.toLowerCase())) : this.publicProfile;
  }
  filterCategory(category) {
    this.category = category;
    // this.search()
    // this.loadProfile= this.publicProfile;
    // if(this.category){
    //   this.filteredProfile = (this.category) ? this.loadProfile?.filter(p => p.category?.toLowerCase().includes(this.category.toLowerCase())) : this.publicProfile;
    //   this.loadProfile=this.filteredProfile
    // }
    // this.db1.filterCategory=this.category
    // this.filteredProfile = (category) ? this.publicProfile?.filter(p => p.category?.toLowerCase().includes(category.toLowerCase())) : this.publicProfile;
  }
  // filter() {
  //   let list: publicProfile[] = [];
  //   list = this.publicProfile;
  //   if (this.db1.filterCategory) {
  //     list = list?.filter((p) =>
  //       p.category?.toLowerCase().includes(this.db1.filterCategory.toLowerCase())
  //     );
  //   }
  //   if (this.db1.filterState) {
  //     list = list?.filter((p) =>
  //       p.profileState?.toLowerCase().includes(this.db1.filterState.toLowerCase())
  //     );
  //   }
  //   if (this.db1.filterDistrict) {
  //     list = list?.filter((p) =>
  //       p.profileDistrict
  //         ?.toLowerCase()
  //         .includes(this.db1.filterDistrict.toLowerCase())
  //     );
  //   }
  //   return list;
  // }
  ngOnInit(): void {
     this.profileDistrict=this.db1.filterDistrict;
     this.profileState=this.db1.filterState;
     this.isLocatonClicked=this.db1.locationClick;
     if(this.profileState){
     this.districts = this.location.find(
      (con) => con.state == this.profileState
    );
    this.districted = this.districts.districts;
    }
     this.category=this.db1.filterCategory
    var myVar = setInterval(() => {
      if (this.publicProfile) {
        this.filteredProfile = this.publicProfile;
        this.loadProfile=this.publicProfile
        this.progressBarStatus = true;
        clearInterval(myVar);
      }
      // console.log(this.publicProfile)
    }, 200);
  }
  search(){
    this.mobToolbar = false;
    this.mobMarginTop=112;
    this.loadProfile= this.publicProfile;
    this.routeFilterApplied= false;
    if(this.category){
      this.filteredProfile = (this.category) ? this.loadProfile?.filter(p => p.category?.toLowerCase().includes(this.category.toLowerCase())) : this.publicProfile;
      this.loadProfile=this.filteredProfile
    if(this.fullAddress){
     if(this.profileLocality && this.profileDistrict!=this.profileLocality ) {
      //  console.log("locality")
      // this.filteredProfile = (this.profileLocality) ? this.loadProfile?.filter(p => p.profileLocality?.includes(this.profileLocality)):this.loadProfile;
      this.filteredProfile = (this.profileDistrict) ? this.loadProfile?.filter(p => p.profileDistrict?.includes(this.profileDistrict)):this.loadProfile;
     }
     else if(this.profileDistrict==this.profileLocality && this.profileState!= this.profileDistrict) {
      // console.log("district")
      this.filteredProfile = (this.profileDistrict) ? this.loadProfile?.filter(p => p.profileDistrict?.includes(this.profileDistrict)):this.loadProfile;
     }
     else if(this.profileState) {
      // console.log("state")
      this.filteredProfile = (this.profileState) ? this.loadProfile?.filter(p => p.profileState?.includes(this.profileState)):this.loadProfile;
     }
    }
    }
    if(this.fullAddress){
      if(this.profileLocality && this.profileDistrict!=this.profileLocality ) {
        // console.log("locality")
       this.filteredProfile = (this.profileLocality) ? this.loadProfile?.filter(p => p.profileLocality?.includes(this.profileLocality)):this.loadProfile;
      }
      else if(this.profileDistrict==this.profileLocality && this.profileState!= this.profileDistrict) {
      //  console.log("district")
       this.filteredProfile = (this.profileDistrict) ? this.loadProfile?.filter(p => p.profileDistrict?.includes(this.profileDistrict)):this.loadProfile;
      }
      else if(this.profileState) {
      //  console.log("state")
       this.filteredProfile = (this.profileState) ? this.loadProfile?.filter(p => p.profileState?.includes(this.profileState)):this.loadProfile;
      }
      this.loadProfile=this.filteredProfile
      if(this.category){
        this.filteredProfile = (this.category) ? this.loadProfile?.filter(p => p.category?.toLowerCase().includes(this.category.toLowerCase())) : this.publicProfile;
      }
    }

  }
  visitProfile(id) {
    // this.router.navigate(['/publicprofile', id]);
    // this.dialog.open(PublicProfileComponent , {
    //   data: {

    //   }
    // });
  }

  onBack() {
    this.locations.back();
  }
  resetData() {
    // this.mobToolbar = false;
    this.routeFilterApplied= false;
    // this.mobMarginTop=224;
    this.filteredProfile = this.publicProfile;
    this.loadProfile= this.publicProfile;
    this.isLocatonClicked=false;
    this.profileState = null;
    this.fullAddress="";
    this.profileDistrict = null;
    this.category = "";
    this.db1.filterCategory=null;
    this.db1.filterDistrict=null;
    this.db1.filterState=null;
    this.db1.locationClick=false;

    
  }
  onLocation(){
    this.isLocatonClicked=true; 
    this.db1.locationClick=this.isLocatonClicked;
  }
  showToolbar(){
    this.mobToolbar = !this.mobToolbar;
    if(this.mobToolbar == true){
      this.mobMarginTop=224;
    }else if(this.mobToolbar == false){
      this.mobMarginTop=112;
    }
  }
}
