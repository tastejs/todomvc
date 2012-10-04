// load('jquery/build.js')

load('steal/rhino/rhino.js')

var i, fileName, cmd, 
	plugins = [
	"class" , 
	"controller",
	{
		plugin: "controller/subscribe", 
		exclude: ["jquery/controller/controller.js",
				  "jquery/class/class.js",
				  "jquery/lang/lang.js",
				  "jquery/event/destroyed/destroyed.js",
				  "jquery/controller/controller.js"]},
	"event/default",
	"event/destroyed",
	"event/drag",
	"event/pause",
	"event/resize",
	{
		plugin: "event/drag/limit", 
		exclude: ["jquery/lang/vector/vector.js", "jquery/event/livehack/livehack.js", "jquery/event/drag/drag.js"]},
	{
		plugin: "event/drag/scroll", 
		exclude: ["jquery/dom/within/within.js", "jquery/dom/compare/compare.js", "jquery/event/drop/drop.js","jquery/lang/vector/vector.js", "jquery/event/livehack/livehack.js", "jquery/event/drag/drag.js"]},
	{
		plugin: "event/drop",
		exclude: ["jquery/lang/vector/vector.js", "jquery/event/livehack/livehack.js", "jquery/event/drag/drag.js"]},
	"event/hover",
	"view/ejs", 
	"dom/closest",
	"dom/compare",
	{
		plugin: "dom/dimensions",
		fileName: "jquery.dimensions.etc.js"
	},
	"dom/fixture",
	"dom/form_params",
	"dom/within", 
	"dom/cur_styles",
	"model",
	{
		plugin: "model/backup",
		exclude: ["jquery/class/class.js",
				  "jquery/lang/lang.js",
				  "jquery/event/destroyed/destroyed.js",
				  "jquery/lang/openajax/openajax.js",
				  "jquery/model/model.js"]
	},
	{
		plugin: "model/list",
		exclude: ["jquery/class/class.js",
				  "jquery/lang/lang.js",
				  "jquery/event/destroyed/destroyed.js",
				  "jquery/lang/openajax/openajax.js",
				  "jquery/model/model.js"]
	},
	{
		plugin: "model/list/cookie",
		exclude: ["jquery/class/class.js",
				  "jquery/lang/lang.js",
				  "jquery/event/destroyed/destroyed.js",
				  "jquery/lang/openajax/openajax.js",
				  "jquery/model/model.js",
				  "jquery/model/list/list.js"]
	},
	{
		plugin: "model/list/local",
		exclude: ["jquery/class/class.js",
				  "jquery/lang/lang.js",
				  "jquery/event/destroyed/destroyed.js",
				  "jquery/lang/openajax/openajax.js",
				  "jquery/model/model.js",
				  "jquery/model/list/list.js"]
	},
	{
		plugin: "model/validations",
		exclude: ["jquery/class/class.js",
				  "jquery/lang/lang.js",
				  "jquery/event/destroyed/destroyed.js",
				  "jquery/lang/openajax/openajax.js",
				  "jquery/model/model.js"]
	},
	"view",
	"view/ejs",
	"view/jaml",
	"view/micro",
	"view/tmpl"
]


steal.File('jquery/dist').mkdir();
steal('steal/build/pluginify').then( function(s){
var plugin, exclude, fileDest, fileName;
	for(i=0; i<plugins.length; i++){
		plugin = plugins[i];
		exclude = [];
		fileName = null;
		if (typeof plugin != "string") {
			fileName = plugin.fileName;
			exclude = plugin.exclude || [];
			plugin = plugin.plugin;
		}
		fileName = fileName || "jquery."+plugin.replace(/\//g, ".").replace(/dom\./, "").replace(/\_/, "")+".js";
		fileDest = "jquery/dist/"+fileName
		s.build.pluginify("jquery/"+plugin,{
			nojquery: true,
			out: fileDest,
			exclude: exclude.length? exclude: false
		})
		
		
		var outBaos = new java.io.ByteArrayOutputStream();
		var output = new java.io.PrintStream(outBaos);
		runCommand("java", "-jar", "steal/build/scripts/compiler.jar", "--compilation_level", "SIMPLE_OPTIMIZATIONS", "--warning_level", "QUIET", "--js", fileDest, {
			output: output
		});
		
		var minFileDest = fileDest.replace(".js", ".min.js")
		new steal.File(minFileDest).save(outBaos.toString());
	}
})
/*
for (i = 0; i < plugins.length; i++) {
	plugin = plugins[i];
	exclude = [];
	fileName = null;
	if (typeof plugin != "string") {
		fileName = plugin.fileName;
		exclude = plugin.exclude || [];
		plugin = plugin.plugin;
	}
	fileName = fileName || "jquery." + plugin.replace(/\//g, ".").replace(/dom\./, "").replace(/\_/, "") + ".js";
	fileDest = "jquery/dist/" + fileName
	// compress 
	var outBaos = new java.io.ByteArrayOutputStream();
	var output = new java.io.PrintStream(outBaos);
	runCommand("java", "-jar", "steal/build/scripts/compiler.jar", "--compilation_level", "SIMPLE_OPTIMIZATIONS", "--warning_level", "QUIET", "--js", fileDest, {
		output: output
	});
	
	var minFileDest = fileDest.replace(".js", ".min.js")
	new steal.File(minFileDest).save(outBaos.toString());
	print("***" + fileName + " pluginified and compressed")
}*/
