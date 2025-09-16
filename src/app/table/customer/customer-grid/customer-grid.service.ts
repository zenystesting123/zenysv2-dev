import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from 'src/app/common.service';
import { Customer } from 'src/app/data-models';
@Injectable({
  providedIn: 'root'
})
export class CustomerGridService {
  isOldModeVisible: boolean = false;
  customerList: BehaviorSubject<Customer[]> = new BehaviorSubject<Customer[]>([]);// customer list
  customerViewSelected: any = {}; // customer view selected id
  customerDefaultView: string = 'grid'; //decides if view grid/ table for customer
  customerView: string = 'grid'; //decides if view grid/ table for customer

  private onFunctionCallSource = new BehaviorSubject<string>('');
  onFunctionCall$ = this.onFunctionCallSource.asObservable();
  constructor(private db: AngularFirestore, private commonService: CommonService) { }
  onFunctionCall(value) {
    this.onFunctionCallSource.next(value);
  }
  getCustomerList(superUserId, queryData, userIdArray) {
    return this.commonService
      .readPrimaryData(
        superUserId,
        'customers',
        queryData,
        userIdArray
      )
  }

  // in list if drag and dropped, update customer status
  onUpdateCustomer(
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
    return this.db.doc('users/' + userId + '/customers/' + id).update({
      status: status,
      stageHistory: stageHistories,
      currentStatusDate: datePlaced,
      inPipeline,
      won,
      lost,
      rejectionReasonValue,
      changeLog,
      lastModifiedDate: new Date().getTime(),
    });
  }

}
