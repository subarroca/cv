import {Component, Template} from 'angular2/angular2';

import {Person} from 'services/Person';

@Component({
  selector: 'info',
  services:[Person]
})

@Template({
  url: 'comps/info/info.html'
})

export class Info {
  // person: Person;

  constructor(person:Person){

  	this.person=person;
  }

}