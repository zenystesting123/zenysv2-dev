import {
  Component,
  DoCheck,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/common.service';
import { SaletabService } from './saletab.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { PopupdialogComponent } from './popupdialog/popupdialog.component';
import { Currencies } from 'src/app/currencies';

@Component({
  selector: 'app-english-channel-sale-tab1',
  templateUrl: './english-channel-sale-tab1.component.html',
  styleUrls: ['./english-channel-sale-tab1.component.scss'],
})
export class EnglishChannelSaleTab1Component implements OnInit {
  @Input() data: any;

  // @Input('data') data: any;
  private onDestroy$: Subject<void> = new Subject<void>();
  displayedColumns = [
    'installmentName',
    'amount',
    'paymentDate',
    'comments',
    'edit/delete',
  ];
  currency: string = '';
  saleId: string;
  superUserId: string;
  saleDetails: any;
  universityFees: number = 0;
  scholarshipAmount: number = 0;
  formEnable: boolean = false;
  paidInstallments: any;
  pendingAmount: number;
  currencies: any;
  isNaN: Function = Number.isNaN
  constructor(
    private common: CommonService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private serv: SaletabService // public currencies: Currencies
  ) {
    this.currencies = Currencies.getCurencies();
    this.superUserId = this.common.superUserData.superUserId;
    this.saleId = this.route.snapshot.paramMap.get('saleId');
  }

  ngOnInit(): void {
    this.saleDetails = this.data.data;

    this.currency = this.saleDetails.currencyEC;
    if (this.saleDetails.universityFees){
      this.universityFees = this.saleDetails.universityFees;
    }
    if(this.saleDetails.scholarshipAmount){
      this.scholarshipAmount = this.saleDetails.scholarshipAmount;
    }


    this.paidInstallments = this.saleDetails.paidInstallments
      ? this.saleDetails.paidInstallments
      : [];
    let totalPaidAmount = 0;
    this.paidInstallments.forEach((ele) => {
      totalPaidAmount += ele.amount;
    });
    this.pendingAmount =
      this.universityFees - this.scholarshipAmount - totalPaidAmount;
  }
  saveAmounts() {
    this.serv.saveBasic(this.superUserId, this.saleId, {
      currencyEC: this.currency,
      universityFees: this.universityFees,
      scholarshipAmount: this.scholarshipAmount,
    });
    this.formEnable = false;
  }
  addPayment(scenario, data, index) {
    // console.log(data);
    // console.log(scenario);
    // console.log(index);

    let dialogRef = this.dialog.open(PopupdialogComponent, {
      // height: '400px',
      width: '600px',
      data: { scenario: scenario, data },
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (!!data) {
        const payments = this.paidInstallments;
        if (scenario == 'create') payments.push(data.value);
        if (scenario == 'edit') payments[index] = data.value;
        if (scenario == 'delete') payments.splice(index, 1);
        this.serv.saveBasic(this.superUserId, this.saleId, {
          paidInstallments: payments,
        });
      }
    });
  }
}
