var w,h,g,my={};function anglesMain(){var version='0.831';console.log('anglesMain',version)
w=300;h=310;var overlay=w*0.1;var win=w-overlay*2;var hin=h-overlay*2;var s="";s+='<div style="position:relative; width:'+win+'px; height:'+hin+'px; border: none; margin:auto; display:inline-block; text-align:center;">';s+='<canvas id="canvasId" style="position: absolute; width:'+w+'px; height:'+h+'px; left: '+(-overlay)+'px; top: '+(-overlay)+'px; border: none;"></canvas>';s+='<div style="position:absolute; left:170px; top:170px;">';s+=playHTML(40);s+='</div>';s+='</div>';document.write(s);var el=document.getElementById('canvasId');var ratio=2;el.width=w*ratio;el.height=h*ratio;el.style.width=w+"px";el.style.height=h+"px";g=el.getContext("2d");g.setTransform(ratio,0,0,ratio,0,0);my.circleX=130;my.circleY=130;my.circleRadius=100;my.currAngle=0.0
my.degrees=0;my.wait=0;my.playQ=false;playToggle();}
function animate(){if(my.wait<0){my.wait++;requestAnimationFrame(animate);return;}
if(!my.playQ)return;my.degrees+=1;if(my.degrees==90)my.wait=-100;if(my.degrees==180)my.wait=-100;my.currAngle=my.degrees*Math.PI/180.0
if(my.degrees==360){my.currAngle=Math.PI*2.0
playToggle();}
g.clearRect(0,0,g.canvas.width,g.canvas.height)
drawRing("circle");drawAngle();requestAnimationFrame(animate);}
function drawAngle(){var angleSnap=Math.floor(angleDeg(my.currAngle,true));var cX=Math.cos(my.currAngle)*my.circleRadius;var cY=-Math.sin(my.currAngle)*my.circleRadius;g.beginPath();g.moveTo(my.circleX+my.circleRadius,my.circleY);g.lineTo(my.circleX,my.circleY);g.lineTo(my.circleX+cX,my.circleY+cY);g.lineWidth=2;g.lineJoin="round";g.strokeStyle="#0000ff";g.stroke();g.closePath();g.font="24px Arial";g.fillStyle="#0000ff";g.textAlign="left";g.fillText(angleSnap.toString()+"°",150,my.circleY-30)
g.textAlign="center";g.fillText(angleName(my.currAngle),my.circleX,my.circleY+my.circleRadius+30)
g.lineWidth=1
g.strokeStyle="#0000ff"
g.beginPath()
switch(angleSnap){case 90:g.drawBox(my.circleX,my.circleY-25,25,0)
break;case 360:g.arc(my.circleX,my.circleY,30,0,Math.PI*2)
break;default:g.arc(my.circleX,my.circleY,30,-my.currAngle,0)}
g.stroke()}
function angleDeg(angleRad,snap90sQ){var angle=angleRad*180.0/Math.PI;if(snap90sQ){if(angle<1||angle>359)
angle=360;if(angle>89&&angle<91)
angle=90;if(angle>179&&angle<181)
angle=180;}
return angle;}
function angleName(angleRad){var s="";var angDeg=angleDeg(angleRad,true);angDeg=Math.floor(angDeg);if(angDeg<90){s="Acute Angle";}
if(angDeg==90){s="Right Angle";}
if(angDeg>90){s="Obtuse Angle";}
if(angDeg==180){s="Straight Angle";}
if(angDeg>180){s="Reflex Angle";}
if(angDeg==360){s="Full Rotation";}
return s;}
function drawRing(ringType){switch(ringType){case "circle":g.beginPath();g.strokeStyle="#884400";g.fillStyle="#ffffff";g.arc(my.circleX,my.circleY,my.circleRadius,0,2*Math.PI);g.shadowColor='rgba(128,55,0,0.7)';g.shadowBlur=my.circleRadius*0.4;g.closePath();g.fill();g.stroke();g.shadowBlur=0;g.shadowOffsetY=0;break;case "compass":g.drawCompass(my.circleX,my.circleY,my.circleRadius-3,6);break;default:}}
function playHTML(w){var s='';s+='<style type="text/css">';s+='.btn {display: inline-block; position: relative; width:'+w+'px; height:'+w+'px; margin-right:'+w*0.2+'px; padding: .6em; border: 0 solid rgba(208,208,248,1); border-radius: 10em; background: linear-gradient(#fff, #ccf), #c9c5c9; box-shadow: 0 3 4 rgba(0,0,0,.4); }';s+='.btn:hover {background: linear-gradient(#f5f5f5, #b9b9b9), #c9c5c9; }';s+='.btn:before, button:after {content: " "; position: absolute; }';s+='.btn:active {top:'+w*0.05+'px; box-shadow: 0 '+w*0.02+'px '+w*0.03+'px rgba(0,0,0,.4); }';s+='.play:before {  left: '+w*0.36+'px; top: '+w*0.22+'px; width: 0; height: 0; border: '+w*0.3+'px solid transparent; border-left-width: '+w*0.4+'px; border-left-color: blue;  }';s+='.play:hover:before {border-left-color: yellow; }';s+='.pause:before, .pause:after {display: block; left: '+w*0.29+'px; top: '+w*0.28+'px; width: '+w*0.19+'px; height: '+w*0.47+'px; background-color: blue; }';s+='.pause:after {left: '+w*0.54+'px; }';s+='.pause:hover:before, .pause:hover:after {background-color: yellow; }';s+='</style>';s+='<button id="playBtn" class="btn play" onclick="playToggle()" ></button>';return s;}
function playToggle(){var btn='playBtn';if(my.playQ){my.playQ=false;document.getElementById(btn).classList.add("play");document.getElementById(btn).classList.remove("pause");}else{my.playQ=true;if(my.degrees==360){my.degrees=0;}
document.getElementById(btn).classList.add("pause");document.getElementById(btn).classList.remove("play");animate();}}
CanvasRenderingContext2D.prototype.drawBox=function(midX,midY,radius,angle){var pts=[[0,0],[Math.cos(angle),Math.sin(angle)],[Math.cos(angle)+Math.cos(angle+Math.PI/2),Math.sin(angle)+Math.sin(angle+Math.PI/2)],[Math.cos(angle+Math.PI/2),Math.sin(angle+Math.PI/2)],[0,0]];for(var i=0;i<pts.length;i++){if(i==0){g.moveTo(midX+radius*pts[i][0],midY+radius*pts[i][1]);}else{g.lineTo(midX+radius*pts[i][0],midY+radius*pts[i][1]);}}};CanvasRenderingContext2D.prototype.drawCompass=function(circleX,circleY,tickRadius){var tickLen=12;for(var i=-15;i<=195;i+=15){var angle=i*Math.PI/180.0;if(i%90){this.strokeStyle='rgba(0,0,0,0.2)';this.lineWidth=1;}else{this.strokeStyle='rgba(0,0,0,0.5)';this.lineWidth=1;}
this.beginPath();var cX=circleX+Math.cos(angle)*tickRadius;var cY=circleY-Math.sin(angle)*tickRadius;this.moveTo(cX,cY);cX=circleX+Math.cos(angle)*(tickRadius+tickLen);cY=circleY-Math.sin(angle)*(tickRadius+tickLen);this.lineTo(cX,cY);this.stroke();}};