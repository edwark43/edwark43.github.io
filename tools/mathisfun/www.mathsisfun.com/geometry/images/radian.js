var w,h,g,my={}
function radianMain(mode){my.version='0.82';my.mode=typeof mode!=='undefined'?mode:'rad';my.mode=my.mode.replace(/[^a-z0-9]/gmi,'')
console.log('radianMain')
w=360;h=280;var s="";s+='<div style="position:relative; width:'+w+'px; min-height:'+h+'px; border: none; border-radius: 20px; background-color: #def; margin:auto; display:block;">';s+='<canvas id="canvasId" style="position: absolute; width:'+w+'px; height:'+h+'px; left: 0; top:; border: none;"></canvas>';s+='<div id="descr" style="position:absolute; left:0; top:150px; width: 280px; font: bold 24px Arial; text-align: center; color: goldenrod;"></div>';s+='<div style="position:absolute; right:5px; top:5px;">';s+=playHTML(40);s+='</div>';s+='<div style="position:absolute; right:3px; bottom:3px;">';s+='<button id="appBtn" onclick="winNew()" style="z-index:2;" class="clickbtn">'+winnewSvg()+'</button>';s+='</div>';s+='<div id="copyrt" style="font: 10px Arial; color: #6600cc; position:absolute; left:8px; bottom:3px;">&copy; 2019 MathsIsFun.com  v'+my.version+'</div>';s+='</div>';document.write(s);var el=document.getElementById('canvasId');var ratio=2;el.width=w*ratio;el.height=h*ratio;el.style.width=w+"px";el.style.height=h+"px";g=el.getContext("2d");g.setTransform(ratio,0,0,ratio,0,0);my.midX=140;my.midY=140;my.scale=0.044;my.radius=110;my.frame=0;if(my.mode=='rad'){my.frameTot=300;}
if(my.mode=='circ'){my.frameTot=360;}
my.playQ=false;playToggle();}
function winnewSvg(){var s=''
s+='<svg xmlns="http://www.w3.org/2000/svg" width="26" height="21" version="1.1" style="stroke-width:2; fill:none; vertical-align:middle;">'
s+='<rect style="stroke:grey;" x="1" y="6" ry="4" width="19" height="13" />'
s+='<path style="stroke:#cdf;stroke-width:3;" d="m 14,6 h 6 v 6"/>'
s+='<path style="stroke:black;" d="m 16,2 h 8 v 8"/>'
s+='<path style="stroke:black;" d="m 14,12 10,-10"/>'
s+='</svg>'
return s}
function winNew(){window.open(toLoc('../app26c7.html?folder=geometry&amp;file=radian&amp;p='+my.mode))}
function toLoc(s){if(window.location.href.indexOf('localhost')>0)s='/mathsisfun'+s
return s}
function animate(){my.frame++;if(my.frame>my.frameTot){my.frame=0;playToggle();return;}
if(my.mode=='rad')doFrameRad(my.frame);if(my.mode=='circ')doFrameCircle(my.frame);if(my.playQ)
requestAnimationFrame(animate);}
function doFrameRad(frame){if(frame<30){g.clearRect(0,0,g.canvas.width,g.canvas.height)
drawCirc();drawRadius();}
if(frame>=30&&frame<130){g.clearRect(0,0,g.canvas.width,g.canvas.height)
drawCirc();doRadLine(frame-30);}
if(frame>=130&&frame<230){g.clearRect(0,0,g.canvas.width,g.canvas.height)
drawCirc();doRadFold(frame-130);}
if(frame>=230&&frame<300){g.clearRect(0,0,g.canvas.width,g.canvas.height)
drawCirc();drawSector(0,(frame-230)/70);g.strokeStyle='blue';g.lineWidth=2;g.beginPath();g.arc(my.midX,my.midY,my.radius,-1,0,false);g.stroke();if(frame>290){g.drawAngleFill(my.midX,my.midY,60,-1,1,'1 Radian');}}}
function doFrameCircle(frame){if(frame<100){g.clearRect(0,0,g.canvas.width,g.canvas.height)
drawCirc();drawSector(0,(frame-0)/30);}
if(frame>=100&&frame<150){g.clearRect(0,0,g.canvas.width,g.canvas.height)
drawCirc();drawSector(0,1);var angle=Math.min((frame-100)/30,1);drawSector(-angle,1);}
if(frame>=150&&frame<200){g.clearRect(0,0,g.canvas.width,g.canvas.height)
drawCirc();drawSector(0,1);drawSector(-1,1);var angle=Math.min((frame-150)/30,1)+1;drawSector(-angle,1);}
if(frame>=200&&frame<=251){g.clearRect(0,0,g.canvas.width,g.canvas.height)
drawCirc();drawSector(0,1);drawSector(-1,1);drawSector(-2,1);var angle=Math.min((frame-200)/30,1)+2;var angRemain=Math.PI-angle;drawSector(-angle,1,angRemain);}
g.fillStyle='goldenrod';if(frame>=0&&frame<130){drawRadText('1 Radian');g.drawAngle(my.midX,my.midY,60,-1,1,'');}
if(frame>=130&&frame<180){drawRadText('2 Radians');g.drawAngle(my.midX,my.midY,60,-2,2,'');}
if(frame>=180&&frame<230){drawRadText('3 Radians');g.drawAngle(my.midX,my.midY,60,-3,3,'');}
if(frame>=230&&frame<300){drawRadText('3.1416... Radians');g.drawAngle(my.midX,my.midY,60,3.14,-3.14,'');}
if(frame>300&&frame<350){drawRadText('3.1416... Radians<br/>= <span style="font: bold 39px/30px Times;">&pi;</span> Radians');g.drawAngle(my.midX,my.midY,60,3.14,-3.14,'');}
if(frame>=350){drawRadText('3.1416... Radians<br/>= <span style="font: bold 39px/30px Times;">&pi;</span> Radians<br/>= 180&deg;');g.drawAngle(my.midX,my.midY,60,3.14,-3.14,'');}}
function drawRadText(txt){document.getElementById('descr').innerHTML=txt;}
function drawSector(sttAngle,alpha,angle){angle=typeof angle!=='undefined'?angle:1;alpha=Math.min(alpha,1);var xStt=my.radius*Math.cos(sttAngle);var yStt=my.radius*Math.sin(sttAngle);g.strokeStyle='rgba(0,0,255,'+alpha+')';g.fillStyle='rgba(255,255,0,'+alpha*0.07+')';g.lineWidth=2;g.beginPath();g.moveTo(my.midX,my.midY);g.lineTo(my.midX+xStt,my.midY+yStt);g.arc(my.midX,my.midY,my.radius,sttAngle,sttAngle-angle,true);g.closePath();g.fill();g.stroke();}
function drawRadius(){g.strokeStyle='blue';g.lineWidth=2;g.moveTo(my.midX,my.midY);g.lineTo(my.midX+my.radius,my.midY);g.stroke();g.font="16px Arial";g.fillStyle="blue";g.textAlign='center';g.fillText('Radius',my.midX+my.radius/2,my.midY+20);}
function drawCirc(){g.strokeStyle='skyblue';g.lineWidth=1;g.beginPath();g.arc(my.midX,my.midY,my.radius,0,2*Math.PI,true);g.stroke();g.beginPath();g.moveTo(my.midX,my.midY);g.lineTo(my.midX+my.radius,my.midY);g.stroke();}
function doRadLine(frame){var rad=-Math.PI-frame/21;g.strokeStyle='blue';g.lineWidth=2;var xEnd=my.radius*Math.cos(rad);var yEnd=my.radius*Math.sin(rad);g.beginPath();g.moveTo(my.midX+my.radius,my.midY);g.lineTo(my.midX+my.radius+xEnd,my.midY+yEnd);g.stroke();}
function doRadFold(frame){var rad=-frame/100;g.strokeStyle='blue';g.lineWidth=2;g.beginPath();g.arc(my.midX,my.midY,my.radius,0,rad,true);g.stroke();var xEnd=my.midX+my.radius*Math.cos(rad);var yEnd=my.midY+my.radius*Math.sin(rad);var lenRemain=my.radius*(1+rad);var lenX=lenRemain*Math.cos(rad-Math.PI/2);var lenY=lenRemain*Math.sin(rad-Math.PI/2);g.beginPath();g.moveTo(xEnd,yEnd);g.lineTo(xEnd+lenX,yEnd+lenY);g.stroke();}
function Point(x,y){my.x=x;my.y=y;}
Point.prototype.set=function(x,y){my.x=x;my.y=y;};CanvasRenderingContext2D.prototype.drawAngleFill=function(x,y,len,sttAngle,angle,angDescr){if(angle<0)angle+=2*Math.PI;var angDeg=Math.round(angle*180.0/Math.PI);var d=30;if(angDeg==90){g.drawBox(x,y,25,sttAngle+angle-Math.PI/2);}else{g.strokeStyle='#ff0000';if(angDeg>90){d=Math.max(20,30-(angDeg-90)/6);}else{}
g.fillStyle="rgba(0, 0, 255, 0.3)";g.beginPath();g.moveTo(x,y);g.arc(x,y,d,sttAngle,sttAngle+angle,false);g.closePath();g.fill();}
var aMid=sttAngle+(angle/2);var txtX=x+(d+15)*Math.cos(aMid)-0;var txtY=y+(d+15)*Math.sin(aMid)-0;g.font="16px Arial";g.fillStyle="blue";g.textAlign='left';g.fillText(angDescr,txtX-12,txtY+5);};CanvasRenderingContext2D.prototype.drawBox=function(midX,midY,radius,angle){g.beginPath();var pts=[[0,0],[Math.cos(angle),Math.sin(angle)],[Math.cos(angle)+Math.cos(angle+Math.PI/2),Math.sin(angle)+Math.sin(angle+Math.PI/2)],[Math.cos(angle+Math.PI/2),Math.sin(angle+Math.PI/2)],[0,0]];for(var i=0;i<pts.length;i++){if(i==0){g.moveTo(midX+radius*pts[i][0],midY+radius*pts[i][1]);}else{g.lineTo(midX+radius*pts[i][0],midY+radius*pts[i][1]);}}
g.stroke();};CanvasRenderingContext2D.prototype.drawAngle=function(x,y,len,sttAngle,angle){var arcAt=0.75;g.beginPath();var wasstrokeStyle=g.strokeStyle;g.strokeStyle=g.fillStyle;g.arc(x,y,len*arcAt,sttAngle,sttAngle+angle);g.stroke();g.strokeStyle=wasstrokeStyle;var leg1Pt=toCartesian(len,sttAngle);g.beginPath();g.drawArrow(x+leg1Pt[0]*arcAt,y+leg1Pt[1]*arcAt,15,2,20,10,-sttAngle+Math.PI*0.43);g.fill();var leg2Pt=toCartesian(len,sttAngle+angle);g.beginPath();g.drawArrow(x+leg2Pt[0]*arcAt,y+leg2Pt[1]*arcAt,15,2,20,10,-(sttAngle+angle)+Math.PI*1.57);g.fill();};function toCartesian(len,rad){var x=Math.cos(rad)*len;var y=Math.sin(rad)*len;return[x,y];}
CanvasRenderingContext2D.prototype.drawArrow=function(x0,y0,totLen,shaftHt,headLen,headHt,angle,sweep,invertQ){var g=this;var pts=[[0,0],[-headLen,-headHt/2],[-headLen+sweep,-shaftHt/2],[-totLen,-shaftHt/2],[-totLen,shaftHt/2],[-headLen+sweep,shaftHt/2],[-headLen,headHt/2],[0,0]];if(invertQ){pts.push([0,-headHt/2],[-totLen,-headHt/2],[-totLen,headHt/2],[0,headHt/2]);}
for(var i=0;i<pts.length;i++){var cosa=Math.cos(-angle);var sina=Math.sin(-angle);var xPos=pts[i][0]*cosa+pts[i][1]*sina;var yPos=pts[i][0]*sina-pts[i][1]*cosa;if(i==0){g.moveTo(x0+xPos,y0+yPos);}else{g.lineTo(x0+xPos,y0+yPos);}}}
function playHTML(w){var s='';s+='<style type="text/css">';s+='.btn {display: inline-block; position: relative; width:'+w+'px; height:'+w+'px; margin-right:'+w*0.2+'px; padding: .6em; border: 0 solid rgba(208,208,248,1); border-radius: 10em; background: linear-gradient(#fff, #ccf), #c9c5c9; box-shadow: 0 3 4 rgba(0,0,0,.4); }';s+='.btn:hover {background: linear-gradient(#f5f5f5, #b9b9b9), #c9c5c9; }';s+='.btn:before, button:after {content: " "; position: absolute; }';s+='.btn:active {top:'+w*0.05+'px; box-shadow: 0 '+w*0.02+'px '+w*0.03+'px rgba(0,0,0,.4); }';s+='.play:before {  left: '+w*0.36+'px; top: '+w*0.22+'px; width: 0; height: 0; border: '+w*0.3+'px solid transparent; border-left-width: '+w*0.4+'px; border-left-color: blue;  }';s+='.play:hover:before {border-left-color: yellow; }';s+='.pause:before, .pause:after {display: block; left: '+w*0.29+'px; top: '+w*0.28+'px; width: '+w*0.19+'px; height: '+w*0.47+'px; background-color: blue; }';s+='.pause:after {left: '+w*0.54+'px; }';s+='.pause:hover:before, .pause:hover:after {background-color: yellow; }';s+='</style>';s+='<button id="playBtn" class="btn play" onclick="playToggle()" ></button>';return s;}
function playToggle(){var btn='playBtn';if(my.playQ){my.playQ=false;document.getElementById(btn).classList.add("play");document.getElementById(btn).classList.remove("pause");}else{my.playQ=true;document.getElementById(btn).classList.add("pause");document.getElementById(btn).classList.remove("play");animate();}}