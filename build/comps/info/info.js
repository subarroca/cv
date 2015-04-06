System.register("comps/info/info", ["angular2/angular2", "services/Person"], function($__export) {
  "use strict";
  var __moduleName = "comps/info/info";
  var Component,
      Template,
      Person,
      Info;
  return {
    setters: [function($__m) {
      Component = $__m.Component;
      Template = $__m.Template;
    }, function($__m) {
      Person = $__m.Person;
    }],
    execute: function() {
      Info = $__export("Info", (function() {
        var Info = function Info(person) {
          this.person = person;
        };
        return ($traceurRuntime.createClass)(Info, {}, {});
      }()));
      Object.defineProperty(Info, "annotations", {get: function() {
          return [new Component({
            selector: 'info',
            services: [Person]
          }), new Template({url: 'comps/info/info.html'})];
        }});
      Object.defineProperty(Info, "parameters", {get: function() {
          return [[Person]];
        }});
    }
  };
});
