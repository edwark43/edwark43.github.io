// js

var plotPath;
var plotPathNum;
var plotPointNum;

function drawGrid(left, top, horizSpacing, vertSpacing, vertLines, horizLines, lineThickness, colour, opt_ctx) {
	var ctx3;
	if (typeof opt_ctx !== 'undefined') {ctx3 = opt_ctx} else {ctx3 = ctx}
	
	if (!lineThickness) {lineThickness = 3}
	if (!colour) {colour = '#999'}
	ctx3.strokeStyle = colour;
	ctx3.lineWidth = lineThickness;

	ctx3.beginPath();
	for (i = 0; i < horizLines + 1; i++) {
		ctx3.moveTo(left + i * horizSpacing, top);
		ctx3.lineTo(left + i * horizSpacing, top + vertLines * vertSpacing);
	}
	for (i = 0; i < vertLines + 1; i++) {
		ctx3.moveTo(left, top + i * vertSpacing);
		ctx3.lineTo(left + horizLines * horizSpacing, top + i * vertSpacing);
	}
	ctx3.closePath();
	ctx3.stroke();
}

function drawGrid3(context,contextLeft,contextTop,gridDetails,opt_fontSize,opt_minorColor,opt_majorColor,opt_xAxisColor,opt_yAxisColor,opt_borderColor,opt_originColor,opt_backColor,opt_showGrid,opt_showScales,opt_showLabels) {
	
	var mode = gridDetails.angleMode || 'deg'; 
	/********************************
		if mode == "rad" ...
		xMin, xMax, xMinorStep, xMajorStep are all multiples of pi, given as [num,denom],
		which will be simplified when text is drawn
	********************************/
	var hoursMode = boolean(gridDetails.hoursMode,false);
	/********************************
		if hoursMode == true ...
		x-values will be converted to (eg. 12:00);
	********************************/
	
	var left = gridDetails.left - contextLeft; // use dimensions relative to background canvas (1200x700)
	var top = gridDetails.top - contextTop;   // rather than the context supplied
	var width = gridDetails.width;
	var height = gridDetails.height;
	
	if (mode == 'rad') {
		if (typeof gridDetails.xMin == 'number') {
			var xMin = Math.PI * gridDetails.xMin;
		} else {
			var xMin = Math.PI * gridDetails.xMin[0] / gridDetails.xMin[1];
		}
		if (typeof gridDetails.xMax == 'number') {
			var xMax = Math.PI * gridDetails.xMax;
		} else {
			var xMax = Math.PI * gridDetails.xMax[0] / gridDetails.xMax[1];
		}
		if (typeof gridDetails.xMinorStep == 'number') {
			var xMinorStep = Math.PI * gridDetails.xMinorStep;
		} else {
			var xMinorStep = Math.PI * gridDetails.xMinorStep[0] / gridDetails.xMinorStep[1];
		}
		if (typeof gridDetails.xMajorStep == 'number') {
			var xMajorStep = Math.PI * gridDetails.xMajorStep;
		} else {
			var xMajorStep = Math.PI * gridDetails.xMajorStep[0] / gridDetails.xMajorStep[1];
		}
	} else {
		var xMin = gridDetails.xMin;
		var xMax = gridDetails.xMax;
		var xMinorStep = gridDetails.xMinorStep;
		var xMajorStep = gridDetails.xMajorStep;
		var xScaleStep = gridDetails.xScaleStep || xMajorStep;
	}

	if (xMin >= xMax) {
		console.log('Error:  xMin >= xMax');
		return;
	}
	
	var yMin = gridDetails.yMin;
	var yMax = gridDetails.yMax;
	var yMinorStep = gridDetails.yMinorStep;		
	var yMajorStep = gridDetails.yMajorStep;
	var yScaleStep = gridDetails.yScaleStep || yMajorStep;
	
	if (yMin >= yMax) {
		console.log('Error:  yMin >= yMax');
		return;
	}

	var showGrid = boolean(gridDetails.showGrid,boolean(opt_showGrid,true));
	var showScales = boolean(gridDetails.showScales,boolean(opt_showScales,true));
	var showXScale = boolean(gridDetails.showXScale,showScales);
	var showYScale = boolean(gridDetails.showYScale,showScales);
	var showLabels = boolean(gridDetails.showLabels,boolean(opt_showLabels,true));
	var showAxes = boolean(gridDetails.showAxes,true);
	var showBorder = boolean(gridDetails.showBorder,showAxes);
	
	var originStyle = gridDetails.originStyle || 'circle'; // 'circle', 'numbers' or 'none'
	var xScaleOffset = gridDetails.xScaleOffset || 4;
	var yScaleOffset = gridDetails.yScaleOffset || 0;
	
	var minorWidth = gridDetails.minorWidth || 1;
	var majorWidth = gridDetails.majorWidth || gridDetails.thickness || 2.4;
	
	var labelPos = [left,top,left+width,top+height];
	
	var sf = gridDetails.sf || 1; // scale factor for text, origin, lineWidths
	
	// work out the spacing for minor and major steps
	var xMinorSpacing = (width * xMinorStep) / (xMax - xMin);
	var xMajorSpacing = (width * xMajorStep) / (xMax - xMin);	
	var yMinorSpacing = (height * yMinorStep) / (yMax - yMin);
	var yMajorSpacing = (height * yMajorStep) / (yMax - yMin);
	
	var gridFontSize = gridDetails.fontSize || opt_fontSize || 24*sf;
	var backColor = gridDetails.backColor || opt_backColor || mainCanvasFillStyle || '#FFC';
	var invertedBackColor = getShades(backColor,true);
	if (['#FFF','#fff','#FFFFFF','#ffffff'].indexOf(backColor) == -1) {
		var minorColor = gridDetails.minorColor || opt_minorColor || /*invertedBackColor[10] || */'#999';
	} else {
		var minorColor = gridDetails.minorColor || opt_minorColor || invertedBackColor[9] || '#999';
		// slightly darker if white background - for printing
	}
	var majorColor = gridDetails.majorColor || gridDetails.color || opt_majorColor || /*invertedBackColor[9] || */'#999';
	var originColor = gridDetails.axesColor || opt_originColor || /*invertedBackColor[4] || */'#666';
	var xAxisColor = gridDetails.axesColor || opt_xAxisColor || /*invertedBackColor[2] || */'#000';
	var yAxisColor = gridDetails.axesColor || opt_yAxisColor || /*invertedBackColor[2] || */'#000';
	var borderColor = gridDetails.axesColor || opt_borderColor || /*invertedBackColor[2] || */'#000';

	var xScaleColor = gridDetails.xScaleColor || gridDetails.scaleColor || xAxisColor;
	var yScaleColor = gridDetails.yScaleColor || gridDetails.scaleColor || yAxisColor;
	
	var dots = boolean(gridDetails.dots,false);
	var dotsColor = def([gridDetails.dotsColor,majorColor]);
	var dotsRadius = def([gridDetails.dotsRadius,3])*sf;
	
	var labelFontSize = gridFontSize * 1.375;	
	var xAxisLabel = gridDetails.xAxisLabel || ['x'];
	var yAxisLabel = gridDetails.yAxisLabel || ['y'];
	if (typeof xAxisLabel == 'string') xAxisLabel = [xAxisLabel];
	if (typeof yAxisLabel == 'string') yAxisLabel = [yAxisLabel];
	
	// work out the coordinates of the origin
	var x0 = left - (xMin * width) / (xMax - xMin);
	var y0 = top + (yMax * height) / (yMax - yMin);
	
	// work out the actual display position of the origin (ie. at the edge if it is off the grid)
	var x0DisplayPos;
	var y0DisplayPos;
	if (x0 >= left && x0 <= left + width) {
		x0DisplayPos = x0;
	} else {
		if (x0 < left) {x0DisplayPos = left};
		if (x0 > left + width) {x0DisplayPos = left + width};
	}
	if (y0 >= top && y0 <= top + height) {
		y0DisplayPos = y0;
	} else {
		if (y0 < top) {y0DisplayPos = top};
		if (y0 > top + height) {y0DisplayPos = top + height};
	}

	if (showGrid == true) {
		// draw minor grid lines
		context.strokeStyle = minorColor;
		context.lineWidth = minorWidth*sf;
		context.beginPath();
		// draws positive xMinor lines
		var xAxisPoint = x0 + xMinorSpacing;
		while (xAxisPoint < left + width) {
			if (xAxisPoint > left) {
				context.moveTo(xAxisPoint, top);
				context.lineTo(xAxisPoint, top + height);
			}
			xAxisPoint += xMinorSpacing;
		}
		// draws negative xMinor lines
		var xAxisPoint = x0 - xMinorSpacing;
		while (xAxisPoint > left) {
			if (xAxisPoint < left + width) {
				context.moveTo(xAxisPoint, top);
				context.lineTo(xAxisPoint, top + height);
			}
			xAxisPoint -= xMinorSpacing;
		}
		// draws positive yMinor lines
		var yAxisPoint = y0 - yMinorSpacing;
		while (yAxisPoint > top) {
			if (yAxisPoint < top + height) {
				context.moveTo(left, yAxisPoint);
				context.lineTo(left + width, yAxisPoint);
			}
			yAxisPoint -= yMinorSpacing;
		}
		// draws negative yMinor lines
		var yAxisPoint = y0 + yMinorSpacing;
		while (yAxisPoint < top + height) {
			if (yAxisPoint > top) {
				context.moveTo(left, yAxisPoint);
				context.lineTo(left + width, yAxisPoint);
			}
			yAxisPoint += yMinorSpacing;
		}
		context.closePath();
		context.stroke();		
		
		// draw major lines
		context.strokeStyle = majorColor;
		context.lineWidth = majorWidth*sf;
		context.beginPath();
		// draws positive xMajor lines
		if (showAxes == true) {
			var xAxisPoint = x0 + xMajorSpacing;
		} else {
			var xAxisPoint = x0;
		}
		while (xAxisPoint <= left + width) {
			if (xAxisPoint > left) {
				context.moveTo(xAxisPoint, top);
				context.lineTo(xAxisPoint, top + height);
			}
			xAxisPoint += xMajorSpacing;
		}
		// draws negative xMajor lines
		var xAxisPoint = x0 - xMajorSpacing;
		while (xAxisPoint >= left) {
			if (xAxisPoint < left + width) {
				context.moveTo(xAxisPoint, top);
				context.lineTo(xAxisPoint, top + height);
			}
			xAxisPoint -= xMajorSpacing;
		}
		// draws positive yMajor lines
		if (showAxes == true) {
			var yAxisPoint = y0 - yMajorSpacing;
		} else {
			var yAxisPoint = y0;
		}		
		while (yAxisPoint >= top) {
			if (yAxisPoint < top + height) {
				context.moveTo(left, yAxisPoint);
				context.lineTo(left + width, yAxisPoint);
			}
			yAxisPoint -= yMajorSpacing;
		}
		// draws negative yMajor lines
		var yAxisPoint = y0 + yMajorSpacing;
		while (yAxisPoint <= top + height) {
			if (yAxisPoint > top) {		
				context.moveTo(left, yAxisPoint);
				context.lineTo(left + width, yAxisPoint);
			}
			yAxisPoint += yMajorSpacing;
		}
		context.closePath();
		context.stroke();
	}
	
	if (dots == true) {
		context.fillStyle = dotsColor;
		var xMin2 = Math.floor(Math.abs(xMin)/xMajorStep)*xMajorStep*(xMin/Math.abs(xMin));
		var xMax2 = Math.floor(Math.abs(xMax)/xMajorStep)*xMajorStep*(xMax/Math.abs(xMax));
		var yMin2 = Math.floor(Math.abs(yMin)/yMajorStep)*yMajorStep*(yMin/Math.abs(yMin));
		var yMax2 = Math.floor(Math.abs(yMax)/yMajorStep)*yMajorStep*(yMax/Math.abs(yMax));
		for (var x = xMin2; x <= xMax2; x += xMajorStep) {
			var xPos = getPosOfCoordX2(x,left,width,xMin,xMax);
			for (var y = yMin2; y <= yMax2; y += yMajorStep) {
				var yPos = getPosOfCoordY2(y,top,height,yMin,yMax);
				context.beginPath();
				context.arc(xPos,yPos,dotsRadius,0,2*Math.PI);
				context.fill();
			}
		}
	}

	if (showLabels == true) {
		if (!un(gridDetails.axisLabels)) {
			if (!un(draw) && !un(draw.hiddenCanvas)) {
				var ctx2 = draw.hiddenCanvas.ctx;
			} else {
				if (!un(window.hiddenCanvas)) window.hiddenCanvas = newctx({vis:false});
				var ctx2 = hiddenCanvas.ctx;
			}
			
			var xDist = gridDetails.axisLabels[0].dist || 30;
			var measureTextX = text({ctx:ctx2,text:['<<fontSize:'+labelFontSize+'>>'].concat(gridDetails.axisLabels[0].text),rect:[0,0,gridDetails.width,100],measureOnly:true}).tightRect;
			var xLabelRect = [gridDetails.left+gridDetails.width-measureTextX[2],gridDetails.top+gridDetails.height+xDist,measureTextX[2],measureTextX[3]];
			
			text({ctx:context,text:['<<fontSize:'+labelFontSize+'>>'].concat(gridDetails.axisLabels[0].text),rect:xLabelRect,align:[0,0]});
			
			var yDist = gridDetails.axisLabels[1].dist || 50;
			var measureTextY = text({ctx:ctx2,text:['<<fontSize:'+labelFontSize+'>>'].concat(gridDetails.axisLabels[1].text),rect:[0,0,gridDetails.height,100],measureOnly:true}).tightRect;
			var yLabelRect = [gridDetails.left-yDist-measureTextY[3],gridDetails.top,measureTextY[3],measureTextY[2]];
			context.save();
			context.translate(yLabelRect[0],yLabelRect[1]+measureTextY[2]);
			context.rotate(-Math.PI/2);
				text({ctx:context,text:['<<fontSize:'+labelFontSize+'>>'].concat(gridDetails.axisLabels[1].text),rect:[0,0,measureTextY[2],measureTextY[3]],align:[0,0]});
			context.restore();
			
			
		} else {
			yAxisLabel2 = yAxisLabel.slice(0);
			yAxisLabel2.unshift('<<font:algebra>><<fontSize:'+labelFontSize+'>><<align:center>><<color:'+yAxisColor+'>>');
			/*var yLabel = text({
				context:context,
				left:x0DisplayPos+5-300,
				top:top-labelFontSize-15,
				width:600,
				textArray:yAxisLabel
			});*/
			var yLabel = drawMathsText(context, yAxisLabel2, labelFontSize, x0DisplayPos+5, top-labelFontSize+5, true, [], 'center', 'middle', yAxisColor);
			if (arraysEqual(yAxisLabel,['y'])) {
				yLabel.tightRect[3] = (3/4) * yLabel.tightRect[3];
				yLabel.tightRect[1] += (1/3) * yLabel.tightRect[3];
			}
			/*context.save();
			context.lineWidth = 1;
			context.strokeStyle = '#393';
			context.strokeRect(yLabel.tightRect[0],yLabel.tightRect[1],yLabel.tightRect[2],yLabel.tightRect[3]);
			context.restore();*/
			labelPos[0] = Math.min(labelPos[0],yLabel.tightRect[0]);
			labelPos[1] = Math.min(labelPos[1],yLabel.tightRect[1]);
			labelPos[2] = Math.max(labelPos[2],yLabel.tightRect[0]+yLabel.tightRect[2]);
			labelPos[3] = Math.max(labelPos[3],yLabel.tightRect[1]+yLabel.tightRect[3]);
			xAxisLabel2 = xAxisLabel.slice();
			xAxisLabel2.unshift('<<font:algebra>><<fontSize:'+labelFontSize+'>><<align:left>><<color:'+xAxisColor+'>>');
			/*xLabel = text({
				context:context,
				left:left+width+10,
				top:y0DisplayPos-labelFontSize,
				width:300,
				textArray:xAxisLabel
			});*/
			var xLabel = drawMathsText(context, xAxisLabel2, labelFontSize, left+width+10, y0DisplayPos-labelFontSize, true, [], 'left', 'top', xAxisColor);
			if (arraysEqual(xAxisLabel,['x'])) {
				xLabel.tightRect[3] = (3/4) * xLabel.tightRect[3];
				xLabel.tightRect[1] += (1/3) * xLabel.tightRect[3];
			}		
			/*context.save();
			context.lineWidth = 1;
			context.strokeStyle = '#393';
			context.strokeRect(xLabel.tightRect[0],xLabel.tightRect[1],xLabel.tightRect[2],xLabel.tightRect[3]);
			context.restore();*/
			labelPos[0] = Math.min(labelPos[0],xLabel.tightRect[0]);
			labelPos[1] = Math.min(labelPos[1],xLabel.tightRect[1]);
			labelPos[2] = Math.max(labelPos[2],xLabel.tightRect[0]+yLabel.tightRect[2]);
			labelPos[3] = Math.max(labelPos[3],xLabel.tightRect[1]+yLabel.tightRect[3]);
		}
	}
	
	if (showBorder == true) {	
		// draw a black rectangular border
		context.strokeStyle = borderColor;
		context.lineWidth = 4*sf;
		context.strokeRect(left, top, width, height);
	}
	
	if (showScales == true) {
		if (originStyle == 'circle' && x0 >= left && x0 <= left + width && y0 >= top && y0 <= top + height) {
			context.textAlign = 'center';
			context.textBaseline = "middle";
			context.strokeStyle = originColor;
			context.lineWidth = 2*sf;
			context.beginPath();
			context.arc(x0,y0,10*(gridFontSize/(24*sf))*sf,0,2*Math.PI);
			context.closePath();
			context.stroke();
			labelPos[0] = Math.min(labelPos[0],x0-10);
			labelPos[1] = Math.min(labelPos[1],y0-10);
			labelPos[2] = Math.max(labelPos[2],x0+10);
			labelPos[3] = Math.max(labelPos[3],y0+10);	
		}
		
		if (showXScale == true) {
			// draw axes numbers
			context.font = gridFontSize+'px Arial';
			context.textAlign = "center";
			context.textBaseline = "top";

			if (mode == "rad") {
				// draw positive x axis numbers as multiple of pi
				var xAxisPoint = x0 + xMajorSpacing;
				var major = 1;
				while (roundToNearest(xAxisPoint,0.001) <= roundToNearest(left+width,0.001)) {
					if (xAxisPoint >= left) {
						if (typeof gridDetails.xMajorStep == 'number') {
							var frac = {num:gridDetails.xMajorStep*major,denom:1};
						} else {
							var frac = {num:gridDetails.xMajorStep[0]*major,denom:gridDetails.xMajorStep[1]};
						}
						var axisValue = multOfPiText(frac);
						var params = {ctx:context,textArray:axisValue,font:"algebra",fontSize:gridFontSize,left:xAxisPoint-50,width:100,top:y0DisplayPos+xScaleOffset-4,height:50,minTightWidth:1,minTightHeight:1,align:'center',vertAlign:'top',color:xScaleColor,box:{type:'tight',borderColor:backColor,borderWidth:0.01,color:backColor,padding:1}};
						var labelText = text(params);
						/*context.save();
						context.lineWidth = 1;
						context.strokeStyle = '#F00';
						context.strokeRect(labelText.tightRect[0],labelText.tightRect[1],labelText.tightRect[2],labelText.tightRect[3]);
						context.restore();*/
						labelPos[0] = Math.min(labelPos[0],labelText.tightRect[0]);
						labelPos[1] = Math.min(labelPos[1],labelText.tightRect[1]);
						labelPos[2] = Math.max(labelPos[2],labelText.tightRect[0]+labelText.tightRect[2]);
						labelPos[3] = Math.max(labelPos[3],labelText.tightRect[1]+labelText.tightRect[3]);	
					}
					major += 1;
					xAxisPoint += xMajorSpacing;				
				}			
				// draw negative x axis numbers as multiple of pi
				xAxisPoint = x0 - xMajorSpacing;
				major = -1;
				while (roundToNearest(xAxisPoint,0.001) >= roundToNearest(left,0.001)) {
					if (xAxisPoint < left + width) {
						if (typeof gridDetails.xMajorStep == 'number') {
							var frac = {num:gridDetails.xMajorStep*major,denom:1};
						} else {
							var frac = {num:gridDetails.xMajorStep[0]*major,denom:gridDetails.xMajorStep[1]};
						}					
						var axisValue = multOfPiText(frac);
						var params = {ctx:context,textArray:axisValue,font:"algebra",fontSize:gridFontSize,left:xAxisPoint-50,width:100,top:y0DisplayPos+xScaleOffset-4,height:50,minTightWidth:1,minTightHeight:1,align:'center',vertAlign:'top',color:xScaleColor,box:{type:'tight',borderColor:backColor,borderWidth:0.01,color:backColor,padding:1}};
						var labelText = text(params);
						/*context.save();
						context.lineWidth = 1;
						context.strokeStyle = '#F00';
						context.strokeRect(labelText.tightRect[0],labelText.tightRect[1],labelText.tightRect[2],labelText.tightRect[3]);
						context.restore();*/
						labelPos[0] = Math.min(labelPos[0],labelText.tightRect[0]);
						labelPos[1] = Math.min(labelPos[1],labelText.tightRect[1]);
						labelPos[2] = Math.max(labelPos[2],labelText.tightRect[0]+labelText.tightRect[2]);
						labelPos[3] = Math.max(labelPos[3],labelText.tightRect[1]+labelText.tightRect[3]);	
					}
					major -= 1;
					xAxisPoint -= xMajorSpacing;				
				}
			} else if (hoursMode == true) {
				// positive x numbers
				var xAxisPoint = x0 + xMajorSpacing;
				var major = 1;
				//var placeValue = Math.pow(10,Math.floor(Math.log(xMajorStep)/Math.log(10)));
				while (roundToNearest(xAxisPoint,0.001) <= roundToNearest(left+width,0.001)) {
					if (xAxisPoint >= left) {
						var value = convertToHoursMins(major*xMajorStep);
						var axisValue = [String(value)];
						var textWidth = context.measureText(String(axisValue)).width;
						context.fillStyle = backColor;
						context.fillRect(xAxisPoint - textWidth / 2, y0DisplayPos + xScaleOffset-1, textWidth, gridFontSize * 1.1);
						var labelText = drawMathsText(context, axisValue, gridFontSize, xAxisPoint, y0DisplayPos + xScaleOffset + 0.5 * gridFontSize, true, [], 'center', 'middle', xScaleColor);
						/*context.save();
						context.lineWidth = 1;
						context.strokeStyle = '#393';
						context.strokeRect(labelText.tightRect[0],labelText.tightRect[1],labelText.tightRect[2],labelText.tightRect[3]);
						context.restore();*/	
						labelPos[0] = Math.min(labelPos[0],labelText.tightRect[0]);
						labelPos[1] = Math.min(labelPos[1],labelText.tightRect[1]);
						labelPos[2] = Math.max(labelPos[2],labelText.tightRect[0]+labelText.tightRect[2]);
						labelPos[3] = Math.max(labelPos[3],labelText.tightRect[1]+labelText.tightRect[3]);	
					}
					major += 1;
					xAxisPoint += xMajorSpacing;
				}			
			} else {
				var xScaleSpacing = (width * xScaleStep) / (xMax - xMin);
				
				// positive x numbers
				var xAxisPoint = x0 + xScaleSpacing;
				var major = 1;
				var placeValue = Math.pow(10,Math.floor(Math.log(xScaleStep)/Math.log(10)));
				while (roundToNearest(xAxisPoint,0.001) <= roundToNearest(left+width,0.001)) {
					if (xAxisPoint >= left) {
						var value = roundToNearest(major*xScaleStep,placeValue);
						var axisValue = [String(value)];
						var textWidth = context.measureText(String(axisValue)).width;
						context.fillStyle = backColor;
						context.fillRect(xAxisPoint - textWidth / 2, y0DisplayPos + xScaleOffset-1, textWidth, gridFontSize * 1.1);
						var labelText = drawMathsText(context, axisValue, gridFontSize, xAxisPoint, y0DisplayPos + xScaleOffset + 0.5 * gridFontSize, true, [], 'center', 'middle', xScaleColor);
						/*context.save();
						context.lineWidth = 1;
						context.strokeStyle = '#393';
						context.strokeRect(labelText.tightRect[0],labelText.tightRect[1],labelText.tightRect[2],labelText.tightRect[3]);
						context.restore();*/	
						labelPos[0] = Math.min(labelPos[0],labelText.tightRect[0]);
						labelPos[1] = Math.min(labelPos[1],labelText.tightRect[1]);
						labelPos[2] = Math.max(labelPos[2],labelText.tightRect[0]+labelText.tightRect[2]);
						labelPos[3] = Math.max(labelPos[3],labelText.tightRect[1]+labelText.tightRect[3]);	
					}
					major += 1;
					xAxisPoint += xScaleSpacing;
				}

				// negative x numbers
				var xAxisPoint = x0 - xScaleSpacing;
				var major = -1;
				while (roundToNearest(xAxisPoint,0.001) >= roundToNearest(left,0.001)) {
					if (xAxisPoint < left + width) {
						var value = roundToNearest(major*xScaleStep,placeValue);
						var axisValue = [String(value)];
						var textWidth = context.measureText(String(axisValue)).width;
						context.fillStyle = backColor;
						context.fillRect(xAxisPoint - textWidth / 2, y0DisplayPos + xScaleOffset-1, textWidth, gridFontSize * 1.1);
						var labelText = drawMathsText(context, axisValue, gridFontSize, xAxisPoint, y0DisplayPos + xScaleOffset + 0.5 * gridFontSize, true, [], 'center', 'middle', xScaleColor);
						/*context.save();
						context.lineWidth = 1;
						context.strokeStyle = '#393';
						context.strokeRect(labelText.tightRect[0],labelText.tightRect[1],labelText.tightRect[2],labelText.tightRect[3]);
						context.restore();*/
						labelPos[0] = Math.min(labelPos[0],labelText.tightRect[0]);
						labelPos[1] = Math.min(labelPos[1],labelText.tightRect[1]);
						labelPos[2] = Math.max(labelPos[2],labelText.tightRect[0]+labelText.tightRect[2]);
						labelPos[3] = Math.max(labelPos[3],labelText.tightRect[1]+labelText.tightRect[3]);	
					}
					major -= 1;
					xAxisPoint -= xScaleSpacing;
				}
			}
		}
		
		if (showYScale == true) {
			context.textBaseline = "middle";
			context.textAlign = "right";
			if (!un(gridDetails.yScaleColor)) {
				context.fillStyle = gridDetails.yScaleColor;
			} else {
				context.fillStyle = yAxisColor;
			}
			context.font = gridFontSize+"px Arial";
			
			var yScaleSpacing = (height * yScaleStep) / (yMax - yMin);
			
			// positive y numbers
			var yAxisPoint = y0 - yScaleSpacing;
			var major = 1;
			var placeValue = Math.pow(10,Math.floor(Math.log(yScaleStep)/Math.log(10)));	
			while (roundToNearest(yAxisPoint,0.001) >= roundToNearest(top,0.001)) {
				if (yAxisPoint <= top + height) {	
					var axisValue = Number(roundSF(major*yScaleStep, 5));
					var textWidth = context.measureText(String(axisValue)).width	
					context.fillStyle = backColor;
					context.fillRect(x0DisplayPos - textWidth - 11*sf - yScaleOffset, yAxisPoint - gridFontSize * 0.5, textWidth + 3*sf, gridFontSize);
					var labelText = drawMathsText(context, String(axisValue), gridFontSize, x0DisplayPos - 10*sf - yScaleOffset, yAxisPoint - 2, true, [], 'right', 'middle', yScaleColor);
					/*context.save();
					context.lineWidth = 1;
					context.strokeStyle = '#393';
					context.strokeRect(labelText.tightRect[0],labelText.tightRect[1],labelText.tightRect[2],labelText.tightRect[3]);
					context.restore();*/	
					labelPos[0] = Math.min(labelPos[0],labelText.tightRect[0]);
					labelPos[1] = Math.min(labelPos[1],labelText.tightRect[1]);
					labelPos[2] = Math.max(labelPos[2],labelText.tightRect[0]+labelText.tightRect[2]);
					labelPos[3] = Math.max(labelPos[3],labelText.tightRect[1]+labelText.tightRect[3]);		
				}
				major += 1;
				yAxisPoint -= yScaleSpacing;
			}

			// negative y numbers
			var yAxisPoint = y0 + yScaleSpacing;
			var major = -1;
			while (roundToNearest(yAxisPoint,0.001) <= roundToNearest(top+height,0.001)) {
				if (yAxisPoint >= top) {
					var axisValue = Number(roundSF(major*yScaleStep, 5));
					var textWidth = context.measureText(String(axisValue)).width	
					context.fillStyle = backColor;
					context.fillRect(x0DisplayPos - textWidth - 11*sf - yScaleOffset, yAxisPoint - gridFontSize * 0.5, textWidth + 3*sf, gridFontSize);
					var labelText = drawMathsText(context, String(axisValue), gridFontSize, x0DisplayPos - 10*sf - yScaleOffset, yAxisPoint - 2, true, [], 'right', 'middle', yScaleColor);
					/*context.save();
					context.lineWidth = 1;
					context.strokeStyle = '#393';
					context.strokeRect(labelText.tightRect[0],labelText.tightRect[1],labelText.tightRect[2],labelText.tightRect[3]);
					context.restore();*/
					labelPos[0] = Math.min(labelPos[0],labelText.tightRect[0]);
					labelPos[1] = Math.min(labelPos[1],labelText.tightRect[1]);
					labelPos[2] = Math.max(labelPos[2],labelText.tightRect[0]+labelText.tightRect[2]);
					labelPos[3] = Math.max(labelPos[3],labelText.tightRect[1]+labelText.tightRect[3]);	
				}
				major -= 1;
				yAxisPoint += yScaleSpacing;
				
			}
		}
	}

	if (originStyle == 'numbers') {
		if (showXScale == true && x0 >= left && x0 <= left+width) {
			var params = {ctx:context,textArray:["0"],font:"algebra",fontSize:gridFontSize,left:x0-50,width:100,top:y0DisplayPos+xScaleOffset-4,height:50,minTightWidth:1,minTightHeight:1,align:'center',vertAlign:'top',color:xScaleColor,box:{type:'tight',borderColor:backColor,borderWidth:0.01,color:backColor,padding:1}};
			var labelText = text(params);
			labelPos[0] = Math.min(labelPos[0],labelText.tightRect[0]);
			labelPos[1] = Math.min(labelPos[1],labelText.tightRect[1]);
			labelPos[2] = Math.max(labelPos[2],labelText.tightRect[0]+labelText.tightRect[2]);
			labelPos[3] = Math.max(labelPos[3],labelText.tightRect[1]+labelText.tightRect[3]);	
		}
		if (showYScale == true && y0 >= top && y0 <= top+height) {
			context.textBaseline = "middle";
			context.textAlign = "right";
			context.fillStyle = yAxisColor;
			context.font = gridFontSize+"px Arial";
			var textWidth = context.measureText("0").width;
			context.fillStyle = backColor;
			context.fillRect(x0DisplayPos - textWidth - 11*sf - yScaleOffset, y0 - gridFontSize * 0.5, textWidth + 3*sf, gridFontSize);
			var labelText = drawMathsText(context, "0", gridFontSize, x0DisplayPos - 10*sf - yScaleOffset, y0 - 2, true, [], 'right', 'middle', yScaleColor);
			labelPos[0] = Math.min(labelPos[0],labelText.tightRect[0]);
			labelPos[1] = Math.min(labelPos[1],labelText.tightRect[1]);
			labelPos[2] = Math.max(labelPos[2],labelText.tightRect[0]+labelText.tightRect[2]);
			labelPos[3] = Math.max(labelPos[3],labelText.tightRect[1]+labelText.tightRect[3]);	
		}
	}	
	
	if (!un(gridDetails.plot)) {
		for (var c = 0; c < gridDetails.plot.length; c++) {
			var plot = gridDetails.plot[c];
			if (plot.type == 'histogram') {
				drawHistogram(context,gridDetails,plot);
				/* eg.
					sel().originStyle = 'numbers';
					sel().xMin = 0;
					sel().xMax = 35;
					sel().yMin = 0;
					sel().yMax = 2;
					sel().yMajorStep = 0.5;
					sel().yMinorStep = 0.1;
					sel().plot = [{type:'histogram',fillStyle:'#CFF',chartData:[{min:0,max:10,freq:5},{min:10,max:15,freq:8},{min:15,max:20,freq:7,fillStyle:'#FCF'},{min:20,max:35,freq:8}]}];
					sel().axisLabels = [{text:['<<fontSize:28>>Time (s)']},{text:['<<fontSize:28>>Frequency'+br+'Density']}];
				*/
			} else if (plot.type == 'cFreq') {
				context.lineWidth = plot.lineWidth || 3;
				context.strokeStyle = plot.strokeStyle || '#000';
				drawSmoothCurve(context,gridDetails,plot.chartData,0.5,16,true);
				drawScatter(context,gridDetails,plot);
				/* eg.
					sel().originStyle = 'numbers';
					sel().xMin = 0;
					sel().xMax = 140;
					sel().yMin = 0;
					sel().yMax = 70;
					sel().xMajorStep = 20;
					sel().xMinorStep = 10;
					sel().yMajorStep = 10;
					sel().yMinorStep = 5;
					sel().plot = [{type:'cFreq',pointStyle:'circle',chartData:[[0,0],[25,20],[50,43],[75,48],[100,56],[125,62]]}];
					sel().axisLabels = [{text:['<<fontSize:28>>Time (s)']},{text:['<<fontSize:28>>Cumulative Frequency']}];
				*/
			} else if (plot.type == 'scatter') {
				drawScatter(context,gridDetails,plot);
				/* eg.
					sel().originStyle = 'numbers';
					sel().xMin = 0;
					sel().xMax = 140;
					sel().yMin = 0;
					sel().yMax = 70;
					sel().xMajorStep = 20;
					sel().xMinorStep = 10;
					sel().yMajorStep = 10;
					sel().yMinorStep = 5;
					sel().plot = [{type:'scatter',pointStyle:'circle',chartData:[[25,20],[50,43],[75,48],[100,56],[125,62]]}];
					sel().axisLabels = [{text:['<<fontSize:28>>Weight (kg)']},{text:['<<fontSize:28>>Height (cm)']}];
					
				*/
			} else if (plot.type == 'freqPolygon') {
				var coords = convertCoordsGridToCanvas(0,0,gridDetails,plot.chartData);
				context.lineWidth = plot.lineWidth || 3;
				context.strokeStyle = plot.strokeStyle || '#000';
				context.beginPath();
				context.moveTo(coords[0][0],coords[0][1]);
				for (var c2 = 1; c2 < coords.length; c2++) context.lineTo(coords[c2][0],coords[c2][1]);
				context.stroke();
				drawScatter(context,gridDetails,plot);
				/* eg.
					sel().originStyle = 'numbers';
					sel().xMin = 0;
					sel().xMax = 140;
					sel().yMin = 0;
					sel().yMax = 70;
					sel().xMajorStep = 20;
					sel().xMinorStep = 10;
					sel().yMajorStep = 10;
					sel().yMinorStep = 5;
					sel().plot = [{type:'freqPolygon',pointStyle:'circle',chartData:[[25,20],[50,43],[75,48],[100,56],[125,62]]}];
					sel().axisLabels = [{text:['<<fontSize:28>>Time (days)']},{text:['<<fontSize:28>>Height (cm)']}];						
				*/			
			} else if (plot.type == 'smoothCurve') {
				context.lineWidth = plot.lineWidth || 3;
				context.strokeStyle = plot.strokeStyle || '#000';
				drawSmoothCurve(context,gridDetails,plot.chartData,0.5,16,false);
				drawScatter(context,gridDetails,plot);
				/* eg.
					sel().originStyle = 'numbers';
					sel().xMin = 0;
					sel().xMax = 140;
					sel().yMin = 0;
					sel().yMax = 70;
					sel().xMajorStep = 20;
					sel().xMinorStep = 10;
					sel().yMajorStep = 10;
					sel().yMinorStep = 5;
					sel().plot = [{type:'freqPolygon',pointStyle:'circle',chartData:[[25,20],[50,43],[75,48],[100,56],[125,62]]}];
					sel().axisLabels = [{text:['<<fontSize:28>>Time (days)']},{text:['<<fontSize:28>>Height (cm)']}];						
				*/			
			}
		}
	}	
	
	if (showAxes == true) {
		// draw axes
		context.beginPath();
		context.strokeStyle = xAxisColor;
		context.lineWidth = 3*sf;	
		// if neccesary, draw x-Axis
		if (y0 >= top && y0 <= top + height) {
			context.moveTo(left, y0);
			context.lineTo(left + width-10*sf, y0);	
		}
		context.closePath();
		context.stroke();
		context.beginPath();
		context.strokeStyle = yAxisColor;
		context.lineWidth = 3*sf;
		// if neccesary, draw y-Axis
		if (x0 >= left && x0 <= left + width) {
			context.moveTo(x0, top+10*sf);
			context.lineTo(x0, top + height);	
		}
		context.closePath();
		context.stroke();
		
		// draw an arrow at the top of the y-axis
		context.fillStyle = yAxisColor;
		context.strokeStyle = yAxisColor;
		context.beginPath();
		context.moveTo(x0DisplayPos, top + 2*sf);
		context.lineTo(x0DisplayPos - 5*sf, top + 12*sf);
		context.lineTo(x0DisplayPos + 5*sf, top + 12*sf);
		context.lineTo(x0DisplayPos, top + 2*sf);
		context.closePath();
		context.stroke();
		context.fill();

		// draw an arrow at the right of the x-axis
		context.fillStyle = xAxisColor;
		context.strokeStyle = xAxisColor;	
		context.beginPath();
		context.moveTo(left + width - 2*sf, y0DisplayPos);
		context.lineTo(left + width - 12*sf, y0DisplayPos - 5*sf);
		context.lineTo(left + width - 12*sf, y0DisplayPos + 5*sf);
		context.lineTo(left + width - 2*sf, y0DisplayPos);
		context.closePath();
		context.stroke();
		context.fill();
	}
	
	labelPos[0] = Math.min(labelPos[0],x0DisplayPos-5);
	labelPos[1] = Math.min(labelPos[1],y0DisplayPos-5);
	labelPos[2] = Math.max(labelPos[2],x0DisplayPos+5);
	labelPos[3] = Math.max(labelPos[3],y0DisplayPos+5);
	if (!un(yLabelRect) && !un(xLabelRect)) {
		labelPos[0] = Math.min(labelPos[0],yLabelRect[0]);
		labelPos[3] = Math.max(labelPos[3],xLabelRect[1]+xLabelRect[3]);
	}

	var labelBorder = [labelPos[0],labelPos[1],labelPos[2]-labelPos[0],labelPos[3]-labelPos[1],labelPos[2],labelPos[3]];
	/*
	context.save();
	context.lineWidth = 3;
	context.strokeStyle = '#F00';
	context.strokeRect(labelBorder[0],labelBorder[1],labelBorder[2],labelBorder[3]);
	context.restore();
	//*/
		
	return {labelBorder:labelBorder};
}

function drawHistogram(ctx,gridDetails,chart) {
	var xStep = gridDetails.width / (gridDetails.xMax - gridDetails.xMin);
	var yStep = gridDetails.height / gridDetails.yMax;

	var lineWidth = chart.lineWidth || 3;
	var strokeStyle = chart.strokeStyle || '#000';
	var fillStyle = chart.fillStyle || '#FCF';
	var data = chart.chartData;
	
	for (var d = 0; d < data.length; d++) {
		var fd = data[d].freq / (data[d].max - data[d].min);
		var l = gridDetails.left + xStep * (data[d].min - gridDetails.xMin);
		var t = gridDetails.top + gridDetails.height - yStep * fd;
		var w = xStep * (data[d].max - data[d].min);
		var h = yStep * fd;
		ctx.fillStyle = data[d].fillStyle || fillStyle;
		ctx.strokeStyle = data[d].strokeStyle || strokeStyle;
		ctx.lineWidth = data[d].lineWidth || lineWidth;
		ctx.fillRect(l,t,w,h);
		ctx.strokeRect(l,t,w,h);
	}
	//text({ctx:ctx,textArray:['<<fontSize:24>><<italic:true>>'+xAxisLabel],rect:[gridDetails.left+gridDetails.width-200,gridDetails.top+gridDetails.height+40,200,500],align:[0,-1]});
}
function drawScatter(ctx,gridDetails,chart) {
	var lineWidth = chart.lineWidth || 3;
	var strokeStyle = chart.strokeStyle || chart.color || '#000';
	var fillStyle = chart.fillStyle || strokeStyle;
	var pointStyle = chart.pointStyle || 'cross'; // cross, circle or none	
	var pointSize = chart.pointSize || 8;
	var meta = chart.meta || [];
	var coords = convertCoordsGridToCanvas(0,0,gridDetails,chart.chartData);
	
	for (var d = 0; d < chart.chartData.length; d++) {
		var meta2 = meta[d] || {};
		var point = meta2.pointStyle || pointStyle;
		var size = meta2.pointSize || pointSize;
		ctx.fillStyle = meta2.fillStyle || fillStyle;
		ctx.strokeStyle = meta2.strokeStyle || strokeStyle;
		ctx.lineWidth = meta2.lineWidth || lineWidth;
		var x = coords[d][0];
		var y = coords[d][1];
		switch (point) {
			case 'cross':
				ctx.beginPath();
				ctx.moveTo(x-size,y-size);
				ctx.lineTo(x+size,y+size);
				ctx.moveTo(x-size,y+size);
				ctx.lineTo(x+size,y-size);
				ctx.stroke();				
				break;
			case 'circle':
				ctx.beginPath();
				ctx.moveTo(x,y);
				ctx.arc(x,y,size,0,2*Math.PI);
				ctx.fill();
				break;
			
		}
	}
}

function convertToHoursMins(num) {
	var hours = Math.floor(num);
	var mins = String(roundToNearest((num-hours)*60,2));
	if (mins.length == 1) mins = "0"+mins;
	return String(hours)+":"+mins;
}

function gridLabelPos(ctx,gridDetails,obj) {
	//eg. gridLabelPos(j523ctx1,gridDetails,{x:4,y:6,lineWidth:2,lineColor:'#00F',lineDash:[4,4],labelX:true,labelXColor:'#00F',labelY:true,,labelYColor:'#00F'});
	ctx.save();
	ctx.lineWidth = obj.lineWidth || 2;
	ctx.strokeStyle = obj.lineColor || '#00F';
	var dash = obj.lineDash || [];
	if (typeof ctx.setLineDash !== 'function') ctx.setLineDash = function(){};
	ctx.setLineDash(dash);
	var x0 = getPosOfCoordX2(0,gridDetails.left,gridDetails.width,gridDetails.xMin,gridDetails.xMax);
	if (x0 < gridDetails.left) x0 = gridDetails.left;
	if (x0 > gridDetails.left + gridDetails.width) x0 = gridDetails.left + gridDetails.width;
	var y0 = getPosOfCoordY2(0,gridDetails.top,gridDetails.height,gridDetails.yMin,gridDetails.yMax);
	if (y0 < gridDetails.top) y0 = gridDetails.top;
	if (y0 > gridDetails.top + gridDetails.height) y0 = gridDetails.top + gridDetails.height;	

	var x1 = getPosOfCoordX2(obj.x,gridDetails.left,gridDetails.width,gridDetails.xMin,gridDetails.xMax);
	var y1 = getPosOfCoordY2(obj.y,gridDetails.top,gridDetails.height,gridDetails.yMin,gridDetails.yMax);
	
	if (boolean(obj.line,true) == true) {
		ctx.beginPath();
		ctx.moveTo(x1,y0);
		ctx.lineTo(x1,y1);
		ctx.lineTo(x0,y1);
		ctx.stroke();
	}
	ctx.setLineDash([]);

	var sf = gridDetails.sf || 1;
	var gridFontSize = obj.fontSize || gridDetails.fontSize || 24*sf;
	var backColor = gridDetails.backColor || mainCanvasFillStyle || '#FFC';
	var invertedBackColor = getShades('#000',true);
	var originColor = gridDetails.axesColor || invertedBackColor[4] || '#666';
	var xAxisColor = gridDetails.axesColor || invertedBackColor[0] || '#000';
	var yAxisColor = gridDetails.axesColor || invertedBackColor[0] || '#000';
	
	if (obj.labelX === true) {
		var xColor = obj.labelXColor || '#00F';
		text({ctx:ctx,textArray:['<<color:'+xColor+'>>'+String(obj.x)],font:"algebra",fontSize:gridFontSize,left:x1-50,width:100,top:y0,height:50,minTightWidth:1,minTightHeight:1,align:'center',vertAlign:'top',box:{type:'tight',borderColor:backColor,borderWidth:0.01,color:backColor,padding:1}});
	} else if (typeof obj.labelX == 'object') {
		var xColor = obj.labelXColor || '#00F';
		obj.labelX.unshift('<<color:'+xColor+'>>');
		text({ctx:ctx,textArray:obj.labelX,font:"algebra",fontSize:gridFontSize,left:x1-50,width:100,top:y0,height:50,minTightWidth:1,minTightHeight:1,align:'center',vertAlign:'top',box:{type:'tight',borderColor:backColor,borderWidth:0.01,color:backColor,padding:1}});
	}

	if (obj.labelY === true) {
		var yColor = obj.labelYColor || '#00F';
		text({ctx:ctx,textArray:['<<color:'+xColor+'>>'+String(obj.y)],font:"algebra",fontSize:gridFontSize,left:x0-100-10*sf,width:100,top:y1-25,height:50,minTightWidth:1,minTightHeight:1,align:'right',vertAlign:'middle',box:{type:'tight',borderColor:backColor,borderWidth:0.01,color:backColor,padding:1}});
	} else if (typeof obj.labelY == 'object') {
		var yColor = obj.labelYColor || '#00F';
		obj.labelY.unshift('<<color:'+yColor+'>>');
		text({ctx:ctx,textArray:obj.labelY,font:"algebra",fontSize:gridFontSize,left:x1-50,width:100,top:y0,height:50,minTightWidth:1,minTightHeight:1,align:'center',vertAlign:'top',box:{type:'tight',borderColor:backColor,borderWidth:0.01,color:backColor,padding:1}});
	}

	if (boolean(gridDetails.showScales,true) == true && boolean(gridDetails.showOrigin,true) == true) { // redraw origin
		if (x0 >= gridDetails.left && x0 <= gridDetails.left + gridDetails.width && y0 >= gridDetails.top && y0 <= gridDetails.top + gridDetails.height) {
			ctx.strokeStyle = originColor;
			ctx.lineWidth = 2*sf;
			ctx.beginPath();
			ctx.arc(x0,y0,10*sf,0,2*Math.PI);
			ctx.stroke();	
		}
	}		
	
	// redraw axes
	ctx.beginPath();
	ctx.strokeStyle = xAxisColor;
	ctx.lineWidth = 3*sf;	
	// if neccesary, draw x-Axis
	if (y0 >= gridDetails.top && y0 <= gridDetails.top + gridDetails.height) {
		ctx.moveTo(gridDetails.left, y0);
		ctx.lineTo(gridDetails.left + gridDetails.width-10*sf, y0);	
	}
	ctx.closePath();
	ctx.stroke();
	ctx.beginPath();
	ctx.strokeStyle = yAxisColor;
	ctx.lineWidth = 3*sf;
	// if neccesary, draw y-Axis
	if (x0 >= gridDetails.left && x0 <= gridDetails.left + gridDetails.width) {
		ctx.moveTo(x0, gridDetails.top+10*sf);
		ctx.lineTo(x0, gridDetails.top + gridDetails.height);	
	}
	ctx.closePath();
	ctx.stroke();
	
	// draw an arrow at the gridDetails.top of the y-axis
	ctx.fillStyle = yAxisColor;
	ctx.strokeStyle = yAxisColor;
	ctx.beginPath();
	ctx.moveTo(x0, gridDetails.top + 2*sf);
	ctx.lineTo(x0 - 5*sf, gridDetails.top + 12*sf);
	ctx.lineTo(x0 + 5*sf, gridDetails.top + 12*sf);
	ctx.lineTo(x0, gridDetails.top + 2*sf);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();

	// draw an arrow at the right of the x-axis
	ctx.fillStyle = xAxisColor;
	ctx.strokeStyle = xAxisColor;	
	ctx.beginPath();
	ctx.moveTo(gridDetails.left + gridDetails.width - 2*sf, y0);
	ctx.lineTo(gridDetails.left + gridDetails.width - 12*sf, y0 - 5*sf);
	ctx.lineTo(gridDetails.left + gridDetails.width - 12*sf, y0 + 5*sf);
	ctx.lineTo(gridDetails.left + gridDetails.width - 2*sf, y0);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();
	
	ctx.restore();
}

function drawGridRadians(context,contextLeft,contextTop,gridDetails,opt_fontSize,opt_minorColor,opt_majorColor,opt_xAxisColor,opt_yAxisColor){

	var left = gridDetails.left - contextLeft; // use dimensions relative to background canvas (1200x700)
	var top = gridDetails.top - contextTop;   // rather than the context supplied
	var width = gridDetails.width;
	var height = gridDetails.height;
	var xMin = gridDetails.xMin; // as multiple of pi
	var xMax = gridDetails.xMax; // as multiple of pi
	var yMin = gridDetails.yMin;
	var yMax = gridDetails.yMax;
	var xMinorStep = gridDetails.xMinorStep; // as fractional multiple of pi {num:1,denom:2}
	var xMajorStep = gridDetails.xMajorStep; // as fractional multiple of pi {num:1,denom:6}
	var yMinorStep = gridDetails.yMinorStep;
	var yMajorStep = gridDetails.yMajorStep;

	// work out the spacing for minor and major steps
	var xMinorSpacing = (width * (xMinorStep.num / xMinorStep.denom) * Math.PI) / (xMax - xMin);
	var xMajorSpacing = (width * (xMajorStep.num / xMajorStep.denom) * Math.PI) / (xMax - xMin);	
	var yMinorSpacing = (height * yMinorStep) / (yMax - yMin);
	var yMajorSpacing = (height * yMajorStep) / (yMax - yMin);
	
	var fontSize = opt_fontSize || 24;
	var minorColor = opt_minorColor || '#DDD'
	var majorColor = opt_majorColor || '#AAA'
	var xAxisColor = opt_xAxisColor || '#000';
	var yAxisColor = opt_yAxisColor || '#000';
	
	// work out the coordinates of the origin
	var x0 = left - (xMin * width) / (xMax - xMin);
	var y0 = top + (yMax * height) / (yMax - yMin);
	
	// work out the actual display position of the origin (ie. at the edge if it is off the grid)
	var x0DisplayPos;
	var y0DisplayPos;
	if (x0 >= left && x0 <= left + width) {
		x0DisplayPos = x0;
	} else {
		if (x0 < left) {x0DisplayPos = left};
		if (x0 > left + width) {x0DisplayPos = left + width};
	}
	if (y0 >= top && y0 <= top + height) {
		y0DisplayPos = y0;
	} else {
		if (y0 < top) {y0DisplayPos = top};
		if (y0 > top + height) {y0DisplayPos = top + height};
	}
		
	// start to draw gridlines
	context.clearRect(0, 0, 1200, 700);

	// draw minor grid lines
	context.strokeStyle = minorColor;
	context.lineWidth = 1.2;
	context.beginPath();
	// draws positive xMinor lines
	var xAxisPoint = x0 + xMinorSpacing;
	while (xAxisPoint <= left + width) {
		context.moveTo(xAxisPoint, top);
		context.lineTo(xAxisPoint, top + height);
		xAxisPoint += xMinorSpacing;
	}
	// draws negative xMinor lines
	var xAxisPoint = x0 - xMinorSpacing;
	while (xAxisPoint >= left) {
		context.moveTo(xAxisPoint, top);
		context.lineTo(xAxisPoint, top + height);
		xAxisPoint -= xMinorSpacing;
	}
	// draws positive yMinor lines
	var yAxisPoint = y0 - yMinorSpacing;
	while (yAxisPoint >= top) {
		context.moveTo(left, yAxisPoint);
		context.lineTo(left + width, yAxisPoint);
		yAxisPoint -= yMinorSpacing;
	}
	// draws negative yMinor lines
	var yAxisPoint = y0 + yMinorSpacing;
	while (yAxisPoint <= top + height) {
		context.moveTo(left, yAxisPoint);
		context.lineTo(left + width, yAxisPoint);
		yAxisPoint += yMinorSpacing;
	}
	context.closePath();
	context.stroke();		
	
	// draw major lines
	context.strokeStyle = majorColor;
	context.lineWidth = 2;
	context.beginPath();
	// draws positive xMajor lines
	var xAxisPoint = x0 + xMajorSpacing;
	while (xAxisPoint <= left + width) {
		context.moveTo(xAxisPoint, top);
		context.lineTo(xAxisPoint, top + height);
		xAxisPoint += xMajorSpacing;
	}
	// draws negative xMajor lines
	var xAxisPoint = x0 - xMajorSpacing;
	while (xAxisPoint >= left) {
		context.moveTo(xAxisPoint, top);
		context.lineTo(xAxisPoint, top + height);
		xAxisPoint -= xMajorSpacing;
	}
	// draws positive yMajor lines
	var yAxisPoint = y0 - yMajorSpacing;
	while (yAxisPoint >= top) {
		context.moveTo(left, yAxisPoint);
		context.lineTo(left + width, yAxisPoint);
		yAxisPoint -= yMajorSpacing;
	}
	// draws negative yMajor lines
	var yAxisPoint = y0 + yMajorSpacing;
	while (yAxisPoint <= top + height) {
		context.moveTo(left, yAxisPoint);
		context.lineTo(left + width, yAxisPoint);
		yAxisPoint += yMajorSpacing;
	}
	context.closePath();
	context.stroke();		
	
	// draw axes
	context.beginPath();
	context.strokeStyle = xAxisColor;
	context.lineWidth = 3;	
	// if neccesary, draw x-Axis
	if (y0 > top && y0 < top + height) {
		context.moveTo(left, y0);
		context.lineTo(left + width, y0);	
	}
	context.closePath();
	context.stroke();
	context.beginPath();
	context.strokeStyle = yAxisColor;
	context.lineWidth = 3;
	// if neccesary, draw y-Axis
	if (x0 > left && x0 < left + width) {
		context.moveTo(x0, top);
		context.lineTo(x0, top + height);	
	}
	context.closePath();
	context.stroke();
	
	var labelFontSize = fontSize * 1.375;
	
	// draw an arrow and label at the top of the y-axis
	context.fillStyle = yAxisColor;
	context.strokeStyle = yAxisColor;
	context.beginPath();
	context.moveTo(x0DisplayPos, top + 2);
	context.lineTo(x0DisplayPos - 5, top + 12);
	context.lineTo(x0DisplayPos + 5, top + 12);
	context.lineTo(x0DisplayPos, top + 2);
	context.closePath();
	context.stroke();
	context.fill();
	context.textAlign = 'center';
	context.textBaseline = "bottom";

	wrapText(context, 'y', x0DisplayPos + 5, top - 15, 50, 40, 'italic '+labelFontSize+'px Times New Roman', '#000');
	
	// draw an arrow and label at the right of the x-axis
	context.fillStyle = xAxisColor;
	context.strokeStyle = xAxisColor;	
	context.beginPath();
	context.moveTo(left + width - 2, y0DisplayPos);
	context.lineTo(left + width - 12, y0DisplayPos - 5);
	context.lineTo(left + width - 12, y0DisplayPos + 5);
	context.lineTo(left + width - 2, y0DisplayPos);
	context.closePath();
	context.stroke();
	context.fill();	
	context.textAlign = 'left';
	context.textBaseline = "middle";
	wrapText(context, 'x', left + width + 15, y0DisplayPos - 5, 50, 40, 'italic '+labelFontSize+'px Times New Roman', '#000');
	
	// draw a black rectangular border
	context.strokeStyle = '#000';
	context.lineWidth = 4;
	context.strokeRect(left, top, width, height);	

	// mark the origin, if it is visible
	if (x0 >= left && x0 <= left + width && y0 >= top && y0 <= top + height) {
		context.textAlign = 'center';
		context.textBaseline = "middle";
		context.strokeStyle = '#666';
		context.lineWidth = 2;
		context.beginPath();
		context.arc(x0,y0,10,0,2*Math.PI);
		context.closePath();
		context.stroke();
	}
	
	// draw axes numbers
	context.font = '24px Arial';
	context.textAlign = "center";
	context.textBaseline = "top";

	// draw positive x axis numbers as multiple of pi
	var xAxisPoint = x0 + xMajorSpacing;
	var major = 1;
	while (xAxisPoint <= left + width) {
		var frac = {num: major*xMajorStep.num, denom:xMajorStep.denom};
		var axisValue = multOfPiText(frac);
		context.clearRect(xAxisPoint - 2, y0DisplayPos + 3, 4, fontSize * 1.15);
		drawMathsText(context, axisValue, 0.8 * fontSize, xAxisPoint, y0DisplayPos + 1 + 0.7 * fontSize, true, [], 'center', 'middle', '#000')
		major += 1;
		xAxisPoint += xMajorSpacing;
	}
	
	// draw negative x axis numbers as multiple of pi
	xAxisPoint = x0 - xMajorSpacing;
	major = -1;
	while (xAxisPoint >= left) {
		var frac = {num: major*-1*xMajorStep.num, denom:xMajorStep.denom}
		var axisValue = multOfPiText(frac);
		context.clearRect(xAxisPoint - 2, y0DisplayPos + 3, 4, fontSize * 1.15);
		drawMathsText(context, axisValue, 0.8 * fontSize, xAxisPoint, y0DisplayPos + 1 + 0.7 * fontSize, true, [], 'center', 'middle', '#000')
		major -= 1;
		xAxisPoint -= xMajorSpacing;
	}
					
	context.textBaseline = "middle";
	context.textAlign = "right";
	context.fillStyle = '#000';
	
	// positive y numbers
	var yAxisPoint = y0 - yMajorSpacing;
	var major = 1;
	while (yAxisPoint >= top) {
		var axisValue = Number(roundSF(major*yMajorStep, 5));
		var textWidth = context.measureText(String(axisValue)).width	
		context.clearRect(x0DisplayPos - textWidth - 11, yAxisPoint - fontSize * 0.5, textWidth + 3, fontSize);
		wrapText(context, String(axisValue), x0DisplayPos - 2, yAxisPoint - 2, 50, 40, fontSize + 'px Arial')
		major += 1;
		yAxisPoint -= yMajorSpacing;
	}

	// negative y numbers
	var yAxisPoint = y0 + yMajorSpacing;
	var major = -1;
	while (yAxisPoint <= top + height) {
		var axisValue = Number(roundSF(major*yMajorStep, 5));
		var textWidth = context.measureText(String(axisValue)).width	
		context.clearRect(x0DisplayPos - textWidth - 11, yAxisPoint - fontSize * 0.5, textWidth + 3, fontSize);
		wrapText(context, String(axisValue), x0DisplayPos - 2, yAxisPoint - 2, 50, 40, fontSize + 'px Arial')
		major -= 1;
		yAxisPoint += yMajorSpacing;
	}	
}

function multOfPiText(frac) { // frac is an object with num and denom properties
	var newNum, newDenom, hcf2;
	var returnArray = [];
	if (frac.num == 0) return ["0"];
	if (frac.num < 0) {
		frac.num = frac.num * -1;
		if (frac.denom < 0) {
			frac.denom = frac.denom * -1;
		} else {
			returnArray.push("-")	
		}
	} else {
		if (frac.denom < 0) {
			frac.denom = frac.denom * -1;
			returnArray.push("-")	
		}
	}
	hcf2 = hcf(frac.num, frac.denom);
	newNum = frac.num / hcf2;
	newDenom = frac.denom / hcf2;
	if (newDenom == 1) {
		if (newNum == 1) {
			returnArray.push(String.fromCharCode(0x03C0));	
		} else {
			returnArray.push(String(newNum) + String.fromCharCode(0x03C0));								
		}
	} else {
		if (newNum == 1) {
			newNum = String.fromCharCode(0x03C0);
		} else {
			newNum = String(newNum) + String.fromCharCode(0x03C0);
		}
		returnArray.push(['frac', [newNum], [String(newDenom)]])
	}
	return returnArray;
}

function drawCoord(context,contextLeft,contextTop,gridDetails,x,y,opt_color,opt_size,opt_lineWidth) {
	if (typeof gridDetails.sf !== 'undefined') {
		var sf = gridDetails.sf;
	} else {		
		var sf = 1;
	}
	var mode = gridDetails.angleMode || 'deg';
	var left = gridDetails.left - contextLeft; // use dimensions relative to background canvas (1200x700)
	var top = gridDetails.top - contextTop;   // rather than the context supplied
	if (y < gridDetails.yMin || y > gridDetails.yMax) return;
	if (mode == 'deg') {
		if (x < gridDetails.xMin || x > gridDetails.xMax) return;
		var xPos = getPosOfCoordX2(x, left, gridDetails.width, gridDetails.xMin, gridDetails.xMax);
	} else {
		if (x < Math.PI*gridDetails.xMin[0]/gridDetails.xMin[1] || x > Math.PI*gridDetails.xMax[0]/gridDetails.xMax[1]) return;
		var xPos = getPosOfCoordX2(x, left, gridDetails.width, Math.PI*gridDetails.xMin[0]/gridDetails.xMin[1], Math.PI*gridDetails.xMax[0]/gridDetails.xMax[1]);		
	}
	var yPos = getPosOfCoordY2(y, top, gridDetails.height, gridDetails.yMin, gridDetails.yMax);		
	var color = opt_color || '#00F';
	var size = gridDetails.pointSize*sf || opt_size*sf || 7*sf;
	context.lineCap = 'round';
	context.lineJoin = 'round';	
	context.save();
	context.strokeStyle = color;
	context.lineWidth = gridDetails.pointWidth*sf || opt_lineWidth*sf || 1.5*sf;
	context.beginPath();
	context.moveTo(xPos - size, yPos - size);
	context.lineTo(xPos + size, yPos + size);
	context.moveTo(xPos - size, yPos + size);
	context.lineTo(xPos + size, yPos - size);			
	context.closePath();
	context.stroke();
	context.restore();
}

function fillPolygonOnGrid(context,contextLeft,contextTop,gridDetails,vertices,opt_color,opt_alpha) {
	var left = gridDetails.left - contextLeft; // use dimensions relative to background canvas (1200x700)
	var top = gridDetails.top - contextTop;   // rather than the context supplied

	var color = opt_color || '#00F';
	var colorRGB = hexToRgb(color);
	
	var alpha = opt_alpha || 0.2;
	
	context.save();
	context.fillStyle = "rgba("+colorRGB.r+","+colorRGB.g+","+colorRGB.b+","+alpha+")";
	context.beginPath();

	var xPos = getPosOfCoordX2(vertices[0][0],left,gridDetails.width,gridDetails.xMin,gridDetails.xMax);
	var yPos = getPosOfCoordY2(vertices[0][1],top,gridDetails.height,gridDetails.yMin,gridDetails.yMax);
	context.moveTo(xPos,yPos);
	
	for (var i = 1; i < vertices.length; i++) {
		var xPos = getPosOfCoordX2(vertices[i][0],left,gridDetails.width,gridDetails.xMin,gridDetails.xMax);
		var yPos = getPosOfCoordY2(vertices[i][1],top,gridDetails.height,gridDetails.yMin,gridDetails.yMax);
		context.lineTo(xPos,yPos);
	}
	
	context.fill();
	context.restore();
}

function getCoordAtMousePos(gridDetails,mode) {
	var mode2 = mode || gridDetails.angleMode || 'deg';
	if (mode2 == 'deg') {
		var xCoord = getCoordX2(mouse.x, gridDetails.left, gridDetails.width, gridDetails.xMin, gridDetails.xMax);
	} else {
		var xCoord = getCoordX2(mouse.x, gridDetails.left, gridDetails.width, Math.PI*gridDetails.xMin[0]/gridDetails.xMin[1], Math.PI*gridDetails.xMax[0]/gridDetails.xMax[1]);
	}
	var yCoord = getCoordY2(mouse.y, gridDetails.top, gridDetails.height, gridDetails.yMin, gridDetails.yMax);
	return [xCoord, yCoord];
}

function getCoordX2(xPos, left, width, xMin, xMax) {
	return (xMin + (xMax - xMin) * (xPos - left) / width);
}

function getCoordY2(yPos, top, height, yMin, yMax) {
	return (yMax - (yMax - yMin) * (yPos - top) / height); 
}

function getPosOfCoordX2(xCoord, left, width, xMin, xMax) {
	return (left + (xCoord - xMin) * width / (xMax - xMin));
}

function getPosOfCoordY2(yCoord, top, height, yMin, yMax) {
	return (top + (yMax - yCoord) * height / (yMax - yMin)); 
}

function getPosOfCoord(pos,gridDetails) { // given ([x,y],gridDetails)
	return [
		getPosOfCoordX2(pos[0],gridDetails.left,gridDetails.width,gridDetails.xMin,gridDetails.xMax),
		getPosOfCoordY2(pos[1],gridDetails.top,gridDetails.height,gridDetails.yMin,gridDetails.yMax)
	];
}

function drawLine(context,contextLeft,contextTop,gridDetails,x1,y1,x2,y2,opt_color,opt_thickness,opt_showPoints,opt_lineSegment,opt_dash,opt_dashWidth,opt_dashGapWidth) {
	if (typeof gridDetails.sf !== 'undefined') {
		var sf = gridDetails.sf;
	} else {		
		var sf = 1;
	}	
	var mode = gridDetails.angleMode || 'deg';
	var left = gridDetails.left - contextLeft; // use dimensions relative to background canvas (1200x700)
	var top = gridDetails.top - contextTop;   // rather than the context supplied
	var width = gridDetails.width;
	var height = gridDetails.height;
	var yMin = gridDetails.yMin;
	var yMax = gridDetails.yMax;			

	if (mode == 'deg' || typeof gridDetails.xMin == 'number') {
		var xMin = gridDetails.xMin;
		var xMax = gridDetails.xMax;
	} else {
		var xMin = Math.PI*gridDetails.xMin[0]/gridDetails.xMin[1];
		var xMax = Math.PI*gridDetails.xMax[0]/gridDetails.xMax[1];
	}
	
	var color = opt_color || '#00F';
	var thickness = gridDetails.lineWidth*sf || opt_thickness*sf || 3*sf;
	var showPoints = boolean(opt_showPoints, false);
	var lineSegment = boolean(opt_lineSegment, false);
	var dash = boolean(opt_dash, false);
	var dashWidth = def([opt_dashWidth*sf,15*sf]);
	var dashGapWidth = def([opt_dashGapWidth*sf,5*sf]);

	var x1Pos = getPosOfCoordX2(x1, left, width, xMin, xMax);
	var y1Pos = getPosOfCoordY2(y1, top, height, yMin, yMax);			
	var x2Pos = getPosOfCoordX2(x2, left, width, xMin, xMax);
	var y2Pos = getPosOfCoordY2(y2, top, height, yMin, yMax);
	
	// check if the line is visible on the grid	
	var x1vis = 0;
	var y1vis = 0;
	var x2vis = 0;
	var y2vis = 0;
	if (x1 < xMin) x1vis = -1;
	if (x1 > xMax) x1vis = 1;
	if (y1 < yMin) y1vis = -1;
	if (y1 > yMax) y1vis = 1;			
	if (x2 < xMin) x2vis = -1;
	if (x2 > xMax) x2vis = 1;
	if (y2 < yMin) y2vis = -1;
	if (y2 > yMax) y2vis = 1;
	if ((x1vis == -1 && x2vis == -1) || (x1vis == 1 && x2vis == 1) || (y1vis == -1 && y2vis == -1) || (y1vis == 1 && y2vis == 1)) return;
	
	// check if the line (treated as infinite) intersects at least one of the four edges of the grid
	if (intersects2(x1,y1,x2,y2,xMin,yMin,xMax,yMin) == false &&
		intersects2(x1,y1,x2,y2,xMin,yMin,xMin,yMax) == false &&
		intersects2(x1,y1,x2,y2,xMax,yMin,xMax,yMax) == false &&
		intersects2(x1,y1,x2,y2,xMin,yMax,xMax,yMax) == false) {
		return;
	}
	
	context.save();
	if (typeof context.setLineDash !== 'function') context.setLineDash = function(){};
	context.setLineDash([]);
	context.lineCap = 'round';
	context.lineJoin = 'round';			
	if (showPoints == true) {
		// plot the two points if they are visible on the grid
		if (x1 >= xMin && x1 <= xMax && y1 >= yMin && y1 <= yMax) {
			context.save();
			context.strokeStyle = color;
			context.lineWidth = thickness * 0.7;
			context.beginPath();
			context.moveTo(x1Pos - 8, y1Pos - 8);
			context.lineTo(x1Pos + 8, y1Pos + 8);
			context.moveTo(x1Pos - 8, y1Pos + 8);
			context.lineTo(x1Pos + 8, y1Pos - 8);			
			context.closePath();
			context.stroke();
			context.restore();
		}
		if (x2 >= xMin && x2 <= xMax && y2 >= yMin && y2 <= yMax) {
			context.save();
			context.strokeStyle = color;
			context.lineWidth = thickness * 0.7;
			context.beginPath();
			context.moveTo(x2Pos - 8, y2Pos - 8);
			context.lineTo(x2Pos + 8, y2Pos + 8);
			context.moveTo(x2Pos - 8, y2Pos + 8);
			context.lineTo(x2Pos + 8, y2Pos - 8);			
			context.closePath();
			context.stroke();
			context.restore();
		}
	}
	
	// if it is a line segment
	if (lineSegment == true) {
		if (x1Pos == x2Pos) { // special case: vertical line, infinite gradient
			if (y1Pos < top) {y1Pos = top};
			if (y1Pos > (top + height)) {y1Pos = top + height};
			if (y2Pos < top) {y2Pos = top};
			if (y2Pos > (top + height)) {y2Pos = top + height};
		} else {
			// all of this is for truncating lines to the edge of the grid!
			var grad = (y2Pos - y1Pos) / (x2Pos - x1Pos);
			if (x1vis == -1) {
				if (y1vis == 1) {
					if ((x1Pos + (top - y1Pos) / grad) <= left) {
						y1Pos += grad * (left - x1Pos);
						x1Pos = left;						
					} else {
						x1Pos += (top - y1Pos) / grad;
						y1Pos = top;						
					}
				}
				if (y1vis == 0) {
					y1Pos += grad * (left - x1Pos);
					x1Pos = left;
				}
				if (y1vis == -1) {
					if ((x1Pos + (top + height - y1Pos) / grad) <= left) {
						y1Pos += grad * (left - x1Pos);
						x1Pos = left;						
					} else {
						x1Pos += (top + height - y1Pos) / grad;
						y1Pos = top + height;						
					}				
				}
			}
			if (x1vis == 0) {
				if (y1vis == 1) {
					x1Pos += (top - y1Pos) / grad;
					y1Pos = top;						
				}
				if (y1vis == -1) {
					x1Pos += (top + height - y1Pos) / grad;
					y1Pos = top + height;						
				}
			}
			if (x1vis == 1) {
				if (y1vis == 1) {
					if ((x1Pos - (y1Pos - top) / grad) >= (left + width)) {
						y1Pos -= grad * (x1Pos - (left + width));
						x1Pos = left + width;			
					} else {
						x1Pos -= (y1Pos - top) / grad;
						y1Pos = top;	
					}
				}
				if (y1vis == 0) {
					y1Pos -= grad * (x1Pos - (left + width));
					x1Pos = left + width;
				}
				if (y1vis == -1) {
					if ((x1Pos - (y1Pos - (top + height)) / grad) >= left + width) {
						y1Pos -= grad * (x1Pos - (left + width));
						x1Pos = left + width;
					} else {
						x1Pos -= (y1Pos - (top + height)) / grad;
						y1Pos = top + height;						
					}
				}
			}
			
			if (x2vis == -1) {
				if (y2vis == 1) {
					if ((x2Pos + (top - y2Pos) / grad) <= left) {
						y2Pos += grad * (left - x2Pos);
						x2Pos = left;						
					} else {
						x2Pos += (top - y2Pos) / grad;
						y2Pos = top;						
					}
				}
				if (y2vis == 0) {
					y2Pos += grad * (left - x2Pos);
					x2Pos = left;
				}
				if (y2vis == -1) {
					if ((x2Pos + (top + height - y2Pos) / grad) <= left) {
						y2Pos += grad * (left - x2Pos);
						x2Pos = left;						
					} else {
						x2Pos += (top + height - y2Pos) / grad;
						y2Pos = top + height;						
					}				
				}
			}
			if (x2vis == 0) {
				if (y2vis == 1) {
					x2Pos += (top - y2Pos) / grad;
					y2Pos = top;						
				}
				if (y2vis == -1) {
					x2Pos += (top + height - y2Pos) / grad;
					y2Pos = top + height;						
				}
			}
			if (x2vis == 1) {
				if (y2vis == 1) {
					if ((x2Pos - (y2Pos - top) / grad) >= (left + width)) {
						y2Pos -= grad * (x2Pos - (left + width));
						x2Pos = left + width;			
					} else {
						x2Pos -= (y2Pos - top) / grad;
						y2Pos = top;	
					}
				}
				if (y2vis == 0) {
					y2Pos -= grad * (x2Pos - (left + width));
					x2Pos = left + width;
				}
				if (y2vis == -1) {
					if ((x2Pos - (y2Pos - (top + height)) / grad) >= left + width) {
						y2Pos -= grad * (x2Pos - (left + width));
						x2Pos = left + width;
					} else {
						x2Pos -= (y2Pos - (top + height)) / grad;
						y2Pos = top + height;						
					}
				}
			}
		}
	} else {
		//infinite lines
		if (x1Pos == x2Pos) { // special case: vertical line, infinite gradient
			y1Pos = top;
			y2Pos = top + height;
		} else {
			/*var grad = (y2Pos - y1Pos) / (x2Pos - x1Pos); // old version
			var xPos = [];
			var yPos = [];					
			// where does the line meet the left boundary?
			xPos[0] = left;
			yPos[0] = y1Pos + (left - x1Pos) * grad;
			// where does the line meet the right boundary?
			xPos[1] = left + width;
			yPos[1] = y1Pos + (left + width - x1Pos) * grad;
			// where does the line meet the top boundary?
			yPos[2] = top;
			xPos[2] = x1Pos - (y1Pos - top) / grad;
			// where does the line meet the bottom boundary?
			yPos[3] = top + height;
			xPos[3] = x1Pos - (y1Pos - (top + height)) / grad;
			var onEdge = [false, false, false, false];
			if (yPos[0] >= top && yPos[0] <= top + height) onEdge[0] = true;
			if (yPos[1] >= top && yPos[1] <= top + height) onEdge[1] = true;
			if (xPos[2] > left && xPos[2] < left + width) onEdge[2] = true;
			if (xPos[3] > left && xPos[3] < left + width) onEdge[3] = true;
			console.log(onEdge);
			var done = [];
			var second = false;
			for (var i = 0; i < onEdge.length; i++) {
				if (onEdge[i] == true) {
					if (second == false) {
						x1Pos = xPos[i];
						y1Pos = yPos[i];
						second = true;	
					} else {
						x2Pos = xPos[i];
						y2Pos = yPos[i];									
					}
				}
			}*/
			var intersectionPoints = [];
			var polygon = [[left,top],[left+width,top],[left+width,top+height],[left,top+height]];
			for (var p = 0; p < 4; p++) { // check if line goes through corner points
				var point = polygon[p];
				if (isPointOnLine(point, [x1Pos,y1Pos], [x2Pos,y2Pos])) {
					intersectionPoints.push(point);
				}
			}
			for (var p = 0; p < 4; p++) {			
				var line = [polygon[p],polygon[(p+1)%4]];
				if (intersects2(x1Pos, y1Pos, x2Pos, y2Pos, line[0][0], line[0][1], line[1][0], line[1][1]) === true) {
					var point = intersection(x1Pos, y1Pos, x2Pos, y2Pos, line[0][0], line[0][1], line[1][0], line[1][1]);
					var found = false;
					for (var i = 0; i < intersectionPoints.length; i++) {
						if (intersectionPoints[i][0] === point[0] && intersectionPoints[i][1] === point[1]) {
							found = true;
							break;
						}
					}
					if (found === false) intersectionPoints.push(point);
				}
			}
			x1Pos = intersectionPoints[0][0];
			y1Pos = intersectionPoints[0][1];
			x2Pos = intersectionPoints[1][0];
			y2Pos = intersectionPoints[1][1];
		}
	}
	
	if (dash == true) context.setLineDash([dashWidth,dashGapWidth]);
	context.strokeStyle = color;
	context.lineWidth = thickness*sf;
	if (lineSegment == true) context.lineJoin = 'round';
	context.beginPath();
	context.moveTo(x1Pos, y1Pos);
	context.lineTo(x2Pos, y2Pos);
	context.stroke();
	context.setLineDash([]);

	context.restore();
	return [[x1Pos,y1Pos],[x2Pos,y2Pos]];
}

function calcFunc(gridDetails,funcString,opt_drawDensity,opt_domainMin,opt_domainMax) {
	var drawDensity = opt_drawDensity || 1; // work out points every ? canvas pixel(s)
	var angleMode = gridDetails.angleMode || 'deg';
	
	var domainMin = opt_domainMin || 'none';
	var domainMax = opt_domainMax || 'none';
	var domainMinPassed = false;
	if (domainMin == 'none') {domainMinPassed == true};
	var domainMaxPassed = false;

	var left = gridDetails.left;
	var top = gridDetails.top;
	var width = gridDetails.width;
	var height = gridDetails.height;
	var yMin = gridDetails.yMin;
	var yMax = gridDetails.yMax;
	if (angleMode == 'deg' || typeof gridDetails.xMin == 'number') {
		var xMin = gridDetails.xMin;
		var xMax = gridDetails.xMax;
	} else {
		var xMin = Math.PI*gridDetails.xMin[0]/gridDetails.xMin[1];
		var xMax = Math.PI*gridDetails.xMax[0]/gridDetails.xMax[1]
	}
	
	if (/[\^]/.test(funcString) == true) return;
		
	var funcPoints = [];
	
	for (var xPos = 0; xPos <= width + drawDensity; xPos = xPos + drawDensity) {
		var x = xMin + (xPos / width) * (xMax - xMin);
		
		try {
			eval('var y = '+funcString+';');
		}
		catch(err) {
			valid = false;
			return;	
		}	
		
		var yPos = (top + height) - height * ((y - yMin) / (yMax - yMin));
		var thisPoint = [left+xPos, yPos, x, y] // AND: inDomain?, plotHighLowOk?
		
		if ((domainMin == 'none' || x >= domainMin) && (domainMax == 'none' || x <= domainMax)) {
			thisPoint.push(true);
		} else {
			thisPoint.push(false);
		}
		
		if (yPos < top) {
			thisPoint.push('high');
		} else {
			if (yPos > (top + height)) {
				thisPoint.push('low');				
			} else {
				thisPoint.push('ok');
			}	
		}
		funcPoints.push(thisPoint);
	}
	
	return funcPoints;	
}

function calcFunc2(gridDetails,func,opt_drawDensity,opt_domainMin,opt_domainMax) {
	var drawDensity = opt_drawDensity || 1; // work out points every ? canvas pixel(s) 
	var angleMode = gridDetails.angleMode || 'deg';
	
	var domainMin = opt_domainMin || 'none';
	var domainMax = opt_domainMax || 'none';
	var domainMinPassed = false;
	if (domainMin == 'none') {domainMinPassed == true};
	var domainMaxPassed = false;

	var left = gridDetails.left;
	var top = gridDetails.top;
	var width = gridDetails.width;
	var height = gridDetails.height;
	var yMin = gridDetails.yMin;
	var yMax = gridDetails.yMax;
	if (angleMode == 'deg' || typeof gridDetails.xMin == 'number') {
		var xMin = gridDetails.xMin;
		var xMax = gridDetails.xMax;
	} else {
		var xMin = Math.PI*gridDetails.xMin[0]/gridDetails.xMin[1];
		var xMax = Math.PI*gridDetails.xMax[0]/gridDetails.xMax[1]
	}
		
	var funcPoints = [];
	
	for (var xPos = 0; xPos <= width + drawDensity; xPos = xPos + drawDensity) {
		var x = xMin + (xPos / width) * (xMax - xMin);
		
		try {
			y = func(x);
		}
		catch(err) {
			valid = false;
			continue;	
		}	
		if (y === false) continue;
		
		var yPos = (top + height) - height * ((y - yMin) / (yMax - yMin));
		var thisPoint = [left+xPos, yPos, x, y] // AND: inDomain?, plotHighLowOk?
		
		if ((domainMin == 'none' || x >= domainMin) && (domainMax == 'none' || x <= domainMax)) {
			thisPoint.push(true);
		} else {
			thisPoint.push(false);
		}
		
		if (yPos < top) {
			thisPoint.push('high');
		} else {
			if (yPos > (top + height)) {
				thisPoint.push('low');				
			} else {
				thisPoint.push('ok');
			}	
		}
		funcPoints.push(thisPoint);
	}
	
	return funcPoints;	
}

function drawFunc(context,contextLeft,contextTop,gridDetails,funcPoints,opt_color,opt_thickness,opt_asymptotes) {
	var top = gridDetails.top;
	var height = gridDetails.height;
	var path = [[]];
	var prevPlot = 'start';
	var pathNum = 0;
	var asymptotes = opt_asymptotes; // eg. [[90,1,-1]] - asymptote at 90, positive on left, negative on right
	
	// work out the path(s) of coordinates to be joined	
	// this takes account of the edge of the grid and doesn't go above or below
	for (var pos = 0; pos < funcPoints.length; pos++) {
		if (funcPoints[pos][4] == false) { // if not in domain
			prevPlot = funcPoints[pos][5];
			continue; 
		}

		var currPlot = funcPoints[pos][5];

		// check if an asymptote is being crossed
		var asymp = -1;
		if (typeof asymptotes == 'object' && pos > 0) {
			for (var i = 0; i < asymptotes.length; i++) {
				if (funcPoints[pos-1][2] <= asymptotes[i][0] && funcPoints[pos][2] >= asymptotes[i][0]) {
					asymp = i;
				}
			}
		}
		if (asymp > -1) {
			// if so, push top or bottom point into array
			if (asymptotes[asymp][1] >= 0 && prevPlot == 'ok') {
				path[pathNum].push([funcPoints[pos][0], top - contextTop]);
			} else if (asymptotes[asymp][1] < 0 && prevPlot == 'ok') {
				path[pathNum].push([funcPoints[pos][0], top + height - contextTop]);	
			}
			// set prevPlot to high or low
			if (asymptotes[asymp][2] >= 0) {
				prevPlot = 'high';
			} else {
				prevPlot = 'low';
			}
			// skip to next x value
			continue;
		}		
		
		
		if (currPlot == 'high') {
			if (prevPlot == 'ok') {
				path[pathNum].push([funcPoints[pos-1][0] - contextLeft + (funcPoints[pos][0] - funcPoints[pos-1][0]) * (funcPoints[pos-1][1] - top) / (funcPoints[pos-1][1] - funcPoints[pos][1]), top - contextTop]);
			}
		} else {
			if (currPlot == 'low') {
				if (prevPlot == 'ok') {
					path[pathNum].push([funcPoints[pos-1][0] - contextLeft + (funcPoints[pos][0] - funcPoints[pos-1][0]) * ((top + height) - funcPoints[pos-1][1]) / (funcPoints[pos][1] - funcPoints[pos-1][1]), top + height - contextTop]);
				}
			} else {
				if (prevPlot == 'ok') {
					path[pathNum].push([funcPoints[pos][0] - contextLeft, funcPoints[pos][1] - contextTop]);
				} else {
					if (prevPlot == 'high') {
						pathNum++;
						path[pathNum] = [];
						path[pathNum].push([funcPoints[pos-1][0] - contextLeft + (funcPoints[pos][0] - funcPoints[pos-1][0]) * (top - funcPoints[pos-1][1]) / (funcPoints[pos][1] - funcPoints[pos-1][1]), top - contextTop]);
						path[pathNum].push([funcPoints[pos][0] - contextLeft, funcPoints[pos][1] - contextTop]);
					} else {
						if (prevPlot == 'low') {
							pathNum++;
							path[pathNum] = [];
							path[pathNum].push([funcPoints[pos-1][0] + (funcPoints[pos][0] - funcPoints[pos-1][0]) * (funcPoints[pos-1][1] - (top + height)) / (funcPoints[pos-1][1] - funcPoints[pos][1]), top + height - contextTop]);
							path[pathNum].push([funcPoints[pos][0] - contextLeft, funcPoints[pos][1] - contextTop]);
						} else {
							path[pathNum].push([funcPoints[pos][0] - contextLeft, funcPoints[pos][1] - contextTop]);
						}
					}
				}
			}	
		}
		prevPlot = currPlot;
	}

	// draw the path(s)
	context.strokeStyle = def([opt_color,gridDetails.funcColor,'#00F']);
	context.lineWidth = def([opt_thickness,gridDetails.funcWidth,gridDetails.lineWidth,3]);
	context.lineCap = 'round';
	context.beginPath();	
	
	for (var pathNum = 0; pathNum < path.length; pathNum++) {
		if (path[pathNum].length < 2) continue;
		context.moveTo(path[pathNum][0][0],path[pathNum][0][1]);
		for (var point = 1; point < path[pathNum].length; point++) {
			context.lineTo(path[pathNum][point][0],path[pathNum][point][1]);	
		}
	}

	context.stroke();

	return path;
}

function calcFuncImplicitGridPos(gridDetails,func,increment) {
	function getLines(SW,SE,NW,NE) { // returns 0=S,1=W,2=N,3=E
		if (SW < 0) {
			if (SE < 0) {
				if (NE < 0) {
					if (NW < 0) { //return [];
						// ..
						// ..
						return [];
					} else { //return [];
						// ..
						// x.
						return [0,1];
					}
				} else {
					if (NW < 0) { //return [];
						// ..
						// .x
						return [0,3];
					} else { //return [];				
						// ..
						// xx
						return [1,3];
					}
				}					
			} else {			
				if (NE < 0) {
					if (NW < 0) { //return [];	
						// .x
						// ..
						return [2,3];							
					} else { //return [];
						// .x
						// x.
						return [0,1,2,3];							
					}									
				} else {			
					if (NW < 0) { //return [];
						// .x
						// .x
						return [0,2];					
					} else { //return [];
						// .x
						// xx
						return [1,2];							
					}									
				}					
			}				
		} else {
			if (SE < 0) {
				if (NE < 0) {
					if (NW < 0) { //return [];
						// x.
						// ..
						return [1,2];							
					} else { //return [];
						// x.
						// x.
						return [0,2];							
					}
				} else {
					if (NW < 0) { //return [];
						// x.
						// .x
						return [1,2,0,3];
					} else { //return [];
						// x.
						// xx
						return [2,3];							
					}			
				}
			} else {
				if (NE < 0) {
					if (NW < 0) { //return [];
						// ..
						// xx
						return [1,3];							
					} else { //return [];
						// xx
						// x.
						return [0,3];
					}									
				} else {
					if (NW < 0) { //return [];
						// xx
						// .x
						return [0,1];					
					} else { //return [];
						// xx
						// xx
						return [];						
					}									
				}					
			}				
		}		
	}
	
	var yMin = gridDetails.yMin;
	var yMax = gridDetails.yMax;
	var xMin = gridDetails.xMin;
	var xMax = gridDetails.xMax;	
	if (un(increment)) increment = Math.max(xMax-xMin,yMax-yMin)/500;
		
	var values = [];
	var pos = [];
	for (var y = yMin; y <= yMax; y += increment) {
		y = Math.min(yMax,y);
		var row = [];
		for (var x = xMin; x <= xMax; x += increment) {
			x = Math.min(xMax,x);
			row.push({x:x,y:y,value:func(x,y)});
			if (x === xMax) break;
		}
		values.push(row);
		if (y === yMax) break;
	}
	for (var r = 0; r < values.length-1; r++) {
		for (var c = 0; c < values[r].length-1; c++) {
			var NW = values[r][c].value;
			var NE = values[r][c+1].value;
			var SW = values[r+1][c].value;
			var SE = values[r+1][c+1].value;
			var lines = getLines(SW,SE,NW,NE);
			while (lines.length > 1) {
				var pos2 = []; 
				for (var i = 0; i < 2; i++) {
					if (lines[i] === 0) { //0=S,1=W,2=N,3=E
						var x = (values[r][c].x+values[r][c+1].x)/2;
						var y = values[r][c].y;
					} else if (lines[i] === 1) {
						var x = values[r][c].x;
						var y = (values[r][c].y+values[r+1][c].y)/2;
					} else if (lines[i] === 2) {
						var x = (values[r][c].x+values[r][c+1].x)/2;
						var y = values[r+1][c].y;
					} else {
						var x = values[r][c+1].x;
						var y = (values[r][c].y+values[r+1][c].y)/2;
					}
					pos2.push([x,y]);
				}
				pos.push(pos2);
				lines.shift();
				lines.shift();
			}
		}
	}
	return pos;
}

function calcFuncImplicitCanvasPos(gridDetails, funcPos) {
	var canvasPos = [];
	for (var p = 0; p < funcPos.length; p++) {
		var pos = funcPos[p];
		canvasPos.push([getPosOfCoord(pos[0],gridDetails),getPosOfCoord(pos[1],gridDetails)]);
	}
	return canvasPos;
}

function drawFuncImplicit(ctx, canvasPos, color, lineWidth) {
	if (un(color)) color = '#00F';
	if (un(lineWidth)) lineWidth = 5;
	ctx.save();
	ctx.strokeStyle = color;
	ctx.lineWidth = lineWidth;
	ctx.beginPath();
	for (var p = 0; p < canvasPos.length; p++) {
		var pos = canvasPos[p];
		ctx.moveTo(pos[0][0],pos[0][1]);
		ctx.lineTo(pos[1][0],pos[1][1]);
	}
	ctx.stroke();
	ctx.restore();
}



function plotFunc(ctx,gridDetails,func,density,color) {
	function getLines(SW,SE,NW,NE) { // returns 0=S,1=W,2=N,3=E
		if (SW < 0) {
			if (SE < 0) {
				if (NE < 0) {
					if (NW < 0) { //return [];
						// ..
						// ..
						return [];
					} else { //return [];
						// ..
						// x.
						return [0,1];
					}
				} else {
					if (NW < 0) { //return [];
						// ..
						// .x
						return [0,3];
					} else { //return [];				
						// ..
						// xx
						return [1,3];
					}
				}					
			} else {			
				if (NE < 0) {
					if (NW < 0) { //return [];	
						// .x
						// ..
						return [2,3];							
					} else { //return [];
						// .x
						// x.
						return [0,1,2,3];							
					}									
				} else {			
					if (NW < 0) { //return [];
						// .x
						// .x
						return [0,2];					
					} else { //return [];
						// .x
						// xx
						return [1,2];							
					}									
				}					
			}				
		} else {
			if (SE < 0) {
				if (NE < 0) {
					if (NW < 0) { //return [];
						// x.
						// ..
						return [1,2];							
					} else { //return [];
						// x.
						// x.
						return [0,2];							
					}
				} else {
					if (NW < 0) { //return [];
						// x.
						// .x
						return [1,2,0,3];
					} else { //return [];
						// x.
						// xx
						return [2,3];							
					}			
				}
			} else {
				if (NE < 0) {
					if (NW < 0) { //return [];
						// ..
						// xx
						return [1,3];							
					} else { //return [];
						// xx
						// x.
						return [0,3];
					}									
				} else {
					if (NW < 0) { //return [];
						// xx
						// .x
						return [0,1];					
					} else { //return [];
						// xx
						// xx
						return [];						
					}									
				}					
			}				
		}		
	}
	
	if (typeof density == 'undefined') density = 5; // density is the width of each square
	var angleMode = gridDetails.angleMode || 'deg';	
	var yMin = gridDetails.yMin;
	var yMax = gridDetails.yMax;
	if (angleMode == 'deg' || typeof gridDetails.xMin == 'number') {
		var xMin = gridDetails.xMin;
		var xMax = gridDetails.xMax;
	} else {
		var xMin = Math.PI*gridDetails.xMin[0]/gridDetails.xMin[1];
		var xMax = Math.PI*gridDetails.xMax[0]/gridDetails.xMax[1]
	}
	
	if (typeof color == 'undefined') color = '#00F';
	ctx.strokeStyle = color;
	ctx.beginPath();
	var xInc = (xMax - xMin) / (gridDetails.width / density);
	var yInc = (yMax - yMin) / (gridDetails.height / density);
	var yPos = gridDetails.top + gridDetails.height;
	for (var y = yMin; y < yMax; y += yInc) {
		var xPos = gridDetails.left;
		for (var x = xMin; x < xMax; x += xInc) {
			var x2 = Math.min(x+xInc,xMax);
			var y2 = Math.min(y+yInc,yMax);
			var NW = func(x,y);
			var NE = func(x2,y);
			var SW = func(x,y2);
			var SE = func(x2,y2);
			var lines = getLines(SW,SE,NW,NE);
			while (lines.length > 1) {
				var pos = [];
				for (var i = 0; i < 2; i++) {
					var xPos2 = Math.min(xPos+density,gridDetails.left+gridDetails.width);
					var yPos2 = Math.max(yPos-density,gridDetails.top);
					var px = [xPos,xPos,xPos,xPos2][lines[i]];
					var py = [yPos,yPos,yPos2,yPos][lines[i]];
					var pf = [NW,NW,SW,NE][lines[i]];			
					var qx = [xPos2,xPos,xPos2,xPos2][lines[i]];
					var qy = [yPos,yPos2,yPos2,yPos2][lines[i]];
					var qf = [NE,SW,SE,SE][lines[i]];
					pos[i] = [px,py];
					if (px !== qx) pos[i][0] = px + density * ((0 - pf) / (qf - pf));
					if (py !== qy) pos[i][1] = py - density * ((0 - pf) / (qf - pf));
				}
				ctx.moveTo(pos[0][0],pos[0][1]);
				ctx.lineTo(pos[1][0],pos[1][1]);
				lines.shift();
				lines.shift();
			}
			xPos += density;
		}
		yPos -= density;
	}
	ctx.stroke();
}

function slowPlotFunc(context,contextLeft,contextTop,gridDetails,funcPoints,plotTime,opt_color,opt_thickness) {
	var top = gridDetails.top;
	var height = gridDetails.height;
	var prevPlot = 'start';
	var path = [[]];
	var pathNum = 0;

	// work out the path(s) of coordinates to be joined	
	// this takes account of the edge of the grid and doesn't go above or below
	for (var pos = 0; pos < funcPoints.length; pos++) {
		if (funcPoints[pos][4] == false) { // if not in domain
			prevPlot = funcPoints[pos][5];
			continue; 
		}
		var currPlot = funcPoints[pos][5];
		if (currPlot == 'high') {
			if (prevPlot == 'ok') {
				path[pathNum].push([funcPoints[pos-1][0] - contextLeft + (funcPoints[pos][0] - funcPoints[pos-1][0]) * (funcPoints[pos-1][1] - top) / (funcPoints[pos-1][1] - funcPoints[pos][1]), top - contextTop]);
			}
		} else {
			if (currPlot == 'low') {
				if (prevPlot == 'ok') {
					path[pathNum].push([funcPoints[pos-1][0] - contextLeft + (funcPoints[pos][0] - funcPoints[pos-1][0]) * ((top + height) - funcPoints[pos-1][1]) / (funcPoints[pos][1] - funcPoints[pos-1][1]), top + height - contextTop]);
				}
			} else {
				if (prevPlot == 'ok') {
					path[pathNum].push([funcPoints[pos][0] - contextLeft, funcPoints[pos][1] - contextTop]);
				} else {
					if (prevPlot == 'high') {
						if (pathNum > 0) {
							pathNum++;
							path[pathNum] = [];
						}
						path[pathNum].push([funcPoints[pos-1][0] - contextLeft + (funcPoints[pos][0] - funcPoints[pos-1][0]) * (top - funcPoints[pos-1][1]) / (funcPoints[pos][1] - funcPoints[pos-1][1]), top - contextTop]);
						path[pathNum].push([funcPoints[pos][0] - contextLeft, funcPoints[pos][1] - contextTop]);
					} else {
						if (prevPlot == 'low') {
						if (pathNum > 0) {
							pathNum++;
							path[pathNum] = [];
						}
							path[pathNum].push([funcPoints[pos-1][0] + (funcPoints[pos][0] - funcPoints[pos-1][0]) * (funcPoints[pos-1][1] - (top + height)) / (funcPoints[pos-1][1] - funcPoints[pos][1]), top + height - contextTop]);
							path[pathNum].push([funcPoints[pos][0] - contextLeft, funcPoints[pos][1] - contextTop]);
						} else {
							path[pathNum].push([funcPoints[pos][0] - contextLeft, funcPoints[pos][1] - contextTop]);
						}
					}
				}
			}	
		}
		prevPlot = currPlot;
	}

	// draw the path(s)
	context.strokeStyle = opt_color || '#00F';
	context.lineWidth = opt_thickness || 3;
	context.lineCap = 'round';
	context.beginPath();	
	
	var numOfFrames = 0;
	for (var pathNum = 0; pathNum < path.length; pathNum++) {
		numOfFrames += path[pathNum].length;
	}
	var frameTime = plotTime / numOfFrames;
	var plotPath = path;
	var plotPathNum = 0;
	var plotPointNum = 0;
	
	var slowPlotInterval = setCorrectingInterval(function() {
		if (plotPointNum == 0) {
			context.beginPath();
			context.moveTo(plotPath[plotPathNum][plotPointNum][0],plotPath[plotPathNum][plotPointNum][1]);
		} else {
			context.lineTo(plotPath[plotPathNum][plotPointNum][0],plotPath[plotPathNum][plotPointNum][1]);
			context.stroke();
		}
		if (plotPointNum == plotPath[plotPathNum].length - 1) {
			if (plotPathNum == plotPath.length - 1) {
				clearCorrectingInterval(slowPlotInterval);
			} else {
				plotPathNum++;
				plotPointNum = 0;	
			}
		} else {
			plotPointNum++;	
		}
	}, frameTime);
}

function convertToRadians(funcString) {
	// for a trig function in degrees, /180*Math.Pi
	// find instances of trig functions
	for (var char = 0; char < funcString.length; char++) {
		if (funcString.slice(char).indexOf('Math.sin(') == 0 || funcString.slice(char).indexOf('Math.cos(') == 0 || funcString.slice(char).indexOf('Math.tan(') == 0) {
			var bracketCount = 1;
			var charCount = 9;
			do {
				if (funcString.slice(char).charAt(charCount) == '(') bracketCount++;
				if (funcString.slice(char).charAt(charCount) == ')') bracketCount--;
				charCount++;
			} while (bracketCount > 0 && char + charCount <= funcString.length)
			var inner = funcString.slice(char).slice(9, charCount - 1);
			if (inner.indexOf('Math.PI') == -1) {
				inner = "(" + inner + ")*Math.PI/180";
				funcString = funcString.slice(0,char+9) + inner + funcString.slice(char+charCount-1);	
			}
		}
		// INVERSE TRIG FUNCTIONS NOT DONE YET!!
	}
	return funcString
}

function calcAreaUnderFunc(gridDetails,funcString,min,max,opt_drawDensity) {
	if (typeof min !== 'number') min = gridDetails.xMin;
	if (typeof max !== 'number') max = gridDetails.xMax;
	var drawDensity = opt_drawDensity || 1; // work out points every ? canvas pixel(s) 

	var minPassed = false;
	if (min <= gridDetails.min) {minPassed == true};
	var maxPassed = false;

	var left = gridDetails.left;
	var top = gridDetails.top;
	var width = gridDetails.width;
	var height = gridDetails.height;
	var xMin = gridDetails.xMin;
	var xMax = gridDetails.xMax;
	var yMin = gridDetails.yMin;
	var yMax = gridDetails.yMax;

	if (/[\^]/.test(funcString) == true) return;
		
	var funcPoints = [[getPosOfCoordX2(min,left,width,xMin,xMax),getPosOfCoordY2(0,top,height,yMin,yMax)]];
	
	for (var xPos = getPosOfCoordX2(min,left,width,xMin,xMax)-left; xPos <= getPosOfCoordX2(max,left,width,xMin,xMax)-left; xPos = xPos + drawDensity) {
		var x = xMin + (xPos / width) * (xMax - xMin);
		try {
			eval('var y = '+funcString+';');
		}
		catch(err) {
			valid = false;
			return;	
		}	
		
		var yPos = Math.min(Math.max((top + height) - height * ((y - yMin) / (yMax - yMin)), top), top + height);
		funcPoints.push([left+xPos, yPos]);
	}
	
	funcPoints.push(
		[getPosOfCoordX2(max,left,width,xMin,xMax),getPosOfCoordY2(0,top,height,yMin,yMax)],
		[getPosOfCoordX2(min,left,width,xMin,xMax),getPosOfCoordY2(0,top,height,yMin,yMax)]
	);
	
	return funcPoints;	
}

function drawFuncArea(context,contextLeft,contextTop,gridDetails,funcAreaPoints,boundaryLines,opt_color,opt_opacity) {
	var boundaryLines = boolean(boundaryLines,true);
	var color = opt_color || '#00F';
	var opacity = opt_opacity || 0.5;
	
	var colorRGB = hexToRgb(color);
	context.save();
	context.fillStyle = "rgba("+colorRGB.r+","+colorRGB.g+","+colorRGB.b+","+opacity+")";
	context.beginPath();	
	
	context.moveTo(funcAreaPoints[0][0],funcAreaPoints[0][1]);
	for (var i = 0; i < funcAreaPoints.length; i++) {
		context.lineTo(funcAreaPoints[i][0],funcAreaPoints[i][1]);	
	}
	
	context.fill();	
	
	if (boundaryLines = true) {
		context.beginPath();
		context.strokeStyle = color;
		context.lineWidth = 3;
		context.moveTo(funcAreaPoints[0][0],funcAreaPoints[0][1]);
		context.lineTo(funcAreaPoints[1][0],funcAreaPoints[1][1]);
		context.moveTo(funcAreaPoints[funcAreaPoints.length-3][0],funcAreaPoints[funcAreaPoints.length-3][1]);
		context.lineTo(funcAreaPoints[funcAreaPoints.length-2][0],funcAreaPoints[funcAreaPoints.length-2][1]);
		context.stroke();
	}
	context.restore();
}

function convertCoordsGridToCanvas(contextLeft,contextTop,gridDetails,pointsArray) {
	var left = gridDetails.left - contextLeft; // use dimensions relative to background canvas (1200x700)
	var top = gridDetails.top - contextTop;   // rather than the context supplied
	var width = gridDetails.width;
	var height = gridDetails.height;
	var xMin = gridDetails.xMin;
	var xMax = gridDetails.xMax;
	var yMin = gridDetails.yMin;
	var yMax = gridDetails.yMax;
	
	var returnArray = [];
	
	for (var i = 0; i < pointsArray.length; i++) {
		returnArray[i] = [getPosOfCoordX2(pointsArray[i][0],left,width,xMin,xMax),getPosOfCoordY2(pointsArray[i][1],top,height,yMin,yMax)];
	}
	
	return returnArray;
}

function drawSmoothCurve(ctx,gridDetails,pointsArray,tension,numOfPoints,forceUpwards) {
	var gridPoints = convertCoordsGridToCanvas(0,0,gridDetails,pointsArray);
	var pts = getSmoothCurvePoints(gridPoints,tension,false,numOfPoints,forceUpwards);

    ctx.beginPath();
	ctx.moveTo(pts[0], pts[1]);
    for (i = 2; i < pts.length - 1; i += 2) {
		ctx.lineTo(pts[i], pts[i+1]);
	}
	ctx.stroke();
}
function getSmoothCurvePoints(pts, tension, isClosed, numOfSegments, forceUpwards) {
	// flatten pts array
	var pts2 = [];
	for (var i = 0; i < pts.length; i++) {
		for (var j = 0; j < pts[i].length; j++) {
			pts2.push(pts[i][j]);
		}
	}

    // use input value if provided, or use a default value   
    tension = (typeof tension != 'undefined') ? tension : 0.5;
    isClosed = isClosed ? isClosed : false;
    numOfSegments = numOfSegments ? numOfSegments : 16;
	forceUpwards = boolean(forceUpwards,false);
	
    var _pts = [], res = [],    // clone array
        x, y,           // our x,y coords
        t1x, t2x, t1y, t2y, // tension vectors
        c1, c2, c3, c4,     // cardinal points
        st, t, i;       // steps based on num. of segments

    // clone array so we don't change the original
    //
    _pts = pts2.slice(0);
	
    // The algorithm require a previous and next point to the actual point array.
    // Check if we will draw closed or open curve.
    // If closed, copy end points to beginning and first points to end
    // If open, duplicate first points to befinning, end points to end
    if (isClosed) {
        _pts.unshift(pts2[pts2.length - 1]);
        _pts.unshift(pts2[pts2.length - 2]);
        _pts.unshift(pts2[pts2.length - 1]);
        _pts.unshift(pts2[pts2.length - 2]);
        _pts.push(pts2[0]);
        _pts.push(pts2[1]);
    }
    else {
        _pts.unshift(pts2[1]);   //copy 1. point and insert at beginning
        _pts.unshift(pts2[0]);
        _pts.push(pts2[pts2.length - 2]); //copy last point and append
        _pts.push(pts2[pts2.length - 1]);
    }
	
    // ok, lets start..

    // 1. loop goes through point array
    // 2. loop goes through each segment between the 2 pts + 1e point before and after
    for (i=2; i < (_pts.length - 4); i+=2) {
        for (t=0; t <= numOfSegments; t++) {

            // calc tension vectors
            t1x = (_pts[i+2] - _pts[i-2]) * tension;
            t2x = (_pts[i+4] - _pts[i]) * tension;

            t1y = (_pts[i+3] - _pts[i-1]) * tension;
            t2y = (_pts[i+5] - _pts[i+1]) * tension;

            // calc step
            st = t / numOfSegments;

            // calc cardinals
            c1 =   2 * Math.pow(st, 3)  - 3 * Math.pow(st, 2) + 1; 
            c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2); 
            c3 =       Math.pow(st, 3)  - 2 * Math.pow(st, 2) + st; 
            c4 =       Math.pow(st, 3)  -     Math.pow(st, 2);

            // calc x and y cords with common control vectors
            x = c1 * _pts[i]    + c2 * _pts[i+2] + c3 * t1x + c4 * t2x;
            y = c1 * _pts[i+1]  + c2 * _pts[i+3] + c3 * t1y + c4 * t2y;

			if (forceUpwards == true) {
if ((y < _pts[i+1] && y < _pts[i+3]) || (y > _pts[i+1] && y > _pts[i+3])) {
	y = (_pts[i+1] + _pts[i+3]) / 2;
}
if ((x < _pts[i] && x < _pts[i+2]) || (x > _pts[i] && x > _pts[i+2])) {
	x = (_pts[i] + _pts[i+2]) / 2;
}
			}

            //store points in array	
            res.push(x);
            res.push(y);

        }
    }

    return res;
}

function drawBoxPlot(ctx,contextLeft,contextTop,gridDetails,data,yMiddle,yHeight,options) {
	var left = gridDetails.left - contextLeft; // use dimensions relative to background canvas (1200x700)
	var top = gridDetails.top - contextTop;   // rather than the context supplied

	if (typeof options == 'undefined') options = {};
	
	ctx.save();
	ctx.strokeStyle = options.color || '#000';
	ctx.lineWidth = options.lineWidth || 4;
	ctx.lineJoin = 'round';
	ctx.lineCap = 'round';
	if (typeof ctx.setLineDash == 'undefined') ctx.setLineDash = function(){};
	ctx.setLineDash([]);
	
	var xPos = [];
	for (var i = 0; i < data.length; i++) {
		xPos[i] = getPosOfCoordX2(data[i],left,gridDetails.width,gridDetails.xMin,gridDetails.xMax);
	}
	var yPos = [
		getPosOfCoordY2(yMiddle - 0.5 * yHeight,top,gridDetails.height,gridDetails.yMin,gridDetails.yMax),
		getPosOfCoordY2(yMiddle - 0.3 * yHeight,top,gridDetails.height,gridDetails.yMin,gridDetails.yMax),
		getPosOfCoordY2(yMiddle,top,gridDetails.height,gridDetails.yMin,gridDetails.yMax),
		getPosOfCoordY2(yMiddle + 0.3 * yHeight,top,gridDetails.height,gridDetails.yMin,gridDetails.yMax),
		getPosOfCoordY2(yMiddle + 0.5 * yHeight,top,gridDetails.height,gridDetails.yMin,gridDetails.yMax)
	];
	
	// fill
	if (boolean(options.rangeOnly,false) == false && boolean(options.dashesOnly,false) == false && boolean(options.fill,false) == true) {
		ctx.fillStyle = options.fillColor || '#FCF';
		ctx.fillRect(xPos[1],yPos[0],xPos[3]-xPos[1],yPos[4]-yPos[0]);
	}
	
	ctx.beginPath();
	
	// horizLines
	if (boolean(options.dashesOnly,false) == false) {
		if (boolean(options.rangeOnly,false) == true) {
			ctx.moveTo(xPos[0],yPos[2]);
			ctx.lineTo(xPos[4],yPos[2]);
		} else {
			ctx.moveTo(xPos[0],yPos[2]);
			ctx.lineTo(xPos[1],yPos[2]);
			ctx.moveTo(xPos[1],yPos[0]);
			ctx.lineTo(xPos[3],yPos[0]);
			ctx.moveTo(xPos[1],yPos[4]);
			ctx.lineTo(xPos[3],yPos[4]);
			ctx.moveTo(xPos[3],yPos[2]);
			ctx.lineTo(xPos[4],yPos[2]);			
		}	
	}
	
	// vertLines
	if (boolean(options.rangeOnly,false) == true) {
		ctx.moveTo(xPos[0],yPos[1]);
		ctx.lineTo(xPos[0],yPos[3]);
		ctx.moveTo(xPos[4],yPos[1]);
		ctx.lineTo(xPos[4],yPos[3]);
		ctx.stroke();		
	} else {
		ctx.moveTo(xPos[0],yPos[1]);
		ctx.lineTo(xPos[0],yPos[3]);
		ctx.moveTo(xPos[1],yPos[0]);
		ctx.lineTo(xPos[1],yPos[4]);
		ctx.moveTo(xPos[3],yPos[0]);
		ctx.lineTo(xPos[3],yPos[4]);
		ctx.moveTo(xPos[4],yPos[1]);
		ctx.lineTo(xPos[4],yPos[3]);
		ctx.stroke();	
		ctx.setLineDash([8,5]);		
		ctx.lineWidth = 0.6 * ctx.lineWidth;
		ctx.beginPath();
		ctx.moveTo(xPos[2],yPos[0]);
		ctx.lineTo(xPos[2],yPos[4]);
		ctx.stroke();
	}
	
	ctx.restore();
}


