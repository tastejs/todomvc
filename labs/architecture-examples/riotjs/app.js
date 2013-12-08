
/* The presenter */

(function() { 'use strict';
  /*
    A Model instance exposed to global space so you can
    use the Todo APi from the console. For example:

    todo.add("My task");
  */
  window.todo = new Todo();

  // HTML for a single todo item
  var template = $("[type='html/todo']").html(),
    root = $("#todo-list"),
    nav = $("#filters a");



  /* Listen to user events */

  $("#new-todo").keyup(function(e) {
    var val = $.trim(this.value);
    if (e.which == 13 && val) {
      todo.add(val);
      this.value = "";
    }
  })

  $("#toggle-all").click(function() {
    $("li", root).each(function() {
      todo.toggle(this.id);
    })
  })

  $("#clear-completed").click(function() {
    todo.remove("completed");
  })



  /* Listen to model events */

  todo.on("add", add).on("remove", function(items) {
    $.each(items, function() {
      $("#" + this.id).remove()
    })

  }).on("toggle", function(item) {
    toggle($("#" + item.id), !!item.done)

  }).on("edit", function(item) {
    var el = $("#" + item.id);
    el.removeClass("editing");
    $("label, .edit", el).text(item.name).val(item.name);

  // counts
  }).on("add remove toggle", counts)



  /* Routing */

  nav.click(function() {
    return $.route($(this).attr("href"))
  })

  $.route(function(hash) {

    // clear list and add new ones
    root.empty() && $.each(todo.items(hash.slice(2)), add)

    // selected class
    nav.removeClass("selected").filter("[href='" + hash + "']").addClass("selected");

    // update counts
    counts()
  })



  /* Private functions */

  function toggle(el, flag) {
    el.toggleClass("completed", flag);
    $(":checkbox", el).prop("checked", flag);
  }

  function add(item) {
    if (this.id) item = this;

    var el = $($.render(template, item)).appendTo(root),
      input = $(".edit", el);


    $(".toggle", el).click(function() {
      todo.toggle(item.id);
    })

    function blur() {
      el.removeClass("editing")
    }

    toggle(el, !!item.done);

    // edit
    input.blur(blur).keydown(function(e) {
      var val = $.trim(this.value);
      if (e.which == 13 && val) {
        item.name = val;
        todo.edit(item);
      }

      if (e.which == 27) blur()
    })

    $("label", el).dblclick(function() {
      el.addClass("editing");
      input.focus()[0].select();
    })

    // remove
    $(".destroy", el).click(function() {
      todo.remove(item.id);
    })

  }

  function counts() {
    var active = todo.items("active").length,
       done = todo.items("completed").length;

    $("#todo-count").html("<strong>" +active+ "</strong> item" +(active == 1 ? "" : "s")+ " left")
    $("#clear-completed").toggle(done > 0).text("Clear completed (" + done + ")")
    $("#footer").toggle(active + done > 0)
  }

})()
