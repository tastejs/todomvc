import _ from 'underscore';
import React from 'react';
import TaskItem from './task-item';

const filters = {
    "all": _.constant(true),
    "active": _.matches({completed: false}),
    "completed": _.matches({completed: true})
}

export default class TaskList extends React.Component {
    render() {
        return <ul className="todo-list">{
            this
                .props
                .tasks
                .filter(filters[this.props.filter])
                .map((task, i)=><TaskItem key={task.id} { ...task} />) }
        </ul>
    }
}

TaskList.defaultProps = {
    tasks: []
};
