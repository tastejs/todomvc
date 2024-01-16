import { connect } from "react-redux";
import Main from "../components/main";
import { editTodo, toggleTodo, deleteTodo, toggleAll, clearCompleted } from "../actions";
import { withRouter } from "react-router-dom";
import { getCompletedTodos, getVisibleTodos } from "../selectors/filters";

const mapStateToProps = (state, ownProps) => {
    const { todos } = state;
    const { location } = ownProps;

    const visibleTodos = getVisibleTodos(todos, location.pathname);
    const completedCount = getCompletedTodos(todos).length;
    const activeCount = todos.length - completedCount;

    return { todos, completedCount, activeCount, visibleTodos };
};

const mapDispatchToProps = {
    editTodo,
    toggleTodo,
    deleteTodo,
    toggleAll,
    clearCompleted,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
