import { LeadshareviewComponent } from '../leadshareview/leadshareview.component';
import { LeadshareService } from './leadshare.service';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LeadPurchaseComponent } from '../lead-purchase/lead-purchase.component';
import { MatDialog } from '@angular/material/dialog';
import { LeadAddPopupComponent } from '../lead-add-popup/lead-add-popup.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Leads, PurchasedLeads } from '../../data-models';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Location } from '@angular/common';
@Component({
  selector: 'app-leadshare',
  templateUrl: './leadshare.component.html',
  styleUrls: ['./leadshare.component.scss'],
})
export class LeadshareComponent implements OnInit {
  @ViewChild('modalContents') public modalContents: TemplateRef<any>;
  @ViewChild('modalContentss') modalContentss: TemplateRef<any>;
  [signpath: string]: any;
  checked: boolean;
  submitted: boolean;
  leads: Leads[];
  filterArray: any[];
  form: any;
  forms: any;
  leadSharedRating: any;
  leadPoints: number = 0;
  userid: any;
  located: boolean = false;
  location: boolean = false;
  leadPurchase: PurchasedLeads[];
  currentDate: any;
  timeDiff: any;
  tDate: any;
  usersId: string;
  user: firebase.default.UserInfo;
  isTabletsize:Boolean=false;
  isMobilesize:Boolean=false;
  constructor(
    public dialog: MatDialog,
    private modalService: NgbModal,
    private db: LeadshareService,
    private router: Router,
    private ref: ChangeDetectorRef,
    private afAuth: AngularFireAuth,
    private _snackBar: MatSnackBar,
    private breakpointObserver:BreakpointObserver,private locations:Location
    ) {
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

  }    

  ngOnInit(): void {
    this.id = firebase.default.auth().currentUser.uid;
    if (this.id)
      this.db
        .getNew('/users', this.id)
        .pipe(take(1))
        .subscribe((p) => (this.forms = p));

    this.currentDate = new Date().getTime();
    setInterval(() => {
      this.userid = this.user?.uid;
      this.ref.detectChanges();
      this.leadSharedRating = this.forms?.leadSharedRating;
      if (!this.forms?.leadSharedRating) {
        this.leadSharedRating = 0;
      }

      // console.log("forms",this.leads);
    }, 100);

    this.subscribe01 = this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.user = user;
        this.usersId = this.user.uid;
         this.db.getUser('/users', this.usersId).subscribe((data)=>{
          this.leadPoints = data.leadPoints;
        })

        this.db.getlead().subscribe((data) => {
          this.leads = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Leads;
          });
          this.db.getUserPurchasedLead(this.usersId).subscribe((data) => {
            this.leadPurchase = data.map((e) => {
              return {
                id: e.payload.doc.id,
                ...(e.payload.doc.data() as {}),
              } as PurchasedLeads;
            });

            this.leadPurchase.forEach((leadPurchase) => {
              this.leads = this.leads.filter(
                (leaad) => leaad.id != leadPurchase.leadId
              );
            });

          });
        });
      }
    });
  }
  onPurchase(
    id: string,
    submittedBy: string,
    firstName: string,
   lastName:string,
    companyName:string,
    leadEmail:string,
    leadContactNo:string,
    description: string,
    noPurchases: number,
    usrProfileScore: number,
    createDate: number
  ) {
    let leadScore = this.getPoints(noPurchases, usrProfileScore, createDate);
    if (this.leadPoints >= leadScore) {
    
      // const modalRef1 = this.modalService.open(LeadPurchaseComponent);
      // modalRef1.componentInstance.id = id;
      // modalRef1.componentInstance.submittedBy = submittedBy;
      // modalRef1.componentInstance.leadScore = leadScore;
      // modalRef1.componentInstance.name = name;
      if(companyName == ''){
       companyName = "N/A";
      }else{
       companyName = companyName;
      }
     
      // modalRef1.componentInstance.description = description;


      const dialogRef = this.dialog.open(LeadPurchaseComponent, {
        width: '300px',
        data: {id: id, submittedBy: submittedBy,leadScore:leadScore,firstName:firstName,lastName:lastName,companyName:companyName,leadEmail:leadEmail,leadContactNo:leadContactNo,description:description}
      });
  
      dialogRef.afterClosed().subscribe(result => {
       
        this.animal = result;
      });
    } else {
      //this.toastr.error(' You doesn’t have sufficient points to access the lead');
      this._snackBar.open("You doesn’t have sufficient points to access the", "lead", {
        duration: 2000,
      });
    }
  }
  addLead(action: string) {
    const dialogRef = this.dialog.open(LeadAddPopupComponent, {
      width: '700px',
      data: { leadSharedRating: this.leadSharedRating },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
  viewLead(action: string) {
    this.modalData = { action };
    this.modalService.open(this.modalContentss, { size: 'lg' });
  }
  viewLeadDetails(id: string, customerId: string) {
    const modalRef1 = this.modalService.open(LeadshareviewComponent);
    modalRef1.componentInstance.id = id;
    modalRef1.componentInstance.customerId = customerId;
    // modalRef1.componentInstance.leadScore = leadScore;
  }
  locat() {
    if (this.located == true) {
      this.location = true;
    }
    // if(this.located == false){
    //   this.location=false;
    // }
  }
 
  filter(query: string) {
  
    this.leads = query
      ? this.filterArray.filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase())
        )
      : this.filterArray;
  }
  profileview(customerId) {
  
    this.router.navigate(['/pages/profile/', customerId]);
  }
  publicprofile() {
    this.router.navigate(['/publicprofile/']);
  }
  TypeError() {
    //this.toastr.error('Please fill all the mandatory fields');    //showing error in the toastng window
    this.submitted = true;
  }
  getPoints(noPurchases, userScore, date) {
    let currentDate = new Date();
    this.tDate = currentDate;
    if (noPurchases >= 25) {
      noPurchases = 0;
    } else {
      noPurchases = ((25 - noPurchases) / 25) * 100;
    }
    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(Math.abs((this.tDate - date) / oneDay));
    let ageScore = ((30 - diffDays) / 30) * 100;
    if (diffDays >= 30) {
      ageScore = 0;
    }
    //  let createDate =date.setDate(date.getDate() );
    // this.timeDiff=currentDate?.getTime()-createDate?.getTime()

    return (
      Math.round(
        ((noPurchases * 0.35 + userScore * 0.3 + ageScore * 0.35) *
          (5 / 100) *
          100) /
          10
      ) * 10
    );
  }
  check() {
    if (this.checked == true) {
      this.id = firebase.default.auth().currentUser.uid;
      if (this.id)
        this.db
          .getNew('/users', this.id)
          .pipe(take(1))
          .subscribe((p) => (this.form = p));
    } else {
      this.form.phone = '';
      this.form.email = '';
    }
  }
  onBack(){
    this.locations.back()
  }
}
