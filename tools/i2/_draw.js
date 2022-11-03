/*
zIndexes:
n = num of drawCanvases
drawCanvas[i] 10+2*i
path[i].mathsInputs 10+2*i+1
toolsCanvas 10+2*n
cursorCanvas 10+2*n+1
*/
var selImg = new Image();
selImg.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAqCAYAAACtMEtjAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAJwAAACcBKgmRTwAAAB50RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNS4xqx9I6wAABDlJREFUWIW1l19IZHUUxz9nRx0GZ4fMUEZxBTFBwQiNacthUURLGf+gA4Im4YskEi1hURKGSEFRivUgZKbZsoVC6sPGsvRgYKAs0kP4MhAZQewYrdKqM+J4Tw/eO4ymzsyqX/hxufd3zv3c3/mdc/hdAZ4FAqq6yyXqCnAd+FhE5LJBj4Be4MPLBm0DIeAdEbl5mSAB9s37T0Tk1csCAeByuQBswOciUn8ZIAOQxsZGBgYGAK4C34jIcxcNawT+bW9vV1XVrq4uBRRYB0pUlYsYAD5gy+fzqarq7u6u1tTUWLBfgOyLAEX3SETY39/H4XAwNTVFWVkZHBbzdyLyxHnDduWkhzk5OczOzlJcXAxQCXwpIo7zghTQ2FgCFBQUMDU1RV5eHkArMHxekMFhLf1PHo+HyclJ0tPTAV4TkY/OAwI4sppYVVdXMz09TVpaGsDbIvLGuUBnqaWlheHhaOQ+FZGOx4G9BGzW19drOBzWszQ0NGSlfQjwJVtHtcDDurq6uCBV1b6+Pgv2F+BJBlQD/JMoKBKJaGdnpwX7AyhOqmCPp/dpstlsjI+P4/P5AK5xWNC58fys9E5KdrudiYkJvF4vwDPAVyLijAd6LGVlZXHr1i2KiorgcJ+/FhH7WSADszMkq/z8fObm5sjNzQVoAcZOO3tYLeixVVJSwu3bt8nMzAToAj44DQSAYRgJJcNJunHjBhMTE6SmpgK8KyKvnwRKOhlOUlNTEzMzM7jdbjjsHq/EzqcQ073jKRQKEQwGMQyDvb296AiFQoTDYdxuNx6Ph4WFhVTgCxF5qKo/WCAxYXFDt7Gxgd/vZ319HRHh4OAAwzCIRCIYhoHNZos1dwDfi4gfuJOCGbrTIGNjY7hcLjo6OsjPz8fr9bK6ugrwN3AfSDXfoebVGhHACXiBnwBeBIJVVVW6vb19pN2Mjo4qoOXl5bqzs6Oqqmtra5qRkaHAn8CTgB1IM4EpmGfFmE5jN+d4AQhWVlYeAfX391v9TEVE5+fno3M9PT3W17+VTFO9boFUVff29rS7u9uCLAEDQLi2tlYNw1BV1eXlZU1PT1cgAGQkA3rQ3NysW1tb2tbWZkF+BZ42l76ckpKii4uL0VX5/X7LritR0PNAsLS0VKurqy3n+8C1GKNuQFtbW6OgpaUltdlsCiwCzkRAHuCBtR/Ajxw7NJqpuuZ0OnVlZSUKa2hosHxqEgGVAxumwwLw1CmGbwLa29sbBd27d09FRIFvEwFVmJAZ4OoZhi7g9+zsbA0EAqqqGgqFrHBvAWXxQC8DnwH2BL7qJqCDg4PRVd29e9fKwNF4ICdwJiDGOAcIFBYW6ubmpobDYR0ZGVGHw6HALlB6qm8igGOw9wFtb2/XioqKaFEDvwFVFwkqAIIxgJ85/NnOO9MvWZAJew+4A7QBrkR8xNqoZGQeQtJU9VGiPv8B36EL9hS19McAAAAASUVORK5CYII=";
function makeFillCursor(canvas,color) {
	var ctx = canvas.getContext('2d');
	
	ctx.translate(26,25);
	ctx.rotate(-0.25*Math.PI);
	
	ctx.strokeStyle = '#000';
	ctx.fillStyle = '#FFF';	
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(-7,-8);
	ctx.lineTo(7,-8);
	ctx.scale(7/2,1);
	ctx.arc(0,-8,2,Math.PI,2*Math.PI);
	ctx.scale(2/7,1);
	ctx.lineTo(7,8);
	ctx.scale(7/2,1);
	ctx.arc(0,8,2,0,Math.PI);
	ctx.scale(2/7,1);	
	ctx.lineTo(-7,-8);
	ctx.stroke();
	ctx.fill();
	
	ctx.strokeStyle = '#000';
	ctx.fillStyle = color;
	ctx.lineWidth = 0.5;
	ctx.beginPath();
	ctx.moveTo(7,-8);
	ctx.scale(7/2,1);
	ctx.arc(0,-8,2,Math.PI,3*Math.PI);
	ctx.scale(2/7,1);
	ctx.fill();
	ctx.stroke();
	
	ctx.fillRect(-7,0,9,5);
	ctx.strokeRect(-7,0,9,5);	
	
	ctx.beginPath();
	ctx.moveTo(0,-4);
	ctx.arc(0,-4,1,0,2*Math.PI);
	ctx.fill();
	ctx.beginPath();
	ctx.moveTo(0,-4);	
	ctx.quadraticCurveTo(20,10,8,-2);
	ctx.stroke();
	
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(-3,-9);
	ctx.quadraticCurveTo(-6,-17,-15,-3);
	ctx.quadraticCurveTo(-9,-9,-7,-9);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	
	ctx.rotate(0.25*Math.PI);
	ctx.translate(-26,-25);
	
	return [canvas.toDataURL(), 26-15*Math.sqrt(2)/2-3*Math.sqrt(2)/2, 25+15*Math.sqrt(2)/2-3*Math.sqrt(2)/2];
	// [data image, hotspotX, hotspotY]
}

function boolean(testVar, def) {
	if (typeof testVar == 'boolean') {
		return testVar;
	} else {
		return def;
	}
}
if (un(draw)) var draw = {};
function addDrawTools(object) {
	var zIndex = object.zIndex || 10;
	if (typeof object.protractor !== 'undefined' || typeof object.compass !== 'undefined' || typeof object.ruler !== 'undefined') {
		var retainCursorCanvas = true;
	} else {
		var retainCursorCanvas = boolean(object.retainCursorCanvas,false); // if false, hides the cursorCanvas when mode is 'select'
	}
	var color = object.color || '#000';
	var thickness = object.thickness || 1;
	var fillColor = object.fillColor || 'none';
	var buttonSize = object.buttonSize || 55;
	var buttonColor = object.buttonColor || '#C9F';
	var buttonSelectedColor = object.buttonSelectedColor || '#FFC';
	var defaultMode = object.defaultMode || object.drawMode || 'none';
	var drawMode = object.drawMode || object.defaultMode;
	var drawArea = object.drawArea || [0,0,mainCanvasWidth,mainCanvasHeight];
	var drawRelPos = object.drawRelPos || [0,0];
	var snapLinesTogether = boolean(object.snapLinesTogether, false);
	var gridSnap = boolean(object.gridSnap, false);
	var gridSnapSize = object.gridSnapSize || 15;
	var gridSnapRect = object.gridSnapRect || [0,0,1200,700];
	var gridMargin = object.gridMargin || [0,0,0,0];
	var selectTolerance = object.selectTolerance || 20;
	var selectColor = object.selectColor || '#33F';
	var selectPadding = object.selectPadding || 30;	
	if (typeof object.maxLines == 'number') {
		var maxLines = object.maxLines;
	} else {
		var maxLines = 10000;
	}
	var snap = boolean(object.snap,true);
	var snapTolerance = object.snapTolerance || 25;	
	var path = object.path || [];	
	var drawCanvas = [createCanvas(drawArea[0]+drawRelPos[0],drawArea[1]+drawRelPos[1],drawArea[2],drawArea[3],true,false,false,zIndex),createCanvas(drawArea[0],drawArea[1],drawArea[2],drawArea[3],true,false,false,zIndex+2)];
	//var drawCanvas2 = [createCanvas(drawArea[0]+drawRelPos[0],drawArea[1]+drawRelPos[1],drawArea[2],drawArea[3],true,false,false,zIndex),createCanvas(drawArea[0],drawArea[1],drawArea[2],drawArea[3],true,false,false,zIndex+2)];		
	zIndex += 4;
	var toolsCanvas = createCanvas(drawArea[0]+drawRelPos[0],drawArea[1]+drawRelPos[1],drawArea[2],drawArea[3],true,false,false,zIndex);
	zIndex++;
	var cursorCanvas = createCanvas(drawArea[0]+drawRelPos[0],drawArea[1]+drawRelPos[1],drawArea[2],drawArea[3],true,false,true,zIndex);	
	zIndex++;
	var hiddenCanvas = createCanvas(0,0,50,50,false,false,false,0); // for drawing cursors on
	var flattenMode = boolean(object.flattenMode,false); // flatten everything as much as possible (good for scrolling)
	highlightCursorPositions = boolean(object.highlightCursorPositions,false);

	draw.scale = 1;
	draw.zIndex = zIndex;
	draw.drawButtonZIndex = zIndex+1000000;
	draw.drawCanvas = drawCanvas;// moves when things are dragged
	//draw.drawCanvas2 = drawCanvas2;// does not move
	draw.hiddenCanvas = hiddenCanvas;
	draw.toolsCanvas = toolsCanvas;
	draw.toolsctx = toolsCanvas.getContext('2d');
	draw.toolOrder = ['compass','protractor','ruler'];// first is front-most
	draw.buttons = [];
	draw.flattenMode = flattenMode;
	draw.drawMode = drawMode;
	draw.defaultMode = defaultMode;
	draw.startDrawMode = drawMode;
	draw.prevDrawMode = 'none';
	draw.drawing = false;
	draw.drawArea = drawArea;
	draw.drawRelPos = drawRelPos;
	draw.maxLines = maxLines;
	draw.snapPoints = [];
	draw.showSnapPoints = false;
	draw.snap = true;
	draw.snapTolerance = snapTolerance;
	draw.path = path.slice(0);
	draw.startPath = path.slice(0);
	draw.protractorVisible = false;
	draw.compassVisible = false;
	draw.rulerVisible = false;
	draw.compassHelpVisible = false;
	draw.color = color;
	draw.startColor = color;
	draw.thickness = thickness;
	draw.startThickness = thickness;
	draw.fillColor = fillColor;
	draw.startFillColor = fillColor;
	draw.buttonSize = buttonSize;
	draw.buttonColor = buttonColor;
	draw.buttonSelectedColor = buttonSelectedColor;
	draw.colorButtons = [];
	draw.colorSelectVisible = false;
	draw.lineWidthSelectVisible = false;
	draw.fillColorButtons = [];
	draw.fillColorSelectVisible = false;			
	draw.thicknessButtons = [];
	draw.thicknessSelectVisible = false;
	draw.lineEndStartButtons = [];
	draw.lineEndMidButtons = [];
	draw.lineEndFinButtons = [];
	draw.lineEndSizeButtons = [];
	draw.lineEndButtonsVisible = false;
	draw.lineEndsSize = 12;
	draw.selectButtons = [];
	draw.selectButtonsVisible = false;
	draw.cursorCanvas = cursorCanvas;
	draw.retainCursorCanvas = retainCursorCanvas;
	draw.highlightCursorPositions = highlightCursorPositions;
	draw.penCursor = null;
	draw.penCursorHotspot = [];
	draw.rulerEdgeCursor1 = null;
	draw.rulerEdgeCursorHotspot1 = [];
	draw.rulerEdgeCursor2 = null;
	draw.rulerEdgeCursorHotspot2 = [];						
	draw.ruler180 = null;						
	draw.ruler180Hotspot = [];						
	draw.lineCursor = null;
	draw.lineCursorHotspot = [];
	draw.fillCursor = null;
	draw.fillCursorHotspot = [];
	draw.prevX = null;
	draw.prevY = null;
	draw.startX = null;
	draw.startY = null;
	draw.snapLinesTogether = snapLinesTogether;
	draw.gridSnap = gridSnap;
	draw.gridSnapRect = gridSnapRect;
	draw.gridSnapSize = gridSnapSize;
	draw.gridVertMargins = object.gridVertMargins || [];
	draw.gridHorizMargins = object.gridHorizMargins || [];
	draw.gridMargin = gridMargin;
	draw.horizSnap = 'left';
	draw.vertSnap = 'top';			
	draw.selectTolerance = selectTolerance;
	draw.selectColor = selectColor;
	draw.selectPadding = selectPadding;
	draw.triggerEnabled = false;
	draw.triggerNum = 0;
	draw.triggerNumMax = 1;
	draw.stepNum = 0;
	draw.videoAdded = false;
	draw.tableSizeVisible = false;
	changeDrawMode(draw.drawMode);
	draw.cursors = {
		default:'default',
		move1:'url("/i2/cursors/openhand.cur"), auto',
		move2:'url("/i2/cursors/closedhand.cur"), auto',
		move3:'move',
		ew:'ew-resize',
		ns:'ns-resize',
		nw:'nw-resize',
		text:'text',
		pointer:'pointer',
		rotate:'url("/i2/cursors/rotate.cur"), auto',
		update:function() {
			var canvas = draw.hiddenCanvas;
			var ctx = draw.hiddenCanvas.ctx;

			ctx.clearRect(0,0,50,50);			
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';
			ctx.translate(25,25);
			ctx.rotate(Math.PI/4);
				ctx.fillStyle = draw.color;
				ctx.fillRect(-5,-11,10,20);
				ctx.fillRect(-5,-18,10,5);
				ctx.beginPath();
				ctx.moveTo(-5,11);
				ctx.lineTo(0,18);
				ctx.lineTo(5,11);
				ctx.lineTo(-5,11);
				ctx.fill();		
			ctx.rotate(-Math.PI/4);	
			ctx.translate(-25,-25);

			draw.penCursor = canvas.toDataURL();
			draw.penCursorHotspot = [25-18/Math.sqrt(2),25+18/Math.sqrt(2)];	
			
			ctx.clearRect(0,0,50,50);
			ctx.strokeStyle = draw.color;
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(2,2);
			ctx.lineTo(12,12);
			ctx.moveTo(2,12);
			ctx.lineTo(12,2);
			ctx.stroke();
			
			draw.lineCursor = canvas.toDataURL();
			draw.lineCursorHotspot = [7,7];
	
			if (typeof draw.ruler !== 'undefined') {
				ctx.clearRect(0,0,50,50);
				ctx.translate(25,25);
				ctx.rotate(draw.ruler.angle);
					ctx.fillStyle = draw.color;
					ctx.fillRect(-5,-11,10,20);
					ctx.fillRect(-5,-18,10,5);
					ctx.beginPath();
					ctx.moveTo(-5,11);
					ctx.lineTo(0,18);
					ctx.lineTo(5,11);
					ctx.lineTo(-5,11);
					ctx.fill();		
				ctx.rotate(-draw.ruler.angle);	
				ctx.translate(-25,-25);

				draw.rulerEdgeCursor1 = canvas.toDataURL();
				draw.rulerEdgeCursorHotspot1 = [25-18*Math.sin(draw.ruler.angle),25+18*Math.cos(draw.ruler.angle)];
				
				ctx.clearRect(0,0,50,50);
				ctx.translate(25,25);
				ctx.rotate(Math.PI+draw.ruler.angle);
					ctx.fillStyle = draw.color;
					ctx.fillRect(-5,-11,10,20);
					ctx.fillRect(-5,-18,10,5);
					ctx.beginPath();
					ctx.moveTo(-5,11);
					ctx.lineTo(0,18);
					ctx.lineTo(5,11);
					ctx.lineTo(-5,11);
					ctx.fill();		
				ctx.rotate(-Math.PI-draw.ruler.angle);	
				ctx.translate(-25,-25);

				draw.rulerEdgeCursor2 = canvas.toDataURL();
				draw.rulerEdgeCursorHotspot2 = [25-18*Math.sin(Math.PI+draw.ruler.angle),25+18*Math.cos(Math.PI+draw.ruler.angle)];
				
				ctx.clearRect(0,0,50,50);
				ctx.translate(25,25);
				ctx.rotate(Math.PI+draw.ruler.angle);
					ctx.fillStyle = draw.color;
					ctx.beginPath();
					ctx.moveTo(0,-7);
					ctx.lineTo(-8,3);
					ctx.lineTo(8,3);
					ctx.lineTo(0,-7);
					ctx.fill();
				ctx.rotate(-Math.PI-draw.ruler.angle);	
				ctx.translate(-25,-25);
				
				draw.ruler180 = canvas.toDataURL();
				draw.ruler180Hotspot = [25,25];
			}
			
			if (draw.drawMode == 'floodFill') {
				ctx.clearRect(0,0,50,50);
				
				ctx.translate(26,25);
				ctx.rotate(-0.25*Math.PI);
				
				ctx.strokeStyle = '#000';
				ctx.fillStyle = '#FFF';	
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(-7,-8);
				ctx.lineTo(7,-8);
				ctx.scale(7/2,1);
				ctx.arc(0,-8,2,Math.PI,2*Math.PI);
				ctx.scale(2/7,1);
				ctx.lineTo(7,8);
				ctx.scale(7/2,1);
				ctx.arc(0,8,2,0,Math.PI);
				ctx.scale(2/7,1);	
				ctx.lineTo(-7,-8);
				ctx.stroke();
				ctx.fill();
				
				var color = draw.fillColor !== 'none' ? draw.fillColor : '#00F';
				
				ctx.strokeStyle = '#000';
				ctx.fillStyle = color;
				ctx.lineWidth = 0.5;
				ctx.beginPath();
				ctx.moveTo(7,-8);
				ctx.scale(7/2,1);
				ctx.arc(0,-8,2,Math.PI,3*Math.PI);
				ctx.scale(2/7,1);
				ctx.fill();
				ctx.stroke();
				
				ctx.fillRect(-7,0,9,5);
				ctx.strokeRect(-7,0,9,5);	
				
				ctx.beginPath();
				ctx.moveTo(0,-4);
				ctx.arc(0,-4,1,0,2*Math.PI);
				ctx.fill();
				ctx.beginPath();
				ctx.moveTo(0,-4);	
				ctx.quadraticCurveTo(20,10,8,-2);
				ctx.stroke();
				
				ctx.strokeStyle = color;
				ctx.beginPath();
				ctx.moveTo(-3,-9);
				ctx.quadraticCurveTo(-6,-17,-15,-3);
				ctx.quadraticCurveTo(-9,-9,-7,-9);
				ctx.closePath();
				ctx.fill();
				ctx.stroke();
				
				ctx.rotate(0.25*Math.PI);
				ctx.translate(-26,-25);
				
				draw.fillCursor = canvas.toDataURL();
				draw.fillCursorHotspot = [
					26-15*Math.sqrt(2)/2-3*Math.sqrt(2)/2,
					25+15*Math.sqrt(2)/2-3*Math.sqrt(2)/2
				];
			}
			
			ctx.clearRect(0,0,50,50);
			ctx.lineCap = 'butt';
			ctx.lineJoin = 'miter';
			drawArrow({ctx:ctx,startX:25,startY:19,finX:25,finY:31,arrowLength:4,color:'#000',lineWidth:5,fillArrow:true,doubleEnded:false,angleBetweenLinesRads:0.5});
			drawArrow({ctx:ctx,startX:25,startY:20,finX:25,finY:31,arrowLength:4,color:'#FFF',lineWidth:3,fillArrow:true,doubleEnded:false,angleBetweenLinesRads:0.5});
			draw.downArrowCursor = canvas.toDataURL();
			draw.downArrowCursorHotspot = [25,31];
			
			ctx.clearRect(0,0,50,50);
			drawArrow({ctx:ctx,startX:19,startY:25,finX:31,finY:25,arrowLength:4,color:'#000',lineWidth:5,fillArrow:true,doubleEnded:false,angleBetweenLinesRads:0.5});
			drawArrow({ctx:ctx,startX:20,startY:25,finX:30,finY:25,arrowLength:4,color:'#FFF',lineWidth:3,fillArrow:true,doubleEnded:false,angleBetweenLinesRads:0.5});
			draw.rightArrowCursor = canvas.toDataURL();
			draw.rightArrowCursorHotspot = [31,25];
			
			ctx.clearRect(0,0,50,50);
			drawArrow({ctx:ctx,startX:25-6/Math.sqrt(2),startY:25+6/Math.sqrt(2),finX:25+6/Math.sqrt(2),finY:25-6/Math.sqrt(2),arrowLength:4,color:'#000',lineWidth:5,fillArrow:true,doubleEnded:false,angleBetweenLinesRads:0.5});
			drawArrow({ctx:ctx,startX:25-6/Math.sqrt(2),startY:25+6/Math.sqrt(2),finX:25+6/Math.sqrt(2),finY:25-6/Math.sqrt(2),arrowLength:4,color:'#FFF',lineWidth:3,fillArrow:true,doubleEnded:false,angleBetweenLinesRads:0.5});			
			draw.upRightArrowCursor = canvas.toDataURL();
			draw.upRightArrowCursorHotspot = [25+6/Math.sqrt(2),25-6/Math.sqrt(2)];			
			
			this.pen = 'url("'+draw.penCursor+'") '+draw.penCursorHotspot[0]+' '+draw.penCursorHotspot[1]+', auto';
			this.cross = 'url("'+draw.lineCursor+'") '+draw.lineCursorHotspot[0]+' '+draw.lineCursorHotspot[1]+' auto';
			this.rulerPen1 = 'url("'+draw.rulerEdgeCursor1+'") '+draw.rulerEdgeCursorHotspot1[0]+' '+draw.rulerEdgeCursorHotspot1[1]+', auto';
			this.rulerPen2 = 'url("'+draw.rulerEdgeCursor2+'") '+draw.rulerEdgeCursorHotspot2[0]+' '+draw.rulerEdgeCursorHotspot2[1]+', auto';
			this.ruler180 = 'url("'+draw.ruler180+'") '+draw.ruler180Hotspot[0]+' '+draw.ruler180Hotspot[1]+', auto';
			this.fill = 'url("'+draw.fillCursor+'") '+draw.fillCursorHotspot[0]+' '+draw.fillCursorHotspot[1]+', auto';
			this.downArrow = 'url("'+draw.downArrowCursor+'") '+draw.downArrowCursorHotspot[0]+' '+draw.downArrowCursorHotspot[1]+', auto';
			this.rightArrow = 'url("'+draw.rightArrowCursor+'") '+draw.rightArrowCursorHotspot[0]+' '+draw.rightArrowCursorHotspot[1]+', auto';
			this.upRightArrow = 'url("'+draw.upRightArrowCursor+'") '+draw.upRightArrowCursorHotspot[0]+' '+draw.upRightArrowCursorHotspot[1]+', auto';			
		}
	}
	if (typeof object.protractor == 'object') {
		var buttonPos = object.protractor.buttonPos || [1120,620];
		var protractorButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		protractorButton.type = 'protractor';
		protractorButton.draw = function() {
			var color = draw.buttonColor;
			if (draw.protractorVisible == true) color = draw.buttonSelectedColor;
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',color);
			this.ctx.lineWidth = 1;
			this.ctx.strokeStyle = '#000';
			this.ctx.beginPath();
			this.ctx.moveTo(46.5,35.5);
			this.ctx.lineTo(46.5,37.5);
			this.ctx.lineTo(8.5,37.5);		
			this.ctx.lineTo(8.5,34.5);
			this.ctx.arc(27.5,34.5,19,Math.PI,2*Math.PI);
			this.ctx.stroke();	
			if (draw.protractorVisible == false) {
				this.ctx.fillStyle = '#CCF';
				this.ctx.fill();
				for (var i = 0; i < 7; i++) {
					this.ctx.moveTo(27.5+4*Math.cos((1+i/6)*Math.PI),34.5+4*Math.sin((1+i/6)*Math.PI));
					this.ctx.lineTo(27.5+16*Math.cos((1+i/6)*Math.PI),34.5+16*Math.sin((1+i/6)*Math.PI))
				}
				this.ctx.stroke();
				this.ctx.beginPath();
				this.ctx.arc(27.5,34.5,15,Math.PI,2*Math.PI);
				for (var i = 0; i < 19; i++) {
					this.ctx.moveTo(27.5+17*Math.cos((1+i/18)*Math.PI),34.5+17*Math.sin((1+i/18)*Math.PI));
					this.ctx.lineTo(27.5+19*Math.cos((1+i/18)*Math.PI),34.5+19*Math.sin((1+i/18)*Math.PI))
				}
				this.ctx.moveTo(27.5,34.5);
				this.ctx.lineTo(27.5,30.5);
				this.ctx.moveTo(23.5,34.5);
				this.ctx.lineTo(31.5,34.5);		
				this.ctx.stroke();
			}			
		}
		protractorButton.click = function() {
			draw.protractorVisible = !draw.protractorVisible;
			moveToolToFront('protractor');			
		}
		draw.buttons.push(protractorButton);
		draw.protractor = {
			center:object.protractor.center || [600,500],
			startCenter:object.protractor.center || [600,500],
			radius:object.protractor.radius || 250,
			startRadius:object.protractor.radius || 250,			
			angle:0,
			color:object.protractor.color || '#CCF',
		}
	}
	if (typeof object.ruler == 'object') {
		var buttonPos = object.ruler.buttonPos || [1120,620];
		var rulerButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		var markings = boolean(object.ruler.markings,true);
		rulerButton.type = 'ruler';
		rulerButton.draw = function() {
			var color = draw.buttonColor;
			if (draw.rulerVisible == true) color = draw.buttonSelectedColor;
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',color);
			if (draw.rulerVisible == true) {
				roundedRect(this.ctx,7.5,22.5,40,10,3,1,'#000');
			} else {
				roundedRect(this.ctx,7.5,22.5,40,10,3,1,'#000','#CCF');
				if (draw.ruler.markings == true) {
					this.ctx.lineWidth = 1;
					this.ctx.strokeStyle = '#000';
					this.ctx.beginPath();
					for (var i = 0; i < 11; i++) {
						this.ctx.moveTo(9.5+i*(36/10),22.5);
						this.ctx.lineTo(9.5+i*(36/10),26.5);				
					}
					this.ctx.stroke();
				}
			}			
		}
		rulerButton.click = function() {
			draw.rulerVisible = !draw.rulerVisible;
			moveToolToFront('ruler');			
		}		
		draw.buttons.push(rulerButton);
		draw.ruler = {
			left:object.ruler.left || 200,
			startLeft:object.ruler.left || 200,
			top:object.ruler.top || 300,
			startTop:object.ruler.top || 300,
			length:object.ruler.length || 800,
			width:object.ruler.length / 8 || 100,
			angle:0,
			color:object.ruler.color || '#CCF',
			transparent:boolean(object.ruler.transparent,true),
			markings:markings
		}
		recalcRulerValues();
	}
	if (typeof object.compass == 'object') {
		var buttonPos = object.compass.buttonPos || [1120,620];
		var compassButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		compassButton.type = 'compass';
		compassButton.draw = function() {
			var color = draw.buttonColor;
			if (draw.compassVisible == true) color = draw.buttonSelectedColor;
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',color);
			ctx.lineWidth = 1;
			ctx.strokeStyle = '#000';

			var center1 = [13,45];
			var center2 = [26,15];
			var center3 = [40,45];
			var armLength = Math.sqrt(Math.pow(0.5*(center3[0]-center1[0]),2)+Math.pow(center2[1]-center1[1],2));

			var angle2 = -0.5 * Math.PI - Math.atan((center2[1]-center1[1])/(center2[0]-center1[0]));
			var angle3 = 0.5 * Math.PI - Math.atan((center3[1]-center2[1])/(center3[0]-center2[0]));
			
			// draw pointy arm
			this.ctx.translate(center2[0],center2[1]);
			this.ctx.rotate(-angle2);
			
			if (draw.compassVisible) {
				roundedRect(this.ctx,-2,0,4,armLength-5,1,1,'#000');
			} else {
				roundedRect(this.ctx,-2,0,4,armLength-5,1,1,'#000','#99F');		
			}
			this.ctx.strokeStyle = '#000';
			this.ctx.lineWidth = 0.5;
			this.ctx.beginPath();
			this.ctx.moveTo(-1,armLength-5);
			this.ctx.lineTo(0,armLength);
			this.ctx.lineTo(1,armLength-5);
			this.ctx.lineTo(-1,armLength-5);
			this.ctx.stroke();
			if (draw.compassVisible) {
				this.ctx.fillStyle = '#333';
				this.ctx.fill();	
			}
				
			this.ctx.rotate(angle2);
			this.ctx.translate(-center2[0],-center2[1]);

			//draw pencil
			this.ctx.beginPath();
			this.ctx.strokeStyle = '#000';
			this.ctx.lineWidth = 1;
			this.ctx.moveTo(40,45);
			this.ctx.lineTo(38,42);
			this.ctx.lineTo(38,25);
			this.ctx.lineTo(42,25);	
			this.ctx.lineTo(42,42);
			this.ctx.lineTo(40,45);
			if (!draw.compassVisible) {
				if (draw.color == '#000') {
					this.ctx.fillStyle = '#FC3';
				} else {
					this.ctx.fillStyle = draw.color;			
				}
				this.ctx.fill();	
			}
			this.ctx.stroke();
			this.ctx.beginPath();
			this.ctx.moveTo(40,45);
			this.ctx.lineTo(38,42);
			this.ctx.lineTo(42,42);
			this.ctx.lineTo(40,45);
			if (!draw.compassVisible) {
				this.ctx.fillStyle = '#FFC';
				this.ctx.fill();	
			}
			this.ctx.stroke();
			this.ctx.beginPath();
			if (draw.color == '#000') {
				this.ctx.fillStyle = '#FC3';
			} else {
				this.ctx.fillStyle = draw.color;			
			}
			this.ctx.moveTo(40,45);
			this.ctx.lineTo(39.5,44.3);
			this.ctx.lineTo(40.5,45.7);
			this.ctx.lineTo(40,45);
			this.ctx.fill();
			this.ctx.stroke();
				
			this.ctx.strokeRect(44,15+armLength*0.5,1,5);		
				
			// draw pencil arm
			this.ctx.translate(center2[0],center2[1]);
			this.ctx.rotate(-angle3);
			
			var pAngle = Math.PI/14;
			
			this.ctx.beginPath();
			this.ctx.moveTo(-2,0);
			this.ctx.lineTo(2,0);
			this.ctx.lineTo(2,armLength*0.7);
			this.ctx.lineTo(6,armLength*0.7);
			this.ctx.lineTo(6,armLength*0.7+4);
			this.ctx.lineTo(-2,armLength*0.7);
			this.ctx.lineTo(-2,0);
			this.ctx.stroke();
			if (!draw.compassVisible) {
				this.ctx.fillStyle = '#99F';
				this.ctx.fill();	
			}
			
			if (!draw.compassVisible) {
				this.ctx.fillRect(6.5,armLength*0.5-0.5,1,5);		
			}
				
			this.ctx.rotate(angle3);
			this.ctx.translate(-center2[0],-center2[1]);	
			
			// draw top of compass
			this.ctx.translate(center2[0],center2[1]);
			
			roundedRect(this.ctx,-2.5,-3,5,7,1,1,'#000','#000');
			roundedRect(this.ctx,-1,-6,2,3,0,1,'#000','#000');	
			this.ctx.fillStyle = '#CCC';
			this.ctx.beginPath();
			this.ctx.arc(0,0,1,0,2*Math.PI);
			this.ctx.fill();

			this.ctx.translate(-center2[0],-center2[1]);			
		}
		compassButton.click = function() {
			draw.compassVisible = !draw.compassVisible;
			moveToolToFront('compass');	
		}		
		draw.buttons.push(compassButton);
		draw.compassButton = compassButton;
		//console.log(compassButton);
		var center1 = object.compass.center1 || [500,450];
		var radius = object.compass.radius || 150;
		var armLength = object.compass.armLength || 250;
		var angle = object.compass.angle || 0;
		var h = Math.sqrt(Math.pow(armLength,2)-Math.pow(0.5*radius,2));
		var center2 = [center1[0]+0.5*radius*Math.cos(angle)+h*Math.sin(angle),center1[1]+0.5*radius*Math.sin(angle)-h*Math.cos(angle)];
		var center3 = [center1[0]+radius*Math.cos(angle),center1[1]+radius*Math.sin(angle)];

		var angle2 = (angle%(2*Math.PI));
		if (angle2 < 0) angle2 += 2*Math.PI;
		if (angle2 > 0.5 * Math.PI && angle2 < 1.5 * Math.PI) {
			var drawOn = 'left';	
		} else {
			var drawOn = 'right';
		}	
		
		var mp1 = midpoint(center1[0],center1[1],center3[0],center3[1]);
		var mp2 = midpoint(center2[0],center2[1],mp1[0],mp1[1]);

		draw.compass = {
			center1:center1.slice(0),
			startCenter1:center1.slice(0),
			center2:center2.slice(0),
			startCenter2:center2.slice(0),
			center3:center3.slice(0),
			startCenter3:center3.slice(0),
			radius:radius,
			startRadius:radius,
			h:h,
			startH:h,
			armLength:armLength,
			radiusLocked:false,
			angle:angle,
			startAngle:angle,
			drawOn:drawOn,
			startDrawOn:drawOn,
			lockCenter:mp2.slice(0),
			mode:'none',
		}
		recalcCompassValues();
	}
	if (typeof object.undo == 'object') {
		var buttonPos = object.undo.buttonPos || [1120,620];
		var undoButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		undoButton.type = 'undo';
		undoButton.draw = function() {
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',draw.buttonColor);

			this.ctx.strokeStyle = '#000';
			this.ctx.lineCap = 'round';
			this.ctx.lineJoin = 'round';

			this.ctx.lineWidth = 4;
			this.ctx.beginPath();
			this.ctx.arc(27.5,27.5,12,-Math.PI,0.7*Math.PI);
			this.ctx.moveTo(13.5,27.5);
			this.ctx.lineTo(13.5-10*Math.sin(1*Math.PI),27.5+10*Math.cos(1*Math.PI));
			this.ctx.lineTo(13.5-10*Math.cos(0.95*Math.PI),27.5-10*Math.sin(0.95*Math.PI));
			this.ctx.lineTo(13.5,27.5);		
			this.ctx.stroke();			
		}
		undoButton.click = function() {
			draw.path.pop();
			drawCanvasPaths();				
		}		
		draw.buttons.push(undoButton);
	}
	if (typeof object.undoPen == 'object') {
		var buttonPos = object.undoPen.buttonPos || [1120,620];
		var undoButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		undoButton.type = 'undoPen';
		undoButton.draw = function() {
			var s = draw.buttonSize;
			roundedRect(this.ctx,3,3,s-6,s-6,8,6,'#000',draw.buttonColor);
			
			this.ctx.strokeStyle = '#000';
			this.ctx.lineCap = 'round';
			this.ctx.lineJoin = 'round';
			this.ctx.lineWidth = 4;
			this.ctx.beginPath();
			this.ctx.arc(s/2,s/2,12*s/55,-Math.PI,0.7*Math.PI);
			this.ctx.moveTo(13.5*s/55,27.5*s/55);
			this.ctx.lineTo(13.5*s/55-10*s/55*Math.sin(1*Math.PI),27.5*s/55+10*s/55*Math.cos(1*Math.PI));
			this.ctx.lineTo(13.5*s/55-10*s/55*Math.cos(0.95*Math.PI),27.5*s/55-10*s/55*Math.sin(0.95*Math.PI));
			this.ctx.lineTo(13.5*s/55,27.5*s/55);		
			this.ctx.stroke();			
		}
		undoButton.click = function() {
			for (var i = draw.path.length - 1; i >= 0; i--) {
				if (typeof draw.path[i].obj == 'object') {
					for (var j = draw.path[i].obj.length - 1; j >= 0; j--) {
						if (draw.path[i].obj[j].type = 'pen') {
							draw.path[i].obj.splice(j,1);
							if (draw.path[i].obj.length == 0) draw.path.splice(i,1);
							drawCanvasPaths();
							return;
						}
					}					
				}
			}
		}		
		draw.buttons.push(undoButton);
	}
	if (typeof object.clear == 'object') {
		var buttonPos = object.clear.buttonPos || [1120,620];
		var clearButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		clearButton.type = 'clear';
		clearButton.draw = function() {
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',draw.buttonColor);

			this.ctx.strokeStyle = '#000';
			this.ctx.lineCap = 'round';
			this.ctx.lineJoin = 'round';

			this.ctx.lineWidth = 4;
			text({context:this.ctx,left:0,width:55,top:15,textArray:['<<font:Arial>><<fontSize:20>><<align:center>>CLR']});			
		}
		clearButton.click = function() {
			clearDrawPaths();
			resetDrawTools();			
		}			
		draw.buttons.push(clearButton);
	}
	if (typeof object.clearPen == 'object') {
		var buttonPos = object.clearPen.buttonPos || [1120,620];
		var clearButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		clearButton.type = 'clearPen';
		clearButton.draw = function() {
			var s = draw.buttonSize;
			roundedRect(this.ctx,3,3,s-6,s-6,8,6,'#000',draw.buttonColor);
			text({context:this.ctx,left:0,width:s,top:15*s/55,textArray:['<<font:Arial>><<fontSize:'+20*s/55+'>><<align:center>>CLR']});			
		}
		clearButton.click = function() {
			for (var i = draw.path.length - 1; i >= 0; i--) {
				if (draw.path[i].obj.length == 1 && draw.path[i].obj[0].type == 'pen') {
					removePathObject(i);
				}
			}
			drawCanvasPaths();			
		}			
		draw.buttons.push(clearButton);
	}	
	if (typeof object.compassHelp == 'object') {
		var compassHelpImage = new Image();
		compassHelpImage.src = '/i/images/compassInstructions.PNG';
		var buttonPos = object.compassHelp.buttonPos || [1120,620];
		var compassHelpButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		compassHelpButton.type = 'compassHelp';
		compassHelpButton.draw = function() {
			var color = draw.buttonColor;
			if (draw.compassHelpVisible == true) color = draw.buttonSelectedColor;
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',color);
			this.ctx.strokeStyle = '#000';
			this.ctx.fillStyle = '#666';
			this.ctx.font = '42px Arial';
			this.ctx.textAlign = 'center';
			this.ctx.textBaseline = 'middle';
			this.ctx.fillText('?',27.5,27.5);
			this.ctx.strokeText('?',27.5,27.5);			
		}
		compassHelpButton.click = function() {
			draw.compassHelpVisible = !draw.compassHelpVisible;
			if (draw.compassHelpVisible) {
				showObj(draw.compassHelpBox,draw.compassHelpBox.data);			
			} else {
				hideObj(draw.compassHelpBox,draw.compassHelpBox.data);			
			}			
		}			
		compassHelpButton.isStaticMenuCanvas = true;		
		draw.buttons.push(compassHelpButton);
		var helpBoxPos = object.compassHelp.helpBoxPos || [600,110];
		var compassHelpBox = createCanvas(helpBoxPos[0],helpBoxPos[1],500,420,false,false,true,draw.drawButtonZIndex);		
		compassHelpBox.isStaticMenuCanvas = true;
		roundedRect(compassHelpBox.getContext('2d'),5,5,490,410,15,4,'#000','#FFC');
		compassHelpImage.onload = function() {
			compassHelpBox.getContext('2d').drawImage(compassHelpImage,15,15,compassHelpImage.naturalWidth*0.93,compassHelpImage.naturalHeight*0.93);
		}
		addListener(compassHelpBox,function() {
			draw.compassHelpVisible = false;
			hideObj(draw.compassHelpBox,draw.compassHelpBox.data);
			redrawButtons();			
		});
		draw.compassHelpBox = compassHelpBox;
	}
	if (typeof object.pen == 'object') {
		var buttonPos = object.pen.buttonPos || [1120,620];
		var penButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		penButton.type = 'pen';
		penButton.draw = function() {
			if (draw.drawMode !== 'pen') {
				var color = draw.buttonColor;
				this.style.cursor = draw.cursors.pointer;
			} else {
				var color = draw.buttonSelectedColor;
				this.style.cursor = draw.cursors.pen;
			}
			
			var s = draw.buttonSize;
			roundedRect(this.ctx,3,3,s-6,s-6,8,6,'#000',draw.buttonColor);

			this.ctx.fillStyle = draw.color;
			this.ctx.lineCap = 'round';
			this.ctx.lineJoin = 'round';	

			this.ctx.translate(s/2,s/2);
			this.ctx.rotate(Math.PI/4);
				this.ctx.fillRect(-5,-11,10,20);
				this.ctx.fillRect(-5,-18,10,5);
				this.ctx.beginPath();
				this.ctx.moveTo(-5,11);
				this.ctx.lineTo(0,18);
				this.ctx.lineTo(5,11);
				this.ctx.lineTo(-5,11);
				this.ctx.fill();		
			this.ctx.rotate(-Math.PI/4);
			this.ctx.translate(-s/2,-s/2);				
		}
		penButton.click = function() {
			changeDrawMode('pen');			
		}		
		draw.buttons.push(penButton);
	}
	if (typeof object.line == 'object') {
		var buttonPos = object.line.buttonPos || [1120,620];
		var lineButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		lineButton.type = 'line';
		lineButton.draw = function() {
			if (draw.drawMode !== 'line') {
				var color = draw.buttonColor;
				this.style.cursor = draw.cursors.pointer;
			} else {
				var color = draw.buttonSelectedColor;
				this.style.cursor = 'url('+draw.lineCursor+') '+draw.lineCursorHotspot[0]+' '+draw.lineCursorHotspot[1]+', auto';
			}
			
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',color);
			
			this.ctx.strokeStyle = draw.color;
			this.ctx.lineCap = 'round';
			this.ctx.lineJoin = 'round';

			this.ctx.lineWidth = draw.thickness + 1;
			this.ctx.beginPath();
			this.ctx.arc(12,20,2,0,2*Math.PI);
			this.ctx.stroke();	
			this.ctx.lineWidth = draw.thickness;;
			this.ctx.beginPath();
			this.ctx.moveTo(12,20);
			this.ctx.lineTo(43,35);
			this.ctx.stroke();	
			this.ctx.lineWidth = draw.thickness + 1;
			this.ctx.beginPath();	
			this.ctx.arc(43,35,2,0,2*Math.PI);
			this.ctx.stroke();			
		}
		lineButton.click = function() {
			changeDrawMode('line');			
		}		
		draw.buttons.push(lineButton);
	}
	if (typeof object.curve == 'object') {
		var buttonPos = object.curve.buttonPos || [1120,620];
		var curveButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		curveButton.type = 'curve';
		curveButton.draw = function() {
			var color = draw.buttonColor;
			this.style.cursor = draw.cursors.pointer;
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',color);
			this.ctx.strokeStyle = draw.color;
			this.ctx.lineCap = 'round';
			this.ctx.lineJoin = 'round';

			this.ctx.lineWidth = draw.thickness + 1;
			this.ctx.beginPath();
			this.ctx.moveTo(10,20);
			this.ctx.quadraticCurveTo(27.5,55,45,20);
			this.ctx.stroke();				
		}
		curveButton.click = function() {
			draw.curve.add();
		}		
		draw.buttons.push(curveButton);
	}
	if (typeof object.curve2 == 'object') {
		var buttonPos = object.curve2.buttonPos || [1120,620];
		var curveButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		curveButton.type = 'curve2';
		curveButton.draw = function() {
			var color = draw.buttonColor;
			this.style.cursor = draw.cursors.pointer;
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',color);
			this.ctx.strokeStyle = draw.color;
			this.ctx.lineCap = 'round';
			this.ctx.lineJoin = 'round';

			this.ctx.lineWidth = draw.thickness + 1;
			this.ctx.beginPath();
			this.ctx.moveTo(8,20);
			this.ctx.bezierCurveTo(21,55,43,55,47,20);
			this.ctx.stroke();				
		}
		curveButton.click = function() {
			draw.curve2.add();
		}		
		draw.buttons.push(curveButton);
	}	
	if (typeof object.angle == 'object') {
		var buttonPos = object.angle.buttonPos || [1120,620];
		var angleButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		angleButton.type = 'angle';
		angleButton.draw = function() {
			var color = draw.buttonColor;
			this.style.cursor = draw.cursors.pointer;
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',color);
			this.ctx.strokeStyle = draw.color;
			this.ctx.lineCap = 'round';
			this.ctx.lineJoin = 'round';
			drawAngle({ctx:this.ctx,a:[30,11.2],b:[10,40],c:[45,40],fill:false,radius:35,drawLines:true,lineWidth:2});	
		}
		angleButton.click = function() {
			draw.angle.add();
		}		
		draw.buttons.push(angleButton);
	}
	if (typeof object.angle2 == 'object') {
		var buttonPos = object.angle2.buttonPos || [1120,620];
		var angleButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		angleButton.type = 'angle';
		angleButton.draw = function() {
			var color = draw.buttonColor;
			this.style.cursor = draw.cursors.pointer;
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',color);
			this.ctx.strokeStyle = draw.color;
			this.ctx.lineCap = 'round';
			this.ctx.lineJoin = 'round';
			drawAngle({ctx:this.ctx,a:[30,15],b:[10,40],c:[45,40],fill:true,radius:20,drawLines:true,lineWidth:2});	
		}
		angleButton.click = function() {
			draw.angle.add2();
		}		
		draw.buttons.push(angleButton);
	}
	if (typeof object.anglesAroundPoint == 'object') {
		var buttonPos = object.anglesAroundPoint.buttonPos || [1120,620];
		var anglesAroundPointButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		anglesAroundPointButton.type = 'anglesAroundPoint';
		anglesAroundPointButton.draw = function() {
			var color = draw.buttonColor;
			this.style.cursor = draw.cursors.pointer;
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',color);
			this.ctx.strokeStyle = draw.color;
			this.ctx.lineCap = 'round';
			this.ctx.lineJoin = 'round';
			drawAnglesAroundPoint({
				ctx:this.ctx,
				center:[27.5,35],
				points:[[10,35],[33,18],[45,35]],
				lineColor:'#000',
				thickness:2,
				angles:[
					{fill:true,fillColor:"#CFC",lineWidth:2,labelFontSize:25,labelMeasure:false,labelRadius:33,radius:10},
					{fill:true,fillColor:"#FCC",lineWidth:2,labelFontSize:25,labelMeasure:false,labelRadius:33,radius:10}
				]
			})
		};	
		anglesAroundPointButton.click = function() {
			draw.anglesAroundPoint.add();
		}		
		draw.buttons.push(anglesAroundPointButton);
	}	
	if (typeof object.lineEnds == 'object') {
		var buttonPos = object.lineEnds.buttonPos || [1120,620];
		var lineEndsButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		lineEndsButton.type = 'lineEnds';
		lineEndsButton.draw = function() {
			if (draw.drawMode !== 'lineEnds') {
				var color = draw.buttonColor;
				this.style.cursor = draw.cursors.pointer;
			} else {
				var color = draw.buttonSelectedColor;
				this.style.cursor = 'url('+draw.lineCursor+') '+draw.lineCursorHotspot[0]+' '+draw.lineCursorHotspot[1]+', auto';
			}
			
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',color);
			this.ctx.lineCap = 'round';
			this.ctx.lineJoin = 'round';	
			drawArrow({context:this.ctx,startX:10,startY:27.5,finX:45,finY:27.5,arrowLength:12,color:'#000',lineWidth:2,arrowLineWidth:3});			
		}
		lineEndsButton.click = function() {
			draw.lineEndsVisible = !draw.lineEndsVisible;
			if (draw.lineEndsVisible == true) {
				for (var i = 0; i < draw.lineEndStartButtons.length; i++) {
					showObj(draw.lineEndStartButtons[i],draw.lineEndStartButtons[i].data)
				}
				for (var i = 0; i < draw.lineEndMidButtons.length; i++) {
					showObj(draw.lineEndMidButtons[i],draw.lineEndMidButtons[i].data)
				}
				for (var i = 0; i < draw.lineEndFinButtons.length; i++) {
					showObj(draw.lineEndFinButtons[i],draw.lineEndFinButtons[i].data)
				}
				for (var i = 0; i < draw.lineEndSizeButtons.length; i++) {
					showObj(draw.lineEndSizeButtons[i],draw.lineEndSizeButtons[i].data)
				}				
				for (var i = 0; i < container.childNodes.length; i++) {
					if (draw.lineEndStartButtons.indexOf(container.childNodes[i]) == -1 && draw.lineEndMidButtons.indexOf(container.childNodes[i]) == -1 && draw.lineEndFinButtons.indexOf(container.childNodes[i]) == -1 && draw.lineEndSizeButtons.indexOf(container.childNodes[i]) == -1) {
						addListenerStart(container.childNodes[i],lineEndsClose);
					}
				}				
			} else {
				for (var i = 0; i < draw.lineEndStartButtons.length; i++) {
					hideObj(draw.lineEndStartButtons[i],draw.lineEndStartButtons[i].data)
				}
				for (var i = 0; i < draw.lineEndMidButtons.length; i++) {
					hideObj(draw.lineEndMidButtons[i],draw.lineEndMidButtons[i].data)
				}
				for (var i = 0; i < draw.lineEndFinButtons.length; i++) {
					hideObj(draw.lineEndFinButtons[i],draw.lineEndFinButtons[i].data)
				}
				for (var i = 0; i < draw.lineEndSizeButtons.length; i++) {
					hideObj(draw.lineEndSizeButtons[i],draw.lineEndSizeButtons[i].data)
				}				
				for (var i = 0; i < container.childNodes.length; i++) {
					if (draw.lineEndStartButtons.indexOf(container.childNodes[i]) == -1 && draw.lineEndMidButtons.indexOf(container.childNodes[i]) == -1 && draw.lineEndFinButtons.indexOf(container.childNodes[i]) == -1 && draw.lineEndSizeButtons.indexOf(container.childNodes[i]) == -1) {
						removeListenerStart(container.childNodes[i],lineEndsClose);
					}
				}								
			}			
		}			
		draw.buttons.push(lineEndsButton);
		var left = buttonPos[0];
		var top = buttonPos[1]+53;		
		var lineEndsBackButton = createCanvas(left,top,120,220,false,false,false,draw.drawButtonZIndex);
		lineEndsBackButton.isStaticMenuCanvas = true;		
		roundedRect(lineEndsBackButton.getContext('2d'),3,3,114,214,8,6,'#000',draw.buttonColor);
		draw.lineEndsBackButton = lineEndsBackButton;
		
		var lineEndStarts = ['none','open','closed'];
		var lineEndMids = ['none','dash','dash2','open','open2'];
		var lineEndFins = ['none','open','closed'];
		
		for (var i = 0; i < lineEndStarts.length; i++) {
			var left2 = left;
			var top2 = top + 48 * i;	
			var lineEndsButton = createCanvas(left2,top2,50,50,false,false,true,draw.drawButtonZIndex);
			lineEndsButton.isStaticMenuCanvas = true;		
			lineEndsButton.styling = lineEndStarts[i];
			lineEndsButton.draw = function() {
				var ctx = this.ctx;
				roundedRect(ctx,2,2,46,46,4,2,'#000','#CFF');
				ctx.lineWidth = 2;
				ctx.strokeStyle = '#000';
				ctx.lineCap = 'round';
				ctx.lineJoin = 'round';
				ctx.beginPath();
				ctx.moveTo(20,25);
				ctx.lineTo(50,25);
				ctx.stroke();
				switch (this.styling) {
					case 'open':
						drawArrow({context:ctx,startX:50,startY:25,finX:20,finY:25,arrowLength:draw.lineEndsSize,color:'#000',lineWidth:2,arrowLineWidth:3});
						break;
					case 'closed':
						drawArrow({context:ctx,startX:50,startY:25,finX:20,finY:25,arrowLength:draw.lineEndsSize,color:'#000',lineWidth:2,arrowLineWidth:3,fillArrow:true});
						break;					
				}
			}
			lineEndsButton.draw();

			addListener(lineEndsButton,function() {
				for (var i = 0; i < draw.path.length; i++) {
					if (draw.path[i].selected == true) {
						for (var j = 0; j < draw.path[i].obj.length; j++) {
							if (['line','curve'].indexOf(draw.path[i].obj[j].type) > -1) {
								draw.path[i].obj[j].endStart = this.styling;
								draw.path[i].obj[j].endStartSize = draw.lineEndsSize;								
							}
						}
					}
				}
				drawCanvasPaths();			
			})
			draw.lineEndStartButtons.push(lineEndsButton);
		}
		
		for (var i = 0; i < lineEndMids.length; i++) {
			var left2 = left + 48;
			var top2 = top + 48 * i;	
			var lineEndsButton = createCanvas(left2,top2,50,50,false,false,true,draw.drawButtonZIndex);
			lineEndsButton.isStaticMenuCanvas = true;	
			lineEndsButton.styling = lineEndMids[i];
			lineEndsButton.draw = function() {
				var ctx = this.ctx;			
				roundedRect(ctx,2,2,46,46,4,2,'#000','#CFF');
				ctx.lineWidth = 2;
				ctx.strokeStyle = '#000';
				ctx.lineCap = 'round';
				ctx.lineJoin = 'round';
				ctx.beginPath();
				ctx.moveTo(10,25);
				ctx.lineTo(40,25);
				ctx.stroke();
				switch (this.styling) {
					case 'dash':
						drawDash(ctx,10,25,40,25,8);
						break;
					case 'dash2':
						drawDoubleDash(ctx,10,25,40,25,8);
						break;
					case 'open':
						drawParallelArrow({context:ctx,startX:10,startY:25,finX:40,finY:25,arrowLength:draw.lineEndsSize,lineWidth:3});
						break;
					case 'open2':
						drawParallelArrow({context:ctx,startX:10,startY:25,finX:40,finY:25,arrowLength:draw.lineEndsSize,lineWidth:3,numOfArrows:2});
						break;
				}
			}
			lineEndsButton.draw();

			addListener(lineEndsButton,function() {
				for (var i = 0; i < draw.path.length; i++) {
					if (draw.path[i].selected == true) {
						for (var j = 0; j < draw.path[i].obj.length; j++) {
							if (['line','curve'].indexOf(draw.path[i].obj[j].type) > -1) {
								draw.path[i].obj[j].endMid = this.styling;
								draw.path[i].obj[j].endMidSize = draw.lineEndsSize;
							}
						}
					}
				}
				drawCanvasPaths();			
			})
			draw.lineEndMidButtons.push(lineEndsButton);
		}		
		
		for (var i = 0; i < lineEndFins.length; i++) {
			var left2 = left + 2 * 48;
			var top2 = top + 48 * i;
			var lineEndsButton = createCanvas(left2,top2,50,50,false,false,true,draw.drawButtonZIndex);
			lineEndsButton.isStaticMenuCanvas = true;	
			lineEndsButton.styling = lineEndFins[i];
			lineEndsButton.draw = function() {
				var ctx = this.ctx;						
				roundedRect(ctx,2,2,46,46,4,2,'#000','#CFF');
				ctx.lineWidth = 2;
				ctx.strokeStyle = '#000';
				ctx.lineCap = 'round';
				ctx.lineJoin = 'round';
				ctx.beginPath();
				ctx.moveTo(0,25);
				ctx.lineTo(30,25);
				ctx.stroke();
				switch (this.styling) {
					case 'open':
						drawArrow({context:ctx,startX:0,startY:25,finX:30,finY:25,arrowLength:draw.lineEndsSize,color:'#000',lineWidth:2,arrowLineWidth:3});
						break;
					case 'closed':
						drawArrow({context:ctx,startX:0,startY:25,finX:30,finY:25,arrowLength:draw.lineEndsSize,color:'#000',lineWidth:2,arrowLineWidth:3,fillArrow:true});
						break;					
				}
			}
			lineEndsButton.draw();
				
			addListener(lineEndsButton,function() {
				for (var i = 0; i < draw.path.length; i++) {
					if (draw.path[i].selected == true) {
						for (var j = 0; j < draw.path[i].obj.length; j++) {
							if (['line','curve'].indexOf(draw.path[i].obj[j].type) > -1) {
								draw.path[i].obj[j].endFin = this.styling;
								draw.path[i].obj[j].endFinSize = draw.lineEndsSize;
							}
						}
					}
				}
				drawCanvasPaths();
			})			
			draw.lineEndFinButtons.push(lineEndsButton);
		}
		
		for (var i = 0; i < 2; i++) {
			var left2 = left + 25 + 48*i;
			var top2 = top + 48*5;
			var lineEndsButton = createCanvas(left2,top2,50,50,false,false,true,draw.drawButtonZIndex);
			lineEndsButton.isStaticMenuCanvas = true;	
			if (i == 0) {
				lineEndsButton.inc = -1;
			} else {
				lineEndsButton.inc = 1;				
			}
			lineEndsButton.draw = function() {
				var ctx = this.ctx;						
				roundedRect(ctx,2,2,46,46,4,2,'#000','#CFF');
				if (this.inc == -1) {
					text({context:ctx,textArray:['<<fontSize:28>>-'],left:0,top:0,width:50,height:50,vertAlign:'middle',textAlign:'center'});
				} else {
					text({context:ctx,textArray:['<<fontSize:28>>+'],left:0,top:0,width:50,height:50,vertAlign:'middle',textAlign:'center'});			
				}
			}
			lineEndsButton.draw();
				
			addListener(lineEndsButton,function() {
				if (this.inc == -1) {
					draw.lineEndsSize--;
				} else {
					draw.lineEndsSize++;
				}
				for (var i = 0; i < draw.path.length; i++) {
					if (draw.path[i].selected == true) {
						for (var j = 0; j < draw.path[i].obj.length; j++) {
							if (['line','curve'].indexOf(draw.path[i].obj[j].type) > -1) {
								draw.path[i].obj[j].endStartSize = draw.lineEndsSize;
								draw.path[i].obj[j].endMidSize = draw.lineEndsSize;
								draw.path[i].obj[j].endFinSize = draw.lineEndsSize;
							}
						}
					}
				}
				for (var i = 0; i < draw.lineEndStartButtons.length; i++) {
					draw.lineEndStartButtons[i].draw();
				}				
				for (var i = 0; i < draw.lineEndMidButtons.length; i++) {
					draw.lineEndMidButtons[i].draw();
				}
				for (var i = 0; i < draw.lineEndFinButtons.length; i++) {
					draw.lineEndFinButtons[i].draw();
				}				
				drawCanvasPaths();
				
			})			
			draw.lineEndSizeButtons.push(lineEndsButton);
		}		
	}
	if (typeof object.table == 'object') {
		var buttonPos = object.table.buttonPos || [1120,620];
		var tableButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		tableButton.type = 'table';
		var dir = object.table.dir || 'below';
		tableButton.menuDir = dir;
		tableButton.draw = function() {
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',draw.buttonColor);
			this.ctx.strokeStyle = '#666';
			this.ctx.lineWidth = 1;
			this.ctx.fillStyle = '#FFF';
			this.ctx.fillRect(10,11,35,33);
			this.ctx.fillStyle = '#CCC';
			this.ctx.fillRect(10,11,35,33/4);
			for (var i = 0; i < 5; i++) {
				this.ctx.moveTo(10,11+i*33/4);
				this.ctx.lineTo(45,11+i*33/4);
			}
			for (var i = 0; i < 4; i++) {
				this.ctx.moveTo(10+i*35/3,11);
				this.ctx.lineTo(10+i*35/3,44);
			}
			this.ctx.stroke();
			this.ctx.lineWidth = 1;
			this.ctx.strokeStyle = '#000';
			this.ctx.strokeRect(10,11,35,33);			
		}
		tableButton.click = function() {
			draw.tableSizeVisible = !draw.tableSizeVisible;
			if (draw.tableSizeVisible == true) {
				changeDrawMode('table');
				showObj(draw.tableSizeCanvas,draw.tableSizeCanvas.data);
			} else {
				changeDrawMode();
				hideObj(draw.tableSizeCanvas,draw.tableSizeCanvas.data);
			}
			draw.tableSize.rows = 0;
			if (draw.tableSizeCanvasDir == 'above') draw.tableSize.rows = 9;
			draw.tableSize.cols = 0;
			draw.tableSizeCanvas.draw();			
		}		
		draw.buttons.push(tableButton);

		var rows = object.table.rows || 10;
		var cols = object.table.cols || 10;

		if (dir == 'below') {
			var left = buttonPos[0];
			var top = buttonPos[1]+53;
		} else if (dir == 'above') {
			var left = buttonPos[0];
			var top = buttonPos[1]-(rows*25+40);
		}
		var tableSizeCanvas = createCanvas(left,top,cols*25+20,rows*25+40,false,false,true,draw.drawButtonZIndex);
		tableSizeCanvas.isStaticMenuCanvas = true;
		draw.tableSizeCanvas = tableSizeCanvas;
		draw.tableSizeCanvas.rows = rows;
		draw.tableSizeCanvas.cols = cols;
		draw.tableSizeCanvasDir = dir;
		draw.tableSize = {rows:9,cols:-1,maxRows:rows-1,maxCols:cols-1};
		
		tableSizeCanvas.draw = function() {
			var ctx = this.ctx;
			roundedRect(ctx,3,3,this.data[102]-6,this.data[103]-6,8,6,'#000',draw.buttonColor);
			for (var i = 0; i < this.rows; i++) {
				for (var j = 0; j < this.cols; j++) {
					if (draw.tableSizeCanvasDir == 'below') {
						if (draw.tableSize.rows >= i && draw.tableSize.cols >= j) {
							roundedRect(ctx,10+25*j,30+25*i,25,25,0,0.01,'#F6F','#F6F');
						} else {
							roundedRect(ctx,10+25*j,30+25*i,25,25,0,0.01,'#FFC','#FFC');
						}
					} else if (draw.tableSizeCanvasDir == 'above') {
						if (draw.tableSize.rows <= i && draw.tableSize.cols >= j) {
							roundedRect(ctx,10+25*j,30+25*i,25,25,0,0.01,'#F6F','#F6F');
						} else {
							roundedRect(ctx,10+25*j,30+25*i,25,25,0,0.01,'#FFC','#FFC');
						}						
					}
				}
			}
			ctx.strokeStyle = '#000';
			ctx.lineWidth = 3;
			ctx.beginPath();
			for (var i = 0; i < rows + 2; i++) {
				ctx.moveTo(10,30+25*i);
				ctx.lineTo(10+cols*25,30+25*i);
			}
			for (var i = 0; i < cols + 2; i++) {
				ctx.moveTo(10+25*i,30);
				ctx.lineTo(10+25*i,30+rows*25);
			}
			ctx.stroke();
			if (draw.tableSizeCanvasDir == 'below') {
				text({context:ctx,textArray:['<<fontSize:14>>'+(draw.tableSize.rows+1)+' x '+(draw.tableSize.cols+1)],left:12,top:5,width:200});
			} else if (draw.tableSizeCanvasDir == 'above') {
				text({context:ctx,textArray:['<<fontSize:14>>'+(10-draw.tableSize.rows)+' x '+(draw.tableSize.cols+1)],left:12,top:5,width:200});
			}
		}
		tableSizeCanvas.draw();
		
		addListenerMove(tableSizeCanvas,function(e) {
			updateMouse(e);
			var col = Math.min(draw.tableSize.maxCols,Math.max(0,Math.floor((mouse.x - e.target.data[100] - 10) / 25))); 
			var row = Math.min(draw.tableSize.maxRows,Math.max(0,Math.floor((mouse.y - e.target.data[101] - 30) / 25)));		
			if (row !== draw.tableSize.rows || col !== draw.tableSize.cols) {
				draw.tableSize.rows = row;
				draw.tableSize.cols = col;
				e.target.draw();
			}
		});
		
		addListener(tableSizeCanvas,function(e) {
			var rows = draw.tableSize.rows+1;
			if (draw.tableSizeCanvasDir == 'above') rows = 10 - draw.tableSize.rows;
			draw.table2.add(rows,draw.tableSize.cols+1);
		});
	}
	if (typeof object.distHoriz == 'object') {
		var buttonPos = object.distHoriz.buttonPos || [1120,620];
		var distHorizButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		distHorizButton.type = 'distHoriz';
		distHorizButton.draw = function() {
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',draw.buttonColor);
			drawArrow({ctx:this.ctx,startX:10,startY:27.5,finX:27.5,finY:27.5,doubleEnded:true,arrowLength:5,fillArrow:true,color:'#393',lineWidth:1});
			drawArrow({ctx:this.ctx,startX:27.5,startY:27.5,finX:45,finY:27.5,doubleEnded:true,arrowLength:5,fillArrow:true,color:'#393',lineWidth:1});
			this.ctx.strokeStyle = '#000';
			this.ctx.lineWidth = 2;
			this.ctx.beginPath();
			this.ctx.moveTo(10,15);
			this.ctx.lineTo(10,40);
			this.ctx.moveTo(27.5,15);
			this.ctx.lineTo(27.5,40);
			this.ctx.moveTo(45,15);
			this.ctx.lineTo(45,40);
			this.ctx.stroke();			
		}
		distHorizButton.click = function() {
			distributeHoriz();
		}			
		draw.buttons.push(distHorizButton);
	}
	if (typeof object.distVert == 'object') {
		var buttonPos = object.distVert.buttonPos || [1120,620];
		var distVertButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		distVertButton.type = 'distVert';
		distVertButton.draw = function() {
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',draw.buttonColor);
			drawArrow({ctx:this.ctx,startY:10,startX:27.5,finY:27.5,finX:27.5,doubleEnded:true,arrowLength:5,fillArrow:true,color:'#393',lineWidth:1});
			drawArrow({ctx:this.ctx,startY:27.5,startX:27.5,finY:45,finX:27.5,doubleEnded:true,arrowLength:5,fillArrow:true,color:'#393',lineWidth:1});
			this.ctx.strokeStyle = '#000';
			this.ctx.lineWidth = 2;
			this.ctx.beginPath();
			this.ctx.moveTo(15,10);
			this.ctx.lineTo(40,10);
			this.ctx.moveTo(15,27.5);
			this.ctx.lineTo(40,27.5);
			this.ctx.moveTo(15,45);
			this.ctx.lineTo(40,45);
			this.ctx.stroke();			
		}
		distVertButton.click = function() {
			distributeVert();
		}				
		draw.buttons.push(distVertButton);
	}
	if (typeof object.tableRowColChange == 'object') {
		var buttonPos = object.tableRowColChange.buttonPos || [1120,620];
		var tableButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		tableButton.type = 'tableRowColChange';
		tableButton.draw = function() {
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',draw.buttonColor);
			this.ctx.strokeStyle = '#666';
			this.ctx.lineWidth = 1;
			this.ctx.fillStyle = '#FFF';
			this.ctx.fillRect(10,11,35,33);
			this.ctx.fillStyle = '#333';
			this.ctx.fillRect(10,11+2*33/4,35,33/4);
			for (var i = 0; i < 5; i++) {
				this.ctx.moveTo(10,11+i*33/4);
				this.ctx.lineTo(45,11+i*33/4);
			}
			for (var i = 0; i < 4; i++) {
				this.ctx.moveTo(10+i*35/3,11);
				this.ctx.lineTo(10+i*35/3,44);
			}
			this.ctx.stroke();
			this.ctx.lineWidth = 1;
			this.ctx.strokeStyle = '#000';
			this.ctx.strokeRect(10,11,35,33);				
		}
		tableButton.click = function() {
			draw.tableChangeVisible = !draw.tableChangeVisible;
			if (draw.tableChangeVisible == true) {
				tableMenuClose();
				changeDrawMode('tableChange');
				draw.tableRowColCanvas.style.zIndex = Number(this.style.zIndex)+1;
				showObj(draw.tableRowColCanvas,draw.tableRowColCanvas.data);
			} else {
				changeDrawMode();
				hideObj(draw.tableRowColCanvas,draw.tableRowColCanvas.data);
			}
			draw.tableRowColCanvas.selected = -1;
			draw.tableRowColCanvas.draw();			
		}		
		draw.buttons.push(tableButton);

		var left = buttonPos[0];
		var top = buttonPos[1]+53;		
		var tableRowColCanvas = createCanvas(left,top,200,260,false,false,true,zIndex+100);
		tableRowColCanvas.isStaticMenuCanvas = true;	
		tableRowColCanvas.selected = -1;
		draw.tableRowColCanvas = tableRowColCanvas;
		draw.tableChangeVisible = false;
		
		tableRowColCanvas.draw = function() {
			var ctx = this.ctx;
			roundedRect(ctx,3,3,this.data[102]-6,this.data[103]-6,8,6,'#000',draw.buttonColor);
			
			for (var i = 0; i < 6; i++) {
				if (draw.tableRowColCanvas.selected == i) {
					roundedRect(ctx,10,10+40*i,180,40,0,0.01,'#F6F','#F6F');
				} else {
					roundedRect(ctx,10,10+40*i,180,40,0,0.01,'#FFC','#FFC');						
				}
			}
			
			ctx.strokeStyle = '#000';
			ctx.lineWidth = 2;
			ctx.beginPath();
			for (var i = 0; i < 7; i++) {
				ctx.moveTo(10,10+40*i);
				ctx.lineTo(190,10+40*i);
			}
			ctx.moveTo(10,10);
			ctx.lineTo(10,250);
			ctx.moveTo(190,10);
			ctx.lineTo(190,250);
			ctx.stroke();
			text({context:ctx,textArray:['<<fontSize:20>>Add rows above'],left:10,top:10,width:180,height:40,vertAlign:'middle',textAlign:'center'});
			text({context:ctx,textArray:['<<fontSize:20>>Add rows below'],left:10,top:50,width:180,height:40,vertAlign:'middle',textAlign:'center'});
			text({context:ctx,textArray:['<<fontSize:20>>Delete rows'],left:10,top:90,width:180,height:40,vertAlign:'middle',textAlign:'center'});
			text({context:ctx,textArray:['<<fontSize:20>>Add columns left'],left:10,top:130,width:180,height:40,vertAlign:'middle',textAlign:'center'});
			text({context:ctx,textArray:['<<fontSize:20>>Add columns right'],left:10,top:170,width:180,height:40,vertAlign:'middle',textAlign:'center'});
			text({context:ctx,textArray:['<<fontSize:20>>Delete columns'],left:10,top:210,width:180,height:40,vertAlign:'middle',textAlign:'center'});
		}
		tableRowColCanvas.draw();
	
		addListenerMove(tableRowColCanvas,function(e) {
			updateMouse(e);
			var sel = Math.floor((mouse.y - e.target.data[101] - 10) / 40);		
			if (mouse.x - e.target.data[100] < 10 || mouse.x - e.target.data[100] > 190) sel = -1;
			if (sel < 0 || sel > 5) sel = -1;
			if (sel !== draw.tableRowColCanvas.selected) {
				draw.tableRowColCanvas.selected = sel;
				e.target.draw();
			}
		});
		
		addListener(tableRowColCanvas,function(e) {
			if (draw.tableRowColCanvas.selected < 0 || draw.tableRowColCanvas.selected > 5) return;
			for (var i = 0; i < draw.path.length; i++) {
				if (draw.path[i].selected == true) {
					for (var j = 0; j < draw.path[i].obj.length; j++) {
						var type = draw.path[i].obj[j].type;
						if (type == 'table' || type == 'table2') {
							var obj = draw.path[i].obj[j];
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
											if (type == 'table') {
												rowHeights.push(cells[r][c].height);
											} else if (type == 'table2') {
												rowHeights.push(obj.heights[r]);
											}
										}
										if (selCols.indexOf(c) == -1) {
											selCols.push(c);
											if (type == 'table') {
												colWidths.push(cells[r][c].width);
											} else if (type == 'table2') {
												colWidths.push(obj.widths[c]);
											}
										}
									}
								}
							}
							if (selRows.length == 0 || selCols.length == 0) continue;
							switch (draw.tableRowColCanvas.selected) {
								case 0: // add rows above
								case 1: // add rows below
									var newRows = [];
									var newHeights = [];
									for (var r = 0; r < selRows.length; r++) {
										var row = clone(cells[selRows[r]]);
										for (var c = 0; c < row.length; c++) {
											var tags = textArrayGetStartTags(row[c].text);
											row[c].text = [tags];
										}
										newRows.push(row);
										newHeights.push(obj.heights[selRows[r]]);
									}
									if (draw.tableRowColCanvas.selected == 0) {
										var newCel = obj.cells.slice(0,selRows[0]).concat(newRows).concat(obj.cells.slice(selRows[0]));
										var newHei = obj.heights.slice(0,selRows[0]).concat(newHeights).concat(obj.heights.slice(selRows[0]));
									} else {
										var newCel = obj.cells.slice(0,selRows[selRows.length-1]+1).concat(newRows).concat(obj.cells.slice(selRows[selRows.length-1]+1));
										var newHei = obj.heights.slice(0,selRows[selRows.length-1]+1).concat(newHeights).concat(obj.heights.slice(selRows[selRows.length-1]+1));
									}
									obj.cells = newCel;
									obj.heights = newHei;
									break;
								case 3: // add cols left
								case 4: // add cols right
									var newWidths = [];								
									for (var r = 0; r < cells.length; r++) {
										var newCells = [];
										for (var c = 0; c < selCols.length; c++) {
											var cell = clone(cells[r][selCols[c]]);
											var tags = textArrayGetStartTags(cell.text);
											cell.text = [tags];
											newCells.push(cell);
											if (r == 0) newWidths.push(obj.widths[selCols[c]]);
										}
										if (draw.tableRowColCanvas.selected == 3) {
											var newRow = obj.cells[r].slice(0,selCols[0]).concat(newCells).concat(obj.cells[r].slice(selCols[0]));
										} else {
											var newRow = obj.cells[r].slice(0,selCols[selCols.length-1]+1).concat(newCells).concat(obj.cells[r].slice(selCols[selCols.length-1]+1));
										}
										obj.cells[r] = newRow;
									}
									if (draw.tableRowColCanvas.selected == 3) {
										obj.widths = obj.widths.slice(0,selCols[0]).concat(newWidths).concat(obj.widths.slice(selCols[0]));
									} else {
										obj.widths = obj.widths.slice(0,selCols[selCols.length-1]+1).concat(newWidths).concat(obj.widths.slice(selCols[selCols.length-1]+1));	
									}
									break;
								case 2: // del rows
									for (var r = selRows.length - 1; r >= 0; r--) {
										cells.splice(selRows[r],1);
										obj.heights.splice(selRows[r],1);
									}
									break;
								case 5: // del cols
									for (var r = 0; r < cells.length; r++) {
										for (var c = selCols.length - 1; c >= 0; c--) {
											cells[r].splice(selCols[c],1);
											if (r == 0) obj.widths.splice(selCols[c],1);
										}
									}			
									break;
							}
							updateBorder(draw.path[i]);
						}
					}
				}
			}
			drawCanvasPaths();
			tableMenuClose();
		});	
		draw.tableRowColChangeButton = tableButton;
	}
	if (typeof object.tableBorders == 'object') {
		var buttonPos = object.tableBorders.buttonPos || [1120,620];
		var tableButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		tableButton.type = 'tableBorders';
		tableButton.draw = function() {
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',draw.buttonColor);
			this.ctx.strokeStyle = '#F00';
			this.ctx.lineWidth = 2;
			this.ctx.fillStyle = '#FFF';
			this.ctx.fillRect(10,11,35,33);
			this.ctx.beginPath();
			for (var i = 1; i < 4; i++) {
				this.ctx.moveTo(10,11+i*33/4);
				this.ctx.lineTo(45,11+i*33/4);
			}
			for (var i = 1; i < 3; i++) {
				this.ctx.moveTo(10+i*35/3,11);
				this.ctx.lineTo(10+i*35/3,44);
			}
			this.ctx.stroke();			
		}
		tableButton.click = function() {
			draw.tableBordersVisible = !draw.tableBordersVisible;
			if (draw.tableBordersVisible == true) {
				tableMenuClose();
				changeDrawMode('tableBorders');
				draw.tableBordersCanvas.style.zIndex = Number(this.style.zIndex)+1;
				showObj(draw.tableBordersCanvas,draw.tableBordersCanvas.data);
			} else {
				changeDrawMode();
				hideObj(draw.tableBordersCanvas,draw.tableBordersCanvas.data);
			}
			draw.tableBordersCanvas.draw();			
		}			
		draw.buttons.push(tableButton);

		var left = buttonPos[0];
		var top = buttonPos[1]+53;		
		var tableBordersCanvas = createCanvas(left,top,400,170,false,false,true,zIndex+100);
		tableBordersCanvas.isStaticMenuCanvas = true;			
		tableBordersCanvas.selected = -1;
		draw.tableBordersCanvas = tableBordersCanvas;
		draw.tableBordersVisible = false;
		
		tableBordersCanvas.colors = ['none','#000','#333','#666','#999','#F00','#00F','#393'];
		tableBordersCanvas.draw = function() {
			var ctx = this.ctx;
			roundedRect(ctx,3,3,this.data[102]-6,this.data[103]-6,8,6,'#000','#FFC');

			text({context:ctx,textArray:['<<fontSize:18>>Outer Border'],left:0,top:10,width:200,height:50,textAlign:'center'});
			text({context:ctx,textArray:['<<fontSize:18>>Inner Border'],left:200,top:10,width:200,height:50,textAlign:'center'});
			ctx.strokeStyle = '#000';
			ctx.lineWidth = 2;
			if (!ctx.setLineDash) {ctx.setLineDash = function () {}}			
			ctx.setLineDash([]);
			ctx.beginPath();
			ctx.moveTo(200,10);
			ctx.lineTo(200,160);
			ctx.stroke();
			
			// draw color buttons
			roundedRect(ctx,10,40,22.5,22.5,0,2,'#000');
			roundedRect(ctx,210,40,22.5,22.5,0,2,'#000');
			ctx.beginPath();
			ctx.strokeStyle = '#000';
			ctx.lineWidth = 2;
			ctx.moveTo(10,40);
			ctx.lineTo(32.5,62.5);
			ctx.moveTo(32.5,40);
			ctx.lineTo(10,62.5);
			ctx.moveTo(210,40);
			ctx.lineTo(232.5,62.5);
			ctx.moveTo(232.5,40);
			ctx.lineTo(210,62.5);			
			ctx.stroke();
			for (var i = 1; i < this.colors.length; i++) {
				roundedRect(ctx,10+22.5*i,40,22.5,22.5,0,2,'#000',this.colors[i]);
				roundedRect(ctx,210+22.5*i,40,22.5,22.5,0,2,'#000',this.colors[i]);
			}

			var innerColor = '#999';
			var innerWeight = 2;
			var innerDash = [5,5];
			var outerColor = '#000';
			var outerWeight = 4;
			var outerDash = [0,0];
			
			for (var i = 0; i < draw.path.length; i++) {
				if (draw.path[i].selected == true) {
					for (var j = 0; j < draw.path[i].obj.length; j++) {
						if (draw.path[i].obj[j].type == 'table' || draw.path[i].obj[j].type == 'table2') {
							innerColor = draw.path[i].obj[j].innerBorder.color;
							if (draw.path[i].obj[j].innerBorder.show == false) innerColor = '#FFC';
							innerWeight = draw.path[i].obj[j].innerBorder.width;
							innerDash = draw.path[i].obj[j].innerBorder.dash;
							if (typeof innerDash !== 'object') innerDash = [0,0];
							if (typeof innerDash[0] !== 'number') innerDash[0] = 0;
							if (typeof innerDash[1] !== 'number') innerDash[1] = 0;
							outerColor = draw.path[i].obj[j].outerBorder.color;
							if (draw.path[i].obj[j].outerBorder.show == false) outerColor = '#FFC';
							outerWeight = draw.path[i].obj[j].outerBorder.width;
							outerDash = draw.path[i].obj[j].outerBorder.dash;
							if (typeof outerDash !== 'object') outerDash = [0,0];
							if (typeof outerDash[0] !== 'number') outerDash[0] = 0;
							if (typeof outerDash[1] !== 'number') outerDash[1] = 0;
						}
					}
				}
			}
			
			ctx.strokeStyle = outerColor;
			ctx.lineWidth = outerWeight;
			ctx.setLineDash(outerDash);
			ctx.beginPath();
			ctx.moveTo(10,80);
			ctx.lineTo(190,80);
			ctx.stroke();
			
			ctx.strokeStyle = innerColor;
			ctx.lineWidth = innerWeight;
			ctx.setLineDash(innerDash);
			ctx.beginPath();
			ctx.moveTo(210,80);
			ctx.lineTo(390,80);
			ctx.stroke();
			
			text({context:ctx,textArray:['<<fontSize:30>>-'],left:10,top:100,width:25,height:25,textAlign:'center',vertAlign:'middle',box:{color:'#FCF',borderWidth:2}});
			text({context:ctx,textArray:['<<fontSize:30>>+'],left:35,top:100,width:25,height:25,textAlign:'center',vertAlign:'middle',box:{color:'#FCF',borderWidth:2}});
			text({context:ctx,textArray:['<<fontSize:16>>width '+outerWeight],left:5,top:130,width:60,height:30,textAlign:'center'});

			text({context:ctx,textArray:['<<fontSize:30>>-'],left:75,top:100,width:25,height:25,textAlign:'center',vertAlign:'middle',box:{color:'#FCF',borderWidth:2}});
			text({context:ctx,textArray:['<<fontSize:30>>+'],left:100,top:100,width:25,height:25,textAlign:'center',vertAlign:'middle',box:{color:'#FCF',borderWidth:2}});
			text({context:ctx,textArray:['<<fontSize:16>>dash '+outerDash[0]],left:70,top:130,width:60,height:30,textAlign:'center'});

			text({context:ctx,textArray:['<<fontSize:30>>-'],left:140,top:100,width:25,height:25,textAlign:'center',vertAlign:'middle',box:{color:'#FCF',borderWidth:2}});
			text({context:ctx,textArray:['<<fontSize:30>>+'],left:165,top:100,width:25,height:25,textAlign:'center',vertAlign:'middle',box:{color:'#FCF',borderWidth:2}});
			text({context:ctx,textArray:['<<fontSize:16>>gap '+outerDash[1]],left:135,top:130,width:60,height:30,textAlign:'center'});
			
			text({context:ctx,textArray:['<<fontSize:30>>-'],left:210,top:100,width:25,height:25,textAlign:'center',vertAlign:'middle',box:{color:'#FCF',borderWidth:2}});
			text({context:ctx,textArray:['<<fontSize:30>>+'],left:235,top:100,width:25,height:25,textAlign:'center',vertAlign:'middle',box:{color:'#FCF',borderWidth:2}});
			text({context:ctx,textArray:['<<fontSize:16>>width '+innerWeight],left:205,top:130,width:60,height:30,textAlign:'center'});

			text({context:ctx,textArray:['<<fontSize:30>>-'],left:275,top:100,width:25,height:25,textAlign:'center',vertAlign:'middle',box:{color:'#FCF',borderWidth:2}});
			text({context:ctx,textArray:['<<fontSize:30>>+'],left:300,top:100,width:25,height:25,textAlign:'center',vertAlign:'middle',box:{color:'#FCF',borderWidth:2}});
			text({context:ctx,textArray:['<<fontSize:16>>dash '+innerDash[0]],left:270,top:130,width:60,height:30,textAlign:'center'});

			text({context:ctx,textArray:['<<fontSize:30>>-'],left:340,top:100,width:25,height:25,textAlign:'center',vertAlign:'middle',box:{color:'#FCF',borderWidth:2}});
			text({context:ctx,textArray:['<<fontSize:30>>+'],left:365,top:100,width:25,height:25,textAlign:'center',vertAlign:'middle',box:{color:'#FCF',borderWidth:2}});
			text({context:ctx,textArray:['<<fontSize:16>>gap '+innerDash[1]],left:335,top:130,width:60,height:30,textAlign:'center'});			
		}
		tableBordersCanvas.draw();
	
		addListenerMove(tableBordersCanvas,function(e) {
			updateMouse(e);
			var l = e.target.data[100];
			var t = e.target.data[101];
			if (mouseHitRect(l+10,t+40,180,22.5) || mouseHitRect(l+210,t+40,180,22.5) || mouseHitRect(l+10,t+100,50,25) || mouseHitRect(l+75,t+100,50,25) || mouseHitRect(l+140,t+100,50,25) || mouseHitRect(l+210,t+100,50,25) || mouseHitRect(l+275,t+100,50,25) || mouseHitRect(l+340,t+100,50,25)) {
				e.target.style.cursor = draw.cursors.pointer;
			} else {
				e.target.style.cursor = draw.cursors.default;
			}
		});
		
		addListener(tableBordersCanvas,function(e) {
			if (e.target.style.cursor == draw.cursors.default) return;
			updateMouse(e);
			var l = e.target.data[100];
			var t = e.target.data[101];

			for (var i = 0; i < draw.path.length; i++) {
				if (draw.path[i].selected == true) {
					for (var j = 0; j < draw.path[i].obj.length; j++) {
						if (draw.path[i].obj[j].type == 'table' || draw.path[i].obj[j].type == 'table2') {			
							if (mouseHitRect(l+10,t+40,180,22.5)) {
								var color = e.target.colors[Math.floor((mouse.x-(l+10))/22.5)];
								if (color == 'none') {
									draw.path[i].obj[j].outerBorder.show = false;
								} else {
									draw.path[i].obj[j].outerBorder.show = true;
									draw.path[i].obj[j].outerBorder.color = color;
								}
							} else if (mouseHitRect(l+210,t+40,180,22.5)) {
								var color = e.target.colors[Math.floor((mouse.x-(l+210))/22.5)];
								if (color == 'none') {
									draw.path[i].obj[j].innerBorder.show = false;
								} else {
									draw.path[i].obj[j].innerBorder.show = true;
									draw.path[i].obj[j].innerBorder.color = color;
								}
							} else if (mouseHitRect(l+10,t+100,25,25)) {
								draw.path[i].obj[j].outerBorder.width = Math.max(1,draw.path[i].obj[j].outerBorder.width-1);
							} else if (mouseHitRect(l+35,t+100,25,25)) {
								draw.path[i].obj[j].outerBorder.width++;
							} else if (mouseHitRect(l+75,t+100,25,25)) {
								if (typeof draw.path[i].obj[j].outerBorder.dash !== 'object') draw.path[i].obj[j].outerBorder.dash = [0,0];
								draw.path[i].obj[j].outerBorder.dash[0] = Math.max(0,draw.path[i].obj[j].outerBorder.dash[0]-1);
							} else if (mouseHitRect(l+100,t+100,25,25)) {
								if (typeof draw.path[i].obj[j].outerBorder.dash !== 'object') draw.path[i].obj[j].outerBorder.dash = [0,0];
								draw.path[i].obj[j].outerBorder.dash[0]++;
							} else if (mouseHitRect(l+140,t+100,25,25)) {
								if (typeof draw.path[i].obj[j].outerBorder.dash !== 'object') draw.path[i].obj[j].outerBorder.dash = [0,0];
								draw.path[i].obj[j].outerBorder.dash[1] = Math.max(0,draw.path[i].obj[j].outerBorder.dash[1]-1);
							} else if (mouseHitRect(l+165,t+100,25,25)) {
								if (typeof draw.path[i].obj[j].outerBorder.dash !== 'object') draw.path[i].obj[j].outerBorder.dash = [0,0];
								draw.path[i].obj[j].outerBorder.dash[1]++;
							} else if (mouseHitRect(l+210,t+100,25,25)) {
								draw.path[i].obj[j].innerBorder.width = Math.max(1,draw.path[i].obj[j].innerBorder.width-1);
							} else if (mouseHitRect(l+235,t+100,25,25)) {
								draw.path[i].obj[j].innerBorder.width++;
							} else if (mouseHitRect(l+275,t+100,25,25)) {
								if (typeof draw.path[i].obj[j].innerBorder.dash !== 'object') draw.path[i].obj[j].innerBorder.dash = [0,0];
								draw.path[i].obj[j].innerBorder.dash[0] = Math.max(0,draw.path[i].obj[j].innerBorder.dash[0]-1);
							} else if (mouseHitRect(l+300,t+100,25,25)) {
								if (typeof draw.path[i].obj[j].innerBorder.dash !== 'object') draw.path[i].obj[j].innerBorder.dash = [0,0];
								draw.path[i].obj[j].innerBorder.dash[0]++;
							} else if (mouseHitRect(l+340,t+100,25,25)) {
								if (typeof draw.path[i].obj[j].innerBorder.dash !== 'object') draw.path[i].obj[j].innerBorder.dash = [0,0];
								draw.path[i].obj[j].innerBorder.dash[1] = Math.max(0,draw.path[i].obj[j].innerBorder.dash[1]-1);
							} else if (mouseHitRect(l+365,t+100,25,25)) {
								if (typeof draw.path[i].obj[j].innerBorder.dash !== 'object') draw.path[i].obj[j].innerBorder.dash = [0,0];
								draw.path[i].obj[j].innerBorder.dash[1]++;
							}
						}
					}
				}
			}
			drawCanvasPaths();
			this.draw();
		});	
		draw.tableBordersButton = tableButton;
	}
	if (typeof object.tableCellColor == 'object') {
		var buttonPos = object.tableCellColor.buttonPos || [1120,620];
		var tableButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		tableButton.type = 'tableCellColor';
		tableButton.draw = function() {
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',draw.buttonColor);
			this.ctx.strokeStyle = '#666';
			this.ctx.lineWidth = 1;
			this.ctx.fillStyle = '#FFF';
			this.ctx.fillRect(10,11,35,33);
			this.ctx.fillStyle = '#393';
			this.ctx.fillRect(10+11*1,11+1*33/4,35/3,33/4);
			this.ctx.beginPath();
			for (var i = 0; i < 5; i++) {
				this.ctx.moveTo(10,11+i*33/4);
				this.ctx.lineTo(45,11+i*33/4);
			}
			for (var i = 0; i < 4; i++) {
				this.ctx.moveTo(10+i*35/3,11);
				this.ctx.lineTo(10+i*35/3,44);
			}
			this.ctx.stroke();
			this.ctx.lineWidth = 1;
			this.ctx.strokeStyle = '#000';
			this.ctx.strokeRect(10,11,35,33);			
		}
		tableButton.click = function() {
			draw.tableCellColorVisible = !draw.tableCellColorVisible;
			if (draw.tableCellColorVisible == true) {
				tableMenuClose();
				changeDrawMode('tableCellColor');
				draw.tableCellColorCanvas.style.zIndex = Number(this.style.zIndex)+1;				
				showObj(draw.tableCellColorCanvas,draw.tableCellColorCanvas.data);
			} else {
				changeDrawMode();
				hideObj(draw.tableCellColorCanvas,draw.tableCellColorCanvas.data);
			}			
		}			
		draw.buttons.push(tableButton);

		var left = buttonPos[0];
		var top = buttonPos[1]+53;		
		var tableCellColorCanvas = createCanvas(left,top,110,110,false,false,true,zIndex+100);
		tableCellColorCanvas.isStaticMenuCanvas = true;					
		draw.tableCellColorCanvas = tableCellColorCanvas;
		draw.tableCellColorsVisible = false;
		
		tableCellColorCanvas.colors = [['none','#000','#333','#666'],['#999','#CCC','#FFF','#FFC',],['#FCF','#CFF','#FCC','#CFC'],['#CCF','#F00','#393','#00F']];
		tableCellColorCanvas.draw = function() {
			var ctx = this.ctx;
			roundedRect(ctx,3,3,this.data[102]-6,this.data[103]-6,8,6,'#000','#FFC');
		
			// draw color buttons
			for (var i = 0; i < this.colors.length; i++) {
				for (var j = 0; j < this.colors[i].length; j++) {
					if (i == 0 && j == 0) {
						roundedRect(ctx,10,10,22.5,22.5,0,2,'#000');
						ctx.beginPath();
						ctx.strokeStyle = '#000';
						ctx.lineWidth = 2;
						ctx.moveTo(10,10);
						ctx.lineTo(32.5,32.5);
						ctx.moveTo(32.5,10);
						ctx.lineTo(10,32.5);			
						ctx.stroke();						
					} else {
						roundedRect(ctx,10+22.5*i,10+22.5*j,22.5,22.5,0,2,'#000',this.colors[j][i]);
						roundedRect(ctx,210+22.5*i,10+22.5*j,22.5,22.5,0,2,'#000',this.colors[j][i]);
					}
				}
			}

		}
		tableCellColorCanvas.draw();
	
		addListenerMove(tableCellColorCanvas,function(e) {
			updateMouse(e);
			var l = e.target.data[100];
			var t = e.target.data[101];
			if (mouseHitRect(l+10,t+10,90,90)) {
				e.target.style.cursor = draw.cursors.pointer;
			} else {
				e.target.style.cursor = draw.cursors.default;
			}
		});
		
		addListener(tableCellColorCanvas,function(e) {
			if (e.target.style.cursor == draw.cursors.default) return;
			updateMouse(e);
			var l = e.target.data[100];
			var t = e.target.data[101];
			var color = this.colors[Math.floor((mouse.y-(t+10))/22.5)][Math.floor((mouse.x-(l+10))/22.5)];
			for (var i = 0; i < draw.path.length; i++) {
				if (draw.path[i].selected == true) {
					var path = draw.path[i];
					for (var j = 0; j < path.obj.length; j++) {
						if (path.obj[j].type == 'table' || path.obj[j].type == 'table2') {			
							var cells = path.obj[j].cells;
							for (var r = 0; r < cells.length; r++) {
								for (var c = 0; c < cells[r].length; c++) {
									if (cells[r][c].selected == true) {
										cells[r][c].color = color;
									}
								}
							}
						}
					}
					drawCanvasPath(draw.path.indexOf(path));
				}
			}
		});	
		draw.tableCellColorButton = tableButton;
	}
	if (typeof object.tableInputs == 'object') {
		var buttonPos = object.tableInputs.buttonPos || [1120,620];
		var tableInputsButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		tableInputsButton.type = 'tableInputs';
		tableInputsButton.draw = function() {
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',draw.buttonColor);
			this.ctx.strokeStyle = '#666';
			this.ctx.lineWidth = 1;
			this.ctx.fillStyle = '#FFF';
			this.ctx.fillRect(10,11,35,33);
			this.ctx.fillStyle = '#CCC';
			this.ctx.fillRect(10,11,35,33/4);
			for (var i = 0; i < 5; i++) {
				this.ctx.moveTo(10,11+i*33/4);
				this.ctx.lineTo(45,11+i*33/4);
			}
			for (var i = 0; i < 4; i++) {
				this.ctx.moveTo(10+i*35/3,11);
				this.ctx.lineTo(10+i*35/3,44);
			}
			this.ctx.stroke();
			this.ctx.lineWidth = 1;
			this.ctx.strokeStyle = '#000';
			this.ctx.strokeRect(10,11,35,33);

			this.ctx.fillStyle = '#FFF';	
			this.ctx.strokeStyle = '#000';
			this.ctx.lineWidth = 2;
			this.ctx.lineCap = 'round';
			this.ctx.lineJoin = 'round';
			this.ctx.beginPath();
			this.ctx.fillRect(28,35,20,13);
			this.ctx.strokeRect(28,35,20,13);
			this.ctx.stroke();
			text({context:this.ctx,left:28,width:20,top:29,textArray:['<<font:Georgia>><<fontSize:10>><<align:center>>I']});			
		}
		tableInputsButton.click = function() {
			for (var i = 0; i < draw.path.length; i++) {
				if (draw.path[i].selected == true) {
					for (var j = 0; j < draw.path[i].obj.length; j++) {
						if (draw.path[i].obj[j].type == 'table') {
							var cells = draw.path[i].obj[j].cells;
							for (var r = 0; r < cells.length; r++) {
								for (var c = 0; c < cells[r].length; c++) {
									if (cells[r][c].selected == true) {
										if (typeof cells[r][c].input !== 'boolean') {
											cells[r][c].input = true;
										} else {
											cells[r][c].input = !cells[r][c].input;
										}
									}
								}
							}
						}
					}
				}
			}
			drawCanvasPaths();			
		}			
		draw.buttons.push(tableInputsButton);
	}	
	if (typeof object.select == 'object') {
		var buttonPos = object.select.buttonPos || [1120,620];
		var selectButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		selectButton.type = 'select';
		selectButton.draw = function() {
			if (draw.drawMode !== 'select') {
				var color = draw.buttonColor;
			} else {
				var color = draw.buttonSelectedColor;
			}	
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',color);
			this.ctx.drawImage(selImg,(55-26*0.65)/2+26*0.1,(55-42*0.65)/2,26*0.65,42*0.65);			
		}
		selectButton.click = function() {
			changeDrawMode('select');			
		}		
		draw.buttons.push(selectButton);
	}
	if (typeof object.clone == 'object') {
		var buttonPos = object.clone.buttonPos || [1120,620];
		var cloneButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		cloneButton.type = 'clone';
		cloneButton.draw = function() {
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',draw.buttonColor);
			text({context:this.ctx,left:0,width:55,top:15,textArray:['<<font:Arial>><<fontSize:12>><<align:center>>CLONE']});				
		}
		cloneButton.click = function() {
			clonePaths();
			/*var clones = [];
			var pMax = draw.path.length;
			for (var p = 0; p < pMax; p++) {
				if (draw.path[p].selected == true) {
					var path = clone(draw.path[p]);
					clones.push(path);
					draw.path[p].selected = false;
				}
			}
			reviveDrawPaths(clones);
			draw.path = draw.path.concat(clones);
			drawCanvasPaths();	*/
		}		
		draw.buttons.push(cloneButton);
	}
	if (typeof object.trigger == 'object') {
		var buttonPos = object.trigger.buttonPos || [1120,620];
		var triggerButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		triggerButton.type = 'trigger';
		triggerButton.draw = function() {
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',draw.buttonColor);
			text({context:this.ctx,left:0,width:55,top:5,textArray:['<<font:Arial>><<fontSize:14>><<align:center>>TRIG<<br>>GER']});			
		}
		triggerButton.click = function() {
			draw.triggerEnabled = !draw.triggerEnabled;
			if (draw.triggerEnabled == true) {
				draw.stepNum = 0;
				showSlider(draw.triggerSlider);
			} else {
				hideSlider(draw.triggerSlider);
			}
			for (var i = 0; i < draw.path.length; i++) {
				updateBorder(draw.path[i]);
			}
			drawCanvasPaths();
			calcCursorPositions();
		}		
		draw.buttons.push(triggerButton);
		draw.stepNumChange = function() {
			drawCanvasPaths();
		}
		draw.triggerSlider = createSlider({
			id:1,
			left:50,
			top:700,
			width:400,
			height:60,
			zIndex:10000000,
			vari:'Step',
			linkedVar:'draw.triggerNum',
			varChangeListener:'draw.stepNumChange',
			min:0,
			max:1,
			startNum:0,
			discrete:true,
			stepNum:1,
			snap:true,
			snapNum:1,
			visible:false
		});
	}
	if (typeof object.ans == 'object') {
		var buttonPos = object.ans.buttonPos || [1120,620];
		var ansButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		ansButton.type = 'ans';
		ansButton.draw = function() {
			var color = draw.buttonColor;
			if (draw.triggerNum == 1) color = '#CFC';
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',color);
			text({context:this.ctx,left:0,width:55,top:15,textArray:['<<font:Arial>><<fontSize:20>><<align:center>>ANS']});			
		}
		ansButton.click = function() {
			draw.triggerEnabled = true;
			draw.triggerNum = draw.triggerNum == 1 ? 0 : 1;
			/*draw.ansMode = true;
			if (un(draw.showAns) || draw.showAns == false){
				draw.showAns = true;
			} else {
				draw.showAns = false;
			}*/
			this.draw();
			drawCanvasPaths();
			calcCursorPositions();
		}		
		draw.buttons.push(ansButton);
	}		
	if (typeof object.video == 'object') {
		var buttonPos = object.video.buttonPos || [1120,620];
		var videoButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		videoButton.type = 'video';
		videoButton.draw = function() {
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',draw.buttonColor);
			roundedRect(this.ctx,8,14,39,27,5,0,'#FFC','#FFC');
			drawPath({ctx:this.ctx,closed:true,fillColor:'#000',path:[[22,27.5-7],[36,27.5],[22,27.5+7]]});
			for (var i = 0; i < 4; i++) {
				roundedRect(this.ctx,10+i*(3+(35-4*3)/3),8,3,3,0,0,'#FFC','#FFC');
				roundedRect(this.ctx,10+i*(3+(35-4*3)/3),44,3,3,0,0,'#FFC','#FFC');
			}			
		}
		videoButton.click = function() {
			addVideo();
		}		
		draw.buttons.push(videoButton);
	}	
	if (typeof object.group == 'object') {
		var buttonPos = object.group.buttonPos || [1120,620];
		var groupButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		groupButton.type = 'group';
		groupButton.draw = function() {
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',draw.buttonColor);
			text({context:this.ctx,left:0,width:55,top:15,textArray:['<<font:Arial>><<fontSize:12>><<align:center>>GROUP']});			
		}
		groupButton.click = function() {
			groupPaths();
			/*var selected = [];
			for (var i = 0; i < draw.path.length; i++) {
				if (draw.path[i].selected == true) selected.push(i);
			}
			if (selected.length > 1) {
				var pathObject = [];
				for (i = 0; i < selected.length; i++) {
					for (var k = 0; k < draw.path[selected[i]].obj.length; k++) {
						pathObject.push(draw.path[selected[i]].obj[k]);
					}
				}
				draw.path[selected[selected.length-1]] = {obj:pathObject.slice(0),selected:true};
				updateBorder(draw.path[selected[selected.length-1]]);
				for (var i = selected.length - 2; i >= 0; i--) {
					draw.path.splice(selected[i],1);	
				}
				drawCanvasPaths();
			} else if (selected.length == 1) {
				var pathObject = [];
				for (var i = 0; i < draw.path[selected[0]].obj.length; i++) {
					pathObj = [[draw.path[selected[0]].obj[i]],true];
					updateBorder(pathObj);
					pathObject.push(pathObj);
				}
				draw.path.splice(selected[0],1);
				for (var i = pathObject.length - 1; i >= 0; i--) {
					draw.path.splice(selected[0],0,pathObject[i]);
				}
				drawCanvasPaths();
			}*/			
		}		
		draw.buttons.push(groupButton);
	}
	if (typeof object.delete == 'object') {
		var buttonPos = object.delete.buttonPos || [1120,620];
		var deleteButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		deleteButton.type = 'delete';
		deleteButton.draw = function() {
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',draw.buttonColor);
			text({context:this.ctx,left:0,width:55,top:15,textArray:['<<font:Arial>><<fontSize:20>><<align:center>><<color:#F00>>DEL']});			
		}
		deleteButton.click = function() {
			deleteSelectedPaths();
		}		
		draw.buttons.push(deleteButton);
	}	
	if (typeof object.rect == 'object') {
		var buttonPos = object.rect.buttonPos || [1120,620];
		var rectButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		rectButton.type = 'rect';
		rectButton.draw = function() {
			if (draw.drawMode !== 'rect') {
				var color = draw.buttonColor;
				this.style.cursor = draw.cursors.pointer;
			} else {
				var color = draw.buttonSelectedColor;
				this.style.cursor = 'url('+draw.lineCursor+') '+draw.lineCursorHotspot[0]+' '+draw.lineCursorHotspot[1]+', auto';
			}
			
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',color);
			
			this.ctx.strokeStyle = draw.color;
			this.ctx.lineWidth = draw.thickness;;
			this.ctx.lineCap = 'round';
			this.ctx.lineJoin = 'round';

			this.ctx.beginPath();
			this.ctx.strokeRect(12.5,17.5,30,20);
			this.ctx.stroke();			
		}
		rectButton.click = function() {
			changeDrawMode('rect');			
		}			
		draw.buttons.push(rectButton);
	}
	if (typeof object.square == 'object') {
		var buttonPos = object.square.buttonPos || [1120,620];
		var squareButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		squareButton.type = 'square';
		squareButton.draw = function() {
			if (draw.drawMode !== 'square') {
				var color = draw.buttonColor;
				this.style.cursor = draw.cursors.pointer;
			} else {
				var color = draw.buttonSelectedColor;
				this.style.cursor = 'url('+draw.lineCursor+') '+draw.lineCursorHotspot[0]+' '+draw.lineCursorHotspot[1]+', auto';
			}
			
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',color);
			
			this.ctx.strokeStyle = draw.color;
			this.ctx.lineWidth = draw.thickness;;
			this.ctx.lineCap = 'round';
			this.ctx.lineJoin = 'round';

			this.ctx.beginPath();
			this.ctx.strokeRect(15,15,25,25);
			this.ctx.stroke();			
		}
		squareButton.click = function() {
			changeDrawMode('square');			
		}		
		draw.buttons.push(squareButton);
	}
	if (typeof object.polygon == 'object') {
		var buttonPos = object.polygon.buttonPos || [1120,620];
		var polygonButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		polygonButton.type = 'polygon';
		polygonButton.draw = function() {
			if (draw.drawMode !== 'polygon') {
				var color = draw.buttonColor;
				this.style.cursor = draw.cursors.pointer;
			} else {
				var color = draw.buttonSelectedColor;
				this.style.cursor = 'url('+draw.lineCursor+') '+draw.lineCursorHotspot[0]+' '+draw.lineCursorHotspot[1]+', auto';
			}
			
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',color);
			
			this.ctx.strokeStyle = draw.color;
			this.ctx.lineWidth = draw.thickness;;
			this.ctx.lineCap = 'round';
			this.ctx.lineJoin = 'round';

			this.ctx.beginPath();
			this.ctx.moveTo(10,25);
			this.ctx.lineTo(25,10);
			this.ctx.lineTo(45,30);
			this.ctx.lineTo(30,45);
			this.ctx.lineTo(20,45);
			this.ctx.lineTo(10,25);
			this.ctx.stroke();			
		}
		polygonButton.click = function() {
			changeDrawMode('polygon');
		}		
		draw.buttons.push(polygonButton);
	}	
	if (typeof object.circle == 'object') {
		var buttonPos = object.circle.buttonPos || [1120,620];
		var circleButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		circleButton.type = 'circle';
		circleButton.draw = function() {
			if (draw.drawMode !== 'circle') {
				var color = draw.buttonColor;
				this.style.cursor = draw.cursors.pointer;
			} else {
				var color = draw.buttonSelectedColor;
				this.style.cursor = 'url('+draw.lineCursor+') '+draw.lineCursorHotspot[0]+' '+draw.lineCursorHotspot[1]+', auto';
			}
			
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',color);
			
			this.ctx.strokeStyle = draw.color;
			this.ctx.lineWidth = draw.thickness;;
			this.ctx.lineCap = 'round';
			this.ctx.lineJoin = 'round';

			this.ctx.beginPath();
			this.ctx.arc(27.5,27.5,15,0,2*Math.PI);
			this.ctx.stroke();			
		}
		circleButton.click = function() {
			changeDrawMode('circle');			
		}		
		draw.buttons.push(circleButton);
	}
	if (typeof object.ellipse == 'object') {
		var buttonPos = object.ellipse.buttonPos || [1120,620];
		var ellipseButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		ellipseButton.type = 'ellipse';
		ellipseButton.draw = function() {
			if (draw.drawMode !== 'ellipse') {
				var color = draw.buttonColor;
				this.style.cursor = draw.cursors.pointer;
			} else {
				var color = draw.buttonSelectedColor;
				this.style.cursor = 'url('+draw.lineCursor+') '+draw.lineCursorHotspot[0]+' '+draw.lineCursorHotspot[1]+', auto';
			}
			
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',color);
			
			this.ctx.strokeStyle = draw.color;
			this.ctx.lineWidth = draw.thickness;;
			this.ctx.lineCap = 'round';
			this.ctx.lineJoin = 'round';

			this.ctx.save();
			this.ctx.translate(27.5,27.5);
			this.ctx.scale(1.5,1);
			this.ctx.beginPath();
			this.ctx.arc(0,0,10,0,2*Math.PI);
			this.ctx.stroke();
			this.ctx.restore();			
		}
		ellipseButton.click = function() {
			changeDrawMode('ellipse');			
		}		
		draw.buttons.push(ellipseButton);
	}
	if (typeof object.button == 'object') {
		var buttonPos = object.button.buttonPos || [1120,620];
		var buttonButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		buttonButton.type = 'button';
		buttonButton.draw = function() {
			if (draw.drawMode !== 'button') {
				var color = draw.buttonColor;
				this.style.cursor = draw.cursors.pointer;
			} else {
				var color = draw.buttonSelectedColor;
				this.style.cursor = 'url('+draw.lineCursor+') '+draw.lineCursorHotspot[0]+' '+draw.lineCursorHotspot[1]+', auto';
			}
			
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',color);
			
			this.ctx.fillStyle = '#6F9';	
			this.ctx.strokeStyle = '#000';
			this.ctx.lineWidth = 2;
			this.ctx.lineCap = 'round';
			this.ctx.lineJoin = 'round';

			this.ctx.beginPath();
			this.ctx.fillRect(8,15,55-16,25);
			this.ctx.strokeRect(8,15,55-16,25);
			this.ctx.stroke();
			
			text({context:this.ctx,left:8,width:55-16,top:15,textArray:['<<font:Hobo>><<fontSize:20>><<align:center>>bttn']});			
		}
		buttonButton.click = function() {
			if (draw.fillColor == '#000' || draw.fillColor == 'none') {
				var fillColor = '#6F9';
			} else {
				var fillColor = draw.fillColor;	
			}
			deselectAllPaths();
			var mInput = createMathsInput2({
				left:50-draw.drawRelPos[0],
				top:200-draw.drawRelPos[1],
				width:150,
				height:2*draw.drawArea[3],
				varSize:{minWidth:30,maxWidth:150,minHeight:60,maxHeight:60},
				backColor:'none',
				selectColor:'none',
				border:false,
				borderColor:'#00F',
				borderWidth:1,
				borderDash:[5,8],
				textAlign:'center',
				vertAlign:'middle',
				maxLines:100,
				selectable:true,
				zIndex:draw.zIndex,
				pointerCanvas:draw.cursorCanvas
			});
			setMathsInputText(mInput,['<<font:Hobo>><<fontSize:32>><<align:center>>button']);
			draw.path.push({obj:[{
				type:'button',
				thickness:4,
				fillColor:fillColor,
				color:'#000',
				left:50-draw.drawRelPos[0],
				top:200-draw.drawRelPos[1],
				width:150,
				height:60,
				text:['<<font:Hobo>><<fontSize:32>><<align:center>>button'],
				mathsInput:mInput,
				backColor:'none',
				selectColor:'none',
				textAlign:'center'
			}],selected:true,trigger:[]});
			//mInput.drawPath = draw.path[draw.path.length-1];
			updateBorder(draw.path[draw.path.length-1]);
			changeDrawMode();
			drawCanvasPaths();			
		}		
		draw.buttons.push(buttonButton);
	}	
	if (typeof object.text == 'object') {
		var buttonPos = object.text.buttonPos || [1120,620];
		var textButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		textButton.type = 'text';
		textButton.draw = function() {
			if (draw.drawMode !== 'textStart') {
				var color = draw.buttonColor;
			} else {
				var color = draw.buttonSelectedColor;
			}	
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',color);
			text({context:this.ctx,left:0,width:55,top:5,textArray:['<<font:Arial>><<fontSize:35>><<align:center>>A']});			
		}
		textButton.click = function() {
			changeDrawMode('textStart');			
		}		
		draw.buttons.push(textButton);
	}
	if (typeof object.input == 'object') {
		var buttonPos = object.input.buttonPos || [1120,620];
		var inputButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		inputButton.type = 'input';
		inputButton.draw = function() {
			if (draw.drawMode !== 'input') {
				var color = draw.buttonColor;
				this.style.cursor = draw.cursors.pointer;
			} else {
				var color = draw.buttonSelectedColor;
				this.style.cursor = 'url('+draw.lineCursor+') '+draw.lineCursorHotspot[0]+' '+draw.lineCursorHotspot[1]+', auto';
			}
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',color);
			this.ctx.fillStyle = '#FFF';	
			this.ctx.strokeStyle = '#000';
			this.ctx.lineWidth = 2;
			this.ctx.lineCap = 'round';
			this.ctx.lineJoin = 'round';
			this.ctx.beginPath();
			this.ctx.fillRect(8,15,55-16,25);
			this.ctx.strokeRect(8,15,55-16,25);
			this.ctx.stroke();
			
			text({context:this.ctx,left:8,width:55-16,top:15,textArray:['<<font:Georgia>><<fontSize:20>><<align:center>>I']});			
		}
		inputButton.click = function() {
			deselectAllPaths();
			
			var mInput = createMathsInput2({
				left:100-draw.drawRelPos[0],
				top:200-draw.drawRelPos[1],
				width:150,
				height:2*draw.drawArea[3],
				fontSize:30,
				varSize:{minWidth:30,maxWidth:150,minHeight:60,maxHeight:60,padding:10},
				backColor:'none',
				selectColor:'none',
				border:false,
				borderColor:'#00F',
				borderWidth:1,
				borderDash:[5,8],
				textAlign:'center',
				vertAlign:'middle',
				maxLines:1,
				selectable:true,
				zIndex:draw.zIndex,
				pointerCanvas:draw.cursorCanvas
			});
			setMathsInputText(mInput,['<<font:Arial>><<fontSize:32>><<align:center>>']);
			//mInput.drawPath = draw.path[draw.path.length-1];
			
			var leftInput = createMathsInput2({
				left:100-800-draw.drawRelPos[0],
				top:200-draw.drawRelPos[1],
				width:800,
				height:2*draw.drawArea[3],
				varSize:{minWidth:30,maxWidth:800,minHeight:50,maxHeight:50,padding:0},
				backColor:'none',
				selectColor:'none',
				border:true,
				borderColor:'#00F',
				borderWidth:1,
				borderDash:[5,8],
				textAlign:'right',
				vertAlign:'middle',
				maxLines:1,
				fontSize:32,
				selectable:true,
				zIndex:draw.zIndex,
				pointerCanvas:draw.cursorCanvas
			});
			//leftInput.drawPath = draw.path[draw.path.length-1];
			
			var rightInput = createMathsInput2({
				left:250-draw.drawRelPos[0],
				top:200-draw.drawRelPos[1],
				width:800,
				height:2*draw.drawArea[3],
				varSize:{minWidth:30,maxWidth:800,minHeight:50,maxHeight:50,padding:0},
				backColor:'none',
				selectColor:'none',
				border:true,
				borderColor:'#00F',
				borderWidth:1,
				borderDash:[5,8],
				textAlign:'left',
				vertAlign:'middle',
				maxLines:1,
				fontSize:32,
				selectable:true,
				zIndex:draw.zIndex,
				pointerCanvas:draw.cursorCanvas
			});
			//rightInput.drawPath = draw.path[draw.path.length-1];
			
			draw.path.push({obj:[{
				type:'input',
				thickness:4,
				fillColor:'#FFF',
				color:'#000',
				left:100-draw.drawRelPos[0],
				top:200-draw.drawRelPos[1],
				width:150,
				height:60,
				text:['<<font:Arial>><<fontSize:32>><<align:center>>input'],
				leftText:[],
				rightText:[],
				edit:true,
				mathsInput:mInput,
				leftInput:leftInput,
				rightInput:rightInput,
				backColor:'none',
				selectColor:'none',
				textAlign:'center',
			}],selected:true,trigger:[]});
			repositionPath(draw.path[draw.path.length-1]);	
			changeDrawMode();
			drawCanvasPaths();			
		}		
		draw.buttons.push(inputButton);
	}
	if (typeof object.grid == 'object') {
		var buttonPos = object.grid.buttonPos || [1120,620];
		var gridButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		gridButton.type = 'grid';
		gridButton.draw = function() {
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',draw.buttonColor);
			this.ctx.strokeStyle = '#666';
			this.ctx.lineWidth = 1;
			for (var i = 0; i < 9; i++) {
				this.ctx.moveTo(10,10+i*35/8);
				this.ctx.lineTo(45,10+i*35/8);
			}
			for (var i = 0; i < 9; i++) {
				this.ctx.moveTo(10+i*35/8,10);
				this.ctx.lineTo(10+i*35/8,45);
			}
			this.ctx.stroke();

			drawArrow({ctx:this.ctx,startX:8,startY:55/2,finX:49,finY:55/2,lineWidth:2,arrowLength:4});
			drawArrow({ctx:this.ctx,finY:6,startX:55/2,startY:47,finX:55/2,lineWidth:2,arrowLength:4});			
		}
		gridButton.click = function() {
			draw.grid.add();
		}		
		draw.buttons.push(gridButton);
	}	
	if (typeof object.colorSelect == 'object') {
		var colors = object.colorSelect.colors || ['#000','#999','#00F','#F00','#393','#F0F','#93C','#F60'];
		var buttonPos = object.colorSelect.buttonPos || [1120,620];
		var expandTo = object.colorSelect.expandTo || 'left';
		var colorSelectButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		colorSelectButton.type = 'colorSelect';
		colorSelectButton.colors = colors;
		colorSelectButton.draw = function() {
			var color = draw.buttonColor;
			if (draw.colorSelectVisible == true) color = draw.buttonSelectedColor;
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',color);
			for (var i = 0; i < 9; i++) {
				this.ctx.fillStyle = this.colors[i] || '#FFF';
				this.ctx.fillRect(12.5+10*(i%3),12.5+10*Math.floor(i/3),10,10);
			}
			this.ctx.strokeStyle = '#000';
			this.ctx.lineWidth = 1;
			this.ctx.strokeRect(12.5,12.5,30,30);			
		}
		colorSelectButton.click = function() {
			draw.colorSelectVisible = !draw.colorSelectVisible;
			if (draw.colorSelectVisible == true) {
				for (var i = 0; i < draw.colorButtons.length; i++) {
					showObj(draw.colorButtons[i],draw.colorButtons[i].data)
				}
				for (var i = 0; i < container.childNodes.length; i++) {
					if (draw.colorButtons.indexOf(container.childNodes[i]) == -1) {
						addListenerStart(container.childNodes[i],colorSelectClose);
					}
				}				
			} else {
				for (var i = 0; i < draw.colorButtons.length; i++) {
					hideObj(draw.colorButtons[i],draw.colorButtons[i].data)
				}
				for (var i = 0; i < container.childNodes.length; i++) {
					if (draw.colorButtons.indexOf(container.childNodes[i]) == -1) {
						removeListenerStart(container.childNodes[i],colorSelectClose);
					}
				}								
			}			
		}		
		draw.buttons.push(colorSelectButton);
		switch (expandTo) {
			case 'left':
				var left = buttonPos[0] - 125;
				var top = buttonPos[1] + 17.5 - 100;
				break;
			case 'top':
				var left = buttonPos[0] - 32.5;
				var top = buttonPos[1] - 225;		
				break;
			case 'right':
				var left = buttonPos[0] + 60;
				var top = buttonPos[1] + 17.5 - 100;		
				break;
			case 'bottom':
				var left = buttonPos[0] - 32.5;
				var top = buttonPos[1] + 60;		
				break;
		}
		var colorBackButton = createCanvas(left,top,120,220,false,false,false,draw.drawButtonZIndex);
		colorBackButton.isStaticMenuCanvas = true;					
		roundedRect(colorBackButton.getContext('2d'),3,3,114,214,8,6,'#000',draw.buttonColor);
		draw.colorButtons.push(colorBackButton);
		for (var i = 0; i < colors.length; i++) {
			var left2 = left + 10 + 50 * (i % 2);
			var top2 = top + 10 + 50 * Math.floor(i / 2);	
			var colorButton = createCanvas(left2,top2,50,50,false,false,true,draw.drawButtonZIndex);
			colorButton.isStaticMenuCanvas = true;		
			colorButton.color = colors[i];
			colorButton.ctx.lineCap = 'round';
			colorButton.ctx.lineJoin = 'round';
			colorButton.ctx.lineWidth = 4;
			colorButton.ctx.strokeStyle = '#000';		
			colorButton.ctx.fillStyle = colors[i];
			colorButton.ctx.fillRect(0,0,50,50);
			colorButton.ctx.strokeRect(0,0,50,50);
			addListener(colorButton,function() {
				draw.color = this.color;
				//changeDrawMode();
				//redrawButtons();
				draw.cursors.update();
				recalcRulerValues(); // updates the ruler edge draw cursors				
				for (var i = 0; i < draw.path.length; i++) {
					if (draw.path[i].selected == true) {
						for (var j = 0; j < draw.path[i].obj.length; j++) {
							draw.path[i].obj[j].color = this.color;	
							if (draw.path[i].obj[j].type == 'angle') {
								draw.path[i].obj[j].lineColor = this.color;
							}
						}
					}
				}
				drawCanvasPaths();
			})
			draw.colorButtons.push(colorButton);
		}
	}
	if (typeof object.thicknessSelect == 'object') {
		var thicknesses = object.thicknessSelect.thicknessses || [1,3,5,7];
		var buttonPos = object.thicknessSelect.buttonPos || [1120,620];
		var expandTo = object.thicknessSelect.expandTo || 'left';
		var thicknessSelectButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		thicknessSelectButton.type = 'thicknessSelect';
		thicknessSelectButton.thicknesses = thicknesses;
		thicknessSelectButton.draw = function() {
			var color = draw.buttonColor;
			if (draw.thicknessSelectVisible == true) color = draw.buttonSelectedColor;
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',color);
			
			this.ctx.strokeStyle = '#000';
			this.ctx.lineCap = 'round';
			this.ctx.lineJoin = 'round';
			this.ctx.lineWidth = 1;
			this.ctx.beginPath();
			this.ctx.moveTo(10,12);
			this.ctx.lineTo(45,12);
			this.ctx.stroke();
			this.ctx.lineWidth = 3;
			this.ctx.beginPath();
			this.ctx.moveTo(10.5,20);
			this.ctx.lineTo(44.5,20);
			this.ctx.stroke();		
			this.ctx.lineWidth = 5;
			this.ctx.beginPath();
			this.ctx.moveTo(11,29);
			this.ctx.lineTo(44,29);
			this.ctx.stroke();	
			this.ctx.lineWidth = 7;
			this.ctx.beginPath();
			this.ctx.moveTo(11.5,39);
			this.ctx.lineTo(43.5,39);
			this.ctx.stroke();			
		}
		thicknessSelectButton.click = function() {
			draw.thicknessSelectVisible = !draw.thicknessSelectVisible;
			if (draw.thicknessSelectVisible == true) {
				for (var i = 0; i < draw.thicknessButtons.length; i++) {
					showObj(draw.thicknessButtons[i],draw.thicknessButtons[i].data)
				}
				for (var i = 0; i < container.childNodes.length; i++) {
					if (draw.thicknessButtons.indexOf(container.childNodes[i]) == -1) {
						addListenerStart(container.childNodes[i],thicknessSelectClose);
					}
				}				
			} else {
				for (var i = 0; i < draw.thicknessButtons.length; i++) {
					hideObj(draw.thicknessButtons[i],draw.thicknessButtons[i].data)
				}	
				for (var i = 0; i < container.childNodes.length; i++) {
					if (draw.thicknessButtons.indexOf(container.childNodes[i]) == -1) {
						removeListenerStart(container.childNodes[i],thicknessSelectClose);
					}
				}							
			}			
		}		
		draw.buttons.push(thicknessSelectButton);
		switch (expandTo) {
			case 'left':
				var left = buttonPos[0] - 125;
				var top = buttonPos[1] + 17.5 - 100;
				break;
			case 'top':
				var left = buttonPos[0] - 32.5;
				var top = buttonPos[1] - 225;		
				break;
			case 'right':
				var left = buttonPos[0] + 60;
				var top = buttonPos[1] + 17.5 - 100;		
				break;
			case 'bottom':
				var left = buttonPos[0] - 32.5;
				var top = buttonPos[1] + 60;		
				break;
		}
		var thicknessBackButton = createCanvas(left,top,120,220,false,false,false,draw.drawButtonZIndex);
		thicknessBackButton.isStaticMenuCanvas = true;				
		roundedRect(thicknessBackButton.getContext('2d'),3,3,114,214,8,6,'#000',draw.buttonColor);
		draw.thicknessButtons.push(thicknessBackButton);
		for (var i = 0; i < thicknesses.length; i++) {
			var left2 = left + 10;
			var top2 = top + 14 + 50*i - 2.5*i;	
			var thicknessButton = createCanvas(left2,top2,100,50,false,false,true,draw.drawButtonZIndex);
			thicknessButton.isStaticMenuCanvas = true;
			thicknessButton.thickness = thicknesses[i];
			addListener(thicknessButton,function() {
				draw.thickness = this.thickness;
				//changeDrawMode();			
				redrawThicknessButtons();
				//redrawButtons();
				draw.cursors.update();
				for (var i = 0; i < draw.path.length; i++) {
					if (draw.path[i].selected == true) {
						for (var j = 0; j < draw.path[i].obj.length; j++) {
							draw.path[i].obj[j].thickness = this.thickness;
							if (draw.path[i].obj[j].type == 'angle') {
								draw.path[i].obj[j].lineWidth = this.thickness;
							}							
						}
					}
				}
				drawCanvasPaths();				
			})
			draw.thicknessButtons.push(thicknessButton);
		}
		redrawThicknessButtons()
	}	
	if (typeof object.fillColorSelect == 'object') {
		var colors = object.fillColorSelect.colors || ['#FF0','#F0F','#0FF','#CFC','#FCC','#CFF','#FCF','#FFC','#6F9','#000','#F00','#00F','#999','none'];
		var buttonPos = object.fillColorSelect.buttonPos || [1120,620];
		var expandTo = object.fillColorSelect.expandTo || 'left';
		var fillColorSelectButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		fillColorSelectButton.type = 'fillColorSelect';
		fillColorSelectButton.colors = colors;
		fillColorSelectButton.draw = function() {
			var color = draw.buttonColor;
			if (draw.fillColorSelectVisible == true) color = draw.buttonSelectedColor;
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',color);
			for (var i = 0; i < 9; i++) {
				this.ctx.fillStyle = this.colors[i] || '#FFF';
				this.ctx.fillRect(12.5+10*(i%3),12.5+10*Math.floor(i/3),10,10);
			}
			this.ctx.strokeStyle = '#000';
			this.ctx.lineWidth = 1;
			this.ctx.strokeRect(12.5,12.5,30,30);			
		}
		fillColorSelectButton.click = function() {
			draw.fillColorSelectVisible = !draw.fillColorSelectVisible;
			if (draw.fillColorSelectVisible == true) {
				for (var i = 0; i < draw.fillColorButtons.length; i++) {
					showObj(draw.fillColorButtons[i],draw.fillColorButtons[i].data)
				}
				for (var i = 0; i < container.childNodes.length; i++) {
					if (draw.fillColorButtons.indexOf(container.childNodes[i]) == -1) {
						addListenerStart(container.childNodes[i],fillColorSelectClose);
					}
				}				
			} else {
				for (var i = 0; i < draw.fillColorButtons.length; i++) {
					hideObj(draw.fillColorButtons[i],draw.fillColorButtons[i].data)
				}
				for (var i = 0; i < container.childNodes.length; i++) {
					if (draw.fillColorButtons.indexOf(container.childNodes[i]) == -1) {
						removeListenerStart(container.childNodes[i],fillColorSelectClose);
					}
				}
			}			
		}			
		draw.buttons.push(fillColorSelectButton);
		switch (expandTo) {
			case 'left':
				var left = buttonPos[0] - 125;
				var top = buttonPos[1] + 17.5 - 100;
				break;
			case 'top':
				var left = buttonPos[0] - 32.5;
				var top = buttonPos[1] - 225;		
				break;
			case 'right':
				var left = buttonPos[0] + 60;
				var top = buttonPos[1] + 17.5 - 100;		
				break;
			case 'bottom':
				var left = buttonPos[0] - 32.5;
				var top = buttonPos[1] + 60;		
				break;
		}
		var colorBackButton = createCanvas(left,top,120,370,false,false,false,draw.drawButtonZIndex);
		colorBackButton.isStaticMenuCanvas = true;
		roundedRect(colorBackButton.getContext('2d'),3,3,114,364,8,6,'#000',draw.buttonColor);
		draw.fillColorButtons.push(colorBackButton);
		for (var i = 0; i < colors.length; i++) {
			var left2 = left + 10 + 50 * (i % 2);
			var top2 = top + 10 + 50 * Math.floor(i / 2);	
			var colorButton = createCanvas(left2,top2,50,50,false,false,true,draw.drawButtonZIndex);
			colorButton.isStaticMenuCanvas = true;
			colorButton.color = colors[i];
			colorButton.ctx.lineCap = 'round';
			colorButton.ctx.lineJoin = 'round';
			colorButton.ctx.lineWidth = 4;
			colorButton.ctx.strokeStyle = '#000';
			if (colors[i] == 'none') {
				colorButton.ctx.fillStyle = mainCanvasFillStyle;
				colorButton.ctx.fillRect(0,0,50,50);
				colorButton.ctx.save();
				colorButton.ctx.beginPath();
				colorButton.ctx.moveTo(0,0);
				colorButton.ctx.lineTo(50,50);
				colorButton.ctx.moveTo(50,0);
				colorButton.ctx.lineTo(0,50);
				colorButton.ctx.lineWidth = 1;
				colorButton.ctx.strokeStyle = '#000';
				colorButton.ctx.stroke();
				colorButton.ctx.restore();
			} else {
				colorButton.ctx.fillStyle = colors[i];
				colorButton.ctx.fillRect(0,0,50,50);
			}
			colorButton.ctx.strokeRect(0,0,50,50);
			addListener(colorButton,function() {
				draw.fillColor = this.color;
				//changeDrawMode();
				//redrawButtons();
				draw.cursors.update();
				for (var i = 0; i < draw.path.length; i++) {
					if (draw.path[i].selected == true) {
						for (var j = 0; j < draw.path[i].obj.length; j++) {
							draw.path[i].obj[j].fillColor = this.color;
							if (draw.path[i].obj[j].type == 'angle') {
								draw.path[i].obj[j].lineColor = this.lineColor;
							}							
						}
					}
				}
				drawCanvasPaths();				
			})
			draw.fillColorButtons.push(colorButton);
		}		
	}
	if (typeof object.drawStyle == 'object') {
		var buttonPos = object.drawStyle.buttonPos || [1120,620];
		var button = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		button.type = 'drawStyle';
		button.draw = function() {
			var color = draw.buttonColor;
			if (draw.drawStyleSelectVisible == true) color = draw.buttonSelectedColor;
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',color);
			
			this.ctx.strokeStyle = '#000';
			this.ctx.lineCap = 'round';
			this.ctx.lineJoin = 'round';
			this.ctx.lineWidth = 1;
			this.ctx.beginPath();
			this.ctx.moveTo(10,12);
			this.ctx.lineTo(45,12);
			this.ctx.stroke();
			this.ctx.strokeStyle = '#00F';
			this.ctx.lineWidth = 3;
			this.ctx.beginPath();
			this.ctx.moveTo(10.5,20);
			this.ctx.lineTo(44.5,20);
			this.ctx.stroke();		
			this.ctx.strokeStyle = '#F00';
			this.ctx.lineWidth = 5;
			this.ctx.beginPath();
			this.ctx.moveTo(11,29);
			this.ctx.lineTo(44,29);
			this.ctx.stroke();	
			this.ctx.strokeStyle = '#393';
			this.ctx.lineWidth = 7;
			this.ctx.beginPath();
			this.ctx.moveTo(11.5,39);
			this.ctx.lineTo(43.5,39);
			this.ctx.stroke();			
		}
		button.click = function() {
			draw.drawStyleSelectVisible = !draw.drawStyleSelectVisible;
			if (draw.drawStyleSelectVisible == true) {
				changeDrawMode('drawStyle');
				showObj(draw.drawStyleCanvas,draw.drawStyleCanvas.data);
				//showMathsInput(draw.drawStyleCanvas.lineColorInput);
				//showMathsInput(draw.drawStyleCanvas.fillColorInput);
				//defaults
				draw.drawStyleCanvas.lineWidth = 2;
				draw.drawStyleCanvas.lineColor = '#000';
				draw.drawStyleCanvas.lineDash = [0,0];
				draw.drawStyleCanvas.fillColor = 'none';
				draw.drawStyleCanvas.radius = 0;
				draw.drawStyleCanvas.selected = [];
				for (var p = 0; p < draw.path.length; p++) {
					if (boolean(draw.path[p].selected,false) == true) {
						draw.drawStyleCanvas.selected.push(p);
					}
				}
				var found = false;
				for (var s = 0; s < draw.drawStyleCanvas.selected.length; s++) {
					if (found == true) break;
					var path = draw.path[draw.drawStyleCanvas.selected[s]];
					for (var o = 0; o < path.obj.length; o++) {
						if (found == true) break;
						var obj = path.obj[o];
						if (!un(draw[obj.type])) {
							found = true;
							if (!un(draw[obj.type].getLineColor)) {
								draw.drawStyleCanvas.lineColor = draw[obj.type].getLineColor(obj);
							}
							if (!un(draw[obj.type].getLineWidth)) {
								draw.drawStyleCanvas.lineWidth = draw[obj.type].getLineWidth(obj);
							}
							if (!un(draw[obj.type].getLineDash)) {
								draw.drawStyleCanvas.lineDash = draw[obj.type].getLineDash(obj);
							}
							if (!un(draw[obj.type].getFillColor)) {
								draw.drawStyleCanvas.fillColor = draw[obj.type].getFillColor(obj);
							}
							if (!un(draw[obj.type].getRadius)) {
								draw.drawStyleCanvas.radius = draw[obj.type].getRadius(obj);
							}
							break;
						}
						if (['pen','line','circle','ellipse','rect','square','arc','curve','curve2','polygon'].indexOf(obj.type) > -1) {
							found = true;
							draw.drawStyleCanvas.lineWidth = obj.thickness || 2;
							draw.drawStyleCanvas.lineColor = obj.color || '#000';
							draw.drawStyleCanvas.lineDash = obj.dash || [0,0];
							draw.drawStyleCanvas.fillColor = obj.fillColor || 'none';
							draw.drawStyleCanvas.radius = obj.radius || 0;
						}
						if (['table2'].indexOf(obj.type) > -1) {
								for (var r = 0; r < obj.cells.length; r++) {
									for (var c = 0; c < obj.cells[r].length; c++) {
										var cell = obj.cells[r][c];
										if (cell.selected == true) {
											if (found == true) break;
											if (!un(cell.box)) {
												found = true;
												draw.drawStyleCanvas.lineWidth = cell.box.lineWidth || 2;
												draw.drawStyleCanvas.lineColor = cell.box.lineColor || '#000';
												draw.drawStyleCanvas.lineDash = cell.box.dash || [0,0];
												draw.drawStyleCanvas.fillColor = cell.box.fillColor || cell.box.color || 'none';
												draw.drawStyleCanvas.radius = cell.box.radius || 0;
											}
										}
									}
								}
							}
					}
				}
				if (found == false) {
					draw.drawStyleCanvas.lineWidth = draw.thickness;
					draw.drawStyleCanvas.lineColor = draw.color;
					draw.drawStyleCanvas.lineDash = draw.dash || [0,0];
					draw.drawStyleCanvas.fillColor = draw.fillColor;
					draw.drawStyleCanvas.radius = draw.radius || 0;
				}
				draw.drawStyleCanvas.draw();
				addListenerMove(draw.drawStyleCanvas,draw.drawStyleCanvas.move);
				addListener(draw.drawStyleCanvas,draw.drawStyleCanvas.click);
				addListener(window,draw.drawStyleCanvas.close);
			} else {
				changeDrawMode();
				hideObj(draw.drawStyleCanvas,draw.drawStyleCanvas.data);
				//hideMathsInput(draw.drawStyleCanvas.lineColorInput);
				//hideMathsInput(draw.drawStyleCanvas.fillColorInput);
				removeListenerMove(draw.drawStyleCanvas,draw.drawStyleCanvas.move);
				removeListener(draw.drawStyleCanvas,draw.drawStyleCanvas.click);
				removeListener(window,draw.drawStyleCanvas.close);
			}			
		}
		draw.buttons.push(button);
		draw.dash = [0,0];
		
		var left = buttonPos[0];
		var top = buttonPos[1]+53;
		var drawStyleCanvas = createCanvas(left,top,200,400,false,false,true,zIndex+1001000);
		drawStyleCanvas.isStaticMenuCanvas = true;	
		drawStyleCanvas.selected = -1;
		drawStyleCanvas.button = button;
		draw.drawStyleCanvas = drawStyleCanvas;
		draw.drawStyleSelectVisible = false;
		
		drawStyleCanvas.lineColors = [
			['none','#000','#666','#FFF','#060','#393','#6F9','#09F'],
			['#F60','#F90','#FF0','#F0F','#0FF','#0F0','#00F','#F00'],
			['#990','#630','#FF6','#F6F','#6FF','#6F6','#66F','#F66'],
			['#90F','#309','#FFC','#FCF','#CFF','#CFC','#CCF','#FCC']
		];
		drawStyleCanvas.fillColors = [
			['none','#000','#666','#FFF','#060','#393','#6F9','#09F'],
			['#FFF8FA','#F90','#FF0','#F0F','#0FF','#0F0','#00F','#F00'],
			['#E5F8E5','#630','#FF6','#F6F','#6FF','#6F6','#66F','#F66'],
			['#E1F6FE','#309','#FFC','#FCF','#CFF','#CFC','#CCF','#FCC']
		];
		/*
		drawStyleCanvas.lineColorInput = createMathsInput2({left:left+200-110,top:top+60,width:100,height:20,border:true,fontSize:18,transparent:true,backColor:'#FFC',selectColor:'#FFC',zIndex:zIndex+1001001,visible:false});
		drawStyleCanvas.lineColorInput.onInputEnd = function() {
			var str = replaceAll(this.stringJS,'*','');
			var re = new RegExp("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$");
			if (str == 'none' || re.test(str) == true) {
				for (var s = 0; s < draw.drawStyleCanvas.selected.length; s++) {
					var p = draw.drawStyleCanvas.selected[s];
					for (var o = 0; o < draw.path[p].obj.length; o++) {
						if (['pen','line','circle','ellipse','rect','square','arc','curve','curve2','polygon','button','text'].indexOf(draw.path[p].obj[o].type) > -1) {
							draw.path[p].obj[o].color = str;
						}
					}
				}
				draw.color = str;
				draw.drawStyleCanvas.lineColor = str;
				drawCanvasPaths();
				redrawButtons();
				draw.drawStyleCanvas.draw();				
			}
		}
		drawStyleCanvas.fillColorInput = createMathsInput2({left:left+200-110,top:top+175+4*22.5,width:100,height:20,border:true,fontSize:18,transparent:true,backColor:'#FFC',selectColor:'#FFC',zIndex:zIndex+1001001,visible:false});
		drawStyleCanvas.fillColorInput.onInputEnd = function() {
			var str = replaceAll(this.stringJS,'*','');
			var re = new RegExp("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$");
			if (str == 'none' || re.test(str) == true) {
				for (var s = 0; s < draw.drawStyleCanvas.selected.length; s++) {
					var p = draw.drawStyleCanvas.selected[s];
					for (var o = 0; o < draw.path[p].obj.length; o++) {
						if (['pen','line','circle','ellipse','rect','square','arc','curve','curve2','polygon','button','text'].indexOf(draw.path[p].obj[o].type) > -1) {
							draw.path[p].obj[o].fillColor = str;
						}
					}
				}
				draw.fillColor = str;
				draw.drawStyleCanvas.fillColor = str;
				drawCanvasPaths();
				redrawButtons();
				draw.drawStyleCanvas.draw();				
			}		
		}*/
		drawStyleCanvas.cursorPos = [];
		drawStyleCanvas.cursorIndex = -1;
		drawStyleCanvas.left = left;
		drawStyleCanvas.top = top;
		drawStyleCanvas.draw = function() {
			//setMathsInputText(draw.drawStyleCanvas.lineColorInput,draw.color);
			//setMathsInputText(draw.drawStyleCanvas.fillColorInput,draw.fillColor);
			
			var ctx = this.ctx;
			roundedRect(ctx,3,3,this.data[102]-6,this.data[103]-6,8,6,'#000','#FFC');
			this.cursorPos = [];
			
			var left = this.left;
			var top = this.top;
			var t = 20;
			//console.log(this.lineColor,this.lineWidth,this.lineDash,this.fillColor,this.radius);
			
			var rad = Math.min(this.radius,15);
			roundedRect(ctx,20,t,this.data[102]-40,30,rad,this.lineWidth,this.lineColor,this.lineDash);
			
			t += 40;
			text({context:ctx,textArray:['<<fontSize:18>>Line'],left:10,top:t,width:this.data[102]-20,height:50,textAlign:'left'});
			t += 30;
			roundedRect(ctx,10,t,22.5,22.5,0,2,'#000');
			roundedRect(ctx,210,t,22.5,22.5,0,2,'#000');
			ctx.beginPath();
			ctx.strokeStyle = '#000';
			ctx.lineWidth = 2;
			ctx.moveTo(10,t);
			ctx.lineTo(32.5,t+22.5);
			ctx.moveTo(32.5,t);
			ctx.lineTo(10,t+22.5);
			ctx.moveTo(210,t);
			ctx.lineTo(232.5,t+22.5);
			ctx.moveTo(232.5,t);
			ctx.lineTo(210,t+22.5);			
			ctx.stroke();			
			for (var r = 0; r < this.lineColors.length; r++) {
				for (var c = 0; c < this.lineColors[r].length; c++) {
					this.cursorPos.push({rect:[left+10+22.5*c,top+90+22.5*r,22.5,22.5],cursor:'pointer',color:this.lineColors[r][c],type:'lineColor'});
					if (this.lineColors[r][c] == 'none') continue;
					roundedRect(ctx,10+22.5*c,90+22.5*r,22.5,22.5,0,2,'#000',this.lineColors[r][c]);
				}
			}
			
			var t = 90+4*22.5+15;
			text({context:ctx,textArray:['<<fontSize:30>>-'],left:10,top:t,width:25,height:25,textAlign:'center',vertAlign:'middle',box:{color:'#FCF',borderWidth:2}});
			text({context:ctx,textArray:['<<fontSize:30>>+'],left:35,top:t,width:25,height:25,textAlign:'center',vertAlign:'middle',box:{color:'#FCF',borderWidth:2}});
			text({context:ctx,textArray:['<<fontSize:16>>width '+this.lineWidth],left:5,top:t+30,width:60,height:30,textAlign:'center'});
			this.cursorPos.push({rect:[left+10,top+t,25,25],cursor:'pointer',diff:-1,type:'lineWidth'});
			this.cursorPos.push({rect:[left+35,top+t,25,25],cursor:'pointer',diff:1,type:'lineWidth'});
			
			text({context:ctx,textArray:['<<fontSize:30>>-'],left:75,top:t,width:25,height:25,textAlign:'center',vertAlign:'middle',box:{color:'#FCF',borderWidth:2}});
			text({context:ctx,textArray:['<<fontSize:30>>+'],left:100,top:t,width:25,height:25,textAlign:'center',vertAlign:'middle',box:{color:'#FCF',borderWidth:2}});
			text({context:ctx,textArray:['<<fontSize:16>>dash '+this.lineDash[0]],left:70,top:t+30,width:60,height:30,textAlign:'center'});
			this.cursorPos.push({rect:[left+75,top+t,25,25],cursor:'pointer',diff:-5,type:'lineDash'});
			this.cursorPos.push({rect:[left+100,top+t,25,25],cursor:'pointer',diff:5,type:'lineDash'});
			
			text({context:ctx,textArray:['<<fontSize:30>>-'],left:140,top:t,width:25,height:25,textAlign:'center',vertAlign:'middle',box:{color:'#FCF',borderWidth:2}});
			text({context:ctx,textArray:['<<fontSize:30>>+'],left:165,top:t,width:25,height:25,textAlign:'center',vertAlign:'middle',box:{color:'#FCF',borderWidth:2}});
			text({context:ctx,textArray:['<<fontSize:16>>rad '+this.radius],left:135,top:t+30,width:60,height:30,textAlign:'center'});			
			this.cursorPos.push({rect:[left+140,top+t,25,25],cursor:'pointer',diff:-5,type:'radius'});
			this.cursorPos.push({rect:[left+165,top+t,25,25],cursor:'pointer',diff:5,type:'radius'});
			
			t += 60;
			ctx.strokeStyle = '#000';
			ctx.lineWidth = 2;
			ctx.setLineDash([]);
			ctx.beginPath();
			ctx.moveTo(10,t);
			ctx.lineTo(this.data[102]-10,t);
			ctx.stroke();
			
			t += 10;
			text({context:ctx,textArray:['<<fontSize:18>>Fill'],left:10,top:t,width:this.data[102]-20,height:50,textAlign:'left'});
			
			t += 30;
			// draw color buttons
			roundedRect(ctx,10,t,22.5,22.5,0,2,'#000');
			roundedRect(ctx,210,t,22.5,22.5,0,2,'#000');
			ctx.beginPath();
			ctx.strokeStyle = '#000';
			ctx.lineWidth = 2;
			ctx.moveTo(10,t);
			ctx.lineTo(32.5,t+22.5);
			ctx.moveTo(32.5,t);
			ctx.lineTo(10,t+22.5);
			ctx.moveTo(210,t);
			ctx.lineTo(232.5,t+22.5);
			ctx.moveTo(232.5,t);
			ctx.lineTo(210,t+22.5);			
			ctx.stroke();
			for (var r = 0; r < this.fillColors.length; r++) {
				for (var c = 0; c < this.fillColors[r].length; c++) {
					this.cursorPos.push({rect:[left+10+22.5*c,top+t+22.5*r,22.5,22.5],cursor:'pointer',color:this.fillColors[r][c],type:'fillColor'});
					if (this.fillColors[r][c] == 'none') continue;
					roundedRect(ctx,10+22.5*c,t+22.5*r,22.5,22.5,0,2,'#000',this.fillColors[r][c]);
				}
			}
		}
		drawStyleCanvas.move = function(e) {
			updateMouse(e);
			if (typeof this.cursorPos !== 'undefined') {
				for (var c = 0; c < this.cursorPos.length; c++) {
					var pos = this.cursorPos[c];
					if (mouseHitRect(pos.rect[0],pos.rect[1],pos.rect[2],pos.rect[3])) {
						this.style.cursor = pos.cursor;
						this.cursorIndex = c;
						return;
					}
				}
			}
			this.cursorIndex = -1;
			this.style.cursor = 'default';
		}
		drawStyleCanvas.click = function(e) {
			if (this.cursorIndex == -1) return;
			var pos = this.cursorPos[this.cursorIndex];
			switch (pos.type) {
				case 'lineColor':
					for (var s = 0; s < this.selected.length; s++) {
						var p = this.selected[s];
						for (var o = 0; o < draw.path[p].obj.length; o++) {
							var obj = draw.path[p].obj[o];
							if (!un(draw[obj.type]) && !un(draw[obj.type].setLineColor)) {
								draw[obj.type].setLineColor(obj,pos.color);
								continue;
							}
							if (['pen','line','circle','ellipse','rect','square','arc','curve','curve2','polygon','text','simpleGrid'].indexOf(obj.type) > -1) {
								obj.color = pos.color;
							}
							if (['angle'].indexOf(obj.type) > -1) {
								obj.lineColor = pos.color;
							}
							if (['table2'].indexOf(obj.type) > -1) {
								var selCount = draw.table2.countSelectedCells(obj);
								var cells = selCount == 0 ? draw.table2.getAllCells(obj) : draw.table2.getSelectedCells(obj);
								for (var c = 0; c < cells.length; c++) {
									var cell = cells[c];
									if (!un(cell.box)) {
										cell.box.borderColor = pos.color;
									} else {
										if (pos.color !== 'none') {
											cell.box = {
												color:'none',
												borderColor:pos.color,
												borderWidth:3,
												borderRadius:0,
												show:true
											}
										}
									}
								}
							}
						}
					}
					draw.color = pos.color;
					this.lineColor = pos.color;
					break;
				case 'fillColor':
					for (var s = 0; s < this.selected.length; s++) {
						var p = this.selected[s];
						for (var o = 0; o < draw.path[p].obj.length; o++) {
							var obj = draw.path[p].obj[o];
							if (!un(draw[obj.type]) && !un(draw[obj.type].setFillColor)) {
								draw[obj.type].setFillColor(obj,pos.color);
								continue;
							}
							if (['pen','line','circle','ellipse','rect','square','arc','curve','curve2','polygon','text','angle'].indexOf(obj.type) > -1) {
								obj.fillColor = pos.color;
							}
							if (['table2'].indexOf(obj.type) > -1) {
								var selCount = draw.table2.countSelectedCells(obj);
								var cells = selCount == 0 ? draw.table2.getAllCells(obj) : draw.table2.getSelectedCells(obj);
								for (var c = 0; c < cells.length; c++) {
									var cell = cells[c];
									if (!un(cell.box)) {
										cell.box.color = pos.color;
									} else {
										if (pos.color !== 'none') {
											cell.box = {
												color:pos.color,
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
					}
					draw.fillColor = pos.color;
					this.fillColor = pos.color;
					break;
				case 'lineWidth':
					this.lineWidth += pos.diff;
					if (this.lineWidth < 1) this.lineWidth = 1;
					for (var s = 0; s < this.selected.length; s++) {
						var p = this.selected[s];
						for (var o = 0; o < draw.path[p].obj.length; o++) {
							var obj = draw.path[p].obj[o];
							if (!un(draw[obj.type]) && !un(draw[obj.type].setLineWidth)) {
								draw[obj.type].setLineWidth(obj,this.lineWidth);
								continue;
							}
							if (['pen','line','circle','ellipse','rect','square','arc','curve','curve2','polygon','button','text','anglesAroundPoint','simpleGrid'].indexOf(obj.type) > -1) {							
								obj.thickness = this.lineWidth;
							}
							if (['angle'].indexOf(obj.type) > -1) {
								obj.lineWidth = this.lineWidth;
							}
							if (['table2'].indexOf(obj.type) > -1) {
								var selCount = draw.table2.countSelectedCells(obj);
								var cells = selCount == 0 ? draw.table2.getAllCells(obj) : draw.table2.getSelectedCells(obj);
								for (var c = 0; c < cells.length; c++) {
									var cell = cells[c];
									if (!un(cell.box)) cell.box.borderWidth = this.lineWidth;
								}
							}
						}
					}
					draw.thickness = this.lineWidth;
					break;
				case 'lineDash':
					this.lineDash[0] += pos.diff;
					this.lineDash[1] += pos.diff;
					if (this.lineDash[0] < 0) this.lineDash[0] = 0;
					if (this.lineDash[1] < 0) this.lineDash[0] = 0;
					for (var s = 0; s < this.selected.length; s++) {
						var p = this.selected[s];
						for (var o = 0; o < draw.path[p].obj.length; o++) {
							var obj = draw.path[p].obj[o];
							if (!un(draw[obj.type]) && !un(draw[obj.type].setLineDash)) {
								draw[obj.type].setLineDash(obj,clone(this.lineDash));
							} else if (['pen','line','circle','ellipse','rect','square','arc','curve','curve2','polygon','button','text'].indexOf(obj.type) > -1) {
								obj.dash = clone(this.lineDash);
							} else if (['table2'].indexOf(obj.type) > -1) {
								var selCount = draw.table2.countSelectedCells(obj);
								var cells = selCount == 0 ? draw.table2.getAllCells(obj) : draw.table2.getSelectedCells(obj);
								for (var c = 0; c < cells.length; c++) {
									var cell = cells[c];
									if (!un(cell.box)) cell.box.dash = clone(this.lineDash);
								}
							}
						}
					}
					draw.dash = clone(this.lineDash);
					break;
				case 'radius':
					this.radius += pos.diff;
					if (this.radius < 0) this.radius = 0;					
					for (var s = 0; s < this.selected.length; s++) {
						var p = this.selected[s];
						for (var o = 0; o < draw.path[p].obj.length; o++) {
							var obj = draw.path[p].obj[o];
							if (!un(draw[obj.type]) && !un(draw[obj.type].setRadius)) {
								draw[obj.type].setRadius(obj,clone(this.radius));
								continue;
							}
							if (['text'].indexOf(obj.type) > -1) {
								obj.radius = clone(this.radius);
							}
							if (['table2'].indexOf(obj.type) > -1) {
								var selCount = draw.table2.countSelectedCells(obj);
								var cells = selCount == 0 ? draw.table2.getAllCells(obj) : draw.table2.getSelectedCells(obj);
								for (var c = 0; c < cells.length; c++) {
									var cell = cells[c];
									if (!un(cell.box)) {
										cell.box.radius = this.radius;
									} else {
										if (pos.color !== 'none') {
											cell.box = {
												fillColor:'none',
												lineColor:'#000',
												borderWidth:3,
												radius:this.radius,
												show:true
											}
										}
									}
								}
							}	
						}
					}
					draw.radius = clone(this.radius);
					break;
			}
			drawCanvasPaths();
			redrawButtons();
			this.draw();
		}
		drawStyleCanvas.close = function(e) {
			if (e.target == draw.drawStyleCanvas) return;
			if (e.target == draw.drawStyleCanvas.button) return;
			//if (e.target == draw.drawStyleCanvas.lineColorInput.cursorCanvas) return;
			//if (e.target == draw.drawStyleCanvas.fillColorInput.cursorCanvas) return;
			draw.drawStyleSelectVisible = false;
			changeDrawMode();
			redrawButtons();
			hideObj(draw.drawStyleCanvas,draw.drawStyleCanvas.data);
			//hideMathsInput(draw.drawStyleCanvas.lineColorInput);
			//hideMathsInput(draw.drawStyleCanvas.fillColorInput);
			removeListenerMove(draw.drawStyleCanvas,draw.drawStyleCanvas.move);
			removeListener(draw.drawStyleCanvas,draw.drawStyleCanvas.click);
			removeListener(window,draw.drawStyleCanvas.close);			
		}
	}
	if (typeof object.align == 'object') {
		var buttonPos = object.align.buttonPos || [1120,620];
		var button = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		button.type = 'align';
		button.draw = function() {
			var color = draw.buttonColor;
			if (draw.alignSelectVisible == true) color = draw.buttonSelectedColor;
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',color);
			text({context:this.ctx,left:0,width:55,top:15,textArray:['<<font:Arial>><<fontSize:14>><<align:center>>ALIGN']});			
		}
		button.click = function() {
			draw.alignSelectVisible = !draw.alignSelectVisible;
			if (draw.alignSelectVisible == true) {
				changeDrawMode('align');
				showObj(draw.alignCanvas,draw.alignCanvas.data);
				draw.alignCanvas.draw();
				addListenerMove(draw.alignCanvas,draw.alignCanvas.move);
				addListener(draw.alignCanvas,draw.alignCanvas.click);
				addListener(window,draw.alignCanvas.close);
			} else {
				changeDrawMode();
				hideObj(draw.alignCanvas,draw.alignCanvas.data);
				removeListenerMove(draw.alignCanvas,draw.alignCanvas.move);
				removeListener(draw.alignCanvas,draw.alignCanvas.click);
				removeListener(window,draw.alignCanvas.close);
			}			
		}
		draw.buttons.push(button);
		
		var left = buttonPos[0];
		var top = buttonPos[1]+53;
		var alignCanvas = createCanvas(left,top,170,170,false,false,true,zIndex+1001000);
		alignCanvas.isStaticMenuCanvas = true;	
		alignCanvas.selected = -1;
		alignCanvas.button = button;
		draw.alignCanvas = alignCanvas;
		draw.alignSelectVisible = false;
		
		alignCanvas.cursorPos = [];
		alignCanvas.cursorIndex = -1;
		alignCanvas.left = left;
		alignCanvas.top = top;
		alignCanvas.draw = function() {
			var ctx = this.ctx;
			roundedRect(ctx,3,3,this.data[102]-6,this.data[103]-6,8,6,'#000','#FFC');
			this.cursorPos = [];
			
			var left = this.left;
			var top = this.top;
			
			text({context:ctx,textArray:['<<fontSize:14>>Left'],left:10,top:10,width:50,height:50,textAlign:'center',vertAlign:'middle',box:{color:'#CFC',borderWidth:2}});
			text({context:ctx,textArray:['<<fontSize:14>>Center'],left:60,top:10,width:50,height:50,textAlign:'center',vertAlign:'middle',box:{color:'#CFC',borderWidth:2}});
			text({context:ctx,textArray:['<<fontSize:14>>Right'],left:110,top:10,width:50,height:50,textAlign:'center',vertAlign:'middle',box:{color:'#CFC',borderWidth:2}});
			
			text({context:ctx,textArray:['<<fontSize:14>>Top'],left:10,top:60,width:50,height:50,textAlign:'center',vertAlign:'middle',box:{color:'#CFC',borderWidth:2}});
			text({context:ctx,textArray:['<<fontSize:14>>Middle'],left:60,top:60,width:50,height:50,textAlign:'center',vertAlign:'middle',box:{color:'#CFC',borderWidth:2}});
			text({context:ctx,textArray:['<<fontSize:14>>Bottom'],left:110,top:60,width:50,height:50,textAlign:'center',vertAlign:'middle',box:{color:'#CFC',borderWidth:2}});
			
			text({context:ctx,textArray:['<<fontSize:14>>to margin (left)'],left:10,top:110,width:150,height:50,textAlign:'center',vertAlign:'middle',box:{color:'#CFC',borderWidth:2}});
			
			this.cursorPos.push({rect:[left+10,top+10,50,50],cursor:'pointer',type:'left'});
			this.cursorPos.push({rect:[left+60,top+10,50,50],cursor:'pointer',type:'center'});
			this.cursorPos.push({rect:[left+110,top+10,50,50],cursor:'pointer',type:'right'});
			this.cursorPos.push({rect:[left+10,top+60,50,50],cursor:'pointer',type:'top'});
			this.cursorPos.push({rect:[left+60,top+60,50,50],cursor:'pointer',type:'middle'});
			this.cursorPos.push({rect:[left+110,top+60,50,50],cursor:'pointer',type:'bottom'});
			this.cursorPos.push({rect:[left+10,top+110,150,50],cursor:'pointer',type:'toMargin'});
		}
		alignCanvas.move = function(e) {
			updateMouse(e);
			if (typeof this.cursorPos !== 'undefined') {
				for (var c = 0; c < this.cursorPos.length; c++) {
					var pos =this.cursorPos[c];
					if (mouseHitRect(pos.rect[0],pos.rect[1],pos.rect[2],pos.rect[3])) {
						this.style.cursor = pos.cursor;
						this.cursorIndex = c;
						return;
					}
				}
			}			
			this.cursorIndex = -1;
			this.style.cursor = 'default';
		}
		alignCanvas.click = function(e) {
			if (this.cursorIndex == -1) return;
			var pos = this.cursorPos[this.cursorIndex];
			if (pos.type == 'toMargin') {
				snapToMargin();
			} else {
				alignPaths(pos.type);
			}
		}
		alignCanvas.close = function(e) {
			if (e.target == draw.alignCanvas) return;
			if (e.target == draw.alignCanvas.button) return;
			draw.alignSelectVisible = false;
			changeDrawMode();
			redrawButtons();
			hideObj(draw.alignCanvas,draw.alignCanvas.data);
			removeListenerMove(draw.alignCanvas,draw.alignCanvas.move);
			removeListener(draw.alignCanvas,draw.alignCanvas.click);
			removeListener(window,draw.alignCanvas.close);			
		}
	}	
	if (typeof object.save == 'object') {
		var buttonPos = object.save.buttonPos || [1120,620];
		var saveButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		saveButton.type = 'save';
		saveButton.draw = function() {
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',draw.buttonColor);
			text({context:this.ctx,left:0,width:55,top:15,textArray:['<<font:Arial>><<fontSize:16>><<align:center>>SAVE']});				
		}
		saveButton.click = function() {
			var filename = prompt("Please enter filename", "file");
			saveDrawPaths(filename);		
		}		
		draw.buttons.push(saveButton);
	}
	if (typeof object.load == 'object') {
		var buttonPos = object.load.buttonPos || [1120,620];
		var loadButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		loadButton.type = 'load';
		loadButton.draw = function() {
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',draw.buttonColor);
			text({context:this.ctx,left:0,width:55,top:15,textArray:['<<font:Arial>><<fontSize:16>><<align:center>>LOAD']});				
		}
		loadButton.click = function() {
			loadDrawPaths();			
		}		
		draw.buttons.push(loadButton);
	}
	if (typeof object.png == 'object') {
		var buttonPos = object.png.buttonPos || [1120,620];
		var pngButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		pngButton.type = 'png';
		pngButton.draw = function() {
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',draw.buttonColor);
			text({context:this.ctx,left:0,width:55,top:15,textArray:['<<font:Arial>><<fontSize:20>><<align:center>>PNG']});			
		}
		pngButton.click = function() {
			var filename = Number(prompt("Scale Factor", "2"));
			png(filename);			
		}		
		draw.buttons.push(pngButton);
	}
	if (typeof object.pdf == 'object') {
		var buttonPos = object.pdf.buttonPos || [1120,620];
		var pdfButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		pdfButton.type = 'pdf';
		pdfButton.draw = function() {
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',draw.buttonColor);
			text({context:this.ctx,left:0,width:55,top:15,textArray:['<<font:Arial>><<fontSize:20>><<align:center>>PDF']});			
		}
		pdfButton.click = function() {
			var filename = prompt("Please enter filename", "file");
			pdf(filename);			
		}		
		draw.buttons.push(pdfButton);
	}
	if (typeof object.js == 'object') {
		var buttonPos = object.js.buttonPos || [1120,620];
		var jsButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		jsButton.type = 'js';
		jsButton.draw = function() {
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',draw.buttonColor);
			text({context:this.ctx,left:0,width:55,top:15,textArray:['<<font:Arial>><<fontSize:20>><<align:center>>JS']});			
		}
		jsButton.click = function() {
			preview();			
		}		
		draw.buttons.push(jsButton);
	}
	if (typeof object.simpleGrid == 'object') {
		var buttonPos = object.simpleGrid.buttonPos || [1120,620];
		var simpleGridButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		simpleGridButton.type = 'simpleGrid';
		simpleGridButton.draw = function() {
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',draw.buttonColor);
			this.ctx.strokeStyle = '#000';
			this.ctx.lineWidth = 1;
			for (var i = 12.5; i <= 42.5; i += 10) {
				this.ctx.moveTo(i,12.5);
				this.ctx.lineTo(i,42.5);
				this.ctx.moveTo(12.5,i);
				this.ctx.lineTo(42.5,i);	
			}
			this.ctx.stroke();
		}
		simpleGridButton.click = function() {
			draw.simpleGrid.add(10,10,30);
		}		
		draw.buttons.push(simpleGridButton);
	}
	if (typeof object.dotGrid == 'object') {
		var buttonPos = object.dotGrid.buttonPos || [1120,620];
		var dotGridButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		dotGridButton.type = 'simpleGrid';
		dotGridButton.draw = function() {
			roundedRect(this.ctx,3,3,49,49,8,6,'#000',draw.buttonColor);
			this.ctx.fillStyle = '#000';
			for (var i = 12.5; i <= 42.5; i += 10) {
				for (var j = 12.5; j <= 42.5; j += 10) {
					this.ctx.beginPath();
					this.ctx.arc(i,j,1.5,0,2*Math.PI);
					this.ctx.fill();
				}
			}
			this.ctx.stroke();
		}
		dotGridButton.click = function() {
			draw.simpleGrid.add(10,10,30,true);
		}		
		draw.buttons.push(dotGridButton);
	}	
	if (typeof object.backGrid == 'object') {
		var buttonPos = object.backGrid.buttonPos || [1120,620];
		var obj = {};
		obj.canvas = createCanvas(draw.drawArea[0],draw.drawArea[1],draw.drawArea[2],draw.drawArea[3],true,false,false,1);
		obj.menuButton = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
		obj.menuButton.draw = function() {
			var ctx = this.ctx;
			if (draw.backGrid.showMenu == false) {
				roundedRect(ctx,3,3,49,49,8,6,'#000','#C9F');
			} else {
				roundedRect(ctx,3,3,49,49,8,6,'#000','#FFC');		
			}
			ctx.strokeStyle = '#000';
			ctx.lineWidth = 1;
			for (var i = 15; i < 41; i += 12.5) {
				ctx.moveTo(i,0);
				ctx.lineTo(i,55);
				ctx.moveTo(0,i);
				ctx.lineTo(55,i);	
			}
			ctx.stroke();			
		}
		
		obj.show = true;
		obj.snap = true;
		obj.showMenu = false;
		obj.size = 25.25;
		obj.menuCanvas = createCanvas(buttonPos[0]-169,buttonPos[1]+55,220,400,false,false,true,draw.drawButtonZIndex+1);
		roundedRect(obj.menuCanvas.ctx,3,3,214,394,8,6,'#000','#C9F');	
		obj.showButton = createCanvas(buttonPos[0]-134,buttonPos[1]+175,150,40,false,false,true,draw.drawButtonZIndex+1);
		obj.snapButton = createCanvas(buttonPos[0]-134,buttonPos[1]+220,150,40,false,false,true,draw.drawButtonZIndex+1);
		obj.slider = createSlider({id:0,left:buttonPos[0]-150,top:buttonPos[1]+75,width:200,height:50,linkedVar:'draw.backGrid.size',min:5,max:100,startNum:50,discrete:true,stepNum:5,visible:false,zIndex:draw.drawButtonZIndex+1,vari:'Grid Size',varChangeListener:'draw.backGrid.drawBackGrid'});
		drawTextBox(obj.showButton,obj.showButton.ctx,obj.showButton.data,'#6F9','#000',4,'20px Arial','#000','center','Grid On');
		drawTextBox(obj.snapButton,obj.snapButton.ctx,obj.snapButton.data,'#6F9','#000',4,'20px Arial','#000','center','Snapping On');
		
		obj.showHideBackGridMenu = function() {
			var obj = draw.backGrid;
			obj.showMenu = !obj.showMenu;
			if (obj.showMenu == true) {
				showObj(obj.menuCanvas,obj.menuCanvas.data);
				showObj(obj.showButton,obj.showButton.data);
				showObj(obj.snapButton,obj.snapButton.data);
				showSlider(obj.slider);
				for (var i = 0; i < obj.alignHorizVertButtons.length; i++) {
					obj.alignHorizVertButtons[i].highlight = false;
					obj.alignHorizVertButtons[i].draw();
					showObj(obj.alignHorizVertButtons[i],obj.alignHorizVertButtons[i].data);
				}
				addListener(window,draw.backGrid.hideBackGridMenu);
			} else {
				hideObj(obj.menuCanvas,obj.menuCanvas.data);
				hideObj(obj.showButton,obj.showButton.data);
				hideObj(obj.snapButton,obj.snapButton.data);
				hideSlider(obj.slider);
				for (var i = 0; i < obj.alignHorizVertButtons.length; i++) {
					hideObj(obj.alignHorizVertButtons[i],obj.alignHorizVertButtons[i].data);
				}
				removeListener(window,draw.backGrid.hideBackGridMenu);
			}
			obj.menuButton.draw();
		}
		obj.hideBackGridMenu = function(e) {
			var obj = draw.backGrid;
			if ([
				obj.menuButton,
				obj.menuCanvas,
				obj.showButton,
				obj.snapButton,
				obj.slider.backCanvas,
				obj.slider.sliderCanvas,
				obj.labelCanvas
			].indexOf(e.target) == -1 && obj.alignHorizVertButtons.indexOf(e.target) == -1) {
				obj.showMenu = false;
				hideObj(obj.menuCanvas,obj.menuCanvas.data);
				hideObj(obj.showButton,obj.showButton.data);
				hideObj(obj.snapButton,obj.snapButton.data);
				hideSlider(obj.slider);
				for (var i = 0; i < obj.alignHorizVertButtons.length; i++) {
					hideObj(obj.alignHorizVertButtons[i],obj.alignHorizVertButtons[i].data);
				}
				obj.menuButton.draw();
				removeListener(window,obj.hideBackGridMenu);
			}
		}		

		obj.showHideBackGrid = function() {
			var obj = draw.backGrid;
			obj.show = !obj.show;
			if (obj.show == true) { 
				drawTextBox(obj.showButton,obj.showButton.ctx,obj.showButton.data,'#6F9','#000',4,'20px Arial','#000','center','Grid On');
			} else {
				drawTextBox(obj.showButton,obj.showButton.ctx,obj.showButton.data,'#F00','#000',4,'20px Arial','#000','center','Grid Off');
			}
			obj.drawBackGrid();
		}
		obj.snapOnOff = function() {
			var obj = draw.backGrid;			
			obj.snap = !obj.snap;
			draw.gridSnap = obj.snap;
			if (obj.snap == true) { 
				drawTextBox(obj.snapButton,obj.snapButton.ctx,obj.snapButton.data,'#6F9','#000',4,'20px Arial','#000','center','Snapping On');
			} else {
				drawTextBox(obj.snapButton,obj.snapButton.ctx,obj.snapButton.data,'#F00','#000',4,'20px Arial','#000','center','Snapping Off');
			}
			obj.drawBackGrid();
		}		
		
		obj.drawBackGrid = function() {
			var ctx = draw.backGrid.canvas.ctx;
			var l = draw.gridSnapRect[0];
			var t = draw.gridSnapRect[1];
			var w = draw.gridSnapRect[2];
			var h = draw.gridSnapRect[3];
			ctx.clearRect(l,t,w,h);
			var marginSize = mainCanvasBorderWidth;
			var margin = [l+marginSize,l+w-marginSize,t+marginSize,t+h-marginSize];
			if (draw.backGrid.show == true) {
				/*var count = -1;
				for (var i = l; i <= l+w; i += draw.backGrid.size) {
					count++;					
					if (i <= margin[0] || i >= margin[1]) continue;
					if (count % 10 == 0) {
						ctx.strokeStyle = '#BBB';
						ctx.lineWidth = 1.5;
						ctx.setLineDash([]);
					} else if (count % 5 == 0) {
						ctx.strokeStyle = '#CCC';
						ctx.lineWidth = 1;
						ctx.setLineDash([]);
					} else {
						ctx.strokeStyle = '#CCC';
						ctx.lineWidth = 0.5;
						if (draw.backGrid.size >= 25) ctx.setLineDash([]);				
					}
					ctx.beginPath();
					ctx.moveTo(i,Math.max(margin[2],t));
					ctx.lineTo(i,Math.min(margin[3],t+h));
					ctx.stroke();
				}
				var count = -1;
				for (var i = t; i <= t+h; i += draw.backGrid.size) {
					count++;
					if (i <= margin[2] || i >= margin[3]) continue;
					if (count % 10 == 0) {
						ctx.strokeStyle = '#BBB';
						ctx.lineWidth = 1.5;
						ctx.setLineDash([]);
					} else if (count % 5 == 0) {
						ctx.strokeStyle = '#CCC';
						ctx.lineWidth = 1;
						ctx.setLineDash([]);
					} else {
						ctx.strokeStyle = '#CCC';
						ctx.lineWidth = 0.5;
						if (draw.backGrid.size >= 25) ctx.setLineDash([]);				
					}
					ctx.beginPath();
					ctx.moveTo(Math.max(margin[0],l),i);
					ctx.lineTo(Math.min(margin[1],l+w),i);
					ctx.stroke();
				}*/
				if (arraysEqual(draw.gridMargin,[0,0,0,0]) == false) {
					var m = draw.gridMargin;
					ctx.strokeStyle = '#F00';
					ctx.lineWidth = 2;
					ctx.setLineDash([]);
					ctx.strokeRect(m[0],m[1],draw.drawArea[2]-m[0]-m[2],draw.drawArea[3]-m[1]-m[3]);
				}
				for (var i = 0; i < draw.gridVertMargins.length; i++) {
					var m = draw.gridVertMargins[i];
					ctx.beginPath();
					ctx.strokeStyle = '#F00';
					ctx.lineWidth = 2;
					ctx.setLineDash([]);
					ctx.moveTo(m,draw.gridMargin[1]);
					ctx.lineTo(m,draw.drawArea[3]-draw.gridMargin[3]);
					ctx.stroke();
				}
				for (var i = 0; i < draw.gridHorizMargins.length; i++) {
					var m = draw.gridHorizMargins[i];
					ctx.beginPath();
					ctx.strokeStyle = '#F00';
					ctx.lineWidth = 2;
					ctx.setLineDash([]);
					ctx.moveTo(draw.gridMargin[0],m);
					ctx.lineTo(draw.drawArea[2]-draw.gridMargin[2],m);
					ctx.stroke();
				}
			}
			/*ctx.strokeStyle = '#000';
			ctx.lineWidth = 2;
			ctx.setLineDash([]);
			ctx.beginPath();
			ctx.moveTo(0,100);
			ctx.lineTo(1200,100);
			ctx.stroke();*/
			draw.gridSnapSize = draw.backGrid.size;
		}

		obj.menuCanvas.style.cursor = 'default';
		addListenerMove(obj.menuCanvas,function() {
			var obj = draw.backGrid;
			for (var i = 0; i < obj.alignHorizVertButtons.length; i++) {
				if (obj.alignHorizVertButtons[i].highlight == true) {
					obj.alignHorizVertButtons[i].highlight = false;
					obj.alignHorizVertButtons[i].draw();
				}
			}
		});
		obj.alignHorizVertButtonsMove = function(e) {
			var obj = draw.backGrid;
			for (var i = 0; i < obj.alignHorizVertButtons.length; i++) {
				if (obj.alignHorizVertButtons[i] == e.target) {
					obj.alignHorizVertButtons[i].highlight = true;
				} else {
					obj.alignHorizVertButtons[i].highlight = false;
				}
				obj.alignHorizVertButtons[i].draw();
			}
		}
		obj.alignHorizVertButtonsPress = function(e) {
			var obj = draw.backGrid;
			draw.vertSnap = e.target.vert;
			draw.horizSnap = e.target.horiz;
			for (var i = 0; i < obj.alignHorizVertButtons.length; i++) {
				obj.alignHorizVertButtons[i].draw();
			}
		}
		draw.backGrid = obj;
		obj.menuButton.draw();
		obj.drawBackGrid();
		addListener(draw.backGrid.menuButton,draw.backGrid.showHideBackGridMenu);
		addListener(draw.backGrid.showButton,draw.backGrid.showHideBackGrid);
		addListener(draw.backGrid.snapButton,draw.backGrid.snapOnOff);			
		obj.alignHorizVertButtons = [];
		for (var i = 0; i < 9; i++) {
			var button = createCanvas(buttonPos[0]-130+50*(i%3),buttonPos[1]+285+50*Math.floor(i/3),50,50,false,false,true,draw.drawButtonZIndex+1);
			button.x = 10+15*(i%3);
			button.y = 13+12*Math.floor(i/3);
			button.horiz = ['left','center','right'][i%3];
			button.vert = ['top','middle','bottom'][Math.floor(i/3)];
			button.highlight = false;
			button.draw = function() {
				var color = '#FFC';
				if (this.highlight == true) color = '#FCF';
				if (draw.vertSnap == this.vert && draw.horizSnap == this.horiz) color = '#F6F';
				roundedRect(this.ctx,1,1,48,48,0,2,'#000',color);
				roundedRect(this.ctx,10,13,30,24,0,1,'#000','#CCF');
				this.ctx.beginPath();
				this.ctx.strokeStyle = '#F00';
				this.ctx.lineWidth = 2;
				this.ctx.moveTo(this.x-5,this.y-5);
				this.ctx.lineTo(this.x+5,this.y+5);
				this.ctx.moveTo(this.x-5,this.y+5);
				this.ctx.lineTo(this.x+5,this.y-5);	
				this.ctx.stroke();
			}
			button.draw();
			
			addListenerMove(button,draw.backGrid.alignHorizVertButtonsMove);
			addListener(button,draw.backGrid.alignHorizVertButtonsPress);
			
			obj.alignHorizVertButtons.push(button);
		}
	}
	if (typeof object.backGrid2 == 'object') { // no button
		var obj = {};
		obj.canvas = createCanvas(draw.drawArea[0],draw.drawArea[1],draw.drawArea[2],draw.drawArea[3],true,false,false,1);
		obj.show = true;

		obj.showGrid = function() {
			var obj = draw.backGrid;
			obj.show = true;
			snapBordersOn = true;
			showObj(draw.backGrid.canvas);
			obj.drawBackGrid();
		}
		obj.hideGrid = function() {
			var obj = draw.backGrid;
			obj.show = false;
			snapBordersOn = false;
			hideObj(draw.backGrid.canvas);
			obj.drawBackGrid();
		}
		obj.drawBackGrid = function() {
			var ctx = draw.backGrid.canvas.ctx;
			var l = draw.gridSnapRect[0];
			var t = draw.gridSnapRect[1];
			var w = draw.gridSnapRect[2];
			var h = draw.gridSnapRect[3];
			ctx.clear();
			var marginSize = mainCanvasBorderWidth;
			var margin = [l+marginSize,l+w-marginSize,t+marginSize,t+h-marginSize];
			if (draw.backGrid.show == true) {
				if (arraysEqual(draw.gridMargin,[0,0,0,0]) == false) {
					var m = draw.gridMargin;
					ctx.strokeStyle = '#F00';
					ctx.lineWidth = 2;
					ctx.setLineDash([]);
					ctx.strokeRect(m[0],m[1],draw.drawArea[2]-m[0]-m[2],draw.drawArea[3]-m[1]-m[3]);
				}
				for (var i = 0; i < draw.gridVertMargins.length; i++) {
					var m = draw.gridVertMargins[i];
					ctx.beginPath();
					ctx.strokeStyle = '#F00';
					ctx.lineWidth = 2;
					ctx.setLineDash([]);
					ctx.moveTo(m,draw.gridMargin[1]);
					ctx.lineTo(m,draw.drawArea[3]-draw.gridMargin[3]);
					ctx.stroke();
				}
				for (var i = 0; i < draw.gridHorizMargins.length; i++) {
					var m = draw.gridHorizMargins[i];
					ctx.beginPath();
					ctx.strokeStyle = '#F00';
					ctx.lineWidth = 2;
					ctx.setLineDash([]);
					ctx.moveTo(draw.gridMargin[0],m);
					ctx.lineTo(draw.drawArea[2]-draw.gridMargin[2],m);
					ctx.stroke();
				}
			}
			draw.gridSnapSize = draw.backGrid.size;
		}
		draw.backGrid = obj;
		obj.drawBackGrid();
	}		
	for (var key in object) {
		if (['line','pen','polygon','rect','square'].includes(key)) continue;
		if (!un(draw[key]) && typeof draw[key].drawButton == 'function') {			
			var buttonPos = object[key].buttonPos || [1120,620];
			var button = createCanvas(buttonPos[0],buttonPos[1],55,55,true,false,true,draw.drawButtonZIndex);
			button.type = key;
			button.drawButton = draw[key].drawButton;
			button.draw = function() {
				roundedRect(this.ctx,3,3,49,49,8,6,'#000',draw.buttonColor);
				this.drawButton(this.ctx,draw.buttonSize);
			};
			button.click = draw[key].add;
			draw.buttons.push(button);			
		}
	}
	
	
	redrawButtons();
	draw.cursors.update();
	if (defaultMode == 'line') {
		setTimeout(function() {draw.cursorCanvas.style.cursor = draw.cursors.cross},1000);
	}
	
	for (var i = 0; i < draw.buttons.length; i++) {
		addListener(draw.buttons[i],drawButtonClick);
		draw.buttons[i].isStaticMenuCanvas = true;
	}
	addListenerMove(draw.cursorCanvas,drawCanvasMove);
	addListenerStart(draw.cursorCanvas,drawCanvasStart);
	if (drawMode == 'none') changeDrawMode();
	if (object.divMode === true) draw.divMode();
}
function addPen(side,color) {
	var l = 25;
	if (side == 'right') l = 1120;
	if (un(color)) color = '#F00';
	addDrawTools({
		pen:{buttonPos:[l,560]},
		undo:{buttonPos:[l,620]},
		buttonSize:50,
		thickness:5,
		color:color
	});	
}

function redrawButtons() {
	if (draw.drawMode == 'none') changeDrawMode();
	for (var i = 0; i < draw.buttons.length; i++) {
		draw.buttons[i].draw();				
	}
}
function drawButtonClick(e) {
	e.target.click();
	redrawButtons();
	drawToolsCanvas();	
	draw.cursors.update();
}
function addDrawCanvas() {
	var z = draw.zIndex + 2 * draw.drawCanvas.length;
	var canvas = createCanvas(draw.drawArea[0]+draw.drawRelPos[0],draw.drawArea[1]+draw.drawRelPos[1],draw.drawArea[2],draw.drawArea[3],false,false,false,z);
	if (!un(draw.div)) {
		canvas.setAttribute('class', 'drawDivCanvas');
		draw.div.children[0].appendChild(canvas);
	} else {
		showObj(canvas);
		resizeCanvas(canvas,draw.drawArea[0]+draw.drawRelPos[0],draw.drawArea[1]+draw.drawRelPos[1],draw.drawArea[2],draw.drawArea[3]);
	}
	draw.drawCanvas.push(canvas);
	draw.toolsCanvas.style.zIndex = z+2;
	draw.toolsCanvas.data[107] = z+2;
	//console.log('addDrawCanvas',canvas,draw.drawArea[0]+draw.drawRelPos[0],draw.drawArea[1]+draw.drawRelPos[1],draw.drawArea[2],draw.drawArea[3]);
	draw.cursorCanvas.style.zIndex = z+3;	
	draw.cursorCanvas.data[107] = z+3;
}
function changeDrawRelPos(newX,newY,includeHidden) {
	//console.log(newX,newY,arguments.callee.caller.name);
	var w = Math.max(draw.drawArea[2],draw.drawArea[2]*draw.scale);
	var h = Math.max(draw.drawArea[3],draw.drawArea[3]*draw.scale);
	var prevX = draw.drawRelPos[0];
	var prevY = draw.drawRelPos[1];
	draw.drawRelPos[0] = newX;
	draw.drawRelPos[1] = newY;
	var x = draw.drawArea[0] + draw.drawRelPos[0];
	var y = draw.drawArea[1] + draw.drawRelPos[1];
	for (var c = 0; c < draw.drawCanvas.length; c++) {
		if (includeHidden == false && draw.drawCanvas[c].parentNode == 'undefined') continue;
		if (includeHidden == false && draw.flattenMode == true && typeof draw.pathCanvas !== 'undefined' && draw.pathCanvas.indexOf(c) == -1 && c < draw.drawCanvas.length - 2) continue;
		draw.drawCanvas[c].data[100] = x;
		draw.drawCanvas[c].data[101] = y;
		draw.drawCanvas[c].data[102] = w;
		draw.drawCanvas[c].data[103] = h;
		resizeCanvas2(draw.drawCanvas[c],x,y,w,h);
	}
	if (!un(draw.cursorPosHighlight) && !un(draw.cursorPosHighlight.canvas)) {
		resizeCanvas2(draw.cursorPosHighlight.canvas,x,y);
	}
	if (includeHidden == true) {
		draw.cursorCanvas.data[100] = x;
		draw.cursorCanvas.data[101] = y;
		draw.cursorCanvas.data[102] = w;
		draw.cursorCanvas.data[103] = h;
		resizeCanvas2(draw.cursorCanvas,x,y,w,h);
	}
	draw.toolsCanvas.data[100] = x;
	draw.toolsCanvas.data[101] = y;
	draw.toolsCanvas.data[102] = w;
	draw.toolsCanvas.data[103] = h;
	resizeCanvas2(draw.toolsCanvas,x,y,w,h);
	draw.cursorCanvas.data[100] = x;
	draw.cursorCanvas.data[101] = y;
	draw.cursorCanvas.data[102] = w;
	draw.cursorCanvas.data[103] = h;
	resizeCanvas2(draw.cursorCanvas,x,y,w,h);
	
	if (typeof screenShade !== 'undefined') {
		screenShade.position();
	}
	
	if (typeof draw.backGrid !== 'undefined') {
		draw.backGrid.canvas.data[100] = x;
		draw.backGrid.canvas.data[101] = y;
		draw.backGrid.canvas.data[102] = w;
		draw.backGrid.canvas.data[103] = h;
		resizeCanvas2(draw.backGrid.canvas,x,y,w,h);		
	}
	
	for (var p = 0; p < draw.path.length; p++) {
		if (!un(draw.path[p]._canvas)) {
			var canvas = draw.path[p]._canvas;
			resizeCanvas3(canvas,canvas.drawPos+draw.drawRelPos[0],canvas.drawPos+draw.drawRelPos[1]);
		}
	}
	if (includeHidden == true) calcCursorPositions();
}
function changeDrawArea(drawArea,setDrawRelPos) {
	draw.drawArea = drawArea;
	//console.log(drawArea);
	var canvases = [draw.cursorCanvas,draw.toolsCanvas].concat(draw.drawCanvas);//.concat(draw.drawCanvas2);
	//console.log(canvases);
	for (var c = 0; c < canvases.length; c++) {
		canvases[c].width = drawArea[2];
		canvases[c].height = drawArea[3];
		canvases[c].data[100] = drawArea[0];
		canvases[c].data[101] = drawArea[1];
		canvases[c].data[102] = drawArea[2];
		canvases[c].data[103] = drawArea[3];
		resizeCanvas3(canvases[c]);
	}
	if (boolean(setDrawRelPos,true) == true) changeDrawRelPos(0,0);
}
function changeDrawMode(mode,altMode) {
	if (typeof mode === 'undefined') mode = draw.defaultMode;
	if (typeof altMode === 'undefined') altMode = draw.defaultMode;
	if (mode === draw.drawMode) mode = altMode;
	if (mode === 'prev') mode = draw.prevDrawMode || draw.defaultMode;
	draw.prevDrawMode = draw.drawMode;
	draw.drawMode = mode;
	if (mode === 'select' || mode == 'none') {
		if (draw.retainCursorCanvas == true) {
			draw.cursorCanvas.style.pointerEvents = 'auto';
		} else {
			draw.cursorCanvas.style.pointerEvents = 'none';
		}
	} else {
		draw.cursorCanvas.style.pointerEvents = 'auto';
	}
	if (['line','rect','square','circle','ellipse','polygon'].includes(mode)) {
		draw.cursors.update();
		draw.cursorCanvas.style.cursor = 'url('+draw.lineCursor+') '+draw.lineCursorHotspot[0]+' '+draw.lineCursorHotspot[1]+', auto';
	}
	//console.log('-',mode);
	calcCursorPositions();
}

function colorSelectClose(e) {
	if (e.target.type !== 'colorSelect') {
		draw.colorSelectVisible = false;
		for (var i = 0; i < draw.colorButtons.length; i++) {
			hideObj(draw.colorButtons[i],draw.colorButtons[i].data)
		}
		for (var i = 0; i < container.childNodes.length; i++) {
			if (draw.colorButtons.indexOf(container.childNodes[i]) == -1) {
				removeListenerStart(container.childNodes[i],colorSelectClose);
			}
		}	
		redrawButtons();
	}
}
function fillColorSelectClose(e) {
	if (e.target.type !== 'fillColorSelect') {
		draw.fillColorSelectVisible = false;
		for (var i = 0; i < draw.fillColorButtons.length; i++) {
			hideObj(draw.fillColorButtons[i],draw.fillColorButtons[i].data)
		}
		for (var i = 0; i < container.childNodes.length; i++) {
			if (draw.fillColorButtons.indexOf(container.childNodes[i]) == -1) {
				removeListenerStart(container.childNodes[i],fillColorSelectClose);
			}
		}	
		redrawButtons();
	}
}
function redrawThicknessButtons() {
	for (var i = 1; i < draw.thicknessButtons.length; i++) {
		var button = draw.thicknessButtons[i];
		button.ctx.clearRect(0,0,100,50);
		button.ctx.lineCap = 'round';
		button.ctx.lineJoin = 'round';
		button.ctx.lineWidth = 4;
	
		button.ctx.strokeStyle = '#000';
		button.ctx.fillStyle = '#FFC';
		if (button.thickness == draw.thickness) button.ctx.fillStyle = '#CFF';
		button.ctx.fillRect(0,0,100,50);
		button.ctx.strokeRect(0,0,100,50);
		
		button.ctx.beginPath();
		button.ctx.lineWidth = button.thickness;
		button.ctx.moveTo(20,25);
		button.ctx.lineTo(80,25);
		button.ctx.stroke();
	}
}
function thicknessSelectClose(e) {
	if (e.target.type !== 'thicknessSelect') {
		draw.thicknessSelectVisible = false;
		for (var i = 0; i < draw.thicknessButtons.length; i++) {
			hideObj(draw.thicknessButtons[i],draw.thicknessButtons[i].data)
		}
		for (var i = 0; i < container.childNodes.length; i++) {
			if (draw.thicknessButtons.indexOf(container.childNodes[i]) == -1) {
				removeListenerStart(container.childNodes[i],thicknessSelectClose);
			}
		}	
		redrawButtons();
	}
}
function lineEndsClose(e) {
	if (e.target.type !== 'lineEnds') {
		draw.lineEndsVisible = false;
		for (var i = 0; i < draw.lineEndStartButtons.length; i++) {
			hideObj(draw.lineEndStartButtons[i],draw.lineEndStartButtons[i].data)
		}
		for (var i = 0; i < draw.lineEndMidButtons.length; i++) {
			hideObj(draw.lineEndMidButtons[i],draw.lineEndMidButtons[i].data)
		}
		for (var i = 0; i < draw.lineEndFinButtons.length; i++) {
			hideObj(draw.lineEndFinButtons[i],draw.lineEndFinButtons[i].data)
		}
		for (var i = 0; i < draw.lineEndSizeButtons.length; i++) {
			hideObj(draw.lineEndSizeButtons[i],draw.lineEndSizeButtons[i].data)
		}		
		
		for (var i = 0; i < container.childNodes.length; i++) {
			if (draw.lineEndStartButtons.indexOf(container.childNodes[i]) == -1 && draw.lineEndMidButtons.indexOf(container.childNodes[i]) == -1 && draw.lineEndFinButtons.indexOf(container.childNodes[i]) == -1 && draw.lineEndSizeButtons.indexOf(container.childNodes[i]) == -1) {
				removeListenerStart(container.childNodes[i],lineEndsClose);
			}
		}
		redrawButtons();
	}
}
function tableMenuClose() {
	changeDrawMode();
	draw.tableSizeVisible = false;
	hideObj(draw.tableSizeCanvas,draw.tableSizeCanvas.data);
	if (!un(draw.tableRowColCanvas)) {
		draw.tableRowColCanvas.selected = -1;
		draw.tableRowColCanvas.draw();	
	}
	if (!un(draw.tableRowColCanvas)) hideObj(draw.tableRowColCanvas,draw.tableRowColCanvas.data);
	if (!un(draw.tableBordersCanvas)) hideObj(draw.tableBordersCanvas,draw.tableBordersCanvas.data);
	if (!un(draw.tableCellColorCanvas)) hideObj(draw.tableCellColorCanvas,draw.tableCellColorCanvas.data);
	if (!un(draw.tbLayoutSizeCanvas)) {
		draw.tbLayoutSizeVisible = false;
		hideObj(draw.tbLayoutSizeCanvas);
	}
	if (!un(draw.tbLayoutQSizeCanvas)) {
		draw.tbLayoutQSizeVisible = false;
		hideObj(draw.tbLayoutQSizeCanvas);
	}	
}
function tableCellsSelectionTest() {
	if (typeof draw == 'object') {
		for (var i = 0; i < draw.path.length; i++) {
			if (draw.path[i].selected == true) {
				for (var j = 0; j < draw.path[i].obj.length; j++) {
					if (draw.path[i].obj[j].type == 'table' || draw.path[i].obj[j].type == 'table2') {
						var cells = draw.path[i].obj[j].cells;
						for (var r = 0; r < cells.length; r++) {
							for (var c = 0; c < cells[r].length; c++) {
								if (cells[r][c].selected == true && cells[r][c].highlight == true) {
									return true;
								}
							}
						}
					}
				}
			}
		}
	}
	return false;
}

function isPosOverTool(x,y) {
	for (var i = 0; i < draw.toolOrder.length; i++) {
		if (draw.toolOrder[i] == 'protractor' && draw.protractorVisible == true) {
			var center = draw.protractor.center;
			var rad = draw.protractor.radius;	
			var angle = draw.protractor.angle;
			var mouseAngle = measureAngle({a:[x,y],b:[center[0],center[1]],c:[center[0]+rad*Math.cos(angle),center[1]+rad*Math.sin(angle)]});
			
			if (dist(x,y,center[0],center[1]) <= rad && mouseAngle >= 0 && mouseAngle <= Math.PI) {
				draw.protractor.prevX = x;
				draw.protractor.prevY = y;
				draw.protractor.relSelPoint = vectorFromAToB(draw.protractor.center,[x,y]);
				if (dist(x,y,center[0]+rad*Math.cos(angle),center[1]+rad*Math.sin(angle)) <= 0.5* rad || dist(x,y,center[0]-rad*Math.cos(angle),center[1]-rad*Math.sin(angle)) <= 0.5 * rad) {
					return {cursor:draw.cursors.rotate,func:drawClickProtractorStartRotate};
				} else {
					return {cursor:draw.cursors.move1,func:drawClickProtractorStartMove};				
				}
			}
		}
	
		if (draw.toolOrder[i] == 'ruler' && draw.rulerVisible == true) {
			if (hitTestPolygon([x,y],draw.ruler.verticesArray1) == true) {
				draw.ruler.prevX = x;
				draw.ruler.prevY = y;
				if (hitTestPolygon([x,y],draw.ruler.verticesArray2) == true) {
					return {cursor:draw.cursors.rotate,func:drawClickRulerStartRotate1};
				} else if (hitTestPolygon([x,y],draw.ruler.verticesArray3) == true) {
					return {cursor:draw.cursors.rotate,func:drawClickRulerStartRotate2};
				} else if (draw.ruler.markings == true && dist(draw.ruler.center[0],draw.ruler.center[1],x,y) < 25) {
					return {cursor:draw.cursors.ruler180,func:drawClickRulerRotate180};
				} else {
					return {cursor:draw.cursors.move1,func:drawClickRulerStartMove};		
				}
			}
			if (hitTestPolygon([x,y],draw.ruler.verticesArray4) == true) {
				var startPos = closestPointOnLine([x,y],draw.ruler.edgePos1,draw.ruler.edgePos2)
				draw.startX = startPos[0];
				draw.startY = startPos[1];			
				return {cursor:draw.cursors.rulerPen1,func:drawClickRulerStartDraw1};
			}
			if (hitTestPolygon([x,y],draw.ruler.verticesArray5) == true) {
				var startPos = closestPointOnLine([x,y],draw.ruler.edgePos3,draw.ruler.edgePos4)
				draw.startX = startPos[0];
				draw.startY = startPos[1];			
				return {cursor:draw.cursors.rulerPen2,func:drawClickRulerStartDraw2};
			}		
		}
		
		if (draw.toolOrder[i] == 'compass' && draw.compassVisible == true) {
			var center1 = draw.compass.center1;
			var center2 = draw.compass.center2;
			var center3 = draw.compass.center3;
			var lockCenter = draw.compass.lockCenter;
			var rad = draw.compass.radius;	
			var angle = draw.compass.angle;
		
			if (dist(x,y,lockCenter[0],lockCenter[1]) <= 30) {
				return {cursor:draw.cursors.pointer,func:drawClickCompassLock};
			} else if (dist(x,y,center2[0],center2[1]) <= 40 || hitTestPolygon([x,y],draw.compass.topPolygon) == true) {
				draw.compass.prevX = x;
				draw.compass.prevY = y;
				return {cursor:'url("/i/cursors/rotate.cur") 12 12, auto',func:drawClickCompassStartDraw};
			} else if (dist(x,y,center1[0],center1[1]) <= 30 || distancePointToLineSegment([x,y],draw.compass.center1,draw.compass.center2) <= 20) {
				draw.compass.prevX = x;
				draw.compass.prevY = y;
				// store positions relative to center1
				draw.compass.relSelPoint = vectorFromAToB(draw.compass.center1,[x,y]);
				draw.compass.relCenter2 = vectorFromAToB(draw.compass.center1,draw.compass.center2);
				draw.compass.relCenter3 = vectorFromAToB(draw.compass.center1,draw.compass.center3);
				draw.compass.relLockCenter = vectorFromAToB(draw.compass.center1,draw.compass.lockCenter);
				return {cursor:draw.cursors.move1,func:drawClickCompassStartMove1};
			} else if (dist(x,y,center3[0],center3[1]) <= 30 || distancePointToLineSegment([x,y],draw.compass.center3,draw.compass.center2) <= 20 || hitTestPolygon([x,y],draw.compass.pencilPolygon) == true) {			
				draw.compass.prevX = x;
				draw.compass.prevY = y;
				return {cursor:draw.cursors.move1,func:drawClickCompassStartMove2};
			}
		}
	}
	return false;
}
function resetDrawTools(restoreStartPaths) {
	if (typeof draw == 'undefined') return;
	if (boolean(restoreStartPaths,true) == true) draw.path = draw.startPath.slice();
	draw.color = draw.startColor;
	draw.thickness = draw.startThickness;
	draw.fillColor = draw.startFillColor;
	changeDrawMode(draw.startDrawMode);
	draw.prevDrawMode = 'none';
	draw.protractorVisible = false;
	draw.compassVisible = false;
	draw.rulerVisible = false;			
	draw.colorSelectVisible = false;
	draw.thicknessSelectVisible = false;
	draw.compassHelpSelectVisible = false;
	if (typeof draw.compassHelpBox !== 'undefined') hideObj(draw.compassHelpBox,draw.compassHelpBox.data);
	for (var i = 0; i < draw.colorButtons.length; i++) {
		hideObj(draw.colorButtons[i],draw.colorButtons[i].data)
	}
	for (var i = 0; i < draw.thicknessButtons.length; i++) {
		hideObj(draw.thicknessButtons[i],draw.thicknessButtons[i].data)
	}	
	for (var i = 0; i < container.childNodes.length; i++) {
		removeListenerStart(container.childNodes[i],colorSelectClose);
		removeListenerStart(container.childNodes[i],thicknessSelectClose);
		removeListenerStart(container.childNodes[i],fillColorSelectClose);
	}
	if (typeof draw.protractor !== 'undefined') {
		draw.protractor.center = draw.protractor.startCenter.slice(0);
		draw.protractor.angle = 0;
	}
	if (typeof draw.ruler !== 'undefined') {	
		draw.ruler.left = draw.ruler.startLeft;
		draw.ruler.top = draw.ruler.startTop;
		draw.ruler.angle = 0;
		recalcRulerValues();
	}
	if (typeof draw.compass !== 'undefined') {
		draw.compass.center1 = draw.compass.startCenter1.slice(0);
		draw.compass.center2 = draw.compass.startCenter2.slice(0);
		draw.compass.center3 = draw.compass.startCenter3.slice(0);		
		draw.compass.h = draw.compass.startH;
		draw.compass.angle = draw.compass.startAngle;
		draw.compass.radius = draw.compass.startRadius;
		draw.compass.radiusLocked = false;
		draw.compass.drawOn = draw.compass.startDrawOn;
		var mp1 = midpoint(draw.compass.center1[0],draw.compass.center1[1],draw.compass.center3[0],draw.compass.center3[1]);
		var mp2 = midpoint(draw.compass.center2[0],draw.compass.center2[1],mp1[0],mp1[1]);
		draw.compass.lockCenter = mp2.slice(0);
		recalcCompassValues();			
	}
	redrawButtons();
	draw.cursors.update();
	drawToolsCanvas();
	drawCanvasPaths();
}
function moveToolToFront(tool) {
	var index = draw.toolOrder.indexOf(tool);
	draw.toolOrder.splice(index,1);
	draw.toolOrder.unshift(tool);
}
function drawToolsCanvas() {
	draw.toolsctx.clear();
	draw.toolsctx.scale(draw.scale,draw.scale);
	for (var i = draw.toolOrder.length; i >= 0; i--) {
		if (draw.toolOrder[i] == 'protractor' && draw.protractorVisible == true) drawProtractor();
		if (draw.toolOrder[i] == 'ruler' && draw.rulerVisible == true) drawRuler();	
		if (draw.toolOrder[i] == 'compass' && draw.compassVisible == true) drawCompass();
		draw.cursors.update();
	}
	draw.toolsctx.setTransform(1, 0, 0, 1, 0, 0);
}
function recalcRulerValues() {
	if (typeof draw.ruler == 'undefined') return;
	var left = draw.ruler.left;
	var top = draw.ruler.top;
	var length = draw.ruler.length;
	var width = draw.ruler.width;
	var angle = draw.ruler.angle;
	draw.ruler.centerX1 = left+0.02*length*Math.cos(angle);
	draw.ruler.centerY1 = top+0.02*length*Math.sin(angle);	
	draw.ruler.centerX2 = left+0.98*length*Math.cos(angle);
	draw.ruler.centerY2 = top+0.98*length*Math.sin(angle);	
	draw.ruler.verticesArray1 = [
		[left,top],
		[left+length*Math.cos(angle),top+length*Math.sin(angle)],
		[left+length*Math.cos(angle)-width*Math.sin(angle),top+length*Math.sin(angle)+width*Math.cos(angle)],
		[left-width*Math.sin(angle),top+width*Math.cos(angle)]
	];
	draw.ruler.verticesArray2 = [
		[left,top],
		[left+0.1*length*Math.cos(angle),top+0.1*length*Math.sin(angle)],
		[left-width*Math.sin(angle)+0.1*length*Math.cos(angle),top+width*Math.cos(angle)+0.1*length*Math.sin(angle)],
		[left-width*Math.sin(angle),top+width*Math.cos(angle)]
	];
	draw.ruler.verticesArray3 = [
		[left+length*Math.cos(angle)-0.1*length*Math.cos(angle),top+length*Math.sin(angle)-0.1*length*Math.sin(angle)],
		[left+length*Math.cos(angle),top+length*Math.sin(angle)],
		[left+length*Math.cos(angle)-width*Math.sin(angle),top+length*Math.sin(angle)+width*Math.cos(angle)],
		[left+length*Math.cos(angle)-width*Math.sin(angle)-0.1*length*Math.cos(angle),top+length*Math.sin(angle)+width*Math.cos(angle)-0.1*length*Math.sin(angle)]
	];
	draw.ruler.center = [
		left+0.5*length*Math.cos(angle)-0.5*width*Math.sin(angle),
		top+0.5*length*Math.sin(angle)+0.5*width*Math.cos(angle)
	];
	draw.ruler.centerRel = [
		0.5*length*Math.cos(angle)-0.5*width*Math.sin(angle),
		0.5*length*Math.sin(angle)+0.5*width*Math.cos(angle)
	];
	
	draw.ruler.verticesArray4 = [
		[left+40*Math.sin(angle),top-40*Math.cos(angle)],
		[left+length*Math.cos(angle)+40*Math.sin(angle),top+length*Math.sin(angle)-40*Math.cos(angle)],
		[left+length*Math.cos(angle),top+length*Math.sin(angle)],
		[left,top]
	];
	if (draw.ruler.markings == true) {
		draw.ruler.edgePos1 = [
			left+0.02*length*Math.cos(angle)+(0.5*draw.thickness+2)*Math.sin(angle),
			top+0.02*length*Math.sin(angle)-(0.5*draw.thickness+2)*Math.cos(angle)
		];
		draw.ruler.edgePos2 = [
			left+0.98*length*Math.cos(angle)+(0.5*draw.thickness+2)*Math.sin(angle),
			top+0.98*length*Math.sin(angle)-(0.5*draw.thickness+2)*Math.cos(angle)
		];
	} else {
		draw.ruler.edgePos1 = [
			left+(0.5*draw.thickness+2)*Math.sin(angle),
			top-(0.5*draw.thickness+2)*Math.cos(angle)
		];
		draw.ruler.edgePos2 = [
			left+length*Math.cos(angle)+(0.5*draw.thickness+2)*Math.sin(angle),
			top+length*Math.sin(angle)-(0.5*draw.thickness+2)*Math.cos(angle)
		];
	}
	
	draw.ruler.verticesArray5 = [
		[left-width*Math.sin(angle)-40*Math.sin(angle),top+width*Math.cos(angle)+40*Math.cos(angle)],
		[left+length*Math.cos(angle)-width*Math.sin(angle)-40*Math.sin(angle),top+length*Math.sin(angle)+width*Math.cos(angle)+40*Math.cos(angle)],
		[left+length*Math.cos(angle)-width*Math.sin(angle),top+length*Math.sin(angle)+width*Math.cos(angle)],
		[left-width*Math.sin(angle),top+width*Math.cos(angle)],
	];
	draw.ruler.edgePos3 = [
		left-width*Math.sin(angle)-(0.5*draw.thickness+2)*Math.sin(angle),
		top+width*Math.cos(angle)+(0.5*draw.thickness+2)*Math.cos(angle)
	];
	draw.ruler.edgePos4 = [
		left+length*Math.cos(angle)-width*Math.sin(angle)-(0.5*draw.thickness+2)*Math.sin(angle),
		top+length*Math.sin(angle)+width*Math.cos(angle)+(0.5*draw.thickness+2)*Math.cos(angle)
	];	
	var cursor = draw.hiddenCanvas;
	var ctx = draw.hiddenCanvas.ctx;
	
	ctx.clearRect(0,0,50,50);
	ctx.translate(25,25);
	ctx.rotate(draw.ruler.angle);
		ctx.fillStyle = draw.color;
		ctx.fillRect(-5,-11,10,20);
		ctx.fillRect(-5,-18,10,5);
		ctx.beginPath();
		ctx.moveTo(-5,11);
		ctx.lineTo(0,18);
		ctx.lineTo(5,11);
		ctx.lineTo(-5,11);
		ctx.fill();		
	ctx.rotate(-draw.ruler.angle);	
	ctx.translate(-25,-25);

	draw.rulerEdgeCursor1 = cursor.toDataURL();
	draw.rulerEdgeCursorHotspot1 = [25-18*Math.sin(draw.ruler.angle),25+18*Math.cos(draw.ruler.angle)];
	
	ctx.clearRect(0,0,50,50);
	ctx.translate(25,25);
	ctx.rotate(Math.PI+draw.ruler.angle);
		ctx.fillStyle = draw.color;
		ctx.fillRect(-5,-11,10,20);
		ctx.fillRect(-5,-18,10,5);
		ctx.beginPath();
		ctx.moveTo(-5,11);
		ctx.lineTo(0,18);
		ctx.lineTo(5,11);
		ctx.lineTo(-5,11);
		ctx.fill();		
	ctx.rotate(-Math.PI-draw.ruler.angle);	
	ctx.translate(-25,-25);

	draw.rulerEdgeCursor2 = cursor.toDataURL();
	draw.rulerEdgeCursorHotspot2 = [25-18*Math.sin(Math.PI+draw.ruler.angle),25+18*Math.cos(Math.PI+draw.ruler.angle)];		
}
function recalcCompassValues() {
	var center1 = draw.compass.center1;
	var center2 = draw.compass.center2;
	var center3 = draw.compass.center3;								
	var rad = draw.compass.radius;	
	var angle = draw.compass.angle;

	var angle2 = Math.atan((0.5*draw.compass.radius)/draw.compass.h);
	
	/*
	// pointy arm
	if (center2[0] > center1[0]) {
		var pointPolygon = [
			[center2[0]+20*Math.cos(angle-angle2),center2[1]-20*Math.sin(angle-angle2)],
			[center2[0]-20*Math.cos(angle-angle2),center2[1]+20*Math.sin(angle-angle2)],
			[center1[0]-20*Math.cos(angle-angle2),center1[1]+20*Math.sin(angle-angle2)],
			[center1[0]+20*Math.cos(angle-angle2),center1[1]-20*Math.sin(angle-angle2)]
		];
	} else {
		var pointPolygon = [
			[center2[0]+20*Math.cos(Math.PI-angle-angle2),center2[1]-20*Math.sin(Math.PI-angle-angle2)],
			[center2[0]-20*Math.cos(Math.PI-angle-angle2),center2[1]+20*Math.sin(Math.PI-angle-angle2)],
			[center1[0]-20*Math.cos(Math.PI-angle-angle2),center1[1]+20*Math.sin(Math.PI-angle-angle2)],
			[center1[0]+20*Math.cos(Math.PI-angle-angle2),center1[1]-20*Math.sin(Math.PI-angle-angle2)]
		];
	}
	
	draw.toolsctx.fillStyle = '#F0F';
	draw.toolsctx.beginPath();
	draw.toolsctx.moveTo(pointPolygon[0][0],pointPolygon[0][1]);
	draw.toolsctx.lineTo(pointPolygon[1][0],pointPolygon[1][1]);
	draw.toolsctx.lineTo(pointPolygon[2][0],pointPolygon[2][1]);
	draw.toolsctx.lineTo(pointPolygon[3][0],pointPolygon[3][1]);
	draw.toolsctx.lineTo(pointPolygon[0][0],pointPolygon[0][1]);			
	draw.toolsctx.fill();
	
	var pencilArmPolygon = [
		[center2[0]+20*Math.cos(angle2-angle),center2[1]-20*Math.sin(angle2-angle)],
		[center2[0]-20*Math.cos(angle2-angle),center2[1]+20*Math.sin(angle2-angle)],
		[center3[0]-20*Math.cos(angle2-angle),center3[1]+20*Math.sin(angle2-angle)],
		[center3[0]+20*Math.cos(angle2-angle),center3[1]-20*Math.sin(angle2-angle)]
	];
	
	draw.toolsctx.fillStyle = '#FF0';
	draw.toolsctx.beginPath();
	draw.toolsctx.moveTo(pencilArmPolygon[0][0],pencilArmPolygon[0][1]);
	draw.toolsctx.lineTo(pencilArmPolygon[1][0],pencilArmPolygon[1][1]);
	draw.toolsctx.lineTo(pencilArmPolygon[2][0],pencilArmPolygon[2][1]);
	draw.toolsctx.lineTo(pencilArmPolygon[3][0],pencilArmPolygon[3][1]);
	draw.toolsctx.lineTo(pencilArmPolygon[0][0],pencilArmPolygon[0][1]);			
	draw.toolsctx.fill();
	*/
	
	if (draw.compass.drawOn == 'right') {
		var angle3 = angle2-angle-Math.PI/14;
		var center4 = [center3[0]-200*Math.sin(angle3),center3[1]-200*Math.cos(angle3)];
	} else {
		var angle3 = -(angle2+angle-Math.PI/14);
		var center4 = [center3[0]+200*Math.sin(angle3),center3[1]+200*Math.cos(angle3)];					
	}

	var pencilPolygon = [
		[center4[0]+20*Math.cos(angle3),center4[1]-20*Math.sin(angle3)],
		[center4[0]-20*Math.cos(angle3),center4[1]+20*Math.sin(angle3)],
		[center3[0]-20*Math.cos(angle3),center3[1]+20*Math.sin(angle3)],
		[center3[0]+20*Math.cos(angle3),center3[1]-20*Math.sin(angle3)]
	];
	
	/*
	draw.toolsctx.fillStyle = '#FF0';
	draw.toolsctx.beginPath();
	draw.toolsctx.moveTo(pencilPolygon[0][0],pencilPolygon[0][1]);
	draw.toolsctx.lineTo(pencilPolygon[1][0],pencilPolygon[1][1]);
	draw.toolsctx.lineTo(pencilPolygon[2][0],pencilPolygon[2][1]);
	draw.toolsctx.lineTo(pencilPolygon[3][0],pencilPolygon[3][1]);
	draw.toolsctx.lineTo(pencilPolygon[0][0],pencilPolygon[0][1]);			
	draw.toolsctx.fill();	
	*/
	
	if (draw.compass.drawOn == 'right') {
		var topPolygon = [
			[center2[0]-62*Math.sin(-angle)+10*Math.cos(angle),center2[1]-62*Math.cos(angle)-10*Math.sin(-angle)],
			[center2[0]-62*Math.sin(-angle)-10*Math.cos(angle),center2[1]-62*Math.cos(angle)+10*Math.sin(-angle)],
			[center2[0]-10*Math.cos(angle),center2[1]+10*Math.sin(-angle)],
			[center2[0]+10*Math.cos(angle),center2[1]-10*Math.sin(-angle)],
		];
	} else {
		var topPolygon = [
			[center2[0]+62*Math.sin(-angle)+10*Math.cos(angle),center2[1]+62*Math.cos(angle)-10*Math.sin(-angle)],
			[center2[0]+62*Math.sin(-angle)-10*Math.cos(angle),center2[1]+62*Math.cos(angle)+10*Math.sin(-angle)],
			[center2[0]-10*Math.cos(angle),center2[1]+10*Math.sin(-angle)],
			[center2[0]+10*Math.cos(angle),center2[1]-10*Math.sin(-angle)],
		];
	}
	/*
	draw.toolsctx.fillStyle = '#F0F';
	draw.toolsctx.beginPath();
	draw.toolsctx.moveTo(topPolygon[0][0],topPolygon[0][1]);
	draw.toolsctx.lineTo(topPolygon[1][0],topPolygon[1][1]);
	draw.toolsctx.lineTo(topPolygon[2][0],topPolygon[2][1]);
	draw.toolsctx.lineTo(topPolygon[3][0],topPolygon[3][1]);
	draw.toolsctx.lineTo(topPolygon[0][0],topPolygon[0][1]);			
	draw.toolsctx.fill();	
	*/
	
	//draw.compass.pointPolygon = pointPolygon;
	//draw.compass.pencilArmPolygon = pencilArmPolygon;
	draw.compass.pencilPolygon = pencilPolygon;								
	draw.compass.topPolygon = topPolygon;	
}
function drawProtractor() {
	var rad = draw.protractor.radius;
	var center = draw.protractor.center;
	var color = draw.protractor.color;
	var angle = draw.protractor.angle;
	var ctx = draw.toolsctx;
	
	var radius = [0.12*rad,0.7*rad,0.8*rad,0.88*rad,0.92*rad,rad];
	var fontSize = rad / 20;
	var colorRGB = hexToRgb(color);
	
	ctx.save();
	ctx.translate(-draw.drawArea[0],-draw.drawArea[1]); // adjust for drawArea 	
	ctx.translate(center[0],center[1]);
	ctx.rotate(angle);
	
	ctx.fillStyle = "rgba("+colorRGB.r+","+colorRGB.g+","+colorRGB.b+",0.25)";
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
	if (boolean(draw.protractor.numbers,true) === true) {
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
function drawRuler() {
	var left = draw.ruler.left;
	var top = draw.ruler.top;
	var width = draw.ruler.width;
	var length = draw.ruler.length;
	var color = draw.ruler.color;
	var transparent = draw.ruler.transparent;	
	var angle = draw.ruler.angle;
	var ctx = draw.toolsctx;
	
	var fontSize = width / 6;
		
	ctx.save();
	ctx.translate(left, top);
	ctx.rotate(angle);

	ctx.beginPath();
	
	if (transparent == true) {
		var colorRGB = hexToRgb(color);
		ctx.fillStyle = "rgba("+colorRGB.r+","+colorRGB.g+","+colorRGB.b+",0.25)";
		roundedRect(ctx, 0, 0, length, width, 8, 1, "rgba(0,0,0,0)", "rgba("+colorRGB.r+","+colorRGB.g+","+colorRGB.b+",0.5)");
	} else {
		ctx.fillStyle = color;
		roundedRect(ctx, 0, 0, length, width, 8, 1, '#000', color);
	}

	if (draw.ruler.markings == true) {
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
function drawCompass() {
	if (un(draw.compass)) return;
	var armLength = draw.compass.armLength;
	var radius = draw.compass.radius;
	var h = draw.compass.h;
	var center1 = draw.compass.center1;
	var center2 = draw.compass.center2;
	var center3 = draw.compass.center3;
	var drawOn = draw.compass.drawOn;
		
	var ctx = draw.toolsctx;
	
	if (draw.compass.radiusLocked == true || draw.compass.mode == 'draw') {
		// draw lock button
		ctx.translate(center2[0],center2[1]);
		if (drawOn == 'right') {
			ctx.rotate(draw.compass.angle);
		} else {
			ctx.rotate(draw.compass.angle + Math.PI);			
		}
	
		var lockHeight = 0.5 * draw.compass.h;
	
		//bar	
		ctx.fillStyle = '#99F';
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 1;
		ctx.fillRect(-0.25*draw.compass.radius,lockHeight-5,0.5*draw.compass.radius,10);
		ctx.strokeRect(-0.25*draw.compass.radius,lockHeight-5,0.5*draw.compass.radius,10);

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
			ctx.rotate(-draw.compass.angle);
		} else {
			ctx.rotate(-draw.compass.angle - Math.PI);			
		}
		ctx.translate(-center2[0],-center2[1]);
	} else {
		// draw lock button
		ctx.translate(center2[0],center2[1]);
		if (drawOn == 'right') {
			ctx.rotate(draw.compass.angle);
		} else {
			ctx.rotate(draw.compass.angle + Math.PI);			
		}
			
		var lockHeight = 0.5 * draw.compass.h;
	
		//bar	
		ctx.fillStyle = '#999';
		ctx.strokeStyle = '#999';
		ctx.lineWidth = 2;
		ctx.strokeRect(-0.25*draw.compass.radius,lockHeight-5,0.5*draw.compass.radius,10);

		//circle
		ctx.fillStyle = mainCanvasFillStyle;
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
		ctx.fillStyle = mainCanvasFillStyle;
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
			ctx.rotate(-draw.compass.angle);
		} else {
			ctx.rotate(-draw.compass.angle - Math.PI);			
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
		ctx.rotate(draw.compass.angle);
	} else {
		ctx.rotate(draw.compass.angle + Math.PI);		
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
		ctx.rotate(-draw.compass.angle);
	} else {
		ctx.rotate(-draw.compass.angle - Math.PI);		
	}
	ctx.translate(-center2[0],-center2[1]);	
}
