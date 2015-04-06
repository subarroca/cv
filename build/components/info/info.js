System.register("components/info/info", ["angular2/angular2"], function($__export) {
  "use strict";
  var __moduleName = "components/info/info";
  var Component,
      Template,
      Info;
  return {
    setters: [function($__m) {
      Component = $__m.Component;
      Template = $__m.Template;
    }],
    execute: function() {
      Info = $__export("Info", (function() {
        var Info = function Info() {
          console.log('component mounted');
        };
        return ($traceurRuntime.createClass)(Info, {}, {});
      }()));
      Object.defineProperty(Info, "annotations", {get: function() {
          return [new Component({selector: 'info'}), new Template({url: 'components/info/info.html'})];
        }});
    }
  };
});
