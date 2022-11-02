var s,i,my={};function geomlineparaMain(imode){my.version='0.8';my.mode=typeof imode!=='undefined'?imode:'trans';my.shows=[{id:'all',name:'All Angles',angNums:[[0,1,2,3,4,5,6,7]],descr:''},{id:'corr',name:'Corresponding Angles',angNums:[[0,4],[1,5],[2,6],[3,7]],descr:''},{id:'altint',name:'Alternate Interior Angles',angNums:[[2,5],[3,4]],descr:''},{id:'altext',name:'Alternate Exterior Angles',angNums:[[0,7],[1,6]],descr:''},{id:'conint',name:'Consecutive Interior Angles',angNums:[[2,4],[3,5]],descr:'Angles add to 180&deg;'},{id:'vert',name:'Vertical Angles',angNums:[[0,3],[1,2],[4,7],[5,6]],descr:''},{id:'ones',name:'One at a time',angNums:[[0],[1],[2],[3],[4],[5],[6],[7]],descr:''}];my.showNo=0
for(var i=0;i<my.shows.length;i++){if(my.shows[i].id==my.mode){my.showNo=i
break}}
my.show=my.shows[my.showNo];canvasid="canvas5"
titleid="title5"
infoid="info5"
dragging=false;dragIndex=0
w=540;h=360;var s='';s+='<style>'
s+='.togglebtn { display: inline-block; position: relative; text-align: center; margin: 2px; text-decoration: none;  font: bold 14px/25px Arial, sans-serif; color: #19667d; border: 1px solid #88aaff; border-radius: 10px; cursor: pointer; background: linear-gradient(to top right, rgba(170,190,255,1) 0%, rgba(255,255,255,1) 100%); }'
s+='.togglebtn:hover { background: linear-gradient(to top, rgba(255,255,0,1) 0%, rgba(255,255,255,1) 100%); }'
s+='.hi { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(130,220,255,1) 0%, rgba(255,255,255,1) 100%);  }'
s+='.lo { border: solid 1px #888888; background: linear-gradient(to top, rgba(170,170,170,1) 0%, rgba(205,205,205,1) 100%);  }'
s+='</style>'
s+='<div style="position:relative; width:'+w+'px; height:'+h+'px; border: none; border-radius: 9px; margin:auto; display:block; box-shadow: 0px 0px 19px 10px rgba(0,0,68,0.46); ">';s+='<canvas id="'+canvasid+'" width="'+w+'" height="'+h+'" style="z-index:10;"></canvas>';s+='<div id="descr" style="position:absolute; right:0px; top:33px; width:230px; font: 20px Arial; text-align: center; color: black; "></div>';s+='<div style="position:absolute; right:5px; top:5px; z-index:11;font: 14px Arial;">';s+="Angles: ";s+=dropdownHTML(my.shows,'showChg','showSel',my.showNo);s+='</div>';s+='<div id="btns2" style="position:absolute; right:3px; bottom:5px;">';s+='<button id="paraBtn" onclick="paraToggle()" style="z-index:2;" class="togglebtn hi" >Parallel</button>';s+='<button id="resetBtn" onclick="reset()" style="z-index:2;" class="togglebtn" >Reset</button>';s+='</div>';s+='<div id="copyrt" style="position: absolute; left:3px; bottom:0px; font: 10px Arial; color: #6600cc; ">&copy; 2018 MathsIsFun.com  v'+my.version+'</div>';s+='</div>';document.write(s);el=document.getElementById(canvasid);ratio=2;el.width=w*ratio;el.height=h*ratio;el.style.width=w+"px";el.style.height=h+"px";g=el.getContext("2d");g.setTransform(ratio,0,0,ratio,0,0);this.coords=new Coords(0,0,w,h,-2,-1.9,15,11,true);this.graph=new Graph(g,coords);this.coordsQ=true;shapes=[];makeShapes();el.addEventListener("mousedown",mouseDownListener,false);el.addEventListener('touchstart',ontouchstart,false);el.addEventListener("mousemove",domousemove,false);my.playQ=true
my.timeStt=performance.now()
my.animNum=0
my.paraQ=true
update()
anim()}
function anim(){if(my.playQ){if(performance.now()-my.timeStt>1500){my.timeStt=performance.now()
my.animNum++
if(my.animNum>=my.show.angNums.length)my.animNum=0
update()}
requestAnimationFrame(anim);}}
function showChg(){var div=document.getElementById('showSel');my.show=my.shows[div.selectedIndex];console.log("onShowChg="+div.selectedIndex,my.show)
my.animNum=0
my.timeStt=performance.now()
update()
var descr=my.show.descr
if(!my.paraQ)descr=''
document.getElementById('descr').innerHTML=descr}
function reset(){makeShapes();update();}
function update(){g.clearRect(0,0,el.width,el.height);drawPts();}
function paraToggle(){my.paraQ=!my.paraQ
toggleBtn("paraBtn",my.paraQ)
showChg()
update()}
function toggleBtn(btn,onq){if(onq){document.getElementById(btn).classList.add("hi");document.getElementById(btn).classList.remove("lo");}else{document.getElementById(btn).classList.add("lo");document.getElementById(btn).classList.remove("hi");}}
function ontouchstart(evt){var touch=evt.targetTouches[0];evt.clientX=touch.clientX;evt.clientY=touch.clientY;evt.touchQ=true;mouseDownListener(evt)}
function ontouchmove(evt){var touch=evt.targetTouches[0];evt.clientX=touch.clientX;evt.clientY=touch.clientY;evt.touchQ=true;mouseMoveListener(evt);evt.preventDefault();}
function ontouchend(evt){el.addEventListener('touchstart',ontouchstart,false);window.removeEventListener("touchend",ontouchend,false);if(dragging){dragging=false;window.removeEventListener("touchmove",ontouchmove,false);}}
function domousemove(e){document.body.style.cursor="default";var bRect=el.getBoundingClientRect();var mouseX=(e.clientX-bRect.left)*(el.width/ratio/bRect.width);var mouseY=(e.clientY-bRect.top)*(el.height/ratio/bRect.height);for(var i=0;i<shapes.length;i++){if(hitTest(shapes[i],mouseX,mouseY)){dragNo=i;document.body.style.cursor="pointer";}}}
function mouseDownListener(evt){var i;var highestIndex=-1;var bRect=el.getBoundingClientRect();var mouseX=(evt.clientX-bRect.left)*(el.width/ratio/bRect.width);var mouseY=(evt.clientY-bRect.top)*(el.height/ratio/bRect.height);for(i=0;i<shapes.length;i++){if(hitTest(shapes[i],mouseX,mouseY)){dragNo=i;dragging=true;if(i>highestIndex){dragHoldX=mouseX-shapes[i].x;dragHoldY=mouseY-shapes[i].y;highestIndex=i;dragIndex=i;}}}
if(dragging){if(evt.touchQ){window.addEventListener('touchmove',ontouchmove,false);}else{window.addEventListener("mousemove",mouseMoveListener,false);}
update();}
if(evt.touchQ){el.removeEventListener("touchstart",ontouchstart,false);window.addEventListener("touchend",ontouchend,false);}else{el.removeEventListener("mousedown",mouseDownListener,false);window.addEventListener("mouseup",mouseUpListener,false);}
if(evt.preventDefault){evt.preventDefault();}
else if(evt.returnValue){evt.returnValue=false;}
return false;}
function mouseUpListener(evt){el.addEventListener("mousedown",mouseDownListener,false);window.removeEventListener("mouseup",mouseUpListener,false);if(dragging){dragging=false;window.removeEventListener("mousemove",mouseMoveListener,false);}}
function mouseMoveListener(evt){var posX;var posY;var shapeRad=shapes[dragIndex].rad;var minX=shapeRad;var maxX=el.width-shapeRad;var minY=shapeRad;var maxY=el.height-shapeRad;var bRect=el.getBoundingClientRect();var mouseX=(evt.clientX-bRect.left)*(el.width/ratio/bRect.width);var mouseY=(evt.clientY-bRect.top)*(el.height/ratio/bRect.height);posX=mouseX-dragHoldX;posX=(posX<minX)?minX:((posX>maxX)?maxX:posX);posY=mouseY-dragHoldY;posY=(posY<minY)?minY:((posY>maxY)?maxY:posY);shapes[dragIndex].x=posX;shapes[dragIndex].y=posY;update();}
function hitTest(shape,mx,my){var dx;var dy;dx=mx-shape.x;dy=my-shape.y;return(dx*dx+dy*dy<shape.rad*shape.rad);}
function makeShapes(){var xys=[[86,135],[312,100],[321,203],[95,238],[233,50],[174,295]];shapes=[];for(var i=0;i<xys.length;i++){var xy=xys[i];shapes.push(new Pt(xy[0],xy[1]));}}
function makeParallel(){if(dragIndex>=4)return
var ptNumss=[[0,1,2,3],[1,0,3,2],[3,2,1,0],[3,2,1,0]]
var ptNums=ptNumss[dragIndex]
var Aobj=shapes[ptNums[0]];var Bobj=shapes[ptNums[1]];var Cobj=shapes[ptNums[2]];var Dobj=shapes[ptNums[3]];var ABx=Aobj.x-Bobj.x;var ABy=Aobj.y-Bobj.y;Dobj.x=Cobj.x+ABx;Dobj.y=Cobj.y+ABy;}
function drawPts(){var i;g.strokeStyle="rgba(0, 0, 150, 0.8)";g.fillStyle="rgba(255, 255, 100, 0.1)";g.lineWidth=2;g.beginPath();var ln0=new Line(shapes[0],shapes[1]);var ln1=new Line(shapes[2],shapes[3]);var ln2=new Line(shapes[4],shapes[5]);if(my.paraQ){makeParallel()}
ln0.setLen(1500,true);ln1.setLen(1500,true);ln2.setLen(1500,true);var ip0=ln0.getIntersection(ln2,false)
g.fillStyle="rgba(0, 0, 0, 0.8)";g.beginPath();g.arc(ip0.x,ip0.y,4,0,2*Math.PI,false);g.fill();var ip1=ln1.getIntersection(ln2,false)
g.fillStyle="rgba(0, 0, 0, 0.8)";g.beginPath();g.arc(ip1.x,ip1.y,4,0,2*Math.PI,false);g.fill();var angNums=my.show.angNums[my.animNum]
for(var i=0;i<angNums.length;i++){var angNum=angNums[i];switch(angNum){case 0:g.drawAngle3Pt(ip0.x,ip0.y,30,ln0.a,ip0,ln2.a)
break
case 1:g.drawAngle3Pt(ip0.x,ip0.y,30,ln2.a,ip0,ln0.b)
break
case 2:g.drawAngle3Pt(ip0.x,ip0.y,30,ln2.b,ip0,ln0.a)
break
case 3:g.drawAngle3Pt(ip0.x,ip0.y,30,ln0.b,ip0,ln2.b)
break
case 4:g.drawAngle3Pt(ip1.x,ip1.y,30,ln1.b,ip1,ln2.b)
break
case 5:g.drawAngle3Pt(ip1.x,ip1.y,30,ln2.a,ip1,ln1.b)
break
case 6:g.drawAngle3Pt(ip1.x,ip1.y,30,ln2.b,ip1,ln1.a)
break
case 7:g.drawAngle3Pt(ip1.x,ip1.y,30,ln1.a,ip1,ln2.a)}}
lineDraw(ln0,'hsla(200,100%,30%,0.6)')
lineDraw(ln1,'hsla(200,100%,30%,0.6)')
lineDraw(ln2,'hsla(60,100%,30%,0.8)')
var pt0=new Pt(round1(this.coords.toXVal(shapes[0].x)),round1(this.coords.toYVal(shapes[0].y)));var pt1=new Pt(round1(this.coords.toXVal(shapes[1].x)),round1(this.coords.toYVal(shapes[1].y)));var dx=pt1.x-pt0.x
var dy=pt1.y-pt0.y
var slope=dy/dx
var b=pt0.y-pt0.x*slope;for(i=0;i<shapes.length;i++){ptDraw(shapes[i],true,'',"rgba(0, 0, 255, 0.3)")}}
function lineDraw(ln,clr){g.beginPath()
g.lineWidth=2
g.strokeStyle=clr
g.moveTo(ln.a.x,ln.a.y);g.lineTo(ln.b.x,ln.b.y);g.stroke();}
function ptDraw(pt,lblQ,lbl,clr){g.fillStyle=clr
g.beginPath();g.arc(pt.x,pt.y,10,0,2*Math.PI,false);g.fill();g.fillStyle="rgba(0, 0, 0, 0.8)";g.beginPath();g.arc(pt.x,pt.y,2,0,2*Math.PI,false);g.fill();g.textAlign="left";if(lblQ){g.font="14px Arial";g.fillText(lbl,pt.x+5,pt.y-9);}else{g.font="bold 14px Arial";var txt='(';txt+=round1(this.coords.toXVal(pt.x));txt+=',';txt+=round1(this.coords.toYVal(pt.y));txt+=')';g.fillText(txt,pt.x+14,pt.y+3);}}
function round1(v){return Math.round(v*10)/10;}
function round2(v){return Math.round(v*100)/100;}
function linearPhrase(a){var s="";for(var k=0;k<a.length;k++){var v=a[k];if(v!=0){if(v<0){if(s.length>0){s+=" &minus; ";}else{s+=" &minus;";}
v=-v;}else{if(s.length>0){s+=" + ";}}
switch(k){case 0:if(v!=1){s+=v;}
s+="x";break;case 1:s+=v;break;default:if(v!=1){s+=v;}
s+="("+k+")";break;}}}
if(s.length==0){s='0';}
return s;}
function Pt(ix,iy){this.x=ix;this.y=iy;this.rad=9;this.color="rgb("+0+","+0+","+255+")";angleIn=0;angleOut=0;}
Pt.prototype.setxy=function(ix,iy){this.x=ix;this.y=iy;};Pt.prototype.getAngle=function(){return this.angleOut-this.angleIn;};Pt.prototype.drawMe=function(g){g.fillStyle="rgba(0, 0, 255, 0.3)";g.beginPath();g.arc(this.x,this.y,20,0,2*Math.PI,false);g.closePath();g.fill();};Pt.prototype.getAvg=function(pts){var xSum=0;var ySum=0;for(var i=0;i<pts.length;i++){xSum+=pts[i].x;ySum+=pts[i].y;}
var newPt=new Pt(xSum/pts.length,ySum/pts.length);newPt.x=xSum/pts.length;newPt.y=ySum/pts.length;return newPt;};Pt.prototype.setAvg=function(pts){this.setPrevPt();var newPt=this.getAvg(pts);this.x=newPt.x;this.y=newPt.y;validPtQ=true;};Pt.prototype.interpolate=function(pt1,pt2,f){this.setPrevPt();this.x=pt1.x*f+pt2.x*(1-f);this.y=pt1.y*f+pt2.y*(1-f);validPtQ=true;};Pt.prototype.translate=function(pt,addQ){addQ=typeof addQ!=='undefined'?addQ:true;t=new Pt(this.x,this.y);t.x=this.x;t.y=this.y;if(addQ){t.x+=pt.x;t.y+=pt.y}else{t.x-=pt.x;t.y-=pt.y}
return t;};Pt.prototype.multiply=function(fact){return new Pt(this.x*fact,this.y*fact);};Pt.prototype.multiplyMe=function(fact){this.x*=fact;this.y*=fact;};function dist(dx,dy){return(Math.sqrt(dx*dx+dy*dy));}
function loop(currNo,minNo,maxNo,incr){currNo+=incr;var range=maxNo-minNo+1;if(currNo<minNo){currNo=maxNo-(-currNo+maxNo)%range;}
if(currNo>maxNo){currNo=minNo+(currNo-minNo)%range;}
return currNo;}
function constrain(min,val,max){return(Math.min(Math.max(min,val),max));}
function Coords(left,top,width,height,xStt,yStt,xEnd,yEnd,uniScaleQ){this.left=left;this.top=top;this.width=width;this.height=height;this.xStt=xStt;this.yStt=yStt;this.xEnd=xEnd;this.yEnd=yEnd;this.uniScaleQ=uniScaleQ;var xLogQ=false;var yLogQ=false;var skewQ=true;this.xScale;var xLogScale;this.yScale;console.log("Coords: ",this.xStt,this.yStt,this.xEnd,this.yEnd);this.calcScale();}
Coords.prototype.calcScale=function(){console.log("calcScale: ",this.xStt,this.yStt,this.xEnd,this.yEnd);if(this.xLogQ){if(this.xStt<=0)
this.xStt=1;if(this.xEnd<=0)
this.xEnd=1;}
if(this.yLogQ){if(this.yStt<=0)
this.yStt=1;if(this.yEnd<=0)
this.yEnd=1;}
var temp;if(this.xStt>this.xEnd){temp=this.xStt;this.xStt=this.xEnd;this.xEnd=temp;}
if(this.yStt>this.yEnd){temp=this.yStt;this.yStt=this.yEnd;this.yEnd=temp;}
var xSpan=this.xEnd-this.xStt;if(xSpan<=0)
xSpan=0.1;this.xScale=xSpan/this.width;this.xLogScale=(Math.log(this.xEnd)-Math.log(this.xStt))/this.width;var ySpan=this.yEnd-this.yStt;if(ySpan<=0)
ySpan=0.1;this.yScale=ySpan/this.height;this.yLogScale=(Math.log(this.yEnd)-Math.log(this.yStt))/this.height;if(this.uniScaleQ&&!this.xLogQ&&!this.yLogQ){var newScale=Math.max(this.xScale,this.yScale);this.xScale=newScale;xSpan=this.xScale*this.width;var xMid=(this.xStt+this.xEnd)/2;this.xStt=xMid-xSpan/2;this.xEnd=xMid+xSpan/2;this.yScale=newScale;ySpan=this.yScale*this.height;var yMid=(this.yStt+this.yEnd)/2;this.yStt=yMid-ySpan/2;this.yEnd=yMid+ySpan/2;}};Coords.prototype.getXScale=function(){return this.xScale;};Coords.prototype.getYScale=function(){return this.yScale;};Coords.prototype.toXPix=function(val){if(this.xLogQ){return this.left+(Math.log(val)-Math.log(xStt))/xLogScale;}else{return this.left+((val-this.xStt)/this.xScale);}};Coords.prototype.toYPix=function(val){if(this.yLogQ){return this.top+(Math.log(yEnd)-Math.log(val))/yLogScale;}else{return this.top+((this.yEnd-val)/this.yScale);}};Coords.prototype.toPtVal=function(pt,useCornerQ){return new Pt(toXVal(pt.x,useCornerQ),toYVal(pt.y,useCornerQ));};Coords.prototype.toXVal=function(pix,useCornerQ){if(useCornerQ){return this.xStt+(pix-this.left)*this.xScale;}else{return this.xStt+pix*this.xScale;}};Coords.prototype.toYVal=function(pix,useCornerQ){if(useCornerQ){return this.yEnd-(pix-this.top)*this.yScale;}else{return this.yEnd-pix*this.yScale;}};Coords.prototype.getTicks=function(stt,span){var ticks=[];var inter=this.tickInterval(span/5,false);var tickStt=Math.ceil(stt/inter)*inter;var i=0;do{var tick=i*inter;tick=Number(tick.toPrecision(5));ticks.push([tickStt+tick,1]);i++;}while(tick<span);inter=this.tickInterval(span/4,true);for(i=0;i<ticks.length;i++){var t=ticks[i][0];if(Math.abs(Math.round(t/inter)-(t/inter))<0.001){ticks[i][1]=0;}}
return ticks;};Coords.prototype.tickInterval=function(span,majorQ){var pow10=Math.pow(10,Math.floor(Math.log(span)*Math.LOG10E));var mantissa=span/pow10;if(mantissa>=5){if(majorQ){return(5*pow10);}else{return(2*pow10);}}
if(mantissa>=2){if(majorQ){return(2*pow10);}else{return(1*pow10);}}
if(mantissa>=1){if(majorQ){return(1*pow10);}else{return(0.2*pow10);}}
if(majorQ){return(1*pow10);}else{return(0.2*pow10);}};Coords.prototype.xTickInterval=function(tickDensity,majorQ){return this.tickInterval((this.xEnd-this.xStt)/tickDensity,majorQ);};Coords.prototype.yTickInterval=function(tickDensity,majorQ){return this.tickInterval((this.yEnd-this.yStt)/tickDensity,majorQ);};function Graph(g,coords){this.g=g;this.coords=coords;var xClr=0x4444ff;var yClr=0xff4444;this.xLinesQ=true;this.yLinesQ=true;this.xArrowQ=true;this.yArrowQ=true;this.xValsQ=true;this.yValsQ=true;this.skewQ=false;}
Graph.prototype.drawGraph=function(){if(coords.xLogQ){this.drawLinesLogX();}else{if(this.xLinesQ){this.drawLinesX();}}
if(coords.yLogQ){this.drawLinesLogY();}else{if(this.yLinesQ){this.drawLinesY();}}};Graph.prototype.drawLinesX=function(){var xAxisPos=coords.toYPix(0);var yAxisPos=coords.toXPix(0);var numAtAxisQ=(yAxisPos>=0&&yAxisPos<coords.width);var g=this.g;g.lineWidth=1;var ticks=coords.getTicks(coords.xStt,coords.xEnd-coords.xStt);for(var i=0;i<ticks.length;i++){var tick=ticks[i];var xVal=tick[0];var tickLevel=tick[1];if(tickLevel==0){g.strokeStyle="rgba(0,0,256,0.3)";}else{g.strokeStyle="rgba(0,0,256,0.1)";}
var xPix=coords.toXPix(xVal,false);g.beginPath();g.moveTo(xPix,coords.toYPix(coords.yStt,false));g.lineTo(xPix,coords.toYPix(coords.yEnd,false));g.stroke();if(tickLevel==0&&this.xValsQ){g.fillStyle="#0000ff";g.font="12px Verdana";g.textAlign="center";var lbly=0;if(numAtAxisQ&&xAxisPos>0&&xAxisPos<coords.height){lbly=xAxisPos+15;}else{lbly=coords.height-20;}
g.fillText(fmt(xVal),xPix,xAxisPos+15);}}
if(this.skewQ)
return;if(yAxisPos>=0&&yAxisPos<coords.width){g.lineWidth=2;g.strokeStyle="rgba(256,0,0,0.4)";g.beginPath();g.moveTo(yAxisPos,coords.toYPix(coords.yStt,false));g.lineTo(yAxisPos,coords.toYPix(coords.yEnd,false));g.stroke();g.beginPath();g.fillStyle=g.strokeStyle;g.drawArrow(yAxisPos,coords.toYPix(coords.yEnd),15,2,20,10,Math.PI/2,10,false);g.stroke();g.fill();g.font='bold 24px Arial';g.fillText('y',yAxisPos+12,coords.toYPix(coords.yEnd)+15);}};Graph.prototype.drawLinesY=function(){var xAxisPos=coords.toYPix(0);var yAxisPos=coords.toXPix(0);var numAtAxisQ=(xAxisPos>=0&&xAxisPos<coords.height);var g=this.g;g.lineWidth=1;var ticks=coords.getTicks(coords.yStt,coords.yEnd-coords.yStt);for(var i=0;i<ticks.length;i++){var tick=ticks[i];var yVal=tick[0];var tickLevel=tick[1];if(tickLevel==0){g.strokeStyle="rgba(0,0,256,0.3)";}else{g.strokeStyle="rgba(0,0,256,0.1)";}
var yPix=coords.toYPix(yVal,false);g.beginPath();g.moveTo(coords.toXPix(coords.xStt,false),yPix);g.lineTo(coords.toXPix(coords.xEnd,false),yPix);g.stroke();if(tickLevel==0&&this.yValsQ){g.fillStyle="#ff0000";g.font="12px Verdana";g.textAlign="right";g.fillText(fmt(yVal),yAxisPos-5,yPix+5);}}
if(this.skewQ)
return;if(xAxisPos>=0&&xAxisPos<coords.height){g.lineWidth=2;g.strokeStyle="rgba(0,0,256,0.4)";g.beginPath();g.moveTo(coords.toXPix(coords.xStt,false),xAxisPos);g.lineTo(coords.toXPix(coords.xEnd,false),xAxisPos);g.stroke();g.beginPath();g.fillStyle=g.strokeStyle;g.drawArrow(coords.toXPix(coords.xEnd,false),xAxisPos,15,2,20,10,0,10,false);g.stroke();g.fill();g.font='bold 24px Arial';g.fillText('x',coords.toXPix(coords.xEnd,false)-5,xAxisPos-7);}};function Line(pt1,pt2){this.a=pt1;this.b=pt2;}
Line.prototype.getLength=function(){var dx=this.b.x-this.a.x;var dy=this.b.y-this.a.y;return Math.sqrt(dx*dx+dy*dy);};Line.prototype.setLen=function(newLen,fromMidQ){var len=this.getLength();if(fromMidQ){var midPt=this.getMidPt();var halfPt=new Pt(this.a.x-midPt.x,this.a.y-midPt.y);halfPt.multiplyMe(newLen/len);this.a=midPt.translate(halfPt);this.b=midPt.translate(halfPt,false);}else{var diffPt=new Pt(this.a.x-this.b.x,this.a.y-this.b.y);diffPt.multiplyMe(newLen/len);this.b=this.a.translate(diffPt,false);}};Line.prototype.getAngle=function(){return Math.atan2(this.b.y-this.a.y,this.b.x-this.a.x);};Line.prototype.getMidPt=function(){return new Pt((this.a.x+this.b.x)/2,(this.a.y+this.b.y)/2);};Line.prototype.getIntersection=function(ln,asSegmentsQ){var A=this.a;var B=this.b;var E=ln.a;var F=ln.b;var a1=B.y-A.y;var b1=A.x-B.x;var c1=B.x*A.y-A.x*B.y;var a2=F.y-E.y;var b2=E.x-F.x;var c2=F.x*E.y-E.x*F.y;var denom=a1*b2-a2*b1;if(denom==0){return null;}
var ip=new Pt();ip.x=(b1*c2-b2*c1)/denom;ip.y=(a2*c1-a1*c2)/denom;if(asSegmentsQ){if(Math.pow(ip.x-B.x,2)+Math.pow(ip.y-B.y,2)>Math.pow(A.x-B.x,2)+Math.pow(A.y-B.y,2))return null;if(Math.pow(ip.x-A.x,2)+Math.pow(ip.y-A.y,2)>Math.pow(A.x-B.x,2)+Math.pow(A.y-B.y,2))return null;if(Math.pow(ip.x-F.x,2)+Math.pow(ip.y-F.y,2)>Math.pow(E.x-F.x,2)+Math.pow(E.y-F.y,2))return null;if(Math.pow(ip.x-E.x,2)+Math.pow(ip.y-E.y,2)>Math.pow(E.x-F.x,2)+Math.pow(E.y-F.y,2))return null;}
return ip;}
CanvasRenderingContext2D.prototype.drawArrow=function(x0,y0,totLen,shaftHt,headLen,headHt,angle,sweep,invertQ){var g=this;var pts=[[0,0],[-headLen,-headHt/2],[-headLen+sweep,-shaftHt/2],[-totLen,-shaftHt/2],[-totLen,shaftHt/2],[-headLen+sweep,shaftHt/2],[-headLen,headHt/2],[0,0]];if(invertQ){pts.push([0,-headHt/2],[-totLen,-headHt/2],[-totLen,headHt/2],[0,headHt/2]);}
for(var i=0;i<pts.length;i++){var cosa=Math.cos(-angle);var sina=Math.sin(-angle);var xPos=pts[i][0]*cosa+pts[i][1]*sina;var yPos=pts[i][0]*sina-pts[i][1]*cosa;if(i==0){g.moveTo(x0+xPos,y0+yPos);}else{g.lineTo(x0+xPos,y0+yPos);}}};function deg(a){return Math.round(a*180./Math.PI)}
CanvasRenderingContext2D.prototype.drawAngle3Pt=function(x,y,len,pt0,pt1,pt2){var sttAngle=Math.atan2(pt0.y-pt1.y,pt0.x-pt1.x)
var a1=sttAngle
var outAngle=Math.atan2(pt1.y-pt2.y,pt1.x-pt2.x)
var a2=outAngle
var angle=outAngle-sttAngle
var a3=angle
if(angle<0)angle+=2*Math.PI;if(angle>Math.PI)angle-=Math.PI
var angDeg=Math.round(angle*180./Math.PI);var d=30;if(angDeg==90){g.drawBox(x,y,25,sttAngle+angle-Math.PI/2);}else{if(angDeg>90){g.lineStyle="#ff0000";d=Math.max(20,28-(angDeg-90)/6);}else{d=Math.min(40,33+(90-angDeg)/10);g.lineStyle="#4444FF";}
g.fillStyle="hsla(60,60%,60%,0.3)";g.lineWidth=1
g.beginPath();g.moveTo(x,y);g.arc(x,y,d,sttAngle,sttAngle+angle,false);g.stroke();g.fill();}
var ang=Math.round(angle*180/Math.PI,this.dec);var angDescr=ang+"° + "
var aMid=sttAngle+(angle/2);var txtPt={x:x+(d+15)*Math.cos(aMid),y:y+(d+15)*Math.sin(aMid)}
g.font="bold 16px Arial";g.textAlign='center'
g.fillStyle="rgba(0, 0, 255, 1)";g.fillText(Math.round(ang)+"°",txtPt.x,txtPt.y+5)};CanvasRenderingContext2D.prototype.drawBox=function(midX,midY,radius,angle){g.beginPath();var pts=[[0,0],[Math.cos(angle),Math.sin(angle)],[Math.cos(angle)+Math.cos(angle+Math.PI/2),Math.sin(angle)+Math.sin(angle+Math.PI/2)],[Math.cos(angle+Math.PI/2),Math.sin(angle+Math.PI/2)],[0,0]];for(var i=0;i<pts.length;i++){if(i==0){g.moveTo(midX+radius*pts[i][0],midY+radius*pts[i][1]);}else{g.lineTo(midX+radius*pts[i][0],midY+radius*pts[i][1]);}}
g.stroke();};function fmt(num,digits){digits=14;if(num==Number.POSITIVE_INFINITY)
return "undefined";if(num==Number.NEGATIVE_INFINITY)
return "undefined";num=num.toPrecision(digits);num=num.replace(/0+$/,"");if(num.charAt(num.length-1)==".")num=num.substr(0,num.length-1);if(Math.abs(num)<1e-15)num=0;return num;}
function dropdownHTML(opts,funcName,id,num){var s='';s+='<select id="'+id+'" style="font: 15px Arial; color: #6600cc; background: rgba(200,220,256,0.7); padding: 1px; border-radius: 6px;" onchange="'+funcName+'()" autocomplete="off" >';for(var i=0;i<opts.length;i++){var idStr=id+i;var chkStr=(i==num)?'selected':'';s+='<option id="'+idStr+'" value="'+opts[i].name+'" style="height:18px;" '+chkStr+' >'+opts[i].name+'</option>';}
s+='</select>';return s;}