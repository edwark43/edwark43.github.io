// Javascipt document

if (un(window.draw)) var draw = {};

draw.questionLayout = {
	fix: function() {
		for (var p = 0; p < draw.path.length; p++) {
			var path = draw.path[p];
			for (var o = 0; o < path.obj.length; o++) {
				var obj = path.obj[o];
				if (obj.type === 'text2') {
					draw.questionLayout.fixTextUnderlining(obj);
					draw.questionLayout.splitTextByLines(obj);
				} else if (obj.type === 'table2') {
					draw.questionLayout.fixTableFormatting(obj);
				}
			}
		}
		var questionTextPaths = draw.questionLayout.getPageQuestionTextPaths();
		questionTextPaths.forEach(function(path) {
			var obj = path.obj[0];
			obj.rect[0] = 20;
			obj.rect[2] = 1160;
		});
		
		selectAllPaths();
		draw.questionLayout.add();
	},
	
	fixTableFormatting: function(obj) {
		var chars = 'abcdefghijklmnopqrstuvwxyz';
		if (un(obj._cells)) obj._cells = draw.table2.getAllCells(obj);
		var isQuestionTable = true;
		for (var c = 0; c < obj._cells.length; c++) {
			var cell = obj._cells[c];
			var startTags = textArrayGetStartTags(cell.text);
			var text1 = cell.text[0];
			text1 = text1.slice(startTags.length);
			if (chars.indexOf(text1[0]) > -1 && text1[1] === ")") {
				isQuestionTable = true;
				var char = text1[0];
				text1 = text1.slice(2);
				while (text1[0] === " " || text1[0] === tab) text1 = text1.slice(1);
				var tabs = tab;
				if ("fijl".indexOf(char) > -1) tabs += tab;
				cell.text[0] = startTags+char+')'+tabs+text1;
			} else {
				isQuestionTable = false;
			}
		}
		if (isQuestionTable === true) draw.questionLayout.fixTableWidth(obj);
	},
	fixTableWidth: function(obj) {
		var relatedPaths = [];
		var ansTable = false;
		for (var p = 0; p < draw.path.length; p++) {
			var path = draw.path[p];
			if (path === obj._path) continue;
			if (un(path._center)) updateBorder(path);
			
			if (!un(path.trigger) && path.trigger[0] === false && path.obj.length === 1 && path.obj[0].type === 'table2' && path.obj[0].widths.length === obj.widths.length && path.obj[0].heights.length === obj.heights.length && path._center[0] > obj.left && path._center[0] < obj.left+obj.width && path._center[1] > obj.top && path._center[1] < obj.top+obj.height) {
				ansTable = path.obj[0];
				continue;
			}
			
			if (path._center[0] < obj.left || path._center[0] > obj.left+obj.width || path._center[1] < obj.top || path._center[1] > obj.top+obj.height) continue;
			
			relatedPath = {r:0,c:0,offset:[0,0],path:path};

			var x = obj.left;
			for (var w = 0; w < obj.widths.length; w++) {
				if (path._center[0] > x && path._center[0] < x+obj.widths[w]) {
					relatedPath.c = w;
					relatedPath.offset[0] = path.tightBorder[0]-x;
					break;
				}
				x += obj.widths[w];
			}
			
			var y = obj.top;
			for (var h = 0; h < obj.heights.length; h++) {
				if (path._center[1] > y && path._center[1] < y+obj.heights[h]) {
					relatedPath.r = h;
					relatedPath.offset[1] = path.tightBorder[1]-y;
					break;
				}
				y += obj.heights[h];
			}
			
			
			
			relatedPaths.push(relatedPath);
		}
		
		obj.left = 80;
		obj.width = 1100;
		for (var w = 0; w < obj.widths.length; w++) {
			obj.widths[w] = 1100 / obj.widths.length;
		}
		updateBorder(obj._path);
		
		for (var p = 0; p < relatedPaths.length; p++) {
			var relatedPath = relatedPaths[p];
			var x = obj.left;
			for (var c = 0; c < relatedPath.c; c++) x += obj.widths[c];
			x += relatedPath.offset[0];
			var y = obj.top;
			for (var r = 0; r < relatedPath.r; r++) y += obj.heights[r];
			y += relatedPath.offset[1];
			positionPath(relatedPath.path,x,y);
		}
		if (ansTable !== false) {
			ansTable.widths = clone(obj.widths);
			ansTable.heights = clone(obj.heights);
		}
		
		drawCanvasPaths();
	},
	fixTextUnderlining: function(textObj) {
		textObj.ctx = draw.hiddenCanvas.ctx;
		var lineRects = text(textObj).lineRects;
		if (lineRects.length > 1) return;
		var line = false;
		var textPath = draw.getPathOfObj(textObj);
		updateBorder(textPath);
		var rect = textPath.border;
		for (var p = 0; p < draw.path.length; p++) {
			var path = draw.path[p];
			for (var o = 0; o < path.obj.length; o++) {
				var obj = path.obj[o];
				if (obj.type !== 'line') continue;
				if (Math.abs(obj.startPos[1] - obj.finPos[1]) > 0.5) continue;
				if (obj.startPos[0] < rect[0] || obj.startPos[0] > rect[0]+rect[2] || obj.startPos[1] < rect[1] || obj.startPos[1] > rect[1]+rect[3]) continue;
				if (obj.finPos[0] < rect[0] || obj.finPos[0] > rect[0]+rect[2] || obj.finPos[1] < rect[1]+0.5*rect[3] || obj.finPos[1] > rect[1]+rect[3]) continue;
				var line = true;
				path.obj.splice(o,1);
				if (path.obj.length === 0) draw.path.splice(p,1);
				p = draw.path.length;
				break;
			}
		}
		if (line === true) textObj.underline = true;		
	},
	splitTextByLines: function(obj) {
		if (!un(obj.box) && (obj.box.type === 'loose' || obj.box.type === 'tight')) return;
		if (!un(obj.font) && obj.font.toLowerCase() === "smileymonster") return;
		
		obj.ctx = draw.hiddenCanvas.ctx;
		var measure = text(obj);
		var rects = [];
		var newLine = true;
		for (var r = 0; r < measure.lineRects.length; r++) {
			var lineRect = measure.lineRects[r];
			if (lineRect[2] === 0) {
				newLine = true;
			} else if (newLine === true) {
				rects.push(lineRect);
				newLine = false;
			} else {
				var rect = rects.last();
				rect[2] = Math.max(rect[2],lineRect[2]);
				var bottom = lineRect[1]+lineRect[3];
				rect[3] = bottom-rect[1];
			}
		}		
		if (rects.length < 2) return;
		var lines = [[""]];
		
		for (var t = 0; t < obj.text.length; t++) {
			var element = obj.text[t];
			if (typeof element !== 'string') {
				lines.last().push(element);
			} else {
				var splitLines = element.split(br+br);
				for (var s = 0; s < splitLines.length; s++) {
					var splitLine = splitLines[s];
					if (splitLine.length === 0) continue;
					while (splitLine.indexOf(br) === 0) splitLine = splitLine.slice(1);
					lines.last().push(splitLine);
					lines.push([""]);
				}
				if (lines.last().length === 1 && lines.last()[0] === "") lines.pop();
			}
		}
		
		//console.log(lines);
			
		var pathIndex = draw.path.indexOf(obj._path);
		if (pathIndex === -1) pathIndex = draw.path.length-1;
		for (var l = 0; l < lines.length; l++) {
			var rect = rects[l];
			if (un(rects[l])) rect = [20,20,100,100];
			draw.path.splice(pathIndex+1,0,{
				obj:[{
					type:'text2',
					text:lines[l],
					rect:rects[l],
					fontSize:obj.fontSize || 28,
					font:obj.font || 'Arial',
					color:obj.color || '000',
					align:obj.align || [-1,-1],
					bold:obj.bold || false,
					italic:obj.italic || false
				}]
			});
		}
		draw.path.splice(pathIndex,1);
		
	},
	textToTable: function(obj) {
		var cells = [[{text:[""]}]];
		
		var lines = [[""]];
		
		for (var t = 0; t < obj.text.length; t++) {
			var element = obj.text[t];
			if (typeof element !== 'string') {
				lines.last().push(element);
			} else {
				var splitLines = element.split(br);
				for (var s = 0; s < splitLines.length; s++) {
					var splitLine = splitLines[s];
					while (splitLine.indexOf(br) === 0) splitLine = splitLine.slice(1);
					lines.last().push(splitLine);
					if (splitLines.length > 1 && s < splitLines.length-1) lines.push([""]);
				}
			}
		}
		
		//console.log(lines);
		
		var cells = [];
		for (var l = 0; l < lines.length; l++) {
			var line = lines[l];
			var row = [{text:[]}];
			
			for (var e = 0; e < line.length; e++) {
				var element = line[e];
				if (typeof element !== 'string') {
					row.last().text.push(element);
				} else {
					var splitString = element.split(tab+tab+tab);
					console.log(splitString);
					for (var s = 0; s < splitString.length; s++) {
						var splitStr = splitString[s];
						while (splitStr.indexOf(tab) === 0) splitStr = splitStr.slice(1);
						if (splitStr.length === 0) continue;
						if (splitString.length > 1) row.push({text:[]});
						row.last().text.push(splitStr);
					}
				}
			}
			
			cells.push(row);
		}
		
		//console.log(cells);
		var width = obj.rect[2];
		var height = obj.rect[3];
		var rows = cells.length;
		var cols = 0;
		for (var r = 0; r < rows; r++) cols = Math.max(cells[r].length);
		for (var r = 0; r < rows; r++) while (cells[r].length < cols) cells[r].push({text:[""]});
		var heights = [];
		for (var r = 0; r < rows; r++) heights.push(height/rows);
		var widths = [];
		for (var c = 0; c < cols; c++) widths.push(width/cols);
		
		for (var r = 0; r < rows; r++) {
			for (var c = 0; c < cols; c++) {
				cells[r][c].align = [-1,0];
			}
		}
		
		var table = {
			type:'table2',
			cells:cells,
			left:obj.rect[0],
			top:obj.rect[1],
			widths:widths,
			heights:heights,
			text: {
				font: 'Arial',
				size: 28,
				color: '#000'
			},
			outerBorder: {
				show: false,
				width: 4,
				color: '#000',
				dash: [0, 0]
			},
			innerBorder: {
				show: false,
				width: 2,
				color: '#666',
				dash: [0, 0]
			},
		}
		
		draw.path.push({
			obj: [table],
			selected: true
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
		
	},
	
	add: function () {
		deselectAllPaths(false);
		changeDrawMode();
		var questions = draw.questionLayout.getPageQuestions();
		var totalMinHeight = 0;
		for (var q = 0; q < questions.length; q++) {
			var question = questions[q];
			question.paths = draw.questionLayout.getPagePathsInRect([20,question.top,1160,question.height]);
			question.minHeight = draw.questionLayout.getQuestionMinHeight(question);
			totalMinHeight += question.minHeight;
		}
		draw.path.push({
			obj: [{
					type: 'questionLayout',
					left:20,
					width:1160,
					questions:questions,
					totalMinHeight:totalMinHeight
				}
			],
			selected: true
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
		calcCursorPositions();
	},
	draw: function (ctx, obj, path) {
		var rect = draw.questionLayout.getRect(obj);
		ctx.fillStyle = colorA('#FCC',0.5);
		for (var q = 0; q < obj.questions.length; q++) {
			var question = obj.questions[q];
			if (question.height > question.minHeight) {
				ctx.fillRect(rect[0],question.top+question.minHeight,rect[2],question.height-question.minHeight);
			}
		}
		ctx.lineWidth = 4;
		ctx.strokeStyle = '#F00';
		ctx.beginPath();
		for (var q = 1; q < obj.questions.length; q++) {
			var question = obj.questions[q];
			ctx.moveTo(obj.left,question.top);
			ctx.lineTo(obj.left+obj.width,question.top);
		}
		ctx.stroke();
		ctx.strokeRect(rect[0],rect[1],rect[2],rect[3]);
		
		text({
			ctx:ctx,
			text:['Distribute'],
			rect:[rect[0]+rect[2]-145,rect[1],145,55],
			align:[0,0],
			box:{"type":"loose","borderColor":"#F00","borderWidth":3,"radius":0,"color":"#FCC"},
			fontSize:28
		})
	},
	getRect: function (obj) {
		var top = obj.questions[0].top;
		var height = 0;
		for (var q = 0; q < obj.questions.length; q++) {
			var question = obj.questions[q];
			height += question.height;
		}
		return [obj.left,top,obj.width,height];
	},
	getPageQuestions: function() {
		var paths = draw.path;
		var questionTextPaths = draw.questionLayout.getPageQuestionTextPaths();
		var questions = [];
		for (var q = 0; q < questionTextPaths.length; q++) {
			var path = questionTextPaths[q];
			var obj = path.obj[0];
			
			var startTags = textArrayGetStartTags(obj.text);
			var text1 = obj.text[0];
			text1 = text1.slice(startTags.length);
			
			var questionNumber;
			if (!isNaN(Number(text1.slice(0,2)))) {
				questionNumber = Number(text1.slice(0,2));
			} else if (!isNaN(Number(text1.slice(0,1)))) {
				questionNumber = Number(text1.slice(0,1));
			}
			
			obj.ctx = draw.hiddenCanvas.ctx;
			var measure = text(obj);
			
			var top = measure.lineRects[0][1];
			
			questions.push({
				path:path,
				obj:obj,
				questionNumber:questionNumber,
				textMeasure:measure,
				top:top,
				height:0,
				paths:[]
			});
		}
		questions.sort(function(a,b) {
			return a.top-b.top;
		});
		for (var q = 0; q < questions.length; q++) {
			var question = questions[q];
			var nextTop = q < questions.length-1 ? questions[q+1].top : 1640;
			question.height = nextTop - question.top;
		}
		
		return questions;
	},
	getPageQuestionTextPaths: function() {
		var paths = draw.path;
		return paths.filter(function(path) {
			if (path.obj.length !== 1) return false;
			var obj = path.obj[0];
			if (obj.type !== 'text2') return false;
			var startTags = textArrayGetStartTags(obj.text);
			var text1 = obj.text[0];
			text1 = text1.slice(startTags.length);
			if (!isNaN(Number(text1[0])) && text1[1] === '.' && (text1[2] === tab || text1[2] === ' ')) {
				return true;
			} else if (!isNaN(Number(text1.slice(0,2))) && text1[2] === '.' && (text1[3] === tab || text1[3] === ' ')) {
				return true;
			} else {
				return false;
			}
		});
	},
	getPagePathsInRect: function(rect) {
		var paths = draw.path;
		return paths.filter(function(path) {
			if (path.obj[0].type === 'questionLayout') return false;
			var x = path.tightBorder[0]+0.5*path.tightBorder[2];
			var y = path.tightBorder[1]+0.5*path.tightBorder[3];
			if (rect[0] < x && x < rect[0]+rect[2] && rect[1] < y && y < rect[1]+rect[3]) return true;
			return false
		});
	},
	getQuestionMinHeight: function(question) {
		if (question.paths.length === 0) draw.questionLayout.getPagePathsInRect([20,question.top,1160,question.height]);
		if (question.paths.length === 0) return;
		var top, bottom;
		for (var p = 0; p < question.paths.length; p++) {
			var path = question.paths[p];
			if (!un(path.trigger) && path.trigger[0] === false) continue;
			if (un(top)) {
				top = path.tightBorder[1]
				bottom = path.tightBorder[1]+path.tightBorder[3];
			} else {
				top = Math.min(top,path.tightBorder[1]);
				bottom = Math.max(bottom,path.tightBorder[1]+path.tightBorder[3]);
			}
		}
		return bottom-top;
	},
	setQuestionPosition: function(question,top,height) {
		if (question.paths.length === 0) draw.questionLayout.getPagePathsInRect([20,question.top,1160,question.height]);
		var dy = top-question.top;
		for (var p = 0; p < question.paths.length; p++) {
			var path = question.paths[p];
			repositionPath(path,0,dy);
		}
		question.top = top;
		question.height = height;
	},
	distributeAllQuestions: function(obj) {
		if (un(obj)) {
			for (var p = 0; p < draw.path.length; p++) {
				var path = draw.path[p];
				for (var o = 0; o < path.obj.length; o++) {
					var obj2 = path.obj[o];
					if (obj2.type === 'questionLayout') {
						obj = obj2;
						p = draw.path.length;
						break;
					}
				}
			}
		}
		var totalMinHeight = 0;
		for (var q = 0; q < obj.questions.length; q++) {
			var question = obj.questions[q];
			question.paths = draw.questionLayout.getPagePathsInRect([20,question.top,1160,question.height]);
			question.minHeight = draw.questionLayout.getQuestionMinHeight(question);
			totalMinHeight += question.minHeight;
		}
		var top = obj.questions[0].top;
		var bottom = obj.questions.last().top+obj.questions.last().height;
		var questionPadding = (bottom-top-totalMinHeight) / obj.questions.length;
		//console.log(questionPadding);
		
		for (var q = 0; q < obj.questions.length; q++) {
			var question = obj.questions[q];
			//console.log(top);
			draw.questionLayout.setQuestionPosition(question,top,question.minHeight+questionPadding);
			top += question.minHeight+questionPadding;
		}
		
		drawCanvasPaths();
	},

	getCursorPositionsSelected: function (obj, pathNum) {
		var pos = [];
		for (var q = 0; q < obj.questions.length; q++) {
			var question = obj.questions[q];
			pos.push({
				shape: 'rect',
				dims: [20,question.top-10,1160,20],
				cursor: draw.cursors.ns,
				func: draw.questionLayout.dragVertStart,
				obj: obj,
				q:q,
				pathNum: pathNum,
				highlight: -1
			});
		}
		var rect = draw.questionLayout.getRect(obj);
		pos.push({
			shape: 'rect',
			dims: [20,rect[1]+rect[3]-10,1160,20],
			cursor: draw.cursors.ns,
			func: draw.questionLayout.dragBottomStart,
			obj: obj,
			pathNum: pathNum,
			highlight: -1
		});
		pos.push({
			shape: 'rect',
			dims: [rect[0]+rect[2]-145,rect[1],145,55],
			cursor: draw.cursors.pointer,
			func: draw.questionLayout.distributeAllQuestions,
			obj: obj,
			pathNum: pathNum,
			highlight: -1
		});
		return pos;
	},
	
	dragVertStart: function(e) {
		updateMouse(e);
		draw._drag = {
			obj:draw.currCursor.obj,
			q:draw.currCursor.q,
			offset:draw.mouse[1]-draw.currCursor.obj.questions[draw.currCursor.q].top
		}
		changeDrawMode('questionLayoutVert');
		//addListenerMove(window, draw.questionLayout.dragVertMove);
		//addListenerEnd(window, draw.questionLayout.dragVertStop);
		draw.animate(draw.questionLayout.dragVertMove,draw.questionLayout.dragVertStop,drawCanvasPaths);
	},
	dragVertMove: function(e) {
		updateMouse(e);
		var obj = draw._drag.obj;
		var q = draw._drag.q;
		var question = obj.questions[q];
		var top = draw.mouse[1];
		var nextTop = q < obj.questions.length-1 ? obj.questions[q+1].top : 1640;
		draw.questionLayout.setQuestionPosition(question,top,nextTop-top);
		//drawCanvasPaths();
	},
	dragVertStop: function() {
		//removeListenerMove(window, draw.questionLayout.dragVertMove);
		//removeListenerEnd(window, draw.questionLayout.dragVertStop);
		changeDrawMode('prev');
		delete draw._drag;
	},
	
	dragBottomStart: function(e) {
		updateMouse(e);
		draw._drag = {
			obj:draw.currCursor.obj
		}
		changeDrawMode('questionLayoutBottom');
		//addListenerMove(window, draw.questionLayout.dragBottomMove);
		//addListenerEnd(window, draw.questionLayout.dragBottomStop);		
		draw.animate(draw.questionLayout.dragBottomMove,draw.questionLayout.dragBottomStop,drawCanvasPaths);
	},
	dragBottomMove: function(e) {
		updateMouse(e);
		var obj = draw._drag.obj;
		var question = obj.questions.last();
		var y = draw.mouse[1];
		if (Math.abs(y-1640) < 20) y = 1640
		draw.questionLayout.setQuestionPosition(question,question.top,y-question.top);
		//drawCanvasPaths();
	},
	dragBottomStop: function() {
		//removeListenerMove(window, draw.questionLayout.dragBottomMove);
		//removeListenerEnd(window, draw.questionLayout.dragBottomStop);
		changeDrawMode('prev');
		delete draw._drag;
	}
	
}

draw.mixedPath = {
	groupPaths: function() {
		var selected = selPaths();
		if (selected.length < 2) return;
		var objs = [];
		for (var p = 0; p < selected.length; p++) {
			var path = selected[p];
			for (var o = 0; o < path.obj.length; o++) {
				var obj = path.obj[o];
				if (['line','angle','curve','curve2'].indexOf(obj.type) === -1) continue;
				objs.push(obj);
				path.obj.splice(o,1);
				o--;
			}
		}
		if (objs.length === 0) return;
		for (var p = 0; p < draw.path.length; p++) {
			if (draw.path[p].obj.length === 0) {
				draw.path.splice(p,1);
				p--;
			}
		}
		draw.path.push({
			obj:[{
				type:'mixedPath',
				color:draw.color,
				fillColor:draw.fillColor,
				lineWidth:draw.thickness,
				paths:objs
			}],
			selected:true
		});
		drawCanvasPaths();
	},
	ungroupPaths: function(obj) {
		if (un(obj)) obj = sel();
		var path = obj._path;
		var objs = obj.paths;
		for (var o = 0; o < objs.length; o++) {
			var obj2 = objs[o];
			draw.path.push({
				obj:[obj2],
				selected:true
			});
		}
		draw.path.splice(draw.path.indexOf(path),1);
		draw.updateAllBorders();
		drawCanvasPaths();
	},
	draw: function(ctx, obj, path) {
		ctx.beginPath();
		var prev = [];
		for (var p = 0; p < obj.paths.length; p++) {
			var obj2 = obj.paths[p];
			switch (obj2.type) {
				case 'line' :	
					if (!arraysEqual(prev,obj2.startPos)) ctx.moveTo(obj2.startPos[0], obj2.startPos[1]);
					ctx.lineTo(obj2.finPos[0], obj2.finPos[1]);
					prev = obj2.finPos;
					break;
				case 'angle' :
					if (obj2.clockwise === true) {
						obj2.a = pointAddVector(obj2.b,[Math.cos(obj2.angleA),Math.sin(obj2.angleA)],obj2.radius);
						obj2.c = pointAddVector(obj2.b,[Math.cos(obj2.angleC),Math.sin(obj2.angleC)],obj2.radius);
						if (!arraysEqual(prev,obj2.a)) ctx.moveTo(obj2.a[0], obj2.a[1]);					
						ctx.arc(obj2.b[0],obj2.b[1],obj2.radius,obj2.angleA,obj2.angleC,true);
						prev = obj2.c;
					} else {
						obj2.a = pointAddVector(obj2.b,[Math.cos(obj2.angleA),Math.sin(obj2.angleA)],obj2.radius);
						obj2.c = pointAddVector(obj2.b,[Math.cos(obj2.angleC),Math.sin(obj2.angleC)],obj2.radius);
						if (!arraysEqual(prev,obj2.a)) ctx.moveTo(obj2.a[0], obj2.a[1]);					
						ctx.arc(obj2.b[0],obj2.b[1],obj2.radius,obj2.angleA,obj2.angleC,false);
						prev = obj2.c;
					}
					break;
				case 'curve' :
					if (!arraysEqual(prev,obj2.startPos)) ctx.moveTo(obj2.startPos[0], obj2.startPos[1]);					
					ctx.quadraticCurveTo(obj2.controlPos[0], obj2.controlPos[1], obj2.finPos[0], obj2.finPos[1]);
					prev = obj2.finPos;
					break;
				case 'curve2' :
					if (!arraysEqual(prev,obj2.startPos)) ctx.moveTo(obj2.startPos[0], obj2.startPos[1]);					
					ctx.bezierCurveTo(obj2.controlPos1[0], obj2.controlPos1[1], obj2.controlPos2[0], obj2.controlPos2[1], obj2.finPos[0], obj2.finPos[1]);
					prev = obj2.finPos;
					break;
			}
		}
		
		if (obj.fillColor !== 'none') {
			ctx.fillStyle = obj.fillColor;
			ctx.fill();
		}
		if (obj.color !== 'none') {
			ctx.strokeStyle = obj.color;
			ctx.lineWidth = obj.lineWidth || draw.lineWidth;
			ctx.stroke();
		}
	},
	getRect: function(obj) {
		for (var p = 0; p < obj.paths.length; p++) {
			var obj2 = obj.paths[p];
			obj2._rect = draw[obj2.type].getRect(obj2);
			if (p === 0) {
				obj._left = obj2._rect[0];
				obj._top = obj2._rect[1];
				obj._right = obj2._rect[0]+obj2._rect[2];
				obj._bottom = obj2._rect[1]+obj2._rect[3];
			} else {
				obj._left = Math.min(obj._left,obj2._rect[0]);
				obj._top = Math.min(obj._top,obj2._rect[1]);
				obj._right = Math.max(obj._right,obj2._rect[0]+obj2._rect[2]);
				obj._bottom = Math.max(obj._bottom,obj2._rect[1]+obj2._rect[3]);
			}
		}
		obj._width = obj._right - obj._left;
		obj._height = obj._bottom - obj._top;
		return [obj._left, obj._top, obj._width, obj._height];
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		for (var p = 0; p < obj.paths.length; p++) {
			var obj2 = obj.paths[p];
			draw[obj2.type].changePosition(obj2, dl, dt, 0, 0);			
		}
	},
	setFillColor: function(obj,color) {
		obj.fillColor = color;
	},
	setLineColor: function(obj,color) {
		obj.color = color;
	},
	setLineWidth: function(obj,lineWidth) {
		obj.lineWidth = lineWidth;
	},
	getLineWidth: function(obj) {
		return obj.lineWidth;
	}
};

draw.protractor2 = {
	resizable: false,
	//allowQuickDraw: false,
	add: function () {
		deselectAllPaths();
		var obj = {
			type: 'protractor2',
			center: [600,500],
			radius: 250,
			angle: 0,
			color:'#CCF',
			opacity:0.25,
			numbers:true,
			button:[20,20],
			protractorVisible:true
		};
		draw.path.push({
			obj: [obj],
			selected: true
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
	},
	draw: function (ctx, obj, path) {
		
	},
	drawOverlay: function(ctx, obj, path) {
		if (!un(obj.button)) {
			ctx.translate(obj.button[0], obj.button[1]);
			var color = draw.buttonColor;
			if (obj.protractorVisible == true) color = draw.buttonSelectedColor;
			roundedRect(ctx, 3, 3, 49, 49, 8, 6, '#000', color);
			ctx.lineWidth = 1;
			ctx.strokeStyle = '#000';
			ctx.beginPath();
			ctx.moveTo(46.5, 35.5);
			ctx.lineTo(46.5, 37.5);
			ctx.lineTo(8.5, 37.5);
			ctx.lineTo(8.5, 34.5);
			ctx.arc(27.5, 34.5, 19, Math.PI, 2 * Math.PI);
			ctx.stroke();
			if (obj.protractorVisible == false) {
				ctx.fillStyle = '#CCF';
				ctx.fill();
				for (var i = 0; i < 7; i++) {
					ctx.moveTo(27.5 + 4 * Math.cos((1 + i / 6) * Math.PI), 34.5 + 4 * Math.sin((1 + i / 6) * Math.PI));
					ctx.lineTo(27.5 + 16 * Math.cos((1 + i / 6) * Math.PI), 34.5 + 16 * Math.sin((1 + i / 6) * Math.PI))
				}
				ctx.stroke();
				ctx.beginPath();
				ctx.arc(27.5, 34.5, 15, Math.PI, 2 * Math.PI);
				for (var i = 0; i < 19; i++) {
					ctx.moveTo(27.5 + 17 * Math.cos((1 + i / 18) * Math.PI), 34.5 + 17 * Math.sin((1 + i / 18) * Math.PI));
					ctx.lineTo(27.5 + 19 * Math.cos((1 + i / 18) * Math.PI), 34.5 + 19 * Math.sin((1 + i / 18) * Math.PI))
				}
				ctx.moveTo(27.5, 34.5);
				ctx.lineTo(27.5, 30.5);
				ctx.moveTo(23.5, 34.5);
				ctx.lineTo(31.5, 34.5);
				ctx.stroke();
			}
			ctx.translate(-obj.button[0], -obj.button[1]);
		}
		if (obj.protractorVisible !== false) {
			var rad = obj.radius;
			var center = obj.center;
			var color = obj.color;
			var angle = obj.angle;
			var opacity = obj.opacity;
			
			var radius = [0.12*rad,0.7*rad,0.8*rad,0.88*rad,0.92*rad,rad];
			var fontSize = rad / 20;
			var colorRGB = hexToRgb(color);
			
			ctx.save();
			ctx.translate(center[0],center[1]);
			ctx.rotate(angle);
			
			ctx.fillStyle = "rgba("+colorRGB.r+","+colorRGB.g+","+colorRGB.b+","+opacity+")";
			ctx.beginPath();
			ctx.moveTo(0-rad,0);
			ctx.arc(0,0,rad,Math.PI,2*Math.PI);
			ctx.lineTo(0+rad,0+0.04*rad);
			ctx.lineTo(0-rad,0+0.04*rad);
			ctx.lineTo(0-rad,0);
			ctx.fill();
			
			ctx.lineWidth = 1;
			ctx.strokeStyle = '#000';
			ctx.fillStyle = '#000';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.font = fontSize + 'px Arial';
			ctx.beginPath();
			ctx.moveTo(0-radius[0],0);
			ctx.arc(0,0,radius[0],Math.PI,2*Math.PI);

			ctx.moveTo(0-radius[0],0);
			ctx.lineTo(0+radius[0],0);

			var angle = Math.PI;
			if (boolean(obj.numbers,true) === true) {
				ctx.moveTo(0-radius[1],0);
				ctx.arc(0,0,radius[1],Math.PI,2*Math.PI);
				ctx.moveTo(0-radius[2],0);
				ctx.arc(0,0,radius[2],Math.PI,265*Math.PI/180);
				ctx.moveTo((0+radius[2]*Math.cos(275*Math.PI/180)),(0+radius[2]*Math.sin(275*Math.PI/180)));
				ctx.arc(0,0,radius[2],275*Math.PI/180,2*Math.PI);
				for (var i = 0; i < 181; i++) {
					if (i == 90) {
						ctx.moveTo(0,0+10);
						ctx.lineTo(0,0-radius[1]-7);
						ctx.moveTo(0,0-0.86*rad);
						ctx.lineTo(0,0-radius[5]);
						
						ctx.translate((0+0.8*rad*Math.cos(angle)),(0+0.8*rad*Math.sin(angle)));
						ctx.rotate(angle+0.5*Math.PI);
						var largerFont = 1.5 * fontSize; 
						ctx.font = largerFont + 'px Arial';
						ctx.fillText(90,0,0);
						ctx.font = fontSize + 'px Arial';
						ctx.rotate(-(angle+0.5*Math.PI));
						ctx.translate(-(0+0.8*rad*Math.cos(angle)),-(0+0.8*rad*Math.sin(angle)));		
					} else if (i % 10 == 0) {
						ctx.moveTo(0+radius[0]*Math.cos(angle),0+radius[0]*Math.sin(angle));
						ctx.lineTo(0+(radius[1]+3)*Math.cos(angle),0+(radius[1]+3)*Math.sin(angle));
						ctx.moveTo(0+(radius[2]-3)*Math.cos(angle),0+(radius[2]-3)*Math.sin(angle));
						ctx.lineTo(0+(radius[2]+3)*Math.cos(angle),0+(radius[2]+3)*Math.sin(angle));			
						ctx.moveTo(0+radius[3]*Math.cos(angle),0+radius[3]*Math.sin(angle));
						ctx.lineTo(0+radius[5]*Math.cos(angle),0+radius[5]*Math.sin(angle));
						
						ctx.translate((0+0.75*rad*Math.cos(angle)),(0+0.75*rad*Math.sin(angle)));
						ctx.rotate(angle+0.5*Math.PI);
						ctx.fillText(180-i,0,0);
						ctx.rotate(-(angle+0.5*Math.PI));
						ctx.translate(-(0+0.75*rad*Math.cos(angle)),-(0+0.75*rad*Math.sin(angle)));
						
						ctx.translate((0+0.845*rad*Math.cos(angle)),(0+0.845*rad*Math.sin(angle)));
						ctx.rotate(angle+0.5*Math.PI);
						ctx.fillText(i,0,0);
						ctx.rotate(-(angle+0.5*Math.PI));
						ctx.translate(-(0+0.845*rad*Math.cos(angle)),-(0+0.845*rad*Math.sin(angle)));
					} else if (i % 5 == 0) {
						ctx.moveTo(0+radius[3]*Math.cos(angle),0+radius[3]*Math.sin(angle));
						ctx.lineTo(0+radius[5]*Math.cos(angle),0+radius[5]*Math.sin(angle));
					} else {
						ctx.moveTo(0+radius[4]*Math.cos(angle),0+radius[4]*Math.sin(angle));
						ctx.lineTo(0+radius[5]*Math.cos(angle),0+radius[5]*Math.sin(angle));			
					}
					angle += Math.PI / 180;
				}
			} else {
				for (var i = 0; i < 181; i++) {
					if (i == 90) {
						ctx.moveTo(0,0+10);
						ctx.lineTo(0,0-radius[5]);	
					} else if (i % 10 == 0) {
						ctx.moveTo(0+radius[0]*Math.cos(angle),0+radius[0]*Math.sin(angle));;
						ctx.lineTo(0+radius[5]*Math.cos(angle),0+radius[5]*Math.sin(angle));
					} else if (i % 5 == 0) {
						ctx.moveTo(0+radius[3]*Math.cos(angle),0+radius[3]*Math.sin(angle));
						ctx.lineTo(0+radius[5]*Math.cos(angle),0+radius[5]*Math.sin(angle));
					} else {
						ctx.moveTo(0+radius[4]*Math.cos(angle),0+radius[4]*Math.sin(angle));
						ctx.lineTo(0+radius[5]*Math.cos(angle),0+radius[5]*Math.sin(angle));			
					}
					angle += Math.PI / 180;
				}
			}
			ctx.stroke();
			ctx.restore();
		}
	},
	getRect: function (obj) {
		if (!un(obj.button)) {
			return [obj.button[0],obj.button[1],55,55];
		} else {
			return [20,20,55,55];
		}
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.button[0] += dl;
		obj.button[1] += dt;
	},
	getCursorPositionsInteract: function (obj, path) {
		var pos = [];
		if (obj.protractorVisible === true) {
			pos.push({
				shape: 'sector',
				dims: [obj.center[0],obj.center[1],obj.radius,obj.angle+Math.PI,obj.angle+2*Math.PI],
				cursor: draw.cursors.move1,
				func: draw.protractor2.moveProtractorStart,
				interact: true,
				path: path,
				obj: obj
			});
			var x1 = obj.center[0]+0.5*obj.radius*Math.cos(obj.angle+Math.PI);
			var y1 = obj.center[1]+0.5*obj.radius*Math.sin(obj.angle+Math.PI);
			pos.push({
				shape: 'sector',
				dims: [x1,y1,obj.radius/2,obj.angle+Math.PI,obj.angle+(5/4)*Math.PI],
				cursor: draw.cursors.rotate,
				func: draw.protractor2.rotateProtractorStart,
				interact: true,
				path: path,
				obj: obj
			});
			var x2 = obj.center[0]+0.5*obj.radius*Math.cos(obj.angle);
			var y2 = obj.center[1]+0.5*obj.radius*Math.sin(obj.angle);
			pos.push({
				shape: 'sector',
				dims: [x2,y2,obj.radius/2,obj.angle+(7/4)*Math.PI,obj.angle+2*Math.PI],
				cursor: draw.cursors.rotate,
				func: draw.protractor2.rotateProtractorStart,
				interact: true,
				path: path,
				obj: obj
			});
		}
		if (!un(obj.button)) {
			pos.push({
				shape: 'rect',
				dims: [obj.button[0],obj.button[1],55,55],
				cursor: draw.cursors.pointer,
				func: draw.protractor2.toggleProtractorVisible,
				interact: true,
				path: path,
				obj: obj
			});
		}
		return pos;
	},
	getCursorPositionsSelected: function(obj, pathNum) {
		return [];
	},
	toggleProtractorVisible: function() {
		var obj = draw.currCursor.obj;
		obj.protractorVisible = !obj.protractorVisible;
		drawCanvasPaths();
	},
	moveProtractorStart: function() {
		var obj = draw.currCursor.obj;
		draw.movePathToFront(obj._path);
		draw._drag = {
			obj: obj,
			offset: [obj.center[0]-draw.mouse[0],obj.center[1]-draw.mouse[1]]
		};
		draw.animate(draw.protractor2.moveProtractorMove,draw.protractor2.moveProtractorStop,drawCanvasPaths);
		draw.cursorCanvas.style.cursor = draw.cursors.move2;
		draw.cursorOverride = draw.cursors.move2;
	},
	moveProtractorMove: function(e) {
		updateMouse(e);
		var obj = draw._drag.obj;
		var offset = draw._drag.offset;
		obj.center = [draw.mouse[0]+offset[0],draw.mouse[1]+offset[1]];
	},
	moveProtractorStop: function() {
		delete draw._drag;
		delete draw.cursorOverride;
		draw.cursorCanvas.style.cursor = draw.cursors.move1;
	},
	rotateProtractorStart: function() {
		var obj = draw.currCursor.obj;
		draw.movePathToFront(obj._path);
		draw._drag = {
			obj: obj,
			offsetAngle: getAngleTwoPoints(obj.center,draw.mouse)-obj.angle
		};
		draw.animate(draw.protractor2.rotateProtractorMove,draw.protractor2.rotateProtractorStop,drawCanvasPaths);
		draw.cursorCanvas.style.cursor = draw.cursors.rotate;
		draw.cursorOverride = draw.cursors.rotate;
	},
	rotateProtractorMove: function(e) {
		updateMouse(e);
		var obj = draw._drag.obj;
		obj.angle = getAngleTwoPoints(obj.center,draw.mouse)-draw._drag.offsetAngle;
	},
	rotateProtractorStop: function() {
		delete draw._drag;
		delete draw.cursorOverride;
	}
}
draw.ruler2 = {
	resizable: false,
	//allowQuickDraw: false,
	add: function () {
		deselectAllPaths();
		var obj = {
			type: 'ruler2',
			rect:[200,300,800,100],
			angle:0,
			color:'#CCF',
			opacity:0.25,
			markings:true,
			button:[20,20],
			rulerVisible:true			
		};
		draw.path.push({
			obj: [obj],
			selected: true
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
	},
	draw: function (ctx, obj, path) {
	},
	drawOverlay: function(ctx, obj, path) {
		if (!un(obj.button)) {
			ctx.translate(obj.button[0], obj.button[1]);		
			var color = obj.rulerVisible == true ? draw.buttonSelectedColor : draw.buttonColor;
			roundedRect(ctx,3,3,49,49,8,6,'#000',color);
			if (obj.rulerVisible == true) {
				roundedRect(ctx,7.5,22.5,40,10,3,1,'#000');
			} else {
				roundedRect(ctx,7.5,22.5,40,10,3,1,'#000','#CCF');
				if (obj.markings == true) {
					ctx.lineWidth = 1;
					ctx.strokeStyle = '#000';
					ctx.beginPath();
					for (var i = 0; i < 11; i++) {
						ctx.moveTo(9.5+i*(36/10),22.5);
						ctx.lineTo(9.5+i*(36/10),26.5);				
					}
					ctx.stroke();
				}
			}
			ctx.translate(-obj.button[0], -obj.button[1]);
		}
		if (obj.rulerVisible !== false) {
			var left = obj.rect[0];
			var top = obj.rect[1];
			var width = obj.rect[3];
			var length = obj.rect[2];
			var color = obj.color;
			var opacity = obj.opacity;	
			var angle = obj.angle;
			
			var fontSize = width / 6;
			
			ctx.save();
			ctx.translate(left, top);
			ctx.rotate(angle);
			ctx.beginPath();
			
			var colorRGB = hexToRgb(color);
			ctx.fillStyle = "rgba("+colorRGB.r+","+colorRGB.g+","+colorRGB.b+","+opacity+")";
			roundedRect(ctx, 0, 0, length, width, 8, 1, "rgba(0,0,0,0)", "rgba("+colorRGB.r+","+colorRGB.g+","+colorRGB.b+","+opacity+")");

			if (obj.markings == true) {
				var xPos = length * 0.02;
				var dx = (length * 0.96) / 150;
				
				ctx.lineWidth = 1;
				ctx.strokeStyle = '#000';
				ctx.fillStyle = '#000';
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.font = fontSize + 'px Arial';
				for (var dCount = 0; dCount <= 150; dCount++) {
					ctx.beginPath();
					ctx.moveTo(xPos,0);
					if (dCount % 10 == 0) {
						ctx.lineTo(xPos,0.22*width);
						ctx.fillText(Math.round(0.1*dCount),xPos,0.32*width);
					} else if (dCount % 5 == 0) {
						ctx.lineTo(xPos,0.16*width);
					} else {
						ctx.lineTo(xPos,0.1*width);
					}
					ctx.stroke();
					xPos += dx;
				}
				ctx.beginPath();
				ctx.moveTo(length*0.5,0.5*width);
				ctx.lineTo(length*0.51,0.6*width);
				ctx.lineTo(length*0.49,0.6*width);
				ctx.lineTo(length*0.5,0.5*width);
				ctx.fill();
			}
			ctx.restore();
		}	
	},
	getRect: function (obj) {
		if (!un(obj.button)) {
			return [obj.button[0],obj.button[1],55,55];
		} else {
			return [20,20,55,55];
		}
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.button[0] += dl;
		obj.button[1] += dt;
	},
	getCursorPositionsInteract: function (obj, path) {
		var pos = [];
		if (obj.rulerVisible === true) {
			var left = obj.rect[0];
			var top = obj.rect[1];
			var width = obj.rect[3];
			var length = obj.rect[2];
			var angle = obj.angle;
			obj._centerX1 = left+0.02*length*Math.cos(angle);
			obj._centerY1 = top+0.02*length*Math.sin(angle);	
			obj._centerX2 = left+0.98*length*Math.cos(angle);
			obj._centerY2 = top+0.98*length*Math.sin(angle);	
			obj._verticesArray1 = [
				[left,top],
				[left+length*Math.cos(angle),top+length*Math.sin(angle)],
				[left+length*Math.cos(angle)-width*Math.sin(angle),top+length*Math.sin(angle)+width*Math.cos(angle)],
				[left-width*Math.sin(angle),top+width*Math.cos(angle)]
			];
			obj._verticesArray2 = [
				[left,top],
				[left+0.1*length*Math.cos(angle),top+0.1*length*Math.sin(angle)],
				[left-width*Math.sin(angle)+0.1*length*Math.cos(angle),top+width*Math.cos(angle)+0.1*length*Math.sin(angle)],
				[left-width*Math.sin(angle),top+width*Math.cos(angle)]
			];
			obj._verticesArray3 = [
				[left+length*Math.cos(angle)-0.1*length*Math.cos(angle),top+length*Math.sin(angle)-0.1*length*Math.sin(angle)],
				[left+length*Math.cos(angle),top+length*Math.sin(angle)],
				[left+length*Math.cos(angle)-width*Math.sin(angle),top+length*Math.sin(angle)+width*Math.cos(angle)],
				[left+length*Math.cos(angle)-width*Math.sin(angle)-0.1*length*Math.cos(angle),top+length*Math.sin(angle)+width*Math.cos(angle)-0.1*length*Math.sin(angle)]
			];
			obj._center = [
				left+0.5*length*Math.cos(angle)-0.5*width*Math.sin(angle),
				top+0.5*length*Math.sin(angle)+0.5*width*Math.cos(angle)
			];
			obj._centerRel = [
				0.5*length*Math.cos(angle)-0.5*width*Math.sin(angle),
				0.5*length*Math.sin(angle)+0.5*width*Math.cos(angle)
			];
			
			obj._verticesArray4 = [
				[left+40*Math.sin(angle),top-40*Math.cos(angle)],
				[left+length*Math.cos(angle)+40*Math.sin(angle),top+length*Math.sin(angle)-40*Math.cos(angle)],
				[left+length*Math.cos(angle),top+length*Math.sin(angle)],
				[left,top]
			];
			if (obj.markings == true) {
				obj._edgePos1 = [
					left+0.02*length*Math.cos(angle)+(0.5*draw.thickness+2)*Math.sin(angle),
					top+0.02*length*Math.sin(angle)-(0.5*draw.thickness+2)*Math.cos(angle)
				];
				obj._edgePos2 = [
					left+0.98*length*Math.cos(angle)+(0.5*draw.thickness+2)*Math.sin(angle),
					top+0.98*length*Math.sin(angle)-(0.5*draw.thickness+2)*Math.cos(angle)
				];
			} else {
				obj._edgePos1 = [
					left+(0.5*draw.thickness+2)*Math.sin(angle),
					top-(0.5*draw.thickness+2)*Math.cos(angle)
				];
				obj._edgePos2 = [
					left+length*Math.cos(angle)+(0.5*draw.thickness+2)*Math.sin(angle),
					top+length*Math.sin(angle)-(0.5*draw.thickness+2)*Math.cos(angle)
				];
			}
			
			obj._verticesArray5 = [
				[left-width*Math.sin(angle)-40*Math.sin(angle),top+width*Math.cos(angle)+40*Math.cos(angle)],
				[left+length*Math.cos(angle)-width*Math.sin(angle)-40*Math.sin(angle),top+length*Math.sin(angle)+width*Math.cos(angle)+40*Math.cos(angle)],
				[left+length*Math.cos(angle)-width*Math.sin(angle),top+length*Math.sin(angle)+width*Math.cos(angle)],
				[left-width*Math.sin(angle),top+width*Math.cos(angle)],
			];
			obj._edgePos3 = [
				left-width*Math.sin(angle)-(0.5*draw.thickness+2)*Math.sin(angle),
				top+width*Math.cos(angle)+(0.5*draw.thickness+2)*Math.cos(angle)
			];
			obj._edgePos4 = [
				left+length*Math.cos(angle)-width*Math.sin(angle)-(0.5*draw.thickness+2)*Math.sin(angle),
				top+length*Math.sin(angle)+width*Math.cos(angle)+(0.5*draw.thickness+2)*Math.cos(angle)
			];	
			var canvas = draw.hiddenCanvas;
			var ctx = draw.hiddenCanvas.ctx;
			var size = 50;
			canvas.width = size;
			canvas.height = size;
			
			ctx.clearRect(0,0,50,50);
			ctx.translate(25,25);
			ctx.rotate(obj.angle);
				ctx.fillStyle = draw.color;
				ctx.fillRect(-5,-11,10,20);
				ctx.fillRect(-5,-18,10,5);
				ctx.beginPath();
				ctx.moveTo(-5,11);
				ctx.lineTo(0,18);
				ctx.lineTo(5,11);
				ctx.lineTo(-5,11);
				ctx.fill();		
			ctx.rotate(-obj.angle);	
			ctx.translate(-25,-25);

			obj._penCursor1 = 'url("'+canvas.toDataURL()+'") '+(25-18*Math.sin(obj.angle))+', '+(25+18*Math.cos(obj.angle))+', auto';
			
			ctx.clearRect(0,0,50,50);
			ctx.translate(25,25);
			ctx.rotate(Math.PI+obj.angle);
				ctx.fillStyle = draw.color;
				ctx.fillRect(-5,-11,10,20);
				ctx.fillRect(-5,-18,10,5);
				ctx.beginPath();
				ctx.moveTo(-5,11);
				ctx.lineTo(0,18);
				ctx.lineTo(5,11);
				ctx.lineTo(-5,11);
				ctx.fill();		
			ctx.rotate(-Math.PI-obj.angle);	
			ctx.translate(-25,-25);
	
			obj._penCursor2 = 'url("'+canvas.toDataURL()+'") '+(25-18*Math.sin(Math.PI+obj.angle))+', '+(25+18*Math.cos(Math.PI+obj.angle))+', auto';

			pos.push({
				shape: 'polygon',
				dims: obj._verticesArray1,
				cursor: draw.cursors.move1,
				func: draw.ruler2.moveRulerStart,
				interact: true,
				path: path,
				obj: obj
			});
			pos.push({
				shape: 'polygon',
				dims: obj._verticesArray2,
				cursor: draw.cursors.rotate,
				func: draw.ruler2.rotateRulerStart1,
				interact: true,
				path: path,
				obj: obj
			});
			pos.push({
				shape: 'polygon',
				dims: obj._verticesArray3,
				cursor: draw.cursors.rotate,
				func: draw.ruler2.rotateRulerStart2,
				interact: true,
				path: path,
				obj: obj
			});
			if (obj.markings === true) {		
				pos.push({
					shape: 'circle',
					dims: [obj._center[0],obj._center[1],25],
					cursor: draw.cursors.pointer,
					func: draw.ruler2.rotateRuler180,
					interact: true,
					path: path,
					obj: obj
				});
			}
			pos.push({
				shape: 'polygon',
				dims: obj._verticesArray4,
				//cursor: obj._penCursor1,
				cursor: draw.cursors.pen,
				func: draw.ruler2.drawRulerStart1,
				interact: true,
				path: path,
				obj: obj
			});
			pos.push({
				shape: 'polygon',
				dims: obj._verticesArray5,
				//cursor: obj._penCursor2,
				cursor: draw.cursors.pen,
				func: draw.ruler2.drawRulerStart2,
				interact: true,
				path: path,
				obj: obj
			});
			
		}
		if (!un(obj.button)) {
			pos.push({
				shape: 'rect',
				dims: [obj.button[0],obj.button[1],55,55],
				cursor: draw.cursors.pointer,
				func: draw.ruler2.toggleRulerVisible,
				interact: true,
				path: path,
				obj: obj
			});
		}
		return pos;
	},
	getCursorPositionsSelected: function(obj, pathNum) {
		return [];
	},
	toggleRulerVisible: function() {
		var obj = draw.currCursor.obj;
		obj.rulerVisible = !obj.rulerVisible;
		drawCanvasPaths();
	},
	moveRulerStart: function() {
		var obj = draw.currCursor.obj;
		draw.movePathToFront(obj._path);
		draw._drag = {
			obj: obj,
			offset: [obj.rect[0]-draw.mouse[0],obj.rect[1]-draw.mouse[1]]
		};
		draw.animate(draw.ruler2.moveRulerMove,draw.ruler2.moveRulerStop,drawCanvasPaths);
		draw.cursorCanvas.style.cursor = draw.cursors.move2;
		draw.cursorOverride = draw.cursors.move2;
	},
	moveRulerMove: function(e) {
		updateMouse(e);
		var obj = draw._drag.obj;
		var offset = draw._drag.offset;
		obj.rect[0] = draw.mouse[0]+offset[0];
		obj.rect[1] = draw.mouse[1]+offset[1];
	},
	moveRulerStop: function() {
		delete draw._drag;
		draw.cursorCanvas.style.cursor = draw.cursors.move1;
		delete draw.cursorOverride;
	},
	rotateRulerStart1: function() {
		var obj = draw.currCursor.obj;
		draw.movePathToFront(obj._path);
		draw._drag = {
			obj: obj,
			prevX: draw.mouse[0],
			prevY: draw.mouse[1]
		};
		draw.animate(draw.ruler2.rotateRulerMove1,draw.ruler2.rotateRulerStop,drawCanvasPaths);
		draw.cursorCanvas.style.cursor = draw.cursors.rotate;
		draw.cursorOverride = draw.cursors.rotate;
	},
	rotateRulerMove1: function(e) {
		updateMouse(e);		
		var obj = draw._drag.obj;
			
		obj._centerX2 = obj.rect[0]+0.98*obj.rect[2]*Math.cos(obj.angle);
		obj._centerY2 = obj.rect[1]+0.98*obj.rect[2]*Math.sin(obj.angle);
				
		dAngle = measureAngle({c:draw.mouse,b:[obj._centerX2,obj._centerY2],a:[draw._drag.prevX,draw._drag.prevY],angleType:'radians'});
		obj.angle += dAngle;
		obj.rect[0] = obj._centerX2 - 0.98*obj.rect[2]*Math.cos(obj.angle);
		obj.rect[1] = obj._centerY2 - 0.98*obj.rect[2]*Math.sin(obj.angle);
		
		draw._drag.prevX = draw.mouse[0];
		draw._drag.prevY = draw.mouse[1];
	},
	rotateRulerStart2: function() {
		var obj = draw.currCursor.obj;
		draw.movePathToFront(obj._path);
		draw._drag = {
			obj: obj,
			prevX: draw.mouse[0],
			prevY: draw.mouse[1]
		};
		draw.animate(draw.ruler2.rotateRulerMove2,draw.ruler2.rotateRulerStop,drawCanvasPaths);
		draw.cursorCanvas.style.cursor = draw.cursors.rotate;
		draw.cursorOverride = draw.cursors.rotate;
	},
	rotateRulerMove2: function(e) {
		updateMouse(e);		
		var obj = draw._drag.obj;
		
		obj._centerX1 = obj.rect[0]+0.02*obj.rect[2]*Math.cos(obj.angle);
		obj._centerY1 = obj.rect[1]+0.02*obj.rect[2]*Math.sin(obj.angle);
		
		obj.angle += measureAngle({c:draw.mouse,b:[obj._centerX1,obj._centerY1],a:[draw._drag.prevX,draw._drag.prevY],angleType:'radians'});
		
		draw._drag.prevX = draw.mouse[0];
		draw._drag.prevY = draw.mouse[1];
	},
	rotateRulerStop: function() {
		delete draw._drag;
		delete draw.cursorOverride;
	},
	rotateRuler180: function() {
		var obj = draw.currCursor.obj;
		draw.movePathToFront(obj._path);
		obj.angle += Math.PI;
		obj.rect[0] += 2*obj._centerRel[0];
		obj.rect[1] += 2*obj._centerRel[1];
		drawCanvasPaths();
	},
	drawRulerStart1: function() {
		var obj = draw.currCursor.obj;
		draw.movePathToFront(obj._path);		
		draw.drawing = true;
		var pos = closestPointOnLineSegment(draw.mouse,obj._edgePos1,obj._edgePos2);
		var line = {
			type:'line',
			color:draw.color,
			thickness:draw.thickness,
			startPos:pos,
			finPos:pos
		};
		if (!un(draw.dash) && draw.dash.length > 0) line.dash = clone(draw.dash);	
		draw.path.push({obj:[line],selected:false});
		draw._drag = {
			obj: obj,
			line: line
		};
		draw.animate(draw.ruler2.drawRulerMove1,draw.ruler2.drawRulerStop,drawCanvasPaths);
		draw.cursorCanvas.style.cursor = draw.currCursor.cursor;
		draw.cursorOverride = draw.currCursor.cursor;
	},
	drawRulerStart2: function() {
		var obj = draw.currCursor.obj;
		draw.movePathToFront(obj._path);		
		draw.drawing = true;
		var pos = closestPointOnLineSegment(draw.mouse,obj._edgePos3,obj._edgePos4);
		var line = {
			type:'line',
			color:draw.color,
			thickness:draw.thickness,
			startPos:pos,
			finPos:pos
		};
		if (!un(draw.dash) && draw.dash.length > 0) line.dash = clone(draw.dash);	
		draw.path.push({obj:[line],selected:false});
		draw._drag = {
			obj: obj,
			line: line
		};
		draw.animate(draw.ruler2.drawRulerMove2,draw.ruler2.drawRulerStop,drawCanvasPaths);
		draw.cursorCanvas.style.cursor = draw.currCursor.cursor;
		draw.cursorOverride = draw.currCursor.cursor;
	},
	drawRulerMove1: function(e) {
		updateMouse(e);		
		var obj = draw._drag.obj;	
		draw._drag.line.finPos = closestPointOnLineSegment(draw.mouse,obj._edgePos1,obj._edgePos2);
	},
	drawRulerMove2: function(e) {
		updateMouse(e);		
		var obj = draw._drag.obj;
		draw._drag.line.finPos = closestPointOnLineSegment(draw.mouse,obj._edgePos3,obj._edgePos4);		
	},
	drawRulerStop: function() {
		delete draw._drag;
		delete draw.cursorOverride;
		draw.drawing = false;
		drawCanvasPaths();
		calcCursorPositions();
		lineDrawStop();
	}
}
draw.compass2 = {
	resizable: false,
	//allowQuickDraw: false,
	add: function () {
		deselectAllPaths();
		var obj = {
			type: 'compass2',
			armLength:250,
			radius:150,
			angle:0,
			center1:[500,450],
			radiusLocked:false,
			compassVisible:true,
			button:[20,20],
		};
		draw.path.push({
			obj: [obj],
			selected: true
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
	},
	draw: function (ctx, obj, path) {
	},
	drawOverlay: function(ctx, obj, path) {
		if (!un(obj.button)) {
			ctx.translate(obj.button[0], obj.button[1]);		
			var color = obj.compassVisible == true ? draw.buttonSelectedColor : draw.buttonColor;
			roundedRect(ctx,3,3,49,49,8,6,'#000',color);

			ctx.lineWidth = 1;
			ctx.strokeStyle = '#000';

			var center1 = [13, 45];
			var center2 = [26, 15];
			var center3 = [40, 45];
			var armLength = Math.sqrt(Math.pow(0.5 * (center3[0] - center1[0]), 2) + Math.pow(center2[1] - center1[1], 2));

			var angle2 = -0.5 * Math.PI - Math.atan((center2[1] - center1[1]) / (center2[0] - center1[0]));
			var angle3 = 0.5 * Math.PI - Math.atan((center3[1] - center2[1]) / (center3[0] - center2[0]));

			// draw pointy arm
			ctx.translate(center2[0], center2[1]);
			ctx.rotate(-angle2);

			if (draw.compassVisible) {
				roundedRect(ctx, -2, 0, 4, armLength - 5, 1, 1, '#000');
			} else {
				roundedRect(ctx, -2, 0, 4, armLength - 5, 1, 1, '#000', '#99F');
			}
			ctx.strokeStyle = '#000';
			ctx.lineWidth = 0.5;
			ctx.beginPath();
			ctx.moveTo(-1, armLength - 5);
			ctx.lineTo(0, armLength);
			ctx.lineTo(1, armLength - 5);
			ctx.lineTo(-1, armLength - 5);
			ctx.stroke();
			if (draw.compassVisible) {
				ctx.fillStyle = '#333';
				ctx.fill();
			}

			ctx.rotate(angle2);
			ctx.translate(-center2[0], -center2[1]);

			//draw pencil
			ctx.beginPath();
			ctx.strokeStyle = '#000';
			ctx.lineWidth = 1;
			ctx.moveTo(40, 45);
			ctx.lineTo(38, 42);
			ctx.lineTo(38, 25);
			ctx.lineTo(42, 25);
			ctx.lineTo(42, 42);
			ctx.lineTo(40, 45);
			if (!draw.compassVisible) {
				if (draw.color == '#000') {
					ctx.fillStyle = '#FC3';
				} else {
					ctx.fillStyle = draw.color;
				}
				ctx.fill();
			}
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(40, 45);
			ctx.lineTo(38, 42);
			ctx.lineTo(42, 42);
			ctx.lineTo(40, 45);
			if (!draw.compassVisible) {
				ctx.fillStyle = '#FFC';
				ctx.fill();
			}
			ctx.stroke();
			ctx.beginPath();
			if (draw.color == '#000') {
				ctx.fillStyle = '#FC3';
			} else {
				ctx.fillStyle = draw.color;
			}
			ctx.moveTo(40, 45);
			ctx.lineTo(39.5, 44.3);
			ctx.lineTo(40.5, 45.7);
			ctx.lineTo(40, 45);
			ctx.fill();
			ctx.stroke();

			ctx.strokeRect(44, 15 + armLength * 0.5, 1, 5);

			// draw pencil arm
			ctx.translate(center2[0], center2[1]);
			ctx.rotate(-angle3);

			var pAngle = Math.PI / 14;

			ctx.beginPath();
			ctx.moveTo(-2, 0);
			ctx.lineTo(2, 0);
			ctx.lineTo(2, armLength * 0.7);
			ctx.lineTo(6, armLength * 0.7);
			ctx.lineTo(6, armLength * 0.7 + 4);
			ctx.lineTo(-2, armLength * 0.7);
			ctx.lineTo(-2, 0);
			ctx.stroke();
			if (!draw.compassVisible) {
				ctx.fillStyle = '#99F';
				ctx.fill();
			}

			if (!draw.compassVisible) {
				ctx.fillRect(6.5, armLength * 0.5 - 0.5, 1, 5);
			}

			ctx.rotate(angle3);
			ctx.translate(-center2[0], -center2[1]);

			// draw top of compass
			ctx.translate(center2[0], center2[1]);

			roundedRect(ctx, -2.5, -3, 5, 7, 1, 1, '#000', '#000');
			roundedRect(ctx, -1, -6, 2, 3, 0, 1, '#000', '#000');
			ctx.fillStyle = '#CCC';
			ctx.beginPath();
			ctx.arc(0, 0, 1, 0, 2 * Math.PI);
			ctx.fill();

			ctx.translate(-center2[0], -center2[1]);
			ctx.translate(-obj.button[0], -obj.button[1]);
		}
		if (obj.compassVisible !== false) {
			draw.compass2.recalc(obj);
			
			var armLength = obj.armLength;				
			var center1 = obj.center1;				
			var rad = obj.radius;	
			var angle = obj.angle;
					
			var h = obj._h;
			var center2 = obj._center2;
			var center3 = obj._center3;
			
			var drawOn = obj._drawOn;
			
			ctx.save();
			if (obj.radiusLocked == true || obj.mode == 'draw' || obj._drawing === true) {
				// draw lock button
				ctx.translate(center2[0],center2[1]);
				if (drawOn == 'right') {
					ctx.rotate(obj.angle);
				} else {
					ctx.rotate(obj.angle + Math.PI);			
				}
			
				var lockHeight = 0.5 * obj._h;
			
				//bar	
				ctx.fillStyle = '#99F';
				ctx.strokeStyle = '#000';
				ctx.lineWidth = 1;
				ctx.fillRect(-0.25*obj.radius,lockHeight-5,0.5*obj.radius,10);
				ctx.strokeRect(-0.25*obj.radius,lockHeight-5,0.5*obj.radius,10);

				//circle
				ctx.fillStyle = '#99F';
				ctx.strokeStyle = '#333';
				ctx.lineWidth = 3;
				ctx.beginPath();
				ctx.arc(0,lockHeight,15,0,2*Math.PI);
				ctx.fill();	
				ctx.stroke();

				//padlock
				ctx.fillStyle = '#333';
				ctx.beginPath();
				ctx.moveTo(6,lockHeight-2);
				ctx.lineTo(6,lockHeight+3);
				ctx.arc(0,lockHeight+3,6,0,Math.PI);
				ctx.lineTo(-6,lockHeight+3);
				ctx.lineTo(-6,lockHeight-2);
				ctx.stroke();
				ctx.fill();
				
				//keyhole
				ctx.fillStyle = '#99F';
				ctx.beginPath();
				ctx.arc(0,lockHeight+2.5,1.5,0,2*Math.PI);
				ctx.fill();
				ctx.fillRect(-0.5,lockHeight+2.5,1,3);
				
				//arm
				ctx.beginPath();
				ctx.moveTo(-6,lockHeight+2);
				ctx.lineTo(-6,lockHeight+2);
				ctx.arc(0,lockHeight-4,5,Math.PI,2*Math.PI);
				ctx.lineTo(6,lockHeight+2);
				ctx.stroke();
				
				if (drawOn == 'right') {
					ctx.rotate(-obj.angle);
				} else {
					ctx.rotate(-obj.angle - Math.PI);			
				}
				ctx.translate(-center2[0],-center2[1]);
			} else {
				// draw lock button
				ctx.translate(center2[0],center2[1]);
				if (drawOn == 'right') {
					ctx.rotate(obj.angle);
				} else {
					ctx.rotate(obj.angle + Math.PI);			
				}
					
				var lockHeight = 0.5 * obj._h;
			
				//bar	
				ctx.fillStyle = '#999';
				ctx.strokeStyle = '#999';
				ctx.lineWidth = 2;
				ctx.strokeRect(-0.25*obj.radius,lockHeight-5,0.5*obj.radius,10);

				//circle
				ctx.fillStyle = '#FFF';
				ctx.strokeStyle = '#999';
				ctx.lineWidth = 3;		
				ctx.beginPath();
				ctx.arc(0,lockHeight,15,0,2*Math.PI);
				ctx.fill();	
				ctx.stroke();

				//padlock
				ctx.fillStyle = '#999';
				ctx.beginPath();
				ctx.moveTo(6,lockHeight-2);
				ctx.lineTo(6,lockHeight+3);
				ctx.arc(0,lockHeight+3,6,0,Math.PI);
				ctx.lineTo(-6,lockHeight+3);
				ctx.lineTo(-6,lockHeight-2);
				ctx.stroke();
				ctx.fill();
				
				//keyhole
				ctx.fillStyle = '#FFF';
				ctx.beginPath();
				ctx.arc(0,lockHeight+2.5,1.5,0,2*Math.PI);
				ctx.fill();
				ctx.fillRect(-0.5,lockHeight+2.5,1,3);
				
				//arm
				ctx.beginPath();
				ctx.moveTo(-6,lockHeight-2);
				ctx.arc(0,lockHeight-4,5,(4/5)*Math.PI,(9/5)*Math.PI);
				ctx.stroke();
				
				if (drawOn == 'right') {
					ctx.rotate(-obj.angle);
				} else {
					ctx.rotate(-obj.angle - Math.PI);			
				}
				ctx.translate(-center2[0],-center2[1]);
			}

			ctx.lineWidth = 2;
			ctx.strokeStyle = '#000';
			ctx.fillStyle = '#000';

			var angle2 = -0.5 * Math.PI - Math.atan((center2[1]-center1[1])/(center2[0]-center1[0]));
			if (center2[0] < center1[0]) angle2 += Math.PI;
			var angle3 = -0.5 * Math.PI - Math.atan((center3[1]-center2[1])/(center3[0]-center2[0]));
			if (center2[0] < center3[0]) angle3 += Math.PI;
			
			// draw pointy arm
			ctx.translate(center2[0],center2[1]);
			ctx.rotate(-angle2);
			
			roundedRect(ctx,-7,0,14,armLength-20,3,4,'#000','#99F');
			ctx.strokeStyle = '#000';
			ctx.fillStyle = '#CCC';
			ctx.lineWidth = 0.5;
			ctx.beginPath();
			ctx.moveTo(-3,armLength-20);
			ctx.lineTo(0,armLength);
			ctx.lineTo(3,armLength-20);
			ctx.lineTo(-3,armLength-20);
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(0,0);
			ctx.lineTo(0,armLength-26);
			ctx.stroke();
				
			ctx.rotate(angle2);
			ctx.translate(-center2[0],-center2[1]);

			// draw pencil arm
			ctx.translate(center2[0],center2[1]);
			ctx.rotate(-angle3);
			
			if (drawOn == 'right') {
				var pAngle = Math.PI/14;
			} else {
				var pAngle = -Math.PI/14;		
			}
			
			//draw pencil
			ctx.translate(0,armLength);
			ctx.rotate(pAngle);
			
			ctx.beginPath();
			ctx.strokeStyle = '#000';
			ctx.lineWidth = 2;
			if (draw.color == '#000') {
				ctx.fillStyle = '#FC3';
			} else {
				ctx.fillStyle = draw.color;
			}
			ctx.moveTo(0,0);
			ctx.lineTo(-10,-30);
			ctx.lineTo(-10,-200);
			ctx.lineTo(10,-200);	
			ctx.lineTo(10,-30);
			ctx.lineTo(0,0);
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			ctx.fillStyle = '#FFC';
			ctx.moveTo(0,0);
			ctx.lineTo(-10,-30);
			ctx.lineTo(10,-30);
			ctx.lineTo(0,0);
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			ctx.fillStyle = draw.color;
			ctx.moveTo(0,0);
			ctx.lineTo(-3,-9);
			ctx.lineTo(3,-9);
			ctx.lineTo(0,0);
			ctx.fill();
			ctx.stroke();
			
			ctx.rotate(-pAngle);	
			ctx.translate(0,-armLength);
			
			ctx.fillStyle = '#99F';
			ctx.beginPath();
			if (drawOn == 'right') {
				ctx.moveTo(-7,0);
				ctx.lineTo(7,0);
				ctx.lineTo(7,armLength-95);		
				ctx.lineTo(7+45*Math.cos(pAngle),armLength-95+45*Math.sin(pAngle));
				ctx.lineTo(7+45*Math.cos(pAngle)-20*Math.sin(pAngle),armLength-95+45*Math.sin(pAngle)+20*Math.cos(pAngle));
				ctx.lineTo(-7,armLength-80);
				ctx.lineTo(-7,0);
			} else {
				ctx.moveTo(7,0);
				ctx.lineTo(-7,0);
				ctx.lineTo(-7,armLength-95);		
				ctx.lineTo(-7-45*Math.cos(pAngle),armLength-95-45*Math.sin(pAngle));
				ctx.lineTo(-7-45*Math.cos(pAngle)-20*Math.sin(pAngle),armLength-95-45*Math.sin(pAngle)+20*Math.cos(pAngle));
				ctx.lineTo(7,armLength-80);
				ctx.lineTo(7,0);		
			}
			ctx.fill();
			ctx.stroke();

			ctx.translate(0,armLength);
			ctx.rotate(pAngle);
			
			ctx.beginPath();
			ctx.strokeStyle = '#000';
			ctx.lineWidth = 2;
			ctx.fillStyle = '#000';
			if (drawOn == 'right') {
				ctx.moveTo(14,-103);
				ctx.lineTo(24,-103);
				ctx.lineTo(24,-67);
				ctx.lineTo(14,-67);	
				ctx.lineTo(14,-103);
			} else {
				ctx.moveTo(-14,-103);
				ctx.lineTo(-24,-103);
				ctx.lineTo(-24,-67);
				ctx.lineTo(-14,-67);	
				ctx.lineTo(-14,-103);		
			}
			ctx.fill();
			ctx.stroke();
			
			ctx.rotate(-pAngle);	
			ctx.translate(0,-armLength);

			ctx.strokeStyle = '#000';
			ctx.fillStyle = '#CCC';
			ctx.lineWidth = 0.5;
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(0,0);
			ctx.lineTo(0,armLength-86);
			ctx.stroke();

			ctx.rotate(angle3);
			ctx.translate(-center2[0],-center2[1]);	
			
			// draw top of compass
			ctx.translate(center2[0],center2[1]);
			if (drawOn == 'right') {
				ctx.rotate(obj.angle);
			} else {
				ctx.rotate(obj.angle + Math.PI);		
			}
			
			roundedRect(ctx,-15,-30,30,55,10,2,'#000','#000');
			roundedRect(ctx,-5,-60,10,30,0,2,'#000','#000');	
			ctx.fillStyle = '#CCC';
			ctx.beginPath();
			ctx.arc(0,0,7,0,2*Math.PI);
			ctx.fill();
			ctx.strokeStyle = '#000';
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(-4,-4);
			ctx.lineTo(4,4);
			ctx.moveTo(4,-4);
			ctx.lineTo(-4,4);
			ctx.stroke();

			if (drawOn == 'right') {
				ctx.rotate(-obj.angle);
			} else {
				ctx.rotate(-obj.angle - Math.PI);		
			}
			ctx.translate(-center2[0],-center2[1]);			
			ctx.restore();
		}	
	},
	recalc: function(obj) {
		if (!un(obj._lastCalcValues)) {
			if (obj._lastCalcValues.armLength === obj.armLength && obj._lastCalcValues.radius === obj.radius && obj._lastCalcValues.angle === obj.angle && obj._lastCalcValues.center1X === obj.center1[0] && obj._lastCalcValues.center1Y === obj.center1[1]) return;
		}
		
		var armLength = obj.armLength;				
		var center1 = obj.center1;				
		var rad = obj.radius;	
		var angle = obj.angle;
		
		obj._h = Math.sqrt(Math.pow(armLength,2)-Math.pow(0.5*rad,2));
		obj._center3 = [center1[0]+rad*Math.cos(angle),center1[1]+rad*Math.sin(angle)];

		var angleX = (obj.angle%(2*Math.PI));
		if (angleX < 0) angleX += 2*Math.PI;
		if (angleX > 0.5 * Math.PI && angleX < 1.5 * Math.PI) {
			obj._drawOn = 'left';	
			obj._center2 = [center1[0]+0.5*rad*Math.cos(angle)-obj._h*Math.sin(angle),center1[1]+0.5*rad*Math.sin(angle)+obj._h*Math.cos(angle)];
		} else {
			obj._drawOn = 'right';
			obj._center2 = [center1[0]+0.5*rad*Math.cos(angle)+obj._h*Math.sin(angle),center1[1]+0.5*rad*Math.sin(angle)-obj._h*Math.cos(angle)];
		}

		var mp1 = midpoint(obj.center1[0],obj.center1[1],obj._center3[0],obj._center3[1]);
		var mp2 = midpoint(obj._center2[0],obj._center2[1],mp1[0],mp1[1]);
		obj._lockCenter = mp2.slice(0);
		
		obj._lastCalcValues = {
			armLength:obj.armLength,
			center1X:obj.center1[0],
			center1Y:obj.center1[1],
			radius:obj.radius,
			angle:obj.angle,
		}
	},
	getRect: function (obj) {
		if (!un(obj.button)) {
			return [obj.button[0],obj.button[1],55,55];
		} else {
			return [20,20,55,55];
		}
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.button[0] += dl;
		obj.button[1] += dt;
	},
	getCursorPositionsInteract: function (obj, path) {
		var pos = [];
		if (obj.compassVisible === true) {
			var angle2 = Math.atan((0.5*obj.radius)/obj._h);
			if (obj._drawOn == 'right') {
				var angle3 = angle2-obj.angle-Math.PI/14;
				var center4 = [obj._center3[0]-200*Math.sin(angle3),obj._center3[1]-200*Math.cos(angle3)];
			} else {
				var angle3 = -(angle2+obj.angle-Math.PI/14);
				var center4 = [obj._center3[0]+200*Math.sin(angle3),obj._center3[1]+200*Math.cos(angle3)];					
			}

			obj._pencilPolygon = [
				[center4[0]+20*Math.cos(angle3),center4[1]-20*Math.sin(angle3)],
				[center4[0]-20*Math.cos(angle3),center4[1]+20*Math.sin(angle3)],
				[obj._center3[0]-20*Math.cos(angle3),obj._center3[1]+20*Math.sin(angle3)],
				[obj._center3[0]+20*Math.cos(angle3),obj._center3[1]-20*Math.sin(angle3)]
			];		
			

			if (obj._drawOn == 'right') {
				obj._topPolygon = [
					[obj._center2[0]-62*Math.sin(-obj.angle)+10*Math.cos(obj.angle),obj._center2[1]-62*Math.cos(obj.angle)-10*Math.sin(-obj.angle)],
					[obj._center2[0]-62*Math.sin(-obj.angle)-10*Math.cos(obj.angle),obj._center2[1]-62*Math.cos(obj.angle)+10*Math.sin(-obj.angle)],
					[obj._center2[0]-10*Math.cos(obj.angle),obj._center2[1]+10*Math.sin(-obj.angle)],
					[obj._center2[0]+10*Math.cos(obj.angle),obj._center2[1]-10*Math.sin(-obj.angle)],
				];
			} else {
				obj._topPolygon = [
					[obj._center2[0]+62*Math.sin(-obj.angle)+10*Math.cos(obj.angle),obj._center2[1]+62*Math.cos(obj.angle)-10*Math.sin(-obj.angle)],
					[obj._center2[0]+62*Math.sin(-obj.angle)-10*Math.cos(obj.angle),obj._center2[1]+62*Math.cos(obj.angle)+10*Math.sin(-obj.angle)],
					[obj._center2[0]-10*Math.cos(obj.angle),obj._center2[1]+10*Math.sin(-obj.angle)],
					[obj._center2[0]+10*Math.cos(obj.angle),obj._center2[1]-10*Math.sin(-obj.angle)],
				];
			}
			
			pos.push({
				shape: 'line',
				dims: [obj._center2,obj._center3,30],
				cursor: draw.cursors.move1,
				func: draw.compass2.moveCompassStart2,
				interact: true,
				path: path,
				obj: obj
			});
			pos.push({
				shape: 'polygon',
				dims: obj._pencilPolygon,
				cursor: draw.cursors.move1,
				func: draw.compass2.moveCompassStart2,
				interact: true,
				path: path,
				obj: obj
			});
			pos.push({
				shape: 'line',
				dims: [obj.center1,obj._center2,30],
				cursor: draw.cursors.move1,
				func: draw.compass2.moveCompassStart1,
				interact: true,
				path: path,
				obj: obj
			});
			pos.push({
				shape: 'polygon',
				dims: obj._topPolygon,
				cursor: draw.cursors.move1,
				func: draw.compass2.moveCompassStart1,
				interact: true,
				path: path,
				obj: obj
			});
			pos.push({
				shape: 'circle',
				dims: [obj._center2[0],obj._center2[1],40],
				cursor: draw.cursors.rotate,
				func: draw.compass2.drawCompassStart,
				interact: true,
				path: path,
				obj: obj
			});
			pos.push({
				shape: 'circle',
				dims: [obj._lockCenter[0],obj._lockCenter[1],30],
				cursor: draw.cursors.pointer,
				func: draw.compass2.toggleCompassLock,
				interact: true,
				path: path,
				obj: obj
			});
			
		}
		if (!un(obj.button)) {
			pos.push({
				shape: 'rect',
				dims: [obj.button[0],obj.button[1],55,55],
				cursor: draw.cursors.pointer,
				func: draw.compass2.toggleCompassVisible,
				interact: true,
				path: path,
				obj: obj
			});
		}
		return pos;
	},
	getCursorPositionsSelected: function(obj, pathNum) {
		return [];
	},
	toggleCompassVisible: function() {
		var obj = draw.currCursor.obj;
		obj.compassVisible = !obj.compassVisible;
		drawCanvasPaths();
	},
	toggleCompassLock: function() {
		var obj = draw.currCursor.obj;
		draw.movePathToFront(obj._path);
		obj.radiusLocked = !obj.radiusLocked;
		drawCanvasPaths();
	},
	moveCompassStart1: function() {
		var obj = draw.currCursor.obj;
		draw.movePathToFront(obj._path);
		draw._drag = {
			obj: obj,
			offset: [obj.center1[0]-draw.mouse[0],obj.center1[1]-draw.mouse[1]]
		};
		draw.animate(draw.compass2.moveCompassMove1,draw.compass2.moveCompassStop,drawCanvasPaths);
		
		draw.cursorCanvas.style.cursor = draw.cursors.move2;
		draw.cursorOverride = draw.cursors.move2;
	},
	moveCompassMove1: function(e) {
		updateMouse(e);
		var obj = draw._drag.obj;
		
		obj.center1[0] = draw.mouse[0]+draw._drag.offset[0];
		obj.center1[1] = draw.mouse[1]+draw._drag.offset[1];
		
		if (snapToObj2On || draw.snapLinesTogether) obj.center1 = snapToObj2(obj.center1);
	},
	moveCompassStart2: function() {
		var obj = draw.currCursor.obj;
		draw.movePathToFront(obj._path);
		draw._drag = {
			obj: obj,
			offset: [obj._center3[0]-draw.mouse[0],obj._center3[1]-draw.mouse[1]]
		};
		draw.animate(draw.compass2.moveCompassMove2,draw.compass2.moveCompassStop,drawCanvasPaths);
		draw.cursorCanvas.style.cursor = draw.cursors.move2;
		draw.cursorOverride = draw.cursors.move2;
	},
	moveCompassMove2: function(e) {
		updateMouse(e);		
		var obj = draw._drag.obj;	
		var offset = draw._drag.offset;	
		
		var newcenter3 = [draw.mouse[0]+offset[0],draw.mouse[1]+offset[1]];
		
		if (obj.radiusLocked == false) {
			newcenter3 = snapToObj2(newcenter3,-1);
			
			var newRadius = Math.sqrt(Math.pow(newcenter3[0]-obj.center1[0],2)+Math.pow(newcenter3[1]-obj.center1[1],2));
			
			if (newRadius <= 1.85 * obj.armLength) {
				obj._center3[0] = newcenter3[0];
				obj._center3[1] = newcenter3[1];
				obj.radius = newRadius;
				if (obj._center3[0] >= obj.center1[0]) {
					obj.angle = Math.atan((obj._center3[1]-obj.center1[1])/(obj._center3[0]-obj.center1[0]));
				} else {
					obj.angle = Math.PI + Math.atan((obj._center3[1]-obj.center1[1])/(obj._center3[0]-obj.center1[0]));
				}			
			} else {			
				if (newcenter3[0] >= obj.center1[0]) {
					obj.angle = Math.atan((newcenter3[1]-obj.center1[1])/(newcenter3[0]-obj.center1[0]));
				} else {
					obj.angle = Math.PI + Math.atan((newcenter3[1]-obj.center1[1])/(newcenter3[0]-obj.center1[0]));
				}
				obj._center3[0] = obj.center1[0] + 1.85 * obj.armLength * Math.cos(obj.angle);
				obj._center3[1] = obj.center1[1] + 1.85 * obj.armLength * Math.sin(obj.angle);
				obj.radius = 1.85 * obj.armLength;		
			}
		} else {
			newcenter3 = snapToObj2(newcenter3,-1);
			
			obj.angle = getAngleFromAToB(obj.center1, newcenter3);
			
			obj._center3[0] = obj.center1[0] + obj.radius * Math.cos(obj.angle);
			obj._center3[1] = obj.center1[1] + obj.radius * Math.sin(obj.angle);
		}		
	},
	moveCompassStop: function() {
		delete draw._drag;
		delete draw.cursorOverride;
	},
	drawCompassStart: function() {
		var obj = draw.currCursor.obj;
		draw.movePathToFront(obj._path);
		draw.drawing = true;
		var arc = {
			type:'arc',
			color:draw.color,
			thickness:draw.thickness,
			center:obj.center1.slice(0),
			radius:obj.radius,
			startAngle:obj.angle,
			finAngle:obj.angle,
			clockwise:true
		};
		if (!un(draw.dash) && draw.dash.length > 0) arc.dash = clone(arc.dash);	
		draw.path.push({obj:[arc],selected:false});
		obj._drawing = true;
		draw._drag = {
			obj: obj,
			arc: arc,
			prev: clone(draw.mouse)
		};
		draw.animate(draw.compass2.drawCompassMove,draw.compass2.drawCompassStop,drawCanvasPaths);
		draw.cursorCanvas.style.cursor = draw.currCursor.cursor;
		draw.cursorOverride = draw.currCursor.cursor;
	},
	drawCompassMove: function(e) {
		updateMouse(e);		
		var obj = draw._drag.obj;	
		var arc = draw._drag.arc;	
		var prev = draw._drag.prev;	
		
		var dAngle = measureAngle({c:draw.mouse,b:[obj.center1[0],obj.center1[1]],a:prev,angleType:'radians'});
		if (dAngle > Math.PI) {
			obj.angle -= dAngle = 2*Math.PI-dAngle;
		} else {
			obj.angle += dAngle;
		}
		
		arc.startAngle = Math.min(arc.startAngle,obj.angle);
		arc.finAngle = Math.max(arc.finAngle,obj.angle);
		draw._drag.prev = clone(draw.mouse);
	},
	drawCompassStop: function() {
		delete draw._drag.obj._drawing;
		delete draw._drag;
		delete draw.cursorOverride;
		draw.drawing = false;
		drawCanvasPaths();
		calcCursorPositions();
	}
}

draw.textInput = {
	add: function () {
		deselectAllPaths();
		var obj = {
			type: 'text2',
			text: [''],
			align: [0, 0],
			fontSize: 28,
			rect: [50, 50, 250, 80],
			box: {
				type: 'loose',
				color: '#FFC',
				borderColor: '#000',
				borderWidth: 2
			},
			ansIndex: 0,
			ans: []
		};
		draw.path.push({
			obj: [obj],
			isInput: {
				type: 'text',
				backColors: {
					unchecked: '#FFC',
					correct: '#CFC',
					wrong: '#FCC'
				}
			},
			selected: true
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
	},
	drawButton: function (ctx, size) {
		ctx.fillStyle = '#FFF';
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 2;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		ctx.beginPath();
		ctx.fillRect(size * 8 / 55, size * 15 / 55, size * (55 - 16) / 55, size * 25 / 55);
		ctx.strokeRect(size * 8 / 55, size * 15 / 55, size * (55 - 16) / 55, size * 25 / 55);
		ctx.stroke();
		text({
			context: ctx,
			left: size * 8 / 55,
			width: size * (55 - 16) / 55,
			top: size * 15 / 55,
			textArray: ['<<font:Georgia>><<fontSize:' + size * 20 / 55 + '>><<align:center>>I']
		});
	},
}
draw.dropMenu = {
	/*properties: [
	text:{type:'array'},
	rect:{type:'array'},
	align:{type:'array',required:false},

	],*/
	add: function () {
		deselectAllPaths();
		var obj = {
			type: 'dropMenu',
			text: ["Questions"],
			align: [-1, 0],
			rect: [50, 50, 200, 50],
			fontSize: 32,
			box: {
				type: 'loose',
				color: '#3FF',
				borderColor: '#000',
				borderWidth: 3
			},
			optionBox: {
				color: '#CFF',
				lineWidth: 2,
				align: [0, 0]
			},
			showDownArrow: true,
			downArrowSize: 12,
			options: [{
					text: ["1"],
					value: 1
				}, {
					text: ["2"],
					value: 2
				}, {
					text: ["4"],
					value: 4
				}, {
					text: ["6"],
					value: 6
				}, {
					text: ["8"],
					value: 8
				}, {
					text: ["10"],
					value: 10
				}
			],
			value: 1,
			_open: false,
			onchange: function (obj) {
				console.log(obj.value);
			}
		};
		draw.path.push({
			obj: [obj],
			selected: true
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
	},
	draw: function (ctx, obj, path) {
		draw.text2.draw(ctx, obj, path);
		var obj2 = clone(obj);

		if (obj.showDownArrow == true) {
			ctx.fillStyle = '#000';
			ctx.lineJoin = 'round';
			ctx.lineCap = 'round';
			var t = obj.rect[1] + obj.rect[3] / 2;
			var s = obj.downArrowSize || 8;
			var l = obj.rect[0] + obj.rect[2] - 7 - s;
			ctx.beginPath();
			ctx.moveTo(l - s, t - s / 2);
			ctx.lineTo(l + s, t - s / 2);
			ctx.lineTo(l, t + s);
			ctx.lineTo(l - s, t - s / 2);
			ctx.fill();
		}

		if (obj._open === true) {
			var obj2 = clone(obj);
			var top = obj2.rect[1];
			var height = obj2.rect[3];
			for (var o = 0; o < obj2.options.length; o++) {
				var opt = obj2.options[o];
				top += height;
				obj2.rect[1] = top;
				obj2.align = obj2.optionBox.align;
				obj2.box.color = obj2.optionBox.color;
				obj2.box.lineWidth = obj2.optionBox.lineWidth;
				obj2.text = opt.text;
				draw.text2.draw(ctx, obj2, path);
			}
		}
	},
	getRect: function (obj) {
		var rect = clone(obj.rect);
		if (obj._open == true) {
			rect[3] *= (obj.options.length + 1)
		}
		return rect;
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.rect[0] += dl;
		obj.rect[1] += dt;
		obj.rect[2] += dw;
		if (obj._open == true)
			dh /= (obj.options.length + 1);
		obj.rect[3] += dh;
	},
	resizable: true,
	textEdit: true,
	getButtons: function (x1, y1, x2, y2, pathNum, path) {
		if (un(path) && un(pathNum))
			return;
		if (un(path))
			path = draw.path[pathNum];
		if (un(path.obj))
			return;
		var obj = path.obj[0];
		var buttons = [];
		buttons.push({
			buttonType: 'dropMenu-open',
			shape: 'rect',
			dims: [x2 - 40, y1, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.dropMenu.clickToggleOpen,
			path: draw.path[pathNum],
			pathNum: pathNum,
			obj: obj,
			draw: function (path, ctx, l, t, w, h) {
				var obj = path.obj[0];
				ctx.fillStyle = colorA('#F99', 0.5);
				ctx.fillRect(l, t, w, h);
				ctx.fillStyle = '#000';
				ctx.lineJoin = 'round';
				ctx.lineCap = 'round';
				var t2 = t + h / 2;
				var l2 = l + w / 2;
				var s = w * 0.4;

				ctx.beginPath();

				if (obj._open === true) {
					ctx.moveTo(l2 - s, t2 + s / 2);
					ctx.lineTo(l2 + s, t2 + s / 2);
					ctx.lineTo(l2, t2 - s);
					ctx.lineTo(l2 - s, t2 + s / 2);
				} else {
					ctx.moveTo(l2 - s, t2 - s / 2);
					ctx.lineTo(l2 + s, t2 - s / 2);
					ctx.lineTo(l2, t2 + s);
					ctx.lineTo(l2 - s, t2 - s / 2);
				}

				ctx.fill();
			}
		});
		return buttons;
	},
	clickToggleOpen: function () {
		var obj = draw.currCursor.obj;
		obj._open = un(obj._open) ? true : !obj._open;
		updateBorder(draw.currCursor.path);
		drawCanvasPaths();
	},
	clickSetValue: function (obj) {
		var obj = draw.currCursor.obj;
		var value = draw.currCursor.value;
		obj._open = false;
		if (obj.value !== value) {
			obj.value = value;
			for (var o = 0; o < obj.options.length; o++) {
				var opt = obj.options[o];
				if (opt.value === value) {
					if (!un(opt.text))
						obj.text = clone(opt.text);
					break;
				}
			}
			if (typeof obj.onchange == 'function') {
				obj.onchange(obj);
			}
		}
		drawCanvasPaths();
	},
	getCursorPositionsInteract: function (obj, path) {
		var pos = [];
		pos.push({
			shape: 'rect',
			dims: obj.rect,
			cursor: draw.cursors.pointer,
			func: draw.dropMenu.clickToggleOpen,
			interact: true,
			path: path,
			obj: obj
		});

		if (obj._open === true) {
			var top = obj.rect[1];
			var height = obj.rect[3];
			for (var o2 = 0; o2 < obj.options.length; o2++) {
				var opt = obj.options[o2];
				top += height;
				pos.push({
					shape: 'rect',
					dims: [obj.rect[0], top, obj.rect[2], height],
					cursor: draw.cursors.pointer,
					func: draw.dropMenu.clickSetValue,
					interact: true,
					path: path,
					obj: obj,
					value: opt.value
				});
			}
		}

		return pos;
	},
	getCursorPositionsSelected: function (obj, pathNum) {
		return [{
				shape: 'rect',
				dims: clone(obj.tightRect),
				cursor: draw.cursors.text,
				func: textEdit.selectStart,
				obj: obj,
				pathNum: pathNum,
				highlight: -1
			}
		];
	}
}
draw.container = {
	resizable: true,
	add: function () {
		deselectAllPaths();
		var obj = {
			type: 'container',
			center: getRelPos([300, 400]),
			lineWidth: 8,
			lineColor: '#000',
			fillColor: '#99F',
			fillLevel: 200,
			shape: [{
					type: 'line',
					pos: [[0, 50], [200, 200]]
				}
			]
		};
		draw.path.push({
			obj: [obj],
			selected: true
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
	},
	draw: function (ctx, obj) {
		ctx.translate(obj.center[0], obj.center[1]);
		for (var s = 0; s < obj.shape.length; s++) {
			var shape = obj.shape[s];
			if (obj.fillLevel >= shape.pos[1][0]) {
				ctx.fillStyle = obj.fillColor;
				ctx.beginPath();
				ctx.moveTo(shape.pos[0][1], -shape.pos[0][0]);
				ctx.lineTo(shape.pos[1][1], -shape.pos[1][0]);
				ctx.lineTo(-shape.pos[1][1], -shape.pos[1][0]);
				ctx.lineTo(-shape.pos[0][1], -shape.pos[0][0]);
				ctx.fill();
			} else if (obj.fillLevel > shape.pos[0][0]) {
				var w = draw.container.getWidthAtHeight(obj, obj.fillLevel);
				ctx.fillStyle = obj.fillColor;
				ctx.beginPath();
				ctx.moveTo(shape.pos[0][1], -shape.pos[0][0]);
				ctx.lineTo(w, -obj.fillLevel);
				ctx.lineTo(-w, -obj.fillLevel);
				ctx.lineTo(-shape.pos[0][1], -shape.pos[0][0]);
				ctx.fill();
			}
		}

		ctx.beginPath();
		ctx.lineJoin = 'round';
		ctx.lineCap = 'round';
		ctx.strokeStyle = obj.lineColor;
		ctx.lineWidth = obj.lineWidth;
		ctx.moveTo(0, 0);
		for (var s = 0; s < obj.shape.length; s++) {
			var shape = obj.shape[s];
			ctx.lineTo(shape.pos[0][1], -shape.pos[0][0]);
			ctx.lineTo(shape.pos[1][1], -shape.pos[1][0]);
		}
		ctx.moveTo(0, 0);
		for (var s = 0; s < obj.shape.length; s++) {
			var shape = obj.shape[s];
			ctx.lineTo(-shape.pos[0][1], -shape.pos[0][0]);
			ctx.lineTo(-shape.pos[1][1], -shape.pos[1][0]);
		}
		ctx.stroke();
		ctx.translate(-obj.center[0], -obj.center[1]);
	},
	getWidthAtHeight: function (obj, h) {
		var w = 0;
		for (var s = 0; s < obj.shape.length; s++) {
			var shape = obj.shape[s];
			if (shape.type == 'line' && shape.pos[0][0] <= h && h <= shape.pos[1][0]) {
				return shape.pos[0][1] + ((h - shape.pos[0][0]) / (shape.pos[1][0] - shape.pos[0][0])) * (shape.pos[1][1] - shape.pos[0][1]);
			}
		}
		return w;
	},
	getTotalArea: function (obj) {
		var area = 0;
		for (var s = 0; s < obj.shape.length; s++) {
			var shape = obj.shape[s];
			if (shape.type == 'line') {
				var w1 = shape.pos[0][1];
				var w2 = shape.pos[1][1];
				var hh = shape.pos[1][0] - shape.pos[0][0];
				area += 0.5 * (w1 + w2) * hh;
			}
		}
		return area;
	},
	getHeightAtArea: function (obj, area) {
		var h = 0;
		var areaCount = 0;
		for (var s = 0; s < obj.shape.length; s++) {
			var shape = obj.shape[s];
			if (shape.type == 'line') {
				var w1 = shape.pos[0][1];
				var w2 = shape.pos[1][1];
				var hh = shape.pos[1][0] - shape.pos[0][0];
				var shapeArea = 0.5 * (w1 + w2) * hh;
				if (areaCount + shapeArea >= area) {
					area -= areaCount;
					if (w1 == w2) {
						return shape.pos[0][0] + area / w1;
					} else {
						var m = (w2 - w1) / hh;
						return shape.pos[0][0] + (Math.sqrt(w1 * w1 + 2 * m * area) - w1) / m;
					}
				}
				areaCount += shapeArea;
				h = shape.pos[1][0];
			}
		}
		return h;
	},
	setFillLevelToArea: function (obj, area) {
		obj.fillLevel = draw.container.getHeightAtArea(obj, area);
	},
	getTotalVolume: function (obj) {
		var vol = 0;
		for (var s = 0; s < obj.shape.length; s++) {
			var shape = obj.shape[s];
			if (shape.type == 'line') {
				var r1 = shape.pos[0][1];
				var r2 = shape.pos[1][1];
				var h = shape.pos[1][0] - shape.pos[0][0];
				vol += (Math.PI / 3) * h * (r1 * r1 + r2 * r2 + r1 * r2);
			}
		}
		return vol;
	},
	getHeightAtVolume: function (obj, vol) {
		var h = 0;
		var volCount = 0;
		for (var s = 0; s < obj.shape.length; s++) {
			var shape = obj.shape[s];
			if (shape.type == 'line') {
				var r1 = shape.pos[0][1];
				var r2 = shape.pos[1][1];
				var hh = shape.pos[1][0] - shape.pos[0][0];
				var shapeVol = (Math.PI / 3) * hh * (r1 * r1 + r2 * r2 + r1 * r2);
				if (volCount + shapeVol >= vol) {
					vol -= volCount;
					var m = (r2 - r1) / hh;
					var d = -vol;
					var c = Math.PI * r1 * r1;
					var b = Math.PI * r1 * m;
					var a = (Math.PI / 3) * m * m;
					var h2 = solveCubic(a, b, c, d)[0];
					return shape.pos[0][0] + h2;
					//return shape.pos[0][0]+(3*vol)/(Math.PI*(r1*r1+r2*r2+r1*r2));
				}
				volCount += shapeVol;
				h = shape.pos[1][0];
			}
		}
		return h;
	},
	setFillLevelToVolume: function (obj, vol) {
		obj.fillLevel = draw.container.getHeightAtVolume(obj, vol);
	},
	getRect: function (obj) {
		var xMax = 0;
		var yMax = 0;
		for (var s = 0; s < obj.shape.length; s++) {
			var shape = obj.shape[s];
			xMax = Math.max(xMax, shape.pos[0][1], shape.pos[1][1]);
			yMax = Math.max(yMax, shape.pos[0][0], shape.pos[1][0]);
		}
		return [obj.center[0] - xMax, obj.center[1] - yMax, xMax * 2, yMax];
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.center[0] += dl;
		obj.center[1] += dt;
	},
	/*getCursorPositionsUnselected: function(obj,pathNum) {
	return [{shape:'rect',dims:obj.rect,cursor:draw.cursors.pointer,func:drawClickSelect,obj:obj,pathNum:pathNum,highlight:-1}];
	},*/
	/*getSnapPos: function(obj) {
	var snapPos = [];
	var left = obj.rect[0];
	var top = obj.rect[1];
	var width = obj.rect[2];
	var height = obj.rect[3];

	if (boolean(obj.vertical == true)) {
	var x0 = left+0.5*width;

	if (typeof obj.arrows == 'number') {
	snapPos.push({type:'point',pos:[x0,obj.rect[1]]});
	snapPos.push({type:'point',pos:[x0,obj.rect[1]+obj.rect[3]]});
	top += obj.arrows;
	height -= 2*obj.arrows;
	}

	var y0 = top-(obj.min*height)/(obj.max-obj.min);

	var minorSpacing = (height*obj.minorStep)/(obj.max-obj.min);
	var yAxisPoint = y0;
	while (Math.round(yAxisPoint) <= Math.round(top + height)) {
	if (Math.round(yAxisPoint) >= Math.round(top)) {
	snapPos.push({type:'point',pos:[x0,yAxisPoint]});
	}
	yAxisPoint += minorSpacing;
	}
	var yAxisPoint = y0 - minorSpacing;
	while (Math.round(yAxisPoint) >= Math.round(top)) {
	if (Math.round(yAxisPoint) <= Math.round(top + height)) {
	snapPos.push({type:'point',pos:[x0,yAxisPoint]});
	}
	yAxisPoint -= minorSpacing;
	}

	var majorSpacing = (height*obj.majorStep)/(obj.max-obj.min);
	var yAxisPoint = y0;
	while (Math.round(yAxisPoint) <= Math.round(top + height)) {
	if (Math.round(yAxisPoint) >= Math.round(top)) {
	snapPos.push({type:'point',pos:[x0,yAxisPoint]});
	}
	yAxisPoint += majorSpacing;
	}
	var yAxisPoint = y0 - majorSpacing;
	while (Math.round(yAxisPoint) >= Math.round(top)) {
	if (Math.round(yAxisPoint) <= Math.round(top + height)) {
	snapPos.push({type:'point',pos:[x0,yAxisPoint]});
	}
	yAxisPoint -= majorSpacing;
	}
	} else {
	var y0 = top+0.5*height;

	if (typeof obj.arrows == 'number') {
	snapPos.push({type:'point',pos:[obj.rect[0],y0]});
	snapPos.push({type:'point',pos:[obj.rect[0]+obj.rect[2],y0]});
	left += obj.arrows;
	width -= 2*obj.arrows;
	}

	var x0 = left-(obj.min*width)/(obj.max-obj.min);

	var minorSpacing = (width*obj.minorStep)/(obj.max-obj.min);
	var xAxisPoint = x0;
	while (Math.round(xAxisPoint) <= Math.round(left + width)) {
	if (Math.round(xAxisPoint) >= Math.round(left)) {
	snapPos.push({type:'point',pos:[xAxisPoint,y0]});
	}
	xAxisPoint += minorSpacing;
	}
	var xAxisPoint = x0 - minorSpacing;
	while (Math.round(xAxisPoint) >= Math.round(left)) {
	if (Math.round(xAxisPoint) <= Math.round(left + width)) {
	snapPos.push({type:'point',pos:[xAxisPoint,y0]});
	}
	xAxisPoint -= minorSpacing;
	}

	var majorSpacing = (width*obj.majorStep)/(obj.max-obj.min);
	var xAxisPoint = x0;
	while (Math.round(xAxisPoint) <= Math.round(left + width)) {
	if (Math.round(xAxisPoint) >= Math.round(left)) {
	snapPos.push({type:'point',pos:[xAxisPoint,y0]});
	}
	xAxisPoint += majorSpacing;
	}
	var xAxisPoint = x0 - majorSpacing;
	while (Math.round(xAxisPoint) >= Math.round(left)) {
	if (Math.round(xAxisPoint) <= Math.round(left + width)) {
	snapPos.push({type:'point',pos:[xAxisPoint,y0]});
	}
	xAxisPoint -= majorSpacing;
	}
	}

	return snapPos;
	},*/
	setLineWidth: function (obj, lineWidth) {
		obj.lineWidth = lineWidth;
	},
	setLineColor: function (obj, color) {
		obj.lineColor = color;
	},
	setFillColor: function (obj, color) {
		obj.fillColor = color;
	},
	getLineWidth: function (obj) {
		return obj.lineWidth;
	},
	getLineColor: function (obj) {
		return obj.lineColor;
	},
	getFillColor: function (obj) {
		return obj.fillColor;
	},
	/*getButtons: function(x1,y1,x2,y2,pathNum) {
	var buttons = [];
	if (un(draw.path[pathNum])) return [];
	var obj = draw.path[pathNum].obj[0];

	var dims = obj.vertical == true ? [x1,y1+20,20,20] : [x1+20,y1,20,20];
	var button = {buttonType:'numberline-toggleHorizVert',shape:'rect',dims:dims,cursor:draw.cursors.pointer,func:draw.numberline.toggleHorizVert,pathNum:pathNum};
	button.draw = function(path,ctx,l,t,w,h) {
	ctx.fillStyle = colorA('#F96',0.5);
	ctx.fillRect(l,t,w,h);
	ctx.strokeStyle = colorA('#000',0.5);
	ctx.strokeRect(l,t,w,h);
	ctx.beginPath();
	if (boolean(path.obj[0].vertical,false) == true) {
	ctx.moveTo(l+0.5*w,t+0.15*h);
	ctx.lineTo(l+0.5*w,t+0.85*h);
	for (var i = 0; i < 4; i++) {
	ctx.moveTo(l+0.4*w,t+(0.15+(0.7/3)*i)*h);
	ctx.lineTo(l+0.6*w,t+(0.15+(0.7/3)*i)*h);
	}
	} else {
	ctx.moveTo(l+0.15*w,t+0.5*h);
	ctx.lineTo(l+0.85*w,t+0.5*h);
	for (var i = 0; i < 4; i++) {
	ctx.moveTo(l+(0.15+(0.7/3)*i)*w,t+0.4*h);
	ctx.lineTo(l+(0.15+(0.7/3)*i)*w,t+0.6*h);
	}
	}
	ctx.stroke();
	}
	buttons.push(button);

	var dims = obj.vertical == true ? [x1,y1+40,20,20] : [x1+40,y1,20,20];
	var button = {buttonType:'numberline-toggleScale',shape:'rect',dims:dims,cursor:draw.cursors.pointer,func:draw.numberline.toggleScale,pathNum:pathNum};
	button.draw = function(path,ctx,l,t,w,h) {
	if (boolean(path.obj[0].showScales,true) == true) {
	ctx.fillStyle = colorA('#F96',0.5);
	ctx.fillRect(l,t,w,h);
	}
	ctx.strokeStyle = colorA('#000',0.5);
	ctx.strokeRect(l,t,w,h);
	text({ctx:ctx,textArray:['<<fontSize:'+(w/2)+'>>123'],left:l,top:t,width:w,height:h,textAlign:'center',vertAlign:'middle'});
	}
	buttons.push(button);

	var dims = obj.vertical == true ? [x1,y1+60,20,20] : [x1+60,y1,20,20];
	var button = {buttonType:'numberline-toggleMinorPos',shape:'rect',dims:dims,cursor:draw.cursors.pointer,func:draw.numberline.toggleMinorPos,pathNum:pathNum};
	button.draw = function(path,ctx,l,t,w,h) {
	if (boolean(path.obj[0].showMinorPos,true) == true) {
	ctx.fillStyle = colorA('#F96',0.5);
	ctx.fillRect(l,t,w,h);
	}
	ctx.strokeStyle = colorA('#000',0.5);
	ctx.strokeRect(l,t,w,h);
	text({ctx:ctx,textArray:['<<fontSize:'+(w/2)+'>>min'],left:l,top:t,width:w,height:h,textAlign:'center',vertAlign:'middle'});
	}
	buttons.push(button);

	var dims = obj.vertical == true ? [x1,y1+80,20,20] : [x1+80,y1,20,20];
	var button = {buttonType:'numberline-toggleArrows',shape:'rect',dims:dims,cursor:draw.cursors.pointer,func:draw.numberline.toggleArrows,pathNum:pathNum};
	button.draw = function(path,ctx,l,t,w,h) {
	if (typeof path.obj[0].arrows == 'number') {
	ctx.fillStyle = colorA('#F96',0.5);
	ctx.fillRect(l,t,w,h);
	}
	ctx.strokeStyle = colorA('#000',0.5);
	ctx.strokeRect(l,t,w,h);
	drawArrow({ctx:ctx,startX:l+0.2*w,startY:t+0.5*h,finX:l+0.8*w,finY:t+0.5*h,doubleEnded:true,color:'#000',lineWidth:1,fillArrow:true,arrowLength:5});
	}
	buttons.push(button);

	return buttons;
	},*/
	/*drawButton: function() {
	var l = 0;
	var t = 0;
	var w = draw.buttonSize;
	var h = draw.buttonSize;
	var ctx = this.ctx;

	roundedRect(ctx,3,3,w-6,h-6,8,6,'#000',draw.buttonColor);

	ctx.strokeStyle = draw.color;
	ctx.lineWidth = 2*(w/55);
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';

	ctx.save();
	ctx.beginPath();
	ctx.moveTo(l+0.15*w,t+0.5*h);
	ctx.lineTo(l+0.85*w,t+0.5*h);
	for (var i = 0; i < 4; i++) {
	ctx.moveTo(l+(0.15+(0.7/3)*i)*w,t+0.4*h);
	ctx.lineTo(l+(0.15+(0.7/3)*i)*w,t+0.6*h);
	}
	ctx.stroke();
	ctx.restore();
	},*/
	/*drawButton: function(ctx,size) {
	ctx.strokeStyle = '#000';
	ctx.lineWidth = 0.03*size;

	ctx.beginPath();
	ctx.moveTo(0.15*size,0.5*size);
	ctx.lineTo(0.85*size,0.5*size);
	for (var i = 0; i < 4; i++) {
	ctx.moveTo((0.15+(0.7/3)*i)*size,0.4*size);
	ctx.lineTo((0.15+(0.7/3)*i)*size,0.6*size);
	}
	ctx.stroke();
	},*/
	scale: function (obj, sf, center) {
		if (!un(center)) {
			obj.center[0] = center[0] + sf * (obj.center[0] - center[0]);
			obj.center[1] = center[1] + sf * (obj.center[1] - center[1]);
		}
		for (var s = 0; s < obj.shape.length; s++) {
			var shape = obj.shape[s];
			shape.pos[0][0] *= sf;
			shape.pos[0][1] *= sf;
			shape.pos[1][0] *= sf;
			shape.pos[1][1] *= sf;
		}
		obj.fillLevel *= sf;
		if (!un(obj.lineWidth))
			obj.lineWidth *= sf;
	}
};
draw.three = {
	add: function () {
		deselectAllPaths(false);
		changeDrawMode();
		draw.path.push({
			obj: [{
					type: 'three',
					center: getRelPos([600, 350]),
					gridSize: 210,
					gridStep: 35,
					snapTo: 35,
					fillStyle: '#0FF',
					alpha: 0.5,
					paths3d: [
						/*{type:'grid',squares:8,size:35,direction:[0,0,1],color:'#CCC',alpha:1},*/
						/*{type:'arrow',pos:[[7*35,0,0],[5*35,0,0]],fill:true,color:'#000',alpha:1},*/
						{
							type: 'prism',
							polygon: [[-2 * 35, 2 * 35], [2 * 35, -4 * 35], [2 * 35, 2 * 35]],
							center: [0, 0, 0],
							height: 4 * 35
						},
					],
					drawBackFaces: 'auto', /* auto, dash, outline, none */
					drawFaceNormals: false,
					faceGrid: false,
					cubeBuildingMode: true,
					brightness: 1,
					contrast: 0.5,
					tilt: 0.35,
					angle: 1.75 * Math.PI,
					/*angleMin:1.5*Math.PI,//*/
					/*angleMax:2*Math.PI,//*/
				}
			],
			selected: true
		});
		draw.updateAllBorders();
		drawCanvasPaths();
		//draw.controlPanel.draw();
		drawSelectCanvas();
	},
	path3d: {
		grid: {
			get: function () {
				var obj = sel();
				return {
					type: 'grid',
					squares: Math.round(obj.gridSize / obj.gridStep),
					size: obj.gridStep,
					direction: clone(dir),
					color: '#CCC',
					alpha: 1
				};
			},
			getPos3d: function (path3d) {
				var direction = !un(path3d.direction) ? path3d.direction : [0, 0, 1];
				var width = path3d.size * path3d.squares;
				var v = [],
				e = [],
				f = [];

				if (arraysEqual(direction, [0, 0, 1])) {
					var paths = [];
					for (var i = 0; i <= path3d.squares; i++) {
						var pos2 = -width / 2 + i * path3d.size;
						paths.push({
							pos: [[pos2, -width / 2, 0.001], [pos2, width / 2, 0.001]],
							lineWidth: 1,
							strokeStyle: '#000'
						}, {
							pos: [[-width / 2, pos2, 0.001], [width / 2, pos2, 0.001]],
							lineWidth: 1,
							strokeStyle: '#000'
						});
					}
					var pos = [
						[ - (width) / 2,  - (width) / 2, 0],
						[ - (width) / 2, (width) / 2, 0],
						[(width) / 2, (width) / 2, 0],
						[(width) / 2,  - (width) / 2, 0]
					];
					var f = [{
							pos3d: clone(pos),
							stroke: false,
							fillStyle: '#CCC',
							drawFirst: true,
							paths: paths
						}, {
							pos3d: clone(pos).reverse(),
							stroke: false,
							fillStyle: '#CCC',
							drawFirst: true,
							paths: paths
						}
					];
				} else if (arraysEqual(direction, [1, 0, 0])) {
					var paths = [];
					for (var i = 0; i <= path3d.squares; i++) {
						var pos1 = i * path3d.size;
						var pos2 = -width / 2 + i * path3d.size;
						paths.push({
							pos: [[-width / 2 + 0.001, pos2, 0], [-width / 2 + 0.001, pos2, width]],
							lineWidth: 1,
							strokeStyle: '#000'
						}, {
							pos: [[-width / 2 + 0.001, -width / 2, pos1], [-width / 2 + 0.001, width / 2, pos1]],
							lineWidth: 1,
							strokeStyle: '#000'
						});
					}
					var pos = [
						[-width / 2, -width / 2, 0],
						[-width / 2, -width / 2, width],
						[-width / 2, width / 2, width],
						[-width / 2, width / 2, 0]
					];
					var f = [{
							pos3d: clone(pos),
							stroke: false,
							fillStyle: '#CCC',
							drawFirst: true,
							paths: paths
						}, {
							pos3d: clone(pos).reverse(),
							stroke: false,
							fillStyle: '#CCC',
							drawFirst: true,
							paths: paths
						}
					];
				} else if (arraysEqual(direction, [0, 1, 0])) {
					var paths = [];
					for (var i = 0; i <= path3d.squares; i++) {
						var pos1 = i * path3d.size;
						var pos2 = -width / 2 + i * path3d.size;
						paths.push({
							pos: [[pos2, -width / 2 + 0.001, 0], [pos2, -width / 2 + 0.001, width]],
							lineWidth: 1,
							strokeStyle: '#000'
						}, {
							pos: [[-width / 2, -width / 2 + 0.001, pos1], [width / 2, -width / 2 + 0.001, pos1]],
							lineWidth: 1,
							strokeStyle: '#000'
						});
					}
					var pos = [
						[-width / 2, -width / 2, 0],
						[-width / 2, -width / 2, width],
						[width / 2, -width / 2, width],
						[width / 2, -width / 2, 0]
					];
					var f = [{
							pos3d: clone(pos),
							stroke: false,
							fillStyle: '#CCC',
							drawFirst: true,
							paths: paths
						}, {
							pos3d: clone(pos).reverse(),
							stroke: false,
							fillStyle: '#CCC',
							drawFirst: true,
							paths: paths
						}
					];
				}
				e = [];
				return {
					vertices: v,
					faces: f,
					edges: e
				};
			},
			scale: function (path3d, sf) {
				path3d.size *= sf;
			},
			getUnitPolygons: function (obj, path3d) {}
		},
		dotGrid: {
			get: function () {
				var obj = sel();
				return {
					type: 'dotGrid',
					squares: Math.round(obj.gridSize / obj.gridStep),
					size: obj.gridStep,
					direction: [0, 0, 1],
					strokeStyle: '#999',
					fillStyle: '#999',
					alpha: 1
				};
			},
			getPos3d: function (path3d) {
				var direction = !un(path3d.direction) ? path3d.direction : [0, 0, 1];
				var width = path3d.size * path3d.squares;
				var v = [],
				e = [],
				f = [];

				if (arraysEqual(direction, [0, 0, 1])) {
					var paths = [];
					var min = path3d.infinite == true ? -16 : 0;
					var max = path3d.infinite == true ? 16 : path3d.squares;
					for (var i = min; i <= max; i++) {
						for (var j = min; j <= max; j++) {
							var pos1 = -width / 2 + i * path3d.size;
							var pos2 = -width / 2 + j * path3d.size;
							paths.push({
								pos: [pos1, pos2, 0],
								fillStyle: path3d.fillStyle,
								radius: 4,
								limit: boolean(path3d.infinite, false)
							});
						}
					}
					var pos = [
						[ - (width) / 2,  - (width) / 2, 0],
						[ - (width) / 2, (width) / 2, 0],
						[(width) / 2, (width) / 2, 0],
						[(width) / 2,  - (width) / 2, 0]
					];
					var f = [{
							pos3d: clone(pos),
							stroke: false,
							fill: false,
							drawFirst: false,
							paths: paths
						}
					];
				} else if (arraysEqual(direction, [1, 0, 0])) {
					var paths = [];
					var min = path3d.infinite == true ? -16 : 0;
					var max = path3d.infinite == true ? 16 : path3d.squares;
					for (var i = min; i <= max; i++) {
						for (var j = min; j <= max; j++) {
							var pos1 = -width / 2 + i * path3d.size;
							var pos2 = j * path3d.size;
							paths.push({
								pos: [-width / 2, pos1, pos2],
								fillStyle: path3d.fillStyle,
								radius: 4,
								limit: boolean(path3d.infinite, false)
							});
						}
					}
					var pos = [
						[-width / 2, -width / 2, 0],
						[-width / 2, -width / 2, width],
						[-width / 2, width / 2, width],
						[-width / 2, width / 2, 0]
					];
					var f = [{
							pos3d: clone(pos),
							stroke: false,
							fill: false,
							drawFirst: false,
							paths: paths
						}
					];
				} else if (arraysEqual(direction, [0, 1, 0])) {
					var paths = [];
					var min = path3d.infinite == true ? -16 : 0;
					var max = path3d.infinite == true ? 16 : path3d.squares;
					for (var i = min; i <= max; i++) {
						for (var j = min; j <= max; j++) {
							var pos1 = -width / 2 + i * path3d.size;
							var pos2 = j * path3d.size;
							paths.push({
								pos: [pos1, width / 2, pos2],
								fillStyle: path3d.fillStyle,
								radius: 4,
								limit: boolean(path3d.infinite, false)
							});
						}
					}
					var pos = [
						[-width / 2, width / 2, 0],
						[-width / 2, width / 2, width],
						[width / 2, width / 2, width],
						[width / 2, width / 2, 0]
					];
					var f = [{
							pos3d: clone(pos),
							stroke: false,
							fill: false,
							drawFirst: false,
							paths: paths
						}
					];
				}
				e = [];
				return {
					vertices: v,
					faces: f,
					edges: e
				};
			},
			scale: function (path3d, sf) {
				path3d.size *= sf;
			}
		},
		arrow: {
			getPos3d: function (path3d) {
				var direction = !un(path3d.direction) ? path3d.direction : [0, 0, 1];
				var v = [],
				e = [],
				f = [];
				var pos = draw.three.path3d.arrow.getPoints(path3d);
				f.push({
					pos3d: [pos[0], pos[2], pos[1], pos[3]],
					stroke: false,
					fill: false,
					paths: [{
							pos: [pos[0], pos[1]],
							strokeStyle: '#000',
							lineWidth: 2
						}, {
							pos: [pos[1], pos[2], pos[3]],
							fillStyle: '#000'
						},
					]
				});
				f.push({
					pos3d: [pos[0], pos[3], pos[1], pos[2]],
					stroke: false,
					fill: false,
					paths: [{
							pos: [pos[0], pos[1]],
							strokeStyle: '#000',
							lineWidth: 2
						}, {
							pos: [pos[1], pos[2], pos[3]],
							fillStyle: '#000'
						},
					]
				});
				return {
					vertices: v,
					faces: f,
					edges: e
				};
			},
			getPoints: function (path3d) {
				var arrowLength = path3d.arrowLength || 30;
				var angleBetweenLinesRads = path3d.angleBetweenLinesRads || 0.5;

				var p0 = path3d.pos[0];
				var p1 = path3d.pos[1];
				var gradient = (-1 * (p1[1] - p0[1])) / (p1[0] - [0][0]);

				var angleToHorizontal = Math.abs(Math.atan(gradient));
				var remainingAngle = Math.PI / 2 - angleBetweenLinesRads - angleToHorizontal;
				if (gradient !== 0 && p1[1] > p0[1]) { // downwards
					angleBetweenLinesRads = Math.PI - angleBetweenLinesRads
						remainingAngle = Math.PI / 2 - angleBetweenLinesRads - angleToHorizontal;
				}
				var v1 = [Math.sin(remainingAngle) * arrowLength, Math.cos(remainingAngle) * arrowLength];
				var v2 = [Math.cos(angleBetweenLinesRads - angleToHorizontal) * arrowLength, Math.sin(angleBetweenLinesRads - angleToHorizontal) * arrowLength];

				if ((gradient == Infinity) || (gradient < 0 && p1[1] < p0[1]) || (gradient == 0 && p1[0] < p0[0]) || (gradient < 0 && p1[1] > p0[1])) {
					var signs = [1, 1, 1, -1];
				} else if (gradient == -Infinity) {
					var signs = [1, -1, 1, 1];
				} else if ((gradient > 0 && p1[1] < p0[1]) || (gradient == 0 && p1[0] > p0[0]) || (gradient > 0 && p1[1] > p0[1])) {
					var signs = [-1, 1, -1, -1];
				}

				var p2 = [p1[0] + signs[0] * v1[0], p1[1] + signs[1] * v1[1]];
				var p3 = [p1[0] + signs[2] * v2[0], p1[1] + signs[3] * v2[1]];

				p1[2] = p0[2];
				p2[2] = p0[2];
				p3[2] = p0[2];
				return [p0, p1, p2, p3];
			},
			scale: function (path3d, sf) {
				path3d.pos[0][0] *= sf;
				path3d.pos[0][1] *= sf;
				path3d.pos[1][0] *= sf;
				path3d.pos[1][1] *= sf;
				if (!un(path3d.arrowLength))
					path3d.arrowLength *= sf;
			}
		},
		cuboid: {
			get: function () {
				var obj = sel();
				return {
					type: 'cuboid',
					pos: [-obj.gridStep, -obj.gridStep, 0],
					dims: [2 * obj.gridStep, 2 * obj.gridStep, 2 * obj.gridStep]
				};
			},
			getPos3d: function (path3d) {
				var pos = path3d.pos;
				var dims = path3d.dims;
				var v = [],
				e = [],
				f = [];
				var p = [
					[pos[0], pos[1], pos[2]],
					[pos[0] + dims[0], pos[1], pos[2]],
					[pos[0] + dims[0], pos[1] + dims[1], pos[2]],
					[pos[0], pos[1] + dims[1], pos[2]],
					[pos[0], pos[1], pos[2] + dims[2]],
					[pos[0] + dims[0], pos[1], pos[2] + dims[2]],
					[pos[0] + dims[0], pos[1] + dims[1], pos[2] + dims[2]],
					[pos[0], pos[1] + dims[1], pos[2] + dims[2]],
				];

				var labels = path3d.labels || [];
				for (var l = 0; l < labels.length; l++) {
					var label = labels[l];
					if (label.type == 'vertex') {
						var n = label.offsetMagnitude || 17;
						var offset = [
							[-n, -n, -n],
							[n, -n, -n],
							[n, n, -n],
							[-n, n, -n],
							[-n, -n, n],
							[n, -n, n],
							[n, n, n],
							[-n, n, n]
						][label.pos];
						label.pos3d = vector.addVectors(p[label.pos], offset);
					} else if (label.type == 'edge') {
						if (label.pos.length !== 2)
							continue;
						label.pos.sort();
						var a = label.pos[0];
						var b = label.pos[1];
						var n = label.offsetMagnitude || 25;
						var pos3d = vector.addVectors(p[a], p[b]);
						pos3d = [pos3d[0] / 2, pos3d[1] / 2, pos3d[2] / 2];
						var offset = [0, 0, 0];
						if (a == 0 && b == 1) {
							offset = [0, -n, -n];
						} else if (a == 1 && b == 2) {
							offset = [n, 0, -n];
						} else if (a == 2 && b == 3) {
							offset = [0, n, -n];
						} else if (a == 0 && b == 3) {
							offset = [-n, 0, -n];
						} else if (a == 0 && b == 4) {
							offset = [-n, -n, 0];
						} else if (a == 1 && b == 5) {
							offset = [n, -n, 0];
						} else if (a == 2 && b == 6) {
							offset = [n, n, 0];
						} else if (a == 3 && b == 7) {
							offset = [-n, n, 0];
						} else if (a == 4 && b == 5) {
							offset = [0, -n, n];
						} else if (a == 5 && b == 6) {
							offset = [n, 0, n];
						} else if (a == 6 && b == 7) {
							offset = [0, n, n];
						} else if (a == 4 && b == 7) {
							offset = [-n, 0, n];
						}
						label.pos3d = vector.addVectors(pos3d, offset);
					}
				}

				var f = [{
						pos3d: [p[3], p[2], p[1], p[0]],
						paths: [{
								pos: p[0],
								fillStyle: '#F00',
								strokeStyle: '#000',
								drag: draw.three.pointDragStart,
								vars: {
									type: 'center'
								},
								path3d: path3d,
								dragOnly: true
							}, {
								pos: p[1],
								fillStyle: '#00F',
								strokeStyle: '#000',
								drag: draw.three.pointDragStart,
								vars: {
									type: 'dim',
									dimIndex: 0
								},
								path3d: path3d,
								dragOnly: true
							}, {
								pos: p[3],
								fillStyle: '#00F',
								strokeStyle: '#000',
								drag: draw.three.pointDragStart,
								vars: {
									type: 'dim',
									dimIndex: 1
								},
								path3d: path3d,
								dragOnly: true
							}
						]
					}, {
						pos3d: [p[0], p[1], p[5], p[4]]
					}, {
						pos3d: [p[1], p[2], p[6], p[5]]
					}, {
						pos3d: [p[2], p[3], p[7], p[6]]
					}, {
						pos3d: [p[3], p[0], p[4], p[7]]
					}, {
						pos3d: [p[4], p[5], p[6], p[7]],
						paths: [{
								pos: p[4],
								fillStyle: '#060',
								strokeStyle: '#000',
								drag: draw.three.pointDragStart,
								vars: {
									type: 'dim',
									dimIndex: 2
								},
								path3d: path3d,
								dragOnly: true
							}
						]
					}
				];
				/* eg.
				path3d.angles = [{pos:[0,4,2],lineColor:'#000',lineWidth:2,fillColor:'#F00',radius:30,drawLines:true,drawCurve:true}];
				 */
				//console.log(p);
				if (!un(path3d.paths)) {
					for (var a = 0; a < path3d.paths.length; a++) {
						if (path3d.paths[a].type == 'angle') {
							var angle = path3d.paths[a];
							var anglePos = [p[angle.pos[0]], p[angle.pos[1]], p[angle.pos[2]]];
							var labelType = 'measure';
							if (angle.labelType == 'none') {
								labelType = 'none';
							} else if (!un(angle.label)) {
								labelType = 'custom';
								if (typeof angle.label == 'string')
									angle.label = [angle.label];
							}
							f.push({
								pos3d: anglePos,
								stroke: false,
								fill: false,
								drawFirst: boolean(angle.drawFirst, false),
								drawLast: boolean(angle.drawLast, false),
								paths: [{
										type: 'angle',
										pos: clone(anglePos),
										lineColor: angle.lineColor || '#000',
										lineWidth: angle.lineWidth || 2,
										fillColor: angle.fillColor || '#00F',
										radius: angle.radius || 50,
										drawLines: boolean(angle.drawLines, true),
										drawCurve: boolean(angle.drawCurve, true),
										fillTriangle: angle.fillTriangle || 'none',
										lineTriangle: angle.lineTriangle || 'none',
										labelType: labelType,
										label: angle.label || '',
										labelRadius: angle.labelRadius || ((angle.radius || 50) + 25),
										visible: boolean(angle.visible, true)
									}
								]
							});
						} else if (path3d.paths[a].type == 'polygon') {
							var polygon = path3d.paths[a];

							var polygonPos = [];
							for (var a2 = 0; a2 < polygon.pos.length; a2++) {
								if (typeof polygon.pos[a2] == 'object') {
									if (polygon.pos[a2].type == 'midpoint') {
										var pos1 = p[polygon.pos[a2].pos1];
										var pos2 = p[polygon.pos[a2].pos2];
										var pos3 = vector.addVectors(pos1, pos2);
										polygonPos[a2] = vector.setMagnitude(pos3, vector.getMagnitude(pos3) / 2);
									}
								} else if (typeof polygon.pos[a2] == 'number') {
									polygonPos[a2] = p[polygon.pos[a2]];
								}
							}

							f.push({
								pos3d: polygonPos,
								stroke: false,
								fill: false,
								paths: [{
										type: 'polygon',
										pos: clone(polygonPos),
										lineColor: polygon.lineColor || '#000',
										lineWidth: polygon.lineWidth || 2,
										fillColor: polygon.fillColor || '#00F',
										visible: boolean(polygon.visible, true)
									}
								]
							});
						} else if (path3d.paths[a].type == 'lineSegment') {
							var lineSegment = path3d.paths[a];

							if (typeof lineSegment.pos[0] == 'object') {
								if (lineSegment.pos[0].type == 'midpoint') {
									var c = p[lineSegment.pos[0].pos[0]];
									var d = p[lineSegment.pos[0].pos[1]];
									var m = vector.addVectors(clone(c), clone(d));
									var x = [m[0] / 2, m[1] / 2, m[2] / 2];
								}
							} else {
								var x = p[lineSegment.pos[0]];
							}
							if (typeof lineSegment.pos[1] == 'object') {
								if (lineSegment.pos[1].type == 'midpoint') {
									var c = p[lineSegment.pos[1].pos[0]];
									var d = p[lineSegment.pos[1].pos[1]];
									var m = vector.addVectors(clone(c), clone(d));
									var y = [m[0] / 2, m[1] / 2, m[2] / 2];
								}
							} else {
								var y = p[lineSegment.pos[1]];
							}

							var pos3 = vector.addVectors(y, [0, 0, -103]);
							var lineSegmentPos = [x, y, pos3];
							f.push({
								pos3d: [x, y],
								stroke: false,
								fill: false,
								paths: [{
										type: 'lineSegment',
										pos: [x, y],
										lineColor: lineSegment.lineColor || lineSegment.color || '#00F',
										lineWidth: lineSegment.lineWidth || lineSegment.width || 2,
										visible: boolean(lineSegment.visible, true)
									}
								]
							});
						}
					}
				}

				/*if (!un(path3d.diagonalFace0)) {
				f.push({pos3d:[p[0],p[4],p[6],p[2]]});
				}*/
				return {
					vertices: v,
					edges: e,
					faces: f,
					labels: labels
				};
			},
			pointDragMove: function (obj, path3d, vars) {
				switch (vars.type) {
				case 'center':
					var pos3d = draw.three.convert2dPosTo3d(obj, draw.mouse);
					if (!un(obj.gridBounds)) {
						path3d.pos[0] = Math.min(draw.three.snapPos(obj, pos3d[0], 0), obj.gridBounds[0][1] * obj.gridStep - path3d.dims[0]);
						path3d.pos[1] = Math.min(draw.three.snapPos(obj, pos3d[1], 1), obj.gridBounds[1][1] * obj.gridStep - path3d.dims[1]);
					} else {
						path3d.pos[0] = Math.min(draw.three.snapPos(obj, pos3d[0], 0), obj.gridSize / 2 - path3d.dims[0]);
						path3d.pos[1] = Math.min(draw.three.snapPos(obj, pos3d[1], 1), obj.gridSize / 2 - path3d.dims[1]);
					}
					break
				case 'dim':
					if (vars.dimIndex == 2) {
						var pos = draw.three.convert3dPosTo2d(obj, path3d.pos);
						path3d.dims[2] = draw.three.snapPos(obj, draw.three.convert2dHeightTo3d(obj, pos[1] - draw.mouse[1]), 2);
						var snapTo = obj.snapTo || obj.gridStep || 60;
						path3d.dims[2] = Math.max(path3d.dims[2], snapTo);
					} else {
						var pos = draw.three.convert2dPosTo3d(obj, draw.mouse);
						var snapTo = obj.snapTo || obj.gridStep || 60;
						var i = vars.dimIndex;
						if (!un(obj.gridBounds)) {
							path3d.dims[i] = bound(pos[i] - path3d.pos[i], obj.gridStep, obj.gridBounds[i][1] * obj.gridStep - path3d.pos[i], snapTo);
						} else {
							path3d.dims[i] = bound(pos[i], obj.gridStep, obj.gridSize - path3d.pos[i], snapTo);
						}
					}
					break;
				}
			},
			scale: function (path3d, sf) {
				for (var i = 0; i < 3; i++) {
					path3d.pos[i] *= sf;
					path3d.dims[i] *= sf;
				}
			}
		},
		prism: {
			get: function () {
				var obj = sel();
				var polygon = [];
				var da = 2 * Math.PI / 5;
				var a = -da / 2;
				for (var i = 0; i < 5; i++) {
					polygon.push([2 * obj.gridStep * Math.cos(a), 2 * obj.gridStep * Math.sin(a)]);
					a += da;
				}
				drawSelectedPaths();
				return {
					type: 'prism',
					polygon: polygon,
					center: [0, 0, 0],
					height: 4 * obj.gridStep
				};
			},
			rotate: function (obj, path3d) {
				if (un(path3d.direction) || arraysEqual(path3d.direction, [0, 0, 1])) {
					path3d.direction = [1, 0, 0];
					path3d.center = [-obj.gridStep * 3, 0, obj.gridStep * 3];
				} else {
					path3d.direction = [0, 0, 1];
					path3d.center = [0, 0, 0];
				}
			},
			getPos3d: function (path3d) {
				var direction = !un(path3d.direction) ? path3d.direction : [0, 0, 1];
				var closed = !un(path3d.closed) ? path3d.closed : [true, true];
				var polygon = path3d.polygon;
				if (polygonClockwiseTest(polygon) == true)
					polygon.reverse();
				var c = path3d.center;
				var h = path3d.height;
				var v = [],
				e = [],
				f = [];
				var v1 = [],
				v2 = [];

				if (arraysEqual(direction, [0, 0, 1]) || arraysEqual(direction, [0, 0, -1])) {
					for (var p = 0; p < polygon.length; p++) {
						v1.push([polygon[p][0] + c[0], polygon[p][1] + c[1], c[2]]);
						v2.push([polygon[p][0] + c[0], polygon[p][1] + c[1], c[2] + h]);
					}
				} else if (arraysEqual(direction, [1, 0, 0]) || arraysEqual(direction, [-1, 0, 0])) {
					for (var p = 0; p < polygon.length; p++) {
						v1.push([c[0], polygon[p][0] + c[1], polygon[p][1] + c[2]]);
						v2.push([c[0] + h, polygon[p][0] + c[1], polygon[p][1] + c[2]]);
					}
				} else if (arraysEqual(direction, [0, 1, 0]) || arraysEqual(direction, [0, -1, 0])) {
					polygon.reverse();
					for (var p = 0; p < polygon.length; p++) {
						v1.push([polygon[p][0] + c[0], c[1], polygon[p][1] + c[2]]);
						v2.push([polygon[p][0] + c[0], c[1] + h, polygon[p][1] + c[2]]);
					}
				}

				if (arraysEqual(direction, [0, 0, 1]) || arraysEqual(direction, [0, 0, -1])) {
					var polygonPoints = [];
					for (var p = 0; p < v1.length; p++) {
						polygonPoints.push({
							pos: v1[p],
							fillStyle: '#F00',
							strokeStyle: '#000',
							drag: draw.three.pointDragStart,
							vars: {
								type: 'polygonPoint',
								pointIndex: p
							},
							path3d: path3d,
							dragOnly: true
						});
					}
					//polygonPoints.push({pos:c,fillStyle:'#00F',strokeStyle:'#000',drag:draw.three.pointDragStart,vars:{type:'center'},path3d:path3d,dragOnly:true});

					f.push({
						pos3d: clone(v1).reverse(),
						paths: polygonPoints
					});
					for (var p = 0; p < polygon.length; p++) {
						var next = (p + 1) % polygon.length;
						f.push({
							pos3d: [v1[p], v1[next], v2[next], v2[p]]
						});
					}
					f.push({
						pos3d: clone(v2),
						paths: [{
								pos: [c[0], c[1], c[2] + h],
								fillStyle: '#060',
								strokeStyle: '#000',
								drag: draw.three.pointDragStart,
								vars: {
									type: 'height'
								},
								path3d: path3d,
								dragOnly: true
							}
						]
					});
				} else {
					f.push({
						pos3d: clone(v1).reverse()
					});
					for (var p = 0; p < polygon.length; p++) {
						var next = (p + 1) % polygon.length;
						f.push({
							pos3d: [v1[p], v1[next], v2[next], v2[p]]
						});
					}
					f.push({
						pos3d: clone(v2)
					});
				}

				var labels = path3d.labels || [];
				if (!un(path3d.labels)) {
					for (var l = 0; l < labels.length; l++) {
						var label = labels[l];
						if (label.type == 'vertex') {
							var n = label.offsetMagnitude || 17;
							if (label.pos == 'center2') {
								label.pos3d = vector.addVectors([c[0], c[1], c[2] + h], [0, 0, 22]);
							} else if (label.pos == 'center1') {
								var offset = label.offset || [0, 0, 22];
								label.pos3d = vector.addVectors(clone(c), offset);
							} else {
								if (label.pos < polygon.length) {
									var vertexPos = v1[label.pos];
									var v3 = vector.getVectorAB(clone(c), vertexPos);
									var v4 = !un(label.offset) ? label.offset : vector.setMagnitude(v3, n * 1.5);
									label.pos3d = vector.addVectors(vertexPos, v4);
								} else {
									var vertexPos = v2[label.pos % polygon.length];
									var v3 = vector.getVectorAB([c[0], c[1], c[2] + h], vertexPos);
									var v4 = !un(label.offset) ? label.offset : vector.setMagnitude(v3, n * 1.5);
									label.pos3d = vector.addVectors(vertexPos, v4);
								}
							}
						} else if (label.type == 'edge') {
							if (label.pos.length !== 2)
								continue;

							var a = label.pos[0] < polygon.length ? v1[label.pos[0]] : v2[label.pos[0] % polygon.length];

							var b = label.pos[1] < polygon.length ? v1[label.pos[1]] : v2[label.pos[1] % polygon.length];

							var m = vector.addVectors(a, b);
							m = [m[0] / 2, m[1] / 2, m[2] / 2];

							if (!un(label.offset)) {
								var offset = label.offset;
							} else {
								if (label.pos[0] < polygon.length && label.pos[1] < polygon.length) {
									var cent = c;
								} else if (label.pos[0] >= polygon.length && label.pos[1] >= polygon.length) {
									var cent = [c[0], c[1], c[2] + h];
								} else {
									var cent = [c[0], c[1], c[2] + 0.5 * h];
								}

								var n = label.offsetMagnitude || 25;
								var offset = vector.getVectorAB(clone(cent), m);
								var offset = vector.setMagnitude(offset, n * 2);
							}

							label.pos3d = vector.addVectors(m, offset)
						}
					}
				}
				if (!un(path3d.paths)) {
					for (var a = 0; a < path3d.paths.length; a++) {
						if (path3d.paths[a].type == 'angle') {
							var angle = path3d.paths[a];

							var anglePos = [];
							for (var a2 = 0; a2 < 3; a2++) {
								if (typeof angle.pos[a2] == 'number') {
									if (angle.pos[a2] < polygon.length) {
										anglePos[a2] = v1[angle.pos[a2]];
									} else {
										anglePos[a2] = v2[angle.pos[a2] % polygon.length];
									}
								} else if (angle.pos[a2] == 'center1') {
									anglePos[a2] = clone(c);
								} else if (angle.pos[a2] == 'center2') {
									anglePos[a2] = [c[0], c[1], c[2] + h];
								}
							}

							var labelType = 'measure';
							if (angle.labelType == 'none') {
								labelType = 'none';
							} else if (!un(angle.label)) {
								labelType = 'custom';
								if (typeof angle.label == 'string')
									angle.label = [angle.label];
							}
							f.push({
								pos3d: anglePos,
								stroke: false,
								fill: false,
								paths: [{
										type: 'angle',
										pos: clone(anglePos),
										lineColor: angle.lineColor || '#000',
										lineWidth: angle.lineWidth || 2,
										fillColor: angle.fillColor || '#00F',
										radius: angle.radius || 50,
										drawLines: boolean(angle.drawLines, true),
										drawCurve: boolean(angle.drawCurve, true),
										fillTriangle: angle.fillTriangle || 'none',
										lineTriangle: angle.lineTriangle || 'none',
										labelType: labelType,
										label: angle.label || '',
										labelRadius: angle.labelRadius || ((angle.radius || 50) + 25),
										visible: boolean(angle.visible, true)
									}
								]
							});
						}
					}
				}

				return {
					vertices: v,
					edges: e,
					faces: f,
					labels: labels
				};
			},
			pointDragMove: function (obj, path3d, vars) {
				switch (vars.type) {
				case 'polygonPoint':
					var pos3d = draw.three.convert2dPosTo3d(obj, draw.mouse);
					var polygon = clone(path3d.polygon);
					var snapTo = obj.snapTo || obj.gridStep || 60;
					if (!un(obj.gridBounds)) {
						polygon[vars.pointIndex][0] = bound(pos3d[0], obj.gridBounds[0][0] * obj.gridStep, obj.gridBounds[0][1] * obj.gridStep, snapTo);
						polygon[vars.pointIndex][1] = bound(pos3d[1], obj.gridBounds[1][0] * obj.gridStep, obj.gridBounds[1][1] * obj.gridStep, snapTo);
					} else {
						polygon[vars.pointIndex][0] = bound(pos3d[0], -obj.gridSize, obj.gridSize, obj.snapTo);
						polygon[vars.pointIndex][1] = bound(pos3d[1], -obj.gridSize, obj.gridSize, obj.snapTo);
					}
					if (polygonSelfIntersect2(polygon) == false && polygonConvexTest(polygon) == true)
						path3d.polygon = polygon;
					break;
				case 'center':
					var pos3d = draw.three.convert2dPosTo3d(obj, draw.mouse);

					var poly = path3d.polygon;
					var xMin = xMax = poly[0][0];
					var yMin = yMax = poly[0][1];
					for (var p = 0; p < poly.length; p++) {
						xMin = Math.min(xMin, poly[p][0]);
						xMax = Math.max(xMax, poly[p][0]);
						yMin = Math.min(yMin, poly[p][1]);
						yMax = Math.max(yMax, poly[p][1]);
					}
					var dxMin = -obj.gridSize - xMin;
					var dxMax = obj.gridSize - xMax;
					var dyMin = -obj.gridSize - yMin;
					var dyMax = obj.gridSize - yMax;
					var dx = bound(pos3d[0] - path3d.center[0], dxMin, dxMax, obj.snapTo);
					var dy = bound(pos3d[1] - path3d.center[1], dyMin, dyMax, obj.snapTo);

					path3d.center[0] += dx;
					path3d.center[1] += dy;
					for (var p = 0; p < path3d.polygon.length; p++) {
						path3d.polygon[p][0] += dx;
						path3d.polygon[p][1] += dy;
					}
					break
				case 'height':
					var center = draw.three.convert3dPosTo2d(obj, path3d.center);
					var snapTo = obj.snapTo || obj.gridStep || 60;
					var height = draw.three.convert2dHeightTo3d(obj, center[1] - draw.mouse[1]);

					if (!un(obj.gridBounds)) {
						height = bound(height, obj.gridBounds[2][0] * obj.gridStep + snapTo, obj.gridBounds[2][1] * obj.gridStep, snapTo);
					} else {
						height = bound(height, -obj.gridSize, obj.gridSize, obj.snapTo);
						height = bound(height, -obj.gridSize, obj.gridSize, obj.snapTo);
					}
					path3d.height = height;

					break;
				}
			},
			scale: function (path3d, sf) {
				for (var i = 0; i < path3d.polygon.length; i++) {
					path3d.polygon[i][0] *= sf;
					path3d.polygon[i][1] *= sf;
				}
				for (var i = 0; i < path3d.center.length; i++)
					path3d.center[i] *= sf;
				path3d.height *= sf;
			}
		},
		pyramid: {
			get: function () {
				var obj = sel();
				var polygon = [];
				var da = 2 * Math.PI / 5;
				var a = -da / 2;
				for (var i = 0; i < 5; i++) {
					polygon.push([2 * obj.gridStep * Math.cos(a), 2 * obj.gridStep * Math.sin(a)]);
					a += da;
				}
				return {
					type: 'pyramid',
					polygon: polygon.reverse(),
					center: [0, 0, 0],
					height: 4 * obj.gridStep
				};
			},
			rotate: function (obj, path3d) {
				if (un(path3d.direction) || arraysEqual(path3d.direction, [0, 0, 1])) {
					path3d.direction = [1, 0, 0];
					path3d.center = [-obj.gridStep * 3, 0, obj.gridStep * 3];
				} else {
					path3d.direction = [0, 0, 1];
					path3d.center = [0, 0, 0];
				}
			},
			getPos3d: function (path3d) {
				var direction = !un(path3d.direction) ? path3d.direction : [0, 0, 1];
				var polygon = path3d.polygon;
				var c = path3d.center;
				var h = path3d.height;
				if (polygonClockwiseTest(polygon) == false)
					polygon.reverse();
				var vertex = [],
				pos = [],
				v = [],
				e = [],
				f = [];
				var polygonPoints = [];

				if (arraysEqual(direction, [0, 0, 1])) {
					for (var p = 0; p < polygon.length; p++) {
						pos.push([polygon[p][0], polygon[p][1], path3d.center[2]]);
						polygonPoints.push({
							pos: pos[p],
							fillStyle: '#F00',
							strokeStyle: '#000',
							drag: draw.three.pointDragStart,
							vars: {
								type: 'polygonPoint',
								pointIndex: p
							},
							path3d: path3d,
							dragOnly: true
						});
					}
					//polygonPoints.push({pos:c,fillStyle:'#00F',strokeStyle:'#000',drag:draw.three.pointDragStart,vars:{type:'center'},path3d:path3d,dragOnly:true});
					vertex = [c[0], c[1], c[2] + h];
				} else if (arraysEqual(direction, [1, 0, 0])) {
					for (var p = 0; p < polygon.length; p++)
						pos.push([path3d.center[0], polygon[p][0], polygon[p][1]]);
					vertex = [c[0] + h, c[1], c[2]];
				} else if (arraysEqual(direction, [0, 1, 0])) {
					for (var p = 0; p < polygon.length; p++)
						pos.push([polygon[p][0], path3d.center[1], polygon[p][1]]);
					vertex = [c[0], c[1] + h, c[2]];
				}

				f.push({
					pos3d: clone(pos),
					paths: polygonPoints
				});

				if (arraysEqual(direction, [0, 0, 1])) {
					f.push({
						pos3d: [[pos[0][0], pos[0][1], pos[0][2] + h], [pos[1][0], pos[1][1], pos[1][2] + h], [pos[2][0], pos[2][1], pos[2][2] + h]],
						fill: false,
						stroke: false,
						paths: [{
								pos: vertex,
								fillStyle: '#060',
								strokeStyle: '#000',
								drag: draw.three.pointDragStart,
								path3d: path3d,
								vars: {
									type: 'height'
								},
								dragOnly: true
							}
						]
					});
				}

				for (var p = 0; p < polygon.length; p++) {
					var next = (p + 1) % polygon.length;
					f.push({
						pos3d: [pos[next], pos[p], vertex]
					});
				}

				var labels = path3d.labels || [];
				if (!un(path3d.labels)) {
					for (var l = 0; l < labels.length; l++) {
						var label = labels[l];
						if (label.type == 'vertex') {
							var n = label.offsetMagnitude || 17;
							if (label.pos == 'apex') {
								label.pos3d = vector.addVectors(clone(vertex), [0, 0, 22]);
							} else if (label.pos == 'center') {
								var offset = label.offset || [n, n, 0];
								label.pos3d = vector.addVectors(clone(c), offset);
							} else {
								var vertexPos = polygonPoints[label.pos];
								var v1 = vector.getVectorAB(clone(c), vertexPos.pos);
								var v2 = vector.setMagnitude(v1, n * 2);
								label.pos3d = vector.addVectors(vertexPos.pos, v2);
							}
						} else if (label.type == 'midpoint') {
							if (label.pos[0] == 'center') {
								var pos1 = clone(c);
							} else if (label.pos[0] == 'apex') {
								var pos1 = clone(vertex);
							} else {
								var pos1 = polygonPoints[label.pos[0]].pos;
							}
							if (label.pos[1] == 'center') {
								var pos2 = clone(c);
							} else if (label.pos[1] == 'apex') {
								var pos2 = clone(vertex);
							} else {
								var pos2 = polygonPoints[label.pos[1]].pos;
							}
							var pos3 = vector.addVectors(pos1, pos2);
							label.pos3d = vector.setMagnitude(pos3, vector.getMagnitude(pos3) / 2);
							if (!un(label.offset)) {
								label.pos3d = vector.addVectors(label.pos3d, label.offset);
							}
						} else if (label.type == 'edge') {
							if (label.pos.length !== 2)
								continue;

							var a = label.pos[0] == 'apex' ? clone(vertex) : label.pos[0] == 'center' ? clone(c) : polygonPoints[label.pos[0]].pos;
							var b = label.pos[1] == 'apex' ? clone(vertex) : label.pos[1] == 'center' ? clone(c) : polygonPoints[label.pos[1]].pos;

							var m = vector.addVectors(a, b);
							m = [m[0] / 2, m[1] / 2, m[2] / 2];

							if (!un(label.offset)) {
								var offset = label.offset;
							} else {
								var n = label.offsetMagnitude || 25;
								var offset = vector.getVectorAB(clone(c), m);
								var offset = vector.setMagnitude(offset, n * 2);
							}

							label.pos3d = vector.addVectors(m, offset)
						}
					}
				}
				if (!un(path3d.paths)) {
					for (var a = 0; a < path3d.paths.length; a++) {
						if (path3d.paths[a].type == 'angle') {
							var angle = path3d.paths[a];

							var anglePos = [];
							for (var a2 = 0; a2 < 3; a2++) {
								if (typeof angle.pos[a2] == 'object') {
									if (angle.pos[a2].type == 'midpoint') {
										if (angle.pos[a2].pos1 == 'center') {
											var pos1 = clone(c);
										} else if (angle.pos[a2].pos1 == 'apex') {
											var pos1 = clone(vertex);
										} else {
											var pos1 = polygonPoints[angle.pos[a2].pos1].pos;
										}
										if (angle.pos[a2].pos2 == 'center') {
											var pos2 = clone(c);
										} else if (angle.pos[a2].pos2 == 'apex') {
											var pos2 = clone(vertex);
										} else {
											var pos2 = polygonPoints[angle.pos[a2].pos2].pos;
										}
										var pos3 = vector.addVectors(pos1, pos2);
										anglePos[a2] = vector.setMagnitude(pos3, vector.getMagnitude(pos3) / 2);
									}
								} else if (typeof angle.pos[a2] == 'number') {
									anglePos[a2] = polygonPoints[angle.pos[a2]].pos;
								} else if (angle.pos[a2] == 'center') {
									anglePos[a2] = clone(c);
								} else if (angle.pos[a2] == 'apex') {
									anglePos[a2] = clone(vertex);
								}
							}

							var labelType = 'measure';
							if (angle.labelType == 'none') {
								labelType = 'none';
							} else if (!un(angle.label)) {
								labelType = 'custom';
								if (typeof angle.label == 'string')
									angle.label = [angle.label];
							}
							f.push({
								pos3d: anglePos,
								stroke: false,
								fill: false,
								paths: [{
										type: 'angle',
										pos: clone(anglePos),
										lineColor: angle.lineColor || '#000',
										lineWidth: angle.lineWidth || 2,
										fillColor: angle.fillColor || '#00F',
										radius: angle.radius || 50,
										drawLines: boolean(angle.drawLines, true),
										drawCurve: boolean(angle.drawCurve, true),
										fillTriangle: angle.fillTriangle || 'none',
										lineTriangle: angle.lineTriangle || 'none',
										labelType: labelType,
										label: angle.label || '',
										labelRadius: angle.labelRadius || ((angle.radius || 50) + 25),
										visible: boolean(angle.visible, true)
									}
								]
							});
						} else if (path3d.paths[a].type == 'lineSegment') {
							var lineSegment = path3d.paths[a];

							var a = lineSegment.pos[0] == 'apex' ? clone(vertex) : lineSegment.pos[0] == 'center' ? clone(c) : polygonPoints[lineSegment.pos[0]].pos;
							var b = lineSegment.pos[1] == 'apex' ? clone(vertex) : lineSegment.pos[1] == 'center' ? clone(c) : polygonPoints[lineSegment.pos[1]].pos;

							/*var pos3 = vector.addVectors(p[lineSegment.pos[1]],[0,0.-103]);
							var lineSegmentPos = [
							p[lineSegment.pos[0]],
							p[lineSegment.pos[1]],
							pos3
							];*/
							f.push({
								pos3d: [a, b],
								stroke: false,
								fill: false,
								paths: [{
										type: 'lineSegment',
										pos: [a, b],
										lineColor: lineSegment.lineColor || lineSegment.color || '#00F',
										lineWidth: lineSegment.lineWidth || lineSegment.width || 2,
										visible: boolean(lineSegment.visible, true)
									}
								]
							});
						}
					}
				}

				return {
					vertices: v,
					edges: e,
					faces: f,
					labels: labels
				};
			},
			pointDragMove: function (obj, path3d, vars) {
				switch (vars.type) {
				case 'polygonPoint':
					var pos3d = draw.three.convert2dPosTo3d(obj, draw.mouse);
					var polygon = clone(path3d.polygon);
					var snapTo = obj.snapTo || obj.gridStep || 60;
					if (!un(obj.gridBounds)) {
						polygon[vars.pointIndex][0] = bound(pos3d[0], obj.gridBounds[0][0] * obj.gridStep, obj.gridBounds[0][1] * obj.gridStep, snapTo);
						polygon[vars.pointIndex][1] = bound(pos3d[1], obj.gridBounds[1][0] * obj.gridStep, obj.gridBounds[1][1] * obj.gridStep, snapTo);
					} else {
						polygon[vars.pointIndex][0] = bound(pos3d[0], -obj.gridSize, obj.gridSize, obj.snapTo);
						polygon[vars.pointIndex][1] = bound(pos3d[1], -obj.gridSize, obj.gridSize, obj.snapTo);
					}
					if (polygonSelfIntersect2(polygon) == false && polygonConvexTest(polygon) == true)
						path3d.polygon = polygon;
					break;
				case 'center':
					var pos3d = draw.three.convert2dPosTo3d(obj, draw.mouse);

					var poly = path3d.polygon;
					var xMin = xMax = poly[0][0];
					var yMin = yMax = poly[0][1];
					for (var p = 0; p < poly.length; p++) {
						xMin = Math.min(xMin, poly[p][0]);
						xMax = Math.max(xMax, poly[p][0]);
						yMin = Math.min(yMin, poly[p][1]);
						yMax = Math.max(yMax, poly[p][1]);
					}
					var dxMin = -obj.gridSize - xMin;
					var dxMax = obj.gridSize - xMax;
					var dyMin = -obj.gridSize - yMin;
					var dyMax = obj.gridSize - yMax;
					var dx = bound(pos3d[0] - path3d.center[0], dxMin, dxMax, obj.snapTo);
					var dy = bound(pos3d[1] - path3d.center[1], dyMin, dyMax, obj.snapTo);

					path3d.center[0] += dx;
					path3d.center[1] += dy;
					for (var p = 0; p < path3d.polygon.length; p++) {
						path3d.polygon[p][0] += dx;
						path3d.polygon[p][1] += dy;
					}
					break
				case 'height':
					var center = draw.three.convert3dPosTo2d(obj, path3d.center);
					var snapTo = obj.snapTo || obj.gridStep || 60;
					var height = draw.three.convert2dHeightTo3d(obj, center[1] - draw.mouse[1]);

					if (!un(obj.gridBounds)) {
						height = bound(height, obj.gridBounds[2][0] * obj.gridStep + snapTo, obj.gridBounds[2][1] * obj.gridStep, snapTo);
					} else {
						height = bound(height, -obj.gridSize, obj.gridSize, obj.snapTo);
						height = bound(height, -obj.gridSize, obj.gridSize, obj.snapTo);
					}
					path3d.height = height;
					break;
				}
			},
			scale: function (path3d, sf) {
				for (var i = 0; i < path3d.polygon.length; i++) {
					path3d.polygon[i][0] *= sf;
					path3d.polygon[i][1] *= sf;
				}
				for (var i = 0; i < path3d.center.length; i++)
					path3d.center[i] *= sf;
				path3d.height *= sf;
			}
		},
		skewPyramid: {
			getPos3d: function (path3d) {
				var polygon = path3d.polygon;
				var c = path3d.center;
				var vertex = path3d.vertex;
				if (polygonClockwiseTest(polygon) == false)
					polygon.reverse();
				var pos = [],
				v = [],
				e = [],
				f = [];

				for (var p = 0; p < polygon.length; p++) {
					pos.push([polygon[p][0], polygon[p][1], path3d.center[2]]);
				}

				f.push({
					pos3d: clone(pos)
				});

				if (boolean(path3d.showSides, true) !== false) {
					for (var p = 0; p < polygon.length; p++) {
						var next = (p + 1) % polygon.length;
						f.push({
							pos3d: [pos[next], pos[p], vertex]
						});
					}
				}

				var labels = path3d.labels || [];
				if (!un(path3d.labels)) {
					for (var l = 0; l < labels.length; l++) {
						var label = labels[l];
						if (label.type == 'vertex') {
							var n = label.offsetMagnitude || 17;
							if (label.pos == 'apex') {
								label.pos3d = vector.addVectors(clone(vertex), [0, 0, 22]);
							} else {
								var vertexPos = pos[label.pos];
								var v1 = vector.getVectorAB(clone(c), vertexPos);
								var v2 = vector.setMagnitude(v1, n * 2);
								label.pos3d = vector.addVectors(vertexPos, v2);
							}
						} else if (label.type == 'midpoint') {
							if (label.pos[0] == 'apex') {
								var pos1 = clone(vertex);
							} else {
								var pos1 = pos[label.pos[0]];
							}
							if (label.pos[1] == 'apex') {
								var pos2 = clone(vertex);
							} else {
								var pos2 = pos[label.pos[1]];
							}
							var pos3 = vector.addVectors(pos1, pos2);
							label.pos3d = vector.setMagnitude(pos3, vector.getMagnitude(pos3) / 2);
							if (!un(label.offset)) {
								label.pos3d = vector.addVectors(label.pos3d, label.offset);
							}
						} else if (label.type == 'edge') {
							if (label.pos.length !== 2)
								continue;

							var a = label.pos[0] == 'apex' ? clone(vertex) : pos[label.pos[0]];
							var b = label.pos[1] == 'apex' ? clone(vertex) : pos[label.pos[1]];

							var m = vector.addVectors(a, b);
							m = [m[0] / 2, m[1] / 2, m[2] / 2];

							if (!un(label.offset)) {
								var offset = label.offset;
							} else {
								var n = label.offsetMagnitude || 25;
								var offset = vector.getVectorAB(clone(c), m);
								var offset = vector.setMagnitude(offset, n * 2);
							}

							label.pos3d = vector.addVectors(m, offset)
						}
					}
				}
				if (!un(path3d.paths)) {
					for (var a = 0; a < path3d.paths.length; a++) {
						if (path3d.paths[a].type == 'angle') {
							var angle = path3d.paths[a];

							var anglePos = [];
							for (var a2 = 0; a2 < 3; a2++) {
								if (typeof angle.pos[a2] == 'object') {
									if (angle.pos[a2].type == 'midpoint') {
										if (angle.pos[a2].pos1 == 'apex') {
											var pos1 = clone(vertex);
										} else {
											var pos1 = pos[angle.pos[a2].pos1];
										}
										if (angle.pos[a2].pos2 == 'apex') {
											var pos2 = clone(vertex);
										} else {
											var pos2 = pos[angle.pos[a2].pos2];
										}
										var pos3 = vector.addVectors(pos1, pos2);
										anglePos[a2] = vector.setMagnitude(pos3, vector.getMagnitude(pos3) / 2);
									}
								} else if (typeof angle.pos[a2] == 'number') {
									anglePos[a2] = pos[angle.pos[a2]];
								} else if (angle.pos[a2] == 'apex') {
									anglePos[a2] = clone(vertex);
								}
							}

							var labelType = 'measure';
							if (angle.labelType == 'none') {
								labelType = 'none';
							} else if (!un(angle.label)) {
								labelType = 'custom';
								if (typeof angle.label == 'string')
									angle.label = [angle.label];
							}
							f.push({
								pos3d: anglePos,
								stroke: false,
								fill: false,
								paths: [{
										type: 'angle',
										pos: clone(anglePos),
										lineColor: angle.lineColor || '#000',
										lineWidth: angle.lineWidth || 2,
										fillColor: angle.fillColor || '#00F',
										radius: angle.radius || 50,
										drawLines: boolean(angle.drawLines, true),
										drawCurve: boolean(angle.drawCurve, true),
										fillTriangle: angle.fillTriangle || 'none',
										lineTriangle: angle.lineTriangle || 'none',
										labelType: labelType,
										label: angle.label || '',
										labelRadius: angle.labelRadius || ((angle.radius || 50) + 25),
										visible: boolean(angle.visible, true)
									}
								]
							});
						} else if (path3d.paths[a].type == 'polygon') {
							var polygon = path3d.paths[a];

							var polygonPos = [];
							for (var a2 = 0; a2 < polygon.pos.length; a2++) {
								if (typeof polygon.pos[a2] == 'object') {
									if (polygon.pos[a2].type == 'midpoint') {
										if (polygon.pos[a2].pos1 == 'apex') {
											var pos1 = clone(vertex);
										} else {
											var pos1 = pos[polygon.pos[a2].pos1];
										}
										if (polygon.pos[a2].pos2 == 'apex') {
											var pos2 = clone(vertex);
										} else {
											var pos2 = pos[polygon.pos[a2].pos2];
										}
										var pos3 = vector.addVectors(pos1, pos2);
										polygonPos[a2] = vector.setMagnitude(pos3, vector.getMagnitude(pos3) / 2);
									}
								} else if (typeof polygon.pos[a2] == 'number') {
									polygonPos[a2] = pos[polygon.pos[a2]];
								} else if (polygon.pos[a2] == 'apex') {
									polygonPos[a2] = clone(vertex);
								}
							}

							f.push({
								pos3d: polygonPos,
								stroke: false,
								fill: false,
								paths: [{
										type: 'polygon',
										pos: clone(polygonPos),
										lineColor: polygon.lineColor || '#000',
										lineWidth: polygon.lineWidth || 2,
										fillColor: polygon.fillColor || '#00F',
										visible: boolean(polygon.visible, true)
									}
								]
							});
						} else if (path3d.paths[a].type == 'lineSegment') {
							var lineSegment = path3d.paths[a];

							var b = lineSegment.pos[0] == 'apex' ? clone(vertex) : lineSegment.pos[0] == 'center' ? clone(c) : pos[lineSegment.pos[0]];
							var c = lineSegment.pos[1] == 'apex' ? clone(vertex) : lineSegment.pos[1] == 'center' ? clone(c) : pos[lineSegment.pos[1]];

							/*var pos3 = vector.addVectors(p[lineSegment.pos[1]],[0,0.-103]);
							var lineSegmentPos = [
							p[lineSegment.pos[0]],
							p[lineSegment.pos[1]],
							pos3
							];*/
							f.push({
								pos3d: [b, c],
								stroke: false,
								fill: false,
								paths: [{
										type: 'lineSegment',
										pos: [b, c],
										lineColor: lineSegment.lineColor || lineSegment.color || '#00F',
										lineWidth: lineSegment.lineWidth || lineSegment.width || 2,
										visible: boolean(lineSegment.visible, true)
									}
								]
							});
						}
					}
				}

				return {
					vertices: v,
					edges: e,
					faces: f,
					labels: labels
				};
			},
			scale: function (path3d, sf) {
				for (var i = 0; i < path3d.polygon.length; i++) {
					path3d.polygon[i][0] *= sf;
					path3d.polygon[i][1] *= sf;
				}
				for (var i = 0; i < path3d.center.length; i++)
					path3d.center[i] *= sf;
				for (var i = 0; i < path3d.vertex.length; i++)
					path3d.vertex[i] *= sf;
			}
		},
		cylinder: {
			get: function () {
				var obj = sel();
				return {
					type: 'cylinder',
					center: [0, 0, 0],
					radius: 2 * obj.gridStep,
					height: 4 * obj.gridStep
				};
			},
			rotate: function (obj, path3d) {
				if (un(path3d.direction) || arraysEqual(path3d.direction, [0, 0, 1])) {
					path3d.direction = [1, 0, 0];
					path3d.center = [-obj.gridStep * 3, 0, obj.gridStep * 3];
				} else {
					path3d.direction = [0, 0, 1];
					path3d.center = [0, 0, 0];
				}
			},
			getPos3d: function (path3d) {
				var direction = !un(path3d.direction) ? path3d.direction : [0, 0, 1];
				var closed = !un(path3d.closed) ? path3d.closed : [true, true];
				var c = path3d.center;
				var r = path3d.radius;
				var h = path3d.height;
				var f = [],
				e = [],
				v = [],
				v1 = [],
				v2 = [];
				var density = 200;
				var dAngle = 2 * Math.PI / density;
				var angle = 0;
				var paths1 = [];
				var paths2 = [];

				if (arraysEqual(direction, [0, 0, 1])) {
					for (var i = 0; i < density; i++) {
						v1.push([c[0] + r * Math.cos(angle), c[1] + r * Math.sin(angle), 0]);
						v2.push([c[0] + r * Math.cos(angle), c[1] + r * Math.sin(angle), h]);
						angle += dAngle;
					}
					paths1 = [{
							pos: c,
							fillStyle: '#F00',
							strokeStyle: '#000',
							drag: draw.three.pointDragStart,
							vars: {
								type: 'center'
							},
							path3d: path3d,
							dragOnly: true
						}, {
							pos: [c[0] + r, c[1], c[2]],
							fillStyle: '#00F',
							strokeStyle: '#000',
							drag: draw.three.pointDragStart,
							vars: {
								type: 'radius'
							},
							path3d: path3d,
							dragOnly: true
						}
					];
					paths2 = [{
							pos: [c[0], c[1], c[2] + h],
							fillStyle: '#060',
							strokeStyle: '#000',
							drag: draw.three.pointDragStart,
							vars: {
								type: 'height'
							},
							path3d: path3d,
							dragOnly: true
						}
					];
				} else if (arraysEqual(direction, [1, 0, 0])) {
					for (var i = 0; i < density; i++) {
						v1.push([0, c[0] + r * Math.cos(angle), c[1] + r * Math.sin(angle)]);
						v2.push([h, c[0] + r * Math.cos(angle), c[1] + r * Math.sin(angle)]);
						angle += dAngle;
					}
				} else if (arraysEqual(direction, [0, 1, 0])) {
					for (var i = 0; i < density; i++) {
						v1.push([c[0] + r * Math.cos(angle), 0, c[1] + r * Math.sin(angle)]);
						v2.push([c[0] + r * Math.cos(angle), h, c[1] + r * Math.sin(angle)]);
						angle += dAngle;
					}
				};

				f.push({
					pos3d: clone(v1).reverse(),
					paths: paths1
				});
				for (var i = 0; i < density; i++) {
					var next = (i + 1) % density;
					f.push({
						pos3d: [v1[i], v1[next], v2[next], v2[i]],
						stroke: false
					});
				}
				f.push({
					pos3d: clone(v2),
					paths: paths2
				});

				return {
					vertices: v,
					edges: e,
					faces: f
				};
			},
			pointDragMove: function (obj, path3d, vars) {
				switch (vars.type) {
				case 'center':
					var pos3d = draw.three.convert2dPosTo3d(obj, draw.mouse);
					path3d.center[0] = bound(pos3d[0], -obj.gridSize + path3d.radius, obj.gridSize - path3d.radius, obj.snapTo);
					path3d.center[1] = bound(pos3d[1], -obj.gridSize + path3d.radius, obj.gridSize - path3d.radius, obj.snapTo);
					break
				case 'radius':
					var pos3d = draw.three.convert2dPosTo3d(obj, draw.mouse);
					var rMax = Math.min(Math.abs(-obj.gridSize - path3d.center[0]), Math.abs(obj.gridSize - path3d.center[0]), Math.abs(-obj.gridSize - path3d.center[1]), Math.abs(obj.gridSize - path3d.center[1]));
					path3d.radius = Math.min(rMax, Math.abs(pos3d[0] - path3d.center[0]));
					break;
				case 'height':
					var center = draw.three.convert3dPosTo2d(obj, path3d.center);
					path3d.height = draw.three.snapPos(obj, draw.three.convert2dHeightTo3d(obj, center[1] - draw.mouse[1]), 2);
					break;
				}
			},
			scale: function (path3d, sf) {
				for (var i = 0; i < path3d.center.length; i++)
					path3d.center[i] *= sf;
				path3d.radius *= sf;
				path3d.height *= sf;
			}
		},
		cone: {
			get: function () {
				var obj = sel();
				return {
					type: 'cone',
					center: [0, 0, 0],
					radius: 2 * obj.gridStep,
					height: 4 * obj.gridStep
				};
			},
			rotate: function (obj, path3d) {
				if (un(path3d.direction) || arraysEqual(path3d.direction, [0, 0, 1])) {
					path3d.direction = [0, 0, -1];
					path3d.center[2] = obj.gridStep * 5;
				} else {
					path3d.direction = [0, 0, 1];
					path3d.center[2] = 0;
				}
			},
			getPos3d: function (path3d) {
				var direction = !un(path3d.direction) ? path3d.direction : [0, 0, 1];
				var c = path3d.center;
				var r = path3d.radius;
				var h = path3d.height;
				var p = [],
				v = [],
				e = [],
				f = [],
				paths1 = [],
				paths2 = [];

				var density = 200;
				var dAngle = 2 * Math.PI / density;
				var angle = 0;

				if (arraysEqual(direction, [0, 0, 1])) {
					var vertex = [c[0], c[1], c[2] + h];
					for (var i = 0; i < density; i++) {
						p.push([c[0] + r * Math.cos(angle), c[1] + r * Math.sin(angle), c[2]]);
						angle += dAngle;
					}
					paths1 = [{
							pos: c,
							fillStyle: '#F00',
							strokeStyle: '#000',
							drag: draw.three.pointDragStart,
							vars: {
								type: 'center'
							},
							path3d: path3d,
							dragOnly: true
						}, {
							pos: [c[0] + r, c[1], c[2]],
							fillStyle: '#00F',
							strokeStyle: '#000',
							drag: draw.three.pointDragStart,
							vars: {
								type: 'radius'
							},
							path3d: path3d,
							dragOnly: true
						},
					];
					paths2 = [{
							pos: vertex,
							fillStyle: '#060',
							strokeStyle: '#000',
							drag: draw.three.pointDragStart,
							path3d: path3d,
							vars: {
								type: 'height'
							},
							dragOnly: true
						}
					];
				} else if (arraysEqual(direction, [0, 0, -1])) {
					var vertex = [c[0], c[1], c[2] - h];
					for (var i = 0; i < density; i++) {
						p.push([c[0] + r * Math.cos(angle), c[1] + r * Math.sin(angle), c[2]]);
						angle += dAngle;
					}
				}

				f.push({
					pos3d: clone(p).reverse(),
					paths: paths1
				});
				for (var i = 0; i < density; i++) {
					var next = (i + 1) % density;
					f.push({
						pos3d: [p[next], p[i], vertex].reverse(),
						stroke: false
					});
				}
				f.push({
					pos3d: [[p[0][0], p[0][1], p[0][2] + h], [p[1][0], p[1][1], p[1][2] + h], [p[2][0], p[2][1], p[2][2] + h]],
					fill: false,
					stroke: false,
					paths: paths2
				});

				return {
					vertices: v,
					edges: e,
					faces: f
				};
			},
			drawEdges: function (ctx, obj, path3d) {
				var v3d = [path3d.center[0], path3d.center[1], path3d.center[2] + path3d.height];
				var v2d = draw.three.convert3dPosTo2d(obj, v3d);
				var c2d = draw.three.convert3dPosTo2d(obj, path3d.center);
				var rY = path3d.radius * obj.tilt;

				ctx.fillStyle = '#000';
				ctx.beginPath();
				ctx.arc(v2d[0], v2d[1], 1, 0, Math.PI * 2);
				ctx.fill();

				return;

				/*if (c2d[1] - v2d[1] < rY) {
				ctx.fillStyle = '#000';
				ctx.beginPath();
				ctx.arc(v2d[0],v2d[1],2,0,Math.PI*2);
				ctx.fill();
				} else {
				var p1 = [c2d[0]-path3d.radius,c2d[1]];
				var p2 = [c2d[0]+path3d.radius,c2d[1]];
				ctx.lineWidth = 1;
				ctx.strokeStyle = '#000';
				ctx.beginPath();
				ctx.moveTo(p1[0],p1[1]);
				ctx.lineTo(v2d[0],v2d[1]);
				ctx.lineTo(p2[0],p2[1]);
				ctx.stroke();
				}*/
			},
			pointDragMove: function (obj, path3d, vars) {
				switch (vars.type) {
				case 'center':
					var pos3d = draw.three.convert2dPosTo3d(obj, draw.mouse);
					path3d.center[0] = bound(pos3d[0], -obj.gridSize + path3d.radius, obj.gridSize - path3d.radius, obj.snapTo);
					path3d.center[1] = bound(pos3d[1], -obj.gridSize + path3d.radius, obj.gridSize - path3d.radius, obj.snapTo);
					break;
				case 'radius':
					var pos3d = draw.three.convert2dPosTo3d(obj, draw.mouse);
					var rMax = Math.min(
							Math.abs(-obj.gridSize - path3d.center[0]),
							Math.abs(obj.gridSize - path3d.center[0]),
							Math.abs(-obj.gridSize - path3d.center[1]),
							Math.abs(obj.gridSize - path3d.center[1]));
					path3d.radius = Math.min(rMax, Math.abs(pos3d[0] - path3d.center[0]));
					break;
				case 'height':
					var center = draw.three.convert3dPosTo2d(obj, path3d.center);
					path3d.height = draw.three.snapPos(obj, draw.three.convert2dHeightTo3d(obj, center[1] - draw.mouse[1]), 2);
					break;
				}
			},
			scale: function (path3d, sf) {
				for (var i = 0; i < path3d.center.length; i++)
					path3d.center[i] *= sf;
				path3d.radius *= sf;
				path3d.height *= sf;
			}
		},
		frustum: {
			get: function () {
				var obj = sel();
				return {
					type: 'frustum',
					center: [0, 0, 0],
					radius: [2 * obj.gridStep, 1.5 * obj.gridStep],
					height: 4 * obj.gridStep
				};
			},
			getPos3d: function (path3d) {
				var direction = !un(path3d.direction) ? path3d.direction : [0, 0, 1];
				var closed = !un(path3d.closed) ? path3d.closed : [true, true];
				var c = path3d.center;
				var r1 = path3d.radius[0];
				var r2 = path3d.radius[1];
				var h = path3d.height;
				var v = [],
				e = [],
				f = [];
				var v1 = [],
				v2 = [];
				var density = 200;
				var dAngle = 2 * Math.PI / density;
				var angle = 0;
				if (arraysEqual(direction, [0, 0, 1])) {
					for (var i = 0; i < density; i++) {
						v1.push([c[0] + r1 * Math.cos(angle), c[1] + r1 * Math.sin(angle), 0]);
						v2.push([c[0] + r2 * Math.cos(angle), c[1] + r2 * Math.sin(angle), h]);
						angle += dAngle;
					}
				} else if (arraysEqual(direction, [1, 0, 0])) {
					for (var i = 0; i < density; i++) {
						v1.push([0, c[0] + r1 * Math.cos(angle), c[1] + r1 * Math.sin(angle)]);
						v2.push([h, c[0] + r2 * Math.cos(angle), c[1] + r2 * Math.sin(angle)]);
						angle += dAngle;
					}
				} else if (arraysEqual(direction, [0, 1, 0])) {
					for (var i = 0; i < density; i++) {
						v1.push([c[0] + r1 * Math.cos(angle), 0, c[1] + r1 * Math.sin(angle)]);
						v2.push([c[0] + r2 * Math.cos(angle), h, c[1] + r2 * Math.sin(angle)]);
						angle += dAngle;
					}
				};

				/*if (closed[0] == true)*/
				f.push({
					pos3d: clone(v1).reverse(),
					paths: [{
							pos: c,
							fillStyle: '#F00',
							strokeStyle: '#000',
							drag: draw.three.pointDragStart,
							vars: {
								type: 'center'
							},
							path3d: path3d,
							dragOnly: true
						}, {
							pos: [c[0] + r1, c[1], c[2]],
							fillStyle: '#00F',
							strokeStyle: '#000',
							drag: draw.three.pointDragStart,
							vars: {
								type: 'radius1'
							},
							path3d: path3d,
							dragOnly: true
						},
					]
				});

				for (var i = 0; i < density; i++) {
					var next = (i + 1) % density;
					f.push({
						pos3d: [v1[i], v1[next], v2[next], v2[i]],
						stroke: false
					});
				}
				/*if (closed[1] == true)*/
				f.push({
					pos3d: clone(v2),
					paths: [{
							pos: [c[0], c[1], c[2] + h],
							fillStyle: '#060',
							strokeStyle: '#000',
							drag: draw.three.pointDragStart,
							vars: {
								type: 'height'
							},
							path3d: path3d,
							dragOnly: true
						}, {
							pos: [c[0] + r2, c[1], c[2] + h],
							fillStyle: '#00F',
							strokeStyle: '#000',
							drag: draw.three.pointDragStart,
							vars: {
								type: 'radius2'
							},
							path3d: path3d,
							dragOnly: true
						},
					]
				});
				return {
					vertices: v,
					edges: e,
					faces: f
				};
			},
			pointDragMove: function (obj, path3d, vars) {
				switch (vars.type) {
				case 'center':
					var pos3d = draw.three.convert2dPosTo3d(obj, draw.mouse);
					var r = Math.max(path3d.radius[0], path3d.radius[1]);
					path3d.center[0] = bound(pos3d[0], -obj.gridSize + r, obj.gridSize - r, obj.snapTo);
					path3d.center[1] = bound(pos3d[1], -obj.gridSize + r, obj.gridSize - r, obj.snapTo);
					break;
				case 'radius1':
					var pos3d = draw.three.convert2dPosTo3d(obj, draw.mouse);
					var rMax = Math.min(
							Math.abs(-obj.gridSize - path3d.center[0]),
							Math.abs(obj.gridSize - path3d.center[0]),
							Math.abs(-obj.gridSize - path3d.center[1]),
							Math.abs(obj.gridSize - path3d.center[1]));
					path3d.radius[0] = Math.min(rMax, Math.abs(pos3d[0] - path3d.center[0]));
					break;
				case 'radius2':
					var pos3d = draw.three.convert2dPosTo3d(obj, draw.mouse, path3d.height);
					var rMax = Math.min(
							Math.abs(-obj.gridSize - path3d.center[0]),
							Math.abs(obj.gridSize - path3d.center[0]),
							Math.abs(-obj.gridSize - path3d.center[1]),
							Math.abs(obj.gridSize - path3d.center[1]));
					path3d.radius[1] = Math.min(rMax, Math.abs(pos3d[0] - path3d.center[0]));
					break;
				case 'height':
					var center = draw.three.convert3dPosTo2d(obj, path3d.center);
					path3d.height = draw.three.snapPos(obj, draw.three.convert2dHeightTo3d(obj, center[1] - draw.mouse[1]), 2);
					break;
				}
			},
			scale: function (path3d, sf) {
				for (var i = 0; i < path3d.center.length; i++)
					path3d.center[i] *= sf;
				path3d.radius[0] *= sf;
				path3d.radius[1] *= sf;
				path3d.height *= sf;
			}
		},
		sphere: {
			get: function () {
				var obj = sel();
				return {
					type: 'sphere',
					center: [0, 0, 2 * obj.gridStep],
					radius: 2 * obj.gridStep
				};
			},
			getPos3d: function (path3d) {
				var c = path3d.center;
				var r = path3d.radius;
				var f = [],
				e = [],
				v = [];
				var density = 30; // must be even
				var dAngle = 2 * Math.PI / density;

				var angle1 = 0;
				var angle2 = 0;

				var pos = [];
				for (var i = 0; i < density; i++) {
					var pos2 = [];
					for (var j = 0; j < density; j++) {
						pos2.push([c[0] + r * (Math.sin(angle2) * Math.sin(angle1)), c[1] + r * Math.cos(angle2), c[2] + r * Math.sin(angle2) * Math.cos(angle1)]);
						angle2 += dAngle;
					}
					pos.push(pos2);
					angle1 += dAngle;
				}

				f.push({
					pos3d: [[c[0], c[1], c[2] - r], [c[0] - 1, c[1], c[2] - r], [c[0], c[1] - 1, c[2] - r]],
					stroke: false,
					fill: false,
					paths: [{
							pos: [c[0], c[1], c[2] - r],
							fillStyle: '#F00',
							strokeStyle: '#000',
							drag: draw.three.pointDragStart,
							vars: {
								type: 'center'
							},
							path3d: path3d,
							dragOnly: true
						},
					]
				});
				for (var i = 0; i < pos.length; i++) {
					var p1 = pos[i];
					var p2 = pos[(i + 1) % pos.length];
					for (var j = 0; j < p1.length / 2; j++) {
						var next = (j + 1) % p1.length;
						if (j == 0) {
							var pos2 = [p1[j], p1[next], p2[next]];
							f.push({
								pos3d: pos2,
								stroke: false
							});
						} else {
							var pos2 = [p1[j], p1[next], p2[next], p2[j]];
							f.push({
								pos3d: pos2,
								stroke: false
							});
						}
					}
				}
				f.push({
					pos3d: [[c[0], c[1], c[2] + r], [c[0] - 1, c[1], c[2] + r], [c[0], c[1] + 1, c[2] - r]].reverse(),
					stroke: false,
					fill: false,
					paths: [{
							pos: [c[0], c[1], c[2] + r],
							fillStyle: '#060',
							strokeStyle: '#000',
							drag: draw.three.pointDragStart,
							vars: {
								type: 'height'
							},
							path3d: path3d,
							dragOnly: true
						},
					]
				});

				return {
					vertices: v,
					edges: e,
					faces: f
				};
			},
			pointDragMove: function (obj, path3d, vars) {
				switch (vars.type) {
				case 'center':
					var pos3d = draw.three.convert2dPosTo3d(obj, draw.mouse);
					path3d.center[0] = bound(pos3d[0], -obj.gridSize + path3d.radius, obj.gridSize - path3d.radius, obj.snapTo);
					path3d.center[1] = bound(pos3d[1], -obj.gridSize + path3d.radius, obj.gridSize - path3d.radius, obj.snapTo);
					break;
				case 'height':
					var center = draw.three.convert3dPosTo2d(obj, [path3d.center[0], path3d.center[1], 0]);
					path3d.radius = bound((draw.three.convert2dHeightTo3d(obj, center[1] - draw.mouse[1])) / 2, obj.snapTo / 2, obj.gridSize, obj.snapTo / 2);
					path3d.center[2] = path3d.radius;
					break;
				}
			},
			scale: function (path3d, sf) {
				for (var i = 0; i < path3d.center.length; i++)
					path3d.center[i] *= sf;
				path3d.radius *= sf;
			}
		},
		cubeNet: {
			get: function () {
				var obj = sel();
				return {
					type: 'cubeNet',
					center: [0, 0, 0],
					width: obj.gridStep,
					open: 1
				}; // open: 1=closed, 0=open
			},
			getPos3d: function (path3d) {
				var c = path3d.center,
				w = path3d.width,
				o = path3d.open;
				var v = [],
				e = [],
				f = [];
				var p = [
					[c[0], c[1], c[2]],
					[c[0] + w, c[1], c[2]],
					[c[0] + w, c[1] + w, c[2]],
					[c[0], c[1] + w, c[2]]
				];
				var f = [{
						pos3d: [p[3], p[2], p[1], p[0]]
					}
				];
				for (var f2 = 0; f2 < 4; f2++) {
					var p1 = p[f2];
					var p2 = p[(f2 + 1) % 4];

					var vector1 = draw.three.getNormalToPlaneFromThreePoints(p1, p2, [p1[0], p1[1], p1[2] + 1]);
					var vector2 = [0, 0, w];
					var angle = o * draw.three.getAngleBetweenTwo3dVectors(vector1, vector2);
					var vector3 = [
						vector1[0] * Math.cos(angle) + vector2[0] * Math.sin(angle),
						vector1[1] * Math.cos(angle) + vector2[1] * Math.sin(angle),
						vector1[2] * Math.cos(angle) + vector2[2] * Math.sin(angle)
					];
					var p3 = [p1[0] + vector3[0], p1[1] + vector3[1], p1[2] + vector3[2]];
					var p4 = [p2[0] + vector3[0], p2[1] + vector3[1], p2[2] + vector3[2]];

					f.push({
						pos3d: [p1, p2, p4, p3]
					});
					if (f2 == 0) {
						var vector4 = [0, w, 0];
						var angle2 = o * 0.5 * Math.PI; //draw.three.getAngleBetweenTwo3dVectors(vector3,vector4);
						var vector5 = [
							vector3[0] * Math.cos(angle2) + vector4[0] * Math.sin(angle2),
							vector3[1] * Math.cos(angle2) + vector4[1] * Math.sin(angle2),
							vector3[2] * Math.cos(angle2) + vector4[2] * Math.sin(angle2)
						];
						var p5 = [p3[0] + vector5[0], p3[1] + vector5[1], p3[2] + vector5[2]];
						var p6 = [p4[0] + vector5[0], p4[1] + vector5[1], p4[2] + vector5[2]];

						f.push({
							pos3d: [p3, p4, p6, p5]
						});
					}
				}

				return {
					vertices: v,
					edges: e,
					faces: f
				};
			},
			scale: function (path3d, sf) {
				for (var i = 0; i < path3d.center.length; i++)
					path3d.center[i] *= sf;
				path3d.width *= sf;
			}
		},
		coneNet: {
			get: function () {
				//var obj = sel();
				return {
					type: 'coneNet',
					center: [0, 0, 0],
					faces: 120,
					radius: 200,
					angle: 150,
					color: '#99F',
					open: 0
				}; // open: 1=closed, 0=open
			},
			getPos3d: function (path3d) {
				path3d.foldAngle = draw.three.path3d.coneNet.getConeFoldAngle(path3d.radius, path3d.angle, path3d.faces);
				var color = path3d.color;
				var foldAngle = Math.PI - path3d.open * path3d.foldAngle;

				var r = path3d.radius;
				var a = path3d.angle * (Math.PI / 180) / path3d.faces;

				var polygons = [[
						[0, 0, 0],
						[r * Math.cos(0), r * Math.sin(0), 0],
						[r * Math.cos(a), r * Math.sin(a), 0]
					]];
				for (var i = 1; i < path3d.faces; i++) {
					var prev = polygons.last();
					var p1 = [0, 0, 0];
					var p2 = clone(prev[2]);
					var p3 = draw.three.rotatePointAboutLine(clone(prev[1]), p1, p2, foldAngle);
					polygons.push([p1, p2, p3]);
				}

				var faces = [];
				for (var i = 0; i < polygons.length; i++) {
					faces.push({
						pos3d: clone(polygons[i]),
						color: color,
						stroke: false
					}, {
						pos3d: clone(polygons[i].reverse()),
						color: color,
						stroke: false
					});
				}
				return {
					faces: faces
				};
			},
			scale: function (path3d, sf) {
				path3d.radius *= sf;
			},
			getConeFoldAngle: function (radius, angle, faces) {
				angle = angle * Math.PI / 180;
				var a = Math.sqrt(2 * radius * radius * (1 - Math.cos(angle / faces)));
				var h = Math.sqrt(radius * radius - (a * a) / 4);
				var t = 2 * Math.PI / faces;
				var r = a / (2 * Math.tan(t / 2));
				var HH = h * h - r * r;
				var RR = radius * radius - HH;
				var cosA = (RR + (2 * HH + RR) * Math.cos(t)) / (2 * HH + RR + RR * Math.cos(t));
				return Math.acos(cosA);
			}
		},
		cylinderNet: {
			get: function () {
				return {
					type: 'cylinderNet',
					center: [0, 0, 0],
					faces: 120,
					radius: 50,
					height: 200,
					color: '#99F',
					open: 0
				}; // open: 1=closed, 0=open
			},
			getPos3d: function (path3d) {
				var color = path3d.color;
				var extAngle = path3d.open * (2 * Math.PI / path3d.faces);

				//var c = [0,0,0];
				var h = path3d.height;
				var faces = [];
				var faceWidth = (2 * Math.PI * path3d.radius) / path3d.faces;

				var polygon = [];
				var polygon2 = [];
				var center = [-path3d.radius, 0, 0];
				var angle = (path3d.open - 1) * Math.PI / 2;
				for (var i = 0; i < path3d.faces; i++) {
					var a = i * 2 * Math.PI / path3d.faces;
					pos = draw.three.rotatePoint2([
								center[0] + path3d.radius * Math.cos(a),
								path3d.radius * Math.sin(a),
								0
							], 1, angle);
					polygon.unshift(pos);
					polygon2.push(pos);
				}
				faces.push({
					pos3d: polygon,
					color: color,
					drawOrder: 1
				}, {
					pos3d: polygon2,
					color: color,
					drawOrder: 1
				});

				var polygon = [];
				var polygon2 = [];
				var center = [-path3d.radius, 0, 0];
				var angle = (1 - path3d.open) * Math.PI / 2;
				for (var i = 0; i < path3d.faces; i++) {
					var a = i * 2 * Math.PI / path3d.faces;
					pos = draw.three.rotatePoint2([
								center[0] + path3d.radius * Math.cos(a),
								path3d.radius * Math.sin(a),
								0
							], 1, angle);
					pos[2] += h;
					polygon.unshift(pos);
					polygon2.push(pos);
				}
				faces.push({
					pos3d: polygon,
					color: color,
					drawOrder: 3
				}, {
					pos3d: polygon2,
					color: color,
					drawOrder: 3
				});

				var pos1 = [0, 0, 0]
				var pos2 = [0, 0, h];
				var angle = Math.PI / 2 - extAngle;
				for (var f = 0; f < path3d.faces / 2; f++) {
					if (f == 0) {
						angle += 1.5 * extAngle;
					} else {
						angle += extAngle;
					}
					var dir = [faceWidth * Math.cos(angle), faceWidth * Math.sin(angle), 0];
					var pos3 = [pos1[0] + dir[0], pos1[1] + dir[1], pos1[2] + dir[2]];
					var pos4 = [pos2[0] + dir[0], pos2[1] + dir[1], pos2[2] + dir[2]];
					faces.push({
						pos3d: clone([pos1, pos3, pos4, pos2]),
						color: color,
						stroke: false,
						drawOrder: 2
					}, {
						pos3d: clone([pos2, pos4, pos3, pos1]),
						color: color,
						stroke: false,
						drawOrder: 2
					});
					pos1 = pos3;
					pos2 = pos4;
				}

				var pos1 = [0, 0, 0]
				var pos2 = [0, 0, h];
				var angle = -extAngle - Math.PI / 2;
				for (var f = 0; f < path3d.faces / 2; f++) {
					if (f == 0) {
						angle += 0.5 * extAngle;
					} else {
						angle -= extAngle;
					}
					var dir = [faceWidth * Math.cos(angle), faceWidth * Math.sin(angle), 0];
					var pos3 = [pos1[0] + dir[0], pos1[1] + dir[1], pos1[2] + dir[2]];
					var pos4 = [pos2[0] + dir[0], pos2[1] + dir[1], pos2[2] + dir[2]];
					faces.push({
						pos3d: clone([pos1, pos3, pos4, pos2]),
						color: color,
						stroke: false,
						drawOrder: 2
					}, {
						pos3d: clone([pos2, pos4, pos3, pos1]),
						color: color,
						stroke: false,
						drawOrder: 2
					});
					pos1 = pos3;
					pos2 = pos4;
				}

				return {
					faces: faces
				};
			},
			scale: function (path3d, sf) {
				path3d.radius *= sf;
				path3d.height *= sf;
			}
		}

	},

	cubeDrawing: {
		getCursorPositionsBuild: function (obj) {
			var size = obj.gridStep;
			var squares = obj.gridSize / size;
			var polygons = [];
			// get base polygons
			for (var i = -squares / 2; i < squares / 2; i++) {
				for (var j = -squares / 2; j < squares / 2; j++) {
					var pos3d = [[i, j, 0], [i + 1, j, 0], [i + 1, j + 1, 0], [i, j + 1, 0]];
					var pos2d = [];
					for (var p = 0; p < pos3d.length; p++) {
						var pos = [pos3d[p][0] * obj.gridStep, pos3d[p][1] * obj.gridStep, pos3d[p][2] * obj.gridStep];
						pos2d[p] = draw.three.convert3dPosTo2d(obj, pos);
					}
					polygons.push({
						pos3d: pos3d,
						pos2d: pos2d,
						center: [i, j, 0]
					});
				}
			}
			if (un(obj._cubeFaces))
				return polygons;
			// get cube face polygons
			for (var f = 0; f < obj._cubeFaces.length; f++) {
				var face = obj._cubeFaces[f];
				var center = [face.pos[0] / size + face.normal[0], face.pos[1] / size + face.normal[1], face.pos[2] / size + face.normal[2]];
				polygons.push({
					pos3d: face.pos3d,
					pos2d: face.pos2d,
					center: center
				});
			}
			return polygons;
		},
		getCursorPositionsRemove: function (obj) {
			if (un(obj._cubeFaces))
				return [];
			var size = obj.gridStep;
			var squares = obj.gridSize / size;
			var polygons = [];
			// get cube face polygons
			for (var f = 0; f < obj._cubeFaces.length; f++) {
				var face = obj._cubeFaces[f];
				var center = [face.pos[0] / size, face.pos[1] / size, face.pos[2] / size];
				polygons.push({
					pos3d: face.pos3d,
					pos2d: face.pos2d,
					center: center
				});
			}
			return polygons;
		},
		click: function () {
			var mode = draw.currCursor.mode;
			var obj = draw.currCursor.obj;
			var size = obj.gridStep;
			var center = draw.currCursor.position.center;
			if (mode == 'remove') {
				draw.three.cubeDrawing.removeCubeAtPosition(obj, center);
			} else {
				draw.three.cubeDrawing.addCubeAtPosition(obj, center);
			}
			drawCanvasPaths();
		},
		isCubeAtPosition: function (obj, pos) {
			var size = obj.gridStep;
			for (var p = 0; p < obj.paths3d.length; p++) {
				var path3d = obj.paths3d[p];
				if (path3d.type !== 'cuboid')
					continue;
				if (path3d.pos[0] !== pos[0] * size || path3d.pos[1] !== pos[1] * size || path3d.pos[2] !== pos[2] * size)
					continue;
				if (path3d.dims[0] !== size || path3d.dims[1] !== size || path3d.dims[2] !== size)
					continue;
				return true;
			}
			return false;
		},
		addCubeAtPosition: function (obj, pos) {
			if (draw.three.cubeDrawing.isCubeAtPosition(obj, pos))
				return;
			var size = obj.gridStep;
			if (!un(obj.gridBounds)) {
				if (pos[0] < obj.gridBounds[0][0] || pos[0] + 1 > obj.gridBounds[0][1])
					return;
				if (pos[1] < obj.gridBounds[1][0] || pos[1] + 1 > obj.gridBounds[1][1])
					return;
				if (pos[2] < obj.gridBounds[2][0] || pos[2] + 1 > obj.gridBounds[2][1])
					return;
			}
			obj.paths3d.push({
				type: "cuboid",
				pos: [pos[0] * size, pos[1] * size, pos[2] * size],
				dims: [size, size, size]
			});
		},
		removeCubeAtPosition: function (obj, pos) {
			var size = obj.gridStep;
			for (var p = obj.paths3d.length - 1; p >= 0; p--) {
				var path3d = obj.paths3d[p];
				if (path3d.type !== 'cuboid')
					continue;
				if (path3d.pos[0] !== pos[0] * size || path3d.pos[1] !== pos[1] * size || path3d.pos[2] !== pos[2] * size)
					continue;
				if (path3d.dims[0] !== size || path3d.dims[1] !== size || path3d.dims[2] !== size)
					continue;
				obj.paths3d.splice(p, 1);
				return;
			}
		},
	},

	resizable: true,
	setSize: function (obj, size) {
		draw.three.scale(obj, size / obj.gridStep);
	},
	scale: function (obj, sf, center) {
		if (!un(center)) {
			obj.center[0] = center[0] + sf * (obj.center[0] - center[0]);
			obj.center[1] = center[1] + sf * (obj.center[1] - center[1]);
		}
		obj.gridStep *= sf;
		obj.gridSize *= sf;
		for (var p = 0; p < obj.paths3d.length; p++) {
			var path3d = obj.paths3d[p];
			if (un(draw.three.path3d[path3d.type]) || un(draw.three.path3d[path3d.type].scale))
				continue;
			draw.three.path3d[path3d.type].scale(path3d, sf);
		}
		draw.updateAllBorders();
		drawCanvasPaths();
		drawSelectCanvas();
	},

	draw: function (ctx, obj, path) {
		if (obj.paths3d.length == 0)
			return;
		var cameraDist = 1500;
		obj._camera = obj.tilt == 1 ? [0, 0, 1] : [Math.sin(-obj.angle), Math.cos(-obj.angle), draw.three.convert2dHeightTo3d(obj, obj.tilt)];
		obj._cameraPos = [cameraDist * obj._camera[0], cameraDist * obj._camera[1], cameraDist * obj._camera[2]];
		obj._light = [200 * Math.cos(-obj.angle), 200 * -Math.sin(-obj.angle), 300];
		//obj._light = obj._camera;
		obj._brightness = def([obj.brightness, 1]);
		obj._contrast = def([obj.contrast, 0.75]);
		obj._cubeFaces = [];
		var drawBackFaces = !un(obj.drawBackFaces) ? obj.drawBackFaces : 'auto';

		// version 3
		//console.log('----obj:',obj);

		// sort path3d by height of lowest point, then by closeness to front
		var paths3d = [];
		for (var p = 0; p < obj.paths3d.length; p++) {
			var path3d = obj.paths3d[p];
			if (path3d.type == 'custom') {
				if (!un(path3d.get)) {
					var get = path3d.get(obj, path3d);
					path3d._faces = get.faces;
					path3d._labels = get.labels || [];
				}
			} else if (un(draw.three.path3d[path3d.type]) || un(draw.three.path3d[path3d.type].getPos3d)) {
				continue;
			} else {
				var get = draw.three.path3d[path3d.type].getPos3d(path3d);
				path3d._faces = get.faces;
				path3d._labels = get.labels || [];
			}

			path3d._meanPoints = [];
			path3d._min;
			for (var f = 0; f < path3d._faces.length; f++) {
				path3d._meanPoints.push(draw.three.getMeanPoint(path3d._faces[f].pos3d));

				for (var v = 0; v < path3d._faces[f].pos3d.length; v++) {
					path3d._min = un(path3d._min) ? path3d._faces[f].pos3d[v][2] : Math.min(path3d._min, path3d._faces[f].pos3d[v][2]);
				}
			}
			path3d._meanPoint = draw.three.getMeanPoint(path3d._meanPoints);
			path3d._distanceToCamera = draw.three.getDistanceTwoPoints([path3d._meanPoint[0], path3d._meanPoint[1], 0], [obj._cameraPos[0], obj._cameraPos[1], 0]);

			paths3d.push(path3d);
		}

		paths3d.sort(function (a, b) {
			if (a.drawFirst == true || b.drawLast == true || ['grid', 'dotGrid', 'arrow'].includes(a.type))
				return -1;
			if (b.drawFirst == true || a.drawLast == true || ['grid', 'dotGrid', 'arrow'].includes(b.type))
				return 1;
			if (a._min < b._min)
				return -1;
			if (a._min > b._min)
				return 1;
			if (a._distanceToCamera > b._distanceToCamera)
				return -1;
			if (a._distanceToCamera < b._distanceToCamera)
				return 1;
		});

		// draw each path3d
		draw.three._dashLines = [];
		for (var p = 0; p < paths3d.length; p++) {
			var path3d = paths3d[p];
			//console.log('--path3d:',path3d);
			var elements = [];

			for (var f = 0; f < path3d._faces.length; f++) {
				var face = path3d._faces[f];
				if (face.draw === false || face.visible === false)
					continue;
				face.pos2d = [];
				for (var p2 = 0; p2 < face.pos3d.length; p2++)
					face.pos2d[p2] = draw.three.convert3dPosTo2d(obj, face.pos3d[p2]);
				face.normal = draw.three.getFaceNormal(face);
				face.angleToCamera = draw.three.getAngleBetweenTwo3dVectors(face.normal, obj._camera);
				face.angleToLight = draw.three.getAngleBetweenTwo3dVectors(face.normal, obj._light);
				face.meanPoint = draw.three.getMeanPoint(face.pos3d);
				face.distanceToCamera = draw.three.getDistanceTwoPoints(face.meanPoint, obj._cameraPos);
				if (draw.three.getAngleBetweenTwo3dVectors(face.normal, [0, 0, 1]) == 0)
					face.up = true;
				if (draw.three.getAngleBetweenTwo3dVectors(face.normal, [0, 0, -1]) == 0)
					face.down = true;
				face.type2 = 'face';
				elements.push(face);
			}

			for (var l = 0; l < path3d._labels.length; l++) {
				var label = path3d._labels[l];
				if (label.draw === false || label.visible === false)
					continue;
				label.pos2d = draw.three.convert3dPosTo2d(obj, label.pos3d);
				label.distanceToCamera = draw.three.getDistanceTwoPoints(label.pos3d, obj._cameraPos);
				label.type2 = 'label';
				elements.push(label);
			}

			elements.sort(function (a, b) {
				//if (a.up === true || b.down === true || b.meanPoint[2] == 0) return 1;
				//if (b.up === true || a.down === true || a.meanPoint[2] == 0) return -1;
				if (a.drawFirst == true || b.drawLast == true)
					return -1;
				if (b.drawFirst == true || a.drawLast == true)
					return 1;

				if (!un(a.drawOrder) && !un(b.drawOrder) && a.drawOrder !== b.drawOrder)
					return a.drawOrder - b.drawOrder;

				if (a.type2 == 'label' || b.type2 == 'label') {
					return b.distanceToCamera - a.distanceToCamera;
				}

				var v1 = vector.getVectorAB(obj._cameraPos, b.pos3d[0]);
				for (var p = 0; p < a.pos2d.length; p++) {
					var v2 = vector.getVectorAB(obj._cameraPos, a.pos3d[p]);
					var relLen = roundToNearest(vector.dotProduct(v1, b.normal) / vector.dotProduct(v2, b.normal) - 1, 0.001);
					if (Math.abs(relLen) > 0.01)
						return relLen;
				}
				var v1 = vector.getVectorAB(obj._cameraPos, a.pos3d[0]);
				for (var p = 0; p < b.pos2d.length; p++) {
					var v2 = vector.getVectorAB(obj._cameraPos, b.pos3d[p]);
					var relLen = roundToNearest(vector.dotProduct(v1, a.normal) / vector.dotProduct(v2, a.normal) - 1, 0.001);
					if (Math.abs(relLen) > 0.01)
						return -relLen;
				}
				/*var intersectionPolygon = polygonsIntersectionPolygon(a.pos2d,b.pos2d);
				if (intersectionPolygon.length > 0) {
				//console.log(a.pos2d,b.pos2d,intersectionPolygon);
				}*/

				/*var intersections = polygonIntersections(a.pos2d,b.pos2d);
				if (intersections.length > 0) {
				console.log(a,b,intersections);
				}*/
				/*for (var p = 0; p < b.pos2d.length; p++) {
				if (hitTestPolygon(b.pos2d[p],a.pos2d,false)) {
				var v1 = vector.getVectorAB(obj._cameraPos,a.pos3d[0]);
				var v2 = vector.getVectorAB(obj._cameraPos,b.pos3d[p]);
				var n = a.normal;
				var relLen = vector.dotProduct(v1,n)/vector.dotProduct(v2,n);
				console.log('b',p,a,b,v1,v2,n,relLen);
				return 1-relLen;
				}
				}*/

				/*
				for (var p = 0; p < a.pos3d.length; p++) {
				var dir = vector.getVectorAB(a.pos3d[p],a.pos3d[(p+1)%a.pos3d.length]);
				var unit = vector.getUnitVector(dir);
				var mag = vector.getMagnitude(dir);
				var n = 0;
				while (n < mag) {
				var pos3d = vector.addVectors(a.pos3d[p],unit,n);
				var pos2d = draw.three.convert3dPosTo2d(obj,pos3d);
				if (hitTestPolygon(pos2d,b.pos2d,true)) {
				var v1 = vector.getVectorAB(obj._cameraPos,b.pos3d[0]);
				var v2 = vector.getVectorAB(obj._cameraPos,pos3d);
				var relLen = roundToNearest(vector.dotProduct(v1,b.normal)/vector.dotProduct(v2,b.normal)-1,0.00001);
				if (relLen !== 0) {
				//console.log('a',p,pos3d,pos2d,b.pos3d,v1,v2,relLen);
				return relLen;
				}
				}
				n += 10;
				}
				}
				for (var p = 0; p < b.pos3d.length; p++) {
				var dir = vector.getVectorAB(b.pos3d[p],b.pos3d[(p+1)%b.pos3d.length]);
				var unit = vector.getUnitVector(dir);
				var mag = vector.getMagnitude(dir);
				var n = 0;
				while (n < mag) {
				var pos3d = vector.addVectors(b.pos3d[p],unit,n);
				var pos2d = draw.three.convert3dPosTo2d(obj,pos3d);
				if (hitTestPolygon(pos2d,a.pos2d,true)) {
				var v1 = vector.getVectorAB(obj._cameraPos,a.pos3d[0]);
				var v2 = vector.getVectorAB(obj._cameraPos,pos3d);
				var relLen = roundToNearest(vector.dotProduct(v1,a.normal)/vector.dotProduct(v2,a.normal)-1,0.00001);
				if (relLen !== 0) {
				//console.log('b',p,pos3d,pos2d,a.pos3d,v1,v2,relLen);
				return relLen;
				}
				}
				n += 10;
				}
				}
				//*/
				/*for (var p = 0; p < b.pos2d.length; p++) {
				if (hitTestPolygon(b.pos2d[p],a.pos2d,false)) {
				var v1 = vector.getVectorAB(obj._cameraPos,a.pos3d[0]);
				var v2 = vector.getVectorAB(obj._cameraPos,b.pos3d[p]);
				var n = a.normal;
				var relLen = vector.dotProduct(v1,n)/vector.dotProduct(v2,n);
				console.log('b',p,a,b,v1,v2,n,relLen);
				return 1-relLen;
				}
				}//*/
				if (b.angleToCamera !== a.angleToCamera)
					return Math.abs(b.angleToCamera) - Math.abs(a.angleToCamera);
				return b.distanceToCamera - a.distanceToCamera;
			});

			for (var f = 0; f < elements.length; f++) {
				var element = elements[f];
				if (element.type2 == 'face') {
					var face = element;
					if (face.angleToCamera > Math.PI / 2) {
						if (drawBackFaces == 'none')
							continue;
						if (drawBackFaces == 'dash' || drawBackFaces == 'outline')
							face.fill = false;
						if (drawBackFaces == 'dash')
							face.dash = [10, 10];
						if (drawBackFaces == 'outline')
							face.strokeStyle = '#666';
					}
					if (obj.directionalColors == true) {
						if (face.normal[0] == 0 && face.normal[1] == 0)
							face.fillStyle = '#F66';
						if (face.normal[0] == 0 && face.normal[2] == 0)
							face.fillStyle = '#66F';
						if (face.normal[1] == 0 && face.normal[2] == 0)
							face.fillStyle = '#6C6';
						if (un(face.fillStyle))
							face.fillStyle = '#FFF';
					} else {
						var brightness = obj._brightness - obj._contrast * face.angleToLight / Math.PI;
						var color = def([face.color, path3d.color, obj.fillStyle, '#0FF']);
						var alpha = def([path3d.alpha, obj.alpha, 0.5]);
						face.fillStyle = draw.three.getColor(color, brightness, alpha);
					}
					//console.log('face:',face);
					draw.three.drawFace(ctx, obj, face, path);
					if (boolean(obj.drawFaceNormals, false) == true)
						draw.three.drawNormalToFace(ctx, obj, face);
					if (face.angleToCamera < Math.PI / 2 && path3d.type == 'cuboid') {
						var face2 = clone(face);
						face2.dims = path3d.dims;
						face2.pos = path3d.pos;
						obj._cubeFaces.push(face2);
					}
				} else if (element.type2 == 'label') {
					draw.three.drawLabel(ctx, obj, element, path);
				}
			}
		}
		delete draw.three._dashLines;

		return;

		/* version 2
		obj._top = [obj.center[0],obj.center[1]-(1-obj.tilt)*obj.height];

		// collect all paths edges and vertices to draw
		var paths = [];
		for (var p = 0; p < obj.paths3d.length; p++) {
		var path3d = obj.paths3d[p];
		if (un(draw.three.path3d[path3d.type]) || un(draw.three.path3d[path3d.type].getPos3d)) continue;
		path3d._pos = draw.three.path3d[path3d.type].getPos3d(path3d);
		if (!un(path3d._pos.faces)) {
		for (var f = 0; f < path3d._pos.faces.length; f++) {
		var face = path3d._pos.faces[f];
		if (face.draw === false) continue;
		face.type = 'face';
		face.normal = draw.three.getFaceNormal(face);
		face.angleToCamera = draw.three.getAngleBetweenTwo3dVectors(face.normal,obj._camera);
		face.angleToLight = draw.three.getAngleBetweenTwo3dVectors(face.normal,obj._light);
		face.meanPoint = draw.three.getMeanPoint(face.pos3d);
		face.distanceToCamera = draw.three.getDistanceTwoPoints(face.meanPoint,obj._cameraPos);
		face.pathIndex = p;
		paths.push(face);
		}
		}
		if (!un(path3d._pos.edges)) {
		for (var e = 0; e < path3d._pos.edges.length; e++) {
		var edge = path3d._pos.edges[e];
		if (edge.draw === false) continue;
		edge.type = 'edge'
		edge.meanPoint = draw.three.getMeanPoint(edge.pos3d);
		edge.distanceToCamera = draw.three.getDistanceTwoPoints(edge.meanPoint,obj._cameraPos);
		edge.pathIndex = p;
		paths.push(edge);
		}
		}
		if (!un(path3d._pos.vertices)) {
		for (var v = 0; v < path3d._pos.vertices.length; v++) {
		var vertex = path3d._pos.vertices[v];
		if (vertex.draw === false) continue;
		vertex.type = 'vertex';
		vertex.meanPoint = vertex.pos3d;
		vertex.distanceToCamera = draw.three.getDistanceTwoPoints(vertex.meanPoint,obj._cameraPos);
		vertex.pathIndex = p;
		paths.push(vertex);
		}
		}
		};

		paths.sort(function(a,b) {
		if (a.drawFirst == true) return -1;
		if (b.drawFirst == true) return 1;
		if (!un(b.angleToCamera) && !un(a.angleToCamera)) return Math.abs(b.angleToCamera) - Math.abs(a.angleToCamera);
		return b.distanceToCamera - a.distanceToCamera;
		});

		draw.three._dashLines = [];
		for (var p = 0; p < paths.length; p++) {
		//console.log(p,paths[p]);
		var path3d = obj.paths3d[paths[p].pathIndex];
		if (paths[p].type == 'face') {
		var face = paths[p];
		if (face.angleToCamera > Math.PI/2) {
		if (drawBackFaces == 'none') continue;
		if (drawBackFaces == 'dash' || drawBackFaces == 'outline') face.fill = false;
		if (drawBackFaces == 'dash') face.dash = [10,10];
		if (drawBackFaces == 'outline') face.strokeStyle = '#666';
		}
		if (obj.directionalColors == true) {
		if (face.normal[0] == 0 && face.normal[1] == 0) face.fillStyle = '#F66';
		if (face.normal[0] == 0 && face.normal[2] == 0) face.fillStyle = '#66F';
		if (face.normal[1] == 0 && face.normal[2] == 0) face.fillStyle = '#6C6';
		if (un(face.fillStyle)) face.fillStyle = '#FFF';
		} else {
		var brightness = obj._brightness - obj._contrast*face.angleToLight/Math.PI;
		var color = def([path3d.color,obj.fillStyle,'#0FF']);
		var alpha = def([path3d.alpha,obj.alpha,0.5]);
		face.fillStyle = draw.three.getColor(color,brightness,alpha);
		}
		draw.three.drawFace(ctx,obj,face,path);
		if (boolean(obj.drawFaceNormals,false) == true) draw.three.drawNormalToFace(ctx,obj,face);
		}
		}
		delete draw.three._dashLines;
		 */
		/* version 1
		for (var p = 0; p < obj.paths3d.length; p++) {
		var path3d = obj.paths3d[p];
		if (un(draw.three.path3d[path3d.type])) continue;
		if (!un(draw.three.path3d[path3d.type].getPos3d)) {
		path3d._pos = draw.three.path3d[path3d.type].getPos3d(path3d);
		ctx.fillStyle = '#0FF';
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 1;
		var faces = path3d._pos.faces;
		for (var f = 0; f < faces.length; f++) {
		var face = faces[f];
		face.normal = draw.three.getFaceNormal(face);
		face.angleToCamera = draw.three.getAngleBetweenTwo3dVectors(face.normal,obj._camera);
		face.angleToLight = draw.three.getAngleBetweenTwo3dVectors(face.normal,obj._light);
		}
		var faces2 = faces.sort(function(a,b) {
		return Math.abs(b.angleToCamera) - Math.abs(a.angleToCamera);
		});
		var drawBackFaces = !un(obj.drawBackFaces) ? obj.drawBackFaces : 'auto';
		for (var f = 0; f < faces2.length; f++) {
		var face = faces2[f];
		if (face.angleToCamera > Math.PI/2) {
		if (drawBackFaces == 'none') continue;
		if (drawBackFaces == 'dash' || drawBackFaces == 'outline') face.fill = false;
		if (drawBackFaces == 'dash') face.dash = [10,10];
		if (drawBackFaces == 'outline') face.strokeStyle = '#666';
		} else {
		face.brightness = obj._brightness - obj._contrast*face.angleToLight/Math.PI;
		face.color = draw.three.getColor(path3d.color,face.brightness,path3d.alpha);
		face.fillStyle = face.color;
		}

		face.pos2d = [];
		for (var p2 = 0; p2 < face.pos3d.length; p2++) {
		face.pos2d[p2] = draw.three.convert3dPosTo2d(obj,face.pos3d[p2]);
		}

		draw.three.drawFace(ctx,face);
		if (boolean(obj.drawFaceNormals,false) == true) draw.three.drawNormalToFace(ctx,obj,face);
		}
		if (!un(path3d._pos.edges)) {
		for (var e = 0; e < path3d._pos.edges.length; e++) {
		var edge = path3d._pos.edges[e];
		//edge.fillStyle = '#F00';
		draw.three.drawEdge(ctx,obj,edge);
		}
		}
		for (var v = 0; v < path3d._pos.vertices.length; v++) {
		var vertex = {pos:path3d._pos.vertices[v]};
		vertex.fillStyle = '#F00';
		draw.three.drawVertex(ctx,obj,vertex);
		}
		} else {
		draw.three.path3d[path3d.type].draw(ctx,obj,path3d);
		}
		if (!un(draw.three.path3d[path3d.type].drawEdges)) {
		draw.three.path3d[path3d.type].drawEdges(ctx,obj,path3d);
		}
		if (!un(draw.three.path3d[path3d.type].getDragPoints)) {
		var dragPoints = draw.three.path3d[path3d.type].getDragPoints(obj,path3d);
		for (var d = 0; d < dragPoints.length; d++) {
		ctx.fillStyle = '#F00';
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.arc(dragPoints[d].dims[0],dragPoints[d].dims[1],dragPoints[d].dims[2],0,2*Math.PI);
		ctx.fill();
		ctx.stroke();
		}
		}
		}*/
	},
	drawFace: function (ctx, obj, face, path) {
		ctx.save();
		//face.pos2d = [];
		//for (var p2 = 0; p2 < face.pos3d.length; p2++) face.pos2d[p2] = draw.three.convert3dPosTo2d(obj,face.pos3d[p2]);
		ctx.beginPath();
		ctx.moveTo(face.pos2d[0][0], face.pos2d[0][1]);
		for (var i = 0; i < face.pos2d.length; i++)
			ctx.lineTo(face.pos2d[i][0], face.pos2d[i][1]);
		ctx.lineTo(face.pos2d[0][0], face.pos2d[0][1]);
		ctx.closePath();
		if (face.fill !== false && face.fillStyle !== 'none') {
			if (Math.abs(face.angleToCamera - Math.PI / 2) < 0.001 && face.stroke == false) {
				ctx.strokeStyle = face.fillStyle; // if face is observed as a line from the view angle
				ctx.lineWidth = 1;
				ctx.stroke();
			} else {
				ctx.fillStyle = face.fillStyle;
				ctx.fill();
			}
		}
		if (face.stroke !== false) {
			if (!un(face.dash)) {
				for (var i = 0; i < face.pos2d.length; i++) {
					var pos1 = face.pos2d[i];
					var pos2 = face.pos2d[(i + 1) % face.pos2d.length];
					var found = false;
					for (var k = 0; k < draw.three._dashLines.length; k++) {
						var pos3 = draw.three._dashLines[k][0];
						var pos4 = draw.three._dashLines[k][1];
						if ((arraysEqual(pos1, pos3) && arraysEqual(pos2, pos4)) || (arraysEqual(pos1, pos4) && arraysEqual(pos2, pos3))) {
							found = true;
							break;
						}
					}
					if (found == false) {
						ctx.setLineDash(face.dash);
						ctx.strokeStyle = def([face.strokeStyle, obj.strokeStyle, '#000']);
						ctx.lineWidth = def([face.lineWidth, obj.lineWidth, 1]);
						ctx.lineWidth = ctx.lineWidth * 0.75;
						ctx.lineJoin = 'round';
						ctx.lineCap = 'round';
						ctx.beginPath();
						ctx.moveTo(pos1[0], pos1[1]);
						ctx.lineTo(pos2[0], pos2[1]);
						ctx.stroke();
						ctx.setLineDash([]);
						draw.three._dashLines.push([pos1, pos2]);
					}
				}
			} else {
				ctx.strokeStyle = def([face.strokeStyle, obj.strokeStyle, '#000']);
				ctx.lineWidth = def([face.lineWidth, obj.lineWidth, 1]);
				ctx.lineJoin = 'round';
				ctx.lineCap = 'round';
				ctx.stroke();
			}
			if (obj.faceGrid == true) {
				if (face.normal[0] == 0 && face.normal[1] == 0) {
					var edges = [];
					var xMin = xMax = face.pos3d[0][0],
					yMin = yMax = face.pos3d[0][1];
					var z = face.pos3d[0][2];
					for (var v = 0; v < face.pos3d.length; v++) {
						xMin = Math.min(xMin, face.pos3d[v][0]);
						xMax = Math.max(xMax, face.pos3d[v][0]);
						yMin = Math.min(yMin, face.pos3d[v][1]);
						yMax = Math.max(yMax, face.pos3d[v][1]);
						edges.push([face.pos3d[v], face.pos3d[(v + 1) % face.pos3d.length]]);
					}
					var x = obj.gridStep * Math.ceil(xMin / obj.gridStep);
					while (x <= xMax) {
						var intersections = [];
						for (var e = 0; e < edges.length; e++) {
							var edge = edges[e];
							if (intersects2(x, 0, x, 1, edge[0][0], edge[0][1], edge[1][0], edge[1][1]) == true) {
								var inter = intersection(x, 0, x, 1, edge[0][0], edge[0][1], edge[1][0], edge[1][1]);
								inter.push(z);
								intersections.push(inter);
							}
						}
						if (intersections.length >= 2 && intersections.length <= 3)
							drawLineSegment(intersections);
						x += obj.gridStep;
					}
					var y = obj.gridStep * Math.ceil(yMin / obj.gridStep);
					while (y <= yMax) {
						var intersections = [];
						for (var e = 0; e < edges.length; e++) {
							var edge = edges[e];
							if (intersects2(0, y, 1, y, edge[0][0], edge[0][1], edge[1][0], edge[1][1]) == true) {
								var inter = intersection(0, y, 1, y, edge[0][0], edge[0][1], edge[1][0], edge[1][1]);
								inter.push(z);
								intersections.push(inter);
							}
						}
						if (intersections.length >= 2 && intersections.length <= 3)
							drawLineSegment(intersections);
						y += obj.gridStep;
					}
				} else if (face.normal[0] == 0 && face.normal[2] == 0) {
					var edges = [];
					var xMin = xMax = face.pos3d[0][0],
					zMin = zMax = face.pos3d[0][2];
					var y = face.pos3d[0][1];
					for (var v = 0; v < face.pos3d.length; v++) {
						xMin = Math.min(xMin, face.pos3d[v][0]);
						xMax = Math.max(xMax, face.pos3d[v][0]);
						zMin = Math.min(zMin, face.pos3d[v][2]);
						zMax = Math.max(zMax, face.pos3d[v][2]);
						edges.push([face.pos3d[v], face.pos3d[(v + 1) % face.pos3d.length]]);
					}
					var x = obj.gridStep * Math.ceil(xMin / obj.gridStep);
					while (x <= xMax) {
						var intersections = [];
						for (var e = 0; e < edges.length; e++) {
							var edge = edges[e];
							if (intersects2(x, 0, x, 1, edge[0][0], edge[0][2], edge[1][0], edge[1][2]) == true) {
								var inter = intersection(x, 0, x, 1, edge[0][0], edge[0][2], edge[1][0], edge[1][2]);
								inter = [inter[0], y, inter[1]];
								intersections.push(inter);
							}
						}
						if (intersections.length >= 2 && intersections.length <= 3)
							drawLineSegment(intersections);
						x += obj.gridStep;
					}
					var z = obj.gridStep * Math.ceil(zMin / obj.gridStep);
					while (z <= zMax) {
						var intersections = [];
						for (var e = 0; e < edges.length; e++) {
							var edge = edges[e];
							if (intersects2(0, z, 1, z, edge[0][0], edge[0][2], edge[1][0], edge[1][2]) == true) {
								var inter = intersection(0, z, 1, z, edge[0][0], edge[0][2], edge[1][0], edge[1][2]);
								inter = [inter[0], y, inter[1]];
								intersections.push(inter);
							}
						}
						if (intersections.length >= 2 && intersections.length <= 3)
							drawLineSegment(intersections);
						z += obj.gridStep;
					}
				} else if (face.normal[1] == 0 && face.normal[2] == 0) {
					var edges = [];
					var yMin = yMax = face.pos3d[0][1],
					zMin = zMax = face.pos3d[0][2];
					var x = face.pos3d[0][0];
					for (var v = 0; v < face.pos3d.length; v++) {
						yMin = Math.min(yMin, face.pos3d[v][1]);
						yMax = Math.max(yMax, face.pos3d[v][1]);
						zMin = Math.min(zMin, face.pos3d[v][2]);
						zMax = Math.max(zMax, face.pos3d[v][2]);
						edges.push([face.pos3d[v], face.pos3d[(v + 1) % face.pos3d.length]]);
					}
					var y = obj.gridStep * Math.ceil(yMin / obj.gridStep);
					while (y <= yMax) {
						var intersections = [];
						for (var e = 0; e < edges.length; e++) {
							var edge = edges[e];
							if (intersects2(y, 0, y, 1, edge[0][1], edge[0][2], edge[1][1], edge[1][2]) == true) {
								var inter = intersection(y, 0, y, 1, edge[0][1], edge[0][2], edge[1][1], edge[1][2]);
								inter.unshift(x);
								intersections.push(inter);
							}
						}
						if (intersections.length >= 2 && intersections.length <= 3)
							drawLineSegment(intersections);
						y += obj.gridStep;
					}
					var z = obj.gridStep * Math.ceil(zMin / obj.gridStep);
					while (z <= zMax) {
						var intersections = [];
						for (var e = 0; e < edges.length; e++) {
							var edge = edges[e];
							if (intersects2(0, z, 1, z, edge[0][1], edge[0][2], edge[1][1], edge[1][2]) == true) {
								var inter = intersection(0, z, 1, z, edge[0][1], edge[0][2], edge[1][1], edge[1][2]);
								inter.unshift(x);
								intersections.push(inter);
							}
						}
						if (intersections.length >= 2 && intersections.length <= 3)
							drawLineSegment(intersections);
						z += obj.gridStep;
					}
				}
			}
		}
		if (!un(face.paths)) {
			for (var p = 0; p < face.paths.length; p++) {
				if (face.paths[p].dragOnly == true && (path.selected !== true && (un(path.interact) || path.interact.edit3dShape !== true)))
					continue;
				draw.three.drawPath(ctx, obj, face.paths[p], face);
			}
		}
		ctx.restore();
		function drawLineSegment(pos3d) {
			ctx.beginPath();
			var pos1 = draw.three.convert3dPosTo2d(obj, pos3d[0]);
			var pos2 = draw.three.convert3dPosTo2d(obj, pos3d[1]);
			ctx.moveTo(pos1[0], pos1[1]);
			ctx.lineTo(pos2[0], pos2[1]);
			ctx.strokeStyle = def([face.strokeStyle, obj.strokeStyle, '#000']);
			ctx.lineWidth = def([face.lineWidth, obj.lineWidth, 1]);
			ctx.lineJoin = 'round';
			ctx.lineCap = 'round';
			ctx.stroke();
		}
	},
	drawPath: function (ctx, obj, path, face) {
		if (path instanceof Array) {
			for (var p = 0; p < path.length; p++)
				draw.three.drawPath(ctx, obj, path[p]);
			return;
		}
		if (boolean(path.visible, true) == false)
			return;
		if (!un(path.type) && !un(draw.three.drawPathType[path.type])) {
			draw.three.drawPathType[path.type](ctx, obj, path, face);
			return;
		};
		if (path.pos.length == 3 && typeof path.pos[0] == 'number' && typeof path.pos[1] == 'number' && typeof path.pos[2] == 'number') {
			var pos2d = draw.three.convert3dPosTo2d(obj, path.pos);
			if (path.limit == true && dist(obj.center[0], obj.center[1], pos2d[0], pos2d[1]) > Math.sqrt(2) * obj.gridSize)
				return;
			var radius = def([path.radius, obj.pointRadius, 8]);
			ctx.save();
			ctx.beginPath();
			ctx.moveTo(pos2d[0], pos2d[1]);
			ctx.arc(pos2d[0], pos2d[1], radius, 0, 2 * Math.PI);
			if (!un(path.fillStyle && path.fillStyle !== 'none')) {
				ctx.fillStyle = path.fillStyle;
				ctx.fill();
			}
			if (!un(path.strokeStyle && path.strokeStyle !== 'none')) {
				ctx.strokeStyle = path.strokeStyle;
				ctx.lineWidth = path.lineWidth || 1;
				ctx.stroke();
			}
			ctx.restore();
			return;
		}

		var pos2d = [];
		for (var p = 0; p < path.pos.length; p++)
			pos2d[p] = draw.three.convert3dPosTo2d(obj, path.pos[p]);
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(pos2d[0][0], pos2d[0][1]);
		for (var p = 0; p < pos2d.length; p++)
			ctx.lineTo(pos2d[p][0], pos2d[p][1]);
		if (path.close == true)
			path.closePath();
		if (!un(path.fillStyle && path.fillStyle !== 'none')) {
			ctx.fillStyle = path.fillStyle;
			ctx.fill();
		}
		if (!un(path.strokeStyle && path.strokeStyle !== 'none')) {
			ctx.strokeStyle = path.strokeStyle;
			ctx.lineWidth = path.lineWidth || 1;
			ctx.stroke();
		}
		ctx.restore();
	},
	drawPathType: {
		angle: function (ctx, obj, angle, face) {
			var v1 = vector.getVectorAB(angle.pos[1], angle.pos[0]);
			var v2 = vector.getVectorAB(angle.pos[1], angle.pos[2]);
			var angleMeasure = draw.three.getAngleBetweenTwo3dVectors(v1, v2);

			if (Math.abs(180 * angleMeasure / Math.PI - 90) < 0.5) { // right angle
				var v3 = vector.setMagnitude(v1, angle.radius * 0.5);
				var v4 = vector.setMagnitude(v2, angle.radius * 0.5);
				var p1 = vector.addVectors(angle.pos[1], v3);
				var p2 = vector.addVectors(angle.pos[1], v4);
				var p3 = vector.addVectors(p1, v4);

				var a = draw.three.convert3dPosTo2d(obj, angle.pos[0]);
				var b = draw.three.convert3dPosTo2d(obj, angle.pos[1]);
				var c = draw.three.convert3dPosTo2d(obj, angle.pos[2]);
				var d = draw.three.convert3dPosTo2d(obj, p1);
				var e = draw.three.convert3dPosTo2d(obj, p2);
				var f = draw.three.convert3dPosTo2d(obj, p3);

				ctx.save();
				if (!un(angle.fillTriangle) && angle.fillTriangle !== 'none' && angle.fillTriangle !== false) {
					ctx.fillStyle = angle.fillTriangle;
					ctx.beginPath();
					ctx.moveTo(a[0], a[1]);
					ctx.lineTo(b[0], b[1]);
					ctx.lineTo(c[0], c[1]);
					ctx.lineTo(a[0], a[1]);
					ctx.fill();
				}
				if (!un(angle.lineTriangle) && angle.lineTriangle !== 'none' && angle.lineTriangle !== false) {
					ctx.strokeStyle = angle.lineTriangle;
					ctx.lineWidth = angle.lineWidth;
					ctx.beginPath();
					ctx.moveTo(a[0], a[1]);
					ctx.lineTo(b[0], b[1]);
					ctx.lineTo(c[0], c[1]);
					ctx.lineTo(a[0], a[1]);
					ctx.stroke();
				}
				if (angle.fillColor !== 'none') {
					ctx.fillStyle = angle.fillColor;
					ctx.beginPath();
					ctx.moveTo(b[0], b[1]);
					ctx.lineTo(d[0], d[1]);
					ctx.lineTo(f[0], f[1]);
					ctx.lineTo(e[0], e[1]);
					ctx.lineTo(b[0], b[1]);
					ctx.fill();
				}
				if (angle.lineColor !== 'none') {
					ctx.strokeStyle = angle.lineColor;
					ctx.lineWidth = angle.lineWidth;
					if (angle.drawCurve !== false) {
						ctx.beginPath();
						ctx.lineTo(d[0], d[1]);
						ctx.lineTo(f[0], f[1]);
						ctx.lineTo(e[0], e[1]);
						ctx.stroke();
					}
					if (angle.drawLines !== false) {
						ctx.beginPath();
						ctx.moveTo(a[0], a[1])
						ctx.lineTo(b[0], b[1]);
						ctx.lineTo(c[0], c[1]);
						ctx.stroke();
					}
				}
				ctx.restore();

			} else {
				var normalVector = draw.three.getFaceNormal(face);
				var normalVector2 = vector.setMagnitude(normalVector, 100);
				var normPos2 = vector.addVectors(angle.pos[1], normalVector2);
				var radiusVector = vector.setMagnitude(v1, angle.radius);
				var pos = vector.addVectors(angle.pos[1], radiusVector);
				var curvePos = [clone(pos)];

				var v3 = clone(angle.pos[1]);
				var v4 = [-v3[0], -v3[1], -v3[2]];
				for (var a = 0.05; a < angleMeasure; a += 0.05) {
					pos = vector.addVectors(pos, v4);
					pos = draw.three.rotatePointAboutLine(pos, [0, 0, 0], normalVector2, -0.05);
					pos = vector.addVectors(pos, v3);
					curvePos.push(clone(pos));
				}
				var radiusVector2 = vector.setMagnitude(v2, angle.radius);
				var pos = vector.addVectors(angle.pos[1], radiusVector2);
				curvePos.push(clone(pos));

				var a = draw.three.convert3dPosTo2d(obj, angle.pos[0]);
				var b = draw.three.convert3dPosTo2d(obj, angle.pos[1]);
				var c = draw.three.convert3dPosTo2d(obj, angle.pos[2]);
				var curvePos2d = [];
				for (var p = 0; p < curvePos.length; p++) {
					curvePos2d[p] = draw.three.convert3dPosTo2d(obj, curvePos[p]);
				}

				ctx.save();
				if (!un(angle.fillTriangle) && angle.fillTriangle !== 'none') {
					ctx.fillStyle = angle.fillTriangle;
					ctx.beginPath();
					ctx.moveTo(a[0], a[1]);
					ctx.lineTo(b[0], b[1]);
					ctx.lineTo(c[0], c[1]);
					ctx.lineTo(a[0], a[1]);
					ctx.fill();
				}
				if (!un(angle.lineTriangle) && angle.lineTriangle !== 'none' && angle.lineTriangle !== false) {
					ctx.strokeStyle = angle.lineTriangle;
					ctx.lineWidth = angle.lineWidth;
					ctx.beginPath();
					ctx.moveTo(a[0], a[1]);
					ctx.lineTo(b[0], b[1]);
					ctx.lineTo(c[0], c[1]);
					ctx.lineTo(a[0], a[1]);
					ctx.stroke();
				}
				if (angle.fillColor !== 'none') {
					ctx.fillStyle = angle.fillColor;
					ctx.beginPath();
					ctx.moveTo(b[0], b[1]);
					for (var p = 0; p < curvePos2d.length; p++) {
						ctx.lineTo(curvePos2d[p][0], curvePos2d[p][1]);
					}
					ctx.lineTo(b[0], b[1]);
					ctx.fill();
				}
				if (angle.lineColor !== 'none') {
					ctx.strokeStyle = angle.lineColor;
					ctx.lineWidth = angle.lineWidth;
					if (angle.drawCurve !== false) {
						ctx.beginPath();
						ctx.moveTo(curvePos2d[0][0], curvePos2d[0][1]);
						for (var p = 1; p < curvePos2d.length; p++) {
							ctx.lineTo(curvePos2d[p][0], curvePos2d[p][1]);
						}
						ctx.stroke();
					}
					if (angle.drawLines !== false) {
						ctx.beginPath();
						ctx.moveTo(a[0], a[1])
						ctx.lineTo(b[0], b[1]);
						ctx.lineTo(c[0], c[1]);
						ctx.stroke();
					}
				}

				if (angle.labelType !== 'none' && Math.abs(face.angleToCamera - Math.PI / 2) > 0.1) {
					if (angle.labelType == 'measure') {
						var label = [Math.round(180 * angleMeasure / Math.PI) + degrees];
					} else {
						var label = angle.label;
					}

					var pos = vector.setMagnitude(v1, angle.labelRadius);
					pos = vector.addVectors(pos, angle.pos[1]);
					pos = vector.addVectors(pos, v4);
					pos = draw.three.rotatePointAboutLine(pos, [0, 0, 0], normalVector2, -angleMeasure / 2);
					pos = vector.addVectors(pos, v3);
					var pos2d = draw.three.convert3dPosTo2d(obj, pos);
					text({
						ctx: ctx,
						rect: [pos2d[0] - 50, pos2d[1] - 50, 100, 100],
						align: [0, 0],
						text: label
					});
				}
				ctx.restore();

			}
		},
		lineSegment: function (ctx, obj, lineSegment, face) {
			var a = draw.three.convert3dPosTo2d(obj, lineSegment.pos[0]);
			var b = draw.three.convert3dPosTo2d(obj, lineSegment.pos[1]);

			ctx.save();
			if (lineSegment.lineColor !== 'none') {
				ctx.strokeStyle = lineSegment.lineColor;
				ctx.lineWidth = lineSegment.lineWidth;
				ctx.beginPath();
				ctx.moveTo(a[0], a[1]);
				ctx.lineTo(b[0], b[1]);
				ctx.stroke();
			}
			ctx.restore();
		},
		polygon: function (ctx, obj, polygon, face) {
			var pos2d = [];
			for (var p = 0; p < polygon.pos.length; p++) {
				pos2d[p] = draw.three.convert3dPosTo2d(obj, polygon.pos[p]);
			}
			ctx.save();
			ctx.beginPath();
			ctx.moveTo(pos2d[0][0], pos2d[0][1]);
			for (var p = 1; p < pos2d.length; p++) {
				ctx.lineTo(pos2d[p][0], pos2d[p][1]);
			}
			if (boolean(polygon.close, true) == true)
				ctx.closePath();

			if (polygon.fillColor !== 'none' && polygon.fillColor !== false) {
				ctx.fillStyle = polygon.fillColor;
				ctx.fill();
			}
			if (polygon.lineColor !== 'none' && polygon.lineColor !== false) {
				ctx.strokeStyle = polygon.lineColor;
				ctx.lineWidth = polygon.lineWidth;
				ctx.stroke();
			}
			ctx.restore();
		}
	},
	drawLabel: function (ctx, obj, label, path) {
		var txt = label.text;
		if (typeof txt == 'string')
			txt = [txt];
		text({
			ctx: ctx,
			rect: [label.pos2d[0] - 100, label.pos2d[1] - 100, 200, 200],
			align: [0, 0],
			text: label.text
		});
	},

	getButtons: function (x1, y1, x2, y2, pathNum) {
		return [];
	},
	getCursorPositionsSelected: function (obj, pathNum, override) {
		if (draw.mode === 'interact' && override !== true)
			return [];
		var path = draw.path[pathNum];
		var pos = [];
		pos.push({
			shape: 'rect',
			dims: draw.three.getRect(obj),
			cursor: draw.cursors.move1,
			func: draw.three.drag3dStart,
			obj: obj
		});
		if (obj.mode === 'cubeBuilding') {
			var positions = draw.three.cubeDrawing.getCursorPositionsBuild(obj);
			draw.color = '#000';
			draw.cursors.update();
			for (var p2 = 0; p2 < positions.length; p2++) {
				pos.push({
					shape: 'polygon',
					dims: positions[p2].pos2d,
					cursor: 'url(' + draw.lineCursor + ') ' + draw.lineCursorHotspot[0] + ' ' + draw.lineCursorHotspot[1] + ', auto',
					func: draw.three.cubeDrawing.click,
					interact: true,
					path: path,
					obj: obj,
					position: positions[p2],
					mode: 'build'
				});
			}
		} else if (obj.mode === 'cubeRemoving') {
			var positions = draw.three.cubeDrawing.getCursorPositionsRemove(obj);
			draw.color = '#F00';
			draw.cursors.update();
			for (var p2 = 0; p2 < positions.length; p2++) {
				pos.push({
					shape: 'polygon',
					dims: positions[p2].pos2d,
					cursor: 'url(' + draw.lineCursor + ') ' + draw.lineCursorHotspot[0] + ' ' + draw.lineCursorHotspot[1] + ', auto',
					func: draw.three.cubeDrawing.click,
					interact: true,
					path: path,
					obj: obj,
					position: positions[p2],
					mode: 'remove'
				});
			}
		} else {
			for (var p = 0; p < obj.paths3d.length; p++) {
				var path3d = obj.paths3d[p];
				if (!un(draw.three.path3d[path3d.type]) && !un(draw.three.path3d[path3d.type].getDragPoints)) {
					pos = pos.concat(draw.three.path3d[path3d.type].getDragPoints(obj, path3d));
				}
				if (!un(path3d._faces)) {
					var radius = def([obj.pointRadius, 8]);
					for (var f = 0; f < path3d._faces.length; f++) {
						var face = path3d._faces[f];
						if (un(face.paths))
							continue;
						for (var i = 0; i < face.paths.length; i++) {
							var path = face.paths[i];
							var vars = path.vars || {};
							if (!un(path.drag)) {
								var pos2d = draw.three.convert3dPosTo2d(obj, path.pos);
								pos.push({
									shape: 'circle',
									dims: [pos2d[0], pos2d[1], radius],
									cursor: draw.cursors.pointer,
									func: path.drag,
									obj: obj,
									path3d: path3d,
									vars: vars
								});
							}
						}
					}
				}
			}
		}
		return pos;
	},
	getControlPanel: function (obj) {
		var elements = [{
				name: 'Style',
				type: 'style'
			}, {
				name: 'opacity',
				bold: false,
				fontSize: 18,
				margin: 0.1,
				type: 'slider',
				value: 'alpha',
				min: 0,
				max: 1,
				step: 0.01
			}, {
				name: 'contrast',
				bold: false,
				fontSize: 18,
				margin: 0.1,
				type: 'slider',
				value: 'contrast',
				min: 0,
				max: 1,
				step: 0.01
			}, {
				name: 'View',
				type: 'multiSelect',
				get: draw.three.getView,
				set: draw.three.setView,
				options: [['isometric', 'plan'], ['front', 'side']]
			}, {
				name: 'grid',
				bold: false,
				fontSize: 18,
				margin: 0.2,
				type: 'toggle',
				set: draw.three.toggleGrid,
				get: draw.three.checkPathForGrid
			}, {
				name: 'dots',
				bold: false,
				fontSize: 18,
				margin: 0.2,
				type: 'toggle',
				set: draw.three.toggleDots,
				get: draw.three.checkPathForDots
			}, {
				name: 'arrow',
				bold: false,
				fontSize: 18,
				margin: 0.2,
				type: 'toggle',
				set: draw.three.toggleArrow,
				get: draw.three.checkPathForArrow
			}, {
				name: 'directional colour',
				bold: false,
				fontSize: 18,
				margin: 0.2,
				type: 'toggle',
				set: draw.three.toggleDirectionalColors,
				get: draw.three.getDirectionalColors
			}, {
				name: 'face grid',
				bold: false,
				fontSize: 18,
				margin: 0.2,
				type: 'toggle',
				set: draw.three.toggleFaceGrid,
				get: draw.three.getFaceGrid
			}, {
				name: 'Shape',
				type: 'multiSelect',
				get: draw.three.getShape,
				set: draw.three.setShape,
				options: [['cuboid', 'prism'], ['pyramid', 'cylinder'], ['cone', 'frustum'], ['sphere']]
			},
		];
		if (draw.three.checkPathForType(obj, 'pyramid') || draw.three.checkPathForType(obj, 'prism')) {
			elements.push({
				name: 'base vertices',
				bold: false,
				fontSize: 18,
				margin: 0.05,
				type: 'increment',
				increment: draw.three.verticesChange,
				min: 3,
				max: 20
			})
		}
		elements.push({
			name: 'snap to grid',
			bold: false,
			fontSize: 18,
			margin: 0.2,
			type: 'toggle',
			set: draw.three.toggleSnap,
			get: draw.three.getSnap
		});
		if (draw.three.checkPathForType(obj, 'cubeNet')) {
			elements.push({
				name: 'fold',
				bold: false,
				fontSize: 18,
				margin: 0.1,
				type: 'slider',
				min: 0,
				max: 1,
				step: 0.01,
				get: draw.three.properties.netOpen.get,
				set: draw.three.properties.netOpen.set
			});
		}
		return {
			obj: obj,
			elements: elements
		};
	},
	getRect: function (obj) {
		//var x = obj.gridSize;//*Math.sqrt(2);
		//return [obj.center[0]-x,obj.center[1]-x,x*2,x*2];
		var xMin,
		xMax,
		yMin,
		yMax;
		for (var p = 0; p < obj.paths3d.length; p++) {
			var path3d = obj.paths3d[p];
			if (un(path3d._faces))
				continue;
			for (var f = 0; f < path3d._faces.length; f++) {
				var face = path3d._faces[f];
				if (un(face.pos3d))
					continue;
				for (var a = 0; a < face.pos3d.length; a++) {
					var pos = draw.three.convert3dPosTo2d(obj, face.pos3d[a]);
					xMin = (un(xMin)) ? pos[0] : Math.min(xMin, pos[0]);
					xMax = (un(xMax)) ? pos[0] : Math.max(xMax, pos[0]);
					yMin = (un(yMin)) ? pos[1] : Math.min(yMin, pos[1]);
					yMax = (un(yMax)) ? pos[1] : Math.max(yMax, pos[1]);
				}
			}
		}
		return [xMin, yMin, xMax - xMin, yMax - yMin];
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.center[0] += dl;
		obj.center[1] += dt;
		if (Math.abs(dw) < 0.0001 && Math.abs(dh) < 0.0001)
			return;
		if (Math.abs(dw) > Math.abs(dh)) {
			draw.three.scale(obj, Math.abs((obj.gridStep + dw) / obj.gridStep));
		} else {
			draw.three.scale(obj, Math.abs((obj.gridStep + dh) / obj.gridStep));
		}
	},
	getSnapPos: function (obj) {
		var vertices = [];
		var edges = [];

		for (var p = 0; p < obj.paths3d.length; p++) {
			var path3d = obj.paths3d[p];
			if (['grid', 'dotGrid', 'arrow'].includes(path3d.type))
				continue;
			if (un(path3d._faces))
				continue;
			for (var f = 0; f < path3d._faces.length; f++) {
				var face = path3d._faces[f];
				if (un(face.pos2d))
					continue;
				for (var a = 0; a < face.pos2d.length; a++) {
					vertices.push({
						type: 'point',
						pos: face.pos2d[a]
					});
					edges.push({
						type: 'line',
						pos1: face.pos2d[a],
						pos2: face.pos2d[(a + 1) % face.pos2d.length]
					});
				}
			}
		}
		return vertices.concat(edges);
	},

	properties: {
		dotGrid: {
			type: 'boolean',
			get: function (obj) {
				for (var p = 0; p < obj.paths3d.length; p++)
					if (obj.paths3d[p].type == 'dotGrid')
						return true;
				return false;
			},
			set: function (obj, value) {
				if (value == false) {
					for (var p = 0; p < obj.paths3d.length; p++) {
						if (obj.paths3d[p].type == 'dotGrid') {
							obj.paths3d.splice(p, 1);
							break;
						}
					}
				} else {
					for (var p = 0; p < obj.paths3d.length; p++) {
						if (obj.paths3d[p].type == 'grid') {
							obj.paths3d.splice(p, 1);
							break;
						}
					}
					obj.paths3d.unshift(draw.three.path3d.dotGrid.get());
				}
			}
		},
		grid: {
			type: 'boolean',
			get: function (obj) {
				for (var p = 0; p < obj.paths3d.length; p++)
					if (obj.paths3d[p].type == 'grid')
						return true;
				return false;
			},
			set: function (obj, value) {
				if (value == false) {
					for (var p = 0; p < obj.paths3d.length; p++) {
						if (obj.paths3d[p].type == 'grid') {
							obj.paths3d.splice(p, 1);
							break;
						}
					}
				} else {
					for (var p = 0; p < obj.paths3d.length; p++) {
						if (obj.paths3d[p].type == 'dotGrid') {
							obj.paths3d.splice(p, 1);
							break;
						}
					}
					obj.paths3d.unshift(draw.three.path3d.grid.get());
				}
			}
		},
		arrow: {
			type: 'boolean',
			get: function (obj) {
				for (var p = 0; p < obj.paths3d.length; p++)
					if (obj.paths3d[p].type == 'arrow')
						return true;
				return false;
			},
			set: function (obj, value) {
				if (value == false) {
					for (var p = 0; p < obj.paths3d.length; p++) {
						if (obj.paths3d[p].type == 'arrow') {
							obj.paths3d.splice(p, 1);
							break;
						}
					}
				} else {
					obj.paths3d.unshift(draw.three.paths3d.arrow.get());
				}
			}
		},
		directionalColors: {
			type: 'boolean',
			get: function (obj) {
				return boolean(obj.directionalColors, false);
			},
			set: function (obj, value) {
				obj.directionalColors = value;
			}
		},
		snap: {
			type: 'boolean',
			get: function (obj) {
				if (obj.snapTo > 1)
					return true;
				return false;
			},
			set: function (obj) {
				if (value == false) {
					obj.snapTo = 0.001;
				} else {
					obj.snapTo = obj.gridStep;
				}
			}
		},
		shape: {
			type: ['cuboid', 'prism', 'pyramid', 'cylinder', 'cone', 'frustum', 'sphere'],
			get: function (obj) {
				for (var p = 0; p < obj.paths3d.length; p++) {
					if (['grid', 'dotGrid', 'arrow'].includes(obj.paths3d[p].type) == false) {
						return obj.paths3d[p].type;
					}
				}
				return 'none';
			},
			set: function (obj, value) {
				for (var p = 0; p < obj.paths3d.length; p++)
					if (obj.paths3d[p].type == value)
						return;

				for (p = obj.paths3d.length - 1; p >= 0; p--) {
					var path3d = obj.paths3d[p];
					if (['grid', 'arrow', 'dotGrid'].includes(path3d.type))
						continue;
					obj.paths3d.splice(p, 1);
				}

				obj.paths3d.push(draw.three.path3d[type].get());
			},
			cycle: function (obj) {
				var current = this.get(obj);
				var index = this.type.indexOf(current);
				var next = this.type[(index + 1) % this.type.length];
				this.set(obj, next);
			}
		},

		view: {
			type: ['isometric', 'plan', 'front', 'side', 'none'],
			get: function (obj) {},
			set: function (obj, value) {},
			cycle: function (obj) {}
		},
		alpha: {
			type: 'number',
			min: 0,
			max: 1,
			get: function (obj) {},
			increment: function (obj, inc) {},
			set: function (obj, value) {}
		},
		contrast: {
			type: 'number',
			min: 0,
			max: 1,
			get: function (obj) {},
			increment: function (obj, inc) {},
			set: function (obj, value) {}
		},
		vertices: {
			type: 'number',
			min: 3,
			max: 20,
			get: function (obj) {},
			increment: function (obj, inc) {},
			set: function (obj, value) {}
		},
		netOpen: {
			type: 'number',
			min: 0,
			max: 1,
			get: function (obj) {
				for (var p = 0; p < obj.paths3d.length; p++) {
					var path3d = obj.paths3d[p];
					if (!un(path3d.open))
						return path3d.open;
				}
			},
			increment: function (obj, inc) {
				for (var p = 0; p < obj.paths3d.length; p++) {
					var path3d = obj.paths3d[p];
					if (!un(path3d.open))
						path3d.open += inc;
				}
			},
			set: function (obj, value) {
				for (var p = 0; p < obj.paths3d.length; p++) {
					var path3d = obj.paths3d[p];
					if (!un(path3d.open))
						path3d.open = value;
				}
			}
		},

		lineWidth: {
			type: 'number',
			min: 1,
			max: 5,
			inc: 1,
			get: function (obj) {},
			increment: function (obj, inc) {},
			set: function (obj, value) {}
		},
		lineDash: {
			type: 'number',
			min: 0,
			max: 20,
			inc: 5,
			get: function (obj) {},
			increment: function (obj, inc) {},
			set: function (obj, value) {}
		},
		lineColor: {
			type: 'color',
			get: function (obj) {},
			set: function (obj, value) {}
		},
		fillColor: {
			type: 'color',
			get: function (obj) {},
			set: function (obj, value) {}
		},
	},
	checkPathForType: function (obj, type) {
		for (var p = 0; p < obj.paths3d.length; p++)
			if (obj.paths3d[p].type == type)
				return true;
		return false;
	},

	setPath3d: function () {
		var obj = draw.path[draw.currCursor.pathNum].obj[0];
		var path = draw.currCursor.path3d;
		if (draw.three.checkPathForType(obj, path.type))
			return;
		var toDelete = [];
		for (p = obj.paths3d.length - 1; p >= 0; p--) {
			var path3d = obj.paths3d[p];
			if (['grid', 'arrow'].includes(path3d.type))
				continue;
			obj.paths3d.splice(p, 1);
		}
		obj.paths3d.push(clone(path));
		drawCanvasPaths();
	},
	toggleDots: function (obj) {
		if (draw.three.checkPathForDots(obj) == true) {
			for (var p = 0; p < obj.paths3d.length; p++) {
				if (obj.paths3d[p].type == 'dotGrid') {
					obj.paths3d.splice(p, 1);
					break;
				}
			}
		} else {
			for (var p = 0; p < obj.paths3d.length; p++) {
				if (obj.paths3d[p].type == 'grid') {
					obj.paths3d.splice(p, 1);
					break;
				}
			}
			obj.paths3d.unshift({
				type: 'dotGrid',
				squares: 8,
				size: obj.gridStep,
				direction: [0, 0, 1],
				strokeStyle: '#999',
				fillStyle: '#999',
				alpha: 1
			});
		}
		drawCanvasPaths();
	},
	toggleArrow: function (obj) {
		if (draw.three.checkPathForArrow(obj) == true) {
			for (var p = 0; p < obj.paths3d.length; p++) {
				if (obj.paths3d[p].type == 'arrow') {
					obj.paths3d.splice(p, 1);
					break;
				}
			}
		} else {
			obj.paths3d.unshift({
				type: 'arrow',
				pos: [[350, 0, 0], [250, 0, 0]],
				fill: true,
				color: '#000'
			});
		}
		drawCanvasPaths();
	},
	toggleGrid: function (obj, dir) {
		if (un(dir))
			dir = [0, 0, 1];
		if (draw.three.checkPathForGrid(obj, dir) == true) {
			for (var p = 0; p < obj.paths3d.length; p++) {
				if (obj.paths3d[p].type == 'grid' && arraysEqual(dir, obj.paths3d[p].direction)) {
					obj.paths3d.splice(p, 1);
					break;
				}
			}
		} else {
			for (var p = 0; p < obj.paths3d.length; p++) {
				if (obj.paths3d[p].type == 'dotGrid') {
					obj.paths3d.splice(p, 1);
					break;
				}
			}
			obj.paths3d.unshift({
				type: 'grid',
				squares: 8,
				size: obj.gridStep,
				direction: clone(dir),
				color: '#CCC',
				alpha: 1
			});
		}
		drawCanvasPaths();
	},
	toggleSnap: function (obj) {
		if (draw.three.getSnap(obj) == true) {
			obj.snapTo = 0.001;
		} else {
			obj.snapTo = obj.gridStep;
		}
		draw.updateSelectedBorders();
		drawCanvasPaths();
	},
	toggleDirectionalColors: function (obj) {
		obj.directionalColors = !draw.three.getDirectionalColors(obj);
		drawCanvasPaths();
	},
	toggleFaceGrid: function (obj, faceGrid) {
		obj.faceGrid = !obj.faceGrid;
		drawCanvasPaths();
	},
	setLineWidth: function (obj, lineWidth) {
		obj.lineWidth = lineWidth;
	},
	setLineColor: function (obj, strokeStyle) {
		obj.strokeStyle = strokeStyle;
	},
	setFillColor: function (obj, fillStyle) {
		obj.fillStyle = fillStyle;
	},
	setLineDash: function (obj, dash) {
		obj.dash = dash;
	},
	setShape: function (obj, type) {
		if (draw.three.checkPathForType(obj, type))
			return;
		var toDelete = [];
		for (p = obj.paths3d.length - 1; p >= 0; p--) {
			var path3d = obj.paths3d[p];
			if (['grid', 'arrow', 'dotGrid'].includes(path3d.type))
				continue;
			obj.paths3d.splice(p, 1);
		}
		obj.paths3d.push(draw.three.path3d[type].get());
	},
	setView: function (obj, angle, tilt) {
		if (angle == 'plan') {
			angle = 1.5 * Math.PI;
			tilt = 1;
		} else if (angle == 'side') {
			angle = 1 * Math.PI;
			tilt = 0;
		} else if (angle == 'front') {
			angle = 1.5 * Math.PI;
			tilt = 0;
		} else if (angle == 'isometric') {
			angle = 1.25 * Math.PI;
			tilt = 0.5 / (7 / 8);
		}
		if (!un(angle))
			obj.angle = angle;
		if (!un(tilt))
			obj.tilt = tilt;
		drawCanvasPaths();
	},

	checkPathForDots: function (obj) {
		return draw.three.checkPathForType(obj, 'dotGrid');
	},
	checkPathForArrow: function (obj) {
		return draw.three.checkPathForType(obj, 'arrow');
	},
	checkPathForGrid: function (obj, dir) {
		if (un(dir))
			dir = [0, 0, 1];
		for (var p = 0; p < obj.paths3d.length; p++)
			if (obj.paths3d[p].type == 'grid' && arraysEqual(dir, obj.paths3d[p].direction))
				return true;
		return false;
	},
	getSnap: function (obj) {
		if (obj.snapTo > 1)
			return true;
		return false;
	},
	getDirectionalColors: function (obj) {
		return boolean(obj.directionalColors, false);
	},
	getLineWidth: function (obj) {
		return obj.lineWidth || 1;
	},
	getLineColor: function (obj) {
		return obj.strokeStyle || '#000';
	},
	getFillColor: function (obj) {
		return obj.fillStyle;
	},
	getLineDash: function (obj) {
		return !un(obj.dash) ? obj.dash : [0, 0];
	},
	getShape: function (obj) {
		for (var p = 0; p < obj.paths3d.length; p++) {
			if (['grid', 'dotGrid', 'arrow'].includes(obj.paths3d[p].type) == false) {
				return obj.paths3d[p].type;
			}
		}
		return 'none';
	},
	getView: function (obj) {
		if (obj.angle == 1.5 * Math.PI && obj.tilt == 1)
			return 'plan';
		if (obj.angle == 1 * Math.PI && obj.tilt == 0)
			return 'side';
		if (obj.angle == 1.5 * Math.PI && obj.tilt == 0)
			return 'front';
		if (obj.angle == 1.25 * Math.PI && obj.tilt == 0.5 / (7 / 8))
			return 'isometric';
		return 'none';
	},
	getFaceGrid: function (obj) {
		return !un(obj.faceGrid) ? obj.faceGrid : [0, 0];
	},

	alphaChange: function (obj, num) {
		obj.alpha = Math.min(1, Math.max(0, obj.alpha + num));
		drawCanvasPaths();
	},
	contrastChange: function (obj, num) {
		obj.contrast = Math.min(1, Math.max(0, obj.contrast + num));
		drawCanvasPaths();
	},
	verticesChange: function (obj, num) {
		for (var p = 0; p < obj.paths3d.length; p++) {
			if (['prism', 'pyramid'].includes(obj.paths3d[p].type)) {
				var path3d = obj.paths3d[p];
				var vertices = path3d.polygon.length + num;
				if (vertices < 3)
					return;
				var radius = 2 * obj.gridStep;
				path3d.polygon = [];
				var da = 2 * Math.PI / vertices;
				var a = -da / 2;
				for (var i = 0; i < vertices; i++) {
					path3d.polygon.push([radius * Math.cos(a), radius * Math.sin(a)]);
					a += da;
				}
				drawSelectedPaths();
			}
		}
	},

	// geometry functions
	rotateShape: function (obj) {
		if (un(obj))
			obj = sel();
		for (var p = 0; p < obj.paths3d.length; p++) {
			if (['grid', 'dotGrid', 'arrow'].includes(obj.paths3d[p].type) == false) {
				if (!un(draw.three.path3d[obj.paths3d[p].type].rotate)) {
					draw.three.path3d[obj.paths3d[p].type].rotate(obj, obj.paths3d[p]);
				}
			}
		}
		drawCanvasPaths();
	},
	rotatePoint: function (pos, axis) { // 90 degrees
		if (axis == 0 || axis == 'x') {
			var matrix = [
				[1, 0, 0],
				[0, 0, -1],
				[0, 1, 0]
			];
		} else if (axis == 1 || axis == 'y') {
			var matrix = [
				[0, 0, 1],
				[0, 1, 0],
				[-1, 0, 0]
			];
		} else if (axis == 2 || axis == 'z') {
			var matrix = [
				[0, -1, 0],
				[1, 0, 0],
				[0, 0, 1]
			];
		}
		pos = [
			matrix[0][0] * pos[0] + matrix[0][1] * pos[1] + matrix[0][2] * pos[2],
			matrix[1][0] * pos[0] + matrix[1][1] * pos[1] + matrix[1][2] * pos[2],
			matrix[2][0] * pos[0] + matrix[2][1] * pos[1] + matrix[2][2] * pos[2],
		];
		return pos;
	},
	rotatePoint2: function (pos, axis, angle) {
		if (axis == 0 || axis == 'x') {
			var matrix = [
				[1, 0, 0],
				[0, Math.cos(angle), -Math.sin(angle)],
				[0, Math.sin(angle), Math.cos(angle)]
			];
		} else if (axis == 1 || axis == 'y') {
			var matrix = [
				[Math.cos(angle), 0, Math.sin(angle)],
				[0, 1, 0],
				[-Math.sin(angle), 0, Math.cos(angle)]
			];
		} else if (axis == 2 || axis == 'z') {
			var matrix = [
				[Math.cos(angle), -Math.sin(angle), 0],
				[Math.sin(angle), Math.cos(angle), 0],
				[0, 0, 1]
			];
		}
		pos = [
			matrix[0][0] * pos[0] + matrix[0][1] * pos[1] + matrix[0][2] * pos[2],
			matrix[1][0] * pos[0] + matrix[1][1] * pos[1] + matrix[1][2] * pos[2],
			matrix[2][0] * pos[0] + matrix[2][1] * pos[1] + matrix[2][2] * pos[2],
		];
		return pos;
	},
	rotatePointAboutLine: function (pos, linePos1, linePos2, angle) {
		var c = Math.cos(angle);
		var s = Math.sin(angle);
		var c2 = 1 - c;
		var dir = draw.three.getNormalisedVector([linePos2[0] - linePos1[0], linePos2[1] - linePos1[1], linePos2[2] - linePos1[2]]);
		var x = dir[0];
		var y = dir[1];
		var z = dir[2];

		var matrix = [
			[x * x * c2 + c, x * y * c2 - z * s, x * z * c2 + y * s],
			[y * x * c2 + z * s, y * y * c2 + c, y * z * c2 - x * s],
			[z * x * c2 - y * s, z * y * c2 + x * s, z * z * c2 + c]
		];

		pos = [
			matrix[0][0] * pos[0] + matrix[0][1] * pos[1] + matrix[0][2] * pos[2],
			matrix[1][0] * pos[0] + matrix[1][1] * pos[1] + matrix[1][2] * pos[2],
			matrix[2][0] * pos[0] + matrix[2][1] * pos[1] + matrix[2][2] * pos[2],
		];
		return pos;
	},
	convert3dPosTo2d: function (obj, pos) {
		var x = pos[0],
		y = pos[1],
		h = pos[2];
		var r = Math.sqrt(x * x + y * y);
		var pointAngle = Math.atan(y / x);
		if (x < 0)
			pointAngle += Math.PI;
		if (x == 0 && y == 0)
			pointAngle = 0;
		if (x == 0 && y < 0)
			pointAngle = 1.5 * Math.PI;
		if (x == 0 && y > 0)
			pointAngle = 0.5 * Math.PI;
		var angle = draw.three.simplifyAngle(pointAngle - obj.angle);
		var height = draw.three.convert3dHeightTo2d(obj, h);
		return [obj.center[0] + r * Math.cos(angle), obj.center[1] + r * obj.tilt * Math.sin(angle) - height];
	},
	convert2dPosTo3d: function (obj, pos, h) {
		if (un(h))
			h = 0;
		var unitVectors = [
			[Math.cos(-obj.angle), Math.sin(-obj.angle)],
			[Math.sin(obj.angle), Math.cos(-obj.angle)],
		];
		var pos2d = [
			(pos[0] - obj.center[0]),
			(pos[1] - obj.center[1] + h) / obj.tilt
		];
		var pos3d = [
			(pos2d[0] * unitVectors[0][0] + pos2d[1] * unitVectors[0][1]),
			(pos2d[0] * unitVectors[1][0] + pos2d[1] * unitVectors[1][1]),
			h
		];
		//console.log(unitVectors,pos2d,pos3d);
		return pos3d;
	},
	convert3dHeightTo2d: function (obj, h) {
		if (h == 0)
			return 0;
		var sign = obj.tilt < 0 ? -1 : 1;
		//return sign*h*(Math.acos(Math.abs(obj.tilt)));
		return sign * h * (1 - Math.pow(Math.abs(obj.tilt), 3));
	},
	convert2dHeightTo3d: function (obj, h) {
		if (h == 0)
			return 0;
		var sign = obj.tilt < 0 ? -1 : 1;
		return sign * h / (1 - Math.pow(Math.abs(obj.tilt), 3));
	},
	getFaceNormal: function (face) {
		var sumVector = [0, 0, 0];
		for (var p = 0; p < face.pos3d.length; p++) {
			var next = (p + 1) % face.pos3d.length;
			var cross = draw.three.getCrossProduct(face.pos3d[p], face.pos3d[next]);
			for (var i = 0; i < 3; i++)
				sumVector[i] += cross[i];
		}
		return draw.three.getNormalisedVector(sumVector);
		/*var pos = [face.pos3d[0]];
		var tol = 0.000001;
		for (var i = 1; i < face.pos3d.length; i++) {
		var found = false;
		for (var j = 0; j < pos.length; j++) {
		if (Math.abs(face.pos3d[i][0]-pos[j][0]) < tol && Math.abs(face.pos3d[i][1]-pos[j][1]) < tol && Math.abs(face.pos3d[i][2]-pos[j][2]) < tol) {
		found = true;
		break;
		}
		}
		if (found == false) {
		pos.push(face.pos3d[i]);
		if (pos.length == 3) break;
		}
		}
		if (pos.length < 3) return [0,0,-1];
		return draw.three.getNormalToPlaneFromThreePoints(pos[0],pos[1],pos[2]);*/
	},
	getNormalToPlaneFromThreePoints: function (a, b, c) {
		var u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
		var v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
		var nx = u[1] * v[2] - u[2] * v[1];
		var ny = u[2] * v[0] - u[0] * v[2];
		var nz = u[0] * v[1] - u[1] * v[0];
		return [nx, ny, nz];
	},
	getCrossProduct: function (a, b) {
		return [
			a[1] * b[2] - a[2] * b[1],
			a[2] * b[0] - a[0] * b[2],
			a[0] * b[1] - a[1] * b[0]
		];
	},
	getVectorMagnitude: function (a) {
		return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
	},
	getNormalisedVector: function (a) {
		var mag = draw.three.getVectorMagnitude(a)
			return [a[0] / mag, a[1] / mag, a[2] / mag];
	},
	drawNormalToFace: function (ctx, obj, face) {
		var meanPoint = draw.three.getMeanPoint(face.pos3d);
		var normalMag = Math.sqrt(Math.pow(face.normal[0], 2) + Math.pow(face.normal[1], 2) + Math.pow(face.normal[2], 2));
		face.normal = [face.normal[0] / normalMag, face.normal[1] / normalMag, face.normal[2] / normalMag];
		var normalPoint = [meanPoint[0] + 20 * face.normal[0], meanPoint[1] + 20 * face.normal[1], meanPoint[2] + 20 * face.normal[2]];
		var pos1 = draw.three.convert3dPosTo2d(obj, meanPoint);
		var pos2 = draw.three.convert3dPosTo2d(obj, normalPoint);

		ctx.save();
		ctx.strokeStyle = '#F00';
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(pos1[0], pos1[1]);
		ctx.lineTo(pos2[0], pos2[1]);
		ctx.stroke();
		ctx.restore();
	},
	getMeanPoint: function (polygon) {
		var total = [0, 0, 0];
		for (var i = 0; i < polygon.length; i++) {
			total[0] += polygon[i][0];
			total[1] += polygon[i][1];
			total[2] += polygon[i][2];
		}
		return [total[0] / polygon.length, total[1] / polygon.length, total[2] / polygon.length];
	},
	getDistanceTwoPoints: function (p1, p2) {
		return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2) + Math.pow(p1[2] - p2[2], 2));
	},
	getRelAngle: function (angle) { // gets angle relative to back (ie. 1.5*Math.PI)
		if (angle < 0.5 * Math.PI)
			return angle + 0.5 * Math.PI;
		return angle - 1.5 * Math.PI;
	},
	getAngleBetweenTwo3dVectors: function (v1, v2) {
		var dot = v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
		var mag1 = Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1] + v1[2] * v1[2]);
		var mag2 = Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1] + v2[2] * v2[2]);
		return Math.acos(dot / (mag1 * mag2));
	},
	simplifyAngle: function (angle) {
		while (angle < 0)
			angle += 2 * Math.PI;
		while (angle > 2 * Math.PI)
			angle -= 2 * Math.PI;
		return angle;
	},
	getColor: function (color, brightness, alpha) { // brightness is a value from 0 to 1
		if (color == 'none')
			return 'none';
		var c = hexToRgb(color);
		if (un(alpha))
			alpha = 1;
		return 'rgba(' + Math.round(c.r * brightness) + ',' + Math.round(c.g * brightness) + ',' + Math.round(c.b * brightness) + ',' + alpha + ')';
	},

	pointDragStart: function (e) {
		draw.animate(draw.three.pointDragMove,draw.three.pointDragStop,drawCanvasPaths);
		//addListenerMove(window, draw.three.pointDragMove);
		//addListenerEnd(window, draw.three.pointDragStop);
		draw.drag = {
			obj: draw.currCursor.obj,
			path3d: draw.currCursor.path3d,
			vars: draw.currCursor.vars
		};
		//console.log(draw.drag);
		draw.cursorCanvas.style.cursor = draw.currCursor.cursor;
	},
	pointDragMove: function (e) {
		updateMouse(e);
		var path3d = draw.drag.path3d;
		if (typeof draw.three.path3d[path3d.type].pointDragMove == 'function') {
			draw.three.path3d[path3d.type].pointDragMove(draw.drag.obj, path3d, draw.drag.vars);
			//drawCanvasPaths();
		}
	},
	pointDragStop: function (e) {
		delete draw.drag;
		draw.updateSelectedBorders();
		calcCursorPositions();
		//removeListenerMove(window, draw.three.pointDragMove);
		//removeListenerEnd(window, draw.three.pointDragStop);
	},
	snapPos: function (obj, value, direction) {
		var snapTo = obj.snapTo || obj.gridStep || 60;
		if (!un(obj.gridBounds)) {
			return bound(value, obj.gridBounds[direction][0] * obj.gridStep, obj.gridBounds[direction][1] * obj.gridStep, snapTo);
		} else {
			if (direction < 2) {
				return Math.max(-obj.gridSize, Math.min(obj.gridSize, roundToNearest(value, snapTo)));
			} else {
				return Math.max(0, Math.min(2 * obj.gridSize, roundToNearest(value, snapTo)));
			}
		}
	},

	drag3dStart: function (e) {
		updateMouse(e);
		draw.animate(draw.three.drag3dMove,draw.three.drag3dStop,drawSelectedPaths);
		//addListenerMove(window, draw.three.drag3dMove);
		//addListenerEnd(window, draw.three.drag3dStop);
		draw.drag = {
			obj: draw.currCursor.obj,
			mouse: draw.mouse
		};
		draw.cursorCanvas.style.cursor = draw.cursors.move2;
		if (draw.mode == 'interact') {
			draw.drag.obj._path._interacting = true;
			drawCanvasPaths();
		}
	},
	drag3dMove: function (e) {
		updateMouse(e);
		var obj = draw.drag.obj;
		var dx = draw.mouse[0] - draw.drag.mouse[0];
		var dy = draw.mouse[1] - draw.drag.mouse[1];
		var tiltMin = def([obj.tiltMin, 0]);
		var tiltMax = def([obj.tiltMax, 1]);
		obj.tilt = Math.min(tiltMax, Math.max(tiltMin, obj.tilt + dy * 0.005));
		var angleMin = def([obj.angleMin, -7]);
		var angleMax = def([obj.angleMax, 7]);
		obj.angle = Math.min(angleMax, Math.max(angleMin, obj.angle + dx * 0.01));
		while (obj.angle < 0)
			obj.angle += 2 * Math.PI;
		while (obj.angle > 2 * Math.PI)
			obj.angle -= 2 * Math.PI;
		draw.drag.mouse = draw.mouse;
		//drawSelectedPaths();
	},
	drag3dStop: function (e) {
		draw.updateSelectedBorders();
		calcCursorPositions();
		//removeListenerMove(window, draw.three.drag3dMove);
		//removeListenerEnd(window, draw.three.drag3dStop);
		draw.cursorCanvas.style.cursor = draw.cursors.move1;
		if (draw.mode == 'interact') {
			delete draw.drag.obj._path._interacting;
			drawCanvasPaths();
		}
		delete draw.drag;
	},

	drawButton: function (ctx, size, type) {
		text({
			ctx: ctx,
			align: [0, 0],
			rect: [0, 0, size, size],
			text: ['<<fontSize:' + (size / 2) + '>>3d']
		});
	}
};
draw.text2 = {
	addBox: function (obj) {
		if (un(obj.box))
			obj.box = {
				type: 'loose',
				borderColor: '#000',
				borderWidth: 3,
				radius: 0,
				color: 'none'
			}
		obj.box.type = 'loose';
	},
	getRect: function (obj) {
		var rect = clone(obj.rect);
		if (!un(obj.box) && obj.box.type == 'flowArrow') {
			rect[2] += obj.box.arrowWidth / 2 || 20;
			if (obj.box.dir == 'left')
				rect[0] -= obj.box.arrowWidth / 2 || 20;
		}
		return rect;
	},
	getCursorPositionsSelected: function (obj, pathNum) {
		return [{
				shape: 'rect',
				dims: clone(obj._tightRect),
				cursor: draw.cursors.text,
				func: textEdit.selectStart,
				obj: obj,
				pathNum: pathNum,
				highlight: -1
			}
		];
	},
	getButtons: function (x1, y1, x2, y2, pathNum) {
		var buttons = [];
		buttons.push({
			buttonType: 'text-horizResizeCollapse',
			shape: 'rect',
			dims: [x2 - 20, y2 - 40, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.text2.horizResizeCollapse,
			pathNum: pathNum
		});
		buttons.push({
			buttonType: 'text-horizResize',
			shape: 'rect',
			dims: [x2 - 20, y2 - 60, 20, 20],
			cursor: draw.cursors.ew,
			func: draw.text2.horizResize,
			pathNum: pathNum
		});

		buttons.push({
			buttonType: 'text2-underline',
			shape: 'rect',
			dims: [x1, y2 - 60, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.text2.setUnderline,
			pathNum: pathNum
		});
		buttons.push({
			buttonType: 'text2-fracScale',
			shape: 'rect',
			dims: [x1, y2 - 80, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.text2.setFracScale,
			pathNum: pathNum
		});
		buttons.push({
			buttonType: 'text2-algPadding',
			shape: 'rect',
			dims: [x1, y2 - 100, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.text2.setAlgPadding,
			pathNum: pathNum
		});

		var path = draw.path[pathNum];
		if (!un(path) && path.obj.length == 1 && !un(path.isInput) && path.isInput.type == 'text') {

			var obj = path.obj[0];
			if (un(obj.ans))
				obj.ans = [];
			/*buttons.push({buttonType:'text-input-prevAns',shape:'rect',dims:[x1+20,y2-20,20,20],cursor:draw.cursors.pointer,func:draw.text2.textInput.ansPrev,pathNum:pathNum});
			buttons.push({buttonType:'text-input-ansInfo',shape:'rect',dims:[x1+40,y2-20,30,20],cursor:draw.cursors.default,func:function() {},pathNum:pathNum,text:String(obj.ansIndex+1)+'/'+String(Math.max(obj.ansIndex+1,obj.ans.length))});
			buttons.push({buttonType:'text-input-nextAns',shape:'rect',dims:[x1+70,y2-20,20,20],cursor:draw.cursors.pointer,func:draw.text2.textInput.ansNext,pathNum:pathNum});
			buttons.push({buttonType:'text-input-algText',shape:'rect',dims:[x2-40,y1,20,20],cursor:draw.cursors.pointer,func:draw.text2.textInput.algTextToggle,pathNum:pathNum,algText:obj.font == 'algebra'});
			//buttons.push({buttonType:'text-input-tickStyle',shape:'rect',dims:[x2-40,y1,20,20],cursor:draw.cursors.pointer,func:draw.text2.textInput.setTickStyle,pathNum:pathNum});


			buttons.push({buttonType:'qBox-marksMinus',shape:'rect',dims:[x2-90,y2-20,20,20],cursor:draw.cursors.pointer,func:draw.text2.textInput.marksMinus,pathNum:pathNum,draw: function(path,ctx,l,t,w,h) {
			ctx.fillStyle = colorA('#F99',0.5);
			ctx.fillRect(l,t,w,h);
			text({ctx:ctx,align:[0,0],rect:[l,t,w,h],text:['<<fontSize:14>><<bold:true>>-']})
			}});
			buttons.push({buttonType:'qBox-marks',shape:'rect',dims:[x2-70,y2-20,30,20],cursor:draw.cursors.pointer,func:function() {},pathNum:pathNum,draw: function(path,ctx,l,t,w,h) {
			var obj = path.obj[0];
			var marks = un(obj.ans[obj.ansIndex]) ? 0 : obj.ans[obj.ansIndex].marks;
			obj.maxMarks = 0;
			for (var a = 0; a < obj.ans.length; a++) {
			if (un(obj.ans[a].marks)) continue;
			obj.maxMarks = Math.max(obj.maxMarks,obj.ans[a].marks);
			}
			text({ctx:ctx,align:[0,0],rect:[l,t,w,h],text:['<<fontSize:14>>'+marks+'/'+obj.maxMarks]})
			}});
			buttons.push({buttonType:'qBox-marksPlus',shape:'rect',dims:[x2-40,y2-20,20,20],cursor:draw.cursors.pointer,func:draw.text2.textInput.marksPlus,pathNum:pathNum,draw: function(path,ctx,l,t,w,h) {
			ctx.fillStyle = colorA('#F99',0.5);
			ctx.fillRect(l,t,w,h);
			text({ctx:ctx,align:[0,0],rect:[l,t,w,h],text:['<<fontSize:14>><<bold:true>>+']})
			}});*/

		} else {
			buttons.push({
				buttonType: 'text-vertResizeCollapse',
				shape: 'rect',
				dims: [x2 - 40, y2 - 20, 20, 20],
				cursor: draw.cursors.pointer,
				func: draw.text2.vertResizeCollapse,
				pathNum: pathNum
			});
			buttons.push({
				buttonType: 'text2-fullWidth',
				shape: 'rect',
				dims: [x2 - 60, y2 - 20, 20, 20],
				cursor: draw.cursors.pointer,
				func: draw.text2.setFullWidth,
				pathNum: pathNum
			});
		}

		return buttons;
	},

	getCursorPositionsInteract: function (obj, path, pathNum) {
		if (un(path.isInput) || path.isInput.type !== 'text' || path.isInput._disabled)
			return [];

		var buttons = [];
		buttons.push({
			shape: 'rect',
			dims: clone(obj.rect),
			cursor: draw.cursors.text,
			func: draw.text2.textInput.interactStartTextInput,
			obj: obj,
			pathNum: pathNum,
			highlight: -1
		});
		if (un(obj._check) && !arraysEqual(obj.text, [""])) {
			if (!un(path.isInput.checkPos)) {
				var l2 = path.isInput.checkPos[0] - 20;
				var t2 = path.isInput.checkPos[1] - 20;
			} else {
				var l2 = obj.rect[0] + obj.rect[2] + 10;
				var t2 = obj.rect[1] + 0.5 * obj.rect[3] - 20;
			}
			buttons.push({
				shape: 'rect',
				dims: [l2, t2, 40, 40],
				cursor: draw.cursors.pointer,
				func: draw.text2.textInput.check,
				obj: obj,
				pathNum: pathNum,
				highlight: -1
			});
		}
		return buttons;
	},
	textInput: {
		interactStartTextInput: function () {
			var pathIndex = draw.currCursor.pathNum;
			var obj = draw.currCursor.obj;
			delete obj._check;
			deselectAllPaths();
			textEdit.endInput();
			obj._path._interacting = true;
			obj.textEdit = true;
			textEdit._type = 'textInput';
			drawCanvasPaths();
			textEdit.start(pathIndex, obj);
			draw.keyboard.moveAwayFromTextInput();
		},
		ansPrev: function () {
			var path = draw.path[draw.currCursor.pathNum];
			var obj = path.obj[0];
			var currText = removeTags(clone(obj.text));
			if (obj.ansIndex == 0)
				return;
			if (un(obj.ans))
				obj.ans = [];
			if (un(obj.ans[obj.ansIndex]))
				obj.ans[obj.ansIndex] = {
					text: [''],
					marks: 1
				};
			if (arraysEqual(removeTags(clone(currText)), [''])) {
				obj.ans.splice(obj.ansIndex, 1);
			} else {
				obj.ans[obj.ansIndex].text = currText;
			}
			obj.ansIndex--;
			if (obj.ans[obj.ansIndex]instanceof Array) {
				obj.text = clone(obj.ans[obj.ansIndex].text);
				obj.ans[obj.ansIndex] = {
					text: obj.text,
					marks: 1
				};
			} else if (!un(obj.ans[obj.ansIndex].text)) {
				obj.text = clone(obj.ans[obj.ansIndex].text);
			}
			updateBorder(path);
			drawCanvasPaths();
		},
		ansNext: function () {
			var path = draw.path[draw.currCursor.pathNum];
			var obj = path.obj[0];
			var currText = clone(obj.text);
			if (un(obj.ans))
				obj.ans = [];
			if (un(obj.ans[obj.ansIndex]))
				obj.ans[obj.ansIndex] = {
					text: [''],
					marks: 1
				};
			if (arraysEqual(removeTags(clone(currText)), [''])) {
				if (obj.ansIndex >= obj.ans.length - 1)
					return;
				obj.ans.splice(obj.ansIndex, 1);
			} else {
				obj.ans[obj.ansIndex].text = currText;
			}
			obj.ansIndex++;
			if (obj.ansIndex == obj.ans.length) {
				obj.text = [textArrayGetStartTags(clone(obj.text))];
				obj.ans[obj.ansIndex] = {
					text: obj.text,
					marks: 1
				};
			} else {
				if (obj.ans[obj.ansIndex]instanceof Array) {
					obj.text = clone(obj.ans[obj.ansIndex].text);
				} else if (!un(obj.ans[obj.ansIndex].text)) {
					obj.text = clone(obj.ans[obj.ansIndex].text);
				}
			}
			updateBorder(path);
			drawCanvasPaths();
		},
		algTextToggle: function () {
			var path = draw.path[draw.currCursor.pathNum];
			var obj = path.obj[0];
			if (obj.type !== 'text2')
				return;
			if (un(obj.font))
				obj.font = 'Arial';
			obj.font = obj.font == 'algebra' ? 'Arial' : 'algebra';
			updateBorder(path);
			drawCanvasPaths();
		},
		setTickStyle: function () {
			var path = draw.path[draw.currCursor.pathNum];
			if (path.isInput.tickStyle == 'small') {
				delete path.isInput.tickStyle;
			} else {
				path.isInput.tickStyle = 'small';
			}
			updateBorder(path);
			drawCanvasPaths();
		},
		/*numToggle:function() {
		var path = draw.path[draw.currCursor.pathNum];
		path.obj[0].isInput.num = !path.obj[0].isInput.num;
		updateBorder(path);
		drawCanvasPaths();
		},
		oeToggle:function() {
		var path = draw.path[draw.currCursor.pathNum];
		path.obj[0].isInput.oe = !path.obj[0].isInput.oe;
		updateBorder(path);
		drawCanvasPaths();
		},*/
		/*check: function(obj,answerData) {
		if (un(obj) || obj.type !== 'text2') {
		var obj = draw.path[draw.currCursor.pathNum].obj[0];
		if (obj.type !== 'text2') return;
		}
		var ans = !un(answerData) ? answerData.text : textArrayToLowerCase(removeTags(clone(textArrayReplace(obj.text,' ',''))));

		obj._check = false;
		for (var a = 0; a < obj.ans.length; a++) {
		var ans2 = obj.ans[a] instanceof Array ? obj.ans[a] : obj.ans[a].text;
		ans2 = textArrayToLowerCase(removeTags(clone(textArrayReplace(ans2,' ',''))));
		if (arraysEqual(ans,ans2)) {
		obj._check = true;
		break;
		}
		}
		return obj._check;
		},*/
		/*uncheck: function(obj) {
		delete obj._check;
		drawCanvasPaths();
		},*/
		reset: function (obj) {
			obj.text = [""];
			delete obj._check;
			drawCanvasPaths();
		},
		marksMinus: function () {
			var path = draw.path[draw.currCursor.pathNum];
			var obj = path.obj[0];
			if (obj.type !== 'text2')
				return;
			var ans = obj.ans[obj.ansIndex];
			if (un(ans.marks))
				return;
			ans.marks = Math.max(0, ans.marks - 1);
			updateBorder(path);
			drawCanvasPaths();
		},
		marksPlus: function () {
			var path = draw.path[draw.currCursor.pathNum];
			var obj = path.obj[0];
			if (obj.type !== 'text2')
				return;
			var ans = obj.ans[obj.ansIndex];
			ans.marks++;
			updateBorder(path);
			drawCanvasPaths();
		}
	},

	properties: {
		text: {
			type: 'text',
			get: function (obj) {
				return clone(obj.text);
			},
			set: function (obj, value) {
				if (typeof value == 'string')
					value = [value];
				draw.text2.extractStartTags(obj);
				obj.text = clone(value);
			}
		},
	},
	getStartTags: function (obj) {
		var tags = clone(defaultTags);

		if (!un(obj.tags)) {
			for (var key in obj.tags) {
				tags[key] = clone(obj.tags[key]);
			}
		}
		for (var key in tags) {
			if (!un(obj[key])) {
				tags[key] = clone(obj[key]);
			}
		}

		if (!un(obj.text) && !un(obj.text[0])) {
			var str = obj.text[0];
			while (str.length > 2 && str.slice(0, 2) == '<<' && str.slice(0, 3) !== '<<<' && str.indexOf('>>') !== -1) {
				var pos = str.indexOf('>>') + 2;
				var tag = str.slice(0, pos);
				var pos2 = tag.indexOf(':');
				var key = tag.slice(2, pos2);
				var value = tag.slice(pos2 + 1, -2);
				if (key !== 'align') {
					if (value == 'true') {
						value = true;
					} else if (value == 'false') {
						value = false;
					} else if (!isNaN(Number(value))) {
						value = Number(value);
					}
					tags[key] = value;
				}
				str = str.slice(pos);
			}
		}
		return tags;
	},
	extractStartTags: function (obj) {
		if (!un(obj.tags)) {
			for (var key in obj.tags) {
				if (obj.tags[key] !== defaultTags[key])
					obj[key] = obj.tags[key];
			}
			delete obj.tags;
		}

		if (un(obj.text) || un(obj.text[0]))
			return;
		while (obj.text[0].length > 2 && obj.text[0].slice(0, 2) == '<<' && obj.text[0].slice(0, 3) !== '<<<' && obj.text[0].indexOf('>>') !== -1) {
			var pos = obj.text[0].indexOf('>>') + 2;
			var tag = obj.text[0].slice(0, pos);

			var pos2 = tag.indexOf(':');
			var key = tag.slice(2, pos2);
			var value = tag.slice(pos2 + 1, -2);
			if (key == 'align') {
				if (un(obj.align))
					obj.align = [-1, def([obj.vertAlign, -1])];
				obj.align[0] = value == 'center' ? 0 : value == 'right' ? 1 : -1;
			} else if (value == 'true') {
				obj[key] = true;
			} else if (value == 'false') {
				obj[key] = false;
			} else if (!isNaN(Number(value))) {
				obj[key] = Number(value);
			} else {
				obj[key] = value;
			}
			obj.text[0] = obj.text[0].slice(pos);
		}
	},

	setFracScale: function (obj) {
		if (un(obj)) {
			var obj = draw.path[draw.currCursor.pathNum].obj[0];
		}
		if (obj.fracScale == 1) {
			delete obj.fracScale;
		} else {
			obj.fracScale = 1;
		}
		drawCanvasPaths();
	},
	setUnderline: function (obj) {
		if (un(obj)) {
			var obj = draw.path[draw.currCursor.pathNum].obj[0];
		}
		if (obj.underline == true) {
			delete obj.underline;
		} else {
			obj.underline = true;
		}
		drawCanvasPaths();
	},
	setAlgPadding: function () {
		var path = draw.path[draw.currCursor.pathNum];
		var obj = path.obj[0];
		if (typeof obj.algPadding == 'undefined') {
			obj.algPadding = 0;
		} else if (obj.algPadding == 5) {
			delete obj.algPadding;
		} else {
			obj.algPadding++;
		}
		drawCanvasPaths();
	},
	setLineWidth: function (obj, lineWidth) {
		if (un(obj.box))
			draw.text2.addBox(obj);
		obj.box.borderWidth = lineWidth;
	},
	setLineColor: function (obj, color) {
		if (un(obj.box)) {
			draw.text2.addBox(obj);
			obj.box.color = 'none';
		}
		obj.box.borderColor = color;
		if (obj.box.borderColor == 'none' && obj.box.color == 'none')
			delete obj.box;
	},
	setFillColor: function (obj, color) {
		if (un(obj.box)) {
			draw.text2.addBox(obj);
			obj.box.borderColor = 'none';
		}
		obj.box.color = color;
		if (obj.box.borderColor == 'none' && obj.box.color == 'none')
			delete obj.box;
	},
	setRadius: function (obj, radius) {
		if (un(obj.box))
			draw.text2.addBox(obj);
		obj.box.radius = radius;
	},
	getLineWidth: function (obj) {
		return !un(obj.box) ? obj.box.borderWidth : 2;
	},
	getLineColor: function (obj) {
		return !un(obj.box) ? obj.box.borderColor : '#000';
	},
	getFillColor: function (obj) {
		return !un(obj.box) ? obj.box.color : 'none';
	},
	getRadius: function (obj) {
		if (un(obj.box))
			return 0;
		if (un(obj.box.radius))
			return 0;
		if (!isNaN(Number(obj.box.radius)))
			return Number(obj.box.radius);
		return 0;
	},
	setFullWidth: function (obj) {
		if (un(obj)) {
			var obj = draw.path[draw.currCursor.pathNum].obj[0];
		}
		obj.rect[0] = draw.gridMargin[0];
		obj.rect[2] = draw.drawArea[2] - (draw.gridMargin[0] + draw.gridMargin[2]);
		drawCanvasPaths();
	},
	draw: function (ctx, obj, path) {
		obj.text = simplifyText(obj.text);
		if (typeof obj.color === 'string' && obj.color.length === 3) obj.color = '#'+obj.color;
		var obj2 = clone(obj);
		obj2.ctx = ctx;
		/*if (!un(path.isInput) && path.isInput.type == 'text') {
		var mode = path.isInput.mode || 'none';
		if (mode == 'input') {
		var backColors = path.isInput.backColors || {correct:'#CFC',wrong:'#FCC',unchecked:'#FFF'};
		if (obj2._check === true) {
		obj2.box.color = backColors.correct;
		} else if (obj._check === false) {
		obj2.box.color = backColors.wrong;
		} else {
		obj2.box.color = backColors.unchecked;
		}
		} else if (mode == 'inputShowAnswer') {
		obj2.box.color = '#FFF';
		obj2.color = '#F00';
		if (!un(obj2.ansDisplay)) {
		obj2.text = obj2.ansDisplay;
		} else if (!un(obj2.ans)) {
		if (obj2.ans[0] instanceof Array) {
		obj2.text = obj2.ans[0];
		} else {
		obj2.text = obj2.ans[0].text;
		}
		}
		} else if (mode == 'showAnswer' || (draw.triggerEnabled === true && draw.triggerNum === 1)) {
		delete obj2.box;
		obj2.color = '#F00';
		if (!un(obj2.ansDisplay)) {
		obj2.text = obj2.ansDisplay;
		} else if (!un(obj2.ans)) {
		if (obj2.ans[0] instanceof Array) {
		obj2.text = obj2.ans[0];
		} else {
		obj2.text = obj2.ans[0].text;
		}
		}
		} else if (draw.mode !== 'edit') {
		return;
		}
		}*/
		var measure = text(obj2);
		obj._tightRect = measure.tightRect;
		obj2._tightRect = measure.tightRect;
		delete obj.tightRect;
		delete obj2.tightRect;
		if (!un(obj2.underline)) {
			if (!un(measure.textLoc) && !un(measure.textLoc[0]) && measure.textLoc[0].length > 1) {
				var loc = measure.textLoc[0];
				var pos = [];
				for (var i = 0; i < loc.length; i++) {
					if (pos.length == 0) {
						if (boolean(loc[i].markupTag, false) == true)
							continue;
						pos = [[loc[i].left, loc[i].top + loc[i].height], [loc[i].left + loc[i].width, loc[i].top + loc[i].height]];
					} else {
						if (boolean(loc[i].markupTag, false) == true)
							break;
						//if (Math.abs(loc[i].top + loc[i].height - pos[0][1]) > 0.1) break;
						pos[1][0] = loc[i].left + loc[i].width;
					}
				}
				if (pos.length !== 0) {
					ctx.beginPath();
					ctx.lineWidth = 3;
					ctx.strokeStyle = '#000';
					ctx.moveTo(pos[0][0], pos[0][1]);
					ctx.lineTo(pos[1][0], pos[1][1]);
					ctx.stroke();
				}
			}
		}
		if (obj2.textEdit == true) {
			if ((un(path.isInput) || path.isInput.type !== 'text') && obj2.autoHeight !== false) {
				obj.rect[3] = Math.max(obj2.rect[3], measure.tightRect[3]);
			}
			textEdit.cursorMap = textEdit.mapTextLocs(obj2, measure.textLoc, measure.softBreaks, measure.hardBreaks);
			textEdit.tightRect = measure.tightRect;
			textEdit.textLoc = measure.textLoc;
			//textEdit.softBreaks = measure.softBreaks;
			//textEdit.hardBreaks = measure.hardBreaks;
			textEdit.lineRects = measure.lineRects;
			textEdit.path = path;
			textEdit.pathIndex = draw.path.indexOf(path);
			delete textEdit.allMap;
			textEdit.blinkReset();
			if (!un(textEdit.menu)) textEdit.menu.update();
		}
		/*if (!un(path.isInput) && path.isInput.type == 'text' && path.isInput.mode == 'input') {
		if (draw.mode == 'interact' && un(obj2._check) && !arraysEqual(obj2.text,[""])) {
		if (!un(path.isInput.checkPos)) {
		var l2 = path.isInput.checkPos[0]-20;
		var t2 = path.isInput.checkPos[1]-20;
		} else {
		var l2 = obj2.rect[0]+obj2.rect[2]+10;
		var t2 = obj2.rect[1]+0.5*obj2.rect[3]-20;
		}
		roundedRect(ctx, l2+3, t2+3, 40 - 6, 40 - 6, 3, 6, '#C93', '#FB8');
		ctx.beginPath();
		ctx.fillStyle = '#FFF';
		drawStar({
		ctx: ctx,
		center: [l2+20,t2+20],
		radius: 12,
		points: 5
		});
		ctx.fill();
		} else {
		var markType = 'none';
		if (path.isInput.tickStyle == 'small') {
		var mult = 0.6;
		var l2 = obj2.rect[0]+obj2.rect[2]-40*mult-3;
		var t2 = obj2.rect[1]+obj2.rect[3]-50*mult-3;
		} else {
		var mult = 1;
		var l2 = obj2.rect[0]+obj2.rect[2]+15;
		var t2 = obj2.rect[1]+0.5*obj2.rect[3]-25;
		}
		if (draw.mode == 'edit') {
		markType = 'tick';
		var color = colorA('#060',0.5);
		} else if (draw.mode == 'interact') {
		if (obj2._check === true) {
		markType = 'tick';
		var color = '#060';
		} else if (obj2._check === false) {
		markType = 'cross';
		var color = '#F00';
		}
		}
		if (markType == 'tick') drawTick(ctx,40*mult,50*mult,color,l2,t2,7*mult);
		if (markType == 'cross') drawCross(ctx,40*mult,50*mult,color,l2,t2,7*mult);
		}
		}*/
		if (!un(path)) updateBorder(path);
	},
	convertToTable: function () {
		var obj = sel();
		var txt = obj.text;
		var cells = text2split(txt, br);
		var cols = 0;
		for (var r = cells.length - 1; r >= 0; r--) {
			cells[r] = text2split(cells[r], tab + tab + tab);
			cols = Math.max(cols, cells[r].length);
		}
		var trigger = obj.trigger;
		deletePaths();
		draw.table2.add(cells.length, cols);

		var table = draw.path.last().obj[0];
		table.text.size = 28;
		for (var r = 0; r < cells.length; r++) {
			for (var c = 0; c < cells[r].length; c++) {
				if (cells[r][c].length == 0)
					cells[r][c] = [''];
				while (cells[r][c][0].indexOf(tab) == 0)
					cells[r][c][0] = cells[r][c][0].slice(1);
				table.cells[r][c].text = cells[r][c];
				table.cells[r][c].align = [-1, 0];
				//table.cells[r][c].padding = 10;
			}
		}

		repositionObj(table, obj.rect[0] - table.left, obj.rect[1] - table.top, 0, 0);
		table.height = obj.rect[3];
		for (var h = 0; h < table.heights.length; h++) {
			table.heights[h] = table.height / table.heights.length;
		}
		table.innerBorder.show = false;
		table.outerBorder.show = false;
		draw.path.last().selected = true;
		if (!un(trigger))
			draw.path.last().trigger = trigger;
		console.log(table);

		updateBorder(draw.path.last());
		drawCanvasPaths();

		function text2split(obj, sep) {
			var ret = [[]];
			var obj = clone(obj);
			for (var i = 0; i < obj.length; i++) {
				if (typeof obj[i] !== 'string') {
					ret.last().push(obj[i]);
				} else {
					while (obj[i].indexOf(sep) > -1) {
						var sub = obj[i].slice(0, obj[i].indexOf(sep));
						ret.last().push(sub);
						ret.push([]);
						obj[i] = obj[i].slice(obj[i].indexOf(sep) + sep.length);
					}
					if (obj[i].length > 0)
						ret.last().push(obj[i]);
				}
			}
			for (var i = ret.length - 1; i >= 0; i--) {
				if (arraysEqual(ret[i], []) || arraysEqual(ret[i], [""]) || arraysEqual(ret[i], [tab]) || arraysEqual(ret[i], [tab + tab]))
					ret.splice(i, 1);
			}
			if (arraysEqual(ret, []))
				ret = [''];
			return ret;
		}
	},
	convertGroupToTable: function (rows, cols) {
		var paths = selPaths();

		//work out number of rows and cols
		var tol = 30;
		var x = [],
		y = [],
		w = [],
		h = [];
		var left = paths[0].obj[0].rect[0];
		var top = paths[0].obj[0].rect[1];
		for (var p = 0; p < paths.length; p++) {
			var obj = paths[p].obj[0];
			x.push(obj.rect[0] + 0.5 * obj.rect[2]);
			y.push(obj.rect[1] + 0.5 * obj.rect[3]);
			left = Math.min(left, obj.rect[0]);
			top = Math.min(top, obj.rect[1]);
		}
		var r = [y[0]];
		var c = [x[0]];
		for (var i = 1; i < x.length; i++) {
			var found = false;
			for (var c2 = 0; c2 < c.length; c2++) {
				if (Math.abs(x[i] - c[c2]) < tol)
					found = true;
			}
			if (found == false)
				c.push(x[i]);
		}
		for (var i = 1; i < y.length; i++) {
			var found = false;
			for (var r2 = 0; r2 < r.length; r2++) {
				if (Math.abs(y[i] - r[r2]) < tol)
					found = true;
			}
			if (found == false)
				r.push(y[i]);
		}
		if (un(rows)) {
			rows = r.length;
			cols = c.length;
		}

		var cells = [];
		var widths = [];
		var heights = [];
		for (var r = 0; r < rows; r++)
			heights[r] = 50;
		for (var c = 0; c < cols; c++)
			widths[c] = 50;

		for (var r = 0; r < rows; r++) {
			cells[r] = [];
			var rowWidths = [];
			for (var c = 0; c < cols; c++) {
				var obj = paths[0].obj[0];
				cells[r][c] = {};
				cells[r][c].text = obj.text;
				cells[r][c].align = obj.align;
				cells[r][c].box = obj.box;
				widths[c] = Math.max(widths[c], obj.rect[2] + 10);
				heights[r] = Math.max(heights[r], obj.rect[3] + 10);
				paths.shift();
			}
		}
		deletePaths();

		draw.table2.add(rows, cols);
		var table = draw.path.last().obj[0];
		for (var r = 0; r < cells.length; r++) {
			for (var c = 0; c < cells[r].length; c++) {
				table.cells[r][c].text = cells[r][c].text;
				table.cells[r][c].align = cells[r][c].align;
				table.cells[r][c].box = cells[r][c].box;
				//table.cells[r][c].padding = 10;
			}
		}
		table.widths = widths;
		table.heights = heights;
		table.innerBorder.show = false;
		table.outerBorder.show = false;
		table.paddingH = 5;
		table.paddingV = 5;
		draw.path.last().selected = true;
		repositionObj(table, left - table.left, top - table.top, 0, 0);

		console.log(table);

		updateBorder(draw.path.last());
		drawCanvasPaths();
	},
	start: function () {
		deselectAllPaths(false);
		//var x = mouse.x - draw.drawRelPos[0];
		//var y = mouse.y - draw.drawRelPos[1];
		var x = draw.mouse[0];
		var y = draw.mouse[1];
		var w = Math.min(draw.drawArea[2] - x - 2 * draw.selectPadding, 600);
		var obj = {
			type: 'text2',
			rect: [x, y, w, 54],
			text: ["<<fontSize:28>>"],
			align: [-1, -1],
			textEdit: true
		};
		draw.path.push({
			obj: [obj],
			selected: true
		});
		drawCanvasPaths();
		textEdit.start(draw.path.length - 1, obj, 0);
		redrawButtons();
	},
	toggleBorder: function () {
		var obj = draw.path[draw.currCursor.pathNum].obj[0];
		if (un(obj.showBorder)) {
			obj.showBorder = true;
			obj.color = '#000';
			obj.thickness = 2;
			obj.fillColor = 'none';
		} else {
			obj.showBorder = !obj.showBorder;
		}
		drawSelectedPaths();
	},
	horizResize: function (e) {
		updateMouse(e);
		changeDrawMode('tableColResize');
		draw.selectedPath = draw.currCursor.pathNum;
		draw.prevX = draw.mouse[0];
		//addListenerMove(window, draw.text2.horizResizeMove);
		//addListenerEnd(window, draw.text2.horizResizeStop);
		draw.animate(draw.text2.horizResizeMove,draw.text2.horizResizeStop,drawCanvasPaths);
	},
	horizResizeMove: function (e) {
		updateMouse(e);
		var path = draw.path[draw.selectedPath];
		var dx = draw.mouse[0] - draw.prevX;
		if (path.obj[0].tbLayoutTitle == true)
			dx = dx * 2;
		repositionPath(path, 0, 0, dx, 0);
		updateBorder(path);
		//drawCanvasPaths();
		draw.prevX = draw.mouse[0];
	},
	horizResizeStop: function (e) {
		//removeListenerMove(window, draw.text2.horizResizeMove);
		//removeListenerEnd(window, draw.text2.horizResizeStop);
		changeDrawMode('prev');
	},
	horizResizeCollapse: function () {
		var path = draw.path[draw.currCursor.pathNum];
		var obj = path.obj[0];
		obj.ctx = draw.hiddenCanvas.ctx;
		var tightRect = text(obj).tightRect;
		delete obj.ctx;
		var dw = tightRect[2] + 4 - path.tightBorder[2];
		repositionPath(path, 0, 0, dw, 0);
		updateBorder(path);
		drawCanvasPaths();
	},
	vertResizeCollapse: function () {
		var path = draw.path[draw.currCursor.pathNum];
		var obj = path.obj[0];
		obj.ctx = draw.hiddenCanvas.ctx;
		var tightRect = text(obj).tightRect;
		delete obj.ctx;
		var dh = tightRect[3] + 4 - path.tightBorder[3];
		repositionPath(path, 0, 0, 0, dh);
		updateBorder(path);
		drawCanvasPaths();
	},
	scale: function (obj, sf, center) {
		if (!un(center)) {
			obj.rect[0] = center[0] + sf * (obj.rect[0] - center[0]);
			obj.rect[1] = center[1] + sf * (obj.rect[1] - center[1]);
		}
		obj.rect[2] *= sf;
		obj.rect[3] *= sf;
		if (!un(obj.tags) && !un(obj.tags.fontSize)) obj.tags.fontSize *= sf;
		if (!un(obj.fontSize)) obj.fontSize *= sf;
		if (!un(obj.lineSpacingFactor)) obj.lineSpacingFactor *= sf;
		if (!un(obj.padding)) obj.padding *= sf;
		if (!un(obj.box)) {
			if (!un(obj.box.borderWidth))
				obj.box.borderWidth *= sf;
			if (!un(obj.box.radius))
				obj.box.radius *= sf;
			if (!un(obj.box.padding))
				obj.box.padding *= sf;
			if (!un(obj.box.dash)) {
				if (!un(obj.box.dash[0]))
					obj.box.dash[0] *= sf;
				if (!un(obj.box.dash[1]))
					obj.box.dash[1] *= sf;
			}
		}
		textArrayFontSizeAdjust(obj.text, sf);
	},

	getControlPanel: function (obj) {
		var elements = [{
				name: 'Style',
				type: 'style'
			}, {
				name: 'Round Box',
				type: 'increment',
				increment: function (obj, value) {
					var val = draw.text2.getRadius(obj) + value * 5;
					draw.text2.setRadius(obj, Math.max(0, Math.min(20, val)));
				}
			}
		];
		return {
			obj: obj,
			elements: elements
		};
	},
	centerTextAtPos: function (obj, pos) {
		obj.rect[0] = pos[0] - 0.5 * obj.rect[2];
		obj.rect[1] = pos[1] - 0.5 * obj.rect[3];
	},

	getTextMeasure: function (obj) {
		obj.ctx = draw.hiddenCanvas.ctx;
		obj.text = simplifyText(obj.text);
		var measure = text(obj);
		return measure;
	},
	getCharPosition: function (obj, char) {
		var measure = draw.text2.getTextMeasure(obj);
		for (var t = 0; t < measure.textLoc.length; t++) {
			if (un(measure.textLoc[t]))
				continue;
			if (measure.textLoc[t]instanceof Array == false)
				continue;
			for (var t2 = 0; t2 < measure.textLoc[t].length; t2++) {
				var textLoc = measure.textLoc[t][t2];
				if (un(textLoc))
					continue;
				if (textLoc instanceof Array)
					continue;
				if (textLoc.char == char)
					return textLoc;
			}
		}
		return false;
	},
	horizAlignToEquals: function () {
		var objs1 = selObjs();
		var objs2 = [];
		var left = 100000;
		for (var o = 0; o < objs1.length; o++) {
			var obj = objs1[o];
			if (obj.type !== 'text2')
				continue;
			obj._equalsPos = draw.text2.getCharPosition(obj, "=");
			left = Math.min(left, obj._equalsPos.left);
			objs2.push(obj);
		}
		if (objs2.length > 0) {
			for (var o = 0; o < objs1.length; o++) {
				var obj = objs1[o];
				var dl = left - obj._equalsPos.left;
				if (dl !== 0)
					repositionObj(obj, dl, 0, 0, 0);
			}
			draw.updateAllBorders();
			drawCanvasPaths();
		}
	}

};
draw.multiSelectTable = {
	add: function () {
		deselectAllPaths();
		var left = 100 - draw.drawRelPos[0];
		var top = 150 - draw.drawRelPos[1];
		var width = 150;
		var height = 150;
		var cells = [];
		var widths = [];
		var heights = [];
		for (var i = 0; i < 2; i++) {
			cellRow = [];
			for (var j = 0; j < 3; j++) {
				cellRow.push({
					text: [""],
					align: [0, 0],
					box: {
						type: 'loose',
						color: 'none',
						borderColor: '#000',
						radius: 15,
						borderWidth: 2
					}
				});
			}
			cells.push(cellRow);
			heights.push(height);
		}
		for (var j = 0; j < 3; j++)
			widths.push(width);
		var path = {
			obj: [{
					type: 'table2',
					left: left,
					top: top,
					widths: widths,
					heights: heights,
					text: {
						font: 'Arial',
						size: 28,
						color: '#000'
					},
					outerBorder: {
						show: false,
						width: 4,
						color: '#000',
						dash: [0, 0]
					},
					innerBorder: {
						show: false,
						width: 2,
						color: '#666',
						dash: [0, 0]
					},
					cells: cells,
					paddingH: 10,
					paddingV: 10
				}
			],
			isInput: {
				type: 'select',
				shuffle: true,
				multiSelect: true,
				checkSelectCount: false,
				selColors: ['#CCF', '#66F']
			},
			selected: true
		};
		draw.path.push(path);
		draw.table2.draw(draw.hiddenCanvas.ctx, path.obj[0], path);
		updateBorder(path);
		drawCanvasPaths();
	},
	drawButton: function (ctx, size) {
		ctx.clear();
		roundedRect(ctx, 3, 3, 49, 49, 8, 6, '#000', '#F96');
		ctx.strokeStyle = '#666';
		ctx.lineWidth = 1;
		ctx.fillStyle = '#FFF';
		ctx.fillRect(10, 11, 35, 33);
		ctx.fillStyle = '#393';
		ctx.fillRect(10 + 11 * 1, 11 + 0 * 33 / 4, 35 / 3, 33 / 4);
		ctx.fillRect(10 + 11 * 0, 11 + 1 * 33 / 4, 35 / 3, 33 / 4);
		ctx.fillRect(10 + 11 * 2, 11 + 3 * 33 / 4, 35 / 3, 33 / 4);
		ctx.beginPath();
		for (var i = 0; i < 5; i++) {
			ctx.moveTo(10, 11 + i * 33 / 4);
			ctx.lineTo(45, 11 + i * 33 / 4);
		}
		for (var i = 0; i < 4; i++) {
			ctx.moveTo(10 + i * 35 / 3, 11);
			ctx.lineTo(10 + i * 35 / 3, 44);
		}
		ctx.stroke();
		ctx.lineWidth = 1;
		ctx.strokeStyle = '#000';
		ctx.strokeRect(10, 11, 35, 33);
	},
};
draw.singleSelectTable = {
	add: function () {
		deselectAllPaths();
		var left = 100 - draw.drawRelPos[0];
		var top = 150 - draw.drawRelPos[1];
		var width = 150;
		var height = 150;
		var cells = [];
		var widths = [];
		var heights = [];
		for (var i = 0; i < 2; i++) {
			cellRow = [];
			for (var j = 0; j < 2; j++) {
				cellRow.push({
					text: [""],
					align: [0, 0],
					box: {
						type: 'loose',
						color: 'none',
						borderColor: '#000',
						radius: 15,
						borderWidth: 2
					}
				});
			}
			cells.push(cellRow);
			heights.push(height);
		}
		for (var j = 0; j < 2; j++)
			widths.push(width);
		var path = {
			obj: [{
					type: 'table2',
					left: left,
					top: top,
					widths: widths,
					heights: heights,
					text: {
						font: 'Arial',
						size: 28,
						color: '#000'
					},
					outerBorder: {
						show: false,
						width: 4,
						color: '#000',
						dash: [0, 0]
					},
					innerBorder: {
						show: false,
						width: 2,
						color: '#666',
						dash: [0, 0]
					},
					cells: cells,
					paddingH: 10,
					paddingV: 10
				}
			],
			isInput: {
				type: 'select',
				shuffle: true,
				multiSelect: false,
				checkSelectCount: false,
				selColors: ['#CCF', '#66F']
			},
			selected: true
		};
		draw.path.push(path);
		draw.table2.draw(draw.hiddenCanvas.ctx, path.obj[0], path);
		updateBorder(path);
		drawCanvasPaths();
	},
	drawButton: function (ctx, size) {
		ctx.clear();
		roundedRect(ctx, 3, 3, 49, 49, 8, 6, '#000', '#F96');
		ctx.strokeStyle = '#666';
		ctx.lineWidth = 1;
		ctx.fillStyle = '#FFF';
		ctx.fillRect(10, 11, 35, 33);
		ctx.fillStyle = '#393';
		ctx.fillRect(10, 11, 35 / 2, 33 / 2);
		ctx.beginPath();
		for (var i = 0; i < 3; i++) {
			ctx.moveTo(10, 11 + i * 33 / 2);
			ctx.lineTo(45, 11 + i * 33 / 2);
		}
		for (var i = 0; i < 3; i++) {
			ctx.moveTo(10 + i * 35 / 2, 11);
			ctx.lineTo(10 + i * 35 / 2, 44);
		}
		ctx.stroke();
		ctx.lineWidth = 1;
		ctx.strokeStyle = '#000';
		ctx.strokeRect(10, 11, 35, 33);
	},
};
draw.tickCrossSelectH = {
	add: function () {
		draw.tickCrossSelect.add();
	},
	drawButton: function (ctx, size) {
		ctx.clear();
		roundedRect(ctx, 3, 3, 49, 49, 8, 6, '#000', '#F96');
		ctx.fillStyle = '#FFF';
		ctx.fillRect(7.5, 17.5, 40, 20);
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(27.5, 17.5);
		ctx.lineTo(27.5, 37.5);
		ctx.stroke();
		ctx.strokeRect(7.5, 17.5, 40, 20);
		drawTick(ctx, 15, 18, '#060', 7.5 + 2.5, 17.5 + 1, 3);
		drawCross(ctx, 15, 18, '#F00', 27.5 + 2.5, 17.5 + 1, 3);
	}
}
draw.tickCrossSelectV = {
	add: function () {
		draw.tickCrossSelect.add('vert');
	},
	drawButton: function (ctx, size) {
		ctx.clear();
		roundedRect(ctx, 3, 3, 49, 49, 8, 6, '#000', '#F96');
		ctx.fillStyle = '#FFF';
		ctx.fillRect(17.5, 7.5, 20, 40);
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(17.5, 27.5);
		ctx.lineTo(37.5, 27.5);
		ctx.stroke();
		ctx.strokeRect(17.5, 7.5, 20, 40);
		drawTick(ctx, 15, 18, '#060', 17.5 + 2.5, 7.5 + 1, 3);
		drawCross(ctx, 15, 18, '#F00', 17.5 + 2.5, 27.5 + 1, 3);
	}
}
draw.tickCrossSelect = {
	add: function (type) {
		deselectAllPaths();
		var left = 100 - draw.drawRelPos[0];
		var top = 150 - draw.drawRelPos[1];

		var paths1 = {
			obj: [{
					type: "tick",
					rect: [155, 125, 40, 50],
					lineWidth: 10,
					lineColor: "#060"
				}
			]
		};
		var paths2 = {
			obj: [{
					type: "cross",
					rect: [305, 125, 40, 50],
					lineWidth: 10,
					lineColor: "#F00"
				}
			]
		};
		updateBorder(paths1);
		updateBorder(paths2);

		var cell1 = {
			text: [""],
			align: [0, 0],
			box: {
				type: "loose",
				borderColor: "#000",
				borderWidth: 5,
				radius: 10,
				show: true
			},
			paths: [paths1],
			selColors: ["none", "#6F6"],
			ans: false
		};
		var cell2 = {
			text: [""],
			align: [0, 0],
			box: {
				type: "loose",
				borderColor: "#000",
				borderWidth: 5,
				radius: 10,
				show: true
			},
			paths: [paths2],
			selColors: ["none", "#F66"],
			ans: false
		}
		if (type == 'vert') {
			var cells = [[cell1], [cell2]];
			var widths = [150];
			var heights = [100, 100]
		} else {
			var cells = [[cell1, cell2]];
			var widths = [150, 150];
			var heights = [100]
		}

		var obj = {
			type: "table2",
			left: left,
			top: top,
			widths: widths,
			heights: heights,
			text: {
				font: "Arial",
				size: 28,
				color: "#000"
			},
			outerBorder: {
				show: false
			},
			innerBorder: {
				show: false
			},
			cells: cells
		};

		obj.xPos = [obj.left];
		for (var i = 0; i < obj.widths.length; i++)
			obj.xPos.push(obj.xPos.last() + obj.widths[i]);
		obj.yPos = [obj.top];
		for (var i = 0; i < obj.heights.length; i++)
			obj.yPos.push(obj.yPos.last() + obj.heights[i]);

		draw.path.push({
			obj: [obj],
			selected: true,
			isInput: {
				type: 'select',
				shuffle: true,
				multiSelect: false,
				checkSelectCount: true
			}
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
	}
}
draw.table2 = {
	derivedProperties: ['width', 'height', 'xPos', 'yPos', 'ctx'],
	cells: function (obj, func, path) {
		if (un(obj))
			return;
		if (typeof func !== 'function')
			return;
		for (var r = 0, rMax = obj.cells.length; r < rMax; r++) {
			for (var c = 0, cMax = obj.cells[r].length; c < cMax; c++) {
				var cell = obj.cells[r][c];
				func(cell, obj, path, r, c);
			}
		}
	},
	getCellRect: function (obj, r, c) {
		return [obj.xPos[c], obj.yPos[r], obj.widths[c], obj.heights[r]];
	},
	selectTable: {
		getCursorPositionsInteract: function (obj, path, pathNum) {
			var pos = [];
			var top = obj.top;
			var rows = obj.heights.length;
			var cols = obj.widths.length;
			var paddingH = obj.paddingH || 0;
			var paddingV = obj.paddingV || 0;

			for (var r = 0; r < rows; r++) {
				var left = obj.left;
				for (var c = 0; c < cols; c++) {
					pos.push({
						shape: 'rect',
						dims: [left + paddingH, top + paddingV, obj.widths[c] - 2 * paddingH, obj.heights[r] - 2 * paddingV],
						cursor: draw.cursors.pointer,
						func: draw.table2.selectTable.cellToggle,
						path: path,
						obj: obj,
						pathNum: pathNum,
						row: r,
						col: c
					});
					left += obj.widths[c];
				}
				top += obj.heights[r];
			}
			if (un(obj._check)) {
				if (!un(path.isInput) && !un(path.isInput.checkPos)) {
					var l2 = path.isInput.checkPos[0] - 20;
					var t2 = path.isInput.checkPos[1] - 20;
				} else if (!un(path.interact) && !un(path.interact.checkPos)) {
					var l2 = path.interact.checkPos[0] - 20;
					var t2 = path.interact.checkPos[1] - 20;
				} else {
					var l2 = obj.left + obj.width + 10;
					var t2 = obj.top + (obj.paddingH || 0);
				}
				pos.push({
					shape: 'rect',
					dims: [l2, t2, 40, 40],
					cursor: draw.cursors.pointer,
					func: draw.table2.selectTable.check,
					path: path,
					obj: obj,
					pathNum: pathNum
				});
			}
			return pos;
		},
		getButtons: function (x1, y1, x2, y2, pathNum) {
			var buttons = [];
			var path = draw.path[pathNum];
			var obj = path.obj[0];
			var interact = path.interact || path.isInput || obj.interact;
			if (!un(obj.xPos) && !un(obj.yPos)) {
				for (var r = 0; r < obj.cells.length; r++) {
					for (var c = 0; c < obj.cells[r].length; c++) {
						if (interact._mode === 'addAnswers') {
							buttons.push({
								buttonType: 'select-input-cellToggle2',
								shape: 'rect',
								dims: [obj.xPos[c], obj.yPos[r], obj.widths[c], obj.heights[r]],
								cursor: draw.cursors.pointer,
								func: draw.table2.selectTable.cellToggle,
								pathNum: pathNum,
								path: path,
								obj: obj,
								row: r,
								col: c
							});
						} else if (interact._mode === 'showAnswers') {}
						else {
							/*buttons.push({buttonType:'select-input-cellToggle',shape:'rect',dims:[obj.xPos[c+1]-20,obj.yPos[r],20,20],cursor:draw.cursors.pointer,func:draw.table2.selectTable.cellToggle,pathNum:pathNum,path:path,obj:obj,row:r,col:c});*/
						}
					}
				}
			}
			/*buttons.push({buttonType:'select-input-shuffleToggle',shape:'rect',dims:[x1+20,y2-20,60,20],cursor:draw.cursors.pointer,func:draw.table2.selectTable.shuffleToggle,pathNum:pathNum,shuffle:path.isInput.shuffle});
			if (!un(path.isInput.selColors)) {
			buttons.push({buttonType:'select-input-selColors',shape:'rect',dims:[x1+80,y2-20,20,20],cursor:draw.cursors.pointer,func:draw.table2.selectTable.selColors,pathNum:pathNum,selColors:path.isInput.selColors});
			}*/
			return buttons;
		},
		cellToggle: function () {
			var path = draw.currCursor.path;
			var obj = draw.currCursor.obj;
			var cell = obj.cells[draw.currCursor.row][draw.currCursor.col];
			var interact = path.interact || path.isInput || obj.interact;
			if (draw.mode == 'interact') {
				if (cell.toggle == true) {
					delete cell.toggle;
					if (interact.multiSelect !== true)
						delete interact._value; ;
				} else {
					if (interact.multiSelect == true) {
						cell.toggle = true;
					} else {
						delete interact._value;
						for (var r = 0; r < obj.cells.length; r++) {
							for (var c = 0; c < obj.cells[r].length; c++) {
								if (r == draw.currCursor.row && c == draw.currCursor.col) {
									obj.cells[r][c].toggle = true;
									var value = obj.cells[r][c].value || obj.cells[r][c].id || obj.cells[r][c].text;
									if (value instanceof Array && value.length === 1)
										value = removeTags(value[0]);
									interact._value = value;
								} else {
									delete obj.cells[r][c].toggle;
								}
							}
						}
					}
				}
			} else {
				if (interact._mode === 'addAnswers') {
					if (cell.toggle == true) {
						delete cell.toggle;
					} else {
						if (interact.multiSelect == true) {
							cell.toggle = true;
						} else {
							for (var r = 0; r < obj.cells.length; r++) {
								for (var c = 0; c < obj.cells[r].length; c++) {
									if (r == draw.currCursor.row && c == draw.currCursor.col) {
										obj.cells[r][c].toggle = true;
									} else {
										delete obj.cells[r][c].toggle;
									}
								}
							}
						}
					}
				} else {
					/*if (cell.ans == true) {
					delete cell.ans;
					} else {
					if (interact.multiSelect == true) {
					cell.ans = true;
					} else {
					for (var r = 0; r < obj.cells.length; r++) {
					for (var c = 0; c < obj.cells[r].length; c++) {
					if (r == draw.currCursor.row && c == draw.currCursor.col) {
					obj.cells[r][c].ans = true;
					} else {
					delete obj.cells[r][c].ans;
					}
					}
					}
					}
					}*/
				}
			}
			if (typeof interact.onchange === 'function')
				interact.onchange(obj);
			updateBorder(path);
			drawCanvasPaths();
		},
		setValue: function (obj, value) {
			var path = obj._path || draw.getPathOfObj(obj);
			var interact = path.interact || path.isInput || obj.interact;
			interact._value = value;
			for (var r = 0; r < obj.cells.length; r++) {
				for (var c = 0; c < obj.cells[r].length; c++) {
					var cell = obj.cells[r][c];
					delete cell.toggle;
					if (un(value))
						continue;
					if (cell.value === value || cell.id === value)
						cell.toggle = true;
					if (value instanceof Array && arraysEqual(value, cell.text))
						cell.toggle = true;
					var cellText = removeTags(cell.text);
					if (cellText.length === 1 && typeof cellText[0] === 'string' && cellText[0] === value)
						cell.toggle = true;
				}
			}
			drawCanvasPaths();
		},
		shuffleToggle: function () {
			var path = draw.path[draw.currCursor.pathNum];
			var isInput = path.isInput;
			if (un(isInput.shuffle))
				isInput.shuffle = false;
			isInput.shuffle = !isInput.shuffle;
			updateBorder(path);
			drawCanvasPaths();
		},
		selColors: function () {
			var path = draw.path[draw.currCursor.pathNum];
			var isInput = path.isInput;
			var colors = [['#CCF', '#66F'], ['#FCC', '#F66'], ['#CFC', '#393']];
			if (un(isInput.selColors)) {
				isInput.selColors = colors[0];
			} else {
				for (var c = 0; c < colors.length; c++) {
					if (arraysEqual(colors[c], isInput.selColors)) {
						isInput.selColors = colors[(c + 1) % colors.length];
						break;
					}
				}
			}
			updateBorder(path);
			drawCanvasPaths();
		},
		reset: function (obj, path) {
			if (un(path))
				path = obj._path || draw.getPathOfObj(obj);
			draw.table2.cells(obj, function (cell, obj, path) {
				delete cell.toggle;
			});
			var interact = path.interact || path.isInput || obj.interact;
			delete interact._value;
			drawCanvasPaths();
		},
		/*check: function(obj,path,answerData) {
		if (un(obj)) var obj = draw.currCursor.obj;
		var correct = 0;
		var wrong = 0;
		var ansTotal = 0;

		obj._cells = [];
		for (var r = 0; r < obj.cells.length; r++) {
		for (var c = 0; c < obj.cells[r].length; c++) {
		obj._cells.push(obj.cells[r][c]);
		}
		}

		for (var c = 0; c < obj._cells.length; c++) {
		var cell = obj._cells[c];
		if (!un(answerData) && !un(answerData.selectedCellIDs) {
		var toggle = selectedCellIDs.indexOf(cell.cellID) > -1 ? true : false;
		} else {
		var toggle = cell.toggle === true ? true : false;
		}
		var ans = cell.ans === true ? true : false;
		if (ans == true) {
		ansTotal++;
		if (toggle == true) correct++;
		} else if (toggle == true) {
		wrong++;
		}
		});
		if (correct == ansTotal && wrong == 0) {
		obj._check = true;
		} else {
		obj._check = false;
		}
		return obj._check;
		},*/
		countCheckedCells: function (obj) {
			if (un(obj))
				var obj = draw.currCursor.obj;
			var count = 0;
			draw.table2.cells(obj, function (cell, obj, path) {
				if (cell.toggle === true)
					count++;
			});
			return count;
		},
		getCheckedCells: function (obj) {
			if (un(obj))
				var obj = draw.currCursor.obj;
			var cells = [];
			draw.table2.cells(obj, function (cell, obj, path) {
				if (cell.toggle === true) {
					if (!un(cell.value)) {
						cells.push({
							value: cell.value
						});
					} else if (!arraysEqual(cell.text, [""])) {
						cells.push({
							text: cell.text
						});
					} else {
						cells.push({
							c: cell._c,
							r: cell._r
						});
					}
				}
			});
			cells.sort();
			return cells;
		}
	},

	getCells: function (obj) {
		obj._cells = [];
		for (var r = 0; r < obj.cells.length; r++) {
			for (var c = 0; c < obj.cells[r].length; c++) {
				var cell = obj.cells[r][c];
				obj._cells.push(cell);
			}
		}
		return obj._cells;
	},
	getXPos: function (obj) {
		var xPos = [obj.left];
		var x = obj.left;
		if (un(obj.widths))
			return xPos;
		for (var r = 0; r < obj.widths.length; r++) {
			x += obj.widths[r];
			xPos.push(x);
		}
		return xPos;
	},
	getYPos: function (obj) {
		var yPos = [obj.top];
		var y = obj.top;
		if (un(obj.heights))
			return yPos;
		for (var r = 0; r < obj.heights.length; r++) {
			y += obj.heights[r];
			yPos.push(y);
		}
		return yPos;
	},
	add: function (r, c) {
		deselectAllPaths(false);
		changeDrawMode();
		var left = 100 - draw.drawRelPos[0];
		var top = 150 - draw.drawRelPos[1];
		var width = Math.min(400 / c, 80);
		var height = Math.min(500 / r, 50);
		var cells = [];
		var widths = [];
		var heights = [];
		for (var i = 0; i < r; i++) {
			cellRow = [];
			for (var j = 0; j < c; j++) {
				cellRow.push({
					text: [""],
					align: [0, 0]
				});
			}
			cells.push(cellRow);
			heights.push(height);
		}
		for (var j = 0; j < c; j++)
			widths.push(width);

		draw.path.push({
			obj: [{
					type: 'table2',
					left: left,
					top: top,
					widths: widths,
					heights: heights,
					text: {
						font: 'Arial',
						size: 28,
						color: '#000'
					},
					outerBorder: {
						show: true,
						width: 4,
						color: '#000',
						dash: [0, 0]
					},
					innerBorder: {
						show: true,
						width: 2,
						color: '#666',
						dash: [0, 0]
					},
					cells: cells,
				}
			],
			selected: true
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
		calcCursorPositions();
		tableMenuClose();
	},
	draw: function (ctx, obj, path) {
		if (un(obj.widths) || obj.widths.length == 0)
			return;
		if (un(obj.heights) || obj.heights.length == 0)
			return;
		ctx.save();
		obj.ctx = ctx;
		for (var r = 0; r < obj.cells.length; r++) {
			for (var c = 0; c < obj.cells[r].length; c++) {
				var cell = obj.cells[r][c];
				cell._r = r;
				cell._c = c;
				cell.text = simplifyText(cell.text);
			}
		}
		var interact = path.interact || path.isInput || obj.interact;
		if (!un(interact) && interact.type == 'select') {
			for (var r = 0; r < obj.cells.length; r++) {
				for (var c = 0; c < obj.cells[r].length; c++) {
					var cell = obj.cells[r][c];
					var selected = cell.toggle === true ? true : false;
					/*if (draw.mode == 'interact' || interact._mode == 'showAnswers' || interact._mode == 'addAnswers') {
					var selected = cell.toggle === true ? true : false;
					} else {
					var selected = cell.ans === true ? true : false;
					}*/
					if (!un(cell.box)) {
						if (!un(cell.selColors)) {
							cell.box.color = selected === true ? cell.selColors[1] : cell.selColors[0];
						} else if (!un(obj.selColors)) {
							cell.box.color = selected === true ? obj.selColors[1] : obj.selColors[0];
						} else if (!un(interact.selColors)) {
							cell.box.color = selected === true ? interact.selColors[1] : interact.selColors[0];
						}
					}
				}
			}
		}
		var table = drawTable3(obj);
		obj._cells = [];
		for (var r = 0; r < obj.cells.length; r++) {
			for (var c = 0; c < obj.cells[r].length; c++) {
				var cell = obj.cells[r][c];
				obj._cells.push(cell);
				cell.tightRect = table.cellTextMeasure[r][c].tightRect;
				if (!un(cell.paths)) {
					var cellCenter = [(table.xPos[c] + table.xPos[c + 1]) / 2, (table.yPos[r] + table.yPos[r + 1]) / 2]
					for (var p = 0; p < cell.paths.length; p++) {
						// position the paths relative to centre of cells
						var path2 = cell.paths[p];
						if (un(path2.tightBorder))
							updateBorder(path2);
						var pathCenter = [path2.tightBorder[0] + 0.5 * path2.tightBorder[2], path2.tightBorder[1] + 0.5 * path2.tightBorder[3]];
						var dx = cellCenter[0] - pathCenter[0];
						var dy = cellCenter[1] - pathCenter[1];
						repositionPath(path2, dx, dy);
					}
					drawPathsToCanvas(ctx.canvas, cell.paths, 0);
				}
			}
		}
		if (obj.textEdit == true) {
			if (!un(textEdit.tableCell) && !un(textEdit.tableCell[0]) && !un(textEdit.tableCell[1]) && !un(table.cellTextMeasure[textEdit.tableCell[0]]) && !un(table.cellTextMeasure[textEdit.tableCell[0]][textEdit.tableCell[1]])) {
				var measure = table.cellTextMeasure[textEdit.tableCell[0]][textEdit.tableCell[1]];
				textEdit.cursorMap = textEdit.mapTextLocs(obj, measure.textLoc, measure.softBreaks, measure.hardBreaks);
				textEdit.tightRect = measure.tightRect;
				textEdit.textLoc = measure.textLoc;
				//textEdit.softBreaks = measure.softBreaks;
				//textEdit.hardBreaks = measure.hardBreaks;
				textEdit.lineRects = measure.lineRects;
				textEdit.path = path;
				textEdit.pathIndex = draw.path.indexOf(path);
				delete textEdit.allMap;
				textEdit.blinkReset();
				if (!un(textEdit.menu)) textEdit.menu.update();
			}
		}

		obj.xPos = table.xPos;
		obj.yPos = table.yPos;
		obj.width = obj.xPos[obj.xPos.length - 1] - obj.left;
		obj.height = obj.yPos[obj.yPos.length - 1] - obj.top;

		/*if (!un(path.isInput) && path.isInput.type == 'select') {
		if (draw.mode == 'interact' && un(obj._check)) {
		if (!un(path.isInput.checkPos)) {
		var l2 = path.isInput.checkPos[0]-20;
		var t2 = path.isInput.checkPos[1]-20;
		} else {
		var l2 = obj.left+obj.width+10;
		var t2 = obj.top+(obj.paddingH || 0);
		}
		roundedRect(ctx, l2+3, t2+3, 40 - 6, 40 - 6, 3, 6, '#C93', '#FB8');
		ctx.beginPath();
		ctx.fillStyle = '#FFF';
		drawStar({
		ctx: ctx,
		center: [l2+20,t2+20],
		radius: 12,
		points: 5
		});
		ctx.fill();
		} else {
		var markType = 'none';
		var l2 = obj.left+obj.width+15;
		var t2 = obj.top+(obj.paddingH || 0);
		if (draw.mode == 'edit') {
		markType = 'tick';
		var color = colorA('#060',0.5);
		} else if (draw.mode == 'interact') {
		if (obj._check === true) {
		markType = 'tick';
		var color = '#060';
		} else if (obj._check === false) {
		markType = 'cross';
		var color = '#F00';
		}
		}
		if (markType == 'tick') drawTick(ctx,40,50,color,l2,t2,7);
		if (markType == 'cross') drawCross(ctx,40,50,color,l2,t2,7);
		}
		}*/

		ctx.restore();
	},
	getRect: function (obj) {
		obj.width = arraySum(obj.widths);
		obj.height = arraySum(obj.heights);
		return [obj.left, obj.top, obj.width, obj.height];
	},
	getCursorPositionsSelected: function (obj, pathNum) {
		var pos = [];
		if (!un(obj.xPos) && !un(obj.yPos)) {
			var xPos = obj.xPos;
			var yPos = obj.yPos;
			for (var r = 0; r < obj.cells.length; r++) {
				for (var c = 0; c < obj.cells[r].length; c++) {
					pos.push({
						shape: 'rect',
						dims: obj.cells[r][c].tightRect,
						cursor: draw.cursors.text,
						func: textEdit.tableSelectStart,
						pathNum: pathNum,
						obj: obj,
						cell: [r, c]
					});
					pos.push({
						shape: 'rect',
						dims: [xPos[c], yPos[r], 10, yPos[r + 1] - yPos[r]],
						cursor: draw.cursors.upRightArrow,
						func: draw.table2.selectCell,
						pathNum: pathNum,
						r: r,
						c: c
					});
				}
			}
			for (var c = 1; c < xPos.length; c++) {
				pos.push({
					shape: 'rect',
					dims: [xPos[c - 1], obj.top - 10, xPos[c] - xPos[c - 1], 15],
					cursor: draw.cursors.downArrow,
					func: draw.table2.selectCol,
					pathNum: pathNum,
					c: c
				});
				pos.push({
					shape: 'rect',
					dims: [xPos[c] - 5, obj.top, 10, obj.height],
					cursor: draw.cursors.ew,
					func: draw.table2.resizeCol,
					pathNum: pathNum,
					c: c
				});
			}
			for (var r = 1; r < yPos.length; r++) {
				pos.push({
					shape: 'rect',
					dims: [obj.left - 10, yPos[r - 1], 15, yPos[r] - yPos[r - 1]],
					cursor: draw.cursors.rightArrow,
					func: draw.table2.selectRow,
					pathNum: pathNum,
					r: r
				});
				pos.push({
					shape: 'rect',
					dims: [obj.left, yPos[r] - 5, obj.width, 10],
					cursor: draw.cursors.ns,
					func: draw.table2.resizeRow,
					pathNum: pathNum,
					r: r
				});
			}
		}
		return pos;
	},
	getCursorPositionsInteract: function (obj, path, pathNum) {
		var pos = [];
		if (!un(path)) {
			var interact = path.interact || path.isInput || obj.interact;
			if (!un(interact) && interact.type === 'select' && interact._disabled !== true) {
				pos = pos.concat(draw.table2.selectTable.getCursorPositionsInteract(obj, path, pathNum));
			}
		}
		return pos;
	},
	getButtons: function (x1, y1, x2, y2, pathNum) {
		var buttons = [];
		buttons.push({
			buttonType: 'table2-paddingHMinus',
			shape: 'rect',
			dims: [(x1 + x2) / 2 - 20, y2 - 20, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.table2.paddingHMinus,
			pathNum: pathNum
		});
		buttons.push({
			buttonType: 'table2-paddingHPlus',
			shape: 'rect',
			dims: [(x1 + x2) / 2, y2 - 20, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.table2.paddingHPlus,
			pathNum: pathNum
		});
		buttons.push({
			buttonType: 'table2-paddingVMinus',
			shape: 'rect',
			dims: [x2 - 20, (y1 + y2) / 2, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.table2.paddingVMinus,
			pathNum: pathNum
		});
		buttons.push({
			buttonType: 'table2-paddingVPlus',
			shape: 'rect',
			dims: [x2 - 20, (y1 + y2) / 2 - 20, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.table2.paddingVPlus,
			pathNum: pathNum
		});
		buttons.push({
			buttonType: 'table2-draw.table2.questionFit',
			shape: 'rect',
			dims: [x2 - 40, y2 - 20, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.table2.questionFit,
			pathNum: pathNum
		});
		buttons.push({
			buttonType: 'table2-draw.table2.questionGrid',
			shape: 'rect',
			dims: [x2 - 60, y2 - 20, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.table2.questionGrid,
			pathNum: pathNum
		});
		buttons.push({
			buttonType: 'table2-deleteContent',
			shape: 'rect',
			dims: [x2 - 40, y1, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.table2.deleteContent,
			pathNum: pathNum,
			draw: function (path, ctx, l, t, w, h) {
				ctx.lineWidth = 2;
				ctx.strokeStyle = colorA('#F00', 0.5);
				ctx.beginPath();
				ctx.moveTo(l + 0.2 * w, t + 0.2 * h);
				ctx.lineTo(l + 0.8 * w, t + 0.8 * h);
				ctx.moveTo(l + 0.2 * w, t + 0.8 * h);
				ctx.lineTo(l + 0.8 * w, t + 0.2 * h);
				ctx.stroke();
			}
		});
		buttons.push({
			buttonType: 'table2-reorder',
			shape: 'rect',
			dims: [x2 - 60, y1, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.table2.reorder,
			pathNum: pathNum,
			draw: function (path, ctx, l, t, w, h) {
				ctx.fillStyle = colorA('#9FC', 0.5);
				ctx.fillRect(l, t, w, h);
				text({
					ctx: ctx,
					rect: [l, t, w, h],
					align: [0, 0],
					text: ['<<fontSize:12>>ab']
				});
			}
		});

		buttons.push({
			buttonType: 'text2-fracScale',
			shape: 'rect',
			dims: [x1, y2 - 80, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.table2.setFracScale,
			pathNum: pathNum
		});
		buttons.push({
			buttonType: 'text2-algPadding',
			shape: 'rect',
			dims: [x1, y2 - 100, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.table2.setAlgPadding,
			pathNum: pathNum
		});

		if (!un(pathNum)) {
			var path = draw.path[pathNum];
			if (!un(path) && !un(path.isInput) && path.isInput.type == 'select' && path.obj.length == 1) {
				buttons = buttons.concat(draw.table2.selectTable.getButtons(x1, x2, y1, y2, pathNum));
			}
		}
		return buttons;
	},
	setFracScale: function (obj) {
		if (un(obj)) {
			var obj = draw.path[draw.currCursor.pathNum].obj[0];
		}
		if (obj.fracScale == 1) {
			delete obj.fracScale;
		} else {
			obj.fracScale = 1;
		}
		drawCanvasPaths();
	},
	setAlgPadding: function () {
		if (un(obj)) {
			var obj = draw.path[draw.currCursor.pathNum].obj[0];
		}
		if (typeof obj.algPadding == 'undefined') {
			obj.algPadding = 0;
		} else if (obj.algPadding == 5) {
			delete obj.algPadding;
		} else {
			obj.algPadding++;
		}
		drawCanvasPaths();
	},

	getSelectedCells: function (obj) {
		var selected = [];
		for (var r = 0; r < obj.cells.length; r++) {
			for (var c = 0; c < obj.cells[r].length; c++) {
				if (obj.cells[r][c].selected == true)
					selected.push(obj.cells[r][c]);
			}
		}
		return selected;
	},
	getAllCells: function (obj) {
		var all = [];
		for (var r = 0; r < obj.cells.length; r++) {
			for (var c = 0; c < obj.cells[r].length; c++) {
				all.push(obj.cells[r][c]);
			}
		}
		return all;
	},
	countSelectedCells: function (obj) {
		var selected = 0;
		for (var r = 0; r < obj.cells.length; r++) {
			for (var c = 0; c < obj.cells[r].length; c++) {
				if (obj.cells[r][c].selected == true)
					selected++;
			}
		}
		return selected;
	},
	transpose: function (obj) {
		if (un(obj))
			obj = sel();
		if (un(obj))
			return;
		var cells = obj.cells;
		var cells2 = [];
		var widths = [];
		var heights = [];
		for (var r = 0; r < cells.length; r++) {
			for (var c = 0; c < cells[r].length; c++) {
				if (un(cells2[c]))
					cells2[c] = [];
				cells2[c][r] = cells[r][c];
				if (un(widths[r]) || widths[r] < obj.widths[c])
					widths[r] = obj.widths[c];
				if (un(heights[c]) || heights[c] < obj.heights[r])
					heights[c] = obj.heights[r];
			}
		}
		obj.cells = cells2;
		obj.widths = widths;
		obj.heights = heights;
		updateBorder(selPaths()[0]);
		drawCanvasPaths();
	},
	reorder: function (obj) {
		if (un(obj))
			obj = sel();
		if (un(obj))
			return;
		var cells = obj.cells;
		var allCells = [];
		for (var c = 0; c < obj.widths.length; c++) { // get cells column by column
			for (var r = 0; r < cells.length; r++) {
				allCells.push(cells[r][c]);
			}
		}
		for (var r = 0; r < cells.length; r++) { // replace cells row by row
			for (var c = 0; c < cells[r].length; c++) {
				cells[r][c] = allCells.shift();
			}
		}
		updateBorder(selPaths()[0]);
		drawCanvasPaths();
	},
	setColumns: function (cols, obj) {
		if (un(obj))
			obj = sel();
		if (un(obj))
			return;
		if (un(cols))
			cols = obj.widths.length - 1;

		var width = 0;
		for (var c = 0; c < obj.widths.length; c++)
			width += obj.widths[c];
		obj.widths = [];
		for (var c = 0; c < cols; c++)
			obj.widths[c] = width / cols;

		var cells = obj.cells;
		var allCells = [];
		for (var r = 0; r < cells.length; r++) {
			for (var c = 0; c < cells.length; c++) {
				allCells.push(cells[r][c]);
			}
		}
		var rows = Math.ceil(allCells.length / cols);
		while (obj.heights.length < rows)
			obj.heights.push(obj.heights.last());

		obj.cells = [];
		for (var r = 0; r < rows; r++) { // replace cells row by row
			obj.cells[r] = [];
			for (var c = 0; c < cols; c++) {
				if (allCells.length == 0)
					continue;
				obj.cells[r][c] = allCells.shift();
			}
		}
		updateBorder(selPaths()[0]);
		drawCanvasPaths();
	},
	deleteContent: function (obj) {
		if (typeof obj == 'undefined') {
			if (sel() == false)
				return;
			var obj = sel();
		}
		var cells = draw.table2.getSelectedCells(obj);
		if (cells.length == 0)
			cells = draw.table2.getAllCells(obj);
		for (var c = 0; c < cells.length; c++)
			cells[c].text = [""];
		drawCanvasPaths();
	},
	grabPaths: function () {
		var s = selPaths();
		var tablePath,
		table;
		for (var p = 0; p < s.length; p++) {
			if (s[p].obj[0].type == 'table2') {
				tablePath = s[p];
				tablePath.selected = false;
				table = s[p].obj[0];
				s.splice(p, 1);
				break;
			}
		}
		if (typeof table == 'undefined')
			return;
		var xPos = [table.left];
		var yPos = [table.top];
		for (var w = 0; w < table.widths.length; w++)
			xPos[w + 1] = xPos[w] + table.widths[w];
		for (var h = 0; h < table.heights.length; h++)
			yPos[h + 1] = yPos[h] + table.heights[h];
		for (var p = 0; p < s.length; p++) {
			var row,
			col;
			var x = s[p].tightBorder[0] + 0.5 * s[p].tightBorder[2];
			var y = s[p].tightBorder[1] + 0.5 * s[p].tightBorder[3];
			for (var w = 0; w < xPos.length - 1; w++) {
				if (x >= xPos[w] && x <= xPos[w + 1]) {
					col = w;
					break;
				}
			}
			for (var h = 0; h < yPos.length - 1; h++) {
				if (y >= yPos[h] && y <= yPos[h + 1]) {
					row = h;
					break;
				}
			}
			//console.log(s[p].obj[0],x,y,col,row);
			var cell = table.cells[row][col];
			if (un(cell.paths))
				cell.paths = [];
			cell.paths = cell.paths.concat(s[p]);
		}

		// delete paths from main drawPaths
		for (var p = draw.path.length - 1; p >= 0; p--) {
			if (draw.path[p].selected == true) {
				draw.path[p].selected = false;
				draw.path.splice(p, 1);
			}
		}
		tablePath.selected = true;

		//console.log(table);
		drawCanvasPaths();
	},
	releasePaths: function () {
		var table = sel();
		if (typeof table == 'undefined' || table.type !== 'table2')
			return;
		for (var r = 0; r < table.cells.length; r++) {
			for (var c = 0; c < table.cells[r].length; c++) {
				var cell = table.cells[r][c];
				if (un(cell.paths))
					continue;
				for (var p = 0; p < cell.paths.length; p++) {
					cell.paths[p].selected = true;
					draw.path.push(cell.paths[p]);
					updateBorder(cell.paths[p]);
				}
				delete cell.paths
			}
		}
		drawCanvasPaths();
	},
	resizeCol: function () {
		changeDrawMode('tableColResize');
		draw.tableColResizing = draw.currCursor.c;
		draw.selectedPath = draw.currCursor.pathNum;
		draw.animate(draw.table2.resizeMove,draw.table2.resizeStop,drawCanvasPaths);
		//addListenerMove(window, draw.table2.resizeMove);
		//addListenerEnd(window, draw.table2.resizeStop);
	},
	resizeMove: function (e) {
		updateMouse(e);
		var path = draw.path[draw.selectedPath];
		var obj = path.obj[0];
		var width = draw.mouse[0] - obj.xPos[draw.tableColResizing - 1];
		if (obj.type == 'table') {
			for (var i = 0; i < obj.cells.length; i++) {
				obj.cells[i][draw.tableColResizing - 1].minWidth = width;
			}
		} else if (obj.type == 'table2') {
			if (draw.tableColResizing == obj.widths.length) {
				var tableRight = obj.left;
				for (var w = 0; w < obj.widths.length - 1; w++)
					tableRight += obj.widths[w];
				tableRight += width;
				if (Math.abs(tableRight - (draw.drawArea[2] - draw.gridMargin[2])) < draw.snapTolerance)
					width += ((draw.drawArea[2] - draw.gridMargin[2]) - tableRight);
			}
			obj.widths[draw.tableColResizing - 1] = width;
			obj.width = arraySum(obj.widths);
		}
		updateBorder(path);
		//drawSelectedPaths();
		//drawSelectCanvas();
	},
	resizeStop: function (e) {
		removeListenerMove(window, draw.table2.resizeMove);
		removeListenerEnd(window, draw.table2.resizeStop);
		changeDrawMode('prev');
		//drawCanvasPaths();
	},
	resizeRow: function () {
		changeDrawMode('tableRowResize');
		draw.tableRowResizing = draw.currCursor.r;
		draw.selectedPath = draw.currCursor.pathNum;
		draw.animate(draw.table2.rowResizeMove,draw.table2.rowResizeStop,drawCanvasPaths);
		//addListenerMove(window, draw.table2.rowResizeMove);
		//addListenerEnd(window, draw.table2.rowResizeStop);
	},
	rowResizeMove: function (e) {
		updateMouse(e);
		var path = draw.path[draw.selectedPath];
		var height = draw.mouse[1] - path.obj[0].yPos[draw.tableRowResizing - 1];
		if (path.obj[0].type == 'table') {
			for (var i = 0; i < path.obj[0].cells[draw.tableRowResizing - 1].length; i++) {
				path.obj[0].cells[draw.tableRowResizing - 1][i].minHeight = height;
			}
			repositionPath(path);
		} else if (path.obj[0].type == 'table2') {
			path.obj[0].heights[draw.tableRowResizing - 1] = height;
			path.obj[0].height = arraySum(path.obj[0].heights);
		}
		updateBorder(path);
		//drawSelectedPaths();
		//drawSelectCanvas();
	},
	rowResizeStop: function (e) {
		//removeListenerMove(window, draw.table2.rowResizeMove);
		//removeListenerEnd(window, draw.table2.rowResizeStop);
		changeDrawMode('prev');
		//drawCanvasPaths();
	},
	selectCol: function () {
		var col = draw.currCursor.c - 1;
		var pathNum = draw.currCursor.pathNum;
		var path = draw.path[pathNum];
		var cells = path.obj[0].cells;
		for (var r = 0; r < cells.length; r++) {
			for (var c = 0; c < cells[r].length; c++) {
				if (c == col) {
					cells[r][c].selected = true;
					cells[r][c].highlight = true;
				} else {
					delete cells[r][c].selected;
					delete cells[r][c].highlight;
				}
			}
		}
		drawSelectedPaths();
		draw.startX = draw.mouse[0]
			draw.startY = draw.mouse[1];
		changeDrawMode('tableColSelect');
		draw.animate(draw.table2.cellSelectMove,draw.table2.cellSelectStop,drawCanvasPaths);
		//addListenerMove(window, draw.table2.cellSelectMove);
		//addListenerEnd(window, draw.table2.cellSelectStop);
	},
	selectRow: function () {
		var row = draw.currCursor.r - 1;
		var pathNum = draw.currCursor.pathNum;
		var path = draw.path[pathNum];
		var cells = path.obj[0].cells;
		for (var r = 0; r < cells.length; r++) {
			for (var c = 0; c < cells[r].length; c++) {
				if (r == row) {
					cells[r][c].selected = true;
					cells[r][c].highlight = true;
				} else {
					delete cells[r][c].selected;
					delete cells[r][c].highlight;
				}
			}
		}
		drawSelectedPaths();
		draw.startX = draw.mouse[0]
		draw.startY = draw.mouse[1];
		changeDrawMode('tableRowSelect');
		draw.animate(draw.table2.cellSelectMove,draw.table2.cellSelectStop,drawCanvasPaths);
		//addListenerMove(window, draw.table2.cellSelectMove);
		//addListenerEnd(window, draw.table2.cellSelectStop);
	},
	selectCell: function () {
		var col = draw.currCursor.c;
		var row = draw.currCursor.r;
		var pathNum = draw.currCursor.pathNum;
		var path = draw.path[pathNum];
		var cells = path.obj[0].cells;
		for (var r = 0; r < cells.length; r++) {
			for (var c = 0; c < cells[r].length; c++) {
				if (r == row && c == col) {
					cells[r][c].selected = true;
					cells[r][c].highlight = true;
				} else {
					delete cells[r][c].selected;
					delete cells[r][c].highlight;
				}
			}
		}
		drawSelectedPaths();
		draw.startX = draw.mouse[0]
		draw.startY = draw.mouse[1];
		changeDrawMode('tableCellSelect');
		draw.animate(draw.table2.cellSelectMove,draw.table2.cellSelectStop,drawCanvasPaths);
		//addListenerMove(window, draw.table2.cellSelectMove);
		//addListenerEnd(window, draw.table2.cellSelectStop);
	},
	cellSelectMove: function (e) {
		updateMouse(e);
		var pathNum = draw.currCursor.pathNum;
		var startCol = draw.currCursor.c;
		var startRow = draw.currCursor.r;
		var path = draw.path[pathNum];
		var obj = path.obj[0];
		var xPos = obj.xPos;
		var yPos = obj.yPos;
		var colsSelected = [];
		var rowsSelected = [];
		var xMin = Math.min(draw.mouse[0], draw.startX);
		var xMax = Math.max(draw.mouse[0], draw.startX);
		var yMin = Math.min(draw.mouse[1], draw.startY);
		var yMax = Math.max(draw.mouse[1], draw.startY);
		if (draw.drawMode == 'tableRowSelect') {
			for (var k = 0; k < xPos.length - 1; k++) {
				colsSelected[k] = true;
			}
		} else {
			for (var k = 0; k < xPos.length - 1; k++) {
				if ((xPos[k] > xMin && xPos[k] < xMax) || (xPos[k] < xMin && xPos[k + 1] > xMax) || (xPos[k + 1] > xMin && xPos[k + 1] < xMax)) {
					colsSelected[k] = true;
				} else {
					colsSelected[k] = false;
				}
			}
		}
		if (draw.drawMode == 'tableColSelect') {
			for (var k = 0; k < yPos.length - 1; k++) {
				rowsSelected[k] = true;
			}
		} else {
			for (var k = 0; k < yPos.length - 1; k++) {
				if ((yPos[k] > yMin && yPos[k] < yMax) || (yPos[k] < yMin && yPos[k + 1] > yMax) || (yPos[k + 1] > yMin && yPos[k + 1] < yMax)) {
					rowsSelected[k] = true;
				} else {
					rowsSelected[k] = false;
				}
			}
		}
		if (getArrayCount(colsSelected, true) == 1 && getArrayCount(rowsSelected, true) == 1) {
			var selectCount = 1;
		} else if (getArrayCount(colsSelected, true) == 0 && getArrayCount(rowsSelected, true) == 0) {
			var selectCount = 0;
		} else {
			var selectCount = 2;
		}

		var cells = obj.cells;
		for (var k = 0; k < cells.length; k++) {
			for (var l = 0; l < cells[k].length; l++) {
				if (rowsSelected[k] == true && colsSelected[l] == true) {
					cells[k][l].selected = true;
					if (selectCount == 2 || draw.drawMode !== 'tableInputSelect') {
						cells[k][l].highlight = true;
					} else {
						delete cells[k][l].highlight;
					}
				} else {
					delete cells[k][l].selected;
					delete cells[k][l].highlight;
				}
			}
		}
		//drawSelectedPaths();
	},
	cellSelectStop: function (e) {
		//removeListenerMove(window, draw.table2.cellSelectMove);
		//removeListenerEnd(window, draw.table2.cellSelectStop);
		var pathNum = draw.currCursor.pathNum;
		var startCol = draw.currCursor.c;
		var startRow = draw.currCursor.r;
		var path = draw.path[pathNum];
		var obj = path.obj[0];
		var xPos = obj.xPos;
		var yPos = obj.yPos;
		changeDrawMode('textEdit');
		calcCursorPositions();
	},
	deselectTables: function () {
		var path = draw.path;
		for (var i = 0; i < path.length; i++) {
			if (typeof path[i].obj == 'undefined')
				continue;
			var changed = false;
			for (var j = 0; j < path[i].obj.length; j++) {
				if (path[i].obj[j].type == 'table' || path[i].obj[j].type == 'table2') {
					var cells = path[i].obj[j].cells;
					for (var r = 0; r < cells.length; r++) {
						for (var c = 0; c < cells[r].length; c++) {
							if (cells[r][c].selected == true) {
								delete cells[r][c].selected;
								delete cells[r][c].highlight;
								cells[r][c].text = removeTagsOfType(cells[r][c].text, 'selected');
								changed = true;
							}
						}
					}
				}
			}
			if (changed)
				drawSelectedPaths();
		}
	},
	paddingHPlus: function () {
		var pathNum = draw.currCursor.pathNum;
		var obj = draw.path[pathNum].obj[0];
		if (un(obj.paddingH))
			obj.paddingH = 0;
		obj.paddingH += 5;
		drawSelectedPaths();
	},
	paddingHMinus: function () {
		var pathNum = draw.currCursor.pathNum;
		var obj = draw.path[pathNum].obj[0];
		if (un(obj.paddingH))
			obj.paddingH = 0;
		obj.paddingH = Math.max(0, obj.paddingH - 5);
		drawSelectedPaths();
	},
	paddingVPlus: function () {
		var pathNum = draw.currCursor.pathNum;
		var obj = draw.path[pathNum].obj[0];
		if (un(obj.paddingV))
			obj.paddingV = 0;
		obj.paddingV += 5;
		drawSelectedPaths();
	},
	paddingVMinus: function () {
		var pathNum = draw.currCursor.pathNum;
		var obj = draw.path[pathNum].obj[0];
		if (un(obj.paddingV))
			obj.paddingV = 0;
		obj.paddingV = Math.max(0, obj.paddingV - 5);
		drawSelectedPaths();
	},
	questionGrid: function (border, dir) {
		if (un(dir))
			dir = 'vert';
		for (var p = 0; p < draw.path.length; p++) {
			if (draw.path[p].selected && draw.path[p].obj.length == 1 && draw.path[p].obj[0].type == 'table2') {
				var path = draw.path[p];
				var obj = path.obj[0];
				obj.fontSize = 28;
				if (draw.gridVertMargins.length > 0) {
					var totalWidth = draw.drawArea[2] - (draw.gridVertMargins[0] + draw.gridMargin[2]);
				} else {
					var totalWidth = draw.drawArea[2] - (draw.gridMargin[0] + draw.gridMargin[2]);
				}
				obj.width = totalWidth;
				for (var w = 0; w < obj.widths.length; w++) {
					obj.widths[w] = totalWidth / obj.widths.length;
				}
				if (draw.gridVertMargins.length > 0) {
					repositionPath(path, draw.gridVertMargins[0] - path.tightBorder[0], 0, 0, 0);
				} else {
					repositionPath(path, draw.gridMargin[0] - path.tightBorder[0], 0, 0, 0);
				}
				var cells = obj.cells;
				var letters = 'abcdefghijklmnopqrstuvwxyz';
				var cols = obj.widths.length;
				var rows = obj.heights.length;
				var count = 0;
				for (var r = 0; r < cells.length; r++) {
					for (var c = 0; c < cells[r].length; c++) {
						var cell = cells[r][c];
						cell.align = [-1, 0];
						delete cell.fontSize;
						if (dir == 'vert') {
							var char = letters.charAt(c * rows + r);
						} else {
							var char = letters.charAt(count);
						}
						var tabs = tab;
						if ('fijl'.indexOf(char) > -1)
							tabs += tab;
						cell.text = [char + ')' + tabs]
						count++;
					}
				}
				distributeHoriz();
				distributeVert();
				if (boolean(border, false) == false)
					obj.innerBorder.show = false;
				obj.outerBorder.show = false;
				updateBorder(path);
				drawCanvasPaths();
				repositionPath(path);
				return;
			}
		}
		console.log('selected table not found');
	},
	questionFit: function () {
		for (var p = 0; p < draw.path.length; p++) {
			if (draw.path[p].selected && draw.path[p].obj.length == 1 && draw.path[p].obj[0].type == 'table2') {
				var path = draw.path[p];
				var obj = path.obj[0];
				if (draw.gridVertMargins.length > 0) {
					var totalWidth = draw.drawArea[2] - (draw.gridVertMargins[0] + draw.gridMargin[2]);
				} else {
					var totalWidth = draw.drawArea[2] - (draw.gridMargin[0] + draw.gridMargin[2]);
				}
				obj.width = totalWidth;
				for (var w = 0; w < obj.widths.length; w++) {
					obj.widths[w] = totalWidth / obj.widths.length;
				}
				if (draw.gridVertMargins.length > 0) {
					repositionPath(path, draw.gridVertMargins[0] - path.tightBorder[0], 0, 0, 0);
				} else {
					repositionPath(path, draw.gridMargin[0] - path.tightBorder[0], 0, 0, 0);
				}
				distributeHoriz();
				distributeVert();
				obj.innerBorder.show = false;
				obj.outerBorder.show = false;
				updateBorder(path);
				drawCanvasPaths();
				repositionPath(path);
				return;
			}
		}
		console.log('selected table not found');
	},
	addRows: function (path, below) {
		if (path.obj[0].type !== 'table2')
			return;
		var obj = path.obj[0];
		var selRowsCols = draw.table2.getSelRowsCols(obj);
		var selRows = selRowsCols.rows;
		var selCols = selRowsCols.cols;
		var rowHeights = selRowsCols.rowHeights;
		var colWidths = selRowsCols.colWidths;
		if (selRows.length == 0 || selCols.length == 0)
			return;

		draw.drawModeSave = draw.drawMode;
		draw.drawMode = 'none';
		var cells = obj.cells;
		var newRows = [];
		var newHeights = [];
		for (var r = 0; r < selRows.length; r++) {
			newRows.push(clone(cells[selRows[r]]));
			newHeights.push(obj.heights[selRows[r]]);
		}
		if (boolean(below, true) == false) {
			var newCel = obj.cells.slice(0, selRows[0]).concat(newRows).concat(obj.cells.slice(selRows[0]));
			var newHei = obj.heights.slice(0, selRows[0]).concat(newHeights).concat(obj.heights.slice(selRows[0]));
		} else {
			var newCel = obj.cells.slice(0, selRows[selRows.length - 1] + 1).concat(newRows).concat(obj.cells.slice(selRows[selRows.length - 1] + 1));
			var newHei = obj.heights.slice(0, selRows[selRows.length - 1] + 1).concat(newHeights).concat(obj.heights.slice(selRows[selRows.length - 1] + 1));
		}
		obj.cells = newCel;
		obj.heights = newHei;
		draw.drawMode = draw.drawModeSave;
		updateBorder(path);
		drawCanvasPaths();
	},
	addCols: function (path, right) {
		if (path.obj[0].type !== 'table' && path.obj[0].type !== 'table2')
			return;
		var obj = path.obj[0];
		var selRowsCols = draw.table2.getSelRowsCols(obj);
		var selRows = selRowsCols.rows;
		var selCols = selRowsCols.cols;
		var rowHeights = selRowsCols.rowHeights;
		var colWidths = selRowsCols.colWidths;
		if (selRows.length == 0 || selCols.length == 0)
			return;
		draw.drawModeSave = draw.drawMode;
		draw.drawMode = 'none';
		var cells = obj.cells;
		var newWidths = [];
		for (var r = 0; r < cells.length; r++) {
			var newCells = [];
			for (var c = 0; c < selCols.length; c++) {
				var cell = clone(cells[r][selCols[c]]);
				var tags = textArrayGetStartTags(cell.text);
				cell.text = [tags];
				newCells.push(cell);
				if (r == 0)
					newWidths.push(obj.widths[selCols[c]]);
			}
			if (boolean(right, true) == false) {
				var newRow = obj.cells[r].slice(0, selCols[0]).concat(newCells).concat(obj.cells[r].slice(selCols[0]));
			} else {
				var newRow = obj.cells[r].slice(0, selCols[selCols.length - 1] + 1).concat(newCells).concat(obj.cells[r].slice(selCols[selCols.length - 1] + 1));
			}
			obj.cells[r] = newRow;
		}
		if (boolean(right, true) == false) {
			obj.widths = obj.widths.slice(0, selCols[0]).concat(newWidths).concat(obj.widths.slice(selCols[0]));
		} else {
			obj.widths = obj.widths.slice(0, selCols[selCols.length - 1] + 1).concat(newWidths).concat(obj.widths.slice(selCols[selCols.length - 1] + 1));
		}
		draw.drawMode = draw.drawModeSave;
		updateBorder(path);
		drawCanvasPaths();
	},
	deleteRows: function (path) {
		if (path.obj[0].type !== 'table' && path.obj[0].type !== 'table2')
			return;
		var obj = path.obj[0];
		var selRowsCols = draw.table2.getSelRowsCols(obj);
		var selRows = selRowsCols.rows;
		var selCols = selRowsCols.cols;
		var rowHeights = selRowsCols.rowHeights;
		var colWidths = selRowsCols.colWidths;
		if (selRows.length == 0 || selCols.length == 0)
			return;

		var cells = obj.cells;
		var type = obj.type;
		for (var r = selRows.length - 1; r >= 0; r--) {
			cells.splice(selRows[r], 1);
			obj.heights.splice(selRows[r], 1);
		}

		updateBorder(path);
		drawCanvasPaths();
	},
	deleteCols: function (path) {
		if (path.obj[0].type !== 'table' && path.obj[0].type !== 'table2')
			return;
		var obj = path.obj[0];
		var selRowsCols = draw.table2.getSelRowsCols(obj);
		var selRows = selRowsCols.rows;
		var selCols = selRowsCols.cols;
		var rowHeights = selRowsCols.rowHeights;
		var colWidths = selRowsCols.colWidths;
		if (selRows.length == 0 || selCols.length == 0)
			return;

		var cells = obj.cells;
		var type = obj.type;
		for (var r = 0; r < cells.length; r++) {
			for (var c = selCols.length - 1; c >= 0; c--) {
				cells[r].splice(selCols[c], 1);
				if (r == 0)
					obj.widths.splice(selCols[c], 1);
			}
		}

		updateBorder(path);
		drawCanvasPaths();
	},
	getSelRowsCols: function (obj) {
		var cells = obj.cells;
		var selRows = [];
		var selCols = [];
		var rowHeights = [];
		var colWidths = [];
		for (var r = 0; r < cells.length; r++) {
			for (var c = 0; c < cells[r].length; c++) {
				if (cells[r][c].selected == true) {
					if (selRows.indexOf(r) == -1) {
						selRows.push(r);
						rowHeights.push(obj.heights[r]);
					}
					if (selCols.indexOf(c) == -1) {
						selCols.push(c);
						colWidths.push(obj.widths[c]);
					}
				}
			}
		}
		return {
			rows: selRows,
			cols: selCols,
			rowHeights: rowHeights,
			colWidths: colWidths
		};
	},
	mergeTablesH: function () {
		var paths = selPaths();
		for (var p = paths.length - 1; p >= 0; p--) {
			if (paths[p].obj.length > 1 || paths[p].obj[0].type !== 'table2')
				paths.splice(p, 1);
		}
		if (paths.length < 2)
			return;
		paths.sort(function (a, b) {
			return a.border[0] - b.border[0];
		});

		var table = paths[0].obj[0];
		var cols = table.widths.length;

		for (var p = 1; p < paths.length; p++) {
			var obj = paths[p].obj[0];
			table.widths = table.widths.concat(obj.widths);
			var cells = obj.cells;
			for (r = 0; r < cells.length; r++) {
				for (c = 0; c < cells[r].length; c++) {
					table.cells[r][cols + c] = cells[r][c];
				}
			}
		}
		paths[0].selected = false;
		deletePaths();
		paths[0].selected = true;
		updateBorder(paths[0]);
		drawCanvasPaths();
	},
	mergeTablesV: function () {
		var paths = selPaths();
		for (var p = paths.length - 1; p >= 0; p--) {
			if (paths[p].obj.length > 1 || paths[p].obj[0].type !== 'table2')
				paths.splice(p, 1);
		}
		if (paths.length < 2)
			return;
		paths.sort(function (a, b) {
			return a.border[1] - b.border[1];
		});

		var table = paths[0].obj[0];
		var rows = table.heights.length;

		for (var p = 1; p < paths.length; p++) {
			var obj = paths[p].obj[0];
			table.heights = table.heights.concat(obj.heights);
			var cells = obj.cells;
			for (r = 0; r < cells.length; r++) {
				for (c = 0; c < cells[r].length; c++) {
					if (un(table.cells[rows + r]))
						table.cells[rows + r] = [];
					table.cells[rows + r][c] = cells[r][c];
				}
			}
		}
		paths[0].selected = false;
		deletePaths();
		paths[0].selected = true;
		updateBorder(paths[0]);
		drawCanvasPaths();
	},
	scale: function (obj, sf, center) {
		if (!un(center)) {
			obj.left = center[0] + sf * (obj.left - center[0]);
			obj.top = center[1] + sf * (obj.top - center[1]);
		}
		for (var w = 0; w < obj.widths.length; w++)
			obj.widths[w] *= sf;
		for (var h = 0; h < obj.heights.length; h++)
			obj.heights[h] *= sf;
		if (!un(obj.innerBorder)) {
			if (!un(obj.innerBorder.width))
				obj.innerBorder.width *= sf;
			if (!un(obj.innerBorder.dash)) {
				if (!un(obj.innerBorder.dash[0]))
					obj.innerBorder.dash[0] *= sf;
				if (!un(obj.innerBorder.dash[1]))
					obj.innerBorder.dash[1] *= sf;
			}
		}
		if (!un(obj.outerBorder)) {
			if (!un(obj.outerBorder.width))
				obj.outerBorder.width *= sf;
			if (!un(obj.outerBorder.dash)) {
				if (!un(obj.outerBorder.dash[0]))
					obj.outerBorder.dash[0] *= sf;
				if (!un(obj.outerBorder.dash[1]))
					obj.outerBorder.dash[1] *= sf;
			}
		}
		if (!un(obj.text)) {
			if (!un(obj.text.size))
				obj.text.size *= sf;
		}
		if (!un(obj.padding))
			obj.padding *= sf;
		for (var r = 0; r < obj.cells.length; r++) {
			for (var c = 0; c < obj.cells[r].length; c++) {
				var cell = obj.cells[r][c];
				if (!un(cell.padding)) cell.padding *= sf;
				if (!un(cell.fontSize)) cell.fontSize *= sf;
				textArrayFontSizeAdjust(cell.text, sf);
			}
		}
	},
	getControlPanel: function (obj) {
		var elements = [{
				name: 'Style',
				type: 'style'
			}, {
				name: 'Outer Border',
				type: 'tableBorder',
				type2: 'outer'
			}, {
				name: 'Inner Border',
				type: 'tableBorder',
				type2: 'inner'
			}
		];
		return {
			obj: obj,
			elements: elements
		};
	},
	removePadding: function (obj) {
		var cells = draw.table2.getAllCells(obj);
		for (var c = 0; c < cells.length; c++) {
			var cell = cells[c];
			delete cell.padding;
		}
		drawCanvasPaths();
	},
	extractText: function (obj) {
		if (un(obj))
			obj = sel();
		var y = obj.top;
		for (var r = 0; r < obj.cells.length; r++) {
			var x = obj.left;
			for (var c = 0; c < obj.cells[r].length; c++) {
				var cell = obj.cells[r][c];
				if (cell.selected !== true || un(cell.text) || arraysEqual(cell.text, [''])) {
					x += obj.widths[c];
					continue;
				}
				var obj2 = {
					type: "text2"
				};
				copyProperties(cell, obj2, ["type", "highlight", "padding", "tightRect", "selected"]);
				obj2.rect = [x, y, obj.widths[c], obj.heights[r]];
				draw.path.push({
					obj: [obj2],
					selected: true
				});
				cell.text = [''];
				x += obj.widths[c];
			}
			y += obj.heights[r];
		}
		draw.updateAllBorders();
		drawCanvasPaths();
	},
	getStartTags: function (obj) {
		var tags = clone(defaultTags);
		if (!un(obj.tags)) {
			for (var key in obj.tags) {
				tags[key] = clone(obj.tags[key]);
			}
		}
		if (!un(obj.text)) {
			if (!un(obj.text.color))
				tags.color = obj.text.color;
			if (!un(obj.text.font))
				tags.font = obj.text.font;
			if (!un(obj.text.size))
				tags.fontSize = obj.text.size;
		}
		for (var key in tags) {
			if (!un(obj[key]))
				tags[key] = clone(obj[key]);
		}

		if (!un(obj.cells) && !un(obj.cells[0]) && !un(obj.cells[0][0])) {
			var cell = obj.cells[0][0];
			if (!un(cell.align))
				tags.align = clone(cell.align);
			if (!un(cell.bold))
				tags.bold = cell.bold;
			if (!un(cell.italic))
				tags.italic = cell.italic;
			if (!un(cell.font))
				tags.font = cell.font;
			if (!un(cell.fontSize))
				tags.fontSize = cell.fontSize;
			if (!un(cell.textColor))
				tags.color = cell.textColor;

			var str = cell.text[0];
			while (str.length > 2 && str.slice(0, 2) == '<<' && str.slice(0, 3) !== '<<<' && str.indexOf('>>') !== -1) {
				var pos = str.indexOf('>>') + 2;
				var tag = str.slice(0, pos);
				var pos2 = tag.indexOf(':');
				var key = tag.slice(2, pos2);
				var value = tag.slice(pos2 + 1, -2);
				if (key !== 'align') {
					if (value == 'true') {
						value = true;
					} else if (value == 'false') {
						value = false;
					} else if (!isNaN(Number(value))) {
						value = Number(value);
					}
					tags[key] = value;
				}
				str = str.slice(pos);
			}
		}
		return tags;
	},

	copyPasteValues: function () {
		var paths = selPaths();
		var t1 = paths[0].obj[0];
		var t2 = paths[1].obj[0];
		for (var r = 0; r < t1.cells.length; r++) {
			for (var c = 0; c < t1.cells[r].length; c++) {
				t2.cells[r][c].text = clone(t1.cells[r][c].text);
			}
		}
		drawCanvasPaths();
	}
};
draw.skewGrid = {
	add: function (hSquares, vSquares, dotGrid) {
		if (un(hSquares))
			hSquares = 4;
		if (un(vSquares))
			vSquares = 4;
		deselectAllPaths(false);
		changeDrawMode();
		var pos = getRelPos([50, 50]);
		draw.path.unshift({
			obj: [{
					type: 'skewGrid',
					left: pos[0],
					top: pos[1],
					hSquares: hSquares,
					vSquares: vSquares,
					baseVectors: [[40, 0], [10, 30]],
					dots: boolean(dotGrid, false),
					color: draw.color,
					lineWidth: draw.thickness,
				}
			],
			selected: true,
			trigger: []
		});
		for (var p = 0; p < draw.path.length; p++)
			updateBorder(draw.path[p]);
		drawCanvasPaths();
	},
	draw: function (ctx, obj, path, backColor, backColorFill) {
		ctx.strokeStyle = obj.color;
		ctx.lineWidth = obj.lineWidth;
		ctx.beginPath();
		for (var v = 0; v <= obj.vSquares; v++) {
			ctx.moveTo(obj.left + v * obj.baseVectors[1][0], obj.top + v * obj.baseVectors[1][1]);
			ctx.lineTo(obj.left + v * obj.baseVectors[1][0] + obj.hSquares * obj.baseVectors[0][0], obj.top + v * obj.baseVectors[1][1] + obj.hSquares * obj.baseVectors[0][1]);
		}
		for (var h = 0; h <= obj.hSquares; h++) {
			ctx.moveTo(obj.left + h * obj.baseVectors[0][0], obj.top + h * obj.baseVectors[0][1]);
			ctx.lineTo(obj.left + h * obj.baseVectors[0][0] + obj.vSquares * obj.baseVectors[1][0], obj.top + h * obj.baseVectors[0][1] + obj.vSquares * obj.baseVectors[1][1]);
		}
		ctx.stroke();
		if (!un(path) && path.selected == true) {
			ctx.beginPath();

			ctx.moveTo(obj.left + obj.baseVectors[0][0] + 8, obj.top + obj.baseVectors[0][1]);
			ctx.arc(obj.left + obj.baseVectors[0][0], obj.top + obj.baseVectors[0][1], 8, 0, 2 * Math.PI);

			ctx.moveTo(obj.left + obj.baseVectors[1][0] + 8, obj.top + obj.baseVectors[1][1]);
			ctx.arc(obj.left + obj.baseVectors[1][0], obj.top + obj.baseVectors[1][1], 8, 0, 2 * Math.PI);

			ctx.fillStyle = '#F00';
			ctx.strokeStyle = '#000';
			ctx.lineWidth = 1;
			ctx.fill();
			ctx.stroke();
		}
	},
	getRect: function (obj) {
		var x1 = obj.baseVectors[0][0] * obj.hSquares;
		var x2 = obj.baseVectors[1][0] * obj.vSquares;
		var y1 = obj.baseVectors[0][1] * obj.hSquares;
		var y2 = obj.baseVectors[1][1] * obj.vSquares;

		var xMin = Math.min(obj.left, obj.left + x1, obj.left + x2, obj.left + x1 + x2);
		var xMax = Math.max(obj.left, obj.left + x1, obj.left + x2, obj.left + x1 + x2);
		var yMin = Math.min(obj.top, obj.top + y1, obj.top + y2, obj.top + y1 + y2);
		var yMax = Math.max(obj.top, obj.top + y1, obj.top + y2, obj.top + y1 + y2);

		return [xMin, yMin, xMax - xMin, yMax - yMin];
	},
	getSnapPos: function (obj) {
		var snapPos = [];
		var a = clone(obj.baseVectors[0]);
		var b = clone(obj.baseVectors[1]);
		var c = [obj.left, obj.top];
		var d = [obj.left, obj.top];
		for (var i = 0; i <= obj.hSquares; i++) {
			for (var j = 0; j <= obj.vSquares; j++) {
				snapPos.push({
					type: 'point',
					pos: clone(d)
				});
				d = vector.addVectors(d, b);
			}
			c = vector.addVectors(c, a);
			d = clone(c);
		}
		return snapPos;
	},
	setLineWidth: function (obj, lineWidth) {
		obj.lineWidth = lineWidth;
	},
	setLineColor: function (obj, color) {
		obj.color = color;
	},
	getLineWidth: function (obj) {
		return obj.lineWidth;
	},
	getLineColor: function (obj) {
		return obj.color;
	},
	getCursorPositionsSelected: function (obj, pathNum) {
		var a = [obj.left + obj.baseVectors[0][0], obj.top + obj.baseVectors[0][1]];
		var b = [obj.left + obj.baseVectors[1][0], obj.top + obj.baseVectors[1][1]];
		return [{
				shape: 'circle',
				dims: [a[0], a[1], 10],
				cursor: draw.cursors.pointer,
				func: draw.skewGrid.dragBaseVectorStart,
				obj: obj,
				vectorIndex: 0,
				pathNum: pathNum
			}, {
				shape: 'circle',
				dims: [b[0], b[1], 10],
				cursor: draw.cursors.pointer,
				func: draw.skewGrid.dragBaseVectorStart,
				obj: obj,
				vectorIndex: 1,
				pathNum: pathNum
			}
		];
	},
	dragBaseVectorStart: function () {
		changeDrawMode('skewGridDragBaseVector');
		draw.drag = {
			obj: draw.currCursor.obj,
			pathNum: draw.currCursor.pathNum,
			vectorIndex: draw.currCursor.vectorIndex
		};
		updateSnapPoints();
		draw.animate(draw.skewGrid.dragBaseVectorMove,draw.skewGrid.dragBaseVectorEnd,drawCanvasPaths);
		//addListenerMove(window, draw.skewGrid.dragBaseVectorMove);
		//addListenerEnd(window, draw.skewGrid.dragBaseVectorEnd);
	},
	dragBaseVectorMove: function (e) {
		updateMouse(e);
		var obj = draw.drag.obj;
		if (shiftOn == true) {
			if (draw.mouse[0] - obj.left <= draw.mouse - obj.top) {
				obj.baseVectors[draw.drag.vectorIndex] = [0, draw.mouse[1] - obj.top];
			} else {
				obj.baseVectors[draw.drag.vectorIndex] = [draw.mouse[0] - obj.left, 0];
			}
		} else {
			obj.baseVectors[draw.drag.vectorIndex][0] = draw.mouse[0] - obj.left;
			obj.baseVectors[draw.drag.vectorIndex][1] = draw.mouse[1] - obj.top;
		}
		updateBorder(draw.path[draw.drag.pathNum]);
		//drawCanvasPaths();
	},
	dragBaseVectorEnd: function (e) {
		delete draw.drag;
		//removeListenerMove(window, draw.skewGrid.dragBaseVectorMove);
		//removeListenerEnd(window, draw.skewGrid.dragBaseVectorEnd);
		changeDrawMode();
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.left += dl;
		obj.top += dt;
	},
	getButtons: function (x1, y1, x2, y2, pathNum) {
		var buttons = [];
		buttons.push({
			buttonType: 'simpleGrid-yPlus',
			shape: 'rect',
			dims: [x2 - 20, y1 + 20, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.skewGrid.yPlus,
			pathNum: pathNum
		});
		buttons.push({
			buttonType: 'simpleGrid-yMinus',
			shape: 'rect',
			dims: [x2 - 20, y1 + 40, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.skewGrid.yMinus,
			pathNum: pathNum
		});
		buttons.push({
			buttonType: 'simpleGrid-xMinus',
			shape: 'rect',
			dims: [x1 + 20, y2 - 20, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.skewGrid.xMinus,
			pathNum: pathNum
		});
		buttons.push({
			buttonType: 'simpleGrid-xPlus',
			shape: 'rect',
			dims: [x1 + 40, y2 - 20, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.skewGrid.xPlus,
			pathNum: pathNum
		});
		return buttons;
	},
	yPlus: function (path) {
		if (un(path))
			path = draw.path[draw.currCursor.pathNum];
		path.obj[0].vSquares++;
		updateBorder(path);
		drawCanvasPaths();
		drawSelectCanvas();
	},
	yMinus: function (path) {
		if (un(path))
			path = draw.path[draw.currCursor.pathNum];
		path.obj[0].vSquares--;
		updateBorder(path);
		drawCanvasPaths();
		drawSelectCanvas();
	},
	xPlus: function (path) {
		if (un(path))
			path = draw.path[draw.currCursor.pathNum];
		path.obj[0].hSquares++;
		updateBorder(path);
		drawCanvasPaths();
		drawSelectCanvas();
	},
	xMinus: function (path) {
		if (un(path))
			path = draw.path[draw.currCursor.pathNum];
		path.obj[0].hSquares--;
		updateBorder(path);
		drawCanvasPaths();
		drawSelectCanvas();
	},
	drawButton: function (ctx, size) {
		draw.skewGrid.draw(ctx, {
			type: 'skewGrid',
			left: 0.15 * size,
			top: 0.2 * size,
			hSquares: 3,
			vSquares: 3,
			baseVectors: [[0.18 * size, 0], [0.05 * size, 0.18 * size]],
			dots: false,
			color: '#000',
			lineWidth: 0.02 * size,
		});
	},
	scale: function (obj, sf, center) {
		if (!un(center)) {
			obj.left = center[0] + sf * (obj.left - center[0]);
			obj.top = center[1] + sf * (obj.top - center[1]);
		}
		obj.baseVectors[0][0] *= sf;
		obj.baseVectors[0][1] *= sf;
		obj.baseVectors[1][0] *= sf;
		obj.baseVectors[1][1] *= sf;
	}
};
draw.simpleGrid = {
	add: function (hSquares, vSquares, size, dotGrid) {
		if (un(hSquares))
			hSquares = 8;
		if (un(vSquares))
			vSquares = 8;
		if (un(size))
			size = 40;
		deselectAllPaths(false);
		changeDrawMode();
		var pos = getRelPos([50, 50]);
		draw.path.unshift({
			obj: [{
					type: 'simpleGrid',
					left: pos[0],
					top: pos[1],
					width: hSquares * size,
					height: vSquares * size,
					xMin: -0.01,
					xMax: hSquares + 0.01,
					yMin: -0.01,
					yMax: vSquares + 0.01,
					xMajorStep: 1,
					xMinorStep: 1,
					yMajorStep: 1,
					yMinorStep: 1,
					showLabels: false,
					showScales: false,
					dots: boolean(dotGrid, false),
					showGrid: !boolean(dotGrid, false),
					showAxes: false,
					showBorder: false,
					color: draw.color,
					thickness: draw.thickness,
					xZero: 0,
					yZero: vSquares * size,
					hSquares: hSquares,
					vSquares: vSquares,
				}
			],
			selected: true,
			trigger: []
		});
		for (var p = 0; p < draw.path.length; p++)
			updateBorder(draw.path[p]);
		drawCanvasPaths();
	},
	draw: function (ctx, obj, path, backColor, backColorFill) {
		draw.grid.draw(ctx, obj, path, backColor, backColorFill);
	},
	getRect: function (obj) {
		var ctx = draw.hiddenCanvas.ctx;
		ctx.clearRect(0, 0, 10000, 10000);
		obj.labelBorder = drawGrid3(ctx, 0, 0, obj).labelBorder;
		return obj.labelBorder;
	},
	getButtons: function (x1, y1, x2, y2, pathNum) {
		var buttons = [];
		buttons.push({
			buttonType: 'simpleGrid-yPlus',
			shape: 'rect',
			dims: [x2 - 20, y1 + 20, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.simpleGrid.yPlus,
			pathNum: pathNum
		});
		buttons.push({
			buttonType: 'simpleGrid-yMinus',
			shape: 'rect',
			dims: [x2 - 20, y1 + 40, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.simpleGrid.yMinus,
			pathNum: pathNum
		});
		buttons.push({
			buttonType: 'simpleGrid-xMinus',
			shape: 'rect',
			dims: [x1 + 20, y2 - 20, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.simpleGrid.xMinus,
			pathNum: pathNum
		});
		buttons.push({
			buttonType: 'simpleGrid-xPlus',
			shape: 'rect',
			dims: [x1 + 40, y2 - 20, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.simpleGrid.xPlus,
			pathNum: pathNum
		});

		buttons.push({
			buttonType: 'grid-interact',
			shape: 'rect',
			dims: [(x1 + x2) / 2 - 50, y1, 100, 20],
			cursor: draw.cursors.pointer,
			func: draw.grid.toggleInteract,
			pathNum: pathNum,
			draw: function (path, ctx, l, t, w, h) {
				if (!un(path.interact) && path.interact.type == 'grid') {
					ctx.fillStyle = '#F90';
					ctx.fillRect(l, t, w, h);
					text({
						ctx: ctx,
						align: [0, 0],
						rect: [l, t, w, h],
						text: ['<<fontSize:14>>interact: grid']
					});
				} else {
					ctx.strokeStyle = '#F90';
					ctx.lineWidth = 2;
					ctx.strokeRect(l, t, w, h);
					text({
						ctx: ctx,
						align: [0, 0],
						rect: [l, t, w, h],
						text: ['<<fontSize:14>>interact: none']
					});
				}
			}
		});

		var path = draw.path[pathNum];
		if (!un(path) && path.obj.length == 1) {
			var obj = path.obj[0];
			if (draw.mode == 'edit') {
				buttons.push({
					buttonType: 'grid-plot',
					shape: 'rect',
					dims: [x2, y1 + 60, 40, 40],
					cursor: draw.cursors.pointer,
					func: draw.grid.changeInteractMode,
					pathNum: pathNum,
					obj: obj,
					mode: 'plot'
				}, {
					buttonType: 'grid-lineSegment',
					shape: 'rect',
					dims: [x2, y1 + 100, 40, 40],
					cursor: draw.cursors.pointer,
					func: draw.grid.changeInteractMode,
					pathNum: pathNum,
					obj: obj,
					mode: 'lineSegment'
				}, {
					buttonType: 'grid-line',
					shape: 'rect',
					dims: [x2, y1 + 140, 40, 40],
					cursor: draw.cursors.pointer,
					func: draw.grid.changeInteractMode,
					pathNum: pathNum,
					obj: obj,
					mode: 'line'
				}, {
					buttonType: 'grid-undo',
					shape: 'rect',
					dims: [x2, y1 + 180, 40, 40],
					cursor: draw.cursors.pointer,
					func: draw.grid.undo,
					pathNum: pathNum,
					obj: obj
				}, {
					buttonType: 'grid-clear',
					shape: 'rect',
					dims: [x2, y1 + 220, 40, 40],
					cursor: draw.cursors.pointer,
					func: draw.grid.clear,
					pathNum: pathNum,
					obj: obj
				});
			}
		}

		return buttons;
	},
	yPlus: function (path) {
		if (un(path))
			path = draw.path[draw.currCursor.pathNum];
		var obj = path.obj[0];
		var size = obj.height / obj.vSquares;
		obj.vSquares++;
		obj.height += size;
		obj.yMax = obj.vSquares + 0.01;
		updateBorder(path);
		drawCanvasPaths();
		drawSelectCanvas();
	},
	yMinus: function (path) {
		if (un(path))
			path = draw.path[draw.currCursor.pathNum];
		var obj = path.obj[0];
		if (obj.vSquares == 1)
			return;
		var size = obj.height / obj.vSquares;
		obj.vSquares--;
		obj.height -= size;
		obj.yMax = obj.vSquares + 0.01;
		updateBorder(path);
		drawCanvasPaths();
		drawSelectCanvas();
	},
	xPlus: function (path) {
		if (un(path))
			path = draw.path[draw.currCursor.pathNum];
		var obj = path.obj[0];
		var size = obj.width / obj.hSquares;
		obj.hSquares++;
		obj.width += size;
		obj.xMax = obj.hSquares + 0.01;
		updateBorder(path);
		drawCanvasPaths();
		drawSelectCanvas();
	},
	xMinus: function (path) {
		if (un(path))
			path = draw.path[draw.currCursor.pathNum];
		var obj = path.obj[0];
		if (obj.hSquares == 1)
			return;
		var size = obj.width / obj.hSquares;
		obj.hSquares--;
		obj.width -= size;
		obj.xMax = obj.hSquares + 0.01;
		updateBorder(path);
		drawCanvasPaths();
		drawSelectCanvas();
	},
	drawButton: function (ctx, size) {
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 0.02 * size;
		ctx.beginPath();
		for (var i = 0; i < 5; i++) {
			ctx.moveTo(0.2 * size, 0.2 * size + i * 0.15 * size);
			ctx.lineTo(0.8 * size, 0.2 * size + i * 0.15 * size);
			ctx.moveTo(0.2 * size + i * 0.15 * size, 0.2 * size);
			ctx.lineTo(0.2 * size + i * 0.15 * size, 0.8 * size);
		}
		ctx.stroke();
	},
	scale: function (obj, sf, center) {
		if (!un(center)) {
			obj.left = center[0] + sf * (obj.left - center[0]);
			obj.top = center[1] + sf * (obj.top - center[1]);
		}
		obj.width *= sf;
		obj.height *= sf;
	},
	getCursorPositionsSelected: function (obj, pathNum) {
		return draw.grid.getCursorPositionsSelected(obj, pathNum);
	},
	getCursorPositionsInteract: function (obj, path, pathNum) {
		return draw.grid.getCursorPositionsInteract(obj, path, pathNum);
	}
};
draw.dotGrid = {
	add: function () {
		draw.simpleGrid.add(undefined, undefined, undefined, true);
	},
	drawButton: function (ctx, size) {
		ctx.beginPath();
		ctx.fillStyle = '#000';
		for (var i = 0; i < 5; i++) {
			for (var j = 0; j < 5; j++) {
				ctx.beginPath();
				ctx.arc(0.2 * size + i * 0.15 * size, 0.2 * size + j * 0.15 * size, 0.02 * size, 0, 2 * Math.PI);
				ctx.fill();
			}
		}
	},
	scale: function (obj, sf, center) {
		if (!un(center)) {
			obj.left = center[0] + sf * (obj.left - center[0]);
			obj.top = center[1] + sf * (obj.top - center[1]);
		}
		obj.width *= sf;
		obj.height *= sf;
	}
};
draw.numberline = {
	resizable: true,
	add: function () {
		deselectAllPaths();
		var obj = {
			type: 'numberline',
			rect: [100, 100 - draw.drawRelPos[1], 500, 60],
			min: -5,
			max: 5,
			minorStep: 0.5,
			majorStep: 1,
			minorColor: '#000',
			majorColor: '#000',
			lineWidth: 4,
			lineColor: '#000',
			backColor: '#FFF',
			majorWidth: 2,
			minorWidth: 1.2,
			minorYPos: [0.5, 0.65],
			majorYPos: [0.3, 0.7],
			font: 'Arial',
			fontSize: 24,
			arrows: 30
		};
		draw.path.push({
			obj: [obj],
			selected: true
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
	},
	draw: function (ctx, obj) {
		obj.ctx = ctx;
		drawNumberLine2(obj);
		delete obj.ctx;
	},
	getRect: function (obj) {
		var rect = clone(obj.rect);
		if (boolean(obj.vertical) == true) {
			rect[0] -= 10;
			rect[2] += 20;
		} else {
			rect[1] -= 10;
			rect[3] += 20;
		}

		rect = rect.concat([rect[0] + rect[2], rect[1] + rect[3]]);
		return rect;
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.rect[0] += dl;
		obj.rect[1] += dt;
		if (obj.vertical == true) {
			obj.rect[3] += dh;
		} else {
			obj.rect[2] += dw;
		}
	},
	getCursorPositionsUnselected: function (obj, pathNum) {
		return [{
				shape: 'rect',
				dims: obj.rect,
				cursor: draw.cursors.pointer,
				func: drawClickSelect,
				obj: obj,
				pathNum: pathNum,
				highlight: -1
			}
		];
	},
	getSnapPos: function (obj) {
		var snapPos = [];
		var left = obj.rect[0];
		var top = obj.rect[1];
		var width = obj.rect[2];
		var height = obj.rect[3];

		if (boolean(obj.vertical == true)) {
			var x0 = left + 0.5 * width;

			if (typeof obj.arrows == 'number') {
				snapPos.push({
					type: 'point',
					pos: [x0, obj.rect[1]]
				});
				snapPos.push({
					type: 'point',
					pos: [x0, obj.rect[1] + obj.rect[3]]
				});
				top += obj.arrows;
				height -= 2 * obj.arrows;
			}

			var y0 = top - (obj.min * height) / (obj.max - obj.min);

			var minorSpacing = (height * obj.minorStep) / (obj.max - obj.min);
			var yAxisPoint = y0;
			while (Math.round(yAxisPoint) <= Math.round(top + height)) {
				if (Math.round(yAxisPoint) >= Math.round(top)) {
					snapPos.push({
						type: 'point',
						pos: [x0, yAxisPoint]
					});
				}
				yAxisPoint += minorSpacing;
			}
			var yAxisPoint = y0 - minorSpacing;
			while (Math.round(yAxisPoint) >= Math.round(top)) {
				if (Math.round(yAxisPoint) <= Math.round(top + height)) {
					snapPos.push({
						type: 'point',
						pos: [x0, yAxisPoint]
					});
				}
				yAxisPoint -= minorSpacing;
			}

			var majorSpacing = (height * obj.majorStep) / (obj.max - obj.min);
			var yAxisPoint = y0;
			while (Math.round(yAxisPoint) <= Math.round(top + height)) {
				if (Math.round(yAxisPoint) >= Math.round(top)) {
					snapPos.push({
						type: 'point',
						pos: [x0, yAxisPoint]
					});
				}
				yAxisPoint += majorSpacing;
			}
			var yAxisPoint = y0 - majorSpacing;
			while (Math.round(yAxisPoint) >= Math.round(top)) {
				if (Math.round(yAxisPoint) <= Math.round(top + height)) {
					snapPos.push({
						type: 'point',
						pos: [x0, yAxisPoint]
					});
				}
				yAxisPoint -= majorSpacing;
			}
		} else {
			var y0 = top + 0.5 * height;

			if (typeof obj.arrows == 'number') {
				snapPos.push({
					type: 'point',
					pos: [obj.rect[0], y0]
				});
				snapPos.push({
					type: 'point',
					pos: [obj.rect[0] + obj.rect[2], y0]
				});
				left += obj.arrows;
				width -= 2 * obj.arrows;
			}

			var x0 = left - (obj.min * width) / (obj.max - obj.min);

			var minorSpacing = (width * obj.minorStep) / (obj.max - obj.min);
			var xAxisPoint = x0;
			while (Math.round(xAxisPoint) <= Math.round(left + width)) {
				if (Math.round(xAxisPoint) >= Math.round(left)) {
					snapPos.push({
						type: 'point',
						pos: [xAxisPoint, y0]
					});
				}
				xAxisPoint += minorSpacing;
			}
			var xAxisPoint = x0 - minorSpacing;
			while (Math.round(xAxisPoint) >= Math.round(left)) {
				if (Math.round(xAxisPoint) <= Math.round(left + width)) {
					snapPos.push({
						type: 'point',
						pos: [xAxisPoint, y0]
					});
				}
				xAxisPoint -= minorSpacing;
			}

			var majorSpacing = (width * obj.majorStep) / (obj.max - obj.min);
			var xAxisPoint = x0;
			while (Math.round(xAxisPoint) <= Math.round(left + width)) {
				if (Math.round(xAxisPoint) >= Math.round(left)) {
					snapPos.push({
						type: 'point',
						pos: [xAxisPoint, y0]
					});
				}
				xAxisPoint += majorSpacing;
			}
			var xAxisPoint = x0 - majorSpacing;
			while (Math.round(xAxisPoint) >= Math.round(left)) {
				if (Math.round(xAxisPoint) <= Math.round(left + width)) {
					snapPos.push({
						type: 'point',
						pos: [xAxisPoint, y0]
					});
				}
				xAxisPoint -= majorSpacing;
			}
		}

		return snapPos;
	},
	setLineWidth: function (obj, lineWidth) {
		obj.lineWidth = lineWidth;
		obj.majorWidth = lineWidth * (2 / 4);
		obj.minorWidth = lineWidth * (1.2 / 4);
	},
	setLineColor: function (obj, color) {
		obj.lineColor = color;
		obj.majorColor = color;
		obj.minorColor = color;
	},
	getLineWidth: function (obj) {
		return obj.lineWidth;
	},
	getLineColor: function (obj) {
		return obj.lineColor;
	},
	toggleHorizVert: function () {
		if (!un(draw.currCursor) && !un(draw.currCursor.pathNum)) {
			var obj = draw.path[draw.currCursor.pathNum].obj[0];
		} else {
			var obj = sel();
		}
		if (obj == false)
			return;

		if (boolean(obj.vertical) == true) {
			delete obj.vertical;
			obj.rect = [obj.rect[0], obj.rect[1], Math.max(obj.rect[2], obj.rect[3]), Math.min(obj.rect[2], obj.rect[3])];
			obj.minorYPos = [0.5, 0.65];
		} else {
			obj.vertical = true;
			obj.rect = [obj.rect[0], obj.rect[1], Math.min(obj.rect[2], obj.rect[3]), Math.max(obj.rect[2], obj.rect[3])];
			obj.minorYPos = [0.35, 0.65];
		}
		updateBorder(selPath());
		drawCanvasPaths();
	},
	toggleScale: function () {
		if (!un(draw.currCursor) && !un(draw.currCursor.pathNum)) {
			var obj = draw.path[draw.currCursor.pathNum].obj[0];
		} else {
			var obj = sel();
		}
		if (obj == false)
			return;

		if (obj.showScales === false) {
			delete obj.showScales;
		} else {
			obj.showScales = false;
		}
		updateBorder(selPath());
		drawCanvasPaths();
	},
	toggleMinorPos: function () {
		if (!un(draw.currCursor) && !un(draw.currCursor.pathNum)) {
			var obj = draw.path[draw.currCursor.pathNum].obj[0];
		} else {
			var obj = sel();
		}
		if (obj == false)
			return;

		if (obj.showMinorPos === false) {
			delete obj.showMinorPos;
		} else {
			obj.showMinorPos = false;
		}
		updateBorder(selPath());
		drawCanvasPaths();
	},
	toggleArrows: function () {
		if (!un(draw.currCursor) && !un(draw.currCursor.pathNum)) {
			var obj = draw.path[draw.currCursor.pathNum].obj[0];
		} else {
			var obj = sel();
		}
		if (obj == false)
			return;

		if (typeof obj.arrows == 'number') {
			delete obj.arrows;
		} else {
			obj.arrows = 30;
		}
		updateBorder(selPath());
		drawCanvasPaths();
	},
	getButtons: function (x1, y1, x2, y2, pathNum) {
		var buttons = [];
		if (un(draw.path[pathNum])) return [];
		var obj = draw.path[pathNum].obj[0];

		var dims = obj.vertical == true ? [x1, y1 + 60, 20, 20] : [x1 + 60, y1, 20, 20];
		var button = {
			buttonType: 'numberline-toggleHorizVert',
			shape: 'rect',
			dims: dims,
			cursor: draw.cursors.pointer,
			func: draw.numberline.toggleHorizVert,
			pathNum: pathNum
		};
		button.draw = function (path, ctx, l, t, w, h) {
			ctx.fillStyle = colorA('#F96', 0.5);
			ctx.fillRect(l, t, w, h);
			ctx.strokeStyle = colorA('#000', 0.5);
			ctx.strokeRect(l, t, w, h);
			ctx.beginPath();
			if (boolean(path.obj[0].vertical, false) == true) {
				ctx.moveTo(l + 0.5 * w, t + 0.15 * h);
				ctx.lineTo(l + 0.5 * w, t + 0.85 * h);
				for (var i = 0; i < 4; i++) {
					ctx.moveTo(l + 0.4 * w, t + (0.15 + (0.7 / 3) * i) * h);
					ctx.lineTo(l + 0.6 * w, t + (0.15 + (0.7 / 3) * i) * h);
				}
			} else {
				ctx.moveTo(l + 0.15 * w, t + 0.5 * h);
				ctx.lineTo(l + 0.85 * w, t + 0.5 * h);
				for (var i = 0; i < 4; i++) {
					ctx.moveTo(l + (0.15 + (0.7 / 3) * i) * w, t + 0.4 * h);
					ctx.lineTo(l + (0.15 + (0.7 / 3) * i) * w, t + 0.6 * h);
				}
			}
			ctx.stroke();
		}
		buttons.push(button);

		var dims = obj.vertical == true ? [x1, y1 + 80, 20, 20] : [x1 + 80, y1, 20, 20];
		var button = {
			buttonType: 'numberline-toggleScale',
			shape: 'rect',
			dims: dims,
			cursor: draw.cursors.pointer,
			func: draw.numberline.toggleScale,
			pathNum: pathNum
		};
		button.draw = function (path, ctx, l, t, w, h) {
			if (boolean(path.obj[0].showScales, true) == true) {
				ctx.fillStyle = colorA('#F96', 0.5);
				ctx.fillRect(l, t, w, h);
			}
			ctx.strokeStyle = colorA('#000', 0.5);
			ctx.strokeRect(l, t, w, h);
			text({
				ctx: ctx,
				textArray: ['<<fontSize:' + (w / 2) + '>>123'],
				left: l,
				top: t,
				width: w,
				height: h,
				textAlign: 'center',
				vertAlign: 'middle'
			});
		}
		buttons.push(button);

		var dims = obj.vertical == true ? [x1, y1 + 100, 20, 20] : [x1 + 100, y1, 20, 20];
		var button = {
			buttonType: 'numberline-toggleMinorPos',
			shape: 'rect',
			dims: dims,
			cursor: draw.cursors.pointer,
			func: draw.numberline.toggleMinorPos,
			pathNum: pathNum
		};
		button.draw = function (path, ctx, l, t, w, h) {
			if (boolean(path.obj[0].showMinorPos, true) == true) {
				ctx.fillStyle = colorA('#F96', 0.5);
				ctx.fillRect(l, t, w, h);
			}
			ctx.strokeStyle = colorA('#000', 0.5);
			ctx.strokeRect(l, t, w, h);
			text({
				ctx: ctx,
				textArray: ['<<fontSize:' + (w / 2) + '>>min'],
				left: l,
				top: t,
				width: w,
				height: h,
				textAlign: 'center',
				vertAlign: 'middle'
			});
		}
		buttons.push(button);

		var dims = obj.vertical == true ? [x1, y1 + 120, 20, 20] : [x1 + 120, y1, 20, 20];
		var button = {
			buttonType: 'numberline-toggleArrows',
			shape: 'rect',
			dims: dims,
			cursor: draw.cursors.pointer,
			func: draw.numberline.toggleArrows,
			pathNum: pathNum
		};
		button.draw = function (path, ctx, l, t, w, h) {
			if (typeof path.obj[0].arrows == 'number') {
				ctx.fillStyle = colorA('#F96', 0.5);
				ctx.fillRect(l, t, w, h);
			}
			ctx.strokeStyle = colorA('#000', 0.5);
			ctx.strokeRect(l, t, w, h);
			drawArrow({
				ctx: ctx,
				startX: l + 0.2 * w,
				startY: t + 0.5 * h,
				finX: l + 0.8 * w,
				finY: t + 0.5 * h,
				doubleEnded: true,
				color: '#000',
				lineWidth: 1,
				fillArrow: true,
				arrowLength: 5
			});
		}
		buttons.push(button);

		return buttons;
	},
	/*drawButton: function() {
	var l = 0;
	var t = 0;
	var w = draw.buttonSize;
	var h = draw.buttonSize;
	var ctx = this.ctx;

	roundedRect(ctx,3,3,w-6,h-6,8,6,'#000',draw.buttonColor);

	ctx.strokeStyle = draw.color;
	ctx.lineWidth = 2*(w/55);
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';

	ctx.save();
	ctx.beginPath();
	ctx.moveTo(l+0.15*w,t+0.5*h);
	ctx.lineTo(l+0.85*w,t+0.5*h);
	for (var i = 0; i < 4; i++) {
	ctx.moveTo(l+(0.15+(0.7/3)*i)*w,t+0.4*h);
	ctx.lineTo(l+(0.15+(0.7/3)*i)*w,t+0.6*h);
	}
	ctx.stroke();
	ctx.restore();
	},*/
	drawButton: function (ctx, size) {
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 0.03 * size;

		ctx.beginPath();
		ctx.moveTo(0.15 * size, 0.5 * size);
		ctx.lineTo(0.85 * size, 0.5 * size);
		for (var i = 0; i < 4; i++) {
			ctx.moveTo((0.15 + (0.7 / 3) * i) * size, 0.4 * size);
			ctx.lineTo((0.15 + (0.7 / 3) * i) * size, 0.6 * size);
		}
		ctx.stroke();
	},
	scale: function (obj, sf, center) {
		if (!un(center)) {
			obj.rect[0] = center[0] + sf * (obj.rect[0] - center[0]);
			obj.rect[1] = center[1] + sf * (obj.rect[1] - center[1]);
		}
		obj.rect[2] *= sf;
		obj.rect[3] *= sf;
		if (!un(obj.lineWidth))
			obj.lineWidth *= sf;
		if (!un(obj.majorWidth))
			obj.majorWidth *= sf;
		if (!un(obj.minorWidth))
			obj.minorWidth *= sf;
		if (!un(obj.fontSize))
			obj.fontSize *= sf;
		if (!un(obj.arrows))
			obj.arrows *= sf;
	}
};
draw.isoDotGrid = {
	resizable: true,
	add: function () {
		deselectAllPaths(false);
		changeDrawMode();
		var pos = getRelPos([50, 50]);
		draw.path.unshift({
			obj: [{
					type: 'isoDotGrid',
					left: pos[0],
					top: pos[1],
					width: 400,
					height: 400,
					spacingFactor: 15,
					color: draw.color,
					radius: draw.thickness * 2,
				}
			],
			selected: true,
			trigger: []
		});
		for (var p = 0; p < draw.path.length; p++)
			updateBorder(draw.path[p]);
		drawCanvasPaths();
	},
	draw: function (ctx, obj) {
		obj.ctx = ctx;
		obj._snapPos = drawIsometricDotty(obj);
		delete obj.ctx;
	},
	getRect: function (obj) {
		return [obj.left, obj.top, obj.width, obj.height, obj.left + obj.width, obj.top + obj.height];
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.left += dl;
		obj.top += dt;
		obj.width += dw;
		obj.height += dh;
	},
	getCursorPositionsUnselected: function (obj, pathNum) {
		return [{
				shape: 'rect',
				dims: [obj.left, obj.top, obj.width, obj.height],
				cursor: draw.cursors.pointer,
				func: drawClickSelect,
				obj: obj,
				pathNum: pathNum,
				highlight: -1
			}
		];
	},
	getButtons: function (x1, y1, x2, y2, pathNum) {
		var buttons = [];
		if (un(draw.path[pathNum]))
			return [];
		var obj = draw.path[pathNum].obj[0];

		var dims = [x2 - 20, y1 + 20, 20, 20];
		var button = {
			buttonType: 'isoDotGrid-switchDirection',
			shape: 'rect',
			dims: dims,
			cursor: draw.cursors.pointer,
			func: draw.isoDotGrid.switchDirection,
			pathNum: pathNum,
			obj: obj
		};
		button.draw = function (path, ctx, l, t, w, h) {
			ctx.fillStyle = colorA('#F90', 0.5);
			ctx.fillRect(l, t, w, h);

			drawArrow({
				ctx: ctx,
				startX: l + 0.8 * w,
				startY: t + 0.2 * h,
				finX: l + 0.2 * w,
				finY: t + 0.8 * h,
				arrowLength: 4,
				color: '#000',
				lineWidth: 2,
				fillArrow: true,
				doubleEnded: false,
				angleBetweenLinesRads: 0.7
			});

			drawArrow({
				ctx: ctx,
				finX: l + 0.8 * w,
				finY: t + 0.2 * h,
				startX: l + 0.2 * w,
				startY: t + 0.8 * h,
				arrowLength: 4,
				color: '#000',
				lineWidth: 2,
				fillArrow: true,
				doubleEnded: false,
				angleBetweenLinesRads: 0.7
			});

		}
		buttons.push(button);

		var dims = [x2 - 20, y1 + 40, 20, 20];
		var button = {
			buttonType: 'isoDotGrid-spacingFactorPlus',
			shape: 'rect',
			dims: dims,
			cursor: draw.cursors.pointer,
			func: draw.isoDotGrid.spacingFactorPlus,
			pathNum: pathNum,
			obj: obj
		};
		button.draw = function (path, ctx, l, t, w, h) {
			ctx.strokeStyle = '#000';
			ctx.fillStyle = colorA('#F6F', 0.5);
			ctx.fillRect(l, t, w, h);
			ctx.beginPath();
			ctx.moveTo(l + 0.3 * w, t + 0.5 * h);
			ctx.lineTo(l + 0.7 * w, t + 0.5 * h);
			ctx.moveTo(l + 0.5 * w, t + 0.3 * h);
			ctx.lineTo(l + 0.5 * w, t + 0.7 * h);
			ctx.stroke();
		}
		buttons.push(button);

		var dims = [x2 - 20, y1 + 60, 20, 20];
		var button = {
			buttonType: 'isoDotGrid-spacingFactorMinus',
			shape: 'rect',
			dims: dims,
			cursor: draw.cursors.pointer,
			func: draw.isoDotGrid.spacingFactorMinus,
			pathNum: pathNum,
			obj: obj
		};
		button.draw = function (path, ctx, l, t, w, h) {
			ctx.strokeStyle = '#000';
			ctx.fillStyle = colorA('#F6F', 0.5);
			ctx.fillRect(l, t, w, h);
			ctx.beginPath();
			ctx.moveTo(l + 0.3 * w, t + 0.5 * h);
			ctx.lineTo(l + 0.7 * w, t + 0.5 * h);
			ctx.stroke();
		}
		buttons.push(button);

		return buttons;
	},
	switchDirection: function () {
		var obj = draw.currCursor.obj;
		obj.direction = obj.direction == 1 ? 0 : 1;
		drawCanvasPaths();
	},
	spacingFactorPlus: function () {
		var obj = draw.currCursor.obj;
		obj.spacingFactor++;
		drawCanvasPaths();
	},
	spacingFactorMinus: function () {
		var obj = draw.currCursor.obj;
		obj.spacingFactor = Math.max(obj.spacingFactor - 1, 5);
		drawCanvasPaths();
	},
	getSnapPos: function (obj) {
		var snapPos = [];
		for (var p = 0; p < obj._snapPos.length; p++)
			snapPos.push({
				type: 'point',
				pos: obj._snapPos[p]
			});
		return snapPos;
	},
	setLineWidth: function (obj, lineWidth) {
		obj.radius = lineWidth;
	},
	setLineColor: function (obj, color) {
		obj.color = color;
	},
	setFillColor: function (obj, color) {
		obj.color = color;
	},
	setRadius: function (obj, radius) {
		obj.radius = radius;
	},
	getLineWidth: function (obj) {
		return obj.radius;
	},
	getLineColor: function (obj) {
		return obj.color;
	},
	getFillColor: function (obj) {
		return obj.color;
	},
	getRadius: function (obj) {
		return obj.radius;
	},
	drawButton: function (ctx, size) {
		drawIsometricDotty({
			ctx: ctx,
			left: 0.15 * size,
			top: 0.15 * size,
			width: 0.7 * size,
			height: 0.7 * size,
			spacingFactor: 0.04 * size,
			color: '#000',
			radius: 0.02 * size
		});
	},
	scale: function (obj, sf, center) {
		if (!un(center)) {
			obj.left = center[0] + sf * (obj.left - center[0]);
			obj.top = center[1] + sf * (obj.top - center[1]);
		}
		obj.width *= sf;
		obj.height *= sf;
		if (!un(obj.spacingFactor))
			obj.spacingFactor *= sf;
		if (!un(obj.radius))
			obj.radius *= sf;
	}

};
draw.cylinder = {
	resizable: true,
	add: function () {
		deselectAllPaths(false);
		changeDrawMode();
		var pos = getRelPos([200, 100]);
		draw.path.push({
			obj: [{
					type: 'cylinder',
					center: pos,
					radiusX: 100,
					radiusY: 33,
					height: 200,
					color: draw.color,
					thickness: draw.thickness
				}
			],
			selected: true,
			trigger: []
		});
		for (var p = 0; p < draw.path.length; p++)
			updateBorder(draw.path[p]);
		drawCanvasPaths();
	},
	draw: function (ctx, obj, path) {
		if (obj.radiusX <= 0 || obj.radiusY <= 0)
			return;
		ctx.save();
		ctx.strokeStyle = obj.color;
		ctx.lineWidth = obj.thickness;
		if (typeof ctx.setLineDash !== 'function')
			ctx.setLineDash = function () {};

		ctx.setLineDash([5, 5]);
		ctx.beginPath();
		ctx.moveTo(obj.center[0] - obj.radiusX, obj.center[1] + obj.height);
		ctx.ellipse(obj.center[0], obj.center[1] + obj.height, obj.radiusX, obj.radiusY, 0, Math.PI, 2 * Math.PI);
		ctx.stroke();

		var dash = !un(obj.dash) ? obj.dash : [];
		ctx.setLineDash(dash);

		ctx.beginPath();
		ctx.moveTo(obj.center[0] + obj.radiusX, obj.center[1]);
		ctx.ellipse(obj.center[0], obj.center[1], obj.radiusX, obj.radiusY, 0, 0, 2 * Math.PI);

		ctx.moveTo(obj.center[0] + obj.radiusX, obj.center[1]);
		ctx.lineTo(obj.center[0] + obj.radiusX, obj.center[1] + obj.height);

		ctx.moveTo(obj.center[0] - obj.radiusX, obj.center[1]);
		ctx.lineTo(obj.center[0] - obj.radiusX, obj.center[1] + obj.height);

		ctx.moveTo(obj.center[0] + obj.radiusX, obj.center[1] + obj.height);
		ctx.ellipse(obj.center[0], obj.center[1] + obj.height, obj.radiusX, obj.radiusY, 0, 0, Math.PI);
		ctx.stroke();

		ctx.setLineDash([]);

		/*if (!un(path) && path.selected == true) {
		ctx.lineWidth = 1;
		ctx.strokeStyle = '#000';
		ctx.fillStyle = '#F00';
		ctx.beginPath();
		ctx.arc(obj.center[0]+obj.radiusX*Math.cos(obj.angle1),obj.center[1]+obj.radiusY*Math.sin(obj.angle1),8,0,2*Math.PI);
		ctx.fill();
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(obj.center[0]+obj.radiusX*Math.cos(obj.angle2),obj.center[1]+obj.radiusY*Math.sin(obj.angle2),8,0,2*Math.PI);
		ctx.fill();
		ctx.stroke();
		}*/

		ctx.restore();
	},
	getRect: function (obj) {
		return [obj.center[0] - obj.radiusX, obj.center[1] - obj.radiusY, 2 * obj.radiusX, obj.height + 2 * obj.radiusY];
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.center[0] += dl + 0.5 * dw;
		obj.center[1] += dt;
		obj.radiusX += 0.5 * dw;
		var frac = obj.height / (obj.height + 2 * obj.radiusY);
		obj.height += frac * dh;
		obj.radiusY += (1 - frac) * dh;
	},
	drawButton: function (ctx, size) {
		draw.cylinder.draw(ctx, {
			center: [0.5 * size, 0.25 * size],
			radiusX: 0.25 * size,
			radiusY: 0.1 * size,
			height: 0.45 * size,
			color: '#000',
			thickness: size * 0.02
		});
	},
	scale: function (obj, sf, center) {
		if (!un(center)) {
			obj.center[0] = center[0] + sf * (obj.center[0] - center[0]);
			obj.center[1] = center[1] + sf * (obj.center[1] - center[1]);
		}
		if (!un(obj.radiusX))
			obj.radiusX *= sf;
		if (!un(obj.radiusY))
			obj.radiusY *= sf;
		if (!un(obj.height))
			obj.height *= sf;
		if (!un(obj.thickness))
			obj.thickness *= sf;
	}
}
draw.cone = {
	resizable: true,
	add: function () {
		deselectAllPaths(false);
		changeDrawMode();
		draw.path.push({
			obj: [{
					type: 'cone',
					center: getRelPos([200, 100]),
					radiusX: 100,
					radiusY: 33,
					height: 200,
					color: draw.color,
					thickness: draw.thickness
				}
			],
			selected: true,
			trigger: []
		});
		for (var p = 0; p < draw.path.length; p++)
			updateBorder(draw.path[p]);
		drawCanvasPaths();
	},
	draw: function (ctx, obj, path) {
		if (obj.radiusX <= 0 || obj.radiusY <= 0)
			return;
		ctx.save();
		ctx.strokeStyle = obj.color;
		ctx.lineWidth = obj.thickness;
		if (typeof ctx.setLineDash !== 'function')
			ctx.setLineDash = function () {};

		ctx.setLineDash([5, 5]);
		ctx.beginPath();
		ctx.ellipse(obj.center[0], obj.center[1] + obj.height, obj.radiusX, obj.radiusY, 0, Math.PI, 2 * Math.PI);
		ctx.stroke();

		var dash = !un(obj.dash) ? obj.dash : [];
		ctx.setLineDash(dash);

		ctx.beginPath();
		ctx.moveTo(obj.center[0], obj.center[1]);
		ctx.lineTo(obj.center[0] + obj.radiusX, obj.center[1] + obj.height);

		ctx.moveTo(obj.center[0], obj.center[1]);
		ctx.lineTo(obj.center[0] - obj.radiusX, obj.center[1] + obj.height);

		ctx.moveTo(obj.center[0] + obj.radiusX, obj.center[1] + obj.height);
		ctx.ellipse(obj.center[0], obj.center[1] + obj.height, obj.radiusX, obj.radiusY, 0, 0, Math.PI);
		ctx.stroke();

		ctx.setLineDash([]);
		ctx.restore();
	},
	getRect: function (obj) {
		return [obj.center[0] - obj.radiusX, obj.center[1], 2 * obj.radiusX, obj.height + obj.radiusY];
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.center[0] += dl + 0.5 * dw;
		obj.center[1] += dt;
		obj.radiusX += 0.5 * dw;
		var frac = obj.height / (obj.height + obj.radiusY);
		obj.height += frac * dh;
		obj.radiusY += (1 - frac) * dh;
	},
	drawButton: function (ctx, size) {
		draw.cone.draw(ctx, {
			center: [0.5 * size, 0.15 * size],
			radiusX: 0.3 * size,
			radiusY: 0.1 * size,
			height: 0.55 * size,
			color: '#000',
			thickness: size * 0.02
		});
	},
	scale: function (obj, sf, center) {
		if (!un(center)) {
			obj.center[0] = center[0] + sf * (obj.center[0] - center[0]);
			obj.center[1] = center[1] + sf * (obj.center[1] - center[1]);
		}
		if (!un(obj.radiusX))
			obj.radiusX *= sf;
		if (!un(obj.radiusY))
			obj.radiusY *= sf;
		if (!un(obj.height))
			obj.height *= sf;
		if (!un(obj.thickness))
			obj.thickness *= sf;
	}
}
draw.frustum = {
	resizable: true,
	add: function () {
		deselectAllPaths(false);
		changeDrawMode();
		draw.path.push({
			obj: [{
					type: 'frustum',
					center: getRelPos([200, 100]),
					radiusX: 100,
					radiusY: 33,
					radiusX2: 60,
					height: 200,
					color: draw.color,
					thickness: draw.thickness
				}
			],
			selected: true,
			trigger: []
		});
		for (var p = 0; p < draw.path.length; p++)
			updateBorder(draw.path[p]);
		drawCanvasPaths();
	},
	draw: function (ctx, obj, path) {
		if (obj.radiusX <= 0 || obj.radiusY <= 0)
			return;
		ctx.save();
		ctx.strokeStyle = obj.color;
		ctx.lineWidth = obj.thickness;
		if (typeof ctx.setLineDash !== 'function')
			ctx.setLineDash = function () {};

		ctx.setLineDash([5, 5]);
		ctx.beginPath();
		ctx.ellipse(obj.center[0], obj.center[1] + obj.height, obj.radiusX, obj.radiusY, 0, Math.PI, 2 * Math.PI);
		ctx.stroke();

		var dash = !un(obj.dash) ? obj.dash : [];
		ctx.setLineDash(dash);

		var radiusY2 = obj.radiusY * (obj.radiusX2 / obj.radiusX);

		ctx.beginPath();
		ctx.moveTo(obj.center[0] + obj.radiusX2, obj.center[1]);
		ctx.ellipse(obj.center[0], obj.center[1], obj.radiusX2, radiusY2, 0, 0, 2 * Math.PI);

		ctx.moveTo(obj.center[0] + obj.radiusX2, obj.center[1]);
		ctx.lineTo(obj.center[0] + obj.radiusX, obj.center[1] + obj.height);

		ctx.moveTo(obj.center[0] - obj.radiusX2, obj.center[1]);
		ctx.lineTo(obj.center[0] - obj.radiusX, obj.center[1] + obj.height);

		ctx.moveTo(obj.center[0] + obj.radiusX, obj.center[1] + obj.height);
		ctx.ellipse(obj.center[0], obj.center[1] + obj.height, obj.radiusX, obj.radiusY, 0, 0, Math.PI);
		ctx.stroke();

		ctx.setLineDash([]);
		ctx.restore();
	},
	getRect: function (obj) {
		var radiusY2 = obj.radiusY * (obj.radiusX2 / obj.radiusX);
		return [obj.center[0] - obj.radiusX, obj.center[1] - radiusY2, 2 * obj.radiusX, obj.height + obj.radiusY + radiusY2];
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.center[0] += dl + 0.5 * dw;
		obj.center[1] += dt;
		obj.radiusX += 0.5 * dw;
		var radiusY2 = obj.radiusY * (obj.radiusX2 / obj.radiusX);
		var totalHeight = obj.height + obj.radiusY + radiusY2;
		obj.height += (obj.height / totalHeight) * dh;
		obj.radiusY += (obj.radiusY / totalHeight) * dh;
	},
	drawButton: function (ctx, size) {
		draw.frustum.draw(ctx, {
			center: [0.5 * size, 0.3 * size],
			radiusX: 0.3 * size,
			radiusY: 0.1 * size,
			radiusX2: 0.15 * size,
			height: 0.4 * size,
			color: '#000',
			thickness: size * 0.02
		});
	},
	scale: function (obj, sf, center) {
		if (!un(center)) {
			obj.center[0] = center[0] + sf * (obj.center[0] - center[0]);
			obj.center[1] = center[1] + sf * (obj.center[1] - center[1]);
		}
		if (!un(obj.radiusX))
			obj.radiusX *= sf;
		if (!un(obj.radiusX2))
			obj.radiusX2 *= sf;
		if (!un(obj.radiusY))
			obj.radiusY *= sf;
		if (!un(obj.height))
			obj.height *= sf;
		if (!un(obj.thickness))
			obj.thickness *= sf;
	}
}
draw.isoCuboid = {
	resizable: true,
	add: function () {
		deselectAllPaths(false);
		changeDrawMode();
		draw.path.push({
			obj: [{
					type: 'isoCuboid',
					center: getRelPos([300, 300]),
					mag1: 100,
					mag2: 100,
					mag3: 100,
					color: draw.color,
					thickness: draw.thickness
				}
			],
			selected: true,
			trigger: []
		});
		for (var p = 0; p < draw.path.length; p++)
			updateBorder(draw.path[p]);
		drawCanvasPaths();
	},
	draw: function (ctx, obj, path) {
		var pos = draw.isoCuboid.getPoints(obj);

		ctx.save();

		if (!un(obj.fillColor)) {
			ctx.fillStyle = obj.fillColor;
			ctx.beginPath();
			ctx.moveTo(pos[0][0], pos[0][1]);
			ctx.moveTo(pos[1][0], pos[1][1]);
			ctx.lineTo(pos[5][0], pos[5][1]);
			ctx.lineTo(pos[7][0], pos[7][1]);
			ctx.lineTo(pos[6][0], pos[6][1]);
			ctx.lineTo(pos[2][0], pos[2][1]);
			ctx.lineTo(pos[0][0], pos[0][1]);
			ctx.fill();
		}

		ctx.strokeStyle = obj.color;
		ctx.lineWidth = obj.thickness;

		ctx.beginPath();
		ctx.moveTo(pos[0][0], pos[0][1]);
		ctx.lineTo(pos[1][0], pos[1][1]);
		ctx.lineTo(pos[5][0], pos[5][1]);

		ctx.moveTo(pos[0][0], pos[0][1]);
		ctx.lineTo(pos[2][0], pos[2][1]);
		ctx.lineTo(pos[6][0], pos[6][1]);

		ctx.moveTo(pos[0][0], pos[0][1]);
		ctx.lineTo(pos[4][0], pos[4][1]);
		ctx.lineTo(pos[5][0], pos[5][1]);
		ctx.lineTo(pos[7][0], pos[7][1]);
		ctx.lineTo(pos[6][0], pos[6][1]);
		ctx.lineTo(pos[4][0], pos[4][1]);

		ctx.stroke();
	},
	getPoints: function (obj) {
		var baseVector = [[obj.mag1 * (Math.sqrt(3) / 2), -obj.mag1 * (1 / 2)], [-obj.mag2 * (Math.sqrt(3) / 2), -obj.mag2 * (1 / 2)], [0, -obj.mag3]];
		var pos = [obj.center];
		pos.push(pointAddVector(obj.center, baseVector[0]));
		pos.push(pointAddVector(obj.center, baseVector[1]));
		pos.push(pointAddVector(pos[1], baseVector[1]));
		for (var i = 0; i < 4; i++)
			pos.push(pointAddVector(pos[i], baseVector[2]));
		return pos;
	},
	getRect: function (obj) {
		var pos = draw.isoCuboid.getPoints(obj);
		return [pos[2][0], pos[7][1], pos[1][0] - pos[2][0], pos[0][1] - pos[7][1]];
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.center[0] += dl;
		obj.center[1] += dt + dh;
		obj.mag1 += dw / (Math.sqrt(3) / 2);
		obj.mag2 += dw / (Math.sqrt(3) / 2);
		obj.mag3 += dh;
	},
	getSnapPos: function (obj) {
		var pos = draw.isoCuboid.getPoints(obj);
		var pos2 = [];
		for (var p = 0; p < obj.pos.length; p++)
			pos2[p] = {
				type: 'point',
				pos: obj.pos[p]
			};
		return pos2;
	},
	drawButton: function (ctx, size) {
		draw.isoCuboid.draw(ctx, {
			center: [0.5 * size, 0.82 * size],
			mag1: 0.33 * size,
			mag2: 0.33 * size,
			mag3: 0.33 * size,
			color: '#000',
			thickness: size * 0.02
		});
	},
	scale: function (obj, sf, center) {
		if (!un(center)) {
			obj.center[0] = center[0] + sf * (obj.center[0] - center[0]);
			obj.center[1] = center[1] + sf * (obj.center[1] - center[1]);
		}
		if (!un(obj.mag1))
			obj.mag1 *= sf;
		if (!un(obj.mag2))
			obj.mag2 *= sf;
		if (!un(obj.mag3))
			obj.mag3 *= sf;
		if (!un(obj.thickness))
			obj.thickness *= sf;
	}
};
draw.editableText = {
	draw:function(ctx,obj,path) {
		obj.text = simplifyText(obj.text);
		var obj2 = clone(obj);
		obj2.ctx = ctx;
		var measure = text(obj2);
		obj._tightRect = measure.tightRect;
		obj2._tightRect = measure.tightRect;
		delete obj.tightRect;
		delete obj2.tightRect;
		if (obj2.textEdit === true) {
			textEdit.cursorMap = textEdit.mapTextLocs(obj2, measure.textLoc, measure.softBreaks, measure.hardBreaks);
			textEdit.tightRect = measure.tightRect;
			textEdit.textLoc = measure.textLoc;
			textEdit.lineRects = measure.lineRects;
			delete textEdit.allMap;
			textEdit.blinkReset();
			if (!un(textEdit.menu)) textEdit.menu.update();
		}
	}
};
draw.grid = {
	resizable: true,
	add: function () {
		deselectAllPaths();
		var obj = {
			type: 'grid',
			left: 50 - draw.drawRelPos[0],
			top: 150 - draw.drawRelPos[1],
			width: 400,
			height: 400,
			xMin: -10,
			xMax: 10,
			yMin: -10,
			yMax: 10,
			xMajorStep: 5,
			xMinorStep: 1,
			yMajorStep: 5,
			yMinorStep: 1,
			xZero: 250,
			yZero: 350
		};
		draw.path.push({
			obj: [obj],
			selected: true
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
		//console.log(sel());
	},
	draw: function (ctx, obj, path, backColor, backColorFill) {
		var obj2 = clone(obj);
		obj2.showGrid = boolean(obj.showGrid, true);
		obj2.showScales = boolean(obj.showScales, true);
		obj2.showLabels = boolean(obj.showLabels, true);

		obj2.backColor = mainCanvasFillStyle;
		//obj2.backColor = draw.getColorAtPixel(obj.left + obj.width / 2, obj.top + obj.height / 2);

		if (un(obj2.sf)) obj2.sf = 1;
		ctx.strokeStyle = obj.color;
		ctx.lineWidth = obj.thickness;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		/*if (typeof backColor == 'undefined') backColor = mainCanvasFillStyle;
		if (boolean(backColorFill,true) == true) {
		ctx.fillStyle = backColor;
		ctx.fillRect(obj.left*sf,obj.top*sf,obj.width*sf,obj.height*sf);
		}*/

		drawGrid3(ctx, 0, 0, obj2);

		if (typeof obj2.points == 'object') {
			for (var p = 0; p < obj2.points.length; p++) {
				drawCoord(ctx, 0, 0, obj2, obj.points[p][0], obj.points[p][1], getShades(mainCanvasFillStyle, true)[12]);
			}
		}
		if (typeof obj2.lineSegments == 'object') {
			var showPoints = false;
			for (var p = 0; p < obj2.lineSegments.length; p++) {
				if (typeof obj2.lineSegments[p][1] !== 'undefined' && obj2.lineSegments[p][1].length == 2) {
					if (obj2.drawing == 'lineSegment' && p == obj2.lineSegments.length - 1)
						showPoints = true;
					//drawLine(ctx,0,0,obj2,obj2.lineSegments[p][0][0],obj2.lineSegments[p][0][1],obj2.lineSegments[p][1][0],obj2.lineSegments[p][1][1],getShades(mainCanvasFillStyle,true)[12],2,showPoints,true);
					drawLine(ctx, 0, 0, obj2, obj2.lineSegments[p][0][0], obj2.lineSegments[p][0][1], obj2.lineSegments[p][1][0], obj2.lineSegments[p][1][1], '#00F', 2, showPoints, true);
				}
			}
		}
		if (typeof obj2.lines == 'object') {
			var showPoints = false;
			for (var p = 0; p < obj2.lines.length; p++) {
				if (typeof obj2.lines[p][1] !== 'undefined' && obj2.lines[p][1].length == 2) {
					if (obj2.drawing == 'line' && p == obj2.lines.length - 1)
						showPoints = true;
					//drawLine(ctx,0,0,obj2,obj2.lines[p][0][0],obj2.lines[p][0][1],obj2.lines[p][1][0],obj2.lines[p][1][1],getShades(mainCanvasFillStyle,true)[12],2,showPoints,false);
					drawLine(ctx, 0, 0, obj2, obj2.lines[p][0][0], obj2.lines[p][0][1], obj2.lines[p][1][0], obj2.lines[p][1][1], '#00F', 2, showPoints, false);
				}
			}
		}
		if (typeof obj2.funcs == 'object') {
			for (var f = 0; f < obj2.funcs.length; f++) {
				obj2.funcs[f].funcPoints = calcFunc(obj2, obj2.funcs[f].funcString);
				drawFunc(ctx, 0, 0, obj, obj2.funcs[f].funcPoints);
			}
		}

		if (obj2.path instanceof Array) {
			var recalc = false;
			if (un(obj2._gridValuesForPathCalcs) ||
				obj2._gridValuesForPathCalcs.xMin !== obj2.xMin ||
				obj2._gridValuesForPathCalcs.xMax !== obj2.xMax ||
				obj2._gridValuesForPathCalcs.yMin !== obj2.yMin ||
				obj2._gridValuesForPathCalcs.yMax !== obj2.yMax ||
				obj2._gridValuesForPathCalcs.left !== obj2.left ||
				obj2._gridValuesForPathCalcs.top !== obj2.top ||
				obj2._gridValuesForPathCalcs.width !== obj2.width ||
				obj2._gridValuesForPathCalcs.height !== obj2.height
			) {
				obj2._gridValuesForPathCalcs = {xMin:obj2.xMin,xMax:obj2.xMax,yMin:obj2.yMin,yMax:obj2.yMax,left:obj2.left,top:obj2.top,width:obj2.width,height:obj2.height};
				recalc = true;
			}
			for (var p = 0; p < obj2.path.length; p++) {
				var obj3 = obj2.path[p];
				if (boolean(obj3.visible, true) == false) continue;
				if (boolean(obj3.valid, true) == false) continue;
				if (obj3.color === 'none') continue;
				switch (obj3.type) {
				case 'point':
					obj3._canvasPos = getPosOfCoord(obj3.pos, obj2);
					if (obj3._canvasPos[0] < obj2.left || obj3._canvasPos[0] > obj2.left+obj2.width) continue;
					if (obj3._canvasPos[1] < obj2.top || obj3._canvasPos[1] > obj2.top+obj2.height)	continue;
					ctx.save();
					ctx.beginPath();
					var style = obj3.style || 'circle';
					var color = obj3.color || '#00F';
					if (style == 'circle') {
						var radius = !un(obj3.radius) ? obj3.radius : obj3._selected ? 10 : 6;
						ctx.fillStyle = color;
						ctx.arc(obj3._canvasPos[0], obj3._canvasPos[1], radius, 0, 2 * Math.PI);
						ctx.fill();
					} else if (style == 'cross') {
						ctx.strokeStyle = color;
						ctx.lineWidth = !un(obj3.lineWidth) ? obj3.lineWidth : obj3._selected ? 6 : 3;
						var size = 5;
						var x = obj3._canvasPos[0];
						var y = obj3._canvasPos[1];
						ctx.moveTo(x-size,y-size);
						ctx.lineTo(x+size,y+size);
						ctx.moveTo(x-size,y+size);
						ctx.lineTo(x+size,y-size);
						ctx.stroke();
					}
					ctx.restore();
					break;
				case 'label':
					var pos = getPosOfCoord(obj3.pos, obj2);
					obj3.rect = [pos[0] - 200, pos[1] - 200, 400, 400];
					if (un(obj3.align)) obj3.align = [0, 0];
					if (!un(obj3.offset)) {
						obj3.rect[0] += obj3.offset[0];
						obj3.rect[1] += obj3.offset[1];
					}
					draw.text2.draw(ctx, obj3);
					break;
				case 'line':
					if (obj3.pos[0][0] !== obj3.pos[1][0] || obj3.pos[0][1] !== obj3.pos[1][1]) {
						var lineWidth = !un(obj3.lineWidth) ? obj3.lineWidth : obj3._selected ? 6 : 3;
						var color = obj3.strokeStyle || obj3.color || '#00F';
						drawLine(ctx, 0, 0, obj2, obj3.pos[0][0], obj3.pos[0][1], obj3.pos[1][0], obj3.pos[1][1], color, lineWidth, false, false, true);
					}
					/*if (obj2._interactMode == 'line' && ((draw.mode == 'edit' && path.selected === true) || (draw.mode == 'interact' && draw.mouse[0] >= obj2.left && draw.mouse[0] <= obj2.left+obj2.width && draw.mouse[1] >= obj2.top && draw.mouse[1] <= obj2.top+obj2.height))) {
					var pos1 = getPosOfCoord(obj3.pos[0],obj2);
					var pos2 = getPosOfCoord(obj3.pos[1],obj2);
					ctx.save();
					ctx.beginPath();
					ctx.fillStyle = invertColor(obj3.strokeStyle);
					ctx.strokeStyle = '#000';
					ctx.lineWidth = 1;
					ctx.arc(pos1[0],pos1[1],5,0,2*Math.PI);
					ctx.fill();
					ctx.stroke();
					ctx.beginPath();
					ctx.arc(pos2[0],pos2[1],5,0,2*Math.PI);
					ctx.fill();
					ctx.stroke();
					ctx.restore();
					}*/
					break;
				case 'lineSegment':
					if (obj3.pos[0][0] !== obj3.pos[1][0] || obj3.pos[0][1] !== obj3.pos[1][1]) {
						var lineWidth = !un(obj3.lineWidth) ? obj3.lineWidth : obj3._selected ? 6 : 3;
						var color = obj3.strokeStyle || obj3.color || '#00F';
						drawLine(ctx, 0, 0, obj2, obj3.pos[0][0], obj3.pos[0][1], obj3.pos[1][0], obj3.pos[1][1], color, lineWidth, false, true, true);
					}
					/*if (obj2._interactMode == 'lineSegment' && ((draw.mode == 'edit' && path.selected === true) || (draw.mode == 'interact' && draw.mouse[0] >= obj2.left && draw.mouse[0] <= obj2.left+obj2.width && draw.mouse[1] >= obj2.top && draw.mouse[1] <= obj2.top+obj2.height))) {
					var pos1 = getPosOfCoord(obj3.pos[0],obj2);
					var pos2 = getPosOfCoord(obj3.pos[1],obj2);
					ctx.save();
					ctx.beginPath();
					ctx.fillStyle = invertColor(obj3.strokeStyle);
					ctx.strokeStyle = '#000';
					ctx.lineWidth = 1;
					ctx.arc(pos1[0],pos1[1],5,0,2*Math.PI);
					ctx.fill();
					ctx.stroke();
					ctx.beginPath();
					ctx.arc(pos2[0],pos2[1],5,0,2*Math.PI);
					ctx.fill();
					ctx.stroke();
					ctx.restore();
					}*/
					/*if (obj.pos[0].length == 0) {
					if (obj.pos[1].length == 0) {
					continue;
					} else {
					drawCoord(gridctx,0,0,gridDetails,obj.pos[1][0],obj.pos[1][1],obj.color);
					}
					} else if (obj.pos[1].length == 0) {
					drawCoord(gridctx,0,0,gridDetails,obj.pos[0][0],obj.pos[0][1],obj.color);
					}
					if (obj.pos[0][0] == obj.pos[1][0] && obj.pos[0][1] == obj.pos[1][1]) {
					drawCoord(gridctx,0,0,gridDetails,obj.pos[0][0],obj.pos[0][1],obj.color);
					} else {
					if (typeof obj.dashSize == 'undefined') obj.dashSize = [0,0];
					if (obj.type == 'line') {
					obj.endPos = drawLine(gridctx,0,0,gridDetails,obj.pos[0][0],obj.pos[0][1],obj.pos[1][0],obj.pos[1][1],obj.color,3,false,false,true,obj.dashSize[0],obj.dashSize[1]);
					} else if (obj.type == 'lineSegment') {
					drawLine(gridctx,0,0,gridDetails,obj.pos[0][0],obj.pos[0][1],obj.pos[1][0],obj.pos[1][1],obj.color,3,false,true,true,obj.dashSize[0],obj.dashSize[1]);
					}
					}*/
					break;
				case 'polygon':
					obj3.ctx = ctx;
					drawPolygon(obj3);
					delete obj3.ctx;
					break;
				case 'function':
					if (recalc === true || un(obj3._funcPos)) {
						if (!un(obj3.func)) {
							obj3._funcPos = calcFunc2(obj2, obj3.func, 1, obj3.min, obj3.max);
						} else if (obj2.angleMode == 'rad') {
							obj3._funcPos = calcFunc2(obj2, obj3.funcRad);
						} else {
							obj3._funcPos = calcFunc2(obj2, obj3.funcDeg);
						}
					}
					var lineWidth = !un(obj3.lineWidth) ? obj3.lineWidth : obj3._selected ? 6 : 3;
					obj3.pos = drawFunc(ctx, 0, 0, obj2, obj3._funcPos, obj3.color, lineWidth);
					break;
				case 'function2':
					if (recalc === true || un(obj3._gridPos)) obj3._gridPos = calcFuncImplicitGridPos(obj2, obj3.func);
					if (recalc === true || un(obj3._canvasPos)) obj3._canvasPos = calcFuncImplicitCanvasPos(obj2, obj3._gridPos);
					var lineWidth = !un(obj3.lineWidth) ? obj3.lineWidth : obj3._selected ? 6 : 3;
					drawFuncImplicit(ctx, obj3._canvasPos, obj3.color, lineWidth);
					break;
				case 'path':
					var funcPoints = [];
					for (var i = 0; i < obj3.pos.length; i++) {
						var pos = obj3.pos[i];
						var x = pos[0];
						var y = pos[1];

						var xPos = obj2.left + obj2.width * ((x - obj2.xMin) / (obj2.xMax - obj2.xMin));
						var yPos = (obj2.top + obj2.height) - obj2.height * ((y - obj2.yMin) / (obj2.yMax - obj2.yMin));
						var thisPoint = [xPos, yPos, x, y]// AND: inDomain?, plotHighLowOk?

						if (x >= obj2.xMin && x <= obj2.xMax) {
							thisPoint.push(true);
						} else {
							thisPoint.push(false);
						}

						if (yPos < obj2.top) {
							thisPoint.push('high');
						} else {
							if (yPos > (obj2.top + obj2.height)) {
								thisPoint.push('low');
							} else {
								thisPoint.push('ok');
							}
						}
						funcPoints.push(thisPoint);
					}
					var color = obj3.color || '#00F';
					var lineWidth = obj3.lineWidth || 2;
					obj3.pos = drawFunc(ctx, 0, 0, obj2, funcPoints, color, lineWidth);
					break;
				case 'rect':
					obj3.points = [
						getPosOfCoord([obj3.rect[0], obj3.rect[1]], obj2),
						getPosOfCoord([obj3.rect[0] + obj3.rect[2], obj3.rect[1]], obj2),
						getPosOfCoord([obj3.rect[0] + obj3.rect[2], obj3.rect[1] + obj3.rect[3]], obj2),
						getPosOfCoord([obj3.rect[0], obj3.rect[1] + obj3.rect[3]], obj2)
					];
					obj3.ctx = ctx;
					drawPolygon(obj3);
					delete obj3.points;
					delete obj3.ctx;
					break;
				}
			}
		}
		/*var interact = path.isInput || path.interact || obj.interact;
		var mode = draw.mode;
		if (!un(interact) && interact._mode === 'addAnswers') mode = 'interact';
		if (mode == 'interact' && !un(interact) && interact.type == 'grid') {
			for (var b = 0; b < buttons.length; b++) {
				draw.grid.drawInteractButton(ctx, obj2, buttons[b], x, y + size * b, size, size);
			}
		}*/
	},
	drawOverlay: function (ctx, obj, path) {
		obj._cursorPos = [];
		var controlsStyle = 'none';
		var buttons = draw.grid.interactDefaultButtons;
		if (draw.mode == 'edit' && path.selected === true) {
			controlsStyle = 'full';
		} else {
			var interact = path.isInput || path.interact || obj.interact;
			if (!un(interact) && !un(interact.controlsStyle)) {
				controlsStyle = interact.controlsStyle;
				var buttons = interact.buttons || draw.grid.interactDefaultButtons;
			} else if (!un(interact) && interact.type == 'grid') {
				controlsStyle = interact.controlsStyle || 'buttons';
				var buttons = interact.buttons || draw.grid.interactDefaultButtons;
			}
		}
		var pathNum = draw.path.indexOf(path);
		if (controlsStyle === 'buttons') {
			//var x = obj.left + obj.width + 40;
			//var y = obj.top;
			var x = obj.left;
			var y = obj.top+obj.height+60;
			var size = 40;
			for (var b = 0; b < buttons.length; b++) {
				draw.grid.drawInteractButton(ctx, obj, buttons[b], x, y + size * b, size, size);
				obj._cursorPos.push({
					buttonType: 'grid-' + buttons[b],
					shape: 'rect',
					dims: [x, y + size * b, size, size],
					cursor: draw.cursors.pointer,
					func: draw.grid.interactButtonClick,
					pathNum: pathNum,
					obj: obj,
					mode: buttons[b]
				});
				if (buttons[b] === 'zoomIn') {
					obj._cursorPos.last().factor = 2/3;
				} else if (buttons[b] === 'zoomOut') {
					obj._cursorPos.last().factor = 3/2;
				}
			}
		} else if (controlsStyle === 'full') {
			var paths = obj.path || [];
			var colorPicker = false;
			//var x = obj.left + obj.width + 40;
			//var y = obj.top;
			var x = obj.left;
			var y = obj.top+obj.height+60;
			var h = 50;
			var fontSize = 24;
			
			var x2 = x;
			var buttons = ['move', 'zoomOut', 'zoomIn', 'plot', 'lineSegment', 'line', 'function'];
			for (var b = 0; b < buttons.length; b++) {
				draw.grid.drawInteractButton(ctx, obj, buttons[b], x2+h*b, y, h, h);
				obj._cursorPos.push({
					buttonType: 'grid-' + buttons[b],
					shape: 'rect',
					dims: [x2+h*b, y, h, h],
					cursor: draw.cursors.pointer,
					func: draw.grid.interactButtonClick,
					pathNum: pathNum,
					obj: obj,
					mode: buttons[b]
				});
				if (buttons[b] === 'zoomIn') {
					obj._cursorPos.last().factor = 2/3;
				} else if (buttons[b] === 'zoomOut') {
					obj._cursorPos.last().factor = 3/2;
				}
			}
			y += h;
			h = 45;
			
			/*
			// x & y controls	
			var properties = ['xMin','xMax','xMinorStep','xMajorStep','yMin','yMax','yMinorStep','yMajorStep'];
			if (un(obj._textObjs)) {
				obj._textObjs = {};
				for (var t = 0; t < properties.length; t++) {
					obj._textObjs[properties[t]] = {
						type:'editableText',
						align: [0, 0],
						fontSize: fontSize,
						text: [''],
						onInputEnd:draw.grid.propertyChangeInputEnd,
						deselectOnInputStart:false,
						deselectOnInputEnd:false,
						grid:obj,
						property:properties[t]
					}
				}
			}
						
			ctx.fillStyle = colorA('#9FF', 0.5);
			ctx.strokeStyle = '#000';
			ctx.lineWidth = 1;
			ctx.fillRect(x2,y,350,h);
			ctx.strokeRect(x2,y,350,h);
			ctx.beginPath();
			ctx.moveTo(x2+200,y);
			ctx.lineTo(x2+200,y+h);
			ctx.stroke();
			
			obj._textObjs.xMin.rect = [x2,y,70,h];
			text({ctx:ctx,rect:[x2+50,y,100,h],align:[0,0],font:'algebra',fontSize:fontSize,text:[lessThanEq+' x '+lessThanEq]});
			obj._textObjs.xMax.rect = [x2+130,y,70,h];
			text({ctx:ctx,rect:[x2+200,y,75,h],align:[0,0],italic:true,fontSize:fontSize,text:['steps:']});
			obj._textObjs.xMajorStep.rect = [x2+270,y,40,h];
			text({ctx:ctx,rect:[x2+270,y,80,h],align:[0,0],italic:true,fontSize:fontSize,text:[',']});
			obj._textObjs.xMinorStep.rect = [x2+310,y,40,h];

			y += h;

			ctx.fillStyle = colorA('#9FF', 0.5);
			ctx.strokeStyle = '#000';
			ctx.lineWidth = 1;
			ctx.fillRect(x2,y,350,h);
			ctx.strokeRect(x2,y,350,h);
			ctx.beginPath();
			ctx.moveTo(x2+200,y);
			ctx.lineTo(x2+200,y+h);
			ctx.stroke();
			
			obj._textObjs.yMin.rect = [x2,y,70,h];
			text({ctx:ctx,rect:[x2+50,y,100,h],align:[0,0],font:'algebra',fontSize:fontSize,text:[lessThanEq+' y '+lessThanEq]});
			obj._textObjs.yMax.rect = [x2+130,y,70,h];
			text({ctx:ctx,rect:[x2+200,y,75,h],align:[0,0],italic:true,fontSize:fontSize,text:['steps:']});
			obj._textObjs.yMajorStep.rect = [x2+270,y,40,h];
			text({ctx:ctx,rect:[x2+270,y,80,h],align:[0,0],italic:true,fontSize:fontSize,text:[',']});
			obj._textObjs.yMinorStep.rect = [x2+310,y,40,h];
			
			for (var t = 0; t < properties.length; t++) {
				if (obj._textObjs[properties[t]].textEdit !== true) {
					obj._textObjs[properties[t]].text = obj[properties[t]] === 0 ? ['0'] : [String(roundSF(obj[properties[t]],2))];
				}
				obj._textObjs[properties[t]].ctx = ctx;
				draw.editableText.draw(ctx,obj._textObjs[properties[t]]);
				obj._cursorPos.push({
					shape: 'rect',
					dims: clone(obj._textObjs[properties[t]].rect),
					cursor: draw.cursors.text,
					func: textEdit.selectStart,
					obj: obj._textObjs[properties[t]],
					pathNum:pathNum,
					highlight: -1				
				});
			}
			
			y += h;
			*/
			
			for (var p = 0; p < paths.length; p++) {
				var path = paths[p];
				var color = path.color || '#00F';
				var lineWidth = path.lineWidth || path.radius || 2;
				var backColor = path.valid === false ? '#FCC' : path._selected === true ? '#F96' : '#FFC';
				switch (path.type) {
					case 'function':
						if (un(path.text)) {
							var value = path.func.toString();
							value = value.slice(value.indexOf('return ') + 7);
							value = value.slice(0, value.indexOf(';'));
							path.text = [value];
						}
						break;
					case 'function2':
						if (un(path.text)) {
							var value = path.func.toString();
							value = value.slice(value.indexOf('return ') + 7);
							value = value.slice(0, value.indexOf(';'));
							path.text = [value];
						}
						break;
					case 'point':
						path.text = ['(' + path.pos[0] + ', ' + path.pos[1] + ')'];
						break;
					case 'line':
						path.text = ['(' + path.pos[0][0] + ', ' + path.pos[0][1] + ')  to  (' + path.pos[1][0] + ', ' + path.pos[1][1] + ')'];
						break;
					case 'lineSegment':
						path.text = ['(' + path.pos[0][0] + ', ' + path.pos[0][1] + ')  to  (' + path.pos[1][0] + ', ' + path.pos[1][1] + ')'];
						break;
				}
				var x2 = x;

				var color2 = color === 'none' ? '#000' : color;
				var type = path.type === 'point' && path.style === 'circle' ? 'pointCircle' : path.type;
				draw.grid.drawInteractButton(ctx, obj, type, x2, y, h, h, color2, backColor);

				obj._cursorPos.push({
					buttonType: '',
					shape: 'rect',
					dims: [x2, y, h, h],
					cursor: draw.cursors.pointer,
					func: draw.grid.gridPaths.changeColor,
					obj: obj,
					gridPath: path
				});
				if (path._colorPicker === true && colorPicker === false) {
					colorPicker = {
						index:p,
						top:y+h,
						center:x2+h/2,
						type:path.type,
						color:color2
					};
				}
				delete path._colorPicker;

				x2 += h;

				ctx.fillStyle = backColor;
				ctx.strokeStyle = '#000';
				ctx.lineWidth = 1;
				ctx.fillRect(x2,y,305,h);
				ctx.strokeRect(x2,y,305,h);
				
				if (un(path._textObj)) {
					path._textObj = {
						type:'editableText',
						align: [-1, 0],
						font: 'algebra',
						algPadding:3,
						fontSize: fontSize,
						text: path.text,
						box: {
							type: 'none',
						},
						onInputEnd:draw.grid.gridPaths.functionTextInputEnd,
						deselectOnInputStart:false,
						deselectOnInputEnd:false,
						grid:obj,
						gridPathIndex:p
					};
				}
				path._textObj.rect = [x2+10,y,265,h];
				path._textObj.ctx = ctx;
				if (path.type === 'function' || path.type === 'function2') {
					draw.editableText.draw(ctx,path._textObj);
					obj._cursorPos.push({
						shape: 'rect',
						dims: clone(path._textObj.rect),
						cursor: draw.cursors.text,
						func: textEdit.selectStart,
						obj: path._textObj,
						pathNum:pathNum,
						highlight: -1						
					});
				} else {
					text(path._textObj);
					obj._cursorPos.push({
						buttonType: '',
						shape: 'rect',
						dims: clone(path._textObj.rect),
						//cursor: draw.cursors.pointer,
						//func: draw.grid.gridPaths.toggleSelected,
						cursor:'default',
						func:function() {},
						obj: obj,
						gridPath: path
					});
				}

				x2 += 275;
				drawCross(ctx, 20, 20, '#F00', x2 + 5, y + (h-20)/2, 2);

				obj._cursorPos.push({
					buttonType: '',
					shape: 'rect',
					dims: [x2, y, 30, h],
					cursor: draw.cursors.pointer,
					func: draw.grid.gridPaths.deletePath,
					obj: obj,
					gridPathIndex: p
				});

				y += h;
			}
			if (colorPicker !== false) {
				var colors = ['none','#000','#666','#00F','#F00','#393','#909','#F90','#A0522D'];
				var width = 35;
				var cols = 3;
				var margin = 0;
				var left = colorPicker.center-cols*width/2;
				var top = colorPicker.top;
				for (var c = 0; c < colors.length; c++) {
					var col = c%cols;
					var row = Math.floor(c/cols);
					var x = left+col*width;
					var y = top+row*width;
					var color = colors[c];
					var color2 = color === 'none' ? '#FFF' : color;
					text({
						ctx:ctx,
						rect:[x,y,width,width],
						text:[""],
						box:{
							type:'loose',
							color:color2,
							borderWidth:1,
							borderColor:'#000'
						}
					});
					if (color === 'none') {
						ctx.beginPath();
						ctx.lineWidth = 2;
						ctx.strokeStyle = '#000';
						ctx.moveTo(x,y);
						ctx.lineTo(x+width,y+width);
						ctx.moveTo(x+width,y);
						ctx.lineTo(x,y+width);
						ctx.stroke();
					}
					obj._cursorPos.push({
						buttonType: '',
						shape: 'rect',
						dims: [x,y,width,width],
						cursor: draw.cursors.pointer,
						func: draw.grid.gridPaths.setColor,
						obj: obj,
						gridPathIndex: colorPicker.index,
						color:color
					});
				}
				if (colorPicker.type === 'point') {
					y += width;
					var x = colorPicker.center-width;
					
					draw.grid.drawInteractButton(ctx, obj, 'point', x, y, width, width, colorPicker.color, '#FFC');
					obj._cursorPos.push({
						buttonType: '',
						shape: 'rect',
						dims: [x,y,width,width],
						cursor: draw.cursors.pointer,
						func: draw.grid.gridPaths.setPointStyle,
						obj: obj,
						gridPathIndex: colorPicker.index,
						style:'cross'
					});
					
					x += width;
					
					draw.grid.drawInteractButton(ctx, obj, 'pointCircle', x, y, width, width, colorPicker.color, '#FFC');
					obj._cursorPos.push({
						buttonType: '',
						shape: 'rect',
						dims: [x,y,width,width],
						cursor: draw.cursors.pointer,
						func: draw.grid.gridPaths.setPointStyle,
						obj: obj,
						gridPathIndex: colorPicker.index,
						style:'circle'
					});
				}
			}
		}
	},
	propertyChangeInputEnd: function(obj) {
		var value = parseFloat(obj.text[0]);
		if (isNaN(value)) return;
		var grid = obj.grid;
		var property = obj.property;
		if (property === 'xMin' && value >= grid.xMax) return;
		if (property === 'xMax' && value <= grid.xMin) return;
		if (property === 'yMin' && value >= grid.yMax) return;
		if (property === 'yMax' && value <= grid.yMin) return;
		grid[property] = value;
		drawCanvasPaths();
	},
	getRect: function (obj) {
		/*var ctx = draw.hiddenCanvas.ctx;
		ctx.clearRect(0, 0, 10000, 10000);
		var showGrid = boolean(obj.showGrid, true);
		var showScales = boolean(obj.showScales, true);
		var showLabels = boolean(obj.showLabels, true);
		return drawGrid3(ctx, 0, 0, obj, 24, '#000', '#000', '#000', '#000', '#000', '#000', mainCanvasFillStyle, showGrid, showScales, showLabels).labelBorder;*/
		return [obj.left-30,obj.top-30,obj.width+60,obj.height+60];
	},
	gridPaths: {
		functionTextInputEnd: function(textObj) {
			var grid = textObj.grid;
			var path = grid._path;
			delete path._interacting;
			var index = textObj.gridPathIndex;
			var gridPath = grid.path[index];
			var js = draw.grid.gridPaths.convertTextToJS(clone(textObj.text));
			var stringCopy = js;
			var exceptions = ['Math.pow', 'Math.sqrt', 'Math.PI', 'Math.sin', 'Math.cos', 'Math.tan', 'Math.asin', 'Math.acos', 'Math.atan', 'Math.e', 'Math.log', 'Math.abs'];
			for (var i = 0; i < exceptions.length; i++) {
				stringCopy = replaceAll(stringCopy, exceptions[i], '');
			}
			if (/[a-wzA-WZ]/g.test(stringCopy) == true || (stringCopy.match(/=/g) || []).length !== 1 || stringCopy.charAt(0) == "=" || stringCopy.charAt(stringCopy.length - 1) == "=") {
				gridPath.type = 'function';
				gridPath.valid = false;
				return;
			}
			if (js.indexOf("y=") == 0) {
				try {
					var func = new Function('return ' + 'function(x) {return ' + js.slice(2) + ';}')()
				} catch (err) {
					gridPath.type = 'function';
					gridPath.valid = false;
					return;
				}
				gridPath.type = 'function';
				gridPath.text = clone(textObj.text);
				gridPath.func = func;
				gridPath.time = Date.parse(new Date());
				delete gridPath.valid;
			} else {
				var splitFunc = js.split("=");
				if (splitFunc.length !== 2) return;
				try {
					var func = new Function('return ' + 'function(x,y) {return (' + splitFunc[0] + ')-(' + splitFunc[1] + ');}')()
				} catch (err) {
					gridPath.type = 'function2';
					gridPath.valid = false;
					return;
				}
				gridPath.type = 'function2';
				gridPath.text = clone(textObj.text);
				gridPath.func = func;
				gridPath.time = Date.parse(new Date());
				delete gridPath.valid;
			}
		},
		convertTextToJS: function(textArray) {
			var depth = 0;
			var jsArray = [''];
			var js = '';
			var algArray = [''];
			var alg = '';
			var exceptions = ['Math.pow', 'Math.sqrt', 'Math.PI', 'Math.sin', 'Math.cos', 'Math.tan', 'Math.asin', 'Math.acos', 'Math.atan', 'Math.e', 'Math.log', 'Math.abs', 'sin', 'cos', 'tan'];
			var position = [0];
			var angleMode = 'deg';
			for (var p = 0; p < textArray.length; p++) {
				subJS(textArray[p], true);
				position[depth]++;
			}
			js = jsArray[0];
			alg = algArray[0];

			function removeAllTagsFromString(str) {
				for (var char = str.length - 1; char > -1; char--) {
					if (str.slice(char).indexOf('>>') == 0 && str.slice(char - 1).indexOf('>>>') !== 0) {
						for (var char2 = char - 2; char2 > -1; char2--) {
							if (str.slice(char2).indexOf('<<') == 0) {
								str = str.slice(0, char2) + str.slice(char + 2);
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
				if (typeof elem == 'string') {
					var subText = replaceAll(elem, ' ', '');
					subText = removeAllTagsFromString(subText);
					subText = subText.replace(/\u00D7/g, '*');
					subText = subText.replace(/\u00F7/g, '/');
					subText = subText.replace(/\u2264/g, '<=');
					subText = subText.replace(/\u2265/g, '>=');
					for (var c = 0; c < subText.length - 2; c++) {
						if (subText.slice(c).indexOf('sin') == 0 || subText.slice(c).indexOf('cos') == 0 || subText.slice(c).indexOf('tan') == 0) {
							if (subText.slice(c).indexOf('(') == 3) {
								if (angleMode == 'rad') {
									subText = subText.slice(0, c) + 'Math.' + subText.slice(c);
									c += 5;
								} else {
									subText = subText.slice(0, c) + 'Math.' + subText.slice(c, c + 4) + '(Math.PI/180)*' + subText.slice(c + 4);
									c += 19;
								}
							}
						}
					}
					subText = timesBeforeLetters(subText);
					if (addMultIfNecc == true && jsArray[depth] !== '' && elem !== '' && /[ \+\-\=\u00D7\u00F7\u2264\u2265\\<\>\])]/.test(elem.charAt(0)) == false) {
						subText = '*' + subText;
					}
					jsArray[depth] += subText;
					algArray[depth] += subText;
					return;
				} else if (elem[0] == 'frac') {
					var subText = '';
					var subText2 = '';
					if (jsArray[depth] !== '' && /[\+\-\u00D7\u00F7\*\/\=\[(]/.test(jsArray[depth].slice(-1)) == false) subText += "*";
					depth++;
					position.push(0);
					jsArray[depth] = '';
					subJS(elem[1], false);
					jsArray[depth] = replaceAll(jsArray[depth], ' ', '');
					subText += '((' + jsArray[depth] + ')/';
					subText2 += 'frac(' + jsArray[depth] + ',';
					jsArray[depth] = '';
					subJS(elem[2], false);
					jsArray[depth] = replaceAll(jsArray[depth], ' ', '');
					subText += '(' + jsArray[depth] + '))';
					subText2 += jsArray[depth] + ')';
					jsArray[depth] = '';
					depth--;
					position.pop();
					jsArray[depth] += subText;
					algArray[depth] += subText2;
					return;
				} else if (elem[0] == 'sqrt') {
					var subText = '';
					var subText2 = '';
					if (jsArray[depth] !== '' && /[\+\-\u00D7\u00F7\*\/\=\[(]/.test(jsArray[depth].slice(-1)) == false) subText += "*";
					depth++;
					position.push(0);
					jsArray[depth] = '';
					subJS(elem[1], false);
					jsArray[depth] = replaceAll(jsArray[depth], ' ', '');
					subText += 'Math.sqrt(' + jsArray[depth] + ')';
					subText2 += 'sqrt(' + jsArray[depth] + ')';
					jsArray[depth] = '';
					depth--;
					position.pop();
					jsArray[depth] += subText;
					algArray[depth] += subText2;
					return;
				} else if (elem[0] == 'root') {
					var subText = '';
					var subText2 = '';
					if (jsArray[depth] !== '' && /[\+\-\u00D7\u00F7\*\/\=\[(]/.test(jsArray[depth].slice(-1)) == false) subText += "*";
					depth++;
					position.push(0);
					jsArray[depth] = '';
					subJS(elem[2], false);
					jsArray[depth] = replaceAll(jsArray[depth], ' ', '');
					subText += '(Math.pow(' + jsArray[depth] + ',';
					subText2 += 'root(' + jsArray[depth] + ',';
					jsArray[depth] = '';
					subJS(elem[1], false);
					jsArray[depth] = replaceAll(jsArray[depth], ' ', '');
					subText += '(1/(' + jsArray[depth] + '))))';
					subText2 += jsArray[depth] + ')';
					jsArray[depth] = '';
					depth--;
					position.pop();
					jsArray[depth] += subText;
					algArray[depth] += subText2;
					return;
				} else if (elem[0] == 'sin' || elem[0] == 'cos' || elem[0] == 'tan') {
					var subText = '';
					if (jsArray[depth] !== '' && /[\+\-\u00D7\u00F7\*\/\=\[(]/.test(jsArray[depth].slice(-1)) == false) subText += "*";
					depth++;
					position.push(0);
					jsArray[depth] = '';
					subJS(elem[1], false);
					jsArray[depth] = replaceAll(jsArray[depth], ' ', '');
					var convertText1 = '';
					var convertText2 = '';
					if (angleMode == 'deg' || angleMode == 'degrees') {
						convertText1 = '(';
						convertText2 = ')*Math.PI/180';
					}
					subText += 'Math.' + elem[0] + '(' + convertText1 + jsArray[depth] + convertText2 + ')';
					jsArray[depth] = '';
					depth--;
					position.pop();
					jsArray[depth] += subText;
					algArray[depth] += subText;
					return;
				} else if (elem[0] == 'sin-1' || elem[0] == 'cos-1' || elem[0] == 'tan-1') {
					var subText = '';
					if (jsArray[depth] !== '' && /[\+\-\u00D7\u00F7\*\/\=\[(]/.test(jsArray[depth].slice(-1)) == false) subText += "*";
					depth++;
					position.push(0);
					jsArray[depth] = '';
					subJS(elem[1], false);
					jsArray[depth] = replaceAll(jsArray[depth], ' ', '');
					var convertText1 = '';
					var convertText2 = '';
					if (angleMode == 'deg' || angleMode == 'degrees') {
						convertText1 = '((';
						convertText2 = ')*180/Math.PI)';
					}
					subText += convertText1 + 'Math.a' + elem[0].slice(0, 3) + '(' + jsArray[depth] + ')' + convertText2;;
					jsArray[depth] = '';
					depth--;
					position.pop();
					jsArray[depth] += subText;
					algArray[depth] += subText;
					return;
				} else if (elem[0] == 'ln') {
					var subText = '';
					if (jsArray[depth] !== '' && /[\+\-\u00D7\u00F7\*\/\=\[(]/.test(jsArray[depth].slice(-1)) == false) subText += "*";
					depth++;
					position.push(0);
					jsArray[depth] = '';
					subJS(elem[1], false);
					jsArray[depth] = replaceAll(jsArray[depth], ' ', '');
					subText += 'Math.log(' + jsArray[depth] + ')';
					jsArray[depth] = '';
					position.pop();
					depth--;
					jsArray[depth] += subText;
					algArray[depth] += subText;
					return;
				} else if (elem[0] == 'log') {
					var subText = '';
					if (jsArray[depth] !== '' && /[\+\-\u00D7\u00F7\*\/\=\[(]/.test(jsArray[depth].slice(-1)) == false) subText += "*";
					depth++;
					position.push(0);
					jsArray[depth] = '';
					subJS(elem[1], false);
					jsArray[depth] = replaceAll(jsArray[depth], ' ', '');
					subText += '((Math.log(' + jsArray[depth] + '))/(Math.log(10)))';
					jsArray[depth] = '';
					depth--;
					position.pop();
					jsArray[depth] += subText;
					algArray[depth] += subText;
					return;
				} else if (elem[0] == 'logBase') {
					var subText = '';
					if (jsArray[depth] !== '' && /[\+\-\u00D7\u00F7\*\/\=\[(]/.test(jsArray[depth].slice(-1)) == false) subText += "*";
					depth++;
					position.push(0);
					jsArray[depth] = '';
					subJS(elem[2], false);
					jsArray[depth] = replaceAll(jsArray[depth], ' ', '');
					subText += '((Math.log(' + jsArray[depth] + '))/';
					jsArray[depth] = '';
					subJS(elem[1], false);
					jsArray[depth] = replaceAll(jsArray[depth], ' ', '');
					subText += '(Math.log(' + jsArray[depth] + ')))';
					jsArray[depth] = '';
					depth--;
					position.pop();
					jsArray[depth] += subText;
					algArray[depth] += subText;
					return;
				} else if (elem[0] == 'abs') {
					var subText = '';
					if (jsArray[depth] !== '' && /[\+\-\u00D7\u00F7\*\/\=\[(]/.test(jsArray[depth].slice(-1)) == false) subText += "*";
					depth++;
					position.push(0);
					jsArray[depth] = '';
					subJS(elem[1], false);
					jsArray[depth] = replaceAll(jsArray[depth], ' ', '');
					subText += 'Math.abs(' + jsArray[depth] + ')';
					jsArray[depth] = '';
					depth--;
					position.pop();
					jsArray[depth] += subText;
					algArray[depth] += subText;
					return;
				} else if (elem[0] == 'power' || elem[0] == 'pow') {
					var baseSplitPoint = 0;
					var trigPower = false;
					if (jsArray[depth] !== '') {
						if (jsArray[depth].charAt(jsArray[depth].length - 1) == ')') {
							var bracketCount = 1;
							for (jsChar = jsArray[depth].length - 2; jsChar >= 0; jsChar--) {
								if (jsArray[depth].charAt(jsChar) == ')') {
									bracketCount++
								}
								if (jsArray[depth].charAt(jsChar) == '(') {
									bracketCount--
								}
								if (bracketCount == 0 && !baseSplitPoint) {
									baseSplitPoint = jsChar;
									break;
								}
							}
						} else if (jsArray[depth].slice(jsArray[depth].length - 3) == 'sin' || jsArray[depth].slice(jsArray[depth].length - 3) == 'coa' || jsArray[depth].slice(jsArray[depth].length - 3) == 'tan') {
							trigPower = true;
						} else if (/[A-Za-z]/g.test(jsArray[depth].charAt(jsArray[depth].length - 1)) == true) {
							baseSplitPoint = jsArray[depth].length - 1;
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
							return '';
						}
					}
					var base = jsArray[depth].slice(baseSplitPoint);
					jsArray[depth] = jsArray[depth].slice(0, baseSplitPoint);
					depth++;
					position.push(0);
					jsArray[depth] = '';
					subJS(elem[2], false);
					jsArray[depth] = replaceAll(jsArray[depth], ' ', '');
					if (trigPower == true) {
						if (jsArray[depth] == '-1') {
							jsArray[depth - 1] = jsArray[depth - 1].slice(0, -3) + 'Math.a' + jsArray[depth - 1].slice(-3);
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
					depth++;
					position.push(0);
					jsArray[depth] = '';
					for (var sub = 0; sub < elem.length; sub++) {
						subJS(elem[sub], addMultIfNecc);
					}
					jsArray[depth - 1] += jsArray[depth];
					algArray[depth - 1] += algArray[depth];
					jsArray[depth] = '';
					depth--;
					position.pop();
					return;
				}
			}

			function timesBeforeLetters(testText) {
				for (q = 0; q < testText.length; q++) {
					if (q > 0) {
						if (/[a-zA-Z]/g.test(testText.charAt(q)) == true && /[a-zA-Z0-9)]/.test(testText.charAt(q - 1)) == true) {
							testText = testText.slice(0, q) + '*' + testText.slice(q);
						}
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
			return js;
		},
		addFunction: function () {
			var path = draw.path[draw.currCursor.pathNum];
			var obj = path.obj[0];
			if (un(obj.path)) obj.path = [];
			var gridPath = {
				type: 'function',
				text: [''],
				color: '#00F',
			};
			obj.path.push(gridPath);
			drawCanvasPaths();
			gridPath._textObj.textEdit = true;
			path._interacting = true;
			drawSelectedPaths();
			textEdit.start(draw.currCursor.pathNum,gridPath._textObj,0);
		},
		toggleSelected: function () {
			var gridPath = draw.currCursor.gridPath;
			gridPath._selected = !gridPath._selected;
			drawCanvasPaths();
		},
		changeColor: function () {
			var obj = draw.currCursor.obj;
			var gridPath = draw.currCursor.gridPath;
			gridPath._colorPicker = !gridPath._colorPicker;
			drawCanvasPaths();
		},
		setColor: function() {
			var obj = draw.currCursor.obj;
			var gridPath = obj.path[draw.currCursor.gridPathIndex];
			var color = draw.currCursor.color;
			gridPath.color = color;
			delete gridPath._colorPicker;
			drawCanvasPaths();
		},
		changeValue: function () {
			var obj = draw.currCursor.obj;
			var gridPath = draw.currCursor.gridPath;
			var value = prompt('Function (in js)', gridPath._value);
			if (value === false || value === null)
				return;
			try {
				gridPath.func = new Function('return ' + 'function(x) {return ' + value + ';}')();
			} catch (error) {
				Notifier.error('invalid function');
			};
			drawCanvasPaths();
		},
		changeSize: function () {
			var obj = draw.currCursor.obj;
			var gridPath = draw.currCursor.gridPath;
			var value = gridPath.lineWidth || gridPath.radius || 2;
			var value = prompt('Width', value);
			if (value === false || value === null || isNaN(Number(value)) || Number(value) < 1)
				return;
			if (!un(gridPath.radius)) {
				gridPath.radius = value;
			} else {
				gridPath.lineWidth = value;
			}
			drawCanvasPaths();
		},
		deletePath: function () {
			var obj = draw.currCursor.obj;
			var gridPathIndex = draw.currCursor.gridPathIndex;
			obj.path.splice(gridPathIndex, 1);
			drawCanvasPaths();
		},
		setPointStyle: function() {
			var obj = draw.currCursor.obj;
			var gridPath = obj.path[draw.currCursor.gridPathIndex];
			var style = draw.currCursor.style;
			gridPath.style = style;
			delete gridPath._colorPicker;
			drawCanvasPaths();
		}
	},
	zoomGrid: function(factor) {
		var path = draw.path[draw.currCursor.pathNum];
		var obj = path.obj[0];
		var xMid = (obj.xMax+obj.xMin)/2;
		var yMid = (obj.yMax+obj.yMin)/2;
		var xDiff = (obj.xMax-obj.xMin)/2;
		var yDiff = (obj.yMax-obj.yMin)/2;
		obj.xMin = xMid-factor*xDiff;
		obj.xMax = xMid+factor*xDiff;
		obj.yMin = yMid-factor*yDiff;
		obj.yMax = yMid+factor*yDiff;
		draw.grid.autoSetScales(obj);
		drawCanvasPaths();
	},
	autoSetScales: function(obj) {
		var xDiff = obj.xMax - obj.xMin;
		var xMag = Math.log(xDiff)/Math.log(10);
		var xMag1 = Math.floor(xMag);
		var xMag2 = xMag - xMag1;
		if (xDiff % 180 == 0) { // assume degrees
			obj.xMinorStep = Math.pow(10,xMag1-2)*30;
			obj.xMajorStep = Math.pow(10,xMag1-2)*90;
		} else {
			if (xMag2 < 0.35) {
				obj.xMinorStep = Math.pow(10,xMag1-2)*10;
				obj.xMajorStep = Math.pow(10,xMag1-1)*2;		
			} else if (xMag2 < 0.5) {
				obj.xMinorStep = Math.pow(10,xMag1-1);
				obj.xMajorStep = Math.pow(10,xMag1)/2;		
			} else if (xMag2 < 0.65) {
				obj.xMinorStep = Math.pow(10,xMag1-1);
				obj.xMajorStep = Math.pow(10,xMag1-1)*2;		
			} else {
				obj.xMinorStep = Math.pow(10,xMag1-1)*5;
				obj.xMajorStep = Math.pow(10,xMag1);		
			}
		}
		
		var yDiff = obj.yMax - obj.yMin;
		var yMag = Math.log(yDiff)/Math.log(10);
		var yMag1 = Math.floor(yMag);
		var yMag2 = yMag - yMag1;
		if (yMag2 < 0.35) {
			obj.yMinorStep = Math.pow(10,yMag1-2)*10;
			obj.yMajorStep = Math.pow(10,yMag1-1)*2;		
		} else if (yMag2 < 0.5) {
			obj.yMinorStep = Math.pow(10,yMag1-1);
			obj.yMajorStep = Math.pow(10,yMag1)/2;		
		} else if (yMag2 < 0.65) {
			obj.yMinorStep = Math.pow(10,yMag1-1);
			obj.yMajorStep = Math.pow(10,yMag1-1)*2;		
		} else {
			obj.yMinorStep = Math.pow(10,yMag1-1)*5;
			obj.yMajorStep = Math.pow(10,yMag1);		
		}
	},

	getSnapPos: function (obj) {
		var xStep = obj.xSnapStep || obj.xMinorStep;
		var yStep = obj.ySnapStep || obj.yMinorStep;
		var xMinorSpacing = (obj.width * xStep) / (obj.xMax - obj.xMin);
		var yMinorSpacing = (obj.height * yStep) / (obj.yMax - obj.yMin);
		var x0 = obj.left - (obj.xMin * obj.width) / (obj.xMax - obj.xMin);
		var y0 = obj.top + (obj.yMax * obj.height) / (obj.yMax - obj.yMin);

		var xPos = [];
		var xAxisPoint = x0;
		while (roundToNearest(xAxisPoint, 0.01) <= roundToNearest(obj.left + obj.width, 0.01)) {
			if (roundToNearest(xAxisPoint, 0.01) > roundToNearest(obj.left, 0.01) && xPos.indexOf(xAxisPoint) == -1)
				xPos.push(xAxisPoint);
			xAxisPoint += xMinorSpacing;
		}
		var xAxisPoint = x0;
		while (roundToNearest(xAxisPoint, 0.01) >= roundToNearest(obj.left, 0.01)) {
			if (roundToNearest(xAxisPoint, 0.01) < roundToNearest(obj.left + obj.width, 0.01) && xPos.indexOf(xAxisPoint) == -1)
				xPos.push(xAxisPoint);
			xAxisPoint -= xMinorSpacing;
		}

		var yPos = [];
		var yAxisPoint = y0;
		while (roundToNearest(yAxisPoint, 0.01) <= roundToNearest(obj.top + obj.height, 0.01)) {
			if (roundToNearest(yAxisPoint, 0.01) > roundToNearest(obj.top, 0.01) && yPos.indexOf(yAxisPoint) == -1)
				yPos.push(yAxisPoint);
			yAxisPoint += yMinorSpacing;
		}
		var yAxisPoint = y0;
		while (roundToNearest(yAxisPoint, 0.01) >= roundToNearest(obj.top, 0.01)) {
			if (roundToNearest(yAxisPoint, 0.01) < roundToNearest(obj.top + obj.height, 0.01) && yPos.indexOf(yAxisPoint) == -1)
				yPos.push(yAxisPoint);
			yAxisPoint -= yMinorSpacing;
		}

		var pos = [];
		for (var x = 0; x < xPos.length; x++) {
			for (var y = 0; y < yPos.length; y++) {
				pos.push({
					type: 'point',
					pos: [xPos[x], yPos[y]]
				});
			}
		}
		return pos;
	},
	showGrid: function () {
		var pathNum = draw.currCursor.pathNum;
		var obj = draw.path[pathNum].obj[0];
		if (typeof obj.showGrid == 'undefined') {
			obj.showGrid = false;
		} else {
			obj.showGrid = !obj.showGrid;
		}
		drawCanvasPaths();
	},
	showScales: function () {
		var pathNum = draw.currCursor.pathNum;
		var obj = draw.path[pathNum].obj[0];
		if (typeof obj.showScales == 'undefined') {
			obj.showScales = false;
		} else {
			obj.showScales = !obj.showScales;
		}
		drawCanvasPaths();
	},
	showLabels: function () {
		var pathNum = draw.currCursor.pathNum;
		var obj = draw.path[pathNum].obj[0];
		if (typeof obj.showLabels == 'undefined') {
			obj.showLabels = false;
		} else {
			obj.showLabels = !obj.showLabels;
		}
		drawCanvasPaths();
	},
	showBorder: function () {
		var pathNum = draw.currCursor.pathNum;
		var obj = draw.path[pathNum].obj[0];
		if (typeof obj.showBorder == 'undefined') {
			obj.showBorder = false;
		} else {
			obj.showBorder = !obj.showBorder;
		}
		drawCanvasPaths();
	},
	originStyle: function () {
		var pathNum = draw.currCursor.pathNum;
		var obj = draw.path[pathNum].obj[0];
		if (typeof obj.originStyle == 'undefined' || obj.originStyle == 'circle') {
			obj.originStyle = 'numbers';
		} else {
			obj.originStyle = 'circle';
		}
		drawCanvasPaths();
	},
	toHistogram: function () {
		var obj = sel();
		if (obj.type !== 'grid')
			return;
		obj.originStyle = 'numbers';
		obj.xMin = 0;
		obj.xMax = 35;
		obj.yMin = 0;
		obj.yMax = 2;
		obj.yMajorStep = 0.5;
		obj.yMinorStep = 0.1;
		obj.plot = [{
				type: 'histogram',
				fillStyle: '#CFF',
				chartData: [{
						min: 0,
						max: 10,
						freq: 5
					}, {
						min: 10,
						max: 15,
						freq: 8
					}, {
						min: 15,
						max: 20,
						freq: 7,
						fillStyle: '#FCF'
					}, {
						min: 20,
						max: 35,
						freq: 8
					}
				]
			}
		];
		obj.axisLabels = [{
				text: ['<<fontSize:28>>Time (s)']
			}, {
				text: ['<<fontSize:28>>Frequency' + br + 'Density']
			}
		];
		console.log(obj);
		updateBorder(selPath());
		drawCanvasPaths();
	},
	toCFreq: function () {
		var obj = sel();
		if (obj.type !== 'grid')
			return;
		obj.originStyle = 'numbers';
		obj.xMin = 0;
		obj.xMax = 140;
		obj.yMin = 0;
		obj.yMax = 70;
		obj.xMajorStep = 20;
		obj.xMinorStep = 10;
		obj.yMajorStep = 10;
		obj.yMinorStep = 5;
		obj.plot = [{
				type: 'cFreq',
				pointStyle: 'circle',
				chartData: [[0, 0], [25, 20], [50, 43], [75, 48], [100, 56], [125, 62]]
			}
		];
		obj.axisLabels = [{
				text: ['<<fontSize:28>>Time (s)']
			}, {
				text: ['<<fontSize:28>>Cumulative Frequency']
			}
		];
		console.log(obj);
		updateBorder(selPath());
		drawCanvasPaths();
	},
	toScatter: function () {
		var obj = sel();
		if (obj.type !== 'grid')
			return;
		obj.originStyle = 'numbers';
		obj.xMin = 0;
		obj.xMax = 140;
		obj.yMin = 0;
		obj.yMax = 70;
		obj.xMajorStep = 20;
		obj.xMinorStep = 10;
		obj.yMajorStep = 10;
		obj.yMinorStep = 5;
		obj.plot = [{
				type: 'scatter',
				pointStyle: 'circle',
				chartData: [[25, 20], [50, 43], [75, 48], [100, 56], [125, 62]]
			}
		];
		obj.axisLabels = [{
				text: ['<<fontSize:28>>Weight (kg)']
			}, {
				text: ['<<fontSize:28>>Height (cm)']
			}
		];
		console.log(obj);
		updateBorder(selPath());
		drawCanvasPaths();
	},
	toFreqPolygon: function () {
		var obj = sel();
		if (obj.type !== 'grid')
			return;
		obj.originStyle = 'numbers';
		obj.xMin = 0;
		obj.xMax = 140;
		obj.yMin = 0;
		obj.yMax = 70;
		obj.xMajorStep = 20;
		obj.xMinorStep = 10;
		obj.yMajorStep = 10;
		obj.yMinorStep = 5;
		obj.plot = [{
				type: 'freqPolygon',
				pointStyle: 'circle',
				chartData: [[25, 20], [50, 43], [75, 48], [100, 56], [125, 62]]
			}
		];
		obj.axisLabels = [{
				text: ['<<fontSize:28>>Time (days)']
			}, {
				text: ['<<fontSize:28>>Height (cm)']
			}
		];
		console.log(obj);
		updateBorder(selPath());
		drawCanvasPaths();
	},
	drawButton: function (ctx, size) {
		ctx.lineWidth = 0.02 * size;
		ctx.strokeStyle = '#666';

		for (var i = 2; i <= 8; i++) {
			ctx.moveTo(0.2 * size, 0.1 * i * size);
			ctx.lineTo(0.8 * size, 0.1 * i * size);
			ctx.moveTo(0.1 * i * size, 0.2 * size);
			ctx.lineTo(0.1 * i * size, 0.8 * size);
		}
		ctx.stroke();

		drawArrow({
			ctx: ctx,
			startX: 0.2 * size,
			startY: 0.5 * size,
			finX: 0.8 * size,
			finY: 0.5 * size,
			lineWidth: 0.02 * size,
			arrowLength: 0.06 * size
		});
		drawArrow({
			ctx: ctx,
			startX: 0.5 * size,
			startY: 0.8 * size,
			finX: 0.5 * size,
			finY: 0.2 * size,
			lineWidth: 0.02 * size,
			arrowLength: 0.06 * size
		});
	},
	gridPathStart: function () {
		var obj = draw.currCursor.obj;
		draw.gridPath = {
			obj: obj
		};
		if (un(obj.path))
			obj.path = [];
		draw.gridDrawMode = draw.currCursor.mode;
		var pos = getCoordAtMousePos(obj);
		if (draw.gridDrawMode == 'grid-drawLineSegmentPoints' || draw.currCursor.mode == 'drawLineSegmentPoints') {
			draw.gridDrawPoints = [];
			var found = false;
			for (var p = 0; p < obj.path.length; p++) {
				if (obj.path[p].type !== 'point')
					continue;
				var pos2 = obj.path[p].pos;
				draw.gridDrawPoints.push(pos2);
				if (dist(pos[0], pos[1], pos2[0], pos2[1]) < 1) {
					pos = clone(pos2);
					found = true;
				}
			}
			if (found == false)
				return;
		} else {
			pos[0] = roundToNearest(pos[0], obj.xMinorStep);
			pos[1] = roundToNearest(pos[1], obj.yMinorStep);
		}
		obj.path.push({
			type: 'lineSegment',
			pos: [clone(pos), clone(pos)],
			strokeStyle: draw.color,
			lineWidth: draw.thickness
		});
		drawCanvasPaths();
		draw.animate(draw.grid.gridPathMove,draw.grid.gridPathStop,drawCanvasPaths);
		//addListenerMove(window, draw.grid.gridPathMove);
		//addListenerEnd(window, draw.grid.gridPathStop);
	},
	gridPathMove: function (e) {
		updateMouse(e);
		var obj = draw.gridPath.obj;
		var path = obj.path.last();
		var pos = getCoordAtMousePos(obj);
		if (draw.gridDrawMode == 'grid-drawLineSegmentPoints') {
			for (var p = 0; p < draw.gridDrawPoints.length; p++) {
				var pos2 = draw.gridDrawPoints[p];
				if (arraysEqual(pos2, path.pos[0]))
					continue;
				if (dist(pos[0], pos[1], pos2[0], pos2[1]) < 1) {
					pos = clone(pos2);
					break;
				}
			}
		} else {
			pos[0] = bound(pos[0], obj.xMin, obj.xMax, obj.xMinorStep);
			pos[1] = bound(pos[1], obj.yMin, obj.yMax, obj.yMinorStep);
			pos[0] = roundToNearest(pos[0], obj.xMinorStep);
			pos[1] = roundToNearest(pos[1], obj.yMinorStep);
		}
		if (arraysEqual(path.pos[1], pos) == false) {
			path.pos[1] = pos;
			//drawCanvasPaths();
		}
	},
	gridPathStop: function (e) {
		var obj = draw.gridPath.obj;
		var path = obj.path.last();
		if (draw.gridDrawMode == 'grid-drawLineSegmentPoints') {
			var found = false;
			for (var p = 0; p < draw.gridDrawPoints.length; p++) {
				var pos2 = draw.gridDrawPoints[p];
				if (arraysEqual(pos2, path.pos[0]))
					continue;
				if (arraysEqual(pos2, path.pos[1]))
					found = true;
			}
			if (found == false) {
				obj.path.pop();
				drawCanvasPaths();
			}
		} else {
			if (arraysEqual(path.pos[0], path.pos[1]) == true) {
				obj.path.pop();
				if (obj.path.length == 0)
					delete obj.path;
				drawCanvasPaths();
			}
		}
		delete draw.gridPath;
		delete draw.gridDrawMode;
		delete draw.gridDrawPoints;
		//removeListenerMove(window, draw.grid.gridPathMove);
		//removeListenerEnd(window, draw.grid.gridPathStop);
	},
	moveStart: function (e) {
		var obj = draw.currCursor.obj;
		changeDrawMode('gridDragMove');
		updateMouse(e);
		draw.drag = {
			obj: obj,
			pos:clone(draw.mouse)
		};
		obj._path._interacting = true;
		drawCanvasPaths();
		calcCursorPositions();
		draw.animate(draw.grid.moveMove,draw.grid.moveStop,drawCanvasPaths);
		//addListenerMove(window, draw.grid.moveMove);
		//addListenerEnd(window, draw.grid.moveStop);
		draw.cursorCanvas.style.cursor = draw.cursors.move2;
	},
	moveMove: function (e) {
		updateMouse(e);
		var obj = draw.drag.obj;
		var dx = draw.mouse[0]-draw.drag.pos[0];
		var dy = draw.mouse[1]-draw.drag.pos[1];
		var dx2 = dx * (obj.xMax-obj.xMin)/obj.width;
		var dy2 = dy * (obj.yMax-obj.yMin)/obj.height;
		obj.xMin -= dx2;
		obj.xMax -= dx2;
		obj.yMin += dy2;
		obj.yMax += dy2;
		//drawSelectedPaths(false);
		draw.drag.pos = clone(draw.mouse);
	},
	moveStop: function (e) {
		var obj = draw.drag.obj;
		changeDrawMode();
		delete obj._path._interacting;
		delete draw.drag;
		
		var xMag = Math.floor(Math.log(obj.xMax - obj.xMin)/Math.log(10));
		var yMag = Math.floor(Math.log(obj.yMax - obj.yMin)/Math.log(10));
		xMag = Math.pow(10,xMag-1);
		yMag = Math.pow(10,yMag-1);
		obj.xMin = roundToNearest(obj.xMin,xMag);
		obj.xMax = roundToNearest(obj.xMax,xMag);
		obj.yMin = roundToNearest(obj.yMin,yMag);
		obj.yMax = roundToNearest(obj.yMax,yMag);
		
		drawCanvasPaths();
		//removeListenerMove(window, draw.grid.moveMove);
		//removeListenerEnd(window, draw.grid.moveStop);
		draw.cursorCanvas.style.cursor = draw.cursors.move1;
	},

	scale: function (obj, sf, center) {
		if (!un(center)) {
			obj.left = center[0] + sf * (obj.left - center[0]);
			obj.top = center[1] + sf * (obj.top - center[1]);
		}
		obj.width *= sf;
		obj.height *= sf;
		if (!un(obj.xScaleOffset))
			obj.xScaleOffset *= sf;
		if (!un(obj.yScaleOffset))
			obj.yScaleOffset *= sf;
		if (!un(obj.minorWidth))
			obj.minorWidth *= sf;
		if (!un(obj.majorWidth))
			obj.majorWidth *= sf;
		if (!un(obj.fontSize))
			obj.fontSize *= sf;
	},

	getCursorPositionsSelected: function (obj, pathNum) {
		var path = draw.path[pathNum];
		var pos = [];
		if (!un(obj._interactMode) && obj._interactMode !== 'none' && !un(draw.grid.interact[obj._interactMode])) {
			pos.push({
				shape: 'rect',
				dims: [obj.left - 10, obj.top - 10, obj.width + 20, obj.height + 20],
				cursor: obj._interactCursor,
				func: draw.grid.interact[obj._interactMode],
				obj: obj,
				pathNum: pathNum,
				highlight: -1
			});
		}
		return pos;
	},
	getCursorPositionsInteract: function (obj, path, pathNum) {
		var pos = [];

		var interact = path.isInput || path.interact || obj.interact;
		if (!un(interact) && interact._disabled !== true && interact.disabled !== true) {
			var x2 = obj.left + obj.width + 40;
			var y1 = obj.top;
			var buttons = interact.buttons || draw.grid.interactDefaultButtons;
			for (var b = 0; b < buttons.length; b++) {
				var button = buttons[b];
				pos.push({
					buttonType: 'grid-' + button,
					shape: 'rect',
					dims: [x2, y1 + 40 * b, 40, 40],
					cursor: draw.cursors.pointer,
					func: draw.grid.interactButtonClick,
					pathNum: pathNum,
					obj: obj,
					mode: button
				});
			}

			if (un(obj._interactMode)) obj._interactMode = interact.startMode || interact.mode2 || 'none';
			if (obj._interactMode !== 'none') {
				if (un(obj._interactCursor)) obj._interactCursor = draw.grid.getInteractCursor(path, obj);
				var func = obj._interactMode == 'move' ? draw.grid.moveStart : draw.grid.interact[obj._interactMode];
				pos.push({
					shape: 'rect',
					dims: [obj.left - 10, obj.top - 10, obj.width + 20, obj.height + 20],
					cursor: obj._interactCursor,
					func: func,
					obj: obj,
					pathNum: pathNum,
					highlight: -1
				});
			}
		}
		return pos;
	},
	interactDefaultButtons: ['plot', 'lineSegment', 'line', 'undo', 'clear'],
	drawInteractButton: function (ctx, obj, type, l, t, w, h, color, backColor) {
		var color = !un(color) ? color : '#000';
		ctx.save();
		switch (type) {
			case 'grid-plot':
			case 'plot':
			case 'point':
				ctx.fillStyle = !un(backColor) ? backColor : obj._interactMode == 'plot' ? colorA('#00F', 1) : colorA('#99F', 1);
				ctx.fillRect(l, t, w, h);
				ctx.strokeStyle = '#000';
				ctx.lineWidth = 1;
				ctx.strokeRect(l, t, w, h);
				ctx.lineWidth = 2;
				ctx.strokeStyle = color;
				ctx.beginPath();
				ctx.moveTo(l + 0.35 * w, t + 0.35 * h);
				ctx.lineTo(l + 0.65 * w, t + 0.65 * h);
				ctx.moveTo(l + 0.35 * w, t + 0.65 * h);
				ctx.lineTo(l + 0.65 * w, t + 0.35 * h);
				ctx.stroke();
				break;
			case 'pointCircle':
				ctx.fillStyle = !un(backColor) ? backColor : obj._interactMode == 'plot' ? colorA('#00F', 1) : colorA('#99F', 1);
				ctx.fillRect(l, t, w, h);
				ctx.strokeStyle = '#000';
				ctx.lineWidth = 1;
				ctx.strokeRect(l, t, w, h);
				ctx.fillStyle = color;
				ctx.beginPath();
				ctx.arc(l + 0.5 * w, t + 0.5 * h, 0.15*w, 0, 2*Math.PI);
				ctx.fill();
				break;
			case 'grid-lineSegment':
			case 'lineSegment':
				ctx.fillStyle = !un(backColor) ? backColor : obj._interactMode == 'lineSegment' ? colorA('#00F', 1) : colorA('#99F', 1);
				ctx.fillRect(l, t, w, h);
				ctx.lineWidth = 1;
				ctx.strokeStyle = '#000';
				ctx.strokeRect(l, t, w, h);
				ctx.lineWidth = 2;
				ctx.strokeStyle = color;
				ctx.beginPath();
				ctx.moveTo(l + 0.3 * w, t + 0.4 * h);
				ctx.lineTo(l + 0.7 * w, t + 0.6 * h);
				ctx.stroke();
				break;
			case 'grid-line':
			case 'line':
				ctx.fillStyle = !un(backColor) ? backColor : obj._interactMode == 'line' ? colorA('#00F', 1) : colorA('#99F', 1);
				ctx.fillRect(l, t, w, h);
				ctx.strokeStyle = '#000';
				ctx.lineWidth = 1;
				ctx.strokeRect(l, t, w, h);
				ctx.lineWidth = 2;
				ctx.strokeStyle = color;
				ctx.beginPath();
				ctx.moveTo(l, t + 0.3 * h);
				ctx.lineTo(l + w, t + 0.7 * h);
				ctx.stroke();
				break;
			case 'grid-undo':
			case 'undo':
				ctx.fillStyle = !un(backColor) ? backColor : colorA('#99F', 1);
				ctx.fillRect(l, t, w, h);
				ctx.strokeStyle = '#000';
				ctx.lineWidth = 1;
				ctx.strokeRect(l, t, w, h);
				text({
					ctx: ctx,
					color: color,
					textArray: ['<<fontSize:' + (w * 0.4) + '>>undo'],
					left: l,
					top: t,
					width: w,
					height: h,
					align: [0, 0]
				});
				break;
			case 'grid-clear':
			case 'clear':
				ctx.fillStyle = !un(backColor) ? backColor : colorA('#99F', 1);
				ctx.fillRect(l, t, w, h);
				ctx.lineWidth = 1;
				ctx.strokeStyle = '#000';
				ctx.strokeRect(l, t, w, h);
				text({
					ctx: ctx,
					color: color,
					textArray: ['<<fontSize:' + (w * 0.4) + '>>CLR'],
					left: l,
					top: t,
					width: w,
					height: h,
					align: [0, 0]
				});
				break;
			case 'grid-function':
			case 'grid-function2':
			case 'function':
			case 'function2':
				ctx.fillStyle = !un(backColor) ? backColor : colorA('#99F', 1);
				ctx.fillRect(l, t, w, h);
				ctx.lineWidth = 1;
				ctx.strokeStyle = '#000';
				ctx.strokeRect(l, t, w, h);
				ctx.beginPath();
				ctx.strokeStyle = color;
				ctx.lineWidth = 2;
				ctx.moveTo(l + 0.1 * w, t + 1 * h);
				ctx.bezierCurveTo(l + 0.3 * w, t - 0.5 * h, l + 0.7 * w, t + 1.5 * h, l + 0.9 * w, t + 0 * h);
				ctx.stroke();
				break;
			case 'grid-zoomIn':
			case 'zoomIn':
			case 'grid-zoomOut':
			case 'zoomOut':
				ctx.fillStyle = !un(backColor) ? backColor : colorA('#99F', 1);
				ctx.fillRect(l, t, w, h);
				ctx.strokeStyle = '#000';
				ctx.lineWidth = 1;
				ctx.strokeRect(l, t, w, h);	
				ctx.strokeStyle = color;
				ctx.lineWidth = (w/50)*6;
				ctx.beginPath();
				ctx.moveTo(l+(w/50)*20,t+(w/50)*20);
				ctx.lineTo(l+(w/50)*35,t+(w/50)*35);
				ctx.stroke();
				ctx.lineWidth = (w/50)*2;	
				ctx.beginPath();
				ctx.fillStyle = '#FFF';
				ctx.arc(l+(w/50)*20,t+(w/50)*20,(w/50)*10,0,2*Math.PI);
				ctx.fill();
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(l+(w/50)*16,t+(w/50)*20);
				ctx.lineTo(l+(w/50)*24,t+(w/50)*20);
				if (type === 'zoomIn' || type === 'grid-zoomIn') {
					ctx.moveTo(l+(w/50)*20,t+(w/50)*16);
					ctx.lineTo(l+(w/50)*20,t+(w/50)*24);
				}
				ctx.stroke();
				break;
			case 'grid-move':
			case 'move':
				ctx.fillStyle = !un(backColor) ? backColor : obj._interactMode == 'move' ? colorA('#00F', 1) : colorA('#99F', 1);
				ctx.fillRect(l, t, w, h);
				ctx.strokeStyle = '#000';
				ctx.lineWidth = 1;
				ctx.strokeRect(l, t, w, h);
				if (un(draw.grid.handImage)) {
					draw.grid.handImage = new Image;
					draw.grid.handImage.onload = function() {
						drawCanvasPaths();
					};
					draw.grid.handImage.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADCElEQVRYR+2WT0iacRjHvw3qBTMmMj0M8a0uC3FMSkKa8dJ7aYaSUMRYULguscTsZvCOOgzcybcJxS4yL0EwwT+7jYgOHXSXvYY4grfloYPUNshDDAI3fpLxrqz3tUaD4XOR1/f5/X4fv8/3efw1QVkwABIANACiADzKlslnNdVIeQ7gIYAfACIAeq1W6/jY2JirubmZEkUxv7y8/FGyTjzN+yl/3MUMKcBdAGabzfaaoih7uVwu7u3tcfv7+08YhhlNJBLQaDSIRqOYnp6G2WyGWq3GycmJIAgCd3x8nAbwvV4IKUBF5ng8rnG73SgUCiCf2WwWDMNACrC4uFh5tlgs2NzcrOQdHR25AST/NUAJwFMAQQAFJTBSBR4A8HEc5xwcHDR2dXUhHA4jFotBr9crUSDc19enam9vd2cymfDu7m4MwBc5iFomjE9OTrpJrUn4/X4IgiAL0NLSgomJCXi93mrp/ADe3BrAwsICRkZGUC6XrwVADERMSOKAYRgzy7LPpqamIIoiDg8P4XK5QFEU8vk80ul05Vmn052ZkCh2zryKFWCsVqu3tbV1lJxeLBa5nZ0dNU3TgarTr5KRlIfjOAQCAdjtdmn3KAb4xfN8pdYkyK9IJpOgafqs1eTqKH0vad/rAWQyGayuriKVStUNsLGxAZ7nD3K5XLBQKKQAfJWDJ13wbmZmptfpdJpYlgVx89bWVuVwn88Ho9Eot8fZe+IDj8dD+p94KqtkYbUNX/b3979YWVnRd3Z23lGpVErWXsi5CcB9g8Hg0Gq1/NLSUtvAwMCtA5AD//gvqJcgEolgfX3909ra2lsAHwB8U7KHdBI+AvAqFArZHA7HPTKK64nT7qn7riA7ipVC/E2A3p6envHu7m7f/Pw8Ojo6rmTI5XIIBoMgrbe9vf0ewGel0CSvlgLk+8cGg8E/OzvLDg0NaU0m06V7/s37wPlDaHJB4XneUp2StSj+a4A2AK5QKKSbm5u7sgTDw8MolUqk9WRH7/mNLvNAPT66UW4DoKFAQ4GGAr8B6HWSMOjcjREAAAAASUVORK5CYII=";
				} else {
					var w2 = draw.grid.handImage.naturalWidth;
					var h2 = draw.grid.handImage.naturalHeight;
					ctx.drawImage(draw.grid.handImage,l+13,t+13,w2,h2);
				}
				break;
		}
		ctx.restore();
	},
	getButtons: function (x1, y1, x2, y2, pathNum) {
		var buttons = [{
				buttonType: 'grid-showGrid',
				shape: 'rect',
				dims: [x1, y1 + 20, 20, 20],
				cursor: draw.cursors.pointer,
				func: draw.grid.showGrid,
				pathNum: pathNum
			}, {
				buttonType: 'grid-showScales',
				shape: 'rect',
				dims: [x1, y1 + 40, 20, 20],
				cursor: draw.cursors.pointer,
				func: draw.grid.showScales,
				pathNum: pathNum
			}, {
				buttonType: 'grid-showLabels',
				shape: 'rect',
				dims: [x1, y1 + 60, 20, 20],
				cursor: draw.cursors.pointer,
				func: draw.grid.showLabels,
				pathNum: pathNum
			}, {
				buttonType: 'grid-showBorder',
				shape: 'rect',
				dims: [x1, y1 + 80, 20, 20],
				cursor: draw.cursors.pointer,
				func: draw.grid.showBorder,
				pathNum: pathNum
			}, {
				buttonType: 'grid-originStyle',
				shape: 'rect',
				dims: [x1, y1 + 100, 20, 20],
				cursor: draw.cursors.pointer,
				func: draw.grid.originStyle,
				pathNum: pathNum
			}
		]
		buttons.push({
			buttonType: 'grid-interact',
			shape: 'rect',
			dims: [(x1 + x2) / 2 - 50, y1, 100, 20],
			cursor: draw.cursors.pointer,
			func: draw.grid.toggleInteract,
			pathNum: pathNum,
			draw: function (path, ctx, l, t, w, h) {
				if (!un(path.interact) && path.interact.type == 'grid') {
					ctx.fillStyle = '#F90';
					ctx.fillRect(l, t, w, h);
					text({
						ctx: ctx,
						align: [0, 0],
						rect: [l, t, w, h],
						text: ['<<fontSize:14>>interact: grid']
					});
				} else {
					ctx.strokeStyle = '#F90';
					ctx.lineWidth = 2;
					ctx.strokeRect(l, t, w, h);
					text({
						ctx: ctx,
						align: [0, 0],
						rect: [l, t, w, h],
						text: ['<<fontSize:14>>interact: none']
					});
				}
			}
		});
		buttons.push({
			buttonType: 'grid-controls',
			shape: 'rect',
			dims: [x2 - 170, y2-20, 150, 20],
			cursor: draw.cursors.pointer,
			func: draw.grid.toggleControls,
			pathNum: pathNum,
			draw: function (path, ctx, l, t, w, h) {
				var controlsStyle = 'none';
				var interact = path.isInput || path.interact || path.obj[0].interact;
				if (!un(interact) && !un(interact.controlsStyle)) {
					controlsStyle = interact.controlsStyle;
				} else if (!un(interact) && interact.type == 'grid') {
					controlsStyle = interact.controlsStyle || 'buttons';
				}
				var color = controlsStyle === 'none' ? '#FFF' : controlsStyle === 'full' ? '#CFC' : controlsStyle === 'buttons' ? '#FFC' : '#FFF';
				var label = controlsStyle === 'none' ? 'no' : controlsStyle;
				ctx.fillStyle = color;
				ctx.fillRect(l, t, w, h);
				text({
					ctx: ctx,
					align: [0, 0],
					rect: [l, t, w, h],
					text: ['<<fontSize:14>>'+label+' controls']
				});
				
			}
		});
		/*var path = draw.path[pathNum];
		if (!un(path) && path.obj.length == 1) {
			var obj = path.obj[0];
			if (draw.mode == 'edit') {
				var buttons2 = draw.grid.interactDefaultButtons;
				for (var b = 0; b < buttons2.length; b++) {
					var button = buttons2[b];
					buttons.push({
						buttonType: 'grid-' + button,
						shape: 'rect',
						dims: [x2, y1 + 60 + 40 * b, 40, 40],
						cursor: draw.cursors.pointer,
						func: draw.grid.interactButtonClick,
						pathNum: pathNum,
						obj: obj,
						mode: button
					});
				}
			}
		}*/
		return buttons;
	},
	toggleInteract: function () {
		var path = draw.path[draw.currCursor.pathNum];
		if (un(path.interact))
			path.interact = {};
		if (path.interact.type === 'grid') {
			path.interact.type = 'none';
		} else {
			path.interact.type = 'grid';
		}
		if (un(path.interact.color))
			path.interact.color = '#F00';
		if (un(path.interact.lineWidth))
			path.interact.lineWidth = 5;
		if (un(path.interact.max))
			path.interact.max = 1000;
		if (un(path.interact.mode2))
			path.interact.mode2 = 'none';
		if (un(path.interact.buttons))
			path.interact.buttons = clone(draw.grid.interactDefaultButtons);
		if (path.interact.type === 'grid')
			console.log(path.interact);
		updateBorder(path);
		drawCanvasPaths();
	},
	toggleControls: function() {
		var path = draw.path[draw.currCursor.pathNum];
		if (un(path.interact)) path.interact = {};
		var controlsStyle = 'none';
		if (!un(path.interact.controlsStyle)) {
			controlsStyle = path.interact.controlsStyle;
		} else if (path.interact.type == 'grid') {
			controlsStyle = 'buttons';
		} 
		if (controlsStyle === 'none') {
			path.interact.controlsStyle = 'full';
		} else if (controlsStyle === 'full') {
			path.interact.controlsStyle = 'buttons';
		} else if (controlsStyle === 'buttons') {
			path.interact.controlsStyle = 'none';
		}
		drawCanvasPaths();
	},
	interactButtonClick: function () {
		var path = draw.path[draw.currCursor.pathNum];
		var obj = path.obj[0];
		var mode = draw.currCursor.mode;
		if (mode == 'undo') {
			draw.grid.undo();
			return;
		}
		if (mode == 'clear') {
			draw.grid.clear();
			return;
		}
		if (mode == 'function') {
			draw.grid.gridPaths.addFunction();
			return;
		}
		if (mode === 'zoomIn') {
			draw.grid.zoomGrid(draw.currCursor.factor);
			return;
		}
		if (mode === 'zoomOut') {
			draw.grid.zoomGrid(draw.currCursor.factor);
			return;
		}
		if (obj._interactMode == mode) mode = 'none';
		obj._interactMode = mode;
		obj._interactCursor = draw.grid.getInteractCursor(path, obj);
		updateBorder(path);
		drawCanvasPaths();
	},
	getInteractCursor: function (path, obj) {
		if (obj._interactMode == 'line' || obj._interactMode == 'lineSegment') {
			if (!un(obj._interactColor)) {
				var color = obj._interactColor;
			} else if (!un(path.interact) && !un(path.interact.color)) {
				var color = path.interact.color;
			} else {
				var color = '#00F';
			}
			return draw.grid.getCrossCursor(color);
		} else if (obj._interactMode == 'move') {
			return draw.cursors.move1;
		} else if (obj._interactMode == 'moving') {
			return draw.cursors.move2;
		} else {
			return draw.cursors.pointer;
		}
	},
	getCrossCursor: function (color) {
		var canvas = draw.hiddenCanvas;
		var ctx = draw.hiddenCanvas.ctx;
		ctx.clearRect(0, 0, 50, 50);
		ctx.strokeStyle = color;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(2, 2);
		ctx.lineTo(12, 12);
		ctx.moveTo(2, 12);
		ctx.lineTo(12, 2);
		ctx.stroke();

		var data = canvas.toDataURL();
		return 'url("' + data + '") 7 7, auto';
	},
	undo: function () {
		var path = draw.path[draw.currCursor.pathNum];
		var obj = path.obj[0];
		if (un(obj.path) || obj.path.length == 0)
			return;
		for (var p = obj.path.length - 1; p >= 0; p--) {
			if (draw.mode == 'interact' && obj.path[p]._deletable !== true)
				continue;
			obj.path.splice(p, 1);
			drawCanvasPaths();
			return;
		}
	},
	clear: function () {
		var path = draw.path[draw.currCursor.pathNum];
		var obj = path.obj[0];
		if (un(obj.path) || obj.path.length == 0)
			return;
		for (var p = obj.path.length - 1; p >= 0; p--) {
			if (draw.mode == 'interact' && obj.path[p]._deletable !== true)
				continue;
			obj.path.splice(p, 1);
		}
		drawCanvasPaths();
	},
	interact: {
		point: function () {
			draw.grid.interact.plot();
		},
		plot: function () {
			var obj = draw.currCursor.obj;
			var path = obj._path;
			var mode = draw.mode;
			if (!un(path.isInput) && path.isInput._mode === 'addAnswers')
				mode = 'interact';
			if (un(obj.path))
				obj.path = [];
			var pos = draw.grid.getCoordAtPos(obj);
			pos[0] = roundToNearest(pos[0], obj.xMinorStep);
			pos[1] = roundToNearest(pos[1], obj.yMinorStep);
			for (var p = 0; p < obj.path.length; p++) {
				var path2 = obj.path[p];
				if (mode == 'interact' && path2._deletable !== true) continue;
				if (path2.type !== 'point') continue;
				if (path2.pos[0] == pos[0] && path2.pos[1] == pos[1]) {
					obj.path.splice(p, 1);
					drawCanvasPaths();
					return;
				}
			}
			var interact = path.isInput || path.interact || obj.interact;
			if (mode == 'interact' && !un(interact)) {
				if (!un(interact.max) && interact.max > 0) {
					var pathCount = 0;
					for (var p = 0; p < obj.path.length; p++) {
						var path2 = obj.path[p];
						if (path2._deletable !== true)
							continue;
						pathCount++;
					}
					if (pathCount == interact.max) {
						for (var p = obj.path.length - 1; p >= 0; p--) {
							var path2 = obj.path[p];
							if (path2._deletable !== true)
								continue;
							obj.path.splice(p, 1);
							break;
						}
					}
				}
			}
			var deletable = mode == 'interact' ? true : false;
			if (!un(obj._interactColor)) {
				var color = obj._interactColor;
			} else if (!un(path.interact) && !un(path.interact.color)) {
				var color = path.interact.color;
			} else {
				var color = '#00F';
			}
			obj.path.push({
				type: 'point',
				pos: pos,
				color: color,
				style: 'cross',
				radius: 8,
				_deletable: deletable
			});
			drawCanvasPaths();
		},
		line: function (type2) {
			if (un(type2))
				type2 = 'line';
			var obj = draw.currCursor.obj;
			var path = obj._path;
			var mode = draw.mode;
			if (!un(path.isInput) && path.isInput._mode === 'addAnswers')
				mode = 'interact';
			if (un(obj.path))
				obj.path = [];
			var pos = draw.grid.getCoordAtPos(obj);
			pos[0] = roundToNearest(pos[0], obj.xMinorStep);
			pos[1] = roundToNearest(pos[1], obj.yMinorStep);
			var interact = path.isInput || path.interact || obj.interact;
			if (mode == 'interact' && !un(interact)) {
				if (!un(interact.max) && interact.max > 0) {
					var pathCount = 0;
					for (var p = 0; p < obj.path.length; p++) {
						var path2 = obj.path[p];
						if (path2._deletable !== true)
							continue;
						pathCount++;
					}
					if (pathCount == interact.max) {
						for (var p = obj.path.length - 1; p >= 0; p--) {
							var path2 = obj.path[p];
							if (path2._deletable !== true)
								continue;
							obj.path.splice(p, 1);
							break;
						}
					}
				}
			}
			var index = -1;
			if (index == -1) {
				index = obj.path.length;
				var deletable = mode == 'interact' ? true : false;
				if (!un(obj._interactColor)) {
					var color = obj._interactColor;
				} else if (!un(path.interact) && !un(path.interact.color)) {
					var color = path.interact.color;
				} else {
					var color = '#00F';
				}
				/*if (!un(obj._interactLineWidth)) {
					var lineWidth = obj._interactLineWidth;
				} else if (!un(path.interact) && !un(path.interact.lineWidth)) {
					var lineWidth = path.interact.lineWidth;
				} else {
					var lineWidth = 5;
				}*/
				obj.path.push({
					type: type2,
					pos: [pos, pos],
					strokeStyle: color,
					//lineWidth: lineWidth,
					_deletable: deletable
				});
			}
			draw.grid.interact._obj = obj;
			draw.grid.interact._index = index;
			//addListenerMove(window, draw.grid.interact.lineMove);
			//addListenerEnd(window, draw.grid.interact.lineStop);
			draw.animate(draw.grid.interact.lineMove,draw.grid.interact.lineStop,drawCanvasPaths);
		},
		lineSegment: function () {
			draw.grid.interact.line('lineSegment');
		},
		lineMove: function (e) {
			updateMouse(e);
			var obj = draw.grid.interact._obj;
			var index = draw.grid.interact._index;
			var pos = draw.grid.getCoordAtPos(obj);
			pos[0] = roundToNearest(pos[0], obj.xMinorStep);
			pos[1] = roundToNearest(pos[1], obj.yMinorStep);
			obj.path[index].pos[1] = pos;
			//drawCanvasPaths();
		},
		lineStop: function (e) {
			updateMouse(e);
			var obj = draw.grid.interact._obj;
			var index = draw.grid.interact._index;
			var path = obj.path[index];
			if (path.pos[0][0] == path.pos[1][0] && path.pos[0][1] == path.pos[1][1])
				obj.path.splice(index, 1);
			delete draw.grid.interact._obj;
			delete draw.grid.interact._index;
			//removeListenerMove(window, draw.grid.interact.lineMove);
			//removeListenerEnd(window, draw.grid.interact.lineStop);
			drawCanvasPaths();
		}
	},
	getCoordAtPos: function (obj, pos) {
		if (un(pos))
			pos = draw.mouse;
		var xCoord = getCoordX2(pos[0], obj.left, obj.width, obj.xMin, obj.xMax);
		var yCoord = getCoordY2(pos[1], obj.top, obj.height, obj.yMin, obj.yMax);
		return [xCoord, yCoord];
	}
};
draw.arc = {
	add: function () {
		deselectAllPaths(false);
		changeDrawMode();
		var pos = getRelPos([150, 150]);
		var x = pos[0],
		y = pos[1],
		r = 100;
		draw.path.push({
			obj: [{
					type: 'angle',
					isArc: true,
					b: [x, y],
					radius: r,
					angleC: 0,
					c: [x + r * Math.cos(0), y + r * Math.sin(0)],
					angleA: -Math.PI / 3,
					a: [x + r * Math.cos(-Math.PI / 3), y + r * Math.sin(-Math.PI / 3)],
					lineWidth: draw.thickness,
					lineColor: draw.color,
					fillColor: 'none',
					fill: true,
					drawLines: false,
					squareForRight: false,
					labelIfRight: true,
					label: ['']
				}
			],
			selected: true
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
	},
	draw: function (ctx, obj, path) {
		ctx.save();
		ctx.strokeStyle = obj.color;
		ctx.lineWidth = obj.thickness;
		if (typeof ctx.setLineDash !== 'function') ctx.setLineDash = function () {};
		if (typeof obj.dash !== 'undefined') ctx.setLineDash(obj.dash);
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		ctx.beginPath();
		if (obj.clockwise == true) {
			ctx.arc(obj.center[0], obj.center[1], obj.radius, obj.startAngle, obj.finAngle);
			obj._startPos = [obj.center[0]+obj.radius*Math.cos(obj.startAngle), obj.center[1]+obj.radius*Math.sin(obj.startAngle)];
			obj._finPos = [obj.center[0]+obj.radius*Math.cos(obj.finAngle), obj.center[1]+obj.radius*Math.sin(obj.finAngle)];
		} else {
			ctx.arc(obj.center[0], obj.center[1], obj.radius, obj.finAngle, obj.startAngle);
			obj._finPos = [obj.center[0]+obj.radius*Math.cos(obj.startAngle), obj.center[1]+obj.radius*Math.sin(obj.startAngle)];
			obj._startPos = [obj.center[0]+obj.radius*Math.cos(obj.finAngle), obj.center[1]+obj.radius*Math.sin(obj.finAngle)];
		}
		if (un(obj._stroke) || obj._stroke === true) ctx.stroke();
		ctx.setLineDash([]);
		if (boolean(draw.drawArcCenter, false) == true) {
			ctx.fillStyle = obj.color;
			ctx.beginPath();
			ctx.moveTo(obj.center[0], obj.center[1]);
			ctx.arc(obj.center[0], obj.center[1], 5, 0, 2 * Math.PI);
			ctx.fill();
		}
		ctx.restore();
	},
	drawButton: function (ctx, size) {
		draw.arc.draw(ctx, {
			center: [0.5 * size, 0.2 * size],
			radius: 0.4 * size,
			startAngle: 0.25 * Math.PI,
			finAngle: 0.75 * Math.PI,
			clockwise: true,
			color: '#000',
			thickness: 0.04 * size
		});
	},
	scale: function (obj, sf, center) {
		if (un(center))
			var center = obj.b;
		obj.a[0] = center[0] + sf * (obj.a[0] - center[0]);
		obj.a[1] = center[1] + sf * (obj.a[1] - center[1]);
		obj.b[0] = center[0] + sf * (obj.b[0] - center[0]);
		obj.b[1] = center[1] + sf * (obj.b[1] - center[1]);
		obj.c[0] = center[0] + sf * (obj.c[0] - center[0]);
		obj.c[1] = center[1] + sf * (obj.c[1] - center[1]);
		if (!un(obj.radius))
			obj.radius *= sf;
		if (!un(obj.lineWidth))
			obj.lineWidth *= sf;
	},
	getRect: function (obj) {
		var pos1 = [obj.center[0] + obj.radius * Math.cos(obj.startAngle), obj.center[1] + obj.radius * Math.sin(obj.startAngle)];
		var pos2 = [obj.center[0] + obj.radius * Math.cos(obj.finAngle), obj.center[1] + obj.radius * Math.sin(obj.finAngle)];
		obj._left = Math.min(pos1[0], pos2[0]);
		obj._right = Math.max(pos1[0], pos2[0]);
		obj._top = Math.min(pos1[1], pos2[1]);
		obj._bottom = Math.max(pos1[1], pos2[1]);
		if (doesArcIncludeAngle(obj, 0) == true) obj._right = obj.center[0] + obj.radius;
		if (doesArcIncludeAngle(obj, 0.5 * Math.PI) == true) obj._bottom = obj.center[1] + obj.radius;
		if (doesArcIncludeAngle(obj, Math.PI) == true) obj._left = obj.center[0] - obj.radius;
		if (doesArcIncludeAngle(obj, 1.5 * Math.PI) == true) obj._top = obj.center[1] - obj.radius;
		obj._width = obj._right - obj._left;
		obj._height = obj._bottom - obj._top;
		return [obj._left, obj._top, obj._width, obj._height];
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.center[0] += dl;
		obj.center[1] += dt;
		obj.radius += dw;
	},
}
draw.sector = {
	add: function () {
		deselectAllPaths(false);
		changeDrawMode();
		var pos = getRelPos([150, 150]);
		var x = pos[0],
		y = pos[1],
		r = 100;
		draw.path.push({
			obj: [{
					type: 'angle',
					b: [x, y],
					radius: r,
					angleC: 0,
					c: [x + r * Math.cos(0), y + r * Math.sin(0)],
					angleA: -Math.PI / 3,
					a: [x + r * Math.cos(-Math.PI / 3), y + r * Math.sin(-Math.PI / 3)],
					lineWidth: draw.thickness,
					lineColor: draw.color,
					fillColor: 'none',
					fill: true,
					drawLines: true,
					squareForRight: false,
					labelIfRight: true,
					label: ['']
				}
			],
			selected: true,
			trigger: []
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
	},
	drawButton: function (ctx, size) {
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 0.02 * size;
		ctx.beginPath();
		drawAngle({
			ctx: ctx,
			a: [0.6 * size, 0.6 * size - 0.357 * size],
			b: [0.25 * size, 0.6 * size],
			c: [0.75 * size, 0.6 * size],
			fill: false,
			radius: 0.5 * size,
			drawLines: true,
			lineWidth: 0.02 * size
		});
		ctx.stroke();
	},
	scale: function (obj, sf, center) {
		if (un(center))
			var center = obj.b;
		obj.a[0] = center[0] + sf * (obj.a[0] - center[0]);
		obj.a[1] = center[1] + sf * (obj.a[1] - center[1]);
		obj.b[0] = center[0] + sf * (obj.b[0] - center[0]);
		obj.b[1] = center[1] + sf * (obj.b[1] - center[1]);
		obj.c[0] = center[0] + sf * (obj.c[0] - center[0]);
		obj.c[1] = center[1] + sf * (obj.c[1] - center[1]);
		if (!un(obj.radius))
			obj.radius *= sf;
		if (!un(obj.lineWidth))
			obj.lineWidth *= sf;
	}
}
draw.segment = {
	resizable: true,
	add: function () {
		deselectAllPaths(false);
		changeDrawMode();
		var pos = getRelPos([150, 150]);
		var x = pos[0],
		y = pos[1],
		r = 100;
		draw.path.push({
			obj: [{
					type: 'segment',
					center: [x, y],
					radius: r,
					startAngle: 4,
					finAngle: 0,
					color: draw.color,
					thickness: draw.thickness,
					fillColor: '#FCF',
					clockwise: false
				}
			],
			selected: true,
			trigger: []
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
	},
	draw: function (ctx, obj, path) {
		ctx.save();
		ctx.beginPath();
		obj._startPos = [obj.center[0] + obj.radius * Math.cos(obj.startAngle), obj.center[1] + obj.radius * Math.sin(obj.startAngle)];
		obj._finPos = [obj.center[0] + obj.radius * Math.cos(obj.finAngle), obj.center[1] + obj.radius * Math.sin(obj.finAngle)];
		if (obj.clockwise == true) {
			ctx.arc(obj.center[0], obj.center[1], obj.radius, obj.startAngle, obj.finAngle);
			ctx.lineTo(obj._startPos[0], obj._startPos[1]);
		} else {
			ctx.arc(obj.center[0], obj.center[1], obj.radius, obj.finAngle, obj.startAngle);
			ctx.lineTo(obj._finPos[0], obj._finPos[1]);
		}
		if (obj.fillColor !== 'none') {
			ctx.fillStyle = obj.fillColor;
			ctx.fill();
		}
		if (obj.color !== 'none') {
			ctx.strokeStyle = obj.color;
			ctx.lineWidth = obj.thickness;
			if (typeof ctx.setLineDash !== 'function')
				ctx.setLineDash = function () {};
			if (typeof obj.dash !== 'undefined')
				ctx.setLineDash(obj.dash);
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';
			ctx.stroke();
			ctx.setLineDash([]);
		}
		if (boolean(draw.drawArcCenter, false) == true) {
			ctx.fillStyle = obj.color;
			ctx.beginPath();
			ctx.moveTo(obj.center[0], obj.center[1]);
			ctx.arc(obj.center[0], obj.center[1], 5, 0, 2 * Math.PI);
			ctx.fill();
		}
		if (!un(path) && draw.mode === 'edit' && path.selected == true && path.obj.length == 1) {
			ctx.strokeStyle = '#000';
			ctx.lineWidth = 1;
			ctx.fillStyle = '#F00';
			ctx.beginPath();
			ctx.moveTo(obj._startPos[0] + 8, obj._startPos[1]);
			ctx.arc(obj._startPos[0], obj._startPos[1], 8, 0, 2 * Math.PI);
			ctx.moveTo(obj._finPos[0] + 8, obj._finPos[1]);
			ctx.arc(obj._finPos[0], obj._finPos[1], 8, 0, 2 * Math.PI);
			ctx.moveTo(obj.center[0] + 8, obj.center[1]);
			ctx.arc(obj.center[0], obj.center[1], 8, 0, 2 * Math.PI);
			ctx.fill();
			ctx.stroke();
		}
		ctx.restore();
	},
	getRect: function (obj) {
		var pos1 = [obj.center[0] + obj.radius * Math.cos(obj.startAngle), obj.center[1] + obj.radius * Math.sin(obj.startAngle)];
		var pos2 = [obj.center[0] + obj.radius * Math.cos(obj.finAngle), obj.center[1] + obj.radius * Math.sin(obj.finAngle)];
		obj._left = Math.min(pos1[0], pos2[0]);
		obj._right = Math.max(pos1[0], pos2[0]);
		obj._top = Math.min(pos1[1], pos2[1]);
		obj._bottom = Math.max(pos1[1], pos2[1]);
		if (doesArcIncludeAngle(obj, 0) == true)
			obj._right = obj.center[0] + obj.radius;
		if (doesArcIncludeAngle(obj, 0.5 * Math.PI) == true)
			obj._bottom = obj.center[1] + obj.radius;
		if (doesArcIncludeAngle(obj, Math.PI) == true)
			obj._left = obj.center[0] - obj.radius;
		if (doesArcIncludeAngle(obj, 1.5 * Math.PI) == true)
			obj._top = obj.center[1] - obj.radius;
		obj._width = obj._right - obj._left;
		obj._height = obj._bottom - obj._top;
		return [obj._left, obj._top, obj._width, obj._height];
	},
	getCursorPositionsSelected: function (obj, pathNum) {
		return [{
				shape: 'circle',
				dims: [obj._startPos[0], obj._startPos[1], 10],
				cursor: draw.cursors.pointer,
				func: draw.segment.startPosDrag,
				obj: obj,
				angle: 'startAngle',
				pathNum: pathNum
			}, {
				shape: 'circle',
				dims: [obj._finPos[0], obj._finPos[1], 10],
				cursor: draw.cursors.pointer,
				func: draw.segment.startPosDrag,
				obj: obj,
				angle: 'finAngle',
				pathNum: pathNum
			}, {
				shape: 'circle',
				dims: [obj.center[0], obj.center[1], 10],
				cursor: draw.cursors.pointer,
				func: draw.segment.startPosDrag,
				obj: obj,
				angle: 'center',
				pathNum: pathNum
			}
		];
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.center[0] += dl;
		obj.center[1] += dt;
		obj.radius += dw;
	},

	getSnapPos: function (obj) {
		return [{
				type: 'point',
				pos: obj.center
			}, {
				type: 'point',
				pos: obj._startPos
			}, {
				type: 'point',
				pos: obj._finPos
			}
		];
	},
	setLineWidth: function (obj, lineWidth) {
		obj.thickness = lineWidth;
	},
	setLineColor: function (obj, color) {
		obj.color = color;
	},
	setFillColor: function (obj, color) {
		obj.fillColor = color;
	},
	getLineWidth: function (obj) {
		return obj.thickness;
	},
	getLineColor: function (obj) {
		return obj.color;
	},
	getFillColor: function (obj) {
		return obj.fillColor;
	},

	startPosDrag: function () {
		changeDrawMode('segmentPosDrag');
		draw.drag = draw.currCursor;
		draw.animate(draw.segment.posMove,draw.segment.posStop,drawCanvasPaths);
		//addListenerMove(window, draw.segment.posMove);
		//addListenerEnd(window, draw.segment.posStop);
	},
	posMove: function (e) {
		updateMouse(e);
		var pos = clone(draw.mouse);
		var drag = draw.drag;
		var obj = drag.obj;
		if (drag.angle == 'startAngle') {
			obj.startAngle = getAngleTwoPoints(obj.center, pos);
		} else if (drag.angle == 'finAngle') {
			obj.finAngle = getAngleTwoPoints(obj.center, pos);
		} else if (drag.angle == 'center') {
			if (snapToObj2On == true)
				pos = snapToObj2(pos);
			obj.center = pos;
		}
		updateBorder(draw.path[drag.pathNum]);
		//drawSelectedPaths();
		//drawSelectCanvas();
	},
	posStop: function (e) {
		//removeListenerMove(window, draw.segment.posMove);
		//removeListenerEnd(window, draw.segment.posStop);
		changeDrawMode();
	},

	drawButton: function (ctx, size) {
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 0.02 * size;
		ctx.beginPath();

		draw.segment.draw(ctx, {
			type: 'segment',
			center: [0.5 * size, 0.5 * size],
			radius: 0.3 * size,
			startAngle: 4,
			finAngle: 0,
			color: '#000',
			thickness: 0.02 * size,
			fillColor: 'none',
			clockwise: false
		});
	},
	scale: function (obj, sf, center) {
		if (un(center))
			var center = obj.center;
		obj.center[0] = center[0] + sf * (obj.center[0] - center[0]);
		obj.center[1] = center[1] + sf * (obj.center[1] - center[1]);
		if (!un(obj.radius))
			obj.radius *= sf;
		if (!un(obj.lineWidth))
			obj.lineWidth *= sf;
	}
}
draw.pen = {
	add: function () {
		changeDrawMode('pen');
	},
	draw: function (ctx, obj, path) {
		ctx.strokeStyle = obj.color;
		ctx.lineWidth = obj.thickness;
		if (typeof ctx.setLineDash !== 'function')
			ctx.setLineDash = function () {};
		if (typeof obj.dash !== 'undefined')
			ctx.setLineDash(obj.dash);
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		var pos = [];
		for (var p = 0; p < obj.pos.length; p++) {
			pos[p] = [];
			pos[p][0] = roundToNearest(obj.pos[p][0], 0.01);
			pos[p][1] = roundToNearest(obj.pos[p][1], 0.01);
		}
		if (pos.length > 2) {
			ctx.beginPath();
			ctx.moveTo(pos[0][0], pos[0][1]);
			for (var p = 1; p < pos.length - 2; p++) {
				ctx.quadraticCurveTo(pos[p][0], pos[p][1], (pos[p][0] + pos[p + 1][0]) / 2, (pos[p][1] + pos[p + 1][1]) / 2);
			}
			if (pos.length > p + 1)
				ctx.quadraticCurveTo(pos[p][0], pos[p][1], pos[p + 1][0], pos[p + 1][1]);
			ctx.stroke();
		} else if (pos.length == 2) {
			ctx.beginPath();
			ctx.moveTo(pos[0][0], pos[0][1]);
			ctx.lineTo(pos[1][0], pos[1][1]);
			ctx.stroke();
		} else if (pos.length == 1) {
			ctx.beginPath();
			ctx.arc(pos[0][0], pos[0][1], ctx.lineWidth / 2, 0, 2 * Math.PI);
			ctx.fillStyle = ctx.strokeStyle;
			ctx.fill();
		}

		ctx.setLineDash([]);
	},
	getRect: function (obj) {
		obj._left = obj.pos[0][0];
		obj._top = obj.pos[0][1];
		obj._right = obj.pos[0][0];
		obj._bottom = obj.pos[0][1];
		for (var j = 1; j < obj.pos.length; j++) {
			obj._left = Math.min(obj._left, obj.pos[j][0]);
			obj._top = Math.min(obj._top, obj.pos[j][1]);
			obj._right = Math.max(obj._right, obj.pos[j][0]);
			obj._bottom = Math.max(obj._bottom, obj.pos[j][1]);
		}
		obj._width = obj._right - obj._left;
		obj._height = obj._bottom - obj._top;
		return [obj._left, obj._top, obj._width, obj._height];
	},
	drawButton: function (ctx, size) {
		ctx.fillStyle = '#000';
		ctx.translate(0.5 * size, 0.5 * size);
		ctx.rotate(Math.PI / 4);
		ctx.fillRect(-5, -11, 10, 20);
		ctx.fillRect(-5, -18, 10, 5);
		ctx.beginPath();
		ctx.moveTo(-5, 11);
		ctx.lineTo(0, 18);
		ctx.lineTo(5, 11);
		ctx.lineTo(-5, 11);
		ctx.fill();
		ctx.rotate(-Math.PI / 4);
		ctx.translate(-0.5 * size, -0.5 * size);
	},
	scale: function (obj, sf, center) {
		if (un(center))
			var center = obj.pos[0];
		for (var p = 0; p < obj.pos.length; p++) {
			obj.pos[p][0] = center[0] + sf * (obj.pos[p][0] - center[0]);
			obj.pos[p][1] = center[1] + sf * (obj.pos[p][1] - center[1]);
		}
		if (!un(obj.thickness))
			obj.thickness *= sf;
	}
}
draw.line = {
	add: function () {
		changeDrawMode('line');
	},
	draw: function (ctx, obj, path) {
		if (un(obj.finPos) || typeof obj.finPos[0] !== 'number' || typeof obj.finPos[1] !== 'number')
			return;
		ctx.strokeStyle = obj.color;
		ctx.lineWidth = obj.thickness;
		if (typeof ctx.setLineDash !== 'function')
			ctx.setLineDash = function () {};
		if (typeof obj.dash !== 'undefined')
			ctx.setLineDash(obj.dash);
		var lineCap = !un(obj.lineCap) ? obj.lineCap : 'round';
		ctx.lineCap = lineCap;
		ctx.lineJoin = lineCap;
		ctx.beginPath();
		ctx.moveTo(obj.startPos[0], obj.startPos[1]);
		ctx.lineTo(obj.finPos[0], obj.finPos[1]);
		ctx.stroke();

		if (obj.endStart == 'open') {
			drawArrow({
				context: ctx,
				startX: obj.finPos[0],
				startY: obj.finPos[1],
				finX: obj.startPos[0],
				finY: obj.startPos[1],
				arrowLength: obj.endStartSize,
				color: ctx.strokeStyle,
				lineWidth: ctx.lineWidth,
				arrowLineWidth: ctx.lineWidth
			});
		}
		if (obj.endStart == 'closed') {
			drawArrow({
				context: ctx,
				startX: obj.finPos[0],
				startY: obj.finPos[1],
				finX: obj.startPos[0],
				finY: obj.startPos[1],
				arrowLength: obj.endStartSize,
				color: ctx.strokeStyle,
				lineWidth: ctx.lineWidth,
				arrowLineWidth: ctx.lineWidth,
				fillArrow: true
			});
		}

		if (obj.endMid == 'dash') {
			drawDash(ctx, obj.startPos[0], obj.startPos[1], obj.finPos[0], obj.finPos[1], 8);
		}
		if (obj.endMid == 'dash2') {
			drawDoubleDash(ctx, obj.startPos[0], obj.startPos[1], obj.finPos[0], obj.finPos[1], 8);
		}
		if (obj.endMid == 'open') {
			drawParallelArrow({
				context: ctx,
				startX: obj.startPos[0],
				startY: obj.startPos[1],
				finX: obj.finPos[0],
				finY: obj.finPos[1],
				arrowLength: obj.endMidSize,
				color: ctx.strokeStyle,
				lineWidth: ctx.lineWidth
			});
		}
		if (obj.endMid == 'open2') {
			drawParallelArrow({
				context: ctx,
				startX: obj.startPos[0],
				startY: obj.startPos[1],
				finX: obj.finPos[0],
				finY: obj.finPos[1],
				arrowLength: obj.endMidSize,
				color: ctx.strokeStyle,
				lineWidth: ctx.lineWidth,
				numOfArrows: 2
			});
		}

		if (obj.endFin == 'open') {
			drawArrow({
				context: ctx,
				startX: obj.startPos[0],
				startY: obj.startPos[1],
				finX: obj.finPos[0],
				finY: obj.finPos[1],
				arrowLength: obj.endFinSize,
				color: ctx.strokeStyle,
				lineWidth: ctx.lineWidth,
				arrowLineWidth: ctx.lineWidth
			});
		}
		if (obj.endFin == 'closed') {
			drawArrow({
				context: ctx,
				startX: obj.startPos[0],
				startY: obj.startPos[1],
				finX: obj.finPos[0],
				finY: obj.finPos[1],
				arrowLength: obj.endFinSize,
				color: ctx.strokeStyle,
				lineWidth: ctx.lineWidth,
				arrowLineWidth: ctx.lineWidth,
				fillArrow: true
			});
		}
		ctx.setLineDash([]);

		if (draw.mode === 'edit' && path.obj.length == 1 && path.selected == true) {
			ctx.save();
			ctx.lineWidth = 1;
			ctx.strokeStyle = '#000';
			ctx.fillStyle = '#F00';
			ctx.beginPath();
			ctx.arc(obj.startPos[0], obj.startPos[1], 8, 0, 2 * Math.PI);
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(obj.finPos[0], obj.finPos[1], 8, 0, 2 * Math.PI);
			ctx.fill();
			ctx.stroke();
			ctx.restore();
		}

		return [
			Math.min(obj.startPos[0], obj.finPos[0]) - 10,
			Math.min(obj.startPos[1], obj.finPos[1]) - 10,
			Math.abs(obj.startPos[0] - obj.finPos[0]) + 20,
			Math.abs(obj.startPos[1] - obj.finPos[1]) + 20,
		];
	},
	getRect: function (obj) {
		if (!un(obj.startPos) && !un(obj.finPos)) {
			obj._left = Math.min(obj.startPos[0], obj.finPos[0]);
			obj._top = Math.min(obj.startPos[1], obj.finPos[1]);
			obj._width = Math.max(obj.startPos[0], obj.finPos[0]) - obj._left;
			obj._height = Math.max(obj.startPos[1], obj.finPos[1]) - obj._top;
			return [obj._left, obj._top, obj._width, obj._height];
		}
	},
	getCursorPositionsSelected: function (obj, pathNum) {
		var pos = [];
		pos.push({
			shape: 'circle',
			dims: [obj.startPos[0], obj.startPos[1], 8],
			cursor: draw.cursors.pointer,
			func: draw.line.startDragStartPos,
			pathNum: pathNum
		});
		pos.push({
			shape: 'circle',
			dims: [obj.finPos[0], obj.finPos[1], 8],
			cursor: draw.cursors.pointer,
			func: draw.line.startDragFinPos,
			pathNum: pathNum
		});
		return pos;
	},
	startDragStartPos: function () {
		changeDrawMode('lineStart');
		draw.currPathNum = draw.currCursor.pathNum;
		updateSnapPoints(); // update intersection points
		draw.animate(draw.line.posMove,draw.line.posStop,drawCanvasPaths);
		//addListenerMove(window, draw.line.posMove);
		//addListenerEnd(window, draw.line.posStop);
	},
	startDragFinPos: function () {
		changeDrawMode('lineFin');
		draw.currPathNum = draw.currCursor.pathNum;
		updateSnapPoints(); // update intersection points
		draw.animate(draw.line.posMove,draw.line.posStop,drawCanvasPaths);
		//addListenerMove(window, draw.line.posMove);
		//addListenerEnd(window, draw.line.posStop);
	},
	posMove: function (e) {
		updateMouse(e);
		var x = draw.mouse[0];
		var y = draw.mouse[1];
		var pathNum = draw.currPathNum;
		var obj = draw.path[pathNum].obj[0];
		if (draw.drawMode == 'lineStart') {
			if (shiftOn) {
				if (Math.abs(obj.finPos[0] - x) < Math.abs(obj.finPos[1] - y)) {
					obj.startPos = [obj.finPos[0], y];
				} else {
					obj.startPos = [x, obj.finPos[1]];
				}
			} else if (snapToObj2On || draw.snapLinesTogether) {
				obj.startPos = snapToObj2([x, y], pathNum);
			} else {
				obj.startPos = [x, y];
			}
		} else if (draw.drawMode == 'lineFin' || draw.drawMode == 'line') {
			if (shiftOn) {
				if (Math.abs(obj.startPos[0] - x) < Math.abs(obj.startPos[1] - y)) {
					obj.finPos = [obj.startPos[0], y];
				} else {
					obj.finPos = [x, obj.startPos[1]];
				}
			} else if (snapToObj2On || draw.snapLinesTogether) {
				obj.finPos = snapToObj2([x, y], pathNum);
			} else {
				obj.finPos = [x, y];
			}
		}
		updateBorder(draw.path[pathNum]);
		//drawSelectedPaths();
		//drawSelectCanvas();
		//drawSelectCanvas2();
	},
	posStop: function (e) {
		var pathNum = draw.currPathNum;
		var obj = draw.path[pathNum].obj[0];
		updateBorder(draw.path[pathNum]);
		drawCanvasPaths();
		//removeListenerMove(window, draw.line.posMove);
		//removeListenerEnd(window, draw.line.posStop);
		changeDrawMode();
	},
	drawButton: function (ctx, size) {
		ctx.strokeStyle = '#000';
		ctx.lineWidth = size * 0.04;
		ctx.beginPath();
		ctx.arc(0.2 * size, 0.4 * size, 0.06 * size, 0, 2 * Math.PI);
		ctx.fill();
		ctx.beginPath();
		ctx.moveTo(0.2 * size, 0.4 * size);
		ctx.lineTo(0.8 * size, 0.6 * size);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(0.8 * size, 0.6 * size, 0.06 * size, 0, 2 * Math.PI);
		ctx.fill();
	},
	scale: function (obj, sf, center) {
		if (un(center))
			var center = obj.startPos;
		obj.startPos[0] = center[0] + sf * (obj.startPos[0] - center[0]);
		obj.startPos[1] = center[1] + sf * (obj.startPos[1] - center[1]);
		obj.finPos[0] = center[0] + sf * (obj.finPos[0] - center[0]);
		obj.finPos[1] = center[1] + sf * (obj.finPos[1] - center[1]);
		if (!un(obj.thickness))
			obj.thickness *= sf;
		if (!un(obj.endStartSize))
			obj.endStartSize *= sf;
		if (!un(obj.endMidSize))
			obj.endMidSize *= sf;
		if (!un(obj.endFinSize))
			obj.endFinSize *= sf;
		if (!un(obj.dash)) {
			if (!un(obj.dash[0]))
				obj.dash[0] *= sf;
			if (!un(obj.dash[1]))
				obj.dash[1] *= sf;
		}
	},
	getControlPanel: function (obj) {
		var elements = [{
				name: 'Style',
				type: 'style'
			}, {
				name: 'Dash',
				type: 'increment',
				increment: function (obj, value) {
					if (un(obj.dash))
						obj.dash = [0, 0];
					var val = Math.max(0, Math.min(obj.dash[0] + value * 5, 25));
					if (val == 0) {
						delete obj.dash;
					} else {
						obj.dash = [val, val];
					}
				}
			}, {
				name: 'Line Decoration',
				type: 'lineDec',
				obj: obj
			}
		];
		return {
			obj: obj,
			elements: elements
		};
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.startPos[0] += dl;
		obj.startPos[1] += dt;
		obj.finPos[0] += dl;
		obj.finPos[1] += dt;
	}
}
draw.curve = {
	add: function (x, y, r) {
		deselectAllPaths(false);
		changeDrawMode();
		var pos = getRelPos([250, 150]);
		if (un(x))
			x = pos[0];
		if (un(y))
			y = pos[1];
		if (un(r))
			r = 100;
		draw.path.push({
			obj: [{
					type: 'curve',
					thickness: draw.thickness,
					startPos: [x - r * 0.7, y - 0.5 * r],
					finPos: [x + r * 0.7, y - 0.5 * r],
					controlPos: [x, y + r],
					color: draw.color,
				}
			],
			selected: true,
			trigger: []
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
	},
	draw: function (ctx, obj, path) {
		ctx.strokeStyle = obj.color;
		ctx.lineWidth = obj.thickness;
		if (typeof ctx.setLineDash !== 'function')
			ctx.setLineDash = function () {};
		if (typeof obj.dash !== 'undefined')
			ctx.setLineDash(obj.dash);
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		ctx.beginPath();
		ctx.moveTo(obj.startPos[0], obj.startPos[1]);
		ctx.quadraticCurveTo(obj.controlPos[0], obj.controlPos[1], obj.finPos[0], obj.finPos[1]);
		ctx.stroke();

		obj.mid1 = midpoint(obj.startPos[0], obj.startPos[1], obj.controlPos[0], obj.controlPos[1]);
		obj.mid2 = midpoint(obj.finPos[0], obj.finPos[1], obj.controlPos[0], obj.controlPos[1]);
		obj.vertex = midpoint(obj.mid1[0], obj.mid1[1], obj.mid2[0], obj.mid2[1]);

		obj.points = getBezierPoints([obj.startPos[0], obj.startPos[1]], [obj.controlPos[0], obj.controlPos[1]], [obj.finPos[0], obj.finPos[1]], 30);

		if (obj.endStart == 'open') {
			drawArrow({
				context: ctx,
				startX: obj.controlPos[0],
				startY: obj.controlPos[1],
				finX: obj.startPos[0],
				finY: obj.startPos[1],
				arrowLength: obj.endStartSize,
				color: ctx.strokeStyle,
				lineWidth: 0,
				arrowLineWidth: ctx.lineWidth,
				showLine: false
			});
		}
		if (obj.endStart == 'closed') {
			drawArrow({
				context: ctx,
				startX: obj.controlPos[0],
				startY: obj.controlPos[1],
				finX: obj.startPos[0],
				finY: obj.startPos[1],
				arrowLength: obj.endStartSize,
				color: ctx.strokeStyle,
				lineWidth: 0,
				arrowLineWidth: ctx.lineWidth,
				fillArrow: true,
				showLine: false
			});
		}

		if (obj.endMid == 'open') {
			drawParallelArrow({
				context: ctx,
				startX: obj.mid1[0],
				startY: obj.mid1[1],
				finX: obj.mid2[0],
				finY: obj.mid2[1],
				arrowLength: obj.endMidSize,
				lineWidth: ctx.lineWidth
			});
		}

		if (obj.endFin == 'open') {
			drawArrow({
				context: ctx,
				startX: obj.controlPos[0],
				startY: obj.controlPos[1],
				finX: obj.finPos[0],
				finY: obj.finPos[1],
				arrowLength: obj.endFinSize,
				color: ctx.strokeStyle,
				lineWidth: 0,
				arrowLineWidth: ctx.lineWidth,
				showLine: false
			});
		}
		if (obj.endFin == 'closed') {
			drawArrow({
				context: ctx,
				startX: obj.controlPos[0],
				startY: obj.controlPos[1],
				finX: obj.finPos[0],
				finY: obj.finPos[1],
				arrowLength: obj.endFinSize,
				color: ctx.strokeStyle,
				lineWidth: 0,
				arrowLineWidth: ctx.lineWidth,
				fillArrow: true,
				showLine: false
			});
		}
		ctx.setLineDash([]);

		if (draw.mode === 'edit' && path.obj.length == 1 && path.selected == true) { // if selected
			ctx.save();
			ctx.lineWidth = 1;
			ctx.strokeStyle = '#000';
			ctx.fillStyle = '#F00';
			ctx.beginPath();
			ctx.arc(obj.startPos[0], obj.startPos[1], 8, 0, 2 * Math.PI);
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(obj.finPos[0], obj.finPos[1], 8, 0, 2 * Math.PI);
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(obj.controlPos[0], obj.controlPos[1], 8, 0, 2 * Math.PI);
			ctx.fill();
			ctx.stroke();
			ctx.restore();
		}
	},
	getRect: function (obj) {
		obj._left = Math.min(obj.startPos[0], obj.finPos[0], obj.controlPos[0]);
		obj._top = Math.min(obj.startPos[1], obj.finPos[1], obj.controlPos[1]);
		obj._width = Math.max(obj.startPos[0], obj.finPos[0], obj.controlPos[0]) - obj._left;
		obj._height = Math.max(obj.startPos[1], obj.finPos[1], obj.controlPos[1]) - obj._top;
		return [obj._left, obj._top, obj._width, obj._height];
	},
	getCursorPositionsSelected: function (obj, pathNum) {
		var pos = [];
		pos.push({
			shape: 'circle',
			dims: [obj.startPos[0], obj.startPos[1], 8],
			cursor: draw.cursors.pointer,
			func: draw.curve.startPosStartDrag,
			pathNum: pathNum
		});
		pos.push({
			shape: 'circle',
			dims: [obj.finPos[0], obj.finPos[1], 8],
			cursor: draw.cursors.pointer,
			func: draw.curve.finPosStartDrag,
			pathNum: pathNum
		});
		pos.push({
			shape: 'circle',
			dims: [obj.controlPos[0], obj.controlPos[1], 8],
			cursor: draw.cursors.pointer,
			func: draw.curve.controlPosStartDrag,
			pathNum: pathNum
		});
		return pos;
	},
	startPosStartDrag: function () {
		changeDrawMode('curveStart');
		draw.currPathNum = draw.currCursor.pathNum;
		updateSnapPoints(); // update intersection points
		draw.animate(draw.curve.posMove,draw.curve.posStop,drawCanvasPaths);
		//addListenerMove(window, draw.curve.posMove);
		//addListenerEnd(window, draw.curve.posStop);
	},
	finPosStartDrag: function () {
		changeDrawMode('curveFin');
		draw.currPathNum = draw.currCursor.pathNum;
		updateSnapPoints(); // update intersection points
		draw.animate(draw.curve.posMove,draw.curve.posStop,drawCanvasPaths);
		//addListenerMove(window, draw.curve.posMove);
		//addListenerEnd(window, draw.curve.posStop);
	},
	controlPosStartDrag: function () {
		changeDrawMode('curveControl');
		draw.currPathNum = draw.currCursor.pathNum;
		updateSnapPoints(); // update intersection points
		draw.animate(draw.curve.posMove,draw.curve.posStop,drawCanvasPaths);
		//addListenerMove(window, draw.curve.posMove);
		//addListenerEnd(window, draw.curve.posStop);
	},
	posMove: function (e) {
		updateMouse(e);
		var x = draw.mouse[0];
		var y = draw.mouse[1];
		var pathNum = draw.currPathNum;
		var obj = draw.path[pathNum].obj[0];

		var pos = [x, y];
		if (snapToObj2On || draw.snapLinesTogether) {
			var pos = snapToObj2([x, y], pathNum);
		}

		if (draw.drawMode == 'curveStart' || draw.drawMode == 'curve2Start') {
			obj.startPos[0] = pos[0];
			obj.startPos[1] = pos[1];
		} else if (draw.drawMode == 'curveFin' || draw.drawMode == 'curve2Fin') {
			obj.finPos[0] = pos[0];
			obj.finPos[1] = pos[1];
		} else if (draw.drawMode == 'curveControl') {
			obj.controlPos[0] = pos[0];
			obj.controlPos[1] = pos[1];
		} else if (draw.drawMode == 'curve2Control1') {
			obj.controlPos1[0] = pos[0];
			obj.controlPos1[1] = pos[1];
		} else if (draw.drawMode == 'curve2Control2') {
			obj.controlPos2[0] = pos[0];
			obj.controlPos2[1] = pos[1];
		}
		updateBorder(draw.path[pathNum]);
		//drawCanvasPaths();
	},
	posStop: function (e) {
		var pathNum = draw.currPathNum;
		var obj = draw.path[pathNum].obj[0];
		//removeListenerMove(window, draw.curve.posMove);
		//removeListenerEnd(window, draw.curve.posStop);
		changeDrawMode();
	},
	drawButton: function (ctx, size) {
		ctx.strokeStyle = '#000';
		ctx.lineWidth = size * 0.04;
		var p1 = [0.2 * size, 0.2 * size];
		var p2 = [0.8 * size, 0.2 * size];
		var c = [0.3 * size, 0.7 * size];
		ctx.beginPath();
		ctx.moveTo(p1[0], p1[1]);
		ctx.quadraticCurveTo(c[0], c[1], p2[0], p2[1]);
		ctx.stroke();
		ctx.beginPath();
		ctx.strokeStyle = '#666';
		ctx.lineWidth = size * 0.01;
		ctx.setLineDash([size * 0.08, size * 0.08]);
		ctx.beginPath();
		ctx.moveTo(p1[0], p1[1]);
		ctx.lineTo(c[0], c[1]);
		ctx.lineTo(p2[0], p2[1]);
		ctx.stroke();
		ctx.setLineDash([]);
		ctx.beginPath();
		ctx.fillStyle = '#F00';
		ctx.arc(c[0], c[1], size * 0.04, 0, 2 * Math.PI);
		ctx.fill();
	},
	scale: function (obj, sf, center) {
		if (un(center))
			var center = obj.startPos;
		obj.startPos[0] = center[0] + sf * (obj.startPos[0] - center[0]);
		obj.startPos[1] = center[1] + sf * (obj.startPos[1] - center[1]);
		obj.finPos[0] = center[0] + sf * (obj.finPos[0] - center[0]);
		obj.finPos[1] = center[1] + sf * (obj.finPos[1] - center[1]);
		obj.controlPos[0] = center[0] + sf * (obj.controlPos[0] - center[0]);
		obj.controlPos[1] = center[1] + sf * (obj.controlPos[1] - center[1]);
		if (!un(obj.thickness))
			obj.thickness *= sf;
		if (!un(obj.dash)) {
			if (!un(obj.dash[0]))
				obj.dash[0] *= sf;
			if (!un(obj.dash[1]))
				obj.dash[1] *= sf;
		}
	},
	getControlPanel: function (obj) {
		var elements = [{
				name: 'Style',
				type: 'style'
			}, {
				name: 'Arrows',
				type: 'curveDec',
				obj: obj
			}
		];
		return {
			obj: obj,
			elements: elements
		};
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.startPos[0] += dl;
		obj.startPos[1] += dt;
		obj.finPos[0] += dl;
		obj.finPos[1] += dt;
		obj.controlPos[0] += dl;
		obj.controlPos[1] += dt;
	}
}
draw.curve2 = {
	add: function (x, y, r) {
		deselectAllPaths(false);
		changeDrawMode();
		var pos = getRelPos([250, 150]);
		if (un(x))
			x = pos[0];
		if (un(y))
			y = pos[1];
		if (un(r))
			r = 100;
		draw.path.push({
			obj: [{
					type: 'curve2',
					thickness: 2,
					startPos: [x - r * 0.7, y - 0.5 * r],
					finPos: [x + r * 0.7, y - 0.5 * r],
					controlPos1: [x - r * 0.25, y + r],
					controlPos2: [x + r * 0.25, y + r],
					color: draw.color,
				}
			],
			selected: true,
			trigger: []
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
	},
	draw: function (ctx, obj, path) {
		ctx.strokeStyle = obj.color;
		ctx.lineWidth = obj.thickness;
		if (typeof ctx.setLineDash !== 'function')
			ctx.setLineDash = function () {};
		if (typeof obj.dash !== 'undefined')
			ctx.setLineDash(obj.dash);
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		ctx.beginPath();
		ctx.moveTo(obj.startPos[0], obj.startPos[1]);
		ctx.bezierCurveTo(obj.controlPos1[0], obj.controlPos1[1], obj.controlPos2[0], obj.controlPos2[1], obj.finPos[0], obj.finPos[1]);
		ctx.stroke();
		ctx.setLineDash([]);

		if (draw.mode === 'edit' && path.obj.length == 1 && path.selected == true) { // if selected
			ctx.save();
			ctx.lineWidth = 1;
			ctx.strokeStyle = '#000';
			ctx.fillStyle = '#F00';
			ctx.beginPath();
			ctx.arc(obj.startPos[0], obj.startPos[1], 8, 0, 2 * Math.PI);
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(obj.finPos[0], obj.finPos[1], 8, 0, 2 * Math.PI);
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(obj.controlPos1[0], obj.controlPos1[1], 8, 0, 2 * Math.PI);
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(obj.controlPos2[0], obj.controlPos2[1], 8, 0, 2 * Math.PI);
			ctx.fill();
			ctx.stroke();
			ctx.restore();
		}
	},
	getRect: function (obj) {
		obj._left = Math.min(obj.startPos[0], obj.finPos[0], obj.controlPos1[0], obj.controlPos2[0]);
		obj._top = Math.min(obj.startPos[1], obj.finPos[1], obj.controlPos1[1], obj.controlPos2[1]);
		obj._width = Math.max(obj.startPos[0], obj.finPos[0], obj.controlPos1[0], obj.controlPos2[0]) - obj._left;
		obj._height = Math.max(obj.startPos[1], obj.finPos[1], obj.controlPos1[1], obj.controlPos2[1]) - obj._top;
		return [obj._left, obj._top, obj._width, obj._height];
	},
	getCursorPositionsSelected: function (obj, pathNum) {
		var pos = [];
		pos.push({
			shape: 'circle',
			dims: [obj.startPos[0], obj.startPos[1], 8],
			cursor: draw.cursors.pointer,
			func: draw.curve2.startPosStartDrag,
			pathNum: pathNum
		});
		pos.push({
			shape: 'circle',
			dims: [obj.finPos[0], obj.finPos[1], 8],
			cursor: draw.cursors.pointer,
			func: draw.curve2.finPosStartDrag,
			pathNum: pathNum
		});
		pos.push({
			shape: 'circle',
			dims: [obj.controlPos1[0], obj.controlPos1[1], 8],
			cursor: draw.cursors.pointer,
			func: draw.curve2.controlPos1StartDrag,
			pathNum: pathNum
		});
		pos.push({
			shape: 'circle',
			dims: [obj.controlPos2[0], obj.controlPos2[1], 8],
			cursor: draw.cursors.pointer,
			func: draw.curve2.controlPos2StartDrag,
			pathNum: pathNum
		});
		return pos;
	},
	startPosStartDrag: function () {
		changeDrawMode('curve2Start');
		draw.currPathNum = draw.currCursor.pathNum;
		draw.animate(draw.curve2.posMove,draw.curve2.posStop,drawCanvasPaths);
		//addListenerMove(window, draw.curve2.posMove);
		//addListenerEnd(window, draw.curve2.posStop);
	},
	finPosStartDrag: function () {
		changeDrawMode('curve2Fin');
		draw.currPathNum = draw.currCursor.pathNum;
		updateSnapPoints(); // update intersection points
		draw.animate(draw.curve2.posMove,draw.curve2.posStop,drawCanvasPaths);
		//addListenerMove(window, draw.curve2.posMove);
		//addListenerEnd(window, draw.curve2.posStop);
	},
	controlPos1StartDrag: function () {
		changeDrawMode('curve2Control1');
		draw.currPathNum = draw.currCursor.pathNum;
		updateSnapPoints(); // update intersection points
		draw.animate(draw.curve2.posMove,draw.curve2.posStop,drawCanvasPaths);
		//addListenerMove(window, draw.curve2.posMove);
		//addListenerEnd(window, draw.curve2.posStop);
	},
	controlPos2StartDrag: function () {
		changeDrawMode('curve2Control2');
		draw.currPathNum = draw.currCursor.pathNum;
		updateSnapPoints(); // update intersection points
		draw.animate(draw.curve2.posMove,draw.curve2.posStop,drawCanvasPaths);
		//addListenerMove(window, draw.curve2.posMove);
		//addListenerEnd(window, draw.curve2.posStop);
	},
	posMove: function (e) {
		updateMouse(e);
		var x = draw.mouse[0];
		var y = draw.mouse[1];
		var pathNum = draw.currPathNum;
		var obj = draw.path[pathNum].obj[0];

		var pos = [x, y];
		if (snapToObj2On || draw.snapLinesTogether) {
			var pos = snapToObj2([x, y], pathNum);
		}

		if (draw.drawMode == 'curveStart' || draw.drawMode == 'curve2Start') {
			obj.startPos[0] = pos[0];
			obj.startPos[1] = pos[1];
		} else if (draw.drawMode == 'curveFin' || draw.drawMode == 'curve2Fin') {
			obj.finPos[0] = pos[0];
			obj.finPos[1] = pos[1];
		} else if (draw.drawMode == 'curveControl') {
			obj.controlPos[0] = pos[0];
			obj.controlPos[1] = pos[1];
		} else if (draw.drawMode == 'curve2Control1') {
			obj.controlPos1[0] = pos[0];
			obj.controlPos1[1] = pos[1];
		} else if (draw.drawMode == 'curve2Control2') {
			obj.controlPos2[0] = pos[0];
			obj.controlPos2[1] = pos[1];
		}
		updateBorder(draw.path[pathNum]);
		//drawCanvasPaths();
	},
	posStop: function (e) {
		var pathNum = draw.currPathNum;
		var obj = draw.path[pathNum].obj[0];
		//removeListenerMove(window, draw.curve.posMove);
		//removeListenerEnd(window, draw.curve.posStop);
		changeDrawMode();
	},
	drawButton: function (ctx, size) {
		ctx.strokeStyle = '#000';
		ctx.lineWidth = size * 0.04;
		var p1 = [0.2 * size, 0.2 * size];
		var p2 = [0.8 * size, 0.2 * size];
		var c1 = [0.3 * size, 0.7 * size];
		var c2 = [0.8 * size, 0.8 * size];
		ctx.beginPath();
		ctx.moveTo(p1[0], p1[1]);
		ctx.bezierCurveTo(c1[0], c1[1], c2[0], c2[1], p2[0], p2[1]);
		ctx.stroke();
		ctx.beginPath();
		ctx.strokeStyle = '#666';
		ctx.lineWidth = size * 0.01;
		ctx.setLineDash([size * 0.08, size * 0.08]);
		ctx.beginPath();
		ctx.moveTo(p1[0], p1[1]);
		ctx.lineTo(c1[0], c1[1]);
		ctx.lineTo(c2[0], c2[1]);
		ctx.lineTo(p2[0], p2[1]);
		ctx.stroke();
		ctx.setLineDash([]);
		ctx.beginPath();
		ctx.fillStyle = '#F00';
		ctx.arc(c1[0], c1[1], size * 0.04, 0, 2 * Math.PI);
		ctx.arc(c2[0], c2[1], size * 0.04, 0, 2 * Math.PI);
		ctx.fill();
	},
	scale: function (obj, sf, center) {
		if (un(center))
			var center = obj.startPos;
		obj.startPos[0] = center[0] + sf * (obj.startPos[0] - center[0]);
		obj.startPos[1] = center[1] + sf * (obj.startPos[1] - center[1]);
		obj.finPos[0] = center[0] + sf * (obj.finPos[0] - center[0]);
		obj.finPos[1] = center[1] + sf * (obj.finPos[1] - center[1]);
		obj.controlPos1[0] = center[0] + sf * (obj.controlPos1[0] - center[0]);
		obj.controlPos1[1] = center[1] + sf * (obj.controlPos1[1] - center[1]);
		obj.controlPos2[0] = center[0] + sf * (obj.controlPos2[0] - center[0]);
		obj.controlPos2[1] = center[1] + sf * (obj.controlPos2[1] - center[1]);
		if (!un(obj.thickness))
			obj.thickness *= sf;
		if (!un(obj.dash)) {
			if (!un(obj.dash[0]))
				obj.dash[0] *= sf;
			if (!un(obj.dash[1]))
				obj.dash[1] *= sf;
		}
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.startPos[0] += dl;
		obj.startPos[1] += dt;
		obj.finPos[0] += dl;
		obj.finPos[1] += dt;
		obj.controlPos1[0] += dl;
		obj.controlPos1[1] += dt;
		obj.controlPos2[0] += dl;
		obj.controlPos2[1] += dt;
	}
}
draw.square = {
	draw: function (ctx, obj, path) {
		draw.rect.draw(ctx, obj, path);
	},
	getRect: function (obj) {
		if (!un(obj.startPos) && !un(obj.finPos)) {
			obj._left = Math.min(obj.startPos[0], obj.finPos[0]);
			obj._top = Math.min(obj.startPos[1], obj.finPos[1]);
			obj._width = Math.max(obj.startPos[0], obj.finPos[0]) - obj._left;
			obj._height = Math.max(obj.startPos[1], obj.finPos[1]) - obj._top;
			return [obj._left, obj._top, obj._width, obj._height];
		}
	},
	scale: function (obj, sf, center) {
		if (un(center))
			var center = obj.startPos;
		obj.startPos[0] = center[0] + sf * (obj.startPos[0] - center[0]);
		obj.startPos[1] = center[1] + sf * (obj.startPos[1] - center[1]);
		obj.finPos[0] = center[0] + sf * (obj.finPos[0] - center[0]);
		obj.finPos[1] = center[1] + sf * (obj.finPos[1] - center[1]);
		if (!un(obj.thickness))
			obj.thickness *= sf;
		if (!un(obj.dash)) {
			if (!un(obj.dash[0]))
				obj.dash[0] *= sf;
			if (!un(obj.dash[1]))
				obj.dash[1] *= sf;
		}
	}
}
draw.rect = {
	draw: function (ctx, obj, path) {
		if (un(obj.finPos) || obj.finPos.length == 0)
			return;
		ctx.strokeStyle = obj.color;
		ctx.lineWidth = obj.thickness;
		if (typeof ctx.setLineDash !== 'function')
			ctx.setLineDash = function () {};
		if (typeof obj.dash !== 'undefined')
			ctx.setLineDash(obj.dash);
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		if (obj.fillColor !== 'none') {
			ctx.fillStyle = obj.fillColor;
			ctx.fillRect(obj.startPos[0], obj.startPos[1], obj.finPos[0] - obj.startPos[0], obj.finPos[1] - obj.startPos[1]);
		}
		ctx.strokeRect(obj.startPos[0], obj.startPos[1], obj.finPos[0] - obj.startPos[0], obj.finPos[1] - obj.startPos[1]);
		ctx.setLineDash([]);
	},
	getRect: function (obj) {
		if (!un(obj.startPos) && !un(obj.finPos)) {
			obj._left = Math.min(obj.startPos[0], obj.finPos[0]);
			obj._top = Math.min(obj.startPos[1], obj.finPos[1]);
			obj._width = Math.max(obj.startPos[0], obj.finPos[0]) - obj._left;
			obj._height = Math.max(obj.startPos[1], obj.finPos[1]) - obj._top;
			return [obj._left, obj._top, obj._width, obj._height];
		}
	},
	scale: function (obj, sf, center) {
		if (un(center))
			var center = obj.startPos;
		obj.startPos[0] = center[0] + sf * (obj.startPos[0] - center[0]);
		obj.startPos[1] = center[1] + sf * (obj.startPos[1] - center[1]);
		obj.finPos[0] = center[0] + sf * (obj.finPos[0] - center[0]);
		obj.finPos[1] = center[1] + sf * (obj.finPos[1] - center[1]);
		if (!un(obj.thickness))
			obj.thickness *= sf;
		if (!un(obj.dash)) {
			if (!un(obj.dash[0]))
				obj.dash[0] *= sf;
			if (!un(obj.dash[1]))
				obj.dash[1] *= sf;
		}
	}
}
draw.prism = {
	resizable: true,
	add: function (n) {
		if (un(n))
			n = 4;
		deselectAllPaths(false);
		changeDrawMode();
		draw.path.push({
			obj: [{
					type: 'prism',
					center: getRelPos([300, 300]),
					radiusX: 100,
					radiusY: 100 / 3,
					tilt: 0.35,
					height: 200,
					points: n,
					color: draw.color,
					thickness: 2,
					startAngle: -Math.PI / 2
				}
			],
			selected: true,
			trigger: []
		});
		for (var p = 0; p < draw.path.length; p++)
			updateBorder(draw.path[p]);
		drawCanvasPaths();
	},
	draw: function (ctx, obj, path) {
		obj._top = [obj.center[0], obj.center[1] - (1 - obj.tilt) * obj.height];
		obj._radiusY = obj.radiusX * obj.tilt;

		obj._baseVertices = [];
		obj._topVertices = [];
		for (var p = 0; p < obj.points; p++) {
			var angle = obj.startAngle + p * (2 * Math.PI) / obj.points;
			obj._baseVertices.push([obj.center[0] + obj.radiusX * Math.cos(angle), obj.center[1] + obj._radiusY * Math.sin(angle), angle]);
			obj._topVertices.push([obj.center[0] + obj.radiusX * Math.cos(angle), obj.center[1] + obj._radiusY * Math.sin(angle) - obj.height, angle]);
		}

		for (var p = 0; p < obj.points; p++) {
			obj._baseVertices[p][3] = isPointVisible(p);
			obj._topVertices[p][3] = true;
		}
		if ((obj.points == 3 || obj.points == 4) && hitTestPolygon(obj._top, obj._baseVertices) == false) {
			var negDiff = [];
			var posDiff = [];
			for (var p = 0; p < obj._baseVertices.length; p++) {
				negDiff[p] = 7;
				posDiff[p] = 7;
				var angle = simplifyAngle(obj._baseVertices[p][2]);
				if (angle < 0.5 * Math.PI) {
					posDiff[p] = 0.5 * Math.PI + angle;
				} else if (angle < 1.5 * Math.PI) {
					negDiff[p] = 1.5 * Math.PI - angle;
				} else {
					posDiff[p] = angle - 1.5 * Math.PI;
				}
			}
			var pos = posDiff.indexOf(arrayMin(posDiff));
			var neg = negDiff.indexOf(arrayMin(negDiff));
			if (typeof pos == 'number' && pos > -1 && typeof neg == 'number' && neg > -1) {
				obj._baseVertices[pos][4] = true;
				obj._baseVertices[neg][4] = true;
			}
		}

		for (var i = 0; i < p; i++) {
			var v1 = obj._baseVertices[i];
			var v2 = obj._baseVertices[(i + 1) % p];
			if (v1[3] == false || v2[3] == false || (v1[4] == true && v2[4] == true)) {
				ctx.setLineDash([5, 5]);
			} else {
				ctx.strokeStyle = obj.color;
			}
			ctx.beginPath();
			ctx.moveTo(v1[0], v1[1]);
			ctx.lineTo(v2[0], v2[1]);
			ctx.stroke();
			ctx.setLineDash([]);
		}

		for (var i = 0; i < obj._baseVertices.length; i++) {
			var angle = simplifyAngle(obj._baseVertices[i][2]);

			ctx.lineWidth = obj.thickness;
			if (obj._baseVertices[i][3] == false) {
				ctx.setLineDash([5, 5]);
			} else {
				ctx.strokeStyle = obj.color;
			}
			ctx.beginPath();
			ctx.moveTo(obj._baseVertices[i][0], obj._baseVertices[i][1]);
			ctx.lineTo(obj._topVertices[i][0], obj._topVertices[i][1]);
			ctx.stroke();
			ctx.setLineDash([]);

			ctx.beginPath();
			ctx.moveTo(obj._topVertices[i][0], obj._topVertices[i][1]);
			ctx.lineTo(obj._topVertices[(i + 1) % p][0], obj._topVertices[(i + 1) % p][1]);
			ctx.stroke();
		}
		function isPointVisible(i) {
			var arr = [];
			for (var j = 1; j < obj._baseVertices.length; j++)
				arr.push(obj._baseVertices[(i + j) % obj._baseVertices.length]);
			for (var j = 0; j < arr.length - 1; j++) {
				if (hitTestPolygon(obj._baseVertices[i], [arr[j], arr[j + 1], obj._top]) == true)
					return false;
			}
			return true;
		}
		function simplifyAngle(angle) {
			while (angle < 0)
				angle += 2 * Math.PI;
			while (angle > 2 * Math.PI)
				angle -= 2 * Math.PI;
			return angle;
		}
	},
	getRect: function (obj) {
		obj._radiusY = obj.radiusX * obj.tilt;
		obj._top = [obj.center[0], obj.center[1] - (1 - obj.tilt) * obj.height - obj._radiusY];
		if (obj._top[1] < obj.center[1] - obj._radiusY) {
			return [obj.center[0] - obj.radiusX, obj._top[1] - obj._radiusY, obj.radiusX * 2, obj.center[1] + 2 * obj._radiusY - obj._top[1]];
		} else {
			return [obj.center[0] - obj.radiusX, obj.center[1] - obj._radiusY, obj.radiusX * 2, 2 * obj._radiusY];
		}

	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.center[0] += dl;
		obj.center[1] += dt + dh;
		obj.radiusX += dw;
		var newTotalHeight = obj.height + obj.radiusY + dh;
		obj.radiusY = obj.radiusX / 3;
		obj.height = newTotalHeight - obj.radiusY;
	},
	getButtons: function (x1, y1, x2, y2, pathNum) {
		var buttons = [];
		buttons.push({
			buttonType: 'prism-rotate',
			shape: 'rect',
			dims: [x2 - 40, y2 - 20, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.prism.rotateStart,
			pathNum: pathNum,
			draw: function (path, ctx, l, t, w, h) {
				ctx.fillStyle = colorA('#F96', 0.5);
				ctx.fillRect(l, t, w, h);
			}
		});
		buttons.push({
			buttonType: 'prism-vertices-minus',
			shape: 'rect',
			dims: [x2 - 20, y2 - 40, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.prism.verticesMinus,
			pathNum: pathNum,
			draw: function (path, ctx, l, t, w, h) {
				ctx.fillStyle = colorA('#F00', 0.5);
				ctx.fillRect(l, t, w, h);
				text({
					ctx: ctx,
					align: [0, 0],
					rect: [l, t, w, h],
					text: ['<<fontSize:14>>-']
				});
			}
		});
		buttons.push({
			buttonType: 'prism-vertices-plus',
			shape: 'rect',
			dims: [x2 - 20, y2 - 60, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.prism.verticesPlus,
			pathNum: pathNum,
			draw: function (path, ctx, l, t, w, h) {
				ctx.fillStyle = colorA('#F00', 0.5);
				ctx.fillRect(l, t, w, h);
				text({
					ctx: ctx,
					align: [0, 0],
					rect: [l, t, w, h],
					text: ['<<fontSize:14>>+']
				});
			}
		});
		buttons.push({
			buttonType: 'prism-tilt-minus',
			shape: 'rect',
			dims: [x2 - 80, y2 - 20, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.prism.tiltMinusStart,
			pathNum: pathNum,
			draw: function (path, ctx, l, t, w, h) {
				ctx.fillStyle = colorA('#393', 0.5);
				ctx.fillRect(l, t, w, h);
			}
		});
		buttons.push({
			buttonType: 'prism-tilt-plus',
			shape: 'rect',
			dims: [x2 - 60, y2 - 20, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.prism.tiltPlusStart,
			pathNum: pathNum,
			draw: function (path, ctx, l, t, w, h) {
				ctx.fillStyle = colorA('#09F', 0.5);
				ctx.fillRect(l, t, w, h);
			}
		});
		return buttons;
	},
	rotateStart: function () {
		draw.prism.rotateIntervalObj = draw.path[draw.currCursor.pathNum].obj[0];
		draw.prism.rotateInterval = setInterval(function () {
				draw.prism.rotateIntervalObj.startAngle += Math.PI / 30;
				drawCanvasPaths();
			}, 100);
		addListenerEnd(window, draw.prism.rotateStop);
	},
	rotateStop: function () {
		clearInterval(draw.prism.rotateInterval);
		delete draw.prism.rotateIntervalObj;
		removeListenerEnd(window, draw.prism.rotateStop);
	},
	verticesMinus: function () {
		var obj = draw.path[draw.currCursor.pathNum].obj[0];
		if (obj.points > 3)
			obj.points--;
		drawSelectedPaths();
	},
	verticesPlus: function () {
		var obj = draw.path[draw.currCursor.pathNum].obj[0];
		obj.points++;
		drawSelectedPaths();
	},
	drawButton: function (ctx, size) {
		ctx.beginPath();
		draw.prism.draw(ctx, {
			center: [0.5 * size, 0.7 * size],
			radiusX: 0.3 * size,
			radiusY: 0.1 * size,
			height: 0.5 * size,
			points: 5,
			color: '#000',
			thickness: 0.02 * size,
			startAngle: -Math.PI / 8
		});
		ctx.stroke();
	},
	tiltPlusStart: function () {
		draw.prism.tiltIntervalPath = draw.path[draw.currCursor.pathNum];
		draw.prism.tiltIntervalObj = draw.path[draw.currCursor.pathNum].obj[0];
		draw.prism.tiltInterval = setInterval(function () {
				var obj = draw.prism.tiltIntervalObj;
				if (un(obj.tilt))
					obj.tilt = obj.radiusY / obj.radiusX;
				if (obj.tilt < 1) {
					obj.tilt = Math.min(obj.tilt + 0.05, 1);
					updateBorder(draw.prism.tiltIntervalPath);
					drawCanvasPaths();
				} else {
					draw.prism.tiltStop();
				}
				drawCanvasPaths();
			}, 100);
		addListenerEnd(window, draw.prism.tiltStop);
	},
	tiltMinusStart: function () {
		draw.prism.tiltIntervalPath = draw.path[draw.currCursor.pathNum];
		draw.prism.tiltIntervalObj = draw.path[draw.currCursor.pathNum].obj[0];
		draw.prism.tiltInterval = setInterval(function () {
				var obj = draw.prism.tiltIntervalObj;
				if (un(obj.tilt))
					obj.tilt = obj.radiusY / obj.radiusX;
				if (obj.tilt > 0) {
					obj.tilt = Math.max(obj.tilt - 0.05, 0);
					updateBorder(draw.prism.tiltIntervalPath);
					drawCanvasPaths();
				} else {
					draw.prism.tiltStop();
				}
			}, 100);
		addListenerEnd(window, draw.prism.tiltStop);
	},
	tiltStop: function () {
		clearInterval(draw.prism.tiltInterval);
		delete draw.prism.tiltIntervalObj;
		delete draw.prism.tiltIntervalPath;
		removeListenerEnd(window, draw.prism.tiltStop);
	},
	altDragMove: function (obj, dx, dy) {
		obj.tilt = Math.min(1, Math.max(0, obj.tilt + dy * 0.005));
		obj.startAngle -= 0.01 * dx;
		while (obj.startAngle < 0)
			obj.startAngle += 2 * Math.PI;
		while (obj.startAngle > 2 * Math.PI)
			obj.startAngle -= 2 * Math.PI;
	},
	scale: function (obj, sf, center) {
		if (un(center))
			var center = obj.center;
		obj.center[0] = center[0] + sf * (obj.center[0] - center[0]);
		obj.center[1] = center[1] + sf * (obj.center[1] - center[1]);
		if (!un(obj.radiusX))
			obj.radiusX *= sf;
		if (!un(obj.radiusY))
			obj.radiusY *= sf;
		if (!un(obj.height))
			obj.height *= sf;
		if (!un(obj.thickness))
			obj.thickness *= sf;
		if (!un(obj.dash)) {
			if (!un(obj.dash[0]))
				obj.dash[0] *= sf;
			if (!un(obj.dash[1]))
				obj.dash[1] *= sf;
		}
	}
};
draw.pyramid = {
	resizable: true,
	add: function (n) {
		if (un(n))
			n = 4;
		deselectAllPaths(false);
		changeDrawMode();
		draw.path.push({
			obj: [{
					type: 'pyramid',
					center: getRelPos([300, 300]),
					radiusX: 100,
					radiusY: 100 / 3,
					tilt: 0.35,
					height: 200,
					points: n,
					color: draw.color,
					thickness: draw.thickness,
					startAngle: -Math.PI / 2
				}
			],
			selected: true,
			trigger: []
		});
		for (var p = 0; p < draw.path.length; p++)
			updateBorder(draw.path[p]);
		drawCanvasPaths();
	},
	draw: function (ctx, obj, path) {
		if (!un(obj.tilt)) {
			obj._top = [obj.center[0], obj.center[1] - (1 - obj.tilt) * obj.height];
			obj._radiusY = obj.radiusX * obj.tilt;
		} else {
			obj._top = [obj.center[0], obj.center[1] - obj.height];
			obj._radiusY = obj.radiusY;
		}

		obj._baseVertices = [];
		for (var p = 0; p < obj.points; p++) {
			var angle = obj.startAngle + p * (2 * Math.PI) / obj.points;
			obj._baseVertices.push([obj.center[0] + obj.radiusX * Math.cos(angle), obj.center[1] + obj._radiusY * Math.sin(angle), angle]);
		}

		for (var p = 0; p < obj.points; p++)
			obj._baseVertices[p][3] = isPointVisible(p);

		if ((obj.points == 3 || obj.points == 4) && hitTestPolygon(obj._top, obj._baseVertices) == false) {
			var negDiff = [];
			var posDiff = [];
			for (var p = 0; p < obj._baseVertices.length; p++) {
				negDiff[p] = 7;
				posDiff[p] = 7;
				var angle = simplifyAngle(obj._baseVertices[p][2]);
				if (angle < 0.5 * Math.PI) {
					posDiff[p] = 0.5 * Math.PI + angle;
				} else if (angle < 1.5 * Math.PI) {
					negDiff[p] = 1.5 * Math.PI - angle;
				} else {
					posDiff[p] = angle - 1.5 * Math.PI;
				}
			}
			var pos = posDiff.indexOf(arrayMin(posDiff));
			var neg = negDiff.indexOf(arrayMin(negDiff));
			if (typeof pos == 'number' && pos > -1 && typeof neg == 'number' && neg > -1) {
				obj._baseVertices[pos][4] = true;
				obj._baseVertices[neg][4] = true;
			}
		}

		for (var i = 0; i < p; i++) {
			var v1 = obj._baseVertices[i];
			var v2 = obj._baseVertices[(i + 1) % p];
			if (v1[3] == false || v2[3] == false || (v1[4] == true && v2[4] == true)) {
				ctx.setLineDash([5, 5]);
			} else {
				ctx.strokeStyle = obj.color;
			}
			ctx.beginPath();
			ctx.moveTo(v1[0], v1[1]);
			ctx.lineTo(v2[0], v2[1]);
			ctx.stroke();
			ctx.setLineDash([]);
		}

		for (var i = 0; i < obj._baseVertices.length; i++) {
			var angle = simplifyAngle(obj._baseVertices[i][2]);

			ctx.lineWidth = obj.thickness;
			if (obj._baseVertices[i][3] == false) {
				ctx.setLineDash([5, 5]);
			} else {
				ctx.strokeStyle = obj.color;
			}
			ctx.beginPath();
			ctx.moveTo(obj._baseVertices[i][0], obj._baseVertices[i][1]);
			ctx.lineTo(obj._top[0], obj._top[1]);
			ctx.stroke();
			ctx.setLineDash([]);
		}
		function isPointVisible(i) {
			var arr = [];
			for (var j = 1; j < obj._baseVertices.length; j++)
				arr.push(obj._baseVertices[(i + j) % obj._baseVertices.length]);
			for (var j = 0; j < arr.length - 1; j++) {
				if (hitTestPolygon(obj._baseVertices[i], [arr[j], arr[j + 1], obj._top]) == true)
					return false;
			}
			return true;
		}
		function simplifyAngle(angle) {
			while (angle < 0)
				angle += 2 * Math.PI;
			while (angle > 2 * Math.PI)
				angle -= 2 * Math.PI;
			return angle;
		}
	},
	getRect: function (obj) {
		if (!un(obj.tilt)) {
			obj._top = [obj.center[0], obj.center[1] - (1 - obj.tilt) * obj.height];
			obj._radiusY = obj.radiusX * obj.tilt;
		} else {
			obj._top = [obj.center[0], obj.center[1] - obj.height];
			obj._radiusY = obj.radiusY;
		}
		if (obj._top[1] < obj.center[1] - obj._radiusY) {
			return [obj.center[0] - obj.radiusX, obj._top[1], obj.radiusX * 2, obj.center[1] + obj._radiusY - obj._top[1]];
		} else {
			return [obj.center[0] - obj.radiusX, obj.center[1] - obj._radiusY, obj.radiusX * 2, 2 * obj._radiusY];
		}

	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.center[0] += dl;
		obj.center[1] += dt + dh;
		obj.radiusX += dw;
		var newTotalHeight = obj.height + obj.radiusY + dh;
		obj.radiusY = obj.radiusX / 3;
		obj.height = newTotalHeight - obj.radiusY;
	},
	getButtons: function (x1, y1, x2, y2, pathNum) {
		var buttons = [];
		buttons.push({
			buttonType: 'pyramid-rotate',
			shape: 'rect',
			dims: [x2 - 40, y2 - 20, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.pyramid.rotateStart,
			pathNum: pathNum,
			draw: function (path, ctx, l, t, w, h) {
				ctx.fillStyle = colorA('#F96', 0.5);
				ctx.fillRect(l, t, w, h);
			}
		});
		buttons.push({
			buttonType: 'pyramid-vertices-minus',
			shape: 'rect',
			dims: [x2 - 20, y2 - 40, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.pyramid.verticesMinus,
			pathNum: pathNum,
			draw: function (path, ctx, l, t, w, h) {
				ctx.fillStyle = colorA('#F00', 0.5);
				ctx.fillRect(l, t, w, h);
				text({
					ctx: ctx,
					align: [0, 0],
					rect: [l, t, w, h],
					text: ['<<fontSize:14>>-']
				});
			}
		});
		buttons.push({
			buttonType: 'pyramid-vertices-plus',
			shape: 'rect',
			dims: [x2 - 20, y2 - 60, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.pyramid.verticesPlus,
			pathNum: pathNum,
			draw: function (path, ctx, l, t, w, h) {
				ctx.fillStyle = colorA('#F00', 0.5);
				ctx.fillRect(l, t, w, h);
				text({
					ctx: ctx,
					align: [0, 0],
					rect: [l, t, w, h],
					text: ['<<fontSize:14>>+']
				});
			}
		});
		buttons.push({
			buttonType: 'pyramid-tilt-minus',
			shape: 'rect',
			dims: [x2 - 80, y2 - 20, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.pyramid.tiltMinusStart,
			pathNum: pathNum,
			draw: function (path, ctx, l, t, w, h) {
				ctx.fillStyle = colorA('#393', 0.5);
				ctx.fillRect(l, t, w, h);
			}
		});
		buttons.push({
			buttonType: 'pyramid-tilt-plus',
			shape: 'rect',
			dims: [x2 - 60, y2 - 20, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.pyramid.tiltPlusStart,
			pathNum: pathNum,
			draw: function (path, ctx, l, t, w, h) {
				ctx.fillStyle = colorA('#09F', 0.5);
				ctx.fillRect(l, t, w, h);
			}
		});
		return buttons;
	},
	rotateStart: function () {
		draw.pyramid.rotateIntervalObj = draw.path[draw.currCursor.pathNum].obj[0];
		draw.pyramid.rotateInterval = setInterval(function () {
				draw.pyramid.rotateIntervalObj.startAngle += Math.PI / 30;
				drawCanvasPaths();
			}, 100);
		addListenerEnd(window, draw.pyramid.rotateStop);
	},
	rotateStop: function () {
		clearInterval(draw.pyramid.rotateInterval);
		delete draw.pyramid.rotateIntervalObj;
		removeListenerEnd(window, draw.pyramid.rotateStop);
	},
	verticesMinus: function () {
		var obj = draw.path[draw.currCursor.pathNum].obj[0];
		if (obj.points > 3)
			obj.points--;
		drawSelectedPaths();
	},
	verticesPlus: function () {
		var obj = draw.path[draw.currCursor.pathNum].obj[0];
		obj.points++;
		drawSelectedPaths();
	},
	drawButton: function (ctx, size) {
		ctx.beginPath();
		draw.pyramid.draw(ctx, {
			center: [0.5 * size, 0.7 * size],
			radiusX: 0.3 * size,
			radiusY: 0.1 * size,
			height: 0.5 * size,
			points: 4,
			color: '#000',
			thickness: 0.02 * size,
			startAngle: -Math.PI / 8
		});
		ctx.stroke();
	},
	tiltPlusStart: function () {
		draw.pyramid.tiltIntervalPath = draw.path[draw.currCursor.pathNum];
		draw.pyramid.tiltIntervalObj = draw.path[draw.currCursor.pathNum].obj[0];
		draw.pyramid.tiltInterval = setInterval(function () {
				var obj = draw.pyramid.tiltIntervalObj;
				if (un(obj.tilt))
					obj.tilt = obj.radiusY / obj.radiusX;
				if (obj.tilt < 1) {
					obj.tilt = Math.min(obj.tilt + 0.05, 1);
					updateBorder(draw.pyramid.tiltIntervalPath);
					drawCanvasPaths();
				} else {
					draw.pyramid.tiltStop();
				}
				drawCanvasPaths();
			}, 100);
		addListenerEnd(window, draw.pyramid.tiltStop);
	},
	tiltMinusStart: function () {
		draw.pyramid.tiltIntervalPath = draw.path[draw.currCursor.pathNum];
		draw.pyramid.tiltIntervalObj = draw.path[draw.currCursor.pathNum].obj[0];
		draw.pyramid.tiltInterval = setInterval(function () {
				var obj = draw.pyramid.tiltIntervalObj;
				if (un(obj.tilt))
					obj.tilt = obj.radiusY / obj.radiusX;
				if (obj.tilt > 0) {
					obj.tilt = Math.max(obj.tilt - 0.05, 0);
					updateBorder(draw.pyramid.tiltIntervalPath);
					drawCanvasPaths();
				} else {
					draw.pyramid.tiltStop();
				}
			}, 100);
		addListenerEnd(window, draw.pyramid.tiltStop);
	},
	tiltStop: function () {
		clearInterval(draw.pyramid.tiltInterval);
		delete draw.pyramid.tiltIntervalObj;
		delete draw.pyramid.tiltIntervalPath;
		removeListenerEnd(window, draw.pyramid.tiltStop);
	},
	altDragMove: function (obj, dx, dy) {
		obj.tilt = Math.min(1, Math.max(0, obj.tilt + dy * 0.005));
		obj.startAngle -= 0.01 * dx;
		while (obj.startAngle < 0)
			obj.startAngle += 2 * Math.PI;
		while (obj.startAngle > 2 * Math.PI)
			obj.startAngle -= 2 * Math.PI;
	},
	scale: function (obj, sf, center) {
		if (un(center))
			var center = obj.center;
		obj.center[0] = center[0] + sf * (obj.center[0] - center[0]);
		obj.center[1] = center[1] + sf * (obj.center[1] - center[1]);
		if (!un(obj.radiusX))
			obj.radiusX *= sf;
		if (!un(obj.radiusY))
			obj.radiusY *= sf;
		if (!un(obj.height))
			obj.height *= sf;
		if (!un(obj.thickness))
			obj.thickness *= sf;
		if (!un(obj.dash)) {
			if (!un(obj.dash[0]))
				obj.dash[0] *= sf;
			if (!un(obj.dash[1]))
				obj.dash[1] *= sf;
		}
	}
};
draw.octahedron = {
	resizable: true,
	add: function (n) {
		if (un(n))
			n = 4;
		deselectAllPaths(false);
		changeDrawMode();
		draw.path.push({
			obj: [{
					type: 'octahedron',
					center: getRelPos([300, 300]),
					radiusX: 100,
					radiusY: 100 / 3,
					tilt: 0.35,
					height: 200,
					points: n,
					color: draw.color,
					thickness: 2,
					startAngle: -Math.PI / 2
				}
			],
			selected: true,
			trigger: []
		});
		for (var p = 0; p < draw.path.length; p++)
			updateBorder(draw.path[p]);
		drawCanvasPaths();
	},
	draw: function (ctx, obj, path) {
		obj._top = [obj.center[0], obj.center[1] - (1 - obj.tilt) * obj.height];
		obj._bottom = [obj.center[0], obj.center[1] + (1 - obj.tilt) * obj.height];
		obj._radiusY = obj.radiusX * obj.tilt;

		obj._baseVertices = [];
		for (var p = 0; p < obj.points; p++) {
			var angle = obj.startAngle + p * (2 * Math.PI) / obj.points;
			obj._baseVertices.push([obj.center[0] + obj.radiusX * Math.cos(angle), obj.center[1] + obj._radiusY * Math.sin(angle), angle]);
		}

		for (var p = 0; p < obj.points; p++)
			obj._baseVertices[p][3] = isPointVisible(p);

		if ((obj.points == 3 || obj.points == 4) && hitTestPolygon(obj._top, obj._baseVertices) == false) {
			var negDiff = [];
			var posDiff = [];
			for (var p = 0; p < obj._baseVertices.length; p++) {
				negDiff[p] = 7;
				posDiff[p] = 7;
				var angle = simplifyAngle(obj._baseVertices[p][2]);
				if (angle < 0.5 * Math.PI) {
					posDiff[p] = 0.5 * Math.PI + angle;
				} else if (angle < 1.5 * Math.PI) {
					negDiff[p] = 1.5 * Math.PI - angle;
				} else {
					posDiff[p] = angle - 1.5 * Math.PI;
				}
			}
			var pos = posDiff.indexOf(arrayMin(posDiff));
			var neg = negDiff.indexOf(arrayMin(negDiff));
			if (typeof pos == 'number' && pos > -1 && typeof neg == 'number' && neg > -1) {
				obj._baseVertices[pos][4] = true;
				obj._baseVertices[neg][4] = true;
			}
		}

		for (var i = 0; i < p; i++) {
			var v1 = obj._baseVertices[i];
			var v2 = obj._baseVertices[(i + 1) % p];
			if (v1[3] == false || v2[3] == false || (v1[4] == true && v2[4] == true)) {
				ctx.setLineDash([5, 5]);
			} else {
				ctx.strokeStyle = obj.color;
			}
			ctx.beginPath();
			ctx.moveTo(v1[0], v1[1]);
			ctx.lineTo(v2[0], v2[1]);
			ctx.stroke();
			ctx.setLineDash([]);
		}

		for (var i = 0; i < obj._baseVertices.length; i++) {
			var angle = simplifyAngle(obj._baseVertices[i][2]);

			ctx.lineWidth = obj.thickness;
			if (obj._baseVertices[i][3] == false) {
				ctx.setLineDash([5, 5]);
			} else {
				ctx.strokeStyle = obj.color;
			}
			ctx.beginPath();
			ctx.moveTo(obj._bottom[0], obj._bottom[1]);
			ctx.lineTo(obj._baseVertices[i][0], obj._baseVertices[i][1]);
			ctx.lineTo(obj._top[0], obj._top[1]);
			ctx.stroke();
			ctx.setLineDash([]);
		}
		function isPointVisible(i) {
			var arr = [];
			for (var j = 1; j < obj._baseVertices.length; j++)
				arr.push(obj._baseVertices[(i + j) % obj._baseVertices.length]);
			for (var j = 0; j < arr.length - 1; j++) {
				if (hitTestPolygon(obj._baseVertices[i], [arr[j], arr[j + 1], obj._top]) == true)
					return false;
			}
			return true;
		}
		function simplifyAngle(angle) {
			while (angle < 0)
				angle += 2 * Math.PI;
			while (angle > 2 * Math.PI)
				angle -= 2 * Math.PI;
			return angle;
		}
	},
	getRect: function (obj) {
		obj._top = [obj.center[0], obj.center[1] - (1 - obj.tilt) * obj.height];
		obj._bottom = [obj.center[0], obj.center[1] + (1 - obj.tilt) * obj.height];
		obj._radiusY = obj.radiusX * obj.tilt;
		if (obj._top[1] < obj.center[1] - obj._radiusY) {
			return [obj.center[0] - obj.radiusX, obj._top[1], obj.radiusX * 2, obj._bottom[1] + obj._radiusY - obj._top[1]];
		} else {
			return [obj.center[0] - obj.radiusX, obj.center[1] - obj._radiusY, obj.radiusX * 2, 2 * obj._radiusY];
		}

	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.center[0] += dl;
		obj.center[1] += dt + dh;
		obj.radiusX += dw;
		var newTotalHeight = obj.height + obj.radiusY + dh;
		obj.radiusY = obj.radiusX / 3;
		obj.height = newTotalHeight - obj.radiusY;
	},
	getButtons: function (x1, y1, x2, y2, pathNum) {
		var buttons = [];
		buttons.push({
			buttonType: 'octahedron-rotate',
			shape: 'rect',
			dims: [x2 - 40, y2 - 20, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.octahedron.rotateStart,
			pathNum: pathNum,
			draw: function (path, ctx, l, t, w, h) {
				ctx.fillStyle = colorA('#F96', 0.5);
				ctx.fillRect(l, t, w, h);
			}
		});
		buttons.push({
			buttonType: 'octahedron-vertices-minus',
			shape: 'rect',
			dims: [x2 - 20, y2 - 40, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.octahedron.verticesMinus,
			pathNum: pathNum,
			draw: function (path, ctx, l, t, w, h) {
				ctx.fillStyle = colorA('#F00', 0.5);
				ctx.fillRect(l, t, w, h);
				text({
					ctx: ctx,
					align: [0, 0],
					rect: [l, t, w, h],
					text: ['<<fontSize:14>>-']
				});
			}
		});
		buttons.push({
			buttonType: 'octahedron-vertices-plus',
			shape: 'rect',
			dims: [x2 - 20, y2 - 60, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.octahedron.verticesPlus,
			pathNum: pathNum,
			draw: function (path, ctx, l, t, w, h) {
				ctx.fillStyle = colorA('#F00', 0.5);
				ctx.fillRect(l, t, w, h);
				text({
					ctx: ctx,
					align: [0, 0],
					rect: [l, t, w, h],
					text: ['<<fontSize:14>>+']
				});
			}
		});
		buttons.push({
			buttonType: 'octahedron-tilt-minus',
			shape: 'rect',
			dims: [x2 - 80, y2 - 20, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.octahedron.tiltMinusStart,
			pathNum: pathNum,
			draw: function (path, ctx, l, t, w, h) {
				ctx.fillStyle = colorA('#393', 0.5);
				ctx.fillRect(l, t, w, h);
			}
		});
		buttons.push({
			buttonType: 'octahedron-tilt-plus',
			shape: 'rect',
			dims: [x2 - 60, y2 - 20, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.octahedron.tiltPlusStart,
			pathNum: pathNum,
			draw: function (path, ctx, l, t, w, h) {
				ctx.fillStyle = colorA('#09F', 0.5);
				ctx.fillRect(l, t, w, h);
			}
		});
		return buttons;
	},
	rotateStart: function () {
		draw.octahedron.rotateIntervalObj = draw.path[draw.currCursor.pathNum].obj[0];
		draw.octahedron.rotateInterval = setInterval(function () {
				draw.octahedron.rotateIntervalObj.startAngle += Math.PI / 30;
				drawCanvasPaths();
			}, 100);
		addListenerEnd(window, draw.octahedron.rotateStop);
	},
	rotateStop: function () {
		clearInterval(draw.octahedron.rotateInterval);
		delete draw.octahedron.rotateIntervalObj;
		removeListenerEnd(window, draw.octahedron.rotateStop);
	},
	verticesMinus: function () {
		var obj = draw.path[draw.currCursor.pathNum].obj[0];
		if (obj.points > 3)
			obj.points--;
		drawSelectedPaths();
	},
	verticesPlus: function () {
		var obj = draw.path[draw.currCursor.pathNum].obj[0];
		obj.points++;
		drawSelectedPaths();
	},
	drawButton: function (ctx, size) {
		ctx.beginPath();
		draw.octahedron.draw(ctx, {
			center: [0.5 * size, 0.7 * size],
			radiusX: 0.3 * size,
			radiusY: 0.1 * size,
			height: 0.5 * size,
			points: 4,
			color: '#000',
			thickness: 0.02 * size,
			startAngle: -Math.PI / 8
		});
		ctx.stroke();
	},
	tiltPlusStart: function () {
		draw.octahedron.tiltIntervalPath = draw.path[draw.currCursor.pathNum];
		draw.octahedron.tiltIntervalObj = draw.path[draw.currCursor.pathNum].obj[0];
		draw.octahedron.tiltInterval = setInterval(function () {
				var obj = draw.octahedron.tiltIntervalObj;
				if (un(obj.tilt))
					obj.tilt = obj.radiusY / obj.radiusX;
				if (obj.tilt < 1) {
					obj.tilt = Math.min(obj.tilt + 0.05, 1);
					updateBorder(draw.octahedron.tiltIntervalPath);
					drawCanvasPaths();
				} else {
					draw.octahedron.tiltStop();
				}
				drawCanvasPaths();
			}, 100);
		addListenerEnd(window, draw.octahedron.tiltStop);
	},
	tiltMinusStart: function () {
		draw.octahedron.tiltIntervalPath = draw.path[draw.currCursor.pathNum];
		draw.octahedron.tiltIntervalObj = draw.path[draw.currCursor.pathNum].obj[0];
		draw.octahedron.tiltInterval = setInterval(function () {
				var obj = draw.octahedron.tiltIntervalObj;
				if (un(obj.tilt))
					obj.tilt = obj.radiusY / obj.radiusX;
				if (obj.tilt > 0) {
					obj.tilt = Math.max(obj.tilt - 0.05, 0);
					updateBorder(draw.octahedron.tiltIntervalPath);
					drawCanvasPaths();
				} else {
					draw.octahedron.tiltStop();
				}
			}, 100);
		addListenerEnd(window, draw.octahedron.tiltStop);
	},
	tiltStop: function () {
		clearInterval(draw.octahedron.tiltInterval);
		delete draw.octahedron.tiltIntervalObj;
		delete draw.octahedron.tiltIntervalPath;
		removeListenerEnd(window, draw.octahedron.tiltStop);
	},
	altDragMove: function (obj, dx, dy) {
		obj.tilt = Math.min(1, Math.max(0, obj.tilt + dy * 0.005));
		obj.startAngle -= 0.01 * dx;
		while (obj.startAngle < 0)
			obj.startAngle += 2 * Math.PI;
		while (obj.startAngle > 2 * Math.PI)
			obj.startAngle -= 2 * Math.PI;
	},
	scale: function (obj, sf, center) {
		if (un(center))
			var center = obj.center;
		obj.center[0] = center[0] + sf * (obj.center[0] - center[0]);
		obj.center[1] = center[1] + sf * (obj.center[1] - center[1]);
		if (!un(obj.radiusX))
			obj.radiusX *= sf;
		if (!un(obj.radiusY))
			obj.radiusY *= sf;
		if (!un(obj.height))
			obj.height *= sf;
		if (!un(obj.thickness))
			obj.thickness *= sf;
		if (!un(obj.dash)) {
			if (!un(obj.dash[0]))
				obj.dash[0] *= sf;
			if (!un(obj.dash[1]))
				obj.dash[1] *= sf;
		}
	}
};
draw.polygon = {
	add: function (polygonType, vertices) {
		if (un(vertices))
			vertices = 4;
		if (un(polygonType))
			polygonType = 'none';
		if (polygonType == 'arrow')
			vertices = 9;
		if (polygonType == 'arrow2')
			vertices = 12;

		deselectAllPaths(false);
		var pos = [];
		var center = getRelPos([150, 150]);
		var radius = 80;

		if (vertices == 4) {
			var pos = [
				[center[0] - 80, center[1] - 70],
				[center[0] + 20, center[1] - 70],
				[center[0] + 100, center[1] + 40],
				[center[0] - 40, center[1] + 50]
			];
		} else if (vertices == 3) {
			var pos = [
				[center[0] + 70, center[1] + 70],
				[center[0] - 70, center[1] + 70],
				[center[0] - 30, center[1] - 70]
			];
		} else if (polygonType == 'arrow') {
			var l = center[0];
			var t = center[1];
			pos = [[l, t], [l + 80, t], [l + 80, t - 20], [l + 120, t + 30], [l + 80, t + 80], [l + 80, t + 60], [l, t + 60]];
		} else if (polygonType == 'arrow2') {
			var l = center[0];
			var t = center[1];
			pos = [[l - 40, t + 30], [l, t - 20], [l, t], [l + 80, t], [l + 80, t - 20], [l + 120, t + 30], [l + 80, t + 80], [l + 80, t + 60], [l, t + 60], [l, t + 80]];
		} else {
			var angle = 0.5 * Math.PI + Math.PI / vertices;
			for (var p = 0; p < vertices; p++) {
				pos[p] = [center[0] + radius * Math.cos(angle), center[1] + radius * Math.sin(angle)];
				angle += (2 * Math.PI) / vertices;
			}
		}
		switch (polygonType) {
		case 'square':
			var vector1 = getVectorAB(pos[0], pos[1]);
			var vector2 = getPerpVector(vector1);
			pos[2] = pointAddVector(pos[1], vector2);
			pos[3] = pointAddVector(pos[2], vector1, -1);
			break;
		case 'rect':
			var vector1 = getVectorAB(pos[0], pos[1]);
			var vector2 = getPerpVector(vector1);
			vector2 = setVectorMag(vector2, getDist(pos[1], pos[2]));
			pos[2] = pointAddVector(pos[1], vector2, 1);
			pos[3] = pointAddVector(pos[0], vector2, 1);
			break;
		case 'para':
			var vector1 = getVectorAB(pos[0], pos[1]);
			pos[3] = pointAddVector(pos[2], vector1, -1);
			break;
		case 'trap':
			var vector1 = getVectorAB(pos[0], pos[1]);
			vector1 = setVectorMag(vector1, getDist(pos[2], pos[3]));
			pos[3] = pointAddVector(pos[2], vector1, -1);
			break;
		case 'rhom':
			var vector1 = getVectorAB(pos[0], pos[1]);
			var vector2 = getVectorAB(pos[1], pos[2]);
			vector2 = setVectorMag(vector2, getDist(pos[0], pos[1]));
			pos[2] = pointAddVector(pos[1], vector2);
			pos[3] = pointAddVector(pos[2], vector1, -1);
			break;
		case 'kite':
			var vector1 = getVectorAB(pos[0], pos[2]);
			var mid = getFootOfPerp(pos[0], vector1, pos[1]);
			var vector2 = getVectorAB(mid, pos[1]);
			pos[3] = pointAddVector(mid, vector2, -1);
			break;
		case 'equi':
			var vector1 = getVectorAB(pos[0], pos[1]);
			var vector2 = rotateVector(vector1, 2 * Math.PI / 3);
			pos[2] = pointAddVector(pos[1], vector2, 1);
			break;
		case 'isos':
			var vector1 = getVectorAB(pos[0], pos[1]);
			var vector2 = getPerpVector(vector1);
			var mid = getMidpoint(pos[0], pos[1]);
			pos[2] = pointAddVector(mid, vector2, 1.17);
			break;
		case 'right':
			var vector1 = getVectorAB(pos[0], pos[1]);
			var vector2 = getPerpVector(vector1);
			pos[2] = pointAddVector(pos[1], vector2, 0.8);
			break;
		case 'rightisos':
			var vector1 = getVectorAB(pos[0], pos[1]);
			var vector2 = getPerpVector(vector1);
			pos[2] = pointAddVector(pos[1], vector2, 1);
			break;
		}

		var angles = [];
		for (var p = 0; p < vertices; p++) {
			angles[p] = {
				style: 0,
				radius: 30,
				labelMeasure: true,
				labelFontSize: 25,
				labelRadius: 33,
				drawCurve: false,
				measureLabelOnly: true
			};
		}

		draw.path.push({
			obj: [{
					type: 'polygon',
					polygonType: polygonType,
					color: '#000',
					thickness: 2,
					fillColor: 'none',
					points: pos,
					closed: true,
					lineDecoration: [],
					angles: angles,
					clockwise: false,
					edit: false,
					drawing: false
				}
			],
			selected: true
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
	},
	draw: function (ctx, obj, path) {
		ctx.strokeStyle = obj.color;
		ctx.lineWidth = obj.thickness;
		if (typeof ctx.setLineDash !== 'function') ctx.setLineDash = function () {};
		if (typeof obj.dash !== 'undefined') ctx.setLineDash(obj.dash);
		if (obj.points.length > 1) {
			var obj2 = clone(obj);
			for (var p = 0; p < obj2.points.length; p++) {
				obj2.points[p][0] = obj2.points[p][0];
				obj2.points[p][1] = obj2.points[p][1];
			}
			if (typeof obj2.angles !== 'undefined') {
				for (var a = 0; a < obj2.angles.length; a++) {
					if (typeof obj2.angles[a] == 'object' && obj2.angles[a] !== null && !un(obj2.angles[a])) {
						if (typeof obj2.angles[a].lineWidth !== 'undefined') {
							obj2.angles[a].lineWidth = obj2.angles[a].lineWidth;
						}
						if (typeof obj2.angles[a].labelRadius !== 'undefined') {
							obj2.angles[a].labelRadius = obj2.angles[a].labelRadius;
						}
						if (typeof obj2.angles[a].labelFontSize !== 'undefined') {
							obj2.angles[a].labelFontSize = obj2.angles[a].labelFontSize;
						}
						if (typeof obj2.angles[a].radius !== 'undefined') {
							obj2.angles[a].radius = obj2.angles[a].radius;
						}
					}
				}
			}
			obj2.thickness = obj2.thickness;
			obj2.ctx = ctx;
			obj2.calcTextSnapPos = path.selected;
			var pos = drawPolygon(obj2);
			obj._angleLabelPos = pos.angleLabelPos;
			obj._outerAngleLabelPos = pos.outerAngleLabelPos;
			obj._prismPoints = pos.prismPoints;
			/*obj._textSnapPos = pos.textSnapPos;
			if (path.selected) {
				for (var i = 0; i < obj._textSnapPos.length; i++) {
					var pos = obj._textSnapPos[i];
					ctx.beginPath();
					ctx.strokeStyle = '#F0F';
					ctx.lineWidth = 2;
					var x = pos.pos[0];
					var y = pos.pos[1];
					if (arraysEqual(pos.align, [-1, 0])) {
						ctx.moveTo(x, y - 10);
						ctx.lineTo(x, y + 10);
					} else if (arraysEqual(pos.align, [-1, -1])) {
						ctx.moveTo(x, y + 10);
						ctx.lineTo(x, y);
						ctx.lineTo(x + 10, y);
					} else if (arraysEqual(pos.align, [0, -1])) {
						ctx.moveTo(x - 10, y);
						ctx.lineTo(x + 10, y);
					} else if (arraysEqual(pos.align, [1, -1])) {
						ctx.moveTo(x, y + 10);
						ctx.lineTo(x, y);
						ctx.lineTo(x - 10, y);
					} else if (arraysEqual(pos.align, [1, 0])) {
						ctx.moveTo(x, y - 10);
						ctx.lineTo(x, y + 10);
					} else if (arraysEqual(pos.align, [1, 1])) {
						ctx.moveTo(x, y - 10);
						ctx.lineTo(x, y);
						ctx.lineTo(x - 10, y);
					} else if (arraysEqual(pos.align, [0, 1])) {
						ctx.moveTo(x - 10, y);
						ctx.lineTo(x + 10, y);
					} else if (arraysEqual(pos.align, [-1, 1])) {
						ctx.moveTo(x, y - 10);
						ctx.lineTo(x, y);
						ctx.lineTo(x + 10, y);
					}
					ctx.stroke();
				}
			}*/
		}
		ctx.setLineDash([]);

		if (draw.mode === 'edit' && path.obj.length == 1) {
			ctx.save();
			ctx.lineWidth = 1;
			ctx.strokeStyle = '#000';
			ctx.fillStyle = '#F00';

			if (un(obj._outerAngleLabelPos)) obj._outerAngleLabelPos = [];
			if (un(obj._exteriorAngleLabelPos)) obj._exteriorAngleLabelPos = [];
			for (var k = 0; k < obj.points.length; k++) {
				if ((path.selected == true || (obj.drawing == true && k > 0 && k < obj.points.length - 1)) && (!un(obj.angles) && !un(obj.angles[k]) && (obj.angles[k].measureLabelOnly == true || obj.angles[k].drawCurve == false))) {
					var angleObj = {
						ctx: ctx,
						drawLines: false,
						radius: 30,
						lineColor: colorA(obj.color, 0.3),
						labelMeasure: true,
						labelFontSize: 25,
						labelRadius: 33,
						labelColor: colorA(obj.color, 0.3),
						lineWidth: 2
					};
					if (!un(obj.angles[k]))
						angleObj.measureLabelOnly = !obj.angles[k].measureLabelOnly;
					if (!un(obj.angles[k]))
						angleObj.drawCurve = !obj.angles[k].drawCurve;
					angleObj.b = obj.points[k];
					if (obj.clockwise == false) {
						angleObj.a = obj.points[(k + 1) % (obj.points.length)];
						if (k == 0) {
							angleObj.c = obj.points[obj.points.length - 1];
						} else {
							angleObj.c = obj.points[k - 1];
						}
					} else {
						angleObj.c = obj.points[(k + 1) % (obj.points.length)];
						if (k == 0) {
							angleObj.a = obj.points[obj.points.length - 1];
						} else {
							angleObj.a = obj.points[k - 1];
						}
					}
					if (obj.closed == true || (k !== 0 && k !== obj.points.length - 1))
						drawAngle(angleObj);
				}
				if (path.selected == true && obj.anglesMode == 'outer' && (typeof obj.outerAngles[k] !== 'object' || obj.outerAngles[k].measureLabelOnly == true || obj.outerAngles[k].drawCurve == false)) {
					var angleObj = {
						ctx: ctx,
						drawLines: false,
						radius: 30,
						lineColor: colorA(obj.color, 0.3),
						labelMeasure: true,
						labelFontSize: 25,
						labelRadius: 33,
						labelColor: colorA(obj.color, 0.3),
						lineWidth: 2
					};
					angleObj.b = obj.points[k];
					if (obj.clockwise == true) {
						angleObj.a = obj.points[(k + 1) % (obj.points.length)];
						if (k == 0) {
							angleObj.c = obj.points[obj.points.length - 1];
						} else {
							angleObj.c = obj.points[k - 1];
						}
					} else {
						angleObj.c = obj.points[(k + 1) % (obj.points.length)];
						if (k == 0) {
							angleObj.a = obj.points[obj.points.length - 1];
						} else {
							angleObj.a = obj.points[k - 1];
						}
					}
					obj._outerAngleLabelPos[k] = drawAngle(angleObj);
				}
				if (path.selected == true && obj.anglesMode == 'exterior') {
					if (un(obj._exteriorAngleLabelPos[k]))
						obj._exteriorAngleLabelPos[k] = [];
					ctx.save();
					ctx.strokeStyle = colorA(obj.color, 0.3);
					if (obj.exteriorAngles[k].line1.show == false) {
						ctx.beginPath();
						ctx.moveTo(obj.points[k][0], obj.points[k][1]);
						ctx.lineTo(obj.exteriorAngles[k].line1.pos[0], obj.exteriorAngles[k].line1.pos[1]);
						ctx.stroke();
					}
					if (obj.exteriorAngles[k].line2.show == false) {
						ctx.beginPath();
						ctx.moveTo(obj.points[k][0], obj.points[k][1]);
						ctx.lineTo(obj.exteriorAngles[k].line2.pos[0], obj.exteriorAngles[k].line2.pos[1]);
						ctx.stroke();
					}
					ctx.restore();
					var angleObj = {
						ctx: ctx,
						drawLines: false,
						radius: 30,
						lineColor: colorA(obj.color, 0.3),
						labelMeasure: true,
						labelFontSize: 25,
						labelRadius: 33,
						labelColor: colorA(obj.color, 0.3),
						lineWidth: 2
					};
					angleObj.b = obj.points[k];
					var prev = k - 1;
					if (prev < 0)
						prev = obj.points.length - 1;
					var next = k + 1;
					if (next > obj.points.length - 1)
						next = 0;
					if (un(obj.exteriorAngles[k].a3) || (obj.exteriorAngles[k].a3.measureLabelOnly == true || obj.exteriorAngles[k].a3.drawCurve == false)) {
						angleObj.a = obj.points[prev];
						angleObj.c = obj.exteriorAngles[k].line1.pos;
						obj._exteriorAngleLabelPos[k][0] = drawAngle(angleObj);
					}
					if (un(obj.exteriorAngles[k].a2) || (obj.exteriorAngles[k].a2.measureLabelOnly == true || obj.exteriorAngles[k].a2.drawCurve == false)) {
						angleObj.a = obj.exteriorAngles[k].line1.pos;
						angleObj.c = obj.exteriorAngles[k].line2.pos;
						obj._exteriorAngleLabelPos[k][1] = drawAngle(angleObj);
					}
					if (un(obj.exteriorAngles[k].a1) || (obj.exteriorAngles[k].a1.measureLabelOnly == true || obj.exteriorAngles[k].a1.drawCurve == false)) {
						angleObj.a = obj.exteriorAngles[k].line2.pos;
						angleObj.c = obj.points[next];
						obj._exteriorAngleLabelPos[k][2] = drawAngle(angleObj);
					}
					ctx.save();
					ctx.fillStyle = '#9FF';
					ctx.beginPath();
					ctx.arc(obj.exteriorAngles[k].line1.pos[0], obj.exteriorAngles[k].line1.pos[1], 7, 0, 2 * Math.PI);
					ctx.fill();
					ctx.stroke();
					ctx.beginPath();
					ctx.arc(obj.exteriorAngles[k].line2.pos[0], obj.exteriorAngles[k].line2.pos[1], 7, 0, 2 * Math.PI);
					ctx.fill();
					ctx.stroke();
					ctx.restore();
				}

				if (path.selected == true) {
					ctx.fillStyle = '#F00';
					if (obj.points.length == 4 && !un(obj.polygonType)) {
						switch (k) {
						case 1:
							if (['rhom', 'kite'].indexOf(obj.polygonType) > -1) {
								ctx.fillStyle = '#66F';
							}
							break;
						case 2:
							if (['rect', 'para'].indexOf(obj.polygonType) > -1) {
								ctx.fillStyle = '#66F';
							} else if (['trap'].indexOf(obj.polygonType) > -1) {
								ctx.fillStyle = '#6F6';
							}
							break;
						case 3:
							if (['rect', 'para', 'rhom', 'kite'].indexOf(obj.polygonType) > -1) {
								continue;
							} else if (['trap'].indexOf(obj.polygonType) > -1) {
								ctx.fillStyle = '#6F6';
							}
							break;
						}
					}
					ctx.beginPath();
					ctx.arc(obj.points[k][0], obj.points[k][1], 7, 0, 2 * Math.PI);
					ctx.fill();
					ctx.stroke();
				}
			}
			if (path.selected && obj.solidType == 'prism') {
				var prismVector = obj.prismVector || [40, -40];
				var prismPoint = pointAddVector(obj.points[0], prismVector);
				ctx.fillStyle = '#F0F';
				ctx.beginPath();
				ctx.arc(prismPoint[0], prismPoint[1], 7, 0, 2 * Math.PI);
				ctx.fill();
				ctx.stroke();
			}
			ctx.restore();
		}
		delete obj.angleLabelPos;
		delete obj.left;
		delete obj.top;
		delete obj.right;
		delete obj.bottom;
		delete obj.width;
		delete obj.height;
	},
	getRect: function (obj) {
		obj._left = obj.points[0][0] - 10;
		obj._top = obj.points[0][1] - 10;
		obj._right = obj.points[0][0] + 10;
		obj._bottom = obj.points[0][1] + 10;
		for (var j = 1; j < obj.points.length; j++) {
			obj._left = Math.min(obj._left, obj.points[j][0] - 10);
			obj._top = Math.min(obj._top, obj.points[j][1] - 10);
			obj._right = Math.max(obj._right, obj.points[j][0] + 10);
			obj._bottom = Math.max(obj._bottom, obj.points[j][1] + 10);
		}
		if (obj.solidType == 'prism') {
			var prismVector = obj.prismVector || [40, -40];
			for (var p = 0; p < obj.points.length; p++) {
				var prismPoint = pointAddVector(obj.points[p], prismVector);
				obj._left = Math.min(obj._left, prismPoint[0] - 10);
				obj._top = Math.min(obj._top, prismPoint[1] - 10);
				obj._right = Math.max(obj._right, prismPoint[0] + 10);
				obj._bottom = Math.max(obj._bottom, prismPoint[1] + 10);
			}
		}
		if (obj.anglesMode == 'exterior') {
			for (var p = 0; p < obj.points.length; p++) {
				if (!un(obj.exteriorAngles[p])) {
					if (!un(obj.exteriorAngles[p].line1)) {
						ePoint = obj.exteriorAngles[p].line1.pos;
						obj._left = Math.min(obj._left, ePoint[0] - 10);
						obj._top = Math.min(obj._top, ePoint[1] - 10);
						obj._right = Math.max(obj._right, ePoint[0] + 10);
						obj._bottom = Math.max(obj._bottom, ePoint[1] + 10);
					}
					if (!un(obj.exteriorAngles[p].line2)) {
						ePoint = obj.exteriorAngles[p].line2.pos;
						obj._left = Math.min(obj._left, ePoint[0] - 10);
						obj._top = Math.min(obj._top, ePoint[1] - 10);
						obj._right = Math.max(obj._right, ePoint[0] + 10);
						obj._bottom = Math.max(obj._bottom, ePoint[1] + 10);
					}
				}
			}
		}
		if (obj.anglesMode == 'outer') {
			for (var j = 0; j < obj.points.length; j++) {
				obj._left = Math.min(obj._left, obj.points[j][0] - 70);
				obj._top = Math.min(obj._top, obj.points[j][1] - 70);
				obj._right = Math.max(obj._right, obj.points[j][0] + 70);
				obj._bottom = Math.max(obj._bottom, obj.points[j][1] + 70);
			}
		}

		obj._width = obj._right - obj._left;
		obj._height = obj._bottom - obj._top;
		return [obj._left, obj._top, obj._width, obj._height];
	},
	getCursorPositionsSelected: function (obj, pathNum) {
		var pos = [];
		for (var k = 0; k < obj.points.length; k++) {
			if (obj.closed == false && k == obj.points.length - 1)
				continue;
			var p1 = obj.points[k];
			var p2 = obj.points[(k + 1) % (obj.points.length)];
			var mid = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
			pos.push({
				shape: 'circle',
				dims: [mid[0], mid[1], 30],
				cursor: draw.cursors.pointer,
				func: draw.polygon.setLineDecoration,
				pathNum: pathNum,
				point: k
			});
		}
		for (var k = 0; k < obj.points.length; k++) {
			if (!un(obj._angleLabelPos) && !un(obj._angleLabelPos[k])) {
				pos.push({
					shape: 'rect',
					dims: obj._angleLabelPos[k],
					cursor: draw.cursors.pointer,
					func: draw.polygon.toggleAngleLabel,
					pathNum: pathNum,
					point: k
				});
			}
			if (obj.clockwise == true) {
				var next = k - 1;
				var prev = k + 1;
				if (k == 0)
					next = obj.points.length - 1;
				if (k == obj.points.length - 1)
					prev = 0;
			} else {
				var prev = k - 1;
				var next = k + 1;
				if (k == 0)
					prev = obj.points.length - 1;
				if (k == obj.points.length - 1)
					next = 0;
			}
			pos.push({
				shape: 'sector',
				dims: [obj.points[k][0], obj.points[k][1], 32, getAngleTwoPoints(obj.points[k], obj.points[next]), getAngleTwoPoints(obj.points[k], obj.points[prev])],
				cursor: draw.cursors.pointer,
				func: draw.polygon.toggleAngle,
				pathNum: pathNum,
				point: k
			});

			if (obj.anglesMode == 'outer' && !un(obj.outerAngles)) {
				pos.push({
					shape: 'sector',
					dims: [obj.points[k][0], obj.points[k][1], 32, getAngleTwoPoints(obj.points[k], obj.points[prev]), getAngleTwoPoints(obj.points[k], obj.points[next])],
					cursor: draw.cursors.pointer,
					func: draw.polygon.toggleOuterAngle,
					pathNum: pathNum,
					point: k
				});
				if (!un(obj._outerAngleLabelPos) && !un(obj._outerAngleLabelPos[k])) {
					pos.push({
						shape: 'rect',
						dims: obj._outerAngleLabelPos[k],
						cursor: draw.cursors.pointer,
						func: draw.polygon.toggleOuterAngleLabel,
						pathNum: pathNum,
						point: k
					});
				}

			} else if (obj.anglesMode == 'exterior' && !un(obj.exteriorAngles)) {
				var pos11 = obj.exteriorAngles[k].line1.pos;
				var pos22 = obj.exteriorAngles[k].line2.pos;
				pos.push({
					shape: 'circle',
					dims: [pos11[0], pos11[1], 10],
					cursor: draw.cursors.pointer,
					func: draw.polygon.startExtAnglePointDrag,
					pathNum: pathNum,
					point: k,
					line: 1
				});
				pos.push({
					shape: 'circle',
					dims: [pos22[0], pos22[1], 10],
					cursor: draw.cursors.pointer,
					func: draw.polygon.startExtAnglePointDrag,
					pathNum: pathNum,
					point: k,
					line: 2
				});

				pos.push({
					shape: 'sector',
					dims: [obj.points[k][0], obj.points[k][1], 32, getAngleTwoPoints(obj.points[k], obj.points[prev]), getAngleTwoPoints(obj.points[k], pos11)],
					cursor: draw.cursors.pointer,
					func: draw.polygon.toggleExteriorAngle,
					pathNum: pathNum,
					point: k,
					sub: 3
				});
				pos.push({
					shape: 'sector',
					dims: [obj.points[k][0], obj.points[k][1], 32, getAngleTwoPoints(obj.points[k], pos11), getAngleTwoPoints(obj.points[k], pos22)],
					cursor: draw.cursors.pointer,
					func: draw.polygon.toggleExteriorAngle,
					pathNum: pathNum,
					point: k,
					sub: 2
				});
				pos.push({
					shape: 'sector',
					dims: [obj.points[k][0], obj.points[k][1], 32, getAngleTwoPoints(obj.points[k], pos22), getAngleTwoPoints(obj.points[k], obj.points[next])],
					cursor: draw.cursors.pointer,
					func: draw.polygon.toggleExteriorAngle,
					pathNum: pathNum,
					point: k,
					sub: 1
				});

				if (!un(obj._exteriorAngleLabelPos) && !un(obj._exteriorAngleLabelPos[k])) {
					if (!un(obj._exteriorAngleLabelPos[k][0])) {
						pos.push({
							shape: 'rect',
							dims: obj._exteriorAngleLabelPos[k][0],
							cursor: draw.cursors.pointer,
							func: draw.polygon.toggleExteriorAngleLabel,
							pathNum: pathNum,
							point: k,
							sub: 3
						});
					}
					if (!un(obj._exteriorAngleLabelPos[k][1])) {
						pos.push({
							shape: 'rect',
							dims: obj._exteriorAngleLabelPos[k][1],
							cursor: draw.cursors.pointer,
							func: draw.polygon.toggleExteriorAngleLabel,
							pathNum: pathNum,
							point: k,
							sub: 2
						});
					}
					if (!un(obj._exteriorAngleLabelPos[k][2])) {
						pos.push({
							shape: 'rect',
							dims: obj._exteriorAngleLabelPos[k][2],
							cursor: draw.cursors.pointer,
							func: draw.polygon.toggleExteriorAngleLabel,
							pathNum: pathNum,
							point: k,
							sub: 1
						});
					}
				}
			}
		}
		if (obj.solidType == 'prism') {
			var prismVector = obj.prismVector || [40, -40];
			var point = pointAddVector(obj.points[0], prismVector);
			pos.push({
				shape: 'circle',
				dims: [point[0], point[1], 10],
				cursor: draw.cursors.pointer,
				func: draw.polygon.startPrismPointDrag,
				pathNum: pathNum
			});
		}
		for (var k = 0; k < obj.points.length; k++) {
			if (obj.points.length == 4 && k == 4 && ['rect', 'para', 'rhom', 'kite'].indexOf(obj.polygonType) > -1)
				continue;
			pos.push({
				shape: 'circle',
				dims: [obj.points[k][0], obj.points[k][1], 10],
				cursor: draw.cursors.pointer,
				func: draw.polygon.startPosDrag,
				pathNum: pathNum,
				point: k
			});
		}
		obj._cursorPositions = pos;
		return pos;
	},
	getButtons: function (x1, y1, x2, y2, pathNum) {
		if (typeof pathNum == 'undefined')
			return;
		if (un(draw.path[pathNum]))
			return;
		var obj = draw.path[pathNum].obj[0];
		var buttons = [];
		buttons.push({
			buttonType: 'polygon-makeRegular',
			shape: 'rect',
			dims: [x2 - 20, y2 - 40, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.polygon.makeRegular,
			pathNum: pathNum
		});
		buttons.push({
			buttonType: 'polygon-verticesPlus',
			shape: 'rect',
			dims: [x2 - 20, y2 - 80, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.polygon.verticesPlus,
			pathNum: pathNum
		});
		buttons.push({
			buttonType: 'polygon-verticesMinus',
			shape: 'rect',
			dims: [x2 - 20, y2 - 60, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.polygon.verticesMinus,
			pathNum: pathNum
		});
		buttons.push({
			buttonType: 'polygon-setPrism',
			shape: 'rect',
			dims: [x2 - 20, y2 - 100, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.polygon.setPrism,
			pathNum: pathNum
		});
		buttons.push({
			buttonType: 'polygon-setOuterAngles',
			shape: 'rect',
			dims: [x2 - 20, y2 - 120, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.polygon.setOuterAngles,
			pathNum: pathNum
		});
		buttons.push({
			buttonType: 'polygon-setExteriorAngles',
			shape: 'rect',
			dims: [x2 - 20, y2 - 140, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.polygon.setExteriorAngles,
			pathNum: pathNum
		});
		if (obj.points.length == 4) {
			buttons.push({
				buttonType: 'polygon-setTypeKite',
				shape: 'rect',
				dims: [x2 - 40, y2 - 20, 20, 20],
				cursor: draw.cursors.pointer,
				func: draw.polygon.setType,
				pathNum: pathNum,
				type: 'kite'
			});
			buttons.push({
				buttonType: 'polygon-setTypeRhom',
				shape: 'rect',
				dims: [x2 - 60, y2 - 20, 20, 20],
				cursor: draw.cursors.pointer,
				func: draw.polygon.setType,
				pathNum: pathNum,
				type: 'rhom'
			});
			buttons.push({
				buttonType: 'polygon-setTypeTrap',
				shape: 'rect',
				dims: [x2 - 80, y2 - 20, 20, 20],
				cursor: draw.cursors.pointer,
				func: draw.polygon.setType,
				pathNum: pathNum,
				type: 'trap'
			});
			buttons.push({
				buttonType: 'polygon-setTypePara',
				shape: 'rect',
				dims: [x2 - 100, y2 - 20, 20, 20],
				cursor: draw.cursors.pointer,
				func: draw.polygon.setType,
				pathNum: pathNum,
				type: 'para'
			});
			buttons.push({
				buttonType: 'polygon-setTypeRect',
				shape: 'rect',
				dims: [x2 - 120, y2 - 20, 20, 20],
				cursor: draw.cursors.pointer,
				func: draw.polygon.setType,
				pathNum: pathNum,
				type: 'rect'
			});
			buttons.push({
				buttonType: 'polygon-setTypeSquare',
				shape: 'rect',
				dims: [x2 - 140, y2 - 20, 20, 20],
				cursor: draw.cursors.pointer,
				func: draw.polygon.setType,
				pathNum: pathNum,
				type: 'square'
			});
		}
		if (un(obj.polygonType) || ['square', 'rect', 'para', 'trap', 'rhom', 'kite', 'equi', 'isos', 'right', 'rightisos'].indexOf(obj.polygonType) == -1) {
			// resize handle in bottom right corner
			buttons.push({
				buttonType: 'resize',
				shape: 'rect',
				dims: [x2 - 20, y2 - 20, 20, 20],
				cursor: draw.cursors.nw,
				func: drawClickStartResizeObject,
				pathNum: pathNum
			});
		}
		return buttons;
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		for (var k = 0; k < obj.points.length; k++) {
			obj.points[k][0] += dl;
			obj.points[k][1] += dt;
		}
		if (dw !== 0 || dh !== 0) {
			var x = mouse.x - draw.drawRelPos[0];
			var y = mouse.y - draw.drawRelPos[1];
			if (shiftOn == true) {
				var sf = Math.min((x - obj._left) / obj._width, (y - obj._top) / obj._height);
				var xsf = sf;
				var ysf = sf;
			} else {
				var xsf = (x - obj._left) / obj._width;
				var ysf = (y - obj._top) / obj._height;
			}
			for (var k = 0; k < obj.points.length; k++) {
				obj.points[k][0] = obj._left + obj._width * xsf * ((obj.points[k][0] - obj._left) / obj._width);
				obj.points[k][1] = obj._top + obj._height * ysf * ((obj.points[k][1] - obj._top) / obj._height);
			}
		}
		if (!un(obj.exteriorAngles)) {
			for (var v = 0; v < obj.exteriorAngles.length; v++) {
				var prev = v - 1;
				if (prev == -1)
					prev = obj.points.length - 1;
				var next = v + 1;
				if (next == obj.points.length)
					next = 0;
				var vector1 = getVectorAB(obj.points[prev], obj.points[v]);
				var pos1 = pointAddVector(obj.points[v], getUnitVector(vector1), obj.exteriorAngles[v].line2.dist);
				var vector2 = getVectorAB(obj.points[next], obj.points[v]);
				var pos2 = pointAddVector(obj.points[v], getUnitVector(vector2), obj.exteriorAngles[v].line1.dist);
				obj.exteriorAngles[v].line1.vector = vector2;
				obj.exteriorAngles[v].line1.pos = pos2;
				obj.exteriorAngles[v].line2.vector = vector1;
				obj.exteriorAngles[v].line2.pos = pos1;
			}
		}
	},
	startPosDrag: function () {
		changeDrawMode('polygonPointDrag');
		draw.currPathNum = draw.currCursor.pathNum;
		draw.currPoint = draw.currCursor.point;
		updateSnapPoints(); // update intersection points
		draw.animate(draw.polygon.posMove,draw.polygon.posStop,drawCanvasPaths);
		//addListenerMove(window, draw.polygon.posMove);
		//addListenerEnd(window, draw.polygon.posStop);
	},
	posMove: function (e) {
		updateMouse(e);
		var x = draw.mouse[0];
		var y = draw.mouse[1];
		var pathNum = draw.currPathNum;
		var p = draw.currPoint;
		var obj = draw.path[pathNum].obj[0];
		var points = obj.points;

		if (snapToObj2On || draw.snapLinesTogether) {
			var pos = snapToObj2([x, y], pathNum);
		} else if (shiftOn && obj.polygonType !== 'square') { // snap horiz / vert to adjacent vertices
			var pos = null;
			if (!un(obj.polygonType) && obj.points.length == 4 && (obj.polygonType == 'rhom' || obj.polygonType == 'kite')) {
				// special cases - snap v/h to opposite point
				if (p == 0) {
					if (Math.abs(x - points[2][0]) < draw.snapTolerance) {
						pos = [points[2][0], y];
					} else if (Math.abs(y - points[2][1]) < draw.snapTolerance) {
						pos = [x, points[2][1]];
					}
				} else if (p == 2) {
					if (Math.abs(x - points[0][0]) < draw.snapTolerance) {
						pos = [points[0][0], y];
					} else if (Math.abs(y - points[0][1]) < draw.snapTolerance) {
						pos = [x, points[0][1]];
					}
				}
			}
			if (pos == null && ['square', 'rect', 'para', 'trap'].includes(obj.polygonType) == false) {
				var prev = p - 1;
				if (prev == -1)
					prev = points.length - 1;
				var next = p + 1;
				if (next == points.length)
					next = 0;
				var diff = [Math.abs(x - points[prev][0]), Math.abs(y - points[prev][1]), Math.abs(x - points[next][0]), Math.abs(y - points[next][1])];
				var min = diff.indexOf(arrayMin(diff));
				if (pos == null && diff[0] < draw.snapTolerance && diff[3] < draw.snapTolerance) {
					pos = [points[prev][0], points[next][1]];
				}
				if (pos == null && diff[1] < draw.snapTolerance && diff[2] < draw.snapTolerance) {
					pos = [points[next][0], points[prev][1]];
				}
				if (pos == null && min == 0) {
					pos = [points[prev][0], y];
				}
				if (pos == null && min == 1) {
					pos = [x, points[prev][1]];
				}
				if (pos == null && min == 2) {
					pos = [points[next][0], y];
				}
				if (pos == null && min == 3) {
					pos = [x, points[next][1]];
				}
			}
		}
		if (pos == null)
			var pos = [x, y];

		if (obj.anglesMode == 'exterior' && !un(obj.exteriorAngles)) {
			for (var v = 0; v < obj.exteriorAngles.length; v++) {
				obj.exteriorAngles[v].line1.dist = getDist(points[v], obj.exteriorAngles[v].line1.pos);
				obj.exteriorAngles[v].line2.dist = getDist(points[v], obj.exteriorAngles[v].line2.pos);
			}
		}

		if (!un(obj.polygonType) && (obj.points.length == 4 || obj.points.length == 3) && obj.polygonType !== 'none') {
			switch (obj.polygonType) {
			case 'square':
				if (!shiftOn) {
					var pivot; // test if a previous point has been moved and use this as a pivot
					if (!un(obj._pivotPoint)) {
						if (obj._pivotPoint[0] !== p) {
							pivot = obj._pivotPoint[0];
						} else if (!un(obj._pivotPoint[1])) {
							pivot = obj._pivotPoint[1];
						}
					}
					if (!un(pivot)) {
						points[p] = pos;

						var p2 = [];
						for (var p3 = p; p3 < p + 4; p3++) {
							p2.push(p3 % 4);
						};

						if (pivot - p == 1 || p - pivot == 3) {
							var sideLen = getDist(points[p], points[pivot]);
							var vector1 = getVectorAB(points[p], points[pivot]);
							var vector2 = rotateVector(vector1, Math.PI / 2);
							points[p2[3]] = pointAddVector(points[p], setVectorMag(vector2, sideLen));
							points[p2[2]] = pointAddVector(points[pivot], setVectorMag(vector2, sideLen));
							break;
						} else if (pivot - p == -1 || p - pivot == -3) {
							var sideLen = getDist(points[p], points[pivot]);
							var vector1 = getVectorAB(points[p], points[pivot]);
							var vector2 = rotateVector(vector1, -Math.PI / 2);
							points[p2[1]] = pointAddVector(points[p], setVectorMag(vector2, sideLen));
							points[p2[2]] = pointAddVector(points[pivot], setVectorMag(vector2, sideLen));
							break;
						}
					}
				}

				var p2 = []; // p2[0] is moving point, p2[2] is opposite
				for (var p3 = p; p3 < p + 4; p3++) {
					p2.push(p3 % 4);
				};

				if (shiftOn) {
					var dir = [];
					var xDiff = pos[0] - points[p2[2]][0];
					var yDiff = pos[1] - points[p2[2]][1];
					var xDir = xDiff < 0 ? -1 : 1;
					var yDir = yDiff < 0 ? -1 : 1;
					var diff = Math.min(Math.abs(xDiff), Math.abs(yDiff));
					points[p] = [points[p2[2]][0] + xDir * diff, points[p2[2]][1] + yDir * diff]
				} else {
					points[p] = pos;
				}
				var sideLen = getDist(points[p], points[p2[2]]) / Math.sqrt(2);
				var diagVector = getVectorAB(points[p], points[p2[2]]);
				var vector1 = rotateVector(diagVector, -Math.PI / 4);
				var vector2 = rotateVector(diagVector, Math.PI / 4);
				points[p2[1]] = pointAddVector(points[p], setVectorMag(vector1, sideLen));
				points[p2[3]] = pointAddVector(points[p], setVectorMag(vector2, sideLen));
				break;
			case 'rect':
				if (p == 0 || p == 1) {
					if (shiftOn) {
						var pos2 = p == 0 ? points[1] : points[0];
						if (Math.abs(pos[0] - pos2[0]) < Math.abs(pos[1] - pos2[1])) {
							pos[0] = pos2[0];
						} else {
							pos[1] = pos2[1];
						}
					}
					var sideLen = getDist(points[1], points[2]);
					points[p] = pos;
					var vector1 = getVectorAB(points[0], points[1]);
					var vector2 = setVectorMag(getPerpVector(vector1), sideLen);
					points[2] = pointAddVector(points[1], vector2);
					points[3] = pointAddVector(points[0], vector2);
				} else if (p == 2) {
					var vector1 = getVectorAB(points[1], points[2]);
					var mag = getDist([x, y], points[1]);
					points[2] = pointAddVector(points[1], setVectorMag(vector1, mag));
					points[3] = pointAddVector(points[0], setVectorMag(vector1, mag));
				}
				break;
			case 'para':
				if (p == 0 || p == 1) {
					if (shiftOn) {
						var pos2 = p == 0 ? points[1] : points[0];
						if (Math.abs(pos[0] - pos2[0]) < Math.abs(pos[1] - pos2[1])) {
							pos[0] = pos2[0];
						} else {
							pos[1] = pos2[1];
						}
					}
					var vector1 = getVectorAB(points[0], points[1]);
					var angle1 = getVectorAngle(vector1);
					var vector2 = getVectorAB(points[1], points[2]);
					points[p] = pos;
					var vector3 = getVectorAB(points[0], points[1]);
					var angle3 = getVectorAngle(vector3);
					var vector4 = rotateVector(vector2, angle3 - angle1);
					points[2] = pointAddVector(points[1], vector4);
					points[3] = pointAddVector(points[0], vector4);
				} else if (p == 2) {
					points[p] = pos;
					var vector1 = getVectorAB(points[1], points[2]);
					points[3] = pointAddVector(points[0], vector1);
				}
				break;
			case 'trap':
				var vector1a = getVectorAB(points[0], points[1]);
				var vector2a = getVectorAB(points[1], points[2]);
				var vector3a = getVectorAB(points[0], points[3]);
				var vector4a = getVectorAB(points[2], points[3]);
				var angle1a = getVectorAngle(vector1a);
				points[p] = pos;
				switch (p) {
				case 0:
				case 1:
					if (shiftOn) {
						var pos2 = p == 0 ? points[1] : points[0];
						if (Math.abs(pos[0] - pos2[0]) < Math.abs(pos[1] - pos2[1])) {
							pos[0] = pos2[0];
						} else {
							pos[1] = pos2[1];
						}
					}
					var vector1b = getVectorAB(points[0], points[1]);
					var angle1b = getVectorAngle(vector1b);
					var vector2b = rotateVector(vector2a, angle1b - angle1a);
					var vector3b = rotateVector(vector3a, angle1b - angle1a);
					points[2] = pointAddVector(points[1], vector2b);
					points[3] = pointAddVector(points[0], vector3b);
					break;
				case 2:
					points[3] = getVectorLinesIntersection(points[2], vector4a, points[0], vector3a);
					break;
				case 3:
					points[2] = getVectorLinesIntersection(points[3], vector4a, points[1], vector2a);
					break;
				}
				break;
			case 'rhom':
				var mid = getMidpoint(points[0], points[2]);
				var vector1 = getVectorAB(mid, points[1]);
				var vector3 = getVectorAB(mid, points[3]);
				if (p == 0 || p == 2) {
					points[p] = pos;
					var mid2 = getMidpoint(points[0], points[2]);
					var vector2 = getVectorAB(points[0], points[2]);
					var vector4 = setVectorMag(getPerpVector(vector2), getVectorMag(vector1)); ;
					points[1] = pointAddVector(mid2, vector4, -1);
					points[3] = pointAddVector(mid2, vector4);
				} else if (p == 1) {
					var mag = getDist(mid, [x, y]);
					points[1] = pointAddVector(mid, setVectorMag(vector1, mag));
					points[3] = pointAddVector(mid, setVectorMag(vector3, mag));
				}
				break;
			case 'kite':
				if (p == 0) {
					var vector1a = getVectorAB(points[2], points[1]);
					var vector2a = getVectorAB(points[2], points[3]);
					var vector3a = getVectorAB(points[2], points[0]);
					points[p] = pos;
					var vector3b = getVectorAB(points[2], points[0]);
					var angle1 = getVectorAngle(vector3a);
					var angle2 = getVectorAngle(vector3b);
					var vector1b = rotateVector(vector1a, angle2 - angle1);
					var vector2b = rotateVector(vector2a, angle2 - angle1);
					points[1] = pointAddVector(points[2], vector1b);
					points[3] = pointAddVector(points[2], vector2b);
				} else if (p == 2) {
					var vector1a = getVectorAB(points[0], points[1]);
					var vector2a = getVectorAB(points[0], points[3]);
					var vector3a = getVectorAB(points[0], points[2]);
					points[p] = pos;
					var vector3b = getVectorAB(points[0], points[2]);
					var angle1 = getVectorAngle(vector3a);
					var angle2 = getVectorAngle(vector3b);
					var vector1b = rotateVector(vector1a, angle2 - angle1);
					var vector2b = rotateVector(vector2a, angle2 - angle1);
					points[1] = pointAddVector(points[0], vector1b);
					points[3] = pointAddVector(points[0], vector2b);
				} else if (p == 1) {
					points[p] = pos;
					var vector1 = getVectorAB(points[0], points[2]);
					var mid = getFootOfPerp(points[0], vector1, points[1]);
					var vector2 = getVectorAB(mid, points[1]);
					points[3] = pointAddVector(mid, vector2, -1);
				}
				break;
			case 'equi':
				var p0 = p;
				var p1 = (p + 1) % 3;
				var p2 = (p + 2) % 3;
				points[p0] = pos;
				var vector1 = getVectorAB(points[p2], points[p0]);
				var vector2 = rotateVector(vector1, 2 * Math.PI / 3);
				points[p1] = pointAddVector(points[p0], vector2, 1);
				break;
			case 'isos':
				if (p == 0 || p == 1) {
					points[p] = pos;
					var vector1 = getVectorAB(points[0], points[1]);
					var vector2 = getPerpVector(vector1);
					var mid = getMidpoint(points[0], points[1]);
					points[2] = pointAddVector(mid, vector2, 1.17);
				} else {
					var vector1 = getVectorAB(points[0], points[1]);
					var perpDist = getPerpDist(points[0], vector1, pos);
					var vector2 = getPerpVector(vector1);
					var mid = getMidpoint(points[0], points[1]);
					points[2] = pointAddVector(mid, getUnitVector(vector2), perpDist);
				}
				break;
			case 'right':
				if (p == 1) {
					var vector1 = getVectorAB(points[1], points[0]);
					var vector2 = getVectorAB(points[1], points[2]);
					points[1] = pos;
					points[0] = pointAddVector(pos, vector1, 1);
					points[2] = pointAddVector(pos, vector2, 1);
				} else if (p == 0) {
					var vector1 = getVectorAB(points[1], points[0]);
					var vector2 = getVectorAB(points[1], pos);
					var angle = getVectorAngle(vector2) - getVectorAngle(vector1);
					var vector3 = getVectorAB(points[1], points[2]);
					var vector4 = rotateVector(vector3, angle);
					points[0] = pos;
					points[2] = pointAddVector(points[1], vector4, 1);
				} else if (p == 2) {
					var vector1 = getVectorAB(points[1], points[2]);
					var vector2 = getVectorAB(points[1], pos);
					var angle = getVectorAngle(vector2) - getVectorAngle(vector1);
					var vector3 = getVectorAB(points[1], points[0]);
					var vector4 = rotateVector(vector3, angle);
					points[2] = pos;
					points[0] = pointAddVector(points[1], vector4, 1);
				}
				break;
			case 'rightisos':
				if (p == 1) {
					var vector1 = getVectorAB(points[1], points[0]);
					var vector2 = getVectorAB(points[1], points[2]);
					points[1] = pos;
					points[0] = pointAddVector(pos, vector1, 1);
					points[2] = pointAddVector(pos, vector2, 1);
				} else if (p == 0) {
					var vector1 = getVectorAB(points[1], pos);
					var vector2 = getPerpVector(vector1);
					points[0] = pos;
					points[2] = pointAddVector(points[1], vector2, -1);
				} else if (p == 2) {
					var vector1 = getVectorAB(points[1], pos);
					var vector2 = getPerpVector(vector1);
					points[2] = pos;
					points[0] = pointAddVector(points[1], vector2, 1);
				}
				break;
			}
		} else {
			points[p] = pos;
		}
		if (obj.anglesMode == 'exterior' && !un(obj.exteriorAngles)) {
			for (var v = 0; v < obj.exteriorAngles.length; v++) {
				var prev = v - 1;
				if (prev == -1)
					prev = points.length - 1;
				var next = v + 1;
				if (next == points.length)
					next = 0;
				var vector1 = getVectorAB(points[prev], points[v]);
				var pos1 = pointAddVector(points[v], getUnitVector(vector1), obj.exteriorAngles[v].line2.dist);
				var vector2 = getVectorAB(points[next], points[v]);
				var pos2 = pointAddVector(points[v], getUnitVector(vector2), obj.exteriorAngles[v].line1.dist);
				obj.exteriorAngles[v].line1.vector = vector2;
				obj.exteriorAngles[v].line1.pos = pos2;
				obj.exteriorAngles[v].line2.vector = vector1;
				obj.exteriorAngles[v].line2.pos = pos1;
			}
		}

		updateBorder(draw.path[pathNum]);
		//drawCanvasPaths();
		draw.prevX = mouse.x;
		draw.prevY = mouse.y;
	},
	posStop: function (e) {
		var pathNum = draw.currPathNum;
		var point = draw.currPoint;
		var obj = draw.path[pathNum].obj[0];
		/*if (draw.gridSnap == true && !(!un(obj.polygonType) && obj.points.length == 4 && ['square','rect','para','trap','rhom','kite'].indexOf(obj.polygonType) > -1)) {
		obj.points[point][0] = roundToNearest(obj.points[point][0],draw.gridSnapSize);
		obj.points[point][1] = roundToNearest(obj.points[point][1],draw.gridSnapSize);
		updateBorder(draw.path[pathNum]);
		drawCanvasPaths();
		}*/
		//removeListenerMove(window, draw.polygon.posMove);
		//removeListenerEnd(window, draw.polygon.posStop);
		changeDrawMode();
		draw.prevX = null;
		draw.prevY = null;

		if (!un(obj.polygonType) && obj.polygonType == 'square') {
			if (un(obj._pivotPoint))
				obj._pivotPoint = [];
			if (obj._pivotPoint.includes(point))
				obj._pivotPoint.splice(obj._pivotPoint.indexOf(point), 1);
			obj._pivotPoint.unshift(point);
		}

	},
	startPrismPointDrag: function () {
		changeDrawMode('polygonPrismPointDrag');
		draw.prevX = draw.mouse[0];
		draw.prevY = draw.mouse[1];
		draw.currPathNum = draw.currCursor.pathNum;
		updateSnapPoints(); // update intersection points
		draw.animate(draw.polygon.prismPointMove,draw.polygon.prismPointStop,drawCanvasPaths);
		//addListenerMove(window, draw.polygon.prismPointMove);
		//addListenerEnd(window, draw.polygon.prismPointStop);
	},
	prismPointMove: function (e) {
		updateMouse(e);
		var dx = draw.mouse[0] - draw.prevX;
		var dy = draw.mouse[1] - draw.prevY;
		var pathNum = draw.currPathNum;
		var obj = draw.path[pathNum].obj[0];
		obj.prismVector[0] += dx;
		obj.prismVector[1] += dy;
		updateBorder(draw.path[pathNum]);
		//drawCanvasPaths();
		draw.prevX = mouse.x;
		draw.prevY = mouse.y;
	},
	prismPointStop: function (e) {
		//removeListenerMove(window, draw.polygon.prismPointMove);
		//removeListenerEnd(window, draw.polygon.prismPointStop);
		changeDrawMode();
		draw.prevX = null;
		draw.prevY = null;
	},
	startExtAnglePointDrag: function () {
		changeDrawMode('polygonExtAnglePointDrag');
		draw.currPathNum = draw.currCursor.pathNum;
		draw.currPoint = draw.currCursor.point;
		draw.currLine = draw.currCursor.line;
		updateSnapPoints(); // update intersection points
		draw.animate(draw.polygon.extAnglePointMove,draw.polygon.extAnglePointStop,drawCanvasPaths);
		//addListenerMove(window, draw.polygon.extAnglePointMove);
		//addListenerEnd(window, draw.polygon.extAnglePointStop);
	},
	extAnglePointMove: function (e) {
		updateMouse(e);
		var x = draw.mouse[0];
		var y = draw.mouse[1];
		var pathNum = draw.currPathNum;
		var v = draw.currPoint;
		var line = draw.currLine;
		var obj = draw.path[pathNum].obj[0];
		var d = getDist([x, y], obj.points[v]);
		if (draw.currLine == 1) {
			obj.exteriorAngles[v].line1.dist = d;
			obj.exteriorAngles[v].line1.vector = setVectorMag(obj.exteriorAngles[v].line1.vector, d);
			obj.exteriorAngles[v].line1.pos = pointAddVector(obj.points[v], obj.exteriorAngles[v].line1.vector);
		} else {
			obj.exteriorAngles[v].line2.dist = d;
			obj.exteriorAngles[v].line2.vector = setVectorMag(obj.exteriorAngles[v].line2.vector, d);
			obj.exteriorAngles[v].line2.pos = pointAddVector(obj.points[v], obj.exteriorAngles[v].line2.vector);
		}
		updateBorder(draw.path[pathNum]);
		//drawCanvasPaths();
	},
	extAnglePointStop: function (e) {
		//removeListenerMove(window, draw.polygon.extAnglePointMove);
		//removeListenerEnd(window, draw.polygon.extAnglePointStop);
		changeDrawMode();
		draw.currPoint = null;
		draw.currLine = null;
	},
	verticesMinus: function () {
		var pathNum = draw.currCursor.pathNum;
		var obj = draw.path[pathNum].obj[0];
		var p = obj.points.length - 1;
		if (p < 2)
			return;
		if (!un(obj.angles) && !un(obj.angles[p]))
			obj.angles[p] = null;
		obj.points.pop();
		updateBorder(draw.path[pathNum]);
		drawCanvasPaths();
	},
	verticesPlus: function () {
		var pathNum = draw.currCursor.pathNum;
		var first = draw.path[pathNum].obj[0].points[0];
		var last = draw.path[pathNum].obj[0].points[draw.path[pathNum].obj[0].points.length - 1];
		draw.path[pathNum].obj[0].points.push([(first[0] + last[0]) / 2, (first[1] + last[1]) / 2]);
		updateBorder(draw.path[pathNum]);
		drawCanvasPaths();
	},
	setType: function () {
		var pathNum = draw.currCursor.pathNum;
		var obj = draw.path[pathNum].obj[0];
		var type = draw.currCursor.type;
		if (obj.polygonType == type) {
			obj.polygonType = 'none';
		} else {
			obj.polygonType = type;
		}
		switch (obj.polygonType) {
		case 'square':
			var vector1 = getVectorAB(obj.points[0], obj.points[1]);
			var vector2 = getPerpVector(vector1);
			obj.points[2] = pointAddVector(obj.points[1], vector2);
			obj.points[3] = pointAddVector(obj.points[2], vector1, -1);
			break;
		case 'rect':
			var vector1 = getVectorAB(obj.points[0], obj.points[1]);
			var vector2 = getPerpVector(vector1);
			vector2 = setVectorMag(vector2, getDist(obj.points[1], obj.points[2]));
			obj.points[2] = pointAddVector(obj.points[1], vector2, 1);
			obj.points[3] = pointAddVector(obj.points[0], vector2, 1);
			break;
		case 'para':
			var vector1 = getVectorAB(obj.points[0], obj.points[1]);
			obj.points[3] = pointAddVector(obj.points[2], vector1, -1);
			break;
		case 'trap':
			var vector1 = getVectorAB(obj.points[0], obj.points[1]);
			vector1 = setVectorMag(vector1, getDist(obj.points[2], obj.points[3]));
			obj.points[3] = pointAddVector(obj.points[2], vector1, -1);
			break;
		case 'rhom':
			var vector1 = getVectorAB(obj.points[0], obj.points[1]);
			var vector2 = getVectorAB(obj.points[1], obj.points[2]);
			vector2 = setVectorMag(vector2, getDist(obj.points[0], obj.points[1]));
			obj.points[2] = pointAddVector(obj.points[1], vector2);
			obj.points[3] = pointAddVector(obj.points[2], vector1, -1);
			break;
		case 'kite':
			var vector1 = getVectorAB(obj.points[0], obj.points[2]);
			var mid = getFootOfPerp(obj.points[0], vector1, obj.points[1]);
			var vector2 = getVectorAB(mid, obj.points[1]);
			obj.points[3] = pointAddVector(mid, vector2, -1);
			break;
		}
		updateBorder(draw.path[pathNum]);
		drawCanvasPaths();
	},
	setPrism: function () {
		if (!un(draw.currCursor.pathNum)) {
			var path = draw.path[draw.currCursor.pathNum];
		} else {
			var path = selPath();
		}
		var obj = path.obj[0];
		if (obj.type !== 'polygon')
			return;
		if (obj.solidType == 'prism') {
			delete obj.solidType;
		} else {
			obj.solidType = 'prism';
			if (un(obj.prismVector))
				obj.prismVector = [100, -100];
		}
		var pathNum = draw.currCursor.pathNum;
		updateBorder(path);
		drawCanvasPaths();
	},
	setOuterAngles: function () {
		if (!un(draw.currCursor.pathNum)) {
			var path = draw.path[draw.currCursor.pathNum];
		} else {
			var path = selPath();
		}
		var obj = path.obj[0];
		if (obj.type !== 'polygon')
			return;
		obj.solidType = 'none';
		if (obj.anglesMode == 'outer') {
			obj.anglesMode = 'none';
		} else {
			obj.anglesMode = 'outer'
		}
		if (un(obj.outerAngles))
			obj.outerAngles = [];
		var pathNum = draw.currCursor.pathNum;
		updateBorder(path);
		drawCanvasPaths();
	},
	setExteriorAngles: function () {
		if (!un(draw.currCursor.pathNum)) {
			var path = draw.path[draw.currCursor.pathNum];
		} else {
			var path = selPath();
		}
		var obj = path.obj[0];
		if (obj.type !== 'polygon')
			return;
		obj.solidType = 'none';
		if (obj.anglesMode == 'exterior') {
			obj.anglesMode = 'none';
		} else {
			obj.anglesMode = 'exterior'
		}
		if (un(obj.exteriorAngles))
			obj.exteriorAngles = [];
		for (var p = 0; p < obj.points.length; p++) {
			if (!un(obj.exteriorAngles[p]))
				continue;
			var prev = p - 1;
			if (prev == -1)
				prev = obj.points.length - 1;
			var next = p + 1;
			if (next == obj.points.length)
				next = 0;
			var vector1 = getVectorAB(obj.points[prev], obj.points[p]);
			var pos1 = pointAddVector(obj.points[p], getUnitVector(vector1), 60);
			var vector2 = getVectorAB(obj.points[next], obj.points[p]);
			var pos2 = pointAddVector(obj.points[p], getUnitVector(vector2), 60);
			obj.exteriorAngles[p] = {
				line1: {
					show: false,
					vector: vector2,
					pos: pos2,
					dist: 60
				},
				line2: {
					show: false,
					vector: vector1,
					pos: pos1,
					dist: 60
				}
			}
			console.log(p, obj.exteriorAngles[p]);
		}
		var pathNum = draw.currCursor.pathNum;
		updateBorder(path);
		drawCanvasPaths();
	},
	setAngleStyle: function () {
		if (!un(draw.currCursor.pathNum)) {
			var path = draw.path[draw.currCursor.pathNum];
		} else {
			var path = selPath();
		}
		var obj = path.obj[0];
		if (obj.type !== 'polygon')
			return;
		var p = draw.currCursor.point;
		if (obj.anglesMode == 'outer') {
			var prev = p - 1;
			if (prev == -1)
				prev = obj.points.length - 1;
			var next = p + 1;
			if (next == obj.points.length)
				next = 0;
			var a1 = posToAngle(obj.points[prev][0], obj.points[prev][1], obj.points[p][0], obj.points[p][1]);
			var a2 = posToAngle(mouse.x - draw.drawRelPos[0], mouse.y - draw.drawRelPos[1], obj.points[p][0], obj.points[p][1]);
			var a3 = posToAngle(obj.points[next][0], obj.points[next][1], obj.points[p][0], obj.points[p][1]);
			if (anglesInOrder(a1, a2, a3) == true) {
				obj.outerAngles[p] = angleStyleIncrement(obj.outerAngles[p]);
			} else {
				obj.angles[p] = angleStyleIncrement(obj.angles[p]);
			}
		} else if (obj.anglesMode == 'exterior') {
			var prev = p - 1;
			if (prev == -1)
				prev = obj.points.length - 1;
			var next = p + 1;
			if (next == obj.points.length)
				next = 0;
			var p1 = obj.points[prev];
			var p2 = obj.exteriorAngles[p].line1.pos;
			var p3 = obj.exteriorAngles[p].line2.pos;
			var p4 = obj.points[next];
			var a1 = posToAngle(p1[0], p1[1], obj.points[p][0], obj.points[p][1]);
			var a2 = posToAngle(p2[0], p2[1], obj.points[p][0], obj.points[p][1]);
			var a3 = posToAngle(p3[0], p3[1], obj.points[p][0], obj.points[p][1]);
			var a4 = posToAngle(p4[0], p4[1], obj.points[p][0], obj.points[p][1]);
			var aMouse = posToAngle(mouse.x - draw.drawRelPos[0], mouse.y - draw.drawRelPos[1], obj.points[p][0], obj.points[p][1]);
			if (anglesInOrder(a1, aMouse, a2) == true) {
				obj.exteriorAngles[p].a3 = angleStyleIncrement(obj.exteriorAngles[p].a3);

			} else if (anglesInOrder(a2, aMouse, a3) == true) {
				obj.exteriorAngles[p].a2 = angleStyleIncrement(obj.exteriorAngles[p].a2);
			} else if (anglesInOrder(a3, aMouse, a4) == true) {
				obj.exteriorAngles[p].a1 = angleStyleIncrement(obj.exteriorAngles[p].a1);
			} else {
				obj.angles[p] = angleStyleIncrement(obj.angles[p]);
			}
			if (!un(obj.exteriorAngles[p].a3) || !un(obj.exteriorAngles[p].a2)) {
				obj.exteriorAngles[p].line1.show = true;
			} else {
				obj.exteriorAngles[p].line1.show = false;
			}
			if (!un(obj.exteriorAngles[p].a1) || !un(obj.exteriorAngles[p].a2)) {
				obj.exteriorAngles[p].line2.show = true;
			} else {
				obj.exteriorAngles[p].line2.show = false;
			}
		} else {
			obj.angles[p] = angleStyleIncrement(obj.angles[p]);
		}
		var pathNum = draw.currCursor.pathNum;
		updateBorder(path);
		drawCanvasPaths();
	},
	toggleOuterAngle: function () {
		if (!un(draw.currCursor.pathNum)) {
			var path = draw.path[draw.currCursor.pathNum];
		} else {
			var path = selPath();
		}
		var obj = path.obj[0];
		if (obj.type !== 'polygon')
			return;
		var p = draw.currCursor.point;
		if (un(obj.outerAngles))
			obj.outerAngles = [];
		if (un(obj.outerAngles[p]))
			obj.outerAngles[p] = {
				style: 0,
				radius: 30,
				labelMeasure: true,
				labelFontSize: 25,
				labelRadius: 33,
				measureLabelOnly: true
			};
		angleStyleIncrement(obj.outerAngles[p]);
		drawCanvasPaths();
	},
	toggleOuterAngleLabel: function () {
		if (!un(draw.currCursor.pathNum)) {
			var path = draw.path[draw.currCursor.pathNum];
		} else {
			var path = selPath();
		}
		var obj = path.obj[0];
		if (obj.type !== 'polygon')
			return;
		var p = draw.currCursor.point;
		if (un(obj.outerAngles))
			obj.outerAngles = [];
		if (un(obj.outerAngles[p]))
			obj.outerAngles[p] = {
				style: 0,
				radius: 30,
				labelMeasure: true,
				labelFontSize: 25,
				labelRadius: 33,
				drawCurve: false,
				measureLabelOnly: true
			};
		obj.outerAngles[p].measureLabelOnly = !obj.outerAngles[p].measureLabelOnly;
		drawCanvasPaths();
	},
	toggleExteriorAngle: function () {
		if (!un(draw.currCursor.pathNum)) {
			var path = draw.path[draw.currCursor.pathNum];
		} else {
			var path = selPath();
		}
		var obj = path.obj[0];
		if (obj.type !== 'polygon')
			return;
		var p = draw.currCursor.point;
		var s = draw.currCursor.sub;
		if (un(obj.exteriorAngles))
			obj.exteriorAngles = [];
		if (un(obj.exteriorAngles[p]))
			obj.exteriorAngles[p] = {};
		var a = obj.exteriorAngles[p];
		if (s == 1)
			var angle = a.a1;
		if (s == 2)
			var angle = a.a2;
		if (s == 3)
			var angle = a.a3;
		if (un(angle))
			angle = {
				style: 0,
				radius: 30,
				labelMeasure: true,
				labelFontSize: 25,
				labelRadius: 33,
				measureLabelOnly: true
			};
		angleStyleIncrement(angle);
		if (s == 1)
			a.a1 = angle;
		if (s == 2)
			a.a2 = angle;
		if (s == 3)
			a.a3 = angle;
		if ((!un(a.a3) && a.a3.drawCurve !== false) || (!un(a.a2) && a.a2.drawCurve !== false)) {
			a.line1.show = true;
		} else {
			a.line1.show = false;
		}
		if ((!un(a.a1) && a.a1.drawCurve !== false) || (!un(a.a2) && a.a2.drawCurve !== false)) {
			a.line2.show = true;
		} else {
			a.line2.show = false;
		}
		drawCanvasPaths();
	},
	toggleExteriorAngleLabel: function () {
		if (!un(draw.currCursor.pathNum)) {
			var path = draw.path[draw.currCursor.pathNum];
		} else {
			var path = selPath();
		}
		var obj = path.obj[0];
		if (obj.type !== 'polygon')
			return;
		var p = draw.currCursor.point;
		var s = draw.currCursor.sub;
		if (un(obj.exteriorAngles))
			obj.exteriorAngles = [];
		if (un(obj.exteriorAngles[p]))
			obj.exteriorAngles[p] = {};
		var a = obj.exteriorAngles[p];
		if (s == 1)
			var angle = a.a1;
		if (s == 2)
			var angle = a.a2;
		if (s == 3)
			var angle = a.a3;
		if (un(angle))
			angle = {
				style: 0,
				radius: 30,
				labelMeasure: true,
				labelFontSize: 25,
				labelRadius: 33,
				drawCurve: false,
				measureLabelOnly: true
			};
		angle.measureLabelOnly = !angle.measureLabelOnly;
		if (s == 1)
			a.a1 = angle;
		if (s == 2)
			a.a2 = angle;
		if (s == 3)
			a.a3 = angle;
		drawCanvasPaths();
	},
	toggleAngle: function () {
		if (!un(draw.currCursor.pathNum)) {
			var path = draw.path[draw.currCursor.pathNum];
		} else {
			var path = selPath();
		}
		var obj = path.obj[0];
		if (obj.type !== 'polygon')
			return;
		var p = draw.currCursor.point;
		if (un(obj.angles))
			obj.angles = [];
		if (un(obj.angles[p]))
			obj.angles[p] = {
				style: 0,
				radius: 30,
				labelMeasure: true,
				labelFontSize: 25,
				labelRadius: 33,
				measureLabelOnly: true
			};
		//obj.angles[p].drawCurve = !obj.angles[p].drawCurve;
		angleStyleIncrement(obj.angles[p]);
		drawCanvasPaths();
	},
	toggleAngleLabel: function () {
		if (!un(draw.currCursor.pathNum)) {
			var path = draw.path[draw.currCursor.pathNum];
		} else {
			var path = selPath();
		}
		var obj = path.obj[0];
		if (obj.type !== 'polygon')
			return;
		var p = draw.currCursor.point;
		if (un(obj.angles))
			obj.angles = [];
		if (un(obj.angles[p]))
			obj.angles[p] = {
				style: 0,
				radius: 30,
				labelMeasure: true,
				labelFontSize: 25,
				labelRadius: 33,
				drawCurve: false,
				measureLabelOnly: true
			};
		obj.angles[p].measureLabelOnly = !obj.angles[p].measureLabelOnly;
		drawCanvasPaths();
	},
	setLineDecoration: function () {
		var obj = draw.path[draw.currCursor.pathNum].obj[0];
		var p = draw.currCursor.point;
		if (un(obj.lineDecoration))
			obj.lineDecoration = [];
		if (typeof obj.lineDecoration[p] == 'undefined' || obj.lineDecoration[p] == null) {
			obj.lineDecoration[p] = {
				style: 0,
				type: 'dash',
				number: 1
			};
		} else {
			switch (obj.lineDecoration[p].style) {
			case 0:
				obj.lineDecoration[p] = {
					style: 1,
					type: 'dash',
					number: 2
				};
				break;
			case 1:
				obj.lineDecoration[p] = {
					style: 2,
					type: 'arrow',
					direction: 1,
					number: 1
				};
				break;
			case 2:
				obj.lineDecoration[p] = {
					style: 3,
					type: 'arrow',
					direction: 1,
					number: 2
				};
				break;
			case 3:
				obj.lineDecoration[p] = {
					style: 4,
					type: 'arrow',
					direction: -1,
					number: 1
				};
				break;
			case 4:
				obj.lineDecoration[p] = {
					style: 5,
					type: 'arrow',
					direction: -1,
					number: 2
				};
				break;
			case 5:
			default:
				obj.lineDecoration[p] = undefined;
				break;
			}
		}
		var pathNum = draw.currCursor.pathNum;
		updateBorder(draw.path[pathNum]);
		drawCanvasPaths();
	},
	makeRegular: function () {
		if (!un(draw.currCursor.pathNum)) {
			var path = draw.path[draw.currCursor.pathNum];
		} else {
			var path = selPath();
		}
		var obj = path.obj[0];
		if (obj.type !== 'polygon')
			return;

		var center = [obj._left + 0.5 * obj._width, obj._top + 0.5 * obj._height];
		var radius = 0.5 * Math.min(obj._width, obj._height);
		var numOfSides = obj.points.length;
		var startAngle = -0.5 * Math.PI;
		if (numOfSides % 2 == 0) {
			startAngle += (Math.PI / numOfSides)
		}
		var angle = startAngle;
		obj.points = [];
		for (var i = 0; i < numOfSides; i++) {
			obj.points[i] = [center[0] + radius * Math.cos(angle), center[1] + radius * Math.sin(angle)];
			angle += (2 * Math.PI) / numOfSides;
		}
		obj.clockwise = false;
		updateBorder(path);
		drawCanvasPaths();
	},
	rotate: function (angle) {
		var obj = sel();
		var center = getCentroid(obj.points);
		for (var p = 0; p < obj.points.length; p++)
			obj.points[p] = rotate(center, obj.points[p], angle);
		var path = selPath();
		updateBorder(path);
		drawSelectedPaths();
		drawSelectCanvas();

		function getCentroid(coords) {
			var center = coords.reduce(function (x, y) {
					return [x[0] + y[0] / coords.length, x[1] + y[1] / coords.length]
				}, [0, 0])
				return center;
		}

		function rotate(center, point, angle) {
			var radians = (Math.PI / 180) * angle,
			cos = Math.cos(radians),
			sin = Math.sin(radians),
			nx = (cos * (point[0] - center[0])) + (sin * (point[1] - center[1])) + center[0],
			ny = (cos * (point[1] - center[1])) - (sin * (point[0] - center[0])) + center[1];
			return [nx, ny];
		}
	},
	reflect: function (dir) {
		var obj = sel();
		if (un(dir))
			dir = 'h';
		var center = getCentroid(obj.points);
		for (var p = 0; p < obj.points.length; p++)
			obj.points[p] = reflect(center, obj.points[p], dir);
		obj.points.reverse();
		var path = selPath();
		updateBorder(path);
		drawSelectedPaths();
		drawSelectCanvas();

		function getCentroid(coords) {
			var center = coords.reduce(function (x, y) {
					return [x[0] + y[0] / coords.length, x[1] + y[1] / coords.length]
				}, [0, 0])
				return center;
		}

		function reflect(center, point, dir) {
			if (dir == 'h') {
				point[0] = center[0] + (center[0] - point[0]);
			} else {
				point[1] = center[1] + (center[1] - point[1]);
			}
			return point;
		}
	},
	drawButton: function (ctx, size, type) {
		var pos = [[20, 50], [45, 25], [80, 65], [60, 80], [40, 80], [20, 50]];
		for (var p = 0; p < pos.length; p++) {
			pos[p][0] = pos[p][0] * (size / 100);
			pos[p][1] = pos[p][1] * (size / 100);
		}
		ctx.beginPath();
		drawPolygon({
			ctx: ctx,
			points: pos,
			lineWidth: size * 0.02
		});
		ctx.stroke();
	},
	scale: function (obj, sf, center) {
		if (un(center))
			var center = obj.points[0];
		for (var p = 0; p < obj.points.length; p++) {
			obj.points[p][0] = center[0] + sf * (obj.points[p][0] - center[0]);
			obj.points[p][1] = center[1] + sf * (obj.points[p][1] - center[1]);
		}
		if (!un(obj.thickness))
			obj.thickness *= sf;
		if (!un(obj.dash)) {
			if (!un(obj.dash[0]))
				obj.dash[0] *= sf;
			if (!un(obj.dash[1]))
				obj.dash[1] *= sf;
		}
		if (!un(obj.outerAngles)) {
			// exterior?
			// line dec
		}
	},
	addLabels: function (obj) {
		if (un(obj))
			obj = sel();
		if (obj.type !== 'polygon' || un(obj._textSnapPos))
			return;
		var count = 0;
		for (var p = 0; p < obj._textSnapPos.length; p++) {
			var pos = obj._textSnapPos[p];
			if (pos.type !== 'polygonVertex')
				continue;
			var letter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[count];
			count++;
			var align = pos.align;
			var x = pos.pos[0] + (align[0] == 0 ? -25 : align[0] == 1 ? -50 : 0);
			var y = pos.pos[1] + (align[1] == 0 ? -25 : align[1] == 1 ? -50 : 0);
			draw.path.push({
				obj: [{
						type: 'text2',
						align: clone(align),
						text: ['<<font:algebra>><<fontSize:28>>' + letter],
						rect: [x, y, 50, 50],
						tightRect: [x, y, 50, 50]
					}
				],
				selected: false
			});
		}
		drawCanvasPaths();
		draw.updateAllBorders();
	},
}
draw.polyTri = {
	add: function () {
		draw.polygon.add('none', 3);
	},
	drawButton: function (ctx, size) {
		var pos = [[20, 20], [30, 50], [80, 40]];
		ctx.beginPath();
		drawPolygon({
			ctx: ctx,
			points: pos,
			lineWidth: size * 0.02
		});
		ctx.stroke();
	}
}
draw.polyQuad = {
	add: function () {
		draw.polygon.add('none', 4);
	},
	drawButton: function (ctx, size) {
		var pos = [[20, 20], [30, 50], [80, 60], [60, 30]];
		ctx.beginPath();
		drawPolygon({
			ctx: ctx,
			points: pos,
			lineWidth: size * 0.02
		});
		ctx.stroke();
	}
}
draw.polySquare = {
	add: function () {
		draw.polygon.add('square', 4);
	},
	drawButton: function (ctx, size) {
		var pos = [[25, 20], [25, 70], [75, 70], [75, 20]];
		var lineDec = [{
				type: 'dash',
				length: 4
			}, {
				type: 'dash',
				length: 4
			}, {
				type: 'dash',
				length: 4
			}, {
				type: 'dash',
				length: 4
			}
		];
		var angles = [{
				radius: 15
			}, {
				radius: 15
			}, {
				radius: 15
			}, {
				radius: 15
			}
		];
		for (var p = 0; p < pos.length; p++) {
			pos[p][0] = pos[p][0] * (size / 100);
			pos[p][1] = pos[p][1] * (size / 100);
		}
		for (var d = 0; d < lineDec.length; d++) {
			if (un(lineDec[d]))
				continue;
			lineDec[d].length = lineDec[d].length * (size / 100);
		}
		for (var a = 0; a < angles.length; a++) {
			if (un(angles[a]))
				continue;
			angles[a].length = angles[a].radius * (size / 100);
		}
		ctx.beginPath();
		drawPolygon({
			ctx: ctx,
			points: pos,
			lineDecoration: lineDec,
			angles: angles,
			lineWidth: size * 0.02
		});
		ctx.stroke();
	}
}
draw.polyRect = {
	add: function () {
		draw.polygon.add('rect', 4);
	},
	drawButton: function (ctx, size) {
		var pos = [[15, 30], [15, 70], [85, 70], [85, 30]];
		var angles = [{
				radius: 15
			}, {
				radius: 15
			}, {
				radius: 15
			}, {
				radius: 15
			}
		];
		for (var p = 0; p < pos.length; p++) {
			pos[p][0] = pos[p][0] * (size / 100);
			pos[p][1] = pos[p][1] * (size / 100);
		}
		for (var a = 0; a < angles.length; a++) {
			if (un(angles[a]))
				continue;
			angles[a].length = angles[a].radius * (size / 100);
		}
		ctx.beginPath();
		drawPolygon({
			ctx: ctx,
			points: pos,
			angles: angles,
			lineWidth: size * 0.02
		});
		ctx.stroke();
	}
}
draw.polyPara = {
	add: function () {
		draw.polygon.add('para', 4);
	},
	drawButton: function (ctx, size) {
		var pos = [[20, 30], [30, 70], [80, 70], [70, 30]];
		var lineDec = [{
				type: 'arrow',
				length: 8,
				direction: 1,
				number: 1
			}, {
				type: 'arrow',
				length: 8,
				direction: 1,
				number: 2
			}, {
				type: 'arrow',
				length: 8,
				direction: -1,
				number: 1
			}, {
				type: 'arrow',
				length: 8,
				direction: -1,
				number: 2
			}
		];
		for (var p = 0; p < pos.length; p++) {
			pos[p][0] = pos[p][0] * (size / 100);
			pos[p][1] = pos[p][1] * (size / 100);
		}
		for (var d = 0; d < lineDec.length; d++) {
			if (un(lineDec[d]))
				continue;
			lineDec[d].length = lineDec[d].length * (size / 100);
		}
		ctx.beginPath();
		drawPolygon({
			ctx: ctx,
			points: pos,
			lineDecoration: lineDec,
			lineWidth: size * 0.02
		});
		ctx.stroke();
	}
}
draw.polyTrap = {
	add: function () {
		draw.polygon.add('trap', 4);
	},
	drawButton: function (ctx, size) {
		var pos = [[30, 30], [20, 70], [80, 70], [60, 30]];
		var lineDec = [{}, {
				type: 'arrow',
				length: 8,
				direction: 1,
				number: 2
			}, {}, {
				type: 'arrow',
				length: 8,
				direction: -1,
				number: 2
			}
		];
		for (var p = 0; p < pos.length; p++) {
			pos[p][0] = pos[p][0] * (size / 100);
			pos[p][1] = pos[p][1] * (size / 100);
		}
		for (var d = 0; d < lineDec.length; d++) {
			if (un(lineDec[d]))
				continue;
			lineDec[d].length = lineDec[d].length * (size / 100);
		}
		ctx.beginPath();
		drawPolygon({
			ctx: ctx,
			points: pos,
			lineDecoration: lineDec,
			lineWidth: size * 0.02
		});
		ctx.stroke();
	}
}
draw.polyRhom = {
	add: function () {
		draw.polygon.add('rhom', 4);
	},
	drawButton: function (ctx, size) {
		var pos = [[15, 50], [50, 80], [85, 50], [50, 20]];
		var lineDec = [{
				type: 'dash',
				length: 4
			}, {
				type: 'dash',
				length: 4
			}, {
				type: 'dash',
				length: 4
			}, {
				type: 'dash',
				length: 4
			}
		];
		for (var p = 0; p < pos.length; p++) {
			pos[p][0] = pos[p][0] * (size / 100);
			pos[p][1] = pos[p][1] * (size / 100);
		}
		for (var d = 0; d < lineDec.length; d++) {
			if (un(lineDec[d]))
				continue;
			lineDec[d].length = lineDec[d].length * (size / 100);
		}
		ctx.beginPath();
		drawPolygon({
			ctx: ctx,
			points: pos,
			lineDecoration: lineDec,
			lineWidth: size * 0.02
		});
		ctx.stroke();
	}
}
draw.polyKite = {
	add: function () {
		draw.polygon.add('kite', 4);
	},
	drawButton: function (ctx, size) {
		var pos = [[15, 50], [60, 80], [85, 50], [60, 20]]
		var lineDec = [{
				type: 'dash',
				length: 4,
				number: 2
			}, {
				type: 'dash',
				length: 4,
				number: 1
			}, {
				type: 'dash',
				length: 4,
				number: 1
			}, {
				type: 'dash',
				length: 4,
				number: 2
			}
		];
		for (var p = 0; p < pos.length; p++) {
			pos[p][0] = pos[p][0] * (size / 100);
			pos[p][1] = pos[p][1] * (size / 100);
		}
		for (var d = 0; d < lineDec.length; d++) {
			if (un(lineDec[d]))
				continue;
			lineDec[d].length = lineDec[d].length * (size / 100);
		}
		ctx.beginPath();
		drawPolygon({
			ctx: ctx,
			points: pos,
			lineDecoration: lineDec,
			lineWidth: size * 0.02
		});
		ctx.stroke();
	}
}
draw.polyEqui = {
	add: function () {
		draw.polygon.add('equi', 3);
	},
	drawButton: function (ctx, size) {
		var pos = [[25, 50 + 12.5 * Math.sqrt(3)], [50, 50 - 12.5 * Math.sqrt(3)], [75, 50 + 12.5 * Math.sqrt(3)]];
		var lineDec = [{
				type: 'dash',
				length: 4
			}, {
				type: 'dash',
				length: 4
			}, {
				type: 'dash',
				length: 4
			}
		];
		for (var p = 0; p < pos.length; p++) {
			pos[p][0] = pos[p][0] * (size / 100);
			pos[p][1] = pos[p][1] * (size / 100);
		}
		for (var d = 0; d < lineDec.length; d++) {
			if (un(lineDec[d]))
				continue;
			lineDec[d].length = lineDec[d].length * (size / 100);
		}
		ctx.beginPath();
		drawPolygon({
			ctx: ctx,
			points: pos,
			lineDecoration: lineDec,
			lineWidth: size * 0.02
		});
		ctx.stroke();
	}
}
draw.polyIsos = {
	add: function () {
		draw.polygon.add('isos', 3);
	},
	drawButton: function (ctx, size) {
		var pos = [[25, 80], [50, 20], [75, 80]];
		var lineDec = [{
				type: 'dash',
				length: 4
			}, {
				type: 'dash',
				length: 4
			}
		];
		for (var p = 0; p < pos.length; p++) {
			pos[p][0] = pos[p][0] * (size / 100);
			pos[p][1] = pos[p][1] * (size / 100);
		}
		for (var d = 0; d < lineDec.length; d++) {
			if (un(lineDec[d]))
				continue;
			lineDec[d].length = lineDec[d].length * (size / 100);
		}
		ctx.beginPath();
		drawPolygon({
			ctx: ctx,
			points: pos,
			lineDecoration: lineDec,
			lineWidth: size * 0.02
		});
		ctx.stroke();
	}
}
draw.polyRight = {
	add: function () {
		draw.polygon.add('right', 3);
	},
	drawButton: function (ctx, size) {
		var pos = [[25, 70], [75, 70], [25, 30]];
		var angles = [{
				radius: 15
			}, null, null];
		for (var p = 0; p < pos.length; p++) {
			pos[p][0] = pos[p][0] * (size / 100);
			pos[p][1] = pos[p][1] * (size / 100);
		}
		for (var a = 0; a < angles.length; a++) {
			if (un(angles[a]))
				continue;
			angles[a].length = angles[a].radius * (size / 100);
		}
		ctx.beginPath();
		drawPolygon({
			ctx: ctx,
			points: pos,
			angles: angles,
			lineWidth: size * 0.02
		});
		ctx.stroke();
	}
}
draw.polyRightIsos = {
	add: function () {
		draw.polygon.add('rightisos', 3);
	},
	drawButton: function (ctx, size) {
		var pos = [[25, 70], [75, 70], [25, 20]];
		var angles = [{
				radius: 15
			}, null, null];
		var lineDec = [{
				type: 'dash',
				length: 4
			}, {}, {
				type: 'dash',
				length: 4
			}
		];
		for (var p = 0; p < pos.length; p++) {
			pos[p][0] = pos[p][0] * (size / 100);
			pos[p][1] = pos[p][1] * (size / 100);
		}
		for (var d = 0; d < lineDec.length; d++) {
			if (un(lineDec[d]))
				continue;
			lineDec[d].length = lineDec[d].length * (size / 100);
		}
		for (var a = 0; a < angles.length; a++) {
			if (un(angles[a]))
				continue;
			angles[a].length = angles[a].radius * (size / 100);
		}
		ctx.beginPath();
		drawPolygon({
			ctx: ctx,
			points: pos,
			lineDecoration: lineDec,
			angles: angles,
			lineWidth: size * 0.02
		});
		ctx.stroke();
	}
}
draw.polyReg = {
	add: function (n) {
		draw.polygon.add('none', n);
	},
	drawButton: function (ctx, size, n) {
		ctx.beginPath();
		ctx.strokeStyle = '#000';
		ctx.lineWidth = size * 0.02;
		drawRegularPolygon({
			ctx: ctx,
			c: [0.5 * size, 0.5 * size],
			r: 0.3 * size,
			p: n,
			startAngle: Math.PI / 2 - Math.PI / n
		});
		ctx.stroke();
	}
}
draw.image = {
	add: function(src) {
		if (un(src)) src = 'images/logoSmall.PNG';
		deselectAllPaths(false);
		changeDrawMode();
		draw.path.push({
			obj: [{
					type: 'image',
					src: src,
					left:20,
					top:20
				}
			],
			selected: true
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
	},
	draw: function (ctx, obj, path) {
		if (!un(obj.alpha)) ctx.globalAlpha = obj.alpha;
		if (!un(obj._image) && obj._image.src !== '') {
			if (!un(obj.crop)) {
				ctx.drawImage(obj._image, obj.crop[0],obj.crop[1],obj.crop[2],obj.crop[3],obj.left, obj.top, obj.width, obj.height);
			} else {
				ctx.drawImage(obj._image, obj.left, obj.top, obj.width, obj.height);
			}
		} else if (!un(obj.src)) {
			obj._image = new Image;
			obj._image.onload = function () {
				if (un(obj.width)) obj.width = obj._image.naturalWidth;
				if (un(obj.height)) obj.height = obj._image.naturalHeight;
				obj._path = draw.getPathOfObj(obj);
				if (obj._path !== false) updateBorder(obj._path);
				drawCanvasPaths();
			}
			obj._image.src = obj.src;
		} else if (!un(obj.canvas)) {
			ctx.drawImage(obj.canvas, obj.left, obj.top, obj.width, obj.height);
		}
		if (!un(obj.box)) {
			if (obj.box.borderColor !== 'none' && obj.box.color !== 'none') {
				ctx.strokeStyle = obj.box.borderColor || obj.box.color || '#000';
				ctx.lineWidth = obj.box.borderWidth || obj.box.width || 2;
				ctx.strokeRect(obj.left, obj.top, obj.width, obj.height);
			}
		}
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.left += dl;
		obj.top += dt;
		obj.width += dw;
		obj.height += dh;
	},
	scale: function (obj, sf, center) {
		if (!un(center)) {
			obj.left = center[0] + sf * (obj.left - center[0]);
			obj.top = center[1] + sf * (obj.top - center[1]);
		}
		var ratio = obj.width/obj.height;
		obj.width *= sf;
		obj.height = obj.width/ratio;
	},
	
	getCursorPositionsSelected: function (obj, pathNum) {
		var pos = [];
		pos.push({
			shape: 'line',
			dims: [[obj.left,obj.top],[obj.left,obj.top+obj.height],20],
			cursor: draw.cursors.ew,
			func: draw.image.cropStart,
			pathNum: pathNum,
			obj: obj,
			side: 'left'
		}, {
			shape: 'line',
			dims: [[obj.left,obj.top],[obj.left+obj.width,obj.top],20],
			cursor: draw.cursors.ns,
			func: draw.image.cropStart,
			pathNum: pathNum,
			obj: obj,
			side: 'top'
		}, {
			shape: 'line',
			dims: [[obj.left+obj.width,obj.top],[obj.left+obj.width,obj.top+obj.height],20],
			cursor: draw.cursors.ew,
			func: draw.image.cropStart,
			pathNum: pathNum,
			obj: obj,
			side: 'right'
		}, {
			shape: 'line',
			dims: [[obj.left,obj.top+obj.height],[obj.left+obj.width,obj.top+obj.height],20],
			cursor: draw.cursors.ns,
			func: draw.image.cropStart,
			pathNum: pathNum,
			obj: obj,
			side: 'bottom'
		});

		return pos;
	},
	cropStart: function(e) {
		draw._drag = draw.currCursor;
		var obj = draw._drag.obj;
		if (un(obj.crop)) obj.crop = [0,0,obj._image.naturalWidth,obj._image.naturalHeight];
		obj._xsf = obj.crop[2] / obj.width;
		obj._ysf = obj.crop[3] / obj.height;
		draw.animate(draw.image.cropMove,draw.image.cropStop,drawCanvasPaths);
		addListenerMove(window,draw.image.cropMove);
		addListenerEnd(window,draw.image.cropStop);
	},
	cropMove: function(e) {
		updateMouse(e);
		var obj = draw._drag.obj;
		var side = draw._drag.side;
		if (side === 'left') {
			var minLeft = obj.left-obj.crop[0]/obj._xsf;
			var maxLeft = obj.left+obj.width-40;
			var x = Math.max(Math.min(maxLeft,draw.mouse[0]),minLeft);
			var dx = x - obj.left;
			obj.left += dx;
			obj.width -= dx;
			obj.crop[0] += dx*obj._xsf;
			obj.crop[2] -= dx*obj._xsf;
		} else if (side === 'right') {
			var right = Math.min(Math.max(draw.mouse[0],obj.left+40),obj._image.naturalWidth/obj._xsf);
			obj.width = right-obj.left;
			obj.crop[2] = obj.width*obj._xsf;
		} else if (side === 'top') {
			var minTop = obj.top-obj.crop[1]/obj._ysf;
			var maxTop = obj.top+obj.height-40;
			var y = Math.max(Math.min(maxTop,draw.mouse[1]),minTop);
			var dy = y - obj.top;
			obj.top += dy;
			obj.height -= dy;
			obj.crop[1] += dy*obj._ysf;
			obj.crop[3] -= dy*obj._ysf;
		} else if (side === 'bottom') {
			var bottom = Math.min(Math.max(draw.mouse[1],obj.top+40),obj._image.naturalHeight/obj._ysf);
			obj.height = bottom-obj.top;
			obj.crop[3] = obj.height*obj._ysf;
		}
		//drawSelectedPaths();
	},
	cropStop: function(e) {
		//removeListenerMove(window,draw.image.cropMove);
		//removeListenerEnd(window,draw.image.cropStop);
		delete draw._drag;
	}
}
draw.pdfPage = {
	resizable: true,
	add: function (url, pageIndex) {
		deselectAllPaths(false);
		changeDrawMode();
		var pos = getRelPos([50, 50]);
		draw.path.push({
			obj: [{
					_loaded: false,
					type: 'pdfPage',
					left: pos[0],
					top: pos[1],
					width: 1200,
					height: 1850,
					url: url,
					pageIndex: pageIndex
				}
			],
			selected: true,
			trigger: []
		});
		draw.pdfPage.load(draw.path.last().obj[0]);
	},
	load: function (obj) {
		var url = obj.url;
		var pageIndex = obj.pageIndex;
		if (un(draw.pdfsLoaded)) {
			draw.pdfsLoaded = [];
			draw.pdfsData = [];
		}
		var pdfIndex = draw.pdfsLoaded.indexOf(url);
		if (pdfIndex > -1) {
			obj._image = draw.pdfsData[pdfIndex][pageIndex];
			obj._img = new Image();
			obj._img.onload = function () {
				obj._loaded = true;
				obj.width = obj._img.naturalWidth;
				obj.height = obj._img.naturalHeight;
				obj.naturalWidth = obj._img.naturalWidth;
				obj.naturalHeight = obj._img.naturalHeight;
				updateBorder(draw.path.last());
				drawCanvasPaths();
			};
			obj._img.src = obj._image;
		} else {
			draw.pdfsLoaded.push(url);
			draw.pdfsData.push([]);
			PDFJS.disableWorker = true;
			PDFJS.getDocument(url).then(function getPdf(_pdf) {
				var canvas = draw.hiddenCanvas;
				var ctx = canvas.getContext('2d');
				var currentPage = 1;
				if (currentPage <= _pdf.numPages)
					getPage();

				function getPage() {
					_pdf.getPage(currentPage).then(function (page) {
						var scale = 1200 / 595.28;
						var viewport = page.getViewport(scale);

						canvas.height = viewport.height;
						canvas.width = viewport.width;

						var renderContext = {
							canvasContext: ctx,
							viewport: viewport
						};

						page.render(renderContext).then(function () {
							draw.pdfsData.last().push(canvas.toDataURL());
							if (currentPage < _pdf.numPages) {
								currentPage++;
								getPage();
							} else {
								done();
							}
						});
					});
				}

				/*for(var i = 1; i <= _pdf.numPages; i++){
				canvas.clearRect(0,0,1200,1850);
				_pdf.getPage(i).then(function getPage(page){
				var viewport = page.getViewport(1200/595.28);
				page.render({canvasContext: ctx, viewport: viewport}).then(function() {
				draw.pdfsData.last().push(canvas.toDataURL());
				});
				});
				}*/
				function done() {
					obj._image = draw.pdfsData.last()[pageIndex];
					obj._img = new Image();
					obj._img.onload = function () {
						obj._loaded = true;
						obj.width = obj._img.naturalWidth;
						obj.height = obj._img.naturalHeight;
						obj.naturalWidth = obj._img.naturalWidth;
						obj.naturalHeight = obj._img.naturalHeight;
						updateBorder(draw.path.last());
						drawCanvasPaths();
					};
					obj._img.src = obj._image;
				}
			});
		}
	},
	draw: function (ctx, obj, path) {
		if (obj._loaded == true) {
			ctx.drawImage(obj._img, obj.left, obj.top, obj.width, obj.height);
		} else {
			draw.pdfPage.load(obj);
		}
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.left += dl;
		obj.top += dt;
		obj.width += dw;
		obj.height += dh;
	},
	scale: function (obj, sf, center) {
		if (!un(center)) {
			obj.left = center[0] + sf * (obj.left - center[0]);
			obj.top = center[1] + sf * (obj.top - center[1]);
		}
		obj.width *= sf;
		obj.height *= sf;
	}
}
draw.point = {
	add: function () {
		deselectAllPaths(false);
		changeDrawMode();
		draw.path.push({
			obj: [{
					type: 'point',
					center: getRelPos([150, 150]),
					radius: 5,
					color: draw.color,
				}
			],
			selected: true,
			trigger: []
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
	},
	draw: function (ctx, obj, path) {
		ctx.save();
		ctx.fillStyle = obj.color;
		ctx.beginPath();
		ctx.arc(obj.center[0], obj.center[1], obj.radius, 0, 2 * Math.PI);
		ctx.fill();
		ctx.beginPath();
		ctx.restore();
	},
	getRect: function (obj) {
		obj._left = obj.center[0] - obj.radius;
		obj._top = obj.center[1] - obj.radius;
		obj._width = 2 * obj.radius;
		obj._height = 2 * obj.radius;
		return [obj._left, obj._top, obj._width, obj._height];
	},
	drawButton: function (ctx, size) {
		draw.point.draw(ctx, {
			center: [0.5 * size, 0.5 * size],
			radius: 0.05 * size,
			color: '#000'
		});
	},
	scale: function (obj, sf, center) {
		if (un(center))
			var center = obj.center;
		obj.center[0] = center[0] + sf * (obj.center[0] - center[0]);
		obj.center[1] = center[1] + sf * (obj.center[1] - center[1]);
		if (!un(obj.radius))
			obj.radius *= sf;
	},
	getLineWidth: function (obj) {
		return obj.radius;
	},
	getLineColor: function (obj) {
		return obj.color;
	},
	getFillColor: function (obj) {
		return obj.color;
	},
	setLineWidth: function (obj, value) {
		obj.radius = value;
	},
	setLineColor: function (obj, value) {
		obj.color = value;
	},
	setFillColor: function (obj, value) {
		obj.color = value;
	}
}
draw.circle = {
	add: function () {
		changeDrawMode('circle');
	},
	/*add: function() {
	deselectAllPaths(false);
	changeDrawMode();
	draw.path.push({obj:[{
	type:'circle',
	center:[150,150],
	radius:100,
	lineWidth:draw.thickness,
	lineColor:draw.color,
	}],selected:true,trigger:[]});
	updateBorder(draw.path.last());
	drawCanvasPaths();
	},*/
	draw: function (ctx, obj, path) {
		if (obj.radius <= 0)
			return;
		ctx.save();
		ctx.strokeStyle = obj.color;
		ctx.lineWidth = obj.thickness;
		if (typeof ctx.setLineDash !== 'function')
			ctx.setLineDash = function () {};
		if (typeof obj.dash !== 'undefined')
			ctx.setLineDash(obj.dash);
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		if (typeof obj.fillColor !== 'undefined' && obj.fillColor !== 'none') {
			ctx.save();
			ctx.fillStyle = obj.fillColor;
			ctx.beginPath();
			ctx.arc(obj.center[0], obj.center[1], obj.radius, 0, 2 * Math.PI);
			ctx.fill();
			ctx.restore();
		}
		if (obj.showCenter == true || (draw.mode === 'edit' && path.selected == true && path.obj.length == 1)) {
			ctx.save();
			ctx.fillStyle = '#000';
			ctx.beginPath();
			ctx.arc(obj.center[0], obj.center[1], 3, 0, 2 * Math.PI);
			ctx.fill();
			ctx.restore();
		}
		ctx.beginPath();
		ctx.arc(obj.center[0], obj.center[1], obj.radius, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.setLineDash([]);
		ctx.restore();
		delete obj.left;
		delete obj.top;
		delete obj.width;
		delete obj.height;
	},
	getRect: function (obj) {
		obj._left = obj.center[0] - obj.radius;
		obj._top = obj.center[1] - obj.radius;
		obj._width = 2 * obj.radius;
		obj._height = 2 * obj.radius;
		return [obj._left, obj._top, obj._width, obj._height];
	},
	drawButton: function (ctx, size) {
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 0.02 * size;
		ctx.beginPath();
		ctx.arc(0.5 * size, 0.5 * size, 0.3 * size, 0, 2 * Math.PI);
		ctx.stroke();
	},
	scale: function (obj, sf, center) {
		if (un(center))
			var center = obj.center;
		obj.center[0] = center[0] + sf * (obj.center[0] - center[0]);
		obj.center[1] = center[1] + sf * (obj.center[1] - center[1]);
		if (!un(obj.radius))
			obj.radius *= sf;
		if (!un(obj.lineWidth))
			obj.lineWidth *= sf;
	}
}
draw.ellipse = {
	add: function () {
		changeDrawMode('ellipse');
	},
	/*add: function() {
	deselectAllPaths(false);
	changeDrawMode();
	draw.path.push({obj:[{
	type:'ellipse',
	center:[150,150],
	radiusX:100,
	radiusY:50,
	lineWidth:draw.thickness,
	lineColor:draw.color,
	}],selected:true,trigger:[]});
	updateBorder(draw.path.last());
	drawCanvasPaths();
	},*/
	draw: function (ctx, obj, path) {
		ctx.save();
		ctx.strokeStyle = obj.color;
		ctx.lineWidth = obj.thickness;
		if (typeof ctx.setLineDash !== 'function')
			ctx.setLineDash = function () {};
		if (typeof obj.dash !== 'undefined')
			ctx.setLineDash(obj.dash);
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		if (typeof obj.fillColor !== 'undefined' && obj.fillColor !== 'none') {
			ctx.save();
			ctx.beginPath();
			ctx.fillStyle = obj.fillColor;
			ctx.ellipse(obj.center[0], obj.center[1], obj.radiusX, obj.radiusY, 0, 0, 2 * Math.PI);
			ctx.fill();
			ctx.restore();
		}
		if (obj.showCenter == true || (draw.mode === 'edit' && path.selected == true && path.obj.length == 1)) {
			ctx.save();
			ctx.beginPath();
			ctx.fillStyle = '#000';
			ctx.beginPath();
			ctx.arc(obj.center[0], obj.center[1], 3, 0, 2 * Math.PI);
			ctx.fill();
			ctx.restore();
		}

		ctx.beginPath();
		ctx.moveTo(obj.center[0] + obj.radius, obj.center[1]);
		ctx.ellipse(obj.center[0], obj.center[1], obj.radiusX, obj.radiusY, 0, 0, 2 * Math.PI);
		ctx.stroke();

		ctx.setLineDash([]);
		ctx.restore();
	},
	getRect: function (obj) {
		obj._left = obj.center[0] - obj.radiusX;
		obj._top = obj.center[1] - obj.radiusY;
		obj._width = 2 * obj.radiusX;
		obj._height = 2 * obj.radiusY;
		return [obj._left, obj._top, obj._width, obj._height];
	},
	drawButton: function (ctx, size) {
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 0.02 * size;
		ctx.beginPath();
		ctx.ellipse(0.5 * size, 0.5 * size, 0.3 * size, 0.15 * size, 0, 0, 2 * Math.PI);
		ctx.stroke();
	},
	scale: function (obj, sf, center) {
		if (un(center))
			var center = obj.center;
		obj.center[0] = center[0] + sf * (obj.center[0] - center[0]);
		obj.center[1] = center[1] + sf * (obj.center[1] - center[1]);
		if (!un(obj.radiusX))
			obj.radiusX *= sf;
		if (!un(obj.radiusY))
			obj.radiusY *= sf;
		if (!un(obj.lineWidth))
			obj.lineWidth *= sf;
	}
}
draw.angle = {
	/*add: function(isArc) {
	if (boolean(isArc,false) == true) {
	drawLines = false;
	} else {
	drawLines = true;
	}
	deselectAllPaths(false);
	changeDrawMode();
	draw.path.push({obj:[{
	type:'angle',
	b:[900-draw.drawRelPos[0],200-draw.drawRelPos[1]],
	radius:35,
	angleC:0,
	c:[900-draw.drawRelPos[0]+35*Math.cos(0),200-draw.drawRelPos[1]+35*Math.sin(0)],
	angleA:-Math.PI/3,
	a:[900-draw.drawRelPos[0]+35*Math.cos(-Math.PI/3),200-draw.drawRelPos[1]+35*Math.sin(-Math.PI/3)],
	lineWidth:draw.thickness,
	lineColor:draw.color,
	fillColor:'none',
	fill:true,
	drawLines:drawLines,
	squareForRight:false,
	labelIfRight:true,
	measureLabelOnly:true
	}],selected:true,trigger:[]});
	updateBorder(draw.path.last());
	drawCanvasPaths();
	},*/
	add: function (x, y, r1, r2) {
		deselectAllPaths(false);
		changeDrawMode();
		var pos = getRelPos([250, 150]);
		if (un(x))
			x = pos[0];
		if (un(y))
			y = pos[1];
		if (un(r1))
			r1 = 100;
		if (un(r2))
			r2 = 30;
		var obj = {
			type: 'angle',
			style: 1,
			b: [x, y],
			radius: r2,
			angleC: 0,
			c: [x + r1 * Math.cos(0), y + r2 * Math.sin(0)],
			angleA: -Math.PI / 3,
			a: [x + r1 * Math.cos(-Math.PI / 3), y + r1 * Math.sin(-Math.PI / 3)],
			lineWidth: draw.thickness,
			lineColor: draw.color,
			fillColor: 'none',
			fill: true,
			drawLines: true,
			measureLabelOnly: true,
			d: [],
			calcD: function () {
				this.angleA = posToAngle(this.a[0], this.a[1], this.b[0], this.b[1]);
				this.d = [this.b[0] + this.radius * Math.cos(this.angleA), this.b[1] + this.radius * Math.sin(this.angleA)];
			}
		}
		obj.calcD();
		draw.path.push({
			obj: [obj],
			selected: true,
			trigger: []
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
	},
	draw: function (ctx, obj, path) {
		ctx.strokeStyle = obj.color;
		ctx.lineWidth = obj.thickness;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		var obj2 = clone(obj);
		obj2.ctx = ctx;
		obj._angleLabelPos = drawAngle(obj2);

		if (draw.mode === 'edit' && path.obj.length == 1 && path.selected == true) {
			if (obj.isSector !== true && obj.isArc !== true && obj.measureLabelOnly !== false) {
				drawAngle({
					ctx: ctx,
					a: obj.a,
					b: obj.b,
					c: obj.c,
					drawLines: false,
					drawCurve: false,
					radius: obj.radius,
					lineColor: colorA('#000', 0.3),
					labelMeasure: true,
					labelFontSize: 25,
					labelRadius: obj.radius + 3,
					labelColor: colorA('#000', 0.3),
					lineWidth: 2
				});
			}

			ctx.save();
			ctx.lineWidth = 1;
			ctx.strokeStyle = '#000';
			ctx.fillStyle = colorA('#F00', 1);
			ctx.beginPath();
			ctx.arc(obj.b[0], obj.b[1], 8, 0, 2 * Math.PI);
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(obj.a[0], obj.a[1], 8, 0, 2 * Math.PI);
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(obj.c[0], obj.c[1], 8, 0, 2 * Math.PI);
			ctx.fill();
			ctx.stroke();
			if (!un(obj.d)) {
				if (boolean(obj.recalcD, false)) {
					if (!un(obj.calcD))
						obj.calcD();
					obj.recalcD = false;
				}
				ctx.beginPath();
				ctx.arc(obj.d[0], obj.d[1], 8, 0, 2 * Math.PI);
				ctx.fillStyle = '#F90';
				ctx.fill();
				ctx.stroke();
			}
			ctx.restore();
		}
	},
	getRect: function (obj) {
		if (!un(obj.d)) {
			obj._left = Math.min(obj.a[0], obj.b[0], obj.c[0]) - 20;
			obj._top = Math.min(obj.a[1], obj.b[1], obj.c[1]) - 20;
			obj._width = Math.max(obj.a[0], obj.b[0], obj.c[0]) - obj._left + 40;
			obj._height = Math.max(obj.a[1], obj.b[1], obj.c[1]) - obj._top + 40;
		} else {
			if (obj.isArc == true || obj.isSector == true) {
				obj._left = Math.min(obj.a[0], obj.b[0], obj.c[0]) - 20;
				obj._top = Math.min(obj.a[1], obj.b[1], obj.c[1]) - 20;
				if (isPointInSector([obj.b[0] - 1, obj.b[1]], [obj.b[0], obj.b[1], 10, obj.angleA, obj.angleC]) == true) {
					obj._left = obj.b[0] - obj.radius - 20;
				}
				if (isPointInSector([obj.b[0], obj.b[1] - 1], [obj.b[0], obj.b[1], 10, obj.angleA, obj.angleC]) == true) {
					obj._top = obj.b[1] - obj.radius - 20;
				}
				obj._width = Math.max(obj.a[0], obj.b[0], obj.c[0]) + 20 - obj._left;
				obj._height = Math.max(obj.a[1], obj.b[1], obj.c[1]) + 20 - obj._top;
				if (isPointInSector([obj.b[0] + 1, obj.b[1]], [obj.b[0], obj.b[1], 10, obj.angleA, obj.angleC]) == true) {
					obj._width = obj.b[0] + obj.radius + 20 - obj._left;
				}
				if (isPointInSector([obj.b[0], obj.b[1] + 1], [obj.b[0], obj.b[1], 10, obj.angleA, obj.angleC]) == true) {
					obj._height = obj.b[1] + obj.radius + 20 - obj._top;
				}
			} else {
				obj._left = obj.b[0] - obj.radius;
				obj._top = obj.b[1] - obj.radius;
				obj._width = 2 * obj.radius;
				obj._height = 2 * obj.radius;
			}
		}
		return [obj._left, obj._top, obj._width, obj._height];
	},
	getButtons: function (x1, y1, x2, y2, pathNum) {
		var buttons = [];
		if (un(pathNum))
			return buttons;
		if (un(draw.path[pathNum]))
			return buttons;
		var obj = draw.path[pathNum].obj[0];
		if (un(obj.d)) {
			buttons.push({
				buttonType: 'angle-showLines',
				shape: 'rect',
				dims: [x2 - 20, y2 - 40, 20, 20],
				cursor: draw.cursors.pointer,
				func: draw.angle.showLines,
				pathNum: pathNum
			});
		} else {
			buttons.push({
				buttonType: 'angle-showLines',
				shape: 'rect',
				dims: [x2 - 20, y1 + 20, 20, 20],
				cursor: draw.cursors.pointer,
				func: draw.angle.showLines,
				pathNum: pathNum
			});
			buttons.push({
				buttonType: 'angle-showAngle',
				shape: 'rect',
				dims: [x2 - 20, y1 + 40, 20, 20],
				cursor: draw.cursors.pointer,
				func: draw.angle.showAngle,
				pathNum: pathNum
			});
			buttons.push({
				buttonType: 'angle-numOfCurves',
				shape: 'rect',
				dims: [x2 - 20, y1 + 60, 20, 20],
				cursor: draw.cursors.pointer,
				func: draw.angle.numOfCurves,
				pathNum: pathNum
			});
		}
		return buttons;
	},
	getCursorPositionsSelected: function (obj, pathNum) {
		var pos = [];
		if (obj.isSector !== true && obj.isArc !== true) {
			if (!un(obj._angleLabelPos)) {
				pos.push({
					shape: 'rect',
					dims: obj._angleLabelPos,
					cursor: draw.cursors.pointer,
					func: draw.angle.showAngle,
					pathNum: pathNum
				});
			}
			pos.push({
				shape: 'sector',
				dims: [obj.b[0], obj.b[1], obj.radius, getAngleTwoPoints(obj.b, obj.a), getAngleTwoPoints(obj.b, obj.c)],
				cursor: draw.cursors.pointer,
				func: draw.angle.setAngleStyle,
				pathNum: pathNum
			});
		}
		pos.push({
			shape: 'circle',
			dims: [obj.b[0], obj.b[1], 8],
			cursor: draw.cursors.pointer,
			func: draw.angle.startDragB,
			pathNum: pathNum
		});
		pos.push({
			shape: 'circle',
			dims: [obj.a[0], obj.a[1], 8],
			cursor: draw.cursors.pointer,
			func: draw.angle.startDragA,
			pathNum: pathNum
		});
		pos.push({
			shape: 'circle',
			dims: [obj.c[0], obj.c[1], 8],
			cursor: draw.cursors.pointer,
			func: draw.angle.startDragC,
			pathNum: pathNum
		});
		if (!un(obj.d)) {
			pos.push({
				shape: 'circle',
				dims: [obj.d[0], obj.d[1], 8],
				cursor: draw.cursors.pointer,
				func: draw.angle.startDragD,
				pathNum: pathNum
			});
		}
		return pos;
	},
	startDragA: function () {
		changeDrawMode('angleDragA');
		draw.currPathNum = draw.currCursor.pathNum;
		updateSnapPoints(); // update intersection points
		draw.animate(draw.angle.posMove,draw.angle.posStop,drawCanvasPaths);		
		//addListenerMove(window, draw.angle.posMove);
		//addListenerEnd(window, draw.angle.posStop);
	},
	startDragB: function () {
		changeDrawMode('angleDragB');
		draw.currPathNum = draw.currCursor.pathNum;
		var obj = draw.path[draw.currPathNum].obj[0];
		draw.relPosA = getVectorAB(obj.b, obj.a);
		draw.relPosC = getVectorAB(obj.b, obj.c);
		if (!un(obj.d))
			draw.relPosD = getVectorAB(obj.b, obj.d);
		updateSnapPoints(); // update intersection points
		drawCanvasPaths()
		draw.animate(draw.angle.posMove,draw.angle.posStop,drawCanvasPaths);		
		//addListenerMove(window, draw.angle.posMove);
		//addListenerEnd(window, draw.angle.posStop);
	},
	startDragC: function () {
		changeDrawMode('angleDragC');
		draw.currPathNum = draw.currCursor.pathNum;
		updateSnapPoints(); // update intersection points
		draw.animate(draw.angle.posMove,draw.angle.posStop,drawCanvasPaths);		
		//addListenerMove(window, draw.angle.posMove);
		//addListenerEnd(window, draw.angle.posStop);
	},
	startDragD: function () {
		changeDrawMode('angleDragD');
		draw.currPathNum = draw.currCursor.pathNum;
		updateSnapPoints(); // update intersection points
		draw.animate(draw.angle.posMove,draw.angle.posStop,drawCanvasPaths);		
		//addListenerMove(window, draw.angle.posMove);
		//addListenerEnd(window, draw.angle.posStop);
	},
	posMove: function (e) {
		updateMouse(e);
		var pos = draw.mouse;
		var pathNum = draw.currPathNum;
		if (snapToObj2On || draw.snapLinesTogether)
			pos = snapToObj2(pos, pathNum);
		var obj = draw.path[pathNum].obj[0];
		if (draw.drawMode == 'angleDragB') {
			obj.b = pos;
			obj.a = pointAddVector(obj.b, draw.relPosA);
			obj.c = pointAddVector(obj.b, draw.relPosC);
			if (!un(obj.d))
				obj.d = pointAddVector(obj.b, draw.relPosD);
		} else if (!un(obj.d)) {
			if (draw.drawMode == 'angleDragA') {
				obj.a = pos;
				obj.recalcD = true;
			} else if (draw.drawMode == 'angleDragC') {
				obj.c = pos;
				obj.recalcD = true;
			} else if (draw.drawMode == 'angleDragD') {
				obj.radius = getDist(obj.b, pos);
				obj.calcD();
				if (!un(obj.labelRadius)) {
					obj.labelRadius = obj.radius + 3;
				}
			}
		} else {
			if (draw.drawMode == 'angleDragA') {
				obj.angleA = getAngleTwoPoints(obj.b, pos);
				obj.a = [obj.b[0] + obj.radius * Math.cos(obj.angleA), obj.b[1] + obj.radius * Math.sin(obj.angleA)];
			} else if (draw.drawMode == 'angleDragC') {
				obj.angleC = getAngleTwoPoints(obj.b, pos);
				obj.c = [obj.b[0] + obj.radius * Math.cos(obj.angleC), obj.b[1] + obj.radius * Math.sin(obj.angleC)];
			}
		}
		updateBorder(draw.path[pathNum]);
		//drawSelectedPaths();
		//drawSelectCanvas();
		draw.prevX = mouse.x;
		draw.prevY = mouse.y;
	},
	posStop: function (e) {
		//removeListenerMove(window, draw.angle.posMove);
		//removeListenerEnd(window, draw.angle.posStop);
		changeDrawMode();
	},
	showLines: function () {
		var pathNum = draw.currCursor.pathNum;
		var obj = draw.path[pathNum].obj[0];
		if (typeof obj.drawLines == 'undefined') {
			obj.drawLines = false;
		} else {
			obj.drawLines = !obj.drawLines;
		}
		drawSelectedPaths();
		drawSelectCanvas();
	},
	setAngleStyle: function () {
		var pathNum = draw.currCursor.pathNum;
		var obj = draw.path[pathNum].obj[0];
		angleStyleIncrement(obj);
		drawSelectedPaths();
		drawSelectCanvas();
	},
	showAngle: function () {
		var pathNum = draw.currCursor.pathNum;
		var obj = draw.path[pathNum].obj[0];
		obj.measureLabelOnly = !obj.measureLabelOnly;
		obj.labelMeasure = true;
		obj.labelFontSize = 25;
		obj.labelRadius = obj.radius + 3;
		drawSelectedPaths();
		drawSelectCanvas();
	},
	numOfCurves: function () {
		var pathNum = draw.currCursor.pathNum;
		var obj = draw.path[pathNum].obj[0];
		if (typeof obj.numOfCurves == 'undefined') {
			obj.numOfCurves = 2;
		} else {
			obj.numOfCurves++;
			if (obj.numOfCurves == 4)
				obj.numOfCurves = 1;
		}
		drawSelectedPaths();
		drawSelectCanvas();
	},
	drawButton: function (ctx, size) {
		drawAngle({
			ctx: ctx,
			a: [0.55 * size, 0.3 * size],
			b: [0.2 * size, 0.7 * size],
			c: [0.8 * size, 0.7 * size],
			fill: false,
			radius: 0.3 * size,
			drawLines: true,
			lineWidth: 0.03 * size
		});
	},
	scale: function (obj, sf, center) {
		if (un(center))
			var center = obj.b;
		obj.a[0] = center[0] + sf * (obj.a[0] - center[0]);
		obj.a[1] = center[1] + sf * (obj.a[1] - center[1]);
		obj.b[0] = center[0] + sf * (obj.b[0] - center[0]);
		obj.b[1] = center[1] + sf * (obj.b[1] - center[1]);
		obj.c[0] = center[0] + sf * (obj.c[0] - center[0]);
		obj.c[1] = center[1] + sf * (obj.c[1] - center[1]);
		if (!un(obj.radius))
			obj.radius *= sf;
		if (!un(obj.lineWidth))
			obj.lineWidth *= sf;
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.a[0] += dl;
		obj.a[1] += dt;
		obj.b[0] += dl;
		obj.b[1] += dt;
		obj.c[0] += dl;
		obj.c[1] += dt;
	}
}
draw.anglesAroundPoint = {
	add: function (x, y, r1, a1, a2, a3) {
		deselectAllPaths(false);
		var pos = getRelPos([250, 150]);
		if (un(x))
			x = pos[0];
		if (un(y))
			y = pos[1];
		if (un(r1))
			r1 = 100;
		if (un(a1))
			a1 = (1 / 3) * Math.PI;
		if (un(a2))
			a2 = (1 / 1) * Math.PI;
		if (un(a3))
			a3 = (5 / 3) * Math.PI;
		var angles = [{
				style: 1,
				radius: 30,
				labelMeasure: true,
				labelFontSize: 25,
				labelRadius: 33,
				drawCurve: true,
				measureLabelOnly: true
			}, {
				style: 1,
				radius: 30,
				labelMeasure: true,
				labelFontSize: 25,
				labelRadius: 33,
				drawCurve: true,
				measureLabelOnly: true
			}, {
				style: 1,
				radius: 30,
				labelMeasure: true,
				labelFontSize: 25,
				labelRadius: 33,
				drawCurve: true,
				measureLabelOnly: true
			}
		];
		draw.path.push({
			obj: [{
					type: 'anglesAroundPoint',
					center: [x, y],
					points: [
						[x + r1 * Math.cos(a1), y + r1 * Math.sin(a1)],
						[x + r1 * Math.cos(a2), y + r1 * Math.sin(a2)],
						[x + r1 * Math.cos(a3), y + r1 * Math.sin(a3)],
					],
					color: draw.color,
					thickness: draw.thickness,
					angles: angles,
					radius: r1
				}
			],
			selected: true,
			trigger: []
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
		changeDrawMode();
	},
	draw: function (ctx, obj, path) {
		ctx.strokeStyle = obj.color;
		ctx.lineWidth = obj.thickness;
		if (typeof ctx.setLineDash !== 'function')
			ctx.setLineDash = function () {};
		if (typeof obj.dash !== 'undefined')
			ctx.setLineDash(obj.dash);
		if (obj.points.length > 1) {
			var obj2 = clone(obj);
			for (var p = 0; p < obj2.points.length; p++) {
				obj2.points[p][0] = obj2.points[p][0];
				obj2.points[p][1] = obj2.points[p][1];
			}
			if (typeof obj2.angles !== 'undefined') {
				for (var a = 0; a < obj2.angles.length; a++) {
					if (typeof obj2.angles[a] == 'object' && obj2.angles[a] !== null) {
						if (typeof obj2.angles[a].lineWidth !== 'undefined') {
							obj2.angles[a].lineWidth = obj2.angles[a].lineWidth;
						}
						if (typeof obj2.angles[a].labelRadius !== 'undefined') {
							obj2.angles[a].labelRadius = obj2.angles[a].labelRadius;
						}
						if (typeof obj2.angles[a].labelFontSize !== 'undefined') {
							obj2.angles[a].labelFontSize = obj2.angles[a].labelFontSize;
						}
						if (typeof obj2.angles[a].radius !== 'undefined') {
							obj2.angles[a].radius = obj2.angles[a].radius;
						}
					}
				}
			}
			obj2.center = [obj.center[0], obj.center[1]];
			obj2.thickness = obj2.thickness;
			obj2.ctx = ctx;
			obj._angleLabelPos = drawAnglesAroundPoint(obj2);
		}
		ctx.setLineDash([]);

		if (path.obj.length == 1) {
			ctx.lineWidth = 1;
			ctx.strokeStyle = '#000';
			ctx.fillStyle = '#F00';
			var angleObj = {
				ctx: ctx,
				drawLines: false,
				radius: 30,
				lineColor: colorA(obj.color, 0.3),
				labelMeasure: true,
				labelFontSize: 25,
				labelRadius: 33,
				labelColor: colorA(obj.color, 0.3),
				lineWidth: 2
			};
			for (var k = 0; k < obj.points.length; k++) {
				if ((path.selected == true || (obj.drawing == true && k > 0 && k < obj.points.length - 1)) && (un(obj.angles) || un(obj.angles[k]) || (!un(obj.angles[k]) && (obj.angles[k].drawCurve == false || obj.angles[k].measureLabelOnly == true)))) {
					if (!un(obj.angles) && !un(obj.angles[k])) angleObj.measureLabelOnly = !obj.angles[k].measureLabelOnly;
					if (!un(obj.angles) && !un(obj.angles[k])) angleObj.drawCurve = !obj.angles[k].drawCurve;
					angleObj.b = obj.center;
					angleObj.a = obj.points[k];
					if (k == obj.points.length - 1) {
						angleObj.c = obj.points[0];
					} else {
						angleObj.c = obj.points[k + 1];
					}
					drawAngle(angleObj);
				}
				if (path.selected == true) {
					ctx.beginPath();
					ctx.arc(obj.points[k][0], obj.points[k][1], 7, 0, 2 * Math.PI);
					ctx.fill();
					ctx.stroke();
				}
			}
		}
	},
	getRect: function (obj) {
		obj._left = obj.center[0] - 65;
		obj._top = obj.center[1] - 65;
		obj._right = obj.center[0] + 65;
		obj._bottom = obj.center[1] + 65;
		for (var j = 0; j < obj.points.length; j++) {
			obj._left = Math.min(obj._left, obj.points[j][0] - 65);
			obj._top = Math.min(obj._top, obj.points[j][1] - 65);
			obj._right = Math.max(obj._right, obj.points[j][0] + 65);
			obj._bottom = Math.max(obj._bottom, obj.points[j][1] + 65);
		}
		obj._width = obj._right - obj._left;
		obj._height = obj._bottom - obj._top;
		return [obj._left, obj._top, obj._width, obj._height];
	},
	getButtons: function (x1, y1, x2, y2, pathNum) {
		var buttons = [];
		buttons.push({
			buttonType: 'anglesAroundPoint-pointsMinus',
			shape: 'rect',
			dims: [x2 - 20, y2 - 40, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.anglesAroundPoint.pointsMinus,
			pathNum: pathNum
		});
		buttons.push({
			buttonType: 'anglesAroundPoint-pointsPlus',
			shape: 'rect',
			dims: [x2 - 20, y2 - 60, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.anglesAroundPoint.pointsPlus,
			pathNum: pathNum
		});
		buttons.push({
			buttonType: 'anglesAroundPoint-fixRadius',
			shape: 'rect',
			dims: [x2 - 20, y2 - 80, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.anglesAroundPoint.fixRadius,
			pathNum: pathNum
		});
		return buttons;
	},
	getCursorPositionsSelected: function (obj, pathNum) {
		var pos = [];
		for (var k = 0; k < obj.points.length; k++) {
			if (!un(obj._angleLabelPos) && !un(obj._angleLabelPos[k])) {
				pos.push({
					shape: 'rect',
					dims: obj._angleLabelPos[k],
					cursor: draw.cursors.pointer,
					func: draw.anglesAroundPoint.toggleLabel,
					pathNum: pathNum,
					point: k
				});
			}
		}
		for (var k = 0; k < obj.points.length; k++) {
			var next = k + 1;
			if (k == obj.points.length - 1)
				next = 0;
			pos.push({
				shape: 'sector',
				dims: [obj.center[0], obj.center[1], 30, getAngleTwoPoints(obj.center, obj.points[k]), getAngleTwoPoints(obj.center, obj.points[next])],
				cursor: draw.cursors.pointer,
				func: draw.anglesAroundPoint.toggleAngle,
				pathNum: pathNum,
				point: k
			});
			pos.push({
				shape: 'circle',
				dims: [obj.points[k][0], obj.points[k][1], 8],
				cursor: draw.cursors.pointer,
				func: draw.anglesAroundPoint.startPointDrag,
				pathNum: pathNum,
				point: k
			});
		}
		return pos;
	},
	pointsMinus: function (path) {
		if (un(path)) {
			if (!un(draw.currCursor.pathNum)) {
				path = draw.path[draw.currCursor.pathNum];
			} else {
				path = selPath();
			}
		}
		var obj = path.obj[0];
		if (obj.points.length > 2) {
			if (!un(obj.angles) && !un(obj.angles[obj.points.length - 1]))
				obj.angles[obj.points.length - 1] = null;
			obj.points.pop();
			obj.angles.pop();
			obj._angleLabelPos.pop();
		}
		updateBorder(path);
		drawCanvasPaths();
		drawSelectCanvas();
	},
	pointsPlus: function (path) {
		if (un(path)) {
			if (!un(draw.currCursor.pathNum)) {
				path = draw.path[draw.currCursor.pathNum];
			} else {
				path = selPath();
			}
		}
		var obj = path.obj[0];
		var theta1 = 2 * Math.PI - posToAngle(obj.points[0][0], obj.points[0][1], obj.center[0], obj.center[1]);
		var theta2 = 2 * Math.PI - posToAngle(obj.points[obj.points.length - 1][0], obj.points[obj.points.length - 1][1], obj.center[0], obj.center[1]);
		if (theta2 < theta1)
			theta1 -= 2 * Math.PI;
		obj.points.push(angleToPos((theta1 + theta2) / 2, obj.center[0], obj.center[1], obj.radius));
		obj.angles.push({
			style: 1,
			radius: 30,
			labelMeasure: true,
			labelFontSize: 25,
			labelRadius: 33,
			drawCurve: true,
			measureLabelOnly: true
		});
		updateBorder(path);
		drawCanvasPaths();
		drawSelectCanvas();
	},
	fixRadius: function () {
		var path = draw.path[draw.currCursor.pathNum];
		var obj = path.obj[0];
		draw.anglesAroundPoint.fixToRadius(obj);
	},
	fixToRadius: function (obj) {
		for (var p = 0; p < obj.points.length; p++) {
			var theta = 2 * Math.PI - posToAngle(obj.points[p][0], obj.points[p][1], obj.center[0], obj.center[1]);
			obj.points[p] = angleToPos(theta, obj.center[0], obj.center[1], obj.radius);
		}
		var pathNum = draw.currCursor.pathNum;
		updateBorder(draw.path[pathNum]);
		drawSelectedPaths();
		drawSelectCanvas();
	},
	startPointDrag: function () {
		changeDrawMode('anglesAroundPointDrag');
		draw.currPathNum = draw.currCursor.pathNum;
		draw.currPoint = draw.currCursor.point;
		updateSnapPoints(); // update intersection points
		draw.animate(draw.anglesAroundPoint.pointMove,draw.anglesAroundPoint.pointStop,drawCanvasPaths);		
		//addListenerMove(window, draw.anglesAroundPoint.pointMove);
		//addListenerEnd(window, draw.anglesAroundPoint.pointStop);
	},
	pointMove: function (e) {
		updateMouse(e);
		var pos = draw.mouse;
		if (snapToObj2On || draw.snapLinesTogether)
			pos = snapToObj2(pos, draw.currPathNum);
		var pathNum = draw.currPathNum;
		var point = draw.currPoint;
		var obj = draw.path[pathNum].obj[0];
		obj.points[point] = pos;
		if (shiftOn) {
			var angle = getAngleTwoPoints(obj.center, [mouse.x, mouse.y]);
			if (angle < 0)
				angle += 2 * Math.PI;
			var len = getDist(obj.center, pos);
			var snap = (roundToNearest(roundToNearest(angle, Math.PI / 2) / (Math.PI / 2), 1)) % 4;
			if (snap == 0) {
				obj.points[point] = [obj.center[0] + len, obj.center[1]];
			} else if (snap == 1) {
				obj.points[point] = [obj.center[0], obj.center[1] + len];
			} else if (snap == 2) {
				obj.points[point] = [obj.center[0] - len, obj.center[1]];
			} else if (snap == 3) {
				obj.points[point] = [obj.center[0], obj.center[1] - len];
			}
		}
		prevPoint = point - 1;
		if (prevPoint < 0)
			prevPoint = obj.points.length - 1;
		var angle1 = posToAngle(obj.points[prevPoint][0], obj.points[prevPoint][1], obj.center[0], obj.center[1]);
		var angle2 = posToAngle(obj.points[point][0], obj.points[point][1], obj.center[0], obj.center[1]);
		nextPoint = point + 1;
		if (nextPoint > obj.points.length - 1)
			nextPoint = 0;
		var angle3 = posToAngle(obj.points[nextPoint][0], obj.points[nextPoint][1], obj.center[0], obj.center[1]);

		if ((angle1 < angle2 && angle2 < angle3) || // order 123
			(angle2 < angle3 && angle3 < angle1) || // order 231
			(angle3 < angle1 && angle1 < angle2)) { // order 312
		} else {
			if (Math.abs(angle2 - angle1) < Math.abs(angle3 - angle2)) {
				// swap prevPoint & point
				var prev1 = clone(obj.points[prevPoint]);
				var prev2 = clone(obj.points[point]);
				obj.points[point] = prev1;
				obj.points[prevPoint] = prev2;
				var prevA1 = clone(obj.angles[prevPoint]);
				var prevA2 = clone(obj.angles[point]);
				obj.angles[point] = prevA1;
				obj.angles[prevPoint] = prevA2;
				draw.currPoint = prevPoint;
			} else {
				// swap point & nextPoint
				var prev1 = clone(obj.points[nextPoint]);
				var prev2 = clone(obj.points[point]);
				obj.points[point] = prev1;
				obj.points[nextPoint] = prev2;
				var prevA1 = clone(obj.angles[nextPoint]);
				var prevA2 = clone(obj.angles[point]);
				obj.angles[point] = prevA1;
				obj.angles[nextPoint] = prevA2;
				draw.currPoint = nextPoint;
			}
		}

		updateBorder(draw.path[pathNum]);
		//drawSelectedPaths();
		//drawSelectCanvas();
		draw.prevX = mouse.x;
		draw.prevY = mouse.y;
	},
	pointStop: function (e) {
		var pathNum = draw.currPathNum;
		var point = draw.currPoint;
		var obj = draw.path[pathNum].obj[0];
		if (draw.gridSnap == true) {
			obj.points[point][0] = roundToNearest(obj.points[point][0], draw.gridSnapSize);
			obj.points[point][1] = roundToNearest(obj.points[point][1], draw.gridSnapSize);
			updateBorder(draw.path[pathNum]);
			drawSelectedPaths();
			drawSelectCanvas();
		}
		//removeListenerMove(window, draw.anglesAroundPoint.pointMove);
		//removeListenerEnd(window, draw.anglesAroundPoint.pointStop);
		changeDrawMode();
	},
	setAngleStyle: function (e) {
		updateMouse(e);
		var obj = draw.path[draw.currCursor.pathNum].obj[0];
		var mouseAngle = posToAngle(mouse.x, mouse.y, obj.center[0] + draw.drawRelPos[0], obj.center[1] + draw.drawRelPos[1]);

		var angles = [];
		var p = -1;
		for (var i = 0; i < obj.points.length; i++) {
			angles[i] = posToAngle(obj.points[i][0], obj.points[i][1], obj.center[0], obj.center[1]);
		}

		for (var i = 0; i < angles.length; i++) {
			var a1 = angles[i];
			if (i < angles.length - 1) {
				var a2 = angles[i + 1];
			} else {
				var a2 = angles[0];
			}
			if (a1 < a2 && mouseAngle > a1 && mouseAngle < a2) {
				p = i;
				break;
			} else if (a1 > a2) {
				if (mouseAngle > a1 || mouseAngle < a2) {
					p = i;
					break;
				}
			}
		}
		angleStyleIncrement(obj.angles[p]);
		var pathNum = draw.currCursor.pathNum;
		updateBorder(draw.path[pathNum]);
		drawSelectedPaths();
	},
	toggleLabel: function () {
		if (!un(draw.currCursor.pathNum)) {
			var path = draw.path[draw.currCursor.pathNum];
		} else {
			var path = selPath();
		}
		var obj = path.obj[0];
		if (obj.type !== 'anglesAroundPoint')
			return;
		var p = draw.currCursor.point;
		if (un(obj.angles))
			obj.angles = [];
		if (un(obj.angles[p]))
			obj.angles[p] = {
				style: 0,
				radius: 30,
				labelMeasure: true,
				labelFontSize: 25,
				labelRadius: 33,
				drawCurve: false,
				measureLabelOnly: true
			};
		obj.angles[p].measureLabelOnly = !obj.angles[p].measureLabelOnly;
		drawCanvasPaths();
	},
	toggleAngle: function (path) {
		if (!un(draw.currCursor.pathNum)) {
			var path = draw.path[draw.currCursor.pathNum];
		} else {
			var path = selPath();
		}
		var obj = path.obj[0];
		if (obj.type !== 'anglesAroundPoint')
			return;
		var p = draw.currCursor.point;
		if (un(obj.angles))
			obj.angles = [];
		if (un(obj.angles[p]))
			obj.angles[p] = {
				style: 0,
				radius: 30,
				labelMeasure: true,
				labelFontSize: 25,
				labelRadius: 33,
				measureLabelOnly: true
			};
		//obj.angles[p].drawCurve = !obj.angles[p].drawCurve;
		angleStyleIncrement(obj.angles[p]);
		drawCanvasPaths();
	},
	drawButton: function (ctx, size) {
		drawAnglesAroundPoint({
			ctx: ctx,
			center: [0.5 * size, 0.4 * size],
			points: [[0.15 * size, 0.4 * size], [0.8 * size, 0.2 * size], [0.6 * size, 0.7 * size]],
			lineColor: '#000',
			thickness: 0.03 * size,
			angles: [{
					fill: true,
					fillColor: "#CFC",
					lineWidth: 0.02 * size,
					labelFontSize: 0.25 * size,
					labelMeasure: false,
					labelRadius: 0.33 * size,
					radius: 0.2 * size
				}, {
					fill: true,
					fillColor: "#FCC",
					lineWidth: 0.02 * size,
					labelFontSize: 0.25 * size,
					labelMeasure: false,
					labelRadius: 0.33 * size,
					radius: 0.2 * size
				}, {
					fill: true,
					fillColor: "#CCF",
					lineWidth: 0.02 * size,
					labelFontSize: 0.25 * size,
					labelMeasure: false,
					labelRadius: 0.33 * size,
					radius: 0.2 * size
				},
			]
		});
	},
	scale: function (obj, sf, center) {
		if (un(center))
			var center = obj.center;
		obj.center[0] = center[0] + sf * (obj.center[0] - center[0]);
		obj.center[1] = center[1] + sf * (obj.center[1] - center[1]);
		for (var p = 0; p < obj.points.length; p++) {
			obj.points[p][0] = center[0] + sf * (obj.points[p][0] - center[0]);
			obj.points[p][1] = center[1] + sf * (obj.points[p][1] - center[1]);
		}
		if (!un(obj.radius))
			obj.radius *= sf;
		if (!un(obj.thickness))
			obj.thickness *= sf;
		if (!un(obj.dash)) {
			if (!un(obj.dash[0]))
				obj.dash[0] *= sf;
			if (!un(obj.dash[1]))
				obj.dash[1] *= sf;
		}
	},
	getControlPanel: function (obj) {
		var elements = [{
				name: 'Style',
				type: 'style'
			}, {
				name: 'Vertices',
				type: 'increment',
				increment: function (obj, value) {
					if (value == 1) {
						draw.anglesAroundPoint.pointsPlus();
					} else {
						draw.anglesAroundPoint.pointsMinus();
					}
				}
			}
		];
		return {
			obj: obj,
			elements: elements
		};
	}
};
draw.anglesOnLine = {
	add: function () {
		draw.anglesAroundPoint.add(undefined, undefined, undefined, Math.PI, (4 / 3) * Math.PI, 2 * Math.PI);
		draw.path.last().obj[0].angles.last().drawCurve = false;
		draw.path.last().obj[0].angles.last().style = 0;
		drawCanvasPaths();
	},
	drawButton: function (ctx, size) {
		drawAnglesAroundPoint({
			ctx: ctx,
			center: [0.5 * size, 0.6 * size],
			points: [[0.2 * size, 0.6 * size], [0.4 * size, 0.3 * size], [0.8 * size, 0.6 * size]],
			lineColor: '#000',
			thickness: 0.03 * size,
			angles: [{
					fill: true,
					fillColor: "#CFC",
					lineWidth: 0.02 * size,
					labelFontSize: 0.25 * size,
					labelMeasure: false,
					labelRadius: 0.33 * size,
					radius: 0.2 * size
				}, {
					fill: true,
					fillColor: "#CCF",
					lineWidth: 0.02 * size,
					labelFontSize: 0.25 * size,
					labelMeasure: false,
					labelRadius: 0.33 * size,
					radius: 0.2 * size
				}
			]
		});
	}
};
draw.tick = {
	resizable: true,
	add: function () {
		deselectAllPaths();
		var obj = {
			type: 'tick',
			rect: [100 - draw.drawRelPos[0], 100 - draw.drawRelPos[1], 50, 60],
			lineWidth: 10,
			lineColor: '#060'
		};
		draw.path.push({
			obj: [obj],
			selected: true
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
	},
	draw: function (ctx, obj) {
		drawTick(ctx, obj.rect[2], obj.rect[3], obj.lineColor, obj.rect[0], obj.rect[1], obj.lineWidth);
	},
	getRect: function (obj) {
		var rect = clone(obj.rect).concat([obj.rect[0] + obj.rect[2], obj.rect[1] + obj.rect[3]]);
		return rect;
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.rect[0] += dl;
		obj.rect[1] += dt;
		obj.rect[2] += dw;
		obj.rect[3] += dh;
	},
	getCursorPositionsUnselected: function (obj, pathNum) {
		return [{
				shape: 'rect',
				dims: obj.rect,
				cursor: draw.cursors.pointer,
				func: drawClickSelect,
				obj: obj,
				pathNum: pathNum,
				highlight: -1
			}
		];
	},
	setLineWidth: function (obj, lineWidth) {
		obj.lineWidth = lineWidth;
	},
	setLineColor: function (obj, color) {
		obj.lineColor = color;
	},
	getLineWidth: function (obj) {
		return obj.lineWidth;
	},
	getLineColor: function (obj) {
		return obj.lineColor;
	},
	drawButton: function (ctx, size, type) {
		var rect = [(60 * size / 100) / 2, (52 * size / 100) / 2, 40 * size / 100, 48 * size / 100];
		draw.tick.draw(ctx, {
			type: 'tick',
			rect: rect,
			lineWidth: 8 * size / 100,
			lineColor: '#060'
		});
	},
	scale: function (obj, sf, center) {
		if (!un(center)) {
			obj.rect[0] = center[0] + sf * (obj.rect[0] - center[0]);
			obj.rect[1] = center[1] + sf * (obj.rect[1] - center[1]);
		}
		obj.rect[2] *= sf;
		obj.rect[3] *= sf;
		if (!un(obj.lineWidth))
			obj.lineWidth *= sf;
	}
}
draw.cross = {
	resizable: true,
	add: function () {
		deselectAllPaths();
		var obj = {
			type: 'cross',
			rect: [100 - draw.drawRelPos[0], 100 - draw.drawRelPos[1], 50, 60],
			lineWidth: 10,
			lineColor: '#F00'
		};
		draw.path.push({
			obj: [obj],
			selected: true
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
	},
	draw: function (ctx, obj) {
		drawCross(ctx, obj.rect[2], obj.rect[3], obj.lineColor, obj.rect[0], obj.rect[1], obj.lineWidth);
	},
	getRect: function (obj) {
		var rect = clone(obj.rect).concat([obj.rect[0] + obj.rect[2], obj.rect[1] + obj.rect[3]]);
		return rect;
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.rect[0] += dl;
		obj.rect[1] += dt;
		obj.rect[2] += dw;
		obj.rect[3] += dh;
	},
	getCursorPositionsUnselected: function (obj, pathNum) {
		return [{
				shape: 'rect',
				dims: obj.rect,
				cursor: draw.cursors.pointer,
				func: drawClickSelect,
				obj: obj,
				pathNum: pathNum,
				highlight: -1
			}
		];
	},
	setLineWidth: function (obj, lineWidth) {
		obj.lineWidth = lineWidth;
	},
	setLineColor: function (obj, color) {
		obj.lineColor = color;
	},
	getLineWidth: function (obj) {
		return obj.lineWidth;
	},
	getLineColor: function (obj) {
		return obj.lineColor;
	},
	drawButton: function (ctx, size, type) {
		var rect = [(60 * size / 100) / 2, (52 * size / 100) / 2, 40 * size / 100, 48 * size / 100];
		draw.cross.draw(ctx, {
			type: 'cross',
			rect: rect,
			lineWidth: 8 * size / 100,
			lineColor: '#F00'
		});
	},
	scale: function (obj, sf, center) {
		if (!un(center)) {
			obj.rect[0] = center[0] + sf * (obj.rect[0] - center[0]);
			obj.rect[1] = center[1] + sf * (obj.rect[1] - center[1]);
		}
		obj.rect[2] *= sf;
		obj.rect[3] *= sf;
		if (!un(obj.lineWidth))
			obj.lineWidth *= sf;
	}
};
draw.calc = {
	resizable: true,
	add: function () {
		deselectAllPaths();
		var obj = {
			type: 'calc',
			rect: [100 - draw.drawRelPos[0], 100 - draw.drawRelPos[1], 50, 60],
			lineWidth: 10,
			lineColor: '#060'
		};
		draw.path.push({
			obj: [obj],
			selected: true
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
	},
	draw: function (ctx, obj) {
		drawCalcAllowedButton2(ctx, obj.rect[0], obj.rect[1], obj.rect[2], true, '#CFC');
	},
	getRect: function (obj) {
		var rect = clone(obj.rect).concat([obj.rect[0] + obj.rect[2], obj.rect[1] + obj.rect[3]]);
		return rect;
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.rect[0] += dl;
		obj.rect[1] += dt;
		obj.rect[2] += dw;
		obj.rect[3] = obj.rect[2];
	},
	getCursorPositionsUnselected: function (obj, pathNum) {
		return [{
				shape: 'rect',
				dims: obj.rect,
				cursor: draw.cursors.pointer,
				func: drawClickSelect,
				obj: obj,
				pathNum: pathNum,
				highlight: -1
			}
		];
	},
	drawButton: function (ctx, size, type) {
		var rect = [(40 * size / 100) / 2, (40 * size / 100) / 2, 60 * size / 100, 50 * size / 100];
		draw.calc.draw(ctx, {
			type: 'calc',
			rect: rect
		});
	},
	scale: function (obj, sf, center) {
		if (!un(center)) {
			obj.rect[0] = center[0] + sf * (obj.rect[0] - center[0]);
			obj.rect[1] = center[1] + sf * (obj.rect[1] - center[1]);
		}
		obj.rect[2] *= sf;
		obj.rect[3] *= sf;
		if (!un(obj.lineWidth))
			obj.lineWidth *= sf;
	}
}
draw.noncalc = {
	resizable: true,
	add: function () {
		deselectAllPaths();
		var obj = {
			type: 'noncalc',
			rect: [100 - draw.drawRelPos[0], 100 - draw.drawRelPos[1], 50, 60],
			lineWidth: 10,
			lineColor: '#060'
		};
		draw.path.push({
			obj: [obj],
			selected: true
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
	},
	draw: function (ctx, obj) {
		drawCalcAllowedButton2(ctx, obj.rect[0], obj.rect[1], obj.rect[2], false, '#FCF');
	},
	getRect: function (obj) {
		var rect = clone(obj.rect).concat([obj.rect[0] + obj.rect[2], obj.rect[1] + obj.rect[3]]);
		return rect;
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.rect[0] += dl;
		obj.rect[1] += dt;
		obj.rect[2] += dw;
		obj.rect[3] = obj.rect[2];
	},
	getCursorPositionsUnselected: function (obj, pathNum) {
		return [{
				shape: 'rect',
				dims: obj.rect,
				cursor: draw.cursors.pointer,
				func: drawClickSelect,
				obj: obj,
				pathNum: pathNum,
				highlight: -1
			}
		];
	},
	drawButton: function (ctx, size, type) {
		var rect = [(40 * size / 100) / 2, (40 * size / 100) / 2, 60 * size / 100, 50 * size / 100];
		draw.noncalc.draw(ctx, {
			type: 'noncalc',
			rect: rect
		});
	},
	scale: function (obj, sf, center) {
		if (!un(center)) {
			obj.rect[0] = center[0] + sf * (obj.rect[0] - center[0]);
			obj.rect[1] = center[1] + sf * (obj.rect[1] - center[1]);
		}
		obj.rect[2] *= sf;
		obj.rect[3] *= sf;
		if (!un(obj.lineWidth))
			obj.lineWidth *= sf;
	}
}
draw.sphere = {
	resizable: true,
	add: function () {
		deselectAllPaths();
		var obj = {
			type: 'sphere',
			color: draw.color,
			thickness: draw.thickness,
			fillColor: draw.fillColor,
			center: [100 - draw.drawRelPos[0], 100 - draw.drawRelPos[1]],
			radius: 50,
			showCenter: false
		};
		draw.path.push({
			obj: [obj],
			selected: true
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
	},
	draw: function (ctx, obj) {
		if (obj.radius <= 0)
			return;
		ctx.save();
		ctx.strokeStyle = obj.color;
		ctx.lineWidth = obj.thickness;
		if (typeof ctx.setLineDash !== 'function')
			ctx.setLineDash = function () {};
		var startAngle = obj.hemisphere === true ? Math.PI : 0;
		ctx.beginPath();
		ctx.arc(obj.center[0], obj.center[1], obj.radius, startAngle, 2 * Math.PI);
		ctx.stroke();

		ctx.lineWidth = obj.thickness / 2;
		ctx.setLineDash([5, 5]);
		ctx.beginPath();
		ctx.moveTo(obj.center[0] - obj.radius, obj.center[1]);
		ctx.ellipse(obj.center[0], obj.center[1], obj.radius, obj.radius * 0.3, 0, Math.PI, 2 * Math.PI);
		ctx.stroke();

		if (obj.hemisphere === true)
			ctx.lineWidth = obj.thickness;
		ctx.beginPath();
		ctx.setLineDash([]);
		ctx.ellipse(obj.center[0], obj.center[1], obj.radius, obj.radius * 0.3, 0, 0, Math.PI);
		ctx.stroke();
		ctx.restore();
	},
	getRect: function (obj) {
		if (obj.hemisphere === true) {
			var rect = [obj.center[0] - obj.radius, obj.center[1] - obj.radius, obj.radius * 2, obj.radius * 1.3];
		} else {
			var rect = [obj.center[0] - obj.radius, obj.center[1] - obj.radius, obj.radius * 2, obj.radius * 2];
		}
		return rect;
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.center[0] += dl;
		obj.center[1] += dt;
		if (dw !== 0 || dh !== 0) {
			var x = mouse.x - draw.drawRelPos[0];
			var y = mouse.y - draw.drawRelPos[1];
			obj.radius = Math.abs(Math.min(x - obj.center[0], y - obj.center[1]));
		}
	},
	getCursorPositionsUnselected: function (obj, pathNum) {
		if (obj.fillColor !== 'none') {
			return [{
					shape: 'circle',
					dims: [obj.center[0], obj.center[1], obj.radius],
					cursor: draw.cursors.pointer,
					func: drawClickSelect,
					pathNum: pathNum,
					highlight: -1
				}
			];
		} else {
			return [{
					shape: 'openCircle',
					dims: [obj.center[0], obj.center[1], obj.radius, draw.selectTolerance],
					cursor: draw.cursors.pointer,
					func: drawClickSelect,
					pathNum: pathNum,
					highlight: -1
				}
			];
		}
	},
	getSnapPos: function (obj) {},
	setLineWidth: function (obj, lineWidth) {
		obj.thickness = lineWidth;
	},
	setLineColor: function (obj, color) {
		obj.color = color;
	},
	setFillColor: function (obj, color) {
		obj.fillColor = color;
	},
	getLineWidth: function (obj) {
		return obj.thickness;
	},
	getLineColor: function (obj) {
		return obj.color;
	},
	getFillColor: function (obj) {
		return obj.fillColor;
	},
	drawButton: function (ctx, size) {
		draw.sphere.draw(ctx, {
			center: [0.5 * size, 0.5 * size],
			radius: 0.3 * size,
			color: '#000',
			thickness: size * 0.02
		});
	},
	scale: function (obj, sf, center) {
		if (!un(center)) {
			obj.center[0] = center[0] + sf * (obj.center[0] - center[0]);
			obj.center[1] = center[1] + sf * (obj.center[1] - center[1]);
		}
		if (!un(obj.thickness))
			obj.thickness *= sf;
		if (!un(obj.radius))
			obj.radius *= sf;
	}
};
draw.ellipticalArc = {
	resizable: true,
	add: function () {
		deselectAllPaths();
		var obj = {
			type: 'ellipticalArc',
			color: draw.color,
			thickness: draw.thickness,
			fillColor: draw.fillColor,
			center: [100 - draw.drawRelPos[0], 100 - draw.drawRelPos[1]],
			radiusX: 50,
			radiusY: 30,
			angle1: Math.PI,
			angle2: 2 * Math.PI,
			showLines: false,
			showCenter: false
		};
		draw.path.push({
			obj: [obj],
			selected: true
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
	},
	draw: function (ctx, obj, path) {
		if (obj.radius <= 0)
			return;
		ctx.save();
		ctx.strokeStyle = obj.color;
		ctx.lineWidth = obj.thickness;
		if (typeof ctx.setLineDash !== 'function')
			ctx.setLineDash = function () {};
		var dash = !un(obj.dash) ? obj.dash : [];
		ctx.setLineDash(dash);

		if (obj.fillColor !== 'none') {
			ctx.beginPath();
			ctx.moveTo(obj.center[0], obj.center[1]);
			ctx.lineTo(obj.center[0] + obj.radiusX * Math.cos(obj.angle1), obj.center[1] + obj.radiusY * Math.sin(obj.angle1));
			ctx.ellipse(obj.center[0], obj.center[1], obj.radiusX, obj.radiusY, 0, obj.angle1, obj.angle2);
			ctx.lineTo(obj.center[0], obj.center[1]);
			ctx.fillStyle = obj.fillColor;
			ctx.fill();
		}

		ctx.beginPath();
		if (obj.showLines == true) {
			ctx.moveTo(obj.center[0], obj.center[1]);
			ctx.lineTo(obj.center[0] + obj.radiusX * Math.cos(obj.angle1), obj.center[1] + obj.radiusY * Math.sin(obj.angle1));
		} else {
			ctx.moveTo(obj.center[0] + obj.radiusX * Math.cos(obj.angle1), obj.center[1] + obj.radiusY * Math.sin(obj.angle1));
		}
		ctx.ellipse(obj.center[0], obj.center[1], obj.radiusX, obj.radiusY, 0, obj.angle1, obj.angle2);
		if (obj.showLines == true) {
			ctx.lineTo(obj.center[0], obj.center[1]);
		}
		ctx.stroke();
		ctx.setLineDash([]);

		if (!un(path) && path.selected == true) {
			ctx.lineWidth = 1;
			ctx.strokeStyle = '#000';
			ctx.fillStyle = '#F00';
			ctx.beginPath();
			ctx.arc(obj.center[0] + obj.radiusX * Math.cos(obj.angle1), obj.center[1] + obj.radiusY * Math.sin(obj.angle1), 8, 0, 2 * Math.PI);
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(obj.center[0] + obj.radiusX * Math.cos(obj.angle2), obj.center[1] + obj.radiusY * Math.sin(obj.angle2), 8, 0, 2 * Math.PI);
			ctx.fill();
			ctx.stroke();
		}

		ctx.restore();
	},
	getRect: function (obj) {
		return [obj.center[0] - obj.radiusX, obj.center[1] - obj.radiusY, obj.radiusX * 2, obj.radiusY * 2];
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.center[0] += dl;
		obj.center[1] += dt;
		obj.radiusX += dw;
		obj.radiusY += dh;
	},
	getCursorPositionsUnselected: function (obj, pathNum) {
		if (obj.fillColor !== 'none') {
			return [{
					shape: 'ellipse',
					dims: [obj.center[0], obj.center[1], obj.radiusX, obj.radiusY],
					cursor: draw.cursors.pointer,
					func: drawClickSelect,
					pathNum: pathNum,
					highlight: -1
				}
			];
		} else {
			return [{
					shape: 'ellipse',
					dims: [obj.center[0], obj.center[1], obj.radiusX, obj.radiusY, draw.selectTolerance],
					cursor: draw.cursors.pointer,
					func: drawClickSelect,
					pathNum: pathNum,
					highlight: -1
				}
			];
		}
	},
	getCursorPositionsSelected: function (obj, pathNum) {
		var a = [obj.center[0] + obj.radiusX * Math.cos(obj.angle1), obj.center[1] + obj.radiusY * Math.sin(obj.angle1), 8];
		var b = [obj.center[0] + obj.radiusX * Math.cos(obj.angle2), obj.center[1] + obj.radiusY * Math.sin(obj.angle2), 8];
		return [{
				shape: 'circle',
				dims: a,
				cursor: draw.cursors.pointer,
				func: draw.ellipticalArc.startDrag1,
				pathNum: pathNum,
				draw: true,
				color: '#F00'
			}, {
				shape: 'circle',
				dims: b,
				cursor: draw.cursors.pointer,
				func: draw.ellipticalArc.startDrag2,
				pathNum: pathNum,
				draw: true,
				color: '#F00'
			}
		];
	},
	startDrag1: function (e) {
		changeDrawMode('ellipticalArcDrag1');
		draw.currPathNum = draw.currCursor.pathNum;
		updateSnapPoints(); // update intersection points
		draw.animate(draw.ellipticalArc.posMove,draw.ellipticalArc.posStop,drawCanvasPaths);		
		//addListenerMove(window, draw.ellipticalArc.posMove);
		//addListenerEnd(window, draw.ellipticalArc.posStop);
	},
	startDrag2: function (e) {
		changeDrawMode('ellipticalArcDrag2');
		draw.currPathNum = draw.currCursor.pathNum;
		updateSnapPoints(); // update intersection points
		draw.animate(draw.ellipticalArc.posMove,draw.ellipticalArc.posStop,drawCanvasPaths);		
		//addListenerMove(window, draw.ellipticalArc.posMove);
		//addListenerEnd(window, draw.ellipticalArc.posStop);
	},
	posMove: function (e) {
		updateMouse(e);
		var pos = draw.mouse;
		var pathNum = draw.currPathNum;
		if (snapToObj2On || draw.snapLinesTogether)
			pos = snapToObj2(pos, pathNum);
		var obj = draw.path[pathNum].obj[0];
		var angle = getAngleTwoPoints(obj.center, pos);
		if (shiftOn == true || ctrlOn == true) {
			var tol = 0.3;
			if (Math.abs(angle) < tol)
				angle = 0;
			if (Math.abs(Math.PI / 2 - angle) < tol)
				angle = Math.PI / 2;
			if (Math.abs(Math.PI - angle) < tol)
				angle = Math.PI;
			if (Math.abs(Math.PI * (3 / 2) - angle) < tol)
				angle = Math.PI * (3 / 2);
			if (Math.abs(Math.PI * 2 - angle) < tol)
				angle = Math.PI * 2;
		}
		if (draw.drawMode == 'ellipticalArcDrag1') {
			obj.angle1 = angle;
		} else if (draw.drawMode == 'ellipticalArcDrag2') {
			obj.angle2 = angle;
		}
		//drawSelectedPaths();
		//drawSelectCanvas();
	},
	posStop: function (e) {
		//removeListenerMove(window, draw.ellipticalArc.posMove);
		//removeListenerEnd(window, draw.ellipticalArc.posStop);
		changeDrawMode();
	},
	getSnapPos: function (obj) {},
	setLineWidth: function (obj, lineWidth) {
		obj.thickness = lineWidth;
	},
	setLineColor: function (obj, color) {
		obj.color = color;
	},
	setFillColor: function (obj, color) {
		obj.fillColor = color;
	},
	setLineDash: function (obj, dash) {
		obj.dash = dash;
	},
	getLineWidth: function (obj) {
		return obj.thickness;
	},
	getLineColor: function (obj) {
		return obj.color;
	},
	getFillColor: function (obj) {
		return obj.fillColor;
	},
	getLineDash: function (obj) {
		return !un(obj.dash) ? obj.dash : [0, 0];
	},
	getButtons: function (x1, y1, x2, y2, pathNum) {
		return [{
				buttonType: 'angle-showLines',
				shape: 'rect',
				dims: [x2 - 20, y2 - 40, 20, 20],
				cursor: draw.cursors.pointer,
				func: draw.ellipticalArc.toggleLines,
				pathNum: pathNum
			}
		];
	},
	toggleLines: function (e) {
		var obj = draw.path[draw.currCursor.pathNum].obj[0];
		obj.showLines = !obj.showLines;
		drawSelectedPaths();
	},
	drawButton: function (ctx, size, type) {
		var obj = {
			type: 'ellipticalArc',
			color: '#000',
			thickness: size * (2 / 55),
			fillColor: 'none',
			center: [size / 2, size / 3],
			radiusX: size / 3,
			radiusY: size / 4,
			angle1: 0,
			angle2: Math.PI,
			showLines: false,
			showCenter: false
		}
		draw.ellipticalArc.draw(ctx, obj);
	},
	scale: function (obj, sf, center) {
		if (un(center))
			var center = obj.center;
		obj.center[0] = center[0] + sf * (obj.center[0] - center[0]);
		obj.center[1] = center[1] + sf * (obj.center[1] - center[1]);
		if (!un(obj.radiusX))
			obj.radiusX *= sf;
		if (!un(obj.radiusY))
			obj.radiusY *= sf;
		if (!un(obj.thickness))
			obj.thickness *= sf;
	}
};
draw.boxPlot = {
	resizable: true,
	add: function () {
		deselectAllPaths();
		var obj = {
			type: 'boxPlot',
			left: 50 - draw.drawRelPos[0],
			top: 150 - draw.drawRelPos[1],
			width: 400,
			height: 100,
			min: 0,
			max: 80,
			lineWidth: 4,
			color: '#000',
			fillColor: 'none',
			chartData: [10, 25, 40, 48, 65]
		};
		draw.path.push({
			obj: [obj],
			selected: true
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
		console.log(sel());
	},
	draw: function (ctx, obj, path) {
		ctx.save();
		ctx.strokeStyle = obj.color || '#000';
		ctx.lineWidth = obj.lineWidth || 4;
		ctx.lineJoin = 'round';
		ctx.lineCap = 'round';
		if (typeof ctx.setLineDash == 'undefined')
			ctx.setLineDash = function () {};
		ctx.setLineDash([]);

		var xPos = [];
		for (var i = 0; i < obj.chartData.length; i++)
			xPos[i] = getPosOfCoordX2(obj.chartData[i], obj.left, obj.width, obj.min, obj.max);
		var yPos = [obj.top, obj.top + 0.25 * obj.height, obj.top + 0.5 * obj.height, obj.top + 0.75 * obj.height, obj.top + obj.height];

		//* fill
		if (obj.fillColor !== 'none') {
			ctx.fillStyle = obj.fillColor;
			ctx.fillRect(xPos[1], yPos[0], xPos[3] - xPos[1], yPos[4] - yPos[0]);
		};
		//*/

		ctx.beginPath();

		ctx.moveTo(xPos[0], yPos[2]);
		ctx.lineTo(xPos[1], yPos[2]);

		ctx.moveTo(xPos[1], yPos[0]);
		ctx.lineTo(xPos[3], yPos[0]);

		ctx.moveTo(xPos[1], yPos[4]);
		ctx.lineTo(xPos[3], yPos[4]);

		ctx.moveTo(xPos[3], yPos[2]);
		ctx.lineTo(xPos[4], yPos[2]);

		// vertLines
		ctx.moveTo(xPos[0], yPos[1]);
		ctx.lineTo(xPos[0], yPos[3]);

		ctx.moveTo(xPos[1], yPos[0]);
		ctx.lineTo(xPos[1], yPos[4]);

		ctx.moveTo(xPos[3], yPos[0]);
		ctx.lineTo(xPos[3], yPos[4]);

		ctx.moveTo(xPos[4], yPos[1]);
		ctx.lineTo(xPos[4], yPos[3]);

		ctx.stroke();

		ctx.setLineDash([8, 5]);
		ctx.lineWidth = 0.6 * ctx.lineWidth;
		ctx.beginPath();
		ctx.moveTo(xPos[2], yPos[0]);
		ctx.lineTo(xPos[2], yPos[4]);
		ctx.stroke();

		ctx.restore();
	},
	getRect: function (obj) {
		return [obj.left, obj.top, obj.width, obj.height];
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.left += dl;
		obj.top += dt;
		obj.width += dw;
		obj.height += dh;
	},
	setLineWidth: function (obj, lineWidth) {
		obj.lineWidth = lineWidth;
	},
	setLineColor: function (obj, color) {
		obj.color = color;
	},
	setFillColor: function (obj, color) {
		obj.fillColor = color;
	},
	getLineWidth: function (obj) {
		return obj.lineWidth;
	},
	getLineColor: function (obj) {
		return obj.color;
	},
	getFillColor: function (obj) {
		return obj.fillColor;
	},
	scale: function (obj, sf, center) {
		if (!un(center)) {
			obj.left = center[0] + sf * (obj.left - center[0]);
			obj.top = center[1] + sf * (obj.top - center[1]);
		}
		obj.width *= sf;
		obj.height *= sf;
		if (!un(obj.lineWidth))
			obj.lineWidth *= sf;
	}
};

draw.slider = {
	resizable: true,
	add: function () {
		deselectAllPaths();
		var obj = {
			type: 'slider',
			left: 50 - draw.drawRelPos[0],
			top: 50 - draw.drawRelPos[1],
			width: 200,
			radius: 15,
			value: 0,
			lineWidth: 4,
			color: '#000',
			fillColor: '#00F',
			interact: {
				onchange: function (obj) {}
			}
		};
		draw.path.push({
			obj: [obj],
			selected: true
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
		console.log(sel());
	},
	draw: function (ctx, obj, path) {
		if (obj.vertical === true) {
			var x1 = obj.left + obj.radius;
			var x2 = obj.left + obj.radius;
			var y1 = obj.top + obj.radius;
			var y2 = obj.top + obj.width - obj.radius;
			var y3 = y1 + obj.value * (y2 - y1);
			obj._pos = [x1, y3, obj.radius];
		} else {
			var x1 = obj.left + obj.radius;
			var x2 = obj.left + obj.width - obj.radius;
			var y1 = obj.top + obj.radius;
			var y2 = obj.top + obj.radius;
			var x3 = x1 + obj.value * (x2 - x1);
			obj._pos = [x3, y1, obj.radius];
		}

		ctx.beginPath();
		ctx.strokeStyle = obj.color || '#000';
		ctx.lineWidth = obj.lineWidth || 4;
		ctx.lineJoin = 'round';
		ctx.lineCap = 'round';
		if (typeof ctx.setLineDash == 'undefined') ctx.setLineDash = function () {};
		ctx.setLineDash([]);
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();

		ctx.beginPath();
		ctx.fillStyle = obj.fillColor;
		ctx.arc(obj._pos[0], obj._pos[1], obj.radius, 0, 2 * Math.PI);
		ctx.fill();
		
		if (typeof obj.control === 'object') {
			var pos = obj.control.pos || [obj.left-60,obj.top+obj.radius];
			var state = obj.control.state || 'paused';
			var color = obj.control.color || '#CFF';
			ctx.save();
			ctx.translate(pos[0]-25,pos[1]-25);
			roundedRect2(ctx, 0, 0, 50, 50, 10, 3, '#000', color);
			ctx.fillStyle = '#000';
			if (state === 'paused') {
				ctx.lineCap = 'round';
				ctx.lineJoin = 'round';
				ctx.beginPath();
				ctx.moveTo(16, 14);
				ctx.lineTo(34, 25);
				ctx.lineTo(16, 36);
				ctx.lineTo(16, 14);
				ctx.fill();
			} else if (state === 'playing') {
				ctx.fillRect(14,12,8,26);
				ctx.fillRect(28,12,8,26);
			}
			ctx.restore();
		}
	},
	getCursorPositionsSelected: function(obj,path,p) {
		var pos = [];
		pos.push({shape:'circle',dims:obj._pos,cursor:draw.cursors.move1,func:draw.slider.dragStart,interact:true,path:path,obj:obj});
		
		if (typeof obj.control === 'object') {
			var controlPos = obj.control.pos || [obj.left-60,obj.top+obj.radius];
			var controlRect = [controlPos[0]-25,controlPos[1]-25,50,50];
			pos.push({shape:'rect',dims:controlRect,cursor:draw.cursors.move1,func:draw.slider.controlMoveStart,interact:true,path:path,obj:obj});
		}
		
		return pos;
	},
	getCursorPositionsInteract: function(obj,path,p) {
		var pos = [];
		pos.push({shape:'circle',dims:obj._pos,cursor:draw.cursors.move1,func:draw.slider.dragStart,interact:true,path:path,obj:obj});
		
		if (typeof obj.control === 'object') {
			var controlPos = obj.control.pos || [obj.left-60,obj.top+obj.radius];
			var controlRect = [controlPos[0]-25,controlPos[1]-25,50,50];
			pos.push({shape:'rect',dims:controlRect,cursor:draw.cursors.pointer,func:draw.slider.controlClick,interact:true,path:path,obj:obj});
		}
		
		return pos;
	},
	controlClick: function() {
		var obj = draw.currCursor.obj;
		var state = obj.control.state || 'paused';
		if (state === 'paused') {
			var rate = obj.control.rate || 0.1;
			if (obj.value > 0.95) obj.value = 0;
			draw.slider.animationStart(obj,rate,drawCanvasPaths);
		} else if (state === 'playing') {
			draw.slider.animationStop();
		}
	},
	controlMoveStart: function() {
		draw._drag = draw.currCursor;
		var obj = draw._drag.obj;
		var controlPos = obj.control.pos || [obj.left-60,obj.top+obj.radius];
		draw._drag.offset = [draw.mouse[0]-controlPos[0],draw.mouse[1]-controlPos[1]];
		draw.animate(draw.slider.controlMoveMove,draw.slider.controlMoveStop,drawSelectedPaths);
	},
	controlMoveMove: function(e) {
		updateMouse(e);
		var obj = draw._drag.obj;
		var pos = [draw.mouse[0]-draw._drag.offset[0],draw.mouse[1]-draw._drag.offset[1]];
		if (Math.abs(obj.top+obj.radius - pos[1]) < 20) pos[1] = obj.top+obj.radius;
		obj.control.pos = pos;
	},
	controlMoveStop: function(e) {
		delete draw._drag;
	},
	drawButton: function (ctx, size) {
		draw.slider.draw(ctx, {
			type: 'slider',
			left: 0.15 * size,
			top: 0.4 * size,
			width: 0.8 * size,
			radius: 0.1 * size,
			value: 0,
			lineWidth: 0.02 * size,
			color: '#000',
			fillColor: '#00F'
		});
	},
	getButtons: function (x1, y1, x2, y2, pathNum) {
		var buttons = [];
		buttons.push({
			buttonType: 'slider-function',
			shape: 'rect',
			dims: [x1 + 20, y2 - 20, 80, 20],
			cursor: draw.cursors.pointer,
			func: draw.slider.editChangeFunction,
			pathNum: pathNum,
			draw: function (path, ctx, l, t, w, h) {
				var obj = path.obj[0];
				ctx.fillStyle = colorA('#F99', 0.5);
				ctx.fillRect(l, t, w, h);
				text({
					ctx: ctx,
					rect: [l, t, w, h],
					align: [0, 0],
					text: ['onchange'],
					fontSize: 14
				});
			}
		});
		buttons.push({
			buttonType: 'slider-setValue',
			shape: 'rect',
			dims: [x2 - 60, y2 - 20, 40, 20],
			cursor: draw.cursors.pointer,
			func: draw.slider.setValue,
			pathNum: pathNum,
			draw: function (path, ctx, l, t, w, h) {
				var obj = path.obj[0];
				ctx.fillStyle = colorA('#9FF', 0.5);
				ctx.fillRect(l, t, w, h);
				text({
					ctx: ctx,
					rect: [l, t, w, h],
					align: [0, 0],
					text: [String(roundToNearest(obj.value, 0.01))],
					fontSize: 14
				});
			}
		});
		buttons.push({
			buttonType: 'slider-control',
			shape: 'rect',
			dims: [x1 + 100, y2 - 20, 80, 20],
			cursor: draw.cursors.pointer,
			func: draw.slider.toggleControl,
			pathNum: pathNum,
			draw: function (path, ctx, l, t, w, h) {
				var obj = path.obj[0];
				ctx.fillStyle = colorA('#CCF', 0.5);
				ctx.fillRect(l, t, w, h);
				text({
					ctx: ctx,
					rect: [l, t, w, h],
					align: [0, 0],
					text: ['Control'],
					fontSize: 14
				});
			}
		});
		return buttons;
	},
	setValue: function (obj) {
		if (un(obj)) obj = draw.path[draw.currCursor.pathNum].obj[0];
		obj.value = prompt('Value:', obj.value);
		if (isNaN(Number(obj.value))) obj.value = 0;
		obj.value = Math.min(1, Math.max(0, obj.value));
		drawCanvasPaths();
	},
	toggleControl: function(obj) {
		if (un(obj)) obj = draw.path[draw.currCursor.pathNum].obj[0];
		if (!un(obj.control)) {
			delete obj.control;
		} else {
			obj.control = {};
		}
		drawCanvasPaths();
	},
	editChangeFunction: function (obj) {
		if (un(obj)) {
			var path = draw.path[draw.currCursor.pathNum];
			var obj = path.obj[0];
		}
		if (un(obj.interact))
			obj.interact = {};
		if (un(obj.interact.onchange))
			obj.interact.onchange = function (obj) {};
		draw.codeEditor.open(obj.interact, 'onchange');
	},
	getRect: function (obj) {
		if (obj.vertical === true) {
			return [obj.left, obj.top, obj.radius * 2, obj.width];
		} else {
			return [obj.left, obj.top, obj.width, obj.radius * 2];
		}
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.left += dl;
		obj.top += dt;
		if (obj.vertical === true) {
			obj.width += dh;
		} else {
			obj.width += dw;
		}
	},
	setLineWidth: function (obj, lineWidth) {
		obj.lineWidth = lineWidth;
	},
	setLineColor: function (obj, color) {
		obj.color = color;
	},
	setFillColor: function (obj, color) {
		obj.fillColor = color;
	},
	getLineWidth: function (obj) {
		return obj.lineWidth;
	},
	getLineColor: function (obj) {
		return obj.color;
	},
	getFillColor: function (obj) {
		return obj.fillColor;
	},
	scale: function (obj, sf, center) {
		if (!un(center)) {
			obj.left = center[0] + sf * (obj.left - center[0]);
			obj.top = center[1] + sf * (obj.top - center[1]);
		}
		obj.width *= sf;
		obj.radius *= sf;
		if (!un(obj.lineWidth))
			obj.lineWidth *= sf;
	},
	dragStart: function (e) {
		//console.log(draw.currCursor);
		changeDrawMode('slider-drag');
		draw.cursorCanvas.style.cursor = draw.cursors.move2;
		draw._drag = draw.currCursor;
		//addListenerMove(window, draw.slider.dragMove);
		//addListenerEnd(window, draw.slider.dragStop);
		draw.animate(draw.slider.dragMove,draw.slider.dragStop,drawCanvasPaths);
		/*var obj = draw._drag.obj;
		if (!un(obj.interact) && !un(obj.interact.objs)) {
			obj._path._interacting = true;
			for (var i = 0; i < obj.interact.objs.length; i++) {
				o(obj.interact.objs[i])._path._interacting = true;
			}
		}*/
	},
	dragMove: function (e) {
		updateMouse(e);
		var x = draw.mouse[0];
		var y = draw.mouse[1];
		var obj = draw._drag.obj;
		if (obj.vertical === true) {
			obj.value = Math.max(0, Math.min(1, (y - (obj.top + obj.radius)) / (obj.width - obj.radius * 2)));
		} else {
			obj.value = Math.max(0, Math.min(1, (x - (obj.left + obj.radius)) / (obj.width - obj.radius * 2)));
		}
		if (!un(obj.interact) && !un(obj.interact.onchange)) obj.interact.onchange(obj);
		/*if (!un(obj.interact) && !un(obj.interact.objs)) {
			drawSelectedPaths();
		} else {
			drawCanvasPaths();
		}*/
	},
	dragStop: function (e) {
		changeDrawMode();
		draw.cursorCanvas.style.cursor = draw.cursors.move1;
		//removeListenerMove(window, draw.slider.dragMove);
		//removeListenerEnd(window, draw.slider.dragStop);
		/*var obj = draw._drag.obj;
		if (!un(obj.interact) && !un(obj.interact.objs)) {
			delete obj._path.interacting;
			for (var i = 0; i < obj.interact.objs.length; i++) {
				delete o(obj.interact.objs[i])._path._interacting;
			}
		}
		drawCanvasPaths();*/
		delete draw._drag;
	},
	animationStart: function(obj,rate,drawFunction) {
		var d = new Date();		
		draw._sliderAnimation = {
			obj:obj,
			start:d.getTime(),
			rate:rate || 0.1,
			initial:obj.value,
			drawFunction:drawFunction || drawCanvasPaths,
		};
		if (!un(obj.control)) obj.control.state = 'playing';
		drawCanvasPaths();
		draw._sliderAnimation.frameID = window.requestAnimationFrame(draw.slider.animationFrame);
	},
	animationFrame: function() {
		var d = new Date();
		var time = d.getTime() - draw._sliderAnimation.start;
		time = time/1000;
		draw._sliderAnimation.obj.value = Math.min(1,Math.max(0,draw._sliderAnimation.initial+time*draw._sliderAnimation.rate));
		if (!un(draw._sliderAnimation.obj.interact) && !un(draw._sliderAnimation.obj.interact.onchange)) {
			draw._sliderAnimation.obj.interact.onchange(draw._sliderAnimation.obj);
		}
		
		if (draw._sliderAnimation.stop === true || draw._sliderAnimation.obj.value === 1) {
			draw.slider.animationStop();
		} else {
			draw._sliderAnimation.drawFunction();
			draw._sliderAnimation.frameID = window.requestAnimationFrame(draw.slider.animationFrame);
		}
	},
	animationStop: function() {
		if (!un(draw._sliderAnimation)) {
			window.cancelAnimationFrame(draw._sliderAnimation.frameID);
			var obj = draw._sliderAnimation.obj;
			if (!un(obj.control)) obj.control.state = 'paused';
			drawCanvasPaths();
			delete draw._sliderAnimation;
		}
	}
};
draw.toggle = {
	resizable: true,
	add: function () {
		deselectAllPaths();
		var obj = {
			type: 'toggle',
			left: 50 - draw.drawRelPos[0],
			top: 50 - draw.drawRelPos[1],
			width: 140,
			height: 40,
			value: false,
			text: 'toggle',
			onchange: function (obj) {}
		};
		draw.path.push({
			obj: [obj],
			selected: true
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
		console.log(sel());
	},
	draw: function (ctx, obj, path) {
		text({
			ctx: ctx,
			align: [-1, 0],
			rect: [obj.left, obj.top, obj.width, obj.height],
			text: [obj.text],
			box: {
				type: 'loose',
				color: '#FFF',
				borderColor: '#000',
				borderWidth: 2,
				radius: 5
			}
		});
		ctx.beginPath();
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 2;
		ctx.fillStyle = obj.value == true ? '#6F6' : '#F66';
		var r = obj.left + obj.width;
		var m = obj.top + obj.height / 2;
		ctx.moveTo(r - 35, m - 13);
		ctx.lineTo(r - 20, m - 13);
		ctx.arc(r - 20, m, 13, 1.5 * Math.PI, 0.5 * Math.PI);
		ctx.lineTo(r - 35, m + 13);
		ctx.arc(r - 35, m, 13, 0.5 * Math.PI, 1.5 * Math.PI);
		ctx.fill();
		ctx.stroke();

		ctx.beginPath();
		ctx.fillStyle = '#000';
		if (obj.value == false) {
			ctx.arc(r - 35, m, 9, 0, 2 * Math.PI);
		} else {
			ctx.arc(r - 20, m, 9, 0, 2 * Math.PI);
		}
		ctx.fill();
		ctx.stroke();
	},
	drawButton: function (ctx, size) {
		var l = size * 0.15;
		var t = size * 0.4;
		var w = size * 0.7;
		var h = size * 0.2;
		var c = size * 0.5;
		var m = size * 0.5;
		var rad = size * 0.1;

		ctx.beginPath();
		ctx.strokeStyle = '#000';
		ctx.lineWidth = size * 0.02;
		ctx.fillStyle = '#6F6';
		ctx.moveTo(c - rad, m - rad * 1.5);
		ctx.lineTo(c + rad, m - rad * 1.5);
		ctx.arc(c + rad, m, rad * 1.5, 1.5 * Math.PI, 0.5 * Math.PI);
		ctx.lineTo(c - rad, m + rad * 1.5);
		ctx.arc(c - rad, m, rad * 1.5, 0.5 * Math.PI, 1.5 * Math.PI);
		ctx.fill();
		ctx.stroke();

		ctx.beginPath();
		ctx.fillStyle = '#000';
		ctx.arc(c + rad * 0.75, m, rad, 0, 2 * Math.PI);
		ctx.fill();
		ctx.stroke();
	},
	getCursorPositionsSelected: function (obj, pathNum) {
		var pos = [{
				shape: 'rect',
				dims: [obj.left, obj.top, obj.width - 35, obj.height],
				cursor: draw.cursors.pointer,
				func: draw.toggle.setText,
				pathNum: pathNum
			}
		];
		return pos;
	},
	getCursorPositionsInteract: function (obj, path, pathNum) {
		var pos = [];
		pos.push({
			buttonType: 'toggle-toggle',
			shape: 'rect',
			dims: [obj.left, obj.top, obj.width, obj.height],
			cursor: draw.cursors.pointer,
			func: draw.toggle.toggle,
			pathNum: pathNum,
			obj: obj
		});
		return pos;
	},
	getButtons: function (x1, y1, x2, y2, pathNum) {
		var buttons = [];
		buttons.push({
			buttonType: 'toggle-function',
			shape: 'rect',
			dims: [x1 + 20, y2 - 20, 80, 20],
			cursor: draw.cursors.pointer,
			func: draw.toggle.editChangeFunction,
			pathNum: pathNum,
			draw: function (path, ctx, l, t, w, h) {
				var obj = path.obj[0];
				ctx.fillStyle = colorA('#F99', 0.5);
				ctx.fillRect(l, t, w, h);
				text({
					ctx: ctx,
					rect: [l, t, w, h],
					align: [0, 0],
					text: ['onchange'],
					fontSize: 14
				});
			}
		});
		buttons.push({
			buttonType: 'toggle-toggle',
			shape: 'rect',
			dims: [x2 - 60, y2 - 20, 40, 20],
			cursor: draw.cursors.pointer,
			func: draw.toggle.toggle,
			pathNum: pathNum,
			draw: function (path, ctx, l, t, w, h) {
				var obj = path.obj[0];
				ctx.fillStyle = colorA('#9FF', 0.5);
				ctx.fillRect(l, t, w, h);
				text({
					ctx: ctx,
					rect: [l, t, w, h],
					align: [0, 0],
					text: [String(obj.value)],
					fontSize: 14
				});
			}
		});
		return buttons;
	},
	editChangeFunction: function (obj) {
		if (un(obj)) {
			var path = draw.path[draw.currCursor.pathNum];
			var obj = path.obj[0];
		}
		if (un(obj.onchange))
			obj.onchange = function (obj) {};
		draw.codeEditor.open(obj, 'onchange');
	},
	getRect: function (obj) {
		return [obj.left, obj.top, obj.width, obj.height];
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.left += dl;
		obj.top += dt;
		obj.width += dw;
	},
	setText: function (obj) {
		if (un(obj))
			obj = draw.path[draw.currCursor.pathNum].obj[0];
		obj.text = prompt('Text for toggle object:', obj.text);
		if (typeof obj.text !== 'string')
			obj.text = '';
		drawCanvasPaths();
	},
	toggle: function (obj) {
		if (un(obj))
			obj = draw.currCursor.obj;
		obj.value = !obj.value;
		if (typeof obj.onchange == 'function') {
			obj.onchange(obj);
		} else if (!un(obj.interact) && typeof obj.interact.onchange == 'function') {
			obj.interact.onchange(obj);
		}
		drawCanvasPaths();
	}

}

draw.feedback = {
	draw: function (ctx, obj, path) {
		if (draw.mode == 'interact') {
			if (!un(obj._feedback)) {
				var fb = typeof obj._feedback == 'string' ? [obj._feedback] : clone(obj._feedback);
				var color = obj._color || '#F00';
				fb.unshift('<<font:Hobo>><<color:' + color + '>><<fontSize:36>>');
				text({
					ctx: ctx,
					rect: obj.rect,
					align: [0, 0],
					text: fb
				});
			}
		} else {
			text({
				ctx: ctx,
				rect: obj.rect,
				align: [0, 0],
				text: ['<<font:Hobo>><<color:#060>><<fontSize:36>>Feedback will appear here'],
				box: {
					color: 'none',
					borderColor: '#666',
					borderWidth: 1,
					radius: 10
				}
			});
		}
	},
	getRect: function (obj) {
		return obj.rect;
	},
	scale: function (obj, sf, center) {
		if (!un(center)) {
			obj.rect[0] = center[0] + sf * (obj.rect[0] - center[0]);
			obj.rect[1] = center[1] + sf * (obj.rect[1] - center[1]);
		}
		obj.rect[2] *= sf;
		obj.rect[3] *= sf;
	}
}

draw.probabilityTree = {
	resizable: true,
	add: function () {
		deselectAllPaths();
		var obj = {
			type: 'probabilityTree',
			left: 50 - draw.drawRelPos[0],
			top: 50 - draw.drawRelPos[1],
			widths: [250, 100, 250, 100, 250],
			height: 400,
			lineWidth: 4,
			color: '#000',
			branches: [2, 2],
		};
		draw.path.push({
			obj: [obj],
			selected: true
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
		console.log(sel());
	},
	draw: function (ctx, obj, path) {
		var left = obj.left;
		var top = obj.top;
		var widths = obj.widths;
		var width = arraySum(obj.widths);
		var height = obj.height;
		var branches = obj.branches;

		ctx.lineWidth = obj.lineWidth;
		ctx.strokeStyle = obj.color;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';

		//first branches
		var startX = left;
		var finX = startX + widths[0];
		var startY = top + 0.5 * height;
		for (var i = 0; i < obj.branches[0]; i++) {
			if (obj.branches[0] == 2) {
				var finY = top + ((2 * i + 1) / 4) * height;
			} else if (obj.branches[0] == 3) {
				var finY = top + ((2 * i + 1) / 6) * height;
			}
			ctx.beginPath();
			ctx.moveTo(startX, startY);
			ctx.lineTo(finX, finY);
			ctx.stroke();

			// second branches
			var startX2 = left + widths[0] + widths[1];
			var finX2 = startX2 + widths[2];
			var startY2 = finY;
			var h = height / obj.branches[0];
			var t = top + h * i;
			for (var j = 0; j < obj.branches[1]; j++) {
				if (obj.branches[1] == 2) {
					var finY2 = t + ((2 * j + 1) / 4) * h;
				} else if (obj.branches[1] == 3) {
					var finY2 = t + ((2 * j + 1) / 6) * h;
				}
				ctx.beginPath();
				ctx.moveTo(startX2, startY2);
				ctx.lineTo(finX2, finY2);
				ctx.stroke();

				if (typeof obj.branches[2] !== 'number')
					continue;
				// third branches
				var startX3 = left + widths[0] + widths[1] + widths[2] + widths[3];
				var finX3 = startX3 + widths[4];
				var startY3 = finY2;
				var h2 = h / obj.branches[1];
				var t2 = t + h2 * j;
				for (var k = 0; k < obj.branches[2]; k++) {
					if (obj.branches[2] == 2) {
						var finY3 = t2 + ((2 * k + 1) / 4) * h2;
					} else if (obj.branches[2] == 3) {
						var finY3 = t2 + ((2 * k + 1) / 6) * h2;
					}
					ctx.beginPath();
					ctx.moveTo(startX3, startY3);
					ctx.lineTo(finX3, finY3);
					ctx.stroke();
				}
			}
		}
	},
	drawButton: function (ctx, size, type) {
		draw.probabilityTree.draw(ctx, {
			type: 'probabilityTree',
			left: 0.1 * size,
			top: size * 0.2,
			widths: [0.35 * size, 0.1 * size, 0.35 * size],
			height: size * 0.6,
			lineWidth: 1,
			color: '#000',
			branches: [2, 2],
		});
	},
	getRect: function (obj) {
		var width = obj.widths[0] + obj.widths[1] + obj.widths[2];
		if (typeof obj.branches[2] == 'number')
			width += obj.widths[3] + obj.widths[4];
		return [obj.left, obj.top, width, obj.height];
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.left += dl;
		obj.top += dt;
		obj.height += dh;
		var totalWidth = obj.widths[0] + obj.widths[1] + obj.widths[2];
		var max = 3;
		if (typeof obj.branches[2] == 'number') {
			totalWidth += obj.widths[3] + obj.widths[4];
			max = 5;
		}
		for (var w = 0; w < max; w++) {
			obj.widths[w] += dw * (obj.widths[w] / totalWidth);
		}
	},
	getButtons: function (x1, y1, x2, y2, pathNum) {
		var buttons = [];
		var obj = draw.path[pathNum].obj[0];

		var left = obj.left;
		buttons.push({
			buttonType: 'probabilityTree-branches',
			shape: 'rect',
			dims: [left + obj.widths[0] / 2 - 10, y2 - 20, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.probabilityTree.changeBranches,
			pathNum: pathNum,
			index: 0,
			obj: obj,
			value: obj.branches[0],
			draw: function (path, ctx, l, t, w, h) {
				ctx.fillStyle = colorA('#FF0', 0.5);
				ctx.fillRect(l, t, w, h);
				text({
					ctx: ctx,
					rect: [l, t, w, h],
					align: [0, 0],
					text: ['<<fontSize:12>>' + this.value]
				});
			}
		});

		left += obj.widths[0] + obj.widths[1];
		buttons.push({
			buttonType: 'probabilityTree-branches',
			shape: 'rect',
			dims: [left + obj.widths[2] / 2 - 10, y2 - 20, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.probabilityTree.changeBranches,
			pathNum: pathNum,
			index: 1,
			obj: obj,
			value: obj.branches[1],
			draw: function (path, ctx, l, t, w, h) {
				ctx.fillStyle = colorA('#FF0', 0.5);
				ctx.fillRect(l, t, w, h);
				text({
					ctx: ctx,
					rect: [l, t, w, h],
					align: [0, 0],
					text: ['<<fontSize:12>>' + this.value]
				});
			}
		});

		if (typeof obj.branches[2] == 'number') {
			left += obj.widths[2] + obj.widths[3];
			buttons.push({
				buttonType: 'probabilityTree-branches',
				shape: 'rect',
				dims: [left + obj.widths[4] / 2 - 10, y2 - 20, 20, 20],
				cursor: draw.cursors.pointer,
				func: draw.probabilityTree.changeBranches,
				pathNum: pathNum,
				index: 2,
				obj: obj,
				value: obj.branches[2],
				draw: function (path, ctx, l, t, w, h) {
					ctx.fillStyle = colorA('#FF0', 0.5);
					ctx.fillRect(l, t, w, h);
					text({
						ctx: ctx,
						rect: [l, t, w, h],
						align: [0, 0],
						text: ['<<fontSize:12>>' + this.value]
					});
				}
			});
			buttons.push({
				buttonType: 'probabilityTree-removeBranch',
				shape: 'rect',
				dims: [x2 - 20, (y1 + y2) / 2 - 10, 20, 20],
				cursor: draw.cursors.pointer,
				func: draw.probabilityTree.removeBranch,
				pathNum: pathNum,
				obj: obj,
				draw: function (path, ctx, l, t, w, h) {
					ctx.fillStyle = colorA('#F99', 0.5);
					ctx.fillRect(l, t, w, h);
					text({
						ctx: ctx,
						rect: [l, t, w, h],
						align: [0, 0],
						text: ['<<fontSize:12>>-']
					});
				}
			});
		} else {
			buttons.push({
				buttonType: 'probabilityTree-addBranch',
				shape: 'rect',
				dims: [x2 - 20, (y1 + y2) / 2 - 10, 20, 20],
				cursor: draw.cursors.pointer,
				func: draw.probabilityTree.addBranch,
				pathNum: pathNum,
				obj: obj,
				draw: function (path, ctx, l, t, w, h) {
					ctx.fillStyle = colorA('#9F9', 0.5);
					ctx.fillRect(l, t, w, h);
					text({
						ctx: ctx,
						rect: [l, t, w, h],
						align: [0, 0],
						text: ['<<fontSize:12>>+']
					});
				}
			});
		}

		return buttons;
	},
	changeBranches: function () {
		var pathNum = draw.currCursor.pathNum;
		var obj = draw.currCursor.obj;
		var index = draw.currCursor.index;
		obj.branches[index] = obj.branches[index] == 2 ? 3 : 2;
		drawCanvasPaths();
		updateBorder(draw.path[pathNum]);
		calcCursorPositions();
		drawSelectCanvas();
	},
	addBranch: function () {
		var pathNum = draw.currCursor.pathNum;
		var obj = draw.currCursor.obj;
		obj.branches[2] = 2;
		drawCanvasPaths();
		updateBorder(draw.path[pathNum]);
		calcCursorPositions();
		drawSelectCanvas();
	},
	removeBranch: function () {
		var pathNum = draw.currCursor.pathNum;
		var obj = draw.currCursor.obj;
		delete obj.branches[2];
		drawCanvasPaths();
		updateBorder(draw.path[pathNum]);
		calcCursorPositions();
		drawSelectCanvas();
	},
	getCursorPositionsSelected: function (obj, pathNum) {
		var pos = [];
		var x = obj.left;
		var max = typeof obj.branches[2] == 'number' ? 5 : 3;
		for (var i = 0; i < max; i++) {
			x += obj.widths[i];
			pos.push({
				shape: 'rect',
				dims: [x - 10, obj.top, 20, obj.height],
				cursor: draw.cursors.ew,
				func: draw.probabilityTree.horizResizeStart,
				index: i,
				pathNum: pathNum
			});
		}
		return pos;
	},
	horizResizeStart: function () {
		changeDrawMode('probabilityTreeHorizResize');
		draw.currPathNum = draw.currCursor.pathNum;
		draw.currIndex = draw.currCursor.index;
		updateSnapPoints(); // update intersection points
		draw.animate(draw.probabilityTree.horizResizeMove,draw.probabilityTree.horizResizeStop,drawCanvasPaths);				
		//addListenerMove(window, draw.probabilityTree.horizResizeMove);
		//addListenerEnd(window, draw.probabilityTree.horizResizeStop);
		draw.cursorCanvas.style.cursor = draw.cursors.ew;
	},
	horizResizeMove: function (e) {
		updateMouse(e);
		var pos = draw.mouse[0];
		var pathNum = draw.currPathNum;
		var index = draw.currIndex;
		var obj = draw.path[pathNum].obj[0];
		var left = obj.left;
		for (var i = 0; i < index; i++)
			left += obj.widths[i];
		obj.widths[index] = pos - left;
		//drawSelectedPaths();
	},
	horizResizeStop: function (e) {
		//removeListenerMove(window, draw.probabilityTree.horizResizeMove);
		//removeListenerEnd(window, draw.probabilityTree.horizResizeStop);
		changeDrawMode();
	},
	setLineWidth: function (obj, lineWidth) {
		obj.lineWidth = lineWidth;
	},
	setLineColor: function (obj, color) {
		obj.color = color;
	},
	setFillColor: function (obj, color) {
		obj.fillColor = color;
	},
	getLineWidth: function (obj) {
		return obj.lineWidth;
	},
	getLineColor: function (obj) {
		return obj.color;
	},
	getFillColor: function (obj) {
		return obj.fillColor;
	},
	scale: function (obj, sf, center) {
		if (!un(center)) {
			obj.left = center[0] + sf * (obj.left - center[0]);
			obj.top = center[1] + sf * (obj.top - center[1]);
		}
		for (var w = 0; w < obj.widths.length; w++)
			obj.widths[w] *= sf;
		obj.height *= sf;
		if (!un(obj.lineWidth))
			obj.lineWidth *= sf;
	}
};
draw.vennDiagram3 = {
	resizable: true,
	add: function () {
		deselectAllPaths();
		var obj = {
			type: 'vennDiagram3',
			left: 50 - draw.drawRelPos[0],
			top: 50 - draw.drawRelPos[1],
			width: 600,
			lineWidth: 4,
			color: '#000',
			fillColor: '#3FF',
			shade: [false, false, false, false, false, false, false, false]
		};
		draw.path.push({
			obj: [obj],
			selected: true
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
		console.log(sel());
	},
	draw: function (ctx, obj, path) {
		var l = obj.left;
		var t = obj.top;
		var w = obj.width;
		var h = obj.width;
		var radius = w * 0.27;
		var centerA = obj.centerA || [l + w * 0.5 + 0.6 * radius * Math.cos(Math.PI * (1 / 2 + 2 / 3)), t + h * 0.47 + 0.6 * radius * Math.sin(Math.PI * (1 / 2 + 2 / 3))];
		var centerB = obj.centerB || [l + w * 0.5 + 0.6 * radius * Math.cos(Math.PI * (1 / 2 + 4 / 3)), t + h * 0.47 + 0.6 * radius * Math.sin(Math.PI * (1 / 2 + 4 / 3))];
		var centerC = obj.centerC || [l + w * 0.5 + 0.6 * radius * Math.cos(Math.PI * (1 / 2)), t + h * 0.47 + 0.6 * radius * Math.sin(Math.PI * (1 / 2))];
		obj._radius = radius;
		obj._centerA = centerA;
		obj._centerB = centerB;
		obj._centerC = centerC;

		var lineWidth = obj.lineWidth;
		var strokeStyle = obj.color;
		var colorA = obj.colorA || strokeStyle;
		var colorB = obj.colorB || strokeStyle;
		var colorC = obj.colorC || strokeStyle;
		var labelA = obj.labelA || ['<<fontSize:' + (w / 10) + '>>A'];
		var labelB = obj.labelB || ['<<fontSize:' + (w / 10) + '>>B'];
		var labelC = obj.labelC || ['<<fontSize:' + (w / 10) + '>>C'];

		var x1 = centerA[0];
		var y1 = centerA[1];
		var x2 = centerB[0];
		var y2 = centerB[1];
		var x3 = centerC[0];
		var y3 = centerC[1];
		var r = radius;
		ctx.fillStyle = obj.fillColor;
		if (obj.shade[7] == true) {
			ctx.fillRect(l, t, w, h);
			ctx.fillStyle = mainCanvasFillStyle;
			ctx.beginPath();
			ctx.arc(x1, y1, r, 0, 2 * Math.PI);
			ctx.fill();
			ctx.beginPath();
			ctx.arc(x2, y2, r, 0, 2 * Math.PI);
			ctx.fill();
			ctx.beginPath();
			ctx.arc(x3, y3, r, 0, 2 * Math.PI);
			ctx.fill();
			ctx.fillStyle = obj.fillColor;
		}
		var angle = Math.acos((x2 - x1) / (2 * r));

		var abint = circleIntersections(x1, y1, r, x2, y2, r);
		var acint = circleIntersections(x1, y1, r, x3, y3, r);
		var bcint = circleIntersections(x2, y2, r, x3, y3, r);

		var aa = [getAngleFromAToB([x1, y1], abint[1]), getAngleFromAToB([x1, y1], acint[1]), getAngleFromAToB([x1, y1], abint[0]), getAngleFromAToB([x1, y1], acint[0])];
		var bb = [getAngleFromAToB([x2, y2], bcint[1]), getAngleFromAToB([x2, y2], abint[0]), getAngleFromAToB([x2, y2], bcint[0]), getAngleFromAToB([x2, y2], abint[1])];
		var cc = [getAngleFromAToB([x3, y3], acint[0]), getAngleFromAToB([x3, y3], bcint[0]), getAngleFromAToB([x3, y3], acint[1]), getAngleFromAToB([x3, y3], bcint[1])];

		if (obj.shade[0] == true) {
			ctx.beginPath();
			ctx.arc(x3, y3, r, cc[1], cc[2]);
			ctx.arc(x1, y1, r, aa[1], aa[2]);
			ctx.arc(x2, y2, r, bb[1], bb[2]);
			ctx.fill();
		}
		if (obj.shade[1] == true) {
			ctx.beginPath();
			ctx.arc(x1, y1, r, aa[0], aa[1]);
			ctx.arc(x3, y3, r, cc[2], cc[1], true);
			ctx.arc(x2, y2, r, bb[2], bb[3]);
			ctx.fill();
		}
		if (obj.shade[2] == true) {
			ctx.beginPath();
			ctx.arc(x1, y1, r, aa[2], aa[3]);
			ctx.arc(x3, y3, r, cc[0], cc[1]);
			ctx.arc(x2, y2, r, bb[2], bb[1], true);
			ctx.fill();
		}
		if (obj.shade[3] == true) {
			ctx.beginPath();
			ctx.arc(x1, y1, r, aa[3], aa[0]);
			ctx.arc(x2, y2, r, bb[3], bb[2], true);
			ctx.arc(x3, y3, r, cc[1], cc[0], true);
			ctx.fill();
		}
		if (obj.shade[4] == true) {
			ctx.beginPath();
			ctx.arc(x1, y1, r, aa[2], aa[1], true);
			ctx.arc(x3, y3, r, cc[2], cc[3]);
			ctx.arc(x2, y2, r, bb[0], bb[1]);
			ctx.fill();
		}
		if (obj.shade[5] == true) {
			ctx.beginPath();
			ctx.arc(x2, y2, r, bb[3], bb[0]);
			ctx.arc(x3, y3, r, cc[3], cc[2], true);
			ctx.arc(x1, y1, r, aa[1], aa[0], true);
			ctx.fill();
		}
		if (obj.shade[6] == true) {
			ctx.beginPath();
			ctx.arc(x3, y3, r, cc[3], cc[0]);
			ctx.arc(x1, y1, r, aa[3], aa[2], true);
			ctx.arc(x2, y2, r, bb[1], bb[0], true);
			ctx.fill();
		}

		if (typeof ctx.setLineDash == 'undefined')
			ctx.setLineDash = function () {};
		ctx.setLineDash([]);
		ctx.strokeStyle = strokeStyle;
		ctx.lineWidth = lineWidth;
		ctx.strokeRect(l, t, w, h);

		ctx.beginPath();
		ctx.strokeStyle = colorA;
		ctx.arc(centerA[0], centerA[1], radius, 0, 2 * Math.PI);
		ctx.stroke();

		ctx.beginPath();
		ctx.strokeStyle = colorB;
		ctx.arc(centerB[0], centerB[1], radius, 0, 2 * Math.PI);
		ctx.stroke();

		ctx.beginPath();
		ctx.strokeStyle = colorC;
		ctx.arc(centerC[0], centerC[1], radius, 0, 2 * Math.PI);
		ctx.stroke();

		/*var xy = [centerA[0]-(radius*1.25)*Math.cos(Math.PI/4),centerA[1]-(radius*1.25)*Math.cos(Math.PI/4)];
		text({ctx:ctx,textArray:labelA,left:xy[0]-100,width:200,top:xy[1]-100,height:200,textAlign:'center',vertAlign:'middle',padding:0.1,});

		var xy = [centerB[0]+(radius*1.25)*Math.cos(Math.PI/4),centerB[1]-(radius*1.25)*Math.cos(Math.PI/4)];
		text({ctx:ctx,textArray:labelB,left:xy[0]-100,width:200,top:xy[1]-100,height:200,textAlign:'center',vertAlign:'middle',padding:0.1,});

		var xy = [centerC[0]+(radius*1.25)*Math.cos(Math.PI/4),centerC[1]+(radius*1.25)*Math.cos(Math.PI/4)];
		text({ctx:ctx,textArray:labelC,left:xy[0]-100,width:200,top:xy[1]-100,height:200,textAlign:'center',vertAlign:'middle',padding:0.1,});
		 */

		ctx.restore();
	},
	drawButton: function (ctx, size, type) {
		draw.vennDiagram3.draw(ctx, {
			type: 'vennDiagram3',
			left: 0.1 * size,
			top: size * 0.1,
			width: 0.8 * size,
			lineWidth: 1,
			color: '#000',
			fillColor: '#3FF',
			shade: [false, false, true, false, false, true, false, false]
		});
	},
	getRect: function (obj) {
		return [obj.left, obj.top, obj.width, obj.width];
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.left += dl;
		obj.top += dt;
		obj.width += dw;
	},
	setLineWidth: function (obj, lineWidth) {
		obj.lineWidth = lineWidth;
	},
	setLineColor: function (obj, color) {
		obj.color = color;
	},
	setFillColor: function (obj, color) {
		obj.fillColor = color;
	},
	getLineWidth: function (obj) {
		return obj.lineWidth;
	},
	getLineColor: function (obj) {
		return obj.color;
	},
	getFillColor: function (obj) {
		return obj.fillColor;
	},
	getCursorPositionsSelected: function (obj, pathNum) {
		return [{
				shape: 'rect',
				dims: draw.vennDiagram3.getRect(obj),
				cursor: draw.cursors.pointer,
				func: draw.vennDiagram3.clickToggleShade,
				obj: obj
			}
		];
	},
	getCursorPositionsInteract: function (obj) {
		var pos = [];
		if (!un(obj.interact) && obj.interact.type === 'venn') {
			pos.push({
				shape: 'rect',
				dims: draw.vennDiagram3.getRect(obj),
				cursor: draw.cursors.pointer,
				func: draw.vennDiagram3.clickToggleShade,
				obj: obj
			});
		}
		return pos;
	},
	clickToggleShade: function (e) {
		var obj = draw.currCursor.obj;
		var pos = [mouse.x - draw.drawRelPos[0], mouse.y - draw.drawRelPos[1]];
		var inA = dist(pos[0], pos[1], obj._centerA[0], obj._centerA[1]) < obj._radius ? true : false;
		var inB = dist(pos[0], pos[1], obj._centerB[0], obj._centerB[1]) < obj._radius ? true : false;
		var inC = dist(pos[0], pos[1], obj._centerC[0], obj._centerC[1]) < obj._radius ? true : false;
		if (inA && inB && inC) {
			obj.shade[0] = !obj.shade[0];
		} else if (inA && inB && !inC) {
			obj.shade[1] = !obj.shade[1];
		} else if (inA && !inB && inC) {
			obj.shade[2] = !obj.shade[2];
		} else if (inA && !inB && !inC) {
			obj.shade[3] = !obj.shade[3];
		} else if (!inA && inB && inC) {
			obj.shade[4] = !obj.shade[4];
		} else if (!inA && inB && !inC) {
			obj.shade[5] = !obj.shade[5];
		} else if (!inA && !inB && inC) {
			obj.shade[6] = !obj.shade[6];
		} else if (!inA && !inB && !inC) {
			obj.shade[7] = !obj.shade[7];
		}
		drawCanvasPaths();
	},
	scale: function (obj, sf, center) {
		if (!un(center)) {
			obj.left = center[0] + sf * (obj.left - center[0]);
			obj.top = center[1] + sf * (obj.top - center[1]);
		}
		obj.width *= sf;
		if (!un(obj.lineWidth))
			obj.lineWidth *= sf;
	}
};
draw.vennDiagram2 = {
	resizable: true,
	add: function () {
		deselectAllPaths();
		var obj = {
			type: 'vennDiagram2',
			left: 50 - draw.drawRelPos[0],
			top: 50 - draw.drawRelPos[1],
			width: 600,
			lineWidth: 4,
			color: '#000',
			fillColor: '#3FF',
			shade: [false, false, false, false]
		};
		draw.path.push({
			obj: [obj],
			selected: true
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
		console.log(sel());
	},
	draw: function (ctx, obj, path) {
		var l = obj.left;
		var t = obj.top;
		var w = obj.width;
		var h = w * 0.65;
		var radius = w * 0.24;
		var centerA = obj.centerA || [l + w * 0.35, t + h / 2];
		var centerB = obj.centerB || [l + w * 0.65, t + h / 2];
		var lineWidth = obj.lineWidth;
		var strokeStyle = obj.color;
		var colorA = obj.colorA || strokeStyle;
		var colorB = obj.colorB || strokeStyle;
		var labelA = obj.labelA || ['<<fontSize:' + (w / 12) + '>>A'];
		var labelB = obj.labelB || ['<<fontSize:' + (w / 12) + '>>B'];
		var fillStyle = obj.fillColor;
		obj._radius = radius;
		obj._centerA = centerA;
		obj._centerB = centerB;

		var x1 = centerA[0];
		var y1 = centerA[1];
		var x2 = centerB[0];
		var y2 = centerB[1];
		var r = radius;
		ctx.fillStyle = obj.fillColor;
		if (obj.shade[3] == true) {
			ctx.fillRect(l, t, w, h);
			ctx.fillStyle = mainCanvasFillStyle;
			ctx.beginPath();
			ctx.arc(x1, y1, r, 0, 2 * Math.PI);
			ctx.fill();
			ctx.beginPath();
			ctx.arc(x2, y2, r, 0, 2 * Math.PI);
			ctx.fill();
			ctx.fillStyle = obj.fillColor;
		}
		var angle = Math.acos((x2 - x1) / (2 * r));

		if (obj.shade[0] == true) {
			ctx.beginPath();
			ctx.arc(x1, y1, r, -angle, angle);
			ctx.arc(x2, y2, r, Math.PI - angle, Math.PI + angle);
			ctx.fill();
		}
		if (obj.shade[1] == true) {
			ctx.beginPath();
			ctx.arc(x1, y1, r, angle, 2 * Math.PI - angle);
			ctx.arc(x2, y2, r, Math.PI + angle, Math.PI - angle, true);
			ctx.fill();
		}
		if (obj.shade[2] == true) {
			ctx.beginPath();
			ctx.arc(x1, y1, r, angle, -angle, true);
			ctx.arc(x2, y2, r, Math.PI + angle, Math.PI - angle);
			ctx.fill();
		}

		if (typeof ctx.setLineDash == 'undefined')
			ctx.setLineDash = function () {};
		ctx.setLineDash([]);
		ctx.strokeStyle = strokeStyle;
		ctx.lineWidth = lineWidth;
		ctx.strokeRect(l, t, w, h);

		ctx.beginPath();
		ctx.strokeStyle = colorA;
		ctx.arc(centerA[0], centerA[1], radius, 0, 2 * Math.PI);
		ctx.stroke();

		ctx.beginPath();
		ctx.strokeStyle = colorB;
		ctx.arc(centerB[0], centerB[1], radius, 0, 2 * Math.PI);
		ctx.stroke();

		/*
		var xy = [centerA[0]-(radius*1.25)*Math.cos(Math.PI/4),centerA[1]-(radius*1.25)*Math.cos(Math.PI/4)];
		text({ctx:ctx,textArray:labelA,left:xy[0]-100,width:200,top:xy[1]-100,height:200,textAlign:'center',vertAlign:'middle',padding:0.1});

		var xy = [centerB[0]+(radius*1.25)*Math.cos(Math.PI/4),centerB[1]-(radius*1.25)*Math.cos(Math.PI/4)];
		text({ctx:ctx,textArray:labelB,left:xy[0]-100,width:200,top:xy[1]-100,height:200,textAlign:'center',vertAlign:'middle',padding:0.1});
		 */
	},
	drawButton: function (ctx, size, type) {
		draw.vennDiagram2.draw(ctx, {
			type: 'vennDiagram2',
			left: 0.1 * size,
			top: size * 0.2,
			width: 0.8 * size,
			lineWidth: 1,
			color: '#000',
			fillColor: '#3FF',
			shade: [true, false, true, false]
		});
	},
	getRect: function (obj) {
		return [obj.left, obj.top, obj.width, obj.width * 0.65];
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.left += dl;
		obj.top += dt;
		obj.width += dw;
	},
	setLineWidth: function (obj, lineWidth) {
		obj.lineWidth = lineWidth;
	},
	setLineColor: function (obj, color) {
		obj.color = color;
	},
	setFillColor: function (obj, color) {
		obj.fillColor = color;
	},
	getLineWidth: function (obj) {
		return obj.lineWidth;
	},
	getLineColor: function (obj) {
		return obj.color;
	},
	getFillColor: function (obj) {
		return obj.fillColor;
	},
	getCursorPositionsSelected: function (obj, pathNum) {
		return [{
				shape: 'rect',
				dims: draw.vennDiagram2.getRect(obj),
				cursor: draw.cursors.pointer,
				func: draw.vennDiagram2.clickToggleShade,
				obj: obj
			}
		];
	},
	getCursorPositionsInteract: function (obj) {
		var pos = [];
		if (!un(obj.interact) && obj.interact.type === 'venn') {
			pos.push({
				shape: 'rect',
				dims: draw.vennDiagram2.getRect(obj),
				cursor: draw.cursors.pointer,
				func: draw.vennDiagram2.clickToggleShade,
				obj: obj
			});
		}
		return pos;
	},
	clickToggleShade: function (e) {
		var obj = draw.currCursor.obj;
		var pos = [mouse.x - draw.drawRelPos[0], mouse.y - draw.drawRelPos[1]];
		var inA = dist(pos[0], pos[1], obj._centerA[0], obj._centerA[1]) < obj._radius ? true : false;
		var inB = dist(pos[0], pos[1], obj._centerB[0], obj._centerB[1]) < obj._radius ? true : false;
		if (inA && inB) {
			obj.shade[0] = !obj.shade[0];
		} else if (inA && !inB) {
			obj.shade[1] = !obj.shade[1];
		} else if (!inA && inB) {
			obj.shade[2] = !obj.shade[2];
		} else if (!inA && !inB) {
			obj.shade[3] = !obj.shade[3];
		}
		drawCanvasPaths();
	},
	scale: function (obj, sf, center) {
		if (!un(center)) {
			obj.left = center[0] + sf * (obj.left - center[0]);
			obj.top = center[1] + sf * (obj.top - center[1]);
		}
		obj.width *= sf;
		if (!un(obj.lineWidth))
			obj.lineWidth *= sf;
	}
};

draw.star = {
	resizable: true,
	add: function () {
		deselectAllPaths();
		var obj = {
			type: 'star',
			center: [150 - draw.drawRelPos[0], 150 - draw.drawRelPos[1]],
			radius: 100,
			points: 5,
			step: 2,
			lineWidth: 2,
			color: '#000',
			fillColor: 'none',
		};
		draw.path.push({
			obj: [obj],
			selected: true
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
	},
	draw: function (ctx, obj, path) {
		var c = obj.center;
		var r = obj.radius;
		var p = obj.points;
		var s = obj.step;
		var vertices = [];
		for (var i = 0; i < p; i++) {
			var angle = -Math.PI / 2 + i * (2 * Math.PI) / p;
			vertices.push([c[0] + r * Math.cos(angle), c[1] + r * Math.sin(angle)]);
		}
		ctx.moveTo(vertices[0][0], vertices[0][1]);
		for (var i = p; i >= 0; i--) {
			ctx.lineTo(vertices[(i * s) % p][0], vertices[(i * s) % p][1]);
		}
		if (obj.fillColor !== 'none') {
			ctx.fillStyle = obj.fillColor;
			ctx.fill();
		}
		if (obj.color !== 'none') {
			ctx.lineWidth = obj.lineWidth;
			ctx.strokeStyle = obj.color;
			ctx.stroke();
		}
	},
	drawButton: function (ctx, size, type) {
		draw.star.draw(ctx, {
			type: 'star',
			center: [0.5 * size, 0.5 * size],
			radius: 0.3 * size,
			points: 5,
			step: 2,
			lineWidth: 1,
			color: '#000',
			fillColor: 'none'
		});
	},
	getRect: function (obj) {
		return [obj.center[0] - obj.radius, obj.center[1] - obj.radius, 2 * obj.radius, 2 * obj.radius];
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.center[0] += dl;
		obj.center[1] += dt;
		if (dw !== 0 || dh !== 0) {
			var x = mouse.x - draw.drawRelPos[0];
			var y = mouse.y - draw.drawRelPos[1];
			obj.radius = Math.abs(Math.min(x - obj.center[0], y - obj.center[1]));
		}
	},
	setLineWidth: function (obj, lineWidth) {
		obj.lineWidth = lineWidth;
	},
	setLineColor: function (obj, color) {
		obj.color = color;
	},
	setFillColor: function (obj, color) {
		obj.fillColor = color;
	},
	getLineWidth: function (obj) {
		return obj.lineWidth;
	},
	getLineColor: function (obj) {
		return obj.color;
	},
	getFillColor: function (obj) {
		return obj.fillColor;
	},
	scale: function (obj, sf, center) {
		if (un(center))
			var center = obj.center;
		obj.center[0] = center[0] + sf * (obj.center[0] - center[0]);
		obj.center[1] = center[1] + sf * (obj.center[1] - center[1]);
		if (!un(obj.radius))
			obj.radius *= sf;
		if (!un(obj.lineWidth))
			obj.lineWidth *= sf;
	},
	getControlPanel: function (obj) {
		var elements = [{
				name: 'Style',
				type: 'style'
			}, {
				name: 'Points',
				type: 'increment',
				increment: function (obj, value) {
					obj.points = Math.max(3, Math.min(obj.points + value, 20));
				}
			}, {
				name: 'Step',
				type: 'increment',
				increment: function (obj, value) {
					obj.step = Math.max(2, Math.min(obj.step + value, obj.points));
				}
			}
		];
		return {
			obj: obj,
			elements: elements
		};
	}
};
draw.pieChart = {
	resizable: true,
	add: function (x, y, r1, a1, a2, a3) {
		deselectAllPaths(false);
		draw.path.push({
			obj: [{
					type: 'pieChart',
					center: [150 - draw.drawRelPos[0], 150 - draw.drawRelPos[1]],
					radius: 100,
					angles: [0, (1 / 3) * Math.PI, (1 / 1) * Math.PI, (3 / 2) * Math.PI],
					fill: draw.pieChart.colorSchemes[0].slice(0, 4),
					color: draw.color,
					thickness: draw.thickness,
				}
			],
			selected: true,
			trigger: []
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
		changeDrawMode();
	},
	draw: function (ctx, obj, path) {
		ctx.strokeStyle = obj.color;
		ctx.lineWidth = obj.thickness;

		obj._pos = [];
		for (var a = 0; a < obj.angles.length; a++) {
			var angle = obj.angles[a];
			obj._pos[a] = [obj.center[0] + obj.radius * Math.cos(angle), obj.center[1] + obj.radius * Math.sin(angle)];
		}
		for (var a = 0; a < obj.angles.length; a++) {
			var pos = obj._pos[a];
			var angle = obj.angles[a];
			var next = obj.angles[(a + 1) % obj.angles.length];
			ctx.beginPath();
			ctx.moveTo(obj.center[0], obj.center[1]);
			ctx.lineTo(pos[0], pos[1]);
			ctx.arc(obj.center[0], obj.center[1], obj.radius, angle, next);
			ctx.lineTo(obj.center[0], obj.center[1]);
			ctx.fillStyle = obj.fill[a];
			ctx.fill();
		}
		for (var a = 0; a < obj.angles.length; a++) {
			var pos = obj._pos[a];
			ctx.beginPath();
			ctx.moveTo(obj.center[0], obj.center[1]);
			ctx.lineTo(pos[0], pos[1]);
			ctx.stroke();
		}
		ctx.beginPath();
		ctx.arc(obj.center[0], obj.center[1], obj.radius, 0, 2 * Math.PI);
		ctx.stroke();

		obj._angleLabelPos = [];
		if (!un(obj.showAngles)) {
			for (var a = 0; a < obj.showAngles.length; a++) {
				if (un(obj.showAngles[a]))
					continue;
				var angleObj = clone(obj.showAngles[a]);
				angleObj.ctx = ctx;
				angleObj.drawLines = boolean(angleObj.drawLines, false);
				angleObj.radius = angleObj.radius || 30;
				angleObj.lineColor = angleObj.lineColor || '#000';
				angleObj.labelMeasure = boolean(angleObj.labelMeasure, true);
				angleObj.labelFontSize = angleObj.labelFontSize || 25;
				angleObj.labelRadius = angleObj.labelRadius || 33;
				angleObj.labelColor = angleObj.labelColor || angleObj.lineColor;
				angleObj.lineWidth = angleObj.lineWidth || 2;
				var pos = obj._pos[a];
				var angle = obj.angles[a];
				var next = obj._pos[(a + 1) % obj._pos.length];
				angleObj.b = obj.center;
				angleObj.a = pos;
				angleObj.c = next;
				obj._angleLabelPos[a] = drawAngle(angleObj);
			}
		}

		if (!un(path) && path.obj.length == 1 && path.selected == true) {
			ctx.lineWidth = 1;
			ctx.strokeStyle = '#000';
			ctx.fillStyle = '#F00';
			var angleObj = {
				ctx: ctx,
				drawLines: false,
				radius: 30,
				lineColor: colorA(obj.color, 0.3),
				labelMeasure: true,
				labelFontSize: 25,
				labelRadius: 33,
				labelColor: colorA(obj.color, 0.3),
				lineWidth: 2
			};
			for (var a = 0; a < obj.angles.length; a++) {
				var pos = obj._pos[a];
				if (un(obj.showAngles) || un(obj.showAngles[a])) {
					var angle = obj.angles[a];
					var next = obj._pos[(a + 1) % obj._pos.length];
					angleObj.b = obj.center;
					angleObj.a = pos;
					angleObj.c = next;
					obj._angleLabelPos[a] = drawAngle(angleObj);
				}
				ctx.beginPath();
				ctx.arc(pos[0], pos[1], 7, 0, 2 * Math.PI);
				ctx.fill();
				ctx.stroke();
			}
		}
	},
	drawButton: function (ctx, size, type) {
		draw.pieChart.draw(ctx, {
			type: 'pieChart',
			center: [0.5 * size, 0.5 * size],
			radius: 0.3 * size,
			angles: [0, (1 / 3) * Math.PI, (1 / 1) * Math.PI, (3 / 2) * Math.PI],
			fill: ['#F66', '#66F', '#6F6', '#F90'],
			color: '#000',
			thickness: 1,
		});
	},
	getRect: function (obj) {
		return [obj.center[0] - obj.radius, obj.center[1] - obj.radius, 2 * obj.radius, 2 * obj.radius];
	},
	getButtons: function (x1, y1, x2, y2, pathNum) {
		var buttons = [];
		buttons.push({
			buttonType: 'anglesAroundPoint-pointsMinus',
			shape: 'rect',
			dims: [x2 - 20, y2 - 40, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.pieChart.pointsMinus,
			pathNum: pathNum
		});
		buttons.push({
			buttonType: 'anglesAroundPoint-pointsPlus',
			shape: 'rect',
			dims: [x2 - 20, y2 - 60, 20, 20],
			cursor: draw.cursors.pointer,
			func: draw.pieChart.pointsPlus,
			pathNum: pathNum
		});
		if (!un(draw.path[pathNum]) && !un(draw.path[pathNum].obj)) {
			buttons.push({
				buttonType: 'pieChart-colorSchemeToggle',
				shape: 'rect',
				dims: [x2 - 20, y2 - 80, 20, 20],
				cursor: draw.cursors.pointer,
				func: draw.pieChart.toggleColorScheme,
				pathNum: pathNum,
				obj: draw.path[pathNum].obj[0],
				draw: function (path, ctx, l, t, w, h) {
					ctx.fillStyle = colorA('#00F', 0.5);
					ctx.fillRect(l, t, w / 2, h / 2);
					ctx.fillStyle = colorA('#F66', 0.5);
					ctx.fillRect(l + w / 2, t, w / 2, h / 2);
					ctx.fillStyle = colorA('#CFC', 0.5);
					ctx.fillRect(l, t + h / 2, w / 2, h / 2);
					ctx.fillStyle = colorA('#999', 0.5);
					ctx.fillRect(l + w / 2, t + h / 2, w / 2, h / 2);
				}
			});
		}
		return buttons;
	},
	getCursorPositionsSelected: function (obj, pathNum) {
		var pos = [];
		for (var a = 0; a < obj.angles.length; a++) {
			var a1 = obj.angles[a];
			var a2 = obj.angles[(a + 1) % obj.angles.length];

			pos.push({
				shape: 'sector',
				dims: [obj.center[0], obj.center[1], obj.radius, a1, a2],
				cursor: draw.cursors.pointer,
				func: draw.pieChart.incColor,
				pathNum: pathNum,
				obj: obj,
				index: a
			});

			pos.push({
				shape: 'sector',
				dims: [obj.center[0], obj.center[1], 25, a1, a2],
				cursor: draw.cursors.pointer,
				func: draw.pieChart.toggleShowAngle,
				pathNum: pathNum,
				obj: obj,
				index: a
			});

			if (!un(obj._angleLabelPos) && !un(obj._angleLabelPos[a])) {
				pos.push({
					shape: 'rect',
					dims: obj._angleLabelPos[a],
					cursor: draw.cursors.pointer,
					func: draw.pieChart.toggleShowAngleLabel,
					pathNum: pathNum,
					obj: obj,
					index: a
				});
			}
		}
		for (var a = 0; a < obj.angles.length; a++) {
			var pos2 = obj._pos[a];
			pos.push({
				shape: 'circle',
				dims: [pos2[0], pos2[1], 8],
				cursor: draw.cursors.pointer,
				func: draw.pieChart.startPointDrag,
				pathNum: pathNum,
				index: a
			});
		}
		return pos;
	},
	getSnapPos: function (obj) {
		var pos = [{
				type: 'point',
				pos: obj.center
			}
		];
		for (var a = 0; a < obj.angles.length; a++) {
			var angle = obj.angles[a];
			pos.push({
				type: 'point',
				pos: [obj.center[0] + obj.radius * Math.cos(angle), obj.center[1] + obj.radius * Math.sin(angle)]
			});
		}
		return pos;
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.center[0] += dl;
		obj.center[1] += dt;
		if (dw !== 0 || dh !== 0) {
			var x = mouse.x - draw.drawRelPos[0];
			var y = mouse.y - draw.drawRelPos[1];
			obj.radius = Math.abs(Math.min(x - obj.center[0], y - obj.center[1]));
		}
	},
	setLineWidth: function (obj, lineWidth) {
		obj.thickness = lineWidth;
	},
	setLineColor: function (obj, color) {
		obj.color = color;
	},
	getLineWidth: function (obj) {
		return obj.thickness;
	},
	getLineColor: function (obj) {
		return obj.color;
	},

	pointsMinus: function (path) {
		if (un(path))
			path = draw.path[draw.currCursor.pathNum];
		var obj = path.obj[0];
		if (obj.angles.length > 2) {
			obj.angles.pop();
			updateBorder(path);
			drawCanvasPaths();
			drawSelectCanvas();
		}
	},
	pointsPlus: function (path) {
		if (un(path))
			path = draw.path[draw.currCursor.pathNum];
		var obj = path.obj[0];
		var angle = (obj.angles.last() + 2 * Math.PI) / 2;
		obj.angles.push(angle);
		obj.fill.push('#F66');
		updateBorder(path);
		drawCanvasPaths();
		drawSelectCanvas();
	},
	colorSchemes: [
		['#FF0', '#F0F', '#0FF', '#F90', '#F09', '#0F9'],
		['#66F', '#F66', '#6F6', '#FF6', '#F6F', '#6FF'],
		['#CCF', '#FCC', '#CFC', '#FFC', '#FCF', '#CFF'],
		['#AAA', '#666', '#EEE', '#888', '#CCC', '#444']
	],
	toggleColorScheme: function () {
		var obj = draw.currCursor.obj;
		if (un(obj.scheme))
			obj.scheme = 0;
		var oldsch = draw.pieChart.colorSchemes[obj.scheme];
		obj.scheme = (obj.scheme + 1) % draw.pieChart.colorSchemes.length;
		var newsch = draw.pieChart.colorSchemes[obj.scheme];
		for (var f = 0; f < obj.fill.length; f++) {
			var index = oldsch.indexOf(obj.fill[f]);
			if (index == -1)
				index = 0;
			obj.fill[f] = newsch[index];
		}
		drawCanvasPaths();
	},
	incColor: function () {
		var obj = draw.currCursor.obj;
		if (un(obj.scheme))
			obj.scheme = 0;
		var colors = draw.pieChart.colorSchemes[obj.scheme];
		var fill = obj.fill;
		var index = draw.currCursor.index;
		var colorIndex = colors.indexOf(fill[index]);
		fill[index] = colors[(colorIndex + 1) % colors.length];
		drawCanvasPaths();
	},
	toggleShowAngle: function () {
		var obj = draw.currCursor.obj;
		var index = draw.currCursor.index;
		if (un(obj.showAngles))
			obj.showAngles = [];
		if (un(obj.showAngles[index])) {
			obj.showAngles[index] = {};
		} else {
			delete obj.showAngles[index];
		}
		drawCanvasPaths();
	},
	toggleShowAngleLabel: function () {
		var obj = draw.currCursor.obj;
		var index = draw.currCursor.index;
		if (un(obj.showAngles))
			obj.showAngles = [];
		if (un(obj.showAngles[index])) {
			obj.showAngles[index] = {};
		} else {
			obj.showAngles[index].labelMeasure = un(obj.showAngles[index].labelMeasure) ? false : !obj.showAngles[index].labelMeasure;
		}
		drawCanvasPaths();
	},
	startPointDrag: function () {
		changeDrawMode('pieChartPointDrag');
		draw.currPathNum = draw.currCursor.pathNum;
		draw.currIndex = draw.currCursor.index;
		draw.animate(draw.pieChart.pointMove,draw.pieChart.pointStop,drawCanvasPaths);				
		//addListenerMove(window, draw.pieChart.pointMove);
		//addListenerEnd(window, draw.pieChart.pointStop);
	},
	pointMove: function (e) {
		updateMouse(e);
		var obj = draw.path[draw.currPathNum].obj[0];
		var prevAngle = obj.angles[draw.currIndex];
		var angle = roundToNearest(getAngleFromAToB(obj.center, draw.mouse), 0.001);
		obj.angles[draw.currIndex] = angle;
		obj.angles.sort();
		if (prevAngle < 1 && angle > 5.3) { // if angle crosses zero, shift colors
			obj.fill.push(obj.fill.shift());
		} else if (prevAngle > 5.3 && angle < 1) {
			obj.fill.unshift(obj.fill.pop());
		}
		var newIndex = obj.angles.indexOf(angle);
		draw.currIndex = newIndex;
		updateBorder(draw.path[draw.currPathNum]);
		//drawSelectedPaths();
		//drawSelectCanvas();
	},
	pointStop: function (e) {
		var pathNum = draw.currPathNum;
		var point = draw.currPoint;
		var obj = draw.path[pathNum].obj[0];
		if (draw.gridSnap == true) {
			obj.points[point][0] = roundToNearest(obj.points[point][0], draw.gridSnapSize);
			obj.points[point][1] = roundToNearest(obj.points[point][1], draw.gridSnapSize);
			updateBorder(draw.path[pathNum]);
			drawSelectedPaths();
			drawSelectCanvas();
		}
		delete draw.currPathNum;
		delete draw.currIndex;
		//removeListenerMove(window, draw.pieChart.pointMove);
		//removeListenerEnd(window, draw.pieChart.pointStop);
		changeDrawMode();
	},
	scale: function (obj, sf, center) {
		if (un(center))
			var center = obj.center;
		obj.center[0] = center[0] + sf * (obj.center[0] - center[0]);
		obj.center[1] = center[1] + sf * (obj.center[1] - center[1]);
		if (!un(obj.radius))
			obj.radius *= sf;
		if (!un(obj.thickness))
			obj.thickness *= sf;
	}

};
draw.linkIcon = {
	draw: function (ctx, obj, path) {
		ctx.save();
		var rect = obj.rect;
		ctx.translate(rect[0], rect[1]);
		ctx.lineWidth = obj.lineWidth || 5;
		ctx.strokeStyle = obj.color || '#000';
		ctx.lineJoin = 'round';
		ctx.lineCap = 'round';
		var w = rect[2];
		var h = rect[3] || rect[2];
		ctx.beginPath();

		ctx.moveTo(w, h * 0.7);
		ctx.lineTo(w, h * 0.8);
		ctx.arc(w * 0.8, h - w * 0.2, w * 0.2, 0, 0.5 * Math.PI);
		ctx.lineTo(w * 0.8, h);
		ctx.arc(w * 0.2, h - w * 0.2, w * 0.2, 0.5 * Math.PI, 1 * Math.PI);
		ctx.lineTo(0, h - w * 0.2);
		ctx.arc(w * 0.2, w * 0.2, w * 0.2, 1 * Math.PI, 1.5 * Math.PI);
		ctx.lineTo(w * 0.3, 0);
		ctx.stroke();

		drawArrow({
			ctx: ctx,
			startX: w * 0.4,
			startY: h * 0.6,
			finX: w,
			finY: 0.01,
			arrowLength: 0.33 * w,
			fillArrow: true,
			lineWidth: ctx.lineWidth,
			color: ctx.color,
			angleBetweenLinesRads: 0.6
		});

		ctx.translate(-rect[0], -rect[1]);
		ctx.restore();
	},

}

draw.constructionButtons = {
	add: function () {
		deselectAllPaths(false);
		draw.path.push({
			obj: [{
					type: 'buttonCompassHelp',
					left: 20,
					top: 20,
					interact: {
						click: function (obj) {
							draw[obj.type].click(obj)
						},
						overlay: true
					}
				}
			],
			selected: true,
			trigger: []
		});

		draw.path.push({
			obj: [{
					type: 'compassHelp',
					left: 100,
					top: 20,
					interact: {
						overlay: true
					}
				}
			],
			selected: true,
			trigger: []
		});

		var types = ['buttonColorPicker', 'buttonLine', 'buttonPen', 'buttonCompass', 'buttonProtractor', 'buttonRuler', 'buttonUndo', 'buttonClear'];
		for (var t = 0; t < types.length; t++) {
			draw.path.push({
				obj: [{
						type: types[t],
						left: 20,
						top: 685 - 65 * (types.length - t),
						interact: {
							click: function (obj) {
								draw[obj.type].click(obj)
							},
							overlay: true
						}
					}
				],
				selected: true,
				trigger: []
			});
			if (types[t] == 'buttonColorPicker') {
				draw.path.push({
					obj: [{
							type: 'colorPicker',
							colors: ['#000', '#999', '#00F', '#F00', '#393', '#F0F', '#93C', '#F60'],
							left: 80,
							top: 685 - 65 * (types.length - t) + 3,
							interact: {
								click: function (obj) {
									draw[obj.type].click(obj)
								},
								overlay: true
							}
						}
					],
					selected: true,
					trigger: []
				});
			}
		}
		draw.updateAllBorders();
		drawCanvasPaths();
		changeDrawMode();
	},
	drawButton: function (ctx, size, type) {
		draw.buttonCompass.draw(ctx, {
			type: 'buttonCompass',
			left: (size - 55) / 2,
			top: (size - 55) / 2
		});
	}
}
draw.buttonCompass = {
	resizable: false,
	add: function () {
		deselectAllPaths(false);
		draw.path.push({
			obj: [{
					type: 'buttonCompass',
					left: 150 - draw.drawRelPos[0],
					top: 150 - draw.drawRelPos[1],
					interact: {
						click: function (obj) {
							draw[obj.type].click(obj)
						},
						overlay: true
					}
				}
			],
			selected: true,
			trigger: []
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
		changeDrawMode();
	},
	getRect: function (obj) {
		return [obj.left, obj.top, 55, 55];
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.left += dl;
		obj.top += dt;
	},
	drawButton: function (ctx, size, type) {
		draw.buttonCompass.draw(ctx, {
			type: 'buttonCompass',
			left: (size - 55) / 2,
			top: (size - 55) / 2
		});
	},
	draw: function (ctx, obj, path) {
		var color = draw.buttonColor;
		if (draw.compassVisible == true)
			color = draw.buttonSelectedColor;
		ctx.translate(obj.left, obj.top);
		roundedRect(ctx, 3, 3, 49, 49, 8, 6, '#000', color);
		ctx.lineWidth = 1;
		ctx.strokeStyle = '#000';

		var center1 = [13, 45];
		var center2 = [26, 15];
		var center3 = [40, 45];
		var armLength = Math.sqrt(Math.pow(0.5 * (center3[0] - center1[0]), 2) + Math.pow(center2[1] - center1[1], 2));

		var angle2 = -0.5 * Math.PI - Math.atan((center2[1] - center1[1]) / (center2[0] - center1[0]));
		var angle3 = 0.5 * Math.PI - Math.atan((center3[1] - center2[1]) / (center3[0] - center2[0]));

		// draw pointy arm
		ctx.translate(center2[0], center2[1]);
		ctx.rotate(-angle2);

		if (draw.compassVisible) {
			roundedRect(ctx, -2, 0, 4, armLength - 5, 1, 1, '#000');
		} else {
			roundedRect(ctx, -2, 0, 4, armLength - 5, 1, 1, '#000', '#99F');
		}
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 0.5;
		ctx.beginPath();
		ctx.moveTo(-1, armLength - 5);
		ctx.lineTo(0, armLength);
		ctx.lineTo(1, armLength - 5);
		ctx.lineTo(-1, armLength - 5);
		ctx.stroke();
		if (draw.compassVisible) {
			ctx.fillStyle = '#333';
			ctx.fill();
		}

		ctx.rotate(angle2);
		ctx.translate(-center2[0], -center2[1]);

		//draw pencil
		ctx.beginPath();
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 1;
		ctx.moveTo(40, 45);
		ctx.lineTo(38, 42);
		ctx.lineTo(38, 25);
		ctx.lineTo(42, 25);
		ctx.lineTo(42, 42);
		ctx.lineTo(40, 45);
		if (!draw.compassVisible) {
			if (draw.color == '#000') {
				ctx.fillStyle = '#FC3';
			} else {
				ctx.fillStyle = draw.color;
			}
			ctx.fill();
		}
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(40, 45);
		ctx.lineTo(38, 42);
		ctx.lineTo(42, 42);
		ctx.lineTo(40, 45);
		if (!draw.compassVisible) {
			ctx.fillStyle = '#FFC';
			ctx.fill();
		}
		ctx.stroke();
		ctx.beginPath();
		if (draw.color == '#000') {
			ctx.fillStyle = '#FC3';
		} else {
			ctx.fillStyle = draw.color;
		}
		ctx.moveTo(40, 45);
		ctx.lineTo(39.5, 44.3);
		ctx.lineTo(40.5, 45.7);
		ctx.lineTo(40, 45);
		ctx.fill();
		ctx.stroke();

		ctx.strokeRect(44, 15 + armLength * 0.5, 1, 5);

		// draw pencil arm
		ctx.translate(center2[0], center2[1]);
		ctx.rotate(-angle3);

		var pAngle = Math.PI / 14;

		ctx.beginPath();
		ctx.moveTo(-2, 0);
		ctx.lineTo(2, 0);
		ctx.lineTo(2, armLength * 0.7);
		ctx.lineTo(6, armLength * 0.7);
		ctx.lineTo(6, armLength * 0.7 + 4);
		ctx.lineTo(-2, armLength * 0.7);
		ctx.lineTo(-2, 0);
		ctx.stroke();
		if (!draw.compassVisible) {
			ctx.fillStyle = '#99F';
			ctx.fill();
		}

		if (!draw.compassVisible) {
			ctx.fillRect(6.5, armLength * 0.5 - 0.5, 1, 5);
		}

		ctx.rotate(angle3);
		ctx.translate(-center2[0], -center2[1]);

		// draw top of compass
		ctx.translate(center2[0], center2[1]);

		roundedRect(ctx, -2.5, -3, 5, 7, 1, 1, '#000', '#000');
		roundedRect(ctx, -1, -6, 2, 3, 0, 1, '#000', '#000');
		ctx.fillStyle = '#CCC';
		ctx.beginPath();
		ctx.arc(0, 0, 1, 0, 2 * Math.PI);
		ctx.fill();

		ctx.translate(-center2[0], -center2[1]);
		ctx.translate(-obj.left, -obj.top);
	},
	click: function () {
		if (un(draw.compass))
			draw.buttonCompass.initCompass();
		draw.compassVisible = !draw.compassVisible;
		moveToolToFront('compass');
		drawToolsCanvas();
		draw.cursors.update();
		drawCanvasPaths();
	},
	initCompass: function (init) {
		if (un(init))
			init = {};
		var center1 = init.center1 || [500, 450];
		var radius = init.radius || 150;
		var armLength = init.armLength || 250;
		var angle = init.angle || 0;
		var h = Math.sqrt(Math.pow(armLength, 2) - Math.pow(0.5 * radius, 2));
		var center2 = [center1[0] + 0.5 * radius * Math.cos(angle) + h * Math.sin(angle), center1[1] + 0.5 * radius * Math.sin(angle) - h * Math.cos(angle)];
		var center3 = [center1[0] + radius * Math.cos(angle), center1[1] + radius * Math.sin(angle)];

		var angle2 = (angle % (2 * Math.PI));
		if (angle2 < 0)
			angle2 += 2 * Math.PI;
		if (angle2 > 0.5 * Math.PI && angle2 < 1.5 * Math.PI) {
			var drawOn = 'left';
		} else {
			var drawOn = 'right';
		}

		var mp1 = midpoint(center1[0], center1[1], center3[0], center3[1]);
		var mp2 = midpoint(center2[0], center2[1], mp1[0], mp1[1]);

		draw.compass = {
			center1: center1.slice(0),
			startCenter1: center1.slice(0),
			center2: center2.slice(0),
			startCenter2: center2.slice(0),
			center3: center3.slice(0),
			startCenter3: center3.slice(0),
			radius: radius,
			startRadius: radius,
			h: h,
			startH: h,
			armLength: armLength,
			radiusLocked: false,
			angle: angle,
			startAngle: angle,
			drawOn: drawOn,
			startDrawOn: drawOn,
			lockCenter: mp2.slice(0),
			mode: 'none',
		}
		recalcCompassValues();
	}
};
draw.buttonProtractor = {
	resizable: false,
	add: function () {
		deselectAllPaths(false);
		draw.path.push({
			obj: [{
					type: 'buttonProtractor',
					left: 150 - draw.drawRelPos[0],
					top: 150 - draw.drawRelPos[1],
					interact: {
						click: function (obj) {
							draw[obj.type].click(obj)
						},
						overlay: true
					}
				}
			],
			selected: true,
			trigger: []
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
		changeDrawMode();
	},
	getRect: function (obj) {
		return [obj.left, obj.top, 55, 55];
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.left += dl;
		obj.top += dt;
	},
	drawButton: function (ctx, size, type) {
		draw.buttonProtractor.draw(ctx, {
			type: 'buttonProtractor',
			left: (size - 55) / 2,
			top: (size - 55) / 2
		});
	},
	draw: function (ctx, obj, path) {
		ctx.translate(obj.left, obj.top);
		var color = draw.buttonColor;
		if (draw.protractorVisible == true)
			color = draw.buttonSelectedColor;
		roundedRect(ctx, 3, 3, 49, 49, 8, 6, '#000', color);
		ctx.lineWidth = 1;
		ctx.strokeStyle = '#000';
		ctx.beginPath();
		ctx.moveTo(46.5, 35.5);
		ctx.lineTo(46.5, 37.5);
		ctx.lineTo(8.5, 37.5);
		ctx.lineTo(8.5, 34.5);
		ctx.arc(27.5, 34.5, 19, Math.PI, 2 * Math.PI);
		ctx.stroke();
		if (draw.protractorVisible == false) {
			ctx.fillStyle = '#CCF';
			ctx.fill();
			for (var i = 0; i < 7; i++) {
				ctx.moveTo(27.5 + 4 * Math.cos((1 + i / 6) * Math.PI), 34.5 + 4 * Math.sin((1 + i / 6) * Math.PI));
				ctx.lineTo(27.5 + 16 * Math.cos((1 + i / 6) * Math.PI), 34.5 + 16 * Math.sin((1 + i / 6) * Math.PI))
			}
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(27.5, 34.5, 15, Math.PI, 2 * Math.PI);
			for (var i = 0; i < 19; i++) {
				ctx.moveTo(27.5 + 17 * Math.cos((1 + i / 18) * Math.PI), 34.5 + 17 * Math.sin((1 + i / 18) * Math.PI));
				ctx.lineTo(27.5 + 19 * Math.cos((1 + i / 18) * Math.PI), 34.5 + 19 * Math.sin((1 + i / 18) * Math.PI))
			}
			ctx.moveTo(27.5, 34.5);
			ctx.lineTo(27.5, 30.5);
			ctx.moveTo(23.5, 34.5);
			ctx.lineTo(31.5, 34.5);
			ctx.stroke();
		}
		ctx.translate(-obj.left, -obj.top);
	},
	click: function () {
		if (un(draw.protractor))
			draw.buttonProtractor.initProtractor();
		draw.protractorVisible = !draw.protractorVisible;
		moveToolToFront('protractor');
		drawToolsCanvas();
		draw.cursors.update();
		drawCanvasPaths();
	},
	initProtractor: function (init) {
		if (un(init))
			init = {};
		draw.protractor = {
			center: init.center || [600, 500],
			startCenter: init.center || [600, 500],
			radius: init.radius || 250,
			startRadius: init.radius || 250,
			angle: 0,
			color: init.color || '#CCF',
			numbers: true
		}
	}
};
draw.buttonRuler = {
	resizable: false,
	add: function () {
		deselectAllPaths(false);
		draw.path.push({
			obj: [{
					type: 'buttonRuler',
					left: 150 - draw.drawRelPos[0],
					top: 150 - draw.drawRelPos[1],
					interact: {
						click: function (obj) {
							draw[obj.type].click(obj)
						},
						overlay: true
					}
				}
			],
			selected: true,
			trigger: []
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
		changeDrawMode();
	},
	getRect: function (obj) {
		return [obj.left, obj.top, 55, 55];
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.left += dl;
		obj.top += dt;
	},
	drawButton: function (ctx, size, type) {
		draw.buttonRuler.draw(ctx, {
			type: 'buttonRuler',
			left: (size - 55) / 2,
			top: (size - 55) / 2
		});
	},
	draw: function (ctx, obj, path) {
		ctx.translate(obj.left, obj.top);
		var color = draw.buttonColor;
		if (draw.rulerVisible == true)
			color = draw.buttonSelectedColor;
		roundedRect(ctx, 3, 3, 49, 49, 8, 6, '#000', color);
		if (draw.rulerVisible == true) {
			roundedRect(ctx, 7.5, 22.5, 40, 10, 3, 1, '#000');
		} else {
			roundedRect(ctx, 7.5, 22.5, 40, 10, 3, 1, '#000', '#CCF');
			if (un(draw.ruler) || draw.ruler.markings == true) {
				ctx.lineWidth = 1;
				ctx.strokeStyle = '#000';
				ctx.beginPath();
				for (var i = 0; i < 11; i++) {
					ctx.moveTo(9.5 + i * (36 / 10), 22.5);
					ctx.lineTo(9.5 + i * (36 / 10), 26.5);
				}
				ctx.stroke();
			}
		}
		ctx.translate(-obj.left, -obj.top);
	},
	click: function () {
		if (un(draw.ruler))
			draw.buttonRuler.initRuler();
		draw.rulerVisible = !draw.rulerVisible;
		moveToolToFront('ruler');
		drawToolsCanvas();
		draw.cursors.update();
		drawCanvasPaths();
	},
	initRuler: function (init) {
		if (un(init))
			init = {};
		draw.ruler = {
			left: init.left || 200,
			startLeft: init.left || 200,
			top: init.top || 300,
			startTop: init.top || 300,
			length: init.length || 800,
			width: init.length / 8 || 100,
			angle: 0,
			color: init.color || '#99F',
			transparent: boolean(init.transparent, true),
			markings: boolean(init.markings, true)
		}
		recalcRulerValues();
	}
};
draw.buttonPen = {
	resizable: false,
	add: function () {
		deselectAllPaths(false);
		draw.path.push({
			obj: [{
					type: 'buttonPen',
					left: 150 - draw.drawRelPos[0],
					top: 150 - draw.drawRelPos[1],
					interact: {
						click: function (obj) {
							draw[obj.type].click(obj)
						},
						overlay: true
					}
				}
			],
			selected: true,
			trigger: []
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
		changeDrawMode();
	},
	getRect: function (obj) {
		return [obj.left, obj.top, 55, 55];
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.left += dl;
		obj.top += dt;
	},
	drawButton: function (ctx, size, type) {
		draw.buttonPen.draw(ctx, {
			type: 'buttonPen',
			left: (size - 55) / 2,
			top: (size - 55) / 2
		});
	},
	draw: function (ctx, obj, path) {
		ctx.translate(obj.left, obj.top);
		var color = draw.drawMode !== 'pen' ? draw.buttonColor : draw.buttonSelectedColor;
		roundedRect(ctx, 3, 3, 55 - 6, 55 - 6, 8, 6, '#000', color);

		ctx.fillStyle = draw.color;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';

		ctx.translate(55 / 2, 55 / 2);
		ctx.rotate(Math.PI / 4);
		ctx.fillRect(-5, -11, 10, 20);
		ctx.fillRect(-5, -18, 10, 5);
		ctx.beginPath();
		ctx.moveTo(-5, 11);
		ctx.lineTo(0, 18);
		ctx.lineTo(5, 11);
		ctx.lineTo(-5, 11);
		ctx.fill();
		ctx.rotate(-Math.PI / 4);
		ctx.translate(-55 / 2, -55 / 2);
		ctx.translate(-obj.left, -obj.top);
	},
	click: function () {
		changeDrawMode('pen');
		draw.cursors.update();
		drawCanvasPaths();
	}
};
draw.buttonLine = {
	resizable: false,
	add: function () {
		deselectAllPaths(false);
		draw.path.push({
			obj: [{
					type: 'buttonLine',
					left: 150 - draw.drawRelPos[0],
					top: 150 - draw.drawRelPos[1],
					interact: {
						click: function (obj) {
							draw[obj.type].click(obj)
						},
						overlay: true
					}
				}
			],
			selected: true,
			trigger: []
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
		changeDrawMode();
	},
	getRect: function (obj) {
		return [obj.left, obj.top, 55, 55];
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.left += dl;
		obj.top += dt;
	},
	drawButton: function (ctx, size, type) {
		draw.buttonLine.draw(ctx, {
			type: 'buttonLine',
			left: (size - 55) / 2,
			top: (size - 55) / 2
		});
	},
	draw: function (ctx, obj, path) {
		ctx.translate(obj.left, obj.top);
		var color = draw.drawMode !== 'line' ? draw.buttonColor : draw.buttonSelectedColor;
		roundedRect(ctx, 3, 3, 49, 49, 8, 6, '#000', color);

		ctx.strokeStyle = draw.color;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';

		ctx.lineWidth = draw.thickness + 1;
		ctx.beginPath();
		ctx.arc(12, 20, 2, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.lineWidth = draw.thickness; ;
		ctx.beginPath();
		ctx.moveTo(12, 20);
		ctx.lineTo(43, 35);
		ctx.stroke();
		ctx.lineWidth = draw.thickness + 1;
		ctx.beginPath();
		ctx.arc(43, 35, 2, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.translate(-obj.left, -obj.top);
	},
	click: function () {
		changeDrawMode('line');
		draw.cursors.update();
		drawCanvasPaths();
	}
};
draw.buttonUndo = {
	resizable: false,
	add: function () {
		deselectAllPaths(false);
		draw.path.push({
			obj: [{
					type: 'buttonUndo',
					left: 150 - draw.drawRelPos[0],
					top: 150 - draw.drawRelPos[1],
					interact: {
						click: function (obj) {
							draw[obj.type].click(obj)
						},
						overlay: true
					}
				}
			],
			selected: true,
			trigger: []
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
		changeDrawMode();
	},
	getRect: function (obj) {
		return [obj.left, obj.top, 55, 55];
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.left += dl;
		obj.top += dt;
	},
	drawButton: function (ctx, size, type) {
		draw.buttonUndo.draw(ctx, {
			type: 'buttonUndo',
			left: (size - 55) / 2,
			top: (size - 55) / 2
		});
	},
	draw: function (ctx, obj, path) {
		ctx.translate(obj.left, obj.top);
		var s = 55;
		roundedRect(ctx, 3, 3, s - 6, s - 6, 8, 6, '#000', draw.buttonColor);

		ctx.strokeStyle = '#000';
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.arc(s / 2, s / 2, 12 * s / 55, -Math.PI, 0.7 * Math.PI);
		ctx.moveTo(13.5 * s / 55, 27.5 * s / 55);
		ctx.lineTo(13.5 * s / 55 - 10 * s / 55 * Math.sin(1 * Math.PI), 27.5 * s / 55 + 10 * s / 55 * Math.cos(1 * Math.PI));
		ctx.lineTo(13.5 * s / 55 - 10 * s / 55 * Math.cos(0.95 * Math.PI), 27.5 * s / 55 - 10 * s / 55 * Math.sin(0.95 * Math.PI));
		ctx.lineTo(13.5 * s / 55, 27.5 * s / 55);
		ctx.stroke();
		ctx.translate(-obj.left, -obj.top);
	},
	click: function () {
		for (var i = draw.path.length - 1; i >= 0; i--) {
			if (draw.path[i]._deletable === false)
				continue;
			if (typeof draw.path[i].obj == 'object') {
				for (var j = draw.path[i].obj.length - 1; j >= 0; j--) {
					var obj = draw.path[i].obj[j]
						draw.path[i].obj.splice(j, 1);
					if (draw.path[i].obj.length == 0) {
						draw.path.splice(i, 1);
					}
					drawCanvasPaths();
					return;
				}
			}
		}
	}
};
draw.buttonClear = {
	resizable: false,
	add: function () {
		deselectAllPaths(false);
		draw.path.push({
			obj: [{
					type: 'buttonClear',
					left: 150 - draw.drawRelPos[0],
					top: 150 - draw.drawRelPos[1],
					interact: {
						click: function (obj) {
							draw[obj.type].click(obj)
						},
						overlay: true
					}
				}
			],
			selected: true,
			trigger: []
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
		changeDrawMode();
	},
	getRect: function (obj) {
		return [obj.left, obj.top, 55, 55];
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.left += dl;
		obj.top += dt;
	},
	drawButton: function (ctx, size, type) {
		draw.buttonClear.draw(ctx, {
			type: 'buttonClear',
			left: (size - 55) / 2,
			top: (size - 55) / 2
		});
	},
	draw: function (ctx, obj, path) {
		ctx.translate(obj.left, obj.top);
		roundedRect(ctx, 3, 3, 49, 49, 8, 6, '#000', draw.buttonColor);

		ctx.strokeStyle = '#000';
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';

		ctx.lineWidth = 4;
		text({
			context: ctx,
			left: 0,
			width: 55,
			top: 15,
			textArray: ['<<font:Arial>><<fontSize:20>><<align:center>>CLR']
		});
		ctx.translate(-obj.left, -obj.top);
	},
	click: function () {
		for (var p = draw.path.length - 1; p >= 0; p--) {
			var path = draw.path[p];
			if (path._deletable == false)
				continue;
			draw.path.splice(p, 1);
		}
	}
};
draw.buttonLineWidthPicker = {
	resizable: false,
	add: function () {
		deselectAllPaths(false);
		draw.path.push({
			obj: [{
					type: 'buttonLineWidthPicker',
					left: 150 - draw.drawRelPos[0],
					top: 150 - draw.drawRelPos[1],
					interact: {
						click: function (obj) {
							draw[obj.type].click(obj)
						},
						overlay: true
					}
				}
			],
			selected: true,
			trigger: []
		});
		updateBorder(draw.path.last());
		draw.path.push({
			obj: [{
					type: 'lineWidthSelect',
					left: 205 - draw.drawRelPos[0],
					top: 150 - draw.drawRelPos[1],
					interact: {
						click: draw.lineWidthPicker.click,
						overlay: true
					}
				}
			],
			selected: true,
			trigger: []
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
		changeDrawMode();
	},
	getRect: function (obj) {
		return [obj.left, obj.top, 55, 55];
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.left += dl;
		obj.top += dt;
	},
	drawButton: function (ctx, size, type) {
		draw.buttonColorPicker.draw(ctx, {
			type: 'buttonLineWidthPicker',
			left: (size - 55) / 2,
			top: (size - 55) / 2
		});
	},
	draw: function (ctx, obj, path) {
		ctx.translate(obj.left, obj.top);
		var color = draw.buttonColor;
		if (draw.lineWidthSelectVisible == true)
			color = draw.buttonSelectedColor;
		if (obj._disabled == true)
			color = colorA(color, 0.35);
		var color2 = '#000';
		if (obj._disabled == true)
			color2 = colorA('#000', 0.35);
		roundedRect(ctx, 0, 0, 55, 55, 8, 0.01, color, color);
		roundedRect(ctx, 1.5, 1.5, 52, 52, 8, 3, color2);
		ctx.strokeStyle = color2;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(10, 12);
		ctx.lineTo(45, 12);
		ctx.stroke();
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(10.5, 20);
		ctx.lineTo(44.5, 20);
		ctx.stroke();
		ctx.lineWidth = 5;
		ctx.beginPath();
		ctx.moveTo(11, 29);
		ctx.lineTo(44, 29);
		ctx.stroke();
		ctx.lineWidth = 7;
		ctx.beginPath();
		ctx.moveTo(11.5, 39);
		ctx.lineTo(43.5, 39);
		ctx.stroke();
		ctx.translate(-obj.left, -obj.top);
	},
	click: function (obj) {
		if (obj._disabled == true) {
			Notifier.notify('Please subscribe to use this feature.', '', '/Images/logoSmall.PNG');
		} else {
			draw.lineWidthSelectVisible = !draw.lineWidthSelectVisible;
			drawCanvasPaths();
		}
	}
};
draw.lineWidthSelect = {
	resizable: false,
	add: function () {
		deselectAllPaths(false);
		draw.path.push({
			obj: [{
					type: 'lineWidthSelect',
					left: 150 - draw.drawRelPos[0],
					top: 150 - draw.drawRelPos[1],
					colors: [],
					interact: {
						click: function (obj) {
							draw[obj.type].click(obj)
						},
						overlay: true
					}
				}
			],
			selected: true,
			trigger: []
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
		changeDrawMode();
	},
	getRect: function (obj) {
		return [obj.left, obj.top, 110, 200];
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.left += dl;
		obj.top += dt;
	},
	draw: function (ctx, obj, path) {
		if (draw.mode == 'interact' && draw.lineWidthSelectVisible == false)
			return;
		if (draw.mode !== 'interact' && path.selected !== true)
			return;
		var alpha = draw.mode == 'interact' ? 1 : 0.25;
		ctx.translate(obj.left, obj.top);
		var color = draw.buttonColor;
		roundedRect(ctx, 0, 0, 110, 200, 8, 6, colorA('#000', alpha), colorA(color, alpha));

		ctx.lineJoin = 'round';
		ctx.lineCap = 'round';
		for (var i = 0; i < 4; i++) {
			ctx.fillStyle = draw.thickness == [1, 3, 5, 7][i] ? colorA('#CFF', alpha) : colorA('#FFC', alpha);
			ctx.fillRect(10, 10 + 45 * i, 90, 45);
			ctx.lineWidth = [1, 3, 5, 7][i];
			ctx.beginPath();
			ctx.moveTo(25, 10 + 45 * i + 22.5);
			ctx.lineTo(85, 10 + 45 * i + 22.5);
			ctx.stroke();
		}
		ctx.strokeStyle = colorA('#000', alpha);
		ctx.lineWidth = 2;
		ctx.beginPath();
		for (var i = 0; i <= 4; i++) {
			ctx.moveTo(10, 10 + 45 * i);
			ctx.lineTo(100, 10 + 45 * i);
		}
		for (var i = 0; i <= 1; i++) {
			ctx.moveTo(10 + 90 * i, 10);
			ctx.lineTo(10 + 90 * i, 190);
		}

		ctx.stroke();
		ctx.translate(-obj.left, -obj.top);
	},
	click: function (obj) {
		var x = mouse.x - draw.drawRelPos[0] - obj.left;
		var y = mouse.y - draw.drawRelPos[1] - obj.top;
		if (x < 10 || x > 90 || y < 10 || y > 190)
			return;
		var r = Math.floor((y - 10) / 45);
		draw.thickness = [1, 3, 5, 7][r];
		//draw.lineWidthSelectVisible = false;
		draw.cursors.update();
		drawCanvasPaths();
		drawCompass();
	}
};
draw.buttonColorPicker = {
	resizable: false,
	add: function () {
		deselectAllPaths(false);
		draw.path.push({
			obj: [{
					type: 'buttonColorPicker',
					left: 150 - draw.drawRelPos[0],
					top: 150 - draw.drawRelPos[1],
					interact: {
						click: function (obj) {
							draw[obj.type].click(obj)
						},
						overlay: true
					}
				}
			],
			selected: true,
			trigger: []
		});
		updateBorder(draw.path.last());
		draw.path.push({
			obj: [{
					type: 'colorPicker',
					colors: ['#000', '#999', '#00F', '#F00', '#393', '#F0F', '#93C', '#F60'],
					left: 205 - draw.drawRelPos[0],
					top: 150 - draw.drawRelPos[1],
					interact: {
						click: draw.colorPicker.click,
						overlay: true
					}
				}
			],
			selected: true,
			trigger: []
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
		changeDrawMode();
	},
	getRect: function (obj) {
		return [obj.left, obj.top, 55, 55];
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.left += dl;
		obj.top += dt;
	},
	drawButton: function (ctx, size, type) {
		draw.buttonColorPicker.draw(ctx, {
			type: 'buttonColorPicker',
			left: (size - 55) / 2,
			top: (size - 55) / 2
		});
	},
	draw: function (ctx, obj, path) {
		ctx.translate(obj.left, obj.top);
		var color = draw.buttonColor;
		if (draw.colorSelectVisible == true)
			color = draw.buttonSelectedColor;
		if (obj._disabled == true)
			color = colorA(color, 0.35);
		var color2 = '#000';
		if (obj._disabled == true)
			color2 = colorA('#000', 0.35);
		roundedRect(ctx, 0, 0, 55, 55, 8, 0.01, color, color);
		roundedRect(ctx, 1.5, 1.5, 52, 52, 8, 3, color2);
		var colors = ['#000', '#999', '#00F', '#F00', '#393', '#F0F', '#93C', '#F60'];
		for (var i = 0; i < 9; i++) {
			if (obj._disabled == true) {
				ctx.fillStyle = !un(colors[i]) ? colorA(colors[i], 0.35) : colorA('#FFF', 0.5);
			} else {
				ctx.fillStyle = colors[i] || '#FFF';
			}
			ctx.fillRect(12.5 + 10 * (i % 3), 12.5 + 10 * Math.floor(i / 3), 10, 10);
		}
		ctx.strokeStyle = obj._disabled == true ? colorA('#000', 0.35) : '#000';
		ctx.lineWidth = 1;
		ctx.strokeRect(12.5, 12.5, 30, 30);
		ctx.translate(-obj.left, -obj.top);
	},
	click: function (obj) {
		if (obj._disabled == true) {
			Notifier.notify('Please subscribe to use this feature.', '', '/Images/logoSmall.PNG');
		} else {
			draw.colorSelectVisible = !draw.colorSelectVisible;
			drawCanvasPaths();
		}
	}
};
draw.colorPicker = {
	resizable: false,
	add: function () {
		deselectAllPaths(false);
		draw.path.push({
			obj: [{
					type: 'colorPicker',
					colors: ['#000', '#999', '#00F', '#F00', '#393', '#F0F', '#93C', '#F60'],
					left: 150 - draw.drawRelPos[0],
					top: 150 - draw.drawRelPos[1],
					colors: [],
					interact: {
						click: function (obj) {
							draw[obj.type].click(obj)
						},
						overlay: true
					}
				}
			],
			selected: true,
			trigger: []
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
		changeDrawMode();
	},
	getRect: function (obj) {
		return [obj.left, obj.top, 110, 200];
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.left += dl;
		obj.top += dt;
	},
	draw: function (ctx, obj, path) {
		if (draw.mode == 'interact' && draw.colorSelectVisible == false)
			return;
		if (draw.mode !== 'interact' && path.selected !== true)
			return;
		var alpha = draw.mode == 'interact' ? 1 : 0.25;
		ctx.translate(obj.left, obj.top);
		var color = draw.buttonColor;
		roundedRect(ctx, 0, 0, 110, 200, 8, 6, colorA('#000', alpha), colorA(color, alpha));
		for (var i = 0; i < 8; i++) {
			ctx.fillStyle = colorA(obj.colors[i], alpha);
			ctx.fillRect(10 + 45 * (i % 2), 10 + 45 * Math.floor(i / 2), 45, 45);
		}
		ctx.strokeStyle = colorA('#000', alpha);
		ctx.lineWidth = 2;
		ctx.beginPath();
		for (var i = 0; i <= 4; i++) {
			ctx.moveTo(10, 10 + 45 * i);
			ctx.lineTo(100, 10 + 45 * i);
		}
		for (var i = 0; i <= 2; i++) {
			ctx.moveTo(10 + 45 * i, 10);
			ctx.lineTo(10 + 45 * i, 190);
		}
		ctx.stroke();
		ctx.translate(-obj.left, -obj.top);
	},
	click: function (obj) {
		//var x = mouse.x - draw.drawRelPos[0] - obj.left;
		//var y = mouse.y - draw.drawRelPos[1] - obj.top;
		var x = draw.mouse[0] - obj.left;
		var y = draw.mouse[1] - obj.top;
		if (x < 10 || x > 90 || y < 10 || y > 190)
			return;
		var c = Math.floor((x - 10) / 45);
		var r = Math.floor((y - 10) / 45);
		if (obj.fill === true) {
			draw.fillColor = obj.colors[2 * r + c];
		} else {
			draw.color = obj.colors[2 * r + c];
		}
		//draw.colorSelectVisible = false;
		draw.cursors.update();
		drawCanvasPaths();
		drawCompass();
	}
};
draw.buttonCompassHelp = {
	resizable: false,
	add: function () {
		deselectAllPaths(false);
		draw.path.push({
			obj: [{
					type: 'buttonCompassHelp',
					left: 150 - draw.drawRelPos[0],
					top: 150 - draw.drawRelPos[1],
					interact: {
						click: function (obj) {
							draw[obj.type].click(obj)
						},
						overlay: true
					}
				}
			],
			selected: true,
			trigger: []
		});
		updateBorder(draw.path.last());
		draw.path.push({
			obj: [{
					type: 'compassHelp',
					left: 205 - draw.drawRelPos[0],
					top: 150 - draw.drawRelPos[1],
					interact: {
						overlay: true
					}
				}
			],
			selected: true,
			trigger: []
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
		changeDrawMode();
	},
	getRect: function (obj) {
		return [obj.left, obj.top, 55, 55];
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.left += dl;
		obj.top += dt;
	},
	drawButton: function (ctx, size, type) {
		draw.buttonCompassHelp.draw(ctx, {
			type: 'buttonCompassHelp',
			left: (size - 55) / 2,
			top: (size - 55) / 2
		});
	},
	draw: function (ctx, obj, path) {
		ctx.translate(obj.left, obj.top);
		var color = draw.buttonColor;
		if (draw.compassHelpVisible == true)
			color = draw.buttonSelectedColor;
		roundedRect(ctx, 3, 3, 49, 49, 8, 6, '#000', color);
		ctx.strokeStyle = '#000';
		ctx.fillStyle = '#666';
		ctx.font = '42px Arial';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText('?', 27.5, 27.5);
		ctx.strokeText('?', 27.5, 27.5);
		ctx.translate(-obj.left, -obj.top);
	},
	click: function () {
		draw.compassHelpVisible = !draw.compassHelpVisible;
		drawCanvasPaths();
	}
};
draw.compassHelp = {
	resizable: false,
	add: function () {
		deselectAllPaths(false);
		draw.path.push({
			obj: [{
					type: 'compassHelp',
					left: 205 - draw.drawRelPos[0],
					top: 150 - draw.drawRelPos[1],
					interact: {
						overlay: true
					}
				}
			],
			selected: true,
			trigger: []
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
		changeDrawMode();
	},
	getRect: function (obj) {
		return [obj.left, obj.top, 500, 400];
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.left += dl;
		obj.top += dt;
	},
	init: function (obj) {
		var center1 = [obj.left + 0.35 * 500, obj.top + 0.85 * 400];
		var radius = 150;
		var armLength = 250;
		var angle = 0;
		var h = Math.sqrt(Math.pow(armLength, 2) - Math.pow(0.5 * radius, 2));
		var center2 = [center1[0] + 0.5 * radius * Math.cos(angle) + h * Math.sin(angle), center1[1] + 0.5 * radius * Math.sin(angle) - h * Math.cos(angle)];
		var center3 = [center1[0] + radius * Math.cos(angle), center1[1] + radius * Math.sin(angle)];

		var angle2 = (angle % (2 * Math.PI));
		if (angle2 < 0)
			angle2 += 2 * Math.PI;
		if (angle2 > 0.5 * Math.PI && angle2 < 1.5 * Math.PI) {
			var drawOn = 'left';
		} else {
			var drawOn = 'right';
		}

		var mp1 = midpoint(center1[0], center1[1], center3[0], center3[1]);
		var mp2 = midpoint(center2[0], center2[1], mp1[0], mp1[1]);

		var compass = {
			center1: center1.slice(0),
			startCenter1: center1.slice(0),
			center2: center2.slice(0),
			startCenter2: center2.slice(0),
			center3: center3.slice(0),
			startCenter3: center3.slice(0),
			radius: radius,
			startRadius: radius,
			h: h,
			startH: h,
			armLength: armLength,
			radiusLocked: false,
			angle: angle,
			startAngle: angle,
			drawOn: drawOn,
			startDrawOn: drawOn,
			lockCenter: mp2.slice(0),
			mode: 'none',
		}
		return compass;
	},
	draw: function (ctx, obj, path) {
		if (draw.mode == 'interact' && draw.compassHelpVisible == false)
			return;
		if (draw.mode !== 'interact' && path.selected !== true)
			return;

		text({
			ctx: ctx,
			rect: [obj.left, obj.top, 500, 400],
			text: [''],
			box: {
				type: 'loose',
				borderColor: '#000',
				borderWidth: 2,
				radius: 10,
				color: '#FFC'
			}
		});

		text({
			ctx: ctx,
			rect: [obj.left + 55, obj.top + 20, 160, 200],
			align: [0, -1],
			text: ['<<font:segoePrint>><<bold:true>>Drag the top of the compass to draw an arc']
		});

		text({
			ctx: ctx,
			rect: [obj.left + 30, obj.top + 150, 160, 200],
			align: [0, -1],
			text: ['<<font:segoePrint>>Drag this arm to move the whole compass']
		});

		text({
			ctx: ctx,
			rect: [obj.left + 340, obj.top + 150, 140, 200],
			align: [0, -1],
			text: ['<<font:segoePrint>>Drag this arm to move the pencil']
		});

		text({
			ctx: ctx,
			rect: [obj.left, obj.top + 360, 500, 70],
			align: [0, -1],
			text: ['<<font:segoePrint>>Press here to lock the compass']
		});

		drawArrow({
			ctx: ctx,
			startX: obj.left + 250,
			finX: obj.left + 250,
			startY: obj.top + 350,
			finY: obj.top + 250,
			lineWidth: 1,
			arrowLength: 15
		});

		if (un(obj._compass)) {
			obj._compass = draw.compassHelp.init(obj);
		}
		var compass = obj._compass;

		var armLength = compass.armLength;
		var radius = compass.radius;
		var h = compass.h;
		var center1 = compass.center1;
		var center2 = compass.center2;
		var center3 = compass.center3;
		var drawOn = compass.drawOn;

		if (compass.radiusLocked == true || compass.mode == 'draw') {
			// draw lock button
			ctx.translate(center2[0], center2[1]);
			if (drawOn == 'right') {
				ctx.rotate(compass.angle);
			} else {
				ctx.rotate(compass.angle + Math.PI);
			}

			var lockHeight = 0.5 * compass.h;

			//bar
			ctx.fillStyle = '#99F';
			ctx.strokeStyle = '#000';
			ctx.lineWidth = 1;
			ctx.fillRect(-0.25 * compass.radius, lockHeight - 5, 0.5 * compass.radius, 10);
			ctx.strokeRect(-0.25 * compass.radius, lockHeight - 5, 0.5 * compass.radius, 10);

			//circle
			ctx.fillStyle = '#99F';
			ctx.strokeStyle = '#333';
			ctx.lineWidth = 3;
			ctx.beginPath();
			ctx.arc(0, lockHeight, 15, 0, 2 * Math.PI);
			ctx.fill();
			ctx.stroke();

			//padlock
			ctx.fillStyle = '#333';
			ctx.beginPath();
			ctx.moveTo(6, lockHeight - 2);
			ctx.lineTo(6, lockHeight + 3);
			ctx.arc(0, lockHeight + 3, 6, 0, Math.PI);
			ctx.lineTo(-6, lockHeight + 3);
			ctx.lineTo(-6, lockHeight - 2);
			ctx.stroke();
			ctx.fill();

			//keyhole
			ctx.fillStyle = '#99F';
			ctx.beginPath();
			ctx.arc(0, lockHeight + 2.5, 1.5, 0, 2 * Math.PI);
			ctx.fill();
			ctx.fillRect(-0.5, lockHeight + 2.5, 1, 3);

			//arm
			ctx.beginPath();
			ctx.moveTo(-6, lockHeight + 2);
			ctx.lineTo(-6, lockHeight + 2);
			ctx.arc(0, lockHeight - 4, 5, Math.PI, 2 * Math.PI);
			ctx.lineTo(6, lockHeight + 2);
			ctx.stroke();

			if (drawOn == 'right') {
				ctx.rotate(-compass.angle);
			} else {
				ctx.rotate(-compass.angle - Math.PI);
			}
			ctx.translate(-center2[0], -center2[1]);
		} else {
			// draw lock button
			ctx.translate(center2[0], center2[1]);
			if (drawOn == 'right') {
				ctx.rotate(compass.angle);
			} else {
				ctx.rotate(compass.angle + Math.PI);
			}

			var lockHeight = 0.5 * compass.h;

			//bar
			ctx.fillStyle = '#999';
			ctx.strokeStyle = '#999';
			ctx.lineWidth = 2;
			ctx.strokeRect(-0.25 * compass.radius, lockHeight - 5, 0.5 * compass.radius, 10);

			//circle
			ctx.fillStyle = '#FFC';
			ctx.strokeStyle = '#999';
			ctx.lineWidth = 3;
			ctx.beginPath();
			ctx.arc(0, lockHeight, 15, 0, 2 * Math.PI);
			ctx.fill();
			ctx.stroke();

			//padlock
			ctx.fillStyle = '#999';
			ctx.beginPath();
			ctx.moveTo(6, lockHeight - 2);
			ctx.lineTo(6, lockHeight + 3);
			ctx.arc(0, lockHeight + 3, 6, 0, Math.PI);
			ctx.lineTo(-6, lockHeight + 3);
			ctx.lineTo(-6, lockHeight - 2);
			ctx.stroke();
			ctx.fill();

			//keyhole
			ctx.fillStyle = '#FFC';
			ctx.beginPath();
			ctx.arc(0, lockHeight + 2.5, 1.5, 0, 2 * Math.PI);
			ctx.fill();
			ctx.fillRect(-0.5, lockHeight + 2.5, 1, 3);

			//arm
			ctx.beginPath();
			ctx.moveTo(-6, lockHeight - 2);
			ctx.arc(0, lockHeight - 4, 5, (4 / 5) * Math.PI, (9 / 5) * Math.PI);
			ctx.stroke();

			if (drawOn == 'right') {
				ctx.rotate(-compass.angle);
			} else {
				ctx.rotate(-compass.angle - Math.PI);
			}
			ctx.translate(-center2[0], -center2[1]);
		}

		ctx.lineWidth = 2;
		ctx.strokeStyle = '#000';
		ctx.fillStyle = '#000';

		var angle2 = -0.5 * Math.PI - Math.atan((center2[1] - center1[1]) / (center2[0] - center1[0]));
		if (center2[0] < center1[0])
			angle2 += Math.PI;
		var angle3 = -0.5 * Math.PI - Math.atan((center3[1] - center2[1]) / (center3[0] - center2[0]));
		if (center2[0] < center3[0])
			angle3 += Math.PI;

		// draw pointy arm
		ctx.translate(center2[0], center2[1]);
		ctx.rotate(-angle2);

		roundedRect(ctx, -7, 0, 14, armLength - 20, 3, 4, '#000', '#99F');
		ctx.strokeStyle = '#000';
		ctx.fillStyle = '#CCC';
		ctx.lineWidth = 0.5;
		ctx.beginPath();
		ctx.moveTo(-3, armLength - 20);
		ctx.lineTo(0, armLength);
		ctx.lineTo(3, armLength - 20);
		ctx.lineTo(-3, armLength - 20);
		ctx.fill();
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(0, armLength - 26);
		ctx.stroke();

		ctx.rotate(angle2);
		ctx.translate(-center2[0], -center2[1]);

		// draw pencil arm
		ctx.translate(center2[0], center2[1]);
		ctx.rotate(-angle3);

		if (drawOn == 'right') {
			var pAngle = Math.PI / 14;
		} else {
			var pAngle = -Math.PI / 14;
		}

		//draw pencil
		ctx.translate(0, armLength);
		ctx.rotate(pAngle);

		ctx.beginPath();
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 2;
		if (draw.color == '#000') {
			ctx.fillStyle = '#FC3';
		} else {
			ctx.fillStyle = draw.color;
		}
		ctx.moveTo(0, 0);
		ctx.lineTo(-10, -30);
		ctx.lineTo(-10, -200);
		ctx.lineTo(10, -200);
		ctx.lineTo(10, -30);
		ctx.lineTo(0, 0);
		ctx.fill();
		ctx.stroke();
		ctx.beginPath();
		ctx.fillStyle = '#FFC';
		ctx.moveTo(0, 0);
		ctx.lineTo(-10, -30);
		ctx.lineTo(10, -30);
		ctx.lineTo(0, 0);
		ctx.fill();
		ctx.stroke();
		ctx.beginPath();
		ctx.fillStyle = draw.color;
		ctx.moveTo(0, 0);
		ctx.lineTo(-3, -9);
		ctx.lineTo(3, -9);
		ctx.lineTo(0, 0);
		ctx.fill();
		ctx.stroke();

		ctx.rotate(-pAngle);
		ctx.translate(0, -armLength);

		ctx.fillStyle = '#99F';
		ctx.beginPath();
		if (drawOn == 'right') {
			ctx.moveTo(-7, 0);
			ctx.lineTo(7, 0);
			ctx.lineTo(7, armLength - 95);
			ctx.lineTo(7 + 45 * Math.cos(pAngle), armLength - 95 + 45 * Math.sin(pAngle));
			ctx.lineTo(7 + 45 * Math.cos(pAngle) - 20 * Math.sin(pAngle), armLength - 95 + 45 * Math.sin(pAngle) + 20 * Math.cos(pAngle));
			ctx.lineTo(-7, armLength - 80);
			ctx.lineTo(-7, 0);
		} else {
			ctx.moveTo(7, 0);
			ctx.lineTo(-7, 0);
			ctx.lineTo(-7, armLength - 95);
			ctx.lineTo(-7 - 45 * Math.cos(pAngle), armLength - 95 - 45 * Math.sin(pAngle));
			ctx.lineTo(-7 - 45 * Math.cos(pAngle) - 20 * Math.sin(pAngle), armLength - 95 - 45 * Math.sin(pAngle) + 20 * Math.cos(pAngle));
			ctx.lineTo(7, armLength - 80);
			ctx.lineTo(7, 0);
		}
		ctx.fill();
		ctx.stroke();

		ctx.translate(0, armLength);
		ctx.rotate(pAngle);

		ctx.beginPath();
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 2;
		ctx.fillStyle = '#000';
		if (drawOn == 'right') {
			ctx.moveTo(14, -103);
			ctx.lineTo(24, -103);
			ctx.lineTo(24, -67);
			ctx.lineTo(14, -67);
			ctx.lineTo(14, -103);
		} else {
			ctx.moveTo(-14, -103);
			ctx.lineTo(-24, -103);
			ctx.lineTo(-24, -67);
			ctx.lineTo(-14, -67);
			ctx.lineTo(-14, -103);
		}
		ctx.fill();
		ctx.stroke();

		ctx.rotate(-pAngle);
		ctx.translate(0, -armLength);

		ctx.strokeStyle = '#000';
		ctx.fillStyle = '#CCC';
		ctx.lineWidth = 0.5;
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(0, armLength - 86);
		ctx.stroke();

		ctx.rotate(angle3);
		ctx.translate(-center2[0], -center2[1]);

		// draw top of compass
		ctx.translate(center2[0], center2[1]);
		if (drawOn == 'right') {
			ctx.rotate(compass.angle);
		} else {
			ctx.rotate(compass.angle + Math.PI);
		}

		roundedRect(ctx, -15, -30, 30, 55, 10, 2, '#000', '#000');
		roundedRect(ctx, -5, -60, 10, 30, 0, 2, '#000', '#000');
		ctx.fillStyle = '#CCC';
		ctx.beginPath();
		ctx.arc(0, 0, 7, 0, 2 * Math.PI);
		ctx.fill();
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(-4, -4);
		ctx.lineTo(4, 4);
		ctx.moveTo(4, -4);
		ctx.lineTo(-4, 4);
		ctx.stroke();

		if (drawOn == 'right') {
			ctx.rotate(-compass.angle);
		} else {
			ctx.rotate(-compass.angle - Math.PI);
		}
		ctx.translate(-center2[0], -center2[1]);
	}

};
draw.buttonDash = {
	resizable: false,
	add: function () {
		deselectAllPaths(false);
		draw.path.push({
			obj: [{
					type: 'buttonDash',
					left: 150 - draw.drawRelPos[0],
					top: 150 - draw.drawRelPos[1],
					dash: [15, 15],
					interact: {
						click: function (obj) {
							draw[obj.type].click(obj)
						},
						overlay: true
					}
				}
			],
			selected: true,
			trigger: []
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
		changeDrawMode();
	},
	getRect: function (obj) {
		return [obj.left, obj.top, 55, 55];
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.left += dl;
		obj.top += dt;
	},
	drawButton: function (ctx, size, type) {
		draw.buttonUndo.draw(ctx, {
			type: 'buttonDash',
			left: (size - 55) / 2,
			top: (size - 55) / 2
		});
	},
	draw: function (ctx, obj, path) {
		var color = arraysEqual(draw.dash, obj.dash) ? draw.buttonSelectedColor : draw.buttonColor;

		ctx.translate(obj.left, obj.top);
		var s = 55;
		roundedRect(ctx, 3, 3, s - 6, s - 6, 8, 6, '#000', color);

		if (typeof ctx.setLineDash !== 'function')
			ctx.setLineDash = function () {};
		if (typeof obj.dash !== 'undefined')
			ctx.setLineDash([4, 7]);
		ctx.strokeStyle = draw.color;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.moveTo(13.5 * s / 55, 27.5 * s / 55);
		ctx.lineTo((55 - 13.5) * s / 55, 27.5 * s / 55);
		ctx.stroke();
		ctx.translate(-obj.left, -obj.top);
	},
	click: function (obj) {
		if (un(draw.dash) || draw.dash.length == 0) {
			draw.dash = clone(obj.dash);
		} else {
			delete draw.dash;
		}
		drawCanvasPaths();
	}
};
draw.buttonFloodFill = {
	resizable: false,
	add: function () {
		deselectAllPaths(false);
		draw.path.push({
			obj: [{
					type: 'buttonFloodFill',
					left: 150 - draw.drawRelPos[0],
					top: 150 - draw.drawRelPos[1],
					interact: {
						click: function (obj) {
							draw[obj.type].click(obj)
						},
						overlay: true
					}
				}
			],
			selected: true,
			trigger: []
		});
		updateBorder(draw.path.last());
		drawCanvasPaths();
		changeDrawMode();
	},
	getRect: function (obj) {
		return [obj.left, obj.top, 55, 55];
	},
	changePosition: function (obj, dl, dt, dw, dh) {
		obj.left += dl;
		obj.top += dt;
	},
	drawButton: function (ctx, size, type) {
		draw.buttonFloodFill.draw(ctx, {
			type: 'buttonFloodFill',
			left: (size - 55) / 2,
			top: (size - 55) / 2
		});
	},
	draw: function (ctx, obj, path) {
		ctx.translate(obj.left, obj.top);
		var color = draw.buttonColor;
		if (draw.drawMode == 'floodFill')
			color = draw.buttonSelectedColor;
		roundedRect(ctx, 3, 3, 49, 49, 8, 6, '#000', color);

		ctx.translate(26 + 2.5, 25 + 2.5);
		ctx.rotate(-0.25 * Math.PI);

		ctx.strokeStyle = '#000';
		ctx.fillStyle = '#FFF';
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(-7, -8);
		ctx.lineTo(7, -8);
		ctx.scale(7 / 2, 1);
		ctx.arc(0, -8, 2, Math.PI, 2 * Math.PI);
		ctx.scale(2 / 7, 1);
		ctx.lineTo(7, 8);
		ctx.scale(7 / 2, 1);
		ctx.arc(0, 8, 2, 0, Math.PI);
		ctx.scale(2 / 7, 1);
		ctx.lineTo(-7, -8);
		ctx.stroke();
		ctx.fill();

		var color = draw.fillColor !== 'none' ? draw.fillColor : '#00F';

		ctx.strokeStyle = '#000';
		ctx.fillStyle = color;
		ctx.lineWidth = 0.5;
		ctx.beginPath();
		ctx.moveTo(7, -8);
		ctx.scale(7 / 2, 1);
		ctx.arc(0, -8, 2, Math.PI, 3 * Math.PI);
		ctx.scale(2 / 7, 1);
		ctx.fill();
		ctx.stroke();

		ctx.fillRect(-7, 0, 9, 5);
		ctx.strokeRect(-7, 0, 9, 5);

		ctx.beginPath();
		ctx.moveTo(0, -4);
		ctx.arc(0, -4, 1, 0, 2 * Math.PI);
		ctx.fill();
		ctx.beginPath();
		ctx.moveTo(0, -4);
		ctx.quadraticCurveTo(20, 10, 8, -2);
		ctx.stroke();

		ctx.strokeStyle = color;
		ctx.beginPath();
		ctx.moveTo(-3, -9);
		ctx.quadraticCurveTo(-6, -17, -15, -3);
		ctx.quadraticCurveTo(-9, -9, -7, -9);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();

		ctx.rotate(0.25 * Math.PI);
		ctx.translate(-26 + 2.5, -25 + 2.5);

		ctx.translate(-obj.left, -obj.top);
	},
	click: function () {
		changeDrawMode('floodFill');
		draw.cursors.update();
	}
};
draw.fillPath = {
	resizable: false,
	add: function () {},
	getRect: function (obj) {
		obj._left = obj.pos[0][0] - 10;
		obj._top = obj.pos[0][1] - 10;
		obj._right = obj.pos[0][0] + 10;
		obj._bottom = obj.pos[0][1] + 10;
		for (var j = 1; j < obj.pos.length; j++) {
			obj._left = Math.min(obj._left, obj.pos[j][0] - 10);
			obj._top = Math.min(obj._top, obj.pos[j][1] - 10);
			obj._right = Math.max(obj._right, obj.pos[j][0] + 10);
			obj._bottom = Math.max(obj._bottom, obj.pos[j][1] + 10);
		}
		obj._width = obj._right - obj._left;
		obj._height = obj._bottom - obj._top;
		return [obj._left, obj._top, obj._width, obj._height];
	},
	changePosition: function (obj, dl, dt, dw, dh) {},
	drawButton: function (ctx, size, type) {},
	draw: function (ctx, obj, path) {
		ctx.fillStyle = obj.color;
		ctx.save();
		ctx.beginPath();
		draw.fillPath.drawPolygonToCtx(ctx, obj.pos);
		ctx.closePath();

		if (!un(obj.holes)) {
			for (var h = 0; h < obj.holes.length; h++) {
				var hole = obj.holes[h];
				if (hole.holeInHole == true)
					continue;

				draw.fillPath.drawPolygonToCtx(ctx, hole.pos);
				/*ctx.moveTo(hole.pos[0][0],hole.pos[0][1]);
				for (var p = 1; p < hole.pos.length; p++) {
				var pos = hole.pos[p];
				if (pos[2] == true) {
				var pos2 = hole.pos[p+1];
				if (p < hole.pos.length-2) {
				ctx.quadraticCurveTo(pos[0],pos[1],(pos[0]+pos2[0])/2,(pos[1]+pos2[1])/2);
				} else if (p == hole.pos.length-2) {
				ctx.quadraticCurveTo(pos[0],pos[1],pos2[0],pos2[1]);
				}
				} else {
				ctx.lineTo(pos[0],pos[1]);
				}
				}*/

				ctx.closePath();
			}
		}

		ctx.fill();

		/*ctx.beginPath();
		ctx.fillStyle = '#0FF';
		for (var p = 0; p < obj.pos.length; p++) {
		var pos = obj.pos[p];
		ctx.moveTo(pos[0],pos[1]);
		ctx.arc(pos[0],pos[1],10,0,2*Math.PI);
		}
		ctx.fill();*/

		ctx.restore();
	},
	devMode: false,
	outerField: false,
	nodeTolerance: 10,
	fillPolygonAtPoint: function (x, y) {
		//if (un(draw.drawPolygons))
		draw.fillPath.updateDrawPolygons();
		var polygons = draw.drawPolygons;

		for (var p = polygons.length - 1; p >= 0; p--) {
			if (hitTestPolygon2([x, y], polygons[p].pos) == false) {
				polygons.splice(p, 1);
			}
		}
		if (polygons.length > 1) {
			for (var p1 = polygons.length - 1; p1 >= 0; p1--) {
				var poly1 = polygons[p1];
				for (var p2 = polygons.length - 1; p2 >= 0; p2--) {
					var poly2 = polygons[p2];
					if (p1 == p2)
						continue;
					var holeFound = false;
					for (var h = 0; h < poly1.holes.length; h++) {
						if (poly1.holes[h].polygonId == poly2.polygonId) {
							holeFound = true;
							break;
						}
					}
					if (holeFound == true) {
						polygons.splice(p1, 1);
						break;
					}
				}
			}
		}
		if (un(polygons[0]))
			return;
		var polygon = polygons[0];
		if (draw.fillPath.devMode == true)
			console.log(polygon);

		var color = draw.fillColor !== 'none' ? draw.fillColor : '#00F';
		color = colorA(color, 0.5);

		for (var p = 0; p < draw.path.length; p++) { // check if the path already exists
			var path = draw.path[p];
			for (var o = 0; o < path.obj.length; o++) {
				var obj = path.obj[o];
				if (obj.type == 'fillPath') {
					if (samePolygons(polygon.pos, obj.pos)) {
						if (obj.color == color) {
							draw.path.splice(p, 1);
						} else {
							obj.color = color;
						}
						drawCanvasPaths();
						return;
					}
				}
			}
		}

		draw.path.push({
			obj: [{
					type: 'fillPath',
					pos: polygon.pos,
					holes: polygon.holes,
					color: color,
					drawFirst: true
				}
			],
			selected: false,
			trigger: []
		});
		//console.log(draw.path.last().obj[0]);
		drawCanvasPaths();
	},
	updateDrawPolygons: function () {
		//console.clear();

		var nodes = [];
		var edges = [];

		var objects = getObjects();
		getIntersectionPoints(objects);

		if (draw.fillPath.devMode == true) {
			draw.cursorCanvas.ctx.clear();
			console.log('objects:', clone(objects));
		}

		for (var n1 = nodes.length - 1; n1 >= 0; n1--) { // check nodes are unique
			for (var n2 = n1 - 1; n2 >= 0; n2--) {
				if (dist(nodes[n1].pos, nodes[n2].pos) < draw.fillPath.nodeTolerance) {
					nodes.splice(n1, 1);
					break;
				}
			}
		}

		for (var n = 0; n < nodes.length; n++) {
			nodes[n].edges = [];
			nodes[n].nodeId = n;
		}

		var edges = buildEdges(objects);
		if (draw.fillPath.devMode == true)
			console.log('edges:', clone(edges));
		// check edges are unique
		for (var e1 = edges.length - 1; e1 >= 0; e1--) {
			for (var e2 = e1; e2 >= 0; e2--) {
				if (e1 == e2)
					continue;
				var edge1 = edges[e1];
				var edge2 = edges[e2];
				if (edge1.pos.length !== edge2.pos.length)
					continue;
				var matchForward = true;
				var matchBack = true;
				var pMax = edge1.pos.length - 1;
				for (var p = 0; p <= pMax; p++) {
					if (matchForward == true && dist(edge1.pos[p], edge2.pos[p]) > draw.fillPath.nodeTolerance)
						matchForward = false;
					if (matchBack == true && dist(edge1.pos[pMax - p], edge2.pos[p]) > draw.fillPath.nodeTolerance)
						matchBack = false;
					if (matchForward == false && matchBack == false)
						break;
				}
				if (matchForward == true || matchBack == true) {
					edges.splice(e1, 1);
					break;
				}
			}
		}
		for (var e = 0; e < edges.length; e++) {
			var edge1 = clone(edges[e]);
			if (un(edge1.startNode) || un(edge1.finNode) || (edge1.startNode == edge1.finNode && edge1.pos.length == 2)) {
				edges.splice(e, 1);
				e--;
				continue;
			}
			if (!un(nodes[edge1.startNode])) {
				edge1.angle = getAngleTwoPoints(nodes[edge1.startNode].pos, edge1.pos[1]);
				while (edge1.angle < 0)
					edge1.angle += 2 * Math.PI;
				while (edge1.angle >= 2 * Math.PI)
					edge1.angle -= 2 * Math.PI;
				/*if (edge1.pos[0][0] !== nodes[edge1.startNode].pos[0] || edge1.pos[0][1] !== nodes[edge1.startNode].pos[1]) {
				//console.log(edge1.pos[0],nodes[edge1.startNode].pos);
				edge1.pos[0][0] = nodes[edge1.startNode].pos[0];
				edge1.pos[0][1] = nodes[edge1.startNode].pos[1];
				edges[e].pos[0][0] = nodes[edge1.startNode].pos[0];
				edges[e].pos[0][1] = nodes[edge1.startNode].pos[1];
				}*/
				//console.log(e,edge1.startNode,nodes[edge1.startNode].pos,edge1.pos[1],edge1.angle);
				nodes[edge1.startNode].edges.push(edge1);
			}
			var edge2 = clone(edges[e]);
			if (!un(nodes[edge2.finNode])) {
				edge2.angle = getAngleTwoPoints(nodes[edge2.finNode].pos, edge2.pos[edge2.pos.length - 2]);
				while (edge2.angle < 0)
					edge2.angle += 2 * Math.PI;
				while (edge2.angle >= 2 * Math.PI)
					edge2.angle -= 2 * Math.PI;
				/*if (edge1.pos.last()[0] !== nodes[edge1.startNode].pos[0] || edge1.pos.last()[1] !== nodes[edge1.startNode].pos[1]) {
				//console.log(edge1.pos.last(),nodes[edge1.startNode].pos);
				edge2.pos.last()[0] = nodes[edge2.finNode].pos[0];
				edge2.pos.last()[1] = nodes[edge2.finNode].pos[1];
				edges[e].pos[0] = nodes[edge2.finNode].pos[0];
				edges[e].pos[1] = nodes[edge2.finNode].pos[1];
				}*///console.log(e,edge2.finNode,nodes[edge2.finNode].pos,edge2.pos[edge2.pos.length-2],edge2.angle);
				nodes[edge2.finNode].edges.push(edge2);
			}
		}
		for (var n = 0; n < nodes.length; n++) {
			nodes[n].edges.sort(function (a, b) {
				return b.angle - a.angle;
			});
			nodes[n].edgeIds = [];
			for (var e = 0; e < nodes[n].edges.length; e++) {
				nodes[n].edgeIds.push(nodes[n].edges[e].edgeId);
			}
		}

		if (draw.fillPath.devMode == true) {
			drawAllEdges(edges, polygons);
			console.log('edges:', clone(edges));
			console.log('nodes:', clone(nodes));
		}

		var polygons = buildPolygons(objects, edges);

		if (draw.fillPath.devMode == true) {
			console.log('polygons:', clone(polygons));
			//drawAllEdges(edges,polygons);

		}
		draw.drawPolygons = polygons;

		function getObjects() {
			var objects = [];
			if (draw.fillPath.outerField == true) {
				var left = draw.drawArea[0];
				var top = draw.drawArea[1];
				var right = draw.drawArea[0] + draw.drawArea[2];
				var bottom = draw.drawArea[1] + draw.drawArea[3];
				objects.push({
					type: 'polygon',
					pos: [[left, top, false], [right, top, false], [right, bottom, false], [left, bottom, false], [left, top, false]]
				});
			}
			for (var p = 0; p < draw.path.length; p++) {
				var path = draw.path[p];
				if (un(path) || getPathVis(path) == false)
					continue;
				for (var o = 0; o < path.obj.length; o++) {
					var obj = path.obj[o];
					if (typeof obj.trigger !== 'undefined' && draw.ansMode == true && obj.trigger[0] == false && draw.showAns == false)
						continue;
					if (obj.visible === false || obj.vis === false)
						continue;
					if (['line', 'arc', 'circle', 'pen', 'polygon'].includes(obj.type)) {
						if (obj.type == 'line') {
							var pos = [clone(obj.startPos), clone(obj.finPos)];
						} else if (obj.type == 'arc') {
							var pos = clone(draw.fillPath.getPolygonOfArc(obj));
							for (var p2 = 0; p2 < pos.length; p2++)
								pos[p2].push(true);
						} else if (obj.type == 'circle') {
							var pos = clone(draw.fillPath.getPolygonOfCircle(obj));
							for (var p2 = 0; p2 < pos.length; p2++)
								pos[p2].push(true);
						} else if (obj.type == 'pen') {
							var pos = clone(obj.pos);
							for (var p2 = 0; p2 < pos.length; p2++)
								pos[p2].push(true);
						} else if (obj.type == 'polygon') {
							var pos = clone(obj.points);
							pos.push(pos[0]);
						}
						for (var p1 = 0; p1 < pos.length; p1++) {
							pos[p1][0] = roundToNearest(pos[p1][0], 1);
							pos[p1][1] = roundToNearest(pos[p1][1], 1);
						}
						objects.push({
							type: 'polygon',
							pos: pos
						});
					}
				}
			}
			return objects;
		}
		function getIntersectionPoints(objects) {
			for (var o1 = 0; o1 < objects.length; o1++) {
				var obj1 = objects[o1];

				for (var p1 = obj1.pos.length - 2; p1 >= 0; p1--) { // check for self-intersection
					var pos1 = obj1.pos[p1];
					var pos2 = obj1.pos[p1 + 1];
					for (var p2 = p1 - 2; p2 >= 0; p2--) {
						var pos3 = obj1.pos[p2];
						var pos4 = obj1.pos[p2 + 1];

						if (dist(pos1, pos3) < draw.fillPath.nodeTolerance / 5) {
							//if (draw.fillPath.devMode == true) console.log(1,3,p1,p2,pos1,pos3);
							pos1[3] = true;
							pos3[3] = true;
							nodes.push({
								pos: [pos1[0], pos1[1]]
							});
							/*} else if (dist(pos1,pos4) < draw.fillPath.nodeTolerance/5) {
							if (draw.fillPath.devMode == true) console.log(1,4,p1,p2+1,pos1,pos4);
							pos1[3] = true;
							pos4[3] = true;
							nodes.push({pos:[pos1[0],pos1[1]]});*/
						} else if (dist(pos2, pos3) < draw.fillPath.nodeTolerance / 5) {
							//if (draw.fillPath.devMode == true) console.log(2,3,p1+1,p2,pos2,pos3);
							pos2[3] = true;
							pos3[3] = true;
							nodes.push({
								pos: [pos2[0], pos2[1]]
							});
						} else if (dist(pos2, pos4) < draw.fillPath.nodeTolerance / 5) {
							//if (draw.fillPath.devMode == true) console.log(2,4,p1+1,p2+1,pos2,pos4);
							pos2[3] = true;
							pos4[3] = true;
							nodes.push({
								pos: [pos2[0], pos2[1]]
							});
						} else {
							var int = intersection(pos1, pos2, pos3, pos4);
							if (int instanceof Array && isPointOnLineSegment(int, pos1, pos2) == true && isPointOnLineSegment(int, pos3, pos4) == true) {
								int[0] = roundToNearest(int[0], 1);
								int[1] = roundToNearest(int[1], 1);
								nodes.push({
									pos: int
								});
								obj1.pos.splice(p1 + 1, 0, [int[0], int[1], boolean(pos1[2], false), true]);
								obj1.pos.splice(p2 + 1, 0, [int[0], int[1], boolean(pos3[2], false), true]);
							}
						}
					}
				}

				for (var o2 = o1 + 1; o2 < objects.length; o2++) {
					var obj2 = objects[o2];
					for (var p1 = obj1.pos.length - 2; p1 >= 0; p1--) {
						var pos1 = obj1.pos[p1];
						var pos2 = obj1.pos[p1 + 1];
						for (var p2 = obj2.pos.length - 2; p2 >= 0; p2--) {
							var pos3 = obj2.pos[p2];
							var pos4 = obj2.pos[p2 + 1];

							if (dist(pos1, pos3) < draw.fillPath.nodeTolerance) {
								pos1[3] = true;
								pos3[3] = true;
								nodes.push({
									pos: [pos1[0], pos1[1]]
								});
							} else if (dist(pos1, pos4) < draw.fillPath.nodeTolerance) {
								pos1[3] = true;
								pos4[3] = true;
								nodes.push({
									pos: [pos1[0], pos1[1]]
								});
							} else if (dist(pos2, pos3) < draw.fillPath.nodeTolerance) {
								pos2[3] = true;
								pos3[3] = true;
								nodes.push({
									pos: [pos2[0], pos2[1]]
								});
							} else if (dist(pos2, pos4) < draw.fillPath.nodeTolerance) {
								pos2[3] = true;
								pos4[3] = true;
								nodes.push({
									pos: [pos2[0], pos2[1]]
								});
							} else if (p1 == 0 && distancePointToLineSegment(pos1, pos3, pos4) < draw.fillPath.nodeTolerance) {
								pos1[3] = true;
								obj2.pos.splice(p2 + 1, 0, [pos1[0], pos1[1], boolean(pos2[2], false), true]);
								nodes.push({
									pos: [pos1[0], pos1[1]]
								});
							} else if (p1 == obj1.pos.length - 2 && distancePointToLineSegment(pos2, pos3, pos4) < draw.fillPath.nodeTolerance) {
								pos2[3] = true;
								obj2.pos.splice(p2 + 1, 0, [pos2[0], pos2[1], boolean(pos2[2], false), true]);
								nodes.push({
									pos: [pos2[0], pos2[1]]
								});
							} else if (p2 == 0 && distancePointToLineSegment(pos3, pos1, pos2) < draw.fillPath.nodeTolerance) {
								pos3[3] = true;
								obj1.pos.splice(p1 + 1, 0, [pos3[0], pos3[1], boolean(pos1[2], false), true]);
								nodes.push({
									pos: [pos3[0], pos3[1]]
								});
							} else if (p2 == obj2.pos.length - 2 && distancePointToLineSegment(pos4, pos1, pos2) < draw.fillPath.nodeTolerance) {
								pos4[3] = true;
								obj1.pos.splice(p1 + 1, 0, [pos4[0], pos4[1], boolean(pos1[2], false), true]);
								nodes.push({
									pos: [pos4[0], pos4[1]]
								});
							} else {
								var int = intersection(pos1, pos2, pos3, pos4);
								if (int instanceof Array && isPointOnLineSegment(int, pos1, pos2) == true && isPointOnLineSegment(int, pos3, pos4) == true) {
									int[0] = roundToNearest(int[0], 1);
									int[1] = roundToNearest(int[1], 1);
									nodes.push({
										pos: int
									});
									obj1.pos.splice(p1 + 1, 0, [int[0], int[1], boolean(pos1[2], false), true]);
									obj2.pos.splice(p2 + 1, 0, [int[0], int[1], boolean(pos2[2], false), true]);
									p1 += 2;
									break;
								}
							}
						}
					}

				}
			}
		}

		function buildEdges(objects) {
			var edges = [];
			for (var o = 0; o < objects.length; o++) {
				var obj = objects[o];
				var nodeIndex = -1;
				var lastNode;
				var edge = [];
				for (var p = 0; p < obj.pos.length; p++) {
					var pos = obj.pos[p];
					if (nodeIndex > -1 || pos[3] == true)
						edge.push(clone(pos));
					if (pos[3] == true) {
						if (edge.length > 1) {
							startNode = lastNode.nodeId;
							finNode = getNode(pos).nodeId;
							edges.push({
								type: 'polygon',
								pos: clone(edge),
								startNode: startNode,
								finNode: finNode,
								edgeId: edges.length
							});
							edge = [pos];
						}
						nodeIndex++;
						lastNode = getNode(pos);
					}
				}
			}
			return edges;
		}
		function getNode(pos) {
			for (var n = 0; n < nodes.length; n++) {
				if (dist(pos, nodes[n].pos) < draw.fillPath.nodeTolerance) {
					return nodes[n];
				}
			}
			return false;
		}
		function getNodeNextEdge(node, edgeId) {
			if (un(node))
				return false;
			if (un(edgeId))
				return node.edges[0];
			var index = node.edgeIds.indexOf(edgeId);
			if (index == -1)
				return false;
			var index2 = index;
			do {
				var index2 = (index2 + 1) % node.edges.length;
				if (index == index2)
					return false;
				var next = clone(node.edges[index2]);
			} while (un(next.startNode) || un(next.finNode));
			return next;
		}
		function buildPolygons(objects, edges) {
			var polygons = [];
			for (var n = 0; n < nodes.length; n++) {
				for (var e = 0; e < nodes[n].edges.length; e++) {
					var startNodeId = n;
					var nodeIds = [n];
					var edge = clone(nodes[n].edges[e]);
					if (edge.startNode == startNodeId) {
						nodeIds.push(edge.finNode);
					} else if (edge.finNode == startNodeId) {
						nodeIds.push(edge.startNode);
						edge.pos.reverse();
						edge.reversed = true;
					}
					var polygon = [edge];
					var edgeIds = [edge.edgeId];
					var count = 0;
					while (nodeIds.last() !== startNodeId && count < 999) {
						var edge = getNodeNextEdge(nodes[nodeIds.last()], edgeIds.last());
						if (edge.startNode == nodeIds.last()) {
							nodeIds.push(edge.finNode);
						} else if (edge.finNode == nodeIds.last()) {
							nodeIds.push(edge.startNode);
							edge.pos.reverse();
							edge.reversed = true;
						}
						polygon.push(edge);
						edgeIds.push(edge.edgeId);
						count++;
					}
					if (nodeIds.last() !== startNode.nodeId) {
						polygons.push({
							edges: polygon,
							holes: [],
							edgeIds: edgeIds,
							nodeIds: nodeIds
						});
					}
				}
			}

			if (draw.fillPath.devMode == true)
				console.log(clone(polygons));

			for (var p1 = polygons.length - 1; p1 >= 0; p1--) { // remove duplicate polygons
				var poly1 = polygons[p1];
				for (var p2 = polygons.length - 1; p2 >= 0; p2--) {
					if (p1 == p2)
						continue;
					var poly2 = polygons[p2];
					if (poly1.edges.length >= poly2.edges.length) {
						var countMatchingSides = 0;
						for (var p3 = 0; p3 < poly1.edges.length; p3++) {
							var edge1 = poly1.edges[p3];
							for (var p4 = 0; p4 < poly2.edges.length; p4++) {
								var edge2 = poly2.edges[p4];
								if (edge1.edgeId == edge2.edgeId) {
									countMatchingSides++;
									break;
								}
							}
						}
						if (countMatchingSides == poly2.edges.length) {
							polygons.splice(p1, 1);
							break;
						}
					}
				}
			}

			if (draw.fillPath.devMode == true)
				console.log(clone(polygons));

			for (var p = 0; p < polygons.length; p++) {
				var polygon = polygons[p];
				polygon.polygonId = p;
				var pos = []; // combine edges
				for (var p2 = 0; p2 < polygon.edges.length; p2++) {
					pos = pos.concat(polygon.edges[p2].pos);
				}
				for (var p2 = 0; p2 < pos.length; p2++) {
					var p3 = (p2 + 1) % pos.length;
					if (un(pos[p2]) || un(pos[p3]))
						continue;
					if (pos[p2][0] == pos[p3][0] && pos[p2][1] == pos[p3][1])
						pos.splice(p3, 1);
				}
				while (pos.indexOf(undefined) > -1) {
					pos.splice(pos.indexOf(undefined), 1);
				}
				if (polygonClockwiseTest(pos) == false)
					pos.reverse();
				polygon.pos = pos;
			}
			if (draw.fillPath.devMode == true)
				console.log(clone(polygons));

			var holeIds = [];
			for (var p1 = polygons.length - 1; p1 >= 0; p1--) {
				var poly1 = polygons[p1];
				for (var p2 = p1 - 1; p2 >= 0; p2--) {
					var poly2 = polygons[p2];
					if (draw.fillPath.devMode == true)
						console.log(p1, p2);
					if (draw.fillPath.devMode == true)
						console.log(poly1.edgeIds, poly2.edgeIds);
					var comp = comparePolygons(poly1, poly2);
					if (draw.fillPath.devMode == true)
						console.log(comp.type, comp);
					switch (comp.type) {
					case 'same':
						polygons.splice(p1, 1);
						p2 = -1;
						break;
					case 'poly1HoleOfPoly2':
						var hole = {
							pos: clone(poly1.pos).reverse(),
							polygonId: poly1.polygonId
						};
						poly2.holes.push(hole);
						holeIds.push([poly2.polygonId, poly1.polygonId]);
						break;
					case 'poly2HoleOfPoly1':
						var hole = {
							pos: clone(poly2.pos).reverse(),
							polygonId: poly2.polygonId
						};
						poly1.holes.push(hole);
						holeIds.push([poly1.polygonId, poly2.polygonId]);
						break;
					case 'poly1SubOfPoly2':
						polygons.splice(p2, 1);
						p1--;
						poly1 = polygons[p1];
						break;
					case 'poly2SubOfPoly1':
						polygons.splice(p1, 1);
						p2 = -1;
						break;
					case 'none':
					case 'adjacent':
						break;
					}
				}
			}
			//console.log(holeIds);
			if (draw.fillPath.devMode == true)
				console.log(clone(polygons));
			var polygonIds = [];
			for (var p1 = 0; p1 < polygons.length; p1++) {
				polygonIds.push(polygons[p1].polygonId);
			}
			for (var p1 = 0; p1 < polygons.length; p1++) {
				var holes = polygons[p1].holes;
				for (var h1 = holes.length - 1; h1 >= 0; h1--) {
					var poly1 = holes[h1];
					if (polygonIds.indexOf(poly1.polygonId) == -1) {
						holes.splice(h1, 1);
					}
				}
			}

			for (var p1 = polygons.length - 1; p1 >= 0; p1--) {
				var holes = polygons[p1].holes;
				if (holes.length < 2)
					continue;
				for (var h1 = holes.length - 1; h1 >= 0; h1--) {
					var poly1 = holes[h1];
					for (var h2 = holes.length - 1; h2 >= 0; h2--) {
						if (h1 == h2)
							continue;
						var poly2 = holes[h2];
						for (var h3 = 0; h3 < holeIds.length; h3++) {
							if (holeIds[h3][0] == poly2.polygonId && holeIds[h3][1] == poly1.polygonId) {
								poly1.holeInHole = true;
								//console.log(poly2.polygonId,'has hole:',poly1.polygonId);
								h2 = -1;
								break;
							}
						}
					}
				}
			}
			return polygons;
		}

		function comparePolygons(polygon1, polygon2) {
			var poly1 = clone(polygon1);
			var poly2 = clone(polygon2);
			var comp = {
				edgesCommon: [],
				verticesCommon: [],
				type: 'none',
				poly1: poly1,
				poly2: poly2
			};
			for (var p3 = 0; p3 < poly1.edges.length; p3++) {
				var edge1 = poly1.edges[p3];
				for (var p4 = 0; p4 < poly2.edges.length; p4++) {
					var edge2 = poly2.edges[p4];
					if (edge1.edgeId == edge2.edgeId) {
						comp.edgesCommon.push(edge1.edgeId);
					}
				}
			}
			for (var p3 = 0; p3 < poly1.pos.length; p3++) {
				var pos1 = poly1.pos[p3];
				for (var p4 = 0; p4 < poly2.pos.length; p4++) {
					var pos2 = poly2.pos[p4];
					if (pos1[0] == pos2[0] && pos1[1] == pos2[1] || dist(pos1, pos2) < 3) {
						comp.verticesCommon.push([pos1[0], pos1[1]]);
						pos1[5] = true;
						pos2[5] = true;
					}
				}
			}

			if (poly1.edgeIds.length == poly2.edgeIds.length && comp.edgesCommon.length == poly2.edgeIds.length) {
				comp.type = 'same';
			} else if (comp.edgesCommon.length == 0) {
				for (var p = 0; p < poly1.pos.length; p++) {
					var pos1 = poly1.pos[p];
					var pos2 = poly1.pos[(p + 1) % poly1.pos.length];
					if (pos1[5] !== true && pointInPolygon(pos1, poly2.pos, false) == true) {
						comp.poly1HasPointInsidePoly2 = true;
						comp.poly1PointInPoly2 = pos1;
						break;
					}
				}
				for (var p = 0; p < poly2.pos.length; p++) {
					var pos1 = poly2.pos[p];
					var pos2 = poly2.pos[(p + 1) % poly2.pos.length]
						if (pos1[5] !== true && pointInPolygon(pos1, poly1.pos, false) == true) {
							comp.poly2HasPointInsidePoly1 = true;
							comp.poly2PointInPoly1 = pos1;
							break;
						}
				}
				if (comp.poly1HasPointInsidePoly2 == true) {
					comp.type = 'poly1HoleOfPoly2';
				} else if (comp.poly2HasPointInsidePoly1 == true) {
					comp.type = 'poly2HoleOfPoly1';
				}
			} else {
				var pos1 = poly1.pos;
				var pos2 = poly2.pos;

				var aInsideB = false;
				var aOutsideB = false;
				for (var p1 = 0; p1 < pos1.length; p1++) {
					if (aInsideB == true && aOutsideB == true)
						break;
					var curr = pos1[p1];
					for (var p2 = 0; p2 < pos2.length; p2++) {
						if (dist(pos2[p2], curr) < 3) {
							curr[8] = 0;
							break;
						}
					}
					if (curr[8] !== 0) {
						if (pointDistToPolygonBoundary(curr, pos2) < 3) {
							curr[8] = 0;
						} else if (pointInPolygon(curr, pos2, false) == true) {
							curr[8] = 1;
							aInsideB = true;
							continue;
						}
					}
					var next = pos1[(p1 + 1) % pos1.length];
					var mid = [(curr[0] + next[0]) / 2, (curr[1] + next[1]) / 2];
					if (pointDistToPolygonBoundary(mid, pos2) < 3) {
						curr[8] = 0;
					} else if (pointInPolygon(mid, pos2, false) == true) {
						curr[8] = 1;
						aInsideB = true;
						continue;
					}
					curr[8] = -1;
					aOutsideB = true;
				}

				var bInsideA = false;
				var bOutsideA = false;
				for (var p2 = 0; p2 < pos2.length; p2++) {
					if (bInsideA == true && bOutsideA == true)
						break;
					var curr = pos2[p2];
					for (var p1 = 0; p1 < pos1.length; p1++) {
						if (dist(pos1[p1], curr) < 3) {
							curr[8] = 0;
							break;
						}
					}
					if (curr[8] !== 0) {
						if (pointDistToPolygonBoundary(curr, pos1) < 3) {
							curr[8] = 0;
						} else if (pointInPolygon(curr, pos1, false) == true) {
							curr[8] = 1;
							bInsideA = true;
							continue;
						}
					}
					var next = pos2[(p2 + 1) % pos2.length];
					var mid = [(curr[0] + next[0]) / 2, (curr[1] + next[1]) / 2];
					if (pointDistToPolygonBoundary(mid, pos1) < 3) {
						curr[8] = 0;
					} else if (pointInPolygon(mid, pos1, false) == true) {
						curr[8] = 1;
						bInsideA = true;
						continue;
					}
					curr[8] = -1;
					bOutsideA = true;
				}

				if (draw.fillPath.devMode == true) {
					console.log(aInsideB);
					console.log(aOutsideB);
					console.log(bInsideA);
					console.log(bOutsideA);
				}

				if (aInsideB == true && bOutsideA == true) {
					comp.type = 'poly1SubOfPoly2';
				} else if (bInsideA == true && aOutsideB == true) {
					comp.type = 'poly2SubOfPoly1';
				} else {
					comp.type = 'adjacent';
				}
			}
			return comp;

		}

		function getPointInsidePolygon(polygon) {
			var xMin = polygon[0][0];
			var xMax = polygon[0][0];
			var yMin = polygon[0][1];
			var yMax = polygon[0][1];
			for (var p = 1; p < polygon.length; p++) {
				xMin = Math.min(xMin, polygon[p][0]);
				xMax = Math.max(xMax, polygon[p][0]);
				yMin = Math.min(yMin, polygon[p][1]);
				yMax = Math.max(yMax, polygon[p][1]);
			}
			var pos2 = false;
			var minDist = 0;
			var count = 0;
			var foundCount = 0;
			do {
				var pos = [xMin + Math.random() * (xMax - xMin), yMin + Math.random() * (yMax - yMin)];
				var inPolygon = pointInPolygon(pos, polygon, false);
				if (inPolygon == true) {
					var posDist = pointDistToPolygonBoundary(pos, polygon);
					if (posDist > minDist) {
						pos2 = pos;
						minDist = posDist;
					}
					foundCount++;
				}
				count++;
			} while (foundCount < 40 && count < 1000);
			return pos2;
		}
		function pointDistToPolygonBoundary(point, pos) {
			var dist = 100000;
			for (var p = 0; p < pos.length; p++) {
				var pos1 = pos[p];
				var pos2 = pos[(p + 1) % pos.length];
				var dist = Math.min(dist, distancePointToLineSegment(point, pos1, pos2));
			}
			return dist;
		}
		function polygonHoleOfPolygon(polygon1, polygon2) {
			// is polygon1 a hole of polygon2? (with no edges in common)
			if (polygonsEdgeInCommon(polygon1, polygon2) == true)
				return false;
			if (polygonInsidePolygon(polygon1.pos, polygon2.pos, false))
				return true;
			return false;
		}
		function polygonSubOfPolygon(polygon1, polygon2) {
			// is polygon1 a part of polygon2? (with at least one edge in common)
			if (polygonsEdgeInCommon(polygon1, polygon2) == false)
				return false;
			if (polygonInsidePolygon(polygon1.pos, polygon2.pos, true))
				return true;
			return false;
		}
		function polygonsEdgeInCommon(polygon1, polygon2) {
			for (var e1 = 0; e1 < polygon1.edgeIds.length; e1++) {
				for (var e2 = 0; e2 < polygon2.edgeIds.length; e2++) {
					if (polygon1.edgeIds[e1] == polygon2.edgeIds[e2])
						return true;
				}
			}
			return false;
		}
		function polygonInsidePolygon(polygon1, polygon2, includeBoundary) {
			// is polygon1 inside polygon2
			if (pointInPolygon(polygon1[0], polygon2, includeBoundary) == false)
				return false;
			for (var i = 0; i < polygon1.length; i++) {
				var line1 = [polygon1[i], polygon1[(i + 1) % polygon1.length]];
				for (var j = 0; j < polygon2.length; j++) {
					var line2 = [polygon2[j], polygon2[(j + 1) % polygon2.length]];
					if (lineSegmentsIntersectionTest(line1, line2) == true) {
						if (includeBoundary == false)
							return false;
						var p3 = isPointOnLineSegment(line1[0], line2[0], line2[1]);
						var p4 = isPointOnLineSegment(line1[1], line2[0], line2[1]);
						if (p3 == false && p4 == false)
							return false;
						if (p3 == true && p4 == true)
							continue; // edge is part of edge
						if (p3 == true && p4 == false && pointInPolygon(line1[1], polygon2, true) == false)
							return false;
						if (p3 == false && p4 == true && pointInPolygon(line1[0], polygon2, true) == false)
							return false;
					}
				}
			}
			return true;
		}
		function polygonsVertexInCommon(polygon1, polygon2) {
			for (var e1 = 0; e1 < polygon1.pos.length; e1++) {
				for (var e2 = 0; e2 < polygon2.pos.length; e2++) {
					if (dist(polygon1.pos[e1], polygon2.pos[e2]) < 0.1)
						return true;
				}
			}
			return false;
		}
		function pointInPolygon(point, pos, includeBoundary) {
			//https://stackoverflow.com/questions/8721406/how-to-determine-if-a-point-is-inside-a-2d-convex-polygon/23223947#23223947
			var result = false;
			for (var i = 0, j = pos.length - 1; i < pos.length; j = i++) {
				if ((pos[i][1] > point[1]) != (pos[j][1] > point[1]) &&
					(point[0] < (pos[j][0] - pos[i][0]) * (point[1] - pos[i][1]) / (pos[j][1] - pos[i][1]) + pos[i][0])) {
					result = !result;
				}
			}
			if (result == false && includeBoundary == true) {
				return pointOnPolygonBoundary(point, pos);
			}
			return result;
		}
		function pointOnPolygonBoundary(point, pos, tol) {
			if (un(tol))
				tol = 0.01;
			for (var p = 0; p < pos.length; p++) {
				var pos1 = pos[p];
				var pos2 = pos[(p + 1) % pos.length];
				if (isPointOnLineSegment(point, pos1, pos2, tol) == true)
					return true;
			}
			return false;
		}

		function getMeanPoint(polygon) {
			var total = [0, 0];
			for (var i = 0; i < polygon.length; i++) {
				total[0] += polygon[i][0];
				total[1] += polygon[i][1];
			}
			return [total[0] / polygon.length, total[1] / polygon.length];
		}
		function drawAllEdges(edges, polygons) { // for dev only
			var ctx = draw.cursorCanvas.ctx;
			//ctx.clear();
			var colors = ['#A00', '#00A', '#0A0', '#AA0', '#A0A', '#0AA', '#066', '#606', '#066', '#660', '#660', '#606'];
			/*
			for (var p = 0; p < polygons.length; p++) {
			var pos = polygons[p].pos;
			ctx.beginPath();
			ctx.lineWidth = 5;
			var color = colors[p%colors.length];
			ctx.fillStyle = colorA(color,0.4);
			draw.fillPath.drawPolygonToCtx(ctx,pos);
			ctx.fill();
			}//*/
			//*
			for (var e = 0; e < edges.length; e++) {
				var edge = edges[e];
				ctx.beginPath();
				ctx.lineWidth = 5;
				var color = colors[e % colors.length];
				ctx.strokeStyle = color;
				draw.fillPath.drawPolygonToCtx(ctx, edge.pos);
				ctx.stroke();

				var mid = draw.fillPath.getPolygonMidPoint(edge.pos);
				text({
					ctx: ctx,
					text: ['<<color:' + color + '>>' + String(edge.edgeId)],
					rect: [mid[0] - 50, mid[1] - 50, 100, 100],
					align: [0, 0],
					box: {
						type: 'tight',
						color: '#FFF',
						borderColor: color,
						borderWidth: 2
					}
				});
			} //*/
			//*
			for (var n = 0; n < nodes.length; n++) {
				var pos = nodes[n].pos;
				ctx.beginPath();
				ctx.fillStyle = '#F00';
				ctx.moveTo(pos[0], pos[1]);
				ctx.arc(pos[0], pos[1], 8, 0, 2 * Math.PI);
				ctx.fill();

				var mid = draw.fillPath.getPolygonMidPoint(pos);
				text({
					ctx: ctx,
					text: ['<<color:#F00>>' + String(nodes[n].nodeId)],
					rect: [pos[0] + 20, pos[1] - 50, 50, 100],
					align: [0, 0],
					box: {
						type: 'tight',
						color: '#FCF',
						borderColor: '#F00',
						borderWidth: 2,
						radius: 30
					}
				});
			} //*/

		}
	},
	drawPolygonToCtx: function (ctx, pos) {
		ctx.moveTo(pos[0][0], pos[0][1]);
		for (var p = 1; p < pos.length; p++) {
			ctx.lineTo(pos[p][0], pos[p][1]);
			if (pos[p - 1][2] == true && pos.length > 2) {
				if (p < pos.length - 1) {
					ctx.quadraticCurveTo(pos[p][0], pos[p][1], (pos[p][0] + pos[p + 1][0]) / 2, (pos[p][1] + pos[p + 1][1]) / 2);
				} else {
					ctx.quadraticCurveTo(pos[p][0], pos[p][1], pos[p - 1][0], pos[p - 1][1]);
				}
			} else {
				ctx.lineTo(pos[p][0], pos[p][1]);
			}
		}
		ctx.lineTo(pos.last()[0], pos.last()[1]);
	},
	getPolygonMidPoint: function (pos) {
		if (pos.length % 2 == 1) {
			return pos[Math.floor(pos.length / 2)];
		} else {
			var pos1 = pos[pos.length / 2 - 1];
			var pos2 = pos[pos.length / 2];
			return [(pos1[0] + pos2[0]) / 2, (pos1[1] + pos2[1]) / 2];
		}
	},
	getPolygonOfArc: function (arc, radianSeperation) {
		if (un(radianSeperation)) {
			radianSeperation = 0.2;
			//radianSeperation = Math.acos(1-(6*6)/(2*arc.radius*arc.radius));
			//console.log(radianSeperation);
		}
		var a1 = arc.startAngle;
		var a2 = arc.finAngle;
		var polygon = [];
		var a = a1;
		if (arc.circle == true) {
			a = 2 * Math.PI;
			while (a > radianSeperation) {
				addPos(a);
				a -= radianSeperation;
			}
		} else if (arc.clockwise == false) {
			if (a2 > a1)
				a2 -= 2 * Math.PI;
			while (a > a2 + radianSeperation) {
				addPos(a);
				a -= radianSeperation;
			}
		} else {
			if (a2 < a1)
				a2 += 2 * Math.PI;
			while (a < a2 - radianSeperation) {
				addPos(a);
				a += radianSeperation;
			}
		}
		addPos(a2);
		return polygon;

		function addPos(a) {
			polygon.push([
					arc.center[0] + arc.radius * Math.cos(a),
					arc.center[1] + arc.radius * Math.sin(a)
				]);
		}
	},
	getPolygonOfCircle: function (circle, radianSeperation) {
		if (un(radianSeperation))
			radianSeperation = 0.2;
		var polygon = [];
		var a = 2 * Math.PI;
		while (a > radianSeperation) {
			addPos(a);
			a -= radianSeperation;
		}
		addPos(0);
		return polygon;

		function addPos(a) {
			polygon.push([
					circle.center[0] + circle.radius * Math.cos(a),
					circle.center[1] + circle.radius * Math.sin(a)
				]);
		}
	}
}
