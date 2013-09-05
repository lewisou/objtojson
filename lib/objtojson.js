(function(){
  var _t, Generator, testAttributes, testNode, testChildren, testChild, objEqual, i$, ref$, len$, t, slice$ = [].slice;
  _t = require('prelude-ls');
  Generator = (function(){
    Generator.displayName = 'Generator';
    var prototype = Generator.prototype, constructor = Generator;
    function Generator(obj){
      this.obj = obj != null
        ? obj
        : {};
      this.to_json = bind$(this, 'to_json', prototype);
      this.val = bind$(this, 'val', prototype);
      this.node = bind$(this, 'node', prototype);
      this.child = bind$(this, 'child', prototype);
      this.children = bind$(this, 'children', prototype);
      this.attributes = bind$(this, 'attributes', prototype);
      this.rs = {};
    }
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
        fn(subG);
        return subG.rs;
      }, this.obj[realName]);
      return this;
    };
    prototype.child = function(propName, fn, realName){
      var subG;
      realName == null && (realName = propName);
      subG = new Generator(this.obj[realName]);
      fn(subG);
      this.rs[propName] = subG.rs;
      return this;
    };
    prototype.node = function(propName, fn){
      this.rs[propName] = fn(this.obj);
      return this;
    };
    prototype.val = function(fn){
      fn == null && (fn = function(obj){
        return obj;
      });
      this.rs = fn(this.obj);
      return this;
    };
    prototype.to_json = function(){
      return JSON.stringify(this.rs);
    };
    return Generator;
  }());
  module.exports = Generator;
  testAttributes = function(){
    var g;
    g = new Generator({
      a: 'b',
      b: 'c'
    });
    g.attributes('a', 'b');
    return objEqual(g.rs, {
      a: 'b',
      b: 'c'
    });
  };
  testNode = function(){
    var g;
    g = new Generator({
      a: 'b',
      c: 'd'
    });
    g.node('fake', function(obj){
      return obj.c + 'fake';
    });
    return objEqual(g.rs, {
      'fake': 'dfake'
    });
  };
  testChildren = function(){
    var obj, g;
    obj = {
      'a': [1, 2, 3, 4]
    };
    g = new Generator(obj);
    g.children('a', function(eleG){
      return eleG.val(function(v){
        return v * 2;
      });
    });
    return objEqual(g.rs, {
      'a': [2, 4, 6, 8]
    });
  };
  testChild = function(){
    var obj, g;
    obj = {
      prop1: 1,
      prop2: {
        subprop1: 2,
        subprop2: 3,
        subprop3: 4
      }
    };
    g = new Generator(obj);
    g.child('prop2', function(p2){
      return p2.attributes('subprop2', 'subprop3');
    });
    return objEqual(g.rs, {
      prop2: {
        subprop2: 3,
        subprop3: 4
      }
    });
  };
  objEqual = function(obj1, obj2){
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  };
  if (!module.parent) {
    for (i$ = 0, len$ = (ref$ = [testAttributes, testNode, testChildren, testChild]).length; i$ < len$; ++i$) {
      t = ref$[i$];
      console.log(t());
    }
  }
  function bind$(obj, key, target){
    return function(){ return (target || obj)[key].apply(obj, arguments) };
  }
}).call(this);
