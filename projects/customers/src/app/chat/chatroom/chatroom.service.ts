import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { Subject,Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ChatroomService {
  user:any;
  email:Subject<any>=new Subject<any>();
  public emailobs=this.email.asObservable()
  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) { 
    afAuth.authState.subscribe((user) => {this.user = user
      // console.log(this.user.email)
      // console.log(user.uid)
      this.email.next(this.user.email)
    }
      );    
  }
  getchatsofId(id){
    return this.db.collection("chats/"+id+'-'+this.user.email+"/conversations",ref=>ref.orderBy('timestamp')).valueChanges()   
  }
  // getAllchats(){
  //   return this.db.collection("users/"+this.user.uid+"/Chats",ref=>ref.orderBy("timestamp")).valueChanges()
  // }
  getAllchats(){
    return this.db.collection("chats",ref=>ref.where('customer','==',this.user.email).orderBy('timestamp','desc')).valueChanges()

  }
  writemessagetoSender(message,recieverEmail){
return this.db.doc("users/"+this.user.uid+"/chats/"+recieverEmail)
.update({From:this.user.email,To:recieverEmail,timestamp:Date.now(),Id:this.user.email+''+recieverEmail,message:message})
  }
  
  writemessagetochatthread(data){
    // console.log(data)
    return this.db.doc("chats/"+data.To+'-'+data.From)
    .update({zenysUser:data.To,customer:data.From,message:data.message,Id:data.Id,timestamp:data.timestamp,searchTerm:data.searchTerm})
    // return this.db.collection("chats/").add(data)
  }
  writemessagetochatdoc(data){
    return this.db.collection("chats/"+data.To+'-'+data.From+"/conversations").add(data)
  }
}
