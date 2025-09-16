import { Component, Input, OnInit,OnChanges, SimpleChanges,ViewChild,ElementRef, Renderer2 } from '@angular/core';
import {SubUserChatsService} from '../sub-user-chats.service'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { NetworkCheckService } from 'src/app/networkcheck.service';
import { ScrollToBottomDirective } from '../../scroll-to-bottom.directive'
import { CommonService } from 'src/app/common.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-chatlist',
  templateUrl: './chatlist.component.html',
  styleUrls: ['./chatlist.component.scss']
})
export class ChatlistComponent implements OnInit {

  @ViewChild(ScrollToBottomDirective)
  scroll: ScrollToBottomDirective;
  @ViewChild('myList1') private myList1: ElementRef;
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
  constructor(public db:SubUserChatsService,
    public router: Router,
    public networkCheck:NetworkCheckService,private renderer2: Renderer2,
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
          // console.log(this.List)
        // this.scrollToBottom();
        }
        // this.last=this.List.at(-1)
      })
      this.scrollToBottom();

  }
  //private unlistener: () => void;

  ngOnInit(): void {
    // this.db.userobs.subscribe((user)=>{
    //   console.log(user)
    //   this.uid=user.uid
    // console.log(this.uid)
    // })
    // console.log(this.List)
    /*this.unlistener = this.renderer2.listen("chatText", "keydown", event => {
      console.log("Key down event");
    });*/
    //const ele = document.getElementById('chatText');

/*ele.addEventListener('keydown', function (e) {
    // Get the code of pressed key
    const keyCode = e.which || e.keyCode;

    // 13 represents the Enter key
    if (keyCode === 13 && !e.shiftKey) {
        // Don't generate a new line
        e.preventDefault();

        // Do something else such as send the message to back-end
        // ...
    }
});*/

  }
   ngAfterViewChecked() {
        this.scrollToBottom();
    }
  ngOnChanges(changes: SimpleChanges):void{
    // console.log(this.List)
  }
  sendMessage(){
    // console.log(this.message)
    this.db.sendMessage(this.uid,this.message)
    this.message=""
  }
onBack(){
    // this.location.back();
    if(this.isMobilesize){
      if(this.db.getchatofIdsubs){
        this.db.getchatofIdsubs.unsubscribe()
      }
    }
    this.router.navigate(['/dash/chat/team'])
}
 onCheckNetwork() {
    return this.networkConnection = this.networkCheck.onNetworkCheck();
  }
  scrollToBottom() {
    if(this.myList1)
 this.myList1.nativeElement.scrollTop = this.myList1.nativeElement.scrollHeight;
}
keypressevent(event){
//console.log(event)
if(event.keyCode == 13 && !event.shiftKey){
  event.preventDefault();
  if(this.message){
    console.log("Message length", this.message.length, this.message, this.uid)
    this.sendMessage();
  }


}
}
}
