/**
 * @class AppView
 * @summary main application view
 */
var AppView = (function() {
  function AppView() {
    var that = this;

    document.querySelector('.todoapp').innerHTML = document.querySelector('#main-app').innerHTML;

    this.mainEl = document.querySelector('.main');
    this.footerEl = document.querySelector('.footer');
    this.inputEl = document.querySelector('.new-todo');
    this.todoCountEl = document.querySelector('.todo-count');
    this.clearCompletedEl = document.querySelector('.clear-completed');
    this.toggleAllBtn = document.querySelector('.toggle-all');
    this.routerButtons = document.querySelectorAll('.filters a');

    this.filter = null;
    this.todoList = new TodosList(this);

    this.updateState();

    new Router({'/:filter': function(filter) {that.onRouterChange(filter);}}).init('/all');

    this.inputEl.addEventListener('keypress', function(e) {that.onInputKeyPress(e);});
    this.toggleAllBtn.addEventListener('click', function(e) {that.onTogglerAllBtnClick(e)});
    this.clearCompletedEl.addEventListener('click', function(e) {that.onClearCompletedClick()});
  }

  AppView.prototype.updateState = function() {
    var todosCounts = this.todoList.getCounts();
    var totalItems = todosCounts.total;
    var remainsItems = todosCounts.remains;

    this.mainEl.style.display = totalItems ? '' : 'none';
    this.footerEl.style.display = totalItems ? '' : 'none';
    this.clearCompletedEl.style.display = (totalItems - remainsItems) ? '' : 'none';

    this.toggleAllBtn.checked = !!totalItems && !remainsItems;

    this.todoCountEl.innerHTML = '<strong> ' + remainsItems + ' </strong>' + (remainsItems === 1 ? ' item' : ' items') + ' left';
  };

  AppView.prototype.onRouterChange = function(filter) {
    for (var i = 0; i < this.routerButtons.length; i++) {
      toggleClass(this.routerButtons[i], 'selected', (this.routerButtons[i].hash === '#/' + filter));
    }

    this.todoList.setFilter(filter);
  };

  AppView.prototype.onInputKeyPress = function(e) {
    var title = this.inputEl.value.trim();

    if (e.which === ENTER_KEY && title) {
      this.todoList.createItem({title: title});

      this.updateState();
      this.inputEl.value = '';
    }
  };

  AppView.prototype.onTogglerAllBtnClick = function(e) {
    this.todoList.toggleAll(e.currentTarget.checked);
  };

  AppView.prototype.onClearCompletedClick = function() {
    this.todoList.removeCompleted();
  };

  return AppView;
})();
