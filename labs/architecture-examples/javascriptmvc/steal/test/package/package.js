steal.loading('steal/test/package/1.js','steal/test/package/0.js','steal/test/package/2.js');
steal("./0.js").then(function(){
	packagesStolen.push("1");
},"./2.js");
;
steal.loaded('steal/test/package/1.js');
steal(function(){
	packagesStolen = ["0"]
});
steal.loaded('steal/test/package/0.js');
packagesStolen.push("2");;
steal.loaded('steal/test/package/2.js');