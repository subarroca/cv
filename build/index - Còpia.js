System.register("index - Còpia", ["angular2/angular2", "angular2/di"], function($__export) {
  "use strict";
  var __moduleName = "index - Còpia";
  var Component,
      Template,
      bootstrap,
      bind,
      Cv2;
  function main() {
    bootstrap(Cv2);
  }
  $__export("main", main);
  return {
    setters: [function($__m) {
      Component = $__m.Component;
      Template = $__m.Template;
      bootstrap = $__m.bootstrap;
    }, function($__m) {
      bind = $__m.bind;
    }],
    execute: function() {
      Cv2 = (function() {
        var Cv2 = function Cv2() {
          console.log('component mounted');
        };
        return ($traceurRuntime.createClass)(Cv2, {}, {});
      }());
      Object.defineProperty(Cv2, "annotations", {get: function() {
          return [new Component({selector: 'cv2'}), new Template({url: 'cv2.html'})];
        }});
    }
  };
});
