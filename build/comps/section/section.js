System.register("comps/section/section", ["angular2/angular2", "models/Section"], function($__export) {
  "use strict";
  var __moduleName = "comps/section/section";
  var Component,
      View,
      Parent,
      For,
      Section,
      Nav;
  return {
    setters: [function($__m) {
      Component = $__m.Component;
      View = $__m.View;
      Parent = $__m.Parent;
      For = $__m.For;
    }, function($__m) {
      Section = $__m.Section;
    }],
    execute: function() {
      Nav = (function() {
        function Nav() {
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
        }
        return ($traceurRuntime.createClass)(Nav, {}, {});
      }());
      $__export("Nav", Nav);
      Object.defineProperty(Nav, "annotations", {get: function() {
          return [new Component({
            selector: 'nav',
            injectables: [Section]
          }), new View({
            templateUrl: 'comps/nav/nav.html',
            directives: [For]
          })];
        }});
    }
  };
});
