import React from 'react';
import {pluralize} from './utils'
import {ACTIVE_TODOS, COMPLETED_TODOS, ALL_TODOS} from './constants'
import {IndexLink} from 'react-router'

class Footer extends React.Component {
    render() {
        let {count, onClearCompleted, completedCount} = this.props;
        let activeTodoWord = pluralize(count, 'item');
        let clearButton = null;

        if (completedCount > 0) {
            clearButton = (
                <button
                    className="clear-completed"
                    onClick={onClearCompleted}>
                    Clear completed
                </button>
            );
        }

        return (
            <footer className="footer">
					<span className="todo-count">
						<strong>{count}</strong> {activeTodoWord} left
					</span>
                <ul className="filters">
                    <li><IndexLink to="/" activeClassName="selected">{ALL_TODOS}</IndexLink></li>
                    {' '}
                    <li><IndexLink to={"/" + ACTIVE_TODOS} activeClassName="selected">{ACTIVE_TODOS}</IndexLink></li>
                    {' '}
                    <li><IndexLink to={"/" + COMPLETED_TODOS} activeClassName="selected">{COMPLETED_TODOS}</IndexLink></li>
                </ul>
                {clearButton}
            </footer>
        );
    }
}

export default Footer;