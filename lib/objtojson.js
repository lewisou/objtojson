(function(){
  var _t, Generator, test_attributes, test_node, test_children, obj_equal, i$, ref$, len$, t, slice$ = [].slice;
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
        var sub_g;
        sub_g = new Generator(ele);
        fn(sub_g);
        return sub_g.rs;
      }, this.obj[realName]);
      return this;
    };
    prototype.node = function(propName, fn){
      this.rs[propName] = fn(new Generator(this.obj));
      return this;
    };
    prototype.val = function(fn){
      fn == null && (fn = function(obj){
        return obj;
      });
      return this.rs = fn(this.obj);
    };
    prototype.to_json = function(){
      return JSON.stringify(this.rs);
    };
    return Generator;
  }());
  module.exports = Generator;
  test_attributes = function(){
    var g;
    g = new Generator({
      a: 'b',
      b: 'c'
    });
    g.attributes('a', 'b');
    return obj_equal(g.rs, {
      a: 'b',
      b: 'c'
    });
  };
  test_node = function(){
    var g;
    g = new Generator({
      a: 'b',
      c: 'd'
    });
    g.node('fake', function(sub_g){
      return sub_g.val(function(obj){
        return obj.c + 'fake';
      });
    });
    return obj_equal(g.rs, {
      'fake': 'dfake'
    });
  };
  test_children = function(){
    var obj, g;
    obj = {
      'a': [1, 2, 3, 4]
    };
    g = new Generator(obj);
    g.children('a', function(ele_g){
      return ele_g.val(function(v){
        return v * 2;
      });
    });
    return obj_equal(g.rs, {
      'a': [2, 4, 6, 8]
    });
  };
  obj_equal = function(obj1, obj2){
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  };
  if (!module.parent) {
    for (i$ = 0, len$ = (ref$ = [test_attributes, test_node, test_children]).length; i$ < len$; ++i$) {
      t = ref$[i$];
      console.log(t());
    }
  }
  function bind$(obj, key, target){
    return function(){ return (target || obj)[key].apply(obj, arguments) };
  }
}).call(this);
