import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatroomComponent } from './chatroom/chatroom.component';
import { ChatslistComponent } from './chatroom/chatslist/chatslist.component';
import { ChatlistComponent } from './sub-user-chat/chatlist/chatlist.component';
import { FullchatComponent } from './fullchat/fullchat.component';
// import{}

const routes: Routes = [
  {
    path:'',
    component:FullchatComponent,
    data:{
      animation:'Chat'
    }
  },
  {
    path:'chatlist',
    component:ChatslistComponent
  },
  {
    path:'subChatList',
    component:ChatlistComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
