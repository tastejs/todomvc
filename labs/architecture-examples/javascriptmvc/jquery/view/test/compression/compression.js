steal('jquery/view/ejs', 'jquery/view/tmpl')
	.then('./views/relative.ejs',
	 	  'jquery/view/test/compression/views/absolute.ejs',
		  './views/tmplTest.tmpl',
		  './views/test.ejs',
		function(){

	 	$(document).ready(function(){
	 		$("#target").append('//jquery/view/test/compression/views/relative.ejs', {})
	 					.append($.View('//jquery/view/test/compression/views/absolute.ejs', {} ))
	 					.append($.View('//jquery/view/test/compression/views/tmplTest.tmpl', {message: "Jquery Tmpl"} ))
		})
	 })
