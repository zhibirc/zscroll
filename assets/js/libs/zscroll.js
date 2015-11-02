define(['jquery'], function ($) { 'use strict';
	var zScroll = (function () {
        var doc = document,
			body = doc.body,
            docRoot = document.documentElement,
            userViewportH = Math.max(docRoot.clientHeight, window.innerHeight || 0),
            pageHeight = Math.max(docRoot.clientHeight, docRoot.scrollHeight),
            scrollTop = window.pageYOffset || docRoot.scrollTop || body.scrollTop,
            clientTop = docRoot.clientTop || body.clientTop || 0,
            scrollAreas = doc.querySelectorAll('.z-scroll'),
            __accessories;

        __accessories = {
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
            }
        };
		
		function validateOpts(opts, amount) {
			if (amount > 1 || (amount && Object.prototype.toString.call(opts).slice(8, -1) !== 'Object')) {
				throw new Error('zScroll initialization: incorrect syntax, see documentation for details.');
			}
			
			return {
				fill: opts.fill || '#000',
				shape: opts.shape || 'circle',
				size: opts.size || 'small',
				threshold: opts.threshold || 2
			};
		}

        /** Public API. */
        return {
            /**
             * Scroller initialization.
             * @param {Object} options
             */
            init: function (opts) {
				var bullets;
				
				opts = validateOpts(opts, arguments.length);
				
                bullets = Array(scrollAreas.length + 1).join('<b></b>');
                
                body.insertAdjacentHTML('beforeEnd', '<div id="paginator">' + bullets + '</div>');
                bullets = doc.querySelectorAll('#paginator b');
                bullets[0].classList.add('active-screen');

				doc.getElementById('paginator').addEventListener('click', function (e) {
					var targetBullet = e.target,
						bulletIdx = Array.prototype.indexOf.call(e.currentTarget.children, targetBullet);
					
					e.stopPropagation();
					
					if (targetBullet.classList.contains('active-screen')) {
						return false;
                    }
					
					if ($) {
						$('html, body').animate({ scrollTop: bulletIdx === 0 ? 0 : $('.z-scroll').eq(bulletIdx).offset().top * 0.95 }, 1000);
					} else {
						doc.querySelectorAll('.z-scroll')[bulletIdx].scrollIntoView();
					}
				}, false);

                window.addEventListener('scroll', function () {
                    [].forEach.call(bullets, function (elem, idx) {
                        var currentSectionOffset = __accessories.getOffsetTop(doc.querySelectorAll('.z-scroll')[idx]);
						
                        if (currentSectionOffset > (scrollTop * opts.threshold) && currentSectionOffset < (scrollTop + userViewportH) / opts.threshold) {
                            [].forEach.call(bullets, function (elem) {
                                elem.classList.remove('active-screen');
                            });
							
                            bullets[idx].classList.add('active-screen');
                        }
                    });
                }, false);
            }
        };
    }());

    return zScroll;
});