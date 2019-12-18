export const enum CLASS {
    COMPLETED = 'completed',
    EDITING = 'editing',
    VIEW = 'view',
    TOGGLE = 'toggle',
    DESTROY = 'destroy',
    EDIT = 'edit',
    TODOLIST = 'todo-list',
    MAIN = 'main',
    NEWTODO = 'new-todo',
    TODOCOUNT = 'todo-count',
    CLEARCOMPLETED = 'clear-completed',
    SELECTED = 'selected',
    HIDDEN = 'hidden',
    TOGGLEALL = 'toggle-all',
    FOOTER = 'footer',
    EMPTY = '',
}

export const enum CONST{
    STORAGEKEY = 'todos_typescript',
}

export const enum KEY{
    TAB = 9,
    ENTER = 13,
    ESC = 27,
}

export const enum STR {
    SPACE = ' ',
    EMPTY = '',
    DOT = '.',
}

export const enum EVENT {
    CHANGE = 'change',
    INPUT = 'input',
    FOCUS = 'focus',
    BLUR = 'blur',
    SELECT = 'select',
    MOUSE_MOVE = 'mousemove',
    MOUSE_DOWN = 'mousedown',
    MOUSE_UP = 'mouseup',
    MOUSE_OVER = 'mouseover',
    MOUSE_ENTER = 'mouseenter',
    MOUSE_OUT = 'mouseout',
    MOUSE_LEAVE = 'mouseleave',
    CLICK = 'click',
    DBL_CLICK = 'dblclick',
    DRAG_START = 'dragstart',
    DRAG_END = 'dragend',
    DRAG_OVER = 'dragover',
    DRAG = 'drag',
    DRAG_ENTER = 'dragenter',
    DRAG_LEAVE = 'dragleave',
    DRAG_EXIT = 'dragexit',
    DROP = 'drop',
    WHEEL = 'wheel',
    BTN_DOWN = 'btndown',
    CHANGE_VALUE = 'changevalue',
    CONTENT_LOADED = 'DOMContentLoaded',
    KEY_DOWN = 'keydown',
    CONTEXT_MENU = 'contextmenu',
    RESIZE = 'resize',
    POPSTATE = 'popstate',
    HASHCHANGE = 'hashchange',
    FOCUSOUT = 'focusout',
}

export const enum TAG {
    DOCUMENT = 'document',
    BODY = 'body',
    DIV = 'div',
    SPAN = 'span',
    CANVAS = 'canvas',
    IMG = 'img',
    SVG = 'svg',
    INPUT = 'input',
    SELECT = 'select',
    FORM = 'form',
    TABLE = 'table',
    TBODY = 'tbody',
    TR = 'tr',
    TD = 'td',
    UL = 'ul',
    LI = 'li',
    OPTION = 'option',
    LABEL = 'label',
    BUTTON = 'button',
    A = 'a',
}

export const enum ATTR {
    EMPTY = '',
    TYPE = 'type',
    NAME = 'name',
    CHECKBOX = 'checkbox',
    CHECKED = 'checked',
    RADIO = 'radio',
    NUM = 'num',
    MAXLENGTH = 'maxlength',
    BUTTON = 'button',
    SUBMIT = 'submit',
    CANCEL = 'cancel',
    VALUE = 'value',
    MULTIPLE = 'multiple',
    SIZE = 'size',
    HREF = 'href',
}

export const enum HASH {
    ALL = '#/',
    ACTIVE = '#/active',
    COMPLETED = '#/completed',
}

export const enum TPL{
    S1 = '<strong>',
    S2 = '</strong> item left',
    S3 = '</strong> items left',
    P1 = 'a[href="',
    P2 = '"]',
}

export class SELECTOR{
    static HREF_ALL = `${TPL.P1}${HASH.ALL}${TPL.P2}`;
    static HREF_ACTIVE = `${TPL.P1}${HASH.ACTIVE}${TPL.P2}`;
    static HREF_COMPLETED = `${TPL.P1}${HASH.COMPLETED}${TPL.P2}`;
}
