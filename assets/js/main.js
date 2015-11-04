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
	zScroll.init({
		connector: false,
		fill: '#000',
		shape: 'circle',
		size: 'small',
		threshold: 2
	});
});