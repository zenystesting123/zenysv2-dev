import { Component, OnInit, Output,EventEmitter, Input} from '@angular/core';
import { ChatroomService } from '../chatroom.service';


@Component({
  selector: 'app-chatshead',
  templateUrl: './chatshead.component.html',
  styleUrls: ['./chatshead.component.scss']
})
export class ChatsheadComponent implements OnInit {
  emailId:string=""
  @Input() chatHeads:any
  current:string=""
  @Output() chatheadClickedevent=new EventEmitter()
  constructor(public db:ChatroomService) { 
    // console.log(this.chatHeads)
  }

  ngOnInit(): void {
    this.db.email.subscribe((email)=>{
      this.emailId=email
    // console.log(this.emailId)
   
    })
    
  }
  chatHeadClicked(emailId){
    this.current=emailId
    this.chatheadClickedevent.emit({emailIdOfContact:emailId})
  }

}
