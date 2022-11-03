//Javascript document

/***************************/
/*   LOAD, SAVE, EXPORT    */
/***************************/

function png(sf,crop) {
	if (draw.path.length == 0) return
	if (typeof sf == 'undefined') sf = 1;
	if (typeof crop == 'undefined') crop = false;
	deselectAllPaths();

	if (crop == false) {
		var canvas = drawPathsToCanvas(undefined,draw.path,undefined,sf);
		//window.open(canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"),'_blank');
	} else {
		var l,t,r,b;
		for (var p = 0; p < draw.path.length; p++) {
			if (un(l)) {
				l = draw.path[p].border[0];
				t = draw.path[p].border[1];
				r = draw.path[p].border[4];
				b = draw.path[p].border[5];
			} else {
				l = Math.min(l,draw.path[p].border[0]);
				t = Math.min(t,draw.path[p].border[1]);
				r = Math.max(r,draw.path[p].border[4]);
				b = Math.max(b,draw.path[p].border[5]);
			}
		}
		var canvas2 = drawPathsToCanvas(undefined,draw.path,undefined,sf);
		var canvas = newctx({rect:[0,0,r-l,b-t],vis:false}).canvas;
		canvas.ctx.drawImage(canvas,-l,-t);
		//window.open(canvas2.toDataURL("image/png"),'_blank');
	}
	
	saveCanvasAsPNG(canvas,'img.png');
}
function pngPath(path,sf,crop) {
	if (un(path)) var path = draw.path;
	if (draw.path.length == 0) return
	if (un(sf)) sf = 1;
	if (un(crop)) crop = false;
	deselectAllPaths();

	if (crop == false) {
		var canvas = drawPathsToCanvas(undefined,path,undefined,sf);
		window.open(canvas.toDataURL("image/png"),'_blank');
	} else {
		var l,t,r,b;
		for (var p = 0; p < path.length; p++) {
			if (un(l)) {
				l = path[p].tightBorder[0];
				t = path[p].tightBorder[1];
				r = path[p].tightBorder[4];
				b = path[p].tightBorder[5];
			} else {
				l = Math.min(l,path[p].tightBorder[0]);
				t = Math.min(t,path[p].tightBorder[1]);
				r = Math.max(r,path[p].tightBorder[4]);
				b = Math.max(b,path[p].tightBorder[5]);
			}
		}
		var canvas2 = drawPathsToCanvas(undefined,path,undefined,sf);
		var canvas = newctx({rect:[0,0,r-l,b-t],vis:false}).canvas;
		canvas.ctx.drawImage(canvas2,-l,-t);
		window.open(canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"),'_blank');
		//window.open(canvas.toDataURL("image/png"),'_blank');
	}
	
	//saveCanvasAsPNG(canvas,'img.png');
}

if (un(draw)) var draw = {};
draw.loadPaths = function(url,callback,index,setDrawPaths) {
	loadScript(url,function(index) {
		var paths = clone(fileData);
		delete window.fileData;
		draw.convertLoadedPaths(paths);
		if (boolean(setDrawPaths,true) == true) {
			clearDrawPaths();		
			draw.path = !un(paths) ? paths : [];
			draw.updateAllBorders();
			drawCanvasPaths();
			draw.undo.reset();
		}
		if (typeof callback == 'function') callback(index,paths);
		return paths;
	},undefined,index);
}
draw.convertLoadedPaths = function(paths) {
	if (typeof paths == 'undefined') paths = draw.path;
	for (var p = paths.length-1; p >= 0; p--) {
		var path = paths[p];
		path.selected = false;
		//delete path.qBox;
		if (!un(path.trigger) && path.trigger.length == 0) delete path.trigger;
		for (var o = path.obj.length-1; o >= 0; o--) {
			if (un(path.obj[o])) {
				console.log(o,path.obj);
				continue;
			}
			var obj = path.obj[o];
			switch (obj.type) {
				case 'text':
					path.obj[o] = draw.convertTextToText2(obj);
					break;
				case 'text2':
					draw.text2.extractStartTags(obj);
					break;
				case 'input':
				case 'button':
				case 'multChoice':
					path.obj.splice(o,1);
					break;
				case 'table':
				case 'table2':
					path.obj[o] = draw.convertTable(obj);
					break;
				case 'image':
					draw.loadImage(obj);
					break;
			}
		}
		if (path.obj.length == 0) path.splice(p,1);
	}
	return paths;
}
draw.convertTextToText2 = function(obj) {
	var align = [-1,-1];
	if (obj.mathsInput.textAlign == 'left') align[0] = -1;
	if (obj.mathsInput.textAlign == 'center') align[0] = 0;
	if (obj.mathsInput.textAlign == 'right') align[0] = 1;
	if (obj.mathsInput.vertAlign == 'top') align[1] = -1;
	if (obj.mathsInput.vertAlign == 'middle') align[1] = 0;
	if (obj.mathsInput.vertAlign == 'bottom') align[1] = 1;
	
	var txt = obj.mathsInput.richText;
	txt = textArrayReplace(txt,'<<br>>',br);
	txt = textArrayReplace(txt,'Segoe Print','segoePrint');
	
	var rect = [obj.left,obj.top,obj.width,obj.height];
	//console.log('---',obj,obj.mathsInput,obj.mathsInput.leftPoint)
	if (!un(obj.mathsInput.leftPoint)) {
		rect[0] += obj.mathsInput.leftPoint;
		rect[1] += obj.mathsInput.leftPoint;
		rect[2] -= obj.mathsInput.leftPoint;
	}
	
	var obj2 = {
		type:'text2',
		text:txt,
		rect:rect,
		align:align
	}
	
	if (obj.showBorder == true) {
		obj2.box = {type:'loose'};
		if (!un(obj.fillColor)) obj2.box.color = obj.fillColor;
		if (!un(obj.color)) obj2.box.borderColor = obj.color;
		if (!un(obj.thickness)) obj2.box.borderWidth = obj.thickness;
		if (!un(obj.radius)) obj2.box.radius = obj.radius;
	}
	var keysToKeep = ['pathPin','trigger'];
	for (var k = 0; k < keysToKeep.length; k++) {
		if (!un(obj[keysToKeep[k]])) obj2[keysToKeep[k]] = obj[keysToKeep[k]];
	}
	return obj2;	
}
draw.convertTable = function(obj) {
	if (!un(obj.mInputs)) {
		for (var r = 0; r < obj.mInputs.length; r++) {
			for (var c = 0; c < obj.mInputs[r].length; c++) {
				var m = obj.mInputs[r][c];
				var txt = m.richText;
				txt = textArrayReplace(txt,'<<br>>',br);
				txt = textArrayReplace(txt,'Segoe Print','segoePrint');
				obj.cells[r][c].text = txt;
				var align = [0,0];
				if (m.textAlign == 'left' || m.align == 'left') align[0] = -1;
				if (m.textAlign == 'right' || m.align == 'right') align[0] = 1;
				if (m.vertAlign == 'top') align[1] = -1;
				if (m.vertAlign == 'bottom') align[1] = 1;
				obj.cells[r][c].align = align;
				obj.cells[r][c].padding = 10;
			}
		}
	}
	if (obj.type == 'table') {
		obj.widths = [];
		obj.heights = [];
		for (var x = 0; x < obj.xPos.length-1; x++) obj.widths[x] = obj.xPos[x+1] - obj.xPos[x];
		for (var y = 0; y < obj.yPos.length-1; y++) obj.heights[y] = obj.yPos[y+1] - obj.yPos[y];
		obj.type = 'table2';
	}
	delete obj.cell;
	delete obj.mInputs;
	return obj;	
}
draw.loadImage = function(obj) {
	obj.image = new Image;
	obj.image.onload = function() {
		drawCanvasPaths();
	}
	if (!un(obj.src)) {
		obj.image.src = obj.src;
	} else if (!un(obj.filename)) {
		obj.image.src = 'images/'+obj.filename;
	}
}
draw.savePaths = function(filePath,fileName,pngData,paths,callback) {
	if (un(paths)) var paths = clone(draw.path);
	/*var drawPaths = 'var fileData = '+JSON.stringify(paths,function(key,value) {
		if (['borderButtons','border','tightBorder','selected','ctx','qBox',"data","cursorData","textLoc","cursorPos","cursorMap","allMap","canvas","ctx","cursorCanvas","cursorctx","startText","startRichText","startTags","stringJS","currBackColor","preText","postText"].includes(key)) return undefined;
		if (typeof value == 'number') return Number(value.toFixed(3));
		return value;
	});*/
	var drawPaths = draw.stringifyDrawPaths(paths);
	var params = "filePath="+encodeURIComponent(filePath)+"&fileName="+encodeURIComponent(fileName)+"&drawPaths="+encodeURIComponent(drawPaths);
	
	if (un(pngData)) {
		var canvas = drawPathsToCanvas(undefined,draw.path,undefined,0.15);
		var pngData = canvas.toDataURL("image/png");
	}
	params += "&pngData="+encodeURIComponent(pngData);	
	console.log(filePath,fileName);
	
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("post", "/i2/draw_savePaths.php", true);
	xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlHttp.onreadystatechange = function() {
		if (this.readyState == 4) {
			var response = this.responseText == 'true' ? true : false;
			console.log('saved:',response);
			if (response == false) console.log(drawPaths);
			if (!un(callback)) callback();
		}
	}
	xmlHttp.send(params);
}
draw.stringifyDrawPaths = function(paths,includeVarFileData) {
	if (un(paths)) paths = draw.path;
	paths = draw.compressPaths(paths);
	var str = draw.stringify(paths);
	if (boolean(includeVarFileData,true) == true) str = 'var fileData = '+str;
	return str;
}
draw.compressPaths = function(paths) {
	//paths = clone(paths);
	for (var p = paths.length-1; p >= 0; p--) {
		var path = paths[p];
		draw.compressPath(path);
		if (path.obj.length == 0) paths.splice(p,1);
	}
	//console.log(paths);
	return paths;
}
draw.compressPath = function(path) {
	function isEmpty(obj) {
		for(var key in obj) {
			if(obj.hasOwnProperty(key))
				return false;
		}
		return true;
	}
	if (!un(path.isInput) && isEmpty(path.isInput)) delete path.isInput;
	if (!un(path.interact) && isEmpty(path.interact)) delete path.interact;
	for (var o = path.obj.length-1; o >= 0; o--) {
		var obj = path.obj[o];
		if (!un(obj.interact) && isEmpty(obj.interact)) delete obj.interact;
		var deleteProperties = ['edit','drawing','textEdit'];
		if (obj.type == 'text2') {
			if ((un(obj.text) || textArrayCheckIfEmpty(obj.text)) && un(obj.id) && (un(obj.box) || obj.box.type == 'none')) {
				path.obj.splice(o,1);
				continue;
			}
			var tags = clone(defaultTags);
			if (!un(obj.align)) tags.align = obj.align == -1 ? 'left' : obj.align == 1 ? 'right' : 'center'; 
			if (!un(obj.text)) {
				obj.text = simplifyText(obj.text);
				obj.text = textArrayRemoveDefaultTags(obj.text,tags);
				obj.text = removeTagsOfType(obj.text,'selected');
			}
			deleteProperties.push('tightRect');
		} else if (obj.type == 'table2') {
			deleteProperties.push('rows','cols','xPos','yPos','width','height','drawing','minCellWidth','minCellHeight','horizAlign');
			var deleteCellProperties = ['minWidth','minHeight','highlight','selected','styled','tightRect'];
			var cells = draw.table2.getAllCells(obj);
			var tags = clone(defaultTags);
			if (!un(obj.text)) {
				if (!un(obj.text.font)) tags.font = obj.text.font;
				if (!un(obj.text.size)) tags.fontSize = obj.text.size;
				if (!un(obj.text.color)) tags.color = obj.text.color;
			}
			for (var c = 0; c < cells.length; c++) {
				for (var d = 0; d < deleteCellProperties.length; d++) delete cells[c][deleteCellProperties[d]];
				if (!un(cells[c].trigger) && cells[c].trigger.length == 0) delete cells[c].trigger;
				if (cells[c].color == 'none') delete cells[c].color;
				if (!un(cells[c].box) && cells[c].box.type == 'none') delete cells[c].box;
				if (!un(cells[c].box) && (cells[c].box.color == 'none' && cells[c].box.borderColor == 'none')) delete cells[c].box;
				if (!un(cells[c].text)) {
					var cellTags = clone(tags);
					if (!un(cells[c].align)) cellTags.align = cells[c].align[0] == -1 ? 'left' : cells[c].align[0] == 1 ? 'right' : 'center';
					cells[c].text = simplifyText(cells[c].text);
					cells[c].text = textArrayRemoveDefaultTags(cells[c].text,cellTags);
					cells[c].text = removeTagsOfType(cells[c].text,'selected');
				}
			}
		}/* else if (obj.type == 'polygon') {
			if (!un(obj.angles)) {
				for (var a = 0; a < obj.angles.length; a++) {
					if (un(obj.angles[a])) continue;
					if (obj.angles[a].drawCurve !== true && obj.angles[a].measureLabelOnly !== false) {
						delete obj.angles[a];
					}
				}
				if (obj.angles.length == 0) {
					delete obj.angles;
				}
			}
		}*/
		for (var d = 0; d < deleteProperties.length; d++) delete obj[deleteProperties[d]];
		for (var key in obj) if (key.charAt(0) == '_' || (obj[key] instanceof Array && obj[key].isEmpty() == true)) delete obj[key];
	}
	delete path.border;
	delete path.borderButtons;
	delete path.selected;
	delete path.tightBorder;
	return path;
}
draw.stringify = function(obj) {
	var circular = []; // store all objects to check for circular refs
	var str = stringify(obj);
	return str;
	
	function stringify(obj) {
		var str = "";
		if (circular.indexOf(obj) > -1) return "null";
		if (obj instanceof Array) {
			for (var i = 0; i < obj.length; i++) {
				if (typeof obj[i] == 'object') {
					circular.push(obj);
					break;
				}
			}
			str += "[";
			for (var i = 0; i < obj.length; i++) str += stringify(obj[i])+',';
			if (str.slice(-1) == ',') str = str.slice(0,-1);
			str += "]";
		} else if (typeof obj == 'object') {
			for (var key in obj) {
				if (typeof obj[key] == 'object') {
					circular.push(obj);
					break;
				}
			}
			str += "{";
			for (var key in obj) {
				if (['borderButtons','border','tightBorder','selected','ctx','qBox',"data","cursorData","textLoc","cursorPos","cursorMap","allMap","canvas","ctx","cursorCanvas","cursorctx","startText","startRichText","startTags","stringJS","currBackColor","preText","postText"].includes(key) || key.indexOf('_') == 0 || obj.hasOwnProperty(key) == false) continue;
				var value = stringify(obj[key]);
				if (value == '') continue;
				str += '"'+key+'":'+value+",";
			}
			if (str.slice(-1) == ',') str = str.slice(0,-1);
			str += "}";
		} else if (typeof obj == 'function') {
			str += obj.toString().replace(/\r?\n|\r|\t/g,"");
		} else if (typeof obj == 'number') {
			str += String(Number(obj.toFixed(3)));
		} else if (typeof obj == 'string') {
			var escapeString = replaceAll(obj,"\"","\\\"");
			str += '"'+escapeString+'"';
		} else if (typeof obj == 'boolean') {
			str += obj;
		} else {
			if (typeof obj !== 'undefined') console.log('draw.stringify type not included: ',typeof obj,obj);
		}
		return str;
	}	
}

/***************************/
/*     	PATH DRAWING	   */
/***************************/

draw.rotationMode = false;

draw.divMode = function() {
	if (!un(draw.div)) return;
	
	var div = document.createElement('div');
	container.appendChild(div);
	draw.div = div;
	div.width = 1225;
	div.height = 700;
	div.setAttribute('draggable', 'false');
	div.setAttribute('class', 'buttonClass');
	div.style.overflow = 'auto';
	div.style.cursor = 'default';
	div.zoom = 1;
		
	div.getScrollBarWidth = function() {
		// https://stackoverflow.com/questions/13382516/getting-scroll-bar-width-using-javascript
		var outer = document.createElement("div");
		outer.style.visibility = "hidden";
		outer.style.width = "100px";
		outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps
		document.body.appendChild(outer);
		var widthNoScroll = outer.offsetWidth;
		outer.style.overflow = "scroll";
		var inner = document.createElement("div");
		inner.style.width = "100%";
		outer.appendChild(inner);        
		var widthWithScroll = inner.offsetWidth;
		outer.parentNode.removeChild(outer);
		return widthNoScroll - widthWithScroll+2;
	}
	div.resize = function() {
		var xsf = canvasDisplayWidth / mainCanvasWidth;
		var ysf = canvasDisplayHeight / mainCanvasHeight;
		draw.div.style.left = (canvasDisplayLeft + 0 * xsf) + "px";
		draw.div.style.top = (0 * ysf) + "px";
		draw.div.style.width = (1225 * xsf) + "px";
		draw.div.style.height = (700 * ysf) + "px";
		draw.div.setZoom(draw.div.zoom);
	}
	div.setZoom = function(sf) {
		if (un(draw.div.scrollBarWidth)) draw.div.scrollBarWidth = draw.div.getScrollBarWidth();
		var clientRect = canvas.getBoundingClientRect();
		var viewportWidth = clientRect.width-draw.div.scrollBarWidth;
		var w = viewportWidth*sf;
		var h = w*(1700/1200);
		//var l = 0;
		//var l = (viewportWidth*(1-sf))/2;
		var l = Math.max(0,(viewportWidth*(1-sf))/2);
				
		for (var p = 0; p < draw.div.children.length; p++) {
			var pageDiv = draw.div.children[p];
			pageDiv.pageIndex = 0;
			pageDiv.style.width = w+'px';
			pageDiv.style.height = h+'px';
			pageDiv.style.left = l+'px';
			for (var c = 0; c < pageDiv.children.length; c++) {
				var child = pageDiv.children[c];
				child.style.width = w+'px';
				child.style.height = h+'px';
				child.style.left = '0px';
			}
		}
		draw.div.zoom = sf;
	}
	div.setPos = function(pos) {
		var bounds = draw.drawCanvas[0].getBoundingClientRect();
		draw.div.scrollTop = pos[1]*(1700/bounds.height);
		draw.div.scrollLeft = pos[0]*(1200/bounds.width);
	}
	div.zoomToRect = function(rect) {
		var sf = Math.min(1200/rect[2],700/rect[3]);
		draw.div.setZoom(sf);
		draw.div.setPos(rect);
	}
	div.zoomReset = function() {
		draw.div.zoomToRect([0,0,1200,700]);
	}
	div.zoomPageHeight = function() {
		draw.div.zoomToRect([0,0,1200,1700]);
	}
	
	div.createPageDiv = function(page) {
		if (!un(page._div)) return;
		page._div = document.createElement('div');
		page._div.className = 'page-div';
		page._div.pageIndex = p;
		page._div.innerHTML = '';
		page._drawCanvas = [];
		for (var i = 0; i < 7; i++) {
			var pe = i == 6 ? true : false;
			var canvas = createCanvas(0,0,1200,1700,false,false,pe,draw.zIndex+2*i);
			canvas.pageIndex = pageIndex;
			canvas.setAttribute('class', 'drawDivCanvas');
			if (i == 0) {
				canvas.style.backgroundColor = '#FFF';
				canvas.style.border = '1px solid black';
			}
			if (i < 5) {
				page._drawCanvas.push(canvas);
			} else if (i == 5) {
				page._toolsCanvas = canvas;
			} else if (i == 6) {
				page._cursorCanvas = canvas;
				canvas.style.pointerEvents = true;
				canvas.data[7] = true;
			}
			page._div.appendChild(canvas);
		}
	};
	
	/*
	if (!un(scroller)) hideScroller(scroller);
	draw.div.setZoom(1);
	//*/
	
	/*
	for (var c = 0; c < draw.drawCanvas.length; c++) {
		hideObj(draw.drawCanvas[c]);
	}
	hideObj(draw.toolsCanvas);
	hideObj(draw.cursorCanvas);
	if (!un(scroller)) hideScroller(scroller);
	draw.div.setZoom(1);
	//*/
	
	//*
	var pageDiv = document.createElement('div');
	pageDiv.className = 'page-div';
	div.appendChild(pageDiv);
	div.style.backgroundColor = '#999';
	
	draw.drawCanvas[0].style.backgroundColor = '#FFF';
	draw.drawCanvas[0].style.border = '1px solid black';
	
	for (var c = 0; c < draw.drawCanvas.length; c++) {
		hideObj(draw.drawCanvas[c]);
		pageDiv.appendChild(draw.drawCanvas[c]);
		draw.drawCanvas[c].setAttribute('class', 'drawDivCanvas');
	}
	hideObj(draw.toolsCanvas);
	pageDiv.appendChild(draw.toolsCanvas);
	draw.toolsCanvas.setAttribute('class', 'drawDivCanvas');
	hideObj(draw.cursorCanvas);
	pageDiv.appendChild(draw.cursorCanvas);
	draw.cursorCanvas.setAttribute('class', 'drawDivCanvas');
	//if (!un(scroller)) hideScroller(scroller);
	draw.div.setZoom(1);
	//*/
}
draw.multiPage = {
	on: function() {
		if (draw.multiPage.isOn === true) return;
		if (un(draw.div)) draw.divMode();
		draw.div.innerHTML = '';
		for (var p = 0; p < file.resources[resourceIndex].pages.length; p++) {
			var page = file.resources[resourceIndex].pages[p];
			draw.div.appendChild(page._div);
			if (page.pageVis === false) {
				page._drawCanvas.last().style.backgroundColor = colorA('#666',0.65);
			} else {
				page._drawCanvas.last().style.backgroundColor = 'none';
			}
			//console.log(p,page._div,page._div.parentNode);
		}
		draw.multiPage.isOn = true;
		draw.div.setZoom(1);
		hideObj(draw.drawCanvas);
		hideObj(draw.toolsCanvas);
		hideObj(draw.cursorCanvas);
		draw.multiPage.pageFocus(pIndex);
		draw.multiPage.scrollToPage(pIndex);
		draw.div.onscroll = draw.multiPage.onscroll;
	},
	off: function() {
		if (draw.multiPage.isOn !== true) return;
		for (var c = draw.div.children.length-1; c >= 0; c--) {
			if (c == pIndex) continue;
			draw.div.removeChild(draw.div.children[c]);
		}
		draw.multiPage.isOn = false;
		draw.div.onscroll = function() {};
	},
	/*addPageCanvases: function(page,pageIndex) {
		page._drawCanvas = [];
		for (var i = 0; i < 7; i++) {
			var pe = i == 6 ? true : false;
			var canvas = createCanvas(0,0,1200,1700,false,false,pe,draw.zIndex+2*i);
			canvas.pageIndex = pageIndex;
			canvas.setAttribute('class', 'drawDivCanvas');
			if (i == 0) {
				canvas.style.backgroundColor = '#FFF';
				canvas.style.border = '1px solid black';
				drawPathsToCanvas(canvas,page.paths);
			}
			if (i < 5) {
				page._drawCanvas.push(canvas);
			} else if (i == 5) {
				page._toolsCanvas = canvas;
			} else if (i == 6) {
				page._cursorCanvas = canvas;
				canvas.style.pointerEvents = true;
				canvas.data[7] = true;
			}
		}
		//console.log(pageIndex,page);
		addListenerMove(page._cursorCanvas,draw.multiPage.changePageListener);
	},*/
	changePageListener: function(e) {
		draw.multiPage.changePage(e.target.pageIndex);
	},
	changePage: function(p) {
		draw.multiPage.pageBlur(pIndex);
		pIndex = p;
		draw.multiPage.pageFocus(pIndex);		
	},
	pageBlur: function(p) {
		if (!un(pages[p])) {
			var page = pages[p];
			page.paths = [];
			page.pen = [];
			for (var p2 = 0; p2 < draw.path.length; p2++) {
				if (draw.path[p2]._deletable === false) {
					page.paths.push(draw.path[p2]);
				} else {
					page.pen.push(draw.path[p2]);
				}
			}
			page._cursorPositions = draw.cursorPositions;
		}
		draw.path = [];
		addListenerMove(draw.cursorCanvas,draw.multiPage.changePageListener);
		removeListenerMove(draw.cursorCanvas,drawCanvasMove);
		removeListenerStart(draw.cursorCanvas,drawCanvasStart);
		draw.interact.stopAnimation();
	},
	pageFocus: function(p) {
		var page = pages[p];
		draw.drawCanvas = page._drawCanvas;
		draw.toolsCanvas = page._toolsCanvas;
		draw.cursorCanvas = page._cursorCanvas;
		removeListenerMove(draw.cursorCanvas,draw.multiPage.changePageListener);
		addListenerMove(draw.cursorCanvas,drawCanvasMove);
		addListenerStart(draw.cursorCanvas,drawCanvasStart);
		
		//console.log(p,clone(pages[p]));
		
		if (!un(page.paths)) {
			for (var p = 0; p < page.paths.length; p++) page.paths[p]._deletable = false;
			draw.path = page.paths;
		}

		if (!un(pages[pIndex].pen)) draw.path = draw.path.concat(pages[pIndex].pen);
			
		if (!un(page._cursorPositions)) {
			draw.cursorPositions = page._cursorPositions;
		} else {
			for (var p = 0; p < draw.path.length; p++) {
				draw.path[p].selected = false;
				updateBorder(draw.path[p]);
			}
			calcCursorPositions();
		}
		presentButtons.update();
	},
	scrollToPage: function(p) {
		if (draw.multiPage.isOn !== true) return;
		if (un(draw.div.children[p])) return;
		draw.div.children[p].scrollIntoView(true);
		draw.multiPage.changePage(p);
	},
	onscroll: function(e) {
		var p = Math.floor(pages.length*draw.div.scrollTop/draw.div.scrollHeight);
		if (p == pIndex) return;
		draw.multiPage.changePage(p);
	}
}

draw.getColorAtPixel = function(x,y) {
	var color;
	for (var i = 0; i < draw.drawCanvas.length; i++) {
		var p = draw.drawCanvas[i].ctx.getImageData(x,y,1,1).data;
		if (p[3] === 0) continue;
		color = 'rgba('+p[0]+', '+p[1]+', '+p[2]+', '+p[3]+')';
	}
	if (un(color)) color = mainCanvasFillStyle;
	return color;

}

function drawCanvasPaths() {
	if (typeof draw.beforeDraw == 'function') draw.beforeDraw();
	while (draw.drawCanvas.length < 5) addDrawCanvas();
	
	draw.drawCanvas[0].ctx.clear(); // unselected
	draw.drawCanvas[1].ctx.clear(); // selected
	draw.drawCanvas[2].ctx.clear(); // overlay (eg. construction buttons)
	//draw.drawCanvas[3]; // select canvas 1 (movable)
	//draw.drawCanvas[4]; // select canvas 2 (static)
	
	var drawFirst = [], unselected = [], drawLast = [], overlay = [], selected = [];
	for (var p = 0; p < draw.path.length; p++) {
		var path = draw.path[p];
		for (var o = 0; o < path.obj.length; o++) path.obj[o]._path = path;
		//if (path._visible == false) continue;
		/*if (draw.mode == 'interact' && !un(path.isInput)) {
			if (path.isInput.type == 'drag') {
				if (un(path._canvas)) {
					updateBorder(path);
					var rect = clone(path.tightBorder);
					rect[0] += -3 - draw.drawRelPos[0];
					rect[1] += -3 - draw.drawRelPos[1];
					rect[2] += 6;
					rect[3] += 6;
					
					path._canvas = newctx({rect:rect,drag:true,pe:true,z:10000}).canvas;
					path._canvas.drawPos = clone(path.tightBorder);
					path._canvas.dragPath = path;
					if (!un(path.isInput.dragArea)) path._canvas.dragArea = path.isInput.dragArea;
					path._canvas.ctx.translate(-rect[0],-rect[1]);
					for (var o = 0; o < path.obj.length; o++) {
						drawObjToCtx(path._canvas.ctx,path,path.obj[o],1,1,0,0);
					}
				}
				showObj(path._canvas);
				continue;
			}
		}
		if (draw.mode !== 'interact' && !un(path._canvas)) {
			hideObj(path._canvas);
		}*/
		if (path.selected == true || path._interacting === true) {
			selected.push(path);
		} else {
			var isOverlay = false; drawFirst1 = false; drawLast1 = false;
			for (var o = 0; o < path.obj.length; o++) {
				var obj = path.obj[o];
				if (!un(obj.interact) && obj.interact.overlay == true) {
					isOverlay = true;
					break;
				} else if (obj.drawFirst == true || obj.type == 'qTable') {
					drawFirst1 = true;
					break;
				} else if (obj.drawLast == true) {
					drawLast1 = true;
					break;
				}
			}
			if (isOverlay == true) {
				overlay.push(path);
			} else if (drawFirst1 == true) {
				drawFirst.push(path);
			} else if (drawLast1 == true) {
				drawLast.push(path);
			} else {				
				unselected.push(path);
			}
		}
	}
	if (draw.mode !== 'interact' && draw.drawing == true && draw.path.last().selected !== true) selected.push(unselected.pop());

	draw.pathCursorOrder = drawFirst.concat(unselected).concat(drawLast).concat(selected).concat(overlay);
	
	for (var p = 0; p < draw.pathCursorOrder.length; p++) {
		var path = draw.pathCursorOrder[p];
		for (var o = 0; o < path.obj.length; o++) {
			var obj = path.obj[o];
			if (un(draw[obj.type])) continue;
			if (typeof draw[obj.type].drawUnderlay === 'function') draw[obj.type].drawUnderlay(draw.drawCanvas[0].ctx,obj,path);
		}
	}
	
	if (drawFirst.length > 0) drawPathsToCanvas(draw.drawCanvas[0],drawFirst);
	if (unselected.length > 0) drawPathsToCanvas(draw.drawCanvas[0],unselected);
	if (drawLast.length > 0) drawPathsToCanvas(draw.drawCanvas[0],drawLast);

	if (draw.mode == 'interact' && draw.appearMode == true) { // draw appear button positions
		var ctx = draw.drawCanvas[0].ctx;
		for (var p = 0; p < draw.path.length; p++) {
			var path = draw.path[p];
			if (un(path.appear) || path.appear.active === false) continue;
			var visible = boolean(path._visible,false);
			if (visible == true && path.appear.reversible !== true) continue;
			if (typeof path.appear.visible == 'function' && path.appear.visible(path) === false) continue;
			if (typeof path.appear.visible == 'string') {
				var testPath = draw.getPathById(path.appear.visible);
				if (testPath !== false && getPathVis(testPath) == false) {
					continue;
				}
			}
			if (un(path.appear.pos)) {
				if (un(path.border)) updateBorder(path);
				if (un(path.border)) continue;
				var l = path.border[0]+0.5*path.border[2]-20;
				var t = path.border[1]+0.5*path.border[3]-20;
			} else {
				var l = path.appear.pos[0]-20;
				var t = path.appear.pos[1]-20;
			}
			if (visible == false) {
				roundedRect(ctx, l+3, t+3, 40 - 6, 40 - 6, 3, 6, '#96C', '#C9F');	
				ctx.beginPath();
				ctx.fillStyle = '#FFF';
				drawStar({
					ctx: ctx,
					center: [l+20,t+20],
					radius: 12,
					points: 5
				});
				ctx.fill();
			} else {
				roundedRect(ctx, l+3, t+3, 40 - 6, 40 - 6, 3, 6, colorA('#C9F',0.75), '#FFF');	
				ctx.beginPath();
				ctx.fillStyle = colorA('#C9F',0.75);
				drawStar({
					ctx: ctx,
					center: [l+20,t+20],
					radius: 12,
					points: 5
				});
				ctx.fill();
			}
		}
	}
		
	if (selected.length > 0) drawPathsToCanvas(draw.drawCanvas[1],selected);
	if (overlay.length > 0) drawPathsToCanvas(draw.drawCanvas[2],overlay);
	
	for (var p = 0; p < draw.pathCursorOrder.length; p++) {
		var path = draw.pathCursorOrder[p];
		for (var o = 0; o < path.obj.length; o++) {
			var obj = path.obj[o];
			if (un(draw[obj.type])) continue;
			if (typeof draw[obj.type].drawOverlay === 'function') draw[obj.type].drawOverlay(draw.drawCanvas[2].ctx,obj,path);
		}
	}
	
	drawSelectCanvas();
	drawSelectCanvas2();
	draw.undo.saveState();
	
	/*window.requestIdleCallback(function() {
		draw.fillPath.updateDrawPolygons();
	});*/
	
	if (typeof draw.afterDraw == 'function') draw.afterDraw();
	if (draw.mode === 'edit' && !un(window.pathList) && typeof window.pathList.update == 'function') window.pathList.update();
	draw.ids.update();
	/*if (draw.mode === 'edit' && !un(previews) && !un(previews.updateCurrentPage)) {
		previews.updateCurrentPage()
	}*/
}
function drawSelectedPaths(drawOverlay) {
	while (draw.drawCanvas.length < 4) addDrawCanvas();
	draw.drawCanvas[1].ctx.clear();
	
	var selected = [];
	for (var p = 0; p < draw.path.length; p++) {
		var path = draw.path[p];
		if (path.selected == true || path._interacting === true) {
			selected.push(draw.path[p]);
		}
	}
	if (draw.drawing == true && draw.path.last().selected !== true) selected.push(draw.path.last());	
	if (selected.length > 0) drawPathsToCanvas(draw.drawCanvas[1],selected);
	
	/*if (drawOverlay !== false) {
		draw.drawCanvas[2].ctx.clear();
		for (var p = 0; p < selected.length; p++) {
			var path = selected[p];
			for (var o = 0; o < path.obj.length; o++) {
				var obj = path.obj[o];
				if (un(draw[obj.type])) continue;
				if (typeof draw[obj.type].drawOverlay === 'function') draw[obj.type].drawOverlay(draw.drawCanvas[2].ctx,obj,path);
			}
		}
		
		if (draw.mode !== 'interact') {
			drawSelectCanvas();
			drawSelectCanvas2();
			draw.undo.saveState();
		}
	}*/
}

function drawPathsToCanvas(canvas2,paths,triggerNum,sf,backColor,relPos,fillBack,drawAllPaths,log) {
	if (un(paths)) return;
	if (un(sf)) sf = draw.scale || 1;
	if (un(backColor)) backColor = mainCanvasFillStyle;
	if (un(drawAllPaths)) drawAllPaths = false;
	if (un(canvas2)) {
		var canvas = document.createElement('canvas');
		canvas.width = draw.drawCanvas[0].width*sf;
		canvas.height = draw.drawCanvas[0].height*sf;
		canvas.data = clone(draw.drawCanvas[0].data);
		canvas.data[2] = draw.drawCanvas[0].data[2]*sf;
		canvas.data[3] = draw.drawCanvas[0].data[3]*sf;
		canvas.data[102] = draw.drawCanvas[0].data[102]*sf;
		canvas.data[103] = draw.drawCanvas[0].data[103]*sf;
	} else {
		var canvas = canvas2;
	}
	
	//if (!un(draw.drawCanvas)) console.log(draw.drawCanvas.indexOf(canvas2),canvas2,paths);
	var ctx = canvas.getContext('2d');	
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	if (relPos instanceof Array) ctx.translate(relPos[0],relPos[1]);
	if (sf !== 1) ctx.scale(sf,sf);
	if (boolean(fillBack,false) == true) {
		ctx.fillStyle = backColor;
		ctx.fillRect(0,0,canvas.width,canvas.height);
	}
	
	for (var p = 0; p < paths.length; p++) {
		var path = paths[p];
		
		if (un(path) || (drawAllPaths == false && getPathVis(path) == false)) continue;
		if (path.notesOverlay === true && draw.notesOverlay !== true) continue;
		if (!un(path.rotation)) {
			ctx.translate(path.border[0]+0.5*path.border[2],path.border[1]+0.5*path.border[3]);
			ctx.rotate(path.rotation);
			ctx.translate(-path.border[0]-0.5*path.border[2],-path.border[1]-0.5*path.border[3]);
		}
		for (var o = 0; o < path.obj.length; o++) {
			if (un(path.obj[o])) continue;
			var obj = path.obj[o];
				
			if (drawAllPaths == false && typeof obj.trigger !== 'undefined' && draw.ansMode == true && obj.trigger[0] == false && draw.showAns == false) continue;
			if (obj.visible === false || obj.vis === false) continue;

			if (log === true && obj.type === 'text2' && obj.text[0].indexOf("3. ") === 0) console.log(obj);
			
			drawObjToCtx(ctx,path,obj,1,1,0,0,1);
		}
		if (!un(path.rotation)) {
			ctx.translate(path.border[0]+0.5*path.border[2],path.border[1]+0.5*path.border[3]);
			ctx.rotate(-path.rotation);
			ctx.translate(-path.border[0]-0.5*path.border[2],-path.border[1]-0.5*path.border[3]);
		}
	}
	
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	return canvas;
}
function getPathVis(path) {
	if (typeof path == 'string') {
		path = draw.getPathById(path);
		if (path == false) return false;
	}
	if (un(path)) return false;
	if (!un(path._path)) path = path._path;
	if (path.notesOverlay === true && draw.notesOverlay !== true) return false;
	if (!un(path.appear) && typeof path.appear.visible == 'function') {
		var visibleTest = path.appear.visible(path);
		if (visibleTest === true) return true;
		if (visibleTest === false) return false;
	}
	if (!un(path.appear) && typeof path.appear.visible == 'string') {
		if (getPathVis(path.appear.visible) == false) return false;
	}
	if (boolean(path.vis,true) == false) return false;
	if (boolean(path._visible,true) == false) return false;
	var vis = true;
	if (typeof path.trigger == 'object') {
		for (var l = 0; l <= draw.triggerNum; l++) {
			if (typeof path.trigger[l] == 'boolean' && path.trigger[l] == true) {
				vis = true;
			} else if (typeof path.trigger[l] == 'boolean' && path.trigger[l] == false) {
				vis = false;
			}
		}
		if (draw.triggerNum == 1 && arraysEqual(path.trigger,[false])) vis = true;
	}
	return vis;	
}
function drawObjToCtx(ctx,path,obj) {
	if (!un(obj.trigger) && draw.ansMode == true && obj.trigger[0] == false && draw.showAns == false) return;
	
	if (!un(draw[obj.type]) && !un(draw[obj.type].draw)) {
		ctx.save();
		ctx.lineWidth = obj.thickness || obj.lineWidth || 2;
		ctx.strokeStyle = obj.lineColor || obj.strokeStyle || obj.color || '#000';
		ctx.fillStyle = obj.fillColor || obj.fillStyle || 'none';
		ctx.beginPath();
		draw[obj.type].draw(ctx,obj,path);
		ctx.restore();
		ctx.setLineDash([]);
		return;
	}
}

function drawSelectCanvas() { // movable draw canvas
	var canvas = draw.drawCanvas.last();
	var ctx = canvas.ctx;
	ctx.clearRect(draw.drawArea[0],draw.drawArea[1],draw.drawArea[2],draw.drawArea[3]);
	if (draw.mode === 'interact') {
		
		return;
	}
	ctx.scale(draw.scale,draw.scale);
	var paths = selPaths();
	for (var p = 0; p < paths.length; p++) {
		var path = paths[p];
		/*if (draw.rotationMode == true && !un(path.rotation) && path.rotation !== 0) {
			ctx.translate(path.border[0]+0.5*path.border[2],path.border[1]+0.5*path.border[3]);
			ctx.rotate(path.rotation);
			ctx.translate(-path.border[0]-0.5*path.border[2],-path.border[1]-0.5*path.border[3]);	
		}*/
		if (draw.mode !== 'interact') {
			drawBorderButtons(path);
			ctx.strokeStyle = draw.selectColor;
			ctx.lineWidth = 1;
			ctx.strokeRect(path.border[0],path.border[1],path.border[2],path.border[3]);
		}
		if (!un(draw.controlPanel) && paths.length == 1 && path.obj.length == 1 && ['three','qBox'].indexOf(path.obj[0].type) > -1) draw.controlPanel.draw(ctx,path.obj[0],path);
		/*if (draw.rotationMode == true) {
			ctx.beginPath();
			ctx.moveTo(path.border[0]+0.5*path.border[2],path.border[1]);
			ctx.lineTo(path.border[0]+0.5*path.border[2],path.border[1]-30);
			ctx.stroke();
			ctx.fillStyle = draw.selectColor;
			ctx.beginPath();
			ctx.arc(path.border[0]+0.5*path.border[2],path.border[1]-30,10,0,2*Math.PI);
			ctx.fill();
		}*/
		//draw center lines
		/*ctx.beginPath();
		ctx.moveTo(path.border[0]+0.5*path.border[2],path.border[1]);
		ctx.lineTo(path.border[0]+0.5*path.border[2],path.border[1]+path.border[3]);
		ctx.moveTo(path.border[0],path.border[1]+0.5*path.border[3]);
		ctx.lineTo(path.border[0]+path.border[2],path.border[1]+0.5*path.border[3]);
		ctx.stroke();*/
		/*if (draw.rotationMode == true && !un(path.rotation) && path.rotation !== 0) {
			ctx.translate(path.border[0]+0.5*path.border[2],path.border[1]+0.5*path.border[3]);
			ctx.rotate(-path.rotation);
			ctx.translate(-path.border[0]-0.5*path.border[2],-path.border[1]-0.5*path.border[3]);	
		}*/
	}
	//if (!un(draw.controlPanel2) && !un(draw.controlPanel2.ctx)) draw.controlPanel2.draw();
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	//console.log('-----');
}
function drawSelectCanvas2(){ // static draw canvas
	var canvas = draw.drawCanvas[draw.drawCanvas.length-2];
	var ctx = canvas.ctx;
	ctx.clearRect(draw.drawArea[0],draw.drawArea[1],draw.drawArea[2],draw.drawArea[3]);
	if (draw.mode === 'interact') {
		calcCursorPositions();			
		return;
	}	
	ctx.scale(draw.scale,draw.scale);
	//ctx.fillStyle = colorA('#F00',0.2);
	//ctx.fillRect(draw.drawArea[0],draw.drawArea[1],draw.drawArea[2],draw.drawArea[3]);
	
	if (draw.appearMoveMode == true) {
		ctx.strokeStyle = '#999';
		ctx.lineWidth = 1;
		ctx.beginPath();
		for (var x = 0; x < draw.drawArea[2]; x += 10) {
			ctx.moveTo(x,0);
			ctx.lineTo(x,draw.drawArea[3]);
		}
		for (var y = 0; y < draw.drawArea[3]; y += 10) {
			ctx.moveTo(0,y);
			ctx.lineTo(draw.drawArea[2],y);
		}
		ctx.stroke();
		ctx.lineWidth = 3;
		ctx.beginPath();
		for (var x = 0; x < draw.drawArea[2]; x += 100) {
			ctx.moveTo(x,0);
			ctx.lineTo(x,draw.drawArea[3]);
		}
		for (var y = 0; y < draw.drawArea[3]; y += 100) {
			ctx.moveTo(0,y);
			ctx.lineTo(draw.drawArea[2],y);
		}
		ctx.stroke();

	}
	if (draw.mode == 'edit' && draw.appearMode == true) { // draw appear button positions
		for (var p = 0; p < draw.path.length; p++) {
			var path = draw.path[p];
			if (un(path.appear)) continue;
			if (un(path.border)) updateBorder(path);
			if (un(path.border)) continue;
			if (un(path.appear.pos)) {
				var l = path.border[0]+0.5*path.border[2]-20;
				var t = path.border[1]+0.5*path.border[3]-20;
			} else {
				var l = path.appear.pos[0]-20;
				var t = path.appear.pos[1]-20;
			}
			w = 40; h = 40;
			if (path.selected == true) {
				ctx.fillStyle = colorA('#96C',0.66);
				ctx.fillRect(l,t,w,h);
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.fillStyle = mainCanvasFillStyle;
				drawStar({ctx:ctx,center:[l+0.5*w,t+0.5*h],radius:0.4*Math.min(w,h),points:5});
				ctx.fill();
			} else {
				ctx.fillStyle = colorA('#96C',0.33);
				ctx.fillRect(l,t,w,h);
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.fillStyle = mainCanvasFillStyle;
				drawStar({ctx:ctx,center:[l+0.5*w,t+0.5*h],radius:0.4*Math.min(w,h),points:5});
				ctx.fill();
			}
		}
	}
	
	if (draw.drawMode == 'selectRect') {
		ctx.save();
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 1;
		if (!ctx.setLineDash) {ctx.setLineDash = function () {}}
		ctx.setLineDash([5,5]);
		ctx.strokeRect(draw.selectRect[0],draw.selectRect[1],draw.selectRect[2],draw.selectRect[3]);	
		ctx.setLineDash([]);
		ctx.restore();
	} else if (draw.drawMode == 'zoomRect') {
		ctx.save();
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 1;
		if (!ctx.setLineDash) {ctx.setLineDash = function () {}}
		ctx.setLineDash([5,5]);
		ctx.strokeRect(draw.zoomRect[0],draw.zoomRect[1],draw.zoomRect[2],draw.zoomRect[3]);	
		ctx.setLineDash([]);
		ctx.restore();
	}
	/*if (draw.showSnapPoints == true) {
		ctx.fillStyle = '#F00';
		for (var i = 0; i < draw.snapPoints.length; i++) {
			ctx.beginPath();
			//console.log(draw.snapPoints[i][0],draw.snapPoints[i][1]);
			ctx.arc(draw.snapPoints[i][0],draw.snapPoints[i][1],5,0,2*Math.PI);
			ctx.fill();
		}
	}*/
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	calcCursorPositions();	
}
function drawBorderButtons(path) {
	if (un(path.borderButtons)) return;
	var buttons = path.borderButtons;
	var canvas = draw.drawCanvas.last();
	var ctx = canvas.ctx;
	for (var i = 0; i < buttons.length; i++) {
		if (un(buttons[i].dims)) continue;
		var l = buttons[i].dims[0];
		var t = buttons[i].dims[1];
		var w = buttons[i].dims[2];
		var h = buttons[i].dims[3];
		var path = draw.path[buttons[i].pathNum];
		if (typeof buttons[i].draw == 'function') {
			buttons[i].draw(path,ctx,l,t,w,h);
			continue;
		}
		switch (buttons[i].buttonType) {
			case 'isInput-type':
				text({ctx:ctx,rect:[l,t,w,h],align:[0,0],text:['<<fontSize:16>>'+buttons[i].type],box:{type:'loose',color:'#F96',borderColor:'#F96'}});
				break;
			case 'isInput-dragArea-snapToggle':
				var snap = boolean(path.isInput.snap,false);
				if (snap == true) {
					ctx.fillStyle = '#00F';
					ctx.fillRect(l,t,w,h);
					var color = '#FFF';
				} else {
					var color = '#00F';
				}
				ctx.lineWidth = 2;
				ctx.strokeStyle = '#00F';
				ctx.strokeRect(l,t,w,h);
				var textColor = snap == true ? '#FFF' : '#00F';
				text({ctx:ctx,rect:[l,t,w,h],align:[0,0],text:['<<color:'+textColor+'>><<fontSize:'+(h*0.75)+'>>snap']});
				break;
			case 'isInput-drag-value':
				var path = draw.path[buttons[i].pathNum];
				var value = path.isInput.value !== "" ? path.isInput.value : '<<italic:true>>no value';
				text({ctx:ctx,rect:[l,t,w,h],align:[0,0],text:['<<fontSize:16>>'+value],box:{type:'loose',color:'#F96',borderColor:'#F96'}});
				break;
			case 'isInput-drag-shuffleToggle':
				var path = draw.path[buttons[i].pathNum];
				var shuffle = boolean(path.isInput.shuffle,false);
				if (shuffle == true) {
					ctx.fillStyle = '#00F';
					ctx.fillRect(l,t,w,h);
					var color = '#FFF';
				} else {
					var color = '#00F';
				}
				ctx.lineWidth = 2;
				ctx.strokeStyle = '#00F';
				ctx.strokeRect(l,t,w,h);
				var textColor = shuffle == true ? '#FFF' : '#00F';
				text({ctx:ctx,rect:[l,t,w,h],align:[0,0],text:['<<color:'+textColor+'>><<fontSize:'+(h*0.75)+'>>shuffle']});
				break;
			case 'select-input-selColors':
				var colors = buttons[i].selColors;
				ctx.fillStyle = colors[0];
				ctx.beginPath();
				ctx.moveTo(l,t);
				ctx.lineTo(l+w,t);
				ctx.lineTo(l,t+h);
				ctx.lineTo(l,t);
				ctx.fill();
				ctx.fillStyle = colors[1];
				ctx.beginPath();
				ctx.moveTo(l,t+w);
				ctx.lineTo(l+w,t+h);
				ctx.lineTo(l+w,t);
				ctx.lineTo(l,t+w);
				ctx.fill();
				break;
			case 'select-input-shuffleToggle':
				var path = draw.path[buttons[i].pathNum];
				var shuffle = boolean(path.isInput.shuffle,false);
				if (shuffle == true) {
					ctx.fillStyle = '#00F';
					ctx.fillRect(l,t,w,h);
					var color = '#FFF';
				} else {
					var color = '#00F';
				}
				ctx.lineWidth = 2;
				ctx.strokeStyle = '#00F';
				ctx.strokeRect(l,t,w,h);
				var textColor = shuffle == true ? '#FFF' : '#00F';
				text({ctx:ctx,rect:[l,t,w,h],align:[0,0],text:['<<color:'+textColor+'>><<fontSize:'+(h*0.75)+'>>shuffle']});
				break;
			case 'select-input-cellToggle':
				var cell = draw.path[buttons[i].pathNum].obj[0].cells[buttons[i].row][buttons[i].col];
				if (cell.ans == true) {
					ctx.fillStyle = '#060';
					ctx.fillRect(l,t,w,h);
					var color = '#FFF';
				} else {
					var color = '#060';
				}
				ctx.lineWidth = 2;
				ctx.strokeStyle = '#060';
				ctx.strokeRect(l,t,w,h);
				drawTick(ctx,w*0.8,h,color,l+w*0.1,t,w*0.1);
				break;
			case 'text-input-prevAns':
				drawArrow({ctx:ctx,startX:l+0.75*w,startY:t+0.5*h,finX:l+0.25*w,finY:t+0.5*h,arrowLength:0.5*w,color:'#393',lineWidth:2,fillArrow:true,doubleEnded:false,angleBetweenLinesRads:0.5});
				break;
			case 'text-input-ansInfo':
				text({ctx:ctx,rect:[l,t,w,h],align:[0,0],text:['<<fontSize:16>>'+buttons[i].text]});
				break;				
			case 'text-input-nextAns':
				drawArrow({ctx:ctx,startX:l+0.25*w,startY:t+0.5*h,finX:l+0.75*w,finY:t+0.5*h,arrowLength:0.5*w,color:'#393',lineWidth:2,fillArrow:true,doubleEnded:false,angleBetweenLinesRads:0.5});
				break;
			case 'text-input-algText':
				if (buttons[i].algText) {
					ctx.fillStyle = colorA('#393',0.5);
					ctx.fillRect(l,t,w,h);
				}
				text({ctx:ctx,rect:[l,t,w,h],align:[0,0],text:['<<fontSize:16>><<font:algebra>>x']});
				break;
			case 'text-input-num':
				if(buttons[i].num) {
					ctx.fillStyle = colorA('#393',0.5);
					ctx.fillRect(l,t,w,h);
				}
				text({ctx:ctx,rect:[l,t,w,h],align:[0,0],text:['<<fontSize:16>>#']});				
				break;
			case 'text-input-oe':
				if(buttons[i].oe) {
					ctx.fillStyle = colorA('#393',0.5);
					ctx.fillRect(l,t,w,h);
				}
				text({ctx:ctx,rect:[l,t,w,h],align:[0,0],text:['<<fontSize:13>>oe']});				
				break;
			case 'text-input-tickStyle':
				drawTick(ctx,w*0.8,w,'#060',l+w*0.1,t,w*(7/40));
				break;
			case 'resize':
			case 'resize-path':
				ctx.fillStyle = colorA(draw.selectColor,0.5);
				ctx.fillRect(l,t,w,h);
				drawArrow({ctx:ctx,startX:l+0.2*w,startY:t+0.2*h,finX:l+0.8*w,finY:t+0.8*h,arrowLength:4,color:mainCanvasFillStyle,lineWidth:2,fillArrow:true,doubleEnded:false,angleBetweenLinesRads:0.7});
				drawArrow({ctx:ctx,finX:l+0.2*w,finY:t+0.2*h,startX:l+0.8*w,startY:t+0.8*h,arrowLength:4,color:mainCanvasFillStyle,lineWidth:2,fillArrow:true,doubleEnded:false,angleBetweenLinesRads:0.7});
				break;
			case 'text-horizResize':
				ctx.fillStyle = colorA(draw.selectColor,0.5);
				ctx.fillRect(l,t,w,h);
				drawArrow({ctx:ctx,startX:l+0.2*w,startY:t+0.5*h,finX:l+0.8*w,finY:t+0.5*h,arrowLength:4,color:mainCanvasFillStyle,lineWidth:2,fillArrow:true,doubleEnded:false,angleBetweenLinesRads:0.7});
				drawArrow({ctx:ctx,finX:l+0.2*w,finY:t+0.5*h,startX:l+0.8*w,startY:t+0.5*h,arrowLength:4,color:mainCanvasFillStyle,lineWidth:2,fillArrow:true,doubleEnded:false,angleBetweenLinesRads:0.7});					
				break;
			case 'text2-fracScale':
				ctx.fillStyle = colorA('#69F',0.5);
				ctx.fillRect(l,t,w,h);
				ctx.fillStyle = '#000';
				ctx.fillRect(l+0.4*w,t+0.15*w,0.2*w,0.2*w);
				ctx.fillRect(l+0.4*w,t+0.65*w,0.2*w,0.2*w);
				ctx.strokeStyle = '#000';
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(l+0.32*w,t+0.5*h);
				ctx.lineTo(l+0.68*w,t+0.5*h);
				ctx.stroke();//text({ctx:ctx,rect:[l,t,w,h*0.9],align:[0,0],text:['<<fontSize:13>>',['frac',[String.fromCharCode(0x25A0)],[String.fromCharCode(0x25A0)]]]});
				break;
			case 'text2-underline':
				ctx.fillStyle = colorA('#FFC',0.5);
				ctx.fillRect(l,t,w,h);
				text({ctx:ctx,rect:[l,t,w,h*0.9],align:[0,0],text:['<<fontSize:13>>u']});
				ctx.strokeStyle = '#000';
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.moveTo(l+0.32*w,t+0.8*h);
				ctx.lineTo(l+0.68*w,t+0.8*h);
				ctx.stroke();
				break;
			case 'text2-algPadding':
				var obj = path.obj[0];
				if (un(obj.algPadding)) {
					ctx.strokeStyle = colorA('#F9C',0.5);
					ctx.lineWidth = 1;
					ctx.strokeRect(l,t,w,h);
					text({ctx:ctx,rect:[l,t,w,h*0.9],align:[0,0],text:['<<fontSize:13>>-'],algPadding:0});
				} else {
					ctx.fillStyle = colorA('#F9C',0.5);
					ctx.fillRect(l,t,w,h);
					text({ctx:ctx,rect:[l,t,w,h*0.9],align:[0,0],text:['<<fontSize:13>>'+obj.algPadding],algPadding:0});
				}
				break;
			case 'table2-draw.table2.questionFit':
			case 'text2-fullWidth':
				ctx.fillStyle = colorA('#9FC',0.5);
				ctx.fillRect(l,t,w,h);
				drawArrow({ctx:ctx,startX:l+0.2*w,startY:t+0.5*h,finX:l+0.8*w,finY:t+0.5*h,arrowLength:4,color:'#000',lineWidth:2,fillArrow:true,doubleEnded:false,angleBetweenLinesRads:0.7});
				drawArrow({ctx:ctx,finX:l+0.2*w,finY:t+0.5*h,startX:l+0.8*w,startY:t+0.5*h,arrowLength:4,color:'#000',lineWidth:2,fillArrow:true,doubleEnded:false,angleBetweenLinesRads:0.7});
				break;
			case 'table2-draw.table2.questionGrid':
				ctx.fillStyle = colorA('#9CF',0.5);
				ctx.fillRect(l,t,w,h);
				text({ctx:ctx,rect:[l,t,w,h],align:[0,0],text:['<<fontSize:12>>(a)']});
				break;						
			
			case 'text-horizResizeCollapse' :
				ctx.fillStyle = colorA('#F0F',0.5);
				ctx.fillRect(l,t,w,h);
				drawArrow({ctx:ctx,finX:l+0.2*w,finY:t+0.5*h,startX:l+0.8*w,startY:t+0.5*h,arrowLength:4,color:mainCanvasFillStyle,lineWidth:2,fillArrow:true,doubleEnded:false,angleBetweenLinesRads:0.7});					
				break;
			case 'text-vertResizeCollapse' :
				ctx.fillStyle = colorA('#F0F',0.5);
				ctx.fillRect(l,t,w,h);
				drawArrow({ctx:ctx,finX:l+0.5*w,finY:t+0.2*h,startX:l+0.5*w,startY:t+0.8*h,arrowLength:4,color:mainCanvasFillStyle,lineWidth:2,fillArrow:true,doubleEnded:false,angleBetweenLinesRads:0.7});					
				break;					
			case 'delete':
				ctx.fillStyle = colorA('#F00',0.5);
				ctx.fillRect(l,t,w,h);
				ctx.lineWidth = 2;
				ctx.strokeStyle = mainCanvasFillStyle;
				ctx.beginPath();
				ctx.moveTo(l+0.2*w,t+0.2*h);
				ctx.lineTo(l+0.8*w,t+0.8*h);
				ctx.moveTo(l+0.2*w,t+0.8*h);
				ctx.lineTo(l+0.8*w,t+0.2*h);
				ctx.stroke();			
				break;
			case 'appear':
			case 'appear-button':
			case 'trigger':
			case 'triggerTableCell':
				var reversible = false;
				if (draw.triggerEnabled == true || draw.appearMode == true) {
					if (buttons[i].buttonType == 'appear') {
						var vis = !un(path.appear) ? false : true;
						if (!un(path.appear) && path.appear.reversible === true) reversible = true;
					} else if (buttons[i].buttonType == 'appearButton') {
						var vis = true;
					} else {
						if (buttons[i].buttonType == 'trigger') {
							var trigger = path.trigger;
						} else if (buttons[i].buttonType == 'triggerTableCell') {
							var trigger = path.obj[0].cells[buttons[i].r][buttons[i].c].trigger;					
						}
						var vis = true;
						if (typeof trigger == 'object') {
							for (var m = 0; m <= draw.triggerNum; m++) {
								if (typeof trigger[m] == 'boolean' && trigger[m] == true) {
									vis = true;
								} else if (typeof trigger[m] == 'boolean' && trigger[m] == false) {
									vis = false;
								}
							}
						}
					}
					var color = reversible == true ? '#F00' : '#96C';
					if (vis == true) {
						ctx.fillStyle = colorA(color,0.5);
						ctx.fillRect(l,t,w,h);
						ctx.lineWidth = 1;
						ctx.beginPath();
						ctx.fillStyle = mainCanvasFillStyle;
						drawStar({ctx:ctx,center:[l+0.5*w,t+0.5*h],radius:0.4*Math.min(w,h),points:5});
						ctx.fill();
					} else {
						ctx.strokeStyle = colorA(color,0.5);
						ctx.strokeRect(l,t,w,h);
						ctx.lineWidth = 1;
						ctx.beginPath();
						ctx.fillStyle = colorA(color,0.5);
						drawStar({ctx:ctx,center:[l+0.5*w,t+0.5*h],radius:0.4*Math.min(w,h),points:5});
						ctx.fill();
					}
				}
				break;	
			case 'toggle-draggable':
				if (!un(path.interact) && path.interact.draggable == true) {
					ctx.strokeStyle = colorA('#393',0.5);
					ctx.strokeRect(l,t,w,h);
					ctx.lineWidth = 1;
					ctx.beginPath();
					ctx.fillStyle = colorA('#393',0.5);
					drawStar({ctx:ctx,center:[l+0.5*w,t+0.5*h],radius:0.4*Math.min(w,h),points:5});
					ctx.fill();
				} else {
					ctx.fillStyle = colorA('#393',0.5);
					ctx.fillRect(l,t,w,h);
					ctx.lineWidth = 1;
					ctx.beginPath();
					ctx.fillStyle = mainCanvasFillStyle;
					drawStar({ctx:ctx,center:[l+0.5*w,t+0.5*h],radius:0.4*Math.min(w,h),points:5});
					ctx.fill();
				}
				break;
			case 'toggle-notesOverlay':
				if (path.notesOverlay === true) {
					ctx.strokeStyle = colorA('#C60',0.5);
					ctx.strokeRect(l,t,w,h);
					ctx.lineWidth = 1;
					ctx.beginPath();
					ctx.fillStyle = colorA('#C60',0.5);
					drawStar({ctx:ctx,center:[l+0.5*w,t+0.5*h],radius:0.4*Math.min(w,h),points:5});
					ctx.fill();
				} else {
					ctx.fillStyle = colorA('#C60',0.5);
					ctx.fillRect(l,t,w,h);
					ctx.lineWidth = 1;
					ctx.beginPath();
					ctx.fillStyle = mainCanvasFillStyle;
					drawStar({ctx:ctx,center:[l+0.5*w,t+0.5*h],radius:0.4*Math.min(w,h),points:5});
					ctx.fill();
				}
				break;
			case 'orderMinus':
				ctx.strokeStyle = mainCanvasFillStyle;				
				ctx.fillStyle = colorA('#F60',0.5);
				ctx.fillRect(l,t,w,h);
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.moveTo(l+0.3*w,t+0.5*h);
				ctx.lineTo(l+0.7*w,t+0.5*h);
				ctx.stroke();
				break;
			case 'orderPlus':
				ctx.strokeStyle = mainCanvasFillStyle;				
				ctx.fillStyle = colorA('#F60',0.5);
				ctx.fillRect(l,t,w,h);
				ctx.beginPath();
				ctx.moveTo(l+0.3*w,t+0.5*h);
				ctx.lineTo(l+0.7*w,t+0.5*h);
				ctx.moveTo(l+0.5*w,t+0.3*h);
				ctx.lineTo(l+0.5*w,t+0.7*h);
				ctx.stroke();
				break;		
			case 'anglesAroundPoint-pointsMinus':
			case 'table2-paddingVMinus':
			case 'table2-paddingHMinus':
				ctx.strokeStyle = mainCanvasFillStyle;				
				ctx.fillStyle = colorA('#06F',0.5);
				ctx.fillRect(l,t,w,h);
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.moveTo(l+0.3*w,t+0.5*h);
				ctx.lineTo(l+0.7*w,t+0.5*h);
				ctx.stroke();
				break;
			case 'anglesAroundPoint-pointsPlus':
			case 'table2-paddingVPlus':
			case 'table2-paddingHPlus':
				ctx.strokeStyle = mainCanvasFillStyle;				
				ctx.fillStyle = colorA('#06F',0.5);
				ctx.fillRect(l,t,w,h);
				ctx.beginPath();
				ctx.moveTo(l+0.3*w,t+0.5*h);
				ctx.lineTo(l+0.7*w,t+0.5*h);
				ctx.moveTo(l+0.5*w,t+0.3*h);
				ctx.lineTo(l+0.5*w,t+0.7*h);
				ctx.stroke();
				break;	
			case 'anglesAroundPoint-fixRadius':
				ctx.strokeStyle = mainCanvasFillStyle;				
				ctx.fillStyle = colorA('#F06',0.5);
				ctx.fillRect(l,t,w,h);
				ctx.beginPath();
				ctx.arc(l+0.5*w,t+0.5*h,0.35*w,0,2*Math.PI);
				ctx.stroke();
				break;						
			case 'qPos-bottomRight':
			case 'qPos-center':
				if (buttons[i].buttonType.indexOf(path.qPos) > -1) {
					ctx.fillStyle = colorA('#090',0.5);
					ctx.fillRect(l,t,w,h);
				} else {
					ctx.fillStyle = colorA('#0F0',0.5);
					ctx.fillRect(l,t,w,h);
				}
				ctx.strokeStyle = colorA('#000',0.5);
				ctx.strokeRect(l,t,w,h);				
				ctx.fillStyle = colorA('#000',0.5);
				if (buttons[i].buttonType == 'qPos-bottomRight') {
					ctx.fillRect(l+0.5*w,t+0.6*h,0.5*w,0.4*h);
				} else if (buttons[i].buttonType == 'qPos-center') {
					ctx.fillRect(l+0.25*w,t+0.3*h,0.5*w,0.4*h);
				}
				break;
			case 'qPos-fillWidth':
				if (path.qFillWidth == true) {
					ctx.fillStyle = colorA('#090',0.5);
					ctx.fillRect(l,t,w,h);
				} else {
					ctx.fillStyle = colorA('#0F0',0.5);
					ctx.fillRect(l,t,w,h);
				}
				ctx.strokeStyle = colorA('#000',0.5);
				ctx.strokeRect(l,t,w,h);				
				drawArrow({ctx:ctx,startX:l+0.2*w,startY:t+0.5*h,finX:l+0.8*w,finY:t+0.5*h,arrowLength:4,color:colorA('#000',0.5),lineWidth:2,fillArrow:true,doubleEnded:false,angleBetweenLinesRads:0.7});
				drawArrow({ctx:ctx,finX:l+0.2*w,finY:t+0.5*h,startX:l+0.8*w,startY:t+0.5*h,arrowLength:4,color:colorA('#000',0.5),lineWidth:2,fillArrow:true,doubleEnded:false,angleBetweenLinesRads:0.7});
				break;
			case 'angle-showLines':
				if (typeof path.obj[0].drawLines == 'undefined' || path.obj[0].drawLines == true) {
					ctx.fillStyle = colorA('#F90',0.5);
					ctx.fillRect(l,t,w,h);
					var showLines = true;
				} else {
					ctx.fillStyle = colorA('#FC3',0.5);
					ctx.fillRect(l,t,w,h);
					var showLines = false;
				}
				drawAngle({ctx:ctx,a:[l+0.5*w,t+0.2*h],b:[l+0.2*w,t+0.8*h],c:[l+0.8*w,t+0.8*h],radius:0.4*w,lineWidth:1,drawLines:showLines});
				break;
			case 'angle-showAngle':
				ctx.fillStyle = colorA('#F90',0.5);
				ctx.fillRect(l,t,w,h);
				text({ctx:ctx,textArray:['<<fontSize:'+(w/2)+'>>37'+degrees],left:l,top:t,width:w,height:h,textAlign:'center',vertAlign:'middle'});					
				break;
			case 'angle-numOfCurves':
				ctx.fillStyle = colorA('#F90',0.5);
				ctx.fillRect(l,t,w,h);

				drawAngle({ctx:ctx,a:[l+0.5*w,t+0.2*h],b:[l+0.2*w,t+0.8*h],c:[l+0.8*w,t+0.8*h],radius:0.4*w,lineWidth:1,drawLines:true,numOfCurves:2,curveGap:3});
				break;					
			case 'polygon-makeRegular':
				ctx.fillStyle = colorA('#F90',0.5);
				ctx.fillRect(l,t,w,h);
				var center = [l+0.5*w,t+0.5*h];
				var radius = 0.4*Math.min(w,h);
				var angle = -0.5*Math.PI;
				var pos = [];
				for (var p = 0; p < 5; p++) {
					pos[p] = [center[0]+radius*Math.cos(angle),center[1]+radius*Math.sin(angle)];
					angle += (2*Math.PI)/5;
				}
				ctx.strokeStyle = '#000';
				ctx.lineWidth = 1;
				/*ctx.beginPath();
				ctx.arc(center[0],center[1],radius,0,2*Math.PI);
				ctx.stroke();*/
				drawPath({ctx:ctx,path:pos,closed:true});
				for (var p = 0; p < 5; p++) {
					drawDash(ctx,pos[p][0],pos[p][1],pos[(p+1)%5][0],pos[(p+1)%5][1],radius/5);
				}
				break;
			case 'polygon-verticesPlus':
				ctx.strokeStyle = mainCanvasFillStyle;				
				ctx.fillStyle = colorA('#06F',0.5);
				ctx.fillRect(l,t,w,h);
				ctx.beginPath();
				ctx.moveTo(l+0.3*w,t+0.5*h);
				ctx.lineTo(l+0.7*w,t+0.5*h);
				ctx.moveTo(l+0.5*w,t+0.3*h);
				ctx.lineTo(l+0.5*w,t+0.7*h);
				ctx.stroke();				
				break;
			case 'polygon-verticesMinus':
				ctx.strokeStyle = mainCanvasFillStyle;				
				ctx.fillStyle = colorA('#06F',0.5);
				ctx.fillRect(l,t,w,h);
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.moveTo(l+0.3*w,t+0.5*h);
				ctx.lineTo(l+0.7*w,t+0.5*h);
				ctx.stroke();				
				break;
			case 'polygon-setPrism' :
				ctx.fillStyle = colorA('#3F9',0.5);
				ctx.fillRect(l,t,w,h);
				drawPolygon({
					ctx:ctx,
					points:[[l+0.7*w,t+0.8*h],[l+0.2*w,t+0.8*h],[l+0.2*w,t+0.4*h],[l+0.5*w,t+0.4*h]],
					lineColor:'#000',
					lineWidth:1,
					solidType:'prism',
					prismVector:[0.15*w,-0.15*h],
				});
				break;
			case 'polygon-setOuterAngles' :
				ctx.fillStyle = colorA('#F0F',0.5);
				ctx.fillRect(l,t,w,h);
				drawPolygon({
					ctx:ctx,
					points:[[l+0.7*w,t+0.7*h],[l+0.5*w,t+0.3*h],[l+0.3*w,t+0.7*h]],
					lineColor:'#000',
					lineWidth:1,
					anglesMode:'outer',
					outerAngles:[
						{radius:0.2*w,fill:true,fillColor:"#66F",lineWidth:0.5},
						{radius:0.2*w,fill:true,fillColor:"#66F",lineWidth:0.5},
						{radius:0.2*w,fill:true,fillColor:"#66F",lineWidth:0.5}
					]
				});					
				break;
			case 'polygon-setExteriorAngles' :
				ctx.fillStyle = colorA('#F93',0.5);
				ctx.fillRect(l,t,w,h);
				break;
			case 'polygon-setTypeSquare' :
				ctx.strokeStyle = mainCanvasFillStyle;				
				if (path.obj[0].polygonType == 'square') { 
					ctx.fillStyle = colorA('#393',0.5);
				} else {
					ctx.fillStyle = colorA('#939',0.5);
				}
				ctx.fillRect(l,t,w,h);
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.moveTo(l+0.3*w,t+0.3*h);
				ctx.lineTo(l+0.3*w,t+0.7*h);
				ctx.lineTo(l+0.7*w,t+0.7*h);
				ctx.lineTo(l+0.7*w,t+0.3*h);
				ctx.lineTo(l+0.3*w,t+0.3*h);
				ctx.stroke();
				break;
			case 'polygon-setTypeRect' :
				ctx.strokeStyle = mainCanvasFillStyle;				
				if (path.obj[0].polygonType == 'rect') { 
					ctx.fillStyle = colorA('#393',0.5);
				} else {
					ctx.fillStyle = colorA('#939',0.5);
				}
				ctx.fillRect(l,t,w,h);
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.moveTo(l+0.2*w,t+0.35*h);
				ctx.lineTo(l+0.2*w,t+0.65*h);
				ctx.lineTo(l+0.8*w,t+0.65*h);
				ctx.lineTo(l+0.8*w,t+0.35*h);
				ctx.lineTo(l+0.2*w,t+0.35*h);
				ctx.stroke();					
				break;
			case 'polygon-setTypePara' :
				ctx.strokeStyle = mainCanvasFillStyle;				
				if (path.obj[0].polygonType == 'para') { 
					ctx.fillStyle = colorA('#393',0.5);
				} else {
					ctx.fillStyle = colorA('#939',0.5);
				}
				ctx.fillRect(l,t,w,h);
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.moveTo(l+0.2*w,t+0.35*h);
				ctx.lineTo(l+0.35*w,t+0.65*h);
				ctx.lineTo(l+0.8*w,t+0.65*h);
				ctx.lineTo(l+0.65*w,t+0.35*h);
				ctx.lineTo(l+0.2*w,t+0.35*h);
				ctx.stroke();					
				break;
			case 'polygon-setTypeTrap' :
				ctx.strokeStyle = mainCanvasFillStyle;				
				if (path.obj[0].polygonType == 'trap') { 
					ctx.fillStyle = colorA('#393',0.5);
				} else {
					ctx.fillStyle = colorA('#939',0.5);
				}
				ctx.fillRect(l,t,w,h);
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.moveTo(l+0.35*w,t+0.35*h);
				ctx.lineTo(l+0.2*w,t+0.65*h);
				ctx.lineTo(l+0.8*w,t+0.65*h);
				ctx.lineTo(l+0.65*w,t+0.35*h);
				ctx.lineTo(l+0.35*w,t+0.35*h);
				ctx.stroke();					
				break;
			case 'polygon-setTypeRhom' :
				ctx.strokeStyle = mainCanvasFillStyle;				
				if (path.obj[0].polygonType == 'rhom') { 
					ctx.fillStyle = colorA('#393',0.5);
				} else {
					ctx.fillStyle = colorA('#939',0.5);
				}
				ctx.fillRect(l,t,w,h);
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.moveTo(l+0.5*w,t+0.3*h);
				ctx.lineTo(l+0.2*w,t+0.5*h);
				ctx.lineTo(l+0.5*w,t+0.7*h);
				ctx.lineTo(l+0.8*w,t+0.5*h);
				ctx.lineTo(l+0.5*w,t+0.3*h);
				ctx.stroke();					
				break;
			case 'polygon-setTypeKite' :
				ctx.strokeStyle = mainCanvasFillStyle;				
				if (path.obj[0].polygonType == 'kite') { 
					ctx.fillStyle = colorA('#393',0.5);
				} else {
					ctx.fillStyle = colorA('#939',0.5);
				}
				ctx.fillRect(l,t,w,h);
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.moveTo(l+0.5*w,t+0.25*h);
				ctx.lineTo(l+0.3*w,t+0.4*h);
				ctx.lineTo(l+0.5*w,t+0.75*h);
				ctx.lineTo(l+0.7*w,t+0.4*h);
				ctx.lineTo(l+0.5*w,t+0.25*h);
				ctx.stroke();					
				break;					
			case 'text-border':
				ctx.fillStyle = colorA('#F90',0.5);
				ctx.fillRect(l,t,w,h);
				ctx.fillStyle = colorA('#99F',0.5);
				ctx.clearRect(l+0.15*w,t+0.25*h,w*0.7,h*0.5);
				ctx.fillRect(l+0.15*w,t+0.25*h,w*0.7,h*0.5);
				ctx.lineWidth = 3;
				ctx.strokeStyle = colorA('#000',0.5);
				ctx.strokeRect(l+0.15*w,t+0.25*h,w*0.7,h*0.5);					
				break;						
			case 'grid-resize':
				ctx.fillStyle = colorA('#F9F',0.5);
				ctx.fillRect(l,t,w,h);
				ctx.strokeStyle = colorA('#F0F',0.5);
				ctx.strokeRect(l,t,w,h);
				drawArrow({ctx:ctx,startX:l+0.1*w,startY:t+0.5*h,finX:l+0.9*w,finY:t+0.5*h,arrowLength:4,color:colorA('#000',0.5),lineWidth:2,fillArrow:true,doubleEnded:true,angleBetweenLinesRads:0.7});
				drawArrow({ctx:ctx,finX:l+0.5*w,finY:t+0.1*h,startX:l+0.5*w,startY:t+0.9*h,arrowLength:4,color:colorA('#000',0.5),lineWidth:2,fillArrow:true,doubleEnded:true,angleBetweenLinesRads:0.7});
				break;
			case 'grid-plot':
				var obj = path.obj[0];
				ctx.fillStyle = obj._interactMode == 'plot' ? colorA('#00F',0.5) : colorA('#99F',0.5);
				ctx.fillRect(l,t,w,h);
				ctx.strokeStyle = '#000';
				ctx.lineWidth = 1;
				ctx.strokeRect(l,t,w,h);
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.moveTo(l+0.3*w,t+0.3*h);
				ctx.lineTo(l+0.7*w,t+0.7*h);
				ctx.moveTo(l+0.3*w,t+0.7*h);
				ctx.lineTo(l+0.7*w,t+0.3*h);
				ctx.stroke();
				break;
			case 'grid-lineSegment':
				ctx.fillStyle = obj._interactMode == 'lineSegment' ? colorA('#00F',0.5) : colorA('#99F',0.5);
				ctx.fillRect(l,t,w,h);
				ctx.lineWidth = 1;
				ctx.strokeStyle = '#000';
				ctx.strokeRect(l,t,w,h);
				ctx.beginPath();
				/*ctx.moveTo(l+0.2*w,t+0.3*h);
				ctx.lineTo(l+0.4*w,t+0.5*h);
				ctx.moveTo(l+0.2*w,t+0.5*h);
				ctx.lineTo(l+0.4*w,t+0.3*h);*/
				
				ctx.moveTo(l+0.3*w,t+0.4*h);
				ctx.lineTo(l+0.7*w,t+0.6*h);
				
				/*ctx.moveTo(l+0.6*w,t+0.5*h);
				ctx.lineTo(l+0.8*w,t+0.7*h);
				ctx.moveTo(l+0.6*w,t+0.7*h);
				ctx.lineTo(l+0.8*w,t+0.5*h);*/					
				ctx.stroke();
				break;	
			case 'grid-line':
				ctx.fillStyle = obj._interactMode == 'line' ? colorA('#00F',0.5) : colorA('#99F',0.5);
				ctx.fillRect(l,t,w,h);
				ctx.strokeStyle = '#000';
				ctx.lineWidth = 1;
				ctx.strokeRect(l,t,w,h);
				ctx.beginPath();
				ctx.moveTo(l,t+0.3*h);
				ctx.lineTo(l+w,t+0.7*h);
				ctx.stroke();
				break;	
			case 'grid-undo':
				ctx.fillStyle = colorA('#99F',0.5);
				ctx.fillRect(l,t,w,h);
				ctx.strokeStyle = '#000';
				ctx.lineWidth = 1;
				ctx.strokeRect(l,t,w,h);
				text({ctx:ctx,textArray:['<<fontSize:'+(w*0.4)+'>>undo'],left:l,top:t,width:w,height:h,align:[0,0]});
				break;
			case 'grid-clear':
				ctx.fillStyle = colorA('#99F',0.5);
				ctx.fillRect(l,t,w,h);
				ctx.lineWidth = 1;
				ctx.strokeStyle = '#000';
				ctx.strokeRect(l,t,w,h);
				text({ctx:ctx,textArray:['<<fontSize:'+(w*0.4)+'>>CLR'],left:l,top:t,width:w,height:h,align:[0,0]});
				break;
			case 'grid-function':
				ctx.fillStyle = colorA('#99F',0.5);
				ctx.fillRect(l,t,w,h);
				ctx.lineWidth = 1;
				ctx.strokeStyle = '#000';
				ctx.strokeRect(l,t,w,h);
				text({ctx:ctx,textArray:['<<font:algebra>><<fontSize:'+(w*0.5)+'>>f(x)'],left:l,top:t,width:w,height:h,align:[0,0]});
				break;				
			case 'grid-showGrid':
				if (path.obj.length == 1 && path.obj[0].type == 'grid') {
					if (typeof path.obj[0].showGrid == 'undefined' || path.obj[0].showGrid == true) {
						ctx.fillStyle = colorA('#F96',0.5);
						ctx.fillRect(l,t,w,h);
					}
					ctx.strokeStyle = colorA('#000',0.5);
					ctx.strokeRect(l,t,w,h);
					ctx.strokeStyle = '#000';					
					ctx.lineWidth = 1;
					ctx.beginPath();
					ctx.moveTo(l+0.4*w,t+0.2*h);
					ctx.lineTo(l+0.4*w,t+0.8*h);
					ctx.moveTo(l+0.6*w,t+0.2*h);
					ctx.lineTo(l+0.6*w,t+0.8*h);
					ctx.moveTo(l+0.2*w,t+0.4*h);
					ctx.lineTo(l+0.8*w,t+0.4*h);
					ctx.moveTo(l+0.2*w,t+0.6*h);
					ctx.lineTo(l+0.8*w,t+0.6*h);
					ctx.stroke();
				}
				break;
			case 'grid-showScales':
				if (path.obj.length == 1 && (path.obj[0].type == 'grid' || path.obj[0].type == 'numberline')) {
					if (typeof path.obj[0].showScales == 'undefined' || path.obj[0].showScales == true) {
						ctx.fillStyle = colorA('#F96',0.5);
						ctx.fillRect(l,t,w,h);
					}				
					ctx.strokeStyle = colorA('#000',0.5);
					ctx.strokeRect(l,t,w,h);
					text({ctx:ctx,textArray:['<<fontSize:'+(w/2)+'>>123'],left:l,top:t,width:w,height:h,textAlign:'center',vertAlign:'middle'});
				}
				break;
			case 'grid-showLabels':
				if (path.obj.length == 1 && path.obj[0].type == 'grid') {
					if (typeof path.obj[0].showLabels == 'undefined' || path.obj[0].showLabels == true) {
						ctx.fillStyle = colorA('#F96',0.5);
						ctx.fillRect(l,t,w,h);
					}		
					ctx.strokeStyle = colorA('#000',0.5);
					ctx.strokeRect(l,t,w,h);
					text({ctx:ctx,textArray:['<<fontSize:'+(w/2)+'>><<font:algebra>>xy'],left:l,top:t,width:w,height:h,textAlign:'center',vertAlign:'middle'});
				}
				break;
			case 'grid-showBorder':
				if (path.obj.length == 1 && path.obj[0].type == 'grid') {
					if (typeof path.obj[0].showBorder == 'undefined' || path.obj[0].showBorder == true) {
						ctx.fillStyle = colorA('#F96',0.5);
						ctx.fillRect(l,t,w,h);
					}		
					ctx.strokeStyle = colorA('#000',0.5);
					ctx.strokeRect(l,t,w,h);
					ctx.strokeStyle = '#000';	
					ctx.lineWidth = 2;
					ctx.strokeRect(l+w*0.2,t+h*0.2,w*0.6,h*0.6);
				}
				break;
			case 'grid-originStyle':
				if (path.obj.length == 1 && path.obj[0].type == 'grid') {
					if (typeof path.obj[0].originStyle == 'undefined' || path.obj[0].originStyle == 'circle') {
						ctx.fillStyle = colorA('#F96',0.5);
						ctx.fillRect(l,t,w,h);
					}		
					ctx.strokeStyle = colorA('#000',0.5);
					ctx.strokeRect(l,t,w,h);
					ctx.strokeStyle = '#000';	
					ctx.lineWidth = 2;
					text({ctx:ctx,textArray:['<<fontSize:'+(w/3)+'>><<font:algebra>>(0,0)'],left:l,top:t,width:w,height:h,textAlign:'center',vertAlign:'middle'});

				}
				break;
			case 'simpleGrid-xPlus':				
			case 'simpleGrid-yPlus':				
				ctx.strokeStyle = mainCanvasFillStyle;
				ctx.fillStyle = colorA('#F0F',0.5);
				ctx.fillRect(l,t,w,h);
				ctx.beginPath();
				ctx.moveTo(l+0.3*w,t+0.5*h);
				ctx.lineTo(l+0.7*w,t+0.5*h);
				ctx.moveTo(l+0.5*w,t+0.3*h);
				ctx.lineTo(l+0.5*w,t+0.7*h);
				ctx.stroke();				
				break;
			case 'simpleGrid-xMinus':				
			case 'simpleGrid-yMinus':								
				ctx.strokeStyle = mainCanvasFillStyle;
				ctx.fillStyle = colorA('#F0F',0.5);
				ctx.fillRect(l,t,w,h);
				ctx.beginPath();
				ctx.moveTo(l+0.3*w,t+0.5*h);
				ctx.lineTo(l+0.7*w,t+0.5*h);
				ctx.stroke();				
				break;
		}
	}
}

function flattenCanvases(canvas1, canvas2, offsetLeft, offsetTop) {
	if (typeof offsetLeft !== 'number') {
		if (typeof canvas1.data == 'object' && typeof canvas2.data == 'object') {
			var offsetLeft = canvas2.data[100] - canvas1.data[100];
		} else {
			var offsetLeft = 0;
		}
	}
	if (typeof offsetTop !== 'number') {
		if (typeof canvas1.data == 'object' && typeof canvas2.data == 'object') {
			var offsetTop = canvas2.data[101] - canvas1.data[101];
		} else {
			var offsetTop = 0;
		}
	}
	var ctx = canvas1.getContext('2d');
	ctx.drawImage(canvas2, offsetLeft, offsetTop);
}

function calcCursorPositions() {
	draw.updateAllBorders();
	var pos = [];
	if (un(draw.cursors)) draw.cursors = {default:'default'};
	
	pos.push({shape:'rect',dims:[0,0,draw.drawArea[2],draw.drawArea[3]],cursor:draw.cursors.default});
	
	switch (draw.drawMode) {
		case 'grid-drawLineSegment':
		case 'grid-drawLineSegmentPoints':
			for (var p = 0; p < draw.path.length; p++) {
				var path = draw.path[p];
				for (var o = 0; o < path.obj.length; o++) {
					var obj = path.obj[o];
					if (['grid','simpleGrid'].includes(obj.type)) {
						pos.push({shape:'rect',dims:[obj.left-20,obj.top-20,obj.width+40,obj.height+40],cursor:'url('+draw.lineCursor+') '+draw.lineCursorHotspot[0]+' '+draw.lineCursorHotspot[1]+', auto',func:draw.grid.gridPathStart,obj:obj,highlight:-1,mode:draw.drawMode});
					}
				}
			}
			break;
		case 'grid-move':
			for (var p = 0; p < draw.path.length; p++) {
				var path = draw.path[p];
				for (var o = 0; o < path.obj.length; o++) {
					var obj = path.obj[o];
					if (['grid','simpleGrid'].includes(obj.type)) {
						pos.push({shape:'rect',dims:[obj.left-20,obj.top-20,obj.width+40,obj.height+40],cursor:draw.cursors.move1,func:draw.grid.moveStart,obj:obj,highlight:-1,mode:draw.drawMode});
					}
				}
			}
			break;
		case 'floodFill':
			pos.push({shape:'rect',dims:draw.drawArea,cursor:draw.cursors.fill,func:drawClickFloodFillClick,highlight:-1});
			break;
		case 'pen':
			pos.push({shape:'rect',dims:draw.drawArea,cursor:draw.cursors.pen,func:drawClickStartDraw,highlight:-1});
			break;
		case 'line':
		case 'rect':
		case 'square':
		case 'circle':
		case 'ellipse':
		case 'polygon':
		case 'point':
			pos.push({shape:'rect',dims:draw.drawArea,cursor:'url('+draw.lineCursor+') '+draw.lineCursorHotspot[0]+' '+draw.lineCursorHotspot[1]+', auto',func:drawClickStartDraw,highlight:-1});
			break;
		case 'grid-resize':
			for (var i = 0; i < draw.path.length; i++) {
				var path = draw.path[i];
				if (path.selected == true) {	
					var obj = path.obj[0];
					pos.push({shape:'rect',dims:[obj.left,obj.top,obj.width,obj.height],cursor:draw.cursors.move1,func:drawClickGridStartDrag,pathNum:i});
					pos.push({shape:'rect',dims:[obj.xZero-15,obj.top,30,obj.height],cursor:draw.cursors.ns,func:drawClickGridStartRescaleY,pathNum:i});
					pos.push({shape:'rect',dims:[obj.left,obj.yZero-15,obj.width,30],cursor:draw.cursors.ew,func:drawClickGridStartRescaleX,pathNum:i});	

					if (path.borderButtons !== 'undefined') {
						for (var j = 0; j < path.borderButtons.length; j++) {
							if (['grid-resize','grid-xMajorPlus','grid-xMajorMinus','grid-xMinorPlus','grid-xMinorMinus','grid-yMajorPlus','grid-yMajorMinus','grid-yMinorPlus','grid-yMinorMinus'].indexOf(path.borderButtons[j].buttonType) > -1) {
								pos.push(path.borderButtons[j]);
							}
						}
					}
				}
			}				
			break;
		case 'grid-plot':
			for (var i = 0; i < draw.path.length; i++) {
				var path = draw.path[i];
				if (path.selected == true) {	
					var obj = path.obj[0];
					pos.push({shape:'rect',dims:[obj.left,obj.top,obj.width,obj.height],cursor:draw.cursors.pointer,func:drawClickGridPlotPoint,pathNum:i});

					if (path.borderButtons !== 'undefined') {
						for (var j = 0; j < path.borderButtons.length; j++) {
							if (path.borderButtons[j].buttonType == 'grid-plot') pos.push(path.borderButtons[j]);
						}
					}
				}
			}				
			break;
		case 'grid-lineSegment':
			for (var i = 0; i < draw.path.length; i++) {
				var path = draw.path[i];
				if (path.selected == true) {	
					var obj = path.obj[0];
					
					// draw line segment start
					pos.push({shape:'rect',dims:[obj.left,obj.top,obj.width,obj.height],cursor:draw.cursors.pointer,func:drawClickGridStartLineSegment,pathNum:i});

					if (path.borderButtons !== 'undefined') {
						for (var j = 0; j < path.borderButtons.length; j++) {
							if (path.borderButtons[j].buttonType == 'grid-lineSegment') pos.push(path.borderButtons[j]);
						}
					}
				}
			}				
			break;
		case 'grid-line':
			for (var i = 0; i < draw.path.length; i++) {
				var path = draw.path[i];
				if (path.selected == true) {	
					var obj = path.obj[0];
					
					// draw line start
					pos.push({shape:'rect',dims:[obj.left,obj.top,obj.width,obj.height],cursor:draw.cursors.pointer,func:drawClickGridStartLine,pathNum:i});

					if (path.borderButtons !== 'undefined') {
						for (var j = 0; j < path.borderButtons.length; j++) {
							if (path.borderButtons[j].buttonType == 'grid-line') pos.push(path.borderButtons[j]);
						}
					}
				}
			}				
			break;
		case 'zoom':
			pos.push({shape:'rect',dims:[0,0,draw.drawArea[2],draw.drawArea[3]],cursor:draw.cursors.default,func:drawClickStartZoomRect,highlight:-1});
			break;
		case 'select':
		case 'textEdit':
			pos.push({shape:'rect',dims:[0,0,draw.drawArea[2],draw.drawArea[3]],cursor:draw.cursors.default,func:drawClickStartSelectRect,highlight:-1});
			var pos2 = [];
						
			//unselected
			for (var i = 0; i < draw.path.length; i++) {
				var path = draw.path[i];
				if (getPathVis(path) == false) continue;
				if (path.notesOverlay === true && draw.notesOverlay !== true) continue;
				//if ((draw.ansMode == true && draw.showAns == false) && !un(path.trigger) && path.trigger[0] == false) continue;
				if (path.selected == true) continue;
				if (!un(path.isInput) && path.isInput._mode === 'addAnswers') continue;
				for (var j = 0; j < path.obj.length; j++) {
					var obj = path.obj[j];
					if (!un(draw[obj.type]) && !un(draw[obj.type].getCursorPositionsUnselected)) {
						pos = pos.concat(draw[obj.type].getCursorPositionsUnselected(obj,i));
						continue;
					}
					switch (obj.type) {
						case 'pen' :
							pos.push({shape:'path',dims:[obj.pos,draw.selectTolerance],cursor:draw.cursors.pointer,func:drawClickSelect,pathNum:i,highlight:-1});
							break;
						case 'line' :
							pos.push({shape:'line',dims:[obj.startPos,obj.finPos,draw.selectTolerance],cursor:draw.cursors.pointer,func:drawClickSelect,pathNum:i,highlight:-1});
							break;
						case 'rect' :
						case 'square' :
							var x1 = obj.startPos[0];
							var y1 = obj.startPos[1];
							var x2 = obj.finPos[0];
							var y2 = obj.finPos[1];
							if (obj.fillColor !== 'none') {
								pos.push({shape:'rect',dims:[x1,y1,(x2-x1),(y2-y1)],cursor:draw.cursors.pointer,func:drawClickSelect,pathNum:i,highlight:-1});
							} else {
								pos.push({shape:'openRect',dims:[x1,y1,(x2-x1),(y2-y1),draw.selectTolerance],cursor:draw.cursors.pointer,func:drawClickSelect,pathNum:i,highlight:-1});
							}
							break;
						case 'circle' :
							if (obj.fillColor !== 'none') {
								pos.push({shape:'circle',dims:[obj.center[0],obj.center[1],obj.radius],cursor:draw.cursors.pointer,func:drawClickSelect,pathNum:i,highlight:-1});
							} else {
								pos.push({shape:'openCircle',dims:[obj.center[0],obj.center[1],obj.radius,draw.selectTolerance],cursor:draw.cursors.pointer,func:drawClickSelect,pathNum:i,highlight:-1});
							}
							break;
						case 'ellipse' :
							if (obj.fillColor !== 'none') {
								pos.push({shape:'ellipse',dims:[obj.center[0],obj.center[1],obj.radiusX,obj.radiusY],cursor:draw.cursors.pointer,func:drawClickSelect,pathNum:i,highlight:-1});
							} else {
								pos.push({shape:'ellipse',dims:[obj.center[0],obj.center[1],obj.radiusX,obj.radiusY,draw.selectTolerance],cursor:draw.cursors.pointer,func:drawClickSelect,pathNum:i,highlight:-1});
							}
							break;
						case 'curve' :
							pos.push({shape:'path',dims:[obj.points,draw.selectTolerance],cursor:draw.cursors.pointer,func:drawClickSelect,pathNum:i,highlight:1});
							break;
						case 'text2' :
							var dims = clone(obj._tightRect);
							var dims2 = clone(obj.rect);
							pos.push({shape:'rect',dims:dims2,cursor:draw.cursors.pointer,func:drawClickSelect,obj:obj,pathNum:i,highlight:-1});
							pos.push({shape:'rect',dims:dims,cursor:draw.cursors.text,func:textEdit.selectStart,obj:obj,pathNum:i,highlight:-1});
							break;
						case 'table2' :
						case 'qTable' :
							for (var r = 0; r < obj.cells.length; r++) {
								for (var c = 0; c < obj.cells[r].length; c++) {
									//console.log(r,c,obj.cells[r][c],obj.cells[r][c].tightRect);
									pos.push({shape:'rect',dims:obj.cells[r][c].tightRect,cursor:draw.cursors.text,func:textEdit.tableSelectStart,pathNum:i,obj:obj,cell:[r,c]});
								}
							}
							var xPos = draw.table2.getXPos(obj);
							var yPos = draw.table2.getYPos(obj);
							pos.push({shape:'table',dims:[obj.left,obj.top,obj.width,obj.height,draw.selectTolerance],xPos:xPos,yPos:yPos,cursor:draw.cursors.pointer,func:drawClickSelect,pathNum:i,highlight:-1});
							break;
						default :
							if (obj.type === 'grid' && obj._interactMode === 'move') {
								pos.push({shape:'rect',dims:[obj.left,obj.top,obj.width,obj.height],cursor:draw.cursors.move1,func:draw.grid.moveStart,pathNum:i,obj:obj,highlight:-1});
							} else if (!un(obj._left) && !un(obj._top) && !un(obj._width) && !un(obj._height)) {
								pos.push({shape:'rect',dims:[obj._left,obj._top,obj._width,obj._height],cursor:draw.cursors.pointer,func:drawClickSelect,pathNum:i,highlight:-1});
							} else if (!un(obj.left) && !un(obj.top) && !un(obj.width) && !un(obj.height)) {
								pos.push({shape:'rect',dims:[obj.left,obj.top,obj.width,obj.height],cursor:draw.cursors.pointer,func:drawClickSelect,pathNum:i,highlight:-1});
							} else if (!un(draw[obj.type]) && !un(draw[obj.type].getRect)) {
								pos.push({shape:'rect',dims:draw[obj.type].getRect(obj),cursor:draw.cursors.pointer,func:drawClickSelect,pathNum:i,highlight:-1});
							} else {
								//pos.push({shape:'rect',dims:clone(path.border),cursor:draw.cursors.pointer,func:drawClickSelect,pathNum:i,highlight:-1});
							}
							//pos.push({shape:'rect',dims:path.border,cursor:draw.cursors.pointer,func:drawClickSelect,pathNum:i,highlight:-1});
							break;
					}
				}
			}					
			
			//selected
			for (var i = 0; i < draw.path.length; i++) {
				var path = draw.path[i];
				if (draw.ansMode == true && draw.showAns == false && !un(path.trigger) && path.trigger[0] == false) continue;
				if (!un(path.isInput) && path.isInput._mode === 'addAnswers') continue;
				if (path.selected == true) {
					pos.push({shape:'rect',dims:[path.border[0],path.border[1],path.border[2],path.border[3]],cursor:draw.cursors.move1,func:drawClickStartDragObject,pathNum:i,highlight:-1});
					
					for (var o = 0; o < path.obj.length; o++) {
						var obj = path.obj[o];
						if (obj.type === 'grid' && obj._interactMode === 'move') {
							pos.push({shape:'rect',dims:[obj.left,obj.top,obj.width,obj.height],cursor:draw.cursors.move1,func:draw.grid.moveStart,pathNum:i,obj:obj,highlight:-1});
						}
					}
					
					if (draw.rotationMode == true) {
						pos.push({shape:'circle',dims:[path.border[0]+0.5*path.border[2],path.border[1]-30,10],cursor:draw.cursors.rotate,func:draw.rotateStart,pathNum:i});
					}
					
					if (path.obj.length == 1) {
						var obj = path.obj[0];
						if (obj.visible === false) continue;
						if (!un(draw[obj.type]) && !un(draw[obj.type].getCursorPositionsSelected)) {
							pos = pos.concat(draw[obj.type].getCursorPositionsSelected(obj,i));
						}
					}
										
					if (typeof path.borderButtons == 'object') {
						for (var j = 0; j < path.borderButtons.length; j++) {
							pos.push(path.borderButtons[j]);
						}
					}
				}
			}
			pos = pos2.concat(pos);
			break;
		case 'selectDrag': // if an object is being dragged
			pos.push({shape:'rect',dims:draw.drawArea,cursor:draw.cursors.move2});
			break;
		case 'textStart':
			pos.push({shape:'rect',dims:draw.drawArea,cursor:'text',func:draw.text2.start,pathNum:draw.path.length});
			break;
		case 'table' :
		case 'tableChange' :
		case 'tableBorders' :
		case 'tableCellColor' :
			pos.push({shape:'rect',dims:draw.drawArea,cursor:draw.cursors.default,func:tableMenuClose});
			break;
		case 'none':
		default:
			break;
	}
	if (draw.mode == 'interact') {
		if (!un(draw.pathCursorOrder)) {
			for (var p = 0; p < draw.pathCursorOrder.length; p++) {
				var path = draw.pathCursorOrder[p];
				if (path._visible === false) continue;
				var visible = false;
				for (var o = 0; o < path.obj.length; o++) {
					var obj = path.obj[o];
					if (un(obj.visible) || obj.visible == true) visible = true;
				}
				if (visible == false) continue;
				var pathInteract = draw.getPathInteract(path);
				if (pathInteract.type == 'check') {
					pos.push({shape:'rect',dims:obj.rect,cursor:draw.cursors.pointer,func:draw.interact.checkPage,interact:true,path:path});
				}
				
				if (pathInteract.allowInteraction !== false && pathInteract.disabled !== true && pathInteract._disabled !== true) {
					if (typeof pathInteract.dragPathCircle == 'string') {
						var circleObj = draw.getObjById(pathInteract.dragPathCircle);
						if (circleObj !== false) {
							pos.push({shape:'rect',dims:clone(path.border.slice(0,4)),cursor:draw.cursors.move1,func:draw.interact.dragStart,interact:true,path:path,dragType:'circle',center:circleObj.center,radius:circleObj.radius,circle:circleObj});
						}
					} else if (typeof pathInteract.dragPathLineSegment == 'string') {
						var lineSegmentObj = draw.getObjById(pathInteract.dragPathLineSegment);
						if (lineSegmentObj !== false) {
							pos.push({shape:'rect',dims:clone(path.border.slice(0,4)),cursor:draw.cursors.move1,func:draw.interact.dragStart,interact:true,path:path,dragType:'lineSegment',lineSegment:lineSegmentObj});
						}
					} else if (pathInteract.draggable == true) {
						pos.push({shape:'rect',dims:clone(path.tightBorder.slice(0,4)),cursor:draw.cursors.move1,func:draw.interact.dragStart,interact:true,path:path});
					}
					if (pathInteract.drag3d == true) {
						pos.push({shape:'rect',dims:clone(path.border.slice(0,4)),cursor:draw.cursors.move1,func:draw.three.drag3dStart,interact:true,path:path,obj:path.obj[0]});
					}
					if (pathInteract.cubeBuilding == 'build') {
						var positions = draw.three.cubeDrawing.getCursorPositionsBuild(path.obj[0]);
						draw.color = '#000';
						draw.cursors.update();
						for (var p2 = 0; p2 < positions.length; p2++) {
							pos.push({shape:'polygon',dims:positions[p2].pos2d,cursor:'url('+draw.lineCursor+') '+draw.lineCursorHotspot[0]+' '+draw.lineCursorHotspot[1]+', auto',func:draw.three.cubeDrawing.click,interact:true,path:path,obj:path.obj[0],position:positions[p2],mode:'build'});
						}
					} else if (pathInteract.cubeBuilding == 'remove') {
						var positions = draw.three.cubeDrawing.getCursorPositionsRemove(path.obj[0]);
						draw.color = '#F00';
						draw.cursors.update();
						for (var p2 = 0; p2 < positions.length; p2++) {
							pos.push({shape:'polygon',dims:positions[p2].pos2d,cursor:'url('+draw.lineCursor+') '+draw.lineCursorHotspot[0]+' '+draw.lineCursorHotspot[1]+', auto',func:draw.three.cubeDrawing.click,interact:true,path:path,obj:path.obj[0],position:positions[p2],mode:'remove'});
						}
					} else if (pathInteract.edit3dShape == true) {
						pos = pos.concat(draw.three.getCursorPositionsSelected(path.obj[0],p,true));
					}
					if (typeof pathInteract.click == 'function') {
						pos.push({shape:'rect',dims:clone(path.border.slice(0,4)),cursor:draw.cursors.pointer,func:draw.interact.click,click:pathInteract.click,interact:true,path:path,obj:path.obj[0]});
					}
				}
				for (var o2 = 0; o2 < path.obj.length; o2++) {
					var obj = path.obj[o2];
					var isOverlayObj = false;
					if (!un(path.interact) && path.interact.overlay == true) isOverlayObj = true;
					if (!un(obj.interact) && obj.interact.overlay == true) isOverlayObj = true;
					if (obj.type == 'dropMenu') isOverlayObj = true;
					if (isOverlayObj == true) continue;
					if (typeof draw[obj.type].getCursorPositionsInteract == 'function') {
						pos = pos.concat(draw[obj.type].getCursorPositionsInteract(obj,path,p));
					}
					if (!un(obj._cursorPos)) {
						pos = pos.concat(obj._cursorPos);
					}
					var objInteract = draw.getObjInteract(obj);
					if (obj.type == 'slider') {
						//pos.push({shape:'circle',dims:obj._pos,cursor:draw.cursors.move1,func:draw.slider.dragStart,interact:true,path:path,obj:obj});
					} else if (objInteract.allowInteraction === false || objInteract.disabled === true || objInteract._disabled === true) {
						continue;
					} else if (obj.type == 'grid' || obj.type == 'simpleGrid') {
						if (['lineSegment','lineSegmentPoints','line','linePoints','point'].indexOf(objInteract.type) > -1) {
							pos.push({shape:'rect',dims:[obj.left-20,obj.top-20,obj.width+40,obj.height+40],cursor:'url('+draw.lineCursor+') '+draw.lineCursorHotspot[0]+' '+draw.lineCursorHotspot[1]+', auto',func:draw.grid.gridPathStart,obj:obj,highlight:-1,mode:objInteract.type});
						}
						
					} else if (!un(objInteract.click) && objInteract.click.length > 0) {
						pos.push({shape:'rect',dims:draw[obj.type].getRect(obj),cursor:draw.cursors.pointer,func:draw.interact.click,interact:true,path:path,obj:obj});
					} else if (typeof objInteract.click == 'function') {
						pos.push({shape:'rect',dims:draw[obj.type].getRect(obj),cursor:draw.cursors.pointer,func:draw.interact.click,click:objInteract.click,interact:true,path:path,obj:obj});
					}
				}			
			}
			
			for (var p = 0; p < draw.path.length; p++) {
				var path = draw.path[p];
				if (un(path.appear)) continue;
				var visible = boolean(path._visible,false);
				if (visible == true && path.appear.reversible !== true) continue;
				if (typeof path.appear.visible == 'function' && path.appear.visible(path) === false) continue;
				if (typeof path.appear.visible == 'string' && getPathVis(path.appear.visible) == false) continue;
				if (un(path.appear.pos)) {
					if (un(path.border)) updateBorder(path);
					if (un(path.border)) continue;
					var l = path.border[0]+0.5*path.border[2]-20;
					var t = path.border[1]+0.5*path.border[3]-20;
				} else {
					var l = path.appear.pos[0]-20;
					var t = path.appear.pos[1]-20;
				}
				pos.push({shape:'rect',dims:[l,t,40,40],cursor:draw.cursors.pointer,func:draw.interact.appear,interact:true,path:path});
			}
		}
		for (var p = 0; p < draw.path.length; p++) { // add cursor positions for overlay buttons
			var path = draw.path[p];
			for (var o = 0; o < path.obj.length; o++) {
				var obj = path.obj[o];
				var isOverlayObj = false;
				if (!un(path.interact) && path.interact.overlay == true) isOverlayObj = true;
				if (!un(obj.interact) && obj.interact.overlay == true) isOverlayObj = true;
				if (obj.type == 'dropMenu') isOverlayObj = true;
				if (obj.visible === false || isOverlayObj == false) continue;
				if (obj.type == 'colorPicker' && draw.colorSelectVisible == false) continue;
				if (obj.type == 'lineWidthSelect' && draw.lineWidthSelectVisible == false) continue;
				if (typeof draw[obj.type].getCursorPositionsInteract == 'function') {
					pos = pos.concat(draw[obj.type].getCursorPositionsInteract(obj,path,p));
				}
				if (obj.type == 'slider') {
					pos.push({shape:'circle',dims:obj._pos,cursor:draw.cursors.move1,func:draw.slider.dragStart,interact:true,path:path,obj:obj});
				} else if (!un(obj.interact) && !un(obj.interact.click) && obj.interact.click.length > 0) {
					pos.push({shape:'rect',dims:draw[obj.type].getRect(obj),cursor:draw.cursors.pointer,func:draw.interact.click,interact:true,path:path,obj:obj});
				} else if (!un(obj.interact) && typeof obj.interact.click == 'function') {
					pos.push({shape:'rect',dims:draw[obj.type].getRect(obj),cursor:draw.cursors.pointer,func:draw.interact.click,click:obj.interact.click,interact:true,path:path,obj:obj});
				}
			}
		}
		
	} else {
		for (var p = 0; p < draw.path.length; p++) {
			var path = draw.path[p];
			if (!un(path.isInput) && path.isInput._mode === 'addAnswers') {
				if (path.isInput.type === 'drag') {
					pos.push({shape:'rect',dims:path.tightBorder.slice(0,4),cursor:draw.cursors.move1,func:draw.interact.dragStart,path:draw.path[p]});
					continue;
				} else if (path.isInput.type === 'grid') {
					var pos2 = draw.grid.getCursorPositionsInteract(path.obj[0],path,p);
					pos = pos.concat(pos2);
					continue;
				}
			}
			for (var o2 = 0; o2 < path.obj.length; o2++) {
				var obj = path.obj[o2];
				if (!un(obj._cursorPos)) pos = pos.concat(obj._cursorPos);
			}
		}
		for (var p = 0; p < draw.path.length; p++) { // add cursor positions for appear buttons
			var path = draw.path[p];
			if (un(path.appear)) continue;
			if (un(path.appear.pos)) {
				var l = path.border[0]+0.5*path.border[2]-20;
				var t = path.border[1]+0.5*path.border[3]-20;
			} else {
				var l = path.appear.pos[0]-20;
				var t = path.appear.pos[1]-20;
			}
			pos.push({buttonType:'appear-dont-draw',shape:'rect',dims:[l,t,40,40],cursor:draw.cursors.move1,func:drawClickAppearMoveStart,pathNum:p});
		}
	}	
	if (!un(draw.controlPanel)) pos = pos.concat(draw.controlPanel.cursorPositions);

	draw.cursorPositions = pos;
	//console.log(pos);
}
draw.getPathInteract = function(path) {
	var interact = {};
	for (var o2 = 0; o2 < path.obj.length; o2++) {
		var obj = path.obj[o2];
		if (!un(obj.interact)) {
			for (var key in obj.interact) {
				if (key === 'click') continue;
				if (un(interact[key])) {
					interact[key] = obj.interact[key];
				}
			}
		}
	}
	if (!un(path.isInput)) {
		for (var key in path.isInput) {
			interact[key] = path.isInput[key];
		}
	}
	if (!un(path.interact)) {
		for (var key in path.interact) {
			interact[key] = path.interact[key];
		}
	}
	return interact;
}
draw.getObjInteract = function(obj) {
	var interact = {};
	if (!un(obj.interact)) {
		for (var key in obj.interact) {
			if (un(interact[key])) {
				interact[key] = obj.interact[key];
			}
		}
	}
	return interact;
}
function drawCanvasMove(e) {
	e.preventDefault();
	if (typeof draw == 'undefined' || draw.drawing == true || ['tableColResize','tableRowResize','gridDrag','gridRecaleX','gridRecaleY','compassMove1','compassMove2','compassDraw','protractorRotate','protractorMove','rulerRotate','rulerMove','selectDrag','selectRect','selectResize','tableInputSelect','tableCellSelect','tableColSelect','tableRowSelect','textInputSelect'].indexOf(draw.drawMode) > -1) return;
	//console.log(draw.drawMode);

	updateMouse(e);
	var x = draw.mouse[0];
	var y = draw.mouse[1];
	//var x = mouse.x - draw.drawRelPos[0];
	//var y = mouse.y - draw.drawRelPos[1];
	draw.currCursor = getCursorAtPosition(x,y);
	draw.cursorCanvas.style.cursor = draw.currCursor.cursor;
	//console.log(draw.currCursor,draw.cursorCanvas.style.cursor);
	cursorPosHighlight();
}
function drawCanvasStart(e) {
	updateMouse(e);
	calcCursorPositions();
	var x = draw.mouse[0];
	var y = draw.mouse[1];
	draw.currCursor = getCursorAtPosition(x,y);	// necessary for touch events, where move function will not have run
	draw.table2.deselectTables();
	if (!un(draw.currCursor)) {
		if (un(draw.currCursor.obj) || (draw.currCursor.obj.type !== 'colorPicker' && draw.currCursor.obj.type !== 'buttonColorPicker')) {
			draw.colorSelectVisible = false;
		}
		if (un(draw.currCursor.obj) || (draw.currCursor.obj.type !== 'lineWidthSelect' && draw.currCursor.obj.type !== 'buttonLineWidthPicker')) {
			draw.lineWidthSelectVisible = false;
		}
		
		
		if (!un(draw.currCursor.func)) {
			draw.currCursor.func.apply();
			if (draw.currCursor.interact == true) draw.interact.update();
		} else {
			drawCanvasPaths();
		}
	} else {
		draw.colorSelectVisible = false;
		draw.lineWidthSelectVisible = false;
		drawCanvasPaths();
	}
}
function showCursorPositions() {
	var ctx = draw.drawCanvas.last().ctx;
	ctx.scale(draw.scale,draw.scale);	
	//ctx.clearRect(draw.drawArea[0],draw.drawArea[1],draw.drawArea[2],draw.drawArea[3]);
	var colorMove = colorA('#00F',0.3);
	var colorPointer = colorA('#F00',0.3);
	var colorText = colorA('#0F0',0.3);
	var colorMisc = colorA('#FF0',0.3);
	for (var i = 0; i < draw.cursorPositions.length; i++) {
		var pos = draw.cursorPositions[i];
		if (pos.cursor == draw.cursors.move1) {
			ctx.fillStyle = colorMove;
		} else if (pos.cursor == draw.cursors.pointer) {
			ctx.fillStyle = colorPointer;
		} else if (pos.cursor == 'text') {
			ctx.fillStyle = colorText;
		} else {
			ctx.fillStyle = colorMisc;
		}
		
		if (pos.shape == 'rect') {
			ctx.fillRect(pos.dims[0],pos.dims[1],pos.dims[2],pos.dims[3]);
		} else if (pos.shape == 'circle') {
			ctx.beginPath();
			ctx.arc(pos.dims[0],pos.dims[1],pos.dims[2],0,2*Math.PI);
			ctx.fill();
		} else if (pos.shape == 'line') {
			
		}
	}
	ctx.setTransform(1, 0, 0, 1, 0, 0);
}
function getCursorAtPosition(x,y) {
	var overTool = isPosOverTool(x-draw.drawArea[0],y-draw.drawArea[1]);
	if (typeof overTool == 'object' || overTool !== false) return overTool;
	if (typeof draw.cursorPositions == 'undefined') calcCursorPositions();
	var pos = draw.cursorPositions;
	var currPos = {cursor:draw.cursors.default,func:function(){}};
	var x2 = x-draw.drawArea[0];
	var y2 = y-draw.drawArea[1];
	for (var i = 0; i < pos.length; i++) {
		if (draw.cursorPosHitTest(pos[i],x2,y2) == true) {
			pos[i].pos = i;
			currPos = pos[i];
		}
		/*
		var dims = clone(pos[i].dims);
		if (typeof dims == 'undefined') continue;
		//console.log(i,pos[i],pos[i].dims);
		if (pos[i].shape == 'table') {
			for (var x = 0; x < pos[i].xPos.length; x++) {
				var x3 = pos[i].xPos[x];
				if (distancePointToLineSegment([x2,y2],[x3,dims[1]],[x3,dims[1]+dims[3]]) < dims[4]) {
					pos[i].pos = i;
					currPos = pos[i];
					break;
				}
			}
			for (var y = 0; y < pos[i].yPos.length; y++) {
				var y3 = pos[i].yPos[y];
				if (distancePointToLineSegment([x2,y2],[dims[0],y3],[dims[0]+dims[2],y3]) < dims[4]) {
					pos[i].pos = i;
					currPos = pos[i];
					break;
				}				
			}
		} else if ((pos[i].shape == 'rect' && x2 >= dims[0] && x2 <= (dims[0]+dims[2]) && y2 >= dims[1] && y2 <= (dims[1]+dims[3])) ||
			(pos[i].shape == 'openRect' && 
				(distancePointToLineSegment([x2,y2],[dims[0],dims[1]],[dims[0]+dims[2],dims[1]]) < dims[4]) ||
				(distancePointToLineSegment([x2,y2],[dims[0]+dims[2],dims[1]],[dims[0]+dims[2],dims[1]+dims[3]]) < dims[4]) ||
				(distancePointToLineSegment([x2,y2],[dims[0]+dims[2],dims[1]+dims[3]],[dims[0],dims[1]+dims[3]]) < dims[4]) ||
				(distancePointToLineSegment([x2,y2],[dims[0],dims[1]+dims[3]],[dims[0],dims[1]]) < dims[4])
			) ||
			(pos[i].shape == 'circle' && dist(x2,y2,dims[0],dims[1]) <= dims[2]) ||
			(pos[i].shape == 'sector' && isPointInSector([x2,y2],dims) == true) ||
			(pos[i].shape == 'openCircle' && dist(x2,y2,dims[0],dims[1]) >= dims[2]-dims[3] && dist(x2,y2,dims[0],dims[1]) <= dims[2]+dims[3]) ||
			(pos[i].shape == 'ellipse' && isPointInEllipse([x2,y2],[dims[0],dims[1]],dims[2],dims[3]) == true) ||
			(pos[i].shape == 'openEllipse' && isPointOnEllipse([x2,y2],[dims[0],dims[1]],dims[2],dims[3],dims[4]) == true) ||
			(pos[i].shape == 'line' && (distancePointToLineSegment([x2,y2],dims[0],dims[1]) < dims[2])) ||
			(pos[i].shape == 'path' && (distancePointToPath([x2,y2],dims[0]) <= dims[1])) ||
			(pos[i].shape == 'polygon' && hitTestPolygon([x2,y2],dims,true) == true)
		) {
			pos[i].pos = i;
			currPos = pos[i];
		}
		*/
	}
	//console.log(currPos,x2,y2);
	return currPos;
}
draw.cursorPosHitTest = function(pos,x,y) {
	var dims = clone(pos.dims);
	if (typeof dims == 'undefined') return false;
	if (pos.shape == 'table') {
		if (typeof pos.xPos !== 'undefined' && typeof pos.yPos !== 'undefined') {
			for (var c = 0; c < pos.xPos.length; c++) {
				var x3 = pos.xPos[c];
				if (distancePointToLineSegment([x,y],[x3,dims[1]],[x3,dims[1]+dims[3]]) < dims[4]) return true;
			}
			for (var r = 0; r < pos.yPos.length; r++) {
				var y3 = pos.yPos[r];
				if (distancePointToLineSegment([x,y],[dims[0],y3],[dims[0]+dims[2],y3]) < dims[4]) return true;
			}
		}
	} else if ((pos.shape == 'rect' && x >= dims[0] && x <= (dims[0]+dims[2]) && y >= dims[1] && y <= (dims[1]+dims[3])) ||
		(pos.shape == 'openRect' && 
			(distancePointToLineSegment([x,y],[dims[0],dims[1]],[dims[0]+dims[2],dims[1]]) < dims[4]) ||
			(distancePointToLineSegment([x,y],[dims[0]+dims[2],dims[1]],[dims[0]+dims[2],dims[1]+dims[3]]) < dims[4]) ||
			(distancePointToLineSegment([x,y],[dims[0]+dims[2],dims[1]+dims[3]],[dims[0],dims[1]+dims[3]]) < dims[4]) ||
			(distancePointToLineSegment([x,y],[dims[0],dims[1]+dims[3]],[dims[0],dims[1]]) < dims[4])
		) ||
		(pos.shape == 'circle' && dist(x,y,dims[0],dims[1]) <= dims[2]) ||
		(pos.shape == 'sector' && isPointInSector([x,y],dims) == true) ||
		(pos.shape == 'openCircle' && dist(x,y,dims[0],dims[1]) >= dims[2]-dims[3] && dist(x,y,dims[0],dims[1]) <= dims[2]+dims[3]) ||
		(pos.shape == 'ellipse' && isPointInEllipse([x,y],[dims[0],dims[1]],dims[2],dims[3]) == true) ||
		(pos.shape == 'openEllipse' && isPointOnEllipse([x,y],[dims[0],dims[1]],dims[2],dims[3],dims[4]) == true) ||
		(pos.shape == 'line' && (distancePointToLineSegment([x,y],dims[0],dims[1]) < dims[2])) ||
		(pos.shape == 'path' && (distancePointToPath([x,y],dims[0]) <= dims[1])) ||
		(pos.shape == 'polygon' && hitTestPolygon([x,y],dims,true) == true)
	) {
		 return true;
	}
	return false;
}
function cursorPosHighlight(clr) {
	return;
	if (draw.highlightCursorPositions == false) return;
	if (un(draw.cursorPosHighlight)) {
		draw.cursorPosHighlight = newctx({z:99999999});
		var ctx = draw.cursorPosHighlight;
		ctx.lineWidth = draw.selectTolerance * 2;
		ctx.strokeStyle = colorA('#FF0',0.4);
		ctx.fillStyle = colorA('#FF0',0.4);		
	}
	var ctx = draw.cursorPosHighlight;
	ctx.clear();
	
	if (boolean(clr,false) == true) return;
	var c = draw.currCursor;
	if (c.cursor == 'default' || c.cursor == 'move1') return;
	if (draw.highlightCursorPositions == 'part' && c.highlight == -1) return;
	switch (c.shape) {
		case 'rect':
			ctx.fillRect(c.dims[0],c.dims[1],c.dims[2],c.dims[3]);
			break;
		case 'openRect':
			ctx.strokeRect(c.dims[0],c.dims[1],c.dims[2],c.dims[3]);			
			break;
		case 'circle':
			ctx.beginPath();
			ctx.arc(c.dims[0],c.dims[1],c.dims[2],0,2*Math.PI);
			ctx.fill();
			break;
		case 'sector':
			ctx.beginPath();
			ctx.moveTo(c.dims[0],c.dims[1]);
			ctx.lineTo(c.dims[0]+c.dims[2]*Math.cos(c.dims[3]),c.dims[1]+c.dims[2]*Math.sin(c.dims[3]));
			ctx.arc(c.dims[0],c.dims[1],c.dims[2],c.dims[3],c.dims[4]);
			ctx.lineTo(c.dims[0],c.dims[1]);
			ctx.fill();
			break;			
		case 'openCircle':
			ctx.beginPath();
			ctx.arc(c.dims[0],c.dims[1],c.dims[2],0,2*Math.PI);
			ctx.stroke();			
			break;
		case 'ellipse':
			
			break;
		case 'openEllipse':
			
			break;
		case 'line':
			ctx.beginPath();
			ctx.moveTo(c.dims[0][0],c.dims[0][1]);
			ctx.lineTo(c.dims[1][0],c.dims[1][1]);
			ctx.stroke();
			break;
		case 'path':
			
			break;			
	}
	
	if (draw.highlightCursorPositions == 'part') return;
	
	for (var p = c.pos+1; p < draw.cursorPositions.length; p++) {
		var c = draw.cursorPositions[p];
		switch (c.shape) {
			case 'rect':
				ctx.clearRect(c.dims[0],c.dims[1],c.dims[2],c.dims[3]);
				break;
			case 'openRect':
				clearLineRounded(ctx,c.dims[0],c.dims[1],c.dims[0]+c.dims[2],c.dims[1],draw.selectTolerance*2);
				clearLineRounded(ctx,c.dims[0]+c.dims[2],c.dims[1],c.dims[0]+c.dims[2],c.dims[1]+c.dims[3],draw.selectTolerance*2);
				clearLineRounded(ctx,c.dims[0]+c.dims[2],c.dims[1]+c.dims[3],c.dims[0],c.dims[1]+c.dims[3],draw.selectTolerance*2);
				clearLineRounded(ctx,c.dims[0],c.dims[1]+c.dims[3],c.dims[0],c.dims[1],draw.selectTolerance*2);
				break;
			case 'circle':
				clearCircle(ctx,c.dims[0],c.dims[1],c.dims[2]);
				break;
			case 'openCircle':
				
				break;
			case 'ellipse':
				
				break;
			case 'openEllipse':
				
				break;
			case 'line':
				clearLineRounded(ctx,c.dims[0][0],c.dims[0][1],c.dims[1][0],c.dims[1][1],draw.selectTolerance*2);
				break;
			case 'path':
				
				break;			
		}		
	}
}

function clearCircle(context,x,y,radius) {
	context.save();
	context.beginPath();
	context.arc(x, y, radius, 0, 2*Math.PI, true);
	context.clip();
	context.clearRect(x-radius,y-radius,radius*2,radius*2);
	context.restore();
}
function clearLineSquared(context,x1,y1,x2,y2,thickness) {
	var tmp, length;
	// swap coordinate pairs if x-coordinates are RTL to make them LTR
	if (x2 < x1) {
		tmp = x1; x1 = x2; x2 = tmp;
		tmp = y1; y1 = y2; y2 = tmp;
	}

	length = dist(x1,y1,x2,y2);

	context.save();
	context.translate(x1,y1);
	context.rotate(Math.atan2(y2-y1,x2-x1));
	context.clearRect(0,0,length,thickness);
	context.restore();
}
function clearLineRounded(context,x1,y1,x2,y2,thickness) {
	if (thickness <= 2) {
		clearLineSquared(context,x1,y1,x2,y2,thickness);
		return;
	}

	var tmp, half_thickness = thickness / 2, length,
		PI15 = 1.5 * Math.PI, PI05 = 0.5 * Math.PI
	;

	// swap coordinate pairs if x-coordinates are RTL to make them LTR
	if (x2 < x1) {
		tmp = x1; x1 = x2; x2 = tmp;
		tmp = y1; y1 = y2; y2 = tmp;
	}

	length = dist(x1,y1,x2,y2);

	context.save();
	context.translate(x1,y1);
	context.rotate(Math.atan2(y2-y1,x2-x1));
	x1 = 0;
	y1 = 0;
	x2 = length - 1;
	y2 = 0;
	// draw a complex "line" shape with rounded corner caps

	context.moveTo(x1,y1-half_thickness);
	context.lineTo(x2,y2-half_thickness);
	context.arc(x2,y2,half_thickness,PI15,PI05,false);
	context.lineTo(x1,y1-half_thickness+thickness);
	context.arc(x1,y1,half_thickness,PI05,PI15,false);
	context.closePath();
	x1 -= half_thickness;
	y1 -= half_thickness;

	context.clip();
	context.clearRect(x1,y1,length+thickness,thickness);
	context.restore();
}

draw.getPathObjTypes = function(path) {
	if (un(path)) path = draw.path;
	var types = [];
	if (path instanceof Array) {
		for (var p = 0; p < path.length; p++) processPath(path[p]);
	} else {
		processPath(path);
	}
	return types;
	
	function processPath(path2) {
		for (var o = 0; o < path2.obj.length; o++) {
			var obj = path2.obj[o];
			if (types.indexOf(obj.type) == -1) types.push(obj.type);
		}
	}
}
draw.updateAllBorders = function(paths) {
	if (un(paths)) paths = draw.path;
	for (var p = 0; p < paths.length; p++) updateBorder(paths[p]);
}
draw.updateSelectedBorders = function() {
	for (var p = 0; p < draw.path.length; p++) {
		if (draw.path[p].selected == true) updateBorder(draw.path[p]);
	}
}
function updateBorder(path,override) {
	if (un(draw.path) && boolean(override,false) == true) return;
	var x1,y1,x2,y2, buttons = [], left = [], top = [], right = [], bottom = [];
	for (var i = 0; i < path.obj.length; i++) {
		if (un(path.obj[i])) continue;
		var obj = path.obj[i];
		if (!un(draw[obj.type]) && !un(draw[obj.type].getRect)) {
			var rect = draw[obj.type].getRect(obj);
			if (!un(rect)) {
				left[i] = rect[0];
				top[i] = rect[1];
				right[i] = rect[0]+rect[2];
				bottom[i] = rect[1]+rect[3];
			}
		} else {
			left[i] = obj.left;
			top[i] = obj.top;
			right[i] = obj.left + obj.width;
			bottom[i] = obj.top + obj.height;
		}
	}
	
	var x1 = arrayMin(left);
	var y1 = arrayMin(top);
	var x2 = arrayMax(right);
	var y2 = arrayMax(bottom);	
	
	path.tightBorder = [x1,y1,x2-x1,y2-y1,x2,y2];
	path._center = [(x1+x2)/2,(y1+y2)/2];
	var padding = draw.selectPadding;
	x1 -= padding;
	y1 -= padding;
	x2 += padding;
	y2 += padding;
	path.border = [x1,y1,x2-x1,y2-y1,x2,y2];
	
	if (un(draw.path) || typeof draw.path.indexOf !== 'function') return;
	var pathNum = draw.path.indexOf(path);
	
	if (path.obj.length == 1 && (['image','rect','square','circle','ellipse','simpleGrid','anglesAroundPoint','text2','table2'].indexOf(path.obj[0].type) > -1 || path.obj[0].type == 'angle' && un(path.obj[0].d) || (!un(draw[path.obj[0].type]) && draw[path.obj[0].type].resizable == true))) {
		// resize handle in bottom right corner
		buttons.push({buttonType:'resize',shape:'rect',dims:[x2-20,y2-20,20,20],cursor:draw.cursors.nw,func:drawClickStartResizeObject,pathNum:pathNum});
	} else if (path.obj.length > 1) {
		buttons.push({buttonType:'resize-path',shape:'rect',dims:[x2-20,y2-20,20,20],cursor:draw.cursors.nw,func:drawClickStartResizePath,pathNum:pathNum});
	}
	
	if (path.obj.length == 1 && !un(draw[path.obj[0].type]) && !un(draw[path.obj[0].type].getButtons)) {
		buttons = buttons.concat(draw[path.obj[0].type].getButtons(x1,y1,x2,y2,pathNum,path));
	}
	
	if (!un(path.isInput)) {
		buttons.push({buttonType:'isInput-type',shape:'rect',dims:[(x1+x2)/2-40,y1,80,20],cursor:draw.cursors.default,func:function() {},pathNum:pathNum,type:path.isInput.type});		
		
		if (path.isInput.type == 'text' && path.obj.length == 1 && path.obj[0].type == 'text2') {
			
		} else if (!un(draw.selectInput) && path.isInput.type == 'select' && path.obj.length == 1 && path.obj[0].type == 'table2') {
			/*var obj = path.obj[0];
			for (var r = 0; r < obj.cells.length; r++) {
				for (var c = 0; c < obj.cells[r].length; c++) {
					buttons.push({buttonType:'select-input-cellToggle',shape:'rect',dims:[obj.xPos[c+1]-20,obj.yPos[r],20,20],cursor:draw.cursors.pointer,func:draw.selectInput.cellToggle,pathNum:pathNum,row:r,col:c});
				}
			}
			buttons.push({buttonType:'select-input-shuffleToggle',shape:'rect',dims:[x1+20,y2-20,60,20],cursor:draw.cursors.pointer,func:draw.selectInput.shuffleToggle,pathNum:pathNum,shuffle:path.isInput.shuffle});
			if (!un(path.isInput.selColors)) {
				buttons.push({buttonType:'select-input-selColors',shape:'rect',dims:[x1+80,y2-20,20,20],cursor:draw.cursors.pointer,func:draw.selectInput.selColors,pathNum:pathNum,selColors:path.isInput.selColors});
			}*/
		} else if (!un(draw.isInput) && path.isInput.type == 'drag') {
			buttons.push({buttonType:'isInput-drag-value',shape:'rect',dims:[x1+20,y2-20,80,20],cursor:draw.cursors.pointer,func:draw.isInput.dragSetValue,pathNum:pathNum});
			
			buttons.push({buttonType:'isInput-drag-shuffleToggle',shape:'rect',dims:[x2-80,y2-20,60,20],cursor:draw.cursors.pointer,func:draw.isInput.dragShuffleToggle,pathNum:pathNum});
			
		} else if (!un(draw.isInput) && path.isInput.type == 'dragArea') {
			//buttons.push({buttonType:'isInput-drag-value',shape:'rect',dims:[x1+20,y2-20,80,20],cursor:draw.cursors.pointer,func:draw.isInput.dragSetValue,pathNum:pathNum});
			
			buttons.push({buttonType:'isInput-dragArea-snapToggle',shape:'rect',dims:[x2-80,y2-20,60,20],cursor:draw.cursors.pointer,func:draw.isInput.dragAreaSnapToggle,pathNum:pathNum});
		}
	}

	// plus & minus zIndex buttons in bottom left corner
	buttons.push({buttonType:'orderPlus',shape:'rect',dims:[x1,y2-40,20,20],cursor:draw.cursors.pointer,func:drawClickOrderPlus,pathNum:pathNum});
	buttons.push({buttonType:'orderMinus',shape:'rect',dims:[x1,y2-20,20,20],cursor:draw.cursors.pointer,func:drawClickOrderMinus,pathNum:pathNum});
		
	// delete button in top right corner
	buttons.push({buttonType:'delete',shape:'rect',dims:[x2-20,y1,20,20],cursor:draw.cursors.pointer,func:drawClickDelete,pathNum:pathNum});
	
	if (draw.appearMode == true) {
		buttons.push({buttonType:'appear',shape:'rect',dims:[x1,y1,20,20],cursor:draw.cursors.pointer,func:drawClickAppear,pathNum:pathNum});
	} else {
		buttons.push({buttonType:'trigger',shape:'rect',dims:[x1,y1,20,20],cursor:draw.cursors.pointer,func:drawClickTrigger,pathNum:pathNum});
	}
	
	buttons.push({buttonType:'toggle-draggable',shape:'rect',dims:[x1+20,y1,20,20],cursor:draw.cursors.pointer,func:draw.togglePathDraggable,pathNum:pathNum,path:path});
	
	buttons.push({buttonType:'toggle-notesOverlay',shape:'rect',dims:[x1+40,y1,20,20],cursor:draw.cursors.pointer,func:draw.toggleNotesOverlay,pathNum:pathNum,path:path});
	
	path.borderButtons = buttons; 
	return path.border;
}
draw.toggleNotesOverlay = function() {
	var path = draw.currCursor.path;
	if (path.notesOverlay === true) {
		delete path.notesOverlay;
	} else {
		path.notesOverlay = true;
	}
	drawCanvasPaths();
}
draw.getPathFunctions = function(path) {
	var funcs = [];
	for (var key in path) if (typeof path[key] === 'function') funcs.push([path,key,'path.'+key+'()']);
	if (!un(path.interact)) {
		for (var key in path.interact) if (typeof path.interact[key] === 'function') funcs.push([path.interact,key,'path.interact.'+key+'()']);
	}
	if (!un(path.isInput)) {
		for (var key in path.isInput) if (typeof path.isInput[key] === 'function') funcs.push([path.isInput,key,'path.isInput.'+key+'()']);
	}
	return funcs;
}
draw.getObjFunctions = function(obj) {
	var funcs = [];
	for (var key in obj) if (typeof obj[key] === 'function') funcs.push([obj,key,'obj.'+key]);
	if (!un(obj.interact)) {
		for (var key in obj.interact) if (typeof obj.interact[key] === 'function') funcs.push([obj.interact,key,'obj.interact.'+key+'()']);
	}
	return funcs;
}

function cycleSelected(reverse) {
	var selected = selPathNum();
	deselectAllPaths();
	if (boolean(reverse,false) == false) {
		selected = (selected+1)%draw.path.length;
	} else {
		selected = selected-1;
		if (selected == -1) selected = draw.path.length-1;
	}
	draw.path[selected].selected = true;
	calcCursorPositions();
	drawCanvasPaths();
}
function sel() {
	if (un(draw) || un(draw.path)) return false;
	for (var p = 0; p < draw.path.length; p++) {
		if (draw.path[p].selected == true) {
			return draw.path[p].obj[0];
		}
	}
	return false;
}
function selObjs() {
	if (un(draw) || un(draw.path)) return false;
	var objs = [];
	for (var p = 0; p < draw.path.length; p++) {
		if (draw.path[p].selected == true) {
			for (var o = 0; o < draw.path[p].obj.length; o++) {
				objs.push(draw.path[p].obj[o]);
			}
		}
	}
	return objs;
}
function selPath() {
	for (var p = 0; p < draw.path.length; p++) {
		if (draw.path[p].selected == true) {
			return draw.path[p];
		}
	}
	return false;
}
function selPathNum() {
	for (var p = 0; p < draw.path.length; p++) {
		if (draw.path[p].selected == true) {
			return p;
		}
	}
	return -1;	
}
function selPathNums() {
	var nums = [];
	for (var p = 0; p < draw.path.length; p++) {
		if (draw.path[p].selected == true) nums.push(p);
	}
	return nums;
}
function selPaths() {
	if (un(draw) || un(draw.path)) return [];
	var paths = [];
	for (var p = 0; p < draw.path.length; p++) {
		if (draw.path[p].selected == true) {
			paths.push(draw.path[p]);
		}
	}
	return paths;
}

draw.undo = {
	save:true,
	saveState: function() {
		if (draw.undo.save == false) return;
		if (un(draw.undo.undoStack[0]) || draw.undo.pathsEqual(draw.path,draw.undo.undoStack[0]) == false) {
			draw.undo.undoStack.unshift(clone(draw.path));
			draw.undo.redoStack = [];
		}
	},
	undoStack:[],
	undo:function() {
		while (!un(draw.undo.undoStack[0]) && draw.undo.pathsEqual(draw.path,draw.undo.undoStack[0])) {
			draw.undo.undoStack.shift();
		}
		if (un(draw.undo.undoStack[0])) return;
		draw.undo.redoStack.unshift(clone(draw.path));
		draw.path = draw.undo.undoStack.shift();
		draw.undo.save = false;
		deselectAllPaths();
		draw.undo.save = true;
	},
	redoStack:[],
	redo:function() {
		while (!un(draw.undo.redoStack[0]) && draw.undo.pathsEqual(draw.path,draw.undo.redoStack[0])) {
			draw.undo.redoStack.shift();
		}
		if (draw.undo.redoStack.length == 0) return; 
		draw.undo.undoStack.unshift(clone(draw.path));
		draw.path = draw.undo.redoStack.shift();
		draw.undo.save = false;
		deselectAllPaths();
		draw.undo.save = true;
	},
	reset: function() {
		draw.undo.undoStack = [];
		draw.undo.redoStack = [];
	},
	pathsEqual: function(a,b) {
		if (a.length !== b.length) return false;
		for (var p = 0; p < a.length; p++) {
			var path1 = a[p];
			var path2 = b[p];
			if (path1.obj.length !== path2.obj.length) return false;
			if ((!un(path1.appear) || !un(path2.appear)) && isEqual(path1.appear,path2.appear) == false) return false;
			for (var o = 0; o < path1.obj.length; o++) {
				var obj1 = path1.obj[o];
				var obj2 = path2.obj[o];
				for (var key in obj1) {
					if (['ctx','text'].includes(key) || key.indexOf('_') == 0 || !obj1.hasOwnProperty(key)  || isElement(obj1[key])) continue;
					if (isEqual(obj1[key],obj2[key]) == false) return false;
				}
			}
		}
		return true;
	}
}
draw.scalePath = function(path,sf) {
	if (un(path.border)) updateBorder(path);
	var center = [path.border[0],path.border[1]];
	for (var o = 0; o < path.obj.length; o++) {
		var obj = path.obj[o];
		if (un(draw[obj.type]) || un (draw[obj.type].scale)) continue;
		draw[obj.type].scale(obj,sf,center);
	}
	updateBorder(path);
	drawCanvasPaths();
}

/***************************/
/*   KEYBOARD SHORTCUTS    */
/***************************/

var snapToObj2Mode = 'ctrl';
var snapToObj2On = false;
var snapBordersOn = false;
var shiftOn = false;
var ctrlOn = false;
var altOn = false;
window.addEventListener('keydown', keydown, false);
function keydown(e) {
	if (e.keyCode == 16) {
		shiftOn = true;
	} else if (e.keyCode == 17) {
		ctrlOn = true;
		snapToObj2On = true;
	} else	if (e.keyCode == 18) {
		altOn = true;
	}
	if (typeof window.keynav !== 'undefined') window.keynav(e);
}
window.addEventListener('keyup', keyup ,false);
function keyup(e) {
	if (e.keyCode == 16) {
		shiftOn = false;
	} else if (e.keyCode == 17) {
		ctrlOn = false;
		if (snapToObj2Mode == 'ctrl') snapToObj2On = false;
	} else	if (e.keyCode == 18) {
		altOn = false;
	}
}
function addKeyboardShortcuts() {
	window.addEventListener('keydown', keydown1, false);
	//window.addEventListener('keyup', keyup1, false);
}
function removeKeyboardShortcuts() {
	window.removeEventListener('keydown', keydown1, false);
	//window.removeEventListener('keyup', keyup1, false);
}
function keydown1(e) {
	if (!un(draw.codeEditor) && draw.codeEditor.div.parentNode == container) {
		if (e.key == 'Escape') draw.codeEditor.close();
		return;
	}
	if (e.target.allowDefault === true) return;
	if (textEdit.obj !== null) return;	
	if (e.key == 'Tab') {
		e.preventDefault();
		cycleSelected(e.getModifierState('Shift'));
		return;
	}
	if (e.getModifierState('Control')) {
		//console.log(e.key);
		if (e.key == 'z' || e.key == 'Z') {
			e.preventDefault();
			draw.undo.undo();
		} else if (e.key == 'y' || e.key == 'Y') {
			e.preventDefault();
			draw.undo.redo();
		} else if (e.key == 's' || e.key == 'S') {
			e.preventDefault();
			var objects = selObjs();
			for (var o = 0; o < objects.length; o++) {
				console.log(objects[o]);
			}
		} else if (e.key == 'o' || e.key == 'O') {
			e.preventDefault();
			console.log(selPath().obj);
		} else if (e.key == 'p' || e.key == 'P') {
			e.preventDefault();
			console.log(selPath());
		} else if (e.key == 'x' || e.key == 'X') {
			e.preventDefault();
			cutPaths(e);
		} else if (e.key == 'c' || e.key == 'C') {
			e.preventDefault();
			copyPaths(e);
		} else if (e.key == 'v' || e.key == 'V') {
			e.preventDefault();
			pastePaths(e);
		} else if (e.key == 'b' || e.key == 'B') {
			e.preventDefault();
			if (typeof textMenu !== 'undefined') textMenu.applyValue("bold",!textEdit.menu.currentStyle.bold);
		} else if (e.key == 'i' || e.key == 'I') {
			e.preventDefault();
			if (typeof textMenu !== 'undefined') textMenu.applyValue("italic",!textEdit.menu.currentStyle.italic);
		} else if (e.key == 'g' || e.key == 'G') {
			e.preventDefault();
			groupPaths();
		} else if (e.key == 'u' || e.key == 'U') {
			e.preventDefault();
			ungroupPaths();
		} else if (e.key == 't' || e.key == 'T') {
			e.preventDefault();
			//addTitle();
		} else if (e.key == 'd' || e.key == 'D') {
			e.preventDefault();
			clonePaths();
		} else if (e.key == 'a' || e.key == 'A') {
			e.preventDefault();
			selectAllPaths();
		} else if (e.key == 'q' || e.key == 'Q') {
			e.preventDefault();
			if (typeof textMenu !== 'undefined') textMenu.applyValue("font");
			//showCursorPositions();
		} else if (e.keyCode == 38) { // up
			e.preventDefault();
			//fontSizeUp();
		} else if (e.keyCode == 40) { // down
			e.preventDefault();
			//fontSizeDown();
		} else if (e.keyCode == 46) { // delete
			e.preventDefault();
			deleteSelectedPaths();			
		} else if (e.key == 'm' || e.key == 'M') {
			e.preventDefault();
			centerDistributeText();
		}
	} else if (e.getModifierState('Shift')) {
		if (e.keyCode == 37) { // left
			e.preventDefault();
			movePaths(-5,0);
		} else if (e.keyCode == 38) { // up
			e.preventDefault();
			movePaths(0,-5);
		} else if (e.keyCode == 39) { // right
			e.preventDefault();
			movePaths(5,0);
		} else if (e.keyCode == 40) { // down
			e.preventDefault();
			movePaths(0,5);
		}
	} else if (e.getModifierState('Alt')) {
		if (e.keyCode == 37) { // left
			e.preventDefault();
			movePaths(-1,0);
		} else if (e.keyCode == 38) { // up
			e.preventDefault();
			movePaths(0,-1);
		} else if (e.keyCode == 39) { // right
			e.preventDefault();
			movePaths(1,0);
		} else if (e.keyCode == 40) { // down
			e.preventDefault();
			movePaths(0,1);
		} else if (e.keyCode == 76) { // l
			e.preventDefault();
			alignPaths('left');
		} else if (e.keyCode == 67) { // c
			e.preventDefault();
			alignPaths('center');
		} else if (e.keyCode == 82) { // r
			e.preventDefault();
			alignPaths('right');
		} else if (e.keyCode == 84) { // t
			e.preventDefault();
			alignPaths('top');
		} else if (e.keyCode == 77) { // m
			e.preventDefault();
			alignPaths('middle');
		} else if (e.keyCode == 66) { // b
			e.preventDefault();
			alignPaths('bottom');
		} else if (e.key.toLowerCase() == 'e') {
			e.preventDefault();
			draw.text2.horizAlignToEquals();
		}
	}
}
/*window.addEventListener('paste', onpaste, false);
function onpaste(e) {
	// if ?
	console.log(event.clipboardData.getData('Text'));
};*/

draw.keyboard = {
	active:false,
	create:function(obj) {
		createKeyboard(obj);
		draw.keyboard.active = true;
	},
	show:function(lightUp) {
		showKeyboard2(lightUp);
		
	},
	hide:function() {
		hideKeyboard2();
	},
	showButton:function() {
		hideKeyboard2();
		showObj(keyboardButton1[0]);
		hideObj(keyboardButton2[0]);
	},
	hideButton:function() {
		hideKeyboard2();
		hideObj(keyboardButton1[0]);
		hideObj(keyboardButton2[0]);
	},
	getPosition:function() {
		var data = keyboard[0].data;
		return [data[100],data[101]];
	},
	setPosition:function(pos) {
		keyboard[0].data[100] = pos[0];
		keyboard[0].data[101] = pos[1];
		resizeCanvas2(keyboard[0],pos[0],pos[1]);

		for (i = 0; i < key1[pageIndex].length; i++) {
			if (boolean(key1[pageIndex][i].static,false) == false) {
				key1Data[pageIndex][i][100] = pos[0] + key1Data[pageIndex][i][4];
				key1Data[pageIndex][i][101] = pos[1] + key1Data[pageIndex][i][5]; 
				resizeCanvas2(key1[pageIndex][i],key1Data[pageIndex][i][100],key1Data[pageIndex][i][101]);
			}
		}
	},
	moveAwayFromTextInput: function() {
		var textRect = textEdit.obj.rect.slice(0);
		textRect[0] += draw.drawRelPos[0];
		textRect[1] += draw.drawRelPos[1];
		var keyboardRect = keyboard[0].data.slice(100,104);
		if (hitTestTwoRects(textRect,keyboardRect) === false) return;		
		//console.log(textRect,keyboardRect);
		if (textRect[0] >= keyboardRect[2]) {
			draw.keyboard.setPosition([textRect[0]-keyboardRect[2],keyboardRect[1]]);
		} else if ((1200-(textRect[0]+textRect[2])) >= keyboardRect[2]) {
			draw.keyboard.setPosition([textRect[0]+textRect[2],keyboardRect[1]]);
		} else if (textRect[1] >= keyboardRect[3]) {
			draw.keyboard.setPosition([keyboardRect[0],textRect[1]-keyboardRect[3]]);			
		} else if ((700-(textRect[1]+textRect[3])) >= keyboardRect[3]) {
			draw.keyboard.setPosition([keyboardRect[0],textRect[1]+textRect[3]]);			
		}
		
	}
}

/***************************/
/*	 	DRAWING OBJECTS    */
/***************************/

function drawClickFloodFillClick(e) {
	deselectAllPaths(false);
	updateMouse(e);
	var x = draw.mouse[0];
	var y = draw.mouse[1];
	//var x = mouse.x - draw.drawRelPos[0] - draw.drawArea[0];
	//var y = mouse.y - draw.drawRelPos[1] - draw.drawArea[1];
	draw.fillPath.fillPolygonAtPoint(x,y);
}
function floodFill(canvas, startX, startY, fillColor) {
	startX = Math.round(startX);
	startY = Math.round(startY);
	var dstImg = canvas.ctx.getImageData(0,0,canvas.width,canvas.height);
	var dstData = dstImg.data;
	var alteredPixels = [];
	
	var startPos = getPixelPos(startX, startY);
	var startColor = {
		r: dstData[startPos],
		g: dstData[startPos+1],
		b: dstData[startPos+2],
		a: dstData[startPos+3]
	};
	var todo = [[startX,startY]];

	while (todo.length) {
		var pos = todo.pop();
		var x = pos[0];
		var y = pos[1];    
		var currentPos = getPixelPos(x, y);
		
		while((y-- >= 0) && matchStartColor(dstData, currentPos, startColor)) {
			currentPos -= canvas.width * 4;
		}

		currentPos += canvas.width * 4;
		++y;
		var reachLeft = false;
		var reachRight = false;

		while((y++ < canvas.height-1) && matchStartColor(dstData, currentPos, startColor)) {
			
			colorPixel(dstData, currentPos, fillColor);

			if (x > 0) {
				if (matchStartColor(dstData, currentPos-4, startColor)) {
					if (!reachLeft) {
						todo.push([x-1, y]);
						reachLeft = true;
					}
				} else if (reachLeft) {
					reachLeft = false;
				}
			}

			if (x < canvas.width-1) {
				if (matchStartColor(dstData, currentPos+4, startColor)) {
					if (!reachRight) {
						todo.push([x+1, y]);
						reachRight = true;
					}
				} else if (reachRight) {
					reachRight = false;
				}
			}

			currentPos += canvas.width * 4;
		}
	}
	return alteredPixels;
	
	function getPixelPos(x, y) {
		return (y * canvas.width + x) * 4;
	};
	function getPixelPosInverse(pos) {
		var pos2 = Math.floor(pos/4);
		return [pos2%canvas.width,Math.floor(pos2/canvas.width)];
	};
	function matchStartColor(data, pos, startColor) {
	  return (
		data[pos]   === startColor.r &&
		data[pos+1] === startColor.g &&
		data[pos+2] === startColor.b &&
		data[pos+3] === startColor.a);
	};
	function colorPixel(data, pos, color) {
		alteredPixels.push(getPixelPosInverse(pos));
		data[pos] = color.r || 0;
		data[pos+1] = color.g || 0;
		data[pos+2] = color.b || 0;
		data[pos+3] = color.hasOwnProperty("a") ? color.a : 255;
	};
};
function drawClickStartDraw() {
	deselectAllPaths(false);
	//var x = mouse.x - draw.drawRelPos[0] - draw.drawArea[0];
	//var y = mouse.y - draw.drawRelPos[1] - draw.drawArea[1];
	//updateMouse(e);
	var x = draw.mouse[0];
	var y = draw.mouse[1];
	if (snapToObj2On && draw.drawMode !== 'pen' && un(draw.snapToObjs)) {
		updateSnapPoints(); // update intersection points
		var pos = snapToObj2([x,y]);
		x = pos[0];
		y = pos[1];
	}
	switch (draw.drawMode) {
		case 'pen':
			draw.drawing = true;
			draw.prevX = x;
			draw.prevY = y;
			var obj = {
				type:'pen',
				color:draw.color,
				thickness:draw.thickness,
				pos:[[x,y]],
			};
			if (!un(draw.dash) && draw.dash.length > 0) obj.dash = clone(draw.dash);
			draw.path.push({obj:[obj],selected:false,time:Date.parse(new Date())});
			//addListenerMove(window,penDrawMove);
			//addListenerEnd(window,penDrawStop);
			draw.animate(penDrawMove,penDrawStop,drawSelectedPaths);		
			break;
		case 'line':
			// if too many lines, delete oldest
			var lineCount = 0;
			for (var i = draw.path.length - 1; i >= 0; i--) {
				for (var o = 0; o < draw.path[i].obj.length; o++) {
					if (draw.path[i].obj[o].type == 'line') {
						lineCount++;
						if (lineCount >= draw.maxLines) {
							draw.path.splice(i,1);
						}
					}
				}
			}
			var point = [x,y];
			if (draw.snap == true) {
				updateSnapPoints();
				point = snapToPoints(point,draw.snapPoints,draw.snapTolerance);
			} else if (draw.gridSnap == true) {
				//startX = roundToNearest(startX,draw.gridSnapSize);
				//startY = roundToNearest(startY,draw.gridSnapSize);
			}
			if (snapToObj2On) {
				point = snapToObj2(point,-1);
			}

			draw.drawing = true;
			draw.startX = point[0];
			draw.startY = point[1];
			var obj = {
				type:'line',
				color:draw.color,
				thickness:draw.thickness,
				startPos:point,
				drawing:true
			};
			if (!un(draw.dash) && draw.dash.length > 0) obj.dash = clone(draw.dash)
			draw.path.push({obj:[obj],selected:false});
			
			if (boolean(draw.vector,false)) {
				draw.path.last().obj[0].endMid = 'open';
				draw.path.last().obj[0].endMidSize = draw.thickness*5;
			}
			//addListenerMove(window,lineDrawMove);
			//addListenerEnd(window,lineDrawStop);		
			draw.animate(lineDrawMove,lineDrawStop,drawSelectedPaths);		
			break;
		case 'rect' :
		case 'square' :
			var startX = x;
			var startY = y;
			if (draw.gridSnap == true) {
				startX = roundToNearest(startX,draw.gridSnapSize);
				startY = roundToNearest(startY,draw.gridSnapSize);
			}
			draw.drawing = true;
			draw.startX = startX;
			draw.startY = startY;					
			draw.path.push({obj:[{
				type:draw.drawMode,
				color:draw.color,
				thickness:draw.thickness,
				fillColor:draw.fillColor,
				startPos:[startX,startY],
				edit:false
			}],selected:false});
			//addListenerMove(window,rectDrawMove);
			//addListenerEnd(window,rectDrawStop);		
			draw.animate(rectDrawMove,rectDrawStop,drawSelectedPaths);
			break;
		case 'polygon' :
			var pos = [x,y];
			if (draw.gridSnap == true) {
				pos = [roundToNearest(startX,draw.gridSnapSize),roundToNearest(startY,draw.gridSnapSize)];
			}
			if (snapToObj2On) {
				pos = snapToObj2(pos,-1);
			}
			draw.drawing = true;
			draw.startX = startX;
			draw.startY = startY;					
			draw.path.push({obj:[{
				type:draw.drawMode,
				color:draw.color,
				thickness:draw.thickness,
				fillColor:draw.fillColor,
				points:[pos,[]],
				closed:false,
				lineDecoration:[],
				angles:[],
				clockwise:true,
				edit:false,
				drawing:true
			}],selected:false});
			//console.log(draw.path[draw.path.length-1]);
			changeDrawMode('polygon-drawing');
			//addListenerMove(window,polygonDrawMove);
			//addListenerEnd(window,polygonDrawStop);
			draw.animate(polygonDrawMove,polygonDrawStop,drawSelectedPaths);
			break;			
		case 'circle' :
			var startX = x;
			var startY = y;
			if (draw.gridSnap == true) {
				startX = roundToNearest(startX,draw.gridSnapSize);
				startY = roundToNearest(startY,draw.gridSnapSize);
			}
			draw.drawing = true;
			draw.startX = startX;
			draw.startY = startY;					
			draw.path.push({obj:[{
				type:draw.drawMode,
				color:draw.color,
				thickness:draw.thickness,
				fillColor:draw.fillColor,
				center:[startX,startY],
				radius:0,
				showCenter:true,
				edit:false
			}],selected:false});
			//addListenerMove(window,circleDrawMove);
			//addListenerEnd(window,circleDrawStop);		
			draw.animate(circleDrawMove,circleDrawStop,drawSelectedPaths);		
			break;
		case 'point' :
			var startX = x;
			var startY = y;
			if (draw.gridSnap == true) {
				startX = roundToNearest(startX,draw.gridSnapSize);
				startY = roundToNearest(startY,draw.gridSnapSize);
			}
			var point = [startX,startY]
			if (snapToObj2On) point = snapToObj2(point,-1);
			draw.path.push({obj:[{
				type:draw.drawMode,
				color:draw.color,
				thickness:draw.thickness,
				fillColor:draw.fillColor,
				center:point,
				radius:draw.thickness,
				showCenter:false,
				edit:false
			}],selected:false});
			break;			
		case 'ellipse' :
			var startX = x;
			var startY = y;
			if (draw.gridSnap == true) {
				startX = roundToNearest(startX,draw.gridSnapSize);
				startY = roundToNearest(startY,draw.gridSnapSize);
			}
			draw.drawing = true;
			draw.startX = startX;
			draw.startY = startY;					
			draw.path.push({obj:[{
				type:draw.drawMode,
				color:draw.color,
				thickness:draw.thickness,
				fillColor:draw.fillColor,
				center:[startX,startY],
				radiusX:0,
				radiusY:0,
				showCenter:true,
				edit:false
			}],selected:false});
			//addListenerMove(window,ellipseDrawMove);
			//addListenerEnd(window,ellipseDrawStop);		
			draw.animate(ellipseDrawMove,ellipseDrawStop,drawSelectedPaths);	
			break;
	}
	drawCanvasPaths();
	drawSelectCanvas();	
};
function penDrawMove(e) {
	//var x = draw.getRelMouseX(e), y = draw.getRelMouseY();
	updateMouse(e);
	var pos = draw.mouse;
	if (pos[0] !== draw.prevX || pos[1] !== draw.prevY) {
		draw.path.last().obj[0].pos.push(clone(pos));
		//drawSelectedPaths();
		draw.prevX = pos[0];
		draw.prevY = pos[1];		
	}
}
function penDrawStop(e) {
	//removeListenerMove(window,penDrawMove);
	//removeListenerEnd(window,penDrawStop);
	draw.prevX = null;
	draw.prevY = null;
	draw.drawing = false;
	var pathNum = draw.path.length-1;
	if (draw.groupPenPaths !== false) {
		for (var i = draw.path.length-2; i > -1; i--) {
			if (typeof draw.path[i].obj == 'object') {
				var penPath = true;
				for (var j = 0; j < draw.path[i].obj.length; j++) {
					if (draw.path[i].obj[j].type !== 'pen') {
						penPath = false;
					}
				}
				if (penPath == true) {
					pathNum = i;
					break;
				}
			}
		}
	}
	if (pathNum < draw.path.length-1) {
		var path = draw.path[pathNum];
		path.obj.push(draw.path[draw.path.length-1].obj[0]);
		removePathObject(draw.path.length-1);
	} else {
		var path = draw.path[draw.path.length-1];
	}
	var x1 = path.obj[0].pos[0][0];
	var y1 = path.obj[0].pos[0][1];
	var x2 = path.obj[0].pos[0][0];
	var y2 = path.obj[0].pos[0][1];
	for (var i = 0; i < path.obj[0].pos.length; i++) {
		x1 = Math.min(x1,path.obj[0].pos[i][0]);
		y1 = Math.min(y1,path.obj[0].pos[i][1]);
		x2 = Math.max(x1,path.obj[0].pos[i][0]);
		y2 = Math.max(y1,path.obj[0].pos[i][1]);		
	}
	path.obj[0].left = x1;
	path.obj[0].top = y1;
	path.obj[0].width = x2-x1;
	path.obj[0].height = y2-y1;
	updateBorder(path);
	drawCanvasPaths();		
}
function lineDrawMove(e) {
	//var x = draw.getRelMouseX(e), y = draw.getRelMouseY();
	updateMouse(e);
	var x = draw.mouse[0];
	var y = draw.mouse[1];
	var pathNum = draw.path.length - 1;
	var obj = draw.path[pathNum].obj[0];
	if (draw.drawMode == 'lineStart') {
		if (shiftOn) {
			if (Math.abs(obj.finPos[0]-x) < Math.abs(obj.finPos[1]-y)) {
				obj.startPos = [obj.finPos[0],y];
			} else {
				obj.startPos = [x,obj.finPos[1]];
			}
		} else if (snapToObj2On || draw.snapLinesTogether) {
			obj.startPos = snapToObj2([x,y],pathNum);
		} else {
			obj.startPos = [x,y];
		}	
	} else if (draw.drawMode == 'lineFin' || draw.drawMode == 'line') {
		if (shiftOn) {
			if (Math.abs(obj.startPos[0]-x) < Math.abs(obj.startPos[1]-y)) {
				obj.finPos = [obj.startPos[0],y];
			} else {
				obj.finPos = [x,obj.startPos[1]];
			}			
		} else if (snapToObj2On || draw.snapLinesTogether) {
			obj.finPos = snapToObj2([x,y],pathNum);
		} else {
			obj.finPos = [x,y];
		}			
	}
	/*drawSelectedPaths();
	if (draw.drawMode !== 'draw') {
		updateBorder(draw.path[pathNum]);
		drawSelectCanvas();
		drawSelectCanvas2();
	}*/		
}
function lineDrawStop(e) {
	//console.log('lineDrawStop');
	//removeListenerMove(window,lineDrawMove);
	removeListenerMove(window,rulerDrawMove1);
	removeListenerMove(window,rulerDrawMove2);	
	removeListenerEnd(window,lineDrawStop);
	draw.startX = null;
	draw.startY = null;
	draw.drawing = false;
	
	var path = draw.path.last();
	var obj = path.obj[0];
	if (typeof obj.finPos == 'undefined' || getDist(obj.startPos,obj.finPos) < 5) {
		removePathObject(draw.path.length-1);
		if (draw.defaultMode == 'select') {
			changeDrawMode();
		}
	} else {
		if (draw.gridSnap == true && shiftOn == false) {
			obj.finPos[0] = roundToNearest(obj.finPos[0],draw.gridSnapSize);
			obj.finPos[1] = roundToNearest(obj.finPos[1],draw.gridSnapSize);			
		}
		if (draw.defaultMode == 'select') {
			path.selected = true;
			updateBorder(path);
			changeDrawMode();
		} else {
			path.selected = false;
		}
		path.trigger = [];	

		for (var i = 0; i < draw.path.length; i++) {
			for (var j = 0; j < draw.path[i].obj.length; j++) {
				draw.path[i].obj[j].drawing = false;
			}
		}
		updateBorder(path);
	}
	
	redrawButtons();	
	drawCanvasPaths();
	if (!un(draw.contextMenu)) draw.contextMenu.update();
}
function rectDrawMove(e) {
	//var x = draw.getRelMouseX(e), y = draw.getRelMouseY();
	updateMouse(e);
	var x = draw.mouse[0];
	var y = draw.mouse[1];
	if (draw.drawMode == 'square') {
		var dx = x-draw.path[draw.path.length-1].obj[0].startPos[0];
		var dy = y-draw.path[draw.path.length-1].obj[0].startPos[1];
		if (Math.abs(dx) >= Math.abs(dy)) {
			x = draw.path[draw.path.length-1].obj[0].startPos[0] + dx;
			y = draw.path[draw.path.length-1].obj[0].startPos[1] + dx;
		} else {
			x = draw.path[draw.path.length-1].obj[0].startPos[0] + dy;
			y = draw.path[draw.path.length-1].obj[0].startPos[1] + dy;			
		}
	}

	draw.path[draw.path.length-1].obj[0].finPos = [x,y];
	//drawSelectedPaths();
}
function rectDrawStop(e) {
	//removeListenerMove(window,rectDrawMove);
	//removeListenerEnd(window,rectDrawStop);
	draw.startX = null;
	draw.startY = null;
	draw.drawing = false;
	
	if (typeof draw.path[draw.path.length-1].obj[0].finPos == 'undefined' || dist(draw.path[draw.path.length-1].obj[0].startPos[0],draw.path[draw.path.length-1].obj[0].startPos[1],draw.path[draw.path.length-1].obj[0].finPos[0],draw.path[draw.path.length-1].obj[0].finPos[1]) < 5) {
		draw.path.pop();
	} else if (draw.gridSnap == true) {
		draw.path[draw.path.length-1].obj[0].finPos[0] = roundToNearest(draw.path[draw.path.length-1].obj[0].finPos[0],draw.gridSnapSize);
		draw.path[draw.path.length-1].obj[0].finPos[1] = roundToNearest(draw.path[draw.path.length-1].obj[0].finPos[1],draw.gridSnapSize);
	}
	
	changeDrawMode();
	draw.path[draw.path.length-1].selected = true;
	// trigger array
	draw.path[draw.path.length-1].trigger = [];	

	redrawButtons();
	updateBorder(draw.path.last());
	drawCanvasPaths();		
}
function polygonDrawMove(e) {
	updateMouse(e);
	var x = draw.mouse[0];
	var y = draw.mouse[1];
	var obj = draw.path[draw.path.length-1].obj[0];
	if (shiftOn == true) {
		var dx = x - obj.points[obj.points.length-2][0];
		var dy = y - obj.points[obj.points.length-2][1];
		if (Math.abs(dx/dy) >= 1) {
			// horizontal line
			var newPoint = [Math.min(Math.max(x,draw.drawArea[0]),draw.drawArea[0]+draw.drawArea[2]),obj.points[obj.points.length-2][1]];
		} else {
			// vertical line
			var newPoint = [obj.points[obj.points.length-2][0],Math.min(Math.max(y,draw.drawArea[1]),draw.drawArea[1]+draw.drawArea[3])];
		}
	} else {
		var newPoint = [Math.min(Math.max(x,draw.drawArea[0]),draw.drawArea[0]+draw.drawArea[2]),Math.min(Math.max(y,draw.drawArea[1]),draw.drawArea[1]+draw.drawArea[3])];
		if (snapToObj2On || draw.snapLinesTogether) {
			newPoint = snapToObj2(newPoint,draw.path.length - 1);
		}
	}
	obj.points[obj.points.length-1] = newPoint;
	if (obj.points.length >= 2) obj.clockwise = polygonClockwiseTest(obj.points);
	
	//drawSelectedPaths();
}
function polygonDrawStop(e) {
	var x = draw.mouse[0];
	var y = draw.mouse[1];
	var obj = draw.path[draw.path.length-1].obj[0];
	if (obj.points.length > 2 && dist(x,y,obj.points[0][0],obj.points[0][1]) < draw.selectTolerance * 2) {
		// close polygon
		//removeListenerMove(window,polygonDrawMove);
		//removeListenerEnd(window,polygonDrawStop);
		obj.closed = true;
		obj.drawing = false;
		obj.points.pop();
		if (obj.clockwise == true) {
			obj.points.reverse();
			obj.clockwise = false;
		}
		draw.startX = null;
		draw.startY = null;
		draw.drawing = false;
		changeDrawMode();
		obj.angles = [];
		for (var p = 0; p < obj.points.length; p++) {
			obj.angles[p] = {style:0,radius:30,labelMeasure:true,labelFontSize:25,labelRadius:33,drawCurve:false,measureLabelOnly:true};
		}		
		draw.path[draw.path.length-1].selected = true;
		draw.path[draw.path.length-1].trigger = [];
		redrawButtons();
		updateBorder(draw.path.last());
		drawCanvasPaths();
		if (!un(draw.contextMenu)) draw.contextMenu.update();			
	} else if (dist(obj.points[obj.points.length-2][0],obj.points[obj.points.length-2][1],obj.points[obj.points.length-1][0],obj.points[obj.points.length-1][1]) < draw.selectTolerance * 2) {
		// leave polygon open
		//removeListenerMove(window,polygonDrawMove);
		//removeListenerEnd(window,polygonDrawStop);
		obj.drawing = false;
		obj.points.pop();
		if (obj.clockwise == true) {
			obj.points.reverse();
			obj.clockwise = false;
		}		
		draw.startX = null;
		draw.startY = null;
		draw.drawing = false;
		changeDrawMode();
		obj.angles = [];
		for (var p = 1; p < obj.points.length-1; p++) {
			obj.angles[p] = {style:0,radius:30,labelMeasure:true,labelFontSize:25,labelRadius:33,drawCurve:false,measureLabelOnly:true};
		}
		draw.path[draw.path.length-1].selected = true;
		draw.path[draw.path.length-1].trigger = [];
		redrawButtons();
		updateBorder(draw.path.last());
		if (obj.points.length == 1) draw.path.pop();
		drawCanvasPaths();
		if (!un(draw.contextMenu)) draw.contextMenu.update();
	} else {
		var newPoint = [x,y];
		if (draw.gridSnap == true) {
			newPoint[0] = roundToNearest(newPoint[0],draw.gridSnapSize);
			newPoint[1] = roundToNearest(newPoint[1],draw.gridSnapSize);
		}		
		obj.points.push(newPoint);
		//drawSelectedPaths();
		draw.animate(polygonDrawMove,polygonDrawStop,drawSelectedPaths);
		if (!un(draw.contextMenu)) draw.contextMenu.update();		
	}
}
function circleDrawMove(e) {
	//var x = draw.getRelMouseX(e), y = draw.getRelMouseY();
	updateMouse(e);
	var x = draw.mouse[0];
	var y = draw.mouse[1];
	draw.path[draw.path.length-1].obj[0].radius = Math.abs(dist(x,y,draw.path[draw.path.length-1].obj[0].center[0],draw.path[draw.path.length-1].obj[0].center[1]));
	draw.path[draw.path.length-1].obj[0].showCenter = true;
	//redrawButtons();
	//drawSelectedPaths();
}
function circleDrawStop(e) {
	//removeListenerMove(window,circleDrawMove);
	//removeListenerEnd(window,circleDrawStop);
	draw.startX = null;
	draw.startY = null;
	draw.drawing = false;
	
	if (draw.gridSnap == true) {
		draw.path[draw.path.length-1].obj[0].radius = roundToNearest(draw.path[draw.path.length-1].obj[0].radius,draw.gridSnapSize);
	}
	draw.path[draw.path.length-1].obj[0].showCenter = false;
	
	changeDrawMode();
	draw.path[draw.path.length-1].selected = true;
	draw.path[draw.path.length-1].trigger = [];	
	redrawButtons();
	updateBorder(draw.path.last());
	drawCanvasPaths();
}
function ellipseDrawMove(e) {
	//var x = draw.getRelMouseX(e), y = draw.getRelMouseY();
	updateMouse(e);
	var x = draw.mouse[0];
	var y = draw.mouse[1];
	draw.path[draw.path.length-1].obj[0].radiusX = Math.abs(x-draw.path[draw.path.length-1].obj[0].center[0]);
	draw.path[draw.path.length-1].obj[0].radiusY = Math.abs(y-draw.path[draw.path.length-1].obj[0].center[1]);	

	draw.path[draw.path.length-1].obj[0].showCenter = true;
	//drawSelectedPaths();
}
function ellipseDrawStop(e) {
	//removeListenerMove(window,ellipseDrawMove);
	//removeListenerEnd(window,ellipseDrawStop);
	draw.startX = null;
	draw.startY = null;
	draw.drawing = false;
	
	if (draw.gridSnap == true) {
		draw.path[draw.path.length-1].obj[0].radiusX = roundToNearest(draw.path[draw.path.length-1].obj[0].radiusX,draw.gridSnapSize);
		draw.path[draw.path.length-1].obj[0].radiusY = roundToNearest(draw.path[draw.path.length-1].obj[0].radiusY,draw.gridSnapSize);		
	}

	draw.path[draw.path.length-1].obj[0].showCenter = false;
	
	changeDrawMode();
	draw.path[draw.path.length-1].selected = true;
	draw.path[draw.path.length-1].trigger = [];	
	redrawButtons();
	updateBorder(draw.path.last());
	drawCanvasPaths();		
}
/*draw.getRelMouseX = function(e) {
	if (!un(e)) updateMouse(e);
	var x = mouse.x - draw.drawRelPos[0] - draw.drawArea[0];
	x = Math.max(x,0);
	x = Math.min(x,draw.drawArea[2]);
	return x;
}
draw.getRelMouseY = function(e) {
	if (!un(e)) updateMouse(e);
	var y = mouse.y - draw.drawRelPos[1] - draw.drawArea[1];
	y = Math.max(y,0);
	y = Math.min(y,draw.drawArea[3]);
	return y;
}*/

/***************************/
/* GENERAL OBJ INTERACTION */
/***************************/

draw.getPathOfObj = function(obj) {
	if (!un(obj._path)) return obj._path;
	for (var p = 0; p < draw.path.length; p++) {
		var path = draw.path[p];
		for (var o = 0; o < path.obj.length; o++) {
			if (obj == path.obj[o]) return path;
		}
	}
	return false;
}
draw.getPathById = function(id) {
	if (!un(draw.ids.path[id])) return draw.ids.path[id];
	for (var p = 0; p < draw.path.length; p++) {
		if (draw.path[p].id == id) return draw.path[p];
	}
	for (var p = 0; p < draw.path.length; p++) {
		for (var o = 0; o < draw.path[p].obj.length; o++) {
			if (draw.path[p].obj[o].id === id) return draw.path[p].obj[o]._path;
		}
	}
	return false;
}
draw.getObjById = function(id) {
	if (!un(draw.ids.obj[id])) return draw.ids.obj[id];
	for (var p = 0; p < draw.path.length; p++) {
		for (var o = 0; o < draw.path[p].obj.length; o++) {
			if (draw.path[p].obj[o].id === id) return draw.path[p].obj[o];
		}
	}
	for (var p = 0; p < draw.path.length; p++) {
		if (draw.path[p].id == id) return draw.path[p];
	}
	return false;
}
draw.getObjs = function(type) {
	var objs = [];
	for (var p = 0; p < draw.path.length; p++) {
		for (var o = 0; o < draw.path[p].obj.length; o++) {
			if (!un(type) && draw.path[p].obj[o].type !== type) continue;
			objs.push(draw.path[p].obj[o]);
		}
	}
	return objs;
}
draw.objs = function(func) {
	/* apply a function to all objects
	draw.objs(function(obj) {
		if (!un(obj.interact) && !un(obj.interact.update)) obj.interact.update(obj);
	});
	*/
	for (var p = 0; p < draw.path.length; p++) {
		for (var o = 0; o < draw.path[p].obj.length; o++) {
			func(draw.path[p].obj[o],draw.path[p]);
		}
	}
}
draw.ids = {
	obj:{},
	path:{},
	update:function() {
		draw.ids.obj = {};
		draw.ids.path = {};
		for (var p = 0; p < draw.path.length; p++) {
			var path = draw.path[p];
			if (!un(path.id)) {
				if (!un(draw.ids.path[path.id])) {
					console.log('paths with same id:',draw.ids.path[path.id],path);
				} else {
					draw.ids.path[path.id] = path;
				}
			}
			for (var o2 = 0; o2 < path.obj.length; o2++) {
				var obj = path.obj[o2];
				if (!un(obj.id)) {
					if (!un(draw.ids.obj[obj.id])) {
						console.log('objs with same id:',draw.ids.obj[obj.id],obj);
					} else {
						draw.ids.obj[obj.id] = obj;
					}
				}
			}
		}
	}
};
draw.interact = {
	standardProperties: {
		obj: [
			{key:'disabled',value:true},
			{key:'overlay',value:true},
			{key:'click',value:function(obj) {}},
			{key:'drag3d',value:false,condition:function(obj) {
				return obj.type === 'three';
			}},
			{key:'cubeBuilding',value:'build',cycle:['build','remove'],condition:function(obj) {
				return obj.type === 'three';
			}},
			{key:'edit3dShape',value:true,condition:function(obj) {
				return obj.type === 'three';
			}},
		],
		path: [
			{key:'disabled',value:true},
			{key:'draggable',value:true},
			{key:'moveToFront',value:true,condition:function(path) {
				var pathInteract = draw.getPathInteract(path);
				return pathInteract.draggable === true;
			}},
			{key:'dragPathLineSegment',value:'id?'},
			{key:'dragPathCircle',value:'id?'},
			{key:'checkAllowDrag',value:function(path,pos) {},condition:function(path) {
				var pathInteract = draw.getPathInteract(path);
				return (pathInteract.draggable === true || !un(pathInteract.dragPathCircle) || !un(pathInteract.dragPathLineSegment));
			}},
			{key:'dragRect',value:[0,0,1200,1700],condition:function(path) {
				var pathInteract = draw.getPathInteract(path);
				return pathInteract.draggable === true;
			}},
			{key:'onDrop',value:function(dragAreaObj,dragPath) {},condition:function(path) {
				var pathInteract = draw.getPathInteract(path);
				return pathInteract.draggable === true;
			}},
			{key:'onUndrop',value:function(dragAreaObj,dragPath) {},condition:function(path) {
				var pathInteract = draw.getPathInteract(path);
				return pathInteract.draggable === true;
			}},
			{key:'onDragMove',value:function(path) {},condition:function(path) {
				var pathInteract = draw.getPathInteract(path);
				return (pathInteract.draggable === true || !un(pathInteract.dragPathCircle) || !un(pathInteract.dragPathLineSegment));
			}},
			{key:'type',value:'check',cycle:['check']},
			{key:'update',value:function(path) {}}
		]
	},
	appear: function() {
		var path = draw.currCursor.path;
		path._visible = !path._visible;
		if (path._visible == true && !un(path.appear) && typeof path.appear.onappear == 'function') {
			path.appear.onappear(path);
		} 
		if (path._visible == false && !un(path.appear) && typeof path.appear.ondisappear == 'function') {
			path.appear.ondisappear(path);
		} 
		drawCanvasPaths();
		drawSelectCanvas2();
	},
	buttons: {
		textInput:{
			drawButton: function(ctx,size) {
				ctx.fillStyle = '#FFF';	
				ctx.strokeStyle = '#000';
				ctx.lineWidth = 2;
				ctx.lineCap = 'round';
				ctx.lineJoin = 'round';
				ctx.beginPath();
				ctx.fillRect(size*8/55,size*15/55,size*(55-16)/55,size*25/55);
				ctx.strokeRect(size*8/55,size*15/55,size*(55-16)/55,size*25/55);
				ctx.stroke();
				text({context:ctx,left:size*8/55,width:size*(55-16)/55,top:size*15/55,textArray:['<<font:Georgia>><<fontSize:'+size*20/55+'>><<align:center>>I']});
			},
			click: function() {
				var paths = selPaths();
				var count = 0;
				for (var p = 0; p < paths.length; p++) {
					var path = paths[p];
					for (var o = 0; o < path.obj.length; o++) {
						var obj = path.obj[o];
						if (typeof obj == 'undefined' || obj.type !== 'text2' || !un(obj.isInput)) continue;
						obj.box = {type:"loose",borderColor:"#000",borderWidth:2,color:"#FFF"};
						obj.align = [0,0];
						path.isInput = {type:'text'};
						obj.ansIndex = 0;
						obj.ans = [];
						count++;
					}
					updateBorder(path);
				}
				if (count == 0) {
					Notifier.error('Select a text object');
				} else {
					drawCanvasPaths();
				}
			}
		},
		multiSelectTable:{
			drawButton: function(ctx,size) {
				ctx.strokeStyle = '#666';
				ctx.lineWidth = 1;
				ctx.fillStyle = '#FFF';
				ctx.fillRect(10,11,35,33);
				ctx.fillStyle = '#393';
				ctx.fillRect(10+11*1,11+0*33/4,35/3,33/4);
				ctx.fillRect(10+11*0,11+1*33/4,35/3,33/4);
				ctx.fillRect(10+11*2,11+3*33/4,35/3,33/4);
				ctx.beginPath();
				for (var i = 0; i < 5; i++) {
					ctx.moveTo(10,11+i*33/4);
					ctx.lineTo(45,11+i*33/4);
				}
				for (var i = 0; i < 4; i++) {
					ctx.moveTo(10+i*35/3,11);
					ctx.lineTo(10+i*35/3,44);
				}
				ctx.stroke();
				ctx.lineWidth = 1;
				ctx.strokeStyle = '#000';
				ctx.strokeRect(10,11,35,33);
			},
			click: function() {
				var path = selPath();
				if (path == false) {
					Notifier.error('Select a table object');
					return;
				}
				var obj = path.obj[0];
				if (obj.type !== 'table2') {
					Notifier.error('Select a table object');
					return;
				} else if (!un(obj.isInput)) {
					return;
				}
				path.isInput = {type:'select',shuffle:true,multiSelect:true,checkSelectCount:false,selColors:['#CCF','#66F']};
				obj.isInput = path.isInput;
				updateBorder(path);
				drawCanvasPaths();				
			}
		},
		singleSelectTable:{
			drawButton: function(ctx,size) {
				ctx.strokeStyle = '#666';
				ctx.lineWidth = 1;
				ctx.fillStyle = '#FFF';
				ctx.fillRect(10,11,35,33);
				ctx.fillStyle = '#393';
				ctx.fillRect(10,11,35/2,33/2);
				ctx.beginPath();
				for (var i = 0; i < 3; i++) {
					ctx.moveTo(10,11+i*33/2);
					ctx.lineTo(45,11+i*33/2);
				}
				for (var i = 0; i < 3; i++) {
					ctx.moveTo(10+i*35/2,11);
					ctx.lineTo(10+i*35/2,44);
				}
				ctx.stroke();
				ctx.lineWidth = 1;
				ctx.strokeStyle = '#000';
				ctx.strokeRect(10,11,35,33);
			},
			click: function() {
				var path = selPath();
				if (path == false) {
					Notifier.error('Select a table object');
					return;
				}
				var obj = path.obj[0];
				if (obj.type !== 'table2') {
					Notifier.error('Select a table object');
					return;
				} else if (!un(obj.isInput)) {
					return;
				}
				path.isInput = {type:'select',shuffle:true,multiSelect:false,checkSelectCount:true,selColors:['#CCF','#66F']};
				obj.isInput = clone(path.isInput);
				updateBorder(path);
				drawCanvasPaths();
			}		
		},
		tickCrossTableHoriz:{
			drawButton: function(ctx,size) {
				ctx.fillStyle = '#FFF';
				ctx.fillRect(7.5,17.5,40,20);		
				ctx.strokeStyle = '#000';
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(27.5,17.5);
				ctx.lineTo(27.5,37.5);
				ctx.stroke();
				ctx.strokeRect(7.5,17.5,40,20);					
				drawTick(ctx,15,18,'#060',7.5+2.5,17.5+1,3);
				drawCross(ctx,15,18,'#F00',27.5+2.5,17.5+1,3);
			},
			click: function() {
				deselectAllPaths();
					
				var paths1 = {obj:[{type:"tick",rect:[155,125,40,50],lineWidth:10,lineColor:"#060"}]};
				var paths2 = {obj:[{type:"cross",rect:[305,125,40,50],lineWidth:10,lineColor:"#F00"}]};
				updateBorder(paths1);
				updateBorder(paths2);
				
				var obj = {type:"table2",left:100,top:100,widths:[150,150],heights:[100],text:{font:"Arial",size:28,color:"#000"},outerBorder:{show:false},innerBorder:{show:false},cells:[[{text:[""],align:[0,0],box:{type:"loose",borderColor:"#000",borderWidth:5,radius:10,show:true},paths:[paths1],selColors:["none","#6F6"],ans:false},{text:[""],align:[0,0],box:{type:"loose",borderColor:"#000",borderWidth:5,radius:10,show:true},paths:[paths2],selColors:["none","#F66"],ans:false}]]};
				
				obj.xPos = [obj.left];
				for (var i = 0; i < obj.widths.length; i++) obj.xPos.push(obj.xPos.last()+obj.widths[i]);
				obj.yPos = [obj.top];
				for (var i = 0; i < obj.heights.length; i++) obj.yPos.push(obj.yPos.last()+obj.heights[i]);
								
				draw.path.push({obj:[obj],selected:true,isInput:{type:'select',shuffle:true,multiSelect:false,checkSelectCount:true}});
				updateBorder(draw.path.last());
				drawCanvasPaths();
			}
		},
		tickCrossTableVert:{
			drawButton: function(ctx,size) {
				ctx.fillStyle = '#FFF';
				ctx.fillRect(17.5,7.5,20,40);		
				ctx.strokeStyle = '#000';
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(17.5,27.5);
				ctx.lineTo(37.5,27.5);
				ctx.stroke();
				ctx.strokeRect(17.5,7.5,20,40);					
				drawTick(ctx,15,18,'#060',17.5+2.5,7.5+1,3);
				drawCross(ctx,15,18,'#F00',17.5+2.5,27.5+1,3);
			},
			click: function() {
				deselectAllPaths();
					
				var paths1 = {obj:[{type:"tick",rect:[155,125,40,50],lineWidth:10,lineColor:"#060"}]};
				var paths2 = {obj:[{type:"cross",rect:[305,125,40,50],lineWidth:10,lineColor:"#F00"}]};
				updateBorder(paths1);
				updateBorder(paths2);
				
				var obj = {type:"table2",left:100,top:100,widths:[100],heights:[100,100],text:{font:"Arial",size:28,color:"#000"},outerBorder:{show:false},innerBorder:{show:false},cells:[[{text:[""],align:[0,0],box:{type:"loose",borderColor:"#000",borderWidth:5,radius:10,show:true},paths:[paths1],selColors:["none","#6F6"],ans:false}],[{text:[""],align:[0,0],box:{type:"loose",borderColor:"#000",borderWidth:5,radius:10,show:true},paths:[paths2],selColors:["none","#F66"],ans:false}]]};
				
				obj.xPos = [obj.left];
				for (var i = 0; i < obj.widths.length; i++) obj.xPos.push(obj.xPos.last()+obj.widths[i]);
				obj.yPos = [obj.top];
				for (var i = 0; i < obj.heights.length; i++) obj.yPos.push(obj.yPos.last()+obj.heights[i]);
								
				draw.path.push({obj:[obj],selected:true,isInput:{type:'select',shuffle:true,multiSelect:false,checkSelectCount:true}});
				updateBorder(draw.path.last());
				drawCanvasPaths();
			}
		},
		drag:{
			drawButton: function(ctx,size) {
				drawArrow({ctx:ctx,startX:35,startY:35,finX:45,finY:45,lineWidth:2,arrowLength:8,fillArrow:true,color:'#000'});
				text({ctx:ctx,text:['<<fontSize:13>><<bold:true>><<font:algebra>>12'],align:[0,0],rect:[10,10,25,25],box:{type:'loose',color:'#CCF',borderWidth:2,borderColor:'#000',radius:3}});
			},
			click: function() {
				var paths = selPaths();
				if (paths.length == 0) {
					draw.path.push({obj:[{type:'text2',text:['<<fontSize:36>><<bold:true>>'],rect:[100,100,200,100]}],selected:true});
					paths = [draw.path.last()];
				}
				for (var p = 0; p < paths.length; p++) {
					if (!un(paths[p].isInput)) continue;
					paths[p].isInput = {type:'drag',value:"",shuffle:true};
					var obj = paths[p].obj[0];
					if (obj.type == 'text2') {
						var color = !un(obj.box) && !un(obj.box.color) ? obj.box.color : '#CFF';
						obj.box = {type:'loose',borderWidth:4,borderColor:'#000',color:color,radius:8};
						obj.align = [0,0];
					}						
					updateBorder(paths[p]);
				}
				drawCanvasPaths();
			}
		},
		dragArea:{
			drawButton: function(ctx,size) {
				drawArrow({ctx:ctx,startX:10,startY:10,finX:19,finY:19,lineWidth:2,arrowLength:8,fillArrow:true,color:'#000'});
				text({ctx:ctx,text:[''],align:[0,0],rect:[20,20,25,25],box:{type:'loose',color:'#FFF',borderWidth:4,borderColor:'#666',radius:3,dash:[5,5]}});
			},
			click: function() {
				var paths = selPaths();
				if (paths.length == 0) {
					draw.path.push({obj:[{type:'text2',text:['<<fontSize:36>><<bold:true>>'],rect:[100,100,200,100]}],selected:true});
					paths = [draw.path.last()];
				}
				for (var p = 0; p < paths.length; p++) {
					if (!un(paths[p].isInput)) continue;
					paths[p].isInput = {type:'dragArea',value:"",snap:false};
					var obj = paths[p].obj[0];
					if (obj.type == 'text2') {
						var color = !un(obj.box) && !un(obj.box.color) ? obj.box.color : '#FFF';
						obj.box = {type:'loose',borderWidth:4,borderColor:'#333',color:color,radius:8,dash:[15,10]};
					}
					updateBorder(paths[p]);
				}
				drawCanvasPaths();
			}
		},
		addKeyboard:{
			drawButton: function(ctx,size) {
				roundedRect(ctx,3,3,49,49,8,6,'#000','#F0F');
				roundedRect(ctx,2.5+9,2.5+9,8,8,3,2,'#000','#AFF');
				roundedRect(ctx,2.5+21,2.5+9,8,8,3,2,'#000','#AFF');
				roundedRect(ctx,2.5+33,2.5+9,8,8,3,2,'#000','#AFF');
				roundedRect(ctx,2.5+9,2.5+21,8,8,3,2,'#000','#AFF');
				roundedRect(ctx,2.5+21,2.5+21,8,8,3,2,'#000','#AFF');
				roundedRect(ctx,2.5+33,2.5+21,8,8,3,2,'#000','#AFF');
				roundedRect(ctx,2.5+9,2.5+33,8,8,3,2,'#000','#AFF');
				roundedRect(ctx,2.5+21,2.5+33,8,8,3,2,'#000','#AFF');
				roundedRect(ctx,2.5+33,2.5+33,8,8,3,2,'#000','#AFF');
			},
			click: function() {
				/*if (!un(pages[pIndex].keyboard)) {
					delete pages[pIndex].keyboard;
					Notifier.info('Keyboard removed');
				} else {
					pages[pIndex].keyboard = {keyArray:[
						['1','2','3'],
						['4','5','6'],
						['7','8','9'],
						['-','0','delete']
					]};
					console.log(pages[pIndex].keyboard);
					Notifier.info('Keyboard added');
				}*/
			}
		},
		checkButton:{
			drawButton: function(ctx,size) {
				roundedRect(ctx,3,10,49,35,8,6,'#000','#6F9');
				text({context:ctx,left:size*8/55,width:size*(55-16)/55,top:size*15/55,textArray:['<<font:Hobo>><<fontSize:'+size*20/55+'>><<align:center>>Check']});
			},
			click: function() {
				draw.path.push({obj:[{type:'text2',align:[0,0],text:['<<fontSize:36>><<font:Hobo>>Check Answer'],rect:[20,700-80,260,60],box:{type:'loose',color:'#6F9',borderColor:'#000',borderWidth:4,radius:10}}],selected:true,isInput:{type:'check'}});
				updateBorder(draw.path.last());
				drawCanvasPaths();
			}
		},
		feedback:{
			drawButton: function(ctx,size) {
				text({context:ctx,left:size*8/55,width:size*(55-16)/55,top:size*15/55,textArray:['<<font:Hobo>><<fontSize:'+size*20/55+'>><<align:center>>Feedback']});
			},
			click: function() {
				draw.path.push({obj:[{type:'feedback',rect:[300,700-80,880,60]}],selected:true});
				updateBorder(draw.path.last());
				drawCanvasPaths();
			}
		}
	},
	update: function() {
		var changed = false;
		draw.objs(function(obj) {
			if (typeof obj !== 'object') return;
			if (!un(obj.interact) && !un(obj.interact.update)) {
				changed = true;
				if (typeof obj.interact.update == 'function') {
					obj.interact.update(obj);
				} else if (obj.interact.update instanceof Array) {
					for (var i = 0; i < obj.interact.update.length; i++) {
						draw.interact.processFuncObject(obj,obj.interact.update[i]);
					}
				}
			}
		});
		if (changed === true) drawCanvasPaths();
	},
	click: function() {
		var obj = draw.currCursor.obj;
		if (typeof obj.interact.click == 'function') {
			if (obj.type === 'table2') {
				var rows = obj.heights.length;
				var cols = obj.widths.length;
				var top = obj.top;
				var row = 0;
				for (var r = 0; r < rows; r++) {
					if (draw.mouse[1] > top) row = r;
					top += obj.heights[r];
				}
				var left = obj.left;
				var col = 0;
				for (var c = 0; c < cols; c++) {
					if (draw.mouse[0] > left) col = c;
					left += obj.widths[c];
				}
				var cell = obj.cells[row][col];
				obj.interact.click(cell);
			} else {
				obj.interact.click(obj);
			}
			drawCanvasPaths();
		} else if (obj.interact.click instanceof Array) {
			for (var i = 0; i < obj.interact.click.length; i++) {
				draw.interact.processFuncObject(obj,obj.interact.click[i]);
			}
			drawCanvasPaths();
		}
		draw.interact.update();
	},
	processFuncObject: function(obj,funcObject) {
		// get object to act upon
		var obj2 = un(funcObject.id) || funcObject.id == 'self' ? obj : draw.getObjById(funcObject.id);
		
		// get property object
		var property = draw.interact.getPropertyObject(obj2,funcObject.property);
		if (typeof property !== 'object') return;
		
		// get value
		if (!un(funcObject.value)) {
			var value = funcObject.value;
		} else if (!un(funcObject.condition)) {
			var conditionObj = un(funcObject.condition.id) || funcObject.condition.id == 'self' ? obj2 : draw.getObjById(funcObject.condition.id);
			var conditionProperty = draw.interact.getPropertyObject(conditionObj,funcObject.condition.property);
			var conditionValue = conditionProperty.get(conditionObj);
			var value = funcObject.condition.default;
			for (var v = 0; v < funcObject.condition.value.length; v++) {
				if (funcObject.condition.value[v][0] == conditionValue) {
					value = funcObject.condition.value[v][1];
					break;
				}
			}
		}
		
		// apply change
		if (!un(value)) {
			property.set(obj2,value);
		} else if (property.type instanceof Array) {
			property.cycle(obj2);
		} else if (property.type == 'boolean') {
			property.set(obj2,!property.get(obj2));
		} else if (property.type == 'number') {
			if (!un(funcObject.increment)) {
				property.increment(obj2,funcObject.increment);
			}
		} else if (property.type == 'color') {
			
		}
	},
	getPropertyObject: function(obj,property) {
		if (!un(draw.obj.properties[property])) {
			return draw.obj.properties[property];
		} else if (!un(draw[obj.type].properties) && !un(draw[obj.type].properties[property])) {
			return draw[obj.type].properties[property];
		}
		return null;
	},
	dragReset: function(path) {
		if (un(path._initialPos)) return;
		positionPath(path,path._initialPos[0],path._initialPos[1]);
		if (!un(path.interact) && !un(path.interact._dragAreaHit)) {
			var dragAreaHit = path.interact._dragAreaHit;
			delete path.interact._dragAreaHit;
			delete dragAreaHit.obj.interact._dragHit;
			if (typeof dragAreaHit.obj.interact.onUndrop === 'function') {
				dragAreaHit.obj.interact.onUndrop(dragAreaHit.obj,path);
			}
		}
	},
	dragResetAll: function() {
		for (var p = 0; p < draw.path.length; p++) {
			var path = draw.path[p];
			draw.interact.dragReset(path);
		}
	},
	dragStart: function(e) {
		updateMouse(e);
		changeDrawMode('selectDrag');
		draw.drag = draw.currCursor;
		var path = draw.drag.path;
		draw.drag.path._interacting = true;
		if (path.interact.moveToFront == true) {
			//draw.qTable.updateAllPaths();
			var index = draw.path.indexOf(path);
			draw.path.splice(index,1);
			draw.path.push(path);
		}
		if (un(path.tightBorder)) updateBorder(path);
		if (un(path._initialPos) && !un(path.tightBorder)) {
			path._initialPos = [path.tightBorder[0],path.tightBorder[1]];
		}
		draw.drag.offset = [draw.mouse[0]-path.tightBorder[0],draw.mouse[1]-path.tightBorder[1]];
		draw.drag.startMouse = [draw.mouse[0],draw.mouse[1]];
		draw.drag.startPos = [path.tightBorder[0],path.tightBorder[1]];
		addListenerMove(window,draw.interact.dragMove);
		addListenerEnd(window,draw.interact.dragStop);
		draw.cursorCanvas.style.cursor = draw.cursors.move2;
		draw.drag.dragAreas = [];
		draw.objs(function(obj) {
			if (!un(obj.interact) && (obj.interact.type == 'dragArea' || obj.interact.dragArea == true)) {
				process(obj.interact);
			} else if (!un(obj.isInput) && (obj.isInput.type == 'dragArea' || obj.isInput.dragArea == true)) {
				process(obj.isInput);
			}
			function process(interact) {
				if (!un(interact._dragHit)) {
					if (interact._dragHit == draw.drag.path) {
						delete interact._dragHit;
						if (typeof interact.onUndrop == 'function') {
							interact.onUndrop(obj,draw.drag.path);
						}
					} else {
						return;
					}
				}
				var snap = boolean(interact.snap,false);
				var rect = obj.rect;
				var center = [rect[0]+0.5*rect[2],rect[1]+0.5*rect[3]];
				draw.drag.dragAreas.push({rect:rect,center:center,snap:snap,obj:obj});
			}
		});
		draw.selectedCanvas = draw.drawCanvas[1];
		if (!un(path.interact) && typeof path.interact.onDragStart == 'function') {
			path.interact.onDragStart(path);
		}
		drawCanvasPaths();
	},
	dragMove: function(e) {
		updateMouse(e);
		var path = draw.drag.path;
		var obj = draw.drag.obj || draw.drag.path.obj[0];
		if (draw.drag.dragType == 'circle') {
			var p = draw.drag.path;
			var circle = draw.drag.circle;
			if (!un(circle.interact) && typeof circle.interact.checkAllowDrag == 'function' && circle.interact.checkAllowDrag(circle,obj,draw.mouse) == false) return;
			var c = draw.drag.center;
			var r = draw.drag.radius;
			var a = getAngleFromAToB(c,[draw.mouse[0],draw.mouse[1]]);
			var pos = [c[0]+r*Math.cos(a),c[1]+r*Math.sin(a)];
			var dx = pos[0]-(p.border[0]+0.5*p.border[2]);
			var dy = pos[1]-(p.border[1]+0.5*p.border[3]);
			repositionPath(p,dx,dy);
			drawSelectedPaths();
		} else if (draw.drag.dragType == 'lineSegment') {
			var p = draw.drag.path;
			var pos = closestPointOnLineSegment([draw.mouse[0],draw.mouse[1]],draw.drag.lineSegment.startPos,draw.drag.lineSegment.finPos);
			var dx = pos[0]-(p.border[0]+0.5*p.border[2]);
			var dy = pos[1]-(p.border[1]+0.5*p.border[3]);
			repositionPath(p,dx,dy);
			drawSelectedPaths();
		} else {
			var path = draw.drag.path;
			if (!un(obj.interact) && typeof obj.interact.checkAllowDrag == 'function' && obj.interact.checkAllowDrag(obj,pos) == false) return;
			if (!un(path.interact) && typeof path.interact.checkAllowDrag == 'function' && path.interact.checkAllowDrag(path,pos) == false) return;
			
			var pos2 = clone(draw.mouse);
			pos2[0] -= draw.drag.offset[0];
			pos2[1] -= draw.drag.offset[1];
			
			if (!un(path.interact) && !un(path.interact.dragRect)) {
				var dragRect = path.interact.dragRect;
				pos2[0] = Math.max(pos2[0],dragRect[0]);
				pos2[0] = Math.min(pos2[0],dragRect[0]+dragRect[2]-path.tightBorder[2]);
				pos2[1] = Math.max(pos2[1],dragRect[1]);
				pos2[1] = Math.min(pos2[1],dragRect[1]+dragRect[3]-path.tightBorder[3])
			} else {
				pos2[0] = Math.max(pos2[0],draw.drawArea[0]);
				pos2[0] = Math.min(pos2[0],draw.drawArea[0]+draw.drawArea[2]-path.tightBorder[2]);
				pos2[1] = Math.max(pos2[1],draw.drawArea[1]);
				pos2[1] = Math.min(pos2[1],draw.drawArea[1]+draw.drawArea[3]-path.tightBorder[3])
			}
			var posRel = [pos2[0]-draw.drag.startPos[0],pos2[1]-draw.drag.startPos[1]];
			resizeCanvas2(draw.selectedCanvas,(posRel[0]+draw.drawRelPos[0])*draw.scale,(posRel[1]+draw.drawRelPos[1])*draw.scale);
			
			path._dragPos = [pos2[0],pos2[1]];
			
			//repositionPath(path,pos[0]-path.tightBorder[0],pos[1]-path.tightBorder[1]);
			updateBorder(path);
			
			var pos4 = [path._dragPos[0]+0.5*path.tightBorder[2],path._dragPos[1]+0.5*path.tightBorder[3]]; // centre of dragObj
			delete draw.drag.path.interact._dragAreaHit;
			for (d = 0; d < draw.drag.dragAreas.length; d++) {
				var dragArea = draw.drag.dragAreas[d];
				if (dist(pos4[0],pos4[1],dragArea.center[0],dragArea.center[1]) < 40) {
					draw.drag.path.interact._dragAreaHit = dragArea;
					dragArea.obj.interact._dragHit = draw.drag.path;
					if (dragArea.snap === true) {
						var path2 = draw.getPathOfObj(dragArea.obj);
						var border2 = path2.tightBorder;
						var pos3 = [border2[0]+0.5*border2[2],border2[1]+0.5*border2[3]]; // center of dragArea
						var posNew = [pos3[0]-0.5*path.tightBorder[2],pos3[1]-0.5*path.tightBorder[3]];
						var posRel = [posNew[0]-draw.drag.startPos[0],posNew[1]-draw.drag.startPos[1]];
						resizeCanvas2(draw.selectedCanvas,(posRel[0]+draw.drawRelPos[0])*draw.scale,(posRel[1]+draw.drawRelPos[1])*draw.scale);
						path._dragPos = [posNew[0],posNew[1]];
					}
					if (typeof dragArea.obj.interact.onDrop == 'function') {
						dragArea.obj.interact.onDrop(dragArea.obj,draw.drag.path);
					}
				} else if (dragArea.obj.interact._dragHit == draw.drag.path) {
					delete dragArea.obj.interact._dragHit;
					delete draw.drag.path.interact._dragAreaHit;
					if (typeof dragArea.obj.interact.onUndrop == 'function') {
						dragArea.obj.interact.onUndrop(dragArea.obj,draw.drag.path);
					}
				}
			}
		}
		if (!un(path.interact) && typeof path.interact.onDragMove == 'function') {
			path.interact.onDragMove(path);
		}
		if (!un(obj.interact) && typeof obj.interact.onDragMove == 'function') {
			obj.interact.onDragMove(obj);
		}
		draw.interact.update();
	},
	dragStop: function(e) {
		changeDrawMode();
		calcCursorPositions();
		var path = draw.drag.path;
		delete path._interacting;
		delete path.interact._match;
		if (!un(path.interact._dragAreaHit) && !un(path.interact._dragAreaHit.obj) && !un(path.interact._dragAreaHit.obj.interact) && !un(path.interact._dragAreaHit.obj.interact.value)) {
			if (path.interact._dragAreaHit.obj.interact.value == path.interact.value) {
				path.interact._match = true;
			}
		}
		delete draw.drag;
		resizeCanvas2(draw.selectedCanvas,draw.drawRelPos[0],draw.drawRelPos[1]);
		if (!un(path._dragPos)) positionPath(path,path._dragPos[0],path._dragPos[1]);
		delete draw.selectedCanvas;
		delete path._dragPos;
		delete draw.selectedCanvases;
		draw.interact.update();
		drawCanvasPaths();
		removeListenerMove(window,draw.interact.dragMove);
		removeListenerEnd(window,draw.interact.dragStop);
		if (!un(path.interact) && typeof path.interact.onDragStop == 'function') {
			path.interact.onDragStop(path);
		}

		draw.cursorCanvas.style.cursor = draw.cursors.move1;
	},
	animation:false,
	startAnimation: function(func) {
		draw.interact._frame = -1;
		draw.interact._func = func;
		draw.interact.animation = true;
		window.requestAnimationFrame(draw.interact.animationStep);
	},
	stopAnimation: function() {
		draw.interact.animation = false;
	},
	animationStep: function() {
		if (draw.interact.animation == false) {
			delete draw.interact._frame;
			delete draw.interact._func;
			return;
		}
		draw.interact._frame++;
		var nextFrame = draw.interact._func(draw.interact._frame);
		drawCanvasPaths();
		if (nextFrame == false) {
			delete draw.interact._frame;
			delete draw.interact._func;
			draw.interact.animation = false;
		} else {
			window.requestAnimationFrame(draw.interact.animationStep);
		}
	},
	setFeedback: function(feedback,color) {
		for (var p = 0; p < draw.path.length; p++) {
			var path = draw.path[p];
			for (var o = 0; o < path.obj.length; o++) {
				var obj = path.obj[o];
				if (obj.type == 'feedback') {
					obj._feedback = feedback;
					obj._color = color;
				}
			}
		}
		drawCanvasPaths();
	},
	clearFeedback: function(feedback,color) {
		for (var p = 0; p < draw.path.length; p++) {
			var path = draw.path[p];
			for (var o = 0; o < path.obj.length; o++) {
				var obj = path.obj[o];
				if (obj.type == 'feedback') {
					delete obj._feedback;
					delete obj._color;
				}
			}
		}
		drawCanvasPaths();
	},
	checkPage: function(setFeedback) {
		var inputs = [];
		
		var dragCheckMode = 'none';
		var dragCanvasCount = 0;
		var dragAreaCount = 0;
		var dragSnapAreaCount = 0;
		for (var p = 0; p < draw.path.length; p++) {
			var path = draw.path[p];
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

		for (var p = 0; p < draw.path.length; p++) {
			var path = draw.path[p];
			if (un(path.isInput)) continue;
			if (path.isInput.type == 'text') {
				inputs.push({type:'text',path:path});
			} else if (path.isInput.type == 'drag' && dragCheckMode == 'dragCanvas') {
				inputs.push({type:'drag',path:path});
			} else if (path.isInput.type == 'dragArea' && dragCheckMode == 'dragArea') {
				inputs.push({type:'dragArea',path:path});
			} else if (path.isInput.type == 'select') {
				inputs.push({type:'select',path:path});
			}
		}
		
		var checkVars = {check:true,a:[],qs:inputs.length};
		var correct = 0;
		var max = inputs.length;
		
		for (var q = 0; q < max; q++) {
			var input = inputs[q];		
			if (input.type == 'text') {
				
			} else if (input.type == 'select') {
				
			} else if (input.type == 'drag') {
				var check = true;
				if (un(input.path._dragAreaHit)) {
					checkVars.check = false;
					checkVars.fb = "You need to drag all the boxes into position.";
				} else if (input.path._dragHit._match !== true) {
					check = false;
				}
				if (check == true) correct++;
				checkVars.a[q] = {type:'dragArea',check:check};
			} else if (input.type == 'dragArea') {
				var check = true;
				if (un(input.path._dragHit)) {
					checkVars.check = false;
					checkVars.fb = "You need to drag boxes into all the positions.";
				} else if (input.path._dragHit._match !== true) {
					check = false;
				}
				if (check == true) correct++;
				checkVars.a[q] = {type:'dragArea',check:check};
			}
		}
		
		/*if (drags.length > 0) {
			if (dragSnapAreaCount > 0) { // check by dragArea
				for (var i = 0; i < dragAreas.length; i++) {
					var dragArea = dragAreas[i];
					console.log(dragArea);
					if (un(dragArea._dragHit) || dragArea._dragHit._match !== true) {
						errorCount++;
					}
				}
			} else { // check by drags
				for (var i = 0; i < drags.length; i++) {
					var drag = drags[i];
					console.log(drag);
					if (drag._match !== true) {
						errorCount++;
					}
				}
			}
		}*/
		
		if (!un(checkVars.fb)) {
			var feedback = checkVars.fb;
			var color = '#C60';
		} else {
			var wrong = max-correct;
			if (wrong == 1) {
				var feedback = '1 answer is incorrect.';
				var color = '#C60';
			} else if (wrong > 1) {
				var feedback = wrong+' answers are incorrect.';
				var color = '#C60';
			} else {
				var feedback = 'All correct! Well done.';
				var color = '#060';
			}
		}
		if (boolean(setFeedback,true) == true) draw.interact.setFeedback(feedback,color);
		return checkVars;
	}
};
draw.obj = {
	properties:{
		visible:{
			type:'boolean',
			get: function(obj) {
				return boolean(obj.visible,true);
			},
			set: function(obj,value) {
				obj.visible = value;
			}
		}
	}
};
function o(id) {
	return draw.getObjById(id);
}
draw.objsOfType = function(type) {
	for (var p = 0; p < draw.path.length; p++) {
		var path = draw.path[p];
		var found = false;
		for (var o = 0; o < path.obj.length; o++) {
			var obj = path.obj[o];
			if (obj.type == type) {
				console.log(obj);
				found = true;
			}
		}
		path.selected = found;
	}
	drawCanvasPaths();
}
draw.animate = function(onmove,onend,onframe) {
	if (!un(draw._animation) && !un(draw._animation.stop)) draw._animation.stop();
	if (un(onmove)) onmove = function() {};
	if (un(onend)) onend = function() {};
	if (un(onframe)) onframe = drawSelectedPaths;
	draw._animation = {
		onmove:onmove,
		onframe:onframe,
		onend:onend
	};
	draw._animation.frame = function() {
		draw._animation.onframe();
		draw._animation.frameID = window.requestAnimationFrame(draw._animation.frame);
	}
	draw._animation.stop = function(e) {
		if (un(draw._animation)) return;
		if (!un(e)) e.stopPropagation();
		draw._animation.onend(e);
		draw._animation.onframe();
		window.cancelAnimationFrame(draw._animation.frameID);
		document.removeEventListener("touchmove", draw._animation.onmove);
		document.removeEventListener("mousemove", draw._animation.onmove);
		document.removeEventListener("touchend", draw._animation.stop);
		document.removeEventListener("mouseup", draw._animation.stop);
		delete draw._animation;
		if (draw.mode === 'edit' && !un(draw.contextMenu)) draw.contextMenu.update();		
	}
	document.addEventListener("touchmove", draw._animation.onmove, false);
	document.addEventListener("mousemove", draw._animation.onmove, false);
	document.addEventListener("touchend", draw._animation.stop, true);
	document.addEventListener("mouseup", draw._animation.stop, true);
	
	draw._animation.frameID = window.requestAnimationFrame(draw._animation.frame);
}

draw.togglePathDraggable = function() {
	var path = draw.currCursor.path;
	if (un(path.interact)) path.interact = {};
	path.interact.draggable = !path.interact.draggable;
	updateBorder(path);
	drawSelectCanvas();
}

function drawClickSelect() {
	cursorPosHighlight(true);
	var pathNum = draw.currCursor.pathNum;	
	if (!shiftOn) deselectAllPaths(false);
	draw.path[pathNum].selected = !draw.path[pathNum].selected;
	draw.controlPanel.clear();
	calcCursorPositions();
	drawCanvasPaths();
};
function drawClickStartSelectRect() {
	if (shiftOn == false) {
		deselectAllPaths(true);
	} else {
		for (var i = 0; i < draw.path.length; i++) {
			var path = draw.path[i];
			if (getPathVis(path) && path.selected == true) {
				path._preSelected = true;
			}
		}
	}
	draw.startX = draw.mouse[0];
	draw.startY = draw.mouse[1];
	changeDrawMode('selectRect');
	draw.selectRect = [draw.mouse[0],draw.mouse[1],0,0];
	//addListenerMove(window,selectRectMove);
	//addListenerEnd(window,selectRectStop);
	draw.animate(selectRectMove,selectRectStop,drawSelectCanvas);
};
function selectRectMove(e) {
	updateMouse(e);
	var x = draw.mouse[0];
	var y = draw.mouse[1];
	draw.selectRect[2] = x - draw.startX;
	draw.selectRect[3] = y - draw.startY;	

	if (draw.selectRect[0] < x) {
		var selectLeft = draw.selectRect[0];
		var selectRight = x;		
	} else {
		var selectLeft = x;
		var selectRight = draw.selectRect[0];		
	}
	
	if (draw.selectRect[1] < y) {
		var selectTop = draw.selectRect[1];
		var selectBottom = y;		
	} else {
		var selectTop = y;
		var selectBottom = draw.selectRect[1];		
	}

	for (var i = 0; i < draw.path.length; i++) {
		var path = draw.path[i];
		//if (un(path.border)) continue;
		//if (getPathVis(path) && path.border[0] >= selectLeft && path.border[4] <= selectRight && path.border[1] >= selectTop && path.border[5] <= selectBottom) {
		if (un(path._center)) continue;
		if (path._preSelected == true) continue;
		if (getPathVis(path) && path._center[0] >= selectLeft && path._center[0] <= selectRight && path._center[1] >= selectTop && path._center[1] <= selectBottom) {
			path.selected = true;
		} else {
			path.selected = false;
		}
	}
	//drawSelectCanvas();		
	//drawSelectCanvas2();
}
function selectRectStop(e) {
	changeDrawMode();
	for (var p = 0; p < draw.path.length; p++) {
		delete draw.path[p]._preSelected;
		if (draw.path[p].selected == true) {
			drawCanvasPaths();
			break;
		}
	}
	drawSelectCanvas2();
	draw.startX = null;
	draw.startY = null;	
	//removeListenerMove(window,selectRectMove);
	//removeListenerEnd(window,selectRectStop);
}

function drawClickStartZoomRect() {
	draw.startX = draw.mouse[0];
	draw.startY = draw.mouse[1];
	changeDrawMode('zoomRect');
	draw.zoomRect = [draw.mouse[0],draw.mouse[1],0,0];
	//addListenerMove(window,zoomRectMove);
	//addListenerEnd(window,zoomRectStop);
	draw.animate(zoomRectMove,zoomRectStop,drawSelectCanvas2);
};
function zoomRectMove(e) {
	updateMouse(e);
	var x = draw.mouse[0];
	var y = draw.mouse[1];
	draw.zoomRect[2] = x - draw.startX;
	draw.zoomRect[3] = y - draw.startY;	
	//drawSelectCanvas2();
}
function zoomRectStop(e) {
	changeDrawMode();
	setZoomRect(draw.zoomRect);
	drawSelectCanvas2();
	//removeListenerMove(window,zoomRectMove);
	//removeListenerEnd(window,zoomRectStop);
}
function changeDrawScale(scale) {
	if (un(scale)) scale = 1;
	draw.scale = scale;
	var canvases = clone(draw.drawCanvas);
	canvases.push(draw.cursorCanvas);
	canvases.push(draw.toolsCanvas);
	/*var w = Math.max(draw.drawArea[2],draw.drawArea[2]*draw.scale);
	var h = Math.max(draw.drawArea[3],draw.drawArea[3]*draw.scale);
	//console.log(w,h);
	for (var c = 0; c < canvases.length; c++) {
		var canvas = canvases[c];
		resizeCanvas3(canvas,undefined,undefined,w,h);
	}*/
	drawCanvasPaths();
	drawToolsCanvas();
}
function setZoomRect(rect) {
	//console.log(rect);
	var xScale = 1200 / rect[2];
	var yScale = 700 / rect[3];
	var scale = Math.min(xScale,yScale);
	var xOffset = (1200 - scale*rect[2])/2;
	var yOffset = (700 - scale*rect[3])/2;
	//console.log(xScale,yScale,scale);
	//console.log(xOffset,yOffset);
	//console.log(-rect[0]*scale,-rect[1]*scale);
	changeDrawScale(scale);
	changeDrawRelPos(-rect[0]*scale,-rect[1]*scale);
	
	/*
	if (rect[2]/rect[3] > 12/7) {
		var w = 1200;
		var h = w * (rect[3]/rect[2]); 
	} else {
		var h = 700;
		var w = h * (rect[2]/rect[3]);
	}
	var rect2 = [(1200-w)/2,(700-h)/2,w,h];
	var sf = rect2[2] / rect[2];
	*/
	
	/*
	var ctx = draw.cursorCanvas.ctx;
	ctx.scale(draw.scale,draw.scale);
	ctx.clear();
	ctx.fillStyle = colorA('#000',0.75);
	ctx.fillRect(0,0,ctx.data[102],ctx.data[103]);
	ctx.clearRect(rect[0],rect[1],rect[2],rect[3]);
	ctx.setTransform(1,0,0,1,0,0);
	*/
}

function drawClickStartDragObject() {
	changeDrawMode('selectDrag');
	draw.undo.saveState();	
	cursorPosHighlight(true);
	draw.cursorCanvas.style.cursor = draw.cursors.move2;
	draw.startDragX = draw.mouse[0];
	draw.startDragY = draw.mouse[1];
	draw.selectedCanvases = [];
	draw.selectedPaths = getSelectedPaths();
	draw.selPaths = selPaths();
	//draw.selectedPathNums = selPathNums();
	draw.selectedCanvases.push(draw.drawCanvas[1],draw.drawCanvas[draw.drawCanvas.length-1]);
	
	if (!un(draw.gridMenu) && draw.gridMenu.showing == true) {
		draw.prevX = mouse.x;
		draw.prevY = mouse.y;
	}
	draw.dragX = draw.mouse[0];
	draw.dragY = draw.mouse[1];
	draw.prev = clone(draw.mouse);
	draw.dragSnapped = false;
	draw.dragOffsetX = draw.mouse[0] - draw.path[draw.selectedPaths[0]].tightBorder[0];
	draw.dragOffsetY = draw.mouse[1] - draw.path[draw.selectedPaths[0]].tightBorder[1];
	addListenerMove(window,selectDragMove);
	addListenerEnd(window,selectDragStop);
};
function selectDragMove(e) {
	updateMouse(e);
	var paths = draw.selPaths;
	if (altOn == true && paths.length == 1 && paths[0].obj.length == 1) {
		var obj = paths[0].obj[0];
		if (!un(draw[obj.type]) && !un(draw[obj.type].altDragMove)) {
			var dx = draw.mouse[0] - draw.prev[0];
			var dy = draw.mouse[1] - draw.prev[1];
			draw[obj.type].altDragMove(obj,dx,dy);
			drawSelectedPaths();
			updateBorder(paths[0]);
			drawSelectCanvas();
			draw.prev = clone(draw.mouse);
			return;
		}
	}
	//var x = mouse.x + draw.drawRelPos[0] + draw.drawArea[0] - draw.startDragX;
	//var y = mouse.y + draw.drawRelPos[1] + draw.drawArea[1] - draw.startDragY;
	var x = draw.mouse[0] - draw.startDragX;
	var y = draw.mouse[1] - draw.startDragY;
	draw.dragSnapped = false;
	if (snapToObj2On) {
		var obj = sel();
		if (obj.type == 'circle' || obj.type == 'point') {
			/*var x2 = x + obj.center[0] - draw.drawRelPos[0];
			var y2 = y + obj.center[1] - draw.drawRelPos[1];
			var snapPos = snapToObj2([x2,y2]);
			x = snapPos[0] - obj.center[0] + draw.drawRelPos[0];
			y = snapPos[1] - obj.center[1] + draw.drawRelPos[1];
			*/
			var pos2 = drawPosToCanvasPos([x+obj.center[0],y+obj.center[1]]);
			var snapPos = snapToObj2(pos2);
			snapPos = canvasPosToDrawPos([snapPos[0]-obj.center[0],snapPos[1]-obj.center[1]]);
			x = snapPos[0];
			y = snapPos[1];
			draw.dragSnapped = true;
		} else if (obj.type == 'text2') {
			var xLeft = obj.rect[0]+x-draw.drawRelPos[0];
			var xCenter = obj.rect[0]+0.5*obj.rect[2]+x-draw.drawRelPos[0];
			var xRight = obj.rect[0]+obj.rect[2]+x-draw.drawRelPos[0];
			var yTop = obj.rect[1]+y-draw.drawRelPos[1];
			var yMiddle = obj.rect[1]+0.5*obj.rect[3]+y-draw.drawRelPos[1];
			var yBottom = obj.rect[1]+obj.rect[3]+y-draw.drawRelPos[1];
			var found = false;
			if (un(draw.savedTextAlign)) {
				draw.savedTextArray = clone(obj.text);
				draw.savedTextAlign = clone(obj.align);
			}
			for (var p = 0; p < draw.path.length; p++) {
				if (found == true) break;
				var path2 = draw.path[p];
				for (var o = 0; o < path2.obj.length; o++) {
					if (found == true) break;
					var obj2 = path2.obj[o];
					if (obj2.type == 'table2') {
						var x2 = obj2.left;
						var y2 = obj2.top;
						var xFound = yFound = false;
						for (var w = 0; w < obj2.widths.length; w++) {
							var width = obj2.widths[w];
							if (Math.abs(x2+(width/2)-xCenter) < draw.snapTolerance) {
								x2 += width/2;
								xFound = true;
								break;
							} else {
								x2 += width;
							}
						}
						if (xFound == true) {
							for (var h = 0; h < obj2.heights.length; h++) {
								var height = obj2.heights[h];
								if (Math.abs(y2+(height/2)-yMiddle) < draw.snapTolerance) {
									y2 += height/2;
									yFound = true;
									break;
								} else {
									y2 += height;
								}
							}
						}
						if (xFound == true && yFound == true) {
							x += x2 - xCenter;
							y += y2 - yMiddle;
							found = true;
							obj.align = [0,0];
							break;
						}
					}
					if (un(obj2._textSnapPos)) continue;
					for (var q = 0; q < obj2._textSnapPos.length; q++) {
						if (found == true) break;
						var pos = obj2._textSnapPos[q];
						if (arraysEqual(pos.align,[-1,0])) {
							if (dist(pos.pos[0],pos.pos[1],xLeft,yMiddle) < draw.snapTolerance) {
								x += pos.pos[0] - xLeft;
								y += pos.pos[1] - yMiddle;
								obj.align = [-1,0];
								found = true;
								break;
							}
						} else if (arraysEqual(pos.align,[-1,-1])) {
							if (dist(pos.pos[0],pos.pos[1],xLeft,yTop) < draw.snapTolerance) {
								x += pos.pos[0] - xLeft;
								y += pos.pos[1] - yTop;
								found = true;
								obj.align = [-1,-1];
								break;
							}
						} else if (arraysEqual(pos.align,[0,-1])) {
							if (dist(pos.pos[0],pos.pos[1],xCenter,yTop) < draw.snapTolerance) {
								x += pos.pos[0] - xCenter;
								y += pos.pos[1] - yTop;
								found = true;
								obj.align = [0,-1];
								break;
							}
						} else if (arraysEqual(pos.align,[1,-1])) {
							if (dist(pos.pos[0],pos.pos[1],xRight,yTop) < draw.snapTolerance) {
								x += pos.pos[0] - xRight;
								y += pos.pos[1] - yTop;
								found = true;
								obj.align = [1,-1];
								break;
							}
						} else if (arraysEqual(pos.align,[1,0])) {
							if (dist(pos.pos[0],pos.pos[1],xRight,yMiddle) < draw.snapTolerance) {
								x += pos.pos[0] - xRight;
								y += pos.pos[1] - yMiddle;
								found = true;
								obj.align = [1,0];
								break;
							}
						} else if (arraysEqual(pos.align,[1,1])) {
							if (dist(pos.pos[0],pos.pos[1],xRight,yBottom) < draw.snapTolerance) {
								x += pos.pos[0] - xRight;
								y += pos.pos[1] - yBottom;
								found = true;
								obj.align = [1,1];
								break;
							}
						} else if (arraysEqual(pos.align,[0,1])) {
							if (dist(pos.pos[0],pos.pos[1],xCenter,yBottom) < draw.snapTolerance) {
								x += pos.pos[0] - xCenter;
								y += pos.pos[1] - yBottom;
								found = true;
								obj.align = [0,1];
								break;
							}
						} else if (arraysEqual(pos.align,[-1,1])) {
							if (dist(pos.pos[0],pos.pos[1],xLeft,yBottom) < draw.snapTolerance) {
								x += pos.pos[0] - xLeft;
								y += pos.pos[1] - yBottom;
								found = true;
								obj.align = [-1,1];
								break;
							}
						}
					}
				}
			}
			if (found == true) {
				obj.text = removeTagsOfType(obj.text,'align');
				draw.dragSnapped = true;
				drawCanvasPaths();
			} else {
				obj.text = draw.savedTextArray;
				obj.align = draw.savedTextAlign;
			}
		}
	} else if (shiftOn == true && snapBordersOn == true) {
		var snapDiff = snapBorders(draw.selectedPaths[0],draw.mouse[0]-draw.dragOffsetX,draw.mouse[1]-draw.dragOffsetY);
		x += snapDiff[0];
		y += snapDiff[1];
		draw.dragSnapped = true;
	}	
	for (var c = 0; c < draw.selectedCanvases.length; c++) {
		if (!un(draw.div)) {
			var w = (1200/1235)*canvas.getBoundingClientRect().width*draw.div.zoom;
			var h = w*(1700/1200);
			draw.selectedCanvases[c].style.left = ((w/1200)*(x+draw.drawRelPos[0])*draw.scale)+'px';
			draw.selectedCanvases[c].style.top = ((h/1700)*(y+draw.drawRelPos[1])*draw.scale)+'px';
		} else {
			resizeCanvas2(draw.selectedCanvases[c],(x+draw.drawRelPos[0])*draw.scale,(y+draw.drawRelPos[1])*draw.scale);
		}
	}
	if (!un(draw.gridMenu) && draw.gridMenu.showing == true) {
		var dx = draw.mouse[0] - draw.prevX;
		var dy = draw.mouse[1] - draw.prevY;
		draw.gridMenu.move(dx,dy);
		draw.prevX = draw.mouse[0];
		draw.prevY = draw.mouse[1];
	}
	draw.dragX = x;
	draw.dragY = y;
}
function selectDragStop(e) {
	updateMouse(e);
	draw.undo.saveState();
	removeListenerMove(window,selectDragMove);
	removeListenerEnd(window,selectDragStop);
	changeDrawMode();
	draw.cursorCanvas.style.cursor = draw.cursors.move1;
	if (altOn == true) return;
	if (draw.dragSnapped == true) {
		var dx = draw.dragX;// - draw.drawRelPos[0];
		var dy = draw.dragY;// - draw.drawRelPos[1];
	} else {
		var dx = draw.mouse[0] - draw.startDragX;
		var dy = draw.mouse[1] - draw.startDragY;
	}
	for (var c = 0; c < draw.selectedCanvases.length; c++) {
		if (!un(draw.div)) {
			draw.selectedCanvases[c].style.left = '0px';
			draw.selectedCanvases[c].style.top = '0px';
		} else {
			resizeCanvas2(draw.selectedCanvases[c],draw.drawRelPos[0],draw.drawRelPos[1]);
		}
	}
	draw.selectedCanvases = [];	
	for (var i = 0; i < draw.path.length; i++) {
		if (draw.path[i].selected == true) {
			repositionPath(draw.path[i],dx,dy,0,0);
		}
	}
	gridSnapObjects();
	drawCanvasPaths();
	delete draw.selectedPathNums;
	delete draw.savedTextArray;
	delete draw.savedTextAlign;
	draw.undo.saveState();
}

function drawClickStartResizeObject() {
	changeDrawMode('selectResize');
	cursorPosHighlight(true);
	draw.cursorCanvas.style.cursor = draw.cursors.nw;	
	draw.prevX = draw.mouse[0];
	draw.prevY = draw.mouse[1];
	draw.resizePathNum = draw.currCursor.pathNum;
	//addListenerMove(window,selectResizeMove);
	//addListenerEnd(window,selectResizeStop);
	draw.animate(selectResizeMove,selectResizeStop,function() {
		drawSelectedPaths();
		drawSelectCanvas();
	});
}
function selectResizeMove(e) {
	updateMouse(e);
	var dw = draw.mouse[0] - draw.prevX;
	var dh = draw.mouse[1] - draw.prevY;
	repositionPath(draw.path[draw.resizePathNum],0,0,dw,dh);
	//drawSelectedPaths();
	//drawSelectCanvas();
	draw.prevX = draw.mouse[0];
	draw.prevY = draw.mouse[1];
}
function selectResizeStop(e) {
	changeDrawMode('prev');
	draw.cursorCanvas.style.cursor = draw.cursors.move1;
	gridSnapObjects();
	draw.prevX = null;
	draw.prevY = null;
	delete draw.resizePathNum;
	//removeListenerMove(window,selectResizeMove);
	//removeListenerEnd(window,selectResizeStop);
}

function drawClickStartResizePath() {
	changeDrawMode('selectResize');
	draw._path = draw.path[draw.currCursor.pathNum];
	//console.log(draw._path);
	draw.cursorCanvas.style.cursor = draw.cursors.nw;	
	//addListenerMove(window,selectResizePathMove);
	//addListenerEnd(window,selectResizePathStop);
	draw.animate(selectResizePathMove,selectResizePathStop,function() {
		drawSelectedPaths();
		drawSelectCanvas();
	});
}
function selectResizePathMove(e) {
	updateMouse(e);
	var x = draw.mouse[0];
	var y = draw.mouse[1];
	var sfx = (x-draw._path.tightBorder[0])/draw._path.tightBorder[2];
	var sfy = (y-draw._path.tightBorder[1])/draw._path.tightBorder[3];
	draw.scalePath(draw._path,Math.min(sfx,sfy),draw._path.tightBorder);
	updateBorder(draw._path);
	//drawCanvasPaths();
	//drawSelectCanvas2();	
}
function selectResizePathStop(e) {
	changeDrawMode('prev');
	draw.cursorCanvas.style.cursor = draw.cursors.move1;
	delete draw._pathNum;
	//removeListenerMove(window,selectResizePathMove);
	//removeListenerEnd(window,selectResizePathStop);
}

draw.rotateStart = function(e) {
	changeDrawMode('selectRotate');
	cursorPosHighlight(true);
	draw.cursorCanvas.style.cursor = draw.cursors.rotate;	
	draw.currPath = draw.path[draw.currCursor.pathNum];
	addListenerMove(window,draw.rotateMove);
	addListenerEnd(window,draw.rotateStop);
}
draw.rotateMove = function(e) {
	updateMouse(e);
	var x = draw.mouse[0];
	var y = draw.mouse[1];
	draw.currPath.rotation = getAngleTwoPoints([draw.currPath.border[0]+0.5*draw.currPath.border[2],draw.currPath.border[1]+0.5*draw.currPath.border[3]],[x,y]) + Math.PI/2;
	drawSelectedPaths();
	drawSelectCanvas();
}
draw.rotateStop = function(e) {
	changeDrawMode('prev');
	draw.cursorCanvas.style.cursor = draw.cursors.move1;
	delete draw.currPath;
	removeListenerMove(window,draw.rotateMove);
	removeListenerEnd(window,draw.rotateStop);	
}

function drawClickAppear() {
	var pathNum = draw.currCursor.pathNum;
	var path = draw.path[pathNum];
	
	if (un(path.appear)) {
		path.appear = {};
	} else if (boolean(path.appear.reversible,false) == false) {
		path.appear.reversible = true;
	} else {
		delete path.appear;
	}
	updateBorder(path);
	drawCanvasPaths();
}
function drawClickAppearMoveStart() {
	changeDrawMode('appearMove');
	draw.cursorCanvas.style.cursor = draw.cursors.move2;
	draw.appearMoveMode = true;
	draw.selPath = draw.path[draw.currCursor.pathNum];
	//addListenerMove(window,drawClickAppearMoveMove);
	//addListenerEnd(window,drawClickAppearMoveStop);
	draw.animate(drawClickAppearMoveMove,drawClickAppearMoveStop,drawSelectCanvas2);	
}
function drawClickAppearMoveMove(e) {
	updateMouse(e);
	draw.selPath.appear.pos = [round(draw.mouse[0],10),round(draw.mouse[1],10)];
	delete draw.selPath.appear.center;
	//drawSelectCanvas2();
}
function drawClickAppearMoveStop(e) {
	changeDrawMode();
	delete draw.selPath;
	delete draw.appearMoveMode;
	drawSelectCanvas2();
	//removeListenerMove(window,drawClickAppearMoveMove);
	//removeListenerEnd(window,drawClickAppearMoveStop);
}

function drawClickTrigger() {
	var pathNum = draw.currCursor.pathNum;
	var path = draw.path[pathNum];
	
	//* just handles showAns at present
	if (!un(path.trigger) && arraysEqual(path.trigger,[false])) {
		delete path.trigger;
	} else {
		path.trigger = [false];
	}
	//*/
	
	/*var prevVis = true;
	if (typeof path.trigger == 'undefined') path.trigger = [];
	for (var l = 0; l <= draw.triggerNum; l++) {
		if (typeof path.trigger[l] == 'boolean') {
			prevVis = path.trigger[l];
		}
	}
	path.trigger[draw.triggerNum] = !prevVis;
	
	for (var o = 0; o < path.obj.length; o++) {
		var obj = path.obj[o];
		var prevVis = true;
		if (un(obj.trigger)) obj.trigger = [];
		for (var l = 0; l <= draw.triggerNum; l++) {
			if (typeof obj.trigger[l] == 'boolean') {
				prevVis = obj.trigger[l];
			}
		}
		obj.trigger[draw.triggerNum] = !prevVis;
	}
	
	if (!un(draw.triggerSlider) && draw.ansMode !== true && draw.triggerNum == draw.triggerNumMax) {
		draw.triggerNumMax++;
		draw.triggerSlider.max = draw.triggerNumMax;
		draw.triggerSlider.sliderData[100] = draw.triggerSlider.left + (draw.triggerNum / draw.triggerNumMax) * draw.triggerSlider.width;
		resize();
	}*/
	drawCanvasPaths();
}
function drawClickOrderPlus() {
	if (!un(draw.currCursor.pathNum)) {
		var pathNum = draw.currCursor.pathNum;
	} else {
		for (var p = 0; p < draw.path.length; p++) {
			if (draw.path[p].selected == true) {
				var pathNum = p;
				break;
			}
		}
	}
	if (un(pathNum)) return;
	if (ctrlOn == true) {
		bringToFront([draw.path[pathNum]]);
	} else {
		bringForward(pathNum);
	}
}
function drawClickOrderMinus() {
	if (!un(draw.currCursor.pathNum)) {
		var pathNum = draw.currCursor.pathNum;
	} else {
		for (var p = 0; p < draw.path.length; p++) {
			if (draw.path[p].selected == true) {
				var pathNum = p;
				break;
			}
		}
	}
	if (un(pathNum)) return;
	if (ctrlOn == true) {
		sendToBack([draw.path[pathNum]]);
	} else {
		sendBackward();
	}
}
function bringForward(pathNum) {
	if (un(pathNum)) pathNum = selPathNum();
	if (pathNum == -1 || pathNum == draw.path.length-1) return;
	var path = draw.path[pathNum];
	draw.path[pathNum] = draw.path[pathNum+1];
	draw.path[pathNum+1] = path;
	draw.currCursor.pathNum++;
	updateBorder(draw.path[pathNum]);
	updateBorder(draw.path[pathNum+1]);
	calcCursorPositions();
	drawCanvasPaths();
}
function sendBackward(pathNum) {
	if (un(pathNum)) pathNum = selPathNum();
	if (pathNum == -1 || pathNum == 0) return;
	var path = draw.path[pathNum];
	draw.path[pathNum] = draw.path[pathNum-1];
	draw.path[pathNum-1] = path;
	draw.currCursor.pathNum--;
	updateBorder(draw.path[pathNum-1]);
	updateBorder(draw.path[pathNum]);
	calcCursorPositions();
	drawCanvasPaths();	
}
function sendToBack(paths) {
	var applyToAllSel = un(paths) ? true : false;
	if (un(paths)) paths = [];
	for (var p = draw.path.length-1; p >= 0; p--) {
		if (applyToAllSel == true && draw.path[p].selected == true) paths.push(draw.path[p]);
		if (paths.includes(draw.path[p])) draw.path.splice(p,1);
	}
	for (var p = paths.length-1; p >= 0; p--) {
		draw.path.unshift(paths[p]);
	}
	calcCursorPositions();
	drawCanvasPaths();
}
function bringToFront(paths) {
	var applyToAllSel = un(paths) ? true : false;
	if (un(paths)) paths = [];
	for (var p = draw.path.length-1; p >= 0; p--) {
		if (applyToAllSel == true && draw.path[p].selected == true) paths.push(draw.path[p]);
		if (paths.includes(draw.path[p])) draw.path.splice(p,1);
	}
	for (var p = paths.length-1; p >= 0; p--) {
		draw.path.push(paths[p]);
	}
	calcCursorPositions();
	drawCanvasPaths();
}
function drawClickDelete() {
	if (!un(textEdit) && textEdit.obj !== null) textEdit.endInput();
	var pathNum = draw.currCursor.pathNum;
	if (draw.path[pathNum].selected == true) removePathObject(pathNum);
	for (var p = 0; p < draw.path.length; p++) {
		updateBorder(draw.path[p]);
	}
	calcCursorPositions();
	drawCanvasPaths();
	cursorPosHighlight(true);
}

draw.movePathToFront = function(path) {
	var index = draw.path.indexOf(path);
	if (index === -1) return;
	draw.path.splice(index,1);
	draw.path.push(path);
	drawCanvasPaths();
}

draw.checkPathsForID = function(paths,id) {
	if (un(paths)) paths = draw.path;
	for (var p = 0; p < paths.length; p++) {
		if (paths[p].id === id) return true;
	}
	return false;
}
draw.getUniquePathID = function(paths,id) {
	if (un(paths)) paths = draw.path;
	var id2 = id;
	var num = 2;
	while (draw.checkPathsForID(paths,id2) === true) {
		id2 = id+'_'+num;
		num++;
	}
	return id2;
}
draw.checkObjsForID = function(paths,id) {
	if (un(paths)) paths = draw.path;
	for (var p = 0; p < paths.length; p++) {
		for (var o = 0; o < paths[p].obj.length; o++) {
			if (paths[p].obj[o].id === id) return true;
		}
	}
	return false;
}
draw.getUniqueObjID = function(paths,id) {
	if (un(paths)) paths = draw.path;
	var id2 = id;
	var num = 2;
	while (draw.checkObjsForID(paths,id2) === true) {
		id2 = id+'_'+num;
		num++;
	}
	return id2;
}

function cutPaths(e) {
	copyPaths(e);
	deletePaths();
}
function copyPaths(e) {
	draw.pathClipboard = [];
	var path = draw.path;
	for (var p = 0; p < path.length; p++) {
		if (path[p].selected) {
			draw.pathClipboard.push(clone(path[p]));
		}
	}

	if (typeof mode === 'string' && mode === 'edit') {
		//var paths = draw.stringifyDrawPaths({currFilename:currFilename, paths:draw.pathClipboard}, false)
		var paths = stringify({currFilename:currFilename, paths:draw.pathClipboard});
		paths = obfuscate(paths);
		updateClipboard(paths);
	}
	function updateClipboard(newClip) {
		navigator.clipboard.writeText(newClip).then(function() {
			Notifier.success('copied to clipboard');
		}, function() {

		});
	}
	function stringify(obj) {
		var circular = [];
		var str = stringify(obj);
		return str;
		
		function stringify(obj) {
			var str = "";
			if (circular.indexOf(obj) > -1) return "null";
			if (obj instanceof Array) {
				for (var i = 0; i < obj.length; i++) {
					if (typeof obj[i] == 'object') {
						circular.push(obj);
						break;
					}
				}
				str += "[";
				for (var i = 0; i < obj.length; i++) {
					if (obj.hasOwnProperty(i) !== true) continue;
					//if (typeof obj[i] === 'function' && ['last','ran','max','min','sortOn','shuffle','isEmpty','alphanumSort'].includes(i)) continue;
					str += stringify(obj[i])+',';
				}
				if (str.slice(-1) == ',') str = str.slice(0,-1);
				str += "]";
			} else if (typeof obj == 'object') {
				for (var key in obj) {
					if (typeof obj[key] == 'object') {
						circular.push(obj);
						break;
					}
				}
				str += "{";
				for (var key in obj) {
					if (obj.hasOwnProperty(key) !== true) continue;
					if (key.indexOf('_') === 0) continue;
					if (['borderButtons','border','tightBorder','selected','ctx','qBox',"data","cursorData","textLoc","cursorPos","cursorMap","allMap","canvas","ctx","cursorCanvas","cursorctx","startText","startRichText","startTags","stringJS","currBackColor","preText","postText"].includes(key)) continue;
					var value = stringify(obj[key]);
					if (value == '') continue;
					str += '"'+key+'":'+value+",";
				}
				if (str.slice(-1) == ',') str = str.slice(0,-1);
				str += "}";
			} else if (typeof obj == 'function') {
				var funcStr = obj.toString().replace(/\r?\n|\r|\t/g,"");
				str += JSON.stringify(funcStr);
			} else if (typeof obj == 'number') {
				str += String(Number(obj.toFixed(3)));
			} else if (typeof obj == 'string') {
				var escapeString = replaceAll(obj,"\"","\\\"");
				str += '"'+escapeString+'"';
			} else if (typeof obj == 'boolean') {
				str += obj;
			} else {
				if (typeof obj !== 'undefined') console.log('draw.stringify type not included: ',typeof obj,obj);
				str += 'null';
			}
			return str;
		}
	}
	function obfuscate(str) {
		var bytes = [];
		for (var i = 0; i < str.length; i++) {
			var charCode = str.charCodeAt(i);
			charCode = String("00000" + charCode).slice(-5);
			bytes.push(charCode);
		}
		return bytes.join('');
	}
}
function pastePaths(e) {
	deselectAllPaths(false);
	/*if (!un(draw.pathClipboard) && draw.pathClipboard.length > 0) {
		var paths = clonePaths2(draw.pathClipboard);
		if (shiftOn === false) {
			var top;
			for (var c = 0; c < paths.length; c++) {
				var path = paths[c];
				if (un(top)) {
					top = path.tightBorder[1];
				} else {
					top = Math.min(top,path.tightBorder[1])
				}
			}
			for (var c = 0; c < paths.length; c++) {
				var path = paths[c];
				positionPath(path,path.tightBorder[0],40-draw.drawRelPos[1]+path.tightBorder[1]-top);
			}
		}
		
		for (var c = 0; c < paths.length; c++) {
			var path = paths[c];
			if (typeof path.id === 'string') {
				path.id = draw.getUniquePathID(draw.path,path.id);
			}
			for (var o = 0; o < path.obj.length; o++) {
				var obj = path.obj[o];
				if (typeof obj.id === 'string') {
					obj.id = draw.getUniqueObjID(draw.path,obj.id);
				}
			}
			draw.path.push(path);
		}		
		calcCursorPositions();
		drawCanvasPaths();
	}*/
	if (typeof mode === 'string' && mode === 'edit') {
		navigator.clipboard.readText().then(function(clipText) {
			var json = deobfuscate(clipText);
			try {
				var clipObj = parse(json);
				//if (clipObj.currFilename !== currFilename) {
					Notifier.success('pasted from clipboard');
					var paths = draw.convertLoadedPaths(clipObj.paths);
					var top;
					for (var p = 0; p < paths.length; p++) {
						var path = paths[p];
						path.selected = true;
						updateBorder(path);
						if (un(top)) {
							top = path.tightBorder[1];
						} else {
							top = Math.min(top,path.tightBorder[1])
						}
					}
					if (shiftOn === false) {
						for (var c = 0; c < paths.length; c++) {
							var path = paths[c];
							positionPath(path,path.tightBorder[0],40-draw.drawRelPos[1]+path.tightBorder[1]-top);
						}
					}
					for (var c = 0; c < paths.length; c++) {
						var path = paths[c];
						if (typeof path.id === 'string') {
							path.id = draw.getUniquePathID(draw.path,path.id);
						}
						for (var o = 0; o < path.obj.length; o++) {
							var obj = path.obj[o];
							if (typeof obj.id === 'string') {
								obj.id = draw.getUniqueObjID(draw.path,obj.id);
							}
						}
						draw.path.push(path);
					}
					calcCursorPositions();
					drawCanvasPaths();
				//}
			} catch (e) {

			}		
		});
		function parse(json) {
			var obj = JSON.parse(json);
			parseObj(obj);
			return obj;
			
			function parseObj(obj) {
				if (obj instanceof Array) {
					for (var i = 0; i < obj.length; i++) {
						parseObj(obj[i]);
					}
				} else if (typeof obj === 'object') {
					for (var key in obj) {
						if (typeof obj[key] === 'object') {
							parseObj(obj[key]);
						} else if (typeof obj[key] === 'string') {
							if (obj[key].indexOf('function(') === 0 || obj[key].indexOf('function (') === 0) {
								obj[key] = Function("return " + obj[key])();
							}
						}
					}
				}				
			}
		}
		function deobfuscate(bytes) {
			var str = '';
			while (bytes.length > 0) {
				var code = bytes.slice(0,5);
				bytes = bytes.slice(5);
				str += String.fromCharCode(Number(code));
			}
			return str;
		}
	}
}
function clearPathClipboard() {
	draw.pathClipboard = [];
}
function clonePaths(paths) {
	if (un(paths)) paths = draw.path;
	var selected = [];
	for (var p = 0, pMax = paths.length; p < pMax; p++) {
		if (paths[p].selected == true) selected.push(paths[p]);
	}
	var clones = clonePaths2(selected);
	deselectAllPaths(false);
	for (var c = 0; c < clones.length; c++) {
		var path = clones[c];
		if (typeof path.id === 'string') {
			path.id = draw.getUniquePathID(draw.path,path.id);
		}
		for (var o = 0; o < path.obj.length; o++) {
			var obj = path.obj[o];
			if (typeof obj.id === 'string') {
				obj.id = draw.getUniqueObjID(draw.path,obj.id);
			}
		}
		draw.path.push(path);
	}
	for (var p = pMax; p < draw.path.length; p++) {	
		repositionPath(draw.path[p],40,40,0,0);
	}
	drawCanvasPaths();
}
function clonePaths2(paths) {
	var clones = [];
	for (var p = 0, pMax = paths.length; p < pMax; p++) {
		var path = clone(paths[p]);
		delete path.ctx;
		//delete path.id;
		//if (!un(path.interact)) delete path.interact.id;
		for (var o = 0; o < path.obj.length; o++) {
			var obj = path.obj[o];
			if (un(obj)) continue;
			//if (!un(obj.id)) delete obj.id;
			if (!un(obj.ctx)) delete obj.ctx;
			if (!un(draw[obj.type]) && typeof draw[obj.type].clone === 'function') draw[obj.type].clone(obj);
		}
		clones.push(path);
	}
	return clones;
}
function deletePaths() {
	for (var i = draw.path.length-1; i >= 0; i--) {
		if (draw.path[i].selected == true) {
			removePathObject(i);
		}
	}	
}
function clearDrawPaths() {
	for (var i = draw.path.length - 1; i >= 0; i--) {
		removePathObject(i);
	}
	drawCanvasPaths();
	//pathCanvasReset();
}
function deleteSelectedPaths() {
	for (var p = draw.path.length-1; p >= 0; p--) {
		if (draw.path[p].selected == true) {
			removePathObject(p);
		}
	}
	for (var p = 0; p < draw.path.length; p++) {
		updateBorder(draw.path[p]);
	}
	calcCursorPositions();
	drawCanvasPaths();
	drawSelectCanvas();	
}
function removePathObject(num) {
	draw.path.splice(num,1);
}

function selectAllPaths() {
	for (var p = 0; p < draw.path.length; p++) draw.path[p].selected = getPathVis(draw.path[p]);
	drawCanvasPaths();
	calcCursorPositions();	
}
function deselectAllPaths(redraw) {
	if (un(redraw)) redraw = true;
	if (!un(draw.gridMenu) && draw.gridMenu.showing == true) draw.gridMenu.hide();
	for (var i = 0; i < draw.path.length; i++) {
		if (draw.path[i].selected) {
			draw.path[i].selected = false;
		}
	}
	if (redraw == true) drawCanvasPaths();
	if (!un(draw.controlPanel)) draw.controlPanel.clear();
	if (!un(draw.controlPanel2) && !un(draw.controlPanel2.ctx)) draw.controlPanel2.clear();
	calcCursorPositions();
}
function getSelectedPaths() {
	var sel = [];
	for (var p = 0; p < draw.path.length; p++) {
		if (draw.path[p].selected == true) {
			sel.push(p);
		}
	}
	return sel;
}

function groupPaths() {
	var selected = [];
	for (var i = 0; i < draw.path.length; i++) {
		if (draw.path[i].obj.length == 1 && draw.path[i].obj[0].type === 'qBox') continue;
		if (draw.path[i].selected == true) selected.push(i);
	}
	if (selected.length > 1) {
		for (var p = 0; p < draw.path.length; p++) {
			var path = draw.path[p];
			if (path.selected == true) {
				updateBorder(path);
				if (!un(path.trigger)) {
					for (var o = 0; o < path.obj.length; o++) {
						var obj = path.obj[o];
						obj.trigger = clone(path.trigger);
					}
				}
			}
		}
		var pathObject = [];
		for (i = 0; i < selected.length; i++) {
			for (var k = 0; k < draw.path[selected[i]].obj.length; k++) {
				pathObject.push(draw.path[selected[i]].obj[k]);
			}
		}
		draw.path[selected[selected.length-1]].obj = pathObject.slice(0);
		draw.path[selected[selected.length-1]].selected = true;
		delete draw.path[selected[selected.length-1]].trigger;
		for (i = selected.length - 2; i >= 0; i--) removePathObject(selected[i]);		
		drawCanvasPaths();
		calcCursorPositions();		
	}
}

function setObjPos(obj,x,y,xAlign,yAlign) {
	if (un(obj.left) || un(obj.top) || un(obj.width) || un(obj.height)) return;
	var dl = 0, dt = 0;
	if (xAlign == 'left') {
		dl = x - obj.left;
	} else if (xAlign == 'center') {
		dl = x - 0.5*obj.width - obj.left;
	} else if (xAlign == 'right') {
		dl = x - obj.width - obj.left;		
	}
	if (yAlign == 'top') {
		dt = y - obj.top;
	} else if (yAlign == 'middle') {
		dt = y - 0.5*obj.height - obj.top;
	} else if (yAlign == 'bottom') {
		dt = y - obj.height - obj.top;
	}
	repositionObj(obj,dl,dt,0,0);
}

function ungroupPaths() {
	for (var p = draw.path.length-1; p >= 0; p--) {
		var path = draw.path[p];
		if (path.selected == true && path.obj.length > 1) {
			var newPaths = [];
			for (var o = 0; o < path.obj.length; o++) {
				var obj = path.obj[o];
				var trigger = [];
				if (!un(obj.trigger)) {
					trigger = clone(obj.trigger);
					delete obj.trigger;
				}
				newPaths.push({obj:[obj],selected:true,trigger:trigger});
			}
			//draw.updateAllBorders(newPaths);
			//console.log(newPaths);
			draw.path = draw.path.slice(0,p).concat(newPaths).concat(draw.path.slice(p+1));
		}
	}
	draw.updateAllBorders();
	drawCanvasPaths();
	calcCursorPositions();
}

function positionPath(path,left,top) {
	updateBorder(path);
	if (un(left)) {
		var dl = 0;
	} else {
		var dl = left - path.tightBorder[0];
	}
	if (un(top)) {
		var dt = 0;
	} else {
		var dt = top - path.tightBorder[1];
	}
	repositionPath(path,dl,dt);
}
function repositionPath(path,dl,dt,dw,dh) {
	if (typeof dl !== 'number') dl = 0;
	if (typeof dt !== 'number') dt = 0;
	if (typeof dw !== 'number') dw = 0;
	if (typeof dh !== 'number') dh = 0;
	if (!un(path.question) && !un(path._rect)) {
		path._rect[0] += dl;
		path._rect[1] += dt;
		path._rect[2] += dw;
		path._rect[3] += dh;
		arrangeQuestion(q);
	} else {
		for (var j = 0; j < path.obj.length; j++) {	
			var obj = path.obj[j];
			if (obj.tbLayout == true) {
				var diff = tbLayoutSnap(path,obj,dt);
				dl = diff.dl;
				dt = diff.dt;
				if (obj.tbLayoutTitle !== true) dw = diff.dw;
			}
			repositionObj(obj,dl,dt,dw,dh);
		}
	}
	updateBorder(path);
}
function textSnap(path,obj,dl,dt,dw) {
	var pathNum = draw.path.indexOf(path);

	var left = obj.left+dl;
	var top = obj.top+dt;
	var width = obj.width+dw;
	if (Math.abs(left - draw.gridMargin[0]) < draw.selectTolerance*2) left = draw.gridMargin[0];
	if (Math.abs(top - draw.gridMargin[1]) < draw.selectTolerance*2) top = draw.gridMargin[1];
	if (Math.abs(width - (draw.drawArea[2]-draw.gridMargin[0]-draw.gridMargin[2])) < draw.selectTolerance*2) width = draw.drawArea[2]-draw.gridMargin[0]-draw.gridMargin[2];
	
	for (var p = 0; p < pathNum; p++) {
		var path2 = draw.path[p];
		for (var o = 0; o < path2.obj.length; o++) {
			var obj2 = path2.obj[o];
			if (obj2.tbLayout == true) {
				var top2 = obj2.top+obj2.height+20;
				if (Math.abs(top - top2) < draw.selectTolerance*2) top = top2;
			}
		}
	}
	return {dl:left-obj.left,dt:top-obj.top,dw:width-obj.width};	
}
function tbLayoutSnap(path,obj,dt) {
	var pathNum = draw.path.indexOf(path);
	var left = draw.gridMargin[0];
	var width = obj.width;
	if (obj.tbLayoutTitle !== true) width = draw.drawArea[2]-draw.gridMargin[0]-draw.gridMargin[2];
	if (obj.tbLayoutTitle == true) left = (draw.drawArea[2] - width) / 2;
	var top = obj.top+dt;
	var top2 = tbLayoutGetPrevTop(pathNum);
	if (Math.abs(top - top2) < draw.selectTolerance*2) top = top2;

	return {dl:left-obj.left,dt:top-obj.top,dw:width-obj.width};
}
function tbLayoutGetPrevTop(pathNum) {
	if (un(pathNum)) pathNum = draw.path.length;
	for (var p = pathNum-1; p >=0; p--) {
		for (var o = draw.path[p].obj.length-1; o >= 0; o--) {
			var obj = draw.path[p].obj[o];
			if (obj.tbLayout == true) {
				return draw.path[p].tightBorder[5];
			}
		}
	}
	return draw.gridMargin[1];
}
function repositionObj(obj,dl,dt,dw,dh) {
	if (typeof dl !== 'number') dl = 0;
	if (typeof dt !== 'number') dt = 0;
	if (typeof dw !== 'number') dw = 0;
	if (typeof dh !== 'number') dh = 0;
	if (!un(draw[obj.type]) && !un(draw[obj.type].changePosition)) {
		draw[obj.type].changePosition(obj,dl,dt,dw,dh);
		return;
	}
	switch (obj.type) {
		case 'pen' :
			for (var k = 0; k < obj.pos.length; k++) {
				obj.pos[k][0] += dl;
				obj.pos[k][1] += dt;
			}
			break;	
		case 'anglesAroundPoint' :
			for (var k = 0; k < obj.points.length; k++) {
				obj.points[k][0] += dl;
				obj.points[k][1] += dt;
			}
			obj.center[0] += dl;
			obj.center[1] += dt;
			if (dw !== 0 || dh !== 0) {
				var x = mouse.x - draw.drawRelPos[0];
				var y = mouse.y - draw.drawRelPos[1];
				obj.radius = Math.abs(Math.max(x-obj.center[0],y-obj.center[1]));
				anglesAroundPointFixToRadius(obj);
			}
			break;				
		case 'line' :
			obj.startPos[0] += dl;
			obj.startPos[1] += dt;
			obj.finPos[0] += dl;
			obj.finPos[1] += dt;
			break;
		case 'rect' :
			obj.startPos[0] += dl;
			obj.startPos[1] += dt;
			obj.finPos[0] += dl+dw;
			obj.finPos[1] += dt+dh;
			break;
		case 'square' :
			obj.startPos[0] += dl;
			obj.startPos[1] += dt;
			obj.finPos[0] += dl;
			obj.finPos[1] += dt;				
			if (dw !== 0 || dh !== 0) {
				var newSize = Math.min(mouse.x-obj.startPos[0],mouse.y-obj.startPos[1]);
				obj.finPos[0] = obj.startPos[0] + newSize;
				obj.finPos[1] = obj.startPos[1] + newSize;
			}
			break;
		case 'curve' :
			obj.startPos[0] += dl;
			obj.startPos[1] += dt;
			obj.finPos[0] += dl;
			obj.finPos[1] += dt;
			obj.controlPos[0] += dl;
			obj.controlPos[1] += dt;
			break;
		case 'curve2' :
			obj.startPos[0] += dl;
			obj.startPos[1] += dt;
			obj.finPos[0] += dl;
			obj.finPos[1] += dt;
			obj.controlPos1[0] += dl;
			obj.controlPos1[1] += dt;
			obj.controlPos2[0] += dl;
			obj.controlPos2[1] += dt;				
			break;				
		case 'text2':
			obj.rect[0] += dl;
			obj.rect[1] += dt;
			obj.rect[2] += dw;
			obj.rect[3] += dh;
			break;
		case 'image' :
			obj.left += dl;
			obj.top += dt;
			if (dw !== 0 || dh !== 0) {
				var sf = Math.min((mouse.x-obj.left)/obj.naturalWidth,(mouse.y-obj.top)/obj.naturalHeight);
				obj.width = obj.naturalWidth * sf;
				obj.height = obj.naturalHeight * sf;
				obj.scaleFactor = sf;
			}
			break;
		case 'table2' :
			obj.left += dl;
			obj.top += dt;
			if (!un(obj.xPos)) for (var x = 0; x < obj.xPos.length; x++) obj.xPos[x] += dl;
			if (!un(obj.yPos)) for (var y = 0; y < obj.yPos.length; y++) obj.yPos[y] += dt;
			if (dw !== 0) {
				var width = arraySum(obj.widths);
				var sf = (width+dw)/width;
				for (var w = 0; w < obj.widths.length; w++) obj.widths[w] *= sf;
			}
			if (dh !== 0) {
				var height = arraySum(obj.heights)+dh;
				var sf = (height+dh)/height;
				for (var h = 0; h < obj.heights.length; h++) obj.heights[h] *= sf; 
			}
			break;				
		case 'angle' :
			obj.a[0] += dl;
			obj.a[1] += dt;
			obj.b[0] += dl;
			obj.b[1] += dt;
			obj.c[0] += dl;
			obj.c[1] += dt;
			if (!un(obj.d)) {
				obj.d[0] += dl;
				obj.d[1] += dt;
			}
			if (dw !== 0 || dh !== 0) {
				obj.radius = Math.min(
					Math.abs(mouse.x-draw.drawRelPos[0]-obj.b[0]),Math.abs(mouse.y-draw.drawRelPos[1]-obj.b[1])
				);
				obj.a = [obj.b[0]+obj.radius*Math.cos(obj.angleA),obj.b[1]+obj.radius*Math.sin(obj.angleA)];
				obj.c = [obj.b[0]+obj.radius*Math.cos(obj.angleC),obj.b[1]+obj.radius*Math.sin(obj.angleC)];
			}				
			break;
		case 'circle' :
		case 'point' :
			obj.center[0] += dl;
			obj.center[1] += dt;
			if (dw !== 0 || dh !== 0) {
				var x = mouse.x - draw.drawRelPos[0];
				var y = mouse.y - draw.drawRelPos[1];
				obj.radius = Math.abs(Math.min(x-obj.center[0],y-obj.center[1]));
			}				
			break;
		case 'ellipse' :
			obj.center[0] += dl;
			obj.center[1] += dt;
			obj.radiusX += dw;
			obj.radiusY += dh;	
			break;
		case 'grid' :
			obj.left += dl;
			obj.top += dt;
			obj.width += dw;
			obj.height += dh;				
			obj.xZero += dl;
			obj.yZero += dt;
			break;
		case 'simpleGrid' :
			obj.left += dl;
			obj.top += dt;
			if (dh !== 0 || dw !== 0) {
				if (Math.abs(dh) < Math.abs(dw)) {
					obj.width += dw;
					obj.height = obj.width * (obj.vSquares / obj.hSquares);
				} else {
					obj.height += dw;
					obj.width = obj.height * (obj.hSquares / obj.vSquares);
				}
			}
			obj.xZero += dl;
			obj.yZero += dt;
			break;
	}
	
}
function repositionAllPaths(paths) {
	if (typeof paths == 'undefined') var paths = draw.path;
	for (var p = 0; p < paths.length; p++) {
		repositionPath(paths[p],0,0,0,0);
	}
}
function movePaths(dl,dt) {
	for (var p = 0; p < draw.path.length; p++) {
		if (draw.path[p].selected) {
			repositionPath(draw.path[p],dl,dt,0,0);
			updateBorder(draw.path[p]);
		}
	}
	drawSelectedPaths();
	drawSelectCanvas();
}
function alignPaths(type) {
	var sel = [];
	var pos = [];
	for (var p = 0; p < draw.path.length; p++) {
		if (draw.path[p].selected == true) {
			sel.push(p);
			pos.push(draw.path[p].tightBorder);
		}
	}
	switch (type) {
		case 'left':
			var x;
			for (var p = 0; p < pos.length; p++) {
				if (p == 0) {
					x = pos[p][0];
				} else {
					x = Math.min(x,pos[p][0]);
				}
			}
			for (var p = 0; p < pos.length; p++) {
				repositionPath(draw.path[sel[p]],x-pos[p][0],0,0,0);
			}
			break;
		case 'center':
			if (pos.length == 1) {
				var x = (draw.drawArea[2]-pos[0][2])/2;
				repositionPath(draw.path[sel[0]],x-pos[0][0],0,0,0);
				break;
			}
			var xMin;
			var xMax;
			for (var p = 0; p < pos.length; p++) {
				if (p == 0) {
					xMin = pos[p][0];
					xMax = pos[p][4];
				} else {
					xMin = Math.min(xMin,pos[p][0]);
					xMax = Math.max(xMax,pos[p][4]);
				}
			}
			var x = (xMin+xMax)/2;
			for (var p = 0; p < pos.length; p++) {
				repositionPath(draw.path[sel[p]],(x-pos[p][0])-pos[p][2]/2,0,0,0);
			}
			break;			
		case 'right':
			var x;
			for (var p = 0; p < pos.length; p++) {
				if (p == 0) {
					x = pos[p][4];
				} else {
					x = Math.max(x,pos[p][4]);
				}
			}
			for (var p = 0; p < pos.length; p++) {
				repositionPath(draw.path[sel[p]],(x-pos[p][0])-pos[p][2],0,0,0);
			}
			break;
		case 'top':
			var y;
			for (var p = 0; p < pos.length; p++) {
				if (p == 0) {
					y = pos[p][1];
				} else {
					y = Math.min(y,pos[p][1]);
				}
			}
			for (var p = 0; p < pos.length; p++) {
				repositionPath(draw.path[sel[p]],0,y-pos[p][1],0,0);
			}
			break;
		case 'middle':
			if (pos.length == 1) {
				var y = (draw.drawArea[3]-pos[0][3])/2;
				repositionPath(draw.path[sel[0]],0,y-pos[0][1],0,0);
				break;
			}		
			var yMin;
			var yMax;
			for (var p = 0; p < pos.length; p++) {
				if (p == 0) {
					yMin = pos[p][1];
					yMax = pos[p][5];
				} else {
					yMin = Math.min(yMin,pos[p][1]);
					yMax = Math.max(yMax,pos[p][5]);
				}
			}
			var y = (yMin+yMax)/2;
			for (var p = 0; p < pos.length; p++) {
				repositionPath(draw.path[sel[p]],0,(y-pos[p][1])-pos[p][3]/2,0,0);
			}
			break;			
		case 'bottom':
			var y;
			for (var p = 0; p < pos.length; p++) {
				if (p == 0) {
					y = pos[p][5];
				} else {
					y = Math.max(y,pos[p][5]);
				}
			}
			for (var p = 0; p < pos.length; p++) {
				repositionPath(draw.path[sel[p]],0,(y-pos[p][1])-pos[p][3],0,0);
			}
			break;
	}
	drawCanvasPaths();
}
function snapToMargin(type) {
	if (typeof type == 'undefined') type = 'left';
	for (var p = 0; p < draw.path.length; p++) {
		if (draw.path[p].selected == true) {
			var dx = 0;
			var dy = 0;
			var pos = draw.path[p].tightBorder;
			switch (type) {
				case 'left':
					dx = draw.gridMargin[0] - pos[0];
					break;
				case 'top':
					dy = draw.gridMargin[1] - pos[1];
					break;
				case 'right':
					dx = (draw.drawArea[2] - draw.gridMargin[2]) - pos[4];
					break;					
				case 'bottom':
					dy = (draw.drawArea[3] - draw.gridMargin[3]) - pos[5];
					break;
			}
			repositionPath(draw.path[p],dx,dy,0,0);
		}
	}
	drawCanvasPaths();
}
function snapToObj2(pos,pathNum) {
	var closest = [];
	var close = -1;
	for (var p = 0; p < draw.path.length; p++) {
		if (p == pathNum) continue;
		for (var o = 0; o < draw.path[p].obj.length; o++) {
			var obj = draw.path[p].obj[o];
			if (!un(draw.snapToObjs) && draw.snapToObjs.includes(obj.type) == false) continue;
			if (!un(draw[obj.type]) && !un(draw[obj.type].getSnapPos)) {
				var snapPos = draw[obj.type].getSnapPos(obj);
				for (var s = 0; s < snapPos.length; s++) {
					if (snapPos[s].type == 'point') {
						checkPos(snapPos[s].pos);
					} else if (snapPos[s].type == 'line') {
						checkLine(snapPos[s].pos1,snapPos[s].pos2);
					} else if (snapPos[s].type == 'circle') {
						checkCircle(snapPos[s].center,snapPos[s].radius);
					} else if (snapPos[s].type == 'arc') {
						checkArc(snapPos[s].center,snapPos[s].radius,snapPos[s].angle1,snapPos[s].angle2);
					}
				}
				continue;
			}
			switch (obj.type) {
				case 'line':
				case 'curve':
				case 'curve2':
					checkPos(obj.startPos);
					checkPos(obj.finPos);
					break;
				case 'circle':
				case 'point':
					checkPos(obj.center);
					break;	
				case 'arc':
					var arcEnds = getEndPointsOfArc(obj);
					for (var k = 0; k < arcEnds.length; k++) {
						checkPos(arcEnds[k]);
					}
					checkPos(obj.center);
					break;				
				case 'pen':
					checkPos(obj.pos[0]);
					checkPos(obj.pos[obj.pos.length-1]);
					break;
				/*case 'arc':
					break;*/
				case 'rect':
					checkPos([obj.left,obj.top]);
					checkPos([obj.left+obj.width,obj.top]);
					checkPos([obj.left,obj.top+obj.height]);
					checkPos([obj.left+obj.width,obj.top+obj.height]);
					break;
				case 'polygon':
					for (var v = 0; v < obj.points.length; v++) {
						checkPos(obj.points[v]);
					}
					if (obj.solidType == 'prism' && !un(obj._prismPoints)) {
						for (var v = 0; v < obj.points.length; v++) {
							checkPos(obj._prismPoints[v]);
						}
					}
					if (obj.anglesMode == 'exterior' && !un(obj.exteriorAngles)) {
						for (var v = 0; v < obj.exteriorAngles.length; v++) {
							if (un(obj.exteriorAngles[v])) continue;
							if (obj.exteriorAngles[v].line1.show == true) {
								checkPos(obj.exteriorAngles[v].line1.pos);
							}
							if (obj.exteriorAngles[v].line2.show == true) {
								checkPos(obj.exteriorAngles[v].line2.pos);
							}
						}
					}
					break;
				case 'angle':
					checkPos(obj.b);
					if (obj.isArc == true || obj.isSector == true || obj.drawLines == true) {
						checkPos(obj.a);
						checkPos(obj.c);
					}
					break;
				case 'anglesAroundPoint':
					for (var v = 0; v < obj.points.length; v++) {
						checkPos(obj.points[v]);
					}
					checkPos(obj.center);
					break;
				case 'simpleGrid':
					var size = obj.width / obj.hSquares;
					for (var x = 0; x <= obj.hSquares; x++) {
						var xx = obj.left + x * size;
						for (var y = 0; y <= obj.vSquares; y++) {
							var yy = obj.top + obj.height - y * size;
							checkPos([xx,yy]);
						}
					}
					break;
				case 'table2':
					var x = obj.left;
					var y = obj.top;
					checkPos([x,y]);
					for (var w = 0; w < obj.widths.length; w++) {
						x += obj.widths[w];
						checkPos([x,y]);
					}
					for (var h = 0; h < obj.heights.length; h++) {
						x = obj.left;
						y += obj.heights[h];
						checkPos([x,y]);
						for (var w = 0; w < obj.widths.length; w++) {
							x += obj.widths[w];
							checkPos([x,y]);
						}
					}
					break;					
			}
		}
	}
	if (!un(draw.snapPoints) && (!un(draw.snapToObjs) || snapToObj2On === true)) { 
		for (var s = 0; s < draw.snapPoints.length; s++) {
			checkPos(draw.snapPoints[s]);
		}
	}
	function checkPos(pos2) {
		var d = dist(pos[0],pos[1],pos2[0],pos2[1]);
		if (d < draw.snapTolerance) {
			if (close == -1 || d < close) {
				close = d;
				closest = pos2;
			}
		}
	}
	if (close !== -1) return clone(closest);
	for (var p = 0; p < draw.path.length; p++) { // if no point found, search for line to snap to
		if (p == pathNum) continue;
		for (var o = 0; o < draw.path[p].obj.length; o++) {
			var obj = draw.path[p].obj[o];
			switch (obj.type) {
				case 'line':
					checkLine(obj.startPos,obj.finPos);	
					break;
				case 'rect':
					var lt = [obj.left,obj.top];
					var rt = [obj.left+obj.width,obj.top];
					var lb = [obj.left,obj.top+obj.height];
					var rb = [obj.left+obj.width,obj.top+obj.height];
					checkLine(lt,rt);
					checkLine(rt,rb);
					checkLine(rb,lb);
					checkLine(lb,lt);
					break;
				case 'polygon':
					for (var v = 0; v < obj.points.length-1; v++) {
						checkLine(obj.points[v],obj.points[v+1]);
					}
					if (boolean(obj.closed,true)) {
						checkLine(obj.points[obj.points.length-1],obj.points[0]);
					}
					if (obj.solidType == 'prism' && !un(obj._prismPoints)) {
						for (var v = 0; v < obj.points.length; v++) {
							checkLine(obj.points[v],obj._prismPoints[v]);
							var next = v+1;
							if (v == obj.points.length-1) next = 0;
							checkLine(obj._prismPoints[v],obj._prismPoints[next]);
						}
					}
					if (obj.anglesMode == 'exterior' && !un(obj.exteriorAngles)) {
						for (var v = 0; v < obj.exteriorAngles.length; v++) {
							if (un(obj.exteriorAngles[v])) continue;
							if (obj.exteriorAngles[v].line1.show == true) {
								checkLine(obj.points[v],obj.exteriorAngles[v].line1.pos);
							}
							if (obj.exteriorAngles[v].line2.show == true) {
								checkLine(obj.points[v],obj.exteriorAngles[v].line2.pos);
							}
						}
					}					
					break;
				case 'angle':
					if (obj.drawLines == true || obj.isSector == true) {
						checkLine(obj.a,obj.b);
						checkLine(obj.b,obj.c);
					}
					if (obj.isSector == true || obj.isArc == true) {
						checkArc(obj.b,obj.radius,obj.angleA,obj.angleC);
					}
					break;
				case 'anglesAroundPoint':
					for (var v = 0; v < obj.points.length; v++) {
						checkLine(obj.points[v],obj.center);
					}
					break;
				case 'circle':
					checkCircle(obj.center,obj.radius);
					break;
				case 'arc':
					//console.log(obj);
					if (obj.clockwise == true) {
						checkArc(obj.center,obj.radius,obj.startAngle,obj.finAngle);
					} else {
						checkArc(obj.center,obj.radius,obj.finAngle,obj.startAngle);						
					}
					break;					
			}
		}
	}
	function checkLine(p1,p2) {
		var p3 = closestPointOnLineSegment(pos,p1,p2);
		var d = getDist(p3,pos);
		if (d < draw.snapTolerance) {
			if (close == -1 || d < close) {
				close = d;
				closest = p3;
			}
		}
	}
	function checkCircle(center,radius) {
		var d = getDist(center,pos);
		if (Math.abs(d-radius) > draw.snapTolerance) return;
		if (close == -1 || d < close) {
			close = d;
			var a = getAngleTwoPoints(center,pos);
			closest = [center[0]+radius*Math.cos(a),center[1]+radius*Math.sin(a)];
		}
	}
	function checkArc(center,radius,a1,a2) {
		var d = getDist(center,pos);
		if (Math.abs(d-radius) > draw.snapTolerance) return;
		var a = getAngleTwoPoints(center,pos);
		if (anglesInOrder(a1,a,a2)) {
			if (close == -1 || d < close) {
				close = d;
				closest = [center[0]+radius*Math.cos(a),center[1]+radius*Math.sin(a)];
			}
		}
	}	
	if (close !== -1) return clone(closest);
	return pos;
}
function snapBorders(pathNum,x,y) {
	var tol = draw.snapTolerance * 3;
	var b1 = draw.path[pathNum].tightBorder;
	var closeX = tol+1;
	var closeY = tol+1;
	if (Math.abs(x-draw.gridMargin[0]) < closeX) {
		closeX = -(x-draw.gridMargin[0]);
	} else if (Math.abs(x+b1[2]-(draw.drawArea[0]+draw.drawArea[2]-draw.gridMargin[2])) < closeX) {
		closeX = -(x+b1[2]-(draw.drawArea[0]+draw.drawArea[2]-draw.gridMargin[2]));
	}
	for (var m = 0; m < draw.gridVertMargins.length; m++) {
		if (Math.abs(x-draw.gridVertMargins[m]) < closeX) {
			closeX = -(x-draw.gridVertMargins[m]);
		}
	}
	if (Math.abs(y-draw.gridMargin[1]) < closeY) {
		closeY = -(y-draw.gridMargin[1]);
	} else if (Math.abs(y+b1[3]-(draw.drawArea[1]+draw.drawArea[3]-draw.gridMargin[3])) < closeY) {
		closeY = -(y+b1[3]-(draw.drawArea[1]+draw.drawArea[3]-draw.gridMargin[3]));
	}
	for (var p = 0; p < draw.path.length; p++) {
		if (p == pathNum) continue;
		var b2 = draw.path[p].tightBorder;
		if (Math.abs(x-b2[4]) < closeX) {
			closeX = -(x-b2[4]);
		} else if (Math.abs(x+b1[2]-b2[0]) < closeX) {
			closeX = -(x+b1[2]-b2[0]);		
		} else if (Math.abs(x-b2[0]) < closeX) {
			closeX = -(x-b2[0]);
		} else if (Math.abs(x+b1[2]-b2[4]) < closeX) {
			closeX = -(x+b1[2]-b2[4]);
		}
		if (Math.abs(y-b2[5]) < closeY) {
			closeY = -(y-b2[5]);
		} else if (Math.abs(y+b1[3]-b2[1]) < closeY) {
			closeY = -(y+b1[3]-b2[1]);
		} else if (Math.abs(y-b2[1]) < closeY) {
			closeY = -(y-b2[1]);
		} else if (Math.abs(y+b1[3]-b2[5]) < closeY) {
			closeY = -(y+b1[3]-b2[5]);
		}
	}
	var dx = Math.abs(closeX) < tol ? closeX : 0;
	var dy = Math.abs(closeY) < tol ? closeY : 0;
	return [dx,dy];
}
function gridSnapObjects() {
	if (draw.gridSnap == true/* || shiftOn == true*/) {
		var horiz = draw.horizSnap;
		var vert = draw.vertSnap;
		for (var i = 0; i < draw.path.length; i++) {
			if (draw.path[i].selected == true) {
				var xMin = 1200;
				var xMax = 0;
				var yMin = 700;
				var yMax = 0;
				for (var j = 0; j < draw.path[i].obj.length; j++) {
					xMin = Math.min(xMin,draw.path[i].obj[j].left);
					xMax = Math.max(xMax,draw.path[i].obj[j].left+draw.path[i].obj[j].width);
					yMin = Math.min(yMin,draw.path[i].obj[j].top);
					yMax = Math.max(yMax,draw.path[i].obj[j].top+draw.path[i].obj[j].height);
				}
				var dx,dy;
				if (draw.horizSnap == 'center') {
					dx = roundToNearest(((xMin + xMax) / 2),draw.gridSnapSize) - ((xMin + xMax) / 2);
				} else if (draw.horizSnap == 'right') {
					dx = roundToNearest(xMax,draw.gridSnapSize) - xMax;
				} else {
					dx = roundToNearest(xMin,draw.gridSnapSize) - xMin;										
				}
				if (draw.vertSnap == 'middle') {
					dy = roundToNearest(((yMin + yMax) / 2),draw.gridSnapSize) - ((yMin + yMax) / 2);
				} else if (draw.horizSnap == 'bottom') {
					dy = roundToNearest(yMax,draw.gridSnapSize) - yMax;
				} else {
					dy = roundToNearest(yMin,draw.gridSnapSize) - yMin;										
				}
				repositionPath(draw.path[i],dx,dy,0,0);
			}
		}
	}	
}
function updateSnapPoints() { // handles intersection points line snapping - for constructions tool
	/*if (draw.snap == true) {
		var intPoints = getIntersectionPoints(draw.path);
		var endPoints = getEndPoints(draw.path);
		draw.snapPoints = intPoints.concat(endPoints);
	}*/	
	draw.snapPoints = getIntersectionPoints(draw.path);
	//showSnapPositions();
}
function showSnapPositions() {
	var ctx = draw.drawCanvas.last().ctx;
	var points = draw.snapPoints;
	ctx.fillStyle = '#F00';
	for (var i = 0; i < points.length; i++) {
		ctx.beginPath();
		ctx.arc(points[i][0],points[i][1],draw.snapTolerance,0,2*Math.PI);
		ctx.fill();
	}
}

function distributeHoriz() {
	var tableSelected = false;
	var s = selPaths();
	//console.log(s,s.length == 1,s[0].obj.length == 1,(s[0].obj[0].type == 'table' || s[0].obj[0].type == 'table2'));
	if (s.length == 1 && s[0].obj.length == 1 && (s[0].obj[0].type == 'table' || s[0].obj[0].type == 'table2')) {
		tableSelected == true;
	}
	//if (tableCellsSelectionTest() == true) {
	if (tableCellsSelectionTest() == true || tableSelected == true) {
		for (var i = 0; i < draw.path.length; i++) {
			if (draw.path[i].selected == true) {
				for (var j = 0; j < draw.path[i].obj.length; j++) {
					if (draw.path[i].obj[j].type == 'table' || draw.path[i].obj[j].type == 'table2') {
						var obj = draw.path[i].obj[j];
						var cells = obj.cells;
						var cols = [];
						var totalWidth = 0;
						for (var r = 0; r < cells.length; r++) {
							for (var c = 0; c < cells[r].length; c++) {
								if (cols.indexOf(c) == -1 && cells[r][c].selected == true) {
									cols.push(c);
									if (obj.type == 'table') {
										totalWidth += cells[r][c].minWidth;
									} else if (obj.type == 'table2') {
										totalWidth += obj.widths[c];
									}
								}
							}
						}
						if (cols.length == 0) {
							for (var c = 0; c < cells[0].length; c++) cols.push(c);
						}
						//console.log(cols);
						for (var r = 0; r < cells.length; r++) {
							for (var c = 0; c < cells[r].length; c++) {
								if (cols.indexOf(c) > -1) {
									if (obj.type == 'table') {
										cells[r][c].minWidth = totalWidth / cols.length;
									} else if (r == 0 && obj.type == 'table2') {
										obj.widths[c] = totalWidth / cols.length;
									}												
								}
							}
						}
						if (obj.type == 'table') {
							var table = calcTable2(draw.path[i].obj[j]);
							draw.path[i].obj[j].cell = table.cell;
							draw.path[i].obj[j].xPos = table.xPos;
							draw.path[i].obj[j].yPos = table.yPos;
							draw.path[i].obj[j].width = table.xPos[table.xPos.length-1] - draw.path[i].obj[j].left;
							draw.path[i].obj[j].height = table.yPos[table.yPos.length-1] - draw.path[i].obj[j].top;
						}
					}
				}
				repositionPath(draw.path[i]);
				drawSelectedPaths();
				repositionPath(draw.path[i]);
			}
		}

	} else {
		var sel = [];
		var pos = [];				
		var sel2 = [];
		var pos2 = [];
		for (var p = 0; p < draw.path.length; p++) {
			if (draw.path[p].selected == true) {
				sel2.push(p);
				pos2.push(draw.path[p].tightBorder);
			}
		}
		if (sel2.length < 2) return;
		while (sel2.length > 0) { // reorder sel2 & pos2 by tightBorder[0] (left)
			var index = 0;
			var minLeft;
			for (var p = 0; p < pos2.length; p++) {
				if (p == 0) {
					minLeft = pos2[p][0];
				} else if (pos2[p][0] < minLeft) {
					minLeft = pos2[p][0];
					index = p;
				}
			}
			sel.push(sel2[index]);
			pos.push(clone(pos2[index]));
			sel2.splice(index,1);
			pos2.splice(index,1);
		}
		var xMin;
		var xMax;
		var totalWidth = 0;
		for (var p = 0; p < pos.length; p++) {
			totalWidth += pos[p][2];
			if (p == 0) {
				xMin = pos[p][0];
				xMax = pos[p][4];
			} else {
				xMin = Math.min(xMin,pos[p][0]);
				xMax = Math.max(xMax,pos[p][4]);
			}
		}
		var gap = ((xMax-xMin) - totalWidth) / (sel.length-1);
		var x = xMin;
		for (var p = 0; p < pos.length; p++) {
			repositionPath(draw.path[sel[p]],(x-pos[p][0]),0,0,0);
			x += pos[p][2] + gap;
		}
		drawCanvasPaths();
	}
}
function distributeVert() {
	var tableSelected = false;
	var s = selPaths();
	if (s.length == 1 && s[0].obj.length == 1 && (s[0].obj[0].type == 'table' || s[0].obj[0].type == 'table2')) {
		tableSelected == true;
	}
	//if (tableCellsSelectionTest() == true) {
	if (tableCellsSelectionTest() == true || tableSelected == true) {
		for (var i = 0; i < draw.path.length; i++) {
			if (draw.path[i].selected == true) {
				for (var j = 0; j < draw.path[i].obj.length; j++) {
					if (draw.path[i].obj[j].type == 'table' || draw.path[i].obj[j].type == 'table2') {
						var obj = draw.path[i].obj[j];
						var type = obj.type;
						var rows = [];
						var totalHeight = 0;								
						var cells = obj.cells;
						for (var r = 0; r < cells.length; r++) {
							for (var c = 0; c < cells[r].length; c++) {
								if (rows.indexOf(r) == -1 && cells[r][c].selected == true) {
									rows.push(r);
									if (obj.type == 'table') {
										totalHeight += cells[r][c].minHeight;
									} else if (obj.type == 'table2') {
										totalHeight += obj.heights[r];
									}											
								}
							}
						}
						if (rows.length == 0) {
							for (var r = 0; r < cells.length; r++) rows.push(r);
						}
						for (var r = 0; r < cells.length; r++) {
							if (rows.indexOf(r) > -1) {
								if (obj.type == 'table') {
									for (var c = 0; c < cells[r].length; c++) {
										cells[r][c].minHeight = totalHeight / rows.length;
									}
								} else if (obj.type == 'table2') {
									obj.heights[r] = totalHeight / rows.length;
								}
							}
						}
						if (obj.type == 'table') {
							var table = calcTable2(draw.path[i].obj[j]);
							draw.path[i].obj[j].cell = table.cell;
							draw.path[i].obj[j].xPos = table.xPos;
							draw.path[i].obj[j].yPos = table.yPos;
							draw.path[i].obj[j].width = table.xPos[table.xPos.length-1] - draw.path[i].obj[j].left;
							draw.path[i].obj[j].height = table.yPos[table.yPos.length-1] - draw.path[i].obj[j].top;
						}
					}
				}
				repositionPath(draw.path[i]);
				drawSelectedPaths();
				repositionPath(draw.path[i]);				
			}
		}
	
	} else {
		var sel = [];
		var pos = [];				
		var sel2 = [];
		var pos2 = [];
		for (var p = 0; p < draw.path.length; p++) {
			if (draw.path[p].selected == true) {
				sel2.push(p);
				pos2.push(draw.path[p].tightBorder);
			}
		}
		if (sel2.length < 2) return;
		while (sel2.length > 0) { // reorder sel2 & pos2 by tightBorder[1] (top)
			var index = 0;
			var minTop;
			for (var p = 0; p < pos2.length; p++) {
				if (p == 0) {
					minTop = pos2[p][1];
				} else if (pos2[p][1] < minTop) {
					minTop = pos2[p][1];
					index = p;
				}
			}
			sel.push(sel2[index]);
			pos.push(clone(pos2[index]));
			sel2.splice(index,1);
			pos2.splice(index,1);
		}
		var yMin;
		var yMax;
		var totalHeight = 0;
		for (var p = 0; p < pos.length; p++) {
			totalHeight += pos[p][3];
			if (p == 0) {
				yMin = pos[p][1];
				yMax = pos[p][5];
			} else {
				yMin = Math.min(yMin,pos[p][1]);
				yMax = Math.max(yMax,pos[p][5]);
			}
		}
		var gap = ((yMax-yMin) - totalHeight) / (sel.length-1);
		var y = yMin;
		for (var p = 0; p < pos.length; p++) {
			repositionPath(draw.path[sel[p]],0,(y-pos[p][1]),0,0);
			y += pos[p][3] + gap;
		}
		drawCanvasPaths();
	}	
}
function centerDistributeText() {
	for (var p = 0; p < draw.path.length; p++) {
		var path = draw.path[p];
		if (path.obj.length > 1 || path.obj[0].type !== 'text2') {
			path.selected = false;
			continue;
		}
		var obj = path.obj[0];
		obj.text = removeTagsOfType(obj.text,'align');
		obj.align = [0,0];
		path.selected = true;
		var x = (draw.drawArea[2]-path.tightBorder[2])/2;
		repositionPath(path,x-path.tightBorder[0],0,0,0);
	}
	distributeVert();
	deselectAllPaths();
}

function matchWidth() {
	var paths = selPaths();
	if (paths.length !== 2 || paths[0].obj.length !== 1 || paths[1].obj.length !== 1) {
		console.log('error - check selected paths');
		return;
	}
	paths.sort(function(a,b) {
		if (Math.abs(a.obj[0].left-b.obj[0].left) > Math.abs(a.obj[0].top-b.obj[0].top)) {
			return a.obj[0].left-b.obj[0].left;
		} else {
			return a.obj[0].top-b.obj[0].top;
		}
	});
	if (paths[0].obj[0].type == 'table2' && paths[1].obj[0].type == 'table2') {
		var t1 = paths[0].obj[0];
		var t2 = paths[1].obj[0];
		if (t1.widths.length == t2.widths.length) {
			t2.widths = clone(t1.widths);
		} else {
			var width1 = arraySum(t1.widths);
			var width2 = arraySum(t2.widths);
			for (var w = 0; w < t2.widths.length; w++) {
				t2.widths[w] = t2.widths[w] * width1 / width2;
			}
		}
		updateBorder(paths[1]);
		drawCanvasPaths();
		return;
	}
	var width = getObjWidth(paths[0].obj[0]);
	if (width > 0) {
		setObjWidth(paths[1].obj[0],width);
		updateBorder(paths[1]);
		drawCanvasPaths();
		return;
	}
	console.log('error - check selected paths');
}
function matchHeight() {
	var paths = selPaths();
	if (paths.length !== 2 || paths[0].obj.length !== 1 || paths[1].obj.length !== 1) {
		console.log('error - check selected paths');
		return;
	}
	paths.sort(function(a,b) {
		if (Math.abs(a.obj[0].left-b.obj[0].left) > Math.abs(a.obj[0].top-b.obj[0].top)) {
			return a.obj[0].left-b.obj[0].left;
		} else {
			return a.obj[0].top-b.obj[0].top;
		}
	});	
	if (paths[0].obj[0].type == 'table2' && paths[1].obj[0].type == 'table2') {
		var t1 = paths[0].obj[0];
		var t2 = paths[1].obj[0];
		if (t1.heights.length == t2.heights.length) {
			t2.heights = clone(t1.heights);
		} else {
			var height1 = arraySum(t1.heights);
			var height2 = arraySum(t2.heights);
			for (var h = 0; h < t2.heights.length; h++) {
				t2.heights[h] = t2.heights[h] * height1 / height2
			}
		}
		updateBorder(paths[1]);
		drawCanvasPaths();
		return;
	}
	var height = getObjHeight(paths[0].obj[0]);
	if (height > 0) {
		setObjHeight(paths[1].obj[0],height);
		updateBorder(paths[1]);
		drawCanvasPaths();
		return;
	}	
	console.log('error - check selected paths');
}

function hitTestPathRect(path,l,t,w,h) { // checks if center of path is in rect
	if (typeof path.tightBorder == 'undefined') updateBorder(path);
	var a = path.tightBorder;
	var x = a[0]+a[2]/2;
	var y = a[1]+a[3]/2;
	//console.log(path,l,t,w,h,a,a[0] < l || a[1] < t || a[0]+a[2] > l+w || a[1]+a[3] > t+h);
	if (x < l || y < t || x > l+w || y > t+h) return false;
	return true;
}

function getObjWidth(obj) {
	if (!un(draw[obj.type]) && typeof draw[obj.type].getWidth == 'function') return draw[obj.type].getWidth();
	switch (obj.type) {
		case 'table2':
			return arraySum(obj.widths);
		case 'text2':
			return obj.rect[2];
		case 'circle':
			return obj.radius*2;
		case 'ellipse':
			return obj.radiusX*2;
		default:
			if (typeof obj.width == 'number') return obj.width;
			return 0;
	}
}
function setObjWidth(obj,width) {
	if (!un(draw[obj.type]) && typeof draw[obj.type].setWidth == 'function') {
		draw[obj.type].setWidth(width);
	}
	switch (obj.type) {
		case 'table2':
			var oldWidth = arraySum(obj.widths);
			for (var w = 0; w < obj.widths.length; w++) {
				obj.widths[w] = obj.widths[w] * width / oldWidth;
			}
			break;
		case 'text2':
			obj.rect[2] = width;
			break;
		case 'circle':
			obj.radius = width/2;
			break;
		case 'ellipse':
			obj.radiusX = width/2;
			break;
		default:
			if (!un(obj.width)) obj.width = width;
			break;
	}	
}
function getObjHeight(obj) {
	if (!un(draw[obj.type]) && typeof draw[obj.type].getHeight == 'function') return draw[obj.type].getHeight();
	switch (obj.type) {
		case 'table2':
			return arraySum(obj.heights);
		case 'text2':
			return obj.rect[3];
		case 'circle':
			return obj.radius*2;
		case 'ellipse':
			return obj.radiusY*2;
		default:
			if (typeof obj.height == 'number') return obj.height;
			return 0;
	}
}
function setObjHeight(obj,height) {
	if (!un(draw[obj.type]) && typeof draw[obj.type].setHeight == 'function') {
		draw[obj.type].setHeight(height);
	}
	switch (obj.type) {
		case 'table2':
			var oldHeight = arraySum(obj.heights);
			for (var h = 0; h < obj.heights.length; h++) {
				obj.heights[h] = obj.heights[h] * height / oldHeight;
			}
			break;
		case 'text2':
			obj.rect[3] = height;
			break;
		case 'circle':
			obj.radius = height/2;
			break;
		case 'ellipse':
			obj.radiusY = height/2;
			break;
		default:
			if (!un(obj.height)) obj.height = height;
			break;
	}	
}

draw.pathsMatchSize = function(paths) {
	if (un(paths)) paths = selPaths();
	if (paths.length < 2) return;
	var firstPath = paths[0];
	for (var p = 1; p < paths.length; p++) {
		path = paths[p];
		if (path.tightBorder[0] - firstPath.tightBorder[0] < -40 || path.tightBorder[1] - firstPath.tightBorder[1] < -40 ) {
			firstPath = path;
		}
	}
	for (var p = 0; p < paths.length; p++) {
		path = paths[p];
		if (path === firstPath) continue;
		repositionPath(path,0,0,firstPath.tightBorder[2]-path.tightBorder[2],firstPath.tightBorder[3]-path.tightBorder[3]);
	}
	drawCanvasPaths();
}
draw.pathsArrangeToGrid = function(paths) {
	if (un(paths)) paths = selPaths();	
	if (paths.length < 2) return;
	var left,right,top,bottom;
	for (var p = 0; p < paths.length; p++) {
		path = paths[p];
		path.__rect = {left:path.tightBorder[0],top:path.tightBorder[1],width:path.tightBorder[2],height:path.tightBorder[3],right:path.tightBorder[0]+path.tightBorder[2],bottom:path.tightBorder[1]+path.tightBorder[3],center:path.tightBorder[0]+0.5*path.tightBorder[2],middle:path.tightBorder[1]+0.5*path.tightBorder[3]};
		left = un(left) ? path.__rect.center : Math.min(left,path.__rect.center);
		right = un(right) ? path.__rect.center : Math.max(right,path.__rect.center);
		top = un(top) ? path.__rect.middle : Math.min(top,path.__rect.middle);
		bottom = un(bottom) ? path.__rect.middle : Math.max(bottom,path.__rect.middle);
	}
	paths.sort(function(a,b) {
		if (Math.abs(a.__rect.middle-b.__rect.middle) > 40) return a.__rect.middle-b.__rect.middle;
		if (Math.abs(a.__rect.center-b.__rect.center) > 40) return a.__rect.center-b.__rect.center;
	});
	var cols = 0;
	var rows = 0;
	paths[0].__rect.col = 0;
	paths[0].__rect.row = 0;
	for (var p = 1; p < paths.length; p++) {
		path0 = paths[p-1];
		path1 = paths[p];
		if (Math.abs(path0.__rect.middle-path1.__rect.middle) <= 40) {
			path1.__rect.row = path0.__rect.row;
			path1.__rect.col = path0.__rect.col+1;
		} else {
			path1.__rect.row = path0.__rect.row+1;
			path1.__rect.col = 0;
		}
		cols = Math.max(cols,path1.__rect.col+1);
		rows = Math.max(rows,path1.__rect.row+1);
	}
	var xPos = [];
	var yPos = [];
	for (var i = 0; i < cols; i++) xPos.push(left+i*(right-left)/(Math.max(1,cols-1)));
	for (var i = 0; i < rows; i++) yPos.push(top+i*(bottom-top)/Math.max(1,(rows-1)));
	for (var p = 0; p < paths.length; p++) {
		path = paths[p];
		var x = xPos[path.__rect.col]-path.tightBorder[2]/2;
		var y = yPos[path.__rect.row]-path.tightBorder[3]/2;
		positionPath(path,x,y);
	}
	drawCanvasPaths();
}

/*draw.controlPanel2 = {
	addctx:function(rect) {
		draw.controlPanel2.ctx = newctx({rect:rect,pE:true,z:1000000000000,vis:true});
		draw.controlPanel2.ctx.canvas.style.backgroundColor = '#FFC';
		addListenerMove(draw.controlPanel2.ctx.canvas,draw.controlPanel2.move);
		addListenerStart(draw.controlPanel2.ctx.canvas,draw.controlPanel2.start);
	},
	data:{elements:[]},
	cursorPositions:[],
	defaultData:{
		elements:[{name:'Style',type:'style'}]
	},
	clear: function() {
		draw.controlPanel2.data = {elements:[]};
		draw.controlPanel2.cursorPositions = [];
		draw.controlPanel2.ctx.clear();
	},
	getSelObj: function() {
		var selCount = 0;
		var selObj = 'none';
		for (var p = 0; p < draw.path.length; p++) {
			if (draw.path[p].selected == true) {
				selCount++;
				if (draw.path[p].obj.length == 1) {
					selObj = draw.path[p].obj[0];
				} else {
					selObj = 'grouped';
				}
			}
		}
		if (selCount > 1) {
			return 'multiple';
		} else {
			return selObj;
		}	
	},
	draw: function() {
		var ctx = draw.controlPanel2.ctx;
		ctx.clear();
		var pos = [0,0,draw.controlPanel2.ctx.data[2],draw.controlPanel2.ctx.data[3]];
		
		var obj = getSelObj();
		if (typeof obj == 'string') {
			var objType = obj;
			obj = false;
		} else {
			var objType = obj.type;
		}
		var path = selPath();
		
		var selType = typeof draw.getSelType == 'function' ? draw.getSelType() : 'none';
		if (['text2','table2','table2-cell','table2-cells'].indexOf(selType) > -1) {
			if (textMenu.canvas.parentNode !== container) textMenu.show();
			textMenu.position(draw.controlPanel2.ctx.data[0]+37.5/2,draw.controlPanel2.ctx.data[1]+300);
		} else {
			if (textMenu.canvas.parentNode == container) textMenu.hide();
		}
		
		draw.controlPanel2.path = path;
		draw.controlPanel2.obj = obj;
		draw.controlPanel2.clear();
		draw.controlPanel2.data = draw.controlPanel2.defaultData;
		
		if (obj !== false && !un(draw[obj.type]) && !un(draw[obj.type].getControlPanel)) {
			draw.controlPanel2.data = draw[obj.type].getControlPanel(obj);
		}
			
		var cursorPos = [];
		var elements = draw.controlPanel2.data.elements;
		var top = pos[1]+10;
		for (var e = 0; e < elements.length; e++) {
			var element = elements[e];
			var bold = boolean(element.bold,true);
			var fontSize = element.fontSize || 20;
			var margin = element.margin*pos[2] || 0;
			text({ctx:ctx,rect:[pos[0]+10+margin,top,pos[2]-20,40],align:[-1,-1],text:['<<fontSize:'+fontSize+'>><<bold:'+bold+'>>'+element.name]});
			switch (element.type) {
				case 'style':
					var w = 0.4*pos[2]/3;
					var space = 0.6*pos[2]/4;
					var l = pos[0]+space;
					var t = top+50;
					
					var strokeStyle = (obj !== false && !un(obj.type) && !un(draw[obj.type]) && !un(draw[obj.type].getLineColor)) ? draw[obj.type].getLineColor(obj) : draw.color;
					text({ctx:ctx,align:[0,-1],rect:[l,top+25,w,w],text:['<<fontSize:18>>line']})
					ctx.beginPath();
					cursorPos.push({shape:'rect',dims:[l,t,w,w],cursor:draw.cursors.pointer,element:element,type:'openLineColor',obj:obj});
					if (strokeStyle == 'none') {
						ctx.strokeStyle = '#000';
						ctx.lineWidth = 2;
						ctx.strokeRect(l,t,w,w);
						ctx.moveTo(l,t);
						ctx.lineTo(l+w,t+w);
						ctx.moveTo(l+w,t);
						ctx.lineTo(l,t+w);
						ctx.stroke();
					} else {
						ctx.fillStyle = strokeStyle;
						ctx.fillRect(l,t,w,w);
						ctx.strokeStyle = '#000';
						ctx.lineWidth = 2;
						ctx.strokeRect(l,t,w,w);
					}
					
					l += space+w;
					var lineWidth = (obj !== false && !un(obj.type) && !un(draw[obj.type]) && !un(draw[obj.type].getLineWidth)) ? draw[obj.type].getLineWidth(obj) : draw.lineWidth;
					text({ctx:ctx,align:[0,-1],rect:[l,top+25,w,w],text:['<<fontSize:18>>width']})
					var minusRect = [l-0.3*w,t+0.1*w,0.8*w,0.8*w];
					var plusRect = [l-0.3*w+0.8*w,t+0.1*w,0.8*w,0.8*w];
					drawPlusButton(ctx,plusRect);
					drawMinusButton(ctx,minusRect);
					cursorPos.push({shape:'rect',dims:plusRect,cursor:draw.cursors.pointer,element:element,type:'lineWidthPlus',obj:obj});
					cursorPos.push({shape:'rect',dims:minusRect,cursor:draw.cursors.pointer,element:element,type:'lineWidthMinus',obj:obj});
					
					l += space+w;
					var fillStyle = (obj !== false && !un(obj.type) && !un(draw[obj.type]) && !un(draw[obj.type].getFillColor)) ? draw[obj.type].getFillColor(obj) : draw.fillColor;
					text({ctx:ctx,align:[0,-1],rect:[l,top+25,w,w],text:['<<fontSize:18>>fill']})
					cursorPos.push({shape:'rect',dims:[l,t,w,w],cursor:draw.cursors.pointer,element:element,type:'openFillColor',obj:obj});
					ctx.beginPath();
					if (fillStyle == 'none') {
						ctx.strokeStyle = '#000';
						ctx.lineWidth = 2;
						ctx.strokeRect(l,t,w,w);
						ctx.moveTo(l,t);
						ctx.lineTo(l+w,t+w);
						ctx.moveTo(l+w,t);
						ctx.lineTo(l,t+w);
						ctx.stroke();
					} else {
						ctx.fillStyle = fillStyle;
						ctx.fillRect(l,t,w,w);
						ctx.strokeStyle = '#000';
						ctx.lineWidth = 2;
						ctx.strokeRect(l,t,w,w);
					}
					
					top += 100;
					break;
				case 'toggle':
					var rect = [pos[0]+pos[2]*0.1,top+2,16,16];
					ctx.lineWidth = 2;
					ctx.strokeStyle = '#000';
					ctx.fillStyle = '#FFF';
					ctx.fillRect(rect[0],rect[1],rect[2],rect[3]);
					ctx.strokeRect(rect[0],rect[1],rect[2],rect[3]);
					if (element.get(obj)) drawTick(ctx,16,20,'#060',pos[0]+pos[2]*0.1,top,3);
					cursorPos.push({shape:'rect',dims:[pos[0]+pos[2]*0.1,top,0.8*pos[2],20],cursor:draw.cursors.pointer,element:element,set:element.set,type:'toggle',obj:obj});
					top += 30;
					break;
				case 'increment':
					var minusRect = [pos[0]+pos[2]*0.7,top+2,22,22];
					var plusRect = [pos[0]+pos[2]*0.7+22,top+2,22,22];
					drawPlusButton(ctx,plusRect);
					drawMinusButton(ctx,minusRect);
					cursorPos.push({shape:'rect',dims:plusRect,cursor:draw.cursors.pointer,element:element,type:'increment',value:1,increment:element.increment,obj:obj});
					cursorPos.push({shape:'rect',dims:minusRect,cursor:draw.cursors.pointer,element:element,type:'increment',value:-1,increment:element.increment,obj:obj});
					top += 40;
					break;
				case 'slider':
					var sliderLeft = pos[0]+0.55*pos[2];
					var sliderWidth = 0.3*pos[2];
					ctx.lineWidth = 2;
					ctx.strokeStyle = '#000';
					ctx.beginPath();
					ctx.moveTo(sliderLeft,top+15);
					ctx.lineTo(sliderLeft+sliderWidth,top+15);
					ctx.stroke();
					if (typeof element.value == 'string') {
						var value = obj[element.value];
					} else if (typeof element.value == 'function') {
						var value = element.value(obj);
					} else if (!un(element.get)) {
						var value = element.get(obj);
					}
					var xPos = sliderLeft + sliderWidth*(value-element.min)/(element.max-element.min);
					ctx.fillStyle = '#00F';
					ctx.beginPath();
					ctx.arc(xPos,top+15,8,0,2*Math.PI);
					ctx.fill();
					cursorPos.push({shape:'circle',dims:[xPos,top+15,8],cursor:draw.cursors.pointer,element:element,type:'slider',obj:obj,sliderLeft:sliderLeft,sliderWidth:sliderWidth});
					top += 30;
					break;
				case 'multiSelect':
					var cells = [], rows = 0, cols = 0, heights = [], widths = [];
					var selected = element.get(obj);
					for (var r = 0; r < element.options.length; r++) {
						cells[r] = [];
						rows++;
						heights.push(30);
						for (var c = 0; c < element.options[r].length; c++) {
							var txt = !un(element.options[r][c]) ? element.options[r][c] : '';
							cells[r][c] = {};
							if (text !== '' && selected.toLowerCase() == txt.toLowerCase()) {
								cells[r][c].color = '#3FF';
							}
							cells[r][c].text = ['<<fontSize:18>>'+txt];
							cols = Math.max(cols,c);
						}
					}
					for (var c = 0; c < cols+1; c++) widths.push(0.8*pos[2]/(cols+1));
					var table = drawTable3({ctx:ctx,left:pos[0]+pos[2]*0.1,top:top+30,widths:widths,heights:heights,cells:cells,outerBorder:{width:2,color:'#000',dash:[]},innerBorder:{width:1,color:'#000',dash:[]}});
					
					for (var r = 0; r < table.cell.length; r++) {
						for (var c = 0; c < table.cell[r].length; c++) {
							var cell = table.cell[r][c];
							cursorPos.push({shape:'rect',dims:[cell.left,cell.top,cell.width,cell.height],cursor:draw.cursors.pointer,element:element,set:element.set,type:'multiSelect',value:element.options[r][c],obj:obj});
						}
					}
					
					top += (rows+1)*30+10;
					break;
				case 'tableBorder':
					top += 30;
					
					break;
				case 'lineDec':	
					top += 30;
					ctx.translate(10,0);
						var selected = 0;
						if (obj.endStart == 'open' && obj.endStartSize == 10) selected = 1;
						if (obj.endStart == 'closed' && obj.endStartSize == 10) selected = 2;
						if (obj.endStart == 'open' && obj.endStartSize == 15) selected = 3;
						if (obj.endStart == 'closed' && obj.endStartSize == 15) selected = 4;
						
						for (var i = 0; i < 5; i++) {
							ctx.fillStyle = i == selected ? '#66F' : '#CCF';
							ctx.fillRect(0,i*40+top,60,40);
							var kind = ['none','open','closed','open','closed'][i];
							var size = [0,10,10,15,15][i];
							cursorPos.push({shape:'rect',dims:[10,i*40+top,60,40],cursor:draw.cursors.pointer,type:'lineDecEndStart',kind:kind,size:size,obj:obj});
						}
						
						ctx.lineWidth = 3;
						ctx.strokeStyle = '#000';
						ctx.beginPath();
						for (var i = 0; i < 5; i++) {
							ctx.moveTo(20,i*40+20+top);
							ctx.lineTo(60,i*40+20+top);
						}
						ctx.stroke();
					
						drawArrow({context:ctx,startX:60,startY:top+60,finX:20,finY:top+60,arrowLength:10,color:'#000',lineWidth:2,arrowLineWidth:3});
						drawArrow({context:ctx,startX:60,startY:top+100,finX:20,finY:top+100,arrowLength:10,color:'#000',lineWidth:2,arrowLineWidth:3,fillArrow:true});
						drawArrow({context:ctx,startX:60,startY:top+140,finX:20,finY:top+140,arrowLength:15,color:'#000',lineWidth:2,arrowLineWidth:3});
						drawArrow({context:ctx,startX:60,startY:top+180,finX:20,finY:top+180,arrowLength:15,color:'#000',lineWidth:2,arrowLineWidth:3,fillArrow:true});	
					ctx.translate(-10,0);
					ctx.translate(70,0);
						var selected = 0;
						if (obj.endMid == 'dash' && obj.endMidSize == 10) selected = 1;
						if (obj.endMid == 'dash2' && obj.endMidSize == 10) selected = 2;
						if (obj.endMid == 'open' && obj.endMidSize == 15) selected = 3;
						if (obj.endMid == 'open2' && obj.endMidSize == 15) selected = 4;
						
						for (var i = 0; i < 5; i++) {
							ctx.fillStyle = i == selected ? '#66F' : '#CCF';
							ctx.fillRect(0,i*40+top,60,40);
							var kind = ['none','dash','dash2','open','open2'][i];
							var size = [0,10,10,15,15][i];
							cursorPos.push({shape:'rect',dims:[70,i*40+top,60,40],cursor:draw.cursors.pointer,type:'lineDecEndMid',kind:kind,size:size,obj:obj});
						}			
						
						ctx.lineWidth = 3;
						ctx.strokeStyle = '#000';
						ctx.beginPath();
						for (var i = 0; i < 5; i++) {
							ctx.moveTo(0,i*40+20+top);
							ctx.lineTo(60,i*40+20+top);
						}
						ctx.stroke();
					
						drawDash(ctx,0,top+60,60,top+60,8);
						drawDoubleDash(ctx,0,top+100,60,top+100,8);
						drawParallelArrow({context:ctx,startX:0,startY:top+140,finX:60,finY:top+140,arrowLength:10,lineWidth:3});
						drawParallelArrow({context:ctx,startX:0,startY:top+180,finX:60,finY:top+180,arrowLength:10,lineWidth:3,numOfArrows:2});	
					ctx.translate(-70,0);
					ctx.translate(130,0);
						var selected = 0;
						if (obj.endFin == 'open' && obj.endFinSize == 10) selected = 1;
						if (obj.endFin == 'closed' && obj.endFinSize == 10) selected = 2;
						if (obj.endFin == 'open' && obj.endFinSize == 15) selected = 3;
						if (obj.endFin == 'closed' && obj.endFinSize == 15) selected = 4;
						
						for (var i = 0; i < 5; i++) {
							ctx.fillStyle = i == selected ? '#66F' : '#CCF';
							ctx.fillRect(0,i*40+top,60,40);
							var kind = ['none','open','closed','open','closed'][i];
							var size = [0,10,10,15,15][i];
							cursorPos.push({shape:'rect',dims:[130,i*40+top,60,40],cursor:draw.cursors.pointer,type:'lineDecEndFin',kind:kind,size:size,obj:obj});
						}
						
						ctx.lineWidth = 3;
						ctx.strokeStyle = '#000';
						ctx.beginPath();
						for (var i = 0; i < 5; i++) {
							ctx.moveTo(0,i*40+20+top);
							ctx.lineTo(40,i*40+20+top);
						}
						ctx.stroke();
					
						drawArrow({context:ctx,startX:0,startY:top+60,finX:40,finY:top+60,arrowLength:10,color:'#000',lineWidth:2,arrowLineWidth:3});
						drawArrow({context:ctx,startX:0,startY:top+100,finX:40,finY:top+100,arrowLength:10,color:'#000',lineWidth:2,arrowLineWidth:3,fillArrow:true});
						drawArrow({context:ctx,startX:0,startY:top+140,finX:40,finY:top+140,arrowLength:15,color:'#000',lineWidth:2,arrowLineWidth:3});
						drawArrow({context:ctx,startX:0,startY:top+180,finX:40,finY:top+180,arrowLength:15,color:'#000',lineWidth:2,arrowLineWidth:3,fillArrow:true});	
					ctx.translate(-130,0);

					ctx.lineWidth = 2;
					ctx.strokeStyle = '#000';
					ctx.beginPath();
					for (var i = 0; i < 6; i++) {
						ctx.moveTo(10,i*40+top);
						ctx.lineTo(190,i*40+top);
					}
					for (var i = 0; i < 4; i++) {
						ctx.moveTo(10+i*60,top);
						ctx.lineTo(10+i*60,top+200);
					}
					ctx.stroke();
					
					top += 200+10;
					break;
				case 'curveDec':	
					top += 30;
					ctx.translate(10,0);
						var selected = 0;
						if (obj.endStart == 'open' && obj.endStartSize == 10) selected = 1;
						if (obj.endStart == 'closed' && obj.endStartSize == 10) selected = 2;
						if (obj.endStart == 'open' && obj.endStartSize == 15) selected = 3;
						if (obj.endStart == 'closed' && obj.endStartSize == 15) selected = 4;
						
						for (var i = 0; i < 5; i++) {
							ctx.fillStyle = i == selected ? '#66F' : '#CCF';
							ctx.fillRect(0,i*40+top,60,40);
							var kind = ['none','open','closed','open','closed'][i];
							var size = [0,10,10,15,15][i];
							cursorPos.push({shape:'rect',dims:[10,i*40+top,60,40],cursor:draw.cursors.pointer,type:'lineDecEndStart',kind:kind,size:size,obj:obj});
						}
						
						ctx.lineWidth = 3;
						ctx.strokeStyle = '#000';
						ctx.beginPath();
						for (var i = 0; i < 5; i++) {
							ctx.moveTo(20,i*40+20+top);
							ctx.lineTo(60,i*40+20+top);
						}
						ctx.stroke();
					
						drawArrow({context:ctx,startX:60,startY:top+60,finX:20,finY:top+60,arrowLength:10,color:'#000',lineWidth:2,arrowLineWidth:3});
						drawArrow({context:ctx,startX:60,startY:top+100,finX:20,finY:top+100,arrowLength:10,color:'#000',lineWidth:2,arrowLineWidth:3,fillArrow:true});
						drawArrow({context:ctx,startX:60,startY:top+140,finX:20,finY:top+140,arrowLength:15,color:'#000',lineWidth:2,arrowLineWidth:3});
						drawArrow({context:ctx,startX:60,startY:top+180,finX:20,finY:top+180,arrowLength:15,color:'#000',lineWidth:2,arrowLineWidth:3,fillArrow:true});	
					ctx.translate(-10,0);
					ctx.translate(70,0);
						var selected = 0;
						if (obj.endFin == 'open' && obj.endFinSize == 10) selected = 1;
						if (obj.endFin == 'closed' && obj.endFinSize == 10) selected = 2;
						if (obj.endFin == 'open' && obj.endFinSize == 15) selected = 3;
						if (obj.endFin == 'closed' && obj.endFinSize == 15) selected = 4;
						
						for (var i = 0; i < 5; i++) {
							ctx.fillStyle = i == selected ? '#66F' : '#CCF';
							ctx.fillRect(0,i*40+top,60,40);
							var kind = ['none','open','closed','open','closed'][i];
							var size = [0,10,10,15,15][i];
							cursorPos.push({shape:'rect',dims:[70,i*40+top,60,40],cursor:draw.cursors.pointer,type:'lineDecEndFin',kind:kind,size:size,obj:obj});
						}
						
						ctx.lineWidth = 3;
						ctx.strokeStyle = '#000';
						ctx.beginPath();
						for (var i = 0; i < 5; i++) {
							ctx.moveTo(0,i*40+20+top);
							ctx.lineTo(40,i*40+20+top);
						}
						ctx.stroke();
					
						drawArrow({context:ctx,startX:0,startY:top+60,finX:40,finY:top+60,arrowLength:10,color:'#000',lineWidth:2,arrowLineWidth:3});
						drawArrow({context:ctx,startX:0,startY:top+100,finX:40,finY:top+100,arrowLength:10,color:'#000',lineWidth:2,arrowLineWidth:3,fillArrow:true});
						drawArrow({context:ctx,startX:0,startY:top+140,finX:40,finY:top+140,arrowLength:15,color:'#000',lineWidth:2,arrowLineWidth:3});
						drawArrow({context:ctx,startX:0,startY:top+180,finX:40,finY:top+180,arrowLength:15,color:'#000',lineWidth:2,arrowLineWidth:3,fillArrow:true});	
					ctx.translate(-70,0);

					ctx.lineWidth = 2;
					ctx.strokeStyle = '#000';
					ctx.beginPath();
					for (var i = 0; i < 6; i++) {
						ctx.moveTo(10,i*40+top);
						ctx.lineTo(130,i*40+top);
					}
					for (var i = 0; i < 3; i++) {
						ctx.moveTo(10+i*60,top);
						ctx.lineTo(10+i*60,top+200);
					}
					ctx.stroke();
					
					top += 200+10;
					break;
			}
		}
		if (!un(draw.controlPanel2.colorMenu)) {
			var type = draw.controlPanel2.colorMenu.type;
			var pos2 = draw.controlPanel2.colorMenu.pos;
			var width = 30, padding = 10, rows = 6, cols = 4;
			if (draw.drawArea[0]+draw.drawArea[2]-pos2[0] < width*cols+2*padding) {
				pos2[0] = draw.drawArea[0]+draw.drawArea[2]-(width*cols+2*padding);
			}
			roundedRect(ctx,pos2[0],pos2[1],width*cols+2*padding,width*rows+2*padding,5,2,'#000','#FFF');
			cursorPos.push({shape:'rect',dims:[pos2[0],pos2[1],width*cols+2*padding,width*rows+2*padding],cursor:draw.cursors.default});
			var colors = [
				['none','#F00','#F99','#FCC'],
				['#000','#090','#9F9','#CFC'],
				['#666','#00F','#99F','#CCF'],
				['#999','#FF0','#FF9','#FFC'],
				['#CCC','#F0F','#F9F','#FCF'],
				['#FFF','#0FF','#9FF','#CFF'],
			]
			ctx.strokeStyle = '#000';
			ctx.lineWidth = 1;
			for (var r = 0; r < colors.length; r++) {
				var t = pos2[1]+padding+r*width;
				for (var c = 0; c < colors[r].length; c++) {
					var l = pos2[0]+padding+c*width;
					if (colors[r][c] == 'none') {
						ctx.beginPath();
						ctx.moveTo(l,t);
						ctx.lineTo(l+width,t+width);
						ctx.moveTo(l+width,t);
						ctx.lineTo(l,t+width);
						ctx.stroke();
					} else {
						ctx.fillStyle = colors[r][c];
						ctx.fillRect(l,t,width,width);
					}
					ctx.strokeRect(l,t,width,width);
					cursorPos.push({shape:'rect',dims:[l,t,width,width],cursor:draw.cursors.pointer,element:element,type:type,color:colors[r][c],obj:obj});
				}
			}
			
		}
		cursorPos.unshift({shape:'rect',dims:[pos[0],pos[1],pos[2],top+10-pos[1]],cursor:draw.cursors.default});
		draw.controlPanel2.cursorPositions = cursorPos;
		function drawPlusButton(ctx,rect,fillStyle) {
			if (un(fillStyle)) fillStyle = '#CCC';
			ctx.fillStyle = fillStyle;
			ctx.strokeStyle = '#000';
			ctx.lineWidth = 2;
			ctx.fillRect(rect[0],rect[1],rect[2],rect[3]);
			ctx.strokeRect(rect[0],rect[1],rect[2],rect[3]);
			ctx.beginPath();
			ctx.moveTo(rect[0]+0.25*rect[2],rect[1]+0.5*rect[3]);
			ctx.lineTo(rect[0]+0.75*rect[2],rect[1]+0.5*rect[3]);
			ctx.moveTo(rect[0]+0.5*rect[2],rect[1]+0.25*rect[3]);
			ctx.lineTo(rect[0]+0.5*rect[2],rect[1]+0.75*rect[3]);
			ctx.stroke();
		}
		function drawMinusButton(ctx,rect,fillStyle) {
			if (un(fillStyle)) fillStyle = '#CCC';
			ctx.fillStyle = fillStyle;
			ctx.strokeStyle = '#000';
			ctx.lineWidth = 2;
			ctx.fillRect(rect[0],rect[1],rect[2],rect[3]);
			ctx.strokeRect(rect[0],rect[1],rect[2],rect[3]);
			ctx.beginPath();
			ctx.moveTo(rect[0]+0.25*rect[2],rect[1]+0.5*rect[3]);
			ctx.lineTo(rect[0]+0.75*rect[2],rect[1]+0.5*rect[3]);
			ctx.stroke();
		}
	},
	move:function(e) {
		updateMouse(e);
		delete draw.controlPanel2.currCursor;
		draw.controlPanel2.ctx.canvas.style.cursor = 'default';
		var x = mouse.x - draw.controlPanel2.ctx.data[0];
		var y = mouse.y - draw.controlPanel2.ctx.data[1];
		for (var p = 0; p < draw.controlPanel2.cursorPositions.length; p++) {
			var pos = draw.controlPanel2.cursorPositions[p];
			if (draw.cursorPosHitTest(pos,x,y) == true) {
				draw.controlPanel2.currCursor = pos;
				draw.controlPanel2.ctx.canvas.style.cursor = pos.cursor;
			}
		}
		
	},
	start: function(e) {
		if (un(draw.controlPanel2.currCursor)) return;
		var obj = draw.controlPanel2.obj;
		var element = draw.controlPanel2.currCursor.element;
		var type = draw.controlPanel2.currCursor.type;
		if (type == 'slider') {
			draw.drag = {prev:[mouse.x,mouse.y],element:element,obj:obj,sliderLeft:draw.controlPanel2.currCursor.sliderLeft,sliderWidth:draw.controlPanel2.currCursor.sliderWidth};
			addListenerMove(window,draw.controlPanel2.move2);
			addListenerEnd(window,draw.controlPanel2.stop);
			draw.drawCanvas[draw.drawCanvas.length-2].style.cursor = draw.controlPanel2.currCursor.cursor;
		} else if (type == 'multiSelect') {
			draw.controlPanel2.currCursor.set(obj,draw.controlPanel2.currCursor.value);
			drawSelectedPaths();
		} else if (type == 'openLineColor') {
			if (!un(draw.controlPanel2.colorMenu) && draw.controlPanel2.colorMenu.type == 'lineColor') {
				delete draw.controlPanel2.colorMenu;
			} else {
				var dims = draw.controlPanel2.currCursor.dims;
				draw.controlPanel2.colorMenu = {type:'lineColor',pos:[0,dims[1]+dims[3]]};
			}
		} else if (type == 'openFillColor') {
			if (!un(draw.controlPanel2.colorMenu) && draw.controlPanel2.colorMenu.type == 'fillColor') {
				delete draw.controlPanel2.colorMenu;
			} else {
				var dims = draw.controlPanel2.currCursor.dims;
				draw.controlPanel2.colorMenu = {type:'fillColor',pos:[0,dims[1]+dims[3]]};
			}
		} else if (type == 'lineColor') {
			draw.setObjStrokeStyle(obj,draw.controlPanel2.currCursor.color);
			if (obj == false) draw.color = draw.controlPanel2.currCursor.color;
			delete draw.controlPanel2.colorMenu;
		} else if (type == 'fillColor') {
			draw.setObjFillStyle(obj,draw.controlPanel2.currCursor.color);
			if (obj == false) draw.fillColor = draw.controlPanel2.currCursor.color;
			delete draw.controlPanel2.colorMenu;
		} else if (type == 'lineWidthPlus') {
			if (obj !== false) {
				if (!un(draw[obj.type]) && !un(draw[obj.type].getLineWidth)) {
					var width = draw[obj.type].getLineWidth(obj);
					draw[obj.type].setLineWidth(obj,Math.min(8,width+1));
				} else if (!un(obj.thickness)) {
					obj.thickness = Math.min(8,obj.thickness+1);
				} else if (!un(obj.lineWidth)) {
					obj.lineWidth = Math.min(8,obj.lineWidth+1);
				}
			} else {
				draw.thickness = Math.min(8,draw.thickness+1);
			}
		} else if (type == 'lineWidthMinus') {
			if (obj !== false) {
				if (!un(draw[obj.type]) && !un(draw[obj.type].getLineWidth)) {
					var width = draw[obj.type].getLineWidth(obj);
					draw[obj.type].setLineWidth(obj,Math.max(1,width-1));
				} else if (!un(obj.thickness)) {
					obj.thickness = Math.max(1,obj.thickness-1);
				} else if (!un(obj.lineWidth)) {
					obj.lineWidth = Math.max(1,obj.lineWidth-1);
				}
			} else {
				draw.thickness = Math.max(1,draw.thickness-1);
			}
		} else if (type == 'toggle') {
			draw.controlPanel2.currCursor.set(obj);
		} else if (type == 'increment') {
			draw.controlPanel2.currCursor.increment(obj,draw.controlPanel2.currCursor.value);
		} else if (type == 'lineDecEndStart') {
			obj.endStart = draw.controlPanel2.currCursor.kind;
			obj.endStartSize = draw.controlPanel2.currCursor.size;
		} else if (type == 'lineDecEndMid') {
			obj.endMid = draw.controlPanel2.currCursor.kind;
			obj.endMidSize = draw.controlPanel2.currCursor.size;
		} else if (type == 'lineDecEndFin') {
			obj.endFin = draw.controlPanel2.currCursor.kind;
			obj.endFinSize = draw.controlPanel2.currCursor.size;
		}
		if (['openLineColor','openFillColor'].includes(type) == false) {
			delete draw.controlPanel2.colorMenu;
		}
		drawCanvasPaths();
		drawSelectCanvas();
		calcCursorPositions();		
	},
	move2: function(e) {
		updateMouse(e);
		var x = mouse.x - draw.controlPanel2.ctx.data[0];
		var y = mouse.y - draw.controlPanel2.ctx.data[1];
		var obj = draw.drag.obj;
		var element = draw.drag.element;
		if (element.type == 'slider') {
			var value = bound(element.min+(element.max-element.min)*(x-draw.drag.sliderLeft)/draw.drag.sliderWidth,element.min,element.max,element.step);
			if (!un(element.set)) {
				element.set(obj,value);
			} else {
				obj[element.value] = value;
			}
		}
		drawCanvasPaths();
	},
	stop: function(e) {
		delete draw.drag;
		removeListenerMove(window,draw.controlPanel2.move2);
		removeListenerEnd(window,draw.controlPanel2.stop);
	}
};
*/
draw.setObjFillStyle = function(obj,color) {
	if (obj == false || un(obj.type)) return;
	if (!un(draw[obj.type]) && !un(draw[obj.type].setFillColor)) {
		draw[obj.type].setFillColor(obj,color);
		return;
	}
	
	if (!un(obj.fillColor)) {
		obj.fillColor = color;
	} else if (!un(obj.fillStyle)) {
		obj.fillStyle = color;
	}
	
	if (['table2'].indexOf(obj.type) > -1) {
		var selCount = draw.table2.countSelectedCells(obj);
		var cells = selCount == 0 ? draw.table2.getAllCells(obj) : draw.table2.getSelectedCells(obj);
		for (var c = 0; c < cells.length; c++) {
			var cell = cells[c];
			if (!un(cell.box)) {
				cell.box.color = color;
			} else {
				if (color !== 'none') {
					cell.box = {
						color:color,
						lineColor:'none',
						borderWidth:3,
						borderRadius:0,
						show:true
					}
				}
			}
		}
	}
}
draw.setObjStrokeStyle = function(obj,color) {
	if (obj == false || un(obj.type)) return;
	if (!un(draw[obj.type]) && !un(draw[obj.type].setLineColor)) {
		draw[obj.type].setLineColor(obj,color);
		return;
	}
	if (!un(obj.color)) {
		obj.color = color;
	} else if (!un(obj.lineColor)) {
		obj.lineColor = color;
	} else if (!un(obj.strokeStyle)) {
		obj.strokeStyle = color;
	}

	if (['table2'].indexOf(obj.type) > -1) {
		var selCount = draw.table2.countSelectedCells(obj);
		var cells = selCount == 0 ? draw.table2.getAllCells(obj) : draw.table2.getSelectedCells(obj);
		for (var c = 0; c < cells.length; c++) {
			var cell = cells[c];
			if (!un(cell.box)) {
				cell.box.borderColor = color;
			} else {
				if (color !== 'none') {
					cell.box = {
						color:'none',
						borderColor:color,
						borderWidth:3,
						borderRadius:0,
						show:true
					}
				}
			}
		}
	}
}
draw.controlPanel = {
	data:{elements:[]},
	cursorPositions:[],
	clear: function() {
		draw.controlPanel.data = {elements:[]};
		draw.controlPanel.cursorPositions = [];
	},
	draw: function(ctx,obj,path,controlPanelData,pos) {
		if (draw.mode === 'interact') return;
		draw.controlPanel.path = path;
		draw.controlPanel.obj = obj;
		draw.controlPanel.clear();
		if (!un(controlPanelData)) {
			draw.controlPanel.data = controlPanelData;
		} else {
			if (un(draw[obj.type]) || un(draw[obj.type].getControlPanel)) return;
			draw.controlPanel.data = draw[obj.type].getControlPanel(obj);
		}
		var cursorPos = [];
		var elements = draw.controlPanel.data.elements;
		var width = draw.controlPanel.data.width || 200;
		if (un(pos)) {
			if (draw.drawArea[0]+draw.drawArea[2]-path.border[4] >= width) {
				var pos = [path.border[4],path.border[1],width];
			} else {
				var pos = [path.border[0]-width,path.border[1],width];
			}
		}
		var top = pos[1]+10;
		for (var e = 0; e < elements.length; e++) {
			var element = elements[e];
			var bold = boolean(element.bold,true);
			var fontSize = element.fontSize || 20;
			var margin = element.margin*pos[2] || 0;
			text({ctx:ctx,rect:[pos[0]+10+margin,top,pos[2]-20,40],align:[-1,-1],text:['<<fontSize:'+fontSize+'>><<bold:'+bold+'>>'+element.name]});
			switch (element.type) {
				case 'style':
					var w = 0.4*pos[2]/3;
					var space = 0.6*pos[2]/4;
					var l = pos[0]+space;
					var t = top+50;
					
					var strokeStyle = draw[obj.type].getLineColor(obj);
					text({ctx:ctx,align:[0,-1],rect:[l,top+25,w,w],text:['<<fontSize:18>>line']})
					ctx.beginPath();
					cursorPos.push({shape:'rect',dims:[l,t,w,w],cursor:draw.cursors.pointer,element:element,type:'openLineColor',obj:obj,func:draw.controlPanel.start});
					if (strokeStyle == 'none') {
						ctx.strokeStyle = '#000';
						ctx.lineWidth = 2;
						ctx.strokeRect(l,t,w,w);
						ctx.moveTo(l,t);
						ctx.lineTo(l+w,t+w);
						ctx.moveTo(l+w,t);
						ctx.lineTo(l,t+w);
						ctx.stroke();
					} else {
						ctx.fillStyle = strokeStyle;
						ctx.fillRect(l,t,w,w);
						ctx.strokeStyle = '#000';
						ctx.lineWidth = 2;
						ctx.strokeRect(l,t,w,w);
					}
					
					l += space+w;
					var fillStyle = draw[obj.type].getLineWidth(obj);
					text({ctx:ctx,align:[0,-1],rect:[l,top+25,w,w],text:['<<fontSize:18>>width']})
					var minusRect = [l-0.3*w,t+0.1*w,0.8*w,0.8*w];
					var plusRect = [l-0.3*w+0.8*w,t+0.1*w,0.8*w,0.8*w];
					drawPlusButton(ctx,plusRect);
					drawMinusButton(ctx,minusRect);
					cursorPos.push({shape:'rect',dims:plusRect,cursor:draw.cursors.pointer,element:element,type:'lineWidthPlus',obj:obj,func:draw.controlPanel.start});
					cursorPos.push({shape:'rect',dims:minusRect,cursor:draw.cursors.pointer,element:element,type:'lineWidthMinus',obj:obj,func:draw.controlPanel.start});
					
					
					l += space+w;
					var fillStyle = draw[obj.type].getFillColor(obj);
					text({ctx:ctx,align:[0,-1],rect:[l,top+25,w,w],text:['<<fontSize:18>>fill']})
					cursorPos.push({shape:'rect',dims:[l,t,w,w],cursor:draw.cursors.pointer,element:element,type:'openFillColor',obj:obj,func:draw.controlPanel.start});
					ctx.beginPath();
					if (fillStyle == 'none') {
						ctx.strokeStyle = '#000';
						ctx.lineWidth = 2;
						ctx.strokeRect(l,t,w,w);
						ctx.moveTo(l,t);
						ctx.lineTo(l+w,t+w);
						ctx.moveTo(l+w,t);
						ctx.lineTo(l,t+w);
						ctx.stroke();
					} else {
						ctx.fillStyle = fillStyle;
						ctx.fillRect(l,t,w,w);
						ctx.strokeStyle = '#000';
						ctx.lineWidth = 2;
						ctx.strokeRect(l,t,w,w);
					}
					
					top += 90;
					break;
				case 'toggle':
					var rect = [pos[0]+pos[2]*0.1,top+2,16,16];
					ctx.lineWidth = 2;
					ctx.strokeStyle = '#000';
					ctx.fillStyle = '#FFF';
					ctx.fillRect(rect[0],rect[1],rect[2],rect[3]);
					ctx.strokeRect(rect[0],rect[1],rect[2],rect[3]);
					if (element.get(obj)) drawTick(ctx,16,20,'#060',pos[0]+pos[2]*0.1,top,3);
					cursorPos.push({shape:'rect',dims:[pos[0]+pos[2]*0.1,top,0.8*pos[2],20],cursor:draw.cursors.pointer,element:element,set:element.set,type:'toggle',obj:obj,func:draw.controlPanel.start});
					top += 30;
					break;
				case 'increment':
					var minusRect = [pos[0]+pos[2]*0.7,top+2,22,22];
					var plusRect = [pos[0]+pos[2]*0.7+22,top+2,22,22];
					drawPlusButton(ctx,plusRect);
					drawMinusButton(ctx,minusRect);
					cursorPos.push({shape:'rect',dims:plusRect,cursor:draw.cursors.pointer,element:element,type:'increment',value:1,increment:element.increment,obj:obj,func:draw.controlPanel.start});
					cursorPos.push({shape:'rect',dims:minusRect,cursor:draw.cursors.pointer,element:element,type:'increment',value:-1,increment:element.increment,obj:obj,func:draw.controlPanel.start});
					top += 40;
					break;
				case 'slider':
					var sliderLeft = pos[0]+0.55*pos[2];
					var sliderWidth = 0.3*pos[2];
					ctx.lineWidth = 2;
					ctx.strokeStyle = '#000';
					ctx.beginPath();
					ctx.moveTo(sliderLeft,top+15);
					ctx.lineTo(sliderLeft+sliderWidth,top+15);
					ctx.stroke();
					if (typeof element.value == 'string') {
						var value = obj[element.value];
					} else if (typeof element.value == 'function') {
						var value = element.value(obj);
					} else if (!un(element.get)) {
						var value = element.get(obj);
					}
					var xPos = sliderLeft + sliderWidth*(value-element.min)/(element.max-element.min);
					ctx.fillStyle = '#00F';
					ctx.beginPath();
					ctx.arc(xPos,top+15,8,0,2*Math.PI);
					ctx.fill();
					cursorPos.push({shape:'circle',dims:[xPos,top+15,8],cursor:draw.cursors.pointer,element:element,type:'slider',obj:obj,func:draw.controlPanel.start,sliderLeft:sliderLeft,sliderWidth:sliderWidth});
					top += 30;
					break;
				case 'multiSelect':
					var cells = [], rows = 0, cols = 0, heights = [], widths = [];
					var selected = element.get(obj);
					for (var r = 0; r < element.options.length; r++) {
						cells[r] = [];
						rows++;
						heights.push(30);
						for (var c = 0; c < element.options[r].length; c++) {
							var txt = !un(element.options[r][c]) ? element.options[r][c] : '';
							cells[r][c] = {};
							if (text !== '' && selected.toLowerCase() == txt.toLowerCase()) {
								cells[r][c].color = '#3FF';
							}
							cells[r][c].text = ['<<fontSize:18>>'+txt];
							cols = Math.max(cols,c);
						}
					}
					for (var c = 0; c < cols+1; c++) widths.push(0.8*pos[2]/(cols+1));
					var table = drawTable3({ctx:ctx,left:pos[0]+pos[2]*0.1,top:top+30,widths:widths,heights:heights,cells:cells,outerBorder:{width:2,color:'#000',dash:[]},innerBorder:{width:1,color:'#000',dash:[]}});
					
					for (var r = 0; r < table.cell.length; r++) {
						for (var c = 0; c < table.cell[r].length; c++) {
							var cell = table.cell[r][c];
							cursorPos.push({shape:'rect',dims:[cell.left,cell.top,cell.width,cell.height],cursor:draw.cursors.pointer,element:element,set:element.set,type:'multiSelect',value:element.options[r][c],obj:obj,func:draw.controlPanel.start});
						}
					}
					
					top += (rows+1)*30+10;
					break;
			}
		}
		if (!un(draw.controlPanel.colorMenu)) {
			var type = draw.controlPanel.colorMenu.type;
			var pos2 = draw.controlPanel.colorMenu.pos;
			var width = 30, padding = 10, rows = 6, cols = 4;
			if (draw.drawArea[0]+draw.drawArea[2]-pos2[0] < width*cols+2*padding) {
				pos2[0] = draw.drawArea[0]+draw.drawArea[2]-(width*cols+2*padding);
			}
			roundedRect(ctx,pos2[0],pos2[1],width*cols+2*padding,width*rows+2*padding,5,2,'#000','#FFF');
			cursorPos.push({shape:'rect',dims:[pos2[0],pos2[1],width*cols+2*padding,width*rows+2*padding],cursor:draw.cursors.default});
			var colors = [
				['none','#F00','#F99','#FCC'],
				['#000','#090','#9F9','#CFC'],
				['#666','#00F','#99F','#CCF'],
				['#999','#FF0','#FF9','#FFC'],
				['#CCC','#F0F','#F9F','#FCF'],
				['#FFF','#0FF','#9FF','#CFF'],
			]
			ctx.strokeStyle = '#000';
			ctx.lineWidth = 1;
			for (var r = 0; r < colors.length; r++) {
				var t = pos2[1]+padding+r*width;
				for (var c = 0; c < colors[r].length; c++) {
					var l = pos2[0]+padding+c*width;
					if (colors[r][c] == 'none') {
						ctx.beginPath();
						ctx.moveTo(l,t);
						ctx.lineTo(l+width,t+width);
						ctx.moveTo(l+width,t);
						ctx.lineTo(l,t+width);
						ctx.stroke();
					} else {
						ctx.fillStyle = colors[r][c];
						ctx.fillRect(l,t,width,width);
					}
					ctx.strokeRect(l,t,width,width);
					cursorPos.push({shape:'rect',dims:[l,t,width,width],cursor:draw.cursors.pointer,element:element,type:type,color:colors[r][c],obj:obj,func:draw.controlPanel.start});
				}
			}
			
		}
		ctx.globalCompositeOperation = 'destination-over';
		roundedRect(ctx,pos[0],pos[1],pos[2],top+10-pos[1],0,3,'#000','#FFC');
		ctx.globalCompositeOperation = 'source-over';
		cursorPos.unshift({shape:'rect',dims:[pos[0],pos[1],pos[2],top+10-pos[1]],cursor:draw.cursors.default});
		draw.controlPanel.cursorPositions = cursorPos;
		function drawPlusButton(ctx,rect,fillStyle) {
			if (un(fillStyle)) fillStyle = '#CCC';
			ctx.fillStyle = fillStyle;
			ctx.strokeStyle = '#000';
			ctx.lineWidth = 2;
			ctx.fillRect(rect[0],rect[1],rect[2],rect[3]);
			ctx.strokeRect(rect[0],rect[1],rect[2],rect[3]);
			ctx.beginPath();
			ctx.moveTo(rect[0]+0.25*rect[2],rect[1]+0.5*rect[3]);
			ctx.lineTo(rect[0]+0.75*rect[2],rect[1]+0.5*rect[3]);
			ctx.moveTo(rect[0]+0.5*rect[2],rect[1]+0.25*rect[3]);
			ctx.lineTo(rect[0]+0.5*rect[2],rect[1]+0.75*rect[3]);
			ctx.stroke();
		}
		function drawMinusButton(ctx,rect,fillStyle) {
			if (un(fillStyle)) fillStyle = '#CCC';
			ctx.fillStyle = fillStyle;
			ctx.strokeStyle = '#000';
			ctx.lineWidth = 2;
			ctx.fillRect(rect[0],rect[1],rect[2],rect[3]);
			ctx.strokeRect(rect[0],rect[1],rect[2],rect[3]);
			ctx.beginPath();
			ctx.moveTo(rect[0]+0.25*rect[2],rect[1]+0.5*rect[3]);
			ctx.lineTo(rect[0]+0.75*rect[2],rect[1]+0.5*rect[3]);
			ctx.stroke();
		}
	},
	start: function() {
		var obj = draw.controlPanel.obj;
		var element = draw.currCursor.element;
		var type = draw.currCursor.type;
		if (type == 'slider') {
			draw.drag = {prev:[mouse.x,mouse.y],element:element,obj:obj,sliderLeft:draw.currCursor.sliderLeft,sliderWidth:draw.currCursor.sliderWidth};
			draw.animate(draw.controlPanel.move,draw.controlPanel.stop,drawCanvasPaths);			
			//addListenerMove(window,draw.controlPanel.move);
			//addListenerEnd(window,draw.controlPanel.stop);
			draw.drawCanvas[draw.drawCanvas.length-2].style.cursor = draw.currCursor.cursor;
		} else if (type == 'multiSelect') {
			draw.currCursor.set(obj,draw.currCursor.value);
			drawSelectedPaths();
		} else if (type == 'openLineColor') {
			if (!un(draw.controlPanel.colorMenu) && draw.controlPanel.colorMenu.type == 'lineColor') {
				delete draw.controlPanel.colorMenu;
			} else {
				var dims = draw.currCursor.dims;
				draw.controlPanel.colorMenu = {type:'lineColor',pos:[dims[0],dims[1]+dims[3]]};
			}
		} else if (type == 'openFillColor') {
			if (!un(draw.controlPanel.colorMenu) && draw.controlPanel.colorMenu.type == 'fillColor') {
				delete draw.controlPanel.colorMenu;
			} else {
				var dims = draw.currCursor.dims;
				draw.controlPanel.colorMenu = {type:'fillColor',pos:[dims[0],dims[1]+dims[3]]};
			}
		} else if (type == 'lineColor') {
			draw[obj.type].setLineColor(obj,draw.currCursor.color);
			delete draw.controlPanel.colorMenu;
		} else if (type == 'fillColor') {
			draw[obj.type].setFillColor(obj,draw.currCursor.color);
			delete draw.controlPanel.colorMenu;
		} else if (type == 'lineWidthPlus') {
			var width = draw[obj.type].getLineWidth(obj);
			draw[obj.type].setLineWidth(obj,Math.min(8,width+1));
		} else if (type == 'lineWidthMinus') {
			var width = draw[obj.type].getLineWidth(obj);
			draw[obj.type].setLineWidth(obj,Math.max(1,width-1));
		} else if (type == 'toggle') {
			draw.currCursor.set(obj);
		} else if (type == 'increment') {
			draw.currCursor.increment(obj,draw.currCursor.value);
		}
		if (['openLineColor','openFillColor'].includes(type) == false) {
			delete draw.controlPanel.colorMenu;
		}
		drawCanvasPaths();
		drawSelectCanvas();
		calcCursorPositions();		
	},
	move: function(e) {
		updateMouse(e);
		var obj = draw.drag.obj;
		var element = draw.drag.element;
		if (element.type == 'slider') {
			var value = bound(element.min+(element.max-element.min)*(mouse.x-draw.drag.sliderLeft)/draw.drag.sliderWidth,element.min,element.max,element.step);
			if (!un(element.set)) {
				element.set(obj,value);
			} else {
				obj[element.value] = value;
			}
		}
		//drawCanvasPaths();
	},
	stop: function(e) {
		delete draw.drag;
		//removeListenerMove(window,draw.controlPanel.move);
		//removeListenerEnd(window,draw.controlPanel.stop);
	}
};
function angleStyleIncrement(angle) {
	angle.style = (angle.style+1) % 7;
	switch (angle.style) {
		case 0:
			angle.drawCurve = false;
			angle.numOfCurves = 1;
			angle.fill = false;
			break;
		case 1:
			angle.drawCurve = true;
			angle.numOfCurves = 1;
			angle.fill = false;
			break;
		case 2:
			angle.drawCurve = true;
			angle.numOfCurves = 2;
			angle.fill = false;
			break;
		case 3:
			angle.drawCurve = true;
			angle.numOfCurves = 3;
			angle.fill = false;
			break;				
		case 4:
			angle.drawCurve = true;
			angle.numOfCurves = 1;
			angle.fill = true;
			angle.fillColor = '#CFC';
			break;
		case 5:
			angle.drawCurve = true;
			angle.numOfCurves = 1;
			angle.fill = true;
			angle.fillColor = '#FCF';		
			break;
		case 6:
			angle.drawCurve = true;
			angle.numOfCurves = 1;
			angle.fill = true;
			angle.fillColor = '#CCF';		
			break;
	}	
	return angle;
}

/****************************/
/* PROTRACTOR RULER COMPASS */
/****************************/

function getRelPos(pos) {
	if (un(pos)) pos = [mouse.x,mouse.y];
	return [pos[0]-draw.drawRelPos[0],pos[1]-draw.drawRelPos[1]];
	//return [(pos[0]-draw.drawRelPos[0])/draw.scale,(pos[1]-draw.drawRelPos[1])/draw.scale];
}
function drawClickProtractorStartMove() {
	moveToolToFront('protractor');
	draw.cursorCanvas.style.cursor = draw.cursors.move1;
	draw.animate(protractorDragMove,protractorDragStop,drawToolsCanvas);
	changeDrawMode('protractorMove');
}
function protractorDragMove(e) {
	updateMouse(e);
	var center = [
		draw.mouse[0]-draw.protractor.relSelPoint[0],
		draw.mouse[1]-draw.protractor.relSelPoint[1]
	];
	center = snapToObj2(center,-1);
	
	draw.protractor.center[0] = center[0];
	draw.protractor.center[1] = center[1];	
	//drawToolsCanvas();
}
function protractorDragStop(e) {
	changeDrawMode('prev');
}

function drawClickProtractorStartRotate() {
	moveToolToFront('protractor');
	draw.animate(protractorRotateMove,protractorRotateStop,drawToolsCanvas);
	changeDrawMode('protractorRotate');
}
function protractorRotateMove(e) {
	updateMouse(e);
	
	draw.protractor.angle += measureAngle({c:draw.mouse,b:[draw.protractor.center[0],draw.protractor.center[1]],a:[draw.protractor.prevX,draw.protractor.prevY],angleType:'radians'});
	
	draw.protractor.prevX = draw.mouse[0];
	draw.protractor.prevY = draw.mouse[1];
}
function protractorRotateStop(e) {
	changeDrawMode('prev');
}

function drawClickRulerStartMove() {
	moveToolToFront('ruler');
	//addListenerMove(window,rulerDragMove);
	//addListenerEnd(window,rulerDragStop);
	draw.animate(rulerDragMove,rulerDragStop,drawToolsCanvas);	
	changeDrawMode('rulerMove');
}
function rulerDragMove(e) {
	updateMouse(e);
	
	draw.ruler.left += draw.mouse[0]-draw.ruler.prevX;
	draw.ruler.top += draw.mouse[1]-draw.ruler.prevY;
	recalcRulerValues();
	//drawToolsCanvas();
	
	draw.ruler.prevX = draw.mouse[0];
	draw.ruler.prevY = draw.mouse[1];
}
function rulerDragStop(e) {
	changeDrawMode('prev');
}

function drawClickRulerStartRotate1() {
	moveToolToFront('ruler');
	//addListenerMove(window,rulerRotateMove1);
	//addListenerEnd(window,rulerRotateStop);
	draw.animate(rulerRotateMove1,rulerRotateStop,drawToolsCanvas);	
	changeDrawMode('rulerRotate');
}
function drawClickRulerStartRotate2() {
	moveToolToFront('ruler');
	//addListenerMove(window,rulerRotateMove2);
	//addListenerEnd(window,rulerRotateStop);
	draw.animate(rulerRotateMove2,rulerRotateStop,drawToolsCanvas);		
	changeDrawMode('rulerRotate');
}
function rulerRotateMove1(e) {
	updateMouse(e);
	
	dAngle = measureAngle({c:draw.mouse,b:[draw.ruler.centerX2,draw.ruler.centerY2],a:[draw.ruler.prevX,draw.ruler.prevY],angleType:'radians'});
	draw.ruler.angle += dAngle;
	draw.ruler.left = (draw.ruler.centerX2 - 0.98*draw.ruler.length*Math.cos(draw.ruler.angle));
	draw.ruler.top = (draw.ruler.centerY2 - 0.98*draw.ruler.length*Math.sin(draw.ruler.angle));
	recalcRulerValues();
	//drawToolsCanvas();	
	
	draw.ruler.prevX = draw.mouse[0];
	draw.ruler.prevY = draw.mouse[1];
}
function rulerRotateMove2(e) {
	updateMouse(e);
	
	draw.ruler.angle += measureAngle({c:draw.mouse,b:[draw.ruler.centerX1,draw.ruler.centerY1],a:[draw.ruler.prevX,draw.ruler.prevY],angleType:'radians'});
	recalcRulerValues();
	//drawToolsCanvas();
	
	draw.ruler.prevX = draw.mouse[0];
	draw.ruler.prevY = draw.mouse[1];
}
function rulerRotateStop(e) {
	changeDrawMode('prev');
}
function drawClickRulerRotate180() {
	moveToolToFront('ruler');
	draw.ruler.angle += Math.PI;
	draw.ruler.left += 2*draw.ruler.centerRel[0];
	draw.ruler.top += 2*draw.ruler.centerRel[1];
	recalcRulerValues();
	drawToolsCanvas();
}


function drawClickRulerStartDraw1() {
	//console.log('drawClickRulerStartDraw1');
	moveToolToFront('ruler');
	draw.drawing = true;
	drawCanvasPaths();
	var obj = {
		type:'line',
		color:draw.color,
		thickness:draw.thickness,
		startPos:[draw.startX,draw.startY]
	};
	if (!un(draw.dash) && draw.dash.length > 0) obj.dash = clone(draw.dash);	
	draw.path.push({obj:[obj],selected:false});
	//addListenerMove(window,rulerDrawMove1);
	//addListenerEnd(window,lineDrawStop);	
	draw.animate(rulerDrawMove1,lineDrawStop,drawSelectedPaths);	
}
function rulerDrawMove1(e) {
	updateMouse(e);
	
	var newPos = closestPointOnLineSegment(draw.mouse,draw.ruler.edgePos1,draw.ruler.edgePos2);
	draw.path[draw.path.length-1].obj[0].finPos = newPos;
	//drawSelectedPaths();	
}

function drawClickRulerStartDraw2() {
	//console.log('drawClickRulerStartDraw2');
	moveToolToFront('ruler');
	draw.drawing = true;
	drawCanvasPaths();
	var obj = {
		type:'line',
		color:draw.color,
		thickness:draw.thickness,
		startPos:[draw.startX,draw.startY]
	};
	if (!un(draw.dash) && draw.dash.length > 0) obj.dash = clone(draw.dash);	
	draw.path.push({obj:[obj],selected:false});
	//addListenerMove(window,rulerDrawMove2);
	//addListenerEnd(window,lineDrawStop);	
	draw.animate(rulerDrawMove2,lineDrawStop,drawSelectedPaths);	
}
function rulerDrawMove2(e) {
	updateMouse(e);
	var newPos = closestPointOnLineSegment(draw.mouse,draw.ruler.edgePos3,draw.ruler.edgePos4);
	draw.path[draw.path.length-1].obj[0].finPos = newPos;
	//drawSelectedPaths();	
}

function drawClickCompassLock() {
	moveToolToFront('compass');
	draw.compass.radiusLocked = !draw.compass.radiusLocked;
	drawToolsCanvas();	
}

function drawClickCompassStartDraw(e) {
	updateMouse(e);	
	moveToolToFront('compass');
	draw.compass.mode = 'draw';
	draw.drawing = true;
	changeDrawMode('compassDraw');
	var obj = {
		type:'arc',
		color:draw.color,
		thickness:draw.thickness,
		center:draw.compass.center1.slice(0),
		radius:draw.compass.radius,
		startAngle:draw.compass.angle,
		finAngle:draw.compass.angle,
		clockwise:true
	};
	if (!un(draw.dash) && draw.dash.length > 0) obj.dash = clone(draw.dash);
	draw.path.push({obj:[obj],selected:false});
	drawCanvasPaths();
	//addListenerMove(window,compassDrawMove);
	//addListenerEnd(window,compassDrawStop);
	draw.animate(compassDrawMove,compassDrawStop,function() {
		drawSelectedPaths();
		drawToolsCanvas();
	});
}
function compassDrawMove(e) {
	updateMouse(e);
	
	var dAngle = measureAngle({c:draw.mouse,b:[draw.compass.center1[0],draw.compass.center1[1]],a:[draw.compass.prevX,draw.compass.prevY],angleType:'radians'});
	if (dAngle > Math.PI) {
		draw.compass.angle -= dAngle = 2*Math.PI-dAngle;
	} else {
		draw.compass.angle += dAngle;
	}
	var angle = (draw.compass.angle%(2*Math.PI));
	if (angle < 0) angle += 2*Math.PI;
	if (angle > 0.5 * Math.PI && angle < 1.5 * Math.PI) {
		draw.compass.drawOn = 'left';	
	} else {
		draw.compass.drawOn = 'right';
	}
	draw.compass.center3[0] = draw.compass.center1[0]+draw.compass.radius*Math.cos(draw.compass.angle);
	draw.compass.center3[1] = draw.compass.center1[1]+draw.compass.radius*Math.sin(draw.compass.angle);
	
	/*var snapNewCenter3 = snapToObj2(draw.compass.center3,-1);
	if (snapNewCenter3[0] !== draw.compass.center3[0] || snapNewCenter3[1] !== draw.compass.center3[1]) {		
		draw.compass.angle = getAngleFromAToB(snapNewCenter3,draw.compass.center1);
		var angle = (draw.compass.angle%(2*Math.PI));
		if (angle < 0) angle += 2*Math.PI;
		if (angle > 0.5 * Math.PI && angle < 1.5 * Math.PI) {
			draw.compass.drawOn = 'left';	
		} else {
			draw.compass.drawOn = 'right';
		}
		draw.compass.center3[0] = draw.compass.center1[0]+draw.compass.radius*Math.cos(draw.compass.angle);
		draw.compass.center3[1] = draw.compass.center1[1]+draw.compass.radius*Math.sin(draw.compass.angle);
	}*/
	
	if (draw.compass.drawOn == 'right') {
		draw.compass.center2[0] = draw.compass.center1[0]+0.5*draw.compass.radius*Math.cos(draw.compass.angle)+draw.compass.h*Math.sin(draw.compass.angle);
		draw.compass.center2[1] = draw.compass.center1[1]+0.5*draw.compass.radius*Math.sin(draw.compass.angle)-draw.compass.h*Math.cos(draw.compass.angle);
	} else {
		draw.compass.center2[0] = draw.compass.center1[0]+0.5*draw.compass.radius*Math.cos(draw.compass.angle)-draw.compass.h*Math.sin(draw.compass.angle);
		draw.compass.center2[1] = draw.compass.center1[1]+0.5*draw.compass.radius*Math.sin(draw.compass.angle)+draw.compass.h*Math.cos(draw.compass.angle);			
	}	

	var mp1 = midpoint(draw.compass.center1[0],draw.compass.center1[1],draw.compass.center3[0],draw.compass.center3[1]);
	var mp2 = midpoint(draw.compass.center2[0],draw.compass.center2[1],mp1[0],mp1[1]);
	draw.compass.lockCenter = mp2;

	draw.path[draw.path.length-1].obj[0].startAngle = Math.min(draw.path[draw.path.length-1].obj[0].startAngle,draw.compass.angle);
	draw.path[draw.path.length-1].obj[0].finAngle = Math.max(draw.path[draw.path.length-1].obj[0].finAngle,draw.compass.angle);	
	
	recalcCompassValues();
	//drawSelectedPaths();
	//drawToolsCanvas();
	
	draw.compass.prevX = draw.mouse[0];
	draw.compass.prevY = draw.mouse[1];
}
function compassDrawStop(e) {
	//removeListenerMove(window,compassDrawMove);
	//removeListenerEnd(window,compassDrawStop);	
	draw.compass.mode = 'none';
	draw.drawing = false;
	changeDrawMode('prev');
	recalcCompassValues();
	drawToolsCanvas();
	// simplify angles to between 0 and 360
	var angle1 = draw.path[draw.path.length-1].obj[0].startAngle;
	var angle2 = draw.path[draw.path.length-1].obj[0].finAngle;
	if (angle1 > angle2) {
		draw.path[draw.path.length-1].obj[0].clockwise = true;
	} else {
		draw.path[draw.path.length-1].obj[0].clockwise = false;
	}
	if (Math.abs(angle1 - angle2) > 2 * Math.PI) {
		draw.path[draw.path.length-1].obj[0].startAngle = 0;
		draw.path[draw.path.length-1].obj[0].finAngle = 2 * Math.PI;
		draw.path[draw.path.length-1].obj[0].clockwise = true;
	} else {
		while (angle1 < 0) {angle1 += 2 * Math.PI;}
		while (angle2 < 0) {angle2 += 2 * Math.PI;}
		while (angle1 > 2 * Math.PI) {angle1 -= 2 * Math.PI;}
		while (angle2 > 2 * Math.PI) {angle2 -= 2 * Math.PI;}
		if (draw.path[draw.path.length-1].obj[0].clockwise == true) {
			draw.path[draw.path.length-1].obj[0].startAngle = angle1;
			draw.path[draw.path.length-1].obj[0].finAngle = angle2;
		} else {
			draw.path[draw.path.length-1].obj[0].startAngle = angle2;
			draw.path[draw.path.length-1].obj[0].finAngle = angle1;			
		}
	}
	//console.log(draw.path[draw.path.length-1].startAngle,draw.path[draw.path.length-1].finAngle,draw.path[draw.path.length-1].clockwise);
	drawCanvasPaths();
	delete draw.compass.dragRelPos;
}

function drawClickCompassStartMove1(e) {
	moveToolToFront('compass');
	draw.compass.mode = 'move1';
	changeDrawMode('compassMove1');
	updateSnapPoints(); // update intersection points	
	draw.animate(compassMove1Move,compassMoveStop,drawToolsCanvas);
	//addListenerMove(window,compassMove1Move);
	//addListenerEnd(window,compassMoveStop);
	draw.cursorCanvas.style.cursor = 'url("/i2/cursors/closedhand.cur"), auto';	
}
function drawClickCompassStartMove2(e) {
	updateMouse(e);
	draw.compass.dragRelPos = [draw.compass.center3[0]-draw.mouse[0],draw.compass.center3[1]-draw.mouse[1]];
	
	moveToolToFront('compass');
	draw.compass.mode = 'move2';
	changeDrawMode('compassMove2');
	updateSnapPoints(); // update intersection points	
	draw.compass.pointerEvents = 'auto';
	draw.animate(compassMove2Move,compassMoveStop,drawToolsCanvas);
	//addListenerMove(window,compassMove2Move);
	//addListenerEnd(window,compassMoveStop);	
	draw.cursorCanvas.style.cursor = 'url("/i2/cursors/closedhand.cur"), auto';
}
function compassMove1Move(e) {
	updateMouse(e);
	
	var center1 = [
		draw.mouse[0]-draw.compass.relSelPoint[0],
		draw.mouse[1]-draw.compass.relSelPoint[1]
	];
	if (snapToObj2On || draw.snapLinesTogether) {
		center1 = snapToObj2(center1);
	}
	draw.compass.center1 = center1;
	draw.compass.center2 = [center1[0]+draw.compass.relCenter2[0],center1[1]+draw.compass.relCenter2[1]];
	draw.compass.center3 = [center1[0]+draw.compass.relCenter3[0],center1[1]+draw.compass.relCenter3[1]];
	draw.compass.lockCenter = [center1[0]+draw.compass.relLockCenter[0],center1[1]+draw.compass.relLockCenter[1]];	
	//drawToolsCanvas();
}
function compassMove2Move(e) {
	updateMouse(e);
	var newcenter3 = [draw.mouse[0]+draw.compass.dragRelPos[0],draw.mouse[1]+draw.compass.dragRelPos[1]];
	
	if (draw.compass.radiusLocked == false) {
		newcenter3 = snapToObj2(newcenter3,-1);
		
		var newRadius = Math.sqrt(Math.pow(newcenter3[0]-draw.compass.center1[0],2)+Math.pow(newcenter3[1]-draw.compass.center1[1],2));
		
		if (newRadius <= 1.85 * draw.compass.armLength) {
			draw.compass.center3[0] = newcenter3[0];
			draw.compass.center3[1] = newcenter3[1];
			draw.compass.radius = newRadius;
			if (draw.compass.center3[0] >= draw.compass.center1[0]) {
				draw.compass.angle = Math.atan((draw.compass.center3[1]-draw.compass.center1[1])/(draw.compass.center3[0]-draw.compass.center1[0]));
			} else {
				draw.compass.angle = Math.PI + Math.atan((draw.compass.center3[1]-draw.compass.center1[1])/(draw.compass.center3[0]-draw.compass.center1[0]));
			}			
		} else {			
			if (newcenter3[0] >= draw.compass.center1[0]) {
				draw.compass.angle = Math.atan((newcenter3[1]-draw.compass.center1[1])/(newcenter3[0]-draw.compass.center1[0]));
			} else {
				draw.compass.angle = Math.PI + Math.atan((newcenter3[1]-draw.compass.center1[1])/(newcenter3[0]-draw.compass.center1[0]));
			}
			draw.compass.center3[0] = draw.compass.center1[0] + 1.85 * draw.compass.armLength * Math.cos(draw.compass.angle);
			draw.compass.center3[1] = draw.compass.center1[1] + 1.85 * draw.compass.armLength * Math.sin(draw.compass.angle);
			draw.compass.radius = 1.85 * draw.compass.armLength;		
		}
	} else {
		var snapNewCenter3 = snapToObj2(newcenter3,-1);
		var pos = clone(draw.mouse);
		if (Math.abs(dist(snapNewCenter3,draw.compass.center1) - draw.compass.radius) < 0.1) {
			pos = [pos[0]-draw.compass.dragRelPos[0],pos[1]-draw.compass.dragRelPos[1]];
		}
			
		var dAngle = measureAngle({c:pos,b:[draw.compass.center1[0],draw.compass.center1[1]],a:[draw.compass.prevX,draw.compass.prevY],angleType:'radians'});
		
		if (dAngle > Math.PI) {
			draw.compass.angle -= (2*Math.PI-dAngle);
		} else {
			draw.compass.angle += dAngle;
		}
		draw.compass.center3[0] = draw.compass.center1[0] + draw.compass.radius * Math.cos(draw.compass.angle);
		draw.compass.center3[1] = draw.compass.center1[1] + draw.compass.radius * Math.sin(draw.compass.angle);
	}

	var angle = (draw.compass.angle%(2*Math.PI));
	if (angle < 0) angle += 2*Math.PI;
	if (angle > 0.5 * Math.PI && angle < 1.5 * Math.PI) {
		draw.compass.drawOn = 'left';	
	} else {
		draw.compass.drawOn = 'right';
	}
		
	draw.compass.h	= Math.sqrt(Math.pow(draw.compass.armLength,2)-Math.pow(0.5*draw.compass.radius,2));
	if (draw.compass.drawOn == 'right') {
		draw.compass.center2[0] = draw.compass.center1[0]+0.5*draw.compass.radius*Math.cos(draw.compass.angle)+draw.compass.h*Math.sin(draw.compass.angle);
		draw.compass.center2[1] = draw.compass.center1[1]+0.5*draw.compass.radius*Math.sin(draw.compass.angle)-draw.compass.h*Math.cos(draw.compass.angle);		
	} else {
		draw.compass.center2[0] = draw.compass.center1[0]+0.5*draw.compass.radius*Math.cos(draw.compass.angle)-draw.compass.h*Math.sin(draw.compass.angle);
		draw.compass.center2[1] = draw.compass.center1[1]+0.5*draw.compass.radius*Math.sin(draw.compass.angle)+draw.compass.h*Math.cos(draw.compass.angle);				
	}
	
	var mp1 = midpoint(draw.compass.center1[0],draw.compass.center1[1],draw.compass.center3[0],draw.compass.center3[1]);
	var mp2 = midpoint(draw.compass.center2[0],draw.compass.center2[1],mp1[0],mp1[1]);
	draw.compass.lockCenter = mp2;
	
	recalcCompassValues();
	//drawToolsCanvas();
	
	draw.compass.prevX = draw.mouse[0];
	draw.compass.prevY = draw.mouse[1];
}
function compassMoveStop(e) {
	//removeListenerMove(window,compassMove1Move);
	//removeListenerMove(window,compassMove2Move);
	//removeListenerEnd(window,compassMoveStop);	
	draw.cursorCanvas.style.cursor = draw.cursors.move1;
	draw.compass.mode = 'none';
	changeDrawMode('prev');
	recalcCompassValues();
	delete draw.compass.dragRelPos;
}
