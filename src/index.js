import {Component, Template, bootstrap} from 'angular2/angular2';
import {bind} from 'angular2/di';

import {Info} from 'comps/info/info';
import {Nav} from 'comps/nav/nav';

@Component({
  selector: 'cv'
})

@Template({
  url: 'cv.html',
  directives:[Info, Nav]
})

class Cv {

  constructor() {
    console.log('component mounted');
  }

}

export function main() {
  bootstrap(Cv);
}
