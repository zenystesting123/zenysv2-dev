import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-previewprint',
  templateUrl: './previewprint.component.html',
  styleUrls: ['./previewprint.component.scss']
})
export class PreviewprintComponent implements OnInit {
 
  color:string;
  layout:number=1;
  prev1:boolean=true;
  prev2:boolean=false;
  prev3:boolean=false;

  
  constructor() { }

  ngOnInit() {
  
  }

  previous(){

    // if(this.layout>=3)
    // {
    // }
      this.layout=this.layout-1;
    
    if(this.layout<1)
    {
      this.layout=1;
    }
   
    
  }
  next(){
   this.layout=this.layout+1;
   if(this.layout>=3){
     this.layout=3;
   }
   

  }
  
  

}
