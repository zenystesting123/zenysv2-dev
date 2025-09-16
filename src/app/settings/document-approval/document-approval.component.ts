import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/common.service';
import { DocumentsetttingsService } from '../documentsettings/documentsetttings.service';

@Component({
  selector: 'app-document-approval',
  templateUrl: './document-approval.component.html',
  styleUrls: ['./document-approval.component.scss'],
})
export class DocumentApprovalComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();
  fieldNameEstimate: string = 'Estimate';
  fieldNameQuotation: string = 'Quotation';
  fieldNameInvoice: string = 'Invoice';
  userId: string; //current user id
  superUserId: string;
  invoiceApproval: boolean = false;
  quotationApproval: boolean = false;
  estimateApproval: boolean = false;
  accountType:string;
  constructor(
    public commonService: CommonService,
    public db: DocumentsetttingsService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.commonService.userDatas
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((allData) => {
        if (allData) {
          if (allData.userDetails) {
            this.userId = allData.authDetails.uid;

            if (allData.superUserDetails.fieldNames) {
              this.fieldNameEstimate =
                allData.superUserDetails.fieldNames.fieldNameEstimate;
              this.fieldNameQuotation =
                allData.superUserDetails.fieldNames.fieldNameQuotation;
              this.fieldNameInvoice =
                allData.superUserDetails.fieldNames.fieldNameInvoice;
            }
            this.accountType=allData.userDetails.accountType
            // superuserId assigning
            if (allData.userDetails.superUserId) {
              this.superUserId = allData.userDetails.superUserId;
            } else {
              //If for some reason the superuser id is not set (cases such as legacy data), then use the user id as super user id to read the data
              this.superUserId = this.userId;
            }
            if (allData.superUserDetails.invoiceApproval) {
              this.invoiceApproval = allData.superUserDetails.invoiceApproval;
            }
            if (allData.superUserDetails.quotationApproval) {
              this.quotationApproval =
                allData.superUserDetails.quotationApproval;
            }
            if (allData.superUserDetails.estimateApproval) {
              this.estimateApproval = allData.superUserDetails.estimateApproval;
            }
          }
        }
      });
  }
  // on destroy
  @HostListener('window:beforeunload')
  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
  updateApproval(){
    this.db.docApproval(
      this.superUserId,
      this.estimateApproval,
      this.quotationApproval,
      this.invoiceApproval
    ).then((res)=>{
      this.snack.open('Successfully Updated', '', {
        duration: 2000,
      });
    })
  }
}
