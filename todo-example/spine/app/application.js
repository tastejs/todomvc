jQuery(function($){
  
  window.Tasks = Spine.Controller.create({
    tag: "li",
    
    proxied: ["render", "remove"],
    
    events: {
      "change   input[type=checkbox]": "toggle",
      "click    .destroy":             "destroy",
      "dblclick .view":                "edit",
      "keypress input[type=text]":     "blurOnEnter",
      "blur     input[type=text]":     "close"
    },
    
    elements: {
      "input[type=text]": "input",
      ".item": "wrapper"
    },
    
    init: function(){
      this.item.bind("update",  this.render);
      this.item.bind("destroy", this.remove);
    },
    
    render: function(){
      var elements = $("#taskTemplate").tmpl(this.item);
      this.el.html(elements);
      this.refreshElements();
      return this;
    },
    
    toggle: function(){
      this.item.done = !this.item.done;
      this.item.save();      
    },
    
    destroy: function(){
      this.item.destroy();
    },
    
    edit: function(){
      this.wrapper.addClass("editing");
      this.input.focus();
    },
    
    blurOnEnter: function(e) {
      if (e.keyCode == 13) e.target.blur();
    },
    
    close: function(){
      this.wrapper.removeClass("editing");
      this.item.updateAttributes({name: this.input.val()});
    },
    
    remove: function(){
      this.el.remove();
    }
  });
  
  window.TaskApp = Spine.Controller.create({
    el: $("#tasks"),
    
    proxied: ["addOne", "addAll", "renderCount"],

    events: {
      "submit form":   "create",
      "click  .clear": "clear"
    },

    elements: {
      ".items":     "items",
      ".countVal":  "count",
      ".clear":     "clear",
      "form input": "input"
    },
    
    init: function(){
      Task.bind("create",  this.addOne);
      Task.bind("refresh", this.addAll);
      Task.bind("refresh change", this.renderCount);
      Task.fetch();
    },
    
    addOne: function(task) {
      var view = Tasks.init({item: task});
      this.items.append(view.render().el);
    },

    addAll: function() {
      Task.each(this.addOne);
    },
        
    create: function(){
      Task.create({name: this.input.val()});
      this.input.val("");
      return false;
    },
    
    clear: function(){
      Task.destroyDone();
    },
    
    renderCount: function(){
      var active = Task.active().length;
      this.count.text(active);
      
      var inactive = Task.done().length;
      this.clear[inactive ? "show" : "hide"]();
    }
  });
  
  window.App = TaskApp.init();
});