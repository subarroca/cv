System.register("comps/cv-section/cv-section", ["angular2/angular2", "models/Section"], function($__export) {
  "use strict";
  var __moduleName = "comps/cv-section/cv-section";
  var Component,
      View,
      For,
      Section,
      CvSection;
  return {
    setters: [function($__m) {
      Component = $__m.Component;
      View = $__m.View;
      For = $__m.For;
    }, function($__m) {
      Section = $__m.Section;
    }],
    execute: function() {
      CvSection = (function() {
        function CvSection() {}
        return ($traceurRuntime.createClass)(CvSection, {}, {});
      }());
      $__export("CvSection", CvSection);
      Object.defineProperty(CvSection, "annotations", {get: function() {
          return [new Component({
            selector: 'cv-section',
            properties: {section: 'section'},
            injectables: [Section]
          }), new View({
            templateUrl: 'comps/cv-section/cv-section.html',
            directives: [For]
          })];
        }});
    }
  };
});
