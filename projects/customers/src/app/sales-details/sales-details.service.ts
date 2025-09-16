import { Profile , PaymentReceipt,Sales, SalesNotes } from './../data-models';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class SalesDetailsService {

  constructor(private db: AngularFirestore) { }

  //read the sale document
    getSale(saleId:string,userId:string){
      return this.db.doc<Sales>('users/' + userId + '/sales/'+ saleId).valueChanges();
    }
    getNew(path1,itemId:string) {
      return this.db.collection(path1).doc<Profile>(itemId).valueChanges();
    }
    updateSaleCategory1(id:string,sid:string,value:any){
      return this.db.doc('users/' + id + '/sales/' + sid).update({saleCategory1:value});
    } 
    updateSaleCategory2(id:string,sid:string,value:any){
      return this.db.doc('users/' + id + '/sales/' + sid).update({saleCategory2:value});
    } 
    getQuotations(userId:string,saleId:string){
      return this.db.collection('users/'+userId+'/Quotations' ,ref=>ref.where('docData.saleID','==',saleId)).snapshotChanges(); 
    }
    getEstimates(userId:string,saleId:string){
      return this.db.collection('users/'+userId+'/Estimates' ,ref=>ref.where('docData.saleID','==',saleId)).snapshotChanges(); 
    }
    getAttachments(userId:string,saleId:string){
      return this.db.collection('users/'+userId+'/sales/'+saleId+'/attachments' ,ref=>ref.orderBy('date',"desc")).snapshotChanges(); 
    }
    getPaymentReceipt(id:string,saleId:string){
      return this.db.collection<PaymentReceipt>('users/' + id +'/paymentsreceived',ref=>ref.where('saleid','==',saleId)).snapshotChanges();
    }
    attachmentsToCollection(id,cid,sid,name,url,path,date,size){
      this.db.collection('users/' + id + '/sales/' + sid +'/attachments').add( { customername:"customer" ,fileName:name,downloadURL:url,path:path,date:date,size:size,shareStatus:true })
    }
    getInvoices(id:string, saleId:string){
      return this.db.collection('users/'+id+'/Invoices',ref=>ref.where('docData.saleID','==',saleId)).snapshotChanges(); 
    }
    getUsers(id){
      return this.db.doc<any>('users/' + id).valueChanges();
    }
    getQuotationssubUser(userId:string,saleId:string,subid){
      return this.db.collection('users/'+userId+'/Quotations' ,ref=>ref.where('docData.saleID','==',saleId).where('createdBy','==',subid)).snapshotChanges(); 
    }
    getEstimatessubUser(userId:string,saleId:string,subid){
      return this.db.collection('users/'+userId+'/Estimates' ,ref=>ref.where('docData.saleID','==',saleId).where('createdBy','==',subid)).snapshotChanges(); 
    }
    getInvoicessubUser(id:string, saleId:string,subid){
      return this.db.collection('users/'+id+'/Invoices',ref=>ref.where('docData.saleID','==',saleId).where('createdBy','==',subid)).snapshotChanges(); 
    }
    writeNote(form, createdById: string, createdDate: any, saleId: string, cratedByName: string) {
      this.db.collection('users/' + createdById + '/sales/' + saleId + '/Notes').add({
        ...form, createdById: createdById, createdDate: createdDate, cratedByName: cratedByName
      })
    }
    updateSize(id:any,size:any){
  
      return this.db.doc('users/' + id ).update({'totalAttachmentsSize':size});
    }
    readNote(saleId: string, uId: string,) {
      return this.db.collection<SalesNotes>('users/' + uId + '/sales/' + saleId + '/Notes', ref => ref.orderBy("createdDate", "desc")).snapshotChanges();
    }
    getTasks(id: string,uid:string, saleId,rule,account,lastStatus) {
      if( account== "SuperUser"){
        
        return this.db.collection('users/' + id + '/tasks', ref => ref.where('saleId', '==', saleId).where('status', '!=', lastStatus)).snapshotChanges();
      }
      else{
        if(rule=="All"){
    
          return this.db.collection('users/' + id + '/tasks', ref => ref.where('saleId', '==', saleId).where('status', '!=', lastStatus)).snapshotChanges();
        }
        else{
  
          return this.db.collection('users/' + id + '/tasks', ref => ref.orderBy('date', "desc").where('status','!=',lastStatus).where('saleId','==',saleId)
          .where('assignedTo','==',uid)).snapshotChanges();
        }
      }
     
    }
  // share attachments
  
  // share document
  initshareinvoice(data){
    console.log(data)
    return this.db.doc("shared/"+data.saleID).set(data)
  }
  getsharedwithid(saleId){
    return this.db.doc<any>("shared/"+saleId).get()
  }
  addinvoicetoshare(saleId,id){
      return this.db.doc("shared/"+saleId+"/Attachments/"+id).set({attachmentId:id,shareDate:Date.now()})
  }
  saveSharedinUser(userid,data){
    return this.db.doc("users/"+userid+"/shared/"+data.saleID).set(data)
  }
  togglesharestatus(userid,id,saleid,shareStatus){
    return this.db.doc("users/"+userid+"/sales/"+saleid+"/attachments/"+id).update({shareStatus:shareStatus})
  }
  getCustdetails(userId:string,customerId:string){
    return this.db.doc<any>('users/' + userId + '/customers/'+ customerId).get();
  }
  
  sendEmail(data){
    return this.db.collection("email/").add(data)
  }
  getuserfromShared(saleId){
    return this.db.doc("shared/"+saleId).valueChanges()
  }
  
  
}
