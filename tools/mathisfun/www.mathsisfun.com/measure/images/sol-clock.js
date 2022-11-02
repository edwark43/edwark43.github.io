let my={}
let deg2rad=Math.PI/180.0
let w=726;let h=363;function solclockMain(mode='sun'){let version='0.64';my.mode=mode
my.drag={onQ:false,lastTime:-1000000}
my.lastTimeStr=''
my.days=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];my.months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];let s="";s+='<style>'
s+='.btn { display: inline-block; position: relative; text-align: center; margin: 2px; text-decoration: none; font: bold 12px/16px Arial, sans-serif; color: #268; border: 1px solid #88aaff; border-radius: 10px;cursor: pointer; background: linear-gradient(to top right, rgba(170,190,255,1) 0%, rgba(255,255,255,1) 100%); outline-style:none;}'
s+='.btn:hover { background: linear-gradient(to top, rgba(255,255,0,1) 0%, rgba(255,255,255,1) 100%); }'
s+='.yy { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(255,220,130,1) 0%, rgba(255,255,255,1) 100%);  }'
s+='.hi { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(130,220,255,1) 0%, rgba(255,255,255,1) 100%); box-shadow: 2px 2px 6px #66a; }'
s+='.lo { border: solid 1px #888888; background: linear-gradient(to top, rgba(170,170,170,1) 0%, rgba(205,205,205,1) 100%);  }'
s+='</style>'
s+=`<div id="main" style="position:relative; width:${w}px; min-height:${h}px; margin:auto; display:block;
   border: none; border-radius: 10px; background: linear-gradient(to top, rgba(130,220,255,1) 0%, rgba(255,255,255,1) 100%)">`
my.imgHome=(document.domain=='localhost')?'/mathsisfun/measure/images/':'/measure/images/'
s+='<img id="nightImg" src="'+my.imgHome+'earth-night726x363.jpg" style="position: absolute; left: 0px; top: 0px; visibility: hidden;" />';s+='<img id="dayImg" src="'+my.imgHome+'earth-day726x363.jpg" style="position: absolute; left: 0px; top: 0px;" />';my.gs=[]
for(let i=0;i<4;i++){s+=`<canvas id="canvas${i}" width="${w}" height="${h}" style="position: absolute; left: 0px; top: 0px;"></canvas>`
my.gs.push(i)}
s+='<div style="position: absolute; left:9px; bottom: 50px; color: #990; font: 14px Arial;  ">'
s+='<div style="">'
s+='<div style="">Local: <span id="locDate"></span></div>'
s+='<div id="locTime" style="font: 40px Arial; color: yellow;"></div>'
s+='</div>'
s+='<div style="margin-top: 2px;">'
s+='<div style="display: inline-block;">UTC: &nbsp;</div>'
s+='<div id ="UTCTime" style="display: inline-block; font: 14px Arial; width:100px;color: yellow;"></div>'
s+='</div>'
s+='</div>'
s+='<div style="position: absolute; right:2px; bottom: 48px; color: white; font: 12px Arial;  ">'
s+='<button id="solBtn" class="btn hi" style=" " onclick="toggleSol()" >Sun</button>';s+='<button id="tzBtn" class="btn lo" style="  " onclick="toggleTz()" >Timezones</button>';s+='</div>'
s+='<div style="position: absolute; right: 6px; top: 3px; font: 11px Arial; color: #68a;">&copy; 2020 MathsIsFun.com  v'+version+'</div>';s+='</div>';document.write(s);let ratio=2;my.gs=my.gs.map(g=>{let el=document.getElementById('canvas'+g);el.width=w*ratio;el.height=h*ratio;el.style.width=w+"px";el.style.height=h+"px";g=el.getContext("2d");g.setTransform(ratio,0,0,ratio,0,0);return g})
my.mapType='mask'
my.sol=new Sun('aaa',55,'yellow')
my.sol.draw();if(my.mode=='sun'){my.solQ=true
my.tzQ=false}else{my.solQ=false
my.tzQ=true}
my.solQ=!my.solQ
toggleSol()
my.tzQ=!my.tzQ
toggleTz()
window.addEventListener('mousemove',function(ev){mouseMove(ev)})
window.addEventListener('touchmove',function(ev){console.log('touchmove')
let touch=ev.targetTouches[0];ev.clientX=touch.clientX;ev.clientY=touch.clientY;ev.touchQ=true;mouseMove(ev)})
window.addEventListener("keydown",key,false);my.xChg=0
my.yChg=0
my.sclChg=0
my.tzs=tzsGet()
my.tzFracs=[{time:3.5,name:'',latMin:25,latMax:38},{time:4.5,name:'',latMin:23,latMax:35},{time:5.5,name:'India',latMin:5,latMax:31},{time:6.5,name:'Burma?',latMin:13,latMax:33},{time:9.5,name:'SA',latMin:-38,latMax:-10},]
my.tzTime=0
tzLoop(my.gs[0])
let div=document.getElementById('nightImg')
div.onload=function(){solPos(my.gs[1])};footerPlot(my.gs[2])
timeUpdate()
setInterval(timeUpdate,1000)}
function timeUpdate(){let dt=new Date()
let dateStr=my.months[dt.getMonth()]+' '+dt.getDate()
let timeStr=my.days[dt.getDay()]+' '+timeFmt(dt.getHours(),dt.getMinutes())
if(timeStr!=my.lastTimeStr){my.lastTimeStr=timeStr
document.getElementById('locDate').innerHTML=dateStr
document.getElementById('locTime').innerHTML=timeStr
document.getElementById('UTCTime').innerHTML=my.days[dt.getUTCDay()]+' '+timeFmt(dt.getUTCHours(),dt.getUTCMinutes())
if(my.drag.lastTime+20000<performance.now()){solPos(my.gs[1])}else{console.log('NO MOVE SUN')}}}
function isDST(d){let jan=new Date(d.getFullYear(),0,1).getTimezoneOffset();let jul=new Date(d.getFullYear(),6,1).getTimezoneOffset();return Math.max(jan,jul)!=d.getTimezoneOffset();}
function timeFmt(h,m){let mode='24'
let hh=h.toString()
if(mode=='am'){if(h>12)h-=12
if(h==0){hh='12'}else{hh=(h<10)?'0'+h:''+h}}else{if(h<10)hh='0'+h;}
let mm=(m<10)?'0'+m:''+m
let timeStr=''
if(mode=='am'){timeStr=hh+mm;}else{timeStr=hh+':'+mm}
return timeStr}
function tzLoop(){let g=my.gs[3]
g.clearRect(0,0,g.canvas.width,g.canvas.height)
my.tzs.map(tz=>{if(tz.time==my.tzTime){tzPlot(g,tz,true)}else{}})}
function footerPlot(g){g.strokeStyle='black'
g.textAlign='center'
for(let i=0;i<=24;i++){let x=(i-0.5)*(w/24)-1
let y=320
g.fillStyle='hsla(0,0%,0%,0.8)'
g.beginPath()
g.rect(x,y,w/24,35)
g.fill()
let hh=i-12
let ew='0'
if(hh>0)ew=hh*15+'E'
if(hh<0)ew=-hh*15+'W'
g.fillStyle='white'
g.font='11px Arial'
g.fillText(ew,x+w/48,y+15)
let hhStr=((hh>0)?'+':'')+hh
g.fillStyle='yellow'
g.font='14px Arial'
g.fillText(hhStr,x+w/48,y+30)}}
function tzPlot(g,tz,chgQ){let poly1=tz.poly
g.strokeStyle='black'
g.fillStyle=chgQ?'hsla(240,100%,90%,0.5)':'hsla(60,100%,90%,0.05)'
g.beginPath()
g.moveTo(1,1)
let xStt=tz.xStt
let yStt=tz.yStt
let xScl=tz.xScl
let yScl=tz.yScl
if(chgQ){xStt+=my.xChg
yStt+=my.yChg
xScl+=my.sclChg
yScl+=my.sclChg}
let sttQ=false
poly1.map(pt=>{let xp=xStt+pt[0]*xScl
let yp=yStt+pt[1]*yScl
if(!sttQ){g.moveTo(xp,yp)
sttQ=true}
g.lineTo(xp,yp)})
g.fill();}
function solChg(x,y){let lon=intToLon(x)
let lat=intToLat(y)
console.log('solChg',x,y,lat,lon)
polyDo(my.gs[1],lat,lon)}
function mouseMove(ev){if(my.drag.onQ){my.drag.lastTime=performance.now()
let div=my.drag.div
let lt=parseFloat(div.style.left)+ev.clientX-my.drag.x
div.style.left=lt+'px'
my.drag.x=ev.clientX
let tp=parseFloat(div.style.top)+ev.clientY-my.drag.y
div.style.top=tp+'px'
my.drag.y=ev.clientY}else{let el=document.getElementById('canvas0')
var bRect=el.getBoundingClientRect();let ratio=2
let mouseX=(ev.clientX-bRect.left)*(el.width/ratio/bRect.width);let mouseY=(ev.clientY-bRect.top)*(el.height/ratio/bRect.height);let time=Math.round(24*mouseX/w)-12
let lon=intToLon(mouseX)
let lat=intToLat(mouseY)
let tzFrac=null
my.tzFracs.map(tz=>{if(tz.time>time&&tz.time<time+1){if(lat>tz.latMin&&lat<tz.latMax){tzFrac=tz}}})
if(tzFrac!=null)time=tzFrac.time
if(time!=my.tzTime){my.tzTime=time
tzLoop()}}}
function solVal(solLat,solLon,pLat,pLon){let sX=Math.cos(solLat*deg2rad)*Math.cos(solLon*deg2rad);let sY=Math.cos(solLat*deg2rad)*Math.sin(solLon*deg2rad);let sZ=Math.sin(solLat*deg2rad);let pX=Math.cos(pLat*deg2rad)*Math.cos(pLon*deg2rad);let pY=Math.cos(pLat*deg2rad)*Math.sin(pLon*deg2rad);let pZ=Math.sin(pLat*deg2rad);let sv=sX*pX+sY*pY+sZ*pZ
return sv}
function intToLat(i){return 90-i/h*180;}
function latToInt(lat){return h/2-(lat/90)*h/2}
function intToLon(i){return 180-i/w*360}
function lonToInt(lon){return w/2-(lon/180)*w/2}
function solPos(g){if(!my.solQ)return
let now=new Date()
let utc=Math.round(now.getTime()/1000)
let T=(utc/86400-10957.5)/36525;let L0=280.46645+36000.76983*T+0.0003032*T*T
let M=357.5291+35999.0503*T-0.0001559*T*T-4.8e-7*T*T*T;let solC=(1.9146-0.004817*T-0.000014*T*T)*Math.sin(deg2rad*M)+(0.019993-0.000101*T)*Math.sin(deg2rad*2*M)+0.00029*Math.sin(deg2rad*3*M);let L=L0+solC;let eps=23.43999;let x=Math.cos(L*deg2rad);let y=Math.cos(eps*deg2rad)*Math.sin(L*deg2rad);let z=Math.sin(eps*deg2rad)*Math.sin(L*deg2rad);let r=Math.sqrt(1-z*z)
let lat=Math.atan2(z,r)/deg2rad;let fmod=utc-Math.floor(utc/86400)*86400;let lon=(fmod-43200)*0.004166666;lat=lat/180;lat=lat-Math.floor(lat);if(lat<0){lat=lat+1;}
lat=lat*180;if(lat>90){lat=lat-180;}
console.log('solPos lon,lat:',lon,lat)
my.sol.setxy(lonToInt(lon),latToInt(lat))
polyDo(g,lat,lon)}
function polyDo(g,lat,lon){let poly=shadowPoly(lat,lon,-0.01)
if(my.mapType=="mask"){let g2=my.gs[1]
let el=g2.canvas
let ratio=1
el.width=w*ratio;el.height=h*ratio;el.style.width=w+"px";el.style.height=h+"px";g2.beginPath();let ptN=0;while(ptN<poly.length){if(ptN==0){g2.moveTo(poly[ptN][0],poly[ptN][1]);}else{g2.lineTo(poly[ptN][0],poly[ptN][1]);}
ptN++;}
g2.clip();let img=document.getElementById("nightImg");g2.drawImage(img,0,0);}
if(false){poly.map(pt=>{if(pt[1]==0)pt[1]=h
else if(pt[1]==h)pt[1]=0})
g.clearRect(0,0,g.canvas.width,g.canvas.height)
g.fillStyle='hsla(60,100%,90%,0.2)'
g.beginPath()
polyPlot(g,poly,true,w,h);g.fill();}}
function shadowPoly(solLat,solLon,svWanted){let poly1=[];let poly2=[];let delta=w/50
let i=0;while(i<=w){let pLon=intToLon(i);let latLo=solLatFind(solLat,solLon,pLon,solLat,intToLat(h),svWanted);let latHi=solLatFind(solLat,solLon,pLon,intToLat(0),solLat,svWanted);if(latLo==-1000&&latHi==-1000){if(solLat>0){poly1.push([i,h])
poly2.push([i,h])}else{poly1.push([i,0])
poly2.push([i,0])}
i=i+delta;continue}
if(latLo==-1000){if(solLat>0){poly1.push([i,latToInt(latHi)])
poly2.push([i,h])}else{poly1.push([i,0])
poly2.push([i,latToInt(latHi)])}
i=i+delta;continue}
if(latHi==-1000){if(solLat>0){poly1.push([i,latToInt(latLo)])
poly2.push([i,h])}else{poly1.push([i,0])
poly2.push([i,latToInt(latLo)])}
i=i+delta;continue}
if(true){let lat=0
if(latLo>-1000){lat=latLo;}else{lat=latHi;}
if(solLat>0){poly1.push([i,latToInt(lat)])
poly2.push([i,h])}else{poly1.push([i,0])
poly2.push([i,latToInt(lat)])}}
i=i+delta;}
if(poly1.length>0){poly2.reverse();poly1=poly1.concat(poly2);return poly1}
return[]}
function polyPlot(g,poly,shadedPolyQ,outerW,outerH){let ptN=0;while(ptN<poly.length){if(ptN==0){g.moveTo(poly[ptN][0],poly[ptN][1]);}else{g.lineTo(poly[ptN][0],poly[ptN][1]);}
ptN++;}
g.lineTo(poly[0][0],poly[0][1]);if(!shadedPolyQ){let xmin=0;let ymin=0;let xmax=outerW;let ymax=outerH;g.lineTo(xmin,ymin);g.lineTo(xmax,ymin);g.lineTo(xmax,ymax);g.lineTo(xmin,ymax);g.lineTo(xmin,ymin);g.lineTo(poly[0][0],poly[0][1]);}
g.fill();}
function solLatFind(solLat,solLon,pLon,lat1,lat2,aWanted){let sv1=solVal(solLat,solLon,lat1,pLon);let sv2=solVal(solLat,solLon,lat2,pLon);if(sv1==sv2)return-1000
if(sv1<aWanted&&sv2<aWanted)return-1000
if(sv1>aWanted&&sv2>aWanted)return-1000
let svSign=sv1>sv2?-1:1
let latMid=0
while(true){latMid=(lat1+lat2)/2;let svMid=solVal(solLat,solLon,latMid,pLon);if(svMid==aWanted){break;}
if(svMid*svSign<aWanted*svSign){lat1=latMid;sv1=svMid;}else{lat2=latMid;sv2=svMid;}
if(Math.abs(lat1-lat2)<1)return lat1}
return latMid}
class Sun{constructor(name,sz,clr){this.name=name;this.sz=sz;this.clr=clr;this.showQ=true;this.rad=20
this.div=document.createElement("div");this.div.style.pointerEvents="auto"
this.div.style.position='absolute'
this.can=document.createElement('canvas');this.g=this.can.getContext("2d");let ratio=2;this.can.width=this.rad*2*ratio
this.can.height=this.rad*2*ratio
this.can.style.width=this.rad*2+"px";this.can.style.height=this.rad*2+"px";this.can.style.position='absolute'
this.can.style.left=-this.rad+'px'
this.can.style.top=-this.rad+'px'
this.g.setTransform(ratio,0,0,ratio,0,0);this.div.appendChild(this.can);document.getElementById('main').appendChild(this.div);let me=this;me.drag={onQ:false,x:0,y:0};let div=this.div;div.addEventListener('touchstart',function(ev){if(!me.showQ)return;console.log('touchstart');me.drag.onQ=true;me.drag.x=ev.clientX;me.drag.y=ev.clientY;me.div.style.transition="";me.goneOutQ=true;let touch=ev.targetTouches[0];ev.clientX=touch.clientX;ev.clientY=touch.clientY;ev.touchQ=true;ev.preventDefault();});div.addEventListener('touchend',function(){me.dropMe(me);});div.addEventListener('mouseover',function(){document.body.style.cursor="pointer";});div.addEventListener('mousedown',function(ev){me.drag.onQ=true;me.drag.x=ev.clientX;me.drag.y=ev.clientY;me.drag.div=me.div
me.div.style.transition="";ev.stopPropagation()
my.drag=me.drag});div.addEventListener('mouseleave',function(ev){document.body.style.cursor="auto";me.moveMe(me,ev);});div.addEventListener('mouseup',function(){me.dropMe(me);});}
show(onQ){if(onQ){this.div.style.visibility='visible';}else{this.div.style.visibility='hidden';}}
dropMe(me){me.drag.onQ=false;let lt=parseFloat(me.div.style.left);me.div.style.left=lt+'px';let tp=parseFloat(me.div.style.top);tp=Math.max(h*0.2,Math.min(tp,h*0.8))
me.div.style.top=tp+'px';solChg(lt,tp)}
moveMe(me,ev){ev.preventDefault();if(me.drag.onQ){let lt=parseFloat(me.div.style.left)+ev.clientX-me.drag.x;me.div.style.left=lt+'px';me.drag.x=ev.clientX;let tp=parseFloat(me.div.style.top)+ev.clientY-me.drag.y;me.div.style.top=tp+'px';me.drag.y=ev.clientY;}}
setxy(lt,tp){this.div.style.left=lt+'px';this.div.style.top=tp+'px';}
draw(){let g=this.g;let rad=this.rad
g.beginPath();var gradient=g.createRadialGradient(rad,rad,0,rad,rad,rad);gradient.addColorStop(0,'hsla(60,100%,93%,1)');gradient.addColorStop(0.4,'hsla(60,100%,82%,1)');gradient.addColorStop(0.7,'hsla(60,100%,50%,1)');gradient.addColorStop(1,'hsla(60,100%,90%,0.1)');g.fillStyle=gradient;g.arc(rad,rad,rad-1,0,2*Math.PI)
g.fill();}}
function key(ev){let keyCode=ev.keyCode;switch(keyCode){case 37:case 65:case 100:case 52:my.xChg--
break;case 39:case 68:case 102:case 54:my.xChg++
break;case 38:case 87:case 104:case 56:my.yChg--
break;case 40:case 83:case 98:case 50:my.yChg++
break;case 74:my.tzTime--
break;case 75:my.tzTime++
break;case 76:my.tzTime+=0.5
break;case 70:my.sclChg--
break;case 71:my.sclChg++
break;default:console.log("key",keyCode);}
tzLoop()}
function toggleSol(){my.solQ=!my.solQ;if(my.solQ){document.getElementById('canvas1').style.visibility='visible';}else{document.getElementById('canvas1').style.visibility='hidden';}
my.sol.show(my.solQ)
toggleBtn('solBtn',my.solQ)}
function toggleTz(){my.tzQ=!my.tzQ;if(my.tzQ){document.getElementById('canvas3').style.visibility='visible';}else{document.getElementById('canvas3').style.visibility='hidden';}
toggleBtn('tzBtn',my.tzQ)}
function toggleBtn(btn,onq){if(onq){document.getElementById(btn).classList.add("hi")
document.getElementById(btn).classList.remove("lo")}else{document.getElementById(btn).classList.add("lo")
document.getElementById(btn).classList.remove("hi")}}