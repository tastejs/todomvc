(function() {
  window.AppViewModel = function(todos) {
    this.header = new HeaderViewModel(todos);
    this.todos = new TodosViewModel(todos);
    this.footer = new FooterViewModel(todos);
    return this;
  };
}).call(this);
