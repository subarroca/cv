import {  Component, Template, For} from 'angular2/angular2';

import {  Section} from 'services/Section';

@Component({
  selector: 'nav',
  services: [Section]
})

@Template({
  url: 'comps/nav/nav.html',
  directives: [For]
})

export class Nav {
  // section: Section;

  constructor(section: Section) {
    this.sections = [{
      name: 'Goal',
      path: 'goal'
    },{
      name: 'Experience',
      path: 'experience'
    },{
      name: 'Projects',
      path: 'project'
    },{
      name: 'Knowledge',
      path: 'knowledge'
    },{
      name: 'Languages',
      path: 'languages'
    },{
      name: 'Studies',
      path: 'study'
    }];

  }

}
