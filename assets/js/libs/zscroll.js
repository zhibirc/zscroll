/**
 *	@file AMD module which realizes the Full Screen Vertical Scroller
 *	@copyright Yaroslav Surilov 2014-2015
 */
define(['jquery'], function ($) {
	'use strict';
	
	var zScroll = (function () {
        var doc = document,
			body = doc.body,
            docRoot = document.documentElement,
            userViewportH = Math.max(docRoot.clientHeight, window.innerHeight || 0),
            pageHeight = Math.max(docRoot.clientHeight, docRoot.scrollHeight),
            scrollTop = window.pageYOffset || docRoot.scrollTop || body.scrollTop,
            clientTop = docRoot.clientTop || body.clientTop || 0,
            scrollAreas = doc.querySelectorAll('.z-scroll'),
            _accessories;

        _accessories = {
            iterateAreas: function (fn) {
                for (var i = 0, l = scrollAreas.length; i < l; i += 1) {
                    (function (idx) { fn.call(null, idx) && (i = Infinity); }(i));
                }
            },
            getOffsetTop: function (elem) {
                var top = 0;
				
                if (elem.getBoundingClientRect) {
                    top = elem.getBoundingClientRect().top + scrollTop - clientTop;
                } else {
                    while (elem) {
                        top += parseFloat(elem.offsetTop);
                        elem = elem.offsetParent;
                    }
                }
                return Math.round(top);
            },
			validateOpts: function (opts, amount) {
				if (amount > 1 || (amount && !Object.isObject(opts))) {
					throw new Error('zScroll initialization: incorrect syntax, see documentation for details.');
				}
				
				// If no options (opts === undefined) set to empty object.
				opts = opts || {};
				
				// Here are default values for absent options.
				return {
					connector: !!opts.connector,
					fill: opts.fill || '#000',
					shape: opts.shape || 'circle',
					size: opts.size || 'small',
					threshold: opts.threshold || 2
				};
			},
			render: function (opts) {
				var bullets, paginator, styleClasses;
				
				bullets = Array(scrollAreas.length + 1).join('<b></b>');
				
				styleClasses = [opts.shape, opts.size].join(' ');
				doc.getElementsByTagName('head')[0].insertAdjacentHTML('beforeEnd', '<style>#paginator b { background: ' + opts.fill + '; }</style');
                body.insertAdjacentHTML('beforeEnd', '<div id="paginator" class="' + styleClasses + '">' + bullets + '</div>');
				
				paginator = doc.getElementById('paginator');
				
				paginator.style.marginTop = -parseFloat(getComputedStyle(paginator).height) / 2 + 'px';
                bullets = doc.querySelectorAll('#paginator b');
                bullets[0].classList.add('active-screen');
				
				return {
					bullets: bullets,
					paginator: paginator
				};
			}
        };

        /**
		 *	Public API.
		 *	@public
		 */
        return {
            /**
             * Scroller initialization.
             * @param {Object} options
             */
            init: function (opts) {
				var bullets, renderInfo;
				
				opts = _accessories.validateOpts(opts, arguments.length);
				renderInfo = _accessories.render(opts);

				renderInfo.paginator.addEventListener('click', function (e) {
					var targetBullet = e.target,
						bulletIdx = Array.prototype.indexOf.call(renderInfo.bullets, targetBullet);
					
					e.stopPropagation();
					
					if (targetBullet.classList.contains('active-screen')) {
						return false;
                    }
					
					if ($) {
						$('html, body').animate({ scrollTop: bulletIdx === 0 ? 0 : $('.z-scroll').eq(bulletIdx).offset().top * .95 }, 1e3);
					} else {
						doc.querySelectorAll('.z-scroll')[bulletIdx].scrollIntoView();
					}
				}, false);

                window.addEventListener('scroll', function () {
                    [].forEach.call(renderInfo.bullets, function (elem, idx, arr) {
                        var currentSectionOffset = _accessories.getOffsetTop(doc.querySelectorAll('.z-scroll')[idx]);
						
                        if (currentSectionOffset > (scrollTop * opts.threshold) && currentSectionOffset < (scrollTop + userViewportH) / opts.threshold) {
                            [].forEach.call(arr, function (elem) {
                                elem.classList.remove('active-screen');
                            });
							
                            elem.classList.add('active-screen');
                        }
                    });
                }, false);
            }
        };
    }());

    return zScroll;
});