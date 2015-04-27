var BROWSER = {};
var USERAGENT = navigator.userAgent.toLowerCase();
browserVersion({
    'ie': 'msie',
    'firefox': '',
    'chrome': '',
    'opera': '',
    'safari': '',
    'maxthon': '',
    'mozilla': '',
    'webkit': ''
});
if (BROWSER.safari) {
    BROWSER.firefox = true;
}
BROWSER.opera = BROWSER.opera ? opera.version() : 0;

var CSSLOADED = [];
var JSMENU = [];
JSMENU['active'] = [];
JSMENU['timer'] = [];
JSMENU['drag'] = [];
JSMENU['layer'] = 0;
JSMENU['zIndex'] = {
    'win': 200,
    'menu': 300,
    'dialog': 400,
    'prompt': 500
};
JSMENU['float'] = '';
var AJAX = [];
AJAX['url'] = [];
AJAX['stack'] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var CURRENTSTYPE = null;
var discuz_uid = isUndefined(discuz_uid) ? 0 : discuz_uid;
var creditnotice = isUndefined(creditnotice) ? '' : creditnotice;
var cookiedomain = isUndefined(cookiedomain) ? '' : cookiedomain;
var cookiepath = isUndefined(cookiepath) ? '' : cookiepath;

var DISCUZCODE = [];
DISCUZCODE['num'] = '-1';
DISCUZCODE['html'] = [];

var USERABOUT_BOX = true;

function browserVersion(types) {
    var other = 1;
    for (i in types) {
        var v = types[i] ? types[i] : i;
        if (USERAGENT.indexOf(v) != -1) {
            var re = new RegExp(v + '(\\/|\\s)([\\d\\.]+)', 'ig');
            var matches = re.exec(USERAGENT);
            var ver = matches != null ? matches[2] : 0;
            other = ver !== 0 ? 0 : other;
        } else {
            var ver = 0;
        }
        eval('BROWSER.' + i + '= ver');
    }
    BROWSER.other = other;
}

function getEvent() {
    if (document.all) return window.event;
    func = getEvent.caller;
    while (func != null) {
        var arg0 = func.arguments[0];
        if (arg0) {
            if ((arg0.constructor == Event || arg0.constructor == MouseEvent) || (typeof(arg0) == "object" && arg0.preventDefault && arg0.stopPropagation)) {
                return arg0;
            }
        }
        func = func.caller;
    }
    return null;
}

function isUndefined(variable) {
    return typeof variable == 'undefined' ? true : false;
}

function in_array(needle, haystack) {
    if (typeof needle == 'string' || typeof needle == 'number') {
        for (var i in haystack) {
            if (haystack[i] == needle) {
                return true;
            }
        }
    }
    return false;
}

if (BROWSER.firefox && window.HTMLElement) {
    HTMLElement.prototype.__defineSetter__('outerHTML', function (sHTML) {
        var r = this.ownerDocument.createRange();
        r.setStartBefore(this);
        var df = r.createContextualFragment(sHTML);
        this.parentNode.replaceChild(df, this);
        return sHTML;
    });

    HTMLElement.prototype.__defineGetter__('outerHTML', function () {
        var attr;
        var attrs = this.attributes;
        var str = '<' + this.tagName.toLowerCase();
        for (var i = 0; i < attrs.length; i++) {
            attr = attrs[i];
            if (attr.specified) str += ' ' + attr.name + '="' + attr.value + '"';
        }
        if (!this.canHaveChildren) {
            return str + '>';
        }
        return str + '>' + this.innerHTML + '</' + this.tagName.toLowerCase() + '>';
    });

    HTMLElement.prototype.__defineGetter__('canHaveChildren', function () {
        switch (this.tagName.toLowerCase()) {
        case 'area':
        case 'base':
        case 'basefont':
        case 'col':
        case 'frame':
        case 'hr':
        case 'img':
        case 'br':
        case 'input':
        case 'isindex':
        case 'link':
        case 'meta':
        case 'param':
            return false;
        }
        return true;
    });
}

function $(id) {
    return !id ? null : document.getElementById(id);
}

function display(id) {
    $(id).style.display = $(id).style.display == '' ? 'none' : '';
}

function thumbImg(obj, method) {
    if (!obj) {
        return;
    }
    obj.onload = null;
    file = obj.src;
    zw = obj.offsetWidth;
    zh = obj.offsetHeight;
    if (zw < 2) {
        if (!obj.id) {
            obj.id = 'img_' + Math.random();
        }
        setTimeout("thumbImg($('" + obj.id + "'), " + method + ")", 100);
        return;
    }
    zr = zw / zh;
    method = !method ? 0 : 1;
    if (method) {
        fixw = obj.getAttribute('_width');
        fixh = obj.getAttribute('_height');
        if (zw > fixw) {
            zw = fixw;
            zh = zw / zr;
        }
        if (zh > fixh) {
            zh = fixh;
            zw = zh * zr;
        }
    } else {
        var imagemaxwidth = isUndefined(imagemaxwidth) ? '600' : imagemaxwidth;
        var widthary = imagemaxwidth.split('%');
        if (widthary.length > 1) {
            fixw = $('wrap').clientWidth - 200;
            if (widthary[0]) {
                fixw = fixw * widthary[0] / 100;
            } else if (widthary[1]) {
                fixw = fixw < widthary[1] ? fixw : widthary[1];
            }
        } else {
            fixw = widthary[0];
        }
        if (zw > fixw) {
            zw = fixw;
            zh = zw / zr;
            obj.style.cursor = 'pointer';
            if (!obj.onclick) {
                obj.onclick = function () {
                    zoom(obj, obj.src);
                };
            }
        }
    }
    obj.width = zw;
    obj.height = zh;
}

var zoomclick = 0,
    zoomstatus = 1;

function zoom(obj, zimg) {
    zimg = !zimg ? obj.src : zimg;
    if (!zoomstatus) {
        window.open(zimg, '', '');
        return;
    }
    if (!obj.id) obj.id = 'img_' + Math.random();
    var menuid = obj.id + '_zmenu';
    var menu = $(menuid);
    var imgid = menuid + '_img';
    var zoomid = menuid + '_zimg';
    var maxh = (document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight) - 70;

    if (!menu) {
        menu = document.createElement('div');
        menu.id = menuid;
        var objpos = fetchOffset(obj);
        menu.innerHTML = '<div onclick="$(\'append_parent\').removeChild($(\'' + obj.id + '_zmenu\'))" style="z-index:600;filter:alpha(opacity=50);opacity:0.5;background:#FFF;position:absolute;width:' + obj.clientWidth + 'px;height:' + obj.clientHeight + 'px;left:' + objpos['left'] + 'px;top:' + objpos['top'] + 'px"><table width="100%" height="100%"><tr><td valign="middle" align="center"><img src="' + IMGDIR + '/loading.gif" /></td></tr></table></div>' + '<div style="position:absolute;top:-100000px;display:none"><img id="' + imgid + '" src="' + zimg + '"></div>';
        $('append_parent').appendChild(menu);
        $(imgid).onload = function () {
            $(imgid).parentNode.style.display = '';
            var imgw = $(imgid).width;
            var imgh = $(imgid).height;
            var r = imgw / imgh;
            var w = document.body.clientWidth * 0.95;
            w = imgw > w ? w : imgw;
            var h = w / r;
            if (h > maxh) {
                h = maxh;
                w = h * r;
            }
            $('append_parent').removeChild(menu);
            menu = document.createElement('div');
            menu.id = menuid;
            menu.style.overflow = 'visible';
            menu.style.width = (w < 300 ? 300 : w) + 20 + 'px';
            menu.style.height = h + 50 + 'px';
            menu.innerHTML = '<div class="zoominner"><p id="' + menuid + '_ctrl"><span class="y"><a href="' + zimg + '" class="imglink" target="_blank" title="在新窗口打开">在新窗口打开</a><a href="javascipt:;" id="' + menuid + '_adjust" class="imgadjust" title="实际大小">实际大小</a><a href="javascript:;" onclick="hideMenu()" class="imgclose" title="关闭">关闭</a></span>鼠标滚轮缩放图片</p><div align="center" onmousedown="zoomclick=1" onmousemove="zoomclick=2" onmouseup="if(zoomclick==1) hideMenu()"><img id="' + zoomid + '" src="' + zimg + '" width="' + w + '" height="' + h + '" w="' + imgw + '" h="' + imgh + '"></div></div>';
            $('append_parent').appendChild(menu);
            $(menuid + '_adjust').onclick = function (e) {
                adjust(e, 1)
            };
            if (BROWSER.ie) {
                menu.onmousewheel = adjust;
            } else {
                menu.addEventListener('DOMMouseScroll', adjust, false);
            }
            showMenu({
                'menuid': menuid,
                'duration': 3,
                'pos': '00',
                'cover': 1,
                'drag': menuid,
                'maxh': maxh + 70
            });
        };
    } else {
        showMenu({
            'menuid': menuid,
            'duration': 3,
            'pos': '00',
            'cover': 1,
            'drag': menuid,
            'maxh': menu.clientHeight
        });
    }
    if (BROWSER.ie) doane(event);
    var adjust = function (e, a) {
        var imgw = $(zoomid).getAttribute('w');
        var imgh = $(zoomid).getAttribute('h');
        var imgwstep = imgw / 10;
        var imghstep = imgh / 10;
        if (!a) {
            if (!e) e = window.event;
            if (e.altKey || e.shiftKey || e.ctrlKey) return;
            if (e.wheelDelta <= 0 || e.detail > 0) {
                if ($(zoomid).width - imgwstep <= 200 || $(zoomid).height - imghstep <= 200) {
                    doane(e);
                    return;
                }
                $(zoomid).width -= imgwstep;
                $(zoomid).height -= imghstep;
            } else {
                if ($(zoomid).width + imgwstep >= imgw) {
                    doane(e);
                    return;
                }
                $(zoomid).width += imgwstep;
                $(zoomid).height += imghstep;
            }
        } else {
            $(zoomid).width = imgw;
            $(zoomid).height = imgh;
        }
        menu.style.width = (parseInt($(zoomid).width < 300 ? 300 : parseInt($(zoomid).width)) + 20) + 'px';
        menu.style.height = (parseInt($(zoomid).height) + 50) + 'px';
        setMenuPosition('', menuid, '00');
        doane(e);
    };
}

function showMenu(v) {
    var ctrlid = isUndefined(v['ctrlid']) ? v : v['ctrlid'];
    var showid = isUndefined(v['showid']) ? ctrlid : v['showid'];
    var menuid = isUndefined(v['menuid']) ? showid + '_menu' : v['menuid'];
    var ctrlObj = $(ctrlid);
    var menuObj = $(menuid);
    if (!menuObj) return;
    var mtype = isUndefined(v['mtype']) ? 'menu' : v['mtype'];
    var evt = isUndefined(v['evt']) ? 'mouseover' : v['evt'];
    var pos = isUndefined(v['pos']) ? '43' : v['pos'];
    var layer = isUndefined(v['layer']) ? 1 : v['layer'];
    var duration = isUndefined(v['duration']) ? 2 : v['duration'];
    var timeout = isUndefined(v['timeout']) ? 250 : v['timeout'];
    var maxh = isUndefined(v['maxh']) ? 600 : v['maxh'];
    var cache = isUndefined(v['cache']) ? 1 : v['cache'];
    var drag = isUndefined(v['drag']) ? '' : v['drag'];
    var dragobj = drag && $(drag) ? $(drag) : menuObj;
    var fade = isUndefined(v['fade']) ? 0 : v['fade'];
    var cover = isUndefined(v['cover']) ? 0 : v['cover'];
    var zindex = isUndefined(v['zindex']) ? JSMENU['zIndex']['menu'] : v['zindex'];
    zindex = cover ? zindex + 200 : zindex;
    if (typeof JSMENU['active'][layer] == 'undefined') {
        JSMENU['active'][layer] = [];
    }

    if (evt == 'click' && in_array(menuid, JSMENU['active'][layer]) && mtype != 'win') {
        hideMenu(menuid, mtype);
        return;
    }
    if (mtype == 'menu') {
        hideMenu(layer, mtype);
    }

    if (ctrlObj) {
        if (!ctrlObj.initialized) {
            ctrlObj.initialized = true;
            ctrlObj.unselectable = true;

            ctrlObj.outfunc = typeof ctrlObj.onmouseout == 'function' ? ctrlObj.onmouseout : null;
            ctrlObj.onmouseout = function () {
                if (this.outfunc) this.outfunc();
                if (duration < 3 && !JSMENU['timer'][menuid]) JSMENU['timer'][menuid] = setTimeout('hideMenu(\'' + menuid + '\', \'' + mtype + '\')', timeout);
            };

            ctrlObj.overfunc = typeof ctrlObj.onmouseover == 'function' ? ctrlObj.onmouseover : null;
            ctrlObj.onmouseover = function (e) {
                doane(e);
                if (this.overfunc) this.overfunc();
                if (evt == 'click') {
                    clearTimeout(JSMENU['timer'][menuid]);
                    JSMENU['timer'][menuid] = null;
                } else {
                    for (var i in JSMENU['timer']) {
                        if (JSMENU['timer'][i]) {
                            clearTimeout(JSMENU['timer'][i]);
                            JSMENU['timer'][i] = null;
                        }
                    }
                }
            };
        }
    }

    var dragMenu = function (menuObj, e, op) {
        e = e ? e : window.event;
        if (op == 1) {
            if (in_array(BROWSER.ie ? e.srcElement.tagName : e.target.tagName, ['TEXTAREA', 'INPUT', 'BUTTON', 'SELECT'])) {
                return;
            }
            JSMENU['drag'] = [e.clientX, e.clientY];
            JSMENU['drag'][2] = parseInt(menuObj.style.left);
            JSMENU['drag'][3] = parseInt(menuObj.style.top);
            document.onmousemove = function (e) {
                try {
                    dragMenu(menuObj, e, 2);
                } catch (err) {}
            };
            document.onmouseup = function (e) {
                try {
                    dragMenu(menuObj, e, 3);
                } catch (err) {}
            };
            doane(e);
        } else if (op == 2 && JSMENU['drag'][0]) {
            var menudragnow = [e.clientX, e.clientY];
            menuObj.style.left = (JSMENU['drag'][2] + menudragnow[0] - JSMENU['drag'][0]) + 'px';
            menuObj.style.top = (JSMENU['drag'][3] + menudragnow[1] - JSMENU['drag'][1]) + 'px';
            doane(e);
        } else if (op == 3) {
            JSMENU['drag'] = [];
            document.onmousemove = null;
            document.onmouseup = null;
        }
    };

    if (!menuObj.initialized) {
        menuObj.initialized = true;
        menuObj.ctrlkey = ctrlid;
        menuObj.mtype = mtype;
        menuObj.layer = layer;
        menuObj.cover = cover;
        if (ctrlObj && ctrlObj.getAttribute('fwin')) {
            menuObj.scrolly = true;
        }
        menuObj.style.position = 'absolute';
        menuObj.style.zIndex = zindex + layer;
        menuObj.onclick = function (e) {
            if (!e || BROWSER.ie) {
                window.event.cancelBubble = true;
                return window.event;
            } else {
                e.stopPropagation();
                return e;
            }
        };
        if (duration < 3) {
            if (duration > 1) {
                menuObj.onmouseover = function () {
                    clearTimeout(JSMENU['timer'][menuid]);
                    JSMENU['timer'][menuid] = null;
                };
            }
            if (duration != 1) {
                menuObj.onmouseout = function () {
                    JSMENU['timer'][menuid] = setTimeout('hideMenu(\'' + menuid + '\', \'' + mtype + '\')', timeout);
                };
            }
        }
        if (cover) {
            var coverObj = document.createElement('div');
            coverObj.id = menuid + '_cover';
            coverObj.style.position = 'absolute';
            coverObj.style.zIndex = menuObj.style.zIndex - 1;
            coverObj.style.left = coverObj.style.top = '0px';
            coverObj.style.width = '100%';
            coverObj.style.height = document.body.offsetHeight + 'px'; //半透明的高度
            coverObj.style.backgroundColor = '#000';
            coverObj.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=50)';
            coverObj.style.opacity = 0.5;
            $('append_parent').appendChild(coverObj);
            _attachEvent(window, 'load', function () {
                coverObj.style.height = document.body.offsetHeight + 'px'; //高茺
            }, document);
        }
    }
    if (drag) {
        dragobj.style.cursor = 'move';
        dragobj.onmousedown = function (event) {
            try {
                dragMenu(menuObj, event, 1);
            } catch (e) {}
        };
    }
    menuObj.style.display = '';
    if (cover) $(menuid + '_cover').style.display = '';
    if (fade) {
        var O = 0;
        var fadeIn = function (O) {
            if (O == 100) {
                clearTimeout(fadeInTimer);
                return;
            }
            menuObj.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=' + O + ')';
            menuObj.style.opacity = O / 100;
            O += 10;
            var fadeInTimer = setTimeout(function () {
                fadeIn(O);
            }, 50);
        };
        fadeIn(O);
        menuObj.fade = true;
    } else {
        menuObj.fade = false;
    }
    setMenuPosition(showid, menuid, pos);
    if (maxh && menuObj.scrollHeight > maxh) {
        menuObj.style.height = maxh + 'px';
        if (BROWSER.opera) {
            menuObj.style.overflow = 'auto';
        } else {
            menuObj.style.overflowY = 'auto';
        }
    }

    if (!duration) {
        setTimeout('hideMenu(\'' + menuid + '\', \'' + mtype + '\')', timeout);
    }

    if (!in_array(menuid, JSMENU['active'][layer])) JSMENU['active'][layer].push(menuid);
    menuObj.cache = cache;
    if (layer > JSMENU['layer']) {
        JSMENU['layer'] = layer;
    }
}

function setMenuPosition(showid, menuid, pos) {
    function checkmenuobj(menuObj) {
        while ((menuObj = menuObj.offsetParent) != null) {
            if (menuObj.style.position == 'absolute') {
                return 2;
            }
        }
        return 1;
    }
    var showObj = $(showid);
    var menuObj = menuid ? $(menuid) : $(showid + '_menu');
    if (isUndefined(pos)) pos = '43';
    var basePoint = parseInt(pos.substr(0, 1));
    var direction = parseInt(pos.substr(1, 1));
    var sxy = 0,
        sx = 0,
        sy = 0,
        sw = 0,
        sh = 0,
        ml = 0,
        mt = 0,
        mw = 0,
        mcw = 0,
        mh = 0,
        mch = 0,
        bpl = 0,
        bpt = 0;

    if (!menuObj || (basePoint > 0 && !showObj)) return;
    if (showObj) {
        sxy = fetchOffset(showObj, BROWSER.ie && BROWSER.ie < 7 ? checkmenuobj(menuObj) : 0);
        sx = sxy['left'];
        sy = sxy['top'];
        sw = showObj.offsetWidth;
        sh = showObj.offsetHeight;
    }
    mw = menuObj.offsetWidth;
    mcw = menuObj.clientWidth;
    mh = menuObj.offsetHeight;
    mch = menuObj.clientHeight;

    switch (basePoint) {
    case 1:
        bpl = sx;
        bpt = sy;
        break;
    case 2:
        bpl = sx + sw;
        bpt = sy;
        break;
    case 3:
        bpl = sx + sw;
        bpt = sy + sh;
        break;
    case 4:
        bpl = sx;
        bpt = sy + sh;
        break;
    }
    switch (direction) {
    case 0:
        menuObj.style.left = (document.body.clientWidth - menuObj.clientWidth) / 2 + 'px';
        mt = (document.documentElement.clientHeight - menuObj.clientHeight) / 2;
        break;
    case 1:
        ml = bpl - mw;
        mt = bpt - mh;
        break;
    case 2:
        ml = bpl;
        mt = bpt - mh;
        break;
    case 3:
        ml = bpl;
        mt = bpt;
        break;
    case 4:
        ml = bpl - mw;
        mt = bpt;
        break;
    }
    var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
    var scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
    if (in_array(direction, [1, 4]) && ml < 0) {
        ml = bpl;
        if (in_array(basePoint, [1, 4])) ml += sw;
    } else if (ml + mw > scrollLeft + document.body.clientWidth && sx >= mw) {
        ml = bpl - mw;
        if (in_array(basePoint, [2, 3])) ml -= sw;
    }
    if (in_array(direction, [1, 2]) && mt < 0) {
        mt = bpt;
        if (in_array(basePoint, [1, 2])) mt += sh;
    } else if (mt + mh > scrollTop + document.documentElement.clientHeight && sy >= mh) {
        mt = bpt - mh;
        if (in_array(basePoint, [3, 4])) mt -= sh;
    }
    if (pos == '210') {
        ml += 69 - sw / 2;
        mt -= 5;
        if (showObj.tagName == 'TEXTAREA') {
            ml -= sw / 2;
            mt += sh / 2;
        }
    }
    if (direction == 0 || menuObj.scrolly) {
        if (BROWSER.ie && BROWSER.ie < 7) {
            if (direction == 0) mt += scrollTop;
        } else {
            if (menuObj.scrolly) mt -= scrollTop;
            menuObj.style.position = 'fixed';
        }
    }
    if (ml) menuObj.style.left = ml + 'px';
    if (mt) menuObj.style.top = mt + 'px';
    if (direction == 0 && BROWSER.ie && !document.documentElement.clientHeight) {
        menuObj.style.position = 'absolute';
        menuObj.style.top = (document.body.clientHeight - menuObj.clientHeight) / 2 + 'px';
    }
    if (menuObj.style.clip && !BROWSER.opera) {
        menuObj.style.clip = 'rect(auto, auto, auto, auto)';
    }
}

function doane(event) {
    e = event ? event : window.event;
    if (!e) e = getEvent();
    if (e && BROWSER.ie) {
        e.returnValue = false;
        e.cancelBubble = true;
    } else if (e) {
        e.stopPropagation();
        e.preventDefault();
    }
}

function _attachEvent(obj, evt, func, eventobj) {
    eventobj = !eventobj ? obj : eventobj;
    if (obj.addEventListener) {
        obj.addEventListener(evt, func, false);
    } else if (eventobj.attachEvent) {
        obj.attachEvent('on' + evt, func);
    }
}

function _detachEvent(obj, evt, func, eventobj) {
    eventobj = !eventobj ? obj : eventobj;
    if (obj.removeEventListener) {
        obj.removeEventListener(evt, func, false);
    } else if (eventobj.detachEvent) {
        obj.detachEvent('on' + evt, func);
    }
}

function fetchOffset(obj, mode) {
    var left_offset = 0,
        top_offset = 0,
        mode = !mode ? 0 : mode;

    if (obj.getBoundingClientRect && !mode) {
        var rect = obj.getBoundingClientRect();
        var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
        var scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
        if (document.documentElement.dir == 'rtl') {
            scrollLeft = scrollLeft + document.documentElement.clientWidth - document.documentElement.scrollWidth;
        }
        left_offset = rect.left + scrollLeft - document.documentElement.clientLeft;
        top_offset = rect.top + scrollTop - document.documentElement.clientTop;
    }
    if (left_offset <= 0 || top_offset <= 0) {
        left_offset = obj.offsetLeft;
        top_offset = obj.offsetTop;
        while ((obj = obj.offsetParent) != null) {
            if (mode == 2 && obj.style.position == 'absolute') {
                continue;
            }
            left_offset += obj.offsetLeft;
            top_offset += obj.offsetTop;
        }
    }
    return {
        'left': left_offset,
        'top': top_offset
    };
}

function hideMenu(attr, mtype) {
    attr = isUndefined(attr) ? '' : attr;
    mtype = isUndefined(mtype) ? 'menu' : mtype;
    if (attr == '') {
        for (var i = 1; i <= JSMENU['layer']; i++) {
            hideMenu(i, mtype);
        }
        return;
    } else if (typeof attr == 'number') {
        for (var j in JSMENU['active'][attr]) {
            hideMenu(JSMENU['active'][attr][j], mtype);
        }
        return;
    } else if (typeof attr == 'string') {
        var menuObj = $(attr);
        if (!menuObj || (mtype && menuObj.mtype != mtype)) return;
        clearTimeout(JSMENU['timer'][attr]);
        var hide = function () {
            if (menuObj.cache) {
                menuObj.style.display = 'none';
                if (menuObj.cover) $(attr + '_cover').style.display = 'none';
            } else {
                menuObj.parentNode.removeChild(menuObj);
                if (menuObj.cover) $(attr + '_cover').parentNode.removeChild($(attr + '_cover'));
            }
            var tmp = [];
            for (var k in JSMENU['active'][menuObj.layer]) {
                if (attr != JSMENU['active'][menuObj.layer][k]) tmp.push(JSMENU['active'][menuObj.layer][k]);
            }
            JSMENU['active'][menuObj.layer] = tmp;
        };
        if (menuObj.fade) {
            var O = 100;
            var fadeOut = function (O) {
                if (O == 0) {
                    clearTimeout(fadeOutTimer);
                    hide();
                    return;
                }
                menuObj.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=' + O + ')';
                menuObj.style.opacity = O / 100;
                O -= 10;
                var fadeOutTimer = setTimeout(function () {
                    fadeOut(O);
                }, 50);
            };
            fadeOut(O);
        } else {
            hide();
        }
    }
}