/** CONFIG */
requirejs.config({
	baseUrl: 'assets/js/libs',
	paths: {
		jquery: 'jquery.min',
		zscroll: 'zscroll'
	}
});

/** INITIAL */
require(['jquery', 'zscroll'], function ($, zScroll) {
	zScroll().init(1.7);
});