import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatroomService } from '../chatroom/chatroom.service';
import { SubUserChatsService } from '../sub-user-chat/sub-user-chats.service';
import { CommonService } from 'src/app/common.service';
@Component({
  selector: 'app-fullchat',
  templateUrl: './fullchat.component.html',
  styleUrls: ['./fullchat.component.scss']
})
export class FullchatComponent implements OnInit {
  demo1TabIndex: number;
unreadChatCountCustomer:number=0;
unreadChatCountSubUsers:number=0;
  unreadChatSubs: any;
  unreadChatSubs2: any;

  constructor(
    private route: ActivatedRoute,
    private chatRoom:ChatroomService,
    private chatRoom2:SubUserChatsService,
    private commonService:CommonService

  ) { 
    this.commonService.userDatas.subscribe((data)=>
    {this.unreadChatSubs=this.chatRoom.getunreadNumber(data.userId).subscribe((data)=>{
      this.unreadChatCountCustomer=data.length
    })
    this.unreadChatSubs2=this.chatRoom2.getunreadNumber(data.userId).subscribe((data)=>{
      this.unreadChatCountSubUsers=data.length

    })
  })
    this.route.params.subscribe((val)=>{
      if(val.type){
        if(val.type=="team"){
    this.demo1TabIndex=1
        }
        else if(val.type=="customers"){
    this.demo1TabIndex=0
        }
      }
    })
  }

  ngOnInit(): void {
  }

}
