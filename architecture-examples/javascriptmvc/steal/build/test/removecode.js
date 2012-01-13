removeRemoveSteal = function( text ) {
	return String(java.lang.String(text).replaceAll("(?s)\/\/@steal-remove-start(.*?)\/\/@steal-remove-end", "").replaceAll("steal[\n\s\r]*\.[\n\s\r]*dev[\n\s\r]*\.[\n\s\r]*(\w+)[\n\s\r]*\([^\)]*\)", ""))
}
//@steal-remove-start
print(removeRemoveSteal(readFile("steal/compress/test/removecode.js")))
//@steal-remove-end
steal = {
	dev: {
		log: function() {},
		isHappyName: function() {}
	}
}
steal.dev.log()
var foo = bar;