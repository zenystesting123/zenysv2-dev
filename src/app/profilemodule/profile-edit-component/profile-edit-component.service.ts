import { Gallery, Profile } from './../../data-models';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProfileEditComponentService {

  constructor(private db: AngularFirestore) { }
  //for getting profile details
  getProfile(path1, itemId: string) {
    return this.db.collection(path1).doc<Profile>(itemId).valueChanges();
  }
  //update that profile is created in user level
  createProfile(id: string) {
    this.db.collection("users/").doc(id).update({ publicProfCreated: true, publicProfileActv: true });

  }
  //getting services
  getServices(userId: string) {
    return this.db.collection('public-profile/' + userId + '/profileServices', ref => ref.orderBy('date', "desc")).snapshotChanges();
  }
  //getting gallery
  getGallery(id) {
    return this.db.collection<Gallery>('public-profile/' + id + '/gallery', ref => ref.orderBy('date', "desc")).snapshotChanges();
  }
  //getting profile images
  getProfileImages(id) {
    return this.db.collection<Gallery>('public-profile/' + id + '/profile-Images', ref => ref.orderBy('date', "desc")).snapshotChanges();
  }
  //creating public profile
  publicProfile(id: string, form, userId, date) {
    return this.db.collection("public-profile/").doc(id).set({
      ...form, userId: userId, updateDate: date, createDate: date,
      avgCustReviews: 0, totalCustReviews: 0, publicProfileActv: true
    });
  }
  //for updating profile including images
  publicProfileUpdate(id: string, form, userId, date, img1, img2, img3) {
    this.db.collection("public-profile/").doc(id).update({
      ...form, userId: userId, updateDate: date, createDate: date,
      avgCustReviews: 0, totalCustReviews: 0, publicProfileActv: true, profImage1: img1, profImage2: img2, profImage3: img3
    });
  }
  //for updating profile
  updatePublicProfile(id: string, form, userId, date) {

    this.db.collection("public-profile/").doc(id).update({ ...form, userId: userId, updateDate: date });
  }
  //update profile as dp is uploaded
  dpTrue(id) {
    this.db.collection('public-profile/').doc(id).update({ dpImage: true })
  }
  //update profile as profile activated
  updateProfileActv(id, state) {

    this.db.collection('public-profile/').doc(id).update({ publicProfileActv: state })
  }
  createProfileImage(profileId, thumbnails, thumbnail, thumbnailMob, datePlaced, templatePath2, templatePath, templateMob, no) {

    this.db.collection('public-profile/' + profileId + '/profile-Images/').doc(no).set({ downloadURL: thumbnails, thumbnailURL: thumbnail, thumbnailMob: thumbnailMob, date: datePlaced, path: templatePath2, templatePath: templatePath, pathMob: templateMob, imageNumber: no })
  }
  //update profile image 1 if profile is already created
  ProfileImage1(profileId, thumbnail) {

    this.db.collection('public-profile/').doc(profileId).update({ profImage1: thumbnail })
  }
  //update profile image 2 if profile is already created
  ProfileImage2(profileId, thumbnail) {

    this.db.collection('public-profile/').doc(profileId).update({ profImage2: thumbnail })
  }
  //update profile image 3 if profile is already created
  ProfileImage3(profileId, thumbnail) {

    this.db.collection('public-profile/').doc(profileId).update({ profImage3: thumbnail })
  }
  //set profile image 1 if no profile created
  ProfileImage1Set(profileId, thumbnail) {

    this.db.collection('public-profile/').doc(profileId).set({ profImage1: thumbnail })
  }
  //set profile image 2 if no profile created
  ProfileImage2Set(profileId, thumbnail) {

    this.db.collection('public-profile/').doc(profileId).set({ profImage2: thumbnail })
  }
  //set profile image 3 if no profile created
  ProfileImage3Set(profileId, thumbnail) {

    this.db.collection('public-profile/').doc(profileId).set({ profImage3: thumbnail })
  }

}
