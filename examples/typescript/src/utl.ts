import { TAG, ATTR, STR } from './const'

export function $(selector: Element | string, scope: Element | null = null) {
    let elements;
    (typeof selector == 'string') ? elements = (scope || document).querySelectorAll(selector) : elements = selector;
    return new Utl(elements);
}

class Utl {
    constructor(public element: Element | NodeListOf<Element> | null) { }

    get(): Element | null {
        if (!this.element)
            return null;
        if (this.element instanceof Element)
            return this.element;
        if (this.element.length == 0)
            return null;
        return this.element[0];
    }

    getAll(index?: number): Element | null {
        if (!this.element)
            return null;
        if (this.element instanceof Element)
            return this.element;
        if (this.element.length == 0)
            return null;
        if (index)
            return this.element[index];
        else
            return null;
    }

    hasClass(cls: string): boolean {
        if (!this.element)
            return false;
        if (this.element instanceof Element)
            return hasClass(this.element, cls);
        if (this.element.length == 0)
            return false;
        let res = true;
        this.element.forEach(e => { res = hasClass(e, cls) && res; });
        return res;
    }

    removeClass(cls: string) {
        if (!this.element)
            return this;
        if (this.element instanceof Element) {
            removeClass(this.element, cls);
            return this;
        }
        if (this.element.length == 0)
            return this;
        this.element.forEach(e => { removeClass(e, cls); });
        return this;
    }

    addClass(cls: string) {
        if (!this.element)
            return this;
        if (this.element instanceof Element) {
            addClass(this.element, cls);
            return this;
        }
        if (this.element.length == 0)
            return this;
        this.element.forEach(e => { addClass(e, cls); });
        return this;
    }

    toggleClass(cls: string) {
        if (!this.element)
            return this;
        if (this.element instanceof Element) {
            toggleClass(this.element, cls);
            return this;
        }
        if (this.element.length == 0)
            return this;
        this.element.forEach(e => { toggleClass(e, cls); });
        return this;
    }

    on(event: string, handler: EventListener) {
        if (!this.element)
            return this;
        if (this.element instanceof Element) {
            on(this.element, event, handler);
            return this;
        }
        if (this.element.length == 0)
            return this;
        this.element.forEach(e => { on(e, event, handler); });
        return this;
    }
}

function on(elem: Element | null, event: string, handler: EventListener) {
    if (!elem)
        return;
    elem.addEventListener(event, handler);
}

function hasClass(elem: Element | null, cls: string): boolean {
    if (!elem)
        return false;
    let res = false;
    const arr = cls.split(STR.SPACE);
    for (let i = 0; i < arr.length; i++) {
        res = elem.classList ? elem.classList.contains(arr[i]) : new RegExp('\\b' + arr[i] + '\\b').test(elem.className);
        if (!res) break;
    }
    return res;
}

function removeClass(elem: Element, cls: string) {
    if (!elem)
        return;
    if (elem.classList) {
        const arr = cls.split(STR.SPACE);
        arr.forEach((item) => elem.classList.remove(item));
    }
    else
        elem.className = elem.className.replace(new RegExp('\\b' + cls + '\\b', 'g'), STR.EMPTY);
}

function addClass(elem: Element, cls: string) {
    if (!elem)
        return;
    if (elem.classList) {
        const arr = cls.split(STR.SPACE);
        arr.forEach((item) => elem.classList.add(item));
    }
    else if (!$(elem).hasClass(cls))
        elem.className += ' ' + cls;
}

function toggleClass(elem: Element, cls: string) {
    const e = $(elem).getAll();
    if (e)
        $(e).hasClass(cls) ? $(e).removeClass(cls) : $(e).addClass(cls);
}

export class Fabric {
    static createElement(tag: TAG, parent: HTMLElement, cls: string = STR.EMPTY): HTMLElement {
        const r = document.createElement(tag);
        if (cls)
            r.className = cls;
        if (parent)
            parent.appendChild(r);
        return r;
    }

    static div(parent: HTMLElement, cls: string) {
        return Fabric.createElement(TAG.DIV, parent, cls);
    }

    static button(parent: HTMLElement, cls: string) {
        return Fabric.createElement(TAG.BUTTON, parent, cls);
    }

    static editor(parent: HTMLElement, cls: string) {
        return Fabric.createElement(TAG.INPUT, parent, cls) as HTMLInputElement;
    }

    static li(parent: HTMLElement, id: string) {
        const r = Fabric.createElement(TAG.LI, parent);
        r.dataset.id = id;
        return r;
    }

    static check(parent: HTMLElement, cls: string, checked: boolean = false) {
        const r = Fabric.createElement(TAG.INPUT, parent, cls) as HTMLInputElement;
        r.setAttribute(ATTR.TYPE, ATTR.CHECKBOX);
        r.checked = checked;
        return r as HTMLInputElement;
    }

    static label(parent: HTMLElement, cls: string, text: string = STR.EMPTY) {
        const r = Fabric.createElement(TAG.LABEL, parent, cls);
        if (text) r.textContent = text;
        return r;
    }
}

export class Handler {
    public callback: EventListener;

    constructor(
        public target: Element | Window | Document | null,
        public eventType: string,
        public func: Function,
        public capture: boolean,
        public passive: boolean,
        public context: Obj | null) {
        this.callback = func.bind(this.context);
    }
}

export class Obj {
    on(bind: Obj, target: Element | Window | Document, event: string, func: Function, capture: boolean = false, passive: boolean = true): Handler {
        const handler = new Handler(target, event, func, capture, passive, bind);
        const opt: AddEventListenerOptions = { capture: capture, passive: passive };
        if (handler.callback)
            target.addEventListener(event, handler.callback, opt);
        return handler;
    }

    off(handler: Handler | null) {
        if (handler && handler.callback && handler.target) {
            const opt: AddEventListenerOptions = { capture: handler.capture, passive: handler.passive };
            handler.target.removeEventListener(handler.eventType, handler.callback, opt);
        }
    }

    delegate(bind: Obj, target: Element | Document, selector: string, event: string, func: Function, capture: boolean = false, passive: boolean = true) {
        const handler = new Handler(target, event, func, capture, passive, bind);
        const dispatchEvent = (e: Event): void => {
            const potentialElements = target.querySelectorAll(selector);
            for (let i = 0; i < potentialElements.length; i++) {
                if (potentialElements[i] === e.target) {
                    handler.callback.call(e.target, e);
                    break;
                }
            }
        }
        const opt: AddEventListenerOptions = { capture: capture, passive: passive };
        target.addEventListener(event, dispatchEvent, opt);
        return handler;
    }
}

export function dot(cls: string): string {
    return STR.DOT + cls;
}

// https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
let lut = new Array<string>();
for (var i = 0; i < 256; i++) { lut[i] = (i < 16 ? '0' : '') + (i).toString(16); }
export function uuid() {
    var d0 = Math.random() * 0xffffffff | 0;
    var d1 = Math.random() * 0xffffffff | 0;
    var d2 = Math.random() * 0xffffffff | 0;
    var d3 = Math.random() * 0xffffffff | 0;
    return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
        lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
        lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
        lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
}

export function getId(e: EventTarget | HTMLElement | null): string | undefined {
    let res: string | undefined;
    if (e instanceof HTMLElement && e.parentNode) {
        res = (e.parentNode as HTMLElement).dataset.id;
        if (!res && e.parentNode.parentNode)
            res = (e.parentNode.parentNode as HTMLElement).dataset.id;
    }
    return res;
}
