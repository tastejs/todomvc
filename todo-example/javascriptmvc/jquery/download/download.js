(function(){
	$.Downloader = {
		dependencies: [],
		pluginData: null,
		ready: function(){
			$.getJSON('../dist/standalone/dependencies.json', 
				function(data){
					$.Downloader.pluginData = data;
				});
			$('#pluginForm').delegate("input[type=checkbox]", "change", 
				$.proxy($.Downloader.changeHandler, $.Downloader));
				
			// append css if necessary
			if(location.search && /csspath/.test(location.search)){
				var path = location.search.split("=")[1];
				var headID = document.getElementsByTagName("head")[0],
					cssNode = document.createElement('link');
				cssNode.type = 'text/css';
				cssNode.rel = 'stylesheet';
				cssNode.href = path;
				cssNode.media = 'screen';
				headID.appendChild(cssNode);
			}
			
			$.Downloader.setupWordbreaks();
		},
		// inject <wbr> characters in labels
		setupWordbreaks: function(){
			var text, newText;
			$(".plugin label").each(function(i){
				text = $(this).text();
				newText = text.replace(/\//g, "<wbr>/")
				$(this).html(newText);
			})
		},
		changeHandler: function(ev){
			var $target = $(ev.target);
			// if they unclicked, ignore it
			if(!$target.attr('checked')) {
				return;
			}
		 	this.dependencies = [];
		 	var $form = $target.closest('form'),
				params = $form.formParams(), i, queryVal;
			for(i=0; i<params.plugins.length; i++){
				this._pushPlugins(this._getDependencies(params.plugins[i]));
			}
			$('#pluginForm input[type=checkbox]').attr('checked', false);
			for(i=0; i<this.dependencies.length; i++){
				queryVal = this.dependencies[i]
					.replace(new RegExp("/", "g"), "\\/")
					.replace(new RegExp("\\.", "g"), "\\.");
				$('input[value='+queryVal+']')
					.attr('checked', true);
			}
		 },
		 /**
		  * Push a list of plugins to the current list.  If there's a duplicate, 
		  * delete the other one first.
		  * @param {Object} dependencies an array of plugins to add to the list
		  */
		 _pushPlugins: function(dependencies){
		 	var dep, i, index;
		 	for(i=0; i<dependencies.length; i++){
				dep = dependencies[i];
				if(!$.inArray(dep, this.dependencies)) {
					this.dependencies.splice(index, 1);
				}
				this.dependencies.push(dep);
			}
		 },
		 /**
		  * Recursively gets the array of dependencies for each plugin
		  * @param {String} name the name of the plugin
		  * @param {Boolean} includeSelf whether it should return with its own 
		  * plugin name included
		  */
		 _getDependencies: function(name){
		 	var dependencies = this.pluginData[name],
				totalDependencies = [],
				lowerDependencies, i, j;
			if(!dependencies.length || 
				(dependencies.length == 1 && dependencies[0] == "jquery/jquery.js")) {
				return [name];
			}
		 	for(i=0; i<dependencies.length; i++){
				lowerDependencies = this._getDependencies(dependencies[i]);
				for (j = 0; j < lowerDependencies.length; j++) {
					// TODO if you find a duplicate, remove the other one first
					totalDependencies.push(lowerDependencies[j])
				}
			}
			totalDependencies.push(name)
			return totalDependencies;
		 }
	};
	$(document).ready($.Downloader.ready);
	$("a.down",top.document.documentElement).click(function(ev){
		ev.preventDefault();
		$('form')[0].submit();
	})
})()