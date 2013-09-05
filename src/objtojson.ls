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
      sub-g = new Generator(ele)
      fn sub-g
      sub-g.rs
    @

  child : (prop-name, fn, real-name=prop-name) ~>
    sub-g = new Generator(@obj[real-name])
    fn sub-g
    @rs[prop-name] = sub-g.rs
    @
    
  node : (prop-name, fn) ~>
    @rs[prop-name] = fn @obj
    @

  val : (fn = (obj) -> obj) ~>
    @rs = fn(@obj)
    @

  to_json : ~>
    JSON.stringify @rs

module.exports = Generator

##
# test cases =======================
##
test-attributes = ->
  g = new Generator {a: \b, b: \c}
  g.attributes \a, \b
  obj-equal g.rs, {a: \b, b: \c}

test-node = ->
  g = new Generator a: \b, c: \d
  g.node \fake, (obj) ->
    obj.c + 'fake'

  obj-equal g.rs, {\fake : \dfake}

test-children = ->
  obj =
    \a : [1 2 3 4]

  g = new Generator obj
  g.children \a, (ele-g) ->
    ele-g.val (v) -> v * 2

  obj-equal g.rs, {\a : [2, 4, 6, 8]}

test-child = ->
  obj =
    prop1 : 1
    prop2 :
      subprop1 : 2
      subprop2 : 3
      subprop3 : 4
  g = new Generator obj
  g.child \prop2, (p2) ->
    p2.attributes \subprop2 \subprop3

  obj-equal g.rs, {prop2 : {subprop2 : 3, subprop3 : 4}}

obj-equal = (obj1, obj2) ->
  (JSON.stringify obj1) == (JSON.stringify obj2)

if !module.parent
  for t in [test-attributes, test-node, test-children, test-child]
    console.log t!

