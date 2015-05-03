System.register("index", ["angular2/angular2", "comps/cv/cv"], function($__export) {
  "use strict";
  var __moduleName = "index";
  var bootstrap,
      Cv;
  function main() {
    bootstrap(Cv);
  }
  $__export("main", main);
  return {
    setters: [function($__m) {
      bootstrap = $__m.bootstrap;
    }, function($__m) {
      Cv = $__m.Cv;
    }],
    execute: function() {
    }
  };
});
