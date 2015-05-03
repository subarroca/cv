System.register("models/Person", [], function($__export) {
  "use strict";
  var __moduleName = "models/Person";
  var Person;
  return {
    setters: [],
    execute: function() {
      Person = (function() {
        function Person() {
          this.name = 'John Doe';
          this.image = 'image/john-doe.png';
          this.email = 'johndoe@gmail.com';
          this.phone = '0034 000 000 000';
          this.social = {
            linkedin: 'http://',
            github: 'http://'
          };
        }
        return ($traceurRuntime.createClass)(Person, {}, {});
      }());
      $__export("Person", Person);
    }
  };
});
