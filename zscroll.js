define(['jquery'], function ($) {
    'use strict';

    var zScroll = function () {
        var body = document.body,
            docElem = document.documentElement,
            userViewportH = Math.max(docElem.clientHeight, window.innerHeight || 0),
            pageHeight = Math.max(docElem.clientHeight, docElem.scrollHeight),
            scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop,
            clientTop = docElem.clientTop || body.clientTop || 0,
            scrollAreas = document.querySelectorAll('.z-scroll'),
            __accessories;

        /**
         * Complex event installer on DOM elements.
         *
         * @param {Object[]} elems - Array of elements to attach event handlers.
         * @param {Object} actions - Set of pairs "event: callback" for event handlers applying.
         */
        function addHandler(elems, actions) {
            var errors = ['Wrong invocation! Properly syntax: addHandler([element_0, ..., element_N], { event_0: callback_0, ..., event_N: callback_N})'],
                elem;

            if (arguments.length != 2 || !Array.isArray(elems) || !(actions instanceof Object)) {
                if (typeof console != 'undefined' && typeof console.warn != 'undefined') {
                    console.warn(errors[0]);
                }
                return 0;
            }

            for (var i = elems.length; i--;) {
                elem = elems[i];
                for (var event in actions) {
                    if (actions.hasOwnProperty(event)) {
                        if (elem.addEventListener) {
                            elem.addEventListener(event, actions[event], false);
                        } else if (elem.attachEvent) {
                            elem.attachEvent('on' + event, function() { actions[event].call(elem); });
                        } else {
                            elem['on' + event] = actions[event];
                        }
                    }
                }
            }
        }

        __accessories = {
            iterateAreas: function (fn) {
                for (var i = 0; i < scrollAreas.length; i += 1) {
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

        /** Public API. */
        return {
            /**
             * Scroller initialization.
             *
             * @param {Number} threshold
             */
            init: function (threshold) {
                threshold = threshold || 1;
                var bullets = Array(scrollAreas.length + 1).join('<b></b>');
                body.insertAdjacentHTML('beforeEnd', '<div id="paginator">' + bullets + '</div>');
                bullets = document.querySelectorAll('#paginator b');
                bullets[0].classList.add('active-screen');

                //__accessories.iterateAreas(function (idx) {
                //    var offset = __accessories.getOffsetTop(scrollAreas[idx]);
                //    //if (offset > (scrollTop * threshold) && offset < (scrollTop + userViewportH) / threshold) {
                //    if (offset > scrollTop && offset < (scrollTop + userViewportH)) {
                //        document.querySelectorAll('#paginator b')[idx].classList.add('active-screen');
                //        return true;
                //    }
                //});

                [].forEach.call(bullets, function (elem, idx) {
                    addHandler([elem], { 'click': function () {
                        if (this.classList.contains('active-screen')) {
                            return false;
                        }
                        if ($) {
                            $('html, body').animate({ scrollTop: idx === 0 ? 0 : $('.z-scroll').eq(idx).offset().top * 0.95 }, 1000);
                        } else {
                            document.querySelectorAll('.z-scroll')[idx].scrollIntoView();
                        }
                    }});
                });

                addHandler([window], { 'scroll': function () {
                    [].forEach.call(bullets, function (elem, idx) {
                        var currentSectionOffset = __accessories.getOffsetTop(document.querySelectorAll('.z-scroll')[idx]);
                        if (currentSectionOffset > (scrollTop * threshold) && currentSectionOffset < (scrollTop + userViewportH) / threshold) {
                            [].forEach.call(bullets, function (elem) {
                                elem.classList.remove('active-screen');
                            });
                            bullets[idx].classList.add('active-screen');
                        }
                    });
                }});
            }
        };
    };

    return zScroll;
});