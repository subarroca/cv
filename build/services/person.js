System.register("services/Person", [], function($__export) {
  "use strict";
  var __moduleName = "services/Person";
  var Person;
  return {
    setters: [],
    execute: function() {
      Person = $__export("Person", (function() {
        var Person = function Person() {
          this.name = 'John Doe';
          this.image = 'image/john-doe.png';
          this.email = 'johndoe@gmail.com';
          this.phone = '0034 000 000 000';
          this.social = {
            linkedin: 'http://',
            github: 'http://'
          };
        };
        return ($traceurRuntime.createClass)(Person, {}, {});
      }()));
    }
  };
});
