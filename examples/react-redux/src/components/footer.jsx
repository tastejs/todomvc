import classnames from "classnames";
import { useDispatch } from "react-redux";
import { clearCompleted } from "../store";

export default function Footer({ completedCount, activeCount, filter, hidden = false }) {
    const dispatch = useDispatch();

    return (
        <footer className="footer" data-testid="footer" hidden={hidden}>
            <span className="todo-count">{`${activeCount} ${activeCount === 1 ? "item" : "items"} left!`}</span>
            <ul className="filters" data-testid="footer-navigation">
                <li>
                    <a
                        className={classnames({ selected: filter === "/" || filter === "/all" })}
                        href="#/"
                    >
                        All
                    </a>
                </li>
                <li>
                    <a className={classnames({ selected: filter === "/active" })} href="#/active">Active</a>
                </li>
                <li>
                    <a className={classnames({ selected: filter === "/completed" })} href="#/completed">Completed</a>
                </li>
            </ul>
            <button
                className="clear-completed"
                hidden={completedCount === 0}
                onClick={() => dispatch(clearCompleted())}
            >
                Clear completed
            </button>
        </footer>
    );
}
