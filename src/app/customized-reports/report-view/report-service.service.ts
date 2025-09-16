
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ProductModel, QueryOptions, ReportSettings } from 'src/app/data-models';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportServiceService {

  constructor(private db: AngularFirestore) { }
  readDataDateRange(superUserId, module, queryField, date1, date2) {
    return this.db
      .collection('users/' + superUserId + '/' + module, (ref) =>
        ref.where(queryField, '>=', date1).where(queryField, '<=', date2)
      )
      .snapshotChanges();
  }

  readDataDateRangeUserList(
    superUserId,
    module,
    queryField,
    date1,
    date2,
    userArray
  ) {
    return this.db
      .collection('users/' + superUserId + '/' + module, (ref) =>
        ref
          .where(queryField, '>=', date1)
          .where(queryField, '<=', date2)
          .where('assignedTo', 'in', userArray)
      )
      .snapshotChanges();
  }
  onSaveFilter(userId: string, reportId: string, reportSettings: ReportSettings) {
   return this.db.doc('users/' + userId + '/reports/' + reportId).update({
      ...reportSettings
    });
  }
  readPrimaryDataFromReport(superUserId, module, queryData: QueryOptions): Promise<any[]> {
    //console.log("queryData =="+JSON.stringify(queryData))
    if (module == 'products') {
      // For products module we are fetching the sales data, hence replace 'products' with 'sales' to fetch the sales collection from DB
      module = 'sales'
    }
    //If query is based on boolean fields
    if (queryData.queryType == 'boolean') {
      const collectionRef = this.db.collection('users/' + superUserId + '/' + module, (ref) =>
        ref.where(
          queryData.queryField,
          '==',
          queryData.comparisonValue[0]
        )
      )
      return collectionRef.get().toPromise()
        .then((querySnapshot) => {
          const documents: any[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            const documentWithId = Object.assign({ id: doc.id }, data);
            documents.push(documentWithId);
          });
          return documents;
        });

      // return this.db
      //   .collection('users/' + superUserId + '/' + module, (ref) =>
      //     ref.where(
      //       queryData.queryField,
      //       '==',
      //       queryData.comparisonValue[0]
      //     )
      //   )
      //   .snapshotChanges();
    }
    //If query is based on number field
    else if (queryData.queryType == 'number') {
      const collectionRef = this.db.collection('users/' + superUserId + '/' + module, (ref) =>
        ref.where(
          queryData.queryField,
          queryData.operator,
          Number(queryData.comparisonValue[0])
        )
      )
      return collectionRef.get().toPromise()
        .then((querySnapshot) => {
          const documents: any[] = [];
          querySnapshot.forEach((doc) => {
             const data = doc.data();
            const documentWithId = Object.assign({ id: doc.id }, data);
            documents.push(documentWithId);
          });
          return documents;
        });

      // return this.db
      //   .collection('users/' + superUserId + '/' + module, (ref) =>
      //     ref.where(
      //       queryData.queryField,
      //       queryData.operator,
      //       Number(queryData.comparisonValue[0])
      //     )
      //   )
      //   .snapshotChanges();
    }
    //If query is based on date or timestamp and not addiitonal field/ sales document (docData)
    else if (
      (queryData.queryType == 'date' ||
        queryData.queryType == 'timestamp') && (queryData.fieldType != 'Additional' && queryData.fieldType != 'docData')
    ) {
      if(queryData.comparisonValue[1] =='Before Date'){
        let start = new Date();
        if (queryData.queryType == 'timestamp') {
          start = new Date(queryData.comparisonValue[0])
        } else {
          start = queryData.comparisonValue[0];
        }

        const collectionRef = this.db.collection('users/' + superUserId + '/' + module, (ref) =>
          ref.where(
            queryData.queryField,
            '<',
            start
          ))
        return collectionRef.get().toPromise()
          .then((querySnapshot) => {
            const documents: any[] = [];
            querySnapshot.forEach((doc) => {
               const data = doc.data();
            const documentWithId = Object.assign({ id: doc.id }, data);
            documents.push(documentWithId);
            });
            return documents;
          });

        // return this.db
        // .collection('users/' + superUserId + '/' + module, (ref) =>
        //   ref.where(
        //     queryData.queryField,
        //     '<',
        //     start
        //   )
        // )
        // .snapshotChanges();
      }else if(queryData.comparisonValue[1] =='After Date'){
        let start = new Date();
        if (queryData.queryType == 'timestamp') {
          start = new Date(queryData.comparisonValue[0])
        } else {
          start = queryData.comparisonValue[0];
        }
        const collectionRef = this.db.collection('users/' + superUserId + '/' + module, (ref) =>
          ref.where(
            queryData.queryField,
            '>',
            start
          ))
        return collectionRef.get().toPromise()
          .then((querySnapshot) => {
            const documents: any[] = [];
            querySnapshot.forEach((doc) => {
               const data = doc.data();
            const documentWithId = Object.assign({ id: doc.id }, data);
            documents.push(documentWithId);
            });
            return documents;
          });

       
        // return this.db
        // .collection('users/' + superUserId + '/' + module, (ref) =>
        //   ref.where(
        //     queryData.queryField,
        //     '>',
        //     start
        //   )
        // )
        // .snapshotChanges();
      }
      else{
      let start = new Date();
      let end = new Date();
      if (queryData.queryType == 'timestamp') {
        start = new Date(queryData.comparisonValue[0])
        end = new Date(queryData.comparisonValue[1])
      } else {
        start = queryData.comparisonValue[0];
        end = queryData.comparisonValue[1];
      }
        const collectionRef = this.db.collection('users/' + superUserId + '/' + module, (ref) =>
          ref.where(
            queryData.queryField,
            '>=',
            start
          ).where(
            queryData.queryField,
            '<=',
            end
          ))
        return collectionRef.get().toPromise()
          .then((querySnapshot) => {
            const documents: any[] = [];
            querySnapshot.forEach((doc) => {
               const data = doc.data();
            const documentWithId = Object.assign({ id: doc.id }, data);
            documents.push(documentWithId);
            });
            return documents;
          });

     
      // return this.db
      //   .collection('users/' + superUserId + '/' + module, (ref) =>
      //     ref.where(
      //       queryData.queryField,
      //       '>=',
      //       start
      //     ).where(
      //       queryData.queryField,
      //       '<=',
      //       end
      //     )
      //   )
      //   .snapshotChanges();
      }
    }
    //If query is based on date or timestamp and addiitonal field
    else if (
      (queryData.queryType == 'date' ||
        queryData.queryType == 'timestamp') && (queryData.fieldType == 'Additional')
    ) {
      if(queryData.comparisonValue[1] =='Before Date'){
        let queryfield: string = 'additionalFieldsArr.' + queryData.ind.toString() + '.fieldValue'
        let start = new Date(queryData.comparisonValue[0]);

        const collectionRef = this.db.collection('users/' + superUserId + '/' + module, (ref) =>
          ref.where(
            queryfield,
            '<',
            start
          ))
        return collectionRef.get().toPromise()
          .then((querySnapshot) => {
            const documents: any[] = [];
            querySnapshot.forEach((doc) => {
               const data = doc.data();
            const documentWithId = Object.assign({ id: doc.id }, data);
            documents.push(documentWithId);
            });
            return documents;
          });

        // return this.db
        //   .collection('users/' + superUserId + '/' + module, (ref) =>
        //     ref.where(
        //       queryfield,
        //       '<',
        //       start
        //     )
        //   )
        //   .snapshotChanges();
      }else if(queryData.comparisonValue[1] =='After Date'){
        let queryfield: string = 'additionalFieldsArr.' + queryData.ind.toString() + '.fieldValue'
        let start = new Date(queryData.comparisonValue[0]);
        const collectionRef = this.db.collection('users/' + superUserId + '/' + module, (ref) =>
        ref.where(
          queryfield,
          '>',
          start
        ))
        return collectionRef.get().toPromise()
          .then((querySnapshot) => {
            const documents: any[] = [];
            querySnapshot.forEach((doc) => {
               const data = doc.data();
            const documentWithId = Object.assign({ id: doc.id }, data);
            documents.push(documentWithId);
            });
            return documents;
          });
       

        // return this.db
        //   .collection('users/' + superUserId + '/' + module, (ref) =>
        //     ref.where(
        //       queryfield,
        //       '>',
        //       start
        //     )
        //   )
        //   .snapshotChanges();
      }else{
      let queryfield: string = 'additionalFieldsArr.' + queryData.ind.toString() + '.fieldValue'
      let start = new Date(queryData.comparisonValue[0]);
      let end = new Date(queryData.comparisonValue[1]);

        const collectionRef = this.db.collection('users/' + superUserId + '/' + module, (ref) =>
          ref.where(
            queryfield,
            '>=',
            start
          ).where(
            queryfield,
            '<=',
            end
          ))
        return collectionRef.get().toPromise()
          .then((querySnapshot) => {
            const documents: any[] = [];
            querySnapshot.forEach((doc) => {
               const data = doc.data();
            const documentWithId = Object.assign({ id: doc.id }, data);
            documents.push(documentWithId);
            });
            return documents;
          });

      
      // return this.db
      //   .collection('users/' + superUserId + '/' + module, (ref) =>
      //     ref.where(
      //       queryfield,
      //       '>=',
      //       start
      //     ).where(
      //       queryfield,
      //       '<=',
      //       end
      //     )
      //   )
      //   .snapshotChanges();
      }
    }
    // If query is based on date or timestamp and for a sales document
    else if (
      (queryData.queryType == 'date' ||
        queryData.queryType == 'timestamp') && (queryData.fieldType == 'docData')
    ) {
      if(queryData.comparisonValue[1] =='Before Date'){
        let queryfield: string = 'docData.' + queryData.queryField
        let start = new Date();
        if (queryData.queryType == 'timestamp') {
          start = new Date(queryData.comparisonValue[0])
        } else {
          start = queryData.comparisonValue[0];
        }

        const collectionRef = this.db.collection('users/' + superUserId + '/' + module, (ref) =>
          ref.where(
            queryfield,
            '<',
            start
          ))
        return collectionRef.get().toPromise()
          .then((querySnapshot) => {
            const documents: any[] = [];
            querySnapshot.forEach((doc) => {
               const data = doc.data();
            const documentWithId = Object.assign({ id: doc.id }, data);
            documents.push(documentWithId);
            });
            return documents;
          });

        

        // return this.db
        //   .collection('users/' + superUserId + '/' + module, (ref) =>
        //     ref.where(
        //       queryfield,
        //       '<',
        //       start
        //     )
        //   )
        //   .snapshotChanges();
      }else if(queryData.comparisonValue[1] =='After Date'){
        let queryfield: string = 'docData.' + queryData.queryField
        let start = new Date();
        if (queryData.queryType == 'timestamp') {
          start = new Date(queryData.comparisonValue[0])
        } else {
          start = queryData.comparisonValue[0];
        }

        const collectionRef = this.db.collection('users/' + superUserId + '/' + module, (ref) =>
          ref.where(
            queryfield,
            '>',
            start
          ))
        return collectionRef.get().toPromise()
          .then((querySnapshot) => {
            const documents: any[] = [];
            querySnapshot.forEach((doc) => {
               const data = doc.data();
            const documentWithId = Object.assign({ id: doc.id }, data);
            documents.push(documentWithId);
            });
            return documents;
          });

        

        // return this.db
        //   .collection('users/' + superUserId + '/' + module, (ref) =>
        //     ref.where(
        //       queryfield,
        //       '>',
        //       start
        //     )
        //   )
        //   .snapshotChanges();
      }else{
      let queryfield: string = 'docData.' + queryData.queryField
      let start = new Date();
      let end = new Date();
      if (queryData.queryType == 'timestamp') {
        start = new Date(queryData.comparisonValue[0])
        end = new Date(queryData.comparisonValue[1])
      } else {
        start = queryData.comparisonValue[0];
        end = queryData.comparisonValue[1];
      }
        const collectionRef = this.db.collection('users/' + superUserId + '/' + module, (ref) =>
          ref.where(
            queryfield,
            '>=',
            start
          ).where(
            queryfield,
            '<=',
            end
          ))
        return collectionRef.get().toPromise()
          .then((querySnapshot) => {
            const documents: any[] = [];
            querySnapshot.forEach((doc) => {
               const data = doc.data();
            const documentWithId = Object.assign({ id: doc.id }, data);
            documents.push(documentWithId);
            });
            return documents;
          });

      

      // return this.db
      //   .collection('users/' + superUserId + '/' + module, (ref) =>
      //     ref.where(
      //       queryfield,
      //       '>=',
      //       start
      //     ).where(
      //       queryfield,
      //       '<=',
      //       end
      //     )
      //   )
      //   .snapshotChanges();
      }
    } /*else if(queryData.queryField =='prodCategory' || queryData.queryField =='productId' ){
      let queryfield: string = 'itemsArray.' + queryData.ind.toString() + '.fieldValue'
      return this.db
        .collection('users/' + superUserId + '/' + module, (ref) =>
          ref.where(queryfield, queryData.operator, queryData.comparisonValue)).snapshotChanges();
    }*/

    else {
      if (queryData.fieldType != 'Additional') {
        const collectionRef = this.db.collection('users/' + superUserId + '/' + module, (ref) =>
          ref.where(
            queryData.queryField,
            queryData.operator,
            queryData.comparisonValue
          ))
        return collectionRef.get().toPromise()
          .then((querySnapshot) => {
            const documents: any[] = [];
            querySnapshot.forEach((doc) => {
               const data = doc.data();
            const documentWithId = Object.assign({ id: doc.id }, data);
            documents.push(documentWithId);
            });
            return documents;
          });

       

        // return this.db
        //   .collection('users/' + superUserId + '/' + module, (ref) =>
        //     ref.where(
        //       queryData.queryField,
        //       queryData.operator,
        //       queryData.comparisonValue
        //     )
        //   )
        //   .snapshotChanges();
      } else {
        //If additional field
        let queryfield: string = 'additionalFieldsArr.' + queryData.ind.toString() + '.fieldValue'

        const collectionRef = this.db.collection('users/' + superUserId + '/' + module, (ref) =>
          ref.where(queryfield, queryData.operator, queryData.comparisonValue))
        return collectionRef.get().toPromise()
          .then((querySnapshot) => {
            const documents: any[] = [];
            querySnapshot.forEach((doc) => {
               const data = doc.data();
            const documentWithId = Object.assign({ id: doc.id }, data);
            documents.push(documentWithId);
            });
            return documents;
          });

       
        // return this.db
        //   .collection('users/' + superUserId + '/' + module, (ref) =>
        //     ref.where(queryfield, queryData.operator, queryData.comparisonValue)).snapshotChanges();
      }

    }


  }


  saveGraphSettingstoDB(userId, reportSettingsArray) {


    //console.log("Updated report settings", this.reportSettingsArray)
    this.db.doc('users/' + userId).update({ 'ReportSettings': reportSettingsArray })
  }

  async getProducts(
    id: string,
  ): Promise<ProductModel[]> {
    return await this.db
      .collection('users/' + id + '/products', (ref) =>
        ref.orderBy('dateCreated', 'desc')
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
            } as ProductModel)
          )
        )
      )
      .toPromise();
  }
  // deleting a dashboard report
  deleteDashboardReport(userId: string, dashBoardReportId: string, reportsArray) {
    return this.db.doc('users/' + userId + '/dashBoardReports/' + dashBoardReportId).update({
      reportsArray: reportsArray
    });
  }
  //get reports under a user
  getReports(uId) {
    return this.db
      .collection('users/' + uId + '/reports', (ref) => ref.orderBy('createdDate', 'asc'))
      .snapshotChanges();
  }
  //delete report
  deleteReports(userId: string, reportId: string) {
    return this.db.doc('users/' + userId + '/reports/' + reportId).delete();
  }
  //delete dashboard report
  deleteDashBoardReports(userId: string, dashboardId: string,reportsArray) {
    return this.db.doc('users/' + userId + '/dashBoardReports/' + dashboardId).update({
      reportsArray: reportsArray
    });
  }
  // create a new report
  createReport(userId: string, data) {
    return this.db.collection('users/' + userId + '/reports').add({
      ...data,createdDate : new Date().getTime()
    });
  }
  onUpdateReport(userId: string, reportId: string, title) {
    this.db.doc('users/' + userId + '/reports/' + reportId).update({
      title: title,
    });
  }
  // for get a particular report
  getReport(userId: string, reportId: string) {
    return this.db
      .doc<ReportSettings>('users/' + userId + '/reports/' + reportId)
      .valueChanges();
  }
  deleteDashboardReports(userId: string, reportId: string) {
    return this.db.doc('users/' + userId + '/dashBoardReports/' + reportId).delete();
  }
}
