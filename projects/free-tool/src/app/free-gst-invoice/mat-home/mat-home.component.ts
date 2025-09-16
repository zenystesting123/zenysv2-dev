import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DOCUMENT, formatCurrency } from '@angular/common';
import { Component, Inject, Input, OnChanges, OnInit, SimpleChange, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { ActivationStart, NavigationEnd, NavigationStart, Router, RoutesRecognized, Event as NavigationEvent, ActivatedRoute, NavigationExtras } from '@angular/router';

declare var gtag: Function;

@Component({
  selector: 'app-mat-home',
  templateUrl: './mat-home.component.html',
  styleUrls: ['./mat-home.component.scss']
})
export class MatHomeComponent implements OnInit {

  isTabletsize: boolean = false;
  isMobilesize: boolean = false;
  docData:any
  hubSpotChat:any;
  constructor(@Inject(DOCUMENT) private document: Document,private router:Router,
  private breakpointObserver: BreakpointObserver) {
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

    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //   gtag('event', 'pageview');
    
    //   }
    // });
  }

  

}
