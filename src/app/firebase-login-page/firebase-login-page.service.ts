import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Gallery, Profile } from 'projects/customers/src/app/data-models';

@Injectable({
  providedIn: 'root'
})
export class FirebaseLoginPageService {

  constructor(private db: AngularFirestore) { }
  getProfile(path1,itemId:string) {
    return this.db.collection(path1).doc<Profile>(itemId).valueChanges();
  }
  createProfile(id:string){
    this.db.collection("users/").doc(id).update({publicProfCreated:true,publicProfileActv:true});
  
  }
  createCustomFieldNames(fieldNames,uid){

    return this.db.collection('users/').doc(uid).set({fieldNames : fieldNames}, { merge: true });
   }
   create(newtemplate,uid){
    // return this.db.collection('users/' + uid + '/profilesDefault').add({...newtemplate});
    return this.db.collection('users').doc(uid).collection('profilesDefault').add({...newtemplate});
  }
  getServices(userId:string){
    return this.db.collection('public-profile/'+userId+'/profileServices',ref=>ref.orderBy('date',"desc")).snapshotChanges(); 
  }
  getGallery(id){
    return this.db.collection<Gallery>('public-profile/' + id +'/gallery',ref=>ref.orderBy('date',"desc")).snapshotChanges();
  }
  getProfileImages(id){
  
    return this.db.collection<Gallery>('public-profile/' + id +'/profile-Images',ref=>ref.orderBy('date',"desc")).snapshotChanges();
  }
  createService(id:string,date,form){
    // console.log(id)
    this.db.collection("public-profile/"+id+"/profileServices/").add({...form,date:date});
  }

  publicProfile(id:string,form,userId,date){
    this.db.collection("public-profile/").doc(id).set({...form,userId:userId,updateDate:date,createDate:date,
      avgCustReviews:0,totalCustReviews:0,publicProfileActv:true});
  }
  createProfileValues(id:string,publicProfileId,profileFirstname, profileLastname,code,profilePhone,profileCompany, profileCategory,date,saleStatus,customerStatus,plan,freeDateend,customerStatusOpn,saleStatusOpn,custLeadOpn,custLead,userEmail){
   return this.db.collection("users/").doc(id).set({
      
      'publicProfileID': publicProfileId, 'firstname': profileFirstname, 'lastname': profileLastname,'countryCode':code, 'phone': profilePhone, 'company': profileCompany, 'category': profileCategory,
      'leadPoints': 10000, 'leadSharedRating': 3, 'noOfRatingReceived': 0, 'printTemplate': 'template1', 'usertype': 'Master', 'masterId': null, 'saleField1Name': '', 'saleField2Name': '', 'saleField3Name': '', 'saleField4Name': '',
      'custField1Name': '', 'custField2Name': '', 'custField4Name': '', 'custField3Name': '', 'custCategory1Name': '', 'custCategory2Name': '', 'saleCategory1Name': '', 'saleCategory2Name': '', 'custCategory2Opn': '', 'custCategory1Opn': '', 'saleCategory2Opn': '', 'saleCategory1Opn': '',
      'custCategory1Check': false, 'custCategory2Check': false, 'custField2Check': false, 'custField1Check': false, 'custField3Check': false, 'custField4Check': false,
      'saleCategory1Check': false, 'saleCategory2Check': false, 'saleField1Check': false, 'saleField2Check': false, 'saleField3Check': false, 'saleField4Check': false, 'dataAccessRule': 'All', 'superUserId': id,
      'userRole': 'NA', 'accountType': 'SuperUser', 'plan': plan, 'planPricing': 'NA', 'planCurrency': 'NA', 'validityStart': 'NA', 'validityEnd': freeDateend, 'createdDate': date, 'existingUser': true, 'custLeadOpn':  custLeadOpn, 'custLead': custLead, 'custLeadCheck': true,
      'bankDetails': '', 'gstnumber': '', 'estimateNote': '', 'invoiceNote': '', 'quotationNote': '', 'currency': 'INR', 'taxType': 'gst', 'isFirstTimeUser': true, 'email': userEmail, 'totalAttachmentsSize': 0, 'publicProfCreated': true, 'publicProfileActv': true,
      'zenysCustId': id,'noSubusers':0
    });
  }
  publicProfileUpdate(id:string,form,userId,date){
    return this.db.collection("public-profile/").doc(id).update({...form,userId:userId,updateDate:date,createDate:date,
      avgCustReviews:0,totalCustReviews:0,publicProfileActv:true});
  }
  updatePublicProfile(id:string,form,userId,date){
 
    this.db.collection("public-profile/").doc(id).update({...form,userId:userId,updateDate:date});
  }
  getpublicProf(id){
    return this.db.doc<Profile>('public-profile/' + id ).valueChanges();
  }
  dpTrue(id){

    this.db.collection('public-profile/' ).doc(id).update( { dpImage:true })
  }
  updateProfileActv(id,state){

    this.db.collection('public-profile/' ).doc(id).update( { publicProfileActv:state })
  }
  createProfileImage(profileId,thumbnails,thumbnail,thumbnailMob,datePlaced,templatePath2,templatePath,templateMob,no){
  
    this.db.collection('public-profile/' + profileId + '/profile-Images/' ).doc(no).set( { downloadURL: thumbnails,thumbnailURL:thumbnail,thumbnailMob:thumbnailMob, date:datePlaced,path:templatePath2,templatePath:templatePath,pathMob:templateMob,imageNumber:no })
  }
  ProfileImage1(profileId,thumbnail){
  
    this.db.collection('public-profile/').doc(profileId). update( { profImage1:thumbnail})
  }
  ProfileImage2(profileId,thumbnail){
  
    this.db.collection('public-profile/').doc(profileId).update( { profImage2:thumbnail})
  }
  ProfileImage3(profileId,thumbnail){
  
    this.db.collection('public-profile/').doc(profileId).update( { profImage3:thumbnail})
  }
  ProfileImage1Set(profileId,thumbnail){
  
    this.db.collection('public-profile/').doc(profileId). set( { profImage1:thumbnail})
  }
  ProfileImage2Set(profileId,thumbnail){
  
    this.db.collection('public-profile/').doc(profileId).set( { profImage2:thumbnail})
  }
  ProfileImage3Set(profileId,thumbnail){
  
    this.db.collection('public-profile/').doc(profileId).set( { profImage3:thumbnail})
  }

}
