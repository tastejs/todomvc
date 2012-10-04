jqueryReadyCodeRun = false
steal("jquery").then(function(){
	$(document).ready(function(){
		jqueryReadyCodeRun = true;
	})
});
