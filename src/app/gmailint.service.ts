import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth'
import firebase from 'firebase/app'
import { logging } from 'selenium-webdriver';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
declare var gapi:any

@Injectable({
  providedIn: 'root'
})
export class GmailintService {
  gapi:any
  user$ : any
  googleuser:any;
  calendarList:any;
  constructor(public afAuth:AngularFireAuth,private http: HttpClient) { 
    // this.initClient()
    afAuth.authState.subscribe(data=>{console.log(data)
      this.user$=data.email
    console.log(this.user$)})
    // console.log(this.user$)
    // this.login()
  }



  initClient(){
    gapi.load("client",()=>{
      gapi.client.init({
       apiKey:environment.firebaseConfig.apiKey,
       //  apiKey:"AIzaSyDKxquNFwgTGp4FQxstKtFVqQIfp4ktc0I",
        clientId:environment.clientId,
        discoveryDocs:["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
        "https://gmail.googleapis.com/$discovery/rest?version=v1",
      "https://people.googleapis.com/$discovery/rest?version=v1"],
        scope:" https://mail.google.com/ " 
        //scope:"https://www.googleapis.com/auth/calendar https://mail.google.com/ https://www.googleapis.com/auth/contacts" removing contacts and email scope

       })
       gapi.client.load('calendar','v3',()=>{})
       gapi.client.load('gmail','v1',()=>{})
       gapi.client.load('people','v1',()=>{})
    })
    this.gapi=gapi
   }
   
   checkloginStatus(){
    if(gapi.auth2.getAuthInstance().isSignedIn.get()){
      console.log(gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile())
      return true
    }
    else 
    return false
  }

   async login(){
    //  console.log(this.user$?.email)
    //  var options= new gapi.auth2.SigninOptionsBuilder()
    //  options.setLoginHint(""+this.user$)
   
    if(!this.googleuser)
    {
      const googleauth=gapi.auth2.getAuthInstance()
    const googleUser= await googleauth.signIn(
      {login_hint:""+this.user$}
      )   
    const token= googleUser.getAuthResponse().id_token
    // const credential=firebase.auth.GoogleAuthProvider.credential(token)
    console.log(googleUser)
   this.googleuser=googleUser
  }
  //  await this.afAuth.signInAndRetrieveDataWithCredential(credential)
   
   }

   

  
  
   
logout() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then( ()=> {
    console.log('User signed out.');
    this.googleuser=null
  });
}



}
