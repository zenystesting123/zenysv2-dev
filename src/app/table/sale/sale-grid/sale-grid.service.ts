import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from 'src/app/common.service';
import { Sales } from 'src/app/data-models';
@Injectable({
  providedIn: 'root'
})
export class SaleGridService {

  isOldModeVisible: boolean = false;
  saleList: BehaviorSubject<Sales[]> = new BehaviorSubject<Sales[]>([]);// customer list
  saleViewSelected: any = {}; // sales view selected id
  saleDefaultView: string = 'grid'; //decides if view grid/ table for customer
  saleView: string = 'grid'; //decides if view grid/ table for customer

  private onFunctionCallSource = new BehaviorSubject<string>('');
  onFunctionCall$ = this.onFunctionCallSource.asObservable();
  constructor(private db: AngularFirestore, private commonService: CommonService) { }
  onFunctionCall(value) {
    this.onFunctionCallSource.next(value);
  }
  getSaleList(superUserId, queryData, userIdArray) {
    return this.commonService
      .readPrimaryData(
        superUserId,
        'sales',
        queryData,
        userIdArray
      )
  }
  onUpdateSaleStatus(
    userId,
    id,
    status,
    stageHistories,
    datePlaced,
    inPipeline,
    won,
    lost,
    rejectionReasonValue,
    changeLog
  ) {
    return this.db.doc('users/' + userId + '/sales/' + id).update({
      salesStage: status,
      stageHistory: stageHistories,
      currentStatusDate: datePlaced,
      inPipeline,
      won,
      lost,
      rejectionReasonValue,
      changeLog,
      lastModifiedDate: new Date().getTime()
    });
  }
}
