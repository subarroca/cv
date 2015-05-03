System.register("../../gulp-traceur/node_modules/traceur/bin/traceur-runtime", [], function($__export) {
  "use strict";
  var __moduleName = "../../gulp-traceur/node_modules/traceur/bin/traceur-runtime";
  return {
    setters: [],
    execute: function() {
      (function(global) {
        'use strict';
        if (global.$traceurRuntime) {
          return ;
        }
        var $Object = Object;
        var $TypeError = TypeError;
        var $create = $Object.create;
        var $defineProperties = $Object.defineProperties;
        var $defineProperty = $Object.defineProperty;
        var $freeze = $Object.freeze;
        var $getOwnPropertyDescriptor = $Object.getOwnPropertyDescriptor;
        var $getOwnPropertyNames = $Object.getOwnPropertyNames;
        var $keys = $Object.keys;
        var $hasOwnProperty = $Object.prototype.hasOwnProperty;
        var $toString = $Object.prototype.toString;
        var $preventExtensions = Object.preventExtensions;
        var $seal = Object.seal;
        var $isExtensible = Object.isExtensible;
        var $apply = Function.prototype.call.bind(Function.prototype.apply);
        function $bind(operand, thisArg, args) {
          var argArray = [thisArg];
          for (var i = 0; i < args.length; i++) {
            argArray[i + 1] = args[i];
          }
          var func = $apply(Function.prototype.bind, operand, argArray);
          return func;
        }
        function $construct(func, argArray) {
          var object = new ($bind(func, null, argArray));
          return object;
        }
        var counter = 0;
        function newUniqueString() {
          return '__$' + Math.floor(Math.random() * 1e9) + '$' + ++counter + '$__';
        }
        var privateNames = $create(null);
        function isPrivateName(s) {
          return privateNames[s];
        }
        function createPrivateName() {
          var s = newUniqueString();
          privateNames[s] = true;
          return s;
        }
        var CONTINUATION_TYPE = Object.create(null);
        function createContinuation(operand, thisArg, argsArray) {
          return [CONTINUATION_TYPE, operand, thisArg, argsArray];
        }
        function isContinuation(object) {
          return object && object[0] === CONTINUATION_TYPE;
        }
        var isTailRecursiveName = null;
        function setupProperTailCalls() {
          isTailRecursiveName = createPrivateName();
          Function.prototype.call = initTailRecursiveFunction(function call(thisArg) {
            var result = tailCall(function(thisArg) {
              var argArray = [];
              for (var i = 1; i < arguments.length; ++i) {
                argArray[i - 1] = arguments[i];
              }
              var continuation = createContinuation(this, thisArg, argArray);
              return continuation;
            }, this, arguments);
            return result;
          });
          Function.prototype.apply = initTailRecursiveFunction(function apply(thisArg, argArray) {
            var result = tailCall(function(thisArg, argArray) {
              var continuation = createContinuation(this, thisArg, argArray);
              return continuation;
            }, this, arguments);
            return result;
          });
        }
        function initTailRecursiveFunction(func) {
          if (isTailRecursiveName === null) {
            setupProperTailCalls();
          }
          func[isTailRecursiveName] = true;
          return func;
        }
        function isTailRecursive(func) {
          return !!func[isTailRecursiveName];
        }
        function tailCall(func, thisArg, argArray) {
          var continuation = argArray[0];
          if (isContinuation(continuation)) {
            continuation = $apply(func, thisArg, continuation[3]);
            return continuation;
          }
          continuation = createContinuation(func, thisArg, argArray);
          while (true) {
            if (isTailRecursive(func)) {
              continuation = $apply(func, continuation[2], [continuation]);
            } else {
              continuation = $apply(func, continuation[2], continuation[3]);
            }
            if (!isContinuation(continuation)) {
              return continuation;
            }
            func = continuation[1];
          }
        }
        function construct() {
          var object;
          if (isTailRecursive(this)) {
            object = $construct(this, [createContinuation(null, null, arguments)]);
          } else {
            object = $construct(this, arguments);
          }
          return object;
        }
        var $traceurRuntime = {
          initTailRecursiveFunction: initTailRecursiveFunction,
          call: tailCall,
          continuation: createContinuation,
          construct: construct
        };
        (function() {
          function nonEnum(value) {
            return {
              configurable: true,
              enumerable: false,
              value: value,
              writable: true
            };
          }
          var method = nonEnum;
          var symbolInternalProperty = newUniqueString();
          var symbolDescriptionProperty = newUniqueString();
          var symbolDataProperty = newUniqueString();
          var symbolValues = $create(null);
          function isShimSymbol(symbol) {
            return typeof symbol === 'object' && symbol instanceof SymbolValue;
          }
          function typeOf(v) {
            if (isShimSymbol(v))
              return 'symbol';
            return typeof v;
          }
          function Symbol(description) {
            var value = new SymbolValue(description);
            if (!(this instanceof Symbol))
              return value;
            throw new TypeError('Symbol cannot be new\'ed');
          }
          $defineProperty(Symbol.prototype, 'constructor', nonEnum(Symbol));
          $defineProperty(Symbol.prototype, 'toString', method(function() {
            var symbolValue = this[symbolDataProperty];
            return symbolValue[symbolInternalProperty];
          }));
          $defineProperty(Symbol.prototype, 'valueOf', method(function() {
            var symbolValue = this[symbolDataProperty];
            if (!symbolValue)
              throw TypeError('Conversion from symbol to string');
            if (!getOption('symbols'))
              return symbolValue[symbolInternalProperty];
            return symbolValue;
          }));
          function SymbolValue(description) {
            var key = newUniqueString();
            $defineProperty(this, symbolDataProperty, {value: this});
            $defineProperty(this, symbolInternalProperty, {value: key});
            $defineProperty(this, symbolDescriptionProperty, {value: description});
            freeze(this);
            symbolValues[key] = this;
          }
          $defineProperty(SymbolValue.prototype, 'constructor', nonEnum(Symbol));
          $defineProperty(SymbolValue.prototype, 'toString', {
            value: Symbol.prototype.toString,
            enumerable: false
          });
          $defineProperty(SymbolValue.prototype, 'valueOf', {
            value: Symbol.prototype.valueOf,
            enumerable: false
          });
          var hashProperty = createPrivateName();
          var hashPropertyDescriptor = {value: undefined};
          var hashObjectProperties = {
            hash: {value: undefined},
            self: {value: undefined}
          };
          var hashCounter = 0;
          function getOwnHashObject(object) {
            var hashObject = object[hashProperty];
            if (hashObject && hashObject.self === object)
              return hashObject;
            if ($isExtensible(object)) {
              hashObjectProperties.hash.value = hashCounter++;
              hashObjectProperties.self.value = object;
              hashPropertyDescriptor.value = $create(null, hashObjectProperties);
              $defineProperty(object, hashProperty, hashPropertyDescriptor);
              return hashPropertyDescriptor.value;
            }
            return undefined;
          }
          function freeze(object) {
            getOwnHashObject(object);
            return $freeze.apply(this, arguments);
          }
          function preventExtensions(object) {
            getOwnHashObject(object);
            return $preventExtensions.apply(this, arguments);
          }
          function seal(object) {
            getOwnHashObject(object);
            return $seal.apply(this, arguments);
          }
          freeze(SymbolValue.prototype);
          function isSymbolString(s) {
            return symbolValues[s] || privateNames[s];
          }
          function toProperty(name) {
            if (isShimSymbol(name))
              return name[symbolInternalProperty];
            return name;
          }
          function removeSymbolKeys(array) {
            var rv = [];
            for (var i = 0; i < array.length; i++) {
              if (!isSymbolString(array[i])) {
                rv.push(array[i]);
              }
            }
            return rv;
          }
          function getOwnPropertyNames(object) {
            return removeSymbolKeys($getOwnPropertyNames(object));
          }
          function keys(object) {
            return removeSymbolKeys($keys(object));
          }
          function getOwnPropertySymbols(object) {
            var rv = [];
            var names = $getOwnPropertyNames(object);
            for (var i = 0; i < names.length; i++) {
              var symbol = symbolValues[names[i]];
              if (symbol) {
                rv.push(symbol);
              }
            }
            return rv;
          }
          function getOwnPropertyDescriptor(object, name) {
            return $getOwnPropertyDescriptor(object, toProperty(name));
          }
          function hasOwnProperty(name) {
            return $hasOwnProperty.call(this, toProperty(name));
          }
          function getOption(name) {
            return global.$traceurRuntime.options[name];
          }
          function defineProperty(object, name, descriptor) {
            if (isShimSymbol(name)) {
              name = name[symbolInternalProperty];
            }
            $defineProperty(object, name, descriptor);
            return object;
          }
          function polyfillObject(Object) {
            $defineProperty(Object, 'defineProperty', {value: defineProperty});
            $defineProperty(Object, 'getOwnPropertyNames', {value: getOwnPropertyNames});
            $defineProperty(Object, 'getOwnPropertyDescriptor', {value: getOwnPropertyDescriptor});
            $defineProperty(Object.prototype, 'hasOwnProperty', {value: hasOwnProperty});
            $defineProperty(Object, 'freeze', {value: freeze});
            $defineProperty(Object, 'preventExtensions', {value: preventExtensions});
            $defineProperty(Object, 'seal', {value: seal});
            $defineProperty(Object, 'keys', {value: keys});
          }
          function exportStar(object) {
            for (var i = 1; i < arguments.length; i++) {
              var names = $getOwnPropertyNames(arguments[i]);
              for (var j = 0; j < names.length; j++) {
                var name = names[j];
                if (name === '__esModule' || isSymbolString(name))
                  continue;
                (function(mod, name) {
                  $defineProperty(object, name, {
                    get: function() {
                      return mod[name];
                    },
                    enumerable: true
                  });
                })(arguments[i], names[j]);
              }
            }
            return object;
          }
          function isObject(x) {
            return x != null && (typeof x === 'object' || typeof x === 'function');
          }
          function toObject(x) {
            if (x == null)
              throw $TypeError();
            return $Object(x);
          }
          function checkObjectCoercible(argument) {
            if (argument == null) {
              throw new TypeError('Value cannot be converted to an Object');
            }
            return argument;
          }
          function polyfillSymbol(global, Symbol) {
            if (!global.Symbol) {
              global.Symbol = Symbol;
              Object.getOwnPropertySymbols = getOwnPropertySymbols;
            }
            if (!global.Symbol.iterator) {
              global.Symbol.iterator = Symbol('Symbol.iterator');
            }
            if (!global.Symbol.observer) {
              global.Symbol.observer = Symbol('Symbol.observer');
            }
          }
          function setupGlobals(global) {
            polyfillSymbol(global, Symbol);
            global.Reflect = global.Reflect || {};
            global.Reflect.global = global.Reflect.global || global;
            polyfillObject(global.Object);
          }
          setupGlobals(global);
          global.$traceurRuntime = {
            call: tailCall,
            checkObjectCoercible: checkObjectCoercible,
            construct: construct,
            continuation: createContinuation,
            createPrivateName: createPrivateName,
            defineProperties: $defineProperties,
            defineProperty: $defineProperty,
            exportStar: exportStar,
            getOwnHashObject: getOwnHashObject,
            getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
            getOwnPropertyNames: $getOwnPropertyNames,
            initTailRecursiveFunction: initTailRecursiveFunction,
            isObject: isObject,
            isPrivateName: isPrivateName,
            isSymbolString: isSymbolString,
            keys: $keys,
            options: {},
            setupGlobals: setupGlobals,
            toObject: toObject,
            toProperty: toProperty,
            typeof: typeOf
          };
        })();
      })(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : this);
      (function() {
        function buildFromEncodedParts(opt_scheme, opt_userInfo, opt_domain, opt_port, opt_path, opt_queryData, opt_fragment) {
          var out = [];
          if (opt_scheme) {
            out.push(opt_scheme, ':');
          }
          if (opt_domain) {
            out.push('//');
            if (opt_userInfo) {
              out.push(opt_userInfo, '@');
            }
            out.push(opt_domain);
            if (opt_port) {
              out.push(':', opt_port);
            }
          }
          if (opt_path) {
            out.push(opt_path);
          }
          if (opt_queryData) {
            out.push('?', opt_queryData);
          }
          if (opt_fragment) {
            out.push('#', opt_fragment);
          }
          return out.join('');
        }
        ;
        var splitRe = new RegExp('^' + '(?:' + '([^:/?#.]+)' + ':)?' + '(?://' + '(?:([^/?#]*)@)?' + '([\\w\\d\\-\\u0100-\\uffff.%]*)' + '(?::([0-9]+))?' + ')?' + '([^?#]+)?' + '(?:\\?([^#]*))?' + '(?:#(.*))?' + '$');
        var ComponentIndex = {
          SCHEME: 1,
          USER_INFO: 2,
          DOMAIN: 3,
          PORT: 4,
          PATH: 5,
          QUERY_DATA: 6,
          FRAGMENT: 7
        };
        function split(uri) {
          return (uri.match(splitRe));
        }
        function removeDotSegments(path) {
          if (path === '/')
            return '/';
          var leadingSlash = path[0] === '/' ? '/' : '';
          var trailingSlash = path.slice(-1) === '/' ? '/' : '';
          var segments = path.split('/');
          var out = [];
          var up = 0;
          for (var pos = 0; pos < segments.length; pos++) {
            var segment = segments[pos];
            switch (segment) {
              case '':
              case '.':
                break;
              case '..':
                if (out.length)
                  out.pop();
                else
                  up++;
                break;
              default:
                out.push(segment);
            }
          }
          if (!leadingSlash) {
            while (up-- > 0) {
              out.unshift('..');
            }
            if (out.length === 0)
              out.push('.');
          }
          return leadingSlash + out.join('/') + trailingSlash;
        }
        function joinAndCanonicalizePath(parts) {
          var path = parts[ComponentIndex.PATH] || '';
          path = removeDotSegments(path);
          parts[ComponentIndex.PATH] = path;
          return buildFromEncodedParts(parts[ComponentIndex.SCHEME], parts[ComponentIndex.USER_INFO], parts[ComponentIndex.DOMAIN], parts[ComponentIndex.PORT], parts[ComponentIndex.PATH], parts[ComponentIndex.QUERY_DATA], parts[ComponentIndex.FRAGMENT]);
        }
        function canonicalizeUrl(url) {
          var parts = split(url);
          return joinAndCanonicalizePath(parts);
        }
        function resolveUrl(base, url) {
          var parts = split(url);
          var baseParts = split(base);
          if (parts[ComponentIndex.SCHEME]) {
            return joinAndCanonicalizePath(parts);
          } else {
            parts[ComponentIndex.SCHEME] = baseParts[ComponentIndex.SCHEME];
          }
          for (var i = ComponentIndex.SCHEME; i <= ComponentIndex.PORT; i++) {
            if (!parts[i]) {
              parts[i] = baseParts[i];
            }
          }
          if (parts[ComponentIndex.PATH][0] == '/') {
            return joinAndCanonicalizePath(parts);
          }
          var path = baseParts[ComponentIndex.PATH];
          var index = path.lastIndexOf('/');
          path = path.slice(0, index + 1) + parts[ComponentIndex.PATH];
          parts[ComponentIndex.PATH] = path;
          return joinAndCanonicalizePath(parts);
        }
        function isAbsolute(name) {
          if (!name)
            return false;
          if (name[0] === '/')
            return true;
          var parts = split(name);
          if (parts[ComponentIndex.SCHEME])
            return true;
          return false;
        }
        $traceurRuntime.canonicalizeUrl = canonicalizeUrl;
        $traceurRuntime.isAbsolute = isAbsolute;
        $traceurRuntime.removeDotSegments = removeDotSegments;
        $traceurRuntime.resolveUrl = resolveUrl;
      })();
      (function(global) {
        'use strict';
        var $__1 = $traceurRuntime,
            canonicalizeUrl = $__1.canonicalizeUrl,
            resolveUrl = $__1.resolveUrl,
            isAbsolute = $__1.isAbsolute;
        var moduleInstantiators = Object.create(null);
        var baseURL;
        if (global.location && global.location.href)
          baseURL = resolveUrl(global.location.href, './');
        else
          baseURL = '';
        function UncoatedModuleEntry(url, uncoatedModule) {
          this.url = url;
          this.value_ = uncoatedModule;
        }
        function ModuleEvaluationError(erroneousModuleName, cause) {
          this.message = this.constructor.name + ': ' + this.stripCause(cause) + ' in ' + erroneousModuleName;
          if (!(cause instanceof ModuleEvaluationError) && cause.stack)
            this.stack = this.stripStack(cause.stack);
          else
            this.stack = '';
        }
        ModuleEvaluationError.prototype = Object.create(Error.prototype);
        ModuleEvaluationError.prototype.constructor = ModuleEvaluationError;
        ModuleEvaluationError.prototype.stripError = function(message) {
          return message.replace(/.*Error:/, this.constructor.name + ':');
        };
        ModuleEvaluationError.prototype.stripCause = function(cause) {
          if (!cause)
            return '';
          if (!cause.message)
            return cause + '';
          return this.stripError(cause.message);
        };
        ModuleEvaluationError.prototype.loadedBy = function(moduleName) {
          this.stack += '\n loaded by ' + moduleName;
        };
        ModuleEvaluationError.prototype.stripStack = function(causeStack) {
          var stack = [];
          causeStack.split('\n').some((function(frame) {
            if (/UncoatedModuleInstantiator/.test(frame))
              return true;
            stack.push(frame);
          }));
          stack[0] = this.stripError(stack[0]);
          return stack.join('\n');
        };
        function beforeLines(lines, number) {
          var result = [];
          var first = number - 3;
          if (first < 0)
            first = 0;
          for (var i = first; i < number; i++) {
            result.push(lines[i]);
          }
          return result;
        }
        function afterLines(lines, number) {
          var last = number + 1;
          if (last > lines.length - 1)
            last = lines.length - 1;
          var result = [];
          for (var i = number; i <= last; i++) {
            result.push(lines[i]);
          }
          return result;
        }
        function columnSpacing(columns) {
          var result = '';
          for (var i = 0; i < columns - 1; i++) {
            result += '-';
          }
          return result;
        }
        function UncoatedModuleInstantiator(url, func) {
          UncoatedModuleEntry.call(this, url, null);
          this.func = func;
        }
        UncoatedModuleInstantiator.prototype = Object.create(UncoatedModuleEntry.prototype);
        UncoatedModuleInstantiator.prototype.getUncoatedModule = function() {
          var $__0 = this;
          if (this.value_)
            return this.value_;
          try {
            var relativeRequire;
            if (typeof $traceurRuntime !== undefined && $traceurRuntime.require) {
              relativeRequire = $traceurRuntime.require.bind(null, this.url);
            }
            return this.value_ = this.func.call(global, relativeRequire);
          } catch (ex) {
            if (ex instanceof ModuleEvaluationError) {
              ex.loadedBy(this.url);
              throw ex;
            }
            if (ex.stack) {
              var lines = this.func.toString().split('\n');
              var evaled = [];
              ex.stack.split('\n').some((function(frame, index) {
                if (frame.indexOf('UncoatedModuleInstantiator.getUncoatedModule') > 0)
                  return true;
                var m = /(at\s[^\s]*\s).*>:(\d*):(\d*)\)/.exec(frame);
                if (m) {
                  var line = parseInt(m[2], 10);
                  evaled = evaled.concat(beforeLines(lines, line));
                  if (index === 1) {
                    evaled.push(columnSpacing(m[3]) + '^ ' + $__0.url);
                  } else {
                    evaled.push(columnSpacing(m[3]) + '^');
                  }
                  evaled = evaled.concat(afterLines(lines, line));
                  evaled.push('= = = = = = = = =');
                } else {
                  evaled.push(frame);
                }
              }));
              ex.stack = evaled.join('\n');
            }
            throw new ModuleEvaluationError(this.url, ex);
          }
        };
        function getUncoatedModuleInstantiator(name) {
          if (!name)
            return ;
          var url = ModuleStore.normalize(name);
          return moduleInstantiators[url];
        }
        ;
        var moduleInstances = Object.create(null);
        var liveModuleSentinel = {};
        function Module(uncoatedModule) {
          var isLive = arguments[1];
          var coatedModule = Object.create(null);
          Object.getOwnPropertyNames(uncoatedModule).forEach((function(name) {
            var getter,
                value;
            if (isLive === liveModuleSentinel) {
              var descr = Object.getOwnPropertyDescriptor(uncoatedModule, name);
              if (descr.get)
                getter = descr.get;
            }
            if (!getter) {
              value = uncoatedModule[name];
              getter = function() {
                return value;
              };
            }
            Object.defineProperty(coatedModule, name, {
              get: getter,
              enumerable: true
            });
          }));
          Object.preventExtensions(coatedModule);
          return coatedModule;
        }
        var ModuleStore = {
          normalize: function(name, refererName, refererAddress) {
            if (typeof name !== 'string')
              throw new TypeError('module name must be a string, not ' + typeof name);
            if (isAbsolute(name))
              return canonicalizeUrl(name);
            if (/[^\.]\/\.\.\//.test(name)) {
              throw new Error('module name embeds /../: ' + name);
            }
            if (name[0] === '.' && refererName)
              return resolveUrl(refererName, name);
            return canonicalizeUrl(name);
          },
          get: function(normalizedName) {
            var m = getUncoatedModuleInstantiator(normalizedName);
            if (!m)
              return undefined;
            var moduleInstance = moduleInstances[m.url];
            if (moduleInstance)
              return moduleInstance;
            moduleInstance = Module(m.getUncoatedModule(), liveModuleSentinel);
            return moduleInstances[m.url] = moduleInstance;
          },
          set: function(normalizedName, module) {
            normalizedName = String(normalizedName);
            moduleInstantiators[normalizedName] = new UncoatedModuleInstantiator(normalizedName, (function() {
              return module;
            }));
            moduleInstances[normalizedName] = module;
          },
          get baseURL() {
            return baseURL;
          },
          set baseURL(v) {
            baseURL = String(v);
          },
          registerModule: function(name, deps, func) {
            var normalizedName = ModuleStore.normalize(name);
            if (moduleInstantiators[normalizedName])
              throw new Error('duplicate module named ' + normalizedName);
            moduleInstantiators[normalizedName] = new UncoatedModuleInstantiator(normalizedName, func);
          },
          bundleStore: Object.create(null),
          register: function(name, deps, func) {
            if (!deps || !deps.length && !func.length) {
              this.registerModule(name, deps, func);
            } else {
              this.bundleStore[name] = {
                deps: deps,
                execute: function() {
                  var $__0 = arguments;
                  var depMap = {};
                  deps.forEach((function(dep, index) {
                    return depMap[dep] = $__0[index];
                  }));
                  var registryEntry = func.call(this, depMap);
                  registryEntry.execute.call(this);
                  return registryEntry.exports;
                }
              };
            }
          },
          getAnonymousModule: function(func) {
            return new Module(func.call(global), liveModuleSentinel);
          }
        };
        var moduleStoreModule = new Module({ModuleStore: ModuleStore});
        ModuleStore.set('@traceur/src/runtime/ModuleStore.js', moduleStoreModule);
        var setupGlobals = $traceurRuntime.setupGlobals;
        $traceurRuntime.setupGlobals = function(global) {
          setupGlobals(global);
        };
        $traceurRuntime.ModuleStore = ModuleStore;
        global.System = {
          register: ModuleStore.register.bind(ModuleStore),
          registerModule: ModuleStore.registerModule.bind(ModuleStore),
          get: ModuleStore.get,
          set: ModuleStore.set,
          normalize: ModuleStore.normalize
        };
      })(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : this);
      System.registerModule("traceur-runtime@0.0.89/src/runtime/async.js", [], function() {
        "use strict";
        var __moduleName = "traceur-runtime@0.0.89/src/runtime/async.js";
        if (typeof $traceurRuntime !== 'object') {
          throw new Error('traceur runtime not found.');
        }
        var $createPrivateName = $traceurRuntime.createPrivateName;
        var $defineProperty = $traceurRuntime.defineProperty;
        var $defineProperties = $traceurRuntime.defineProperties;
        var $create = Object.create;
        var thisName = $createPrivateName();
        var argsName = $createPrivateName();
        var observeName = $createPrivateName();
        function AsyncGeneratorFunction() {}
        function AsyncGeneratorFunctionPrototype() {}
        AsyncGeneratorFunction.prototype = AsyncGeneratorFunctionPrototype;
        AsyncGeneratorFunctionPrototype.constructor = AsyncGeneratorFunction;
        $defineProperty(AsyncGeneratorFunctionPrototype, 'constructor', {enumerable: false});
        var AsyncGeneratorContext = (function() {
          function AsyncGeneratorContext(observer) {
            var $__0 = this;
            this.decoratedObserver = $traceurRuntime.createDecoratedGenerator(observer, (function() {
              $__0.done = true;
            }));
            this.done = false;
            this.inReturn = false;
          }
          return ($traceurRuntime.createClass)(AsyncGeneratorContext, {
            throw: function(error) {
              if (!this.inReturn) {
                throw error;
              }
            },
            yield: function(value) {
              if (this.done) {
                this.inReturn = true;
                throw undefined;
              }
              var result;
              try {
                result = this.decoratedObserver.next(value);
              } catch (e) {
                this.done = true;
                throw e;
              }
              if (result === undefined) {
                return ;
              }
              if (result.done) {
                this.done = true;
                this.inReturn = true;
                throw undefined;
              }
              return result.value;
            },
            yieldFor: function(observable) {
              var ctx = this;
              return $traceurRuntime.observeForEach(observable[$traceurRuntime.toProperty(Symbol.observer)].bind(observable), function(value) {
                if (ctx.done) {
                  this.return();
                  return ;
                }
                var result;
                try {
                  result = ctx.decoratedObserver.next(value);
                } catch (e) {
                  ctx.done = true;
                  throw e;
                }
                if (result === undefined) {
                  return ;
                }
                if (result.done) {
                  ctx.done = true;
                }
                return result;
              });
            }
          }, {});
        }());
        AsyncGeneratorFunctionPrototype.prototype[Symbol.observer] = function(observer) {
          var observe = this[observeName];
          var ctx = new AsyncGeneratorContext(observer);
          $traceurRuntime.schedule((function() {
            return observe(ctx);
          })).then((function(value) {
            if (!ctx.done) {
              ctx.decoratedObserver.return(value);
            }
          })).catch((function(error) {
            if (!ctx.done) {
              ctx.decoratedObserver.throw(error);
            }
          }));
          return ctx.decoratedObserver;
        };
        $defineProperty(AsyncGeneratorFunctionPrototype.prototype, Symbol.observer, {enumerable: false});
        function initAsyncGeneratorFunction(functionObject) {
          functionObject.prototype = $create(AsyncGeneratorFunctionPrototype.prototype);
          functionObject.__proto__ = AsyncGeneratorFunctionPrototype;
          return functionObject;
        }
        function createAsyncGeneratorInstance(observe, functionObject) {
          for (var args = [],
              $__2 = 2; $__2 < arguments.length; $__2++)
            args[$__2 - 2] = arguments[$__2];
          var object = $create(functionObject.prototype);
          object[thisName] = this;
          object[argsName] = args;
          object[observeName] = observe;
          return object;
        }
        function observeForEach(observe, next) {
          return new Promise((function(resolve, reject) {
            var generator = observe({
              next: function(value) {
                return next.call(generator, value);
              },
              throw: function(error) {
                reject(error);
              },
              return: function(value) {
                resolve(value);
              }
            });
          }));
        }
        function schedule(asyncF) {
          return Promise.resolve().then(asyncF);
        }
        var generator = Symbol();
        var onDone = Symbol();
        var DecoratedGenerator = (function() {
          function DecoratedGenerator(_generator, _onDone) {
            this[generator] = _generator;
            this[onDone] = _onDone;
          }
          return ($traceurRuntime.createClass)(DecoratedGenerator, {
            next: function(value) {
              var result = this[generator].next(value);
              if (result !== undefined && result.done) {
                this[onDone].call(this);
              }
              return result;
            },
            throw: function(error) {
              this[onDone].call(this);
              return this[generator].throw(error);
            },
            return: function(value) {
              this[onDone].call(this);
              return this[generator].return(value);
            }
          }, {});
        }());
        function createDecoratedGenerator(generator, onDone) {
          return new DecoratedGenerator(generator, onDone);
        }
        $traceurRuntime.initAsyncGeneratorFunction = initAsyncGeneratorFunction;
        $traceurRuntime.createAsyncGeneratorInstance = createAsyncGeneratorInstance;
        $traceurRuntime.observeForEach = observeForEach;
        $traceurRuntime.schedule = schedule;
        $traceurRuntime.createDecoratedGenerator = createDecoratedGenerator;
        return {};
      });
      System.registerModule("traceur-runtime@0.0.89/src/runtime/classes.js", [], function() {
        "use strict";
        var __moduleName = "traceur-runtime@0.0.89/src/runtime/classes.js";
        var $Object = Object;
        var $TypeError = TypeError;
        var $create = $Object.create;
        var $defineProperties = $traceurRuntime.defineProperties;
        var $defineProperty = $traceurRuntime.defineProperty;
        var $getOwnPropertyDescriptor = $traceurRuntime.getOwnPropertyDescriptor;
        var $getOwnPropertyNames = $traceurRuntime.getOwnPropertyNames;
        var $getPrototypeOf = Object.getPrototypeOf;
        var $__0 = Object,
            getOwnPropertyNames = $__0.getOwnPropertyNames,
            getOwnPropertySymbols = $__0.getOwnPropertySymbols;
        function superDescriptor(homeObject, name) {
          var proto = $getPrototypeOf(homeObject);
          do {
            var result = $getOwnPropertyDescriptor(proto, name);
            if (result)
              return result;
            proto = $getPrototypeOf(proto);
          } while (proto);
          return undefined;
        }
        function superConstructor(ctor) {
          return ctor.__proto__;
        }
        function superGet(self, homeObject, name) {
          var descriptor = superDescriptor(homeObject, name);
          if (descriptor) {
            if (!descriptor.get)
              return descriptor.value;
            return descriptor.get.call(self);
          }
          return undefined;
        }
        function superSet(self, homeObject, name, value) {
          var descriptor = superDescriptor(homeObject, name);
          if (descriptor && descriptor.set) {
            descriptor.set.call(self, value);
            return value;
          }
          throw $TypeError(("super has no setter '" + name + "'."));
        }
        function forEachPropertyKey(object, f) {
          getOwnPropertyNames(object).forEach(f);
          getOwnPropertySymbols(object).forEach(f);
        }
        function getDescriptors(object) {
          var descriptors = {};
          forEachPropertyKey(object, (function(key) {
            descriptors[key] = $getOwnPropertyDescriptor(object, key);
            descriptors[key].enumerable = false;
          }));
          return descriptors;
        }
        var nonEnum = {enumerable: false};
        function makePropertiesNonEnumerable(object) {
          forEachPropertyKey(object, (function(key) {
            $defineProperty(object, key, nonEnum);
          }));
        }
        function createClass(ctor, object, staticObject, superClass) {
          $defineProperty(object, 'constructor', {
            value: ctor,
            configurable: true,
            enumerable: false,
            writable: true
          });
          if (arguments.length > 3) {
            if (typeof superClass === 'function')
              ctor.__proto__ = superClass;
            ctor.prototype = $create(getProtoParent(superClass), getDescriptors(object));
          } else {
            makePropertiesNonEnumerable(object);
            ctor.prototype = object;
          }
          $defineProperty(ctor, 'prototype', {
            configurable: false,
            writable: false
          });
          return $defineProperties(ctor, getDescriptors(staticObject));
        }
        function getProtoParent(superClass) {
          if (typeof superClass === 'function') {
            var prototype = superClass.prototype;
            if ($Object(prototype) === prototype || prototype === null)
              return superClass.prototype;
            throw new $TypeError('super prototype must be an Object or null');
          }
          if (superClass === null)
            return null;
          throw new $TypeError(("Super expression must either be null or a function, not " + typeof superClass + "."));
        }
        $traceurRuntime.createClass = createClass;
        $traceurRuntime.superConstructor = superConstructor;
        $traceurRuntime.superGet = superGet;
        $traceurRuntime.superSet = superSet;
        return {};
      });
      System.registerModule("traceur-runtime@0.0.89/src/runtime/destructuring.js", [], function() {
        "use strict";
        var __moduleName = "traceur-runtime@0.0.89/src/runtime/destructuring.js";
        function iteratorToArray(iter) {
          var rv = [];
          var i = 0;
          var tmp;
          while (!(tmp = iter.next()).done) {
            rv[i++] = tmp.value;
          }
          return rv;
        }
        $traceurRuntime.iteratorToArray = iteratorToArray;
        return {};
      });
      System.registerModule("traceur-runtime@0.0.89/src/runtime/generators.js", [], function() {
        "use strict";
        var __moduleName = "traceur-runtime@0.0.89/src/runtime/generators.js";
        if (typeof $traceurRuntime !== 'object') {
          throw new Error('traceur runtime not found.');
        }
        var createPrivateName = $traceurRuntime.createPrivateName;
        var $defineProperties = $traceurRuntime.defineProperties;
        var $defineProperty = $traceurRuntime.defineProperty;
        var $create = Object.create;
        var $TypeError = TypeError;
        function nonEnum(value) {
          return {
            configurable: true,
            enumerable: false,
            value: value,
            writable: true
          };
        }
        var ST_NEWBORN = 0;
        var ST_EXECUTING = 1;
        var ST_SUSPENDED = 2;
        var ST_CLOSED = 3;
        var END_STATE = -2;
        var RETHROW_STATE = -3;
        function getInternalError(state) {
          return new Error('Traceur compiler bug: invalid state in state machine: ' + state);
        }
        var RETURN_SENTINEL = {};
        function GeneratorContext() {
          this.state = 0;
          this.GState = ST_NEWBORN;
          this.storedException = undefined;
          this.finallyFallThrough = undefined;
          this.sent_ = undefined;
          this.returnValue = undefined;
          this.oldReturnValue = undefined;
          this.tryStack_ = [];
        }
        GeneratorContext.prototype = {
          pushTry: function(catchState, finallyState) {
            if (finallyState !== null) {
              var finallyFallThrough = null;
              for (var i = this.tryStack_.length - 1; i >= 0; i--) {
                if (this.tryStack_[i].catch !== undefined) {
                  finallyFallThrough = this.tryStack_[i].catch;
                  break;
                }
              }
              if (finallyFallThrough === null)
                finallyFallThrough = RETHROW_STATE;
              this.tryStack_.push({
                finally: finallyState,
                finallyFallThrough: finallyFallThrough
              });
            }
            if (catchState !== null) {
              this.tryStack_.push({catch: catchState});
            }
          },
          popTry: function() {
            this.tryStack_.pop();
          },
          maybeUncatchable: function() {
            if (this.storedException === RETURN_SENTINEL) {
              throw RETURN_SENTINEL;
            }
          },
          get sent() {
            this.maybeThrow();
            return this.sent_;
          },
          set sent(v) {
            this.sent_ = v;
          },
          get sentIgnoreThrow() {
            return this.sent_;
          },
          maybeThrow: function() {
            if (this.action === 'throw') {
              this.action = 'next';
              throw this.sent_;
            }
          },
          end: function() {
            switch (this.state) {
              case END_STATE:
                return this;
              case RETHROW_STATE:
                throw this.storedException;
              default:
                throw getInternalError(this.state);
            }
          },
          handleException: function(ex) {
            this.GState = ST_CLOSED;
            this.state = END_STATE;
            throw ex;
          },
          wrapYieldStar: function(iterator) {
            var ctx = this;
            return {
              next: function(v) {
                return iterator.next(v);
              },
              throw: function(e) {
                var result;
                if (e === RETURN_SENTINEL) {
                  if (iterator.return) {
                    result = iterator.return(ctx.returnValue);
                    if (!result.done) {
                      ctx.returnValue = ctx.oldReturnValue;
                      return result;
                    }
                    ctx.returnValue = result.value;
                  }
                  throw e;
                }
                if (iterator.throw) {
                  return iterator.throw(e);
                }
                iterator.return && iterator.return();
                throw $TypeError('Inner iterator does not have a throw method');
              }
            };
          }
        };
        function nextOrThrow(ctx, moveNext, action, x) {
          switch (ctx.GState) {
            case ST_EXECUTING:
              throw new Error(("\"" + action + "\" on executing generator"));
            case ST_CLOSED:
              if (action == 'next') {
                return {
                  value: undefined,
                  done: true
                };
              }
              if (x === RETURN_SENTINEL) {
                return {
                  value: ctx.returnValue,
                  done: true
                };
              }
              throw x;
            case ST_NEWBORN:
              if (action === 'throw') {
                ctx.GState = ST_CLOSED;
                if (x === RETURN_SENTINEL) {
                  return {
                    value: ctx.returnValue,
                    done: true
                  };
                }
                throw x;
              }
              if (x !== undefined)
                throw $TypeError('Sent value to newborn generator');
            case ST_SUSPENDED:
              ctx.GState = ST_EXECUTING;
              ctx.action = action;
              ctx.sent = x;
              var value;
              try {
                value = moveNext(ctx);
              } catch (ex) {
                if (ex === RETURN_SENTINEL) {
                  value = ctx;
                } else {
                  throw ex;
                }
              }
              var done = value === ctx;
              if (done)
                value = ctx.returnValue;
              ctx.GState = done ? ST_CLOSED : ST_SUSPENDED;
              return {
                value: value,
                done: done
              };
          }
        }
        var ctxName = createPrivateName();
        var moveNextName = createPrivateName();
        function GeneratorFunction() {}
        function GeneratorFunctionPrototype() {}
        GeneratorFunction.prototype = GeneratorFunctionPrototype;
        $defineProperty(GeneratorFunctionPrototype, 'constructor', nonEnum(GeneratorFunction));
        GeneratorFunctionPrototype.prototype = {
          constructor: GeneratorFunctionPrototype,
          next: function(v) {
            return nextOrThrow(this[ctxName], this[moveNextName], 'next', v);
          },
          throw: function(v) {
            return nextOrThrow(this[ctxName], this[moveNextName], 'throw', v);
          },
          return: function(v) {
            this[ctxName].oldReturnValue = this[ctxName].returnValue;
            this[ctxName].returnValue = v;
            return nextOrThrow(this[ctxName], this[moveNextName], 'throw', RETURN_SENTINEL);
          }
        };
        $defineProperties(GeneratorFunctionPrototype.prototype, {
          constructor: {enumerable: false},
          next: {enumerable: false},
          throw: {enumerable: false},
          return: {enumerable: false}
        });
        Object.defineProperty(GeneratorFunctionPrototype.prototype, Symbol.iterator, nonEnum(function() {
          return this;
        }));
        function createGeneratorInstance(innerFunction, functionObject, self) {
          var moveNext = getMoveNext(innerFunction, self);
          var ctx = new GeneratorContext();
          var object = $create(functionObject.prototype);
          object[ctxName] = ctx;
          object[moveNextName] = moveNext;
          return object;
        }
        function initGeneratorFunction(functionObject) {
          functionObject.prototype = $create(GeneratorFunctionPrototype.prototype);
          functionObject.__proto__ = GeneratorFunctionPrototype;
          return functionObject;
        }
        function AsyncFunctionContext() {
          GeneratorContext.call(this);
          this.err = undefined;
          var ctx = this;
          ctx.result = new Promise(function(resolve, reject) {
            ctx.resolve = resolve;
            ctx.reject = reject;
          });
        }
        AsyncFunctionContext.prototype = $create(GeneratorContext.prototype);
        AsyncFunctionContext.prototype.end = function() {
          switch (this.state) {
            case END_STATE:
              this.resolve(this.returnValue);
              break;
            case RETHROW_STATE:
              this.reject(this.storedException);
              break;
            default:
              this.reject(getInternalError(this.state));
          }
        };
        AsyncFunctionContext.prototype.handleException = function() {
          this.state = RETHROW_STATE;
        };
        function asyncWrap(innerFunction, self) {
          var moveNext = getMoveNext(innerFunction, self);
          var ctx = new AsyncFunctionContext();
          ctx.createCallback = function(newState) {
            return function(value) {
              ctx.state = newState;
              ctx.value = value;
              moveNext(ctx);
            };
          };
          ctx.errback = function(err) {
            handleCatch(ctx, err);
            moveNext(ctx);
          };
          moveNext(ctx);
          return ctx.result;
        }
        function getMoveNext(innerFunction, self) {
          return function(ctx) {
            while (true) {
              try {
                return innerFunction.call(self, ctx);
              } catch (ex) {
                handleCatch(ctx, ex);
              }
            }
          };
        }
        function handleCatch(ctx, ex) {
          ctx.storedException = ex;
          var last = ctx.tryStack_[ctx.tryStack_.length - 1];
          if (!last) {
            ctx.handleException(ex);
            return ;
          }
          ctx.state = last.catch !== undefined ? last.catch : last.finally;
          if (last.finallyFallThrough !== undefined)
            ctx.finallyFallThrough = last.finallyFallThrough;
        }
        $traceurRuntime.asyncWrap = asyncWrap;
        $traceurRuntime.initGeneratorFunction = initGeneratorFunction;
        $traceurRuntime.createGeneratorInstance = createGeneratorInstance;
        return {};
      });
      System.registerModule("traceur-runtime@0.0.89/src/runtime/relativeRequire.js", [], function() {
        "use strict";
        var __moduleName = "traceur-runtime@0.0.89/src/runtime/relativeRequire.js";
        var path;
        function relativeRequire(callerPath, requiredPath) {
          path = path || typeof require !== 'undefined' && require('path');
          function isDirectory(path) {
            return path.slice(-1) === '/';
          }
          function isAbsolute(path) {
            return path[0] === '/';
          }
          function isRelative(path) {
            return path[0] === '.';
          }
          if (isDirectory(requiredPath) || isAbsolute(requiredPath))
            return ;
          return isRelative(requiredPath) ? require(path.resolve(path.dirname(callerPath), requiredPath)) : require(requiredPath);
        }
        $traceurRuntime.require = relativeRequire;
        return {};
      });
      System.registerModule("traceur-runtime@0.0.89/src/runtime/spread.js", [], function() {
        "use strict";
        var __moduleName = "traceur-runtime@0.0.89/src/runtime/spread.js";
        function spread() {
          var rv = [],
              j = 0,
              iterResult;
          for (var i = 0; i < arguments.length; i++) {
            var valueToSpread = $traceurRuntime.checkObjectCoercible(arguments[i]);
            if (typeof valueToSpread[$traceurRuntime.toProperty(Symbol.iterator)] !== 'function') {
              throw new TypeError('Cannot spread non-iterable object.');
            }
            var iter = valueToSpread[$traceurRuntime.toProperty(Symbol.iterator)]();
            while (!(iterResult = iter.next()).done) {
              rv[j++] = iterResult.value;
            }
          }
          return rv;
        }
        $traceurRuntime.spread = spread;
        return {};
      });
      System.registerModule("traceur-runtime@0.0.89/src/runtime/template.js", [], function() {
        "use strict";
        var __moduleName = "traceur-runtime@0.0.89/src/runtime/template.js";
        var $__0 = Object,
            defineProperty = $__0.defineProperty,
            freeze = $__0.freeze;
        var slice = Array.prototype.slice;
        var map = Object.create(null);
        function getTemplateObject(raw) {
          var cooked = arguments[1];
          var key = raw.join('${}');
          var templateObject = map[key];
          if (templateObject)
            return templateObject;
          if (!cooked) {
            cooked = slice.call(raw);
          }
          return map[key] = freeze(defineProperty(cooked, 'raw', {value: freeze(raw)}));
        }
        $traceurRuntime.getTemplateObject = getTemplateObject;
        return {};
      });
      System.registerModule("traceur-runtime@0.0.89/src/runtime/type-assertions.js", [], function() {
        "use strict";
        var __moduleName = "traceur-runtime@0.0.89/src/runtime/type-assertions.js";
        var types = {
          any: {name: 'any'},
          boolean: {name: 'boolean'},
          number: {name: 'number'},
          string: {name: 'string'},
          symbol: {name: 'symbol'},
          void: {name: 'void'}
        };
        var GenericType = (function() {
          function GenericType(type, argumentTypes) {
            this.type = type;
            this.argumentTypes = argumentTypes;
          }
          return ($traceurRuntime.createClass)(GenericType, {}, {});
        }());
        var typeRegister = Object.create(null);
        function genericType(type) {
          for (var argumentTypes = [],
              $__1 = 1; $__1 < arguments.length; $__1++)
            argumentTypes[$__1 - 1] = arguments[$__1];
          var typeMap = typeRegister;
          var key = $traceurRuntime.getOwnHashObject(type).hash;
          if (!typeMap[key]) {
            typeMap[key] = Object.create(null);
          }
          typeMap = typeMap[key];
          for (var i = 0; i < argumentTypes.length - 1; i++) {
            key = $traceurRuntime.getOwnHashObject(argumentTypes[i]).hash;
            if (!typeMap[key]) {
              typeMap[key] = Object.create(null);
            }
            typeMap = typeMap[key];
          }
          var tail = argumentTypes[argumentTypes.length - 1];
          key = $traceurRuntime.getOwnHashObject(tail).hash;
          if (!typeMap[key]) {
            typeMap[key] = new GenericType(type, argumentTypes);
          }
          return typeMap[key];
        }
        $traceurRuntime.GenericType = GenericType;
        $traceurRuntime.genericType = genericType;
        $traceurRuntime.type = types;
        return {};
      });
      System.registerModule("traceur-runtime@0.0.89/src/runtime/runtime-modules.js", [], function() {
        "use strict";
        var __moduleName = "traceur-runtime@0.0.89/src/runtime/runtime-modules.js";
        System.get("traceur-runtime@0.0.89/src/runtime/relativeRequire.js");
        System.get("traceur-runtime@0.0.89/src/runtime/spread.js");
        System.get("traceur-runtime@0.0.89/src/runtime/destructuring.js");
        System.get("traceur-runtime@0.0.89/src/runtime/classes.js");
        System.get("traceur-runtime@0.0.89/src/runtime/async.js");
        System.get("traceur-runtime@0.0.89/src/runtime/generators.js");
        System.get("traceur-runtime@0.0.89/src/runtime/template.js");
        System.get("traceur-runtime@0.0.89/src/runtime/type-assertions.js");
        return {};
      });
      System.get("traceur-runtime@0.0.89/src/runtime/runtime-modules.js" + '');
      System.registerModule("traceur-runtime@0.0.89/src/runtime/polyfills/utils.js", [], function() {
        "use strict";
        var __moduleName = "traceur-runtime@0.0.89/src/runtime/polyfills/utils.js";
        var $ceil = Math.ceil;
        var $floor = Math.floor;
        var $isFinite = isFinite;
        var $isNaN = isNaN;
        var $pow = Math.pow;
        var $min = Math.min;
        var toObject = $traceurRuntime.toObject;
        function toUint32(x) {
          return x >>> 0;
        }
        function isObject(x) {
          return x && (typeof x === 'object' || typeof x === 'function');
        }
        function isCallable(x) {
          return typeof x === 'function';
        }
        function isNumber(x) {
          return typeof x === 'number';
        }
        function toInteger(x) {
          x = +x;
          if ($isNaN(x))
            return 0;
          if (x === 0 || !$isFinite(x))
            return x;
          return x > 0 ? $floor(x) : $ceil(x);
        }
        var MAX_SAFE_LENGTH = $pow(2, 53) - 1;
        function toLength(x) {
          var len = toInteger(x);
          return len < 0 ? 0 : $min(len, MAX_SAFE_LENGTH);
        }
        function checkIterable(x) {
          return !isObject(x) ? undefined : x[Symbol.iterator];
        }
        function isConstructor(x) {
          return isCallable(x);
        }
        function createIteratorResultObject(value, done) {
          return {
            value: value,
            done: done
          };
        }
        function maybeDefine(object, name, descr) {
          if (!(name in object)) {
            Object.defineProperty(object, name, descr);
          }
        }
        function maybeDefineMethod(object, name, value) {
          maybeDefine(object, name, {
            value: value,
            configurable: true,
            enumerable: false,
            writable: true
          });
        }
        function maybeDefineConst(object, name, value) {
          maybeDefine(object, name, {
            value: value,
            configurable: false,
            enumerable: false,
            writable: false
          });
        }
        function maybeAddFunctions(object, functions) {
          for (var i = 0; i < functions.length; i += 2) {
            var name = functions[i];
            var value = functions[i + 1];
            maybeDefineMethod(object, name, value);
          }
        }
        function maybeAddConsts(object, consts) {
          for (var i = 0; i < consts.length; i += 2) {
            var name = consts[i];
            var value = consts[i + 1];
            maybeDefineConst(object, name, value);
          }
        }
        function maybeAddIterator(object, func, Symbol) {
          if (!Symbol || !Symbol.iterator || object[Symbol.iterator])
            return ;
          if (object['@@iterator'])
            func = object['@@iterator'];
          Object.defineProperty(object, Symbol.iterator, {
            value: func,
            configurable: true,
            enumerable: false,
            writable: true
          });
        }
        var polyfills = [];
        function registerPolyfill(func) {
          polyfills.push(func);
        }
        function polyfillAll(global) {
          polyfills.forEach((function(f) {
            return f(global);
          }));
        }
        return {
          get toObject() {
            return toObject;
          },
          get toUint32() {
            return toUint32;
          },
          get isObject() {
            return isObject;
          },
          get isCallable() {
            return isCallable;
          },
          get isNumber() {
            return isNumber;
          },
          get toInteger() {
            return toInteger;
          },
          get toLength() {
            return toLength;
          },
          get checkIterable() {
            return checkIterable;
          },
          get isConstructor() {
            return isConstructor;
          },
          get createIteratorResultObject() {
            return createIteratorResultObject;
          },
          get maybeDefine() {
            return maybeDefine;
          },
          get maybeDefineMethod() {
            return maybeDefineMethod;
          },
          get maybeDefineConst() {
            return maybeDefineConst;
          },
          get maybeAddFunctions() {
            return maybeAddFunctions;
          },
          get maybeAddConsts() {
            return maybeAddConsts;
          },
          get maybeAddIterator() {
            return maybeAddIterator;
          },
          get registerPolyfill() {
            return registerPolyfill;
          },
          get polyfillAll() {
            return polyfillAll;
          }
        };
      });
      System.registerModule("traceur-runtime@0.0.89/src/runtime/polyfills/Map.js", [], function() {
        "use strict";
        var __moduleName = "traceur-runtime@0.0.89/src/runtime/polyfills/Map.js";
        var $__0 = System.get("traceur-runtime@0.0.89/src/runtime/polyfills/utils.js"),
            isObject = $__0.isObject,
            maybeAddIterator = $__0.maybeAddIterator,
            registerPolyfill = $__0.registerPolyfill;
        var getOwnHashObject = $traceurRuntime.getOwnHashObject;
        var $hasOwnProperty = Object.prototype.hasOwnProperty;
        var deletedSentinel = {};
        function lookupIndex(map, key) {
          if (isObject(key)) {
            var hashObject = getOwnHashObject(key);
            return hashObject && map.objectIndex_[hashObject.hash];
          }
          if (typeof key === 'string')
            return map.stringIndex_[key];
          return map.primitiveIndex_[key];
        }
        function initMap(map) {
          map.entries_ = [];
          map.objectIndex_ = Object.create(null);
          map.stringIndex_ = Object.create(null);
          map.primitiveIndex_ = Object.create(null);
          map.deletedCount_ = 0;
        }
        var Map = (function() {
          function Map() {
            var $__10,
                $__11;
            var iterable = arguments[0];
            if (!isObject(this))
              throw new TypeError('Map called on incompatible type');
            if ($hasOwnProperty.call(this, 'entries_')) {
              throw new TypeError('Map can not be reentrantly initialised');
            }
            initMap(this);
            if (iterable !== null && iterable !== undefined) {
              var $__5 = true;
              var $__6 = false;
              var $__7 = undefined;
              try {
                for (var $__3 = void 0,
                    $__2 = (iterable)[$traceurRuntime.toProperty(Symbol.iterator)](); !($__5 = ($__3 = $__2.next()).done); $__5 = true) {
                  var $__9 = $__3.value,
                      key = ($__10 = $__9[$traceurRuntime.toProperty(Symbol.iterator)](), ($__11 = $__10.next()).done ? void 0 : $__11.value),
                      value = ($__11 = $__10.next()).done ? void 0 : $__11.value;
                  {
                    this.set(key, value);
                  }
                }
              } catch ($__8) {
                $__6 = true;
                $__7 = $__8;
              } finally {
                try {
                  if (!$__5 && $__2.return != null) {
                    $__2.return();
                  }
                } finally {
                  if ($__6) {
                    throw $__7;
                  }
                }
              }
            }
          }
          return ($traceurRuntime.createClass)(Map, {
            get size() {
              return this.entries_.length / 2 - this.deletedCount_;
            },
            get: function(key) {
              var index = lookupIndex(this, key);
              if (index !== undefined)
                return this.entries_[index + 1];
            },
            set: function(key, value) {
              var objectMode = isObject(key);
              var stringMode = typeof key === 'string';
              var index = lookupIndex(this, key);
              if (index !== undefined) {
                this.entries_[index + 1] = value;
              } else {
                index = this.entries_.length;
                this.entries_[index] = key;
                this.entries_[index + 1] = value;
                if (objectMode) {
                  var hashObject = getOwnHashObject(key);
                  var hash = hashObject.hash;
                  this.objectIndex_[hash] = index;
                } else if (stringMode) {
                  this.stringIndex_[key] = index;
                } else {
                  this.primitiveIndex_[key] = index;
                }
              }
              return this;
            },
            has: function(key) {
              return lookupIndex(this, key) !== undefined;
            },
            delete: function(key) {
              var objectMode = isObject(key);
              var stringMode = typeof key === 'string';
              var index;
              var hash;
              if (objectMode) {
                var hashObject = getOwnHashObject(key);
                if (hashObject) {
                  index = this.objectIndex_[hash = hashObject.hash];
                  delete this.objectIndex_[hash];
                }
              } else if (stringMode) {
                index = this.stringIndex_[key];
                delete this.stringIndex_[key];
              } else {
                index = this.primitiveIndex_[key];
                delete this.primitiveIndex_[key];
              }
              if (index !== undefined) {
                this.entries_[index] = deletedSentinel;
                this.entries_[index + 1] = undefined;
                this.deletedCount_++;
                return true;
              }
              return false;
            },
            clear: function() {
              initMap(this);
            },
            forEach: function(callbackFn) {
              var thisArg = arguments[1];
              for (var i = 0; i < this.entries_.length; i += 2) {
                var key = this.entries_[i];
                var value = this.entries_[i + 1];
                if (key === deletedSentinel)
                  continue;
                callbackFn.call(thisArg, value, key, this);
              }
            },
            entries: $traceurRuntime.initGeneratorFunction(function $__12() {
              var i,
                  key,
                  value;
              return $traceurRuntime.createGeneratorInstance(function($ctx) {
                while (true)
                  switch ($ctx.state) {
                    case 0:
                      i = 0;
                      $ctx.state = 12;
                      break;
                    case 12:
                      $ctx.state = (i < this.entries_.length) ? 8 : -2;
                      break;
                    case 4:
                      i += 2;
                      $ctx.state = 12;
                      break;
                    case 8:
                      key = this.entries_[i];
                      value = this.entries_[i + 1];
                      $ctx.state = 9;
                      break;
                    case 9:
                      $ctx.state = (key === deletedSentinel) ? 4 : 6;
                      break;
                    case 6:
                      $ctx.state = 2;
                      return [key, value];
                    case 2:
                      $ctx.maybeThrow();
                      $ctx.state = 4;
                      break;
                    default:
                      return $ctx.end();
                  }
              }, $__12, this);
            }),
            keys: $traceurRuntime.initGeneratorFunction(function $__13() {
              var i,
                  key,
                  value;
              return $traceurRuntime.createGeneratorInstance(function($ctx) {
                while (true)
                  switch ($ctx.state) {
                    case 0:
                      i = 0;
                      $ctx.state = 12;
                      break;
                    case 12:
                      $ctx.state = (i < this.entries_.length) ? 8 : -2;
                      break;
                    case 4:
                      i += 2;
                      $ctx.state = 12;
                      break;
                    case 8:
                      key = this.entries_[i];
                      value = this.entries_[i + 1];
                      $ctx.state = 9;
                      break;
                    case 9:
                      $ctx.state = (key === deletedSentinel) ? 4 : 6;
                      break;
                    case 6:
                      $ctx.state = 2;
                      return key;
                    case 2:
                      $ctx.maybeThrow();
                      $ctx.state = 4;
                      break;
                    default:
                      return $ctx.end();
                  }
              }, $__13, this);
            }),
            values: $traceurRuntime.initGeneratorFunction(function $__14() {
              var i,
                  key,
                  value;
              return $traceurRuntime.createGeneratorInstance(function($ctx) {
                while (true)
                  switch ($ctx.state) {
                    case 0:
                      i = 0;
                      $ctx.state = 12;
                      break;
                    case 12:
                      $ctx.state = (i < this.entries_.length) ? 8 : -2;
                      break;
                    case 4:
                      i += 2;
                      $ctx.state = 12;
                      break;
                    case 8:
                      key = this.entries_[i];
                      value = this.entries_[i + 1];
                      $ctx.state = 9;
                      break;
                    case 9:
                      $ctx.state = (key === deletedSentinel) ? 4 : 6;
                      break;
                    case 6:
                      $ctx.state = 2;
                      return value;
                    case 2:
                      $ctx.maybeThrow();
                      $ctx.state = 4;
                      break;
                    default:
                      return $ctx.end();
                  }
              }, $__14, this);
            })
          }, {});
        }());
        Object.defineProperty(Map.prototype, Symbol.iterator, {
          configurable: true,
          writable: true,
          value: Map.prototype.entries
        });
        function polyfillMap(global) {
          var $__9 = global,
              Object = $__9.Object,
              Symbol = $__9.Symbol;
          if (!global.Map)
            global.Map = Map;
          var mapPrototype = global.Map.prototype;
          if (mapPrototype.entries === undefined)
            global.Map = Map;
          if (mapPrototype.entries) {
            maybeAddIterator(mapPrototype, mapPrototype.entries, Symbol);
            maybeAddIterator(Object.getPrototypeOf(new global.Map().entries()), function() {
              return this;
            }, Symbol);
          }
        }
        registerPolyfill(polyfillMap);
        return {
          get Map() {
            return Map;
          },
          get polyfillMap() {
            return polyfillMap;
          }
        };
      });
      System.get("traceur-runtime@0.0.89/src/runtime/polyfills/Map.js" + '');
      System.registerModule("traceur-runtime@0.0.89/src/runtime/polyfills/Set.js", [], function() {
        "use strict";
        var __moduleName = "traceur-runtime@0.0.89/src/runtime/polyfills/Set.js";
        var $__0 = System.get("traceur-runtime@0.0.89/src/runtime/polyfills/utils.js"),
            isObject = $__0.isObject,
            maybeAddIterator = $__0.maybeAddIterator,
            registerPolyfill = $__0.registerPolyfill;
        var Map = System.get("traceur-runtime@0.0.89/src/runtime/polyfills/Map.js").Map;
        var getOwnHashObject = $traceurRuntime.getOwnHashObject;
        var $hasOwnProperty = Object.prototype.hasOwnProperty;
        function initSet(set) {
          set.map_ = new Map();
        }
        var Set = (function() {
          function Set() {
            var iterable = arguments[0];
            if (!isObject(this))
              throw new TypeError('Set called on incompatible type');
            if ($hasOwnProperty.call(this, 'map_')) {
              throw new TypeError('Set can not be reentrantly initialised');
            }
            initSet(this);
            if (iterable !== null && iterable !== undefined) {
              var $__7 = true;
              var $__8 = false;
              var $__9 = undefined;
              try {
                for (var $__5 = void 0,
                    $__4 = (iterable)[$traceurRuntime.toProperty(Symbol.iterator)](); !($__7 = ($__5 = $__4.next()).done); $__7 = true) {
                  var item = $__5.value;
                  {
                    this.add(item);
                  }
                }
              } catch ($__10) {
                $__8 = true;
                $__9 = $__10;
              } finally {
                try {
                  if (!$__7 && $__4.return != null) {
                    $__4.return();
                  }
                } finally {
                  if ($__8) {
                    throw $__9;
                  }
                }
              }
            }
          }
          return ($traceurRuntime.createClass)(Set, {
            get size() {
              return this.map_.size;
            },
            has: function(key) {
              return this.map_.has(key);
            },
            add: function(key) {
              this.map_.set(key, key);
              return this;
            },
            delete: function(key) {
              return this.map_.delete(key);
            },
            clear: function() {
              return this.map_.clear();
            },
            forEach: function(callbackFn) {
              var thisArg = arguments[1];
              var $__2 = this;
              return this.map_.forEach((function(value, key) {
                callbackFn.call(thisArg, key, key, $__2);
              }));
            },
            values: $traceurRuntime.initGeneratorFunction(function $__12() {
              var $__13,
                  $__14;
              return $traceurRuntime.createGeneratorInstance(function($ctx) {
                while (true)
                  switch ($ctx.state) {
                    case 0:
                      $__13 = $ctx.wrapYieldStar(this.map_.keys()[Symbol.iterator]());
                      $ctx.sent = void 0;
                      $ctx.action = 'next';
                      $ctx.state = 12;
                      break;
                    case 12:
                      $__14 = $__13[$ctx.action]($ctx.sentIgnoreThrow);
                      $ctx.state = 9;
                      break;
                    case 9:
                      $ctx.state = ($__14.done) ? 3 : 2;
                      break;
                    case 3:
                      $ctx.sent = $__14.value;
                      $ctx.state = -2;
                      break;
                    case 2:
                      $ctx.state = 12;
                      return $__14.value;
                    default:
                      return $ctx.end();
                  }
              }, $__12, this);
            }),
            entries: $traceurRuntime.initGeneratorFunction(function $__15() {
              var $__16,
                  $__17;
              return $traceurRuntime.createGeneratorInstance(function($ctx) {
                while (true)
                  switch ($ctx.state) {
                    case 0:
                      $__16 = $ctx.wrapYieldStar(this.map_.entries()[Symbol.iterator]());
                      $ctx.sent = void 0;
                      $ctx.action = 'next';
                      $ctx.state = 12;
                      break;
                    case 12:
                      $__17 = $__16[$ctx.action]($ctx.sentIgnoreThrow);
                      $ctx.state = 9;
                      break;
                    case 9:
                      $ctx.state = ($__17.done) ? 3 : 2;
                      break;
                    case 3:
                      $ctx.sent = $__17.value;
                      $ctx.state = -2;
                      break;
                    case 2:
                      $ctx.state = 12;
                      return $__17.value;
                    default:
                      return $ctx.end();
                  }
              }, $__15, this);
            })
          }, {});
        }());
        Object.defineProperty(Set.prototype, Symbol.iterator, {
          configurable: true,
          writable: true,
          value: Set.prototype.values
        });
        Object.defineProperty(Set.prototype, 'keys', {
          configurable: true,
          writable: true,
          value: Set.prototype.values
        });
        function polyfillSet(global) {
          var $__11 = global,
              Object = $__11.Object,
              Symbol = $__11.Symbol;
          if (!global.Set)
            global.Set = Set;
          var setPrototype = global.Set.prototype;
          if (setPrototype.values) {
            maybeAddIterator(setPrototype, setPrototype.values, Symbol);
            maybeAddIterator(Object.getPrototypeOf(new global.Set().values()), function() {
              return this;
            }, Symbol);
          }
        }
        registerPolyfill(polyfillSet);
        return {
          get Set() {
            return Set;
          },
          get polyfillSet() {
            return polyfillSet;
          }
        };
      });
      System.get("traceur-runtime@0.0.89/src/runtime/polyfills/Set.js" + '');
      System.registerModule("traceur-runtime@0.0.89/node_modules/rsvp/lib/rsvp/asap.js", [], function() {
        "use strict";
        var __moduleName = "traceur-runtime@0.0.89/node_modules/rsvp/lib/rsvp/asap.js";
        var len = 0;
        function asap(callback, arg) {
          queue[len] = callback;
          queue[len + 1] = arg;
          len += 2;
          if (len === 2) {
            scheduleFlush();
          }
        }
        var $__default = asap;
        var browserGlobal = (typeof window !== 'undefined') ? window : {};
        var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
        var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';
        function useNextTick() {
          return function() {
            process.nextTick(flush);
          };
        }
        function useMutationObserver() {
          var iterations = 0;
          var observer = new BrowserMutationObserver(flush);
          var node = document.createTextNode('');
          observer.observe(node, {characterData: true});
          return function() {
            node.data = (iterations = ++iterations % 2);
          };
        }
        function useMessageChannel() {
          var channel = new MessageChannel();
          channel.port1.onmessage = flush;
          return function() {
            channel.port2.postMessage(0);
          };
        }
        function useSetTimeout() {
          return function() {
            setTimeout(flush, 1);
          };
        }
        var queue = new Array(1000);
        function flush() {
          for (var i = 0; i < len; i += 2) {
            var callback = queue[i];
            var arg = queue[i + 1];
            callback(arg);
            queue[i] = undefined;
            queue[i + 1] = undefined;
          }
          len = 0;
        }
        var scheduleFlush;
        if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
          scheduleFlush = useNextTick();
        } else if (BrowserMutationObserver) {
          scheduleFlush = useMutationObserver();
        } else if (isWorker) {
          scheduleFlush = useMessageChannel();
        } else {
          scheduleFlush = useSetTimeout();
        }
        return {get default() {
            return $__default;
          }};
      });
      System.registerModule("traceur-runtime@0.0.89/src/runtime/polyfills/Promise.js", [], function() {
        "use strict";
        var __moduleName = "traceur-runtime@0.0.89/src/runtime/polyfills/Promise.js";
        var async = System.get("traceur-runtime@0.0.89/node_modules/rsvp/lib/rsvp/asap.js").default;
        var registerPolyfill = System.get("traceur-runtime@0.0.89/src/runtime/polyfills/utils.js").registerPolyfill;
        var promiseRaw = {};
        function isPromise(x) {
          return x && typeof x === 'object' && x.status_ !== undefined;
        }
        function idResolveHandler(x) {
          return x;
        }
        function idRejectHandler(x) {
          throw x;
        }
        function chain(promise) {
          var onResolve = arguments[1] !== (void 0) ? arguments[1] : idResolveHandler;
          var onReject = arguments[2] !== (void 0) ? arguments[2] : idRejectHandler;
          var deferred = getDeferred(promise.constructor);
          switch (promise.status_) {
            case undefined:
              throw TypeError;
            case 0:
              promise.onResolve_.push(onResolve, deferred);
              promise.onReject_.push(onReject, deferred);
              break;
            case +1:
              promiseEnqueue(promise.value_, [onResolve, deferred]);
              break;
            case -1:
              promiseEnqueue(promise.value_, [onReject, deferred]);
              break;
          }
          return deferred.promise;
        }
        function getDeferred(C) {
          if (this === $Promise) {
            var promise = promiseInit(new $Promise(promiseRaw));
            return {
              promise: promise,
              resolve: (function(x) {
                promiseResolve(promise, x);
              }),
              reject: (function(r) {
                promiseReject(promise, r);
              })
            };
          } else {
            var result = {};
            result.promise = new C((function(resolve, reject) {
              result.resolve = resolve;
              result.reject = reject;
            }));
            return result;
          }
        }
        function promiseSet(promise, status, value, onResolve, onReject) {
          promise.status_ = status;
          promise.value_ = value;
          promise.onResolve_ = onResolve;
          promise.onReject_ = onReject;
          return promise;
        }
        function promiseInit(promise) {
          return promiseSet(promise, 0, undefined, [], []);
        }
        var Promise = (function() {
          function Promise(resolver) {
            if (resolver === promiseRaw)
              return ;
            if (typeof resolver !== 'function')
              throw new TypeError;
            var promise = promiseInit(this);
            try {
              resolver((function(x) {
                promiseResolve(promise, x);
              }), (function(r) {
                promiseReject(promise, r);
              }));
            } catch (e) {
              promiseReject(promise, e);
            }
          }
          return ($traceurRuntime.createClass)(Promise, {
            catch: function(onReject) {
              return this.then(undefined, onReject);
            },
            then: function(onResolve, onReject) {
              if (typeof onResolve !== 'function')
                onResolve = idResolveHandler;
              if (typeof onReject !== 'function')
                onReject = idRejectHandler;
              var that = this;
              var constructor = this.constructor;
              return chain(this, function(x) {
                x = promiseCoerce(constructor, x);
                return x === that ? onReject(new TypeError) : isPromise(x) ? x.then(onResolve, onReject) : onResolve(x);
              }, onReject);
            }
          }, {
            resolve: function(x) {
              if (this === $Promise) {
                if (isPromise(x)) {
                  return x;
                }
                return promiseSet(new $Promise(promiseRaw), +1, x);
              } else {
                return new this(function(resolve, reject) {
                  resolve(x);
                });
              }
            },
            reject: function(r) {
              if (this === $Promise) {
                return promiseSet(new $Promise(promiseRaw), -1, r);
              } else {
                return new this((function(resolve, reject) {
                  reject(r);
                }));
              }
            },
            all: function(values) {
              var deferred = getDeferred(this);
              var resolutions = [];
              try {
                var makeCountdownFunction = function(i) {
                  return (function(x) {
                    resolutions[i] = x;
                    if (--count === 0)
                      deferred.resolve(resolutions);
                  });
                };
                var count = 0;
                var i = 0;
                var $__6 = true;
                var $__7 = false;
                var $__8 = undefined;
                try {
                  for (var $__4 = void 0,
                      $__3 = (values)[$traceurRuntime.toProperty(Symbol.iterator)](); !($__6 = ($__4 = $__3.next()).done); $__6 = true) {
                    var value = $__4.value;
                    {
                      var countdownFunction = makeCountdownFunction(i);
                      this.resolve(value).then(countdownFunction, (function(r) {
                        deferred.reject(r);
                      }));
                      ++i;
                      ++count;
                    }
                  }
                } catch ($__9) {
                  $__7 = true;
                  $__8 = $__9;
                } finally {
                  try {
                    if (!$__6 && $__3.return != null) {
                      $__3.return();
                    }
                  } finally {
                    if ($__7) {
                      throw $__8;
                    }
                  }
                }
                if (count === 0) {
                  deferred.resolve(resolutions);
                }
              } catch (e) {
                deferred.reject(e);
              }
              return deferred.promise;
            },
            race: function(values) {
              var deferred = getDeferred(this);
              try {
                for (var i = 0; i < values.length; i++) {
                  this.resolve(values[i]).then((function(x) {
                    deferred.resolve(x);
                  }), (function(r) {
                    deferred.reject(r);
                  }));
                }
              } catch (e) {
                deferred.reject(e);
              }
              return deferred.promise;
            }
          });
        }());
        var $Promise = Promise;
        var $PromiseReject = $Promise.reject;
        function promiseResolve(promise, x) {
          promiseDone(promise, +1, x, promise.onResolve_);
        }
        function promiseReject(promise, r) {
          promiseDone(promise, -1, r, promise.onReject_);
        }
        function promiseDone(promise, status, value, reactions) {
          if (promise.status_ !== 0)
            return ;
          promiseEnqueue(value, reactions);
          promiseSet(promise, status, value);
        }
        function promiseEnqueue(value, tasks) {
          async((function() {
            for (var i = 0; i < tasks.length; i += 2) {
              promiseHandle(value, tasks[i], tasks[i + 1]);
            }
          }));
        }
        function promiseHandle(value, handler, deferred) {
          try {
            var result = handler(value);
            if (result === deferred.promise)
              throw new TypeError;
            else if (isPromise(result))
              chain(result, deferred.resolve, deferred.reject);
            else
              deferred.resolve(result);
          } catch (e) {
            try {
              deferred.reject(e);
            } catch (e) {}
          }
        }
        var thenableSymbol = '@@thenable';
        function isObject(x) {
          return x && (typeof x === 'object' || typeof x === 'function');
        }
        function promiseCoerce(constructor, x) {
          if (!isPromise(x) && isObject(x)) {
            var then;
            try {
              then = x.then;
            } catch (r) {
              var promise = $PromiseReject.call(constructor, r);
              x[thenableSymbol] = promise;
              return promise;
            }
            if (typeof then === 'function') {
              var p = x[thenableSymbol];
              if (p) {
                return p;
              } else {
                var deferred = getDeferred(constructor);
                x[thenableSymbol] = deferred.promise;
                try {
                  then.call(x, deferred.resolve, deferred.reject);
                } catch (r) {
                  deferred.reject(r);
                }
                return deferred.promise;
              }
            }
          }
          return x;
        }
        function polyfillPromise(global) {
          if (!global.Promise)
            global.Promise = Promise;
        }
        registerPolyfill(polyfillPromise);
        return {
          get Promise() {
            return Promise;
          },
          get polyfillPromise() {
            return polyfillPromise;
          }
        };
      });
      System.get("traceur-runtime@0.0.89/src/runtime/polyfills/Promise.js" + '');
      System.registerModule("traceur-runtime@0.0.89/src/runtime/polyfills/StringIterator.js", [], function() {
        "use strict";
        var __moduleName = "traceur-runtime@0.0.89/src/runtime/polyfills/StringIterator.js";
        var $__0 = System.get("traceur-runtime@0.0.89/src/runtime/polyfills/utils.js"),
            createIteratorResultObject = $__0.createIteratorResultObject,
            isObject = $__0.isObject;
        var toProperty = $traceurRuntime.toProperty;
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        var iteratedString = Symbol('iteratedString');
        var stringIteratorNextIndex = Symbol('stringIteratorNextIndex');
        var StringIterator = (function() {
          var $__2;
          function StringIterator() {}
          return ($traceurRuntime.createClass)(StringIterator, ($__2 = {}, Object.defineProperty($__2, "next", {
            value: function() {
              var o = this;
              if (!isObject(o) || !hasOwnProperty.call(o, iteratedString)) {
                throw new TypeError('this must be a StringIterator object');
              }
              var s = o[toProperty(iteratedString)];
              if (s === undefined) {
                return createIteratorResultObject(undefined, true);
              }
              var position = o[toProperty(stringIteratorNextIndex)];
              var len = s.length;
              if (position >= len) {
                o[toProperty(iteratedString)] = undefined;
                return createIteratorResultObject(undefined, true);
              }
              var first = s.charCodeAt(position);
              var resultString;
              if (first < 0xD800 || first > 0xDBFF || position + 1 === len) {
                resultString = String.fromCharCode(first);
              } else {
                var second = s.charCodeAt(position + 1);
                if (second < 0xDC00 || second > 0xDFFF) {
                  resultString = String.fromCharCode(first);
                } else {
                  resultString = String.fromCharCode(first) + String.fromCharCode(second);
                }
              }
              o[toProperty(stringIteratorNextIndex)] = position + resultString.length;
              return createIteratorResultObject(resultString, false);
            },
            configurable: true,
            enumerable: true,
            writable: true
          }), Object.defineProperty($__2, Symbol.iterator, {
            value: function() {
              return this;
            },
            configurable: true,
            enumerable: true,
            writable: true
          }), $__2), {});
        }());
        function createStringIterator(string) {
          var s = String(string);
          var iterator = Object.create(StringIterator.prototype);
          iterator[toProperty(iteratedString)] = s;
          iterator[toProperty(stringIteratorNextIndex)] = 0;
          return iterator;
        }
        return {get createStringIterator() {
            return createStringIterator;
          }};
      });
      System.registerModule("traceur-runtime@0.0.89/src/runtime/polyfills/String.js", [], function() {
        "use strict";
        var __moduleName = "traceur-runtime@0.0.89/src/runtime/polyfills/String.js";
        var createStringIterator = System.get("traceur-runtime@0.0.89/src/runtime/polyfills/StringIterator.js").createStringIterator;
        var $__1 = System.get("traceur-runtime@0.0.89/src/runtime/polyfills/utils.js"),
            maybeAddFunctions = $__1.maybeAddFunctions,
            maybeAddIterator = $__1.maybeAddIterator,
            registerPolyfill = $__1.registerPolyfill;
        var $toString = Object.prototype.toString;
        var $indexOf = String.prototype.indexOf;
        var $lastIndexOf = String.prototype.lastIndexOf;
        function startsWith(search) {
          var string = String(this);
          if (this == null || $toString.call(search) == '[object RegExp]') {
            throw TypeError();
          }
          var stringLength = string.length;
          var searchString = String(search);
          var searchLength = searchString.length;
          var position = arguments.length > 1 ? arguments[1] : undefined;
          var pos = position ? Number(position) : 0;
          if (isNaN(pos)) {
            pos = 0;
          }
          var start = Math.min(Math.max(pos, 0), stringLength);
          return $indexOf.call(string, searchString, pos) == start;
        }
        function endsWith(search) {
          var string = String(this);
          if (this == null || $toString.call(search) == '[object RegExp]') {
            throw TypeError();
          }
          var stringLength = string.length;
          var searchString = String(search);
          var searchLength = searchString.length;
          var pos = stringLength;
          if (arguments.length > 1) {
            var position = arguments[1];
            if (position !== undefined) {
              pos = position ? Number(position) : 0;
              if (isNaN(pos)) {
                pos = 0;
              }
            }
          }
          var end = Math.min(Math.max(pos, 0), stringLength);
          var start = end - searchLength;
          if (start < 0) {
            return false;
          }
          return $lastIndexOf.call(string, searchString, start) == start;
        }
        function includes(search) {
          if (this == null) {
            throw TypeError();
          }
          var string = String(this);
          if (search && $toString.call(search) == '[object RegExp]') {
            throw TypeError();
          }
          var stringLength = string.length;
          var searchString = String(search);
          var searchLength = searchString.length;
          var position = arguments.length > 1 ? arguments[1] : undefined;
          var pos = position ? Number(position) : 0;
          if (pos != pos) {
            pos = 0;
          }
          var start = Math.min(Math.max(pos, 0), stringLength);
          if (searchLength + start > stringLength) {
            return false;
          }
          return $indexOf.call(string, searchString, pos) != -1;
        }
        function repeat(count) {
          if (this == null) {
            throw TypeError();
          }
          var string = String(this);
          var n = count ? Number(count) : 0;
          if (isNaN(n)) {
            n = 0;
          }
          if (n < 0 || n == Infinity) {
            throw RangeError();
          }
          if (n == 0) {
            return '';
          }
          var result = '';
          while (n--) {
            result += string;
          }
          return result;
        }
        function codePointAt(position) {
          if (this == null) {
            throw TypeError();
          }
          var string = String(this);
          var size = string.length;
          var index = position ? Number(position) : 0;
          if (isNaN(index)) {
            index = 0;
          }
          if (index < 0 || index >= size) {
            return undefined;
          }
          var first = string.charCodeAt(index);
          var second;
          if (first >= 0xD800 && first <= 0xDBFF && size > index + 1) {
            second = string.charCodeAt(index + 1);
            if (second >= 0xDC00 && second <= 0xDFFF) {
              return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
            }
          }
          return first;
        }
        function raw(callsite) {
          var raw = callsite.raw;
          var len = raw.length >>> 0;
          if (len === 0)
            return '';
          var s = '';
          var i = 0;
          while (true) {
            s += raw[i];
            if (i + 1 === len)
              return s;
            s += arguments[++i];
          }
        }
        function fromCodePoint(_) {
          var codeUnits = [];
          var floor = Math.floor;
          var highSurrogate;
          var lowSurrogate;
          var index = -1;
          var length = arguments.length;
          if (!length) {
            return '';
          }
          while (++index < length) {
            var codePoint = Number(arguments[index]);
            if (!isFinite(codePoint) || codePoint < 0 || codePoint > 0x10FFFF || floor(codePoint) != codePoint) {
              throw RangeError('Invalid code point: ' + codePoint);
            }
            if (codePoint <= 0xFFFF) {
              codeUnits.push(codePoint);
            } else {
              codePoint -= 0x10000;
              highSurrogate = (codePoint >> 10) + 0xD800;
              lowSurrogate = (codePoint % 0x400) + 0xDC00;
              codeUnits.push(highSurrogate, lowSurrogate);
            }
          }
          return String.fromCharCode.apply(null, codeUnits);
        }
        function stringPrototypeIterator() {
          var o = $traceurRuntime.checkObjectCoercible(this);
          var s = String(o);
          return createStringIterator(s);
        }
        function polyfillString(global) {
          var String = global.String;
          maybeAddFunctions(String.prototype, ['codePointAt', codePointAt, 'endsWith', endsWith, 'includes', includes, 'repeat', repeat, 'startsWith', startsWith]);
          maybeAddFunctions(String, ['fromCodePoint', fromCodePoint, 'raw', raw]);
          maybeAddIterator(String.prototype, stringPrototypeIterator, Symbol);
        }
        registerPolyfill(polyfillString);
        return {
          get startsWith() {
            return startsWith;
          },
          get endsWith() {
            return endsWith;
          },
          get includes() {
            return includes;
          },
          get repeat() {
            return repeat;
          },
          get codePointAt() {
            return codePointAt;
          },
          get raw() {
            return raw;
          },
          get fromCodePoint() {
            return fromCodePoint;
          },
          get stringPrototypeIterator() {
            return stringPrototypeIterator;
          },
          get polyfillString() {
            return polyfillString;
          }
        };
      });
      System.get("traceur-runtime@0.0.89/src/runtime/polyfills/String.js" + '');
      System.registerModule("traceur-runtime@0.0.89/src/runtime/polyfills/ArrayIterator.js", [], function() {
        "use strict";
        var __moduleName = "traceur-runtime@0.0.89/src/runtime/polyfills/ArrayIterator.js";
        var $__0 = System.get("traceur-runtime@0.0.89/src/runtime/polyfills/utils.js"),
            toObject = $__0.toObject,
            toUint32 = $__0.toUint32,
            createIteratorResultObject = $__0.createIteratorResultObject;
        var ARRAY_ITERATOR_KIND_KEYS = 1;
        var ARRAY_ITERATOR_KIND_VALUES = 2;
        var ARRAY_ITERATOR_KIND_ENTRIES = 3;
        var ArrayIterator = (function() {
          var $__2;
          function ArrayIterator() {}
          return ($traceurRuntime.createClass)(ArrayIterator, ($__2 = {}, Object.defineProperty($__2, "next", {
            value: function() {
              var iterator = toObject(this);
              var array = iterator.iteratorObject_;
              if (!array) {
                throw new TypeError('Object is not an ArrayIterator');
              }
              var index = iterator.arrayIteratorNextIndex_;
              var itemKind = iterator.arrayIterationKind_;
              var length = toUint32(array.length);
              if (index >= length) {
                iterator.arrayIteratorNextIndex_ = Infinity;
                return createIteratorResultObject(undefined, true);
              }
              iterator.arrayIteratorNextIndex_ = index + 1;
              if (itemKind == ARRAY_ITERATOR_KIND_VALUES)
                return createIteratorResultObject(array[index], false);
              if (itemKind == ARRAY_ITERATOR_KIND_ENTRIES)
                return createIteratorResultObject([index, array[index]], false);
              return createIteratorResultObject(index, false);
            },
            configurable: true,
            enumerable: true,
            writable: true
          }), Object.defineProperty($__2, Symbol.iterator, {
            value: function() {
              return this;
            },
            configurable: true,
            enumerable: true,
            writable: true
          }), $__2), {});
        }());
        function createArrayIterator(array, kind) {
          var object = toObject(array);
          var iterator = new ArrayIterator;
          iterator.iteratorObject_ = object;
          iterator.arrayIteratorNextIndex_ = 0;
          iterator.arrayIterationKind_ = kind;
          return iterator;
        }
        function entries() {
          return createArrayIterator(this, ARRAY_ITERATOR_KIND_ENTRIES);
        }
        function keys() {
          return createArrayIterator(this, ARRAY_ITERATOR_KIND_KEYS);
        }
        function values() {
          return createArrayIterator(this, ARRAY_ITERATOR_KIND_VALUES);
        }
        return {
          get entries() {
            return entries;
          },
          get keys() {
            return keys;
          },
          get values() {
            return values;
          }
        };
      });
      System.registerModule("traceur-runtime@0.0.89/src/runtime/polyfills/Array.js", [], function() {
        "use strict";
        var __moduleName = "traceur-runtime@0.0.89/src/runtime/polyfills/Array.js";
        var $__0 = System.get("traceur-runtime@0.0.89/src/runtime/polyfills/ArrayIterator.js"),
            entries = $__0.entries,
            keys = $__0.keys,
            jsValues = $__0.values;
        var $__1 = System.get("traceur-runtime@0.0.89/src/runtime/polyfills/utils.js"),
            checkIterable = $__1.checkIterable,
            isCallable = $__1.isCallable,
            isConstructor = $__1.isConstructor,
            maybeAddFunctions = $__1.maybeAddFunctions,
            maybeAddIterator = $__1.maybeAddIterator,
            registerPolyfill = $__1.registerPolyfill,
            toInteger = $__1.toInteger,
            toLength = $__1.toLength,
            toObject = $__1.toObject;
        function from(arrLike) {
          var mapFn = arguments[1];
          var thisArg = arguments[2];
          var C = this;
          var items = toObject(arrLike);
          var mapping = mapFn !== undefined;
          var k = 0;
          var arr,
              len;
          if (mapping && !isCallable(mapFn)) {
            throw TypeError();
          }
          if (checkIterable(items)) {
            arr = isConstructor(C) ? new C() : [];
            var $__5 = true;
            var $__6 = false;
            var $__7 = undefined;
            try {
              for (var $__3 = void 0,
                  $__2 = (items)[$traceurRuntime.toProperty(Symbol.iterator)](); !($__5 = ($__3 = $__2.next()).done); $__5 = true) {
                var item = $__3.value;
                {
                  if (mapping) {
                    arr[k] = mapFn.call(thisArg, item, k);
                  } else {
                    arr[k] = item;
                  }
                  k++;
                }
              }
            } catch ($__8) {
              $__6 = true;
              $__7 = $__8;
            } finally {
              try {
                if (!$__5 && $__2.return != null) {
                  $__2.return();
                }
              } finally {
                if ($__6) {
                  throw $__7;
                }
              }
            }
            arr.length = k;
            return arr;
          }
          len = toLength(items.length);
          arr = isConstructor(C) ? new C(len) : new Array(len);
          for (; k < len; k++) {
            if (mapping) {
              arr[k] = typeof thisArg === 'undefined' ? mapFn(items[k], k) : mapFn.call(thisArg, items[k], k);
            } else {
              arr[k] = items[k];
            }
          }
          arr.length = len;
          return arr;
        }
        function of() {
          for (var items = [],
              $__9 = 0; $__9 < arguments.length; $__9++)
            items[$__9] = arguments[$__9];
          var C = this;
          var len = items.length;
          var arr = isConstructor(C) ? new C(len) : new Array(len);
          for (var k = 0; k < len; k++) {
            arr[k] = items[k];
          }
          arr.length = len;
          return arr;
        }
        function fill(value) {
          var start = arguments[1] !== (void 0) ? arguments[1] : 0;
          var end = arguments[2];
          var object = toObject(this);
          var len = toLength(object.length);
          var fillStart = toInteger(start);
          var fillEnd = end !== undefined ? toInteger(end) : len;
          fillStart = fillStart < 0 ? Math.max(len + fillStart, 0) : Math.min(fillStart, len);
          fillEnd = fillEnd < 0 ? Math.max(len + fillEnd, 0) : Math.min(fillEnd, len);
          while (fillStart < fillEnd) {
            object[fillStart] = value;
            fillStart++;
          }
          return object;
        }
        function find(predicate) {
          var thisArg = arguments[1];
          return findHelper(this, predicate, thisArg);
        }
        function findIndex(predicate) {
          var thisArg = arguments[1];
          return findHelper(this, predicate, thisArg, true);
        }
        function findHelper(self, predicate) {
          var thisArg = arguments[2];
          var returnIndex = arguments[3] !== (void 0) ? arguments[3] : false;
          var object = toObject(self);
          var len = toLength(object.length);
          if (!isCallable(predicate)) {
            throw TypeError();
          }
          for (var i = 0; i < len; i++) {
            var value = object[i];
            if (predicate.call(thisArg, value, i, object)) {
              return returnIndex ? i : value;
            }
          }
          return returnIndex ? -1 : undefined;
        }
        function polyfillArray(global) {
          var $__10 = global,
              Array = $__10.Array,
              Object = $__10.Object,
              Symbol = $__10.Symbol;
          var values = jsValues;
          if (Symbol && Symbol.iterator && Array.prototype[Symbol.iterator]) {
            values = Array.prototype[Symbol.iterator];
          }
          maybeAddFunctions(Array.prototype, ['entries', entries, 'keys', keys, 'values', values, 'fill', fill, 'find', find, 'findIndex', findIndex]);
          maybeAddFunctions(Array, ['from', from, 'of', of]);
          maybeAddIterator(Array.prototype, values, Symbol);
          maybeAddIterator(Object.getPrototypeOf([].values()), function() {
            return this;
          }, Symbol);
        }
        registerPolyfill(polyfillArray);
        return {
          get from() {
            return from;
          },
          get of() {
            return of;
          },
          get fill() {
            return fill;
          },
          get find() {
            return find;
          },
          get findIndex() {
            return findIndex;
          },
          get polyfillArray() {
            return polyfillArray;
          }
        };
      });
      System.get("traceur-runtime@0.0.89/src/runtime/polyfills/Array.js" + '');
      System.registerModule("traceur-runtime@0.0.89/src/runtime/polyfills/Object.js", [], function() {
        "use strict";
        var __moduleName = "traceur-runtime@0.0.89/src/runtime/polyfills/Object.js";
        var $__0 = System.get("traceur-runtime@0.0.89/src/runtime/polyfills/utils.js"),
            maybeAddFunctions = $__0.maybeAddFunctions,
            registerPolyfill = $__0.registerPolyfill;
        var $__1 = $traceurRuntime,
            defineProperty = $__1.defineProperty,
            getOwnPropertyDescriptor = $__1.getOwnPropertyDescriptor,
            getOwnPropertyNames = $__1.getOwnPropertyNames,
            isPrivateName = $__1.isPrivateName,
            keys = $__1.keys;
        function is(left, right) {
          if (left === right)
            return left !== 0 || 1 / left === 1 / right;
          return left !== left && right !== right;
        }
        function assign(target) {
          for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            var props = source == null ? [] : keys(source);
            var p = void 0,
                length = props.length;
            for (p = 0; p < length; p++) {
              var name = props[p];
              if (isPrivateName(name))
                continue;
              target[name] = source[name];
            }
          }
          return target;
        }
        function mixin(target, source) {
          var props = getOwnPropertyNames(source);
          var p,
              descriptor,
              length = props.length;
          for (p = 0; p < length; p++) {
            var name = props[p];
            if (isPrivateName(name))
              continue;
            descriptor = getOwnPropertyDescriptor(source, props[p]);
            defineProperty(target, props[p], descriptor);
          }
          return target;
        }
        function polyfillObject(global) {
          var Object = global.Object;
          maybeAddFunctions(Object, ['assign', assign, 'is', is, 'mixin', mixin]);
        }
        registerPolyfill(polyfillObject);
        return {
          get is() {
            return is;
          },
          get assign() {
            return assign;
          },
          get mixin() {
            return mixin;
          },
          get polyfillObject() {
            return polyfillObject;
          }
        };
      });
      System.get("traceur-runtime@0.0.89/src/runtime/polyfills/Object.js" + '');
      System.registerModule("traceur-runtime@0.0.89/src/runtime/polyfills/Number.js", [], function() {
        "use strict";
        var __moduleName = "traceur-runtime@0.0.89/src/runtime/polyfills/Number.js";
        var $__0 = System.get("traceur-runtime@0.0.89/src/runtime/polyfills/utils.js"),
            isNumber = $__0.isNumber,
            maybeAddConsts = $__0.maybeAddConsts,
            maybeAddFunctions = $__0.maybeAddFunctions,
            registerPolyfill = $__0.registerPolyfill,
            toInteger = $__0.toInteger;
        var $abs = Math.abs;
        var $isFinite = isFinite;
        var $isNaN = isNaN;
        var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;
        var MIN_SAFE_INTEGER = -Math.pow(2, 53) + 1;
        var EPSILON = Math.pow(2, -52);
        function NumberIsFinite(number) {
          return isNumber(number) && $isFinite(number);
        }
        function isInteger(number) {
          return NumberIsFinite(number) && toInteger(number) === number;
        }
        function NumberIsNaN(number) {
          return isNumber(number) && $isNaN(number);
        }
        function isSafeInteger(number) {
          if (NumberIsFinite(number)) {
            var integral = toInteger(number);
            if (integral === number)
              return $abs(integral) <= MAX_SAFE_INTEGER;
          }
          return false;
        }
        function polyfillNumber(global) {
          var Number = global.Number;
          maybeAddConsts(Number, ['MAX_SAFE_INTEGER', MAX_SAFE_INTEGER, 'MIN_SAFE_INTEGER', MIN_SAFE_INTEGER, 'EPSILON', EPSILON]);
          maybeAddFunctions(Number, ['isFinite', NumberIsFinite, 'isInteger', isInteger, 'isNaN', NumberIsNaN, 'isSafeInteger', isSafeInteger]);
        }
        registerPolyfill(polyfillNumber);
        return {
          get MAX_SAFE_INTEGER() {
            return MAX_SAFE_INTEGER;
          },
          get MIN_SAFE_INTEGER() {
            return MIN_SAFE_INTEGER;
          },
          get EPSILON() {
            return EPSILON;
          },
          get isFinite() {
            return NumberIsFinite;
          },
          get isInteger() {
            return isInteger;
          },
          get isNaN() {
            return NumberIsNaN;
          },
          get isSafeInteger() {
            return isSafeInteger;
          },
          get polyfillNumber() {
            return polyfillNumber;
          }
        };
      });
      System.get("traceur-runtime@0.0.89/src/runtime/polyfills/Number.js" + '');
      System.registerModule("traceur-runtime@0.0.89/src/runtime/polyfills/fround.js", [], function() {
        "use strict";
        var __moduleName = "traceur-runtime@0.0.89/src/runtime/polyfills/fround.js";
        var $isFinite = isFinite;
        var $isNaN = isNaN;
        var $__0 = Math,
            LN2 = $__0.LN2,
            abs = $__0.abs,
            floor = $__0.floor,
            log = $__0.log,
            min = $__0.min,
            pow = $__0.pow;
        function packIEEE754(v, ebits, fbits) {
          var bias = (1 << (ebits - 1)) - 1,
              s,
              e,
              f,
              ln,
              i,
              bits,
              str,
              bytes;
          function roundToEven(n) {
            var w = floor(n),
                f = n - w;
            if (f < 0.5)
              return w;
            if (f > 0.5)
              return w + 1;
            return w % 2 ? w + 1 : w;
          }
          if (v !== v) {
            e = (1 << ebits) - 1;
            f = pow(2, fbits - 1);
            s = 0;
          } else if (v === Infinity || v === -Infinity) {
            e = (1 << ebits) - 1;
            f = 0;
            s = (v < 0) ? 1 : 0;
          } else if (v === 0) {
            e = 0;
            f = 0;
            s = (1 / v === -Infinity) ? 1 : 0;
          } else {
            s = v < 0;
            v = abs(v);
            if (v >= pow(2, 1 - bias)) {
              e = min(floor(log(v) / LN2), 1023);
              f = roundToEven(v / pow(2, e) * pow(2, fbits));
              if (f / pow(2, fbits) >= 2) {
                e = e + 1;
                f = 1;
              }
              if (e > bias) {
                e = (1 << ebits) - 1;
                f = 0;
              } else {
                e = e + bias;
                f = f - pow(2, fbits);
              }
            } else {
              e = 0;
              f = roundToEven(v / pow(2, 1 - bias - fbits));
            }
          }
          bits = [];
          for (i = fbits; i; i -= 1) {
            bits.push(f % 2 ? 1 : 0);
            f = floor(f / 2);
          }
          for (i = ebits; i; i -= 1) {
            bits.push(e % 2 ? 1 : 0);
            e = floor(e / 2);
          }
          bits.push(s ? 1 : 0);
          bits.reverse();
          str = bits.join('');
          bytes = [];
          while (str.length) {
            bytes.push(parseInt(str.substring(0, 8), 2));
            str = str.substring(8);
          }
          return bytes;
        }
        function unpackIEEE754(bytes, ebits, fbits) {
          var bits = [],
              i,
              j,
              b,
              str,
              bias,
              s,
              e,
              f;
          for (i = bytes.length; i; i -= 1) {
            b = bytes[i - 1];
            for (j = 8; j; j -= 1) {
              bits.push(b % 2 ? 1 : 0);
              b = b >> 1;
            }
          }
          bits.reverse();
          str = bits.join('');
          bias = (1 << (ebits - 1)) - 1;
          s = parseInt(str.substring(0, 1), 2) ? -1 : 1;
          e = parseInt(str.substring(1, 1 + ebits), 2);
          f = parseInt(str.substring(1 + ebits), 2);
          if (e === (1 << ebits) - 1) {
            return f !== 0 ? NaN : s * Infinity;
          } else if (e > 0) {
            return s * pow(2, e - bias) * (1 + f / pow(2, fbits));
          } else if (f !== 0) {
            return s * pow(2, -(bias - 1)) * (f / pow(2, fbits));
          } else {
            return s < 0 ? -0 : 0;
          }
        }
        function unpackF32(b) {
          return unpackIEEE754(b, 8, 23);
        }
        function packF32(v) {
          return packIEEE754(v, 8, 23);
        }
        function fround(x) {
          if (x === 0 || !$isFinite(x) || $isNaN(x)) {
            return x;
          }
          return unpackF32(packF32(Number(x)));
        }
        return {get fround() {
            return fround;
          }};
      });
      System.registerModule("traceur-runtime@0.0.89/src/runtime/polyfills/Math.js", [], function() {
        "use strict";
        var __moduleName = "traceur-runtime@0.0.89/src/runtime/polyfills/Math.js";
        var jsFround = System.get("traceur-runtime@0.0.89/src/runtime/polyfills/fround.js").fround;
        var $__1 = System.get("traceur-runtime@0.0.89/src/runtime/polyfills/utils.js"),
            maybeAddFunctions = $__1.maybeAddFunctions,
            registerPolyfill = $__1.registerPolyfill,
            toUint32 = $__1.toUint32;
        var $isFinite = isFinite;
        var $isNaN = isNaN;
        var $__2 = Math,
            abs = $__2.abs,
            ceil = $__2.ceil,
            exp = $__2.exp,
            floor = $__2.floor,
            log = $__2.log,
            pow = $__2.pow,
            sqrt = $__2.sqrt;
        function clz32(x) {
          x = toUint32(+x);
          if (x == 0)
            return 32;
          var result = 0;
          if ((x & 0xFFFF0000) === 0) {
            x <<= 16;
            result += 16;
          }
          ;
          if ((x & 0xFF000000) === 0) {
            x <<= 8;
            result += 8;
          }
          ;
          if ((x & 0xF0000000) === 0) {
            x <<= 4;
            result += 4;
          }
          ;
          if ((x & 0xC0000000) === 0) {
            x <<= 2;
            result += 2;
          }
          ;
          if ((x & 0x80000000) === 0) {
            x <<= 1;
            result += 1;
          }
          ;
          return result;
        }
        function imul(x, y) {
          x = toUint32(+x);
          y = toUint32(+y);
          var xh = (x >>> 16) & 0xffff;
          var xl = x & 0xffff;
          var yh = (y >>> 16) & 0xffff;
          var yl = y & 0xffff;
          return xl * yl + (((xh * yl + xl * yh) << 16) >>> 0) | 0;
        }
        function sign(x) {
          x = +x;
          if (x > 0)
            return 1;
          if (x < 0)
            return -1;
          return x;
        }
        function log10(x) {
          return log(x) * 0.434294481903251828;
        }
        function log2(x) {
          return log(x) * 1.442695040888963407;
        }
        function log1p(x) {
          x = +x;
          if (x < -1 || $isNaN(x)) {
            return NaN;
          }
          if (x === 0 || x === Infinity) {
            return x;
          }
          if (x === -1) {
            return -Infinity;
          }
          var result = 0;
          var n = 50;
          if (x < 0 || x > 1) {
            return log(1 + x);
          }
          for (var i = 1; i < n; i++) {
            if ((i % 2) === 0) {
              result -= pow(x, i) / i;
            } else {
              result += pow(x, i) / i;
            }
          }
          return result;
        }
        function expm1(x) {
          x = +x;
          if (x === -Infinity) {
            return -1;
          }
          if (!$isFinite(x) || x === 0) {
            return x;
          }
          return exp(x) - 1;
        }
        function cosh(x) {
          x = +x;
          if (x === 0) {
            return 1;
          }
          if ($isNaN(x)) {
            return NaN;
          }
          if (!$isFinite(x)) {
            return Infinity;
          }
          if (x < 0) {
            x = -x;
          }
          if (x > 21) {
            return exp(x) / 2;
          }
          return (exp(x) + exp(-x)) / 2;
        }
        function sinh(x) {
          x = +x;
          if (!$isFinite(x) || x === 0) {
            return x;
          }
          return (exp(x) - exp(-x)) / 2;
        }
        function tanh(x) {
          x = +x;
          if (x === 0)
            return x;
          if (!$isFinite(x))
            return sign(x);
          var exp1 = exp(x);
          var exp2 = exp(-x);
          return (exp1 - exp2) / (exp1 + exp2);
        }
        function acosh(x) {
          x = +x;
          if (x < 1)
            return NaN;
          if (!$isFinite(x))
            return x;
          return log(x + sqrt(x + 1) * sqrt(x - 1));
        }
        function asinh(x) {
          x = +x;
          if (x === 0 || !$isFinite(x))
            return x;
          if (x > 0)
            return log(x + sqrt(x * x + 1));
          return -log(-x + sqrt(x * x + 1));
        }
        function atanh(x) {
          x = +x;
          if (x === -1) {
            return -Infinity;
          }
          if (x === 1) {
            return Infinity;
          }
          if (x === 0) {
            return x;
          }
          if ($isNaN(x) || x < -1 || x > 1) {
            return NaN;
          }
          return 0.5 * log((1 + x) / (1 - x));
        }
        function hypot(x, y) {
          var length = arguments.length;
          var args = new Array(length);
          var max = 0;
          for (var i = 0; i < length; i++) {
            var n = arguments[i];
            n = +n;
            if (n === Infinity || n === -Infinity)
              return Infinity;
            n = abs(n);
            if (n > max)
              max = n;
            args[i] = n;
          }
          if (max === 0)
            max = 1;
          var sum = 0;
          var compensation = 0;
          for (var i = 0; i < length; i++) {
            var n = args[i] / max;
            var summand = n * n - compensation;
            var preliminary = sum + summand;
            compensation = (preliminary - sum) - summand;
            sum = preliminary;
          }
          return sqrt(sum) * max;
        }
        function trunc(x) {
          x = +x;
          if (x > 0)
            return floor(x);
          if (x < 0)
            return ceil(x);
          return x;
        }
        var fround,
            f32;
        if (typeof Float32Array === 'function') {
          f32 = new Float32Array(1);
          fround = function(x) {
            f32[0] = Number(x);
            return f32[0];
          };
        } else {
          fround = jsFround;
        }
        function cbrt(x) {
          x = +x;
          if (x === 0)
            return x;
          var negate = x < 0;
          if (negate)
            x = -x;
          var result = pow(x, 1 / 3);
          return negate ? -result : result;
        }
        function polyfillMath(global) {
          var Math = global.Math;
          maybeAddFunctions(Math, ['acosh', acosh, 'asinh', asinh, 'atanh', atanh, 'cbrt', cbrt, 'clz32', clz32, 'cosh', cosh, 'expm1', expm1, 'fround', fround, 'hypot', hypot, 'imul', imul, 'log10', log10, 'log1p', log1p, 'log2', log2, 'sign', sign, 'sinh', sinh, 'tanh', tanh, 'trunc', trunc]);
        }
        registerPolyfill(polyfillMath);
        return {
          get clz32() {
            return clz32;
          },
          get imul() {
            return imul;
          },
          get sign() {
            return sign;
          },
          get log10() {
            return log10;
          },
          get log2() {
            return log2;
          },
          get log1p() {
            return log1p;
          },
          get expm1() {
            return expm1;
          },
          get cosh() {
            return cosh;
          },
          get sinh() {
            return sinh;
          },
          get tanh() {
            return tanh;
          },
          get acosh() {
            return acosh;
          },
          get asinh() {
            return asinh;
          },
          get atanh() {
            return atanh;
          },
          get hypot() {
            return hypot;
          },
          get trunc() {
            return trunc;
          },
          get fround() {
            return fround;
          },
          get cbrt() {
            return cbrt;
          },
          get polyfillMath() {
            return polyfillMath;
          }
        };
      });
      System.get("traceur-runtime@0.0.89/src/runtime/polyfills/Math.js" + '');
      System.registerModule("traceur-runtime@0.0.89/src/runtime/polyfills/polyfills.js", [], function() {
        "use strict";
        var __moduleName = "traceur-runtime@0.0.89/src/runtime/polyfills/polyfills.js";
        var polyfillAll = System.get("traceur-runtime@0.0.89/src/runtime/polyfills/utils.js").polyfillAll;
        polyfillAll(Reflect.global);
        var setupGlobals = $traceurRuntime.setupGlobals;
        $traceurRuntime.setupGlobals = function(global) {
          setupGlobals(global);
          polyfillAll(global);
        };
        return {};
      });
      System.get("traceur-runtime@0.0.89/src/runtime/polyfills/polyfills.js" + '');
    }
  };
});

System.register("angular2/angular2", ["./change_detection", "./core", "./annotations", "./directives", "./forms", "angular2/src/facade/async", "angular2/src/render/api", "angular2/src/render/dom/direct_dom_renderer"], function($__export) {
  "use strict";
  var __moduleName = "angular2/angular2";
  var $__exportNames = {undefined: true};
  var $__exportNames = {undefined: true};
  var $__exportNames = {undefined: true};
  var $__exportNames = {undefined: true};
  var $__exportNames = {undefined: true};
  var $__exportNames = {undefined: true};
  return {
    setters: [function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      $__export("Observable", $__m.Observable);
      $__export("EventEmitter", $__m.EventEmitter);
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      $__export("DirectDomRenderer", $__m.DirectDomRenderer);
    }],
    execute: function() {}
  };
});

System.register("angular2/angular2_sfx", ["./angular2"], function($__export) {
  "use strict";
  var __moduleName = "angular2/angular2_sfx";
  var angular,
      _prevAngular;
  return {
    setters: [function($__m) {
      angular = $__m;
    }],
    execute: function() {
      _prevAngular = window.angular;
      angular.noConflict = function() {
        window.angular = _prevAngular;
        return angular;
      };
      window.angular = angular;
    }
  };
});

System.register("angular2/annotations", ["./src/core/annotations/annotations"], function($__export) {
  "use strict";
  var __moduleName = "angular2/annotations";
  var $__exportNames = {};
  return {
    setters: [function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }],
    execute: function() {}
  };
});

System.register("angular2/change_detection", ["./src/change_detection/parser/ast", "./src/change_detection/parser/lexer", "./src/change_detection/parser/parser", "./src/change_detection/parser/locals", "./src/change_detection/exceptions", "./src/change_detection/interfaces", "./src/change_detection/constants", "./src/change_detection/proto_change_detector", "./src/change_detection/binding_record", "./src/change_detection/directive_record", "./src/change_detection/dynamic_change_detector", "./src/change_detection/change_detector_ref", "./src/change_detection/pipes/pipe_registry", "./src/change_detection/change_detection_util", "./src/change_detection/pipes/pipe", "./src/change_detection/change_detection"], function($__export) {
  "use strict";
  var __moduleName = "angular2/change_detection";
  return {
    setters: [function($__m) {
      $__export("ASTWithSource", $__m.ASTWithSource);
      $__export("AST", $__m.AST);
      $__export("AstTransformer", $__m.AstTransformer);
      $__export("AccessMember", $__m.AccessMember);
      $__export("LiteralArray", $__m.LiteralArray);
      $__export("ImplicitReceiver", $__m.ImplicitReceiver);
    }, function($__m) {
      $__export("Lexer", $__m.Lexer);
    }, function($__m) {
      $__export("Parser", $__m.Parser);
    }, function($__m) {
      $__export("Locals", $__m.Locals);
    }, function($__m) {
      $__export("ExpressionChangedAfterItHasBeenChecked", $__m.ExpressionChangedAfterItHasBeenChecked);
      $__export("ChangeDetectionError", $__m.ChangeDetectionError);
    }, function($__m) {
      $__export("ProtoChangeDetector", $__m.ProtoChangeDetector);
      $__export("ChangeDispatcher", $__m.ChangeDispatcher);
      $__export("ChangeDetector", $__m.ChangeDetector);
      $__export("ChangeDetection", $__m.ChangeDetection);
    }, function($__m) {
      $__export("CHECK_ONCE", $__m.CHECK_ONCE);
      $__export("CHECK_ALWAYS", $__m.CHECK_ALWAYS);
      $__export("DETACHED", $__m.DETACHED);
      $__export("CHECKED", $__m.CHECKED);
      $__export("ON_PUSH", $__m.ON_PUSH);
      $__export("DEFAULT", $__m.DEFAULT);
    }, function($__m) {
      $__export("DynamicProtoChangeDetector", $__m.DynamicProtoChangeDetector);
      $__export("JitProtoChangeDetector", $__m.JitProtoChangeDetector);
    }, function($__m) {
      $__export("BindingRecord", $__m.BindingRecord);
    }, function($__m) {
      $__export("DirectiveRecord", $__m.DirectiveRecord);
    }, function($__m) {
      $__export("DynamicChangeDetector", $__m.DynamicChangeDetector);
    }, function($__m) {
      $__export("ChangeDetectorRef", $__m.ChangeDetectorRef);
    }, function($__m) {
      $__export("PipeRegistry", $__m.PipeRegistry);
    }, function($__m) {
      $__export("uninitialized", $__m.uninitialized);
    }, function($__m) {
      $__export("NO_CHANGE", $__m.NO_CHANGE);
      $__export("Pipe", $__m.Pipe);
    }, function($__m) {
      $__export("defaultPipes", $__m.defaultPipes);
      $__export("DynamicChangeDetection", $__m.DynamicChangeDetection);
      $__export("JitChangeDetection", $__m.JitChangeDetection);
      $__export("defaultPipeRegistry", $__m.defaultPipeRegistry);
    }],
    execute: function() {}
  };
});

System.register("angular2/core", ["./src/core/annotations/visibility", "./src/core/compiler/interfaces", "./src/core/annotations/view", "./src/core/application", "./src/core/application_tokens", "./src/core/annotations/di", "./src/core/compiler/compiler", "angular2/src/render/dom/compiler/template_loader", "./src/core/compiler/dynamic_component_loader", "./src/core/compiler/element_injector", "./src/core/compiler/view", "./src/core/compiler/view_container", "./src/core/compiler/ng_element"], function($__export) {
  "use strict";
  var __moduleName = "angular2/core";
  var $__exportNames = {undefined: true};
  var $__exportNames = {undefined: true};
  var $__exportNames = {undefined: true};
  var $__exportNames = {undefined: true};
  var $__exportNames = {undefined: true};
  var $__exportNames = {undefined: true};
  var $__exportNames = {undefined: true};
  var $__exportNames = {undefined: true};
  var $__exportNames = {undefined: true};
  var $__exportNames = {undefined: true};
  var $__exportNames = {undefined: true};
  var $__exportNames = {undefined: true};
  return {
    setters: [function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      $__export("ElementRef", $__m.ElementRef);
      $__export("ComponentRef", $__m.ComponentRef);
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }],
    execute: function() {}
  };
});

System.register("angular2/di", ["./src/di/annotations", "./src/di/injector", "./src/di/binding", "./src/di/key", "./src/di/exceptions", "./src/di/opaque_token"], function($__export) {
  "use strict";
  var __moduleName = "angular2/di";
  return {
    setters: [function($__m) {
      $__export("Inject", $__m.Inject);
      $__export("InjectPromise", $__m.InjectPromise);
      $__export("InjectLazy", $__m.InjectLazy);
      $__export("Injectable", $__m.Injectable);
      $__export("Optional", $__m.Optional);
      $__export("DependencyAnnotation", $__m.DependencyAnnotation);
    }, function($__m) {
      $__export("Injector", $__m.Injector);
    }, function($__m) {
      $__export("Binding", $__m.Binding);
      $__export("ResolvedBinding", $__m.ResolvedBinding);
      $__export("Dependency", $__m.Dependency);
      $__export("bind", $__m.bind);
    }, function($__m) {
      $__export("Key", $__m.Key);
      $__export("KeyRegistry", $__m.KeyRegistry);
    }, function($__m) {
      $__export("KeyMetadataError", $__m.KeyMetadataError);
      $__export("NoBindingError", $__m.NoBindingError);
      $__export("AbstractBindingError", $__m.AbstractBindingError);
      $__export("AsyncBindingError", $__m.AsyncBindingError);
      $__export("CyclicDependencyError", $__m.CyclicDependencyError);
      $__export("InstantiationError", $__m.InstantiationError);
      $__export("InvalidBindingError", $__m.InvalidBindingError);
      $__export("NoAnnotationError", $__m.NoAnnotationError);
    }, function($__m) {
      $__export("OpaqueToken", $__m.OpaqueToken);
    }],
    execute: function() {}
  };
});

System.register("angular2/di_annotations", [], function($__export) {
  "use strict";
  var __moduleName = "angular2/di_annotations";
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("angular2/di_errors", [], function($__export) {
  "use strict";
  var __moduleName = "angular2/di_errors";
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("angular2/directives", ["./src/directives/class", "./src/directives/for", "./src/directives/if", "./src/directives/non_bindable", "./src/directives/switch"], function($__export) {
  "use strict";
  var __moduleName = "angular2/directives";
  var $__exportNames = {};
  var $__exportNames = {};
  var $__exportNames = {};
  var $__exportNames = {};
  var $__exportNames = {};
  return {
    setters: [function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }],
    execute: function() {}
  };
});

System.register("angular2/forms", ["./src/forms/model", "./src/forms/directives", "./src/forms/validators", "./src/forms/validator_directives", "./src/forms/form_builder"], function($__export) {
  "use strict";
  var __moduleName = "angular2/forms";
  var $__exportNames = {};
  var $__exportNames = {};
  var $__exportNames = {};
  var $__exportNames = {};
  var $__exportNames = {};
  return {
    setters: [function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }],
    execute: function() {}
  };
});

System.register("angular2/pipes", [], function($__export) {
  "use strict";
  var __moduleName = "angular2/pipes";
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("angular2/test", ["./src/test_lib/test_bed", "./src/test_lib/test_injector"], function($__export) {
  "use strict";
  var __moduleName = "angular2/test";
  var $__exportNames = {};
  var $__exportNames = {};
  return {
    setters: [function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }],
    execute: function() {}
  };
});

System.register("angular2/test_lib", ["./src/test_lib/test_lib", "./src/test_lib/utils"], function($__export) {
  "use strict";
  var __moduleName = "angular2/test_lib";
  var $__exportNames = {};
  var $__exportNames = {};
  return {
    setters: [function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }],
    execute: function() {}
  };
});

System.register("angular2/view", [], function($__export) {
  "use strict";
  var __moduleName = "angular2/view";
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("angular2/src/change_detection/abstract_change_detector", ["angular2/src/facade/lang", "angular2/src/facade/collection", "./change_detector_ref", "./interfaces", "./constants"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/change_detection/abstract_change_detector";
  var isPresent,
      List,
      ListWrapper,
      ChangeDetectorRef,
      ChangeDetector,
      CHECK_ALWAYS,
      CHECK_ONCE,
      CHECKED,
      DETACHED,
      ON_PUSH,
      AbstractChangeDetector;
  return {
    setters: [function($__m) {
      isPresent = $__m.isPresent;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      ChangeDetectorRef = $__m.ChangeDetectorRef;
    }, function($__m) {
      ChangeDetector = $__m.ChangeDetector;
    }, function($__m) {
      CHECK_ALWAYS = $__m.CHECK_ALWAYS;
      CHECK_ONCE = $__m.CHECK_ONCE;
      CHECKED = $__m.CHECKED;
      DETACHED = $__m.DETACHED;
      ON_PUSH = $__m.ON_PUSH;
    }],
    execute: function() {
      AbstractChangeDetector = (function($__super) {
        function AbstractChangeDetector() {
          $traceurRuntime.superConstructor(AbstractChangeDetector).call(this);
          this.lightDomChildren = [];
          this.shadowDomChildren = [];
          this.ref = new ChangeDetectorRef(this);
          this.mode = null;
        }
        return ($traceurRuntime.createClass)(AbstractChangeDetector, {
          addChild: function(cd) {
            ListWrapper.push(this.lightDomChildren, cd);
            cd.parent = this;
          },
          removeChild: function(cd) {
            ListWrapper.remove(this.lightDomChildren, cd);
          },
          addShadowDomChild: function(cd) {
            ListWrapper.push(this.shadowDomChildren, cd);
            cd.parent = this;
          },
          removeShadowDomChild: function(cd) {
            ListWrapper.remove(this.shadowDomChildren, cd);
          },
          remove: function() {
            this.parent.removeChild(this);
          },
          detectChanges: function() {
            this._detectChanges(false);
          },
          checkNoChanges: function() {
            this._detectChanges(true);
          },
          _detectChanges: function(throwOnChange) {
            if (this.mode === DETACHED || this.mode === CHECKED)
              return ;
            this.detectChangesInRecords(throwOnChange);
            this._detectChangesInLightDomChildren(throwOnChange);
            this.callOnAllChangesDone();
            this._detectChangesInShadowDomChildren(throwOnChange);
            if (this.mode === CHECK_ONCE)
              this.mode = CHECKED;
          },
          detectChangesInRecords: function(throwOnChange) {},
          callOnAllChangesDone: function() {},
          _detectChangesInLightDomChildren: function(throwOnChange) {
            var c = this.lightDomChildren;
            for (var i = 0; i < c.length; ++i) {
              c[i]._detectChanges(throwOnChange);
            }
          },
          _detectChangesInShadowDomChildren: function(throwOnChange) {
            var c = this.shadowDomChildren;
            for (var i = 0; i < c.length; ++i) {
              c[i]._detectChanges(throwOnChange);
            }
          },
          markAsCheckOnce: function() {
            this.mode = CHECK_ONCE;
          },
          markPathToRootAsCheckOnce: function() {
            var c = this;
            while (isPresent(c) && c.mode != DETACHED) {
              if (c.mode === CHECKED)
                c.mode = CHECK_ONCE;
              c = c.parent;
            }
          }
        }, {}, $__super);
      }(ChangeDetector));
      $__export("AbstractChangeDetector", AbstractChangeDetector);
      Object.defineProperty(AbstractChangeDetector.prototype.addChild, "parameters", {get: function() {
          return [[ChangeDetector]];
        }});
      Object.defineProperty(AbstractChangeDetector.prototype.removeChild, "parameters", {get: function() {
          return [[ChangeDetector]];
        }});
      Object.defineProperty(AbstractChangeDetector.prototype.addShadowDomChild, "parameters", {get: function() {
          return [[ChangeDetector]];
        }});
      Object.defineProperty(AbstractChangeDetector.prototype.removeShadowDomChild, "parameters", {get: function() {
          return [[ChangeDetector]];
        }});
      Object.defineProperty(AbstractChangeDetector.prototype._detectChanges, "parameters", {get: function() {
          return [[assert.type.boolean]];
        }});
      Object.defineProperty(AbstractChangeDetector.prototype.detectChangesInRecords, "parameters", {get: function() {
          return [[assert.type.boolean]];
        }});
      Object.defineProperty(AbstractChangeDetector.prototype._detectChangesInLightDomChildren, "parameters", {get: function() {
          return [[assert.type.boolean]];
        }});
      Object.defineProperty(AbstractChangeDetector.prototype._detectChangesInShadowDomChildren, "parameters", {get: function() {
          return [[assert.type.boolean]];
        }});
    }
  };
});

System.register("angular2/src/change_detection/binding_record", ["angular2/src/facade/lang", "angular2/src/reflection/types", "./parser/ast", "./directive_record"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/change_detection/binding_record";
  var isPresent,
      isBlank,
      SetterFn,
      AST,
      DirectiveRecord,
      DIRECTIVE,
      ELEMENT,
      TEXT_NODE,
      BindingRecord;
  return {
    setters: [function($__m) {
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
    }, function($__m) {
      SetterFn = $__m.SetterFn;
    }, function($__m) {
      AST = $__m.AST;
    }, function($__m) {
      DirectiveRecord = $__m.DirectiveRecord;
    }],
    execute: function() {
      DIRECTIVE = "directive";
      ELEMENT = "element";
      TEXT_NODE = "textNode";
      BindingRecord = (function() {
        function BindingRecord(mode, ast, elementIndex, propertyName, setter, directiveRecord) {
          this.mode = mode;
          this.ast = ast;
          this.elementIndex = elementIndex;
          this.propertyName = propertyName;
          this.setter = setter;
          this.directiveRecord = directiveRecord;
        }
        return ($traceurRuntime.createClass)(BindingRecord, {
          callOnChange: function() {
            return isPresent(this.directiveRecord) && this.directiveRecord.callOnChange;
          },
          isOnPushChangeDetection: function() {
            return isPresent(this.directiveRecord) && this.directiveRecord.isOnPushChangeDetection();
          },
          isDirective: function() {
            return this.mode === DIRECTIVE;
          },
          isElement: function() {
            return this.mode === ELEMENT;
          },
          isTextNode: function() {
            return this.mode === TEXT_NODE;
          }
        }, {
          createForDirective: function(ast, propertyName, setter, directiveRecord) {
            return new BindingRecord(DIRECTIVE, ast, 0, propertyName, setter, directiveRecord);
          },
          createForElement: function(ast, elementIndex, propertyName) {
            return new BindingRecord(ELEMENT, ast, elementIndex, propertyName, null, null);
          },
          createForTextNode: function(ast, elementIndex) {
            return new BindingRecord(TEXT_NODE, ast, elementIndex, null, null, null);
          }
        });
      }());
      $__export("BindingRecord", BindingRecord);
      Object.defineProperty(BindingRecord, "parameters", {get: function() {
          return [[assert.type.string], [AST], [assert.type.number], [assert.type.string], [SetterFn], [DirectiveRecord]];
        }});
      Object.defineProperty(BindingRecord.createForDirective, "parameters", {get: function() {
          return [[AST], [assert.type.string], [SetterFn], [DirectiveRecord]];
        }});
      Object.defineProperty(BindingRecord.createForElement, "parameters", {get: function() {
          return [[AST], [assert.type.number], [assert.type.string]];
        }});
      Object.defineProperty(BindingRecord.createForTextNode, "parameters", {get: function() {
          return [[AST], [assert.type.number]];
        }});
    }
  };
});

System.register("angular2/src/change_detection/change_detection", ["./proto_change_detector", "./pipes/pipe_registry", "./pipes/iterable_changes", "./pipes/keyvalue_changes", "./pipes/async_pipe", "./pipes/null_pipe", "./constants", "./interfaces", "angular2/di"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/change_detection/change_detection";
  var DynamicProtoChangeDetector,
      JitProtoChangeDetector,
      PipeRegistry,
      IterableChangesFactory,
      KeyValueChangesFactory,
      AsyncPipeFactory,
      NullPipeFactory,
      DEFAULT,
      ChangeDetection,
      ProtoChangeDetector,
      Injectable,
      keyValDiff,
      iterableDiff,
      async,
      defaultPipes,
      DynamicChangeDetection,
      JitChangeDetection,
      defaultPipeRegistry;
  return {
    setters: [function($__m) {
      DynamicProtoChangeDetector = $__m.DynamicProtoChangeDetector;
      JitProtoChangeDetector = $__m.JitProtoChangeDetector;
    }, function($__m) {
      PipeRegistry = $__m.PipeRegistry;
    }, function($__m) {
      IterableChangesFactory = $__m.IterableChangesFactory;
    }, function($__m) {
      KeyValueChangesFactory = $__m.KeyValueChangesFactory;
    }, function($__m) {
      AsyncPipeFactory = $__m.AsyncPipeFactory;
    }, function($__m) {
      NullPipeFactory = $__m.NullPipeFactory;
    }, function($__m) {
      DEFAULT = $__m.DEFAULT;
    }, function($__m) {
      ChangeDetection = $__m.ChangeDetection;
      ProtoChangeDetector = $__m.ProtoChangeDetector;
    }, function($__m) {
      Injectable = $__m.Injectable;
    }],
    execute: function() {
      keyValDiff = [new KeyValueChangesFactory(), new NullPipeFactory()];
      $__export("keyValDiff", keyValDiff);
      iterableDiff = [new IterableChangesFactory(), new NullPipeFactory()];
      $__export("iterableDiff", iterableDiff);
      async = [new AsyncPipeFactory(), new NullPipeFactory()];
      $__export("async", async);
      defaultPipes = {
        "iterableDiff": iterableDiff,
        "keyValDiff": keyValDiff,
        "async": async
      };
      $__export("defaultPipes", defaultPipes);
      DynamicChangeDetection = (function($__super) {
        function DynamicChangeDetection(registry) {
          $traceurRuntime.superConstructor(DynamicChangeDetection).call(this);
          this.registry = registry;
        }
        return ($traceurRuntime.createClass)(DynamicChangeDetection, {createProtoChangeDetector: function(name) {
            var changeControlStrategy = arguments[1] !== (void 0) ? arguments[1] : DEFAULT;
            return new DynamicProtoChangeDetector(this.registry, changeControlStrategy);
          }}, {}, $__super);
      }(ChangeDetection));
      $__export("DynamicChangeDetection", DynamicChangeDetection);
      Object.defineProperty(DynamicChangeDetection, "annotations", {get: function() {
          return [new Injectable()];
        }});
      Object.defineProperty(DynamicChangeDetection, "parameters", {get: function() {
          return [[PipeRegistry]];
        }});
      Object.defineProperty(DynamicChangeDetection.prototype.createProtoChangeDetector, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
      JitChangeDetection = (function($__super) {
        function JitChangeDetection(registry) {
          $traceurRuntime.superConstructor(JitChangeDetection).call(this);
          this.registry = registry;
        }
        return ($traceurRuntime.createClass)(JitChangeDetection, {createProtoChangeDetector: function(name) {
            var changeControlStrategy = arguments[1] !== (void 0) ? arguments[1] : DEFAULT;
            return new JitProtoChangeDetector(this.registry, changeControlStrategy);
          }}, {}, $__super);
      }(ChangeDetection));
      $__export("JitChangeDetection", JitChangeDetection);
      Object.defineProperty(JitChangeDetection, "annotations", {get: function() {
          return [new Injectable()];
        }});
      Object.defineProperty(JitChangeDetection, "parameters", {get: function() {
          return [[PipeRegistry]];
        }});
      Object.defineProperty(JitChangeDetection.prototype.createProtoChangeDetector, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
      defaultPipeRegistry = new PipeRegistry(defaultPipes);
      $__export("defaultPipeRegistry", defaultPipeRegistry);
    }
  };
});

System.register("angular2/src/change_detection/change_detection_jit_generator", ["angular2/src/facade/lang", "angular2/src/facade/collection", "./abstract_change_detector", "./change_detection_util", "./directive_record", "./proto_record"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/change_detection/change_detection_jit_generator";
  var isPresent,
      isBlank,
      BaseException,
      Type,
      List,
      ListWrapper,
      MapWrapper,
      StringMapWrapper,
      AbstractChangeDetector,
      ChangeDetectionUtil,
      DirectiveRecord,
      ProtoRecord,
      RECORD_TYPE_SELF,
      RECORD_TYPE_PROPERTY,
      RECORD_TYPE_LOCAL,
      RECORD_TYPE_INVOKE_METHOD,
      RECORD_TYPE_CONST,
      RECORD_TYPE_INVOKE_CLOSURE,
      RECORD_TYPE_PRIMITIVE_OP,
      RECORD_TYPE_KEYED_ACCESS,
      RECORD_TYPE_PIPE,
      RECORD_TYPE_BINDING_PIPE,
      RECORD_TYPE_INTERPOLATE,
      ABSTRACT_CHANGE_DETECTOR,
      UTIL,
      DISPATCHER_ACCESSOR,
      PIPE_REGISTRY_ACCESSOR,
      PROTOS_ACCESSOR,
      DIRECTIVES_ACCESSOR,
      CONTEXT_ACCESSOR,
      IS_CHANGED_LOCAL,
      CHANGES_LOCAL,
      LOCALS_ACCESSOR,
      MODE_ACCESSOR,
      TEMP_LOCAL,
      CURRENT_PROTO,
      ChangeDetectorJITGenerator;
  function typeTemplate(type, cons, detectChanges, notifyOnAllChangesDone, setContext) {
    return ("\n" + cons + "\n" + detectChanges + "\n" + notifyOnAllChangesDone + "\n" + setContext + ";\n\nreturn function(dispatcher, pipeRegistry) {\n  return new " + type + "(dispatcher, pipeRegistry, protos, directiveRecords);\n}\n");
  }
  function constructorTemplate(type, fieldsDefinitions) {
    return ("\nvar " + type + " = function " + type + "(dispatcher, pipeRegistry, protos, directiveRecords) {\n" + ABSTRACT_CHANGE_DETECTOR + ".call(this);\n" + DISPATCHER_ACCESSOR + " = dispatcher;\n" + PIPE_REGISTRY_ACCESSOR + " = pipeRegistry;\n" + PROTOS_ACCESSOR + " = protos;\n" + DIRECTIVES_ACCESSOR + " = directiveRecords;\n" + LOCALS_ACCESSOR + " = null;\n" + fieldsDefinitions + "\n}\n\n" + type + ".prototype = Object.create(" + ABSTRACT_CHANGE_DETECTOR + ".prototype);\n");
  }
  function pipeOnDestroyTemplate(pipeNames) {
    return pipeNames.map((function(p) {
      return (p + ".onDestroy()");
    })).join("\n");
  }
  function hydrateTemplate(type, mode, fieldDefinitions, pipeOnDestroy, directiveFieldNames, detectorFieldNames) {
    var directiveInit = "";
    for (var i = 0; i < directiveFieldNames.length; ++i) {
      directiveInit += (directiveFieldNames[i] + " = directives.getDirectiveFor(this.directiveRecords[" + i + "]);\n");
    }
    var detectorInit = "";
    for (var i = 0; i < detectorFieldNames.length; ++i) {
      detectorInit += (detectorFieldNames[i] + " = directives.getDetectorFor(this.directiveRecords[" + i + "]);\n");
    }
    return ("\n" + type + ".prototype.hydrate = function(context, locals, directives) {\n  " + MODE_ACCESSOR + " = \"" + mode + "\";\n  " + CONTEXT_ACCESSOR + " = context;\n  " + LOCALS_ACCESSOR + " = locals;\n  " + directiveInit + "\n  " + detectorInit + "\n}\n" + type + ".prototype.dehydrate = function() {\n  " + pipeOnDestroy + "\n  " + fieldDefinitions + "\n  " + LOCALS_ACCESSOR + " = null;\n}\n" + type + ".prototype.hydrated = function() {\n  return " + CONTEXT_ACCESSOR + " !== " + UTIL + ".unitialized();\n}\n");
  }
  function detectChangesTemplate(type, body) {
    return ("\n" + type + ".prototype.detectChangesInRecords = function(throwOnChange) {\n  " + body + "\n}\n");
  }
  function callOnAllChangesDoneTemplate(type, body) {
    return ("\n" + type + ".prototype.callOnAllChangesDone = function() {\n  " + body + "\n}\n");
  }
  function onAllChangesDoneTemplate(directive) {
    return (directive + ".onAllChangesDone();");
  }
  function detectChangesBodyTemplate(localDefinitions, changeDefinitions, records) {
    return ("\n" + localDefinitions + "\n" + changeDefinitions + "\nvar " + TEMP_LOCAL + ";\nvar " + IS_CHANGED_LOCAL + " = false;\nvar " + CURRENT_PROTO + ";\nvar " + CHANGES_LOCAL + " = null;\n\ncontext = " + CONTEXT_ACCESSOR + ";\n" + records + "\n");
  }
  function pipeCheckTemplate(protoIndex, context, bindingPropagationConfig, pipe, pipeType, oldValue, newValue, change, update, addToChanges, lastInDirective) {
    return ("\n" + CURRENT_PROTO + " = " + PROTOS_ACCESSOR + "[" + protoIndex + "];\nif (" + pipe + " === " + UTIL + ".unitialized()) {\n  " + pipe + " = " + PIPE_REGISTRY_ACCESSOR + ".get('" + pipeType + "', " + context + ", " + bindingPropagationConfig + ");\n} else if (!" + pipe + ".supports(" + context + ")) {\n  " + pipe + ".onDestroy();\n  " + pipe + " = " + PIPE_REGISTRY_ACCESSOR + ".get('" + pipeType + "', " + context + ", " + bindingPropagationConfig + ");\n}\n\n" + newValue + " = " + pipe + ".transform(" + context + ");\nif (! " + UTIL + ".noChangeMarker(" + newValue + ")) {\n  " + change + " = true;\n  " + update + "\n  " + addToChanges + "\n  " + oldValue + " = " + newValue + ";\n}\n" + lastInDirective + "\n");
  }
  function referenceCheckTemplate(protoIndex, assignment, oldValue, newValue, change, update, addToChanges, lastInDirective) {
    return ("\n" + CURRENT_PROTO + " = " + PROTOS_ACCESSOR + "[" + protoIndex + "];\n" + assignment + "\nif (" + newValue + " !== " + oldValue + " || (" + newValue + " !== " + newValue + ") && (" + oldValue + " !== " + oldValue + ")) {\n  " + change + " = true;\n  " + update + "\n  " + addToChanges + "\n  " + oldValue + " = " + newValue + ";\n}\n" + lastInDirective + "\n");
  }
  function assignmentTemplate(field, value) {
    return (field + " = " + value + ";");
  }
  function localDefinitionsTemplate(names) {
    return names.map((function(n) {
      return ("var " + n + ";");
    })).join("\n");
  }
  function changeDefinitionsTemplate(names) {
    return names.map((function(n) {
      return ("var " + n + " = false;");
    })).join("\n");
  }
  function fieldDefinitionsTemplate(names) {
    return names.map((function(n) {
      return (n + " = " + UTIL + ".unitialized();");
    })).join("\n");
  }
  function ifChangedGuardTemplate(changeNames, body) {
    var cond = changeNames.join(" || ");
    return ("\nif (" + cond + ") {\n  " + body + "\n}\n");
  }
  function addToChangesTemplate(oldValue, newValue) {
    return (CHANGES_LOCAL + " = " + UTIL + ".addChange(" + CHANGES_LOCAL + ", " + CURRENT_PROTO + ".bindingRecord.propertyName, " + UTIL + ".simpleChange(" + oldValue + ", " + newValue + "));");
  }
  function updateDirectiveTemplate(oldValue, newValue, directiveProperty) {
    return ("\nif(throwOnChange) " + UTIL + ".throwOnChange(" + CURRENT_PROTO + ", " + UTIL + ".simpleChange(" + oldValue + ", " + newValue + "));\n" + directiveProperty + " = " + newValue + ";\n" + IS_CHANGED_LOCAL + " = true;\n  ");
  }
  function updateElementTemplate(oldValue, newValue) {
    return ("\nif(throwOnChange) " + UTIL + ".throwOnChange(" + CURRENT_PROTO + ", " + UTIL + ".simpleChange(" + oldValue + ", " + newValue + "));\n" + DISPATCHER_ACCESSOR + ".notifyOnBinding(" + CURRENT_PROTO + ".bindingRecord, " + newValue + ");\n  ");
  }
  function notifyOnChangesTemplate(directive) {
    return ("\nif(" + CHANGES_LOCAL + ") {\n  " + directive + ".onChange(" + CHANGES_LOCAL + ");\n  " + CHANGES_LOCAL + " = null;\n}\n");
  }
  function notifyOnPushDetectorsTemplate(detector) {
    return ("\nif(" + IS_CHANGED_LOCAL + ") {\n  " + detector + ".markAsCheckOnce();\n}\n");
  }
  function lastInDirectiveTemplate(notifyOnChanges, notifyOnPush) {
    return ("\n" + notifyOnChanges + "\n" + notifyOnPush + "\n" + IS_CHANGED_LOCAL + " = false;\n");
  }
  return {
    setters: [function($__m) {
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
      BaseException = $__m.BaseException;
      Type = $__m.Type;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
      MapWrapper = $__m.MapWrapper;
      StringMapWrapper = $__m.StringMapWrapper;
    }, function($__m) {
      AbstractChangeDetector = $__m.AbstractChangeDetector;
    }, function($__m) {
      ChangeDetectionUtil = $__m.ChangeDetectionUtil;
    }, function($__m) {
      DirectiveRecord = $__m.DirectiveRecord;
    }, function($__m) {
      ProtoRecord = $__m.ProtoRecord;
      RECORD_TYPE_SELF = $__m.RECORD_TYPE_SELF;
      RECORD_TYPE_PROPERTY = $__m.RECORD_TYPE_PROPERTY;
      RECORD_TYPE_LOCAL = $__m.RECORD_TYPE_LOCAL;
      RECORD_TYPE_INVOKE_METHOD = $__m.RECORD_TYPE_INVOKE_METHOD;
      RECORD_TYPE_CONST = $__m.RECORD_TYPE_CONST;
      RECORD_TYPE_INVOKE_CLOSURE = $__m.RECORD_TYPE_INVOKE_CLOSURE;
      RECORD_TYPE_PRIMITIVE_OP = $__m.RECORD_TYPE_PRIMITIVE_OP;
      RECORD_TYPE_KEYED_ACCESS = $__m.RECORD_TYPE_KEYED_ACCESS;
      RECORD_TYPE_PIPE = $__m.RECORD_TYPE_PIPE;
      RECORD_TYPE_BINDING_PIPE = $__m.RECORD_TYPE_BINDING_PIPE;
      RECORD_TYPE_INTERPOLATE = $__m.RECORD_TYPE_INTERPOLATE;
    }],
    execute: function() {
      ABSTRACT_CHANGE_DETECTOR = "AbstractChangeDetector";
      UTIL = "ChangeDetectionUtil";
      DISPATCHER_ACCESSOR = "this.dispatcher";
      PIPE_REGISTRY_ACCESSOR = "this.pipeRegistry";
      PROTOS_ACCESSOR = "this.protos";
      DIRECTIVES_ACCESSOR = "this.directiveRecords";
      CONTEXT_ACCESSOR = "this.context";
      IS_CHANGED_LOCAL = "isChanged";
      CHANGES_LOCAL = "changes";
      LOCALS_ACCESSOR = "this.locals";
      MODE_ACCESSOR = "this.mode";
      TEMP_LOCAL = "temp";
      CURRENT_PROTO = "currentProto";
      Object.defineProperty(typeTemplate, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string], [assert.type.string], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(constructorTemplate, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(pipeOnDestroyTemplate, "parameters", {get: function() {
          return [[List]];
        }});
      Object.defineProperty(hydrateTemplate, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string], [assert.type.string], [assert.type.string], [assert.genericType(List, String)], [assert.genericType(List, String)]];
        }});
      Object.defineProperty(detectChangesTemplate, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(callOnAllChangesDoneTemplate, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(onAllChangesDoneTemplate, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(detectChangesBodyTemplate, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(pipeCheckTemplate, "parameters", {get: function() {
          return [[assert.type.number], [assert.type.string], [assert.type.string], [assert.type.string], [assert.type.string], [assert.type.string], [assert.type.string], [assert.type.string], [assert.type.string], [], [assert.type.string]];
        }});
      Object.defineProperty(referenceCheckTemplate, "parameters", {get: function() {
          return [[assert.type.number], [assert.type.string], [assert.type.string], [assert.type.string], [assert.type.string], [assert.type.string], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(assignmentTemplate, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(localDefinitionsTemplate, "parameters", {get: function() {
          return [[List]];
        }});
      Object.defineProperty(changeDefinitionsTemplate, "parameters", {get: function() {
          return [[List]];
        }});
      Object.defineProperty(fieldDefinitionsTemplate, "parameters", {get: function() {
          return [[List]];
        }});
      Object.defineProperty(ifChangedGuardTemplate, "parameters", {get: function() {
          return [[List], [assert.type.string]];
        }});
      Object.defineProperty(addToChangesTemplate, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(updateDirectiveTemplate, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(updateElementTemplate, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(notifyOnChangesTemplate, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(notifyOnPushDetectorsTemplate, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(lastInDirectiveTemplate, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
      ChangeDetectorJITGenerator = (function() {
        function ChangeDetectorJITGenerator(typeName, changeDetectionStrategy, records, directiveRecords) {
          this.typeName = typeName;
          this.changeDetectionStrategy = changeDetectionStrategy;
          this.records = records;
          this.directiveRecords = directiveRecords;
          this.localNames = this.getLocalNames(records);
          this.changeNames = this.getChangeNames(this.localNames);
          this.fieldNames = this.getFieldNames(this.localNames);
          this.pipeNames = this.getPipeNames(this.localNames);
        }
        return ($traceurRuntime.createClass)(ChangeDetectorJITGenerator, {
          getLocalNames: function(records) {
            var index = 0;
            var names = records.map((function(r) {
              var sanitizedName = r.name.replace(new RegExp("\\W", "g"), '');
              return ("" + sanitizedName + index++);
            }));
            return ["context"].concat(names);
          },
          getChangeNames: function(localNames) {
            return localNames.map((function(n) {
              return ("change_" + n);
            }));
          },
          getFieldNames: function(localNames) {
            return localNames.map((function(n) {
              return ("this." + n);
            }));
          },
          getPipeNames: function(localNames) {
            return localNames.map((function(n) {
              return ("this." + n + "_pipe");
            }));
          },
          generate: function() {
            var text = typeTemplate(this.typeName, this.genConstructor(), this.genDetectChanges(), this.genCallOnAllChangesDone(), this.genHydrate());
            return new Function('AbstractChangeDetector', 'ChangeDetectionUtil', 'protos', 'directiveRecords', text)(AbstractChangeDetector, ChangeDetectionUtil, this.records, this.directiveRecords);
          },
          genConstructor: function() {
            return constructorTemplate(this.typeName, this.genFieldDefinitions());
          },
          genHydrate: function() {
            var mode = ChangeDetectionUtil.changeDetectionMode(this.changeDetectionStrategy);
            return hydrateTemplate(this.typeName, mode, this.genFieldDefinitions(), pipeOnDestroyTemplate(this.getNonNullPipeNames()), this.getDirectiveFieldNames(), this.getDetectorFieldNames());
          },
          getDirectiveFieldNames: function() {
            var $__0 = this;
            return this.directiveRecords.map((function(d) {
              return $__0.getDirective(d);
            }));
          },
          getDetectorFieldNames: function() {
            var $__0 = this;
            return this.directiveRecords.filter((function(r) {
              return r.isOnPushChangeDetection();
            })).map((function(d) {
              return $__0.getDetector(d);
            }));
          },
          getDirective: function(d) {
            return ("this.directive_" + d.name);
          },
          getDetector: function(d) {
            return ("this.detector_" + d.name);
          },
          genFieldDefinitions: function() {
            var fields = [];
            fields = fields.concat(this.fieldNames);
            fields = fields.concat(this.getNonNullPipeNames());
            fields = fields.concat(this.getDirectiveFieldNames());
            fields = fields.concat(this.getDetectorFieldNames());
            return fieldDefinitionsTemplate(fields);
          },
          getNonNullPipeNames: function() {
            var $__0 = this;
            var pipes = [];
            this.records.forEach((function(r) {
              if (r.mode === RECORD_TYPE_PIPE || r.mode === RECORD_TYPE_BINDING_PIPE) {
                pipes.push($__0.pipeNames[r.selfIndex]);
              }
            }));
            return pipes;
          },
          genDetectChanges: function() {
            var body = this.genDetectChangesBody();
            return detectChangesTemplate(this.typeName, body);
          },
          genCallOnAllChangesDone: function() {
            var notifications = [];
            var dirs = this.directiveRecords;
            for (var i = dirs.length - 1; i >= 0; --i) {
              var dir = dirs[i];
              if (dir.callOnAllChangesDone) {
                var directive = ("this.directive_" + dir.name);
                notifications.push(onAllChangesDoneTemplate(directive));
              }
            }
            return callOnAllChangesDoneTemplate(this.typeName, notifications.join(";\n"));
          },
          genDetectChangesBody: function() {
            var $__0 = this;
            var rec = this.records.map((function(r) {
              return $__0.genRecord(r);
            })).join("\n");
            return detectChangesBodyTemplate(this.genLocalDefinitions(), this.genChangeDefinitions(), rec);
          },
          genLocalDefinitions: function() {
            return localDefinitionsTemplate(this.localNames);
          },
          genChangeDefinitions: function() {
            return changeDefinitionsTemplate(this.changeNames);
          },
          genRecord: function(r) {
            if (r.mode === RECORD_TYPE_PIPE || r.mode === RECORD_TYPE_BINDING_PIPE) {
              return this.genPipeCheck(r);
            } else {
              return this.genReferenceCheck(r);
            }
          },
          genPipeCheck: function(r) {
            var context = this.localNames[r.contextIndex];
            var oldValue = this.fieldNames[r.selfIndex];
            var newValue = this.localNames[r.selfIndex];
            var change = this.changeNames[r.selfIndex];
            var pipe = this.pipeNames[r.selfIndex];
            var cdRef = r.mode === RECORD_TYPE_BINDING_PIPE ? "this.ref" : "null";
            var update = this.genUpdateDirectiveOrElement(r);
            var addToChanges = this.genAddToChanges(r);
            var lastInDirective = this.genLastInDirective(r);
            return pipeCheckTemplate(r.selfIndex - 1, context, cdRef, pipe, r.name, oldValue, newValue, change, update, addToChanges, lastInDirective);
          },
          genReferenceCheck: function(r) {
            var oldValue = this.fieldNames[r.selfIndex];
            var newValue = this.localNames[r.selfIndex];
            var change = this.changeNames[r.selfIndex];
            var assignment = this.genUpdateCurrentValue(r);
            var update = this.genUpdateDirectiveOrElement(r);
            var addToChanges = this.genAddToChanges(r);
            var lastInDirective = this.genLastInDirective(r);
            var check = referenceCheckTemplate(r.selfIndex - 1, assignment, oldValue, newValue, change, update, addToChanges, lastInDirective);
            if (r.isPureFunction()) {
              return this.ifChangedGuard(r, check);
            } else {
              return check;
            }
          },
          genUpdateCurrentValue: function(r) {
            var context = this.localNames[r.contextIndex];
            var newValue = this.localNames[r.selfIndex];
            var args = this.genArgs(r);
            switch (r.mode) {
              case RECORD_TYPE_SELF:
                return assignmentTemplate(newValue, context);
              case RECORD_TYPE_CONST:
                return (newValue + " = " + this.genLiteral(r.funcOrValue));
              case RECORD_TYPE_PROPERTY:
                return assignmentTemplate(newValue, (context + "." + r.name));
              case RECORD_TYPE_LOCAL:
                return assignmentTemplate(newValue, (LOCALS_ACCESSOR + ".get('" + r.name + "')"));
              case RECORD_TYPE_INVOKE_METHOD:
                return assignmentTemplate(newValue, (context + "." + r.name + "(" + args + ")"));
              case RECORD_TYPE_INVOKE_CLOSURE:
                return assignmentTemplate(newValue, (context + "(" + args + ")"));
              case RECORD_TYPE_PRIMITIVE_OP:
                return assignmentTemplate(newValue, (UTIL + "." + r.name + "(" + args + ")"));
              case RECORD_TYPE_INTERPOLATE:
                return assignmentTemplate(newValue, this.genInterpolation(r));
              case RECORD_TYPE_KEYED_ACCESS:
                var key = this.localNames[r.args[0]];
                return assignmentTemplate(newValue, (context + "[" + key + "]"));
              default:
                throw new BaseException(("Unknown operation " + r.mode));
            }
          },
          ifChangedGuard: function(r, body) {
            var $__0 = this;
            return ifChangedGuardTemplate(r.args.map((function(a) {
              return $__0.changeNames[a];
            })), body);
          },
          genInterpolation: function(r) {
            var res = "";
            for (var i = 0; i < r.args.length; ++i) {
              res += this.genLiteral(r.fixedArgs[i]);
              res += " + ";
              res += this.localNames[r.args[i]];
              res += " + ";
            }
            res += this.genLiteral(r.fixedArgs[r.args.length]);
            return res;
          },
          genLiteral: function(value) {
            return JSON.stringify(value);
          },
          genUpdateDirectiveOrElement: function(r) {
            if (!r.lastInBinding)
              return "";
            var newValue = this.localNames[r.selfIndex];
            var oldValue = this.fieldNames[r.selfIndex];
            var br = r.bindingRecord;
            if (br.isDirective()) {
              var directiveProperty = (this.getDirective(br.directiveRecord) + "." + br.propertyName);
              return updateDirectiveTemplate(oldValue, newValue, directiveProperty);
            } else {
              return updateElementTemplate(oldValue, newValue);
            }
          },
          genAddToChanges: function(r) {
            var newValue = this.localNames[r.selfIndex];
            var oldValue = this.fieldNames[r.selfIndex];
            return r.bindingRecord.callOnChange() ? addToChangesTemplate(oldValue, newValue) : "";
          },
          genLastInDirective: function(r) {
            var onChanges = this.genNotifyOnChanges(r);
            var onPush = this.genNotifyOnPushDetectors(r);
            return lastInDirectiveTemplate(onChanges, onPush);
          },
          genNotifyOnChanges: function(r) {
            var br = r.bindingRecord;
            if (r.lastInDirective && br.callOnChange()) {
              return notifyOnChangesTemplate(this.getDirective(br.directiveRecord));
            } else {
              return "";
            }
          },
          genNotifyOnPushDetectors: function(r) {
            var br = r.bindingRecord;
            if (r.lastInDirective && br.isOnPushChangeDetection()) {
              return notifyOnPushDetectorsTemplate(this.getDetector(br.directiveRecord));
            } else {
              return "";
            }
          },
          genArgs: function(r) {
            var $__0 = this;
            return r.args.map((function(arg) {
              return $__0.localNames[arg];
            })).join(", ");
          }
        }, {});
      }());
      $__export("ChangeDetectorJITGenerator", ChangeDetectorJITGenerator);
      Object.defineProperty(ChangeDetectorJITGenerator, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string], [assert.genericType(List, ProtoRecord)], [List]];
        }});
      Object.defineProperty(ChangeDetectorJITGenerator.prototype.getLocalNames, "parameters", {get: function() {
          return [[assert.genericType(List, ProtoRecord)]];
        }});
      Object.defineProperty(ChangeDetectorJITGenerator.prototype.getChangeNames, "parameters", {get: function() {
          return [[assert.genericType(List, assert.type.string)]];
        }});
      Object.defineProperty(ChangeDetectorJITGenerator.prototype.getFieldNames, "parameters", {get: function() {
          return [[assert.genericType(List, assert.type.string)]];
        }});
      Object.defineProperty(ChangeDetectorJITGenerator.prototype.getPipeNames, "parameters", {get: function() {
          return [[assert.genericType(List, assert.type.string)]];
        }});
      Object.defineProperty(ChangeDetectorJITGenerator.prototype.getDirective, "parameters", {get: function() {
          return [[DirectiveRecord]];
        }});
      Object.defineProperty(ChangeDetectorJITGenerator.prototype.getDetector, "parameters", {get: function() {
          return [[DirectiveRecord]];
        }});
      Object.defineProperty(ChangeDetectorJITGenerator.prototype.genRecord, "parameters", {get: function() {
          return [[ProtoRecord]];
        }});
      Object.defineProperty(ChangeDetectorJITGenerator.prototype.genPipeCheck, "parameters", {get: function() {
          return [[ProtoRecord]];
        }});
      Object.defineProperty(ChangeDetectorJITGenerator.prototype.genReferenceCheck, "parameters", {get: function() {
          return [[ProtoRecord]];
        }});
      Object.defineProperty(ChangeDetectorJITGenerator.prototype.genUpdateCurrentValue, "parameters", {get: function() {
          return [[ProtoRecord]];
        }});
      Object.defineProperty(ChangeDetectorJITGenerator.prototype.ifChangedGuard, "parameters", {get: function() {
          return [[ProtoRecord], [assert.type.string]];
        }});
      Object.defineProperty(ChangeDetectorJITGenerator.prototype.genInterpolation, "parameters", {get: function() {
          return [[ProtoRecord]];
        }});
      Object.defineProperty(ChangeDetectorJITGenerator.prototype.genUpdateDirectiveOrElement, "parameters", {get: function() {
          return [[ProtoRecord]];
        }});
      Object.defineProperty(ChangeDetectorJITGenerator.prototype.genAddToChanges, "parameters", {get: function() {
          return [[ProtoRecord]];
        }});
      Object.defineProperty(ChangeDetectorJITGenerator.prototype.genLastInDirective, "parameters", {get: function() {
          return [[ProtoRecord]];
        }});
      Object.defineProperty(ChangeDetectorJITGenerator.prototype.genNotifyOnChanges, "parameters", {get: function() {
          return [[ProtoRecord]];
        }});
      Object.defineProperty(ChangeDetectorJITGenerator.prototype.genNotifyOnPushDetectors, "parameters", {get: function() {
          return [[ProtoRecord]];
        }});
      Object.defineProperty(ChangeDetectorJITGenerator.prototype.genArgs, "parameters", {get: function() {
          return [[ProtoRecord]];
        }});
    }
  };
});

System.register("angular2/src/change_detection/change_detection_util", ["angular2/src/facade/lang", "angular2/src/facade/collection", "./proto_record", "./exceptions", "./pipes/pipe", "./constants"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/change_detection/change_detection_util";
  var isPresent,
      isBlank,
      BaseException,
      Type,
      List,
      ListWrapper,
      MapWrapper,
      StringMapWrapper,
      ProtoRecord,
      ExpressionChangedAfterItHasBeenChecked,
      NO_CHANGE,
      CHECK_ALWAYS,
      CHECK_ONCE,
      CHECKED,
      DETACHED,
      ON_PUSH,
      uninitialized,
      SimpleChange,
      _simpleChangesIndex,
      _simpleChanges,
      ChangeDetectionUtil;
  function _simpleChange(previousValue, currentValue) {
    var index = _simpleChangesIndex++ % 20;
    var s = _simpleChanges[index];
    s.previousValue = previousValue;
    s.currentValue = currentValue;
    return s;
  }
  return {
    setters: [function($__m) {
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
      BaseException = $__m.BaseException;
      Type = $__m.Type;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
      MapWrapper = $__m.MapWrapper;
      StringMapWrapper = $__m.StringMapWrapper;
    }, function($__m) {
      ProtoRecord = $__m.ProtoRecord;
    }, function($__m) {
      ExpressionChangedAfterItHasBeenChecked = $__m.ExpressionChangedAfterItHasBeenChecked;
    }, function($__m) {
      NO_CHANGE = $__m.NO_CHANGE;
    }, function($__m) {
      CHECK_ALWAYS = $__m.CHECK_ALWAYS;
      CHECK_ONCE = $__m.CHECK_ONCE;
      CHECKED = $__m.CHECKED;
      DETACHED = $__m.DETACHED;
      ON_PUSH = $__m.ON_PUSH;
    }],
    execute: function() {
      uninitialized = new Object();
      $__export("uninitialized", uninitialized);
      SimpleChange = (function() {
        function SimpleChange(previousValue, currentValue) {
          this.previousValue = previousValue;
          this.currentValue = currentValue;
        }
        return ($traceurRuntime.createClass)(SimpleChange, {}, {});
      }());
      $__export("SimpleChange", SimpleChange);
      Object.defineProperty(SimpleChange, "parameters", {get: function() {
          return [[assert.type.any], [assert.type.any]];
        }});
      _simpleChangesIndex = 0;
      _simpleChanges = [new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null), new SimpleChange(null, null)];
      ChangeDetectionUtil = (function() {
        function ChangeDetectionUtil() {}
        return ($traceurRuntime.createClass)(ChangeDetectionUtil, {}, {
          unitialized: function() {
            return uninitialized;
          },
          arrayFn0: function() {
            return [];
          },
          arrayFn1: function(a1) {
            return [a1];
          },
          arrayFn2: function(a1, a2) {
            return [a1, a2];
          },
          arrayFn3: function(a1, a2, a3) {
            return [a1, a2, a3];
          },
          arrayFn4: function(a1, a2, a3, a4) {
            return [a1, a2, a3, a4];
          },
          arrayFn5: function(a1, a2, a3, a4, a5) {
            return [a1, a2, a3, a4, a5];
          },
          arrayFn6: function(a1, a2, a3, a4, a5, a6) {
            return [a1, a2, a3, a4, a5, a6];
          },
          arrayFn7: function(a1, a2, a3, a4, a5, a6, a7) {
            return [a1, a2, a3, a4, a5, a6, a7];
          },
          arrayFn8: function(a1, a2, a3, a4, a5, a6, a7, a8) {
            return [a1, a2, a3, a4, a5, a6, a7, a8];
          },
          arrayFn9: function(a1, a2, a3, a4, a5, a6, a7, a8, a9) {
            return [a1, a2, a3, a4, a5, a6, a7, a8, a9];
          },
          operation_negate: function(value) {
            return !value;
          },
          operation_add: function(left, right) {
            return left + right;
          },
          operation_subtract: function(left, right) {
            return left - right;
          },
          operation_multiply: function(left, right) {
            return left * right;
          },
          operation_divide: function(left, right) {
            return left / right;
          },
          operation_remainder: function(left, right) {
            return left % right;
          },
          operation_equals: function(left, right) {
            return left == right;
          },
          operation_not_equals: function(left, right) {
            return left != right;
          },
          operation_less_then: function(left, right) {
            return left < right;
          },
          operation_greater_then: function(left, right) {
            return left > right;
          },
          operation_less_or_equals_then: function(left, right) {
            return left <= right;
          },
          operation_greater_or_equals_then: function(left, right) {
            return left >= right;
          },
          operation_logical_and: function(left, right) {
            return left && right;
          },
          operation_logical_or: function(left, right) {
            return left || right;
          },
          cond: function(cond, trueVal, falseVal) {
            return cond ? trueVal : falseVal;
          },
          mapFn: function(keys) {
            function buildMap(values) {
              var res = StringMapWrapper.create();
              for (var i = 0; i < keys.length; ++i) {
                StringMapWrapper.set(res, keys[i], values[i]);
              }
              return res;
            }
            switch (keys.length) {
              case 0:
                return (function() {
                  return [];
                });
              case 1:
                return (function(a1) {
                  return buildMap([a1]);
                });
              case 2:
                return (function(a1, a2) {
                  return buildMap([a1, a2]);
                });
              case 3:
                return (function(a1, a2, a3) {
                  return buildMap([a1, a2, a3]);
                });
              case 4:
                return (function(a1, a2, a3, a4) {
                  return buildMap([a1, a2, a3, a4]);
                });
              case 5:
                return (function(a1, a2, a3, a4, a5) {
                  return buildMap([a1, a2, a3, a4, a5]);
                });
              case 6:
                return (function(a1, a2, a3, a4, a5, a6) {
                  return buildMap([a1, a2, a3, a4, a5, a6]);
                });
              case 7:
                return (function(a1, a2, a3, a4, a5, a6, a7) {
                  return buildMap([a1, a2, a3, a4, a5, a6, a7]);
                });
              case 8:
                return (function(a1, a2, a3, a4, a5, a6, a7, a8) {
                  return buildMap([a1, a2, a3, a4, a5, a6, a7, a8]);
                });
              case 9:
                return (function(a1, a2, a3, a4, a5, a6, a7, a8, a9) {
                  return buildMap([a1, a2, a3, a4, a5, a6, a7, a8, a9]);
                });
              default:
                throw new BaseException("Does not support literal maps with more than 9 elements");
            }
          },
          keyedAccess: function(obj, args) {
            return obj[args[0]];
          },
          noChangeMarker: function(value) {
            return value === NO_CHANGE;
          },
          throwOnChange: function(proto, change) {
            throw new ExpressionChangedAfterItHasBeenChecked(proto, change);
          },
          changeDetectionMode: function(strategy) {
            return strategy == ON_PUSH ? CHECK_ONCE : CHECK_ALWAYS;
          },
          simpleChange: function(previousValue, currentValue) {
            return _simpleChange(previousValue, currentValue);
          },
          addChange: function(changes, propertyName, change) {
            if (isBlank(changes)) {
              changes = {};
            }
            changes[propertyName] = change;
            return changes;
          }
        });
      }());
      $__export("ChangeDetectionUtil", ChangeDetectionUtil);
      Object.defineProperty(ChangeDetectionUtil.mapFn, "parameters", {get: function() {
          return [[List]];
        }});
      Object.defineProperty(ChangeDetectionUtil.throwOnChange, "parameters", {get: function() {
          return [[ProtoRecord], []];
        }});
      Object.defineProperty(ChangeDetectionUtil.changeDetectionMode, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(ChangeDetectionUtil.simpleChange, "parameters", {get: function() {
          return [[assert.type.any], [assert.type.any]];
        }});
      Object.defineProperty(ChangeDetectionUtil.addChange, "parameters", {get: function() {
          return [[], [assert.type.string], []];
        }});
    }
  };
});

System.register("angular2/src/change_detection/change_detector_ref", ["./interfaces", "./constants"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/change_detection/change_detector_ref";
  var ChangeDetector,
      CHECK_ONCE,
      DETACHED,
      CHECK_ALWAYS,
      ChangeDetectorRef;
  return {
    setters: [function($__m) {
      ChangeDetector = $__m.ChangeDetector;
    }, function($__m) {
      CHECK_ONCE = $__m.CHECK_ONCE;
      DETACHED = $__m.DETACHED;
      CHECK_ALWAYS = $__m.CHECK_ALWAYS;
    }],
    execute: function() {
      ChangeDetectorRef = (function() {
        function ChangeDetectorRef(cd) {
          this._cd = cd;
        }
        return ($traceurRuntime.createClass)(ChangeDetectorRef, {
          requestCheck: function() {
            this._cd.markPathToRootAsCheckOnce();
          },
          detach: function() {
            this._cd.mode = DETACHED;
          },
          reattach: function() {
            this._cd.mode = CHECK_ALWAYS;
            this.requestCheck();
          }
        }, {});
      }());
      $__export("ChangeDetectorRef", ChangeDetectorRef);
      Object.defineProperty(ChangeDetectorRef, "parameters", {get: function() {
          return [[ChangeDetector]];
        }});
    }
  };
});

System.register("angular2/src/change_detection/coalesce", ["angular2/src/facade/lang", "angular2/src/facade/collection", "./proto_record"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/change_detection/coalesce";
  var isPresent,
      List,
      ListWrapper,
      Map,
      MapWrapper,
      RECORD_TYPE_SELF,
      ProtoRecord;
  function coalesce(records) {
    var res = ListWrapper.create();
    var indexMap = MapWrapper.create();
    for (var i = 0; i < records.length; ++i) {
      var r = records[i];
      var record = _replaceIndices(r, res.length + 1, indexMap);
      var matchingRecord = _findMatching(record, res);
      if (isPresent(matchingRecord) && record.lastInBinding) {
        ListWrapper.push(res, _selfRecord(record, matchingRecord.selfIndex, res.length + 1));
        MapWrapper.set(indexMap, r.selfIndex, matchingRecord.selfIndex);
      } else if (isPresent(matchingRecord) && !record.lastInBinding) {
        MapWrapper.set(indexMap, r.selfIndex, matchingRecord.selfIndex);
      } else {
        ListWrapper.push(res, record);
        MapWrapper.set(indexMap, r.selfIndex, record.selfIndex);
      }
    }
    return res;
  }
  function _selfRecord(r, contextIndex, selfIndex) {
    return new ProtoRecord(RECORD_TYPE_SELF, "self", null, [], r.fixedArgs, contextIndex, selfIndex, r.bindingRecord, r.expressionAsString, r.lastInBinding, r.lastInDirective);
  }
  function _findMatching(r, rs) {
    return ListWrapper.find(rs, (function(rr) {
      return rr.mode === r.mode && rr.funcOrValue === r.funcOrValue && rr.contextIndex === r.contextIndex && ListWrapper.equals(rr.args, r.args);
    }));
  }
  function _replaceIndices(r, selfIndex, indexMap) {
    var args = ListWrapper.map(r.args, (function(a) {
      return _map(indexMap, a);
    }));
    var contextIndex = _map(indexMap, r.contextIndex);
    return new ProtoRecord(r.mode, r.name, r.funcOrValue, args, r.fixedArgs, contextIndex, selfIndex, r.bindingRecord, r.expressionAsString, r.lastInBinding, r.lastInDirective);
  }
  function _map(indexMap, value) {
    var r = MapWrapper.get(indexMap, value);
    return isPresent(r) ? r : value;
  }
  $__export("coalesce", coalesce);
  return {
    setters: [function($__m) {
      isPresent = $__m.isPresent;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
      Map = $__m.Map;
      MapWrapper = $__m.MapWrapper;
    }, function($__m) {
      RECORD_TYPE_SELF = $__m.RECORD_TYPE_SELF;
      ProtoRecord = $__m.ProtoRecord;
    }],
    execute: function() {
      Object.defineProperty(coalesce, "parameters", {get: function() {
          return [[assert.genericType(List, ProtoRecord)]];
        }});
      Object.defineProperty(_selfRecord, "parameters", {get: function() {
          return [[ProtoRecord], [assert.type.number], [assert.type.number]];
        }});
      Object.defineProperty(_findMatching, "parameters", {get: function() {
          return [[ProtoRecord], [assert.genericType(List, ProtoRecord)]];
        }});
      Object.defineProperty(_replaceIndices, "parameters", {get: function() {
          return [[ProtoRecord], [assert.type.number], [Map]];
        }});
      Object.defineProperty(_map, "parameters", {get: function() {
          return [[Map], [assert.type.number]];
        }});
    }
  };
});

System.register("angular2/src/change_detection/constants", [], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/change_detection/constants";
  var CHECK_ONCE,
      CHECKED,
      CHECK_ALWAYS,
      DETACHED,
      ON_PUSH,
      DEFAULT;
  return {
    setters: [],
    execute: function() {
      CHECK_ONCE = "CHECK_ONCE";
      $__export("CHECK_ONCE", CHECK_ONCE);
      CHECKED = "CHECKED";
      $__export("CHECKED", CHECKED);
      CHECK_ALWAYS = "ALWAYS_CHECK";
      $__export("CHECK_ALWAYS", CHECK_ALWAYS);
      DETACHED = "DETACHED";
      $__export("DETACHED", DETACHED);
      ON_PUSH = "ON_PUSH";
      $__export("ON_PUSH", ON_PUSH);
      DEFAULT = "DEFAULT";
      $__export("DEFAULT", DEFAULT);
    }
  };
});

System.register("angular2/src/change_detection/directive_record", ["./constants", "angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/change_detection/directive_record";
  var ON_PUSH,
      StringWrapper,
      DirectiveRecord;
  return {
    setters: [function($__m) {
      ON_PUSH = $__m.ON_PUSH;
    }, function($__m) {
      StringWrapper = $__m.StringWrapper;
    }],
    execute: function() {
      DirectiveRecord = (function() {
        function DirectiveRecord(elementIndex, directiveIndex, callOnAllChangesDone, callOnChange, changeDetection) {
          this.elementIndex = elementIndex;
          this.directiveIndex = directiveIndex;
          this.callOnAllChangesDone = callOnAllChangesDone;
          this.callOnChange = callOnChange;
          this.changeDetection = changeDetection;
        }
        return ($traceurRuntime.createClass)(DirectiveRecord, {
          isOnPushChangeDetection: function() {
            return StringWrapper.equals(this.changeDetection, ON_PUSH);
          },
          get name() {
            return (this.elementIndex + "_" + this.directiveIndex);
          }
        }, {});
      }());
      $__export("DirectiveRecord", DirectiveRecord);
      Object.defineProperty(DirectiveRecord, "parameters", {get: function() {
          return [[assert.type.number], [assert.type.number], [assert.type.boolean], [assert.type.boolean], [assert.type.string]];
        }});
    }
  };
});

System.register("angular2/src/change_detection/dynamic_change_detector", ["angular2/src/facade/lang", "angular2/src/facade/collection", "./abstract_change_detector", "./binding_record", "./directive_record", "./pipes/pipe_registry", "./change_detection_util", "./proto_record", "./exceptions"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/change_detection/dynamic_change_detector";
  var isPresent,
      isBlank,
      BaseException,
      FunctionWrapper,
      List,
      ListWrapper,
      MapWrapper,
      StringMapWrapper,
      AbstractChangeDetector,
      BindingRecord,
      DirectiveRecord,
      PipeRegistry,
      ChangeDetectionUtil,
      uninitialized,
      ProtoRecord,
      RECORD_TYPE_SELF,
      RECORD_TYPE_PROPERTY,
      RECORD_TYPE_LOCAL,
      RECORD_TYPE_INVOKE_METHOD,
      RECORD_TYPE_CONST,
      RECORD_TYPE_INVOKE_CLOSURE,
      RECORD_TYPE_PRIMITIVE_OP,
      RECORD_TYPE_KEYED_ACCESS,
      RECORD_TYPE_PIPE,
      RECORD_TYPE_BINDING_PIPE,
      RECORD_TYPE_INTERPOLATE,
      ExpressionChangedAfterItHasBeenChecked,
      ChangeDetectionError,
      DynamicChangeDetector;
  function isSame(a, b) {
    if (a === b)
      return true;
    if (a instanceof String && b instanceof String && a == b)
      return true;
    if ((a !== a) && (b !== b))
      return true;
    return false;
  }
  return {
    setters: [function($__m) {
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
      BaseException = $__m.BaseException;
      FunctionWrapper = $__m.FunctionWrapper;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
      MapWrapper = $__m.MapWrapper;
      StringMapWrapper = $__m.StringMapWrapper;
    }, function($__m) {
      AbstractChangeDetector = $__m.AbstractChangeDetector;
    }, function($__m) {
      BindingRecord = $__m.BindingRecord;
    }, function($__m) {
      DirectiveRecord = $__m.DirectiveRecord;
    }, function($__m) {
      PipeRegistry = $__m.PipeRegistry;
    }, function($__m) {
      ChangeDetectionUtil = $__m.ChangeDetectionUtil;
      uninitialized = $__m.uninitialized;
    }, function($__m) {
      ProtoRecord = $__m.ProtoRecord;
      RECORD_TYPE_SELF = $__m.RECORD_TYPE_SELF;
      RECORD_TYPE_PROPERTY = $__m.RECORD_TYPE_PROPERTY;
      RECORD_TYPE_LOCAL = $__m.RECORD_TYPE_LOCAL;
      RECORD_TYPE_INVOKE_METHOD = $__m.RECORD_TYPE_INVOKE_METHOD;
      RECORD_TYPE_CONST = $__m.RECORD_TYPE_CONST;
      RECORD_TYPE_INVOKE_CLOSURE = $__m.RECORD_TYPE_INVOKE_CLOSURE;
      RECORD_TYPE_PRIMITIVE_OP = $__m.RECORD_TYPE_PRIMITIVE_OP;
      RECORD_TYPE_KEYED_ACCESS = $__m.RECORD_TYPE_KEYED_ACCESS;
      RECORD_TYPE_PIPE = $__m.RECORD_TYPE_PIPE;
      RECORD_TYPE_BINDING_PIPE = $__m.RECORD_TYPE_BINDING_PIPE;
      RECORD_TYPE_INTERPOLATE = $__m.RECORD_TYPE_INTERPOLATE;
    }, function($__m) {
      ExpressionChangedAfterItHasBeenChecked = $__m.ExpressionChangedAfterItHasBeenChecked;
      ChangeDetectionError = $__m.ChangeDetectionError;
    }],
    execute: function() {
      DynamicChangeDetector = (function($__super) {
        function DynamicChangeDetector(changeControlStrategy, dispatcher, pipeRegistry, protoRecords, directiveRecords) {
          $traceurRuntime.superConstructor(DynamicChangeDetector).call(this);
          this.dispatcher = dispatcher;
          this.pipeRegistry = pipeRegistry;
          this.values = ListWrapper.createFixedSize(protoRecords.length + 1);
          this.pipes = ListWrapper.createFixedSize(protoRecords.length + 1);
          this.prevContexts = ListWrapper.createFixedSize(protoRecords.length + 1);
          this.changes = ListWrapper.createFixedSize(protoRecords.length + 1);
          ListWrapper.fill(this.values, uninitialized);
          ListWrapper.fill(this.pipes, null);
          ListWrapper.fill(this.prevContexts, uninitialized);
          ListWrapper.fill(this.changes, false);
          this.locals = null;
          this.directives = null;
          this.protos = protoRecords;
          this.directiveRecords = directiveRecords;
          this.changeControlStrategy = changeControlStrategy;
        }
        return ($traceurRuntime.createClass)(DynamicChangeDetector, {
          hydrate: function(context, locals, directives) {
            this.mode = ChangeDetectionUtil.changeDetectionMode(this.changeControlStrategy);
            this.values[0] = context;
            this.locals = locals;
            this.directives = directives;
          },
          dehydrate: function() {
            this._destroyPipes();
            ListWrapper.fill(this.values, uninitialized);
            ListWrapper.fill(this.changes, false);
            ListWrapper.fill(this.pipes, null);
            ListWrapper.fill(this.prevContexts, uninitialized);
            this.locals = null;
          },
          _destroyPipes: function() {
            for (var i = 0; i < this.pipes.length; ++i) {
              if (isPresent(this.pipes[i])) {
                this.pipes[i].onDestroy();
              }
            }
          },
          hydrated: function() {
            return this.values[0] !== uninitialized;
          },
          detectChangesInRecords: function(throwOnChange) {
            var protos = this.protos;
            var changes = null;
            var isChanged = false;
            for (var i = 0; i < protos.length; ++i) {
              var proto = protos[i];
              var bindingRecord = proto.bindingRecord;
              var directiveRecord = bindingRecord.directiveRecord;
              var change = this._check(proto);
              if (isPresent(change)) {
                if (throwOnChange)
                  ChangeDetectionUtil.throwOnChange(proto, change);
                this._updateDirectiveOrElement(change, bindingRecord);
                isChanged = true;
                changes = this._addChange(bindingRecord, change, changes);
              }
              if (proto.lastInDirective) {
                if (isPresent(changes)) {
                  this._getDirectiveFor(directiveRecord).onChange(changes);
                  changes = null;
                }
                if (isChanged && bindingRecord.isOnPushChangeDetection()) {
                  this._getDetectorFor(directiveRecord).markAsCheckOnce();
                }
                isChanged = false;
              }
            }
          },
          callOnAllChangesDone: function() {
            var dirs = this.directiveRecords;
            for (var i = dirs.length - 1; i >= 0; --i) {
              var dir = dirs[i];
              if (dir.callOnAllChangesDone) {
                this._getDirectiveFor(dir).onAllChangesDone();
              }
            }
          },
          _updateDirectiveOrElement: function(change, bindingRecord) {
            if (isBlank(bindingRecord.directiveRecord)) {
              this.dispatcher.notifyOnBinding(bindingRecord, change.currentValue);
            } else {
              bindingRecord.setter(this._getDirectiveFor(bindingRecord.directiveRecord), change.currentValue);
            }
          },
          _addChange: function(bindingRecord, change, changes) {
            if (bindingRecord.callOnChange()) {
              return ChangeDetectionUtil.addChange(changes, bindingRecord.propertyName, change);
            } else {
              return changes;
            }
          },
          _getDirectiveFor: function(directive) {
            return this.directives.getDirectiveFor(directive);
          },
          _getDetectorFor: function(directive) {
            return this.directives.getDetectorFor(directive);
          },
          _check: function(proto) {
            try {
              if (proto.mode === RECORD_TYPE_PIPE || proto.mode === RECORD_TYPE_BINDING_PIPE) {
                return this._pipeCheck(proto);
              } else {
                return this._referenceCheck(proto);
              }
            } catch (e) {
              throw new ChangeDetectionError(proto, e);
            }
          },
          _referenceCheck: function(proto) {
            if (this._pureFuncAndArgsDidNotChange(proto)) {
              this._setChanged(proto, false);
              return null;
            }
            var prevValue = this._readSelf(proto);
            var currValue = this._calculateCurrValue(proto);
            if (!isSame(prevValue, currValue)) {
              this._writeSelf(proto, currValue);
              this._setChanged(proto, true);
              if (proto.lastInBinding) {
                return ChangeDetectionUtil.simpleChange(prevValue, currValue);
              } else {
                return null;
              }
            } else {
              this._setChanged(proto, false);
              return null;
            }
          },
          _calculateCurrValue: function(proto) {
            switch (proto.mode) {
              case RECORD_TYPE_SELF:
                return this._readContext(proto);
              case RECORD_TYPE_CONST:
                return proto.funcOrValue;
              case RECORD_TYPE_PROPERTY:
                var context = this._readContext(proto);
                return proto.funcOrValue(context);
              case RECORD_TYPE_LOCAL:
                return this.locals.get(proto.name);
              case RECORD_TYPE_INVOKE_METHOD:
                var context = this._readContext(proto);
                var args = this._readArgs(proto);
                return proto.funcOrValue(context, args);
              case RECORD_TYPE_KEYED_ACCESS:
                var arg = this._readArgs(proto)[0];
                return this._readContext(proto)[arg];
              case RECORD_TYPE_INVOKE_CLOSURE:
                return FunctionWrapper.apply(this._readContext(proto), this._readArgs(proto));
              case RECORD_TYPE_INTERPOLATE:
              case RECORD_TYPE_PRIMITIVE_OP:
                return FunctionWrapper.apply(proto.funcOrValue, this._readArgs(proto));
              default:
                throw new BaseException(("Unknown operation " + proto.mode));
            }
          },
          _pipeCheck: function(proto) {
            var context = this._readContext(proto);
            var pipe = this._pipeFor(proto, context);
            var newValue = pipe.transform(context);
            if (!ChangeDetectionUtil.noChangeMarker(newValue)) {
              var prevValue = this._readSelf(proto);
              this._writeSelf(proto, newValue);
              this._setChanged(proto, true);
              if (proto.lastInBinding) {
                return ChangeDetectionUtil.simpleChange(prevValue, newValue);
              } else {
                return null;
              }
            } else {
              this._setChanged(proto, false);
              return null;
            }
          },
          _pipeFor: function(proto, context) {
            var storedPipe = this._readPipe(proto);
            if (isPresent(storedPipe) && storedPipe.supports(context)) {
              return storedPipe;
            }
            if (isPresent(storedPipe)) {
              storedPipe.onDestroy();
            }
            var cdr = proto.mode === RECORD_TYPE_BINDING_PIPE ? this.ref : null;
            var pipe = this.pipeRegistry.get(proto.name, context, cdr);
            this._writePipe(proto, pipe);
            return pipe;
          },
          _readContext: function(proto) {
            return this.values[proto.contextIndex];
          },
          _readSelf: function(proto) {
            return this.values[proto.selfIndex];
          },
          _writeSelf: function(proto, value) {
            this.values[proto.selfIndex] = value;
          },
          _readPipe: function(proto) {
            return this.pipes[proto.selfIndex];
          },
          _writePipe: function(proto, value) {
            this.pipes[proto.selfIndex] = value;
          },
          _setChanged: function(proto, value) {
            this.changes[proto.selfIndex] = value;
          },
          _pureFuncAndArgsDidNotChange: function(proto) {
            return proto.isPureFunction() && !this._argsChanged(proto);
          },
          _argsChanged: function(proto) {
            var args = proto.args;
            for (var i = 0; i < args.length; ++i) {
              if (this.changes[args[i]]) {
                return true;
              }
            }
            return false;
          },
          _readArgs: function(proto) {
            var res = ListWrapper.createFixedSize(proto.args.length);
            var args = proto.args;
            for (var i = 0; i < args.length; ++i) {
              res[i] = this.values[args[i]];
            }
            return res;
          }
        }, {}, $__super);
      }(AbstractChangeDetector));
      $__export("DynamicChangeDetector", DynamicChangeDetector);
      Object.defineProperty(DynamicChangeDetector, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.any], [PipeRegistry], [assert.genericType(List, ProtoRecord)], [List]];
        }});
      Object.defineProperty(DynamicChangeDetector.prototype.hydrate, "parameters", {get: function() {
          return [[assert.type.any], [assert.type.any], [assert.type.any]];
        }});
      Object.defineProperty(DynamicChangeDetector.prototype.detectChangesInRecords, "parameters", {get: function() {
          return [[assert.type.boolean]];
        }});
      Object.defineProperty(DynamicChangeDetector.prototype._addChange, "parameters", {get: function() {
          return [[BindingRecord], [], []];
        }});
      Object.defineProperty(DynamicChangeDetector.prototype._getDirectiveFor, "parameters", {get: function() {
          return [[DirectiveRecord]];
        }});
      Object.defineProperty(DynamicChangeDetector.prototype._getDetectorFor, "parameters", {get: function() {
          return [[DirectiveRecord]];
        }});
      Object.defineProperty(DynamicChangeDetector.prototype._check, "parameters", {get: function() {
          return [[ProtoRecord]];
        }});
      Object.defineProperty(DynamicChangeDetector.prototype._referenceCheck, "parameters", {get: function() {
          return [[ProtoRecord]];
        }});
      Object.defineProperty(DynamicChangeDetector.prototype._calculateCurrValue, "parameters", {get: function() {
          return [[ProtoRecord]];
        }});
      Object.defineProperty(DynamicChangeDetector.prototype._pipeCheck, "parameters", {get: function() {
          return [[ProtoRecord]];
        }});
      Object.defineProperty(DynamicChangeDetector.prototype._pipeFor, "parameters", {get: function() {
          return [[ProtoRecord], []];
        }});
      Object.defineProperty(DynamicChangeDetector.prototype._readContext, "parameters", {get: function() {
          return [[ProtoRecord]];
        }});
      Object.defineProperty(DynamicChangeDetector.prototype._readSelf, "parameters", {get: function() {
          return [[ProtoRecord]];
        }});
      Object.defineProperty(DynamicChangeDetector.prototype._writeSelf, "parameters", {get: function() {
          return [[ProtoRecord], []];
        }});
      Object.defineProperty(DynamicChangeDetector.prototype._readPipe, "parameters", {get: function() {
          return [[ProtoRecord]];
        }});
      Object.defineProperty(DynamicChangeDetector.prototype._writePipe, "parameters", {get: function() {
          return [[ProtoRecord], []];
        }});
      Object.defineProperty(DynamicChangeDetector.prototype._setChanged, "parameters", {get: function() {
          return [[ProtoRecord], [assert.type.boolean]];
        }});
      Object.defineProperty(DynamicChangeDetector.prototype._pureFuncAndArgsDidNotChange, "parameters", {get: function() {
          return [[ProtoRecord]];
        }});
      Object.defineProperty(DynamicChangeDetector.prototype._argsChanged, "parameters", {get: function() {
          return [[ProtoRecord]];
        }});
      Object.defineProperty(DynamicChangeDetector.prototype._readArgs, "parameters", {get: function() {
          return [[ProtoRecord]];
        }});
    }
  };
});

System.register("angular2/src/change_detection/exceptions", ["./proto_record"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/change_detection/exceptions";
  var ProtoRecord,
      ExpressionChangedAfterItHasBeenChecked,
      ChangeDetectionError;
  return {
    setters: [function($__m) {
      ProtoRecord = $__m.ProtoRecord;
    }],
    execute: function() {
      ExpressionChangedAfterItHasBeenChecked = (function($__super) {
        function ExpressionChangedAfterItHasBeenChecked(proto, change) {
          $traceurRuntime.superConstructor(ExpressionChangedAfterItHasBeenChecked).call(this);
          this.message = ("Expression '" + proto.expressionAsString + "' has changed after it was checked. ") + ("Previous value: '" + change.previousValue + "'. Current value: '" + change.currentValue + "'");
        }
        return ($traceurRuntime.createClass)(ExpressionChangedAfterItHasBeenChecked, {toString: function() {
            return this.message;
          }}, {}, $__super);
      }(Error));
      $__export("ExpressionChangedAfterItHasBeenChecked", ExpressionChangedAfterItHasBeenChecked);
      Object.defineProperty(ExpressionChangedAfterItHasBeenChecked, "parameters", {get: function() {
          return [[ProtoRecord], [assert.type.any]];
        }});
      ChangeDetectionError = (function($__super) {
        function ChangeDetectionError(proto, originalException) {
          $traceurRuntime.superConstructor(ChangeDetectionError).call(this);
          this.originalException = originalException;
          this.location = proto.expressionAsString;
          this.message = (this.originalException + " in [" + this.location + "]");
        }
        return ($traceurRuntime.createClass)(ChangeDetectionError, {toString: function() {
            return this.message;
          }}, {}, $__super);
      }(Error));
      $__export("ChangeDetectionError", ChangeDetectionError);
      Object.defineProperty(ChangeDetectionError, "parameters", {get: function() {
          return [[ProtoRecord], [assert.type.any]];
        }});
    }
  };
});

System.register("angular2/src/change_detection/interfaces", ["angular2/src/facade/collection", "./parser/locals", "./constants", "./binding_record"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/change_detection/interfaces";
  var List,
      Locals,
      DEFAULT,
      BindingRecord,
      ProtoChangeDetector,
      ChangeDetection,
      ChangeDispatcher,
      ChangeDetector;
  return {
    setters: [function($__m) {
      List = $__m.List;
    }, function($__m) {
      Locals = $__m.Locals;
    }, function($__m) {
      DEFAULT = $__m.DEFAULT;
    }, function($__m) {
      BindingRecord = $__m.BindingRecord;
    }],
    execute: function() {
      ProtoChangeDetector = (function() {
        function ProtoChangeDetector() {}
        return ($traceurRuntime.createClass)(ProtoChangeDetector, {instantiate: function(dispatcher, bindingRecords, variableBindings, directiveRecords) {
            return null;
          }}, {});
      }());
      $__export("ProtoChangeDetector", ProtoChangeDetector);
      Object.defineProperty(ProtoChangeDetector.prototype.instantiate, "parameters", {get: function() {
          return [[assert.type.any], [List], [List], [List]];
        }});
      ChangeDetection = (function() {
        function ChangeDetection() {}
        return ($traceurRuntime.createClass)(ChangeDetection, {createProtoChangeDetector: function(name) {
            var changeControlStrategy = arguments[1] !== (void 0) ? arguments[1] : DEFAULT;
            return null;
          }}, {});
      }());
      $__export("ChangeDetection", ChangeDetection);
      Object.defineProperty(ChangeDetection.prototype.createProtoChangeDetector, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
      ChangeDispatcher = (function() {
        function ChangeDispatcher() {}
        return ($traceurRuntime.createClass)(ChangeDispatcher, {notifyOnBinding: function(bindingRecord, value) {}}, {});
      }());
      $__export("ChangeDispatcher", ChangeDispatcher);
      Object.defineProperty(ChangeDispatcher.prototype.notifyOnBinding, "parameters", {get: function() {
          return [[BindingRecord], [assert.type.any]];
        }});
      ChangeDetector = (function() {
        function ChangeDetector() {}
        return ($traceurRuntime.createClass)(ChangeDetector, {
          addChild: function(cd) {},
          addShadowDomChild: function(cd) {},
          removeChild: function(cd) {},
          removeShadowDomChild: function(cd) {},
          remove: function() {},
          hydrate: function(context, locals, directives) {},
          dehydrate: function() {},
          markPathToRootAsCheckOnce: function() {},
          detectChanges: function() {},
          checkNoChanges: function() {}
        }, {});
      }());
      $__export("ChangeDetector", ChangeDetector);
      Object.defineProperty(ChangeDetector.prototype.addChild, "parameters", {get: function() {
          return [[ChangeDetector]];
        }});
      Object.defineProperty(ChangeDetector.prototype.addShadowDomChild, "parameters", {get: function() {
          return [[ChangeDetector]];
        }});
      Object.defineProperty(ChangeDetector.prototype.removeChild, "parameters", {get: function() {
          return [[ChangeDetector]];
        }});
      Object.defineProperty(ChangeDetector.prototype.removeShadowDomChild, "parameters", {get: function() {
          return [[ChangeDetector]];
        }});
      Object.defineProperty(ChangeDetector.prototype.hydrate, "parameters", {get: function() {
          return [[assert.type.any], [Locals], [assert.type.any]];
        }});
    }
  };
});

System.register("angular2/src/change_detection/proto_change_detector", ["angular2/src/facade/lang", "angular2/src/facade/collection", "./parser/ast", "./interfaces", "./change_detection_util", "./dynamic_change_detector", "./change_detection_jit_generator", "./pipes/pipe_registry", "./binding_record", "./coalesce", "./proto_record"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/change_detection/proto_change_detector";
  var isPresent,
      isBlank,
      BaseException,
      Type,
      isString,
      List,
      ListWrapper,
      MapWrapper,
      StringMapWrapper,
      AccessMember,
      Assignment,
      AST,
      ASTWithSource,
      AstVisitor,
      Binary,
      Chain,
      Conditional,
      Pipe,
      FunctionCall,
      ImplicitReceiver,
      Interpolation,
      KeyedAccess,
      LiteralArray,
      LiteralMap,
      LiteralPrimitive,
      MethodCall,
      PrefixNot,
      ChangeDispatcher,
      ChangeDetector,
      ProtoChangeDetector,
      ChangeDetectionUtil,
      DynamicChangeDetector,
      ChangeDetectorJITGenerator,
      PipeRegistry,
      BindingRecord,
      coalesce,
      ProtoRecord,
      RECORD_TYPE_SELF,
      RECORD_TYPE_PROPERTY,
      RECORD_TYPE_LOCAL,
      RECORD_TYPE_INVOKE_METHOD,
      RECORD_TYPE_CONST,
      RECORD_TYPE_INVOKE_CLOSURE,
      RECORD_TYPE_PRIMITIVE_OP,
      RECORD_TYPE_KEYED_ACCESS,
      RECORD_TYPE_PIPE,
      RECORD_TYPE_BINDING_PIPE,
      RECORD_TYPE_INTERPOLATE,
      DynamicProtoChangeDetector,
      _jitProtoChangeDetectorClassCounter,
      JitProtoChangeDetector,
      ProtoRecordBuilder,
      _ConvertAstIntoProtoRecords;
  function _arrayFn(length) {
    switch (length) {
      case 0:
        return ChangeDetectionUtil.arrayFn0;
      case 1:
        return ChangeDetectionUtil.arrayFn1;
      case 2:
        return ChangeDetectionUtil.arrayFn2;
      case 3:
        return ChangeDetectionUtil.arrayFn3;
      case 4:
        return ChangeDetectionUtil.arrayFn4;
      case 5:
        return ChangeDetectionUtil.arrayFn5;
      case 6:
        return ChangeDetectionUtil.arrayFn6;
      case 7:
        return ChangeDetectionUtil.arrayFn7;
      case 8:
        return ChangeDetectionUtil.arrayFn8;
      case 9:
        return ChangeDetectionUtil.arrayFn9;
      default:
        throw new BaseException("Does not support literal maps with more than 9 elements");
    }
  }
  function _mapPrimitiveName(keys) {
    var stringifiedKeys = ListWrapper.join(ListWrapper.map(keys, (function(k) {
      return isString(k) ? ("\"" + k + "\"") : ("" + k);
    })), ", ");
    return ("mapFn([" + stringifiedKeys + "])");
  }
  function _operationToPrimitiveName(operation) {
    switch (operation) {
      case '+':
        return "operation_add";
      case '-':
        return "operation_subtract";
      case '*':
        return "operation_multiply";
      case '/':
        return "operation_divide";
      case '%':
        return "operation_remainder";
      case '==':
        return "operation_equals";
      case '!=':
        return "operation_not_equals";
      case '<':
        return "operation_less_then";
      case '>':
        return "operation_greater_then";
      case '<=':
        return "operation_less_or_equals_then";
      case '>=':
        return "operation_greater_or_equals_then";
      case '&&':
        return "operation_logical_and";
      case '||':
        return "operation_logical_or";
      default:
        throw new BaseException(("Unsupported operation " + operation));
    }
  }
  function _operationToFunction(operation) {
    switch (operation) {
      case '+':
        return ChangeDetectionUtil.operation_add;
      case '-':
        return ChangeDetectionUtil.operation_subtract;
      case '*':
        return ChangeDetectionUtil.operation_multiply;
      case '/':
        return ChangeDetectionUtil.operation_divide;
      case '%':
        return ChangeDetectionUtil.operation_remainder;
      case '==':
        return ChangeDetectionUtil.operation_equals;
      case '!=':
        return ChangeDetectionUtil.operation_not_equals;
      case '<':
        return ChangeDetectionUtil.operation_less_then;
      case '>':
        return ChangeDetectionUtil.operation_greater_then;
      case '<=':
        return ChangeDetectionUtil.operation_less_or_equals_then;
      case '>=':
        return ChangeDetectionUtil.operation_greater_or_equals_then;
      case '&&':
        return ChangeDetectionUtil.operation_logical_and;
      case '||':
        return ChangeDetectionUtil.operation_logical_or;
      default:
        throw new BaseException(("Unsupported operation " + operation));
    }
  }
  function s(v) {
    return isPresent(v) ? ("" + v) : '';
  }
  function _interpolationFn(strings) {
    var length = strings.length;
    var c0 = length > 0 ? strings[0] : null;
    var c1 = length > 1 ? strings[1] : null;
    var c2 = length > 2 ? strings[2] : null;
    var c3 = length > 3 ? strings[3] : null;
    var c4 = length > 4 ? strings[4] : null;
    var c5 = length > 5 ? strings[5] : null;
    var c6 = length > 6 ? strings[6] : null;
    var c7 = length > 7 ? strings[7] : null;
    var c8 = length > 8 ? strings[8] : null;
    var c9 = length > 9 ? strings[9] : null;
    switch (length - 1) {
      case 1:
        return (function(a1) {
          return c0 + s(a1) + c1;
        });
      case 2:
        return (function(a1, a2) {
          return c0 + s(a1) + c1 + s(a2) + c2;
        });
      case 3:
        return (function(a1, a2, a3) {
          return c0 + s(a1) + c1 + s(a2) + c2 + s(a3) + c3;
        });
      case 4:
        return (function(a1, a2, a3, a4) {
          return c0 + s(a1) + c1 + s(a2) + c2 + s(a3) + c3 + s(a4) + c4;
        });
      case 5:
        return (function(a1, a2, a3, a4, a5) {
          return c0 + s(a1) + c1 + s(a2) + c2 + s(a3) + c3 + s(a4) + c4 + s(a5) + c5;
        });
      case 6:
        return (function(a1, a2, a3, a4, a5, a6) {
          return c0 + s(a1) + c1 + s(a2) + c2 + s(a3) + c3 + s(a4) + c4 + s(a5) + c5 + s(a6) + c6;
        });
      case 7:
        return (function(a1, a2, a3, a4, a5, a6, a7) {
          return c0 + s(a1) + c1 + s(a2) + c2 + s(a3) + c3 + s(a4) + c4 + s(a5) + c5 + s(a6) + c6 + s(a7) + c7;
        });
      case 8:
        return (function(a1, a2, a3, a4, a5, a6, a7, a8) {
          return c0 + s(a1) + c1 + s(a2) + c2 + s(a3) + c3 + s(a4) + c4 + s(a5) + c5 + s(a6) + c6 + s(a7) + c7 + s(a8) + c8;
        });
      case 9:
        return (function(a1, a2, a3, a4, a5, a6, a7, a8, a9) {
          return c0 + s(a1) + c1 + s(a2) + c2 + s(a3) + c3 + s(a4) + c4 + s(a5) + c5 + s(a6) + c6 + s(a7) + c7 + s(a8) + c8 + s(a9) + c9;
        });
      default:
        throw new BaseException("Does not support more than 9 expressions");
    }
  }
  return {
    setters: [function($__m) {
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
      BaseException = $__m.BaseException;
      Type = $__m.Type;
      isString = $__m.isString;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
      MapWrapper = $__m.MapWrapper;
      StringMapWrapper = $__m.StringMapWrapper;
    }, function($__m) {
      AccessMember = $__m.AccessMember;
      Assignment = $__m.Assignment;
      AST = $__m.AST;
      ASTWithSource = $__m.ASTWithSource;
      AstVisitor = $__m.AstVisitor;
      Binary = $__m.Binary;
      Chain = $__m.Chain;
      Conditional = $__m.Conditional;
      Pipe = $__m.Pipe;
      FunctionCall = $__m.FunctionCall;
      ImplicitReceiver = $__m.ImplicitReceiver;
      Interpolation = $__m.Interpolation;
      KeyedAccess = $__m.KeyedAccess;
      LiteralArray = $__m.LiteralArray;
      LiteralMap = $__m.LiteralMap;
      LiteralPrimitive = $__m.LiteralPrimitive;
      MethodCall = $__m.MethodCall;
      PrefixNot = $__m.PrefixNot;
    }, function($__m) {
      ChangeDispatcher = $__m.ChangeDispatcher;
      ChangeDetector = $__m.ChangeDetector;
      ProtoChangeDetector = $__m.ProtoChangeDetector;
    }, function($__m) {
      ChangeDetectionUtil = $__m.ChangeDetectionUtil;
    }, function($__m) {
      DynamicChangeDetector = $__m.DynamicChangeDetector;
    }, function($__m) {
      ChangeDetectorJITGenerator = $__m.ChangeDetectorJITGenerator;
    }, function($__m) {
      PipeRegistry = $__m.PipeRegistry;
    }, function($__m) {
      BindingRecord = $__m.BindingRecord;
    }, function($__m) {
      coalesce = $__m.coalesce;
    }, function($__m) {
      ProtoRecord = $__m.ProtoRecord;
      RECORD_TYPE_SELF = $__m.RECORD_TYPE_SELF;
      RECORD_TYPE_PROPERTY = $__m.RECORD_TYPE_PROPERTY;
      RECORD_TYPE_LOCAL = $__m.RECORD_TYPE_LOCAL;
      RECORD_TYPE_INVOKE_METHOD = $__m.RECORD_TYPE_INVOKE_METHOD;
      RECORD_TYPE_CONST = $__m.RECORD_TYPE_CONST;
      RECORD_TYPE_INVOKE_CLOSURE = $__m.RECORD_TYPE_INVOKE_CLOSURE;
      RECORD_TYPE_PRIMITIVE_OP = $__m.RECORD_TYPE_PRIMITIVE_OP;
      RECORD_TYPE_KEYED_ACCESS = $__m.RECORD_TYPE_KEYED_ACCESS;
      RECORD_TYPE_PIPE = $__m.RECORD_TYPE_PIPE;
      RECORD_TYPE_BINDING_PIPE = $__m.RECORD_TYPE_BINDING_PIPE;
      RECORD_TYPE_INTERPOLATE = $__m.RECORD_TYPE_INTERPOLATE;
    }],
    execute: function() {
      DynamicProtoChangeDetector = (function($__super) {
        function DynamicProtoChangeDetector(pipeRegistry, changeControlStrategy) {
          $traceurRuntime.superConstructor(DynamicProtoChangeDetector).call(this);
          this._pipeRegistry = pipeRegistry;
          this._changeControlStrategy = changeControlStrategy;
        }
        return ($traceurRuntime.createClass)(DynamicProtoChangeDetector, {
          instantiate: function(dispatcher, bindingRecords, variableBindings, directiveRecords) {
            this._createRecordsIfNecessary(bindingRecords, variableBindings);
            return new DynamicChangeDetector(this._changeControlStrategy, dispatcher, this._pipeRegistry, this._records, directiveRecords);
          },
          _createRecordsIfNecessary: function(bindingRecords, variableBindings) {
            if (isBlank(this._records)) {
              var recordBuilder = new ProtoRecordBuilder();
              ListWrapper.forEach(bindingRecords, (function(b) {
                recordBuilder.addAst(b, variableBindings);
              }));
              this._records = coalesce(recordBuilder.records);
            }
          }
        }, {}, $__super);
      }(ProtoChangeDetector));
      $__export("DynamicProtoChangeDetector", DynamicProtoChangeDetector);
      Object.defineProperty(DynamicProtoChangeDetector, "parameters", {get: function() {
          return [[PipeRegistry], [assert.type.string]];
        }});
      Object.defineProperty(DynamicProtoChangeDetector.prototype.instantiate, "parameters", {get: function() {
          return [[assert.type.any], [List], [List], [List]];
        }});
      Object.defineProperty(DynamicProtoChangeDetector.prototype._createRecordsIfNecessary, "parameters", {get: function() {
          return [[List], [List]];
        }});
      _jitProtoChangeDetectorClassCounter = 0;
      JitProtoChangeDetector = (function($__super) {
        function JitProtoChangeDetector(pipeRegistry, changeControlStrategy) {
          $traceurRuntime.superConstructor(JitProtoChangeDetector).call(this);
          this._pipeRegistry = pipeRegistry;
          this._factory = null;
          this._changeControlStrategy = changeControlStrategy;
        }
        return ($traceurRuntime.createClass)(JitProtoChangeDetector, {
          instantiate: function(dispatcher, bindingRecords, variableBindings, directiveRecords) {
            this._createFactoryIfNecessary(bindingRecords, variableBindings, directiveRecords);
            return this._factory(dispatcher, this._pipeRegistry);
          },
          _createFactoryIfNecessary: function(bindingRecords, variableBindings, directiveRecords) {
            if (isBlank(this._factory)) {
              var recordBuilder = new ProtoRecordBuilder();
              ListWrapper.forEach(bindingRecords, (function(b) {
                recordBuilder.addAst(b, variableBindings);
              }));
              var c = _jitProtoChangeDetectorClassCounter++;
              var records = coalesce(recordBuilder.records);
              var typeName = ("ChangeDetector" + c);
              this._factory = new ChangeDetectorJITGenerator(typeName, this._changeControlStrategy, records, directiveRecords).generate();
            }
          }
        }, {}, $__super);
      }(ProtoChangeDetector));
      $__export("JitProtoChangeDetector", JitProtoChangeDetector);
      Object.defineProperty(JitProtoChangeDetector, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(JitProtoChangeDetector.prototype.instantiate, "parameters", {get: function() {
          return [[assert.type.any], [List], [List], [List]];
        }});
      Object.defineProperty(JitProtoChangeDetector.prototype._createFactoryIfNecessary, "parameters", {get: function() {
          return [[List], [List], [List]];
        }});
      ProtoRecordBuilder = (function() {
        function ProtoRecordBuilder() {
          this.records = [];
        }
        return ($traceurRuntime.createClass)(ProtoRecordBuilder, {addAst: function(b) {
            var variableBindings = arguments[1] !== (void 0) ? arguments[1] : null;
            var last = ListWrapper.last(this.records);
            if (isPresent(last) && last.bindingRecord.directiveRecord == b.directiveRecord) {
              last.lastInDirective = false;
            }
            var pr = _ConvertAstIntoProtoRecords.convert(b, this.records.length, variableBindings);
            if (!ListWrapper.isEmpty(pr)) {
              var last = ListWrapper.last(pr);
              last.lastInBinding = true;
              last.lastInDirective = true;
              this.records = ListWrapper.concat(this.records, pr);
            }
          }}, {});
      }());
      Object.defineProperty(ProtoRecordBuilder.prototype.addAst, "parameters", {get: function() {
          return [[BindingRecord], [List]];
        }});
      _ConvertAstIntoProtoRecords = (function() {
        function _ConvertAstIntoProtoRecords(bindingRecord, contextIndex, expressionAsString, variableBindings) {
          this.protoRecords = [];
          this.bindingRecord = bindingRecord;
          this.contextIndex = contextIndex;
          this.expressionAsString = expressionAsString;
          this.variableBindings = variableBindings;
        }
        return ($traceurRuntime.createClass)(_ConvertAstIntoProtoRecords, {
          visitImplicitReceiver: function(ast) {
            return 0;
          },
          visitInterpolation: function(ast) {
            var args = this._visitAll(ast.expressions);
            return this._addRecord(RECORD_TYPE_INTERPOLATE, "interpolate", _interpolationFn(ast.strings), args, ast.strings, 0);
          },
          visitLiteralPrimitive: function(ast) {
            return this._addRecord(RECORD_TYPE_CONST, "literal", ast.value, [], null, 0);
          },
          visitAccessMember: function(ast) {
            var receiver = ast.receiver.visit(this);
            if (isPresent(this.variableBindings) && ListWrapper.contains(this.variableBindings, ast.name)) {
              return this._addRecord(RECORD_TYPE_LOCAL, ast.name, ast.name, [], null, receiver);
            } else {
              return this._addRecord(RECORD_TYPE_PROPERTY, ast.name, ast.getter, [], null, receiver);
            }
          },
          visitMethodCall: function(ast) {
            ;
            var receiver = ast.receiver.visit(this);
            var args = this._visitAll(ast.args);
            if (isPresent(this.variableBindings) && ListWrapper.contains(this.variableBindings, ast.name)) {
              var target = this._addRecord(RECORD_TYPE_LOCAL, ast.name, ast.name, [], null, receiver);
              return this._addRecord(RECORD_TYPE_INVOKE_CLOSURE, "closure", null, args, null, target);
            } else {
              return this._addRecord(RECORD_TYPE_INVOKE_METHOD, ast.name, ast.fn, args, null, receiver);
            }
          },
          visitFunctionCall: function(ast) {
            var target = ast.target.visit(this);
            var args = this._visitAll(ast.args);
            return this._addRecord(RECORD_TYPE_INVOKE_CLOSURE, "closure", null, args, null, target);
          },
          visitLiteralArray: function(ast) {
            var primitiveName = ("arrayFn" + ast.expressions.length);
            return this._addRecord(RECORD_TYPE_PRIMITIVE_OP, primitiveName, _arrayFn(ast.expressions.length), this._visitAll(ast.expressions), null, 0);
          },
          visitLiteralMap: function(ast) {
            return this._addRecord(RECORD_TYPE_PRIMITIVE_OP, _mapPrimitiveName(ast.keys), ChangeDetectionUtil.mapFn(ast.keys), this._visitAll(ast.values), null, 0);
          },
          visitBinary: function(ast) {
            var left = ast.left.visit(this);
            var right = ast.right.visit(this);
            return this._addRecord(RECORD_TYPE_PRIMITIVE_OP, _operationToPrimitiveName(ast.operation), _operationToFunction(ast.operation), [left, right], null, 0);
          },
          visitPrefixNot: function(ast) {
            var exp = ast.expression.visit(this);
            return this._addRecord(RECORD_TYPE_PRIMITIVE_OP, "operation_negate", ChangeDetectionUtil.operation_negate, [exp], null, 0);
          },
          visitConditional: function(ast) {
            var c = ast.condition.visit(this);
            var t = ast.trueExp.visit(this);
            var f = ast.falseExp.visit(this);
            return this._addRecord(RECORD_TYPE_PRIMITIVE_OP, "cond", ChangeDetectionUtil.cond, [c, t, f], null, 0);
          },
          visitPipe: function(ast) {
            var value = ast.exp.visit(this);
            var type = ast.inBinding ? RECORD_TYPE_BINDING_PIPE : RECORD_TYPE_PIPE;
            return this._addRecord(type, ast.name, ast.name, [], null, value);
          },
          visitKeyedAccess: function(ast) {
            var obj = ast.obj.visit(this);
            var key = ast.key.visit(this);
            return this._addRecord(RECORD_TYPE_KEYED_ACCESS, "keyedAccess", ChangeDetectionUtil.keyedAccess, [key], null, obj);
          },
          _visitAll: function(asts) {
            var res = ListWrapper.createFixedSize(asts.length);
            for (var i = 0; i < asts.length; ++i) {
              res[i] = asts[i].visit(this);
            }
            return res;
          },
          _addRecord: function(type, name, funcOrValue, args, fixedArgs, context) {
            var selfIndex = ++this.contextIndex;
            ListWrapper.push(this.protoRecords, new ProtoRecord(type, name, funcOrValue, args, fixedArgs, context, selfIndex, this.bindingRecord, this.expressionAsString, false, false));
            return selfIndex;
          }
        }, {convert: function(b, contextIndex, variableBindings) {
            var c = new _ConvertAstIntoProtoRecords(b, contextIndex, b.ast.toString(), variableBindings);
            b.ast.visit(c);
            return c.protoRecords;
          }});
      }());
      Object.defineProperty(_ConvertAstIntoProtoRecords, "parameters", {get: function() {
          return [[BindingRecord], [assert.type.number], [assert.type.string], [List]];
        }});
      Object.defineProperty(_ConvertAstIntoProtoRecords.convert, "parameters", {get: function() {
          return [[BindingRecord], [assert.type.number], [List]];
        }});
      Object.defineProperty(_ConvertAstIntoProtoRecords.prototype.visitImplicitReceiver, "parameters", {get: function() {
          return [[ImplicitReceiver]];
        }});
      Object.defineProperty(_ConvertAstIntoProtoRecords.prototype.visitInterpolation, "parameters", {get: function() {
          return [[Interpolation]];
        }});
      Object.defineProperty(_ConvertAstIntoProtoRecords.prototype.visitLiteralPrimitive, "parameters", {get: function() {
          return [[LiteralPrimitive]];
        }});
      Object.defineProperty(_ConvertAstIntoProtoRecords.prototype.visitAccessMember, "parameters", {get: function() {
          return [[AccessMember]];
        }});
      Object.defineProperty(_ConvertAstIntoProtoRecords.prototype.visitMethodCall, "parameters", {get: function() {
          return [[MethodCall]];
        }});
      Object.defineProperty(_ConvertAstIntoProtoRecords.prototype.visitFunctionCall, "parameters", {get: function() {
          return [[FunctionCall]];
        }});
      Object.defineProperty(_ConvertAstIntoProtoRecords.prototype.visitLiteralArray, "parameters", {get: function() {
          return [[LiteralArray]];
        }});
      Object.defineProperty(_ConvertAstIntoProtoRecords.prototype.visitLiteralMap, "parameters", {get: function() {
          return [[LiteralMap]];
        }});
      Object.defineProperty(_ConvertAstIntoProtoRecords.prototype.visitBinary, "parameters", {get: function() {
          return [[Binary]];
        }});
      Object.defineProperty(_ConvertAstIntoProtoRecords.prototype.visitPrefixNot, "parameters", {get: function() {
          return [[PrefixNot]];
        }});
      Object.defineProperty(_ConvertAstIntoProtoRecords.prototype.visitConditional, "parameters", {get: function() {
          return [[Conditional]];
        }});
      Object.defineProperty(_ConvertAstIntoProtoRecords.prototype.visitPipe, "parameters", {get: function() {
          return [[Pipe]];
        }});
      Object.defineProperty(_ConvertAstIntoProtoRecords.prototype.visitKeyedAccess, "parameters", {get: function() {
          return [[KeyedAccess]];
        }});
      Object.defineProperty(_ConvertAstIntoProtoRecords.prototype._visitAll, "parameters", {get: function() {
          return [[List]];
        }});
      Object.defineProperty(_arrayFn, "parameters", {get: function() {
          return [[assert.type.number]];
        }});
      Object.defineProperty(_mapPrimitiveName, "parameters", {get: function() {
          return [[List]];
        }});
      Object.defineProperty(_operationToPrimitiveName, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(_operationToFunction, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(_interpolationFn, "parameters", {get: function() {
          return [[List]];
        }});
    }
  };
});

System.register("angular2/src/change_detection/proto_record", ["angular2/src/facade/collection", "./binding_record"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/change_detection/proto_record";
  var List,
      BindingRecord,
      RECORD_TYPE_SELF,
      RECORD_TYPE_CONST,
      RECORD_TYPE_PRIMITIVE_OP,
      RECORD_TYPE_PROPERTY,
      RECORD_TYPE_LOCAL,
      RECORD_TYPE_INVOKE_METHOD,
      RECORD_TYPE_INVOKE_CLOSURE,
      RECORD_TYPE_KEYED_ACCESS,
      RECORD_TYPE_PIPE,
      RECORD_TYPE_BINDING_PIPE,
      RECORD_TYPE_INTERPOLATE,
      ProtoRecord;
  return {
    setters: [function($__m) {
      List = $__m.List;
    }, function($__m) {
      BindingRecord = $__m.BindingRecord;
    }],
    execute: function() {
      RECORD_TYPE_SELF = 0;
      $__export("RECORD_TYPE_SELF", RECORD_TYPE_SELF);
      RECORD_TYPE_CONST = 1;
      $__export("RECORD_TYPE_CONST", RECORD_TYPE_CONST);
      RECORD_TYPE_PRIMITIVE_OP = 2;
      $__export("RECORD_TYPE_PRIMITIVE_OP", RECORD_TYPE_PRIMITIVE_OP);
      RECORD_TYPE_PROPERTY = 3;
      $__export("RECORD_TYPE_PROPERTY", RECORD_TYPE_PROPERTY);
      RECORD_TYPE_LOCAL = 4;
      $__export("RECORD_TYPE_LOCAL", RECORD_TYPE_LOCAL);
      RECORD_TYPE_INVOKE_METHOD = 5;
      $__export("RECORD_TYPE_INVOKE_METHOD", RECORD_TYPE_INVOKE_METHOD);
      RECORD_TYPE_INVOKE_CLOSURE = 6;
      $__export("RECORD_TYPE_INVOKE_CLOSURE", RECORD_TYPE_INVOKE_CLOSURE);
      RECORD_TYPE_KEYED_ACCESS = 7;
      $__export("RECORD_TYPE_KEYED_ACCESS", RECORD_TYPE_KEYED_ACCESS);
      RECORD_TYPE_PIPE = 8;
      $__export("RECORD_TYPE_PIPE", RECORD_TYPE_PIPE);
      RECORD_TYPE_BINDING_PIPE = 9;
      $__export("RECORD_TYPE_BINDING_PIPE", RECORD_TYPE_BINDING_PIPE);
      RECORD_TYPE_INTERPOLATE = 10;
      $__export("RECORD_TYPE_INTERPOLATE", RECORD_TYPE_INTERPOLATE);
      ProtoRecord = (function() {
        function ProtoRecord(mode, name, funcOrValue, args, fixedArgs, contextIndex, selfIndex, bindingRecord, expressionAsString, lastInBinding, lastInDirective) {
          this.mode = mode;
          this.name = name;
          this.funcOrValue = funcOrValue;
          this.args = args;
          this.fixedArgs = fixedArgs;
          this.contextIndex = contextIndex;
          this.selfIndex = selfIndex;
          this.bindingRecord = bindingRecord;
          this.lastInBinding = lastInBinding;
          this.lastInDirective = lastInDirective;
          this.expressionAsString = expressionAsString;
        }
        return ($traceurRuntime.createClass)(ProtoRecord, {isPureFunction: function() {
            return this.mode === RECORD_TYPE_INTERPOLATE || this.mode === RECORD_TYPE_PRIMITIVE_OP;
          }}, {});
      }());
      $__export("ProtoRecord", ProtoRecord);
      Object.defineProperty(ProtoRecord, "parameters", {get: function() {
          return [[assert.type.number], [assert.type.string], [], [List], [List], [assert.type.number], [assert.type.number], [BindingRecord], [assert.type.string], [assert.type.boolean], [assert.type.boolean]];
        }});
    }
  };
});

System.register("angular2/src/core/application", ["angular2/di", "angular2/src/facade/lang", "angular2/src/dom/browser_adapter", "angular2/src/dom/dom_adapter", "./compiler/compiler", "angular2/src/reflection/reflection", "angular2/change_detection", "./exception_handler", "angular2/src/render/dom/compiler/template_loader", "./compiler/template_resolver", "./compiler/directive_metadata_reader", "angular2/src/facade/collection", "angular2/src/facade/async", "angular2/src/core/zone/vm_turn_zone", "angular2/src/core/life_cycle/life_cycle", "angular2/src/render/dom/shadow_dom/shadow_dom_strategy", "angular2/src/render/dom/shadow_dom/emulated_unscoped_shadow_dom_strategy", "angular2/src/services/xhr", "angular2/src/services/xhr_impl", "angular2/src/render/dom/events/event_manager", "angular2/src/render/dom/events/key_events", "angular2/src/render/dom/events/hammer_gestures", "angular2/src/di/binding", "angular2/src/core/compiler/component_url_mapper", "angular2/src/services/url_resolver", "angular2/src/render/dom/shadow_dom/style_url_resolver", "angular2/src/render/dom/shadow_dom/style_inliner", "angular2/src/core/compiler/dynamic_component_loader", "angular2/src/core/testability/testability", "angular2/src/core/compiler/view_factory", "angular2/src/core/compiler/view_hydrator", "angular2/src/core/compiler/proto_view_factory", "angular2/src/render/api", "angular2/src/render/dom/direct_dom_renderer", "angular2/src/render/dom/compiler/compiler", "angular2/src/render/dom/view/view_factory", "angular2/src/render/dom/view/view_hydrator", "./application_tokens"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/application";
  var Injector,
      bind,
      OpaqueToken,
      Optional,
      NumberWrapper,
      Type,
      isBlank,
      isPresent,
      BaseException,
      assertionsEnabled,
      print,
      stringify,
      BrowserDomAdapter,
      DOM,
      Compiler,
      CompilerCache,
      Reflector,
      reflector,
      Parser,
      Lexer,
      ChangeDetection,
      DynamicChangeDetection,
      PipeRegistry,
      defaultPipeRegistry,
      ExceptionHandler,
      TemplateLoader,
      TemplateResolver,
      DirectiveMetadataReader,
      List,
      ListWrapper,
      Promise,
      PromiseWrapper,
      VmTurnZone,
      LifeCycle,
      ShadowDomStrategy,
      EmulatedUnscopedShadowDomStrategy,
      XHR,
      XHRImpl,
      EventManager,
      DomEventsPlugin,
      KeyEventsPlugin,
      HammerGesturesPlugin,
      Binding,
      ComponentUrlMapper,
      UrlResolver,
      StyleUrlResolver,
      StyleInliner,
      ComponentRef,
      DynamicComponentLoader,
      TestabilityRegistry,
      Testability,
      ViewFactory,
      VIEW_POOL_CAPACITY,
      AppViewHydrator,
      ProtoViewFactory,
      Renderer,
      DirectDomRenderer,
      rc,
      rvf,
      rvh,
      appComponentRefToken,
      appChangeDetectorToken,
      appElementToken,
      appComponentAnnotatedTypeToken,
      appDocumentToken,
      _rootInjector,
      _rootBindings;
  function _injectorBindings(appComponentType) {
    return [bind(appDocumentToken).toValue(DOM.defaultDoc()), bind(appComponentAnnotatedTypeToken).toFactory((function(reader) {
      return reader.read(appComponentType);
    }), [DirectiveMetadataReader]), bind(appElementToken).toFactory((function(appComponentAnnotatedType, appDocument) {
      var selector = appComponentAnnotatedType.annotation.selector;
      var element = DOM.querySelector(appDocument, selector);
      if (isBlank(element)) {
        throw new BaseException(("The app selector \"" + selector + "\" did not match any elements"));
      }
      return element;
    }), [appComponentAnnotatedTypeToken, appDocumentToken]), bind(appComponentRefToken).toAsyncFactory((function(dynamicComponentLoader, injector, appElement, appComponentAnnotatedType, testability, registry) {
      registry.registerApplication(appElement, testability);
      return dynamicComponentLoader.loadIntoNewLocation(appComponentAnnotatedType.type, null, appElement, injector);
    }), [DynamicComponentLoader, Injector, appElementToken, appComponentAnnotatedTypeToken, Testability, TestabilityRegistry]), bind(appChangeDetectorToken).toFactory((function(ref) {
      return ref.hostView.changeDetector;
    }), [appComponentRefToken]), bind(appComponentType).toFactory((function(ref) {
      return ref.instance;
    }), [appComponentRefToken]), bind(LifeCycle).toFactory((function(exceptionHandler) {
      return new LifeCycle(exceptionHandler, null, assertionsEnabled());
    }), [ExceptionHandler]), bind(EventManager).toFactory((function(zone) {
      var plugins = [new HammerGesturesPlugin(), new KeyEventsPlugin(), new DomEventsPlugin()];
      return new EventManager(plugins, zone);
    }), [VmTurnZone]), bind(ShadowDomStrategy).toFactory((function(styleUrlResolver, doc) {
      return new EmulatedUnscopedShadowDomStrategy(styleUrlResolver, doc.head);
    }), [StyleUrlResolver, appDocumentToken]), DirectDomRenderer, bind(Renderer).toClass(DirectDomRenderer), bind(rc.Compiler).toClass(rc.DefaultCompiler), bind(rvf.ViewFactory).toFactory((function(capacity, eventManager, shadowDomStrategy) {
      return new rvf.ViewFactory(capacity, eventManager, shadowDomStrategy);
    }), [rvf.VIEW_POOL_CAPACITY, EventManager, ShadowDomStrategy]), bind(rvf.VIEW_POOL_CAPACITY).toValue(10000), rvh.RenderViewHydrator, ProtoViewFactory, bind(ViewFactory).toFactory((function(capacity, renderer) {
      return new ViewFactory(capacity, renderer);
    }), [VIEW_POOL_CAPACITY, Renderer]), bind(VIEW_POOL_CAPACITY).toValue(10000), AppViewHydrator, Compiler, CompilerCache, TemplateResolver, bind(PipeRegistry).toValue(defaultPipeRegistry), bind(ChangeDetection).toClass(DynamicChangeDetection), TemplateLoader, DirectiveMetadataReader, Parser, Lexer, ExceptionHandler, bind(XHR).toValue(new XHRImpl()), ComponentUrlMapper, UrlResolver, StyleUrlResolver, StyleInliner, DynamicComponentLoader, Testability];
  }
  function _createVmZone(givenReporter) {
    var defaultErrorReporter = (function(exception, stackTrace) {
      var longStackTrace = ListWrapper.join(stackTrace, "\n\n-----async gap-----\n");
      print((exception + "\n\n" + longStackTrace));
      throw exception;
    });
    var reporter = isPresent(givenReporter) ? givenReporter : defaultErrorReporter;
    var zone = new VmTurnZone({enableLongStackTrace: assertionsEnabled()});
    zone.initCallbacks({onErrorHandler: reporter});
    return zone;
  }
  function bootstrap(appComponentType) {
    var componentInjectableBindings = arguments[1] !== (void 0) ? arguments[1] : null;
    var errorReporter = arguments[2] !== (void 0) ? arguments[2] : null;
    BrowserDomAdapter.makeCurrent();
    var bootstrapProcess = PromiseWrapper.completer();
    var zone = _createVmZone(errorReporter);
    zone.run((function() {
      var appInjector = _createAppInjector(appComponentType, componentInjectableBindings, zone);
      PromiseWrapper.then(appInjector.asyncGet(appComponentRefToken), (function(componentRef) {
        var appChangeDetector = componentRef.hostView.changeDetector;
        var lc = appInjector.get(LifeCycle);
        lc.registerWith(zone, appChangeDetector);
        lc.tick();
        bootstrapProcess.resolve(componentRef);
      }), (function(err) {
        bootstrapProcess.reject(err);
      }));
    }));
    return bootstrapProcess.promise;
  }
  function _createAppInjector(appComponentType, bindings, zone) {
    if (isBlank(_rootInjector))
      _rootInjector = Injector.resolveAndCreate(_rootBindings);
    var mergedBindings = isPresent(bindings) ? ListWrapper.concat(_injectorBindings(appComponentType), bindings) : _injectorBindings(appComponentType);
    ListWrapper.push(mergedBindings, bind(VmTurnZone).toValue(zone));
    return _rootInjector.resolveAndCreateChild(mergedBindings);
  }
  $__export("bootstrap", bootstrap);
  return {
    setters: [function($__m) {
      Injector = $__m.Injector;
      bind = $__m.bind;
      OpaqueToken = $__m.OpaqueToken;
      Optional = $__m.Optional;
    }, function($__m) {
      NumberWrapper = $__m.NumberWrapper;
      Type = $__m.Type;
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
      BaseException = $__m.BaseException;
      assertionsEnabled = $__m.assertionsEnabled;
      print = $__m.print;
      stringify = $__m.stringify;
    }, function($__m) {
      BrowserDomAdapter = $__m.BrowserDomAdapter;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      Compiler = $__m.Compiler;
      CompilerCache = $__m.CompilerCache;
    }, function($__m) {
      Reflector = $__m.Reflector;
      reflector = $__m.reflector;
    }, function($__m) {
      Parser = $__m.Parser;
      Lexer = $__m.Lexer;
      ChangeDetection = $__m.ChangeDetection;
      DynamicChangeDetection = $__m.DynamicChangeDetection;
      PipeRegistry = $__m.PipeRegistry;
      defaultPipeRegistry = $__m.defaultPipeRegistry;
    }, function($__m) {
      ExceptionHandler = $__m.ExceptionHandler;
    }, function($__m) {
      TemplateLoader = $__m.TemplateLoader;
    }, function($__m) {
      TemplateResolver = $__m.TemplateResolver;
    }, function($__m) {
      DirectiveMetadataReader = $__m.DirectiveMetadataReader;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      Promise = $__m.Promise;
      PromiseWrapper = $__m.PromiseWrapper;
    }, function($__m) {
      VmTurnZone = $__m.VmTurnZone;
    }, function($__m) {
      LifeCycle = $__m.LifeCycle;
    }, function($__m) {
      ShadowDomStrategy = $__m.ShadowDomStrategy;
    }, function($__m) {
      EmulatedUnscopedShadowDomStrategy = $__m.EmulatedUnscopedShadowDomStrategy;
    }, function($__m) {
      XHR = $__m.XHR;
    }, function($__m) {
      XHRImpl = $__m.XHRImpl;
    }, function($__m) {
      EventManager = $__m.EventManager;
      DomEventsPlugin = $__m.DomEventsPlugin;
    }, function($__m) {
      KeyEventsPlugin = $__m.KeyEventsPlugin;
    }, function($__m) {
      HammerGesturesPlugin = $__m.HammerGesturesPlugin;
    }, function($__m) {
      Binding = $__m.Binding;
    }, function($__m) {
      ComponentUrlMapper = $__m.ComponentUrlMapper;
    }, function($__m) {
      UrlResolver = $__m.UrlResolver;
    }, function($__m) {
      StyleUrlResolver = $__m.StyleUrlResolver;
    }, function($__m) {
      StyleInliner = $__m.StyleInliner;
    }, function($__m) {
      ComponentRef = $__m.ComponentRef;
      DynamicComponentLoader = $__m.DynamicComponentLoader;
    }, function($__m) {
      TestabilityRegistry = $__m.TestabilityRegistry;
      Testability = $__m.Testability;
    }, function($__m) {
      ViewFactory = $__m.ViewFactory;
      VIEW_POOL_CAPACITY = $__m.VIEW_POOL_CAPACITY;
    }, function($__m) {
      AppViewHydrator = $__m.AppViewHydrator;
    }, function($__m) {
      ProtoViewFactory = $__m.ProtoViewFactory;
    }, function($__m) {
      Renderer = $__m.Renderer;
    }, function($__m) {
      DirectDomRenderer = $__m.DirectDomRenderer;
    }, function($__m) {
      rc = $__m;
    }, function($__m) {
      rvf = $__m;
    }, function($__m) {
      rvh = $__m;
    }, function($__m) {
      appComponentRefToken = $__m.appComponentRefToken;
      appChangeDetectorToken = $__m.appChangeDetectorToken;
      appElementToken = $__m.appElementToken;
      appComponentAnnotatedTypeToken = $__m.appComponentAnnotatedTypeToken;
      appDocumentToken = $__m.appDocumentToken;
    }],
    execute: function() {
      _rootBindings = [bind(Reflector).toValue(reflector), TestabilityRegistry];
      Object.defineProperty(_createVmZone, "parameters", {get: function() {
          return [[Function]];
        }});
      Object.defineProperty(bootstrap, "parameters", {get: function() {
          return [[Type], [assert.genericType(List, Binding)], [Function]];
        }});
      Object.defineProperty(_createAppInjector, "parameters", {get: function() {
          return [[Type], [assert.genericType(List, Binding)], [VmTurnZone]];
        }});
    }
  };
});

System.register("angular2/src/core/application_tokens", ["angular2/di"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/application_tokens";
  var OpaqueToken,
      appComponentRefToken,
      appChangeDetectorToken,
      appElementToken,
      appComponentAnnotatedTypeToken,
      appDocumentToken;
  return {
    setters: [function($__m) {
      OpaqueToken = $__m.OpaqueToken;
    }],
    execute: function() {
      appComponentRefToken = new OpaqueToken('ComponentRef');
      $__export("appComponentRefToken", appComponentRefToken);
      appChangeDetectorToken = new OpaqueToken('AppChangeDetector');
      $__export("appChangeDetectorToken", appChangeDetectorToken);
      appElementToken = new OpaqueToken('AppElement');
      $__export("appElementToken", appElementToken);
      appComponentAnnotatedTypeToken = new OpaqueToken('AppComponentAnnotatedType');
      $__export("appComponentAnnotatedTypeToken", appComponentAnnotatedTypeToken);
      appDocumentToken = new OpaqueToken('AppDocument');
      $__export("appDocumentToken", appDocumentToken);
    }
  };
});

System.register("angular2/src/core/exception_handler", ["angular2/di", "angular2/src/facade/lang", "angular2/src/facade/collection"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/exception_handler";
  var Injectable,
      isPresent,
      print,
      ListWrapper,
      isListLikeIterable,
      ExceptionHandler;
  return {
    setters: [function($__m) {
      Injectable = $__m.Injectable;
    }, function($__m) {
      isPresent = $__m.isPresent;
      print = $__m.print;
    }, function($__m) {
      ListWrapper = $__m.ListWrapper;
      isListLikeIterable = $__m.isListLikeIterable;
    }],
    execute: function() {
      ExceptionHandler = (function() {
        function ExceptionHandler() {}
        return ($traceurRuntime.createClass)(ExceptionHandler, {call: function(error) {
            var stackTrace = arguments[1] !== (void 0) ? arguments[1] : null;
            var reason = arguments[2] !== (void 0) ? arguments[2] : null;
            var longStackTrace = isListLikeIterable(stackTrace) ? ListWrapper.join(stackTrace, "\n\n") : stackTrace;
            var reasonStr = isPresent(reason) ? ("\n" + reason) : '';
            print(("" + error + reasonStr + "\nSTACKTRACE:\n" + longStackTrace));
          }}, {});
      }());
      $__export("ExceptionHandler", ExceptionHandler);
      Object.defineProperty(ExceptionHandler, "annotations", {get: function() {
          return [new Injectable()];
        }});
    }
  };
});

System.register("angular2/src/di/annotations", ["angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/di/annotations";
  var CONST,
      Inject,
      InjectPromise,
      InjectLazy,
      Optional,
      DependencyAnnotation,
      Injectable;
  return {
    setters: [function($__m) {
      CONST = $__m.CONST;
    }],
    execute: function() {
      Inject = (function() {
        function Inject(token) {
          this.token = token;
        }
        return ($traceurRuntime.createClass)(Inject, {}, {});
      }());
      $__export("Inject", Inject);
      Object.defineProperty(Inject, "annotations", {get: function() {
          return [new CONST()];
        }});
      InjectPromise = (function() {
        function InjectPromise(token) {
          this.token = token;
        }
        return ($traceurRuntime.createClass)(InjectPromise, {}, {});
      }());
      $__export("InjectPromise", InjectPromise);
      Object.defineProperty(InjectPromise, "annotations", {get: function() {
          return [new CONST()];
        }});
      InjectLazy = (function() {
        function InjectLazy(token) {
          this.token = token;
        }
        return ($traceurRuntime.createClass)(InjectLazy, {}, {});
      }());
      $__export("InjectLazy", InjectLazy);
      Object.defineProperty(InjectLazy, "annotations", {get: function() {
          return [new CONST()];
        }});
      Optional = (function() {
        function Optional() {}
        return ($traceurRuntime.createClass)(Optional, {}, {});
      }());
      $__export("Optional", Optional);
      Object.defineProperty(Optional, "annotations", {get: function() {
          return [new CONST()];
        }});
      DependencyAnnotation = (function() {
        function DependencyAnnotation() {}
        return ($traceurRuntime.createClass)(DependencyAnnotation, {get token() {
            return null;
          }}, {});
      }());
      $__export("DependencyAnnotation", DependencyAnnotation);
      Object.defineProperty(DependencyAnnotation, "annotations", {get: function() {
          return [new CONST()];
        }});
      Injectable = (function() {
        function Injectable() {}
        return ($traceurRuntime.createClass)(Injectable, {}, {});
      }());
      $__export("Injectable", Injectable);
      Object.defineProperty(Injectable, "annotations", {get: function() {
          return [new CONST()];
        }});
    }
  };
});

System.register("angular2/src/di/binding", ["angular2/src/facade/lang", "angular2/src/facade/collection", "angular2/src/reflection/reflection", "./key", "./annotations", "./exceptions"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/di/binding";
  var Type,
      isBlank,
      isPresent,
      CONST,
      List,
      MapWrapper,
      ListWrapper,
      reflector,
      Key,
      Inject,
      InjectLazy,
      InjectPromise,
      Optional,
      DependencyAnnotation,
      NoAnnotationError,
      Dependency,
      _EMPTY_LIST,
      Binding,
      ResolvedBinding,
      BindingBuilder;
  function bind(token) {
    return new BindingBuilder(token);
  }
  function _constructDependencies(factoryFunction, dependencies) {
    return isBlank(dependencies) ? _dependenciesFor(factoryFunction) : ListWrapper.map(dependencies, (function(t) {
      return Dependency.fromKey(Key.get(t));
    }));
  }
  function _dependenciesFor(typeOrFunc) {
    var params = reflector.parameters(typeOrFunc);
    if (isBlank(params))
      return [];
    if (ListWrapper.any(params, (function(p) {
      return isBlank(p);
    })))
      throw new NoAnnotationError(typeOrFunc);
    return ListWrapper.map(params, (function(p) {
      return _extractToken(typeOrFunc, p);
    }));
  }
  function _extractToken(typeOrFunc, annotations) {
    var depProps = [];
    var token = null;
    var optional = false;
    var lazy = false;
    var asPromise = false;
    for (var i = 0; i < annotations.length; ++i) {
      var paramAnnotation = annotations[i];
      if (paramAnnotation instanceof Type) {
        token = paramAnnotation;
      } else if (paramAnnotation instanceof Inject) {
        token = paramAnnotation.token;
      } else if (paramAnnotation instanceof InjectPromise) {
        token = paramAnnotation.token;
        asPromise = true;
      } else if (paramAnnotation instanceof InjectLazy) {
        token = paramAnnotation.token;
        lazy = true;
      } else if (paramAnnotation instanceof Optional) {
        optional = true;
      } else if (paramAnnotation instanceof DependencyAnnotation) {
        if (isPresent(paramAnnotation.token)) {
          token = paramAnnotation.token;
        }
        ListWrapper.push(depProps, paramAnnotation);
      }
    }
    if (isPresent(token)) {
      return _createDependency(token, asPromise, lazy, optional, depProps);
    } else {
      throw new NoAnnotationError(typeOrFunc);
    }
  }
  function _createDependency(token, asPromise, lazy, optional, depProps) {
    return new Dependency(Key.get(token), asPromise, lazy, optional, depProps);
  }
  $__export("bind", bind);
  return {
    setters: [function($__m) {
      Type = $__m.Type;
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
      CONST = $__m.CONST;
    }, function($__m) {
      List = $__m.List;
      MapWrapper = $__m.MapWrapper;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      reflector = $__m.reflector;
    }, function($__m) {
      Key = $__m.Key;
    }, function($__m) {
      Inject = $__m.Inject;
      InjectLazy = $__m.InjectLazy;
      InjectPromise = $__m.InjectPromise;
      Optional = $__m.Optional;
      DependencyAnnotation = $__m.DependencyAnnotation;
    }, function($__m) {
      NoAnnotationError = $__m.NoAnnotationError;
    }],
    execute: function() {
      Dependency = (function() {
        function Dependency(key, asPromise, lazy, optional, properties) {
          this.key = key;
          this.asPromise = asPromise;
          this.lazy = lazy;
          this.optional = optional;
          this.properties = properties;
        }
        return ($traceurRuntime.createClass)(Dependency, {}, {fromKey: function(key) {
            return new Dependency(key, false, false, false, []);
          }});
      }());
      $__export("Dependency", Dependency);
      Object.defineProperty(Dependency, "parameters", {get: function() {
          return [[Key], [assert.type.boolean], [assert.type.boolean], [assert.type.boolean], [List]];
        }});
      Object.defineProperty(Dependency.fromKey, "parameters", {get: function() {
          return [[Key]];
        }});
      _EMPTY_LIST = [];
      Binding = (function() {
        function Binding(token, $__2) {
          var $__3 = $__2,
              toClass = $__3.toClass,
              toValue = $__3.toValue,
              toAlias = $__3.toAlias,
              toFactory = $__3.toFactory,
              toAsyncFactory = $__3.toAsyncFactory,
              deps = $__3.deps;
          this.token = token;
          this.toClass = toClass;
          this.toValue = toValue;
          this.toAlias = toAlias;
          this.toFactory = toFactory;
          this.toAsyncFactory = toAsyncFactory;
          this.dependencies = deps;
        }
        return ($traceurRuntime.createClass)(Binding, {resolve: function() {
            var $__0 = this;
            var factoryFn;
            var resolvedDeps;
            var isAsync = false;
            if (isPresent(this.toClass)) {
              factoryFn = reflector.factory(this.toClass);
              resolvedDeps = _dependenciesFor(this.toClass);
            } else if (isPresent(this.toAlias)) {
              factoryFn = (function(aliasInstance) {
                return aliasInstance;
              });
              resolvedDeps = [Dependency.fromKey(Key.get(this.toAlias))];
            } else if (isPresent(this.toFactory)) {
              factoryFn = this.toFactory;
              resolvedDeps = _constructDependencies(this.toFactory, this.dependencies);
            } else if (isPresent(this.toAsyncFactory)) {
              factoryFn = this.toAsyncFactory;
              resolvedDeps = _constructDependencies(this.toAsyncFactory, this.dependencies);
              isAsync = true;
            } else {
              factoryFn = (function() {
                return $__0.toValue;
              });
              resolvedDeps = _EMPTY_LIST;
            }
            return new ResolvedBinding(Key.get(this.token), factoryFn, resolvedDeps, isAsync);
          }}, {});
      }());
      $__export("Binding", Binding);
      Object.defineProperty(Binding, "annotations", {get: function() {
          return [new CONST()];
        }});
      ResolvedBinding = (function() {
        function ResolvedBinding(key, factory, dependencies, providedAsPromise) {
          this.key = key;
          this.factory = factory;
          this.dependencies = dependencies;
          this.providedAsPromise = providedAsPromise;
        }
        return ($traceurRuntime.createClass)(ResolvedBinding, {}, {});
      }());
      $__export("ResolvedBinding", ResolvedBinding);
      Object.defineProperty(ResolvedBinding, "parameters", {get: function() {
          return [[Key], [Function], [assert.genericType(List, Dependency)], [assert.type.boolean]];
        }});
      BindingBuilder = (function() {
        function BindingBuilder(token) {
          this.token = token;
        }
        return ($traceurRuntime.createClass)(BindingBuilder, {
          toClass: function(type) {
            return new Binding(this.token, {toClass: type});
          },
          toValue: function(value) {
            return new Binding(this.token, {toValue: value});
          },
          toAlias: function(aliasToken) {
            return new Binding(this.token, {toAlias: aliasToken});
          },
          toFactory: function(factoryFunction) {
            var dependencies = arguments[1] !== (void 0) ? arguments[1] : null;
            return new Binding(this.token, {
              toFactory: factoryFunction,
              deps: dependencies
            });
          },
          toAsyncFactory: function(factoryFunction) {
            var dependencies = arguments[1] !== (void 0) ? arguments[1] : null;
            return new Binding(this.token, {
              toAsyncFactory: factoryFunction,
              deps: dependencies
            });
          }
        }, {});
      }());
      $__export("BindingBuilder", BindingBuilder);
      Object.defineProperty(BindingBuilder.prototype.toClass, "parameters", {get: function() {
          return [[Type]];
        }});
      Object.defineProperty(BindingBuilder.prototype.toFactory, "parameters", {get: function() {
          return [[Function], [List]];
        }});
      Object.defineProperty(BindingBuilder.prototype.toAsyncFactory, "parameters", {get: function() {
          return [[Function], [List]];
        }});
      Object.defineProperty(_constructDependencies, "parameters", {get: function() {
          return [[Function], [List]];
        }});
    }
  };
});

System.register("angular2/src/di/exceptions", ["angular2/src/facade/collection", "angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/di/exceptions";
  var ListWrapper,
      List,
      stringify,
      AbstractBindingError,
      NoBindingError,
      AsyncBindingError,
      CyclicDependencyError,
      InstantiationError,
      InvalidBindingError,
      NoAnnotationError;
  function findFirstClosedCycle(keys) {
    var res = [];
    for (var i = 0; i < keys.length; ++i) {
      if (ListWrapper.contains(res, keys[i])) {
        ListWrapper.push(res, keys[i]);
        return res;
      } else {
        ListWrapper.push(res, keys[i]);
      }
    }
    return res;
  }
  function constructResolvingPath(keys) {
    if (keys.length > 1) {
      var reversed = findFirstClosedCycle(ListWrapper.reversed(keys));
      var tokenStrs = ListWrapper.map(reversed, (function(k) {
        return stringify(k.token);
      }));
      return " (" + tokenStrs.join(' -> ') + ")";
    } else {
      return "";
    }
  }
  return {
    setters: [function($__m) {
      ListWrapper = $__m.ListWrapper;
      List = $__m.List;
    }, function($__m) {
      stringify = $__m.stringify;
    }],
    execute: function() {
      Object.defineProperty(findFirstClosedCycle, "parameters", {get: function() {
          return [[List]];
        }});
      Object.defineProperty(constructResolvingPath, "parameters", {get: function() {
          return [[List]];
        }});
      AbstractBindingError = (function($__super) {
        function AbstractBindingError(key, constructResolvingMessage) {
          $traceurRuntime.superConstructor(AbstractBindingError).call(this);
          this.keys = [key];
          this.constructResolvingMessage = constructResolvingMessage;
          this.message = this.constructResolvingMessage(this.keys);
        }
        return ($traceurRuntime.createClass)(AbstractBindingError, {
          addKey: function(key) {
            ListWrapper.push(this.keys, key);
            this.message = this.constructResolvingMessage(this.keys);
          },
          toString: function() {
            return this.message;
          }
        }, {}, $__super);
      }(Error));
      $__export("AbstractBindingError", AbstractBindingError);
      Object.defineProperty(AbstractBindingError, "parameters", {get: function() {
          return [[], [Function]];
        }});
      NoBindingError = (function($__super) {
        function NoBindingError(key) {
          $traceurRuntime.superConstructor(NoBindingError).call(this, key, function(keys) {
            var first = stringify(ListWrapper.first(keys).token);
            return ("No provider for " + first + "!" + constructResolvingPath(keys));
          });
        }
        return ($traceurRuntime.createClass)(NoBindingError, {}, {}, $__super);
      }(AbstractBindingError));
      $__export("NoBindingError", NoBindingError);
      AsyncBindingError = (function($__super) {
        function AsyncBindingError(key) {
          $traceurRuntime.superConstructor(AsyncBindingError).call(this, key, function(keys) {
            var first = stringify(ListWrapper.first(keys).token);
            return ("Cannot instantiate " + first + " synchronously. ") + ("It is provided as a promise!" + constructResolvingPath(keys));
          });
        }
        return ($traceurRuntime.createClass)(AsyncBindingError, {}, {}, $__super);
      }(AbstractBindingError));
      $__export("AsyncBindingError", AsyncBindingError);
      CyclicDependencyError = (function($__super) {
        function CyclicDependencyError(key) {
          $traceurRuntime.superConstructor(CyclicDependencyError).call(this, key, function(keys) {
            return ("Cannot instantiate cyclic dependency!" + constructResolvingPath(keys));
          });
        }
        return ($traceurRuntime.createClass)(CyclicDependencyError, {}, {}, $__super);
      }(AbstractBindingError));
      $__export("CyclicDependencyError", CyclicDependencyError);
      InstantiationError = (function($__super) {
        function InstantiationError(originalException, key) {
          $traceurRuntime.superConstructor(InstantiationError).call(this, key, function(keys) {
            var first = stringify(ListWrapper.first(keys).token);
            return ("Error during instantiation of " + first + "!" + constructResolvingPath(keys) + ".") + (" ORIGINAL ERROR: " + originalException);
          });
        }
        return ($traceurRuntime.createClass)(InstantiationError, {}, {}, $__super);
      }(AbstractBindingError));
      $__export("InstantiationError", InstantiationError);
      InvalidBindingError = (function($__super) {
        function InvalidBindingError(binding) {
          $traceurRuntime.superConstructor(InvalidBindingError).call(this);
          this.message = ("Invalid binding " + binding);
        }
        return ($traceurRuntime.createClass)(InvalidBindingError, {toString: function() {
            return this.message;
          }}, {}, $__super);
      }(Error));
      $__export("InvalidBindingError", InvalidBindingError);
      NoAnnotationError = (function($__super) {
        function NoAnnotationError(typeOrFunc) {
          $traceurRuntime.superConstructor(NoAnnotationError).call(this);
          this.message = ("Cannot resolve all parameters for " + stringify(typeOrFunc) + ".") + " Make sure they all have valid type or annotations.";
        }
        return ($traceurRuntime.createClass)(NoAnnotationError, {toString: function() {
            return this.message;
          }}, {}, $__super);
      }(Error));
      $__export("NoAnnotationError", NoAnnotationError);
    }
  };
});

System.register("angular2/src/di/injector", ["angular2/src/facade/collection", "./binding", "./exceptions", "angular2/src/facade/lang", "angular2/src/facade/async", "./key"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/di/injector";
  var Map,
      List,
      MapWrapper,
      ListWrapper,
      ResolvedBinding,
      Binding,
      BindingBuilder,
      bind,
      AbstractBindingError,
      NoBindingError,
      AsyncBindingError,
      CyclicDependencyError,
      InstantiationError,
      InvalidBindingError,
      FunctionWrapper,
      Type,
      isPresent,
      isBlank,
      Promise,
      PromiseWrapper,
      Key,
      _constructing,
      _notFound,
      _Waiting,
      Injector,
      _SyncInjectorStrategy,
      _AsyncInjectorStrategy;
  function _isWaiting(obj) {
    return obj instanceof _Waiting;
  }
  function _resolveBindings(bindings) {
    var resolvedList = ListWrapper.createFixedSize(bindings.length);
    for (var i = 0; i < bindings.length; i++) {
      var unresolved = bindings[i];
      var resolved = void 0;
      if (unresolved instanceof ResolvedBinding) {
        resolved = unresolved;
      } else if (unresolved instanceof Type) {
        resolved = bind(unresolved).toClass(unresolved).resolve();
      } else if (unresolved instanceof Binding) {
        resolved = unresolved.resolve();
      } else if (unresolved instanceof List) {
        resolved = _resolveBindings(unresolved);
      } else if (unresolved instanceof BindingBuilder) {
        throw new InvalidBindingError(unresolved.token);
      } else {
        throw new InvalidBindingError(unresolved);
      }
      resolvedList[i] = resolved;
    }
    return resolvedList;
  }
  function _createListOfBindings(flattenedBindings) {
    var bindings = ListWrapper.createFixedSize(Key.numberOfKeys + 1);
    MapWrapper.forEach(flattenedBindings, (function(v, keyId) {
      return bindings[keyId] = v;
    }));
    return bindings;
  }
  function _flattenBindings(bindings, res) {
    ListWrapper.forEach(bindings, function(b) {
      if (b instanceof ResolvedBinding) {
        MapWrapper.set(res, b.key.id, b);
      } else if (b instanceof List) {
        _flattenBindings(b, res);
      }
    });
    return res;
  }
  return {
    setters: [function($__m) {
      Map = $__m.Map;
      List = $__m.List;
      MapWrapper = $__m.MapWrapper;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      ResolvedBinding = $__m.ResolvedBinding;
      Binding = $__m.Binding;
      BindingBuilder = $__m.BindingBuilder;
      bind = $__m.bind;
    }, function($__m) {
      AbstractBindingError = $__m.AbstractBindingError;
      NoBindingError = $__m.NoBindingError;
      AsyncBindingError = $__m.AsyncBindingError;
      CyclicDependencyError = $__m.CyclicDependencyError;
      InstantiationError = $__m.InstantiationError;
      InvalidBindingError = $__m.InvalidBindingError;
    }, function($__m) {
      FunctionWrapper = $__m.FunctionWrapper;
      Type = $__m.Type;
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
    }, function($__m) {
      Promise = $__m.Promise;
      PromiseWrapper = $__m.PromiseWrapper;
    }, function($__m) {
      Key = $__m.Key;
    }],
    execute: function() {
      _constructing = new Object();
      _notFound = new Object();
      _Waiting = (function() {
        function _Waiting(promise) {
          this.promise = promise;
        }
        return ($traceurRuntime.createClass)(_Waiting, {}, {});
      }());
      Object.defineProperty(_Waiting, "parameters", {get: function() {
          return [[Promise]];
        }});
      Injector = (function() {
        function Injector(bindings, parent, defaultBindings) {
          this._bindings = bindings;
          this._instances = this._createInstances();
          this._parent = parent;
          this._defaultBindings = defaultBindings;
          this._asyncStrategy = new _AsyncInjectorStrategy(this);
          this._syncStrategy = new _SyncInjectorStrategy(this);
        }
        return ($traceurRuntime.createClass)(Injector, {
          get: function(token) {
            return this._getByKey(Key.get(token), false, false, false);
          },
          getOptional: function(token) {
            return this._getByKey(Key.get(token), false, false, true);
          },
          asyncGet: function(token) {
            return this._getByKey(Key.get(token), true, false, false);
          },
          resolveAndCreateChild: function(bindings) {
            return new Injector(Injector.resolve(bindings), this, false);
          },
          createChildFromResolved: function(bindings) {
            return new Injector(bindings, this, false);
          },
          _createInstances: function() {
            return ListWrapper.createFixedSize(Key.numberOfKeys + 1);
          },
          _getByKey: function(key, returnPromise, returnLazy, optional) {
            var $__0 = this;
            if (returnLazy) {
              return (function() {
                return $__0._getByKey(key, returnPromise, false, optional);
              });
            }
            var strategy = returnPromise ? this._asyncStrategy : this._syncStrategy;
            var instance = strategy.readFromCache(key);
            if (instance !== _notFound)
              return instance;
            instance = strategy.instantiate(key);
            if (instance !== _notFound)
              return instance;
            if (isPresent(this._parent)) {
              return this._parent._getByKey(key, returnPromise, returnLazy, optional);
            }
            if (optional) {
              return null;
            } else {
              throw new NoBindingError(key);
            }
          },
          _resolveDependencies: function(key, binding, forceAsync) {
            var $__0 = this;
            try {
              var getDependency = (function(d) {
                return $__0._getByKey(d.key, forceAsync || d.asPromise, d.lazy, d.optional);
              });
              return ListWrapper.map(binding.dependencies, getDependency);
            } catch (e) {
              this._clear(key);
              if (e instanceof AbstractBindingError)
                e.addKey(key);
              throw e;
            }
          },
          _getInstance: function(key) {
            if (this._instances.length <= key.id)
              return null;
            return ListWrapper.get(this._instances, key.id);
          },
          _setInstance: function(key, obj) {
            ListWrapper.set(this._instances, key.id, obj);
          },
          _getBinding: function(key) {
            var binding = this._bindings.length <= key.id ? null : ListWrapper.get(this._bindings, key.id);
            if (isBlank(binding) && this._defaultBindings) {
              return bind(key.token).toClass(key.token).resolve();
            } else {
              return binding;
            }
          },
          _markAsConstructing: function(key) {
            this._setInstance(key, _constructing);
          },
          _clear: function(key) {
            this._setInstance(key, null);
          }
        }, {
          resolve: function(bindings) {
            var resolvedBindings = _resolveBindings(bindings);
            var flatten = _flattenBindings(resolvedBindings, MapWrapper.create());
            return _createListOfBindings(flatten);
          },
          resolveAndCreate: function(bindings) {
            var $__3;
            var $__2 = arguments[1] !== (void 0) ? arguments[1] : {},
                defaultBindings = ($__3 = $__2.defaultBindings) === void 0 ? false : $__3;
            return new Injector(Injector.resolve(bindings), null, defaultBindings);
          },
          fromResolvedBindings: function(bindings) {
            var $__3;
            var $__2 = arguments[1] !== (void 0) ? arguments[1] : {},
                defaultBindings = ($__3 = $__2.defaultBindings) === void 0 ? false : $__3;
            return new Injector(bindings, null, defaultBindings);
          }
        });
      }());
      $__export("Injector", Injector);
      Object.defineProperty(Injector, "parameters", {get: function() {
          return [[assert.genericType(List, ResolvedBinding)], [Injector], [assert.type.boolean]];
        }});
      Object.defineProperty(Injector.resolve, "parameters", {get: function() {
          return [[List]];
        }});
      Object.defineProperty(Injector.resolveAndCreate, "parameters", {get: function() {
          return [[List], []];
        }});
      Object.defineProperty(Injector.fromResolvedBindings, "parameters", {get: function() {
          return [[assert.genericType(List, ResolvedBinding)], []];
        }});
      Object.defineProperty(Injector.prototype.resolveAndCreateChild, "parameters", {get: function() {
          return [[List]];
        }});
      Object.defineProperty(Injector.prototype.createChildFromResolved, "parameters", {get: function() {
          return [[assert.genericType(List, ResolvedBinding)]];
        }});
      Object.defineProperty(Injector.prototype._getByKey, "parameters", {get: function() {
          return [[Key], [assert.type.boolean], [assert.type.boolean], [assert.type.boolean]];
        }});
      Object.defineProperty(Injector.prototype._resolveDependencies, "parameters", {get: function() {
          return [[Key], [ResolvedBinding], [assert.type.boolean]];
        }});
      Object.defineProperty(Injector.prototype._getInstance, "parameters", {get: function() {
          return [[Key]];
        }});
      Object.defineProperty(Injector.prototype._setInstance, "parameters", {get: function() {
          return [[Key], []];
        }});
      Object.defineProperty(Injector.prototype._getBinding, "parameters", {get: function() {
          return [[Key]];
        }});
      Object.defineProperty(Injector.prototype._markAsConstructing, "parameters", {get: function() {
          return [[Key]];
        }});
      Object.defineProperty(Injector.prototype._clear, "parameters", {get: function() {
          return [[Key]];
        }});
      _SyncInjectorStrategy = (function() {
        function _SyncInjectorStrategy(injector) {
          this.injector = injector;
        }
        return ($traceurRuntime.createClass)(_SyncInjectorStrategy, {
          readFromCache: function(key) {
            if (key.token === Injector) {
              return this.injector;
            }
            var instance = this.injector._getInstance(key);
            if (instance === _constructing) {
              throw new CyclicDependencyError(key);
            } else if (isPresent(instance) && !_isWaiting(instance)) {
              return instance;
            } else {
              return _notFound;
            }
          },
          instantiate: function(key) {
            var binding = this.injector._getBinding(key);
            if (isBlank(binding))
              return _notFound;
            if (binding.providedAsPromise)
              throw new AsyncBindingError(key);
            this.injector._markAsConstructing(key);
            var deps = this.injector._resolveDependencies(key, binding, false);
            return this._createInstance(key, binding, deps);
          },
          _createInstance: function(key, binding, deps) {
            try {
              var instance = FunctionWrapper.apply(binding.factory, deps);
              this.injector._setInstance(key, instance);
              return instance;
            } catch (e) {
              this.injector._clear(key);
              throw new InstantiationError(e, key);
            }
          }
        }, {});
      }());
      Object.defineProperty(_SyncInjectorStrategy, "parameters", {get: function() {
          return [[Injector]];
        }});
      Object.defineProperty(_SyncInjectorStrategy.prototype.readFromCache, "parameters", {get: function() {
          return [[Key]];
        }});
      Object.defineProperty(_SyncInjectorStrategy.prototype.instantiate, "parameters", {get: function() {
          return [[Key]];
        }});
      Object.defineProperty(_SyncInjectorStrategy.prototype._createInstance, "parameters", {get: function() {
          return [[Key], [ResolvedBinding], [List]];
        }});
      _AsyncInjectorStrategy = (function() {
        function _AsyncInjectorStrategy(injector) {
          this.injector = injector;
        }
        return ($traceurRuntime.createClass)(_AsyncInjectorStrategy, {
          readFromCache: function(key) {
            if (key.token === Injector) {
              return PromiseWrapper.resolve(this.injector);
            }
            var instance = this.injector._getInstance(key);
            if (instance === _constructing) {
              throw new CyclicDependencyError(key);
            } else if (_isWaiting(instance)) {
              return instance.promise;
            } else if (isPresent(instance)) {
              return PromiseWrapper.resolve(instance);
            } else {
              return _notFound;
            }
          },
          instantiate: function(key) {
            var $__0 = this;
            var binding = this.injector._getBinding(key);
            if (isBlank(binding))
              return _notFound;
            this.injector._markAsConstructing(key);
            var deps = this.injector._resolveDependencies(key, binding, true);
            var depsPromise = PromiseWrapper.all(deps);
            var promise = PromiseWrapper.then(depsPromise, null, (function(e) {
              return $__0._errorHandler(key, e);
            })).then((function(deps) {
              return $__0._findOrCreate(key, binding, deps);
            })).then((function(instance) {
              return $__0._cacheInstance(key, instance);
            }));
            this.injector._setInstance(key, new _Waiting(promise));
            return promise;
          },
          _errorHandler: function(key, e) {
            if (e instanceof AbstractBindingError)
              e.addKey(key);
            return PromiseWrapper.reject(e);
          },
          _findOrCreate: function(key, binding, deps) {
            try {
              var instance = this.injector._getInstance(key);
              if (!_isWaiting(instance))
                return instance;
              return FunctionWrapper.apply(binding.factory, deps);
            } catch (e) {
              this.injector._clear(key);
              throw new InstantiationError(e, key);
            }
          },
          _cacheInstance: function(key, instance) {
            this.injector._setInstance(key, instance);
            return instance;
          }
        }, {});
      }());
      Object.defineProperty(_AsyncInjectorStrategy, "parameters", {get: function() {
          return [[Injector]];
        }});
      Object.defineProperty(_AsyncInjectorStrategy.prototype.readFromCache, "parameters", {get: function() {
          return [[Key]];
        }});
      Object.defineProperty(_AsyncInjectorStrategy.prototype.instantiate, "parameters", {get: function() {
          return [[Key]];
        }});
      Object.defineProperty(_AsyncInjectorStrategy.prototype._errorHandler, "parameters", {get: function() {
          return [[Key], []];
        }});
      Object.defineProperty(_AsyncInjectorStrategy.prototype._findOrCreate, "parameters", {get: function() {
          return [[Key], [ResolvedBinding], [List]];
        }});
      Object.defineProperty(_resolveBindings, "parameters", {get: function() {
          return [[List]];
        }});
      Object.defineProperty(_flattenBindings, "parameters", {get: function() {
          return [[List], [Map]];
        }});
    }
  };
});

System.register("angular2/src/di/key", ["angular2/src/facade/collection"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/di/key";
  var MapWrapper,
      Key,
      KeyRegistry,
      _globalKeyRegistry;
  return {
    setters: [function($__m) {
      MapWrapper = $__m.MapWrapper;
    }],
    execute: function() {
      Key = (function() {
        function Key(token, id) {
          this.token = token;
          this.id = id;
          this.metadata = null;
        }
        return ($traceurRuntime.createClass)(Key, {}, {
          get: function(token) {
            return _globalKeyRegistry.get(token);
          },
          get numberOfKeys() {
            return _globalKeyRegistry.numberOfKeys;
          }
        });
      }());
      $__export("Key", Key);
      KeyRegistry = (function() {
        function KeyRegistry() {
          this._allKeys = MapWrapper.create();
        }
        return ($traceurRuntime.createClass)(KeyRegistry, {
          get: function(token) {
            if (token instanceof Key)
              return token;
            if (MapWrapper.contains(this._allKeys, token)) {
              return MapWrapper.get(this._allKeys, token);
            }
            var newKey = new Key(token, Key.numberOfKeys);
            MapWrapper.set(this._allKeys, token, newKey);
            return newKey;
          },
          get numberOfKeys() {
            return MapWrapper.size(this._allKeys);
          }
        }, {});
      }());
      $__export("KeyRegistry", KeyRegistry);
      _globalKeyRegistry = new KeyRegistry();
    }
  };
});

System.register("angular2/src/di/opaque_token", [], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/di/opaque_token";
  var OpaqueToken;
  return {
    setters: [],
    execute: function() {
      OpaqueToken = (function() {
        function OpaqueToken(desc) {
          this._desc = ("Token(" + desc + ")");
        }
        return ($traceurRuntime.createClass)(OpaqueToken, {toString: function() {
            return this._desc;
          }}, {});
      }());
      $__export("OpaqueToken", OpaqueToken);
      Object.defineProperty(OpaqueToken, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
    }
  };
});

System.register("angular2/src/directives/class", ["angular2/src/core/annotations/annotations", "angular2/src/facade/lang", "angular2/src/dom/dom_adapter", "angular2/src/core/compiler/ng_element"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/directives/class";
  var Decorator,
      isPresent,
      DOM,
      NgElement,
      CSSClass;
  return {
    setters: [function($__m) {
      Decorator = $__m.Decorator;
    }, function($__m) {
      isPresent = $__m.isPresent;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      NgElement = $__m.NgElement;
    }],
    execute: function() {
      CSSClass = (function() {
        function CSSClass(ngEl) {
          this._domEl = ngEl.domElement;
        }
        return ($traceurRuntime.createClass)(CSSClass, {
          _toggleClass: function(className, enabled) {
            if (enabled) {
              DOM.addClass(this._domEl, className);
            } else {
              DOM.removeClass(this._domEl, className);
            }
          },
          set iterableChanges(changes) {
            var $__0 = this;
            if (isPresent(changes)) {
              changes.forEachAddedItem((function(record) {
                $__0._toggleClass(record.key, record.currentValue);
              }));
              changes.forEachChangedItem((function(record) {
                $__0._toggleClass(record.key, record.currentValue);
              }));
              changes.forEachRemovedItem((function(record) {
                if (record.previousValue) {
                  DOM.removeClass($__0._domEl, record.key);
                }
              }));
            }
          }
        }, {});
      }());
      $__export("CSSClass", CSSClass);
      Object.defineProperty(CSSClass, "annotations", {get: function() {
          return [new Decorator({
            selector: '[class]',
            properties: {'iterableChanges': 'class | keyValDiff'}
          })];
        }});
      Object.defineProperty(CSSClass, "parameters", {get: function() {
          return [[NgElement]];
        }});
    }
  };
});

System.register("angular2/src/directives/for", ["angular2/src/core/annotations/annotations", "angular2/src/core/compiler/view_container", "angular2/src/core/compiler/view", "angular2/src/facade/lang", "angular2/src/facade/collection"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/directives/for";
  var Viewport,
      ViewContainer,
      AppView,
      isPresent,
      isBlank,
      ListWrapper,
      For,
      RecordViewTuple;
  return {
    setters: [function($__m) {
      Viewport = $__m.Viewport;
    }, function($__m) {
      ViewContainer = $__m.ViewContainer;
    }, function($__m) {
      AppView = $__m.AppView;
    }, function($__m) {
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
    }, function($__m) {
      ListWrapper = $__m.ListWrapper;
    }],
    execute: function() {
      For = (function() {
        function For(viewContainer) {
          this.viewContainer = viewContainer;
        }
        return ($traceurRuntime.createClass)(For, {
          set iterableChanges(changes) {
            if (isBlank(changes)) {
              this.viewContainer.clear();
              return ;
            }
            var recordViewTuples = [];
            changes.forEachRemovedItem((function(removedRecord) {
              return ListWrapper.push(recordViewTuples, new RecordViewTuple(removedRecord, null));
            }));
            changes.forEachMovedItem((function(movedRecord) {
              return ListWrapper.push(recordViewTuples, new RecordViewTuple(movedRecord, null));
            }));
            var insertTuples = For.bulkRemove(recordViewTuples, this.viewContainer);
            changes.forEachAddedItem((function(addedRecord) {
              return ListWrapper.push(insertTuples, new RecordViewTuple(addedRecord, null));
            }));
            For.bulkInsert(insertTuples, this.viewContainer);
            for (var i = 0; i < insertTuples.length; i++) {
              this.perViewChange(insertTuples[i].view, insertTuples[i].record);
            }
          },
          perViewChange: function(view, record) {
            view.setLocal('\$implicit', record.item);
            view.setLocal('index', record.currentIndex);
          }
        }, {
          bulkRemove: function(tuples, viewContainer) {
            tuples.sort((function(a, b) {
              return a.record.previousIndex - b.record.previousIndex;
            }));
            var movedTuples = [];
            for (var i = tuples.length - 1; i >= 0; i--) {
              var tuple = tuples[i];
              if (isPresent(tuple.record.currentIndex)) {
                tuple.view = viewContainer.detach(tuple.record.previousIndex);
                ListWrapper.push(movedTuples, tuple);
              } else {
                viewContainer.remove(tuple.record.previousIndex);
              }
            }
            return movedTuples;
          },
          bulkInsert: function(tuples, viewContainer) {
            tuples.sort((function(a, b) {
              return a.record.currentIndex - b.record.currentIndex;
            }));
            for (var i = 0; i < tuples.length; i++) {
              var tuple = tuples[i];
              if (isPresent(tuple.view)) {
                viewContainer.insert(tuple.view, tuple.record.currentIndex);
              } else {
                tuple.view = viewContainer.create(tuple.record.currentIndex);
              }
            }
            return tuples;
          }
        });
      }());
      $__export("For", For);
      Object.defineProperty(For, "annotations", {get: function() {
          return [new Viewport({
            selector: '[for][of]',
            properties: {'iterableChanges': 'of | iterableDiff'}
          })];
        }});
      Object.defineProperty(For, "parameters", {get: function() {
          return [[ViewContainer]];
        }});
      RecordViewTuple = (function() {
        function RecordViewTuple(record, view) {
          this.record = record;
          this.view = view;
        }
        return ($traceurRuntime.createClass)(RecordViewTuple, {}, {});
      }());
    }
  };
});

System.register("angular2/src/directives/if", ["angular2/src/core/annotations/annotations", "angular2/src/core/compiler/view_container", "angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/directives/if";
  var Viewport,
      ViewContainer,
      isBlank,
      If;
  return {
    setters: [function($__m) {
      Viewport = $__m.Viewport;
    }, function($__m) {
      ViewContainer = $__m.ViewContainer;
    }, function($__m) {
      isBlank = $__m.isBlank;
    }],
    execute: function() {
      If = (function() {
        function If(viewContainer) {
          this.viewContainer = viewContainer;
          this.prevCondition = null;
        }
        return ($traceurRuntime.createClass)(If, {set condition(newCondition) {
            if (newCondition && (isBlank(this.prevCondition) || !this.prevCondition)) {
              this.prevCondition = true;
              this.viewContainer.create();
            } else if (!newCondition && (isBlank(this.prevCondition) || this.prevCondition)) {
              this.prevCondition = false;
              this.viewContainer.clear();
            }
          }}, {});
      }());
      $__export("If", If);
      Object.defineProperty(If, "annotations", {get: function() {
          return [new Viewport({
            selector: '[if]',
            properties: {'condition': 'if'}
          })];
        }});
      Object.defineProperty(If, "parameters", {get: function() {
          return [[ViewContainer]];
        }});
    }
  };
});

System.register("angular2/src/directives/non_bindable", ["angular2/src/core/annotations/annotations"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/directives/non_bindable";
  var Decorator,
      NonBindable;
  return {
    setters: [function($__m) {
      Decorator = $__m.Decorator;
    }],
    execute: function() {
      NonBindable = (function() {
        function NonBindable() {}
        return ($traceurRuntime.createClass)(NonBindable, {}, {});
      }());
      $__export("NonBindable", NonBindable);
      Object.defineProperty(NonBindable, "annotations", {get: function() {
          return [new Decorator({
            selector: '[non-bindable]',
            compileChildren: false
          })];
        }});
    }
  };
});

System.register("angular2/src/directives/switch", ["angular2/src/core/annotations/annotations", "angular2/src/core/compiler/view_container", "angular2/src/facade/lang", "angular2/src/facade/collection", "angular2/src/core/annotations/visibility"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/directives/switch";
  var Decorator,
      Viewport,
      ViewContainer,
      isPresent,
      isBlank,
      normalizeBlank,
      ListWrapper,
      List,
      MapWrapper,
      Map,
      Parent,
      Switch,
      SwitchWhen,
      SwitchDefault,
      _whenDefault;
  return {
    setters: [function($__m) {
      Decorator = $__m.Decorator;
      Viewport = $__m.Viewport;
    }, function($__m) {
      ViewContainer = $__m.ViewContainer;
    }, function($__m) {
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
      normalizeBlank = $__m.normalizeBlank;
    }, function($__m) {
      ListWrapper = $__m.ListWrapper;
      List = $__m.List;
      MapWrapper = $__m.MapWrapper;
      Map = $__m.Map;
    }, function($__m) {
      Parent = $__m.Parent;
    }],
    execute: function() {
      Switch = (function() {
        function Switch() {
          this._valueViewContainers = MapWrapper.create();
          this._activeViewContainers = ListWrapper.create();
          this._useDefault = false;
        }
        return ($traceurRuntime.createClass)(Switch, {
          set value(value) {
            this._emptyAllActiveViewContainers();
            this._useDefault = false;
            var containers = MapWrapper.get(this._valueViewContainers, value);
            if (isBlank(containers)) {
              this._useDefault = true;
              containers = normalizeBlank(MapWrapper.get(this._valueViewContainers, _whenDefault));
            }
            this._activateViewContainers(containers);
            this._switchValue = value;
          },
          _onWhenValueChanged: function(oldWhen, newWhen, viewContainer) {
            this._deregisterViewContainer(oldWhen, viewContainer);
            this._registerViewContainer(newWhen, viewContainer);
            if (oldWhen === this._switchValue) {
              viewContainer.remove();
              ListWrapper.remove(this._activeViewContainers, viewContainer);
            } else if (newWhen === this._switchValue) {
              if (this._useDefault) {
                this._useDefault = false;
                this._emptyAllActiveViewContainers();
              }
              viewContainer.create();
              ListWrapper.push(this._activeViewContainers, viewContainer);
            }
            if (this._activeViewContainers.length === 0 && !this._useDefault) {
              this._useDefault = true;
              this._activateViewContainers(MapWrapper.get(this._valueViewContainers, _whenDefault));
            }
          },
          _emptyAllActiveViewContainers: function() {
            var activeContainers = this._activeViewContainers;
            for (var i = 0; i < activeContainers.length; i++) {
              activeContainers[i].remove();
            }
            this._activeViewContainers = ListWrapper.create();
          },
          _activateViewContainers: function(containers) {
            if (isPresent(containers)) {
              for (var i = 0; i < containers.length; i++) {
                containers[i].create();
              }
              this._activeViewContainers = containers;
            }
          },
          _registerViewContainer: function(value, container) {
            var containers = MapWrapper.get(this._valueViewContainers, value);
            if (isBlank(containers)) {
              containers = ListWrapper.create();
              MapWrapper.set(this._valueViewContainers, value, containers);
            }
            ListWrapper.push(containers, container);
          },
          _deregisterViewContainer: function(value, container) {
            if (value == _whenDefault)
              return ;
            var containers = MapWrapper.get(this._valueViewContainers, value);
            if (containers.length == 1) {
              MapWrapper.delete(this._valueViewContainers, value);
            } else {
              ListWrapper.remove(containers, container);
            }
          }
        }, {});
      }());
      $__export("Switch", Switch);
      Object.defineProperty(Switch, "annotations", {get: function() {
          return [new Decorator({
            selector: '[switch]',
            properties: {'value': 'switch'}
          })];
        }});
      Object.defineProperty(Switch.prototype._onWhenValueChanged, "parameters", {get: function() {
          return [[], [], [ViewContainer]];
        }});
      Object.defineProperty(Switch.prototype._activateViewContainers, "parameters", {get: function() {
          return [[assert.genericType(List, ViewContainer)]];
        }});
      Object.defineProperty(Switch.prototype._registerViewContainer, "parameters", {get: function() {
          return [[], [ViewContainer]];
        }});
      Object.defineProperty(Switch.prototype._deregisterViewContainer, "parameters", {get: function() {
          return [[], [ViewContainer]];
        }});
      SwitchWhen = (function() {
        function SwitchWhen(viewContainer, sswitch) {
          this._value = _whenDefault;
          this._switch = sswitch;
          this._viewContainer = viewContainer;
        }
        return ($traceurRuntime.createClass)(SwitchWhen, {set when(value) {
            this._switch._onWhenValueChanged(this._value, value, this._viewContainer);
            this._value = value;
          }}, {});
      }());
      $__export("SwitchWhen", SwitchWhen);
      Object.defineProperty(SwitchWhen, "annotations", {get: function() {
          return [new Viewport({
            selector: '[switch-when]',
            properties: {'when': 'switch-when'}
          })];
        }});
      Object.defineProperty(SwitchWhen, "parameters", {get: function() {
          return [[ViewContainer], [Switch, new Parent()]];
        }});
      SwitchDefault = (function() {
        function SwitchDefault(viewContainer, sswitch) {
          sswitch._registerViewContainer(_whenDefault, viewContainer);
        }
        return ($traceurRuntime.createClass)(SwitchDefault, {}, {});
      }());
      $__export("SwitchDefault", SwitchDefault);
      Object.defineProperty(SwitchDefault, "annotations", {get: function() {
          return [new Viewport({selector: '[switch-default]'})];
        }});
      Object.defineProperty(SwitchDefault, "parameters", {get: function() {
          return [[ViewContainer], [Switch, new Parent()]];
        }});
      _whenDefault = new Object();
    }
  };
});

System.register("angular2/src/dom/browser_adapter", ["angular2/src/facade/collection", "angular2/src/facade/lang", "./dom_adapter", "./generic_browser_adapter"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/dom/browser_adapter";
  var List,
      MapWrapper,
      ListWrapper,
      isBlank,
      isPresent,
      setRootDomAdapter,
      GenericBrowserDomAdapter,
      _attrToPropMap,
      DOM_KEY_LOCATION_NUMPAD,
      _keyMap,
      _chromeNumKeyPadMap,
      BrowserDomAdapter;
  return {
    setters: [function($__m) {
      List = $__m.List;
      MapWrapper = $__m.MapWrapper;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
    }, function($__m) {
      setRootDomAdapter = $__m.setRootDomAdapter;
    }, function($__m) {
      GenericBrowserDomAdapter = $__m.GenericBrowserDomAdapter;
    }],
    execute: function() {
      _attrToPropMap = {
        'innerHtml': 'innerHTML',
        'readonly': 'readOnly',
        'tabindex': 'tabIndex'
      };
      DOM_KEY_LOCATION_NUMPAD = 3;
      _keyMap = {
        '\b': 'Backspace',
        '\t': 'Tab',
        '\x7F': 'Delete',
        '\x1B': 'Escape',
        'Del': 'Delete',
        'Esc': 'Escape',
        'Left': 'ArrowLeft',
        'Right': 'ArrowRight',
        'Up': 'ArrowUp',
        'Down': 'ArrowDown',
        'Menu': 'ContextMenu',
        'Scroll': 'ScrollLock',
        'Win': 'OS'
      };
      _chromeNumKeyPadMap = {
        'A': '1',
        'B': '2',
        'C': '3',
        'D': '4',
        'E': '5',
        'F': '6',
        'G': '7',
        'H': '8',
        'I': '9',
        'J': '*',
        'K': '+',
        'M': '-',
        'N': '.',
        'O': '/',
        '\x60': '0',
        '\x90': 'NumLock'
      };
      BrowserDomAdapter = (function($__super) {
        function BrowserDomAdapter() {
          $traceurRuntime.superConstructor(BrowserDomAdapter).apply(this, arguments);
        }
        return ($traceurRuntime.createClass)(BrowserDomAdapter, {
          get attrToPropMap() {
            return _attrToPropMap;
          },
          query: function(selector) {
            return document.querySelector(selector);
          },
          querySelector: function(el, selector) {
            return el.querySelector(selector);
          },
          querySelectorAll: function(el, selector) {
            return el.querySelectorAll(selector);
          },
          on: function(el, evt, listener) {
            el.addEventListener(evt, listener, false);
          },
          onAndCancel: function(el, evt, listener) {
            el.addEventListener(evt, listener, false);
            return (function() {
              el.removeEventListener(evt, listener, false);
            });
          },
          dispatchEvent: function(el, evt) {
            el.dispatchEvent(evt);
          },
          createMouseEvent: function(eventType) {
            var evt = new MouseEvent(eventType);
            evt.initEvent(eventType, true, true);
            return evt;
          },
          createEvent: function(eventType) {
            return new Event(eventType, true);
          },
          getInnerHTML: function(el) {
            return el.innerHTML;
          },
          getOuterHTML: function(el) {
            return el.outerHTML;
          },
          nodeName: function(node) {
            return node.nodeName;
          },
          nodeValue: function(node) {
            return node.nodeValue;
          },
          type: function(node) {
            return node.type;
          },
          content: function(node) {
            if (this.hasProperty(node, "content")) {
              return node.content;
            } else {
              return node;
            }
          },
          firstChild: function(el) {
            return el.firstChild;
          },
          nextSibling: function(el) {
            return el.nextSibling;
          },
          parentElement: function(el) {
            return el.parentElement;
          },
          childNodes: function(el) {
            return el.childNodes;
          },
          childNodesAsList: function(el) {
            var childNodes = el.childNodes;
            var res = ListWrapper.createFixedSize(childNodes.length);
            for (var i = 0; i < childNodes.length; i++) {
              res[i] = childNodes[i];
            }
            return res;
          },
          clearNodes: function(el) {
            for (var i = 0; i < el.childNodes.length; i++) {
              this.remove(el.childNodes[i]);
            }
          },
          appendChild: function(el, node) {
            el.appendChild(node);
          },
          removeChild: function(el, node) {
            el.removeChild(node);
          },
          replaceChild: function(el, newChild, oldChild) {
            el.replaceChild(newChild, oldChild);
          },
          remove: function(el) {
            var parent = el.parentNode;
            parent.removeChild(el);
            return el;
          },
          insertBefore: function(el, node) {
            el.parentNode.insertBefore(node, el);
          },
          insertAllBefore: function(el, nodes) {
            ListWrapper.forEach(nodes, (function(n) {
              el.parentNode.insertBefore(n, el);
            }));
          },
          insertAfter: function(el, node) {
            el.parentNode.insertBefore(node, el.nextSibling);
          },
          setInnerHTML: function(el, value) {
            el.innerHTML = value;
          },
          getText: function(el) {
            return el.textContent;
          },
          setText: function(el, value) {
            el.textContent = value;
          },
          getValue: function(el) {
            return el.value;
          },
          setValue: function(el, value) {
            el.value = value;
          },
          getChecked: function(el) {
            return el.checked;
          },
          setChecked: function(el, value) {
            el.checked = value;
          },
          createTemplate: function(html) {
            var t = document.createElement('template');
            t.innerHTML = html;
            return t;
          },
          createElement: function(tagName) {
            var doc = arguments[1] !== (void 0) ? arguments[1] : document;
            return doc.createElement(tagName);
          },
          createTextNode: function(text) {
            var doc = arguments[1] !== (void 0) ? arguments[1] : document;
            return doc.createTextNode(text);
          },
          createScriptTag: function(attrName, attrValue) {
            var doc = arguments[2] !== (void 0) ? arguments[2] : document;
            var el = doc.createElement('SCRIPT');
            el.setAttribute(attrName, attrValue);
            return el;
          },
          createStyleElement: function(css) {
            var doc = arguments[1] !== (void 0) ? arguments[1] : document;
            var style = doc.createElement('STYLE');
            style.innerText = css;
            return style;
          },
          createShadowRoot: function(el) {
            return el.createShadowRoot();
          },
          getShadowRoot: function(el) {
            return el.shadowRoot;
          },
          getHost: function(el) {
            return el.host;
          },
          clone: function(node) {
            return node.cloneNode(true);
          },
          hasProperty: function(element, name) {
            return name in element;
          },
          getElementsByClassName: function(element, name) {
            return element.getElementsByClassName(name);
          },
          getElementsByTagName: function(element, name) {
            return element.getElementsByTagName(name);
          },
          classList: function(element) {
            return Array.prototype.slice.call(element.classList, 0);
          },
          addClass: function(element, classname) {
            element.classList.add(classname);
          },
          removeClass: function(element, classname) {
            element.classList.remove(classname);
          },
          hasClass: function(element, classname) {
            return element.classList.contains(classname);
          },
          setStyle: function(element, stylename, stylevalue) {
            element.style[stylename] = stylevalue;
          },
          removeStyle: function(element, stylename) {
            element.style[stylename] = null;
          },
          getStyle: function(element, stylename) {
            return element.style[stylename];
          },
          tagName: function(element) {
            return element.tagName;
          },
          attributeMap: function(element) {
            var res = MapWrapper.create();
            var elAttrs = element.attributes;
            for (var i = 0; i < elAttrs.length; i++) {
              var attrib = elAttrs[i];
              MapWrapper.set(res, attrib.name, attrib.value);
            }
            return res;
          },
          getAttribute: function(element, attribute) {
            return element.getAttribute(attribute);
          },
          setAttribute: function(element, name, value) {
            element.setAttribute(name, value);
          },
          removeAttribute: function(element, attribute) {
            return element.removeAttribute(attribute);
          },
          templateAwareRoot: function(el) {
            return this.isTemplateElement(el) ? this.content(el) : el;
          },
          createHtmlDocument: function() {
            return document.implementation.createHTMLDocument('fakeTitle');
          },
          defaultDoc: function() {
            return document;
          },
          getBoundingClientRect: function(el) {
            return el.getBoundingClientRect();
          },
          getTitle: function() {
            return document.title;
          },
          setTitle: function(newTitle) {
            document.title = newTitle;
          },
          elementMatches: function(n, selector) {
            return n instanceof HTMLElement && n.matches(selector);
          },
          isTemplateElement: function(el) {
            return el instanceof HTMLElement && el.nodeName == "TEMPLATE";
          },
          isTextNode: function(node) {
            return node.nodeType === Node.TEXT_NODE;
          },
          isCommentNode: function(node) {
            return node.nodeType === Node.COMMENT_NODE;
          },
          isElementNode: function(node) {
            return node.nodeType === Node.ELEMENT_NODE;
          },
          hasShadowRoot: function(node) {
            return node instanceof HTMLElement && isPresent(node.shadowRoot);
          },
          isShadowRoot: function(node) {
            return node instanceof ShadowRoot;
          },
          importIntoDoc: function(node) {
            var result = document.importNode(node, true);
            if (this.isTemplateElement(result) && !this.content(result).childNodes.length && this.content(node).childNodes.length) {
              var childNodes = this.content(node).childNodes;
              for (var i = 0; i < childNodes.length; ++i) {
                this.content(result).appendChild(this.importIntoDoc(childNodes[i]));
              }
            }
            return result;
          },
          isPageRule: function(rule) {
            return rule.type === CSSRule.PAGE_RULE;
          },
          isStyleRule: function(rule) {
            return rule.type === CSSRule.STYLE_RULE;
          },
          isMediaRule: function(rule) {
            return rule.type === CSSRule.MEDIA_RULE;
          },
          isKeyframesRule: function(rule) {
            return rule.type === CSSRule.KEYFRAMES_RULE;
          },
          getHref: function(el) {
            return el.href;
          },
          getEventKey: function(event) {
            var key = event.key;
            if (isBlank(key)) {
              key = event.keyIdentifier;
              if (isBlank(key)) {
                return 'Unidentified';
              }
              if (key.startsWith('U+')) {
                key = String.fromCharCode(parseInt(key.substring(2), 16));
                if (event.location === DOM_KEY_LOCATION_NUMPAD && _chromeNumKeyPadMap.hasOwnProperty(key)) {
                  key = _chromeNumKeyPadMap[key];
                }
              }
            }
            if (_keyMap.hasOwnProperty(key)) {
              key = _keyMap[key];
            }
            return key;
          },
          getGlobalEventTarget: function(target) {
            if (target == "window") {
              return window;
            } else if (target == "document") {
              return document;
            } else if (target == "body") {
              return document.body;
            }
          }
        }, {makeCurrent: function() {
            setRootDomAdapter(new BrowserDomAdapter());
          }}, $__super);
      }(GenericBrowserDomAdapter));
      $__export("BrowserDomAdapter", BrowserDomAdapter);
      Object.defineProperty(BrowserDomAdapter.prototype.query, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.querySelector, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.querySelectorAll, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.nodeName, "parameters", {get: function() {
          return [[Node]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.nodeValue, "parameters", {get: function() {
          return [[Node]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.type, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.content, "parameters", {get: function() {
          return [[HTMLElement]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.replaceChild, "parameters", {get: function() {
          return [[Node], [], []];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.setText, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.setValue, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.setChecked, "parameters", {get: function() {
          return [[], [assert.type.boolean]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.createTextNode, "parameters", {get: function() {
          return [[assert.type.string], []];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.createScriptTag, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string], []];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.createStyleElement, "parameters", {get: function() {
          return [[assert.type.string], []];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.createShadowRoot, "parameters", {get: function() {
          return [[HTMLElement]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.getShadowRoot, "parameters", {get: function() {
          return [[HTMLElement]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.getHost, "parameters", {get: function() {
          return [[HTMLElement]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.clone, "parameters", {get: function() {
          return [[Node]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.hasProperty, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.getElementsByClassName, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.getElementsByTagName, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.addClass, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.removeClass, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.hasClass, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.setStyle, "parameters", {get: function() {
          return [[], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.removeStyle, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.getStyle, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.getAttribute, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.setAttribute, "parameters", {get: function() {
          return [[], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.removeAttribute, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.setTitle, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.elementMatches, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.isTemplateElement, "parameters", {get: function() {
          return [[assert.type.any]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.isTextNode, "parameters", {get: function() {
          return [[Node]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.isCommentNode, "parameters", {get: function() {
          return [[Node]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.isElementNode, "parameters", {get: function() {
          return [[Node]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.importIntoDoc, "parameters", {get: function() {
          return [[Node]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.getHref, "parameters", {get: function() {
          return [[Element]];
        }});
      Object.defineProperty(BrowserDomAdapter.prototype.getGlobalEventTarget, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
    }
  };
});

System.register("angular2/src/dom/dom_adapter", ["angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/dom/dom_adapter";
  var ABSTRACT,
      BaseException,
      DOM,
      DomAdapter;
  function setRootDomAdapter(adapter) {
    $__export("DOM", DOM = adapter);
  }
  function _abstract() {
    return new BaseException('This method is abstract');
  }
  $__export("setRootDomAdapter", setRootDomAdapter);
  return {
    setters: [function($__m) {
      ABSTRACT = $__m.ABSTRACT;
      BaseException = $__m.BaseException;
    }],
    execute: function() {
      $__export("DOM", DOM);
      Object.defineProperty(setRootDomAdapter, "parameters", {get: function() {
          return [[DomAdapter]];
        }});
      DomAdapter = (function() {
        function DomAdapter() {}
        return ($traceurRuntime.createClass)(DomAdapter, {
          get attrToPropMap() {
            throw _abstract();
          },
          parse: function(templateHtml) {
            throw _abstract();
          },
          query: function(selector) {
            throw _abstract();
          },
          querySelector: function(el, selector) {
            throw _abstract();
          },
          querySelectorAll: function(el, selector) {
            throw _abstract();
          },
          on: function(el, evt, listener) {
            throw _abstract();
          },
          onAndCancel: function(el, evt, listener) {
            throw _abstract();
          },
          dispatchEvent: function(el, evt) {
            throw _abstract();
          },
          createMouseEvent: function(eventType) {
            throw _abstract();
          },
          createEvent: function(eventType) {
            throw _abstract();
          },
          getInnerHTML: function(el) {
            throw _abstract();
          },
          getOuterHTML: function(el) {
            throw _abstract();
          },
          nodeName: function(node) {
            throw _abstract();
          },
          nodeValue: function(node) {
            throw _abstract();
          },
          type: function(node) {
            throw _abstract();
          },
          content: function(node) {
            throw _abstract();
          },
          firstChild: function(el) {
            throw _abstract();
          },
          nextSibling: function(el) {
            throw _abstract();
          },
          parentElement: function(el) {
            throw _abstract();
          },
          childNodes: function(el) {
            throw _abstract();
          },
          childNodesAsList: function(el) {
            throw _abstract();
          },
          clearNodes: function(el) {
            throw _abstract();
          },
          appendChild: function(el, node) {
            throw _abstract();
          },
          removeChild: function(el, node) {
            throw _abstract();
          },
          replaceChild: function(el, newNode, oldNode) {
            throw _abstract();
          },
          remove: function(el) {
            throw _abstract();
          },
          insertBefore: function(el, node) {
            throw _abstract();
          },
          insertAllBefore: function(el, nodes) {
            throw _abstract();
          },
          insertAfter: function(el, node) {
            throw _abstract();
          },
          setInnerHTML: function(el, value) {
            throw _abstract();
          },
          getText: function(el) {
            throw _abstract();
          },
          setText: function(el, value) {
            throw _abstract();
          },
          getValue: function(el) {
            throw _abstract();
          },
          setValue: function(el, value) {
            throw _abstract();
          },
          getChecked: function(el) {
            throw _abstract();
          },
          setChecked: function(el, value) {
            throw _abstract();
          },
          createTemplate: function(html) {
            throw _abstract();
          },
          createElement: function(tagName) {
            var doc = arguments[1] !== (void 0) ? arguments[1] : null;
            throw _abstract();
          },
          createTextNode: function(text) {
            var doc = arguments[1] !== (void 0) ? arguments[1] : null;
            throw _abstract();
          },
          createScriptTag: function(attrName, attrValue) {
            var doc = arguments[2] !== (void 0) ? arguments[2] : null;
            throw _abstract();
          },
          createStyleElement: function(css) {
            var doc = arguments[1] !== (void 0) ? arguments[1] : null;
            throw _abstract();
          },
          createShadowRoot: function(el) {
            throw _abstract();
          },
          getShadowRoot: function(el) {
            throw _abstract();
          },
          getHost: function(el) {
            throw _abstract();
          },
          getDistributedNodes: function(el) {
            throw _abstract();
          },
          clone: function(node) {
            throw _abstract();
          },
          hasProperty: function(element, name) {
            throw _abstract();
          },
          getElementsByClassName: function(element, name) {
            throw _abstract();
          },
          getElementsByTagName: function(element, name) {
            throw _abstract();
          },
          classList: function(element) {
            throw _abstract();
          },
          addClass: function(element, classname) {
            throw _abstract();
          },
          removeClass: function(element, classname) {
            throw _abstract();
          },
          hasClass: function(element, classname) {
            throw _abstract();
          },
          setStyle: function(element, stylename, stylevalue) {
            throw _abstract();
          },
          removeStyle: function(element, stylename) {
            throw _abstract();
          },
          getStyle: function(element, stylename) {
            throw _abstract();
          },
          tagName: function(element) {
            throw _abstract();
          },
          attributeMap: function(element) {
            throw _abstract();
          },
          getAttribute: function(element, attribute) {
            throw _abstract();
          },
          setAttribute: function(element, name, value) {
            throw _abstract();
          },
          removeAttribute: function(element, attribute) {
            throw _abstract();
          },
          templateAwareRoot: function(el) {
            throw _abstract();
          },
          createHtmlDocument: function() {
            throw _abstract();
          },
          defaultDoc: function() {
            throw _abstract();
          },
          getBoundingClientRect: function(el) {
            throw _abstract();
          },
          getTitle: function() {
            throw _abstract();
          },
          setTitle: function(newTitle) {
            throw _abstract();
          },
          elementMatches: function(n, selector) {
            throw _abstract();
          },
          isTemplateElement: function(el) {
            throw _abstract();
          },
          isTextNode: function(node) {
            throw _abstract();
          },
          isCommentNode: function(node) {
            throw _abstract();
          },
          isElementNode: function(node) {
            throw _abstract();
          },
          hasShadowRoot: function(node) {
            throw _abstract();
          },
          isShadowRoot: function(node) {
            throw _abstract();
          },
          importIntoDoc: function(node) {
            throw _abstract();
          },
          isPageRule: function(rule) {
            throw _abstract();
          },
          isStyleRule: function(rule) {
            throw _abstract();
          },
          isMediaRule: function(rule) {
            throw _abstract();
          },
          isKeyframesRule: function(rule) {
            throw _abstract();
          },
          getHref: function(element) {
            throw _abstract();
          },
          getEventKey: function(event) {
            throw _abstract();
          },
          resolveAndSetHref: function(element, baseUrl, href) {
            throw _abstract();
          },
          cssToRules: function(css) {
            throw _abstract();
          },
          supportsDOMEvents: function() {
            throw _abstract();
          },
          supportsNativeShadowDOM: function() {
            throw _abstract();
          },
          getGlobalEventTarget: function(target) {
            throw _abstract();
          }
        }, {});
      }());
      $__export("DomAdapter", DomAdapter);
      Object.defineProperty(DomAdapter, "annotations", {get: function() {
          return [new ABSTRACT()];
        }});
      Object.defineProperty(DomAdapter.prototype.parse, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(DomAdapter.prototype.query, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(DomAdapter.prototype.querySelector, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(DomAdapter.prototype.querySelectorAll, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(DomAdapter.prototype.setText, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(DomAdapter.prototype.setValue, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(DomAdapter.prototype.setChecked, "parameters", {get: function() {
          return [[], [assert.type.boolean]];
        }});
      Object.defineProperty(DomAdapter.prototype.createTextNode, "parameters", {get: function() {
          return [[assert.type.string], []];
        }});
      Object.defineProperty(DomAdapter.prototype.createScriptTag, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string], []];
        }});
      Object.defineProperty(DomAdapter.prototype.createStyleElement, "parameters", {get: function() {
          return [[assert.type.string], []];
        }});
      Object.defineProperty(DomAdapter.prototype.hasProperty, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(DomAdapter.prototype.getElementsByClassName, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(DomAdapter.prototype.getElementsByTagName, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(DomAdapter.prototype.addClass, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(DomAdapter.prototype.removeClass, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(DomAdapter.prototype.hasClass, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(DomAdapter.prototype.setStyle, "parameters", {get: function() {
          return [[], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(DomAdapter.prototype.removeStyle, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(DomAdapter.prototype.getStyle, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(DomAdapter.prototype.getAttribute, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(DomAdapter.prototype.setAttribute, "parameters", {get: function() {
          return [[], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(DomAdapter.prototype.removeAttribute, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(DomAdapter.prototype.setTitle, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(DomAdapter.prototype.elementMatches, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(DomAdapter.prototype.isTemplateElement, "parameters", {get: function() {
          return [[assert.type.any]];
        }});
      Object.defineProperty(DomAdapter.prototype.resolveAndSetHref, "parameters", {get: function() {
          return [[], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(DomAdapter.prototype.cssToRules, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(DomAdapter.prototype.getGlobalEventTarget, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
    }
  };
});

System.register("angular2/src/dom/generic_browser_adapter", ["angular2/src/facade/lang", "angular2/src/facade/collection", "./dom_adapter"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/dom/generic_browser_adapter";
  var ABSTRACT,
      List,
      ListWrapper,
      isPresent,
      isFunction,
      DomAdapter,
      GenericBrowserDomAdapter;
  return {
    setters: [function($__m) {
      ABSTRACT = $__m.ABSTRACT;
      isPresent = $__m.isPresent;
      isFunction = $__m.isFunction;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      DomAdapter = $__m.DomAdapter;
    }],
    execute: function() {
      GenericBrowserDomAdapter = (function($__super) {
        function GenericBrowserDomAdapter() {
          $traceurRuntime.superConstructor(GenericBrowserDomAdapter).apply(this, arguments);
        }
        return ($traceurRuntime.createClass)(GenericBrowserDomAdapter, {
          getDistributedNodes: function(el) {
            return el.getDistributedNodes();
          },
          resolveAndSetHref: function(el, baseUrl, href) {
            el.href = href == null ? baseUrl : baseUrl + '/../' + href;
          },
          cssToRules: function(css) {
            var style = this.createStyleElement(css);
            this.appendChild(this.defaultDoc().head, style);
            var rules = ListWrapper.create();
            if (isPresent(style.sheet)) {
              try {
                var rawRules = style.sheet.cssRules;
                rules = ListWrapper.createFixedSize(rawRules.length);
                for (var i = 0; i < rawRules.length; i++) {
                  rules[i] = rawRules[i];
                }
              } catch (e) {}
            } else {}
            this.remove(style);
            return rules;
          },
          supportsDOMEvents: function() {
            return true;
          },
          supportsNativeShadowDOM: function() {
            return isFunction(this.defaultDoc().body.createShadowRoot);
          }
        }, {}, $__super);
      }(DomAdapter));
      $__export("GenericBrowserDomAdapter", GenericBrowserDomAdapter);
      Object.defineProperty(GenericBrowserDomAdapter, "annotations", {get: function() {
          return [new ABSTRACT()];
        }});
      Object.defineProperty(GenericBrowserDomAdapter.prototype.resolveAndSetHref, "parameters", {get: function() {
          return [[], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(GenericBrowserDomAdapter.prototype.cssToRules, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
    }
  };
});

System.register("angular2/src/facade/async", ["angular2/src/facade/lang", "angular2/src/facade/collection", "rx/dist/rx.all"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/facade/async";
  var int,
      global,
      isPresent,
      List,
      Rx,
      Promise,
      PromiseWrapper,
      ObservableWrapper,
      Observable,
      EventEmitter;
  return {
    setters: [function($__m) {
      int = $__m.int;
      global = $__m.global;
      isPresent = $__m.isPresent;
    }, function($__m) {
      List = $__m.List;
    }, function($__m) {
      Rx = $__m.default;
    }],
    execute: function() {
      Promise = global.Promise;
      $__export("Promise", Promise);
      PromiseWrapper = (function() {
        function PromiseWrapper() {}
        return ($traceurRuntime.createClass)(PromiseWrapper, {}, {
          resolve: function(obj) {
            return Promise.resolve(obj);
          },
          reject: function(obj) {
            return Promise.reject(obj);
          },
          catchError: function(promise, onError) {
            return promise.catch(onError);
          },
          all: function(promises) {
            if (promises.length == 0)
              return Promise.resolve([]);
            return Promise.all(promises);
          },
          then: function(promise, success, rejection) {
            return promise.then(success, rejection);
          },
          completer: function() {
            var resolve;
            var reject;
            var p = new Promise(function(res, rej) {
              resolve = res;
              reject = rej;
            });
            return {
              promise: p,
              resolve: resolve,
              reject: reject
            };
          },
          setTimeout: function(fn, millis) {
            global.setTimeout(fn, millis);
          },
          isPromise: function(maybePromise) {
            return maybePromise instanceof Promise;
          }
        });
      }());
      $__export("PromiseWrapper", PromiseWrapper);
      Object.defineProperty(PromiseWrapper.catchError, "parameters", {get: function() {
          return [[Promise], [Function]];
        }});
      Object.defineProperty(PromiseWrapper.all, "parameters", {get: function() {
          return [[List]];
        }});
      Object.defineProperty(PromiseWrapper.then, "parameters", {get: function() {
          return [[Promise], [Function], [Function]];
        }});
      Object.defineProperty(PromiseWrapper.setTimeout, "parameters", {get: function() {
          return [[Function], [int]];
        }});
      ObservableWrapper = (function() {
        function ObservableWrapper() {}
        return ($traceurRuntime.createClass)(ObservableWrapper, {}, {
          subscribe: function(emitter, onNext) {
            var onThrow = arguments[2] !== (void 0) ? arguments[2] : null;
            var onReturn = arguments[3] !== (void 0) ? arguments[3] : null;
            return emitter.observer({
              next: onNext,
              throw: onThrow,
              return: onReturn
            });
          },
          dispose: function(subscription) {
            subscription.dispose();
          },
          isObservable: function(obs) {
            return obs instanceof Observable;
          },
          callNext: function(emitter, value) {
            emitter.next(value);
          },
          callThrow: function(emitter, error) {
            emitter.throw(error);
          },
          callReturn: function(emitter) {
            emitter.return();
          }
        });
      }());
      $__export("ObservableWrapper", ObservableWrapper);
      Object.defineProperty(ObservableWrapper.subscribe, "parameters", {get: function() {
          return [[EventEmitter], [], [], []];
        }});
      Object.defineProperty(ObservableWrapper.dispose, "parameters", {get: function() {
          return [[assert.type.any]];
        }});
      Object.defineProperty(ObservableWrapper.callNext, "parameters", {get: function() {
          return [[EventEmitter], [assert.type.any]];
        }});
      Object.defineProperty(ObservableWrapper.callThrow, "parameters", {get: function() {
          return [[EventEmitter], [assert.type.any]];
        }});
      Object.defineProperty(ObservableWrapper.callReturn, "parameters", {get: function() {
          return [[EventEmitter]];
        }});
      Observable = (function() {
        function Observable() {}
        return ($traceurRuntime.createClass)(Observable, {observer: function(generator) {}}, {});
      }());
      $__export("Observable", Observable);
      Object.defineProperty(Observable.prototype.observer, "parameters", {get: function() {
          return [[Function]];
        }});
      EventEmitter = (function($__super) {
        function EventEmitter() {
          $traceurRuntime.superConstructor(EventEmitter).call(this);
          this._subject = new Rx.Subject();
        }
        return ($traceurRuntime.createClass)(EventEmitter, {
          observer: function(generator) {
            return this._subject.observeOn(Rx.Scheduler.immediate).subscribe((function(value) {
              setTimeout((function() {
                return generator.next(value);
              }));
            }), (function(error) {
              return generator.throw ? generator.throw(error) : null;
            }), (function() {
              return generator.return ? generator.return() : null;
            }));
          },
          toRx: function() {
            return this._subject;
          },
          next: function(value) {
            this._subject.onNext(value);
          },
          throw: function(error) {
            this._subject.onError(error);
          },
          return: function(value) {
            this._subject.onCompleted();
          }
        }, {}, $__super);
      }(Observable));
      $__export("EventEmitter", EventEmitter);
    }
  };
});

System.register("angular2/src/facade/browser", [], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/facade/browser";
  var win,
      document,
      location,
      gc;
  return {
    setters: [],
    execute: function() {
      win = window;
      $__export("window", win);
      document = window.document;
      $__export("document", document);
      location = window.location;
      $__export("location", location);
      gc = window.gc ? (function() {
        return window.gc();
      }) : (function() {
        return null;
      });
      $__export("gc", gc);
    }
  };
});

System.register("angular2/src/facade/collection", ["angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/facade/collection";
  var int,
      isJsObject,
      global,
      List,
      Map,
      Set,
      StringMap,
      MapWrapper,
      StringMapWrapper,
      ListWrapper,
      SetWrapper;
  function isListLikeIterable(obj) {
    if (!isJsObject(obj))
      return false;
    return ListWrapper.isList(obj) || (!(obj instanceof Map) && Symbol.iterator in obj);
  }
  function iterateListLike(obj, fn) {
    if (ListWrapper.isList(obj)) {
      for (var i = 0; i < obj.length; i++) {
        fn(obj[i]);
      }
    } else {
      var iterator = obj[Symbol.iterator]();
      var item;
      while (!((item = iterator.next()).done)) {
        fn(item.value);
      }
    }
  }
  $__export("isListLikeIterable", isListLikeIterable);
  $__export("iterateListLike", iterateListLike);
  return {
    setters: [function($__m) {
      int = $__m.int;
      isJsObject = $__m.isJsObject;
      global = $__m.global;
    }],
    execute: function() {
      List = global.Array;
      $__export("List", List);
      Map = global.Map;
      $__export("Map", Map);
      Set = global.Set;
      $__export("Set", Set);
      StringMap = global.Object;
      $__export("StringMap", StringMap);
      MapWrapper = (function() {
        function MapWrapper() {}
        return ($traceurRuntime.createClass)(MapWrapper, {}, {
          create: function() {
            return new Map();
          },
          clone: function(m) {
            return new Map(m);
          },
          createFromStringMap: function(stringMap) {
            var result = MapWrapper.create();
            for (var prop in stringMap) {
              MapWrapper.set(result, prop, stringMap[prop]);
            }
            return result;
          },
          createFromPairs: function(pairs) {
            return new Map(pairs);
          },
          get: function(m, k) {
            return m.get(k);
          },
          set: function(m, k, v) {
            m.set(k, v);
          },
          contains: function(m, k) {
            return m.has(k);
          },
          forEach: function(m, fn) {
            m.forEach(fn);
          },
          size: function(m) {
            return m.size;
          },
          delete: function(m, k) {
            m.delete(k);
          },
          clear: function(m) {
            m.clear();
          },
          clearValues: function(m) {
            var keyIterator = m.keys();
            var k;
            while (!((k = keyIterator.next()).done)) {
              m.set(k.value, null);
            }
          },
          iterable: function(m) {
            return m;
          },
          keys: function(m) {
            return m.keys();
          },
          values: function(m) {
            return m.values();
          }
        });
      }());
      $__export("MapWrapper", MapWrapper);
      Object.defineProperty(MapWrapper.clone, "parameters", {get: function() {
          return [[Map]];
        }});
      Object.defineProperty(MapWrapper.createFromPairs, "parameters", {get: function() {
          return [[List]];
        }});
      StringMapWrapper = (function() {
        function StringMapWrapper() {}
        return ($traceurRuntime.createClass)(StringMapWrapper, {}, {
          create: function() {
            return {};
          },
          contains: function(map, key) {
            return map.hasOwnProperty(key);
          },
          get: function(map, key) {
            return map.hasOwnProperty(key) ? map[key] : undefined;
          },
          set: function(map, key, value) {
            map[key] = value;
          },
          isEmpty: function(map) {
            for (var prop in map) {
              return false;
            }
            return true;
          },
          delete: function(map, key) {
            delete map[key];
          },
          forEach: function(map, callback) {
            for (var prop in map) {
              if (map.hasOwnProperty(prop)) {
                callback(map[prop], prop);
              }
            }
          },
          merge: function(m1, m2) {
            var m = {};
            for (var attr in m1) {
              if (m1.hasOwnProperty(attr)) {
                m[attr] = m1[attr];
              }
            }
            for (var attr in m2) {
              if (m2.hasOwnProperty(attr)) {
                m[attr] = m2[attr];
              }
            }
            return m;
          }
        });
      }());
      $__export("StringMapWrapper", StringMapWrapper);
      ListWrapper = (function() {
        function ListWrapper() {}
        return ($traceurRuntime.createClass)(ListWrapper, {}, {
          create: function() {
            return new List();
          },
          createFixedSize: function(size) {
            return new List(size);
          },
          get: function(m, k) {
            return m[k];
          },
          set: function(m, k, v) {
            m[k] = v;
          },
          clone: function(array) {
            return array.slice(0);
          },
          map: function(array, fn) {
            return array.map(fn);
          },
          forEach: function(array, fn) {
            for (var i = 0; i < array.length; i++) {
              fn(array[i]);
            }
          },
          push: function(array, el) {
            array.push(el);
          },
          first: function(array) {
            if (!array)
              return null;
            return array[0];
          },
          last: function(array) {
            if (!array || array.length == 0)
              return null;
            return array[array.length - 1];
          },
          find: function(list, pred) {
            for (var i = 0; i < list.length; ++i) {
              if (pred(list[i]))
                return list[i];
            }
            return null;
          },
          reduce: function(list, fn, init) {
            return list.reduce(fn, init);
          },
          filter: function(array, pred) {
            return array.filter(pred);
          },
          indexOf: function(array, value) {
            var startIndex = arguments[2] !== (void 0) ? arguments[2] : -1;
            return array.indexOf(value, startIndex);
          },
          any: function(list, pred) {
            for (var i = 0; i < list.length; ++i) {
              if (pred(list[i]))
                return true;
            }
            return false;
          },
          contains: function(list, el) {
            return list.indexOf(el) !== -1;
          },
          reversed: function(array) {
            var a = ListWrapper.clone(array);
            return a.reverse();
          },
          concat: function(a, b) {
            return a.concat(b);
          },
          isList: function(list) {
            return Array.isArray(list);
          },
          insert: function(list, index, value) {
            list.splice(index, 0, value);
          },
          removeAt: function(list, index) {
            var res = list[index];
            list.splice(index, 1);
            return res;
          },
          removeAll: function(list, items) {
            for (var i = 0; i < items.length; ++i) {
              var index = list.indexOf(items[i]);
              list.splice(index, 1);
            }
          },
          removeLast: function(list) {
            return list.pop();
          },
          remove: function(list, el) {
            var index = list.indexOf(el);
            if (index > -1) {
              list.splice(index, 1);
              return true;
            }
            return false;
          },
          clear: function(list) {
            list.splice(0, list.length);
          },
          join: function(list, s) {
            return list.join(s);
          },
          isEmpty: function(list) {
            return list.length == 0;
          },
          fill: function(list, value) {
            var start = arguments[2] !== (void 0) ? arguments[2] : 0;
            var end = arguments[3] !== (void 0) ? arguments[3] : null;
            list.fill(value, start, end === null ? undefined : end);
          },
          equals: function(a, b) {
            if (a.length != b.length)
              return false;
            for (var i = 0; i < a.length; ++i) {
              if (a[i] !== b[i])
                return false;
            }
            return true;
          },
          slice: function(l, from, to) {
            return l.slice(from, to);
          },
          splice: function(l, from, length) {
            return l.splice(from, length);
          },
          sort: function(l, compareFn) {
            l.sort(compareFn);
          }
        });
      }());
      $__export("ListWrapper", ListWrapper);
      Object.defineProperty(ListWrapper.clone, "parameters", {get: function() {
          return [[List]];
        }});
      Object.defineProperty(ListWrapper.forEach, "parameters", {get: function() {
          return [[List], [Function]];
        }});
      Object.defineProperty(ListWrapper.find, "parameters", {get: function() {
          return [[List], [Function]];
        }});
      Object.defineProperty(ListWrapper.reduce, "parameters", {get: function() {
          return [[List], [Function], []];
        }});
      Object.defineProperty(ListWrapper.filter, "parameters", {get: function() {
          return [[], [Function]];
        }});
      Object.defineProperty(ListWrapper.any, "parameters", {get: function() {
          return [[List], [Function]];
        }});
      Object.defineProperty(ListWrapper.contains, "parameters", {get: function() {
          return [[List], []];
        }});
      Object.defineProperty(ListWrapper.insert, "parameters", {get: function() {
          return [[], [int], []];
        }});
      Object.defineProperty(ListWrapper.removeAt, "parameters", {get: function() {
          return [[], [int]];
        }});
      Object.defineProperty(ListWrapper.removeLast, "parameters", {get: function() {
          return [[List]];
        }});
      Object.defineProperty(ListWrapper.fill, "parameters", {get: function() {
          return [[List], [], [int], [int]];
        }});
      Object.defineProperty(ListWrapper.equals, "parameters", {get: function() {
          return [[List], [List]];
        }});
      Object.defineProperty(ListWrapper.slice, "parameters", {get: function() {
          return [[List], [int], [int]];
        }});
      Object.defineProperty(ListWrapper.splice, "parameters", {get: function() {
          return [[List], [int], [int]];
        }});
      Object.defineProperty(ListWrapper.sort, "parameters", {get: function() {
          return [[List], [Function]];
        }});
      Object.defineProperty(iterateListLike, "parameters", {get: function() {
          return [[], [Function]];
        }});
      SetWrapper = (function() {
        function SetWrapper() {}
        return ($traceurRuntime.createClass)(SetWrapper, {}, {
          createFromList: function(lst) {
            return new Set(lst);
          },
          has: function(s, key) {
            return s.has(key);
          }
        });
      }());
      $__export("SetWrapper", SetWrapper);
      Object.defineProperty(SetWrapper.createFromList, "parameters", {get: function() {
          return [[List]];
        }});
      Object.defineProperty(SetWrapper.has, "parameters", {get: function() {
          return [[Set], []];
        }});
    }
  };
});

System.register("angular2/src/facade/lang", [], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/facade/lang";
  var _global,
      Type,
      Math,
      Date,
      assertionsEnabled_,
      int,
      CONST,
      ABSTRACT,
      IMPLEMENTS,
      StringWrapper,
      StringJoiner,
      NumberParseError,
      NumberWrapper,
      RegExp,
      RegExpWrapper,
      RegExpMatcherWrapper,
      FunctionWrapper,
      BaseException,
      Json,
      DateWrapper;
  function isPresent(obj) {
    return obj !== undefined && obj !== null;
  }
  function isBlank(obj) {
    return obj === undefined || obj === null;
  }
  function isString(obj) {
    return typeof obj === "string";
  }
  function isFunction(obj) {
    return typeof obj === "function";
  }
  function stringify(token) {
    if (typeof token === 'string') {
      return token;
    }
    if (token === undefined || token === null) {
      return '' + token;
    }
    if (token.name) {
      return token.name;
    }
    return token.toString();
  }
  function looseIdentical(a, b) {
    return a === b || typeof a === "number" && typeof b === "number" && isNaN(a) && isNaN(b);
  }
  function getMapKey(value) {
    return value;
  }
  function normalizeBlank(obj) {
    return isBlank(obj) ? null : obj;
  }
  function isJsObject(o) {
    return o !== null && (typeof o === "function" || typeof o === "object");
  }
  function assertionsEnabled() {
    return assertionsEnabled_;
  }
  function print(obj) {
    if (obj instanceof Error) {
      console.log(obj.stack);
    } else {
      console.log(obj);
    }
  }
  $__export("isPresent", isPresent);
  $__export("isBlank", isBlank);
  $__export("isString", isString);
  $__export("isFunction", isFunction);
  $__export("stringify", stringify);
  $__export("looseIdentical", looseIdentical);
  $__export("getMapKey", getMapKey);
  $__export("normalizeBlank", normalizeBlank);
  $__export("isJsObject", isJsObject);
  $__export("assertionsEnabled", assertionsEnabled);
  $__export("print", print);
  return {
    setters: [],
    execute: function() {
      _global = typeof window === 'undefined' ? global : window;
      $__export("global", _global);
      Type = Function;
      $__export("Type", Type);
      Math = _global.Math;
      $__export("Math", Math);
      Date = _global.Date;
      $__export("Date", Date);
      assertionsEnabled_ = typeof assert !== 'undefined';
      if (assertionsEnabled_) {
        _global.assert = assert;
        $__export("int", int = assert.define('int', function(value) {
          return typeof value === 'number' && value % 1 === 0;
        }));
      } else {
        $__export("int", int = {});
        _global.assert = function() {};
      }
      $__export("int", int);
      CONST = (function() {
        function CONST() {}
        return ($traceurRuntime.createClass)(CONST, {}, {});
      }());
      $__export("CONST", CONST);
      ABSTRACT = (function() {
        function ABSTRACT() {}
        return ($traceurRuntime.createClass)(ABSTRACT, {}, {});
      }());
      $__export("ABSTRACT", ABSTRACT);
      IMPLEMENTS = (function() {
        function IMPLEMENTS() {}
        return ($traceurRuntime.createClass)(IMPLEMENTS, {}, {});
      }());
      $__export("IMPLEMENTS", IMPLEMENTS);
      StringWrapper = (function() {
        function StringWrapper() {}
        return ($traceurRuntime.createClass)(StringWrapper, {}, {
          fromCharCode: function(code) {
            return String.fromCharCode(code);
          },
          charCodeAt: function(s, index) {
            return s.charCodeAt(index);
          },
          split: function(s, regExp) {
            return s.split(regExp);
          },
          equals: function(s, s2) {
            return s === s2;
          },
          replace: function(s, from, replace) {
            return s.replace(from, replace);
          },
          replaceAll: function(s, from, replace) {
            return s.replace(from, replace);
          },
          startsWith: function(s, start) {
            return s.startsWith(start);
          },
          substring: function(s, start) {
            var end = arguments[2] !== (void 0) ? arguments[2] : null;
            return s.substring(start, end === null ? undefined : end);
          },
          replaceAllMapped: function(s, from, cb) {
            return s.replace(from, function() {
              for (var matches = [],
                  $__1 = 0; $__1 < arguments.length; $__1++)
                matches[$__1] = arguments[$__1];
              matches.splice(-2, 2);
              return cb(matches);
            });
          },
          contains: function(s, substr) {
            return s.indexOf(substr) != -1;
          }
        });
      }());
      $__export("StringWrapper", StringWrapper);
      Object.defineProperty(StringWrapper.fromCharCode, "parameters", {get: function() {
          return [[int]];
        }});
      Object.defineProperty(StringWrapper.charCodeAt, "parameters", {get: function() {
          return [[assert.type.string], [int]];
        }});
      Object.defineProperty(StringWrapper.split, "parameters", {get: function() {
          return [[assert.type.string], []];
        }});
      Object.defineProperty(StringWrapper.equals, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(StringWrapper.replace, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(StringWrapper.replaceAll, "parameters", {get: function() {
          return [[assert.type.string], [RegExp], [assert.type.string]];
        }});
      Object.defineProperty(StringWrapper.startsWith, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(StringWrapper.substring, "parameters", {get: function() {
          return [[assert.type.string], [int], [int]];
        }});
      Object.defineProperty(StringWrapper.replaceAllMapped, "parameters", {get: function() {
          return [[assert.type.string], [RegExp], [Function]];
        }});
      Object.defineProperty(StringWrapper.contains, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
      StringJoiner = (function() {
        function StringJoiner() {
          this.parts = [];
        }
        return ($traceurRuntime.createClass)(StringJoiner, {
          add: function(part) {
            this.parts.push(part);
          },
          toString: function() {
            return this.parts.join("");
          }
        }, {});
      }());
      $__export("StringJoiner", StringJoiner);
      Object.defineProperty(StringJoiner.prototype.add, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      NumberParseError = (function($__super) {
        function NumberParseError(message) {
          $traceurRuntime.superConstructor(NumberParseError).call(this);
          this.message = message;
        }
        return ($traceurRuntime.createClass)(NumberParseError, {toString: function() {
            return this.message;
          }}, {}, $__super);
      }(Error));
      $__export("NumberParseError", NumberParseError);
      NumberWrapper = (function() {
        function NumberWrapper() {}
        return ($traceurRuntime.createClass)(NumberWrapper, {}, {
          toFixed: function(n, fractionDigits) {
            return n.toFixed(fractionDigits);
          },
          equal: function(a, b) {
            return a === b;
          },
          parseIntAutoRadix: function(text) {
            var result = parseInt(text);
            if (isNaN(result)) {
              throw new NumberParseError("Invalid integer literal when parsing " + text);
            }
            return result;
          },
          parseInt: function(text, radix) {
            if (radix == 10) {
              if (/^(\-|\+)?[0-9]+$/.test(text)) {
                return parseInt(text, radix);
              }
            } else if (radix == 16) {
              if (/^(\-|\+)?[0-9ABCDEFabcdef]+$/.test(text)) {
                return parseInt(text, radix);
              }
            } else {
              var result = parseInt(text, radix);
              if (!isNaN(result)) {
                return result;
              }
            }
            throw new NumberParseError("Invalid integer literal when parsing " + text + " in base " + radix);
          },
          parseFloat: function(text) {
            return parseFloat(text);
          },
          get NaN() {
            return NaN;
          },
          isNaN: function(value) {
            return isNaN(value);
          },
          isInteger: function(value) {
            return Number.isInteger(value);
          }
        });
      }());
      $__export("NumberWrapper", NumberWrapper);
      Object.defineProperty(NumberWrapper.toFixed, "parameters", {get: function() {
          return [[assert.type.number], [int]];
        }});
      Object.defineProperty(NumberWrapper.parseIntAutoRadix, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(NumberWrapper.parseInt, "parameters", {get: function() {
          return [[assert.type.string], [int]];
        }});
      Object.defineProperty(NumberWrapper.parseFloat, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      RegExp = _global.RegExp;
      $__export("RegExp", RegExp);
      RegExpWrapper = (function() {
        function RegExpWrapper() {}
        return ($traceurRuntime.createClass)(RegExpWrapper, {}, {
          create: function(regExpStr) {
            var flags = arguments[1] !== (void 0) ? arguments[1] : '';
            flags = flags.replace(/g/g, '');
            return new _global.RegExp(regExpStr, flags + 'g');
          },
          firstMatch: function(regExp, input) {
            regExp.lastIndex = 0;
            return regExp.exec(input);
          },
          matcher: function(regExp, input) {
            regExp.lastIndex = 0;
            return {
              re: regExp,
              input: input
            };
          }
        });
      }());
      $__export("RegExpWrapper", RegExpWrapper);
      Object.defineProperty(RegExpWrapper.create, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      RegExpMatcherWrapper = (function() {
        function RegExpMatcherWrapper() {}
        return ($traceurRuntime.createClass)(RegExpMatcherWrapper, {}, {next: function(matcher) {
            return matcher.re.exec(matcher.input);
          }});
      }());
      $__export("RegExpMatcherWrapper", RegExpMatcherWrapper);
      FunctionWrapper = (function() {
        function FunctionWrapper() {}
        return ($traceurRuntime.createClass)(FunctionWrapper, {}, {apply: function(fn, posArgs) {
            return fn.apply(null, posArgs);
          }});
      }());
      $__export("FunctionWrapper", FunctionWrapper);
      Object.defineProperty(FunctionWrapper.apply, "parameters", {get: function() {
          return [[Function], []];
        }});
      BaseException = Error;
      $__export("BaseException", BaseException);
      Json = _global.JSON;
      $__export("Json", Json);
      DateWrapper = (function() {
        function DateWrapper() {}
        return ($traceurRuntime.createClass)(DateWrapper, {}, {
          fromMillis: function(ms) {
            return new Date(ms);
          },
          toMillis: function(date) {
            return date.getTime();
          },
          now: function() {
            return new Date();
          },
          toJson: function(date) {
            return date.toJSON();
          }
        });
      }());
      $__export("DateWrapper", DateWrapper);
      Object.defineProperty(DateWrapper.toMillis, "parameters", {get: function() {
          return [[Date]];
        }});
    }
  };
});

System.register("angular2/src/facade/math", ["angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/facade/math";
  var global,
      Math,
      NaN;
  return {
    setters: [function($__m) {
      global = $__m.global;
    }],
    execute: function() {
      Math = global.Math;
      $__export("Math", Math);
      NaN = global.NaN;
      $__export("NaN", NaN);
    }
  };
});

System.register("angular2/src/forms/directives", ["angular2/angular2", "angular2/di", "angular2/src/facade/lang", "angular2/src/facade/collection", "./model", "./validators"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/forms/directives";
  var View,
      Component,
      Decorator,
      Ancestor,
      onChange,
      PropertySetter,
      Optional,
      isBlank,
      isPresent,
      isString,
      CONST,
      StringMapWrapper,
      ListWrapper,
      ControlGroup,
      Control,
      Validators,
      DefaultValueAccessor,
      CheckboxControlValueAccessor,
      ControlDirective,
      ControlGroupDirective,
      FormDirectives;
  return {
    setters: [function($__m) {
      View = $__m.View;
      Component = $__m.Component;
      Decorator = $__m.Decorator;
      Ancestor = $__m.Ancestor;
      onChange = $__m.onChange;
      PropertySetter = $__m.PropertySetter;
    }, function($__m) {
      Optional = $__m.Optional;
    }, function($__m) {
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
      isString = $__m.isString;
      CONST = $__m.CONST;
    }, function($__m) {
      StringMapWrapper = $__m.StringMapWrapper;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      ControlGroup = $__m.ControlGroup;
      Control = $__m.Control;
    }, function($__m) {
      Validators = $__m.Validators;
    }],
    execute: function() {
      DefaultValueAccessor = (function() {
        function DefaultValueAccessor(setValueProperty) {
          this._setValueProperty = setValueProperty;
          this.onChange = (function(_) {});
        }
        return ($traceurRuntime.createClass)(DefaultValueAccessor, {writeValue: function(value) {
            this._setValueProperty(value);
          }}, {});
      }());
      $__export("DefaultValueAccessor", DefaultValueAccessor);
      Object.defineProperty(DefaultValueAccessor, "annotations", {get: function() {
          return [new Decorator({
            selector: '[control]',
            hostListeners: {
              'change': 'onChange($event.target.value)',
              'input': 'onChange($event.target.value)'
            }
          })];
        }});
      Object.defineProperty(DefaultValueAccessor, "parameters", {get: function() {
          return [[Function, new PropertySetter('value')]];
        }});
      CheckboxControlValueAccessor = (function() {
        function CheckboxControlValueAccessor(cd, setCheckedProperty) {
          this._setCheckedProperty = setCheckedProperty;
          this.onChange = (function(_) {});
          cd.valueAccessor = this;
        }
        return ($traceurRuntime.createClass)(CheckboxControlValueAccessor, {writeValue: function(value) {
            this._setCheckedProperty(value);
          }}, {});
      }());
      $__export("CheckboxControlValueAccessor", CheckboxControlValueAccessor);
      Object.defineProperty(CheckboxControlValueAccessor, "annotations", {get: function() {
          return [new Decorator({
            selector: 'input[type=checkbox][control]',
            hostListeners: {'change': 'onChange($event.target.checked)'}
          })];
        }});
      Object.defineProperty(CheckboxControlValueAccessor, "parameters", {get: function() {
          return [[ControlDirective], [Function, new PropertySetter('checked')]];
        }});
      ControlDirective = (function() {
        function ControlDirective(groupDirective, valueAccessor) {
          this._groupDirective = groupDirective;
          this.controlOrName = null;
          this.valueAccessor = valueAccessor;
          this.validator = Validators.nullValidator;
        }
        return ($traceurRuntime.createClass)(ControlDirective, {
          onChange: function(_) {
            this._initialize();
          },
          _initialize: function() {
            if (isPresent(this._groupDirective)) {
              this._groupDirective.addDirective(this);
            }
            var c = this._control();
            c.validator = Validators.compose([c.validator, this.validator]);
            this._updateDomValue();
            this._setUpUpdateControlValue();
          },
          _updateDomValue: function() {
            this.valueAccessor.writeValue(this._control().value);
          },
          _setUpUpdateControlValue: function() {
            var $__0 = this;
            this.valueAccessor.onChange = (function(newValue) {
              return $__0._control().updateValue(newValue);
            });
          },
          _control: function() {
            if (isString(this.controlOrName)) {
              return this._groupDirective.findControl(this.controlOrName);
            } else {
              return this.controlOrName;
            }
          }
        }, {});
      }());
      $__export("ControlDirective", ControlDirective);
      Object.defineProperty(ControlDirective, "annotations", {get: function() {
          return [new Decorator({
            lifecycle: [onChange],
            selector: '[control]',
            properties: {'controlOrName': 'control'}
          })];
        }});
      Object.defineProperty(ControlDirective, "parameters", {get: function() {
          return [[ControlGroupDirective, new Optional(), new Ancestor()], [DefaultValueAccessor]];
        }});
      ControlGroupDirective = (function() {
        function ControlGroupDirective(groupDirective) {
          this._groupDirective = groupDirective;
          this._directives = ListWrapper.create();
        }
        return ($traceurRuntime.createClass)(ControlGroupDirective, {
          set controlGroup(controlGroup) {
            if (isString(controlGroup)) {
              this._controlGroupName = controlGroup;
            } else {
              this._controlGroup = controlGroup;
            }
            this._updateDomValue();
          },
          _updateDomValue: function() {
            ListWrapper.forEach(this._directives, (function(cd) {
              return cd._updateDomValue();
            }));
          },
          addDirective: function(c) {
            ListWrapper.push(this._directives, c);
          },
          findControl: function(name) {
            return this._getControlGroup().controls[name];
          },
          _getControlGroup: function() {
            if (isPresent(this._controlGroupName)) {
              return this._groupDirective.findControl(this._controlGroupName);
            } else {
              return this._controlGroup;
            }
          }
        }, {});
      }());
      $__export("ControlGroupDirective", ControlGroupDirective);
      Object.defineProperty(ControlGroupDirective, "annotations", {get: function() {
          return [new Decorator({
            selector: '[control-group]',
            properties: {'controlGroup': 'control-group'}
          })];
        }});
      Object.defineProperty(ControlGroupDirective, "parameters", {get: function() {
          return [[ControlGroupDirective, new Optional(), new Ancestor()]];
        }});
      Object.defineProperty(ControlGroupDirective.prototype.addDirective, "parameters", {get: function() {
          return [[ControlDirective]];
        }});
      Object.defineProperty(ControlGroupDirective.prototype.findControl, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      FormDirectives = [ControlGroupDirective, ControlDirective, CheckboxControlValueAccessor, DefaultValueAccessor];
      $__export("FormDirectives", FormDirectives);
    }
  };
});

System.register("angular2/src/forms/form_builder", ["angular2/src/facade/collection", "angular2/src/facade/lang", "./model"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/forms/form_builder";
  var StringMapWrapper,
      ListWrapper,
      List,
      isPresent,
      modelModule,
      FormBuilder;
  return {
    setters: [function($__m) {
      StringMapWrapper = $__m.StringMapWrapper;
      ListWrapper = $__m.ListWrapper;
      List = $__m.List;
    }, function($__m) {
      isPresent = $__m.isPresent;
    }, function($__m) {
      modelModule = $__m;
    }],
    execute: function() {
      FormBuilder = (function() {
        function FormBuilder() {}
        return ($traceurRuntime.createClass)(FormBuilder, {
          group: function(controlsConfig) {
            var extra = arguments[1] !== (void 0) ? arguments[1] : null;
            var controls = this._reduceControls(controlsConfig);
            var optionals = isPresent(extra) ? StringMapWrapper.get(extra, "optionals") : null;
            var validator = isPresent(extra) ? StringMapWrapper.get(extra, "validator") : null;
            if (isPresent(validator)) {
              return new modelModule.ControlGroup(controls, optionals, validator);
            } else {
              return new modelModule.ControlGroup(controls, optionals);
            }
          },
          control: function(value) {
            var validator = arguments[1] !== (void 0) ? arguments[1] : null;
            if (isPresent(validator)) {
              return new modelModule.Control(value, validator);
            } else {
              return new modelModule.Control(value);
            }
          },
          array: function(controlsConfig) {
            var validator = arguments[1] !== (void 0) ? arguments[1] : null;
            var $__0 = this;
            var controls = ListWrapper.map(controlsConfig, (function(c) {
              return $__0._createControl(c);
            }));
            if (isPresent(validator)) {
              return new modelModule.ControlArray(controls, validator);
            } else {
              return new modelModule.ControlArray(controls);
            }
          },
          _reduceControls: function(controlsConfig) {
            var $__0 = this;
            var controls = {};
            StringMapWrapper.forEach(controlsConfig, (function(controlConfig, controlName) {
              controls[controlName] = $__0._createControl(controlConfig);
            }));
            return controls;
          },
          _createControl: function(controlConfig) {
            if (controlConfig instanceof modelModule.Control || controlConfig instanceof modelModule.ControlGroup || controlConfig instanceof modelModule.ControlArray) {
              return controlConfig;
            } else if (ListWrapper.isList(controlConfig)) {
              var value = ListWrapper.get(controlConfig, 0);
              var validator = controlConfig.length > 1 ? controlConfig[1] : null;
              return this.control(value, validator);
            } else {
              return this.control(controlConfig);
            }
          }
        }, {});
      }());
      $__export("FormBuilder", FormBuilder);
      Object.defineProperty(FormBuilder.prototype.control, "parameters", {get: function() {
          return [[], [Function]];
        }});
      Object.defineProperty(FormBuilder.prototype.array, "parameters", {get: function() {
          return [[List], [Function]];
        }});
    }
  };
});

System.register("angular2/src/forms/model", ["angular2/src/facade/lang", "angular2/src/facade/async", "angular2/src/facade/collection", "./validators"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/forms/model";
  var isPresent,
      Observable,
      EventEmitter,
      ObservableWrapper,
      StringMap,
      StringMapWrapper,
      ListWrapper,
      List,
      Validators,
      VALID,
      INVALID,
      AbstractControl,
      Control,
      ControlGroup,
      ControlArray;
  return {
    setters: [function($__m) {
      isPresent = $__m.isPresent;
    }, function($__m) {
      Observable = $__m.Observable;
      EventEmitter = $__m.EventEmitter;
      ObservableWrapper = $__m.ObservableWrapper;
    }, function($__m) {
      StringMap = $__m.StringMap;
      StringMapWrapper = $__m.StringMapWrapper;
      ListWrapper = $__m.ListWrapper;
      List = $__m.List;
    }, function($__m) {
      Validators = $__m.Validators;
    }],
    execute: function() {
      VALID = "VALID";
      $__export("VALID", VALID);
      INVALID = "INVALID";
      $__export("INVALID", INVALID);
      AbstractControl = (function() {
        function AbstractControl(validator) {
          this.validator = validator;
          this._pristine = true;
        }
        return ($traceurRuntime.createClass)(AbstractControl, {
          get value() {
            return this._value;
          },
          get status() {
            return this._status;
          },
          get valid() {
            return this._status === VALID;
          },
          get errors() {
            return this._errors;
          },
          get pristine() {
            return this._pristine;
          },
          get dirty() {
            return !this.pristine;
          },
          get valueChanges() {
            return this._valueChanges;
          },
          setParent: function(parent) {
            this._parent = parent;
          },
          _updateParent: function() {
            if (isPresent(this._parent)) {
              this._parent._updateValue();
            }
          }
        }, {});
      }());
      $__export("AbstractControl", AbstractControl);
      Object.defineProperty(AbstractControl, "parameters", {get: function() {
          return [[Function]];
        }});
      Control = (function($__super) {
        function Control(value) {
          var validator = arguments[1] !== (void 0) ? arguments[1] : Validators.nullValidator;
          $traceurRuntime.superConstructor(Control).call(this, validator);
          this._setValueErrorsStatus(value);
          this._valueChanges = new EventEmitter();
        }
        return ($traceurRuntime.createClass)(Control, {
          updateValue: function(value) {
            this._setValueErrorsStatus(value);
            this._pristine = false;
            ObservableWrapper.callNext(this._valueChanges, this._value);
            this._updateParent();
          },
          _setValueErrorsStatus: function(value) {
            this._value = value;
            this._errors = this.validator(this);
            this._status = isPresent(this._errors) ? INVALID : VALID;
          }
        }, {}, $__super);
      }(AbstractControl));
      $__export("Control", Control);
      Object.defineProperty(Control, "parameters", {get: function() {
          return [[assert.type.any], [Function]];
        }});
      Object.defineProperty(Control.prototype.updateValue, "parameters", {get: function() {
          return [[assert.type.any]];
        }});
      ControlGroup = (function($__super) {
        function ControlGroup(controls) {
          var optionals = arguments[1] !== (void 0) ? arguments[1] : null;
          var validator = arguments[2] !== (void 0) ? arguments[2] : Validators.group;
          $traceurRuntime.superConstructor(ControlGroup).call(this, validator);
          this.controls = controls;
          this._optionals = isPresent(optionals) ? optionals : {};
          this._valueChanges = new EventEmitter();
          this._setParentForControls();
          this._setValueErrorsStatus();
        }
        return ($traceurRuntime.createClass)(ControlGroup, {
          include: function(controlName) {
            StringMapWrapper.set(this._optionals, controlName, true);
            this._updateValue();
          },
          exclude: function(controlName) {
            StringMapWrapper.set(this._optionals, controlName, false);
            this._updateValue();
          },
          contains: function(controlName) {
            var c = StringMapWrapper.contains(this.controls, controlName);
            return c && this._included(controlName);
          },
          _setParentForControls: function() {
            var $__0 = this;
            StringMapWrapper.forEach(this.controls, (function(control, name) {
              control.setParent($__0);
            }));
          },
          _updateValue: function() {
            this._setValueErrorsStatus();
            this._pristine = false;
            ObservableWrapper.callNext(this._valueChanges, this._value);
            this._updateParent();
          },
          _setValueErrorsStatus: function() {
            this._value = this._reduceValue();
            this._errors = this.validator(this);
            this._status = isPresent(this._errors) ? INVALID : VALID;
          },
          _reduceValue: function() {
            return this._reduceChildren({}, (function(acc, control, name) {
              acc[name] = control.value;
              return acc;
            }));
          },
          _reduceChildren: function(initValue, fn) {
            var $__0 = this;
            var res = initValue;
            StringMapWrapper.forEach(this.controls, (function(control, name) {
              if ($__0._included(name)) {
                res = fn(res, control, name);
              }
            }));
            return res;
          },
          _included: function(controlName) {
            var isOptional = StringMapWrapper.contains(this._optionals, controlName);
            return !isOptional || StringMapWrapper.get(this._optionals, controlName);
          }
        }, {}, $__super);
      }(AbstractControl));
      $__export("ControlGroup", ControlGroup);
      Object.defineProperty(ControlGroup, "parameters", {get: function() {
          return [[StringMap], [StringMap], [Function]];
        }});
      Object.defineProperty(ControlGroup.prototype.include, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(ControlGroup.prototype.exclude, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(ControlGroup.prototype.contains, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(ControlGroup.prototype._reduceChildren, "parameters", {get: function() {
          return [[assert.type.any], [Function]];
        }});
      Object.defineProperty(ControlGroup.prototype._included, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      ControlArray = (function($__super) {
        function ControlArray(controls) {
          var validator = arguments[1] !== (void 0) ? arguments[1] : Validators.array;
          $traceurRuntime.superConstructor(ControlArray).call(this, validator);
          this.controls = controls;
          this._valueChanges = new EventEmitter();
          this._setParentForControls();
          this._setValueErrorsStatus();
        }
        return ($traceurRuntime.createClass)(ControlArray, {
          at: function(index) {
            return this.controls[index];
          },
          push: function(control) {
            ListWrapper.push(this.controls, control);
            control.setParent(this);
            this._updateValue();
          },
          insert: function(index, control) {
            ListWrapper.insert(this.controls, index, control);
            control.setParent(this);
            this._updateValue();
          },
          removeAt: function(index) {
            ListWrapper.removeAt(this.controls, index);
            this._updateValue();
          },
          get length() {
            return this.controls.length;
          },
          _updateValue: function() {
            this._setValueErrorsStatus();
            this._pristine = false;
            ObservableWrapper.callNext(this._valueChanges, this._value);
            this._updateParent();
          },
          _setParentForControls: function() {
            var $__0 = this;
            ListWrapper.forEach(this.controls, (function(control) {
              control.setParent($__0);
            }));
          },
          _setValueErrorsStatus: function() {
            this._value = ListWrapper.map(this.controls, (function(c) {
              return c.value;
            }));
            this._errors = this.validator(this);
            this._status = isPresent(this._errors) ? INVALID : VALID;
          }
        }, {}, $__super);
      }(AbstractControl));
      $__export("ControlArray", ControlArray);
      Object.defineProperty(ControlArray, "parameters", {get: function() {
          return [[assert.genericType(List, AbstractControl)], [Function]];
        }});
      Object.defineProperty(ControlArray.prototype.at, "parameters", {get: function() {
          return [[assert.type.number]];
        }});
      Object.defineProperty(ControlArray.prototype.push, "parameters", {get: function() {
          return [[AbstractControl]];
        }});
      Object.defineProperty(ControlArray.prototype.insert, "parameters", {get: function() {
          return [[assert.type.number], [AbstractControl]];
        }});
      Object.defineProperty(ControlArray.prototype.removeAt, "parameters", {get: function() {
          return [[assert.type.number]];
        }});
    }
  };
});

System.register("angular2/src/forms/validator_directives", ["angular2/angular2", "angular2/forms"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/forms/validator_directives";
  var Decorator,
      ControlDirective,
      Validators,
      RequiredValidatorDirective;
  return {
    setters: [function($__m) {
      Decorator = $__m.Decorator;
    }, function($__m) {
      ControlDirective = $__m.ControlDirective;
      Validators = $__m.Validators;
    }],
    execute: function() {
      RequiredValidatorDirective = (function() {
        function RequiredValidatorDirective(c) {
          c.validator = Validators.compose([c.validator, Validators.required]);
        }
        return ($traceurRuntime.createClass)(RequiredValidatorDirective, {}, {});
      }());
      $__export("RequiredValidatorDirective", RequiredValidatorDirective);
      Object.defineProperty(RequiredValidatorDirective, "annotations", {get: function() {
          return [new Decorator({selector: '[required]'})];
        }});
      Object.defineProperty(RequiredValidatorDirective, "parameters", {get: function() {
          return [[ControlDirective]];
        }});
    }
  };
});

System.register("angular2/src/forms/validators", ["angular2/src/facade/lang", "angular2/src/facade/collection", "./model"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/forms/validators";
  var isBlank,
      isPresent,
      List,
      ListWrapper,
      StringMapWrapper,
      modelModule,
      Validators;
  return {
    setters: [function($__m) {
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
      StringMapWrapper = $__m.StringMapWrapper;
    }, function($__m) {
      modelModule = $__m;
    }],
    execute: function() {
      Validators = (function() {
        function Validators() {}
        return ($traceurRuntime.createClass)(Validators, {}, {
          required: function(c) {
            return isBlank(c.value) || c.value == "" ? {"required": true} : null;
          },
          nullValidator: function(c) {
            return null;
          },
          compose: function(validators) {
            return function(c) {
              var res = ListWrapper.reduce(validators, (function(res, validator) {
                var errors = validator(c);
                return isPresent(errors) ? StringMapWrapper.merge(res, errors) : res;
              }), {});
              return StringMapWrapper.isEmpty(res) ? null : res;
            };
          },
          group: function(c) {
            var res = {};
            StringMapWrapper.forEach(c.controls, (function(control, name) {
              if (c.contains(name) && isPresent(control.errors)) {
                Validators._mergeErrors(control, res);
              }
            }));
            return StringMapWrapper.isEmpty(res) ? null : res;
          },
          array: function(c) {
            var res = {};
            ListWrapper.forEach(c.controls, (function(control) {
              if (isPresent(control.errors)) {
                Validators._mergeErrors(control, res);
              }
            }));
            return StringMapWrapper.isEmpty(res) ? null : res;
          },
          _mergeErrors: function(control, res) {
            StringMapWrapper.forEach(control.errors, (function(value, error) {
              if (!StringMapWrapper.contains(res, error)) {
                res[error] = [];
              }
              ListWrapper.push(res[error], control);
            }));
          }
        });
      }());
      $__export("Validators", Validators);
      Object.defineProperty(Validators.required, "parameters", {get: function() {
          return [[modelModule.Control]];
        }});
      Object.defineProperty(Validators.nullValidator, "parameters", {get: function() {
          return [[assert.type.any]];
        }});
      Object.defineProperty(Validators.compose, "parameters", {get: function() {
          return [[assert.genericType(List, Function)]];
        }});
      Object.defineProperty(Validators.group, "parameters", {get: function() {
          return [[modelModule.ControlGroup]];
        }});
      Object.defineProperty(Validators.array, "parameters", {get: function() {
          return [[modelModule.ControlArray]];
        }});
    }
  };
});

System.register("angular2/src/mock/template_resolver_mock", ["angular2/src/facade/collection", "angular2/src/facade/lang", "angular2/src/core/annotations/view", "angular2/src/core/compiler/template_resolver"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/mock/template_resolver_mock";
  var Map,
      MapWrapper,
      ListWrapper,
      Type,
      isPresent,
      BaseException,
      stringify,
      isBlank,
      View,
      TemplateResolver,
      MockTemplateResolver;
  return {
    setters: [function($__m) {
      Map = $__m.Map;
      MapWrapper = $__m.MapWrapper;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      Type = $__m.Type;
      isPresent = $__m.isPresent;
      BaseException = $__m.BaseException;
      stringify = $__m.stringify;
      isBlank = $__m.isBlank;
    }, function($__m) {
      View = $__m.View;
    }, function($__m) {
      TemplateResolver = $__m.TemplateResolver;
    }],
    execute: function() {
      MockTemplateResolver = (function($__super) {
        function MockTemplateResolver() {
          $traceurRuntime.superConstructor(MockTemplateResolver).call(this);
          this._templates = MapWrapper.create();
          this._inlineTemplates = MapWrapper.create();
          this._templateCache = MapWrapper.create();
          this._directiveOverrides = MapWrapper.create();
        }
        return ($traceurRuntime.createClass)(MockTemplateResolver, {
          setView: function(component, view) {
            this._checkOverrideable(component);
            MapWrapper.set(this._templates, component, view);
          },
          setInlineTemplate: function(component, template) {
            this._checkOverrideable(component);
            MapWrapper.set(this._inlineTemplates, component, template);
          },
          overrideTemplateDirective: function(component, from, to) {
            this._checkOverrideable(component);
            var overrides = MapWrapper.get(this._directiveOverrides, component);
            if (isBlank(overrides)) {
              overrides = MapWrapper.create();
              MapWrapper.set(this._directiveOverrides, component, overrides);
            }
            MapWrapper.set(overrides, from, to);
          },
          resolve: function(component) {
            var view = MapWrapper.get(this._templateCache, component);
            if (isPresent(view))
              return view;
            view = MapWrapper.get(this._templates, component);
            if (isBlank(view)) {
              view = $traceurRuntime.superGet(this, MockTemplateResolver.prototype, "resolve").call(this, component);
            }
            var directives = view.directives;
            var overrides = MapWrapper.get(this._directiveOverrides, component);
            if (isPresent(overrides) && isPresent(directives)) {
              directives = ListWrapper.clone(view.directives);
              MapWrapper.forEach(overrides, (function(to, from) {
                var srcIndex = directives.indexOf(from);
                if (srcIndex == -1) {
                  throw new BaseException(("Overriden directive " + stringify(from) + " not found in the template of " + stringify(component)));
                }
                directives[srcIndex] = to;
              }));
              view = new View({
                template: view.template,
                templateUrl: view.templateUrl,
                directives: directives
              });
            }
            var inlineTemplate = MapWrapper.get(this._inlineTemplates, component);
            if (isPresent(inlineTemplate)) {
              view = new View({
                template: inlineTemplate,
                templateUrl: null,
                directives: view.directives
              });
            }
            MapWrapper.set(this._templateCache, component, view);
            return view;
          },
          _checkOverrideable: function(component) {
            var cached = MapWrapper.get(this._templateCache, component);
            if (isPresent(cached)) {
              throw new BaseException(("The component " + stringify(component) + " has already been compiled, its configuration can not be changed"));
            }
          }
        }, {}, $__super);
      }(TemplateResolver));
      $__export("MockTemplateResolver", MockTemplateResolver);
      Object.defineProperty(MockTemplateResolver.prototype.setView, "parameters", {get: function() {
          return [[Type], [View]];
        }});
      Object.defineProperty(MockTemplateResolver.prototype.setInlineTemplate, "parameters", {get: function() {
          return [[Type], [assert.type.string]];
        }});
      Object.defineProperty(MockTemplateResolver.prototype.overrideTemplateDirective, "parameters", {get: function() {
          return [[Type], [Type], [Type]];
        }});
      Object.defineProperty(MockTemplateResolver.prototype.resolve, "parameters", {get: function() {
          return [[Type]];
        }});
      Object.defineProperty(MockTemplateResolver.prototype._checkOverrideable, "parameters", {get: function() {
          return [[Type]];
        }});
    }
  };
});

System.register("angular2/src/mock/vm_turn_zone_mock", ["angular2/src/core/zone/vm_turn_zone"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/mock/vm_turn_zone_mock";
  var VmTurnZone,
      MockVmTurnZone;
  return {
    setters: [function($__m) {
      VmTurnZone = $__m.VmTurnZone;
    }],
    execute: function() {
      MockVmTurnZone = (function($__super) {
        function MockVmTurnZone() {
          $traceurRuntime.superConstructor(MockVmTurnZone).call(this, {enableLongStackTrace: false});
        }
        return ($traceurRuntime.createClass)(MockVmTurnZone, {
          run: function(fn) {
            fn();
          },
          runOutsideAngular: function(fn) {
            return fn();
          }
        }, {}, $__super);
      }(VmTurnZone));
      $__export("MockVmTurnZone", MockVmTurnZone);
    }
  };
});

System.register("angular2/src/mock/xhr_mock", ["angular2/src/services/xhr", "angular2/src/facade/collection", "angular2/src/facade/lang", "angular2/src/facade/async"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/mock/xhr_mock";
  var XHR,
      List,
      ListWrapper,
      Map,
      MapWrapper,
      isBlank,
      isPresent,
      normalizeBlank,
      BaseException,
      PromiseWrapper,
      Promise,
      MockXHR,
      _PendingRequest,
      _Expectation;
  return {
    setters: [function($__m) {
      XHR = $__m.XHR;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
      Map = $__m.Map;
      MapWrapper = $__m.MapWrapper;
    }, function($__m) {
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
      normalizeBlank = $__m.normalizeBlank;
      BaseException = $__m.BaseException;
    }, function($__m) {
      PromiseWrapper = $__m.PromiseWrapper;
      Promise = $__m.Promise;
    }],
    execute: function() {
      MockXHR = (function($__super) {
        function MockXHR() {
          $traceurRuntime.superConstructor(MockXHR).call(this);
          this._expectations = [];
          this._definitions = MapWrapper.create();
          this._requests = [];
        }
        return ($traceurRuntime.createClass)(MockXHR, {
          get: function(url) {
            var request = new _PendingRequest(url);
            ListWrapper.push(this._requests, request);
            return request.getPromise();
          },
          expect: function(url, response) {
            var expectation = new _Expectation(url, response);
            ListWrapper.push(this._expectations, expectation);
          },
          when: function(url, response) {
            MapWrapper.set(this._definitions, url, response);
          },
          flush: function() {
            if (this._requests.length === 0) {
              throw new BaseException('No pending requests to flush');
            }
            do {
              var request = ListWrapper.removeAt(this._requests, 0);
              this._processRequest(request);
            } while (this._requests.length > 0);
            this.verifyNoOustandingExpectations();
          },
          verifyNoOustandingExpectations: function() {
            if (this._expectations.length === 0)
              return ;
            var urls = [];
            for (var i = 0; i < this._expectations.length; i++) {
              var expectation = this._expectations[i];
              ListWrapper.push(urls, expectation.url);
            }
            throw new BaseException(("Unsatisfied requests: " + ListWrapper.join(urls, ', ')));
          },
          _processRequest: function(request) {
            var url = request.url;
            if (this._expectations.length > 0) {
              var expectation = this._expectations[0];
              if (expectation.url == url) {
                ListWrapper.remove(this._expectations, expectation);
                request.complete(expectation.response);
                return ;
              }
            }
            if (MapWrapper.contains(this._definitions, url)) {
              var response = MapWrapper.get(this._definitions, url);
              request.complete(normalizeBlank(response));
              return ;
            }
            throw new BaseException(("Unexpected request " + url));
          }
        }, {}, $__super);
      }(XHR));
      $__export("MockXHR", MockXHR);
      Object.defineProperty(MockXHR.prototype.get, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(MockXHR.prototype.expect, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(MockXHR.prototype.when, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(MockXHR.prototype._processRequest, "parameters", {get: function() {
          return [[_PendingRequest]];
        }});
      _PendingRequest = (function() {
        function _PendingRequest(url) {
          this.url = url;
          this.completer = PromiseWrapper.completer();
        }
        return ($traceurRuntime.createClass)(_PendingRequest, {
          complete: function(response) {
            if (isBlank(response)) {
              this.completer.reject(("Failed to load " + this.url));
            } else {
              this.completer.resolve(response);
            }
          },
          getPromise: function() {
            return this.completer.promise;
          }
        }, {});
      }());
      Object.defineProperty(_PendingRequest.prototype.complete, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      _Expectation = (function() {
        function _Expectation(url, response) {
          this.url = url;
          this.response = response;
        }
        return ($traceurRuntime.createClass)(_Expectation, {}, {});
      }());
      Object.defineProperty(_Expectation, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
    }
  };
});

System.register("angular2/src/reflection/reflection", ["angular2/src/facade/lang", "angular2/src/facade/collection", "./reflector", "./reflection_capabilities"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/reflection/reflection";
  var Type,
      isPresent,
      List,
      ListWrapper,
      Reflector,
      ReflectionCapabilities,
      reflector;
  return {
    setters: [function($__m) {
      Type = $__m.Type;
      isPresent = $__m.isPresent;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      Reflector = $__m.Reflector;
      $__export("Reflector", $__m.Reflector);
    }, function($__m) {
      ReflectionCapabilities = $__m.ReflectionCapabilities;
    }],
    execute: function() {
      reflector = new Reflector(new ReflectionCapabilities());
      $__export("reflector", reflector);
    }
  };
});

System.register("angular2/src/reflection/reflection_capabilities", ["angular2/src/facade/lang", "angular2/src/facade/collection", "./types"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/reflection/reflection_capabilities";
  var Type,
      isPresent,
      List,
      ListWrapper,
      GetterFn,
      SetterFn,
      MethodFn,
      ReflectionCapabilities;
  return {
    setters: [function($__m) {
      Type = $__m.Type;
      isPresent = $__m.isPresent;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      GetterFn = $__m.GetterFn;
      SetterFn = $__m.SetterFn;
      MethodFn = $__m.MethodFn;
    }],
    execute: function() {
      ReflectionCapabilities = (function() {
        function ReflectionCapabilities() {}
        return ($traceurRuntime.createClass)(ReflectionCapabilities, {
          factory: function(type) {
            switch (type.length) {
              case 0:
                return function() {
                  return new type();
                };
              case 1:
                return function(a1) {
                  return new type(a1);
                };
              case 2:
                return function(a1, a2) {
                  return new type(a1, a2);
                };
              case 3:
                return function(a1, a2, a3) {
                  return new type(a1, a2, a3);
                };
              case 4:
                return function(a1, a2, a3, a4) {
                  return new type(a1, a2, a3, a4);
                };
              case 5:
                return function(a1, a2, a3, a4, a5) {
                  return new type(a1, a2, a3, a4, a5);
                };
              case 6:
                return function(a1, a2, a3, a4, a5, a6) {
                  return new type(a1, a2, a3, a4, a5, a6);
                };
              case 7:
                return function(a1, a2, a3, a4, a5, a6, a7) {
                  return new type(a1, a2, a3, a4, a5, a6, a7);
                };
              case 8:
                return function(a1, a2, a3, a4, a5, a6, a7, a8) {
                  return new type(a1, a2, a3, a4, a5, a6, a7, a8);
                };
              case 9:
                return function(a1, a2, a3, a4, a5, a6, a7, a8, a9) {
                  return new type(a1, a2, a3, a4, a5, a6, a7, a8, a9);
                };
              case 10:
                return function(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10) {
                  return new type(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10);
                };
            }
            ;
            throw new Error("Factory cannot take more than 10 arguments");
          },
          parameters: function(typeOfFunc) {
            return isPresent(typeOfFunc.parameters) ? typeOfFunc.parameters : ListWrapper.createFixedSize(typeOfFunc.length);
          },
          annotations: function(typeOfFunc) {
            return isPresent(typeOfFunc.annotations) ? typeOfFunc.annotations : [];
          },
          getter: function(name) {
            return new Function('o', 'return o.' + name + ';');
          },
          setter: function(name) {
            return new Function('o', 'v', 'return o.' + name + ' = v;');
          },
          method: function(name) {
            var method = ("o." + name);
            return new Function('o', 'args', ("if (!" + method + ") throw new Error('\"" + name + "\" is undefined');") + ("return " + method + ".apply(o, args);"));
          }
        }, {});
      }());
      $__export("ReflectionCapabilities", ReflectionCapabilities);
      Object.defineProperty(ReflectionCapabilities.prototype.factory, "parameters", {get: function() {
          return [[Type]];
        }});
      Object.defineProperty(ReflectionCapabilities.prototype.getter, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(ReflectionCapabilities.prototype.setter, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(ReflectionCapabilities.prototype.method, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
    }
  };
});

System.register("angular2/src/reflection/reflector", ["angular2/src/facade/lang", "angular2/src/facade/collection", "./types"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/reflection/reflector";
  var Type,
      isPresent,
      stringify,
      BaseException,
      List,
      ListWrapper,
      Map,
      MapWrapper,
      StringMapWrapper,
      SetterFn,
      GetterFn,
      MethodFn,
      Reflector;
  function _mergeMaps(target, config) {
    StringMapWrapper.forEach(config, (function(v, k) {
      return MapWrapper.set(target, k, v);
    }));
  }
  return {
    setters: [function($__m) {
      Type = $__m.Type;
      isPresent = $__m.isPresent;
      stringify = $__m.stringify;
      BaseException = $__m.BaseException;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
      Map = $__m.Map;
      MapWrapper = $__m.MapWrapper;
      StringMapWrapper = $__m.StringMapWrapper;
    }, function($__m) {
      SetterFn = $__m.SetterFn;
      GetterFn = $__m.GetterFn;
      MethodFn = $__m.MethodFn;
      $__export("SetterFn", $__m.SetterFn);
      $__export("GetterFn", $__m.GetterFn);
      $__export("MethodFn", $__m.MethodFn);
    }],
    execute: function() {
      Reflector = (function() {
        function Reflector(reflectionCapabilities) {
          this._typeInfo = MapWrapper.create();
          this._getters = MapWrapper.create();
          this._setters = MapWrapper.create();
          this._methods = MapWrapper.create();
          this.reflectionCapabilities = reflectionCapabilities;
        }
        return ($traceurRuntime.createClass)(Reflector, {
          registerType: function(type, typeInfo) {
            MapWrapper.set(this._typeInfo, type, typeInfo);
          },
          registerGetters: function(getters) {
            _mergeMaps(this._getters, getters);
          },
          registerSetters: function(setters) {
            _mergeMaps(this._setters, setters);
          },
          registerMethods: function(methods) {
            _mergeMaps(this._methods, methods);
          },
          factory: function(type) {
            if (MapWrapper.contains(this._typeInfo, type)) {
              return MapWrapper.get(this._typeInfo, type)["factory"];
            } else {
              return this.reflectionCapabilities.factory(type);
            }
          },
          parameters: function(typeOfFunc) {
            if (MapWrapper.contains(this._typeInfo, typeOfFunc)) {
              return MapWrapper.get(this._typeInfo, typeOfFunc)["parameters"];
            } else {
              return this.reflectionCapabilities.parameters(typeOfFunc);
            }
          },
          annotations: function(typeOfFunc) {
            if (MapWrapper.contains(this._typeInfo, typeOfFunc)) {
              return MapWrapper.get(this._typeInfo, typeOfFunc)["annotations"];
            } else {
              return this.reflectionCapabilities.annotations(typeOfFunc);
            }
          },
          getter: function(name) {
            if (MapWrapper.contains(this._getters, name)) {
              return MapWrapper.get(this._getters, name);
            } else {
              return this.reflectionCapabilities.getter(name);
            }
          },
          setter: function(name) {
            if (MapWrapper.contains(this._setters, name)) {
              return MapWrapper.get(this._setters, name);
            } else {
              return this.reflectionCapabilities.setter(name);
            }
          },
          method: function(name) {
            if (MapWrapper.contains(this._methods, name)) {
              return MapWrapper.get(this._methods, name);
            } else {
              return this.reflectionCapabilities.method(name);
            }
          }
        }, {});
      }());
      $__export("Reflector", Reflector);
      Object.defineProperty(Reflector.prototype.factory, "parameters", {get: function() {
          return [[Type]];
        }});
      Object.defineProperty(Reflector.prototype.getter, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(Reflector.prototype.setter, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(Reflector.prototype.method, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(_mergeMaps, "parameters", {get: function() {
          return [[Map], []];
        }});
    }
  };
});

System.register("angular2/src/reflection/types", [], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/reflection/types";
  var SetterFn,
      GetterFn,
      MethodFn;
  return {
    setters: [],
    execute: function() {
      SetterFn = Function;
      $__export("SetterFn", SetterFn);
      GetterFn = Function;
      $__export("GetterFn", GetterFn);
      MethodFn = Function;
      $__export("MethodFn", MethodFn);
    }
  };
});

System.register("angular2/src/render/api", ["angular2/src/facade/lang", "angular2/src/facade/async", "angular2/src/facade/collection", "angular2/change_detection"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/render/api";
  var isPresent,
      Promise,
      List,
      Map,
      ASTWithSource,
      EventBinding,
      ElementBinder,
      DirectiveBinder,
      ProtoViewDto,
      DirectiveMetadata,
      ProtoViewRef,
      ViewRef,
      ViewContainerRef,
      ViewDefinition,
      Renderer,
      EventDispatcher;
  return {
    setters: [function($__m) {
      isPresent = $__m.isPresent;
    }, function($__m) {
      Promise = $__m.Promise;
    }, function($__m) {
      List = $__m.List;
      Map = $__m.Map;
    }, function($__m) {
      ASTWithSource = $__m.ASTWithSource;
    }],
    execute: function() {
      EventBinding = (function() {
        function EventBinding(fullName, source) {
          this.fullName = fullName;
          this.source = source;
        }
        return ($traceurRuntime.createClass)(EventBinding, {}, {});
      }());
      $__export("EventBinding", EventBinding);
      Object.defineProperty(EventBinding, "parameters", {get: function() {
          return [[assert.type.string], [ASTWithSource]];
        }});
      ElementBinder = (function() {
        function ElementBinder($__1) {
          var $__2 = $__1,
              index = $__2.index,
              parentIndex = $__2.parentIndex,
              distanceToParent = $__2.distanceToParent,
              directives = $__2.directives,
              nestedProtoView = $__2.nestedProtoView,
              propertyBindings = $__2.propertyBindings,
              variableBindings = $__2.variableBindings,
              eventBindings = $__2.eventBindings,
              textBindings = $__2.textBindings,
              readAttributes = $__2.readAttributes;
          this.index = index;
          this.parentIndex = parentIndex;
          this.distanceToParent = distanceToParent;
          this.directives = directives;
          this.nestedProtoView = nestedProtoView;
          this.propertyBindings = propertyBindings;
          this.variableBindings = variableBindings;
          this.eventBindings = eventBindings;
          this.textBindings = textBindings;
          this.readAttributes = readAttributes;
        }
        return ($traceurRuntime.createClass)(ElementBinder, {}, {});
      }());
      $__export("ElementBinder", ElementBinder);
      DirectiveBinder = (function() {
        function DirectiveBinder($__1) {
          var $__2 = $__1,
              directiveIndex = $__2.directiveIndex,
              propertyBindings = $__2.propertyBindings,
              eventBindings = $__2.eventBindings;
          this.directiveIndex = directiveIndex;
          this.propertyBindings = propertyBindings;
          this.eventBindings = eventBindings;
        }
        return ($traceurRuntime.createClass)(DirectiveBinder, {}, {});
      }());
      $__export("DirectiveBinder", DirectiveBinder);
      ProtoViewDto = (function() {
        function ProtoViewDto() {
          var $__1 = arguments[0] !== (void 0) ? arguments[0] : {},
              render = $__1.render,
              elementBinders = $__1.elementBinders,
              variableBindings = $__1.variableBindings,
              type = $__1.type;
          this.render = render;
          this.elementBinders = elementBinders;
          this.variableBindings = variableBindings;
          this.type = type;
        }
        return ($traceurRuntime.createClass)(ProtoViewDto, {}, {
          get HOST_VIEW_TYPE() {
            return 0;
          },
          get COMPONENT_VIEW_TYPE() {
            return 1;
          },
          get EMBEDDED_VIEW_TYPE() {
            return 1;
          }
        });
      }());
      $__export("ProtoViewDto", ProtoViewDto);
      DirectiveMetadata = (function() {
        function DirectiveMetadata($__1) {
          var $__2 = $__1,
              id = $__2.id,
              selector = $__2.selector,
              compileChildren = $__2.compileChildren,
              hostListeners = $__2.hostListeners,
              properties = $__2.properties,
              setters = $__2.setters,
              readAttributes = $__2.readAttributes,
              type = $__2.type;
          this.id = id;
          this.selector = selector;
          this.compileChildren = isPresent(compileChildren) ? compileChildren : true;
          this.hostListeners = hostListeners;
          this.properties = properties;
          this.setters = setters;
          this.readAttributes = readAttributes;
          this.type = type;
        }
        return ($traceurRuntime.createClass)(DirectiveMetadata, {}, {
          get DECORATOR_TYPE() {
            return 0;
          },
          get COMPONENT_TYPE() {
            return 1;
          },
          get VIEWPORT_TYPE() {
            return 2;
          }
        });
      }());
      $__export("DirectiveMetadata", DirectiveMetadata);
      ProtoViewRef = (function() {
        function ProtoViewRef() {}
        return ($traceurRuntime.createClass)(ProtoViewRef, {}, {});
      }());
      $__export("ProtoViewRef", ProtoViewRef);
      ViewRef = (function() {
        function ViewRef() {}
        return ($traceurRuntime.createClass)(ViewRef, {}, {});
      }());
      $__export("ViewRef", ViewRef);
      ViewContainerRef = (function() {
        function ViewContainerRef(view, elementIndex) {
          this.view = view;
          this.elementIndex = elementIndex;
        }
        return ($traceurRuntime.createClass)(ViewContainerRef, {}, {});
      }());
      $__export("ViewContainerRef", ViewContainerRef);
      Object.defineProperty(ViewContainerRef, "parameters", {get: function() {
          return [[ViewRef], [assert.type.number]];
        }});
      ViewDefinition = (function() {
        function ViewDefinition($__1) {
          var $__2 = $__1,
              componentId = $__2.componentId,
              absUrl = $__2.absUrl,
              template = $__2.template,
              directives = $__2.directives;
          this.componentId = componentId;
          this.absUrl = absUrl;
          this.template = template;
          this.directives = directives;
        }
        return ($traceurRuntime.createClass)(ViewDefinition, {}, {});
      }());
      $__export("ViewDefinition", ViewDefinition);
      Renderer = (function() {
        function Renderer() {}
        return ($traceurRuntime.createClass)(Renderer, {
          createHostProtoView: function(componentId) {
            return null;
          },
          createImperativeComponentProtoView: function(rendererId) {
            return null;
          },
          compile: function(template) {
            return null;
          },
          mergeChildComponentProtoViews: function(protoViewRef, componentProtoViewRefs) {
            return null;
          },
          createViewInContainer: function(vcRef, atIndex, protoViewRef) {
            return null;
          },
          destroyViewInContainer: function(vcRef, atIndex) {},
          insertViewIntoContainer: function(vcRef, atIndex, view) {},
          detachViewFromContainer: function(vcRef, atIndex) {},
          createDynamicComponentView: function(hostViewRef, elementIndex, componentProtoViewRef) {
            return null;
          },
          destroyDynamicComponentView: function(hostViewRef, elementIndex) {},
          createInPlaceHostView: function(parentViewRef, hostElementSelector, hostProtoViewRef) {
            return null;
          },
          destroyInPlaceHostView: function(parentViewRef, hostViewRef) {},
          setElementProperty: function(view, elementIndex, propertyName, propertyValue) {},
          setText: function(view, textNodeIndex, text) {},
          setEventDispatcher: function(viewRef, dispatcher) {},
          flush: function() {}
        }, {});
      }());
      $__export("Renderer", Renderer);
      Object.defineProperty(Renderer.prototype.compile, "parameters", {get: function() {
          return [[ViewDefinition]];
        }});
      Object.defineProperty(Renderer.prototype.mergeChildComponentProtoViews, "parameters", {get: function() {
          return [[ProtoViewRef], [assert.genericType(List, ProtoViewRef)]];
        }});
      Object.defineProperty(Renderer.prototype.createViewInContainer, "parameters", {get: function() {
          return [[ViewContainerRef], [assert.type.number], [ProtoViewRef]];
        }});
      Object.defineProperty(Renderer.prototype.destroyViewInContainer, "parameters", {get: function() {
          return [[ViewContainerRef], [assert.type.number]];
        }});
      Object.defineProperty(Renderer.prototype.insertViewIntoContainer, "parameters", {get: function() {
          return [[ViewContainerRef], [assert.type.number], [ViewRef]];
        }});
      Object.defineProperty(Renderer.prototype.detachViewFromContainer, "parameters", {get: function() {
          return [[ViewContainerRef], [assert.type.number]];
        }});
      Object.defineProperty(Renderer.prototype.createDynamicComponentView, "parameters", {get: function() {
          return [[ViewRef], [assert.type.number], [ProtoViewRef]];
        }});
      Object.defineProperty(Renderer.prototype.destroyDynamicComponentView, "parameters", {get: function() {
          return [[ViewRef], [assert.type.number]];
        }});
      Object.defineProperty(Renderer.prototype.createInPlaceHostView, "parameters", {get: function() {
          return [[ViewRef], [], [ProtoViewRef]];
        }});
      Object.defineProperty(Renderer.prototype.destroyInPlaceHostView, "parameters", {get: function() {
          return [[ViewRef], [ViewRef]];
        }});
      Object.defineProperty(Renderer.prototype.setElementProperty, "parameters", {get: function() {
          return [[ViewRef], [assert.type.number], [assert.type.string], [assert.type.any]];
        }});
      Object.defineProperty(Renderer.prototype.setText, "parameters", {get: function() {
          return [[ViewRef], [assert.type.number], [assert.type.string]];
        }});
      Object.defineProperty(Renderer.prototype.setEventDispatcher, "parameters", {get: function() {
          return [[ViewRef], [assert.type.any]];
        }});
      EventDispatcher = (function() {
        function EventDispatcher() {}
        return ($traceurRuntime.createClass)(EventDispatcher, {dispatchEvent: function(elementIndex, eventName, locals) {}}, {});
      }());
      $__export("EventDispatcher", EventDispatcher);
      Object.defineProperty(EventDispatcher.prototype.dispatchEvent, "parameters", {get: function() {
          return [[assert.type.number], [assert.type.string], [assert.genericType(Map, assert.type.string, assert.type.any)]];
        }});
    }
  };
});

System.register("angular2/src/services/ruler", ["angular2/src/facade/async", "angular2/src/dom/dom_adapter", "angular2/src/core/compiler/ng_element"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/services/ruler";
  var Promise,
      PromiseWrapper,
      DomAdapter,
      NgElement,
      Rectangle,
      Ruler;
  return {
    setters: [function($__m) {
      Promise = $__m.Promise;
      PromiseWrapper = $__m.PromiseWrapper;
    }, function($__m) {
      DomAdapter = $__m.DomAdapter;
    }, function($__m) {
      NgElement = $__m.NgElement;
    }],
    execute: function() {
      Rectangle = (function() {
        function Rectangle(left, top, width, height) {
          this.left = left;
          this.right = left + width;
          this.top = top;
          this.bottom = top + height;
          this.height = height;
          this.width = width;
        }
        return ($traceurRuntime.createClass)(Rectangle, {}, {});
      }());
      $__export("Rectangle", Rectangle);
      Ruler = (function() {
        function Ruler(domAdapter) {
          this.domAdapter = domAdapter;
        }
        return ($traceurRuntime.createClass)(Ruler, {measure: function(el) {
            var clntRect = this.domAdapter.getBoundingClientRect(el.domElement);
            return PromiseWrapper.resolve(new Rectangle(clntRect.left, clntRect.top, clntRect.width, clntRect.height));
          }}, {});
      }());
      $__export("Ruler", Ruler);
      Object.defineProperty(Ruler, "parameters", {get: function() {
          return [[DomAdapter]];
        }});
      Object.defineProperty(Ruler.prototype.measure, "parameters", {get: function() {
          return [[NgElement]];
        }});
    }
  };
});

System.register("angular2/src/services/title", ["angular2/src/dom/dom_adapter"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/services/title";
  var DOM,
      Title;
  return {
    setters: [function($__m) {
      DOM = $__m.DOM;
    }],
    execute: function() {
      Title = (function() {
        function Title() {}
        return ($traceurRuntime.createClass)(Title, {
          getTitle: function() {
            return DOM.getTitle();
          },
          setTitle: function(newTitle) {
            DOM.setTitle(newTitle);
          }
        }, {});
      }());
      $__export("Title", Title);
      Object.defineProperty(Title.prototype.setTitle, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
    }
  };
});

System.register("angular2/src/services/url_resolver", ["angular2/di", "angular2/src/facade/lang", "angular2/src/dom/dom_adapter"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/services/url_resolver";
  var Injectable,
      isPresent,
      isBlank,
      RegExpWrapper,
      BaseException,
      DOM,
      UrlResolver,
      _schemeRe;
  return {
    setters: [function($__m) {
      Injectable = $__m.Injectable;
    }, function($__m) {
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
      RegExpWrapper = $__m.RegExpWrapper;
      BaseException = $__m.BaseException;
    }, function($__m) {
      DOM = $__m.DOM;
    }],
    execute: function() {
      UrlResolver = (function() {
        function UrlResolver() {
          if (isBlank(UrlResolver.a)) {
            UrlResolver.a = DOM.createElement('a');
          }
        }
        return ($traceurRuntime.createClass)(UrlResolver, {resolve: function(baseUrl, url) {
            if (isBlank(baseUrl)) {
              DOM.resolveAndSetHref(UrlResolver.a, url, null);
              return DOM.getHref(UrlResolver.a);
            }
            if (isBlank(url) || url == '')
              return baseUrl;
            if (url[0] == '/') {
              throw new BaseException(("Could not resolve the url " + url + " from " + baseUrl));
            }
            var m = RegExpWrapper.firstMatch(_schemeRe, url);
            if (isPresent(m[1])) {
              return url;
            }
            DOM.resolveAndSetHref(UrlResolver.a, baseUrl, url);
            return DOM.getHref(UrlResolver.a);
          }}, {});
      }());
      $__export("UrlResolver", UrlResolver);
      Object.defineProperty(UrlResolver, "annotations", {get: function() {
          return [new Injectable()];
        }});
      Object.defineProperty(UrlResolver.prototype.resolve, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
      _schemeRe = RegExpWrapper.create('^([^:/?#]+:)?');
    }
  };
});

System.register("angular2/src/services/xhr", ["angular2/src/facade/async"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/services/xhr";
  var Promise,
      XHR;
  return {
    setters: [function($__m) {
      Promise = $__m.Promise;
    }],
    execute: function() {
      XHR = (function() {
        function XHR() {}
        return ($traceurRuntime.createClass)(XHR, {get: function(url) {
            return null;
          }}, {});
      }());
      $__export("XHR", XHR);
      Object.defineProperty(XHR.prototype.get, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
    }
  };
});

System.register("angular2/src/services/xhr_impl", ["angular2/di", "angular2/src/facade/async", "./xhr"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/services/xhr_impl";
  var Injectable,
      Promise,
      PromiseWrapper,
      XHR,
      XHRImpl;
  return {
    setters: [function($__m) {
      Injectable = $__m.Injectable;
    }, function($__m) {
      Promise = $__m.Promise;
      PromiseWrapper = $__m.PromiseWrapper;
    }, function($__m) {
      XHR = $__m.XHR;
    }],
    execute: function() {
      XHRImpl = (function($__super) {
        function XHRImpl() {
          $traceurRuntime.superConstructor(XHRImpl).apply(this, arguments);
        }
        return ($traceurRuntime.createClass)(XHRImpl, {get: function(url) {
            var completer = PromiseWrapper.completer();
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'text';
            xhr.onload = function() {
              var status = xhr.status;
              if (200 <= status && status <= 300) {
                completer.resolve(xhr.responseText);
              } else {
                completer.reject(("Failed to load " + url));
              }
            };
            xhr.onerror = function() {
              completer.reject(("Failed to load " + url));
            };
            xhr.send();
            return completer.promise;
          }}, {}, $__super);
      }(XHR));
      $__export("XHRImpl", XHRImpl);
      Object.defineProperty(XHRImpl, "annotations", {get: function() {
          return [new Injectable()];
        }});
      Object.defineProperty(XHRImpl.prototype.get, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
    }
  };
});

System.register("angular2/src/test_lib/benchmark_util", ["angular2/src/dom/browser_adapter", "angular2/src/facade/browser", "angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/test_lib/benchmark_util";
  var BrowserDomAdapter,
      document,
      window,
      NumberWrapper,
      BaseException,
      isBlank,
      DOM;
  function getIntParameter(name) {
    return NumberWrapper.parseInt(getStringParameter(name), 10);
  }
  function getStringParameter(name) {
    var els = DOM.querySelectorAll(document, ("input[name=\"" + name + "\"]"));
    var value;
    var el;
    for (var i = 0; i < els.length; i++) {
      el = els[i];
      var type = DOM.type(el);
      if ((type != 'radio' && type != 'checkbox') || DOM.getChecked(el)) {
        value = DOM.getValue(el);
        break;
      }
    }
    if (isBlank(value)) {
      throw new BaseException(("Could not find and input field with name " + name));
    }
    return value;
  }
  function bindAction(selector, callback) {
    var el = DOM.querySelector(document, selector);
    DOM.on(el, 'click', function(_) {
      callback();
    });
  }
  function microBenchmark(name, iterationCount, callback) {
    var durationName = (name + "/" + iterationCount);
    window.console.time(durationName);
    callback();
    window.console.timeEnd(durationName);
  }
  $__export("getIntParameter", getIntParameter);
  $__export("getStringParameter", getStringParameter);
  $__export("bindAction", bindAction);
  $__export("microBenchmark", microBenchmark);
  return {
    setters: [function($__m) {
      BrowserDomAdapter = $__m.BrowserDomAdapter;
    }, function($__m) {
      document = $__m.document;
      window = $__m.window;
    }, function($__m) {
      NumberWrapper = $__m.NumberWrapper;
      BaseException = $__m.BaseException;
      isBlank = $__m.isBlank;
    }],
    execute: function() {
      DOM = new BrowserDomAdapter();
      Object.defineProperty(getIntParameter, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(getStringParameter, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(bindAction, "parameters", {get: function() {
          return [[assert.type.string], [Function]];
        }});
    }
  };
});

System.register("angular2/src/test_lib/e2e_util", [], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/test_lib/e2e_util";
  var webdriver;
  function clickAll(buttonSelectors) {
    buttonSelectors.forEach(function(selector) {
      $(selector).click();
    });
  }
  function verifyNoBrowserErrors() {
    browser.executeScript('1+1');
    browser.manage().logs().get('browser').then(function(browserLog) {
      var filteredLog = browserLog.filter(function(logEntry) {
        if (logEntry.level.value >= webdriver.logging.Level.INFO.value) {
          console.log('>> ' + logEntry.message);
        }
        return logEntry.level.value > webdriver.logging.Level.WARNING.value;
      });
      expect(filteredLog.length).toEqual(0);
    });
  }
  return {
    setters: [],
    execute: function() {
      webdriver = require('selenium-webdriver');
      module.exports = {
        verifyNoBrowserErrors: verifyNoBrowserErrors,
        clickAll: clickAll
      };
    }
  };
});

System.register("angular2/src/test_lib/lang_utils", [], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/test_lib/lang_utils";
  function getTypeOf(instance) {
    return instance.constructor;
  }
  function instantiateType(type) {
    var params = arguments[1] !== (void 0) ? arguments[1] : [];
    var instance = Object.create(type.prototype);
    instance.constructor.apply(instance, params);
    return instance;
  }
  $__export("getTypeOf", getTypeOf);
  $__export("instantiateType", instantiateType);
  return {
    setters: [],
    execute: function() {
      Object.defineProperty(instantiateType, "parameters", {get: function() {
          return [[Function], [Array]];
        }});
    }
  };
});

System.register("angular2/src/test_lib/perf_util", [], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/test_lib/perf_util";
  var testUtil,
      benchpress;
  function runClickBenchmark(config) {
    var buttons = config.buttons.map(function(selector) {
      return $(selector);
    });
    config.work = function() {
      buttons.forEach(function(button) {
        button.click();
      });
    };
    return runBenchmark(config);
  }
  function runBenchmark(config) {
    return getScaleFactor(browser.params.benchmark.scaling).then(function(scaleFactor) {
      var description = {};
      var urlParams = [];
      if (config.params) {
        config.params.forEach(function(param) {
          var name = param.name;
          var value = applyScaleFactor(param.value, scaleFactor, param.scale);
          urlParams.push(name + '=' + value);
          description[name] = value;
        });
      }
      var url = encodeURI(config.url + '?' + urlParams.join('&'));
      return browser.get(url).then(function() {
        benchpressRunner.sample({
          id: config.id,
          execute: config.work,
          prepare: config.prepare,
          microMetrics: config.microMetrics,
          bindings: [benchpress.bind(benchpress.Options.SAMPLE_DESCRIPTION).toValue(description)]
        });
      });
    });
  }
  function getScaleFactor(possibleScalings) {
    return browser.executeScript('return navigator.userAgent').then(function(userAgent) {
      var scaleFactor = 1;
      possibleScalings.forEach(function(entry) {
        if (userAgent.match(entry.userAgent)) {
          scaleFactor = entry.value;
        }
      });
      return scaleFactor;
    });
  }
  function applyScaleFactor(value, scaleFactor, method) {
    if (method === 'log2') {
      return value + Math.log2(scaleFactor);
    } else if (method === 'sqrt') {
      return value * Math.sqrt(scaleFactor);
    } else if (method === 'linear') {
      return value * scaleFactor;
    } else {
      return value;
    }
  }
  return {
    setters: [],
    execute: function() {
      testUtil = require('./e2e_util');
      benchpress = require('benchpress/benchpress');
      module.exports = {
        runClickBenchmark: runClickBenchmark,
        runBenchmark: runBenchmark,
        verifyNoBrowserErrors: testUtil.verifyNoBrowserErrors
      };
    }
  };
});

System.register("angular2/src/test_lib/test_bed", ["angular2/di", "angular2/src/facade/lang", "angular2/src/facade/async", "angular2/src/facade/collection", "angular2/src/core/annotations/view", "angular2/src/core/compiler/template_resolver", "angular2/src/core/compiler/compiler", "angular2/src/core/compiler/view", "angular2/src/core/compiler/view_factory", "angular2/src/core/compiler/view_hydrator", "angular2/src/core/compiler/element_injector", "angular2/src/core/compiler/directive_metadata_reader", "./utils", "./lang_utils"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/test_lib/test_bed";
  var Injector,
      bind,
      Type,
      isPresent,
      BaseException,
      Promise,
      isBlank,
      List,
      View,
      TemplateResolver,
      Compiler,
      AppView,
      ViewFactory,
      AppViewHydrator,
      DirectiveBinding,
      DirectiveMetadataReader,
      queryView,
      viewRootNodes,
      el,
      instantiateType,
      getTypeOf,
      TestBed,
      ViewProxy;
  return {
    setters: [function($__m) {
      Injector = $__m.Injector;
      bind = $__m.bind;
    }, function($__m) {
      Type = $__m.Type;
      isPresent = $__m.isPresent;
      BaseException = $__m.BaseException;
      isBlank = $__m.isBlank;
    }, function($__m) {
      Promise = $__m.Promise;
    }, function($__m) {
      List = $__m.List;
    }, function($__m) {
      View = $__m.View;
    }, function($__m) {
      TemplateResolver = $__m.TemplateResolver;
    }, function($__m) {
      Compiler = $__m.Compiler;
    }, function($__m) {
      AppView = $__m.AppView;
    }, function($__m) {
      ViewFactory = $__m.ViewFactory;
    }, function($__m) {
      AppViewHydrator = $__m.AppViewHydrator;
    }, function($__m) {
      DirectiveBinding = $__m.DirectiveBinding;
    }, function($__m) {
      DirectiveMetadataReader = $__m.DirectiveMetadataReader;
    }, function($__m) {
      queryView = $__m.queryView;
      viewRootNodes = $__m.viewRootNodes;
      el = $__m.el;
    }, function($__m) {
      instantiateType = $__m.instantiateType;
      getTypeOf = $__m.getTypeOf;
    }],
    execute: function() {
      TestBed = (function() {
        function TestBed(injector) {
          this._injector = injector;
        }
        return ($traceurRuntime.createClass)(TestBed, {
          overrideView: function(component, template) {
            this._injector.get(TemplateResolver).setView(component, template);
          },
          setInlineTemplate: function(component, html) {
            this._injector.get(TemplateResolver).setInlineTemplate(component, html);
          },
          overrideDirective: function(component, from, to) {
            this._injector.get(TemplateResolver).overrideTemplateDirective(component, from, to);
          },
          createView: function(component) {
            var $__3,
                $__4;
            var $__2 = arguments[1] !== (void 0) ? arguments[1] : {},
                context = ($__3 = $__2.context) === void 0 ? null : $__3,
                html = ($__4 = $__2.html) === void 0 ? null : $__4;
            var $__0 = this;
            if (isBlank(component) && isBlank(context)) {
              throw new BaseException('You must specified at least a component or a context');
            }
            if (isBlank(component)) {
              component = getTypeOf(context);
            } else if (isBlank(context)) {
              context = instantiateType(component);
            }
            if (isPresent(html)) {
              this.setInlineTemplate(component, html);
            }
            var rootEl = el('<div></div>');
            var metadataReader = this._injector.get(DirectiveMetadataReader);
            var componentBinding = DirectiveBinding.createFromBinding(bind(component).toValue(context), metadataReader.read(component).annotation);
            return this._injector.get(Compiler).compileInHost(componentBinding).then((function(pv) {
              var viewFactory = $__0._injector.get(ViewFactory);
              var viewHydrator = $__0._injector.get(AppViewHydrator);
              var hostView = viewFactory.getView(pv);
              viewHydrator.hydrateInPlaceHostView(null, rootEl, hostView, $__0._injector);
              return new ViewProxy($__0._injector, hostView.componentChildViews[0]);
            }));
          }
        }, {});
      }());
      $__export("TestBed", TestBed);
      Object.defineProperty(TestBed, "parameters", {get: function() {
          return [[Injector]];
        }});
      Object.defineProperty(TestBed.prototype.overrideView, "parameters", {get: function() {
          return [[Type], [View]];
        }});
      Object.defineProperty(TestBed.prototype.setInlineTemplate, "parameters", {get: function() {
          return [[Type], [assert.type.string]];
        }});
      Object.defineProperty(TestBed.prototype.overrideDirective, "parameters", {get: function() {
          return [[Type], [Type], [Type]];
        }});
      Object.defineProperty(TestBed.prototype.createView, "parameters", {get: function() {
          return [[Type], []];
        }});
      ViewProxy = (function() {
        function ViewProxy(injector, view) {
          this._view = view;
          this._injector = injector;
        }
        return ($traceurRuntime.createClass)(ViewProxy, {
          get context() {
            return this._view.context;
          },
          get rootNodes() {
            return viewRootNodes(this._view);
          },
          detectChanges: function() {
            this._view.changeDetector.detectChanges();
          },
          querySelector: function(selector) {
            return queryView(this._view, selector);
          },
          destroy: function() {
            var viewHydrator = this._injector.get(AppViewHydrator);
            viewHydrator.dehydrateInPlaceHostView(null, this._view);
          },
          get rawView() {
            return this._view;
          }
        }, {});
      }());
      $__export("ViewProxy", ViewProxy);
      Object.defineProperty(ViewProxy, "parameters", {get: function() {
          return [[Injector], [AppView]];
        }});
    }
  };
});

System.register("angular2/src/test_lib/test_injector", ["angular2/di", "angular2/src/core/compiler/compiler", "angular2/src/reflection/reflection", "angular2/change_detection", "angular2/src/core/exception_handler", "angular2/src/render/dom/compiler/template_loader", "angular2/src/core/compiler/template_resolver", "angular2/src/core/compiler/directive_metadata_reader", "angular2/src/core/compiler/dynamic_component_loader", "angular2/src/render/dom/shadow_dom/shadow_dom_strategy", "angular2/src/render/dom/shadow_dom/emulated_unscoped_shadow_dom_strategy", "angular2/src/services/xhr", "angular2/src/core/compiler/component_url_mapper", "angular2/src/services/url_resolver", "angular2/src/render/dom/shadow_dom/style_url_resolver", "angular2/src/render/dom/shadow_dom/style_inliner", "angular2/src/core/zone/vm_turn_zone", "angular2/src/dom/dom_adapter", "angular2/src/core/application_tokens", "angular2/src/render/dom/events/event_manager", "angular2/src/mock/template_resolver_mock", "angular2/src/mock/xhr_mock", "angular2/src/mock/vm_turn_zone_mock", "./test_bed", "angular2/src/facade/collection", "angular2/src/facade/lang", "angular2/src/core/compiler/view_factory", "angular2/src/core/compiler/view_hydrator", "angular2/src/core/compiler/proto_view_factory", "angular2/src/render/api", "angular2/src/render/dom/direct_dom_renderer", "angular2/src/render/dom/compiler/compiler", "angular2/src/render/dom/view/view_factory", "angular2/src/render/dom/view/view_hydrator"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/test_lib/test_injector";
  var bind,
      Compiler,
      CompilerCache,
      Reflector,
      reflector,
      Parser,
      Lexer,
      ChangeDetection,
      DynamicChangeDetection,
      PipeRegistry,
      defaultPipeRegistry,
      ExceptionHandler,
      TemplateLoader,
      TemplateResolver,
      DirectiveMetadataReader,
      DynamicComponentLoader,
      ShadowDomStrategy,
      EmulatedUnscopedShadowDomStrategy,
      XHR,
      ComponentUrlMapper,
      UrlResolver,
      StyleUrlResolver,
      StyleInliner,
      VmTurnZone,
      DOM,
      appDocumentToken,
      EventManager,
      DomEventsPlugin,
      MockTemplateResolver,
      MockXHR,
      MockVmTurnZone,
      TestBed,
      Injector,
      List,
      ListWrapper,
      FunctionWrapper,
      ViewFactory,
      VIEW_POOL_CAPACITY,
      AppViewHydrator,
      ProtoViewFactory,
      Renderer,
      DirectDomRenderer,
      rc,
      rvf,
      rvh,
      FunctionWithParamTokens;
  function _getRootBindings() {
    return [bind(Reflector).toValue(reflector)];
  }
  function _getAppBindings() {
    var appDoc;
    try {
      appDoc = DOM.defaultDoc();
    } catch (e) {
      appDoc = null;
    }
    return [bind(appDocumentToken).toValue(appDoc), bind(ShadowDomStrategy).toFactory((function(styleUrlResolver, doc) {
      return new EmulatedUnscopedShadowDomStrategy(styleUrlResolver, doc.head);
    }), [StyleUrlResolver, appDocumentToken]), bind(DirectDomRenderer).toClass(DirectDomRenderer), bind(Renderer).toClass(DirectDomRenderer), bind(rc.Compiler).toClass(rc.DefaultCompiler), rvf.ViewFactory, rvh.RenderViewHydrator, bind(rvf.VIEW_POOL_CAPACITY).toValue(500), ProtoViewFactory, ViewFactory, AppViewHydrator, bind(VIEW_POOL_CAPACITY).toValue(500), Compiler, CompilerCache, bind(TemplateResolver).toClass(MockTemplateResolver), bind(PipeRegistry).toValue(defaultPipeRegistry), bind(ChangeDetection).toClass(DynamicChangeDetection), TemplateLoader, DynamicComponentLoader, DirectiveMetadataReader, Parser, Lexer, ExceptionHandler, bind(XHR).toClass(MockXHR), ComponentUrlMapper, UrlResolver, StyleUrlResolver, StyleInliner, TestBed, bind(VmTurnZone).toClass(MockVmTurnZone), bind(EventManager).toFactory((function(zone) {
      var plugins = [new DomEventsPlugin()];
      return new EventManager(plugins, zone);
    }), [VmTurnZone])];
  }
  function createTestInjector(bindings) {
    var rootInjector = Injector.resolveAndCreate(_getRootBindings());
    return rootInjector.resolveAndCreateChild(ListWrapper.concat(_getAppBindings(), bindings));
  }
  function inject(tokens, fn) {
    return new FunctionWithParamTokens(tokens, fn);
  }
  $__export("createTestInjector", createTestInjector);
  $__export("inject", inject);
  return {
    setters: [function($__m) {
      bind = $__m.bind;
      Injector = $__m.Injector;
    }, function($__m) {
      Compiler = $__m.Compiler;
      CompilerCache = $__m.CompilerCache;
    }, function($__m) {
      Reflector = $__m.Reflector;
      reflector = $__m.reflector;
    }, function($__m) {
      Parser = $__m.Parser;
      Lexer = $__m.Lexer;
      ChangeDetection = $__m.ChangeDetection;
      DynamicChangeDetection = $__m.DynamicChangeDetection;
      PipeRegistry = $__m.PipeRegistry;
      defaultPipeRegistry = $__m.defaultPipeRegistry;
    }, function($__m) {
      ExceptionHandler = $__m.ExceptionHandler;
    }, function($__m) {
      TemplateLoader = $__m.TemplateLoader;
    }, function($__m) {
      TemplateResolver = $__m.TemplateResolver;
    }, function($__m) {
      DirectiveMetadataReader = $__m.DirectiveMetadataReader;
    }, function($__m) {
      DynamicComponentLoader = $__m.DynamicComponentLoader;
    }, function($__m) {
      ShadowDomStrategy = $__m.ShadowDomStrategy;
    }, function($__m) {
      EmulatedUnscopedShadowDomStrategy = $__m.EmulatedUnscopedShadowDomStrategy;
    }, function($__m) {
      XHR = $__m.XHR;
    }, function($__m) {
      ComponentUrlMapper = $__m.ComponentUrlMapper;
    }, function($__m) {
      UrlResolver = $__m.UrlResolver;
    }, function($__m) {
      StyleUrlResolver = $__m.StyleUrlResolver;
    }, function($__m) {
      StyleInliner = $__m.StyleInliner;
    }, function($__m) {
      VmTurnZone = $__m.VmTurnZone;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      appDocumentToken = $__m.appDocumentToken;
    }, function($__m) {
      EventManager = $__m.EventManager;
      DomEventsPlugin = $__m.DomEventsPlugin;
    }, function($__m) {
      MockTemplateResolver = $__m.MockTemplateResolver;
    }, function($__m) {
      MockXHR = $__m.MockXHR;
    }, function($__m) {
      MockVmTurnZone = $__m.MockVmTurnZone;
    }, function($__m) {
      TestBed = $__m.TestBed;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      FunctionWrapper = $__m.FunctionWrapper;
    }, function($__m) {
      ViewFactory = $__m.ViewFactory;
      VIEW_POOL_CAPACITY = $__m.VIEW_POOL_CAPACITY;
    }, function($__m) {
      AppViewHydrator = $__m.AppViewHydrator;
    }, function($__m) {
      ProtoViewFactory = $__m.ProtoViewFactory;
    }, function($__m) {
      Renderer = $__m.Renderer;
    }, function($__m) {
      DirectDomRenderer = $__m.DirectDomRenderer;
    }, function($__m) {
      rc = $__m;
    }, function($__m) {
      rvf = $__m;
    }, function($__m) {
      rvh = $__m;
    }],
    execute: function() {
      Object.defineProperty(createTestInjector, "parameters", {get: function() {
          return [[List]];
        }});
      Object.defineProperty(inject, "parameters", {get: function() {
          return [[List], [Function]];
        }});
      FunctionWithParamTokens = (function() {
        function FunctionWithParamTokens(tokens, fn) {
          this._tokens = tokens;
          this._fn = fn;
        }
        return ($traceurRuntime.createClass)(FunctionWithParamTokens, {execute: function(injector) {
            var params = ListWrapper.map(this._tokens, (function(t) {
              return injector.get(t);
            }));
            FunctionWrapper.apply(this._fn, params);
          }}, {});
      }());
      $__export("FunctionWithParamTokens", FunctionWithParamTokens);
      Object.defineProperty(FunctionWithParamTokens, "parameters", {get: function() {
          return [[List], [Function]];
        }});
      Object.defineProperty(FunctionWithParamTokens.prototype.execute, "parameters", {get: function() {
          return [[Injector]];
        }});
    }
  };
});

System.register("angular2/src/test_lib/test_lib", ["angular2/src/dom/dom_adapter", "angular2/src/facade/collection", "angular2/di", "./test_injector", "rtts_assert/rtts_assert"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/test_lib/test_lib";
  var DOM,
      StringMapWrapper,
      bind,
      createTestInjector,
      FunctionWithParamTokens,
      inject,
      _global,
      afterEach,
      expect,
      IS_DARTIUM,
      AsyncTestCompleter,
      jsmBeforeEach,
      jsmDescribe,
      jsmDDescribe,
      jsmXDescribe,
      jsmIt,
      jsmIIt,
      jsmXIt,
      runnerStack,
      inIt,
      testBindings,
      BeforeEachRunner,
      SpyObject;
  function _describe(jsmFn) {
    for (var args = [],
        $__1 = 1; $__1 < arguments.length; $__1++)
      args[$__1 - 1] = arguments[$__1];
    var parentRunner = runnerStack.length === 0 ? null : runnerStack[runnerStack.length - 1];
    var runner = new BeforeEachRunner(parentRunner);
    runnerStack.push(runner);
    var suite = jsmFn.apply((void 0), $traceurRuntime.spread(args));
    runnerStack.pop();
    return suite;
  }
  function describe() {
    for (var args = [],
        $__2 = 0; $__2 < arguments.length; $__2++)
      args[$__2] = arguments[$__2];
    return _describe.apply((void 0), $traceurRuntime.spread([jsmDescribe], args));
  }
  function ddescribe() {
    for (var args = [],
        $__3 = 0; $__3 < arguments.length; $__3++)
      args[$__3] = arguments[$__3];
    return _describe.apply((void 0), $traceurRuntime.spread([jsmDDescribe], args));
  }
  function xdescribe() {
    for (var args = [],
        $__4 = 0; $__4 < arguments.length; $__4++)
      args[$__4] = arguments[$__4];
    return _describe.apply((void 0), $traceurRuntime.spread([jsmXDescribe], args));
  }
  function beforeEach(fn) {
    if (runnerStack.length > 0) {
      var runner = runnerStack[runnerStack.length - 1];
      if (!(fn instanceof FunctionWithParamTokens)) {
        fn = inject([], fn);
      }
      runner.beforeEach(fn);
    } else {
      jsmBeforeEach(fn);
    }
  }
  function beforeEachBindings(fn) {
    jsmBeforeEach((function() {
      var bindings = fn();
      if (!bindings)
        return ;
      testBindings = $traceurRuntime.spread(testBindings, bindings);
    }));
  }
  function _it(jsmFn, name, fn) {
    var runner = runnerStack[runnerStack.length - 1];
    jsmFn(name, function(done) {
      var async = false;
      var completerBinding = bind(AsyncTestCompleter).toFactory((function() {
        if (!inIt)
          throw new Error('AsyncTestCompleter can only be injected in an "it()"');
        async = true;
        return new AsyncTestCompleter(done);
      }));
      var injector = createTestInjector($traceurRuntime.spread(testBindings, [completerBinding]));
      runner.run(injector);
      if (!(fn instanceof FunctionWithParamTokens)) {
        fn = inject([], fn);
      }
      inIt = true;
      fn.execute(injector);
      inIt = false;
      if (!async)
        done();
    });
  }
  function it(name, fn) {
    return _it(jsmIt, name, fn);
  }
  function xit(name, fn) {
    return _it(jsmXIt, name, fn);
  }
  function iit(name, fn) {
    return _it(jsmIIt, name, fn);
  }
  function elementText(n) {
    var hasNodes = (function(n) {
      var children = DOM.childNodes(n);
      return children && children.length > 0;
    });
    if (n instanceof Array) {
      return n.map((function(nn) {
        return elementText(nn);
      })).join("");
    }
    if (DOM.isCommentNode(n)) {
      return '';
    }
    if (DOM.isElementNode(n) && DOM.tagName(n) == 'CONTENT') {
      return elementText(Array.prototype.slice.apply(DOM.getDistributedNodes(n)));
    }
    if (DOM.hasShadowRoot(n)) {
      return elementText(DOM.childNodesAsList(DOM.getShadowRoot(n)));
    }
    if (hasNodes(n)) {
      return elementText(DOM.childNodesAsList(n));
    }
    return DOM.getText(n);
  }
  $__export("describe", describe);
  $__export("ddescribe", ddescribe);
  $__export("xdescribe", xdescribe);
  $__export("beforeEach", beforeEach);
  $__export("beforeEachBindings", beforeEachBindings);
  $__export("it", it);
  $__export("xit", xit);
  $__export("iit", iit);
  return {
    setters: [function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      StringMapWrapper = $__m.StringMapWrapper;
    }, function($__m) {
      bind = $__m.bind;
    }, function($__m) {
      createTestInjector = $__m.createTestInjector;
      FunctionWithParamTokens = $__m.FunctionWithParamTokens;
      inject = $__m.inject;
      $__export("inject", $__m.inject);
    }, function($__m) {
      $__export("proxy", $__m.proxy);
    }],
    execute: function() {
      _global = typeof window === 'undefined' ? global : window;
      afterEach = _global.afterEach;
      $__export("afterEach", afterEach);
      expect = _global.expect;
      $__export("expect", expect);
      IS_DARTIUM = false;
      $__export("IS_DARTIUM", IS_DARTIUM);
      AsyncTestCompleter = (function() {
        function AsyncTestCompleter(done) {
          this._done = done;
        }
        return ($traceurRuntime.createClass)(AsyncTestCompleter, {done: function() {
            this._done();
          }}, {});
      }());
      $__export("AsyncTestCompleter", AsyncTestCompleter);
      Object.defineProperty(AsyncTestCompleter, "parameters", {get: function() {
          return [[Function]];
        }});
      jsmBeforeEach = _global.beforeEach;
      jsmDescribe = _global.describe;
      jsmDDescribe = _global.ddescribe;
      jsmXDescribe = _global.xdescribe;
      jsmIt = _global.it;
      jsmIIt = _global.iit;
      jsmXIt = _global.xit;
      runnerStack = [];
      inIt = false;
      BeforeEachRunner = (function() {
        function BeforeEachRunner(parent) {
          this._fns = [];
          this._parent = parent;
        }
        return ($traceurRuntime.createClass)(BeforeEachRunner, {
          beforeEach: function(fn) {
            this._fns.push(fn);
          },
          run: function(injector) {
            if (this._parent)
              this._parent.run();
            this._fns.forEach((function(fn) {
              return fn.execute(injector);
            }));
          }
        }, {});
      }());
      Object.defineProperty(BeforeEachRunner, "parameters", {get: function() {
          return [[BeforeEachRunner]];
        }});
      Object.defineProperty(BeforeEachRunner.prototype.beforeEach, "parameters", {get: function() {
          return [[FunctionWithParamTokens]];
        }});
      jsmBeforeEach((function() {
        testBindings = [];
      }));
      _global.print = function(msg) {
        if (_global.dump) {
          _global.dump(msg);
        } else {
          _global.console.log(msg);
        }
      };
      _global.Map.prototype.jasmineToString = function() {
        var m = this;
        if (!m) {
          return '' + m;
        }
        var res = [];
        m.forEach((function(v, k) {
          res.push((k + ":" + v));
        }));
        return ("{ " + res.join(',') + " }");
      };
      _global.beforeEach(function() {
        jasmine.addMatchers({
          toEqual: function(util, customEqualityTesters) {
            return {compare: function(actual, expected) {
                return {pass: util.equals(actual, expected, [compareMap])};
              }};
            function compareMap(actual, expected) {
              if (actual instanceof Map) {
                var pass = actual.size === expected.size;
                if (pass) {
                  actual.forEach((function(v, k) {
                    pass = pass && util.equals(v, expected.get(k));
                  }));
                }
                return pass;
              } else {
                return undefined;
              }
            }
          },
          toBePromise: function() {
            return {compare: function(actual, expectedClass) {
                var pass = typeof actual === 'object' && typeof actual.then === 'function';
                return {
                  pass: pass,
                  get message() {
                    return 'Expected ' + actual + ' to be a promise';
                  }
                };
              }};
          },
          toBeAnInstanceOf: function() {
            return {compare: function(actual, expectedClass) {
                var pass = typeof actual === 'object' && actual instanceof expectedClass;
                return {
                  pass: pass,
                  get message() {
                    return 'Expected ' + actual + ' to be an instance of ' + expectedClass;
                  }
                };
              }};
          },
          toHaveText: function() {
            return {compare: function(actual, expectedText) {
                var actualText = elementText(actual);
                return {
                  pass: actualText == expectedText,
                  get message() {
                    return 'Expected ' + actualText + ' to be equal to ' + expectedText;
                  }
                };
              }};
          },
          toImplement: function() {
            return {compare: function(actualObject, expectedInterface) {
                var objProps = Object.keys(actualObject.constructor.prototype);
                var intProps = Object.keys(expectedInterface.prototype);
                var missedMethods = [];
                intProps.forEach((function(k) {
                  if (!actualObject.constructor.prototype[k])
                    missedMethods.push(k);
                }));
                return {
                  pass: missedMethods.length == 0,
                  get message() {
                    return 'Expected ' + actualObject + ' to have the following methods: ' + missedMethods.join(", ");
                  }
                };
              }};
          }
        });
      });
      SpyObject = (function() {
        function SpyObject() {
          var type = arguments[0] !== (void 0) ? arguments[0] : null;
          if (type) {
            for (var prop in type.prototype) {
              var m = type.prototype[prop];
              if (typeof m === 'function') {
                this.spy(prop);
              }
            }
          }
        }
        return ($traceurRuntime.createClass)(SpyObject, {
          spy: function(name) {
            if (!this[name]) {
              this[name] = this._createGuinnessCompatibleSpy();
            }
            return this[name];
          },
          rttsAssert: function(value) {
            return true;
          },
          _createGuinnessCompatibleSpy: function() {
            var newSpy = jasmine.createSpy();
            newSpy.andCallFake = newSpy.and.callFake;
            newSpy.andReturn = newSpy.and.returnValue;
            newSpy.and.returnValue(null);
            return newSpy;
          }
        }, {stub: function() {
            var object = arguments[0] !== (void 0) ? arguments[0] : null;
            var config = arguments[1] !== (void 0) ? arguments[1] : null;
            var overrides = arguments[2] !== (void 0) ? arguments[2] : null;
            if (!(object instanceof SpyObject)) {
              overrides = config;
              config = object;
              object = new SpyObject();
            }
            var m = StringMapWrapper.merge(config, overrides);
            StringMapWrapper.forEach(m, (function(value, key) {
              object.spy(key).andReturn(value);
            }));
            return object;
          }});
      }());
      $__export("SpyObject", SpyObject);
    }
  };
});

System.register("angular2/src/test_lib/utils", ["angular2/src/facade/collection", "angular2/src/dom/dom_adapter", "angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/test_lib/utils";
  var List,
      ListWrapper,
      DOM,
      isPresent,
      Log;
  function viewRootNodes(view) {
    return view.render.delegate.rootNodes;
  }
  function queryView(view, selector) {
    var rootNodes = viewRootNodes(view);
    for (var i = 0; i < rootNodes.length; ++i) {
      var res = DOM.querySelector(rootNodes[i], selector);
      if (isPresent(res)) {
        return res;
      }
    }
    return null;
  }
  function dispatchEvent(element, eventType) {
    DOM.dispatchEvent(element, DOM.createEvent(eventType));
  }
  function el(html) {
    return DOM.firstChild(DOM.content(DOM.createTemplate(html)));
  }
  $__export("viewRootNodes", viewRootNodes);
  $__export("queryView", queryView);
  $__export("dispatchEvent", dispatchEvent);
  $__export("el", el);
  return {
    setters: [function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      isPresent = $__m.isPresent;
    }],
    execute: function() {
      Log = (function() {
        function Log() {
          this._result = [];
        }
        return ($traceurRuntime.createClass)(Log, {
          add: function(value) {
            ListWrapper.push(this._result, value);
          },
          fn: function(value) {
            var $__0 = this;
            return (function() {
              ListWrapper.push($__0._result, value);
            });
          },
          result: function() {
            return ListWrapper.join(this._result, "; ");
          }
        }, {});
      }());
      $__export("Log", Log);
    }
  };
});

System.register("angular2/src/change_detection/parser/ast", ["angular2/src/facade/lang", "angular2/src/facade/collection"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/change_detection/parser/ast";
  var autoConvertAdd,
      isBlank,
      isPresent,
      FunctionWrapper,
      BaseException,
      List,
      Map,
      ListWrapper,
      StringMapWrapper,
      AST,
      EmptyExpr,
      ImplicitReceiver,
      Chain,
      Conditional,
      AccessMember,
      KeyedAccess,
      Pipe,
      LiteralPrimitive,
      LiteralArray,
      LiteralMap,
      Interpolation,
      Binary,
      PrefixNot,
      Assignment,
      MethodCall,
      FunctionCall,
      ASTWithSource,
      TemplateBinding,
      AstVisitor,
      AstTransformer,
      _evalListCache;
  function evalList(context, locals, exps) {
    var length = exps.length;
    if (length > 10) {
      throw new BaseException("Cannot have more than 10 argument");
    }
    var result = _evalListCache[length];
    for (var i = 0; i < length; i++) {
      result[i] = exps[i].eval(context, locals);
    }
    return result;
  }
  return {
    setters: [function($__m) {
      autoConvertAdd = $__m.autoConvertAdd;
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
      FunctionWrapper = $__m.FunctionWrapper;
      BaseException = $__m.BaseException;
    }, function($__m) {
      List = $__m.List;
      Map = $__m.Map;
      ListWrapper = $__m.ListWrapper;
      StringMapWrapper = $__m.StringMapWrapper;
    }],
    execute: function() {
      AST = (function() {
        function AST() {}
        return ($traceurRuntime.createClass)(AST, {
          eval: function(context, locals) {
            throw new BaseException("Not supported");
          },
          get isAssignable() {
            return false;
          },
          assign: function(context, locals, value) {
            throw new BaseException("Not supported");
          },
          visit: function(visitor) {},
          toString: function() {
            return "AST";
          }
        }, {});
      }());
      $__export("AST", AST);
      EmptyExpr = (function($__super) {
        function EmptyExpr() {
          $traceurRuntime.superConstructor(EmptyExpr).apply(this, arguments);
        }
        return ($traceurRuntime.createClass)(EmptyExpr, {
          eval: function(context, locals) {
            return null;
          },
          visit: function(visitor) {}
        }, {}, $__super);
      }(AST));
      $__export("EmptyExpr", EmptyExpr);
      ImplicitReceiver = (function($__super) {
        function ImplicitReceiver() {
          $traceurRuntime.superConstructor(ImplicitReceiver).apply(this, arguments);
        }
        return ($traceurRuntime.createClass)(ImplicitReceiver, {
          eval: function(context, locals) {
            return context;
          },
          visit: function(visitor) {
            return visitor.visitImplicitReceiver(this);
          }
        }, {}, $__super);
      }(AST));
      $__export("ImplicitReceiver", ImplicitReceiver);
      Chain = (function($__super) {
        function Chain(expressions) {
          $traceurRuntime.superConstructor(Chain).call(this);
          this.expressions = expressions;
        }
        return ($traceurRuntime.createClass)(Chain, {
          eval: function(context, locals) {
            var result;
            for (var i = 0; i < this.expressions.length; i++) {
              var last = this.expressions[i].eval(context, locals);
              if (isPresent(last))
                result = last;
            }
            return result;
          },
          visit: function(visitor) {
            return visitor.visitChain(this);
          }
        }, {}, $__super);
      }(AST));
      $__export("Chain", Chain);
      Object.defineProperty(Chain, "parameters", {get: function() {
          return [[List]];
        }});
      Conditional = (function($__super) {
        function Conditional(condition, trueExp, falseExp) {
          $traceurRuntime.superConstructor(Conditional).call(this);
          this.condition = condition;
          this.trueExp = trueExp;
          this.falseExp = falseExp;
        }
        return ($traceurRuntime.createClass)(Conditional, {
          eval: function(context, locals) {
            if (this.condition.eval(context, locals)) {
              return this.trueExp.eval(context, locals);
            } else {
              return this.falseExp.eval(context, locals);
            }
          },
          visit: function(visitor) {
            return visitor.visitConditional(this);
          }
        }, {}, $__super);
      }(AST));
      $__export("Conditional", Conditional);
      Object.defineProperty(Conditional, "parameters", {get: function() {
          return [[AST], [AST], [AST]];
        }});
      AccessMember = (function($__super) {
        function AccessMember(receiver, name, getter, setter) {
          $traceurRuntime.superConstructor(AccessMember).call(this);
          this.receiver = receiver;
          this.name = name;
          this.getter = getter;
          this.setter = setter;
        }
        return ($traceurRuntime.createClass)(AccessMember, {
          eval: function(context, locals) {
            if (this.receiver instanceof ImplicitReceiver && isPresent(locals) && locals.contains(this.name)) {
              return locals.get(this.name);
            } else {
              var evaluatedReceiver = this.receiver.eval(context, locals);
              return this.getter(evaluatedReceiver);
            }
          },
          get isAssignable() {
            return true;
          },
          assign: function(context, locals, value) {
            var evaluatedContext = this.receiver.eval(context, locals);
            if (this.receiver instanceof ImplicitReceiver && isPresent(locals) && locals.contains(this.name)) {
              throw new BaseException(("Cannot reassign a variable binding " + this.name));
            } else {
              return this.setter(evaluatedContext, value);
            }
          },
          visit: function(visitor) {
            return visitor.visitAccessMember(this);
          }
        }, {}, $__super);
      }(AST));
      $__export("AccessMember", AccessMember);
      Object.defineProperty(AccessMember, "parameters", {get: function() {
          return [[AST], [assert.type.string], [Function], [Function]];
        }});
      KeyedAccess = (function($__super) {
        function KeyedAccess(obj, key) {
          $traceurRuntime.superConstructor(KeyedAccess).call(this);
          this.obj = obj;
          this.key = key;
        }
        return ($traceurRuntime.createClass)(KeyedAccess, {
          eval: function(context, locals) {
            var obj = this.obj.eval(context, locals);
            var key = this.key.eval(context, locals);
            return obj[key];
          },
          get isAssignable() {
            return true;
          },
          assign: function(context, locals, value) {
            var obj = this.obj.eval(context, locals);
            var key = this.key.eval(context, locals);
            obj[key] = value;
            return value;
          },
          visit: function(visitor) {
            return visitor.visitKeyedAccess(this);
          }
        }, {}, $__super);
      }(AST));
      $__export("KeyedAccess", KeyedAccess);
      Object.defineProperty(KeyedAccess, "parameters", {get: function() {
          return [[AST], [AST]];
        }});
      Pipe = (function($__super) {
        function Pipe(exp, name, args, inBinding) {
          $traceurRuntime.superConstructor(Pipe).call(this);
          this.exp = exp;
          this.name = name;
          this.args = args;
          this.inBinding = inBinding;
        }
        return ($traceurRuntime.createClass)(Pipe, {visit: function(visitor) {
            return visitor.visitPipe(this);
          }}, {}, $__super);
      }(AST));
      $__export("Pipe", Pipe);
      Object.defineProperty(Pipe, "parameters", {get: function() {
          return [[AST], [assert.type.string], [List], [assert.type.boolean]];
        }});
      LiteralPrimitive = (function($__super) {
        function LiteralPrimitive(value) {
          $traceurRuntime.superConstructor(LiteralPrimitive).call(this);
          this.value = value;
        }
        return ($traceurRuntime.createClass)(LiteralPrimitive, {
          eval: function(context, locals) {
            return this.value;
          },
          visit: function(visitor) {
            return visitor.visitLiteralPrimitive(this);
          }
        }, {}, $__super);
      }(AST));
      $__export("LiteralPrimitive", LiteralPrimitive);
      LiteralArray = (function($__super) {
        function LiteralArray(expressions) {
          $traceurRuntime.superConstructor(LiteralArray).call(this);
          this.expressions = expressions;
        }
        return ($traceurRuntime.createClass)(LiteralArray, {
          eval: function(context, locals) {
            return ListWrapper.map(this.expressions, (function(e) {
              return e.eval(context, locals);
            }));
          },
          visit: function(visitor) {
            return visitor.visitLiteralArray(this);
          }
        }, {}, $__super);
      }(AST));
      $__export("LiteralArray", LiteralArray);
      Object.defineProperty(LiteralArray, "parameters", {get: function() {
          return [[List]];
        }});
      LiteralMap = (function($__super) {
        function LiteralMap(keys, values) {
          $traceurRuntime.superConstructor(LiteralMap).call(this);
          this.keys = keys;
          this.values = values;
        }
        return ($traceurRuntime.createClass)(LiteralMap, {
          eval: function(context, locals) {
            var res = StringMapWrapper.create();
            for (var i = 0; i < this.keys.length; ++i) {
              StringMapWrapper.set(res, this.keys[i], this.values[i].eval(context, locals));
            }
            return res;
          },
          visit: function(visitor) {
            return visitor.visitLiteralMap(this);
          }
        }, {}, $__super);
      }(AST));
      $__export("LiteralMap", LiteralMap);
      Object.defineProperty(LiteralMap, "parameters", {get: function() {
          return [[List], [List]];
        }});
      Interpolation = (function($__super) {
        function Interpolation(strings, expressions) {
          $traceurRuntime.superConstructor(Interpolation).call(this);
          this.strings = strings;
          this.expressions = expressions;
        }
        return ($traceurRuntime.createClass)(Interpolation, {
          eval: function(context, locals) {
            throw new BaseException("evaluating an Interpolation is not supported");
          },
          visit: function(visitor) {
            visitor.visitInterpolation(this);
          }
        }, {}, $__super);
      }(AST));
      $__export("Interpolation", Interpolation);
      Object.defineProperty(Interpolation, "parameters", {get: function() {
          return [[List], [List]];
        }});
      Binary = (function($__super) {
        function Binary(operation, left, right) {
          $traceurRuntime.superConstructor(Binary).call(this);
          this.operation = operation;
          this.left = left;
          this.right = right;
        }
        return ($traceurRuntime.createClass)(Binary, {
          eval: function(context, locals) {
            var left = this.left.eval(context, locals);
            switch (this.operation) {
              case '&&':
                return left && this.right.eval(context, locals);
              case '||':
                return left || this.right.eval(context, locals);
            }
            var right = this.right.eval(context, locals);
            switch (this.operation) {
              case '+':
                return left + right;
              case '-':
                return left - right;
              case '*':
                return left * right;
              case '/':
                return left / right;
              case '%':
                return left % right;
              case '==':
                return left == right;
              case '!=':
                return left != right;
              case '<':
                return left < right;
              case '>':
                return left > right;
              case '<=':
                return left <= right;
              case '>=':
                return left >= right;
              case '^':
                return left ^ right;
              case '&':
                return left & right;
            }
            throw 'Internal error [$operation] not handled';
          },
          visit: function(visitor) {
            return visitor.visitBinary(this);
          }
        }, {}, $__super);
      }(AST));
      $__export("Binary", Binary);
      Object.defineProperty(Binary, "parameters", {get: function() {
          return [[assert.type.string], [AST], [AST]];
        }});
      PrefixNot = (function($__super) {
        function PrefixNot(expression) {
          $traceurRuntime.superConstructor(PrefixNot).call(this);
          this.expression = expression;
        }
        return ($traceurRuntime.createClass)(PrefixNot, {
          eval: function(context, locals) {
            return !this.expression.eval(context, locals);
          },
          visit: function(visitor) {
            return visitor.visitPrefixNot(this);
          }
        }, {}, $__super);
      }(AST));
      $__export("PrefixNot", PrefixNot);
      Object.defineProperty(PrefixNot, "parameters", {get: function() {
          return [[AST]];
        }});
      Assignment = (function($__super) {
        function Assignment(target, value) {
          $traceurRuntime.superConstructor(Assignment).call(this);
          this.target = target;
          this.value = value;
        }
        return ($traceurRuntime.createClass)(Assignment, {
          eval: function(context, locals) {
            return this.target.assign(context, locals, this.value.eval(context, locals));
          },
          visit: function(visitor) {
            return visitor.visitAssignment(this);
          }
        }, {}, $__super);
      }(AST));
      $__export("Assignment", Assignment);
      Object.defineProperty(Assignment, "parameters", {get: function() {
          return [[AST], [AST]];
        }});
      MethodCall = (function($__super) {
        function MethodCall(receiver, name, fn, args) {
          $traceurRuntime.superConstructor(MethodCall).call(this);
          this.receiver = receiver;
          this.fn = fn;
          this.args = args;
          this.name = name;
        }
        return ($traceurRuntime.createClass)(MethodCall, {
          eval: function(context, locals) {
            var evaluatedArgs = evalList(context, locals, this.args);
            if (this.receiver instanceof ImplicitReceiver && isPresent(locals) && locals.contains(this.name)) {
              var fn = locals.get(this.name);
              return FunctionWrapper.apply(fn, evaluatedArgs);
            } else {
              var evaluatedReceiver = this.receiver.eval(context, locals);
              return this.fn(evaluatedReceiver, evaluatedArgs);
            }
          },
          visit: function(visitor) {
            return visitor.visitMethodCall(this);
          }
        }, {}, $__super);
      }(AST));
      $__export("MethodCall", MethodCall);
      Object.defineProperty(MethodCall, "parameters", {get: function() {
          return [[AST], [assert.type.string], [Function], [List]];
        }});
      FunctionCall = (function($__super) {
        function FunctionCall(target, args) {
          $traceurRuntime.superConstructor(FunctionCall).call(this);
          this.target = target;
          this.args = args;
        }
        return ($traceurRuntime.createClass)(FunctionCall, {
          eval: function(context, locals) {
            var obj = this.target.eval(context, locals);
            if (!(obj instanceof Function)) {
              throw new BaseException((obj + " is not a function"));
            }
            return FunctionWrapper.apply(obj, evalList(context, locals, this.args));
          },
          visit: function(visitor) {
            return visitor.visitFunctionCall(this);
          }
        }, {}, $__super);
      }(AST));
      $__export("FunctionCall", FunctionCall);
      Object.defineProperty(FunctionCall, "parameters", {get: function() {
          return [[AST], [List]];
        }});
      ASTWithSource = (function($__super) {
        function ASTWithSource(ast, source, location) {
          $traceurRuntime.superConstructor(ASTWithSource).call(this);
          this.source = source;
          this.location = location;
          this.ast = ast;
        }
        return ($traceurRuntime.createClass)(ASTWithSource, {
          eval: function(context, locals) {
            return this.ast.eval(context, locals);
          },
          get isAssignable() {
            return this.ast.isAssignable;
          },
          assign: function(context, locals, value) {
            return this.ast.assign(context, locals, value);
          },
          visit: function(visitor) {
            return this.ast.visit(visitor);
          },
          toString: function() {
            return (this.source + " in " + this.location);
          }
        }, {}, $__super);
      }(AST));
      $__export("ASTWithSource", ASTWithSource);
      Object.defineProperty(ASTWithSource, "parameters", {get: function() {
          return [[AST], [assert.type.string], [assert.type.string]];
        }});
      TemplateBinding = (function() {
        function TemplateBinding(key, keyIsVar, name, expression) {
          this.key = key;
          this.keyIsVar = keyIsVar;
          this.name = name;
          this.expression = expression;
        }
        return ($traceurRuntime.createClass)(TemplateBinding, {}, {});
      }());
      $__export("TemplateBinding", TemplateBinding);
      Object.defineProperty(TemplateBinding, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.boolean], [assert.type.string], [ASTWithSource]];
        }});
      AstVisitor = (function() {
        function AstVisitor() {}
        return ($traceurRuntime.createClass)(AstVisitor, {
          visitAccessMember: function(ast) {},
          visitAssignment: function(ast) {},
          visitBinary: function(ast) {},
          visitChain: function(ast) {},
          visitConditional: function(ast) {},
          visitPipe: function(ast) {},
          visitFunctionCall: function(ast) {},
          visitImplicitReceiver: function(ast) {},
          visitKeyedAccess: function(ast) {},
          visitLiteralArray: function(ast) {},
          visitLiteralMap: function(ast) {},
          visitLiteralPrimitive: function(ast) {},
          visitMethodCall: function(ast) {},
          visitPrefixNot: function(ast) {}
        }, {});
      }());
      $__export("AstVisitor", AstVisitor);
      Object.defineProperty(AstVisitor.prototype.visitAccessMember, "parameters", {get: function() {
          return [[AccessMember]];
        }});
      Object.defineProperty(AstVisitor.prototype.visitAssignment, "parameters", {get: function() {
          return [[Assignment]];
        }});
      Object.defineProperty(AstVisitor.prototype.visitBinary, "parameters", {get: function() {
          return [[Binary]];
        }});
      Object.defineProperty(AstVisitor.prototype.visitChain, "parameters", {get: function() {
          return [[Chain]];
        }});
      Object.defineProperty(AstVisitor.prototype.visitConditional, "parameters", {get: function() {
          return [[Conditional]];
        }});
      Object.defineProperty(AstVisitor.prototype.visitPipe, "parameters", {get: function() {
          return [[Pipe]];
        }});
      Object.defineProperty(AstVisitor.prototype.visitFunctionCall, "parameters", {get: function() {
          return [[FunctionCall]];
        }});
      Object.defineProperty(AstVisitor.prototype.visitImplicitReceiver, "parameters", {get: function() {
          return [[ImplicitReceiver]];
        }});
      Object.defineProperty(AstVisitor.prototype.visitKeyedAccess, "parameters", {get: function() {
          return [[KeyedAccess]];
        }});
      Object.defineProperty(AstVisitor.prototype.visitLiteralArray, "parameters", {get: function() {
          return [[LiteralArray]];
        }});
      Object.defineProperty(AstVisitor.prototype.visitLiteralMap, "parameters", {get: function() {
          return [[LiteralMap]];
        }});
      Object.defineProperty(AstVisitor.prototype.visitLiteralPrimitive, "parameters", {get: function() {
          return [[LiteralPrimitive]];
        }});
      Object.defineProperty(AstVisitor.prototype.visitMethodCall, "parameters", {get: function() {
          return [[MethodCall]];
        }});
      Object.defineProperty(AstVisitor.prototype.visitPrefixNot, "parameters", {get: function() {
          return [[PrefixNot]];
        }});
      AstTransformer = (function() {
        function AstTransformer() {}
        return ($traceurRuntime.createClass)(AstTransformer, {
          visitImplicitReceiver: function(ast) {
            return new ImplicitReceiver();
          },
          visitInterpolation: function(ast) {
            return new Interpolation(ast.strings, this.visitAll(ast.expressions));
          },
          visitLiteralPrimitive: function(ast) {
            return new LiteralPrimitive(ast.value);
          },
          visitAccessMember: function(ast) {
            return new AccessMember(ast.receiver.visit(this), ast.name, ast.getter, ast.setter);
          },
          visitMethodCall: function(ast) {
            return new MethodCall(ast.receiver.visit(this), ast.name, ast.fn, this.visitAll(ast.args));
          },
          visitFunctionCall: function(ast) {
            return new FunctionCall(ast.target.visit(this), this.visitAll(ast.args));
          },
          visitLiteralArray: function(ast) {
            return new LiteralArray(this.visitAll(ast.expressions));
          },
          visitLiteralMap: function(ast) {
            return new LiteralMap(ast.keys, this.visitAll(ast.values));
          },
          visitBinary: function(ast) {
            return new Binary(ast.operation, ast.left.visit(this), ast.right.visit(this));
          },
          visitPrefixNot: function(ast) {
            return new PrefixNot(ast.expression.visit(this));
          },
          visitConditional: function(ast) {
            return new Conditional(ast.condition.visit(this), ast.trueExp.visit(this), ast.falseExp.visit(this));
          },
          visitPipe: function(ast) {
            return new Pipe(ast.exp.visit(this), ast.name, this.visitAll(ast.args), ast.inBinding);
          },
          visitKeyedAccess: function(ast) {
            return new KeyedAccess(ast.obj.visit(this), ast.key.visit(this));
          },
          visitAll: function(asts) {
            var res = ListWrapper.createFixedSize(asts.length);
            for (var i = 0; i < asts.length; ++i) {
              res[i] = asts[i].visit(this);
            }
            return res;
          }
        }, {});
      }());
      $__export("AstTransformer", AstTransformer);
      Object.defineProperty(AstTransformer.prototype.visitImplicitReceiver, "parameters", {get: function() {
          return [[ImplicitReceiver]];
        }});
      Object.defineProperty(AstTransformer.prototype.visitInterpolation, "parameters", {get: function() {
          return [[Interpolation]];
        }});
      Object.defineProperty(AstTransformer.prototype.visitLiteralPrimitive, "parameters", {get: function() {
          return [[LiteralPrimitive]];
        }});
      Object.defineProperty(AstTransformer.prototype.visitAccessMember, "parameters", {get: function() {
          return [[AccessMember]];
        }});
      Object.defineProperty(AstTransformer.prototype.visitMethodCall, "parameters", {get: function() {
          return [[MethodCall]];
        }});
      Object.defineProperty(AstTransformer.prototype.visitFunctionCall, "parameters", {get: function() {
          return [[FunctionCall]];
        }});
      Object.defineProperty(AstTransformer.prototype.visitLiteralArray, "parameters", {get: function() {
          return [[LiteralArray]];
        }});
      Object.defineProperty(AstTransformer.prototype.visitLiteralMap, "parameters", {get: function() {
          return [[LiteralMap]];
        }});
      Object.defineProperty(AstTransformer.prototype.visitBinary, "parameters", {get: function() {
          return [[Binary]];
        }});
      Object.defineProperty(AstTransformer.prototype.visitPrefixNot, "parameters", {get: function() {
          return [[PrefixNot]];
        }});
      Object.defineProperty(AstTransformer.prototype.visitConditional, "parameters", {get: function() {
          return [[Conditional]];
        }});
      Object.defineProperty(AstTransformer.prototype.visitPipe, "parameters", {get: function() {
          return [[Pipe]];
        }});
      Object.defineProperty(AstTransformer.prototype.visitKeyedAccess, "parameters", {get: function() {
          return [[KeyedAccess]];
        }});
      Object.defineProperty(AstTransformer.prototype.visitAll, "parameters", {get: function() {
          return [[List]];
        }});
      _evalListCache = [[], [0], [0, 0], [0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
      Object.defineProperty(evalList, "parameters", {get: function() {
          return [[], [], [List]];
        }});
    }
  };
});

System.register("angular2/src/change_detection/parser/lexer", ["angular2/di", "angular2/src/facade/collection", "angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/change_detection/parser/lexer";
  var Injectable,
      List,
      ListWrapper,
      SetWrapper,
      int,
      NumberWrapper,
      StringJoiner,
      StringWrapper,
      TOKEN_TYPE_CHARACTER,
      TOKEN_TYPE_IDENTIFIER,
      TOKEN_TYPE_KEYWORD,
      TOKEN_TYPE_STRING,
      TOKEN_TYPE_OPERATOR,
      TOKEN_TYPE_NUMBER,
      Lexer,
      Token,
      EOF,
      $EOF,
      $TAB,
      $LF,
      $VTAB,
      $FF,
      $CR,
      $SPACE,
      $BANG,
      $DQ,
      $HASH,
      $$,
      $PERCENT,
      $AMPERSAND,
      $SQ,
      $LPAREN,
      $RPAREN,
      $STAR,
      $PLUS,
      $COMMA,
      $MINUS,
      $PERIOD,
      $SLASH,
      $COLON,
      $SEMICOLON,
      $LT,
      $EQ,
      $GT,
      $QUESTION,
      $0,
      $9,
      $A,
      $B,
      $C,
      $D,
      $E,
      $F,
      $G,
      $H,
      $I,
      $J,
      $K,
      $L,
      $M,
      $N,
      $O,
      $P,
      $Q,
      $R,
      $S,
      $T,
      $U,
      $V,
      $W,
      $X,
      $Y,
      $Z,
      $LBRACKET,
      $BACKSLASH,
      $RBRACKET,
      $CARET,
      $_,
      $a,
      $b,
      $c,
      $d,
      $e,
      $f,
      $g,
      $h,
      $i,
      $j,
      $k,
      $l,
      $m,
      $n,
      $o,
      $p,
      $q,
      $r,
      $s,
      $t,
      $u,
      $v,
      $w,
      $x,
      $y,
      $z,
      $LBRACE,
      $BAR,
      $RBRACE,
      $TILDE,
      $NBSP,
      ScannerError,
      _Scanner,
      OPERATORS,
      KEYWORDS;
  function newCharacterToken(index, code) {
    return new Token(index, TOKEN_TYPE_CHARACTER, code, StringWrapper.fromCharCode(code));
  }
  function newIdentifierToken(index, text) {
    return new Token(index, TOKEN_TYPE_IDENTIFIER, 0, text);
  }
  function newKeywordToken(index, text) {
    return new Token(index, TOKEN_TYPE_KEYWORD, 0, text);
  }
  function newOperatorToken(index, text) {
    return new Token(index, TOKEN_TYPE_OPERATOR, 0, text);
  }
  function newStringToken(index, text) {
    return new Token(index, TOKEN_TYPE_STRING, 0, text);
  }
  function newNumberToken(index, n) {
    return new Token(index, TOKEN_TYPE_NUMBER, n, "");
  }
  function isWhitespace(code) {
    return (code >= $TAB && code <= $SPACE) || (code == $NBSP);
  }
  function isIdentifierStart(code) {
    return ($a <= code && code <= $z) || ($A <= code && code <= $Z) || (code == $_) || (code == $$);
  }
  function isIdentifierPart(code) {
    return ($a <= code && code <= $z) || ($A <= code && code <= $Z) || ($0 <= code && code <= $9) || (code == $_) || (code == $$);
  }
  function isDigit(code) {
    return $0 <= code && code <= $9;
  }
  function isExponentStart(code) {
    return code == $e || code == $E;
  }
  function isExponentSign(code) {
    return code == $MINUS || code == $PLUS;
  }
  function unescape(code) {
    switch (code) {
      case $n:
        return $LF;
      case $f:
        return $FF;
      case $r:
        return $CR;
      case $t:
        return $TAB;
      case $v:
        return $VTAB;
      default:
        return code;
    }
  }
  return {
    setters: [function($__m) {
      Injectable = $__m.Injectable;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
      SetWrapper = $__m.SetWrapper;
    }, function($__m) {
      int = $__m.int;
      NumberWrapper = $__m.NumberWrapper;
      StringJoiner = $__m.StringJoiner;
      StringWrapper = $__m.StringWrapper;
    }],
    execute: function() {
      TOKEN_TYPE_CHARACTER = 1;
      $__export("TOKEN_TYPE_CHARACTER", TOKEN_TYPE_CHARACTER);
      TOKEN_TYPE_IDENTIFIER = 2;
      $__export("TOKEN_TYPE_IDENTIFIER", TOKEN_TYPE_IDENTIFIER);
      TOKEN_TYPE_KEYWORD = 3;
      $__export("TOKEN_TYPE_KEYWORD", TOKEN_TYPE_KEYWORD);
      TOKEN_TYPE_STRING = 4;
      $__export("TOKEN_TYPE_STRING", TOKEN_TYPE_STRING);
      TOKEN_TYPE_OPERATOR = 5;
      $__export("TOKEN_TYPE_OPERATOR", TOKEN_TYPE_OPERATOR);
      TOKEN_TYPE_NUMBER = 6;
      $__export("TOKEN_TYPE_NUMBER", TOKEN_TYPE_NUMBER);
      Lexer = (function() {
        function Lexer() {}
        return ($traceurRuntime.createClass)(Lexer, {tokenize: function(text) {
            var scanner = new _Scanner(text);
            var tokens = [];
            var token = scanner.scanToken();
            while (token != null) {
              ListWrapper.push(tokens, token);
              token = scanner.scanToken();
            }
            return tokens;
          }}, {});
      }());
      $__export("Lexer", Lexer);
      Object.defineProperty(Lexer, "annotations", {get: function() {
          return [new Injectable()];
        }});
      Object.defineProperty(Lexer.prototype.tokenize, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Token = (function() {
        function Token(index, type, numValue, strValue) {
          this.index = index;
          this.type = type;
          this._numValue = numValue;
          this._strValue = strValue;
        }
        return ($traceurRuntime.createClass)(Token, {
          isCharacter: function(code) {
            return (this.type == TOKEN_TYPE_CHARACTER && this._numValue == code);
          },
          isNumber: function() {
            return (this.type == TOKEN_TYPE_NUMBER);
          },
          isString: function() {
            return (this.type == TOKEN_TYPE_STRING);
          },
          isOperator: function(operater) {
            return (this.type == TOKEN_TYPE_OPERATOR && this._strValue == operater);
          },
          isIdentifier: function() {
            return (this.type == TOKEN_TYPE_IDENTIFIER);
          },
          isKeyword: function() {
            return (this.type == TOKEN_TYPE_KEYWORD);
          },
          isKeywordVar: function() {
            return (this.type == TOKEN_TYPE_KEYWORD && this._strValue == "var");
          },
          isKeywordNull: function() {
            return (this.type == TOKEN_TYPE_KEYWORD && this._strValue == "null");
          },
          isKeywordUndefined: function() {
            return (this.type == TOKEN_TYPE_KEYWORD && this._strValue == "undefined");
          },
          isKeywordTrue: function() {
            return (this.type == TOKEN_TYPE_KEYWORD && this._strValue == "true");
          },
          isKeywordFalse: function() {
            return (this.type == TOKEN_TYPE_KEYWORD && this._strValue == "false");
          },
          toNumber: function() {
            return (this.type == TOKEN_TYPE_NUMBER) ? this._numValue : -1;
          },
          toString: function() {
            var type = this.type;
            if (type >= TOKEN_TYPE_CHARACTER && type <= TOKEN_TYPE_STRING) {
              return this._strValue;
            } else if (type == TOKEN_TYPE_NUMBER) {
              return this._numValue.toString();
            } else {
              return null;
            }
          }
        }, {});
      }());
      $__export("Token", Token);
      Object.defineProperty(Token, "parameters", {get: function() {
          return [[int], [int], [assert.type.number], [assert.type.string]];
        }});
      Object.defineProperty(Token.prototype.isCharacter, "parameters", {get: function() {
          return [[int]];
        }});
      Object.defineProperty(Token.prototype.isOperator, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(newCharacterToken, "parameters", {get: function() {
          return [[int], [int]];
        }});
      Object.defineProperty(newIdentifierToken, "parameters", {get: function() {
          return [[int], [assert.type.string]];
        }});
      Object.defineProperty(newKeywordToken, "parameters", {get: function() {
          return [[int], [assert.type.string]];
        }});
      Object.defineProperty(newOperatorToken, "parameters", {get: function() {
          return [[int], [assert.type.string]];
        }});
      Object.defineProperty(newStringToken, "parameters", {get: function() {
          return [[int], [assert.type.string]];
        }});
      Object.defineProperty(newNumberToken, "parameters", {get: function() {
          return [[int], [assert.type.number]];
        }});
      EOF = new Token(-1, 0, 0, "");
      $__export("EOF", EOF);
      $EOF = 0;
      $__export("$EOF", $EOF);
      $TAB = 9;
      $__export("$TAB", $TAB);
      $LF = 10;
      $__export("$LF", $LF);
      $VTAB = 11;
      $__export("$VTAB", $VTAB);
      $FF = 12;
      $__export("$FF", $FF);
      $CR = 13;
      $__export("$CR", $CR);
      $SPACE = 32;
      $__export("$SPACE", $SPACE);
      $BANG = 33;
      $__export("$BANG", $BANG);
      $DQ = 34;
      $__export("$DQ", $DQ);
      $HASH = 35;
      $__export("$HASH", $HASH);
      $$ = 36;
      $__export("$$", $$);
      $PERCENT = 37;
      $__export("$PERCENT", $PERCENT);
      $AMPERSAND = 38;
      $__export("$AMPERSAND", $AMPERSAND);
      $SQ = 39;
      $__export("$SQ", $SQ);
      $LPAREN = 40;
      $__export("$LPAREN", $LPAREN);
      $RPAREN = 41;
      $__export("$RPAREN", $RPAREN);
      $STAR = 42;
      $__export("$STAR", $STAR);
      $PLUS = 43;
      $__export("$PLUS", $PLUS);
      $COMMA = 44;
      $__export("$COMMA", $COMMA);
      $MINUS = 45;
      $__export("$MINUS", $MINUS);
      $PERIOD = 46;
      $__export("$PERIOD", $PERIOD);
      $SLASH = 47;
      $__export("$SLASH", $SLASH);
      $COLON = 58;
      $__export("$COLON", $COLON);
      $SEMICOLON = 59;
      $__export("$SEMICOLON", $SEMICOLON);
      $LT = 60;
      $__export("$LT", $LT);
      $EQ = 61;
      $__export("$EQ", $EQ);
      $GT = 62;
      $__export("$GT", $GT);
      $QUESTION = 63;
      $__export("$QUESTION", $QUESTION);
      $0 = 48;
      $9 = 57;
      $A = 65, $B = 66, $C = 67, $D = 68, $E = 69, $F = 70, $G = 71, $H = 72, $I = 73, $J = 74, $K = 75, $L = 76, $M = 77, $N = 78, $O = 79, $P = 80, $Q = 81, $R = 82, $S = 83, $T = 84, $U = 85, $V = 86, $W = 87, $X = 88, $Y = 89, $Z = 90;
      $LBRACKET = 91;
      $__export("$LBRACKET", $LBRACKET);
      $BACKSLASH = 92;
      $__export("$BACKSLASH", $BACKSLASH);
      $RBRACKET = 93;
      $__export("$RBRACKET", $RBRACKET);
      $CARET = 94;
      $_ = 95;
      $a = 97, $b = 98, $c = 99, $d = 100, $e = 101, $f = 102, $g = 103, $h = 104, $i = 105, $j = 106, $k = 107, $l = 108, $m = 109, $n = 110, $o = 111, $p = 112, $q = 113, $r = 114, $s = 115, $t = 116, $u = 117, $v = 118, $w = 119, $x = 120, $y = 121, $z = 122;
      $LBRACE = 123;
      $__export("$LBRACE", $LBRACE);
      $BAR = 124;
      $__export("$BAR", $BAR);
      $RBRACE = 125;
      $__export("$RBRACE", $RBRACE);
      $TILDE = 126;
      $NBSP = 160;
      ScannerError = (function($__super) {
        function ScannerError(message) {
          $traceurRuntime.superConstructor(ScannerError).call(this);
          this.message = message;
        }
        return ($traceurRuntime.createClass)(ScannerError, {toString: function() {
            return this.message;
          }}, {}, $__super);
      }(Error));
      $__export("ScannerError", ScannerError);
      _Scanner = (function() {
        function _Scanner(input) {
          this.input = input;
          this.length = input.length;
          this.peek = 0;
          this.index = -1;
          this.advance();
        }
        return ($traceurRuntime.createClass)(_Scanner, {
          advance: function() {
            this.peek = ++this.index >= this.length ? $EOF : StringWrapper.charCodeAt(this.input, this.index);
          },
          scanToken: function() {
            var input = this.input,
                length = this.length,
                peek = this.peek,
                index = this.index;
            while (peek <= $SPACE) {
              if (++index >= length) {
                peek = $EOF;
                break;
              } else {
                peek = StringWrapper.charCodeAt(input, index);
              }
            }
            this.peek = peek;
            this.index = index;
            if (index >= length) {
              return null;
            }
            if (isIdentifierStart(peek))
              return this.scanIdentifier();
            if (isDigit(peek))
              return this.scanNumber(index);
            var start = index;
            switch (peek) {
              case $PERIOD:
                this.advance();
                return isDigit(this.peek) ? this.scanNumber(start) : newCharacterToken(start, $PERIOD);
              case $LPAREN:
              case $RPAREN:
              case $LBRACE:
              case $RBRACE:
              case $LBRACKET:
              case $RBRACKET:
              case $COMMA:
              case $COLON:
              case $SEMICOLON:
                return this.scanCharacter(start, peek);
              case $SQ:
              case $DQ:
                return this.scanString();
              case $HASH:
                return this.scanOperator(start, StringWrapper.fromCharCode(peek));
              case $PLUS:
              case $MINUS:
              case $STAR:
              case $SLASH:
              case $PERCENT:
              case $CARET:
              case $QUESTION:
                return this.scanOperator(start, StringWrapper.fromCharCode(peek));
              case $LT:
              case $GT:
              case $BANG:
              case $EQ:
                return this.scanComplexOperator(start, $EQ, StringWrapper.fromCharCode(peek), '=');
              case $AMPERSAND:
                return this.scanComplexOperator(start, $AMPERSAND, '&', '&');
              case $BAR:
                return this.scanComplexOperator(start, $BAR, '|', '|');
              case $TILDE:
                return this.scanComplexOperator(start, $SLASH, '~', '/');
              case $NBSP:
                while (isWhitespace(this.peek))
                  this.advance();
                return this.scanToken();
            }
            this.error(("Unexpected character [" + StringWrapper.fromCharCode(peek) + "]"), 0);
            return null;
          },
          scanCharacter: function(start, code) {
            assert(this.peek == code);
            this.advance();
            return newCharacterToken(start, code);
          },
          scanOperator: function(start, str) {
            assert(this.peek == StringWrapper.charCodeAt(str, 0));
            assert(SetWrapper.has(OPERATORS, str));
            this.advance();
            return newOperatorToken(start, str);
          },
          scanComplexOperator: function(start, code, one, two) {
            assert(this.peek == StringWrapper.charCodeAt(one, 0));
            this.advance();
            var str = one;
            if (this.peek == code) {
              this.advance();
              str += two;
            }
            assert(SetWrapper.has(OPERATORS, str));
            return newOperatorToken(start, str);
          },
          scanIdentifier: function() {
            assert(isIdentifierStart(this.peek));
            var start = this.index;
            this.advance();
            while (isIdentifierPart(this.peek))
              this.advance();
            var str = this.input.substring(start, this.index);
            if (SetWrapper.has(KEYWORDS, str)) {
              return newKeywordToken(start, str);
            } else {
              return newIdentifierToken(start, str);
            }
          },
          scanNumber: function(start) {
            assert(isDigit(this.peek));
            var simple = (this.index === start);
            this.advance();
            while (true) {
              if (isDigit(this.peek)) {} else if (this.peek == $PERIOD) {
                simple = false;
              } else if (isExponentStart(this.peek)) {
                this.advance();
                if (isExponentSign(this.peek))
                  this.advance();
                if (!isDigit(this.peek))
                  this.error('Invalid exponent', -1);
                simple = false;
              } else {
                break;
              }
              this.advance();
            }
            var str = this.input.substring(start, this.index);
            var value = simple ? NumberWrapper.parseIntAutoRadix(str) : NumberWrapper.parseFloat(str);
            return newNumberToken(start, value);
          },
          scanString: function() {
            assert(this.peek == $SQ || this.peek == $DQ);
            var start = this.index;
            var quote = this.peek;
            this.advance();
            var buffer;
            var marker = this.index;
            var input = this.input;
            while (this.peek != quote) {
              if (this.peek == $BACKSLASH) {
                if (buffer == null)
                  buffer = new StringJoiner();
                buffer.add(input.substring(marker, this.index));
                this.advance();
                var unescapedCode = void 0;
                if (this.peek == $u) {
                  var hex = input.substring(this.index + 1, this.index + 5);
                  try {
                    unescapedCode = NumberWrapper.parseInt(hex, 16);
                  } catch (e) {
                    this.error(("Invalid unicode escape [\\u" + hex + "]"), 0);
                  }
                  for (var i = 0; i < 5; i++) {
                    this.advance();
                  }
                } else {
                  unescapedCode = unescape(this.peek);
                  this.advance();
                }
                buffer.add(StringWrapper.fromCharCode(unescapedCode));
                marker = this.index;
              } else if (this.peek == $EOF) {
                this.error('Unterminated quote', 0);
              } else {
                this.advance();
              }
            }
            var last = input.substring(marker, this.index);
            this.advance();
            var unescaped = last;
            if (buffer != null) {
              buffer.add(last);
              unescaped = buffer.toString();
            }
            return newStringToken(start, unescaped);
          },
          error: function(message, offset) {
            var position = this.index + offset;
            throw new ScannerError(("Lexer Error: " + message + " at column " + position + " in expression [" + this.input + "]"));
          }
        }, {});
      }());
      Object.defineProperty(_Scanner, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(_Scanner.prototype.scanCharacter, "parameters", {get: function() {
          return [[int], [int]];
        }});
      Object.defineProperty(_Scanner.prototype.scanOperator, "parameters", {get: function() {
          return [[int], [assert.type.string]];
        }});
      Object.defineProperty(_Scanner.prototype.scanComplexOperator, "parameters", {get: function() {
          return [[int], [int], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(_Scanner.prototype.scanNumber, "parameters", {get: function() {
          return [[int]];
        }});
      Object.defineProperty(_Scanner.prototype.error, "parameters", {get: function() {
          return [[assert.type.string], [int]];
        }});
      Object.defineProperty(isWhitespace, "parameters", {get: function() {
          return [[int]];
        }});
      Object.defineProperty(isIdentifierStart, "parameters", {get: function() {
          return [[int]];
        }});
      Object.defineProperty(isIdentifierPart, "parameters", {get: function() {
          return [[int]];
        }});
      Object.defineProperty(isDigit, "parameters", {get: function() {
          return [[int]];
        }});
      Object.defineProperty(isExponentStart, "parameters", {get: function() {
          return [[int]];
        }});
      Object.defineProperty(isExponentSign, "parameters", {get: function() {
          return [[int]];
        }});
      Object.defineProperty(unescape, "parameters", {get: function() {
          return [[int]];
        }});
      OPERATORS = SetWrapper.createFromList(['+', '-', '*', '/', '~/', '%', '^', '=', '==', '!=', '<', '>', '<=', '>=', '&&', '||', '&', '|', '!', '?', '#']);
      KEYWORDS = SetWrapper.createFromList(['var', 'null', 'undefined', 'true', 'false']);
    }
  };
});

System.register("angular2/src/change_detection/parser/locals", ["angular2/src/facade/lang", "angular2/src/facade/collection"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/change_detection/parser/locals";
  var isPresent,
      BaseException,
      ListWrapper,
      MapWrapper,
      Locals;
  return {
    setters: [function($__m) {
      isPresent = $__m.isPresent;
      BaseException = $__m.BaseException;
    }, function($__m) {
      ListWrapper = $__m.ListWrapper;
      MapWrapper = $__m.MapWrapper;
    }],
    execute: function() {
      Locals = (function() {
        function Locals(parent, current) {
          this.parent = parent;
          this.current = current;
        }
        return ($traceurRuntime.createClass)(Locals, {
          contains: function(name) {
            if (MapWrapper.contains(this.current, name)) {
              return true;
            }
            if (isPresent(this.parent)) {
              return this.parent.contains(name);
            }
            return false;
          },
          get: function(name) {
            if (MapWrapper.contains(this.current, name)) {
              return MapWrapper.get(this.current, name);
            }
            if (isPresent(this.parent)) {
              return this.parent.get(name);
            }
            throw new BaseException(("Cannot find '" + name + "'"));
          },
          set: function(name, value) {
            if (MapWrapper.contains(this.current, name)) {
              MapWrapper.set(this.current, name, value);
            } else {
              throw new BaseException('Setting of new keys post-construction is not supported.');
            }
          },
          clearValues: function() {
            MapWrapper.clearValues(this.current);
          }
        }, {});
      }());
      $__export("Locals", Locals);
      Object.defineProperty(Locals, "parameters", {get: function() {
          return [[Locals], [Map]];
        }});
      Object.defineProperty(Locals.prototype.contains, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(Locals.prototype.get, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(Locals.prototype.set, "parameters", {get: function() {
          return [[assert.type.string], []];
        }});
    }
  };
});

System.register("angular2/src/change_detection/parser/parser", ["angular2/di", "angular2/src/facade/lang", "angular2/src/facade/collection", "./lexer", "angular2/src/reflection/reflection", "./ast"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/change_detection/parser/parser";
  var Injectable,
      int,
      isBlank,
      isPresent,
      BaseException,
      StringWrapper,
      RegExpWrapper,
      ListWrapper,
      List,
      Lexer,
      EOF,
      Token,
      $PERIOD,
      $COLON,
      $SEMICOLON,
      $LBRACKET,
      $RBRACKET,
      $COMMA,
      $LBRACE,
      $RBRACE,
      $LPAREN,
      $RPAREN,
      reflector,
      Reflector,
      AST,
      EmptyExpr,
      ImplicitReceiver,
      AccessMember,
      LiteralPrimitive,
      Expression,
      Binary,
      PrefixNot,
      Conditional,
      Pipe,
      Assignment,
      Chain,
      KeyedAccess,
      LiteralArray,
      LiteralMap,
      Interpolation,
      MethodCall,
      FunctionCall,
      TemplateBindings,
      TemplateBinding,
      ASTWithSource,
      _implicitReceiver,
      INTERPOLATION_REGEXP,
      QUOTE_REGEXP,
      Parser,
      _ParseAST;
  return {
    setters: [function($__m) {
      Injectable = $__m.Injectable;
    }, function($__m) {
      int = $__m.int;
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
      BaseException = $__m.BaseException;
      StringWrapper = $__m.StringWrapper;
      RegExpWrapper = $__m.RegExpWrapper;
    }, function($__m) {
      ListWrapper = $__m.ListWrapper;
      List = $__m.List;
    }, function($__m) {
      Lexer = $__m.Lexer;
      EOF = $__m.EOF;
      Token = $__m.Token;
      $PERIOD = $__m.$PERIOD;
      $COLON = $__m.$COLON;
      $SEMICOLON = $__m.$SEMICOLON;
      $LBRACKET = $__m.$LBRACKET;
      $RBRACKET = $__m.$RBRACKET;
      $COMMA = $__m.$COMMA;
      $LBRACE = $__m.$LBRACE;
      $RBRACE = $__m.$RBRACE;
      $LPAREN = $__m.$LPAREN;
      $RPAREN = $__m.$RPAREN;
    }, function($__m) {
      reflector = $__m.reflector;
      Reflector = $__m.Reflector;
    }, function($__m) {
      AST = $__m.AST;
      EmptyExpr = $__m.EmptyExpr;
      ImplicitReceiver = $__m.ImplicitReceiver;
      AccessMember = $__m.AccessMember;
      LiteralPrimitive = $__m.LiteralPrimitive;
      Expression = $__m.Expression;
      Binary = $__m.Binary;
      PrefixNot = $__m.PrefixNot;
      Conditional = $__m.Conditional;
      Pipe = $__m.Pipe;
      Assignment = $__m.Assignment;
      Chain = $__m.Chain;
      KeyedAccess = $__m.KeyedAccess;
      LiteralArray = $__m.LiteralArray;
      LiteralMap = $__m.LiteralMap;
      Interpolation = $__m.Interpolation;
      MethodCall = $__m.MethodCall;
      FunctionCall = $__m.FunctionCall;
      TemplateBindings = $__m.TemplateBindings;
      TemplateBinding = $__m.TemplateBinding;
      ASTWithSource = $__m.ASTWithSource;
    }],
    execute: function() {
      _implicitReceiver = new ImplicitReceiver();
      INTERPOLATION_REGEXP = RegExpWrapper.create('\\{\\{(.*?)\\}\\}');
      QUOTE_REGEXP = RegExpWrapper.create("'");
      Parser = (function() {
        function Parser(lexer) {
          var providedReflector = arguments[1] !== (void 0) ? arguments[1] : null;
          this._lexer = lexer;
          this._reflector = isPresent(providedReflector) ? providedReflector : reflector;
        }
        return ($traceurRuntime.createClass)(Parser, {
          parseAction: function(input, location) {
            var tokens = this._lexer.tokenize(input);
            var ast = new _ParseAST(input, location, tokens, this._reflector, true).parseChain();
            return new ASTWithSource(ast, input, location);
          },
          parseBinding: function(input, location) {
            var tokens = this._lexer.tokenize(input);
            var ast = new _ParseAST(input, location, tokens, this._reflector, false).parseChain();
            return new ASTWithSource(ast, input, location);
          },
          addPipes: function(bindingAst, pipes) {
            if (ListWrapper.isEmpty(pipes))
              return bindingAst;
            var res = ListWrapper.reduce(pipes, (function(result, currentPipeName) {
              return new Pipe(result, currentPipeName, [], false);
            }), bindingAst.ast);
            return new ASTWithSource(res, bindingAst.source, bindingAst.location);
          },
          parseTemplateBindings: function(input, location) {
            var tokens = this._lexer.tokenize(input);
            return new _ParseAST(input, location, tokens, this._reflector, false).parseTemplateBindings();
          },
          parseInterpolation: function(input, location) {
            var parts = StringWrapper.split(input, INTERPOLATION_REGEXP);
            if (parts.length <= 1) {
              return null;
            }
            var strings = [];
            var expressions = [];
            for (var i = 0; i < parts.length; i++) {
              var part = parts[i];
              if (i % 2 === 0) {
                ListWrapper.push(strings, part);
              } else {
                var tokens = this._lexer.tokenize(part);
                var ast = new _ParseAST(input, location, tokens, this._reflector, false).parseChain();
                ListWrapper.push(expressions, ast);
              }
            }
            return new ASTWithSource(new Interpolation(strings, expressions), input, location);
          },
          wrapLiteralPrimitive: function(input, location) {
            return new ASTWithSource(new LiteralPrimitive(input), input, location);
          }
        }, {});
      }());
      $__export("Parser", Parser);
      Object.defineProperty(Parser, "annotations", {get: function() {
          return [new Injectable()];
        }});
      Object.defineProperty(Parser, "parameters", {get: function() {
          return [[Lexer], [Reflector]];
        }});
      Object.defineProperty(Parser.prototype.parseAction, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.any]];
        }});
      Object.defineProperty(Parser.prototype.parseBinding, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.any]];
        }});
      Object.defineProperty(Parser.prototype.addPipes, "parameters", {get: function() {
          return [[ASTWithSource], [assert.genericType(List, String)]];
        }});
      Object.defineProperty(Parser.prototype.parseTemplateBindings, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.any]];
        }});
      Object.defineProperty(Parser.prototype.parseInterpolation, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.any]];
        }});
      Object.defineProperty(Parser.prototype.wrapLiteralPrimitive, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.any]];
        }});
      _ParseAST = (function() {
        function _ParseAST(input, location, tokens, reflector, parseAction) {
          this.input = input;
          this.location = location;
          this.tokens = tokens;
          this.index = 0;
          this.reflector = reflector;
          this.parseAction = parseAction;
        }
        return ($traceurRuntime.createClass)(_ParseAST, {
          peek: function(offset) {
            var i = this.index + offset;
            return i < this.tokens.length ? this.tokens[i] : EOF;
          },
          get next() {
            return this.peek(0);
          },
          get inputIndex() {
            return (this.index < this.tokens.length) ? this.next.index : this.input.length;
          },
          advance: function() {
            this.index++;
          },
          optionalCharacter: function(code) {
            if (this.next.isCharacter(code)) {
              this.advance();
              return true;
            } else {
              return false;
            }
          },
          optionalKeywordVar: function() {
            if (this.peekKeywordVar()) {
              this.advance();
              return true;
            } else {
              return false;
            }
          },
          peekKeywordVar: function() {
            return this.next.isKeywordVar() || this.next.isOperator('#');
          },
          expectCharacter: function(code) {
            if (this.optionalCharacter(code))
              return ;
            this.error(("Missing expected " + StringWrapper.fromCharCode(code)));
          },
          optionalOperator: function(op) {
            if (this.next.isOperator(op)) {
              this.advance();
              return true;
            } else {
              return false;
            }
          },
          expectOperator: function(operator) {
            if (this.optionalOperator(operator))
              return ;
            this.error(("Missing expected operator " + operator));
          },
          expectIdentifierOrKeyword: function() {
            var n = this.next;
            if (!n.isIdentifier() && !n.isKeyword()) {
              this.error(("Unexpected token " + n + ", expected identifier or keyword"));
            }
            this.advance();
            return n.toString();
          },
          expectIdentifierOrKeywordOrString: function() {
            var n = this.next;
            if (!n.isIdentifier() && !n.isKeyword() && !n.isString()) {
              this.error(("Unexpected token " + n + ", expected identifier, keyword, or string"));
            }
            this.advance();
            return n.toString();
          },
          parseChain: function() {
            var exprs = [];
            while (this.index < this.tokens.length) {
              var expr = this.parsePipe();
              ListWrapper.push(exprs, expr);
              if (this.optionalCharacter($SEMICOLON)) {
                if (!this.parseAction) {
                  this.error("Binding expression cannot contain chained expression");
                }
                while (this.optionalCharacter($SEMICOLON)) {}
              } else if (this.index < this.tokens.length) {
                this.error(("Unexpected token '" + this.next + "'"));
              }
            }
            if (exprs.length == 0)
              return new EmptyExpr();
            if (exprs.length == 1)
              return exprs[0];
            return new Chain(exprs);
          },
          parsePipe: function() {
            var result = this.parseExpression();
            if (this.optionalOperator("|")) {
              return this.parseInlinedPipe(result);
            } else {
              return result;
            }
          },
          parseExpression: function() {
            var start = this.inputIndex;
            var result = this.parseConditional();
            while (this.next.isOperator('=')) {
              if (!result.isAssignable) {
                var end = this.inputIndex;
                var expression = this.input.substring(start, end);
                this.error(("Expression " + expression + " is not assignable"));
              }
              if (!this.parseAction) {
                this.error("Binding expression cannot contain assignments");
              }
              this.expectOperator('=');
              result = new Assignment(result, this.parseConditional());
            }
            return result;
          },
          parseConditional: function() {
            var start = this.inputIndex;
            var result = this.parseLogicalOr();
            if (this.optionalOperator('?')) {
              var yes = this.parseExpression();
              if (!this.optionalCharacter($COLON)) {
                var end = this.inputIndex;
                var expression = this.input.substring(start, end);
                this.error(("Conditional expression " + expression + " requires all 3 expressions"));
              }
              var no = this.parseExpression();
              return new Conditional(result, yes, no);
            } else {
              return result;
            }
          },
          parseLogicalOr: function() {
            var result = this.parseLogicalAnd();
            while (this.optionalOperator('||')) {
              result = new Binary('||', result, this.parseLogicalAnd());
            }
            return result;
          },
          parseLogicalAnd: function() {
            var result = this.parseEquality();
            while (this.optionalOperator('&&')) {
              result = new Binary('&&', result, this.parseEquality());
            }
            return result;
          },
          parseEquality: function() {
            var result = this.parseRelational();
            while (true) {
              if (this.optionalOperator('==')) {
                result = new Binary('==', result, this.parseRelational());
              } else if (this.optionalOperator('!=')) {
                result = new Binary('!=', result, this.parseRelational());
              } else {
                return result;
              }
            }
          },
          parseRelational: function() {
            var result = this.parseAdditive();
            while (true) {
              if (this.optionalOperator('<')) {
                result = new Binary('<', result, this.parseAdditive());
              } else if (this.optionalOperator('>')) {
                result = new Binary('>', result, this.parseAdditive());
              } else if (this.optionalOperator('<=')) {
                result = new Binary('<=', result, this.parseAdditive());
              } else if (this.optionalOperator('>=')) {
                result = new Binary('>=', result, this.parseAdditive());
              } else {
                return result;
              }
            }
          },
          parseAdditive: function() {
            var result = this.parseMultiplicative();
            while (true) {
              if (this.optionalOperator('+')) {
                result = new Binary('+', result, this.parseMultiplicative());
              } else if (this.optionalOperator('-')) {
                result = new Binary('-', result, this.parseMultiplicative());
              } else {
                return result;
              }
            }
          },
          parseMultiplicative: function() {
            var result = this.parsePrefix();
            while (true) {
              if (this.optionalOperator('*')) {
                result = new Binary('*', result, this.parsePrefix());
              } else if (this.optionalOperator('%')) {
                result = new Binary('%', result, this.parsePrefix());
              } else if (this.optionalOperator('/')) {
                result = new Binary('/', result, this.parsePrefix());
              } else {
                return result;
              }
            }
          },
          parsePrefix: function() {
            if (this.optionalOperator('+')) {
              return this.parsePrefix();
            } else if (this.optionalOperator('-')) {
              return new Binary('-', new LiteralPrimitive(0), this.parsePrefix());
            } else if (this.optionalOperator('!')) {
              return new PrefixNot(this.parsePrefix());
            } else {
              return this.parseCallChain();
            }
          },
          parseCallChain: function() {
            var result = this.parsePrimary();
            while (true) {
              if (this.optionalCharacter($PERIOD)) {
                result = this.parseAccessMemberOrMethodCall(result);
              } else if (this.optionalCharacter($LBRACKET)) {
                var key = this.parseExpression();
                this.expectCharacter($RBRACKET);
                result = new KeyedAccess(result, key);
              } else if (this.optionalCharacter($LPAREN)) {
                var args = this.parseCallArguments();
                this.expectCharacter($RPAREN);
                result = new FunctionCall(result, args);
              } else {
                return result;
              }
            }
          },
          parsePrimary: function() {
            if (this.optionalCharacter($LPAREN)) {
              var result = this.parsePipe();
              this.expectCharacter($RPAREN);
              return result;
            } else if (this.next.isKeywordNull() || this.next.isKeywordUndefined()) {
              this.advance();
              return new LiteralPrimitive(null);
            } else if (this.next.isKeywordTrue()) {
              this.advance();
              return new LiteralPrimitive(true);
            } else if (this.next.isKeywordFalse()) {
              this.advance();
              return new LiteralPrimitive(false);
            } else if (this.optionalCharacter($LBRACKET)) {
              var elements = this.parseExpressionList($RBRACKET);
              this.expectCharacter($RBRACKET);
              return new LiteralArray(elements);
            } else if (this.next.isCharacter($LBRACE)) {
              return this.parseLiteralMap();
            } else if (this.next.isIdentifier()) {
              return this.parseAccessMemberOrMethodCall(_implicitReceiver);
            } else if (this.next.isNumber()) {
              var value = this.next.toNumber();
              this.advance();
              return new LiteralPrimitive(value);
            } else if (this.next.isString()) {
              var value = this.next.toString();
              this.advance();
              return new LiteralPrimitive(value);
            } else if (this.index >= this.tokens.length) {
              this.error(("Unexpected end of expression: " + this.input));
            } else {
              this.error(("Unexpected token " + this.next));
            }
          },
          parseExpressionList: function(terminator) {
            var result = [];
            if (!this.next.isCharacter(terminator)) {
              do {
                ListWrapper.push(result, this.parseExpression());
              } while (this.optionalCharacter($COMMA));
            }
            return result;
          },
          parseLiteralMap: function() {
            var keys = [];
            var values = [];
            this.expectCharacter($LBRACE);
            if (!this.optionalCharacter($RBRACE)) {
              do {
                var key = this.expectIdentifierOrKeywordOrString();
                ListWrapper.push(keys, key);
                this.expectCharacter($COLON);
                ListWrapper.push(values, this.parseExpression());
              } while (this.optionalCharacter($COMMA));
              this.expectCharacter($RBRACE);
            }
            return new LiteralMap(keys, values);
          },
          parseAccessMemberOrMethodCall: function(receiver) {
            var id = this.expectIdentifierOrKeyword();
            if (this.optionalCharacter($LPAREN)) {
              var args = this.parseCallArguments();
              this.expectCharacter($RPAREN);
              var fn = this.reflector.method(id);
              return new MethodCall(receiver, id, fn, args);
            } else {
              var getter = this.reflector.getter(id);
              var setter = this.reflector.setter(id);
              var am = new AccessMember(receiver, id, getter, setter);
              if (this.optionalOperator("|")) {
                return this.parseInlinedPipe(am);
              } else {
                return am;
              }
            }
          },
          parseInlinedPipe: function(result) {
            do {
              if (this.parseAction) {
                this.error("Cannot have a pipe in an action expression");
              }
              var name = this.expectIdentifierOrKeyword();
              var args = ListWrapper.create();
              while (this.optionalCharacter($COLON)) {
                ListWrapper.push(args, this.parseExpression());
              }
              result = new Pipe(result, name, args, true);
            } while (this.optionalOperator("|"));
            return result;
          },
          parseCallArguments: function() {
            if (this.next.isCharacter($RPAREN))
              return [];
            var positionals = [];
            do {
              ListWrapper.push(positionals, this.parseExpression());
            } while (this.optionalCharacter($COMMA));
            return positionals;
          },
          expectTemplateBindingKey: function() {
            var result = '';
            var operatorFound = false;
            do {
              result += this.expectIdentifierOrKeywordOrString();
              operatorFound = this.optionalOperator('-');
              if (operatorFound) {
                result += '-';
              }
            } while (operatorFound);
            return result.toString();
          },
          parseTemplateBindings: function() {
            var bindings = [];
            while (this.index < this.tokens.length) {
              var keyIsVar = this.optionalKeywordVar();
              var key = this.expectTemplateBindingKey();
              this.optionalCharacter($COLON);
              var name = null;
              var expression = null;
              if (this.next !== EOF) {
                if (keyIsVar) {
                  if (this.optionalOperator("=")) {
                    name = this.expectTemplateBindingKey();
                  } else {
                    name = '\$implicit';
                  }
                } else if (!this.peekKeywordVar()) {
                  var start = this.inputIndex;
                  var ast = this.parsePipe();
                  var source = this.input.substring(start, this.inputIndex);
                  expression = new ASTWithSource(ast, source, this.location);
                }
              }
              ListWrapper.push(bindings, new TemplateBinding(key, keyIsVar, name, expression));
              if (!this.optionalCharacter($SEMICOLON)) {
                this.optionalCharacter($COMMA);
              }
              ;
            }
            return bindings;
          },
          error: function(message) {
            var index = arguments[1] !== (void 0) ? arguments[1] : null;
            if (isBlank(index))
              index = this.index;
            var location = (index < this.tokens.length) ? ("at column " + (this.tokens[index].index + 1) + " in") : "at the end of the expression";
            throw new BaseException(("Parser Error: " + message + " " + location + " [" + this.input + "] in " + this.location));
          }
        }, {});
      }());
      Object.defineProperty(_ParseAST, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.any], [List], [Reflector], [assert.type.boolean]];
        }});
      Object.defineProperty(_ParseAST.prototype.peek, "parameters", {get: function() {
          return [[int]];
        }});
      Object.defineProperty(_ParseAST.prototype.optionalCharacter, "parameters", {get: function() {
          return [[int]];
        }});
      Object.defineProperty(_ParseAST.prototype.expectCharacter, "parameters", {get: function() {
          return [[int]];
        }});
      Object.defineProperty(_ParseAST.prototype.optionalOperator, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(_ParseAST.prototype.expectOperator, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(_ParseAST.prototype.parseExpressionList, "parameters", {get: function() {
          return [[int]];
        }});
      Object.defineProperty(_ParseAST.prototype.error, "parameters", {get: function() {
          return [[assert.type.string], [int]];
        }});
    }
  };
});

System.register("angular2/src/change_detection/pipes/async_pipe", ["angular2/src/facade/async", "angular2/src/facade/lang", "./pipe", "../change_detector_ref"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/change_detection/pipes/async_pipe";
  var Observable,
      ObservableWrapper,
      isBlank,
      isPresent,
      Pipe,
      NO_CHANGE,
      ChangeDetectorRef,
      AsyncPipe,
      AsyncPipeFactory;
  return {
    setters: [function($__m) {
      Observable = $__m.Observable;
      ObservableWrapper = $__m.ObservableWrapper;
    }, function($__m) {
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
    }, function($__m) {
      Pipe = $__m.Pipe;
      NO_CHANGE = $__m.NO_CHANGE;
    }, function($__m) {
      ChangeDetectorRef = $__m.ChangeDetectorRef;
    }],
    execute: function() {
      AsyncPipe = (function($__super) {
        function AsyncPipe(ref) {
          $traceurRuntime.superConstructor(AsyncPipe).call(this);
          this._ref = ref;
          this._latestValue = null;
          this._latestReturnedValue = null;
          this._subscription = null;
          this._observable = null;
        }
        return ($traceurRuntime.createClass)(AsyncPipe, {
          supports: function(obs) {
            return ObservableWrapper.isObservable(obs);
          },
          onDestroy: function() {
            if (isPresent(this._subscription)) {
              this._dispose();
            }
            ;
          },
          transform: function(obs) {
            if (isBlank(this._subscription)) {
              this._subscribe(obs);
              return null;
            }
            if (obs !== this._observable) {
              this._dispose();
              return this.transform(obs);
            }
            if (this._latestValue === this._latestReturnedValue) {
              return NO_CHANGE;
            } else {
              this._latestReturnedValue = this._latestValue;
              return this._latestValue;
            }
          },
          _subscribe: function(obs) {
            var $__0 = this;
            this._observable = obs;
            this._subscription = ObservableWrapper.subscribe(obs, (function(value) {
              return $__0._updateLatestValue(value);
            }), (function(e) {
              throw e;
            }));
          },
          _dispose: function() {
            ObservableWrapper.dispose(this._subscription);
            this._latestValue = null;
            this._latestReturnedValue = null;
            this._subscription = null;
            this._observable = null;
          },
          _updateLatestValue: function(value) {
            this._latestValue = value;
            this._ref.requestCheck();
          }
        }, {}, $__super);
      }(Pipe));
      $__export("AsyncPipe", AsyncPipe);
      Object.defineProperty(AsyncPipe, "parameters", {get: function() {
          return [[ChangeDetectorRef]];
        }});
      Object.defineProperty(AsyncPipe.prototype.transform, "parameters", {get: function() {
          return [[Observable]];
        }});
      Object.defineProperty(AsyncPipe.prototype._subscribe, "parameters", {get: function() {
          return [[Observable]];
        }});
      Object.defineProperty(AsyncPipe.prototype._updateLatestValue, "parameters", {get: function() {
          return [[Object]];
        }});
      AsyncPipeFactory = (function() {
        function AsyncPipeFactory() {}
        return ($traceurRuntime.createClass)(AsyncPipeFactory, {
          supports: function(obs) {
            return ObservableWrapper.isObservable(obs);
          },
          create: function(cdRef) {
            return new AsyncPipe(cdRef);
          }
        }, {});
      }());
      $__export("AsyncPipeFactory", AsyncPipeFactory);
    }
  };
});

System.register("angular2/src/change_detection/pipes/iterable_changes", ["angular2/src/facade/collection", "angular2/src/facade/lang", "./pipe"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/change_detection/pipes/iterable_changes";
  var isListLikeIterable,
      iterateListLike,
      ListWrapper,
      MapWrapper,
      int,
      isBlank,
      isPresent,
      stringify,
      getMapKey,
      looseIdentical,
      NO_CHANGE,
      Pipe,
      IterableChangesFactory,
      IterableChanges,
      CollectionChangeRecord,
      _DuplicateItemRecordList,
      _DuplicateMap;
  return {
    setters: [function($__m) {
      isListLikeIterable = $__m.isListLikeIterable;
      iterateListLike = $__m.iterateListLike;
      ListWrapper = $__m.ListWrapper;
      MapWrapper = $__m.MapWrapper;
    }, function($__m) {
      int = $__m.int;
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
      stringify = $__m.stringify;
      getMapKey = $__m.getMapKey;
      looseIdentical = $__m.looseIdentical;
    }, function($__m) {
      NO_CHANGE = $__m.NO_CHANGE;
      Pipe = $__m.Pipe;
    }],
    execute: function() {
      IterableChangesFactory = (function() {
        function IterableChangesFactory() {}
        return ($traceurRuntime.createClass)(IterableChangesFactory, {
          supports: function(obj) {
            return IterableChanges.supportsObj(obj);
          },
          create: function(cdRef) {
            return new IterableChanges();
          }
        }, {});
      }());
      $__export("IterableChangesFactory", IterableChangesFactory);
      IterableChanges = (function($__super) {
        function IterableChanges() {
          $traceurRuntime.superConstructor(IterableChanges).call(this);
          this._collection = null;
          this._length = null;
          this._linkedRecords = null;
          this._unlinkedRecords = null;
          this._previousItHead = null;
          this._itHead = null;
          this._itTail = null;
          this._additionsHead = null;
          this._additionsTail = null;
          this._movesHead = null;
          this._movesTail = null;
          this._removalsHead = null;
          this._removalsTail = null;
        }
        return ($traceurRuntime.createClass)(IterableChanges, {
          supports: function(obj) {
            return IterableChanges.supportsObj(obj);
          },
          get collection() {
            return this._collection;
          },
          get length() {
            return this._length;
          },
          forEachItem: function(fn) {
            var record;
            for (record = this._itHead; record !== null; record = record._next) {
              fn(record);
            }
          },
          forEachPreviousItem: function(fn) {
            var record;
            for (record = this._previousItHead; record !== null; record = record._nextPrevious) {
              fn(record);
            }
          },
          forEachAddedItem: function(fn) {
            var record;
            for (record = this._additionsHead; record !== null; record = record._nextAdded) {
              fn(record);
            }
          },
          forEachMovedItem: function(fn) {
            var record;
            for (record = this._movesHead; record !== null; record = record._nextMoved) {
              fn(record);
            }
          },
          forEachRemovedItem: function(fn) {
            var record;
            for (record = this._removalsHead; record !== null; record = record._nextRemoved) {
              fn(record);
            }
          },
          transform: function(collection) {
            if (this.check(collection)) {
              return this;
            } else {
              return NO_CHANGE;
            }
          },
          check: function(collection) {
            var $__0 = this;
            this._reset();
            var record = this._itHead;
            var mayBeDirty = false;
            var index;
            var item;
            if (ListWrapper.isList(collection)) {
              var list = collection;
              this._length = collection.length;
              for (index = 0; index < this._length; index++) {
                item = list[index];
                if (record === null || !looseIdentical(record.item, item)) {
                  record = this._mismatch(record, item, index);
                  mayBeDirty = true;
                } else if (mayBeDirty) {
                  record = this._verifyReinsertion(record, item, index);
                }
                record = record._next;
              }
            } else {
              index = 0;
              iterateListLike(collection, (function(item) {
                if (record === null || !looseIdentical(record.item, item)) {
                  record = $__0._mismatch(record, item, index);
                  mayBeDirty = true;
                } else if (mayBeDirty) {
                  record = $__0._verifyReinsertion(record, item, index);
                }
                record = record._next;
                index++;
              }));
              this._length = index;
            }
            this._truncate(record);
            this._collection = collection;
            return this.isDirty;
          },
          get isDirty() {
            return this._additionsHead !== null || this._movesHead !== null || this._removalsHead !== null;
          },
          _reset: function() {
            if (this.isDirty) {
              var record;
              var nextRecord;
              for (record = this._previousItHead = this._itHead; record !== null; record = record._next) {
                record._nextPrevious = record._next;
              }
              for (record = this._additionsHead; record !== null; record = record._nextAdded) {
                record.previousIndex = record.currentIndex;
              }
              this._additionsHead = this._additionsTail = null;
              for (record = this._movesHead; record !== null; record = nextRecord) {
                record.previousIndex = record.currentIndex;
                nextRecord = record._nextMoved;
              }
              this._movesHead = this._movesTail = null;
              this._removalsHead = this._removalsTail = null;
            }
          },
          _mismatch: function(record, item, index) {
            var previousRecord;
            if (record === null) {
              previousRecord = this._itTail;
            } else {
              previousRecord = record._prev;
              this._remove(record);
            }
            record = this._linkedRecords === null ? null : this._linkedRecords.get(item, index);
            if (record !== null) {
              this._moveAfter(record, previousRecord, index);
            } else {
              record = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(item);
              if (record !== null) {
                this._reinsertAfter(record, previousRecord, index);
              } else {
                record = this._addAfter(new CollectionChangeRecord(item), previousRecord, index);
              }
            }
            return record;
          },
          _verifyReinsertion: function(record, item, index) {
            var reinsertRecord = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(item);
            if (reinsertRecord !== null) {
              record = this._reinsertAfter(reinsertRecord, record._prev, index);
            } else if (record.currentIndex != index) {
              record.currentIndex = index;
              this._addToMoves(record, index);
            }
            return record;
          },
          _truncate: function(record) {
            while (record !== null) {
              var nextRecord = record._next;
              this._addToRemovals(this._unlink(record));
              record = nextRecord;
            }
            if (this._unlinkedRecords !== null) {
              this._unlinkedRecords.clear();
            }
            if (this._additionsTail !== null) {
              this._additionsTail._nextAdded = null;
            }
            if (this._movesTail !== null) {
              this._movesTail._nextMoved = null;
            }
            if (this._itTail !== null) {
              this._itTail._next = null;
            }
            if (this._removalsTail !== null) {
              this._removalsTail._nextRemoved = null;
            }
          },
          _reinsertAfter: function(record, prevRecord, index) {
            if (this._unlinkedRecords !== null) {
              this._unlinkedRecords.remove(record);
            }
            var prev = record._prevRemoved;
            var next = record._nextRemoved;
            if (prev === null) {
              this._removalsHead = next;
            } else {
              prev._nextRemoved = next;
            }
            if (next === null) {
              this._removalsTail = prev;
            } else {
              next._prevRemoved = prev;
            }
            this._insertAfter(record, prevRecord, index);
            this._addToMoves(record, index);
            return record;
          },
          _moveAfter: function(record, prevRecord, index) {
            this._unlink(record);
            this._insertAfter(record, prevRecord, index);
            this._addToMoves(record, index);
            return record;
          },
          _addAfter: function(record, prevRecord, index) {
            this._insertAfter(record, prevRecord, index);
            if (this._additionsTail === null) {
              this._additionsTail = this._additionsHead = record;
            } else {
              this._additionsTail = this._additionsTail._nextAdded = record;
            }
            return record;
          },
          _insertAfter: function(record, prevRecord, index) {
            var next = prevRecord === null ? this._itHead : prevRecord._next;
            record._next = next;
            record._prev = prevRecord;
            if (next === null) {
              this._itTail = record;
            } else {
              next._prev = record;
            }
            if (prevRecord === null) {
              this._itHead = record;
            } else {
              prevRecord._next = record;
            }
            if (this._linkedRecords === null) {
              this._linkedRecords = new _DuplicateMap();
            }
            this._linkedRecords.put(record);
            record.currentIndex = index;
            return record;
          },
          _remove: function(record) {
            return this._addToRemovals(this._unlink(record));
          },
          _unlink: function(record) {
            if (this._linkedRecords !== null) {
              this._linkedRecords.remove(record);
            }
            var prev = record._prev;
            var next = record._next;
            if (prev === null) {
              this._itHead = next;
            } else {
              prev._next = next;
            }
            if (next === null) {
              this._itTail = prev;
            } else {
              next._prev = prev;
            }
            return record;
          },
          _addToMoves: function(record, toIndex) {
            if (record.previousIndex === toIndex) {
              return record;
            }
            if (this._movesTail === null) {
              this._movesTail = this._movesHead = record;
            } else {
              this._movesTail = this._movesTail._nextMoved = record;
            }
            return record;
          },
          _addToRemovals: function(record) {
            if (this._unlinkedRecords === null) {
              this._unlinkedRecords = new _DuplicateMap();
            }
            this._unlinkedRecords.put(record);
            record.currentIndex = null;
            record._nextRemoved = null;
            if (this._removalsTail === null) {
              this._removalsTail = this._removalsHead = record;
              record._prevRemoved = null;
            } else {
              record._prevRemoved = this._removalsTail;
              this._removalsTail = this._removalsTail._nextRemoved = record;
            }
            return record;
          },
          toString: function() {
            var record;
            var list = [];
            for (record = this._itHead; record !== null; record = record._next) {
              ListWrapper.push(list, record);
            }
            var previous = [];
            for (record = this._previousItHead; record !== null; record = record._nextPrevious) {
              ListWrapper.push(previous, record);
            }
            var additions = [];
            for (record = this._additionsHead; record !== null; record = record._nextAdded) {
              ListWrapper.push(additions, record);
            }
            var moves = [];
            for (record = this._movesHead; record !== null; record = record._nextMoved) {
              ListWrapper.push(moves, record);
            }
            var removals = [];
            for (record = this._removalsHead; record !== null; record = record._nextRemoved) {
              ListWrapper.push(removals, record);
            }
            return "collection: " + list.join(', ') + "\n" + "previous: " + previous.join(', ') + "\n" + "additions: " + additions.join(', ') + "\n" + "moves: " + moves.join(', ') + "\n" + "removals: " + removals.join(', ') + "\n";
          }
        }, {supportsObj: function(obj) {
            return isListLikeIterable(obj);
          }}, $__super);
      }(Pipe));
      $__export("IterableChanges", IterableChanges);
      Object.defineProperty(IterableChanges.prototype.forEachItem, "parameters", {get: function() {
          return [[Function]];
        }});
      Object.defineProperty(IterableChanges.prototype.forEachPreviousItem, "parameters", {get: function() {
          return [[Function]];
        }});
      Object.defineProperty(IterableChanges.prototype.forEachAddedItem, "parameters", {get: function() {
          return [[Function]];
        }});
      Object.defineProperty(IterableChanges.prototype.forEachMovedItem, "parameters", {get: function() {
          return [[Function]];
        }});
      Object.defineProperty(IterableChanges.prototype.forEachRemovedItem, "parameters", {get: function() {
          return [[Function]];
        }});
      Object.defineProperty(IterableChanges.prototype._mismatch, "parameters", {get: function() {
          return [[CollectionChangeRecord], [], [int]];
        }});
      Object.defineProperty(IterableChanges.prototype._verifyReinsertion, "parameters", {get: function() {
          return [[CollectionChangeRecord], [], [int]];
        }});
      Object.defineProperty(IterableChanges.prototype._truncate, "parameters", {get: function() {
          return [[CollectionChangeRecord]];
        }});
      Object.defineProperty(IterableChanges.prototype._reinsertAfter, "parameters", {get: function() {
          return [[CollectionChangeRecord], [CollectionChangeRecord], [int]];
        }});
      Object.defineProperty(IterableChanges.prototype._moveAfter, "parameters", {get: function() {
          return [[CollectionChangeRecord], [CollectionChangeRecord], [int]];
        }});
      Object.defineProperty(IterableChanges.prototype._addAfter, "parameters", {get: function() {
          return [[CollectionChangeRecord], [CollectionChangeRecord], [int]];
        }});
      Object.defineProperty(IterableChanges.prototype._insertAfter, "parameters", {get: function() {
          return [[CollectionChangeRecord], [CollectionChangeRecord], [int]];
        }});
      Object.defineProperty(IterableChanges.prototype._remove, "parameters", {get: function() {
          return [[CollectionChangeRecord]];
        }});
      Object.defineProperty(IterableChanges.prototype._unlink, "parameters", {get: function() {
          return [[CollectionChangeRecord]];
        }});
      Object.defineProperty(IterableChanges.prototype._addToMoves, "parameters", {get: function() {
          return [[CollectionChangeRecord], [int]];
        }});
      Object.defineProperty(IterableChanges.prototype._addToRemovals, "parameters", {get: function() {
          return [[CollectionChangeRecord]];
        }});
      CollectionChangeRecord = (function() {
        function CollectionChangeRecord(item) {
          this.currentIndex = null;
          this.previousIndex = null;
          this.item = item;
          this._nextPrevious = null;
          this._prev = null;
          this._next = null;
          this._prevDup = null;
          this._nextDup = null;
          this._prevRemoved = null;
          this._nextRemoved = null;
          this._nextAdded = null;
          this._nextMoved = null;
        }
        return ($traceurRuntime.createClass)(CollectionChangeRecord, {toString: function() {
            return this.previousIndex === this.currentIndex ? stringify(this.item) : stringify(this.item) + '[' + stringify(this.previousIndex) + '->' + stringify(this.currentIndex) + ']';
          }}, {});
      }());
      $__export("CollectionChangeRecord", CollectionChangeRecord);
      _DuplicateItemRecordList = (function() {
        function _DuplicateItemRecordList() {
          this._head = null;
          this._tail = null;
        }
        return ($traceurRuntime.createClass)(_DuplicateItemRecordList, {
          add: function(record) {
            if (this._head === null) {
              this._head = this._tail = record;
              record._nextDup = null;
              record._prevDup = null;
            } else {
              this._tail._nextDup = record;
              record._prevDup = this._tail;
              record._nextDup = null;
              this._tail = record;
            }
          },
          get: function(item, afterIndex) {
            var record;
            for (record = this._head; record !== null; record = record._nextDup) {
              if ((afterIndex === null || afterIndex < record.currentIndex) && looseIdentical(record.item, item)) {
                return record;
              }
            }
            return null;
          },
          remove: function(record) {
            var prev = record._prevDup;
            var next = record._nextDup;
            if (prev === null) {
              this._head = next;
            } else {
              prev._nextDup = next;
            }
            if (next === null) {
              this._tail = prev;
            } else {
              next._prevDup = prev;
            }
            return this._head === null;
          }
        }, {});
      }());
      Object.defineProperty(_DuplicateItemRecordList.prototype.add, "parameters", {get: function() {
          return [[CollectionChangeRecord]];
        }});
      Object.defineProperty(_DuplicateItemRecordList.prototype.get, "parameters", {get: function() {
          return [[], [int]];
        }});
      Object.defineProperty(_DuplicateItemRecordList.prototype.remove, "parameters", {get: function() {
          return [[CollectionChangeRecord]];
        }});
      _DuplicateMap = (function() {
        function _DuplicateMap() {
          this.map = MapWrapper.create();
        }
        return ($traceurRuntime.createClass)(_DuplicateMap, {
          put: function(record) {
            var key = getMapKey(record.item);
            var duplicates = MapWrapper.get(this.map, key);
            if (!isPresent(duplicates)) {
              duplicates = new _DuplicateItemRecordList();
              MapWrapper.set(this.map, key, duplicates);
            }
            duplicates.add(record);
          },
          get: function(value) {
            var afterIndex = arguments[1] !== (void 0) ? arguments[1] : null;
            var key = getMapKey(value);
            var recordList = MapWrapper.get(this.map, key);
            return isBlank(recordList) ? null : recordList.get(value, afterIndex);
          },
          remove: function(record) {
            var key = getMapKey(record.item);
            var recordList = MapWrapper.get(this.map, key);
            if (recordList.remove(record)) {
              MapWrapper.delete(this.map, key);
            }
            return record;
          },
          get isEmpty() {
            return MapWrapper.size(this.map) === 0;
          },
          clear: function() {
            MapWrapper.clear(this.map);
          },
          toString: function() {
            return '_DuplicateMap(' + stringify(this.map) + ')';
          }
        }, {});
      }());
      Object.defineProperty(_DuplicateMap.prototype.put, "parameters", {get: function() {
          return [[CollectionChangeRecord]];
        }});
      Object.defineProperty(_DuplicateMap.prototype.remove, "parameters", {get: function() {
          return [[CollectionChangeRecord]];
        }});
    }
  };
});

System.register("angular2/src/change_detection/pipes/keyvalue_changes", ["angular2/src/facade/collection", "angular2/src/facade/lang", "./pipe"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/change_detection/pipes/keyvalue_changes";
  var ListWrapper,
      MapWrapper,
      StringMapWrapper,
      stringify,
      looseIdentical,
      isJsObject,
      NO_CHANGE,
      Pipe,
      KeyValueChangesFactory,
      KeyValueChanges,
      KVChangeRecord;
  return {
    setters: [function($__m) {
      ListWrapper = $__m.ListWrapper;
      MapWrapper = $__m.MapWrapper;
      StringMapWrapper = $__m.StringMapWrapper;
    }, function($__m) {
      stringify = $__m.stringify;
      looseIdentical = $__m.looseIdentical;
      isJsObject = $__m.isJsObject;
    }, function($__m) {
      NO_CHANGE = $__m.NO_CHANGE;
      Pipe = $__m.Pipe;
    }],
    execute: function() {
      KeyValueChangesFactory = (function() {
        function KeyValueChangesFactory() {}
        return ($traceurRuntime.createClass)(KeyValueChangesFactory, {
          supports: function(obj) {
            return KeyValueChanges.supportsObj(obj);
          },
          create: function(cdRef) {
            return new KeyValueChanges();
          }
        }, {});
      }());
      $__export("KeyValueChangesFactory", KeyValueChangesFactory);
      KeyValueChanges = (function($__super) {
        function KeyValueChanges() {
          $traceurRuntime.superConstructor(KeyValueChanges).call(this);
          this._records = MapWrapper.create();
          this._mapHead = null;
          this._previousMapHead = null;
          this._changesHead = null;
          this._changesTail = null;
          this._additionsHead = null;
          this._additionsTail = null;
          this._removalsHead = null;
          this._removalsTail = null;
        }
        return ($traceurRuntime.createClass)(KeyValueChanges, {
          supports: function(obj) {
            return KeyValueChanges.supportsObj(obj);
          },
          transform: function(map) {
            if (this.check(map)) {
              return this;
            } else {
              return NO_CHANGE;
            }
          },
          get isDirty() {
            return this._additionsHead !== null || this._changesHead !== null || this._removalsHead !== null;
          },
          forEachItem: function(fn) {
            var record;
            for (record = this._mapHead; record !== null; record = record._next) {
              fn(record);
            }
          },
          forEachPreviousItem: function(fn) {
            var record;
            for (record = this._previousMapHead; record !== null; record = record._nextPrevious) {
              fn(record);
            }
          },
          forEachChangedItem: function(fn) {
            var record;
            for (record = this._changesHead; record !== null; record = record._nextChanged) {
              fn(record);
            }
          },
          forEachAddedItem: function(fn) {
            var record;
            for (record = this._additionsHead; record !== null; record = record._nextAdded) {
              fn(record);
            }
          },
          forEachRemovedItem: function(fn) {
            var record;
            for (record = this._removalsHead; record !== null; record = record._nextRemoved) {
              fn(record);
            }
          },
          check: function(map) {
            var $__0 = this;
            this._reset();
            var records = this._records;
            var oldSeqRecord = this._mapHead;
            var lastOldSeqRecord = null;
            var lastNewSeqRecord = null;
            var seqChanged = false;
            this._forEach(map, (function(value, key) {
              var newSeqRecord;
              if (oldSeqRecord !== null && key === oldSeqRecord.key) {
                newSeqRecord = oldSeqRecord;
                if (!looseIdentical(value, oldSeqRecord.currentValue)) {
                  oldSeqRecord.previousValue = oldSeqRecord.currentValue;
                  oldSeqRecord.currentValue = value;
                  $__0._addToChanges(oldSeqRecord);
                }
              } else {
                seqChanged = true;
                if (oldSeqRecord !== null) {
                  oldSeqRecord._next = null;
                  $__0._removeFromSeq(lastOldSeqRecord, oldSeqRecord);
                  $__0._addToRemovals(oldSeqRecord);
                }
                if (MapWrapper.contains(records, key)) {
                  newSeqRecord = MapWrapper.get(records, key);
                } else {
                  newSeqRecord = new KVChangeRecord(key);
                  MapWrapper.set(records, key, newSeqRecord);
                  newSeqRecord.currentValue = value;
                  $__0._addToAdditions(newSeqRecord);
                }
              }
              if (seqChanged) {
                if ($__0._isInRemovals(newSeqRecord)) {
                  $__0._removeFromRemovals(newSeqRecord);
                }
                if (lastNewSeqRecord == null) {
                  $__0._mapHead = newSeqRecord;
                } else {
                  lastNewSeqRecord._next = newSeqRecord;
                }
              }
              lastOldSeqRecord = oldSeqRecord;
              lastNewSeqRecord = newSeqRecord;
              oldSeqRecord = oldSeqRecord === null ? null : oldSeqRecord._next;
            }));
            this._truncate(lastOldSeqRecord, oldSeqRecord);
            return this.isDirty;
          },
          _reset: function() {
            if (this.isDirty) {
              var record;
              for (record = this._previousMapHead = this._mapHead; record !== null; record = record._next) {
                record._nextPrevious = record._next;
              }
              for (record = this._changesHead; record !== null; record = record._nextChanged) {
                record.previousValue = record.currentValue;
              }
              for (record = this._additionsHead; record != null; record = record._nextAdded) {
                record.previousValue = record.currentValue;
              }
              this._changesHead = this._changesTail = null;
              this._additionsHead = this._additionsTail = null;
              this._removalsHead = this._removalsTail = null;
            }
          },
          _truncate: function(lastRecord, record) {
            while (record !== null) {
              if (lastRecord === null) {
                this._mapHead = null;
              } else {
                lastRecord._next = null;
              }
              var nextRecord = record._next;
              this._addToRemovals(record);
              lastRecord = record;
              record = nextRecord;
            }
            for (var rec = this._removalsHead; rec !== null; rec = rec._nextRemoved) {
              rec.previousValue = rec.currentValue;
              rec.currentValue = null;
              MapWrapper.delete(this._records, rec.key);
            }
          },
          _isInRemovals: function(record) {
            return record === this._removalsHead || record._nextRemoved !== null || record._prevRemoved !== null;
          },
          _addToRemovals: function(record) {
            if (this._removalsHead === null) {
              this._removalsHead = this._removalsTail = record;
            } else {
              this._removalsTail._nextRemoved = record;
              record._prevRemoved = this._removalsTail;
              this._removalsTail = record;
            }
          },
          _removeFromSeq: function(prev, record) {
            var next = record._next;
            if (prev === null) {
              this._mapHead = next;
            } else {
              prev._next = next;
            }
          },
          _removeFromRemovals: function(record) {
            var prev = record._prevRemoved;
            var next = record._nextRemoved;
            if (prev === null) {
              this._removalsHead = next;
            } else {
              prev._nextRemoved = next;
            }
            if (next === null) {
              this._removalsTail = prev;
            } else {
              next._prevRemoved = prev;
            }
            record._prevRemoved = record._nextRemoved = null;
          },
          _addToAdditions: function(record) {
            if (this._additionsHead === null) {
              this._additionsHead = this._additionsTail = record;
            } else {
              this._additionsTail._nextAdded = record;
              this._additionsTail = record;
            }
          },
          _addToChanges: function(record) {
            if (this._changesHead === null) {
              this._changesHead = this._changesTail = record;
            } else {
              this._changesTail._nextChanged = record;
              this._changesTail = record;
            }
          },
          toString: function() {
            var items = [];
            var previous = [];
            var changes = [];
            var additions = [];
            var removals = [];
            var record;
            for (record = this._mapHead; record !== null; record = record._next) {
              ListWrapper.push(items, stringify(record));
            }
            for (record = this._previousMapHead; record !== null; record = record._nextPrevious) {
              ListWrapper.push(previous, stringify(record));
            }
            for (record = this._changesHead; record !== null; record = record._nextChanged) {
              ListWrapper.push(changes, stringify(record));
            }
            for (record = this._additionsHead; record !== null; record = record._nextAdded) {
              ListWrapper.push(additions, stringify(record));
            }
            for (record = this._removalsHead; record !== null; record = record._nextRemoved) {
              ListWrapper.push(removals, stringify(record));
            }
            return "map: " + items.join(', ') + "\n" + "previous: " + previous.join(', ') + "\n" + "additions: " + additions.join(', ') + "\n" + "changes: " + changes.join(', ') + "\n" + "removals: " + removals.join(', ') + "\n";
          },
          _forEach: function(obj, fn) {
            if (obj instanceof Map) {
              MapWrapper.forEach(obj, fn);
            } else {
              StringMapWrapper.forEach(obj, fn);
            }
          }
        }, {supportsObj: function(obj) {
            return obj instanceof Map || isJsObject(obj);
          }}, $__super);
      }(Pipe));
      $__export("KeyValueChanges", KeyValueChanges);
      Object.defineProperty(KeyValueChanges.prototype.forEachItem, "parameters", {get: function() {
          return [[Function]];
        }});
      Object.defineProperty(KeyValueChanges.prototype.forEachPreviousItem, "parameters", {get: function() {
          return [[Function]];
        }});
      Object.defineProperty(KeyValueChanges.prototype.forEachChangedItem, "parameters", {get: function() {
          return [[Function]];
        }});
      Object.defineProperty(KeyValueChanges.prototype.forEachAddedItem, "parameters", {get: function() {
          return [[Function]];
        }});
      Object.defineProperty(KeyValueChanges.prototype.forEachRemovedItem, "parameters", {get: function() {
          return [[Function]];
        }});
      Object.defineProperty(KeyValueChanges.prototype._truncate, "parameters", {get: function() {
          return [[KVChangeRecord], [KVChangeRecord]];
        }});
      Object.defineProperty(KeyValueChanges.prototype._isInRemovals, "parameters", {get: function() {
          return [[KVChangeRecord]];
        }});
      Object.defineProperty(KeyValueChanges.prototype._addToRemovals, "parameters", {get: function() {
          return [[KVChangeRecord]];
        }});
      Object.defineProperty(KeyValueChanges.prototype._removeFromSeq, "parameters", {get: function() {
          return [[KVChangeRecord], [KVChangeRecord]];
        }});
      Object.defineProperty(KeyValueChanges.prototype._removeFromRemovals, "parameters", {get: function() {
          return [[KVChangeRecord]];
        }});
      Object.defineProperty(KeyValueChanges.prototype._addToAdditions, "parameters", {get: function() {
          return [[KVChangeRecord]];
        }});
      Object.defineProperty(KeyValueChanges.prototype._addToChanges, "parameters", {get: function() {
          return [[KVChangeRecord]];
        }});
      Object.defineProperty(KeyValueChanges.prototype._forEach, "parameters", {get: function() {
          return [[], [Function]];
        }});
      KVChangeRecord = (function() {
        function KVChangeRecord(key) {
          this.key = key;
          this.previousValue = null;
          this.currentValue = null;
          this._nextPrevious = null;
          this._next = null;
          this._nextAdded = null;
          this._nextRemoved = null;
          this._prevRemoved = null;
          this._nextChanged = null;
        }
        return ($traceurRuntime.createClass)(KVChangeRecord, {toString: function() {
            return looseIdentical(this.previousValue, this.currentValue) ? stringify(this.key) : (stringify(this.key) + '[' + stringify(this.previousValue) + '->' + stringify(this.currentValue) + ']');
          }}, {});
      }());
      $__export("KVChangeRecord", KVChangeRecord);
    }
  };
});

System.register("angular2/src/change_detection/pipes/null_pipe", ["angular2/src/facade/lang", "./pipe"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/change_detection/pipes/null_pipe";
  var isBlank,
      Pipe,
      NO_CHANGE,
      NullPipeFactory,
      NullPipe;
  return {
    setters: [function($__m) {
      isBlank = $__m.isBlank;
    }, function($__m) {
      Pipe = $__m.Pipe;
      NO_CHANGE = $__m.NO_CHANGE;
    }],
    execute: function() {
      NullPipeFactory = (function() {
        function NullPipeFactory() {}
        return ($traceurRuntime.createClass)(NullPipeFactory, {
          supports: function(obj) {
            return NullPipe.supportsObj(obj);
          },
          create: function(cdRef) {
            return new NullPipe();
          }
        }, {});
      }());
      $__export("NullPipeFactory", NullPipeFactory);
      NullPipe = (function($__super) {
        function NullPipe() {
          $traceurRuntime.superConstructor(NullPipe).call(this);
          this.called = false;
        }
        return ($traceurRuntime.createClass)(NullPipe, {
          supports: function(obj) {
            return NullPipe.supportsObj(obj);
          },
          transform: function(value) {
            if (!this.called) {
              this.called = true;
              return null;
            } else {
              return NO_CHANGE;
            }
          }
        }, {supportsObj: function(obj) {
            return isBlank(obj);
          }}, $__super);
      }(Pipe));
      $__export("NullPipe", NullPipe);
    }
  };
});

System.register("angular2/src/change_detection/pipes/pipe", [], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/change_detection/pipes/pipe";
  var NO_CHANGE,
      Pipe;
  return {
    setters: [],
    execute: function() {
      NO_CHANGE = new Object();
      $__export("NO_CHANGE", NO_CHANGE);
      Pipe = (function() {
        function Pipe() {}
        return ($traceurRuntime.createClass)(Pipe, {
          supports: function(obj) {
            return false;
          },
          onDestroy: function() {},
          transform: function(value) {
            return null;
          }
        }, {});
      }());
      $__export("Pipe", Pipe);
      Object.defineProperty(Pipe.prototype.transform, "parameters", {get: function() {
          return [[assert.type.any]];
        }});
    }
  };
});

System.register("angular2/src/change_detection/pipes/pipe_registry", ["angular2/src/facade/collection", "angular2/src/facade/lang", "./pipe", "angular2/di", "../change_detector_ref"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/change_detection/pipes/pipe_registry";
  var List,
      ListWrapper,
      isBlank,
      isPresent,
      BaseException,
      CONST,
      Pipe,
      Injectable,
      ChangeDetectorRef,
      PipeRegistry;
  return {
    setters: [function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
      BaseException = $__m.BaseException;
      CONST = $__m.CONST;
    }, function($__m) {
      Pipe = $__m.Pipe;
    }, function($__m) {
      Injectable = $__m.Injectable;
    }, function($__m) {
      ChangeDetectorRef = $__m.ChangeDetectorRef;
    }],
    execute: function() {
      PipeRegistry = (function() {
        function PipeRegistry(config) {
          this.config = config;
        }
        return ($traceurRuntime.createClass)(PipeRegistry, {get: function(type, obj, cdRef) {
            var listOfConfigs = this.config[type];
            if (isBlank(listOfConfigs)) {
              throw new BaseException(("Cannot find a pipe for type '" + type + "' object '" + obj + "'"));
            }
            var matchingConfig = ListWrapper.find(listOfConfigs, (function(pipeConfig) {
              return pipeConfig.supports(obj);
            }));
            if (isBlank(matchingConfig)) {
              throw new BaseException(("Cannot find a pipe for type '" + type + "' object '" + obj + "'"));
            }
            return matchingConfig.create(cdRef);
          }}, {});
      }());
      $__export("PipeRegistry", PipeRegistry);
      Object.defineProperty(PipeRegistry, "annotations", {get: function() {
          return [new Injectable()];
        }});
      Object.defineProperty(PipeRegistry.prototype.get, "parameters", {get: function() {
          return [[assert.type.string], [], [ChangeDetectorRef]];
        }});
    }
  };
});

System.register("angular2/src/core/annotations/annotations", ["angular2/src/facade/lang", "angular2/src/facade/collection", "angular2/di", "angular2/change_detection"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/annotations/annotations";
  var ABSTRACT,
      CONST,
      normalizeBlank,
      isPresent,
      ListWrapper,
      List,
      Injectable,
      DEFAULT,
      Directive,
      Component,
      DynamicComponent,
      Decorator,
      Viewport,
      onDestroy,
      onChange,
      onAllChangesDone;
  return {
    setters: [function($__m) {
      ABSTRACT = $__m.ABSTRACT;
      CONST = $__m.CONST;
      normalizeBlank = $__m.normalizeBlank;
      isPresent = $__m.isPresent;
    }, function($__m) {
      ListWrapper = $__m.ListWrapper;
      List = $__m.List;
    }, function($__m) {
      Injectable = $__m.Injectable;
    }, function($__m) {
      DEFAULT = $__m.DEFAULT;
    }],
    execute: function() {
      Directive = (function($__super) {
        function Directive() {
          var $__1 = arguments[0] !== (void 0) ? arguments[0] : {},
              selector = $__1.selector,
              properties = $__1.properties,
              events = $__1.events,
              hostListeners = $__1.hostListeners,
              lifecycle = $__1.lifecycle;
          $traceurRuntime.superConstructor(Directive).call(this);
          this.selector = selector;
          this.properties = properties;
          this.events = events;
          this.hostListeners = hostListeners;
          this.lifecycle = lifecycle;
        }
        return ($traceurRuntime.createClass)(Directive, {hasLifecycleHook: function(hook) {
            return isPresent(this.lifecycle) ? ListWrapper.contains(this.lifecycle, hook) : false;
          }}, {}, $__super);
      }(Injectable));
      $__export("Directive", Directive);
      Object.defineProperty(Directive, "annotations", {get: function() {
          return [new ABSTRACT(), new CONST()];
        }});
      Object.defineProperty(Directive.prototype.hasLifecycleHook, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Component = (function($__super) {
        function Component() {
          var $__2;
          var $__1 = arguments[0] !== (void 0) ? arguments[0] : {},
              selector = $__1.selector,
              properties = $__1.properties,
              events = $__1.events,
              hostListeners = $__1.hostListeners,
              injectables = $__1.injectables,
              lifecycle = $__1.lifecycle,
              changeDetection = ($__2 = $__1.changeDetection) === void 0 ? DEFAULT : $__2;
          $traceurRuntime.superConstructor(Component).call(this, {
            selector: selector,
            properties: properties,
            events: events,
            hostListeners: hostListeners,
            lifecycle: lifecycle
          });
          this.changeDetection = changeDetection;
          this.injectables = injectables;
        }
        return ($traceurRuntime.createClass)(Component, {}, {}, $__super);
      }(Directive));
      $__export("Component", Component);
      Object.defineProperty(Component, "annotations", {get: function() {
          return [new CONST()];
        }});
      DynamicComponent = (function($__super) {
        function DynamicComponent() {
          var $__1 = arguments[0] !== (void 0) ? arguments[0] : {},
              selector = $__1.selector,
              properties = $__1.properties,
              events = $__1.events,
              hostListeners = $__1.hostListeners,
              injectables = $__1.injectables,
              lifecycle = $__1.lifecycle;
          $traceurRuntime.superConstructor(DynamicComponent).call(this, {
            selector: selector,
            properties: properties,
            events: events,
            hostListeners: hostListeners,
            lifecycle: lifecycle
          });
          this.injectables = injectables;
        }
        return ($traceurRuntime.createClass)(DynamicComponent, {}, {}, $__super);
      }(Directive));
      $__export("DynamicComponent", DynamicComponent);
      Object.defineProperty(DynamicComponent, "annotations", {get: function() {
          return [new CONST()];
        }});
      Decorator = (function($__super) {
        function Decorator() {
          var $__2;
          var $__1 = arguments[0] !== (void 0) ? arguments[0] : {},
              selector = $__1.selector,
              properties = $__1.properties,
              events = $__1.events,
              hostListeners = $__1.hostListeners,
              lifecycle = $__1.lifecycle,
              compileChildren = ($__2 = $__1.compileChildren) === void 0 ? true : $__2;
          $traceurRuntime.superConstructor(Decorator).call(this, {
            selector: selector,
            properties: properties,
            events: events,
            hostListeners: hostListeners,
            lifecycle: lifecycle
          });
          this.compileChildren = compileChildren;
        }
        return ($traceurRuntime.createClass)(Decorator, {}, {}, $__super);
      }(Directive));
      $__export("Decorator", Decorator);
      Object.defineProperty(Decorator, "annotations", {get: function() {
          return [new CONST()];
        }});
      Viewport = (function($__super) {
        function Viewport() {
          var $__1 = arguments[0] !== (void 0) ? arguments[0] : {},
              selector = $__1.selector,
              properties = $__1.properties,
              events = $__1.events,
              hostListeners = $__1.hostListeners,
              lifecycle = $__1.lifecycle;
          $traceurRuntime.superConstructor(Viewport).call(this, {
            selector: selector,
            properties: properties,
            events: events,
            hostListeners: hostListeners,
            lifecycle: lifecycle
          });
        }
        return ($traceurRuntime.createClass)(Viewport, {}, {}, $__super);
      }(Directive));
      $__export("Viewport", Viewport);
      Object.defineProperty(Viewport, "annotations", {get: function() {
          return [new CONST()];
        }});
      onDestroy = "onDestroy";
      $__export("onDestroy", onDestroy);
      onChange = "onChange";
      $__export("onChange", onChange);
      onAllChangesDone = "onAllChangesDone";
      $__export("onAllChangesDone", onAllChangesDone);
    }
  };
});

System.register("angular2/src/core/annotations/di", ["angular2/src/facade/lang", "angular2/di"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/annotations/di";
  var CONST,
      DependencyAnnotation,
      PropertySetter,
      Attribute,
      Query;
  return {
    setters: [function($__m) {
      CONST = $__m.CONST;
    }, function($__m) {
      DependencyAnnotation = $__m.DependencyAnnotation;
    }],
    execute: function() {
      PropertySetter = (function($__super) {
        function PropertySetter(propName) {
          $traceurRuntime.superConstructor(PropertySetter).call(this);
          this.propName = propName;
        }
        return ($traceurRuntime.createClass)(PropertySetter, {get token() {
            return Function;
          }}, {}, $__super);
      }(DependencyAnnotation));
      $__export("PropertySetter", PropertySetter);
      Object.defineProperty(PropertySetter, "annotations", {get: function() {
          return [new CONST()];
        }});
      Attribute = (function($__super) {
        function Attribute(attributeName) {
          $traceurRuntime.superConstructor(Attribute).call(this);
          this.attributeName = attributeName;
        }
        return ($traceurRuntime.createClass)(Attribute, {get token() {
            return this;
          }}, {}, $__super);
      }(DependencyAnnotation));
      $__export("Attribute", Attribute);
      Object.defineProperty(Attribute, "annotations", {get: function() {
          return [new CONST()];
        }});
      Query = (function($__super) {
        function Query(directive) {
          $traceurRuntime.superConstructor(Query).call(this);
          this.directive = directive;
        }
        return ($traceurRuntime.createClass)(Query, {}, {}, $__super);
      }(DependencyAnnotation));
      $__export("Query", Query);
      Object.defineProperty(Query, "annotations", {get: function() {
          return [new CONST()];
        }});
    }
  };
});

System.register("angular2/src/core/annotations/view", ["angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/annotations/view";
  var ABSTRACT,
      CONST,
      Type,
      View;
  return {
    setters: [function($__m) {
      ABSTRACT = $__m.ABSTRACT;
      CONST = $__m.CONST;
      Type = $__m.Type;
    }],
    execute: function() {
      View = (function() {
        function View($__1) {
          var $__2 = $__1,
              templateUrl = $__2.templateUrl,
              template = $__2.template,
              directives = $__2.directives,
              renderer = $__2.renderer;
          this.templateUrl = templateUrl;
          this.template = template;
          this.directives = directives;
          this.renderer = renderer;
        }
        return ($traceurRuntime.createClass)(View, {}, {});
      }());
      $__export("View", View);
      Object.defineProperty(View, "annotations", {get: function() {
          return [new CONST()];
        }});
    }
  };
});

System.register("angular2/src/core/annotations/visibility", ["angular2/src/facade/lang", "angular2/di"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/annotations/visibility";
  var CONST,
      DependencyAnnotation,
      Parent,
      Ancestor;
  return {
    setters: [function($__m) {
      CONST = $__m.CONST;
    }, function($__m) {
      DependencyAnnotation = $__m.DependencyAnnotation;
    }],
    execute: function() {
      Parent = (function($__super) {
        function Parent() {
          $traceurRuntime.superConstructor(Parent).call(this);
        }
        return ($traceurRuntime.createClass)(Parent, {}, {}, $__super);
      }(DependencyAnnotation));
      $__export("Parent", Parent);
      Object.defineProperty(Parent, "annotations", {get: function() {
          return [new CONST()];
        }});
      Ancestor = (function($__super) {
        function Ancestor() {
          $traceurRuntime.superConstructor(Ancestor).call(this);
        }
        return ($traceurRuntime.createClass)(Ancestor, {}, {}, $__super);
      }(DependencyAnnotation));
      $__export("Ancestor", Ancestor);
      Object.defineProperty(Ancestor, "annotations", {get: function() {
          return [new CONST()];
        }});
    }
  };
});

System.register("angular2/src/core/compiler/base_query_list", ["angular2/src/facade/collection", "angular2/src/core/annotations/annotations"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/base_query_list";
  var List,
      MapWrapper,
      ListWrapper,
      Directive,
      BaseQueryList;
  return {
    setters: [function($__m) {
      List = $__m.List;
      MapWrapper = $__m.MapWrapper;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      Directive = $__m.Directive;
    }],
    execute: function() {
      BaseQueryList = (function() {
        var $__1;
        function BaseQueryList() {
          this._results = [];
          this._callbacks = [];
          this._dirty = false;
        }
        return ($traceurRuntime.createClass)(BaseQueryList, ($__1 = {}, Object.defineProperty($__1, Symbol.iterator, {
          value: function() {
            return this._results[Symbol.iterator]();
          },
          configurable: true,
          enumerable: true,
          writable: true
        }), Object.defineProperty($__1, "reset", {
          value: function(newList) {
            this._results = newList;
            this._dirty = true;
          },
          configurable: true,
          enumerable: true,
          writable: true
        }), Object.defineProperty($__1, "add", {
          value: function(obj) {
            ListWrapper.push(this._results, obj);
            this._dirty = true;
          },
          configurable: true,
          enumerable: true,
          writable: true
        }), Object.defineProperty($__1, "fireCallbacks", {
          value: function() {
            if (this._dirty) {
              ListWrapper.forEach(this._callbacks, (function(c) {
                return c();
              }));
              this._dirty = false;
            }
          },
          configurable: true,
          enumerable: true,
          writable: true
        }), Object.defineProperty($__1, "onChange", {
          value: function(callback) {
            ListWrapper.push(this._callbacks, callback);
          },
          configurable: true,
          enumerable: true,
          writable: true
        }), Object.defineProperty($__1, "removeCallback", {
          value: function(callback) {
            ListWrapper.remove(this._callbacks, callback);
          },
          configurable: true,
          enumerable: true,
          writable: true
        }), $__1), {});
      }());
      $__export("BaseQueryList", BaseQueryList);
    }
  };
});

System.register("angular2/src/core/compiler/compiler", ["angular2/di", "angular2/src/facade/lang", "angular2/src/facade/async", "angular2/src/facade/collection", "./directive_metadata_reader", "../annotations/annotations", "./view", "./element_injector", "./template_resolver", "../annotations/view", "./component_url_mapper", "./proto_view_factory", "angular2/src/services/url_resolver", "angular2/src/render/api"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/compiler";
  var Injectable,
      Type,
      isBlank,
      isPresent,
      BaseException,
      normalizeBlank,
      stringify,
      Promise,
      PromiseWrapper,
      List,
      ListWrapper,
      Map,
      MapWrapper,
      DirectiveMetadataReader,
      Component,
      Viewport,
      DynamicComponent,
      Decorator,
      AppProtoView,
      DirectiveBinding,
      TemplateResolver,
      View,
      ComponentUrlMapper,
      ProtoViewFactory,
      UrlResolver,
      renderApi,
      CompilerCache,
      Compiler;
  return {
    setters: [function($__m) {
      Injectable = $__m.Injectable;
    }, function($__m) {
      Type = $__m.Type;
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
      BaseException = $__m.BaseException;
      normalizeBlank = $__m.normalizeBlank;
      stringify = $__m.stringify;
    }, function($__m) {
      Promise = $__m.Promise;
      PromiseWrapper = $__m.PromiseWrapper;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
      Map = $__m.Map;
      MapWrapper = $__m.MapWrapper;
    }, function($__m) {
      DirectiveMetadataReader = $__m.DirectiveMetadataReader;
    }, function($__m) {
      Component = $__m.Component;
      Viewport = $__m.Viewport;
      DynamicComponent = $__m.DynamicComponent;
      Decorator = $__m.Decorator;
    }, function($__m) {
      AppProtoView = $__m.AppProtoView;
    }, function($__m) {
      DirectiveBinding = $__m.DirectiveBinding;
    }, function($__m) {
      TemplateResolver = $__m.TemplateResolver;
    }, function($__m) {
      View = $__m.View;
    }, function($__m) {
      ComponentUrlMapper = $__m.ComponentUrlMapper;
    }, function($__m) {
      ProtoViewFactory = $__m.ProtoViewFactory;
    }, function($__m) {
      UrlResolver = $__m.UrlResolver;
    }, function($__m) {
      renderApi = $__m;
    }],
    execute: function() {
      CompilerCache = (function() {
        function CompilerCache() {
          this._cache = MapWrapper.create();
        }
        return ($traceurRuntime.createClass)(CompilerCache, {
          set: function(component, protoView) {
            MapWrapper.set(this._cache, component, protoView);
          },
          get: function(component) {
            var result = MapWrapper.get(this._cache, component);
            return normalizeBlank(result);
          },
          clear: function() {
            MapWrapper.clear(this._cache);
          }
        }, {});
      }());
      $__export("CompilerCache", CompilerCache);
      Object.defineProperty(CompilerCache, "annotations", {get: function() {
          return [new Injectable()];
        }});
      Object.defineProperty(CompilerCache.prototype.set, "parameters", {get: function() {
          return [[Type], [AppProtoView]];
        }});
      Object.defineProperty(CompilerCache.prototype.get, "parameters", {get: function() {
          return [[Type]];
        }});
      Compiler = (function() {
        function Compiler(reader, cache, templateResolver, componentUrlMapper, urlResolver, renderer, protoViewFactory) {
          this._reader = reader;
          this._compilerCache = cache;
          this._compiling = MapWrapper.create();
          this._templateResolver = templateResolver;
          this._componentUrlMapper = componentUrlMapper;
          this._urlResolver = urlResolver;
          this._appUrl = urlResolver.resolve(null, './');
          this._renderer = renderer;
          this._protoViewFactory = protoViewFactory;
        }
        return ($traceurRuntime.createClass)(Compiler, {
          _bindDirective: function(directiveTypeOrBinding) {
            if (directiveTypeOrBinding instanceof DirectiveBinding) {
              return directiveTypeOrBinding;
            }
            var meta = this._reader.read(directiveTypeOrBinding);
            return DirectiveBinding.createFromType(meta.type, meta.annotation);
          },
          compileInHost: function(componentTypeOrBinding) {
            var $__0 = this;
            return this._renderer.createHostProtoView('host').then((function(hostRenderPv) {
              return $__0._compileNestedProtoViews(null, hostRenderPv, [$__0._bindDirective(componentTypeOrBinding)], true);
            }));
          },
          compile: function(component) {
            var protoView = this._compile(this._bindDirective(component));
            return PromiseWrapper.isPromise(protoView) ? protoView : PromiseWrapper.resolve(protoView);
          },
          _compile: function(componentBinding) {
            var $__0 = this;
            var component = componentBinding.key.token;
            var protoView = this._compilerCache.get(component);
            if (isPresent(protoView)) {
              return protoView;
            }
            var pvPromise = MapWrapper.get(this._compiling, component);
            if (isPresent(pvPromise)) {
              return pvPromise;
            }
            var template = this._templateResolver.resolve(component);
            if (isPresent(template.renderer)) {
              var directives = [];
              pvPromise = this._renderer.createImperativeComponentProtoView(template.renderer).then((function(renderPv) {
                return $__0._compileNestedProtoViews(componentBinding, renderPv, directives, true);
              }));
            } else {
              var directives = ListWrapper.map(this._flattenDirectives(template), (function(directive) {
                return $__0._bindDirective(directive);
              }));
              var renderTemplate = this._buildRenderTemplate(component, template, directives);
              pvPromise = this._renderer.compile(renderTemplate).then((function(renderPv) {
                return $__0._compileNestedProtoViews(componentBinding, renderPv, directives, true);
              }));
            }
            MapWrapper.set(this._compiling, component, pvPromise);
            return pvPromise;
          },
          _compileNestedProtoViews: function(componentBinding, renderPv, directives, isComponentRootView) {
            var $__0 = this;
            var nestedPVPromises = [];
            var protoView = this._protoViewFactory.createProtoView(componentBinding, renderPv, directives);
            if (isComponentRootView && isPresent(componentBinding)) {
              var component = componentBinding.key.token;
              this._compilerCache.set(component, protoView);
              MapWrapper.delete(this._compiling, component);
            }
            var binderIndex = 0;
            ListWrapper.forEach(protoView.elementBinders, (function(elementBinder) {
              var nestedComponent = elementBinder.componentDirective;
              var nestedRenderProtoView = renderPv.elementBinders[binderIndex].nestedProtoView;
              var elementBinderDone = (function(nestedPv) {
                elementBinder.nestedProtoView = nestedPv;
                nestedPv.parentProtoView = isPresent(nestedComponent) ? null : protoView;
              });
              var nestedCall = null;
              if (isPresent(nestedComponent)) {
                if (!(nestedComponent.annotation instanceof DynamicComponent)) {
                  nestedCall = $__0._compile(nestedComponent);
                }
              } else if (isPresent(nestedRenderProtoView)) {
                nestedCall = $__0._compileNestedProtoViews(componentBinding, nestedRenderProtoView, directives, false);
              }
              if (PromiseWrapper.isPromise(nestedCall)) {
                ListWrapper.push(nestedPVPromises, nestedCall.then(elementBinderDone));
              } else if (isPresent(nestedCall)) {
                elementBinderDone(nestedCall);
              }
              binderIndex++;
            }));
            var protoViewDone = (function(_) {
              var childComponentRenderPvRefs = [];
              ListWrapper.forEach(protoView.elementBinders, (function(eb) {
                if (isPresent(eb.componentDirective)) {
                  var componentPv = eb.nestedProtoView;
                  ListWrapper.push(childComponentRenderPvRefs, isPresent(componentPv) ? componentPv.render : null);
                }
              }));
              $__0._renderer.mergeChildComponentProtoViews(protoView.render, childComponentRenderPvRefs);
              return protoView;
            });
            if (nestedPVPromises.length > 0) {
              return PromiseWrapper.all(nestedPVPromises).then(protoViewDone);
            } else {
              return protoViewDone(null);
            }
          },
          _buildRenderTemplate: function(component, view, directives) {
            var componentUrl = this._urlResolver.resolve(this._appUrl, this._componentUrlMapper.getUrl(component));
            var templateAbsUrl = null;
            if (isPresent(view.templateUrl)) {
              templateAbsUrl = this._urlResolver.resolve(componentUrl, view.templateUrl);
            } else {
              templateAbsUrl = componentUrl;
            }
            return new renderApi.ViewDefinition({
              componentId: stringify(component),
              absUrl: templateAbsUrl,
              template: view.template,
              directives: ListWrapper.map(directives, Compiler.buildRenderDirective)
            });
          },
          _flattenDirectives: function(template) {
            if (isBlank(template.directives))
              return [];
            var directives = [];
            this._flattenList(template.directives, directives);
            return directives;
          },
          _flattenList: function(tree, out) {
            for (var i = 0; i < tree.length; i++) {
              var item = tree[i];
              if (ListWrapper.isList(item)) {
                this._flattenList(item, out);
              } else {
                ListWrapper.push(out, item);
              }
            }
          }
        }, {buildRenderDirective: function(directiveBinding) {
            var ann = directiveBinding.annotation;
            var renderType;
            var compileChildren = true;
            if ((ann instanceof Component) || (ann instanceof DynamicComponent)) {
              renderType = renderApi.DirectiveMetadata.COMPONENT_TYPE;
            } else if (ann instanceof Viewport) {
              renderType = renderApi.DirectiveMetadata.VIEWPORT_TYPE;
            } else if (ann instanceof Decorator) {
              renderType = renderApi.DirectiveMetadata.DECORATOR_TYPE;
              compileChildren = ann.compileChildren;
            }
            var setters = [];
            var readAttributes = [];
            ListWrapper.forEach(directiveBinding.dependencies, (function(dep) {
              if (isPresent(dep.propSetterName)) {
                ListWrapper.push(setters, dep.propSetterName);
              }
              if (isPresent(dep.attributeName)) {
                ListWrapper.push(readAttributes, dep.attributeName);
              }
            }));
            return new renderApi.DirectiveMetadata({
              id: stringify(directiveBinding.key.token),
              type: renderType,
              selector: ann.selector,
              compileChildren: compileChildren,
              hostListeners: isPresent(ann.hostListeners) ? MapWrapper.createFromStringMap(ann.hostListeners) : null,
              properties: isPresent(ann.properties) ? MapWrapper.createFromStringMap(ann.properties) : null,
              setters: setters,
              readAttributes: readAttributes
            });
          }});
      }());
      $__export("Compiler", Compiler);
      Object.defineProperty(Compiler, "annotations", {get: function() {
          return [new Injectable()];
        }});
      Object.defineProperty(Compiler, "parameters", {get: function() {
          return [[DirectiveMetadataReader], [CompilerCache], [TemplateResolver], [ComponentUrlMapper], [UrlResolver], [renderApi.Renderer], [ProtoViewFactory]];
        }});
      Object.defineProperty(Compiler.prototype.compileInHost, "parameters", {get: function() {
          return [[assert.type.any]];
        }});
      Object.defineProperty(Compiler.prototype.compile, "parameters", {get: function() {
          return [[Type]];
        }});
      Object.defineProperty(Compiler.prototype._compile, "parameters", {get: function() {
          return [[DirectiveBinding]];
        }});
      Object.defineProperty(Compiler.prototype._flattenDirectives, "parameters", {get: function() {
          return [[View]];
        }});
      Object.defineProperty(Compiler.prototype._flattenList, "parameters", {get: function() {
          return [[assert.genericType(List, assert.type.any)], [assert.genericType(List, Type)]];
        }});
    }
  };
});

System.register("angular2/src/core/compiler/component_url_mapper", ["angular2/di", "angular2/src/facade/lang", "angular2/src/facade/collection"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/component_url_mapper";
  var Injectable,
      Type,
      isPresent,
      Map,
      MapWrapper,
      ComponentUrlMapper,
      RuntimeComponentUrlMapper;
  return {
    setters: [function($__m) {
      Injectable = $__m.Injectable;
    }, function($__m) {
      Type = $__m.Type;
      isPresent = $__m.isPresent;
    }, function($__m) {
      Map = $__m.Map;
      MapWrapper = $__m.MapWrapper;
    }],
    execute: function() {
      ComponentUrlMapper = (function() {
        function ComponentUrlMapper() {}
        return ($traceurRuntime.createClass)(ComponentUrlMapper, {getUrl: function(component) {
            return './';
          }}, {});
      }());
      $__export("ComponentUrlMapper", ComponentUrlMapper);
      Object.defineProperty(ComponentUrlMapper, "annotations", {get: function() {
          return [new Injectable()];
        }});
      Object.defineProperty(ComponentUrlMapper.prototype.getUrl, "parameters", {get: function() {
          return [[Type]];
        }});
      RuntimeComponentUrlMapper = (function($__super) {
        function RuntimeComponentUrlMapper() {
          $traceurRuntime.superConstructor(RuntimeComponentUrlMapper).call(this);
          this._componentUrls = MapWrapper.create();
        }
        return ($traceurRuntime.createClass)(RuntimeComponentUrlMapper, {
          setComponentUrl: function(component, url) {
            MapWrapper.set(this._componentUrls, component, url);
          },
          getUrl: function(component) {
            var url = MapWrapper.get(this._componentUrls, component);
            if (isPresent(url))
              return url;
            return $traceurRuntime.superGet(this, RuntimeComponentUrlMapper.prototype, "getUrl").call(this, component);
          }
        }, {}, $__super);
      }(ComponentUrlMapper));
      $__export("RuntimeComponentUrlMapper", RuntimeComponentUrlMapper);
      Object.defineProperty(RuntimeComponentUrlMapper.prototype.setComponentUrl, "parameters", {get: function() {
          return [[Type], [assert.type.string]];
        }});
      Object.defineProperty(RuntimeComponentUrlMapper.prototype.getUrl, "parameters", {get: function() {
          return [[Type]];
        }});
    }
  };
});

System.register("angular2/src/core/compiler/directive_metadata", ["angular2/src/facade/lang", "angular2/src/facade/collection", "angular2/src/core/annotations/annotations", "angular2/di"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/directive_metadata";
  var Type,
      List,
      Directive,
      ResolvedBinding,
      DirectiveMetadata;
  return {
    setters: [function($__m) {
      Type = $__m.Type;
    }, function($__m) {
      List = $__m.List;
    }, function($__m) {
      Directive = $__m.Directive;
    }, function($__m) {
      ResolvedBinding = $__m.ResolvedBinding;
    }],
    execute: function() {
      DirectiveMetadata = (function() {
        function DirectiveMetadata(type, annotation, resolvedInjectables) {
          this.annotation = annotation;
          this.type = type;
          this.resolvedInjectables = resolvedInjectables;
        }
        return ($traceurRuntime.createClass)(DirectiveMetadata, {}, {});
      }());
      $__export("DirectiveMetadata", DirectiveMetadata);
      Object.defineProperty(DirectiveMetadata, "parameters", {get: function() {
          return [[Type], [Directive], [assert.genericType(List, ResolvedBinding)]];
        }});
    }
  };
});

System.register("angular2/src/core/compiler/directive_metadata_reader", ["angular2/di", "angular2/src/facade/lang", "../annotations/annotations", "./directive_metadata", "angular2/src/reflection/reflection"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/directive_metadata_reader";
  var Injectable,
      Injector,
      Type,
      isPresent,
      BaseException,
      stringify,
      Directive,
      Component,
      DirectiveMetadata,
      reflector,
      DirectiveMetadataReader;
  return {
    setters: [function($__m) {
      Injectable = $__m.Injectable;
      Injector = $__m.Injector;
    }, function($__m) {
      Type = $__m.Type;
      isPresent = $__m.isPresent;
      BaseException = $__m.BaseException;
      stringify = $__m.stringify;
    }, function($__m) {
      Directive = $__m.Directive;
      Component = $__m.Component;
    }, function($__m) {
      DirectiveMetadata = $__m.DirectiveMetadata;
    }, function($__m) {
      reflector = $__m.reflector;
    }],
    execute: function() {
      DirectiveMetadataReader = (function() {
        function DirectiveMetadataReader() {}
        return ($traceurRuntime.createClass)(DirectiveMetadataReader, {read: function(type) {
            var annotations = reflector.annotations(type);
            if (isPresent(annotations)) {
              for (var i = 0; i < annotations.length; i++) {
                var annotation = annotations[i];
                if (annotation instanceof Directive) {
                  var resolvedInjectables = null;
                  if (annotation instanceof Component && isPresent(annotation.injectables)) {
                    resolvedInjectables = Injector.resolve(annotation.injectables);
                  }
                  return new DirectiveMetadata(type, annotation, resolvedInjectables);
                }
              }
            }
            throw new BaseException(("No Directive annotation found on " + stringify(type)));
          }}, {});
      }());
      $__export("DirectiveMetadataReader", DirectiveMetadataReader);
      Object.defineProperty(DirectiveMetadataReader, "annotations", {get: function() {
          return [new Injectable()];
        }});
      Object.defineProperty(DirectiveMetadataReader.prototype.read, "parameters", {get: function() {
          return [[Type]];
        }});
    }
  };
});

System.register("angular2/src/core/compiler/dynamic_component_loader", ["angular2/di", "./compiler", "./directive_metadata_reader", "angular2/src/facade/lang", "angular2/src/facade/async", "angular2/src/core/annotations/annotations", "angular2/src/core/compiler/view_factory", "angular2/src/core/compiler/view_hydrator", "./element_injector", "./view"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/dynamic_component_loader";
  var Key,
      Injector,
      Injectable,
      ResolvedBinding,
      Compiler,
      DirectiveMetadataReader,
      Type,
      BaseException,
      stringify,
      isPresent,
      Promise,
      Component,
      ViewFactory,
      AppViewHydrator,
      ElementRef,
      DirectiveBinding,
      AppView,
      ComponentRef,
      DynamicComponentLoader;
  return {
    setters: [function($__m) {
      Key = $__m.Key;
      Injector = $__m.Injector;
      Injectable = $__m.Injectable;
      ResolvedBinding = $__m.ResolvedBinding;
    }, function($__m) {
      Compiler = $__m.Compiler;
    }, function($__m) {
      DirectiveMetadataReader = $__m.DirectiveMetadataReader;
    }, function($__m) {
      Type = $__m.Type;
      BaseException = $__m.BaseException;
      stringify = $__m.stringify;
      isPresent = $__m.isPresent;
    }, function($__m) {
      Promise = $__m.Promise;
    }, function($__m) {
      Component = $__m.Component;
    }, function($__m) {
      ViewFactory = $__m.ViewFactory;
    }, function($__m) {
      AppViewHydrator = $__m.AppViewHydrator;
    }, function($__m) {
      ElementRef = $__m.ElementRef;
      DirectiveBinding = $__m.DirectiveBinding;
    }, function($__m) {
      AppView = $__m.AppView;
    }],
    execute: function() {
      ComponentRef = (function() {
        function ComponentRef(location, instance, componentView, dispose) {
          this.location = location;
          this.instance = instance;
          this.componentView = componentView;
          this._dispose = dispose;
        }
        return ($traceurRuntime.createClass)(ComponentRef, {
          get injector() {
            return this.location.injector;
          },
          get hostView() {
            return this.location.hostView;
          },
          dispose: function() {
            this._dispose();
          }
        }, {});
      }());
      $__export("ComponentRef", ComponentRef);
      Object.defineProperty(ComponentRef, "parameters", {get: function() {
          return [[ElementRef], [assert.type.any], [AppView], [Function]];
        }});
      DynamicComponentLoader = (function() {
        function DynamicComponentLoader(compiler, directiveMetadataReader, viewFactory, viewHydrator) {
          this._compiler = compiler;
          this._directiveMetadataReader = directiveMetadataReader;
          this._viewFactory = viewFactory;
          this._viewHydrator = viewHydrator;
        }
        return ($traceurRuntime.createClass)(DynamicComponentLoader, {
          loadIntoExistingLocation: function(type, location) {
            var injector = arguments[2] !== (void 0) ? arguments[2] : null;
            var $__0 = this;
            this._assertTypeIsComponent(type);
            var annotation = this._directiveMetadataReader.read(type).annotation;
            var componentBinding = DirectiveBinding.createFromType(type, annotation);
            return this._compiler.compile(type).then((function(componentProtoView) {
              var componentView = $__0._viewFactory.getView(componentProtoView);
              $__0._viewHydrator.hydrateDynamicComponentView(location, componentView, componentBinding, injector);
              var dispose = (function() {
                throw new BaseException("Not implemented");
              });
              return new ComponentRef(location, location.elementInjector.getDynamicallyLoadedComponent(), componentView, dispose);
            }));
          },
          loadIntoNewLocation: function(type, parentComponentLocation, elementOrSelector) {
            var injector = arguments[3] !== (void 0) ? arguments[3] : null;
            var $__0 = this;
            this._assertTypeIsComponent(type);
            return this._compiler.compileInHost(type).then((function(hostProtoView) {
              var hostView = $__0._viewFactory.getView(hostProtoView);
              $__0._viewHydrator.hydrateInPlaceHostView(parentComponentLocation, elementOrSelector, hostView, injector);
              var newLocation = hostView.elementInjectors[0].getElementRef();
              var component = hostView.elementInjectors[0].getComponent();
              var dispose = (function() {
                $__0._viewHydrator.dehydrateInPlaceHostView(parentComponentLocation, hostView);
                $__0._viewFactory.returnView(hostView);
              });
              return new ComponentRef(newLocation, component, hostView.componentChildViews[0], dispose);
            }));
          },
          loadNextToExistingLocation: function(type, location) {
            var injector = arguments[2] !== (void 0) ? arguments[2] : null;
            this._assertTypeIsComponent(type);
            return this._compiler.compileInHost(type).then((function(hostProtoView) {
              var hostView = location.viewContainer.create(-1, hostProtoView, injector);
              var newLocation = hostView.elementInjectors[0].getElementRef();
              var component = hostView.elementInjectors[0].getComponent();
              var dispose = (function() {
                var index = location.viewContainer.indexOf(hostView);
                location.viewContainer.remove(index);
              });
              return new ComponentRef(newLocation, component, hostView.componentChildViews[0], dispose);
            }));
          },
          _assertTypeIsComponent: function(type) {
            var annotation = this._directiveMetadataReader.read(type).annotation;
            if (!(annotation instanceof Component)) {
              throw new BaseException(("Could not load '" + stringify(type) + "' because it is not a component."));
            }
          }
        }, {});
      }());
      $__export("DynamicComponentLoader", DynamicComponentLoader);
      Object.defineProperty(DynamicComponentLoader, "annotations", {get: function() {
          return [new Injectable()];
        }});
      Object.defineProperty(DynamicComponentLoader, "parameters", {get: function() {
          return [[Compiler], [DirectiveMetadataReader], [ViewFactory], [AppViewHydrator]];
        }});
      Object.defineProperty(DynamicComponentLoader.prototype.loadIntoExistingLocation, "parameters", {get: function() {
          return [[Type], [ElementRef], [Injector]];
        }});
      Object.defineProperty(DynamicComponentLoader.prototype.loadIntoNewLocation, "parameters", {get: function() {
          return [[Type], [ElementRef], [assert.type.any], [Injector]];
        }});
      Object.defineProperty(DynamicComponentLoader.prototype.loadNextToExistingLocation, "parameters", {get: function() {
          return [[Type], [ElementRef], [Injector]];
        }});
      Object.defineProperty(DynamicComponentLoader.prototype._assertTypeIsComponent, "parameters", {get: function() {
          return [[Type]];
        }});
    }
  };
});

System.register("angular2/src/core/compiler/element_binder", ["angular2/src/facade/lang", "./element_injector", "angular2/src/facade/collection", "./view"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/element_binder";
  var int,
      isBlank,
      isPresent,
      BaseException,
      eiModule,
      DirectiveBinding,
      List,
      StringMap,
      viewModule,
      ElementBinder;
  return {
    setters: [function($__m) {
      int = $__m.int;
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
      BaseException = $__m.BaseException;
    }, function($__m) {
      DirectiveBinding = $__m.DirectiveBinding;
      eiModule = $__m;
    }, function($__m) {
      List = $__m.List;
      StringMap = $__m.StringMap;
    }, function($__m) {
      viewModule = $__m;
    }],
    execute: function() {
      ElementBinder = (function() {
        function ElementBinder(index, parent, distanceToParent, protoElementInjector, componentDirective, viewportDirective) {
          if (isBlank(index)) {
            throw new BaseException('null index not allowed.');
          }
          this.protoElementInjector = protoElementInjector;
          this.componentDirective = componentDirective;
          this.viewportDirective = viewportDirective;
          this.parent = parent;
          this.index = index;
          this.distanceToParent = distanceToParent;
          this.hostListeners = null;
          this.nestedProtoView = null;
        }
        return ($traceurRuntime.createClass)(ElementBinder, {
          hasStaticComponent: function() {
            return isPresent(this.componentDirective) && isPresent(this.nestedProtoView);
          },
          hasDynamicComponent: function() {
            return isPresent(this.componentDirective) && isBlank(this.nestedProtoView);
          }
        }, {});
      }());
      $__export("ElementBinder", ElementBinder);
      Object.defineProperty(ElementBinder, "parameters", {get: function() {
          return [[int], [ElementBinder], [int], [eiModule.ProtoElementInjector], [DirectiveBinding], [DirectiveBinding]];
        }});
    }
  };
});

System.register("angular2/src/core/compiler/element_injector", ["angular2/src/facade/lang", "angular2/src/facade/async", "angular2/src/facade/math", "angular2/src/facade/collection", "angular2/di", "angular2/src/core/annotations/visibility", "angular2/src/core/annotations/di", "angular2/src/core/compiler/view", "angular2/src/core/compiler/view_container", "angular2/src/core/compiler/ng_element", "angular2/src/core/annotations/annotations", "angular2/change_detection", "./query_list", "angular2/src/reflection/reflection"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/element_injector";
  var isPresent,
      isBlank,
      Type,
      int,
      BaseException,
      EventEmitter,
      ObservableWrapper,
      Math,
      List,
      ListWrapper,
      MapWrapper,
      Injector,
      Key,
      Dependency,
      bind,
      Binding,
      ResolvedBinding,
      NoBindingError,
      AbstractBindingError,
      CyclicDependencyError,
      Parent,
      Ancestor,
      PropertySetter,
      Attribute,
      Query,
      viewModule,
      ViewContainer,
      NgElement,
      Directive,
      Component,
      onChange,
      onDestroy,
      onAllChangesDone,
      ChangeDetector,
      ChangeDetectorRef,
      QueryList,
      reflector,
      _MAX_DIRECTIVE_CONSTRUCTION_COUNTER,
      MAX_DEPTH,
      _undefined,
      _staticKeys,
      ElementRef,
      StaticKeys,
      TreeNode,
      DirectiveDependency,
      DirectiveBinding,
      PreBuiltObjects,
      EventEmitterAccessor,
      ProtoElementInjector,
      ElementInjector,
      OutOfBoundsAccess,
      QueryError,
      QueryRef;
  return {
    setters: [function($__m) {
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
      Type = $__m.Type;
      int = $__m.int;
      BaseException = $__m.BaseException;
    }, function($__m) {
      EventEmitter = $__m.EventEmitter;
      ObservableWrapper = $__m.ObservableWrapper;
    }, function($__m) {
      Math = $__m.Math;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
      MapWrapper = $__m.MapWrapper;
    }, function($__m) {
      Injector = $__m.Injector;
      Key = $__m.Key;
      Dependency = $__m.Dependency;
      bind = $__m.bind;
      Binding = $__m.Binding;
      ResolvedBinding = $__m.ResolvedBinding;
      NoBindingError = $__m.NoBindingError;
      AbstractBindingError = $__m.AbstractBindingError;
      CyclicDependencyError = $__m.CyclicDependencyError;
    }, function($__m) {
      Parent = $__m.Parent;
      Ancestor = $__m.Ancestor;
    }, function($__m) {
      PropertySetter = $__m.PropertySetter;
      Attribute = $__m.Attribute;
      Query = $__m.Query;
    }, function($__m) {
      viewModule = $__m;
    }, function($__m) {
      ViewContainer = $__m.ViewContainer;
    }, function($__m) {
      NgElement = $__m.NgElement;
    }, function($__m) {
      Directive = $__m.Directive;
      Component = $__m.Component;
      onChange = $__m.onChange;
      onDestroy = $__m.onDestroy;
      onAllChangesDone = $__m.onAllChangesDone;
    }, function($__m) {
      ChangeDetector = $__m.ChangeDetector;
      ChangeDetectorRef = $__m.ChangeDetectorRef;
    }, function($__m) {
      QueryList = $__m.QueryList;
    }, function($__m) {
      reflector = $__m.reflector;
    }],
    execute: function() {
      _MAX_DIRECTIVE_CONSTRUCTION_COUNTER = 10;
      MAX_DEPTH = Math.pow(2, 30) - 1;
      _undefined = new Object();
      ElementRef = (function() {
        function ElementRef(elementInjector, hostView, boundElementIndex, injector) {
          this.elementInjector = elementInjector;
          this.hostView = hostView;
          this.boundElementIndex = boundElementIndex;
          this.injector = injector;
        }
        return ($traceurRuntime.createClass)(ElementRef, {get viewContainer() {
            return this.hostView.getOrCreateViewContainer(this.boundElementIndex);
          }}, {});
      }());
      $__export("ElementRef", ElementRef);
      StaticKeys = (function() {
        function StaticKeys() {
          this.viewId = Key.get(viewModule.AppView).id;
          this.ngElementId = Key.get(NgElement).id;
          this.viewContainerId = Key.get(ViewContainer).id;
          this.changeDetectorRefId = Key.get(ChangeDetectorRef).id;
          this.elementRefId = Key.get(ElementRef).id;
        }
        return ($traceurRuntime.createClass)(StaticKeys, {}, {instance: function() {
            if (isBlank(_staticKeys))
              _staticKeys = new StaticKeys();
            return _staticKeys;
          }});
      }());
      TreeNode = (function() {
        function TreeNode(parent) {
          this._head = null;
          this._tail = null;
          this._next = null;
          if (isPresent(parent))
            parent.addChild(this);
        }
        return ($traceurRuntime.createClass)(TreeNode, {
          _assertConsistency: function() {
            this._assertHeadBeforeTail();
            this._assertTailReachable();
            this._assertPresentInParentList();
          },
          _assertHeadBeforeTail: function() {
            if (isBlank(this._tail) && isPresent(this._head))
              throw new BaseException('null tail but non-null head');
          },
          _assertTailReachable: function() {
            if (isBlank(this._tail))
              return ;
            if (isPresent(this._tail._next))
              throw new BaseException('node after tail');
            var p = this._head;
            while (isPresent(p) && p != this._tail)
              p = p._next;
            if (isBlank(p) && isPresent(this._tail))
              throw new BaseException('tail not reachable.');
          },
          _assertPresentInParentList: function() {
            var p = this._parent;
            if (isBlank(p)) {
              return ;
            }
            var cur = p._head;
            while (isPresent(cur) && cur != this)
              cur = cur._next;
            if (isBlank(cur))
              throw new BaseException('node not reachable through parent.');
          },
          addChild: function(child) {
            if (isPresent(this._tail)) {
              this._tail._next = child;
              this._tail = child;
            } else {
              this._tail = this._head = child;
            }
            child._next = null;
            child._parent = this;
            this._assertConsistency();
          },
          addChildAfter: function(child, prevSibling) {
            this._assertConsistency();
            if (isBlank(prevSibling)) {
              var prevHead = this._head;
              this._head = child;
              child._next = prevHead;
              if (isBlank(this._tail))
                this._tail = child;
            } else if (isBlank(prevSibling._next)) {
              this.addChild(child);
              return ;
            } else {
              prevSibling._assertPresentInParentList();
              child._next = prevSibling._next;
              prevSibling._next = child;
            }
            child._parent = this;
            this._assertConsistency();
          },
          remove: function() {
            this._assertConsistency();
            if (isBlank(this.parent))
              return ;
            var nextSibling = this._next;
            var prevSibling = this._findPrev();
            if (isBlank(prevSibling)) {
              this.parent._head = this._next;
            } else {
              prevSibling._next = this._next;
            }
            if (isBlank(nextSibling)) {
              this._parent._tail = prevSibling;
            }
            this._parent._assertConsistency();
            this._parent = null;
            this._next = null;
            this._assertConsistency();
          },
          _findPrev: function() {
            var node = this.parent._head;
            if (node == this)
              return null;
            while (node._next !== this)
              node = node._next;
            return node;
          },
          get parent() {
            return this._parent;
          },
          get children() {
            var res = [];
            var child = this._head;
            while (child != null) {
              ListWrapper.push(res, child);
              child = child._next;
            }
            return res;
          }
        }, {});
      }());
      $__export("TreeNode", TreeNode);
      Object.defineProperty(TreeNode, "parameters", {get: function() {
          return [[TreeNode]];
        }});
      Object.defineProperty(TreeNode.prototype.addChild, "parameters", {get: function() {
          return [[TreeNode]];
        }});
      Object.defineProperty(TreeNode.prototype.addChildAfter, "parameters", {get: function() {
          return [[TreeNode], [TreeNode]];
        }});
      DirectiveDependency = (function($__super) {
        function DirectiveDependency(key, asPromise, lazy, optional, properties, depth, propSetterName, attributeName, queryDirective) {
          $traceurRuntime.superConstructor(DirectiveDependency).call(this, key, asPromise, lazy, optional, properties);
          this.depth = depth;
          this.propSetterName = propSetterName;
          this.attributeName = attributeName;
          this.queryDirective = queryDirective;
          this._verify();
        }
        return ($traceurRuntime.createClass)(DirectiveDependency, {_verify: function() {
            var count = 0;
            if (isPresent(this.propSetterName))
              count++;
            if (isPresent(this.queryDirective))
              count++;
            if (isPresent(this.attributeName))
              count++;
            if (count > 1)
              throw new BaseException('A directive injectable can contain only one of the following @PropertySetter, @Attribute or @Query.');
          }}, {
          createFrom: function(d) {
            return new DirectiveDependency(d.key, d.asPromise, d.lazy, d.optional, d.properties, DirectiveDependency._depth(d.properties), DirectiveDependency._propSetterName(d.properties), DirectiveDependency._attributeName(d.properties), DirectiveDependency._query(d.properties));
          },
          _depth: function(properties) {
            if (properties.length == 0)
              return 0;
            if (ListWrapper.any(properties, (function(p) {
              return p instanceof Parent;
            })))
              return 1;
            if (ListWrapper.any(properties, (function(p) {
              return p instanceof Ancestor;
            })))
              return MAX_DEPTH;
            return 0;
          },
          _propSetterName: function(properties) {
            var p = ListWrapper.find(properties, (function(p) {
              return p instanceof PropertySetter;
            }));
            return isPresent(p) ? p.propName : null;
          },
          _attributeName: function(properties) {
            var p = ListWrapper.find(properties, (function(p) {
              return p instanceof Attribute;
            }));
            return isPresent(p) ? p.attributeName : null;
          },
          _query: function(properties) {
            var p = ListWrapper.find(properties, (function(p) {
              return p instanceof Query;
            }));
            return isPresent(p) ? p.directive : null;
          }
        }, $__super);
      }(Dependency));
      $__export("DirectiveDependency", DirectiveDependency);
      Object.defineProperty(DirectiveDependency, "parameters", {get: function() {
          return [[Key], [assert.type.boolean], [assert.type.boolean], [assert.type.boolean], [List], [int], [assert.type.string], [assert.type.string], []];
        }});
      Object.defineProperty(DirectiveDependency.createFrom, "parameters", {get: function() {
          return [[Dependency]];
        }});
      DirectiveBinding = (function($__super) {
        function DirectiveBinding(key, factory, dependencies, providedAsPromise, annotation) {
          $traceurRuntime.superConstructor(DirectiveBinding).call(this, key, factory, dependencies, providedAsPromise);
          this.callOnDestroy = isPresent(annotation) && annotation.hasLifecycleHook(onDestroy);
          this.callOnChange = isPresent(annotation) && annotation.hasLifecycleHook(onChange);
          this.callOnAllChangesDone = isPresent(annotation) && annotation.hasLifecycleHook(onAllChangesDone);
          this.annotation = annotation;
          if (annotation instanceof Component && isPresent(annotation.injectables)) {
            this.resolvedInjectables = Injector.resolve(annotation.injectables);
          }
        }
        return ($traceurRuntime.createClass)(DirectiveBinding, {
          get eventEmitters() {
            return isPresent(this.annotation) && isPresent(this.annotation.events) ? this.annotation.events : [];
          },
          get changeDetection() {
            if (this.annotation instanceof Component) {
              var c = this.annotation;
              return c.changeDetection;
            } else {
              return null;
            }
          }
        }, {
          createFromBinding: function(b, annotation) {
            var rb = b.resolve();
            var deps = ListWrapper.map(rb.dependencies, DirectiveDependency.createFrom);
            return new DirectiveBinding(rb.key, rb.factory, deps, rb.providedAsPromise, annotation);
          },
          createFromType: function(type, annotation) {
            var binding = new Binding(type, {toClass: type});
            return DirectiveBinding.createFromBinding(binding, annotation);
          }
        }, $__super);
      }(ResolvedBinding));
      $__export("DirectiveBinding", DirectiveBinding);
      Object.defineProperty(DirectiveBinding, "parameters", {get: function() {
          return [[Key], [Function], [List], [assert.type.boolean], [Directive]];
        }});
      Object.defineProperty(DirectiveBinding.createFromBinding, "parameters", {get: function() {
          return [[Binding], [Directive]];
        }});
      Object.defineProperty(DirectiveBinding.createFromType, "parameters", {get: function() {
          return [[Type], [Directive]];
        }});
      PreBuiltObjects = (function() {
        function PreBuiltObjects(view, element, changeDetector) {
          this.view = view;
          this.element = element;
          this.changeDetector = changeDetector;
        }
        return ($traceurRuntime.createClass)(PreBuiltObjects, {}, {});
      }());
      $__export("PreBuiltObjects", PreBuiltObjects);
      Object.defineProperty(PreBuiltObjects, "parameters", {get: function() {
          return [[], [NgElement], [ChangeDetector]];
        }});
      EventEmitterAccessor = (function() {
        function EventEmitterAccessor(eventName, getter) {
          this.eventName = eventName;
          this.getter = getter;
        }
        return ($traceurRuntime.createClass)(EventEmitterAccessor, {subscribe: function(view, boundElementIndex, directive) {
            var $__0 = this;
            var eventEmitter = this.getter(directive);
            return ObservableWrapper.subscribe(eventEmitter, (function(eventObj) {
              return view.triggerEventHandlers($__0.eventName, eventObj, boundElementIndex);
            }));
          }}, {});
      }());
      Object.defineProperty(EventEmitterAccessor, "parameters", {get: function() {
          return [[assert.type.string], [Function]];
        }});
      Object.defineProperty(EventEmitterAccessor.prototype.subscribe, "parameters", {get: function() {
          return [[viewModule.AppView], [assert.type.number], [Object]];
        }});
      ProtoElementInjector = (function() {
        function ProtoElementInjector(parent, index, bindings) {
          var firstBindingIsComponent = arguments[3] !== (void 0) ? arguments[3] : false;
          var distanceToParent = arguments[4] !== (void 0) ? arguments[4] : 0;
          this.parent = parent;
          this.index = index;
          this.distanceToParent = distanceToParent;
          this.exportComponent = false;
          this.exportElement = false;
          this._binding0IsComponent = firstBindingIsComponent;
          this._binding0 = null;
          this._keyId0 = null;
          this._binding1 = null;
          this._keyId1 = null;
          this._binding2 = null;
          this._keyId2 = null;
          this._binding3 = null;
          this._keyId3 = null;
          this._binding4 = null;
          this._keyId4 = null;
          this._binding5 = null;
          this._keyId5 = null;
          this._binding6 = null;
          this._keyId6 = null;
          this._binding7 = null;
          this._keyId7 = null;
          this._binding8 = null;
          this._keyId8 = null;
          this._binding9 = null;
          this._keyId9 = null;
          this.numberOfDirectives = bindings.length;
          var length = bindings.length;
          this.eventEmitterAccessors = ListWrapper.createFixedSize(length);
          if (length > 0) {
            this._binding0 = this._createBinding(bindings[0]);
            this._keyId0 = this._binding0.key.id;
            this.eventEmitterAccessors[0] = this._createEventEmitterAccessors(this._binding0);
          }
          if (length > 1) {
            this._binding1 = this._createBinding(bindings[1]);
            this._keyId1 = this._binding1.key.id;
            this.eventEmitterAccessors[1] = this._createEventEmitterAccessors(this._binding1);
          }
          if (length > 2) {
            this._binding2 = this._createBinding(bindings[2]);
            this._keyId2 = this._binding2.key.id;
            this.eventEmitterAccessors[2] = this._createEventEmitterAccessors(this._binding2);
          }
          if (length > 3) {
            this._binding3 = this._createBinding(bindings[3]);
            this._keyId3 = this._binding3.key.id;
            this.eventEmitterAccessors[3] = this._createEventEmitterAccessors(this._binding3);
          }
          if (length > 4) {
            this._binding4 = this._createBinding(bindings[4]);
            this._keyId4 = this._binding4.key.id;
            this.eventEmitterAccessors[4] = this._createEventEmitterAccessors(this._binding4);
          }
          if (length > 5) {
            this._binding5 = this._createBinding(bindings[5]);
            this._keyId5 = this._binding5.key.id;
            this.eventEmitterAccessors[5] = this._createEventEmitterAccessors(this._binding5);
          }
          if (length > 6) {
            this._binding6 = this._createBinding(bindings[6]);
            this._keyId6 = this._binding6.key.id;
            this.eventEmitterAccessors[6] = this._createEventEmitterAccessors(this._binding6);
          }
          if (length > 7) {
            this._binding7 = this._createBinding(bindings[7]);
            this._keyId7 = this._binding7.key.id;
            this.eventEmitterAccessors[7] = this._createEventEmitterAccessors(this._binding7);
          }
          if (length > 8) {
            this._binding8 = this._createBinding(bindings[8]);
            this._keyId8 = this._binding8.key.id;
            this.eventEmitterAccessors[8] = this._createEventEmitterAccessors(this._binding8);
          }
          if (length > 9) {
            this._binding9 = this._createBinding(bindings[9]);
            this._keyId9 = this._binding9.key.id;
            this.eventEmitterAccessors[9] = this._createEventEmitterAccessors(this._binding9);
          }
          if (length > 10) {
            throw 'Maximum number of directives per element has been reached.';
          }
        }
        return ($traceurRuntime.createClass)(ProtoElementInjector, {
          _createEventEmitterAccessors: function(b) {
            return ListWrapper.map(b.eventEmitters, (function(eventName) {
              return new EventEmitterAccessor(eventName, reflector.getter(eventName));
            }));
          },
          instantiate: function(parent) {
            return new ElementInjector(this, parent);
          },
          directParent: function() {
            return this.distanceToParent < 2 ? this.parent : null;
          },
          _createBinding: function(bindingOrType) {
            if (bindingOrType instanceof DirectiveBinding) {
              return bindingOrType;
            } else {
              var b = bind(bindingOrType).toClass(bindingOrType);
              return DirectiveBinding.createFromBinding(b, null);
            }
          },
          get hasBindings() {
            return isPresent(this._binding0);
          },
          getDirectiveBindingAtIndex: function(index) {
            if (index == 0)
              return this._binding0;
            if (index == 1)
              return this._binding1;
            if (index == 2)
              return this._binding2;
            if (index == 3)
              return this._binding3;
            if (index == 4)
              return this._binding4;
            if (index == 5)
              return this._binding5;
            if (index == 6)
              return this._binding6;
            if (index == 7)
              return this._binding7;
            if (index == 8)
              return this._binding8;
            if (index == 9)
              return this._binding9;
            throw new OutOfBoundsAccess(index);
          }
        }, {});
      }());
      $__export("ProtoElementInjector", ProtoElementInjector);
      Object.defineProperty(ProtoElementInjector, "parameters", {get: function() {
          return [[ProtoElementInjector], [int], [List], [assert.type.boolean], [assert.type.number]];
        }});
      Object.defineProperty(ProtoElementInjector.prototype._createEventEmitterAccessors, "parameters", {get: function() {
          return [[DirectiveBinding]];
        }});
      Object.defineProperty(ProtoElementInjector.prototype.instantiate, "parameters", {get: function() {
          return [[ElementInjector]];
        }});
      Object.defineProperty(ProtoElementInjector.prototype.getDirectiveBindingAtIndex, "parameters", {get: function() {
          return [[int]];
        }});
      ElementInjector = (function($__super) {
        function ElementInjector(proto, parent) {
          $traceurRuntime.superConstructor(ElementInjector).call(this, parent);
          this._proto = proto;
          this._preBuiltObjects = null;
          this._lightDomAppInjector = null;
          this._shadowDomAppInjector = null;
          this._obj0 = null;
          this._obj1 = null;
          this._obj2 = null;
          this._obj3 = null;
          this._obj4 = null;
          this._obj5 = null;
          this._obj6 = null;
          this._obj7 = null;
          this._obj8 = null;
          this._obj9 = null;
          this._constructionCounter = 0;
          this._inheritQueries(parent);
          this._buildQueries();
        }
        return ($traceurRuntime.createClass)(ElementInjector, {
          clearDirectives: function() {
            this._host = null;
            this._preBuiltObjects = null;
            this._lightDomAppInjector = null;
            this._shadowDomAppInjector = null;
            var p = this._proto;
            if (isPresent(p._binding0) && p._binding0.callOnDestroy) {
              this._obj0.onDestroy();
            }
            if (isPresent(p._binding1) && p._binding1.callOnDestroy) {
              this._obj1.onDestroy();
            }
            if (isPresent(p._binding2) && p._binding2.callOnDestroy) {
              this._obj2.onDestroy();
            }
            if (isPresent(p._binding3) && p._binding3.callOnDestroy) {
              this._obj3.onDestroy();
            }
            if (isPresent(p._binding4) && p._binding4.callOnDestroy) {
              this._obj4.onDestroy();
            }
            if (isPresent(p._binding5) && p._binding5.callOnDestroy) {
              this._obj5.onDestroy();
            }
            if (isPresent(p._binding6) && p._binding6.callOnDestroy) {
              this._obj6.onDestroy();
            }
            if (isPresent(p._binding7) && p._binding7.callOnDestroy) {
              this._obj7.onDestroy();
            }
            if (isPresent(p._binding8) && p._binding8.callOnDestroy) {
              this._obj8.onDestroy();
            }
            if (isPresent(p._binding9) && p._binding9.callOnDestroy) {
              this._obj9.onDestroy();
            }
            if (isPresent(this._dynamicallyCreatedComponentBinding) && this._dynamicallyCreatedComponentBinding.callOnDestroy) {
              this._dynamicallyCreatedComponent.onDestroy();
            }
            this._obj0 = null;
            this._obj1 = null;
            this._obj2 = null;
            this._obj3 = null;
            this._obj4 = null;
            this._obj5 = null;
            this._obj6 = null;
            this._obj7 = null;
            this._obj8 = null;
            this._obj9 = null;
            this._dynamicallyCreatedComponent = null;
            this._dynamicallyCreatedComponentBinding = null;
            this._constructionCounter = 0;
          },
          instantiateDirectives: function(lightDomAppInjector, host, shadowDomAppInjector, preBuiltObjects) {
            this._host = host;
            this._checkShadowDomAppInjector(shadowDomAppInjector);
            this._preBuiltObjects = preBuiltObjects;
            this._lightDomAppInjector = lightDomAppInjector;
            this._shadowDomAppInjector = shadowDomAppInjector;
            var p = this._proto;
            if (isPresent(p._keyId0))
              this._getDirectiveByKeyId(p._keyId0);
            if (isPresent(p._keyId1))
              this._getDirectiveByKeyId(p._keyId1);
            if (isPresent(p._keyId2))
              this._getDirectiveByKeyId(p._keyId2);
            if (isPresent(p._keyId3))
              this._getDirectiveByKeyId(p._keyId3);
            if (isPresent(p._keyId4))
              this._getDirectiveByKeyId(p._keyId4);
            if (isPresent(p._keyId5))
              this._getDirectiveByKeyId(p._keyId5);
            if (isPresent(p._keyId6))
              this._getDirectiveByKeyId(p._keyId6);
            if (isPresent(p._keyId7))
              this._getDirectiveByKeyId(p._keyId7);
            if (isPresent(p._keyId8))
              this._getDirectiveByKeyId(p._keyId8);
            if (isPresent(p._keyId9))
              this._getDirectiveByKeyId(p._keyId9);
          },
          dynamicallyCreateComponent: function(directiveBinding, injector) {
            this._shadowDomAppInjector = injector;
            this._dynamicallyCreatedComponentBinding = directiveBinding;
            this._dynamicallyCreatedComponent = this._new(this._dynamicallyCreatedComponentBinding);
            return this._dynamicallyCreatedComponent;
          },
          _checkShadowDomAppInjector: function(shadowDomAppInjector) {
            if (this._proto._binding0IsComponent && isBlank(shadowDomAppInjector)) {
              throw new BaseException('A shadowDomAppInjector is required as this ElementInjector contains a component');
            } else if (!this._proto._binding0IsComponent && isPresent(shadowDomAppInjector)) {
              throw new BaseException('No shadowDomAppInjector allowed as there is not component stored in this ElementInjector');
            }
          },
          get: function(token) {
            if (this._isDynamicallyLoadedComponent(token)) {
              return this._dynamicallyCreatedComponent;
            }
            return this._getByKey(Key.get(token), 0, false, null);
          },
          _isDynamicallyLoadedComponent: function(token) {
            return isPresent(this._dynamicallyCreatedComponentBinding) && Key.get(token) === this._dynamicallyCreatedComponentBinding.key;
          },
          hasDirective: function(type) {
            return this._getDirectiveByKeyId(Key.get(type).id) !== _undefined;
          },
          getEventEmitterAccessors: function() {
            return this._proto.eventEmitterAccessors;
          },
          getNgElement: function() {
            return this._preBuiltObjects.element;
          },
          getChangeDetector: function() {
            return this._preBuiltObjects.changeDetector;
          },
          getComponent: function() {
            if (this._proto._binding0IsComponent) {
              return this._obj0;
            } else {
              throw new BaseException('There is no component stored in this ElementInjector');
            }
          },
          getElementRef: function() {
            return new ElementRef(this, this._preBuiltObjects.view, this._proto.index, this._lightDomAppInjector);
          },
          getDynamicallyLoadedComponent: function() {
            return this._dynamicallyCreatedComponent;
          },
          directParent: function() {
            return this._proto.distanceToParent < 2 ? this.parent : null;
          },
          _isComponentKey: function(key) {
            return this._proto._binding0IsComponent && key.id === this._proto._keyId0;
          },
          _isDynamicallyLoadedComponentKey: function(key) {
            return isPresent(this._dynamicallyCreatedComponentBinding) && key.id === this._dynamicallyCreatedComponentBinding.key.id;
          },
          _new: function(binding) {
            if (this._constructionCounter++ > _MAX_DIRECTIVE_CONSTRUCTION_COUNTER) {
              throw new CyclicDependencyError(binding.key);
            }
            var factory = binding.factory;
            var deps = binding.dependencies;
            var length = deps.length;
            var d0,
                d1,
                d2,
                d3,
                d4,
                d5,
                d6,
                d7,
                d8,
                d9;
            try {
              d0 = length > 0 ? this._getByDependency(deps[0], binding.key) : null;
              d1 = length > 1 ? this._getByDependency(deps[1], binding.key) : null;
              d2 = length > 2 ? this._getByDependency(deps[2], binding.key) : null;
              d3 = length > 3 ? this._getByDependency(deps[3], binding.key) : null;
              d4 = length > 4 ? this._getByDependency(deps[4], binding.key) : null;
              d5 = length > 5 ? this._getByDependency(deps[5], binding.key) : null;
              d6 = length > 6 ? this._getByDependency(deps[6], binding.key) : null;
              d7 = length > 7 ? this._getByDependency(deps[7], binding.key) : null;
              d8 = length > 8 ? this._getByDependency(deps[8], binding.key) : null;
              d9 = length > 9 ? this._getByDependency(deps[9], binding.key) : null;
            } catch (e) {
              if (e instanceof AbstractBindingError)
                e.addKey(binding.key);
              throw e;
            }
            var obj;
            switch (length) {
              case 0:
                obj = factory();
                break;
              case 1:
                obj = factory(d0);
                break;
              case 2:
                obj = factory(d0, d1);
                break;
              case 3:
                obj = factory(d0, d1, d2);
                break;
              case 4:
                obj = factory(d0, d1, d2, d3);
                break;
              case 5:
                obj = factory(d0, d1, d2, d3, d4);
                break;
              case 6:
                obj = factory(d0, d1, d2, d3, d4, d5);
                break;
              case 7:
                obj = factory(d0, d1, d2, d3, d4, d5, d6);
                break;
              case 8:
                obj = factory(d0, d1, d2, d3, d4, d5, d6, d7);
                break;
              case 9:
                obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8);
                break;
              case 10:
                obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9);
                break;
              default:
                throw ("Directive " + binding.key.token + " can only have up to 10 dependencies.");
            }
            this._addToQueries(obj, binding.key.token);
            return obj;
          },
          _getByDependency: function(dep, requestor) {
            if (isPresent(dep.propSetterName))
              return this._buildPropSetter(dep);
            if (isPresent(dep.attributeName))
              return this._buildAttribute(dep);
            if (isPresent(dep.queryDirective))
              return this._findQuery(dep.queryDirective).list;
            if (dep.key.id === StaticKeys.instance().elementRefId) {
              return this.getElementRef();
            }
            return this._getByKey(dep.key, dep.depth, dep.optional, requestor);
          },
          _buildPropSetter: function(dep) {
            var view = this._getPreBuiltObjectByKeyId(StaticKeys.instance().viewId);
            var renderer = view.renderer;
            var index = this._proto.index;
            return function(v) {
              renderer.setElementProperty(view.render, index, dep.propSetterName, v);
            };
          },
          _buildAttribute: function(dep) {
            var attributes = this._proto.attributes;
            if (isPresent(attributes) && MapWrapper.contains(attributes, dep.attributeName)) {
              return MapWrapper.get(attributes, dep.attributeName);
            } else {
              return null;
            }
          },
          _buildQueriesForDeps: function(deps) {
            for (var i = 0; i < deps.length; i++) {
              var dep = deps[i];
              if (isPresent(dep.queryDirective)) {
                this._createQueryRef(dep.queryDirective);
              }
            }
          },
          _createQueryRef: function(directive) {
            var queryList = new QueryList();
            if (isBlank(this._query0)) {
              this._query0 = new QueryRef(directive, queryList, this);
            } else if (isBlank(this._query1)) {
              this._query1 = new QueryRef(directive, queryList, this);
            } else if (isBlank(this._query2)) {
              this._query2 = new QueryRef(directive, queryList, this);
            } else
              throw new QueryError();
          },
          _addToQueries: function(obj, token) {
            if (isPresent(this._query0) && (this._query0.directive === token)) {
              this._query0.list.add(obj);
            }
            if (isPresent(this._query1) && (this._query1.directive === token)) {
              this._query1.list.add(obj);
            }
            if (isPresent(this._query2) && (this._query2.directive === token)) {
              this._query2.list.add(obj);
            }
          },
          _inheritQueries: function(parent) {
            if (isBlank(parent))
              return ;
            if (isPresent(parent._query0)) {
              this._query0 = parent._query0;
            }
            if (isPresent(parent._query1)) {
              this._query1 = parent._query1;
            }
            if (isPresent(parent._query2)) {
              this._query2 = parent._query2;
            }
          },
          _buildQueries: function() {
            if (isBlank(this._proto))
              return ;
            var p = this._proto;
            if (isPresent(p._binding0)) {
              this._buildQueriesForDeps(p._binding0.dependencies);
            }
            if (isPresent(p._binding1)) {
              this._buildQueriesForDeps(p._binding1.dependencies);
            }
            if (isPresent(p._binding2)) {
              this._buildQueriesForDeps(p._binding2.dependencies);
            }
            if (isPresent(p._binding3)) {
              this._buildQueriesForDeps(p._binding3.dependencies);
            }
            if (isPresent(p._binding4)) {
              this._buildQueriesForDeps(p._binding4.dependencies);
            }
            if (isPresent(p._binding5)) {
              this._buildQueriesForDeps(p._binding5.dependencies);
            }
            if (isPresent(p._binding6)) {
              this._buildQueriesForDeps(p._binding6.dependencies);
            }
            if (isPresent(p._binding7)) {
              this._buildQueriesForDeps(p._binding7.dependencies);
            }
            if (isPresent(p._binding8)) {
              this._buildQueriesForDeps(p._binding8.dependencies);
            }
            if (isPresent(p._binding9)) {
              this._buildQueriesForDeps(p._binding9.dependencies);
            }
          },
          _findQuery: function(token) {
            if (isPresent(this._query0) && this._query0.directive === token) {
              return this._query0;
            }
            if (isPresent(this._query1) && this._query1.directive === token) {
              return this._query1;
            }
            if (isPresent(this._query2) && this._query2.directive === token) {
              return this._query2;
            }
            throw new BaseException(("Cannot find query for directive " + token + "."));
          },
          link: function(parent) {
            parent.addChild(this);
            this._addParentQueries();
          },
          linkAfter: function(parent, prevSibling) {
            parent.addChildAfter(this, prevSibling);
            this._addParentQueries();
          },
          _addParentQueries: function() {
            if (isPresent(this.parent._query0)) {
              this._addQueryToTree(this.parent._query0);
              this.parent._query0.update();
            }
            if (isPresent(this.parent._query1)) {
              this._addQueryToTree(this.parent._query1);
              this.parent._query1.update();
            }
            if (isPresent(this.parent._query2)) {
              this._addQueryToTree(this.parent._query2);
              this.parent._query2.update();
            }
          },
          unlink: function() {
            var queriesToUpDate = [];
            if (isPresent(this.parent._query0)) {
              this._pruneQueryFromTree(this.parent._query0);
              ListWrapper.push(queriesToUpDate, this.parent._query0);
            }
            if (isPresent(this.parent._query1)) {
              this._pruneQueryFromTree(this.parent._query1);
              ListWrapper.push(queriesToUpDate, this.parent._query1);
            }
            if (isPresent(this.parent._query2)) {
              this._pruneQueryFromTree(this.parent._query2);
              ListWrapper.push(queriesToUpDate, this.parent._query2);
            }
            this.remove();
            ListWrapper.forEach(queriesToUpDate, (function(q) {
              return q.update();
            }));
          },
          _pruneQueryFromTree: function(query) {
            this._removeQueryRef(query);
            var child = this._head;
            while (isPresent(child)) {
              child._pruneQueryFromTree(query);
              child = child._next;
            }
          },
          _addQueryToTree: function(query) {
            this._assignQueryRef(query);
            var child = this._head;
            while (isPresent(child)) {
              child._addQueryToTree(query);
              child = child._next;
            }
          },
          _assignQueryRef: function(query) {
            if (isBlank(this._query0)) {
              this._query0 = query;
              return ;
            } else if (isBlank(this._query1)) {
              this._query1 = query;
              return ;
            } else if (isBlank(this._query2)) {
              this._query2 = query;
              return ;
            }
            throw new QueryError();
          },
          _removeQueryRef: function(query) {
            if (this._query0 == query)
              this._query0 = null;
            if (this._query1 == query)
              this._query1 = null;
            if (this._query2 == query)
              this._query2 = null;
          },
          _getByKey: function(key, depth, optional, requestor) {
            var ei = this;
            if (!this._shouldIncludeSelf(depth)) {
              depth -= ei._proto.distanceToParent;
              ei = ei._parent;
            }
            while (ei != null && depth >= 0) {
              var preBuiltObj = ei._getPreBuiltObjectByKeyId(key.id);
              if (preBuiltObj !== _undefined)
                return preBuiltObj;
              var dir = ei._getDirectiveByKeyId(key.id);
              if (dir !== _undefined)
                return dir;
              depth -= ei._proto.distanceToParent;
              ei = ei._parent;
            }
            if (isPresent(this._host) && this._host._isComponentKey(key)) {
              return this._host.getComponent();
            } else if (isPresent(this._host) && this._host._isDynamicallyLoadedComponentKey(key)) {
              return this._host.getDynamicallyLoadedComponent();
            } else if (optional) {
              return this._appInjector(requestor).getOptional(key);
            } else {
              return this._appInjector(requestor).get(key);
            }
          },
          _appInjector: function(requestor) {
            if (isPresent(requestor) && (this._isComponentKey(requestor) || this._isDynamicallyLoadedComponentKey(requestor))) {
              return this._shadowDomAppInjector;
            } else {
              return this._lightDomAppInjector;
            }
          },
          _shouldIncludeSelf: function(depth) {
            return depth === 0;
          },
          _getPreBuiltObjectByKeyId: function(keyId) {
            var staticKeys = StaticKeys.instance();
            if (keyId === staticKeys.viewId)
              return this._preBuiltObjects.view;
            if (keyId === staticKeys.ngElementId)
              return this._preBuiltObjects.element;
            if (keyId === staticKeys.viewContainerId)
              return this._preBuiltObjects.view.getOrCreateViewContainer(this._proto.index);
            if (keyId === staticKeys.changeDetectorRefId)
              return this._preBuiltObjects.changeDetector.ref;
            return _undefined;
          },
          _getDirectiveByKeyId: function(keyId) {
            var p = this._proto;
            if (p._keyId0 === keyId) {
              if (isBlank(this._obj0)) {
                this._obj0 = this._new(p._binding0);
              }
              return this._obj0;
            }
            if (p._keyId1 === keyId) {
              if (isBlank(this._obj1)) {
                this._obj1 = this._new(p._binding1);
              }
              return this._obj1;
            }
            if (p._keyId2 === keyId) {
              if (isBlank(this._obj2)) {
                this._obj2 = this._new(p._binding2);
              }
              return this._obj2;
            }
            if (p._keyId3 === keyId) {
              if (isBlank(this._obj3)) {
                this._obj3 = this._new(p._binding3);
              }
              return this._obj3;
            }
            if (p._keyId4 === keyId) {
              if (isBlank(this._obj4)) {
                this._obj4 = this._new(p._binding4);
              }
              return this._obj4;
            }
            if (p._keyId5 === keyId) {
              if (isBlank(this._obj5)) {
                this._obj5 = this._new(p._binding5);
              }
              return this._obj5;
            }
            if (p._keyId6 === keyId) {
              if (isBlank(this._obj6)) {
                this._obj6 = this._new(p._binding6);
              }
              return this._obj6;
            }
            if (p._keyId7 === keyId) {
              if (isBlank(this._obj7)) {
                this._obj7 = this._new(p._binding7);
              }
              return this._obj7;
            }
            if (p._keyId8 === keyId) {
              if (isBlank(this._obj8)) {
                this._obj8 = this._new(p._binding8);
              }
              return this._obj8;
            }
            if (p._keyId9 === keyId) {
              if (isBlank(this._obj9)) {
                this._obj9 = this._new(p._binding9);
              }
              return this._obj9;
            }
            return _undefined;
          },
          getDirectiveAtIndex: function(index) {
            if (index == 0)
              return this._obj0;
            if (index == 1)
              return this._obj1;
            if (index == 2)
              return this._obj2;
            if (index == 3)
              return this._obj3;
            if (index == 4)
              return this._obj4;
            if (index == 5)
              return this._obj5;
            if (index == 6)
              return this._obj6;
            if (index == 7)
              return this._obj7;
            if (index == 8)
              return this._obj8;
            if (index == 9)
              return this._obj9;
            throw new OutOfBoundsAccess(index);
          },
          hasInstances: function() {
            return this._constructionCounter > 0;
          },
          isExportingComponent: function() {
            return this._proto.exportComponent;
          },
          isExportingElement: function() {
            return this._proto.exportElement;
          },
          getExportImplicitName: function() {
            return this._proto.exportImplicitName;
          },
          getLightDomAppInjector: function() {
            return this._lightDomAppInjector;
          },
          getHost: function() {
            return this._host;
          },
          getBoundElementIndex: function() {
            return this._proto.index;
          }
        }, {}, $__super);
      }(TreeNode));
      $__export("ElementInjector", ElementInjector);
      Object.defineProperty(ElementInjector, "parameters", {get: function() {
          return [[ProtoElementInjector], [ElementInjector]];
        }});
      Object.defineProperty(ElementInjector.prototype.instantiateDirectives, "parameters", {get: function() {
          return [[Injector], [ElementInjector], [Injector], [PreBuiltObjects]];
        }});
      Object.defineProperty(ElementInjector.prototype.dynamicallyCreateComponent, "parameters", {get: function() {
          return [[], [Injector]];
        }});
      Object.defineProperty(ElementInjector.prototype._checkShadowDomAppInjector, "parameters", {get: function() {
          return [[Injector]];
        }});
      Object.defineProperty(ElementInjector.prototype.hasDirective, "parameters", {get: function() {
          return [[Type]];
        }});
      Object.defineProperty(ElementInjector.prototype._isComponentKey, "parameters", {get: function() {
          return [[Key]];
        }});
      Object.defineProperty(ElementInjector.prototype._isDynamicallyLoadedComponentKey, "parameters", {get: function() {
          return [[Key]];
        }});
      Object.defineProperty(ElementInjector.prototype._new, "parameters", {get: function() {
          return [[ResolvedBinding]];
        }});
      Object.defineProperty(ElementInjector.prototype._getByDependency, "parameters", {get: function() {
          return [[DirectiveDependency], [Key]];
        }});
      Object.defineProperty(ElementInjector.prototype._buildQueriesForDeps, "parameters", {get: function() {
          return [[assert.genericType(List, DirectiveDependency)]];
        }});
      Object.defineProperty(ElementInjector.prototype._inheritQueries, "parameters", {get: function() {
          return [[ElementInjector]];
        }});
      Object.defineProperty(ElementInjector.prototype.link, "parameters", {get: function() {
          return [[ElementInjector]];
        }});
      Object.defineProperty(ElementInjector.prototype.linkAfter, "parameters", {get: function() {
          return [[ElementInjector], [ElementInjector]];
        }});
      Object.defineProperty(ElementInjector.prototype._pruneQueryFromTree, "parameters", {get: function() {
          return [[QueryRef]];
        }});
      Object.defineProperty(ElementInjector.prototype._addQueryToTree, "parameters", {get: function() {
          return [[QueryRef]];
        }});
      Object.defineProperty(ElementInjector.prototype._assignQueryRef, "parameters", {get: function() {
          return [[QueryRef]];
        }});
      Object.defineProperty(ElementInjector.prototype._removeQueryRef, "parameters", {get: function() {
          return [[QueryRef]];
        }});
      Object.defineProperty(ElementInjector.prototype._getByKey, "parameters", {get: function() {
          return [[Key], [assert.type.number], [assert.type.boolean], [Key]];
        }});
      Object.defineProperty(ElementInjector.prototype._appInjector, "parameters", {get: function() {
          return [[Key]];
        }});
      Object.defineProperty(ElementInjector.prototype._shouldIncludeSelf, "parameters", {get: function() {
          return [[int]];
        }});
      Object.defineProperty(ElementInjector.prototype._getPreBuiltObjectByKeyId, "parameters", {get: function() {
          return [[int]];
        }});
      Object.defineProperty(ElementInjector.prototype._getDirectiveByKeyId, "parameters", {get: function() {
          return [[int]];
        }});
      Object.defineProperty(ElementInjector.prototype.getDirectiveAtIndex, "parameters", {get: function() {
          return [[int]];
        }});
      OutOfBoundsAccess = (function($__super) {
        function OutOfBoundsAccess(index) {
          $traceurRuntime.superConstructor(OutOfBoundsAccess).call(this);
          this.message = ("Index " + index + " is out-of-bounds.");
        }
        return ($traceurRuntime.createClass)(OutOfBoundsAccess, {toString: function() {
            return this.message;
          }}, {}, $__super);
      }(Error));
      QueryError = (function($__super) {
        function QueryError() {
          $traceurRuntime.superConstructor(QueryError).call(this);
          this.message = 'Only 3 queries can be concurrently active in a template.';
        }
        return ($traceurRuntime.createClass)(QueryError, {toString: function() {
            return this.message;
          }}, {}, $__super);
      }(Error));
      QueryRef = (function() {
        function QueryRef(directive, list, originator) {
          this.directive = directive;
          this.list = list;
          this.originator = originator;
        }
        return ($traceurRuntime.createClass)(QueryRef, {
          update: function() {
            var aggregator = [];
            this.visit(this.originator, aggregator);
            this.list.reset(aggregator);
          },
          visit: function(inj, aggregator) {
            if (isBlank(inj))
              return ;
            if (inj.hasDirective(this.directive)) {
              ListWrapper.push(aggregator, inj.get(this.directive));
            }
            var child = inj._head;
            while (isPresent(child)) {
              this.visit(child, aggregator);
              child = child._next;
            }
          }
        }, {});
      }());
      Object.defineProperty(QueryRef, "parameters", {get: function() {
          return [[], [QueryList], [ElementInjector]];
        }});
      Object.defineProperty(QueryRef.prototype.visit, "parameters", {get: function() {
          return [[ElementInjector], []];
        }});
    }
  };
});

System.register("angular2/src/core/compiler/interfaces", [], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/interfaces";
  var OnChange;
  return {
    setters: [],
    execute: function() {
      OnChange = (function() {
        function OnChange() {}
        return ($traceurRuntime.createClass)(OnChange, {onChange: function(changes) {
            throw "OnChange.onChange is not implemented";
          }}, {});
      }());
      $__export("OnChange", OnChange);
    }
  };
});

System.register("angular2/src/core/compiler/ng_element", ["angular2/src/dom/dom_adapter", "angular2/src/facade/lang", "../compiler/view", "angular2/src/render/dom/direct_dom_renderer"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/ng_element";
  var DOM,
      normalizeBlank,
      viewModule,
      DirectDomViewRef,
      NgElement;
  return {
    setters: [function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      normalizeBlank = $__m.normalizeBlank;
    }, function($__m) {
      viewModule = $__m;
    }, function($__m) {
      DirectDomViewRef = $__m.DirectDomViewRef;
    }],
    execute: function() {
      NgElement = (function() {
        function NgElement(view, boundElementIndex) {
          this._view = view;
          this._boundElementIndex = boundElementIndex;
        }
        return ($traceurRuntime.createClass)(NgElement, {
          get domElement() {
            var domViewRef = this._view.render;
            return domViewRef.delegate.boundElements[this._boundElementIndex];
          },
          getAttribute: function(name) {
            return normalizeBlank(DOM.getAttribute(this.domElement, name));
          }
        }, {});
      }());
      $__export("NgElement", NgElement);
      Object.defineProperty(NgElement.prototype.getAttribute, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
    }
  };
});

System.register("angular2/src/core/compiler/proto_view_factory", ["angular2/di", "angular2/src/facade/collection", "angular2/src/facade/lang", "angular2/src/reflection/reflection", "angular2/change_detection", "../annotations/annotations", "angular2/src/render/api", "./view", "./element_injector"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/proto_view_factory";
  var Injectable,
      List,
      ListWrapper,
      MapWrapper,
      isPresent,
      isBlank,
      reflector,
      ChangeDetection,
      Component,
      Viewport,
      DynamicComponent,
      renderApi,
      AppProtoView,
      ProtoElementInjector,
      DirectiveBinding,
      ProtoViewFactory,
      SortedDirectives,
      ParentProtoElementInjectorWithDistance;
  return {
    setters: [function($__m) {
      Injectable = $__m.Injectable;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
      MapWrapper = $__m.MapWrapper;
    }, function($__m) {
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
    }, function($__m) {
      reflector = $__m.reflector;
    }, function($__m) {
      ChangeDetection = $__m.ChangeDetection;
    }, function($__m) {
      Component = $__m.Component;
      Viewport = $__m.Viewport;
      DynamicComponent = $__m.DynamicComponent;
    }, function($__m) {
      renderApi = $__m;
    }, function($__m) {
      AppProtoView = $__m.AppProtoView;
    }, function($__m) {
      ProtoElementInjector = $__m.ProtoElementInjector;
      DirectiveBinding = $__m.DirectiveBinding;
    }],
    execute: function() {
      ProtoViewFactory = (function() {
        function ProtoViewFactory(changeDetection) {
          this._changeDetection = changeDetection;
        }
        return ($traceurRuntime.createClass)(ProtoViewFactory, {
          createProtoView: function(componentBinding, renderProtoView, directives) {
            var protoChangeDetector;
            if (isBlank(componentBinding)) {
              protoChangeDetector = this._changeDetection.createProtoChangeDetector('root', null);
            } else {
              var componentAnnotation = componentBinding.annotation;
              protoChangeDetector = this._changeDetection.createProtoChangeDetector('dummy', componentAnnotation.changeDetection);
            }
            var protoView = new AppProtoView(renderProtoView.render, protoChangeDetector);
            for (var i = 0; i < renderProtoView.elementBinders.length; i++) {
              var renderElementBinder = renderProtoView.elementBinders[i];
              var sortedDirectives = new SortedDirectives(renderElementBinder.directives, directives);
              var parentPeiWithDistance = this._findParentProtoElementInjectorWithDistance(i, protoView.elementBinders, renderProtoView.elementBinders);
              var protoElementInjector = this._createProtoElementInjector(i, parentPeiWithDistance, sortedDirectives, renderElementBinder);
              this._createElementBinder(protoView, renderElementBinder, protoElementInjector, sortedDirectives);
              this._createDirectiveBinders(protoView, sortedDirectives);
            }
            MapWrapper.forEach(renderProtoView.variableBindings, (function(mappedName, varName) {
              protoView.bindVariable(varName, mappedName);
            }));
            return protoView;
          },
          _findParentProtoElementInjectorWithDistance: function(binderIndex, elementBinders, renderElementBinders) {
            var distance = 0;
            do {
              var renderElementBinder = renderElementBinders[binderIndex];
              binderIndex = renderElementBinder.parentIndex;
              if (binderIndex !== -1) {
                distance += renderElementBinder.distanceToParent;
                var elementBinder = elementBinders[binderIndex];
                if (isPresent(elementBinder.protoElementInjector)) {
                  return new ParentProtoElementInjectorWithDistance(elementBinder.protoElementInjector, distance);
                }
              }
            } while (binderIndex !== -1);
            return new ParentProtoElementInjectorWithDistance(null, -1);
          },
          _createProtoElementInjector: function(binderIndex, parentPeiWithDistance, sortedDirectives, renderElementBinder) {
            var protoElementInjector = null;
            var hasVariables = MapWrapper.size(renderElementBinder.variableBindings) > 0;
            if (sortedDirectives.directives.length > 0 || hasVariables) {
              protoElementInjector = new ProtoElementInjector(parentPeiWithDistance.protoElementInjector, binderIndex, sortedDirectives.directives, isPresent(sortedDirectives.componentDirective), parentPeiWithDistance.distance);
              protoElementInjector.attributes = renderElementBinder.readAttributes;
              if (hasVariables && !isPresent(sortedDirectives.viewportDirective)) {
                protoElementInjector.exportComponent = isPresent(sortedDirectives.componentDirective);
                protoElementInjector.exportElement = isBlank(sortedDirectives.componentDirective);
                var exportImplicitName = MapWrapper.get(renderElementBinder.variableBindings, '\$implicit');
                if (isPresent(exportImplicitName)) {
                  protoElementInjector.exportImplicitName = exportImplicitName;
                }
              }
            }
            return protoElementInjector;
          },
          _createElementBinder: function(protoView, renderElementBinder, protoElementInjector, sortedDirectives) {
            var parent = null;
            if (renderElementBinder.parentIndex !== -1) {
              parent = protoView.elementBinders[renderElementBinder.parentIndex];
            }
            var elBinder = protoView.bindElement(parent, renderElementBinder.distanceToParent, protoElementInjector, sortedDirectives.componentDirective, sortedDirectives.viewportDirective);
            for (var i = 0; i < renderElementBinder.textBindings.length; i++) {
              protoView.bindTextNode(renderElementBinder.textBindings[i]);
            }
            MapWrapper.forEach(renderElementBinder.propertyBindings, (function(astWithSource, propertyName) {
              protoView.bindElementProperty(astWithSource, propertyName);
            }));
            protoView.bindEvent(renderElementBinder.eventBindings, -1);
            MapWrapper.forEach(renderElementBinder.variableBindings, (function(mappedName, varName) {
              MapWrapper.set(protoView.protoLocals, mappedName, null);
            }));
            return elBinder;
          },
          _createDirectiveBinders: function(protoView, sortedDirectives) {
            for (var i = 0; i < sortedDirectives.renderDirectives.length; i++) {
              var renderDirectiveMetadata = sortedDirectives.renderDirectives[i];
              MapWrapper.forEach(renderDirectiveMetadata.propertyBindings, (function(astWithSource, propertyName) {
                var setter = reflector.setter(propertyName);
                protoView.bindDirectiveProperty(i, astWithSource, propertyName, setter);
              }));
              protoView.bindEvent(renderDirectiveMetadata.eventBindings, i);
            }
          }
        }, {});
      }());
      $__export("ProtoViewFactory", ProtoViewFactory);
      Object.defineProperty(ProtoViewFactory, "annotations", {get: function() {
          return [new Injectable()];
        }});
      Object.defineProperty(ProtoViewFactory, "parameters", {get: function() {
          return [[ChangeDetection]];
        }});
      Object.defineProperty(ProtoViewFactory.prototype.createProtoView, "parameters", {get: function() {
          return [[DirectiveBinding], [renderApi.ProtoViewDto], [assert.genericType(List, DirectiveBinding)]];
        }});
      SortedDirectives = (function() {
        function SortedDirectives(renderDirectives, allDirectives) {
          var $__0 = this;
          this.renderDirectives = [];
          this.directives = [];
          this.viewportDirective = null;
          this.componentDirective = null;
          ListWrapper.forEach(renderDirectives, (function(renderDirectiveMetadata) {
            var directiveBinding = allDirectives[renderDirectiveMetadata.directiveIndex];
            if ((directiveBinding.annotation instanceof Component) || (directiveBinding.annotation instanceof DynamicComponent)) {
              $__0.componentDirective = directiveBinding;
              ListWrapper.insert($__0.renderDirectives, 0, renderDirectiveMetadata);
              ListWrapper.insert($__0.directives, 0, directiveBinding);
            } else {
              if (directiveBinding.annotation instanceof Viewport) {
                $__0.viewportDirective = directiveBinding;
              }
              ListWrapper.push($__0.renderDirectives, renderDirectiveMetadata);
              ListWrapper.push($__0.directives, directiveBinding);
            }
          }));
        }
        return ($traceurRuntime.createClass)(SortedDirectives, {}, {});
      }());
      ParentProtoElementInjectorWithDistance = (function() {
        function ParentProtoElementInjectorWithDistance(protoElementInjector, distance) {
          this.protoElementInjector = protoElementInjector;
          this.distance = distance;
        }
        return ($traceurRuntime.createClass)(ParentProtoElementInjectorWithDistance, {}, {});
      }());
      Object.defineProperty(ParentProtoElementInjectorWithDistance, "parameters", {get: function() {
          return [[ProtoElementInjector], [assert.type.number]];
        }});
    }
  };
});

System.register("angular2/src/core/compiler/query_list", ["./base_query_list"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/query_list";
  var BaseQueryList,
      QueryList;
  return {
    setters: [function($__m) {
      BaseQueryList = $__m.BaseQueryList;
    }],
    execute: function() {
      QueryList = (function($__super) {
        function QueryList() {
          $traceurRuntime.superConstructor(QueryList).apply(this, arguments);
        }
        return ($traceurRuntime.createClass)(QueryList, {
          onChange: function(callback) {
            return $traceurRuntime.superGet(this, QueryList.prototype, "onChange").call(this, callback);
          },
          removeCallback: function(callback) {
            return $traceurRuntime.superGet(this, QueryList.prototype, "removeCallback").call(this, callback);
          }
        }, {}, $__super);
      }(BaseQueryList));
      $__export("QueryList", QueryList);
    }
  };
});

System.register("angular2/src/core/compiler/template_resolver", ["angular2/di", "angular2/src/core/annotations/view", "angular2/src/facade/lang", "angular2/src/facade/collection", "angular2/src/reflection/reflection"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/template_resolver";
  var Injectable,
      View,
      Type,
      stringify,
      isBlank,
      BaseException,
      Map,
      MapWrapper,
      List,
      ListWrapper,
      reflector,
      TemplateResolver;
  return {
    setters: [function($__m) {
      Injectable = $__m.Injectable;
    }, function($__m) {
      View = $__m.View;
    }, function($__m) {
      Type = $__m.Type;
      stringify = $__m.stringify;
      isBlank = $__m.isBlank;
      BaseException = $__m.BaseException;
    }, function($__m) {
      Map = $__m.Map;
      MapWrapper = $__m.MapWrapper;
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      reflector = $__m.reflector;
    }],
    execute: function() {
      TemplateResolver = (function() {
        function TemplateResolver() {
          this._cache = MapWrapper.create();
        }
        return ($traceurRuntime.createClass)(TemplateResolver, {
          resolve: function(component) {
            var view = MapWrapper.get(this._cache, component);
            if (isBlank(view)) {
              view = this._resolve(component);
              MapWrapper.set(this._cache, component, view);
            }
            return view;
          },
          _resolve: function(component) {
            var annotations = reflector.annotations(component);
            for (var i = 0; i < annotations.length; i++) {
              var annotation = annotations[i];
              if (annotation instanceof View) {
                return annotation;
              }
            }
            throw new BaseException(("No template found for " + stringify(component)));
          }
        }, {});
      }());
      $__export("TemplateResolver", TemplateResolver);
      Object.defineProperty(TemplateResolver, "annotations", {get: function() {
          return [new Injectable()];
        }});
      Object.defineProperty(TemplateResolver.prototype.resolve, "parameters", {get: function() {
          return [[Type]];
        }});
      Object.defineProperty(TemplateResolver.prototype._resolve, "parameters", {get: function() {
          return [[Type]];
        }});
    }
  };
});

System.register("angular2/src/core/compiler/view", ["angular2/src/facade/collection", "angular2/change_detection", "./element_injector", "./element_binder", "angular2/src/reflection/types", "angular2/src/facade/lang", "./view_container", "angular2/src/render/api", "./view_factory", "./view_hydrator"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/view";
  var ListWrapper,
      MapWrapper,
      Map,
      StringMapWrapper,
      List,
      AST,
      Locals,
      ChangeDispatcher,
      ProtoChangeDetector,
      ChangeDetector,
      ChangeRecord,
      BindingRecord,
      DirectiveRecord,
      ChangeDetectorRef,
      ProtoElementInjector,
      ElementInjector,
      PreBuiltObjects,
      DirectiveBinding,
      ElementBinder,
      SetterFn,
      IMPLEMENTS,
      int,
      isPresent,
      isBlank,
      BaseException,
      ViewContainer,
      renderApi,
      vfModule,
      vhModule,
      AppView,
      AppProtoView;
  return {
    setters: [function($__m) {
      ListWrapper = $__m.ListWrapper;
      MapWrapper = $__m.MapWrapper;
      Map = $__m.Map;
      StringMapWrapper = $__m.StringMapWrapper;
      List = $__m.List;
    }, function($__m) {
      AST = $__m.AST;
      Locals = $__m.Locals;
      ChangeDispatcher = $__m.ChangeDispatcher;
      ProtoChangeDetector = $__m.ProtoChangeDetector;
      ChangeDetector = $__m.ChangeDetector;
      ChangeRecord = $__m.ChangeRecord;
      BindingRecord = $__m.BindingRecord;
      DirectiveRecord = $__m.DirectiveRecord;
      ChangeDetectorRef = $__m.ChangeDetectorRef;
    }, function($__m) {
      ProtoElementInjector = $__m.ProtoElementInjector;
      ElementInjector = $__m.ElementInjector;
      PreBuiltObjects = $__m.PreBuiltObjects;
      DirectiveBinding = $__m.DirectiveBinding;
    }, function($__m) {
      ElementBinder = $__m.ElementBinder;
    }, function($__m) {
      SetterFn = $__m.SetterFn;
    }, function($__m) {
      IMPLEMENTS = $__m.IMPLEMENTS;
      int = $__m.int;
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
      BaseException = $__m.BaseException;
    }, function($__m) {
      ViewContainer = $__m.ViewContainer;
    }, function($__m) {
      renderApi = $__m;
    }, function($__m) {
      vfModule = $__m;
    }, function($__m) {
      vhModule = $__m;
    }],
    execute: function() {
      AppView = (function() {
        function AppView(renderer, viewFactory, proto, protoLocals) {
          this.render = null;
          this.proto = proto;
          this.changeDetector = null;
          this.elementInjectors = null;
          this.rootElementInjectors = null;
          this.componentChildViews = null;
          this.viewContainers = ListWrapper.createFixedSize(this.proto.elementBinders.length);
          this.preBuiltObjects = null;
          this.context = null;
          this.locals = new Locals(null, MapWrapper.clone(protoLocals));
          this.renderer = renderer;
          this.viewFactory = viewFactory;
          this.viewHydrator = null;
          this.imperativeHostViews = [];
        }
        return ($traceurRuntime.createClass)(AppView, {
          init: function(changeDetector, elementInjectors, rootElementInjectors, preBuiltObjects, componentChildViews) {
            this.changeDetector = changeDetector;
            this.elementInjectors = elementInjectors;
            this.rootElementInjectors = rootElementInjectors;
            this.preBuiltObjects = preBuiltObjects;
            this.componentChildViews = componentChildViews;
          },
          getOrCreateViewContainer: function(boundElementIndex) {
            var viewContainer = this.viewContainers[boundElementIndex];
            if (isBlank(viewContainer)) {
              viewContainer = new ViewContainer(this, this.proto.elementBinders[boundElementIndex].nestedProtoView, this.elementInjectors[boundElementIndex]);
              this.viewContainers[boundElementIndex] = viewContainer;
            }
            return viewContainer;
          },
          setLocal: function(contextName, value) {
            if (!this.hydrated())
              throw new BaseException('Cannot set locals on dehydrated view.');
            if (!MapWrapper.contains(this.proto.variableBindings, contextName)) {
              return ;
            }
            var templateName = MapWrapper.get(this.proto.variableBindings, contextName);
            this.locals.set(templateName, value);
          },
          hydrated: function() {
            return isPresent(this.context);
          },
          triggerEventHandlers: function(eventName, eventObj, binderIndex) {
            var locals = MapWrapper.create();
            MapWrapper.set(locals, '$event', eventObj);
            this.dispatchEvent(binderIndex, eventName, locals);
          },
          notifyOnBinding: function(b, currentValue) {
            if (b.isElement()) {
              this.renderer.setElementProperty(this.render, b.elementIndex, b.propertyName, currentValue);
            } else {
              this.renderer.setText(this.render, b.elementIndex, currentValue);
            }
          },
          getDirectiveFor: function(directive) {
            var elementInjector = this.elementInjectors[directive.elementIndex];
            return elementInjector.getDirectiveAtIndex(directive.directiveIndex);
          },
          getDetectorFor: function(directive) {
            var elementInjector = this.elementInjectors[directive.elementIndex];
            return elementInjector.getChangeDetector();
          },
          dispatchEvent: function(elementIndex, eventName, locals) {
            var $__0 = this;
            var allowDefaultBehavior = true;
            if (this.hydrated()) {
              var elBinder = this.proto.elementBinders[elementIndex];
              if (isBlank(elBinder.hostListeners))
                return allowDefaultBehavior;
              var eventMap = elBinder.hostListeners[eventName];
              if (isBlank(eventMap))
                return allowDefaultBehavior;
              MapWrapper.forEach(eventMap, (function(expr, directiveIndex) {
                var context;
                if (directiveIndex === -1) {
                  context = $__0.context;
                } else {
                  context = $__0.elementInjectors[elementIndex].getDirectiveAtIndex(directiveIndex);
                }
                var result = expr.eval(context, new Locals($__0.locals, locals));
                if (isPresent(result)) {
                  allowDefaultBehavior = allowDefaultBehavior && result;
                }
              }));
            }
            return allowDefaultBehavior;
          }
        }, {});
      }());
      $__export("AppView", AppView);
      Object.defineProperty(AppView, "annotations", {get: function() {
          return [new IMPLEMENTS(ChangeDispatcher)];
        }});
      Object.defineProperty(AppView, "parameters", {get: function() {
          return [[renderApi.Renderer], [vfModule.ViewFactory], [AppProtoView], [Map]];
        }});
      Object.defineProperty(AppView.prototype.init, "parameters", {get: function() {
          return [[ChangeDetector], [List], [List], [List], [List]];
        }});
      Object.defineProperty(AppView.prototype.getOrCreateViewContainer, "parameters", {get: function() {
          return [[assert.type.number]];
        }});
      Object.defineProperty(AppView.prototype.setLocal, "parameters", {get: function() {
          return [[assert.type.string], []];
        }});
      Object.defineProperty(AppView.prototype.triggerEventHandlers, "parameters", {get: function() {
          return [[assert.type.string], [], [int]];
        }});
      Object.defineProperty(AppView.prototype.notifyOnBinding, "parameters", {get: function() {
          return [[BindingRecord], [assert.type.any]];
        }});
      Object.defineProperty(AppView.prototype.getDirectiveFor, "parameters", {get: function() {
          return [[DirectiveRecord]];
        }});
      Object.defineProperty(AppView.prototype.getDetectorFor, "parameters", {get: function() {
          return [[DirectiveRecord]];
        }});
      Object.defineProperty(AppView.prototype.dispatchEvent, "parameters", {get: function() {
          return [[assert.type.number], [assert.type.string], [assert.genericType(Map, assert.type.string, assert.type.any)]];
        }});
      AppProtoView = (function() {
        function AppProtoView(render, protoChangeDetector) {
          this.render = render;
          this.elementBinders = [];
          this.variableBindings = MapWrapper.create();
          this.protoLocals = MapWrapper.create();
          this.protoChangeDetector = protoChangeDetector;
          this.parentProtoView = null;
          this.textNodesWithBindingCount = 0;
          this.bindings = [];
          this._directiveRecordsMap = MapWrapper.create();
          this._variableBindings = null;
          this._directiveRecords = null;
        }
        return ($traceurRuntime.createClass)(AppProtoView, {
          getVariableBindings: function() {
            var $__0 = this;
            if (isPresent(this._variableBindings)) {
              return this._variableBindings;
            }
            this._variableBindings = isPresent(this.parentProtoView) ? ListWrapper.clone(this.parentProtoView.getVariableBindings()) : [];
            MapWrapper.forEach(this.protoLocals, (function(v, local) {
              ListWrapper.push($__0._variableBindings, local);
            }));
            return this._variableBindings;
          },
          getdirectiveRecords: function() {
            if (isPresent(this._directiveRecords)) {
              return this._directiveRecords;
            }
            this._directiveRecords = [];
            for (var injectorIndex = 0; injectorIndex < this.elementBinders.length; ++injectorIndex) {
              var pei = this.elementBinders[injectorIndex].protoElementInjector;
              if (isPresent(pei)) {
                for (var directiveIndex = 0; directiveIndex < pei.numberOfDirectives; ++directiveIndex) {
                  ListWrapper.push(this._directiveRecords, this._getDirectiveRecord(injectorIndex, directiveIndex));
                }
              }
            }
            return this._directiveRecords;
          },
          bindVariable: function(contextName, templateName) {
            MapWrapper.set(this.variableBindings, contextName, templateName);
            MapWrapper.set(this.protoLocals, templateName, null);
          },
          bindElement: function(parent, distanceToParent, protoElementInjector) {
            var componentDirective = arguments[3] !== (void 0) ? arguments[3] : null;
            var viewportDirective = arguments[4] !== (void 0) ? arguments[4] : null;
            var elBinder = new ElementBinder(this.elementBinders.length, parent, distanceToParent, protoElementInjector, componentDirective, viewportDirective);
            ListWrapper.push(this.elementBinders, elBinder);
            return elBinder;
          },
          bindTextNode: function(expression) {
            var textNodeIndex = this.textNodesWithBindingCount++;
            var b = BindingRecord.createForTextNode(expression, textNodeIndex);
            ListWrapper.push(this.bindings, b);
          },
          bindElementProperty: function(expression, setterName) {
            var elementIndex = this.elementBinders.length - 1;
            var b = BindingRecord.createForElement(expression, elementIndex, setterName);
            ListWrapper.push(this.bindings, b);
          },
          bindEvent: function(eventBindings) {
            var directiveIndex = arguments[1] !== (void 0) ? arguments[1] : -1;
            var elBinder = this.elementBinders[this.elementBinders.length - 1];
            var events = elBinder.hostListeners;
            if (isBlank(events)) {
              events = StringMapWrapper.create();
              elBinder.hostListeners = events;
            }
            for (var i = 0; i < eventBindings.length; i++) {
              var eventBinding = eventBindings[i];
              var eventName = eventBinding.fullName;
              var event = StringMapWrapper.get(events, eventName);
              if (isBlank(event)) {
                event = MapWrapper.create();
                StringMapWrapper.set(events, eventName, event);
              }
              MapWrapper.set(event, directiveIndex, eventBinding.source);
            }
          },
          bindDirectiveProperty: function(directiveIndex, expression, setterName, setter) {
            var elementIndex = this.elementBinders.length - 1;
            var directiveRecord = this._getDirectiveRecord(elementIndex, directiveIndex);
            var b = BindingRecord.createForDirective(expression, setterName, setter, directiveRecord);
            ListWrapper.push(this.bindings, b);
          },
          _getDirectiveRecord: function(elementInjectorIndex, directiveIndex) {
            var id = elementInjectorIndex * 100 + directiveIndex;
            var protoElementInjector = this.elementBinders[elementInjectorIndex].protoElementInjector;
            if (!MapWrapper.contains(this._directiveRecordsMap, id)) {
              var binding = protoElementInjector.getDirectiveBindingAtIndex(directiveIndex);
              var changeDetection = binding.changeDetection;
              MapWrapper.set(this._directiveRecordsMap, id, new DirectiveRecord(elementInjectorIndex, directiveIndex, binding.callOnAllChangesDone, binding.callOnChange, changeDetection));
            }
            return MapWrapper.get(this._directiveRecordsMap, id);
          }
        }, {});
      }());
      $__export("AppProtoView", AppProtoView);
      Object.defineProperty(AppProtoView, "parameters", {get: function() {
          return [[renderApi.ProtoViewRef], [ProtoChangeDetector]];
        }});
      Object.defineProperty(AppProtoView.prototype.bindVariable, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(AppProtoView.prototype.bindElement, "parameters", {get: function() {
          return [[ElementBinder], [int], [ProtoElementInjector], [DirectiveBinding], [DirectiveBinding]];
        }});
      Object.defineProperty(AppProtoView.prototype.bindTextNode, "parameters", {get: function() {
          return [[AST]];
        }});
      Object.defineProperty(AppProtoView.prototype.bindElementProperty, "parameters", {get: function() {
          return [[AST], [assert.type.string]];
        }});
      Object.defineProperty(AppProtoView.prototype.bindEvent, "parameters", {get: function() {
          return [[assert.genericType(List, renderApi.EventBinding)], [int]];
        }});
      Object.defineProperty(AppProtoView.prototype.bindDirectiveProperty, "parameters", {get: function() {
          return [[assert.type.number], [AST], [assert.type.string], [SetterFn]];
        }});
      Object.defineProperty(AppProtoView.prototype._getDirectiveRecord, "parameters", {get: function() {
          return [[assert.type.number], [assert.type.number]];
        }});
    }
  };
});

System.register("angular2/src/core/compiler/view_container", ["angular2/src/facade/collection", "angular2/src/facade/lang", "angular2/di", "angular2/src/core/compiler/element_injector", "./view", "angular2/src/render/api"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/view_container";
  var ListWrapper,
      MapWrapper,
      List,
      BaseException,
      Injector,
      eiModule,
      isPresent,
      isBlank,
      viewModule,
      ViewContainerRef,
      ViewContainer;
  return {
    setters: [function($__m) {
      ListWrapper = $__m.ListWrapper;
      MapWrapper = $__m.MapWrapper;
      List = $__m.List;
    }, function($__m) {
      BaseException = $__m.BaseException;
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
    }, function($__m) {
      Injector = $__m.Injector;
    }, function($__m) {
      eiModule = $__m;
    }, function($__m) {
      viewModule = $__m;
    }, function($__m) {
      ViewContainerRef = $__m.ViewContainerRef;
    }],
    execute: function() {
      ViewContainer = (function() {
        function ViewContainer(parentView, defaultProtoView, elementInjector) {
          this.parentView = parentView;
          this.defaultProtoView = defaultProtoView;
          this.elementInjector = elementInjector;
          this._views = [];
        }
        return ($traceurRuntime.createClass)(ViewContainer, {
          getRender: function() {
            return new ViewContainerRef(this.parentView.render, this.elementInjector.getBoundElementIndex());
          },
          internalClearWithoutRender: function() {
            for (var i = this._views.length - 1; i >= 0; i--) {
              this._detachInjectors(i);
            }
          },
          clear: function() {
            for (var i = this._views.length - 1; i >= 0; i--) {
              this.remove(i);
            }
          },
          get: function(index) {
            return this._views[index];
          },
          get length() {
            return this._views.length;
          },
          _siblingInjectorToLinkAfter: function(index) {
            if (index == 0)
              return null;
            return ListWrapper.last(this._views[index - 1].rootElementInjectors);
          },
          hydrated: function() {
            return this.parentView.hydrated();
          },
          create: function() {
            var atIndex = arguments[0] !== (void 0) ? arguments[0] : -1;
            var protoView = arguments[1] !== (void 0) ? arguments[1] : null;
            var injector = arguments[2] !== (void 0) ? arguments[2] : null;
            if (atIndex == -1)
              atIndex = this._views.length;
            if (!this.hydrated())
              throw new BaseException('Cannot create views on a dehydrated ViewContainer');
            if (isBlank(protoView)) {
              protoView = this.defaultProtoView;
            }
            var newView = this.parentView.viewFactory.getView(protoView);
            this._insertInjectors(newView, atIndex);
            this.parentView.viewHydrator.hydrateViewInViewContainer(this, atIndex, newView, injector);
            return newView;
          },
          insert: function(view) {
            var atIndex = arguments[1] !== (void 0) ? arguments[1] : -1;
            if (atIndex == -1)
              atIndex = this._views.length;
            this._insertInjectors(view, atIndex);
            this.parentView.changeDetector.addChild(view.changeDetector);
            this.parentView.renderer.insertViewIntoContainer(this.getRender(), atIndex, view.render);
            return view;
          },
          _insertInjectors: function(view, atIndex) {
            ListWrapper.insert(this._views, atIndex, view);
            this._linkElementInjectors(this._siblingInjectorToLinkAfter(atIndex), view);
            return view;
          },
          indexOf: function(view) {
            return ListWrapper.indexOf(this._views, view);
          },
          remove: function() {
            var atIndex = arguments[0] !== (void 0) ? arguments[0] : -1;
            if (atIndex == -1)
              atIndex = this._views.length - 1;
            var view = this._views[atIndex];
            this.parentView.viewHydrator.dehydrateViewInViewContainer(this, atIndex, view);
            this._detachInjectors(atIndex);
            this.parentView.viewFactory.returnView(view);
          },
          detach: function() {
            var atIndex = arguments[0] !== (void 0) ? arguments[0] : -1;
            if (atIndex == -1)
              atIndex = this._views.length - 1;
            var detachedView = this._detachInjectors(atIndex);
            detachedView.changeDetector.remove();
            this.parentView.renderer.detachViewFromContainer(this.getRender(), atIndex);
            return detachedView;
          },
          _detachInjectors: function(atIndex) {
            var detachedView = this.get(atIndex);
            ListWrapper.removeAt(this._views, atIndex);
            this._unlinkElementInjectors(detachedView);
            return detachedView;
          },
          _linkElementInjectors: function(sibling, view) {
            for (var i = view.rootElementInjectors.length - 1; i >= 0; i--) {
              view.rootElementInjectors[i].linkAfter(this.elementInjector, sibling);
            }
          },
          _unlinkElementInjectors: function(view) {
            for (var i = 0; i < view.rootElementInjectors.length; ++i) {
              view.rootElementInjectors[i].unlink();
            }
          }
        }, {});
      }());
      $__export("ViewContainer", ViewContainer);
      Object.defineProperty(ViewContainer, "parameters", {get: function() {
          return [[viewModule.AppView], [viewModule.AppProtoView], [eiModule.ElementInjector]];
        }});
      Object.defineProperty(ViewContainer.prototype.get, "parameters", {get: function() {
          return [[assert.type.number]];
        }});
      Object.defineProperty(ViewContainer.prototype._siblingInjectorToLinkAfter, "parameters", {get: function() {
          return [[assert.type.number]];
        }});
      Object.defineProperty(ViewContainer.prototype.create, "parameters", {get: function() {
          return [[], [viewModule.AppProtoView], [Injector]];
        }});
      Object.defineProperty(ViewContainer.prototype.indexOf, "parameters", {get: function() {
          return [[viewModule.AppView]];
        }});
    }
  };
});

System.register("angular2/src/core/compiler/view_factory", ["angular2/di", "angular2/src/facade/collection", "./element_injector", "angular2/src/facade/lang", "angular2/src/core/compiler/ng_element", "./view", "angular2/src/render/api"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/view_factory";
  var Injectable,
      Inject,
      OpaqueToken,
      ListWrapper,
      MapWrapper,
      Map,
      StringMapWrapper,
      List,
      eli,
      isPresent,
      isBlank,
      BaseException,
      NgElement,
      viewModule,
      Renderer,
      VIEW_POOL_CAPACITY,
      ViewFactory;
  return {
    setters: [function($__m) {
      Injectable = $__m.Injectable;
      Inject = $__m.Inject;
      OpaqueToken = $__m.OpaqueToken;
    }, function($__m) {
      ListWrapper = $__m.ListWrapper;
      MapWrapper = $__m.MapWrapper;
      Map = $__m.Map;
      StringMapWrapper = $__m.StringMapWrapper;
      List = $__m.List;
    }, function($__m) {
      eli = $__m;
    }, function($__m) {
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
      BaseException = $__m.BaseException;
    }, function($__m) {
      NgElement = $__m.NgElement;
    }, function($__m) {
      viewModule = $__m;
    }, function($__m) {
      Renderer = $__m.Renderer;
    }],
    execute: function() {
      VIEW_POOL_CAPACITY = 'ViewFactory.viewPoolCapacity';
      $__export("VIEW_POOL_CAPACITY", VIEW_POOL_CAPACITY);
      ViewFactory = (function() {
        function ViewFactory(poolCapacityPerProtoView, renderer) {
          this._poolCapacityPerProtoView = poolCapacityPerProtoView;
          this._pooledViewsPerProtoView = MapWrapper.create();
          this._renderer = renderer;
        }
        return ($traceurRuntime.createClass)(ViewFactory, {
          getView: function(protoView) {
            var pooledViews = MapWrapper.get(this._pooledViewsPerProtoView, protoView);
            if (isPresent(pooledViews) && pooledViews.length > 0) {
              return ListWrapper.removeLast(pooledViews);
            }
            return this._createView(protoView);
          },
          returnView: function(view) {
            if (view.hydrated()) {
              throw new BaseException('Only dehydrated Views can be put back into the pool!');
            }
            var protoView = view.proto;
            var pooledViews = MapWrapper.get(this._pooledViewsPerProtoView, protoView);
            if (isBlank(pooledViews)) {
              pooledViews = [];
              MapWrapper.set(this._pooledViewsPerProtoView, protoView, pooledViews);
            }
            if (pooledViews.length < this._poolCapacityPerProtoView) {
              ListWrapper.push(pooledViews, view);
            }
          },
          _createView: function(protoView) {
            var view = new viewModule.AppView(this._renderer, this, protoView, protoView.protoLocals);
            var changeDetector = protoView.protoChangeDetector.instantiate(view, protoView.bindings, protoView.getVariableBindings(), protoView.getdirectiveRecords());
            var binders = protoView.elementBinders;
            var elementInjectors = ListWrapper.createFixedSize(binders.length);
            var rootElementInjectors = [];
            var preBuiltObjects = ListWrapper.createFixedSize(binders.length);
            var componentChildViews = ListWrapper.createFixedSize(binders.length);
            for (var binderIdx = 0; binderIdx < binders.length; binderIdx++) {
              var binder = binders[binderIdx];
              var elementInjector = null;
              var protoElementInjector = binder.protoElementInjector;
              if (isPresent(protoElementInjector)) {
                if (isPresent(protoElementInjector.parent)) {
                  var parentElementInjector = elementInjectors[protoElementInjector.parent.index];
                  elementInjector = protoElementInjector.instantiate(parentElementInjector);
                } else {
                  elementInjector = protoElementInjector.instantiate(null);
                  ListWrapper.push(rootElementInjectors, elementInjector);
                }
              }
              elementInjectors[binderIdx] = elementInjector;
              var childChangeDetector = null;
              if (binder.hasStaticComponent()) {
                var childView = this._createView(binder.nestedProtoView);
                childChangeDetector = childView.changeDetector;
                changeDetector.addShadowDomChild(childChangeDetector);
                componentChildViews[binderIdx] = childView;
              }
              if (isPresent(elementInjector)) {
                preBuiltObjects[binderIdx] = new eli.PreBuiltObjects(view, new NgElement(view, binderIdx), childChangeDetector);
              }
            }
            view.init(changeDetector, elementInjectors, rootElementInjectors, preBuiltObjects, componentChildViews);
            return view;
          }
        }, {});
      }());
      $__export("ViewFactory", ViewFactory);
      Object.defineProperty(ViewFactory, "annotations", {get: function() {
          return [new Injectable()];
        }});
      Object.defineProperty(ViewFactory, "parameters", {get: function() {
          return [[new Inject(VIEW_POOL_CAPACITY)], [Renderer]];
        }});
      Object.defineProperty(ViewFactory.prototype.getView, "parameters", {get: function() {
          return [[viewModule.AppProtoView]];
        }});
      Object.defineProperty(ViewFactory.prototype.returnView, "parameters", {get: function() {
          return [[viewModule.AppView]];
        }});
      Object.defineProperty(ViewFactory.prototype._createView, "parameters", {get: function() {
          return [[viewModule.AppProtoView]];
        }});
    }
  };
});

System.register("angular2/src/core/compiler/view_hydrator", ["angular2/di", "angular2/src/facade/collection", "./element_injector", "angular2/src/facade/lang", "./view_container", "./view", "angular2/change_detection", "angular2/src/render/api", "angular2/src/core/compiler/view_factory"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/compiler/view_hydrator";
  var Injectable,
      Inject,
      OpaqueToken,
      Injector,
      ListWrapper,
      MapWrapper,
      Map,
      StringMapWrapper,
      List,
      eli,
      isPresent,
      isBlank,
      BaseException,
      vcModule,
      viewModule,
      BindingPropagationConfig,
      Locals,
      renderApi,
      ViewFactory,
      AppViewHydrator;
  return {
    setters: [function($__m) {
      Injectable = $__m.Injectable;
      Inject = $__m.Inject;
      OpaqueToken = $__m.OpaqueToken;
      Injector = $__m.Injector;
    }, function($__m) {
      ListWrapper = $__m.ListWrapper;
      MapWrapper = $__m.MapWrapper;
      Map = $__m.Map;
      StringMapWrapper = $__m.StringMapWrapper;
      List = $__m.List;
    }, function($__m) {
      eli = $__m;
    }, function($__m) {
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
      BaseException = $__m.BaseException;
    }, function($__m) {
      vcModule = $__m;
    }, function($__m) {
      viewModule = $__m;
    }, function($__m) {
      BindingPropagationConfig = $__m.BindingPropagationConfig;
      Locals = $__m.Locals;
    }, function($__m) {
      renderApi = $__m;
    }, function($__m) {
      ViewFactory = $__m.ViewFactory;
    }],
    execute: function() {
      AppViewHydrator = (function() {
        function AppViewHydrator(renderer, viewFactory) {
          this._renderer = renderer;
          this._viewFactory = viewFactory;
        }
        return ($traceurRuntime.createClass)(AppViewHydrator, {
          hydrateDynamicComponentView: function(location, componentView, componentDirective, injector) {
            var hostView = location.hostView;
            var boundElementIndex = location.boundElementIndex;
            var binder = hostView.proto.elementBinders[boundElementIndex];
            if (!binder.hasDynamicComponent()) {
              throw new BaseException(("There is no dynamic component directive at element " + boundElementIndex));
            }
            if (isPresent(hostView.componentChildViews[boundElementIndex])) {
              throw new BaseException(("There already is a bound component at element " + boundElementIndex));
            }
            var hostElementInjector = hostView.elementInjectors[boundElementIndex];
            if (isBlank(injector)) {
              injector = hostElementInjector.getLightDomAppInjector();
            }
            var shadowDomAppInjector = this._createShadowDomAppInjector(componentDirective, injector);
            if (isBlank(shadowDomAppInjector)) {
              shadowDomAppInjector = null;
            }
            var component = hostElementInjector.dynamicallyCreateComponent(componentDirective, shadowDomAppInjector);
            hostView.componentChildViews[boundElementIndex] = componentView;
            hostView.changeDetector.addShadowDomChild(componentView.changeDetector);
            var renderViewRefs = this._renderer.createDynamicComponentView(hostView.render, boundElementIndex, componentView.proto.render);
            this._viewHydrateRecurse(componentView, renderViewRefs, 0, shadowDomAppInjector, hostElementInjector, component, null);
          },
          dehydrateDynamicComponentView: function(parentView, boundElementIndex) {
            throw new BaseException('Not yet implemented!');
          },
          hydrateInPlaceHostView: function(parentComponentLocation, hostElementSelector, hostView, injector) {
            var parentRenderViewRef = null;
            if (isPresent(parentComponentLocation)) {
              var parentView = parentComponentLocation.hostView.componentChildViews[parentComponentLocation.boundElementIndex];
              parentRenderViewRef = parentView.render;
              parentView.changeDetector.addChild(hostView.changeDetector);
              ListWrapper.push(parentView.imperativeHostViews, hostView);
              if (isBlank(injector)) {
                injector = parentComponentLocation.injector;
              }
            }
            var binder = hostView.proto.elementBinders[0];
            var shadowDomAppInjector = this._createShadowDomAppInjector(binder.componentDirective, injector);
            var renderViewRefs = this._renderer.createInPlaceHostView(parentRenderViewRef, hostElementSelector, hostView.proto.render);
            this._viewHydrateRecurse(hostView, renderViewRefs, 0, shadowDomAppInjector, null, new Object(), null);
          },
          dehydrateInPlaceHostView: function(parentComponentLocation, hostView) {
            var parentRenderViewRef = null;
            if (isPresent(parentComponentLocation)) {
              var parentView = parentComponentLocation.hostView.componentChildViews[parentComponentLocation.boundElementIndex];
              parentRenderViewRef = parentView.render;
              ListWrapper.remove(parentView.imperativeHostViews, hostView);
              parentView.changeDetector.removeChild(hostView.changeDetector);
            }
            var render = hostView.render;
            this._viewDehydrateRecurse(hostView);
            this._renderer.destroyInPlaceHostView(parentRenderViewRef, render);
          },
          hydrateViewInViewContainer: function(viewContainer, atIndex, view) {
            var injector = arguments[3] !== (void 0) ? arguments[3] : null;
            if (!viewContainer.hydrated())
              throw new BaseException('Cannot create views on a dehydrated ViewContainer');
            if (isBlank(injector)) {
              injector = viewContainer.elementInjector.getLightDomAppInjector();
            }
            var renderViewRefs = this._renderer.createViewInContainer(viewContainer.getRender(), atIndex, view.proto.render);
            viewContainer.parentView.changeDetector.addChild(view.changeDetector);
            this._viewHydrateRecurse(view, renderViewRefs, 0, injector, viewContainer.elementInjector.getHost(), viewContainer.parentView.context, viewContainer.parentView.locals);
          },
          dehydrateViewInViewContainer: function(viewContainer, atIndex, view) {
            view.changeDetector.remove();
            this._viewDehydrateRecurse(view);
            this._renderer.destroyViewInContainer(viewContainer.getRender(), atIndex);
          },
          _viewHydrateRecurse: function(view, renderComponentViewRefs, renderComponentIndex, appInjector, hostElementInjector, context, locals) {
            if (view.hydrated())
              throw new BaseException('The view is already hydrated.');
            view.viewHydrator = this;
            view.render = renderComponentViewRefs[renderComponentIndex++];
            view.context = context;
            view.locals.parent = locals;
            var binders = view.proto.elementBinders;
            for (var i = 0; i < binders.length; ++i) {
              var componentDirective = binders[i].componentDirective;
              var shadowDomAppInjector = null;
              if (isPresent(componentDirective)) {
                shadowDomAppInjector = this._createShadowDomAppInjector(componentDirective, appInjector);
              } else {
                shadowDomAppInjector = null;
              }
              var elementInjector = view.elementInjectors[i];
              if (isPresent(elementInjector)) {
                elementInjector.instantiateDirectives(appInjector, hostElementInjector, shadowDomAppInjector, view.preBuiltObjects[i]);
                this._setUpEventEmitters(view, elementInjector, i);
                var exportImplicitName = elementInjector.getExportImplicitName();
                if (elementInjector.isExportingComponent()) {
                  view.locals.set(exportImplicitName, elementInjector.getComponent());
                } else if (elementInjector.isExportingElement()) {
                  view.locals.set(exportImplicitName, elementInjector.getNgElement().domElement);
                }
              }
              if (binders[i].hasStaticComponent()) {
                renderComponentIndex = this._viewHydrateRecurse(view.componentChildViews[i], renderComponentViewRefs, renderComponentIndex, shadowDomAppInjector, elementInjector, elementInjector.getComponent(), null);
              }
            }
            view.changeDetector.hydrate(view.context, view.locals, view);
            view.renderer.setEventDispatcher(view.render, view);
            return renderComponentIndex;
          },
          _setUpEventEmitters: function(view, elementInjector, boundElementIndex) {
            var emitters = elementInjector.getEventEmitterAccessors();
            for (var directiveIndex = 0; directiveIndex < emitters.length; ++directiveIndex) {
              var directiveEmitters = emitters[directiveIndex];
              var directive = elementInjector.getDirectiveAtIndex(directiveIndex);
              for (var eventIndex = 0; eventIndex < directiveEmitters.length; ++eventIndex) {
                var eventEmitterAccessor = directiveEmitters[eventIndex];
                eventEmitterAccessor.subscribe(view, boundElementIndex, directive);
              }
            }
          },
          _viewDehydrateRecurse: function(view) {
            for (var i = 0; i < view.componentChildViews.length; i++) {
              var componentView = view.componentChildViews[i];
              if (isPresent(componentView)) {
                this._viewDehydrateRecurse(componentView);
                var binder = view.proto.elementBinders[i];
                if (binder.hasDynamicComponent()) {
                  view.changeDetector.removeShadowDomChild(componentView.changeDetector);
                  view.componentChildViews[i] = null;
                  this._viewFactory.returnView(componentView);
                }
              }
            }
            for (var i = 0; i < view.imperativeHostViews.length; i++) {
              var hostView = view.imperativeHostViews[i];
              this._viewDehydrateRecurse(hostView);
              view.changeDetector.removeChild(hostView.changeDetector);
              this._viewFactory.returnView(hostView);
            }
            view.imperativeHostViews = [];
            for (var i = 0; i < view.elementInjectors.length; i++) {
              if (isPresent(view.elementInjectors[i])) {
                view.elementInjectors[i].clearDirectives();
              }
            }
            if (isPresent(view.viewContainers)) {
              for (var i = 0; i < view.viewContainers.length; i++) {
                var vc = view.viewContainers[i];
                if (isPresent(vc)) {
                  this._viewContainerDehydrateRecurse(vc);
                }
              }
            }
            view.render = null;
            if (isPresent(view.locals)) {
              view.locals.clearValues();
            }
            view.context = null;
            view.changeDetector.dehydrate();
          },
          _createShadowDomAppInjector: function(componentDirective, appInjector) {
            var shadowDomAppInjector = null;
            var injectables = componentDirective.resolvedInjectables;
            if (isPresent(injectables)) {
              shadowDomAppInjector = appInjector.createChildFromResolved(injectables);
            } else {
              shadowDomAppInjector = appInjector;
            }
            return shadowDomAppInjector;
          },
          _viewContainerDehydrateRecurse: function(viewContainer) {
            for (var i = 0; i < viewContainer.length; i++) {
              var view = viewContainer.get(i);
              view.changeDetector.remove();
              this._viewDehydrateRecurse(view);
            }
            viewContainer.internalClearWithoutRender();
          }
        }, {});
      }());
      $__export("AppViewHydrator", AppViewHydrator);
      Object.defineProperty(AppViewHydrator, "annotations", {get: function() {
          return [new Injectable()];
        }});
      Object.defineProperty(AppViewHydrator, "parameters", {get: function() {
          return [[renderApi.Renderer], [ViewFactory]];
        }});
      Object.defineProperty(AppViewHydrator.prototype.hydrateDynamicComponentView, "parameters", {get: function() {
          return [[eli.ElementRef], [viewModule.AppView], [eli.DirectiveBinding], [Injector]];
        }});
      Object.defineProperty(AppViewHydrator.prototype.dehydrateDynamicComponentView, "parameters", {get: function() {
          return [[viewModule.AppView], [assert.type.number]];
        }});
      Object.defineProperty(AppViewHydrator.prototype.hydrateInPlaceHostView, "parameters", {get: function() {
          return [[eli.ElementRef], [], [viewModule.AppView], [Injector]];
        }});
      Object.defineProperty(AppViewHydrator.prototype.dehydrateInPlaceHostView, "parameters", {get: function() {
          return [[eli.ElementRef], [viewModule.AppView]];
        }});
      Object.defineProperty(AppViewHydrator.prototype.hydrateViewInViewContainer, "parameters", {get: function() {
          return [[vcModule.ViewContainer], [assert.type.number], [viewModule.AppView], [Injector]];
        }});
      Object.defineProperty(AppViewHydrator.prototype.dehydrateViewInViewContainer, "parameters", {get: function() {
          return [[vcModule.ViewContainer], [assert.type.number], [viewModule.AppView]];
        }});
      Object.defineProperty(AppViewHydrator.prototype._viewHydrateRecurse, "parameters", {get: function() {
          return [[viewModule.AppView], [assert.genericType(List, renderApi.ViewRef)], [assert.type.number], [Injector], [eli.ElementInjector], [Object], [Locals]];
        }});
      Object.defineProperty(AppViewHydrator.prototype._setUpEventEmitters, "parameters", {get: function() {
          return [[viewModule.AppView], [eli.ElementInjector], [assert.type.number]];
        }});
      Object.defineProperty(AppViewHydrator.prototype._viewDehydrateRecurse, "parameters", {get: function() {
          return [[viewModule.AppView]];
        }});
      Object.defineProperty(AppViewHydrator.prototype._viewContainerDehydrateRecurse, "parameters", {get: function() {
          return [[vcModule.ViewContainer]];
        }});
    }
  };
});

System.register("angular2/src/core/life_cycle/life_cycle", ["angular2/di", "angular2/change_detection", "angular2/src/core/zone/vm_turn_zone", "angular2/src/core/exception_handler", "angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/life_cycle/life_cycle";
  var Injectable,
      ChangeDetector,
      VmTurnZone,
      ExceptionHandler,
      isPresent,
      LifeCycle;
  return {
    setters: [function($__m) {
      Injectable = $__m.Injectable;
    }, function($__m) {
      ChangeDetector = $__m.ChangeDetector;
    }, function($__m) {
      VmTurnZone = $__m.VmTurnZone;
    }, function($__m) {
      ExceptionHandler = $__m.ExceptionHandler;
    }, function($__m) {
      isPresent = $__m.isPresent;
    }],
    execute: function() {
      LifeCycle = (function() {
        function LifeCycle(exceptionHandler) {
          var changeDetector = arguments[1] !== (void 0) ? arguments[1] : null;
          var enforceNoNewChanges = arguments[2] !== (void 0) ? arguments[2] : false;
          this._errorHandler = (function(exception, stackTrace) {
            exceptionHandler.call(exception, stackTrace);
            throw exception;
          });
          this._changeDetector = changeDetector;
          this._enforceNoNewChanges = enforceNoNewChanges;
        }
        return ($traceurRuntime.createClass)(LifeCycle, {
          registerWith: function(zone) {
            var changeDetector = arguments[1] !== (void 0) ? arguments[1] : null;
            var $__0 = this;
            if (isPresent(changeDetector)) {
              this._changeDetector = changeDetector;
            }
            zone.initCallbacks({
              onErrorHandler: this._errorHandler,
              onTurnDone: (function() {
                return $__0.tick();
              })
            });
          },
          tick: function() {
            this._changeDetector.detectChanges();
            if (this._enforceNoNewChanges) {
              this._changeDetector.checkNoChanges();
            }
          }
        }, {});
      }());
      $__export("LifeCycle", LifeCycle);
      Object.defineProperty(LifeCycle, "annotations", {get: function() {
          return [new Injectable()];
        }});
      Object.defineProperty(LifeCycle, "parameters", {get: function() {
          return [[ExceptionHandler], [ChangeDetector], [assert.type.boolean]];
        }});
      Object.defineProperty(LifeCycle.prototype.registerWith, "parameters", {get: function() {
          return [[VmTurnZone], [ChangeDetector]];
        }});
    }
  };
});

System.register("angular2/src/core/testability/get_testability", ["angular2/src/core/testability/testability", "angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/testability/get_testability";
  var TestabilityRegistry,
      Testability,
      global,
      PublicTestability,
      GetTestability;
  return {
    setters: [function($__m) {
      TestabilityRegistry = $__m.TestabilityRegistry;
      Testability = $__m.Testability;
    }, function($__m) {
      global = $__m.global;
    }],
    execute: function() {
      PublicTestability = (function() {
        function PublicTestability(testability) {
          this._testability = testability;
        }
        return ($traceurRuntime.createClass)(PublicTestability, {
          whenStable: function(callback) {
            this._testability.whenStable(callback);
          },
          findBindings: function(using, binding, exactMatch) {
            return this._testability.findBindings(using, binding, exactMatch);
          }
        }, {});
      }());
      Object.defineProperty(PublicTestability, "parameters", {get: function() {
          return [[Testability]];
        }});
      Object.defineProperty(PublicTestability.prototype.whenStable, "parameters", {get: function() {
          return [[Function]];
        }});
      Object.defineProperty(PublicTestability.prototype.findBindings, "parameters", {get: function() {
          return [[], [assert.type.string], [assert.type.boolean]];
        }});
      GetTestability = (function() {
        function GetTestability() {}
        return ($traceurRuntime.createClass)(GetTestability, {}, {addToWindow: function(registry) {
            global.getAngularTestability = function(elem) {
              var testability = registry.findTestabilityInTree(elem);
              if (testability == null) {
                throw new Error('Could not find testability for element.');
              }
              return new PublicTestability(testability);
            };
          }});
      }());
      $__export("GetTestability", GetTestability);
      Object.defineProperty(GetTestability.addToWindow, "parameters", {get: function() {
          return [[TestabilityRegistry]];
        }});
    }
  };
});

System.register("angular2/src/core/testability/testability", ["angular2/di", "angular2/src/dom/dom_adapter", "angular2/src/facade/collection", "angular2/src/facade/lang", "angular2/src/core/testability/get_testability"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/testability/testability";
  var Injectable,
      DOM,
      Map,
      MapWrapper,
      List,
      ListWrapper,
      StringWrapper,
      isBlank,
      BaseException,
      getTestabilityModule,
      Testability,
      TestabilityRegistry;
  return {
    setters: [function($__m) {
      Injectable = $__m.Injectable;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      Map = $__m.Map;
      MapWrapper = $__m.MapWrapper;
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      StringWrapper = $__m.StringWrapper;
      isBlank = $__m.isBlank;
      BaseException = $__m.BaseException;
    }, function($__m) {
      getTestabilityModule = $__m;
    }],
    execute: function() {
      Testability = (function() {
        function Testability() {
          this._pendingCount = 0;
          this._callbacks = ListWrapper.create();
        }
        return ($traceurRuntime.createClass)(Testability, {
          increaseCount: function() {
            var delta = arguments[0] !== (void 0) ? arguments[0] : 1;
            this._pendingCount += delta;
            if (this._pendingCount < 0) {
              throw new BaseException('pending async requests below zero');
            } else if (this._pendingCount == 0) {
              this._runCallbacks();
            }
            return this._pendingCount;
          },
          _runCallbacks: function() {
            while (this._callbacks.length !== 0) {
              ListWrapper.removeLast(this._callbacks)();
            }
          },
          whenStable: function(callback) {
            ListWrapper.push(this._callbacks, callback);
            if (this._pendingCount === 0) {
              this._runCallbacks();
            }
          },
          getPendingCount: function() {
            return this._pendingCount;
          },
          findBindings: function(using, binding, exactMatch) {
            return [];
          }
        }, {});
      }());
      $__export("Testability", Testability);
      Object.defineProperty(Testability, "annotations", {get: function() {
          return [new Injectable()];
        }});
      Object.defineProperty(Testability.prototype.increaseCount, "parameters", {get: function() {
          return [[assert.type.number]];
        }});
      Object.defineProperty(Testability.prototype.whenStable, "parameters", {get: function() {
          return [[Function]];
        }});
      Object.defineProperty(Testability.prototype.findBindings, "parameters", {get: function() {
          return [[], [assert.type.string], [assert.type.boolean]];
        }});
      TestabilityRegistry = (function() {
        function TestabilityRegistry() {
          this._applications = MapWrapper.create();
          getTestabilityModule.GetTestability.addToWindow(this);
        }
        return ($traceurRuntime.createClass)(TestabilityRegistry, {
          registerApplication: function(token, testability) {
            MapWrapper.set(this._applications, token, testability);
          },
          findTestabilityInTree: function(elem) {
            if (elem == null) {
              return null;
            }
            if (MapWrapper.contains(this._applications, elem)) {
              return MapWrapper.get(this._applications, elem);
            }
            if (DOM.isShadowRoot(elem)) {
              return this.findTestabilityInTree(DOM.getHost(elem));
            }
            return this.findTestabilityInTree(DOM.parentElement(elem));
          }
        }, {});
      }());
      $__export("TestabilityRegistry", TestabilityRegistry);
      Object.defineProperty(TestabilityRegistry, "annotations", {get: function() {
          return [new Injectable()];
        }});
      Object.defineProperty(TestabilityRegistry.prototype.registerApplication, "parameters", {get: function() {
          return [[], [Testability]];
        }});
    }
  };
});

System.register("angular2/src/core/zone/vm_turn_zone", ["angular2/src/facade/collection", "angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/core/zone/vm_turn_zone";
  var List,
      ListWrapper,
      StringMapWrapper,
      normalizeBlank,
      isPresent,
      global,
      VmTurnZone;
  return {
    setters: [function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
      StringMapWrapper = $__m.StringMapWrapper;
    }, function($__m) {
      normalizeBlank = $__m.normalizeBlank;
      isPresent = $__m.isPresent;
      global = $__m.global;
    }],
    execute: function() {
      VmTurnZone = (function() {
        function VmTurnZone($__2) {
          var enableLongStackTrace = $__2.enableLongStackTrace;
          this._nestedRunCounter = 0;
          this._onTurnStart = null;
          this._onTurnDone = null;
          this._onErrorHandler = null;
          this._outerZone = global.zone;
          this._innerZone = this._createInnerZone(this._outerZone, enableLongStackTrace);
        }
        return ($traceurRuntime.createClass)(VmTurnZone, {
          initCallbacks: function() {
            var $__2 = arguments[0] !== (void 0) ? arguments[0] : {},
                onTurnStart = $__2.onTurnStart,
                onTurnDone = $__2.onTurnDone,
                onScheduleMicrotask = $__2.onScheduleMicrotask,
                onErrorHandler = $__2.onErrorHandler;
            this._onTurnStart = normalizeBlank(onTurnStart);
            this._onTurnDone = normalizeBlank(onTurnDone);
            this._onErrorHandler = normalizeBlank(onErrorHandler);
          },
          run: function(fn) {
            return this._innerZone.run(fn);
          },
          runOutsideAngular: function(fn) {
            return this._outerZone.run(fn);
          },
          _createInnerZone: function(zone, enableLongStackTrace) {
            var $__0 = this;
            var vmTurnZone = this;
            var errorHandling;
            if (enableLongStackTrace) {
              errorHandling = StringMapWrapper.merge(Zone.longStackTraceZone, {onError: function(e) {
                  vmTurnZone._onError(this, e);
                }});
            } else {
              errorHandling = {onError: function(e) {
                  vmTurnZone._onError(this, e);
                }};
            }
            return zone.fork(errorHandling).fork({
              beforeTask: (function() {
                $__0._beforeTask();
              }),
              afterTask: (function() {
                $__0._afterTask();
              })
            });
          },
          _beforeTask: function() {
            this._nestedRunCounter++;
            if (this._nestedRunCounter === 1 && this._onTurnStart) {
              this._onTurnStart();
            }
          },
          _afterTask: function() {
            this._nestedRunCounter--;
            if (this._nestedRunCounter === 0 && this._onTurnDone) {
              this._onTurnDone();
            }
          },
          _onError: function(zone, e) {
            if (isPresent(this._onErrorHandler)) {
              var trace = [normalizeBlank(e.stack)];
              while (zone && zone.constructedAtException) {
                trace.push(zone.constructedAtException.get());
                zone = zone.parent;
              }
              this._onErrorHandler(e, trace);
            } else {
              throw e;
            }
          }
        }, {});
      }());
      $__export("VmTurnZone", VmTurnZone);
    }
  };
});

System.register("angular2/src/render/dom/direct_dom_renderer", ["angular2/di", "angular2/src/facade/async", "angular2/src/facade/collection", "angular2/src/facade/lang", "../api", "./view/view", "./view/proto_view", "./view/view_factory", "./view/view_hydrator", "./compiler/compiler", "./shadow_dom/shadow_dom_strategy", "./view/proto_view_builder", "angular2/src/dom/dom_adapter", "./view/view_container"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/render/dom/direct_dom_renderer";
  var Injectable,
      Promise,
      PromiseWrapper,
      List,
      ListWrapper,
      isBlank,
      isPresent,
      BaseException,
      api,
      RenderView,
      RenderProtoView,
      ViewFactory,
      RenderViewHydrator,
      Compiler,
      ShadowDomStrategy,
      ProtoViewBuilder,
      DOM,
      ViewContainer,
      DirectDomProtoViewRef,
      DirectDomViewRef,
      DirectDomRenderer;
  function _resolveViewContainer(vc) {
    return _resolveView(vc.view).getOrCreateViewContainer(vc.elementIndex);
  }
  function _resolveView(viewRef) {
    return isPresent(viewRef) ? viewRef.delegate : null;
  }
  function _resolveProtoView(protoViewRef) {
    return isPresent(protoViewRef) ? protoViewRef.delegate : null;
  }
  function _wrapView(view) {
    return new DirectDomViewRef(view);
  }
  function _collectComponentChildViewRefs(view) {
    var target = arguments[1] !== (void 0) ? arguments[1] : null;
    if (isBlank(target)) {
      target = [];
    }
    ListWrapper.push(target, _wrapView(view));
    ListWrapper.forEach(view.componentChildViews, (function(view) {
      if (isPresent(view)) {
        _collectComponentChildViewRefs(view, target);
      }
    }));
    return target;
  }
  return {
    setters: [function($__m) {
      Injectable = $__m.Injectable;
    }, function($__m) {
      Promise = $__m.Promise;
      PromiseWrapper = $__m.PromiseWrapper;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
      BaseException = $__m.BaseException;
    }, function($__m) {
      api = $__m;
    }, function($__m) {
      RenderView = $__m.RenderView;
    }, function($__m) {
      RenderProtoView = $__m.RenderProtoView;
    }, function($__m) {
      ViewFactory = $__m.ViewFactory;
    }, function($__m) {
      RenderViewHydrator = $__m.RenderViewHydrator;
    }, function($__m) {
      Compiler = $__m.Compiler;
    }, function($__m) {
      ShadowDomStrategy = $__m.ShadowDomStrategy;
    }, function($__m) {
      ProtoViewBuilder = $__m.ProtoViewBuilder;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      ViewContainer = $__m.ViewContainer;
    }],
    execute: function() {
      Object.defineProperty(_resolveViewContainer, "parameters", {get: function() {
          return [[api.ViewContainerRef]];
        }});
      Object.defineProperty(_resolveView, "parameters", {get: function() {
          return [[DirectDomViewRef]];
        }});
      Object.defineProperty(_resolveProtoView, "parameters", {get: function() {
          return [[DirectDomProtoViewRef]];
        }});
      Object.defineProperty(_wrapView, "parameters", {get: function() {
          return [[RenderView]];
        }});
      DirectDomProtoViewRef = (function($__super) {
        function DirectDomProtoViewRef(delegate) {
          $traceurRuntime.superConstructor(DirectDomProtoViewRef).call(this);
          this.delegate = delegate;
        }
        return ($traceurRuntime.createClass)(DirectDomProtoViewRef, {}, {}, $__super);
      }(api.ProtoViewRef));
      $__export("DirectDomProtoViewRef", DirectDomProtoViewRef);
      Object.defineProperty(DirectDomProtoViewRef, "parameters", {get: function() {
          return [[RenderProtoView]];
        }});
      DirectDomViewRef = (function($__super) {
        function DirectDomViewRef(delegate) {
          $traceurRuntime.superConstructor(DirectDomViewRef).call(this);
          this.delegate = delegate;
        }
        return ($traceurRuntime.createClass)(DirectDomViewRef, {}, {}, $__super);
      }(api.ViewRef));
      $__export("DirectDomViewRef", DirectDomViewRef);
      Object.defineProperty(DirectDomViewRef, "parameters", {get: function() {
          return [[RenderView]];
        }});
      DirectDomRenderer = (function($__super) {
        function DirectDomRenderer(compiler, viewFactory, viewHydrator, shadowDomStrategy) {
          $traceurRuntime.superConstructor(DirectDomRenderer).call(this);
          this._compiler = compiler;
          this._viewFactory = viewFactory;
          this._viewHydrator = viewHydrator;
          this._shadowDomStrategy = shadowDomStrategy;
        }
        return ($traceurRuntime.createClass)(DirectDomRenderer, {
          createHostProtoView: function(componentId) {
            var rootElement = DOM.createElement('div');
            var hostProtoViewBuilder = new ProtoViewBuilder(rootElement);
            var elBinder = hostProtoViewBuilder.bindElement(rootElement, 'root element');
            elBinder.setComponentId(componentId);
            elBinder.bindDirective(0);
            this._shadowDomStrategy.processElement(null, componentId, rootElement);
            return PromiseWrapper.resolve(hostProtoViewBuilder.build());
          },
          createImperativeComponentProtoView: function(rendererId) {
            var protoViewBuilder = new ProtoViewBuilder(null);
            protoViewBuilder.setImperativeRendererId(rendererId);
            return PromiseWrapper.resolve(protoViewBuilder.build());
          },
          compile: function(template) {
            return this._compiler.compile(template);
          },
          mergeChildComponentProtoViews: function(protoViewRef, protoViewRefs) {
            _resolveProtoView(protoViewRef).mergeChildComponentProtoViews(ListWrapper.map(protoViewRefs, _resolveProtoView));
          },
          createViewInContainer: function(vcRef, atIndex, protoViewRef) {
            var view = this._viewFactory.getView(_resolveProtoView(protoViewRef));
            var vc = _resolveViewContainer(vcRef);
            this._viewHydrator.hydrateViewInViewContainer(vc, view);
            vc.insert(view, atIndex);
            return _collectComponentChildViewRefs(view);
          },
          destroyViewInContainer: function(vcRef, atIndex) {
            var vc = _resolveViewContainer(vcRef);
            var view = vc.detach(atIndex);
            this._viewHydrator.dehydrateViewInViewContainer(vc, view);
            this._viewFactory.returnView(view);
          },
          insertViewIntoContainer: function(vcRef) {
            var atIndex = arguments[1] !== (void 0) ? arguments[1] : -1;
            var viewRef = arguments[2];
            _resolveViewContainer(vcRef).insert(_resolveView(viewRef), atIndex);
          },
          detachViewFromContainer: function(vcRef, atIndex) {
            _resolveViewContainer(vcRef).detach(atIndex);
          },
          createDynamicComponentView: function(hostViewRef, elementIndex, componentViewRef) {
            var hostView = _resolveView(hostViewRef);
            var componentView = this._viewFactory.getView(_resolveProtoView(componentViewRef));
            this._viewHydrator.hydrateDynamicComponentView(hostView, elementIndex, componentView);
            return _collectComponentChildViewRefs(componentView);
          },
          destroyDynamicComponentView: function(hostViewRef, elementIndex) {
            throw new BaseException('Not supported yet');
          },
          createInPlaceHostView: function(parentViewRef, hostElementSelector, hostProtoViewRef) {
            var parentView = _resolveView(parentViewRef);
            var hostView = this._viewFactory.createInPlaceHostView(hostElementSelector, _resolveProtoView(hostProtoViewRef));
            this._viewHydrator.hydrateInPlaceHostView(parentView, hostView);
            return _collectComponentChildViewRefs(hostView);
          },
          destroyInPlaceHostView: function(parentViewRef, hostViewRef) {
            var parentView = _resolveView(parentViewRef);
            var hostView = _resolveView(hostViewRef);
            this._viewHydrator.dehydrateInPlaceHostView(parentView, hostView);
          },
          setImperativeComponentRootNodes: function(parentViewRef, elementIndex, nodes) {
            var parentView = _resolveView(parentViewRef);
            var hostElement = parentView.boundElements[elementIndex];
            var componentView = parentView.componentChildViews[elementIndex];
            if (isBlank(componentView)) {
              throw new BaseException(("There is no componentChildView at index " + elementIndex));
            }
            if (isBlank(componentView.proto.imperativeRendererId)) {
              throw new BaseException("This component view has no imperative renderer");
            }
            ViewContainer.removeViewNodes(componentView);
            componentView.rootNodes = nodes;
            this._shadowDomStrategy.attachTemplate(hostElement, componentView);
          },
          setElementProperty: function(viewRef, elementIndex, propertyName, propertyValue) {
            _resolveView(viewRef).setElementProperty(elementIndex, propertyName, propertyValue);
          },
          setText: function(viewRef, textNodeIndex, text) {
            _resolveView(viewRef).setText(textNodeIndex, text);
          },
          setEventDispatcher: function(viewRef, dispatcher) {
            _resolveView(viewRef).setEventDispatcher(dispatcher);
          }
        }, {}, $__super);
      }(api.Renderer));
      $__export("DirectDomRenderer", DirectDomRenderer);
      Object.defineProperty(DirectDomRenderer, "annotations", {get: function() {
          return [new Injectable()];
        }});
      Object.defineProperty(DirectDomRenderer, "parameters", {get: function() {
          return [[Compiler], [ViewFactory], [RenderViewHydrator], [ShadowDomStrategy]];
        }});
      Object.defineProperty(DirectDomRenderer.prototype.compile, "parameters", {get: function() {
          return [[api.ViewDefinition]];
        }});
      Object.defineProperty(DirectDomRenderer.prototype.mergeChildComponentProtoViews, "parameters", {get: function() {
          return [[api.ProtoViewRef], [assert.genericType(List, api.ProtoViewRef)]];
        }});
      Object.defineProperty(DirectDomRenderer.prototype.createViewInContainer, "parameters", {get: function() {
          return [[api.ViewContainerRef], [assert.type.number], [api.ProtoViewRef]];
        }});
      Object.defineProperty(DirectDomRenderer.prototype.destroyViewInContainer, "parameters", {get: function() {
          return [[api.ViewContainerRef], [assert.type.number]];
        }});
      Object.defineProperty(DirectDomRenderer.prototype.insertViewIntoContainer, "parameters", {get: function() {
          return [[api.ViewContainerRef], [], [api.ViewRef]];
        }});
      Object.defineProperty(DirectDomRenderer.prototype.detachViewFromContainer, "parameters", {get: function() {
          return [[api.ViewContainerRef], [assert.type.number]];
        }});
      Object.defineProperty(DirectDomRenderer.prototype.createDynamicComponentView, "parameters", {get: function() {
          return [[api.ViewRef], [assert.type.number], [api.ProtoViewRef]];
        }});
      Object.defineProperty(DirectDomRenderer.prototype.destroyDynamicComponentView, "parameters", {get: function() {
          return [[api.ViewRef], [assert.type.number]];
        }});
      Object.defineProperty(DirectDomRenderer.prototype.createInPlaceHostView, "parameters", {get: function() {
          return [[api.ViewRef], [], [api.ProtoViewRef]];
        }});
      Object.defineProperty(DirectDomRenderer.prototype.destroyInPlaceHostView, "parameters", {get: function() {
          return [[api.ViewRef], [api.ViewRef]];
        }});
      Object.defineProperty(DirectDomRenderer.prototype.setImperativeComponentRootNodes, "parameters", {get: function() {
          return [[api.ViewRef], [assert.type.number], [List]];
        }});
      Object.defineProperty(DirectDomRenderer.prototype.setElementProperty, "parameters", {get: function() {
          return [[api.ViewRef], [assert.type.number], [assert.type.string], [assert.type.any]];
        }});
      Object.defineProperty(DirectDomRenderer.prototype.setText, "parameters", {get: function() {
          return [[api.ViewRef], [assert.type.number], [assert.type.string]];
        }});
      Object.defineProperty(DirectDomRenderer.prototype.setEventDispatcher, "parameters", {get: function() {
          return [[api.ViewRef], [assert.type.any]];
        }});
    }
  };
});

System.register("angular2/src/render/dom/util", ["angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/render/dom/util";
  var StringWrapper,
      RegExpWrapper,
      isPresent,
      NG_BINDING_CLASS_SELECTOR,
      NG_BINDING_CLASS,
      EVENT_TARGET_SEPARATOR,
      CAMEL_CASE_REGEXP,
      DASH_CASE_REGEXP;
  function camelCaseToDashCase(input) {
    return StringWrapper.replaceAllMapped(input, CAMEL_CASE_REGEXP, (function(m) {
      return '-' + m[1].toLowerCase();
    }));
  }
  function dashCaseToCamelCase(input) {
    return StringWrapper.replaceAllMapped(input, DASH_CASE_REGEXP, (function(m) {
      return m[1].toUpperCase();
    }));
  }
  $__export("camelCaseToDashCase", camelCaseToDashCase);
  $__export("dashCaseToCamelCase", dashCaseToCamelCase);
  return {
    setters: [function($__m) {
      StringWrapper = $__m.StringWrapper;
      RegExpWrapper = $__m.RegExpWrapper;
      isPresent = $__m.isPresent;
    }],
    execute: function() {
      NG_BINDING_CLASS_SELECTOR = '.ng-binding';
      $__export("NG_BINDING_CLASS_SELECTOR", NG_BINDING_CLASS_SELECTOR);
      NG_BINDING_CLASS = 'ng-binding';
      $__export("NG_BINDING_CLASS", NG_BINDING_CLASS);
      EVENT_TARGET_SEPARATOR = ':';
      $__export("EVENT_TARGET_SEPARATOR", EVENT_TARGET_SEPARATOR);
      CAMEL_CASE_REGEXP = RegExpWrapper.create('([A-Z])');
      DASH_CASE_REGEXP = RegExpWrapper.create('-([a-z])');
      Object.defineProperty(camelCaseToDashCase, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(dashCaseToCamelCase, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
    }
  };
});

System.register("angular2/src/render/dom/compiler/compile_control", ["angular2/src/facade/lang", "angular2/src/facade/collection", "./compile_element", "./compile_step"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/render/dom/compiler/compile_control";
  var isBlank,
      List,
      ListWrapper,
      CompileElement,
      CompileStep,
      CompileControl;
  return {
    setters: [function($__m) {
      isBlank = $__m.isBlank;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      CompileElement = $__m.CompileElement;
    }, function($__m) {
      CompileStep = $__m.CompileStep;
    }],
    execute: function() {
      CompileControl = (function() {
        function CompileControl(steps) {
          this._steps = steps;
          this._currentStepIndex = 0;
          this._parent = null;
          this._results = null;
          this._additionalChildren = null;
        }
        return ($traceurRuntime.createClass)(CompileControl, {
          internalProcess: function(results, startStepIndex, parent, current) {
            this._results = results;
            var previousStepIndex = this._currentStepIndex;
            var previousParent = this._parent;
            this._ignoreCurrentElement = false;
            for (var i = startStepIndex; i < this._steps.length && !this._ignoreCurrentElement; i++) {
              var step = this._steps[i];
              this._parent = parent;
              this._currentStepIndex = i;
              step.process(parent, current, this);
              parent = this._parent;
            }
            if (!this._ignoreCurrentElement) {
              ListWrapper.push(results, current);
            }
            this._currentStepIndex = previousStepIndex;
            this._parent = previousParent;
            var localAdditionalChildren = this._additionalChildren;
            this._additionalChildren = null;
            return localAdditionalChildren;
          },
          addParent: function(newElement) {
            this.internalProcess(this._results, this._currentStepIndex + 1, this._parent, newElement);
            this._parent = newElement;
          },
          addChild: function(element) {
            if (isBlank(this._additionalChildren)) {
              this._additionalChildren = ListWrapper.create();
            }
            ListWrapper.push(this._additionalChildren, element);
          },
          ignoreCurrentElement: function() {
            this._ignoreCurrentElement = true;
          }
        }, {});
      }());
      $__export("CompileControl", CompileControl);
      Object.defineProperty(CompileControl.prototype.internalProcess, "parameters", {get: function() {
          return [[], [], [CompileElement], [CompileElement]];
        }});
      Object.defineProperty(CompileControl.prototype.addParent, "parameters", {get: function() {
          return [[CompileElement]];
        }});
      Object.defineProperty(CompileControl.prototype.addChild, "parameters", {get: function() {
          return [[CompileElement]];
        }});
    }
  };
});

System.register("angular2/src/render/dom/compiler/compile_element", ["angular2/src/facade/collection", "angular2/src/dom/dom_adapter", "angular2/src/facade/lang", "../view/proto_view_builder"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/render/dom/compiler/compile_element";
  var List,
      Map,
      ListWrapper,
      MapWrapper,
      DOM,
      int,
      isBlank,
      isPresent,
      Type,
      StringJoiner,
      assertionsEnabled,
      ProtoViewBuilder,
      ElementBinderBuilder,
      CompileElement;
  function getElementDescription(domElement) {
    var buf = new StringJoiner();
    var atts = DOM.attributeMap(domElement);
    buf.add("<");
    buf.add(DOM.tagName(domElement).toLowerCase());
    addDescriptionAttribute(buf, "id", MapWrapper.get(atts, "id"));
    addDescriptionAttribute(buf, "class", MapWrapper.get(atts, "class"));
    MapWrapper.forEach(atts, (function(attValue, attName) {
      if (attName !== "id" && attName !== "class") {
        addDescriptionAttribute(buf, attName, attValue);
      }
    }));
    buf.add(">");
    return buf.toString();
  }
  function addDescriptionAttribute(buffer, attName, attValue) {
    if (isPresent(attValue)) {
      if (attValue.length === 0) {
        buffer.add(' ' + attName);
      } else {
        buffer.add(' ' + attName + '="' + attValue + '"');
      }
    }
  }
  return {
    setters: [function($__m) {
      List = $__m.List;
      Map = $__m.Map;
      ListWrapper = $__m.ListWrapper;
      MapWrapper = $__m.MapWrapper;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      int = $__m.int;
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
      Type = $__m.Type;
      StringJoiner = $__m.StringJoiner;
      assertionsEnabled = $__m.assertionsEnabled;
    }, function($__m) {
      ProtoViewBuilder = $__m.ProtoViewBuilder;
      ElementBinderBuilder = $__m.ElementBinderBuilder;
    }],
    execute: function() {
      CompileElement = (function() {
        function CompileElement(element) {
          var compilationUnit = arguments[1] !== (void 0) ? arguments[1] : '';
          this.element = element;
          this._attrs = null;
          this._classList = null;
          this.isViewRoot = false;
          this.inheritedProtoView = null;
          this.inheritedElementBinder = null;
          this.distanceToInheritedBinder = 0;
          this.compileChildren = true;
          var tplDesc = assertionsEnabled() ? getElementDescription(element) : null;
          if (compilationUnit !== '') {
            this.elementDescription = compilationUnit;
            if (isPresent(tplDesc))
              this.elementDescription += ": " + tplDesc;
          } else {
            this.elementDescription = tplDesc;
          }
        }
        return ($traceurRuntime.createClass)(CompileElement, {
          isBound: function() {
            return isPresent(this.inheritedElementBinder) && this.distanceToInheritedBinder === 0;
          },
          bindElement: function() {
            if (!this.isBound()) {
              var parentBinder = this.inheritedElementBinder;
              this.inheritedElementBinder = this.inheritedProtoView.bindElement(this.element, this.elementDescription);
              if (isPresent(parentBinder)) {
                this.inheritedElementBinder.setParent(parentBinder, this.distanceToInheritedBinder);
              }
              this.distanceToInheritedBinder = 0;
            }
            return this.inheritedElementBinder;
          },
          refreshAttrs: function() {
            this._attrs = null;
          },
          attrs: function() {
            if (isBlank(this._attrs)) {
              this._attrs = DOM.attributeMap(this.element);
            }
            return this._attrs;
          },
          refreshClassList: function() {
            this._classList = null;
          },
          classList: function() {
            if (isBlank(this._classList)) {
              this._classList = ListWrapper.create();
              var elClassList = DOM.classList(this.element);
              for (var i = 0; i < elClassList.length; i++) {
                ListWrapper.push(this._classList, elClassList[i]);
              }
            }
            return this._classList;
          }
        }, {});
      }());
      $__export("CompileElement", CompileElement);
      Object.defineProperty(addDescriptionAttribute, "parameters", {get: function() {
          return [[StringJoiner], [assert.type.string], []];
        }});
    }
  };
});

System.register("angular2/src/render/dom/compiler/compile_pipeline", ["angular2/src/facade/lang", "angular2/src/facade/collection", "angular2/src/dom/dom_adapter", "./compile_element", "./compile_control", "./compile_step", "../view/proto_view_builder"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/render/dom/compiler/compile_pipeline";
  var isPresent,
      List,
      ListWrapper,
      DOM,
      CompileElement,
      CompileControl,
      CompileStep,
      ProtoViewBuilder,
      CompilePipeline;
  return {
    setters: [function($__m) {
      isPresent = $__m.isPresent;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      CompileElement = $__m.CompileElement;
    }, function($__m) {
      CompileControl = $__m.CompileControl;
    }, function($__m) {
      CompileStep = $__m.CompileStep;
    }, function($__m) {
      ProtoViewBuilder = $__m.ProtoViewBuilder;
    }],
    execute: function() {
      CompilePipeline = (function() {
        function CompilePipeline(steps) {
          this._control = new CompileControl(steps);
        }
        return ($traceurRuntime.createClass)(CompilePipeline, {
          process: function(rootElement) {
            var compilationCtxtDescription = arguments[1] !== (void 0) ? arguments[1] : '';
            var results = ListWrapper.create();
            var rootCompileElement = new CompileElement(rootElement, compilationCtxtDescription);
            rootCompileElement.inheritedProtoView = new ProtoViewBuilder(rootElement);
            rootCompileElement.isViewRoot = true;
            this._process(results, null, rootCompileElement, compilationCtxtDescription);
            return results;
          },
          _process: function(results, parent, current) {
            var compilationCtxtDescription = arguments[3] !== (void 0) ? arguments[3] : '';
            var additionalChildren = this._control.internalProcess(results, 0, parent, current);
            if (current.compileChildren) {
              var node = DOM.firstChild(DOM.templateAwareRoot(current.element));
              while (isPresent(node)) {
                var nextNode = DOM.nextSibling(node);
                if (DOM.isElementNode(node)) {
                  var childCompileElement = new CompileElement(node, compilationCtxtDescription);
                  childCompileElement.inheritedProtoView = current.inheritedProtoView;
                  childCompileElement.inheritedElementBinder = current.inheritedElementBinder;
                  childCompileElement.distanceToInheritedBinder = current.distanceToInheritedBinder + 1;
                  this._process(results, current, childCompileElement);
                }
                node = nextNode;
              }
            }
            if (isPresent(additionalChildren)) {
              for (var i = 0; i < additionalChildren.length; i++) {
                this._process(results, current, additionalChildren[i]);
              }
            }
          }
        }, {});
      }());
      $__export("CompilePipeline", CompilePipeline);
      Object.defineProperty(CompilePipeline, "parameters", {get: function() {
          return [[assert.genericType(List, CompileStep)]];
        }});
      Object.defineProperty(CompilePipeline.prototype.process, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(CompilePipeline.prototype._process, "parameters", {get: function() {
          return [[], [CompileElement], [CompileElement], [assert.type.string]];
        }});
    }
  };
});

System.register("angular2/src/render/dom/compiler/compile_step", ["./compile_element", "./compile_control"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/render/dom/compiler/compile_step";
  var CompileElement,
      compileControlModule,
      CompileStep;
  return {
    setters: [function($__m) {
      CompileElement = $__m.CompileElement;
    }, function($__m) {
      compileControlModule = $__m;
    }],
    execute: function() {
      CompileStep = (function() {
        function CompileStep() {}
        return ($traceurRuntime.createClass)(CompileStep, {process: function(parent, current, control) {}}, {});
      }());
      $__export("CompileStep", CompileStep);
      Object.defineProperty(CompileStep.prototype.process, "parameters", {get: function() {
          return [[CompileElement], [CompileElement], [compileControlModule.CompileControl]];
        }});
    }
  };
});

System.register("angular2/src/render/dom/compiler/compile_step_factory", ["angular2/src/facade/collection", "angular2/src/facade/async", "angular2/change_detection", "../../api", "./compile_step", "./property_binding_parser", "./text_interpolation_parser", "./directive_parser", "./view_splitter", "../shadow_dom/shadow_dom_compile_step", "../shadow_dom/shadow_dom_strategy"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/render/dom/compiler/compile_step_factory";
  var List,
      Promise,
      Parser,
      ViewDefinition,
      CompileStep,
      PropertyBindingParser,
      TextInterpolationParser,
      DirectiveParser,
      ViewSplitter,
      ShadowDomCompileStep,
      ShadowDomStrategy,
      CompileStepFactory,
      DefaultStepFactory;
  return {
    setters: [function($__m) {
      List = $__m.List;
    }, function($__m) {
      Promise = $__m.Promise;
    }, function($__m) {
      Parser = $__m.Parser;
    }, function($__m) {
      ViewDefinition = $__m.ViewDefinition;
    }, function($__m) {
      CompileStep = $__m.CompileStep;
    }, function($__m) {
      PropertyBindingParser = $__m.PropertyBindingParser;
    }, function($__m) {
      TextInterpolationParser = $__m.TextInterpolationParser;
    }, function($__m) {
      DirectiveParser = $__m.DirectiveParser;
    }, function($__m) {
      ViewSplitter = $__m.ViewSplitter;
    }, function($__m) {
      ShadowDomCompileStep = $__m.ShadowDomCompileStep;
    }, function($__m) {
      ShadowDomStrategy = $__m.ShadowDomStrategy;
    }],
    execute: function() {
      CompileStepFactory = (function() {
        function CompileStepFactory() {}
        return ($traceurRuntime.createClass)(CompileStepFactory, {createSteps: function(template, subTaskPromises) {
            return null;
          }}, {});
      }());
      $__export("CompileStepFactory", CompileStepFactory);
      Object.defineProperty(CompileStepFactory.prototype.createSteps, "parameters", {get: function() {
          return [[ViewDefinition], [assert.genericType(List, Promise)]];
        }});
      DefaultStepFactory = (function($__super) {
        function DefaultStepFactory(parser, shadowDomStrategy) {
          $traceurRuntime.superConstructor(DefaultStepFactory).call(this);
          this._parser = parser;
          this._shadowDomStrategy = shadowDomStrategy;
        }
        return ($traceurRuntime.createClass)(DefaultStepFactory, {createSteps: function(template, subTaskPromises) {
            return [new ViewSplitter(this._parser), new PropertyBindingParser(this._parser), new DirectiveParser(this._parser, template.directives), new TextInterpolationParser(this._parser), new ShadowDomCompileStep(this._shadowDomStrategy, template, subTaskPromises)];
          }}, {}, $__super);
      }(CompileStepFactory));
      $__export("DefaultStepFactory", DefaultStepFactory);
      Object.defineProperty(DefaultStepFactory, "parameters", {get: function() {
          return [[Parser], []];
        }});
      Object.defineProperty(DefaultStepFactory.prototype.createSteps, "parameters", {get: function() {
          return [[ViewDefinition], [assert.genericType(List, Promise)]];
        }});
    }
  };
});

System.register("angular2/src/render/dom/compiler/compiler", ["angular2/di", "angular2/src/facade/async", "angular2/src/facade/lang", "../../api", "./compile_pipeline", "angular2/src/render/dom/compiler/template_loader", "./compile_step_factory", "angular2/change_detection", "../shadow_dom/shadow_dom_strategy"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/render/dom/compiler/compiler";
  var Injectable,
      PromiseWrapper,
      Promise,
      BaseException,
      ViewDefinition,
      ProtoViewDto,
      CompilePipeline,
      TemplateLoader,
      CompileStepFactory,
      DefaultStepFactory,
      Parser,
      ShadowDomStrategy,
      Compiler,
      DefaultCompiler;
  return {
    setters: [function($__m) {
      Injectable = $__m.Injectable;
    }, function($__m) {
      PromiseWrapper = $__m.PromiseWrapper;
      Promise = $__m.Promise;
    }, function($__m) {
      BaseException = $__m.BaseException;
    }, function($__m) {
      ViewDefinition = $__m.ViewDefinition;
      ProtoViewDto = $__m.ProtoViewDto;
    }, function($__m) {
      CompilePipeline = $__m.CompilePipeline;
    }, function($__m) {
      TemplateLoader = $__m.TemplateLoader;
    }, function($__m) {
      CompileStepFactory = $__m.CompileStepFactory;
      DefaultStepFactory = $__m.DefaultStepFactory;
    }, function($__m) {
      Parser = $__m.Parser;
    }, function($__m) {
      ShadowDomStrategy = $__m.ShadowDomStrategy;
    }],
    execute: function() {
      Compiler = (function() {
        function Compiler(stepFactory, templateLoader) {
          this._templateLoader = templateLoader;
          this._stepFactory = stepFactory;
        }
        return ($traceurRuntime.createClass)(Compiler, {
          compile: function(template) {
            var $__0 = this;
            var tplPromise = this._templateLoader.load(template);
            return PromiseWrapper.then(tplPromise, (function(el) {
              return $__0._compileTemplate(template, el);
            }), (function(_) {
              throw new BaseException(("Failed to load the template \"" + template.componentId + "\""));
            }));
          },
          _compileTemplate: function(template, tplElement) {
            var subTaskPromises = [];
            var pipeline = new CompilePipeline(this._stepFactory.createSteps(template, subTaskPromises));
            var compileElements;
            compileElements = pipeline.process(tplElement, template.componentId);
            var protoView = compileElements[0].inheritedProtoView.build();
            if (subTaskPromises.length > 0) {
              return PromiseWrapper.all(subTaskPromises).then((function(_) {
                return protoView;
              }));
            } else {
              return PromiseWrapper.resolve(protoView);
            }
          }
        }, {});
      }());
      $__export("Compiler", Compiler);
      Object.defineProperty(Compiler, "parameters", {get: function() {
          return [[CompileStepFactory], [TemplateLoader]];
        }});
      Object.defineProperty(Compiler.prototype.compile, "parameters", {get: function() {
          return [[ViewDefinition]];
        }});
      Object.defineProperty(Compiler.prototype._compileTemplate, "parameters", {get: function() {
          return [[ViewDefinition], []];
        }});
      DefaultCompiler = (function($__super) {
        function DefaultCompiler(parser, shadowDomStrategy, templateLoader) {
          $traceurRuntime.superConstructor(DefaultCompiler).call(this, new DefaultStepFactory(parser, shadowDomStrategy), templateLoader);
        }
        return ($traceurRuntime.createClass)(DefaultCompiler, {}, {}, $__super);
      }(Compiler));
      $__export("DefaultCompiler", DefaultCompiler);
      Object.defineProperty(DefaultCompiler, "annotations", {get: function() {
          return [new Injectable()];
        }});
      Object.defineProperty(DefaultCompiler, "parameters", {get: function() {
          return [[Parser], [ShadowDomStrategy], [TemplateLoader]];
        }});
    }
  };
});

System.register("angular2/src/render/dom/compiler/directive_parser", ["angular2/src/facade/lang", "angular2/src/facade/collection", "angular2/src/dom/dom_adapter", "angular2/change_detection", "angular2/src/render/dom/compiler/selector", "./compile_step", "./compile_element", "./compile_control", "../../api", "../util"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/render/dom/compiler/directive_parser";
  var isPresent,
      isBlank,
      BaseException,
      assertionsEnabled,
      RegExpWrapper,
      StringWrapper,
      List,
      MapWrapper,
      ListWrapper,
      DOM,
      Parser,
      SelectorMatcher,
      CssSelector,
      CompileStep,
      CompileElement,
      CompileControl,
      DirectiveMetadata,
      dashCaseToCamelCase,
      camelCaseToDashCase,
      EVENT_TARGET_SEPARATOR,
      DirectiveParser;
  return {
    setters: [function($__m) {
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
      BaseException = $__m.BaseException;
      assertionsEnabled = $__m.assertionsEnabled;
      RegExpWrapper = $__m.RegExpWrapper;
      StringWrapper = $__m.StringWrapper;
    }, function($__m) {
      List = $__m.List;
      MapWrapper = $__m.MapWrapper;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      Parser = $__m.Parser;
    }, function($__m) {
      SelectorMatcher = $__m.SelectorMatcher;
      CssSelector = $__m.CssSelector;
    }, function($__m) {
      CompileStep = $__m.CompileStep;
    }, function($__m) {
      CompileElement = $__m.CompileElement;
    }, function($__m) {
      CompileControl = $__m.CompileControl;
    }, function($__m) {
      DirectiveMetadata = $__m.DirectiveMetadata;
    }, function($__m) {
      dashCaseToCamelCase = $__m.dashCaseToCamelCase;
      camelCaseToDashCase = $__m.camelCaseToDashCase;
      EVENT_TARGET_SEPARATOR = $__m.EVENT_TARGET_SEPARATOR;
    }],
    execute: function() {
      DirectiveParser = (function($__super) {
        function DirectiveParser(parser, directives) {
          $traceurRuntime.superConstructor(DirectiveParser).call(this);
          this._parser = parser;
          this._selectorMatcher = new SelectorMatcher();
          this._directives = directives;
          for (var i = 0; i < directives.length; i++) {
            var selector = CssSelector.parse(directives[i].selector);
            this._selectorMatcher.addSelectables(selector, i);
          }
        }
        return ($traceurRuntime.createClass)(DirectiveParser, {
          process: function(parent, current, control) {
            var $__0 = this;
            var attrs = current.attrs();
            var classList = current.classList();
            var cssSelector = new CssSelector();
            var nodeName = DOM.nodeName(current.element);
            cssSelector.setElement(nodeName);
            for (var i = 0; i < classList.length; i++) {
              cssSelector.addClassName(classList[i]);
            }
            MapWrapper.forEach(attrs, (function(attrValue, attrName) {
              cssSelector.addAttribute(attrName, attrValue);
            }));
            var viewportDirective;
            var componentDirective;
            var isTemplateElement = DOM.isTemplateElement(current.element);
            this._selectorMatcher.match(cssSelector, (function(selector, directiveIndex) {
              var elementBinder = current.bindElement();
              var directive = $__0._directives[directiveIndex];
              var directiveBinder = elementBinder.bindDirective(directiveIndex);
              current.compileChildren = current.compileChildren && directive.compileChildren;
              if (isPresent(directive.properties)) {
                MapWrapper.forEach(directive.properties, (function(bindConfig, dirProperty) {
                  $__0._bindDirectiveProperty(dirProperty, bindConfig, current, directiveBinder);
                }));
              }
              if (isPresent(directive.hostListeners)) {
                MapWrapper.forEach(directive.hostListeners, (function(action, eventName) {
                  $__0._bindDirectiveEvent(eventName, action, current, directiveBinder);
                }));
              }
              if (isPresent(directive.setters)) {
                ListWrapper.forEach(directive.setters, (function(propertyName) {
                  elementBinder.bindPropertySetter(propertyName);
                }));
              }
              if (isPresent(directive.readAttributes)) {
                ListWrapper.forEach(directive.readAttributes, (function(attrName) {
                  elementBinder.readAttribute(attrName);
                }));
              }
              if (directive.type === DirectiveMetadata.VIEWPORT_TYPE) {
                if (!isTemplateElement) {
                  throw new BaseException("Viewport directives need to be placed on <template> elements or elements " + ("with template attribute - check " + current.elementDescription));
                }
                if (isPresent(viewportDirective)) {
                  throw new BaseException(("Only one viewport directive is allowed per element - check " + current.elementDescription));
                }
                viewportDirective = directive;
              } else {
                if (isTemplateElement) {
                  throw new BaseException(("Only template directives are allowed on template elements - check " + current.elementDescription));
                }
                if (directive.type === DirectiveMetadata.COMPONENT_TYPE) {
                  if (isPresent(componentDirective)) {
                    throw new BaseException(("Only one component directive is allowed per element - check " + current.elementDescription));
                  }
                  componentDirective = directive;
                  elementBinder.setComponentId(directive.id);
                }
              }
            }));
          },
          _bindDirectiveProperty: function(dirProperty, bindConfig, compileElement, directiveBinder) {
            var pipes = this._splitBindConfig(bindConfig);
            var elProp = ListWrapper.removeAt(pipes, 0);
            var bindingAst = MapWrapper.get(compileElement.bindElement().propertyBindings, dashCaseToCamelCase(elProp));
            if (isBlank(bindingAst)) {
              var attributeValue = MapWrapper.get(compileElement.attrs(), camelCaseToDashCase(elProp));
              if (isPresent(attributeValue)) {
                bindingAst = this._parser.wrapLiteralPrimitive(attributeValue, compileElement.elementDescription);
              }
            }
            if (isPresent(bindingAst)) {
              var fullExpAstWithBindPipes = this._parser.addPipes(bindingAst, pipes);
              directiveBinder.bindProperty(dirProperty, fullExpAstWithBindPipes);
            }
          },
          _bindDirectiveEvent: function(eventName, action, compileElement, directiveBinder) {
            var ast = this._parser.parseAction(action, compileElement.elementDescription);
            if (StringWrapper.contains(eventName, EVENT_TARGET_SEPARATOR)) {
              var parts = eventName.split(EVENT_TARGET_SEPARATOR);
              directiveBinder.bindEvent(parts[1], ast, parts[0]);
            } else {
              directiveBinder.bindEvent(eventName, ast);
            }
          },
          _splitBindConfig: function(bindConfig) {
            return ListWrapper.map(bindConfig.split('|'), (function(s) {
              return s.trim();
            }));
          }
        }, {}, $__super);
      }(CompileStep));
      $__export("DirectiveParser", DirectiveParser);
      Object.defineProperty(DirectiveParser, "parameters", {get: function() {
          return [[Parser], [assert.genericType(List, DirectiveMetadata)]];
        }});
      Object.defineProperty(DirectiveParser.prototype.process, "parameters", {get: function() {
          return [[CompileElement], [CompileElement], [CompileControl]];
        }});
      Object.defineProperty(DirectiveParser.prototype._splitBindConfig, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
    }
  };
});

System.register("angular2/src/render/dom/compiler/property_binding_parser", ["angular2/src/facade/lang", "angular2/src/facade/collection", "angular2/change_detection", "./compile_step", "./compile_element", "./compile_control", "../util"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/render/dom/compiler/property_binding_parser";
  var isPresent,
      RegExpWrapper,
      MapWrapper,
      Parser,
      CompileStep,
      CompileElement,
      CompileControl,
      dashCaseToCamelCase,
      BIND_NAME_REGEXP,
      PropertyBindingParser;
  return {
    setters: [function($__m) {
      isPresent = $__m.isPresent;
      RegExpWrapper = $__m.RegExpWrapper;
    }, function($__m) {
      MapWrapper = $__m.MapWrapper;
    }, function($__m) {
      Parser = $__m.Parser;
    }, function($__m) {
      CompileStep = $__m.CompileStep;
    }, function($__m) {
      CompileElement = $__m.CompileElement;
    }, function($__m) {
      CompileControl = $__m.CompileControl;
    }, function($__m) {
      dashCaseToCamelCase = $__m.dashCaseToCamelCase;
    }],
    execute: function() {
      BIND_NAME_REGEXP = RegExpWrapper.create('^(?:(?:(?:(bind-)|(var-|#)|(on-))(.+))|\\[([^\\]]+)\\]|\\(([^\\)]+)\\))$');
      PropertyBindingParser = (function($__super) {
        function PropertyBindingParser(parser) {
          $traceurRuntime.superConstructor(PropertyBindingParser).call(this);
          this._parser = parser;
        }
        return ($traceurRuntime.createClass)(PropertyBindingParser, {
          process: function(parent, current, control) {
            var $__0 = this;
            var attrs = current.attrs();
            var newAttrs = MapWrapper.create();
            MapWrapper.forEach(attrs, (function(attrValue, attrName) {
              var bindParts = RegExpWrapper.firstMatch(BIND_NAME_REGEXP, attrName);
              if (isPresent(bindParts)) {
                if (isPresent(bindParts[1])) {
                  $__0._bindProperty(bindParts[4], attrValue, current, newAttrs);
                } else if (isPresent(bindParts[2])) {
                  var identifier = bindParts[4];
                  var value = attrValue == '' ? '\$implicit' : attrValue;
                  $__0._bindVariable(identifier, value, current, newAttrs);
                } else if (isPresent(bindParts[3])) {
                  $__0._bindEvent(bindParts[4], attrValue, current, newAttrs);
                } else if (isPresent(bindParts[5])) {
                  $__0._bindProperty(bindParts[5], attrValue, current, newAttrs);
                } else if (isPresent(bindParts[6])) {
                  $__0._bindEvent(bindParts[6], attrValue, current, newAttrs);
                }
              } else {
                var expr = $__0._parser.parseInterpolation(attrValue, current.elementDescription);
                if (isPresent(expr)) {
                  $__0._bindPropertyAst(attrName, expr, current, newAttrs);
                }
              }
            }));
            MapWrapper.forEach(newAttrs, (function(attrValue, attrName) {
              MapWrapper.set(attrs, attrName, attrValue);
            }));
          },
          _bindVariable: function(identifier, value, current, newAttrs) {
            current.bindElement().bindVariable(dashCaseToCamelCase(identifier), value);
            MapWrapper.set(newAttrs, identifier, value);
          },
          _bindProperty: function(name, expression, current, newAttrs) {
            this._bindPropertyAst(name, this._parser.parseBinding(expression, current.elementDescription), current, newAttrs);
          },
          _bindPropertyAst: function(name, ast, current, newAttrs) {
            var binder = current.bindElement();
            var camelCaseName = dashCaseToCamelCase(name);
            binder.bindProperty(camelCaseName, ast);
            MapWrapper.set(newAttrs, name, ast.source);
          },
          _bindEvent: function(name, expression, current, newAttrs) {
            current.bindElement().bindEvent(dashCaseToCamelCase(name), this._parser.parseAction(expression, current.elementDescription));
          }
        }, {}, $__super);
      }(CompileStep));
      $__export("PropertyBindingParser", PropertyBindingParser);
      Object.defineProperty(PropertyBindingParser, "parameters", {get: function() {
          return [[Parser]];
        }});
      Object.defineProperty(PropertyBindingParser.prototype.process, "parameters", {get: function() {
          return [[CompileElement], [CompileElement], [CompileControl]];
        }});
      Object.defineProperty(PropertyBindingParser.prototype._bindVariable, "parameters", {get: function() {
          return [[], [], [CompileElement], []];
        }});
      Object.defineProperty(PropertyBindingParser.prototype._bindProperty, "parameters", {get: function() {
          return [[], [], [CompileElement], []];
        }});
      Object.defineProperty(PropertyBindingParser.prototype._bindPropertyAst, "parameters", {get: function() {
          return [[], [], [CompileElement], []];
        }});
      Object.defineProperty(PropertyBindingParser.prototype._bindEvent, "parameters", {get: function() {
          return [[], [], [CompileElement], []];
        }});
    }
  };
});

System.register("angular2/src/render/dom/compiler/selector", ["angular2/src/facade/collection", "angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/render/dom/compiler/selector";
  var List,
      Map,
      ListWrapper,
      MapWrapper,
      isPresent,
      isBlank,
      RegExpWrapper,
      RegExpMatcherWrapper,
      StringWrapper,
      BaseException,
      _EMPTY_ATTR_VALUE,
      _SELECTOR_REGEXP,
      CssSelector,
      SelectorMatcher,
      SelectorListContext,
      SelectorContext;
  return {
    setters: [function($__m) {
      List = $__m.List;
      Map = $__m.Map;
      ListWrapper = $__m.ListWrapper;
      MapWrapper = $__m.MapWrapper;
    }, function($__m) {
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
      RegExpWrapper = $__m.RegExpWrapper;
      RegExpMatcherWrapper = $__m.RegExpMatcherWrapper;
      StringWrapper = $__m.StringWrapper;
      BaseException = $__m.BaseException;
    }],
    execute: function() {
      _EMPTY_ATTR_VALUE = '';
      _SELECTOR_REGEXP = RegExpWrapper.create('(\\:not\\()|' + '([-\\w]+)|' + '(?:\\.([-\\w]+))|' + '(?:\\[([-\\w*]+)(?:=([^\\]]*))?\\])|' + '(?:\\))|' + '(\\s*,\\s*)');
      CssSelector = (function() {
        function CssSelector() {
          this.element = null;
          this.classNames = ListWrapper.create();
          this.attrs = ListWrapper.create();
          this.notSelector = null;
        }
        return ($traceurRuntime.createClass)(CssSelector, {
          setElement: function() {
            var element = arguments[0] !== (void 0) ? arguments[0] : null;
            if (isPresent(element)) {
              element = element.toLowerCase();
            }
            this.element = element;
          },
          addAttribute: function(name) {
            var value = arguments[1] !== (void 0) ? arguments[1] : _EMPTY_ATTR_VALUE;
            ListWrapper.push(this.attrs, name.toLowerCase());
            if (isPresent(value)) {
              value = value.toLowerCase();
            } else {
              value = _EMPTY_ATTR_VALUE;
            }
            ListWrapper.push(this.attrs, value);
          },
          addClassName: function(name) {
            ListWrapper.push(this.classNames, name.toLowerCase());
          },
          toString: function() {
            var res = '';
            if (isPresent(this.element)) {
              res += this.element;
            }
            if (isPresent(this.classNames)) {
              for (var i = 0; i < this.classNames.length; i++) {
                res += '.' + this.classNames[i];
              }
            }
            if (isPresent(this.attrs)) {
              for (var i = 0; i < this.attrs.length; ) {
                var attrName = this.attrs[i++];
                var attrValue = this.attrs[i++];
                res += '[' + attrName;
                if (attrValue.length > 0) {
                  res += '=' + attrValue;
                }
                res += ']';
              }
            }
            if (isPresent(this.notSelector)) {
              res += ":not(" + this.notSelector.toString() + ")";
            }
            return res;
          }
        }, {parse: function(selector) {
            var results = ListWrapper.create();
            var _addResult = (function(res, cssSel) {
              if (isPresent(cssSel.notSelector) && isBlank(cssSel.element) && ListWrapper.isEmpty(cssSel.classNames) && ListWrapper.isEmpty(cssSel.attrs)) {
                cssSel.element = "*";
              }
              ListWrapper.push(res, cssSel);
            });
            var cssSelector = new CssSelector();
            var matcher = RegExpWrapper.matcher(_SELECTOR_REGEXP, selector);
            var match;
            var current = cssSelector;
            while (isPresent(match = RegExpMatcherWrapper.next(matcher))) {
              if (isPresent(match[1])) {
                if (isPresent(cssSelector.notSelector)) {
                  throw new BaseException('Nesting :not is not allowed in a selector');
                }
                current.notSelector = new CssSelector();
                current = current.notSelector;
              }
              if (isPresent(match[2])) {
                current.setElement(match[2]);
              }
              if (isPresent(match[3])) {
                current.addClassName(match[3]);
              }
              if (isPresent(match[4])) {
                current.addAttribute(match[4], match[5]);
              }
              if (isPresent(match[6])) {
                _addResult(results, cssSelector);
                cssSelector = current = new CssSelector();
              }
            }
            _addResult(results, cssSelector);
            return results;
          }});
      }());
      $__export("CssSelector", CssSelector);
      Object.defineProperty(CssSelector.parse, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(CssSelector.prototype.setElement, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(CssSelector.prototype.addAttribute, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(CssSelector.prototype.addClassName, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      SelectorMatcher = (function() {
        function SelectorMatcher() {
          this._elementMap = MapWrapper.create();
          this._elementPartialMap = MapWrapper.create();
          this._classMap = MapWrapper.create();
          this._classPartialMap = MapWrapper.create();
          this._attrValueMap = MapWrapper.create();
          this._attrValuePartialMap = MapWrapper.create();
          this._listContexts = ListWrapper.create();
        }
        return ($traceurRuntime.createClass)(SelectorMatcher, {
          addSelectables: function(cssSelectors, callbackCtxt) {
            var listContext = null;
            if (cssSelectors.length > 1) {
              listContext = new SelectorListContext(cssSelectors);
              ListWrapper.push(this._listContexts, listContext);
            }
            for (var i = 0; i < cssSelectors.length; i++) {
              this.addSelectable(cssSelectors[i], callbackCtxt, listContext);
            }
          },
          addSelectable: function(cssSelector, callbackCtxt, listContext) {
            var matcher = this;
            var element = cssSelector.element;
            var classNames = cssSelector.classNames;
            var attrs = cssSelector.attrs;
            var selectable = new SelectorContext(cssSelector, callbackCtxt, listContext);
            if (isPresent(element)) {
              var isTerminal = attrs.length === 0 && classNames.length === 0;
              if (isTerminal) {
                this._addTerminal(matcher._elementMap, element, selectable);
              } else {
                matcher = this._addPartial(matcher._elementPartialMap, element);
              }
            }
            if (isPresent(classNames)) {
              for (var index = 0; index < classNames.length; index++) {
                var isTerminal = attrs.length === 0 && index === classNames.length - 1;
                var className = classNames[index];
                if (isTerminal) {
                  this._addTerminal(matcher._classMap, className, selectable);
                } else {
                  matcher = this._addPartial(matcher._classPartialMap, className);
                }
              }
            }
            if (isPresent(attrs)) {
              for (var index = 0; index < attrs.length; ) {
                var isTerminal = index === attrs.length - 2;
                var attrName = attrs[index++];
                var attrValue = attrs[index++];
                var map = isTerminal ? matcher._attrValueMap : matcher._attrValuePartialMap;
                var valuesMap = MapWrapper.get(map, attrName);
                if (isBlank(valuesMap)) {
                  valuesMap = MapWrapper.create();
                  MapWrapper.set(map, attrName, valuesMap);
                }
                if (isTerminal) {
                  this._addTerminal(valuesMap, attrValue, selectable);
                } else {
                  matcher = this._addPartial(valuesMap, attrValue);
                }
              }
            }
          },
          _addTerminal: function(map, name, selectable) {
            var terminalList = MapWrapper.get(map, name);
            if (isBlank(terminalList)) {
              terminalList = ListWrapper.create();
              MapWrapper.set(map, name, terminalList);
            }
            ListWrapper.push(terminalList, selectable);
          },
          _addPartial: function(map, name) {
            var matcher = MapWrapper.get(map, name);
            if (isBlank(matcher)) {
              matcher = new SelectorMatcher();
              MapWrapper.set(map, name, matcher);
            }
            return matcher;
          },
          match: function(cssSelector, matchedCallback) {
            var result = false;
            var element = cssSelector.element;
            var classNames = cssSelector.classNames;
            var attrs = cssSelector.attrs;
            for (var i = 0; i < this._listContexts.length; i++) {
              this._listContexts[i].alreadyMatched = false;
            }
            result = this._matchTerminal(this._elementMap, element, cssSelector, matchedCallback) || result;
            result = this._matchPartial(this._elementPartialMap, element, cssSelector, matchedCallback) || result;
            if (isPresent(classNames)) {
              for (var index = 0; index < classNames.length; index++) {
                var className = classNames[index];
                result = this._matchTerminal(this._classMap, className, cssSelector, matchedCallback) || result;
                result = this._matchPartial(this._classPartialMap, className, cssSelector, matchedCallback) || result;
              }
            }
            if (isPresent(attrs)) {
              for (var index = 0; index < attrs.length; ) {
                var attrName = attrs[index++];
                var attrValue = attrs[index++];
                var valuesMap = MapWrapper.get(this._attrValueMap, attrName);
                if (!StringWrapper.equals(attrValue, _EMPTY_ATTR_VALUE)) {
                  result = this._matchTerminal(valuesMap, _EMPTY_ATTR_VALUE, cssSelector, matchedCallback) || result;
                }
                result = this._matchTerminal(valuesMap, attrValue, cssSelector, matchedCallback) || result;
                valuesMap = MapWrapper.get(this._attrValuePartialMap, attrName);
                result = this._matchPartial(valuesMap, attrValue, cssSelector, matchedCallback) || result;
              }
            }
            return result;
          },
          _matchTerminal: function() {
            var map = arguments[0] !== (void 0) ? arguments[0] : null;
            var name = arguments[1];
            var cssSelector = arguments[2];
            var matchedCallback = arguments[3];
            if (isBlank(map) || isBlank(name)) {
              return false;
            }
            var selectables = MapWrapper.get(map, name);
            var starSelectables = MapWrapper.get(map, "*");
            if (isPresent(starSelectables)) {
              selectables = ListWrapper.concat(selectables, starSelectables);
            }
            if (isBlank(selectables)) {
              return false;
            }
            var selectable;
            var result = false;
            for (var index = 0; index < selectables.length; index++) {
              selectable = selectables[index];
              result = selectable.finalize(cssSelector, matchedCallback) || result;
            }
            return result;
          },
          _matchPartial: function() {
            var map = arguments[0] !== (void 0) ? arguments[0] : null;
            var name = arguments[1];
            var cssSelector = arguments[2];
            var matchedCallback = arguments[3];
            if (isBlank(map) || isBlank(name)) {
              return false;
            }
            var nestedSelector = MapWrapper.get(map, name);
            if (isBlank(nestedSelector)) {
              return false;
            }
            return nestedSelector.match(cssSelector, matchedCallback);
          }
        }, {});
      }());
      $__export("SelectorMatcher", SelectorMatcher);
      Object.defineProperty(SelectorMatcher.prototype.addSelectables, "parameters", {get: function() {
          return [[assert.genericType(List, CssSelector)], []];
        }});
      Object.defineProperty(SelectorMatcher.prototype.addSelectable, "parameters", {get: function() {
          return [[], [], [SelectorListContext]];
        }});
      Object.defineProperty(SelectorMatcher.prototype._addTerminal, "parameters", {get: function() {
          return [[assert.genericType(Map, assert.type.string, assert.type.string)], [assert.type.string], []];
        }});
      Object.defineProperty(SelectorMatcher.prototype._addPartial, "parameters", {get: function() {
          return [[assert.genericType(Map, assert.type.string, assert.type.string)], [assert.type.string]];
        }});
      Object.defineProperty(SelectorMatcher.prototype.match, "parameters", {get: function() {
          return [[CssSelector], [Function]];
        }});
      Object.defineProperty(SelectorMatcher.prototype._matchTerminal, "parameters", {get: function() {
          return [[assert.genericType(Map, assert.type.string, assert.type.string)], [], [], []];
        }});
      Object.defineProperty(SelectorMatcher.prototype._matchPartial, "parameters", {get: function() {
          return [[assert.genericType(Map, assert.type.string, assert.type.string)], [], [], []];
        }});
      SelectorListContext = (function() {
        function SelectorListContext(selectors) {
          this.selectors = selectors;
          this.alreadyMatched = false;
        }
        return ($traceurRuntime.createClass)(SelectorListContext, {}, {});
      }());
      Object.defineProperty(SelectorListContext, "parameters", {get: function() {
          return [[assert.genericType(List, CssSelector)]];
        }});
      SelectorContext = (function() {
        function SelectorContext(selector, cbContext, listContext) {
          this.selector = selector;
          this.notSelector = selector.notSelector;
          this.cbContext = cbContext;
          this.listContext = listContext;
        }
        return ($traceurRuntime.createClass)(SelectorContext, {finalize: function(cssSelector, callback) {
            var result = true;
            if (isPresent(this.notSelector) && (isBlank(this.listContext) || !this.listContext.alreadyMatched)) {
              var notMatcher = new SelectorMatcher();
              notMatcher.addSelectable(this.notSelector, null, null);
              result = !notMatcher.match(cssSelector, null);
            }
            if (result && isPresent(callback) && (isBlank(this.listContext) || !this.listContext.alreadyMatched)) {
              if (isPresent(this.listContext)) {
                this.listContext.alreadyMatched = true;
              }
              callback(this.selector, this.cbContext);
            }
            return result;
          }}, {});
      }());
      Object.defineProperty(SelectorContext, "parameters", {get: function() {
          return [[CssSelector], [], [SelectorListContext]];
        }});
      Object.defineProperty(SelectorContext.prototype.finalize, "parameters", {get: function() {
          return [[CssSelector], []];
        }});
    }
  };
});

System.register("angular2/src/render/dom/compiler/template_loader", ["angular2/di", "angular2/src/facade/lang", "angular2/src/facade/collection", "angular2/src/facade/async", "angular2/src/dom/dom_adapter", "angular2/src/services/xhr", "../../api", "angular2/src/services/url_resolver"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/render/dom/compiler/template_loader";
  var Injectable,
      isBlank,
      isPresent,
      BaseException,
      stringify,
      Map,
      MapWrapper,
      StringMapWrapper,
      StringMap,
      PromiseWrapper,
      Promise,
      DOM,
      XHR,
      ViewDefinition,
      UrlResolver,
      TemplateLoader;
  return {
    setters: [function($__m) {
      Injectable = $__m.Injectable;
    }, function($__m) {
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
      BaseException = $__m.BaseException;
      stringify = $__m.stringify;
    }, function($__m) {
      Map = $__m.Map;
      MapWrapper = $__m.MapWrapper;
      StringMapWrapper = $__m.StringMapWrapper;
      StringMap = $__m.StringMap;
    }, function($__m) {
      PromiseWrapper = $__m.PromiseWrapper;
      Promise = $__m.Promise;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      XHR = $__m.XHR;
    }, function($__m) {
      ViewDefinition = $__m.ViewDefinition;
    }, function($__m) {
      UrlResolver = $__m.UrlResolver;
    }],
    execute: function() {
      TemplateLoader = (function() {
        function TemplateLoader(xhr, urlResolver) {
          this._xhr = xhr;
          this._htmlCache = StringMapWrapper.create();
        }
        return ($traceurRuntime.createClass)(TemplateLoader, {load: function(template) {
            if (isPresent(template.template)) {
              return PromiseWrapper.resolve(DOM.createTemplate(template.template));
            }
            var url = template.absUrl;
            if (isPresent(url)) {
              var promise = StringMapWrapper.get(this._htmlCache, url);
              if (isBlank(promise)) {
                promise = this._xhr.get(url).then(function(html) {
                  var template = DOM.createTemplate(html);
                  return template;
                });
                StringMapWrapper.set(this._htmlCache, url, promise);
              }
              return promise;
            }
            throw new BaseException('View should have either the url or template property set');
          }}, {});
      }());
      $__export("TemplateLoader", TemplateLoader);
      Object.defineProperty(TemplateLoader, "annotations", {get: function() {
          return [new Injectable()];
        }});
      Object.defineProperty(TemplateLoader, "parameters", {get: function() {
          return [[XHR], [UrlResolver]];
        }});
      Object.defineProperty(TemplateLoader.prototype.load, "parameters", {get: function() {
          return [[ViewDefinition]];
        }});
    }
  };
});

System.register("angular2/src/render/dom/compiler/text_interpolation_parser", ["angular2/src/facade/lang", "angular2/src/dom/dom_adapter", "angular2/change_detection", "./compile_step", "./compile_element", "./compile_control"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/render/dom/compiler/text_interpolation_parser";
  var RegExpWrapper,
      StringWrapper,
      isPresent,
      DOM,
      Parser,
      CompileStep,
      CompileElement,
      CompileControl,
      TextInterpolationParser;
  return {
    setters: [function($__m) {
      RegExpWrapper = $__m.RegExpWrapper;
      StringWrapper = $__m.StringWrapper;
      isPresent = $__m.isPresent;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      Parser = $__m.Parser;
    }, function($__m) {
      CompileStep = $__m.CompileStep;
    }, function($__m) {
      CompileElement = $__m.CompileElement;
    }, function($__m) {
      CompileControl = $__m.CompileControl;
    }],
    execute: function() {
      TextInterpolationParser = (function($__super) {
        function TextInterpolationParser(parser) {
          $traceurRuntime.superConstructor(TextInterpolationParser).call(this);
          this._parser = parser;
        }
        return ($traceurRuntime.createClass)(TextInterpolationParser, {process: function(parent, current, control) {
            if (!current.compileChildren) {
              return ;
            }
            var element = current.element;
            var childNodes = DOM.childNodes(DOM.templateAwareRoot(element));
            for (var i = 0; i < childNodes.length; i++) {
              var node = childNodes[i];
              if (DOM.isTextNode(node)) {
                var text = DOM.nodeValue(node);
                var expr = this._parser.parseInterpolation(text, current.elementDescription);
                if (isPresent(expr)) {
                  DOM.setText(node, ' ');
                  current.bindElement().bindText(i, expr);
                }
              }
            }
          }}, {}, $__super);
      }(CompileStep));
      $__export("TextInterpolationParser", TextInterpolationParser);
      Object.defineProperty(TextInterpolationParser, "parameters", {get: function() {
          return [[Parser]];
        }});
      Object.defineProperty(TextInterpolationParser.prototype.process, "parameters", {get: function() {
          return [[CompileElement], [CompileElement], [CompileControl]];
        }});
    }
  };
});

System.register("angular2/src/render/dom/compiler/view_splitter", ["angular2/src/facade/lang", "angular2/src/dom/dom_adapter", "angular2/src/facade/collection", "angular2/change_detection", "./compile_step", "./compile_element", "./compile_control", "../util"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/render/dom/compiler/view_splitter";
  var isBlank,
      isPresent,
      BaseException,
      StringWrapper,
      DOM,
      MapWrapper,
      ListWrapper,
      Parser,
      CompileStep,
      CompileElement,
      CompileControl,
      dashCaseToCamelCase,
      ViewSplitter;
  return {
    setters: [function($__m) {
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
      BaseException = $__m.BaseException;
      StringWrapper = $__m.StringWrapper;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      MapWrapper = $__m.MapWrapper;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      Parser = $__m.Parser;
    }, function($__m) {
      CompileStep = $__m.CompileStep;
    }, function($__m) {
      CompileElement = $__m.CompileElement;
    }, function($__m) {
      CompileControl = $__m.CompileControl;
    }, function($__m) {
      dashCaseToCamelCase = $__m.dashCaseToCamelCase;
    }],
    execute: function() {
      ViewSplitter = (function($__super) {
        function ViewSplitter(parser) {
          $traceurRuntime.superConstructor(ViewSplitter).call(this);
          this._parser = parser;
        }
        return ($traceurRuntime.createClass)(ViewSplitter, {
          process: function(parent, current, control) {
            var attrs = current.attrs();
            var templateBindings = MapWrapper.get(attrs, 'template');
            var hasTemplateBinding = isPresent(templateBindings);
            MapWrapper.forEach(attrs, (function(attrValue, attrName) {
              if (StringWrapper.startsWith(attrName, '*')) {
                var key = StringWrapper.substring(attrName, 1);
                if (hasTemplateBinding) {
                  throw new BaseException("Only one template directive per element is allowed: " + (templateBindings + " and " + key + " cannot be used simultaneously ") + ("in " + current.elementDescription));
                } else {
                  templateBindings = (attrValue.length == 0) ? key : key + ' ' + attrValue;
                  hasTemplateBinding = true;
                }
              }
            }));
            if (isPresent(parent)) {
              if (DOM.isTemplateElement(current.element)) {
                if (!current.isViewRoot) {
                  var viewRoot = new CompileElement(DOM.createTemplate(''));
                  viewRoot.inheritedProtoView = current.bindElement().bindNestedProtoView(viewRoot.element);
                  viewRoot.elementDescription = current.elementDescription;
                  viewRoot.isViewRoot = true;
                  this._moveChildNodes(DOM.content(current.element), DOM.content(viewRoot.element));
                  control.addChild(viewRoot);
                }
              }
              if (hasTemplateBinding) {
                var newParent = new CompileElement(DOM.createTemplate(''));
                newParent.inheritedProtoView = current.inheritedProtoView;
                newParent.inheritedElementBinder = current.inheritedElementBinder;
                newParent.distanceToInheritedBinder = current.distanceToInheritedBinder;
                newParent.elementDescription = current.elementDescription;
                current.inheritedProtoView = newParent.bindElement().bindNestedProtoView(current.element);
                current.inheritedElementBinder = null;
                current.distanceToInheritedBinder = 0;
                current.isViewRoot = true;
                this._parseTemplateBindings(templateBindings, newParent);
                this._addParentElement(current.element, newParent.element);
                control.addParent(newParent);
                DOM.remove(current.element);
              }
            }
          },
          _moveChildNodes: function(source, target) {
            var next = DOM.firstChild(source);
            while (isPresent(next)) {
              DOM.appendChild(target, next);
              next = DOM.firstChild(source);
            }
          },
          _addParentElement: function(currentElement, newParentElement) {
            DOM.insertBefore(currentElement, newParentElement);
            DOM.appendChild(newParentElement, currentElement);
          },
          _parseTemplateBindings: function(templateBindings, compileElement) {
            var bindings = this._parser.parseTemplateBindings(templateBindings, compileElement.elementDescription);
            for (var i = 0; i < bindings.length; i++) {
              var binding = bindings[i];
              if (binding.keyIsVar) {
                compileElement.bindElement().bindVariable(dashCaseToCamelCase(binding.key), binding.name);
                MapWrapper.set(compileElement.attrs(), binding.key, binding.name);
              } else if (isPresent(binding.expression)) {
                compileElement.bindElement().bindProperty(dashCaseToCamelCase(binding.key), binding.expression);
                MapWrapper.set(compileElement.attrs(), binding.key, binding.expression.source);
              } else {
                DOM.setAttribute(compileElement.element, binding.key, '');
              }
            }
          }
        }, {}, $__super);
      }(CompileStep));
      $__export("ViewSplitter", ViewSplitter);
      Object.defineProperty(ViewSplitter, "parameters", {get: function() {
          return [[Parser]];
        }});
      Object.defineProperty(ViewSplitter.prototype.process, "parameters", {get: function() {
          return [[CompileElement], [CompileElement], [CompileControl]];
        }});
      Object.defineProperty(ViewSplitter.prototype._parseTemplateBindings, "parameters", {get: function() {
          return [[assert.type.string], [CompileElement]];
        }});
    }
  };
});

System.register("angular2/src/render/dom/shadow_dom/content_tag", ["./light_dom", "angular2/src/dom/dom_adapter", "angular2/src/facade/lang", "angular2/src/facade/collection"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/render/dom/shadow_dom/content_tag";
  var ldModule,
      DOM,
      isPresent,
      List,
      ListWrapper,
      ContentStrategy,
      RenderedContent,
      IntermediateContent,
      Content;
  return {
    setters: [function($__m) {
      ldModule = $__m;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      isPresent = $__m.isPresent;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
    }],
    execute: function() {
      ContentStrategy = (function() {
        function ContentStrategy() {}
        return ($traceurRuntime.createClass)(ContentStrategy, {insert: function(nodes) {}}, {});
      }());
      Object.defineProperty(ContentStrategy.prototype.insert, "parameters", {get: function() {
          return [[List]];
        }});
      RenderedContent = (function($__super) {
        function RenderedContent(contentEl) {
          $traceurRuntime.superConstructor(RenderedContent).call(this);
          this.beginScript = contentEl;
          this.endScript = DOM.nextSibling(this.beginScript);
          this.nodes = [];
        }
        return ($traceurRuntime.createClass)(RenderedContent, {
          insert: function(nodes) {
            this.nodes = nodes;
            DOM.insertAllBefore(this.endScript, nodes);
            this._removeNodesUntil(ListWrapper.isEmpty(nodes) ? this.endScript : nodes[0]);
          },
          _removeNodesUntil: function(node) {
            var p = DOM.parentElement(this.beginScript);
            for (var next = DOM.nextSibling(this.beginScript); next !== node; next = DOM.nextSibling(this.beginScript)) {
              DOM.removeChild(p, next);
            }
          }
        }, {}, $__super);
      }(ContentStrategy));
      Object.defineProperty(RenderedContent.prototype.insert, "parameters", {get: function() {
          return [[List]];
        }});
      IntermediateContent = (function($__super) {
        function IntermediateContent(destinationLightDom) {
          $traceurRuntime.superConstructor(IntermediateContent).call(this);
          this.nodes = [];
          this.destinationLightDom = destinationLightDom;
        }
        return ($traceurRuntime.createClass)(IntermediateContent, {insert: function(nodes) {
            this.nodes = nodes;
            this.destinationLightDom.redistribute();
          }}, {}, $__super);
      }(ContentStrategy));
      Object.defineProperty(IntermediateContent, "parameters", {get: function() {
          return [[ldModule.LightDom]];
        }});
      Object.defineProperty(IntermediateContent.prototype.insert, "parameters", {get: function() {
          return [[List]];
        }});
      Content = (function() {
        function Content(contentStartEl, selector) {
          this.select = selector;
          this.contentStartElement = contentStartEl;
          this._strategy = null;
        }
        return ($traceurRuntime.createClass)(Content, {
          hydrate: function(destinationLightDom) {
            this._strategy = isPresent(destinationLightDom) ? new IntermediateContent(destinationLightDom) : new RenderedContent(this.contentStartElement);
          },
          dehydrate: function() {
            this._strategy = null;
          },
          nodes: function() {
            return this._strategy.nodes;
          },
          insert: function(nodes) {
            this._strategy.insert(nodes);
          }
        }, {});
      }());
      $__export("Content", Content);
      Object.defineProperty(Content, "parameters", {get: function() {
          return [[], [assert.type.string]];
        }});
      Object.defineProperty(Content.prototype.hydrate, "parameters", {get: function() {
          return [[ldModule.LightDom]];
        }});
      Object.defineProperty(Content.prototype.insert, "parameters", {get: function() {
          return [[List]];
        }});
    }
  };
});

System.register("angular2/src/render/dom/shadow_dom/emulated_scoped_shadow_dom_strategy", ["angular2/src/facade/lang", "angular2/src/facade/async", "angular2/src/dom/dom_adapter", "angular2/src/render/dom/shadow_dom/style_inliner", "angular2/src/render/dom/shadow_dom/style_url_resolver", "./emulated_unscoped_shadow_dom_strategy", "./util"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/render/dom/shadow_dom/emulated_scoped_shadow_dom_strategy";
  var isBlank,
      isPresent,
      PromiseWrapper,
      Promise,
      DOM,
      StyleInliner,
      StyleUrlResolver,
      EmulatedUnscopedShadowDomStrategy,
      getContentAttribute,
      getHostAttribute,
      getComponentId,
      shimCssForComponent,
      insertStyleElement,
      EmulatedScopedShadowDomStrategy;
  return {
    setters: [function($__m) {
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
    }, function($__m) {
      PromiseWrapper = $__m.PromiseWrapper;
      Promise = $__m.Promise;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      StyleInliner = $__m.StyleInliner;
    }, function($__m) {
      StyleUrlResolver = $__m.StyleUrlResolver;
    }, function($__m) {
      EmulatedUnscopedShadowDomStrategy = $__m.EmulatedUnscopedShadowDomStrategy;
    }, function($__m) {
      getContentAttribute = $__m.getContentAttribute;
      getHostAttribute = $__m.getHostAttribute;
      getComponentId = $__m.getComponentId;
      shimCssForComponent = $__m.shimCssForComponent;
      insertStyleElement = $__m.insertStyleElement;
    }],
    execute: function() {
      EmulatedScopedShadowDomStrategy = (function($__super) {
        function EmulatedScopedShadowDomStrategy(styleInliner, styleUrlResolver, styleHost) {
          $traceurRuntime.superConstructor(EmulatedScopedShadowDomStrategy).call(this, styleUrlResolver, styleHost);
          this.styleInliner = styleInliner;
        }
        return ($traceurRuntime.createClass)(EmulatedScopedShadowDomStrategy, {
          processStyleElement: function(hostComponentId, templateUrl, styleEl) {
            var cssText = DOM.getText(styleEl);
            cssText = this.styleUrlResolver.resolveUrls(cssText, templateUrl);
            var css = this.styleInliner.inlineImports(cssText, templateUrl);
            if (PromiseWrapper.isPromise(css)) {
              DOM.setText(styleEl, '');
              return css.then((function(css) {
                css = shimCssForComponent(css, hostComponentId);
                DOM.setText(styleEl, css);
              }));
            } else {
              css = shimCssForComponent(css, hostComponentId);
              DOM.setText(styleEl, css);
            }
            DOM.remove(styleEl);
            insertStyleElement(this.styleHost, styleEl);
            return null;
          },
          processElement: function(hostComponentId, elementComponentId, element) {
            if (isPresent(hostComponentId)) {
              var contentAttribute = getContentAttribute(getComponentId(hostComponentId));
              DOM.setAttribute(element, contentAttribute, '');
            }
            if (isPresent(elementComponentId)) {
              var hostAttribute = getHostAttribute(getComponentId(elementComponentId));
              DOM.setAttribute(element, hostAttribute, '');
            }
          }
        }, {}, $__super);
      }(EmulatedUnscopedShadowDomStrategy));
      $__export("EmulatedScopedShadowDomStrategy", EmulatedScopedShadowDomStrategy);
      Object.defineProperty(EmulatedScopedShadowDomStrategy, "parameters", {get: function() {
          return [[StyleInliner], [StyleUrlResolver], []];
        }});
      Object.defineProperty(EmulatedScopedShadowDomStrategy.prototype.processStyleElement, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string], []];
        }});
      Object.defineProperty(EmulatedScopedShadowDomStrategy.prototype.processElement, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string], []];
        }});
    }
  };
});

System.register("angular2/src/render/dom/shadow_dom/emulated_unscoped_shadow_dom_strategy", ["angular2/src/facade/async", "angular2/src/dom/dom_adapter", "../view/view", "./light_dom", "./shadow_dom_strategy", "./style_url_resolver", "./util"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/render/dom/shadow_dom/emulated_unscoped_shadow_dom_strategy";
  var Promise,
      DOM,
      viewModule,
      LightDom,
      ShadowDomStrategy,
      StyleUrlResolver,
      moveViewNodesIntoParent,
      insertSharedStyleText,
      EmulatedUnscopedShadowDomStrategy;
  return {
    setters: [function($__m) {
      Promise = $__m.Promise;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      viewModule = $__m;
    }, function($__m) {
      LightDom = $__m.LightDom;
    }, function($__m) {
      ShadowDomStrategy = $__m.ShadowDomStrategy;
    }, function($__m) {
      StyleUrlResolver = $__m.StyleUrlResolver;
    }, function($__m) {
      moveViewNodesIntoParent = $__m.moveViewNodesIntoParent;
      insertSharedStyleText = $__m.insertSharedStyleText;
    }],
    execute: function() {
      EmulatedUnscopedShadowDomStrategy = (function($__super) {
        function EmulatedUnscopedShadowDomStrategy(styleUrlResolver, styleHost) {
          $traceurRuntime.superConstructor(EmulatedUnscopedShadowDomStrategy).call(this);
          this.styleUrlResolver = styleUrlResolver;
          this.styleHost = styleHost;
        }
        return ($traceurRuntime.createClass)(EmulatedUnscopedShadowDomStrategy, {
          hasNativeContentElement: function() {
            return false;
          },
          attachTemplate: function(el, view) {
            moveViewNodesIntoParent(el, view);
          },
          constructLightDom: function(lightDomView, shadowDomView, el) {
            return new LightDom(lightDomView, shadowDomView, el);
          },
          processStyleElement: function(hostComponentId, templateUrl, styleEl) {
            var cssText = DOM.getText(styleEl);
            cssText = this.styleUrlResolver.resolveUrls(cssText, templateUrl);
            DOM.setText(styleEl, cssText);
            DOM.remove(styleEl);
            insertSharedStyleText(cssText, this.styleHost, styleEl);
            return null;
          }
        }, {}, $__super);
      }(ShadowDomStrategy));
      $__export("EmulatedUnscopedShadowDomStrategy", EmulatedUnscopedShadowDomStrategy);
      Object.defineProperty(EmulatedUnscopedShadowDomStrategy, "parameters", {get: function() {
          return [[StyleUrlResolver], []];
        }});
      Object.defineProperty(EmulatedUnscopedShadowDomStrategy.prototype.attachTemplate, "parameters", {get: function() {
          return [[], [viewModule.RenderView]];
        }});
      Object.defineProperty(EmulatedUnscopedShadowDomStrategy.prototype.constructLightDom, "parameters", {get: function() {
          return [[viewModule.RenderView], [viewModule.RenderView], []];
        }});
      Object.defineProperty(EmulatedUnscopedShadowDomStrategy.prototype.processStyleElement, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string], []];
        }});
    }
  };
});

System.register("angular2/src/render/dom/shadow_dom/light_dom", ["angular2/src/dom/dom_adapter", "angular2/src/facade/collection", "angular2/src/facade/lang", "../view/view", "./content_tag"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/render/dom/shadow_dom/light_dom";
  var DOM,
      List,
      ListWrapper,
      isBlank,
      isPresent,
      viewModule,
      Content,
      DestinationLightDom,
      _Root,
      LightDom;
  function redistributeNodes(contents, nodes) {
    for (var i = 0; i < contents.length; ++i) {
      var content = contents[i];
      var select = content.select;
      if (select.length === 0) {
        content.insert(ListWrapper.clone(nodes));
        ListWrapper.clear(nodes);
      } else {
        var matchSelector = (function(n) {
          return DOM.elementMatches(n, select);
        });
        var matchingNodes = ListWrapper.filter(nodes, matchSelector);
        content.insert(matchingNodes);
        ListWrapper.removeAll(nodes, matchingNodes);
      }
    }
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (isPresent(node.parentNode)) {
        DOM.remove(nodes[i]);
      }
    }
  }
  return {
    setters: [function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
    }, function($__m) {
      viewModule = $__m;
    }, function($__m) {
      Content = $__m.Content;
    }],
    execute: function() {
      DestinationLightDom = (function() {
        function DestinationLightDom() {}
        return ($traceurRuntime.createClass)(DestinationLightDom, {}, {});
      }());
      $__export("DestinationLightDom", DestinationLightDom);
      _Root = (function() {
        function _Root(node, boundElementIndex) {
          this.node = node;
          this.boundElementIndex = boundElementIndex;
        }
        return ($traceurRuntime.createClass)(_Root, {}, {});
      }());
      LightDom = (function() {
        function LightDom(lightDomView, shadowDomView, element) {
          this.lightDomView = lightDomView;
          this.shadowDomView = shadowDomView;
          this.nodes = DOM.childNodesAsList(element);
          this.roots = null;
        }
        return ($traceurRuntime.createClass)(LightDom, {
          redistribute: function() {
            redistributeNodes(this.contentTags(), this.expandedDomNodes());
          },
          contentTags: function() {
            return this._collectAllContentTags(this.shadowDomView, []);
          },
          _collectAllContentTags: function(view, acc) {
            var $__0 = this;
            var contentTags = view.contentTags;
            var vcs = view.viewContainers;
            for (var i = 0; i < vcs.length; i++) {
              var vc = vcs[i];
              var contentTag = contentTags[i];
              if (isPresent(contentTag)) {
                ListWrapper.push(acc, contentTag);
              }
              if (isPresent(vc)) {
                ListWrapper.forEach(vc.contentTagContainers(), (function(view) {
                  $__0._collectAllContentTags(view, acc);
                }));
              }
            }
            return acc;
          },
          expandedDomNodes: function() {
            var res = [];
            var roots = this._roots();
            for (var i = 0; i < roots.length; ++i) {
              var root = roots[i];
              if (isPresent(root.boundElementIndex)) {
                var vc = this.lightDomView.viewContainers[root.boundElementIndex];
                var content = this.lightDomView.contentTags[root.boundElementIndex];
                if (isPresent(vc)) {
                  res = ListWrapper.concat(res, vc.nodes());
                } else if (isPresent(content)) {
                  res = ListWrapper.concat(res, content.nodes());
                } else {
                  ListWrapper.push(res, root.node);
                }
              } else {
                ListWrapper.push(res, root.node);
              }
            }
            return res;
          },
          _roots: function() {
            if (isPresent(this.roots))
              return this.roots;
            var boundElements = this.lightDomView.boundElements;
            this.roots = ListWrapper.map(this.nodes, (function(n) {
              var boundElementIndex = null;
              for (var i = 0; i < boundElements.length; i++) {
                var boundEl = boundElements[i];
                if (isPresent(boundEl) && boundEl === n) {
                  boundElementIndex = i;
                  break;
                }
              }
              return new _Root(n, boundElementIndex);
            }));
            return this.roots;
          }
        }, {});
      }());
      $__export("LightDom", LightDom);
      Object.defineProperty(LightDom, "parameters", {get: function() {
          return [[viewModule.RenderView], [viewModule.RenderView], []];
        }});
      Object.defineProperty(LightDom.prototype._collectAllContentTags, "parameters", {get: function() {
          return [[viewModule.RenderView], [assert.genericType(List, Content)]];
        }});
      Object.defineProperty(redistributeNodes, "parameters", {get: function() {
          return [[assert.genericType(List, Content)], [List]];
        }});
    }
  };
});

System.register("angular2/src/render/dom/shadow_dom/native_shadow_dom_strategy", ["angular2/src/facade/async", "angular2/src/dom/dom_adapter", "../view/view", "./style_url_resolver", "./shadow_dom_strategy", "./util"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/render/dom/shadow_dom/native_shadow_dom_strategy";
  var Promise,
      DOM,
      viewModule,
      StyleUrlResolver,
      ShadowDomStrategy,
      moveViewNodesIntoParent,
      NativeShadowDomStrategy;
  return {
    setters: [function($__m) {
      Promise = $__m.Promise;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      viewModule = $__m;
    }, function($__m) {
      StyleUrlResolver = $__m.StyleUrlResolver;
    }, function($__m) {
      ShadowDomStrategy = $__m.ShadowDomStrategy;
    }, function($__m) {
      moveViewNodesIntoParent = $__m.moveViewNodesIntoParent;
    }],
    execute: function() {
      NativeShadowDomStrategy = (function($__super) {
        function NativeShadowDomStrategy(styleUrlResolver) {
          $traceurRuntime.superConstructor(NativeShadowDomStrategy).call(this);
          this.styleUrlResolver = styleUrlResolver;
        }
        return ($traceurRuntime.createClass)(NativeShadowDomStrategy, {
          attachTemplate: function(el, view) {
            moveViewNodesIntoParent(DOM.createShadowRoot(el), view);
          },
          processStyleElement: function(hostComponentId, templateUrl, styleEl) {
            var cssText = DOM.getText(styleEl);
            cssText = this.styleUrlResolver.resolveUrls(cssText, templateUrl);
            DOM.setText(styleEl, cssText);
            return null;
          }
        }, {}, $__super);
      }(ShadowDomStrategy));
      $__export("NativeShadowDomStrategy", NativeShadowDomStrategy);
      Object.defineProperty(NativeShadowDomStrategy, "parameters", {get: function() {
          return [[StyleUrlResolver]];
        }});
      Object.defineProperty(NativeShadowDomStrategy.prototype.attachTemplate, "parameters", {get: function() {
          return [[], [viewModule.RenderView]];
        }});
      Object.defineProperty(NativeShadowDomStrategy.prototype.processStyleElement, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string], []];
        }});
    }
  };
});

System.register("angular2/src/render/dom/shadow_dom/shadow_css", ["angular2/src/dom/dom_adapter", "angular2/src/facade/collection", "angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/render/dom/shadow_dom/shadow_css";
  var DOM,
      List,
      ListWrapper,
      StringWrapper,
      RegExp,
      RegExpWrapper,
      RegExpMatcherWrapper,
      isPresent,
      isBlank,
      BaseException,
      int,
      ShadowCss,
      _cssContentNextSelectorRe,
      _cssContentRuleRe,
      _cssContentUnscopedRuleRe,
      _polyfillHost,
      _polyfillHostContext,
      _parenSuffix,
      _cssColonHostRe,
      _cssColonHostContextRe,
      _polyfillHostNoCombinator,
      _shadowDOMSelectorsRe,
      _selectorReSuffix,
      _polyfillHostRe,
      _colonHostRe,
      _colonHostContextRe;
  function _cssToRules(cssText) {
    return DOM.cssToRules(cssText);
  }
  function _withCssRules(cssText, callback) {
    if (isBlank(callback))
      return ;
    var rules = _cssToRules(cssText);
    callback(rules);
  }
  return {
    setters: [function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      StringWrapper = $__m.StringWrapper;
      RegExp = $__m.RegExp;
      RegExpWrapper = $__m.RegExpWrapper;
      RegExpMatcherWrapper = $__m.RegExpMatcherWrapper;
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
      BaseException = $__m.BaseException;
      int = $__m.int;
    }],
    execute: function() {
      ShadowCss = (function() {
        function ShadowCss() {
          this.strictStyling = true;
        }
        return ($traceurRuntime.createClass)(ShadowCss, {
          shimStyle: function(style, selector) {
            var hostSelector = arguments[2] !== (void 0) ? arguments[2] : '';
            var cssText = DOM.getText(style);
            return this.shimCssText(cssText, selector, hostSelector);
          },
          shimCssText: function(cssText, selector) {
            var hostSelector = arguments[2] !== (void 0) ? arguments[2] : '';
            cssText = this._insertDirectives(cssText);
            return this._scopeCssText(cssText, selector, hostSelector);
          },
          _insertDirectives: function(cssText) {
            cssText = this._insertPolyfillDirectivesInCssText(cssText);
            return this._insertPolyfillRulesInCssText(cssText);
          },
          _insertPolyfillDirectivesInCssText: function(cssText) {
            return StringWrapper.replaceAllMapped(cssText, _cssContentNextSelectorRe, function(m) {
              return m[1] + '{';
            });
          },
          _insertPolyfillRulesInCssText: function(cssText) {
            return StringWrapper.replaceAllMapped(cssText, _cssContentRuleRe, function(m) {
              var rule = m[0];
              rule = StringWrapper.replace(rule, m[1], '');
              rule = StringWrapper.replace(rule, m[2], '');
              return m[3] + rule;
            });
          },
          _scopeCssText: function(cssText, scopeSelector, hostSelector) {
            var $__0 = this;
            var unscoped = this._extractUnscopedRulesFromCssText(cssText);
            cssText = this._insertPolyfillHostInCssText(cssText);
            cssText = this._convertColonHost(cssText);
            cssText = this._convertColonHostContext(cssText);
            cssText = this._convertShadowDOMSelectors(cssText);
            if (isPresent(scopeSelector)) {
              _withCssRules(cssText, (function(rules) {
                cssText = $__0._scopeRules(rules, scopeSelector, hostSelector);
              }));
            }
            cssText = cssText + '\n' + unscoped;
            return cssText.trim();
          },
          _extractUnscopedRulesFromCssText: function(cssText) {
            var r = '',
                m;
            var matcher = RegExpWrapper.matcher(_cssContentUnscopedRuleRe, cssText);
            while (isPresent(m = RegExpMatcherWrapper.next(matcher))) {
              var rule = m[0];
              rule = StringWrapper.replace(rule, m[2], '');
              rule = StringWrapper.replace(rule, m[1], m[3]);
              r = rule + '\n\n';
            }
            return r;
          },
          _convertColonHost: function(cssText) {
            return this._convertColonRule(cssText, _cssColonHostRe, this._colonHostPartReplacer);
          },
          _convertColonHostContext: function(cssText) {
            return this._convertColonRule(cssText, _cssColonHostContextRe, this._colonHostContextPartReplacer);
          },
          _convertColonRule: function(cssText, regExp, partReplacer) {
            return StringWrapper.replaceAllMapped(cssText, regExp, function(m) {
              if (isPresent(m[2])) {
                var parts = m[2].split(','),
                    r = [];
                for (var i = 0; i < parts.length; i++) {
                  var p = parts[i];
                  if (isBlank(p))
                    break;
                  p = p.trim();
                  ListWrapper.push(r, partReplacer(_polyfillHostNoCombinator, p, m[3]));
                }
                return r.join(',');
              } else {
                return _polyfillHostNoCombinator + m[3];
              }
            });
          },
          _colonHostContextPartReplacer: function(host, part, suffix) {
            if (StringWrapper.contains(part, _polyfillHost)) {
              return this._colonHostPartReplacer(host, part, suffix);
            } else {
              return host + part + suffix + ', ' + part + ' ' + host + suffix;
            }
          },
          _colonHostPartReplacer: function(host, part, suffix) {
            return host + StringWrapper.replace(part, _polyfillHost, '') + suffix;
          },
          _convertShadowDOMSelectors: function(cssText) {
            for (var i = 0; i < _shadowDOMSelectorsRe.length; i++) {
              cssText = StringWrapper.replaceAll(cssText, _shadowDOMSelectorsRe[i], ' ');
            }
            return cssText;
          },
          _scopeRules: function(cssRules, scopeSelector, hostSelector) {
            var cssText = '';
            if (isPresent(cssRules)) {
              for (var i = 0; i < cssRules.length; i++) {
                var rule = cssRules[i];
                if (DOM.isStyleRule(rule) || DOM.isPageRule(rule)) {
                  cssText += this._scopeSelector(rule.selectorText, scopeSelector, hostSelector, this.strictStyling) + ' {\n';
                  cssText += this._propertiesFromRule(rule) + '\n}\n\n';
                } else if (DOM.isMediaRule(rule)) {
                  cssText += '@media ' + rule.media.mediaText + ' {\n';
                  cssText += this._scopeRules(rule.cssRules, scopeSelector, hostSelector);
                  cssText += '\n}\n\n';
                } else {
                  try {
                    if (isPresent(rule.cssText)) {
                      cssText += rule.cssText + '\n\n';
                    }
                  } catch (x) {
                    if (DOM.isKeyframesRule(rule) && isPresent(rule.cssRules)) {
                      cssText += this._ieSafeCssTextFromKeyFrameRule(rule);
                    }
                  }
                }
              }
            }
            return cssText;
          },
          _ieSafeCssTextFromKeyFrameRule: function(rule) {
            var cssText = '@keyframes ' + rule.name + ' {';
            for (var i = 0; i < rule.cssRules.length; i++) {
              var r = rule.cssRules[i];
              cssText += ' ' + r.keyText + ' {' + r.style.cssText + '}';
            }
            cssText += ' }';
            return cssText;
          },
          _scopeSelector: function(selector, scopeSelector, hostSelector, strict) {
            var r = [],
                parts = selector.split(',');
            for (var i = 0; i < parts.length; i++) {
              var p = parts[i];
              p = p.trim();
              if (this._selectorNeedsScoping(p, scopeSelector)) {
                p = strict && !StringWrapper.contains(p, _polyfillHostNoCombinator) ? this._applyStrictSelectorScope(p, scopeSelector) : this._applySelectorScope(p, scopeSelector, hostSelector);
              }
              ListWrapper.push(r, p);
            }
            return r.join(', ');
          },
          _selectorNeedsScoping: function(selector, scopeSelector) {
            var re = this._makeScopeMatcher(scopeSelector);
            return !isPresent(RegExpWrapper.firstMatch(re, selector));
          },
          _makeScopeMatcher: function(scopeSelector) {
            var lre = RegExpWrapper.create('\\[');
            var rre = RegExpWrapper.create('\\]');
            scopeSelector = StringWrapper.replaceAll(scopeSelector, lre, '\\[');
            scopeSelector = StringWrapper.replaceAll(scopeSelector, rre, '\\]');
            return RegExpWrapper.create('^(' + scopeSelector + ')' + _selectorReSuffix, 'm');
          },
          _applySelectorScope: function(selector, scopeSelector, hostSelector) {
            return this._applySimpleSelectorScope(selector, scopeSelector, hostSelector);
          },
          _applySimpleSelectorScope: function(selector, scopeSelector, hostSelector) {
            if (isPresent(RegExpWrapper.firstMatch(_polyfillHostRe, selector))) {
              var replaceBy = this.strictStyling ? ("[" + hostSelector + "]") : scopeSelector;
              selector = StringWrapper.replace(selector, _polyfillHostNoCombinator, replaceBy);
              return StringWrapper.replaceAll(selector, _polyfillHostRe, replaceBy + ' ');
            } else {
              return scopeSelector + ' ' + selector;
            }
          },
          _applyStrictSelectorScope: function(selector, scopeSelector) {
            var isRe = RegExpWrapper.create('\\[is=([^\\]]*)\\]');
            scopeSelector = StringWrapper.replaceAllMapped(scopeSelector, isRe, (function(m) {
              return m[1];
            }));
            var splits = [' ', '>', '+', '~'],
                scoped = selector,
                attrName = '[' + scopeSelector + ']';
            for (var i = 0; i < splits.length; i++) {
              var sep = splits[i];
              var parts = scoped.split(sep);
              scoped = ListWrapper.map(parts, function(p) {
                var t = StringWrapper.replaceAll(p.trim(), _polyfillHostRe, '');
                if (t.length > 0 && !ListWrapper.contains(splits, t) && !StringWrapper.contains(t, attrName)) {
                  var re = RegExpWrapper.create('([^:]*)(:*)(.*)');
                  var m = RegExpWrapper.firstMatch(re, t);
                  if (isPresent(m)) {
                    p = m[1] + attrName + m[2] + m[3];
                  }
                }
                return p;
              }).join(sep);
            }
            return scoped;
          },
          _insertPolyfillHostInCssText: function(selector) {
            selector = StringWrapper.replaceAll(selector, _colonHostContextRe, _polyfillHostContext);
            selector = StringWrapper.replaceAll(selector, _colonHostRe, _polyfillHost);
            return selector;
          },
          _propertiesFromRule: function(rule) {
            var cssText = rule.style.cssText;
            var attrRe = RegExpWrapper.create('[\'"]+|attr');
            if (rule.style.content.length > 0 && !isPresent(RegExpWrapper.firstMatch(attrRe, rule.style.content))) {
              var contentRe = RegExpWrapper.create('content:[^;]*;');
              cssText = StringWrapper.replaceAll(cssText, contentRe, 'content: \'' + rule.style.content + '\';');
            }
            return cssText;
          }
        }, {});
      }());
      $__export("ShadowCss", ShadowCss);
      Object.defineProperty(ShadowCss.prototype.shimStyle, "parameters", {get: function() {
          return [[], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(ShadowCss.prototype.shimCssText, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(ShadowCss.prototype._insertDirectives, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(ShadowCss.prototype._insertPolyfillDirectivesInCssText, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(ShadowCss.prototype._insertPolyfillRulesInCssText, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(ShadowCss.prototype._scopeCssText, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(ShadowCss.prototype._extractUnscopedRulesFromCssText, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(ShadowCss.prototype._convertColonHost, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(ShadowCss.prototype._convertColonHostContext, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(ShadowCss.prototype._convertColonRule, "parameters", {get: function() {
          return [[assert.type.string], [RegExp], [Function]];
        }});
      Object.defineProperty(ShadowCss.prototype._colonHostContextPartReplacer, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(ShadowCss.prototype._colonHostPartReplacer, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(ShadowCss.prototype._convertShadowDOMSelectors, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(ShadowCss.prototype._scopeRules, "parameters", {get: function() {
          return [[], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(ShadowCss.prototype._scopeSelector, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string], [assert.type.string], [assert.type.boolean]];
        }});
      Object.defineProperty(ShadowCss.prototype._selectorNeedsScoping, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(ShadowCss.prototype._makeScopeMatcher, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(ShadowCss.prototype._applySelectorScope, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(ShadowCss.prototype._applySimpleSelectorScope, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(ShadowCss.prototype._applyStrictSelectorScope, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(ShadowCss.prototype._insertPolyfillHostInCssText, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      _cssContentNextSelectorRe = RegExpWrapper.create('polyfill-next-selector[^}]*content:[\\s]*?[\'"](.*?)[\'"][;\\s]*}([^{]*?){', 'im');
      _cssContentRuleRe = RegExpWrapper.create('(polyfill-rule)[^}]*(content:[\\s]*[\'"](.*?)[\'"])[;\\s]*[^}]*}', 'im');
      _cssContentUnscopedRuleRe = RegExpWrapper.create('(polyfill-unscoped-rule)[^}]*(content:[\\s]*[\'"](.*?)[\'"])[;\\s]*[^}]*}', 'im');
      _polyfillHost = '-shadowcsshost';
      _polyfillHostContext = '-shadowcsscontext';
      _parenSuffix = ')(?:\\((' + '(?:\\([^)(]*\\)|[^)(]*)+?' + ')\\))?([^,{]*)';
      _cssColonHostRe = RegExpWrapper.create('(' + _polyfillHost + _parenSuffix, 'im');
      _cssColonHostContextRe = RegExpWrapper.create('(' + _polyfillHostContext + _parenSuffix, 'im');
      _polyfillHostNoCombinator = _polyfillHost + '-no-combinator';
      _shadowDOMSelectorsRe = [RegExpWrapper.create('>>>'), RegExpWrapper.create('::shadow'), RegExpWrapper.create('::content'), RegExpWrapper.create('/deep/'), RegExpWrapper.create('/shadow-deep/'), RegExpWrapper.create('/shadow/')];
      _selectorReSuffix = '([>\\s~+\[.,{:][\\s\\S]*)?$';
      _polyfillHostRe = RegExpWrapper.create(_polyfillHost, 'im');
      _colonHostRe = RegExpWrapper.create(':host', 'im');
      _colonHostContextRe = RegExpWrapper.create(':host-context', 'im');
      Object.defineProperty(_cssToRules, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(_withCssRules, "parameters", {get: function() {
          return [[assert.type.string], [Function]];
        }});
    }
  };
});

System.register("angular2/src/render/dom/shadow_dom/shadow_dom_compile_step", ["angular2/src/facade/lang", "angular2/src/facade/collection", "angular2/src/facade/async", "angular2/src/dom/dom_adapter", "../compiler/compile_step", "../compiler/compile_element", "../compiler/compile_control", "../../api", "./shadow_dom_strategy"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/render/dom/shadow_dom/shadow_dom_compile_step";
  var isBlank,
      isPresent,
      assertionsEnabled,
      MapWrapper,
      List,
      ListWrapper,
      Promise,
      PromiseWrapper,
      DOM,
      CompileStep,
      CompileElement,
      CompileControl,
      ViewDefinition,
      ShadowDomStrategy,
      ShadowDomCompileStep;
  return {
    setters: [function($__m) {
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
      assertionsEnabled = $__m.assertionsEnabled;
    }, function($__m) {
      MapWrapper = $__m.MapWrapper;
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      Promise = $__m.Promise;
      PromiseWrapper = $__m.PromiseWrapper;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      CompileStep = $__m.CompileStep;
    }, function($__m) {
      CompileElement = $__m.CompileElement;
    }, function($__m) {
      CompileControl = $__m.CompileControl;
    }, function($__m) {
      ViewDefinition = $__m.ViewDefinition;
    }, function($__m) {
      ShadowDomStrategy = $__m.ShadowDomStrategy;
    }],
    execute: function() {
      ShadowDomCompileStep = (function($__super) {
        function ShadowDomCompileStep(shadowDomStrategy, template, subTaskPromises) {
          $traceurRuntime.superConstructor(ShadowDomCompileStep).call(this);
          this._shadowDomStrategy = shadowDomStrategy;
          this._template = template;
          this._subTaskPromises = subTaskPromises;
        }
        return ($traceurRuntime.createClass)(ShadowDomCompileStep, {
          process: function(parent, current, control) {
            var tagName = DOM.tagName(current.element).toUpperCase();
            if (tagName == 'STYLE') {
              this._processStyleElement(current, control);
            } else if (tagName == 'CONTENT') {
              this._processContentElement(current);
            } else {
              var componentId = current.isBound() ? current.inheritedElementBinder.componentId : null;
              this._shadowDomStrategy.processElement(this._template.componentId, componentId, current.element);
            }
          },
          _processStyleElement: function(current, control) {
            var stylePromise = this._shadowDomStrategy.processStyleElement(this._template.componentId, this._template.absUrl, current.element);
            if (isPresent(stylePromise) && PromiseWrapper.isPromise(stylePromise)) {
              ListWrapper.push(this._subTaskPromises, stylePromise);
            }
            control.ignoreCurrentElement();
          },
          _processContentElement: function(current) {
            if (this._shadowDomStrategy.hasNativeContentElement()) {
              return ;
            }
            var attrs = current.attrs();
            var selector = MapWrapper.get(attrs, 'select');
            selector = isPresent(selector) ? selector : '';
            var contentStart = DOM.createScriptTag('type', 'ng/contentStart');
            if (assertionsEnabled()) {
              DOM.setAttribute(contentStart, 'select', selector);
            }
            var contentEnd = DOM.createScriptTag('type', 'ng/contentEnd');
            DOM.insertBefore(current.element, contentStart);
            DOM.insertBefore(current.element, contentEnd);
            DOM.remove(current.element);
            current.element = contentStart;
            current.bindElement().setContentTagSelector(selector);
          }
        }, {}, $__super);
      }(CompileStep));
      $__export("ShadowDomCompileStep", ShadowDomCompileStep);
      Object.defineProperty(ShadowDomCompileStep, "parameters", {get: function() {
          return [[ShadowDomStrategy], [ViewDefinition], [assert.genericType(List, Promise)]];
        }});
      Object.defineProperty(ShadowDomCompileStep.prototype.process, "parameters", {get: function() {
          return [[CompileElement], [CompileElement], [CompileControl]];
        }});
      Object.defineProperty(ShadowDomCompileStep.prototype._processStyleElement, "parameters", {get: function() {
          return [[CompileElement], [CompileControl]];
        }});
      Object.defineProperty(ShadowDomCompileStep.prototype._processContentElement, "parameters", {get: function() {
          return [[CompileElement]];
        }});
    }
  };
});

System.register("angular2/src/render/dom/shadow_dom/shadow_dom_strategy", ["angular2/src/facade/lang", "angular2/src/facade/async", "../view/view", "./light_dom"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/render/dom/shadow_dom/shadow_dom_strategy";
  var isBlank,
      isPresent,
      Promise,
      viewModule,
      LightDom,
      ShadowDomStrategy;
  return {
    setters: [function($__m) {
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
    }, function($__m) {
      Promise = $__m.Promise;
    }, function($__m) {
      viewModule = $__m;
    }, function($__m) {
      LightDom = $__m.LightDom;
    }],
    execute: function() {
      ShadowDomStrategy = (function() {
        function ShadowDomStrategy() {}
        return ($traceurRuntime.createClass)(ShadowDomStrategy, {
          hasNativeContentElement: function() {
            return true;
          },
          attachTemplate: function(el, view) {},
          constructLightDom: function(lightDomView, shadowDomView, el) {
            return null;
          },
          processStyleElement: function(hostComponentId, templateUrl, styleElement) {
            return null;
          },
          processElement: function(hostComponentId, elementComponentId, element) {}
        }, {});
      }());
      $__export("ShadowDomStrategy", ShadowDomStrategy);
      Object.defineProperty(ShadowDomStrategy.prototype.attachTemplate, "parameters", {get: function() {
          return [[], [viewModule.RenderView]];
        }});
      Object.defineProperty(ShadowDomStrategy.prototype.constructLightDom, "parameters", {get: function() {
          return [[viewModule.RenderView], [viewModule.RenderView], []];
        }});
      Object.defineProperty(ShadowDomStrategy.prototype.processStyleElement, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string], []];
        }});
      Object.defineProperty(ShadowDomStrategy.prototype.processElement, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string], []];
        }});
    }
  };
});

System.register("angular2/src/render/dom/shadow_dom/style_inliner", ["angular2/di", "angular2/src/services/xhr", "angular2/src/facade/collection", "angular2/src/services/url_resolver", "./style_url_resolver", "angular2/src/facade/lang", "angular2/src/facade/async"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/render/dom/shadow_dom/style_inliner";
  var Injectable,
      XHR,
      ListWrapper,
      UrlResolver,
      StyleUrlResolver,
      isBlank,
      isPresent,
      RegExp,
      RegExpWrapper,
      StringWrapper,
      normalizeBlank,
      Promise,
      PromiseWrapper,
      StyleInliner,
      _importRe,
      _urlRe,
      _mediaQueryRe;
  function _extractUrl(importRule) {
    var match = RegExpWrapper.firstMatch(_urlRe, importRule);
    if (isBlank(match))
      return null;
    return isPresent(match[1]) ? match[1] : match[2];
  }
  function _extractMediaQuery(importRule) {
    var match = RegExpWrapper.firstMatch(_mediaQueryRe, importRule);
    if (isBlank(match))
      return null;
    var mediaQuery = match[1].trim();
    return (mediaQuery.length > 0) ? mediaQuery : null;
  }
  function _wrapInMediaRule(css, query) {
    return (isBlank(query)) ? css : ("@media " + query + " {\n" + css + "\n}");
  }
  return {
    setters: [function($__m) {
      Injectable = $__m.Injectable;
    }, function($__m) {
      XHR = $__m.XHR;
    }, function($__m) {
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      UrlResolver = $__m.UrlResolver;
    }, function($__m) {
      StyleUrlResolver = $__m.StyleUrlResolver;
    }, function($__m) {
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
      RegExp = $__m.RegExp;
      RegExpWrapper = $__m.RegExpWrapper;
      StringWrapper = $__m.StringWrapper;
      normalizeBlank = $__m.normalizeBlank;
    }, function($__m) {
      Promise = $__m.Promise;
      PromiseWrapper = $__m.PromiseWrapper;
    }],
    execute: function() {
      StyleInliner = (function() {
        function StyleInliner(xhr, styleUrlResolver, urlResolver) {
          this._xhr = xhr;
          this._urlResolver = urlResolver;
          this._styleUrlResolver = styleUrlResolver;
        }
        return ($traceurRuntime.createClass)(StyleInliner, {
          inlineImports: function(cssText, baseUrl) {
            return this._inlineImports(cssText, baseUrl, []);
          },
          _inlineImports: function(cssText, baseUrl, inlinedUrls) {
            var $__0 = this;
            var partIndex = 0;
            var parts = StringWrapper.split(cssText, _importRe);
            if (parts.length === 1) {
              return cssText;
            }
            var promises = [];
            while (partIndex < parts.length - 1) {
              var prefix = parts[partIndex];
              var rule = parts[partIndex + 1];
              var url = _extractUrl(rule);
              if (isPresent(url)) {
                url = this._urlResolver.resolve(baseUrl, url);
              }
              var mediaQuery = _extractMediaQuery(rule);
              var promise = void 0;
              if (isBlank(url)) {
                promise = PromiseWrapper.resolve(("/* Invalid import rule: \"@import " + rule + ";\" */"));
              } else if (ListWrapper.contains(inlinedUrls, url)) {
                promise = PromiseWrapper.resolve(prefix);
              } else {
                ListWrapper.push(inlinedUrls, url);
                promise = PromiseWrapper.then(this._xhr.get(url), (function(css) {
                  css = $__0._inlineImports(css, url, inlinedUrls);
                  if (PromiseWrapper.isPromise(css)) {
                    return css.then((function(css) {
                      return prefix + $__0._transformImportedCss(css, mediaQuery, url) + '\n';
                    }));
                  } else {
                    return prefix + $__0._transformImportedCss(css, mediaQuery, url) + '\n';
                  }
                }), (function(error) {
                  return ("/* failed to import " + url + " */\n");
                }));
              }
              ListWrapper.push(promises, promise);
              partIndex += 2;
            }
            return PromiseWrapper.all(promises).then(function(cssParts) {
              var cssText = cssParts.join('');
              if (partIndex < parts.length) {
                cssText += parts[partIndex];
              }
              return cssText;
            });
          },
          _transformImportedCss: function(css, mediaQuery, url) {
            css = this._styleUrlResolver.resolveUrls(css, url);
            return _wrapInMediaRule(css, mediaQuery);
          }
        }, {});
      }());
      $__export("StyleInliner", StyleInliner);
      Object.defineProperty(StyleInliner, "annotations", {get: function() {
          return [new Injectable()];
        }});
      Object.defineProperty(StyleInliner, "parameters", {get: function() {
          return [[XHR], [StyleUrlResolver], [UrlResolver]];
        }});
      Object.defineProperty(StyleInliner.prototype.inlineImports, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(StyleInliner.prototype._inlineImports, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string], [assert.genericType(List, assert.type.string)]];
        }});
      Object.defineProperty(StyleInliner.prototype._transformImportedCss, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(_extractUrl, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(_extractMediaQuery, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(_wrapInMediaRule, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
      _importRe = RegExpWrapper.create('@import\\s+([^;]+);');
      _urlRe = RegExpWrapper.create('url\\(\\s*?[\'"]?([^\'")]+)[\'"]?|' + '[\'"]([^\'")]+)[\'"]');
      _mediaQueryRe = RegExpWrapper.create('[\'"][^\'"]+[\'"]\\s*\\)?\\s*(.*)');
    }
  };
});

System.register("angular2/src/render/dom/shadow_dom/style_url_resolver", ["angular2/di", "angular2/src/facade/lang", "angular2/src/services/url_resolver"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/render/dom/shadow_dom/style_url_resolver";
  var Injectable,
      RegExp,
      RegExpWrapper,
      StringWrapper,
      UrlResolver,
      StyleUrlResolver,
      _cssUrlRe,
      _cssImportRe,
      _quoteRe;
  return {
    setters: [function($__m) {
      Injectable = $__m.Injectable;
    }, function($__m) {
      RegExp = $__m.RegExp;
      RegExpWrapper = $__m.RegExpWrapper;
      StringWrapper = $__m.StringWrapper;
    }, function($__m) {
      UrlResolver = $__m.UrlResolver;
    }],
    execute: function() {
      StyleUrlResolver = (function() {
        function StyleUrlResolver(resolver) {
          this._resolver = resolver;
        }
        return ($traceurRuntime.createClass)(StyleUrlResolver, {
          resolveUrls: function(cssText, baseUrl) {
            cssText = this._replaceUrls(cssText, _cssUrlRe, baseUrl);
            cssText = this._replaceUrls(cssText, _cssImportRe, baseUrl);
            return cssText;
          },
          _replaceUrls: function(cssText, re, baseUrl) {
            var $__0 = this;
            return StringWrapper.replaceAllMapped(cssText, re, (function(m) {
              var pre = m[1];
              var url = StringWrapper.replaceAll(m[2], _quoteRe, '');
              var post = m[3];
              var resolvedUrl = $__0._resolver.resolve(baseUrl, url);
              return pre + "'" + resolvedUrl + "'" + post;
            }));
          }
        }, {});
      }());
      $__export("StyleUrlResolver", StyleUrlResolver);
      Object.defineProperty(StyleUrlResolver, "annotations", {get: function() {
          return [new Injectable()];
        }});
      Object.defineProperty(StyleUrlResolver, "parameters", {get: function() {
          return [[UrlResolver]];
        }});
      Object.defineProperty(StyleUrlResolver.prototype.resolveUrls, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(StyleUrlResolver.prototype._replaceUrls, "parameters", {get: function() {
          return [[assert.type.string], [RegExp], [assert.type.string]];
        }});
      _cssUrlRe = RegExpWrapper.create('(url\\()([^)]*)(\\))');
      _cssImportRe = RegExpWrapper.create('(@import[\\s]+(?!url\\())[\'"]([^\'"]*)[\'"](.*;)');
      _quoteRe = RegExpWrapper.create('[\'"]');
    }
  };
});

System.register("angular2/src/render/dom/shadow_dom/util", ["angular2/src/facade/lang", "angular2/src/facade/collection", "angular2/src/dom/dom_adapter", "./shadow_css"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/render/dom/shadow_dom/util";
  var isBlank,
      isPresent,
      int,
      MapWrapper,
      Map,
      DOM,
      ShadowCss,
      _componentUIDs,
      _nextComponentUID,
      _sharedStyleTexts,
      _lastInsertedStyleEl;
  function moveViewNodesIntoParent(parent, view) {
    for (var i = 0; i < view.rootNodes.length; ++i) {
      DOM.appendChild(parent, view.rootNodes[i]);
    }
  }
  function getComponentId(componentStringId) {
    var id = MapWrapper.get(_componentUIDs, componentStringId);
    if (isBlank(id)) {
      id = _nextComponentUID++;
      MapWrapper.set(_componentUIDs, componentStringId, id);
    }
    return id;
  }
  function insertSharedStyleText(cssText, styleHost, styleEl) {
    if (!MapWrapper.contains(_sharedStyleTexts, cssText)) {
      MapWrapper.set(_sharedStyleTexts, cssText, true);
      insertStyleElement(styleHost, styleEl);
    }
  }
  function insertStyleElement(host, styleEl) {
    if (isBlank(_lastInsertedStyleEl)) {
      var firstChild = DOM.firstChild(host);
      if (isPresent(firstChild)) {
        DOM.insertBefore(firstChild, styleEl);
      } else {
        DOM.appendChild(host, styleEl);
      }
    } else {
      DOM.insertAfter(_lastInsertedStyleEl, styleEl);
    }
    _lastInsertedStyleEl = styleEl;
  }
  function getHostAttribute(id) {
    return ("_nghost-" + id);
  }
  function getContentAttribute(id) {
    return ("_ngcontent-" + id);
  }
  function shimCssForComponent(cssText, componentId) {
    var id = getComponentId(componentId);
    var shadowCss = new ShadowCss();
    return shadowCss.shimCssText(cssText, getContentAttribute(id), getHostAttribute(id));
  }
  function resetShadowDomCache() {
    MapWrapper.clear(_componentUIDs);
    _nextComponentUID = 0;
    MapWrapper.clear(_sharedStyleTexts);
    _lastInsertedStyleEl = null;
  }
  $__export("moveViewNodesIntoParent", moveViewNodesIntoParent);
  $__export("getComponentId", getComponentId);
  $__export("insertSharedStyleText", insertSharedStyleText);
  $__export("insertStyleElement", insertStyleElement);
  $__export("getHostAttribute", getHostAttribute);
  $__export("getContentAttribute", getContentAttribute);
  $__export("shimCssForComponent", shimCssForComponent);
  $__export("resetShadowDomCache", resetShadowDomCache);
  return {
    setters: [function($__m) {
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
      int = $__m.int;
    }, function($__m) {
      MapWrapper = $__m.MapWrapper;
      Map = $__m.Map;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      ShadowCss = $__m.ShadowCss;
    }],
    execute: function() {
      _componentUIDs = MapWrapper.create();
      _nextComponentUID = 0;
      _sharedStyleTexts = MapWrapper.create();
      Object.defineProperty(getComponentId, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(getHostAttribute, "parameters", {get: function() {
          return [[int]];
        }});
      Object.defineProperty(getContentAttribute, "parameters", {get: function() {
          return [[int]];
        }});
      Object.defineProperty(shimCssForComponent, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
    }
  };
});

System.register("angular2/src/render/dom/events/event_manager", ["angular2/src/facade/lang", "angular2/src/dom/dom_adapter", "angular2/src/facade/collection", "angular2/src/core/zone/vm_turn_zone"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/render/dom/events/event_manager";
  var isBlank,
      BaseException,
      isPresent,
      StringWrapper,
      DOM,
      List,
      ListWrapper,
      MapWrapper,
      VmTurnZone,
      BUBBLE_SYMBOL,
      EventManager,
      EventManagerPlugin,
      DomEventsPlugin;
  return {
    setters: [function($__m) {
      isBlank = $__m.isBlank;
      BaseException = $__m.BaseException;
      isPresent = $__m.isPresent;
      StringWrapper = $__m.StringWrapper;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
      MapWrapper = $__m.MapWrapper;
    }, function($__m) {
      VmTurnZone = $__m.VmTurnZone;
    }],
    execute: function() {
      BUBBLE_SYMBOL = '^';
      EventManager = (function() {
        function EventManager(plugins, zone) {
          this._zone = zone;
          this._plugins = plugins;
          for (var i = 0; i < plugins.length; i++) {
            plugins[i].manager = this;
          }
        }
        return ($traceurRuntime.createClass)(EventManager, {
          addEventListener: function(element, eventName, handler) {
            var withoutBubbleSymbol = this._removeBubbleSymbol(eventName);
            var plugin = this._findPluginFor(withoutBubbleSymbol);
            plugin.addEventListener(element, withoutBubbleSymbol, handler, withoutBubbleSymbol != eventName);
          },
          addGlobalEventListener: function(target, eventName, handler) {
            var withoutBubbleSymbol = this._removeBubbleSymbol(eventName);
            var plugin = this._findPluginFor(withoutBubbleSymbol);
            return plugin.addGlobalEventListener(target, withoutBubbleSymbol, handler, withoutBubbleSymbol != eventName);
          },
          getZone: function() {
            return this._zone;
          },
          _findPluginFor: function(eventName) {
            var plugins = this._plugins;
            for (var i = 0; i < plugins.length; i++) {
              var plugin = plugins[i];
              if (plugin.supports(eventName)) {
                return plugin;
              }
            }
            throw new BaseException(("No event manager plugin found for event " + eventName));
          },
          _removeBubbleSymbol: function(eventName) {
            return eventName[0] == BUBBLE_SYMBOL ? StringWrapper.substring(eventName, 1) : eventName;
          }
        }, {});
      }());
      $__export("EventManager", EventManager);
      Object.defineProperty(EventManager, "parameters", {get: function() {
          return [[assert.genericType(List, EventManagerPlugin)], [VmTurnZone]];
        }});
      Object.defineProperty(EventManager.prototype.addEventListener, "parameters", {get: function() {
          return [[], [assert.type.string], [Function]];
        }});
      Object.defineProperty(EventManager.prototype.addGlobalEventListener, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string], [Function]];
        }});
      Object.defineProperty(EventManager.prototype._findPluginFor, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(EventManager.prototype._removeBubbleSymbol, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      EventManagerPlugin = (function() {
        function EventManagerPlugin() {}
        return ($traceurRuntime.createClass)(EventManagerPlugin, {
          supports: function(eventName) {
            return false;
          },
          addEventListener: function(element, eventName, handler, shouldSupportBubble) {
            throw "not implemented";
          },
          addGlobalEventListener: function(element, eventName, handler, shouldSupportBubble) {
            throw "not implemented";
          }
        }, {});
      }());
      $__export("EventManagerPlugin", EventManagerPlugin);
      Object.defineProperty(EventManagerPlugin.prototype.supports, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(EventManagerPlugin.prototype.addEventListener, "parameters", {get: function() {
          return [[], [assert.type.string], [Function], [assert.type.boolean]];
        }});
      Object.defineProperty(EventManagerPlugin.prototype.addGlobalEventListener, "parameters", {get: function() {
          return [[], [assert.type.string], [Function], [assert.type.boolean]];
        }});
      DomEventsPlugin = (function($__super) {
        function DomEventsPlugin() {
          $traceurRuntime.superConstructor(DomEventsPlugin).apply(this, arguments);
        }
        return ($traceurRuntime.createClass)(DomEventsPlugin, {
          supports: function(eventName) {
            return true;
          },
          addEventListener: function(element, eventName, handler, shouldSupportBubble) {
            var outsideHandler = this._getOutsideHandler(shouldSupportBubble, element, handler, this.manager._zone);
            this.manager._zone.runOutsideAngular((function() {
              DOM.on(element, eventName, outsideHandler);
            }));
          },
          addGlobalEventListener: function(target, eventName, handler, shouldSupportBubble) {
            var element = DOM.getGlobalEventTarget(target);
            var outsideHandler = this._getOutsideHandler(shouldSupportBubble, element, handler, this.manager._zone);
            return this.manager._zone.runOutsideAngular((function() {
              return DOM.onAndCancel(element, eventName, outsideHandler);
            }));
          },
          _getOutsideHandler: function(shouldSupportBubble, element, handler, zone) {
            return shouldSupportBubble ? DomEventsPlugin.bubbleCallback(element, handler, zone) : DomEventsPlugin.sameElementCallback(element, handler, zone);
          }
        }, {
          sameElementCallback: function(element, handler, zone) {
            return (function(event) {
              if (event.target === element) {
                zone.run((function() {
                  return handler(event);
                }));
              }
            });
          },
          bubbleCallback: function(element, handler, zone) {
            return (function(event) {
              return zone.run((function() {
                return handler(event);
              }));
            });
          }
        }, $__super);
      }(EventManagerPlugin));
      $__export("DomEventsPlugin", DomEventsPlugin);
      Object.defineProperty(DomEventsPlugin.prototype.supports, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(DomEventsPlugin.prototype.addEventListener, "parameters", {get: function() {
          return [[], [assert.type.string], [Function], [assert.type.boolean]];
        }});
      Object.defineProperty(DomEventsPlugin.prototype.addGlobalEventListener, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string], [Function], [assert.type.boolean]];
        }});
      Object.defineProperty(DomEventsPlugin.prototype._getOutsideHandler, "parameters", {get: function() {
          return [[assert.type.boolean], [], [Function], [VmTurnZone]];
        }});
    }
  };
});

System.register("angular2/src/render/dom/events/hammer_common", ["./event_manager", "angular2/src/facade/collection"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/render/dom/events/hammer_common";
  var EventManagerPlugin,
      StringMapWrapper,
      _eventNames,
      HammerGesturesPluginCommon;
  return {
    setters: [function($__m) {
      EventManagerPlugin = $__m.EventManagerPlugin;
    }, function($__m) {
      StringMapWrapper = $__m.StringMapWrapper;
    }],
    execute: function() {
      _eventNames = {
        'pan': true,
        'panstart': true,
        'panmove': true,
        'panend': true,
        'pancancel': true,
        'panleft': true,
        'panright': true,
        'panup': true,
        'pandown': true,
        'pinch': true,
        'pinchstart': true,
        'pinchmove': true,
        'pinchend': true,
        'pinchcancel': true,
        'pinchin': true,
        'pinchout': true,
        'press': true,
        'pressup': true,
        'rotate': true,
        'rotatestart': true,
        'rotatemove': true,
        'rotateend': true,
        'rotatecancel': true,
        'swipe': true,
        'swipeleft': true,
        'swiperight': true,
        'swipeup': true,
        'swipedown': true,
        'tap': true
      };
      HammerGesturesPluginCommon = (function($__super) {
        function HammerGesturesPluginCommon() {
          $traceurRuntime.superConstructor(HammerGesturesPluginCommon).call(this);
        }
        return ($traceurRuntime.createClass)(HammerGesturesPluginCommon, {supports: function(eventName) {
            eventName = eventName.toLowerCase();
            return StringMapWrapper.contains(_eventNames, eventName);
          }}, {}, $__super);
      }(EventManagerPlugin));
      $__export("HammerGesturesPluginCommon", HammerGesturesPluginCommon);
      Object.defineProperty(HammerGesturesPluginCommon.prototype.supports, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
    }
  };
});

System.register("angular2/src/render/dom/events/hammer_gestures", ["./hammer_common", "angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/render/dom/events/hammer_gestures";
  var HammerGesturesPluginCommon,
      isPresent,
      BaseException,
      HammerGesturesPlugin;
  return {
    setters: [function($__m) {
      HammerGesturesPluginCommon = $__m.HammerGesturesPluginCommon;
    }, function($__m) {
      isPresent = $__m.isPresent;
      BaseException = $__m.BaseException;
    }],
    execute: function() {
      HammerGesturesPlugin = (function($__super) {
        function HammerGesturesPlugin() {
          $traceurRuntime.superConstructor(HammerGesturesPlugin).call(this);
        }
        return ($traceurRuntime.createClass)(HammerGesturesPlugin, {
          supports: function(eventName) {
            if (!$traceurRuntime.superGet(this, HammerGesturesPlugin.prototype, "supports").call(this, eventName))
              return false;
            if (!isPresent(window.Hammer)) {
              throw new BaseException(("Hammer.js is not loaded, can not bind " + eventName + " event"));
            }
            return true;
          },
          addEventListener: function(element, eventName, handler, shouldSupportBubble) {
            if (shouldSupportBubble)
              throw new BaseException('Hammer.js plugin does not support bubbling gestures.');
            var zone = this.manager.getZone();
            eventName = eventName.toLowerCase();
            zone.runOutsideAngular(function() {
              var mc = new Hammer(element);
              mc.get('pinch').set({enable: true});
              mc.get('rotate').set({enable: true});
              mc.on(eventName, function(eventObj) {
                zone.run(function() {
                  handler(eventObj);
                });
              });
            });
          }
        }, {}, $__super);
      }(HammerGesturesPluginCommon));
      $__export("HammerGesturesPlugin", HammerGesturesPlugin);
      Object.defineProperty(HammerGesturesPlugin.prototype.supports, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(HammerGesturesPlugin.prototype.addEventListener, "parameters", {get: function() {
          return [[], [assert.type.string], [Function], [assert.type.boolean]];
        }});
    }
  };
});

System.register("angular2/src/render/dom/events/key_events", ["angular2/src/dom/dom_adapter", "angular2/src/facade/lang", "angular2/src/facade/collection", "./event_manager"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/render/dom/events/key_events";
  var DOM,
      isPresent,
      isBlank,
      StringWrapper,
      RegExpWrapper,
      BaseException,
      NumberWrapper,
      StringMapWrapper,
      ListWrapper,
      EventManagerPlugin,
      modifierKeys,
      modifierKeyGetters,
      KeyEventsPlugin;
  return {
    setters: [function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
      StringWrapper = $__m.StringWrapper;
      RegExpWrapper = $__m.RegExpWrapper;
      BaseException = $__m.BaseException;
      NumberWrapper = $__m.NumberWrapper;
    }, function($__m) {
      StringMapWrapper = $__m.StringMapWrapper;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      EventManagerPlugin = $__m.EventManagerPlugin;
    }],
    execute: function() {
      modifierKeys = ['alt', 'control', 'meta', 'shift'];
      modifierKeyGetters = {
        'alt': (function(event) {
          return event.altKey;
        }),
        'control': (function(event) {
          return event.ctrlKey;
        }),
        'meta': (function(event) {
          return event.metaKey;
        }),
        'shift': (function(event) {
          return event.shiftKey;
        })
      };
      KeyEventsPlugin = (function($__super) {
        function KeyEventsPlugin() {
          $traceurRuntime.superConstructor(KeyEventsPlugin).call(this);
        }
        return ($traceurRuntime.createClass)(KeyEventsPlugin, {
          supports: function(eventName) {
            return isPresent(KeyEventsPlugin.parseEventName(eventName));
          },
          addEventListener: function(element, eventName, handler, shouldSupportBubble) {
            var parsedEvent = KeyEventsPlugin.parseEventName(eventName);
            var outsideHandler = KeyEventsPlugin.eventCallback(element, shouldSupportBubble, StringMapWrapper.get(parsedEvent, 'fullKey'), handler, this.manager.getZone());
            this.manager.getZone().runOutsideAngular((function() {
              DOM.on(element, StringMapWrapper.get(parsedEvent, 'domEventName'), outsideHandler);
            }));
          }
        }, {
          parseEventName: function(eventName) {
            eventName = eventName.toLowerCase();
            var parts = eventName.split('.');
            var domEventName = ListWrapper.removeAt(parts, 0);
            if ((parts.length === 0) || !(StringWrapper.equals(domEventName, 'keydown') || StringWrapper.equals(domEventName, 'keyup'))) {
              return null;
            }
            var key = ListWrapper.removeLast(parts);
            var fullKey = '';
            ListWrapper.forEach(modifierKeys, (function(modifierName) {
              if (ListWrapper.contains(parts, modifierName)) {
                ListWrapper.remove(parts, modifierName);
                fullKey += modifierName + '.';
              }
            }));
            fullKey += key;
            if (parts.length != 0 || key.length === 0) {
              return null;
            }
            return {
              'domEventName': domEventName,
              'fullKey': fullKey
            };
          },
          getEventFullKey: function(event) {
            var fullKey = '';
            var key = DOM.getEventKey(event);
            key = key.toLowerCase();
            if (StringWrapper.equals(key, ' ')) {
              key = 'space';
            } else if (StringWrapper.equals(key, '.')) {
              key = 'dot';
            }
            ListWrapper.forEach(modifierKeys, (function(modifierName) {
              if (modifierName != key) {
                var modifierGetter = StringMapWrapper.get(modifierKeyGetters, modifierName);
                if (modifierGetter(event)) {
                  fullKey += modifierName + '.';
                }
              }
            }));
            fullKey += key;
            return fullKey;
          },
          eventCallback: function(element, shouldSupportBubble, fullKey, handler, zone) {
            return (function(event) {
              var correctElement = shouldSupportBubble || event.target === element;
              if (correctElement && KeyEventsPlugin.getEventFullKey(event) === fullKey) {
                zone.run((function() {
                  return handler(event);
                }));
              }
            });
          }
        }, $__super);
      }(EventManagerPlugin));
      $__export("KeyEventsPlugin", KeyEventsPlugin);
      Object.defineProperty(KeyEventsPlugin.prototype.supports, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(KeyEventsPlugin.prototype.addEventListener, "parameters", {get: function() {
          return [[], [assert.type.string], [Function], [assert.type.boolean]];
        }});
      Object.defineProperty(KeyEventsPlugin.parseEventName, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
    }
  };
});

System.register("angular2/src/render/dom/view/element_binder", ["angular2/src/facade/lang", "angular2/change_detection", "angular2/src/reflection/types", "angular2/src/facade/collection", "./proto_view"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/render/dom/view/element_binder";
  var isBlank,
      isPresent,
      AST,
      SetterFn,
      List,
      ListWrapper,
      protoViewModule,
      ElementBinder,
      Event;
  return {
    setters: [function($__m) {
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
    }, function($__m) {
      AST = $__m.AST;
    }, function($__m) {
      SetterFn = $__m.SetterFn;
    }, function($__m) {
      List = $__m.List;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      protoViewModule = $__m;
    }],
    execute: function() {
      ElementBinder = (function() {
        function ElementBinder() {
          var $__1 = arguments[0] !== (void 0) ? arguments[0] : {},
              textNodeIndices = $__1.textNodeIndices,
              contentTagSelector = $__1.contentTagSelector,
              nestedProtoView = $__1.nestedProtoView,
              componentId = $__1.componentId,
              eventLocals = $__1.eventLocals,
              localEvents = $__1.localEvents,
              globalEvents = $__1.globalEvents,
              parentIndex = $__1.parentIndex,
              distanceToParent = $__1.distanceToParent,
              propertySetters = $__1.propertySetters;
          this.textNodeIndices = textNodeIndices;
          this.contentTagSelector = contentTagSelector;
          this.nestedProtoView = nestedProtoView;
          this.componentId = componentId;
          this.eventLocals = eventLocals;
          this.localEvents = localEvents;
          this.globalEvents = globalEvents;
          this.parentIndex = parentIndex;
          this.distanceToParent = distanceToParent;
          this.propertySetters = propertySetters;
        }
        return ($traceurRuntime.createClass)(ElementBinder, {
          hasStaticComponent: function() {
            return isPresent(this.componentId) && isPresent(this.nestedProtoView);
          },
          hasDynamicComponent: function() {
            return isPresent(this.componentId) && isBlank(this.nestedProtoView);
          }
        }, {});
      }());
      $__export("ElementBinder", ElementBinder);
      Event = (function() {
        function Event(name, target, fullName) {
          this.name = name;
          this.target = target;
          this.fullName = fullName;
        }
        return ($traceurRuntime.createClass)(Event, {}, {});
      }());
      $__export("Event", Event);
      Object.defineProperty(Event, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string], [assert.type.string]];
        }});
    }
  };
});

System.register("angular2/src/render/dom/view/property_setter_factory", ["angular2/src/facade/lang", "angular2/src/facade/collection", "angular2/src/dom/dom_adapter", "../util", "angular2/src/reflection/reflection"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/render/dom/view/property_setter_factory";
  var StringWrapper,
      RegExpWrapper,
      BaseException,
      isPresent,
      isBlank,
      isString,
      stringify,
      ListWrapper,
      StringMapWrapper,
      DOM,
      camelCaseToDashCase,
      dashCaseToCamelCase,
      reflector,
      STYLE_SEPARATOR,
      propertySettersCache,
      innerHTMLSetterCache,
      ATTRIBUTE_PREFIX,
      attributeSettersCache,
      CLASS_PREFIX,
      classSettersCache,
      STYLE_PREFIX,
      styleSettersCache;
  function setterFactory(property) {
    var setterFn,
        styleParts,
        styleSuffix;
    if (StringWrapper.startsWith(property, ATTRIBUTE_PREFIX)) {
      setterFn = attributeSetterFactory(StringWrapper.substring(property, ATTRIBUTE_PREFIX.length));
    } else if (StringWrapper.startsWith(property, CLASS_PREFIX)) {
      setterFn = classSetterFactory(StringWrapper.substring(property, CLASS_PREFIX.length));
    } else if (StringWrapper.startsWith(property, STYLE_PREFIX)) {
      styleParts = property.split(STYLE_SEPARATOR);
      styleSuffix = styleParts.length > 2 ? ListWrapper.get(styleParts, 2) : '';
      setterFn = styleSetterFactory(ListWrapper.get(styleParts, 1), styleSuffix);
    } else if (StringWrapper.equals(property, 'innerHtml')) {
      if (isBlank(innerHTMLSetterCache)) {
        innerHTMLSetterCache = (function(el, value) {
          return DOM.setInnerHTML(el, value);
        });
      }
      setterFn = innerHTMLSetterCache;
    } else {
      property = resolvePropertyName(property);
      setterFn = StringMapWrapper.get(propertySettersCache, property);
      if (isBlank(setterFn)) {
        var propertySetterFn = reflector.setter(property);
        setterFn = function(receiver, value) {
          if (DOM.hasProperty(receiver, property)) {
            return propertySetterFn(receiver, value);
          }
        };
        StringMapWrapper.set(propertySettersCache, property, setterFn);
      }
    }
    return setterFn;
  }
  function _isValidAttributeValue(attrName, value) {
    if (attrName == "role") {
      return isString(value);
    } else {
      return isPresent(value);
    }
  }
  function attributeSetterFactory(attrName) {
    var setterFn = StringMapWrapper.get(attributeSettersCache, attrName);
    var dashCasedAttributeName;
    if (isBlank(setterFn)) {
      dashCasedAttributeName = camelCaseToDashCase(attrName);
      setterFn = function(element, value) {
        if (_isValidAttributeValue(dashCasedAttributeName, value)) {
          DOM.setAttribute(element, dashCasedAttributeName, stringify(value));
        } else {
          if (isPresent(value)) {
            throw new BaseException("Invalid " + dashCasedAttributeName + " attribute, only string values are allowed, got '" + stringify(value) + "'");
          }
          DOM.removeAttribute(element, dashCasedAttributeName);
        }
      };
      StringMapWrapper.set(attributeSettersCache, attrName, setterFn);
    }
    return setterFn;
  }
  function classSetterFactory(className) {
    var setterFn = StringMapWrapper.get(classSettersCache, className);
    var dashCasedClassName;
    if (isBlank(setterFn)) {
      dashCasedClassName = camelCaseToDashCase(className);
      setterFn = function(element, value) {
        if (value) {
          DOM.addClass(element, dashCasedClassName);
        } else {
          DOM.removeClass(element, dashCasedClassName);
        }
      };
      StringMapWrapper.set(classSettersCache, className, setterFn);
    }
    return setterFn;
  }
  function styleSetterFactory(styleName, styleSuffix) {
    var cacheKey = styleName + styleSuffix;
    var setterFn = StringMapWrapper.get(styleSettersCache, cacheKey);
    var dashCasedStyleName;
    if (isBlank(setterFn)) {
      dashCasedStyleName = camelCaseToDashCase(styleName);
      setterFn = function(element, value) {
        var valAsStr;
        if (isPresent(value)) {
          valAsStr = stringify(value);
          DOM.setStyle(element, dashCasedStyleName, valAsStr + styleSuffix);
        } else {
          DOM.removeStyle(element, dashCasedStyleName);
        }
      };
      StringMapWrapper.set(styleSettersCache, cacheKey, setterFn);
    }
    return setterFn;
  }
  function resolvePropertyName(attrName) {
    var mappedPropName = StringMapWrapper.get(DOM.attrToPropMap, attrName);
    return isPresent(mappedPropName) ? mappedPropName : attrName;
  }
  $__export("setterFactory", setterFactory);
  return {
    setters: [function($__m) {
      StringWrapper = $__m.StringWrapper;
      RegExpWrapper = $__m.RegExpWrapper;
      BaseException = $__m.BaseException;
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
      isString = $__m.isString;
      stringify = $__m.stringify;
    }, function($__m) {
      ListWrapper = $__m.ListWrapper;
      StringMapWrapper = $__m.StringMapWrapper;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      camelCaseToDashCase = $__m.camelCaseToDashCase;
      dashCaseToCamelCase = $__m.dashCaseToCamelCase;
    }, function($__m) {
      reflector = $__m.reflector;
    }],
    execute: function() {
      STYLE_SEPARATOR = '.';
      propertySettersCache = StringMapWrapper.create();
      Object.defineProperty(setterFactory, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      ATTRIBUTE_PREFIX = 'attr.';
      attributeSettersCache = StringMapWrapper.create();
      Object.defineProperty(_isValidAttributeValue, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.any]];
        }});
      Object.defineProperty(attributeSetterFactory, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      CLASS_PREFIX = 'class.';
      classSettersCache = StringMapWrapper.create();
      Object.defineProperty(classSetterFactory, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      STYLE_PREFIX = 'style.';
      styleSettersCache = StringMapWrapper.create();
      Object.defineProperty(styleSetterFactory, "parameters", {get: function() {
          return [[assert.type.string], [assert.type.string]];
        }});
      Object.defineProperty(resolvePropertyName, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
    }
  };
});

System.register("angular2/src/render/dom/view/proto_view", ["angular2/src/facade/lang", "angular2/src/dom/dom_adapter", "angular2/src/facade/collection", "./element_binder", "../util"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/render/dom/view/proto_view";
  var isPresent,
      DOM,
      List,
      Map,
      ListWrapper,
      MapWrapper,
      ElementBinder,
      NG_BINDING_CLASS,
      RenderProtoView;
  return {
    setters: [function($__m) {
      isPresent = $__m.isPresent;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      List = $__m.List;
      Map = $__m.Map;
      ListWrapper = $__m.ListWrapper;
      MapWrapper = $__m.MapWrapper;
    }, function($__m) {
      ElementBinder = $__m.ElementBinder;
    }, function($__m) {
      NG_BINDING_CLASS = $__m.NG_BINDING_CLASS;
    }],
    execute: function() {
      RenderProtoView = (function() {
        function RenderProtoView($__1) {
          var $__2 = $__1,
              elementBinders = $__2.elementBinders,
              element = $__2.element,
              imperativeRendererId = $__2.imperativeRendererId;
          this.element = element;
          this.elementBinders = elementBinders;
          this.imperativeRendererId = imperativeRendererId;
          if (isPresent(imperativeRendererId)) {
            this.rootBindingOffset = 0;
            this.isTemplateElement = false;
          } else {
            this.isTemplateElement = DOM.isTemplateElement(this.element);
            this.rootBindingOffset = (isPresent(this.element) && DOM.hasClass(this.element, NG_BINDING_CLASS)) ? 1 : 0;
          }
        }
        return ($traceurRuntime.createClass)(RenderProtoView, {mergeChildComponentProtoViews: function(componentProtoViews) {
            var componentProtoViewIndex = 0;
            for (var i = 0; i < this.elementBinders.length; i++) {
              var eb = this.elementBinders[i];
              if (isPresent(eb.componentId)) {
                eb.nestedProtoView = componentProtoViews[componentProtoViewIndex];
                componentProtoViewIndex++;
              }
            }
          }}, {});
      }());
      $__export("RenderProtoView", RenderProtoView);
      Object.defineProperty(RenderProtoView.prototype.mergeChildComponentProtoViews, "parameters", {get: function() {
          return [[assert.genericType(List, RenderProtoView)]];
        }});
    }
  };
});

System.register("angular2/src/render/dom/view/proto_view_builder", ["angular2/src/facade/lang", "angular2/src/facade/collection", "angular2/src/dom/dom_adapter", "angular2/change_detection", "angular2/src/reflection/types", "./proto_view", "./element_binder", "./property_setter_factory", "../../api", "../direct_dom_renderer", "../util"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/render/dom/view/proto_view_builder";
  var isPresent,
      isBlank,
      BaseException,
      ListWrapper,
      MapWrapper,
      Set,
      SetWrapper,
      List,
      DOM,
      ASTWithSource,
      AST,
      AstTransformer,
      AccessMember,
      LiteralArray,
      ImplicitReceiver,
      SetterFn,
      RenderProtoView,
      ElementBinder,
      Event,
      setterFactory,
      api,
      directDomRenderer,
      NG_BINDING_CLASS,
      EVENT_TARGET_SEPARATOR,
      ProtoViewBuilder,
      ElementBinderBuilder,
      DirectiveBuilder,
      EventBuilder;
  return {
    setters: [function($__m) {
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
      BaseException = $__m.BaseException;
    }, function($__m) {
      ListWrapper = $__m.ListWrapper;
      MapWrapper = $__m.MapWrapper;
      Set = $__m.Set;
      SetWrapper = $__m.SetWrapper;
      List = $__m.List;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      ASTWithSource = $__m.ASTWithSource;
      AST = $__m.AST;
      AstTransformer = $__m.AstTransformer;
      AccessMember = $__m.AccessMember;
      LiteralArray = $__m.LiteralArray;
      ImplicitReceiver = $__m.ImplicitReceiver;
    }, function($__m) {
      SetterFn = $__m.SetterFn;
    }, function($__m) {
      RenderProtoView = $__m.RenderProtoView;
    }, function($__m) {
      ElementBinder = $__m.ElementBinder;
      Event = $__m.Event;
    }, function($__m) {
      setterFactory = $__m.setterFactory;
    }, function($__m) {
      api = $__m;
    }, function($__m) {
      directDomRenderer = $__m;
    }, function($__m) {
      NG_BINDING_CLASS = $__m.NG_BINDING_CLASS;
      EVENT_TARGET_SEPARATOR = $__m.EVENT_TARGET_SEPARATOR;
    }],
    execute: function() {
      ProtoViewBuilder = (function() {
        function ProtoViewBuilder(rootElement) {
          this.rootElement = rootElement;
          this.elements = [];
          this.variableBindings = MapWrapper.create();
          this.imperativeRendererId = null;
        }
        return ($traceurRuntime.createClass)(ProtoViewBuilder, {
          setImperativeRendererId: function(id) {
            this.imperativeRendererId = id;
            return this;
          },
          bindElement: function(element) {
            var description = arguments[1] !== (void 0) ? arguments[1] : null;
            var builder = new ElementBinderBuilder(this.elements.length, element, description);
            ListWrapper.push(this.elements, builder);
            DOM.addClass(element, NG_BINDING_CLASS);
            return builder;
          },
          bindVariable: function(name, value) {
            MapWrapper.set(this.variableBindings, value, name);
          },
          build: function() {
            var renderElementBinders = [];
            var apiElementBinders = [];
            ListWrapper.forEach(this.elements, (function(ebb) {
              var propertySetters = MapWrapper.create();
              var apiDirectiveBinders = ListWrapper.map(ebb.directives, (function(db) {
                ebb.eventBuilder.merge(db.eventBuilder);
                return new api.DirectiveBinder({
                  directiveIndex: db.directiveIndex,
                  propertyBindings: db.propertyBindings,
                  eventBindings: db.eventBindings
                });
              }));
              MapWrapper.forEach(ebb.propertySetters, (function(setter, propertyName) {
                MapWrapper.set(propertySetters, propertyName, setter);
              }));
              var nestedProtoView = isPresent(ebb.nestedProtoView) ? ebb.nestedProtoView.build() : null;
              var parentIndex = isPresent(ebb.parent) ? ebb.parent.index : -1;
              ListWrapper.push(apiElementBinders, new api.ElementBinder({
                index: ebb.index,
                parentIndex: parentIndex,
                distanceToParent: ebb.distanceToParent,
                directives: apiDirectiveBinders,
                nestedProtoView: nestedProtoView,
                propertyBindings: ebb.propertyBindings,
                variableBindings: ebb.variableBindings,
                eventBindings: ebb.eventBindings,
                textBindings: ebb.textBindings,
                readAttributes: ebb.readAttributes
              }));
              ListWrapper.push(renderElementBinders, new ElementBinder({
                textNodeIndices: ebb.textBindingIndices,
                contentTagSelector: ebb.contentTagSelector,
                parentIndex: parentIndex,
                distanceToParent: ebb.distanceToParent,
                nestedProtoView: isPresent(nestedProtoView) ? nestedProtoView.render.delegate : null,
                componentId: ebb.componentId,
                eventLocals: new LiteralArray(ebb.eventBuilder.buildEventLocals()),
                localEvents: ebb.eventBuilder.buildLocalEvents(),
                globalEvents: ebb.eventBuilder.buildGlobalEvents(),
                propertySetters: propertySetters
              }));
            }));
            return new api.ProtoViewDto({
              render: new directDomRenderer.DirectDomProtoViewRef(new RenderProtoView({
                element: this.rootElement,
                elementBinders: renderElementBinders,
                imperativeRendererId: this.imperativeRendererId
              })),
              elementBinders: apiElementBinders,
              variableBindings: this.variableBindings
            });
          }
        }, {});
      }());
      $__export("ProtoViewBuilder", ProtoViewBuilder);
      Object.defineProperty(ProtoViewBuilder.prototype.setImperativeRendererId, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      ElementBinderBuilder = (function() {
        function ElementBinderBuilder(index, element, description) {
          this.element = element;
          this.index = index;
          this.parent = null;
          this.distanceToParent = 0;
          this.directives = [];
          this.nestedProtoView = null;
          this.propertyBindings = MapWrapper.create();
          this.variableBindings = MapWrapper.create();
          this.eventBindings = ListWrapper.create();
          this.eventBuilder = new EventBuilder();
          this.textBindings = [];
          this.textBindingIndices = [];
          this.contentTagSelector = null;
          this.propertySetters = MapWrapper.create();
          this.componentId = null;
          this.readAttributes = MapWrapper.create();
        }
        return ($traceurRuntime.createClass)(ElementBinderBuilder, {
          setParent: function(parent, distanceToParent) {
            this.parent = parent;
            if (isPresent(parent)) {
              this.distanceToParent = distanceToParent;
            }
            return this;
          },
          readAttribute: function(attrName) {
            if (isBlank(MapWrapper.get(this.readAttributes, attrName))) {
              MapWrapper.set(this.readAttributes, attrName, DOM.getAttribute(this.element, attrName));
            }
          },
          bindDirective: function(directiveIndex) {
            var directive = new DirectiveBuilder(directiveIndex);
            ListWrapper.push(this.directives, directive);
            return directive;
          },
          bindNestedProtoView: function(rootElement) {
            if (isPresent(this.nestedProtoView)) {
              throw new BaseException('Only one nested view per element is allowed');
            }
            this.nestedProtoView = new ProtoViewBuilder(rootElement);
            return this.nestedProtoView;
          },
          bindProperty: function(name, expression) {
            MapWrapper.set(this.propertyBindings, name, expression);
            this.bindPropertySetter(name);
          },
          bindPropertySetter: function(name) {
            MapWrapper.set(this.propertySetters, name, setterFactory(name));
          },
          bindVariable: function(name, value) {
            if (isPresent(this.nestedProtoView)) {
              this.nestedProtoView.bindVariable(name, value);
            } else {
              MapWrapper.set(this.variableBindings, value, name);
            }
          },
          bindEvent: function(name, expression) {
            var target = arguments[2] !== (void 0) ? arguments[2] : null;
            ListWrapper.push(this.eventBindings, this.eventBuilder.add(name, expression, target));
          },
          bindText: function(index, expression) {
            ListWrapper.push(this.textBindingIndices, index);
            ListWrapper.push(this.textBindings, expression);
          },
          setContentTagSelector: function(value) {
            this.contentTagSelector = value;
          },
          setComponentId: function(componentId) {
            this.componentId = componentId;
          }
        }, {});
      }());
      $__export("ElementBinderBuilder", ElementBinderBuilder);
      Object.defineProperty(ElementBinderBuilder.prototype.setParent, "parameters", {get: function() {
          return [[ElementBinderBuilder], []];
        }});
      Object.defineProperty(ElementBinderBuilder.prototype.readAttribute, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(ElementBinderBuilder.prototype.bindDirective, "parameters", {get: function() {
          return [[assert.type.number]];
        }});
      Object.defineProperty(ElementBinderBuilder.prototype.setContentTagSelector, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      Object.defineProperty(ElementBinderBuilder.prototype.setComponentId, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
      DirectiveBuilder = (function() {
        function DirectiveBuilder(directiveIndex) {
          this.directiveIndex = directiveIndex;
          this.propertyBindings = MapWrapper.create();
          this.eventBindings = ListWrapper.create();
          this.eventBuilder = new EventBuilder();
        }
        return ($traceurRuntime.createClass)(DirectiveBuilder, {
          bindProperty: function(name, expression) {
            MapWrapper.set(this.propertyBindings, name, expression);
          },
          bindEvent: function(name, expression) {
            var target = arguments[2] !== (void 0) ? arguments[2] : null;
            ListWrapper.push(this.eventBindings, this.eventBuilder.add(name, expression, target));
          }
        }, {});
      }());
      $__export("DirectiveBuilder", DirectiveBuilder);
      EventBuilder = (function($__super) {
        function EventBuilder() {
          $traceurRuntime.superConstructor(EventBuilder).call(this);
          this.locals = [];
          this.localEvents = [];
          this.globalEvents = [];
          this._implicitReceiver = new ImplicitReceiver();
        }
        return ($traceurRuntime.createClass)(EventBuilder, {
          add: function(name, source, target) {
            var adjustedAst = source.ast;
            var fullName = isPresent(target) ? target + EVENT_TARGET_SEPARATOR + name : name;
            var result = new api.EventBinding(fullName, new ASTWithSource(adjustedAst, source.source, source.location));
            var event = new Event(name, target, fullName);
            if (isBlank(target)) {
              ListWrapper.push(this.localEvents, event);
            } else {
              ListWrapper.push(this.globalEvents, event);
            }
            return result;
          },
          visitAccessMember: function(ast) {
            var isEventAccess = false;
            var current = ast;
            while (!isEventAccess && (current instanceof AccessMember)) {
              if (current.name == '$event') {
                isEventAccess = true;
              }
              current = current.receiver;
            }
            if (isEventAccess) {
              ListWrapper.push(this.locals, ast);
              var index = this.locals.length - 1;
              return new AccessMember(this._implicitReceiver, ("" + index), (function(arr) {
                return arr[index];
              }), null);
            } else {
              return ast;
            }
          },
          buildEventLocals: function() {
            return this.locals;
          },
          buildLocalEvents: function() {
            return this.localEvents;
          },
          buildGlobalEvents: function() {
            return this.globalEvents;
          },
          merge: function(eventBuilder) {
            this._merge(this.localEvents, eventBuilder.localEvents);
            this._merge(this.globalEvents, eventBuilder.globalEvents);
            ListWrapper.concat(this.locals, eventBuilder.locals);
          },
          _merge: function(host, tobeAdded) {
            var names = ListWrapper.create();
            for (var i = 0; i < host.length; i++) {
              ListWrapper.push(names, host[i].fullName);
            }
            for (var j = 0; j < tobeAdded.length; j++) {
              if (!ListWrapper.contains(names, tobeAdded[j].fullName)) {
                ListWrapper.push(host, tobeAdded[j]);
              }
            }
          }
        }, {}, $__super);
      }(AstTransformer));
      $__export("EventBuilder", EventBuilder);
      Object.defineProperty(EventBuilder.prototype.add, "parameters", {get: function() {
          return [[assert.type.string], [ASTWithSource], [assert.type.string]];
        }});
      Object.defineProperty(EventBuilder.prototype.visitAccessMember, "parameters", {get: function() {
          return [[AccessMember]];
        }});
      Object.defineProperty(EventBuilder.prototype.merge, "parameters", {get: function() {
          return [[EventBuilder]];
        }});
      Object.defineProperty(EventBuilder.prototype._merge, "parameters", {get: function() {
          return [[assert.genericType(List, Event)], [assert.genericType(List, Event)]];
        }});
    }
  };
});

System.register("angular2/src/render/dom/view/view", ["angular2/src/dom/dom_adapter", "angular2/src/facade/collection", "angular2/src/facade/lang", "./view_container", "./proto_view", "../shadow_dom/light_dom", "../shadow_dom/content_tag"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/render/dom/view/view";
  var DOM,
      ListWrapper,
      MapWrapper,
      Map,
      StringMapWrapper,
      List,
      int,
      isPresent,
      isBlank,
      BaseException,
      ViewContainer,
      RenderProtoView,
      LightDom,
      Content,
      NG_BINDING_CLASS,
      RenderView;
  return {
    setters: [function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      ListWrapper = $__m.ListWrapper;
      MapWrapper = $__m.MapWrapper;
      Map = $__m.Map;
      StringMapWrapper = $__m.StringMapWrapper;
      List = $__m.List;
    }, function($__m) {
      int = $__m.int;
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
      BaseException = $__m.BaseException;
    }, function($__m) {
      ViewContainer = $__m.ViewContainer;
    }, function($__m) {
      RenderProtoView = $__m.RenderProtoView;
    }, function($__m) {
      LightDom = $__m.LightDom;
    }, function($__m) {
      Content = $__m.Content;
    }],
    execute: function() {
      NG_BINDING_CLASS = 'ng-binding';
      RenderView = (function() {
        function RenderView(proto, rootNodes, boundTextNodes, boundElements, contentTags) {
          this.proto = proto;
          this.rootNodes = rootNodes;
          this.boundTextNodes = boundTextNodes;
          this.boundElements = boundElements;
          this.viewContainers = ListWrapper.createFixedSize(boundElements.length);
          this.contentTags = contentTags;
          this.lightDoms = ListWrapper.createFixedSize(boundElements.length);
          ListWrapper.fill(this.lightDoms, null);
          this.componentChildViews = ListWrapper.createFixedSize(boundElements.length);
          this.hostLightDom = null;
          this.hydrated = false;
          this.eventHandlerRemovers = [];
          this.imperativeHostViews = [];
        }
        return ($traceurRuntime.createClass)(RenderView, {
          getDirectParentLightDom: function(boundElementIndex) {
            var binder = this.proto.elementBinders[boundElementIndex];
            var destLightDom = null;
            if (binder.parentIndex !== -1 && binder.distanceToParent === 1) {
              destLightDom = this.lightDoms[binder.parentIndex];
            }
            return destLightDom;
          },
          getOrCreateViewContainer: function(binderIndex) {
            var vc = this.viewContainers[binderIndex];
            if (isBlank(vc)) {
              vc = new ViewContainer(this, binderIndex);
              this.viewContainers[binderIndex] = vc;
            }
            return vc;
          },
          setElementProperty: function(elementIndex, propertyName, value) {
            var setter = MapWrapper.get(this.proto.elementBinders[elementIndex].propertySetters, propertyName);
            setter(this.boundElements[elementIndex], value);
          },
          setText: function(textIndex, value) {
            DOM.setText(this.boundTextNodes[textIndex], value);
          },
          getViewContainer: function(index) {
            return this.viewContainers[index];
          },
          setEventDispatcher: function(dispatcher) {
            this._eventDispatcher = dispatcher;
          },
          dispatchEvent: function(elementIndex, eventName, event) {
            var allowDefaultBehavior = true;
            if (isPresent(this._eventDispatcher)) {
              var evalLocals = MapWrapper.create();
              MapWrapper.set(evalLocals, '$event', event);
              allowDefaultBehavior = this._eventDispatcher.dispatchEvent(elementIndex, eventName, evalLocals);
              if (!allowDefaultBehavior) {
                event.preventDefault();
              }
            }
            return allowDefaultBehavior;
          }
        }, {});
      }());
      $__export("RenderView", RenderView);
      Object.defineProperty(RenderView, "parameters", {get: function() {
          return [[RenderProtoView], [List], [List], [List], [List]];
        }});
      Object.defineProperty(RenderView.prototype.getDirectParentLightDom, "parameters", {get: function() {
          return [[assert.type.number]];
        }});
      Object.defineProperty(RenderView.prototype.setElementProperty, "parameters", {get: function() {
          return [[assert.type.number], [assert.type.string], [assert.type.any]];
        }});
      Object.defineProperty(RenderView.prototype.setText, "parameters", {get: function() {
          return [[assert.type.number], [assert.type.string]];
        }});
      Object.defineProperty(RenderView.prototype.getViewContainer, "parameters", {get: function() {
          return [[assert.type.number]];
        }});
      Object.defineProperty(RenderView.prototype.setEventDispatcher, "parameters", {get: function() {
          return [[assert.type.any]];
        }});
    }
  };
});

System.register("angular2/src/render/dom/view/view_container", ["angular2/src/facade/lang", "angular2/src/facade/collection", "angular2/src/dom/dom_adapter", "./view"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/render/dom/view/view_container";
  var isPresent,
      isBlank,
      BaseException,
      ListWrapper,
      MapWrapper,
      List,
      DOM,
      viewModule,
      ViewContainer;
  return {
    setters: [function($__m) {
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
      BaseException = $__m.BaseException;
    }, function($__m) {
      ListWrapper = $__m.ListWrapper;
      MapWrapper = $__m.MapWrapper;
      List = $__m.List;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      viewModule = $__m;
    }],
    execute: function() {
      ViewContainer = (function() {
        function ViewContainer(parentView, boundElementIndex) {
          this.parentView = parentView;
          this.boundElementIndex = boundElementIndex;
          this.views = [];
        }
        return ($traceurRuntime.createClass)(ViewContainer, {
          get: function(index) {
            return this.views[index];
          },
          size: function() {
            return this.views.length;
          },
          _siblingToInsertAfter: function(index) {
            if (index == 0)
              return this.parentView.boundElements[this.boundElementIndex];
            return ListWrapper.last(this.views[index - 1].rootNodes);
          },
          _checkHydrated: function() {
            if (!this.parentView.hydrated)
              throw new BaseException('Cannot change dehydrated ViewContainer');
          },
          _getDirectParentLightDom: function() {
            return this.parentView.getDirectParentLightDom(this.boundElementIndex);
          },
          clear: function() {
            this._checkHydrated();
            for (var i = this.views.length - 1; i >= 0; i--) {
              this.detach(i);
            }
            if (isPresent(this._getDirectParentLightDom())) {
              this._getDirectParentLightDom().redistribute();
            }
          },
          insert: function(view) {
            var atIndex = arguments[1] !== (void 0) ? arguments[1] : -1;
            this._checkHydrated();
            if (atIndex == -1)
              atIndex = this.views.length;
            ListWrapper.insert(this.views, atIndex, view);
            if (isBlank(this._getDirectParentLightDom())) {
              ViewContainer.moveViewNodesAfterSibling(this._siblingToInsertAfter(atIndex), view);
            } else {
              this._getDirectParentLightDom().redistribute();
            }
            if (isPresent(this.parentView.hostLightDom)) {
              this.parentView.hostLightDom.redistribute();
            }
            return view;
          },
          detach: function(atIndex) {
            this._checkHydrated();
            var detachedView = this.get(atIndex);
            ListWrapper.removeAt(this.views, atIndex);
            if (isBlank(this._getDirectParentLightDom())) {
              ViewContainer.removeViewNodes(detachedView);
            } else {
              this._getDirectParentLightDom().redistribute();
            }
            if (isPresent(this.parentView.hostLightDom)) {
              this.parentView.hostLightDom.redistribute();
            }
            return detachedView;
          },
          contentTagContainers: function() {
            return this.views;
          },
          nodes: function() {
            var r = [];
            for (var i = 0; i < this.views.length; ++i) {
              r = ListWrapper.concat(r, this.views[i].rootNodes);
            }
            return r;
          }
        }, {
          moveViewNodesAfterSibling: function(sibling, view) {
            for (var i = view.rootNodes.length - 1; i >= 0; --i) {
              DOM.insertAfter(sibling, view.rootNodes[i]);
            }
          },
          removeViewNodes: function(view) {
            var len = view.rootNodes.length;
            if (len == 0)
              return ;
            var parent = view.rootNodes[0].parentNode;
            for (var i = len - 1; i >= 0; --i) {
              DOM.removeChild(parent, view.rootNodes[i]);
            }
          }
        });
      }());
      $__export("ViewContainer", ViewContainer);
      Object.defineProperty(ViewContainer, "parameters", {get: function() {
          return [[viewModule.RenderView], [assert.type.number]];
        }});
      Object.defineProperty(ViewContainer.prototype.get, "parameters", {get: function() {
          return [[assert.type.number]];
        }});
      Object.defineProperty(ViewContainer.prototype._siblingToInsertAfter, "parameters", {get: function() {
          return [[assert.type.number]];
        }});
      Object.defineProperty(ViewContainer.prototype.detach, "parameters", {get: function() {
          return [[assert.type.number]];
        }});
    }
  };
});

System.register("angular2/src/render/dom/view/view_factory", ["angular2/di", "angular2/src/facade/lang", "angular2/src/facade/collection", "angular2/src/dom/dom_adapter", "../shadow_dom/content_tag", "../shadow_dom/shadow_dom_strategy", "angular2/src/render/dom/events/event_manager", "./proto_view", "./view", "../util"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/render/dom/view/view_factory";
  var OpaqueToken,
      Inject,
      Injectable,
      int,
      isPresent,
      isBlank,
      BaseException,
      ListWrapper,
      MapWrapper,
      Map,
      StringMapWrapper,
      List,
      DOM,
      Content,
      ShadowDomStrategy,
      EventManager,
      pvModule,
      viewModule,
      NG_BINDING_CLASS_SELECTOR,
      NG_BINDING_CLASS,
      VIEW_POOL_CAPACITY,
      ViewFactory;
  return {
    setters: [function($__m) {
      OpaqueToken = $__m.OpaqueToken;
      Inject = $__m.Inject;
      Injectable = $__m.Injectable;
    }, function($__m) {
      int = $__m.int;
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
      BaseException = $__m.BaseException;
    }, function($__m) {
      ListWrapper = $__m.ListWrapper;
      MapWrapper = $__m.MapWrapper;
      Map = $__m.Map;
      StringMapWrapper = $__m.StringMapWrapper;
      List = $__m.List;
    }, function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      Content = $__m.Content;
    }, function($__m) {
      ShadowDomStrategy = $__m.ShadowDomStrategy;
    }, function($__m) {
      EventManager = $__m.EventManager;
    }, function($__m) {
      pvModule = $__m;
    }, function($__m) {
      viewModule = $__m;
    }, function($__m) {
      NG_BINDING_CLASS_SELECTOR = $__m.NG_BINDING_CLASS_SELECTOR;
      NG_BINDING_CLASS = $__m.NG_BINDING_CLASS;
    }],
    execute: function() {
      VIEW_POOL_CAPACITY = 'render.ViewFactory.viewPoolCapacity';
      $__export("VIEW_POOL_CAPACITY", VIEW_POOL_CAPACITY);
      ViewFactory = (function() {
        function ViewFactory(poolCapacityPerProtoView, eventManager, shadowDomStrategy) {
          this._poolCapacityPerProtoView = poolCapacityPerProtoView;
          this._pooledViewsPerProtoView = MapWrapper.create();
          this._eventManager = eventManager;
          this._shadowDomStrategy = shadowDomStrategy;
        }
        return ($traceurRuntime.createClass)(ViewFactory, {
          createInPlaceHostView: function(hostElementSelector, hostProtoView) {
            return this._createView(hostProtoView, hostElementSelector);
          },
          getView: function(protoView) {
            var pooledViews = MapWrapper.get(this._pooledViewsPerProtoView, protoView);
            if (isPresent(pooledViews) && pooledViews.length > 0) {
              return ListWrapper.removeLast(pooledViews);
            }
            return this._createView(protoView, null);
          },
          returnView: function(view) {
            if (view.hydrated) {
              throw new BaseException('View is still hydrated');
            }
            var protoView = view.proto;
            var pooledViews = MapWrapper.get(this._pooledViewsPerProtoView, protoView);
            if (isBlank(pooledViews)) {
              pooledViews = [];
              MapWrapper.set(this._pooledViewsPerProtoView, protoView, pooledViews);
            }
            if (pooledViews.length < this._poolCapacityPerProtoView) {
              ListWrapper.push(pooledViews, view);
            }
          },
          _createView: function(protoView, inplaceElement) {
            if (isPresent(protoView.imperativeRendererId)) {
              return new viewModule.RenderView(protoView, [], [], [], []);
            }
            var rootElementClone = isPresent(inplaceElement) ? inplaceElement : DOM.importIntoDoc(protoView.element);
            var elementsWithBindingsDynamic;
            if (protoView.isTemplateElement) {
              elementsWithBindingsDynamic = DOM.querySelectorAll(DOM.content(rootElementClone), NG_BINDING_CLASS_SELECTOR);
            } else {
              elementsWithBindingsDynamic = DOM.getElementsByClassName(rootElementClone, NG_BINDING_CLASS);
            }
            var elementsWithBindings = ListWrapper.createFixedSize(elementsWithBindingsDynamic.length);
            for (var binderIdx = 0; binderIdx < elementsWithBindingsDynamic.length; ++binderIdx) {
              elementsWithBindings[binderIdx] = elementsWithBindingsDynamic[binderIdx];
            }
            var viewRootNodes;
            if (protoView.isTemplateElement) {
              var childNode = DOM.firstChild(DOM.content(rootElementClone));
              viewRootNodes = [];
              while (childNode != null) {
                ListWrapper.push(viewRootNodes, childNode);
                childNode = DOM.nextSibling(childNode);
              }
            } else {
              viewRootNodes = [rootElementClone];
            }
            var binders = protoView.elementBinders;
            var boundTextNodes = [];
            var boundElements = ListWrapper.createFixedSize(binders.length);
            var contentTags = ListWrapper.createFixedSize(binders.length);
            for (var binderIdx = 0; binderIdx < binders.length; binderIdx++) {
              var binder = binders[binderIdx];
              var element = void 0;
              if (binderIdx === 0 && protoView.rootBindingOffset === 1) {
                element = rootElementClone;
              } else {
                element = elementsWithBindings[binderIdx - protoView.rootBindingOffset];
              }
              boundElements[binderIdx] = element;
              var childNodes = DOM.childNodes(DOM.templateAwareRoot(element));
              var textNodeIndices = binder.textNodeIndices;
              for (var i = 0; i < textNodeIndices.length; i++) {
                ListWrapper.push(boundTextNodes, childNodes[textNodeIndices[i]]);
              }
              var contentTag = null;
              if (isPresent(binder.contentTagSelector)) {
                contentTag = new Content(element, binder.contentTagSelector);
              }
              contentTags[binderIdx] = contentTag;
            }
            var view = new viewModule.RenderView(protoView, viewRootNodes, boundTextNodes, boundElements, contentTags);
            for (var binderIdx = 0; binderIdx < binders.length; binderIdx++) {
              var binder = binders[binderIdx];
              var element = boundElements[binderIdx];
              if (binder.hasStaticComponent()) {
                var childView = this._createView(binder.nestedProtoView, null);
                ViewFactory.setComponentView(this._shadowDomStrategy, view, binderIdx, childView);
              }
              if (isPresent(binder.eventLocals) && isPresent(binder.localEvents)) {
                for (var i = 0; i < binder.localEvents.length; i++) {
                  this._createEventListener(view, element, binderIdx, binder.localEvents[i].name, binder.eventLocals);
                }
              }
            }
            return view;
          },
          _createEventListener: function(view, element, elementIndex, eventName, eventLocals) {
            this._eventManager.addEventListener(element, eventName, (function(event) {
              view.dispatchEvent(elementIndex, eventName, event);
            }));
          }
        }, {setComponentView: function(shadowDomStrategy, hostView, elementIndex, componentView) {
            var element = hostView.boundElements[elementIndex];
            var lightDom = shadowDomStrategy.constructLightDom(hostView, componentView, element);
            shadowDomStrategy.attachTemplate(element, componentView);
            hostView.lightDoms[elementIndex] = lightDom;
            hostView.componentChildViews[elementIndex] = componentView;
          }});
      }());
      $__export("ViewFactory", ViewFactory);
      Object.defineProperty(ViewFactory, "annotations", {get: function() {
          return [new Injectable()];
        }});
      Object.defineProperty(ViewFactory, "parameters", {get: function() {
          return [[new Inject(VIEW_POOL_CAPACITY)], [EventManager], [ShadowDomStrategy]];
        }});
      Object.defineProperty(ViewFactory.prototype.createInPlaceHostView, "parameters", {get: function() {
          return [[], [pvModule.RenderProtoView]];
        }});
      Object.defineProperty(ViewFactory.prototype.getView, "parameters", {get: function() {
          return [[pvModule.RenderProtoView]];
        }});
      Object.defineProperty(ViewFactory.prototype.returnView, "parameters", {get: function() {
          return [[viewModule.RenderView]];
        }});
      Object.defineProperty(ViewFactory.prototype._createView, "parameters", {get: function() {
          return [[pvModule.RenderProtoView], []];
        }});
      Object.defineProperty(ViewFactory.setComponentView, "parameters", {get: function() {
          return [[ShadowDomStrategy], [viewModule.RenderView], [assert.type.number], [viewModule.RenderView]];
        }});
    }
  };
});

System.register("angular2/src/render/dom/view/view_hydrator", ["angular2/di", "angular2/src/facade/lang", "angular2/src/facade/collection", "../shadow_dom/light_dom", "../events/event_manager", "./view_factory", "./view_container", "./view", "../shadow_dom/shadow_dom_strategy"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/render/dom/view/view_hydrator";
  var Injectable,
      int,
      isPresent,
      isBlank,
      BaseException,
      ListWrapper,
      MapWrapper,
      Map,
      StringMapWrapper,
      List,
      ldModule,
      EventManager,
      ViewFactory,
      vcModule,
      viewModule,
      ShadowDomStrategy,
      RenderViewHydrator;
  return {
    setters: [function($__m) {
      Injectable = $__m.Injectable;
    }, function($__m) {
      int = $__m.int;
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
      BaseException = $__m.BaseException;
    }, function($__m) {
      ListWrapper = $__m.ListWrapper;
      MapWrapper = $__m.MapWrapper;
      Map = $__m.Map;
      StringMapWrapper = $__m.StringMapWrapper;
      List = $__m.List;
    }, function($__m) {
      ldModule = $__m;
    }, function($__m) {
      EventManager = $__m.EventManager;
    }, function($__m) {
      ViewFactory = $__m.ViewFactory;
    }, function($__m) {
      vcModule = $__m;
    }, function($__m) {
      viewModule = $__m;
    }, function($__m) {
      ShadowDomStrategy = $__m.ShadowDomStrategy;
    }],
    execute: function() {
      RenderViewHydrator = (function() {
        function RenderViewHydrator(eventManager, viewFactory, shadowDomStrategy) {
          this._eventManager = eventManager;
          this._viewFactory = viewFactory;
          this._shadowDomStrategy = shadowDomStrategy;
        }
        return ($traceurRuntime.createClass)(RenderViewHydrator, {
          hydrateDynamicComponentView: function(hostView, boundElementIndex, componentView) {
            ViewFactory.setComponentView(this._shadowDomStrategy, hostView, boundElementIndex, componentView);
            var lightDom = hostView.lightDoms[boundElementIndex];
            this._viewHydrateRecurse(componentView, lightDom);
            if (isPresent(lightDom)) {
              lightDom.redistribute();
            }
          },
          dehydrateDynamicComponentView: function(parentView, boundElementIndex) {
            throw new BaseException('Not supported yet');
          },
          hydrateInPlaceHostView: function(parentView, hostView) {
            if (isPresent(parentView)) {
              ListWrapper.push(parentView.imperativeHostViews, hostView);
            }
            this._viewHydrateRecurse(hostView, null);
          },
          dehydrateInPlaceHostView: function(parentView, hostView) {
            if (isPresent(parentView)) {
              ListWrapper.remove(parentView.imperativeHostViews, hostView);
            }
            vcModule.ViewContainer.removeViewNodes(hostView);
            hostView.rootNodes = [];
            this._viewDehydrateRecurse(hostView);
          },
          hydrateViewInViewContainer: function(viewContainer, view) {
            this._viewHydrateRecurse(view, viewContainer.parentView.hostLightDom);
          },
          dehydrateViewInViewContainer: function(viewContainer, view) {
            this._viewDehydrateRecurse(view);
          },
          _viewHydrateRecurse: function(view, hostLightDom) {
            if (view.hydrated)
              throw new BaseException('The view is already hydrated.');
            view.hydrated = true;
            view.hostLightDom = hostLightDom;
            for (var i = 0; i < view.contentTags.length; i++) {
              var destLightDom = view.getDirectParentLightDom(i);
              var ct = view.contentTags[i];
              if (isPresent(ct)) {
                ct.hydrate(destLightDom);
              }
            }
            for (var i = 0; i < view.componentChildViews.length; i++) {
              var cv = view.componentChildViews[i];
              if (isPresent(cv)) {
                this._viewHydrateRecurse(cv, view.lightDoms[i]);
              }
            }
            for (var i = 0; i < view.lightDoms.length; ++i) {
              var lightDom = view.lightDoms[i];
              if (isPresent(lightDom)) {
                lightDom.redistribute();
              }
            }
            view.eventHandlerRemovers = ListWrapper.create();
            var binders = view.proto.elementBinders;
            for (var binderIdx = 0; binderIdx < binders.length; binderIdx++) {
              var binder = binders[binderIdx];
              if (isPresent(binder.globalEvents)) {
                for (var i = 0; i < binder.globalEvents.length; i++) {
                  var globalEvent = binder.globalEvents[i];
                  var remover = this._createGlobalEventListener(view, binderIdx, globalEvent.name, globalEvent.target, globalEvent.fullName);
                  ListWrapper.push(view.eventHandlerRemovers, remover);
                }
              }
            }
          },
          _createGlobalEventListener: function(view, elementIndex, eventName, eventTarget, fullName) {
            return this._eventManager.addGlobalEventListener(eventTarget, eventName, (function(event) {
              view.dispatchEvent(elementIndex, fullName, event);
            }));
          },
          _viewDehydrateRecurse: function(view) {
            for (var i = 0; i < view.componentChildViews.length; i++) {
              var cv = view.componentChildViews[i];
              if (isPresent(cv)) {
                this._viewDehydrateRecurse(cv);
                if (view.proto.elementBinders[i].hasDynamicComponent()) {
                  vcModule.ViewContainer.removeViewNodes(cv);
                  this._viewFactory.returnView(cv);
                  view.lightDoms[i] = null;
                  view.componentChildViews[i] = null;
                }
              }
            }
            for (var i = 0; i < view.imperativeHostViews.length; i++) {
              var hostView = view.imperativeHostViews[i];
              this._viewDehydrateRecurse(hostView);
              vcModule.ViewContainer.removeViewNodes(hostView);
              hostView.rootNodes = [];
              this._viewFactory.returnView(hostView);
            }
            view.imperativeHostViews = [];
            if (isPresent(view.viewContainers)) {
              for (var i = 0; i < view.viewContainers.length; i++) {
                var vc = view.viewContainers[i];
                if (isPresent(vc)) {
                  this._viewContainerDehydrateRecurse(vc);
                }
                var ct = view.contentTags[i];
                if (isPresent(ct)) {
                  ct.dehydrate();
                }
              }
            }
            for (var i = 0; i < view.eventHandlerRemovers.length; i++) {
              view.eventHandlerRemovers[i]();
            }
            view.hostLightDom = null;
            view.eventHandlerRemovers = null;
            view.setEventDispatcher(null);
            view.hydrated = false;
          },
          _viewContainerDehydrateRecurse: function(viewContainer) {
            for (var i = 0; i < viewContainer.views.length; i++) {
              this._viewDehydrateRecurse(viewContainer.views[i]);
            }
            viewContainer.clear();
          }
        }, {});
      }());
      $__export("RenderViewHydrator", RenderViewHydrator);
      Object.defineProperty(RenderViewHydrator, "annotations", {get: function() {
          return [new Injectable()];
        }});
      Object.defineProperty(RenderViewHydrator, "parameters", {get: function() {
          return [[EventManager], [ViewFactory], [ShadowDomStrategy]];
        }});
      Object.defineProperty(RenderViewHydrator.prototype.hydrateDynamicComponentView, "parameters", {get: function() {
          return [[viewModule.RenderView], [assert.type.number], [viewModule.RenderView]];
        }});
      Object.defineProperty(RenderViewHydrator.prototype.dehydrateDynamicComponentView, "parameters", {get: function() {
          return [[viewModule.RenderView], [assert.type.number]];
        }});
      Object.defineProperty(RenderViewHydrator.prototype.hydrateInPlaceHostView, "parameters", {get: function() {
          return [[viewModule.RenderView], [viewModule.RenderView]];
        }});
      Object.defineProperty(RenderViewHydrator.prototype.dehydrateInPlaceHostView, "parameters", {get: function() {
          return [[viewModule.RenderView], [viewModule.RenderView]];
        }});
      Object.defineProperty(RenderViewHydrator.prototype.hydrateViewInViewContainer, "parameters", {get: function() {
          return [[vcModule.ViewContainer], [viewModule.RenderView]];
        }});
      Object.defineProperty(RenderViewHydrator.prototype.dehydrateViewInViewContainer, "parameters", {get: function() {
          return [[vcModule.ViewContainer], [viewModule.RenderView]];
        }});
      Object.defineProperty(RenderViewHydrator.prototype._viewHydrateRecurse, "parameters", {get: function() {
          return [[], [ldModule.LightDom]];
        }});
    }
  };
});
