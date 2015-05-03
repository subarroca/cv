System.register("models/Section", [], function($__export) {
  "use strict";
  var __moduleName = "models/Section";
  var Section;
  return {
    setters: [],
    execute: function() {
      Section = (function() {
        function Section(section) {
          if (section) {
            this.name = section.name;
            this.path = section.path;
            this.color = section.color;
          }
        }
        return ($traceurRuntime.createClass)(Section, {}, {});
      }());
      $__export("Section", Section);
      Object.defineProperty(Section, "parameters", {get: function() {
          return [[Object]];
        }});
    }
  };
});
