/*-----------------------------------------------------------------------
 Description : Main tool bar for creating invoice, estimate,quotation ,proforma, and purchase order
  ------------------------------------------------------------------- */
import { Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-main-tool-bar',
  templateUrl: './main-tool-bar.component.html',
  styleUrls: ['./main-tool-bar.component.scss'],
})
export class MainToolBarComponent implements OnInit, OnDestroy {
  isMobilesize: boolean = false;
  private onDestroy$: Subject<void> = new Subject<void>(); //Subject that emits when the component has been destroyed.
  constructor(private breakpointObserver: BreakpointObserver, @Inject(DOCUMENT) private document: Document) {
    breakpointObserver
    .observe([Breakpoints.HandsetLandscape, Breakpoints.HandsetPortrait])
    .subscribe((result) => {
      if (result.matches) {
        this.isMobilesize = true;
      } else {
        this.isMobilesize = false;
      }
    });
  }
  goToInvDownloadPage():
    void {
      this.document.location.href = 'https://blog.zenys.org/download-free-invoice-templates/';}

      goToQuoteDownloadPage():
      void {
        this.document.location.href = 'https://blog.zenys.org/download-quotation-templates-in-word-excel-pdf/';}
  
  ngOnInit() {
  
  }
  @HostListener('window:beforeunload')
  ngOnDestroy() {
    // ondestroy
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
