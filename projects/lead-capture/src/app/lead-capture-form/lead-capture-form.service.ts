import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LeadCaptureFormService {

  constructor(private db: AngularFirestore,
        private http: HttpClient) { }
  //to call the cloud function to create the contact
  sendHttpRequest(docId: string, formId, form) { 
    return this.http.post(environment.cloudFunctions.leadCaptureForm, {...form, docId:docId, formId:formId})
    }
  //fetch form details from sharedLeadCaptureForms collection
  getDocument(id: string) {
    return this.db.doc<SharedLeadCaptureModel>('sharedLeadCaptureForms/' + id).valueChanges();
  }
}
//Model for creating form object
export class SharedLeadCaptureModel {
  constructor(
    public id: string,
    public superUserId: string,
    public leadCaptureFields: leadCaptureModel[],
    public leadCaptureFormNames: string[],
    public leadCaptureFormTitles: string[],
    public sharedFormIds: string[],
    public sharedFormURLs: string[],
    public logoStatus: boolean[],
    public activeStatus: boolean[],
    public logoUrl: string,
  ) {}
}
//Model for fields stored in the form
export interface leadCaptureModel {
  columnDef: string;
  header: string;
  position: number;
  display: boolean;
  inputType: string;
  categories: string[];
  mandatory: boolean;
  fieldType: string;
  defaultValue: string;
  customField: boolean;
}
