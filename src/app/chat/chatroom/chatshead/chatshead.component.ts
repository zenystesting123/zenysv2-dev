import { Component, OnInit, Output,EventEmitter, Input} from '@angular/core';
import { ChatroomService } from '../chatroom.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/common.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-chatshead',
  templateUrl: './chatshead.component.html',
  styleUrls: ['./chatshead.component.scss']
})
export class ChatsheadComponent implements OnInit {
  @Input() uid:string="" //user Id
  @Input() chatHeads:any // all the chat heads
  current:string="" // selected contact store here for highlighting
  @Output() chatheadClickedevent=new EventEmitter() // when a chat head is clicked an event is triggered to reach the chat component
  isMobilesize: boolean;
  commonSubscription:Subscription
  constructor(public db:ChatroomService,
    public router: Router,
    private common:CommonService) {
      this.common.userDatas.subscribe((data)=>{
        this.isMobilesize=data.isMobileSize
        this.uid=data.userId
      }) 
      

  }

  ngOnInit(): void {
    
  }
  // event emitter
  chatHeadClicked(uid,identifier,readStatus){
    
    this.current=uid
    this.chatheadClickedevent.emit({uidOfContact:uid,identifier:identifier,readStatus:readStatus})
    

  }
  

}
