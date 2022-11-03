/*if (typeof console == "undefined") {
    this.console = { log: function (msg) { alert(msg); } };
}*/

/*
text selection - double click should select word
cursor up/down - remember horizPos of original line and find closest in other lines

*/

/* example of basic use:
var j000inputs = inputs({
	inputs:[
		{left:900,top:300,width:100,height:50,algText:true},
		{left:900,top:500,width:100,height:50,algText:true}	
	],
	leftText:[
		['Perimeter = '],
		['Area = ']
	],
	rightText:[
		['cm'],
		['cm',['pow',false,['2']]]	
	],
	checkFuncs:[
		function(mathsInput) {
			if (mathsInput.stringJS == 'correctAns') {
				return true;	
			} else {
				return false
			}
		},
		function(mathsInput) {
			if (mathsInput.stringJS == 'correctAns') {
				return true;	
			} else {
				return false
			}
		}
	],
});
*/
function inputs(object) {
	var inputs = object.inputs;
	var checkFuncs = object.checkFuncs;
	var buttonPos = object.buttonPos || [990,620];
	var taskComplete = boolean(object.taskCompleted,true);
	var buttonVis = boolean(object.buttonVisible,true);
	
	var inputArray = [];
	
	for (var i = 0; i < inputs.length; i++) {
		var zIndex = inputs[i].zIndex || 2;
		// mathsInput
		var input = createMathsInput2(inputs[i]);
		var vis = boolean(inputs[i].visible,true);
				
		// leftText && rightText	
		var button3 = document.createElement('canvas');
		button3.width = 1200;
		button3.height = 700;
		button3.setAttribute('position', 'absolute');
		button3.setAttribute('cursor', 'auto');
		button3.setAttribute('draggable', 'false');
		button3.setAttribute('class', 'buttonClass');
		var data3 = [0,0,1200,700,vis,false,false,zIndex];
		if (vis == true) container.appendChild(button3);
		data3[130] = true;
		for (var j = 0; j < 8; j++) {data3[100+j] = data3[j];}
		button3.style.zIndex = zIndex;
		button3.style.pointerEvents = 'none';
		canvases[pageIndex].push(button3);
		button3.data = data3;	
		button3.ctx = button3.getContext('2d');

		if (typeof object.leftText == 'object') {
			if (typeof object.leftText[i] == 'object') {
				var maxLines = inputs[i].maxLines || 1;
				var fontSize = inputs[i].fontSize || 0.5 * (inputs[i].height / maxLines);
				var textColor = inputs[i].textColor || '#000';
				drawMathsText(button3.ctx,object.leftText[i],fontSize,inputs[i].left-4,inputs[i].top+0.5*inputs[i].height,false,[],'right','middle',textColor);
				input.leftText = object.leftText[i];
			}
		}
		if (typeof object.rightText == 'object') {
			if (typeof object.rightText[i] == 'object') {
				var maxLines = inputs[i].maxLines || 1;
				var fontSize = inputs[i].fontSize || 0.5 * (inputs[i].height / maxLines);
				var textColor = inputs[i].textColor || '#000';
				drawMathsText(button3.ctx,object.rightText[i],fontSize,inputs[i].left+inputs[i].width+15,inputs[i].top+0.5*inputs[i].height,false,[],'left','middle',textColor);
				var textMeasure = drawMathsText(button3.ctx,object.rightText[i],fontSize,inputs[i].left+inputs[i].width+15,inputs[i].top+0.5*inputs[i].height,false,[],'left','middle',textColor,'measure');
				if (typeof inputs[i].offset === 'undefined') inputs[i].offset = [textMeasure[0]+5,0];
				input.rightText = object.rightText[i];
			}
		}
		if (typeof inputs[i].offset === 'undefined') inputs[i].offset = [0,0];		
		
		input.leftRightTextCanvas = button3;
		input.canvas.leftRightTextCanvas = button3;
		
		// what if... maths input is entered through tab key, rather than clicking on??
		addListener(input.canvas, function() {
			hideObj(this.tick,this.tick.data);
			hideObj(this.cross,this.cross.data);
		});
		
		// tick canvas
		var button = document.createElement('canvas');
		button.width = 40;
		button.height = 50;
		button.setAttribute('position', 'absolute');
		button.setAttribute('cursor', 'auto');
		button.setAttribute('draggable', 'false');
		button.setAttribute('class', 'buttonClass');
		var data = [inputs[i].left+inputs[i].width+13+inputs[i].offset[0],inputs[i].top+0.5*inputs[i].height-25+inputs[i].offset[1],40,50,false,false,false,zIndex];
		data[130] = true;
		for (var j = 0; j < 8; j++) {data[100+j] = data[j];}
		button.style.zIndex = zIndex;
		button.style.pointerEvents = 'none';
		canvases[pageIndex].push(button3);
		button.data = data;	
		button.ctx = button.getContext('2d');
		drawTick(button.ctx,40,50);

		// cross canvas
		var button2 = document.createElement('canvas');
		button2.width = 32;
		button2.height = 40;
		button2.setAttribute('position', 'absolute');
		button2.setAttribute('cursor', 'auto');
		button2.setAttribute('draggable', 'false');
		button2.setAttribute('class', 'buttonClass');
		var data2 = [inputs[i].left+inputs[i].width+20+inputs[i].offset[0],inputs[i].top+0.5*inputs[i].height-20+inputs[i].offset[1],32,40,false,false,false,zIndex];
		data2[130] = true;
		for (var j = 0; j < 8; j++) {data2[100+j] = data2[j];}
		button2.style.zIndex = zIndex;
		button.style.pointerEvents = 'none';
		canvases[pageIndex].push(button3);
		button2.data = data2;	
		button2.ctx = button2.getContext('2d');
		drawCross(button2.ctx,32,40);
		
		input.tick = button;
		input.cross = button2;		
		input.canvas.tick = button;
		input.canvas.cross = button2;		
		
		inputArray.push(input);
	}
	if (boolean(object.checkAnsButton,true)) {
		// check answer button
		var button = document.createElement('canvas');
		button.width = 180;
		button.height = 50;
		button.setAttribute('position', 'absolute');
		button.setAttribute('cursor', 'auto');
		button.setAttribute('draggable', 'false');
		button.setAttribute('class', 'buttonClass');
		var data = [buttonPos[0],buttonPos[1],180,50,buttonVis,false,true,2];
		if (buttonVis == true) container.appendChild(button);
		data[130] = true;
		for (var i = 0; i < 8; i++) {data[100+i] = data[i];}
		button.style.zIndex = 2;
		canvases[pageIndex].push(button3);
		button.data = data;	
		button.ctx = button.getContext('2d');
		if (inputs.length > 1) {
			drawTextBox(button,button.ctx,button.data,'#6F9','#000',4,'28px Hobo','#000','center','Check Answers');
		} else {
			drawTextBox(button,button.ctx,button.data,'#6F9','#000',4,'28px Hobo','#000','center','Check Answer');		
		}
		
		addListener(button,function() {
			var inputs = this.inputs;
			var checkFuncs = this.checkFuncs;
			var complete = true;
			for (var i = 0; i < inputs.length; i++) {
				if (checkFuncs[i](inputs[i]) == true) {
					hideObj(inputs[i].cross,inputs[i].cross.data);
					showObj(inputs[i].tick,inputs[i].tick.data);
				} else {
					hideObj(inputs[i].tick,inputs[i].tick.data);
					showObj(inputs[i].cross,inputs[i].cross.data,3000);
					complete = false;
				}
			}
			if (complete == true) {
				taskCompleted();	
			}
		});
	
		button.inputs = inputArray;
		button.checkFuncs = checkFuncs;
		button.taskComplete = true;
		button.textCanvas = button3;
		return button;
	}
}

function hideAllInputs() {
	for (var i = 0; i < mathsInput[pageIndex].length; i++) {
		hideMathsInput(mathsInput[pageIndex][i]);
	}
}
function showAllInputs() {
	for (var i = 0; i < mathsInput[pageIndex].length; i++) {
		showMathsInput(mathsInput[pageIndex][i]);
	}	
}
function hideMathsInput(mathsInput) {
	hideObj(mathsInput.canvas);
	if (typeof mathsInput.cursorCanvas !== 'undefined') {
		hideObj(mathsInput.cursorCanvas);
	}
	if (typeof mathsInput.tick !== 'undefined') {
		hideObj(mathsInput.tick);
	}
	if (typeof mathsInput.cross !== 'undefined') {
		hideObj(mathsInput.cross);
	}
	if (typeof mathsInput.leftRightTextCanvas !== 'undefined') {
		hideObj(mathsInput.leftRightTextCanvas);
	}	
}
function showMathsInput(mathsInput) {
	showObj(mathsInput.canvas);
	if (typeof mathsInput.cursorCanvas !== 'undefined') {
		showObj(mathsInput.cursorCanvas);
	}
	if (typeof mathsInput.leftRightTextCanvas !== 'undefined') {
		showObj(mathsInput.leftRightTextCanvas);
	}	
}
function moveMathsInput(input,left,top) {
	if (typeof input.data == 'undefined') return;
	var dx = left - input.data[100];
	var dy = top - input.data[101];

	input.data[100] += dx;
	input.data[101] += dy;
	resizeCanvas2(input.canvas,input.data[100],input.data[101]);
	
	if (typeof input.cross !== 'undefined') {
		input.cross.data[100] += dx;
		input.cross.data[101] += dy;
		resizeCanvas2(input.cross,input.cross.data[100],input.cross.data[101]);
	}

	if (typeof input.tick !== 'undefined') {	
		input.tick.data[100] += dx;
		input.tick.data[101] += dy;
		resizeCanvas2(input.tick,input.tick.data[100],input.tick.data[101]);
	}
		
	input.cursorData[100] += dx;
	input.cursorData[101] += dy;
	resizeCanvas2(input.cursorCanvas,input.cursorData[100],input.cursorData[101]);

	if (typeof input.leftRightTextCanvas !== 'undefined') {
		input.leftRightTextCanvas.data[100] += dx;
		input.leftRightTextCanvas.data[101] += dy;
		resizeCanvas2(input.leftRightTextCanvas,input.leftRightTextCanvas.data[100],input.leftRightTextCanvas.data[101]);
	}
}
function enlargeMathsInput(input,sf) { // be careful!
	if (typeof sf !== 'number') return;
	//var l = input.data[100];
	//var t = input.data[101];
	
	//input.data[102] = input.data[102] * sf;
	//input.data[103] = input.data[103] * sf;
	
	resizeCanvas(input.canvas,input.data[100],input.data[101],input.data[102]*sf,input.data[103]*sf);
	
	/*input.cursorData[100] += (l -input.cursorData[100])*sf;
	input.cursorData[101] += (t -input.cursorData[101])*sf;
	input.cursorData[102] = input.cursorData[102] * sf;
	input.cursorData[103] = input.cursorData[103] * sf;
	resizeCanvas(input.cursorCanvas,input.cursorData[100],input.cursorData[101],input.cursorData[102],input.cursorData[103]);	
	
	if (typeof input.cross !== 'undefined') {
		input.cross.data[100] += (l -input.cross.data[100])*sf;
		input.cross.data[101] += (t -input.cross.data[101])*sf;
		input.cross.data[102] = input.cross.data[102] * sf;
		input.cross.data[103] = input.cross.data[103] * sf;
		resizeCanvas(input.cross,input.cross.data[100],input.cross.data[101],input.cross.data[102],input.cross.data[103]);	
	}

	if (typeof input.tick !== 'undefined') {	
		input.tick.data[100] += (l -input.tick.data[100])*sf;
		input.tick.data[101] += (t -input.tick.data[101])*sf;
		input.tick.data[102] = input.tick.data[102] * sf;
		input.tick.data[103] = input.tick.data[103] * sf;
		resizeCanvas(input.tick,input.tick.data[100],input.tick.data[101],input.tick.data[102],input.tick.data[103]);	
	}
	
	if (typeof input.leftRightTextCanvas !== 'undefined') {	
		input.leftRightTextCanvas.data[100] += (l -input.leftRightTextCanvas.data[100])*sf;
		input.leftRightTextCanvas.data[101] += (t -input.leftRightTextCanvas.data[101])*sf;
		input.leftRightTextCanvas.data[102] = input.leftRightTextCanvas.data[102] * sf;
		input.leftRightTextCanvas.data[103] = input.leftRightTextCanvas.data[103] * sf;
		resizeCanvas(input.leftRightTextCanvas,input.leftRightTextCanvas.data[100],input.leftRightTextCanvas.data[101],input.leftRightTextCanvas.data[102],input.leftRightTextCanvas.data[103]);	
	}*/	
}
function setMathsInputZIndex(input,zIndex) {
	if (typeof input.leftRightTextCanvas == 'object') input.leftRightTextCanvas.style.zIndex = zIndex;
	if (typeof input.tick == 'object') input.tick.style.zIndex = zIndex;
	if (typeof input.cross == 'object') input.cross.style.zIndex = zIndex;
	if (typeof input.canvas == 'object') input.canvas.style.zIndex = zIndex;
	if (typeof input.cursorCanvas == 'object') input.cursorCanvas.style.zIndex = zIndex;
}
function setMathsInputFont(input,font) {
	removeTagsOfType(input.richText,'font');
	input.richText.unshift('<<font:'+font+'>>');
	input.richText = combineSpacesTextArray(input.richText);
	removeTagsOfType(input.startRichText,'font');
	input.startRichText.unshift('<<font:'+font+'>>');
	input.startRichText = combineSpacesTextArray(input.startRichText);	
	input.startTags = removeTagsOfType(input.startTags,'font');
	input.startTags = '<<font:'+font+'>>'+input.startTags;
	currMathsInput = input;
	mathsInputMapCursorPos();
	mathsInputCursorCoords();
	deselectMathsInput();
}
function setMathsInputColor(input,color) {
	removeTagsOfType(input.richText,'color');
	input.richText.unshift('<<color:'+color+'>>');
	input.richText = combineSpacesTextArray(input.richText);
	removeTagsOfType(input.startRichText,'color');
	input.startRichText.unshift('<<color:'+color+'>>');
	input.startRichText = combineSpacesTextArray(input.startRichText);	
	input.startTags = removeTagsOfType(input.startTags,'color');
	input.startTags = '<<color:'+color+'>>'+input.startTags;
	var saveCurrMathsInput = currMathsInput;
	currMathsInput = input;
	drawMathsInputText(input);
	deselectMathsInput();
}
function setMathsInputText(mathsInputObj, opt_newText, opt_newCursorPos) { // eg. setMathsInputText(j37mathsInput[3]);
	var newText;
	if (un(opt_newText)) {
		newText = [""];
	} else if (typeof opt_newText == 'string') {
		newText = [opt_newText];
	} else if (typeof opt_newText == 'number') {
		newText = String(opt_newText);
		newText = [newText];
	} else {
		newText = clone(opt_newText);
	}
	mathsInputObj.text = newText;
	if (!un(mathsInputObj.startTags)) newText.unshift(mathsInputObj.startTags);
	mathsInputObj.richText = newText;
	currMathsInput = mathsInputObj;
	mathsInputMapCursorPos();
	if (typeof opt_newCursorPos !== 'undefined') {
		mathsInputObj.cursorPos = opt_newCursorPos;
	} else {
		mathsInputObj.cursorPos = mathsInputObj.cursorMap.length - 1;
	}
	mathsInputCursorCoords();
	deselectMathsInput();
}
function setMathsInputTextToInitialTags(m) {
	var newText = "";
	if (!un(m.richText) && typeof m.richText[0] == 'string' && m.richText[0].indexOf('<<') == 0) {
		for (c = 2; c < m.richText[0].length; c++) {
			if (m.richText[0].slice(c).indexOf('>>') == 0 && m.richText[0].slice(c).indexOf('>><<') !== 0) {
				newText = m.richText[0].slice(0,c+2);
				break;
			}
		}
	}
	setMathsInputText(m,[newText],0);
}

function drawTick(ctx,width,height,color,left,top,lineWidth) {
	if (!left) left = 0;
	if (!top) top = 0;
	if (!width) width = 75;
	if (!height) height = 75;
	if (!color) color = '#F0F';
	if(!lineWidth) lineWidth = 8;
	ctx.save();
	ctx.lineWidth = lineWidth;
	ctx.strokeStyle = color;
	ctx.lineJoin = 'round';
	ctx.lineCap = 'round';
	ctx.beginPath();
	ctx.moveTo(left+4,top+0.5*height);
	ctx.lineTo(left+width/3,top+height-4);
	ctx.lineTo(left+width-4,top+4);
	ctx.stroke();
	ctx.restore();
}
function drawCross(ctx,width,height,color,left,top,lineWidth) {
	if (!left) left = 0;
	if (!top) top = 0;	
	if (!width) width = 75;
	if (!height) height = 75;
	if (!color) color = '#F00';
	if(!lineWidth) lineWidth = 8;	
	ctx.save();
	ctx.lineWidth = lineWidth;
	ctx.strokeStyle = color;
	ctx.lineJoin = 'round';
	ctx.lineCap = 'round';
	ctx.beginPath();
	ctx.moveTo(left+4,top+4);
	ctx.lineTo(left+width-4,top+height-4);
	ctx.moveTo(left+width-4,top+4);
	ctx.lineTo(left+4,top+height-4);
	ctx.stroke();
	ctx.restore();
}

function createMathsInput2(object) {
	// non-optional:
	var left = object.left;
	var top = object.top;
	var width = object.width;
	var height = object.height;

	// optional & defaults:
	var varSize = object.varSize; // varSize:{minWidth:50,maxWidth:400,minHeight:50,maxHeight:300,padding:5}
	var visible;
	if (typeof object.visible == 'boolean') {visible = object.visible} else {visible = true};
	var zIndex = object.zIndex || 2;
	var algText;
	if (typeof object.algText == 'boolean') {algText = object.algText} else {algText = false};
	var textArray = object.textArray || [""];
	var leftPoint = object.leftPoint || 10;
	var textColor = object.textColor || '#000';
	var textAlign = object.textAlign || 'center';
	var vertAlign = object.vertAlign || 'middle';
	var transparent;
	if (typeof object.transparent == 'boolean') {transparent = object.transparent} else {transparent = false};
	var maxChars = object.maxChars || 1000000000;
	var backColor = object.backColor || '#FFF';
	var selectColor = object.selectColor || '#FCF';
	var border;
	if (typeof object.border == 'boolean') {border = object.border} else {border = true};
	var borderWidth = object.borderWidth || 3;
	var borderDash = object.borderDash || [];
	var borderColor = object.borderColor || '#000';	
	var maxLines = object.maxLines || 1;
	var fontSize = object.fontSize || 0.5 * (height/maxLines);	
	var selectable = boolean(object.selectable,false);
	var pointerCanvas = object.pointerCanvas || false;
	
	var inputObject = createMathsInput(0, left, top, width, height, visible, zIndex, algText, textArray, leftPoint, fontSize, textColor, textAlign, transparent, maxChars, backColor, selectColor, border, borderColor, maxLines, vertAlign, varSize, borderWidth, borderDash, selectable, pointerCanvas);
	return inputObject;
}

// creates mathsInput canvas
function createMathsInput(id, left, top, width, height, visible, zIndex, algText, textArray, leftPoint, fontSize, textColor, textAlign, transparent, maxChars, backColor, selectColor, border, borderColor, maxLines, vertAlign, varSize, borderWidth, borderDash,selectable, pointerCanvas) {
	if (!maxLines) {maxLines = 1};
	if (!zIndex) {zIndex = 2};
	if (!algText) {algText = false};
	if (!fontSize) (fontSize = (height/maxLines) * 0.75);	
	if (!textColor) (textColor = '#000');
	if (!textAlign) {textAlign = 'center'};
	if (textAlign == 'center') {leftPoint = 0.5 * width};
	if (!vertAlign) {vertAlign = 'middle'};
	if (!textArray) {textArray = [""]};
	var font = 'Arial';
	if (algText == true) font = 'algebra';
	var startText = textArray.slice(0);
	var startTags = "<<font:"+font+">><<fontSize:"+fontSize+">><<color:"+textColor+">><<backColor:none>><<bold:false>><<italic:false>><<align:"+textAlign+">>";
	textArray.unshift(startTags);
	var startRichText = textArray.slice(0);
	if (!leftPoint) {leftPoint = 10};
	if (typeof transparent !== 'boolean') {transparent = false};
	if (!maxChars) {maxChars = 100000000}
	if (!backColor) backColor = "#fff";
	var currBackColor = backColor;
	if (!selectColor) selectColor = '#FCF';
	if (typeof border !== 'boolean') border = true;
	if (!borderWidth) borderWidth = 5;
	if (!borderDash) borderDash = [];
	if (!borderColor) borderColor = '#000';
	if (!startText) startText = [''];
	if (typeof selectable !== 'boolean') selectable = false;	
	if (!pointerCanvas) pointerCanvas = false;
	
	function makeInputCanvas(l,t,w,h,v,d,p,z) {
		var canvas = document.createElement('canvas');
		canvas.setAttribute('class', 'inputClass');
		canvas.setAttribute('width', w);
		canvas.setAttribute('height', h);
		canvas.setAttribute('left', l);
		canvas.setAttribute('top', t);
		canvas.setAttribute('position', 'absolute');
		canvas.style.border = 'none';
		canvas.style.zIndex = z;
		if (p == false) {
			canvas.style.pointerEvents = 'none';
		} else {
			canvas.style.pointerEvents = 'auto';
		}
		canvas.data = [l,t,w,h,v,d,p,z];
		canvas.ctx = canvas.getContext('2d');
		for (var i = 0; i < 8; i++) {canvas.data[i+100] = canvas.data[i]};
		resizeCanvas3(canvas);
		return canvas;
	}
	
	var textCanvas = makeInputCanvas(left, top, width, height, visible, false, false, zIndex);
	var cursorCanvas = makeInputCanvas(left, top, width, height, visible, false, true, zIndex);
	cursorCanvas.addEventListener('mousedown', startMathsInput, false);
	cursorCanvas.addEventListener('touchstart', startMathsInput, false);

	var input = {
		id:id,
		canvas:textCanvas,
		ctx:textCanvas.ctx,
		data:textCanvas.data,
		cursorCanvas:cursorCanvas,
		cursorctx:cursorCanvas.ctx,		
		cursorData:cursorCanvas.data,
		active:true,
		stringJS:"",
		text:startText,
		richText:startRichText,
		textLoc:[],
		cursorPos:0,
		cursorMap:[],
		algText:algText,
		leftPoint:leftPoint,
		fontSize:fontSize,
		textColor:textColor,
		textAlign:textAlign,
		transparent:transparent,
		maxChars:maxChars,
		backColor:backColor,
		selectColor:selectColor,
		border:border, // boolean
		borderWidth:borderWidth,
		borderDash:borderDash,
		borderColor:borderColor,
		currBackColor:currBackColor,
		startText:startText,
		startRichText:startRichText,
		startTags:startTags,
		maxLines:maxLines,
		preText:'',
		postText:'',
		vertAlign:vertAlign,
		varSize:varSize,
		selectable:selectable,
		selectPos:[],
		selected:false,
		setBackColor:function(color) {
			this.backColor = color;
			drawMathsInputText(this);
		},
		pointerCanvas:pointerCanvas
	};
	//input.creationTime = (new Date()).getTime();
	mathsInput[pageIndex].push(input);
	currMathsInput = input;
	drawMathsInputText(currMathsInput);
	mathsInputMapCursorPos();
	mathsInputCursorCoords();
	deselectMathsInput();
	if (isTask == false && visible == true) showMathsInput(input);
	return input;
}

function mathsInputFrac(e) {mathsInputElement("['frac', [''], ['']]");}
function mathsInputPow(e) {mathsInputElement("['power', false, ['']]");}
function mathsInputSubs(e) {mathsInputElement("['subs', [''], ['']]");}
function mathsInputRoot(e) {mathsInputElement("['root', [''], ['']]");}
function mathsInputSqrt(e) {mathsInputElement("['sqrt', ['']]");}
function mathsInputSin(e) {mathsInputElement("['sin', ['']]");}
function mathsInputCos(e) {mathsInputElement("['cos', ['']]");}
function mathsInputTan(e) {mathsInputElement("['tan', ['']]");}
function mathsInputInvSin(e) {mathsInputElement("['sin-1', ['']]");}
function mathsInputInvCos(e) {mathsInputElement("['cos-1', ['']]");}
function mathsInputInvTan(e) {mathsInputElement("['tan-1', ['']]");}
function mathsInputLn(e) {mathsInputElement("['ln', ['']]");}
function mathsInputLog(e) {mathsInputElement("['log', ['']]");}
function mathsInputLogBase(e) {mathsInputElement("['logBase', [''], ['']]");}
function mathsInputAbs(e) {mathsInputElement("['abs', ['']]");}
function mathsInputExp(e) {mathsInputElement("['exp', ['']]");}
function mathsInputSigma1(e) {mathsInputElement("['sigma1', ['']]");}
function mathsInputSigma2(e) {mathsInputElement("['sigma2', [''], [''], ['']]");}
function mathsInputInt1(e) {mathsInputElement("['int1', ['']]");}
function mathsInputInt2(e) {mathsInputElement("['int2', [''], [''], ['']]");}
function mathsInputVectorArrow(e) {mathsInputElement("['vectorArrow', ['']]");}
function mathsInputBar(e) {mathsInputElement("['bar', ['']]");}
function mathsInputHat(e) {mathsInputElement("['hat', ['']]");}
function mathsInputRecurring(e) {mathsInputElement("['recurring', ['']]");}
function mathsInputColVector2d(e) {mathsInputElement("['colVector2d', [''], ['']]");}
function mathsInputColVector3d(e) {mathsInputElement("['colVector3d', [''], [''], ['']]");}
function mathsInputMixedNum(e) {mathsInputElement("['mixedNum', [''], [''], ['']]");}
function mathsInputLim(e) {mathsInputElement("['lim', [''], ['']]");}

function mathsInputCut() {
	if (currMathsInput.selected == false) return; 
	mathsInputCopy();
	currMathsInput.cursorPos = Math.min(currMathsInput.selectPos[0],currMathsInput.selectPos[1]);
	currMathsInput.selPos = [];
	currMathsInput.selected = false;	
	deleteSelected();
	removeSelectTags();
	drawMathsInputText(currMathsInput);
	mathsInputMapCursorPos();
	mathsInputCursorCoords();	
}
function mathsInputCopy() {
	if (currMathsInput.selected == false) return; 	
	var sel = false;
	clipboard = arrayHandler(clone(currMathsInput.richText));	
	
	//console.log(clipboard);
	
	function arrayHandler(array) {
		for (var l = 0; l < array.length; l++) {
			if (typeof array[l] == 'string') {
				if (l > 0 || array.length == 1 || ['frac','power','pow','subs','subscript','sin','cos','tan','ln','log','logBase','sin-1','cos-1','tan-1','abs','exp','root','sqrt','sigma1','sigma2','int1','int2','recurring','bar','hat','vectorArrow','colVector2d','colVector3d','mixedNum','lim'].indexOf(array[l]) == -1) {
					array[l] = stringHandler(array[l]);
				}
			} else {
				array[l] = arrayHandler(array[l]);
				if (sel == false) {
					array.splice(l,1);
					l--;
				}
			}
		}
		return array;
	}
	function stringHandler(string) {
		var delPos = [];
		if (sel == true) delPos[0] = 0;
		var savedTags = '';
		for (var j = 0; j < string.length; j++) {
			var slice = string.slice(j);
			if (slice.indexOf('<<selected:true>>') == 0) {
				delPos[0] = j+17;
				sel = true;
			}
			if (slice.indexOf('<<selected:false>>') == 0) {
				delPos[1] = j;
				sel = false;
 			}
			/*if (sel == true && (slice.indexOf('<<font') == 0 || slice.indexOf('<<bold') == 0 || slice.indexOf('<<italic') == 0 || slice.indexOf('<<color') == 0 || slice.indexOf('<<back') == 0)) {
				savedTags += slice.slice(0,slice.indexOf('>>')+2);
			}*/
		}
		if (delPos.length > 0) {
			if (delPos.length == 1) {
				return string.slice(delPos[0])+savedTags;
			} else {
				return string.slice(delPos[0],delPos[1]);
			}
		} else {
			return string;
		}
	}	
}
function mathsInputPaste() {
	if (typeof clipboard !== 'object' || clipboard == [] || arraysEqual(clipboard,[''])) return;
	var elementString = JSON.stringify(clipboard);
	
	if (currMathsInput.selected == true) {
		currMathsInput.cursorPos = Math.min(currMathsInput.selectPos[0],currMathsInput.selectPos[1]);
		currMathsInput.selPos = [];
		currMathsInput.selected = false;
		deleteSelected();
		removeSelectTags();
		drawMathsInputText(currMathsInput);
		mathsInputMapCursorPos();
		mathsInputCursorCoords();
	}	
	
	var cursorPos = currMathsInput.cursorMap[currMathsInput.cursorPos];
	var parent = currMathsInput.richText;
	for (var aa = 0; aa < cursorPos.length - 1; aa++) {parent = parent[cursorPos[aa]]};
	var pos = cursorPos[cursorPos.length - 1];
	pos = adjustForBreakPoints(pos);
	var parentPos = cursorPos[cursorPos.length - 2];
	var evalString = 'currMathsInput.richText' 
	for (var aa = 0; aa < cursorPos.length - 2; aa++) {
		evalString += '[' + cursorPos[aa] + ']';
	}
	var before = parent.slice(0,pos);
	var after = parent.slice(pos);
	
	//console.log('before:',before);
	//console.log('after:',after);
	
	var newParent = clone(clipboard);
	newParent.unshift(before);
	newParent.push(after);
	
	//console.log('newParent:',newParent);	
	
	eval(evalString+" = newParent;");

	//console.log('currMathsInput.richText:',currMathsInput.richText);
	
	var cursorPosCount = 0;
	arrayHandler(clipboard);
	
	function arrayHandler(array) {
		for (var l = 0; l < array.length; l++) {
			if (typeof array[l] == 'string') {
				if (array.length == 1 || ['frac','power','pow','subs','subscript','sin','cos','tan','ln','log','logBase','sin-1','cos-1','tan-1','abs','exp','root','sqrt','sigma1','sigma2','int1','int2','recurring','bar','hat','vectorArrow','colVector2d','colVector3d','mixedNum','lim'].indexOf(array[l]) == -1) {
					cursorPosCount += array[l].length;
				}
			} else {
				arrayHandler(array[l]);
			}
		}
	}
	
	mathsInputMapCursorPos();
	currMathsInput.cursorPos += cursorPosCount;
	mathsInputCursorCoords();
	currMathsInput.preText = '';
	currMathsInput.postText = '';		
}

function mathsInputElement(elementString) {
	if (currMathsInput.selected == true) {
		currMathsInput.cursorPos = Math.min(currMathsInput.selectPos[0],currMathsInput.selectPos[1]);
		currMathsInput.selPos = [];
		currMathsInput.selected = false;
		deleteSelected();
		removeSelectTags();
		drawMathsInputText(currMathsInput);
		mathsInputMapCursorPos();
		mathsInputCursorCoords();
	}	

	var cursorPos = currMathsInput.cursorMap[currMathsInput.cursorPos];
	var gparent = currMathsInput.richText;
	for (var aa = 0; aa < cursorPos.length - 2; aa++) {
		gparent = gparent[cursorPos[aa]]
	};
	var parent = gparent[cursorPos[cursorPos.length-2]];	
	var parentPos = cursorPos[cursorPos.length-2];
	var pos = cursorPos[cursorPos.length-1];
	pos = adjustForBreakPoints(pos);
	var before = parent.slice(0,pos);
	var after = parent.slice(pos);
	if (!un(currMathsInput.preText) && currMathsInput.preText !== null && currMathsInput.preText !== '') {
		before += currMathsInput.preText;
	}
	if (!un(currMathsInput.postText) && currMathsInput.postText !== null && currMathsInput.postText !== '') {
		after = currMathsInput.postText + after;
	}
	gparent.splice(parentPos,1,before,eval(elementString),after);
	
	mathsInputMapCursorPos();
	currMathsInput.cursorPos++;
	mathsInputCursorCoords();
	currMathsInput.preText = '';
	currMathsInput.postText = '';	
}

function mathsInputNewLine() {
	// get cursorPos
	var cursorPos = currMathsInput.cursorMap[currMathsInput.cursorPos];
	
	if (typeof currMathsInput.richText[cursorPos[0]] == 'string') {
		var slicePos = cursorPos[1];
		slicePos = adjustForBreakPoints(slicePos);
		// check if there is an align tag
		if (currMathsInput.richText[cursorPos[0]].slice(slicePos).indexOf('<<align:') == 0) {
			slicePos += currMathsInput.richText[cursorPos[0]].slice(slicePos).indexOf('>>')+2;
		}
		slicePos = mathsInputAvoidTagSplit(currMathsInput.richText[cursorPos[0]],slicePos);
		
		currMathsInput.richText[cursorPos[0]] = currMathsInput.richText[cursorPos[0]].slice(0,slicePos) + '<<br>>' + currMathsInput.richText[cursorPos[0]].slice(slicePos);	
		mathsInputMapCursorPos();
		currMathsInput.cursorPos += 1;
		mathsInputCursorCoords();
	} else {
		// jump forward from element to next string (if it exists) and insert <<br>>
		var cursorPosShiftCount = 0;
		for (var i = currMathsInput.cursorPos; i < currMathsInput.cursorMap.length; i++) {
			cursorPosShiftCount++;
			// if the next element has been reached
			if (cursorPos[0] < currMathsInput.cursorMap[i][0]) {
				if (typeof currMathsInput.richText[currMathsInput.cursorMap[i][0]] == 'string') {
					cursorPos = currMathsInput.cursorMap[i];
					currMathsInput.richText[currMathsInput.cursorMap[i][0]] = '<<br>>'+currMathsInput.richText[currMathsInput.cursorMap[i][0]];
					break;
				} else {
					// this shouldn't happen?? All elements will be separated by a text string
				}
			} else if (i == currMathsInput.cursorMap.length - 1) {
				currMathsInput.richText.push('<<br>>');
				cursorPosShiftCount += 6;
				
			}
		}
		
		mathsInputMapCursorPos();
		currMathsInput.cursorPos += cursorPosShiftCount;
		mathsInputCursorCoords();		
	}
}
function mathsInputTab(howMany) {
	if (un(howMany)) howMany = 1;
	var ins = "";
	for (var i = 0; i < howMany; i++) {
		ins += String.fromCharCode(0x21F4);
	}
	// get cursorPos
	var cursorPos = currMathsInput.cursorMap[currMathsInput.cursorPos];

	if (typeof currMathsInput.richText[cursorPos[0]] == 'string') {
		var slicePos = cursorPos[1];
		slicePos = adjustForBreakPoints(slicePos);
		// check if there is an align tag
		if (currMathsInput.richText[cursorPos[0]].slice(slicePos).indexOf('<<align:') == 0) {
			slicePos += currMathsInput.richText[cursorPos[0]].slice(slicePos).indexOf('>>')+2;
		}
		currMathsInput.richText[cursorPos[0]] = currMathsInput.richText[cursorPos[0]].slice(0,slicePos) + ins + currMathsInput.richText[cursorPos[0]].slice(slicePos);	
		mathsInputMapCursorPos();
		currMathsInput.cursorPos += howMany;
		mathsInputCursorCoords();
	} else {
		// jump forward from element to next string (if it exists) and insert <<br>>
		var cursorPosShiftCount = 0;
		for (var i = currMathsInput.cursorPos; i < currMathsInput.cursorMap.length; i++) {
			cursorPosShiftCount++;
			// if the next element has been reached
			if (cursorPos[0] < currMathsInput.cursorMap[i][0]) {
				if (typeof currMathsInput.richText[currMathsInput.cursorMap[i][0]] == 'string') {
					cursorPos = currMathsInput.cursorMap[i];
					currMathsInput.richText[currMathsInput.cursorMap[i][0]] = ins+currMathsInput.richText[currMathsInput.cursorMap[i][0]];
					break;
				} else {
					// this shouldn't happen?? All elements will be separated by a text string
				}
			} else if (i == currMathsInput.cursorMap.length - 1) {
				currMathsInput.richTexts.push(String.fromCharCode(0x21F4));
				cursorPosShiftCount += howMany;
				
			}
		}
		
		mathsInputMapCursorPos();
		currMathsInput.cursorPos += cursorPosShiftCount;
		mathsInputCursorCoords();		
	}
}
function mathsInputLeftArrow(e) {
	if (currMathsInput.cursorPos > 0) {
		currMathsInput.cursorPos--;
		mathsInputCursorCoords();
	} else {
		mathsInputTabPrev();
	}
}
function mathsInputRightArrow(e) {
	if (currMathsInput.cursorPos < currMathsInput.cursorMap.length - 1) {
		currMathsInput.cursorPos++;
		mathsInputCursorCoords();
	} else {
		mathsInputTabNext();
	}
}
function mathsInputTabPrev() {
	var dx,dy,x,y,currBest1,currBest2;
	for (var i = 0; i < mathsInput[pageIndex].length; i++) {
		if (i == currMathsInputId || mathsInput[pageIndex][i].canvas.parentNode !== container || mathsInput[pageIndex][i].active == false) continue;
		if (mathsInput[pageIndex][i].data[100] < mathsInput[pageIndex][currMathsInputId].data[100] && mathsInput[pageIndex][i].data[101] == mathsInput[pageIndex][currMathsInputId].data[101]) { // if directly to the left
			if (typeof dy == 'undefined') {
				dy = 0;
				dx = mathsInput[pageIndex][currMathsInputId].data[100] - mathsInput[pageIndex][i].data[100];
				currBest1 = i;
			} else if (dy > 0 || (dy == 0 && mathsInput[pageIndex][currMathsInputId].data[100] - mathsInput[pageIndex][i].data[100] < dx)) {
				dy = 0;
				dx = mathsInput[pageIndex][currMathsInputId].data[100] - mathsInput[pageIndex][i].data[100];
				currBest1 = i;
			}
		} else if (mathsInput[pageIndex][i].data[101] < mathsInput[pageIndex][currMathsInputId].data[101]) { // if above
			if (typeof dy == 'undefined') {
				dy = mathsInput[pageIndex][currMathsInputId].data[101] - mathsInput[pageIndex][i].data[101];
				dx = mathsInput[pageIndex][currMathsInputId].data[100] - mathsInput[pageIndex][i].data[100];
				currBest1 = i;
			} else if (dy > mathsInput[pageIndex][currMathsInputId].data[101] - mathsInput[pageIndex][i].data[101] || (dy == mathsInput[pageIndex][currMathsInputId].data[101] - mathsInput[pageIndex][i].data[101] && mathsInput[pageIndex][currMathsInputId].data[100] - mathsInput[pageIndex][i].data[100] < dx)) {
				dy = mathsInput[pageIndex][currMathsInputId].data[101] - mathsInput[pageIndex][i].data[101];
				dx = mathsInput[pageIndex][currMathsInputId].data[100] - mathsInput[pageIndex][i].data[100];
				currBest1 = i;
			}			
			
		} else if ((mathsInput[pageIndex][i].data[100] > mathsInput[pageIndex][currMathsInputId].data[100] && mathsInput[pageIndex][i].data[101] == mathsInput[pageIndex][currMathsInputId].data[101]) || mathsInput[pageIndex][i].data[101] > mathsInput[pageIndex][currMathsInputId].data[101]) { // if directly to the right or below
			if (typeof y == 'undefined') {
				y = mathsInput[pageIndex][i].data[101];
				x = mathsInput[pageIndex][i].data[100];
				currBest2 = i;
			} else if (mathsInput[pageIndex][i].data[101] > y || (mathsInput[pageIndex][i].data[101] == y && mathsInput[pageIndex][i].data[100] > x)) {
				y = mathsInput[pageIndex][i].data[101];
				x = mathsInput[pageIndex][i].data[100];
				currBest2 = i;
			}
		}
	}
	if (typeof currBest1 !== 'undefined') {
		currMathsInput.preText = '';
		currMathsInput.postText = '';		
		deselectMathsInput(mathsInput[pageIndex][currBest1],true);		
		startMathsInput(mathsInput[pageIndex][currBest1]);
		currMathsInput.cursorPos = currMathsInput.cursorMap.length - 1;
		mathsInputCursorCoords();			
	} else if (typeof currBest2 !== 'undefined') {
		currMathsInput.preText = '';
		currMathsInput.postText = '';
		deselectMathsInput(mathsInput[pageIndex][currBest2],true);		
		startMathsInput(mathsInput[pageIndex][currBest2]);
		currMathsInput.cursorPos = 0;
		mathsInputCursorCoords();			
	}	
}
function mathsInputTabNext() {
	var index = mathsInput[pageIndex].indexOf(currMathsInput);
	if (index > -1) {
		var newIndex = (index+1) % mathsInput[pageIndex].length;
		currMathsInput.preText = '';
		currMathsInput.postText = '';		
		deselectMathsInput(mathsInput[pageIndex][newIndex],true);		
		startMathsInput(mathsInput[pageIndex][newIndex]);
		currMathsInput.cursorPos = currMathsInput.cursorMap.length - 1;
		mathsInputCursorCoords();			
	}
	return;
	
	/*var dx,dy,x,y,currBest1,currBest2;
	for (var i = 0; i < mathsInput[pageIndex].length; i++) {
		if (i == currMathsInputId || mathsInput[pageIndex][i].canvas.parentNode !== container || mathsInput[pageIndex][i].active == false) continue;
		if (mathsInput[pageIndex][i].data[100] > mathsInput[pageIndex][currMathsInputId].data[100] && mathsInput[pageIndex][i].data[101] == mathsInput[pageIndex][currMathsInputId].data[101]) { // if directly to the right
			if (typeof dy == 'undefined') {
				dy = 0;
				dx = mathsInput[pageIndex][i].data[100] - mathsInput[pageIndex][currMathsInputId].data[100];
				currBest1 = i;
			} else if (dy > 0 || (dy == 0 && mathsInput[pageIndex][i].data[100] - mathsInput[pageIndex][currMathsInputId].data[100] < dx)) {
				dy = 0;
				dx = mathsInput[pageIndex][i].data[100] - mathsInput[pageIndex][currMathsInputId].data[100];
				currBest1 = i;
			}
		} else if (mathsInput[pageIndex][i].data[101] > mathsInput[pageIndex][currMathsInputId].data[101]) { // if below
			if (typeof dy == 'undefined') {
				dy = mathsInput[pageIndex][i].data[101] - mathsInput[pageIndex][currMathsInputId].data[101];
				dx = mathsInput[pageIndex][i].data[100] - mathsInput[pageIndex][currMathsInputId].data[100];
				currBest1 = i;
			} else if (dy > mathsInput[pageIndex][i].data[101] - mathsInput[pageIndex][currMathsInputId].data[101] || (dy == mathsInput[pageIndex][i].data[101] - mathsInput[pageIndex][currMathsInputId].data[101] && mathsInput[pageIndex][i].data[100] - mathsInput[pageIndex][currMathsInputId].data[100] < dx)) {
				dy = mathsInput[pageIndex][i].data[101] - mathsInput[pageIndex][currMathsInputId].data[101];				
				dx = mathsInput[pageIndex][i].data[100] - mathsInput[pageIndex][currMathsInputId].data[100];
				currBest1 = i;
			}			
			
		} else if ((mathsInput[pageIndex][i].data[100] < mathsInput[pageIndex][currMathsInputId].data[100] && mathsInput[pageIndex][i].data[101] == mathsInput[pageIndex][currMathsInputId].data[101]) || mathsInput[pageIndex][i].data[101] < mathsInput[pageIndex][currMathsInputId].data[101]) { // if directly to the left or above
			if (typeof y == 'undefined') {
				y = mathsInput[pageIndex][i].data[101];
				x = mathsInput[pageIndex][i].data[100];
				currBest2 = i;
			} else if (mathsInput[pageIndex][i].data[101] < y || (mathsInput[pageIndex][i].data[101] == y && mathsInput[pageIndex][i].data[100] < x)) {
				y = mathsInput[pageIndex][i].data[101];
				x = mathsInput[pageIndex][i].data[100];
				currBest2 = i;
			}
		}
	}
	if (typeof currBest1 !== 'undefined') {
		currMathsInput.preText = '';
		currMathsInput.postText = '';		
		deselectMathsInput(mathsInput[pageIndex][currBest1],true);		
		startMathsInput(mathsInput[pageIndex][currBest1]);
		currMathsInput.cursorPos = currMathsInput.cursorMap.length - 1;
		mathsInputCursorCoords();			
	} else if (typeof currBest2 !== 'undefined') {
		currMathsInput.preText = '';
		currMathsInput.postText = '';
		deselectMathsInput(mathsInput[pageIndex][currBest2],true);		
		startMathsInput(mathsInput[pageIndex][currBest2]);
		currMathsInput.cursorPos = 0;
		mathsInputCursorCoords();			
	}*/
}

function mathsInputAvoidTagSplit(txt,slicePos) {
	// check that a tag is not being split - if so adjust slicePos
	var leftText = txt.slice(0,slicePos);
	var rightText = txt.slice(slicePos);
	//console.clear();
	//console.log(txt,slicePos);
	//console.log(leftText);
	//console.log(rightText);
	var tagLeft = false;
	var tagLeftCount = 0;
	for (var i = 0; i < leftText.length; i++) {
		tagLeftCount++;
		//console.log('left '+i+':',leftText.slice(leftText.length - i)); 
		if (leftText.slice(leftText.length - i).indexOf('>>') == 0) break;
		if (leftText.slice(leftText.length - i).indexOf('<<') == 0) {
			tagLeft = true;
			break;
		}
	}
	var tagRight = false;
	var tagRightCount = 0;
	for (var j = 0; j < rightText.length; j++) {
		tagRightCount++;
		//console.log('right '+j+':',rightText.slice(j));
		if (rightText.slice(j).indexOf('<<') == 0) break;
		if (rightText.slice(j).indexOf('>>') == 0) {
			tagRight = true;
			break;
		}
	}
	//console.log(tagLeft,tagRight,tagLeftCount,tagRightCount);
	if (tagLeft == true && tagRight == true) {
		if (tagLeftCount <= tagRightCount) {
			slicePos -= tagLeftCount;	
		} else {
			slicePos += tagRightCount;
		}
	}
	// test if '<',slicePos,'<' or '>',slicePos,'>'
	if (leftText.slice(-1) == '<' && rightText.slice(0,1) == '<' && rightText.slice(0,2) !== '<<') slicePos--;
	if (leftText.slice(-1) == '>' && leftText.slice(-2) !== '>>' && rightText.slice(0,1) == '>') slicePos++;
	
	return slicePos;
}

function startMathsInput(e,startCursorPos) {
	deselectMathsInput(e,true);
	window.addEventListener('keydown', hardKeyMathsInput, false);
	canvas.addEventListener('mousedown', endMathsInput, false); // clicking anywhere on the canvas will end the input
	canvas.addEventListener('touchstart', endMathsInput, false); // touching anywhere on the canvas will end the input
	/*// clicking a holder button will end the input
	if (typeof holderButton !== 'undefined') {
		for (i = 0; i < 3; i++) {
			holderButton[i].addEventListener('mousedown', endMathsInput, false);
			holderButton[i].addEventListener('touchstart', endMathsInput, false);	
		}
	}
	for (i = 0; i < taskObject[pageIndex].length; i++) { // clicking any other object will also end the input
		if (endInputExceptions.indexOf(taskObject[pageIndex][i]) == -1) {
			taskObject[pageIndex][i].addEventListener('mousedown', endMathsInput, false);
			taskObject[pageIndex][i].addEventListener('touchstart', endMathsInput, false);	
		}
	}*/
	if (e.target) {
		var inputCanvas = e.target;
	} else {
		var inputCanvas = e;
	};
	for (i = 0; i < mathsInput[pageIndex].length; i++) {
		if (mathsInput[pageIndex][i].cursorCanvas == inputCanvas || mathsInput[pageIndex][i].canvas == inputCanvas || mathsInput[pageIndex][i] == inputCanvas) {
			currMathsInput = mathsInput[pageIndex][i];
			currMathsInputId = i;
		}
	}
	if (currMathsInput.transparent == false && currMathsInput.selectColor !== 'none') {
		currMathsInput.canvas.style.backgroundColor = "#FCF";
	} else if (currMathsInput.transparent == false || currMathsInput.selectColor == 'none') {
		currMathsInput.canvas.style.backgroundColor = "#transparent";
	}
	inputState = true; // allows the onscreen keys to function
	var closestPos = getClosestTextPos();
	//console.log(currMathsInput,closestPos,currMathsInput.selectable,startCursorPos);
	if (currMathsInput.selectable == true && typeof startCursorPos == 'undefined') {
		currMathsInput.selectPos = [closestPos,closestPos];
		setSelectPositions();
		drawMathsInputText(currMathsInput);
		mathsInputMapCursorPos();
		if (typeof currMathsInput.pointerCanvas !== 'object') {
			addListenerMove(currMathsInput.cursorCanvas,selectTextMove);
			addListenerEnd(currMathsInput.cursorCanvas,selectTextStop);
		}
	} else {
		mathsInputMapCursorPos();
		currMathsInput.cursorPos = startCursorPos || Number(closestPos) || 0;
		//console.log(currMathsInput,currMathsInput.cursorPos,currMathsInput.cursorMap[currMathsInput.cursorPos],currMathsInput.textLoc);
		mathsInputCursorCoords();
		updateKeyboardCurrFont();
		showKeyboard2(true);
	}
	if (!un(currMathsInput.markPos)) {
		currMathsInput.markctx.clearRect(currMathsInput.markPos[0]-5,currMathsInput.markPos[1]-5,currMathsInput.markPos[2]+10,currMathsInput.markPos[3]+10);
	}
	//shiftOn = false;
	//ctrlOn = false;
	//altOn = false;
	if (!un(window.textMenu) && typeof textMenu.show == 'function' && textMenu.showOnStartInput == true) {
		textMenu.update();
		textMenu.show();
	}
}
function selectTextMove(e) {
	updateMouse(e);
	var closestPos = getClosestTextPos();
	//console.log(closestPos);
	if (currMathsInput.selectPos[1] !== closestPos) {
		currMathsInput.selectPos[1] = closestPos;
		//console.log(currMathsInput.selectPos);
		currMathsInput.selected = true;
		setSelectPositions();
		drawMathsInputText(currMathsInput);
		mathsInputMapCursorPos();		
	}
	console.log(currMathsInput.selectPos);
	//console.log('selectTextMove',currMathsInput.selected);	
}
function selectTextStop(e) {
	//console.log(currMathsInput.selectPos);
	removeListenerMove(currMathsInput.cursorCanvas,selectTextMove);
	removeListenerEnd(currMathsInput.cursorCanvas,selectTextStop);
	if (currMathsInput.selectPos[0] == currMathsInput.selectPos[1]) {
		currMathsInput.cursorPos = currMathsInput.selectPos[0];
		currMathsInput.selectPos = [];
		currMathsInput.selected = false;
		setSelectPositions();
		mathsInputMapCursorPos();
		mathsInputCursorCoords();
	}
	updateKeyboardCurrFont();
	showKeyboard2(true);
}
function getClosestTextPos(mathsInput) {
	if (!mathsInput) mathsInput = currMathsInput;
	// search through text character locations for a mouse hit test
	var mousePos = [mouse.x-mathsInput.data[100],mouse.y-mathsInput.data[101]];
	//console.log(mathsInput);
	if (typeof mathsInput.cursorMap == 'undefined') {
		mathsInputMapCursorPos();
	}
	var map = mathsInput.cursorMap;
	var closestPos = 0;
	var closestDist;
	var vertDist;
	var closestVertDist;
	//console.log('getClosestTextPos()');
	//console.clear();
	for (var pos = 0; pos < map.length; pos++) {
		var loc = mathsInput.textLoc;
		for (var aa = 0; aa < map[pos].length; aa++) {
			loc = loc[map[pos][aa]];
		};
		
		/*	
		var ctx = mathsInput.ctx;
		ctx.strokeStyle = '#F0F';
		ctx.beginPath();
		ctx.moveTo(loc.left,loc.top);
		ctx.lineTo(loc.left,loc.top+loc.height);
		ctx.stroke();		
		*/
		
		if (!loc) continue;
		
		if (pos == 0) {
			closestDist = distancePointToLineSegment(mousePos,[loc.left,loc.top],[loc.left,loc.top+loc.height]);
			closestPos = pos;
			vertDist = Math.min(Math.abs(mousePos[1]-loc.top),Math.abs(mousePos[1]-(loc.top+loc.height)));
			if (mousePos[1] >= loc.top && mousePos[1] <= loc.top + loc.height) vertDist = 0;
			closestVertDist = vertDist;
		} else {
			var newDist = distancePointToLineSegment(mousePos,[loc.left,loc.top],[loc.left,loc.top+loc.height]);
			var newVertDist = Math.min(Math.abs(mousePos[1]-loc.top),Math.abs(mousePos[1]-(loc.top+loc.height)));
			if (mousePos[1] >= loc.top && mousePos[1] <= loc.top + loc.height) newVertDist = 0;
			if (newVertDist < closestVertDist || (newVertDist == closestVertDist && newDist < closestDist)) {
				closestVertDist = newVertDist;
				closestDist = newDist;
				closestPos = pos;
			}
		}
		
		//console.log(pos,loc.left,newDist,closestDist,closestPos)		
	}
	
	/*
	ctx.beginPath();
	ctx.moveTo(mousePos[0]-3,mousePos[1]-3);
	ctx.lineTo(mousePos[0]+3,mousePos[1]+3);
	ctx.moveTo(mousePos[0]-3,mousePos[1]+3);
	ctx.lineTo(mousePos[0]+3,mousePos[1]-3);		
	ctx.stroke();	
	*/
	//console.log(closestPos);
	if (isNaN(closestPos) || typeof closestPos == 'undefined' || closestPos == null) {
		closestPos = 0;
	}
	return closestPos;
}
function endMathsInput(e) {
	if (!un(e) && !un(keyboardButton1) && !un(keyboardButton1[pageIndex]) && e.target == keyboardButton1[pageIndex]) return;
	if (!un(e) && !un(keyboardButton2) && !un(keyboardButton2[pageIndex]) && e.target == keyboardButton2[pageIndex]) return;
	if (un(currMathsInput)) return;
	if (currMathsInput.selected == true) {
		removeSelectTags();
		mathsInputMapCursorPos();
		currMathsInput.cursorPos = Math.min(currMathsInput.selectPos[0],currMathsInput.selectPos[1]);
		currMathsInput.selectPos = [];
		mathsInputCursorCoords();
		currMathsInput.selected = false;
		removeSelectTags();		
	}
	deselectMathsInput(e);

	if (typeof currMathsInput.onInputEnd == 'function') {
		currMathsInput.onInputEnd(e);
	}
}
function deselectMathsInput(e,diffInput) {
	if (un(currMathsInput)) return;
	currMathsInput.preText = '';
	currMathsInput.postText = '';
	if (currMathsInput.selected == true) {
		removeSelectTags();
		mathsInputMapCursorPos();
		currMathsInput.cursorPos = Math.min(currMathsInput.selectPos[0],currMathsInput.selectPos[1]);
		currMathsInput.selectPos = [];
		mathsInputCursorCoords();
		currMathsInput.selected = false;
		removeSelectTags();
	}	
	// test if the deselection is caused by a new input
	var diffInputTest = -1;
	if (typeof e == 'object' && e && typeof e.target == 'object' && e.target !== currMathsInput.canvas && !un(mathsInput[pageIndex])) {
		for (var i = 0; i < mathsInput[pageIndex].length; i++) {
			if (mathsInput[pageIndex][i].cursorCanvas == e.target) {
				if (currMathsInput.canvas == e.target) {
					return; // indicates the currently active mathsInput has been reclicked - do nothing
				} else {
					diffInputTest = i;
				}
				break;
			}
		}
	}
	
	if ((typeof diffInput !== 'undefined' && diffInput == true) || diffInputTest > -1) {
	
	} else {
		hideKeyboard2(true);
		inputState = false;
		// remove event listeners for mathsInput 
		window.removeEventListener('keydown', hardKeyMathsInput, false);
		canvas.removeEventListener('mousedown', endMathsInput, false);
		canvas.removeEventListener('touchstart', endMathsInput, false);		
	}
		
	//currMathsInput.currBackColor = currMathsInput.backColor;
	/*
	currMathsInput.ctx.clearRect(0, 0, currMathsInput.data[2], currMathsInput.data[3]);
	if (currMathsInput.transparent == false && currMathsInput.backColor !== 'none') {
		currMathsInput.ctx.fillStyle = currMathsInput.backColor || '#FFF';
	}
	*/
	
	currMathsInput.canvas.style.backgroundColor = currMathsInput.backColor || 'transparent';
	if (currMathsInput.backColor == 'none') {
		currMathsInput.canvas.style.backgroundColor = 'transparent'
	}
	
	clearCorrectingInterval(mathsInputCursorBlinkInterval);
	inputCursorState = false
	blinking = false;
	
	currMathsInput.cursorctx.clearRect(0,0,1200,700);
	
	if ((typeof diffInput !== 'undefined' && diffInput == true) || diffInputTest > -1) {
		if (typeof currMathsInput.onInputEnd == 'function') {
			currMathsInput.onInputEnd();
		}
	}	 else {
		if (!un(window.textMenu)) {
			if (typeof textMenu.show == 'function' && textMenu.showOnStartInput == true) {
				textMenu.hide();
			}
		}
	}	
	if (typeof holderButton !== 'undefined') {
		for (var i = 0; i < 3; i++) {
			holderButton[i].removeEventListener('mousedown', endMathsInput, false);
			holderButton[i].removeEventListener('mousedown', endMathsInput, false);	
		}
	}
	/*var startAt = 0;
	if (taskKey[pageIndex]) {startAt = taskKey[pageIndex].length}
	function listenerForI(i) {
		taskObject[pageIndex][i].removeEventListener('mousedown', endMathsInput, false);
		taskObject[pageIndex][i].removeEventListener('touchstart', endMathsInput, false);		
	}	
	if (taskObject[pageIndex]) {
		for (var i = startAt; i < taskObject[pageIndex].length; i++) { // clicking any other object will also end the input
			listenerForI(i); //'scopes' the variable i
		}
	}*/
	
}

function setSelectPositions() {
	// check for a need to adjust each selectPos
	
	var selPos1 = clone(currMathsInput.cursorMap[currMathsInput.selectPos[0]]);
	if (typeof selPos1 !== 'undefined') {
		var txt = clone(currMathsInput.richText);
		for (var i = 0; i < selPos1.length - 1; i++) {txt = txt[selPos1[i]]};
		var txtSlice = txt.slice(0,selPos1[selPos1.length-1]);
		if (txtSlice.indexOf('<<selected:true>>') > -1) {
			selPos1[selPos1.length-1] -= 17;
		}
		if (txtSlice.indexOf('<<selected:false>>') > -1) {
			selPos1[selPos1.length-1] -= 18;
		}
	}
	
	var selPos2 = clone(currMathsInput.cursorMap[currMathsInput.selectPos[1]]); 
	if (typeof selPos2 !== 'undefined') {
		var txt = clone(currMathsInput.richText);
		for (var i = 0; i < selPos2.length - 1; i++) {txt = txt[selPos2[i]]};
		var txtSlice = txt.slice(0,selPos2[selPos2.length-1]);
		if (txtSlice.indexOf('<<selected:true>>') > -1) {
			selPos2[selPos2.length-1] -= 17;
		}
		if (txtSlice.indexOf('<<selected:false>>') > -1) {
			selPos2[selPos2.length-1] -= 18;
		}
	}
	
	removeSelectTags();
	
	if (arraysEqual(currMathsInput.selectPos,[]) == false) {
		if (currMathsInput.selectPos[0] == currMathsInput.selectPos[1]) {
			insertTag('<<selected:true>><<selected:false>>',selPos1);
		} else if (currMathsInput.selectPos[0] > currMathsInput.selectPos[1]) {
			insertTag('<<selected:false>>',selPos1);
			insertTag('<<selected:true>>',selPos2);	
		} else if (currMathsInput.selectPos[0] < currMathsInput.selectPos[1]) {
			insertTag('<<selected:false>>',selPos2);
			insertTag('<<selected:true>>',selPos1);
		}
	}
		
	function insertTag(insertion,cursorPos) {
		// get the relevant string from currMathsInput.richText
		var text = currMathsInput.richText;
		for (var aa = 0; aa < cursorPos.length - 1; aa++) {
			text = text[cursorPos[aa]];
		}
		// pos is position of cursor
		var pos = cursorPos[cursorPos.length - 1];
				
		// adjust pos to account for breakPoints
		if (typeof currMathsInput.breakPoints == 'object') {
			for (var k = 0; k < currMathsInput.breakPoints.length - 1; k++) {
				var breakPoint = currMathsInput.allMap[currMathsInput.breakPoints[k]];
				if (breakPoint[0] == cursorPos[0] && breakPoint[1] < cursorPos[1]) {
					pos--;
				}
			}
		}
		// check that a tag is not being split - if so adjust pos
		var leftText = text.slice(0,pos);
		var rightText = text.slice(pos);
		var tagLeft = false;
		var tagLeftCount = 0;
		for (var i = 0; i < leftText.length; i++) {
			tagLeftCount++;
			if (leftText.slice(leftText.length - i).indexOf('>>') == 0) break;
			if (leftText.slice(leftText.length - i).indexOf('<<') == 0) {
				tagLeft = true;
				break;
			}
		}
		var tagRight = false;
		var tagRightCount = 0;
		for (var j = 0; j < rightText.length; j++) {
			tagRightCount++;
			if (rightText.slice(j).indexOf('<<') == 0) break;
			if (rightText.slice(j).indexOf('>>') == 0) {
				tagRight = true;
				break;
			}
		}
		if (tagLeft == true && tagRight == true) {
			if (tagLeftCount <= tagRightCount) {
				pos -= tagLeftCount;	
			} else {
				pos += tagRightCount;
			}
		}
		var leftText = text.slice(0,pos);
		var rightText = text.slice(pos);
		if (leftText.slice(-1) == '<' && rightText.slice(0,1) == '<' && rightText.slice(0,2) !== '<<') pos--;
		if (leftText.slice(-1) == '>' && leftText.slice(-2) !== '>>' && rightText.slice(0,1) == '>') pos++;	
		var textBefore = text.slice(0,pos);
		var textAfter = text.slice(pos);
				
		text = textBefore + insertion + textAfter;
		// replace the string
		var evalString = 'currMathsInput.richText' 
		for (aa = 0; aa < cursorPos.length - 1; aa++) {
			evalString += '[' + cursorPos[aa] + ']';
		}
		eval(evalString + ' = text;');
	}
}
function removeSelectTags() {
	var map1;
	var map2;
	var pos = [];
	function arrayHandler(array) {
		pos.push(0);
		for (var l = array.length - 1; l >= 0; l--) {
			pos[pos.length-1] = l;
			if (typeof array[l] == 'string') {
				array[l] = stringHandler(array[l]);
			} else {	
				array[l] = arrayHandler(array[l]);
			}
		}
		pos.pop();
		return array;
	}
	function stringHandler(string) {
		//console.log(string,JSON.stringify(pos));
		for (var j = string.length - 1; j >= 0; j--) {
			var slice = string.slice(j);
			if (slice.indexOf('<<selected:false>>') == 0) {
				string = string.slice(0,j)+string.slice(j+slice.indexOf('>>')+2);
				if (typeof map1 !== 'undefined' && arraysEqual(pos,map1) == true && map2 > j) {
					map2 = Math.max(0,map2-18);
				}
			}
			if (slice.indexOf('<<selected:true>>') == 0) {
				string = string.slice(0,j)+string.slice(j+slice.indexOf('>>')+2);
				if (typeof map1 !== 'undefined' && arraysEqual(pos,map1) == true && map2 > j) {
					map2 = Math.max(0,map2-17);
				}
			}
		}
		return string;
	}	

	//console.log(JSON.stringify(currMathsInput.cursorMap[currMathsInput.cursorPos]));
	if (typeof currMathsInput.cursorPos == 'number') {
		map1 = currMathsInput.cursorMap[currMathsInput.cursorPos];
		if (typeof map1 !== 'undefined') {
			map2 = map1[map1.length-1];
			map1 = map1.slice(0,-1);
			//console.log(JSON.stringify(map1),map2);
		}
	}
	
	currMathsInput.richText = arrayHandler(currMathsInput.richText);

	//console.log('---',map2);
	if (typeof map2 !== 'undefined') {
		currMathsInput.cursorMap[currMathsInput.cursorPos][currMathsInput.cursorMap[currMathsInput.cursorPos].length-1] = map2;
	}
	// adjust cursorPos if necessary

}
function removeSelectTagsFromArray(textArray) {
	var map1;
	var map2;
	var pos = [];
	function arrayHandler(array) {
		pos.push(0);
		for (var l = array.length - 1; l >= 0; l--) {
			pos[pos.length-1] = l;
			if (typeof array[l] == 'string') {
				array[l] = stringHandler(array[l]);
			} else {	
				array[l] = arrayHandler(array[l]);
			}
		}
		pos.pop();
		return array;
	}
	function stringHandler(string) {
		//console.log(string,JSON.stringify(pos));
		for (var j = string.length - 1; j >= 0; j--) {
			var slice = string.slice(j);
			if (slice.indexOf('<<selected:false>>') == 0) {
				string = string.slice(0,j)+string.slice(j+slice.indexOf('>>')+2);
				if (typeof map1 !== 'undefined' && arraysEqual(pos,map1) == true && map2 > j) {
					map2 = Math.max(0,map2-18);
				}
			}
			if (slice.indexOf('<<selected:true>>') == 0) {
				string = string.slice(0,j)+string.slice(j+slice.indexOf('>>')+2);
				if (typeof map1 !== 'undefined' && arraysEqual(pos,map1) == true && map2 > j) {
					map2 = Math.max(0,map2-17);
				}
			}
		}
		return string;
	}	
	
	return arrayHandler(textArray);
}
function deleteSelected() {
	var sel = false;
	currMathsInput.richText = arrayHandler(currMathsInput.richText);	
	
	function arrayHandler(array) {
		for (var l = 0; l < array.length; l++) {
			if (typeof array[l] == 'string') {
				if (l > 0 || array.length == 1 || ['frac','power','pow','subs','subscript','sin','cos','tan','ln','log','logBase','sin-1','cos-1','tan-1','abs','exp','root','sqrt','sigma1','sigma2','int1','int2','recurring','bar','hat','vectorArrow','colVector2d','colVector3d','mixedNum','lim'].indexOf(array[l]) == -1) {
					array[l] = stringHandler(array[l]);
				}
			} else {
				var preSel = false;
				if (sel == true) {preSel = true};
				array[l] = arrayHandler(array[l]);
				if (sel == true && preSel == true) {
					array.splice(l,1);
					l--;
				}
			}
		}
		return array;
	}
	function stringHandler(string) {
		var delPos = [];
		if (sel == true) delPos[0] = 0;
		var savedTags = '';
		for (var j = 0; j < string.length; j++) {
			var slice = string.slice(j);
			if (slice.indexOf('<<selected:true>>') == 0) {
				delPos[0] = j;
				sel = true;
			}
			if (slice.indexOf('<<selected:false>>') == 0) {
				delPos[1] = j + 18;
				sel = false;
 			}
			if (sel == true && (slice.indexOf('<<font') == 0 || slice.indexOf('<<bold') == 0 || slice.indexOf('<<italic') == 0 || slice.indexOf('<<color') == 0 || slice.indexOf('<<back') == 0)) {
				savedTags += slice.slice(0,slice.indexOf('>>')+2);
			}
		}
		if (delPos.length > 0) {
			if (delPos.length == 1) {
				return string.slice(0,delPos[0])+savedTags;
			} else {
				return string.slice(0,delPos[0])+savedTags+string.slice(delPos[1]);
			}
		} else {
			return string;
		}
	}
}

function mathsInputMapCursorPos() { // (re-)builds cursor map
	currMathsInput.richText = reduceTags(currMathsInput.richText);
	currMathsInput.richText = combineSpacesCursor(currMathsInput.richText);
		
	// create new cursor map
	currMathsInput.textLoc = [];
	drawMathsInputText(currMathsInput);
	currMathsInput.cursorMap = mapArray(currMathsInput.textLoc,false);
	
	// create new allMap - this includes all markup tag characters
	currMathsInput.allMap = mapArray(currMathsInput.textLoc,true); 
	
	// move cursor positions in cursorMap from end to beginning of markup tags (except for beginning)
	var cursorMap = currMathsInput.cursorMap;
	
	//console.log(currMathsInput.cursorPos,JSON.stringify(cursorMap));
	
	for (var i = 1; i < cursorMap.length; i++) {
		
		// get text element
		var richText = currMathsInput.richText;
		for (var j = 0; j < cursorMap[i].length - 1; j++) richText = richText[cursorMap[i][j]];
	
		// char is position of cursor
		var char = cursorMap[i][cursorMap[i].length-1];

		// adjust char to account for breakPoints
		if (typeof currMathsInput.breakPoints == 'object') {
			for (var k = 0; k < currMathsInput.breakPoints.length - 1; k++) {
				var breakPoint = currMathsInput.allMap[currMathsInput.breakPoints[k]];
				if (breakPoint[0] == cursorMap[i][0] && breakPoint[1] < cursorMap[i][1]) {
					char--;
				}
			}
		}
	
		// if proceeded by a tag
		if (richText.slice(char-2).indexOf('>>') == 0 && richText.slice(char-6).indexOf('<<br>>') !== 0) {
			
			// get text to the left of char
			var leftText = richText.slice(0,char);
		
			// get tagCharCount to the left of char
			var tagCharCount = 0;
			for (var j = 0; j < leftText.length; j++) {
				if (richText.slice(char-j,char).indexOf('<<') == 0 && (leftText.slice(char-j-2,char).indexOf('>>') !== 0 || leftText.slice(char-j-6,char).indexOf('<<br>>') == 0)) {
					tagCharCount = j;
					break;
				}
			}
			
			// check that it's not the very beginning
			if (cursorMap[i][0] == 0 && cursorMap[i][1] == tagCharCount) continue;
			
			// alter the cursorMap by tagCharCount
			currMathsInput.cursorMap[i][currMathsInput.cursorMap[i].length-1] -= tagCharCount;
		}
		
		
	}
	
	// update currMathsInput.text to be the same as currMathsInput.richText without any markuptags
	currMathsInput.text = clone(currMathsInput.richText);
	for (var p = 0; p < currMathsInput.text.length; p++) {
		currMathsInput.text[p] = removeTags(currMathsInput.text[p]);
	}
}
function combineSpacesCursor(array) {
	//console.log(array.length);
	if (array.length > 1) {
		for (var gg = array.length - 1; gg >= 0; gg--) {
			//console.log(gg, array[gg], typeof array[gg]);
			if (typeof array[gg] == 'object') {
				arrayString += '[' + gg + ']';
				combineSpacesCursor(array[gg]);
			} else {
				if (gg < array.length - 1 && typeof array[gg] == 'string' && typeof array[gg+1] == 'string') {
					eval('currMathsInput.richText' + arrayString + '[' + gg + '] += currMathsInput.richText' + arrayString + '[' + (gg+1) + ']');
					eval('currMathsInput.richText' + arrayString + '.splice(gg+1, 1);');
				}
			}
		}
	}
	arrayString = arrayString.slice(0, arrayString.lastIndexOf('[') - arrayString.length);
	return array;
}
function combineSpacesTextArray(array) {
	if (array.length > 1) {
		for (var i = array.length - 1; i >= 0; i--) {
			if (typeof array[i] == 'object') {
				if (i < array.length - 1 && typeof array[i] == 'string' && typeof array[i+1] == 'string') {
					array[i] = array[i] + array[i+1];
					array.splice(i+1,1);
				}				
			} else {
				combineSpacesTextArray(array[i]);
			}
		}
	}
	return array;
}

function mathsInputCursorCoords() { // updates cursor coordinates
	drawMathsInputText(currMathsInput);
	var char;
	var cursorPos = currMathsInput.cursorMap[currMathsInput.cursorPos];
	
	if (typeof cursorPos == 'undefined') return;
	
	char = currMathsInput.textLoc;	
	for (var aa = 0 ; aa < cursorPos.length; aa++) {
		char = char[cursorPos[aa]];
	}

	mathsInputCursor.x = char.left;
	mathsInputCursor.top = char.top;
	mathsInputCursor.bottom = char.top + char.height;
	
	//logText(true);
	
	//console.log('mathsInputCursor:',mathsInputCursor);
	
	inputCursorState = false;
	clearCorrectingInterval(mathsInputCursorBlinkInterval);
	drawMathsInputText(currMathsInput);
	mathsInputCursorBlink();
	mathsInputCursorBlinkInterval = setCorrectingInterval(function(){mathsInputCursorBlink()}, 600);
	blinking = true;
	currMathsInput.stringJS = createJsString();
	if (typeof textMenu !== 'undefined' && typeof textMenu !== 'undefined' && typeof textMenu.update == 'function') textMenu.update();
}
var showCursorPos = false;
function adjustForBreakPointsAllMap(pos) {
	//console.log('pos:',pos);
	if (typeof currMathsInput.breakPoints == 'object') {
		//console.log('pos:',pos);						
		var map = currMathsInput.allMap[pos];						
		for (var i = 0; i < currMathsInput.breakPoints.length - 1; i++) {
			var iBreak = currMathsInput.allMap[currMathsInput.breakPoints[i]];
			if (iBreak[0] == map[0] && iBreak[1] < map[1]) {
				pos--;
			}
		}
		//console.log('pos:',pos);
	}
	return pos;
}
function adjustForBreakPoints(pos,map,breakPoints) {
	if (typeof pos == 'undefined') pos = currMathsInput.cursorPos;
	if (typeof map == 'undefined') map = currMathsInput.cursorMap[currMathsInput.cursorPos];
	if (typeof breakPoints == 'undefined') breakPoints = currMathsInput.breakPoints; 
	
	if (typeof breakPoints == 'object') {						
		for (var i = 0; i < breakPoints.length - 1; i++) {
			var iBreak = currMathsInput.allMap[breakPoints[i]];
			//if (i > 0 && iBreak[1] - currMathsInput.allMap[breakPoints[i-1]][1] <= 7) continue;
			//console.log(iBreak,iBreak[0] == map[0] && iBreak[1] < map[1]);
			if (iBreak[0] == map[0] && iBreak[1] < map[1]) {
				pos--;
			}
		}
	}
	
	return pos;
}
function mathsInputCursorBlink() {
	if (inputCursorState == true) {inputCursorState = false} else {inputCursorState = true};

	currMathsInput.cursorctx.clearRect(0,0,1200,700);
	currMathsInput.cursorCanvas.style.zIndex = currMathsInput.canvas.style.zIndex + 1;
	
	if (showCursorPos == true) {
		for (var i = 0; i < currMathsInput.cursorMap.length; i++) {
			var cPos = currMathsInput.textLoc;
			
			for (var j = 0; j < currMathsInput.cursorMap[i].length; j++) {
				cPos = cPos[currMathsInput.cursorMap[i][j]];	
			}
						
			// adjust cPos to account for difference between canvas and cursor canvas positions
			cPos.left += (currMathsInput.data[100] - currMathsInput.cursorData[100]);
			cPos.top += (currMathsInput.data[101] - currMathsInput.cursorData[101]);
			
			//console.log(cPos);
			
			currMathsInput.cursorctx.save();
			currMathsInput.cursorctx.strokeStyle = '#F00';
			currMathsInput.cursorctx.lineWidth = 2;
			currMathsInput.cursorctx.beginPath();
			currMathsInput.cursorctx.moveTo(cPos.left, cPos.top);
			currMathsInput.cursorctx.lineTo(cPos.left, cPos.top + cPos.height);
			currMathsInput.cursorctx.closePath();
			currMathsInput.cursorctx.stroke();
			currMathsInput.cursorctx.restore();
		}
	} else if (inputCursorState == true && currMathsInput.selected == false) {
		var hAdjust = currMathsInput.data[100] - currMathsInput.cursorData[100];
		var vAdjust = currMathsInput.data[101] - currMathsInput.cursorData[101];
		//console.log('blink',inputCursorState,currMathsInput.selected,mathsInputCursor,currMathsInput.cursorPos,hAdjust,vAdjust);
		currMathsInput.cursorctx.save();
		currMathsInput.cursorctx.strokeStyle = currMathsInput.textColor;
		currMathsInput.cursorctx.lineWidth = 2;
		currMathsInput.cursorctx.beginPath();
		currMathsInput.cursorctx.moveTo(hAdjust + mathsInputCursor.x, vAdjust + mathsInputCursor.top);
		currMathsInput.cursorctx.lineTo(hAdjust + mathsInputCursor.x, vAdjust + mathsInputCursor.bottom);
		currMathsInput.cursorctx.closePath();
		currMathsInput.cursorctx.stroke();
		currMathsInput.cursorctx.restore();
	} else {
		//console.log('blink',inputCursorState,currMathsInput.selected,mathsInputCursor,currMathsInput.cursorPos);
	}
}

//var shiftOn = false;
//window.addEventListener('keyup', shiftKeyUp, false);	
/*function shiftKeyUp(e) {
	e.preventDefault();
	if (e.keyCode == 16) {
		shiftOn = false;
	}
}*/
function hardKeyMathsInput(e) { // if a key is pressed via the hardware keyboard
	e.preventDefault();
	if (inputState == true) {
		var charCode = e.keyCode; // determine which key has been pressed
		var keysToIgnore = [16,17,18,27,33,34,35,36,46,112,113,114,115,116,117,118,119,120,121,122,123,144,223];
		if (e.getModifierState('Control')) {
			if (charCode == 88) { //CTRL-x
				mathsInputCut();
			} else if (charCode == 67) { //CTRL-c
				mathsInputCopy();
			} else if (charCode == 86) { //CTRL-v
				mathsInputPaste();
			}
			return;
		}
		if (e.getModifierState('Alt')) return;		
		switch (charCode) {
			case 37 : // left arrow
				currMathsInput.preText = '';
				currMathsInput.postText = '';
				if (e.getModifierState('Shift') == true && currMathsInput.cursorPos > 0) {
					if (currMathsInput.selected == true) {
						currMathsInput.selectPos[1] = [currMathsInput.cursorPos-1];
						setSelectPositions();
						drawMathsInputText(currMathsInput);
						mathsInputMapCursorPos();
						currMathsInput.cursorPos--;
					} else {
						currMathsInput.selected = true;
						currMathsInput.selectPos = [currMathsInput.cursorPos,currMathsInput.cursorPos-1];
						setSelectPositions();
						drawMathsInputText(currMathsInput);
						mathsInputMapCursorPos();
						currMathsInput.cursorPos--;
					}
				} else if (currMathsInput.selected == true) {
					removeSelectTags();
					mathsInputMapCursorPos();
					currMathsInput.cursorPos = Math.min(currMathsInput.selectPos[0],currMathsInput.selectPos[1]);
					currMathsInput.selectPos = [];
					mathsInputCursorCoords();
					currMathsInput.selected = false;
					removeSelectTags();
				} else if (currMathsInput.cursorPos > 0) {
					currMathsInput.cursorPos--;
					mathsInputCursorCoords();
				} else {
					mathsInputTabPrev();
				}
				break;
			case 38 : // up arrow
				currMathsInput.preText = '';
				currMathsInput.postText = '';
				if (e.getModifierState('Shift') == true) {
					if (currMathsInput.selected == false) {
						currMathsInput.selectPos[0] = currMathsInput.cursorPos;
					}
				} else if (currMathsInput.selected == true) {
					removeSelectTags();
					mathsInputMapCursorPos();
					currMathsInput.cursorPos = Math.min(currMathsInput.selectPos[0],currMathsInput.selectPos[1]);
					currMathsInput.selectPos = [];
					mathsInputCursorCoords();
					currMathsInput.selected = false;
					removeSelectTags();	
				}
				var cursorPos = currMathsInput.cursorMap[currMathsInput.cursorPos];
				// get the parent of the current string
				var parent = currMathsInput.richText;
				for (var i = 0; i < cursorPos.length - 3; i++) {parent = parent[cursorPos[i]]};
				if (parent[0] == 'frac' && cursorPos[cursorPos.length - 3] == 2) {
					currMathsInput.cursorPos -= cursorPos[cursorPos.length - 1];
					currMathsInput.cursorPos--;
					mathsInputCursorCoords();
				} else {
					// check if there is a row above
					var lowerBreakPoints = [];
					for (var i = 0; i < currMathsInput.breakPoints.length - 1; i++) {
						if (currMathsInput.allMap[currMathsInput.breakPoints[i]][0] < currMathsInput.cursorMap[currMathsInput.cursorPos][0] || (currMathsInput.allMap[currMathsInput.breakPoints[i]][0] == currMathsInput.cursorMap[currMathsInput.cursorPos][0] && currMathsInput.allMap[currMathsInput.breakPoints[i]][1] < currMathsInput.cursorMap[currMathsInput.cursorPos][1])) {
							lowerBreakPoints.unshift(currMathsInput.allMap[currMathsInput.breakPoints[i]]);
						}
					}
					if (lowerBreakPoints.length == 0) {
						// cursor is on top line
						if (shiftOn == true) {
							if (currMathsInput.selected == true) {
								currMathsInput.selectPos[1] = 0;
							} else {
								currMathsInput.selectPos = [currMathsInput.cursorPos,0];
								currMathsInput.selected = true;
							}
							setSelectPositions();
							drawMathsInputText(currMathsInput);
							mathsInputMapCursorPos();
							currMathsInput.cursorPos = 0;					
						}
					} else {
						// get top point of current cursor position
						var textLoc = currMathsInput.textLoc;
						for (var i = 0; i < currMathsInput.cursorMap[currMathsInput.cursorPos].length; i++) {
							textLoc = textLoc[currMathsInput.cursorMap[currMathsInput.cursorPos][i]];	
						}
						var pos = [textLoc.left,textLoc.top];
						// search through textLocs
						var closestPos;
						var closestDist; 
						for (var i = 0; i < currMathsInput.cursorMap.length; i++) {
							// position must be less than lowerBreakPoints[0]
							if (currMathsInput.cursorMap[i][0] < lowerBreakPoints[0][0] || (currMathsInput.cursorMap[i][0] == lowerBreakPoints[0][0] && currMathsInput.cursorMap[i][1] < lowerBreakPoints[0][1])) {						
								// if it is above the current line
								
								// position must not be less than lowerBreakPoints[1]
								if (lowerBreakPoints.length > 1) {
									if (currMathsInput.cursorMap[i][0] < lowerBreakPoints[1][0] || (currMathsInput.cursorMap[i][0] == lowerBreakPoints[1][0] && currMathsInput.cursorMap[i][1] < lowerBreakPoints[1][1])) continue;
								}

								var loc = currMathsInput.textLoc;
								for (var j = 0; j < currMathsInput.cursorMap[i].length; j++) {
									loc = loc[currMathsInput.cursorMap[i][j]];	
								}
								if (typeof closestPos == 'undefined') {
									closestPos = i;
									closestDist = distancePointToLineSegment(pos,[loc.left,loc.top],[loc.left,loc.top+loc.height]);
								} else {
									var newDist = distancePointToLineSegment(pos,[loc.left,loc.top],[loc.left,loc.top+loc.height]);
									if (newDist < closestDist) {
										closestPos = i;
										closestDist = newDist;	
									}
								}
							}
						}
						if (shiftOn == true) {
							if (currMathsInput.selected == true) {
								currMathsInput.selectPos[1] = closestPos;
							} else {
								currMathsInput.selectPos = [currMathsInput.cursorPos,closestPos];
								currMathsInput.selected = true;
							}
							setSelectPositions();
							drawMathsInputText(currMathsInput);
							mathsInputMapCursorPos();
							currMathsInput.cursorPos = closestPos;
						} else {
							currMathsInput.cursorPos = closestPos;
							mathsInputCursorCoords();
						}
					}
				}
				break;
			case 39 : // right arrow
				currMathsInput.preText = '';
				currMathsInput.postText = '';			
				if (e.getModifierState('Shift') == true && currMathsInput.cursorPos > 0) {
					if (currMathsInput.selected == true) {
						currMathsInput.selectPos[1] = [currMathsInput.cursorPos+1];
						setSelectPositions();
						drawMathsInputText(currMathsInput);
						mathsInputMapCursorPos();
						currMathsInput.cursorPos++;
					} else {
						currMathsInput.selected = true;
						currMathsInput.selectPos = [currMathsInput.cursorPos,currMathsInput.cursorPos+1];
						setSelectPositions();
						drawMathsInputText(currMathsInput);
						mathsInputMapCursorPos();
						currMathsInput.cursorPos++;
					}
				} else if (currMathsInput.selected == true) {
					removeSelectTags();
					mathsInputMapCursorPos();
					currMathsInput.cursorPos = Math.max(currMathsInput.selectPos[0],currMathsInput.selectPos[1]);
					currMathsInput.selectPos = [];
					mathsInputCursorCoords();
					currMathsInput.selected = false;
					removeSelectTags();
				} else if (currMathsInput.cursorPos < currMathsInput.cursorMap.length - 1) {
					currMathsInput.cursorPos++;
					mathsInputCursorCoords();
				} else {
					mathsInputTabNext();
				}
				break;
			case 40 : // down arrow
				currMathsInput.preText = '';
				currMathsInput.postText = '';
				if (e.getModifierState('Shift') == true) {
					if (currMathsInput.selected == false) {
						currMathsInput.selectPos[0] = currMathsInput.cursorPos;
					}
				} else if (currMathsInput.selected == true) {
					removeSelectTags();
					mathsInputMapCursorPos();
					currMathsInput.cursorPos = Math.max(currMathsInput.selectPos[0],currMathsInput.selectPos[1]);
					currMathsInput.selectPos = [];
					mathsInputCursorCoords();
					currMathsInput.selected = false;
					removeSelectTags();
				}
				var cursorPos = currMathsInput.cursorMap[currMathsInput.cursorPos];
				// get the parent of the current string
				var parent = currMathsInput.richText;
				for (var aa = 0; aa < cursorPos.length - 3; aa++) {parent = parent[cursorPos[aa]]};
				if (parent[0] == 'frac' && cursorPos[cursorPos.length - 3] == 1) {
					// move to the beginning of the denominator text
					do {
						currMathsInput.cursorPos++;
						var cursorPos2 = currMathsInput.cursorMap[currMathsInput.cursorPos];
						// get the parent of the cursorPos
						var parent2 = currMathsInput.richText;
						for (var aa = 0; aa < cursorPos2.length - 3; aa++) {parent2 = parent2[cursorPos2[aa]]};
					} while ((parent2 !== parent) || (parent2 == parent && cursorPos2[cursorPos.length - 3] !== 2));
					// move to the end of the denominator text					
					do {
						currMathsInput.cursorPos++;
						var cursorPos2 = currMathsInput.cursorMap[currMathsInput.cursorPos];
					} while (cursorPos2.length >= cursorPos.length);
					currMathsInput.cursorPos--;
					mathsInputCursorCoords();
				} else {
					var higherBreakPoints = [];
					for (var i = 0; i < currMathsInput.breakPoints.length - 1; i++) {
						if (currMathsInput.allMap[currMathsInput.breakPoints[i]][0] > currMathsInput.cursorMap[currMathsInput.cursorPos][0] || (currMathsInput.allMap[currMathsInput.breakPoints[i]][0] == currMathsInput.cursorMap[currMathsInput.cursorPos][0] && currMathsInput.allMap[currMathsInput.breakPoints[i]][1] > currMathsInput.cursorMap[currMathsInput.cursorPos][1])) {
							higherBreakPoints.push(currMathsInput.allMap[currMathsInput.breakPoints[i]]);
						}
					}
					if (higherBreakPoints.length == 0) {
						// cursor is on bottom line
						if (shiftOn == true) {
							if (currMathsInput.selected == true) {
								currMathsInput.selectPos[1] = currMathsInput.cursorMap.length - 1;
							} else {
								currMathsInput.selectPos = [currMathsInput.cursorPos,currMathsInput.cursorMap.length - 1];
								currMathsInput.selected = true;
							}
							setSelectPositions();
							drawMathsInputText(currMathsInput);
							mathsInputMapCursorPos();
							currMathsInput.cursorPos = currMathsInput.cursorMap.length - 1;					
						}
					} else {
						// get bottom point of current cursor position
						var textLoc = currMathsInput.textLoc;
						for (var i = 0; i < currMathsInput.cursorMap[currMathsInput.cursorPos].length; i++) {
							textLoc = textLoc[currMathsInput.cursorMap[currMathsInput.cursorPos][i]];	
						}
						var pos = [textLoc.left,textLoc.top+textLoc.height];
						// search through textLocs
						var closestPos;
						var closestDist; 
						for (var i = 0; i < currMathsInput.cursorMap.length; i++) {
							// position must be more than higherBreakPoints[0]
							if (currMathsInput.cursorMap[i][0] > higherBreakPoints[0][0] || (currMathsInput.cursorMap[i][0] == higherBreakPoints[0][0] && currMathsInput.cursorMap[i][1] > higherBreakPoints[0][1])) {						
								// if it is above the current line
								
								// position must not be less than higherBreakPoints[1]
								if (higherBreakPoints.length > 1) {
									if (currMathsInput.cursorMap[i][0] > higherBreakPoints[1][0] || (currMathsInput.cursorMap[i][0] == higherBreakPoints[1][0] && currMathsInput.cursorMap[i][1] > higherBreakPoints[1][1])) continue;
								}
								var loc = currMathsInput.textLoc;
								for (var j = 0; j < currMathsInput.cursorMap[i].length; j++) {
									loc = loc[currMathsInput.cursorMap[i][j]];	
								}
								if (typeof closestPos == 'undefined') {
									closestPos = i;
									closestDist = distancePointToLineSegment(pos,[loc.left,loc.top],[loc.left,loc.top+loc.height]);
								} else {
									var newDist = distancePointToLineSegment(pos,[loc.left,loc.top],[loc.left,loc.top+loc.height]);
									if (newDist < closestDist) {
										closestPos = i;
										closestDist = newDist;	
									}
								}
							}
						}
						if (shiftOn == true) {
							if (currMathsInput.selected == true) {
								currMathsInput.selectPos[1] = closestPos;
							} else {
								currMathsInput.selectPos = [currMathsInput.cursorPos,closestPos];
								currMathsInput.selected = true;
							}
							setSelectPositions();
							drawMathsInputText(currMathsInput);
							mathsInputMapCursorPos();
							currMathsInput.cursorPos = closestPos;
						} else {
							currMathsInput.cursorPos = closestPos;
							mathsInputCursorCoords();
						}
					}
						
				}
				break;
			case 8 : // backspace key pressed
				currMathsInput.preText = '';
				currMathsInput.postText = '';
				if (currMathsInput.selected == true) {
					currMathsInput.cursorPos = Math.min(currMathsInput.selectPos[0],currMathsInput.selectPos[1]);
					currMathsInput.selPos = [];
					currMathsInput.selected = false;
					deleteSelected();
					removeSelectTags();
					drawMathsInputText(currMathsInput);
					mathsInputMapCursorPos();
					mathsInputCursorCoords();					
				} else if (currMathsInput.cursorPos > 0) {
					removeSelectTags();
					// get the relevant string from currMathsInput.richText
					// ie. currMathsInput.richText[cursorPos[0]][cursorPos[1]]...[cursorPos[n]]
					var cursorPos = currMathsInput.cursorMap[currMathsInput.cursorPos];
					var pos = cursorPos[cursorPos.length - 1];
					pos = adjustForBreakPoints(pos);
					
					var text = currMathsInput.richText;
					for (var i = 0; i < cursorPos.length - 1; i++) {text = text[cursorPos[i]]};
					
					var parent;
					if (cursorPos.length > 1) {
						parent = currMathsInput.richText;
						for (var i = 0; i < cursorPos.length - 2; i++) {parent = parent[cursorPos[i]]};
					}
					var grandParent;
					if (cursorPos.length > 2) {
						grandParent = currMathsInput.richText;
						for (var i = 0; i < cursorPos.length - 3; i++) {grandParent = grandParent[cursorPos[i]]};
					}
					
					if (text !== '') {
						if (pos !== 0) {
							//console.clear();
							//console.log(1,text,pos,text.slice(pos-1));
							if (text.slice(pos-6).indexOf('<<br>>') == 0) {
								text = text.slice(0, pos-6) + text.slice(pos);
							} else {
								text = text.slice(0, pos-1) + text.slice(pos);
							}
							//console.log(2,text);
							// replace the string
							var evalString = 'currMathsInput.richText' 
							for (var aa = 0; aa < cursorPos.length - 1; aa++) {
								// ugly string creation apprach in order to use eval()
								evalString += '[' + cursorPos[aa] + ']';
							}
							eval(evalString + ' = text;');
						}
					} else {
						if (parent.length == 1) { // ie. empty string is only sub-element  
							var elemsOneParam = ['sqrt', 'pow', 'power', 'subs', 'subscript', 'sin', 'cos', 'tan', 'sin-1', 'cos-1', 'tan-1', 'log', 'ln', 'abs', 'exp', 'sigma1', 'int1', 'vectorArrow', 'bar', 'hat', 'recurring'];
							var elemsTwoParams = ['root', 'frac', 'logBase', 'colVector2d', 'lim'];
							var elemsThreeParams = ['sigma2', 'int2', 'colVector3d', 'mixedNum'];
							if (elemsOneParam.indexOf(grandParent[0]) > -1 || (elemsTwoParams.indexOf(grandParent[0]) > -1 && cursorPos[cursorPos.length - 3] == 1) || (elemsThreeParams.indexOf(grandParent[0]) > -1 && cursorPos[cursorPos.length - 3] == 1)) { // conditions to delete 					
								// replace grandParent with "";
								var evalString = 'currMathsInput.richText' 
								for (var i = 0; i < cursorPos.length - 3; i++) {
									// ugly string creation apprach in order to use eval()
									evalString += '[' + cursorPos[i] + ']';
								}
								eval(evalString + ' = "";');
							}
						}
					}
					//console.log(JSON.stringify(currMathsInput.richText));
					mathsInputMapCursorPos();
					currMathsInput.cursorPos--;
					mathsInputCursorCoords();
				}
				break;
			case 46 : // delete key
				currMathsInput.preText = '';
				currMathsInput.postText = '';			
				if (currMathsInput.selected == true) {
					currMathsInput.cursorPos = Math.min(currMathsInput.selectPos[0],currMathsInput.selectPos[1]);
					currMathsInput.selPos = [];
					currMathsInput.selected = false;
					deleteSelected();
					removeSelectTags();
					drawMathsInputText(currMathsInput);
					mathsInputMapCursorPos();
					mathsInputCursorCoords();					
				} else if (currMathsInput.cursorPos < currMathsInput.cursorMap.length - 1) {
					// get the relevant string from currMathsInput.richText
					// ie. currMathsInput.richText[cursorPos[0]][cursorPos[1]]...[cursorPos[n]]
					var cursorPos = currMathsInput.cursorMap[currMathsInput.cursorPos];
					var pos = cursorPos[cursorPos.length - 1];
					pos = adjustForBreakPoints(pos);
										
					var text = currMathsInput.richText;
					for (var i = 0; i < cursorPos.length - 1; i++) {text = text[cursorPos[i]]};
					
					if (cursorPos[cursorPos.length - 1] !== text.length) {
						if (text.slice(pos).indexOf('<<br>>') == 0) {
							text = text.slice(0,pos) + text.slice(pos+6);
						} else if (text.slice(pos).indexOf('<<') == 0) {
							//skip forward to end of tags
							var text2 = text.slice(pos);
							var endFound = false;
							var charCount = 0;
							do {
								var c = text2.indexOf('>>') + 2;
								charCount += c;
								var text2 = text2.slice(c);
								if (text2.indexOf('<<') !== 0) {
									endFound = true;
								}
							} while (endFound == false);
							pos += charCount;
							text = text.slice(0,pos) + text.slice(pos+1);
						} else {
							text = text.slice(0,pos) + text.slice(pos+1);
						}
						// replace the string
						var evalString = 'currMathsInput.richText' 
						for (var i = 0; i < cursorPos.length - 1; i++) {
							// ugly string creation apprach in order to use eval()
							evalString += '[' + cursorPos[i] + ']';
						}
						eval(evalString + ' = text;');
						mathsInputMapCursorPos();
						mathsInputCursorCoords();
					}
				}
				break;
			case 9 : // tab key pressed
				if (typeof draw !== 'undefined' && draw.drawMode == 'textEdit') {
					if (e.getModifierState('Control')) {
						mathsInputTab(10);
					} else if (e.getModifierState('Shift')) {
						mathsInputTab(5);
					} else {
						mathsInputTab();
					}
				} else {
					mathsInputTabNext();
				}
				break;
			case 13 : // enter key pressed			
				if (currMathsInput.maxLines > 1 || (typeof draw !== 'undefined' && draw.drawMode == 'textEdit')) {
					if (currMathsInput.selected == true) {
						currMathsInput.cursorPos = Math.min(currMathsInput.selectPos[0],currMathsInput.selectPos[1]);
						currMathsInput.selPos = [];
						currMathsInput.selected = false;
						deleteSelected();
						removeSelectTags();
						drawMathsInputText(currMathsInput);
						mathsInputMapCursorPos();
						mathsInputCursorCoords();
					}
					mathsInputNewLine();
				} else {
					endMathsInput(e);	
				}
				break;
			case 27 : // escape key pressed
				endMathsInput(e);
				break;
			/*case 16 : //shift key pressed
				shiftOn = true;
				window.addEventListener('keyup', shiftKeyUp, false);
				break;*/
			default :
			
				// need to protect against << or >> being entered
			
				if (currMathsInput.text[0].length >= currMathsInput.maxChars) {break};
				if (e.getModifierState('Shift') == true && charCode == 54/* && currMathsInput.cursorMap[currMathsInput.cursorPos].length == 2*/) { // if hat symbol is used and current text element is a text string
					mathsInputPow();
					break;
				}
				if (keysToIgnore.indexOf(charCode) == -1) {
					
					if (currMathsInput.selected == true) {
						currMathsInput.cursorPos = Math.min(currMathsInput.selectPos[0],currMathsInput.selectPos[1]);
						currMathsInput.selPos = [];
						currMathsInput.selected = false;
						deleteSelected();
						removeSelectTags();
						drawMathsInputText(currMathsInput);
						mathsInputMapCursorPos();
						mathsInputCursorCoords();
					}					
					
					var caps = false;
					if (e.getModifierState('Shift') || e.getModifierState('CapsLock')) caps = true
					
					for (var ii = 0; ii < charMap.length; ii++) {
						if (charCode == charMap[ii][0]) {
							if (caps) {
								charCode = charMap[ii][2];
							} else {
								charCode = charMap[ii][1];
							}
						}
					}
					// if it is a letter key and shift is not pressed, use lower case instead of upper case
					if (!caps && charCode >= 65 && charCode <= 90) charCode += 32; 
					var keyValue = String.fromCharCode(charCode);
					
					// get the relevant string from currMathsInput.richText
					// ie. currMathsInput.richText[cursorPos[0]][cursorPos[1]]...[cursorPos[n]]
					//console.log(currMathsInput.cursorMap,currMathsInput.cursorPos,currMathsInput.cursorMap[currMathsInput.cursorPos]);
					var cursorPos = currMathsInput.cursorMap[currMathsInput.cursorPos];
					
					/*
					console.log('currMathsInput.cursorMap:',JSON.stringify(currMathsInput.cursorMap,null,4),currMathsInput.cursorMap.length-1);
					console.log('currMathsInput.cursorPos:',JSON.stringify(currMathsInput.cursorPos,null,4));
					console.log('currMathsInput.cursorMap[currMathsInput.cursorPos]:',JSON.stringify(currMathsInput.cursorMap[currMathsInput.cursorPos],null,4));
					console.log('currMathsInput.richText[0]:',JSON.stringify(currMathsInput.richText[0],null,4),currMathsInput.richText[0].length-1);
					console.log('cursorPos:',JSON.stringify(cursorPos,null,4));
					*/
					
					var text = currMathsInput.richText;
					for (var i = 0; i < cursorPos.length - 1; i++) {
						text = text[cursorPos[i]];
					}
					
					var slicePos = cursorPos[cursorPos.length - 1];
					slicePos = adjustForBreakPoints(slicePos);
					
					/*var prev = 0;
					var breakPoints = currMathsInput.breakPoints;
					for (var b = 0; b < breakPoints.length; b++) {
						prev = breakPoints[b];
					}*/
					
					//console.log(text,slicePos);
					
					slicePos = mathsInputAvoidTagSplit(text,slicePos);
					/* this section replaced by the function above
					// check that a tag is not being split - if so adjust slicePos
					var leftText = text.slice(0,slicePos);
					var rightText = text.slice(slicePos);
					var tagLeft = false;
					var tagLeftCount = 0;
					for (var i = 0; i < leftText.length; i++) {
						tagLeftCount++;
						//console.log('left '+i+':',leftText.slice(leftText.length - i)); 
						if (leftText.slice(leftText.length - i).indexOf('>>') == 0) break;
						if (leftText.slice(leftText.length - i).indexOf('<<') == 0) {
							tagLeft = true;
							break;
						}
					}
					var tagRight = false;
					var tagRightCount = 0;
					for (var j = 0; j < rightText.length; j++) {
						tagRightCount++;
						//console.log('right '+j+':',rightText.slice(j));
						if (rightText.slice(j).indexOf('<<') == 0) break;
						if (rightText.slice(j).indexOf('>>') == 0) {
							tagRight = true;
							break;
						}
					}
					//console.log(tagLeft,tagRight,tagLeftCount,tagRightCount);
					if (tagLeft == true && tagRight == true) {
						if (tagLeftCount <= tagRightCount) {
							slicePos -= tagLeftCount;	
						} else {
							slicePos += tagRightCount;
						}
					}
					// test if '<',slicePos,'<' or '>',slicePos,'>'
					if (leftText.slice(-1) == '<' && rightText.slice(0,1) == '<' && rightText.slice(0,2) !== '<<') slicePos--;
					if (leftText.slice(-1) == '>' && leftText.slice(-2) !== '>>' && rightText.slice(0,1) == '>') slicePos++;*/
					
					if (un(currMathsInput.preText) || currMathsInput.preText == null) {
						var pre = "";
					} else {
						var pre = currMathsInput.preText;
					}
					if (un(currMathsInput.postText) || currMathsInput.postText == null) {
						var post = "";
					} else {
						var post = currMathsInput.postText;
					}					
					
					text = text.slice(0, slicePos) + pre + keyValue + post + text.slice(slicePos);

					// replace the string
					var evalString = 'currMathsInput.richText' 
					for (var i = 0; i < cursorPos.length - 1; i++) {
						// ugly string creation apprach in order to use eval()
						evalString += '[' + cursorPos[i] + ']';
					}
					eval(evalString + ' = text;');	
					
					//logText();
					mathsInputMapCursorPos();
					
					// set the last number of cursorMap[cursorPos+1] to be one more than cursorMap[cursorPos]
					//currMathsInput.cursorMap[currMathsInput.cursorPos + 1][currMathsInput.cursorMap[currMathsInput.cursorPos + 1].length - 1] = currMathsInput.cursorMap[currMathsInput.cursorPos][currMathsInput.cursorMap[currMathsInput.cursorPos].length - 1] + 1;
										
					currMathsInput.cursorPos += 1;
					mathsInputCursorCoords();
					currMathsInput.preText = '';
					currMathsInput.postText = '';						
					//logText();
				}
		}
	}
}
function softKeyMathsInput(e) {
	//console.log(inputState);
	if (inputState == true) {
		/*
		if (mathsInputDoubleInput == true) {
			return;
		} else {
			mathsInputDoubleInput = true;
			setTimeout(function() {
				mathsInputDoubleInput = false;
			}, 250);
		}
		*/
		var keyNum;
		var keyValue;
		if (keyboard[pageIndex]) {
			keyNum = key1[pageIndex].indexOf(e.target);
			keyValue = key1Data[pageIndex][keyNum][6];
		}
		//console.log(keyValue);
		if (keyValue == 'delete') { // if it's the delete button
			currMathsInput.preText = '';
			currMathsInput.postText = '';	
			if (currMathsInput.selected == true) {
				currMathsInput.cursorPos = Math.min(currMathsInput.selectPos[0],currMathsInput.selectPos[1]);
				currMathsInput.selPos = [];
				currMathsInput.selected = false;
				deleteSelected();
				removeSelectTags();
				drawMathsInputText(currMathsInput);
				mathsInputMapCursorPos();
				mathsInputCursorCoords();					
			} else if (currMathsInput.cursorPos > 0) {
				// get the relevant string from currMathsInput.richText
				// ie. currMathsInput.richText[cursorPos[0]][cursorPos[1]]...[cursorPos[n]]
				var cursorPos = currMathsInput.cursorMap[currMathsInput.cursorPos];
				//console.log(cursorPos);
				var pos = cursorPos[cursorPos.length - 1];
				//console.log(pos);
				pos = adjustForBreakPoints(pos);
				//console.log(pos);
				
				var text = currMathsInput.richText;
				for (var i = 0; i < cursorPos.length - 1; i++) {text = text[cursorPos[i]]};
				
				var parent;
				if (cursorPos.length > 1) {
					parent = currMathsInput.richText;
					for (var i = 0; i < cursorPos.length - 2; i++) {parent = parent[cursorPos[i]]};
				}
				var grandParent;
				if (cursorPos.length > 2) {
					grandParent = currMathsInput.richText;
					for (var i = 0; i < cursorPos.length - 3; i++) {grandParent = grandParent[cursorPos[i]]};
				}
				
				if (text !== '') {
					if (pos !== 0) {
						//console.log(1,text,text.length,pos,text.slice(0, pos-1) + text.slice(pos));
						if (text.slice(pos-6).indexOf('<<br>>') == 0) {
							text = text.slice(0, pos-6) + text.slice(pos);
						} else {
							text = text.slice(0, pos-1) + text.slice(pos);
						}
						//console.log(2,text);
						// replace the string
						var evalString = 'currMathsInput.richText' 
						for (var aa = 0; aa < cursorPos.length - 1; aa++) {
							// ugly string creation apprach in order to use eval()
							evalString += '[' + cursorPos[aa] + ']';
						}
						eval(evalString + ' = text;');
					}
				} else {
					if (parent.length == 1) { // ie. empty string is only sub-element  
						var elemsOneParam = ['sqrt', 'pow', 'power', 'subs', 'subscript', 'sin', 'cos', 'tan', 'sin-1', 'cos-1', 'tan-1', 'log', 'ln', 'abs', 'exp', 'sigma1', 'int1', 'vectorArrow', 'bar', 'hat', 'recurring'];
						var elemsTwoParams = ['root', 'frac', 'logBase', 'colVector2d', 'lim'];
						var elemsThreeParams = ['sigma2', 'int2', 'colVector3d', 'mixedNum'];
						if (elemsOneParam.indexOf(grandParent[0]) > -1 || (elemsTwoParams.indexOf(grandParent[0]) > -1 && cursorPos[cursorPos.length - 3] == 1) || (elemsThreeParams.indexOf(grandParent[0]) > -1 && cursorPos[cursorPos.length - 3] == 1)) { // conditions to delete elements								
							// replace grandParent with "";
							var evalString = 'currMathsInput.richText' 
							for (var i = 0; i < cursorPos.length - 3; i++) {
								// ugly string creation apprach in order to use eval()
								evalString += '[' + cursorPos[i] + ']';
							}
							eval(evalString + ' = "";');
						}
					}
				}
				mathsInputMapCursorPos();
				currMathsInput.cursorPos--;
				mathsInputCursorCoords();
			}
		} else {
			// type text char
			if (currMathsInput.text[0].length >= currMathsInput.maxChars) {return};
			
			if (currMathsInput.selected == true) {
				currMathsInput.cursorPos = Math.min(currMathsInput.selectPos[0],currMathsInput.selectPos[1]);
				currMathsInput.selPos = [];
				currMathsInput.selected = false;
				deleteSelected();
				removeSelectTags();
				drawMathsInputText(currMathsInput);
				mathsInputMapCursorPos();
				mathsInputCursorCoords();
			}			
			
			// get the relevant string from currMathsInput.richText
			// ie. currMathsInput.richText[cursorPos[0]][cursorPos[1]]...[cursorPos[n]]
			var cursorPos = currMathsInput.cursorMap[currMathsInput.cursorPos];
						
			var text = currMathsInput.richText;
			for (var aa = 0; aa < cursorPos.length - 1; aa++) {
				text = text[cursorPos[aa]];
			}
			
			/*
			// test if sin, cos, tan, ln or log have been written:
			if (keyValue == 'n' && text.length > 1 && text.slice(cursorPos[cursorPos.length - 1] - 2, cursorPos[cursorPos.length - 1]) == 'si') {
				// get cursorPos
				var cursorPos = currMathsInput.cursorMap[currMathsInput.cursorPos];
				// get parent
				var parent = currMathsInput.richText;
				for (var aa = 0; aa < cursorPos.length - 1; aa++) {parent = parent[cursorPos[aa]]};
				// get position of cursor in parent string
				var pos = cursorPos[cursorPos.length - 1];
				var parentPos = cursorPos[cursorPos.length - 2];
			
				var evalString = 'currMathsInput.richText' 
				for (var aa = 0; aa < cursorPos.length - 2; aa++) {
					// ugly string creation apprach in order to use eval()
					evalString += '[' + cursorPos[aa] + ']';
				}
				eval(evalString + ".splice(parentPos, 1, parent.slice(0, pos - 2), ['sin', ['']], parent.slice(pos));");
				mathsInputMapCursorPos();
				currMathsInput.cursorPos--;
				mathsInputCursorCoords();
				return;
			}
			if (keyValue == 's' && text.length > 1 && text.slice(cursorPos[cursorPos.length - 1] - 2, cursorPos[cursorPos.length - 1]) == 'co') {
				// get cursorPos
				var cursorPos = currMathsInput.cursorMap[currMathsInput.cursorPos];
				// get parent
				var parent = currMathsInput.richText;
				for (var aa = 0; aa < cursorPos.length - 1; aa++) {parent = parent[cursorPos[aa]]};
				// get position of cursor in parent string
				var pos = cursorPos[cursorPos.length - 1];
				var parentPos = cursorPos[cursorPos.length - 2];
			
				var evalString = 'currMathsInput.richText' 
				for (var aa = 0; aa < cursorPos.length - 2; aa++) {
					// ugly string creation apprach in order to use eval()
					evalString += '[' + cursorPos[aa] + ']';
				}
				eval(evalString + ".splice(parentPos, 1, parent.slice(0, pos - 2), ['cos', ['']], parent.slice(pos));");
				mathsInputMapCursorPos();
				currMathsInput.cursorPos--;
				mathsInputCursorCoords();
				return;
			}
			if (keyValue == 'n' && text.length > 1 && text.slice(cursorPos[cursorPos.length - 1] - 2, cursorPos[cursorPos.length - 1]) == 'ta') {
				console.log('tan');
				// get cursorPos
				var cursorPos = currMathsInput.cursorMap[currMathsInput.cursorPos];
				// get parent
				var parent = currMathsInput.richText;
				for (var aa = 0; aa < cursorPos.length - 1; aa++) {parent = parent[cursorPos[aa]]};
				// get position of cursor in parent string
				var pos = cursorPos[cursorPos.length - 1];
				var parentPos = cursorPos[cursorPos.length - 2];
			
				var evalString = 'currMathsInput.richText' 
				for (var aa = 0; aa < cursorPos.length - 2; aa++) {
					// ugly string creation apprach in order to use eval()
					evalString += '[' + cursorPos[aa] + ']';
				}
				eval(evalString + ".splice(parentPos, 1, parent.slice(0, pos - 2), ['tan', ['']], parent.slice(pos));");
				mathsInputMapCursorPos();
				currMathsInput.cursorPos--;
				mathsInputCursorCoords();
				return;
			}
			if (keyValue == 'n' && text.length > 0 && text.slice(cursorPos[cursorPos.length - 1] - 1, cursorPos[cursorPos.length - 1]) == 'l') {
				console.log('ln');
				// get cursorPos
				var cursorPos = currMathsInput.cursorMap[currMathsInput.cursorPos];
				// get parent
				var parent = currMathsInput.richText;
				for (var aa = 0; aa < cursorPos.length - 1; aa++) {parent = parent[cursorPos[aa]]};
				// get position of cursor in parent string
				var pos = cursorPos[cursorPos.length - 1];
				var parentPos = cursorPos[cursorPos.length - 2];
			
				var evalString = 'currMathsInput.richText' 
				for (var aa = 0; aa < cursorPos.length - 2; aa++) {
					// ugly string creation apprach in order to use eval()
					evalString += '[' + cursorPos[aa] + ']';
				}
				eval(evalString + ".splice(parentPos, 1, parent.slice(0, pos - 1), ['ln', ['']], parent.slice(pos));");
				mathsInputMapCursorPos();
				mathsInputCursorCoords();
				return;
			}
			if (keyValue == 'g' && text.length > 1 && text.slice(cursorPos[cursorPos.length - 1] - 2, cursorPos[cursorPos.length - 1]) == 'lo') {
				console.log('log');
				// get cursorPos
				var cursorPos = currMathsInput.cursorMap[currMathsInput.cursorPos];
				// get parent
				var parent = currMathsInput.richText;
				for (var aa = 0; aa < cursorPos.length - 1; aa++) {parent = parent[cursorPos[aa]]};
				// get position of cursor in parent string
				var pos = cursorPos[cursorPos.length - 1];
				var parentPos = cursorPos[cursorPos.length - 2];
			
				var evalString = 'currMathsInput.richText' 
				for (var aa = 0; aa < cursorPos.length - 2; aa++) {
					// ugly string creation apprach in order to use eval()
					evalString += '[' + cursorPos[aa] + ']';
				}
				eval(evalString + ".splice(parentPos, 1, parent.slice(0, pos - 2), ['log', ['']], parent.slice(pos));");
				mathsInputMapCursorPos();
				currMathsInput.cursorPos--;
				mathsInputCursorCoords();
				return;
			}			
			*/

			var slicePos = cursorPos[cursorPos.length - 1];
			slicePos = adjustForBreakPoints(slicePos);
			//console.log(slicePos);

			slicePos = mathsInputAvoidTagSplit(text,slicePos);
			/* the section below is replaced by the function above
			// check that a tag is not being split - if so adjust slicePos
			var leftText = text.slice(0,slicePos);
			var rightText = text.slice(slicePos);
			var tagLeft = false;
			var tagLeftCount = 0;
			for (var i = 0; i < leftText.length; i++) {
				tagLeftCount++;
				//console.log('left '+i+':',leftText.slice(leftText.length - i)); 
				if (leftText.slice(leftText.length - i).indexOf('>>') == 0) break;
				if (leftText.slice(leftText.length - i).indexOf('<<') == 0) {
					tagLeft = true;
					break;
				}
			}
			var tagRight = false;
			var tagRightCount = 0;
			for (var j = 0; j < rightText.length; j++) {
				tagRightCount++;
				//console.log('right '+j+':',rightText.slice(j));
				if (rightText.slice(j).indexOf('<<') == 0) break;
				if (rightText.slice(j).indexOf('>>') == 0) {
					tagRight = true;
					break;
				}
			}
			//console.log(tagLeft,tagRight,tagLeftCount,tagRightCount);
			if (tagLeft == true && tagRight == true) {
				if (tagLeftCount <= tagRightCount) {
					slicePos -= tagLeftCount;	
				} else {
					slicePos += tagRightCount;
				}
			}
			// test if '<',slicePos,'<' or '>',slicePos,'>'
			if (leftText.slice(-1) == '<' && rightText.slice(0,1) == '<' && rightText.slice(0,2) !== '<<') slicePos--;
			if (leftText.slice(-1) == '>' && leftText.slice(-2) !== '>>' && rightText.slice(0,1) == '>') slicePos++;*/

			
			if (un(currMathsInput.preText) || currMathsInput.preText == null) {
				var pre = "";
			} else {
				var pre = currMathsInput.preText;
			}
			if (un(currMathsInput.postText) || currMathsInput.postText == null) {
				var post = "";
			} else {
				var post = currMathsInput.postText;
			}			
			
			text = text.slice(0, slicePos) + pre + keyValue + post + text.slice(slicePos);

			// replace the string
			var evalString = 'currMathsInput.richText' 
			for (var i = 0; i < cursorPos.length - 1; i++) {
				// ugly string creation approach in order to use eval()
				evalString += '[' + cursorPos[i] + ']';
			}
			eval(evalString + ' = text;');
			
			// if followed by a power, test if a baseSpacer is now required					
			if (cursorPos[cursorPos.length - 1] + 1 == text.length && typeof currMathsInput.cursorMap[currMathsInput.cursorPos + 1] !== 'undefined') {
				// get the next element after the parent
				var nextCursorPos = currMathsInput.cursorMap[currMathsInput.cursorPos + 1];
				var nextElem = currMathsInput.richText;
				for (var aa = 0; aa < nextCursorPos.length - 3; aa++) {nextElem = nextElem[nextCursorPos[aa]]};
				if (nextElem[0] == 'power' || nextElem[0] == 'subs') {
					var baseSpacer = true;
					if (/[a-zA-Z0-9)]/g.test(keyValue) == true) baseSpacer = false
					var evalString = 'currMathsInput.richText' 
					for (var aa = 0; aa < nextCursorPos.length - 3; aa++) {
						// ugly string creation apprach in order to use eval()
						evalString += '[' + nextCursorPos[aa] + ']';
					}
					eval(evalString + "[1] = " + baseSpacer + ";");
				}
			}			
			
			mathsInputMapCursorPos();
			currMathsInput.cursorPos += 1;
			mathsInputCursorCoords();
			currMathsInput.preText = '';
			currMathsInput.postText = '';			
		}
	}
}

//var date = new Date();
//var prevMathsInputTime = date.getTime();
var mathsInputDoubleInput = false;

/*function setMathsInputBackColor(input,color) {
	input.backColor = color;
	drawMathsInputText(input);
}*/
function measureMathsInputText(input) {
	var leftPoint = 10;
	if (input.textAlign == 'center') {leftPoint = 0.5 * input.data[2]};
	if (typeof input.richText[input.richText.length - 1] !== 'string') {input.richText.push('')};
	return drawMathsText(input.ctx, input.richText, input.fontSize, leftPoint, 0.5 * input.data[3], input.algText, input.textLoc, input.textAlign, 'middle', input.textColor, 'measure');
}
function drawMathsInputText(input,ctxLocal,sf,useRelPos) {
	if (typeof sf == 'undefined') sf = 1;
	if (typeof ctxLocal == 'undefined') {
		input.ctx.clearRect(0,0,input.data[102],input.data[103]);
		var ctx = input.ctx;
		var ownCanvas = true;
	} else {
		var ctx = ctxLocal; // will draw to a different canvas
		var ownCanvas = false;
	}
	if (typeof input.richText[input.richText.length-1] !== 'string') {input.richText.push('')};
	var leftPoint = 10*sf;
	var topPoint = 0;

	if (typeof input.varSize == 'object') {
		if (input.textAlign == 'left') {
			leftPoint = input.varSize.padding*sf;
			if (typeof input.varSize.padding !== 'number') leftPoint = 10*sf;
		} else if (input.textAlign == 'center') {
			leftPoint = 0;
		} else if (input.textAlign == 'right') {
			leftPoint = 0 - input.varSize.padding*sf;
			if (typeof input.varSize.padding !== 'number') leftPoint = -10*sf;
		}
		var minTightWidth = input.varSize.minWidth*sf || 50*sf;
		var minTightHeight = input.varSize.minHeight*sf || 50*sf;
		var padding = input.varSize.padding*sf;
		var maxWidth = input.varSize.maxWidth*sf || input.data[102]*sf;
		var maxHeight = input.varSize.maxHeight*sf || input.data[103]*sf;		
	} else {
		if (input.textAlign == 'left') {
			leftPoint = 10*sf;
		} else if (input.textAlign == 'center') {
			leftPoint = 0;							
		} else if (input.textAlign == 'right') {
			
		}
		var minTightWidth = 50*sf;
		var minTightHeight = 50*sf;
		var padding = 0.01*sf;	
		var maxWidth = input.data[102]*sf;
		var maxHeight = input.data[103]*sf;		
	}
	
	if (input.border == true) {
		if (typeof input.varSize == 'object') {
			var border = {
				type:'tight',
				color:input.backColor,
				borderColor:input.borderColor,
				borderWidth:input.borderWidth*sf,
				dash:input.borderDash,
				radius:input.borderRadius*sf || input.radius*sf || 0
			}
		} else {
			var radius = input.borderRadius*sf || input.radius*sf || 0;
			var borderLeft = input.borderWidth*sf/2;
			var borderTop = input.borderWidth*sf/2;
			if (ownCanvas == false) {
				borderLeft += input.data[100]*sf;
				borderTop += input.data[101]*sf;
			}
			roundedRect(ctx,borderLeft,borderTop,input.data[102]*sf-input.borderWidth*sf,input.data[103]*sf-input.borderWidth*sf,radius,input.borderWidth*sf,input.borderColor,input.backColor,input.borderDash);
			var border = {type:'none'};
		}
	} else {
		var border = {type:'none'};
	}
	
	if (ownCanvas == false) {
		if (!isNaN(input.data[100])) {
			leftPoint += input.data[100]*sf;
			topPoint += input.data[101]*sf;
		} else {
			leftPoint += input.data[0]*sf;
			topPoint += input.data[1]*sf;
		}
		if (boolean(useRelPos,true) == true && typeof draw !== 'undefined' && typeof draw !== 'undefined' && typeof draw.drawRelPos !== 'undefined') {
			leftPoint -= draw.drawRelPos[0]*sf;
			topPoint -= draw.drawRelPos[1]*sf;
		}
	}
	
	var lineSpacingFactor = input.lineSpacingFactor || 1.2;
	var lineSpacingStyle = input.lineSpacingStyle || 'variable';
	
	var drawText = text({
		context:ctx,
		textArray:input.richText,
		left:leftPoint,
		top:topPoint,
		width:maxWidth,
		height:maxHeight,
		allowSpaces:true,
		textAlign:input.textAlign,
		vertAlign:input.vertAlign,
		minTightWidth:minTightWidth,
		minTightHeight:minTightHeight,
		padding:padding,
		box:border,
		sf:sf,
		lineSpacingFactor:lineSpacingFactor,
		spacingStyle:lineSpacingStyle
	});

	if (ownCanvas == true) {
		input.textLoc = drawText.textLoc;
		input.breakPoints = drawText.breakPoints;
		input.tightRect = drawText.tightRect;
		input.totalTextWidth = drawText.totalTextWidth;
		input.maxWordWidth = drawText.maxWordWidth;
	}
	
	/*if (typeof input.drawPath == 'object') {
		if (input.tightRect[3] > input.drawPath.obj[0].height) {
			input.drawPath.obj[0].height = input.tightRect[3];
			input.varSize.maxHeight = input.tightRect[3];
			updateBorder(input.drawPath);
			drawCanvasPaths();
		}	
	}*/
	
	if (typeof input.varSize == 'object' && ownCanvas == true) {
		// resize cursor canvas
		if (typeof input.tightRect == 'object') {
			input.cursorData[100] = input.data[100] + input.tightRect[0];
			input.cursorData[101] = input.data[101] + input.tightRect[1];
			input.cursorData[102] = input.tightRect[2];
			input.cursorData[103] = input.tightRect[3];		
		} else {
			input.cursorData[100] = input.data[100];
			input.cursorData[101] = input.data[101];
			input.cursorData[102] = input.data[102];
			input.cursorData[103] = input.data[103];			
		}
		input.cursorCanvas.width = input.cursorData[102];
		input.cursorCanvas.height = input.cursorData[103];
		resizeCanvas(input.cursorCanvas,input.cursorData[100],input.cursorData[101],input.cursorData[102],input.cursorData[103]);
	}		
	
	if (!un(draw) && draw.drawMode == 'textEdit') {
		var obj = sel();
		if (obj.type == 'text' && obj.mathsInput.canvas == input.canvas) {
			if (input.cursorData[103] > obj.height || input.cursorData[102] > obj.width) {
				for (var i = 0; i < draw.path.length; i++) {
					if (draw.path[i].selected == true) {
						if (input.cursorData[103] > obj.height) obj.height = input.cursorData[103];
						if (input.cursorData[102] > obj.width) obj.width = input.cursorData[102];
						updateBorder(draw.path[i]);
					}
				}
			}
		}
		calcCursorPositions();
		drawSelectCanvas();		
	}
	//console.clear();
	//if (currMathsInput.id == 1)	console.log(currMathsInput.id,JSON.stringify(currMathsInput.richText));
}
function mathsInputAddChar(mInput,char) {
	if (un(mInput)) mInput = currMathsInput;
	// get last position
	var cursorPos = mInput.cursorMap[mInput.cursorMap.length-1];
	var loc = mInput.textLoc;	
	for (var aa = 0 ; aa < cursorPos.length; aa++) {
		loc = loc[cursorPos[aa]];
	}
	//console.log(cursorPos);
	
	var font,fontSize,color,bold,italic;
	arrayHandler(mInput.richText);
	var newLoc = drawMathsText(mInput.ctx,char,fontSize,loc.left,loc.top+0.5*loc.height,false,[],'left','middle',color,'draw','none',bold,italic,font,false,1).textLoc;

	var evalString = '';
	for (var aa = 0 ; aa < cursorPos.length-1; aa++) {
		evalString += '['+cursorPos[aa]+']';
	}
	eval('mInput.richText'+evalString+'=mInput.richText'+evalString+'+char');
	eval('mInput.textLoc'+evalString+'.push(newLoc[0][1])');
	cursorPos[cursorPos.length-1]++;
	mInput.cursorMap.push(cursorPos);
	
	//console.log(mInput);
	
	function markupTag(tag) {
		if (tag.indexOf('<<font:') == 0) {
			font = tag.slice(7,-2);
		} else if (tag.indexOf('<<fontSize:') == 0) {
			fontSize = Number(tag.slice(11,-2));
		} else if (tag.indexOf('<<color:') == 0) {
			color = tag.slice(8,-2);						
		} else if (tag.indexOf('<<bold:') == 0) {
			if (tag.indexOf('true') > -1) bold = true;
			if (tag.indexOf('false') > -1) bold = false;
		} else if (tag.indexOf('<<italic:') == 0) {
			if (tag.indexOf('true') > -1) italic = true;
			if (tag.indexOf('false') > -1) italic = false;
		}
	}
	function arrayHandler(arr) {
		//console.log(JSON.stringify(arr));
		for (var i = 0; i < arr.length; i++) {
			if (typeof arr[i] == 'object') {
				arrayHandler(arr[i]);							
			} else if (typeof arr[i] == 'string') {
				var splitText = splitMarkup(arr[i]);
				for (var splitElem = 0; splitElem < splitText.length; splitElem++) {
					if (splitText[splitElem].indexOf('<<') == 0 && splitText[splitElem].indexOf('<<br>>') !== 0) {
						markupTag(splitText[splitElem],true);
					}
				}					
			}
		}
	}		
}
function createJsString (angleMode) {
	if (typeof angleMode == 'undefined') {
		angleMode = currMathsInput.angleMode || 'deg';
	}

	var depth = 0;
	var jsArray = [''];
	var js = '';
	var algArray = [''];
	var alg = '';
	var exceptions = ['Math.pow','Math.sqrt','Math.PI','Math.sin','Math.cos','Math.tan','Math.asin','Math.acos','Math.atan','Math.e','Math.log','Math.abs','sin','cos','tan'];
	var position = [0];
		
	for (var p = 0; p < currMathsInput.richText.length; p++) {
		//console.log('Before ' + p + ' base element(s):', jsArray);
		subJS(currMathsInput.richText[p],true);
		position[depth]++;
		//console.log('After ' + p + ' base elements:', jsArray);
	}
	
	js = jsArray[0];
	alg = algArray[0];
	//console.log(js);
	
	function removeAllTagsFromString(str) {
		for (var char = str.length-1; char > -1; char--) {
			if (str.slice(char).indexOf('>>') == 0 && str.slice(char-1).indexOf('>>>') !== 0) {
				for (var char2 = char-2; char2 > -1; char2--) {
					if (str.slice(char2).indexOf('<<') == 0) {
						str = str.slice(0,char2) + str.slice(char+2);
						char = char2;
						break;	
					}
				}
			}
		}		
		return str;
	}
	
	function subJS(elem, addMultIfNecc) {
		if (typeof addMultIfNecc !== 'boolean') addMultIfNecc = true;
		//console.log('subJS', elem);
		if (typeof elem == 'string') {
			//console.log('string');
			var subText = replaceAll(elem, ' ', ''); // remove white space
			subText = removeAllTagsFromString(subText);

			subText = subText.replace(/\u00D7/g, '*'); // replace multiplications signs with *
			subText = subText.replace(/\u00F7/g, '/'); // replace division signs with /
			subText = subText.replace(/\u2264/g, '<='); // replace  signs with <=
			subText = subText.replace(/\u2265/g, '>='); // replace  signs with >=
			for (var c = 0; c < subText.length - 2; c++) {
				if (subText.slice(c).indexOf('sin') == 0 || subText.slice(c).indexOf('cos') == 0 || subText.slice(c).indexOf('tan') == 0) {
					if (subText.slice(c).indexOf('(') == 3) {
						if (angleMode == 'rad') {
							subText = subText.slice(0,c)+'Math.'+subText.slice(c);
							c += 5;
						} else {
							subText = subText.slice(0,c)+'Math.'+subText.slice(c,c+4)+'(Math.PI/180)*'+subText.slice(c+4);
							c += 19;
						}
					}
				}
			}
			subText = timesBeforeLetters(subText);
			// if following frac or power, add * if necessary
			if (addMultIfNecc == true && jsArray[depth] !== '' && elem !== '' && /[ \+\-\=\u00D7\u00F7\u2264\u2265\<\>\])]/.test(elem.charAt(0)) == false) subText = '*' + subText;
			jsArray[depth] += subText;
			algArray[depth] += subText;
			return;
		} else if (elem[0] == 'frac') {
			//console.log('frac');
			var subText = '';
			var subText2 = '';
			// if not proceeded by an operator, put a times sign in
			if (jsArray[depth] !== '' && /[\+\-\u00D7\u00F7\*\/\=\[(]/.test(jsArray[depth].slice(-1)) == false) subText += "*";
			depth++;
			position.push(0);
			jsArray[depth] = '';
			subJS(elem[1], false);
			jsArray[depth] = replaceAll(jsArray[depth], ' ', ''); // remove white space 
			subText += '((' + jsArray[depth] + ')/';
			subText2 += 'frac(' + jsArray[depth] + ',';
			jsArray[depth] = '';
			subJS(elem[2], false);
			jsArray[depth] = replaceAll(jsArray[depth], ' ', ''); // remove white space
			subText += '(' + jsArray[depth] + '))';
			subText2 += jsArray[depth] + ')';
			jsArray[depth] = '';
			depth--;
			position.pop();
			jsArray[depth] += subText;
			algArray[depth] += subText2;
			return;
		} else if (elem[0] == 'sqrt') {
			//console.log('sqrt');
			var subText = '';
			var subText2 = '';
			// if not proceeded by an operator, put a times sign in
			if (jsArray[depth] !== '' && /[\+\-\u00D7\u00F7\*\/\=\[(]/.test(jsArray[depth].slice(-1)) == false) subText += "*";
			depth++;
			position.push(0);
			jsArray[depth] = '';
			subJS(elem[1], false);
			jsArray[depth] = replaceAll(jsArray[depth], ' ', ''); // remove white space
			subText += 'Math.sqrt('+ jsArray[depth] +')';
			subText2 += 'sqrt('+jsArray[depth]+')';
			jsArray[depth] = '';
			depth--;
			position.pop();
			jsArray[depth] += subText;
			algArray[depth] += subText2;			
			return;
		} else if (elem[0] == 'root') {
			//console.log(elem[0]);
			var subText = '';
			var subText2 = '';
			// if not proceeded by an operator, put a times sign in
			if (jsArray[depth] !== '' && /[\+\-\u00D7\u00F7\*\/\=\[(]/.test(jsArray[depth].slice(-1)) == false) subText += "*";
			depth++;
			position.push(0);
			jsArray[depth] = '';
			subJS(elem[2], false);
			jsArray[depth] = replaceAll(jsArray[depth], ' ', ''); // remove white space
			subText += '(Math.pow('+jsArray[depth]+',';
			subText2 += 'root('+jsArray[depth]+',';
			jsArray[depth] = '';
			subJS(elem[1], false);
			jsArray[depth] = replaceAll(jsArray[depth], ' ', ''); // remove white space
			subText += '(1/('+jsArray[depth]+'))))';
			subText2 += jsArray[depth]+')';
			jsArray[depth] = '';
			depth--;
			position.pop();
			jsArray[depth] += subText;
			algArray[depth] += subText2;
			return;
		} else if (elem[0] == 'sin' || elem[0] == 'cos' || elem[0] == 'tan') {
			//console.log(elem[0]);
			var subText = '';
			// if not proceeded by an operator, put a times sign in
			if (jsArray[depth] !== '' && /[\+\-\u00D7\u00F7\*\/\=\[(]/.test(jsArray[depth].slice(-1)) == false) subText += "*";
			depth++;
			position.push(0);
			jsArray[depth] = '';
			subJS(elem[1], false);
			jsArray[depth] = replaceAll(jsArray[depth], ' ', ''); // remove white space
			var convertText1 = '';
			var convertText2 = '';
			if (angleMode == 'deg' || angleMode == 'degrees') {
				convertText1 = '(';
				convertText2 = ')*Math.PI/180';
			}
			subText += 'Math.'+ elem[0] +'('+convertText1+jsArray[depth]+convertText2+')';
			jsArray[depth] = '';
			depth--;
			position.pop();
			jsArray[depth] += subText;
			algArray[depth] += subText;
			return;
		} else if (elem[0] == 'sin-1' || elem[0] == 'cos-1' || elem[0] == 'tan-1') {
			//console.log(elem[0]);
			var subText = '';
			// if not proceeded by an operator, put a times sign in
			if (jsArray[depth] !== '' && /[\+\-\u00D7\u00F7\*\/\=\[(]/.test(jsArray[depth].slice(-1)) == false) subText += "*";
			depth++;
			position.push(0);
			jsArray[depth] = '';
			subJS(elem[1], false);
			jsArray[depth] = replaceAll(jsArray[depth], ' ', ''); // remove white space
			var convertText1 = '';
			var convertText2 = '';
			if (angleMode == 'deg' || angleMode == 'degrees') {
				convertText1 = '((';
				convertText2 = ')*180/Math.PI)';
			}
			subText += convertText1+'Math.a'+elem[0].slice(0,3)+'('+jsArray[depth]+')'+convertText2;;
			jsArray[depth] = '';
			depth--;
			position.pop();
			jsArray[depth] += subText;
			algArray[depth] += subText;			
			return;
		} else if (elem[0] == 'ln') {
			//console.log(elem[0]);
			var subText = '';
			// if not proceeded by an operator, put a times sign in
			if (jsArray[depth] !== '' && /[\+\-\u00D7\u00F7\*\/\=\[(]/.test(jsArray[depth].slice(-1)) == false) subText += "*";
			depth++;
			position.push(0);
			jsArray[depth] = '';
			subJS(elem[1], false);
			jsArray[depth] = replaceAll(jsArray[depth], ' ', ''); // remove white space
			subText += 'Math.log('+jsArray[depth]+')';
			jsArray[depth] = '';
			position.pop();
			depth--;
			jsArray[depth] += subText;
			algArray[depth] += subText;
			return;
		} else if (elem[0] == 'log') {
			//console.log(elem[0]);
			var subText = '';
			// if not proceeded by an operator, put a times sign in
			if (jsArray[depth] !== '' && /[\+\-\u00D7\u00F7\*\/\=\[(]/.test(jsArray[depth].slice(-1)) == false) subText += "*";
			depth++;
			position.push(0);
			jsArray[depth] = '';
			subJS(elem[1], false);
			jsArray[depth] = replaceAll(jsArray[depth], ' ', ''); // remove white space
			subText += '((Math.log('+jsArray[depth]+'))/(Math.log(10)))';
			jsArray[depth] = '';
			depth--;
			position.pop();
			jsArray[depth] += subText;
			algArray[depth] += subText;
			return;
		} else if (elem[0] == 'logBase') {
			//console.log(elem[0]);
			var subText = '';
			// if not proceeded by an operator, put a times sign in
			if (jsArray[depth] !== '' && /[\+\-\u00D7\u00F7\*\/\=\[(]/.test(jsArray[depth].slice(-1)) == false) subText += "*";
			depth++;
			position.push(0);		
			jsArray[depth] = '';
			subJS(elem[2], false);
			jsArray[depth] = replaceAll(jsArray[depth], ' ', ''); // remove white space
			subText += '((Math.log('+jsArray[depth]+'))/';
			jsArray[depth] = '';
			subJS(elem[1], false);
			jsArray[depth] = replaceAll(jsArray[depth], ' ', ''); // remove white space
			subText += '(Math.log('+jsArray[depth]+')))';
			jsArray[depth] = '';
			depth--;
			position.pop();
			jsArray[depth] += subText;
			algArray[depth] += subText;
			return;
		} else if (elem[0] == 'abs') {
			//console.log(elem[0]);
			var subText = '';
			// if not proceeded by an operator, put a times sign in
			if (jsArray[depth] !== '' && /[\+\-\u00D7\u00F7\*\/\=\[(]/.test(jsArray[depth].slice(-1)) == false) subText += "*";
			depth++;
			position.push(0);			
			jsArray[depth] = '';
			subJS(elem[1], false);
			jsArray[depth] = replaceAll(jsArray[depth], ' ', ''); // remove white space
			subText += 'Math.abs('+jsArray[depth]+')';
			jsArray[depth] = '';
			depth--;
			position.pop();
			jsArray[depth] += subText;
			algArray[depth] += subText;
			return;
		} else if (elem[0] == 'power' || elem[0] == 'pow') {
			//console.log('power');
		
			var baseSplitPoint = 0;
			var trigPower = false;
			//if the power is after a close bracket
			if (jsArray[depth] !== '') {
				if (jsArray[depth].charAt(jsArray[depth].length - 1) == ')') {
					var bracketCount = 1
					for (jsChar = jsArray[depth].length - 2; jsChar >= 0; jsChar--) {
						if (jsArray[depth].charAt(jsChar) == ')') {bracketCount++}
						if (jsArray[depth].charAt(jsChar) == '(') {bracketCount--}
						if (bracketCount == 0 && !baseSplitPoint) {
							baseSplitPoint = jsChar;
							break;
						}
					}
				//if the power is after sin, cos or tan
				
				} else if (jsArray[depth].slice(jsArray[depth].length-3) == 'sin' || jsArray[depth].slice(jsArray[depth].length-3) == 'coa' || jsArray[depth].slice(jsArray[depth].length-3) == 'tan') {
					trigPower = true;
				//if the power is after a letter
				} else if (/[A-Za-z]/g.test(jsArray[depth].charAt(jsArray[depth].length - 1)) == true) {
					baseSplitPoint = jsArray[depth].length - 1;
				//if the power is after a numerical digit
				} else if (/[0-9]/g.test(jsArray[depth].charAt(jsArray[depth].length - 1)) == true) {
					var decPoint = false;
					for (jsChar = jsArray[depth].length - 2; jsChar >= 0; jsChar--) {
						if (decPoint == false && jsArray[depth].charAt(jsChar) == '.') {
							decPoint = true;
						} else if (decPoint == true && jsArray[depth].charAt(jsChar) == '.') {
							baseSplitPoint = jsChar + 1;
							break;						
						} else if (/[0-9]/g.test(jsArray[depth].charAt(jsChar)) == false) {
							baseSplitPoint = jsChar + 1;
							break;
						}
					}
				} else {
					return ''; // error
				}
			}
			
			/*if (trigPower == true) {
				var power = elem[2];
				if (typeof power == 'string') {
					power = removeAllTagsFromString(power);
					console.log(power);
					if (power == '-1') {
						jsArray[depth] = jsArray[depth].slice(0,-3) + 'Math.a' + jsArray[depth].slice(-3);
					} else if (power == '2') {
						
					}
				}
				
			}*/

			var base = jsArray[depth].slice(baseSplitPoint);
			jsArray[depth] = jsArray[depth].slice(0, baseSplitPoint);
			depth++;
			position.push(0);			
			jsArray[depth] = '';
			subJS(elem[2], false)
			jsArray[depth] = replaceAll(jsArray[depth], ' ', '');
			if (trigPower == true) {
				console.log(jsArray,jsArray[depth-1],jsArray[depth]);
				if (jsArray[depth] == '-1') {
					jsArray[depth-1] = jsArray[depth-1].slice(0,-3) + 'Math.a' + jsArray[depth-1].slice(-3);
				}
			} else {
				var subText = 'Math.pow(' + base + ',' + jsArray[depth] + ')';
				var subText2 = base + '^' + jsArray[depth];
			}
			jsArray[depth] = '';
			depth--;
			position.pop();
			jsArray[depth] += subText;
			algArray[depth] += subText2;
			return;
		} else if (typeof elem == 'object') {
			//console.log('array');
			depth++;
			position.push(0);			
			jsArray[depth] = '';
			for (var sub = 0; sub < elem.length; sub++) {
				//console.log('depth:', depth);
				//console.log('Before ' + sub + ' sub element(s):', jsArray);
				subJS(elem[sub], addMultIfNecc);
				//console.log('After ' + sub + ' sub element(s):', jsArray);				
			}
			jsArray[depth-1] += jsArray[depth];
			algArray[depth-1] += algArray[depth];
			jsArray[depth] = '';
			depth--;
			position.pop();
			//console.log('endOfArray', jsArray);
			return;
		}
	}
	
	function timesBeforeLetters(testText) {
		// find instances of letters - if proceeded by a number, add *
		for (q = 0; q < testText.length; q++) {
			if (q > 0) {
				if (/[a-zA-Z]/g.test(testText.charAt(q)) == true && /[a-zA-Z0-9)]/.test(testText.charAt(q - 1)) == true) {
					testText = testText.slice(0, q) + '*' + testText.slice(q);
				}
				// if an open bracket is proceeded by a letter, number or ), add *
				if (/[\[(]/g.test(testText.charAt(q)) == true && testText.length > q && /[A-Za-z0-9)]/g.test(testText.charAt(q - 1)) == true) {
					testText = testText.slice(0, q) + '*' + testText.slice(q);
				}
			}
			for (var i = 0; i < exceptions.length; i++) {
				if (testText.slice(q).indexOf(exceptions[i]) == 0) {
					q += exceptions[i].length;
				}
			}
		}
		return testText;
	}
	var jsValue;
	try {
		jsValue = eval(js);
	} catch (err) {}
	return js;
}
function splitText(text) {
	// find split points in text string
	var splitPointCount = 0;
	var textSplitPoints = [];
	var delimiter = '%&^';
	for (i = 0; i <= text.length; i++) {
		var fracStartPos = text.substring(i, text.length).indexOf('frac(');
		var rootStartPos = text.substring(i, text.length).indexOf('root(');
		var powerStartPos = text.substring(i, text.length).indexOf('power(');
		if (fracStartPos !== -1) {fracStartPos += i};
		if (rootStartPos !== -1) {rootStartPos += i};
		if (powerStartPos !== -1) {powerStartPos += i};
		if (fracStartPos > -1 || rootStartPos > -1 || powerStartPos > -1) {
			textSplitPoints[splitPointCount] = [];
			if (fracStartPos == -1) {fracStartPos = 10000};
			if (rootStartPos == -1) {rootStartPos = 10000};
			if (powerStartPos == -1) {powerStartPos = 10000};
			textSplitPoints[splitPointCount][0] = Math.min(fracStartPos, rootStartPos, powerStartPos);
			var openBracketCount = 0;
			var closeBracketCount = 0;
			for (j = textSplitPoints[splitPointCount][0]; j <= text.length; j++) {
				if (!textSplitPoints[splitPointCount][1]) {
					if (text.charAt(j) == '(') {openBracketCount++};
					if (text.charAt(j) == ')') {closeBracketCount++};
					if (openBracketCount > 0 && (openBracketCount == closeBracketCount)) {
						textSplitPoints[splitPointCount][1] = j;
						i = j;
					}
				}
			}
			splitPointCount++;
		}
	}
	
	if (textSplitPoints.length == 0) {return text}
	
	for (i = 0; i < textSplitPoints.length; i++) {
		text = text.substring(0, textSplitPoints[i][0] + i * 2 * delimiter.length) + delimiter + text.substring(textSplitPoints[i][0] + i * 2 * delimiter.length, textSplitPoints[i][1] + 1 + i * 2 * delimiter.length) + delimiter + text.substring(textSplitPoints[i][1] + 1 + i * 2 * delimiter.length, text.length);
	}
	var splitArray = text.split(delimiter);
	var returnArray = [];
	for (i = 0; i < splitArray.length; i++) {
		var type = 0;
		if (splitArray[i].indexOf('frac(') == 0) {type = 'frac'};
		if (splitArray[i].indexOf('root(') == 0) {type = 'root'};
		if (splitArray[i].indexOf('power(') == 0) {type = 'power'};
		if (type == 0) {
			if (splitArray[i] !== '') {returnArray.push(splitArray[i])}
		} else {
			var subArray = [];
			subArray[0] = type;
			
			var params = splitArray[i].substring(type.length + 1, splitArray[i].length - 1);
			var openBracketCount = 0;
			var closeBracketCount = 0;
			var splitPoint = -1;
			
			// find split point of params
			for (j = 0; j <= params.length; j++) {
				if (params.charAt(j) == '(') {openBracketCount++};
				if (params.charAt(j) == ')') {closeBracketCount++};
				if (params.charAt(j) == ',' && (openBracketCount == closeBracketCount) && splitPoint == -1) {
					splitPoint = j;
				}
			}			
			subArray[1] = params.substring(0, splitPoint);
			subArray[2] = params.substring(splitPoint + 1, params.length).trim();
			returnArray.push(subArray)
		}
	}
	return returnArray;
}

/*! correcting-interval 2.0.0 | Copyright 2014 Andrew Duthie | MIT License */
/* jshint evil: true */
/* usage example:
var startTime = Date.now();
setCorrectingInterval(function() {
  console.log((Date.now() - startTime) + 'ms elapsed');
}, 1000);
*/
;(function(global, factory) {
  // Use UMD pattern to expose exported functions
  if (typeof exports === 'object') {
    // Expose to Node.js
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    // Expose to RequireJS
    define([], factory);
  }

  // Expose to global object (likely browser window)
  var exports = factory();
  for (var prop in exports) {
    global[prop] = exports[prop];
  }
}(this, function() {
  // Track running intervals
  var numIntervals = 0,
    intervals = {};

  // Polyfill Date.now
  var now = Date.now || function() {
    return new Date().valueOf();
  };

  var setCorrectingInterval = function(func, delay) {
    var id = numIntervals++,
      planned = now() + delay;

    // Normalize func as function
    switch (typeof func) {
      case 'function':
        break;
      case 'string':
        var sFunc = func;
        func = function() {
          eval(sFunc);
        };
        break;
      default:
        func = function() { };
    }

    function tick() {
      func();

      // Only re-register if clearCorrectingInterval was not called during function
      if (intervals[id]) {
        planned += delay;
        intervals[id] = setTimeout(tick, planned - now());
      }
    }

    intervals[id] = setTimeout(tick, delay);
    return id;
  };

  var clearCorrectingInterval = function(id) {
    clearTimeout(intervals[id]);
    delete intervals[id];
  };

  return {
    setCorrectingInterval: setCorrectingInterval,
    clearCorrectingInterval: clearCorrectingInterval
  };
}));
function logText(clearConsole) {
	var input = currMathsInput;
	if (clearConsole == true) console.clear();
	console.log('richText:',input.richText);
	console.log('cursorMap:');
	for (var i = 0; i < input.cursorMap.length; i++) {
		var char = input.richText;
		for (var j = 0; j < input.cursorMap[i].length - 1; j++) {char = char[input.cursorMap[i][j]];};
		// check for breakPoints
		var slicePos = input.cursorMap[i][input.cursorMap[i].length-1];
		if (typeof currMathsInput.breakPoints == 'object') {						
			var map = currMathsInput.cursorMap[i];						
			for (var k = 0; k < currMathsInput.breakPoints.length - 1; k++) {
				var iBreak = currMathsInput.allMap[currMathsInput.breakPoints[k]];
				if (iBreak[0] == map[0] && iBreak[1] < map[1]) {
					slicePos--;
				}
			}
		}
		var char1 = char.slice(slicePos-5,slicePos);
		var char2 = char.slice(slicePos,slicePos+5);
		if (i == input.cursorPos) {
			console.log('>'+i+':',input.cursorMap[i],char1,char2,'<<< cursorPos');			
		} else {
			console.log('>'+i+':',input.cursorMap[i],char1,char2);
		}
	}
}
function drawTextLocs() {
	for (var loc = 0; loc < currMathsInput.cursorMap.length; loc++) {
		var cursorPos = currMathsInput.cursorMap[loc];
		var evalString = 'currMathsInput.textLoc'
		for (aa = 0; aa < cursorPos.length; aa++) {
			evalString += '[' + cursorPos[aa] + ']';
		}
		var pos = eval(evalString);
		console.log(loc, pos.left);
		currMathsInput.ctx.strokeStyle = '#00F';
		currMathsInput.ctx.lineWidth = 2;
		currMathsInput.ctx.beginPath();
		currMathsInput.ctx.moveTo(pos.left,pos.top);
		currMathsInput.ctx.lineTo(pos.left,pos.top+pos.height);
		currMathsInput.ctx.closePath();
		currMathsInput.ctx.stroke();
	}
}
function isMouseOverText(mathsInput) {
	if (typeof mathsInput == 'undefined') mathsInput = currMathsInput;
	var locs = [];
	for (var i = 0; i < mathsInput.cursorMap.length; i++) {
		var textLoc = mathsInput.textLoc;
		for (var j = 0; j < mathsInput.cursorMap[i].length; j++) {textLoc = textLoc[mathsInput.cursorMap[i][j]];};
		locs.push(textLoc);
	}
	var left = mathsInput.data[100];
	var top = mathsInput.data[101];
	for (var i = 0; i < locs.length; i++) {
		if (mouse.x >= left + locs[i].left && mouse.x <= left + locs[i].left + locs[i].width && mouse.y >= top + locs[i].top && mouse.y <= top + locs[i].top + locs[i].height) {
			return true;	
		}
	}
	return false;
}


function splitMarkup(element) {
	// seperates markup tags from other text
	var splitAt = [0];
	for (var c = 0; c < element.length; c++) {
		if (element.slice(c).indexOf('<<') == 0 && element.slice(c).indexOf('<<<') !== 0) {
			for (var d = c; d < element.length; d++) {
				if (element.slice(d).indexOf('>>') == 0) {
					splitAt.push(c,d+2);
					break;
				}
			}
		} else if (element.slice(c).indexOf(br) == 0) {
			splitAt.push(c,c+1);
		}
	}
	splitAt.push(element.length);
	var returnArray = [];
	for (var c = 0; c < splitAt.length-1; c++) {
		returnArray.push(element.slice(splitAt[c],splitAt[c+1]))
	}
	return returnArray;
}
function reduceTags(textArray) {
	var bold = {value:null,char:true};
	var italic = {value:null,char:true};
	var fontSize = {value:null,char:true};	
	var font = {value:null,char:true};
	var color = {value:null,char:true};
	var backColor = {value:null,char:true};
	var align = {set:false};
	var selected = {value:null};
	
	function arrayHandler(arr) {
		for (var l = arr.length - 1; l >= 0; l--) {
			if (typeof arr[l] == 'string') {
				arr[l] = stringHandler(arr[l]);
			} else if (typeof arr[l] == 'object') {	
				arr[l] = arrayHandler(arr[l]);
			}
		}
		return arr;
	}
	
	function stringHandler(string) {
		// first split string into tag and non-tag elements
		var splitString = splitMarkup(string);
		
		// work backwards through the string looking for tags
		for (var j = splitString.length - 1; j >= 0; j--) {
			if (splitString[j].indexOf('<<') == 0) {
				for (var k = splitString[j].length; k >= 0; k--) {
					var slice = splitString[j].slice(k);
					if (slice.indexOf('<<bold:') == 0) {
						if (bold.char == false) {
							// no characters between tags - remove
							splitString[j] = splitString[j].slice(0,k)+splitString[j].slice(k+slice.indexOf('>>')+2);
						} else {
							var value = splitString[j].slice(k+7,k+splitString[j].slice(k).indexOf('>>')).toLowerCase();
							if (value == bold.value) {
								// repeated tag - !!
							} else {
								// new tag
								bold.value = value;
								bold.char = false;
							}
						}
					} else if (slice.indexOf('<<italic:') == 0) {
						if (italic.char == false) {
							// no characters between tags - remove
							splitString[j] = splitString[j].slice(0,k)+splitString[j].slice(k+slice.indexOf('>>')+2);
						} else {
							var value = splitString[j].slice(k+9,k+splitString[j].slice(k).indexOf('>>')).toLowerCase();
							if (value == italic.value) {
								// repeated tag
							} else {
								// new tag
								italic.value = value;
								italic.char = false;
							}
						}
					} else if (slice.indexOf('<<fontSize:') == 0) {
						if (fontSize.char == false) {
							// no characters between tags - remove
							splitString[j] = splitString[j].slice(0,k)+splitString[j].slice(k+slice.indexOf('>>')+2);
						} else {
							var value = splitString[j].slice(k+11,k+splitString[j].slice(k).indexOf('>>')).toLowerCase();
							if (value == fontSize.value) {
								// repeated tag
							} else {
								// new tag
								fontSize.value = value;
								fontSize.char = false;
							}
						}
					} else if (slice.indexOf('<<font:') == 0) {
						if (font.char == false) {
							// no characters between tags - remove
							splitString[j] = splitString[j].slice(0,k)+splitString[j].slice(k+slice.indexOf('>>')+2);
						} else {
							var value = splitString[j].slice(k+7,k+splitString[j].slice(k).indexOf('>>')).toLowerCase();
							if (value == font.value) {
								// repeated tag
							} else {
								// new tag
								font.value = value;
								font.char = false;
							}
						}						
					} else if (slice.indexOf('<<color:') == 0) {
						if (color.char == false) {
							// no characters between tags - remove
							splitString[j] = splitString[j].slice(0,k)+splitString[j].slice(k+slice.indexOf('>>')+2);
						} else {
							var value = splitString[j].slice(k+8,k+splitString[j].slice(k).indexOf('>>')).toLowerCase();
							if (value == color.value) {
								// repeated tag
							} else {
								// new tag
								color.value = value;
								color.char = false;
							}
						}						
					} else if (slice.indexOf('<<backColor:') == 0) {
						if (backColor.char == false) {
							// no characters between tags - remove
							splitString[j] = splitString[j].slice(0,k)+splitString[j].slice(k+slice.indexOf('>>')+2);
						} else {
							var value = splitString[j].slice(k+12,k+splitString[j].slice(k).indexOf('>>')).toLowerCase();
							if (value == backColor.value) {
								// repeated tag
							} else {
								// new tag
								backColor.value = value;
								backColor.char = false;
							}
						}						
					} else if (slice.indexOf('<<br>>') == 0 || slice.indexOf(br) == 0) {
						align.set = false;
					} else if (slice.indexOf('<<align:') == 0) {
						if (align.set == false) {
							align.set = true;
						} else {
							// remove tag
							splitString[j] = splitString[j].slice(0,k)+splitString[j].slice(k+slice.indexOf('>>')+2);
						}
					} else if (slice.indexOf('<<selected:') == 0) {
						var value = splitString[j].slice(k+11,k+splitString[j].slice(k).indexOf('>>')).toLowerCase();
						//console.log('selected tag',j,k,value,JSON.stringify(splitString[j]));
						if (value == selected.value) {
							// repeated tag
						} else {
							// new tag
							selected.value = value;
						}
					}					
					
				}
			} else {
				if (splitString[j].length > 0) {
					bold.char = true;
					italic.char = true;
					fontSize.char = true;
					font.char = true;
					color.char = true;
					backColor.char = true;
				}
			}
		}
		string = '';
		for (var j = 0; j < splitString.length; j++) string += splitString[j];
		return string;
	}

	if (typeof textArray == 'object') textArray = arrayHandler(textArray);
	//var arrayString = '';
	//console.log('reduceTags()1',JSON.stringify(textArray));
	textArray = combineSpaces2(textArray);
	
	// find any adjacent text blocks and combine them
	function combineSpaces2(textArray) {
		if (textArray.length > 1) {
			for (var gg = textArray.length - 1; gg >= 0; gg--) {
				if (typeof textArray[gg] == 'object') {
					//arrayString += '[' + gg + ']';
					combineSpaces2(textArray[gg]);
				} else {
					if (gg < textArray.length - 1 && typeof textArray[gg] == 'string' && typeof textArray[gg+1] == 'string') {
						eval('textArray[' + gg + '] += textArray[' + (gg+1) + ']');
						eval('textArray.splice(gg+1, 1);');
					}
				}
			}
		}
		//arrayString = arrayString.slice(0, arrayString.lastIndexOf('[') - arrayString.length);
		return textArray;
	}	

	//console.log('reduceTags()2',JSON.stringify(textArray));
	
	return textArray;
}