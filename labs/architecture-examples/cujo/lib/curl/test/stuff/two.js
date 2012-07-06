/*
 * stuff/two depends on stuff/one
 */
define(['./one'], function (one) {
	return one + 1;
});
