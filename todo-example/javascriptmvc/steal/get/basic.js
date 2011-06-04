steal(function(s){

/**
 * A basic getter
 * @param {Object} content
 * @param {Object} rawUrl
 * @param {Object} originalUrl
 */
steal.get.basic = {
	ls: function(content, rawUrl, originalUrl){
		var data = {};
		content.replace(/href\s*=\s*\"*([^\">]*)/ig, function(whole, link){
			if (!/svnindex.xsl$/.test(link) && !/^(\w*:|)\/\//.test(link) && !/^\./.test(link) ) {
				data[link] = originalUrl + link
			}
		})
		return data;
		
	},
	// return the 'raw' place to either get folder's contents, or download file ...
	raw: function(url){
		return url;
	}
}

});