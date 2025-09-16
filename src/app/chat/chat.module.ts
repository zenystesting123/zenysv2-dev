import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatroomComponent } from './chatroom/chatroom.component';
import { ChatslistComponent } from './chatroom/chatslist/chatslist.component';
import { ChatsheadComponent } from './chatroom/chatshead/chatshead.component';
import { ChatsheadsubComponent } from './sub-user-chat/chatshead/chatshead.component';
// import { SendbuttonComponent } from './chatroom/sendbutton/sendbutton.component'
import { ScrollToBottomDirective } from './scroll-to-bottom.directive';
import { SubUserChatComponent } from './sub-user-chat/sub-user-chat.component';
import { ChatlistComponent } from './sub-user-chat/chatlist/chatlist.component';
import { FullchatComponent } from './fullchat/fullchat.component';


@NgModule({
  declarations: [ChatroomComponent, ChatslistComponent, ChatsheadComponent,  ScrollToBottomDirective, SubUserChatComponent, ChatlistComponent, FullchatComponent,ChatsheadsubComponent],
  imports: [
    // CommonModule,
    ChatRoutingModule,
    SharedModule
  ]
})
export class ChatModule { }
