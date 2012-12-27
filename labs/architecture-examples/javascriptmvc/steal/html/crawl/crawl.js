steal('steal/html', function(){

var queue = [],
	found = {},
	pageData,
	s = steal,
	getDocType  = function(url){
		var content;
		if(s.File(url).domain() === null){
			content = readFile(s.File(url).clean());
		} else {
			content = readUrl(url);
		}
		var docTypes = content.match( /<!doctype[^>]+>/i );
		return docTypes ? docTypes[0] : "";
	};
/**
 * @function steal.html.crawl
 * @parent steal.html
 * Loads an ajax driven page and generates the html for google to crawl. Check out the [ajaxy tutorial] 
 * for a more complete walkthrough.
 * 
 * This crawler indexes an entire Ajax site.  It
 * 
 *   1. Opens a page in a headless browser.
 *   2. Waits until its content is ready.
 *   3. Scrapes its contents.
 *   4. Writes the contents to a file.
 *   5. Adds any links in the page that start with #! to be indexed
 *   6. Changes <code>window.location.hash</code> to the next index-able page
 *   7. Goto #2 and repeats until all pages have been loaded
 * 
 * ## 2. Wait until content is ready.
 * 
 * By default, [steal.html] will just wait until all scripts have finished loading
 * before scraping the page's contents.  To delay this, use
 * [steal.html.delay] and [steal.html.ready].
 * 
 * ## 3. Write the contents to a file.
 *  
 * You can change where the contents of the file are writen to by changing
 * the second parameter passed to <code>crawl</code>.
 * 
 * By default uses EnvJS, but you can use PhantomJS for more advanced pages:

@codestart
steal('steal/html', function(){
	steal.html.crawl("ajaxy/ajaxy.html", 
	{
		out: 'ajaxy/out',
		browser: 'phantomjs'
	})
})
@codeend
 * 
 * @param {Object} url the starting page to crawl
 * @param {String|Object} opts the location to put the crawled content.
 */
steal.html.crawl = function(url, opts){
	if(typeof opts == 'string'){
		opts = {out: opts}
	}
	var browserType = opts.browser || 'envjs';
	s.File(opts.out).mkdirs();
	
	s.html.load(url, browserType, function(hash){
		var docType = getDocType(url),
			data = s.html.crawl.getPageData(this),
			total = docType+"\n<html lang='en'>\n"+data.html+"\n</html>";
		// print(" HTML: "+total)
		// add this url to cache so it doesn't generate twice
		hash = hash.substr(2);
		found[hash] = true;
		print("  > "+ opts.out+"/"+hash+".html")
		// write out the page
		var outf = s.File(opts.out+"/"+hash+".html");
		s.File(outf.dir()).mkdirs();
		outf.save(total);
		
		var next = s.html.crawl.addLinks();
		

		if(next){
			
			// print("  "+next)
			// get the next link
			this.evaluate(function(nextHash){
				window.location.hash = nextHash;
			}, next);
		}
		else {
			this.close()
		}
	})
}

steal.extend(steal.html.crawl, {
	getLinks: function(){
		return pageData.urls;
	},
	getPageData : function(browser){
		pageData = browser.evaluate(function(){
			var getHash = function(href){
				var index = href.indexOf("#!");
				if(index > -1){
					return href.substr(index+1);
				}
			};
			var links = document.getElementsByTagName('a'),
				urls = [],
				hash;
			for(var i=0; i < links.length; i++){
				hash = getHash(links[i].href);
				if( hash ){
					urls.push( hash );
				}
			}
			var html = document.documentElement.innerHTML;
			return {
				urls: urls, 
				html: html
			};
		});
		return pageData;
	},
	addLinks : function(){
		var links = this.getLinks(),
			link;
		// add links that haven't already been added
		for(var i=0; i < links.length; i++){
			link = links[i];
			if(! found[link] ) {
				found[link] = true;
				queue.push( link );
			}
		}
		return queue.shift();
	}
})
// load a page, get its content, 
// find all #! links

// recurse

	
})
