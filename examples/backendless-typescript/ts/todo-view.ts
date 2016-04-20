/// <reference path="../node_modules/backendless/libs/backendless.d.ts" />
/// <reference path="./helpers.ts" />
/// <reference path="./app.ts" />
/// <reference path="./todo-model.ts" />
/// <reference path="./todos-list.ts" />

var todoItemTemplate:string = (<HTMLElement>document.querySelector('#todo-item')).innerHTML;

class TodoView {
    el:HTMLLIElement;
    toggler:HTMLInputElement;
    destroyBtn:HTMLButtonElement;
    label:HTMLLabelElement;
    editInput:HTMLInputElement;

    template:string = todoItemTemplate;

    constructor(public data:Todo, public todosList:TodosList) {
        var self:TodoView = this;

        this.el = <HTMLLIElement>document.createElement('LI');
        this.el.innerHTML = this.template;

        this.toggler = <HTMLInputElement>this.el.querySelector('.toggle');
        this.destroyBtn = <HTMLButtonElement>this.el.querySelector('.destroy');
        this.label = <HTMLLabelElement>this.el.querySelector('label');
        this.editInput = <HTMLInputElement>this.el.querySelector('.edit');

        this.destroyBtn.addEventListener('click', function ():void {
            self.destroy();
        });

        this.toggler.addEventListener('change', function (e):void {
            self.updateCompleted((<HTMLInputElement>e.currentTarget).checked);
        });

        this.label.addEventListener('dblclick', function ():void {
            self.enableEdit();
        });

        this.updateTitle(this.data.title);
        this.updateCompleted(this.data.completed);
    }


    enableEdit() {
        var self = this;

        addClass(self.el, 'editing');

        this.editInput.focus();
        this.editInput.addEventListener('blur', finishEditing);
        this.editInput.addEventListener('keypress', onEditInputKeyPress);
        this.editInput.addEventListener('keydown', onEditInputKeyDown);

        function finishEditing():void {
            var title:string = self.editInput.value.trim();

            if (title) {
                self.updateTitle(title);
                self.save();

                disableEdit();

            } else {
                self.destroy();
            }
        }

        function onEditInputKeyPress(e:KeyboardEvent):void {
            if (e.which === ENTER_KEY) {
                self.editInput.blur();
            }
        }

        function onEditInputKeyDown(e:KeyboardEvent):void {
            if (e.which === ESC_KEY) {
                disableEdit();
            }
        }

        function disableEdit():void {
            removeClass(self.el, 'editing');

            self.editInput.value = self.data.title;
            self.editInput.removeEventListener('blur', finishEditing);
            self.editInput.removeEventListener('keypress', onEditInputKeyPress);
            self.editInput.removeEventListener('keydown', onEditInputKeyDown);
        }
    }

    updateCompleted(completed:boolean):void {
        if (this.data.completed !== completed) {
            this.data.completed = completed;
            this.save();
        }

        this.toggler.checked = this.data.completed;

        toggleClass(this.el, 'completed', this.data.completed);

        this.toggle();
    }

    updateTitle(title:string):void {
        this.data.title = title;
        this.label.innerText = title;
        this.editInput.value = title;
    }

    save():void {
        //update todo item on the server, use Backendless.Async for asynchronous request
        TodoStorage.save(this.data, new Backendless.Async());

        this.todosList.onTodoCompleteChange();
    }

    destroy():void {
        //delete todo item on the server, use Backendless.Async for asynchronous request
        TodoStorage.remove(this.data, new Backendless.Async());

        this.todosList.onTodoDestroy(this);
    }

    toggle():void {
        var isHidden:boolean = this.data.completed ? this.todosList.filter === 'active' : this.todosList.filter === 'completed';

        toggleClass(this.el, 'hidden', isHidden);
    }

}