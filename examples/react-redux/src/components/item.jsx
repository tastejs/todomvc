import { PureComponent } from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
import TextInput from "./text-input";

export default class Item extends PureComponent {
    static propTypes = {
        todo: PropTypes.object.isRequired,
        editTodo: PropTypes.func.isRequired,
        deleteTodo: PropTypes.func.isRequired,
        toggleTodo: PropTypes.func.isRequired,
        index: PropTypes.number.isRequired,
    };

    state = {
        editing: false,
    };

    handleDoubleClick = () => {
        this.setState({ editing: true });
    };

    handleSave = (id, text) => {
        if (text.length === 0)
            this.props.deleteTodo(id);
        else
            this.props.editTodo(id, text);

        this.setState({ editing: false });
    };

    render() {
        const { todo, toggleTodo, deleteTodo, index } = this.props;

        let element;
        if (this.state.editing) {
            element = <TextInput text={todo.text} editing={this.state.editing} onSave={(text) => this.handleSave(todo.id, text)} />;
        } else {
            element = (
                <div className="view">
                    <input className="toggle" type="checkbox" data-testid="todo-item-toggle" checked={todo.completed} onChange={() => toggleTodo(todo.id)} />
                    <label onDoubleClick={this.handleDoubleClick} data-testid="todo-item-label">
                        {todo.text}
                    </label>
                    <button className="destroy" data-testid="todo-item-button" onClick={() => deleteTodo(todo.id)} />
                </div>
            );
        }

        return (
            <li
                className={classnames({
                    completed: todo.completed,
                    editing: this.state.editing,
                })}
                data-testid="todo-item"
            >
                {element}
            </li>
        );
    }
}
