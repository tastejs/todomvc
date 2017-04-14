/*global define*/
define([
    'dollar',
    'mo/lang',
    'mo/template',
    'eventmaster'
], function ($, _, tpl, event) {
	'use strict';

    var todoList;

    var listView = {

        event: event(),

        init: function () {
            todoList = $('#todo-list');
        },

        renderItem: function (data) {
            return tpl.convertTpl('item-template', data);
        },

        update: function (data) {
            todoList[0].innerHTML = '';
            this.updateGraceful(data);
        },

        updateGraceful: function (data) {
            var lib = _.index(data, 'iid');
            todoList.find('li').forEach(function (itemNode) {
                itemNode = $(itemNode);
                var iid = itemNode.data('iid');
                if (lib[iid]) {
                    this.updateItem(lib[iid]);
                } else {
                    itemNode.remove();
                }
                delete lib[iid];
            }, this);
            Object.keys(lib).forEach(function (iid) {
                this.updateItem(lib[iid]);
            }, this);
        },

        updateItem: function (data) {
            var li = todoList.find('li[data-iid="' + data.iid  + '"]');
            if (li[0]) {
                li[0].innerHTML = this.renderItem(data);
            } else {
                li = $('<li>' + this.renderItem(data) + '</li>')
                    .appendTo(todoList);
            }
            if (data.completed) {
                li.addClass('completed');
            } else {
                li.removeClass('completed');
            }
            li.data('iid', data.iid);
        }
    
    };

    return listView;

});
