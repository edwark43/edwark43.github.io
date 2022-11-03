//Javascript Document

if (typeof cacheVersion === 'undefined') var cacheVersion = false;

function un(variable) {
	if (typeof variable == 'undefined') {
		return true;
	} else if (variable == null) {
		return true;
	} else {
		return false;
	}
}
function def(arr) {
	for (var d = 0; d < arr.length; d++) {
		if (typeof arr[d] !== 'undefined') {
			return arr[d];
		}
	}
	return undefined;
}
function boolean(testVar, def) {
	if (typeof testVar == 'boolean') {
		return testVar;
	} else {
		return def;
	}
}
function isInt(num) {
	if (num % 1 == 0) return true;
	return false;
}
/*function clone(obj) {
	var copy;
	if (null == obj || "object" != typeof obj)
		return obj;
	if (obj instanceof Date) {
		copy = new Date();
		copy.setTime(obj.getTime());
		return copy;
	}
	if (obj instanceof Array) {
		copy = [];
		for (var i = 0, len = obj.length; i < len; i++) {
			copy[i] = clone(obj[i]);
		}
		return copy;
	}
	if (obj instanceof Object) {
		copy = {};
		for (var attr in obj) {
			if (obj.hasOwnProperty(attr))
				copy[attr] = clone(obj[attr]);
		}
		return copy;
	}
	throw new Error("Unable to copy obj! Its type isn't supported.");
}*/
/*function clone(obj) {
	return JSON.parse(JSON.stringify(obj,function(key,value) {
		return (typeof value === 'function') ? value.toString() : value;
	}));
}*/
function isObjectEmpty(ob) {
	for (var key in ob) {
		if (ob[key].hasOwnProperty() === false) continue;
		if (!un(ob[key])) return false;
	}
	return true;
}
Array.prototype.last = function(){
	return this[this.length - 1];
};
Array.prototype.isEmpty = function() {
	for (var i = 0; i < this.length; i++) if (!un(this[i])) return false;
	return true;
}
Array.prototype.ran = function () {
    return this[Math.floor(Math.random() * this.length)]
}
Array.prototype.shuffle = function() {
	for (var i = 0; i < this.length-1; i++) {
		var j = ran(i,this.length-1);
		if (i !== j) {
			var elementi = this[i];
			var elementj = this[j];
			this.splice(i,1,elementj);
			this.splice(j,1,elementi);
		}
	}
	return this;
}
Array.prototype.sortOn = function(key) {
    this.sort(function(a, b){
        if (a[key] < b[key]) {
            return -1;
        } else if (a[key] > b[key]) {
            return 1;
        }
        return 0;
    });
};
Array.prototype.max = function() {
  return Math.max.apply(null, this);
};
Array.prototype.min = function() {
  return Math.min.apply(null, this);
};
if (!Array.prototype.find) { // https://tc39.github.io/ecma262/#sec-array.prototype.find
  Object.defineProperty(Array.prototype, 'find', {
    value: function(predicate) {
     // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return kValue.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return kValue;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return undefined.
      return undefined;
    },
    configurable: true,
    writable: true
  });
}
if (typeof Array.prototype.includes == 'undefined') {
	Array.prototype.includes = function(element) {
		return this.indexOf(element) > -1;
	}
}
function arraysEqual(array1,array2) {
	if (typeof array1 == 'undefined' || typeof array2 == 'undefined') return false
	if (array1.length !== array2.length) return false;
	for (var arr = 0; arr < array1.length; arr++) {
		if (typeof array1[arr] !== typeof array2[arr]) return false;
		if (typeof array1[arr] == 'object' && arraysEqual(array1[arr],array2[arr]) == false) return false;
		if (typeof array1[arr] !== 'object' && array1[arr] !== array2[arr]) return false;
	}
	return true;
}
function isEqual(a,b,recursionCount) {
	if (un(recursionCount)) {
		var recursionCount = 0;
	} else {
		recursionCount++;
		if (recursionCount > 6) return true;
	}
	if (typeof a == 'undefined' || typeof b == 'undefined') return false;
	if (typeof a !== typeof b) return;
	if (a instanceof Array) {
		if (b instanceof Array == false) return false;
		if (a.length !== b.length) return false;
		for (var i = 0, iMax = a.length; i < iMax; i++) {
			if (!isEqual(a[i],b[i],recursionCount)) return false
		}
		for (var i = 0, iMax = b.length; i < iMax; i++) {
			if (!isEqual(b[i],a[i],recursionCount)) return false
		}
	} else if (typeof a == 'object') {
		if (b instanceof Array == true) return false;
		for (var key in a) {
			if (!a.hasOwnProperty(key)) continue;
			if (!isEqual(a[key],b[key],recursionCount)) return false
		}
		for (var key in b) {
			if (!b.hasOwnProperty(key)) continue;
			if (!isEqual(b[key],a[key],recursionCount)) return false
		}
	} else if (typeof a === 'function') {
		if (a.toString() !== b.toString()) return false;
	} else {
		if (a !== b) return false;
	}
	return true;
}
if (typeof CanvasRenderingContext2D.prototype.ellipse == 'undefined') {
	CanvasRenderingContext2D.prototype.ellipse = function(cx, cy, rx, ry, rot, aStart, aEnd) { 
		this.save();
		this.translate(cx, cy);
		this.rotate(rot);
		this.translate(-rx, -ry);

		this.scale(rx, ry);
		this.arc(1, 1, 1, aStart, aEnd, false);
		this.restore();
	}
}
if (un(window.requestIdleCallback)) {
	window.requestIdleCallback = function (cb) {
		var start = Date.now();
		return setTimeout(function () {
			cb({
				didTimeout: false,
				timeRemaining: function () {
					return Math.max(0, 50 - (Date.now() - start));
				}
			});
		}, 1);
	};
	window.cancelIdleCallback = function (id) {
		clearTimeout(id);
	}
}

function mapArray(array,includeAll) {
	var mapString = '';
	var map = [];
	
	/*if (includeAll === false) {
		for (var i = 0; i < array.length; i++) {
			for (var j = 0; j < array[i].length; j++) {
				if (typeof array[i][j].markupTag == 'undefined' || array[i][j].markupTag == false) {
					console.log(i,j, JSON.stringify(array[i][j]));
				}
			}
		}
	}*/
	
	function mapArray2(array,includeAll) {
		for (var aa = 0; aa < array.length; aa++) {
			if (typeof array[aa] !== 'undefined') {
				if (typeof array[aa].left == 'undefined' && typeof array[aa] !== 'boolean') {
					if (mapString == '') {mapString = String(aa)} else {mapString = mapString + ',' + String(aa)}
					mapArray2(array[aa], includeAll);
				} else if (includeAll == true || typeof array[aa].markupTag == 'undefined' || array[aa].markupTag == false) {
					if (mapString == '') {mapString = String(aa)} else {mapString = mapString + ',' + String(aa)}
					var mapArr = mapString.split(',');
					for (var bb = 0; bb < mapArr.length; bb++) {mapArr[bb] = Number(mapArr[bb])}
					map.push(mapArr);
					mapString = mapString.slice(0, mapString.lastIndexOf(',') - mapString.length);
				}
			}
		}
		mapString = mapString.slice(0, mapString.lastIndexOf(',') - mapString.length);
	}	
	
	for (var aa = 0; aa < array.length; aa++) {
		if (typeof array[aa] !== 'undefined') {
			if (typeof array[aa].left == 'undefined') {
				if (mapString == '') {mapString = String(aa)} else {mapString = mapString + ',' + String(aa)}
				mapArray2(array[aa], includeAll);
			} else if (includeAll == true || typeof array[aa].markupTag == 'undefined' || array[aa].markupTag == false) {
				if (mapString == '') {mapString = String(aa)} else {mapString = mapString + ',' + String(aa)}
				var mapArr = mapString.split(',');
				for (var bb = 0; bb < mapArr.length; bb++) {mapArr[bb] = Number(mapArr[bb])}
				map.push(mapArr);
			}
			mapString = '';
		}
	}

	return map;
}
var arrayString = '';
function loop(obj,func,recursive) {
	// eg.
	//	loop(
	//		{a:1,b:2,c:['q','r',function(){},{g:true,h:false}],d:{x:11,y:12}},
	//		function(obj,key) {console.log(obj,key)}
	//	);
	// // recursive is true by default
	
    if (obj instanceof Array) {
		for (var i = 0; i < obj.length; i++) {
			if (boolean(recursive,true) == true && (obj[i] instanceof Array || typeof obj[i] == 'object')) {
				loop(obj[i],func,recursive);
			} else {
				func(obj[i],i);
			}
		}
	} else if (typeof obj == 'object') {
		for (var i in obj) {
			if (boolean(recursive,true) == true && (obj[i] instanceof Array || typeof obj[i] == 'object')) {
				loop(obj[i],func,recursive);
			} else {
				func(obj[i],i);
			}
		}		
	}
}
function getSortOrder(arr) {
	var toSort = clone(arr);
	for (var i = 0; i < toSort.length; i++) toSort[i] = [toSort[i], i];
	toSort.sort(function(left, right) {return left[0] < right[0] ? -1 : 1;});
	var sortIndices = [];
	for (var j = 0; j < toSort.length; j++) sortIndices.push(toSort[j][1]);
	return sortIndices;
}
function copyProperties(from,to,exceptions) {
	if (un(exceptions)) exceptions = [];
	if (un(to)) to = {};
	for (var key in from) {
		if (exceptions.includes(key) || isElement(from[key]) || key.indexOf("_") == 0) continue;
		to[key] = clone(from[key]);
	}
	return to;
}


if (typeof scriptsToLoad == 'undefined') {
	var scriptsToLoad = [
		'_algebra.js',
		'_drawMathsText.js',
		'_mathsInput.js',
		'_grid2.js',
		'_keyboard.js',
		'_text2.js',
		'_textEdit.js',
		'_draw.js',
		'_draw2.js',
		'_miscFuncs.js',
		'Notifier.js',
		'timeme.min.js',
		'clone.js',
		'_draw3.js'
	];
}
if (scriptsToLoad.includes('clone.js') == false) scriptsToLoad.unshift('clone.js');
if (scriptsToLoad.includes('_draw3.js') == false) scriptsToLoad.push('_draw3.js');
var loadedScriptCount = 0;
var pageIndex = 0;

if (typeof FontFace !== 'undefined') {
	addFont('Hobo', 'url(fonts/hobo-webfont.woff)');
	addFont('segoePrint', 'url(fonts/segeo-print-webfont.woff)');
	addFont('smileyMonster', 'url(fonts/smileymonster.woff)');
	function addFont(name,url) {
		var font = new FontFace(name,url,{style:'normal',weight:'normal'});
		document.fonts.add(font);
		font.load();
	}
}

if (!Array.from) { // Production steps of ECMA-262, Edition 6, 22.1.2.1
  Array.from = (function () {
    var toStr = Object.prototype.toString;
    var isCallable = function (fn) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    var toInteger = function (value) {
      var number = Number(value);
      if (isNaN(number)) { return 0; }
      if (number === 0 || !isFinite(number)) { return number; }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    var maxSafeInteger = Math.pow(2, 53) - 1;
    var toLength = function (value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    };

    // The length property of the from method is 1.
    return function from(arrayLike/*, mapFn, thisArg */) {
      // 1. Let C be the this value.
      var C = this;

      // 2. Let items be ToObject(arrayLike).
      var items = Object(arrayLike);

      // 3. ReturnIfAbrupt(items).
      if (arrayLike == null) {
        throw new TypeError('Array.from requires an array-like object - not null or undefined');
      }

      // 4. If mapfn is undefined, then let mapping be false.
      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
      var T;
      if (typeof mapFn !== 'undefined') {
        // 5. else
        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
        if (!isCallable(mapFn)) {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        }

        // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 2) {
          T = arguments[2];
        }
      }

      // 10. Let lenValue be Get(items, "length").
      // 11. Let len be ToLength(lenValue).
      var len = toLength(items.length);

      // 13. If IsConstructor(C) is true, then
      // 13. a. Let A be the result of calling the [[Construct]] internal method 
      // of C with an argument list containing the single item len.
      // 14. a. Else, Let A be ArrayCreate(len).
      var A = isCallable(C) ? Object(new C(len)) : new Array(len);

      // 16. Let k be 0.
      var k = 0;
      // 17. Repeat, while k < len… (also steps a - h)
      var kValue;
      while (k < len) {
        kValue = items[k];
        if (mapFn) {
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }
        k += 1;
      }
      // 18. Let putStatus be Put(A, "length", len, true).
      A.length = len;
      // 20. Return A.
      return A;
    };
  }());
}
function hasDuplicates(array) {
    var valuesSoFar = [];
    for (var i = 0; i < array.length; ++i) {
        var value = array[i];
        if (valuesSoFar.indexOf(value) !== -1) {
            return true;
        }
        valuesSoFar.push(value);
    }
    return false;
}

function printCanvases(arr) {  // needs cross-browser testing
	var data = [];
    var windowContent = '<!DOCTYPE html>';
    windowContent += '<html>';
    windowContent += '<head><title>Print Worksheet</title><style type="text/css" media="print">';
    windowContent += '@page {size:auto; margin: 0mm;}';
    windowContent += 'html {background-color: #FFFFFF; margin: 0px;}';
    windowContent += 'body {margin-left: 10mm; margin-right: 10mm;}';
    windowContent += '.pageimg {page-break-after: always; margin-top: 10mm; margin-bottom: 10mm;}';
    windowContent += '</style></head>';
    windowContent += '<body>'
	for (var i = 0; i < arr.length; i++) {
		data[i] = arr[i].toDataURL();
		windowContent += '<img class="pageimg" src="' + data[i] + '" width="100%">';
	}
    windowContent += '</body>';
    windowContent += '</html>';
    var printWin = window.open();
    printWin.document.open();
    printWin.document.write(windowContent);
	printWin.document.addEventListener('load', function() {
		printWin.focus();
		printWin.print();
		//printWin.document.close();
		//printWin.close();
		//printWin.onfocus = function () {printWin.close();}
		setTimeout(function() {
			printWin.document.close();
			printWin.close();
		},500);
	}, true);
}

function getHighestZIndex() {
	var elems = container.childNodes;
	var highest = 0;
	for (var i = 0; i < elems.length; i++) {
		if (elems[i].nodeType !== 1) continue;
		var zIndex = Number(elems[i].style.zIndex);
		if ((zIndex > highest) && (zIndex != 'auto')) highest = zIndex;
	}
	return highest;
}
function getNodes() {
	var elems = container.childNodes;
	var obj = [];
	for (var i = 0; i < elems.length; i++) {
		if (elems[i].nodeType !== 1) continue;
		var zIndex = Number(elems[i].style.zIndex);
		var rect = [];
		if (!un(elems[i].data)) {
			rect[0] = elems[i].data[100];
			rect[1] = elems[i].data[101];
			rect[2] = elems[i].data[102];
			rect[3] = elems[i].data[103];
		}
		var opacity = elems[i].style.opacity;
		var pointerEvents = elems[i].style.pointerEvents == 'auto' ? true : false;
		obj.push({zIndex:zIndex,node:elems[i],rect:rect,opacity:opacity,pointerEvents:pointerEvents});
	}
	obj.sort(function(a,b) {
		return a.zIndex - b.zIndex;
	});
	return obj;
}

function funcLog() {
	augment(function(name, fn) {
    	console.log("fn " + name);
	});
}
function augment(withFn) {
    var name, fn;
    for (name in window) {
        fn = window[name];
		var exceptions = ['mouseCoordsChange', 'xWindowToCanvas', 'yWindowToCanvas', 'xCanvasToWindow','yCanvasToWindow', 'setTimeout', 'clearTimeout', 'dragMove', 'pointerEventsListen', 'hitTestMouseOver', 'mathsInputCursorBlink', 'drawMathsInputText', 'drawMathsText', 'mapArray', 'removeTags', 'buildArray', 'clearCorrectingInterval', 'logMe', 'boolean', 'replaceAll', 'showObj', 'dist', 'distancePointToLineSegment', 'closestPointOnLineSegment', 'escapeRegExp', 'resizeCanvas', 'arraysEqual','def','un','resizeCanvas3','updateMouse','addListener','createCanvas','newctx','clone','addEventListener','addListenerStart','addListenerEnd','resize','showObj','hideObj','removeEventListener','addListenerMove','clearCanvas','active','inactive','stopDefaultBackspaceBehaviour'];
        if (typeof fn === 'function' && exceptions.indexOf(name) == -1) {
            window[name] = (function(name, fn) {
                var args = arguments;
                return function() {
                    withFn.apply(this, args);
                    return fn.apply(this, arguments);
                }
            })(name, fn);
        }
    }
}
//funcLog();

var mainCanvasLeft = 0;
var mainCanvasTop = 0;
var mainCanvasWidth = 1200;
var mainCanvasHeight = 700;
var mainCanvasMargins = [0,0,0,0]; //l,t,r,b - used in teach: edit mode
var canvasDisplayLeft = 0;
var canvasDisplayTop = 0;
if (typeof mainCanvasBorderWidth == 'undefined') var mainCanvasBorderWidth = 10;
if (typeof mainCanvasFillStyle == 'undefined') var mainCanvasFillStyle = mainCanvasFillStyle || '#FFC';
var mainCanvasMode = 'full';

var pi = String.fromCharCode(0x03C0);
var times = String.fromCharCode(0x00D7);
var divide = String.fromCharCode(0x00F7);
var degrees = String.fromCharCode(0x00B0);
var infinity = String.fromCharCode(0x221E);
var lessThanEq = String.fromCharCode(0x2264);
var moreThanEq = String.fromCharCode(0x2265);
var notEqual = String.fromCharCode(0x2260);
var theta = String.fromCharCode(0x03B8);
var plusMinus = String.fromCharCode(0x00B1);
var minusPlus = String.fromCharCode(0x2213);
var tab = String.fromCharCode(0x21F4);
var br = String.fromCharCode(0x23CE);

var key1 = [];
var key1Data = [];

var mouse = {x:0, y:0};
function updateMouse(e) {
	if (un(e)) return;
	if (e.touches) {
		if (un(e.touches[0])) return;
		var x = e.touches[0].pageX;
		var y = e.touches[0].pageY;
	} else {
		var x = e.clientX || e.pageX;
		var y = e.clientY || e.pageY;
	}
	
	if (!un(draw) && !un(draw.div)) {
		var bounds = draw.drawCanvas[0].getBoundingClientRect();
		mouse.x = (x - bounds.left) * (1200 / bounds.width);
		mouse.y = (y - bounds.top) * (1700 / bounds.height);
		draw.mouse = [mouse.x,mouse.y];
	} else {
		mouse.x = xWindowToCanvas(x);
		mouse.y = yWindowToCanvas(y);
		if (!un(draw) && !un(draw.drawRelPos)) {
			draw.mouse = canvasPosToDrawPos([mouse.x,mouse.y]);
		}
	}
}
function canvasPosToDrawPos(pos) {
	if (un(draw)) return pos;
	return [
		(pos[0]-draw.drawRelPos[0])/draw.scale,
		(pos[1]-draw.drawRelPos[1])/draw.scale
	];
}
function drawPosToCanvasPos(pos) {
	if (un(draw)) return pos;
	return [
		pos[0]*draw.scale+draw.drawRelPos[0],
		pos[1]*draw.scale+draw.drawRelPos[1]
	];
}

var dragObject = [];
var dragObjectData = [];
var currentDragId;
var dragOffset = {x:0, y:0};
var dragArea = {xMin:0,	xMax:0, yMin:0,	yMax:0};

var currMathsInput;
var currMathsInputId;
var mathsInputCursorBlinkInterval;
var mathsInputCursorState;
var mathsInputCursor = {x:0, top:0, bottom:0}
var charMap = [[42,215,215], [48,48,41], [49,49,33], [50,50,34], [51,51,163], [52,52,36], [53,53,37], [54,54,94], [55,55,38], [56,56,215], [57,57,40], [96,48,48], [97,49,49], [98,50,50], [99,51,51], [100,52,52], [101,53,53], [102,54,54], [103,55,55], [104,56,56], [105,57,57], [106,215,215], [107,43,43], [109,189,189], [110,190,190], [111,191,191], [186,59,58], [187,61,43], [188,44,60], [189,45,95], [190,46,62], [191,247,63], [192,39,64], [219,91,123], [220,92,124], [221,93,125], [222,35,126]];
var endInputExceptions = [];
var currSlider;
var slider = [];
var draw;
var keyboard = [];
var keyboardData = [];
var keyboardVis = [];
var showKeys = [];
var hideKeys = [];
var zIndexFront = 1000;

var canvases = [[]];
var mathsInput = [[]];

var container = document.getElementById('canvascontainer');
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var canvasDisplayRect;
var canvasDisplayWidth;
var canvasDisplayHeight;
var canvasMetrics = canvas.getBoundingClientRect();

var openhand = 'url("cursors/openhand.cur"), auto';
var closedhand = 'url("cursors/closedhand.cur"), auto';

var logPointerEvents = false;
window.addEventListener("touchstart", function (e) {
	updateMouse(e);
	if (un(e.target.allowDefault) || e.target.allowDefault == false) e.preventDefault();
	if (logPointerEvents)
		console.log('touchstart', e.target);
}, true);
window.addEventListener("touchmove", function (e) {
	updateMouse(e);
	if (un(e.target.allowDefault) || e.target.allowDefault == false) e.preventDefault();
	if (logPointerEvents)
		console.log('touchmove', e.target);
}, true);
window.addEventListener("touchend", function (e) {
	if (un(e.target.allowDefault) || e.target.allowDefault == false) e.preventDefault();
	if (logPointerEvents)
		console.log('touchend', e.target);
}, true);
window.addEventListener("pointerstart", function (e) {
	if (un(e.target.allowDefault) || e.target.allowDefault == false) e.preventDefault();
	if (logPointerEvents) console.log('pointerstart');
}, true);
window.addEventListener("pointermove", function (e) {
	if (un(e.target.allowDefault) || e.target.allowDefault == false) e.preventDefault();
	//if (logPointerEvents) console.log('pointermove');
}, true);
window.addEventListener("pointerend", function (e) {
	if (un(e.target.allowDefault) || e.target.allowDefault == false) e.preventDefault();
	if (logPointerEvents) console.log('pointerend');
}, true);
window.addEventListener("mousedown", function (e) {
	updateMouse(e);
	if (e.target.allowDefault === true) return;
	e.preventDefault();
	if (logPointerEvents) console.log('mousedown');
}, true);
window.addEventListener("mousemove", function (e) {
	updateMouse(e);
	if (un(e.target.allowDefault) || e.target.allowDefault == false) e.preventDefault();
	if (logPointerEvents)
		console.log('mousemove');
}, true);
window.addEventListener("mouseup", function (e) {
	if (e.target.allowDefault === true) return;
	e.preventDefault();
	if (logPointerEvents) console.log('mouseup');
}, true);

window.addEventListener('resize', resize, false);
window.addEventListener('orientationchange', resize, false);
window.addEventListener('keydown', stopDefaultBackspaceBehaviour, false);
//window.addEventListener('mousemove', updateMouse, false);
//window.addEventListener('touchstart', updateMouse, false);
//window.addEventListener('touchmove', updateMouse, false);
var foc = true;
var blinking = false;
window.addEventListener('focus', function () {
	foc = true;
	if (blinking == true) {
		setTimeout(function () {
			mathsInputCursorBlinkInterval = setCorrectingInterval(function () {
					mathsInputCursorBlink()
				}, 600);
		}, 100);
	}
});
window.addEventListener('blur', function () {
	foc = false;
	if (blinking == true) {
		clearCorrectingInterval(mathsInputCursorBlinkInterval);
		inputCursorState = false;
		drawMathsInputText(currMathsInput);
	}
	if (typeof currMathsInput !== 'undefined')
		endMathsInput();
});
var makePDFLoaded = false;
function loadMakePDF(callback) {
	if (makePDFLoaded == false) {
		makePDFLoaded = true;
		window.callback = callback;
		loadScript('pdfmake.min.js',loadMakePDF2);
	} else {
		callback();
	}	
}
function loadMakePDF2() {
	var callback = window.callback;
	delete window.callback;
	loadScript('vfs_fonts.js',callback);
}

/*window.addEventListener('touchstart',touchPreventDefault,false);
window.addEventListener('touchmove',touchPreventDefault,false);
window.addEventListener('touchend',touchPreventDefault,false);
var touchPreventDefault = function(e) {
	e.preventDefault;
}

var isMobile = {
	Android: function () {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function () {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function () {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function () {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function () {
		return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
	},
	any: function () {
		return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
	}
}
if (isMobile.any()) {
	document.getElementsByTagName("head")[0].innerHTML += '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">'
	document.ontouchmove = function (event) {
		event.preventDefault()
	}
}
*/

if (isTask == true) {
	var page = [];
	if (boolean(window.sortPages,true) == true) {
		pages.sort(function(a,b) {
			return Number(a.order) - Number(b.order);
		});
	}
	//pages.reverse();
	prevPages.sort(function(a,b) {
		var d1 = new Date(a.timestamp).getTime();
		var d2 = new Date(b.timestamp).getTime();
		return d2-d1;
	});
	for (var i = 0; i < prevPages.length; i++) {
		if (Number(prevPages[i].percentage < 100)) continue;
		var pageId = Number(prevPages[i].pageid);
		for (var j = 0; j < pages.length; j++) {
			if (Number(pages[j].pageid) == pageId) {
				if (un(pages[j].prev)) {
					pages[j].prev = prevPages[i].timestamp;
				}
				break;
			}
		}
	}
}

if (typeof FontFace !== 'undefined') {
	document.fonts.ready.then(function(res) {
		//console.log(document.fonts.size, 'FontFaces loaded.');
		//console.log('result',res);
		loadScripts1();
	}, function(err) {
		//console.log('error',err);
		loadScripts1();
	});
} else {
	loadScripts1();
}

function loadScripts1() {
	for (var i = 0; i < scriptsToLoad.length; i++) {
		loadScript(scriptsToLoad[i], scriptLoaded);
	}
}
function loadScript(url, callback, errorCallback, index) {
	if (un(errorCallback)) errorCallback = function() {};
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.charset = "UTF-8";
	var url2 = typeof cacheVersion === 'string' ? url + '?' + cacheVersion : url;
	script.src = url2;
	script.index = index;
	script.onload = function() {
		if (!un(callback)) callback(this.index);
	};
	script.onerror = function() {
		if (!un(errorCallback)) errorCallback(this.index);
	};
	head.appendChild(script);
}
function scriptLoaded() {
	loadedScriptCount++;
	if (loadedScriptCount >= scriptsToLoad.length) {
		clearCanvas();
		if (boolean(isTask,true) == true) {
			window.holder = createHolder();
			showPage(0);
		} else {
			if (!un(scriptsToLoad2)) {
				for (var i = 0; i < scriptsToLoad2.length; i++) {
					loadScript(scriptsToLoad2[i]);
				}
			}
		}
		resize();
		if (isTask == true) {
			TimeMe.initialize({
				currentPageName: "page",
				idleTimeoutInSeconds: idleTimeoutInSeconds
			});
			TimeMe.callWhenUserLeaves(function(){
				inactive();
			});
			TimeMe.callWhenUserReturns(function(){
				active();
			});
			if (typeof taskLogData == 'undefined') return;
			if (Number(taskLogData.status) < 3) {
				TimeMe.callAfterTimeElapsedInSeconds(reportIntervalInSeconds,reportHandler);
			}
		}
	}
}
var inactiveBox;

function openPHP(url,postVars) {
    var form = document.createElement("form");
    form.target = "_blank";
    form.method = "POST";
    form.action = url;
    form.style.display = "none";

    for (var key in postVars) {
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = encodeURIComponent(postVars[key]);
        form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}

if (isTask == true) {
	var pointsMode = false;
	
	var pageLoadErrorCount = 0;
	var faded = false;
	function createInactiveBox() {
		inactiveBox = document.createElement('canvas');	
		inactiveBox.width = 400;
		inactiveBox.height = 120;
		inactiveBox.setAttribute('position', 'absolute');
		inactiveBox.setAttribute('cursor', 'auto');
		inactiveBox.setAttribute('draggable', 'false');
		inactiveBox.setAttribute('class', 'buttonClass');
		
		var ctx = inactiveBox.getContext('2d');
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		ctx.clearRect(0, 0, 400, 120);
		ctx.fillStyle = "#FFF";
		ctx.strokeStyle = "#000";
		ctx.lineWidth = 6;
		ctx.beginPath();
		ctx.moveTo(3, 3);
		ctx.lineTo(397, 3);
		ctx.lineTo(397, 117);
		ctx.lineTo(3, 117);
		ctx.lineTo(3, 3);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		ctx.font = "80px Hobo";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStyle = "#000";
		ctx.fillText('Inactive', 200, 66);
		inactiveBox.style.pointerEvents = 'default';
		inactiveBox.style.cursor = 'default';
		inactiveBox.style.zIndex = 900000000;
		resize();
		return inactiveBox;
	}	
	
	//*
	var idleTimeoutInSeconds = 2*60;
	var reportIntervalInSeconds = 4*60;
	function reportHandler() {
		if (Number(taskLogData.status) == 3 || userType !== 0) return;
		logTime();
		if (un(TimeMe)) return;
		clearReportTimeouts();
		var time = Math.round(TimeMe.getTimeOnPageInSeconds('page'));
		TimeMe.callAfterTimeElapsedInSeconds(time+reportIntervalInSeconds,reportHandler);
	}
	function clearReportTimeouts() {
		for (var i = TimeMe.timeElapsedCallbacks.length - 1; i >= 0; i--) {
			TimeMe.timeElapsedCallbacks[i].pending = false;
		}
	}
	
	function active(e) {
		/*unfadePage();
		/if (!un(inactiveBox)) {
			if (inactiveBox.parentNode == container) {
				container.removeChild(inactiveBox);
			}
		}*/
		removeListenerStart(window,active);
		//console.log('active');	
	}
	function inactive() {
		/*fadePage();
		if (un(inactiveBox)) inactiveBox = createInactiveBox();
		container.appendChild(inactiveBox);*/
		addListenerStart(window,active);
		//console.log('inactive');
	}	
	
	function logTime() {
		if (userType !== 0) return;
		if (Number(taskLogData.percentage) == 100 || Number(taskLogData.status) == 3) {
			clearReportTimeouts();
			return;
		}
		var timeSpent = Math.round(TimeMe.getTimeOnPageInSeconds('page')/60);
		var browserInfo = getBrowserInfo();
		var params = "tasksLogId="+taskLogData.taskNumber+"&timeSpent="+timeSpent+"&browserInfo="+browserInfo;
		//console.log('logTime params: ', params);
		var sendReportX = new XMLHttpRequest();
		sendReportX.open("post", "_logTime.php", true);
		sendReportX.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		sendReportX.errorCallback = function() {};
		sendReportX.onreadystatechange = function() {
			if (this.readyState == 4) {
				if (this.status !== 200) {
					if (typeof this.errorCallback == 'function') this.errorCallback();
					return;
				}
				//console.log('logTime sent');
				//reportHandler();
			} 
		}
		sendReportX.send(params);
	}		
	
	//*/
	
	/*
	var inactiveAfter = 300;
	var inactiveStartTime;
	var inactiveTime = 0;
	var isActive = true;
	var startTime = new Date();
	var activityMonitor = setTimeout(function(){inactive()}, inactiveAfter*1000);

	window.addEventListener('mouseup', active, false);
	window.addEventListener('touchend', active, false);
	window.addEventListener('mousedown', active, false);
	window.addEventListener('touchstart', active, false);
	window.addEventListener('keydown', active, false);
	window.addEventListener('blur', inactive, false);
	
	function active(event) {
		if (!un(event) && event.target.nodeName !== 'TEXTAREA') event.preventDefault();
		if (isTask == true) {
			clearTimeout(activityMonitor);
			activityMonitor = setTimeout(function(){inactive()}, inactiveAfter*1000);
			if (isActive == false && pageIndex !== pages.length) {
				isActive = true;
				var currentTime = new Date();
				inactiveTime += (currentTime - inactiveStartTime);
				if (inactiveBox.parentNode == container) container.removeChild(inactiveBox);
				unfadePage();
			}
		}
	}	
	function inactive() {
		clearTimeout(activityMonitor);
		isActive = false;
		inactiveStartTime = new Date();
		if (boolean(window.logPages,false) == false) {
			fadePage();
			if (un(inactiveBox)) inactiveBox = createInactiveBox();
			container.appendChild(inactiveBox);
		}
	}
	
	function getTimeSpent() {
		var currentTime = new Date();
		var ms = currentTime - startTime - inactiveTime;
		return Math.floor(ms/1000);	
	}
	function getTime() {
		var currentTime = new Date();
		var timeSpent = currentTime - startTime - inactiveTime;
		timeSpent /= 60000;
		return Math.round(timeSpent+Number(taskLogData.prevTime));
	}	
	
	function logTime() {
		if (userType !== 0) return;
		if (Number(taskLogData.percentage) == 100 || Number(taskLogData.status) == 3) {
			clearTimeout(minuteCounter);
			return;
		}
		if (isActive == true) {
			var timeSpent = getTime();
			var browserInfo = getBrowserInfo();
			var params = "tasksLogId="+taskLogData.taskNumber+"&time="+timeSpent+"&inactiveTime="+inactiveTime+"&browserInfo="+browserInfo;
			//console.log('logTime params: ', params);
			var sendReportX = new XMLHttpRequest();
			sendReportX.open("post", "_logTime.php", true);
			sendReportX.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			sendReportX.onload = function() {
				//var response = (this.responseText).split(';');
				//console.log('logTime response: ', this.responseText);
				taskLogData.totalTime = this.responseText;
				connectionErrorMessage = 0;
			}
			sendReportX.onreadystatechange = function() {
				if (sendReportX.readyState == 4 && sendReportX.status !== 200 && connectionErrorMessage == 0) {
					alert('Error connecting to the MathsPad database. Your results may not be logged. Check your internet connection.');
					connectionErrorMessage = 1;
				} 
			}
			sendReportX.send(params);
		}
		clearTimeout(minuteCounter);
		minuteCounter = setTimeout(function(){logTime()}, 4*60000);	
	}	
	if (userType == 0) {
		taskLogData.prevTime = taskLogData.totalTime;
		taskLogData.prevStatus = taskLogData.status;
		taskLogData.prevPercentage = taskLogData.percentage;
		var connectionErrorMessage;
		var minuteCounter = setTimeout(function(){logTime()}, 4*60000);
	}	
	//*/
	
	function fadePage() {
		if (faded == true) return;
		var nodes = container.childNodes;
		for (var n = 0; n < nodes.length; n++) {
			if (nodes[n].nodeType !== 1 || nodes[n] == inactiveBox) continue;
			nodes[n].savedOpacity = nodes[n].style.opacity;
			nodes[n].style.opacity = 0.5;
		}
		faded = true;
	}
	function unfadePage() {
		var nodes = container.childNodes;
		for (var n = 0; n < nodes.length; n++) {
			if (nodes[n].nodeType !== 1) continue;
			var opacity = !un(nodes[n].savedOpacity) ? nodes[n].savedOpacity : 1;
			nodes[n].style.opacity = opacity;
			delete nodes[n].savedOpacity;
		}
		faded = false;
	}
	
	function createHolder() {
		var prev = playButton(20,20,50,prevPage,{dir:'left',fillColor:'#3FF',lineWidth:4,radius:8,zIndex:1000});
		var next = playButton(1200-20-50,20,50,nextPage,{dir:'right',fillColor:'#3FF',lineWidth:4,radius:8,zIndex:1000});
		var reload = newctx({rect:[1200-130,20,50,50],pe:true,zIndex:1000});
		addListener(reload.canvas,reloadPage);
		drawRefreshButton(reload,4,4,42,'#C9F','left');
		var canvas = newctx({rect:[0,0,1200,700],z:1}).canvas;
		showObj(canvas);
		var check = newctx({rect:[1200-340,20,200,50],pe:true,z:10000000}).canvas;
		text({ctx:check.ctx,textArray:['<<fontSize:32>><<font:Hobo>>Check Answer'],left:2,top:2,width:196,height:46,align:'center',vertAlign:'middle',box:{type:'loose',borderColor:'#000',borderWidth:4,radius:8,color:'#6F9'}});
		addListenerEnd(check,checkPage);
		var home2 = newctx({rect:[712,555,386,80],pe:true,zIndex:1000}).canvas;
		text({ctx:home2.ctx,rect:[2,2,382,76],text:['<<font:Hobo>><<fontSize:32>>Return to My Profile    '],align:'right',vertAlign:'middle',box:{type:'loose',borderColor:'#000',borderWidth:4,color:'#FFF',radius:8},allowSpaces:true});
		var home = newctx({rect:[80,20,50,50],pe:true,zIndex:1000}).canvas;
		roundedRect2(home.ctx,2,2,46,46,8,4,'#000','#FFF');
		var homeImage = new Image;
		homeImage.onload = function() {
			holder.home.ctx.drawImage(homeImage, 4.5, 4, 42, 42);
			
			var image = holder.home.ctx.getImageData(0, 0, 500, 200);
			var imageData = image.data,
			length = imageData.length;
			for (var i=0; i < length; i+=4) {
				if (imageData[i] == 255 && imageData[i+1] == 255 && imageData[i+2] == 255) imageData[i+3] = 50;
			}
			image.data = imageData;
			
			roundedRect2(home.ctx,2,2,46,46,8,4,'#000','#FFF');			
			holder.home.ctx.putImageData(image, 0, 0);
			roundedRect2(holder.home.ctx,2,2,46,46,8,4,'#000');
			
			holder.home2.ctx.drawImage(homeImage, 12, 8, 42*1.5, 42*1.5);
		}
		homeImage.src = "/Images/logoSmall.PNG";
		var loading = newctx({pe:true,z:1000000}).canvas;
		loading.style.cursor = 'default';
		textBox(loading.ctx,[425,295,350,110],['<<fontSize:56>><<font:Hobo>>Loading...'],'#3FF');
		var disablePeCanvas = newctx({pe:true,zIndex:1000000000000}).canvas;
		disablePeCanvas.style.cursor = 'default';
		var summary = newctx().canvas;
		var summary2 = newctx({z:3}).canvas;
		return {prev:prev,next:next,reload:reload.canvas,canvas:canvas,check:check,home:home,loading:loading,feedback:[],feedbackButton:[],completed:[],disablePeCanvas:disablePeCanvas,summary:summary,summary2:summary2,home2:home2};
	}
	function prevPage() {
		if (pageIndex == 0) return;
		hidePage();
		pageIndex--;
		showPage();
	}
	function nextPage() {
		if (pageIndex == pages.length - 1) return;
		hidePage();
		pageIndex++;
		showPage();
	}
	function goToPage(num) {
		if (un(num)) num = pages.length - 1;
		if (num < 0 || num > pages.length-1) return;
		hidePage();
		pageIndex = roundToNearest(num,1);
		showPage();		
	}
	function hidePage() {
		endMathsInput();
		unfadePage();
		keyboardHardOpen = false;
		hideKeyboard2();
		if (pageIndex < pages.length) {
			for (var c = 0; c < canvases[pageIndex].length; c++) {
				if (canvases[pageIndex][c].parentNode == container) {
					container.removeChild(canvases[pageIndex][c]);
				}
			}
			for (var m = 0; m < mathsInput[pageIndex].length; m++) {
				hideMathsInput(mathsInput[pageIndex][m]);
			}
			for (var s = 0; s < pages[pageIndex].stars.length; s++) {
				hideObj(pages[pageIndex].stars[s]);
				//pages[pageIndex].stars[s].stopSpin();
			}	
		}
		if (!un(draw) && !un(draw.drawCanvas)) {
			pages[pageIndex].paths = draw.path;
			pages[pageIndex].beforeDraw = draw.beforeDraw;
			pages[pageIndex].afterDraw = draw.afterDraw;
			pages[pageIndex].drawMode = draw.drawMode;
			
			delete draw.beforeDraw;
			delete draw.afterDraw;
			draw.path = [];
			drawCanvasPaths();
			calcCursorPositions();
		}
		holder.canvas.ctx.clearRect(0,80,1200,620);	
		hideObj(holder.feedbackButton[pageIndex]);		
		hideObj(holder.completed[pageIndex]);
		hideObj(holder.summary);
		hideObj(holder.summary2);
		hideObj(holder.home2);
	}
	function showPage() {
		/*if (pageIndex == pages.length) {
			showSummaryPage();
			return;
		}*/
		active();
		if (un(page[pageIndex])) {
			pageLoadErrorCount++;
			loadPage(function() {
				if (boolean(p.taskPageAutoLoad,false) == true) {
					taskPageAutoLoad(p);
				};
				pages[pageIndex].paths = draw.path;
				pages[pageIndex].beforeDraw = draw.beforeDraw;
				pages[pageIndex].afterDraw = draw.afterDraw;
				showPage();
			},function() {
				page[pageIndex] = undefined;
				if (pageLoadErrorCount < 3) prevPage();
				Notifier.error('Error connecting to the server. The page cannot be loaded.');
			});
		} else {
			for (var c = 0; c < canvases[pageIndex].length; c++) {
				if (canvases[pageIndex][c].vis == true) {
					container.appendChild(canvases[pageIndex][c]);
				}
			}
			for (var m = 0; m < mathsInput[pageIndex].length; m++) {
				showMathsInput(mathsInput[pageIndex][m]);
			}
			
			holder.canvas.ctx.clearRect(0,0,1200,700);	
			if (boolean(window.logPages,false) == false) {
				textBox(holder.canvas.ctx,[140,20,100,50],['<<fontSize:28>><<font:Hobo>>'+String(pageIndex+1)+' / '+String(pages.length)],'#CCF');
				drawPoints();
				for (var s = 0; s < pages[pageIndex].stars.length; s++) {
					if (pages[pageIndex].stars[s].show == true) {
						showObj(pages[pageIndex].stars[s]);
					}
				}
				if (pages[pageIndex].completed == false && un(pages[pageIndex].prev)) {
					if (boolean(page[pageIndex].showHolderCheckButton,true) == true) {
						showObj(holder.check);
					} else {
						hideObj(holder.check);
					}
					holder.reload.style.opacity = 1;
					holder.reload.style.pointerEvents = 'auto';
					if (pointsMode == true) holder.canvas.ctx.rect2({rect:[650+2,20+2,200-4,50-4],lineWidth:4,color:'#000',radius:8});
					if (!un(holder.feedback[pageIndex]) && holder.feedback[pageIndex].fb == true) {
						showObj(holder.feedbackButton[pageIndex]);
					} else {
						hideObj(holder.feedbackButton[pageIndex]);
					}			
				} else if (pages[pageIndex].completed == true) {
					hideObj(holder.check);
					showObj(holder.completed[pageIndex]);			
					text({ctx:holder.canvas.ctx,left:650,width:410,top:20,height:50,align:'center',vertAlign:'middle',textArray:['<<fontSize:36>><<font:Hobo>><<color:#090>>Page Completed!']});
					holder.reload.style.opacity = 0.5;
					holder.reload.style.pointerEvents = 'none';
					hideObj(holder.feedbackButton[pageIndex]);
				} else if (!un(pages[pageIndex].prev)) {
					if (boolean(page[pageIndex].showHolderCheckButton,true) == true) {
						showObj(holder.check);
					} else {
						hideObj(holder.check);
					}
					showObj(holder.completed[pageIndex]);
					holder.reload.style.opacity = 1;
					holder.reload.style.pointerEvents = 'auto';
					if (pointsMode == true) holder.canvas.ctx.rect2({rect:[650+2,20+2,200-4,50-4],lineWidth:4,color:'#000',radius:8});
					if (!un(holder.feedback[pageIndex]) && holder.feedback[pageIndex].fb == true) {
						showObj(holder.feedbackButton[pageIndex]);
					} else {
						hideObj(holder.feedbackButton[pageIndex]);
					}						
				}
				showObj(holder.reload);
				showObj(holder.home);
			} else {
				var filename = String(pageData[pageIndex].pageid);
				while (filename.length < 4) filename = "0"+filename;
				textBox(holder.canvas.ctx,[80,20,100,50],['<<fontSize:28>><<font:Hobo>>'+String(filename)],'#CCF');
				if (typeof preview !== 'undefined' && !un(preview.button)) showObj(preview.button);
			}
			showObj(holder.prev);
			showObj(holder.next);
			hideObj(holder.loading);
			if (boolean(page[pageIndex].allowReload,true) == false) {
				hideObj(holder.reload);
			} else {
				showObj(holder.reload);
			}
				
			if (!un(draw) && !un(draw.drawCanvas)) {
				draw.path = pages[pageIndex].paths || [];
				draw.beforeDraw = pages[pageIndex].beforeDraw;
				draw.afterDraw = pages[pageIndex].afterDraw;
				if (!un(pages[pageIndex].drawMode)) {
					if (draw.drawMode !== pages[pageIndex].drawMode) {
						changeDrawMode(pages[pageIndex].drawMode);
					}
				}
				drawCanvasPaths();
				calcCursorPositions();
				for (var i = 0; i < draw.drawCanvas.length; i++) showObj(draw.drawCanvas);
				showObj(draw.cursorCanvas);
			}
		
			if (pageIndex == 0) {
				holder.prev.style.opacity = 0.5;
				holder.prev.style.pointerEvents = 'none';
			} else {
				holder.prev.style.opacity = 1;
				holder.prev.style.pointerEvents = 'auto';
			}
			if (pageIndex == pages.length - 1) {
				holder.next.style.opacity = 0.5;
				holder.next.style.pointerEvents = 'none';
			} else {
				holder.next.style.opacity = 1;
				holder.next.style.pointerEvents = 'auto';
			}			

			if (typeof keyboardButton1[pageIndex] !== 'undefined') {
				showObj(keyboardButton1[pageIndex]);
			}
			resize();
			p = page[pageIndex];
			if (boolean(window.logPages,false) == true) {
				if (typeof pageDataLog == 'function') pageDataLog();
				if (typeof savePagePNG == 'function') savePagePNG();
			}
			pageLoadErrorCount = 0;
		}
	}
	/*function showSummaryPage() {
		holder.canvas.ctx.clearRect(0,0,1200,700);	
		hideObj(holder.check);
		hideObj(holder.reload);
		hideObj(holder.home);
		holder.next.style.opacity = 0.5;
		holder.next.style.pointerEvents = 'none';	
		
		var ctx = holder.summary.ctx;
		var ctx2 = holder.summary2.ctx;
		ctx.clear();
		ctx2.clear();
		text({ctx:ctx,rect:[120,5,1000,80],text:['<<font:Hobo>><<fontSize:36>>Task Summary'],vertAlign:'middle'});
		
		var l = 712;
		var t = 130;
		text({ctx:ctx,left:l,width:386,top:t,height:46,vertAlign:'middle',textArray:['<<fontSize:24>>'+userName],box:{type:'loose',radius:8,color:'#CFF',borderColor:'#000',borderWidth:4,padding:10}});
		if (pointsMode == true) {
			text({ctx:ctx,left:l,width:386,top:t,height:46,align:'right',vertAlign:'middle',textArray:['<<fontSize:24>><<color:#00F>><<bold:true>>'+userPoints+'       '],allowSpaces:true});
			ctx.beginPath();
			ctx.lineWidth = 4;
			ctx.strokeStyle = '#000';
				drawStar({ctx:ctx,c:[l+361,t+23],r:12});
			ctx.closePath();
			ctx.stroke();
			ctx.beginPath();
			ctx.fillStyle = '#00F';
				drawStar({ctx:ctx,c:[l+361,t+23],r:12});		
			ctx.fill();	
		}
		
		var cells = [];
		var comp = 0;
		var totalPoints = 0;
		for (var r = 0; r < pages.length; r++) {
			if (pages[r].completed == true) {
				comp++;
				totalPoints += pages[r].points;			
				cells[r] = [
					{text:['Page '+(r+1)],color:'#CFC'},
					{minWidth:180,text:['<<color:#060>>Completed!'],color:'#CFC'}
				];
				if (pointsMode == true) cells[r].push({minWidth:200,color:'#CFC'});
			} else if (!un(pages[r].prev)) {
				comp++;
				cells[r] = [
					{text:['Page '+(r+1)],color:'#CFC'},
					{minWidth:180,text:['<<color:#060>>Completed!'],color:'#CFC'}
				];
				if (pointsMode == true) cells[r].push({minWidth:200,color:'#CFC'});
			} else {
				cells[r] = [
					{text:['Page '+(r+1)]},
					{minWidth:180,text:['Keep Trying!']}
				];
				if (pointsMode == true) cells[r].push({minWidth:200});
			}
		}
		
		var table = drawTable2({
			ctx:ctx,
			left:102,
			top:t,
			minCellWidth:100,
			minCellHeight:40,
			horizAlign:'center',
			text:{font:'Hobo',size:28,color:'#000'},
			outerBorder:{show:true,width:4,color:'#000'},
			innerBorder:{show:true,width:2,color:'#000'},
			cells:cells
		});
		
		if (pointsMode == true) {
			for (var r = 0; r < pages.length; r++) {
				var c = table.cell[r][2];
				var rect = [c.left,c.top,c.width,c.height];
				var l = rect[0]+rect[2]/2-(pages[r].points-1)*17.5;
				var t = (table.yPos[r]+table.yPos[r+1])/2;
				ctx2.lineWidth = 4;
				if (pages[r].completed == true) {
					ctx2.strokeStyle = '#000';
					ctx2.fillStyle = '#FC3';
				} else if (!un(pages[r].prev)) {
					ctx2.strokeStyle = '#666';
					ctx2.fillStyle = '#CFC';			
				} else {
					ctx2.strokeStyle = '#666';
					ctx2.fillStyle = '#FFC';				
				}
				for (var s = 0; s < pages[r].points; s++) {
					ctx2.beginPath();
						drawStar({ctx:ctx2,c:[l,t],r:12});
					ctx2.closePath();
					ctx2.stroke();
					ctx2.beginPath();
						drawStar({ctx:ctx2,c:[l,t],r:12});		
					ctx2.fill();
					l += 35;
				}
			}
		}
		
		if (pointsMode == true) {
			textBox(ctx2,[712,190,386,350],['<<fontSize:26>>Task Progress: '+String(taskLogData.percentage)+'%'+br+br+'Points earned: '+totalPoints+br+br+'Time Spent: '+String(taskLogData.totalTime)+' mins'+br+br+'<<bold:true>><<color:#060>>Your progress has'+br+'been logged.'],'#CFF');
		} else {
			textBox(ctx2,[712,190,386,350],['<<fontSize:26>>Task Progress: '+String(taskLogData.percentage)+'%'+br+br+'Time Spent: '+String(taskLogData.totalTime)+' mins'+br+br+'<<bold:true>><<color:#060>>Your progress has'+br+'been logged.'],'#CFF');			
		}
		
		showObj(holder.summary);
		showObj(holder.summary2);
		showObj(holder.home2);
		inactive();
		resize();
	}*/
	function loadPage(callback,errorCallback) {
		showObj(holder.loading);
		holder.prev.style.pointerEvents = 'none';
		holder.prev.style.opacity = 0.5;
		holder.next.style.pointerEvents = 'none';
		holder.next.style.opacity = 0.5;
		if (un(errorCallback)) errorCallback = function() {};
		var filename = pages[pageIndex].pageid;
		while (filename.length < 4) {
			filename = "0" + filename;
		}
		pages[pageIndex].filename = filename;
		if (!un(pages[pageIndex].prev)) {
			pages[pageIndex].maxPoints = 1;
			pages[pageIndex].points = 1;
			holder.completed[pageIndex] = textCanvas([600-450/2,285,450,170],[''],'#EEE').canvas;
			resizeCanvas3(holder.completed[pageIndex]);
			var date = new Date(pages[pageIndex].prev.slice(0,pages[pageIndex].prev.indexOf(" ")));
			pages[pageIndex].prevDate = ['Sun','Mon','Tues','Weds','Thurs','Fri','Sat'][date.getDay()]+" "+date.getDate()+" "+['Jan','Feb','Mar','Apr','May','June','July','Aug','Sep','Oct','Nov','Dec'][date.getMonth()]+" "+date.getFullYear();
			if (pointsMode == true) {
				text({ctx:holder.completed[pageIndex].ctx,left:0,top:16,width:450,height:100,textArray:['<<fontSize:50>><<font:Hobo>>Page Completed!<<fontSize:36>>'+br+'<<font:Arial>><<fontSize:20>>Completed on '+pages[pageIndex].prevDate+br+'Click to practise again for an extra point'],align:'center'});
			} else {
				text({ctx:holder.completed[pageIndex].ctx,left:0,top:28,width:450,height:100,textArray:['<<fontSize:50>><<font:Hobo>>Page Completed!<<fontSize:36>>'+br+'<<font:Arial>><<fontSize:20>>Completed on '+pages[pageIndex].prevDate],align:'center'});
				text({ctx:holder.completed[pageIndex].ctx,left:450-100,top:0,width:100,height:30,textArray:['<<fontSize:26>><<font:Arial>>'+times+'<<fontSize:14>>Dismiss'],align:'center',vertAlign:'middle'});
			}
			holder.completed[pageIndex].style.pointerEvents = 'auto';
			holder.completed[pageIndex].style.zIndex = 10000000;
			addListener(holder.completed[pageIndex],function() {
				hideObj(holder.completed[pageIndex]);
			});		
		} else {
			pages[pageIndex].maxPoints = Number(pages[pageIndex].points);
			pages[pageIndex].points = Number(pages[pageIndex].points);		
		}
		pages[pageIndex].completed = false;
		pages[pageIndex].stars = [];
		var l = 650+100-(pages[pageIndex].maxPoints-1)*17.5;
		if (pointsMode == true) {
			for (var s = 0; s < pages[pageIndex].maxPoints; s++) {
				var star = newctx({rect:[l+s*35-17.5,45-17.5,35,35],z:100000000}).canvas;
				star.color = ['#FC3','#000'];
				star.draw = function() {
					this.ctx.clear();
					this.ctx.beginPath();
					this.ctx.lineWidth = 4;
					this.ctx.strokeStyle = this.color[1];
						drawStar({ctx:this.ctx,c:[17.5,17.5],r:12});
					this.ctx.closePath();
					this.ctx.stroke();
					this.ctx.beginPath();
					this.ctx.fillStyle = this.color[0];
						drawStar({ctx:this.ctx,c:[17.5,17.5],r:12});		
					this.ctx.fill();
				}
				star.draw();
				star.click = function() {
					do {
						var color = ['#FC3','#F00','#33F','#3FF','#0C0','#CCC'][ran(0,5)];
					} while(this.color[0] == color);
					this.color[0] = color;
					this.draw();
				}
				star.show = true;
				pages[pageIndex].stars[s] = star;
			}
		}
		var feedbackButton = textCanvas([1130,90,50,50],['<<font:Hobo>><<fontSize:30>>!'],'#FC9').canvas;
		feedbackButton.style.zIndex = 1000;
		addListenerStart(feedbackButton,toggleFeedback);
		holder.feedbackButton[pageIndex] = feedbackButton;
		window.p = page[pageIndex] = {};
		mathsInput[pageIndex] = [];
		canvases[pageIndex] = [];
		loadScript('pages/'+filename+'.js',function() {
			page[pageIndex] = p;
			callback();
		},errorCallback);
	}
	function reloadPage() {
		for (var c = 0; c < canvases[pageIndex].length; c++) {
			canvases[pageIndex][c].data[100] = canvases[pageIndex][c].data[0];
			canvases[pageIndex][c].data[101] = canvases[pageIndex][c].data[1];
			resizeCanvas3(canvases[pageIndex][c]);
			canvases[pageIndex][c].style.zIndex = canvases[pageIndex][c].z;
		}
		for (var m = 0; m < mathsInput[pageIndex].length; m++) {
			setMathsInputText(mathsInput[pageIndex][m],[""]);
		}	
		if (!un(page[pageIndex].dragSnapPos)) {
			for (var d = 0; d < page[pageIndex].dragSnapPos.length; d++) {
				page[pageIndex].dragSnapPos[d][4] = null;
			}
		}
		p = page[pageIndex];
		if (!un(page[pageIndex].reload)) {
			page[pageIndex].reload();
		} else if (!un(page[pageIndex].taskPageAutoLoad)) {
			taskPageAutoReload(page[pageIndex]);
		}
		if (!un(page[pageIndex].clear)) {
			page[pageIndex].clear();
		}	
		removeFeedback();
	}
	function shuffleTableCells(obj) {
		var cells = [];
		for (var r = 0; r < obj.cells.length; r++) {
			for (var c = 0; c < obj.cells[r].length; c++) {
				cells.push(obj.cells[r][c]);
			}
		}
		cells = shuffleArray(cells);
		for (var r = 0; r < obj.cells.length; r++) {
			for (var c = 0; c < obj.cells[r].length; c++) {
				obj.cells[r][c] = cells.shift();
			}
		}
		return obj;
	}
	function taskPageAutoLoad(p) {
		//console.log(p);
		p.ctx1 = newctx();
		p.ctx2 = newctx({z:1000});
		
		var paths = p.paths;
		var shuffleInputs = [];
		var shufflePos = [];
		
		var dragCheckMode = 'none';
		var dragCanvasCount = 0;
		var dragAreaCount = 0;
		var dragSnapAreaCount = 0;
		for (var p2 = 0; p2 < paths.length; p2++) {
			var path = paths[p2];
			if (un(path.isInput)) continue;
			if (path.isInput.type == 'drag') {
				dragCanvasCount++;
			} else if (path.isInput.type == 'dragArea') {
				if (path.isInput.snap == true) {
					dragSnapAreaCount++;
				} else {
					dragAreaCount++;
				}
			}
		}
		if (dragCanvasCount > 0) {
			if (dragSnapAreaCount > 0) {
				dragCheckMode = 'dragArea';
			} else {
				dragCheckMode = 'dragCanvas';
			}
		}
		
		for (var p2 = 0; p2 < paths.length; p2++) {
			var path = paths[p2];
			if (un(path.isInput)) continue;
			for (var o = 0; o < path.obj.length; o++) {
				var obj = path.obj[o];
				if (obj.type == 'text2' && path.isInput.type == 'text') {
					obj.draw = false;
					if (typeof p.inputs == 'undefined') p.inputs = [];
					var input = createMathsInput2({left:obj.rect[0],top:obj.rect[1],width:obj.rect[2],height:obj.rect[3],fontSize:32,algText:boolean(path.isInput.algText,false)});
					input.pathObj = obj;
					input.type = 'text';
					if (!un(path.isInput.tickStyle)) input.tickStyle = path.isInput.tickStyle;
					p.inputs.push(input);
				} else if (obj.type == 'table2' && path.isInput.type == 'select') {
					if (typeof p.inputs == 'undefined') p.inputs = [];
					obj.isInput = path.isInput;
					var multiSelect = boolean(path.isInput.multiSelect,false);
					var checkSelectCount = boolean(path.isInput.checkSelectCount,true);
					var shuffle = boolean(path.isInput.shuffle,false);
					
					var input = {type:'select',buttons:[],multiSelect:multiSelect,checkSelectCount:checkSelectCount,shuffle:shuffle};
					p.inputs.push(input);
					
					if (shuffle == true) shuffleTableCells(obj);

					var yPos = obj.top;
					for (var r = 0; r < obj.cells.length; r++) {
						var xPos = obj.left; 
						for (var c = 0; c < obj.cells[r].length; c++) {
							var button = newctx({rect:[xPos,yPos,obj.widths[c],obj.heights[r]],pE:true,z:100}).canvas;
							button.input = input;
							button.cell = obj.cells[r][c];
							button.row = r;
							button.col = c;
							button.obj = obj;
							addListener(button,taskPageSelectButtonClick);	
							input.buttons.push(button);
							
							obj.cells[r][c].toggle = false;
							xPos += obj.widths[c];
						}
						yPos += obj.heights[r];
					}
				} else if (path.isInput.type == 'drag') {
					updateBorder(path);
					var rect = path.tightBorder;
					rect[0] -= 3;
					rect[1] -= 3;
					rect[2] += 6;
					rect[3] += 6;
										
					var dragCanvas = newctx({rect:rect,drag:true,pe:true}).canvas;
					dragCanvas.ctx.translate(-rect[0],-rect[1]);
					for (var o = 0; o < path.obj.length; o++) {
						drawObjToCtx(dragCanvas.ctx,path,path.obj[o],1,1,0,0);
					}
					
					if (dragCheckMode == 'dragCanvas') {
						if (typeof p.inputs == 'undefined') p.inputs = [];
						p.inputs.push({type:'drag',canvas:dragCanvas,shuffle:path.isInput.shuffle,value:path.isInput.value});
					}
					
					if (typeof p.dragCanvases == 'undefined') p.dragCanvases = [];
					p.dragCanvases.push({canvas:dragCanvas,shuffle:path.isInput.shuffle,value:path.isInput.value});
					
					if (path.isInput.shuffle == true) {
						shuffleInputs.push(dragCanvas);
						shufflePos.push([rect[0],rect[1],shufflePos.length]);
					}
					
					paths.splice(p2,1);
					p2--;
				} else if (path.isInput.type == 'dragArea') {
					updateBorder(path);
					var rect = path.tightBorder;
					rect[0] -= 3;
					rect[1] -= 3;
					rect[2] += 6;
					rect[3] += 6;
					
					if (typeof p.dragAreas == 'undefined') p.dragAreas = [];
					p.dragAreas.push({rect:rect,value:path.isInput.value,snap:path.isInput.snap});
					
					if (dragCheckMode == 'dragArea') {
						if (typeof p.inputs == 'undefined') p.inputs = [];
						p.inputs.push({type:'dragArea',rect:rect,value:path.isInput.value});
					}
					
					if (path.isInput.snap == true) {
						if (typeof p.dragSnapPos == 'undefined') p.dragSnapPos = [];
						p.dragSnapPos.push(clone(rect.slice(0,4)));
					}
				}
			}
		}
		if (shuffleInputs.length > 0) {
			shufflePos = shuffleArray(shufflePos);
			for (var i = 0; i < shuffleInputs.length; i++) {
				shuffleInputs[i].data[0] = shufflePos[i][0];
				shuffleInputs[i].data[1] = shufflePos[i][1];
				shuffleInputs[i].data[100] = shufflePos[i][0];
				shuffleInputs[i].data[101] = shufflePos[i][1];
				shuffleInputs[i].style.zIndex = shufflePos[i][2]+10;
				shuffleInputs[i].z = shufflePos[i][2]+10;
				resizeCanvas(shuffleInputs[i]);
			}
		}
		taskPageAutoDrawPaths(p);
		
		if (!un(p.keyboard)) addKeyboard(p.keyboard);
	}
	function taskPageAutoDrawPaths(p) {
		p.ctx1.clear();
		for (var p2 = 0; p2 < p.paths.length; p2++) {
			for (var o = 0; o < p.paths[p2].obj.length; o++) {
				var obj = p.paths[p2].obj[o];
				if (boolean(obj.draw,true) == true) {
					drawObjToCtx(p.ctx1,p.paths[p2],obj);
				}
			}
		}
	}
	function taskPageSelectButtonClick(e) {
		var cells = e.target.obj.cells;
		var cell = e.target.cell;
		
		if (cell.toggle == true) {
			delete cell.toggle;
		} else if (e.target.input.multiSelect == true) {
			cell.toggle = true;
		} else {
			for (var r = 0; r < cells.length; r++) {
				for (var c = 0; c < cells[r].length; c++) {
					if (r == e.target.row && c == e.target.col) {
						cells[r][c].toggle = true;
					} else {
						delete cells[r][c].toggle;
					}
				}
			}
		}

		taskPageAutoDrawPaths(page[pageIndex]);
	}
	function taskPageAutoCheck(p) {
		var checkVars = {check:true,a:[],qs:p.inputs.length};

		for (var q = 0; q < p.inputs.length; q++) {
			var input = p.inputs[q];
			if (input.type == 'text') {
				var answer = false;
				if (input.stringJS !== "") {
					var obj = input.pathObj;
					var ans = removeTags(clone(input.richText));
					for (var a = 0; a < obj.ans.length; a++) {
						if (arraysEqual(ans,removeTags(clone(obj.ans[a])))) {
							answer = true;
							break;
						}
					}
				}
				checkVars.a[q] = {type:'text',check:answer};
			} else if (input.type == 'select') {
				var answer = [];
				var toggleCount = 0;
				var ansCount = 0;
				for (var b = 0; b < input.buttons.length; b++) {
					var cell = input.buttons[b].cell;
					var ans = boolean(cell.ans,false);
					if (ans == true) ansCount++;
					var toggle = boolean(cell.toggle,false);
					if (toggle == true) toggleCount++;
					answer[b] = {toggle:toggle,answer:ans};
				}
				if (input.checkSelectCount == true) {
					if (toggleCount < ansCount || toggleCount == 0) {
						checkVars.check = false;
						checkVars.fb = "You need to select more answers.";
					} else if (toggleCount > ansCount) {
						checkVars.check = false;
						checkVars.fb = "You have selected too many answers.";						
					}
				}
				checkVars.a[q] = {type:'select',check:answer};
			} else if (input.type == 'drag') {
				var check = false;
				var hit = false;
				for (var a = 0; a < p.dragAreas.length; a++) {
					var rect = p.dragAreas[a].rect;
					if (hitTestRect2(input.canvas,rect[0],rect[1],rect[2],rect[3])) {
						hit = true;
						if (input.value == p.dragAreas[a].value) check = true;
						break;
					}
				}
				if (hit == false) {
					checkVars.check = false;
					checkVars.fb = "You need to drag all the boxes into position.";
				}
				checkVars.a[q] = {type:'dragArea',check:check};
			} else if (input.type == 'dragArea') {
				var check = false;
				var hit = false;
				for (var d = 0; d < p.dragCanvases.length; d++) {
					var rect = input.rect;
					if (hitTestRect2(p.dragCanvases[d].canvas,rect[0],rect[1],rect[2],rect[3])) {
						hit = true;
						if (input.value == p.dragCanvases[d].value) check = true;
						break;
					}
				}
				if (hit == false) {
					checkVars.check = false;
					checkVars.fb = "You need to drag boxes into the positions.";
				}
				checkVars.a[q] = {type:'dragArea',check:check};
			}
		}

		return checkVars;
	}
	function taskPageAutoMark(p,r) {
		p.ctx2.clear();
		
		for (var q = 0; q < p.inputs.length; q++) {
			if (p.inputs[q].type !== 'text') continue;
			var data = p.inputs[q].data;
			if (p.inputs[q].tickStyle == 'small') {
				var mult = 0.6;
				var l2 = data[100]+data[102]-40*mult-3;
				var t2 = data[101]+data[103]-50*mult-3;
				if (r.m[q] == 1) {
					drawTick(p.ctx2,40*mult,50*mult,'#060',l2,t2,7*mult);
				} else {
					drawCross(p.ctx2,40*mult,50*mult,'#F00',l2,t2,7*mult);
				}
				p.inputs[q].markPos = [l2,t2,40*mult,50*mult];
				p.inputs[q].markctx = p.ctx2;
			} else {
				var l2 = data[100]+data[102]+15;
				var t2 = data[101]+0.5*data[103]-25;
				if (r.m[q] == 1) {
					drawTick(p.ctx2,40,50,'#060',l2,t2,7);
				} else {
					drawCross(p.ctx2,40,50,'#F00',l2,t2,7);
				}
				p.inputs[q].markPos = [l2,t2,40,50];
				p.inputs[q].markctx = p.ctx2;
			}
		}
	}
	function taskPageAutoReload(p) {
		p.ctx2.clear();
	}	
	
	function checkPage() {
		if (!un(holder.checkPageIndex) && holder.checkPageIndex > -1) return;
		holder.checkPageIndex = pageIndex;
		deselectMathsInput();
		if (typeof page[holder.checkPageIndex].check == 'function') {
			var c = page[holder.checkPageIndex].check();
			var checkFileName = String(pages[holder.checkPageIndex].filename);
		} else if (!un(page[holder.checkPageIndex].taskPageAutoLoad)) {
			var c = taskPageAutoCheck(page[holder.checkPageIndex]);
			var checkFileName = 'autoCheck';
		} else {
			delete holder.checkPageIndex;
			return;
		}
		
		if (c.check == false) {
			if (!un(c.fb)) {
				drawFeedback(c.fb);
			}
			delete holder.checkPageIndex;
		} else {
			hideObj(holder.disablePeCanvas);
			hideObj(holder.check);
			
			var xmlHttp = new XMLHttpRequest();
			xmlHttp.open("post", "pages/"+checkFileName+".php", true);
			xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xmlHttp.errorCallback = function() {
				Notifier.error('Error connecting to the server. Please try again shortly...');
				hideObj(holder.disablePeCanvas);
				delete holder.checkPageIndex;
				setTimeout(function() {
					if (boolean(page[pageIndex].showHolderCheckButton,true) == true) {
						showObj(holder.check);
					} else {
						hideObj(holder.check);
					}
				},2000);
			};
			xmlHttp.onerror = xmlHttp.errorCallback;
			xmlHttp.onreadystatechange = function() {
				if (this.readyState !== 4) return;
				if (this.status >= 400) {
					if (typeof this.errorCallback == 'function') this.errorCallback();
					delete holder.checkPageIndex;
					return;
				}
				
				if (!un(document.origin) && document.origin.indexOf('localhost') > -1) console.log(this.responseText);
				var response = JSON.parse(this.responseText);
				if (!un(document.origin) && document.origin.indexOf('localhost') > -1) console.log('check php response:',response);
				pages[holder.checkPageIndex].pageLogKey = response.pageLogKey;
				if (un(pages[holder.checkPageIndex].checkCount)) pages[holder.checkPageIndex].checkCount = 0;
				pages[holder.checkPageIndex].checkCount++;
				p = page[holder.checkPageIndex];
				if (!un(p.mark)) {
					p.mark(response);
				} else if (!un(p.taskPageAutoLoad)) {
					taskPageAutoMark(p,response);
				}
				if (typeof taskLogData !== 'undefined' && taskLogData !== null) {
					taskLogData.percentage = response.percentage;
					taskLogData.totalTime = response.timeSpent;
					taskLogData.status = response.status;
				}
				if (response.correct == 1) {
					pages[holder.checkPageIndex].completed = true;
					hideObj(holder.feedbackButton[holder.checkPageIndex]);
					hideObj(holder.feedback[holder.checkPageIndex]);
					holder.canvas.ctx.clearRect(650,20,200,50);
					removeFeedback();
					if (Number(response.percentage) == 100) {
						showTaskCompleteMessage();
					} else {
						reportHandler();
					}
					if (boolean(page[holder.checkPageIndex].allowInteractionAfterCompletion,false) == false) {
						for (var c = 0; c < canvases[holder.checkPageIndex].length; c++) {
							canvases[holder.checkPageIndex][c].style.pointerEvents = 'none';
						}
						for (var m = 0; m < mathsInput[holder.checkPageIndex].length; m++) {
							mathsInput[holder.checkPageIndex][m].cursorCanvas.style.pointerEvents = 'none';					
						}
						if (!un(draw) && !un(draw.cursorCanvas)) {
							pages[holder.checkPageIndex].drawMode = 'none';
							changeDrawMode('none');
						}
					}
					if (pointsMode == true) {
						window.count = 0;
						window.int = setCorrectingInterval(function() {
							var star = pages[holder.checkPageIndex].stars[window.count];
							star.data[100] = Math.max(star.data[100]-9,613-17.5);
							resizeCanvas3(star);
							if (star.data[100] <= 613-17.5) {
								userPoints++;
								drawPoints();
								window.count++;
								if (window.count == pages[holder.checkPageIndex].points) {
									clearCorrectingInterval(window.int);
									setTimeout(function() {
										for (s = 0; s < pages[holder.checkPageIndex].maxPoints; s++) {
											var star = pages[holder.checkPageIndex].stars[s];
											if (s < pages[holder.checkPageIndex].points) {
												star.show = true;
												star.data[100] = 600-(pages[holder.checkPageIndex].points-1)*17.5+s*35-17.5;
												star.data[101] = 360;
												resizeCanvas3(star);									
												star.style.pointerEvents = 'auto';
												addListener(star,star.click);
											} else {
												star.show = false;
												hideObj(star);
											}
										}
										if (!un(holder.completed[holder.checkPageIndex])) {
											hideObj(holder.completed[holder.checkPageIndex]);
										}
										holder.completed[holder.checkPageIndex] = textCanvas([600-450/2,285,450,130],[''],['#F6F','#6FF','#FF6','#6F6','#66F','#F66'].ran()).canvas;
										showObj(holder.completed[holder.checkPageIndex]);
										text({ctx:holder.completed[holder.checkPageIndex].ctx,left:0,top:12,width:450,height:100,textArray:['<<fontSize:50>><<font:Hobo>>Page Completed!'],align:'center'});
										holder.completed[holder.checkPageIndex].style.pointerEvents = 'auto';
										holder.completed[holder.checkPageIndex].style.zIndex = 10000000;
										addListener(holder.completed[holder.checkPageIndex],function() {
											hideObj(holder.completed[holder.checkPageIndex]);
											for (var s = 0; s < pages[holder.checkPageIndex].stars.length; s++) {
												hideObj(pages[holder.checkPageIndex].stars[s]);
											}
										});								
										hideObj(holder.disablePeCanvas);
										showPage();
									},800);
								}
							}
						},1000/26);
					} else {
						if (!un(holder.completed[holder.checkPageIndex])) {
							hideObj(holder.completed[holder.checkPageIndex]);
						}
						holder.completed[holder.checkPageIndex] = textCanvas([600-450/2,285,450,130],[''],['#F6F','#6FF','#FF6','#6F6','#66F','#F66'].ran()).canvas;
						var ctx = holder.completed[holder.checkPageIndex].ctx;
						text({ctx:ctx,left:0,top:12,width:450,height:100,textArray:['<<fontSize:50>><<font:Hobo>>Page Completed!'],align:'center'});
						
						ctx.beginPath();
						ctx.lineWidth = 4;
						ctx.strokeStyle = '#000';
							drawStar({ctx:ctx,c:[450/2-35,90],r:12});
						ctx.closePath();
						ctx.stroke();
						ctx.beginPath();
						ctx.fillStyle = '#FC3';
							drawStar({ctx:ctx,c:[450/2-35,90],r:12});		
						ctx.fill();
						
						ctx.beginPath();
						ctx.lineWidth = 4;
						ctx.strokeStyle = '#000';
							drawStar({ctx:ctx,c:[450/2,90],r:12});
						ctx.closePath();
						ctx.stroke();
						ctx.beginPath();
						ctx.fillStyle = '#FC3';
							drawStar({ctx:ctx,c:[450/2,90],r:12});		
						ctx.fill();
						
						ctx.beginPath();
						ctx.lineWidth = 4;
						ctx.strokeStyle = '#000';
							drawStar({ctx:ctx,c:[450/2+35,90],r:12});
						ctx.closePath();
						ctx.stroke();
						ctx.beginPath();
						ctx.fillStyle = '#FC3';
							drawStar({ctx:ctx,c:[450/2+35,90],r:12});		
						ctx.fill();
						
						holder.completed[holder.checkPageIndex].style.pointerEvents = 'auto';
						holder.completed[holder.checkPageIndex].style.zIndex = 100000;

						hideObj(holder.disablePeCanvas);						
						if (holder.checkPageIndex === pageIndex) {
							addListener(holder.completed[holder.checkPageIndex],function() {
								hideObj(holder.completed[holder.checkPageIndex]);
							});								
							showPage();
							if (Number(response.percentage) < 100) {
								showObj(holder.completed[holder.checkPageIndex]);
							} else {
								hideObj(holder.completed[holder.checkPageIndex]);
							}
						}
					}
				} else {
					hideObj(holder.disablePeCanvas);
					if (holder.checkPageIndex === pageIndex) {
						setTimeout(function() {
							if (boolean(page[pageIndex].showHolderCheckButton,true) == true) {
								showObj(holder.check);
							} else {
								hideObj(holder.check);
							}
						},4000);
						if (pointsMode == true && pages[holder.checkPageIndex].points > 1) {
							pages[holder.checkPageIndex].points--;
							var star = pages[holder.checkPageIndex].stars[pages[holder.checkPageIndex].points];
							star.color = ['#CFF','#999'];
							star.draw();
						}
						if (!un(response.fb)) {
							drawFeedback(response.fb);
						}
					}					
				}
				delete holder.checkPageIndex;
			}
			c.points = pages[holder.checkPageIndex].points;
			if (!un(pages[holder.checkPageIndex].pageLogKey)) c.pageLogKey = pages[holder.checkPageIndex].pageLogKey;
			c.userKey = userKey;
			c.userType = userType;
			c.pageId = pages[holder.checkPageIndex].pageid;
			c.checkCount = pages[holder.checkPageIndex].checkCount || 0;
			c.pageIds = [];
			c.browserInfo = getBrowserInfo();
			c.timeSpent = Math.round(TimeMe.getTimeOnPageInSeconds('page')/60);
			for (var p = 0; p < pages.length; p++) {
				c.pageIds.push(pages[p].pageid);
			}
			if (typeof taskLogData !== 'undefined' && taskLogData !== null) {
				c.tasksLogId = taskLogData.taskNumber;
			}
			if (!un(document.origin) && document.origin.indexOf('localhost') > -1) console.log(c);
			console.log(c, "c="+encodeURIComponent(JSON.stringify(c)));
			xmlHttp.send("c="+encodeURIComponent(JSON.stringify(c)));
		}
	}
	function drawPoints() {
		holder.canvas.ctx.clearRect(250,20,390,50);
		text({ctx:holder.canvas.ctx,left:252,width:386,top:22,height:46,vertAlign:'middle',textArray:['<<fontSize:24>>'+userName],box:{type:'loose',radius:8,color:'#CFF',borderColor:'#000',borderWidth:4,padding:10}});
		if (pointsMode == true) {
			text({ctx:holder.canvas.ctx,left:252,width:386,top:22,height:46,align:'right',vertAlign:'middle',textArray:['<<fontSize:24>><<color:#00F>><<bold:true>>'+userPoints+'       '],allowSpaces:true});
			holder.canvas.ctx.beginPath();
			holder.canvas.ctx.lineWidth = 4;
			holder.canvas.ctx.strokeStyle = '#000';
				drawStar({ctx:holder.canvas.ctx,c:[613,45],r:12});
			holder.canvas.ctx.closePath();
			holder.canvas.ctx.stroke();
			holder.canvas.ctx.beginPath();
			holder.canvas.ctx.fillStyle = '#00F';
				drawStar({ctx:holder.canvas.ctx,c:[613,45],r:12});		
			holder.canvas.ctx.fill();
		}
	}
	function drawFeedback(txt) {
		if (typeof txt == 'string') txt = [txt];
		txt.unshift('<<fontSize:24>>');
		if (un(holder.feedback[pageIndex])) {
			holder.feedback[pageIndex] = newctx({pe:true,z:100000}).canvas;
			addListenerEnd(holder.feedback[pageIndex],toggleFeedback);
		}
		holder.feedback[pageIndex].fb = true;
		var fb = holder.feedback[pageIndex];	
		showObj(holder.feedbackButton[pageIndex]);
		var size = text({ctx:fb.ctx,textArray:txt,align:'center',measureOnly:true,left:800,top:90+5,width:400,height:610,box:{type:'tight',color:'#FC9',borderColor:'#000',borderWidth:4,radius:8,padding:15}});
		fb.data[100] = 1120 - size.tightRect[2];
		fb.data[101] = 90;
		fb.data[102] = size.tightRect[2];
		fb.data[103] = size.tightRect[3];
		fb.width = size.tightRect[2];
		fb.height = size.tightRect[3];
		resizeCanvas3(fb);
		textBox(fb.ctx,[0,0,size.tightRect[2],size.tightRect[3]],txt,'#FC9');
		showObj(holder.feedback[pageIndex]);
	};
	function toggleFeedback() {
		if (un(holder.feedback[pageIndex])) return;
		if (holder.feedback[pageIndex].parentNode == container) {
			hideObj(holder.feedback[pageIndex]);
		} else {
			showObj(holder.feedback[pageIndex]);
		}
	};
	function removeFeedback() {
		if (!un(holder.feedback[pageIndex])) {
			holder.feedback[pageIndex].fb = false;
			hideObj(holder.feedbackButton[pageIndex]);
			hideObj(holder.feedback[pageIndex]);
		}	
	}
	
	var taskCompleteMessage;
	function loadTaskCompleteMessage() {
		//create purple background
		taskCompleteMessage = newctx({rect:[20,94,1150,576],vis:false,z:1000000,pE:true,page:false}).canvas;
		taskCompleteMessage.style.backgroundColor = "#C6F";
		taskCompleteMessage.style.borderRadius = "5px";
		taskCompleteMessage.style.border = "4px solid black"
		taskCompleteMessage.style.cursor = "auto";
		//addListener(taskCompleteMessage,dismissTaskCompleteMessage);

		taskCompleteMessage.starYellow = new Image;
		taskCompleteMessage.starYellowPointy = new Image;
		taskCompleteMessage.starWhite6points = new Image;		

		taskCompleteMessage.starYellow.src = "../Images/starYellow.png";
		taskCompleteMessage.starYellowPointy.src = "../Images/starYellowPointy.png";
		taskCompleteMessage.starWhite6points.src = "../Images/starWhite6points.png";				

		taskCompleteMessage.stars = [];
		
		//create dismiss button
		var dismiss = newctx({rect:[1050, 120, 110, 26],vis:false,z:10000001,pE:true,page:false}).canvas;
		dismiss.ctx.font = "30px Arial";
		dismiss.ctx.fillStyle = "#FFF";
		dismiss.ctx.textAlign = "center";
		dismiss.ctx.textBaseline = "middle";
		dismiss.ctx.fillText("Dismiss", 55, 13);
		//addListener(dismiss, dismissTaskCompleteMessage)
		taskCompleteMessage.stars.push(dismiss);
		
		for (var i = 0; i < 9; i++) {
			var l = [100,750,700,300,950,900,820,1000,500][i]-6;
			var t = [150,120,400,120,300,120,250,500,100][i];
			var w = [126,126,252,189,189,126,126,126,252][i];
			var star = newctx({rect:[l,t,w,w],vis:false,z:100000002+i,page:false}).canvas;
			star.style.cursor = "auto";
			taskCompleteMessage.stars.push(star);
		}		
		resize();
	}
	function showTaskCompleteMessage() {
		if (un(taskCompleteMessage)) loadTaskCompleteMessage();
		hideObj(holder.completed[pageIndex]);
		showObj(taskCompleteMessage);
		for (i = 0; i < taskCompleteMessage.stars.length; i++) {
			showObj(taskCompleteMessage.stars[i]);
			taskCompleteMessage.stars[i].style.zIndex = 1000000;
		}
		
		taskCompleteMessage.ctx.fillStyle = "#FFF";
		taskCompleteMessage.ctx.textAlign = "center";
		taskCompleteMessage.ctx.textBaseline = "middle";
		
		if (userType == 'Pupil') {
			taskCompleteMessage.ctx.font = "110px Hobo";
			taskCompleteMessage.ctx.fillText("Task Complete!", 350, 275);
			taskCompleteMessage.ctx.font = "55px Hobo";
			taskCompleteMessage.ctx.fillText("Well done, " + userName, 350, 420);
			taskCompleteMessage.ctx.font = "55px Hobo";
			taskCompleteMessage.ctx.fillText("Your result has been logged", 350, 490);
		} else {
			taskCompleteMessage.ctx.font = "110px Hobo";
			taskCompleteMessage.ctx.fillText("Task Complete!", 350, 375);
		}
		
		taskCompleteMessage.interval = setInterval(function(){taskCompleteMessage.rotate()},25);
		
		taskCompleteMessage.rotate = function() {
			for (i = 1; i < taskCompleteMessage.stars.length; i++) {
				taskCompleteMessage.stars[i].ctx.clear();
				taskCompleteMessage.stars[i].ctx.translate(taskCompleteMessage.stars[i].data[2] / 2, taskCompleteMessage.stars[i].data[3] / 2);
				taskCompleteMessage.stars[i].ctx.rotate(Math.PI / 180);
				taskCompleteMessage.stars[i].ctx.translate(taskCompleteMessage.stars[i].data[2] / -2, taskCompleteMessage.stars[i].data[3] / -2);
			}
			taskCompleteMessage.stars[1].ctx.drawImage(taskCompleteMessage.starYellow,20,20,86,86);		
			taskCompleteMessage.stars[2].ctx.drawImage(taskCompleteMessage.starYellow,20,20,86,86);
			taskCompleteMessage.stars[3].ctx.drawImage(taskCompleteMessage.starYellow,60,60,172,172);			
			taskCompleteMessage.stars[4].ctx.drawImage(taskCompleteMessage.starWhite6points,24,33,141,123);		
			taskCompleteMessage.stars[5].ctx.drawImage(taskCompleteMessage.starWhite6points,24,33,141,123);		
			taskCompleteMessage.stars[6].ctx.drawImage(taskCompleteMessage.starYellowPointy,20,21,86,84);		
			taskCompleteMessage.stars[7].ctx.drawImage(taskCompleteMessage.starYellowPointy,20,21,86,84);
			taskCompleteMessage.stars[8].ctx.drawImage(taskCompleteMessage.starYellowPointy,20,21,86,84);
			taskCompleteMessage.stars[9].ctx.drawImage(taskCompleteMessage.starYellowPointy,40,42,152,148);		
		}
		addListener(window,dismissTaskCompleteMessage);
	}
	function dismissTaskCompleteMessage() {
		hideObj(taskCompleteMessage);
		for (i = 0; i < taskCompleteMessage.stars.length; i++) {
			hideObj(taskCompleteMessage.stars[i]);
		}
		if (!un(taskCompleteMessage.interval)) {
			clearInterval(taskCompleteMessage.interval);
		}
		removeListener(window,dismissTaskCompleteMessage);
	}	
	
	function createHorizPos(num,width,left,right) {
		if (typeof left == 'undefined') left = width;
		if (typeof right == 'undefined') right = width;
		var space = (1200 - num * width - left - right) / (num-1);
		var arr = [];
		for (var i = 0; i < num; i++) {
			arr[i] = left+i*(width+space);
		}
		return arr;
	}	
	function createVertPos(num,height,top,bottom) {
		if (typeof top == 'undefined') top = height;
		if (typeof bottom == 'undefined') bottom = height;
		var space = (620 - num * height - top - bottom) / (num-1);
		var arr = [];
		for (var i = 0; i < num; i++) {
			arr[i] = 80+top+i*(height+space);
		}
		return arr;
	}	
		
	function swipedetect(el, callback){
		var touchsurface = el,
		swipedir,
		startX,
		startY,
		distX,
		distY,
		dist,
		threshold = 150, //required min distance traveled to be considered swipe
		restraint = 100, // maximum distance allowed at the same time in perpendicular direction
		allowedTime = 400, // maximum time allowed to travel that distance
		elapsedTime,
		startTime,
		handleswipe = callback || function(swipedir){}
	  
		touchsurface.addEventListener('touchstart', function(e){
			var touchobj = e.changedTouches[0]
			swipedir = 'none'
			dist = 0
			startX = touchobj.pageX
			startY = touchobj.pageY
			startTime = new Date().getTime() // record time when finger first makes contact with surface
			e.preventDefault()
		}, false)
	  
		touchsurface.addEventListener('touchmove', function(e){
			e.preventDefault() // prevent scrolling when inside DIV
		}, false)
	  
		touchsurface.addEventListener('touchend', function(e){
			var touchobj = e.changedTouches[0]
			distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
			distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
			elapsedTime = new Date().getTime() - startTime // get time elapsed
			if (elapsedTime <= allowedTime){ // first condition for awipe met
				if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ // 2nd condition for horizontal swipe met
					swipedir = (distX < 0)? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
				}
				else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
					swipedir = (distY < 0)? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
				}
			}
			if (e.target.drag !== true) handleswipe(swipedir)
			e.preventDefault()
		}, false)
	}
	swipedetect (canvas, function(swipedir){
		// swipedir contains either "none", "left", "right", "top", or "down"
		
		if (swipedir == 'left') {
			nextPage();
		} else if (swipedir == 'right') {
			prevPage();
		}
	})
}
function getBrowserInfo() {
	/**
	 * JavaScript Client Detection
	 * (C) viazenetti GmbH (Christian Ludwig)
	 */

	var unknown = '-';

	// screen
	var screenSize = '';
	if (screen.width) {
		width = (screen.width) ? screen.width : '';
		height = (screen.height) ? screen.height : '';
		screenSize += '' + width + " x " + height;
	}

	// browser
	var nVer = navigator.appVersion;
	var nAgt = navigator.userAgent;
	var browser = navigator.appName;
	var version = '' + parseFloat(navigator.appVersion);
	var majorVersion = parseInt(navigator.appVersion, 10);
	var nameOffset, verOffset, ix;

	// Opera
	if ((verOffset = nAgt.indexOf('Opera')) != -1) {
		browser = 'Opera';
		version = nAgt.substring(verOffset + 6);
		if ((verOffset = nAgt.indexOf('Version')) != -1) {
			version = nAgt.substring(verOffset + 8);
		}
	}
	// Opera Next
	if ((verOffset = nAgt.indexOf('OPR')) != -1) {
		browser = 'Opera';
		version = nAgt.substring(verOffset + 4);
	}
	// Edge
	else if ((verOffset = nAgt.indexOf('Edge')) != -1) {
		browser = 'Microsoft Edge';
		version = nAgt.substring(verOffset + 5);
	}
	// MSIE
	else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
		browser = 'Microsoft Internet Explorer';
		version = nAgt.substring(verOffset + 5);
	}
	// Chrome
	else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
		browser = 'Chrome';
		version = nAgt.substring(verOffset + 7);
	}
	// Safari
	else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
		browser = 'Safari';
		version = nAgt.substring(verOffset + 7);
		if ((verOffset = nAgt.indexOf('Version')) != -1) {
			version = nAgt.substring(verOffset + 8);
		}
	}
	// Firefox
	else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
		browser = 'Firefox';
		version = nAgt.substring(verOffset + 8);
	}
	// MSIE 11+
	else if (nAgt.indexOf('Trident/') != -1) {
		browser = 'Microsoft Internet Explorer';
		version = nAgt.substring(nAgt.indexOf('rv:') + 3);
	}
	// Other browsers
	else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
		browser = nAgt.substring(nameOffset, verOffset);
		version = nAgt.substring(verOffset + 1);
		if (browser.toLowerCase() == browser.toUpperCase()) {
			browser = navigator.appName;
		}
	}
	// trim the version string
	if ((ix = version.indexOf(';')) != -1) version = version.substring(0, ix);
	if ((ix = version.indexOf(' ')) != -1) version = version.substring(0, ix);
	if ((ix = version.indexOf(')')) != -1) version = version.substring(0, ix);

	majorVersion = parseInt('' + version, 10);
	if (isNaN(majorVersion)) {
		version = '' + parseFloat(navigator.appVersion);
		majorVersion = parseInt(navigator.appVersion, 10);
	}

	// mobile version
	var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

	// cookie
	var cookieEnabled = (navigator.cookieEnabled) ? true : false;

	if (typeof navigator.cookieEnabled == 'undefined' && !cookieEnabled) {
		document.cookie = 'testcookie';
		cookieEnabled = (document.cookie.indexOf('testcookie') != -1) ? true : false;
	}

	// system
	var os = unknown;
	var clientStrings = [
		{s:'Windows 10', r:/(Windows 10.0|Windows NT 10.0)/},
		{s:'Windows 8.1', r:/(Windows 8.1|Windows NT 6.3)/},
		{s:'Windows 8', r:/(Windows 8|Windows NT 6.2)/},
		{s:'Windows 7', r:/(Windows 7|Windows NT 6.1)/},
		{s:'Windows Vista', r:/Windows NT 6.0/},
		{s:'Windows Server 2003', r:/Windows NT 5.2/},
		{s:'Windows XP', r:/(Windows NT 5.1|Windows XP)/},
		{s:'Windows 2000', r:/(Windows NT 5.0|Windows 2000)/},
		{s:'Windows ME', r:/(Win 9x 4.90|Windows ME)/},
		{s:'Windows 98', r:/(Windows 98|Win98)/},
		{s:'Windows 95', r:/(Windows 95|Win95|Windows_95)/},
		{s:'Windows NT 4.0', r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
		{s:'Windows CE', r:/Windows CE/},
		{s:'Windows 3.11', r:/Win16/},
		{s:'Android', r:/Android/},
		{s:'Open BSD', r:/OpenBSD/},
		{s:'Sun OS', r:/SunOS/},
		{s:'Linux', r:/(Linux|X11)/},
		{s:'iOS', r:/(iPhone|iPad|iPod)/},
		{s:'Mac OS X', r:/Mac OS X/},
		{s:'Mac OS', r:/(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
		{s:'QNX', r:/QNX/},
		{s:'UNIX', r:/UNIX/},
		{s:'BeOS', r:/BeOS/},
		{s:'OS/2', r:/OS\/2/},
		{s:'Search Bot', r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
	];
	for (var id in clientStrings) {
		var cs = clientStrings[id];
		if (cs.r.test(nAgt)) {
			os = cs.s;
			break;
		}
	}

	var osVersion = unknown;

	if (/Windows/.test(os)) {
		var a = /Windows (.*)/.exec(os)
		if (a instanceof Array) {
			osVersion = a[1];
		}
		os = 'Windows';
	}

	switch (os) {
		case 'Mac OS X':
			var a = /Mac OS X (10[\.\_\d]+)/.exec(nAgt);
			if (a instanceof Array) {
				osVersion = a[1];
			}
			break;

		case 'Android':
			var a = /Android ([\.\_\d]+)/.exec(nAgt);
			if (a instanceof Array) {
				osVersion = a[1];
			}
			break;

		case 'iOS':
			var a = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
			if (a instanceof Array) {
				osVersion = a[1] + '.' + a[2] + '.' + (a[3] | 0);
			}
			break;
	}

	window.browserinfo = {
		screen: screenSize,
		browser: browser,
		browserVersion: version,
		browserMajorVersion: majorVersion,
		mobile: mobile,
		os: os,
		osVersion: osVersion,
		cookies: cookieEnabled,
	};
	return os+" "+osVersion+" "+browser+" "+version+" "+screenSize+" mobile:"+mobile+" cookies:"+cookieEnabled;
}	

function stopDefaultBackspaceBehaviour(e) {
	if (e.keyCode == 8 && e.target.nodeName !== 'TEXTAREA' && e.target.nodeName !== 'INPUT' && e.target.nodeName !== 'TD') {
		e.preventDefault ? e.preventDefault() : e.returnValue = false;
	}
}
function xWindowToCanvas(xCoord) {
	return mainCanvasWidth * ((xCoord - canvasMetrics.left) / (canvasDisplayWidth));
}
function xCanvasToWindow(xCoord) {
	return canvasMetrics.left + (xCoord / mainCanvasWidth) * canvasDisplayWidth;
}
function yWindowToCanvas(yCoord) {
	return mainCanvasHeight * ((yCoord - canvasMetrics.top) / canvasDisplayHeight);
}
function yCanvasToWindow(yCoord) {
	return canvasMetrics.top + (yCoord / mainCanvasHeight) * canvasDisplayHeight;
}

function addListener(toButton, yourFunction) {
	toButton.addEventListener("touchend", yourFunction, false)
	toButton.addEventListener("mouseup", yourFunction, false)
}
function removeListener(toButton, yourFunction) {
	toButton.removeEventListener("touchend", yourFunction, false)
	toButton.removeEventListener("mouseup", yourFunction, false)
}
function addListenerStart(toButton, yourFunction) {
	toButton.addEventListener("touchstart", yourFunction, false)
	toButton.addEventListener("mousedown", yourFunction, false);
}
function removeListenerStart(toButton, yourFunction) {
	toButton.removeEventListener("touchstart", yourFunction, false)
	toButton.removeEventListener("mousedown", yourFunction, false);
}
function addListenerMove(toButton, yourFunction) {
	toButton.addEventListener("touchmove", yourFunction, false)
	toButton.addEventListener("mousemove", yourFunction, false)
}
function removeListenerMove(toButton, yourFunction) {
	toButton.removeEventListener("touchmove", yourFunction, false)
	toButton.removeEventListener("mousemove", yourFunction, false)
}
function addListenerEnd(toButton, yourFunction) {
	toButton.addEventListener("touchend", yourFunction, false)
	toButton.addEventListener("mouseup", yourFunction, false);
}
function removeListenerEnd(toButton, yourFunction) {
	toButton.removeEventListener("touchend", yourFunction, false)
	toButton.removeEventListener("mouseup", yourFunction, false);
}

function resize() {
	var totalWidth = mainCanvasWidth + mainCanvasMargins[0] + mainCanvasMargins[2];
	var totalHeight = mainCanvasHeight + mainCanvasMargins[1] + mainCanvasMargins[3];
	var aspectRatio = totalWidth / totalHeight;
	if (window.innerWidth / window.innerHeight > aspectRatio) {
		var totalDisplayWidth = window.innerHeight * aspectRatio;
		var totalDisplayHeight = window.innerHeight;
	} else {
		var totalDisplayWidth = window.innerWidth;
		var totalDisplayHeight = window.innerWidth / aspectRatio;
	}
	canvasDisplayWidth = totalDisplayWidth * (mainCanvasWidth / totalWidth);
	canvasDisplayHeight = totalDisplayHeight * (mainCanvasHeight / totalHeight);
	canvasDisplayLeft = (window.innerWidth - totalDisplayWidth) / 2 + mainCanvasMargins[0] * (totalDisplayWidth/totalWidth);
	canvasDisplayTop = (window.innerHeight - totalDisplayHeight) / 2 + mainCanvasMargins[1] * (totalDisplayHeight/totalHeight);
		
	//canvas.style.left = canvasDisplayLeft + 'px';
	//canvas.style.top = canvasDisplayTop + 'px';
	//canvas.style.top = '0px';
	canvas.style.width = canvasDisplayWidth + 'px';
	canvas.style.height = canvasDisplayHeight + 'px';
	canvasDisplayRect = canvas.getBoundingClientRect();
	
	if (typeof inactiveBox !== 'undefined')	resizeCanvas(inactiveBox, 400, 290, 400, 120);
	if (boolean(isTask,true) == true) {
		resizeCanvas3(holder.prev);
		resizeCanvas3(holder.next);
		resizeCanvas3(holder.reload);
		resizeCanvas3(holder.canvas);
		resizeCanvas3(holder.check);
		resizeCanvas3(holder.home);
		resizeCanvas3(holder.home2);
		resizeCanvas3(holder.loading);
		resizeCanvas3(holder.summary);
		resizeCanvas3(holder.summary2);
		resizeCanvas3(holder.disablePeCanvas);
		for (var i = 0; i < holder.feedback.length; i++) {
			if (!un(holder.feedback[i])) resizeCanvas3(holder.feedback[i]); 
		}
		for (var i = 0; i < holder.feedbackButton.length; i++) {
			if (!un(holder.feedbackButton[i])) resizeCanvas3(holder.feedbackButton[i]); 
		}
		for (var i = 0; i < holder.completed.length; i++) {
			if (!un(holder.completed[i])) resizeCanvas3(holder.completed[i]); 
		}
		if (pageIndex < pages.length) {
			if (!un(pages[pageIndex].stars)) {
				for (var s = 0; s < pages[pageIndex].stars.length; s++) {
					resizeCanvas3(pages[pageIndex].stars[s]);
				}
			}
		}
	}
	if (!un(canvases[pageIndex])) {
		for (var c = 0; c < canvases[pageIndex].length; c++) {
			resizeCanvas3(canvases[pageIndex][c]);
		}
	}
	if (!un(taskCompleteMessage)) {
		resizeCanvas3(taskCompleteMessage);
		for (var c = 0; c < taskCompleteMessage.stars.length; c++) {
			resizeCanvas3(taskCompleteMessage.stars[c]);
		}
	}	
	if (!un(mathsInput[pageIndex])) {
		for (var m = 0; m < mathsInput[pageIndex].length; m++) {
			resizeCanvas3(mathsInput[pageIndex][m].canvas);
			resizeCanvas3(mathsInput[pageIndex][m].cursorCanvas);
		}
	}
	if (!un(slider[pageIndex])) {
		for (var s = 0; s < slider[pageIndex].length; s++) {
			resizeCanvas3(slider[pageIndex][s].backCanvas);
			resizeCanvas3(slider[pageIndex][s].sliderCanvas);
			resizeCanvas3(slider[pageIndex][s].labelCanvas);
		}
	}	
	for (var j = 0; j < keyboard.length; j++) {
		if (typeof keyboard[j] !== 'undefined') {
			resizeCanvas3(keyboardButton1);
			resizeCanvas3(keyboardButton2);
			resizeCanvas(keyboard[j], keyboardData[j][100], keyboardData[j][101], keyboardData[j][2], keyboardData[j][3]);
			for (var i = 0; i <key1[j].length; i++) {
				resizeCanvas(key1[j][i], key1Data[j][i][100], key1Data[j][i][101], key1Data[j][i][2], key1Data[j][i][3]);
			}
		}
	}
	
	canvasMetrics = canvas.getBoundingClientRect();
	
	var children = container.children;
	for (var c = 0; c < children.length; c++) {
		var child = children[c];
		if (!un(draw.div) && child == draw.div) continue;
		if (!un(child.data)) resizeCanvas3(child);
	}
	var nodes = Array.from(container.childNodes);
	for (var n = 0; n < nodes.length; n++) {
		if (typeof nodes[n].resize == 'function') nodes[n].resize();
	}
	if (typeof onResize == 'function') onResize();
}
function resizeCanvas(canvasToResize, left, top, width, height) {
	resizeCanvas3(canvasToResize, left, top, width, height)
	/*if (typeof canvasToResize !== 'object') return;
	if (typeof canvasToResize.style == 'undefined') return;
	//console.log(canvasToResize);
	if (canvasToResize.isStaticMenuCanvas == true) {
		var l = 0.5 * (window.innerWidth - Number(String(canvas.style.width).slice(0, -2))) + canvasDisplayWidth * (left / mainCanvasWidth);
		var t = canvasDisplayHeight * (top / mainCanvasHeight);
	} else {
		var l = 0.5 * (window.innerWidth - Number(String(canvas.style.width).slice(0, -2))) + canvasDisplayWidth * (left / mainCanvasWidth) + mainCanvasLeft;
		var t = canvasDisplayHeight * (top / mainCanvasHeight) + mainCanvasTop;
	}
	var w = canvasDisplayWidth * (width / mainCanvasWidth);
	var h = canvasDisplayHeight * (height / mainCanvasHeight);
	canvasToResize.style.left = l + "px";
	canvasToResize.style.top = t + "px";
	canvasToResize.style.width = w + "px";
	canvasToResize.style.height = h + "px";*/
}
function resizeCanvas2(canvasToResize, left, top) {
	resizeCanvas3(canvasToResize, left, top)
	/*if (un(canvasToResize)) return;
	if (canvasToResize.isStaticMenuCanvas == true) {
		var l = 0.5 * (window.innerWidth - Number(String(canvas.style.width).slice(0, -2))) + canvasDisplayWidth * (left / mainCanvasWidth) + mainCanvasLeft;
		var t = canvasDisplayHeight * (top / mainCanvasHeight) + mainCanvasTop;
	} else {
		var l = 0.5 * (window.innerWidth - Number(String(canvas.style.width).slice(0, -2))) + canvasDisplayWidth * (left / mainCanvasWidth) + mainCanvasLeft;
		var t = canvasDisplayHeight * (top / mainCanvasHeight) + mainCanvasTop;
	}
	canvasToResize.style.left = l + "px";
	canvasToResize.style.top = t + "px";*/
}
function resizeCanvas3(canvasToResize,left,top,width,height) {
	if (un(canvasToResize.style)) return;
	if (un(canvasToResize.data)) canvasToResize.data = [];
	if (un(left)) left = canvasToResize.data[100];
	if (un(top)) top = canvasToResize.data[101];
	if (un(width)) width = canvasToResize.data[102];
	if (un(height)) height = canvasToResize.data[103];
	
	canvasToResize.data[100] = left;
	canvasToResize.data[101] = top;
	canvasToResize.data[102] = width;
	canvasToResize.data[103] = height;
	
	if (!un(canvasToResize.data[110])) left += canvasToResize.data[110];
	if (!un(canvasToResize.data[111])) top += canvasToResize.data[111];
	
	var xsf = canvasDisplayWidth / mainCanvasWidth;
	var ysf = canvasDisplayHeight / mainCanvasHeight;
	
	canvasToResize.style.left = (canvasDisplayLeft + left * xsf) + "px";
	canvasToResize.style.top = (top * ysf) + "px";
	canvasToResize.style.width = (width * xsf) + "px";
	canvasToResize.style.height = (height * ysf) + "px";
	
	
	/*if (canvasToResize.isStaticMenuCanvas == true) {
		var l = 0.5 * (window.innerWidth - Number(String(canvas.style.width).slice(0, -2))) + canvasDisplayWidth * (left / mainCanvasWidth) + mainCanvasLeft;
		var t = canvasDisplayHeight * (top / mainCanvasHeight) + mainCanvasTop;
	} else {
		var l = 0.5 * (window.innerWidth - Number(String(canvas.style.width).slice(0, -2))) + canvasDisplayWidth * (left / mainCanvasWidth) + mainCanvasLeft;
		var t = canvasDisplayHeight * (top / mainCanvasHeight) + mainCanvasTop;
	}
	var w = canvasDisplayWidth * (width / mainCanvasWidth);
	var h = canvasDisplayHeight * (height / mainCanvasHeight);
	canvasToResize.style.left = l + "px";
	canvasToResize.style.top = t + "px";
	canvasToResize.style.width = w + "px";
	canvasToResize.style.height = h + "px";*/
}

function clearCanvas() {
	if (!un(hasCanvas) && hasCanvas == false) return;
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
	ctx.strokeStyle = "#000";
	ctx.lineWidth = mainCanvasBorderWidth;
	ctx.beginPath();
	ctx.moveTo(mainCanvasBorderWidth / 2, mainCanvasBorderWidth / 2);
	ctx.lineTo(mainCanvasWidth - mainCanvasBorderWidth / 2, mainCanvasBorderWidth / 2);
	ctx.lineTo(mainCanvasWidth - mainCanvasBorderWidth / 2, mainCanvasHeight - mainCanvasBorderWidth / 2);
	ctx.lineTo(mainCanvasBorderWidth / 2, mainCanvasHeight - mainCanvasBorderWidth / 2);
	ctx.lineTo(mainCanvasBorderWidth / 2, mainCanvasBorderWidth / 2);
	ctx.closePath();
	ctx.fillStyle = mainCanvasFillStyle;
	ctx.fill();
	//canvas.style.backgroundColor = mainCanvasFillStyle;
	ctx.stroke();
	if (isTask == true) {
		ctx.fillStyle = '#CFF';
		ctx.fillRect(mainCanvasBorderWidth,mainCanvasBorderWidth,1200-2*mainCanvasBorderWidth,80-mainCanvasBorderWidth);
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.moveTo(0,80);
		ctx.lineTo(1200,80);
		ctx.stroke();
	}
}

function createCanvas(l,t,w,h,v,d,p,z) {
	return newctx({rect:[l,t,w,h],vis:v,drag:d,pe:p,z:z}).canvas;
}
function newctx(obj) {
	if (typeof obj == 'undefined')
		obj = {};
	if (typeof obj.rect !== 'undefined') {
		obj.l = obj.rect[0];
		obj.t = obj.rect[1];
		obj.w = obj.rect[2];
		obj.h = obj.rect[3];
	}
	var l = obj.l || obj.left || 0;
	var t = obj.t || obj.top || 0;
	var w = obj.w || obj.width || 1200;
	var h = obj.h || obj.height || 700;
	var cnv = document.createElement('canvas');	
	cnv.vis = def([obj.visible,obj.vis,true]);
	cnv.drag = def([obj.draggable,obj.drag,false]);
	cnv.pe = def([obj.pointerEvents,obj.pE,obj.pe,false]);
	cnv.z = def([obj.zIndex,obj.z,2]);
	cnv.width = w;
	cnv.height = h;
	cnv.setAttribute('position', 'absolute');
	cnv.setAttribute('cursor', 'auto');
	cnv.setAttribute('draggable', 'false');
	cnv.setAttribute('class', 'buttonClass');	
	cnv.data = [l,t,w,h,cnv.vis,cnv.drag,cnv.pe,cnv.z];
	for (var i = 0; i < 8; i++) cnv.data[100+i] = cnv.data[i];
	cnv.ctx = cnv.getContext('2d');
	if (cnv.drag == true) {
		makeDraggable(cnv);
		if (!un(obj.dragStart)) cnv.dragStart = obj.dragStart;
		if (!un(obj.dragMove)) cnv.dragMove = obj.dragMove;
		if (!un(obj.dragStop)) cnv.dragStop = obj.dragStop;
		if (!un(obj.dragArea)) cnv.dragArea = obj.dragArea;
	}
	cnv.style.zIndex = cnv.z;
	if (cnv.pe == false) {
		cnv.style.pointerEvents = 'none';
	} else {
		cnv.style.pointerEvents = 'auto';
	}
	if (typeof cnv.ctx.getLineDash !== 'function')
		cnv.ctx.getLineDash = function () {
			return []
		};
	if (typeof cnv.ctx.setLineDash !== 'function')
		cnv.ctx.setLineDash = function () {};
	
	if (!un(canvases[pageIndex]) && boolean(obj.page,true) == true) canvases[pageIndex].push(cnv);
	var ctx = cnv.ctx;
	ctx.canvas = cnv;
	ctx.data = cnv.data;
	resizeCanvas3(cnv);
	if (isTask == false && cnv.vis == true) {
		showObj(cnv);
	}
	return ctx;
}
function textCanvas(rect,txt,color,drag) {
	var ctx = newctx({rect:rect,drag:boolean(drag,false),pe:true});
	ctx.color = color;
	ctx.text = txt;
	ctx.rect = rect;
	ctx.draw = function() {
		this.clear();
		text({ctx:this,textArray:this.text,left:2,top:2,width:this.rect[2]-4,height:this.rect[3]-4,align:'center',vertAlign:'middle',box:{type:'loose',borderWidth:4,borderColor:'#000',color:this.color,radius:8}});
	}
	ctx.draw();
	return ctx;
}
function textBox(ctx,rect,txt,color,borderColor,dash) {
	if (un(color)) color = 'none';
	if (un(borderColor)) borderColor = '#000';
	if (un(dash)) dash = [];
	text({ctx:ctx,textArray:txt,left:rect[0]+2,top:rect[1]+2,width:rect[2]-4,height:rect[3]-4,align:'center',vertAlign:'middle',box:{type:'loose',borderWidth:4,borderColor:borderColor,color:color,radius:8,dash:dash}});
}
function circleTextBox(ctx,rect,txt,color,borderColor,dash) {
	if (un(color)) color = 'none';
	if (un(borderColor)) borderColor = '#000';
	if (un(dash)) dash = [];
	ctx.save();
	ctx.strokeStyle = borderColor;
	ctx.fillStyle = color;
	ctx.lineWidth = 4;
	ctx.setLineDash(dash);
	ctx.beginPath();
	ctx.arc(rect[0]+rect[2]/2,rect[1]+rect[3]/2,Math.min(rect[2],rect[3])/2-2,0,2*Math.PI);
	ctx.fill();
	ctx.stroke();
	text({ctx:ctx,textArray:txt,left:rect[0],top:rect[1],width:rect[2],height:rect[3],align:'center',vertAlign:'middle'});
	ctx.restore();
}
function circleTextCanvas(rect,txt,color,drag) {
	var ctx = newctx({rect:rect,drag:boolean(drag,false),pe:true});
	ctx.save();
	ctx.strokeStyle = '#000';
	ctx.fillStyle = color;
	ctx.lineWidth = 4;
	ctx.beginPath();
	ctx.arc(rect[2]/2,rect[3]/2,Math.min(rect[2],rect[3])/2-2,0,2*Math.PI);
	ctx.fill();
	ctx.stroke();
	text({ctx:ctx,textArray:txt,left:0,top:0,width:rect[2],height:rect[3],align:'center',vertAlign:'middle'});
	ctx.restore();
	return ctx;
}
function arrayCheck(array,element) {
	for (var i = 0; i < array.length; i++) {
		if (array[i] == element) return true;
		if (typeof array[i] == 'object' && arraysEqual(array[i], element) == true) return true;
	}
	return false;
}

function makeDraggable(object) {
	addListenerStart(object,dragStart);
	object.style.cursor = openhand;
	object.drag == true;
	object.data[5] = true;
	object.data[105] = true;
}
function makeNotDraggable(object) {
	object.drag = false;
	removeListenerStart(object,dragStart);
	object.style.cursor = 'default';
}
var dragObj;
function dragStart(e) {
	e.preventDefault();
	var canvas = e.target;
	canvas.style.zIndex = zIndexFront;
	zIndexFront++;
	updateMouse(e);
	dragOffset.x = mouse.x - canvas.data[100];
	dragOffset.y = mouse.y - canvas.data[101];
	
	if (un(canvas.dragArea)) {
		dragArea.xMin = mainCanvasBorderWidth;
		dragArea.xMax = 1200-mainCanvasBorderWidth-canvas.data[102];
		dragArea.yMin = 80;
		dragArea.yMax = 700-mainCanvasBorderWidth-canvas.data[103];
	} else {
		dragArea.xMin = canvas.dragArea[0];
		dragArea.yMin = canvas.dragArea[1];
		dragArea.xMax = canvas.dragArea[0]+canvas.dragArea[2];
		dragArea.yMax = canvas.dragArea[1]+canvas.dragArea[3];
	}
	
	if (!un(canvas.dragPath)) {
		draw.interact.clearFeedback();
		draw._dragAreas = [];
		var path = canvas.dragPath;
		for (var p = 0; p < draw.path.length; p++) {
			var path2 = draw.path[p];
			if (!un(path2.isInput) && path2.isInput.type == 'dragArea') {
				if (!un(path2._dragHit)) {
					if (path2._dragHit == path) {
						delete path2._dragHit;
					} else {
						continue;
					}
				}
				var snap = boolean(path2.isInput.snap,false);
				var rect = clone(path2.tightBorder);
				var center = [rect[0]+0.5*rect[2],rect[1]+0.5*rect[3]];
				var value = path2.isInput.value;
				draw._dragAreas.push({
					rect:rect,
					center:center,
					snap:snap,
					path:path2,
					value:value
				});
			}
		};
		//console.log(draw._dragAreas);
	}
	
	addListenerMove(window,dragMove);
	addListenerEnd(window,dragStop);
	canvas.style.cursor = closedhand;
	dragObj = canvas;
	//console.log(dragObj,dragObj.data[5],dragObj.ondragstart,dragObj.ondragmove)
	if (!un(page) && !un(page[pageIndex].dragSnapPos)) {
		for (var d = 0; d < page[pageIndex].dragSnapPos.length; d++) {
			if (page[pageIndex].dragSnapPos[d][4] == dragObj) {
				page[pageIndex].dragSnapPos[d][4] = null;
			}
		}
	}
	if (typeof canvas.ondragstart == 'function') canvas.ondragstart();
	if (typeof canvas.dragStart == 'function') canvas.dragStart(canvas);
	if (!un(page) && typeof page[pageIndex].clear == 'function') page[pageIndex].clear();
}
function dragMove(e) {
	e.preventDefault();
	updateMouse(e);
	var l = mouse.x - dragOffset.x;
	l = Math.max(l, dragArea.xMin);
	l = Math.min(l, dragArea.xMax);
	var t = mouse.y - dragOffset.y;
	t = Math.max(t, dragArea.yMin);
	t = Math.min(t, dragArea.yMax);
	dragObj.data[100] = l;
	dragObj.data[101] = t;
	resizeCanvas3(dragObj);
	
	var canvas = dragObj;
	if (!un(canvas.dragPath)) {
		var path = canvas.dragPath;
		var pos = [canvas.data[100]+0.5*canvas.data[102],canvas.data[101]+0.5*canvas.data[103]];
		//delete path._dragAreaHit.path._dragHit;
		delete path._dragAreaHit;
		path._match = false;
		for (d = 0; d < draw._dragAreas.length; d++) {
			var area = draw._dragAreas[d];
			if (dist(pos[0],pos[1],area.center[0],area.center[1]) < 50) {
				path._dragAreaHit = area;
				area.path._dragHit = path;
				if (path.isInput.value == area.value) path._match = true;
				if (area.snap == true) {
					dragObj.data[100] = area.rect[0]+0.5*area.rect[2]-0.5*canvas.data[102];
					dragObj.data[101] = area.rect[1]+0.5*area.rect[3]-0.5*canvas.data[103];
					resizeCanvas3(dragObj);
				}
			} else if (area.path._dragHit == path) {
				delete area.path._dragHit;
				delete path._dragAreaHit;
			}
		}
	}
	
	if (typeof dragObj.ondragmove == 'function') dragObj.ondragmove();	
	if (typeof dragObj.dragMove == 'function') dragObj.dragMove();	
}
function dragStop(e) {
	e.preventDefault();
	updateMouse(e);	
	removeListenerMove(window,dragMove);
	removeListenerEnd(window,dragStop);	
	dragObj.style.cursor = openhand;
	
	/*var canvas = dragObj;
	if (!un(canvas.dragPath)) {
		var path = canvas.dragPath;
		console.log(path._match == true);
	}*/
	if (!un(page) && !un(page[pageIndex].dragSnapPos)) {
		var closest = -1;
		var closestDist = 100000;
		var closestPos = [];
		for (var d = 0; d < page[pageIndex].dragSnapPos.length; d++) {
			var pos = page[pageIndex].dragSnapPos[d];
			if (hitTestRect2(dragObj,pos[0],pos[1],pos[2],pos[3]) == true) {
				/*if (typeof pos[4] !== 'undefined' && pos[4] !== null) {
					pos[4].data[100] = pos[4].data[0];
					pos[4].data[101] = pos[4].data[1];
					resizeCanvas3(pos[4]);
				}*/
				var dist2 = dist(dragObj.data[100],dragObj.data[101],pos[0],pos[1]);
				if (dist2 < closestDist) {
					closest = d;
					closestDist = dist2;
					closestPos = pos;
				}
				/*dragObj.data[100] = pos[0];
				dragObj.data[101] = pos[1];
				resizeCanvas3(dragObj);
				pos[4] = dragObj;
				break;*/
			}
		}
		if (closest > -1) {
			var pos = closestPos;
			if (typeof pos[4] !== 'undefined' && pos[4] !== null) {
				pos[4].data[100] = pos[4].data[0];
				pos[4].data[101] = pos[4].data[1];
				resizeCanvas3(pos[4]);
			}
			dragObj.data[100] = pos[0];
			dragObj.data[101] = pos[1];
			resizeCanvas3(dragObj);
			pos[4] = dragObj;
		}
	}
	if (typeof dragObj.ondragstop == 'function') dragObj.ondragstop();	
	if (typeof dragObj.dragStop == 'function') dragObj.dragStop();
	dragObj = null;
}

function showObj(obj, hideAfter) {
	if (un(obj)) return;
	if (!isElement(obj)) {
		if (obj instanceof Array) {
			for (var i = 0; i < obj.length; i++) {
				showObj(obj[i]);
			}
		} else if (typeof obj == 'object') {
			for (var i in obj) {
				showObj(obj[i]);
			}
		}
		return;
	}
	if (!un(draw) && !un(draw.div) && draw.drawCanvas.indexOf(obj) > -1) {
		draw.div.children[0].appendChild(obj);
	} else {
		container.appendChild(obj);
		resizeCanvas3(obj);
	}
	obj.vis = true;
	if (typeof hideAfter == 'number') {
		setTimeout(function () {
			hideObj(obj)
		}, hideAfter);
	}
}
function hideObj(obj) {
	if (un(obj)) return;
	if (!isElement(obj)) {
		if (obj instanceof Array) {
			for (var i = 0; i < obj.length; i++) {
				hideObj(obj[i]);
			}
		} else if (typeof obj == 'object') {
			for (var i in obj) {
				hideObj(obj[i]);
			}
		}
		return;
	}
	obj.vis = false;
	if (obj.parentNode == container) {
		container.removeChild(obj)
	} else if (!un(draw) && !un(draw.div) && draw.drawCanvas.indexOf(obj) > -1 && !un(obj.parentNode)) {
		obj.parentNode.removeChild(obj);
	}
}
