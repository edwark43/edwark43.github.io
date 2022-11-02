var w,h,g,el,ratio,dragN,my={};function geomtriangleMain(imode){var version='0.912';my.mode=typeof imode!=='undefined'?imode:'type';var modes=['type','median','circum','incircle','ortho','area','perim','inequal','angles','choose']
w=360;h=280;var canvasid="canvas"+my.mode;my.titleid="title"+my.mode;my.infoid="info"+my.mode;my.anglesQ=true
var s='';s+='<style>'
s+='.btn { display: inline-block; position: relative; text-align: center; margin: 2px; text-decoration: none; font: bold 14px/25px Arial, sans-serif; color: #268; border: 1px solid #88aaff; border-radius: 10px;cursor: pointer; background: linear-gradient(to top right, rgba(170,190,255,1) 0%, rgba(255,255,255,1) 100%); outline-style:none;}'
s+='.btn:hover { background: linear-gradient(to top, rgba(255,255,0,1) 0%, rgba(255,255,255,1) 100%); }'
s+='.yy { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(255,220,130,1) 0%, rgba(255,255,255,1) 100%);  }'
s+='.hi { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(130,220,255,1) 0%, rgba(255,255,255,1) 100%); box-shadow: 2px 2px 6px #66a; }'
s+='.lo { border: solid 1px #888888; background: linear-gradient(to top, rgba(170,170,170,1) 0%, rgba(205,205,205,1) 100%);  }'
s+='</style>'
s+='<div style="position:relative; width:'+w+'px; height:'+h+'px; border: 1px solid blue; border-radius: 9px; margin:auto; display:block; ">';s+='<canvas id="'+canvasid+'" width="360" height="280" style="z-index:1;"></canvas>';s+='<div id="'+my.titleid+'" style="font: 12pt arial; font-weight: bold; position:absolute; top:10px; left:0px; width:360px; text-align:center; pointer-events: none;"></div>';s+='<div id="'+my.infoid+'" style="font: 10pt arial; font-weight: bold; color: #6600cc; position:absolute; top:31px; left:0px; width:360px; text-align:center; pointer-events: none;"></div>';s+='<button id="resetBtn" onclick="reset()" style="z-index:2; position:absolute; right:3px; bottom:3px;" class="btn" >Reset</button>';s+='<div id="copyrt" style="position:absolute; left:3px; bottom:3px; font: 10px Arial; color: blue; ">&copy; 2020 MathsIsFun.com  v'+version+'</div>';s+='</div>';document.write(s);el=document.getElementById(canvasid);ratio=2;el.width=w*ratio;el.height=h*ratio;el.style.width=w+"px";el.style.height=h+"px";g=el.getContext("2d");g.setTransform(ratio,0,0,ratio,0,0);dragging=false;dragN=0;numShapes=3;shapes=[];tri=new Triangle();tri.setAllKnown(false);tri.setLabels("","","","","","");switch(my.mode){case "acute":case "equi":case "iso":case "obtuse":case "right":typ=mode;mode="type";break;default:typ="type";}
makeShapes();drawShapes();el.addEventListener("mousedown",onMouseDown,false);el.addEventListener('touchstart',ontouchstart,false);el.addEventListener("mousemove",dopointer,false);}
function update(){drawShapes();}
function toggleAngles(){my.anglesQ=!my.anglesQ;toggleBtn("anglesBtn",my.anglesQ);update();}
function toggleSides(){my.sidesQ=!my.sidesQ;toggleBtn("sidesBtn",my.sidesQ);update();}
function toggleBtn(btn,onq){if(onq){document.getElementById(btn).classList.add("hi");document.getElementById(btn).classList.remove("lo");}else{document.getElementById(btn).classList.add("lo");document.getElementById(btn).classList.remove("hi");}}
function reset(){makeShapes();update();}
function ontouchstart(evt){var touch=evt.targetTouches[0];evt.clientX=touch.clientX;evt.clientY=touch.clientY;evt.touchQ=true;onMouseDown(evt)}
function ontouchmove(evt){var touch=evt.targetTouches[0];evt.clientX=touch.clientX;evt.clientY=touch.clientY;evt.touchQ=true;onMouseMove(evt);evt.preventDefault();}
function ontouchend(){el.addEventListener('touchstart',ontouchstart,false);window.removeEventListener("touchend",ontouchend,false);if(dragging){dragging=false;window.removeEventListener("touchmove",ontouchmove,false);}}
function dopointer(evt){var bRect=el.getBoundingClientRect();var mouseX=(evt.clientX-bRect.left)*(el.width/ratio/bRect.width);var mouseY=(evt.clientY-bRect.top)*(el.height/ratio/bRect.height);var inQ=false;for(var i=0;i<numShapes;i++){if(hitTest(shapes[i],mouseX,mouseY)){inQ=true;}}
if(inQ){document.body.style.cursor="pointer";}else{document.body.style.cursor="default";}}
function onMouseDown(evt){var i;var highestIndex=-1;var bRect=el.getBoundingClientRect();var mouseX=(evt.clientX-bRect.left)*(el.width/ratio/bRect.width);var mouseY=(evt.clientY-bRect.top)*(el.height/ratio/bRect.height);for(i=0;i<numShapes;i++){if(hitTest(shapes[i],mouseX,mouseY)){dragging=true;if(i>highestIndex){dragHoldX=mouseX-shapes[i].x;dragHoldY=mouseY-shapes[i].y;highestIndex=i;dragN=i;}}}
if(dragging){if(evt.touchQ){window.addEventListener('touchmove',ontouchmove,false);}else{window.addEventListener("mousemove",onMouseMove,false);}}
if(evt.touchQ){el.removeEventListener("touchstart",ontouchstart,false);window.addEventListener("touchend",ontouchend,false);}else{el.removeEventListener("mousedown",onMouseDown,false);window.addEventListener("mouseup",onMouseUp,false);}
if(evt.preventDefault){evt.preventDefault();}
else if(evt.returnValue){evt.returnValue=false;}
return false;}
function onMouseUp(){el.addEventListener("mousedown",onMouseDown,false);window.removeEventListener("mouseup",onMouseUp,false);if(dragging){dragging=false;window.removeEventListener("mousemove",onMouseMove,false);}}
function onMouseMove(evt){var posX;var posY;var shapeRad=shapes[dragN].rad;var minX=shapeRad;var maxX=el.width-shapeRad;var minY=shapeRad;var maxY=el.height-shapeRad;var bRect=el.getBoundingClientRect();var mouseX=(evt.clientX-bRect.left)*(el.width/ratio/bRect.width);var mouseY=(evt.clientY-bRect.top)*(el.height/ratio/bRect.height);posX=mouseX-dragHoldX;posX=(posX<minX)?minX:((posX>maxX)?maxX:posX);posY=mouseY-dragHoldY;posY=(posY<minY)?minY:((posY>maxY)?maxY:posY);shapes[dragN].x=posX;shapes[dragN].y=posY;update();}
function hitTest(shape,mx,my){var dx;var dy;dx=mx-shape.x;dy=my-shape.y;return(dx*dx+dy*dy<shape.rad*shape.rad);}
function makeShapes(){var i;var tempX;var tempY;var tempColor;var pos=[[250,90,"A"],[66,186,"B"],[263,234,"C"]];switch(typ){case "acute":pos=[[157,97,"A"],[85,196,"B"],[233,236,"C"]];break;case "equi":pos=[[195,88,"A"],[85,196,"B"],[233,236,"C"]];break;case "iso":pos=[[188,110,"A"],[85,196,"B"],[233,236,"C"]];break;case "obtuse":pos=[[77,95,"A"],[96,206,"B"],[247,221,"C"]];break;case "right":pos=[[104,82,"A"],[90,203,"B"],[247,221,"C"]];break;default:}
shapes=[];for(i=0;i<numShapes;i++){tempX=pos[i][0];tempY=pos[i][1];tempColor="rgb("+0+","+0+","+255+")";var tempShape={x:tempX,y:tempY,rad:9,color:tempColor};shapes.push(tempShape);}}
function drawShapes(){g.clearRect(0,0,g.canvas.width,g.canvas.height)
var i;g.beginPath();g.lineWidth=2;g.fillStyle="rgba(255, 255, 0, 0.1)";g.strokeStyle="rgba(136, 136, 204, 1)";g.moveTo(shapes[numShapes-1].x,shapes[numShapes-1].y);for(i=0;i<numShapes;i++){g.lineTo(shapes[i].x,shapes[i].y);}
g.fill();g.stroke();for(i=0;i<numShapes;i++){g.fillStyle="rgba(0, 0, 255, 0.3)";g.beginPath();g.arc(shapes[i].x,shapes[i].y,8,0,2*Math.PI,false);g.closePath();g.fill();g.fillStyle="rgba(0, 0, 0, 0.8)";g.beginPath();g.arc(shapes[i].x,shapes[i].y,2,0,2*Math.PI,false);g.closePath();g.fill();g.font="14px Arial";g.fillText(String.fromCharCode(65+i),shapes[i].x+5,shapes[i].y-5,100);tri.setxy(i,shapes[i].x,shapes[i].y);}
tri.updateMe();if(my.mode=='median'){var mid=drawMedians();drawDot(mid.x,mid.y);}
if(my.mode=='circum'){var mid=drawPerpBisectors();drawDot(mid.x,mid.y);var radLn=new Line(mid,new Pt(shapes[0].x,shapes[0].y));var r=radLn.getLength();g.beginPath();g.strokeStyle='orange';g.arc(mid.x,mid.y,r,0,2*Math.PI);g.stroke();}
if(my.mode=='incircle'){var mid=drawAngleBisectors();drawDot(mid.x,mid.y);radius=2*tri.getHeronArea()/tri.getPerimeter();g.beginPath();g.strokeStyle='orange';g.arc(mid.x,mid.y,radius,0,2*Math.PI);g.stroke();}
if(my.mode=='ortho'){var mid=drawOrthocenter();drawDot(mid.x,mid.y);}
if(my.mode=='area'){tri.setDec(1);tri.setKnown("a",true);var base=Number(tri.getUserStr("a"));var ht=tri.getAltitude(0);var s=''
if(ht<0.3||base<0.3){s="Is that a Triangle?";}else{s="Area = &frac12; &times; ";s+=base;s+=" &times; ";s+=ht;s+=" = ";s+=Math.round(0.5*base*ht*100)/100;}
tri.drawAltitude(g,0);tri.drawSides(g);document.getElementById(my.titleid).innerHTML=s;}
if(my.mode=='perim'){tri.drawSides(g);var s="Perimeter = ";var sum=0;for(i=0;i<numShapes;i++){var side=Math.round(tri.getVal(String.fromCharCode(97+i)));s+=side+" + ";sum+=side;}
s=s.substring(0,s.length-2);s+=" = "+sum;document.getElementById(my.titleid).innerHTML=s;}
if(my.mode=='inequal'){tri.drawSides(g);var len0=tri.userSide(0);var len1=tri.userSide(1);var len2=tri.userSide(2);var s="";if(len0>=Math.round(len1+len2)){}else{s+=len0.toString();s+="&nbsp; <i>is less than</i> &nbsp;";s+=len1.toString();s+=" + ";s+=len2.toString();s+=" = ";s+=Math.round(len1+len2).toString();}
document.getElementById(my.titleid).innerHTML=s;}
if(my.mode=='angles'){var angs=tri.getAngles()
tri.drawAngles(g);var s="";var okQ=true;for(i=0;i<numShapes;i++){if(angs[i]==180)okQ=false;s+=angs[i]+"&deg; + ";}
s=s.substring(0,s.length-2);s+=" = 180&deg;";if(!okQ)s='Is that a triangle?';document.getElementById(my.titleid).innerHTML=s;}
if(my.mode=='type'){var angs=tri.getAngles()
if(my.anglesQ)tri.drawAngles(g);if(my.sidesQ)tri.drawSides(g);var angleAbove90=false;var angle90=false;var angleSame=false;var angleEqual=-1;var angleAll60=true;var angleZero=false;for(i=0;i<3;i++){if(angs[i]==0)
angleZero=true;if(angs[i]>90)
angleAbove90=true;if(angs[i]==90)
angle90=true;if(angs[i]==angs[loop(i,0,2,1)]){angleSame=true;angleEqual=i;}
if(angs[i]!=60)
angleAll60=false;}
var descr='';var info='';if(angleAbove90){var descrColor='#ff0000';if(angleSame){descr="Obtuse Isosceles Triangle";info="Has an angle more than 90&deg;, and also two equal angles and two equal sides";}else{descr="Obtuse Triangle";info="Has an angle more than 90&deg;";}}else if(angle90){descrColor='#00aa00';if(angleSame){descr="Right Isosceles Triangle";info="Has a right angle (90&deg;) and also two equal angles and two equal sides";}else{descr="Right Triangle";info="Has a right angle (90&deg;)";}}else{descrColor='black';if(angleSame){if(angleAll60){descr="Equilateral Triangle";info="Three equal sides and three equal angles of 60&deg; each";}else{descr="Acute Isosceles Triangle";info="All angles are less than 90&deg; and has two equal sides and two equal angles";}}else{descr="Acute Triangle";info="All angles are less than 90&deg;";}}
document.getElementById(my.titleid).innerHTML=descr;document.getElementById(my.titleid).style.color=descrColor;document.getElementById(my.infoid).innerHTML=info;if(angleZero){descr='Is that a Triangle?';info='An angle is Zero!';}}
if(my.mode=='choose'){var angs=tri.getAngles()
tri.drawAngles(g);var s="";var okQ=true;for(i=0;i<numShapes;i++){if(angs[i]==180)okQ=false;s+=angs[i]+"° + ";}
s=s.substring(0,s.length-2);s+=" = 180°";if(!okQ)s='Is that a triangle?';document.getElementById(my.titleid).innerHTML=s}}
function drawDot(x,y){g.beginPath();g.fillStyle='navy';g.arc(x,y,3,0,2*Math.PI);g.fill();}
function Triangle(){var numPts=3;sides=[3,4,5];sideLabels=[];var sideTextArray=[];angleLabels=[];var angleTextArray=[];var defaultAngleLabels=["A","B","C"];var defaultSideLabels=["c","a","b"];var isAngleKnownQ=[false,false,false];var isSideKnownQ=[false,false,false];var dec=1;var types=[];var fillQ=true;scaleFactor=1;pts=new Array(numPts);for(var k=0;k<numPts;k++){pts[k]=new Pt(0,0);}
sideLabels=defaultSideLabels;angleLabels=defaultAngleLabels;types["AAA"]=[["A","B","C"]];types["AAS"]=[["A","B","a"],["A","B","b"],["A","C","a"],["A","C","c"],["B","C","b"],["B","C","c"]];types["ASA"]=[["A","c","B"],["A","b","C"],["B","a","C"]];types["SAS"]=[["a","C","b"],["a","B","c"],["b","A","c"]];types["SSA"]=[["a","b","A"],["a","b","B"],["a","c","A"],["a","c","C"],["b","c","B"],["b","c","C"]];types["SSS"]=[["a","b","c"]];}
Triangle.prototype.getNo=function(varName){switch(varName){case "A":return 0;case "B":return 1;case "C":return 2;case "a":return 1;case "b":return 2;case "c":return 0;}
return-1;};Triangle.prototype.getVal=function(varName){switch(varName){case "A":case "B":case "C":return pts[this.getNo(varName)].getAngle();break;case "a":case "b":case "c":return sides[this.getNo(varName)];break;default:}
return 0;};Triangle.prototype.setLabels=function(angleA,angleB,angleC,sidea,sideb,sidec){this.setLabel("A",angleA);this.setLabel("B",angleB);this.setLabel("C",angleC);this.setLabel("a",sidea);this.setLabel("b",sideb);this.setLabel("c",sidec);};Triangle.prototype.setLabel=function(varName,labelStr){var lblNo=this.getNo(varName);if(lblNo<0)
return;if(labelStr==null)
return;switch(varName){case "A":case "B":case "C":angleLabels[lblNo]=labelStr;break;case "a":case "b":case "c":sideLabels[lblNo]=labelStr;break;default:}};Triangle.prototype.getUserStr=function(varName){switch(varName){case "A":case "B":case "C":if(this.isKnown(varName)){return(this.userAngle(pts[this.getNo(varName)].getAngle()).toString()+"º");}else{return(angleLabels[this.getNo(varName)]);}
break;case "a":case "b":case "c":if(this.isKnown(varName)){return(this.userSide(this.getNo(varName)).toString());}else{return(sideLabels[this.getNo(varName)]);}
break;default:}
return "";};Triangle.prototype.setxy=function(ptNo,ix,iy){pts[ptNo].setxy(ix,iy);};Triangle.prototype.updateMe=function(){setAngles(pts);sides=getSides(pts);};Triangle.prototype.setAllKnown=function(knownQ){isAngleKnownQ=[knownQ,knownQ,knownQ];isSideKnownQ=[knownQ,knownQ,knownQ];};Triangle.prototype.setKnown=function(varName,knownQ){switch(varName){case "A":case "B":case "C":isAngleKnownQ[this.getNo(varName)]=knownQ;break;case "a":case "b":case "c":isSideKnownQ[this.getNo(varName)]=knownQ;break;default:}};Triangle.prototype.isKnown=function(varName){switch(varName){case "A":case "B":case "C":return isAngleKnownQ[this.getNo(varName)];break;case "a":case "b":case "c":return isSideKnownQ[this.getNo(varName)];break;default:}
return false;};Triangle.prototype.userSide=function(i){return Math.round(sides[i]*scaleFactor);};Triangle.prototype.userAngle=function(x){return Math.round(x*180/Math.PI);};Triangle.prototype.drawSides=function(g){var ptC=new Pt();ptC.setAvg(pts);var ptM=new Pt();for(var i=0;i<3;i++){ptM.setAvg([pts[i],pts[loop(i,0,2,1)]]);ptM.interpolate(ptM,ptC,1.4);var side=Math.round(this.getVal(String.fromCharCode(97+loop(i+1,0,2,1))));g.fillText(side.toString(),ptM.x-10,ptM.y+5,100);}};Triangle.prototype.getAngles=function(){var angs=[];var angSum=0;for(var i=0;i<3;i++){var ang=this.userAngle(pts[i].getAngle());if(i<2){angSum+=ang;}else{ang=180-angSum;}
angs[i]=ang;}
return angs};Triangle.prototype.drawAngles=function(g){var angSum=0;var angDescr="";var angs=[];for(var i=0;i<3;i++){var d=30;var ang=this.userAngle(pts[i].getAngle());if(i<2){angSum+=ang;}else{ang=180-angSum;}
angs[i]=ang;angDescr+=ang+"° + ";if(ang==90){g.drawBox(pts[i].x,pts[i].y,25,pts[i].angleOut-Math.PI/2);}else{if(ang>90){d=30-(ang-90)/6;}else{}
g.fillStyle="rgba(0, 0, 255, 0.3)";g.beginPath();g.moveTo(pts[i].x,pts[i].y);g.arc(pts[i].x,pts[i].y,d,pts[i].angleIn,pts[i].angleOut,false);g.closePath();g.fill();}
var aMid=(pts[i].angleIn+pts[i].angleOut)/2;var txtPt=new Pt(0,0);txtPt.x=pts[i].x+(d+15)*Math.cos(aMid)-0;txtPt.y=pts[i].y+(d+15)*Math.sin(aMid)-0;g.textAlign='left';g.fillStyle="rgba(0, 0, 255, 1)";g.fillText(ang+"°",txtPt.x-10,txtPt.y+5,100);}};function drawPerpBisectors(){var lns=[];for(var i=0;i<3;i++){var ln=new Line(pts[i],pts[loop(i,0,2,1)]);var perpLn=ln.clone();perpLn.rotateMidMe(Math.PI/2);perpLn.setLen(1400);lns.push(perpLn);g.strokeStyle='black';g.lineWidth=1;g.beginPath();g.moveTo(perpLn.a.x,perpLn.a.y);g.lineTo(perpLn.b.x,perpLn.b.y);g.stroke();var midPt=ln.getMidPt();g.drawBox(midPt.x,midPt.y,15,perpLn.getAngle());}
return lns[0].getIntersection(lns[1]);}
function drawMedians(){var lns=[];for(var i=0;i<3;i++){var ln=new Line(pts[i],pts[loop(i,0,2,1)]);var midPt=ln.getMidPt();var medianLn=new Line(midPt,pts[loop(i+1,0,2,1)]);lns.push(medianLn);g.strokeStyle='black';g.lineWidth=1;g.beginPath();g.moveTo(medianLn.a.x,medianLn.a.y);g.lineTo(medianLn.b.x,medianLn.b.y);g.stroke();g.fillStyle='black';g.arc(midPt.x,midPt.y,2,0,2*Math.PI);g.fill();}
return lns[0].getIntersection(lns[1]);}
function drawOrthocenter(){var ln0=tri.drawAltitude(0,0,true,false);var ln1=tri.drawAltitude(0,1,true,false);var ln2=tri.drawAltitude(0,2,true,false);var iPt=ln0.getIntersection(ln1)
drawDot(iPt.x,iPt.y);g.setLineDash([5,15]);g.beginPath()
g.moveTo(ln0.b.x,ln0.b.y)
g.lineTo(iPt.x,iPt.y)
g.stroke()
g.beginPath()
g.moveTo(ln1.b.x,ln1.b.y)
g.lineTo(iPt.x,iPt.y)
g.stroke()
g.beginPath()
g.moveTo(ln2.b.x,ln2.b.y)
g.lineTo(iPt.x,iPt.y)
g.stroke()
g.setLineDash([]);return iPt;}
function drawAngleBisectors(){var lns=[];for(var i=0;i<3;i++){var ln=getAngleBisector(i);ln.setLen(1400);lns.push(ln);g.strokeStyle='black';g.lineWidth=1;g.beginPath();g.moveTo(ln.a.x,ln.a.y);g.lineTo(ln.b.x,ln.b.y);g.stroke();}
return lns[0].getIntersection(lns[1]);}
Triangle.prototype.getAltitude=function(ptNo){var aa=pts[loop(ptNo,0,2,1)];var ln=new Line(aa,pts[loop(ptNo,0,2,2)]);var iPt=ln.getClosestPoint(pts[ptNo]);var htLn=new Line(pts[ptNo],iPt);return Math.round(htLn.getLength()*scaleFactor);};Triangle.prototype.drawAltitude=function(r,ptNo,drawAsSegmentQ,showTextQ){drawAsSegmentQ=typeof drawAsSegmentQ!=='undefined'?drawAsSegmentQ:true;showTextQ=typeof showTextQ!=='undefined'?showTextQ:true;var ln=new Line(pts[loop(ptNo,0,2,1)],pts[loop(ptNo,0,2,2)]);var iPt=ln.getClosestPoint(pts[ptNo]);var htLn=new Line(pts[ptNo],iPt);g.strokeStyle='#0000ff';g.lineWidth=1;g.drawBox(htLn.b.x,htLn.b.y,10,htLn.getAngle()+Math.PI);if(showTextQ){var htMidPt=htLn.getMidPt();g.fillText(Math.round(htLn.getLength()*scaleFactor),htMidPt.x+2,htMidPt.y+10)}
var iSegPt=ln.getClosestPoint(pts[ptNo],true);var extendedLn=new Line(iSegPt,iPt);if(extendedLn.getLength()>20){extendedLn.setLen(extendedLn.getLength()-20);extendedLn.setLen(extendedLn.getLength()+30,false);g.beginPath();g.lineWidth=1;g.moveTo(extendedLn.a.x,extendedLn.a.y);g.lineTo(extendedLn.b.x,extendedLn.b.y);g.stroke();}
if(!drawAsSegmentQ)
htLn.setLen(1400);g.beginPath();g.lineWidth=1;g.moveTo(htLn.a.x,htLn.a.y);g.lineTo(htLn.b.x,htLn.b.y);g.stroke();return htLn;};Triangle.prototype.setDec=function(decimals){this.dec=decimals;};function getAngleBisector(i){var p=new Pt(pts[i].x,pts[i].y);var ln=new Line(new Pt(p.x,p.y),new Pt(p.x+100,p.y));var angle=-(pts[i].angleIn+pts[i].angleOut)/2;ln.rotatePtMe(p,angle);return ln;}
Triangle.prototype.getLength=function(n){var pt1=pts[n];var pt2=pts[loop(n,0,2,1)];var dx=pt2.x-pt1.x;var dy=pt2.y-pt1.y;return Math.sqrt(dx*dx+dy*dy)*scaleFactor;};Triangle.prototype.getPerimeter=function(){return this.getLength(0)+this.getLength(1)+this.getLength(2);};Triangle.prototype.getHeronArea=function(){var p=this.getPerimeter()/2;var heron=p;for(var i=0;i<3;i++){heron*=p-this.getLength(i);}
return Math.sqrt(heron);};Triangle.prototype.makeRegular=function(PointNum,midX,midY){var movedQ=true;var obj=shapes[PointNum];var radius=dist(midX-obj.x,midY-obj.y);var SttAngle=Math.atan2(obj.y-midY,obj.x-midX);var dAngle=Math.PI*2/3;for(var i=0;i<3;i++){obj=shapes[i];var angle=SttAngle+(i-PointNum)*dAngle;obj.x=midX+radius*Math.cos(angle);obj.y=midY+radius*Math.sin(angle);}
this.updateMe();return movedQ;};Triangle.prototype.makeScalene=function(PointNum){var movedQ=false;var pushDist=5;do{var shovedQ=false;this.fromPts(shapes);var angSum=0;var scaleneQ=true;var pushNum=0;for(var i=0;i<3;i++){var j=(i+1)%3;var ang1=Math.round(pts[i].getAngle()*180/Math.PI);var ang2=Math.round(pts[j].getAngle()*180/Math.PI);if(ang1==ang2){scaleneQ=false;pushNum=i;}
angSum+=ang1;}
if(angSum!=180)scaleneQ=false;if(!scaleneQ){while(pushNum==PointNum){pushNum=(Math.random()*3)<<0;}
shapes[pushNum].x+=getRandom(-pushDist,pushDist);shapes[pushNum].y+=getRandom(-pushDist,pushDist);shovedQ=true;}
if(shovedQ){movedQ=true;}}while(shovedQ);return movedQ;};Triangle.prototype.makeIsosceles=function(PointNum){var Aobj=shapes[2];var Bobj=shapes[1];var Cobj=shapes[0];this.fromPts(shapes);var movedQ=false;do{var Ox=(Bobj.x+Cobj.x)/2;var Oy=(Bobj.y+Cobj.y)/2;var angle=0;if(PointNum==0){angle=Math.atan2(Aobj.y-Oy,Aobj.x-Ox);}
if(PointNum==1){angle=Math.atan2(Bobj.y-Oy,Bobj.x-Ox)+Math.PI/2;}
if(PointNum==2){angle=Math.atan2(Cobj.y-Oy,Cobj.x-Ox)-Math.PI/2;}
var BO=dist(Bobj.x-Ox,Bobj.y-Oy);Bobj.x=Ox+BO*Math.cos(angle-Math.PI/2);Bobj.y=Oy+BO*Math.sin(angle-Math.PI/2);Cobj.x=Ox+BO*Math.cos(angle+Math.PI/2);Cobj.y=Oy+BO*Math.sin(angle+Math.PI/2);var AO=dist(Aobj.x-Ox,Aobj.y-Oy);Aobj.x=Ox+AO*Math.cos(angle);Aobj.y=Oy+AO*Math.sin(angle);this.fromPts(shapes);var shovedQ=false;var doubledAng=Math.round(pts[1].getAngle()*180/Math.PI);var pushDist=5;if(doubledAng==90){shapes[0].x+=getRandom(-pushDist,pushDist);shapes[0].y+=getRandom(-pushDist,pushDist);shovedQ=true;}
if(doubledAng==0){shapes[0].x+=getRandom(-pushDist,pushDist);shapes[0].y+=getRandom(-pushDist,pushDist);shovedQ=true;}
if(doubledAng==60){shapes[0].x+=getRandom(-pushDist,pushDist);shapes[0].y+=getRandom(-pushDist,pushDist);shovedQ=true;}
if(shovedQ)movedQ=true;}while(shovedQ);return movedQ;};Triangle.prototype.fromPts=function(srcPts){for(var i=0;i<3;i++){pts[i].x=srcPts[i].x;pts[i].y=srcPts[i].y;}
this.updateMe();};Triangle.prototype.makeRight=function(PointNum){var movedQ=true;this.fromPts(shapes);if(Math.round(pts[0].getAngle()*100)!=157){var ANum=0;var BNum=1;var CNum=2;var Aobj=shapes[ANum];var Bobj=shapes[BNum];var Cobj=shapes[CNum];var mult=1;if(PointNum==2){Bobj=shapes[2];Cobj=shapes[1];mult=-1;}
var Angle=Math.atan2(Aobj.y-Bobj.y,Aobj.x-Bobj.x);var AC=dist(Cobj.x-Aobj.x,Cobj.y-Aobj.y);Cobj.x=Aobj.x+AC*Math.cos(Angle-Math.PI/2)*mult;Cobj.y=Aobj.y+AC*Math.sin(Angle-Math.PI/2)*mult;}
this.updateMe();return movedQ;};Triangle.prototype.makeAcute=function(PointNum){var movedQ=false;this.fromPts(shapes);for(var i=0;i<3;i++){if(pts[i].getAngle()*180/Math.PI>89){var Aobj=shapes[i];var Bobj=shapes[(i+1)%3];var Cobj=shapes[(i+2)%3];var Angle=Math.atan2(Aobj.y-Bobj.y,Aobj.x-Bobj.x);var AC=dist(Cobj.x-Aobj.x,Cobj.y-Aobj.y);Cobj.x=Aobj.x+AC*Math.cos(Angle-Math.PI/2-0.02);Cobj.y=Aobj.y+AC*Math.sin(Angle-Math.PI/2-0.02);movedQ=true;this.updateMe();}}
return movedQ;};Triangle.prototype.makeObtuse=function(PointNum){var movedQ=false;this.fromPts(shapes);if(pts[0].getAngle()*180/Math.PI<91){var Aobj=shapes[0];var Bobj=shapes[1];var Cobj=shapes[2];var mult=1;if(PointNum==2){Bobj=shapes[2];Cobj=shapes[1];mult=-1;}
var Angle=Math.atan2(Aobj.y-Bobj.y,Aobj.x-Bobj.x);var AC=dist(Cobj.x-Aobj.x,Cobj.y-Aobj.y);Cobj.x=Aobj.x+AC*Math.cos(Angle-Math.PI/2+0.02*mult)*mult;Cobj.y=Aobj.y+AC*Math.sin(Angle-Math.PI/2+0.02*mult)*mult;movedQ=true;this.updateMe();}
return movedQ;};function Pt(ix,iy){this.x=ix;this.y=iy;var prevx;var prevy;var a;var prevQ=false;var validPtQ;angleIn=0;angleOut=0;}
Pt.prototype.setxy=function(ix,iy){this.x=ix;this.y=iy;validPtQ=true;};Pt.prototype.setPrevPt=function(){if(validPtQ){prevx=this.x;prevy=this.y;prevQ=true;}};Pt.prototype.getAngle=function(){return this.angleOut-this.angleIn;};Pt.prototype.drawMe=function(g){g.fillStyle="rgba(0, 0, 255, 0.3)";g.beginPath();g.arc(this.x,this.y,20,0,2*Math.PI,false);g.closePath();g.fill();};Pt.prototype.getAvg=function(pts){var xSum=0;var ySum=0;for(var i=0;i<pts.length;i++){xSum+=pts[i].x;ySum+=pts[i].y;}
newPt=new Pt(xSum/pts.length,ySum/pts.length);newPt.x=xSum/pts.length;newPt.y=ySum/pts.length;return newPt;};Pt.prototype.setAvg=function(pts){this.setPrevPt();var newPt=this.getAvg(pts);this.x=newPt.x;this.y=newPt.y;validPtQ=true;};Pt.prototype.interpolate=function(pt1,pt2,f){this.setPrevPt();this.x=pt1.x*f+pt2.x*(1-f);this.y=pt1.y*f+pt2.y*(1-f);validPtQ=true;};Pt.prototype.translateMe=function(pt,addQ){addQ=typeof addQ!=='undefined'?addQ:true;if(addQ){this.x+=pt.x;this.y+=pt.y}else{this.x-=pt.x;this.y-=pt.y}};Pt.prototype.translate=function(pt,addQ){addQ=typeof addQ!=='undefined'?addQ:true;t=new Pt(this.x,this.y);t.x=this.x;t.y=this.y;if(addQ){t.x+=pt.x;t.y+=pt.y;}else{t.x-=pt.x;t.y-=pt.y;}
return t;};Pt.prototype.multiply=function(fact){return new Pt(this.x*fact,this.y*fact);};Pt.prototype.multiplyMe=function(fact){this.x*=fact;this.y*=fact;};Pt.prototype.rotate=function(angle){var cosa=Math.cos(angle);var sina=Math.sin(angle);var xPos=this.x*cosa+this.y*sina;var yPos=-this.x*sina+this.y*cosa;return new Pt(xPos,yPos);};Pt.prototype.rotateMe=function(angle){var t=new Pt(this.x,this.y).rotate(angle);this.x=t.x;this.y=t.y;};function setAngles(pts){var CW=getClockwise(pts);var numPoints=pts.length;var angles=[];for(var i=0;i<numPoints;i++){var pt=pts[i];var ptm1=pts[loop(i,0,numPoints-1,-1)];var ptp1=pts[loop(i,0,numPoints-1,1)];var a1=Math.atan2(ptm1.y-pt.y,ptm1.x-pt.x);var a2=Math.atan2(ptp1.y-pt.y,ptp1.x-pt.x);if(CW==1){var temp=a1;a1=a2;a2=temp;}
if(a1>a2)
a2+=2*Math.PI;pt.angleIn=a1;pt.angleOut=a2;}}
function getClockwise(pts){var numPoints=pts.length;var count=0;for(var i=0;i<numPoints;i++){var pt=pts[i];var ptm1=pts[loop(i,0,numPoints-1,-1)];var ptp1=pts[loop(i,0,numPoints-1,1)];var z=0;z+=(pt.x-ptm1.x)*(ptp1.y-pt.y);z-=(pt.y-ptm1.y)*(ptp1.x-pt.x);if(z<0){count--;}else if(z>0){count++;}}
if(count>0)
return(1);if(count==0)
return(0);return(-1);}
function getSides(pts){var numPoints=pts.length;var sides=[];for(var i=0;i<numPoints;i++){var pt=pts[i];var ptp1=pts[loop(i,0,numPoints-1,1)];sides.push(dist(ptp1.x-pt.x,ptp1.y-pt.y));}
return(sides);}
function dist(dx,dy){return(Math.sqrt(dx*dx+dy*dy));}
function loop(currNo,minNo,maxNo,incr){currNo+=incr;var was=currNo;var range=maxNo-minNo+1;if(currNo<minNo){currNo=maxNo-(-currNo+maxNo)%range;}
if(currNo>maxNo){currNo=minNo+(currNo-minNo)%range;}
return currNo;}
function constrain(min,val,max){return(Math.min(Math.max(min,val),max));}
function Line(pt1,pt2){this.a=pt1;this.b=pt2;}
Line.prototype.getLength=function(n){var dx=this.b.x-this.a.x;var dy=this.b.y-this.a.y;return Math.sqrt(dx*dx+dy*dy)*scaleFactor;};Line.prototype.getIntersection=function(ln,asSegmentsQ){var A=this.a;var B=this.b;var E=ln.a;var F=ln.b;var a1=B.y-A.y;var b1=A.x-B.x;var c1=B.x*A.y-A.x*B.y;var a2=F.y-E.y;var b2=E.x-F.x;var c2=F.x*E.y-E.x*F.y;var denom=a1*b2-a2*b1;if(denom==0){return null;}
var ip=new Pt();ip.x=(b1*c2-b2*c1)/denom;ip.y=(a2*c1-a1*c2)/denom;if(asSegmentsQ){if(Math.pow(ip.x-B.x,2)+Math.pow(ip.y-B.y,2)>Math.pow(A.x-B.x,2)+Math.pow(A.y-B.y,2)){return null;}
if(Math.pow(ip.x-A.x,2)+Math.pow(ip.y-A.y,2)>Math.pow(A.x-B.x,2)+Math.pow(A.y-B.y,2)){return null;}
if(Math.pow(ip.x-F.x,2)+Math.pow(ip.y-F.y,2)>Math.pow(E.x-F.x,2)+Math.pow(E.y-F.y,2)){return null;}
if(Math.pow(ip.x-E.x,2)+Math.pow(ip.y-E.y,2)>Math.pow(E.x-F.x,2)+Math.pow(E.y-F.y,2)){return null;}}
return ip;};Line.prototype.getMidPt=function(){return new Pt((this.a.x+this.b.x)/2,(this.a.y+this.b.y)/2);};Line.prototype.rotateMidMe=function(angle){var midPt=this.getMidPt();this.a.translateMe(midPt,false);this.b.translateMe(midPt,false);this.a.rotateMe(angle);this.b.rotateMe(angle);this.a.translateMe(midPt);this.b.translateMe(midPt);};Line.prototype.rotatePtMe=function(pt,angle){this.a.x-=pt.x;this.a.y-=pt.y;this.b.x-=pt.x;this.b.y-=pt.y;this.a.rotateMe(angle);this.b.rotateMe(angle);this.a.x+=pt.x;this.a.y+=pt.y;this.b.x+=pt.x;this.b.y+=pt.y;};Line.prototype.getClosestPoint=function(toPt,inSegmentQ){var AP=toPt.translate(this.a,false);var AB=this.b.translate(this.a,false);var ab2=AB.x*AB.x+AB.y*AB.y;var ap_ab=AP.x*AB.x+AP.y*AB.y;var t=ap_ab/ab2;if(inSegmentQ){t=constrain(0,t,1);}
closest=this.a.translate(AB.multiply(t));return closest;};Line.prototype.setLen=function(newLen,fromMidQ){fromMidQ=typeof fromMidQ!=='undefined'?fromMidQ:true;var len=this.getLength();if(fromMidQ){var midPt=this.getMidPt();var halfPt=new Pt(this.a.x-midPt.x,this.a.y-midPt.y);halfPt.multiplyMe(newLen/len);this.a=midPt.translate(halfPt);this.b=midPt.translate(halfPt,false);}else{var diffPt=new Pt(this.a.x-this.b.x,this.a.y-this.b.y);diffPt.multiplyMe(newLen/len);this.b=this.a.translate(diffPt,false);}};Line.prototype.getAngle=function(){return Math.atan2(this.b.y-this.a.y,this.b.x-this.a.x);};Line.prototype.clone=function(){var ln=new Line(new Pt(0,0),new Pt(0,0));ln.a.x=this.a.x;ln.a.y=this.a.y;ln.b.x=this.b.x;ln.b.y=this.b.y;return ln;};CanvasRenderingContext2D.prototype.drawBox=function(midX,midY,radius,angle){g.beginPath();var pts=[[0,0],[Math.cos(angle),Math.sin(angle)],[Math.cos(angle)+Math.cos(angle+Math.PI/2),Math.sin(angle)+Math.sin(angle+Math.PI/2)],[Math.cos(angle+Math.PI/2),Math.sin(angle+Math.PI/2)],[0,0]];for(var i=0;i<pts.length;i++){if(i==0){g.moveTo(midX+radius*pts[i][0],midY+radius*pts[i][1]);}else{g.lineTo(midX+radius*pts[i][0],midY+radius*pts[i][1]);}}
g.stroke();};function getRandom(min,max){return Math.random()*(max-min)+min;}