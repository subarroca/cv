import {Component, View} from 'angular2/angular2';
import {bind} from 'angular2/di';

import {Info} from 'comps/info/info';
import {Nav} from 'comps/nav/nav';
import {CvSection} from 'comps/cv-section/cv-section';

import {  Section} from 'models/Section';

@Component({
  selector: 'cv'
})

@View({
  templateUrl: 'comps/cv/cv.html',
  directives:[Info, Nav,CvSection]
})


export class Cv {
  // currentSection: Section

  constructor() {
    this.currentSection = new Section({});
  }

  loadSection(section) {
    this.currentSection = section;
  }
}
