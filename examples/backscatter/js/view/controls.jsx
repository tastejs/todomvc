import _ from 'underscore';
import React from 'react';

const getActiveItems = (tasks) => _.where(tasks, {completed: false}),
    getCountText = (number) => `item${(number - 1) ? "s" : ""} left`,
    viewStates = [
        {"id": "all", "caption": "All"},
        {"id": "active", "caption": "Active"},
        {"id": "completed", "caption": "Completed"}
    ];


export default class Controls extends React.Component {

    render() {

        var activeItemsCount = getActiveItems(this.props.tasks).length;

        return <footer className="footer">
            <span className="todo-count"><strong>{ activeItemsCount }</strong> { getCountText(activeItemsCount) }</span>
            <ul className="filters">
                { viewStates.map((viewState)=><li key={ viewState.id }>
                        <button
                            onClick={ _.partial(this.props.onFilterChange, viewState.id) }
                            className={ viewState.id === this.props.filter ? "filter selected" : "filter" }>
                            { viewState.caption }
                        </button>
                    </li>
                ) }
            </ul>
            <button
                style={{ display: _(this.props.tasks).chain().where({ completed: true }).some().value() ? "inline-block" : "none" }}
                onClick={ this.props.onRemove }
                className="clear-completed">Clear completed
            </button>
        </footer>
    }
}

Controls.defaultProps = {
    "onFilterChange": _.noop,
    "onRemove": _.noop
};
