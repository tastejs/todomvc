ORDER.push(1)
steal('./file2.js').then(function(){
	ORDER.push("then1")
})
