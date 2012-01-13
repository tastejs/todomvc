
steal.plugins('funcunit/qunit', 'jquery/event/resize').then(function() {

	module("jquery/event/resize")


	test("resize hits only children in order", function() {
		var ids = []
		record = function( ev ) {
			ids.push(this.id ? this.id : this)
		},
			divs = $("#qunit-test-area").html("<div id='1'><div id='1.1'></div><div id='1.2'></div></div><div id='2'></div>").find('div').bind('resize', record);

		$(document.body).bind('resize', record);

		$("#qunit-test-area").children().eq(0).trigger("resize");

		same(ids, ['1', '1.1', '1.2'])

		ids = [];
		$("#qunit-test-area").trigger("resize");
		same(ids, [document.body, '1', '1.1', '1.2', '2']);

		ids = [];
		$(window).trigger("resize");
		same(ids, [document.body, '1', '1.1', '1.2', '2']);

		$(document.body).unbind('resize', record);
	});

	test("resize stopping prop", function() {
		var ids = []
		record = function( ev ) {

			ids.push(this.id ? this.id : this)
			if ( this.id == '1' ) {
				ev.stopPropagation();
			}
		},
			divs = $("#qunit-test-area").html("<div id='1'><div id='1.1'></div><div id='1.2'></div></div><div id='2'></div>").find('div').bind('resize', record);

		$(document.body).bind('resize', record);

		$(window).trigger("resize");
		same(ids, [document.body, '1', '2']);

		$(document.body).unbind('resize', record);
	});

	test("resize event cascades from target", function() {

		var ids = [],
			record = function( ev ) {
				ids.push(this.id ? this.id : this);
			},

			divs = $("#qunit-test-area").html("<div id='1'><div id='1.1'><div id='1.1.1'></div></div></div>");

		divs.find("#1\\.1\\.1").bind("resize", record);
		divs.find("#1").bind("resize", record);

		$("#1\\.1").trigger("resize", [false]);
		same(ids, ['1.1.1']);

		$("#qunit-test-area").empty();
	});


})