steal("//steal/build/pluginify/tokens").
	plugins('steal/build').then(function(){

steal.build.parse = function(str){
		//print("Breaking up strs")
		var tokens = str.tokens('=<>!+-*&|/%^', '=<>&|'),
			tokenNum = 0;
			
		var moveNext = function(){
			var next = tokens[tokenNum++];
			if(next){
				//print("Next TOken = "+next.value);
			}
			return next;
		}
		
		return {
			moveNext : moveNext,
			next : function(){
				return tokens[tokenNum];
			},
			until: function(){
				var token, 
					matchCounts = [];
				for(var i =0; i < arguments.length;i++){
					matchCounts[i] =0;
					if(typeof arguments[i] == "string"){
						arguments[i] = [arguments[i]]
					}
				}
				while (token = moveNext() ) {
					for(var i =0; i< arguments.length; i++){
						if( token.type !== "string" && 
							token.value === arguments[i][matchCounts[i]]){
							matchCounts[i] = matchCounts[i]+1;
							if(matchCounts[i] === arguments[i].length){
								return token;
							}
						}else{
							matchCounts[i] = 0;
						}
					}
				}
			}
		}
	};
})