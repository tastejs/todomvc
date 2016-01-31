const {dom, modelFor} = require('duet');
const {uuid}          = require('../utils');

const ENTER_KEY = 13;

const onKeydown = (model, data) => {
    var title;

    if (data.event.keyCode !== ENTER_KEY) {
        return;
    }

    title = data.form['new-todo'].trim();

    if (title) {
        model.todos.put(uuid(), {
            title: title,
            completed: false
        });
        model.newTodo.set('');
    }
};

module.exports = (state) => {
    const model = modelFor(state);

    return dom`
        <header.header>
            <h1>todos</h1>
            <input className="new-todo"
                name="new-todo"
                value=${state.newTodo}
                data-keydown=${model.ev(onKeydown)}
                data-default="keydown"
                placeholder="What needs to be done?"
                autofocus>
        </header>
    `;
};
