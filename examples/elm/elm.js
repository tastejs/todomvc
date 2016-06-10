var Elm = Elm || { Native: {} };
Elm.Array = Elm.Array || {};
Elm.Array.make = function (_elm) {
   "use strict";
   _elm.Array = _elm.Array || {};
   if (_elm.Array.values)
   return _elm.Array.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _P = _N.Ports.make(_elm),
   $moduleName = "Array",
   $Basics = Elm.Basics.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Native$Array = Elm.Native.Array.make(_elm);
   var append = $Native$Array.append;
   var length = $Native$Array.length;
   var slice = $Native$Array.slice;
   var set = $Native$Array.set;
   var get = F2(function (i,
   array) {
      return _U.cmp(0,
      i) < 1 && _U.cmp(i,
      $Native$Array.length(array)) < 0 ? $Maybe.Just(A2($Native$Array.get,
      i,
      array)) : $Maybe.Nothing;
   });
   var push = $Native$Array.push;
   var empty = $Native$Array.empty;
   var filter = F2(function (isOkay,
   arr) {
      return function () {
         var update = F2(function (x,
         xs) {
            return isOkay(x) ? A2($Native$Array.push,
            x,
            xs) : xs;
         });
         return A3($Native$Array.foldl,
         update,
         $Native$Array.empty,
         arr);
      }();
   });
   var foldr = $Native$Array.foldr;
   var foldl = $Native$Array.foldl;
   var indexedMap = $Native$Array.indexedMap;
   var map = $Native$Array.map;
   var toIndexedList = function (array) {
      return A3($List.map2,
      F2(function (v0,v1) {
         return {ctor: "_Tuple2"
                ,_0: v0
                ,_1: v1};
      }),
      _L.range(0,
      $Native$Array.length(array) - 1),
      $Native$Array.toList(array));
   };
   var toList = $Native$Array.toList;
   var fromList = $Native$Array.fromList;
   var initialize = $Native$Array.initialize;
   var repeat = F2(function (n,e) {
      return A2(initialize,
      n,
      $Basics.always(e));
   });
   var Array = {ctor: "Array"};
   _elm.Array.values = {_op: _op
                       ,Array: Array
                       ,initialize: initialize
                       ,repeat: repeat
                       ,fromList: fromList
                       ,toList: toList
                       ,toIndexedList: toIndexedList
                       ,map: map
                       ,indexedMap: indexedMap
                       ,foldl: foldl
                       ,foldr: foldr
                       ,filter: filter
                       ,empty: empty
                       ,push: push
                       ,get: get
                       ,set: set
                       ,slice: slice
                       ,length: length
                       ,append: append};
   return _elm.Array.values;
};
Elm.Basics = Elm.Basics || {};
Elm.Basics.make = function (_elm) {
   "use strict";
   _elm.Basics = _elm.Basics || {};
   if (_elm.Basics.values)
   return _elm.Basics.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _P = _N.Ports.make(_elm),
   $moduleName = "Basics",
   $Native$Basics = Elm.Native.Basics.make(_elm),
   $Native$Show = Elm.Native.Show.make(_elm),
   $Native$Utils = Elm.Native.Utils.make(_elm);
   var uncurry = F2(function (f,
   _v0) {
      return function () {
         switch (_v0.ctor)
         {case "_Tuple2": return A2(f,
              _v0._0,
              _v0._1);}
         _U.badCase($moduleName,
         "on line 458, column 19 to 24");
      }();
   });
   var curry = F3(function (f,
   a,
   b) {
      return f({ctor: "_Tuple2"
               ,_0: a
               ,_1: b});
   });
   var flip = F3(function (f,b,a) {
      return A2(f,a,b);
   });
   var snd = function (_v4) {
      return function () {
         switch (_v4.ctor)
         {case "_Tuple2": return _v4._1;}
         _U.badCase($moduleName,
         "on line 442, column 13 to 14");
      }();
   };
   var fst = function (_v8) {
      return function () {
         switch (_v8.ctor)
         {case "_Tuple2": return _v8._0;}
         _U.badCase($moduleName,
         "on line 438, column 13 to 14");
      }();
   };
   var always = F2(function (a,
   _v12) {
      return function () {
         return a;
      }();
   });
   var identity = function (x) {
      return x;
   };
   _op["<|"] = F2(function (f,x) {
      return f(x);
   });
   _op["|>"] = F2(function (x,f) {
      return f(x);
   });
   _op[">>"] = F3(function (f,
   g,
   x) {
      return g(f(x));
   });
   _op["<<"] = F3(function (g,
   f,
   x) {
      return g(f(x));
   });
   _op["++"] = $Native$Utils.append;
   var toString = $Native$Show.toString;
   var isInfinite = $Native$Basics.isInfinite;
   var isNaN = $Native$Basics.isNaN;
   var toFloat = $Native$Basics.toFloat;
   var ceiling = $Native$Basics.ceiling;
   var floor = $Native$Basics.floor;
   var truncate = $Native$Basics.truncate;
   var round = $Native$Basics.round;
   var otherwise = true;
   var not = $Native$Basics.not;
   var xor = $Native$Basics.xor;
   _op["||"] = $Native$Basics.or;
   _op["&&"] = $Native$Basics.and;
   var max = $Native$Basics.max;
   var min = $Native$Basics.min;
   var GT = {ctor: "GT"};
   var EQ = {ctor: "EQ"};
   var LT = {ctor: "LT"};
   var compare = $Native$Basics.compare;
   _op[">="] = $Native$Basics.ge;
   _op["<="] = $Native$Basics.le;
   _op[">"] = $Native$Basics.gt;
   _op["<"] = $Native$Basics.lt;
   _op["/="] = $Native$Basics.neq;
   _op["=="] = $Native$Basics.eq;
   var e = $Native$Basics.e;
   var pi = $Native$Basics.pi;
   var clamp = $Native$Basics.clamp;
   var logBase = $Native$Basics.logBase;
   var abs = $Native$Basics.abs;
   var negate = $Native$Basics.negate;
   var sqrt = $Native$Basics.sqrt;
   var atan2 = $Native$Basics.atan2;
   var atan = $Native$Basics.atan;
   var asin = $Native$Basics.asin;
   var acos = $Native$Basics.acos;
   var tan = $Native$Basics.tan;
   var sin = $Native$Basics.sin;
   var cos = $Native$Basics.cos;
   _op["^"] = $Native$Basics.exp;
   _op["%"] = $Native$Basics.mod;
   var rem = $Native$Basics.rem;
   _op["//"] = $Native$Basics.div;
   _op["/"] = $Native$Basics.floatDiv;
   _op["*"] = $Native$Basics.mul;
   _op["-"] = $Native$Basics.sub;
   _op["+"] = $Native$Basics.add;
   var toPolar = $Native$Basics.toPolar;
   var fromPolar = $Native$Basics.fromPolar;
   var turns = $Native$Basics.turns;
   var degrees = $Native$Basics.degrees;
   var radians = function (t) {
      return t;
   };
   _elm.Basics.values = {_op: _op
                        ,radians: radians
                        ,degrees: degrees
                        ,turns: turns
                        ,fromPolar: fromPolar
                        ,toPolar: toPolar
                        ,rem: rem
                        ,cos: cos
                        ,sin: sin
                        ,tan: tan
                        ,acos: acos
                        ,asin: asin
                        ,atan: atan
                        ,atan2: atan2
                        ,sqrt: sqrt
                        ,negate: negate
                        ,abs: abs
                        ,logBase: logBase
                        ,clamp: clamp
                        ,pi: pi
                        ,e: e
                        ,compare: compare
                        ,LT: LT
                        ,EQ: EQ
                        ,GT: GT
                        ,min: min
                        ,max: max
                        ,xor: xor
                        ,not: not
                        ,otherwise: otherwise
                        ,round: round
                        ,truncate: truncate
                        ,floor: floor
                        ,ceiling: ceiling
                        ,toFloat: toFloat
                        ,isNaN: isNaN
                        ,isInfinite: isInfinite
                        ,toString: toString
                        ,identity: identity
                        ,always: always
                        ,fst: fst
                        ,snd: snd
                        ,flip: flip
                        ,curry: curry
                        ,uncurry: uncurry};
   return _elm.Basics.values;
};
Elm.Char = Elm.Char || {};
Elm.Char.make = function (_elm) {
   "use strict";
   _elm.Char = _elm.Char || {};
   if (_elm.Char.values)
   return _elm.Char.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _P = _N.Ports.make(_elm),
   $moduleName = "Char",
   $Native$Char = Elm.Native.Char.make(_elm);
   var fromCode = $Native$Char.fromCode;
   var toCode = $Native$Char.toCode;
   var toLocaleLower = $Native$Char.toLocaleLower;
   var toLocaleUpper = $Native$Char.toLocaleUpper;
   var toLower = $Native$Char.toLower;
   var toUpper = $Native$Char.toUpper;
   var isHexDigit = $Native$Char.isHexDigit;
   var isOctDigit = $Native$Char.isOctDigit;
   var isDigit = $Native$Char.isDigit;
   var isLower = $Native$Char.isLower;
   var isUpper = $Native$Char.isUpper;
   _elm.Char.values = {_op: _op
                      ,isUpper: isUpper
                      ,isLower: isLower
                      ,isDigit: isDigit
                      ,isOctDigit: isOctDigit
                      ,isHexDigit: isHexDigit
                      ,toUpper: toUpper
                      ,toLower: toLower
                      ,toLocaleUpper: toLocaleUpper
                      ,toLocaleLower: toLocaleLower
                      ,toCode: toCode
                      ,fromCode: fromCode};
   return _elm.Char.values;
};
Elm.Color = Elm.Color || {};
Elm.Color.make = function (_elm) {
   "use strict";
   _elm.Color = _elm.Color || {};
   if (_elm.Color.values)
   return _elm.Color.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _P = _N.Ports.make(_elm),
   $moduleName = "Color",
   $Basics = Elm.Basics.make(_elm);
   var Radial = F5(function (a,
   b,
   c,
   d,
   e) {
      return {ctor: "Radial"
             ,_0: a
             ,_1: b
             ,_2: c
             ,_3: d
             ,_4: e};
   });
   var radial = Radial;
   var Linear = F3(function (a,
   b,
   c) {
      return {ctor: "Linear"
             ,_0: a
             ,_1: b
             ,_2: c};
   });
   var linear = Linear;
   var fmod = F2(function (f,n) {
      return function () {
         var integer = $Basics.floor(f);
         return $Basics.toFloat(A2($Basics._op["%"],
         integer,
         n)) + f - $Basics.toFloat(integer);
      }();
   });
   var rgbToHsl = F3(function (red,
   green,
   blue) {
      return function () {
         var b = $Basics.toFloat(blue) / 255;
         var g = $Basics.toFloat(green) / 255;
         var r = $Basics.toFloat(red) / 255;
         var cMax = A2($Basics.max,
         A2($Basics.max,r,g),
         b);
         var cMin = A2($Basics.min,
         A2($Basics.min,r,g),
         b);
         var c = cMax - cMin;
         var lightness = (cMax + cMin) / 2;
         var saturation = _U.eq(lightness,
         0) ? 0 : c / (1 - $Basics.abs(2 * lightness - 1));
         var hue = $Basics.degrees(60) * (_U.eq(cMax,
         r) ? A2(fmod,
         (g - b) / c,
         6) : _U.eq(cMax,
         g) ? (b - r) / c + 2 : _U.eq(cMax,
         b) ? (r - g) / c + 4 : _U.badIf($moduleName,
         "between lines 141 and 143"));
         return {ctor: "_Tuple3"
                ,_0: hue
                ,_1: saturation
                ,_2: lightness};
      }();
   });
   var hslToRgb = F3(function (hue,
   saturation,
   lightness) {
      return function () {
         var hue$ = hue / $Basics.degrees(60);
         var chroma = (1 - $Basics.abs(2 * lightness - 1)) * saturation;
         var x = chroma * (1 - $Basics.abs(A2(fmod,
         hue$,
         2) - 1));
         var $ = _U.cmp(hue$,
         0) < 0 ? {ctor: "_Tuple3"
                  ,_0: 0
                  ,_1: 0
                  ,_2: 0} : _U.cmp(hue$,
         1) < 0 ? {ctor: "_Tuple3"
                  ,_0: chroma
                  ,_1: x
                  ,_2: 0} : _U.cmp(hue$,
         2) < 0 ? {ctor: "_Tuple3"
                  ,_0: x
                  ,_1: chroma
                  ,_2: 0} : _U.cmp(hue$,
         3) < 0 ? {ctor: "_Tuple3"
                  ,_0: 0
                  ,_1: chroma
                  ,_2: x} : _U.cmp(hue$,
         4) < 0 ? {ctor: "_Tuple3"
                  ,_0: 0
                  ,_1: x
                  ,_2: chroma} : _U.cmp(hue$,
         5) < 0 ? {ctor: "_Tuple3"
                  ,_0: x
                  ,_1: 0
                  ,_2: chroma} : _U.cmp(hue$,
         6) < 0 ? {ctor: "_Tuple3"
                  ,_0: chroma
                  ,_1: 0
                  ,_2: x} : {ctor: "_Tuple3"
                            ,_0: 0
                            ,_1: 0
                            ,_2: 0},
         r = $._0,
         g = $._1,
         b = $._2;
         var m = lightness - chroma / 2;
         return {ctor: "_Tuple3"
                ,_0: r + m
                ,_1: g + m
                ,_2: b + m};
      }();
   });
   var toRgb = function (color) {
      return function () {
         switch (color.ctor)
         {case "HSLA":
            return function () {
                 var $ = A3(hslToRgb,
                 color._0,
                 color._1,
                 color._2),
                 r = $._0,
                 g = $._1,
                 b = $._2;
                 return {_: {}
                        ,alpha: color._3
                        ,blue: $Basics.round(255 * b)
                        ,green: $Basics.round(255 * g)
                        ,red: $Basics.round(255 * r)};
              }();
            case "RGBA": return {_: {}
                                ,alpha: color._3
                                ,blue: color._2
                                ,green: color._1
                                ,red: color._0};}
         _U.badCase($moduleName,
         "between lines 115 and 123");
      }();
   };
   var toHsl = function (color) {
      return function () {
         switch (color.ctor)
         {case "HSLA": return {_: {}
                              ,alpha: color._3
                              ,hue: color._0
                              ,lightness: color._2
                              ,saturation: color._1};
            case "RGBA":
            return function () {
                 var $ = A3(rgbToHsl,
                 color._0,
                 color._1,
                 color._2),
                 h = $._0,
                 s = $._1,
                 l = $._2;
                 return {_: {}
                        ,alpha: color._3
                        ,hue: h
                        ,lightness: l
                        ,saturation: s};
              }();}
         _U.badCase($moduleName,
         "between lines 105 and 112");
      }();
   };
   var HSLA = F4(function (a,
   b,
   c,
   d) {
      return {ctor: "HSLA"
             ,_0: a
             ,_1: b
             ,_2: c
             ,_3: d};
   });
   var hsla = F4(function (hue,
   saturation,
   lightness,
   alpha) {
      return A4(HSLA,
      hue - $Basics.turns($Basics.toFloat($Basics.floor(hue / (2 * $Basics.pi)))),
      saturation,
      lightness,
      alpha);
   });
   var hsl = F3(function (hue,
   saturation,
   lightness) {
      return A4(hsla,
      hue,
      saturation,
      lightness,
      1);
   });
   var complement = function (color) {
      return function () {
         switch (color.ctor)
         {case "HSLA": return A4(hsla,
              color._0 + $Basics.degrees(180),
              color._1,
              color._2,
              color._3);
            case "RGBA":
            return function () {
                 var $ = A3(rgbToHsl,
                 color._0,
                 color._1,
                 color._2),
                 h = $._0,
                 s = $._1,
                 l = $._2;
                 return A4(hsla,
                 h + $Basics.degrees(180),
                 s,
                 l,
                 color._3);
              }();}
         _U.badCase($moduleName,
         "between lines 96 and 102");
      }();
   };
   var grayscale = function (p) {
      return A4(HSLA,0,0,1 - p,1);
   };
   var greyscale = function (p) {
      return A4(HSLA,0,0,1 - p,1);
   };
   var RGBA = F4(function (a,
   b,
   c,
   d) {
      return {ctor: "RGBA"
             ,_0: a
             ,_1: b
             ,_2: c
             ,_3: d};
   });
   var rgba = RGBA;
   var rgb = F3(function (r,g,b) {
      return A4(RGBA,r,g,b,1);
   });
   var lightRed = A4(RGBA,
   239,
   41,
   41,
   1);
   var red = A4(RGBA,204,0,0,1);
   var darkRed = A4(RGBA,
   164,
   0,
   0,
   1);
   var lightOrange = A4(RGBA,
   252,
   175,
   62,
   1);
   var orange = A4(RGBA,
   245,
   121,
   0,
   1);
   var darkOrange = A4(RGBA,
   206,
   92,
   0,
   1);
   var lightYellow = A4(RGBA,
   255,
   233,
   79,
   1);
   var yellow = A4(RGBA,
   237,
   212,
   0,
   1);
   var darkYellow = A4(RGBA,
   196,
   160,
   0,
   1);
   var lightGreen = A4(RGBA,
   138,
   226,
   52,
   1);
   var green = A4(RGBA,
   115,
   210,
   22,
   1);
   var darkGreen = A4(RGBA,
   78,
   154,
   6,
   1);
   var lightBlue = A4(RGBA,
   114,
   159,
   207,
   1);
   var blue = A4(RGBA,
   52,
   101,
   164,
   1);
   var darkBlue = A4(RGBA,
   32,
   74,
   135,
   1);
   var lightPurple = A4(RGBA,
   173,
   127,
   168,
   1);
   var purple = A4(RGBA,
   117,
   80,
   123,
   1);
   var darkPurple = A4(RGBA,
   92,
   53,
   102,
   1);
   var lightBrown = A4(RGBA,
   233,
   185,
   110,
   1);
   var brown = A4(RGBA,
   193,
   125,
   17,
   1);
   var darkBrown = A4(RGBA,
   143,
   89,
   2,
   1);
   var black = A4(RGBA,0,0,0,1);
   var white = A4(RGBA,
   255,
   255,
   255,
   1);
   var lightGrey = A4(RGBA,
   238,
   238,
   236,
   1);
   var grey = A4(RGBA,
   211,
   215,
   207,
   1);
   var darkGrey = A4(RGBA,
   186,
   189,
   182,
   1);
   var lightGray = A4(RGBA,
   238,
   238,
   236,
   1);
   var gray = A4(RGBA,
   211,
   215,
   207,
   1);
   var darkGray = A4(RGBA,
   186,
   189,
   182,
   1);
   var lightCharcoal = A4(RGBA,
   136,
   138,
   133,
   1);
   var charcoal = A4(RGBA,
   85,
   87,
   83,
   1);
   var darkCharcoal = A4(RGBA,
   46,
   52,
   54,
   1);
   _elm.Color.values = {_op: _op
                       ,RGBA: RGBA
                       ,HSLA: HSLA
                       ,rgba: rgba
                       ,rgb: rgb
                       ,hsla: hsla
                       ,hsl: hsl
                       ,grayscale: grayscale
                       ,greyscale: greyscale
                       ,complement: complement
                       ,toHsl: toHsl
                       ,toRgb: toRgb
                       ,fmod: fmod
                       ,rgbToHsl: rgbToHsl
                       ,hslToRgb: hslToRgb
                       ,Linear: Linear
                       ,Radial: Radial
                       ,linear: linear
                       ,radial: radial
                       ,lightRed: lightRed
                       ,red: red
                       ,darkRed: darkRed
                       ,lightOrange: lightOrange
                       ,orange: orange
                       ,darkOrange: darkOrange
                       ,lightYellow: lightYellow
                       ,yellow: yellow
                       ,darkYellow: darkYellow
                       ,lightGreen: lightGreen
                       ,green: green
                       ,darkGreen: darkGreen
                       ,lightBlue: lightBlue
                       ,blue: blue
                       ,darkBlue: darkBlue
                       ,lightPurple: lightPurple
                       ,purple: purple
                       ,darkPurple: darkPurple
                       ,lightBrown: lightBrown
                       ,brown: brown
                       ,darkBrown: darkBrown
                       ,black: black
                       ,white: white
                       ,lightGrey: lightGrey
                       ,grey: grey
                       ,darkGrey: darkGrey
                       ,lightGray: lightGray
                       ,gray: gray
                       ,darkGray: darkGray
                       ,lightCharcoal: lightCharcoal
                       ,charcoal: charcoal
                       ,darkCharcoal: darkCharcoal};
   return _elm.Color.values;
};
Elm.Dict = Elm.Dict || {};
Elm.Dict.make = function (_elm) {
   "use strict";
   _elm.Dict = _elm.Dict || {};
   if (_elm.Dict.values)
   return _elm.Dict.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _P = _N.Ports.make(_elm),
   $moduleName = "Dict",
   $Basics = Elm.Basics.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Native$Debug = Elm.Native.Debug.make(_elm),
   $String = Elm.String.make(_elm);
   var foldr = F3(function (f,
   acc,
   t) {
      return function () {
         switch (t.ctor)
         {case "RBEmpty":
            switch (t._0.ctor)
              {case "LBlack": return acc;}
              break;
            case "RBNode": return A3(foldr,
              f,
              A3(f,
              t._1,
              t._2,
              A3(foldr,f,acc,t._4)),
              t._3);}
         _U.badCase($moduleName,
         "between lines 410 and 418");
      }();
   });
   var keys = function (dict) {
      return A3(foldr,
      F3(function (key,
      value,
      keyList) {
         return A2($List._op["::"],
         key,
         keyList);
      }),
      _L.fromArray([]),
      dict);
   };
   var values = function (dict) {
      return A3(foldr,
      F3(function (key,
      value,
      valueList) {
         return A2($List._op["::"],
         value,
         valueList);
      }),
      _L.fromArray([]),
      dict);
   };
   var toList = function (dict) {
      return A3(foldr,
      F3(function (key,value,list) {
         return A2($List._op["::"],
         {ctor: "_Tuple2"
         ,_0: key
         ,_1: value},
         list);
      }),
      _L.fromArray([]),
      dict);
   };
   var foldl = F3(function (f,
   acc,
   dict) {
      return function () {
         switch (dict.ctor)
         {case "RBEmpty":
            switch (dict._0.ctor)
              {case "LBlack": return acc;}
              break;
            case "RBNode": return A3(foldl,
              f,
              A3(f,
              dict._1,
              dict._2,
              A3(foldl,f,acc,dict._3)),
              dict._4);}
         _U.badCase($moduleName,
         "between lines 399 and 407");
      }();
   });
   var isBBlack = function (dict) {
      return function () {
         switch (dict.ctor)
         {case "RBEmpty":
            switch (dict._0.ctor)
              {case "LBBlack": return true;}
              break;
            case "RBNode":
            switch (dict._0.ctor)
              {case "BBlack": return true;}
              break;}
         return false;
      }();
   };
   var showFlag = function (f) {
      return function () {
         switch (f.ctor)
         {case "Insert": return "Insert";
            case "Remove": return "Remove";
            case "Same": return "Same";}
         _U.badCase($moduleName,
         "between lines 175 and 181");
      }();
   };
   var Same = {ctor: "Same"};
   var Remove = {ctor: "Remove"};
   var Insert = {ctor: "Insert"};
   var get = F2(function (targetKey,
   dict) {
      return function () {
         switch (dict.ctor)
         {case "RBEmpty":
            switch (dict._0.ctor)
              {case "LBlack":
                 return $Maybe.Nothing;}
              break;
            case "RBNode":
            return function () {
                 var _v29 = A2($Basics.compare,
                 targetKey,
                 dict._1);
                 switch (_v29.ctor)
                 {case "EQ":
                    return $Maybe.Just(dict._2);
                    case "GT": return A2(get,
                      targetKey,
                      dict._4);
                    case "LT": return A2(get,
                      targetKey,
                      dict._3);}
                 _U.badCase($moduleName,
                 "between lines 131 and 137");
              }();}
         _U.badCase($moduleName,
         "between lines 126 and 137");
      }();
   });
   var member = F2(function (key,
   dict) {
      return function () {
         var _v30 = A2(get,key,dict);
         switch (_v30.ctor)
         {case "Just": return true;
            case "Nothing": return false;}
         _U.badCase($moduleName,
         "between lines 140 and 142");
      }();
   });
   var max = function (dict) {
      return function () {
         switch (dict.ctor)
         {case "RBEmpty":
            return $Native$Debug.crash("(max Empty) is not defined");
            case "RBNode":
            switch (dict._4.ctor)
              {case "RBEmpty":
                 return {ctor: "_Tuple2"
                        ,_0: dict._1
                        ,_1: dict._2};}
              return max(dict._4);}
         _U.badCase($moduleName,
         "between lines 100 and 123");
      }();
   };
   var min = function (dict) {
      return function () {
         switch (dict.ctor)
         {case "RBEmpty":
            switch (dict._0.ctor)
              {case "LBlack":
                 return $Native$Debug.crash("(min Empty) is not defined");}
              break;
            case "RBNode":
            switch (dict._3.ctor)
              {case "RBEmpty":
                 switch (dict._3._0.ctor)
                   {case "LBlack":
                      return {ctor: "_Tuple2"
                             ,_0: dict._1
                             ,_1: dict._2};}
                   break;}
              return min(dict._3);}
         _U.badCase($moduleName,
         "between lines 87 and 95");
      }();
   };
   var RBEmpty = function (a) {
      return {ctor: "RBEmpty"
             ,_0: a};
   };
   var RBNode = F5(function (a,
   b,
   c,
   d,
   e) {
      return {ctor: "RBNode"
             ,_0: a
             ,_1: b
             ,_2: c
             ,_3: d
             ,_4: e};
   });
   var showLColor = function (color) {
      return function () {
         switch (color.ctor)
         {case "LBBlack":
            return "LBBlack";
            case "LBlack": return "LBlack";}
         _U.badCase($moduleName,
         "between lines 70 and 72");
      }();
   };
   var LBBlack = {ctor: "LBBlack"};
   var LBlack = {ctor: "LBlack"};
   var empty = RBEmpty(LBlack);
   var map = F2(function (f,dict) {
      return function () {
         switch (dict.ctor)
         {case "RBEmpty":
            switch (dict._0.ctor)
              {case "LBlack":
                 return RBEmpty(LBlack);}
              break;
            case "RBNode": return A5(RBNode,
              dict._0,
              dict._1,
              A2(f,dict._1,dict._2),
              A2(map,f,dict._3),
              A2(map,f,dict._4));}
         _U.badCase($moduleName,
         "between lines 387 and 396");
      }();
   });
   var showNColor = function (c) {
      return function () {
         switch (c.ctor)
         {case "BBlack": return "BBlack";
            case "Black": return "Black";
            case "NBlack": return "NBlack";
            case "Red": return "Red";}
         _U.badCase($moduleName,
         "between lines 56 and 60");
      }();
   };
   var reportRemBug = F4(function (msg,
   c,
   lgot,
   rgot) {
      return $Native$Debug.crash($String.concat(_L.fromArray(["Internal red-black tree invariant violated, expected "
                                                             ,msg
                                                             ," and got "
                                                             ,showNColor(c)
                                                             ,"/"
                                                             ,lgot
                                                             ,"/"
                                                             ,rgot
                                                             ,"\nPlease report this bug to <https://github.com/elm-lang/Elm/issues>"])));
   });
   var NBlack = {ctor: "NBlack"};
   var BBlack = {ctor: "BBlack"};
   var Black = {ctor: "Black"};
   var ensureBlackRoot = function (dict) {
      return function () {
         switch (dict.ctor)
         {case "RBEmpty":
            switch (dict._0.ctor)
              {case "LBlack": return dict;}
              break;
            case "RBNode":
            switch (dict._0.ctor)
              {case "Black": return dict;
                 case "Red": return A5(RBNode,
                   Black,
                   dict._1,
                   dict._2,
                   dict._3,
                   dict._4);}
              break;}
         _U.badCase($moduleName,
         "between lines 147 and 159");
      }();
   };
   var blackish = function (t) {
      return function () {
         switch (t.ctor)
         {case "RBEmpty": return true;
            case "RBNode":
            return _U.eq(t._0,
              Black) || _U.eq(t._0,BBlack);}
         _U.badCase($moduleName,
         "between lines 332 and 334");
      }();
   };
   var blacken = function (t) {
      return function () {
         switch (t.ctor)
         {case "RBEmpty":
            return RBEmpty(LBlack);
            case "RBNode": return A5(RBNode,
              Black,
              t._1,
              t._2,
              t._3,
              t._4);}
         _U.badCase($moduleName,
         "between lines 371 and 373");
      }();
   };
   var Red = {ctor: "Red"};
   var moreBlack = function (color) {
      return function () {
         switch (color.ctor)
         {case "BBlack":
            return $Native$Debug.crash("Can\'t make a double black node more black!");
            case "Black": return BBlack;
            case "NBlack": return Red;
            case "Red": return Black;}
         _U.badCase($moduleName,
         "between lines 237 and 241");
      }();
   };
   var lessBlack = function (color) {
      return function () {
         switch (color.ctor)
         {case "BBlack": return Black;
            case "Black": return Red;
            case "NBlack":
            return $Native$Debug.crash("Can\'t make a negative black node less black!");
            case "Red": return NBlack;}
         _U.badCase($moduleName,
         "between lines 246 and 250");
      }();
   };
   var lessBlackTree = function (dict) {
      return function () {
         switch (dict.ctor)
         {case "RBEmpty":
            switch (dict._0.ctor)
              {case "LBBlack":
                 return RBEmpty(LBlack);}
              break;
            case "RBNode": return A5(RBNode,
              lessBlack(dict._0),
              dict._1,
              dict._2,
              dict._3,
              dict._4);}
         _U.badCase($moduleName,
         "between lines 255 and 257");
      }();
   };
   var redden = function (t) {
      return function () {
         switch (t.ctor)
         {case "RBEmpty":
            return $Native$Debug.crash("can\'t make a Leaf red");
            case "RBNode": return A5(RBNode,
              Red,
              t._1,
              t._2,
              t._3,
              t._4);}
         _U.badCase($moduleName,
         "between lines 379 and 384");
      }();
   };
   var balance_node = function (t) {
      return function () {
         var assemble = function (col) {
            return function (xk) {
               return function (xv) {
                  return function (yk) {
                     return function (yv) {
                        return function (zk) {
                           return function (zv) {
                              return function (a) {
                                 return function (b) {
                                    return function (c) {
                                       return function (d) {
                                          return A5(RBNode,
                                          lessBlack(col),
                                          yk,
                                          yv,
                                          A5(RBNode,Black,xk,xv,a,b),
                                          A5(RBNode,Black,zk,zv,c,d));
                                       };
                                    };
                                 };
                              };
                           };
                        };
                     };
                  };
               };
            };
         };
         return blackish(t) ? function () {
            switch (t.ctor)
            {case "RBNode":
               switch (t._3.ctor)
                 {case "RBNode":
                    switch (t._3._0.ctor)
                      {case "Red":
                         switch (t._3._3.ctor)
                           {case "RBNode":
                              switch (t._3._3._0.ctor)
                                {case "Red":
                                   return assemble(t._0)(t._3._3._1)(t._3._3._2)(t._3._1)(t._3._2)(t._1)(t._2)(t._3._3._3)(t._3._3._4)(t._3._4)(t._4);}
                                break;}
                           switch (t._3._4.ctor)
                           {case "RBNode":
                              switch (t._3._4._0.ctor)
                                {case "Red":
                                   return assemble(t._0)(t._3._1)(t._3._2)(t._3._4._1)(t._3._4._2)(t._1)(t._2)(t._3._3)(t._3._4._3)(t._3._4._4)(t._4);}
                                break;}
                           break;}
                      break;}
                 switch (t._4.ctor)
                 {case "RBNode":
                    switch (t._4._0.ctor)
                      {case "Red":
                         switch (t._4._3.ctor)
                           {case "RBNode":
                              switch (t._4._3._0.ctor)
                                {case "Red":
                                   return assemble(t._0)(t._1)(t._2)(t._4._3._1)(t._4._3._2)(t._4._1)(t._4._2)(t._3)(t._4._3._3)(t._4._3._4)(t._4._4);}
                                break;}
                           switch (t._4._4.ctor)
                           {case "RBNode":
                              switch (t._4._4._0.ctor)
                                {case "Red":
                                   return assemble(t._0)(t._1)(t._2)(t._4._1)(t._4._2)(t._4._4._1)(t._4._4._2)(t._3)(t._4._3)(t._4._4._3)(t._4._4._4);}
                                break;}
                           break;}
                      break;}
                 switch (t._0.ctor)
                 {case "BBlack":
                    switch (t._4.ctor)
                      {case "RBNode":
                         switch (t._4._0.ctor)
                           {case "NBlack":
                              switch (t._4._3.ctor)
                                {case "RBNode":
                                   switch (t._4._3._0.ctor)
                                     {case "Black":
                                        return function () {
                                             switch (t._4._4.ctor)
                                             {case "RBNode":
                                                switch (t._4._4._0.ctor)
                                                  {case "Black":
                                                     return A5(RBNode,
                                                       Black,
                                                       t._4._3._1,
                                                       t._4._3._2,
                                                       A5(RBNode,
                                                       Black,
                                                       t._1,
                                                       t._2,
                                                       t._3,
                                                       t._4._3._3),
                                                       A5(balance,
                                                       Black,
                                                       t._4._1,
                                                       t._4._2,
                                                       t._4._3._4,
                                                       redden(t._4._4)));}
                                                  break;}
                                             return t;
                                          }();}
                                     break;}
                                break;}
                           break;}
                      switch (t._3.ctor)
                      {case "RBNode":
                         switch (t._3._0.ctor)
                           {case "NBlack":
                              switch (t._3._4.ctor)
                                {case "RBNode":
                                   switch (t._3._4._0.ctor)
                                     {case "Black":
                                        return function () {
                                             switch (t._3._3.ctor)
                                             {case "RBNode":
                                                switch (t._3._3._0.ctor)
                                                  {case "Black":
                                                     return A5(RBNode,
                                                       Black,
                                                       t._3._4._1,
                                                       t._3._4._2,
                                                       A5(balance,
                                                       Black,
                                                       t._3._1,
                                                       t._3._2,
                                                       redden(t._3._3),
                                                       t._3._4._3),
                                                       A5(RBNode,
                                                       Black,
                                                       t._1,
                                                       t._2,
                                                       t._3._4._4,
                                                       t._4));}
                                                  break;}
                                             return t;
                                          }();}
                                     break;}
                                break;}
                           break;}
                      break;}
                 break;}
            return t;
         }() : t;
      }();
   };
   var balance = F5(function (c,
   k,
   v,
   l,
   r) {
      return balance_node(A5(RBNode,
      c,
      k,
      v,
      l,
      r));
   });
   var bubble = F5(function (c,
   k,
   v,
   l,
   r) {
      return isBBlack(l) || isBBlack(r) ? A5(balance,
      moreBlack(c),
      k,
      v,
      lessBlackTree(l),
      lessBlackTree(r)) : A5(RBNode,
      c,
      k,
      v,
      l,
      r);
   });
   var remove_max = F5(function (c,
   k,
   v,
   l,
   r) {
      return function () {
         switch (r.ctor)
         {case "RBEmpty": return A3(rem,
              c,
              l,
              r);
            case "RBNode": return A5(bubble,
              c,
              k,
              v,
              l,
              A5(remove_max,
              r._0,
              r._1,
              r._2,
              r._3,
              r._4));}
         _U.badCase($moduleName,
         "between lines 316 and 321");
      }();
   });
   var rem = F3(function (c,l,r) {
      return function () {
         var _v169 = {ctor: "_Tuple2"
                     ,_0: l
                     ,_1: r};
         switch (_v169.ctor)
         {case "_Tuple2":
            switch (_v169._0.ctor)
              {case "RBEmpty":
                 switch (_v169._1.ctor)
                   {case "RBEmpty":
                      return function () {
                           switch (c.ctor)
                           {case "Black":
                              return RBEmpty(LBBlack);
                              case "Red":
                              return RBEmpty(LBlack);}
                           _U.badCase($moduleName,
                           "between lines 275 and 279");
                        }();
                      case "RBNode":
                      return function () {
                           var _v191 = {ctor: "_Tuple3"
                                       ,_0: c
                                       ,_1: _v169._0._0
                                       ,_2: _v169._1._0};
                           switch (_v191.ctor)
                           {case "_Tuple3":
                              switch (_v191._0.ctor)
                                {case "Black":
                                   switch (_v191._1.ctor)
                                     {case "LBlack":
                                        switch (_v191._2.ctor)
                                          {case "Red": return A5(RBNode,
                                               Black,
                                               _v169._1._1,
                                               _v169._1._2,
                                               _v169._1._3,
                                               _v169._1._4);}
                                          break;}
                                     break;}
                                break;}
                           return A4(reportRemBug,
                           "Black/LBlack/Red",
                           c,
                           showLColor(_v169._0._0),
                           showNColor(_v169._1._0));
                        }();}
                   break;
                 case "RBNode":
                 switch (_v169._1.ctor)
                   {case "RBEmpty":
                      return function () {
                           var _v195 = {ctor: "_Tuple3"
                                       ,_0: c
                                       ,_1: _v169._0._0
                                       ,_2: _v169._1._0};
                           switch (_v195.ctor)
                           {case "_Tuple3":
                              switch (_v195._0.ctor)
                                {case "Black":
                                   switch (_v195._1.ctor)
                                     {case "Red":
                                        switch (_v195._2.ctor)
                                          {case "LBlack":
                                             return A5(RBNode,
                                               Black,
                                               _v169._0._1,
                                               _v169._0._2,
                                               _v169._0._3,
                                               _v169._0._4);}
                                          break;}
                                     break;}
                                break;}
                           return A4(reportRemBug,
                           "Black/Red/LBlack",
                           c,
                           showNColor(_v169._0._0),
                           showLColor(_v169._1._0));
                        }();
                      case "RBNode":
                      return function () {
                           var l$ = A5(remove_max,
                           _v169._0._0,
                           _v169._0._1,
                           _v169._0._2,
                           _v169._0._3,
                           _v169._0._4);
                           var r = A5(RBNode,
                           _v169._1._0,
                           _v169._1._1,
                           _v169._1._2,
                           _v169._1._3,
                           _v169._1._4);
                           var l = A5(RBNode,
                           _v169._0._0,
                           _v169._0._1,
                           _v169._0._2,
                           _v169._0._3,
                           _v169._0._4);
                           var $ = max(l),
                           k = $._0,
                           v = $._1;
                           return A5(bubble,c,k,v,l$,r);
                        }();}
                   break;}
              break;}
         _U.badCase($moduleName,
         "between lines 273 and 302");
      }();
   });
   var update = F3(function (k,
   alter,
   dict) {
      return function () {
         var up = function (dict) {
            return function () {
               switch (dict.ctor)
               {case "RBEmpty":
                  switch (dict._0.ctor)
                    {case "LBlack":
                       return function () {
                            var _v206 = alter($Maybe.Nothing);
                            switch (_v206.ctor)
                            {case "Just":
                               return {ctor: "_Tuple2"
                                      ,_0: Insert
                                      ,_1: A5(RBNode,
                                      Red,
                                      k,
                                      _v206._0,
                                      empty,
                                      empty)};
                               case "Nothing":
                               return {ctor: "_Tuple2"
                                      ,_0: Same
                                      ,_1: empty};}
                            _U.badCase($moduleName,
                            "between lines 187 and 191");
                         }();}
                    break;
                  case "RBNode":
                  return function () {
                       var _v208 = A2($Basics.compare,
                       k,
                       dict._1);
                       switch (_v208.ctor)
                       {case "EQ": return function () {
                               var _v209 = alter($Maybe.Just(dict._2));
                               switch (_v209.ctor)
                               {case "Just":
                                  return {ctor: "_Tuple2"
                                         ,_0: Same
                                         ,_1: A5(RBNode,
                                         dict._0,
                                         dict._1,
                                         _v209._0,
                                         dict._3,
                                         dict._4)};
                                  case "Nothing":
                                  return {ctor: "_Tuple2"
                                         ,_0: Remove
                                         ,_1: A3(rem,
                                         dict._0,
                                         dict._3,
                                         dict._4)};}
                               _U.badCase($moduleName,
                               "between lines 194 and 199");
                            }();
                          case "GT": return function () {
                               var $ = up(dict._4),
                               flag = $._0,
                               newRight = $._1;
                               return function () {
                                  switch (flag.ctor)
                                  {case "Insert":
                                     return {ctor: "_Tuple2"
                                            ,_0: Insert
                                            ,_1: A5(balance,
                                            dict._0,
                                            dict._1,
                                            dict._2,
                                            dict._3,
                                            newRight)};
                                     case "Remove":
                                     return {ctor: "_Tuple2"
                                            ,_0: Remove
                                            ,_1: A5(bubble,
                                            dict._0,
                                            dict._1,
                                            dict._2,
                                            dict._3,
                                            newRight)};
                                     case "Same":
                                     return {ctor: "_Tuple2"
                                            ,_0: Same
                                            ,_1: A5(RBNode,
                                            dict._0,
                                            dict._1,
                                            dict._2,
                                            dict._3,
                                            newRight)};}
                                  _U.badCase($moduleName,
                                  "between lines 208 and 213");
                               }();
                            }();
                          case "LT": return function () {
                               var $ = up(dict._3),
                               flag = $._0,
                               newLeft = $._1;
                               return function () {
                                  switch (flag.ctor)
                                  {case "Insert":
                                     return {ctor: "_Tuple2"
                                            ,_0: Insert
                                            ,_1: A5(balance,
                                            dict._0,
                                            dict._1,
                                            dict._2,
                                            newLeft,
                                            dict._4)};
                                     case "Remove":
                                     return {ctor: "_Tuple2"
                                            ,_0: Remove
                                            ,_1: A5(bubble,
                                            dict._0,
                                            dict._1,
                                            dict._2,
                                            newLeft,
                                            dict._4)};
                                     case "Same":
                                     return {ctor: "_Tuple2"
                                            ,_0: Same
                                            ,_1: A5(RBNode,
                                            dict._0,
                                            dict._1,
                                            dict._2,
                                            newLeft,
                                            dict._4)};}
                                  _U.badCase($moduleName,
                                  "between lines 201 and 206");
                               }();
                            }();}
                       _U.badCase($moduleName,
                       "between lines 192 and 213");
                    }();}
               _U.badCase($moduleName,
               "between lines 185 and 213");
            }();
         };
         var $ = up(dict),
         flag = $._0,
         updatedDict = $._1;
         return function () {
            switch (flag.ctor)
            {case "Insert":
               return ensureBlackRoot(updatedDict);
               case "Remove":
               return blacken(updatedDict);
               case "Same":
               return updatedDict;}
            _U.badCase($moduleName,
            "between lines 215 and 221");
         }();
      }();
   });
   var insert = F3(function (key,
   value,
   dict) {
      return A3(update,
      key,
      $Basics.always($Maybe.Just(value)),
      dict);
   });
   var singleton = F2(function (key,
   value) {
      return A3(insert,
      key,
      value,
      RBEmpty(LBlack));
   });
   var union = F2(function (t1,
   t2) {
      return A3(foldl,
      insert,
      t2,
      t1);
   });
   var fromList = function (assocs) {
      return A3($List.foldl,
      F2(function (_v214,dict) {
         return function () {
            switch (_v214.ctor)
            {case "_Tuple2":
               return A3(insert,
                 _v214._0,
                 _v214._1,
                 dict);}
            _U.badCase($moduleName,
            "on line 459, column 38 to 59");
         }();
      }),
      empty,
      assocs);
   };
   var filter = F2(function (predicate,
   dictionary) {
      return function () {
         var add = F3(function (key,
         value,
         dict) {
            return A2(predicate,
            key,
            value) ? A3(insert,
            key,
            value,
            dict) : dict;
         });
         return A3(foldl,
         add,
         empty,
         dictionary);
      }();
   });
   var intersect = F2(function (t1,
   t2) {
      return A2(filter,
      F2(function (k,_v218) {
         return function () {
            return A2(member,k,t2);
         }();
      }),
      t1);
   });
   var partition = F2(function (predicate,
   dict) {
      return function () {
         var add = F3(function (key,
         value,
         _v220) {
            return function () {
               switch (_v220.ctor)
               {case "_Tuple2":
                  return A2(predicate,
                    key,
                    value) ? {ctor: "_Tuple2"
                             ,_0: A3(insert,
                             key,
                             value,
                             _v220._0)
                             ,_1: _v220._1} : {ctor: "_Tuple2"
                                              ,_0: _v220._0
                                              ,_1: A3(insert,
                                              key,
                                              value,
                                              _v220._1)};}
               _U.badCase($moduleName,
               "between lines 480 and 482");
            }();
         });
         return A3(foldl,
         add,
         {ctor: "_Tuple2"
         ,_0: empty
         ,_1: empty},
         dict);
      }();
   });
   var remove = F2(function (key,
   dict) {
      return A3(update,
      key,
      $Basics.always($Maybe.Nothing),
      dict);
   });
   var diff = F2(function (t1,t2) {
      return A3(foldl,
      F3(function (k,v,t) {
         return A2(remove,k,t);
      }),
      t1,
      t2);
   });
   _elm.Dict.values = {_op: _op
                      ,empty: empty
                      ,singleton: singleton
                      ,insert: insert
                      ,update: update
                      ,get: get
                      ,remove: remove
                      ,member: member
                      ,filter: filter
                      ,partition: partition
                      ,foldl: foldl
                      ,foldr: foldr
                      ,map: map
                      ,union: union
                      ,intersect: intersect
                      ,diff: diff
                      ,keys: keys
                      ,values: values
                      ,toList: toList
                      ,fromList: fromList};
   return _elm.Dict.values;
};
Elm.Graphics = Elm.Graphics || {};
Elm.Graphics.Element = Elm.Graphics.Element || {};
Elm.Graphics.Element.make = function (_elm) {
   "use strict";
   _elm.Graphics = _elm.Graphics || {};
   _elm.Graphics.Element = _elm.Graphics.Element || {};
   if (_elm.Graphics.Element.values)
   return _elm.Graphics.Element.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _P = _N.Ports.make(_elm),
   $moduleName = "Graphics.Element",
   $Basics = Elm.Basics.make(_elm),
   $Color = Elm.Color.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Native$Graphics$Element = Elm.Native.Graphics.Element.make(_elm);
   var DOut = {ctor: "DOut"};
   var outward = DOut;
   var DIn = {ctor: "DIn"};
   var inward = DIn;
   var DRight = {ctor: "DRight"};
   var right = DRight;
   var DLeft = {ctor: "DLeft"};
   var left = DLeft;
   var DDown = {ctor: "DDown"};
   var down = DDown;
   var DUp = {ctor: "DUp"};
   var up = DUp;
   var Position = F4(function (a,
   b,
   c,
   d) {
      return {_: {}
             ,horizontal: a
             ,vertical: b
             ,x: c
             ,y: d};
   });
   var Relative = function (a) {
      return {ctor: "Relative"
             ,_0: a};
   };
   var relative = Relative;
   var Absolute = function (a) {
      return {ctor: "Absolute"
             ,_0: a};
   };
   var absolute = Absolute;
   var N = {ctor: "N"};
   var bottomLeftAt = F2(function (x,
   y) {
      return {_: {}
             ,horizontal: N
             ,vertical: N
             ,x: x
             ,y: y};
   });
   var Z = {ctor: "Z"};
   var middle = {_: {}
                ,horizontal: Z
                ,vertical: Z
                ,x: Relative(0.5)
                ,y: Relative(0.5)};
   var midLeft = _U.replace([["horizontal"
                             ,N]
                            ,["x",Absolute(0)]],
   middle);
   var middleAt = F2(function (x,
   y) {
      return {_: {}
             ,horizontal: Z
             ,vertical: Z
             ,x: x
             ,y: y};
   });
   var midLeftAt = F2(function (x,
   y) {
      return {_: {}
             ,horizontal: N
             ,vertical: Z
             ,x: x
             ,y: y};
   });
   var midBottomAt = F2(function (x,
   y) {
      return {_: {}
             ,horizontal: Z
             ,vertical: N
             ,x: x
             ,y: y};
   });
   var P = {ctor: "P"};
   var topLeft = {_: {}
                 ,horizontal: N
                 ,vertical: P
                 ,x: Absolute(0)
                 ,y: Absolute(0)};
   var bottomLeft = _U.replace([["vertical"
                                ,N]],
   topLeft);
   var topRight = _U.replace([["horizontal"
                              ,P]],
   topLeft);
   var bottomRight = _U.replace([["horizontal"
                                 ,P]],
   bottomLeft);
   var midRight = _U.replace([["horizontal"
                              ,P]],
   midLeft);
   var midTop = _U.replace([["vertical"
                            ,P]
                           ,["y",Absolute(0)]],
   middle);
   var midBottom = _U.replace([["vertical"
                               ,N]],
   midTop);
   var topLeftAt = F2(function (x,
   y) {
      return {_: {}
             ,horizontal: N
             ,vertical: P
             ,x: x
             ,y: y};
   });
   var topRightAt = F2(function (x,
   y) {
      return {_: {}
             ,horizontal: P
             ,vertical: P
             ,x: x
             ,y: y};
   });
   var bottomRightAt = F2(function (x,
   y) {
      return {_: {}
             ,horizontal: P
             ,vertical: N
             ,x: x
             ,y: y};
   });
   var midRightAt = F2(function (x,
   y) {
      return {_: {}
             ,horizontal: P
             ,vertical: Z
             ,x: x
             ,y: y};
   });
   var midTopAt = F2(function (x,
   y) {
      return {_: {}
             ,horizontal: Z
             ,vertical: P
             ,x: x
             ,y: y};
   });
   var Tiled = {ctor: "Tiled"};
   var Cropped = function (a) {
      return {ctor: "Cropped"
             ,_0: a};
   };
   var Fitted = {ctor: "Fitted"};
   var Plain = {ctor: "Plain"};
   var Custom = {ctor: "Custom"};
   var RawHtml = {ctor: "RawHtml"};
   var Spacer = {ctor: "Spacer"};
   var Flow = F2(function (a,b) {
      return {ctor: "Flow"
             ,_0: a
             ,_1: b};
   });
   var Container = F2(function (a,
   b) {
      return {ctor: "Container"
             ,_0: a
             ,_1: b};
   });
   var Image = F4(function (a,
   b,
   c,
   d) {
      return {ctor: "Image"
             ,_0: a
             ,_1: b
             ,_2: c
             ,_3: d};
   });
   var link = F2(function (href,
   e) {
      return function () {
         var p = e.props;
         return {_: {}
                ,element: e.element
                ,props: _U.replace([["href"
                                    ,href]],
                p)};
      }();
   });
   var tag = F2(function (name,e) {
      return function () {
         var p = e.props;
         return {_: {}
                ,element: e.element
                ,props: _U.replace([["tag"
                                    ,name]],
                p)};
      }();
   });
   var color = F2(function (c,e) {
      return function () {
         var p = e.props;
         return {_: {}
                ,element: e.element
                ,props: _U.replace([["color"
                                    ,$Maybe.Just(c)]],
                p)};
      }();
   });
   var opacity = F2(function (o,
   e) {
      return function () {
         var p = e.props;
         return {_: {}
                ,element: e.element
                ,props: _U.replace([["opacity"
                                    ,o]],
                p)};
      }();
   });
   var height = F2(function (nh,
   e) {
      return function () {
         var p = e.props;
         var props = function () {
            var _v0 = e.element;
            switch (_v0.ctor)
            {case "Image":
               return _U.replace([["width"
                                  ,$Basics.round($Basics.toFloat(_v0._1) / $Basics.toFloat(_v0._2) * $Basics.toFloat(nh))]],
                 p);}
            return p;
         }();
         return {_: {}
                ,element: e.element
                ,props: _U.replace([["height"
                                    ,nh]],
                p)};
      }();
   });
   var width = F2(function (nw,e) {
      return function () {
         var p = e.props;
         var props = function () {
            var _v5 = e.element;
            switch (_v5.ctor)
            {case "Image":
               return _U.replace([["height"
                                  ,$Basics.round($Basics.toFloat(_v5._2) / $Basics.toFloat(_v5._1) * $Basics.toFloat(nw))]],
                 p);
               case "RawHtml":
               return _U.replace([["height"
                                  ,$Basics.snd(A2($Native$Graphics$Element.htmlHeight,
                                  nw,
                                  e.element))]],
                 p);}
            return p;
         }();
         return {_: {}
                ,element: e.element
                ,props: _U.replace([["width"
                                    ,nw]],
                props)};
      }();
   });
   var size = F3(function (w,h,e) {
      return A2(height,
      h,
      A2(width,w,e));
   });
   var sizeOf = function (e) {
      return {ctor: "_Tuple2"
             ,_0: e.props.width
             ,_1: e.props.height};
   };
   var heightOf = function (e) {
      return e.props.height;
   };
   var widthOf = function (e) {
      return e.props.width;
   };
   var Element = F2(function (a,
   b) {
      return {_: {}
             ,element: b
             ,props: a};
   });
   var Properties = F9(function (a,
   b,
   c,
   d,
   e,
   f,
   g,
   h,
   i) {
      return {_: {}
             ,click: i
             ,color: e
             ,height: c
             ,hover: h
             ,href: f
             ,id: a
             ,opacity: d
             ,tag: g
             ,width: b};
   });
   var newElement = F3(function (w,
   h,
   e) {
      return {_: {}
             ,element: e
             ,props: A9(Properties,
             $Native$Graphics$Element.guid({ctor: "_Tuple0"}),
             w,
             h,
             1,
             $Maybe.Nothing,
             "",
             "",
             {ctor: "_Tuple0"},
             {ctor: "_Tuple0"})};
   });
   var image = F3(function (w,
   h,
   src) {
      return A3(newElement,
      w,
      h,
      A4(Image,Plain,w,h,src));
   });
   var fittedImage = F3(function (w,
   h,
   src) {
      return A3(newElement,
      w,
      h,
      A4(Image,Fitted,w,h,src));
   });
   var croppedImage = F4(function (pos,
   w,
   h,
   src) {
      return A3(newElement,
      w,
      h,
      A4(Image,Cropped(pos),w,h,src));
   });
   var tiledImage = F3(function (w,
   h,
   src) {
      return A3(newElement,
      w,
      h,
      A4(Image,Tiled,w,h,src));
   });
   var container = F4(function (w,
   h,
   pos,
   e) {
      return A3(newElement,
      w,
      h,
      A2(Container,pos,e));
   });
   var spacer = F2(function (w,h) {
      return A3(newElement,
      w,
      h,
      Spacer);
   });
   var empty = A2(spacer,0,0);
   var flow = F2(function (dir,
   es) {
      return function () {
         var newFlow = F2(function (w,
         h) {
            return A3(newElement,
            w,
            h,
            A2(Flow,dir,es));
         });
         var hs = A2($List.map,
         heightOf,
         es);
         var ws = A2($List.map,
         widthOf,
         es);
         return _U.eq(es,
         _L.fromArray([])) ? empty : function () {
            switch (dir.ctor)
            {case "DDown":
               return A2(newFlow,
                 $List.maximum(ws),
                 $List.sum(hs));
               case "DIn": return A2(newFlow,
                 $List.maximum(ws),
                 $List.maximum(hs));
               case "DLeft": return A2(newFlow,
                 $List.sum(ws),
                 $List.maximum(hs));
               case "DOut": return A2(newFlow,
                 $List.maximum(ws),
                 $List.maximum(hs));
               case "DRight":
               return A2(newFlow,
                 $List.sum(ws),
                 $List.maximum(hs));
               case "DUp": return A2(newFlow,
                 $List.maximum(ws),
                 $List.sum(hs));}
            _U.badCase($moduleName,
            "between lines 280 and 291");
         }();
      }();
   });
   var above = F2(function (hi,
   lo) {
      return A3(newElement,
      A2($Basics.max,
      widthOf(hi),
      widthOf(lo)),
      heightOf(hi) + heightOf(lo),
      A2(Flow,
      DDown,
      _L.fromArray([hi,lo])));
   });
   var below = F2(function (lo,
   hi) {
      return A3(newElement,
      A2($Basics.max,
      widthOf(hi),
      widthOf(lo)),
      heightOf(hi) + heightOf(lo),
      A2(Flow,
      DDown,
      _L.fromArray([hi,lo])));
   });
   var beside = F2(function (lft,
   rht) {
      return A3(newElement,
      widthOf(lft) + widthOf(rht),
      A2($Basics.max,
      heightOf(lft),
      heightOf(rht)),
      A2(Flow,
      right,
      _L.fromArray([lft,rht])));
   });
   var layers = function (es) {
      return function () {
         var hs = A2($List.map,
         heightOf,
         es);
         var ws = A2($List.map,
         widthOf,
         es);
         return A3(newElement,
         $List.maximum(ws),
         $List.maximum(hs),
         A2(Flow,DOut,es));
      }();
   };
   _elm.Graphics.Element.values = {_op: _op
                                  ,Properties: Properties
                                  ,Element: Element
                                  ,empty: empty
                                  ,widthOf: widthOf
                                  ,heightOf: heightOf
                                  ,sizeOf: sizeOf
                                  ,width: width
                                  ,height: height
                                  ,size: size
                                  ,opacity: opacity
                                  ,color: color
                                  ,tag: tag
                                  ,link: link
                                  ,newElement: newElement
                                  ,Image: Image
                                  ,Container: Container
                                  ,Flow: Flow
                                  ,Spacer: Spacer
                                  ,RawHtml: RawHtml
                                  ,Custom: Custom
                                  ,Plain: Plain
                                  ,Fitted: Fitted
                                  ,Cropped: Cropped
                                  ,Tiled: Tiled
                                  ,image: image
                                  ,fittedImage: fittedImage
                                  ,croppedImage: croppedImage
                                  ,tiledImage: tiledImage
                                  ,P: P
                                  ,Z: Z
                                  ,N: N
                                  ,Absolute: Absolute
                                  ,Relative: Relative
                                  ,Position: Position
                                  ,container: container
                                  ,spacer: spacer
                                  ,DUp: DUp
                                  ,DDown: DDown
                                  ,DLeft: DLeft
                                  ,DRight: DRight
                                  ,DIn: DIn
                                  ,DOut: DOut
                                  ,flow: flow
                                  ,above: above
                                  ,below: below
                                  ,beside: beside
                                  ,layers: layers
                                  ,absolute: absolute
                                  ,relative: relative
                                  ,middle: middle
                                  ,topLeft: topLeft
                                  ,topRight: topRight
                                  ,bottomLeft: bottomLeft
                                  ,bottomRight: bottomRight
                                  ,midLeft: midLeft
                                  ,midRight: midRight
                                  ,midTop: midTop
                                  ,midBottom: midBottom
                                  ,middleAt: middleAt
                                  ,topLeftAt: topLeftAt
                                  ,topRightAt: topRightAt
                                  ,bottomLeftAt: bottomLeftAt
                                  ,bottomRightAt: bottomRightAt
                                  ,midLeftAt: midLeftAt
                                  ,midRightAt: midRightAt
                                  ,midTopAt: midTopAt
                                  ,midBottomAt: midBottomAt
                                  ,up: up
                                  ,down: down
                                  ,left: left
                                  ,right: right
                                  ,inward: inward
                                  ,outward: outward};
   return _elm.Graphics.Element.values;
};
Elm.Html = Elm.Html || {};
Elm.Html.make = function (_elm) {
   "use strict";
   _elm.Html = _elm.Html || {};
   if (_elm.Html.values)
   return _elm.Html.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _P = _N.Ports.make(_elm),
   $moduleName = "Html",
   $Graphics$Element = Elm.Graphics.Element.make(_elm),
   $VirtualDom = Elm.VirtualDom.make(_elm);
   var fromElement = $VirtualDom.fromElement;
   var toElement = $VirtualDom.toElement;
   var text = $VirtualDom.text;
   var node = $VirtualDom.node;
   var body = node("body");
   var section = node("section");
   var nav = node("nav");
   var article = node("article");
   var aside = node("aside");
   var h1 = node("h1");
   var h2 = node("h2");
   var h3 = node("h3");
   var h4 = node("h4");
   var h5 = node("h5");
   var h6 = node("h6");
   var header = node("header");
   var footer = node("footer");
   var address = node("address");
   var main$ = node("main");
   var p = node("p");
   var hr = node("hr");
   var pre = node("pre");
   var blockquote = node("blockquote");
   var ol = node("ol");
   var ul = node("ul");
   var li = node("li");
   var dl = node("dl");
   var dt = node("dt");
   var dd = node("dd");
   var figure = node("figure");
   var figcaption = node("figcaption");
   var div = node("div");
   var a = node("a");
   var em = node("em");
   var strong = node("strong");
   var small = node("small");
   var s = node("s");
   var cite = node("cite");
   var q = node("q");
   var dfn = node("dfn");
   var abbr = node("abbr");
   var time = node("time");
   var code = node("code");
   var $var = node("var");
   var samp = node("samp");
   var kbd = node("kbd");
   var sub = node("sub");
   var sup = node("sup");
   var i = node("i");
   var b = node("b");
   var u = node("u");
   var mark = node("mark");
   var ruby = node("ruby");
   var rt = node("rt");
   var rp = node("rp");
   var bdi = node("bdi");
   var bdo = node("bdo");
   var span = node("span");
   var br = node("br");
   var wbr = node("wbr");
   var ins = node("ins");
   var del = node("del");
   var img = node("img");
   var iframe = node("iframe");
   var embed = node("embed");
   var object = node("object");
   var param = node("param");
   var video = node("video");
   var audio = node("audio");
   var source = node("source");
   var track = node("track");
   var canvas = node("canvas");
   var svg = node("svg");
   var math = node("math");
   var table = node("table");
   var caption = node("caption");
   var colgroup = node("colgroup");
   var col = node("col");
   var tbody = node("tbody");
   var thead = node("thead");
   var tfoot = node("tfoot");
   var tr = node("tr");
   var td = node("td");
   var th = node("th");
   var form = node("form");
   var fieldset = node("fieldset");
   var legend = node("legend");
   var label = node("label");
   var input = node("input");
   var button = node("button");
   var select = node("select");
   var datalist = node("datalist");
   var optgroup = node("optgroup");
   var option = node("option");
   var textarea = node("textarea");
   var keygen = node("keygen");
   var output = node("output");
   var progress = node("progress");
   var meter = node("meter");
   var details = node("details");
   var summary = node("summary");
   var menuitem = node("menuitem");
   var menu = node("menu");
   _elm.Html.values = {_op: _op
                      ,node: node
                      ,text: text
                      ,toElement: toElement
                      ,fromElement: fromElement
                      ,body: body
                      ,section: section
                      ,nav: nav
                      ,article: article
                      ,aside: aside
                      ,h1: h1
                      ,h2: h2
                      ,h3: h3
                      ,h4: h4
                      ,h5: h5
                      ,h6: h6
                      ,header: header
                      ,footer: footer
                      ,address: address
                      ,main$: main$
                      ,p: p
                      ,hr: hr
                      ,pre: pre
                      ,blockquote: blockquote
                      ,ol: ol
                      ,ul: ul
                      ,li: li
                      ,dl: dl
                      ,dt: dt
                      ,dd: dd
                      ,figure: figure
                      ,figcaption: figcaption
                      ,div: div
                      ,a: a
                      ,em: em
                      ,strong: strong
                      ,small: small
                      ,s: s
                      ,cite: cite
                      ,q: q
                      ,dfn: dfn
                      ,abbr: abbr
                      ,time: time
                      ,code: code
                      ,$var: $var
                      ,samp: samp
                      ,kbd: kbd
                      ,sub: sub
                      ,sup: sup
                      ,i: i
                      ,b: b
                      ,u: u
                      ,mark: mark
                      ,ruby: ruby
                      ,rt: rt
                      ,rp: rp
                      ,bdi: bdi
                      ,bdo: bdo
                      ,span: span
                      ,br: br
                      ,wbr: wbr
                      ,ins: ins
                      ,del: del
                      ,img: img
                      ,iframe: iframe
                      ,embed: embed
                      ,object: object
                      ,param: param
                      ,video: video
                      ,audio: audio
                      ,source: source
                      ,track: track
                      ,canvas: canvas
                      ,svg: svg
                      ,math: math
                      ,table: table
                      ,caption: caption
                      ,colgroup: colgroup
                      ,col: col
                      ,tbody: tbody
                      ,thead: thead
                      ,tfoot: tfoot
                      ,tr: tr
                      ,td: td
                      ,th: th
                      ,form: form
                      ,fieldset: fieldset
                      ,legend: legend
                      ,label: label
                      ,input: input
                      ,button: button
                      ,select: select
                      ,datalist: datalist
                      ,optgroup: optgroup
                      ,option: option
                      ,textarea: textarea
                      ,keygen: keygen
                      ,output: output
                      ,progress: progress
                      ,meter: meter
                      ,details: details
                      ,summary: summary
                      ,menuitem: menuitem
                      ,menu: menu};
   return _elm.Html.values;
};
Elm.Html = Elm.Html || {};
Elm.Html.Attributes = Elm.Html.Attributes || {};
Elm.Html.Attributes.make = function (_elm) {
   "use strict";
   _elm.Html = _elm.Html || {};
   _elm.Html.Attributes = _elm.Html.Attributes || {};
   if (_elm.Html.Attributes.values)
   return _elm.Html.Attributes.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _P = _N.Ports.make(_elm),
   $moduleName = "Html.Attributes",
   $Basics = Elm.Basics.make(_elm),
   $Html = Elm.Html.make(_elm),
   $Json$Encode = Elm.Json.Encode.make(_elm),
   $List = Elm.List.make(_elm),
   $String = Elm.String.make(_elm),
   $VirtualDom = Elm.VirtualDom.make(_elm);
   var property = $VirtualDom.property;
   var stringProperty = F2(function (name,
   string) {
      return A2(property,
      name,
      $Json$Encode.string(string));
   });
   var $class = function (name) {
      return A2(stringProperty,
      "className",
      name);
   };
   var id = function (name) {
      return A2(stringProperty,
      "id",
      name);
   };
   var title = function (name) {
      return A2(stringProperty,
      "title",
      name);
   };
   var accesskey = function ($char) {
      return A2(stringProperty,
      "accesskey",
      $String.fromList(_L.fromArray([$char])));
   };
   var contextmenu = function (value) {
      return A2(stringProperty,
      "contextmenu",
      value);
   };
   var dir = function (value) {
      return A2(stringProperty,
      "dir",
      value);
   };
   var draggable = function (value) {
      return A2(stringProperty,
      "draggable",
      value);
   };
   var dropzone = function (value) {
      return A2(stringProperty,
      "dropzone",
      value);
   };
   var itemprop = function (value) {
      return A2(stringProperty,
      "itemprop",
      value);
   };
   var lang = function (value) {
      return A2(stringProperty,
      "lang",
      value);
   };
   var tabindex = function (n) {
      return A2(stringProperty,
      "tabIndex",
      $Basics.toString(n));
   };
   var charset = function (value) {
      return A2(stringProperty,
      "charset",
      value);
   };
   var content = function (value) {
      return A2(stringProperty,
      "content",
      value);
   };
   var httpEquiv = function (value) {
      return A2(stringProperty,
      "httpEquiv",
      value);
   };
   var language = function (value) {
      return A2(stringProperty,
      "language",
      value);
   };
   var src = function (value) {
      return A2(stringProperty,
      "src",
      value);
   };
   var height = function (value) {
      return A2(stringProperty,
      "height",
      $Basics.toString(value));
   };
   var width = function (value) {
      return A2(stringProperty,
      "width",
      $Basics.toString(value));
   };
   var alt = function (value) {
      return A2(stringProperty,
      "alt",
      value);
   };
   var poster = function (value) {
      return A2(stringProperty,
      "poster",
      value);
   };
   var kind = function (value) {
      return A2(stringProperty,
      "kind",
      value);
   };
   var srclang = function (value) {
      return A2(stringProperty,
      "srclang",
      value);
   };
   var sandbox = function (value) {
      return A2(stringProperty,
      "sandbox",
      value);
   };
   var srcdoc = function (value) {
      return A2(stringProperty,
      "srcdoc",
      value);
   };
   var type$ = function (value) {
      return A2(stringProperty,
      "type",
      value);
   };
   var value = function (value) {
      return A2(stringProperty,
      "value",
      value);
   };
   var placeholder = function (value) {
      return A2(stringProperty,
      "placeholder",
      value);
   };
   var accept = function (value) {
      return A2(stringProperty,
      "accept",
      value);
   };
   var acceptCharset = function (value) {
      return A2(stringProperty,
      "acceptCharset",
      value);
   };
   var action = function (value) {
      return A2(stringProperty,
      "action",
      value);
   };
   var autocomplete = function (bool) {
      return A2(stringProperty,
      "autocomplete",
      bool ? "on" : "off");
   };
   var autosave = function (value) {
      return A2(stringProperty,
      "autosave",
      value);
   };
   var enctype = function (value) {
      return A2(stringProperty,
      "enctype",
      value);
   };
   var formaction = function (value) {
      return A2(stringProperty,
      "formaction",
      value);
   };
   var list = function (value) {
      return A2(stringProperty,
      "list",
      value);
   };
   var maxlength = function (n) {
      return A2(stringProperty,
      "maxLength",
      $Basics.toString(n));
   };
   var method = function (value) {
      return A2(stringProperty,
      "method",
      value);
   };
   var name = function (value) {
      return A2(stringProperty,
      "name",
      value);
   };
   var pattern = function (value) {
      return A2(stringProperty,
      "pattern",
      value);
   };
   var size = function (n) {
      return A2(stringProperty,
      "size",
      $Basics.toString(n));
   };
   var $for = function (value) {
      return A2(stringProperty,
      "htmlFor",
      value);
   };
   var form = function (value) {
      return A2(stringProperty,
      "form",
      value);
   };
   var max = function (value) {
      return A2(stringProperty,
      "max",
      value);
   };
   var min = function (value) {
      return A2(stringProperty,
      "min",
      value);
   };
   var step = function (n) {
      return A2(stringProperty,
      "step",
      $Basics.toString(n));
   };
   var cols = function (n) {
      return A2(stringProperty,
      "cols",
      $Basics.toString(n));
   };
   var rows = function (n) {
      return A2(stringProperty,
      "rows",
      $Basics.toString(n));
   };
   var wrap = function (value) {
      return A2(stringProperty,
      "wrap",
      value);
   };
   var ismap = function (value) {
      return A2(stringProperty,
      "ismap",
      value);
   };
   var usemap = function (value) {
      return A2(stringProperty,
      "usemap",
      value);
   };
   var shape = function (value) {
      return A2(stringProperty,
      "shape",
      value);
   };
   var coords = function (value) {
      return A2(stringProperty,
      "coords",
      value);
   };
   var challenge = function (value) {
      return A2(stringProperty,
      "challenge",
      value);
   };
   var keytype = function (value) {
      return A2(stringProperty,
      "keytype",
      value);
   };
   var align = function (value) {
      return A2(stringProperty,
      "align",
      value);
   };
   var cite = function (value) {
      return A2(stringProperty,
      "cite",
      value);
   };
   var href = function (value) {
      return A2(stringProperty,
      "href",
      value);
   };
   var target = function (value) {
      return A2(stringProperty,
      "target",
      value);
   };
   var downloadAs = function (value) {
      return A2(stringProperty,
      "download",
      value);
   };
   var hreflang = function (value) {
      return A2(stringProperty,
      "hreflang",
      value);
   };
   var media = function (value) {
      return A2(stringProperty,
      "media",
      value);
   };
   var ping = function (value) {
      return A2(stringProperty,
      "ping",
      value);
   };
   var rel = function (value) {
      return A2(stringProperty,
      "rel",
      value);
   };
   var datetime = function (value) {
      return A2(stringProperty,
      "datetime",
      value);
   };
   var pubdate = function (value) {
      return A2(stringProperty,
      "pubdate",
      value);
   };
   var start = function (n) {
      return A2(stringProperty,
      "start",
      $Basics.toString(n));
   };
   var colspan = function (value) {
      return A2(stringProperty,
      "colSpan",
      value);
   };
   var headers = function (value) {
      return A2(stringProperty,
      "headers",
      value);
   };
   var rowspan = function (value) {
      return A2(stringProperty,
      "rowSpan",
      value);
   };
   var scope = function (value) {
      return A2(stringProperty,
      "scope",
      value);
   };
   var manifest = function (value) {
      return A2(stringProperty,
      "manifest",
      value);
   };
   var boolProperty = F2(function (name,
   bool) {
      return A2(property,
      name,
      $Json$Encode.bool(bool));
   });
   var hidden = function (bool) {
      return A2(boolProperty,
      "hidden",
      bool);
   };
   var contenteditable = function (bool) {
      return A2(boolProperty,
      "contentEditable",
      bool);
   };
   var spellcheck = function (bool) {
      return A2(boolProperty,
      "spellcheck",
      bool);
   };
   var async = function (bool) {
      return A2(boolProperty,
      "async",
      bool);
   };
   var defer = function (bool) {
      return A2(boolProperty,
      "defer",
      bool);
   };
   var scoped = function (bool) {
      return A2(boolProperty,
      "scoped",
      bool);
   };
   var autoplay = function (bool) {
      return A2(boolProperty,
      "autoplay",
      bool);
   };
   var controls = function (bool) {
      return A2(boolProperty,
      "controls",
      bool);
   };
   var loop = function (bool) {
      return A2(boolProperty,
      "loop",
      bool);
   };
   var preload = function (bool) {
      return A2(boolProperty,
      "preload",
      bool);
   };
   var $default = function (bool) {
      return A2(boolProperty,
      "default",
      bool);
   };
   var seamless = function (bool) {
      return A2(boolProperty,
      "seamless",
      bool);
   };
   var checked = function (bool) {
      return A2(boolProperty,
      "checked",
      bool);
   };
   var selected = function (bool) {
      return A2(boolProperty,
      "selected",
      bool);
   };
   var autofocus = function (bool) {
      return A2(boolProperty,
      "autofocus",
      bool);
   };
   var disabled = function (bool) {
      return A2(boolProperty,
      "disabled",
      bool);
   };
   var multiple = function (bool) {
      return A2(boolProperty,
      "multiple",
      bool);
   };
   var novalidate = function (bool) {
      return A2(boolProperty,
      "novalidate",
      bool);
   };
   var readonly = function (bool) {
      return A2(boolProperty,
      "readonly",
      bool);
   };
   var required = function (bool) {
      return A2(boolProperty,
      "required",
      bool);
   };
   var download = function (bool) {
      return A2(boolProperty,
      "download",
      bool);
   };
   var reversed = function (bool) {
      return A2(boolProperty,
      "reversed",
      bool);
   };
   var style = function (props) {
      return property("style")($Json$Encode.object($List.map(function (_v0) {
         return function () {
            switch (_v0.ctor)
            {case "_Tuple2":
               return {ctor: "_Tuple2"
                      ,_0: _v0._0
                      ,_1: $Json$Encode.string(_v0._1)};}
            _U.badCase($moduleName,
            "on line 136, column 35 to 57");
         }();
      })(props)));
   };
   var key = function (k) {
      return A2(stringProperty,
      "key",
      k);
   };
   _elm.Html.Attributes.values = {_op: _op
                                 ,key: key
                                 ,style: style
                                 ,property: property
                                 ,stringProperty: stringProperty
                                 ,boolProperty: boolProperty
                                 ,$class: $class
                                 ,hidden: hidden
                                 ,id: id
                                 ,title: title
                                 ,accesskey: accesskey
                                 ,contenteditable: contenteditable
                                 ,contextmenu: contextmenu
                                 ,dir: dir
                                 ,draggable: draggable
                                 ,dropzone: dropzone
                                 ,itemprop: itemprop
                                 ,lang: lang
                                 ,spellcheck: spellcheck
                                 ,tabindex: tabindex
                                 ,async: async
                                 ,charset: charset
                                 ,content: content
                                 ,defer: defer
                                 ,httpEquiv: httpEquiv
                                 ,language: language
                                 ,scoped: scoped
                                 ,src: src
                                 ,height: height
                                 ,width: width
                                 ,alt: alt
                                 ,autoplay: autoplay
                                 ,controls: controls
                                 ,loop: loop
                                 ,preload: preload
                                 ,poster: poster
                                 ,$default: $default
                                 ,kind: kind
                                 ,srclang: srclang
                                 ,sandbox: sandbox
                                 ,seamless: seamless
                                 ,srcdoc: srcdoc
                                 ,type$: type$
                                 ,value: value
                                 ,checked: checked
                                 ,placeholder: placeholder
                                 ,selected: selected
                                 ,accept: accept
                                 ,acceptCharset: acceptCharset
                                 ,action: action
                                 ,autocomplete: autocomplete
                                 ,autofocus: autofocus
                                 ,autosave: autosave
                                 ,disabled: disabled
                                 ,enctype: enctype
                                 ,formaction: formaction
                                 ,list: list
                                 ,maxlength: maxlength
                                 ,method: method
                                 ,multiple: multiple
                                 ,name: name
                                 ,novalidate: novalidate
                                 ,pattern: pattern
                                 ,readonly: readonly
                                 ,required: required
                                 ,size: size
                                 ,$for: $for
                                 ,form: form
                                 ,max: max
                                 ,min: min
                                 ,step: step
                                 ,cols: cols
                                 ,rows: rows
                                 ,wrap: wrap
                                 ,ismap: ismap
                                 ,usemap: usemap
                                 ,shape: shape
                                 ,coords: coords
                                 ,challenge: challenge
                                 ,keytype: keytype
                                 ,align: align
                                 ,cite: cite
                                 ,href: href
                                 ,target: target
                                 ,download: download
                                 ,downloadAs: downloadAs
                                 ,hreflang: hreflang
                                 ,media: media
                                 ,ping: ping
                                 ,rel: rel
                                 ,datetime: datetime
                                 ,pubdate: pubdate
                                 ,reversed: reversed
                                 ,start: start
                                 ,colspan: colspan
                                 ,headers: headers
                                 ,rowspan: rowspan
                                 ,scope: scope
                                 ,manifest: manifest};
   return _elm.Html.Attributes.values;
};
Elm.Html = Elm.Html || {};
Elm.Html.Events = Elm.Html.Events || {};
Elm.Html.Events.make = function (_elm) {
   "use strict";
   _elm.Html = _elm.Html || {};
   _elm.Html.Events = _elm.Html.Events || {};
   if (_elm.Html.Events.values)
   return _elm.Html.Events.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _P = _N.Ports.make(_elm),
   $moduleName = "Html.Events",
   $Basics = Elm.Basics.make(_elm),
   $Html = Elm.Html.make(_elm),
   $Json$Decode = Elm.Json.Decode.make(_elm),
   $Signal = Elm.Signal.make(_elm),
   $VirtualDom = Elm.VirtualDom.make(_elm);
   var keyCode = A2($Json$Decode._op[":="],
   "keyCode",
   $Json$Decode.$int);
   var targetChecked = A2($Json$Decode.at,
   _L.fromArray(["target"
                ,"checked"]),
   $Json$Decode.bool);
   var targetValue = A2($Json$Decode.at,
   _L.fromArray(["target"
                ,"value"]),
   $Json$Decode.string);
   var on = $VirtualDom.on;
   var messageOn = F2(function (name,
   msg) {
      return A3(on,
      name,
      $Json$Decode.value,
      $Basics.always(msg));
   });
   var onClick = messageOn("click");
   var onDoubleClick = messageOn("dblclick");
   var onMouseMove = messageOn("mousemove");
   var onMouseDown = messageOn("mousedown");
   var onMouseUp = messageOn("mouseup");
   var onMouseEnter = messageOn("mouseenter");
   var onMouseLeave = messageOn("mouseleave");
   var onMouseOver = messageOn("mouseover");
   var onMouseOut = messageOn("mouseout");
   var onBlur = messageOn("blur");
   var onFocus = messageOn("focus");
   var onSubmit = messageOn("submit");
   var onKey = function (name) {
      return A2(on,name,keyCode);
   };
   var onKeyUp = onKey("keyup");
   var onKeyDown = onKey("keydown");
   var onKeyPress = onKey("keypress");
   _elm.Html.Events.values = {_op: _op
                             ,on: on
                             ,targetValue: targetValue
                             ,targetChecked: targetChecked
                             ,keyCode: keyCode
                             ,messageOn: messageOn
                             ,onClick: onClick
                             ,onDoubleClick: onDoubleClick
                             ,onMouseMove: onMouseMove
                             ,onMouseDown: onMouseDown
                             ,onMouseUp: onMouseUp
                             ,onMouseEnter: onMouseEnter
                             ,onMouseLeave: onMouseLeave
                             ,onMouseOver: onMouseOver
                             ,onMouseOut: onMouseOut
                             ,onKey: onKey
                             ,onKeyUp: onKeyUp
                             ,onKeyDown: onKeyDown
                             ,onKeyPress: onKeyPress
                             ,onBlur: onBlur
                             ,onFocus: onFocus
                             ,onSubmit: onSubmit};
   return _elm.Html.Events.values;
};
Elm.Html = Elm.Html || {};
Elm.Html.Lazy = Elm.Html.Lazy || {};
Elm.Html.Lazy.make = function (_elm) {
   "use strict";
   _elm.Html = _elm.Html || {};
   _elm.Html.Lazy = _elm.Html.Lazy || {};
   if (_elm.Html.Lazy.values)
   return _elm.Html.Lazy.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _P = _N.Ports.make(_elm),
   $moduleName = "Html.Lazy",
   $Html = Elm.Html.make(_elm),
   $VirtualDom = Elm.VirtualDom.make(_elm);
   var lazy3 = $VirtualDom.lazy3;
   var lazy2 = $VirtualDom.lazy2;
   var lazy = $VirtualDom.lazy;
   _elm.Html.Lazy.values = {_op: _op
                           ,lazy: lazy
                           ,lazy2: lazy2
                           ,lazy3: lazy3};
   return _elm.Html.Lazy.values;
};
Elm.Json = Elm.Json || {};
Elm.Json.Decode = Elm.Json.Decode || {};
Elm.Json.Decode.make = function (_elm) {
   "use strict";
   _elm.Json = _elm.Json || {};
   _elm.Json.Decode = _elm.Json.Decode || {};
   if (_elm.Json.Decode.values)
   return _elm.Json.Decode.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _P = _N.Ports.make(_elm),
   $moduleName = "Json.Decode",
   $Array = Elm.Array.make(_elm),
   $Dict = Elm.Dict.make(_elm),
   $Json$Encode = Elm.Json.Encode.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Native$Json = Elm.Native.Json.make(_elm),
   $Result = Elm.Result.make(_elm);
   var tuple8 = $Native$Json.decodeTuple8;
   var tuple7 = $Native$Json.decodeTuple7;
   var tuple6 = $Native$Json.decodeTuple6;
   var tuple5 = $Native$Json.decodeTuple5;
   var tuple4 = $Native$Json.decodeTuple4;
   var tuple3 = $Native$Json.decodeTuple3;
   var tuple2 = $Native$Json.decodeTuple2;
   var tuple1 = $Native$Json.decodeTuple1;
   var succeed = $Native$Json.succeed;
   var fail = $Native$Json.fail;
   var andThen = $Native$Json.andThen;
   var customDecoder = $Native$Json.customDecoder;
   var decodeValue = $Native$Json.runDecoderValue;
   var value = $Native$Json.decodeValue;
   var maybe = $Native$Json.decodeMaybe;
   var $null = $Native$Json.decodeNull;
   var array = $Native$Json.decodeArray;
   var list = $Native$Json.decodeList;
   var bool = $Native$Json.decodeBool;
   var $int = $Native$Json.decodeInt;
   var $float = $Native$Json.decodeFloat;
   var string = $Native$Json.decodeString;
   var oneOf = $Native$Json.oneOf;
   var keyValuePairs = $Native$Json.decodeKeyValuePairs;
   var object8 = $Native$Json.decodeObject8;
   var object7 = $Native$Json.decodeObject7;
   var object6 = $Native$Json.decodeObject6;
   var object5 = $Native$Json.decodeObject5;
   var object4 = $Native$Json.decodeObject4;
   var object3 = $Native$Json.decodeObject3;
   var object2 = $Native$Json.decodeObject2;
   var object1 = $Native$Json.decodeObject1;
   _op[":="] = $Native$Json.decodeField;
   var at = F2(function (fields,
   decoder) {
      return A3($List.foldr,
      F2(function (x,y) {
         return A2(_op[":="],x,y);
      }),
      decoder,
      fields);
   });
   var decodeString = $Native$Json.runDecoderString;
   var map = $Native$Json.decodeObject1;
   var dict = function (decoder) {
      return A2(map,
      $Dict.fromList,
      keyValuePairs(decoder));
   };
   var Decoder = {ctor: "Decoder"};
   _elm.Json.Decode.values = {_op: _op
                             ,Decoder: Decoder
                             ,map: map
                             ,decodeString: decodeString
                             ,at: at
                             ,object1: object1
                             ,object2: object2
                             ,object3: object3
                             ,object4: object4
                             ,object5: object5
                             ,object6: object6
                             ,object7: object7
                             ,object8: object8
                             ,keyValuePairs: keyValuePairs
                             ,dict: dict
                             ,oneOf: oneOf
                             ,string: string
                             ,$float: $float
                             ,$int: $int
                             ,bool: bool
                             ,list: list
                             ,array: array
                             ,$null: $null
                             ,maybe: maybe
                             ,value: value
                             ,decodeValue: decodeValue
                             ,customDecoder: customDecoder
                             ,andThen: andThen
                             ,fail: fail
                             ,succeed: succeed
                             ,tuple1: tuple1
                             ,tuple2: tuple2
                             ,tuple3: tuple3
                             ,tuple4: tuple4
                             ,tuple5: tuple5
                             ,tuple6: tuple6
                             ,tuple7: tuple7
                             ,tuple8: tuple8};
   return _elm.Json.Decode.values;
};
Elm.Json = Elm.Json || {};
Elm.Json.Encode = Elm.Json.Encode || {};
Elm.Json.Encode.make = function (_elm) {
   "use strict";
   _elm.Json = _elm.Json || {};
   _elm.Json.Encode = _elm.Json.Encode || {};
   if (_elm.Json.Encode.values)
   return _elm.Json.Encode.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _P = _N.Ports.make(_elm),
   $moduleName = "Json.Encode",
   $Array = Elm.Array.make(_elm),
   $Native$Json = Elm.Native.Json.make(_elm);
   var list = $Native$Json.encodeList;
   var array = $Native$Json.encodeArray;
   var object = $Native$Json.encodeObject;
   var $null = $Native$Json.encodeNull;
   var bool = $Native$Json.identity;
   var $float = $Native$Json.identity;
   var $int = $Native$Json.identity;
   var string = $Native$Json.identity;
   var encode = $Native$Json.encode;
   var Value = {ctor: "Value"};
   _elm.Json.Encode.values = {_op: _op
                             ,Value: Value
                             ,encode: encode
                             ,string: string
                             ,$int: $int
                             ,$float: $float
                             ,bool: bool
                             ,$null: $null
                             ,object: object
                             ,array: array
                             ,list: list};
   return _elm.Json.Encode.values;
};
Elm.List = Elm.List || {};
Elm.List.make = function (_elm) {
   "use strict";
   _elm.List = _elm.List || {};
   if (_elm.List.values)
   return _elm.List.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _P = _N.Ports.make(_elm),
   $moduleName = "List",
   $Basics = Elm.Basics.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Native$List = Elm.Native.List.make(_elm);
   var sortWith = $Native$List.sortWith;
   var sortBy = $Native$List.sortBy;
   var sort = $Native$List.sort;
   var repeat = $Native$List.repeat;
   var drop = $Native$List.drop;
   var take = $Native$List.take;
   var map5 = $Native$List.map5;
   var map4 = $Native$List.map4;
   var map3 = $Native$List.map3;
   var map2 = $Native$List.map2;
   var append = $Native$List.append;
   var any = $Native$List.any;
   var all = $Native$List.all;
   var reverse = $Native$List.reverse;
   var length = $Native$List.length;
   var filter = $Native$List.filter;
   var scanl1 = $Native$List.scanl1;
   var scanl = $Native$List.scanl;
   var foldr1 = $Native$List.foldr1;
   var foldl1 = $Native$List.foldl1;
   var maximum = foldl1($Basics.max);
   var minimum = foldl1($Basics.min);
   var foldr = $Native$List.foldr;
   var concat = function (lists) {
      return A3(foldr,
      append,
      _L.fromArray([]),
      lists);
   };
   var foldl = $Native$List.foldl;
   var sum = function (numbers) {
      return A3(foldl,
      F2(function (x,y) {
         return x + y;
      }),
      0,
      numbers);
   };
   var product = function (numbers) {
      return A3(foldl,
      F2(function (x,y) {
         return x * y;
      }),
      1,
      numbers);
   };
   var indexedMap = F2(function (f,
   xs) {
      return A3(map2,
      f,
      _L.range(0,length(xs) - 1),
      xs);
   });
   var map = $Native$List.map;
   var concatMap = F2(function (f,
   list) {
      return concat(A2(map,
      f,
      list));
   });
   var member = $Native$List.member;
   var isEmpty = function (xs) {
      return function () {
         switch (xs.ctor)
         {case "[]": return true;}
         return false;
      }();
   };
   var tail = $Native$List.tail;
   var head = $Native$List.head;
   _op["::"] = $Native$List.cons;
   var maybeCons = F3(function (f,
   mx,
   xs) {
      return function () {
         var _v1 = f(mx);
         switch (_v1.ctor)
         {case "Just":
            return A2(_op["::"],_v1._0,xs);
            case "Nothing": return xs;}
         _U.badCase($moduleName,
         "between lines 162 and 169");
      }();
   });
   var filterMap = F2(function (f,
   xs) {
      return A3(foldr,
      maybeCons(f),
      _L.fromArray([]),
      xs);
   });
   var partition = F2(function (pred,
   list) {
      return function () {
         var step = F2(function (x,
         _v3) {
            return function () {
               switch (_v3.ctor)
               {case "_Tuple2":
                  return pred(x) ? {ctor: "_Tuple2"
                                   ,_0: A2(_op["::"],x,_v3._0)
                                   ,_1: _v3._1} : {ctor: "_Tuple2"
                                                  ,_0: _v3._0
                                                  ,_1: A2(_op["::"],x,_v3._1)};}
               _U.badCase($moduleName,
               "between lines 270 and 272");
            }();
         });
         return A3(foldr,
         step,
         {ctor: "_Tuple2"
         ,_0: _L.fromArray([])
         ,_1: _L.fromArray([])},
         list);
      }();
   });
   var unzip = function (pairs) {
      return function () {
         var step = F2(function (_v7,
         _v8) {
            return function () {
               switch (_v8.ctor)
               {case "_Tuple2":
                  return function () {
                       switch (_v7.ctor)
                       {case "_Tuple2":
                          return {ctor: "_Tuple2"
                                 ,_0: A2(_op["::"],_v7._0,_v8._0)
                                 ,_1: A2(_op["::"],
                                 _v7._1,
                                 _v8._1)};}
                       _U.badCase($moduleName,
                       "on line 308, column 12 to 28");
                    }();}
               _U.badCase($moduleName,
               "on line 308, column 12 to 28");
            }();
         });
         return A3(foldr,
         step,
         {ctor: "_Tuple2"
         ,_0: _L.fromArray([])
         ,_1: _L.fromArray([])},
         pairs);
      }();
   };
   var intersperse = F2(function (sep,
   xs) {
      return function () {
         switch (xs.ctor)
         {case "::": return function () {
                 var step = F2(function (x,
                 rest) {
                    return A2(_op["::"],
                    sep,
                    A2(_op["::"],x,rest));
                 });
                 var spersed = A3(foldr,
                 step,
                 _L.fromArray([]),
                 xs._1);
                 return A2(_op["::"],
                 xs._0,
                 spersed);
              }();
            case "[]":
            return _L.fromArray([]);}
         _U.badCase($moduleName,
         "between lines 319 and 330");
      }();
   });
   _elm.List.values = {_op: _op
                      ,head: head
                      ,tail: tail
                      ,isEmpty: isEmpty
                      ,member: member
                      ,map: map
                      ,indexedMap: indexedMap
                      ,foldl: foldl
                      ,foldr: foldr
                      ,foldl1: foldl1
                      ,foldr1: foldr1
                      ,scanl: scanl
                      ,scanl1: scanl1
                      ,filter: filter
                      ,filterMap: filterMap
                      ,maybeCons: maybeCons
                      ,length: length
                      ,reverse: reverse
                      ,all: all
                      ,any: any
                      ,append: append
                      ,concat: concat
                      ,concatMap: concatMap
                      ,sum: sum
                      ,product: product
                      ,maximum: maximum
                      ,minimum: minimum
                      ,partition: partition
                      ,map2: map2
                      ,map3: map3
                      ,map4: map4
                      ,map5: map5
                      ,unzip: unzip
                      ,intersperse: intersperse
                      ,take: take
                      ,drop: drop
                      ,repeat: repeat
                      ,sort: sort
                      ,sortBy: sortBy
                      ,sortWith: sortWith};
   return _elm.List.values;
};
Elm.LocalChannel = Elm.LocalChannel || {};
Elm.LocalChannel.make = function (_elm) {
   "use strict";
   _elm.LocalChannel = _elm.LocalChannel || {};
   if (_elm.LocalChannel.values)
   return _elm.LocalChannel.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _P = _N.Ports.make(_elm),
   $moduleName = "LocalChannel",
   $Signal = Elm.Signal.make(_elm);
   var send = F2(function (_v0,
   value) {
      return function () {
         switch (_v0.ctor)
         {case "LocalChannel":
            return _v0._0(value);}
         _U.badCase($moduleName,
         "on line 91, column 3 to 22");
      }();
   });
   var LocalChannel = function (a) {
      return {ctor: "LocalChannel"
             ,_0: a};
   };
   var create = F2(function (generalize,
   channel) {
      return LocalChannel(function (v) {
         return A2($Signal.send,
         channel,
         generalize(v));
      });
   });
   var localize = F2(function (generalize,
   _v3) {
      return function () {
         switch (_v3.ctor)
         {case "LocalChannel":
            return LocalChannel(function (v) {
                 return _v3._0(generalize(v));
              });}
         _U.badCase($moduleName,
         "on line 83, column 3 to 41");
      }();
   });
   _elm.LocalChannel.values = {_op: _op
                              ,create: create
                              ,localize: localize
                              ,send: send};
   return _elm.LocalChannel.values;
};
Elm.Maybe = Elm.Maybe || {};
Elm.Maybe.make = function (_elm) {
   "use strict";
   _elm.Maybe = _elm.Maybe || {};
   if (_elm.Maybe.values)
   return _elm.Maybe.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _P = _N.Ports.make(_elm),
   $moduleName = "Maybe";
   var withDefault = F2(function ($default,
   maybe) {
      return function () {
         switch (maybe.ctor)
         {case "Just": return maybe._0;
            case "Nothing":
            return $default;}
         _U.badCase($moduleName,
         "between lines 45 and 56");
      }();
   });
   var Nothing = {ctor: "Nothing"};
   var oneOf = function (maybes) {
      return function () {
         switch (maybes.ctor)
         {case "::": return function () {
                 switch (maybes._0.ctor)
                 {case "Just": return maybes._0;
                    case "Nothing":
                    return oneOf(maybes._1);}
                 _U.badCase($moduleName,
                 "between lines 64 and 73");
              }();
            case "[]": return Nothing;}
         _U.badCase($moduleName,
         "between lines 59 and 73");
      }();
   };
   var andThen = F2(function (maybeValue,
   callback) {
      return function () {
         switch (maybeValue.ctor)
         {case "Just":
            return callback(maybeValue._0);
            case "Nothing": return Nothing;}
         _U.badCase($moduleName,
         "between lines 110 and 112");
      }();
   });
   var Just = function (a) {
      return {ctor: "Just",_0: a};
   };
   var map = F2(function (f,
   maybe) {
      return function () {
         switch (maybe.ctor)
         {case "Just":
            return Just(f(maybe._0));
            case "Nothing": return Nothing;}
         _U.badCase($moduleName,
         "between lines 76 and 107");
      }();
   });
   _elm.Maybe.values = {_op: _op
                       ,andThen: andThen
                       ,map: map
                       ,withDefault: withDefault
                       ,oneOf: oneOf
                       ,Just: Just
                       ,Nothing: Nothing};
   return _elm.Maybe.values;
};
Elm.Native.Array = {};
Elm.Native.Array.make = function(elm) {
    elm.Native = elm.Native || {};
    elm.Native.Array = elm.Native.Array || {};
    if (elm.Native.Array.values) return elm.Native.Array.values;
    if ('values' in Elm.Native.Array)
      return elm.Native.Array.values = Elm.Native.Array.values;

    var List = Elm.Native.List.make(elm);

    // A RRB-Tree has two distinct data types.
    // Leaf -> "height"  is always 0
    //         "table"   is an array of elements
    // Node -> "height"  is always greater than 0
    //         "table"   is an array of child nodes
    //         "lengths" is an array of accumulated lengths of the child nodes

    // M is the maximal table size. 32 seems fast. E is the allowed increase
    // of search steps when concatting to find an index. Lower values will
    // decrease balancing, but will increase search steps.
    var M = 32;
    var E = 2;

    // An empty array.
    var empty = { ctor:"_Array", height:0, table:new Array() };

    function get(i, array) {
        if (i < 0 || i >= length(array)) {
            throw new Error("Index " + i + " is out of range. Check the length of " +
                            "your array first or use getMaybe or getWithDefault.");
        }
        return unsafeGet(i, array);
    }

    function unsafeGet(i, array) {
      for (var x = array.height; x > 0; x--) {
        var slot = i >> (x * 5);
        while (array.lengths[slot] <= i) {
          slot++;
        }
        if (slot > 0) {
          i -= array.lengths[slot - 1];
        }
        array = array.table[slot];
      }
      return array.table[i];
    }

    // Sets the value at the index i. Only the nodes leading to i will get
    // copied and updated.
    function set(i, item, array) {
      if (i < 0 || length(array) <= i) {
        return array;
      }
      return unsafeSet(i, item, array);
    }

    function unsafeSet(i, item, array) {
      array = nodeCopy(array);

      if (array.height == 0) {
        array.table[i] = item;
      } else {
        var slot = getSlot(i, array);
        if (slot > 0) {
          i -= array.lengths[slot - 1];
        }
        array.table[slot] = unsafeSet(i, item, array.table[slot]);
      }
      return array;
    }

    function initialize(len, f) {
      if (len == 0) { return empty; }
      var h = Math.floor(Math.log(len)/Math.log(M));
      return initialize_(f, h, 0, len);
    }

    function initialize_(f, h, from, to) {
      if (h == 0) {
        var table = new Array((to - from) % (M + 1));
        for (var i = 0; i < table.length; i++) {
          table[i] = f(from + i);
        }
        return { ctor:"_Array", height:0, table:table };
      }

      var step = Math.pow(M, h);
      var table = new Array(Math.ceil((to - from) / step));
      var lengths = new Array(table.length);
      for (var i = 0; i < table.length; i++) {
        table[i] = initialize_( f, h - 1, from + (i * step)
                              , Math.min(from + ((i + 1) * step), to));
        lengths[i] = length(table[i]) + (i > 0 ? lengths[i-1] : 0);
      }
      return { ctor:"_Array", height:h, table:table, lengths:lengths };
    }

    function fromList(list) {
      if (list == List.Nil) { return empty; }

      // Allocate M sized blocks (table) and write list elements to it.
      var table = new Array(M);
      var nodes = new Array();
      var i = 0;

      while (list.ctor !== '[]') {
        table[i] = list._0;
        list = list._1;
        i++;

        // table is full, so we can push a leaf containing it into the
        // next node.
        if (i == M) {
          fromListPush({ ctor:"_Array", height:0, table:table }
                      , nodes);
          table = new Array(M);
          i = 0;
        }
      }

      // Maybe there is something left on the table.
      if (i > 0) {
        fromListPush({ ctor:"_Array", height:0, table:table.splice(0,i) }
                    , nodes);
      }

      // Go through all of the nodes and eventually push them into higher nodes.
      for (var h = 0; h < nodes.length - 1; h++) {
        if (nodes[h].table.length > 0) {
          fromListPush(nodes[h], nodes);
        }
      }

      var head = nodes[nodes.length - 1];
      if (head.height > 0 && head.table.length == 1) {
        return head.table[0];
      } else {
        return head;
      }
    }

    // Push a node into a higher node as a child.
    function fromListPush(toPush, nodes) {
      var h = toPush.height;

      // Maybe the node on this height does not exist.
      if (nodes.length == h) {
        nodes.push({ ctor:"_Array", height:h + 1
                                  , table:new Array()
                                  , lengths:new Array() });
      }

      nodes[h].table.push(toPush);
      var len = length(toPush);
      if (nodes[h].lengths.length > 0) {
        len += nodes[h].lengths[nodes[h].lengths.length - 1];
      }
      nodes[h].lengths.push(len);

      if (nodes[h].table.length == M) {
        fromListPush(nodes[h], nodes);
        nodes[h] = { ctor:"_Array", height:h + 1
                                  , table:new Array()
                                  , lengths:new Array() };
      }
    }

    // Pushes an item via push_ to the bottom right of a tree.
    function push(item, a) {
      var pushed = push_(item, a);
      if (pushed !== null) {
        return pushed;
      }

      var newTree = create(item, a.height);
      return siblise(a, newTree);
    }

    // Recursively tries to push an item to the bottom-right most
    // tree possible. If there is no space left for the item,
    // null will be returned.
    function push_(item, a) {
      // Handle resursion stop at leaf level.
      if (a.height == 0) {
        if (a.table.length < M) {
          var newA = { ctor:"_Array", height:0, table:a.table.slice() };
          newA.table.push(item);
          return newA;
        } else {
          return null;
        }
      }

      // Recursively push
      var pushed = push_(item, botRight(a));

      // There was space in the bottom right tree, so the slot will
      // be updated.
      if (pushed != null) {
        var newA = nodeCopy(a);
        newA.table[newA.table.length - 1] = pushed;
        newA.lengths[newA.lengths.length - 1]++;
        return newA
      }

      // When there was no space left, check if there is space left
      // for a new slot with a tree which contains only the item
      // at the bottom.
      if (a.table.length < M) {
        var newSlot = create(item, a.height - 1);
        var newA = nodeCopy(a);
        newA.table.push(newSlot);
        newA.lengths.push(newA.lengths[newA.lengths.length - 1] + length(newSlot));
        return newA
      } else {
        return null;
      }
    }

    // Converts an array into a list of elements.
    function toList(a) {
      return toList_(List.Nil, a);
    }

    function toList_(list, a) {
      for (var i = a.table.length - 1; i >= 0; i--) {
        list = a.height == 0 ? List.Cons(a.table[i], list) : toList_(list, a.table[i]);
      }
      return list;
    }

    // Maps a function over the elements of an array.
    function map(f, a) {
      var newA = { ctor:"_Array", height:a.height, table:new Array(a.table) };
      if (a.height > 0) { newA.lengths = a.lengths; }
      for (var i = 0; i < a.table.length; i++) {
        newA.table[i] = a.height == 0 ? f(a.table[i]) : map(f, a.table[i]);
      }
      return newA;
    }

    // Maps a function over the elements with their index as first argument.
    function indexedMap(f, a) {
      return indexedMap_(f, a, 0);
    }

    function indexedMap_(f, a, from) {
      var newA = { ctor:"_Array", height:a.height, table:new Array(a.table) };
      if (a.height > 0) { newA.lengths = a.lengths; }
      for (var i = 0; i < a.table.length; i++) {
        newA.table[i] = a.height == 0 ? A2(f, from + i, a.table[i])
                                      : indexedMap_( f, a.table[i]
                                                   , i == 0 ? 0 : a.lengths[i - 1]);
      }
      return newA;
    }

    function foldl(f, b, a) {
      if (a.height == 0) {
        for (var i = 0; i < a.table.length; i++) {
          b = A2(f, a.table[i], b);
        }
      } else {
        for (var i = 0; i < a.table.length; i++) {
          b = foldl(f, b, a.table[i]);
        }
      }
      return b;
    }

    function foldr(f, b, a) {
      if (a.height == 0) {
        for (var i = a.table.length; i--; ) {
          b = A2(f, a.table[i], b);
        }
      } else {
        for (var i = a.table.length; i--; ) {
          b = foldl(f, b, a.table[i]);
        }
      }
      return b;
    }

    // TODO: currently, it slices the right, then the left. This can be
    // optimized.
    function slice(from, to, a) {
      if (from < 0) { from += length(a); }
      if (to < 0)   { to += length(a); }
      return sliceLeft(from, sliceRight(to, a));
    }

    function sliceRight(to, a) {
      if (to == length(a)) {
        return a;
      }

      // Handle leaf level.
      if (a.height == 0) {
        var newA = { ctor:"_Array", height:0 };
        newA.table = a.table.slice(0, to);
        return newA;
      }

      // Slice the right recursively.
      var right = getSlot(to, a);
      var sliced = sliceRight(to - (right > 0 ? a.lengths[right - 1] : 0), a.table[right]);

      // Maybe the a node is not even needed, as sliced contains the whole slice.
      if (right == 0) {
        return sliced;
      }

      // Create new node.
      var newA = { ctor:"_Array", height:a.height
                                , table:a.table.slice(0, right)
                                , lengths:a.lengths.slice(0, right) };
      if (sliced.table.length > 0) {
        newA.table[right] = sliced;
        newA.lengths[right] = length(sliced) + (right > 0 ? newA.lengths[right - 1] : 0);
      }
      return newA;
    }

    function sliceLeft(from, a) {
      if (from == 0) {
        return a;
      }

      // Handle leaf level.
      if (a.height == 0) {
        var newA = { ctor:"_Array", height:0 };
        newA.table = a.table.slice(from, a.table.length + 1);
        return newA;
      }

      // Slice the left recursively.
      var left = getSlot(from, a);
      var sliced = sliceLeft(from - (left > 0 ? a.lengths[left - 1] : 0), a.table[left]);

      // Maybe the a node is not even needed, as sliced contains the whole slice.
      if (left == a.table.length - 1) {
        return sliced;
      }

      // Create new node.
      var newA = { ctor:"_Array", height:a.height
                                , table:a.table.slice(left, a.table.length + 1)
                                , lengths:new Array(a.table.length - left) };
      newA.table[0] = sliced;
      var len = 0;
      for (var i = 0; i < newA.table.length; i++) {
        len += length(newA.table[i]);
        newA.lengths[i] = len;
      }

      return newA;
    }

    // Appends two trees.
    function append(a,b) {
      if (a.table.length === 0) {
        return b;
      }
      if (b.table.length === 0) {
        return a;
      }

      var c = append_(a, b);

      // Check if both nodes can be crunshed together.
      if (c[0].table.length + c[1].table.length <= M) {
        if (c[0].table.length === 0) {
          return c[1];
        }
        if (c[1].table.length === 0) {
          return c[0];
        }

        // Adjust .table and .lengths
        c[0].table = c[0].table.concat(c[1].table);
        if (c[0].height > 0) {
          var len = length(c[0]);
          for (var i = 0; i < c[1].lengths.length; i++) {
            c[1].lengths[i] += len;
          }
          c[0].lengths = c[0].lengths.concat(c[1].lengths);
        }

        return c[0];
      }

      if (c[0].height > 0) {
        var toRemove = calcToRemove(a, b);
        if (toRemove > E) {
          c = shuffle(c[0], c[1], toRemove);
        }
      }

      return siblise(c[0], c[1]);
    }

    // Returns an array of two nodes; right and left. One node _may_ be empty.
    function append_(a, b) {
      if (a.height === 0 && b.height === 0) {
        return [a, b];
      }

      if (a.height !== 1 || b.height !== 1) {
        if (a.height === b.height) {
          a = nodeCopy(a);
          b = nodeCopy(b);
          var appended = append_(botRight(a), botLeft(b));

          insertRight(a, appended[1]);
          insertLeft(b, appended[0]);
        } else if (a.height > b.height) {
          a = nodeCopy(a);
          var appended = append_(botRight(a), b);

          insertRight(a, appended[0]);
          b = parentise(appended[1], appended[1].height + 1);
        } else {
          b = nodeCopy(b);
          var appended = append_(a, botLeft(b));

          var left = appended[0].table.length === 0 ? 0 : 1;
          var right = left === 0 ? 1 : 0;
          insertLeft(b, appended[left]);
          a = parentise(appended[right], appended[right].height + 1);
        }
      }

      // Check if balancing is needed and return based on that.
      if (a.table.length === 0 || b.table.length === 0) {
        return [a,b];
      }

      var toRemove = calcToRemove(a, b);
      if (toRemove <= E) {
        return [a,b];
      }
      return shuffle(a, b, toRemove);
    }

    // Helperfunctions for append_. Replaces a child node at the side of the parent.
    function insertRight(parent, node) {
      var index = parent.table.length - 1;
      parent.table[index] = node;
      parent.lengths[index] = length(node)
      parent.lengths[index] += index > 0 ? parent.lengths[index - 1] : 0;
    }

    function insertLeft(parent, node) {
      if (node.table.length > 0) {
        parent.table[0] = node;
        parent.lengths[0] = length(node);

        var len = length(parent.table[0]);
        for (var i = 1; i < parent.lengths.length; i++) {
          len += length(parent.table[i]);
          parent.lengths[i] = len;
        }
      } else {
        parent.table.shift();
        for (var i = 1; i < parent.lengths.length; i++) {
          parent.lengths[i] = parent.lengths[i] - parent.lengths[0];
        }
        parent.lengths.shift();
      }
    }

    // Returns the extra search steps for E. Refer to the paper.
    function calcToRemove(a, b) {
      var subLengths = 0;
      for (var i = 0; i < a.table.length; i++) {
        subLengths += a.table[i].table.length;
      }
      for (var i = 0; i < b.table.length; i++) {
        subLengths += b.table[i].table.length;
      }

      var toRemove = a.table.length + b.table.length
      return toRemove - (Math.floor((subLengths - 1) / M) + 1);
    }

    // get2, set2 and saveSlot are helpers for accessing elements over two arrays.
    function get2(a, b, index) {
      return index < a.length ? a[index] : b[index - a.length];
    }

    function set2(a, b, index, value) {
      if (index < a.length) {
        a[index] = value;
      } else {
        b[index - a.length] = value;
      }
    }

    function saveSlot(a, b, index, slot) {
      set2(a.table, b.table, index, slot);

      var l = (index == 0 || index == a.lengths.length) ?
                0 : get2(a.lengths, a.lengths, index - 1);
      set2(a.lengths, b.lengths, index, l + length(slot));
    }

    // Creates a node or leaf with a given length at their arrays for perfomance.
    // Is only used by shuffle.
    function createNode(h, length) {
      if (length < 0) { length = 0; }
      var a = { ctor:"_Array", height:h, table:new Array(length) };
      if (h > 0) {
        a.lengths = new Array(length);
      }
      return a;
    }

    // Returns an array of two balanced nodes.
    function shuffle(a, b, toRemove) {
      var newA = createNode(a.height, Math.min(M, a.table.length + b.table.length - toRemove));
      var newB = createNode(a.height, newA.table.length - (a.table.length + b.table.length - toRemove));

      // Skip the slots with size M. More precise: copy the slot references
      // to the new node
      var read = 0;
      while (get2(a.table, b.table, read).table.length % M == 0) {
        set2(newA.table, newB.table, read, get2(a.table, b.table, read));
        set2(newA.lengths, newB.lengths, read, get2(a.lengths, b.lengths, read));
        read++;
      }

      // Pulling items from left to right, caching in a slot before writing
      // it into the new nodes.
      var write = read;
      var slot = new createNode(a.height - 1, 0);
      var from = 0;

      // If the current slot is still containing data, then there will be at
      // least one more write, so we do not break this loop yet.
      while (read - write - (slot.table.length > 0 ? 1 : 0) < toRemove) {
        // Find out the max possible items for copying.
        var source = get2(a.table, b.table, read);
        var to = Math.min(M - slot.table.length, source.table.length)

        // Copy and adjust size table.
        slot.table = slot.table.concat(source.table.slice(from, to));
        if (slot.height > 0) {
          var len = slot.lengths.length;
          for (var i = len; i < len + to - from; i++) {
            slot.lengths[i] = length(slot.table[i]);
            slot.lengths[i] += (i > 0 ? slot.lengths[i - 1] : 0);
          }
        }

        from += to;

        // Only proceed to next slots[i] if the current one was
        // fully copied.
        if (source.table.length <= to) {
          read++; from = 0;
        }

        // Only create a new slot if the current one is filled up.
        if (slot.table.length == M) {
          saveSlot(newA, newB, write, slot);
          slot = createNode(a.height - 1,0);
          write++;
        }
      }

      // Cleanup after the loop. Copy the last slot into the new nodes.
      if (slot.table.length > 0) {
        saveSlot(newA, newB, write, slot);
        write++;
      }

      // Shift the untouched slots to the left
      while (read < a.table.length + b.table.length ) {
        saveSlot(newA, newB, write, get2(a.table, b.table, read));
        read++; write++;
      }

      return [newA, newB];
    }

    // Navigation functions
    function botRight(a) { return a.table[a.table.length - 1]; }
    function botLeft(a)  { return a.table[0]; }

    // Copies a node for updating. Note that you should not use this if
    // only updating only one of "table" or "lengths" for performance reasons.
    function nodeCopy(a) {
      var newA = { ctor:"_Array", height:a.height
                                , table:a.table.slice() };
      if (a.height > 0) { newA.lengths = a.lengths.slice(); }
      return newA;
    }

    // Returns how many items are in the tree.
    function length(array) {
      if (array.height == 0) {
        return array.table.length;
      } else {
        return array.lengths[array.lengths.length - 1];
      }
    }

    // Calculates in which slot of "table" the item probably is, then
    // find the exact slot via forward searching in  "lengths". Returns the index.
    function getSlot(i, a) {
      var slot = i >> (5 * a.height);
      while (a.lengths[slot] <= i) {
        slot++;
      }
      return slot;
    }

    // Recursively creates a tree with a given height containing
    // only the given item.
    function create(item, h) {
      if (h == 0) {
        return { ctor:"_Array", height:0
                              , table:[item] };
      } else {
        return { ctor:"_Array", height:h
                              , table:[create(item, h - 1)]
                              , lengths:[1] };
      }
    }

    // Recursively creates a tree that contains the given tree.
    function parentise(tree, h) {
      if (h == tree.height) {
        return tree;
      } else {
        return { ctor:"_Array", height:h
                              , table:[parentise(tree, h - 1)]
                              , lengths:[length(tree)] };
      }
    }

    // Emphasizes blood brotherhood beneath two trees.
    function siblise(a, b) {
      return { ctor:"_Array", height:a.height + 1
                            , table:[a, b]
                            , lengths:[length(a), length(a) + length(b)] };
    }

    function toJSArray(a) {
      var jsArray = new Array(length(a));
      toJSArray_(jsArray, 0, a);
      return jsArray;
    }

    function toJSArray_(jsArray, i, a) {
      for (var t = 0; t < a.table.length; t++) {
        if (a.height == 0) {
          jsArray[i + t] = a.table[t];
        } else {
          var inc = t == 0 ? 0 : a.lengths[t - 1];
          toJSArray_(jsArray, i + inc, a.table[t]);
        }
      }
    }

    function fromJSArray(jsArray) {
      if (jsArray.length == 0) { return empty; }
      var h = Math.floor(Math.log(jsArray.length) / Math.log(M));
      return fromJSArray_(jsArray, h, 0, jsArray.length);
    }

    function fromJSArray_(jsArray, h, from, to) {
      if (h == 0) {
        return { ctor:"_Array", height:0
                              , table:jsArray.slice(from, to) };
      }

      var step = Math.pow(M, h);
      var table = new Array(Math.ceil((to - from) / step));
      var lengths = new Array(table.length);
      for (var i = 0; i < table.length; i++) {
        table[i] = fromJSArray_( jsArray, h - 1, from + (i * step)
                               , Math.min(from + ((i + 1) * step), to));
        lengths[i] = length(table[i]) + (i > 0 ? lengths[i-1] : 0);
      }
      return { ctor:"_Array", height:h, table:table, lengths:lengths };
    }

    Elm.Native.Array.values = {
      empty:empty,
      fromList:fromList,
      toList:toList,
      initialize:F2(initialize),
      append:F2(append),
      push:F2(push),
      slice:F3(slice),
      get:F2(get),
      set:F3(set),
      map:F2(map),
      indexedMap:F2(indexedMap),
      foldl:F3(foldl),
      foldr:F3(foldr),
      length:length,

      toJSArray:toJSArray,
      fromJSArray:fromJSArray
    };

    return elm.Native.Array.values = Elm.Native.Array.values;
}


Elm.Native.Basics = {};
Elm.Native.Basics.make = function(elm) {
  elm.Native = elm.Native || {};
  elm.Native.Basics = elm.Native.Basics || {};
  if (elm.Native.Basics.values) return elm.Native.Basics.values;

  var Utils = Elm.Native.Utils.make(elm);

  function div(a, b) {
      return (a/b)|0;
  }
  function rem(a, b) {
      return a % b;
  }
  function mod(a, b) {
        if (b === 0) {
            throw new Error("Cannot perform mod 0. Division by zero error.");
        }
        var r = a % b;
        var m = a === 0 ? 0 : (b > 0 ? (a >= 0 ? r : r+b) : -mod(-a,-b));

        return m === b ? 0 : m;
  }
  function logBase(base, n) {
      return Math.log(n) / Math.log(base);
  }
  function negate(n) {
      return -n;
  }
  function abs(n) {
      return n < 0 ? -n : n;
  }

  function min(a, b) {
      return Utils.cmp(a,b) < 0 ? a : b;
  }
  function max(a, b) {
      return Utils.cmp(a,b) > 0 ? a : b;
  }
  function clamp(lo, hi, n) {
      return Utils.cmp(n,lo) < 0 ? lo : Utils.cmp(n,hi) > 0 ? hi : n;
  }

  function xor(a, b) {
      return a !== b;
  }
  function not(b) {
      return !b;
  }
  function isInfinite(n) {
      return n === Infinity || n === -Infinity
  }

  function truncate(n) {
      return n|0;
  }

  function degrees(d) {
      return d * Math.PI / 180;
  }
  function turns(t) {
      return 2 * Math.PI * t;
  }
  function fromPolar(point) {
      var r = point._0;
      var t = point._1;
      return Utils.Tuple2(r * Math.cos(t), r * Math.sin(t));
  }
  function toPolar(point) {
      var x = point._0;
      var y = point._1;
      return Utils.Tuple2(Math.sqrt(x * x + y * y), Math.atan2(y,x));
  }

  var basics = {
      div: F2(div),
      rem: F2(rem),
      mod: F2(mod),

      pi: Math.PI,
      e: Math.E,
      cos: Math.cos,
      sin: Math.sin,
      tan: Math.tan,
      acos: Math.acos,
      asin: Math.asin,
      atan: Math.atan,
      atan2: F2(Math.atan2),

      degrees:  degrees,
      turns:  turns,
      fromPolar:  fromPolar,
      toPolar:  toPolar,

      sqrt: Math.sqrt,
      logBase: F2(logBase),
      negate: negate,
      abs: abs,
      min: F2(min),
      max: F2(max),
      clamp: F3(clamp),
      compare: Utils.compare,

      xor: F2(xor),
      not: not,

      truncate: truncate,
      ceiling: Math.ceil,
      floor: Math.floor,
      round: Math.round,
      toFloat: function(x) { return x; },
      isNaN: isNaN,
      isInfinite: isInfinite
  };

  return elm.Native.Basics.values = basics;
};

Elm.Native.Char = {};
Elm.Native.Char.make = function(elm) {
    elm.Native = elm.Native || {};
    elm.Native.Char = elm.Native.Char || {};
    if (elm.Native.Char.values) return elm.Native.Char.values;

    var Utils = Elm.Native.Utils.make(elm);

    function isBetween(lo,hi) { return function(chr) {
	var c = chr.charCodeAt(0);
	return lo <= c && c <= hi;
    };
                              }
    var isDigit = isBetween('0'.charCodeAt(0),'9'.charCodeAt(0));
    var chk1 = isBetween('a'.charCodeAt(0),'f'.charCodeAt(0));
    var chk2 = isBetween('A'.charCodeAt(0),'F'.charCodeAt(0));

    return elm.Native.Char.values = {
        fromCode : function(c) { return String.fromCharCode(c); },
        toCode   : function(c) { return c.toUpperCase().charCodeAt(0); },
        toUpper  : function(c) { return Utils.chr(c.toUpperCase()); },
        toLower  : function(c) { return Utils.chr(c.toLowerCase()); },
        toLocaleUpper : function(c) { return Utils.chr(c.toLocaleUpperCase()); },
        toLocaleLower : function(c) { return Utils.chr(c.toLocaleLowerCase()); },
        isLower    : isBetween('a'.charCodeAt(0),'z'.charCodeAt(0)),
        isUpper    : isBetween('A'.charCodeAt(0),'Z'.charCodeAt(0)),
        isDigit    : isDigit,
        isOctDigit : isBetween('0'.charCodeAt(0),'7'.charCodeAt(0)),
        isHexDigit : function(c) { return isDigit(c) || chk1(c) || chk2(c); }
    };
};

Elm.Native.Color = {};
Elm.Native.Color.make = function(elm) {
    elm.Native = elm.Native || {};
    elm.Native.Color = elm.Native.Color || {};
    if (elm.Native.Color.values) return elm.Native.Color.values;

    function toCss(c) {
        var format = '';
        var colors = '';
        if (c.ctor === 'RGBA') {
            format = 'rgb';
            colors = c._0 + ', ' + c._1 + ', ' + c._2;
        } else {
            format = 'hsl';
            colors = (c._0 * 180 / Math.PI) + ', ' +
                     (c._1 * 100) + '%, ' +
                     (c._2 * 100) + '%';
        }
        if (c._3 === 1) {
            return format + '(' + colors + ')';
        } else {
            return format + 'a(' + colors + ', ' + c._3 + ')';
        }
    }

    return elm.Native.Color.values = {
        toCss:toCss
    };

};

Elm.Native.Debug = {};
Elm.Native.Debug.make = function(elm) {
    elm.Native = elm.Native || {};
    elm.Native.Debug = elm.Native.Debug || {};
    if (elm.Native.Debug.values) return elm.Native.Debug.values;
    if ('values' in Elm.Native.Debug)
        return elm.Native.Debug.values = Elm.Native.Debug.values;

    var toString = Elm.Native.Show.make(elm).toString;
    var replace = Elm.Native.Utils.make(elm).replace;

    function log(tag, value) {
        var msg = tag + ': ' + toString(value);
        var process = process || {};
        if (process.stdout) {
            process.stdout.write(msg);
        } else {
            console.log(msg);
        }
        return value;
    }

    function crash(message) {
        throw new Error(message);
    }

    function tracePath(debugId, form) {
        return replace([["debugTracePathId",debugId]], form);
    }

    function WatchTracker() {
        this.frames = [{}];
        this.clear = function() {
            this.watches = {};
        };
        this.pushFrame = function() {
            var lastFrame = this.frames[this.frames.length - 1];
            this.frames.push(lastFrame);
        }
        this.notify = function(tag, value) {
            this.frames[this.frames.length - 1][tag] = value;
        };
    }
    var watchTracker = new WatchTracker();

    function watch(tag, value) {
        watchTracker.notify(tag, value);
        return value;
    }

    function watchSummary(tag, f, value) {
        watchTracker.notify(tag, f(value));
        return value;
    }

    Elm.Native.Debug.values = {
        crash: crash,
        tracePath: F2(tracePath),
        log: F2(log),
        watch: F2(watch),
        watchSummary:F3(watchSummary),
        watchTracker: watchTracker
    };
    return elm.Native.Debug.values = Elm.Native.Debug.values;
};


// setup
Elm.Native = Elm.Native || {};
Elm.Native.Graphics = Elm.Native.Graphics || {};
Elm.Native.Graphics.Element = Elm.Native.Graphics.Element || {};

// definition
Elm.Native.Graphics.Element.make = function(localRuntime) {
    'use strict';

    // attempt to short-circuit
    if ('values' in Elm.Native.Graphics.Element) {
        return Elm.Native.Graphics.Element.values;
    }

    var Color = Elm.Native.Color.make(localRuntime);
    var List = Elm.Native.List.make(localRuntime);
    var Utils = Elm.Native.Utils.make(localRuntime);


    function createNode(elementType) {
        var node = document.createElement(elementType);
        node.style.padding = "0";
        node.style.margin = "0";
        return node;
    }

    function setProps(elem, node) {
        var props = elem.props;

        var element = elem.element;
        var width = props.width - (element.adjustWidth || 0);
        var height = props.height - (element.adjustHeight || 0);
        node.style.width  = (width |0) + 'px';
        node.style.height = (height|0) + 'px';

        if (props.opacity !== 1) {
            node.style.opacity = props.opacity;
        }

        if (props.color.ctor === 'Just') {
            node.style.backgroundColor = Color.toCss(props.color._0);
        }

        if (props.tag !== '') {
            node.id = props.tag;
        }

        if (props.hover.ctor !== '_Tuple0') {
            addHover(node, props.hover);
        }

        if (props.click.ctor !== '_Tuple0') {
            addClick(node, props.click);
        }

        if (props.href !== '') {
            var anchor = createNode('a');
            anchor.href = props.href;
            anchor.style.display = 'block';
            anchor.style.pointerEvents = 'auto';
            anchor.appendChild(node);
            node = anchor;
        }

        return node;
    }

    function addClick(e, handler) {
        e.style.pointerEvents = 'auto';
        e.elm_click_handler = handler;
        function trigger(ev) {
            e.elm_click_handler(Utils.Tuple0);
            ev.stopPropagation();
        }
        e.elm_click_trigger = trigger;
        e.addEventListener('click', trigger);
    }

    function removeClick(e, handler) {
        if (e.elm_click_trigger) {
            e.removeEventListener('click', e.elm_click_trigger);
            e.elm_click_trigger = null;
            e.elm_click_handler = null;
        }
    }

    function addHover(e, handler) {
        e.style.pointerEvents = 'auto';
        e.elm_hover_handler = handler;
        e.elm_hover_count = 0;

        function over(evt) {
            if (e.elm_hover_count++ > 0) return;
            e.elm_hover_handler(true);
            evt.stopPropagation();
        }
        function out(evt) {
            if (e.contains(evt.toElement || evt.relatedTarget)) return;
            e.elm_hover_count = 0;
            e.elm_hover_handler(false);
            evt.stopPropagation();
        }
        e.elm_hover_over = over;
        e.elm_hover_out = out;
        e.addEventListener('mouseover', over);
        e.addEventListener('mouseout', out);
    }

    function removeHover(e) {
        e.elm_hover_handler = null;
        if (e.elm_hover_over) {
            e.removeEventListener('mouseover', e.elm_hover_over);
            e.elm_hover_over = null;
        }
        if (e.elm_hover_out) {
            e.removeEventListener('mouseout', e.elm_hover_out);
            e.elm_hover_out = null;
        }
    }

    function image(props, img) {
        switch (img._0.ctor) {
        case 'Plain':   return plainImage(img._3);
        case 'Fitted':  return fittedImage(props.width, props.height, img._3);
        case 'Cropped': return croppedImage(img,props.width,props.height,img._3);
        case 'Tiled':   return tiledImage(img._3);
        }
    }

    function plainImage(src) {
        var img = createNode('img');
        img.src = src;
        img.name = src;
        img.style.display = "block";
        return img;
    }

    function tiledImage(src) {
        var div = createNode('div');
        div.style.backgroundImage = 'url(' + src + ')';
        return div;
    }

    function fittedImage(w, h, src) {
        var div = createNode('div');
        div.style.background = 'url(' + src + ') no-repeat center';
        div.style.webkitBackgroundSize = 'cover';
        div.style.MozBackgroundSize = 'cover';
        div.style.OBackgroundSize = 'cover';
        div.style.backgroundSize = 'cover';
        return div;
    }

    function croppedImage(elem, w, h, src) {
        var pos = elem._0._0;
        var e = createNode('div');
        e.style.overflow = "hidden";

        var img = createNode('img');
        img.onload = function() {
            var sw = w / elem._1, sh = h / elem._2;
            img.style.width = ((this.width * sw)|0) + 'px';
            img.style.height = ((this.height * sh)|0) + 'px';
            img.style.marginLeft = ((- pos._0 * sw)|0) + 'px';
            img.style.marginTop = ((- pos._1 * sh)|0) + 'px';
        };
        img.src = src;
        img.name = src;
        e.appendChild(img);
        return e;
    }

    function goOut(node) {
        node.style.position = 'absolute';
        return node;
    }
    function goDown(node) {
        return node;
    }
    function goRight(node) {
        node.style.styleFloat = 'left';
        node.style.cssFloat = 'left';
        return node;
    }

    var directionTable = {
        DUp    : goDown,
        DDown  : goDown,
        DLeft  : goRight,
        DRight : goRight,
        DIn    : goOut,
        DOut   : goOut
    };
    function needsReversal(dir) {
        return dir == 'DUp' || dir == 'DLeft' || dir == 'DIn';
    }

    function flow(dir,elist) {
        var array = List.toArray(elist);
        var container = createNode('div');
        var goDir = directionTable[dir];
        if (goDir == goOut) {
            container.style.pointerEvents = 'none';
        }
        if (needsReversal(dir)) {
            array.reverse();
        }
        var len = array.length;
        for (var i = 0; i < len; ++i) {
            container.appendChild(goDir(render(array[i])));
        }
        return container;
    }

    function toPos(pos) {
        switch(pos.ctor) {
        case "Absolute": return  pos._0 + "px";
        case "Relative": return (pos._0 * 100) + "%";
        }
    }

    // must clear right, left, top, bottom, and transform
    // before calling this function
    function setPos(pos,elem,e) {
        var element = elem.element;
        var props = elem.props;
        var w = props.width + (element.adjustWidth ? element.adjustWidth : 0);
        var h = props.height + (element.adjustHeight ? element.adjustHeight : 0);

        e.style.position = 'absolute';
        e.style.margin = 'auto';
        var transform = '';
        switch(pos.horizontal.ctor) {
        case 'P': e.style.right = toPos(pos.x); e.style.removeProperty('left'); break;
        case 'Z': transform = 'translateX(' + ((-w/2)|0) + 'px) ';
        case 'N': e.style.left = toPos(pos.x); e.style.removeProperty('right'); break;
        }
        switch(pos.vertical.ctor) {
        case 'N': e.style.bottom = toPos(pos.y); e.style.removeProperty('top'); break;
        case 'Z': transform += 'translateY(' + ((-h/2)|0) + 'px)';
        case 'P': e.style.top = toPos(pos.y); e.style.removeProperty('bottom'); break;
        }
        if (transform !== '') {
            addTransform(e.style, transform);
        }
        return e;
    }

    function addTransform(style, transform) {
        style.transform       = transform;
        style.msTransform     = transform;
        style.MozTransform    = transform;
        style.webkitTransform = transform;
        style.OTransform      = transform;
    }

    function container(pos,elem) {
        var e = render(elem);
        setPos(pos, elem, e);
        var div = createNode('div');
        div.style.position = 'relative';
        div.style.overflow = 'hidden';
        div.appendChild(e);
        return div;
    }

    function rawHtml(elem) {
        var html = elem.html;
        var guid = elem.guid;
        var align = elem.align;

        var div = createNode('div');
        div.innerHTML = html;
        div.style.visibility = "hidden";
        if (align) {
            div.style.textAlign = align;
        }
        div.style.visibility = 'visible';
        div.style.pointerEvents = 'auto';
        return div;
    }

    function render(elem) {
        return setProps(elem, makeElement(elem));
    }
    function makeElement(e) {
        var elem = e.element;
        switch(elem.ctor) {
        case 'Image':     return image(e.props, elem);
        case 'Flow':      return flow(elem._0.ctor, elem._1);
        case 'Container': return container(elem._0, elem._1);
        case 'Spacer':    return createNode('div');
        case 'RawHtml':   return rawHtml(elem);
        case 'Custom':    return elem.render(elem.model);
        }
    }

    function updateAndReplace(node, curr, next) {
        var newNode = update(node, curr, next);
        if (newNode !== node) {
            node.parentNode.replaceChild(newNode, node);
        }
        return newNode;
    }

    function update(node, curr, next) {
        var rootNode = node;
        if (node.tagName === 'A') {
            node = node.firstChild;
        }
        if (curr.props.id === next.props.id) {
            updateProps(node, curr, next);
            return rootNode;
        }
        if (curr.element.ctor !== next.element.ctor) {
            return render(next);
        }
        var nextE = next.element;
        var currE = curr.element;
        switch(nextE.ctor) {
        case "Spacer":
            updateProps(node, curr, next);
            return rootNode;

        case "RawHtml":
            // only markdown blocks have guids, so this must be a text block
            if (nextE.guid === null) {
                if(currE.html.valueOf() !== nextE.html.valueOf()) {
                    node.innerHTML = nextE.html;
                }
                updateProps(node, curr, next);
                return rootNode;
            }
            if (nextE.guid !== currE.guid) {
                return render(next);
            }
            updateProps(node, curr, next);
            return rootNode;

        case "Image":
            if (nextE._0.ctor === 'Plain') {
                if (nextE._3 !== currE._3) {
                    node.src = nextE._3;
                }
            } else if (!Utils.eq(nextE,currE) ||
                       next.props.width !== curr.props.width ||
                       next.props.height !== curr.props.height) {
                return render(next);
            }
            updateProps(node, curr, next);
            return rootNode;

        case "Flow":
            var arr = List.toArray(nextE._1);
            for (var i = arr.length; i--; ) {
                arr[i] = arr[i].element.ctor;
            }
            if (nextE._0.ctor !== currE._0.ctor) {
                return render(next);
            }
            var nexts = List.toArray(nextE._1);
            var kids = node.childNodes;
            if (nexts.length !== kids.length) {
                return render(next);
            }
            var currs = List.toArray(currE._1);
            var dir = nextE._0.ctor;
            var goDir = directionTable[dir];
            var toReverse = needsReversal(dir);
            var len = kids.length;
            for (var i = len; i-- ;) {
                var subNode = kids[toReverse ? len - i - 1 : i];
                goDir(updateAndReplace(subNode, currs[i], nexts[i]));
            }
            updateProps(node, curr, next);
            return rootNode;

        case "Container":
            var subNode = node.firstChild;
            var newSubNode = updateAndReplace(subNode, currE._1, nextE._1);
            setPos(nextE._0, nextE._1, newSubNode);
            updateProps(node, curr, next);
            return rootNode;

        case "Custom":
            if (currE.type === nextE.type) {
                var updatedNode = nextE.update(node, currE.model, nextE.model);
                updateProps(updatedNode, curr, next);
                return updatedNode;
            } else {
                return render(next);
            }
        }
    }

    function updateProps(node, curr, next) {
        var nextProps = next.props;
        var currProps = curr.props;

        var element = next.element;
        var width = nextProps.width - (element.adjustWidth || 0);
        var height = nextProps.height - (element.adjustHeight || 0);
        if (width !== currProps.width) {
            node.style.width = (width|0) + 'px';
        }
        if (height !== currProps.height) {
            node.style.height = (height|0) + 'px';
        }

        if (nextProps.opacity !== currProps.opacity) {
            node.style.opacity = nextProps.opacity;
        }

        var nextColor = nextProps.color.ctor === 'Just'
            ? Color.toCss(nextProps.color._0)
            : '';
        if (node.style.backgroundColor !== nextColor) {
            node.style.backgroundColor = nextColor;
        }

        if (nextProps.tag !== currProps.tag) {
            node.id = nextProps.tag;
        }

        if (nextProps.href !== currProps.href) {
            if (currProps.href === '') {
                // add a surrounding href
                var anchor = createNode('a');
                anchor.href = nextProps.href;
                anchor.style.display = 'block';
                anchor.style.pointerEvents = 'auto';

                node.parentNode.replaceChild(anchor, node);
                anchor.appendChild(node);
            } else if (nextProps.href === '') {
                // remove the surrounding href
                var anchor = node.parentNode;
                anchor.parentNode.replaceChild(node, anchor);
            } else {
                // just update the link
                node.parentNode.href = nextProps.href;
            }
        }

        // update click and hover handlers
        var removed = false;

        // update hover handlers
        if (currProps.hover.ctor === '_Tuple0') {
            if (nextProps.hover.ctor !== '_Tuple0') {
                addHover(node, nextProps.hover);
            }
        }
        else {
            if (nextProps.hover.ctor === '_Tuple0') {
                removed = true;
                removeHover(node);
            }
            else {
                node.elm_hover_handler = nextProps.hover;
            }
        }

        // update click handlers
        if (currProps.click.ctor === '_Tuple0') {
            if (nextProps.click.ctor !== '_Tuple0') {
                addClick(node, nextProps.click);
            }
        }
        else {
            if (nextProps.click.ctor === '_Tuple0') {
                removed = true;
                removeClick(node);
            } else {
                node.elm_click_handler = nextProps.click;
            }
        }

        // stop capturing clicks if
        if (removed
            && nextProps.hover.ctor === '_Tuple0'
            && nextProps.click.ctor === '_Tuple0')
        {
            node.style.pointerEvents = 'none';
        }
    }


    function htmlHeight(width, rawHtml) {
        // create dummy node
        var temp = document.createElement('div');
        temp.innerHTML = rawHtml.html;
        if (width > 0) {
            temp.style.width = width + "px";
        }
        temp.style.visibility = "hidden";
        temp.style.styleFloat = "left";
        temp.style.cssFloat   = "left";

        document.body.appendChild(temp);

        // get dimensions
        var style = window.getComputedStyle(temp, null);
        var w = Math.ceil(style.getPropertyValue("width").slice(0,-2) - 0);
        var h = Math.ceil(style.getPropertyValue("height").slice(0,-2) - 0);
        document.body.removeChild(temp);
        return Utils.Tuple2(w,h);
    }


    return Elm.Native.Graphics.Element.values = {
        render: render,
        update: update,
        updateAndReplace: updateAndReplace,

        createNode: createNode,
        addTransform: addTransform,
        htmlHeight: F2(htmlHeight),
        guid: Utils.guid
    };

};

Elm.Native.Json = {};
Elm.Native.Json.make = function(localRuntime) {
    localRuntime.Native = localRuntime.Native || {};
    localRuntime.Native.Json = localRuntime.Native.Json || {};
    if (localRuntime.Native.Json.values) {
        return localRuntime.Native.Json.values;
    }

    var ElmArray = Elm.Native.Array.make(localRuntime);
    var List = Elm.Native.List.make(localRuntime);
    var Maybe = Elm.Maybe.make(localRuntime);
    var Result = Elm.Result.make(localRuntime);
    var Utils = Elm.Native.Utils.make(localRuntime);


    function crash(expected, actual) {
        throw new Error(
            'expecting ' + expected + ' but got ' + JSON.stringify(actual)
        );
    }


    // PRIMITIVE VALUES

    function decodeNull(successValue) {
        return function(value) {
            if (value === null) {
                return successValue;
            }
            crash('null', value);
        };
    }


    function decodeString(value) {
        if (typeof value === 'string' || value instanceof String) {
            return value;
        }
        crash('a String', value);
    }


    function decodeFloat(value) {
        if (typeof value === 'number') {
            return value;
        }
        crash('a Float', value);
    }


    function decodeInt(value) {
        if (typeof value === 'number' && (value|0) === value) {
            return value;
        }
        crash('an Int', value);
    }


    function decodeBool(value) {
        if (typeof value === 'boolean') {
            return value;
        }
        crash('a Bool', value);
    }


    // ARRAY

    function decodeArray(decoder) {
        return function(value) {
            if (value instanceof Array) {
                var len = value.length;
                var array = new Array(len);
                for (var i = len; i-- ; ) {
                    array[i] = decoder(value[i]);
                }
                return ElmArray.fromJSArray(array);
            }
            crash('an Array', value);
        };
    }


    // LIST

    function decodeList(decoder) {
        return function(value) {
            if (value instanceof Array) {
                var len = value.length;
                var list = List.Nil;
                for (var i = len; i-- ; ) {
                    list = List.Cons( decoder(value[i]), list );
                }
                return list;
            }
            crash('a List', value);
        };
    }


    // MAYBE

    function decodeMaybe(decoder) {
        return function(value) {
            try {
                return Maybe.Just(decoder(value));
            } catch(e) {
                return Maybe.Nothing;
            }
        };
    }


    // FIELDS

    function decodeField(field, decoder) {
        return function(value) {
            var subValue = value[field];
            if (subValue !== undefined) {
                return decoder(subValue);
            }
            crash("an object with field '" + field + "'", value);
        };
    }


    // OBJECTS

    function decodeKeyValuePairs(decoder) {
        return function(value) {
            var isObject =
                typeof value === 'object'
                    && value !== null
                    && !(value instanceof Array);

            if (isObject) {
                var keyValuePairs = List.Nil;
                for (var key in value) {
                    var elmValue = decoder(value[key]);
                    var pair = Utils.Tuple2(key, elmValue);
                    keyValuePairs = List.Cons(pair, keyValuePairs);
                }
                return keyValuePairs;
            }

            crash("an object", value);
        };
    }

    function decodeObject1(f, d1) {
        return function(value) {
            return f(d1(value));
        };
    }

    function decodeObject2(f, d1, d2) {
        return function(value) {
            return A2( f, d1(value), d2(value) );
        };
    }

    function decodeObject3(f, d1, d2, d3) {
        return function(value) {
            return A3( f, d1(value), d2(value), d3(value) );
        };
    }

    function decodeObject4(f, d1, d2, d3, d4) {
        return function(value) {
            return A4( f, d1(value), d2(value), d3(value), d4(value) );
        };
    }

    function decodeObject5(f, d1, d2, d3, d4, d5) {
        return function(value) {
            return A5( f, d1(value), d2(value), d3(value), d4(value), d5(value) );
        };
    }

    function decodeObject6(f, d1, d2, d3, d4, d5, d6) {
        return function(value) {
            return A6( f,
                d1(value),
                d2(value),
                d3(value),
                d4(value),
                d5(value),
                d6(value)
            );
        };
    }

    function decodeObject7(f, d1, d2, d3, d4, d5, d6, d7) {
        return function(value) {
            return A7( f,
                d1(value),
                d2(value),
                d3(value),
                d4(value),
                d5(value),
                d6(value),
                d7(value)
            );
        };
    }

    function decodeObject8(f, d1, d2, d3, d4, d5, d6, d7, d8) {
        return function(value) {
            return A8( f,
                d1(value),
                d2(value),
                d3(value),
                d4(value),
                d5(value),
                d6(value),
                d7(value),
                d8(value)
            );
        };
    }


    // TUPLES

    function decodeTuple1(f, d1) {
        return function(value) {
            if ( !(value instanceof Array) || value.length !== 1 ) {
                crash('a Tuple of length 1', value);
            }
            return f( d1(value[0]) );
        };
    }

    function decodeTuple2(f, d1, d2) {
        return function(value) {
            if ( !(value instanceof Array) || value.length !== 2 ) {
                crash('a Tuple of length 2', value);
            }
            return A2( f, d1(value[0]), d2(value[1]) );
        };
    }

    function decodeTuple3(f, d1, d2, d3) {
        return function(value) {
            if ( !(value instanceof Array) || value.length !== 3 ) {
                crash('a Tuple of length 3', value);
            }
            return A3( f, d1(value[0]), d2(value[1]), d3(value[2]) );
        };
    }


    function decodeTuple4(f, d1, d2, d3, d4) {
        return function(value) {
            if ( !(value instanceof Array) || value.length !== 4 ) {
                crash('a Tuple of length 4', value);
            }
            return A4( f, d1(value[0]), d2(value[1]), d3(value[2]), d4(value[3]) );
        };
    }


    function decodeTuple5(f, d1, d2, d3, d4, d5) {
        return function(value) {
            if ( !(value instanceof Array) || value.length !== 5 ) {
                crash('a Tuple of length 5', value);
            }
            return A5( f,
                d1(value[0]),
                d2(value[1]),
                d3(value[2]),
                d4(value[3]),
                d5(value[4])
            );
        };
    }


    function decodeTuple6(f, d1, d2, d3, d4, d5, d6) {
        return function(value) {
            if ( !(value instanceof Array) || value.length !== 6 ) {
                crash('a Tuple of length 6', value);
            }
            return A6( f,
                d1(value[0]),
                d2(value[1]),
                d3(value[2]),
                d4(value[3]),
                d5(value[4]),
                d6(value[5])
            );
        };
    }

    function decodeTuple7(f, d1, d2, d3, d4, d5, d6, d7) {
        return function(value) {
            if ( !(value instanceof Array) || value.length !== 7 ) {
                crash('a Tuple of length 7', value);
            }
            return A7( f,
                d1(value[0]),
                d2(value[1]),
                d3(value[2]),
                d4(value[3]),
                d5(value[4]),
                d6(value[5]),
                d7(value[6])
            );
        };
    }


    function decodeTuple8(f, d1, d2, d3, d4, d5, d6, d7, d8) {
        return function(value) {
            if ( !(value instanceof Array) || value.length !== 8 ) {
                crash('a Tuple of length 8', value);
            }
            return A8( f,
                d1(value[0]),
                d2(value[1]),
                d3(value[2]),
                d4(value[3]),
                d5(value[4]),
                d6(value[5]),
                d7(value[6]),
                d8(value[7])
            );
        };
    }


    // CUSTOM DECODERS

    function decodeValue(value) {
        return value;
    }

    function runDecoderValue(decoder, value) {
        try {
            return Result.Ok(decoder(value));
        } catch(e) {
            return Result.Err(e.message);
        }
    }

    function customDecoder(decoder, callback) {
        return function(value) {
            var result = callback(decoder(value));
            if (result.ctor === 'Err') {
                throw new Error('custom decoder failed: ' + result._0);
            }
            return result._0;
        }
    }

    function andThen(decode, callback) {
        return function(value) {
            var result = decode(value);
            return callback(result)(value);
        }
    }

    function fail(msg) {
        return function(value) {
            throw new Error(msg);
        }
    }

    function succeed(successValue) {
        return function(value) {
            return successValue;
        }
    }


    // ONE OF MANY

    function oneOf(decoders) {
        return function(value) {
            var errors = [];
            var temp = decoders;
            while (temp.ctor !== '[]') {
                try {
                    return temp._0(value);
                } catch(e) {
                    errors.push(e.message);
                }
                temp = temp._1;
            }
            throw new Error('expecting one of the following:\n    ' + errors.join('\n    '));
        }
    }

    function get(decoder, value) {
        try {
            return Result.Ok(decoder(value));
        } catch(e) {
            return Result.Err(e.message);
        }
    }


    // ENCODE / DECODE

    function runDecoderString(decoder, string) {
        try {
            return Result.Ok(decoder(JSON.parse(string)));
        } catch(e) {
            return Result.Err(e.message);
        }
    }

    function encode(indentLevel, value) {
        return JSON.stringify(value, null, indentLevel);
    }

    function identity(value) {
        return value;
    }

    function encodeObject(keyValuePairs) {
        var obj = {};
        while (keyValuePairs.ctor !== '[]') {
            var pair = keyValuePairs._0;
            obj[pair._0] = pair._1;
            keyValuePairs = keyValuePairs._1;
        }
        return obj;
    }

    return localRuntime.Native.Json.values = {
        encode: F2(encode),
        runDecoderString: F2(runDecoderString),
        runDecoderValue: F2(runDecoderValue),

        get: F2(get),
        oneOf: oneOf,

        decodeNull: decodeNull,
        decodeInt: decodeInt,
        decodeFloat: decodeFloat,
        decodeString: decodeString,
        decodeBool: decodeBool,

        decodeMaybe: decodeMaybe,

        decodeList: decodeList,
        decodeArray: decodeArray,

        decodeField: F2(decodeField),

        decodeObject1: F2(decodeObject1),
        decodeObject2: F3(decodeObject2),
        decodeObject3: F4(decodeObject3),
        decodeObject4: F5(decodeObject4),
        decodeObject5: F6(decodeObject5),
        decodeObject6: F7(decodeObject6),
        decodeObject7: F8(decodeObject7),
        decodeObject8: F9(decodeObject8),
        decodeKeyValuePairs: decodeKeyValuePairs,

        decodeTuple1: F2(decodeTuple1),
        decodeTuple2: F3(decodeTuple2),
        decodeTuple3: F4(decodeTuple3),
        decodeTuple4: F5(decodeTuple4),
        decodeTuple5: F6(decodeTuple5),
        decodeTuple6: F7(decodeTuple6),
        decodeTuple7: F8(decodeTuple7),
        decodeTuple8: F9(decodeTuple8),

        andThen: F2(andThen),
        decodeValue: decodeValue,
        customDecoder: F2(customDecoder),
        fail: fail,
        succeed: succeed,

        identity: identity,
        encodeNull: null,
        encodeArray: ElmArray.toJSArray,
        encodeList: List.toArray,
        encodeObject: encodeObject

    };

};

Elm.Native.List = {};
Elm.Native.List.make = function(elm) {
    elm.Native = elm.Native || {};
    elm.Native.List = elm.Native.List || {};
    if (elm.Native.List.values) return elm.Native.List.values;
    if ('values' in Elm.Native.List)
        return elm.Native.List.values = Elm.Native.List.values;

    var Utils = Elm.Native.Utils.make(elm);

    var Nil = Utils.Nil;
    var Cons = Utils.Cons;

    function throwError(f) {
        throw new Error("Function '" + f + "' expects a non-empty list!");
    }

    function toArray(xs) {
        var out = [];
        while (xs.ctor !== '[]') {
            out.push(xs._0);
            xs = xs._1;
        }
        return out;
    }

    function fromArray(arr) {
        var out = Nil;
        for (var i = arr.length; i--; ) {
            out = Cons(arr[i], out);
        }
        return out;
    }

    function range(lo,hi) {
        var lst = Nil;
        if (lo <= hi) {
            do { lst = Cons(hi,lst) } while (hi-->lo);
        }
        return lst
    }

    function head(v) {
        return v.ctor === '[]' ? throwError('head') : v._0;
    }
    function tail(v) {
        return v.ctor === '[]' ? throwError('tail') : v._1;
    }

    function last(xs) {
        if (xs.ctor === '[]') { throwError('last'); }
        var out = xs._0;
        while (xs.ctor !== '[]') {
            out = xs._0;
            xs = xs._1;
        }
        return out;
    }

    function map(f, xs) {
        var arr = [];
        while (xs.ctor !== '[]') {
            arr.push(f(xs._0));
            xs = xs._1;
        }
        return fromArray(arr);
    }

    // f defined similarly for both foldl and foldr (NB: different from Haskell)
    // ie, foldl : (a -> b -> b) -> b -> [a] -> b
    function foldl(f, b, xs) {
        var acc = b;
        while (xs.ctor !== '[]') {
            acc = A2(f, xs._0, acc);
            xs = xs._1;
        }
        return acc;
    }

    function foldr(f, b, xs) {
        var arr = toArray(xs);
        var acc = b;
        for (var i = arr.length; i--; ) {
            acc = A2(f, arr[i], acc);
        }
        return acc;
    }

    function foldl1(f, xs) {
        return xs.ctor === '[]' ? throwError('foldl1') : foldl(f, xs._0, xs._1);
    }

    function foldr1(f, xs) {
        if (xs.ctor === '[]') { throwError('foldr1'); }
        var arr = toArray(xs);
        var acc = arr.pop();
        for (var i = arr.length; i--; ) {
            acc = A2(f, arr[i], acc);
        }
        return acc;
    }

    function scanl(f, b, xs) {
        var arr = toArray(xs);
        arr.unshift(b);
        var len = arr.length;
        for (var i = 1; i < len; ++i) {
            arr[i] = A2(f, arr[i], arr[i-1]);
        }
        return fromArray(arr);
    }

    function scanl1(f, xs) {
        return xs.ctor === '[]' ? throwError('scanl1') : scanl(f, xs._0, xs._1);
    }

    function filter(pred, xs) {
        var arr = [];
        while (xs.ctor !== '[]') {
            if (pred(xs._0)) { arr.push(xs._0); }
            xs = xs._1;
        }
        return fromArray(arr);
    }

    function length(xs) {
        var out = 0;
        while (xs.ctor !== '[]') {
            out += 1;
            xs = xs._1;
        }
        return out;
    }

    function member(x, xs) {
        while (xs.ctor !== '[]') {
            if (Utils.eq(x,xs._0)) return true;
            xs = xs._1;
        }
        return false;
    }

    function reverse(xs) {
        return fromArray(toArray(xs).reverse());
    }

    function append(xs, ys) {
        if (xs.ctor === '[]') {
            return ys;
        }
        var root = Cons(xs._0, Nil);
        var curr = root;
        xs = xs._1;
        while (xs.ctor !== '[]') {
            curr._1 = Cons(xs._0, Nil);
            xs = xs._1;
            curr = curr._1;
        }
        curr._1 = ys;
        return root;
    }

    function all(pred, xs) {
        while (xs.ctor !== '[]') {
            if (!pred(xs._0)) return false;
            xs = xs._1;
        }
        return true;
    }

    function any(pred, xs) {
        while (xs.ctor !== '[]') {
            if (pred(xs._0)) return true;
            xs = xs._1;
        }
        return false;
    }

    function map2(f, xs, ys) {
        var arr = [];
        while (xs.ctor !== '[]' && ys.ctor !== '[]') {
            arr.push(A2(f, xs._0, ys._0));
            xs = xs._1;
            ys = ys._1;
        }
        return fromArray(arr);
    }

    function map3(f, xs, ys, zs) {
        var arr = [];
        while (xs.ctor !== '[]' && ys.ctor !== '[]' && zs.ctor !== '[]') {
            arr.push(A3(f, xs._0, ys._0, zs._0));
            xs = xs._1;
            ys = ys._1;
            zs = zs._1;
        }
        return fromArray(arr);
    }

    function map4(f, ws, xs, ys, zs) {
        var arr = [];
        while (   ws.ctor !== '[]'
               && xs.ctor !== '[]'
               && ys.ctor !== '[]'
               && zs.ctor !== '[]')
        {
            arr.push(A4(f, ws._0, xs._0, ys._0, zs._0));
            ws = ws._1;
            xs = xs._1;
            ys = ys._1;
            zs = zs._1;
        }
        return fromArray(arr);
    }

    function map5(f, vs, ws, xs, ys, zs) {
        var arr = [];
        while (   vs.ctor !== '[]'
               && ws.ctor !== '[]'
               && xs.ctor !== '[]'
               && ys.ctor !== '[]'
               && zs.ctor !== '[]')
        {
            arr.push(A5(f, vs._0, ws._0, xs._0, ys._0, zs._0));
            vs = vs._1;
            ws = ws._1;
            xs = xs._1;
            ys = ys._1;
            zs = zs._1;
        }
        return fromArray(arr);
    }

    function sort(xs) {
        return fromArray(toArray(xs).sort(Utils.cmp));
    }

    function sortBy(f, xs) {
        return fromArray(toArray(xs).sort(function(a,b){
            return Utils.cmp(f(a), f(b));
        }));
    }

    function sortWith(f, xs) {
        return fromArray(toArray(xs).sort(function(a,b){
            var ord = f(a)(b).ctor;
            return ord === 'EQ' ? 0 : ord === 'LT' ? -1 : 1;
        }));
    }

    function nth(xs, n) {
        return toArray(xs)[n];
    }

    function take(n, xs) {
        var arr = [];
        while (xs.ctor !== '[]' && n > 0) {
            arr.push(xs._0);
            xs = xs._1;
            --n;
        }
        return fromArray(arr);
    }

    function drop(n, xs) {
        while (xs.ctor !== '[]' && n > 0) {
            xs = xs._1;
            --n;
        }
        return xs;
    }

    function repeat(n, x) {
        var arr = [];
        var pattern = [x];
        while (n > 0) {
            if (n & 1) arr = arr.concat(pattern);
            n >>= 1, pattern = pattern.concat(pattern);
        }
        return fromArray(arr);
    }


    Elm.Native.List.values = {
        Nil:Nil,
        Cons:Cons,
        cons:F2(Cons),
        toArray:toArray,
        fromArray:fromArray,
        range:range,
        append: F2(append),

        head:head,
        tail:tail,
        last:last,

        map:F2(map),
        foldl:F3(foldl),
        foldr:F3(foldr),

        foldl1:F2(foldl1),
        foldr1:F2(foldr1),
        scanl:F3(scanl),
        scanl1:F2(scanl1),
        filter:F2(filter),
        length:length,
        member:F2(member),
        reverse:reverse,

        all:F2(all),
        any:F2(any),
        map2:F3(map2),
        map3:F4(map3),
        map4:F5(map4),
        map5:F6(map5),
        sort:sort,
        sortBy:F2(sortBy),
        sortWith:F2(sortWith),
        nth:F2(nth),
        take:F2(take),
        drop:F2(drop),
        repeat:F2(repeat)
    };
    return elm.Native.List.values = Elm.Native.List.values;

};

Elm.Native.Ports = {};
Elm.Native.Ports.make = function(localRuntime) {
    localRuntime.Native = localRuntime.Native || {};
    localRuntime.Native.Ports = localRuntime.Native.Ports || {};
    if (localRuntime.Native.Ports.values) {
        return localRuntime.Native.Ports.values;
    }

    var Signal;

    function incomingSignal(converter) {
        converter.isSignal = true;
        return converter;
    }

    function outgoingSignal(converter) {
        if (!Signal) {
            Signal = Elm.Signal.make(localRuntime);
        }
        return function(signal) {
            var subscribers = []
            function subscribe(handler) {
                subscribers.push(handler);
            }
            function unsubscribe(handler) {
                subscribers.pop(subscribers.indexOf(handler));
            }
            A2( Signal.map, function(value) {
                var val = converter(value);
                var len = subscribers.length;
                for (var i = 0; i < len; ++i) {
                    subscribers[i](val);
                }
            }, signal);
            return { subscribe:subscribe, unsubscribe:unsubscribe };
        }
    }

    function portIn(name, converter) {
        var jsValue = localRuntime.ports.incoming[name];
        if (jsValue === undefined) {
            throw new Error("Initialization Error: port '" + name +
                            "' was not given an input!");
        }
        localRuntime.ports.uses[name] += 1;
        try {
            var elmValue = converter(jsValue);
        } catch(e) {
            throw new Error("Initialization Error on port '" + name + "': \n" + e.message);
        }

        // just return a static value if it is not a signal
        if (!converter.isSignal) {
            return elmValue;
        }

        // create a signal if necessary
        if (!Signal) {
            Signal = Elm.Signal.make(localRuntime);
        }
        var signal = Signal.constant(elmValue);
        function send(jsValue) {
            try {
                var elmValue = converter(jsValue);
            } catch(e) {
                throw new Error("Error sending to port '" + name + "': \n" + e.message);
            }
            setTimeout(function() {
                localRuntime.notify(signal.id, elmValue);
            }, 0);
        }
        localRuntime.ports.outgoing[name] = { send:send };
        return signal;
    }

    function portOut(name, converter, value) {
        try {
            localRuntime.ports.outgoing[name] = converter(value);
        } catch(e) {
            throw new Error("Initialization Error on port '" + name + "': \n" + e.message);
        }
        return value;
    }

    return localRuntime.Native.Ports.values = {
        incomingSignal: incomingSignal,
        outgoingSignal: outgoingSignal,
        portOut: portOut,
        portIn: portIn
    };
};



if (!Elm.fullscreen) {

    (function() {
        'use strict';

        var Display = { FULLSCREEN: 0, COMPONENT: 1, NONE: 2 };

        Elm.fullscreen = function(module, ports) {
            var container = document.createElement('div');
            document.body.appendChild(container);
            return init(Display.FULLSCREEN, container, module, ports || {});
        };

        Elm.embed = function(module, container, ports) {
            var tag = container.tagName;
            if (tag !== 'DIV') {
                throw new Error('Elm.node must be given a DIV, not a ' + tag + '.');
            } else if (container.hasChildNodes()) {
                throw new Error('Elm.node must be given an empty DIV. No children allowed!');
            }
            return init(Display.COMPONENT, container, module, ports || {});
        };

        Elm.worker = function(module, ports) {
            return init(Display.NONE, {}, module, ports || {});
        };

        function init(display, container, module, ports, moduleToReplace) {
            // defining state needed for an instance of the Elm RTS
            var inputs = [];

            /* OFFSET
             * Elm's time traveling debugger lets you interrupt the smooth flow of time
             * by pausing and continuing program execution. To ensure the user sees a
             * program that moves smoothly through the pause/continue time gap,
             * we need to adjsut the value of Date.now().
             */
            var timer = function() {
                var inducedDelay = 0;

                var now = function() {
                    return Date.now() - inducedDelay;
                };

                var addDelay = function(d) {
                    inducedDelay += d;
                    return inducedDelay;
                };

                return {
                    now : now,
                    addDelay : addDelay
                }
            }();

            var updateInProgress = false;
            function notify(id, v) {
                if (updateInProgress) {
                    throw new Error(
                        'The notify function has been called synchronously!\n' +
                        'This can lead to frames being dropped.\n' +
                        'Definitely report this to <https://github.com/elm-lang/Elm/issues>\n');
                }
                updateInProgress = true;
                var timestep = timer.now();
                for (var i = inputs.length; i--; ) {
                    inputs[i].recv(timestep, id, v);
                }
                updateInProgress = false;
            }
            function setTimeout(func, delay) {
                window.setTimeout(func, delay);
            }

            var listeners = [];
            function addListener(relevantInputs, domNode, eventName, func) {
                domNode.addEventListener(eventName, func);
                var listener = {
                    relevantInputs: relevantInputs,
                    domNode: domNode,
                    eventName: eventName,
                    func: func
                };
                listeners.push(listener);
            }

            var portUses = {}
            for (var key in ports) {
                portUses[key] = 0;
            }
            // create the actual RTS. Any impure modules will attach themselves to this
            // object. This permits many Elm programs to be embedded per document.
            var elm = {
                notify: notify,
                setTimeout: setTimeout,
                node: container,
                addListener: addListener,
                inputs: inputs,
                timer: timer,
                ports: { incoming:ports, outgoing:{}, uses:portUses },

                isFullscreen: function() { return display === Display.FULLSCREEN; },
                isEmbed: function() { return display === Display.COMPONENT; },
                isWorker: function() { return display === Display.NONE; }
            };

            function swap(newModule) {
                removeListeners(listeners);
                var div = document.createElement('div');
                var newElm = init(display, div, newModule, ports, elm);
                inputs = [];
                // elm.swap = newElm.swap;
                return newElm;
            }

            function dispose() {
                removeListeners(listeners);
                inputs = [];
            }

            var Module = {};
            try {
                Module = module.make(elm);
                checkPorts(elm);
            } catch(e) {
                var code = document.createElement('code');

                var lines = e.message.split('\n');
                code.appendChild(document.createTextNode(lines[0]));
                code.appendChild(document.createElement('br'));
                code.appendChild(document.createElement('br'));
                for (var i = 1; i < lines.length; ++i) {
                    code.appendChild(document.createTextNode('\u00A0 \u00A0 ' + lines[i]));
                    code.appendChild(document.createElement('br'));
                }
                code.appendChild(document.createElement('br'));
                code.appendChild(document.createTextNode("Open the developer console for more details."));

                container.appendChild(code);
                throw e;
            }
            inputs = filterDeadInputs(inputs);
            filterListeners(inputs, listeners);
            addReceivers(elm.ports.outgoing);
            if (display !== Display.NONE) {
                var graphicsNode = initGraphics(elm, Module);
            }
            if (typeof moduleToReplace !== 'undefined') {
                hotSwap(moduleToReplace, elm);

                // rerender scene if graphics are enabled.
                if (typeof graphicsNode !== 'undefined') {
                    graphicsNode.recv(0, true, 0);
                }
            }

            return {
                swap:swap,
                ports:elm.ports.outgoing,
                dispose:dispose
            };
        };

        function checkPorts(elm) {
            var portUses = elm.ports.uses;
            for (var key in portUses) {
                var uses = portUses[key]
                if (uses === 0) {
                    throw new Error(
                        "Initialization Error: provided port '" + key +
                        "' to a module that does not take it as in input.\n" +
                        "Remove '" + key + "' from the module initialization code.");
                } else if (uses > 1) {
                    throw new Error(
                        "Initialization Error: port '" + key +
                        "' has been declared multiple times in the Elm code.\n" +
                        "Remove declarations until there is exactly one.");
                }
            }
        }


        //// FILTER SIGNALS ////

        // TODO: move this code into the signal module and create a function
        // Signal.initializeGraph that actually instantiates everything.

        function filterListeners(inputs, listeners) {
            loop:
            for (var i = listeners.length; i--; ) {
                var listener = listeners[i];
                for (var j = inputs.length; j--; ) {
                    if (listener.relevantInputs.indexOf(inputs[j].id) >= 0) {
                        continue loop;
                    }
                }
                listener.domNode.removeEventListener(listener.eventName, listener.func);
            }
        }

        function removeListeners(listeners) {
            for (var i = listeners.length; i--; ) {
                var listener = listeners[i];
                listener.domNode.removeEventListener(listener.eventName, listener.func);
            }
        }

        // add receivers for built-in ports if they are defined
        function addReceivers(ports) {
            if ('log' in ports) {
                ports.log.subscribe(function(v) { console.log(v) });
            }
            if ('stdout' in ports) {
                var process = process || {};
                var handler = process.stdout
                    ? function(v) { process.stdout.write(v); }
                    : function(v) { console.log(v); };
                ports.stdout.subscribe(handler);
            }
            if ('stderr' in ports) {
                var process = process || {};
                var handler = process.stderr
                    ? function(v) { process.stderr.write(v); }
                    : function(v) { console.log('Error:' + v); };
                ports.stderr.subscribe(handler);
            }
            if ('title' in ports) {
                if (typeof ports.title === 'string') {
                    document.title = ports.title;
                } else {
                    ports.title.subscribe(function(v) { document.title = v; });
                }
            }
            if ('redirect' in ports) {
                ports.redirect.subscribe(function(v) {
                    if (v.length > 0) window.location = v;
                });
            }
            if ('favicon' in ports) {
                if (typeof ports.favicon === 'string') {
                    changeFavicon(ports.favicon);
                } else {
                    ports.favicon.subscribe(changeFavicon);
                }
            }
            function changeFavicon(src) {
                var link = document.createElement('link');
                var oldLink = document.getElementById('elm-favicon');
                link.id = 'elm-favicon';
                link.rel = 'shortcut icon';
                link.href = src;
                if (oldLink) {
                    document.head.removeChild(oldLink);
                }
                document.head.appendChild(link);
            }
        }


        function filterDeadInputs(inputs) {
            var temp = [];
            for (var i = inputs.length; i--; ) {
                if (isAlive(inputs[i])) temp.push(inputs[i]);
            }
            return temp;
        }


        function isAlive(input) {
            if (!('defaultNumberOfKids' in input)) return true;
            var len = input.kids.length;
            if (len === 0) return false;
            if (len > input.defaultNumberOfKids) return true;
            var alive = false;
            for (var i = len; i--; ) {
                alive = alive || isAlive(input.kids[i]);
            }
            return alive;
        }


        ////  RENDERING  ////

        function initGraphics(elm, Module) {
            if (!('main' in Module)) {
                throw new Error("'main' is missing! What do I display?!");
            }

            var signalGraph = Module.main;

            // make sure the signal graph is actually a signal & extract the visual model
            var Signal = Elm.Signal.make(elm);
            if (!('recv' in signalGraph)) {
                signalGraph = Signal.constant(signalGraph);
            }
            var initialScene = signalGraph.value;

            // Add the initialScene to the DOM
            var Element = Elm.Native.Graphics.Element.make(elm);
            elm.node.appendChild(Element.render(initialScene));

            var _requestAnimationFrame =
                typeof requestAnimationFrame !== 'undefined'
                    ? requestAnimationFrame
                    : function(cb) { setTimeout(cb, 1000/60); }
                    ;

            // domUpdate is called whenever the main Signal changes.
            //
            // domUpdate and drawCallback implement a small state machine in order
            // to schedule only 1 draw per animation frame. This enforces that
            // once draw has been called, it will not be called again until the
            // next frame.
            //
            // drawCallback is scheduled whenever
            // 1. The state transitions from PENDING_REQUEST to EXTRA_REQUEST, or
            // 2. The state transitions from NO_REQUEST to PENDING_REQUEST
            //
            // Invariants:
            // 1. In the NO_REQUEST state, there is never a scheduled drawCallback.
            // 2. In the PENDING_REQUEST and EXTRA_REQUEST states, there is always exactly 1
            //    scheduled drawCallback.
            var NO_REQUEST = 0;
            var PENDING_REQUEST = 1;
            var EXTRA_REQUEST = 2;
            var state = NO_REQUEST;
            var savedScene = initialScene;
            var scheduledScene = initialScene;

            function domUpdate(newScene) {
                scheduledScene = newScene;

                switch (state) {
                    case NO_REQUEST:
                        _requestAnimationFrame(drawCallback);
                        state = PENDING_REQUEST;
                        return;
                    case PENDING_REQUEST:
                        state = PENDING_REQUEST;
                        return;
                    case EXTRA_REQUEST:
                        state = PENDING_REQUEST;
                        return;
                }
            }

            function drawCallback() {
                switch (state) {
                    case NO_REQUEST:
                        // This state should not be possible. How can there be no
                        // request, yet somehow we are actively fulfilling a
                        // request?
                        throw new Error(
                            "Unexpected draw callback.\n" +
                            "Please report this to <https://github.com/elm-lang/core/issues>."
                        );

                    case PENDING_REQUEST:
                        // At this point, we do not *know* that another frame is
                        // needed, but we make an extra request to rAF just in
                        // case. It's possible to drop a frame if rAF is called
                        // too late, so we just do it preemptively.
                        _requestAnimationFrame(drawCallback);
                        state = EXTRA_REQUEST;

                        // There's also stuff we definitely need to draw.
                        draw();
                        return;

                    case EXTRA_REQUEST:
                        // Turns out the extra request was not needed, so we will
                        // stop calling rAF. No reason to call it all the time if
                        // no one needs it.
                        state = NO_REQUEST;
                        return;
                }
            }

            function draw() {
                Element.updateAndReplace(elm.node.firstChild, savedScene, scheduledScene);
                if (elm.Native.Window) {
                    elm.Native.Window.values.resizeIfNeeded();
                }
                savedScene = scheduledScene;
            }

            var renderer = A2(Signal.map, domUpdate, signalGraph);

            // must check for resize after 'renderer' is created so
            // that changes show up.
            if (elm.Native.Window) {
                elm.Native.Window.values.resizeIfNeeded();
            }

            return renderer;
        }

        //// HOT SWAPPING ////

        // Returns boolean indicating if the swap was successful.
        // Requires that the two signal graphs have exactly the same
        // structure.
        function hotSwap(from, to) {
            function similar(nodeOld,nodeNew) {
                var idOkay = nodeOld.id === nodeNew.id;
                var lengthOkay = nodeOld.kids.length === nodeNew.kids.length;
                return idOkay && lengthOkay;
            }
            function swap(nodeOld,nodeNew) {
                nodeNew.value = nodeOld.value;
                return true;
            }
            var canSwap = depthFirstTraversals(similar, from.inputs, to.inputs);
            if (canSwap) {
                depthFirstTraversals(swap, from.inputs, to.inputs);
            }
            from.node.parentNode.replaceChild(to.node, from.node);

            return canSwap;
        }

        // Returns false if the node operation f ever fails.
        function depthFirstTraversals(f, queueOld, queueNew) {
            if (queueOld.length !== queueNew.length) return false;
            queueOld = queueOld.slice(0);
            queueNew = queueNew.slice(0);

            var seen = [];
            while (queueOld.length > 0 && queueNew.length > 0) {
                var nodeOld = queueOld.pop();
                var nodeNew = queueNew.pop();
                if (seen.indexOf(nodeOld.id) < 0) {
                    if (!f(nodeOld, nodeNew)) return false;
                    queueOld = queueOld.concat(nodeOld.kids);
                    queueNew = queueNew.concat(nodeNew.kids);
                    seen.push(nodeOld.id);
                }
            }
            return true;
        }
    }());

    function F2(fun) {
        function wrapper(a) { return function(b) { return fun(a,b) } }
        wrapper.arity = 2;
        wrapper.func = fun;
        return wrapper;
    }

    function F3(fun) {
        function wrapper(a) {
            return function(b) { return function(c) { return fun(a,b,c) }}
        }
        wrapper.arity = 3;
        wrapper.func = fun;
        return wrapper;
    }

    function F4(fun) {
        function wrapper(a) { return function(b) { return function(c) {
            return function(d) { return fun(a,b,c,d) }}}
        }
        wrapper.arity = 4;
        wrapper.func = fun;
        return wrapper;
    }

    function F5(fun) {
        function wrapper(a) { return function(b) { return function(c) {
            return function(d) { return function(e) { return fun(a,b,c,d,e) }}}}
        }
        wrapper.arity = 5;
        wrapper.func = fun;
        return wrapper;
    }

    function F6(fun) {
        function wrapper(a) { return function(b) { return function(c) {
            return function(d) { return function(e) { return function(f) {
            return fun(a,b,c,d,e,f) }}}}}
        }
        wrapper.arity = 6;
        wrapper.func = fun;
        return wrapper;
    }

    function F7(fun) {
        function wrapper(a) { return function(b) { return function(c) {
            return function(d) { return function(e) { return function(f) {
            return function(g) { return fun(a,b,c,d,e,f,g) }}}}}}
        }
        wrapper.arity = 7;
        wrapper.func = fun;
        return wrapper;
    }

    function F8(fun) {
        function wrapper(a) { return function(b) { return function(c) {
            return function(d) { return function(e) { return function(f) {
            return function(g) { return function(h) {
            return fun(a,b,c,d,e,f,g,h)}}}}}}}
        }
        wrapper.arity = 8;
        wrapper.func = fun;
        return wrapper;
    }

    function F9(fun) {
        function wrapper(a) { return function(b) { return function(c) {
            return function(d) { return function(e) { return function(f) {
            return function(g) { return function(h) { return function(i) {
            return fun(a,b,c,d,e,f,g,h,i) }}}}}}}}
        }
        wrapper.arity = 9;
        wrapper.func = fun;
        return wrapper;
    }

    function A2(fun,a,b) {
        return fun.arity === 2
            ? fun.func(a,b)
            : fun(a)(b);
    }
    function A3(fun,a,b,c) {
        return fun.arity === 3
            ? fun.func(a,b,c)
            : fun(a)(b)(c);
    }
    function A4(fun,a,b,c,d) {
        return fun.arity === 4
            ? fun.func(a,b,c,d)
            : fun(a)(b)(c)(d);
    }
    function A5(fun,a,b,c,d,e) {
        return fun.arity === 5
            ? fun.func(a,b,c,d,e)
            : fun(a)(b)(c)(d)(e);
    }
    function A6(fun,a,b,c,d,e,f) {
        return fun.arity === 6
            ? fun.func(a,b,c,d,e,f)
            : fun(a)(b)(c)(d)(e)(f);
    }
    function A7(fun,a,b,c,d,e,f,g) {
        return fun.arity === 7
            ? fun.func(a,b,c,d,e,f,g)
            : fun(a)(b)(c)(d)(e)(f)(g);
    }
    function A8(fun,a,b,c,d,e,f,g,h) {
        return fun.arity === 8
            ? fun.func(a,b,c,d,e,f,g,h)
            : fun(a)(b)(c)(d)(e)(f)(g)(h);
    }
    function A9(fun,a,b,c,d,e,f,g,h,i) {
        return fun.arity === 9
            ? fun.func(a,b,c,d,e,f,g,h,i)
            : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
    }
}
Elm.Native.Show = {};
Elm.Native.Show.make = function(elm) {
    elm.Native = elm.Native || {};
    elm.Native.Show = elm.Native.Show || {};
    if (elm.Native.Show.values) return elm.Native.Show.values;

    var _Array;
    var Dict;
    var List;
    var Utils = Elm.Native.Utils.make(elm);

    var toString = function(v) {
        var type = typeof v;
        if (type === "function") {
            var name = v.func ? v.func.name : v.name;
            return '<function' + (name === '' ? '' : ': ') + name + '>';
        }
        else if (type === "boolean") {
            return v ? "True" : "False";
        }
        else if (type === "number") {
            return v + "";
        }
        else if ((v instanceof String) && v.isChar) {
            return "'" + addSlashes(v) + "'";
        }
        else if (type === "string") {
            return '"' + addSlashes(v) + '"';
        }
        else if (type === "object" && '_' in v && probablyPublic(v)) {
            var output = [];
            for (var k in v._) {
                for (var i = v._[k].length; i--; ) {
                    output.push(k + " = " + toString(v._[k][i]));
                }
            }
            for (var k in v) {
                if (k === '_') continue;
                output.push(k + " = " + toString(v[k]));
            }
            if (output.length === 0) {
                return "{}";
            }
            return "{ " + output.join(", ") + " }";
        }
        else if (type === "object" && 'ctor' in v) {
            if (v.ctor.substring(0,6) === "_Tuple") {
                var output = [];
                for (var k in v) {
                    if (k === 'ctor') continue;
                    output.push(toString(v[k]));
                }
                return "(" + output.join(",") + ")";
            }
            else if (v.ctor === "_Array") {
                if (!_Array) {
                    _Array = Elm.Array.make(elm);
                }
                var list = _Array.toList(v);
                return "Array.fromList " + toString(list);
            }
            else if (v.ctor === "::") {
                var output = '[' + toString(v._0);
                v = v._1;
                while (v.ctor === "::") {
                    output += "," + toString(v._0);
                    v = v._1;
                }
                return output + ']';
            }
            else if (v.ctor === "[]") {
                return "[]";
            }
            else if (v.ctor === "RBNode" || v.ctor === "RBEmpty") {
                if (!Dict) {
                    Dict = Elm.Dict.make(elm);
                }
                if (!List) {
                    List = Elm.List.make(elm);
                }
                var list = Dict.toList(v);
                var name = "Dict";
                if (list.ctor === "::" && list._0._1.ctor === "_Tuple0") {
                    name = "Set";
                    list = A2(List.map, function(x){return x._0}, list);
                }
                return name + ".fromList " + toString(list);
            }
            else {
                var output = "";
                for (var i in v) {
                    if (i === 'ctor') continue;
                    var str = toString(v[i]);
                    var parenless = str[0] === '{' || str[0] === '<' || str.indexOf(' ') < 0;
                    output += ' ' + (parenless ? str : '(' + str + ')');
                }
                return v.ctor + output;
            }
        }
        if (type === 'object' && 'recv' in v) {
            return '<signal>';
        }
        return "<internal structure>";
    };

    function addSlashes(str) {
        return str.replace(/\\/g, '\\\\')
                  .replace(/\n/g, '\\n')
                  .replace(/\t/g, '\\t')
                  .replace(/\r/g, '\\r')
                  .replace(/\v/g, '\\v')
                  .replace(/\0/g, '\\0')
                  .replace(/\'/g, "\\'")
                  .replace(/\"/g, '\\"');
    }

    function probablyPublic(v) {
        var keys = Object.keys(v);
        var len = keys.length;
        if (len === 3
            && 'props' in v
            && 'element' in v)
        {
            return false;
        }
        else if (len === 5
            && 'horizontal' in v
            && 'vertical' in v
            && 'x' in v
            && 'y' in v)
        {
            return false;
        }
        else if (len === 7
            && 'theta' in v
            && 'scale' in v
            && 'x' in v
            && 'y' in v
            && 'alpha' in v
            && 'form' in v)
        {
            return false;
        }
        return true;
    }

    return elm.Native.Show.values = {
        toString: toString
    };
};


Elm.Native.Signal = {};
Elm.Native.Signal.make = function(localRuntime) {

  localRuntime.Native = localRuntime.Native || {};
  localRuntime.Native.Signal = localRuntime.Native.Signal || {};
  if (localRuntime.Native.Signal.values) {
      return localRuntime.Native.Signal.values;
  }

  var Utils = Elm.Native.Utils.make(localRuntime);

  function broadcastToKids(node, timestep, changed) {
    var kids = node.kids;
    for (var i = kids.length; i--; ) {
      kids[i].recv(timestep, changed, node.id);
    }
  }

  function Input(base) {
    this.id = Utils.guid();
    this.value = base;
    this.kids = [];
    this.defaultNumberOfKids = 0;
    this.recv = function(timestep, eid, v) {
      var changed = eid === this.id;
      if (changed) {
        this.value = v;
      }
      broadcastToKids(this, timestep, changed);
      return changed;
    };
    localRuntime.inputs.push(this);
  }

  function LiftN(update, args) {
    this.id = Utils.guid();
    this.value = update();
    this.kids = [];

    var n = args.length;
    var count = 0;
    var isChanged = false;

    this.recv = function(timestep, changed, parentID) {
      ++count;
      if (changed) { isChanged = true; }
      if (count == n) {
        if (isChanged) { this.value = update(); }
        broadcastToKids(this, timestep, isChanged);
        isChanged = false;
        count = 0;
      }
    };
    for (var i = n; i--; ) { args[i].kids.push(this); }
  }

  function map(func, a) {
    function update() { return func(a.value); }
    return new LiftN(update, [a]);
  }
  function map2(func, a, b) {
    function update() { return A2( func, a.value, b.value ); }
    return new LiftN(update, [a,b]);
  }
  function map3(func, a, b, c) {
    function update() { return A3( func, a.value, b.value, c.value ); }
    return new LiftN(update, [a,b,c]);
  }
  function map4(func, a, b, c, d) {
    function update() { return A4( func, a.value, b.value, c.value, d.value ); }
    return new LiftN(update, [a,b,c,d]);
  }
  function map5(func, a, b, c, d, e) {
    function update() { return A5( func, a.value, b.value, c.value, d.value, e.value ); }
    return new LiftN(update, [a,b,c,d,e]);
  }

  function Foldp(step, state, input) {
    this.id = Utils.guid();
    this.value = state;
    this.kids = [];

    this.recv = function(timestep, changed, parentID) {
      if (changed) {
          this.value = A2( step, input.value, this.value );
      }
      broadcastToKids(this, timestep, changed);
    };
    input.kids.push(this);
  }

  function foldp(step, state, input) {
      return new Foldp(step, state, input);
  }

  function DropIf(pred,base,input) {
    this.id = Utils.guid();
    this.value = pred(input.value) ? base : input.value;
    this.kids = [];
    this.recv = function(timestep, changed, parentID) {
      var chng = changed && !pred(input.value);
      if (chng) { this.value = input.value; }
      broadcastToKids(this, timestep, chng);
    };
    input.kids.push(this);
  }

  function DropRepeats(input) {
    this.id = Utils.guid();
    this.value = input.value;
    this.kids = [];
    this.recv = function(timestep, changed, parentID) {
      var chng = changed && !Utils.eq(this.value,input.value);
      if (chng) { this.value = input.value; }
      broadcastToKids(this, timestep, chng);
    };
    input.kids.push(this);
  }

  function timestamp(a) {
    function update() { return Utils.Tuple2(localRuntime.timer.now(), a.value); }
    return new LiftN(update, [a]);
  }

  function SampleOn(s1,s2) {
    this.id = Utils.guid();
    this.value = s2.value;
    this.kids = [];

    var count = 0;
    var isChanged = false;

    this.recv = function(timestep, changed, parentID) {
      if (parentID === s1.id) isChanged = changed;
      ++count;
      if (count == 2) {
        if (isChanged) { this.value = s2.value; }
        broadcastToKids(this, timestep, isChanged);
        count = 0;
        isChanged = false;
      }
    };
    s1.kids.push(this);
    s2.kids.push(this);
  }

  function sampleOn(s1,s2) { return new SampleOn(s1,s2); }

  function delay(t,s) {
      var delayed = new Input(s.value);
      var firstEvent = true;
      function update(v) {
        if (firstEvent) {
            firstEvent = false; return;
        }
        setTimeout(function() {
            localRuntime.notify(delayed.id, v);
        }, t);
      }
      function first(a,b) { return a; }
      return new SampleOn(delayed, map2(F2(first), delayed, map(update,s)));
  }

  function Merge(s1,s2) {
      this.id = Utils.guid();
      this.value = s1.value;
      this.kids = [];

      var next = null;
      var count = 0;
      var isChanged = false;

      this.recv = function(timestep, changed, parentID) {
        ++count;
        if (changed) {
            isChanged = true;
            if (parentID == s2.id && next === null) { next = s2.value; }
            if (parentID == s1.id) { next = s1.value; }
        }

        if (count == 2) {
            if (isChanged) { this.value = next; next = null; }
            broadcastToKids(this, timestep, isChanged);
            isChanged = false;
            count = 0;
        }
      };
      s1.kids.push(this);
      s2.kids.push(this);
  }

  function merge(s1,s2) {
      return new Merge(s1,s2);
  }


    // SIGNAL INPUTS

    function input(initialValue) {
        return new Input(initialValue);
    }

    function send(input, value) {
        return function() {
            localRuntime.notify(input.id, value);
        };
    }

    function subscribe(input) {
        return input;
    }


  return localRuntime.Native.Signal.values = {
    constant : function(v) { return new Input(v); },
    map  : F2(map ),
    map2 : F3(map2),
    map3 : F4(map3),
    map4 : F5(map4),
    map5 : F6(map5),
    foldp : F3(foldp),
    delay : F2(delay),
    merge : F2(merge),
    keepIf : F3(function(pred,base,sig) {
      return new DropIf(function(x) {return !pred(x);},base,sig); }),
    dropIf : F3(function(pred,base,sig) { return new DropIf(pred,base,sig); }),
    dropRepeats : function(s) { return new DropRepeats(s);},
    sampleOn : F2(sampleOn),
    timestamp : timestamp,
    input: input,
    send: F2(send),
    subscribe: subscribe
  };
};

Elm.Native.String = {};
Elm.Native.String.make = function(elm) {
    elm.Native = elm.Native || {};
    elm.Native.String = elm.Native.String || {};
    if (elm.Native.String.values) return elm.Native.String.values;
    if ('values' in Elm.Native.String) {
        return elm.Native.String.values = Elm.Native.String.values;
    }

    var Char = Elm.Char.make(elm);
    var List = Elm.Native.List.make(elm);
    var Maybe = Elm.Maybe.make(elm);
    var Result = Elm.Result.make(elm);
    var Utils = Elm.Native.Utils.make(elm);

    function isEmpty(str) {
        return str.length === 0;
    }
    function cons(chr,str) {
        return chr + str;
    }
    function uncons(str) {
        var hd;
        return (hd = str[0])
            ? Maybe.Just(Utils.Tuple2(Utils.chr(hd), str.slice(1)))
            : Maybe.Nothing;
    }
    function append(a,b) {
        return a + b;
    }
    function concat(strs) {
        return List.toArray(strs).join('');
    }
    function length(str) {
        return str.length;
    }
    function map(f,str) {
        var out = str.split('');
        for (var i = out.length; i--; ) {
            out[i] = f(Utils.chr(out[i]));
        }
        return out.join('');
    }
    function filter(pred,str) {
        return str.split('').map(Utils.chr).filter(pred).join('');
    }
    function reverse(str) {
        return str.split('').reverse().join('');
    }
    function foldl(f,b,str) {
        var len = str.length;
        for (var i = 0; i < len; ++i) {
            b = A2(f, Utils.chr(str[i]), b);
        }
        return b;
    }
    function foldr(f,b,str) {
        for (var i = str.length; i--; ) {
            b = A2(f, Utils.chr(str[i]), b);
        }
        return b;
    }

    function split(sep, str) {
        return List.fromArray(str.split(sep));
    }
    function join(sep, strs) {
        return List.toArray(strs).join(sep);
    }
    function repeat(n, str) {
        var result = '';
        while (n > 0) {
            if (n & 1) result += str;
            n >>= 1, str += str;
        }
        return result;
    }

    function slice(start, end, str) {
        return str.slice(start,end);
    }
    function left(n, str) {
        return n < 1 ? "" : str.slice(0,n);
    }
    function right(n, str) {
        return n < 1 ? "" : str.slice(-n);
    }
    function dropLeft(n, str) {
        return n < 1 ? str : str.slice(n);
    }
    function dropRight(n, str) {
        return n < 1 ? str : str.slice(0,-n);
    }

    function pad(n,chr,str) {
        var half = (n - str.length) / 2;
        return repeat(Math.ceil(half),chr) + str + repeat(half|0,chr);
    }
    function padRight(n,chr,str) {
        return str + repeat(n - str.length, chr);
    }
    function padLeft(n,chr,str) {
        return repeat(n - str.length, chr) + str;
    }

    function trim(str) {
        return str.trim();
    }
    function trimLeft(str) {
        return str.trimLeft();
    }
    function trimRight(str) {
        return str.trimRight();
    }

    function words(str) {
        return List.fromArray(str.trim().split(/\s+/g));
    }
    function lines(str) {
        return List.fromArray(str.split(/\r\n|\r|\n/g));
    }

    function toUpper(str) {
        return str.toUpperCase();
    }
    function toLower(str) {
        return str.toLowerCase();
    }

    function any(pred, str) {
        for (var i = str.length; i--; ) {
            if (pred(Utils.chr(str[i]))) return true;
        }
        return false;
    }
    function all(pred, str) {
        for (var i = str.length; i--; ) {
            if (!pred(Utils.chr(str[i]))) return false;
        }
        return true;
    }

    function contains(sub, str) {
        return str.indexOf(sub) > -1;
    }
    function startsWith(sub, str) {
        return str.indexOf(sub) === 0;
    }
    function endsWith(sub, str) {
        return str.length >= sub.length &&
               str.lastIndexOf(sub) === str.length - sub.length;
    }
    function indexes(sub, str) {
        var subLen = sub.length;
        var i = 0;
        var is = [];
        while ((i = str.indexOf(sub, i)) > -1) {
            is.push(i);
            i = i + subLen;
        }
        return List.fromArray(is);
    }

    function toInt(s) {
        var len = s.length;
        if (len === 0) {
            return Result.Err("could not convert string '" + s + "' to an Int" );
        }
        var start = 0;
        if (s[0] == '-') {
            if (len === 1) {
                return Result.Err("could not convert string '" + s + "' to an Int" );
            }
            start = 1;
        }
        for (var i = start; i < len; ++i) {
            if (!Char.isDigit(s[i])) {
                return Result.Err("could not convert string '" + s + "' to an Int" );
            }
        }
        return Result.Ok(parseInt(s, 10));
    }

    function toFloat(s) {
        var len = s.length;
        if (len === 0) {
            return Result.Err("could not convert string '" + s + "' to a Float" );
        }
        var start = 0;
        if (s[0] == '-') {
            if (len === 1) {
                return Result.Err("could not convert string '" + s + "' to a Float" );
            }
            start = 1;
        }
        var dotCount = 0;
        for (var i = start; i < len; ++i) {
            if (Char.isDigit(s[i])) {
                continue;
            }
            if (s[i] === '.') {
                dotCount += 1;
                if (dotCount <= 1) {
                    continue;
                }
            }
            return Result.Err("could not convert string '" + s + "' to a Float" );
        }
        return Result.Ok(parseFloat(s));
    }

    function toList(str) {
        return List.fromArray(str.split('').map(Utils.chr));
    }
    function fromList(chars) {
        return List.toArray(chars).join('');
    }

    return Elm.Native.String.values = {
        isEmpty: isEmpty,
        cons: F2(cons),
        uncons: uncons,
        append: F2(append),
        concat: concat,
        length: length,
        map: F2(map),
        filter: F2(filter),
        reverse: reverse,
        foldl: F3(foldl),
        foldr: F3(foldr),

        split: F2(split),
        join: F2(join),
        repeat: F2(repeat),

        slice: F3(slice),
        left: F2(left),
        right: F2(right),
        dropLeft: F2(dropLeft),
        dropRight: F2(dropRight),

        pad: F3(pad),
        padLeft: F3(padLeft),
        padRight: F3(padRight),

        trim: trim,
        trimLeft: trimLeft,
        trimRight: trimRight,

        words: words,
        lines: lines,

        toUpper: toUpper,
        toLower: toLower,

        any: F2(any),
        all: F2(all),

        contains: F2(contains),
        startsWith: F2(startsWith),
        endsWith: F2(endsWith),
        indexes: F2(indexes),

        toInt: toInt,
        toFloat: toFloat,
        toList: toList,
        fromList: fromList
    };
};

Elm.Native = Elm.Native || {};
Elm.Native.Utils = {};
Elm.Native.Utils.make = function(localRuntime) {

    localRuntime.Native = localRuntime.Native || {};
    localRuntime.Native.Utils = localRuntime.Native.Utils || {};
    if (localRuntime.Native.Utils.values) {
        return localRuntime.Native.Utils.values;
    }

    function eq(l,r) {
        var stack = [{'x': l, 'y': r}]
        while (stack.length > 0) {
            var front = stack.pop();
            var x = front.x;
            var y = front.y;
            if (x === y) continue;
            if (typeof x === "object") {
                var c = 0;
                for (var i in x) {
                    ++c;
                    if (i in y) {
                        if (i !== 'ctor') {
                            stack.push({ 'x': x[i], 'y': y[i] });
                        }
                    } else {
                        return false;
                    }
                }
                if ('ctor' in x) {
                    stack.push({'x': x.ctor, 'y': y.ctor});
                }
                if (c !== Object.keys(y).length) {
                    return false;
                };
            } else if (typeof x === 'function') {
                throw new Error('Equality error: general function equality is ' +
                                'undecidable, and therefore, unsupported');
            } else {
                return false;
            }
        }
        return true;
    }

    // code in Generate/JavaScript.hs depends on the particular
    // integer values assigned to LT, EQ, and GT
    var LT = -1, EQ = 0, GT = 1, ord = ['LT','EQ','GT'];
    function compare(x,y) { return { ctor: ord[cmp(x,y)+1] } }
    function cmp(x,y) {
        var ord;
        if (typeof x !== 'object'){
            return x === y ? EQ : x < y ? LT : GT;
        }
        else if (x.isChar){
            var a = x.toString();
            var b = y.toString();
            return a === b ? EQ : a < b ? LT : GT;
        }
        else if (x.ctor === "::" || x.ctor === "[]") {
            while (true) {
                if (x.ctor === "[]" && y.ctor === "[]") return EQ;
                if (x.ctor !== y.ctor) return x.ctor === '[]' ? LT : GT;
                ord = cmp(x._0, y._0);
                if (ord !== EQ) return ord;
                x = x._1;
                y = y._1;
            }
        }
        else if (x.ctor.slice(0,6) === '_Tuple') {
            var n = x.ctor.slice(6) - 0;
            var err = 'cannot compare tuples with more than 6 elements.';
            if (n === 0) return EQ;
            if (n >= 1) { ord = cmp(x._0, y._0); if (ord !== EQ) return ord;
            if (n >= 2) { ord = cmp(x._1, y._1); if (ord !== EQ) return ord;
            if (n >= 3) { ord = cmp(x._2, y._2); if (ord !== EQ) return ord;
            if (n >= 4) { ord = cmp(x._3, y._3); if (ord !== EQ) return ord;
            if (n >= 5) { ord = cmp(x._4, y._4); if (ord !== EQ) return ord;
            if (n >= 6) { ord = cmp(x._5, y._5); if (ord !== EQ) return ord;
            if (n >= 7) throw new Error('Comparison error: ' + err); } } } } } }
            return EQ;
        }
        else {
            throw new Error('Comparison error: comparison is only defined on ints, ' +
                            'floats, times, chars, strings, lists of comparable values, ' +
                            'and tuples of comparable values.');
        }
    }


    var Tuple0 = { ctor: "_Tuple0" };
    function Tuple2(x,y) {
        return {
            ctor: "_Tuple2",
            _0: x,
            _1: y
        };
    }

    function chr(c) {
        var x = new String(c);
        x.isChar = true;
        return x;
    }

    function txt(str) {
        var t = new String(str);
        t.text = true;
        return t;
    }

    function makeText(text) {
        var style = '';
        var href = '';
        while (true) {
            if (text.style) {
                style += text.style;
                text = text.text;
                continue;
            }
            if (text.href) {
                href = text.href;
                text = text.text;
                continue;
            }
            if (href) {
                text = '<a href="' + href + '">' + text + '</a>';
            }
            if (style) {
                text = '<span style="' + style + '">' + text + '</span>';
            }
            return text;
        }
    }

    var count = 0;
    function guid(_) {
        return count++
    }

    function copy(oldRecord) {
        var newRecord = {};
        for (var key in oldRecord) {
            var value = key === '_'
                ? copy(oldRecord._)
                : oldRecord[key]
                ;
            newRecord[key] = value;
        }
        return newRecord;
    }

    function remove(key, oldRecord) {
        var record = copy(oldRecord);
        if (key in record._) {
            record[key] = record._[key][0];
            record._[key] = record._[key].slice(1);
            if (record._[key].length === 0) {
                delete record._[key];
            }
        } else {
            delete record[key];
        }
        return record;
    }

    function replace(keyValuePairs, oldRecord) {
        var record = copy(oldRecord);
        for (var i = keyValuePairs.length; i--; ) {
            var pair = keyValuePairs[i];
            record[pair[0]] = pair[1];
        }
        return record;
    }

    function insert(key, value, oldRecord) {
        var newRecord = copy(oldRecord);
        if (key in newRecord) {
            var values = newRecord._[key];
            var copiedValues = values ? values.slice(0) : [];
            newRecord._[key] = [newRecord[key]].concat(copiedValues);
        }
        newRecord[key] = value;
        return newRecord;
    }

    function getXY(e) {
        var posx = 0;
        var posy = 0;
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        } else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }

        if (localRuntime.isEmbed()) {
            var rect = localRuntime.node.getBoundingClientRect();
            var relx = rect.left + document.body.scrollLeft + document.documentElement.scrollLeft;
            var rely = rect.top + document.body.scrollTop + document.documentElement.scrollTop;
            // TODO: figure out if there is a way to avoid rounding here
            posx = posx - Math.round(relx) - localRuntime.node.clientLeft;
            posy = posy - Math.round(rely) - localRuntime.node.clientTop;
        }
        return Tuple2(posx, posy);
    }


    //// LIST STUFF ////

    var Nil = { ctor:'[]' };

    function Cons(hd,tl) {
        return {
            ctor: "::",
            _0: hd,
            _1: tl
        };
    }

    function append(xs,ys) {
        // append Text
        if (xs.text || ys.text) {
            return txt(makeText(xs) + makeText(ys));
        }

        // append Strings
        if (typeof xs === "string") {
            return xs + ys;
        }

        // append Lists
        if (xs.ctor === '[]') {
            return ys;
        }
        var root = Cons(xs._0, Nil);
        var curr = root;
        xs = xs._1;
        while (xs.ctor !== '[]') {
            curr._1 = Cons(xs._0, Nil);
            xs = xs._1;
            curr = curr._1;
        }
        curr._1 = ys;
        return root;
    }

    //// RUNTIME ERRORS ////

    function indent(lines) {
        return '\n' + lines.join('\n');
    }

    function badCase(moduleName, span) {
        var msg = indent([
            'Non-exhaustive pattern match in case-expression.',
            'Make sure your patterns cover every case!'
        ]);
        throw new Error('Runtime error in module ' + moduleName + ' (' + span + ')' + msg);
    }

    function badIf(moduleName, span) {
        var msg = indent([
            'Non-exhaustive pattern match in multi-way-if expression.',
            'It is best to use \'otherwise\' as the last branch of multi-way-if.'
        ]);
        throw new Error('Runtime error in module ' + moduleName + ' (' + span + ')' + msg);
    }


    function badPort(expected, received) {
        var msg = indent([
            'Expecting ' + expected + ' but was given ',
            JSON.stringify(received)
        ]);
        throw new Error('Runtime error when sending values through a port.' + msg);
    }


    return localRuntime.Native.Utils.values = {
        eq:eq,
        cmp:cmp,
        compare:F2(compare),
        Tuple0:Tuple0,
        Tuple2:Tuple2,
        chr:chr,
        txt:txt,
        makeText:makeText,
        copy: copy,
        remove: remove,
        replace: replace,
        insert: insert,
        guid: guid,
        getXY: getXY,

        Nil: Nil,
        Cons: Cons,
        append: F2(append),

        badCase: badCase,
        badIf: badIf,
        badPort: badPort
    };
};

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = createHash

function createHash(elem) {
    var attributes = elem.attributes
    var hash = {}

    if (attributes === null || attributes === undefined) {
        return hash
    }

    for (var i = 0; i < attributes.length; i++) {
        var attr = attributes[i]

        if (attr.name.substr(0,5) !== "data-") {
            continue
        }

        hash[attr.name.substr(5)] = attr.value
    }

    return hash
}

},{}],2:[function(require,module,exports){
var createStore = require("weakmap-shim/create-store")
var Individual = require("individual")

var createHash = require("./create-hash.js")

var hashStore = Individual("__DATA_SET_WEAKMAP@3", createStore())

module.exports = DataSet

function DataSet(elem) {
    var store = hashStore(elem)

    if (!store.hash) {
        store.hash = createHash(elem)
    }

    return store.hash
}

},{"./create-hash.js":1,"individual":3,"weakmap-shim/create-store":4}],3:[function(require,module,exports){
(function (global){
var root = typeof window !== 'undefined' ?
    window : typeof global !== 'undefined' ?
    global : {};

module.exports = Individual

function Individual(key, value) {
    if (root[key]) {
        return root[key]
    }

    Object.defineProperty(root, key, {
        value: value
        , configurable: true
    })

    return value
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){
var hiddenStore = require('./hidden-store.js');

module.exports = createStore;

function createStore() {
    var key = {};

    return function (obj) {
        if (typeof obj !== 'object' || obj === null) {
            throw new Error('Weakmap-shim: Key must be object')
        }

        var store = obj.valueOf(key);
        return store && store.identity === key ?
            store : hiddenStore(obj, key);
    };
}

},{"./hidden-store.js":5}],5:[function(require,module,exports){
module.exports = hiddenStore;

function hiddenStore(obj, key) {
    var store = { identity: key };
    var valueOf = obj.valueOf;

    Object.defineProperty(obj, "valueOf", {
        value: function (value) {
            return value !== key ?
                valueOf.apply(this, arguments) : store;
        },
        writable: true
    });

    return store;
}

},{}],6:[function(require,module,exports){
var DataSet = require("data-set")

module.exports = addEvent

function addEvent(target, type, handler) {
    var ds = DataSet(target)
    var events = ds[type]

    if (!events) {
        ds[type] = handler
    } else if (Array.isArray(events)) {
        if (events.indexOf(handler) === -1) {
            events.push(handler)
        }
    } else if (events !== handler) {
        ds[type] = [events, handler]
    }
}

},{"data-set":2}],7:[function(require,module,exports){
var globalDocument = require("global/document")
var DataSet = require("data-set")
var createStore = require("weakmap-shim/create-store")

var addEvent = require("./add-event.js")
var removeEvent = require("./remove-event.js")
var ProxyEvent = require("./proxy-event.js")

var HANDLER_STORE = createStore()

module.exports = DOMDelegator

function DOMDelegator(document) {
    document = document || globalDocument

    this.target = document.documentElement
    this.events = {}
    this.rawEventListeners = {}
    this.globalListeners = {}
}

DOMDelegator.prototype.addEventListener = addEvent
DOMDelegator.prototype.removeEventListener = removeEvent

DOMDelegator.prototype.allocateHandle =
    function allocateHandle(func) {
        var handle = new Handle()

        HANDLER_STORE(handle).func = func;

        return handle
    }

DOMDelegator.prototype.transformHandle =
    function transformHandle(handle, lambda) {
        var func = HANDLER_STORE(handle).func

        return this.allocateHandle(function (ev) {
            var result = lambda(ev)
            if (result) {
                func(result)
            }
        })
    }

DOMDelegator.prototype.addGlobalEventListener =
    function addGlobalEventListener(eventName, fn) {
        var listeners = this.globalListeners[eventName] || [];
        if (listeners.indexOf(fn) === -1) {
            listeners.push(fn)
        }

        this.globalListeners[eventName] = listeners;
    }

DOMDelegator.prototype.removeGlobalEventListener =
    function removeGlobalEventListener(eventName, fn) {
        var listeners = this.globalListeners[eventName] || [];

        var index = listeners.indexOf(fn)
        if (index !== -1) {
            listeners.splice(index, 1)
        }
    }

DOMDelegator.prototype.listenTo = function listenTo(eventName) {
    if (this.events[eventName]) {
        return
    }

    this.events[eventName] = true

    var listener = this.rawEventListeners[eventName]
    if (!listener) {
        listener = this.rawEventListeners[eventName] =
            createHandler(eventName, this)
    }

    this.target.addEventListener(eventName, listener, true)
}

DOMDelegator.prototype.unlistenTo = function unlistenTo(eventName) {
    if (!this.events[eventName]) {
        return
    }

    this.events[eventName] = false
    var listener = this.rawEventListeners[eventName]

    if (!listener) {
        throw new Error("dom-delegator#unlistenTo: cannot " +
            "unlisten to " + eventName)
    }

    this.target.removeEventListener(eventName, listener, true)
}

function createHandler(eventName, delegator) {
    var globalListeners = delegator.globalListeners;
    var delegatorTarget = delegator.target;

    return handler

    function handler(ev) {
        var globalHandlers = globalListeners[eventName] || []

        if (globalHandlers.length > 0) {
            var globalEvent = new ProxyEvent(ev);
            globalEvent.currentTarget = delegatorTarget;
            callListeners(globalHandlers, globalEvent)
        }

        findAndInvokeListeners(ev.target, ev, eventName)
    }
}

function findAndInvokeListeners(elem, ev, eventName) {
    var listener = getListener(elem, eventName)

    if (listener && listener.handlers.length > 0) {
        var listenerEvent = new ProxyEvent(ev);
        listenerEvent.currentTarget = listener.currentTarget
        callListeners(listener.handlers, listenerEvent)

        if (listenerEvent._bubbles) {
            var nextTarget = listener.currentTarget.parentNode
            findAndInvokeListeners(nextTarget, ev, eventName)
        }
    }
}

function getListener(target, type) {
    // terminate recursion if parent is `null`
    if (target === null) {
        return null
    }

    var ds = DataSet(target)
    // fetch list of handler fns for this event
    var handler = ds[type]
    var allHandler = ds.event

    if (!handler && !allHandler) {
        return getListener(target.parentNode, type)
    }

    var handlers = [].concat(handler || [], allHandler || [])
    return new Listener(target, handlers)
}

function callListeners(handlers, ev) {
    handlers.forEach(function (handler) {
        if (typeof handler === "function") {
            handler(ev)
        } else if (typeof handler.handleEvent === "function") {
            handler.handleEvent(ev)
        } else if (handler.type === "dom-delegator-handle") {
            HANDLER_STORE(handler).func(ev)
        } else {
            throw new Error("dom-delegator: unknown handler " +
                "found: " + JSON.stringify(handlers));
        }
    })
}

function Listener(target, handlers) {
    this.currentTarget = target
    this.handlers = handlers
}

function Handle() {
    this.type = "dom-delegator-handle"
}

},{"./add-event.js":6,"./proxy-event.js":15,"./remove-event.js":16,"data-set":2,"global/document":10,"weakmap-shim/create-store":13}],8:[function(require,module,exports){
var Individual = require("individual")
var cuid = require("cuid")
var globalDocument = require("global/document")

var DOMDelegator = require("./dom-delegator.js")

var delegatorCache = Individual("__DOM_DELEGATOR_CACHE@9", {
    delegators: {}
})
var commonEvents = [
    "blur", "change", "click",  "contextmenu", "dblclick",
    "error","focus", "focusin", "focusout", "input", "keydown",
    "keypress", "keyup", "load", "mousedown", "mouseup",
    "resize", "scroll", "select", "submit", "touchcancel",
    "touchend", "touchstart", "unload"
]

/*  Delegator is a thin wrapper around a singleton `DOMDelegator`
        instance.

    Only one DOMDelegator should exist because we do not want
        duplicate event listeners bound to the DOM.

    `Delegator` will also `listenTo()` all events unless
        every caller opts out of it
*/
module.exports = Delegator

function Delegator(opts) {
    opts = opts || {}
    var document = opts.document || globalDocument

    var cacheKey = document["__DOM_DELEGATOR_CACHE_TOKEN@9"]

    if (!cacheKey) {
        cacheKey =
            document["__DOM_DELEGATOR_CACHE_TOKEN@9"] = cuid()
    }

    var delegator = delegatorCache.delegators[cacheKey]

    if (!delegator) {
        delegator = delegatorCache.delegators[cacheKey] =
            new DOMDelegator(document)
    }

    if (opts.defaultEvents !== false) {
        for (var i = 0; i < commonEvents.length; i++) {
            delegator.listenTo(commonEvents[i])
        }
    }

    return delegator
}



},{"./dom-delegator.js":7,"cuid":9,"global/document":10,"individual":11}],9:[function(require,module,exports){
/**
 * cuid.js
 * Collision-resistant UID generator for browsers and node.
 * Sequential for fast db lookups and recency sorting.
 * Safe for element IDs and server-side lookups.
 *
 * Extracted from CLCTR
 *
 * Copyright (c) Eric Elliott 2012
 * MIT License
 */

/*global window, navigator, document, require, process, module */
(function (app) {
  'use strict';
  var namespace = 'cuid',
    c = 0,
    blockSize = 4,
    base = 36,
    discreteValues = Math.pow(base, blockSize),

    pad = function pad(num, size) {
      var s = "000000000" + num;
      return s.substr(s.length-size);
    },

    randomBlock = function randomBlock() {
      return pad((Math.random() *
            discreteValues << 0)
            .toString(base), blockSize);
    },

    safeCounter = function () {
      c = (c < discreteValues) ? c : 0;
      c++; // this is not subliminal
      return c - 1;
    },

    api = function cuid() {
      // Starting with a lowercase letter makes
      // it HTML element ID friendly.
      var letter = 'c', // hard-coded allows for sequential access

        // timestamp
        // warning: this exposes the exact date and time
        // that the uid was created.
        timestamp = (new Date().getTime()).toString(base),

        // Prevent same-machine collisions.
        counter,

        // A few chars to generate distinct ids for different
        // clients (so different computers are far less
        // likely to generate the same id)
        fingerprint = api.fingerprint(),

        // Grab some more chars from Math.random()
        random = randomBlock() + randomBlock();

        counter = pad(safeCounter().toString(base), blockSize);

      return  (letter + timestamp + counter + fingerprint + random);
    };

  api.slug = function slug() {
    var date = new Date().getTime().toString(36),
      counter,
      print = api.fingerprint().slice(0,1) +
        api.fingerprint().slice(-1),
      random = randomBlock().slice(-2);

      counter = safeCounter().toString(36).slice(-4);

    return date.slice(-2) +
      counter + print + random;
  };

  api.globalCount = function globalCount() {
    // We want to cache the results of this
    var cache = (function calc() {
        var i,
          count = 0;

        for (i in window) {
          count++;
        }

        return count;
      }());

    api.globalCount = function () { return cache; };
    return cache;
  };

  api.fingerprint = function browserPrint() {
    return pad((navigator.mimeTypes.length +
      navigator.userAgent.length).toString(36) +
      api.globalCount().toString(36), 4);
  };

  // don't change anything from here down.
  if (app.register) {
    app.register(namespace, api);
  } else if (typeof module !== 'undefined') {
    module.exports = api;
  } else {
    app[namespace] = api;
  }

}(this.applitude || this));

},{}],10:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

if (typeof document !== 'undefined') {
    module.exports = document;
} else {
    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }

    module.exports = doccy;
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"min-document":40}],11:[function(require,module,exports){
module.exports=require(3)
},{}],12:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],13:[function(require,module,exports){
module.exports=require(4)
},{"./hidden-store.js":14}],14:[function(require,module,exports){
module.exports=require(5)
},{}],15:[function(require,module,exports){
var inherits = require("inherits")

var ALL_PROPS = [
    "altKey", "bubbles", "cancelable", "ctrlKey",
    "eventPhase", "metaKey", "relatedTarget", "shiftKey",
    "target", "timeStamp", "type", "view", "which"
]
var KEY_PROPS = ["char", "charCode", "key", "keyCode"]
var MOUSE_PROPS = [
    "button", "buttons", "clientX", "clientY", "layerX",
    "layerY", "offsetX", "offsetY", "pageX", "pageY",
    "screenX", "screenY", "toElement"
]

var rkeyEvent = /^key|input/
var rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/

module.exports = ProxyEvent

function ProxyEvent(ev) {
    if (!(this instanceof ProxyEvent)) {
        return new ProxyEvent(ev)
    }

    if (rkeyEvent.test(ev.type)) {
        return new KeyEvent(ev)
    } else if (rmouseEvent.test(ev.type)) {
        return new MouseEvent(ev)
    }

    for (var i = 0; i < ALL_PROPS.length; i++) {
        var propKey = ALL_PROPS[i]
        this[propKey] = ev[propKey]
    }

    this._rawEvent = ev
    this._bubbles = false;
}

ProxyEvent.prototype.preventDefault = function () {
    this._rawEvent.preventDefault()
}

ProxyEvent.prototype.startPropagation = function () {
    this._bubbles = true;
}

function MouseEvent(ev) {
    for (var i = 0; i < ALL_PROPS.length; i++) {
        var propKey = ALL_PROPS[i]
        this[propKey] = ev[propKey]
    }

    for (var j = 0; j < MOUSE_PROPS.length; j++) {
        var mousePropKey = MOUSE_PROPS[j]
        this[mousePropKey] = ev[mousePropKey]
    }

    this._rawEvent = ev
}

inherits(MouseEvent, ProxyEvent)

function KeyEvent(ev) {
    for (var i = 0; i < ALL_PROPS.length; i++) {
        var propKey = ALL_PROPS[i]
        this[propKey] = ev[propKey]
    }

    for (var j = 0; j < KEY_PROPS.length; j++) {
        var keyPropKey = KEY_PROPS[j]
        this[keyPropKey] = ev[keyPropKey]
    }

    this._rawEvent = ev
}

inherits(KeyEvent, ProxyEvent)

},{"inherits":12}],16:[function(require,module,exports){
var DataSet = require("data-set")

module.exports = removeEvent

function removeEvent(target, type, handler) {
    var ds = DataSet(target)
    var events = ds[type]

    if (!events) {
        return
    } else if (Array.isArray(events)) {
        var index = events.indexOf(handler)
        if (index !== -1) {
            events.splice(index, 1)
        }
    } else if (events === handler) {
        ds[type] = null
    }
}

},{"data-set":2}],17:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("vtree/is-vhook")

module.exports = applyProperties

function applyProperties(node, props, previous) {
    for (var propName in props) {
        var propValue = props[propName]

        if (propValue === undefined) {
            removeProperty(node, props, previous, propName);
        } else if (isHook(propValue)) {
            propValue.hook(node,
                propName,
                previous ? previous[propName] : undefined)
        } else {
            if (isObject(propValue)) {
                patchObject(node, props, previous, propName, propValue);
            } else if (propValue !== undefined) {
                node[propName] = propValue
            }
        }
    }
}

function removeProperty(node, props, previous, propName) {
    if (previous) {
        var previousValue = previous[propName]

        if (!isHook(previousValue)) {
            if (propName === "attributes") {
                for (var attrName in previousValue) {
                    node.removeAttribute(attrName)
                }
            } else if (propName === "style") {
                for (var i in previousValue) {
                    node.style[i] = ""
                }
            } else if (typeof previousValue === "string") {
                node[propName] = ""
            } else {
                node[propName] = null
            }
        }
    }
}

function patchObject(node, props, previous, propName, propValue) {
    var previousValue = previous ? previous[propName] : undefined

    // Set attributes
    if (propName === "attributes") {
        for (var attrName in propValue) {
            var attrValue = propValue[attrName]

            if (attrValue === undefined) {
                node.removeAttribute(attrName)
            } else {
                node.setAttribute(attrName, attrValue)
            }
        }

        return
    }

    if(previousValue && isObject(previousValue) &&
        getPrototype(previousValue) !== getPrototype(propValue)) {
        node[propName] = propValue
        return
    }

    if (!isObject(node[propName])) {
        node[propName] = {}
    }

    var replacer = propName === "style" ? "" : undefined

    for (var k in propValue) {
        var value = propValue[k]
        node[propName][k] = (value === undefined) ? replacer : value
    }
}

function getPrototype(value) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value)
    } else if (value.__proto__) {
        return value.__proto__
    } else if (value.constructor) {
        return value.constructor.prototype
    }
}

},{"is-object":21,"vtree/is-vhook":29}],18:[function(require,module,exports){
var document = require("global/document")

var applyProperties = require("./apply-properties")

var isVNode = require("vtree/is-vnode")
var isVText = require("vtree/is-vtext")
var isWidget = require("vtree/is-widget")
var handleThunk = require("vtree/handle-thunk")

module.exports = createElement

function createElement(vnode, opts) {
    var doc = opts ? opts.document || document : document
    var warn = opts ? opts.warn : null

    vnode = handleThunk(vnode).a

    if (isWidget(vnode)) {
        return vnode.init()
    } else if (isVText(vnode)) {
        return doc.createTextNode(vnode.text)
    } else if (!isVNode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode)
        }
        return null
    }

    var node = (vnode.namespace === null) ?
        doc.createElement(vnode.tagName) :
        doc.createElementNS(vnode.namespace, vnode.tagName)

    var props = vnode.properties
    applyProperties(node, props)

    var children = vnode.children

    for (var i = 0; i < children.length; i++) {
        var childNode = createElement(children[i], opts)
        if (childNode) {
            node.appendChild(childNode)
        }
    }

    return node
}

},{"./apply-properties":17,"global/document":20,"vtree/handle-thunk":27,"vtree/is-vnode":30,"vtree/is-vtext":31,"vtree/is-widget":32}],19:[function(require,module,exports){
// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
// We don't want to read all of the DOM nodes in the tree so we use
// the in-order tree indexing to eliminate recursion down certain branches.
// We only recurse into a DOM node if we know that it contains a child of
// interest.

var noChild = {}

module.exports = domIndex

function domIndex(rootNode, tree, indices, nodes) {
    if (!indices || indices.length === 0) {
        return {}
    } else {
        indices.sort(ascending)
        return recurse(rootNode, tree, indices, nodes, 0)
    }
}

function recurse(rootNode, tree, indices, nodes, rootIndex) {
    nodes = nodes || {}


    if (rootNode) {
        if (indexInRange(indices, rootIndex, rootIndex)) {
            nodes[rootIndex] = rootNode
        }

        var vChildren = tree.children

        if (vChildren) {

            var childNodes = rootNode.childNodes

            for (var i = 0; i < tree.children.length; i++) {
                rootIndex += 1

                var vChild = vChildren[i] || noChild
                var nextIndex = rootIndex + (vChild.count || 0)

                // skip recursion down the tree if there are no nodes down here
                if (indexInRange(indices, rootIndex, nextIndex)) {
                    recurse(childNodes[i], vChild, indices, nodes, rootIndex)
                }

                rootIndex = nextIndex
            }
        }
    }

    return nodes
}

// Binary search for an index in the interval [left, right]
function indexInRange(indices, left, right) {
    if (indices.length === 0) {
        return false
    }

    var minIndex = 0
    var maxIndex = indices.length - 1
    var currentIndex
    var currentItem

    while (minIndex <= maxIndex) {
        currentIndex = ((maxIndex + minIndex) / 2) >> 0
        currentItem = indices[currentIndex]

        if (minIndex === maxIndex) {
            return currentItem >= left && currentItem <= right
        } else if (currentItem < left) {
            minIndex = currentIndex + 1
        } else  if (currentItem > right) {
            maxIndex = currentIndex - 1
        } else {
            return true
        }
    }

    return false;
}

function ascending(a, b) {
    return a > b ? 1 : -1
}

},{}],20:[function(require,module,exports){
module.exports=require(10)
},{"min-document":40}],21:[function(require,module,exports){
module.exports = isObject

function isObject(x) {
    return typeof x === "object" && x !== null
}

},{}],22:[function(require,module,exports){
var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

module.exports = nativeIsArray || isArray

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}

},{}],23:[function(require,module,exports){
var applyProperties = require("./apply-properties")

var isWidget = require("vtree/is-widget")
var VPatch = require("vtree/vpatch")

var render = require("./create-element")
var updateWidget = require("./update-widget")

module.exports = applyPatch

function applyPatch(vpatch, domNode, renderOptions) {
    var type = vpatch.type
    var vNode = vpatch.vNode
    var patch = vpatch.patch

    switch (type) {
        case VPatch.REMOVE:
            return removeNode(domNode, vNode)
        case VPatch.INSERT:
            return insertNode(domNode, patch, renderOptions)
        case VPatch.VTEXT:
            return stringPatch(domNode, vNode, patch, renderOptions)
        case VPatch.WIDGET:
            return widgetPatch(domNode, vNode, patch, renderOptions)
        case VPatch.VNODE:
            return vNodePatch(domNode, vNode, patch, renderOptions)
        case VPatch.ORDER:
            reorderChildren(domNode, patch)
            return domNode
        case VPatch.PROPS:
            applyProperties(domNode, patch, vNode.properties)
            return domNode
        case VPatch.THUNK:
            return replaceRoot(domNode,
                renderOptions.patch(domNode, patch, renderOptions))
        default:
            return domNode
    }
}

function removeNode(domNode, vNode) {
    var parentNode = domNode.parentNode

    if (parentNode) {
        parentNode.removeChild(domNode)
    }

    destroyWidget(domNode, vNode);

    return null
}

function insertNode(parentNode, vNode, renderOptions) {
    var newNode = render(vNode, renderOptions)

    if (parentNode) {
        parentNode.appendChild(newNode)
    }

    return parentNode
}

function stringPatch(domNode, leftVNode, vText, renderOptions) {
    var newNode

    if (domNode.nodeType === 3) {
        domNode.replaceData(0, domNode.length, vText.text)
        newNode = domNode
    } else {
        var parentNode = domNode.parentNode
        newNode = render(vText, renderOptions)

        if (parentNode) {
            parentNode.replaceChild(newNode, domNode)
        }
    }

    destroyWidget(domNode, leftVNode)

    return newNode
}

function widgetPatch(domNode, leftVNode, widget, renderOptions) {
    if (updateWidget(leftVNode, widget)) {
        return widget.update(leftVNode, domNode) || domNode
    }

    var parentNode = domNode.parentNode
    var newWidget = render(widget, renderOptions)

    if (parentNode) {
        parentNode.replaceChild(newWidget, domNode)
    }

    destroyWidget(domNode, leftVNode)

    return newWidget
}

function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
    var parentNode = domNode.parentNode
    var newNode = render(vNode, renderOptions)

    if (parentNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    destroyWidget(domNode, leftVNode)

    return newNode
}

function destroyWidget(domNode, w) {
    if (typeof w.destroy === "function" && isWidget(w)) {
        w.destroy(domNode)
    }
}

function reorderChildren(domNode, bIndex) {
    var children = []
    var childNodes = domNode.childNodes
    var len = childNodes.length
    var i
    var reverseIndex = bIndex.reverse

    for (i = 0; i < len; i++) {
        children.push(domNode.childNodes[i])
    }

    var insertOffset = 0
    var move
    var node
    var insertNode
    for (i = 0; i < len; i++) {
        move = bIndex[i]
        if (move !== undefined && move !== i) {
            // the element currently at this index will be moved later so increase the insert offset
            if (reverseIndex[i] > i) {
                insertOffset++
            }

            node = children[move]
            insertNode = childNodes[i + insertOffset] || null
            if (node !== insertNode) {
                domNode.insertBefore(node, insertNode)
            }

            // the moved element came from the front of the array so reduce the insert offset
            if (move < i) {
                insertOffset--
            }
        }

        // element at this index is scheduled to be removed so increase insert offset
        if (i in bIndex.removes) {
            insertOffset++
        }
    }
}

function replaceRoot(oldRoot, newRoot) {
    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
        console.log(oldRoot)
        oldRoot.parentNode.replaceChild(newRoot, oldRoot)
    }

    return newRoot;
}

},{"./apply-properties":17,"./create-element":18,"./update-widget":25,"vtree/is-widget":32,"vtree/vpatch":37}],24:[function(require,module,exports){
var document = require("global/document")
var isArray = require("x-is-array")

var domIndex = require("./dom-index")
var patchOp = require("./patch-op")
module.exports = patch

function patch(rootNode, patches) {
    return patchRecursive(rootNode, patches)
}

function patchRecursive(rootNode, patches, renderOptions) {
    var indices = patchIndices(patches)

    if (indices.length === 0) {
        return rootNode
    }

    var index = domIndex(rootNode, patches.a, indices)
    var ownerDocument = rootNode.ownerDocument

    if (!renderOptions) {
        renderOptions = { patch: patchRecursive }
        if (ownerDocument !== document) {
            renderOptions.document = ownerDocument
        }
    }

    for (var i = 0; i < indices.length; i++) {
        var nodeIndex = indices[i]
        rootNode = applyPatch(rootNode,
            index[nodeIndex],
            patches[nodeIndex],
            renderOptions)
    }

    return rootNode
}

function applyPatch(rootNode, domNode, patchList, renderOptions) {
    if (!domNode) {
        return rootNode
    }

    var newNode

    if (isArray(patchList)) {
        for (var i = 0; i < patchList.length; i++) {
            newNode = patchOp(patchList[i], domNode, renderOptions)

            if (domNode === rootNode) {
                rootNode = newNode
            }
        }
    } else {
        newNode = patchOp(patchList, domNode, renderOptions)

        if (domNode === rootNode) {
            rootNode = newNode
        }
    }

    return rootNode
}

function patchIndices(patches) {
    var indices = []

    for (var key in patches) {
        if (key !== "a") {
            indices.push(Number(key))
        }
    }

    return indices
}

},{"./dom-index":19,"./patch-op":23,"global/document":20,"x-is-array":22}],25:[function(require,module,exports){
var isWidget = require("vtree/is-widget")

module.exports = updateWidget

function updateWidget(a, b) {
    if (isWidget(a) && isWidget(b)) {
        if ("name" in a && "name" in b) {
            return a.id === b.id
        } else {
            return a.init === b.init
        }
    }

    return false
}

},{"vtree/is-widget":32}],26:[function(require,module,exports){
var isArray = require("x-is-array")
var isObject = require("is-object")

var VPatch = require("./vpatch")
var isVNode = require("./is-vnode")
var isVText = require("./is-vtext")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")
var handleThunk = require("./handle-thunk")

module.exports = diff

function diff(a, b) {
    var patch = { a: a }
    walk(a, b, patch, 0)
    return patch
}

function walk(a, b, patch, index) {
    if (a === b) {
        if (isThunk(a) || isThunk(b)) {
            thunks(a, b, patch, index)
        } else {
            hooks(b, patch, index)
        }
        return
    }

    var apply = patch[index]

    if (b == null) {
        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b))
        destroyWidgets(a, patch, index)
    } else if (isThunk(a) || isThunk(b)) {
        thunks(a, b, patch, index)
    } else if (isVNode(b)) {
        if (isVNode(a)) {
            if (a.tagName === b.tagName &&
                a.namespace === b.namespace &&
                a.key === b.key) {
                var propsPatch = diffProps(a.properties, b.properties, b.hooks)
                if (propsPatch) {
                    apply = appendPatch(apply,
                        new VPatch(VPatch.PROPS, a, propsPatch))
                }
                apply = diffChildren(a, b, patch, apply, index)
            } else {
                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
                destroyWidgets(a, patch, index)
            }
        } else {
            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
            destroyWidgets(a, patch, index)
        }
    } else if (isVText(b)) {
        if (!isVText(a)) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
            destroyWidgets(a, patch, index)
        } else if (a.text !== b.text) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
        }
    } else if (isWidget(b)) {
        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b))

        if (!isWidget(a)) {
            destroyWidgets(a, patch, index)
        }
    }

    if (apply) {
        patch[index] = apply
    }
}

function diffProps(a, b, hooks) {
    var diff

    for (var aKey in a) {
        if (!(aKey in b)) {
            diff = diff || {}
            diff[aKey] = undefined
        }

        var aValue = a[aKey]
        var bValue = b[aKey]

        if (hooks && aKey in hooks) {
            diff = diff || {}
            diff[aKey] = bValue
        } else {
            if (isObject(aValue) && isObject(bValue)) {
                if (getPrototype(bValue) !== getPrototype(aValue)) {
                    diff = diff || {}
                    diff[aKey] = bValue
                } else {
                    var objectDiff = diffProps(aValue, bValue)
                    if (objectDiff) {
                        diff = diff || {}
                        diff[aKey] = objectDiff
                    }
                }
            } else if (aValue !== bValue) {
                diff = diff || {}
                diff[aKey] = bValue
            }
        }
    }

    for (var bKey in b) {
        if (!(bKey in a)) {
            diff = diff || {}
            diff[bKey] = b[bKey]
        }
    }

    return diff
}

function getPrototype(value) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value)
    } else if (value.__proto__) {
        return value.__proto__
    } else if (value.constructor) {
        return value.constructor.prototype
    }
}

function diffChildren(a, b, patch, apply, index) {
    var aChildren = a.children
    var bChildren = reorder(aChildren, b.children)

    var aLen = aChildren.length
    var bLen = bChildren.length
    var len = aLen > bLen ? aLen : bLen

    for (var i = 0; i < len; i++) {
        var leftNode = aChildren[i]
        var rightNode = bChildren[i]
        index += 1

        if (!leftNode) {
            if (rightNode) {
                // Excess nodes in b need to be added
                apply = appendPatch(apply,
                    new VPatch(VPatch.INSERT, null, rightNode))
            }
        } else if (!rightNode) {
            if (leftNode) {
                // Excess nodes in a need to be removed
                patch[index] = new VPatch(VPatch.REMOVE, leftNode, null)
                destroyWidgets(leftNode, patch, index)
            }
        } else {
            walk(leftNode, rightNode, patch, index)
        }

        if (isVNode(leftNode) && leftNode.count) {
            index += leftNode.count
        }
    }

    if (bChildren.moves) {
        // Reorder nodes last
        apply = appendPatch(apply, new VPatch(VPatch.ORDER, a, bChildren.moves))
    }

    return apply
}

// Patch records for all destroyed widgets must be added because we need
// a DOM node reference for the destroy function
function destroyWidgets(vNode, patch, index) {
    if (isWidget(vNode)) {
        if (typeof vNode.destroy === "function") {
            patch[index] = new VPatch(VPatch.REMOVE, vNode, null)
        }
    } else if (isVNode(vNode) && vNode.hasWidgets) {
        var children = vNode.children
        var len = children.length
        for (var i = 0; i < len; i++) {
            var child = children[i]
            index += 1

            destroyWidgets(child, patch, index)

            if (isVNode(child) && child.count) {
                index += child.count
            }
        }
    }
}

// Create a sub-patch for thunks
function thunks(a, b, patch, index) {
    var nodes = handleThunk(a, b);
    var thunkPatch = diff(nodes.a, nodes.b)
    if (hasPatches(thunkPatch)) {
        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch)
    }
}

function hasPatches(patch) {
    for (var index in patch) {
        if (index !== "a") {
            return true;
        }
    }

    return false;
}

// Execute hooks when two nodes are identical
function hooks(vNode, patch, index) {
    if (isVNode(vNode)) {
        if (vNode.hooks) {
            patch[index] = new VPatch(VPatch.PROPS, vNode.hooks, vNode.hooks)
        }

        if (vNode.descendantHooks) {
            var children = vNode.children
            var len = children.length
            for (var i = 0; i < len; i++) {
                var child = children[i]
                index += 1

                hooks(child, patch, index)

                if (isVNode(child) && child.count) {
                    index += child.count
                }
            }
        }
    }
}

// List diff, naive left to right reordering
function reorder(aChildren, bChildren) {

    var bKeys = keyIndex(bChildren)

    if (!bKeys) {
        return bChildren
    }

    var aKeys = keyIndex(aChildren)

    if (!aKeys) {
        return bChildren
    }

    var bMatch = {}, aMatch = {}

    for (var key in bKeys) {
        bMatch[bKeys[key]] = aKeys[key]
    }

    for (var key in aKeys) {
        aMatch[aKeys[key]] = bKeys[key]
    }

    var aLen = aChildren.length
    var bLen = bChildren.length
    var len = aLen > bLen ? aLen : bLen
    var shuffle = []
    var freeIndex = 0
    var i = 0
    var moveIndex = 0
    var moves = {}
    var removes = moves.removes = {}
    var reverse = moves.reverse = {}
    var hasMoves = false

    while (freeIndex < len) {
        var move = aMatch[i]
        if (move !== undefined) {
            shuffle[i] = bChildren[move]
            if (move !== moveIndex) {
                moves[move] = moveIndex
                reverse[moveIndex] = move
                hasMoves = true
            }
            moveIndex++
        } else if (i in aMatch) {
            shuffle[i] = undefined
            removes[i] = moveIndex++
            hasMoves = true
        } else {
            while (bMatch[freeIndex] !== undefined) {
                freeIndex++
            }

            if (freeIndex < len) {
                var freeChild = bChildren[freeIndex]
                if (freeChild) {
                    shuffle[i] = freeChild
                    if (freeIndex !== moveIndex) {
                        hasMoves = true
                        moves[freeIndex] = moveIndex
                        reverse[moveIndex] = freeIndex
                    }
                    moveIndex++
                }
                freeIndex++
            }
        }
        i++
    }

    if (hasMoves) {
        shuffle.moves = moves
    }

    return shuffle
}

function keyIndex(children) {
    var i, keys

    for (i = 0; i < children.length; i++) {
        var child = children[i]

        if (child.key !== undefined) {
            keys = keys || {}
            keys[child.key] = i
        }
    }

    return keys
}

function appendPatch(apply, patch) {
    if (apply) {
        if (isArray(apply)) {
            apply.push(patch)
        } else {
            apply = [apply, patch]
        }

        return apply
    } else {
        return patch
    }
}

},{"./handle-thunk":27,"./is-thunk":28,"./is-vnode":30,"./is-vtext":31,"./is-widget":32,"./vpatch":37,"is-object":33,"x-is-array":34}],27:[function(require,module,exports){
var isVNode = require("./is-vnode")
var isVText = require("./is-vtext")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")

module.exports = handleThunk

function handleThunk(a, b) {
    var renderedA = a
    var renderedB = b

    if (isThunk(b)) {
        renderedB = renderThunk(b, a)
    }

    if (isThunk(a)) {
        renderedA = renderThunk(a, null)
    }

    return {
        a: renderedA,
        b: renderedB
    }
}

function renderThunk(thunk, previous) {
    var renderedThunk = thunk.vnode

    if (!renderedThunk) {
        renderedThunk = thunk.vnode = thunk.render(previous)
    }

    if (!(isVNode(renderedThunk) ||
            isVText(renderedThunk) ||
            isWidget(renderedThunk))) {
        throw new Error("thunk did not return a valid node");
    }

    return renderedThunk
}

},{"./is-thunk":28,"./is-vnode":30,"./is-vtext":31,"./is-widget":32}],28:[function(require,module,exports){
module.exports = isThunk

function isThunk(t) {
    return t && t.type === "Thunk"
}

},{}],29:[function(require,module,exports){
module.exports = isHook

function isHook(hook) {
    return hook && typeof hook.hook === "function" &&
        !hook.hasOwnProperty("hook")
}

},{}],30:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualNode

function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version
}

},{"./version":35}],31:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualText

function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version
}

},{"./version":35}],32:[function(require,module,exports){
module.exports = isWidget

function isWidget(w) {
    return w && w.type === "Widget"
}

},{}],33:[function(require,module,exports){
module.exports=require(21)
},{}],34:[function(require,module,exports){
module.exports=require(22)
},{}],35:[function(require,module,exports){
module.exports = "1"

},{}],36:[function(require,module,exports){
var version = require("./version")
var isVNode = require("./is-vnode")
var isWidget = require("./is-widget")
var isVHook = require("./is-vhook")

module.exports = VirtualNode

var noProperties = {}
var noChildren = []

function VirtualNode(tagName, properties, children, key, namespace) {
    this.tagName = tagName
    this.properties = properties || noProperties
    this.children = children || noChildren
    this.key = key != null ? String(key) : undefined
    this.namespace = (typeof namespace === "string") ? namespace : null

    var count = (children && children.length) || 0
    var descendants = 0
    var hasWidgets = false
    var descendantHooks = false
    var hooks

    for (var propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            var property = properties[propName]
            if (isVHook(property)) {
                if (!hooks) {
                    hooks = {}
                }

                hooks[propName] = property
            }
        }
    }

    for (var i = 0; i < count; i++) {
        var child = children[i]
        if (isVNode(child)) {
            descendants += child.count || 0

            if (!hasWidgets && child.hasWidgets) {
                hasWidgets = true
            }

            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                descendantHooks = true
            }
        } else if (!hasWidgets && isWidget(child)) {
            if (typeof child.destroy === "function") {
                hasWidgets = true
            }
        }
    }

    this.count = count + descendants
    this.hasWidgets = hasWidgets
    this.hooks = hooks
    this.descendantHooks = descendantHooks
}

VirtualNode.prototype.version = version
VirtualNode.prototype.type = "VirtualNode"

},{"./is-vhook":29,"./is-vnode":30,"./is-widget":32,"./version":35}],37:[function(require,module,exports){
var version = require("./version")

VirtualPatch.NONE = 0
VirtualPatch.VTEXT = 1
VirtualPatch.VNODE = 2
VirtualPatch.WIDGET = 3
VirtualPatch.PROPS = 4
VirtualPatch.ORDER = 5
VirtualPatch.INSERT = 6
VirtualPatch.REMOVE = 7
VirtualPatch.THUNK = 8

module.exports = VirtualPatch

function VirtualPatch(type, vNode, patch) {
    this.type = Number(type)
    this.vNode = vNode
    this.patch = patch
}

VirtualPatch.prototype.version = version
VirtualPatch.prototype.type = "VirtualPatch"

},{"./version":35}],38:[function(require,module,exports){
var version = require("./version")

module.exports = VirtualText

function VirtualText(text) {
    this.text = String(text)
}

VirtualText.prototype.version = version
VirtualText.prototype.type = "VirtualText"

},{"./version":35}],39:[function(require,module,exports){

var VNode = require('vtree/vnode');
var VText = require('vtree/vtext');
var diff = require('vtree/diff');
var patch = require('vdom/patch');
var createElement = require('vdom/create-element');
var DataSet = require("data-set");
var Delegator = require("dom-delegator");
var isHook = require("vtree/is-vhook");

Elm.Native.VirtualDom = {};
Elm.Native.VirtualDom.make = function(elm) {
    elm.Native = elm.Native || {};
    elm.Native.VirtualDom = elm.Native.VirtualDom || {};
    if (elm.Native.VirtualDom.values) {
        return elm.Native.VirtualDom.values;
    }

    // This manages event listeners. Somehow...
    var delegator = Delegator();

    var NativeElement = Elm.Native.Graphics.Element.make(elm);
    var Element = Elm.Graphics.Element.make(elm);
    var Json = Elm.Native.Json.make(elm);
    var List = Elm.Native.List.make(elm);
    var Utils = Elm.Native.Utils.make(elm);

    function listToObject(list) {
        var object = {};
        while (list.ctor !== '[]') {
            var entry = list._0;
            object[entry.key] = entry.value;
            list = list._1;
        }
        return object;
    }

    function node(name, propertyList, contents) {
        var props = listToObject(propertyList);

        var key, namespace;
        // support keys
        if (props.key !== undefined) {
            key = props.key;
            props.key = undefined;
        }

        // support namespace
        if (props.namespace !== undefined) {
            namespace = props.namespace;
            props.namespace = undefined;
        }

        // ensure that setting text of an input does not move the cursor
        var useSoftSet =
            name === 'input'
            && props.value !== undefined
            && !isHook(props.value);

        if (useSoftSet) {
            props.value = SoftSetHook(props.value);
        }

        return new VNode(name, props, List.toArray(contents), key, namespace);
    }

    function property(key, value) {
        return {
            key: key,
            value: value
        };
    }

    function on(name, decoder, createMessage) {
        function eventHandler(event) {
            var value = A2(Json.runDecoderValue, decoder, event);
            if (value.ctor === 'Ok') {
                createMessage(value._0)();
            }
        }
        return property(name, DataSetHook(eventHandler));
    }

    function DataSetHook(value) {
        if (!(this instanceof DataSetHook)) {
            return new DataSetHook(value);
        }

        this.value = value;
    }

    DataSetHook.prototype.hook = function (node, propertyName) {
        var ds = DataSet(node);
        ds[propertyName] = this.value;
    };


    function SoftSetHook(value) {
      if (!(this instanceof SoftSetHook)) {
        return new SoftSetHook(value);
      }

      this.value = value;
    }

    SoftSetHook.prototype.hook = function (node, propertyName) {
      if (node[propertyName] !== this.value) {
        node[propertyName] = this.value;
      }
    };

    function text(string) {
        return new VText(string);
    }

    function fromElement(element) {
        return {
            type: "Widget",

            element: element,

            init: function () {
                return NativeElement.render(element);
            },

            update: function (previous, node) {
                return NativeElement.update(node, previous.element, element);
            }
        };
    }

    function toElement(width, height, html) {
        return A3(Element.newElement, width, height,
                  { ctor: 'Custom'
                  , type: 'evancz/elm-html'
                  , render: render
                  , update: update
                  , model: html
                  });
    }

    function render(model) {
        var element = NativeElement.createNode('div');
        element.appendChild(createElement(model));
        return element;
    }

    function update(node, oldModel, newModel) {
        var patches = diff(oldModel, newModel);
        var newNode = patch(node.firstChild, patches)
        if (newNode !== node.firstChild) {
            node.replaceChild(newNode, node.firstChild)
        }
        return node;
    }

    function lazyRef(fn, a) {
        function thunk() {
            return fn(a);
        }
        return new Thunk(fn, [a], thunk);
    }

    function lazyRef2(fn, a, b) {
        function thunk() {
            return A2(fn, a, b);
        }
        return new Thunk(fn, [a,b], thunk);
    }

    function lazyRef3(fn, a, b, c) {
        function thunk() {
            return A3(fn, a, b, c);
        }
        return new Thunk(fn, [a,b,c], thunk);
    }

    function Thunk(fn, args, thunk) {
        this.fn = fn;
        this.args = args;
        this.vnode = null;
        this.key = undefined;
        this.thunk = thunk;
    }

    Thunk.prototype.type = "Thunk";
    Thunk.prototype.update = updateThunk;
    Thunk.prototype.render = renderThunk;

    function shouldUpdate(current, previous) {
        if (current.fn !== previous.fn) {
            return true;
        }

        // if it's the same function, we know the number of args must match
        var cargs = current.args;
        var pargs = previous.args;

        for (var i = cargs.length; i--; ) {
            if (cargs[i] !== pargs[i]) {
                return true;
            }
        }

        return false;
    }

    function updateThunk(previous, domNode) {
        if (!shouldUpdate(this, previous)) {
            this.vnode = previous.vnode;
            return;
        }

        if (!this.vnode) {
            this.vnode = this.thunk();
        }

        var patches = diff(previous.vnode, this.vnode);
        patch(domNode, patches);
    }

    function renderThunk() {
        return this.thunk();
    }

    return Elm.Native.VirtualDom.values = {
        node: F3(node),
        text: text,
        on: F3(on),

        property: F2(property),

        lazy: F2(lazyRef),
        lazy2: F3(lazyRef2),
        lazy3: F4(lazyRef3),

        toElement: F3(toElement),
        fromElement: fromElement
    };
};

},{"data-set":2,"dom-delegator":8,"vdom/create-element":18,"vdom/patch":24,"vtree/diff":26,"vtree/is-vhook":29,"vtree/vnode":36,"vtree/vtext":38}],40:[function(require,module,exports){

},{}]},{},[39]);

Elm.Native = Elm.Native || {};
Elm.Native.Window = {};
Elm.Native.Window.make = function(localRuntime) {

    localRuntime.Native = localRuntime.Native || {};
    localRuntime.Native.Window = localRuntime.Native.Window || {};
    if (localRuntime.Native.Window.values) {
        return localRuntime.Native.Window.values;
    }

    var Signal = Elm.Signal.make(localRuntime);
    var NS = Elm.Native.Signal.make(localRuntime);
    var Tuple2 = Elm.Native.Utils.make(localRuntime).Tuple2;

    function getWidth() {
        return localRuntime.node.clientWidth;
    }
    function getHeight() {
        if (localRuntime.isFullscreen()) {
            return window.innerHeight;
        }
        return localRuntime.node.clientHeight;
    }

    var dimensions = NS.input(Tuple2(getWidth(), getHeight()));
    dimensions.defaultNumberOfKids = 2;

    // Do not move width and height into Elm. By setting the default number of kids,
    // the resize listener can be detached.
    var width  = A2(Signal.map, function(p){return p._0;}, dimensions);
    width.defaultNumberOfKids = 0;

    var height = A2(Signal.map, function(p){return p._1;}, dimensions);
    height.defaultNumberOfKids = 0;

    function resizeIfNeeded() {
        // Do not trigger event if the dimensions have not changed.
        // This should be most of the time.
        var w = getWidth();
        var h = getHeight();
        if (dimensions.value._0 === w && dimensions.value._1 === h) return;

        setTimeout(function () {
            // Check again to see if the dimensions have changed.
            // It is conceivable that the dimensions have changed
            // again while some other event was being processed.
            var w = getWidth();
            var h = getHeight();
            if (dimensions.value._0 === w && dimensions.value._1 === h) return;
            localRuntime.notify(dimensions.id, Tuple2(w,h));
        }, 0);
    }
    localRuntime.addListener([dimensions.id], window, 'resize', resizeIfNeeded);

    return localRuntime.Native.Window.values = {
        dimensions: dimensions,
        width: width,
        height: height,
        resizeIfNeeded: resizeIfNeeded
    };

};

Elm.Result = Elm.Result || {};
Elm.Result.make = function (_elm) {
   "use strict";
   _elm.Result = _elm.Result || {};
   if (_elm.Result.values)
   return _elm.Result.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _P = _N.Ports.make(_elm),
   $moduleName = "Result",
   $Maybe = Elm.Maybe.make(_elm);
   var toMaybe = function (result) {
      return function () {
         switch (result.ctor)
         {case "Err":
            return $Maybe.Nothing;
            case "Ok":
            return $Maybe.Just(result._0);}
         _U.badCase($moduleName,
         "between lines 110 and 123");
      }();
   };
   var Err = function (a) {
      return {ctor: "Err",_0: a};
   };
   var andThen = F2(function (result,
   callback) {
      return function () {
         switch (result.ctor)
         {case "Err":
            return Err(result._0);
            case "Ok":
            return callback(result._0);}
         _U.badCase($moduleName,
         "between lines 72 and 91");
      }();
   });
   var Ok = function (a) {
      return {ctor: "Ok",_0: a};
   };
   var map = F2(function (f,
   result) {
      return function () {
         switch (result.ctor)
         {case "Err":
            return Err(result._0);
            case "Ok":
            return Ok(f(result._0));}
         _U.badCase($moduleName,
         "between lines 32 and 69");
      }();
   });
   var formatError = F2(function (f,
   result) {
      return function () {
         switch (result.ctor)
         {case "Err":
            return Err(f(result._0));
            case "Ok":
            return Ok(result._0);}
         _U.badCase($moduleName,
         "between lines 94 and 107");
      }();
   });
   var fromMaybe = F2(function (err,
   maybe) {
      return function () {
         switch (maybe.ctor)
         {case "Just":
            return Ok(maybe._0);
            case "Nothing":
            return Err(err);}
         _U.badCase($moduleName,
         "between lines 126 and 128");
      }();
   });
   _elm.Result.values = {_op: _op
                        ,Ok: Ok
                        ,Err: Err
                        ,map: map
                        ,andThen: andThen
                        ,formatError: formatError
                        ,toMaybe: toMaybe
                        ,fromMaybe: fromMaybe};
   return _elm.Result.values;
};
Elm.Signal = Elm.Signal || {};
Elm.Signal.make = function (_elm) {
   "use strict";
   _elm.Signal = _elm.Signal || {};
   if (_elm.Signal.values)
   return _elm.Signal.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _P = _N.Ports.make(_elm),
   $moduleName = "Signal",
   $Basics = Elm.Basics.make(_elm),
   $List = Elm.List.make(_elm),
   $Native$Signal = Elm.Native.Signal.make(_elm);
   var subscribe = $Native$Signal.subscribe;
   var send = $Native$Signal.send;
   var channel = $Native$Signal.input;
   var Message = {ctor: "Message"};
   var Channel = {ctor: "Channel"};
   _op["~"] = F2(function (sf,s) {
      return A3($Native$Signal.map2,
      F2(function (f,x) {
         return f(x);
      }),
      sf,
      s);
   });
   _op["<~"] = F2(function (f,s) {
      return A2($Native$Signal.map,
      f,
      s);
   });
   var sampleOn = $Native$Signal.sampleOn;
   var dropRepeats = $Native$Signal.dropRepeats;
   var dropIf = $Native$Signal.dropIf;
   var keepIf = $Native$Signal.keepIf;
   var keepWhen = F3(function (bs,
   def,
   sig) {
      return A2(_op["<~"],
      $Basics.snd,
      A3(keepIf,
      $Basics.fst,
      {ctor: "_Tuple2"
      ,_0: false
      ,_1: def},
      A2(_op["~"],
      A2(_op["<~"],
      F2(function (v0,v1) {
         return {ctor: "_Tuple2"
                ,_0: v0
                ,_1: v1};
      }),
      A2(sampleOn,sig,bs)),
      sig)));
   });
   var dropWhen = function (bs) {
      return keepWhen(A2(_op["<~"],
      $Basics.not,
      bs));
   };
   var merge = $Native$Signal.merge;
   var mergeMany = function (signals) {
      return A2($List.foldr1,
      merge,
      signals);
   };
   var foldp = $Native$Signal.foldp;
   var map5 = $Native$Signal.map5;
   var map4 = $Native$Signal.map4;
   var map3 = $Native$Signal.map3;
   var map2 = $Native$Signal.map2;
   var map = $Native$Signal.map;
   var constant = $Native$Signal.constant;
   var Signal = {ctor: "Signal"};
   _elm.Signal.values = {_op: _op
                        ,Signal: Signal
                        ,constant: constant
                        ,map: map
                        ,map2: map2
                        ,map3: map3
                        ,map4: map4
                        ,map5: map5
                        ,foldp: foldp
                        ,merge: merge
                        ,mergeMany: mergeMany
                        ,keepIf: keepIf
                        ,dropIf: dropIf
                        ,keepWhen: keepWhen
                        ,dropWhen: dropWhen
                        ,dropRepeats: dropRepeats
                        ,sampleOn: sampleOn
                        ,Channel: Channel
                        ,Message: Message
                        ,channel: channel
                        ,send: send
                        ,subscribe: subscribe};
   return _elm.Signal.values;
};
Elm.String = Elm.String || {};
Elm.String.make = function (_elm) {
   "use strict";
   _elm.String = _elm.String || {};
   if (_elm.String.values)
   return _elm.String.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _P = _N.Ports.make(_elm),
   $moduleName = "String",
   $Maybe = Elm.Maybe.make(_elm),
   $Native$String = Elm.Native.String.make(_elm),
   $Result = Elm.Result.make(_elm);
   var fromList = $Native$String.fromList;
   var toList = $Native$String.toList;
   var toFloat = $Native$String.toFloat;
   var toInt = $Native$String.toInt;
   var indices = $Native$String.indexes;
   var indexes = $Native$String.indexes;
   var endsWith = $Native$String.endsWith;
   var startsWith = $Native$String.startsWith;
   var contains = $Native$String.contains;
   var all = $Native$String.all;
   var any = $Native$String.any;
   var toLower = $Native$String.toLower;
   var toUpper = $Native$String.toUpper;
   var lines = $Native$String.lines;
   var words = $Native$String.words;
   var trimRight = $Native$String.trimRight;
   var trimLeft = $Native$String.trimLeft;
   var trim = $Native$String.trim;
   var padRight = $Native$String.padRight;
   var padLeft = $Native$String.padLeft;
   var pad = $Native$String.pad;
   var dropRight = $Native$String.dropRight;
   var dropLeft = $Native$String.dropLeft;
   var right = $Native$String.right;
   var left = $Native$String.left;
   var slice = $Native$String.slice;
   var repeat = $Native$String.repeat;
   var join = $Native$String.join;
   var split = $Native$String.split;
   var foldr = $Native$String.foldr;
   var foldl = $Native$String.foldl;
   var reverse = $Native$String.reverse;
   var filter = $Native$String.filter;
   var map = $Native$String.map;
   var length = $Native$String.length;
   var concat = $Native$String.concat;
   var append = $Native$String.append;
   var uncons = $Native$String.uncons;
   var cons = $Native$String.cons;
   var fromChar = function ($char) {
      return A2(cons,$char,"");
   };
   var isEmpty = $Native$String.isEmpty;
   _elm.String.values = {_op: _op
                        ,isEmpty: isEmpty
                        ,cons: cons
                        ,fromChar: fromChar
                        ,uncons: uncons
                        ,append: append
                        ,concat: concat
                        ,length: length
                        ,map: map
                        ,filter: filter
                        ,reverse: reverse
                        ,foldl: foldl
                        ,foldr: foldr
                        ,split: split
                        ,join: join
                        ,repeat: repeat
                        ,slice: slice
                        ,left: left
                        ,right: right
                        ,dropLeft: dropLeft
                        ,dropRight: dropRight
                        ,pad: pad
                        ,padLeft: padLeft
                        ,padRight: padRight
                        ,trim: trim
                        ,trimLeft: trimLeft
                        ,trimRight: trimRight
                        ,words: words
                        ,lines: lines
                        ,toUpper: toUpper
                        ,toLower: toLower
                        ,any: any
                        ,all: all
                        ,contains: contains
                        ,startsWith: startsWith
                        ,endsWith: endsWith
                        ,indexes: indexes
                        ,indices: indices
                        ,toInt: toInt
                        ,toFloat: toFloat
                        ,toList: toList
                        ,fromList: fromList};
   return _elm.String.values;
};
Elm.Task = Elm.Task || {};
Elm.Task.make = function (_elm) {
   "use strict";
   _elm.Task = _elm.Task || {};
   if (_elm.Task.values)
   return _elm.Task.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _P = _N.Ports.make(_elm),
   $moduleName = "Task",
   $Basics = Elm.Basics.make(_elm),
   $Html = Elm.Html.make(_elm),
   $Html$Attributes = Elm.Html.Attributes.make(_elm),
   $Html$Events = Elm.Html.Events.make(_elm),
   $Json$Decode = Elm.Json.Decode.make(_elm),
   $LocalChannel = Elm.LocalChannel.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm),
   $String = Elm.String.make(_elm);
   var onFinish = F2(function (enterMessage,
   escapeMessage) {
      return function () {
         var select = function (key) {
            return function () {
               switch (key)
               {case 13:
                  return $Result.Ok(enterMessage);
                  case 27:
                  return $Result.Ok(escapeMessage);}
               return $Result.Err("Not a \'finish\' key, such as ENTER or ESCAPE");
            }();
         };
         return A3($Html$Events.on,
         "keydown",
         A2($Json$Decode.customDecoder,
         $Html$Events.keyCode,
         select),
         $Basics.identity);
      }();
   });
   var update = F2(function (update,
   task) {
      return function () {
         switch (update.ctor)
         {case "Cancel":
            return $Maybe.Just(_U.replace([["edits"
                                           ,$Maybe.Nothing]],
              task));
            case "Commit":
            return function () {
                 var _v4 = task.edits;
                 switch (_v4.ctor)
                 {case "Just":
                    return function () {
                         var description = $String.trim(_v4._0);
                         return $String.isEmpty(description) ? $Maybe.Nothing : $Maybe.Just(_U.replace([["edits"
                                                                                                        ,$Maybe.Nothing]
                                                                                                       ,["description"
                                                                                                        ,description]],
                         task));
                      }();
                    case "Nothing":
                    return $Maybe.Just(task);}
                 _U.badCase($moduleName,
                 "between lines 56 and 69");
              }();
            case "Completed":
            return $Maybe.Just(_U.replace([["completed"
                                           ,update._0]],
              task));
            case "Delete":
            return $Maybe.Nothing;
            case "Edit":
            return $Maybe.Just(_U.replace([["edits"
                                           ,$Maybe.Just(update._0)]],
              task));
            case "Focus":
            return $Maybe.Just(_U.replace([["edits"
                                           ,$Maybe.Just(task.description)]],
              task));}
         _U.badCase($moduleName,
         "between lines 45 and 73");
      }();
   });
   var Delete = {ctor: "Delete"};
   var Completed = function (a) {
      return {ctor: "Completed"
             ,_0: a};
   };
   var Commit = {ctor: "Commit"};
   var Cancel = {ctor: "Cancel"};
   var Edit = function (a) {
      return {ctor: "Edit",_0: a};
   };
   var Focus = {ctor: "Focus"};
   var view = F2(function (channel,
   task) {
      return function () {
         var description = A2($Maybe.withDefault,
         task.description,
         task.edits);
         var className = A2($Basics._op["++"],
         task.completed ? "completed " : "",
         function () {
            var _v6 = task.edits;
            switch (_v6.ctor)
            {case "Just": return "editing";
               case "Nothing": return "";}
            _U.badCase($moduleName,
            "between lines 82 and 86");
         }());
         return A2($Html.li,
         _L.fromArray([$Html$Attributes.$class(className)]),
         _L.fromArray([A2($Html.div,
                      _L.fromArray([$Html$Attributes.$class("view")]),
                      _L.fromArray([A2($Html.input,
                                   _L.fromArray([$Html$Attributes.$class("toggle")
                                                ,$Html$Attributes.type$("checkbox")
                                                ,$Html$Attributes.checked(task.completed)
                                                ,$Html$Events.onClick(A2($LocalChannel.send,
                                                channel,
                                                {ctor: "_Tuple2"
                                                ,_0: task.id
                                                ,_1: Completed($Basics.not(task.completed))}))]),
                                   _L.fromArray([]))
                                   ,A2($Html.label,
                                   _L.fromArray([$Html$Events.onDoubleClick(A2($LocalChannel.send,
                                   channel,
                                   {ctor: "_Tuple2"
                                   ,_0: task.id
                                   ,_1: Focus}))]),
                                   _L.fromArray([$Html.text(description)]))
                                   ,A2($Html.button,
                                   _L.fromArray([$Html$Attributes.$class("destroy")
                                                ,$Html$Events.onClick(A2($LocalChannel.send,
                                                channel,
                                                {ctor: "_Tuple2"
                                                ,_0: task.id
                                                ,_1: Delete}))]),
                                   _L.fromArray([]))]))
                      ,A2($Html.input,
                      _L.fromArray([$Html$Attributes.$class("edit")
                                   ,$Html$Attributes.value(description)
                                   ,$Html$Attributes.name("title")
                                   ,$Html$Attributes.id(A2($Basics._op["++"],
                                   "todo-",
                                   $Basics.toString(task.id)))
                                   ,A3($Html$Events.on,
                                   "input",
                                   $Html$Events.targetValue,
                                   function (desc) {
                                      return A2($LocalChannel.send,
                                      channel,
                                      {ctor: "_Tuple2"
                                      ,_0: task.id
                                      ,_1: Edit(desc)});
                                   })
                                   ,$Html$Events.onBlur(A2($LocalChannel.send,
                                   channel,
                                   {ctor: "_Tuple2"
                                   ,_0: task.id
                                   ,_1: Commit}))
                                   ,A2(onFinish,
                                   A2($LocalChannel.send,
                                   channel,
                                   {ctor: "_Tuple2"
                                   ,_0: task.id
                                   ,_1: Commit}),
                                   A2($LocalChannel.send,
                                   channel,
                                   {ctor: "_Tuple2"
                                   ,_0: task.id
                                   ,_1: Cancel}))]),
                      _L.fromArray([]))]));
      }();
   });
   var init = F2(function (desc,
   id) {
      return {_: {}
             ,completed: false
             ,description: desc
             ,edits: $Maybe.Nothing
             ,id: id};
   });
   var Model = F4(function (a,
   b,
   c,
   d) {
      return {_: {}
             ,completed: b
             ,description: a
             ,edits: c
             ,id: d};
   });
   _elm.Task.values = {_op: _op
                      ,Model: Model
                      ,init: init
                      ,Focus: Focus
                      ,Edit: Edit
                      ,Cancel: Cancel
                      ,Commit: Commit
                      ,Completed: Completed
                      ,Delete: Delete
                      ,update: update
                      ,view: view
                      ,onFinish: onFinish};
   return _elm.Task.values;
};
Elm.Todo = Elm.Todo || {};
Elm.Todo.make = function (_elm) {
   "use strict";
   _elm.Todo = _elm.Todo || {};
   if (_elm.Todo.values)
   return _elm.Todo.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _P = _N.Ports.make(_elm),
   $moduleName = "Todo",
   $Basics = Elm.Basics.make(_elm),
   $Graphics$Element = Elm.Graphics.Element.make(_elm),
   $Html = Elm.Html.make(_elm),
   $Html$Attributes = Elm.Html.Attributes.make(_elm),
   $Html$Events = Elm.Html.Events.make(_elm),
   $Html$Lazy = Elm.Html.Lazy.make(_elm),
   $List = Elm.List.make(_elm),
   $LocalChannel = Elm.LocalChannel.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Signal = Elm.Signal.make(_elm),
   $String = Elm.String.make(_elm),
   $Task = Elm.Task.make(_elm),
   $Window = Elm.Window.make(_elm);
   var route = _P.portIn("route",
   _P.incomingSignal(function (v) {
      return typeof v === "string" || typeof v === "object" && v instanceof String ? v : _U.badPort("a string",
      v);
   }));
   var savedModel = _P.portIn("savedModel",
   function (v) {
      return v === null ? Elm.Maybe.make(_elm).Nothing : Elm.Maybe.make(_elm).Just(typeof v === "object" && "tasks" in v && "field" in v && "uid" in v && "visibility" in v ? {_: {}
                                                                                                                                                                              ,tasks: typeof v.tasks === "object" && v.tasks instanceof Array ? Elm.Native.List.make(_elm).fromArray(v.tasks.map(function (v) {
                                                                                                                                                                                 return typeof v === "object" && "description" in v && "completed" in v && "edits" in v && "id" in v ? {_: {}
                                                                                                                                                                                                                                                                                       ,description: typeof v.description === "string" || typeof v.description === "object" && v.description instanceof String ? v.description : _U.badPort("a string",
                                                                                                                                                                                                                                                                                       v.description)
                                                                                                                                                                                                                                                                                       ,completed: typeof v.completed === "boolean" ? v.completed : _U.badPort("a boolean (true or false)",
                                                                                                                                                                                                                                                                                       v.completed)
                                                                                                                                                                                                                                                                                       ,edits: v.edits === null ? Elm.Maybe.make(_elm).Nothing : Elm.Maybe.make(_elm).Just(typeof v.edits === "string" || typeof v.edits === "object" && v.edits instanceof String ? v.edits : _U.badPort("a string",
                                                                                                                                                                                                                                                                                       v.edits))
                                                                                                                                                                                                                                                                                       ,id: typeof v.id === "number" ? v.id : _U.badPort("a number",
                                                                                                                                                                                                                                                                                       v.id)} : _U.badPort("an object with fields \'description\', \'completed\', \'edits\', \'id\'",
                                                                                                                                                                                 v);
                                                                                                                                                                              })) : _U.badPort("an array",
                                                                                                                                                                              v.tasks)
                                                                                                                                                                              ,field: typeof v.field === "string" || typeof v.field === "object" && v.field instanceof String ? v.field : _U.badPort("a string",
                                                                                                                                                                              v.field)
                                                                                                                                                                              ,uid: typeof v.uid === "number" ? v.uid : _U.badPort("a number",
                                                                                                                                                                              v.uid)
                                                                                                                                                                              ,visibility: typeof v.visibility === "string" || typeof v.visibility === "object" && v.visibility instanceof String ? v.visibility : _U.badPort("a string",
                                                                                                                                                                              v.visibility)} : _U.badPort("an object with fields \'tasks\', \'field\', \'uid\', \'visibility\'",
      v));
   });
   var infoFooter = A2($Html.footer,
   _L.fromArray([$Html$Attributes.id("info")]),
   _L.fromArray([A2($Html.p,
                _L.fromArray([]),
                _L.fromArray([$Html.text("Double-click to edit a todo")]))
                ,A2($Html.p,
                _L.fromArray([]),
                _L.fromArray([$Html.text("Written by ")
                             ,A2($Html.a,
                             _L.fromArray([$Html$Attributes.href("https://github.com/evancz")]),
                             _L.fromArray([$Html.text("Evan Czaplicki")]))]))
                ,A2($Html.p,
                _L.fromArray([]),
                _L.fromArray([$Html.text("Part of ")
                             ,A2($Html.a,
                             _L.fromArray([$Html$Attributes.href("http://todomvc.com")]),
                             _L.fromArray([$Html.text("TodoMVC")]))]))]));
   var update = F2(function (action,
   state) {
      return function () {
         switch (action.ctor)
         {case "Add":
            return function () {
                 var description = $String.trim(state.field);
                 return $String.isEmpty(description) ? state : _U.replace([["uid"
                                                                           ,state.uid + 1]
                                                                          ,["field"
                                                                           ,""]
                                                                          ,["tasks"
                                                                           ,A2($Basics._op["++"],
                                                                           state.tasks,
                                                                           _L.fromArray([A2($Task.init,
                                                                           description,
                                                                           state.uid)]))]],
                 state);
              }();
            case "ChangeVisibility":
            return _U.replace([["visibility"
                               ,action._0]],
              state);
            case "CheckAll":
            return function () {
                 var updateTask = function (t) {
                    return _U.replace([["completed"
                                       ,action._0]],
                    t);
                 };
                 return _U.replace([["tasks"
                                    ,A2($List.map,
                                    updateTask,
                                    state.tasks)]],
                 state);
              }();
            case "DeleteComplete":
            return _U.replace([["tasks"
                               ,A2($List.filter,
                               function ($) {
                                  return $Basics.not(function (_) {
                                     return _.completed;
                                  }($));
                               },
                               state.tasks)]],
              state);
            case "NoOp": return state;
            case "UpdateField":
            return _U.replace([["field"
                               ,action._0]],
              state);
            case "UpdateTask":
            switch (action._0.ctor)
              {case "_Tuple2":
                 return function () {
                      var updateTask = function (t) {
                         return _U.eq(t.id,
                         action._0._0) ? A2($Task.update,
                         action._0._1,
                         t) : $Maybe.Just(t);
                      };
                      return _U.replace([["tasks"
                                         ,A2($List.filterMap,
                                         updateTask,
                                         state.tasks)]],
                      state);
                   }();}
              break;}
         _U.badCase($moduleName,
         "between lines 71 and 100");
      }();
   });
   var ChangeVisibility = function (a) {
      return {ctor: "ChangeVisibility"
             ,_0: a};
   };
   var CheckAll = function (a) {
      return {ctor: "CheckAll"
             ,_0: a};
   };
   var DeleteComplete = {ctor: "DeleteComplete"};
   var UpdateTask = function (a) {
      return {ctor: "UpdateTask"
             ,_0: a};
   };
   var Add = {ctor: "Add"};
   var UpdateField = function (a) {
      return {ctor: "UpdateField"
             ,_0: a};
   };
   var NoOp = {ctor: "NoOp"};
   var actions = $Signal.channel(NoOp);
   var taskEntry = function (task) {
      return A2($Html.header,
      _L.fromArray([$Html$Attributes.id("header")]),
      _L.fromArray([A2($Html.h1,
                   _L.fromArray([]),
                   _L.fromArray([$Html.text("todos")]))
                   ,A2($Html.input,
                   _L.fromArray([$Html$Attributes.id("new-todo")
                                ,$Html$Attributes.placeholder("What needs to be done?")
                                ,$Html$Attributes.autofocus(true)
                                ,$Html$Attributes.value(task)
                                ,$Html$Attributes.name("newTodo")
                                ,A3($Html$Events.on,
                                "input",
                                $Html$Events.targetValue,
                                function ($) {
                                   return $Signal.send(actions)(UpdateField($));
                                })
                                ,A2($Task.onFinish,
                                A2($Signal.send,actions,Add),
                                A2($Signal.send,
                                actions,
                                NoOp))]),
                   _L.fromArray([]))]));
   };
   var visibilitySwap = F3(function (uri,
   visibility,
   actualVisibility) {
      return function () {
         var className = _U.eq(visibility,
         actualVisibility) ? "selected" : "";
         return A2($Html.li,
         _L.fromArray([$Html$Events.onClick(A2($Signal.send,
         actions,
         ChangeVisibility(visibility)))]),
         _L.fromArray([A2($Html.a,
         _L.fromArray([$Html$Attributes.$class(className)
                      ,$Html$Attributes.href(uri)]),
         _L.fromArray([$Html.text(visibility)]))]));
      }();
   });
   var controls = F2(function (visibility,
   tasks) {
      return function () {
         var tasksCompleted = $List.length(A2($List.filter,
         function (_) {
            return _.completed;
         },
         tasks));
         var tasksLeft = $List.length(tasks) - tasksCompleted;
         var item_ = _U.eq(tasksLeft,
         1) ? " item" : " items";
         return A2($Html.footer,
         _L.fromArray([$Html$Attributes.id("footer")
                      ,$Html$Attributes.hidden($List.isEmpty(tasks))]),
         _L.fromArray([A2($Html.span,
                      _L.fromArray([$Html$Attributes.id("todo-count")]),
                      _L.fromArray([A2($Html.strong,
                                   _L.fromArray([]),
                                   _L.fromArray([$Html.text($Basics.toString(tasksLeft))]))
                                   ,$Html.text(A2($Basics._op["++"],
                                   item_,
                                   " left"))]))
                      ,A2($Html.ul,
                      _L.fromArray([$Html$Attributes.id("filters")]),
                      _L.fromArray([A3(visibilitySwap,
                                   "#/",
                                   "All",
                                   visibility)
                                   ,$Html.text(" ")
                                   ,A3(visibilitySwap,
                                   "#/active",
                                   "Active",
                                   visibility)
                                   ,$Html.text(" ")
                                   ,A3(visibilitySwap,
                                   "#/completed",
                                   "Completed",
                                   visibility)]))
                      ,A2($Html.button,
                      _L.fromArray([$Html$Attributes.$class("clear-completed")
                                   ,$Html$Attributes.id("clear-completed")
                                   ,$Html$Attributes.hidden(_U.eq(tasksCompleted,
                                   0))
                                   ,$Html$Events.onClick(A2($Signal.send,
                                   actions,
                                   DeleteComplete))]),
                      _L.fromArray([$Html.text(A2($Basics._op["++"],
                      "Clear completed (",
                      A2($Basics._op["++"],
                      $Basics.toString(tasksCompleted),
                      ")")))]))]));
      }();
   });
   var allActions = A2($Signal.merge,
   $Signal.subscribe(actions),
   A2($Signal.map,
   ChangeVisibility,
   route));
   var taskActions = A2($LocalChannel.create,
   UpdateTask,
   actions);
   var taskList = F2(function (visibility,
   tasks) {
      return function () {
         var cssVisibility = $List.isEmpty(tasks) ? "hidden" : "visible";
         var allCompleted = A2($List.all,
         function (_) {
            return _.completed;
         },
         tasks);
         var isVisible = function (todo) {
            return function () {
               switch (visibility)
               {case "Active":
                  return $Basics.not(todo.completed);
                  case "All": return true;
                  case "Completed":
                  return todo.completed;}
               _U.badCase($moduleName,
               "between lines 140 and 145");
            }();
         };
         return A2($Html.section,
         _L.fromArray([$Html$Attributes.id("main")
                      ,$Html$Attributes.style(_L.fromArray([{ctor: "_Tuple2"
                                                            ,_0: "visibility"
                                                            ,_1: cssVisibility}]))]),
         _L.fromArray([A2($Html.input,
                      _L.fromArray([$Html$Attributes.id("toggle-all")
                                   ,$Html$Attributes.type$("checkbox")
                                   ,$Html$Attributes.name("toggle")
                                   ,$Html$Attributes.checked(allCompleted)
                                   ,$Html$Events.onClick(A2($Signal.send,
                                   actions,
                                   CheckAll($Basics.not(allCompleted))))]),
                      _L.fromArray([]))
                      ,A2($Html.label,
                      _L.fromArray([$Html$Attributes.$for("toggle-all")]),
                      _L.fromArray([$Html.text("Mark all as complete")]))
                      ,A2($Html.ul,
                      _L.fromArray([$Html$Attributes.id("todo-list")]),
                      A2($List.map,
                      $Task.view(taskActions),
                      A2($List.filter,
                      isVisible,
                      tasks)))]));
      }();
   });
   var view = function (state) {
      return A2($Html.div,
      _L.fromArray([$Html$Attributes.$class("todomvc-wrapper")
                   ,$Html$Attributes.style(_L.fromArray([{ctor: "_Tuple2"
                                                         ,_0: "visibility"
                                                         ,_1: "hidden"}]))]),
      _L.fromArray([A2($Html.section,
                   _L.fromArray([$Html$Attributes.id("todoapp")]),
                   _L.fromArray([A2($Html$Lazy.lazy,
                                taskEntry,
                                state.field)
                                ,A3($Html$Lazy.lazy2,
                                taskList,
                                state.visibility,
                                state.tasks)
                                ,A3($Html$Lazy.lazy2,
                                controls,
                                state.visibility,
                                state.tasks)]))
                   ,infoFooter]));
   };
   var scene = F2(function (model,
   _v8) {
      return function () {
         switch (_v8.ctor)
         {case "_Tuple2":
            return A4($Graphics$Element.container,
              _v8._0,
              _v8._1,
              $Graphics$Element.midTop,
              A3($Html.toElement,
              550,
              _v8._1,
              view(model)));}
         _U.badCase($moduleName,
         "on line 231, column 5 to 54");
      }();
   });
   var focus = _P.portOut("focus",
   _P.outgoingSignal(function (v) {
      return v.ctor === "Nothing" ? null : v._0;
   }),
   function () {
      var toSelector = function (action) {
         return function () {
            switch (action.ctor)
            {case "UpdateTask":
               switch (action._0.ctor)
                 {case "_Tuple2":
                    switch (action._0._1.ctor)
                      {case "Focus":
                         return $Maybe.Just(action._0._0);}
                      break;}
                 break;}
            return $Maybe.Nothing;
         }();
      };
      return A2($Signal.map,
      toSelector,
      $Signal.subscribe(actions));
   }());
   var emptyModel = {_: {}
                    ,field: ""
                    ,tasks: _L.fromArray([])
                    ,uid: 0
                    ,visibility: "All"};
   var initialModel = A2($Maybe.withDefault,
   emptyModel,
   savedModel);
   var model = A3($Signal.foldp,
   update,
   initialModel,
   allActions);
   var main = A3($Signal.map2,
   scene,
   model,
   $Window.dimensions);
   var save = _P.portOut("save",
   _P.outgoingSignal(function (v) {
      return {tasks: Elm.Native.List.make(_elm).toArray(v.tasks).map(function (v) {
                return {description: v.description
                       ,completed: v.completed
                       ,edits: v.edits.ctor === "Nothing" ? null : v.edits._0
                       ,id: v.id};
             })
             ,field: v.field
             ,uid: v.uid
             ,visibility: v.visibility};
   }),
   model);
   var Model = F4(function (a,
   b,
   c,
   d) {
      return {_: {}
             ,field: b
             ,tasks: a
             ,uid: c
             ,visibility: d};
   });
   _elm.Todo.values = {_op: _op
                      ,Model: Model
                      ,emptyModel: emptyModel
                      ,NoOp: NoOp
                      ,UpdateField: UpdateField
                      ,Add: Add
                      ,UpdateTask: UpdateTask
                      ,DeleteComplete: DeleteComplete
                      ,CheckAll: CheckAll
                      ,ChangeVisibility: ChangeVisibility
                      ,update: update
                      ,view: view
                      ,taskEntry: taskEntry
                      ,taskList: taskList
                      ,controls: controls
                      ,visibilitySwap: visibilitySwap
                      ,infoFooter: infoFooter
                      ,main: main
                      ,scene: scene
                      ,model: model
                      ,initialModel: initialModel
                      ,allActions: allActions
                      ,actions: actions
                      ,taskActions: taskActions};
   return _elm.Todo.values;
};
Elm.VirtualDom = Elm.VirtualDom || {};
Elm.VirtualDom.make = function (_elm) {
   "use strict";
   _elm.VirtualDom = _elm.VirtualDom || {};
   if (_elm.VirtualDom.values)
   return _elm.VirtualDom.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _P = _N.Ports.make(_elm),
   $moduleName = "VirtualDom",
   $Graphics$Element = Elm.Graphics.Element.make(_elm),
   $Json$Decode = Elm.Json.Decode.make(_elm),
   $Native$VirtualDom = Elm.Native.VirtualDom.make(_elm),
   $Signal = Elm.Signal.make(_elm);
   var lazy3 = $Native$VirtualDom.lazy3;
   var lazy2 = $Native$VirtualDom.lazy2;
   var lazy = $Native$VirtualDom.lazy;
   var on = $Native$VirtualDom.on;
   var property = $Native$VirtualDom.property;
   var Property = {ctor: "Property"};
   var fromElement = $Native$VirtualDom.fromElement;
   var toElement = $Native$VirtualDom.toElement;
   var text = $Native$VirtualDom.text;
   var node = $Native$VirtualDom.node;
   var Node = {ctor: "Node"};
   _elm.VirtualDom.values = {_op: _op
                            ,Node: Node
                            ,node: node
                            ,text: text
                            ,toElement: toElement
                            ,fromElement: fromElement
                            ,Property: Property
                            ,property: property
                            ,on: on
                            ,lazy: lazy
                            ,lazy2: lazy2
                            ,lazy3: lazy3};
   return _elm.VirtualDom.values;
};
Elm.Window = Elm.Window || {};
Elm.Window.make = function (_elm) {
   "use strict";
   _elm.Window = _elm.Window || {};
   if (_elm.Window.values)
   return _elm.Window.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _P = _N.Ports.make(_elm),
   $moduleName = "Window",
   $Native$Window = Elm.Native.Window.make(_elm),
   $Signal = Elm.Signal.make(_elm);
   var height = $Native$Window.height;
   var width = $Native$Window.width;
   var dimensions = $Native$Window.dimensions;
   _elm.Window.values = {_op: _op
                        ,dimensions: dimensions
                        ,width: width
                        ,height: height};
   return _elm.Window.values;
};
