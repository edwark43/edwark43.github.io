let w,h,ratio,el,g,poly,dragQ,my={};function areacoordsMain(mode=5){let version='0.896'
my.mode=mode
my.modePts=5;if(isNaN(my.mode)){}else{my.modePts=Number(my.mode);}
console.log("my.mode",my.mode,my.modePts);let canvasid="canvas"+my.mode;my.titleid="title"+my.mode;my.infoid="info"+my.mode;dragQ=false;my.dragScreenQ=false;w=540;h=360;my.graphWd=w;my.graphHt=h;let s='';s+='<style>input[type="radio"]:checked+label {font-weight: bold;}</style>';s+='<style>'
s+='.btn { display: inline-block; position: relative; text-align: center; margin: 2px; text-decoration: none; font: bold 14px/25px Arial, sans-serif; color: #268; border: 1px solid #88aaff; border-radius: 10px;cursor: pointer; background: linear-gradient(to top right, rgba(170,190,255,1) 0%, rgba(255,255,255,1) 100%); outline-style:none;}'
s+='.btn:hover { background: linear-gradient(to top, rgba(255,255,0,1) 0%, rgba(255,255,255,1) 100%); }'
s+='.yy { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(255,220,130,1) 0%, rgba(255,255,255,1) 100%);  }'
s+='.hi { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(130,220,255,1) 0%, rgba(255,255,255,1) 100%); box-shadow: 2px 2px 6px #66a; }'
s+='.lo { border: solid 2px #cccccc; background: linear-gradient(to top, rgba(170,170,170,1) 0%, rgba(205,205,205,1) 100%);  }'
s+='</style>'
s+='<div style="position:relative; width:'+w+'px; height:'+h+'px; margin:auto; display:block; border: 2px solid lightblue; box-shadow: 0px 0px 9px 5px rgba(0,0,68,0.46);">';s+='<canvas id="'+canvasid+'" width="'+w+'" height="'+h+'" style="z-index:10;"></canvas>';s+='<div style="position:absolute; left:95px; top:3px; ">';s+='<div id="'+my.titleid+'" style="font: bold 26px arial; position:absolute; left:0px; top:0px; width:540px; text-align:left; z-index:-1;">Title</div>';s+='<div id="'+my.infoid+'" style="font: bold 15px arial; color: orange; position:absolute; left:0px; top:30px; width:540px; text-align:left; z-index:-1;">Info</div>';s+='</div>';if(isNaN(my.mode)){s+='<div id="btns0" style="position:absolute; left:15px; top:3px;">';s+='<button id="upBtn" style="color: #000aae; font-size: 20px;" class="btn"  onclick="numUp()" >&#x25B2;</button>';s+='<br>';s+='<button id="dnBtn" style="color: #000aae; font-size: 20px;" class="btn"  onclick="numDn()" >&#x25BC;</button>';s+='</div>';}
let btns=[{id:'anglesBtn',name:'Angles'},{id:'sidesBtn',name:'Sides'},{id:'diagsBtn',name:'Diags'},{id:'coordsBtn',name:'Coords'},{id:'guidesBtn',name:'Guides'},{id:'snapBtn',name:'Snap'},{id:'regBtn',name:'Regular'},]
s+='<div id="btns1" style="position:absolute; right:3px; top:3px;">';btns.map(btn=>{s+=`<button id="${btn.id}" onclick="toggle${btn.name}()" style="z-index:2;" class="btn lo" >${btn.name}</button>`
s+='<br>';})
s+='</div>';s+='<div id="btns2" style="position:absolute; right:3px; bottom:5px; ">';s+='<span style="color:black; font: 13px/20px Arial; vertical-align: top; z-index: 2; ">Zoom:</span>';s+='<input type="range" id="r1"  value="0.5" min="0" max="1" step=".01"  style="z-index:2; width:200px; height:17px; border: none; " oninput="onZoomChg(0,this.value)" onchange="onZoomChg(1,this.value)" />';s+='&nbsp;';s+='<button id="resetBtn" onclick="reset()" style="z-index:2;" class="btn" >Reset</button>';s+='<button id="editBtn" onclick="editpop()" style="z-index:2;" class="btn" >Edit</button>';s+='</div>';s+='<div id="editpop" style="position:absolute; left:-450px; top:40px; padding: 5px; border: 1px solid red; border-radius: 9px; background-color: #88aaff; box-shadow: 10px 10px 5px 0px rgba(40,40,40,0.75); z-index:1; transition: all linear 0.3s; opacity:0; ">';s+='<textarea  id="editbox" value="ddd" style="width: 400px; height: 120px; font: 16px Arial; border: 1px solid red; border-radius: 9px; background-color: #eeeeff; display: block;">';s+='</textarea >';s+='<div style="float:right; margin: 0 0 5px 10px;">';s+='<button onclick="editYes()" style="z-index:2; font: 22px Arial;" class="btn" >&#x2714;</button>';s+='<button onclick="editNo()" style="z-index:2; font: 22px Arial;" class="btn" >&#x2718;</button>';s+='</div>';s+='</div>';s+='<div style="font: 11px Arial; color: #6600cc; position:absolute; right:150px; bottom:2px;">&copy; 2020 MathsIsFun.com  v'+version+'</div>';s+='</div>';document.write(s);el=document.getElementById(canvasid);ratio=2;el.width=w*ratio;el.height=h*ratio;el.style.width=w+"px";el.style.height=h+"px";g=el.getContext("2d");g.setTransform(ratio,0,0,ratio,0,0);my.currZoom=1;my.sttRect=[-1,-2.2,11,7.5];my.coords=new Coords(0,0,w,h,my.sttRect[0],my.sttRect[1],my.sttRect[2],my.sttRect[3],true);this.graph=new Graph(g,my.coords);my.dragNo=0;my.anglesQ=false;my.coordsQ=false;my.diagsQ=false;my.sidesQ=false;my.guidesQ=false;my.snapQ=false;my.regQ=false;poly=new Poly();if(my.mode=='coords'){my.modePts=3;}
makeShapes();if(my.mode=='coords'){document.getElementById('anglesBtn').style.visibility='hidden';document.getElementById('diagsBtn').style.visibility='hidden';toggleCoords();}else{}
if(my.mode=="diag"){toggleDiags();}
el.addEventListener("mousedown",mouseDownListener,false);el.addEventListener('touchstart',ontouchstart,false);el.addEventListener("mousemove",dopointer,false);my.exs=[{name:"Triangle",coords:'(4.26,5.27), (6.16,1.33), (1.80,1.65)'},{name:"Rectangle",coords:'(7.50,4.50), (7.50,1.00), (3.50,1.00), (3.50,4.50)'},{name:"Circl-ish",coords:'(6.01,4.99), (6.96,4.77), (7.74,4.18), (8.21,3.32), (8.29,2.34), (7.97,1.42), (7.30,0.71), (6.39,0.33), (5.42,0.35), (4.53,0.77), (3.89,1.51), (3.61,2.44), (3.73,3.41), (4.24,4.25), (5.04,4.81)'},{name:"Tilted Square",coords:'(6.91,5.15), (7.59,1.36), (3.80,0.68), (3.12,4.47)'},{name:"Pentagon",coords:'(6.09,5.80), (2.68,4.90), (2.48,1.38), (5.76,0.10), (8.00,2.83)'},];doType();}
function exNext(){my.exNo++
if(my.exNo>=my.exs.length)my.exNo=0
let coordStr=my.exs[my.exNo].coords
decodeCSV(coordStr)}
function getDescr(){let polyNames=["","","","Triangle","Quadrilateral","Pentagon","Hexagon","Heptagon","Octagon","Nonagon","Decagon","Hendecagon","Dodecagon","Triskaidecagon ","Tetrakaidecagon ","Pentadecagon","Hexakaidecagon ","Heptadecagon","Octakaidecagon ","Enneadecagon","Icosagon"];let area=poly.getArea();let descrStr="";let infoStr="";if(poly.isComplex()){descrStr+="Complex ";infoStr="(Shape intersects itself.)";}else{if(poly.isConcave()){descrStr+="Concave ";}else{if(poly.isRegular(0.01)){if(poly.pts.length>4){descrStr+="Regular ";}}}
infoStr="Area = "+fmt(area,4);}
if(poly.pts.length<polyNames.length){descrStr+=polyNames[poly.pts.length];}else{descrStr+=poly.pts.length.toString()+"-gon";}
if(my.mode=="diag"){infoStr=poly.getDiagCount()+" Diagonals";}
if(my.mode=="coords"){descrStr=''
infoStr=''}
return[descrStr,infoStr];}
function editpop(){console.log("editpop");let pop=document.getElementById('editpop');pop.style.transitionDuration="0.3s";pop.style.opacity=1;pop.style.zIndex=12;pop.style.left='100px';document.getElementById('editbox').value=getPts();}
function editYes(){let pop=document.getElementById('editpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-500px';let s=document.getElementById('editbox').value;console.log("editYes",s);decodeCSV(s);}
function editNo(){let pop=document.getElementById('editpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-500px';}
function getPts(){let s='';for(let i=0;i<poly.pts.length;i++){if(i>0)s+=', ';s+='(';s+=poly.pts[i].x.toFixed(my.coords.decDigN);s+=',';s+=poly.pts[i].y.toFixed(my.coords.decDigN);s+=')';}
return s;}
function decodeCSV(s){s=s.replace(/\s/g,"");s=s.replace(/\)\,\(/g,"~");s=s.replace(/\)\(/g,"~");s=s.replace(/\)/g,"");s=s.replace(/\(/g,"");s=s.replace(/\,/g,"_");decode(s);}
function decode(s){let a=s.split("~");poly.pts=[];for(let i=0;i<a.length;i++){let s1=a[i];let xy=s1.split("_");if(xy.length>=2){poly.pts.push(new Pt(Number(xy[0]),Number(xy[1])));}}
poly.pts2pxs()
doType();}
function reset(){my.coords=new Coords(0,0,w,h,my.sttRect[0],my.sttRect[1],my.sttRect[2],my.sttRect[3],true);makeShapes();update();}
function update(){doType();}
function getNum(){return parseInt(my.modePts);}
function numDn(){let num=getNum();if(num>3){num--;chgNumPts(num);}}
function numUp(){let num=getNum();if(num<=100){num++;chgNumPts(num);}}
function chgNumPts(n){my.modePts=n;makeShapes();doType();}
function toggleAngles(){my.anglesQ=!my.anglesQ;btn("anglesBtn",my.anglesQ);update();}
function toggleCoords(){my.coordsQ=!my.coordsQ;btn("coordsBtn",my.coordsQ);update();}
function toggleGuides(){my.guidesQ=!my.guidesQ;btn("guidesBtn",my.guidesQ);update();}
function toggleDiags(){my.diagsQ=!my.diagsQ;btn("diagsBtn",my.diagsQ);update();}
function toggleSides(){my.sidesQ=!my.sidesQ;btn("sidesBtn",my.sidesQ);update();}
function toggleRegular(){my.regQ=!my.regQ;btn("regBtn",my.regQ);update();}
function toggleSnap(){my.snapQ=!my.snapQ;btn("snapBtn",my.snapQ);update();}
function btn(btn,onq){if(onq){document.getElementById(btn).classList.add("hi");document.getElementById(btn).classList.remove("lo");}else{document.getElementById(btn).classList.add("lo");document.getElementById(btn).classList.remove("hi");}}
function ontouchstart(evt){let touch=evt.targetTouches[0];evt.clientX=touch.clientX;evt.clientY=touch.clientY;evt.touchQ=true;mouseDownListener(evt)}
function ontouchmove(evt){let touch=evt.targetTouches[0];evt.clientX=touch.clientX;evt.clientY=touch.clientY;evt.touchQ=true;mouseMoveListener(evt);evt.preventDefault();}
function ontouchend(evt){el.addEventListener('touchstart',ontouchstart,false);window.removeEventListener("touchend",ontouchend,false);if(dragQ){dragQ=false;window.removeEventListener("touchmove",ontouchmove,false);}}
function dopointer(e){let bRect=el.getBoundingClientRect();let mouseX=(e.clientX-bRect.left)*(el.width/ratio/bRect.width);let mouseY=(e.clientY-bRect.top)*(el.height/ratio/bRect.height);let overQ=false;for(let i=0;i<poly.pxs.length;i++){if(hitTest(poly.pxs[i],mouseX,mouseY)){overQ=true;my.dragNo=i;}}
if(overQ){document.body.style.cursor="pointer";}else{document.body.style.cursor="default";}}
function mouseDownListener(evt){let i;let highestIndex=-1;let bRect=el.getBoundingClientRect();let mouseX=(evt.clientX-bRect.left)*(el.width/ratio/bRect.width);let mouseY=(evt.clientY-bRect.top)*(el.height/ratio/bRect.height);my.prevX=mouseX;my.prevY=mouseY;dragQ=false;my.dragScreenQ=false;for(i=0;i<poly.pxs.length;i++){if(hitTest(poly.pxs[i],mouseX,mouseY)){my.dragNo=i;dragQ=true;if(i>highestIndex){my.dragHoldX=mouseX-poly.pxs[i].x;my.dragHoldY=mouseY-poly.pxs[i].y;highestIndex=i;my.dragNo=i;}}}
if(!dragQ){dragQ=true;my.dragScreenQ=true;}
if(evt.touchQ){window.addEventListener('touchmove',ontouchmove,false);}else{window.addEventListener("mousemove",mouseMoveListener,false);}
console.log("mouseDownListener",dragQ,my.dragScreenQ,highestIndex);doType();if(evt.touchQ){el.removeEventListener("touchstart",ontouchstart,false);window.addEventListener("touchend",ontouchend,false);}else{el.removeEventListener("mousedown",mouseDownListener,false);window.addEventListener("mouseup",mouseUpListener,false);}
if(evt.preventDefault){evt.preventDefault();}
else if(evt.returnValue){evt.returnValue=false;}
return false;}
function mouseUpListener(evt){dragQ=false;el.addEventListener("mousedown",mouseDownListener,false);window.removeEventListener("mouseup",mouseUpListener,false);window.removeEventListener("mousemove",mouseMoveListener,false);}
function mouseMoveListener(evt){let posX;let posY;let shapeRad=poly.pts[my.dragNo].rad;let minX=shapeRad;let maxX=el.width-shapeRad;let minY=shapeRad;let maxY=el.height-shapeRad;let bRect=el.getBoundingClientRect();let mouseX=(evt.clientX-bRect.left)*(el.width/ratio/bRect.width);let mouseY=(evt.clientY-bRect.top)*(el.height/ratio/bRect.height);if(my.dragScreenQ){let moveX=my.prevX-mouseX;let moveY=mouseY-my.prevY;if(Math.abs(moveX)>1||Math.abs(moveY)>1){my.coords.drag(moveX,moveY);my.prevX=mouseX;my.prevY=mouseY;poly.pxs=[]
for(let i=0;i<poly.pts.length;i++){let pt=new Pt(my.coords.toXPix(poly.pts[i].x),my.coords.toYPix(poly.pts[i].y));poly.pxs.push(pt)}}}else{posX=mouseX-my.dragHoldX;posX=(posX<minX)?minX:((posX>maxX)?maxX:posX);posY=mouseY-my.dragHoldY;posY=(posY<minY)?minY:((posY>maxY)?maxY:posY);let xVal=my.coords.toXVal(posX)
let yVal=my.coords.toYVal(posY)
if(my.snapQ){let fact=my.coords.tick
console.log('fact',fact)
xVal=Math.round(xVal/fact)*fact
yVal=Math.round(yVal/fact)*fact
posX=my.coords.toXPix(xVal)
posY=my.coords.toYPix(yVal)}
poly.pts[my.dragNo].x=xVal
poly.pts[my.dragNo].y=yVal
poly.pxs[my.dragNo].x=posX;poly.pxs[my.dragNo].y=posY;}
doType();}
function hitTest(shape,mx,my){let dx;let dy;dx=mx-shape.x;dy=my-shape.y;return(dx*dx+dy*dy<shape.rad*shape.rad);}
function onZoomChg(n,v){let zoom=Math.pow(4,v*2-1)
let scaleBy=zoom/my.currZoom;my.coords.scale(scaleBy);my.currZoom*=scaleBy;if(n==1){my.currZoom=1;document.getElementById('r1').value=0.5;}
poly.pxs=[]
for(let i=0;i<poly.pts.length;i++){let pt=new Pt(my.coords.toXPix(poly.pts[i].x),my.coords.toYPix(poly.pts[i].y));poly.pxs.push(pt)}
doType();}
function doType(){g.clearRect(0,0,el.width,el.height);this.graph.drawGraph();if(my.regQ){poly.makeRegular();poly.pts=[];for(let i=0;i<poly.pxs.length;i++){let pt=new Pt(my.coords.toXVal(poly.pxs[i].x),my.coords.toYVal(poly.pxs[i].y));poly.pts.push(pt);}}
drawPts();let descr=['',''];if(my.mode=='coords'){}else{descr=getDescr();}
document.getElementById(my.titleid).innerHTML=descr[0];document.getElementById(my.infoid).innerHTML=descr[1];}
function getRegular(midX,midY,radius,sttAngle,n){let pts=[];let dAngle=Math.PI*2/n;for(let i=0;i<n;i++){let angle=sttAngle+i*dAngle;let x=midX+radius*Math.cos(angle);let y=midY+radius*Math.sin(angle);pts.push(new Pt(x,y));}
return pts;}
function makeShapes(){let i;let pos=getRegular(5,3,3,1.2,my.modePts);poly.pts=[];poly.pxs=[];for(i=0;i<my.modePts;i++){poly.pts.push(pos[i]);let pt=new Pt(my.coords.toXPix(poly.pts[i].x),my.coords.toYPix(poly.pts[i].y));poly.pxs.push(pt);}
console.log("makeShapes",my.modePts,poly.pts,poly.pxs);}
function drawPts(){let i;g.strokeStyle="rgba(0, 0, 255, 0.5)";g.fillStyle="rgba(255, 255, 100, 0.1)";let pts=poly.pxs
let dbg="";for(i=0;i<pts.length;i++){let pt=pts[i];g.fillStyle="rgba(0, 0, 255, 0.3)";g.beginPath();g.arc(pt.x,pt.y,pt.rad,0,2*Math.PI,false);g.closePath();g.fill();g.fillStyle="rgba(0, 0, 0, 0.8)";g.beginPath();g.arc(pt.x,pt.y,2,0,2*Math.PI,false);g.closePath();g.fill();g.textAlign="left";if(my.coordsQ){g.font="bold 14px Arial";let txt='(';txt+=fmtFix(poly.pts[i].x,my.coords.decDigN);txt+=', ';txt+=fmtFix(poly.pts[i].y,my.coords.decDigN);txt+=')';g.fillText(txt,pt.x+5,pt.y-9);}else{g.font="14px Arial";g.fillText(String.fromCharCode(65+i),poly.pts[i].x+5,poly.pts[i].y-9);}
dbg+='['+Math.floor(poly.pts[i].x)+","+Math.floor(poly.pts[i].y)+"],";}
poly.pxs=pts;poly.updateMe();g.strokeStyle="rgba(255, 0, 0, 0.5)";g.lineWidth=1.5;if(my.guidesQ){let orig={x:my.coords.toXPix(0),y:my.coords.toYPix(0)};poly.drawGuides(g,orig);}
g.strokeStyle="rgba(0, 0, 255, 0.5)";g.fillStyle="rgba(255, 255, 100, 0.1)";g.lineWidth=1;let drawShapeQ=true;if(my.mode=='coords'){drawShapeQ=my.sidesQ;}
if(drawShapeQ)poly.drawLines(g);if(my.anglesQ)poly.drawAngles(g);if(my.diagsQ)poly.drawDiags(g);if(my.sidesQ)poly.drawSides(g);}
class Poly{constructor(){this.pts=[];this.pxs=[];}
updateMe(){setAngles(this.pxs);this.sides=getSides(this.pxs);}
insideQ(x,y){var inside=false;for(var i=0,j=this.pts.length-1;i<this.pts.length;j=i++){let xi=this.pts[i].x
let yi=this.pts[i].y
let xj=this.pts[j].x
let yj=this.pts[j].y
var intersect=((yi>y)!=(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi);if(intersect)inside=!inside;}
return inside;}
pts2pxs(){this.pxs=[]
for(let i=0;i<this.pts.length;i++){let pt=this.pts[i]
let px=new Pt(my.coords.toXPix(pt.x),my.coords.toYPix(pt.y));this.pxs.push(px);}}
extents(borderFactor=1){let xStt,xEnd,yStt,yEnd;for(let i=0;i<this.pts.length;i++){let pt=this.pts[i];if(i==0){xStt=pt.x;xEnd=pt.x;yStt=pt.y;yEnd=pt.y;}else{xStt=Math.min(xStt,pt.x);xEnd=Math.max(xEnd,pt.x);yStt=Math.min(yStt,pt.y);yEnd=Math.max(yEnd,pt.y);}}
let xMid=(xStt+xEnd)/2;let xhalfspan=borderFactor*(xEnd-xStt)/2;xStt=xMid-xhalfspan;xEnd=xMid+xhalfspan;let yMid=(yStt+yEnd)/2;let yhalfspan=borderFactor*(yEnd-yStt)/2;yStt=yMid-yhalfspan;yEnd=yMid+yhalfspan;return{xStt:xStt,xEnd:xEnd,yStt:yStt,yEnd:yEnd,xSpan:xEnd-xStt,ySpan:yEnd-yStt}}
drawDiags(g){g.strokeStyle="#666666";let diagCount=0;for(let i=0;i<this.pxs.length-2;i++){for(let j=i+2;j<this.pxs.length;j++){if(i==0&&j==this.pxs.length-1){}else{g.beginPath();g.moveTo(this.pxs[i].x,this.pxs[i].y);g.lineTo(this.pxs[j].x,this.pxs[j].y);g.stroke();diagCount++;}}}}
drawLines(g){g.beginPath();for(let i=0;i<this.pxs.length;i++){g.lineTo(this.pxs[i].x,this.pxs[i].y);}
g.closePath();g.fill();g.stroke();}
drawGuides(g,orig){let ptsLen=this.pxs.length;for(let i=0;i<ptsLen;i++){let pt=this.pxs[i];g.beginPath();g.strokeStyle="rgba(0, 0, 0, 0.5)";g.moveTo(orig.x,pt.y);g.lineTo(pt.x,pt.y);g.stroke();g.beginPath();g.moveTo(pt.x,pt.y);g.lineTo(pt.x,orig.y);g.stroke();}}
drawSides(g){let ptC=new Pt();ptC.setAvg(this.pxs);g.fillStyle="#000000";g.font="bold 12px Arial";let ptM=new Pt();let ptsLen=this.pxs.length;for(let i=0;i<ptsLen;i++){ptM.setAvg([this.pxs[i],this.pxs[loop(i,0,ptsLen-1,1)]]);ptM.interpolate(ptM,ptC,1.2);let side=this.sides[loop(i-1,0,ptsLen-1,1)];side=(my.coords.xScale*side).toFixed(2);g.fillText(side,ptM.x-10,ptM.y+5,100);}}
isConcave(){for(let i=0;i<this.pxs.length;i++){let pt=this.pxs[i];let angDeg=Math.round(pt.getAngle()*180/Math.PI);if(angDeg>180)
return true;}
return false;}
drawAngles(g){let angSum=0;let angDescr="";let angs=[];for(let i=0;i<this.pxs.length;i++){let pt=this.pxs[i];let angDeg=Math.round(pt.getAngle()*180/Math.PI);let d=30;if(angDeg==90){g.strokeStyle='#888888';g.drawBox(pt.x,pt.y,25,pt.angleOut-Math.PI/2);}else{if(angDeg>90){g.strokeStyle='#ff0000';d=Math.max(20,30-(angDeg-90)/6);}else{g.strokeStyle='#4444FF';}
g.fillStyle="rgba(0, 0, 255, 0.3)";g.beginPath();g.moveTo(pt.x,pt.y);g.arc(pt.x,pt.y,d,pt.angleIn,pt.angleOut,false);g.closePath();g.fill();}
let ang=this.userAngle(pt.getAngle());if(i<this.pxs.length-1){angSum+=ang;}else{ang=(this.pxs.length-2)*180-angSum;if(ang<0)
ang+=360;}
angs[i]=ang;angDescr+=ang+"° + ";let aMid=(pt.angleIn+pt.angleOut)/2;let txtPt=new Pt(0,0);txtPt.x=pt.x+(d+15)*Math.cos(aMid)-0;txtPt.y=pt.y+(d+15)*Math.sin(aMid)-0;g.fillStyle="rgba(0, 0, 255, 1)";g.fillText(Math.round(ang)+"°",txtPt.x-10,txtPt.y+5,100);}
return angs;}
userAngle(x){return Math.round(x*180/Math.PI,this.dec);}
getArea(){let a=0;for(let i=0;i<this.pts.length;i++){let pt0=this.pts[i];let pt1=this.pts[loop(i,0,this.pxs.length-1,1)];let a1=(pt0.x*pt1.y-pt0.y*pt1.x);a+=a1;}
a=Math.abs(a)/2;return a;}
getDiagCount(){let n=this.pxs.length;return n*(n-3)/2;}
isComplex(){let lns=[];for(let i=0;i<this.pxs.length;i++){lns.push(new Line(this.pxs[i],this.pxs[loop(i,0,this.pxs.length-1,1)]));}
for(let i=0;i<this.pxs.length-1;i++){for(let j=i+2;j<this.pxs.length;j++){if(i==0&&j==this.pxs.length-1)continue;let ln=lns[i];if(ln.isIntersect(lns[j])){if(ln.getIntersection(lns[j],true)==null){}else{return true;}}}}
return false;}
isRegular(tolerRatio){tolerRatio=typeof tolerRatio!=='undefined'?tolerRatio:0.001;let ptC=new Pt();ptC.setAvg(this.pxs);let rads=[];let lens=[];for(let i=0;i<this.pxs.length;i++){let pt=this.pxs[i];rads[i]=dist(pt.x-ptC.x,pt.y-ptC.y);let nxt=(i+1)%this.pxs.length;let ptN=this.pxs[nxt];lens[i]=dist(pt.x-ptN.x,pt.y-ptN.y);}
let radAvg=avg(rads);let lenAvg=avg(lens);let toler=radAvg*tolerRatio;let sameQ=true;for(let i=0;i<this.pxs.length;i++){if(!isNear(rads[i],radAvg,toler)){sameQ=false;break;}
if(!isNear(lens[i],lenAvg,toler)){sameQ=false;break;}}
return sameQ;}
makeRegular(){let ptC=new Pt();ptC.setAvg(this.pxs);let rad=1;let avgQ=false;if(avgQ){let rads=[];for(let i=0;i<this.pxs.length;i++){let pt=this.pxs[i];rads[i]=dist(pt.x-ptC.x,pt.y-ptC.y);}
rad=avg(rads);}else{let pt;if(my.dragNo<this.pxs.length){pt=this.pxs[my.dragNo];}else{pt=this.pxs[0];}
rad=dist(pt.x-ptC.x,pt.y-ptC.y);}
let sttAngle=Math.atan2(this.pxs[0].y-ptC.y,this.pxs[0].x-ptC.x);let dAngle=Math.PI*2/this.pxs.length;for(let i=0;i<this.pxs.length;i++){let angle=sttAngle+i*dAngle;this.pxs[i].x=ptC.x+rad*Math.cos(angle);this.pxs[i].y=ptC.y+rad*Math.sin(angle);}}}
class Pt{constructor(ix,iy){this.x=ix;this.y=iy;this.rad=9;this.color="rgb("+0+","+0+","+255+")";this.prevx=0;this.prevy=0;this.prevQ=false
this.angleIn=0;this.angleOut=0;}
setxy(ix,iy){this.x=ix;this.y=iy;}
setPrevPt(){this.prevx=this.x;this.prevy=this.y;this.prevQ=true;}
getAngle(){return this.angleOut-this.angleIn;}
drawMe(g){g.fillStyle="rgba(0, 0, 255, 0.3)";g.beginPath();g.arc(this.x,this.y,20,0,2*Math.PI,false);g.closePath();g.fill();}
getAvg(pts){let xSum=0;let ySum=0;for(let i=0;i<pts.length;i++){xSum+=pts[i].x;ySum+=pts[i].y;}
let newPt=new Pt(xSum/pts.length,ySum/pts.length);newPt.x=xSum/pts.length;newPt.y=ySum/pts.length;return newPt;}
setAvg(pts){this.setPrevPt();let newPt=this.getAvg(pts);this.x=newPt.x;this.y=newPt.y;}
interpolate(pt1,pt2,f){this.setPrevPt();this.x=pt1.x*f+pt2.x*(1-f);this.y=pt1.y*f+pt2.y*(1-f);}
translate(pt,addQ){addQ=typeof addQ!=='undefined'?addQ:true;let t=new Pt(this.x,this.y);t.x=this.x;t.y=this.y;if(addQ){t.x+=pt.x;t.y+=pt.y;}else{t.x-=pt.x;t.y-=pt.y;}
return t;}
multiply(fact){return new Pt(this.x*fact,this.y*fact);}
multiplyMe(fact){this.x*=fact;this.y*=fact;}}
function isNear(a,b,toler){if(Math.abs(a-b)<=toler){return true;}else{return false;}}
function setAngles(pts){let CW=getClockwise(pts);let numPoints=pts.length;for(let i=0;i<numPoints;i++){let pt=pts[i];let ptm1=pts[loop(i,0,numPoints-1,-1)];let ptp1=pts[loop(i,0,numPoints-1,1)];let a1=Math.atan2(ptm1.y-pt.y,ptm1.x-pt.x);let a2=Math.atan2(ptp1.y-pt.y,ptp1.x-pt.x);if(CW==1){let temp=a1;a1=a2;a2=temp;}
if(a1>a2)
a2+=2*Math.PI;pt.angleIn=a1;pt.angleOut=a2;}}
function getClockwise(pts){let numPoints=pts.length;let count=0;for(let i=0;i<numPoints;i++){let pt=pts[i];let ptm1=pts[loop(i,0,numPoints-1,-1)];let ptp1=pts[loop(i,0,numPoints-1,1)];let z=0;z+=(pt.x-ptm1.x)*(ptp1.y-pt.y);z-=(pt.y-ptm1.y)*(ptp1.x-pt.x);if(z<0){count--;}else if(z>0){count++;}}
if(count>0)
return(1);if(count==0)
return(0);return(-1);}
function getSides(pts){let numPoints=pts.length;let sides=[];for(let i=0;i<numPoints;i++){let pt=pts[i];let ptp1=pts[loop(i,0,numPoints-1,1)];sides.push(dist(ptp1.x-pt.x,ptp1.y-pt.y));}
return(sides);}
function avg(vals){let sum=0;let count=vals.length;for(let i=0;i<count;i++){sum+=vals[i];}
return(sum/count);}
function dist(dx,dy){return(Math.sqrt(dx*dx+dy*dy));}
function loop(currNo,minNo,maxNo,incr){currNo+=incr;let range=maxNo-minNo+1;if(currNo<minNo){currNo=maxNo-(-currNo+maxNo)%range;}
if(currNo>maxNo){currNo=minNo+(currNo-minNo)%range;}
return currNo;}
function constrain(min,val,max){return(Math.min(Math.max(min,val),max));}
class Line{constructor(pt1,pt2){this.a=pt1;this.b=pt2;}
isIntersect(b){let a=this;if(this.ccw(a.a,a.b,b.a)*this.ccw(a.a,a.b,b.b)>0){return false;}
if(this.ccw(b.a,b.b,a.a)*this.ccw(b.a,b.b,a.b)>0){return false;}
return true;}
ccw(a,b,c){return((b.x-a.x)*(c.y-a.y)-(c.x-a.x)*(b.y-a.y));}
getIntersection(ln,asSegmentsQ){let A=this.a;let B=this.b;let E=ln.a;let F=ln.b;let a1=B.y-A.y;let b1=A.x-B.x;let c1=B.x*A.y-A.x*B.y;let a2=F.y-E.y;let b2=E.x-F.x;let c2=F.x*E.y-E.x*F.y;let denom=a1*b2-a2*b1;if(denom==0){return null;}
let ip=new Pt();ip.x=(b1*c2-b2*c1)/denom;ip.y=(a2*c1-a1*c2)/denom;if(asSegmentsQ){if(Math.pow(ip.x-B.x,2)+Math.pow(ip.y-B.y,2)>Math.pow(A.x-B.x,2)+Math.pow(A.y-B.y,2)){return null;}
if(Math.pow(ip.x-A.x,2)+Math.pow(ip.y-A.y,2)>Math.pow(A.x-B.x,2)+Math.pow(A.y-B.y,2)){return null;}
if(Math.pow(ip.x-F.x,2)+Math.pow(ip.y-F.y,2)>Math.pow(E.x-F.x,2)+Math.pow(E.y-F.y,2)){return null;}
if(Math.pow(ip.x-E.x,2)+Math.pow(ip.y-E.y,2)>Math.pow(E.x-F.x,2)+Math.pow(E.y-F.y,2)){return null;}}
return ip;}
getMidPt(){return new Pt((this.a.x+this.b.x)/2,(this.a.y+this.b.y)/2);}
getClosestPoint(toPt,inSegmentQ){let AP=toPt.translate(this.a,false);let AB=this.b.translate(this.a,false);let ab2=AB.x*AB.x+AB.y*AB.y;let ap_ab=AP.x*AB.x+AP.y*AB.y;let t=ap_ab/ab2;if(inSegmentQ){t=constrain(0,t,1);}
return this.a.translate(AB.multiply(t));}
setLen(newLen,fromMidQ){fromMidQ=typeof fromMidQ!=='undefined'?fromMidQ:true;let len=this.getLength();if(fromMidQ){let midPt=this.getMidPt();let halfPt=new Pt(this.a.x-midPt.x,this.a.y-midPt.y);halfPt.multiplyMe(newLen/len);this.a=midPt.translate(halfPt);this.b=midPt.translate(halfPt,false);}else{let diffPt=new Pt(this.a.x-this.b.x,this.a.y-this.b.y);diffPt.multiplyMe(newLen/len);this.b=this.a.translate(diffPt,false);}}
getAngle(){return Math.atan2(this.b.y-this.a.y,this.b.x-this.a.x);}}
class Coords{constructor(left,top,width,height,xStt,yStt,xEnd,yEnd,uniScaleQ){this.left=left;this.top=top;this.width=width;this.height=height;this.xStt=xStt;this.yStt=yStt;this.xEnd=xEnd;this.yEnd=yEnd;this.uniScaleQ=uniScaleQ;this.xLogQ=false;this.yLogQ=false;this.xScale;this.yScale;this.calcScale();}
calcScale(){if(this.xLogQ){if(this.xStt<=0)this.xStt=1;if(this.xEnd<=0)this.xEnd=1;}
if(this.yLogQ){if(this.yStt<=0)this.yStt=1;if(this.yEnd<=0)this.yEnd=1;}
let temp;if(this.xStt>this.xEnd){temp=this.xStt;this.xStt=this.xEnd;this.xEnd=temp;}
if(this.yStt>this.yEnd){temp=this.yStt;this.yStt=this.yEnd;this.yEnd=temp;}
this.xSpan=this.xEnd-this.xStt;if(this.xSpan<=0)this.xSpan=0.1;this.xScale=this.xSpan/this.width;this.xLogScale=(Math.log(this.xEnd)-Math.log(this.xStt))/this.width;this.ySpan=this.yEnd-this.yStt;if(this.ySpan<=0)this.ySpan=0.1;this.yScale=this.ySpan/this.height;this.yLogScale=(Math.log(this.yEnd)-Math.log(this.yStt))/this.height;this.maxSpan=Math.max(this.xSpan,this.ySpan)
this.tick=this.toTick(this.maxSpan/50)
let pow10=Math.floor(Math.log(this.maxSpan)*Math.LOG10E)
this.decDigN=3-pow10
if(this.uniScaleQ&&!this.xLogQ&&!this.yLogQ){let newScale=Math.max(this.xScale,this.yScale);this.xScale=newScale;this.xSpan=this.xScale*this.width;let xMid=(this.xStt+this.xEnd)/2;this.xStt=xMid-this.xSpan/2;this.xEnd=xMid+this.xSpan/2;this.yScale=newScale;this.ySpan=this.yScale*this.height;let yMid=(this.yStt+this.yEnd)/2;this.yStt=yMid-this.ySpan/2;this.yEnd=yMid+this.ySpan/2;}
console.log('calcScale',this)}
toTick(val){let index10=Math.floor(Math.log(val)*Math.LOG10E)
let pow10=Math.pow(10,index10)
let mantissa=val/pow10;let ticks=[1,2,5,10]
let best=0
let found=-1
for(let i=0;i<ticks.length;i++){let tick=ticks[i];let score=0.8*tick/mantissa
if(score>1)break
if(score>best){best=score
found=i}}
if(found<0){console.log('Error: toTick',val)
return 1}else{return ticks[found]*pow10}}
getXScale(){return this.xScale;}
getYScale(){return this.yScale;}
scale(factor,xMid,yMid){if(typeof xMid=='undefined')xMid=(this.xStt+this.xEnd)/2;this.xStt=xMid-(xMid-this.xStt)*factor;this.xEnd=xMid+(this.xEnd-xMid)*factor;if(typeof yMid=='undefined')yMid=(this.yStt+this.yEnd)/2;this.yStt=yMid-(yMid-this.yStt)*factor;this.yEnd=yMid+(this.yEnd-yMid)*factor;this.calcScale();}
drag(xPix,yPix){this.xStt+=xPix*this.xScale;this.xEnd+=xPix*this.xScale;this.yStt+=yPix*this.yScale;this.yEnd+=yPix*this.yScale;this.calcScale();}
newCenter(x,y){let xMid=this.xStt+x*this.xScale;let xhalfspan=(this.xEnd-this.xStt)/2;this.xStt=xMid-xhalfspan;this.xEnd=xMid+xhalfspan;let yMid=this.yEnd-y*this.yScale;let yhalfspan=(this.yEnd-this.yStt)/2;this.yStt=yMid-yhalfspan;this.yEnd=yMid+yhalfspan;this.calcScale();}
fitToPts(pts,borderFactor){for(let i=0;i<pts.length;i++){let pt=pts[i];if(i==0){this.xStt=pt.x;this.xEnd=pt.x;this.yStt=pt.y;this.yEnd=pt.y;}else{this.xStt=Math.min(this.xStt,pt.x);this.xEnd=Math.max(this.xEnd,pt.x);this.yStt=Math.min(this.yStt,pt.y);this.yEnd=Math.max(this.yEnd,pt.y);}}
let xMid=(this.xStt+this.xEnd)/2;let xhalfspan=borderFactor*(this.xEnd-this.xStt)/2;this.xStt=xMid-xhalfspan;this.xEnd=xMid+xhalfspan;let yMid=(this.yStt+this.yEnd)/2;let yhalfspan=borderFactor*(this.yEnd-this.yStt)/2;this.yStt=yMid-yhalfspan;this.yEnd=yMid+yhalfspan;this.calcScale();}
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
class Graph{constructor(g,coords){this.g=g;my.coords=coords;this.xLinesQ=true;this.yLinesQ=true;this.xValsQ=true;this.yValsQ=true;this.majorTickClr="rgba(0,0,256,0.2)"
this.minorTickClr="rgba(0,0,256,0.07)"
this.skewQ=false;}
drawGraph(){this.hzAxisY=my.coords.toYPix(0);if(this.hzAxisY<0)this.hzAxisY=0;if(this.hzAxisY>my.coords.height)this.hzAxisY=my.coords.height;this.hzNumsY=this.hzAxisY+14;if(this.hzAxisY>my.coords.height-10)this.hzNumsY=my.coords.height-3;this.vtAxisX=my.coords.toXPix(0);if(this.vtAxisX<0)this.vtAxisX=0;if(this.vtAxisX>my.coords.width)this.vtAxisX=my.coords.width;this.vtNumsX=this.vtAxisX-5;if(this.vtAxisX<10)this.vtNumsX=20;if(my.coords.xLogQ){this.drawLinesLogX();}else{if(this.xLinesQ){this.drawHzLines();}}
if(my.coords.yLogQ){this.drawLinesLogY();}else{if(this.yLinesQ){this.drawVtLines();}}}
drawVtLines(){let g=this.g;g.lineWidth=1;let ticks=my.coords.getTicks(my.coords.xStt,my.coords.xEnd-my.coords.xStt,my.graphWd/100);for(let i=0;i<ticks.length;i++){let tick=ticks[i];let xVal=tick[0];let tickLevel=tick[1];if(tickLevel==0){g.strokeStyle=this.majorTickClr}else{g.strokeStyle=this.minorTickClr}
let xPix=my.coords.toXPix(xVal,false);g.beginPath();g.moveTo(xPix,my.coords.toYPix(my.coords.yStt,false));g.lineTo(xPix,my.coords.toYPix(my.coords.yEnd,false));g.stroke();if(tickLevel==0&&this.xValsQ){g.fillStyle="#0000ff";g.font="bold 12px Verdana";g.textAlign="center";g.fillText(fmt(xVal),xPix,this.hzNumsY);}}
if(this.skewQ)
return;g.lineWidth=1.5;g.strokeStyle="#ff0000";g.beginPath();g.moveTo(this.vtAxisX,my.coords.toYPix(my.coords.yStt,false));g.lineTo(this.vtAxisX,my.coords.toYPix(my.coords.yEnd,false));g.stroke();g.beginPath();g.fillStyle=g.strokeStyle;g.drawArrow(this.vtAxisX,my.coords.toYPix(my.coords.yEnd),15,2,20,10,Math.PI/2,10,false);g.stroke();g.fill();}
drawHzLines(){let g=this.g;g.lineWidth=1;let ticks=my.coords.getTicks(my.coords.yStt,my.coords.yEnd-my.coords.yStt,my.graphHt/100);for(let i=0;i<ticks.length;i++){let tick=ticks[i];let yVal=tick[0];let tickLevel=tick[1];if(tickLevel==0){g.strokeStyle=this.majorTickClr}else{g.strokeStyle=this.minorTickClr}
let yPix=my.coords.toYPix(yVal,false);g.beginPath();g.moveTo(my.coords.toXPix(my.coords.xStt,false),yPix);g.lineTo(my.coords.toXPix(my.coords.xEnd,false),yPix);g.stroke();if(tickLevel==0&&this.yValsQ){g.fillStyle="#ff0000";g.font="bold 12px Verdana";g.textAlign="right";g.fillText(fmt(yVal),this.vtNumsX,yPix+5);}}
if(this.skewQ)
return;g.lineWidth=2;g.strokeStyle="#0000ff";g.beginPath();g.moveTo(my.coords.toXPix(my.coords.xStt,false),this.hzAxisY);g.lineTo(my.coords.toXPix(my.coords.xEnd,false),this.hzAxisY);g.stroke();g.beginPath();g.fillStyle=g.strokeStyle;g.drawArrow(my.coords.toXPix(my.coords.xEnd,false),this.hzAxisY,15,2,20,10,0,10,false);g.stroke();g.fill();}}
CanvasRenderingContext2D.prototype.drawArrow=function(x0,y0,totLen,shaftHt,headLen,headHt,angle,sweep,invertQ){let g=this;let pts=[[0,0],[-headLen,-headHt/2],[-headLen+sweep,-shaftHt/2],[-totLen,-shaftHt/2],[-totLen,shaftHt/2],[-headLen+sweep,shaftHt/2],[-headLen,headHt/2],[0,0]];if(invertQ){pts.push([0,-headHt/2],[-totLen,-headHt/2],[-totLen,headHt/2],[0,headHt/2]);}
for(let i=0;i<pts.length;i++){let cosa=Math.cos(-angle);let sina=Math.sin(-angle);let xPos=pts[i][0]*cosa+pts[i][1]*sina;let yPos=pts[i][0]*sina-pts[i][1]*cosa;if(i==0){g.moveTo(x0+xPos,y0+yPos);}else{g.lineTo(x0+xPos,y0+yPos);}}};CanvasRenderingContext2D.prototype.drawBox=function(midX,midY,radius,angle){g.beginPath();let pts=[[0,0],[Math.cos(angle),Math.sin(angle)],[Math.cos(angle)+Math.cos(angle+Math.PI/2),Math.sin(angle)+Math.sin(angle+Math.PI/2)],[Math.cos(angle+Math.PI/2),Math.sin(angle+Math.PI/2)],[0,0]];for(let i=0;i<pts.length;i++){if(i==0){g.moveTo(midX+radius*pts[i][0],midY+radius*pts[i][1]);}else{g.lineTo(midX+radius*pts[i][0],midY+radius*pts[i][1]);}}
g.stroke();};function fmt(num,digits=14){if(num==Number.POSITIVE_INFINITY)return "undefined";if(num==Number.NEGATIVE_INFINITY)return "undefined";num=num.toPrecision(digits);num=Number(num).toString()
if(num.charAt(num.length-1)==".")num=num.substr(0,num.length-1);if(Math.abs(num)<1e-15)num=0;return num;}
function fmtFix(num,digN=14){let s=Number(num).toFixed(Math.max(0,digN));s=s.replace(/\.0+$/g,"");return s;}