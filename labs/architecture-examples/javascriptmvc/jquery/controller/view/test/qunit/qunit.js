//we probably have to have this only describing where the tests are
steal('jquery/controller/view','jquery/view/micro')  //load your app
 .then('funcunit/qunit')  //load qunit
 .then("./controller_view_test.js")
 
