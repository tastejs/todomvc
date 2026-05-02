import classnames from "classnames";
import { useDispatch } from "react-redux";
import { clearCompleted } from "../store";

export default function Footer({ completedCount, activeCount, filter }) {
    const dispatch = useDispatch();

    return (
        <footer className="footer" data-testid="footer">
            <span className="todo-count">{`${activeCount} ${activeCount === 1 ? "item" : "items"} left!`}</span>
            <ul className="filters" data-testid="footer-navigation">
                <li>
                    <a className={classnames({ selected: filter === "/all" })} href="#/all">All</a>
                </li>
                <li>
                    <a className={classnames({ selected: filter === "/active" })} href="#/active">Active</a>
                </li>
                <li>
                    <a className={classnames({ selected: filter === "/completed" })} href="#/completed">Completed</a>
                </li>
            </ul>
            {completedCount > 0 ? (
                <button className="clear-completed" onClick={() => dispatch(clearCompleted())}>
                    Clear completed
                </button>
            ) : null}
        </footer>
    );
}
