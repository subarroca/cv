System.register("comps/nav/nav", ["angular2/angular2", "services/Section"], function($__export) {
  "use strict";
  var __moduleName = "comps/nav/nav";
  var Component,
      Template,
      For,
      Section,
      Nav;
  return {
    setters: [function($__m) {
      Component = $__m.Component;
      Template = $__m.Template;
      For = $__m.For;
    }, function($__m) {
      Section = $__m.Section;
    }],
    execute: function() {
      Nav = $__export("Nav", (function() {
        var Nav = function Nav(section) {
          this.sections = [{
            name: 'Goal',
            path: 'goal'
          }, {
            name: 'Experience',
            path: 'experience'
          }, {
            name: 'Projects',
            path: 'project'
          }, {
            name: 'Knowledge',
            path: 'knowledge'
          }, {
            name: 'Languages',
            path: 'languages'
          }, {
            name: 'Studies',
            path: 'study'
          }];
        };
        return ($traceurRuntime.createClass)(Nav, {}, {});
      }()));
      Object.defineProperty(Nav, "annotations", {get: function() {
          return [new Component({
            selector: 'nav',
            services: [Section]
          }), new Template({
            url: 'comps/nav/nav.html',
            directives: [For]
          })];
        }});
      Object.defineProperty(Nav, "parameters", {get: function() {
          return [[Section]];
        }});
    }
  };
});
