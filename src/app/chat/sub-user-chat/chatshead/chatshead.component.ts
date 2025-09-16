import { Component, OnInit, Output,EventEmitter, Input, SimpleChanges} from '@angular/core';
import { SubUserChatsService } from '../sub-user-chats.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/common.service';
import { Observable, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
@Component({
  selector: 'app-chatshead2',
  templateUrl: './chatshead.component.html',
  styleUrls: ['./chatshead.component.scss']
})
export class ChatsheadsubComponent implements OnInit {

  @Input() uid:string="" //user Id
  @Input() chatHeads:any // all the chat heads
  current:string="" // selected contact store here for highlighting
  @Output() chatheadClickedevent=new EventEmitter() // when a chat head is clicked an event is triggered to reach the chat component
  isMobilesize: boolean;
  value:string='';
  commonSubscription:Subscription
  myControl = new FormControl('');

  filteredChatHeads: any;//to get filtered customers
  constructor(public db:SubUserChatsService,
    public router: Router,
    private common:CommonService) {
      this.common.userDatas.subscribe((data)=>{
        this.isMobilesize=data.isMobileSize
        this.uid=data.userId;

      })


  }
  ngOnChanges(changes: SimpleChanges) {

    this.filteredChatHeads =this.chatHeads;

}

  ngOnInit(): void {

                //filter section
                this.myControl.valueChanges.subscribe((val) => {

                  this.filteredChatHeads = this.chatHeads.filter(
                    (option) =>
                      (option.identifier)
                        .toLowerCase()
                        .indexOf(val.toLowerCase()) === 0
                  );

                });

              }

  // event emitter
  chatHeadClicked(uid,readStatus,identifier){
    //console.log("chatHeads",this.chatHeads)
    // console.log(uid)
    this.current=uid
    this.chatheadClickedevent.emit({uidOfContact:uid,readStatus:readStatus, contactName:identifier})


  }


}
