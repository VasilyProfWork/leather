(() => {
    var __webpack_modules__ = {
        90: module => {
            (function(window, factory) {
                var lazySizes = factory(window, window.document, Date);
                window.lazySizes = lazySizes;
                if (true && module.exports) module.exports = lazySizes;
            })("undefined" != typeof window ? window : {}, (function l(window, document, Date) {
                "use strict";
                var lazysizes, lazySizesCfg;
                (function() {
                    var prop;
                    var lazySizesDefaults = {
                        lazyClass: "lazyload",
                        loadedClass: "lazyloaded",
                        loadingClass: "lazyloading",
                        preloadClass: "lazypreload",
                        errorClass: "lazyerror",
                        autosizesClass: "lazyautosizes",
                        fastLoadedClass: "ls-is-cached",
                        iframeLoadMode: 0,
                        srcAttr: "data-src",
                        srcsetAttr: "data-srcset",
                        sizesAttr: "data-sizes",
                        minSize: 40,
                        customMedia: {},
                        init: true,
                        expFactor: 1.5,
                        hFac: .8,
                        loadMode: 2,
                        loadHidden: true,
                        ricTimeout: 0,
                        throttleDelay: 125
                    };
                    lazySizesCfg = window.lazySizesConfig || window.lazysizesConfig || {};
                    for (prop in lazySizesDefaults) if (!(prop in lazySizesCfg)) lazySizesCfg[prop] = lazySizesDefaults[prop];
                })();
                if (!document || !document.getElementsByClassName) return {
                    init: function() {},
                    cfg: lazySizesCfg,
                    noSupport: true
                };
                var docElem = document.documentElement;
                var supportPicture = window.HTMLPictureElement;
                var _addEventListener = "addEventListener";
                var _getAttribute = "getAttribute";
                var addEventListener = window[_addEventListener].bind(window);
                var setTimeout = window.setTimeout;
                var requestAnimationFrame = window.requestAnimationFrame || setTimeout;
                var requestIdleCallback = window.requestIdleCallback;
                var regPicture = /^picture$/i;
                var loadEvents = [ "load", "error", "lazyincluded", "_lazyloaded" ];
                var regClassCache = {};
                var forEach = Array.prototype.forEach;
                var hasClass = function(ele, cls) {
                    if (!regClassCache[cls]) regClassCache[cls] = new RegExp("(\\s|^)" + cls + "(\\s|$)");
                    return regClassCache[cls].test(ele[_getAttribute]("class") || "") && regClassCache[cls];
                };
                var addClass = function(ele, cls) {
                    if (!hasClass(ele, cls)) ele.setAttribute("class", (ele[_getAttribute]("class") || "").trim() + " " + cls);
                };
                var removeClass = function(ele, cls) {
                    var reg;
                    if (reg = hasClass(ele, cls)) ele.setAttribute("class", (ele[_getAttribute]("class") || "").replace(reg, " "));
                };
                var addRemoveLoadEvents = function(dom, fn, add) {
                    var action = add ? _addEventListener : "removeEventListener";
                    if (add) addRemoveLoadEvents(dom, fn);
                    loadEvents.forEach((function(evt) {
                        dom[action](evt, fn);
                    }));
                };
                var triggerEvent = function(elem, name, detail, noBubbles, noCancelable) {
                    var event = document.createEvent("Event");
                    if (!detail) detail = {};
                    detail.instance = lazysizes;
                    event.initEvent(name, !noBubbles, !noCancelable);
                    event.detail = detail;
                    elem.dispatchEvent(event);
                    return event;
                };
                var updatePolyfill = function(el, full) {
                    var polyfill;
                    if (!supportPicture && (polyfill = window.picturefill || lazySizesCfg.pf)) {
                        if (full && full.src && !el[_getAttribute]("srcset")) el.setAttribute("srcset", full.src);
                        polyfill({
                            reevaluate: true,
                            elements: [ el ]
                        });
                    } else if (full && full.src) el.src = full.src;
                };
                var getCSS = function(elem, style) {
                    return (getComputedStyle(elem, null) || {})[style];
                };
                var getWidth = function(elem, parent, width) {
                    width = width || elem.offsetWidth;
                    while (width < lazySizesCfg.minSize && parent && !elem._lazysizesWidth) {
                        width = parent.offsetWidth;
                        parent = parent.parentNode;
                    }
                    return width;
                };
                var rAF = function() {
                    var running, waiting;
                    var firstFns = [];
                    var secondFns = [];
                    var fns = firstFns;
                    var run = function() {
                        var runFns = fns;
                        fns = firstFns.length ? secondFns : firstFns;
                        running = true;
                        waiting = false;
                        while (runFns.length) runFns.shift()();
                        running = false;
                    };
                    var rafBatch = function(fn, queue) {
                        if (running && !queue) fn.apply(this, arguments); else {
                            fns.push(fn);
                            if (!waiting) {
                                waiting = true;
                                (document.hidden ? setTimeout : requestAnimationFrame)(run);
                            }
                        }
                    };
                    rafBatch._lsFlush = run;
                    return rafBatch;
                }();
                var rAFIt = function(fn, simple) {
                    return simple ? function() {
                        rAF(fn);
                    } : function() {
                        var that = this;
                        var args = arguments;
                        rAF((function() {
                            fn.apply(that, args);
                        }));
                    };
                };
                var throttle = function(fn) {
                    var running;
                    var lastTime = 0;
                    var gDelay = lazySizesCfg.throttleDelay;
                    var rICTimeout = lazySizesCfg.ricTimeout;
                    var run = function() {
                        running = false;
                        lastTime = Date.now();
                        fn();
                    };
                    var idleCallback = requestIdleCallback && rICTimeout > 49 ? function() {
                        requestIdleCallback(run, {
                            timeout: rICTimeout
                        });
                        if (rICTimeout !== lazySizesCfg.ricTimeout) rICTimeout = lazySizesCfg.ricTimeout;
                    } : rAFIt((function() {
                        setTimeout(run);
                    }), true);
                    return function(isPriority) {
                        var delay;
                        if (isPriority = true === isPriority) rICTimeout = 33;
                        if (running) return;
                        running = true;
                        delay = gDelay - (Date.now() - lastTime);
                        if (delay < 0) delay = 0;
                        if (isPriority || delay < 9) idleCallback(); else setTimeout(idleCallback, delay);
                    };
                };
                var debounce = function(func) {
                    var timeout, timestamp;
                    var wait = 99;
                    var run = function() {
                        timeout = null;
                        func();
                    };
                    var later = function() {
                        var last = Date.now() - timestamp;
                        if (last < wait) setTimeout(later, wait - last); else (requestIdleCallback || run)(run);
                    };
                    return function() {
                        timestamp = Date.now();
                        if (!timeout) timeout = setTimeout(later, wait);
                    };
                };
                var loader = function() {
                    var preloadElems, isCompleted, resetPreloadingTimer, loadMode, started;
                    var eLvW, elvH, eLtop, eLleft, eLright, eLbottom, isBodyHidden;
                    var regImg = /^img$/i;
                    var regIframe = /^iframe$/i;
                    var supportScroll = "onscroll" in window && !/(gle|ing)bot/.test(navigator.userAgent);
                    var shrinkExpand = 0;
                    var currentExpand = 0;
                    var isLoading = 0;
                    var lowRuns = -1;
                    var resetPreloading = function(e) {
                        isLoading--;
                        if (!e || isLoading < 0 || !e.target) isLoading = 0;
                    };
                    var isVisible = function(elem) {
                        if (null == isBodyHidden) isBodyHidden = "hidden" == getCSS(document.body, "visibility");
                        return isBodyHidden || !("hidden" == getCSS(elem.parentNode, "visibility") && "hidden" == getCSS(elem, "visibility"));
                    };
                    var isNestedVisible = function(elem, elemExpand) {
                        var outerRect;
                        var parent = elem;
                        var visible = isVisible(elem);
                        eLtop -= elemExpand;
                        eLbottom += elemExpand;
                        eLleft -= elemExpand;
                        eLright += elemExpand;
                        while (visible && (parent = parent.offsetParent) && parent != document.body && parent != docElem) {
                            visible = (getCSS(parent, "opacity") || 1) > 0;
                            if (visible && "visible" != getCSS(parent, "overflow")) {
                                outerRect = parent.getBoundingClientRect();
                                visible = eLright > outerRect.left && eLleft < outerRect.right && eLbottom > outerRect.top - 1 && eLtop < outerRect.bottom + 1;
                            }
                        }
                        return visible;
                    };
                    var checkElements = function() {
                        var eLlen, i, rect, autoLoadElem, loadedSomething, elemExpand, elemNegativeExpand, elemExpandVal, beforeExpandVal, defaultExpand, preloadExpand, hFac;
                        var lazyloadElems = lazysizes.elements;
                        if ((loadMode = lazySizesCfg.loadMode) && isLoading < 8 && (eLlen = lazyloadElems.length)) {
                            i = 0;
                            lowRuns++;
                            for (;i < eLlen; i++) {
                                if (!lazyloadElems[i] || lazyloadElems[i]._lazyRace) continue;
                                if (!supportScroll || lazysizes.prematureUnveil && lazysizes.prematureUnveil(lazyloadElems[i])) {
                                    unveilElement(lazyloadElems[i]);
                                    continue;
                                }
                                if (!(elemExpandVal = lazyloadElems[i][_getAttribute]("data-expand")) || !(elemExpand = 1 * elemExpandVal)) elemExpand = currentExpand;
                                if (!defaultExpand) {
                                    defaultExpand = !lazySizesCfg.expand || lazySizesCfg.expand < 1 ? docElem.clientHeight > 500 && docElem.clientWidth > 500 ? 500 : 370 : lazySizesCfg.expand;
                                    lazysizes._defEx = defaultExpand;
                                    preloadExpand = defaultExpand * lazySizesCfg.expFactor;
                                    hFac = lazySizesCfg.hFac;
                                    isBodyHidden = null;
                                    if (currentExpand < preloadExpand && isLoading < 1 && lowRuns > 2 && loadMode > 2 && !document.hidden) {
                                        currentExpand = preloadExpand;
                                        lowRuns = 0;
                                    } else if (loadMode > 1 && lowRuns > 1 && isLoading < 6) currentExpand = defaultExpand; else currentExpand = shrinkExpand;
                                }
                                if (beforeExpandVal !== elemExpand) {
                                    eLvW = innerWidth + elemExpand * hFac;
                                    elvH = innerHeight + elemExpand;
                                    elemNegativeExpand = -1 * elemExpand;
                                    beforeExpandVal = elemExpand;
                                }
                                rect = lazyloadElems[i].getBoundingClientRect();
                                if ((eLbottom = rect.bottom) >= elemNegativeExpand && (eLtop = rect.top) <= elvH && (eLright = rect.right) >= elemNegativeExpand * hFac && (eLleft = rect.left) <= eLvW && (eLbottom || eLright || eLleft || eLtop) && (lazySizesCfg.loadHidden || isVisible(lazyloadElems[i])) && (isCompleted && isLoading < 3 && !elemExpandVal && (loadMode < 3 || lowRuns < 4) || isNestedVisible(lazyloadElems[i], elemExpand))) {
                                    unveilElement(lazyloadElems[i]);
                                    loadedSomething = true;
                                    if (isLoading > 9) break;
                                } else if (!loadedSomething && isCompleted && !autoLoadElem && isLoading < 4 && lowRuns < 4 && loadMode > 2 && (preloadElems[0] || lazySizesCfg.preloadAfterLoad) && (preloadElems[0] || !elemExpandVal && (eLbottom || eLright || eLleft || eLtop || "auto" != lazyloadElems[i][_getAttribute](lazySizesCfg.sizesAttr)))) autoLoadElem = preloadElems[0] || lazyloadElems[i];
                            }
                            if (autoLoadElem && !loadedSomething) unveilElement(autoLoadElem);
                        }
                    };
                    var throttledCheckElements = throttle(checkElements);
                    var switchLoadingClass = function(e) {
                        var elem = e.target;
                        if (elem._lazyCache) {
                            delete elem._lazyCache;
                            return;
                        }
                        resetPreloading(e);
                        addClass(elem, lazySizesCfg.loadedClass);
                        removeClass(elem, lazySizesCfg.loadingClass);
                        addRemoveLoadEvents(elem, rafSwitchLoadingClass);
                        triggerEvent(elem, "lazyloaded");
                    };
                    var rafedSwitchLoadingClass = rAFIt(switchLoadingClass);
                    var rafSwitchLoadingClass = function(e) {
                        rafedSwitchLoadingClass({
                            target: e.target
                        });
                    };
                    var changeIframeSrc = function(elem, src) {
                        var loadMode = elem.getAttribute("data-load-mode") || lazySizesCfg.iframeLoadMode;
                        if (0 == loadMode) elem.contentWindow.location.replace(src); else if (1 == loadMode) elem.src = src;
                    };
                    var handleSources = function(source) {
                        var customMedia;
                        var sourceSrcset = source[_getAttribute](lazySizesCfg.srcsetAttr);
                        if (customMedia = lazySizesCfg.customMedia[source[_getAttribute]("data-media") || source[_getAttribute]("media")]) source.setAttribute("media", customMedia);
                        if (sourceSrcset) source.setAttribute("srcset", sourceSrcset);
                    };
                    var lazyUnveil = rAFIt((function(elem, detail, isAuto, sizes, isImg) {
                        var src, srcset, parent, isPicture, event, firesLoad;
                        if (!(event = triggerEvent(elem, "lazybeforeunveil", detail)).defaultPrevented) {
                            if (sizes) if (isAuto) addClass(elem, lazySizesCfg.autosizesClass); else elem.setAttribute("sizes", sizes);
                            srcset = elem[_getAttribute](lazySizesCfg.srcsetAttr);
                            src = elem[_getAttribute](lazySizesCfg.srcAttr);
                            if (isImg) {
                                parent = elem.parentNode;
                                isPicture = parent && regPicture.test(parent.nodeName || "");
                            }
                            firesLoad = detail.firesLoad || "src" in elem && (srcset || src || isPicture);
                            event = {
                                target: elem
                            };
                            addClass(elem, lazySizesCfg.loadingClass);
                            if (firesLoad) {
                                clearTimeout(resetPreloadingTimer);
                                resetPreloadingTimer = setTimeout(resetPreloading, 2500);
                                addRemoveLoadEvents(elem, rafSwitchLoadingClass, true);
                            }
                            if (isPicture) forEach.call(parent.getElementsByTagName("source"), handleSources);
                            if (srcset) elem.setAttribute("srcset", srcset); else if (src && !isPicture) if (regIframe.test(elem.nodeName)) changeIframeSrc(elem, src); else elem.src = src;
                            if (isImg && (srcset || isPicture)) updatePolyfill(elem, {
                                src
                            });
                        }
                        if (elem._lazyRace) delete elem._lazyRace;
                        removeClass(elem, lazySizesCfg.lazyClass);
                        rAF((function() {
                            var isLoaded = elem.complete && elem.naturalWidth > 1;
                            if (!firesLoad || isLoaded) {
                                if (isLoaded) addClass(elem, lazySizesCfg.fastLoadedClass);
                                switchLoadingClass(event);
                                elem._lazyCache = true;
                                setTimeout((function() {
                                    if ("_lazyCache" in elem) delete elem._lazyCache;
                                }), 9);
                            }
                            if ("lazy" == elem.loading) isLoading--;
                        }), true);
                    }));
                    var unveilElement = function(elem) {
                        if (elem._lazyRace) return;
                        var detail;
                        var isImg = regImg.test(elem.nodeName);
                        var sizes = isImg && (elem[_getAttribute](lazySizesCfg.sizesAttr) || elem[_getAttribute]("sizes"));
                        var isAuto = "auto" == sizes;
                        if ((isAuto || !isCompleted) && isImg && (elem[_getAttribute]("src") || elem.srcset) && !elem.complete && !hasClass(elem, lazySizesCfg.errorClass) && hasClass(elem, lazySizesCfg.lazyClass)) return;
                        detail = triggerEvent(elem, "lazyunveilread").detail;
                        if (isAuto) autoSizer.updateElem(elem, true, elem.offsetWidth);
                        elem._lazyRace = true;
                        isLoading++;
                        lazyUnveil(elem, detail, isAuto, sizes, isImg);
                    };
                    var afterScroll = debounce((function() {
                        lazySizesCfg.loadMode = 3;
                        throttledCheckElements();
                    }));
                    var altLoadmodeScrollListner = function() {
                        if (3 == lazySizesCfg.loadMode) lazySizesCfg.loadMode = 2;
                        afterScroll();
                    };
                    var onload = function() {
                        if (isCompleted) return;
                        if (Date.now() - started < 999) {
                            setTimeout(onload, 999);
                            return;
                        }
                        isCompleted = true;
                        lazySizesCfg.loadMode = 3;
                        throttledCheckElements();
                        addEventListener("scroll", altLoadmodeScrollListner, true);
                    };
                    return {
                        _: function() {
                            started = Date.now();
                            lazysizes.elements = document.getElementsByClassName(lazySizesCfg.lazyClass);
                            preloadElems = document.getElementsByClassName(lazySizesCfg.lazyClass + " " + lazySizesCfg.preloadClass);
                            addEventListener("scroll", throttledCheckElements, true);
                            addEventListener("resize", throttledCheckElements, true);
                            addEventListener("pageshow", (function(e) {
                                if (e.persisted) {
                                    var loadingElements = document.querySelectorAll("." + lazySizesCfg.loadingClass);
                                    if (loadingElements.length && loadingElements.forEach) requestAnimationFrame((function() {
                                        loadingElements.forEach((function(img) {
                                            if (img.complete) unveilElement(img);
                                        }));
                                    }));
                                }
                            }));
                            if (window.MutationObserver) new MutationObserver(throttledCheckElements).observe(docElem, {
                                childList: true,
                                subtree: true,
                                attributes: true
                            }); else {
                                docElem[_addEventListener]("DOMNodeInserted", throttledCheckElements, true);
                                docElem[_addEventListener]("DOMAttrModified", throttledCheckElements, true);
                                setInterval(throttledCheckElements, 999);
                            }
                            addEventListener("hashchange", throttledCheckElements, true);
                            [ "focus", "mouseover", "click", "load", "transitionend", "animationend" ].forEach((function(name) {
                                document[_addEventListener](name, throttledCheckElements, true);
                            }));
                            if (/d$|^c/.test(document.readyState)) onload(); else {
                                addEventListener("load", onload);
                                document[_addEventListener]("DOMContentLoaded", throttledCheckElements);
                                setTimeout(onload, 2e4);
                            }
                            if (lazysizes.elements.length) {
                                checkElements();
                                rAF._lsFlush();
                            } else throttledCheckElements();
                        },
                        checkElems: throttledCheckElements,
                        unveil: unveilElement,
                        _aLSL: altLoadmodeScrollListner
                    };
                }();
                var autoSizer = function() {
                    var autosizesElems;
                    var sizeElement = rAFIt((function(elem, parent, event, width) {
                        var sources, i, len;
                        elem._lazysizesWidth = width;
                        width += "px";
                        elem.setAttribute("sizes", width);
                        if (regPicture.test(parent.nodeName || "")) {
                            sources = parent.getElementsByTagName("source");
                            for (i = 0, len = sources.length; i < len; i++) sources[i].setAttribute("sizes", width);
                        }
                        if (!event.detail.dataAttr) updatePolyfill(elem, event.detail);
                    }));
                    var getSizeElement = function(elem, dataAttr, width) {
                        var event;
                        var parent = elem.parentNode;
                        if (parent) {
                            width = getWidth(elem, parent, width);
                            event = triggerEvent(elem, "lazybeforesizes", {
                                width,
                                dataAttr: !!dataAttr
                            });
                            if (!event.defaultPrevented) {
                                width = event.detail.width;
                                if (width && width !== elem._lazysizesWidth) sizeElement(elem, parent, event, width);
                            }
                        }
                    };
                    var updateElementsSizes = function() {
                        var i;
                        var len = autosizesElems.length;
                        if (len) {
                            i = 0;
                            for (;i < len; i++) getSizeElement(autosizesElems[i]);
                        }
                    };
                    var debouncedUpdateElementsSizes = debounce(updateElementsSizes);
                    return {
                        _: function() {
                            autosizesElems = document.getElementsByClassName(lazySizesCfg.autosizesClass);
                            addEventListener("resize", debouncedUpdateElementsSizes);
                        },
                        checkElems: debouncedUpdateElementsSizes,
                        updateElem: getSizeElement
                    };
                }();
                var init = function() {
                    if (!init.i && document.getElementsByClassName) {
                        init.i = true;
                        autoSizer._();
                        loader._();
                    }
                };
                setTimeout((function() {
                    if (lazySizesCfg.init) init();
                }));
                lazysizes = {
                    cfg: lazySizesCfg,
                    autoSizer,
                    loader,
                    init,
                    uP: updatePolyfill,
                    aC: addClass,
                    rC: removeClass,
                    hC: hasClass,
                    fire: triggerEvent,
                    gW: getWidth,
                    rAF
                };
                return lazysizes;
            }));
        }
    };
    var __webpack_module_cache__ = {};
    function __webpack_require__(moduleId) {
        var cachedModule = __webpack_module_cache__[moduleId];
        if (void 0 !== cachedModule) return cachedModule.exports;
        var module = __webpack_module_cache__[moduleId] = {
            exports: {}
        };
        __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
        return module.exports;
    }
    (() => {
        "use strict";
        function isWebp() {
            function testWebP(callback) {
                let webP = new Image;
                webP.onload = webP.onerror = function() {
                    callback(2 == webP.height);
                };
                webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
            }
            testWebP((function(support) {
                let className = true === support ? "webp" : "no-webp";
                document.documentElement.classList.add(className);
            }));
        }
        let bodyLockStatus = true;
        let bodyLockToggle = (delay = 500) => {
            if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
        };
        let bodyUnlock = (delay = 500) => {
            let body = document.querySelector("body");
            if (bodyLockStatus) {
                let lock_padding = document.querySelectorAll("[data-lp]");
                setTimeout((() => {
                    for (let index = 0; index < lock_padding.length; index++) {
                        const el = lock_padding[index];
                        el.style.paddingRight = "0px";
                    }
                    body.style.paddingRight = "0px";
                    document.documentElement.classList.remove("lock");
                }), delay);
                bodyLockStatus = false;
                setTimeout((function() {
                    bodyLockStatus = true;
                }), delay);
            }
        };
        let bodyLock = (delay = 500) => {
            let body = document.querySelector("body");
            if (bodyLockStatus) {
                let lock_padding = document.querySelectorAll("[data-lp]");
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
                }
                body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
                document.documentElement.classList.add("lock");
                bodyLockStatus = false;
                setTimeout((function() {
                    bodyLockStatus = true;
                }), delay);
            }
        };
        function menuInit() {
            if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
                if (bodyLockStatus && e.target.closest(".icon-menu")) {
                    bodyLockToggle();
                    document.documentElement.classList.toggle("menu-open");
                }
            }));
        }
        let addWindowScrollEvent = false;
        setTimeout((() => {
            if (addWindowScrollEvent) {
                let windowScroll = new Event("windowScroll");
                window.addEventListener("scroll", (function(e) {
                    document.dispatchEvent(windowScroll);
                }));
            }
        }), 0);
        function DynamicAdapt(type) {
            this.type = type;
        }
        DynamicAdapt.prototype.init = function() {
            const _this = this;
            this.оbjects = [];
            this.daClassname = "_dynamic_adapt_";
            this.nodes = document.querySelectorAll("[data-da]");
            for (let i = 0; i < this.nodes.length; i++) {
                const node = this.nodes[i];
                const data = node.dataset.da.trim();
                const dataArray = data.split(",");
                const оbject = {};
                оbject.element = node;
                оbject.parent = node.parentNode;
                оbject.destination = document.querySelector(dataArray[0].trim());
                оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
                оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
                оbject.index = this.indexInParent(оbject.parent, оbject.element);
                this.оbjects.push(оbject);
            }
            this.arraySort(this.оbjects);
            this.mediaQueries = Array.prototype.map.call(this.оbjects, (function(item) {
                return "(" + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
            }), this);
            this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, (function(item, index, self) {
                return Array.prototype.indexOf.call(self, item) === index;
            }));
            for (let i = 0; i < this.mediaQueries.length; i++) {
                const media = this.mediaQueries[i];
                const mediaSplit = String.prototype.split.call(media, ",");
                const matchMedia = window.matchMedia(mediaSplit[0]);
                const mediaBreakpoint = mediaSplit[1];
                const оbjectsFilter = Array.prototype.filter.call(this.оbjects, (function(item) {
                    return item.breakpoint === mediaBreakpoint;
                }));
                matchMedia.addListener((function() {
                    _this.mediaHandler(matchMedia, оbjectsFilter);
                }));
                this.mediaHandler(matchMedia, оbjectsFilter);
            }
        };
        DynamicAdapt.prototype.mediaHandler = function(matchMedia, оbjects) {
            if (matchMedia.matches) for (let i = 0; i < оbjects.length; i++) {
                const оbject = оbjects[i];
                оbject.index = this.indexInParent(оbject.parent, оbject.element);
                this.moveTo(оbject.place, оbject.element, оbject.destination);
            } else for (let i = оbjects.length - 1; i >= 0; i--) {
                const оbject = оbjects[i];
                if (оbject.element.classList.contains(this.daClassname)) this.moveBack(оbject.parent, оbject.element, оbject.index);
            }
        };
        DynamicAdapt.prototype.moveTo = function(place, element, destination) {
            element.classList.add(this.daClassname);
            if ("last" === place || place >= destination.children.length) {
                destination.insertAdjacentElement("beforeend", element);
                return;
            }
            if ("first" === place) {
                destination.insertAdjacentElement("afterbegin", element);
                return;
            }
            destination.children[place].insertAdjacentElement("beforebegin", element);
        };
        DynamicAdapt.prototype.moveBack = function(parent, element, index) {
            element.classList.remove(this.daClassname);
            if (void 0 !== parent.children[index]) parent.children[index].insertAdjacentElement("beforebegin", element); else parent.insertAdjacentElement("beforeend", element);
        };
        DynamicAdapt.prototype.indexInParent = function(parent, element) {
            const array = Array.prototype.slice.call(parent.children);
            return Array.prototype.indexOf.call(array, element);
        };
        DynamicAdapt.prototype.arraySort = function(arr) {
            if ("min" === this.type) Array.prototype.sort.call(arr, (function(a, b) {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if ("first" === a.place || "last" === b.place) return -1;
                    if ("last" === a.place || "first" === b.place) return 1;
                    return a.place - b.place;
                }
                return a.breakpoint - b.breakpoint;
            })); else {
                Array.prototype.sort.call(arr, (function(a, b) {
                    if (a.breakpoint === b.breakpoint) {
                        if (a.place === b.place) return 0;
                        if ("first" === a.place || "last" === b.place) return 1;
                        if ("last" === a.place || "first" === b.place) return -1;
                        return b.place - a.place;
                    }
                    return b.breakpoint - a.breakpoint;
                }));
                return;
            }
        };
        const da = new DynamicAdapt("max");
        da.init();
        __webpack_require__(90);
        function mySpoller() {
            let buttons = document.querySelectorAll(".spoller-button-js");
            function funcDelete() {
                for (let elem of buttons) {
                    elem.classList.remove("active-button");
                    let bodyElem = elem.nextElementSibling;
                    bodyElem.classList.remove("active-spoller");
                }
            }
            for (let button of buttons) button.addEventListener("click", (function(e) {
                e.preventDefault();
                const targ = e.target;
                if (!targ.closest(".active-button")) funcDelete();
                let bodyItem = this.nextElementSibling;
                this.classList.toggle("active-button");
                bodyItem.classList.toggle("active-spoller");
                if (bodyItem) if (bodyItem.style.maxHeight) {
                    button.classList.remove("active-button");
                    bodyItem.style.maxHeight = null;
                } else bodyItem.style.maxHeight = bodyItem.scrollHeight + "px";
                window.addEventListener("click", (e => {
                    const target = e.target;
                    if (!target.closest(".spoller-button-js")) {
                        bodyItem.classList.remove("active-spoller");
                        button.classList.remove("active-button");
                    }
                }));
            }));
        }
        mySpoller();
        window["FLS"] = true;
        isWebp();
        menuInit();
    })();
})();