import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatroomService } from './chatroom.service';
import { ScrollToBottomDirective } from '../scroll-to-bottom.directive'

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit {
  @ViewChild(ScrollToBottomDirective)
  scroll: ScrollToBottomDirective;
  currentChatList:any;
  emailId:any;
  message:string=""
  chatHeads:Array<any>=[]
  allChatcontacts:Array<string>=[]
  allChats:any
  allChatsreversed:any
  currentContact:string
  constructor(public db:ChatroomService) {
    this.db.emailobs.subscribe((data)=>{
      this.emailId=data
      this.db.getAllchats().subscribe((data1)=>{
        this.allChatcontacts=[]
        this.chatHeads=data1
        // console.log(this.chatHeads)
      })
     
    })
    


  }

  ngOnInit(): void {
  }
  chatHeadClicked(event){
    // console.log(event)
    this.currentContact=event.emailIdOfContact
    // this.currentChatList=this.allChats.filter((message:any)=>message.Id==event.emailIdOfContact+''+this.emailId||message.Id==this.emailId+''+event.emailIdOfContact)
    // this.currentChatList.reverse()
    this.db.getchatsofId(event.emailIdOfContact).subscribe((data)=>{
      // console.log("Heloo")      
        // console.log(data)
        this.currentChatList=data
        // console.log(this.currentChatList)
      }) 
  }
  sendMessage(){
    // console.log(this.message)
    var data={From:this.emailId,To:this.currentContact,timestamp:Date.now(),Id:this.currentContact+'-'+this.emailId,message:this.message,searchTerm:[this.currentContact,this.emailId]}
    if(this.message!="")
    {
      
      this.db.writemessagetochatthread(data).then(()=>{
        this.db.writemessagetochatdoc(data)
      })
    this.message=""
  }
  }

}
