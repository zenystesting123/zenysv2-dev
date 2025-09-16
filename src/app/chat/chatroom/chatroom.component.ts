import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChatroomService } from './chatroom.service';
import { ScrollToBottomDirective } from '../scroll-to-bottom.directive'
import {  Location } from '@angular/common';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { Router } from '@angular/router';
import {CommonService} from '../../common.service'

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit,OnDestroy {
  @ViewChild(ScrollToBottomDirective)
  scroll: ScrollToBottomDirective; //to scroll to the bottom of the chat
  currentChatList:any; // all the chats of the selected contact
  uid:any; //  user id
  message:string="" // message to be send
  chatHeads:Array<any>=[] // all the comtacts 
  allChatcontacts:Array<string>=[] 
  // allChats:any
  // allChatsreversed:any
  currentContactuid:string="" // uid of the selected contact
  currentIdentifier: any=""; // identifier(email or phone number) of the slected contact
  myUsername:string="" // User name
  myMailId: string=""; // user mail Id 
  isMobilesize: boolean; 
  networkConnection: boolean;
  showChatList:boolean=false // used in mobile to show the chat list
  numberofChats:Number=0 //
  currentChatsubscription:any // subscription in chat
  commonSubscription:any
  constructor(public db:ChatroomService,
    private location:Location,
    public networkCheck:NetworkCheckService,
    public router: Router,
    private common:CommonService
    ) {

    
    


  }

  ngOnInit(): void {
    this.commonSubscription=this.common.userDatas.subscribe((data)=>{
      this.isMobilesize=data.isMobileSize
      this.uid=data.userId
      this.myUsername=data.userDetails.firstname+" "+data.userDetails.lastname?data.userDetails.lastname:""
      this.myMailId=data.userDetails.email
      this.db.getAllchats(this.uid).subscribe((data1)=>{        
        this.chatHeads=[]
        this.chatHeads=data1 
        // console.log(this.chatHeads)    
        this.numberofChats=this.chatHeads.filter(ele=>(ele.readStatus==false)&&(ele.lastMessage.From!=this.uid)).length    
        // console.log(this.numberofChats)
      })
    })
  }
  // when a chat head is clicked  the chatlist component emits an event which is triggered here
  chatHeadClicked(event){
    this.currentContactuid=event.uidOfContact
    this.currentIdentifier=event.identifier
    this.currentChatList=[]
    // gets the chat of the specific chat 
    this.currentChatsubscription=this.db.getchatsofId(this.uid,event.uidOfContact,event.identifier,event.readStatus)
    if(this.isMobilesize){
      this.router.navigate(['/chat/chatlist'])
    }
    
  }
  // function to send a message
  sendMessage(){
    // console.log(this.message)
    var data={From:this.uid,To:this.currentContactuid,timestamp:Date.now(),Id:this.uid+'-'+this.currentContactuid,message:this.message}    
    if(this.message!=""&&this.currentIdentifier=="")
    {
      // this.currentChatList.push(data)
      // write the data to chat thread and then to conversation
      this.db.writemessagetochatthread(data).then(()=>{
        this.db.writemessagetochatdoc(data).then(()=>{
          
          // console.log("message send")
          })
      })
      // .then(()=>{})
  }if(this.message!=""&&this.currentIdentifier!=""){
     this.db.writemessagetochatthread(
       {
         zenysUserUid:this.uid,
        zenysUsername:this.myUsername,
        zenysUserEmail:this.myMailId,
        customerUid:this.currentContactuid,
        customerEmail:this.currentIdentifier.email,
        customerName:this.currentIdentifier.name,
        timestamp:Date.now(),
        Id:this.uid+'-'+this.currentContactuid,
        lastMessage:
        { From:this.uid,
          To:this.currentContactuid,
          message:this.message
        },
        readStatus:false,
        searchTerm:[this.uid,this.currentContactuid]
        }).then(()=>{
          this.db.writemessagetochatdoc(data).then(()=>{
            
            // console.log("message send")
            })
        })
  }
  this.message=""
  }
  // back button
  onBack(){
    if(this.showChatList){ // triggers if mobile
      this.showChatList=false;
      this.db.getchatofIdsubs.unsubscribe()
    }
    else // triggers if not mobile
    this.location.back();
  }
  onCheckNetwork() {
    return this.networkConnection = this.networkCheck.onNetworkCheck();
  }
  @HostListener('window:beforeunload')
  ngOnDestroy(): void {    
    if(!this.isMobilesize)
    if(this.db.getchatofIdsubs)
    this.db.getchatofIdsubs.unsubscribe()
  }
  

}
