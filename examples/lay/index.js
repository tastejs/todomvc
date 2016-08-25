LAY.run({
  data: {
    mobileResponsiveWidth: 550,
    sidebarResponsiveWidth: 900,
    offWhite: LAY.rgb(230, 230, 230),
    redTheme: LAY.hex(0xb83f45),
    grayRed: LAY.hex(0x787e7e)
  },
  props: {
    backgroundColor: LAY.color('whitesmoke'),
    textFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    textSmoothing: 'antialiased',
    textColor: LAY.hex(0x4d4d4d),
    textSize: 14,
    textWeight: '300',
    textLineHeight: 1.4,
    userSelect: 'none'
  },
  css:
    LAY.take("\
    input::-webkit-input-placeholder { #{placeholder} } \
    input::-moz-placeholder { #{placeholder} } \
    input::input-placeholder { #{placeholder} } \
    a.inline { \
      color:inherit; text-decoration:none;\
    } \
    a.inline:hover { \
      text-decoration:underline; \
    } \
    a.inline.learn { \
      color: #{redTheme}; \
    } \
    a.inline.learn:hover { \
      color: #{grayRed}; \
    }").format({
        placeholder:
          LAY.take("font-style:italic; font-weight:300; color:%s;").format(
            LAY.take("", "data.offWhite")
          ),
        redTheme: LAY.take("", "data.redTheme"),
        grayRed: LAY.take("", "data.grayRed")
      }
    ),
  when: {
    hashchange: function () {
      LAY.level('/App/Container/BottomControls/Categories/Category').data(
        'category', window.location.hash === '#/active' ?
        'active' : ( window.location.hash === '#/completed' ?
        'completed' : '' ));
    }
  },
  'App': {
    props: {
      width: LAY.take('/', 'data.mobileResponsiveWidth'),
      height: LAY.take('', '$naturalHeight').add(20),
      centerX: LAY.take('../Learn', 'width').half(),
    },
    states: {
      'nosidebar': {
        onlyif: LAY.take('/', 'width').lt(
          LAY.take('/', 'data.sidebarResponsiveWidth')),
        props: {
          centerX: 0
        }
      },
      'responsive': {
        onlyif: LAY.take('/', 'width').lt(
          LAY.take('/', 'data.mobileResponsiveWidth')),
        props: {
          width: LAY.take('/', 'width')
        }
      }
    },
    'Header': {
      props: {
        centerX: 0,
        text: 'todos',
        textSize: 100,
        textColor: LAY.rgba(175, 47, 47, 0.15),
        textRendering: 'optimizeLegibility',
        textWeight: '100'
      }
    },
    'Container': {
      props: {
        top: LAY.take('../Header', 'bottom'),
        width: LAY.take('../', 'width'),
        backgroundColor: LAY.color('white'),
        boxShadows: [
          { x: 0, y: 2, blur: 4, color: LAY.rgba(0, 0, 0, 0.2) },
          { x: 0, y: 25, blur: 50, color: LAY.rgba(0, 0, 0, 0.1) }
        ]
      },
      states: {
        'sheets-displayed': {
          onlyif: LAY.take('Sheets', 'display'),
          props: {
            height: LAY.take('', '$naturalHeight').subtract(
              LAY.take('Sheets', 'height'))
          }
        }
      },
      'TopControls': {
        props: {
          width: LAY.take('../', 'width'),
          boxShadows: [
            { inset:true, x:0, y:-2, blur:1, color: LAY.rgba(0, 0, 0, 0.03) }
          ]
        },
        'CompleteToggle': {
          data: {
            allCompleted: LAY.take('/App/Container/Todos/Todo',
              'rows').length().gt(0).and(
              LAY.take('/App/Container/Todos/Todo', 'rows').filterEq(
              'complete', false).length().eq(0))
          },
          props: {
            visible: LAY.take(
              '/App/Container/Todos/Todo', 'rows').length().gt(0),
            width: 40,
            height: 40,
            centerY: 0,
            cursor: 'default',
            text: '❯',
            textSize: 22,
            // Text line height should equal the
            // width (division for conversion to 'em')
            textLineHeight: LAY.take('', 'width').divide(
              LAY.take('', 'textSize')),
            textAlign: 'center',
            rotateZ: 90
          },
          states: {
            'incomplete': {
              onlyif: LAY.take('', 'data.allCompleted').not(),
              props: {
                textColor: LAY.take('/', 'data.offWhite')
              },
              when: {
                click: function() {
                  LAY.level('/App/Container/Todos/Todo').rowsUpdate(
                    'complete', true);
                }
              }
            },
            'completed': {
              onlyif: LAY.take('', 'data.allCompleted'),
              props: {
                textColor: LAY.rgb(115, 115, 155)
              },
              when: {
                click: function() {
                  LAY.level('/App/Container/Todos/Todo').rowsUpdate(
                    'complete', false);
                }
              }
            }
          }
        },
        'Input': {
          $type: 'input:line',
          props: {
            left: LAY.take('../CompleteToggle', 'right'),
            width: LAY.take('../', 'width').subtract(
              LAY.take('../CompleteToggle', 'height')),
            backgroundColor: LAY.rgba(0, 0, 0, 0.003),
            textSize: 24,
            textPadding: 16,
            textSmoothing: 'antialiased',
            textLineHeight: 1.4,
            inputPlaceholder: 'What needs to be done?',
            focus: true
          },
          when: {
            keypress: function(e) {
              if (e.keyCode === 13) { //enter
                var val = this.attr('$input').trim();
                if (val) {
                  this.changeNativeInput('');
                  LAY.level('/App/Container/Todos/Todo').rowAdd({
                    id: Date.now(),
                    title: val,
                    complete: false
                  });
                }
              }
            }
          }
        }
      },
      'Todos': {
        props: {
          display: LAY.take('Todo', 'rows').length().gt(0),
          width: LAY.take('../', 'width'),
          top: LAY.take('../TopControls', 'bottom'),
          borderTop: { style: 'solid', width: 1,
            color: LAY.take('/', 'data.offWhite') }
        },
        'Todo': {
          many: {
            data: {
              category: LAY.take(
                '/App/Container/BottomControls/Categories/Category',
                'data.category'),
              updateLocalStorage: LAY.take( function( rows ) {
                window.localStorage && window.JSON && localStorage.setItem(
                  'LAY-todos', JSON.stringify(rows));
              }).fn(LAY.take('', 'rows'))
            },
            rows: window.localStorage && window.JSON ?
              ( localStorage.getItem('LAY-todos') ?
              JSON.parse(localStorage.getItem('LAY-todos')) : [] ) : [],

            states: {
              'active': {
                onlyif: LAY.take('', 'data.category').eq('active'),
                filter: LAY.take('', 'rows').filterEq('complete', false)
              },
              'completed': {
                onlyif: LAY.take('', 'data.category').eq('completed'),
                filter: LAY.take('', 'rows').filterEq('complete', true)
              }
            }
          },
          data: {
            isEditing: false
          },
          props: {
            width: LAY.take('../', 'width'),
            borderBottom: { width: 1, style: 'solid',
              color: LAY.rgb(237, 237, 237) }
          },
          'Tick': {
            props: {
              visible: LAY.take('../', 'data.isEditing').not(),
              width: 40,
              height: 40,
              centerY: 0
            },
            states: {
              'complete': {
                onlyif: LAY.take('../', 'row.complete'),
                props: {
                  html: LAY.take('<svg xmlns="http://www.w3.org/2000/svg" ' +
                  'width="%d" height="%d" viewBox="-10 -18 100 135">' +
                  '<circle cx="50" cy="50" r="50" fill="none" ' +
                  'stroke="#bddad5" stroke-width="3"/><path fill="#5dc2af" ' +
                  'd="M72 25L42 71 27 56l-4 4 20 20 34-52z"/></svg>').format(
                    LAY.take('', 'width'), LAY.take('', 'height'))
                },
                when: {
                  click: function() {
                    this.level('~/').row('complete', false);
                  }
                }
              },
              'incomplete': {
                onlyif: LAY.take('~/', 'row.complete').not(),
                props: {
                  html: LAY.take('<svg xmlns="http://www.w3.org/2000/svg" ' +
                  'width="40" height="40" viewBox="-10 -18 100 135">' +
                  '<circle cx="50" cy="50" r="50" fill="none" ' +
                  'stroke="#ededed" stroke-width="3"/></svg>').format(
                    LAY.take('', 'width'), LAY.take('', 'height'))
                },
                when: {
                  click: function() {
                    this.level('~/').row('complete', true);
                  }
                }
              }
            }
          },
          'Title': {
            props: {
              display: LAY.take('~/', 'data.isEditing').not(),
              left: LAY.take('../Tick', 'right'),
              width: LAY.take('../', 'width').subtract(
                LAY.take('', 'left')),
              text: LAY.take('~/', 'row.title'),
              textPadding: 15,
              textSize: 24,
              textWordBreak: 'break-all',
              textWrap: 'pre-line',
              textLineHeight: 1.2,
              userSelect: 'text'
            },
            states: {
              'complete': {
                onlyif: LAY.take('~/', 'row.complete'),
                props: {
                  textDecoration: 'line-through',
                  textColor: LAY.color('gainsboro')
                }
              },
              'incomplete': {
                onlyif: LAY.take('~/', 'row.complete').not()
              }
            },
            transition: {
              textColor: {
                type: 'ease-out',
                duration: 400
              }
            },
            when: {
              dblclick: function() {
                this.level('~/').data('isEditing', true);
              }
            }
          },
          'Input': {
            $type: 'input:line',
            props: {
              display: false,
              width: LAY.take('../', 'width'),
              left: LAY.take('../Tick', 'right'),
              width: LAY.take('../', 'width').subtract(
                LAY.take('', 'left')),
              border: { style: 'solid', width: 1, color: LAY.hex(0x999999) },
              boxShadows: [
                { inset: true, x: 0, y: -1, blur: 5,
                  color: LAY.rgba(0, 0, 0, 0.2) }

              ],
              input: LAY.take('~/', 'row.title'),
              textPadding: 15,
              textSize: 24,
              textLineHeight: 1.2
            },
            states: {
              'shown': {
                onlyif: LAY.take('~/', 'data.isEditing'),
                props: {
                  display: true,
                  focus: true
                }
              }
            },
            when: {
              keyup: function(e) {
                if (e.keyCode === 13) { //enter
                  var val = this.attr('$input').trim();
                  if (val === '') { //delete item
                    this.level('~/').remove();
                  } else {
                    this.level('~/').row('title', val);
                    this.level('~/').data('isEditing', false);
                  }
                } else if (e.keyCode === 27) {
                  // reset the original value
                  this.changeNativeInput(this.level('~/').attr('row.title'));
                  this.level('~/').data('isEditing', false);
                }
              },
              blur: function() {
                var val = this.attr('$input').trim();
                if (val === '') { //delete item
                  this.level('~/').remove();
                } else {
                  this.level('~/').row('title', val);
                  this.level('~/').data('isEditing', false);
                }
              }
            }
          },
          'Cross': {
            props: {
              visible: LAY.take('../', '$hovering').and(
                LAY.take('~/', 'data.isEditing').not()),
              centerY: 0,
              right: 10,
              width: 40,
              height: 40,
              cursor: 'default',
              text: '×',
              textSize: 30,
              textLineHeight: 40 / 30,
              textAlign: 'center',
              textColor: LAY.hex(0xcc9a9a)
            },
            states: {
              'hovering': {
                onlyif: LAY.take('', '$hovering'),
                props: {
                  textColor: LAY.hex(0xaf5b5e)
                }
              }
            },
            transition: {
              textColor: {
                type: 'ease-out',
                duration: 200
              }
            },
            when: {
              click: function() {
                this.level('~/').remove();
              }
            }
          }
        }
      },
      'BottomControls': {
        props: {
          display: LAY.take('/App/Container/Todos/Todo','rows').length().gt(0),
          height: 42,
          width: LAY.take('../', 'width'),
          top: LAY.take('../Todos', 'bottom'),
          borderTop: { style: 'solid', width: 1, color: LAY.hex(0xe6e6e6) },
          textColor: LAY.rgb(119, 119, 119),
          textLineHeight: 1
        },
        'RemainingCount': {
          data: {
            remaining: LAY.take('/App/Container/Todos/Todo', 'rows').filterEq(
              'complete', false).length()
          },
          props: {
            centerY: 0,
            left: 15,
            text: LAY.take('%d items left').format(
              LAY.take('', 'data.remaining'))
          },
          states: {
            'single': {
              onlyif: LAY.take('', 'data.remaining').eq(1),
              props: {
                text: '1 item left'
              }
            }
          }
        },
        'Categories': {
          props: {
            centerX: 0,
            centerY: 0
          },
          'Category': {
            many: {
              data: {
                category: window.location.hash === '#/active' ?
                  'active' : ( window.location.hash === '#/completed' ?
                    'completed' : '' )
              },
              formation: 'horizontal',
              fargs: {
                horizontal: {
                  gap: 10
                }
              },
              rows: [
                { id: '', text: 'All' },
                { id: 'active', text: 'Active'},
                { id: 'completed', text: 'Completed'}
              ]
            },
            props: {
              border: { style: 'solid', width: 1, color: LAY.transparent() },
              cornerRadius: 3,
              text: LAY.take('', 'row.text'),
              textPadding: 6,
              link: LAY.take('#/%s').format(
                LAY.take('', 'row.id'))
            },
            states: {
              'selected': {
                onlyif: LAY.take('many', 'data.category').eq(
                  LAY.take('', 'row.id')),
                props: {
                  borderColor: LAY.rgba(175, 47, 47, 0.2)
                }
              },
              'hover': {
                onlyif: LAY.take('', '$hovering').and(
                  LAY.take('selected.onlyif').not()),
                props: {
                  borderColor: LAY.rgba(175, 47, 47, 0.1)
                }
              }
            }
          }
        },
        'ClearCompleted': {
          props: {
            visible: LAY.take('/App/Container/Todos/Todo', 'rows').filterEq(
              'complete', true).length().gt(0),
            cursor: 'pointer',
            centerY: 0,
            right: 15,
            text: 'Clear completed',
          },
          when: {
            click: function() {
              var many = LAY.level('/App/Container/Todos/Todo');
              many.rowsDelete(many.queryRows().filterEq('complete', true));
            }
          },
          states: {
            'hover': {
              onlyif: LAY.take('', '$hovering'),
              props: {
                textDecoration: 'underline'
              }
            }
          }
        }
      },
      'Sheets': {
        props: {
          display: LAY.take('/App/Container/Todos/Todo','rows').length().gt(0),
          height: 50,
          width: LAY.take('../', 'width'),
          shiftY: LAY.take('', 'height').negative(),
          backgroundColor: LAY.transparent(),
          top: LAY.take('../BottomControls', 'bottom'),
          zIndex: -1,
          boxShadows: [
            { x: 0, y: 1, blur: 1, color: LAY.rgba(0, 0, 0, 0.2) },
            { x: 0, y: 8, blur: 0, spread: -3, color: LAY.rgb(246, 246, 246) },
            { x: 0, y: 9, blur: 1, spread: -3, color: LAY.rgba(0, 0, 0, 0.2) },
            { x: 0, y: 16, blur: 0, spread: -6, color: LAY.rgb(246, 246, 246) },
            { x: 0, y: 17, blur: 2, spread: -6, color: LAY.rgba(0, 0, 0, 0.2) }
          ]
        }
      }
    },
    'Footer': {
      props: {
        centerX: 0,
        top: LAY.take('../Container', 'bottom').add(68),
        html: LAY.take('', 'row.content'),
        textShadows: [
          { x: 0, y: 1, blur: 1, color: LAY.rgba(255, 255, 255, 0.5) }
        ],
        textSize: 10,
        textColor: LAY.rgb(191, 191, 191),
        textLineHeight: 1
      },
      many: {
        fargs: {
          vertical: {
            gap: 10
          }
        },
        rows: [
          'Double-click to edit a todo',
          'Created by <a class="inline" ' +
            'href="https://github.com/relfor">Relfor</a>',
          'Part of <a class="inline" href="http://todomvc.com">TodoMVC</a>'
        ]
      }
    }
  },
  'Learn': {
    props: {
      width: 300,
      height: LAY.take('', '$naturalHeight').add(30),
      backgroundColor: LAY.rgba(255, 255, 255, 0.6),
      userSelect: 'auto'
    },
    states: {
      'hidden': {
        onlyif: LAY.take('/', 'width').lt(
          LAY.take('/', 'data.sidebarResponsiveWidth')),
        props: {
          left: LAY.take('', 'width').negative()
        }
      }
    },
    transition: {
      left: {
        type: 'ease',
        duration: 500
      }
    },
    '_Link': {
      props: {
        cursor: 'pointer',
        textColor: LAY.take("/", "data.redTheme"),
        textDecoration: 'none',
        textWeight: 'normal'
      },
      states: {
        'hovering': {
          onlyif: LAY.take('', '$hovering'),
          props: {
            textDecoration: 'underline',
            textColor: LAY.take("/", "data.grayRed")
          }
        }
      }
    },
    'Wrapper': {
      props: {
        width: LAY.take('../', 'width').minus(40),
        centerX: 0
      },
      'Name': {
        props: {
          top: 20,
          text: 'LayJS',
          textWeight: 'bold',
          textSize: 24
        }
      },
      'Example': {
        props: {
          top: LAY.take('../Name', 'bottom').add(8)
        },
        'Title': {
          props: {
            text: 'Example',
            textWeight: 'bold'
          }
        },
        'Link': {
          $inherit: '/Learn/_Link',
          props: {
            top: LAY.take('../Title', 'bottom'),
            text: 'Source',
            link:
              'https://github.com/tastejs/todomvc/tree/gh-pages/examples/lay'
          }
        }
      },
      'FirstLine': {
        props: {
          top: LAY.take('../Example', 'bottom').add(15),
          width: LAY.take('../', 'width'),
          height: 2,
          border: {
            top: {
              style: 'dashed',
              width: 1,
              color: LAY.hex(0xc5c5c5)
            },
            bottom: {
              style: 'dashed',
              width: 1,
              color: LAY.hex(0xf7f7f7)
            }
          }
        }
      },
      'SpeechBubble': {
        props: {
          width: LAY.take('../', 'width'),
          top: LAY.take('../FirstLine', 'bottom').add(30),
        },
        'OpenQuote': {
          props: {
            text: '“',
            textStyle: 'italic',
            textSize: 50,
            opacity: 0.15,
            left: 3,
            top: -20
          }
        },
        'Content': {
          props: {
            width: LAY.take('../', 'width'),
            cornerRadius: 5,
            textWrap: 'normal',
            textPadding: 10,
            textStyle: 'italic',
            backgroundColor: LAY.rgba(0, 0, 0, 0.04),
            text: "LayJS is a UI framework which uses (GPU accelerated) "+
              "CSS3 transforms to position elements on the page. " +
              "The central premise of which is to provide declaration of a " +
              "full application using a single object, done so by providing " +
              "the ability to create layout and data constraints across " +
              "the object."
          }
        },
        'CloseQuote': {
          $inherit: '../OpenQuote',
          props: {
            right: 3,
            top: LAY.take('../Content', 'bottom').minus(25),
            text: '”'
          }
        },
        'Pointer': {
          props: {
            top: LAY.take('../Content', 'bottom'),
            right: 35,
            width: 13,
            height: LAY.take("", "width"),
            border: { width: LAY.take("", "width"), style: 'solid',
              color: LAY.transparent() },
            borderTopColor: LAY.take('../Content', 'backgroundColor')
          }
        },
        'Sayer': {
          $inherit: '/Learn/_Link',
          props: {
            text: 'LayJS',
            right: 0,
            top: LAY.take('../Pointer', 'bottom'),
            link: 'https://github.com/LayJS/LayJS'
          }
        }
      },
      'SecondLine': {
        $inherit: '../FirstLine',
        props: {
          top: LAY.take('../SpeechBubble', 'bottom').add(10)
        }
      },
      'Resources': {
        props: {
          top: LAY.take('../SecondLine', 'bottom').add(15)
        },
        'Title': {
          props: {
            text: 'Official Resources',
            textSize: 18,
            textWeight: 'bold'
          }
        },
        'Resource': {
          many: {
            rows: [{
              text: 'Website',
              link: 'http://layjs.com'
            }, {
              text: 'API',
              link: 'http://layjs.com/api'
            }, {
              text: 'Github',
              link: 'https://github.com/LayJS/LayJS'
            }],
            fargs: {
              vertical: {
                gap: 3
              }
            }
          },
          props: {
            top: LAY.take('../Title', 'bottom').add(8)
          },
          'Bullet': {
            props: {
              left: 10,
              width: LAY.take('', '$naturalWidth'),
              text: '•'
            }
          },
          'Text': {
            $inherit: '/Learn/_Link',
            props: {
              left: LAY.take('../Bullet', 'right').add(10),
              text: LAY.take('../', 'row.text'),
              link: LAY.take('../', 'row.link')
            }
          }
        }
      },
      'ThirdLine': {
        $inherit: '../FirstLine',
        props: {
          top: LAY.take('../Resources', 'bottom').add(15)
        }
      },
      'Issues': {
        props: {
          top: LAY.take('../ThirdLine', 'bottom').add(15),
          width: LAY.take('../', 'width'),
          html: 'If you have other helpful links to share, or find any of ' +
            'the links above no longer work, please <a class="inline learn" ' +
            'href="https://github.com/tastejs/todomvc/issues">let us know</a>.',
          textWrap: 'normal',
          textStyle: 'italic'
        }
      }
    }
  }
});
