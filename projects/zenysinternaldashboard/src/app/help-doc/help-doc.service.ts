import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class HelpDocService {

  constructor(private db:AngularFirestore) { }
      // to get help video from resources corresponding to page
    getHelpVideos(page){
      return  this.db
        .collection('help/resources/videos', (ref) =>
          ref
            .where('page', '==', page)
        )
        .snapshotChanges()
    }
      // to get help topics from resources corresponding to page
      getHelpTopics(page){
        return  this.db
          .collection('help/resources/helpTopics', (ref) =>
            ref
              .where('page', '==', page)
          )
          .snapshotChanges()
      }
      // save help topics
      saveHelpTopics(helpTopic, pageQuerying){
        return this.db.collection('help/resources/helpTopics/').doc(pageQuerying).set({
          helpTopic : helpTopic,
          page : pageQuerying
        }, { merge: true });
      }
      // save videoURL
      saveVideoURL(link, pageQuerying ){
        return this.db.collection('help/resources/videos/').doc(pageQuerying).set({
          link : link,
          page : pageQuerying
      }, { merge: true });
      }
      // check if document exists or not
      contentexists(pageQuerying){
        return this.db.collection('help/resources/helpTopics/').doc(pageQuerying).get()
      }
      videoexists(pageQuerying){
        return this.db.collection('help/resources/videos/').doc(pageQuerying).get()
      }

// manually DUMMY DATA adding fn
contentfn(pageQuerying){
  let helpTopic : Array<object>;
  helpTopic = [
    {
      position:1,
      content:'content1',
      contentLink:'contentLink1',
      title:'title1',
      snippet:'snippet1'
    },
  ]
  return this.db.collection('help/resources/helpTopics/').doc(pageQuerying).set({
    helpTopic : helpTopic,
    page : pageQuerying
}, { merge: true });
}
videofn(pageQuerying){
  return this.db.collection('help/resources/videos/').doc(pageQuerying).set({
    link : 'https://www.youtube.com/embed/jUfEn032IL8',
    page : pageQuerying
}, { merge: true });
} 
}

