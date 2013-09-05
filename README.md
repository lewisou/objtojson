objtojson
=========

Better way to stringify your object

Install
---------
```bash
npm install objtojson
```

Useage
---------

```livescript
g = new Generator {a: \b, b: \c}
g.attributes \a, \b 

# output {a: \b, b: \c}

g = new Generator a: \b, c: \d
g.node \fake, (sub_g) ->
  sub_g.val (obj) -> obj.c + 'fake'

# output {\fake : \dfake}

obj = \a : [1 2 3 4]
g = new Generator obj
g.children \a, (ele_g) ->
  ele_g.val (v) -> v * 2

# output {\a : [2, 4, 6, 8]}
```

