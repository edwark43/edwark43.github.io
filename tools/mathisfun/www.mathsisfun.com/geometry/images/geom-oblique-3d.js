var w,h,ratio,el,g,drag,dragIndex,dragging,dots,my={}
function geomoblique3dMain(mode){my.version='0.622';mode=typeof mode!=='undefined'?mode:'cyl';console.log("mode",mode);w=360;h=300;my.lt=100;my.bt=h-50
my.midx=w/2
my.midy=h/2+20
my.modes=[{id:"cone",name:"Cone",fn:pseudoCone,obq:true,pts:[[w/2+80,80,"A"],[w/2+60,my.bt,"B"]]},{id:"cyl",name:"Cylinder",fn:pseudoCyl,obq:true,pts:[[w/2+50,80,"A"],[w/2+70,my.bt,"B"]]},{id:"cylh",name:"Horizontal Cylinder",fn:pseudoCylHz,obq:false,pts:[[w/2+50,80,"A"],[w/2+70,my.bt,"B"]]},{id:"pyr4",name:"Pyramid",fn:pseudoPyr,sideN:4,obq:true,pts:[[w/2+50,80,"A"],[w/2+70,my.bt-40,"B"]]},{id:"pyrn",name:"Pyramid",fn:pseudoPyrN,sideN:0,obq:true,pts:[[w/2,80,"A"],[w/2+110,my.bt-40,"B"]]},{id:"pri4",name:"Prism",fn:pseudoPrism,sideN:4,obq:true,pts:[[w/2+80,80,"A"],[w/2+70,my.bt-40,"B"]]},{id:"prin",name:"Prism",fn:pseudoPrismN,sideN:0,obq:true,pts:[[w/2,80,"A"],[w/2+70,my.bt-40,"B"]]},{id:"sphere",name:"Sphere",fn:pseudoSphere,sideN:1,obq:false,pts:[[my.midx+80,my.midy,"A"]]},]
my.mode=my.modes[0];for(var i=0;i<my.modes.length;i++){if(my.modes[i].id==mode){my.mode=my.modes[i];break;}}
console.log('my.mode',my.mode)
my.volQ=true;my.sideN=5
var s="";s+='<div style="position:relative; width:'+w+'px; height:'+h+'px; border: 1px solid hsla(240,100%,90%,1); border-radius: 10px; margin:auto; display:block;">';s+='<canvas id="canvasId" width="'+w+'" height="'+h+'" style="z-index:100;"></canvas>';s+='<div id="title" style="position: absolute; left: 0; top: 3px; width:'+w+'px; font: 20px Arial; color: black; text-align:center; margin:auto; ">&nbsp;</div>';s+='<div id="descr" style="position: absolute; left: 0; top: 25px; width:'+w+'px; font: 17px Arial; color: blue; text-align:center; margin:auto; ">&nbsp;</div>';if(my.mode.sideN==0){s+='<div style="position:absolute; right:5px; bottom:5px; z-index:4;">'
s+='<button onclick="restart()" style="font: 16px Arial;" class="togglebtn" >reset</button>';s+='</div>'
s+='<div id="options" style="position: absolute; width:'+w+'px; left:0px; top:25px;  font: 20px arial; color: black; text-align:center; z-index:4;">';s+='<div style="display: inline-block; font:18px Arial; width: 60px; text-align: right; margin-right:5px;">Sides:</div>'
s+='<input type="range" value="'+my.sideN+'" min="3" max="50" step="1"  style="z-index:2; width:200px; height:10px; border: none; " oninput="chgSides(this.value)" onchange=chgSides(this.value)" autocomplete="off" />';s+='<div id="sides" style="display: inline-block; width:50px; font: 18px Arial; color: #6600cc; text-align: left;">'+my.sideN+'</div>';s+='</div>';}
s+='<div id="copyrt" style="position: absolute; left: 5px; bottom: 3px; font: 10px Arial; color: #6600cc; ">&copy; 2018 MathsIsFun.com  v'+my.version+'</div>';s+='</div>';document.write(s);el=document.getElementById('canvasId');ratio=2;el.width=w*ratio;el.height=h*ratio;el.style.width=w+"px";el.style.height=h+"px";g=el.getContext("2d");g.setTransform(ratio,0,0,ratio,0,0);my.dotRad=10
dragging=false;drag={hold:{x:0,y:0}}
my.prevTgt={typ:'',a:0,b:0};dotsMake()
update()
el.addEventListener("mousedown",onMouseDown,false);el.addEventListener('touchstart',onTouchStart,false);el.addEventListener("mousemove",doPointer,false);}
function chgSides(v){my.sideN=v
document.getElementById('sides').innerHTML=v
update()}
function restart(){dotsMake()
update()}
function update(){var dx=dots[0].x-my.midx
var title=my.mode.name
if(my.mode.obq){if(Math.abs(dx)<6){dx=0
title='Right '+title}else{title='Oblique '+title}}
document.getElementById('title').innerHTML=title
g.clearRect(0,0,el.width,el.height);my.mode.fn()
dotsDraw()}
function ptsDraw(pts){for(var i=0;i<pts.length;i++){var pt=pts[i]
if(i==0){g.moveTo(pt.x,pt.y)}else{g.lineTo(pt.x,pt.y)}}}
function ptsSquish(pts,xFact,yFact){var p=[]
for(var i=0;i<pts.length;i++){var pt=pts[i]
p.push(new Pt(pt.x*xFact,pt.y*yFact))}
return p;}
function ptsTrans(pts,x,y){var p=[]
for(var i=0;i<pts.length;i++){var pt=pts[i]
p.push(new Pt(pt.x+x,pt.y+y))}
return p;}
function ptsClone(pts){var p=[]
for(var i=0;i<pts.length;i++){var pt=pts[i]
p.push(new Pt(pt.x,pt.y))}
return p;}
function ptsRegular(midX,midY,radius,sttAngle,n){var pts=[];var dAngle=Math.PI*2/n;for(var i=0;i<n;i++){var angle=sttAngle+i*dAngle;var x=midX+radius*Math.cos(angle);var y=midY+radius*Math.sin(angle);pts.push(new Pt(x,y));}
return pts;}
function pseudoSphere(){var factor=4
dots[0].x=Math.max(my.midx+10,dots[0].x)
dots[0].y=my.midy
var r=dots[0].x-my.midx
g.beginPath();g.setLineDash([3,3])
g.moveTo(my.midx,my.midy);g.lineTo(my.midx+r,my.midy);g.stroke();g.setLineDash([])
g.beginPath();g.font='16px Arial'
g.textAlign='center'
g.fillText(Math.round(r)/10,my.midx+r/2,my.midy-2)
var grd=g.createRadialGradient(my.midx+r*0.4,my.midy-r*0.6,0,my.midx,my.midy,r*1.6)
grd.addColorStop(0.0,"hsla(60,100%,80%,0.3)");grd.addColorStop(0.1,"hsla(240,100%,60%,0.1)");grd.addColorStop(0.6,'hsla(240,100%,70%,0.9)');grd.addColorStop(1,'hsla(240,100%,70%,1)');g.fillStyle=grd;g.beginPath();g.strokeStyle='hsla(240,100%,50%,1)';g.lineWidth=0.5;g.arc(my.midx,my.midy,r,r,0,2*Math.PI);g.fill();if(my.volQ){var shaper=Math.round(r)/10
var s=''
var area=4*Math.PI*shaper*shaper
area=Math.round(area*10)/10
s+='Area = 4 &times; &pi; &times; '+shaper+'<sup>2</sup> &asymp; '+area
s+='<br>'
var vol=(4/3)*Math.PI*shaper*shaper*shaper
vol=Math.round(vol*10)/10
s+='Volume = (<sup>4</sup>/<sub>3</sub>) &times; &pi; &times; '+shaper+'<sup>3</sup> &asymp; '+vol
document.getElementById('descr').innerHTML=s}}
function pseudoCone(){var factor=4
dots[0].y=Math.min(my.bt-40,dots[0].y)
dots[1].x=Math.max(my.midx,dots[1].x)
dots[1].y=my.bt
var r=dots[1].x-my.midx
g.strokeStyle='#aaaaaa'
g.beginPath();g.strokeStyle='hsla(240,100%,50%,1)';g.fillStyle='hsla(240,100%,90%,0.6)';g.lineWidth=0.5;drawEllipseRadius(g,my.midx,my.bt,r,r/factor);g.stroke();g.fill();g.beginPath();g.setLineDash([5,5])
g.moveTo(dots[0].x,dots[0].y);g.lineTo(dots[0].x,my.bt);g.stroke();g.beginPath();g.moveTo(dots[0].x-20,my.bt);g.lineTo(dots[0].x+20,my.bt);g.stroke()
g.setLineDash([])
if(false){g.beginPath();g.fillStyle='red';var slantHt=Math.round(dist(dots[0].x-dots[1].x,dots[0].y-dots[1].y))/10
console.log('slantHt',slantHt)
g.beginPath();g.fillText(slantHt,(dots[0].x+dots[1].x)/2,(dots[0].y+dots[1].y)/2+16)
g.fill();}
g.beginPath();g.moveTo(my.midx,my.bt);g.lineTo(my.midx+r,my.bt);g.stroke();g.beginPath();g.setLineDash([])
var m=((my.midx-r)-dots[0].x)/(my.bt-dots[0].y)
var grd=g.createLinearGradient(dots[0].x,dots[0].y,dots[0].x+r,dots[0].y-r*m);grd.addColorStop(0,"hsla(240,100%,80%,1)");grd.addColorStop(0.5,'hsla(240,100%,80%,0.3)');grd.addColorStop(0.6,'hsla(240,100%,80%,0.2)');grd.addColorStop(1,'hsla(60,100%,80%,0.2)');g.fillStyle=grd;g.moveTo(dots[0].x,dots[0].y);var ang=Math.atan2(my.midx-dots[0].x,my.bt-dots[0].y)
var fudge=ang*0.5
drawEllipseRadius(g,my.midx,my.bt,r,r/factor,-fudge,Math.PI-fudge);g.closePath()
g.fill();g.stroke();if(my.volQ){g.font="14px Arial";g.fillStyle='black';var shaper=Math.round(r)/10
g.beginPath();g.fillText(shaper,my.midx+r/2,my.bt)
g.fill();var shapeHt=Math.round(my.bt-dots[0].y)/10
g.beginPath();g.fillText(shapeHt,dots[0].x,dots[0].y+(my.bt-dots[0].y)/2+16)
g.fill();var vol=Math.PI*shaper*shaper*shapeHt/3
vol=Math.round(vol*10)/10
var s='Volume = <sup>1</sup>/<sub>3</sub> &times; &pi; &times; '+shaper+'<sup>2</sup> &times; '+shapeHt+' &asymp; '+vol
document.getElementById('descr').innerHTML=s}}
function pseudoCylHz(){var factor=4
dots[1].x=Math.max(my.midx,dots[1].x)
dots[1].y=my.bt
dots[0].x=dots[1].x
var r=100
dots[0].y=Math.max(my.bt-2*r,Math.min(dots[0].y,my.bt))
g.beginPath();g.strokeStyle='hsla(240,100%,50%,1)';g.fillStyle='hsla(240,100%,90%,0.6)';g.lineWidth=0.5;drawEllipseRadius(g,my.midx+(my.midx-dots[1].x),my.bt-r,r/factor,r);g.stroke();g.fill();var pts=getArcPts(dots[1].x,my.bt-r,r/factor,r)
console.log('pts',pts)
my.walls=[]
for(var i=0;i<pts.length;i++){var i1=loop(i,0,pts.length-1,1)
var line=new Line(pts[i],pts[i1])
my.walls.push(line)}
var bm=new Line(new Pt(dots[0].x-100,dots[0].y+20),new Pt(dots[0].x+100,dots[0].y-20))
var hits=[]
var ell={x:dots[1].x,y:my.bt-r}
var ip=null
var sttq=false
for(var i=0;i<my.walls.length;i++){var wall=my.walls[i]
ip=wall.getIntersection(bm,true)
if(ip!=null){var ang=Math.atan2(ip.y-ell.y,ip.x-ell.x)
hits.push({ip:ip,wall:wall,ang:ang})
console.log('ip',ip,ang)
g.strokeStyle='black'
g.fillStyle='black'
g.beginPath()
g.arc(ip.x,ip.y,3,0,2*Math.PI)
g.fill();g.stroke()
var dx=Math.cos(ang)*100
var dy=Math.sin(ang)*100
g.strokeStyle='black'
g.fillStyle='black'
g.beginPath()
g.moveTo(ell.x,ell.y)
g.lineTo(ell.x+dx,ell.y+dy)
g.fill();g.stroke()}}
g.strokeStyle='black'
g.fillStyle='green'
g.beginPath()
g.arc(ell.x,ell.y,3,0,2*Math.PI)
g.fill();g.stroke()
if(hits.length==3){var allPts=[]
var ang0=-hits[0].ang
var ang1=-hits[1].ang
if(ang0<0){ang0=-hits[1].ang
ang1=-hits[0].ang}
var rtPts=getArcPts(ell.x,ell.y,r/factor,r,ang0,-Math.PI/2)
console.log('rtPts',rtPts)
for(var i=0;i<rtPts.length;i++){var pt=rtPts[i]
allPts.push(pt)
g.beginPath();g.strokeStyle='hsla(240,100%,50%,1)';g.fillStyle='blue';g.lineWidth=0.5;g.arc(pt.x,pt.y,4,0,2*Math.PI);g.stroke();g.fill();}
if(ang1>0){ang1-=Math.PI*2
console.log('ang1',ang1,ang1-Math.PI*2)}
var ltPts=getArcPts(ell.x,ell.y,r/factor,r,-Math.PI/2,ang1)
console.log('ltPts',ltPts,-Math.PI/2,ang1)
for(var i=0;i<ltPts.length;i++){var pt=ltPts[i]
allPts.push(pt)
g.beginPath();g.strokeStyle='hsla(240,100%,50%,1)';g.fillStyle='green';g.lineWidth=0.5;g.arc(pt.x,pt.y,4,0,2*Math.PI);g.stroke();g.fill();}}}
function pseudoCyl(){var factor=4
dots[0].y=Math.min(my.bt-20,dots[0].y)
dots[1].x=Math.max(my.midx,dots[1].x)
dots[1].y=my.bt
var r=dots[1].x-my.midx
g.beginPath();g.strokeStyle='hsla(240,100%,50%,1)';g.fillStyle='hsla(240,100%,90%,0.6)';g.lineWidth=0.5;drawEllipseRadius(g,my.midx,my.bt,r,r/factor);g.stroke();g.fill();g.beginPath();g.setLineDash([5,5])
g.moveTo(dots[0].x,dots[0].y);g.lineTo(dots[0].x,my.bt);g.stroke();g.beginPath();g.moveTo(dots[0].x-20,my.bt);g.lineTo(dots[0].x+20,my.bt);g.stroke()
g.setLineDash([])
g.beginPath();g.setLineDash([3,3])
g.moveTo(dots[0].x,dots[0].y);g.lineTo(dots[0].x+r,dots[0].y);g.stroke();g.beginPath();g.setLineDash([])
var m=(my.midx-dots[0].x)/(my.bt-dots[0].y)
var grd=g.createLinearGradient(dots[0].x-r,dots[0].y,dots[0].x,dots[0].y-r*m);grd.addColorStop(0.0,"hsla(240,100%,80%,1)");grd.addColorStop(0.5,'hsla(240,100%,80%,0.3)');grd.addColorStop(0.6,'hsla(240,100%,80%,0.2)');grd.addColorStop(1,'hsla(60,100%,80%,0.2)');g.fillStyle=grd;g.beginPath();var ang=Math.atan2(my.midx-dots[0].x,my.bt-dots[0].y)
var fudge=ang*0.5
drawEllipseRadius(g,dots[0].x,dots[0].y,r,r/factor,Math.PI-fudge,-fudge);drawEllipseRadius(g,my.midx,my.bt,r,r/factor,-fudge,Math.PI-fudge)
g.fill();g.stroke();g.beginPath();g.fillStyle='hsla(60,100%,90%,0.5)';drawEllipseRadius(g,dots[0].x,dots[0].y,r,r/factor);g.stroke();g.fill();if(my.volQ){g.font="14px Arial";g.fillStyle='black';var shaper=Math.round(r)/10
g.beginPath();g.fillText(shaper,dots[0].x+r/2,dots[0].y)
g.fill();var shapeHt=Math.round(my.bt-dots[0].y)/10
g.beginPath();g.fillText(shapeHt,dots[0].x,dots[0].y+(my.bt-dots[0].y)/2+16)
g.fill();var vol=Math.PI*shaper*shaper*shapeHt
vol=Math.round(vol*10)/10
var s='Volume = &pi; &times; '+shaper+'<sup>2</sup> &times; '+shapeHt+' &asymp; '+vol
document.getElementById('descr').innerHTML=s}}
function pseudoPyrN(){console.log('pseudoPyrN')
dots[1].y=my.bt
dots[0].y=Math.min(my.bt-20,dots[0].y)
g.strokeStyle='hsla(190,0%,20%,1)'
g.lineWidth=0.5
var n=my.sideN
var angStt=0.08
var smidge=2
g.fillStyle='hsla(240,100%,80%,0.6)';g.beginPath();var pts=ptsRegular(0,0,dots[1].x-my.midx,angStt,n)
pts=ptsSquish(pts,1,0.25)
pts=ptsTrans(pts,my.midx,my.bt-smidge)
ptsDraw(pts)
g.closePath()
g.fill();g.stroke();var pt2s=ptsClone(pts)
pt2s=ptsTrans(pt2s,dots[0].x-my.midx,dots[0].y-(my.bt-smidge))
for(var i=n-1;i>=0;i--){g.fillStyle='hsla(240,100%,80%,0.3)';if(n>2){switch(Math.round(i-n/3)){case 0:g.fillStyle='hsla(60,100%,90%,0.6)';break
case-1:case 1:g.fillStyle='hsla(60,100%,80%,0.3)';break}}
g.beginPath()
var i0=i
var i1=loop(i0,0,n-1,1)
g.moveTo(pts[i0].x,pts[i0].y)
g.lineTo(pts[i1].x,pts[i1].y)
g.lineTo(dots[0].x,dots[0].y)
g.closePath()
g.fill()
g.stroke();}}
function pseudoPrismN(){console.log('pseudoPrismN')
dots[1].y=my.bt
dots[0].y=Math.min(my.bt-20,dots[0].y)
g.strokeStyle='rgba(0,0,255,0.5)';var n=my.sideN
var angStt=0.08
var smidge=2
g.fillStyle='hsla(240,100%,80%,0.8)';g.beginPath();var pts=ptsRegular(0,0,dots[1].x-my.midx,angStt,n)
pts=ptsSquish(pts,1,0.25)
pts=ptsTrans(pts,my.midx,my.bt-smidge)
ptsDraw(pts)
g.closePath()
g.fill();g.stroke();var pt2s=ptsClone(pts)
pt2s=ptsTrans(pt2s,dots[0].x-my.midx,dots[0].y-(my.bt-smidge))
for(var i=n-1;i>=0;i--){g.fillStyle='hsla(240,100%,80%,0.3)';if(n>4){switch(Math.round(i-n/3)){case 0:g.fillStyle='hsla(60,100%,90%,0.6)';break
case-1:case 1:g.fillStyle='hsla(60,100%,80%,0.3)';break}}
g.beginPath()
var i0=i
var i1=loop(i0,0,n-1,1)
g.moveTo(pts[i0].x,pts[i0].y)
g.lineTo(pts[i1].x,pts[i1].y)
g.lineTo(pt2s[i1].x,pt2s[i1].y)
g.lineTo(pt2s[i0].x,pt2s[i0].y)
g.closePath()
g.fill()
g.stroke();}
g.fillStyle='hsla(60,100%,80%,0.6)';g.beginPath();ptsDraw(pt2s)
g.closePath()
g.fill();g.stroke();}
function pseudoPrism(){dots[1].y=Math.min(my.bt,dots[1].y)
var ht=dots[1].y-my.bt
var backX=-ht*1.5
dots[1].x=Math.max(my.midx+backX/2,dots[1].x)
var wd=dots[1].x-my.midx
var backY=ht
wd-=backX/2
var baseMidy=my.bt+backY/2
dots[0].y=Math.min(baseMidy,dots[0].y)
var xLtFt=my.midx-wd-backX/2
var xLtBk=xLtFt+backX;var xRtFt=my.midx+wd-backX/2
var xRtBk=xRtFt+backX;var yUpFt=dots[0].y-backY/2
var yUpBk=yUpFt+backY
var yDnFt=my.bt;var yDnBk=yDnFt+backY
var offx=dots[0].x-(xLtFt+xRtBk)/2
g.strokeStyle='rgba(0,0,255,1)';g.lineWidth=1;g.beginPath();g.setLineDash([5,5])
g.moveTo(dots[0].x,dots[0].y);g.lineTo(dots[0].x,baseMidy);g.stroke();g.beginPath();g.moveTo(dots[0].x-20,baseMidy);g.lineTo(dots[0].x+20,baseMidy);g.stroke()
g.setLineDash([])
g.fillStyle='hsla(240,100%,80%,0.8)';g.beginPath();g.moveTo(xLtFt,yDnFt);g.lineTo(xRtFt,yDnFt);g.lineTo(xRtBk,yDnBk);g.lineTo(xLtBk,yDnBk);g.closePath()
g.stroke();g.beginPath();g.fillStyle='hsla(240,100%,90%,0.6)';g.moveTo(xLtBk,yDnBk);g.lineTo(xRtBk,yDnBk);g.lineTo(xRtBk+offx,yUpBk);g.lineTo(xLtBk+offx,yUpBk);g.closePath()
g.fill();g.stroke();g.beginPath();g.fillStyle='hsla(240,100%,90%,0.5)';g.moveTo(xLtFt,yDnFt);g.lineTo(xLtBk,yDnBk);g.lineTo(xLtBk+offx,yUpBk);g.lineTo(xLtFt+offx,yUpFt);g.closePath()
g.fill();g.stroke();g.beginPath();g.fillStyle='hsla(240,100%,90%,0.6)';g.lineTo(xRtFt,yDnFt);g.lineTo(xRtFt+offx,yUpFt);g.lineTo(xLtFt+offx,yUpFt);g.lineTo(xLtFt,yDnFt);g.beginPath();g.fillStyle='hsla(60,100%,90%,0.6)';g.moveTo(xLtFt+offx,yUpFt);g.lineTo(xRtFt+offx,yUpFt);g.lineTo(xRtBk+offx,yUpBk);g.lineTo(xLtBk+offx,yUpBk);g.closePath()
g.fill();g.stroke();g.beginPath();g.fillStyle='hsla(240,100%,80%,0.6)';g.lineTo(xRtFt,yDnFt);g.lineTo(xRtBk,yDnBk);g.lineTo(xRtBk+offx,yUpBk);g.lineTo(xRtFt+offx,yUpFt);g.closePath()
g.fill();g.stroke();if(my.volQ){g.font="14px Arial";g.fillStyle='black';var shapeWd=Math.round(xRtFt-xLtFt)/10
g.beginPath();g.fillText(shapeWd,xLtFt+(xRtFt-xLtFt)/2,yDnFt+16)
g.fill();var shapeHt=Math.round(baseMidy-dots[0].y)/10
g.beginPath();g.fillText(shapeHt,dots[0].x,dots[0].y+(baseMidy-dots[0].y)/2+16)
g.fill();var shapeDp=Math.round(dist(xRtFt-xRtBk,yDnFt-yDnBk))/10
g.beginPath();g.fillText(shapeDp,xRtFt-(xRtFt-xRtBk)/2+8,yDnFt-(yDnFt-yDnBk)/2+8)
g.fill();var vol=shapeWd*shapeDp*shapeHt
vol=Math.round(vol*10)/10
var s='Volume = '+shapeWd+' &times; '+shapeDp+' &times; '+shapeHt+' &asymp; '+vol
document.getElementById('descr').innerHTML=s}}
function pseudoPyr(){dots[1].y=Math.min(my.bt,dots[1].y)
var ht=dots[1].y-my.bt
var backX=-ht*1.5
dots[1].x=Math.max(my.midx+backX/2,dots[1].x)
var wd=dots[1].x-my.midx
var backY=ht
wd-=backX/2
var xLtFt=my.midx-wd-backX/2
var xLtBk=xLtFt+backX;var xRtFt=my.midx+wd-backX/2
var xRtBk=xRtFt+backX;var yDnFt=my.bt;var yDnBk=yDnFt+backY;var baseMidy=my.bt+backY/2
dots[0].y=Math.min(baseMidy,dots[0].y)
var xTp=dots[0].x
var yTp=dots[0].y
g.strokeStyle='rgba(0,0,255,1)';g.lineWidth=1;g.beginPath();g.setLineDash([5,5])
g.moveTo(xTp,yTp);g.lineTo(xTp,baseMidy);g.stroke();g.beginPath();g.moveTo(xTp-20,baseMidy);g.lineTo(xTp+20,baseMidy);g.stroke()
g.setLineDash([])
g.fillStyle='hsla(240,100%,80%,0.8)';g.beginPath();g.moveTo(xLtFt,yDnFt);g.lineTo(xRtFt,yDnFt);g.lineTo(xRtBk,yDnBk);g.lineTo(xLtBk,yDnBk);g.closePath()
g.stroke();g.beginPath();g.fillStyle='hsla(240,100%,90%,0.6)';g.moveTo(xLtBk,yDnBk);g.lineTo(xRtBk,yDnBk);g.lineTo(xTp,yTp);g.closePath()
g.fill();g.stroke();g.beginPath();g.fillStyle='hsla(240,100%,90%,0.5)';g.moveTo(xLtFt,yDnFt);g.lineTo(xLtBk,yDnBk);g.lineTo(xTp,yTp);g.closePath()
g.fill();g.stroke();g.beginPath();g.fillStyle='hsla(60,100%,90%,0.6)';g.moveTo(xLtFt,yDnFt);g.lineTo(xRtFt,yDnFt);g.lineTo(xTp,yTp);g.closePath()
g.fill();g.stroke();g.beginPath();g.fillStyle='hsla(240,100%,80%,0.6)';g.moveTo(xRtFt,yDnFt);g.lineTo(xRtBk,yDnBk);g.lineTo(xTp,yTp);g.closePath()
g.fill();g.stroke();if(my.volQ){g.font="14px Arial";g.fillStyle='black';var shapeWd=Math.round(xRtFt-xLtFt)/10
g.beginPath();g.fillText(shapeWd,xLtFt+(xRtFt-xLtFt)/2,yDnFt+16)
g.fill();var shapeHt=Math.round(baseMidy-yTp)/10
g.beginPath();g.fillText(shapeHt,xTp,yTp+(baseMidy-yTp)/2+16)
g.fill();var shapeDp=Math.round(dist(xRtFt-xRtBk,yDnFt-yDnBk))/10
g.beginPath();g.fillText(shapeDp,xRtFt-(xRtFt-xRtBk)/2+8,yDnFt-(yDnFt-yDnBk)/2+8)
g.fill();var vol=shapeWd*shapeDp*shapeHt/3
vol=Math.round(vol*10)/10
var s='Volume = <sup>1</sup>/<sub>3</sub> &times; '+shapeWd+' &times; '+shapeDp+' &times; '+shapeHt+' &asymp; '+vol
document.getElementById('descr').innerHTML=s}}
function drawEllipseRadius(g,x,y,rx,ry,angFrom,angTo,sgm){angFrom=typeof angFrom!=='undefined'?angFrom:0
angTo=typeof angTo!=='undefined'?angTo:2*Math.PI
sgm=typeof sgm!=='undefined'?sgm:8;var sgmAngle=(angTo-angFrom)/sgm;var cRangle=sgmAngle/2;var cRx=rx/Math.cos(cRangle);var cRy=ry/Math.cos(cRangle);for(var i=0;i<=sgm;i++){var angle=angFrom+i*sgmAngle
var cX=x+Math.cos(angle-cRangle)*cRx;var cY=y+Math.sin(angle-cRangle)*cRy;var pX=x+Math.cos(angle)*rx;var pY=y+Math.sin(angle)*ry;if(i==0){g.lineTo(pX,pY);}else{g.quadraticCurveTo(cX,cY,pX,pY);}}}
function getArcPts(midX,midY,radiusX,radiusY,fromAngle,toAngle,segN){if(typeof fromAngle=='undefined'){fromAngle=0
toAngle=2*Math.PI
segN=20}else{segN=typeof segN!=='undefined'?segN:8;if(radiusX!=radiusY){fromAngle=Math.atan2(Math.sin(fromAngle)*radiusX/radiusY,Math.cos(fromAngle));toAngle=Math.atan2(Math.sin(toAngle)*radiusX/radiusY,Math.cos(toAngle));console.log("getArcPts:",fromAngle,toAngle);}}
var pts=[];var steps=segN;for(var i=0;i<=steps;i++){var radians=fromAngle+(toAngle-fromAngle)*(i/steps);console.log('>>',i,radians)
var thisX=midX+(Math.cos(radians)*radiusX);var thisY=midY-(Math.sin(radians)*radiusY);pts.push(new Pt(thisX,thisY));}
return pts;}
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
function loop(currNo,minNo,maxNo,incr){if(incr===undefined)incr=1;currNo+=incr;var range=maxNo-minNo+1;if(currNo<minNo){currNo=maxNo-(-currNo+maxNo)%range;}
if(currNo>maxNo){currNo=minNo+(currNo-minNo)%range;}
return currNo;}
function Line(pt1,pt2){this.a=pt1;this.b=pt2;}
Line.prototype.getIntersection=function(ln,asSegmentsQ){var A=this.a;var B=this.b;var E=ln.a;var F=ln.b;var a1=B.y-A.y;var b1=A.x-B.x;var c1=B.x*A.y-A.x*B.y;var a2=F.y-E.y;var b2=E.x-F.x;var c2=F.x*E.y-E.x*F.y;var denom=a1*b2-a2*b1;if(denom==0){return null;}
var ip={x:(b1*c2-b2*c1)/denom,y:(a2*c1-a1*c2)/denom}
if(asSegmentsQ){if(Math.pow(ip.x-B.x,2)+Math.pow(ip.y-B.y,2)>Math.pow(A.x-B.x,2)+Math.pow(A.y-B.y,2)){return null;}
if(Math.pow(ip.x-A.x,2)+Math.pow(ip.y-A.y,2)>Math.pow(A.x-B.x,2)+Math.pow(A.y-B.y,2)){return null;}
if(Math.pow(ip.x-F.x,2)+Math.pow(ip.y-F.y,2)>Math.pow(E.x-F.x,2)+Math.pow(E.y-F.y,2)){return null;}
if(Math.pow(ip.x-E.x,2)+Math.pow(ip.y-E.y,2)>Math.pow(E.x-F.x,2)+Math.pow(E.y-F.y,2)){return null;}}
return ip;}