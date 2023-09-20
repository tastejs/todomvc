import { Component } from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

export default class TextInput extends Component {
    static propTypes = {
        onSave: PropTypes.func.isRequired,
        text: PropTypes.string,
        placeholder: PropTypes.string,
        editing: PropTypes.bool, // input is used in Item to edit the todo.
        newTodo: PropTypes.bool, // input is used in Header to create a todo.
    };

    state = {
        text: this.props.text || "",
    };

    handleSubmit = (e) => {
        const text = e.target.value.trim();
        if (e.key === "Enter") {
            this.props.onSave(text);
            if (this.props.newTodo)
                this.setState({ text: "" });
        }
    };

    handleChange = (e) => {
        this.setState({ text: e.target.value });
    };

    handleBlur = (e) => {
        // If this input is used in the Header, call onSave to create a new todo.

        if (!this.props.newTodo)
            this.props.onSave(e.target.value);
    };

    render() {
        return (
            <input
                className={classnames({
                    edit: this.props.editing,
                    "new-todo": this.props.newTodo,
                })}
                type="text"
                data-testid="text-input"
                placeholder={this.props.placeholder}
                autoFocus
                value={this.state.text}
                onBlur={this.handleBlur}
                onChange={this.handleChange}
                onKeyDown={this.handleSubmit}
            />
        );
    }
}
