import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Customer, Sales, Service, modules } from 'src/app/data-models';

@Injectable({
  providedIn: 'root',
})
export class PipelineAndStagesService {
  constructor(private db: AngularFirestore) {}

  // update pipeline field under pipelines collection
  updatePipeLinenames(id, module, pipelines) {
    if (module === 'Customer') {
      return this.db
        .doc('users/' + id + '/pipelines/customerPipelines')
        .update({ customerPipelines: pipelines });
    } else if (module === modules.sales) {
      return this.db
        .doc('users/' + id + '/pipelines/salePipelines')
        .update({ salePipelines: pipelines });
    } else if (module === 'Service') {
      return this.db
        .doc('users/' + id + '/pipelines/servicePipelines')
        .update({ servicePipelines: pipelines });
    }
  }

  // enable/disable customer ageing
  updateCustomerAgeActive(id, custAgeactive) {
    return this.db.doc('users/' + id).update({ actCustAgeing: custAgeactive });
  }
  // enable/disable sale ageing
  updateSaleAgeActive(id, actSaleAgeing) {
    return this.db.doc('users/' + id).update({ actSaleAgeing });
  }
  // enable/disable service ageing
  updateServiceAgeActive(id, actserviceAgeing) {
    return this.db
      .doc('users/' + id)
      .update({ actserviceAgeing: actserviceAgeing });
  }

  // to check if contacts are presnt in selected pipeline
  async getContactsWithPipeline(
    id: string,
    pipelineId: string
  ): Promise<Customer[]> {
    return await this.db
      .collection('users/' + id + '/customers/', (ref) =>
        ref.where('selectedContactPipeline', '==', pipelineId)
      )
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
              ({
                id: a.payload.doc.id,
                ...(a.payload.doc.data() as {}),
              } as Customer)
          )
        )
      )
      .toPromise();
  }

  // to check if sales are presnt in selected pipeline
  async getSalesWithPipeline(id: string, pipelineId: string): Promise<Sales[]> {
    return await this.db
      .collection('users/' + id + '/sales/', (ref) =>
        ref.where('selectedSalePipeline', '==', pipelineId)
      )
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
              ({
                id: a.payload.doc.id,
                ...(a.payload.doc.data() as {}),
              } as Sales)
          )
        )
      )
      .toPromise();
  }
  // to check if services are presnt in selected pipeline
  async getServicesWithPipeline(
    id: string,
    pipelineId: string
  ): Promise<Service[]> {
    return await this.db
      .collection('users/' + id + '/services/', (ref) =>
        ref.where('selectedServPipeline', '==', pipelineId)
      )
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
              ({
                id: a.payload.doc.id,
                ...(a.payload.doc.data() as {}),
              } as Service)
          )
        )
      )
      .toPromise();
  }

  // to check if contacts are present in selected status
  async getContactsWithStatus(
    id: string,
    pipelineId: number,
    statusId: string
  ): Promise<Customer[]> {
    return await this.db
      .collection('users/' + id + '/customers/', (ref) =>
        ref
          .where('selectedContactPipeline', '==', pipelineId)
          .where('status', '==', statusId)
      )
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
              ({
                id: a.payload.doc.id,
                ...(a.payload.doc.data() as {}),
              } as Customer)
          )
        )
      )
      .toPromise();
  }

  // to check if sales are present in selected status
  async getSalesWithStatus(
    id: string,
    pipelineId: number,
    statusId: string
  ): Promise<Sales[]> {
    return await this.db
      .collection('users/' + id + '/sales/', (ref) =>
        ref
          .where('selectedSalePipeline', '==', pipelineId)
          .where('salesStage', '==', statusId)
      )
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
              ({
                id: a.payload.doc.id,
                ...(a.payload.doc.data() as {}),
              } as Sales)
          )
        )
      )
      .toPromise();
  }

  // to check if service are present in selected status
  async getServicesWithStatus(
    id: string,
    pipelineId: number,
    statusId: string
  ): Promise<Service[]> {
    return await this.db
      .collection('users/' + id + '/services/', (ref) =>
        ref
          .where('selectedServPipeline', '==', pipelineId)
          .where('servicesStage', '==', statusId)
      )
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
              ({
                id: a.payload.doc.id,
                ...(a.payload.doc.data() as {}),
              } as Service)
          )
        )
      )
      .toPromise();
  }

  // update newly selected status while delteing a status option in customers
  updateStatusInContacts(
    userId,
    id,
    status,
    stageHistory,
    inPipeline,
    won,
    lost,
    rejectionReasonValue,
    changeLog
  ) {
    return this.db.doc('users/' + userId + '/customers/' + id).update({
      status,
      stageHistory,
      currentStatusDate: new Date().getTime(),
      inPipeline,
      won,
      lost,
      rejectionReasonValue,
      changeLog,
      lastModifiedDate: new Date().getTime(),
    });
  }

  // update newly selected status while delteing a status option in sales
  updateStatusInSales(
    userId,
    id,
    salesStage,
    stageHistory,
    inPipeline,
    won,
    lost,
    rejectionReasonValue,
    changeLog
  ) {
    return this.db.doc('users/' + userId + '/sales/' + id).update({
      salesStage,
      stageHistory,
      currentStatusDate: new Date().getTime(),
      inPipeline,
      won,
      lost,
      rejectionReasonValue,
      changeLog,
      lastModifiedDate: new Date().getTime(),
    });
  }

  // update newly selected status while delteing a status option in services
  updateStatusInServices(
    userId,
    id,
    servicesStage,
    stageHistory,
    inPipeline,
    won,
    lost,
    rejectionReasonValue,
    changeLog
  ) {
    return this.db.doc('users/' + userId + '/services/' + id).update({
      servicesStage,
      stageHistory,
      currentStatusDate: new Date().getTime(),
      inPipeline,
      won,
      lost,
      rejectionReasonValue,
      changeLog,
      lastModifiedDate: new Date().getTime(),
    });
  }
}
