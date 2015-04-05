import {Component, Template, bootstrap} from 'angular2/angular2';
import {bind} from 'angular2/di';

@Component({
  selector: 'cv2'
})

@Template({
  url: 'cv2.html'
})

class Cv2 {

  constructor() {
    console.log('component mounted');
  }

}

export function main() {
  bootstrap(Cv2);
}
