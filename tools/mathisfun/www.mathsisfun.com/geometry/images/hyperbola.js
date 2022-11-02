var w,h,ratio,i,s,el,g,div,dragQ,game,my={};function hyperbolaMain(imode){my.version='0.71';mode=typeof imode!=='undefined'?imode:'foci';w=360;h=360;canvasid="canvas"+mode;titleid="title"+mode;infoid="info"+mode;s="";s+='<div style="position:relative; width:'+w+'px; height:'+h+'px; border: 1px solid blue; border-radius: 9px; margin:auto; display:block; ">';s+='<canvas id="'+canvasid+'" width="'+w+'" height="'+h+'" style="z-index:1;"></canvas>';s+='<div id="'+titleid+'" style="font: 12pt arial; font-weight: bold; position:absolute; top:10px; left:0px; width:360px; text-align:center;"></div>';s+='<div id="'+infoid+'" style="font: 10pt arial; font-weight: bold; color: #6600cc; position:absolute; top:31px; left:0px; width:360px; text-align:center;"></div>';s+='<div id="dragem" style="font: bold 14px arial; color: blue; position:absolute; right:60px; top:20px;">Drag The Points!</div>';s+='<div style="position:absolute; bottom:20px; left:5px;">';s+='<div style="display: inline-block; font:15px Arial; width: 80px; text-align: right; margin-right:10px;">Difference:</div>'
s+='<input type="range" id="r1"  value="0.5" min="0.01" max="0.98" step="0.01"  style="z-index:2; width:200px; height:10px; border: none; " oninput="onDiffChg(0,this.value)" onchange="onDiffChg(1,this.value)" />';s+='</div>';s+='<div id="copyrt" style="font: 10px Arial; font-weight: bold; color: #6600cc; position:absolute; bottom:5px; right:5px; text-align:center;">&copy; 2018 MathsIsFun.com  v'+my.version+'</div>';s+='</div>';document.write(s);el=document.getElementById(canvasid);ratio=2;el.width=w*ratio;el.height=h*ratio;el.style.width=w+"px";el.style.height=h+"px";g=el.getContext("2d");g.setTransform(ratio,0,0,ratio,0,0);theCanvas=el;context=g;dragIndex=0;numShapes=3;shapes=[];ptData=[];switch(mode){case "foci":case "arc":case "tangent":ptData=[[80,170,"F"],[260,130,"G"],[200,100,"P"]];break;case "axes":case "semiaxes":ptData=[[40,170,"A"],[260,130,"B"],[150,100,"C"],[230,230,"D"]];break;default:ptData=[[80,170,"F"],[260,130,"G"],[200,100,"P"]];}
numShapes=ptData.length;my.diff=0.5;makeShapes(ptData);drawShapes();theCanvas.addEventListener("mousedown",mouseDownListener,false);theCanvas.addEventListener('touchstart',ontouchstart,false);theCanvas.addEventListener("mousemove",domousemove,false);}
function onDiffChg(n,v){v=Number(v);my.diff=v;drawShapes();}
function reset(){makeShapes();drawShapes();}
function ontouchstart(evt){var touch=evt.targetTouches[0];evt.clientX=touch.clientX;evt.clientY=touch.clientY;evt.touchQ=true;mouseDownListener(evt)}
function ontouchmove(evt){var touch=evt.targetTouches[0];evt.clientX=touch.clientX;evt.clientY=touch.clientY;evt.touchQ=true;mouseMoveListener(evt);evt.preventDefault();};function ontouchend(evt){theCanvas.addEventListener('touchstart',ontouchstart,false);window.removeEventListener("touchend",ontouchend,false);if(dragging){dragging=false;window.removeEventListener("touchmove",ontouchmove,false);}}
function domousemove(e){document.body.style.cursor="default";var bRect=theCanvas.getBoundingClientRect();mouseX=(e.clientX-bRect.left)*(el.width/ratio/bRect.width);mouseY=(e.clientY-bRect.top)*(el.height/ratio/bRect.height);for(i=0;i<numShapes;i++){if(hitTest(shapes[i],mouseX,mouseY)){dragNo=i;document.body.style.cursor="pointer";}}}
function mouseDownListener(evt){document.getElementById('dragem').style.visibility='hidden';var i;var highestIndex=-1;var bRect=theCanvas.getBoundingClientRect();mouseX=(evt.clientX-bRect.left)*(el.width/ratio/bRect.width);mouseY=(evt.clientY-bRect.top)*(el.height/ratio/bRect.height);for(i=0;i<numShapes;i++){if(hitTest(shapes[i],mouseX,mouseY)){dragNo=i;dragging=true;if(i>highestIndex){dragHoldX=mouseX-shapes[i].x;dragHoldY=mouseY-shapes[i].y;highestIndex=i;dragIndex=i;}}}
if(dragging){if(evt.touchQ){window.addEventListener('touchmove',ontouchmove,false);}else{window.addEventListener("mousemove",mouseMoveListener,false);}}
if(evt.touchQ){theCanvas.removeEventListener("touchstart",ontouchstart,false);window.addEventListener("touchend",ontouchend,false);}else{theCanvas.removeEventListener("mousedown",mouseDownListener,false);window.addEventListener("mouseup",mouseUpListener,false);}
if(evt.preventDefault){evt.preventDefault();}
else if(evt.returnValue){evt.returnValue=false;}
return false;}
function mouseUpListener(evt){theCanvas.addEventListener("mousedown",mouseDownListener,false);window.removeEventListener("mouseup",mouseUpListener,false);if(dragging){dragging=false;window.removeEventListener("mousemove",mouseMoveListener,false);}}
function mouseMoveListener(evt){var posX;var posY;var shapeRad=12;var minX=shapeRad;var maxX=theCanvas.width-shapeRad;var minY=shapeRad;var maxY=theCanvas.height-shapeRad;var bRect=theCanvas.getBoundingClientRect();mouseX=(evt.clientX-bRect.left)*(el.width/ratio/bRect.width);mouseY=(evt.clientY-bRect.top)*(el.height/ratio/bRect.height);posX=mouseX-dragHoldX;posX=(posX<minX)?minX:((posX>maxX)?maxX:posX);posY=mouseY-dragHoldY;posY=(posY<minY)?minY:((posY>maxY)?maxY:posY);shapes[dragIndex].x=posX;shapes[dragIndex].y=posY;drawShapes();}
function hitTest(shape,mx,my){var dx;var dy;dx=mx-shape.x;dy=my-shape.y;return(dx*dx+dy*dy<shape.rad*shape.rad);}
function makeShapes(pos){var i;var tempX;var tempY;var tempColor;shapes=[];for(i=0;i<numShapes;i++){tempX=pos[i][0]
tempY=pos[i][1]
tempColor="rgb("+0+","+0+","+255+")";tempShape=new Pt(tempX,tempY);tempShape.name=pos[i][2];shapes.push(tempShape);}}
function update(){switch(mode){case "foci":case "tangent":updateFoci();break;case "axes":case "semiaxes":updateAxes();break;case "arc":updateArc();break;default:}}
function drawShapes(){g.clearRect(0,0,el.width,el.height);update();var i;var dbg="";for(i=0;i<numShapes;i++){g.fillStyle="rgba(0, 0, 255, 0.3)";g.beginPath();g.arc(shapes[i].x,shapes[i].y,8,0,2*Math.PI,false);g.closePath();g.fill();g.fillStyle="rgba(0, 0, 0, 0.8)";g.beginPath();g.arc(shapes[i].x,shapes[i].y,2,0,2*Math.PI,false);g.closePath();g.fill();g.font="bold 16px Arial";g.fillText(shapes[i].name,shapes[i].x+5,shapes[i].y-5,100);dbg+='['+Math.floor(shapes[i].x)+","+Math.floor(shapes[i].y)+',"A"],';}
if(mode=='area'){}}
Line.prototype.getLength=function(n){var dx=this.b.x-this.a.x;var dy=this.b.y-this.a.y;return Math.sqrt(dx*dx+dy*dy);}
function Pt(ix,iy){this.x=ix;this.y=iy;this.name="?";this.rad=12;var prevx;var prevy;var a;var prevQ=false;var validPtQ;angleIn=0;angleOut=0;}
Pt.prototype.toString=function(){return this.x.toString()+","+this.y.toString();}
Pt.prototype.add=function(dx,dy){return new Pt(this.x+dx,this.y+dy);}
Pt.prototype.addMe=function(dx,dy){this.x+=dx;this.y+=dy;}
Pt.prototype.setxy=function(ix,iy){this.x=ix;this.y=iy;validPtQ=true;}
Pt.prototype.setPrevPt=function(){prevx=this.x
prevy=this.y;prevQ=true;}
Pt.prototype.getAngle=function(){return this.angleOut-this.angleIn;}
Pt.prototype.drawMe=function(g){g.fillStyle="rgba(0, 0, 255, 0.3)";g.beginPath();g.arc(this.x,this.y,20,0,2*Math.PI,false);g.closePath();g.fill();}
Pt.prototype.getAvg=function(pts){var xSum=0;var ySum=0;for(var i=0;i<pts.length;i++){xSum+=pts[i].x;ySum+=pts[i].y;}
newPt=new Pt(xSum/pts.length,ySum/pts.length);newPt.x=xSum/pts.length;newPt.y=ySum/pts.length;return newPt;}
Pt.prototype.dist=function(pt){var dx=pt.x-this.x;var dy=pt.y-this.y;return Math.sqrt(dx*dx+dy*dy);}
Pt.prototype.setAvg=function(pts){this.setPrevPt();var newPt=this.getAvg(pts);this.x=newPt.x;this.y=newPt.y;validPtQ=true;}
Pt.prototype.interpolate=function(pt1,pt2,f){this.setPrevPt();this.x=pt1.x*f+pt2.x*(1-f);this.y=pt1.y*f+pt2.y*(1-f);validPtQ=true;}
Pt.prototype.translateMe=function(pt,addQ){addQ=typeof addQ!=='undefined'?addQ:true;if(addQ){this.x+=pt.x;this.y+=pt.y}else{this.x-=pt.x;this.y-=pt.y}}
Pt.prototype.translate=function(pt,addQ){addQ=typeof addQ!=='undefined'?addQ:true;t=new Pt(this.x,this.y);t.x=this.x
t.y=this.y
if(addQ){t.x+=pt.x;t.y+=pt.y}else{t.x-=pt.x;t.y-=pt.y}
return t;}
Pt.prototype.multiply=function(fact){return new Pt(this.x*fact,this.y*fact);}
Pt.prototype.multiplyMe=function(fact){this.x*=fact;this.y*=fact;}
Pt.prototype.rotate=function(angle){var cosa=Math.cos(angle);var sina=Math.sin(angle);var xPos=this.x*cosa+this.y*sina;var yPos=-this.x*sina+this.y*cosa;return new Pt(xPos,yPos);}
Pt.prototype.rotateMe=function(angle){var t=new Pt(this.x,this.y).rotate(angle);this.x=t.x;this.y=t.y;}
function setAngles(pts){var CW=getClockwise(pts);var numPoints=pts.length;var angles=[];for(var i=0;i<numPoints;i++){var pt=pts[i];var ptm1=pts[loop(i,0,numPoints-1,-1)];var ptp1=pts[loop(i,0,numPoints-1,1)];var a1=Math.atan2(ptm1.y-pt.y,ptm1.x-pt.x);var a2=Math.atan2(ptp1.y-pt.y,ptp1.x-pt.x);if(CW==1){var temp=a1;a1=a2;a2=temp;}
if(a1>a2)
a2+=2*Math.PI;pt.angleIn=a1;pt.angleOut=a2;}}
function getClockwise(pts){var numPoints=pts.length;var count=0;for(var i=0;i<numPoints;i++){var pt=pts[i];var ptm1=pts[loop(i,0,numPoints-1,-1)];var ptp1=pts[loop(i,0,numPoints-1,1)];var z=0;z+=(pt.x-ptm1.x)*(ptp1.y-pt.y);z-=(pt.y-ptm1.y)*(ptp1.x-pt.x);if(z<0){count--;}else if(z>0){count++;}}
if(count>0)
return(1);if(count==0)
return(0);return(-1);}
function getSides(pts){var numPoints=pts.length;var sides=[];for(var i=0;i<numPoints;i++){var pt=pts[i];var ptp1=pts[loop(i,0,numPoints-1,1)];sides.push(dist(ptp1.x-pt.x,ptp1.y-pt.y));}
return(sides);}
function loop(currNo,minNo,maxNo,incr){currNo+=incr;var was=currNo;var range=maxNo-minNo+1;if(currNo<minNo){currNo=maxNo-(-currNo+maxNo)%range;}
if(currNo>maxNo){currNo=minNo+(currNo-minNo)%range;}
return currNo;}
function constrain(min,val,max){return(Math.min(Math.max(min,val),max));}
function Line(pt1,pt2){this.a=pt1;this.b=pt2;}
Line.prototype.getDist=function(){return dist(this.b.x-this.a.x,this.b.y-this.a.y);}
Line.prototype.getMidPt=function(){return new Pt((this.a.x+this.b.x)/2,(this.a.y+this.b.y)/2);}
Line.prototype.setMidPt=function(toPt){var fromPt=this.getMidPt();this.a.x+=toPt.x-fromPt.x;this.a.y+=toPt.y-fromPt.y;this.b.x+=toPt.x-fromPt.x;this.b.y+=toPt.y-fromPt.y;}
Line.prototype.rotateMidMe=function(angle){var midPt=this.getMidPt();this.a.translateMe(midPt,false);this.b.translateMe(midPt,false);this.a.rotateMe(angle);this.b.rotateMe(angle);this.a.translateMe(midPt);this.b.translateMe(midPt);}
Line.prototype.getClosestPoint=function(toPt,inSegmentQ){var AP=toPt.translate(this.a,false);var AB=this.b.translate(this.a,false);var ab2=AB.x*AB.x+AB.y*AB.y;var ap_ab=AP.x*AB.x+AP.y*AB.y;var t=ap_ab/ab2;if(inSegmentQ){t=constrain(0,t,1);}
closest=this.a.translate(AB.multiply(t));return closest;}
Line.prototype.setLen=function(newLen,fromMidQ){fromMidQ=typeof fromMidQ!=='undefined'?fromMidQ:true;var len=this.getLength();if(fromMidQ){var midPt=this.getMidPt();var halfPt=new Pt(this.a.x-midPt.x,this.a.y-midPt.y);halfPt.multiplyMe(newLen/len);this.a=midPt.translate(halfPt);this.b=midPt.translate(halfPt,false);}else{var diffPt=new Pt(this.a.x-this.b.x,this.a.y-this.b.y);diffPt.multiplyMe(newLen/len);this.b=this.a.translate(diffPt,false);}}
Line.prototype.getAngle=function(){return Math.atan2(this.b.y-this.a.y,this.b.x-this.a.x);}
function updateFoci(){var d0=shapes[0];var d1=shapes[1];var dm=shapes[2];var isCircQ=false;if(dist(d0.x-d1.x,d0.y-d1.y)<2){console.log("update: make d0 and d1 very close to simulate circle without problems of divide by zero etc");d0.x=d1.x+0.1;d0.y=d1.y+0.1;isCircQ=true;}
var ln=new Line(d0,d1);var distFoci=ln.getDist();ln.setLen(2000);g.strokeStyle='blue';if(!isCircQ){g.beginPath();g.moveTo(ln.a.x,ln.a.y);g.lineTo(ln.b.x,ln.b.y);g.stroke();}
var mPt=new Pt();mPt.setAvg([d0,d1]);var pPt=new Pt(dm.x,dm.y);var nearPt=new Pt(0,0);var pDist=1000;var eccentricity=2
var a=1.2*distFoci/2/eccentricity;var b=a;var k=distFoci*my.diff;var hPts=getHyperbola2Pts(distFoci,k);var pts=[];for(var i=0;i<hPts.length;i++){var pt=hPts[hPts.length-1-i];pts.push(new Pt(mPt.x+pt.x,mPt.y-pt.y));}
for(var i=0;i<hPts.length;i++){var pt=hPts[i];pts.push(new Pt(mPt.x+pt.x,mPt.y+pt.y));}
pts.push(new Pt(null,null));for(var i=0;i<hPts.length;i++){var pt=hPts[hPts.length-1-i];pts.push(new Pt(mPt.x-pt.x,mPt.y-pt.y));}
for(var i=0;i<hPts.length;i++){var pt=hPts[i];pts.push(new Pt(mPt.x-pt.x,mPt.y+pt.y));}
pts=rotatePts(pts,mPt.x,mPt.y,-ln.getAngle());g.strokeStyle='rgba(200,100,0,1)';g.beginPath();drawPts(g,pts);g.stroke();for(var j=0;j<pts.length;j++){var pt=pts[j];if(pt.x<0)continue;if(pt.x>w)continue;if(pt.y<0)continue;if(pt.y>h)continue;if(pt.dist(pPt)<pDist){pDist=pt.dist(pPt);nearPt.setxy(pt.x,pt.y);}}
dm.x=nearPt.x;dm.y=nearPt.y;g.strokeStyle='rgba(0,0,256,0.7)';g.beginPath();g.moveTo(d0.x,d0.y);g.lineTo(dm.x,dm.y);g.stroke();g.strokeStyle='rgba(256,0,0,0.7)';g.beginPath();g.moveTo(d1.x,d1.y);g.lineTo(dm.x,dm.y);g.stroke();if(mode=="tangent"){var fLn=new Line(d0,dm);var gLn=new Line(d1,dm);var midAngle=(fLn.getAngle()+gLn.getAngle())/2;var tanLn=new Line(new Pt(dm.x-100,dm.y),new Pt(dm.x+100,dm.y));tanLn.rotateMidMe(-midAngle+Math.PI/2);tanLn.setLen(1000);g.lineWidth=2;g.beginPath();g.moveTo(tanLn.a.x,tanLn.a.y);g.lineTo(tanLn.b.x,tanLn.b.y);g.stroke();g.lineWidth=1;var rot=midAngle+Math.PI/2;var intAngle=rot-fLn.getAngle();if(intAngle>Math.PI)intAngle-=Math.PI;var da=dist(tanLn.a.x-d0.x,tanLn.a.y-d0.y);var db=dist(tanLn.b.x-d0.x,tanLn.b.y-d0.y);if(da<db){var angs=[new Pt(tanLn.a.x,tanLn.a.y),new Pt(dm.x,dm.y),new Pt(d0.x,d0.y)];drawAnglePts(g,angs);angs=[new Pt(tanLn.b.x,tanLn.b.y),new Pt(dm.x,dm.y),new Pt(d1.x,d1.y)];drawAnglePts(g,angs);}else{angs=[new Pt(tanLn.b.x,tanLn.b.y),new Pt(dm.x,dm.y),new Pt(d0.x,d0.y)];drawAnglePts(g,angs);angs=[new Pt(tanLn.a.x,tanLn.a.y),new Pt(dm.x,dm.y),new Pt(d1.x,d1.y)];drawAnglePts(g,angs);}}
if(mode=="foci"){var PF=new Line(dm,d0);var PG=new Line(dm,d1);var lnX=40;var lnY=268;var lnY2=lnY+20;g.strokeStyle='rgba(0,0,256,0.7)';g.fillStyle='rgba(0,0,256,0.7)';g.beginPath();g.drawArrow(lnX,lnY,15,2,20,10,Math.PI);g.moveTo(lnX,lnY);g.lineTo(lnX+PF.getLength(),lnY);g.drawArrow(lnX+PF.getLength(),lnY,15,2,20,10,0);g.stroke();g.fill();g.font="bold 16px Arial";g.fillStyle='black';g.textAlign='center';g.fillText('P',lnX,lnY-4);g.fillText('F',lnX+PF.getLength(),lnY-4);g.fillText('P',lnX,lnY2-4);g.fillText('G',lnX+PG.getLength(),lnY2-4);g.strokeStyle='rgba(256,0,0,0.7)';g.fillStyle='rgba(256,0,0,0.7)';g.beginPath();g.drawArrow(lnX,lnY2,15,2,20,10,Math.PI);g.moveTo(lnX,lnY2);g.lineTo(lnX+PG.getLength(),lnY2);g.drawArrow(lnX+PG.getLength(),lnY2,15,2,20,10,0);g.stroke();g.fill();}}
function getHyperbola2Pts(distFoci,k){var pts=[];var c=distFoci;var minDist=(c-k)/2+k;for(var b=minDist;b<minDist+200;b++){var a=b-k;var cosB=(b*b+c*c-a*a)/(2*b*c);var x=b*cosB;var y=Math.sqrt(b*b-x*x)
var pt=new Pt(x-distFoci/2,y);pts.push(pt)}
return pts;}
function getHyperbolaPts(midX,midY,a,b,fromAngle,toAngle){var points=[];if(isNear(fromAngle,toAngle,0.0001)){return points;}
if(a!=b){fromAngle=Math.atan2(Math.sin(fromAngle)*a/b,Math.cos(fromAngle));toAngle=Math.atan2(Math.sin(toAngle)*a/b,Math.cos(toAngle));}
if(fromAngle>toAngle){while(fromAngle>toAngle){fromAngle-=2*Math.PI;}}
var steps=Math.max(1,parseInt((toAngle-fromAngle)*20));for(var i=0;i<=steps;i++){var radians=fromAngle+(toAngle-fromAngle)*(i/steps);var thisX=midX+(1/Math.cos(radians)*a);var thisY=midY-(Math.tan(radians)*b);points.push(new Pt(thisX,thisY));}
return points;}
function updateAxes(){var d0=new Pt(shapes[0].x,shapes[0].y);var d1=new Pt(shapes[1].x,shapes[1].y);var d2=new Pt(shapes[2].x,shapes[2].y);var d3=new Pt(shapes[3].x,shapes[3].y);if(dragIndex==d2||dragIndex==d3){var tp=d0;d0=d2;d2=tp;tp=d1;d1=d3;d3=tp;}
var majorLn=new Line(d0,d1);var minorLn=new Line(d2,d3);var majorLen=majorLn.getDist();var minorLen=minorLn.getDist();var mPt=new Pt();mPt.setAvg([d0,d1]);var pts=getArcPts(mPt.x,mPt.y,majorLen/2,minorLen/2,0,Math.PI*2);pts=rotatePts(pts,mPt.x,mPt.y,-majorLn.getAngle());g.strokeStyle='rgba(200,100,0,1)';g.beginPath();drawPts(g,pts);g.stroke();minorLn.setMidPt(mPt);minorLn.rotateMidMe(minorLn.getAngle()-(majorLn.getAngle()+Math.PI/2));shapes[2].x=minorLn.a.x;shapes[2].y=minorLn.a.y;shapes[3].x=minorLn.b.x;shapes[3].y=minorLn.b.y;if(majorLen<minorLen){var temp=minorLn;minorLn=majorLn;majorLn=temp;}
g.beginPath();g.arc(mPt.x,mPt.y,3,0,Math.PI*2);g.fill();var titleStr="";g.strokeStyle='red';g.fillStyle='red';if(mode=="axes"){titleStr="Minor Axis";g.beginPath();g.moveTo(minorLn.a.x,minorLn.a.y);g.lineTo(minorLn.b.x,minorLn.b.y);g.stroke();}else{titleStr="Semi-minor Axis";g.beginPath();g.moveTo(mPt.x,mPt.y);g.lineTo(minorLn.b.x,minorLn.b.y);g.stroke();}
g.save();g.translate(mPt.x,mPt.y);g.rotate(minorLn.getAngle());g.font='15px Arial';g.fillText(titleStr,5,-5);g.restore();g.strokeStyle='blue';g.fillStyle='blue';if(mode=="axes"){titleStr="Major Axis";g.beginPath();g.moveTo(majorLn.a.x,majorLn.a.y);g.lineTo(majorLn.b.x,majorLn.b.y);g.stroke();}else{titleStr="Semi-major Axis";g.beginPath();g.moveTo(mPt.x,mPt.y);g.lineTo(majorLn.b.x,majorLn.b.y);g.stroke();}
g.save();g.translate(mPt.x,mPt.y);g.rotate(majorLn.getAngle());g.font='15px Arial';g.fillText(titleStr,5,-5);g.restore();}
function dist(dx,dy){return(Math.sqrt(dx*dx+dy*dy));}
function getArcPts(midX,midY,radiusX,radiusY,fromAngle,toAngle){var points=[];if(isNear(fromAngle,toAngle,0.0001)){return points;}
if(radiusX!=radiusY){fromAngle=Math.atan2(Math.sin(fromAngle)*radiusX/radiusY,Math.cos(fromAngle));toAngle=Math.atan2(Math.sin(toAngle)*radiusX/radiusY,Math.cos(toAngle));}
if(fromAngle>toAngle){while(fromAngle>toAngle){fromAngle-=2*Math.PI;}}
var steps=Math.max(1,parseInt((toAngle-fromAngle)*10));for(var i=0;i<=steps;i++){var radians=fromAngle+(toAngle-fromAngle)*(i/steps);var thisX=midX+(Math.cos(radians)*radiusX);var thisY=midY-(Math.sin(radians)*radiusY);points.push(new Pt(thisX,thisY));}
return points;}
function rotatePts(pts,midX,midY,rot){var newPts=[];for(var i=0;i<pts.length;i++){var pt=pts[i];if(pt.x==null){newPts.push(pt);}else{newPts.push(pt.add(-midX,-midY).rotate(rot).add(midX,midY));}}
return newPts;}
function drawPts(g,pts,closeQ){closeQ=typeof closeQ!=='undefined'?closeQ:false;var sttQ=true;for(var i=0;i<pts.length;i++){var pt=pts[i];if(pt.x===null){sttQ=true;}else{if(sttQ){g.moveTo(pt.x,pt.y);sttQ=false;}else{g.lineTo(pt.x,pt.y);}}}
if(closeQ){g.lineTo(pts[0].x,pts[0].y);}}
function isNear(checkVal,centralVal,limitVal){if(checkVal<centralVal-limitVal)
return false;if(checkVal>centralVal+limitVal)
return false;return true;}
CanvasRenderingContext2D.prototype.drawArrow=function(x0,y0,totLen,shaftHt,headLen,headHt,angle,sweep,invertQ){var g=this;var pts=[[0,0],[-headLen,-headHt/2],[-headLen+sweep,-shaftHt/2],[-totLen,-shaftHt/2],[-totLen,shaftHt/2],[-headLen+sweep,shaftHt/2],[-headLen,headHt/2],[0,0]];if(invertQ){pts.push([0,-headHt/2],[-totLen,-headHt/2],[-totLen,headHt/2],[0,headHt/2]);}
for(var i=0;i<pts.length;i++){var cosa=Math.cos(-angle);var sina=Math.sin(-angle);var xPos=pts[i][0]*cosa+pts[i][1]*sina;var yPos=pts[i][0]*sina-pts[i][1]*cosa;if(i==0){g.moveTo(x0+xPos,y0+yPos);}else{g.lineTo(x0+xPos,y0+yPos);}}};CanvasRenderingContext2D.prototype.drawAngle=function(x,y,len,sttAngle,angle){var arcAt=0.7;g.beginPath();wasstrokeStyle=g.strokeStyle;g.strokeStyle=g.fillStyle;g.arc(x,y,len*arcAt,sttAngle,sttAngle+angle);g.stroke();g.strokeStyle=wasstrokeStyle;var leg1Pt=toCartesian(len,sttAngle);g.beginPath();g.moveTo(x,y);g.lineTo(x+leg1Pt[0],y+leg1Pt[1]);g.stroke();g.beginPath();g.drawArrow(x+leg1Pt[0]*arcAt,y+leg1Pt[1]*arcAt,15,2,20,10,-sttAngle+Math.PI*0.44);g.fill();var leg2Pt=toCartesian(len,sttAngle+angle);g.beginPath();g.moveTo(x,y);g.lineTo(x+leg2Pt[0],y+leg2Pt[1]);g.stroke();g.beginPath();g.drawArrow(x+leg2Pt[0]*arcAt,y+leg2Pt[1]*arcAt,15,2,20,10,-(sttAngle+angle)+Math.PI*1.57);g.fill();};function toCartesian(len,rad){var x=Math.cos(rad)*len;var y=Math.sin(rad)*len;return[x,y];}
CanvasRenderingContext2D.prototype.drawAngleFill=function(x,y,len,sttAngle,angle){if(angle<0)angle+=2*Math.PI;var angDeg=Math.round(angle*180./Math.PI);var d=30;if(angDeg==90){g.drawBox(x,y,25,sttAngle+angle-Math.PI/2);}else{if(angDeg>90){HiGraphics.lineStyle(2,0xff0000);d=Math.max(20,30-(angDeg-90)/6);}else{HiGraphics.lineStyle(2,0x4444FF);}
g.fillStyle="rgba(0, 0, 255, 0.3)";g.beginPath();g.moveTo(x,y);g.arc(x,y,d,sttAngle,sttAngle+angle,false);g.closePath();g.fill();}
var ang=Math.round(angle*180/Math.PI,this.dec);var angDescr=ang+"° + "
var aMid=sttAngle+(angle/2);var txtPt=new Pt(0,0)
txtPt.x=x+(d+15)*Math.cos(aMid)-0
txtPt.y=y+(d+15)*Math.sin(aMid)-0
g.font="bold 16px Arial";g.fillStyle="rgba(0, 0, 255, 1)";g.fillText(Math.round(ang)+"°",txtPt.x-10,txtPt.y+5);};function drawAnglePts(g,pts,alsoEndsQ){alsoEndsQ=typeof alsoEndsQ!=='undefined'?alsoEndsQ:false;setAngles(pts);for(var i=0;i<pts.length;i++){if(!alsoEndsQ&&(i==0||i==(pts.length-1)))
continue;var angDeg=Math.round(pts[i].getAngle()*180/Math.PI);var d=30;x=pts[i].x;y=pts[i].y;if(angDeg==90){g.drawBox(x,y,25,pts[i].angleOut-Math.PI/2);}else{if(angDeg>90){g.lineStyle="#ff0000";g.lineWidth=1;d=Math.max(20,30-(angDeg-90)/6);}else{g.lineStyle="#4444FF";g.lineWidth=1;}
g.fillStyle="rgba(0, 0, 255, 0.3)";g.beginPath();g.moveTo(x,y);var sttAngle=pts[i].angleOut;var angle=pts[i].angleOut-pts[i].angleIn;if(sttAngle>angle){while(sttAngle>angle){sttAngle-=2*Math.PI;}}
g.arc(x,y,d,sttAngle,sttAngle-angle,true);g.closePath();g.fill();var aMid=(pts[i].angleIn+pts[i].angleOut)/2;var ax=pts[i].x+(d+15)*Math.cos(aMid);var ay=pts[i].y+(d+15)*Math.sin(aMid);g.font="16px Arial";g.textAlign='center';g.fillStyle="rgba(0, 0, 255, 1)";g.fillText(Math.round(angle*180/Math.PI)+"°",ax,ay);}}}
function setAngles(pts){var CW=getClockwise(pts);var numPoints=pts.length;var angles=[];for(var i=0;i<numPoints;i++){var pt=pts[i];var ptm1=pts[loop(i,0,numPoints-1,-1)];var ptp1=pts[loop(i,0,numPoints-1,1)];var a1=Math.atan2(ptm1.y-pt.y,ptm1.x-pt.x);var a2=Math.atan2(ptp1.y-pt.y,ptp1.x-pt.x);if(CW==1){var temp=a1;a1=a2;a2=temp;}
if(a1>a2)
a2+=2*Math.PI;pt.angleIn=a1;pt.angleOut=a2;}}
CanvasRenderingContext2D.prototype.drawBox=function(midX,midY,radius,angle){g.beginPath();var pts=[[0,0],[Math.cos(angle),Math.sin(angle)],[Math.cos(angle)+Math.cos(angle+Math.PI/2),Math.sin(angle)+Math.sin(angle+Math.PI/2)],[Math.cos(angle+Math.PI/2),Math.sin(angle+Math.PI/2)],[0,0]];for(var i=0;i<pts.length;i++){if(i==0){g.moveTo(midX+radius*pts[i][0],midY+radius*pts[i][1]);}else{g.lineTo(midX+radius*pts[i][0],midY+radius*pts[i][1]);}}
g.stroke();};