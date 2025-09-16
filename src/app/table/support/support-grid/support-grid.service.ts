import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from 'src/app/common.service';
import { Service } from 'src/app/data-models';

@Injectable({
  providedIn: 'root'
})
export class SupportGridService {

  isOldModeVisible: boolean = false;
  serviceList: BehaviorSubject<Service[]> = new BehaviorSubject<Service[]>([]);// customer list
  serviceViewSelected: any = {}; // sales view selected id
  serviceDefaultView: string = 'grid'; //decides if view grid/ table for customer
  serviceView: string = 'grid'; //decides if view grid/ table for customer

  private onFunctionCallSource = new BehaviorSubject<string>('');
  onFunctionCall$ = this.onFunctionCallSource.asObservable();
  constructor(private db: AngularFirestore, private commonService: CommonService) { }
  onFunctionCall(value) {
    this.onFunctionCallSource.next(value);
  }
  getServiceList(superUserId, queryData, userIdArray) {
    return this.commonService
      .readPrimaryData(
        superUserId,
        'services',
        queryData,
        userIdArray
      )
  }
   // update Service status from drag and drop in Service list view
   onUpdateserviceStatus(
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
    return this.db.doc('users/' + userId + '/services/' + id).update({
      servicesStage: status,
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
