import _ from 'underscore';
import React from 'react';
import TaskList from './task-list';
import Controls from './controls';
import { trim } from '../util/utilities';

const KEY_ENTER = 13;

export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {newTaskDescription: ""};
    }

    render() {
        return <section className="todoapp">{
            [<header key="todos">
                <h1>todos</h1>
                <input className="new-todo"
                       placeholder="What needs to be done?"
                       value={ this.state.newTaskDescription }
                       onChange={ (e) => { this.setState({ newTaskDescription: e.target.value }); } }
                       onKeyDown={ ({ which, target }) => { which === KEY_ENTER && (this.props.onTaskAdd(trim(target.value)) || this.setState({ newTaskDescription: "" })); }  }
                       autofocus/>
            </header>].concat((!this.props.tasks.length) ? [] : [
                    <section key="main" className="main">
                        <input className="toggle-all" onChange={ this.props.onAllTasksToggleCompleted }
                               checked={ this.props.tasks.filter(_.matches({ completed: true })).length === this.props.tasks.length }
                               type="checkbox"/>
                        <TaskList
                            filter={ this.props.filter }
                            tasks={ this.props.tasks.map((task) => _.extend(task, {
						onToggleCompleted: _.partial(this.props.onTaskToggleCompleted, task.id),
						onRename: (newDescription) => { this.props.onTaskRename(task.id, newDescription) },
						onRemove: _.partial(this.props.onTaskRemove, task.id)
					})
				)}/>
                    </section>,
                    <Controls
                        key="controls"
                        tasks={ this.props.tasks }
                        filter={ this.props.filter }
                        onFilterChange={ this.props.onFilterChange }
                        onRemove={ this.props.onAllCompletedTasksRemove }
                        />])
        }</section>
    }
}

Main.defaultProps = {
    "tasks": [],
    "filter": "all",
    "onFilterChange": _.noop,
    "onTaskToggleCompleted": _.noop,
    "onTaskRename": _.noop,
    "onTaskRemove": _.noop,
    "onTaskAdd": _.noop,
    "onAllTasksToggleCompleted": _.noop,
    "onAllCompletedTasksRemove": _.noop
};
