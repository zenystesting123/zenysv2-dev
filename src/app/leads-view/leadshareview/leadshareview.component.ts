import { LeadshareService } from '../leadshare/leadshare.service';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-leadshareview',
  templateUrl: './leadshareview.component.html',
  styleUrls: ['./leadshareview.component.scss']
})
export class LeadshareviewComponent implements OnInit {
  @Input() id: any;
  @Input() customerId: any;
  // @Input() leadScore: any;
  @Input() data: {};
  form:any;
  lead:any;
  constructor(
    private ref: ChangeDetectorRef,private db:LeadshareService,private modalService: NgbModal,
  ) {
    setTimeout(() => {
      this.ref.detectChanges()
     
      // console.log(this.leadScore)
          if(this.id) this.db.getLeadDetails(this.id).pipe(take(1)).subscribe(p=>this.form=p);
        
    }, 100);
   }

  ngOnInit(): void {
  }
  close(){
   // this.activeModal.close();
  }
  onClose(){
   // this.activeModal.close();
  }
// onPurchase(){
//   const modalRef1 = this.modalService.open(LeadPurchaseComponent, { size: 'md' });
//   console.log("hii")
//   modalRef1.componentInstance.leadScore = this.leadScore;
//   modalRef1.componentInstance.customerId = this.customerId;
//   modalRef1.componentInstance.id = this.id;
//   console.log("leadscore"+this.leadScore)
//   this.close();
// }
}
