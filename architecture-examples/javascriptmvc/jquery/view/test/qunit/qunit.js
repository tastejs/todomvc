//we probably have to have this only describing where the tests are
steal
 .plugins("jquery/view","jquery/view/micro","jquery/view/ejs","jquery/view/jaml","jquery/view/tmpl")  //load your app
 .plugins('funcunit/qunit')  //load qunit
 .then("view_test","//jquery/view/tmpl/tmpl_test.js")
 
if(steal.browser.rhino){
  steal.plugins('funcunit/qunit/env')
}