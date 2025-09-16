import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quotationformfaqs',
  templateUrl: './quotationformfaq.component.html',
  styleUrls: ['./quotationformfaq.component.scss']
})
export class QuotationformfaqComponent implements OnInit {
  
  public isMobile: boolean = false;

  public isTablet: boolean = false;
  public isLarge: boolean = false;
  public isXLarge: boolean = false;
  public isTabletLandscape: boolean = false;
  public isTabletPortrait: boolean = false;
  public isSmallScreen: boolean = false;

  constructor(private ref: ChangeDetectorRef, breakpointObserver: BreakpointObserver) { 
    setInterval(() => {
      this.ref.detectChanges()
    }, 500);

    this.isSmallScreen = breakpointObserver.isMatched('(max-width: 599px)');

    breakpointObserver.observe([
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait
    ]).subscribe(result => {
      this.isMobile = result.matches;
      console.log(result.matches);
    });

    breakpointObserver.observe([
      Breakpoints.Tablet,
      Breakpoints.TabletLandscape,
      Breakpoints.TabletPortrait
    ]).subscribe(result => {
      this.isTablet = result.matches;
    });
    // check if mobile view
    //  this.isMobile=breakpointObserver.isMatched('(max-width: 480px)');

    //  this.isTablet=breakpointObserver.isMatched('(max-width: 700px)');
    //  this.isLarge=breakpointObserver.isMatched('(max-width: 1024px)');


    setInterval(() => {
      this.ref.detectChanges()
    }, 500);

    this.isSmallScreen = breakpointObserver.isMatched('(max-width: 599px)');

    breakpointObserver.observe([
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait
    ]).subscribe(result => {
      this.isMobile = result.matches;
    });

    breakpointObserver.observe([
      Breakpoints.Tablet,
      Breakpoints.TabletLandscape,
      Breakpoints.TabletPortrait
    ]).subscribe(result => {
      this.isTablet = result.matches;
    });


    breakpointObserver.observe([
      Breakpoints.Large
    ]).subscribe(result => {
      this.isLarge = result.matches;
    });
    breakpointObserver.observe([
      Breakpoints.XLarge
    ]).subscribe(result => {
      this.isXLarge = result.matches;
    });
  }

  ngOnInit(): void {
  }

}
