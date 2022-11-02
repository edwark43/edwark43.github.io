let w,h,ratio,el,g,my={};function leastsquaresMain(){let version='0.6';let canvasid="canvas0"
my.dragQ=false;my.dragScreenQ=false;w=540;h=360;my.opts={title:'Title',xtitl:'X Values',ytitl:'Y Values',raws:'(1.21,1.69), (3.00,5.89), (5.16,4.11), (8.31,5.49), (10.21,8.65)'}
my.graphWd=w;my.graphHt=h;let s='';s+='<div class="js" style="position:relative; width:'+w+'px; margin:auto; display:block; ">';var inps=[{lbl:'X Label',id:'xtitl',ht:20,type:0},{lbl:'Y Label',id:'ytitl',ht:20,type:0},];s+='<div class="control" style="text-align:center;">';for(var i=0;i<inps.length;i++){var inp=inps[i];s+='<div style="display: inline-block; " id="'+inp.id+'div">';s+='<div class="label" style="display: inline-block; font: bold 14px Arial; " >'+inp.lbl+':&nbsp;</div>';s+='<input class="input" id="'+inp.id+'" style="width:100px; font: 18px Arial; text-align:center; z-index:2;" value="" onkeyup="go(-1)"  onchange ="go(-1)" /> &nbsp;';s+='</div>';}
s+='</div>';s+='<div style="position:relative; ">';s+='<textarea  id="raws"  class="input" value="ddd" style="width: 97%; height: 80px; font: 16px Arial;  display: block; margin: 1% auto 1% auto;" onkeyup="editToShapes()">';s+='</textarea >';s+='</div>';s+='<div style="position:relative; ">';s+='<canvas id="'+canvasid+'" width="'+w+'" height="'+h+'" style="z-index:10; border: 1px solid blue;"></canvas>';s+='<div id="btns1" style="position:absolute; right:3px; bottom:5px;">';s+='<button id="guidesBtn" onclick="toggleGuides()" style="z-index:2;" class="btn lo" >Guides</button>';s+='<button id="coordsBtn" onclick="toggleCoords()" style="z-index:2;" class="btn lo" >Coords</button>';s+='</div>';s+='</div>';s+='<div class="control" style="position:relative; ">';s+='<span style="font: 13px/20px Arial; vertical-align: top; z-index: 2; ">Zoom:</span>';s+='<input type="range" id="r1"  value="0.5" min="0" max="1" step=".01"  style="z-index:2; width:200px; height:17px; border: none; " oninput="onZoomChg(0,this.value)" onchange="onZoomChg(1,this.value)" />';s+='<button id="fitBtn" onclick="fit()" style="z-index:2;" class="btn" >Fit</button>';s+=' '
s+='<button style="color: #8888ff; font-size: 14px;" class="btn" onclick="canvasPrint()" >Print</button>';s+='<button style="color: #8888ff; font-size: 14px;" class="btn" onclick="canvasSave()" >Save</button>';s+='</div>';s+='<div id="editpop" style="position:absolute; left:-450px; top:40px; padding: 5px; border: 1px solid red; border-radius: 9px; background-color: #88aaff; box-shadow: 10px 10px 5px 0px rgba(40,40,40,0.75); z-index:1; transition: all linear 0.3s; opacity:0; ">';s+='<textarea  id="editnumnum" value="ddd" style="width: 400px; height: 120px; font: 16px Arial; border: 1px solid red; border-radius: 9px; background-color: #eeeeff; display: block;">';s+='</textarea >';s+='<div style="float:right; margin: 0 0 5px 10px;">';s+='<button onclick="editYes()" style="z-index:2; font: 22px Arial;" class="btn" >&#x2714;</button>';s+='<button onclick="editNo()" style="z-index:2; font: 22px Arial;" class="btn" >&#x2718;</button>';s+='</div>';s+='</div>';s+='<div style="font: 10px Arial; color: #6600cc; position:absolute; right:10px; bottom:10px;">&copy; 2020 MathsIsFun.com  v'+version+'</div>';s+='</div>';document.write(s);el=document.getElementById(canvasid);ratio=2;el.width=w*ratio;el.height=h*ratio;el.style.width=w+"px";el.style.height=h+"px";g=el.getContext("2d");g.setTransform(ratio,0,0,ratio,0,0);my.currZoom=1;my.sttRect=[-1,-1,12,10];my.coords=new Coords(0,0,w,h,my.sttRect[0],my.sttRect[1],my.sttRect[2],my.sttRect[3],true);this.graph=new Graph(g,my.coords);my.dragNo=0;my.coordsQ=false;my.guidesQ=false;my.shapes=[];my.pts=[];el.addEventListener("mousedown",mouseDownListener,false);el.addEventListener('touchstart',ontouchstart,false);el.addEventListener("mousemove",dopointer,false);document.getElementById('xtitl').value=optGet('xtitl')
document.getElementById('ytitl').value=optGet('ytitl')
document.getElementById('raws').value=optGet('raws')
decodeCSV(optGet('raws'))
go();shapesToEdit();}
function go(){optSet('xtitl',document.getElementById('xtitl').value)
optSet('ytitl',document.getElementById('ytitl').value)
optSet('raws',document.getElementById('raws').value)
console.log('go',my.opts)
g.clearRect(0,0,el.width,el.height);leastsquares();this.graph.drawGraph();drawPts();}
function leastsquares(){let sumx=0;let sumy=0
let sumx2=0;let sumxy=0;for(let i=0;i<my.shapes.length;i++){let pt=my.shapes[i];sumx+=pt.x;sumy+=pt.y;sumx2+=pt.x*pt.x;sumxy+=pt.x*pt.y;}
let n=my.shapes.length;let m=(n*sumxy-sumx*sumy)/(n*sumx2-sumx*sumx);let b=(sumy-m*sumx)/n;console.log("leastsquare",sumx,sumy,sumx2,sumxy,m,b);let pts=[];let minx=0;let maxx=0;for(let i=0;i<my.shapes.length;i++){let y=m*my.shapes[i].x+b;let pt=new Pt(my.coords.toXPix(my.shapes[i].x),my.coords.toYPix(y));pts.push(pt);if(i==0){minx=my.shapes[i].x;maxx=my.shapes[i].x;}else{minx=Math.min(minx,my.shapes[i].x);maxx=Math.max(maxx,my.shapes[i].x);}}
let xMid=(minx+maxx)/2;let xhalfspan=1.2*(maxx-minx)/2;minx=xMid-xhalfspan;maxx=xMid+xhalfspan;my.formula=linearFormula(minx,m*minx+b,maxx,m*maxx+b);g.strokeStyle='green';g.lineWidth=2;g.beginPath();g.moveTo(my.coords.toXPix(minx),my.coords.toYPix(m*minx+b));g.lineTo(my.coords.toXPix(maxx),my.coords.toYPix(m*maxx+b));g.stroke();g.beginPath();for(let i=0;i<pts.length;i++){let pt=pts[i];g.moveTo(pt.x,pt.y);g.lineTo(pt.x,pt.y);}
g.stroke();}
function zoomReset(){my.coords=new Coords(graphLt,graphTp,my.graphWd,my.graphHt,-5,-3,5,3,true);doGraph();}
function editToShapes(){console.log("editToShapes");let s=document.getElementById('raws').value;console.log("editYes",s);decodeCSV(s);}
function shapesToEdit(){document.getElementById('raws').value=getPts();}
function editpop(){console.log("editpop");let pop=document.getElementById('editpop');pop.style.transitionDuration="0.3s";pop.style.opacity=1;pop.style.zIndex=12;pop.style.left='100px';document.getElementById('raws').value=getPts();}
function editYes(){let pop=document.getElementById('editpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-500px';let s=document.getElementById('raws').value;console.log("editYes",s);decodeCSV(s);}
function editNo(){let pop=document.getElementById('editpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-500px';}
function getPts(){let s='';for(let i=0;i<my.shapes.length;i++){if(i>0)s+=', ';s+='(';s+=my.shapes[i].x
s+=',';s+=my.shapes[i].y
s+=')';}
return s;}
function decodeCSV(s){s=s.replace(/\s/g,"~");s=s.replace(/\)\,\(/g,"~");s=s.replace(/\)\(/g,"~");s=s.replace(/\)/g,"");s=s.replace(/\(/g,"");s=s.replace(/\,/g,"_");s=s.replace(/\*/g,"_");console.log("decodeCSV",s);decode(s);}
function decode(s){let a=s.split("~");my.shapes=[];for(let i=0;i<a.length;i++){let s1=a[i];let xy=s1.split("_");if(xy.length>=2){my.shapes.push(new Pt(Number(xy[0]),Number(xy[1])));}}
console.log("my.shapes",my.shapes);go();}
function fit(){my.coords.fitToPts(my.shapes,1.1);go();}
function toggleCoords(){my.coordsQ=!my.coordsQ;btn("coordsBtn",my.coordsQ);go();}
function toggleGuides(){my.guidesQ=!my.guidesQ;btn("guidesBtn",my.guidesQ);go();}
function btn(btn,onq){if(onq){document.getElementById(btn).classList.add("hi");document.getElementById(btn).classList.remove("lo");}else{document.getElementById(btn).classList.add("lo");document.getElementById(btn).classList.remove("hi");}}
function ontouchstart(evt){let touch=evt.targetTouches[0];evt.clientX=touch.clientX;evt.clientY=touch.clientY;evt.touchQ=true;mouseDownListener(evt);}
function ontouchmove(evt){let touch=evt.targetTouches[0];evt.clientX=touch.clientX;evt.clientY=touch.clientY;evt.touchQ=true;mouseMoveListener(evt);evt.preventDefault();}
function ontouchend(evt){el.addEventListener('touchstart',ontouchstart,false);window.removeEventListener("touchend",ontouchend,false);if(my.dragQ){my.dragQ=false;window.removeEventListener("touchmove",ontouchmove,false);}}
function dopointer(e){let bRect=el.getBoundingClientRect();let mouseX=(e.clientX-bRect.left)*(el.width/ratio/bRect.width);let mouseY=(e.clientY-bRect.top)*(el.height/ratio/bRect.height);let overQ=false;for(let i=0;i<my.pts.length;i++){if(hitTest(my.pts[i],mouseX,mouseY)){overQ=true;my.dragNo=i;}}
if(overQ){document.body.style.cursor="pointer";}else{document.body.style.cursor="default";}}
function mouseDownListener(evt){let highestIndex=-1;let bRect=el.getBoundingClientRect();let mouseX=(evt.clientX-bRect.left)*(el.width/ratio/bRect.width);let mouseY=(evt.clientY-bRect.top)*(el.height/ratio/bRect.height);my.prevX=mouseX;my.prevY=mouseY;my.dragQ=false;my.dragScreenQ=false;for(let i=0;i<my.pts.length;i++){if(hitTest(my.pts[i],mouseX,mouseY)){my.dragNo=i;my.dragQ=true;if(i>highestIndex){my.dragHold={x:mouseX-my.pts[i].x,y:mouseY-my.pts[i].y}
highestIndex=i;my.dragNo=i;}}}
if(!my.dragQ){my.dragQ=true;my.dragScreenQ=true;}
if(evt.touchQ){window.addEventListener('touchmove',ontouchmove,false);}else{window.addEventListener("mousemove",mouseMoveListener,false);}
console.log("mouseDownListener",my.dragQ,my.dragScreenQ,highestIndex);go();if(evt.touchQ){el.removeEventListener("touchstart",ontouchstart,false);window.addEventListener("touchend",ontouchend,false);}else{el.removeEventListener("mousedown",mouseDownListener,false);window.addEventListener("mouseup",mouseUpListener,false);}
if(evt.preventDefault){evt.preventDefault();}
else if(evt.returnValue){evt.returnValue=false;}
return false;}
function mouseUpListener(evt){my.dragQ=false;el.addEventListener("mousedown",mouseDownListener,false);window.removeEventListener("mouseup",mouseUpListener,false);window.removeEventListener("mousemove",mouseMoveListener,false);}
function mouseMoveListener(evt){let posX;let posY;let shapeRad=my.shapes[my.dragNo].rad;let minX=shapeRad;let maxX=el.width-shapeRad;let minY=shapeRad;let maxY=el.height-shapeRad;let bRect=el.getBoundingClientRect();let mouseX=(evt.clientX-bRect.left)*(el.width/ratio/bRect.width);let mouseY=(evt.clientY-bRect.top)*(el.height/ratio/bRect.height);if(my.dragScreenQ){let moveX=my.prevX-mouseX;let moveY=mouseY-my.prevY;if(Math.abs(moveX)>1||Math.abs(moveY)>1){my.coords.drag(moveX,moveY);my.prevX=mouseX;my.prevY=mouseY;}}else{posX=mouseX-my.dragHold.x;posX=(posX<minX)?minX:((posX>maxX)?maxX:posX);posY=mouseY-my.dragHold.y;posY=(posY<minY)?minY:((posY>maxY)?maxY:posY);my.shapes[my.dragNo].x=fmt(my.coords.toXVal(posX),4)
my.shapes[my.dragNo].y=fmt(my.coords.toYVal(posY),4)}
go();shapesToEdit();}
function hitTest(shape,mx,my){let dx;let dy;dx=mx-shape.x;dy=my-shape.y;return(dx*dx+dy*dy<shape.rad*shape.rad);}
function onZoomChg(n,v){let scaleBy=(v*2+0.01)/my.currZoom;my.coords.scale(scaleBy);my.currZoom*=scaleBy;if(n==1){my.currZoom=1;document.getElementById('r1').value=0.5;}
go();}
function drawPts(){g.strokeStyle="rgba(0, 0, 255, 0.5)";g.fillStyle="rgba(255, 255, 100, 0.1)";let pts=[];for(let i=0;i<my.shapes.length;i++){let pt=new Pt(my.coords.toXPix(my.shapes[i].x),my.coords.toYPix(my.shapes[i].y));pts.push(pt);}
my.pts=pts
let dbg="";for(let i=0;i<my.pts.length;i++){let pt=pts[i];g.fillStyle="rgba(0, 0, 255, 0.3)";g.beginPath();g.arc(pt.x,pt.y,pt.rad,0,2*Math.PI,false);g.closePath();g.fill();g.fillStyle="rgba(0, 0, 0, 0.8)";g.beginPath();g.arc(pt.x,pt.y,2,0,2*Math.PI,false);g.closePath();g.fill();g.textAlign="left";if(my.coordsQ){g.font="bold 14px Arial";let txt='(';txt+=my.shapes[i].x
txt+=',';txt+=my.shapes[i].y
txt+=')';g.fillText(txt,pt.x+5,pt.y-9);}else{g.font="14px Arial";g.fillText(String.fromCharCode(65+i),my.shapes[i].x+5,my.shapes[i].y-9);}
dbg+='['+Math.floor(my.shapes[i].x)+","+Math.floor(my.shapes[i].y)+"],";}
g.beginPath();for(let i=0;i<pts.length;i++){if(i==0){g.moveTo(pts[i].x,pts[i].y);}else{g.lineTo(pts[i].x,pts[i].y);}}
g.stroke();if(my.guidesQ){let orig={x:my.coords.toXPix(0),y:my.coords.toYPix(0)};for(let i=0;i<pts.length;i++){let pt=pts[i];g.beginPath();g.strokeStyle="rgba(0, 0, 0, 0.5)";g.moveTo(orig.x,pt.y);g.lineTo(pt.x,pt.y);g.stroke();g.beginPath();g.moveTo(pt.x,pt.y);g.lineTo(pt.x,orig.y);g.stroke();}}}
class Pt{constructor(ix,iy){this.x=ix;this.y=iy;this.rad=9;this.color="rgb("+0+","+0+","+255+")";}
setxy(ix,iy){this.x=ix;this.y=iy;}
getAngle(){return this.angleOut-this.angleIn;}
drawMe(g){g.fillStyle="rgba(0, 0, 255, 0.3)";g.beginPath();g.arc(this.x,this.y,20,0,2*Math.PI,false);g.closePath();g.fill();}
getAvg(pts){let xSum=0;let ySum=0;for(let i=0;i<pts.length;i++){xSum+=pts[i].x;ySum+=pts[i].y;}
let newPt=new Pt(xSum/pts.length,ySum/pts.length);newPt.x=xSum/pts.length;newPt.y=ySum/pts.length;return newPt;}
setAvg(pts){let newPt=this.getAvg(pts);this.x=newPt.x;this.y=newPt.y;}
interpolate(pt1,pt2,f){this.x=pt1.x*f+pt2.x*(1-f);this.y=pt1.y*f+pt2.y*(1-f);}
translate(pt,addQ){addQ=typeof addQ!=='undefined'?addQ:true;let t=new Pt(this.x,this.y);t.x=this.x;t.y=this.y;if(addQ){t.x+=pt.x;t.y+=pt.y;}else{t.x-=pt.x;t.y-=pt.y;}
return t;}
multiply(fact){return new Pt(this.x*fact,this.y*fact);}
multiplyMe(fact){this.x*=fact;this.y*=fact;}}
function isNear(a,b,toler){if(Math.abs(a-b)<=toler){return true;}else{return false;}}
function avg(vals){let sum=0;let count=vals.length;for(let i=0;i<count;i++){sum+=vals[i];}
return(sum/count);}
function dist(dx,dy){return(Math.sqrt(dx*dx+dy*dy));}
function loop(currNo,minNo,maxNo,incr){currNo+=incr;let range=maxNo-minNo+1;if(currNo<minNo){currNo=maxNo-(-currNo+maxNo)%range;}
if(currNo>maxNo){currNo=minNo+(currNo-minNo)%range;}
return currNo;}
function constrain(min,val,max){return(Math.min(Math.max(min,val),max));}
class Coords{constructor(left,top,width,height,xStt,yStt,xEnd,yEnd,uniScaleQ){this.left=left;this.top=top;this.width=width;this.height=height;this.xStt=xStt;this.yStt=yStt;this.xEnd=xEnd;this.yEnd=yEnd;this.uniScaleQ=uniScaleQ;this.xLogQ=false;this.yLogQ=false;this.xScale;let xLogScale;this.yScale;this.calcScale();}
calcScale(){if(this.xLogQ){if(this.xStt<=0)
this.xStt=1;if(this.xEnd<=0)
this.xEnd=1;}
if(this.yLogQ){if(this.yStt<=0)
this.yStt=1;if(this.yEnd<=0)
this.yEnd=1;}
let temp;if(this.xStt>this.xEnd){temp=this.xStt;this.xStt=this.xEnd;this.xEnd=temp;}
if(this.yStt>this.yEnd){temp=this.yStt;this.yStt=this.yEnd;this.yEnd=temp;}
let xSpan=this.xEnd-this.xStt;if(xSpan<=0)
xSpan=0.1;this.xScale=xSpan/this.width;this.xLogScale=(Math.log(this.xEnd)-Math.log(this.xStt))/this.width;let ySpan=this.yEnd-this.yStt;if(ySpan<=0)
ySpan=0.1;this.yScale=ySpan/this.height;this.yLogScale=(Math.log(this.yEnd)-Math.log(this.yStt))/this.height;if(this.uniScaleQ&&!this.xLogQ&&!this.yLogQ){let newScale=Math.max(this.xScale,this.yScale);this.xScale=newScale;xSpan=this.xScale*this.width;let xMid=(this.xStt+this.xEnd)/2;this.xStt=xMid-xSpan/2;this.xEnd=xMid+xSpan/2;this.yScale=newScale;ySpan=this.yScale*this.height;let yMid=(this.yStt+this.yEnd)/2;this.yStt=yMid-ySpan/2;this.yEnd=yMid+ySpan/2;}}
getXScale(){return this.xScale;}
getYScale(){return this.yScale;}
scale(factor,xMid,yMid){if(typeof xMid=='undefined')
xMid=(this.xStt+this.xEnd)/2;this.xStt=xMid-(xMid-this.xStt)*factor;this.xEnd=xMid+(this.xEnd-xMid)*factor;if(typeof yMid=='undefined')
yMid=(this.yStt+this.yEnd)/2;this.yStt=yMid-(yMid-this.yStt)*factor;this.yEnd=yMid+(this.yEnd-yMid)*factor;this.calcScale();}
drag(xPix,yPix){this.xStt+=xPix*this.xScale;this.xEnd+=xPix*this.xScale;this.yStt+=yPix*this.yScale;this.yEnd+=yPix*this.yScale;this.calcScale();}
newCenter(x,y){let xMid=this.xStt+x*this.xScale;let xhalfspan=(this.xEnd-this.xStt)/2;this.xStt=xMid-xhalfspan;this.xEnd=xMid+xhalfspan;let yMid=this.yEnd-y*this.yScale;let yhalfspan=(this.yEnd-this.yStt)/2;this.yStt=yMid-yhalfspan;this.yEnd=yMid+yhalfspan;this.calcScale();}
fitToPts(pts,borderFactor){for(let i=0;i<pts.length;i++){let pt=pts[i];if(i==0){this.xStt=pt.x;this.xEnd=pt.x;this.yStt=pt.y;this.yEnd=pt.y;}else{this.xStt=Math.min(this.xStt,pt.x);this.xEnd=Math.max(this.xEnd,pt.x);this.yStt=Math.min(this.yStt,pt.y);this.yEnd=Math.max(this.yEnd,pt.y);}}
console.log("before factor",this.xStt,this.yStt,"-->",this.xEnd,this.yEnd);let xMid=(this.xStt+this.xEnd)/2;let xhalfspan=borderFactor*(this.xEnd-this.xStt)/2;this.xStt=xMid-xhalfspan;this.xEnd=xMid+xhalfspan;let yMid=(this.yStt+this.yEnd)/2;let yhalfspan=borderFactor*(this.yEnd-this.yStt)/2;this.yStt=yMid-yhalfspan;this.yEnd=yMid+yhalfspan;console.log("after factor",this.xStt,this.yStt,"-->",this.xEnd,this.yEnd);this.calcScale();}
toXPix(val,useCornerQ){if(this.xLogQ){return this.left+(Math.log(val)-Math.log(this.xStt))/this.xLogScale;}else{return this.left+((val-this.xStt)/this.xScale);}}
toYPix(val){if(this.yLogQ){return this.top+(Math.log(this.yEnd)-Math.log(val))/this.yLogScale;}else{return this.top+((this.yEnd-val)/this.yScale);}}
toPtVal(pt,useCornerQ){return new Pt(this.toXVal(pt.x,useCornerQ),this.toYVal(pt.y,useCornerQ));}
toXVal(pix,useCornerQ){if(useCornerQ){return this.xStt+(pix-this.left)*this.xScale;}else{return this.xStt+pix*this.xScale;}}
toYVal(pix,useCornerQ){if(useCornerQ){return this.yEnd-(pix-this.top)*this.yScale;}else{return this.yEnd-pix*this.yScale;}}
getTicks(stt,span,ratio){let ticks=[];let inter=this.tickInterval(span/ratio,false);let tickStt=Math.ceil(stt/inter)*inter;let i=0;let tick=0;do{tick=tickStt+i*inter;tick=Number(tick.toPrecision(8));ticks.push([tick,1]);i++;}while(tick<stt+span);inter=this.tickInterval(span/ratio,true);for(i=0;i<ticks.length;i++){let t=ticks[i][0];if(Math.abs(Math.round(t/inter)-(t/inter))<0.001){ticks[i][1]=0;}}
return ticks;}
tickInterval(span,majorQ){let pow10=Math.pow(10,Math.floor(Math.log(span)*Math.LOG10E));let mantissa=span/pow10;if(mantissa>=5){if(majorQ){return(5*pow10);}else{return(1*pow10);}}
if(mantissa>=3){if(majorQ){return(2*pow10);}else{return(0.2*pow10);}}
if(mantissa>=1.4){if(majorQ){return(0.5*pow10);}else{return(0.2*pow10);}}
if(mantissa>=0.8){if(majorQ){return(0.5*pow10);}else{return(0.1*pow10);}}
if(majorQ){return(0.2*pow10);}else{return(0.1*pow10);}}}
class Graph{constructor(g){this.g=g;this.xLinesQ=true;this.yLinesQ=true;this.xValsQ=true;this.yValsQ=true;this.vtNumsAlign='right';this.skewQ=false;}
drawGraph(){this.hzAxisY=my.coords.toYPix(0);if(this.hzAxisY<0)this.hzAxisY=10;if(this.hzAxisY>my.coords.height)this.hzAxisY=my.coords.height-17
this.hzNumsY=this.hzAxisY+14;if(this.hzAxisY>my.coords.height-17)this.hzNumsY=my.coords.height-3;this.vtAxisX=my.coords.toXPix(0);if(this.vtAxisX<0)this.vtAxisX=10;if(this.vtAxisX>my.coords.width)this.vtAxisX=my.coords.width;this.vtNumsX=this.vtAxisX-5;this.vtNumsAlign='right';this.vtLblX=this.vtAxisX-25
if(this.vtAxisX<=10){this.vtNumsAlign='left';this.vtNumsX=15;this.vtLblX=this.vtAxisX+45}
if(my.coords.xLogQ){this.drawLinesLogX();}else{if(this.xLinesQ){this.drawHzLines();}}
if(my.coords.yLogQ){this.drawLinesLogY();}else{if(this.yLinesQ){this.drawVtLines();}}
g.fillStyle="#0000ff";g.font="28px Arial";g.textAlign="center";g.fillText(my.formula,w/2,24);}
drawVtLines(){let g=this.g;g.lineWidth=1;let ticks=my.coords.getTicks(my.coords.xStt,my.coords.xEnd-my.coords.xStt,my.graphWd/100);for(let i=0;i<ticks.length;i++){let tick=ticks[i];let xVal=tick[0];let tickLevel=tick[1];if(tickLevel==0){g.strokeStyle="rgba(0,0,256,1)";g.lineWidth=0.3}else{g.strokeStyle="rgba(0,0,256,1)";g.lineWidth=0.1}
let xPix=my.coords.toXPix(xVal,false);g.beginPath();g.moveTo(xPix,my.coords.toYPix(my.coords.yStt,false));g.lineTo(xPix,my.coords.toYPix(my.coords.yEnd,false));g.stroke();if(tickLevel==0&&this.xValsQ){g.fillStyle="#0000ff";g.font="bold 12px Verdana";g.textAlign="center";g.fillText(fmt(xVal),xPix,this.hzNumsY);}}
if(this.skewQ)return;g.lineWidth=1.5;g.strokeStyle="#ff0000";g.beginPath();g.moveTo(this.vtAxisX,my.coords.toYPix(my.coords.yStt,false));g.lineTo(this.vtAxisX,my.coords.toYPix(my.coords.yEnd,false));g.stroke();g.beginPath();g.fillStyle=g.strokeStyle;g.drawArrow(this.vtAxisX,my.coords.toYPix(my.coords.yEnd),15,2,20,10,Math.PI/2,10,false);g.stroke();g.fill();g.save();g.translate(this.vtLblX,my.coords.toYPix(my.coords.yEnd)+10)
g.rotate(-Math.PI/2);g.fillStyle="#ff0000";g.font="20px Arial";g.textAlign="right";g.fillText(my.opts.ytitl,0,0);g.restore();}
drawHzLines(){let g=this.g;g.lineWidth=1;let ticks=my.coords.getTicks(my.coords.yStt,my.coords.yEnd-my.coords.yStt,my.graphHt/100);for(let i=0;i<ticks.length;i++){let tick=ticks[i];let yVal=tick[0];let tickLevel=tick[1];if(tickLevel==0){g.strokeStyle="rgba(0,0,256,1)";g.lineWidth=0.3}else{g.strokeStyle="rgba(0,0,256,1)";g.lineWidth=0.1}
let yPix=my.coords.toYPix(yVal,false);g.beginPath();g.moveTo(my.coords.toXPix(my.coords.xStt,false),yPix);g.lineTo(my.coords.toXPix(my.coords.xEnd,false),yPix);g.stroke();if(tickLevel==0&&this.yValsQ){g.fillStyle="#ff0000";g.font="bold 12px Verdana";g.textAlign=this.vtNumsAlign;g.fillText(fmt(yVal),this.vtNumsX,yPix+5);}}
if(this.skewQ)
return;g.lineWidth=2;g.strokeStyle="#0000ff";g.beginPath();g.moveTo(my.coords.toXPix(my.coords.xStt,false),this.hzAxisY);g.lineTo(my.coords.toXPix(my.coords.xEnd,false),this.hzAxisY);g.stroke();g.beginPath();g.fillStyle=g.strokeStyle;g.drawArrow(my.coords.toXPix(my.coords.xEnd,false),this.hzAxisY,15,2,20,10,0,10,false);g.stroke();g.fill();g.fillStyle="#0000ff";g.font="20px Arial";g.textAlign="right";g.fillText(my.opts.xtitl,my.coords.toXPix(my.coords.xEnd,false)-10,this.hzAxisY-10);}}
CanvasRenderingContext2D.prototype.drawArrow=function(x0,y0,totLen,shaftHt,headLen,headHt,angle,sweep,invertQ){let g=this;let pts=[[0,0],[-headLen,-headHt/2],[-headLen+sweep,-shaftHt/2],[-totLen,-shaftHt/2],[-totLen,shaftHt/2],[-headLen+sweep,shaftHt/2],[-headLen,headHt/2],[0,0]];if(invertQ){pts.push([0,-headHt/2],[-totLen,-headHt/2],[-totLen,headHt/2],[0,headHt/2]);}
for(let i=0;i<pts.length;i++){let cosa=Math.cos(-angle);let sina=Math.sin(-angle);let xPos=pts[i][0]*cosa+pts[i][1]*sina;let yPos=pts[i][0]*sina-pts[i][1]*cosa;if(i==0){g.moveTo(x0+xPos,y0+yPos);}else{g.lineTo(x0+xPos,y0+yPos);}}};CanvasRenderingContext2D.prototype.drawBox=function(midX,midY,radius,angle){g.beginPath();let pts=[[0,0],[Math.cos(angle),Math.sin(angle)],[Math.cos(angle)+Math.cos(angle+Math.PI/2),Math.sin(angle)+Math.sin(angle+Math.PI/2)],[Math.cos(angle+Math.PI/2),Math.sin(angle+Math.PI/2)],[0,0]];for(let i=0;i<pts.length;i++){if(i==0){g.moveTo(midX+radius*pts[i][0],midY+radius*pts[i][1]);}else{g.lineTo(midX+radius*pts[i][0],midY+radius*pts[i][1]);}}
g.stroke();};function fmt(num,digits){if(num==Number.POSITIVE_INFINITY)return "undefined";if(num==Number.NEGATIVE_INFINITY)return "undefined";num=Number(num.toPrecision(digits));if(Math.abs(num)<1e-15)num=0;return num;}
function optGet(name){var val=localStorage.getItem(`leastsquares.${name}`)
if(val==null)val=my.opts[name]
return val}
function optSet(name,val){localStorage.setItem(`leastsquares.${name}`,val)
my.opts[name]=val}
function canvasSave(){var can=document.getElementById("canvas0");var dataUrl=can.toDataURL('image/png');var win=window.open();var s=pageHTML(dataUrl);win.document.write(s);}
function canvasPrint(){var can=document.getElementById("canvas0");var dataUrl=can.toDataURL('image/png');var win=window.open();var s=pageHTML(dataUrl);win.document.write(s);var isChrome=(window.navigator.userAgent.toLowerCase().indexOf("chrome")>-1);if(isChrome){win.focus();setTimeout(function(){win.print();},500);}else{win.focus();win.print();win.close();}}
function pageHTML(dataUrl){let s='<!doctype html><html lang="en"><head><title>Recent</title>';s+='<style type="text/css">';s+='body {';s+='width:100%; ';s+='height:100%; ';s+='margin: 0 !important; ';s+='padding: 0 !important; ';s+='overflow: hidden; ';s+='}';s+='</style>';s+='</head>';s+='<body style="font: 16px Arial;">';s+='<img src="'+dataUrl+'" style="max-width: 100%;" />';s+='</body></html>';return s;}
function linearFormula(x1,y1,x2,y2){console.log("calculate",x1,y1,x2,y2);let deltax=x2-x1;let deltay=y2-y1;let pointStr="("+x1+","+y1+"), ("+x2+","+y2+")";let m=0
let b=0
let formula="";let parallel="";let perpendicular="";if(deltax==0){if(deltay==0){formula="Please enter two different points";}else{formula="x = "+x1+"  [note: x, not y]";parallel="x = any number";perpendicular="y = any number";}}else{if(deltay==0){m=0;b=y1;formula="y = "+y1;parallel="y = any number";perpendicular="x = any number";}else{m=(y2-y1)/(x2-x1);b=y1-(m*x1);formula="y = "+linearPhrase([m,b]);parallel=linearPhrase([m,0])+" + any number";let newm=-1/m;perpendicular=linearPhrase([newm,0])+" + any number";}}
var s='';s+='Points: <b>'+pointStr+'</b>';s+='<br>Formula (y=mx+b): <b>'+formula+'</b>';s+='<br>Slope m: <b>'+m+'</b>';s+='<br>Y-intercept b: <b>'+b+'</b>';s+='<br>Parallel lines: <b>'+parallel+'</b>';s+='<br>Perpendicular lines: <b>'+perpendicular+'</b>';return formula}
function linearPhrase(a){var s="";for(var k=0;k<a.length;k++){var v=a[k];if(v!=0){if(v<0){if(s.length>0){s+=" − ";}else{s+=" −";}
v=-v;}else{if(s.length>0){s+=" + ";}}
switch(k){case 0:if(v!=1){s+=fmt(v,4);}
s+="x";break;case 1:s+=fmt(v,4)
break;default:if(v!=1){s+=fmt(v,4)}
s+="("+fmt(k,4)+")";break;}}}
if(s.length==0){s='0';}
return s;}