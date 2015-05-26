var todoPage = require('../pages/todo.page');

describe('todo page', function() {
  	
	before(function() {
	    todoPage.go();
	});
    
    afterEach(function() {  
        severWarnings = browser.manage().logs().get('browser').then(function(browserLog) {
            var i = 0,
                severWarnings = false;

            for(i; i<=browserLog.length-1; i++){
                if(browserLog[i].level.name === 'SEVERE'){
                    severWarnings = true;
                }
            }
            return severWarnings;
        });
        expect(severWarnings).to.eventually.be.false;
    });

	it('should have the right page url', function() {
        expect(browser.getCurrentUrl()).to.eventually.contain('examples/angularjs');
  	});

  	it('should have the right browser title', function() {
    	expect(browser.getTitle()).to.eventually.equal('AngularJS • TodoMVC');
  	});

  	it('should have the right page title', function () {
        expect(todoPage.pageTitle).to.eventually.equal('todos');
    });

    it('should have the placeholder in todo', function () {
         expect(todoPage.todo.getAttribute('placeholder')).to.eventually.equal('What needs to be done?');
    });

    describe('todo items', function() {

        it('should add item', function() {
            todoPage.addRow('Test1');
            expect(todoPage.rowCount).to.eventually.equal(1);
        });

        it('should have right item', function() {
            var text = todoPage.rows.get(0).element(by.binding('todo.title')).getText();
            expect(text).to.eventually.equal('Test1');
        });

        it('should edit item', function() {
            var label = todoPage.rows.get(0).element(by.binding('todo.title')),
            model = todoPage.rows.get(0).element(by.model('todo.title')) 
            newText = 'Testedit';
            todoPage.editRow(label,model,newText);
            expect(todoPage.rows.get(0).element(by.binding('todo.title')).getText()).to.eventually.equal(newText);
        });

        it('should complete item', function() {
            todoPage.filter = 'All';
            todoPage.complete(todoPage.rows.get(0));
            expect(todoPage.completeRows.count()).to.eventually.equal(1);
        });

        it('should delete item', function() {
            var row = todoPage.rows.get(0);
            todoPage.deleteRow(row);
            expect(todoPage.rows.count()).to.eventually.equal(0);
        });
 
        describe('todo item listing', function() {
 
            before(function() {
               todoPage.addRow('Test1');
               todoPage.addRow('Test2');
            });
            
            it('should have filters', function () {
                expect(todoPage.filters.count()).to.eventually.not.equal(0);
            });

            it('should have filter all', function () {
                expect(todoPage.filters.get(0).getText()).to.eventually.be.equal('All');
            });

            it('should have filter active', function () {
                expect(todoPage.filters.get(1).getText()).to.eventually.be.equal('Active');
            });

            it('should have filter complete button', function () {
                expect(todoPage.filters.get(2).getText()).to.eventually.be.equal('Completed');
                
            });

            it('should not have clear completed if no task completed', function () {
               expect(element(by.buttonText('Clear completed')).isDisplayed()).to.eventually.be.false;
            });

            it('should clear completed once task completed', function () {
               todoPage.complete(todoPage.rows.get(0));
               expect(element(by.buttonText('Clear completed')).isDisplayed()).to.eventually.be.true;
            });

            it('should have remaining 1', function () { 
                expect(todoPage.remaining).to.eventually.be.equal(1);
            });

            it('should filter all', function () { 
                todoPage.filter = 'All';
                expect(todoPage.rowCount).to.eventually.be.equal(2);
            });

            it('should filter active', function () { 
                todoPage.filter = 'Active';
                expect(todoPage.remaining).to.eventually.be.equal(1);
            });

            it('should filter completed', function () { 
                todoPage.filter = 'Completed';
                expect(todoPage.remaining).to.eventually.be.equal(1);
            });

            it('should clear completed', function () { 
                todoPage.filter = 'All';
                element(by.buttonText('Clear completed')).click();
                expect(todoPage.rowCount).to.eventually.equal(1);
            });

        });
    });

});

