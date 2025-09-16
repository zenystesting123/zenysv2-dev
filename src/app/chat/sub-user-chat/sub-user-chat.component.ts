import { ChangeDetectorRef, Component, HostListener,OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ScrollToBottomDirective } from '../scroll-to-bottom.directive'
import {  Location } from '@angular/common';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { Router } from '@angular/router';
import {CommonService} from '../../common.service'
import {SubUserChatsService} from './sub-user-chats.service'



@Component({
  selector: 'app-sub-user-chat',
  templateUrl: './sub-user-chat.component.html',
  styleUrls: ['./sub-user-chat.component.scss']
})
export class SubUserChatComponent implements OnInit,OnDestroy {
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
  superUserId: string;
  subUsers: any={}
  allsubUserIds: any=[];
  allusedSubusers: any=[];
  currentChatUser: any ='';
  constructor(public db:SubUserChatsService,
    private location:Location,
    public networkCheck:NetworkCheckService,
    public router: Router,
    private common:CommonService,
    private ref: ChangeDetectorRef
    ) {

      /*
      subUsers={
        subuserid:{
          email:subuseremail,
          identifier:subuser name
          userId:subuserID
        }
      }

      */
      this.commonSubscription=this.common.userDatas.subscribe((data)=>{
        this.uid=data.userId
        this.allsubUserIds=[]
        data.subUsers.forEach((data)=>{
          this.subUsers[data.userId]= {
            email:data.email,
            identifier:data.firstname+" "+(data.lastname?data.lastname:""),
            userId:data.userId
          }
          this.allsubUserIds.push(data.userId)
        })
        this.allsubUserIds.push(data.superUserDetails.superUserId)
        this.subUsers[data.superUserDetails.superUserId]={
          email:data.superUserDetails.email,
          identifier:data.superUserDetails.firstname+" "+(data.superUserDetails.lastname?data.superUserDetails.lastname:""),
          userId:data.superUserDetails.superUserId
        }
        // console.log(this.subUsers)
        this.isMobilesize=data.isMobileSize
        // this.myUsername=data.userDetails.firstname+" "+data.userDetails.lastname?data.userDetails.lastname:""
        // this.myMailId=data.userDetails.email
        // this.superUserId=data.superUserDetails.id
        this.db.getAllchats(this.uid).subscribe((data1)=>{
          this.chatHeads=[]
          data1.forEach((ele:any)=>{
            const userId=(ele.searchTerm[0]!=this.uid)?ele.searchTerm[0]:ele.searchTerm[1]//to find the id of the user other than the current logged inuser
            this.allusedSubusers.push(userId) // all subusers ids with chat history
            this.chatHeads.push({...ele,...this.subUsers[userId]})
          })
          const unusedSubs=this.allsubUserIds.filter(ele=>(!this.allusedSubusers.includes(ele)&&(ele!=this.uid)))
          unusedSubs.forEach((ele)=>{
            this.chatHeads.push({...this.subUsers[ele]})
          })
          // console.log(this.chatHeads)
          // console.log(this.chatHeads)
          this.numberofChats=this.chatHeads.filter(ele=>(ele.readStatus==false)&&(ele.lastMessage.From!=this.uid)).length
          // console.log(this.numberofChats)
        })
      })


  }

  ngOnInit(): void {

  }
  // when a chat head is clicked  the chatlist component emits an event which is triggered here
  chatHeadClicked(event){
this.currentChatUser = event.contactName;
    this.currentContactuid=event.uidOfContact
    this.currentIdentifier=event.identifier
    this.currentChatList=[]
    // gets the chat of the specific chat
    this.currentChatsubscription=this.db.getchatsofId(this.uid,event.uidOfContact,event.readStatus)
    if(this.isMobilesize){
      this.router.navigate(['/chat/subChatList'])
    }

  }
  // function to send a message

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
