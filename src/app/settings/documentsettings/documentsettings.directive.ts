import { Directive } from '@angular/core';

@Directive({
  selector: '[appDocumentsettings]'
})
export class DocumentsettingsDirective {

  constructor() { }
  // imageloaded (){
  //   restrict: 'A',
  //   scope:{imageloaded:'@'},
  //   link: function postLink(scope, element, attrs) {
  //     element.bind('load', function() {
  //         //console.log('load fired') <- just console log it and comment the unbind and you will see the 10000s of console logs.
  //         element.attr('src', scope.imageloaded);
  //         element.unbind('load');
  //     });
  //   }
  // };
  // }

  
}
