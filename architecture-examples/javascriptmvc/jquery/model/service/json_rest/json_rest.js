steal.plugins('jquery/model/service').then(function(){

$.Model.service.jsonRest = $.Model.service({
	url : "",
	type : ".json",
	name : "",
	getSingularUrl : function(Class, id){
		return this.singularUrl ?
				this.singularUrl+"/"+id+this.type :
				this.url+this.getName(Class)+"s/"+id+this.type
	},
	getPluralUrl : function(Class, id){
		return this.pluralUrl || this.url+this.getName(Class)+"s"+this.type;
	},
	getName : function(Class){
		return this.name || Class.name
	},
	findAll : function(params){
		var plural = this._service.getPluralUrl(this);
		$.ajax({
            url: plural,
            type: 'get',
            dataType: 'json',
            data: params,
            success: this.callback(['wrapMany',success]),
            error: error,
            fixture: true
        })
	},
	getParams : function(attrs){
		var name = this.getName(this),
			params = {};
		for(var n in attrs){
			params[name+"["+n+"]"] = attrs[n];
		}
		return params;
	},
	update : function( id, attrs, success, error ) {
        var params = this._service.getParams(attrs),
			singular = this._service.getSingularUrl(this, id),
			plural = this._service.getPluralUrl(this),
			self = this;
			
        
            
        $.ajax({
            url: singular,
            type: 'put',
            dataType: 'text',
            data: params,
            complete: function(xhr, status ){
				if (/\w+/.test(xhr.responseText)) {
		            return error( eval('('+xhr.responseText+')') );
		        }
		        success({})
			},
            fixture: "-restUpdate"
            
        })
    },
	destroy : function(id, success, error){
		var singular = this._service.getSingularUrl(this,id);
		$.ajax({
            url: singular,
            type: 'delete',
            dataType: 'text',
            success: success,
            error: error,
            fixture: "-restDestroy"
        })
	},
	create: function( attrs, success, error ) {
		var params = this._service.getParams(attrs),
			plural = this._service.getPluralUrl(this),
			self = this,
			name = this._service.getName(this);
			
		$.ajax({
		    url: plural,
		    type: 'post',
		    dataType: 'text',
		    complete: function(xhr, status){
				if (status != "success") {
					error(xhr, status)
				}
		        if (/\w+/.test(xhr.responseText)) {
		            var res = eval('('+xhr.responseText+')');
					if(res[name]){
						success(res[name]);
						return;
					}
					return error( res );
		        }
		        var loc = xhr.responseText;
			  	try{loc = xhr.getResponseHeader("location");}catch(e){};
		        if (loc) {
					//todo check this with prototype
					var mtcs = loc.match(/\/[^\/]*?(\w+)?$/);
					if(mtcs) return success({id: parseInt(mtcs[1])});
		        }
		        success({});
			},
		    data: params,
		    fixture: "-restCreate"
		})
    }
});

});