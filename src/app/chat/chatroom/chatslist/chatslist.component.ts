// import { C } from '@angular/cdk/keycodes';
import { Component, Input, OnInit,OnChanges, SimpleChanges,ViewChild,ElementRef } from '@angular/core';
import { ChatroomService } from '../chatroom.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { ScrollToBottomDirective } from '../../scroll-to-bottom.directive'
import { CommonService } from 'src/app/common.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-chatslist',
  templateUrl: './chatslist.component.html',
  styleUrls: ['./chatslist.component.scss']
})
export class ChatslistComponent implements OnInit,OnChanges {
  @ViewChild(ScrollToBottomDirective)
  scroll: ScrollToBottomDirective;
  @ViewChild('myList') private myList: ElementRef;
List:any=[]
message:String=""
// ListforMobile:any=[]
// @Input() current:string=""
  networkConnection: boolean;
uid:any="" //user Id
isMobilesize:boolean 
last:any
  mailId: any; // user email
  myUserName: any; // user name
  commonSubscription:Subscription
  chatListSubscription:Subscription
  constructor(public db:ChatroomService,
    public router: Router,
    public networkCheck:NetworkCheckService,
    private common:CommonService
    ) { 
      
     this.commonSubscription=this.common.userDatas.subscribe((data)=>{
       this.isMobilesize=data.isMobileSize
       this.uid=data.userId 
       this.mailId=data.userDetails.email
       this.myUserName=data.userDetails.firstname+" "+(data.userDetails.lastname?data.userDetails.lastname:"")
      })
    
      // reads the chats from db and stores in list
      this.chatListSubscription=this.db.chatList.subscribe((data)=>{
        if(data)
        {
          this.List=data
        // this.scrollToBottom();
        }        
        // this.last=this.List.at(-1)
      })
      
   
  }

  ngOnInit(): void {
    // this.db.userobs.subscribe((user)=>{
    //   console.log(user)
    //   this.uid=user.uid
    // console.log(this.uid)
    // })
    // console.log(this.List)
        this.scrollToBottom();        
    
    
  }
   ngAfterViewChecked() {        
        this.scrollToBottom();        
    } 
  ngOnChanges(changes: SimpleChanges):void{
    // console.log(this.List)
  }
  sendMessage(){
    this.db.sendMessage(this.uid,this.myUserName,this.mailId,this.message)
    this.message=""
  }
onBack(){
    // this.location.back();
    if(this.isMobilesize)
    this.db.getchatofIdsubs.unsubscribe()
    this.router.navigate(['/dash/chat/customers'])
}
 onCheckNetwork() {
    return this.networkConnection = this.networkCheck.onNetworkCheck();
  }
  scrollToBottom() {
    if(this.myList)
 this.myList.nativeElement.scrollTop = this.myList.nativeElement.scrollHeight;
}
keypressevent(event){
// console.log(event.target.value)
}
}
