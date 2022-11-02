var w,h,el,g,ratio,shapes,my={};function geomvectorMain(mode){this.version='0.93';my.mode=typeof mode!=='undefined'?mode:'vector';var canvasid="canvas"+my.mode;my.dragging=false;w=540;h=360;var s='';s+='<div style="position:relative; width:'+w+'px; height:'+h+'px; border: none; border-radius: 9px; margin:auto; display:block; box-shadow: 0px 0px 19px 10px rgba(0,0,68,0.46); ">';s+='<canvas id="'+canvasid+'" width="'+w+'" height="'+h+'" style="z-index:10;"></canvas>';s+='<div style="position:absolute; right:3px; top:3px;">';s+='<button id="appBtn" onclick="winNew()" style="z-index:2;" class="clickbtn">'+winnewSvg()+'</button>';s+='</div>';s+='<div id="btns2" style="position:absolute; right:3px; bottom:3px;">';s+='<button id="coordsBtn" onclick="toggleCoords()" style="z-index:2;" class="togglebtn lo" >Coords</button>';s+='<button id="resetBtn" onclick="reset()" style="z-index:2;" class="clickbtn" >Reset</button>';s+='</div>';s+='<div id="copyrt" style="position: absolute; left: 5px; bottom: 3px; font: 10px Arial; color: #6600cc; ">&copy; 2019 MathsIsFun.com  v'+this.version+'</div>';s+='</div>';document.write(s);el=document.getElementById(canvasid);ratio=2;el.width=w*ratio;el.height=h*ratio;el.style.width=w+"px";el.style.height=h+"px";g=el.getContext("2d");g.setTransform(ratio,0,0,ratio,0,0);my.coords=new Coords(0,0,w,h,-2,-1.9,15,11,true);my.graph=new Graph(g,my.coords);my.dragNo=0;my.coordsQ=false;shapes=[];makeShapes();el.addEventListener("mousedown",mouseDownListener,false);el.addEventListener('touchstart',ontouchstart,false);el.addEventListener("mousemove",domousemove,false);doType();}
function winnewSvg(){var s=''
s+='<svg xmlns="http://www.w3.org/2000/svg" width="26" height="21" version="1.1" style="stroke-width:2; fill:none; vertical-align:middle;">'
s+='<rect style="stroke:grey;" x="1" y="6" ry="4" width="19" height="13" />'
s+='<path style="stroke:#cdf;stroke-width:3;" d="m 14,6 h 6 v 6"/>'
s+='<path style="stroke:black;" d="m 16,2 h 8 v 8"/>'
s+='<path style="stroke:black;" d="m 14,12 10,-10"/>'
s+='</svg>'
return s}
function winNew(){window.open(toLoc('../appcebf.html?folder=geometry&amp;file=geom-vector&amp;p='+my.mode))}
function toLoc(s){if(window.location.href.indexOf('localhost')>0)s='/mathsisfun'+s
return s}
function reset(){makeShapes();update();}
function update(){doType();}
function toggleCoords(){my.coordsQ=!my.coordsQ;toggleBtn("coordsBtn",my.coordsQ);update();}
function toggleBtn(btn,onq){if(onq){document.getElementById(btn).classList.add("hi");document.getElementById(btn).classList.remove("lo");}else{document.getElementById(btn).classList.add("lo");document.getElementById(btn).classList.remove("hi");}}
function ontouchstart(evt){var touch=evt.targetTouches[0];evt.clientX=touch.clientX;evt.clientY=touch.clientY;evt.touchQ=true;mouseDownListener(evt)}
function ontouchmove(evt){var touch=evt.targetTouches[0];evt.clientX=touch.clientX;evt.clientY=touch.clientY;evt.touchQ=true;mouseMoveListener(evt);evt.preventDefault();}
function ontouchend(){el.addEventListener('touchstart',ontouchstart,false);window.removeEventListener("touchend",ontouchend,false);if(my.dragging){my.dragging=false;window.removeEventListener("touchmove",ontouchmove,false);}}
function domousemove(e){document.body.style.cursor="default";var bRect=el.getBoundingClientRect();var mouseX=(e.clientX-bRect.left)*(el.width/ratio/bRect.width);var mouseY=(e.clientY-bRect.top)*(el.height/ratio/bRect.height);for(var i=0;i<shapes.length;i++){if(hitTest(shapes[i],mouseX,mouseY)){my.dragNo=i;document.body.style.cursor="pointer";}}}
function mouseDownListener(evt){var i;var highestIndex=-1;var bRect=el.getBoundingClientRect();var mouseX=(evt.clientX-bRect.left)*(el.width/ratio/bRect.width);var mouseY=(evt.clientY-bRect.top)*(el.height/ratio/bRect.height);for(i=0;i<shapes.length;i++){if(hitTest(shapes[i],mouseX,mouseY)){my.dragNo=i;my.dragging=true;if(i>highestIndex){my.dragHoldX=mouseX-shapes[i].x;my.dragHoldY=mouseY-shapes[i].y;highestIndex=i;my.dragNo=i;}}}
if(my.dragging){if(evt.touchQ){window.addEventListener('touchmove',ontouchmove,false);}else{window.addEventListener("mousemove",mouseMoveListener,false);}
doType();}
if(evt.touchQ){el.removeEventListener("touchstart",ontouchstart,false);window.addEventListener("touchend",ontouchend,false);}else{el.removeEventListener("mousedown",mouseDownListener,false);window.addEventListener("mouseup",mouseUpListener,false);}
if(evt.preventDefault){evt.preventDefault();}
else if(evt.returnValue){evt.returnValue=false;}
return false;}
function mouseUpListener(){el.addEventListener("mousedown",mouseDownListener,false);window.removeEventListener("mouseup",mouseUpListener,false);if(my.dragging){my.dragging=false;window.removeEventListener("mousemove",mouseMoveListener,false);}}
function mouseMoveListener(evt){var posX;var posY;var shapeRad=shapes[my.dragNo].rad;var minX=shapeRad;var maxX=el.width-shapeRad;var minY=shapeRad;var maxY=el.height-shapeRad;var bRect=el.getBoundingClientRect();var mouseX=(evt.clientX-bRect.left)*(el.width/ratio/bRect.width);var mouseY=(evt.clientY-bRect.top)*(el.height/ratio/bRect.height);posX=mouseX-my.dragHoldX;posX=(posX<minX)?minX:((posX>maxX)?maxX:posX);posY=mouseY-my.dragHoldY;posY=(posY<minY)?minY:((posY>maxY)?maxY:posY);shapes[my.dragNo].x=posX;shapes[my.dragNo].y=posY;doType();}
function hitTest(shape,mx,my){var dx;var dy;dx=mx-shape.x;dy=my-shape.y;return(dx*dx+dy*dy<shape.rad*shape.rad);}
function doType(){g.clearRect(0,0,el.width,el.height);my.graph.drawGraph();drawPts();}
function makeShapes(){var xys=[];switch(my.mode){case 'vector':case 'xy':xys=[[150,220],[350,150]];break;default:xys=[[150,220],[350,150]];}
shapes=[];for(var i=0;i<xys.length;i++){var xy=xys[i];shapes.push(new Pt(xy[0],xy[1]));}}
function drawPts(){var i;g.strokeStyle="rgba(0, 0, 255, 0.5)";g.fillStyle="rgba(255, 255, 100, 0.1)";g.lineWidth=2;switch(my.mode){case 'vector':case 'xy':var pt1=shapes[0]
var pt2=shapes[1]
var ln=new Line(pt1,pt2);ln.setLen(1500,true);g.beginPath();g.setLineDash([5,15]);g.strokeStyle='#aaa'
g.lineWidth=1
g.moveTo(ln.a.x,ln.a.y);g.lineTo(ln.b.x,ln.b.y);g.stroke();g.setLineDash([]);g.fillStyle="#aaa";g.font='14px Arial';var midPt=new Pt((pt1.x+pt2.x)/2,(pt1.y+pt2.y)/2);var dx=pt2.x-midPt.x;var dy=pt2.y-midPt.y;var ang=Math.atan2(dy,dx);g.save();g.translate(pt2.x,pt2.y);g.rotate(ang);g.beginPath();g.fillText('direction \u2192',90,-3);g.restore();if(my.mode=='vector'){drawDim(pt1,pt2,'#8af','Magnitude = ')}
if(my.mode=='xy'){g.font="bold 18px Arial";g.fillStyle='darkorange'
g.fillText('Vector components x and y',15,27);g.fill()
var ptxy={x:pt2.x-0.01,y:pt1.y}
g.lineWidth=2
drawVec(pt1,ptxy,'#aaf')
drawVec(ptxy,pt2,'#faa')
g.lineWidth=1
drawDim(pt1,ptxy,'#aaf','x = ')
drawDim(ptxy,pt2,'#faa','y = ')}
g.lineWidth=3
drawVec(pt1,pt2,'red')
break;default:}
var dbg="";for(i=0;i<shapes.length;i++){g.fillStyle="rgba(0, 0, 255, 0.3)";g.beginPath();g.arc(shapes[i].x,shapes[i].y,shapes[i].rad,0,2*Math.PI,false);g.closePath();g.fill();g.fillStyle="rgba(0, 0, 0, 0.8)";g.beginPath();g.arc(shapes[i].x,shapes[i].y,2,0,2*Math.PI,false);g.closePath();g.fill();g.textAlign="left";if(my.coordsQ){g.font="bold 14px Arial";var txt='(';txt+=my.coords.toXVal(shapes[i].x).toFixed(1);txt+=',';txt+=my.coords.toYVal(shapes[i].y).toFixed(1);txt+=')';g.fillText(txt,shapes[i].x+5,shapes[i].y-9);}else{g.font="14px Arial";g.fillText(String.fromCharCode(65+i),shapes[i].x+5,shapes[i].y-9);}
dbg+='['+Math.floor(shapes[i].x)+","+Math.floor(shapes[i].y)+"],";}}
function drawDim(pta1,pta2,clr,lbl){var pt1,pt2
if(pta1.x<pta2.x){pt1={x:pta1.x,y:pta1.y}
pt2={x:pta2.x,y:pta2.y}}else{pt1={x:pta2.x,y:pta2.y}
pt2={x:pta1.x,y:pta1.y}}
var xVal=pt2.x-pt1.x;var yVal=pt2.y-pt1.y;var ang=Math.atan2(yVal,xVal);var mag=Math.sqrt(xVal*xVal+yVal*yVal);g.strokeStyle=clr
g.fillStyle=clr
g.save();g.translate(pt1.x,pt1.y);g.rotate(ang);g.textAlign="center";g.beginPath();g.moveTo(0,30);g.lineTo(mag,30);g.moveTo(0,10);g.lineTo(0,40);g.moveTo(mag,10);g.lineTo(mag,40);g.drawArrow(0,30,15,2,15,7,-Math.PI);g.drawArrow(mag,30,15,2,15,7,0);g.fillText(lbl+Math.round(my.coords.xScale*mag*10)/10,mag/2,27);g.stroke();g.restore();}
function drawVec(pt1,pt2,clr){g.beginPath();g.strokeStyle=clr;g.moveTo(pt1.x,pt1.y);g.lineTo(pt2.x,pt2.y);g.stroke();g.fillStyle=clr;var xVal=pt2.x-pt1.x;var yVal=pt2.y-pt1.y;var ang=Math.atan2(yVal,xVal);var mag=Math.sqrt(xVal*xVal+yVal*yVal);if(mag<0)ang+=Math.PI;g.drawArrow(pt2.x,pt2.y,20,2,30,15,-ang);g.fill();}
function Pt(ix,iy){this.x=ix;this.y=iy;this.rad=9;this.color="rgb("+0+","+0+","+255+")";this.angleIn=0;this.angleOut=0;}
Pt.prototype.setxy=function(ix,iy){this.x=ix;this.y=iy;};Pt.prototype.getAngle=function(){return this.angleOut-this.angleIn;};Pt.prototype.drawMe=function(g){g.fillStyle="rgba(0, 0, 255, 0.3)";g.beginPath();g.arc(this.x,this.y,20,0,2*Math.PI,false);g.closePath();g.fill();};Pt.prototype.getAvg=function(pts){var xSum=0;var ySum=0;for(var i=0;i<pts.length;i++){xSum+=pts[i].x;ySum+=pts[i].y;}
var newPt=new Pt(xSum/pts.length,ySum/pts.length);newPt.x=xSum/pts.length;newPt.y=ySum/pts.length;return newPt;};Pt.prototype.setAvg=function(pts){this.setPrevPt();var newPt=this.getAvg(pts);this.x=newPt.x;this.y=newPt.y;};Pt.prototype.interpolate=function(pt1,pt2,f){this.setPrevPt();this.x=pt1.x*f+pt2.x*(1-f);this.y=pt1.y*f+pt2.y*(1-f);};Pt.prototype.translate=function(pt,addQ){addQ=typeof addQ!=='undefined'?addQ:true;var t=new Pt(this.x,this.y);t.x=this.x;t.y=this.y;if(addQ){t.x+=pt.x;t.y+=pt.y}else{t.x-=pt.x;t.y-=pt.y}
return t;};Pt.prototype.translateMe=function(pt,addQ){addQ=typeof addQ!=='undefined'?addQ:true;if(addQ){this.x+=pt.x;this.y+=pt.y}else{this.x-=pt.x;this.y-=pt.y}}
Pt.prototype.rotate=function(angle){var cosa=Math.cos(angle);var sina=Math.sin(angle);var xPos=this.x*cosa+this.y*sina;var yPos=-this.x*sina+this.y*cosa;return new Pt(xPos,yPos);}
Pt.prototype.rotateMe=function(angle){var t=new Pt(this.x,this.y).rotate(angle);this.x=t.x;this.y=t.y;}
Pt.prototype.multiply=function(fact){return new Pt(this.x*fact,this.y*fact);};Pt.prototype.multiplyMe=function(fact){this.x*=fact;this.y*=fact;};function dist(dx,dy){return(Math.sqrt(dx*dx+dy*dy));}
function loop(currNo,minNo,maxNo,incr){currNo+=incr;var range=maxNo-minNo+1;if(currNo<minNo){currNo=maxNo-(-currNo+maxNo)%range;}
if(currNo>maxNo){currNo=minNo+(currNo-minNo)%range;}
return currNo;}
function constrain(min,val,max){return(Math.min(Math.max(min,val),max));}
function Coords(left,top,width,height,xStt,yStt,xEnd,yEnd,uniScaleQ){this.left=left;this.top=top;this.width=width;this.height=height;this.xStt=xStt;this.yStt=yStt;this.xEnd=xEnd;this.yEnd=yEnd;this.uniScaleQ=uniScaleQ;this.xLogQ=false;this.yLogQ=false;this.skewQ=false;this.xScale;this.xLogScale;this.yScale;this.calcScale();}
Coords.prototype.calcScale=function(){if(this.xLogQ){if(this.xStt<=0)
this.xStt=1;if(this.xEnd<=0)
this.xEnd=1;}
if(this.yLogQ){if(this.yStt<=0)
this.yStt=1;if(this.yEnd<=0)
this.yEnd=1;}
var temp;if(this.xStt>this.xEnd){temp=this.xStt;this.xStt=this.xEnd;this.xEnd=temp;}
if(this.yStt>this.yEnd){temp=this.yStt;this.yStt=this.yEnd;this.yEnd=temp;}
var xSpan=this.xEnd-this.xStt;if(xSpan<=0)
xSpan=0.1;this.xScale=xSpan/this.width;this.xLogScale=(Math.log(this.xEnd)-Math.log(this.xStt))/this.width;var ySpan=this.yEnd-this.yStt;if(ySpan<=0)
ySpan=0.1;this.yScale=ySpan/this.height;this.yLogScale=(Math.log(this.yEnd)-Math.log(this.yStt))/this.height;if(this.uniScaleQ&&!this.xLogQ&&!this.yLogQ){var newScale=Math.max(this.xScale,this.yScale);this.xScale=newScale;xSpan=this.xScale*this.width;var xMid=(this.xStt+this.xEnd)/2;this.xStt=xMid-xSpan/2;this.xEnd=xMid+xSpan/2;this.yScale=newScale;ySpan=this.yScale*this.height;var yMid=(this.yStt+this.yEnd)/2;this.yStt=yMid-ySpan/2;this.yEnd=yMid+ySpan/2;}};Coords.prototype.getXScale=function(){return this.xScale;};Coords.prototype.getYScale=function(){return this.yScale;};Coords.prototype.toXPix=function(val){if(this.xLogQ){return this.left+(Math.log(val)-Math.log(this.xStt))/this.xLogScale;}else{return this.left+((val-this.xStt)/this.xScale);}};Coords.prototype.toYPix=function(val){if(this.yLogQ){return this.top+(Math.log(this.yEnd)-Math.log(val))/this.yLogScale;}else{return this.top+((this.yEnd-val)/this.yScale);}};Coords.prototype.toPtVal=function(pt,useCornerQ){return new Pt(this.toXVal(pt.x,useCornerQ),this.toYVal(pt.y,useCornerQ));};Coords.prototype.toXVal=function(pix,useCornerQ){if(useCornerQ){return this.xStt+(pix-this.left)*this.xScale;}else{return this.xStt+pix*this.xScale;}};Coords.prototype.toYVal=function(pix,useCornerQ){if(useCornerQ){return this.yEnd-(pix-this.top)*this.yScale;}else{return this.yEnd-pix*this.yScale;}};Coords.prototype.getTicks=function(stt,span){var ticks=[];var inter=this.tickInterval(span/5,false);var tickStt=Math.ceil(stt/inter)*inter;var i=0;var tick;do{var tick=i*inter;tick=Number(tick.toPrecision(5));ticks.push([tickStt+tick,1]);i++;}while(tick<span);inter=this.tickInterval(span/4,true);for(i=0;i<ticks.length;i++){var t=ticks[i][0];if(Math.abs(Math.round(t/inter)-(t/inter))<0.001){ticks[i][1]=0;}}
return ticks;};Coords.prototype.tickInterval=function(span,majorQ){var pow10=Math.pow(10,Math.floor(Math.log(span)*Math.LOG10E));var mantissa=span/pow10;if(mantissa>=5){if(majorQ){return(5*pow10);}else{return(2*pow10);}}
if(mantissa>=2){if(majorQ){return(2*pow10);}else{return(1*pow10);}}
if(mantissa>=1){if(majorQ){return(1*pow10);}else{return(0.2*pow10);}}
if(majorQ){return(1*pow10);}else{return(0.2*pow10);}};Coords.prototype.xTickInterval=function(tickDensity,majorQ){return this.tickInterval((this.xEnd-this.xStt)/tickDensity,majorQ);};Coords.prototype.yTickInterval=function(tickDensity,majorQ){return this.tickInterval((this.yEnd-this.yStt)/tickDensity,majorQ);};function Graph(g,coords){this.g=g;this.coords=coords;this.xLinesQ=true;this.yLinesQ=true;this.xValsQ=true;this.yValsQ=true;this.skewQ=false;}
Graph.prototype.drawGraph=function(){this.hzAxisY=this.coords.toYPix(0);if(this.hzAxisY<0)this.hzAxisY=0;if(this.hzAxisY>this.coords.height)this.hzAxisY=this.coords.height;this.hzNumsY=this.hzAxisY+14;if(this.hzAxisY>this.coords.height-10)this.hzNumsY=this.coords.height-3;this.vtAxisX=this.coords.toXPix(0);if(this.vtAxisX<0)this.vtAxisX=0;if(this.vtAxisX>this.coords.width)this.vtAxisX=this.coords.width;this.vtNumsX=this.vtAxisX-5;if(this.vtAxisX<10)this.vtNumsX=20;if(this.coords.xLogQ){this.drawLinesLogX();}else{if(this.xLinesQ){this.drawHzLines();}}
if(this.coords.yLogQ){this.drawLinesLogY();}else{if(this.yLinesQ){this.drawVtLines();}}};Graph.prototype.drawVtLines=function(){var g=this.g;g.lineWidth=1;var ticks=this.coords.getTicks(this.coords.xStt,this.coords.xEnd-this.coords.xStt);for(var i=0;i<ticks.length;i++){var tick=ticks[i];var xVal=tick[0];var tickLevel=tick[1];if(tickLevel==0){g.strokeStyle="rgba(0,0,256,0.2)";}else{g.strokeStyle="rgba(0,0,256,0.1)";}
var xPix=this.coords.toXPix(xVal,false);g.beginPath();g.moveTo(xPix,this.coords.toYPix(this.coords.yStt,false));g.lineTo(xPix,this.coords.toYPix(this.coords.yEnd,false));g.stroke();if(my.coordsQ&&tickLevel==0&&this.xValsQ){g.fillStyle="#0000ff";g.font="12px Verdana";g.textAlign="center";g.fillText(fmt(xVal),xPix,this.hzNumsY);}}
if(this.skewQ)
return;if(my.coordsQ){g.lineWidth=1.5;g.strokeStyle="#ff0000";g.beginPath();g.moveTo(this.vtAxisX,this.coords.toYPix(this.coords.yStt,false));g.lineTo(this.vtAxisX,this.coords.toYPix(this.coords.yEnd,false));g.stroke();g.beginPath();g.fillStyle=g.strokeStyle;g.drawArrow(this.vtAxisX,this.coords.toYPix(this.coords.yEnd),15,2,20,10,Math.PI/2,10,false);g.stroke();g.fill();}};Graph.prototype.drawHzLines=function(){var g=this.g;g.lineWidth=1;var ticks=this.coords.getTicks(this.coords.yStt,this.coords.yEnd-this.coords.yStt);for(var i=0;i<ticks.length;i++){var tick=ticks[i];var yVal=tick[0];var tickLevel=tick[1];if(tickLevel==0){g.strokeStyle="rgba(0,0,256,0.2)";}else{g.strokeStyle="rgba(0,0,256,0.1)";}
var yPix=this.coords.toYPix(yVal,false);g.beginPath();g.moveTo(this.coords.toXPix(this.coords.xStt,false),yPix);g.lineTo(this.coords.toXPix(this.coords.xEnd,false),yPix);g.stroke();if(my.coordsQ&&tickLevel==0&&this.yValsQ){g.fillStyle="#ff0000";g.font="12px Verdana";g.textAlign="right";g.fillText(fmt(yVal),this.vtNumsX,yPix+5);}}
if(this.skewQ)
return;if(my.coordsQ){g.lineWidth=2;g.strokeStyle="#0000ff";g.beginPath();g.moveTo(this.coords.toXPix(this.coords.xStt,false),this.hzAxisY);g.lineTo(this.coords.toXPix(this.coords.xEnd,false),this.hzAxisY);g.stroke();g.beginPath();g.fillStyle=g.strokeStyle;g.drawArrow(this.coords.toXPix(this.coords.xEnd,false),this.hzAxisY,15,2,20,10,0,10,false);g.stroke();g.fill();}};function Line(pt1,pt2){this.a=new Pt(pt1.x,pt1.y);this.b=new Pt(pt2.x,pt2.y);}
Line.prototype.getLength=function(){var dx=this.b.x-this.a.x;var dy=this.b.y-this.a.y;return Math.sqrt(dx*dx+dy*dy);};Line.prototype.setLen=function(newLen,fromMidQ){var len=this.getLength();if(fromMidQ){var midPt=this.getMidPt();var halfPt=new Pt(this.a.x-midPt.x,this.a.y-midPt.y);halfPt.multiplyMe(newLen/len);this.a=midPt.translate(halfPt);this.b=midPt.translate(halfPt,false);}else{var diffPt=new Pt(this.a.x-this.b.x,this.a.y-this.b.y);diffPt.multiplyMe(newLen/len);this.b=this.a.translate(diffPt,false);}};Line.prototype.getMidPt=function(){return new Pt((this.a.x+this.b.x)/2,(this.a.y+this.b.y)/2);};Line.prototype.rotateMidMe=function(angle){var midPt=this.getMidPt();this.a.translateMe(midPt,false);this.b.translateMe(midPt,false);this.a.rotateMe(angle);this.b.rotateMe(angle);this.a.translateMe(midPt);this.b.translateMe(midPt);};Line.prototype.getClosestPoint=function(toPt,inSegmentQ){var AP=toPt.translate(this.a,false);var AB=this.b.translate(this.a,false);var ab2=AB.x*AB.x+AB.y*AB.y;var ap_ab=AP.x*AB.x+AP.y*AB.y;var t=ap_ab/ab2;if(inSegmentQ){t=constrain(0,t,1);}
return this.a.translate(AB.multiply(t));};Line.prototype.setLen=function(newLen,fromMidQ){fromMidQ=typeof fromMidQ!=='undefined'?fromMidQ:true;var len=this.getLength();if(fromMidQ){var midPt=this.getMidPt();var halfPt=new Pt(this.a.x-midPt.x,this.a.y-midPt.y);halfPt.multiplyMe(newLen/len);this.a=midPt.translate(halfPt);this.b=midPt.translate(halfPt,false);}else{var diffPt=new Pt(this.a.x-this.b.x,this.a.y-this.b.y);diffPt.multiplyMe(newLen/len);this.b=this.a.translate(diffPt,false);}};Line.prototype.getAngle=function(){return Math.atan2(this.b.y-this.a.y,this.b.x-this.a.x);};Line.prototype.isPerp=function(vsLine,toler){if(true){var degDiff=this.getAngle()-vsLine.getAngle();degDiff=Math.abs(degDiff);if(degDiff>Math.PI)
degDiff-=Math.PI;if(isNear(degDiff,Math.PI/2,toler)){return true;}
return false;}else{}};function fmt(num,digits){digits=14;if(num==Number.POSITIVE_INFINITY)
return "undefined";if(num==Number.NEGATIVE_INFINITY)
return "undefined";num=num.toPrecision(digits);num=num.replace(/0+$/,"");if(num.charAt(num.length-1)==".")num=num.substr(0,num.length-1);if(Math.abs(num)<1e-15)num=0;return num;}
function isNear(checkVal,centralVal,limitVal){if(checkVal<centralVal-limitVal)return false;if(checkVal>centralVal+limitVal)return false;return true;}
CanvasRenderingContext2D.prototype.drawArrow=function(x0,y0,totLen,shaftHt,headLen,headHt,angle,sweep,invertQ){var g=this;var pts=[[0,0],[-headLen,-headHt/2],[-headLen+sweep,-shaftHt/2],[-totLen,-shaftHt/2],[-totLen,shaftHt/2],[-headLen+sweep,shaftHt/2],[-headLen,headHt/2],[0,0]];if(invertQ){pts.push([0,-headHt/2],[-totLen,-headHt/2],[-totLen,headHt/2],[0,headHt/2]);}
for(var i=0;i<pts.length;i++){var cosa=Math.cos(-angle);var sina=Math.sin(-angle);var xPos=pts[i][0]*cosa+pts[i][1]*sina;var yPos=pts[i][0]*sina-pts[i][1]*cosa;if(i==0){g.moveTo(x0+xPos,y0+yPos);}else{g.lineTo(x0+xPos,y0+yPos);}}};CanvasRenderingContext2D.prototype.drawBox=function(midX,midY,radius,angle){g.beginPath();var pts=[[0,0],[Math.cos(angle),Math.sin(angle)],[Math.cos(angle)+Math.cos(angle+Math.PI/2),Math.sin(angle)+Math.sin(angle+Math.PI/2)],[Math.cos(angle+Math.PI/2),Math.sin(angle+Math.PI/2)],[0,0]];for(var i=0;i<pts.length;i++){if(i==0){g.moveTo(midX+radius*pts[i][0],midY+radius*pts[i][1]);}else{g.lineTo(midX+radius*pts[i][0],midY+radius*pts[i][1]);}}
g.stroke();};