objtojson
=========

Better way to stringify your object

Install
---------
```bash
npm install objtojson
```

Common Useage
---------

```livescript
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
    .attributes \prop1, \prop3
    .dict!

  obj-equal test, {prop1: 1, prop3: \hello}

test-node = ->
  test = Generator.gen!
    .node \fakeprop (empty) -> 'a fake value'
    .node \fakeprop2 (empty) -> 'a fake value 2'
    .dict!

  obj-equal test, {fakeprop : 'a fake value', fakeprop2: 'a fake value 2'}

test-children = ->
  test = Generator.gen obj
    .children \prop4 (ele) ->
      ele.attributes \prop1, \prop3
    .dict!

  obj-equal test, { prop4: [ { prop1: 1, prop3: 3 }, { prop1: 4, prop3: 6 } ] }

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

```

