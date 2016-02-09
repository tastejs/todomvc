const {dom, modelFor} = require('duet');
const {extend}        = require('../utils');
const {create}        = require('duet/node_modules/virtual-dom');

const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

module.exports = (state) => {
    const model = modelFor(state);
    const ids = Object.keys(state.todos);

    const toggleAllCompleted = (model) => {
        const numActive = Object.keys(model().todos).reduce(function (sum, id) {
            return state.todos[id].completed ? sum : sum + 1;
        }, 0);

        ids.forEach((id) => {
            const todo = model.todos.get(id);

            model.todos.put(id, extend(todo, {completed: numActive > 0}));
        });
    };

    const toggleCompleted = (model, data) => {
        const id = data.custom;
        const todo = model.todos.get(id);

        model.todos.put(id, extend(todo, {completed: !todo.completed}));
    };

    const edit = (model, data) => {
        model.editing.set(data.custom);
    };

    const clear = (model, data) => {
        model.todos['delete'](data.custom);
    };

    const onKeydown = (model, data) => {
        const id = data.custom;
        let title, todo;

        if (data.event.keyCode === ESCAPE_KEY) {
            model.editing.set(null);

            return;
        }

        if (data.event.keyCode !== ENTER_KEY) {
            return;
        }

        title = data.form.title;
        todo = model.todos.get(id);

        console.log(title);

        model.todos.put(id, extend(todo, {title: title}));
        model.editing.set(null);
    };


    const close = (model) => {
        model.editing.set(null);
    };

    const numActive = ids.reduce(function (sum, id) {
        return state.todos[id].completed ? sum : sum + 1;
    }, 0);

    const numCompleted = ids.length - numActive;

    const filteredIds = ids.filter(function (id) {
        const todo = state.todos[id];

        switch (state.filter) {
            case 'completed':
                return todo.completed;
            case 'active':
                return !todo.completed;
            default:
                return true;
        }
    });

    const Todo = (id) => {
        const todo = state.todos[id];

        return dom`
            <li className=${state.editing === id ? 'editing' : ''} key=${'todo--' + id}>
                <div.view>
                    <input.toggle type="checkbox"
                        key=${'toggle--' + id + (todo.completed ? '--checked' : '')}
                        checked=${todo.completed ? 'checked' : ''}
                        dataset=${{change: model.ev(toggleCompleted, id)}}>
                    <label dataset=${{dblclick: model.ev(edit, id)}}>${todo.title}</label>
                    <button.destroy dataset=${{click: model.ev(clear, id)}}></button>
                </div>
                <input.edit
                    name="title"
                    value=${todo.title}
                    dataset=${{
                        keydown: model.ev(onKeydown, id),
                        focusout: model.ev(close),
                        default: 'keydown'
                    }}>
            </li>
        `;
    };

    return dom`
        <section.main className=${ids.length ? '' : 'hidden'}>
            <input className="toggle-all" type="checkbox"
                key=${'toggle-all' + (numActive === 0 ? '--checked' : '')}
                checked=${numActive === 0 ? 'checked' : ''}
                dataset=${{change: model.ev(toggleAllCompleted)}}>
            <label htmlFor="toggle-all">Mark all as complete</label>
            <ul className="todo-list">
                ${filteredIds.map(Todo)}
            </ul>
        </section>
    `;
};
