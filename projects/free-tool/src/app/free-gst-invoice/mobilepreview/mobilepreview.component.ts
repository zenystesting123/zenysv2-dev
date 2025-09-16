import { Component, OnInit, ViewChild } from '@angular/core';
import { Mobilepreview1Component } from '../mobilepreview1/mobilepreview1.component';
import { Mobilepreview2Component } from '../mobilepreview2/mobilepreview2.component';
import { Mobilepreview3Component } from '../mobilepreview3/mobilepreview3.component';
import { Preview1Component } from '../preview1/preview1.component';
import { Preview2Component } from '../preview2/preview2.component';
import { Preview3Component } from '../preview3/preview3.component';

@Component({
  selector: 'app-mobilepreview',
  templateUrl: './mobilepreview.component.html',
  styleUrls: ['./mobilepreview.component.scss']
})
export class MobilepreviewComponent implements OnInit {
  
  color:string;
  layout:number=1;
  @ViewChild(Preview1Component)
  private prev1:Preview1Component;
  @ViewChild(Preview2Component)
  private prev2:Preview2Component;
  @ViewChild(Preview3Component)
  private prev3:Preview1Component
 
 
  constructor() { }


  previous(){
     
    if(this.layout>1)
    {
      this.layout--;
    }
   
  }
  next(){
   
   if(this.layout<3){
     this.layout++;
   }
  }
   
   print()
   {
    if (this.layout ==1){
      this.prev1.triggerFalseClick();
    }
    if (this.layout ==2){
      this.prev2.triggerFalseClick();
      
    }
    if (this.layout ==3){
      this.prev3.triggerFalseClick();
      
    }
    

  }
  

  ngOnInit(): void {
  }

}
