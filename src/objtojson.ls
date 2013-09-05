require! _t: 'prelude-ls'
  
class Generator
  (@obj={}) ->
    @rs = {}
  
  attributes : (...attrs) ~>
    for attr in attrs
      @rs[attr] = @obj[attr]
    @

  children : (prop-name, fn, real-name=prop-name) ~>
    @rs[prop-name] = do
      ele <- _t.map _, @obj[real-name]
      sub_g = new Generator(ele)
      fn sub_g
      sub_g.rs
    @

  node : (prop-name, fn) ~>
    @rs[prop-name] = fn new Generator(@obj)
    @

  val : (fn = (obj) -> obj) ~>
    @rs = fn(@obj)

  to_json : ~>
    JSON.stringify @rs  

module.exports = Generator

test_attributes = ->
  g = new Generator {a: \b, b: \c}
  g.attributes \a, \b
  obj_equal g.rs, {a: \b, b: \c}

test_node = ->
  g = new Generator a: \b, c: \d
  g.node \fake, (sub_g) ->
    sub_g.val (obj) -> obj.c + 'fake'

  obj_equal g.rs, {\fake : \dfake}

test_children = ->
  obj =
    \a : [1 2 3 4]

  g = new Generator obj
  g.children \a, (ele_g) ->
    ele_g.val (v) -> v * 2

  obj_equal g.rs, {\a : [2, 4, 6, 8]}

obj_equal = (obj1, obj2) ->
  (JSON.stringify obj1) == (JSON.stringify obj2)

if !module.parent
  for t in [test_attributes, test_node, test_children]
    console.log t!

