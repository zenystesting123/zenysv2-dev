import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NetworkCheckService } from '../networkcheck.service';
import { CommonService } from '../common.service';
import { GoogleCalendarEventService } from '../calendar-events/google-calendar-event.service';
import { OutlookCalendarEventService } from '../outlook-calendar-events/outlook-calendar-event.service';
import { MsalService } from '@azure/msal-angular';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
declare var gapi: any;

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  connectGMailCalendarDisplay: boolean = false; //display gmail sigin icon
  connectOutlookCalendarDisplay: boolean = false; //display outlook signin icon

  constructor(
    public networkCheck: NetworkCheckService,
    public commonService: CommonService,
    public googleCalendarEventService: GoogleCalendarEventService,
    public outlookCalendarEventService: OutlookCalendarEventService,
    public authService: MsalService,
    private changeDetectorRef:ChangeDetectorRef,
    private router: Router,
    public location: Location
  ) { }

  ngOnInit(): void {
    //for initialize the google login part
    this.googleCalendarEventService.initClient.subscribe((data) => {
      if (data) {
        this.connectGMailCalendarDisplay = false; // check if user is already login if not show the connect calendar part
        // route to gmail calendar
        this.router.navigate(['/dash/eventlist']);
      } else {
        this.connectGMailCalendarDisplay = true;
      }
      this.changeDetectorRef.detectChanges();  
    });
    //to initialize the outlook login part
    if (this.outlookCalendarEventService.checkloginStatus()) {
      this.connectOutlookCalendarDisplay = false;  //hide connect 
      // route to outlook calendar
      this.router.navigate(['/dash/outlookeventlist']);
    } else {
      this.connectOutlookCalendarDisplay = true;
    }
    this.changeDetectorRef.detectChanges();  
  }
  

  async onGMailLogIn() {
    // gapi login
    await this.googleCalendarEventService.login();
    if(this.googleCalendarEventService.checkloginStatus()){
      this.connectGMailCalendarDisplay = false;
      // route to gmail calendar
      this.router.navigate(['/dash/eventlist']);
    } else {
      this.connectGMailCalendarDisplay = true;
    }
  }

  async onOutlookLogIn() {
    // gapi login
    await this.outlookCalendarEventService.login();
    if(this.outlookCalendarEventService.checkloginStatus()){
      this.connectOutlookCalendarDisplay = false;
      // route to gmail calendar
      this.router.navigate(['/dash/outlookeventlist']);
    } else {
      this.connectGMailCalendarDisplay = true;
    }
  }
  onBackMob() {
    // on back click
    this.location.back();
  }

   
}
