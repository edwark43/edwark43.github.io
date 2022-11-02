var w,h,ratio,el,g,drag,dragIndex,dragging,dots,my={}
var spring={k:-10,len:170,damp:0}
var block={y:290,v:0,mass:1};var hist=[]
function springMain(mode){my.version='0.5';mode=typeof mode!=='undefined'?mode:'sin';console.log("mode",mode);mode='sin'
w=360;h=390;my.lt=100;my.bt=h-50
my.midx=w/2
my.orig={x:50,y:20}
my.modes=[{id:"sin",name:"Sine",fn:springDraw,pts:[[w/2+80,80,"A"]]},]
my.mode=my.modes[0];for(var i=0;i<my.modes.length;i++){if(my.modes[i].id==mode){my.mode=my.modes[i];break;}}
console.log('my.mode',my.mode)
var s="";s+='<div style="position:relative; width:'+w+'px; height:'+h+'px; border: 1px solid hsla(240,100%,90%,1); border-radius: 10px; margin:auto; display:block;">';s+='<canvas id="canvasId" width="'+w+'" height="'+h+'" style="z-index:100;"></canvas>';s+='<div style="font: 16px arial; position: absolute; right: 3px; top: 3px; ">'
s+=playHTML(36)
s+='</div>';s+='<div style="position: absolute; right: 60px; bottom: 68px; font: 15px Arial;">Damping:</div>';s+='<input type="range" value="0" min="0" max="1" step="0.01"  style="position: absolute; right: 3px; bottom: 55px; z-index:2; width:160px; height:10px; border: none; " oninput="chgDamp(this.value)" onchange=chgDamp(this.value)" autocomplete="off" />';s+='<div style="position: absolute; right: 60px; bottom: 23px; font: 15px Arial;">Stiffness:</div>';s+='<input type="range" value="20" min="0.2" max="30" step="0.2"  style="position: absolute; right: 3px; bottom: 10px; z-index:2; width:160px; height:10px; border: none; " oninput="chgStiff(this.value)" onchange=chgStiff(this.value)" autocomplete="off" />';s+='<div id="copyrt" style="position: absolute; left: 5px; bottom: 3px; font: 10px Arial; color: #6600cc; ">&copy; 2018 MathsIsFun.com  v'+my.version+'</div>';s+='</div>';document.write(s);el=document.getElementById('canvasId');ratio=2;el.width=w*ratio;el.height=h*ratio;el.style.width=w+"px";el.style.height=h+"px";g=el.getContext("2d");g.setTransform(ratio,0,0,ratio,0,0);my.dotRad=30
dragging=false;drag={hold:{x:0,y:0}}
my.prevTgt={typ:'',a:0,b:0};dotsMake()
el.addEventListener("mousedown",onMouseDown,false);el.addEventListener('touchstart',onTouchStart,false);el.addEventListener("mousemove",doPointer,false);update()
playToggle(false)}
function anim(){if(my.playQ){update()
requestAnimationFrame(anim);}}
function update(){g.clearRect(0,0,g.canvas.width,g.canvas.height)
springDraw()
histDraw()
dotsDraw()}
function chgDamp(v){spring.damp=-v}
function chgStiff(v){spring.k=-v}
function histDraw(){g.strokeStyle='black'
g.beginPath()
for(var i=0;i<hist.length;i++){var y=hist[i]
if(i==0){g.moveTo(my.orig.x+i,y)}else{g.lineTo(my.orig.x+i,y)}}
g.stroke()}
function springDraw(){dots[0].x=my.orig.x
if(!dragging){var springForce=spring.k*((block.y-my.orig.y)-spring.len);var damperForce=spring.damp*(block.v);var a=(springForce+damperForce)/block.mass;var frameRate=1/30;block.v+=a*frameRate;block.y+=block.v*frameRate;dots[0].y=block.y}
hist.unshift(dots[0].y)
hist.length=Math.min(hist.length,300)
g.lineWidth=3
g.strokeStyle='hsla(50,20%,50%,1)';g.drawSpring2(my.orig.x,my.orig.y,my.orig.x,block.y,12)
g.lineWidth=1
g.fillStyle=g.strokeStyle
g.fillRect(my.orig.x-20,0,40,21);}
function dotsMake(){var i;dots=[];for(i=0;i<my.mode.pts.length;i++){var pt=my.mode.pts[i]
dots.push(new Pt(pt[0],pt[1],pt[2]))}}
function dotsDraw(){var i;g.strokeStyle='#aaaaaa'
g.lineWidth=1
for(i=0;i<dots.length;i++){g.fillStyle="rgba(0, 0, 255, 0.6)";g.beginPath();g.arc(dots[i].x,dots[i].y,my.dotRad,0,2*Math.PI,false);g.closePath();g.fill();g.fillStyle="rgba(0, 0, 0, 0.8)";g.beginPath();g.arc(dots[i].x,dots[i].y,2,0,2*Math.PI,false);g.closePath();g.fill();g.font="14px Arial";g.textAlign='left'
g.fillText(dots[i].name,dots[i].x+5,dots[i].y-5,100);}}
function onTouchStart(evt){var touch=evt.targetTouches[0];evt.clientX=touch.clientX;evt.clientY=touch.clientY;evt.touchQ=true;onMouseDown(evt)}
function onTouchMove(evt){var touch=evt.targetTouches[0];evt.clientX=touch.clientX;evt.clientY=touch.clientY;evt.touchQ=true;onMouseMove(evt);evt.preventDefault();}
function onTouchEnd(){el.addEventListener('touchstart',onTouchStart,false);window.removeEventListener("touchend",onTouchEnd,false);if(dragging){dragging=false;window.removeEventListener("touchmove",onTouchMove,false);}}
function doPointer(e){var bRect=el.getBoundingClientRect();var mouseX=(e.clientX-bRect.left)*(el.width/ratio/bRect.width);var mouseY=(e.clientY-bRect.top)*(el.height/ratio/bRect.height);var inQ=false;for(var i=0;i<dots.length;i++){if(hitTest(dots[i],mouseX,mouseY)){inQ=true;}}
if(inQ){document.body.style.cursor="pointer";}else{document.body.style.cursor="default";}}
function onMouseDown(evt){playToggle(false)
dragIndex=0
dragging=true
if(dragging){if(evt.touchQ){window.addEventListener('touchmove',onTouchMove,false);}else{window.addEventListener("mousemove",onMouseMove,false);}}
if(evt.touchQ){el.removeEventListener("touchstart",onTouchStart,false);window.addEventListener("touchend",onTouchEnd,false);}else{el.removeEventListener("mousedown",onMouseDown,false);window.addEventListener("mouseup",onMouseUp,false);}
if(evt.preventDefault){evt.preventDefault();}
else if(evt.returnValue){evt.returnValue=false;}
return false;}
function onMouseUp(){playToggle(true)
el.addEventListener("mousedown",onMouseDown,false);window.removeEventListener("mouseup",onMouseUp,false);if(dragging){dragging=false;window.removeEventListener("mousemove",onMouseMove,false);}}
function onMouseMove(evt){var posX;var posY;var minX=my.dotRad;var maxX=el.width-my.dotRad;var minY=my.dotRad;var maxY=el.height-my.dotRad;var bRect=el.getBoundingClientRect();var mouseX=(evt.clientX-bRect.left)*(el.width/ratio/bRect.width);var mouseY=(evt.clientY-bRect.top)*(el.height/ratio/bRect.height);posX=mouseX-drag.hold.x;posX=(posX<minX)?minX:((posX>maxX)?maxX:posX);posY=mouseY-drag.hold.y;posY=(posY<minY)?minY:((posY>maxY)?maxY:posY);if(dragging){dots[dragIndex].x=posX;dots[dragIndex].y=posY;block.y=posY}
update()}
function hitTest(shape,x,y){var dx;var dy;dx=x-shape.x;dy=y-shape.y;return(dx*dx+dy*dy<my.dotRad*my.dotRad);}
function playHTML(w){var s='';s+='<style type="text/css">';s+='.btn {display: inline-block; position: relative; width:'+w+'px; height:'+w+'px; margin-right:'+w*0.2+'px; padding: .6em; border: 0 solid rgba(208,208,248,1); border-radius: 10em; background: linear-gradient(#fff, #ccf), #c9c5c9; box-shadow: 0 3 4 rgba(0,0,0,.4); }';s+='.btn:hover {background: linear-gradient(#f5f5f5, #b9b9b9), #c9c5c9; }';s+='.btn:before, button:after {content: " "; position: absolute; }';s+='.btn:active {top:'+w*0.05+'px; box-shadow: 0 '+w*0.02+'px '+w*0.03+'px rgba(0,0,0,.4); }';s+='.play:before {  left: '+w*0.36+'px; top: '+w*0.22+'px; width: 0; height: 0; border: '+w*0.3+'px solid transparent; border-left-width: '+w*0.4+'px; border-left-color: blue;  }';s+='.play:hover:before {border-left-color: yellow; }';s+='.pause:before, .pause:after {display: block; left: '+w*0.29+'px; top: '+w*0.28+'px; width: '+w*0.19+'px; height: '+w*0.47+'px; background-color: blue; }';s+='.pause:after {left: '+w*0.54+'px; }';s+='.pause:hover:before, .pause:hover:after {background-color: yellow; }';s+='</style>';s+='<button id="playBtn" class="btn play" onclick="playToggle()" ></button>';return s;}
function playToggle(onq){if(typeof onq!=='undefined'){my.playQ=onq}else{my.playQ=!my.playQ}
var btn='playBtn';if(my.playQ){document.getElementById(btn).classList.add("pause");document.getElementById(btn).classList.remove("play");anim();}else{document.getElementById(btn).classList.add("play");document.getElementById(btn).classList.remove("pause");}}
function Pt(x,y,name){this.x=x
this.y=y
this.name=typeof name!=='undefined'?name:''}
function Line(pt1,pt2){this.a=pt1;this.b=pt2;}
Line.prototype.getIntersection=function(ln,asSegmentsQ){var A=this.a;var B=this.b;var E=ln.a;var F=ln.b;var a1=B.y-A.y;var b1=A.x-B.x;var c1=B.x*A.y-A.x*B.y;var a2=F.y-E.y;var b2=E.x-F.x;var c2=F.x*E.y-E.x*F.y;var denom=a1*b2-a2*b1;if(denom==0){return null;}
var ip={x:(b1*c2-b2*c1)/denom,y:(a2*c1-a1*c2)/denom}
if(asSegmentsQ){if(Math.pow(ip.x-B.x,2)+Math.pow(ip.y-B.y,2)>Math.pow(A.x-B.x,2)+Math.pow(A.y-B.y,2)){return null;}
if(Math.pow(ip.x-A.x,2)+Math.pow(ip.y-A.y,2)>Math.pow(A.x-B.x,2)+Math.pow(A.y-B.y,2)){return null;}
if(Math.pow(ip.x-F.x,2)+Math.pow(ip.y-F.y,2)>Math.pow(E.x-F.x,2)+Math.pow(E.y-F.y,2)){return null;}
if(Math.pow(ip.x-E.x,2)+Math.pow(ip.y-E.y,2)>Math.pow(E.x-F.x,2)+Math.pow(E.y-F.y,2)){return null;}}
return ip;}
CanvasRenderingContext2D.prototype.drawSpring=function(x1,y1,x2,y2,width){var dx=x2-x1;var dy=y2-y1;var dist=Math.sqrt(dx*dx+dy*dy);var nx=dx/dist;var ny=dy/dist;g.beginPath();g.moveTo(x1,y1);var step=0.1;for(var i=0;i<1-step;i+=step){for(var j=0;j<1;j+=0.1){var xx=x1+dx*(i+j*step);var yy=y1+dy*(i+j*step);xx-=Math.sin(j*Math.PI*2)*ny*width;yy+=Math.sin(j*Math.PI*2)*nx*width;g.lineTo(xx,yy);}}
g.lineTo(x2,y2);g.stroke();}
CanvasRenderingContext2D.prototype.drawSpring2=function(x1,y1,x2,y2,width){var dx=x2-x1;var dy=y2-y1;var dist=Math.sqrt(dx*dx+dy*dy);g.beginPath();g.moveTo(x1,y1);var phase=0
var step=dist/300
for(var d=0;d<=dist;d+=step){var x=x1+(dx/dist)*d+Math.cos(phase+d/dist*(30*Math.PI))*width
var y=y1+(dy/dist)*d+Math.sin(phase+d/dist*(30*Math.PI))*width
g.lineTo(x,y);}
g.lineTo(x2,y2);g.stroke();}