//we probably have to have this only describing where the tests are
steal("jquery/model","jquery/dom/fixture")  //load your app
 .then('funcunit/qunit')  //load qunit
 .then("./model_test.js","./associations_test.js")
 .then(
	"jquery/model/backup/qunit",
	"jquery/model/list/list_test.js"
  )
  .then("jquery/model/validations/qunit/validations_test.js")
