System.register("components/cv/cv", ["angular2/angular2"], function($__export) {
  "use strict";
  var __moduleName = "components/cv/cv";
  var Component,
      Template,
      Cv;
  return {
    setters: [function($__m) {
      Component = $__m.Component;
      Template = $__m.Template;
    }],
    execute: function() {
      Cv = $__export("Cv", (function() {
        var Cv = function Cv() {
          console.log('component mounted');
        };
        return ($traceurRuntime.createClass)(Cv, {}, {});
      }()));
      Object.defineProperty(Cv, "annotations", {get: function() {
          return [new Component({selector: 'cv'}), new Template({url: 'components/cv/cv.html'})];
        }});
    }
  };
});
