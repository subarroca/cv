import {Component, View} from 'angular2/angular2';

import {Person} from 'models/Person';

@Component({
  selector: 'info',
  injectables:[Person]
})

@View({
  templateUrl: 'comps/info/info.html'
})

export class Info {
  // person: Person;

  constructor(person: Person) {

    this.person = person;
  }

}
