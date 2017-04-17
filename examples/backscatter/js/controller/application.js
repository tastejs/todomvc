import _ from 'underscore';
import Backbone from 'backbone';
import React from 'react';
import Main from '../view/main';
import SessionModel from '../model/session';
import UrlView from '../view/url';

export default (window) => {

    // Create default session
    let session = new SessionModel;
    session.get('tasks').set(JSON.parse(window.localStorage["todo-backscatter"] || "[]"));

    // Add URL ("router") view
    let urlView = new UrlView({ model: session, window });
    urlView.on('url_change', _.compose(session.set.bind(session, 'filter'), (url)=>({ "active": "active", "completed": "completed" }[url] || "all")));

    // Define render routine
    let render = ()=> {
        React.render(React.createElement(Main, {
            tasks: session.get('tasks').toJSON(),
            filter: session.get('filter'),
            onAllTasksToggleCompleted: () => session.get('tasks').toggleCompleted(),
            onTaskToggleCompleted: (taskId) => session.get('tasks').get(taskId).toggleCompleted(),
            onTaskRename: (taskId, newDescription) => session.get('tasks').get(taskId).set({description: newDescription}, {validate: true}),
            onFilterChange: (filter) => session.set({filter}),
            onTaskRemove: (taskId) => session.get('tasks').remove(session.get('tasks').get(taskId)),
            onTaskAdd: (description) => {
                session.get('tasks').add({id: _.uniqueId('task-'), description: description}, {validate: true})
            },
            onAllCompletedTasksRemove: ()=> session.get('tasks').removeCompleted()
        }), document.getElementsByTagName('main')[0]);
    };

    // Define persistence routine
    let persist = _.debounce(()=> window.localStorage["todo-backscatter"] = JSON.stringify(session.get('tasks').toJSON()), 500);

    // ********************************************************************************************************************************
    // The following line is the only required usage of Backscatter to cover any event from models and collections anywhere below
    // "session", no matter how deeply nested they are. In this case, individual task changes (description/complete) are being
    // intercepted, as well as changes to the "tasks" list, all in one place, here:
    // ********************************************************************************************************************************
    session.backscatterOn(_.compose(persist, _.debounce(render)))();
}