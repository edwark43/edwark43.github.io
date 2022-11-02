var my={};function crossprodMain(typ){my.version='0.77';my.typ=typeof typ!=='undefined'?typ:'triangle';w=240;h=240;var s="";s+='<div style="position:relative; width:'+w+'px; min-height:'+h+'px; border: none; border-radius: 20px; background-color: #eeeeff; margin:auto; display:block;">';s+='<canvas id="canvasId" style="position: absolute; width:'+w+'px; height:'+h+'px; left: 0; top:; border: none;"></canvas>';s+='<div style="position:absolute; right:15px; top:8px;">';s+=getPlayHTML(40);s+='</div>';s+='<div id="copyrt" style="position: absolute; right:0px; top:40px; font: 10px Arial; color: #6600cc; transform: rotate(-90deg); transform-origin: right bottom 0;">&copy; 2018 MathsIsFun.com  v'+my.version+'</div>';s+='</div>';document.write(s);el=document.getElementById('canvasId');ratio=2;el.width=w*ratio;el.height=h*ratio;el.style.width=w+"px";el.style.height=h+"px";g=el.getContext("2d");g.setTransform(ratio,0,0,ratio,0,0);my.frame=0;my.skip=0
my.midPt=new Pt(w/2,h/2);my.wd=100
my.rotPts=getArcPts(0,0,1,1,0,Math.PI*2);my.ellPts=[]
for(var i=0;i<my.rotPts.length;i++){my.rotPts[i].y=my.rotPts[i].y*0.4
my.ellPts.push({x:my.rotPts[i].x*90+my.midPt.x,y:my.rotPts[i].y*90+my.midPt.y})}
console.log('my.rotPts',my.ellPts)
my.rotZeroPt=my.rotPts[0];my.pts=[{x:my.midPt.x,y:my.midPt.y},{x:my.midPt.x+90,y:my.midPt.y}];my.fillStyle='rgba(0,125,125,0.02)';playQ=false;togglePlay()}
function getPlayHTML(w){var s='';s+='<style type="text/css">';s+='.btn {display: inline-block; position: relative; width:'+w+'px; height:'+w+'px; margin-right:'+w*0.2+'px; padding: .6em; border: 0 solid rgba(208,208,248,1); border-radius: 10em; background: linear-gradient(#fff, #ccf), #c9c5c9; box-shadow: 0 3 4 rgba(0,0,0,.4); }';s+='.btn:hover {background: linear-gradient(#f5f5f5, #b9b9b9), #c9c5c9; }';s+='.btn:before, button:after {content: " "; position: absolute; }';s+='.btn:active {top:'+w*0.05+'px; box-shadow: 0 '+w*0.02+'px '+w*0.03+'px rgba(0,0,0,.4); }';s+='.play:before {  left: '+w*0.36+'px; top: '+w*0.22+'px; width: 0; height: 0; border: '+w*0.3+'px solid transparent; border-left-width: '+w*0.4+'px; border-left-color: blue;  }';s+='.play:hover:before {border-left-color: yellow; }';s+='.pause:before, .pause:after {display: block; left: '+w*0.29+'px; top: '+w*0.28+'px; width: '+w*0.19+'px; height: '+w*0.47+'px; background-color: blue; }';s+='.pause:after {left: '+w*0.54+'px; }';s+='.pause:hover:before, .pause:hover:after {background-color: yellow; }';s+='</style>';s+='<button id="playBtn" class="btn play" onclick="togglePlay()" ></button>';return s;}
function togglePlay(){var btn='playBtn';if(playQ){playQ=false;document.getElementById(btn).classList.add("play");document.getElementById(btn).classList.remove("pause");}else{playQ=true;document.getElementById(btn).classList.add("pause");document.getElementById(btn).classList.remove("play");animate();}}
function animate(){g.fillStyle='white'
g.fillRect(0,0,el.width,el.height);my.skip=(++my.skip)%2;if(my.skip==0)
my.frame=(++my.frame)%my.rotPts.length;var ptNo=my.frame;var rotPt=my.rotPts[ptNo];var aboveQ=my.frame*2>my.rotPts.length
if(aboveQ)drawCrossProd()
g.strokeStyle='hsla(50,50%,70%,1)'
g.fillStyle='hsla(50,50%,90%,0.7)'
g.beginPath();drawPts(g,my.ellPts,true)
g.stroke()
g.fill()
g.strokeStyle='black'
g.lineJoin='round';g.lineWidth=2;g.beginPath();var pt0=trans(my.pts[0],my.rotZeroPt)
g.moveTo(pt0.x,pt0.y)
var pt1=trans(my.pts[1],my.rotZeroPt)
g.lineTo(pt1.x,pt1.y)
g.stroke();doArrow(pt0,pt1,true)
g.font='bold 18px arial'
g.fillText('a',(pt0.x+pt1.x)/2,(pt0.y+pt1.y)/2)
g.strokeStyle='black'
g.beginPath();var pt0=trans(my.pts[0],rotPt)
g.moveTo(pt0.x,pt0.y)
var pt1=trans(my.pts[1],rotPt)
g.lineTo(pt1.x,pt1.y)
g.stroke();doArrow(pt0,pt1,true)
g.fillText('b',(pt0.x+pt1.x)/2,(pt0.y+pt1.y)/2)
if(!aboveQ)drawCrossProd()
if(playQ)requestAnimationFrame(animate);}
function drawCrossProd(){var rot=my.frame/my.rotPts.length;var rot1=Math.sin(rot*2*Math.PI)
var topPt={x:my.midPt.x,y:my.midPt.y-100*rot1}
g.strokeStyle='blue';g.lineWidth=3;g.beginPath();g.moveTo(my.midPt.x,my.midPt.y);g.lineTo(topPt.x,topPt.y);g.stroke();doArrow(my.midPt,topPt,false)}
function doArrow(frPt,toPt,flatQ){var len=Math.sqrt(Math.pow(toPt.x-frPt.x,2)+Math.pow(toPt.y-frPt.y,2))
if(len>1){var headLen=20
var shaftHt=15
if(flatQ){headLen=20*len/100
shaftHt=headLen*0.75}else{if(len<10){}}
g.beginPath()
var ang=Math.atan2(toPt.y-frPt.y,toPt.x-frPt.x)
g.drawArrow(toPt.x,toPt.y,shaftHt,2,headLen,10,-ang)
g.stroke()
g.fillStyle=g.strokeStyle
g.fill()}}
function trans(pt,rotPt){var x=my.midPt.x+(pt.x-my.midPt.x)*rotPt.x
var y=(my.midPt.y-20)*rotPt.y
var dx=pt.x-my.midPt.x;x=pt.x+dx*(rotPt.x-1)
y=pt.y+dx*rotPt.y
return{x:x,y:y}}
function getArcPts(midX,midY,radiusX,radiusY,fromAngle,toAngle){var points=[];if(isNear(fromAngle,toAngle,0.0001)){return points;}
if(radiusX!=radiusY){fromAngle=Math.atan2(Math.sin(fromAngle)*radiusX/radiusY,Math.cos(fromAngle));toAngle=Math.atan2(Math.sin(toAngle)*radiusX/radiusY,Math.cos(toAngle));}
if(fromAngle>toAngle){while(fromAngle>toAngle){fromAngle-=2*Math.PI;}}
var steps=Math.max(1,parseInt((toAngle-fromAngle)*28));for(var i=0;i<=steps;i++){var radians=fromAngle+(toAngle-fromAngle)*(i/steps);var thisX=midX+(Math.cos(radians)*radiusX);var thisY=midY-(Math.sin(radians)*radiusY);points.push(new Pt(thisX,thisY));}
return points;}
function rotatePts(pts,midX,midY,rot){var newPts=[];for(var i=0;i<pts.length;i++){var pt=pts[i];newPts.push(pt.add(-midX,-midY).rotate(rot).add(midX,midY));}
return newPts;}
function drawPts(g,pts,closeQ){closeQ=typeof closeQ!=='undefined'?closeQ:false;for(var i=0;i<pts.length;i++){if(i==0){g.moveTo(pts[i].x,pts[i].y);}else{g.lineTo(pts[i].x,pts[i].y);}}
if(closeQ){g.lineTo(pts[0].x,pts[0].y);}}
function isNear(checkVal,centralVal,limitVal){if(checkVal<centralVal-limitVal)
return false;if(checkVal>centralVal+limitVal)
return false;return true;}
function Pt(ix,iy){this.x=ix;this.y=iy;this.name="?";this.rad=12;angleIn=0;angleOut=0;}
Pt.prototype.add=function(dx,dy){return new Pt(this.x+dx,this.y+dy);};Pt.prototype.rotate=function(angle){var cosa=Math.cos(angle);var sina=Math.sin(angle);var xPos=this.x*cosa+this.y*sina;var yPos=-this.x*sina+this.y*cosa;return new Pt(xPos,yPos);}
CanvasRenderingContext2D.prototype.drawArrow=function(x0,y0,totLen,shaftHt,headLen,headHt,angle,sweep,invertQ){var g=this;var pts=[[0,0],[-headLen,-headHt/2],[-headLen+sweep,-shaftHt/2],[-totLen,-shaftHt/2],[-totLen,shaftHt/2],[-headLen+sweep,shaftHt/2],[-headLen,headHt/2],[0,0]];if(invertQ){pts.push([0,-headHt/2],[-totLen,-headHt/2],[-totLen,headHt/2],[0,headHt/2]);}
for(var i=0;i<pts.length;i++){var cosa=Math.cos(-angle);var sina=Math.sin(-angle);var xPos=pts[i][0]*cosa+pts[i][1]*sina;var yPos=pts[i][0]*sina-pts[i][1]*cosa;if(i==0){g.moveTo(x0+xPos,y0+yPos);}else{g.lineTo(x0+xPos,y0+yPos);}}};