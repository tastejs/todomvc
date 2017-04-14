#Tests

##Mocha

  TodoMVC - platypus
    No Todos
      √ should hide #main and #footer (257ms)
    New Todo
      √ should allow me to add todo items (487ms)
      √ should clear text input field when an item is added (193ms)
      √ should append new items to the bottom of the list (553ms)
      √ should trim text input (212ms)
      √ should show #main and #footer when items added (331ms)
    Mark all as completed
      √ should allow me to mark all items as completed (784ms)
      √ should allow me to clear the completion state of all items (969ms)
      √ complete all checkbox should update state when items are completed / cleared (1116ms)
    Item
      √ should allow me to mark items as complete (787ms)
      √ should allow me to un-mark items as complete (777ms)
      √ should allow me to edit an item (917ms)
      √ should show the remove button on hover
    Editing
      √ should hide other controls when editing (691ms)
      √ should save edits on enter (906ms)
      √ should save edits on blur (999ms)
      √ should trim entered text (906ms)
      √ should remove the item if an empty text string was entered (923ms)
      √ should cancel edits on escape (941ms)
    Counter
      √ should display the current number of todo items (364ms)
    Clear completed button
      √ should display the number of completed items (729ms)
      √ should remove completed items when clicked (730ms)
      √ should be hidden when there are no items that are completed (723ms)
    Routing
      √ should allow me to display active items (685ms)
      √ should respect the back button (1047ms)
      √ should allow me to display completed items (703ms)
      √ should allow me to display all items (917ms)
      √ should highlight the currently applied filter (938ms)


  28 passing (1m)

##Grunt

    Running "simplemocha:files" (simplemocha) task
    (1 of 28) pass: TodoMVC - platypus, No Todos, should hide #main and #footer
    (2 of 28) pass: TodoMVC - platypus, New Todo, should allow me to add todo items
    (3 of 28) pass: TodoMVC - platypus, New Todo, should clear text input field when an item is added
    (4 of 28) pass: TodoMVC - platypus, New Todo, should append new items to the bottom of the list
    (5 of 28) pass: TodoMVC - platypus, New Todo, should trim text input
    (6 of 28) pass: TodoMVC - platypus, New Todo, should show #main and #footer when items added
    (7 of 28) pass: TodoMVC - platypus, Mark all as completed, should allow me to mark all items as completed
    (8 of 28) pass: TodoMVC - platypus, Mark all as completed, should allow me to clear the completion state of all items
    (9 of 28) pass: TodoMVC - platypus, Mark all as completed, complete all checkbox should update state when items are completed / cleared
    (10 of 28) pass: TodoMVC - platypus, Item, should allow me to mark items as complete
    (11 of 28) pass: TodoMVC - platypus, Item, should allow me to un-mark items as complete
    (12 of 28) pass: TodoMVC - platypus, Item, should allow me to edit an item
    (13 of 28) pass: TodoMVC - platypus, Item, should show the remove button on hover
    (14 of 28) pass: TodoMVC - platypus, Editing, should hide other controls when editing
    (15 of 28) pass: TodoMVC - platypus, Editing, should save edits on enter
    (16 of 28) pass: TodoMVC - platypus, Editing, should save edits on blur
    (17 of 28) pass: TodoMVC - platypus, Editing, should trim entered text
    (18 of 28) pass: TodoMVC - platypus, Editing, should remove the item if an empty text string was entered
    (19 of 28) pass: TodoMVC - platypus, Editing, should cancel edits on escape
    (20 of 28) pass: TodoMVC - platypus, Counter, should display the current number of todo items
    (21 of 28) pass: TodoMVC - platypus, Clear completed button, should display the number of completed items
    (22 of 28) pass: TodoMVC - platypus, Clear completed button, should remove completed items when clicked
    (23 of 28) pass: TodoMVC - platypus, Clear completed button, should be hidden when there are no items that are completed
    (24 of 28) pass: TodoMVC - platypus, Routing, should allow me to display active items
    (25 of 28) pass: TodoMVC - platypus, Routing, should respect the back button
    [5756:10164:0417/175035:ERROR:ipc_channel_win.cc(132)] pipe error: 109
    (26 of 28) pass: TodoMVC - platypus, Routing, should allow me to display completed items
    (27 of 28) pass: TodoMVC - platypus, Routing, should allow me to display all items
    (28 of 28) pass: TodoMVC - platypus, Routing, should highlight the currently applied filter
    passed: 28/28
    failed: 0/28
    new issues: 0
    resolved issues: 0

##Karma

    > karma start config/karma.conf.js

    INFO [karma]: Karma v0.12.9 server started at http://localhost:9876/
    INFO [launcher]: Starting browser Chrome
    INFO [launcher]: Starting browser Firefox
    INFO [Firefox 27.0.0 (Windows)]: Connected on socket rPvP6-AcIWNSc_uS5n6N with id 51356671
    INFO [Chrome 34.0.1847 (Windows)]: Connected on socket EtB7eKWe9tzN1B-p5n6O with id 61681744
    Firefox 27.0.0 (Windows): Executed 27 of 27 SUCCESS (0.023 secs / 0.011 secs)
    Chrome 34.0.1847 (Windows): Executed 27 of 27 SUCCESS (0.025 secs / 0.021 secs)
    TOTAL: 54 SUCCESS