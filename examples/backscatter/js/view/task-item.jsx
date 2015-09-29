import _ from 'underscore';
import React from 'react';
import { trim } from '../util/utilities';

const KEY_ENTER = 13,
    KEY_ESCAPE = 27;

export default class TaskItem extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            "editing": false,
            "description": props.description
        }
    }

    componentWillReceiveProps(props) {
        this.setState({"description": props.description});
    }

    render() {
        return <li className={ [
						this.props.completed && "completed",
						this.state.editing && "editing"
					].filter(Boolean).join(' ') }
            >
            <div className="view">
                <input
                    className="toggle"
                    type="checkbox"
                    checked={ this.props.completed }
                    onChange={ this.props.onToggleCompleted }
                    />
                <label onDoubleClick={ this.beginEditing.bind(this) }>{ this.props.description }</label>
                <button onClick={ this.props.onRemove } className="destroy"></button>
            </div>
            <input className="edit"
                   ref="editField"
                   value={ this.state.description }
                   onChange={ _.compose(this.setState.bind(this), (e) => ({ description: e.target.value })) }
                   onKeyDown={ this.handleKeyDown.bind(this) }
                   onBlur={ this.renameAndEnd.bind(this) }
                />
        </li>
    }

    beginEditing() {
        this.setState({"description": this.props.description, "editing": true}, function () {
            let node = React.findDOMNode(this.refs.editField);
            node.focus();
            node.setSelectionRange(node.value.length, node.value.length);
        });
    }

    renameAndEnd(event) {
        let newDescription = trim(event.target.value);
        (newDescription.length ? this.props.onRename : this.props.onRemove)(newDescription);
        this.setState({"editing": false});
    }

    handleKeyDown(event) {
        switch (event.which) {
            case KEY_ESCAPE:
                this.setState({
                    "editing": false,
                    "description": this.props.description
                });
                break;
            case KEY_ENTER:
                this.renameAndEnd(event);
                break;
        }
    }
}

TaskItem.defaultProps = {
    "id": 0,
    "description": "",
    "completed": false,
    "onRename": _.noop,
    "onToggleCompleted": _.noop,
    "onRemove": _.noop
};