steal.map({
	foo: 'steal/test/map/foo', 
	remotejquery: 'http://javascriptmvc.com/jquery'//,
	//'thing/bed' : '/abc/bed'
})
.map('foo','steal/test/map/foo')
.then('foo',
	'foo/another',
	'jquery/view/ejs',
	'remotejquery/lang',
	'foo/second')
	.then('//remotejquery/lang/rsplit/rsplit')
	.then(function(){
		$(document.body).append('//foo/template', {})
	})
