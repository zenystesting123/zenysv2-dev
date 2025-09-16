import { Component, OnInit } from '@angular/core';
import { SharedSalesServService } from './shared-sales-serv.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-shared-sales',
  templateUrl: './shared-sales.component.html',
  styleUrls: ['./shared-sales.component.scss']
})
export class SharedSalesComponent implements OnInit {
  displayedColumns: string[] = ['saleTitle' ];
  dataSource :MatTableDataSource<any[]>
  customerEmail:string
  customerId:string
  allsharedSalesbasic:any
  allsharedSales:any
  allServiceProviders:any
  

  constructor(public afauth:AngularFireAuth,public serv:SharedSalesServService,public router:Router) {
    this.afauth.authState.subscribe((user)=>{
      this.customerEmail=user.uid
      this.customerEmail=user.email
      this.serv.getAllSharedSales(user.email).subscribe((data:any)=>
      {
        this.allsharedSalesbasic=data
      // console.log(this.allsharedSalesbasic)
      if(data.length>0){
        var serviceproviderid=[]
        var serviceproviderData=[]
        var saledata=[]
        for(let i=0;i<data.length;i++){
          // console.log(data[i])
          serviceproviderid.push(data[i].userId)
          
          this.serv.getsalesinShared(data[i].userId,data[i].saleID)
          .subscribe((data2)=>{
            var obj={id:data2.payload.id,superUserId:data[i].userId,...data2.payload.data() as {}}
            // console.log(obj)
            // console.log(!saledata.includes(obj))
            if(!saledata.includes(obj))
            {
            // console.log(data2.payload.id)
            saledata.push(obj)
          }
          })
        }
        serviceproviderid=[...new Set(serviceproviderid)]
        // console.log(serviceproviderid)
        for(let j=0;j<serviceproviderid.length;j++){
          this.serv.getUserData(serviceproviderid[j]).subscribe((data3:any)=>{
            // console.log(data3)
            serviceproviderData.push({...data3,serviceprovId:serviceproviderid[j]})
          })
        }
        // console.log(serviceproviderData)
        this.allServiceProviders=serviceproviderData
        this.allsharedSales=saledata
        // console.log(this.allsharedSales)

        // saledata= [new Set(saledata)]
        // console.log(saledata)
        // console.log(this.allsharedSales[1]==this.allsharedSales[2])

        // this.dataSource.data=saledata
        // this.dataSource._updateChangeSubscription()
        // console.log(this.dataSource.data)
      }
    })
      // this.allsharedSalesbasic
  })

  
  
    this.dataSource=new MatTableDataSource([]);
   }

  ngOnInit(): void {
    
  }
logout(){
  // console.log("hello")
  this.afauth.signOut()
  this.router.navigate(['/login/00'])
}
findCompanyname(serviceproviderId){
return this.allServiceProviders.filter(data=>data.superUserId==serviceproviderId)[0]?.company
}
findproviderName(serviceproviderId){
  // var firstname=this.allServiceProviders.filter(data=>data.superUserId==serviceproviderId)[0].firstname
  // var secondname=this.allServiceProviders.filter(data=>data.superUserId==serviceproviderId)[0].secondname

  return this.allServiceProviders.filter(data=>data.superUserId==serviceproviderId)[0]?.firstname+" "+this.allServiceProviders.filter(data=>data.superUserId==serviceproviderId)[0]?.lastname
}

getSaletitle(saleId){
  // console.log(saleId)
  // console.log(this.allsharedSales)
  return this.allsharedSales.filter(data=>data.id==saleId)[0]?.saleTitle

}

}
