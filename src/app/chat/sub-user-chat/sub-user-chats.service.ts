import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject,Observable, BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SubUserChatsService {
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


  getchatsofId(uid,id,readStatus){
    if(!!this.getchatofIdsubs)
    {
      this.getchatofIdsubs.unsubscribe()

    }
    const arr=[uid,id]
    const sorted=arr.sort((a, b) => a.localeCompare(b))
    const Id=sorted.join("-")
    this.currentContactuid=id
    this.getchatofIdsubs=this.db.collection("subChats/"+Id+"/conversations",ref=>ref.orderBy('timestamp')).valueChanges().subscribe((data:any)=>{
      this.chatList.next(data)
      if(data.length!=0)
      {
        if(data.at(-1).From!=uid&&readStatus==false){ // if the last message from is not from current id and read status is false update read status to true
        // console.log("lastmessage not from me")
              this.updateReadStatus(uid,id).then(()=>{
              })
            }}
    })
  }
  getunreadNumber(uid){
    return this.db.collection("subChats",ref=>ref.where("searchTerm","array-contains",uid).where("readStatus","==",false).where("lastMessage.From","!=",uid)).valueChanges()
  }
  sendMessage(uid,message){
    const arr=[uid,this.currentContactuid]
    const sorted=arr.sort((a, b) => a.localeCompare(b))
    const Id=sorted.join("-")
    var data={From:uid,To:this.currentContactuid,timestamp:Date.now(),Id:Id,message:message}
    if(this.currentContactuid){
      this.writemessagetochatthread(
        {
         timestamp:Date.now(),
         Id:Id,
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

  message=""
    }

  }
  // getAllchats(){
  //   return this.db.collection("users/"+this.user.uid+"/Chats",ref=>ref.orderBy("timestamp")).valueChanges()
  // }
  getAllchats(uid){

    return this.db.collection("subChats",ref=>ref.where('searchTerm','array-contains',uid).orderBy('timestamp','desc')).valueChanges()

  }
 updateReadStatus(uid,id){
  const arr=[uid,id]
  const sorted=arr.sort((a, b) => a.localeCompare(b))
  const Id=sorted.join("-")
  return this.db.doc("subChats/"+Id).update({readStatus:true})
 }

//   writemessagetoSender(message,recieverEmail){
// return this.db.doc("users/"+this.user.uid+"/chats/"+recieverEmail)
// .update({From:this.user.email,To:recieverEmail,timestamp:Date.now(),Id:this.user.email+''+recieverEmail,message:message})
//   }

  writemessagetochatthread(data){
    // console.log(data)
    // for starting new chat


      return this.db.doc("subChats/"+data.Id)
    .set(data)

    // return this.db.collection("chats/").add(data)
  }
  writemessagetochatdoc(data){
    return this.db.collection("subChats/"+data.Id+"/conversations").add(data)
  }
}
