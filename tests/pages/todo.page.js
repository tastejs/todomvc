var Page = require('astrolabe').Page;

module.exports = Page.create({
    
    url: { value: '/examples/angularjs' },

    tdTitle: {
        get: function () { return $('#header h1'); }
    },

    pageTitle: {
        get: function () {
            return this.tdTitle.getText();
        }
    },
     
    filters: {
        get: function () {
            return $$('#filters li');
        }
    },

    todo : {
        get: function () {
           return  element(by.model('newTodo'));
        }
    } ,

    filter: {
        get: function () {
            return $('#filters .selected').getText();
        },
        set: function (filter) {
            element(by.cssContainingText('#filters li a', filter)).click();
        }
    },

    remaining: {
        get: function () {
            return element(by.binding('remainingCount')).getText().then(parseInt);
        }
    },

    rows : {
        get: function () {
            return element.all(by.repeater('todo in todos'));
        }
    },

    completeRows : {
        get : function () {
            return element.all(by.css('.completed'));
        }
    },

    rowCount: {
        get: function () {
            return this.rows.count();
        }
    },

    addRow : { 
        value : function(text){
             this.todo.sendKeys(text);
                 this.todo.submit();
        }
    },

    deleteRow : {
        value : function(row){
            browser.actions().mouseMove(row).perform();
            row.element(by.css('.destroy')).click();
        }
    },

    editRow : {
        value : function(label,model,text){
           browser.actions().doubleClick(label).perform();
           model.clear();
           model.sendKeys(text);
           model.submit();
        }
    },

    complete : {
        value: function (row) {
           row.element(by.model('todo.completed')).click();
        }
    },

});
