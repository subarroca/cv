export class Section {
  // name: string
  // path: string
  // color: string

  constructor(section: Object) {
    if (section) {
      this.name = section.name;
      this.path = section.path;
      this.color = section.color;
    }
  }
}
