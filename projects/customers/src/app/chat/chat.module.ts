import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatroomComponent } from './chatroom/chatroom.component';
import { ChatslistComponent } from './chatroom/chatslist/chatslist.component';
import { ChatsheadComponent } from './chatroom/chatshead/chatshead.component';
import { SendbuttonComponent } from './chatroom/sendbutton/sendbutton.component';
import { ScrollToBottomDirective } from './scroll-to-bottom.directive';


@NgModule({
  declarations: [ChatroomComponent, ChatslistComponent, ChatsheadComponent, SendbuttonComponent, ScrollToBottomDirective],
  imports: [
    // CommonModule,
    ChatRoutingModule,
    SharedModule
  ]
})
export class ChatModule { }
