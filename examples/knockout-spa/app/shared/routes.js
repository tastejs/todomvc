define({
	/* TODO: add all client side routes
	 If using HTML5 history (real URLs instead of hashes),
	 remember to modify the server side 404 responder to return index.html  and change response code to 200. */
	/* *
	 *  Notes on routes definitions:
	 *
	 *  order by dictionary
	 *  group by top-level dictionary (1st url path component)
	 *
	 *  mapping:
	 *  '<root-relative url(string|regex string)>': '<page module path>[ page module's corresponding controller name]'
	 *	see https://github.com/flatiron/director#routing-table for full documentation on route string definition
	 *
	 *  notes: 1. controller is optional but most likely needed unless there are no other internal links
	 *  		  (url change but page doesn't) on the page
	 *         2. controller name should be the same as the part of the url after page module path;
	 *            in the rare cases where page module definition has different value than the url path component then
	 *            controller name should match the whole url
	 *
	 * */
	'/': 'app/home/home /',
	'/(active|completed)': 'app/home/home /:filter',

	'/error/:code': 'app/error/error /:code'
});
