// import { C } from '@angular/cdk/keycodes';
import { Component, Input, OnInit,OnChanges, SimpleChanges } from '@angular/core';
import { ChatroomService } from '../chatroom.service';


@Component({
  selector: 'app-chatslist',
  templateUrl: './chatslist.component.html',
  styleUrls: ['./chatslist.component.scss']
})
export class ChatslistComponent implements OnInit,OnChanges {
@Input() List:any=[]
emailId:any=""
  constructor(public db:ChatroomService) { 
   
   
  }

  ngOnInit(): void {
    console.log(this.List)
    this.db.email.subscribe((email)=>{
      this.emailId=email
    // console.log(this.emailId)
    })
  }
  ngOnChanges(changes: SimpleChanges):void{
    // console.log(this.List)
  }

}
