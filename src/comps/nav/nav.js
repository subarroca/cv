import {  Component, View, Parent, For} from 'angular2/angular2';

import {Cv} from 'comps/cv/cv';

import {  Section} from 'models/Section';


@Component({
  selector: 'nav',
  injectables: [Section]
})

@View({
  templateUrl: 'comps/nav/nav.html',
  directives: [For]
})


export class Nav {
  // sections: Array <Section>
  // cv

  constructor(@Parent() cv: Cv) {
    this.cv = cv;

    this.sections = [new Section({
      name: 'Goal',
      path: 'goal',
      color: '#c00'
    }), new Section({
      name: 'Experience',
      path: 'experience',
      color: '#0c0'
    }), new Section({
      name: 'Projects',
      path: 'project',
      color: '#00c'
    }), new Section({
      name: 'Knowledge',
      path: 'knowledge',
      color: '#cc0'
    }), new Section({
      name: 'Languages',
      path: 'languages',
      color: '#c0c'
    }), new Section({
      name: 'Studies',
      path: 'study',
      color: '#0cc'
    })];
  }

  loadSection(section: Section) {
    this.cv.loadSection(section);
  }

}
