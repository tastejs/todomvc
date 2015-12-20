
(warning: specification not up to date)

### LAY

LAY involves writing LSON (Layout Syntax Object Notation)


### LAY methods

- LAY.run()
- LAY.level()
- LAY.take()
- LAY.rgb()
- LAY.rgba()
- LAY.color()
- LAY.hex()
- LAY.hsla()
- LAY.hsl()
- LAY.transparent()
- LAY.levels()

### LAY.run()
  
  The input to `LAY.run()` is an object known as LSON.

    LAY.run({
      "<ChildName>": {
        $type: string,
        $gpu: boolean,
        $inherit: string | object | [ string | object, ... ],
        $obdurate: [ string, ... ],
        $load: function,

        exist: boolean (take),
        data: object,
        props: object,
        when: object,
        transition: object,

        many: {
          $load: function,
          $id: string,

          data: object,
          formation: string (take),
          sort: [sortDict, ...],
          filter: LAY.take,
          rows: array | take,
          fargs: object,

          states: {
            < name >: {
              onlyif: take,
              formation: string (take),
              sort: [sortDict, ...],
              filter: LAY.take,
              fargs: obj,
              install: function
              uninstall: function
            }
          }
        },
        states: {
          < name >: {
            onlyif: boolean (take),
            props: object,
            when: object,
            transition: transitionObj,
            install: function,
            uninstall: function
          }
        }
       }
     }
    });


### LSON.$type

  Type: `string`.
  On of the below
  - "none"
  - "text" (auto-detect is on to distinguish between "none" and "text")
  - "image"
  - "video"
  - "audio"
  - "canvas"
  - "input:line"
  - "input:multiline"
  - "input:password"
  - "input:select"
  - "input:multiple"
  - "input:file" [coming soon]
  - "input:< any other valid input[type] html property i.e color, date, etc >" [coming soon]


### LSON.$inherit

Type: `string` | `Object` | `array of strings and/or Objects`
`string`: Relative path to level to inherit from (eg: "../RoundButton")
`Object`: Direct object which serves as LSON for inheritance.
More about inheritance in inherit section of this document.


### LSON helper levels

If a level name begins with "_", the level will not render.
(Primary usage for such a level exists solely for inheritance)


### data

Type: `Object`
A mapping of keys to values, where meta information specific to the
level can be used for storage.


### props

Type: `Object`

The keys within `props` are predefined

##### List of all possible props

Prioritizing numbers:
There exist some CSS properties which take either a number (in pixels) or a string.  An example would be "background-position"
which can be "10px" or "center".
Within LAY, both types are accepted as well, however to ensure transitionability the input must be numerical. Therefore it is still possible to use "center", "auto", "10%", and other such CSS strings where the input is not in pixels, however if there is a motive in changing the value through a state change alongwith with a transition then numerical
values should be provided.


Defaults:

- display  
  `boolean`
  Default: true

- visible  
  `boolean`
  CSS visibility (true for "inherit", false for "hidden")  
  Default: true

- width  
  `number`
  Width
  Default: LAY.take('', '$naturalWidth') [for "/": LAY.take("", "$windowWidth")]

- height  
  `number`
  Height
  Default: LAY.take('', '$naturalHeight') [for "/": LAY.take("", "$windowHeight")]

- top  
  `number`  
  Default: 0

- left  
  `number`  
  Default: 0

- right  
  `number`  

- bottom  
  `number`  

- centerX   
  `number`  

- centerY  
  `number`  

- z  
  `number`  
  In pixels  
  Default: 0

- shiftX  
  `number`  
  Additional x translation  
  Default: 0

- shiftY  
  `number`  
  Additional y translation  
  Default: 0

- scaleX  
  `number`  
  Units to scale the X dimension  
  Default: 1

- scaleY  
  `number`  
  Units to scale the Y dimension  
  Default: 1

- scaleZ  
  `number`  
  Units to scale the Z dimension  
  Default: 1

- rotateX  
  `number`
  In degrees  
  Default: 0

- rotateY  
  `number`  
  In degrees  
  Default: 0

- rotateZ  
  `number`  
  In degrees  
  Default: 0

- skewX  
  `number`  
  In degrees  
  Default: 0

- skewY  
  `number`  
  In degress  
  Default: 0

- originX  
  `number`  
  in fraction (percent)  
  Default: 0.5

- originY  
  `number`  
  in fraction (percent)  
  Default: 0.5

- originZ  
  `number`  
  in pixels  
  Default: 0

- perspective  
  `number`  
  In pixels  
  Default: 0

- perspectiveOriginX  
  `number`  
  in fraction (percent)  
  Default: 0.5

- perspectiveOriginY  
  `number`  
  in fraction (percent)  
  Default: 0.5

- backfaceVisibility  
  `boolean`  
  Default: false

- opacity  
  `number`  
  Default: 1

- overflowX  
  `string`  
  CSS overflow property  
  Default: 'hidden'

- overflowY  
  `string`  
  CSS overflow property  
  Default: 'hidden'

- overflow  
  `undefined`  
  shorthand for `overflowX` and `overflowY`

- scrollX  
  `number`  
  Default: 0

- scrollY  
  `number`  
  Default: 0

- focus  
  `boolean` 
  Default: false

- scrollElastic  
  `boolean`  
  CSS `-webkit-overflow-scrolling` (true for "touch", false for "auto")  
  Default: true

- cursor  
  `string`  
  CSS cursor property  
  Default: LAY.take("../", "cursor") [for "/": "auto"]

- userSelect  
  `string`  
  CSS user-select  
  Default: LAY.take("../", "userSelect") [for "/": "auto"]

- title  
  `string`  
  Default: none

- tabindex  
  `number`  
  Default: none

- background (no support for multiple backgrounds)  
  This is an "object-type" prop.  
    {
      color: LAY.Color (Default: transparent),  
      image: string (CSS background-image)(Default: "none"),  
      attachment: string (CSS background-attachment) (Default: "scroll"),  
      repeat: string (CSS background-repeat) (Default: "repeat"),  
      positionX: string (CSS background-position-x) [non-transitionable] / number (in pixels) (Default: 0),  
      positionY: string (CSS background-position-y) [non-transitionable] / number (in pixels) (Default: 0),  
      sizeX: string (CSS background-size-x) [non-transitionable] / number (in pixels) (Default: "auto"),  
      sizeY: string (CSS background-size-y) [non-transitionable] / number (in pixels) (Default: "auto")  
     }  


- boxShadows  
  This is a "multiple-type" and an "object-type" prop.
    [  
      {  
        inset: boolean (Default: false)  
        x: number (in pixels),  
        y: number (in pixels),  
        blur: number,  
        spread: number (Default: 0),  
        color: LAY.Color  
      }  
      ...  
    ]  

- cornerRadius  
  `number`  
  This is a "shorthand-type" prop.  
  Shorthand for `cornerRadiusTopLeft`, `cornerRadiusTopRight`, `cornerRadiusBottomRight`, `cornerRadiusBottomLeft`  
  Default: 0

- border  
  This is a "shorthand-type" prop.  
  Shorthand for border < Top/Right/Bottom/Left >< Style/Color/Width >  
    { top/right/bottom/left/< undefined >: {  
      style: string (CSS border-style) (Default: 'solid'),  
      color: LAY.Color (Default: transparent),  
      width: number (Default: 0)  
    } }

- filters  
  This is a "multiple-type" and an "object-type" prop.  
    [  
      [    
        type: "url" | "blur" | "brightness" | "contrast" | "dropShadow" | "grayscale" | "hueRotate" | "invert" | "opacity" | "saturate" | "sepia",  
        blur: number (in pixels) |  
        brightness: number (in fraction (percent)) |  
        contrast: number (in fraction (percent)) |  
        dropShadow: {  
          x: number (in pixels),  
          y: number (in pixels),  
          blur: number (in pixels),  
          spread: number (in pixel) [ currently disabled due
          to lack of browser support],  
          color: LAY.Color  
        },  
        grayscale: number (in fraction (percent)),  
        hueRotate: number (in degrees),  
        invert: number (in fraction (percent)),  
        opacity: number (in fraction (percent)),  
        saturate: number (in fraction (percent)),  
        sepia: number (in fraction (percent)),  
        url: string  
      ]  
      ...  
    ]  

- text  
  `string`  

- textSize  
  in pixels  
  `number`  
  Default: LAY.take("../", "textSize") [for "/": 15]

- textFamily  
  `string`  
  CSS font-family  
  Default: LAY.take("../", "textFamily") [for "/": "sans-serif"]

- textWeight  
  `string`  
  CSS font-weight  
  Default: LAY.take("../", "textWeight") [for "/": "normal"]

- textColor  
  `LAY.Color`  
  Default: LAY.take("../", "textColor") [for "/": LAY.color("black")]

- textVariant  
  `string`  
  CSS font-variant  
  Default: LAY.take("../", "textVariant") [for "/": "normal"]

- textTransform  
  `string`  
  CSS text-transform  
  Default: LAY.take("../", "textTransform") [for "/": "none"]

- textStyle  
  `string`  
  CSS font-style  
  Default: LAY.take("../", "textStyle") [for "/": "normal"]

- textDecoration  
  `string`  
  CSS text-decoration  
  Default: "none"

- textLetterSpacing  
  `number` / `string`  
  `number`: In pixels.  
  `string`: CSS letter-spacing [non-transitionable]  
  Default: LAY.take("../", "textLetterSpacing") [for "/": 0]

- textWordSpacing  
  `number` / `string`  
  `number`: In pixels.  
  `string`: CSS word-spacing [non-transitionable]  
  Default: LAY.take("../", "textWordSpacing") [for "/": 0]

- textAlign  
  `string`  
  CSS text-align  
  Default: LAY.take("../", "textAlign") [for "/": "left"]

- textDirection  
  `string`  
  CSS direction  
  Default: LAY.take("../", "textDirection") [for "/": "ltr"]

- textLineHeight  
  `number` / `string`  
  `number`: In em.  
  `string`: CSS line-height [non-transitionable]  
  Default: LAY.take("../", "textLineHeight") [for "/": 1.3]

- textSmoothing  
  `string`  
  CSS -webkit-font-smoothing  
  Default: LAY.take("../", "textSmoothing") [for "/": "antialised"]

- textRendering  
  `string`  
  CSS text-rendering  
  Default: LAY.take("../", "textRendering") [for "/": "auto"]

- textOverflow  
  `string`  
  CSS text-overflow  
  Default: "clip"

- textIndent  
  `number`  
  Default: LAY.take("../", "textIndent") [for "/": 0]

- textWrap  
  `string`  
  CSS white-space  
  Default: LAY.take("../", "textWrap") [for "/": "nowrap"]

- textWordBreak  
  `string`  
  CSS word-break  
  Default: LAY.take("../", "textWordBreak") [for "/": "normal"]

- textWordWrap  
  `string`  
  CSS word-wrap  
  Default: LAY.take("../", "textWordWrap") [for "/": "normal"]

- textPadding  
  `number`  
  This is a "shorthand-type" prop.  
  Border box padding.  
  Shorthand for `textPaddingTop`, `textPaddingRight`, `textPaddingBottom` and `textPaddingLeft`  
  Default: 0

- textShadows  
  This is a "multiple-type" and an "object-type" prop.  
    [  
      {  
        x: number,  
        y: number,  
        blur: number,  
        color: LAY.Color  
      }  
      ...  
    ]  

- inputLabel  
  `string`  
  Default: ""  

- input  
  `string` / `array`  
  `array` for "input:select", "" for remaining 
  Default: [] for "input:select", "" for remaining 

- inputPlaceholder  
  `string`  
  Default: ""  

- inputAutocomplete  
  `boolean`  
  Default: true  

- inputAutocorrect  
  `boolean`  
  Default: true  

- inputDisabled  
  `boolean`  
  Default: false  

- linkHref  
  `string`  

- linkRel  
  `string`  
  HTML a[rel]

- linkDownload  
  `boolean`  

- linkTarget  
  `string`  
  HTML a[target]  

- imageUrl  
  `string`  

- imageAlt  
  `string`  

- audioSrc / videoSrc  
  `string`  

- videoSources / audioSources  
  This is a "multiple-type" and an "object-type" prop.
    [  
      {  
        type: string ( html5 < source > type ),  
         src: string ( html5 < source > src )  
      },  
      ...  
    ]  

- videoTracks / audioTracks  
  This is a "multiple-type" and an "object-type" prop.  
    [  
      {  
        default: boolean (Default: false),  
        kind: string ( html5 < track > kind ) (Default: ""),  
        label: string ( html5 < track > label ) (Default: ""),
        src: string ( html5 < track > src ) (Default: ""),
        srclang: string ( html5 < track > srclang ) (Default: "")
      },
      ...
    ]


- videoAutoplay  
  `boolean`
  Default: false


- videoController / audioController  
  `boolean`
  Default: true


- videoCrossorigin  
  `string`
  html5 < video > crossorigin
  Default: "anonymous"


- videoLoop / audioLoop  
  `boolean`
  Default: false


- videoMuted / audioMuted  
  `boolean`
  Default: false

- videoPreload / audioPreload  
  `string`
  html5 < video >/< audio > preload
  Default: 'auto'

- videoPoster  
  `string`

- audioVolume  
  `number`
  Default: 1.0


### Attributes

  The below values can be directly accessed through
  the LAY Level through `.attr(< access key >)`
  The same access keys are used as the 2nd argument in LAY.Take

  - <prop>

  - data.<data>

  - when.<event>.<num>

  - transition.<attr>.<duration/delay/done/type>

  - transition.<attr>.args.<arg>

  - load

  - formation

  - fargs.<formation>.<key>

  - sort.<num>.key

  - sort.<num>.ascending

  - filter

  - <state>.<prop>

  - <state>.when.<event><num>

  - <state>.transition.<attr><duration/delay/done/type>

  - <state>.transition.<attr>.args.<arg>

  - <state>.onlyif

  - <state>.install

  - <state>.uninstall

  - $type

  - $inherit

  - $obdurate

  - $dataTravelling (`boolean`)

  - $dataTravelDelta (`number`)

  - $dataTravelLevel ('LAY.Level')

  - $windowWidth

  - $windowHeight

  - $naturalWidth (`number`)
    Width of the part occupied by text if its a text element, image if its an image element, otherwise if a view then the width occupied by the children parts.

  - $naturalHeight (`number`)
    Height of the part occupied by text if its a text element, image if its an image element, otherwise if a view then the height occupied by the children parts.

  - $absoluteTop (`number`)
    Top of the element added with $absoluteTop of its parent level.

  - $absoluteLeft (`number`)
    Left of the element added with $absoluteLeft of its parent level.

  - $id (`string`)
    The name of the unique key which is reponsible for id for each row in `rows` for many-level

  - $i (`number`)
    Index of a (`Many`) derived `Level` with respect to other `Level`s derived in the `Many` Level, as decided by the `sort` key. Numbering begins from 1.

  - $f (`number`)
    Index of a (`Many`) derived `Level` with respect to other `Level`s derived in the `Many` Level, as decided by the  `filter`, `sort` keys. Levels which do not pass the filter have a an index of -1. Numbering begins from 1.


  - $clicking (`boolean`)

  - $hovering (`boolean`)

  - $focused (`boolean`)

  - $scrolledX (`number`)

  - $scrolledY (`number`)

  - $input (`string` / `array` )


### LSON key: $obdurate

  Readonlys such as "$hovering" and "$clicking" and the others require 2 or more event listeners bound to the respective DOM element. These event listeners are expensive to inculcate within all Level Parts by default. Thus only if there exists a reference to one of these read-only attributes within the LSON as a "take()", the event listeners will be activated. Albeit the issue lies when/if a reference is made to one of these readonlys using "Level.attr()", since there is no deterministic method to be aware and switch on the event listeners for the corresponding read-only. This is the purpose behind `$obdurate`, `$obdurate` takes in an array of strings, where strings are references made to such read-onlys. Thus if a reference is made within `$obdurate` LAY will switch on the event listeners for the
  read-only.


### LSON.many


### LSON key: states

Object containing states.
More about states in the states section


### LSON key: children

Optionally children LSON can be placed as an object within the LSON under the `children` key.

### LSON.when

Contains events as keys, and values as a callback function or
arrays of callback functions (order respected)
The context of the handler function will be the corresponding `Level`.

example with a single callback function specified:

    LAY.run({
      Box: {
        props: {
          text: "Hello World"
        },
        when: {
          click: function() {
              console.log( "Hello World!" );
          }
        }
      }
    });

example with multiple callback functions specified (with the aid on array):

    LAY.run({
      Box: {
        props: {
          text: "Hello World"
        },
        when: {
          click: [
            function() {
              console.log( "Hello" );
            },
            function() {
              console.log( "World!" );
            }
          ]
        }
      }
    });



### Level

To get the Level:

  LAY.level(level) // fetches level
  <level>.level(level) // fetches level wrt reference

LAY.Level methods:

  
  attr( attr ) //gets attr value
  data( key, val ) //changes data value
  parent()
  path()
  many()
  addChildren()
  remove()
  row()
  rowAdd()
  rowsMore()
  rowsCommit()
  rowsUpdate()
  rowDeleteByID()
  rowsDelete()
  queryRows()
  queryFilter()



### LAY.take & LAY.Take

creates LAY.Take object:

  LAY.take(level, property)

or

  LAY.take(val) //essentially just value val


LAY.Take methods

  - add(alias:plus),subtract(alias:minus),divide,multiply
  - remainder
  - half, double (unary)
  - min, max
  - ceil, floor, round, abs, sin, cos, tan
  - log, pow
  - negative (unary)
  - number (converts to number)
  - index, length, slice (for array)
  - key (for dict)
  - concat, lowercase, capitalize, uppercase (for string)
  - fn (context `this` is the `Level`)
  - format, i18nFormat
  - (these return booleans) eq (===), neq (!==), gt, lt, gte, lte, not, contains
  - (these return booleans) and, or, xor
  - (these return booleans) match, test (for regex)
  - (LAY.Color) colorLighten, colorDarken, colorSaturate, colorDesaturate, colorContrast, colorAlpha, colorRed, colorGreen, colorBlue, colorInvert, colorHue, colorLightness, colorSaturation, colorEquals
  - (many) filterEq, filterNeq, filterGt, filterLt, filterLte, filterGte, filterRegex,
  filterContains, filterWithin, filterFn,
  foldMax, foldMin, foldSum, foldFn,
   queryFetch, length


  takes one argument, either:
    - LAY.Take object
    - anything else

  LAY.take(levelPath, property).add(10).divide(LAY.take(levelPath2,attr2)).subtract(10).multiply(1.2)
  LAY.take(level, attr).min(LAY.take(levelPath2,attr2), 20, 30)
  LAY.take("foo:%s, bar:%s, baz:%s").format(LAY.take(levelPath1, attr1), LAY.take(levelPath2, attr2), LAY.take(levelPath3, attr3) )
  LAY.take(function).fn(LAY.take(levelPath1, attr1), LAY.take(levelPath2, attr2), LAY.take(levelPath3, attr3), function( arg1, arg2, arg3 ) {
    return something
  })
  LAY.take('/', 'data.lang').i18nFormat(
  {
    lang-code: formattable string
    .....
  },
  LAY.take(level1, attr1), LAY.take(level2,attr2)
  )

  LAY.take(manyLevelPath, "many").filterGt("age", 10).filterLt(
  "age", LAY.take(level, attr)).length()



)


### LAY.Color (LAY.rgb, LAY.rgba, LAY.hsl, LAY.hsla, LAY.color)

LAY.rgb(r,g,b)   (r,g,b:[0,255])
LAY.rgba(r,g,b,a) (r,g,b:[0,255], a:[0,1])
LAY.hsl(h,s,l)   (h:[0,240], s,l: [0,1])
LAY.hsla(h,s,l,a) (h:[0,240], s,l,a: [0,1])
LAY.color(name)  [name: XML recognized color]
LAY.hex(hex) [hex: hexadecimal number]
LAY.transparent()


eg of take with color:

  color: LAY.take('header', 'color').colorDarken(0.5)
  color: LAY.rgb(100, LAY.take('','data.green'),200).colorLighten(0.1)



### Order of Transformation

Position -> Scale -> Skew -> Rotate


### Inheritance

    LAY.run({
      "BigBox": {
        $inherit < level string >
      }
    })

or

    LAY.run({
      "BigBox": {
        $inherit < object reference >
      }
    })


also together using an array (the order of the array is respected from left to right)

  LAY.run({
    "BigBox": {
      $inherit [ < object reference > | < level string >, ... ]
    }
  })


looks like:

  LAY.run({
    "BigBox": {
      $inherit [ '../Box', someBoxObject ]
    }
  })


for example:

    var box =  {
        props: {
          width: 200,
          height: 200
        },
        data: {
          foo: 10,
          bar: "toystory3"
        },
        children: {
          LeftSide: {
            props: {
              width: LAY.take('parent', 'width').half(),
              height: LAY.take('parent', 'height').half()
            }
          }
      }
    }



    LAY.run({
      "BigBox": {
        $inherit: [ box ],
        props: {
          width: 300,
          height: 300
        },
        LeftSide: {
          props: {
            backgroundColor: LAY.color('blue')
          }
        },
        RightSide: {
          props: {
            left: LAY.take('../LeftSide', 'right'),
            width: LAY.take('', 'textWidth'),
            text: 'nothing here'
          }
        }
      }
    });

becomes:

    { BigBox: {
        props: {
          width: 200,
          height: 200
        }
        data: {
          foo: 10,
          bar: "lala"
        },
        LeftSide: {
          props: {
            width: LAY.take('parent', 'width').half(),
            height: LAY.take('parent', 'height').half(),
            backgroundColor: LAY.color('red')
          }
        }
        RightSide: {
          props: {
            left: LAY.take('prev-sibling', 'right'),
            text: 'nothing here'
          }
        }
      }
    }


##### LAY inheritance rules

- events within 'when' key stacks up as an array
- the scope of `states[state]` and `many` are inherited recursively iwth the same inheritance rulest
- the `transiton` key inherits to the lowest level
- all other props are overwritten at single level, and data values which are objects are cloned before copying over.
- the 'many.sort' key is overwritten

example of `when` stacking up:

  LAY.run({
      "Box": {
        when: {
          "click": function() {
            console.log("Box clicked");
          }
        }
      },
      "OtherBox": {
        $inherit: ["Box"],
        when: {
          "click": function() {
            console.log("OtherBox clicked");
          }
        }
      }
  })

would essentially compile to:

  "OtherBox": {
    when: {
      "click": [
        function() {
          console.log("Box clicked");
        },
        function() {
          console.log("OtherBox clicked");
        }
      ]
    }
  }



### LAY references

  - Root
    '/'

  - Direct
    '/Rankings/Winners/Stats'

  - Relative
    'Winners/Stats'
    '../'

  - Current
    ''

  - Many Level 
    "*" / "many"

  - Closest Many Derived Parent
    ".../"

  - Special
      - '' ('.')
      - '' ('.')
      - 'parent' ('../')

  - Many (by predetermined id field):
    /Page/Feed/Post:507c7f79bcf86cd7994f6c0e



### LAY states

  Reserved state name: "root"

  LAY.run({
    LeaderBoard: {
          children: {
            Nav: {
              props: {
                width:200,
                left: 0,
                backgroundColor: LAY.color('black'),
                textColor:LAY.color('white')
              },
              state: ['closed'],
              states: {
                closed: {
                  props: {
                    left: LAY.take('', 'width').negative()
                  },
                  onlyif: LAY.take('', 'data.locked').and(LAY.take('../', 'state.collapsed'))
                }
              }
            }
        }
      }
  })



States are unordered.
The inheritance mechanism governing states matches that mentioned for the `$inherit` key.
onlyif is the condition for which a state needs to be activated.
Takes across states and root lson takes place by prefixing "< state name >." to the corresponding "props", "when", and "transition" keys:

LAY.run({
    Box: {
      props: {
        backgroundColor: LAY.rgba(245, 100, 145, 0.5)
      },
      states: {
        hovering: {
          onlyif: LAY.take("", "$hovering"),
          props: {
            backgroundColor: LAY.take("", "root.backgroundColor").colorDarken(0.8)
          }
        }
      }
    }

})



### Many

  Related methods:
    - rowsMore()
    - rowsCommit()


	LAY.run({
      "BioData": {
        children: {
          "Person": {
            data: {
              onlyStarks: false
            },
            many: {
           
              formation:'onebelow',
              sort: [{key:"name", ascending:true}],
              fargs: {
                onebelow: { gap: 2 }
              },
              
              $id: "_id",

              rows: [
                {_id:'00423', name:'Eddard Stark',
                  family:'Stark', age: 50},
                {_id:'08383', name:'Tyrion Lannister',
                  family:'Lannister', age: 40},
                {_id:'07323', name:'Sansa Stark',
                  family:'Stark', age: 42},  
                {_id:'01919', name:'Joffrey Baratheon',
                  family:'Baratheon', age: 16},
                {_id:'01030', name:'Jamie Lannister',
                  family:'Lannister', age: 32},
              ],
              states: {
                "starks": {
                  onlyif: LAY.take("", "data.onlyStarks"),
                  filter: LAY.take("", "rows").filterEq("family", "Stark")
                }
              }
            }
          }
      }
    }
  })




`$id`: key which is id (cannot be changed)  
`sort`: array of sort dicts contains a sub-key "key" and "ascending", the former refers to the key name within the row, the latter is a boolean. Either can have Take values.  
`filter`: the levels which pass the filter will be displayed,
the others will be hidden. (note: levels derived of many will have their "display" automatically handled through this filter, and thus manually using the "display" prop within a
many derived level is prohibited) 


`rows`

This takes in either an 


example:

  {_id:'00423', name:'Eddard Stark', age: 50 },

more can be added by:

  LAY.level('/BioData/Person').rowsMore( [{_id:'01010', name: 'Robb Stark', age: 32}] )


or committed/changed:

  LAY.level('/BioData/Person').rowsCommit( [
    {_id:'00423', name:'Eddard Stark', age: 50},
    {_id:'08383', name:'Tyrion Lannister', age: 40},
    {_id:'01919', name:'Joffrey Baratheon', age: 16},
    {_id:'01010', name: 'Robb Stark', age: 32}
  ] );


formation:
  `String`

All built-in formations:
  - "onebelow"
  - "totheright"
  - "grid"
  - "circular"


Formation Arguments:

Arguments for formation are to be specified in the
LSON key "many.fargs.< formation name >"
Below are formation arguments for corresponding formations:

  - "onebelow"
    - gap: distance in pixels to be kept vertically between consecutive Levels
  - "totheight"
    - gap: distance in pixels to be kept horizontally between consecutive Levels
  - "grid"
    - hgap: distance in pixels to be kept horizontally
    - vgap: distance in pixels to be kept vertically
    - columns: number of columns
  - "circular"
    - radius: radius of circle

**Custom Formation**

Formations can be added on the go, using `LAY.formation()`,
with a unique formation name and formation function to it.
An example of the "onebelow" formation:

`LAY.formation( fn, )`


### State Transition Object

Transitions for numeric prop-typed attributes.

	{
      all: { duration: 100, type: "spring", args: { tension: 100 } },
      left: { duration: 200},
      top: { delay: 500 },
      opacity: { duration:2000, done: function(){ console.log("opaque") }  }
	}

Each key in the state transition object except for "all" directly refer to a prop-typed attribute.
The key refers to an object with 5 possible keys:
    (i) type ( type of transition )  
    (ii) duration ( of the transition )  
    (iii) delay ( till the start of the transition )  
    (iv) done ( function handler executed at the end of the transition )  
    (v) args ( additional args )

The type can one of the 3:
  "linear"  
  "cubic-bezier"  
  "spring"  

The corresponding arguments provided within args are:

  - "linear", "ease", "ease-in", "ease-out", "ease-in-out": no arguments
  - "cubic-bezier"  
    - a: float between 0 and 1
    - b: float between 0 and 1
    - c: float between 0 and 1
    - d: float between 0 and 1
  - "spring"
    - tension
    - friction
    - velocity (default: 0)
    - threshold (default: 0.001)


An attribute can be of 2 types:

  (1) Transitionable  
    Any numeric attribute can be transitioned.
  (2) Non-transitionable  
    Non numeric attributes such as textFamily (font family) are non transitionable.
Upon transition, the duration value for its transition will be ignored, and the
new value will come into effect immediately. If a delay is required, the delay
key can be specified with a duration, implying that the value will come into
effect only after the specified delay.




##### dataTravel

`Level.dataTravelBegin( dataKey, changedData )`  
`Level.dataTravelContinue( delta )`  
`Level.dataTravelArrive( isArrived )`  

note: `dataTravelling` attribute is set to true when travelling

Using the `Level.data( dataKey, changedData )` data can
be changed of any Level. This is data change can cause change in props of
the Level in context, or any other Level constrained by it, directly or indirectly.
This potential data change can have 2 attribute configuration of the Level, these 2 attribute configurations
can result in different observation renderation of the Level:
  (1) The current attribute configuration
  (2) The new attribute configuration (caused by the data change)

With `Level.dataTravelBegin( changedData )`, a controllable transition is initiated.
The position within the transition can be specified by a delta range from 0 to 1 using
the `Level.dataTravelContinue( delta )`, finally the travel can be terminated by calling
the `Level.dataTravelArrive( isArrived )` method, where is `isArrived` contains a boolean
specifying whether the new data modifications should be final (true) or to revert back to the
original data values (false).

Note that while data travelling, any call to `attr()` will return the previous data values.

**Extra attributes associated with data travel**

Three (read-only) attributes are available to the root `Level` which contain information of data travelling:

- $dataTravelling
  This is a boolean specifying `true` if there is data travelling.

- $dataTravelDelta
  This is a float (number) specifying the delta of the data travelling.

- $dataTravelLevel
  This is the Level where the data travel was initiated from (using dataTravelBegin)


Example:

Suppose we would want to create a drawer menu.
The drawer menu can be hidden or visible on the screen.
The visibility can be toggled using a button available within the interface.
However, we would also like to include functionality of a user input of a finger swipe, whereby the drawer menu moves along
the point of swipe.

To solve this, we first find which data attribute controls the drawer menu state.
In our application, if it is controlled by the "data.collapsed" attribute, then we can
begin a data travel based on it.


	function touchStartHandler () {
  	  // Initiate the data travel
  	  this.dataTravelBegin( { "data.collapsed" : !(this).attr("data.collapsed") } )
	}

	function touchMoveHandler () {
	  var isCollapsingMenu = !(this).attr("data.collapsed");
      // Note the below function call is a dummy function
      var delta = findDeltaOfTouchMovement( isCollapsingMenu );
  	  this.dataTravelContinue( delta );
	}

	function touchEndHandler () {
	  // this can be tweaked, or even be made based on momentum or any other factor
	  var threshold = 0.8;
      var isCollapsingMenu = !(this).attr("data.collapsed");  
  	  // Note the below function call is a dummy function
      var delta = findDeltaOfTouchMovement( isCollapsingMenu );
      this.dataTravelArrive( delta > threshold );
 	}


### Reserved names

Reserved names cannot be used for state or level names.  
The following consitute reserved names:

root, transition, data, when, onlyif, exist, many, formation,
formationDisplayNone, sort, fargs, row, rows, filter, args, all

