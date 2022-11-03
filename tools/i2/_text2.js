//js

var defaultTags = {
	font:'Arial',
	fontSize:20,
	bold:false,
	italic:false,
	color:'#000',
	selected:false,
	backColor:'none',
	align:[0,0],
	lineSpacingFactor:1.2,
	lineSpacingStyle:'variable'
}
function updateTagsFromText(arr,startTags) {
	var tags = clone(startTags);
	if (typeof arr == 'string') {
		var str = arr.slice(0);
		while (str.indexOf('<<') > -1) {
			str = str.slice(str.indexOf('<<'));
			var type = str.slice(2,str.indexOf(':'));
			var value = str.slice(str.indexOf(':')+1,str.indexOf('>>'));
			if (type == 'align') {
				if (value == 'left') tags.align[0] = -1;
				if (value == 'center') tags.align[0] = 0;
				if (value == 'right') tags.align[0] = 1;
			} else {
				if (!isNaN(Number(value))) value = Number(value);	
				if (value == 'true') value = true; 
				if (value == 'false') value = false; 
				tags[type] = value;
			}
			str = str.slice(str.indexOf('>>')+2);
		}
	} else if (typeof arr == 'object') {
		for (var i = 0; i < arr.length; i++) {
			tags = updateTagsFromText(arr[i],tags);
		}
	}
	return tags;
}
function getAlignFromText(arr,fallback) {
	var align = fallback;
	if (typeof arr == 'string') {
		var str = arr.slice(0);
		if (str.indexOf('<<align:') > -1) {
			str = str.slice(str.indexOf('<<align:'));
			align = str.slice(8,str.indexOf('>>'));
		}
	} else if (typeof arr == 'object') {
		for (var i = 0; i < arr.length; i++) {
			align = getAlignFromText(arr[i],align);
		}
	}
	if (align == 'left') align = -1;
	if (align == 'center') align = 0;
	if (align == 'right') align = 1;
	return align;
}

function splitTextByTags(textStr) {
	// find markup tags and split text
	var splitPoints = [0];
	for (var ch1 = 0; ch1 < textStr.length; ch1++) {
		if (textStr.slice(ch1).indexOf('<<') == 0 && textStr.slice(ch1).indexOf('<<<') !== 0) {
			for (var ch2 = ch1; ch2 < textStr.length; ch2++) {
				if (textStr.slice(ch2).indexOf('>>') == 0) {
					splitPoints.push(ch1,ch2+2);
					break;
				}
			}
		}
	}
	splitPoints.push(textStr.length);
	var splitText = [];
	for (var ch = 0; ch < splitPoints.length-1; ch++) {
		splitText.push(textStr.slice(splitPoints[ch],splitPoints[ch+1]))
	}
	return splitText;
}
function textArrayCombineAdjacentText(arr) {
	for (var gg = arr.length - 1; gg >= 0; gg--) {
		if (typeof arr[gg] == 'object') {
			textArrayCombineAdjacentText(arr[gg]);
		} else {
			if (gg < arr.length - 1 && typeof arr[gg] == 'string' && typeof arr[gg+1] == 'string') {
				arr[gg] += arr[gg+1];
				arr.splice(gg+1,1);;
			}
		}
	}
	return arr;
}
function textTagGetTypeValue(tagStr) {
	if (tagStr.indexOf('<<') == -1) {
		return null;
	} else if (tagStr.indexOf('<<') > 0) {
		tagStr = tagStr.slice(tagStr.indexOf('<<'))
	}
	var type = tagStr.slice(2,tagStr.indexOf(':'));
	var value = tagStr.slice(tagStr.indexOf(':')+1,tagStr.indexOf('>>'));
	if (!isNaN(Number(value))) value = Number(value);
	if (value == 'false') value = false;
	if (value == 'true') value = true;
	return {type:type,value:value};
}
function simplifyText(arr) {
	var arr = textArrayCombineAdjacentText(arr);
	var arr = textArrayRemoveRedundantTagsA(arr);
	var arr = textArrayRemoveRedundantTagsB(arr);
	var arr = textArrayRemoveRedundantAlignTags(arr);
	return arr;
}
function textArrayRemoveRedundantTagsA(arr) {
	// removes tags of the same type with no characters between them
	var tags = {bold:null,italic:null,fontSize:null,font:null,color:null,backColor:null,selected:null};
	var char = {bold:true,italic:true,fontSize:true,font:true,color:true,backColor:true,selected:true};
	
	if (typeof arr == 'object') {
		arr = arrayHandler(arr);
	} else if (typeof arr == 'string') {
		arr = stringHandler(arr);
	}

	function arrayHandler(arr) {
		for (var l = arr.length - 1; l >= 0; l--) {
			if (typeof arr[l] == 'string') {
				arr[l] = stringHandler(arr[l]);
			} else if (typeof arr[l] == 'object') {
				for (var prop in char) char[prop] = true;				
				arr[l] = arrayHandler(arr[l]);
			}
		}
		return arr;
	}
	
	function stringHandler(str) {
		var split = splitTextByTags(str);
		for (var j = split.length - 1; j >= 0; j--) {
			if (split[j].indexOf('<<') == 0) {
				var tag = textTagGetTypeValue(split[j]);
				if (tag.type == 'align') continue;
				if (char[tag.type] == false) {
					split.splice(j,1);
				} else {
					tags[tag.type] = tag.value;
					char[tag.type] = false;
				}
			} else if (split[j].length > 0) {
				for (var prop in char) char[prop] = true;
			}
		}
		var str = '';
		for (var j = 0; j < split.length; j++) str += split[j];
		return str;
	}
	return arr;	
}
function textArrayRemoveRedundantTagsB(arr) {
	// removes redundant repeated tags
	var tags = {bold:null,italic:null,fontSize:null,font:null,color:null,backColor:null,selected:null};
	
	if (typeof arr == 'object') {
		arr = arrayHandler(arr);
	} else if (typeof arr == 'string') {
		arr = stringHandler(arr);
	}

	function arrayHandler(arr) {
		for (var l = 0; l < arr.length; l++) {
			if (typeof arr[l] == 'string') {
				arr[l] = stringHandler(arr[l]);
			} else if (typeof arr[l] == 'object') {
				arr[l] = arrayHandler(arr[l]);
			}
		}
		return arr;
	}
	
	function stringHandler(str) {
		var split = splitTextByTags(str);
		for (var j = 0; j < split.length; j++) {
			if (split[j].indexOf('<<') == 0) {
				var tag = textTagGetTypeValue(split[j]);
				if (tag.type == 'align') continue;
				if (tags[tag.type] == tag.value) {
					split.splice(j,1);
				} else {
					tags[tag.type] = tag.value;
				}
			}
		}
		var str = '';
		for (var j = 0; j < split.length; j++) str += split[j];
		return str;
	}
	return arr;	
}
function textArrayRemoveRedundantAlignTags(arr) {
	var alignSet = false;
	
	if (typeof arr == 'object') {
		arr = arrayHandler(arr);
	} else if (typeof arr == 'string') {
		arr = stringHandler(arr);
	}

	function arrayHandler(arr) {
		for (var l = 0; l < arr.length; l++) {
			if (typeof arr[l] == 'string') {
				arr[l] = stringHandler(arr[l]);
			} else if (typeof arr[l] == 'object') {
				arr[l] = arrayHandler(arr[l]);
			}
		}
		return arr;
	}
	
	function stringHandler(str) {
		var split = splitTextByTags(str);
		for (var j = 0; j < split.length; j++) {
			if (split[j].indexOf('<<align:') == 0) {
				if (alignSet == true) split.splice(j,1);
				alignSet = true;
			} else if (split[j].indexOf(br) > -1) {
				alignSet = false;
			}
		}
		var str = '';
		for (var j = 0; j < split.length; j++) str += split[j];
		return str;
	}
	return arr;	
}
function textArrayReplace(arr,find,replace) {
	//if (find == '<<br>>') console.log(clone(arr),arr,find,replace);
	if (typeof arr == 'string') {
		arr = replaceAll(arr,find,replace);
	} else if (typeof arr == 'object') {
		for (var i = 0; i < arr.length; i++) {
			arr[i] = textArrayReplace(arr[i],find,replace);
		}
	}
	return arr;	
}
function textArrayFontSizeAdjust(arr,sf) {
	if (typeof arr == 'string') {
		for (var c = 0; c < arr.length; c++) {
			var sliced = arr.slice(c);
			if (sliced.indexOf('<<fontSize:') == 0) {
				var before = arr.slice(0,c);
				var d = sliced.indexOf('>>');
				var after = sliced.slice(d+2);
				var num = arr.slice(c+11);
				num = num.slice(0,num.indexOf('>>'));
				num = Number(num);
				if (!isNaN(num)) {
					num = Math.round(num*sf);
					arr = before+'<<fontSize:'+num+'>>'+after;
				}
			}
		}
	} else if (arr instanceof Array) {
		for (var i = 0; i < arr.length; i++) {
			arr[i] = textArrayFontSizeAdjust(arr[i],sf);
		}
	} else if (typeof arr == 'object') {
		for (var i in arr) {
			arr[i] = textArrayFontSizeAdjust(arr[i],sf);
		}
	}
	return arr;	
}
function textArrayFind(arr,str,found,depth) {
	if (un(found)) found = false;
	if (un(depth)) depth = 0;
	if (typeof arr == 'string') {
		if (arr.indexOf(str) > -1) found = true;
	} else if (typeof arr == 'object') {
		for (var i = 0; i < arr.length; i++) {
			if (depth > 0 && i === 0 && ['frac','pow','sqrt','root','power','sub','subs','subscript','sin','cos','tan','log','ln','sin-1','cos-1','tan-1','logBase','abs','exp','int1','sigma1','sigma2','int2','recurring','vectorArrow','bar','hat','colVector2d','colVector3d','mixedNum','lim'].indexOf(arr[i]) > -1) continue;
			found = textArrayFind(arr[i],str,found,depth+1);
		}
	}
	return found;	
}
function textArrayRemoveDefaultTags(arr,tags) { //also removes redundant tags at end
	if (un(tags)) tags = defaultTags;
	var sp = splitTextByTags(arr[0]);
	arr[0] = '';
	var stop = false;
	for (var s = 0; s < sp.length; s++) {
		if (sp[s].length == 0) continue;
		if (stop == true || (sp[s].indexOf('<<') !== 0)) {
			arr[0] += sp[s];
			stop = true;
		} else {
			var type = sp[s].slice(2,sp[s].indexOf(':'));
			var value = sp[s].slice(sp[s].indexOf(':')+1,-2);
			if (!isNaN(Number(value))) value = Number(value);
			if (value == 'true') value = true;
			if (value == 'false') value = false;
			if (tags[type] !== value || type == 'align') arr[0] += sp[s];
		}
	}
	
	if (typeof arr[arr.length-1] == 'string') {
		var sp = splitTextByTags(arr[arr.length-1]);
		arr[arr.length-1] = '';
		var stop = false;
		for (var s = sp.length-1; s >= 0; s--) {
			if (sp[s].length == 0) continue;
			if (stop == true || (sp[s].indexOf('<<') !== 0)) {
				arr[arr.length-1] = sp[s] + arr[arr.length-1];
				stop = true;
			} else {
				var type = sp[s].slice(2,sp[s].indexOf(':'));
				if (type == 'align') arr[arr.length-1] = sp[s] + arr[arr.length-1];
			}
		}
	}
	return arr;
}
function textArrayCheckIfEmpty(arr) {
	for (var i = 0; i < arr.length; i++) {
		if (typeof arr[i] == 'object') return false;
		var sp = splitTextByTags(arr[i]);
		for (var s = 0; s < sp.length; s++) {
			if (sp[s].length == 0 || sp[s].indexOf('<<') == 0) continue;
			return false;
		}
	}
	return true;
}
function removeTags(elem) {
	if (typeof elem == 'string') {
		//remove markup tags
		for (var char = elem.length-1; char > -1; char--) {
			if (elem.slice(char).indexOf('>>') == 0 && elem.slice(char-1).indexOf('>>>') !== 0) {
				for (var char2 = char-2; char2 > -1; char2--) {
					if (elem.slice(char2).indexOf('<<') == 0) {
						elem = elem.slice(0,char2) + elem.slice(char+2);
						char = char2;
						break;
					}
				}
			}
		}
	} else {
		for (var i = 0; i < elem.length; i++) {
			elem[i] = removeTags(elem[i]);
		}
	}
	return elem;
}
function textArrayGetStartTags(arr) {
	var str = (typeof arr == 'string') ? arr : arr[0];

	var splitPoints = [0];
	for (var c = 0; c < str.length; c++) {
		if (str.slice(c).indexOf('<<') == 0 && str.slice(c).indexOf('<<<') !== 0) {
			for (var c2 = c; c2 < str.length; c2++) {
				if (str.slice(c2).indexOf('>>') == 0) {
					splitPoints.push(c,c2+2);
					break;
				}
			}
		}
	}
	splitPoints.push(str.length);
	var tags = '';
	for (var c = 0; c < splitPoints.length-1; c++) {
		var subStr = str.slice(splitPoints[c],splitPoints[c+1]);
		if (subStr.indexOf('<<') == 0) {
			tags += subStr;
		} else if (subStr !== '') {
			break;
		}
	}
	
	return tags;
}
function textArrayToLowerCase(arr) {
	if (typeof arr == 'string') {
		arr = arr.toLowerCase();
	} else if (typeof arr == 'object') {
		for (var i = 0; i < arr.length; i++) {
			arr[i] = textArrayToLowerCase(arr[i]);
		}
	}
	return arr;	
}

function removeTagsOfType(textArray,tagType) {
	var stringHandler = function(string) {
		for (var j = string.length - 1; j >= 0; j--) {
			var slice = string.slice(j);
			if (slice.indexOf('<<'+tagType+':') == 0) {
				string = string.slice(0,j)+string.slice(j+slice.indexOf('>>')+2);
			}
		}
		return string;
	}
	
	var arrayHandler = function(array) {
		for (var l = array.length - 1; l >= 0; l--) {
			if (typeof array[l] == 'string') {
				array[l] = stringHandler(array[l]);
			} else {	
				array[l] = arrayHandler(array[l]);
			}
		}
		return array;
	}
	
	if (typeof textArray == 'object') {
		return arrayHandler(textArray);
	} else if (typeof textArray == 'string') {
		return stringHandler(textArray);
	}
}
function getDateString() {
	var monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	//var dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
	//var monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
	//var dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
	var dateNow = new Date();
	var dateNum = dateNow.getDate();
	var dateString = String(dateNum) + ([1,21,31].includes(dateNum) ? 'st' : [2,22].includes(dateNum) ? 'nd' : [3,23].includes(dateNum) ? 'rd' : 'th');
	//dateString = dayNames[dateNow.getDay()]+' '+dateString+' '+monthNames[dateNow.getMonth()];
	return dateString+' '+monthNames[dateNow.getMonth()];	
}

function text(obj) {
	// Required
	var ctx = obj.context || obj.ctx;
	ctx.beginPath();
	var textArray = obj.textArray || obj.text || [];
	if (typeof textArray == 'number') {
		textArray = [String(textArray)];
	} else if (typeof textArray == 'string') {
		textArray = [textArray];
	}
	textArray = textArrayReplace(textArray,'<<br>>',br);
	
	if (typeof mode !== 'undefined' && mode == 'present') textArray = textArrayReplace(clone(textArray),'{date}',getDateString());
	
	var measureOnly = boolean(obj.measureOnly,false);
	//var sf = obj.sf || 1;
	var sf = 1;
	
	if (!un(obj.tags)) {
		var startTags = clone(obj.tags);
	} else {
		var startTags = clone(defaultTags);
		for (var key in startTags) {
			if (key !== 'align');
			startTags[key] = def([obj[key],defaultTags[key]]);
		}
	}
	var tabWidth = obj.tabWidth || 20;
	
	// Text Placing, Spacing & Alignment
	if (un(obj.rect)) {
		obj.rect = [
			def([obj.left,obj.l,0]),
			def([obj.top,obj.t,0]),
			def([obj.maxWidth,obj.width,obj.w,ctx.canvas.width]),
			def([obj.maxHeight,obj.height,obj.h,ctx.canvas.height])
		];
	}
	var left = obj.rect[0];
	var top = obj.rect[1];
	var maxWidth = obj.rect[2];
	var maxHeight = obj.rect[3];
	var leftLoose = left;
	var maxWidthLoose = maxWidth;
	if (!un(obj.marginLeft)) {
		left += obj.marginLeft;
		maxWidth -= obj.marginLeft;
	}
	if (!un(obj.marginRight)) {
		maxWidth -= obj.marginRight;
	}
	
	if (typeof obj.align !== 'object') {
		var align = clone(defaultTags.align);
		align[0] = def([obj.align,obj.textAlign,obj.horizAlign,-1]);
		align[1] = def([obj.vertAlign,-1]);
		if (align[0] == 'left') align[0] = -1;
		if (align[0] == 'center') align[0] = 0;
		if (align[0] == 'right') align[0] = 1;
		if (align[1] == 'top') align[1] = -1;
		if (align[1] == 'middle') align[1] = 0;
		if (align[1] == 'bottom') align[1] = 1;
	} else {
		var align = obj.align;
	}
	var allowSpaces = boolean(obj.allowSpaces,false);
	
	var minTightWidth = obj.minTightWidth || 50;
	var minTightHeight = obj.minTightHeight || 50;	
	
	var fracScale = obj.fracScale || obj._fracScale || 0.7;
	var algPadding = obj.algPadding || obj._algPadding || 'default';
	
	//var alignEquals = boolean(obj.alignEquals, false);
	//var equalsCenter = obj.equalsLeft || left + 0.5 * maxWidth;
	
	var lineSpacingFactor = obj.lineSpacingFactor || 1.2;
	var lineSpacingStyle = obj.lineSpacingStyle || obj.spacingStyle || 'variable';
	
	var box = {};
	var padding = obj.padding || 0;
	if (un(obj.box) || obj.box.type == 'none') {
		box.type = 'none';
	} else {
		box.type = obj.box.type || 'loose';
		box.color = obj.box.color || obj.box.backgroundColor || '#FFC';
		box.borderColor = obj.box.borderColor || obj.borderColor || '#000';
		box.borderWidth = obj.box.borderWidth || obj.borderWidth || 4*sf;
		box.dash = obj.box.dash || [];
		box.radius = obj.box.rounded || obj.box.radius || 0;
		box.dir = obj.box.dir || 'right';
		box.arrowWidth = obj.box.arrowWidth || 40;
		var padding = obj.box.padding || obj.padding || 10*sf;
	}
	var tags = clone(startTags);
	
	var backgroundColor = obj.backgroundColor || '#FFF'; // determines selection color
	if (box.type !== 'none' && !un(box.color) && box.color !== 'none') backgroundColor = box.color; 
	
	//console.log(ctx.canvas,textArray,align,obj.rect);
	
	var words = [[]];	
	var arr = clone(textArray);
	for (var i = 0; i < arr.length; i++) {
		if (typeof arr[i] == 'string') {
			do {
				var s = arr[i].indexOf(" ");
				var t = arr[i].indexOf(tab);
				var b = arr[i].indexOf(br);
				if (s == -1 && t == -1 && b == -1) {
					words[words.length-1].push(arr[i]);
					arr[i] = '';
				} else if (b > -1 && (t == -1 || b < t) && (s == -1 || b < s)) {
					words[words.length-1].push(arr[i].slice(0,b),br);
					arr[i] = arr[i].slice(b+1);
					if (arr[i].length == 0 && i == arr.length-1) words[words.length-1].push('');
				} else if (s > -1 && (t == -1 || s < t)) {
					words[words.length-1].push(arr[i].slice(0,s)," ");
					arr[i] = arr[i].slice(s+1);
				} else if (t > -1 && (s == -1 || t < s)) {
					words[words.length-1].push(arr[i].slice(0,t),tab);
					arr[i] = arr[i].slice(t+1);
				}
			} while (arr[i].length > 0);
		} else {
			words[words.length-1].push(arr[i]);
		}
	}
	//console.log(words);
	
	var subWords = [[]];
	for (var l = 0; l < words.length; l++) {
		for (var w = 0; w < words[l].length; w++) {
			var sub = words[l][w];
			if (sub == br || sub == " " || sub == tab) {
				subWords.push([sub],[]);
			} else {
				subWords[subWords.length-1].push(sub);
			}
		}
	}
	
	if (obj.log) console.log(words);
	
	var lines = [];
	var line;
	newLine();
	function newLine() {
		line = {width:0,height:tags.fontSize,words:[],text:[]};
		lines.push(line);
	}
	
	for (var w = 0; w < subWords.length; w++) {
		var subWord = subWords[w];
		subWords[w] = {text:subWords[w],width:0,tags:clone(tags)};
		if (arraysEqual(subWord,[br])) {
			line.hardBreak = true;
			newLine();
		} else if (arraysEqual(subWord,[tab])) {
			if (w > 1 && subWords[w-1].text.length == 1 && subWords[w-2].tab == true) {
				var dw = tabWidth;
			} else {
				var dw = (Math.ceil(line.width/tabWidth))*tabWidth - line.width;
			}
			line.words.push(subWords[w]);
			line.text = line.text.concat(subWords[w].text);
			subWords[w].width = dw;
			subWords[w].tab = true;
			line.width += dw;
			if (line.width > maxWidth) newLine();
		} else if (subWord.length == 0) {
			
		} else {
			var measure = drawMathsText(ctx,subWords[w].text,tags.fontSize,left,top,false,[],align,'middle',tags.color,'measure',tags.backColor,tags.bold,tags.italic,tags.font,tags.selected,sf,'none',fracScale,algPadding);
			subWords[w].width = measure[0];
			subWords[w].height = measure[1];
			
			tags = updateTagsFromText(subWords[w].text,tags);
			
			if (line.width > 0 && line.width + subWords[w].width > maxWidth) newLine();
			
			//if (allowSpaces == true || line.width > 0 || !arraysEqual(subWord,[" "])) {
				line.words.push(subWords[w]);
				line.text = line.text.concat(subWords[w].text);
				line.width += subWords[w].width;
				line.height = Math.max(line.height,subWords[w].height);
			//}
			
		}
	}

	if (obj.log) console.log(lines);
	
	//console.log('subWords:',subWords);
	
	var maxLineHeight = 0;
	var totalLineHeight = 0;
	
	for (var l = 0; l < lines.length; l++) {
		var line = lines[l];
		// test for spaces at the end of line and remove
		/*if (allowSpaces == false) {
			for (var e = line.words.length-1; e >= 0; e--) {
				var word = line.words[e];
				if (arraysEquals(word[e],[' ']) {
					
				} else {
					
				}
				if (typeof elem == 'string' && elem.length > 0) {
					var sub = splitTextByTags(elem);
					console.log(sub);
					
					if (elem[elem.length-1] == " ") {
						elem = elem.slice(0,elem.length-1);
						// get the width of this space and reduce line width
						var font = line.font;
						var fontSize = line.fontSize;
						var bold = line.bold;
						var italic = line.italic;
						// work forwards through line to get the styling at the point of the space
						for (var elem2 = 0; elem2 < eleme; elem2++) {
							if (typeof line.text[elem2] == 'string' && line.text[elem2].indexOf('<<') == 0) {
								markupTag(line.text[elem2]);	
							}
						}
						var styledText = styleElement(" "); 
						var spaceWidth = drawMathsText(ctx, styledText, fontSize, left, top, false, [], align, 'middle', color, 'measure')[0];
						line.width -= spaceWidth;
					}
					break;
				} else if (typeof elem == 'object') {
					break;
				}
			}
		}*/
		
		var alignFromText = getAlignFromText(line.text);
		if (!un(alignFromText)) {
			line.align = alignFromText;
		} else if (l > 0 && lines[l-1].hardBreak !== true) {
			line.align = lines[l-1].align;
		} else {
			line.align = align[0];
		}

		//if (lines.length > 3) console.log('line'+l+':',line);
		
		// fix x
		if (line.align == -1) line.x = left + padding;
		if (line.align == 0) line.x = left + 0.5 * maxWidth;
		if (line.align == 1) line.x = left + maxWidth - padding;
		
		// sort relative vertical spacing (assuming variable)
		if (l > 0) { 
			line.relY = lines[l-1].relY + (0.5 * lines[l-1].height + 0.5 * line.height) * lineSpacingFactor;
		} else {
			line.relY = 0.5 * line.height * lineSpacingFactor;
		}
		maxLineHeight = Math.max(maxLineHeight, line.height);
		totalLineHeight += line.height * lineSpacingFactor;
	}
	
	if (lineSpacingStyle == 'fixed') {
		for (var l = 0; l < lines.length; l++) {
			lines[l].relY = (l + 0.5) * maxLineHeight * lineSpacingFactor;
		}
		totalLineHeight = lines.length * maxLineHeight * lineSpacingFactor;
	}
	
	// work out where the top of the text will actually be
	var topPos = top + padding;
	
	if (align[1] == 0) {
		topPos = top + 0.5 * maxHeight - 0.5 * totalLineHeight;
	} else if (align[1] == 1) {
		topPos = top + maxHeight - padding - totalLineHeight;	
	}
	
	/*
	if (alignEquals == true) {
		var leftOfEqualsWidth = [];
		var rightOfEqualsWidth = [];
		var equalsWidth = [];
		for (var line = 0; line < textLine.length; line++) {
			var leftOfEquals = [];
			var rightOfEquals = [];
			var equalsFound = false;
			// locate equals sign in each line
			for (var elem = 0; elem < textLine[line].text.length; elem++) {
				if (equalsFound == true) {
					rightOfEquals.push(textLine[line].text[elem]);
				} else {
					if (typeof textLine[line].text[elem] == 'string') {
						var equalsPos;
						for (var pos = 0; pos < textLine[line].text[elem].length; pos++) {
							if (textLine[line].text[elem][pos] == "=") {
								equalsPos = pos;
								equalsFound = true;
							}
						}
						if (equalsFound == true) {
							leftOfEquals.push(textLine[line].text[elem].slice(0, equalsPos));
							rightOfEquals.push(textLine[line].text[elem].slice(equalsPos+1));
						} else {
							leftOfEquals.push(textLine[line].text[elem]);	
						}
					} else {
						leftOfEquals.push(textLine[line].text[elem]);
					}
				}
			}
			if (equalsFound == true) {
				// measure left of equals sign
				var styledLine1 = leftOfEquals.slice(0);
				styledLine1.unshift('<<font:'+textLine[line].font+'>><<fontSize:'+textLine[line].fontSize+'>><<bold:'+textLine[line].bold+'>><<italic:'+textLine[line].italic+'>><<color:'+textLine[line].color+'>><<selected:'+selected+'>>');
				leftOfEqualsWidth[line] = drawMathsText(ctx, styledLine1, fontSize, x, y, false, [], textLine[line].align, 'middle', '#000', 'measure')[0];
				
				// measure equals sign
				styledLine1.push("=");
				equalsWidth[line] = drawMathsText(ctx, styledLine1, fontSize, x, y, false, [], textLine[line].align, 'middle', '#000', 'measure')[0] - leftOfEqualsWidth[line];
				
				// measure right of equals sign
				styledLine1 = styledLine1.concat(rightOfEquals);
				rightOfEqualsWidth[line] = drawMathsText(ctx, styledLine1, fontSize, x, y, false, [], textLine[line].align, 'middle', '#000', 'measure')[0] - equalsWidth[line] - leftOfEqualsWidth[line];	
				
				// loop through rows and set x value accordingly
				textLine[line].alignEquals = true;	
				textLine[line].align = 'left';
				textLine[line].x = equalsCenter - 0.5 * equalsWidth[line] - leftOfEqualsWidth[line];
								
			} else {
				textLine[line].alignEquals = false;	
			}
		}
	}
	*/
	
	// calc tight rect
	if (lines[0].align == -1) {
		var l = lines[0].x - padding;
		var r = lines[0].x + lines[0].width + padding;
	} else if (lines[0].align == 0) {
		var l = lines[0].x - 0.5 * lines[0].width - padding;
		var r = lines[0].x + 0.5 * lines[0].width + padding;
	} else if (lines[0].align == 1) {
		var l = lines[0].x - lines[0].width - padding;
		var r = lines[0].x + padding;
	}
	var t = topPos - padding;
	var b = topPos + totalLineHeight + padding;
	for (var i = 1; i < lines.length; i++) {
		if (lines[i].align == -1) {
			l = Math.min(l, lines[i].x - padding);
			r = Math.max(r, lines[i].x + lines[i].width + padding);
		} else if (lines[i].align == 0) {
			l = Math.min(l, lines[i].x - 0.5 * lines[i].width - padding);
			r = Math.max(r, lines[i].x + 0.5 * lines[i].width + padding);
		} else if (lines[i].align == 1) {
			l = Math.min(l, lines[i].x - lines[i].width - padding);
			r = Math.max(r, lines[i].x + padding);
		}
	}
	if (r - l < minTightWidth) {
		var alterBy = minTightWidth - (r - l);
		l -= alterBy / 2;
		r += alterBy / 2;
	}
	if (b - t < minTightHeight) {
		var alterBy = minTightHeight - (b - t);
		t -= alterBy / 2;
		b += alterBy / 2;		
	}

	if (box.type == 'loose') {
		roundedRect2(ctx,leftLoose,top,maxWidthLoose,maxHeight,box.radius,box.borderWidth,box.borderColor,box.color,box.dash);
	} else if (box.type == 'tight') {
		roundedRect2(ctx,l,t,r-l,b-t,box.radius,box.borderWidth,box.borderColor,box.color,box.dash);
	} else if (box.type == 'flowArrow') {
		var left = leftLoose;
		var right = left + maxWidthLoose;
		var bottom = top + maxHeight;
		if (box.dir == 'left') {
			var points = [[right,top],[left+box.arrowWidth/2,top],[left-box.arrowWidth/2,(top+bottom)/2],[left+box.arrowWidth/2,bottom],[right,bottom]];
		} else {
			var points = [[left,top],[right-box.arrowWidth/2,top],[right+box.arrowWidth/2,(top+bottom)/2],[right-box.arrowWidth/2,bottom],[left,bottom]];
		}
		drawPolygon({ctx:ctx,points:points,fillColor:box.color,lineColor:box.borderColor,lineWidth:box.borderWidth,dash:box.dash});
	}
	var tightRect = [l,t,r-l,b-t];
	
	var returnTextLoc = [];
	var returnTextLoc2 = [];
	var lineRects = [];
	var totalTextWidth = 0;
	var lineLocs = [];
	
	if (boolean(obj.showText,true) == true) {
		for (var l = 0; l < lines.length; l++) {
			var line = lines[l];
			//console.log(l,line);
			
			totalTextWidth += line.width;
			var y = topPos + line.relY;
			if (!un(line.words[0])) {
				var style = line.words[0].tags;
			} else {
				var style = defaultTags;
			}
			var align2 = line.align == 1 ? 'right' : line.align == 0 ? 'center' : 'left';
			line.text = textArrayCombineAdjacentText(line.text);

			var measure = drawMathsText(ctx,line.text,style.fontSize,line.x,y,false,[],align2,'middle',style.color,'draw',style.backColor,style.bold,style.italic,style.font,style.selected,sf,backgroundColor,fracScale,algPadding);
			
			lineRects[l] = measure.tightRect;
			var textLoc = measure.textLoc;
			
			for (var i = 0; i < textLoc.length; i++) {
				arrayProcess(textLoc[i]);
			}	
			function arrayProcess(arr) {
				for (var j = 0; j < arr.length; j++) {
					if (arr[j] instanceof Array) {
						arrayProcess(arr[j]);
					} else if (typeof arr[j] == 'object') {
						arr[j].lineNum = l;
					}
				}
			}
			
			if (line.hardBreak !== true && typeof line.text.last() == 'string' && line.text.last().slice(-1) == ' ' && l < lines.length-1) {
				line.softBreakSpace = true;
				textLoc[textLoc.length-1].pop();
			}
			
			var textLoc2Map = mapArray(textLoc,true);
			lineLocs[l] = textLoc2Map.length;
			
			returnTextLoc2 = returnTextLoc2.concat(textLoc);
			
			/*//if (lines.length > 1) console.log('+',l,textLoc);
			if (returnTextLoc.length > 0) {
				//console.log('+',l,textLoc[0]);
				if (textLoc[0].length == 1) {
					returnTextLoc[returnTextLoc.length-1] = returnTextLoc[returnTextLoc.length-1].concat(textLoc[0]);
					textLoc.shift();
				}
				//console.log(textLoc);
				returnTextLoc = returnTextLoc.concat(textLoc);
			} else {
				returnTextLoc = textLoc.slice(0);
			}*/
		}
	}
	//if (lines.length > 1) console.log('-',returnTextLoc);
	
	for (var i = returnTextLoc2.length-1; i >= 1; i--) {
		if (typeof returnTextLoc2[i][0] == 'object' && typeof returnTextLoc2[i-1][0] == 'object') {
			returnTextLoc2[i-1] =  returnTextLoc2[i-1].concat(returnTextLoc2[i]);
			returnTextLoc2.splice(i,1);
		}
	}
	//if (lines.length > 1) console.log('-',returnTextLoc2);
		
	var breakCount = 0;
	var softBreaks = [];
	var softBreakSpaces = [];
	var hardBreaks = [];
	for (var i = 0; i < lineLocs.length-1; i++) {
		breakCount += lineLocs[i];
		if (lines[i].hardBreak == true) {
			hardBreaks.push(breakCount);
		} else if (lines[i].softBreakSpace == true) {
			softBreakSpaces.push(breakCount);
		} else {
			softBreaks.push(breakCount);
		}
	}

	//console.log({textLoc:returnTextLoc,tightRect:tightRect,totalTextWidth:totalTextWidth,maxWordWidth:maxWordWidth,softBreaks:softBreaks,hardBreaks:hardBreaks});
	
	return {
		textLoc:returnTextLoc2,
		tightRect:tightRect,
		totalTextWidth:totalTextWidth,
		//maxWordWidth:maxWordWidth,
		softBreaks:softBreaks,
		softBreakSpaces:softBreakSpaces,
		hardBreaks:hardBreaks,
		lineRects:lineRects
	};
}