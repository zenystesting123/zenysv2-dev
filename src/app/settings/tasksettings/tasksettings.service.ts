import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class TasksettingsService {
  constructor(private db: AngularFirestore) {}

  //for updating latest additional field update to db in user level
  updateCustomFields(id, fields) {
    return this.db.doc('users/' + id).update({ customFieldsTask: fields });
  }
  //for getting profile defaults to enable and disable edit
  readProfileDefinition(superUserId: string, profilename: string) {
    return this.db
      .collection<any>('users/' + superUserId + '/profilesDefault', (ref) =>
        ref.where('profileName', '==', profilename)
      )
      .valueChanges();
  }
  //customisable fields
    //customisable field
    updateFieldCustomization(superUserId, taskSettings) {
      return this.db.doc('users/' + superUserId).update({
        taskSettings
       });
    }
       //Task
   updateTaskfieldName(superUserId: string, fieldName) {
    var nestedkey = 'fieldNameTask';
    return this.db.doc('users/' + superUserId).update({
      [`fieldNames.${nestedkey}`]: fieldName,
    });
  }
  
  //for storing taskStatus related data into user level
  updateTaskstatus(path1, itemId: string, statusOpns:string[]) {
    // console.log("itemId",itemId)
    // console.log("item",item)
    // let taskOptions = [];
    // for (let i = 0; i < statusOpns.length; i++) {
    //   taskOptions[i] = {
    //     name: statusOpns[i],
    //   };
    // }
    return this.db
    // console.log("leadOpns",leadOpns)
      .collection(path1)
      .doc(itemId)
      .update({  taskStatusOpn: statusOpns });
  }

}
