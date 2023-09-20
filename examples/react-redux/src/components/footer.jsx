import { Component } from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from "../constants/todo-filters";

export default class Footer extends Component {
    static propTypes = {
        completedCount: PropTypes.number.isRequired,
        activeCount: PropTypes.number.isRequired,
        filter: PropTypes.string.isRequired,
        onClearCompleted: PropTypes.func.isRequired,
    };

    render() {
        const { completedCount, onClearCompleted, activeCount, filter } = this.props;
        return (
            <footer className="footer" data-testid="footer">
                <span className="todo-count">{`${activeCount} ${activeCount === 1 ? "item" : "items"} left!`}</span>
                <ul className="filters" data-testid="footer-navigation">
                    <li>
                        <a className={classnames({ selected: filter === SHOW_ALL })} href={`#${SHOW_ALL}`}>
                            All
                        </a>
                    </li>
                    <li>
                        <a className={classnames({ selected: filter === SHOW_ACTIVE })} href={`#${SHOW_ACTIVE}`}>
                            Active
                        </a>
                    </li>
                    <li>
                        <a className={classnames({ selected: filter === SHOW_COMPLETED })} href={`#${SHOW_COMPLETED}`}>
                            Completed
                        </a>
                    </li>
                </ul>
                {completedCount > 0 ? (
                    <button className="clear-completed" onClick={onClearCompleted}>
                        Clear completed
                    </button>
                ) : null}
            </footer>
        );
    }
}
