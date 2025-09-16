import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'convertFrom24To12Format'})
export class TimeFormat implements PipeTransform {
     transform(time: any): any {
         let hour = (time.split(':'))[0]
         let min = (time.split(':'))[1]
         let part;

           if(hour <= 11){
             part = 'AM'
             if(hour == 0){
              hour = 12;
             }
           }else if(hour == 12){
             part = 'PM'
           }else if( hour >= 13){
             part = 'PM';
             hour = (hour - 12);
           }


         min = (min+'').length == 1 ? `0${min}` : min;
         hour = (hour+'').length == 1 ? `0${hour}` : hour;
         return `${hour}:${min} ${part}`
       }
   }