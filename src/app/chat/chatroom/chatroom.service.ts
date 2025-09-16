import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Subject,Observable, BehaviorSubject } from 'rxjs';
import { FLAG_UNRESTRICTED } from 'html2canvas/dist/types/css/syntax/tokenizer';
import {CommonService} from '../../common.service'

@Injectable({
  providedIn: 'root'
})
export class ChatroomService {
  chatList=new BehaviorSubject(null)
  // userobs=new BehaviorSubject<any>(null);
  // uid:any;
  public chatListforMobile:any
  public chatcurrentforMobile:any
  getchatofIdsubs: any;
  currentContactuid:any;
  currentIdentifier:any;
  // myUsername: any;
  // myMailId: any;
  // public userobs=this.user.asObservable()
  constructor( private db: AngularFirestore) { 
        
  }
  getChatDocument(uid,id){
    return this.db.doc("chats/"+uid+'-'+id).valueChanges()
  }
  
  getchatsofId(uid,id,identifier,readStatus){
    if(!!this.getchatofIdsubs){
      this.getchatofIdsubs.unsubscribe()
    }
    this.currentContactuid=id
    this.currentIdentifier=identifier
    this.getchatofIdsubs=this.db.collection("chats/"+uid+'-'+id+"/conversations",ref=>ref.orderBy('timestamp')).valueChanges().subscribe((data:any)=>{
      this.chatList.next(data)
      // console.log(data)
      if(data.at(-1).From!=uid&&readStatus==false){
        // console.log("lastmessage not from me")
              this.updateReadStatus(uid,id).then(()=>{
                // console.log("updated")
              })
            }
    })   
  }
  getunreadNumber(uid){
    return this.db.collection("chats",ref=>ref.where("zenysUserUid","==",uid).where("readStatus","==",false).where("lastMessage.From","!=",uid)).valueChanges()
  }
  sendMessage(uid,myUserName,myMailId,message){
    // console.log(message)
    var data={From:uid,To:this.currentContactuid,timestamp:Date.now(),Id:uid+'-'+this.currentContactuid,message:message}    
    if(message!=""&&this.currentIdentifier=="")
    {
      // this.currentChatList.push(data)
      this.writemessagetochatthread(data).then(()=>{
        this.writemessagetochatdoc(data).then(()=>{
          
          // console.log("message send")
          })
      })
      // .then(()=>{})
  }if(message!=""&&this.currentIdentifier!=""){
     this.writemessagetochatthread(
       {
         zenysUserUid:uid,
        zenysUsername:myUserName,
        zenysUserEmail:myMailId,
        customerUid:this.currentContactuid,
        customerEmail:this.currentIdentifier.email,
        customerName:this.currentIdentifier.name,
        timestamp:Date.now(),
        Id:uid+'-'+this.currentContactuid,
        lastMessage:
        { From:uid,
          To:this.currentContactuid,
          message:message
        },
        readStatus:false,
        searchTerm:[uid,this.currentContactuid]
        }).then(()=>{
          this.writemessagetochatdoc(data).then(()=>{
            
            // console.log("message send")
            })
        })
  }
  message=""
  }
  // getAllchats(){
  //   return this.db.collection("users/"+this.user.uid+"/Chats",ref=>ref.orderBy("timestamp")).valueChanges()
  // }
  getAllchats(uid){
    return this.db.collection("chats",ref=>ref.where('zenysUserUid','==',uid).orderBy('timestamp','desc')).valueChanges()

  }
 updateReadStatus(uid,id){
   return this.db.doc("chats/"+uid+'-'+id).update({readStatus:true})
 }
  
//   writemessagetoSender(message,recieverEmail){
// return this.db.doc("users/"+this.user.uid+"/chats/"+recieverEmail)
// .update({From:this.user.email,To:recieverEmail,timestamp:Date.now(),Id:this.user.email+''+recieverEmail,message:message})
//   }
  
  writemessagetochatthread(data){
    // console.log(data)
    // for starting new chat
    if(data.zenysUserUid){
      return this.db.doc("chats/"+data.From+'-'+data.To).update({
        data
      })
    }
    // for existing chats
    else
    {
      return this.db.doc("chats/"+data.From+'-'+data.To)
    .update({lastMessage:{From:data.From,To:data.To,message:data.message},timestamp:data.timestamp,readStatus:false})
  }
    // return this.db.collection("chats/").add(data)
  }
  writemessagetochatdoc(data){
    return this.db.collection("chats/"+data.From+'-'+data.To+"/conversations").add(data)
  }
}
