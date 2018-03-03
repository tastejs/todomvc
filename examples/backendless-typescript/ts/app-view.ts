/// <reference path="./helpers.ts" />
/// <reference path="./todos-list.ts" />

declare var Router:any;

class AppView {
    mainEl:HTMLElement;
    footerEl:HTMLElement;
    inputEl:HTMLInputElement;
    todoCountEl:HTMLElement;
    clearCompletedEl:HTMLElement;
    toggleAllBtn:HTMLInputElement;
    routerButtons:NodeList;

    filter:string;
    todoList:TodosList;

    constructor() {
        var self:AppView = this;
        var todoAppEl:HTMLElement =  <HTMLElement>document.querySelector('.todoapp');
        var appTemplate:HTMLElement =  <HTMLElement>document.querySelector('#main-app');

        todoAppEl.innerHTML = appTemplate.innerHTML;

        this.mainEl = <HTMLElement>document.querySelector('.main');
        this.footerEl = <HTMLElement>document.querySelector('.footer');
        this.inputEl = <HTMLInputElement>document.querySelector('.new-todo');
        this.todoCountEl = <HTMLElement>document.querySelector('.todo-count');
        this.clearCompletedEl = <HTMLElement>document.querySelector('.clear-completed');
        this.toggleAllBtn = <HTMLInputElement>document.querySelector('.toggle-all');
        this.routerButtons = document.querySelectorAll('.filters a');

        this.filter = null;
        this.todoList = new TodosList(this);

        this.updateState();

        new Router({
            '/:filter': function (filter:string):void {
                self.onRouterChange(filter);
            }
        }).init('/all');

        this.inputEl.addEventListener('keypress', function (e:KeyboardEvent):void {
            self.onInputKeyPress(e);
        });
        this.toggleAllBtn.addEventListener('click', function (e:MouseEvent):void {
            self.onTogglerAllBtnClick(e)
        });
        this.clearCompletedEl.addEventListener('click', function (e:MouseEvent):void {
            self.onClearCompletedClick()
        });
    }

    updateState():void {
        var todosCounts:{total:number; remains:number;} = this.todoList.getCounts();
        var totalItems:number = todosCounts.total;
        var remainsItems:number = todosCounts.remains;
        var remainsItemsLabel:string = '<strong> ' + remainsItems + ' </strong>';

        this.mainEl.style.display = totalItems ? '' : 'none';
        this.footerEl.style.display = totalItems ? '' : 'none';
        this.clearCompletedEl.style.display = (totalItems - remainsItems) ? '' : 'none';

        this.toggleAllBtn.checked = !!totalItems && !remainsItems;

        this.todoCountEl.innerHTML = remainsItemsLabel + (remainsItems === 1 ? ' item' : ' items') + ' left';
    }

    onRouterChange(filter:string):void {
        for (var i:number = 0; i < this.routerButtons.length; i++) {
            var anchor:HTMLAnchorElement = <HTMLAnchorElement>this.routerButtons[i];

            toggleClass(anchor, 'selected', (anchor.hash === '#/' + filter));
        }

        this.todoList.setFilter(filter);
    }

    onInputKeyPress(e:KeyboardEvent):void {
        var title:string = this.inputEl.value.trim();

        if (e.which === ENTER_KEY && title) {
            this.todoList.createItem({title: title});

            this.updateState();
            this.inputEl.value = '';
        }
    }

    onTogglerAllBtnClick(e:MouseEvent):void {
        this.todoList.toggleAll((<HTMLInputElement>e.currentTarget).checked);
    }

    onClearCompletedClick():void {
        this.todoList.removeCompleted();
    }
}
