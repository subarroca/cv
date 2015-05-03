System.register("comps/info/info", ["angular2/angular2", "models/Person"], function($__export) {
  "use strict";
  var __moduleName = "comps/info/info";
  var Component,
      View,
      Person,
      Info;
  return {
    setters: [function($__m) {
      Component = $__m.Component;
      View = $__m.View;
    }, function($__m) {
      Person = $__m.Person;
    }],
    execute: function() {
      Info = (function() {
        function Info(person) {
          this.person = person;
        }
        return ($traceurRuntime.createClass)(Info, {}, {});
      }());
      $__export("Info", Info);
      Object.defineProperty(Info, "annotations", {get: function() {
          return [new Component({
            selector: 'info',
            injectables: [Person]
          }), new View({templateUrl: 'comps/info/info.html'})];
        }});
      Object.defineProperty(Info, "parameters", {get: function() {
          return [[Person]];
        }});
    }
  };
});
