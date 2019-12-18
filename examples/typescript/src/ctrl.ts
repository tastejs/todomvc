import { EVENT, KEY, STR, CONST } from './const'
import { Obj, getId } from './utl'
import { TodoList, Main, TodoItem, Footer } from './view'

export class App extends Obj {
    private main: Main;
    private list: TodoList;
    private footer: Footer;
    private items: Array<TodoItem>;

    constructor() {
        super();
        this.main = new Main(this);
        this.list = new TodoList(this);
        this.footer = new Footer(this);
        this.items = new Array<TodoItem>();

        this.on(this, document, EVENT.CONTENT_LOADED, this.load);
        this.on(this, window, EVENT.HASHCHANGE, this.render);
    }

    private indexOf(e: EventTarget | null): number {
        const id = getId(e);
        let res = -1;
        let i = this.items.length;
        while (id && i--) {
            if (this.items[i].id == id) {
                res = i;
                break;
            }
        }
        return res;
    }

    private getItem(e: EventTarget | HTMLElement | null): TodoItem | null {
        const index = this.indexOf(e);
        if (index > -1)
            return this.items[index];
        else
            return null;
    }

    private del(index: number) {
        this.items[index].element.remove();
        this.items.splice(index, 1);
    }

    private add(text: string, checked: boolean) {
        this.items.push(new TodoItem(this.list, text, checked));
    }

    private load() {
        const json = localStorage.getItem(CONST.STORAGEKEY);
        if (json) {
            const obj = JSON.parse(json);
            for (const p in obj) {
                if (obj.hasOwnProperty(p))
                    this.add(obj[p].name, obj[p].checked);
            }
        }
        this.render();
    }

    private save() {
        const obj: { [index: number]: { checked: boolean, name: string | null } } = {};
        for (const key in this.items) {
            const e = this.items[key];
            obj[key] = { checked: e.toggle.checked, name: e.label.textContent };
        }
        localStorage.setItem(CONST.STORAGEKEY, JSON.stringify(obj));
        this.render();
    }

    private render() {
        const allCount = this.items.length;
        let activeCount = 0;
        this.items.forEach(e => { if (!e.toggle.checked) activeCount++; });
        // list
        this.items.forEach(e => e.render());
        // main
        this.main.render(activeCount, allCount);
        // footer
        this.footer.render(activeCount, allCount);
    }

    addTodo(e: KeyboardEvent) {
        if (e.keyCode == KEY.ENTER) {
            let val = this.list.newTodo.value.trim();
            if (val) {
                this.add(val, false);
                this.list.newTodo.value = STR.EMPTY;
                this.save();
            }
        }
    }

    delTodo(e: Event) {
        const index = this.indexOf(e.target);
        if (index > -1) {
            this.del(index);
            this.save();
        }
    }

    focusoutTodo(e: Event) {
        const item = this.getItem(e.target);
        if (item) {
            item.update();
            this.save();
        }
    }

    toggleTodo() {
        this.save();
    }

    keydownTodo(e: KeyboardEvent) {
        const item = this.getItem(e.target);
        if (item) {
            if (e.keyCode == KEY.ENTER) {
                if (item.editor.value.trim())
                    item.update();
                else
                    this.delTodo(e);
                this.save();
            } else if (e.keyCode == KEY.ESC)
                item.cancel();
        }
    }

    editTodo(e: Event) {
        const item = this.getItem(e.target);
        if (item)
            item.edit();
    }

    clearCompleted() {
        let n = 0;
        const cnt = this.items.length;
        for (let i = 0; i < cnt; i++) {
            const e = this.items[n];
            (e.toggle.checked) ? this.del(n) : n++;
        }
        this.save();
    }

    toggleAll() {
        this.items.forEach(e => { e.toggle.checked = this.main.toggleAll.checked; });
        this.save();
    }
}

new App();
