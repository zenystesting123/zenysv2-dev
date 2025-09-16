/*-----------------------------------------------------------------------
 Description : Main tool bar for creating invoice, estimate,quotation ,proforma, and purchase order
  ------------------------------------------------------------------- */
import { Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/common.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-main-tool-bar',
  templateUrl: './main-tool-bar.component.html',
  styleUrls: ['./main-tool-bar.component.scss'],
})
export class MainToolBarComponent implements OnInit, OnDestroy {
  isMobilesize: boolean = false;
  private onDestroy$: Subject<void> = new Subject<void>(); //Subject that emits when the component has been destroyed.
  constructor(private commonService: CommonService, @Inject(DOCUMENT) private document: Document) {}
  goToInvDownloadPage():
    void {
      this.document.location.href = 'https://blog.zenys.org/download-free-invoice-templates/';}

      goToQuoteDownloadPage():
      void {
        this.document.location.href = 'https://blog.zenys.org/download-quotation-templates-in-word-excel-pdf/';}
  
  ngOnInit() {
    // subscribe the user details
    this.commonService.userDatas.pipe(takeUntil(this.onDestroy$)).subscribe((allData) => {
      this.isMobilesize = allData.isMobileSize; // get scren size
    });
  }
  @HostListener('window:beforeunload')
  ngOnDestroy() {
    // ondestroy
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
