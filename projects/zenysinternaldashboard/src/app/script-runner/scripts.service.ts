import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { map, take } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Customer } from 'src/app/data-models';

@Injectable({
  providedIn: 'root'
})
export class ScriptsService {
  allUsers2:Array<any>=[]
  allUsers:Array<any>=[]
allActiveUsers:Array<any>=[]
repeatingmails:Array<any>=[]
  constructor(private db:AngularFirestore,private http:HttpClient) { }
  zenysMainAccountId=environment.ZenysMainAccount;
  assignedToName=environment.ZenysAssignedToName;

// script to delete users that are not in authentication
  delete(){
    this.http.post("http://localhost:5000/zenysdevelopment/asia-east2/getAllRegisteredUsers",{}).subscribe((data:any)=>{
      // console.log(data)
      data.forEach((ele)=>{
        // console.log(ele.uid)
        this.allActiveUsers.push(ele.uid)
      })
      this.db.collection("users").valueChanges({idField: 'Id'}).subscribe((data1)=>{
        data1.forEach((ele)=>{
          if(!(this.allActiveUsers.includes(ele.Id))){
            // this.db.doc("users/"+ele.Id).delete().then(()=>{
            console.log(ele.Id+" is deleted")
            // })
          }
        })
      })
    })
  }



// script to check if deletion is done
  script1(){
    this.db.collection("users").valueChanges().subscribe((data)=>{
      console.log(data)
      this.allUsers=data

      this.allUsers=this.allUsers.filter(data=>data.zenysCustId==undefined)
      // console.log(this.allUsers)
      var index=0
      this.allUsers.forEach((ele)=>{
        this.db.collection("users",ref=>ref.where("email","==",ele.email)).valueChanges({idField: 'Id'}).subscribe((data)=>{
        //  console.log(ele.email)
         if(data.length>1)
          {
            this.repeatingmails.push(ele.email)
         console.log(ele.email)
            data.forEach((ele2)=>{
              console.log(ele2.Id)
          })
          console.log("__________________________________________")
          console.log(new Set(this.repeatingmails))
        }
        })



      })

    })
  }

  //script to be run for zenysCustId
script2(){
  this.db.collection("users").valueChanges(
    {idField: 'Id'}
    ).pipe(take(1)).subscribe((data)=>{
    console.log(data)
    this.allUsers=data
    // this.allUsers2=data

    this.allUsers2=this.allUsers.filter(data=>data.zenysCustId==undefined)
    console.log(this.allUsers2)
    // var indexforpresent=0
    // var indexforabsent=0
    this.allUsers2.forEach((user)=>{
      // console.log(user.zenysCustId)

      this.db.collection("users/"+this.zenysMainAccountId+"/customers",ref=>ref.where("email","==",user.email))
      .valueChanges({idField: 'Id'}).pipe(take(1)).subscribe((data1)=>{
        //
      console.log(user.Id)
      console.log("is present"+(!!data1.length))

          if(data1.length>0){


            this.db.doc("users/"+user.Id).update({zenysCustId:data1[0].Id}).then(()=>{
              console.log(user.email+" is present in customers of main account with cust ID="+data1[0].Id+
            "\n so we add the field zenyCustId: "+data1[0].Id+" to the document of "+ user.Id+" in users")
            })
          }
          else{


            this.db.doc("users/"+user.Id).update({zenysCustId:user.Id}).then(()=>{
              console.log("updated "+ user.Id)
              this.db.doc("users/"+this.zenysMainAccountId+"/customers/"+user.Id).set(
                {
                  // zenysCustId:user.Id,
                  assignedTo:this.zenysMainAccountId,
                  assignedToName:this.assignedToName,
                  billingaddress1:null,
                  billingaddress2:null,
                  bpin:null,
                  code:user.countryCode?user.countryCode:'',
                  collectedAmount:0,
                  companyName:user.company?user.company:'',
                  contactNo:user.phone?user.phone:'',
                  country:null,
                  createdBy:this.zenysMainAccountId,
                  createdYear:new Date().getFullYear(),
                  currentStatusDate:Date.now(),
                  custCategory1Name:"",
                  custCategory2Name:"",
                  custField1Name:"",
                  custField2Name:"",
                  custField3Name:"",
                  custField4Name:"",
                  customerDate:null,
                  dateCreated:Date.now(),
                  district:null,
                  email:user.email?user.email:'',
                  firstName:user.firstname?user.firstname:'',
                  followUpFlag:0,
                  invoicedAmount:0,
                  isCompany:Boolean(user.company),
                  leadStageDate:null,
                  month:new Date().getMonth(),
                  ongoingSales:0,
                  oppStageDate:null,
                  priority:"Medium",
                  prospStageDate:null,
                  rejectionDate:null,
                  saleOngoingValue:0,
                  salePipelineValue:0,
                  secondName:user.lastname?user.lastname:"",
                  stageHistory:
                  [{date:Date.now(),
                  stageName:"Lead",
                  stageNo:0,},
                  ],
                  state:null,
                  status:"Lead",
                  taxId:"",
                  totalAmountCollected:0,
                      }



              ).then(()=>{
                console.log(user.email+"is not present in customers of main account so we add field zenysCustId:"+
                user.Id+"and add this as new customer to zenys main account with fields company:"+user.company+
                "contactNo:"+user.phone+" firstName:"+user.firstname+" secondName:"+(user.lastname?user.lastname:""))
              })
            })
          }
      })

    })

  })
}


getAllCustomersinMainAccount(){
  var array=[]
this.db.collection("users/"+this.zenysMainAccountId+"/customers", ref=> (ref.limit(10))).valueChanges().subscribe((data)=>{
  // console.log(data)
  data.forEach((element:any)=>{
    array.push(element.email)
    if(!this.allUsers2.includes(element.email)){
      console.log(element.email)
  }
  })
  console.log(array)

})

}

getAllusers(){
  this.allUsers2=[]
  this.db.collection("users").valueChanges(
    {idField: 'Id'}
    ).pipe(take(1)).subscribe((data)=>{
    console.log(data)
    this.allUsers=data
    // this.allUsers2=data
    this.allUsers.forEach(element => {
    this.allUsers2.push(element.email)
    });
    // this.allUsers2=this.allUsers.filter(data=>data.zenysCustId!=undefined)
    console.log(this.allUsers2)
    })
}

deleteContacts(){
  let userId:string= 'b5r6gPQHGHSucB188uj6cZUFI5b2';
  let startDate:number= 1646578957374;
  let endDate:number= 1646578957374;

  this.db.collection("users/"+userId+"/customers", ref =>ref.where('createdDate', '>=', startDate).where('createdDate', '<=', endDate)).valueChanges(
    {idField: 'Id'}
    ).pipe(take(1)).subscribe((data)=>{
      //console.log("Logging contacts created in date range",data);
      data.forEach((element:any)=>{

        this.db.doc("users/"+userId+"/customers/"+element.Id).delete().then(()=>{
          console.log("deleting Customer with Id", element.Id);
        })


      })

      });

}



}
