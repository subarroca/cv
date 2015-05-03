import {  Component, View, For} from 'angular2/angular2';

import {  Section} from 'models/Section';


@Component({
  selector: 'cv-section',
  injectables: [Section]
})

@View({
  templateUrl: 'comps/cv-section/cv-section.html',
  directives: [For]
})


export class CvSection {
  // section: Section

  constructor() {}

}

