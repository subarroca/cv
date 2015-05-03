System.register("comps/cv/cv", ["angular2/angular2", "angular2/di", "comps/info/info", "comps/nav/nav", "comps/cv-section/cv-section", "models/Section"], function($__export) {
  "use strict";
  var __moduleName = "comps/cv/cv";
  var Component,
      View,
      bind,
      Info,
      Nav,
      CvSection,
      Section,
      Cv;
  return {
    setters: [function($__m) {
      Component = $__m.Component;
      View = $__m.View;
    }, function($__m) {
      bind = $__m.bind;
    }, function($__m) {
      Info = $__m.Info;
    }, function($__m) {
      Nav = $__m.Nav;
    }, function($__m) {
      CvSection = $__m.CvSection;
    }, function($__m) {
      Section = $__m.Section;
    }],
    execute: function() {
      Cv = (function() {
        function Cv() {
          this.currentSection = new Section({});
        }
        return ($traceurRuntime.createClass)(Cv, {loadSection: function(section) {
            this.currentSection = section;
          }}, {});
      }());
      $__export("Cv", Cv);
      Object.defineProperty(Cv, "annotations", {get: function() {
          return [new Component({selector: 'cv'}), new View({
            templateUrl: 'comps/cv/cv.html',
            directives: [Info, Nav, CvSection]
          })];
        }});
    }
  };
});
