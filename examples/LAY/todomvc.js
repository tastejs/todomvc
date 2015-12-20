
LAY.run({
  data: {
    mobileResponsiveWidth: 550,
    sidebarResponsiveWidth: 900,
    gray230: LAY.rgb(230, 230, 230)
  },
  props: {
    backgroundColor: LAY.color('whitesmoke'),
    overflowY: 'auto',
    textFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    textSmoothing: 'antialiased',
    textColor: LAY.hex(0x4d4d4d),
    textSize: 14,
    textWeight: '300',
    textLineHeight: 1.4,
    userSelect: 'none'
  },
  'App': {
    props: {
      width: LAY.take('/', 'data.mobileResponsiveWidth'),
      height: LAY.take('', '$naturalHeight').add(20),
      centerX: LAY.take('../Learn', 'width').divide(2),
      overflow: 'visible'
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
      },
    },
    'Header': {
      props: {
        width: LAY.take('../', 'width'),
        text: 'todos',
        textSize: 100,
        textColor: LAY.rgba(175, 47, 47, 0.15),
        textAlign: 'center',
        textRendering: 'optimizeLegibility',
        textWeight: '100'
      }
    },
    'Container': {
      props: {
        top: LAY.take('../Header', 'bottom'),
        centerX: 0,
        width: LAY.take('../', 'width'),
        backgroundColor: LAY.color('white'),
        overflow: 'visible',
        boxShadows: [
          { x: 0, y: 2, blur: 4, color: LAY.rgba(0, 0, 0, 0.2) },
          { x: 0, y: 25, blur: 50, color: LAY.rgba(0, 0, 0, 0.1) }
        ]
      },
      states: {
        'sheets-displayed': {
          onlyif: LAY.take('Sheets', 'hidden.onlyif').not(),
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
            { inset: true, x: 0, y: -2, blur: 1, color: LAY.rgba(0, 0, 0, 0.03) }
          ]
        },
        'CompleteToggle': {
          data: {
            allCompleted: LAY.take('/App/Container/Todos/Todo', 'rows').length().gt(0).and(
              LAY.take('/App/Container/Todos/Todo', 'rows').filterEq(
                'complete', false).length().eq(0))
          },
          props: {
            width: 40,
            height: 40,
            centerY: 0,
            cursor: 'default',
            text: '❯',
            textSize: 22,
            // Text line height should equal
            // the width (division for conversion
            // to 'em')
            textLineHeight: LAY.take('', 'width').divide(
              LAY.take('', 'textSize')),
            textAlign: 'center',
            rotateZ: 90
          },
          states: {
            'hidden': {
              onlyif: LAY.take('/App/Container/Todos/Todo', 'rows').length().eq(0),
              props: {
                visible: false
              }
            },
            'incomplete': {
              onlyif: LAY.take('', 'data.allCompleted').not(),
              props: {
                textColor: LAY.take('/', 'data.gray230')
              },
              when: {
                click: function() {
                  LAY.level('/App/Container/Todos/Todo').rowsUpdate(
                    'complete', true);
                  updateLocalStorage();
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
                  updateLocalStorage();
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
                  updateLocalStorage();
                }
              }
            }
          }
        }
      },
      'Todos': {
        props: {
          top: LAY.take('../TopControls', 'bottom'),
          width: LAY.take('../', 'width'),
          borderTop: { style: 'solid', width: 1, color: LAY.take('/', 'data.gray230') }
        },
        states: {
          'hidden': {
            onlyif: LAY.take('Todo', 'rows').length().eq(0),
            props: {
              display: false
            }
          }
        },
        'Todo': {
          many: {
            formation: 'onebelow',
            $load: function() {
              if (window.localStorage && window.JSON) {
                var todos = localStorage.getItem('todos');
                if (todos) {
                  this.rowsCommit(JSON.parse(todos));
                }
              }
            },
            data: {
              category: LAY.take('/App/Container/BottomControls/Strip/Categories/Category', 'data.category')
            },
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
            borderBottom: { width: 1, style: 'solid', color: LAY.rgb(237, 237, 237) },
            overflow: 'visible' //border overflow of input
          },
          'Tick': {
            props: {
              width: 40,
              height: 40,
              centerY: 0
            },
            states: {
              'hidden': {
                onlyif: LAY.take('../', 'data.isEditing'),
                props: {
                  visible: false
                }
              },
              'complete': {
                onlyif: LAY.take('../', 'row.complete'),
                props: {
                  text: LAY.take('<svg xmlns="http://www.w3.org/2000/svg" width="%d" height="%d" viewBox="-10 -18 100 135"><circle cx="50" cy="50" r="50" fill="none" stroke="#bddad5" stroke-width="3"/><path fill="#5dc2af" d="M72 25L42 71 27 56l-4 4 20 20 34-52z"/></svg>').format(
                    LAY.take('', 'width'), LAY.take('', 'height'))
                },
                when: {
                  click: function() {
                    this.level('../').row('complete', false);
                    updateLocalStorage();
                  }
                }
              },
              'incomplete': {
                onlyif: LAY.take('../', 'row.complete').not(),
                props: {
                  text: LAY.take('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-10 -18 100 135"><circle cx="50" cy="50" r="50" fill="none" stroke="#ededed" stroke-width="3"/></svg>').format(
                    LAY.take('', 'width'), LAY.take('', 'height'))
                },
                when: {
                  click: function() {
                    this.level('../').row('complete', true);
                    updateLocalStorage();
                  }
                }
              }
            }
          },
          'Title': {
            props: {
              left: LAY.take('../Tick', 'right'),
              width: LAY.take('../', 'width').subtract(
                LAY.take('', 'left')),
              text: LAY.take('../', 'row.title'),
              textPadding: 15,
              textSize: 24,
              textWordWrap: 'break-word',
              textWrap: 'pre',
              textLineHeight: 1.2,
              userSelect: 'text'
            },
            states: {
              'hidden': {
                onlyif: LAY.take('../', 'data.isEditing'),
                props: {
                  display: false
                }
              },
              'complete': {
                onlyif: LAY.take('../', 'row.complete'),
                props: {
                  textDecoration: 'line-through',
                  textColor: LAY.color('gainsboro')
                }
              },
              'incomplete': {
                onlyif: LAY.take('../', 'row.complete').not()
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
                this.level('../').data('isEditing', true);
              }
            }
          },
          'Input': {
            $type: 'input:line',
            props: {
              display: false,
              left: LAY.take('../Tick', 'right'),
              width: LAY.take('../', 'width').subtract(
                LAY.take('', 'left')),
              border: { style: 'solid', width: 1, color: LAY.hex(0x999999) },
              boxShadows: [
                { inset: true, x: 0, y: -1, blur: 5, color: LAY.rgba(0, 0, 0, 0.2) }
              ],
              input: LAY.take('../', 'row.title'),
              textPadding: 15,
              textSize: 24,
              textLineHeight: 1.2
            },
            states: {
              'shown': {
                onlyif: LAY.take('../', 'data.isEditing'),
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
                    this.level('../').remove();
                  } else {
                    this.level('../').row('title', val);
                    this.level('../').data('isEditing', false);
                  }
                  updateLocalStorage();
                } else if (e.keyCode === 27) {
                  // reset the original value
                  this.changeNativeInput(
                    this.level('../').attr('row.title'));
                  this.level('../').data('isEditing', false);
                }
              },
              blur: function() {
                var val = this.attr('$input').trim();
                if (val === '') { //delete item
                  this.level('../').remove();
                } else {
                  this.level('../').row('title', val);
                  this.level('../').data('isEditing', false);
                }
                updateLocalStorage();
              }
            }
          },
          'Cross': {
            props: {
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
              'hidden': {
                onlyif: LAY.take('../', '$hovering').not().or(
                  LAY.take('../', 'data.isEditing')),
                props: {
                  visible: false
                }
              },
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
                LAY.level('/App/Container/Todos/Todo').rowDeleteByID(
                  this.level('../').attr('row.id'));
                updateLocalStorage();
              }
            }
          }
        }
      },
      'BottomControls': {
        props: {
          height: 42,
          width: LAY.take('../', "width"),
          top: LAY.take('../Todos', 'bottom'),
          borderTop: { style: 'solid', width: 1, color: LAY.hex(0xe6e6e6) },
          textColor: LAY.rgb(119, 119, 119),
          textLineHeight: 1
        },
        states: {
          'hidden': {
            onlyif: LAY.take('../Sheets', 'hidden.onlyif'),
            props: {
              display: false
            }
          }
        },
        'Strip': {
          props: {
            width: LAY.take('../', 'width').subtract(30),
            centerX: 0,
            centerY: 0
          },
          'RemainingCount': {
            data: {
              remaining: LAY.take('/App/Container/Todos/Todo', 'rows').filterEq('complete', false).length()
            },
            props: {
              centerY: 0,
              text: LAY.take('%d items left').format(LAY.take('', 'data.remaining'))
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
              centerX: 0
            },
            'Category': {
              many: {
                $load: function() {
                  var hash = window.location.hash || '#/';
                  var hashVal = hash.slice(2);
                  if (['', 'active', 'completed'].indexOf(hashVal) !== -1) {
                    this.data('category', hashVal);
                  }
                },
                data: {
                  category: ''
                },
                formation: 'totheright',
                fargs: {
                  totheright: {
                    gap: 10
                  }
                },
                $id: 'id',
                rows: [{
                  id: '',
                  text: 'All'
                }, {
                  id: 'active',
                  text: 'Active'
                }, {
                  id: 'completed',
                  text: 'Completed'
                }]
              },
              $type: 'link',
              props: {
                cursor: 'pointer',
                border: { style: 'solid', width: 1, color: LAY.transparent() },
                cornerRadius: 3,
                text: LAY.take('', 'row.text'),
                textPadding: 6,
                linkHref: LAY.take('#/%s').format(
                  LAY.take('', 'row.id'))
              },
              states: {
                'selected': {
                  onlyif: LAY.take('*', 'data.category').eq(
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
              },
              when: {
                click: function() {
                  this.many().data('category', this.attr('row.id'));
                }
              }
            }
          },
          'ClearCompleted': {
            props: {
              cursor: 'pointer',
              right: 0,
              centerY: 0,
              text: 'Clear completed'
            },
            when: {
              click: function() {
                var many = LAY.level('/App/Container/Todos/Todo');
                many.rowsDelete(
                  many.queryRows().filterEq('complete', true));
                updateLocalStorage();
              }
            },
            states: {
              'hidden': {
                onlyif: LAY.take('/App/Container/Todos/Todo', 'rows').filterEq('complete', true).length().eq(0),
                props: {
                  visible: false
                }
              },
              'hover': {
                onlyif: LAY.take('', '$hovering'),
                props: {
                  textDecoration: 'underline'
                }
              }
            }
          }
        }
      },
      'Sheets': {
        props: {
          width: LAY.take('../', 'width'),
          height: 50,
          shiftY: LAY.take('', 'height').negative(),
          backgroundColor: LAY.transparent(),
          top: LAY.take('../BottomControls', 'bottom'),
          zIndex: '-1',
          boxShadows: [
            { x: 0, y: 1, blur: 1, color: LAY.rgba(0, 0, 0, 0.2) },
            { x: 0, y: 8, blur: 0, spread: -3, color: LAY.rgb(246, 246, 246) },
            { x: 0, y: 9, blur: 1, spread: -3, color: LAY.rgba(0, 0, 0, 0.2) },
            { x: 0, y: 16, blur: 0, spread: -6, color: LAY.rgb(246, 246, 246) },
            { x: 0, y: 17, blur: 2, spread: -6, color: LAY.rgba(0, 0, 0, 0.2) }
          ]
        },
        states: {
          'hidden': {
            onlyif: LAY.take('/App/Container/Todos/Todo', 'rows').length().eq(0),
            props: {
              display: false
            }
          }
        }
      }
    },
    'Footer': {
      props: {
        top: LAY.take('../Container', 'bottom').add(40),
        width: LAY.take('../', 'width'),
        textAlign: 'center',
        textShadows: [
          { x: 0, y: 1, blur: 1, color: LAY.rgba(255, 255, 255, 0.5) }
        ],
        textSize: 10,
        textColor: LAY.rgb(191, 191, 191),
        text: LAY.take('', 'row.content'),
        textLineHeight: 1
      },
      many: {
        formation: 'onebelow',
        fargs: {
          onebelow: {
            gap: 10
          }
        },
        rows: [
          'Double-click to edit a todo',
          'Created by <a href="https://github.com/relfor">Relfor</a>',
          'Part of <a href="http://todomvc.com">TodoMVC</a>'
        ]
      }
    }
  },
  'Learn': {
    '_Link': {
      $type: 'link',
      props: {
        cursor: 'pointer',
        textColor: LAY.hex(0xb83f45),
        textDecoration: 'none',
        textWeight: 'normal'
      },
      states: {
        'hovering': {
          onlyif: LAY.take('', '$hovering'),
          props: {
            textDecoration: 'underline',
            textColor: LAY.hex(0x787e7e)
          }
        }
      }
    },
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
    'Wrapper': {
      props: {
        width: LAY.take('../', 'width').minus(40),
        centerX: 0
      },
      'Name': {
        props: {
          top: 20,
          text: 'LAY.JS',
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
            linkHref: 'https://github.com/tastejs/todomvc/tree/gh-pages/examples/LAY'
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
          top: LAY.take('../FirstLine', 'bottom').add(30),
          width: LAY.take('../', 'width'),
          overflow: 'visible'
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
            backgroundColor: LAY.rgba(0, 0, 0, .04),
            text: 'LAY.js is a constraint-based page layout engine written ' +
              'in Javascript, as a substitute to CSS positioning, ' +
              'and HTML markup. The central premise of which is to provide ' +
              'a system to declare an entire application using a single object.'
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
            height: 13,
            border: { width: 13, style: 'solid', color: LAY.transparent() },
            borderTopColor: LAY.take('../Content', 'backgroundColor')
          }
        },
        'Sayer': {
          $inherit: '/Learn/_Link',
          props: {
            text: 'LAY.js',
            top: LAY.take('../Pointer', 'bottom'),
            right: 0,
            linkHref: 'https://github.com/TheRelforFoundation/LAY.js'
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
              text: 'Specification',
              link: 'https://github.com/TheRelforFoundation/LAY.js/blob/master/specification.markdown'
            }, {
              text: 'Codepen',
              link: 'http://codepen.io/collection/AEPxGb/'
            }, {
              text: 'Github',
              link: 'https://github.com/TheRelforFoundation/LAY.js'
            }],
            fargs: {
              onebelow: {
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
              text: '&#8226;'
            }
          },
          'Text': {
            $inherit: '/Learn/_Link',
            props: {
              left: LAY.take('../Bullet', 'right').add(10),
              text: LAY.take('../', 'row.text'),
              linkHref: LAY.take('../', 'row.link')
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
          text: 'If you have other helpful links to share, or find any of the links above no longer work, ' +
            'please <a class="learn" href="https://github.com/tastejs/todomvc/issues">let us know</a>.',
          textWrap: 'normal',
          textStyle: 'italic'
        }
      }
    }
  }
});


if (!String.prototype.trim) {
  String.prototype.trim = function() {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}

function updateLocalStorage() {
  var rows = LAY.level('/App/Container/Todos/Todo').attr('rows');
  if (window.localStorage && window.JSON) {
    window.localStorage.setItem('todos', JSON.stringify(rows));
  }
}