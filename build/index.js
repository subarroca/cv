System.register("index", ["angular2/angular2", "angular2/di", "comps/info/info", "comps/nav/nav"], function($__export) {
  "use strict";
  var __moduleName = "index";
  var Component,
      Template,
      bootstrap,
      bind,
      Info,
      Nav,
      Cv;
  function main() {
    bootstrap(Cv);
  }
  $__export("main", main);
  return {
    setters: [function($__m) {
      Component = $__m.Component;
      Template = $__m.Template;
      bootstrap = $__m.bootstrap;
    }, function($__m) {
      bind = $__m.bind;
    }, function($__m) {
      Info = $__m.Info;
    }, function($__m) {
      Nav = $__m.Nav;
    }],
    execute: function() {
      Cv = (function() {
        var Cv = function Cv() {
          console.log('component mounted');
        };
        return ($traceurRuntime.createClass)(Cv, {}, {});
      }());
      Object.defineProperty(Cv, "annotations", {get: function() {
          return [new Component({selector: 'cv'}), new Template({
            url: 'cv.html',
            directives: [Info, Nav]
          })];
        }});
    }
  };
});
