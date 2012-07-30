steal('jquery/controller', 'steal/less').then(function(){
	
    $.Controller.extend('Myapp.App', 
    {}, 
    {       
        init: function() { 
//            console.log("im ready")
        }
    });
})
.then(function($) {
    $(document).ready(function() {
        $(document.body).myapp_app();
    });    
})
.then('./another.js')