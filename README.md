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
require! Generator : objtojson

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

  # output {prop1: 1, prop3: \hello}

test-node = ->
  test = Generator.gen obj
    .node \fakeprop, -> 'a fake value'
    .node \fakeprop2, -> "a fake value 2 #{@prop3}"
    .dict!

  # output {fakeprop : 'a fake value', fakeprop2: 'a fake value 2 hello'}

test-children = ->
  test = Generator.gen obj
    .children \prop4 ->
      @attributes \prop1, \prop3
    .dict!

  # output { prop4: [ { prop1: 1, prop3: 3 }, { prop1: 4, prop3: 6 } ] }

test-child = ->
  obj =
    prop1 : 1
    prop2 :
      subprop1 : 2
      subprop2 : 3
      subprop3 : 4
  test = Generator.gen obj
    .child \prop2, ->
      @attributes \subprop2 \subprop3
    .dict!

  # ouput {prop2 : {subprop2 : 3, subprop3 : 4}}


```

