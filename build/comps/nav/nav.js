System.register("comps/nav/nav", ["angular2/angular2", "comps/cv/cv", "models/Section"], function($__export) {
  "use strict";
  var __moduleName = "comps/nav/nav";
  var Component,
      View,
      Parent,
      For,
      Cv,
      Section,
      Nav;
  return {
    setters: [function($__m) {
      Component = $__m.Component;
      View = $__m.View;
      Parent = $__m.Parent;
      For = $__m.For;
    }, function($__m) {
      Cv = $__m.Cv;
    }, function($__m) {
      Section = $__m.Section;
    }],
    execute: function() {
      Nav = (function() {
        function Nav(cv) {
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
        return ($traceurRuntime.createClass)(Nav, {loadSection: function(section) {
            this.cv.loadSection(section);
          }}, {});
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
      Object.defineProperty(Nav, "parameters", {get: function() {
          return [[Cv, new Parent()]];
        }});
      Object.defineProperty(Nav.prototype.loadSection, "parameters", {get: function() {
          return [[Section]];
        }});
    }
  };
});
