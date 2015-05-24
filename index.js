/*
 * Copyright (c) 2015 Dickson Tam
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 */

(function(property) {

  var property = property || 'bind';

  var attachBindToElementPrototype = function(element, property) {

    var opts = [];
    var rclass = /^[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*$/;
    var rattrib = /^[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*$/;

    Object.defineProperty(element.prototype, property, { get: getBind });

    function addOptions() {
      var args = Array.prototype.slice.call(arguments);
      opts = opts.concat(args);

      return { to: createBinding.bind(this) };
    }

    function truthy(str) {
      if (str == null) return false;

      var str = str.trim().toLowerCase();
      return !!str && str != 'no' && str != 'false' && str != '0';
    }

    function createBinding(obj, prop) {
      var el = this;
      var getter, setter;

      if (!(el instanceof HTMLElement)) {
        throw new Error('Element ' + el + ' is not a HTMLElement');
      }

      if (obj.hasOwnProperty(prop)) {
        throw new Error('Object ' + obj + ' already has property' + prop);
      }

      switch (opts[0]) {
        case 'text':
          getter = function() {
            return el.innerText;
          };
          setter = function(text) {
            el.innerText = text;
          };
          break;
        case 'html':
          getter = function() {
            return el.innerHTML;
          };
          setter = function(html) {
            el.innerHTML = html;
          }
          break;
        case 'classList':
          getter = function() {
            return el.classList;
          }
          setter = function(arr) {
            el.classList = arr;
          }
          break;
        case 'hasClass':
          getter = function() {
            return el.classList.contains(opts[1]);
          };
          setter = function(boolean) {
            if (boolean) {
              el.classList.add(opts[1]);
            } else {
              el.classList.remove(opts[1]);
            }
          }
          break;
        case 'noClass':
          getter = function() {
            return !el.classList.contains(opts[1]);
          };
          setter = function(boolean) {
            if (!boolean) {
              el.classList.add(opts[1]);
            } else {
              el.classList.remove(opts[1]);
            }
          }
          break;
        case 'attr':
          getter = function() {
            return el.getAttribute(opts[1]);
          };
          setter = function(attr) {
            el.setAttribute(opts[1], attr);
          };
          break;
        case 'hasTruthyAttr':
          getter = function() {
            return truthy(el.getAtribute(opts[1]));
          };
          setter = function(boolean) {
            var val = boolean? 'true' : 'false';
            el.setAttribute(opts[1], val);
          };
          break;
        case 'noTruthyAttr':
          getter = function() {
            return !truthy(el.getAtribute(opts[1]));
          };
          setter = function(boolean) {
            var val = !boolean? 'true' : 'false';
            el.setAttribute(opts[1], val);
          };
          break;
        case 'textValue':
          getter = function() {
            return el.value;
          };
          setter = function(text) {
            el.value = text;
          };
          break;
        case 'selectValue':
          getter = function() {
            return el.value;
          };
          setter = function(text) {
            el.value = text;
          };
          break;
        case 'groupValue':
          getter = function() {
            var name = el.name;
            var group = document.getElementsByName(name);

            for (var i=0; i < group.length; i++) {
              var elradio = group[i];

              if (!(elradio instanceof HTMLInputElement)) continue;
              if (!(elradio.type == 'radio')) continue;

              if (elradio.checked) {
                return elradio.value;
              }
            }

            return undefined;
          }
          setter = function(value) {
            var name = el.name;
            var group = document.getElementsByName(name);

            for (var i=0; i < group.length; i++) {
              var elradio = group[i];

              if (!(elradio instanceof HTMLInputElement)) continue;
              if (!(elradio.type == 'radio')) continue;

              elradio.checked = (elradio.value == value);
            }
          }
          break;
        case 'checked':
          getter = function() {
            return el.checked;
          }
          setter = function(boolean) {
            el.checked = boolean;
          }
          break;
      }

      Object.defineProperty(obj, prop, { get: getter, set: setter, enumerable: true});

    }

    function checkClassName(className) {
      var fname = arguments.callee.caller.name;

      if (className == null) {
        throw new Error('className parameter required in ' + fname + ' call.');
      } else if (typeof className != "string") {
        throw new Error('className parameter is not a string.');
      } else if (className.length == 0) {
        throw new Error('className parameter is an empty string.');
      } else if (className.match(rclass)){
        throw new Error('className parameter is not valid class name.');
      }
    }

    function checkAttributeName(attribute) {
      var fname = arguments.callee.caller.name;

      if (attribute == null) {
        throw new Error('Attribute name required in ' + fname + ' call.');
      } else if (typeof attribute != "string") {
        throw new Error('Attribute parameter is not a string.');
      } else if (attribute.length == 0) {
        throw new Error('Attribute parameter is an empty string.');
      } else if (attribute.match(rattrib)){
        throw new Error('Attribute parameter is not valid attribute name.');
      }
    }

    function getBind() {
      var el = this;
      var bind = {
        classList: function(className) {
          checkClassName(className);
          addOptions.bind(el, 'classList');
        },
        hasClass: function(className) {
          checkClassName(className);
          addOptions.bind(el, 'hasClass');
        },
        noClass: function(className) {
          checkClassName(className);
          addOptions.bind(el, 'noClass');
        },
        attr: function(attr) {
          checkAttributeName(attr);
          addOptions.bind(el, 'attr');
        },
        hasTruthyAttr: function(attr) {
          checkAttributeName(attr);
          addOptions.bind(el, 'hasTruthyAttr');
        },
        noTruthyAttr: function(attr) {
          checkAttributeName(attr);
          addOptions.bind(el, 'noTruthyAttr');
        }
      };

      Object.defineProperty(bind, 'text', {
        get: addOptions.bind(el, 'text')
      })

      Object.defineProperty(bind, 'html', {
        get: addOptions.bind(el, 'html')
      })

      if (element == HTMLSelectElement) {
        Object.defineProperty(bind, 'selectValue', {
          get: addOptions.bind(el, 'selectValue')
        })
      } else if (element == HTMLInputElement) {
        switch (element.type) {
          case 'password':
          case 'text':
            Object.defineProperty(bind, 'textValue', {
              get: addOptions.bind(el, 'textValue')
            });
            break;
          case 'radio':
            Object.defineProperty(bind, 'groupValue', {
              get: addOptions.bind(el, 'groupValue')
            });
            break;
          case 'checkbox':
            Object.defineProperty(bind, 'checked', {
              get:  addOptions.bind(el, 'checked')
            });
            break;
        }
      } else if (element == HTMLTextAreaElement) {
        Object.defineProperty(bind, 'textValue', {
          get: addOptions.bind(el, 'textValue')
        });
      }

      return bind;
    }
  }

  attachBindToElementPrototype(HTMLElement, property);
  attachBindToElementPrototype(HTMLInputElement, property);
  attachBindToElementPrototype(HTMLSelectElement, property);
  attachBindToElementPrototype(HTMLTextAreaElement, property);
})();
