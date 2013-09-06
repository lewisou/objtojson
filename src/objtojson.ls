require! _t: 'prelude-ls'

class Generator
  (@obj={}) ->
    @rs = {}

  @gen = (obj={}) ->
    new Generator obj

  attributes : (...attrs) ~>
    for attr in attrs
      @rs[attr] = @obj[attr]
    @

  children : (prop-name, fn, real-name=prop-name) ~>
    @rs[prop-name] = do
      ele <- _t.map _, @obj[real-name]
      sub-g = new Generator(ele)
      fn.call sub-g
      sub-g.rs
    @

  child : (prop-name, fn, real-name=prop-name) ~>
    sub-g = new Generator(@obj[real-name])
    fn.call sub-g
    @rs[prop-name] = sub-g.rs
    @
    
  node : (prop-name, fn) ~>
    @rs[prop-name] = fn.call @obj
    @

  val : (fn = (obj) -> obj) ~>
    @rs = fn(@obj)
    @

  dict : ~>
    @rs
    
  to_json : ~>
    JSON.stringify @rs

module.exports = Generator

##
# test cases =======================
##

obj =
  prop1 : 1
  prop2 :
    prop21 : \a
    prop22 : \b
  prop3 : \hello
  prop4 :
    * prop1: 1
      prop2: 2
      prop3: 3
    * prop1: 4
      prop2: 5
      prop3: 6
  
test-attributes = ->
  test = Generator.gen obj
    .attributes \prop1 \prop3
    .dict!

  obj-equal test, {prop1: 1, prop3: \hello}

test-node = ->
  test = Generator.gen obj
    .node \fakeprop -> 'a fake value'
    .node \fakeprop2 -> "a fake value 2 #{@prop3}"
    .dict!

  obj-equal test, {fakeprop : 'a fake value', fakeprop2: 'a fake value 2 hello'}

test-children = ->
  test = Generator.gen obj
    .children \prop4 !->
      @attributes \prop1, \prop3
    .dict!

  obj-equal test, { prop4: [ { prop1: 1, prop3: 3 }, { prop1: 4, prop3: 6 } ] }

test-child = ->
  obj =
    prop1 : 1
    prop2 :
      subprop1 : 2
      subprop2 : 3
      subprop3 : 4
  test = Generator.gen obj
    .child \prop2 !->
      @attributes \subprop2 \subprop3
    .dict!
    
  obj-equal test, {prop2 : {subprop2 : 3, subprop3 : 4}}

test-gen-wrapper = ->
  test = Generator.gen {prop1: 1, prop2: 2}
    .attributes \prop1
    .dict!
  obj-equal test, {prop1 : 1}

obj-equal = (obj1, obj2) ->
  (JSON.stringify obj1) == (JSON.stringify obj2)

if !module.parent
  for t in [test-attributes, test-node, test-children, test-child, test-gen-wrapper]
    console.log t!

