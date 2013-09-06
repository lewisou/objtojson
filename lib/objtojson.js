(function(){
  var _t, Generator, obj, testAttributes, testNode, testChildren, testChild, testGenWrapper, objEqual, i$, ref$, len$, t, slice$ = [].slice;
  _t = require('prelude-ls');
  Generator = (function(){
    Generator.displayName = 'Generator';
    var prototype = Generator.prototype, constructor = Generator;
    function Generator(obj){
      this.obj = obj != null
        ? obj
        : {};
      this.to_json = bind$(this, 'to_json', prototype);
      this.dict = bind$(this, 'dict', prototype);
      this.val = bind$(this, 'val', prototype);
      this.node = bind$(this, 'node', prototype);
      this.child = bind$(this, 'child', prototype);
      this.children = bind$(this, 'children', prototype);
      this.attributes = bind$(this, 'attributes', prototype);
      this.rs = {};
    }
    Generator.gen = function(obj){
      obj == null && (obj = {});
      return new Generator(obj);
    };
    prototype.attributes = function(){
      var attrs, i$, len$, attr;
      attrs = slice$.call(arguments);
      for (i$ = 0, len$ = attrs.length; i$ < len$; ++i$) {
        attr = attrs[i$];
        this.rs[attr] = this.obj[attr];
      }
      return this;
    };
    prototype.children = function(propName, fn, realName){
      realName == null && (realName = propName);
      this.rs[propName] = _t.map(function(ele){
        var subG;
        subG = new Generator(ele);
        fn.call(subG);
        return subG.rs;
      }, this.obj[realName]);
      return this;
    };
    prototype.child = function(propName, fn, realName){
      var subG;
      realName == null && (realName = propName);
      subG = new Generator(this.obj[realName]);
      fn.call(subG);
      this.rs[propName] = subG.rs;
      return this;
    };
    prototype.node = function(propName, fn){
      this.rs[propName] = fn.call(this.obj);
      return this;
    };
    prototype.val = function(fn){
      fn == null && (fn = function(obj){
        return obj;
      });
      this.rs = fn(this.obj);
      return this;
    };
    prototype.dict = function(){
      return this.rs;
    };
    prototype.to_json = function(){
      return JSON.stringify(this.rs);
    };
    return Generator;
  }());
  module.exports = Generator;
  obj = {
    prop1: 1,
    prop2: {
      prop21: 'a',
      prop22: 'b'
    },
    prop3: 'hello',
    prop4: [
      {
        prop1: 1,
        prop2: 2,
        prop3: 3
      }, {
        prop1: 4,
        prop2: 5,
        prop3: 6
      }
    ]
  };
  testAttributes = function(){
    var test;
    test = Generator.gen(obj).attributes('prop1', 'prop3').dict();
    return objEqual(test, {
      prop1: 1,
      prop3: 'hello'
    });
  };
  testNode = function(){
    var test;
    test = Generator.gen(obj).node('fakeprop', function(){
      return 'a fake value';
    }).node('fakeprop2', function(){
      return "a fake value 2 " + this.prop3;
    }).dict();
    return objEqual(test, {
      fakeprop: 'a fake value',
      fakeprop2: 'a fake value 2 hello'
    });
  };
  testChildren = function(){
    var test;
    test = Generator.gen(obj).children('prop4', function(){
      return this.attributes('prop1', 'prop3');
    }).dict();
    return objEqual(test, {
      prop4: [
        {
          prop1: 1,
          prop3: 3
        }, {
          prop1: 4,
          prop3: 6
        }
      ]
    });
  };
  testChild = function(){
    var obj, test;
    obj = {
      prop1: 1,
      prop2: {
        subprop1: 2,
        subprop2: 3,
        subprop3: 4
      }
    };
    test = Generator.gen(obj).child('prop2', function(){
      return this.attributes('subprop2', 'subprop3');
    }).dict();
    return objEqual(test, {
      prop2: {
        subprop2: 3,
        subprop3: 4
      }
    });
  };
  testGenWrapper = function(){
    var test;
    test = Generator.gen({
      prop1: 1,
      prop2: 2
    }).attributes('prop1').dict();
    return objEqual(test, {
      prop1: 1
    });
  };
  objEqual = function(obj1, obj2){
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  };
  if (!module.parent) {
    for (i$ = 0, len$ = (ref$ = [testAttributes, testNode, testChildren, testChild, testGenWrapper]).length; i$ < len$; ++i$) {
      t = ref$[i$];
      console.log(t());
    }
  }
  function bind$(obj, key, target){
    return function(){ return (target || obj)[key].apply(obj, arguments) };
  }
}).call(this);
