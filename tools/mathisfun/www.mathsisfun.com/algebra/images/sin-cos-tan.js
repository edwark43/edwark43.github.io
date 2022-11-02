var w,h,ratio,el,g,drag,dragIndex,dragging,dots,my={}
function sincostanMain(mode){my.version='0.5';mode=typeof mode!=='undefined'?mode:'sin';console.log("mode",mode);mode='sin'
w=360;h=300;my.lt=100;my.bt=h-50
my.midx=w/2
my.modes=[{id:"sin",name:"Sine",fn:drawTri,pts:[[w/2+80,80,"A"],[w/2+60,my.bt,"B"]]},]
my.mode=my.modes[0];for(var i=0;i<my.modes.length;i++){if(my.modes[i].id==mode){my.mode=my.modes[i];break;}}
console.log('my.mode',my.mode)
my.volQ=true;my.sideN=5
var s="";s+='<div style="position:relative; width:'+w+'px; height:'+h+'px; border: 1px solid hsla(240,100%,90%,1); border-radius: 10px; margin:auto; display:block;">';s+='<canvas id="canvasId" width="'+w+'" height="'+h+'" style="z-index:100;"></canvas>';s+='<div id="title" style="position: absolute; left: 0; top: 3px; width:'+w+'px; font: 20px Arial; color: black; text-align:center; margin:auto; ">&nbsp;</div>';s+='<div id="descr" style="position: absolute; left: 0; top: 31px; width:'+w+'px; font: 17px Arial; color: blue; text-align:center; margin:auto; ">&nbsp;</div>';s+='<div style="font: 16px arial; position: absolute; left: 0; top: 0; width:'+w+'px; text-align:center; ">'
my.funcs=['sin','cos','tan']
s+=radioHTML('','func',my.funcs,'chgFunc');s+='</div>';if(my.mode.sideN==0){s+='<div style="position:absolute; right:5px; bottom:5px; z-index:4;">'
s+='<button onclick="restart()" style="font: 16px Arial;" class="togglebtn" >reset</button>';s+='</div>'
s+='<div id="options" style="position: absolute; width:'+w+'px; left:0px; top:25px;  font: 20px arial; color: black; text-align:center; z-index:4;">';s+='<div style="display: inline-block; font:18px Arial; width: 60px; text-align: right; margin-right:5px;">Sides:</div>'
s+='<input type="range" value="'+my.sideN+'" min="3" max="50" step="1"  style="z-index:2; width:200px; height:10px; border: none; " oninput="chgSides(this.value)" onchange=chgSides(this.value)" autocomplete="off" />';s+='<div id="sides" style="display: inline-block; width:50px; font: 18px Arial; color: #6600cc; text-align: left;">'+my.sideN+'</div>';s+='</div>';}
s+='<div id="copyrt" style="position: absolute; left: 5px; bottom: 3px; font: 10px Arial; color: #6600cc; ">&copy; 2018 MathsIsFun.com  v'+my.version+'</div>';s+='</div>';document.write(s);el=document.getElementById('canvasId');ratio=2;el.width=w*ratio;el.height=h*ratio;el.style.width=w+"px";el.style.height=h+"px";g=el.getContext("2d");g.setTransform(ratio,0,0,ratio,0,0);my.dotRad=10
dragging=false;drag={hold:{x:0,y:0}}
my.prevTgt={typ:'',a:0,b:0};dotsMake()
chgFunc(0)
update()
el.addEventListener("mousedown",onMouseDown,false);el.addEventListener('touchstart',onTouchStart,false);el.addEventListener("mousemove",doPointer,false);}
function chgFunc(n){my.func=my.funcs[n]
console.log("chgFunc=",n,my);update()}
function update(){g.clearRect(0,0,el.width,el.height);my.mode.fn()
dotsDraw()}
function drawTri(){var orig={x:50,y:h-50}
dots[0].x=Math.max(orig.x+5,dots[0].x)
dots[0].y=Math.min(orig.y,dots[0].y)
dots[1].x=Math.max(orig.x+80,dots[1].x)
dots[1].y=orig.y
var r=dots[1].x-orig.x
var ang=-Math.atan2(dots[0].y-orig.y,dots[0].x-orig.x)
var angDeg=Math.round(ang*(180.0/Math.PI))
ang=angDeg*(Math.PI/180.0)
g.strokeStyle='blue'
g.fillStyle='black'
g.beginPath()
g.moveTo(orig.x,orig.y)
g.lineTo(dots[1].x,dots[1].y)
g.fill();g.stroke()
g.fillStyle=g.strokeStyle
g.font="18px Arial";g.beginPath()
var adj=round2(r/10)
g.fillText(adj,(orig.x+dots[1].x)/2,orig.y+20)
g.fill();var hypLen=r/Math.cos(ang)
var top={x:orig.x+hypLen*Math.cos(ang),y:orig.y-hypLen*Math.sin(ang)}
g.strokeStyle='orange'
g.fillStyle='black'
g.beginPath()
g.moveTo(orig.x,orig.y)
g.lineTo(top.x,top.y)
g.fill();g.stroke()
g.fillStyle=g.strokeStyle
g.font="18px Arial";g.textAlign='right'
g.beginPath()
var hyp=round2(dist(dots[1].x-orig.x,orig.y-top.y)/10)
g.fillText(hyp,(orig.x+dots[1].x)/2+10,(orig.y+top.y)/2-10)
g.fill();g.strokeStyle='red'
g.fillStyle='black'
g.beginPath()
g.moveTo(top.x,orig.y)
g.lineTo(top.x,top.y)
g.fill();g.stroke()
g.fillStyle=g.strokeStyle
g.textAlign='left'
g.font="18px Arial";g.beginPath()
var opp=round2((orig.y-top.y)/10)
g.fillText(opp,top.x+5,(orig.y+top.y)/2)
g.fill();g.fillStyle='hsla(240,100%,70%,0.6)'
g.beginPath()
g.moveTo(orig.x,orig.y)
g.arc(orig.x,orig.y,50,-ang,0)
g.fill();g.fillStyle='black'
g.font="18px Arial";g.beginPath()
var angStr=angDeg+'°'
g.fillText(angStr,orig.x+58-ang*15,orig.y-ang*25)
g.fill();var s=''
switch(my.func){case 'sin':s='sin('+angStr+') &asymp; '+opp+'/'+hyp+' &asymp; '+round3(opp/hyp)
break
case 'cos':s='cos('+angStr+') &asymp; '+adj+'/'+hyp+' &asymp; '+round3(adj/hyp)
break
case 'tan':s='tan('+angStr+') &asymp; '+opp+'/'+adj+' &asymp; '+round3(opp/adj)
break
default:}
var div=document.getElementById('descr')
div.innerHTML=s}
function round2(x){return Math.round(x*100)/100}
function round3(x){return Math.round(x*1000)/1000}
function dotsMake(){var i;dots=[];for(i=0;i<my.mode.pts.length;i++){var pt=my.mode.pts[i]
dots.push(new Pt(pt[0],pt[1],pt[2]))}}
function dotsDraw(){var i;g.strokeStyle='#aaaaaa'
g.lineWidth=1
for(i=0;i<dots.length;i++){g.fillStyle="rgba(0, 0, 255, 0.2)";g.beginPath();g.arc(dots[i].x,dots[i].y,my.dotRad,0,2*Math.PI,false);g.closePath();g.fill();g.fillStyle="rgba(0, 0, 0, 0.8)";g.beginPath();g.arc(dots[i].x,dots[i].y,2,0,2*Math.PI,false);g.closePath();g.fill();g.font="14px Arial";g.textAlign='left'
g.fillText(dots[i].name,dots[i].x+5,dots[i].y-5,100);}}
function onTouchStart(evt){var touch=evt.targetTouches[0];evt.clientX=touch.clientX;evt.clientY=touch.clientY;evt.touchQ=true;onMouseDown(evt)}
function onTouchMove(evt){var touch=evt.targetTouches[0];evt.clientX=touch.clientX;evt.clientY=touch.clientY;evt.touchQ=true;onMouseMove(evt);evt.preventDefault();}
function onTouchEnd(){el.addEventListener('touchstart',onTouchStart,false);window.removeEventListener("touchend",onTouchEnd,false);if(dragging){dragging=false;window.removeEventListener("touchmove",onTouchMove,false);}}
function doPointer(e){if(my.playQ)return
var bRect=el.getBoundingClientRect();var mouseX=(e.clientX-bRect.left)*(el.width/ratio/bRect.width);var mouseY=(e.clientY-bRect.top)*(el.height/ratio/bRect.height);var inQ=false;for(var i=0;i<dots.length;i++){if(hitTest(dots[i],mouseX,mouseY)){inQ=true;}}
if(inQ){document.body.style.cursor="pointer";}else{document.body.style.cursor="default";}}
function onMouseDown(evt){if(my.playQ)return
var i;var highestIndex=-1;var bRect=el.getBoundingClientRect();var mouseX=(evt.clientX-bRect.left)*(el.width/ratio/bRect.width);var mouseY=(evt.clientY-bRect.top)*(el.height/ratio/bRect.height);for(i=0;i<dots.length;i++){if(hitTest(dots[i],mouseX,mouseY)){dragging=true;if(i>highestIndex){drag.hold.x=mouseX-dots[i].x;drag.hold.y=mouseY-dots[i].y;highestIndex=i;dragIndex=i;}}}
if(dragging){if(evt.touchQ){window.addEventListener('touchmove',onTouchMove,false);}else{window.addEventListener("mousemove",onMouseMove,false);}}
if(evt.touchQ){el.removeEventListener("touchstart",onTouchStart,false);window.addEventListener("touchend",onTouchEnd,false);}else{el.removeEventListener("mousedown",onMouseDown,false);window.addEventListener("mouseup",onMouseUp,false);}
if(evt.preventDefault){evt.preventDefault();}
else if(evt.returnValue){evt.returnValue=false;}
return false;}
function onMouseUp(){if(my.playQ)return
el.addEventListener("mousedown",onMouseDown,false);window.removeEventListener("mouseup",onMouseUp,false);if(dragging){dragging=false;window.removeEventListener("mousemove",onMouseMove,false);}}
function onMouseMove(evt){if(my.playQ)return
var posX;var posY;var minX=my.dotRad;var maxX=el.width-my.dotRad;var minY=my.dotRad;var maxY=el.height-my.dotRad;var bRect=el.getBoundingClientRect();var mouseX=(evt.clientX-bRect.left)*(el.width/ratio/bRect.width);var mouseY=(evt.clientY-bRect.top)*(el.height/ratio/bRect.height);posX=mouseX-drag.hold.x;posX=(posX<minX)?minX:((posX>maxX)?maxX:posX);posY=mouseY-drag.hold.y;posY=(posY<minY)?minY:((posY>maxY)?maxY:posY);if(dragging){dots[dragIndex].x=posX;dots[dragIndex].y=posY;}
update();}
function hitTest(shape,x,y){var dx;var dy;dx=x-shape.x;dy=y-shape.y;return(dx*dx+dy*dy<my.dotRad*my.dotRad);}
function Pt(x,y,name){this.x=x
this.y=y
this.name=typeof name!=='undefined'?name:''}
function dist(dx,dy){return Math.sqrt(dx*dx+dy*dy);}
function Line(pt1,pt2){this.a=pt1;this.b=pt2;}
Line.prototype.getIntersection=function(ln,asSegmentsQ){var A=this.a;var B=this.b;var E=ln.a;var F=ln.b;var a1=B.y-A.y;var b1=A.x-B.x;var c1=B.x*A.y-A.x*B.y;var a2=F.y-E.y;var b2=E.x-F.x;var c2=F.x*E.y-E.x*F.y;var denom=a1*b2-a2*b1;if(denom==0){return null;}
var ip={x:(b1*c2-b2*c1)/denom,y:(a2*c1-a1*c2)/denom}
if(asSegmentsQ){if(Math.pow(ip.x-B.x,2)+Math.pow(ip.y-B.y,2)>Math.pow(A.x-B.x,2)+Math.pow(A.y-B.y,2)){return null;}
if(Math.pow(ip.x-A.x,2)+Math.pow(ip.y-A.y,2)>Math.pow(A.x-B.x,2)+Math.pow(A.y-B.y,2)){return null;}
if(Math.pow(ip.x-F.x,2)+Math.pow(ip.y-F.y,2)>Math.pow(E.x-F.x,2)+Math.pow(E.y-F.y,2)){return null;}
if(Math.pow(ip.x-E.x,2)+Math.pow(ip.y-E.y,2)>Math.pow(E.x-F.x,2)+Math.pow(E.y-F.y,2)){return null;}}
return ip;}
function radioHTML(prompt,id,lbls,func){var s='';s+='<div style="display:inline-block; border: 1px solid white; border-radius:5px; padding:3px; margin:3px; background-color:rgba(255,255,255,0.5);">';s+=prompt;for(var i=0;i<lbls.length;i++){var lbl=lbls[i];var idi=id+i;var chkStr=(i==0)?' checked ':'';s+='<input id="'+idi+'" type="radio" name="'+id+'" value="'+lbl+'" onclick="'+func+'('+i+');" autocomplete="off" '+chkStr+' >';s+='<label for="'+idi+'">'+lbl+' </label>';}
s+='</div>';return s;}