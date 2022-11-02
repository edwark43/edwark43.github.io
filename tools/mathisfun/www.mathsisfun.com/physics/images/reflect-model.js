var w,h,ratio,el,g,dragIndex,dragging,dragHoldX,dragHoldY,dots,my={};function reflectmodelMain(mode){my.version='0.61';my.mode=typeof mode!=='undefined'?mode:'ellipse';my.modes=[{id:'mirror',pts:[[21,57,"A"],[316,80,"B"],[90,118,"C"],[266,32,"D"]],wallTyp:'rect',animQ:false},{id:'pulse',pts:[[21,57,"A"],[316,80,"B"],[90,118,"C"],[266,32,"D"]],wallTyp:'rect',animQ:true},{id:'walls',pts:[[21,57,"A"],[316,80,"B"],[90,118,"C"],[266,32,"D"]],wallTyp:'ellipse',animQ:true},{id:'ellipse',pts:[[80,140,"F"],[300,140,"G"]],wallTyp:'ellipse',animQ:true},];var modeNo=0
for(var i=0;i<my.modes.length;i++){if(my.modes[i].id==my.mode){modeNo=i
break}}
my.mode=my.modes[modeNo];console.log("my.mode",my.mode);w=360;h=300;var s='';s+='<div id="main" style="position:relative; width:'+w+'px; min-height:'+h+'px; background-color: white; margin:auto; display:block; border: 1px solid black; border-radius: 10px;">';s+='<canvas id="canvas1" style="position: absolute; width:'+w+'px; height:'+w+'px; left: 0px; top: 0px; border: none;"></canvas>';s+='<div style="position:absolute; left:5px; top:5px;">'
s+='<div style="display: inline-block; font:15px Arial; text-align: right; margin-right:5px;">Segments:</div>'
s+='<input type="range" id="r1"  value="6" min="2" max="10" step="0.1"  style="z-index:2; width:170px; height:10px; border: none; " autocomplete="off" oninput="onSegChg(0,this.value)" onchange="onSegChg(1,this.value)" />';s+='<div id="seg" style="display: inline-block; width:50px; font: 18px Arial; color: #6600cc; text-align: left;">2</div>';s+='</div>'
if(my.mode.animQ){s+='<div style="position:absolute; right:5px; top:5px;">'
s+=playHTML(36)
s+='</div>'}
s+='<div id="copyrt" style="font: 10px Arial; font-weight: bold; color: #6600cc; position:absolute; bottom:5px; left:5px; text-align:center;">&copy; 2018 MathsIsFun.com  v'+my.version+'</div>';s+='</div>';document.write(s);el=document.getElementById('canvas1');ratio=3;el.width=w*ratio;el.height=h*ratio;el.style.width=w+"px";el.style.height=h+"px";g=el.getContext("2d");g.setTransform(ratio,0,0,ratio,0,0);my.clrs=[["Blue",'#0000FF'],["Red",'#FF0000'],["Black",'#000000'],["Green",'#00cc00'],["Orange",'#FFA500'],["Slate Blue",'#6A5ACD'],["Lime",'#00FF00'],["Spring Green",'#00FF7F'],["Teal",'#008080'],["Gold",'#ffd700'],["Med Purple",'#aa00aa'],["Light Blue",'#ADD8E6'],["Navy",'#000080'],["Purple",'#800080'],["Dark SeaGreen",'#8FBC8F']];my.clrNum=0;el.addEventListener("mousedown",onMouseDown,false);el.addEventListener('touchstart',onTouchStart,false);el.addEventListener("mousemove",doPointer,false);my.playQ=false
my.frameNo=0
my.skipNo=0
my.skipMax=3
dragIndex=0;dots=[];dragging=false;my.dotRad=10
my.rayLen=6
my.rayMax=8
makeDots()
my.segs=4
onSegChg(0,6)}
function onSegChg(n,v){v=Number(v);my.segs=Math.round(v*v*v/2)
console.log("onSegChg="+n,v,my.segs);update()
document.getElementById('seg').innerHTML=my.segs;}
function raysMake(){my.rays=[]
for(var i=0;i<my.rayMax;i++){var sttPt=new Pt(dots[0].x,dots[0].y)
var ang=0.2+i*(2*Math.PI/my.rayMax)
var x=5*Math.cos(ang)
var y=5*Math.sin(ang)
var endPt=new Pt(sttPt.x+x,sttPt.y+y)
var ray=new Line(sttPt,endPt)
my.rays.push(ray)}}
function wallsMake(wallTyp){var walls=[]
if(wallTyp=='rect'){var walldata=[[[20,40],[300,40]],[[20,140],[300,140]],[[20,40],[20,140]],[[300,40],[300,140]],]
for(var i=0;i<walldata.length;i++){var wall=walldata[i]
var line=new Line(new Pt(wall[0][0],wall[0][1]),new Pt(wall[1][0],wall[1][1]))
walls.push(line)}}
return walls}
function drawWall(ln){g.lineWidth=2
g.strokeStyle='hsla(240,100%,30%,1)'
g.beginPath()
g.moveTo(ln.a.x,ln.a.y)
g.lineTo(ln.b.x,ln.b.y)
g.stroke()
g.lineWidth=1}
function doBounce(bm){var ip=null
var hitWall=null
for(var i=0;i<my.walls.length;i++){var wall=my.walls[i]
ip=wall.getIntersection(bm,true)
if(ip!=null){hitWall=wall
break}}
if(ip==null){g.strokeStyle='blue'
g.beginPath()
g.moveTo(bm.a.x,bm.a.y)
g.lineTo(bm.b.x,bm.b.y)
g.stroke()
return bm}else{g.strokeStyle='blue'
g.beginPath()
g.moveTo(bm.a.x,bm.a.y)
g.lineTo(ip.x,ip.y)
g.stroke()
g.fillStyle='gold'
g.beginPath()
g.arc(ip.x,ip.y,6,0,2*Math.PI)
g.fill()
var r2=reflect(hitWall,bm,ip)
var ray1=new Line(new Pt(bm.a.x,bm.a.y),ip)
var ray2=new Line(ip,r2)
var ip2=null
var hitWall2=null
for(i=0;i<my.walls.length;i++){var wall2=my.walls[i]
if(wall2!=hitWall){ip2=my.walls[i].getIntersection(ray2,true)
if(ip2!=null){hitWall2=wall2
break}}}
if(hitWall2!=null){g.fillStyle='red'
g.beginPath()
g.arc(ip2.x,ip2.y,3,0,2*Math.PI)
g.fill()
var r3=reflect(hitWall2,ray2,ip2)
var ray2=new Line(ip,ip2)
var ray3=new Line(ip2,r3)
console.log('*********************** second bounce',ray1.fmt(),ray2.fmt(),ray3.fmt())
g.strokeStyle='blue'
g.beginPath()
g.moveTo(ip.x,ip.y)
g.lineTo(ip2.x,ip2.y)
g.lineTo(r3.x,r3.y)
g.stroke()
var ray=new Line(new Pt(ip2.x,ip2.y),new Pt(r3.x,r3.y))
console.log('*********************** ray = ',ray.fmt())
return ray}else{g.strokeStyle='blue'
g.beginPath()
g.moveTo(ip.x,ip.y)
g.lineTo(r2.x,r2.y)
g.stroke()
return new Line(new Pt(ip.x,ip.y),new Pt(r2.x,r2.y))}
return ray2}
return null}
function reflect(ln,bm,iPt){var lnAng=Math.atan2(ln.b.y-ln.a.y,ln.b.x-ln.a.x)
var r1=new Pt(bm.a.x-iPt.x,bm.a.y-iPt.y)
var l1=new Pt(ln.a.x-iPt.x,ln.a.y-iPt.y)
l1.rotateMe(lnAng)
r1.rotateMe(lnAng)
var b1Len=dist(r1.x,r1.y)
var r2=new Pt(-r1.x,r1.y)
r2.rotateMe(-lnAng)
var b2Len=dist(iPt.x-bm.b.x,iPt.y-bm.b.y)
var fact=b2Len/b1Len
if(fact>1e10){r2.x=r1.x
r2.y=r1.y}else{r2.x*=fact
r2.y*=fact}
r2.x+=iPt.x
r2.y+=iPt.y
return r2}
function deg(rad){return rad*180.0/Math.PI}
function anim(){if(my.playQ){my.skipNo++
if(my.skipNo>my.skipMax){my.skipNo=0
for(var i=0;i<my.rayMax;i++){var ray=my.rays[i]
var stt={x:ray.b.x,y:ray.b.y}
ray.b.x=ray.b.x+(ray.b.x-ray.a.x)
ray.b.y=ray.b.y+(ray.b.y-ray.a.y)
ray.a.x=stt.x
ray.a.y=stt.y
ray.setLen(my.rayLen,false)
my.rays[i]=ray}
g.clearRect(0,0,g.canvas.width,g.canvas.height)
for(var i=0;i<my.walls.length;i++){var wall=my.walls[i]
drawWall(wall)}
g.fillStyle='black'
g.beginPath()
g.arc(dots[0].x,dots[0].y,3,0,2*Math.PI)
g.fill();g.beginPath()
g.arc(dots[1].x,dots[1].y,3,0,2*Math.PI)
g.fill();if(my.mode.id=='walls'||my.mode.id=='ellipse'){for(var i=0;i<my.rayMax;i++){my.rays[i]=doBounce(my.rays[i])}}}
if(my.frameNo++<1e6)requestAnimationFrame(anim);}}
function update(){g.clearRect(0,0,g.canvas.width,g.canvas.height)
updateFoci()
raysMake()
for(var i=0;i<my.walls.length;i++){var wall=my.walls[i]
drawWall(wall)}
drawDots()}
function updateFoci(){var d0=dots[0];var d1=dots[1];var majorRadius=140;var lineQ=true;if(dist(d0.x-d1.x,d0.y-d1.y)>majorRadius*2){lineQ=false;my.walls=[]
return;}
var isCircQ=false;if(dist(d0.x-d1.x,d0.y-d1.y)<2){console.log("update: make d0 and d1 very close to simulate circle without problems of divide by zero etc");d0.x=d1.x+0.1;d0.y=d1.y+0.1;isCircQ=true;}
var ln=new Line(d0,d1);var distFoci=ln.getDist();ln.setLen(2000);g.strokeStyle='blue';if(!isCircQ){}
var mPt=new Pt();mPt.setAvg([d0,d1]);var minorRadius=Math.sqrt(Math.pow(majorRadius,2)-Math.pow(distFoci/2,2));var pts=getArcPts(mPt.x,mPt.y,majorRadius,minorRadius,0,Math.PI*2,my.segs);pts=rotatePts(pts,mPt.x,mPt.y,-ln.getAngle());my.walls=[]
for(var i=0;i<pts.length;i++){var i1=loop(i,0,pts.length-1,1)
var line=new Line(pts[i],pts[i1])
my.walls.push(line)}}
function makeDots(){var i;dots=[];for(i=0;i<my.mode.pts.length;i++){var pt=my.mode.pts[i]
dots.push(new Pt(pt[0],pt[1],pt[2]))}}
function drawDots(){var i;g.strokeStyle='#aaaaaa'
g.lineWidth=1
for(i=0;i<dots.length;i++){g.fillStyle="rgba(0, 0, 255, 0.2)";g.beginPath();g.arc(dots[i].x,dots[i].y,my.dotRad,0,2*Math.PI,false);g.closePath();g.fill();g.fillStyle="rgba(0, 0, 0, 0.8)";g.beginPath();g.arc(dots[i].x,dots[i].y,2,0,2*Math.PI,false);g.closePath();g.fill();g.font="14px Arial";g.textAlign='left'
g.fillText(dots[i].name,dots[i].x+5,dots[i].y-5,100);}}
function playToggle(){var btn='playBtn';if(my.playQ){my.playQ=false;document.getElementById(btn).classList.add("play");document.getElementById(btn).classList.remove("pause");update()}else{my.playQ=true;my.frameNo=0
my.skipNo=my.skipMax-20
document.getElementById(btn).classList.add("pause");document.getElementById(btn).classList.remove("play");anim();}}
function playHTML(w){var s='';s+='<style type="text/css">';s+='.btn {display: inline-block; position: relative; width:'+w+'px; height:'+w+'px; margin-right:'+w*0.2+'px; padding: .6em; border: 0 solid rgba(208,208,248,1); border-radius: 10em; background: linear-gradient(#fff, #ccf), #c9c5c9; box-shadow: 0 3 4 rgba(0,0,0,.4); }';s+='.btn:hover {background: linear-gradient(#f5f5f5, #b9b9b9), #c9c5c9; }';s+='.btn:before, button:after {content: " "; position: absolute; }';s+='.btn:active {top:'+w*0.05+'px; box-shadow: 0 '+w*0.02+'px '+w*0.03+'px rgba(0,0,0,.4); }';s+='.play:before {  left: '+w*0.36+'px; top: '+w*0.22+'px; width: 0; height: 0; border: '+w*0.3+'px solid transparent; border-left-width: '+w*0.4+'px; border-left-color: blue;  }';s+='.play:hover:before {border-left-color: yellow; }';s+='.pause:before, .pause:after {display: block; left: '+w*0.29+'px; top: '+w*0.28+'px; width: '+w*0.19+'px; height: '+w*0.47+'px; background-color: blue; }';s+='.pause:after {left: '+w*0.54+'px; }';s+='.pause:hover:before, .pause:hover:after {background-color: yellow; }';s+='</style>';s+='<button id="playBtn" class="btn play" onclick="playToggle()" ></button>';return s;}
function onTouchStart(evt){var touch=evt.targetTouches[0];evt.clientX=touch.clientX;evt.clientY=touch.clientY;evt.touchQ=true;onMouseDown(evt)}
function onTouchMove(evt){var touch=evt.targetTouches[0];evt.clientX=touch.clientX;evt.clientY=touch.clientY;evt.touchQ=true;onMouseMove(evt);evt.preventDefault();}
function onTouchEnd(){el.addEventListener('touchstart',onTouchStart,false);window.removeEventListener("touchend",onTouchEnd,false);if(dragging){dragging=false;window.removeEventListener("touchmove",onTouchMove,false);}}
function doPointer(e){if(my.playQ)return
var bRect=el.getBoundingClientRect();var mouseX=(e.clientX-bRect.left)*(el.width/ratio/bRect.width);var mouseY=(e.clientY-bRect.top)*(el.height/ratio/bRect.height);var inQ=false;for(var i=0;i<dots.length;i++){if(hitTest(dots[i],mouseX,mouseY)){inQ=true;}}
if(inQ){document.body.style.cursor="pointer";}else{document.body.style.cursor="default";}}
function onMouseDown(evt){if(my.playQ)return
var i;var highestIndex=-1;var bRect=el.getBoundingClientRect();var mouseX=(evt.clientX-bRect.left)*(el.width/ratio/bRect.width);var mouseY=(evt.clientY-bRect.top)*(el.height/ratio/bRect.height);for(i=0;i<dots.length;i++){if(hitTest(dots[i],mouseX,mouseY)){dragging=true;if(i>highestIndex){dragHoldX=mouseX-dots[i].x;dragHoldY=mouseY-dots[i].y;highestIndex=i;dragIndex=i;}}}
if(dragging){if(evt.touchQ){window.addEventListener('touchmove',onTouchMove,false);}else{window.addEventListener("mousemove",onMouseMove,false);}}
if(evt.touchQ){el.removeEventListener("touchstart",onTouchStart,false);window.addEventListener("touchend",onTouchEnd,false);}else{el.removeEventListener("mousedown",onMouseDown,false);window.addEventListener("mouseup",onMouseUp,false);}
if(evt.preventDefault){evt.preventDefault();}
else if(evt.returnValue){evt.returnValue=false;}
return false;}
function onMouseUp(){if(my.playQ)return
el.addEventListener("mousedown",onMouseDown,false);window.removeEventListener("mouseup",onMouseUp,false);if(dragging){dragging=false;window.removeEventListener("mousemove",onMouseMove,false);}}
function onMouseMove(evt){if(my.playQ)return
var posX;var posY;var minX=my.dotRad;var maxX=el.width-my.dotRad;var minY=my.dotRad;var maxY=el.height-my.dotRad;var bRect=el.getBoundingClientRect();var mouseX=(evt.clientX-bRect.left)*(el.width/ratio/bRect.width);var mouseY=(evt.clientY-bRect.top)*(el.height/ratio/bRect.height);posX=mouseX-dragHoldX;posX=(posX<minX)?minX:((posX>maxX)?maxX:posX);posY=mouseY-dragHoldY;posY=(posY<minY)?minY:((posY>maxY)?maxY:posY);if(dragging){dots[dragIndex].x=posX;dots[dragIndex].y=posY;}
update();}
function hitTest(shape,x,y){var dx;var dy;dx=x-shape.x;dy=y-shape.y;return(dx*dx+dy*dy<my.dotRad*my.dotRad);}
function getArcPts(midX,midY,radiusX,radiusY,fromAngle,toAngle,segN){var points=[];if(isNear(fromAngle,toAngle,0.0001)){return points;}
if(radiusX!=radiusY){fromAngle=Math.atan2(Math.sin(fromAngle)*radiusX/radiusY,Math.cos(fromAngle));toAngle=Math.atan2(Math.sin(toAngle)*radiusX/radiusY,Math.cos(toAngle));}
if(fromAngle>toAngle){while(fromAngle>toAngle){fromAngle-=2*Math.PI;}}
var steps=segN;for(var i=0;i<=steps;i++){var radians=fromAngle+(toAngle-fromAngle)*(i/steps);var thisX=midX+(Math.cos(radians)*radiusX);var thisY=midY-(Math.sin(radians)*radiusY);points.push(new Pt(thisX,thisY));}
return points;}
function rotatePts(pts,midX,midY,rot){var newPts=[];for(var i=0;i<pts.length;i++){var pt=pts[i];newPts.push(pt.add(-midX,-midY).rotate(rot).add(midX,midY));}
return newPts;}
function isNear(checkVal,centralVal,limitVal){if(checkVal<centralVal-limitVal)
return false;if(checkVal>centralVal+limitVal)
return false;return true;}
function Line(pt1,pt2){this.a=pt1;this.b=pt2;}
Line.prototype.getIntersection=function(ln,asSegmentsQ){var A=this.a;var B=this.b;var E=ln.a;var F=ln.b;var a1=B.y-A.y;var b1=A.x-B.x;var c1=B.x*A.y-A.x*B.y;var a2=F.y-E.y;var b2=E.x-F.x;var c2=F.x*E.y-E.x*F.y;var denom=a1*b2-a2*b1;if(denom==0){return null;}
var ip={x:(b1*c2-b2*c1)/denom,y:(a2*c1-a1*c2)/denom}
if(asSegmentsQ){if(Math.pow(ip.x-B.x,2)+Math.pow(ip.y-B.y,2)>Math.pow(A.x-B.x,2)+Math.pow(A.y-B.y,2)){return null;}
if(Math.pow(ip.x-A.x,2)+Math.pow(ip.y-A.y,2)>Math.pow(A.x-B.x,2)+Math.pow(A.y-B.y,2)){return null;}
if(Math.pow(ip.x-F.x,2)+Math.pow(ip.y-F.y,2)>Math.pow(E.x-F.x,2)+Math.pow(E.y-F.y,2)){return null;}
if(Math.pow(ip.x-E.x,2)+Math.pow(ip.y-E.y,2)>Math.pow(E.x-F.x,2)+Math.pow(E.y-F.y,2)){return null;}}
return ip;}
Line.prototype.rotatePtMe=function(pt,angle){this.a.x-=pt.x;this.a.y-=pt.y;this.b.x-=pt.x;this.b.y-=pt.y;this.a.rotateMe(angle);this.b.rotateMe(angle);this.a.x+=pt.x;this.a.y+=pt.y;this.b.x+=pt.x;this.b.y+=pt.y;}
Line.prototype.getDist=function(){return dist(this.b.x-this.a.x,this.b.y-this.a.y);}
Line.prototype.getMidPt=function(){return new Pt((this.a.x+this.b.x)/2,(this.a.y+this.b.y)/2);}
Line.prototype.setLen=function(newLen,fromMidQ){fromMidQ=typeof fromMidQ!=='undefined'?fromMidQ:true;var len=this.getLength();if(fromMidQ){var midPt=this.getMidPt();var halfPt=new Pt(this.a.x-midPt.x,this.a.y-midPt.y);halfPt.multiplyMe(newLen/len);this.a=midPt.translate(halfPt);this.b=midPt.translate(halfPt,false);}else{var diffPt=new Pt(this.a.x-this.b.x,this.a.y-this.b.y);diffPt.multiplyMe(newLen/len);this.b=this.a.translate(diffPt,false);}}
Line.prototype.getLength=function(){var dx=this.b.x-this.a.x;var dy=this.b.y-this.a.y;return Math.sqrt(dx*dx+dy*dy)}
Line.prototype.getAngle=function(){return Math.atan2(this.b.y-this.a.y,this.b.x-this.a.x);}
Line.prototype.fmt=function(){return '('+round1(this.a.x)+','+round1(this.a.y)+')=>('+round1(this.b.x)+','+round1(this.b.y)+')['+round2(this.getLength())+']'}
function round1(x){return Math.round(x*10)/10}
function round2(x){return Math.round(x*100)/100}
function Pt(x,y,name){this.x=x
this.y=y
this.name=typeof name!=='undefined'?name:''}
Pt.prototype.add=function(dx,dy){return new Pt(this.x+dx,this.y+dy);}
Pt.prototype.rotate=function(angle){var cosa=Math.cos(angle);var sina=Math.sin(angle);var xPos=this.x*cosa+this.y*sina;var yPos=-this.x*sina+this.y*cosa;return new Pt(xPos,yPos);}
Pt.prototype.rotateMe=function(angle){var t=new Pt(this.x,this.y).rotate(angle);this.x=t.x;this.y=t.y;}
Pt.prototype.getAvg=function(pts){var xSum=0;var ySum=0;for(var i=0;i<pts.length;i++){xSum+=pts[i].x;ySum+=pts[i].y;}
var newPt=new Pt(xSum/pts.length,ySum/pts.length);newPt.x=xSum/pts.length;newPt.y=ySum/pts.length;return newPt;}
Pt.prototype.setAvg=function(pts){var newPt=this.getAvg(pts);this.x=newPt.x;this.y=newPt.y;}
Pt.prototype.multiplyMe=function(fact){this.x*=fact;this.y*=fact;}
Pt.prototype.translateMe=function(pt,addQ){addQ=typeof addQ!=='undefined'?addQ:true;if(addQ){this.x+=pt.x;this.y+=pt.y}else{this.x-=pt.x;this.y-=pt.y}}
Pt.prototype.translate=function(pt,addQ){addQ=typeof addQ!=='undefined'?addQ:true;var t=new Pt(this.x,this.y);t.x=this.x;t.y=this.y;if(addQ){t.x+=pt.x;t.y+=pt.y;}else{t.x-=pt.x;t.y-=pt.y;}
return t;}
function dist(dx,dy){return(Math.sqrt(dx*dx+dy*dy));}
function loop(currNo,minNo,maxNo,incr){currNo+=incr;var range=maxNo-minNo+1;if(currNo<minNo){currNo=maxNo-(-currNo+maxNo)%range;}
if(currNo>maxNo){currNo=minNo+(currNo-minNo)%range;}
return currNo;}