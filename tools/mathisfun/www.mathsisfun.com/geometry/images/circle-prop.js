let my={}
function init(){let version='0.882'
let mode=getJSQueryVar('mode','angle')
my.modes=[{id:'arc',numPts:2,angQ:true,resizeQ:false},{id:'arcs',numPts:2,angQ:false,resizeQ:false},{id:'arclen',numPts:2,angQ:true,resizeQ:false},{id:'angle',numPts:2,angQ:true,resizeQ:false},{id:'chord',numPts:2,angQ:false,resizeQ:false},{id:'sector',numPts:2,angQ:true,resizeQ:false},{id:'segment',numPts:2,angQ:true,resizeQ:false},{id:'inscribe',fn:drawInscribe,numPts:3,angQ:true,resizeQ:false},{id:'inscribe2',fn:drawInscribe2,numPts:3,angQ:true,resizeQ:false},{id:'radius',numPts:1,angQ:false,resizeQ:true},{id:'radian',numPts:1,angQ:false,resizeQ:true},{id:'thales',fn:drawThales,numPts:1,angQ:false,resizeQ:false},]
let modeNo=0
for(let i=0;i<my.modes.length;i++){if(my.modes[i].id==mode){modeNo=i
break}}
my.mode=my.modes[modeNo]
console.log('my.mode',my.mode)
my.wd=260
my.ht=my.wd
my.drag={n:0,onQ:false,holdX:0,holdY:0}
my.circle={x:my.wd/2,y:my.ht/2,rad:100,clr:'rgba(0,0,256,0.5)'}
my.clrHi='hsla(140,100%,50%,1)'
my.clrRed='hsla(0,100%,30%,1)'
my.toggles={deg:true}
let id='circleprop'
let s=''
s+='<canvas id="canvas'+id+'" style="z-index:2; position: absolute; top: 0px; left: 0px;"></canvas>'
s+='<div id="dragem" style="font: bold 14px arial; bold; position:absolute; top:8px; left:2px; text-align:center;">Drag a point!</div>'
if(my.mode.id=='arclen'){s+='<div style="font: 15px arial;  position:absolute; left:'+(my.circle.x-65)+'px;  top:'+(my.circle.y-25)+'px; text-align:right;">Radius:</div>'
s+='<input type="text" id="rad" style="font-size: 19px; position:absolute; left:'+(my.circle.x-10)+'px; top:'+(my.circle.y-30)+'px; width:66px; z-index:2; color: #0000ff; background-color: #f0f8ff; text-align:center; border-radius: 10px; z-index:3;" value="1" onkeyup="update()" />'
s+='<div id="len" style="font: bold 15px arial; position:absolute; left:'+(my.circle.x-100)+'px;  top:'+(my.circle.y+5)+'px;  width:200px; text-align:center;">?</div>'}
if(my.mode.angQ){s+=wrap({id:'degBtn',tag:'btn',cls:'btn hi',pos:'abs',style:'right:3px; bottom:3px; z-index:3;',fn:"toggle('deg')"},'Deg')}
s+=wrap({cls:'copyrt',pos:'abs',style:'left:5px; bottom:3px'},`&copy; 2022 Rod Pierce  v${version}`)
s=wrap({cls:'js',style:'width:'+my.wd+'px; height:'+my.ht+'px;'},s)
docInsert(s)
my.can=new Can('canvas'+id,my.wd,my.ht,2)
my.shapes=[]
makeShapes()
update()
let el=my.can.el
el.addEventListener('mousedown',mouseDownListener,false)
el.addEventListener('touchstart',ontouchstart,false)
el.addEventListener('mousemove',dopointer,false)}
function ontouchstart(ev){let touch=ev.targetTouches[0]
ev.clientX=touch.clientX
ev.clientY=touch.clientY
ev.touchQ=true
mouseDownListener(ev)}
function ontouchmove(ev){let touch=ev.targetTouches[0]
ev.clientX=touch.clientX
ev.clientY=touch.clientY
ev.touchQ=true
mouseMoveListener(ev)
ev.preventDefault()}
function ontouchend(){let el=my.can.el
el.addEventListener('touchstart',ontouchstart,false)
window.removeEventListener('touchend',ontouchend,false)
if(my.drag.onQ){my.drag.onQ=false
window.removeEventListener('touchmove',ontouchmove,false)}}
function dopointer(ev){let[mouseX,mouseY]=my.can.mousePos(ev)
let inQ=false
for(let i=0;i<my.shapes.length;i++){if(hitTest(my.shapes[i],mouseX,mouseY)){inQ=true}}
if(inQ){document.body.style.cursor='pointer'}else{document.body.style.cursor='default'}}
function mouseDownListener(ev){let highestIndex=-1
let[mouseX,mouseY]=my.can.mousePos(ev)
for(let i=0;i<my.shapes.length;i++){if(hitTest(my.shapes[i],mouseX,mouseY)){my.drag.onQ=true
if(i>highestIndex){my.drag.holdX=mouseX-my.shapes[i].x
my.drag.holdY=mouseY-my.shapes[i].y
highestIndex=i
my.drag.n=i}}}
if(my.drag.onQ){document.getElementById('dragem').style.visibility='hidden'
if(ev.touchQ){window.addEventListener('touchmove',ontouchmove,false)}else{window.addEventListener('mousemove',mouseMoveListener,false)}}
let el=my.can.el
if(ev.touchQ){el.removeEventListener('touchstart',ontouchstart,false)
window.addEventListener('touchend',ontouchend,false)}else{el.removeEventListener('mousedown',mouseDownListener,false)
window.addEventListener('mouseup',mouseUpListener,false)}
if(ev.preventDefault){ev.preventDefault()}
else if(ev.returnValue){ev.returnValue=false}
return false}
function mouseUpListener(){let el=my.can.el
el.addEventListener('mousedown',mouseDownListener,false)
window.removeEventListener('mouseup',mouseUpListener,false)
if(my.drag.onQ){my.drag.onQ=false
window.removeEventListener('mousemove',mouseMoveListener,false)}}
function mouseMoveListener(ev){let posX
let posY
let shapeRad=my.shapes[my.drag.n].rad
let minX=shapeRad
let el=my.can.el
let maxX=el.width-shapeRad
let minY=shapeRad
let maxY=el.height-shapeRad
let[mouseX,mouseY]=my.can.mousePos(ev)
posX=mouseX-my.drag.holdX
posX=posX<minX?minX:posX>maxX?maxX:posX
posY=mouseY-my.drag.holdY
posY=posY<minY?minY:posY>maxY?maxY:posY
if(my.drag.onQ){my.shapes[my.drag.n].x=posX
my.shapes[my.drag.n].y=posY}
update()}
function hitTest(shape,mx,my){let dx
let dy
dx=mx-shape.x
dy=my-shape.y
return dx*dx+dy*dy<shape.rad*shape.rad}
function makeShapes(){let pos=[[97,-25,'A'],[21,-98,'B'],[-80,60,'C'],]
my.shapes=[]
for(let i=0;i<my.mode.numPts;i++){let angle=Math.atan2(pos[i][0],pos[i][1])-Math.PI/2
let cX=Math.cos(angle)*my.circle.rad
let cY=-Math.sin(angle)*my.circle.rad
my.shapes.push({x:my.circle.x+cX,y:my.circle.y+cY,rad:10,color:'rgb(0,0,255)',name:pos[i][2]})}}
function drawShapes(){let g=my.can.g
g.strokeStyle='#aaaaaa'
g.lineWidth=1
for(let i=0;i<my.shapes.length;i++){let shape=my.shapes[i]
g.fillStyle='rgba(0, 0, 255, 0.5)'
g.beginPath()
g.arc(shape.x,shape.y,shape.rad,0,2*Math.PI,false)
g.closePath()
g.fill()
g.fillStyle='rgba(0, 0, 255, 0.8)'
g.beginPath()
g.arc(shape.x,shape.y,2,0,2*Math.PI,false)
g.closePath()
g.fill()
g.font='14px Arial'
g.textAlign='left'
g.fillText(String.fromCharCode(65+i),shape.x+5,shape.y-5,100)}}
function toggle(name){my.toggles[name]=!my.toggles[name]
console.log('toggle',my.toggles)
let div=document.getElementById(name+'Btn')
if(my.toggles[name]){div.classList.add('hi')
div.classList.remove('lo')
div.innerHTML='Deg'}else{div.classList.add('lo')
div.classList.remove('hi')
div.innerHTML='Rad'}
update()}
function update(){let i,dx,dy,txt,t,rad,lblX,lblY,midAngle,dang,ang
my.can.clear()
if(my.drag.onQ){let x0=my.shapes[my.drag.n].x-my.circle.x
let y0=my.shapes[my.drag.n].y-my.circle.y
let cX=0
let cY=0
let angle=Math.atan2(-y0,x0)
if(angle<0)angle+=2*Math.PI
if(my.mode.resizeQ){cX=x0
cY=y0
my.circle.rad=dist(x0,y0)}else{cX=Math.cos(angle)*my.circle.rad
cY=-Math.sin(angle)*my.circle.rad}
my.shapes[my.drag.n].x=my.circle.x+cX
my.shapes[my.drag.n].y=my.circle.y+cY}
let g=my.can.g
g.lineWidth=1
g.strokeStyle=my.circle.clr
g.beginPath()
g.arc(my.circle.x,my.circle.y,my.circle.rad,0,2*Math.PI)
g.stroke()
let angles=[]
for(i=0;i<my.shapes.length;i++){let pt=my.shapes[i]
angles[i]=Math.atan2(-(pt.y-my.circle.y),pt.x-my.circle.x)
angles[i]=angles[i]
if(angles[i]<0)angles[i]+=2*Math.PI}
let angDiff=angles[1]-angles[0]
if(angDiff<0)angDiff+=2*Math.PI
let angleSnap=parseInt(angleDeg(angDiff,true))
let pts=my.shapes
if(my.mode.hasOwnProperty('fn')){my.mode.fn(pts)}
let n0,n1
switch(my.mode.id){case 'radian':g.beginPath()
g.strokeStyle=my.clrRed
g.moveTo(my.circle.x,my.circle.y)
g.lineTo(pts[0].x,pts[0].y)
g.stroke()
dx=pts[0].x-my.circle.x
dy=pts[0].y-my.circle.y
let ang1=Math.atan2(-dy,dx)+1
let len=dist(dx,dy)
let xr=my.circle.x+len*Math.cos(ang1)
let yr=my.circle.y-len*Math.sin(ang1)
g.beginPath()
g.strokeStyle=my.clrRed
g.moveTo(my.circle.x,my.circle.y)
g.lineTo(xr,yr)
g.stroke()
g.strokeStyle=my.clrHi
g.lineWidth=3
g.beginPath()
g.arc(my.circle.x,my.circle.y,len,-ang1,-ang1+1)
g.stroke()
g.lineWidth=1
g.strokeStyle='black'
g.fillStyle='yellow'
g.beginPath()
g.moveTo(my.circle.x,my.circle.y)
g.arc(my.circle.x,my.circle.y,40,-ang1,-ang1+1)
g.closePath()
g.stroke()
g.fill()
g.fillStyle='black'
xr=my.circle.x+60*Math.cos(ang1-0.5)
yr=my.circle.y-60*Math.sin(ang1-0.5)
g.textAlign='center'
g.fillText('1 radian',xr,yr)
if(len>30){g.beginPath()
g.fillStyle='orange'
g.font='16px Lucida Console'
txt='radius'
if(dx<0)txt='suidar'
for(i=0;i<txt.length;i++){t=txt.charAt(i)
g.fillText(t,my.circle.x+(i+2)*(dx/10),my.circle.y+(i+2)*(dy/10))}
g.fill()
rad=dist(pts[0].x-my.circle.x,pts[0].y-my.circle.y)-4
txt='radius'
if(dx>0)txt='suidar'
g.fillStyle='orange'
dang=10/rad
ang=1.57+dang*6
ang=-ang1+0.8
for(i=0;i<txt.length;i++){t=txt.charAt(i)
dx=(rad+10)*Math.cos(ang)+5
dy=(rad+10)*Math.sin(ang)+5
ang-=dang
g.fillText(t,my.circle.x+dx-5,my.circle.y+dy)
g.fill()}}
break
case 'radius':g.beginPath()
g.strokeStyle=my.clrRed
g.moveTo(pts[0].x,pts[0].y)
g.lineTo(my.circle.x,my.circle.y)
g.stroke()
g.fillStyle='orange'
g.font='16px Lucida Console'
dx=pts[0].x-my.circle.x
dy=pts[0].y-my.circle.y
txt='radius'
if(dx<0)txt='suidar'
for(i=0;i<txt.length;i++){t=txt.charAt(i)
g.fillText(t,my.circle.x+(i+2)*(dx/10),my.circle.y+(i+2)*(dy/10))}
g.fill()
rad=dist(pts[0].x-my.circle.x,pts[0].y-my.circle.y)-4
txt='circumference'
g.fillStyle='orange'
dang=10/rad
ang=1.57+dang*6
for(i=0;i<txt.length;i++){t=txt.charAt(i)
dx=rad*Math.cos(ang)
dy=rad*Math.sin(ang)
ang-=dang
g.fillText(t,my.circle.x+dx-5,my.circle.y+dy)
g.fill()}
break
case 'angle':g.beginPath()
g.strokeStyle=my.clrRed
g.moveTo(pts[0].x,pts[0].y)
g.lineTo(my.circle.x,my.circle.y)
g.lineTo(pts[1].x,pts[1].y)
g.stroke()
if(angleSnap==90){g.drawBox(my.circle.x,my.circle.y,25,-Math.PI/2-angles[0])}else{g.beginPath()
g.fillStyle='hsla(60,100%,80%,0.5)'
g.moveTo(my.circle.x,my.circle.y)
g.arc(my.circle.x,my.circle.y,30,-angles[1],-angles[0])
g.fill()
g.stroke()
midAngle=(angles[0]+angles[1])/2
if(angles[0]>angles[1])midAngle+=Math.PI
lblX=Math.cos(midAngle)*60
lblY=-Math.sin(midAngle)*60
g.font='24px Arial'
g.fillStyle=my.clrHi
g.textAlign='center'
g.fillText(angTxt(angleSnap),my.circle.x+lblX,my.circle.y+lblY+10)}
break
case 'sector':case 'segment':n0=0
n1=1
if(angDiff>Math.PI){let temp=n1
n1=n0
n0=temp
angDiff=angles[n1]-angles[n0]
if(angDiff<0)angDiff+=2*Math.PI
angleSnap=parseInt(angleDeg(angDiff,true))}
g.beginPath()
g.fillStyle='rgba(255,255,184,1)'
g.strokeStyle='blue'
g.lineWidth=1.5
g.moveTo(pts[n0].x,pts[n0].y)
if(my.mode.id=='sector')g.lineTo(my.circle.x,my.circle.y)
g.lineTo(pts[n1].x,pts[n1].y)
g.arc(my.circle.x,my.circle.y,my.circle.rad,-angles[n1],-angles[n0])
g.fill()
g.stroke()
if(my.mode.id=='sector'){if(angleSnap==90){g.drawBox(my.circle.x,my.circle.y,25,-Math.PI/2-angles[n0])}else{g.beginPath()
g.arc(my.circle.x,my.circle.y,30,-angles[n1],-angles[n0])
g.stroke()
midAngle=(angles[n0]+angles[n1])/2
if(angles[n0]>angles[n1])midAngle+=Math.PI
lblX=Math.cos(midAngle)*60
lblY=-Math.sin(midAngle)*60
g.font='24px Arial'
g.fillStyle='blue'
g.textAlign='center'
g.fillText(angTxt(angleSnap),my.circle.x+lblX,my.circle.y+lblY+10)}}else{g.font='24px Arial'
g.fillStyle=my.clrHi
g.textAlign='center'
g.fillText(angTxt(angleSnap),my.circle.x,my.circle.y+10)}
break
case 'chord':n0=0
n1=1
if(angDiff>Math.PI){let temp=n1
n1=n0
n0=temp
angDiff=angles[n1]-angles[n0]
if(angDiff<0)angDiff+=2*Math.PI
angleSnap=parseInt(angleDeg(angDiff,true))}
g.beginPath()
g.strokeStyle=my.clrHi
g.lineWidth=2
g.moveTo(pts[n0].x,pts[n0].y)
g.lineTo(pts[n1].x,pts[n1].y)
g.stroke()
break
case 'arc':case 'arclen':g.beginPath()
g.strokeStyle=my.clrHi
g.lineWidth=3
g.arc(my.circle.x,my.circle.y,my.circle.rad,-angles[1],-angles[0])
g.stroke()
g.lineWidth=1
midAngle=(angles[0]+angles[1])/2
if(angles[0]>angles[1])midAngle+=Math.PI
lblX=Math.cos(midAngle)*70
lblY=-Math.sin(midAngle)*70
g.font='24px Arial'
g.fillStyle=my.clrHi
g.textAlign='center'
angleSnap=parseInt(angleDeg(angDiff,true))
g.fillText(angTxt(angleSnap),my.circle.x+lblX,my.circle.y+lblY+10)
g.font='18px Arial'
lblX=Math.cos(midAngle)*116
lblY=-Math.sin(midAngle)*116
g.fillText('arc',my.circle.x+lblX,my.circle.y+lblY+10)
if(my.mode.id=='arclen'){let r=document.getElementById('rad').value
document.getElementById('len').innerHTML='Arc Length = '+(r*((angleSnap*Math.PI)/180.0)).toPrecision(6)}
break
case 'arcs':n0=0
n1=1
if(angDiff>Math.PI){let temp=n1
n1=n0
n0=temp
angDiff=angles[n1]-angles[n0]
if(angDiff<0)angDiff+=2*Math.PI
angleSnap=parseInt(angleDeg(angDiff,true))}
midAngle=(angles[n0]+angles[n1])/2
if(angles[n0]>angles[n1])midAngle+=Math.PI
lblX=Math.cos(midAngle)*60
lblY=-Math.sin(midAngle)*60
g.font='18px Arial'
g.fillStyle=my.clrHi
g.textAlign='center'
g.fillText('Minor\nArc',my.circle.x+lblX,my.circle.y+lblY+10)
g.beginPath()
g.strokeStyle=my.clrHi
g.lineWidth=2
g.arc(my.circle.x,my.circle.x,my.circle.rad,-angles[n1],-angles[n0])
g.stroke()
midAngle=(angles[n0]+angles[n1])/2
if(angles[n0]<angles[n1])midAngle+=Math.PI
lblX=Math.cos(midAngle)*60
lblY=-Math.sin(midAngle)*60
g.font='18px Arial'
g.fillStyle=my.clrRed
g.textAlign='center'
g.fillText('Major\nArc',my.circle.x+lblX,my.circle.y+lblY+10)
g.beginPath()
g.strokeStyle=my.clrRed
g.lineWidth=2
g.arc(my.circle.x,my.circle.y,my.circle.rad,-angles[n1],-angles[n0],true)
g.stroke()
break
default:}
drawShapes()}
function drawInscribe2(pts){drawInscribe(pts,false)
drawInscribe(pts,true)}
function drawInscribe(pts,centralQ=false){let ptm1=pts[0]
let pt=pts[1]
let ptp1=pts[2]
let a1=Math.atan2(ptm1.y-pt.y,ptm1.x-pt.x)
let a2=Math.atan2(ptp1.y-pt.y,ptp1.x-pt.x)
if(a1>a2)a2+=2*Math.PI
let flipQ=a2-a1>Math.PI
if(centralQ){pt={x:my.circle.x,y:my.circle.y}
a1=Math.atan2(ptm1.y-pt.y,ptm1.x-pt.x)
a2=Math.atan2(ptp1.y-pt.y,ptp1.x-pt.x)
if(a1>a2)a2+=2*Math.PI}
if(flipQ){let temp=a1
a1=a2
a2=temp}
let angDeg=((a2-a1)*180.0)/Math.PI
if(angDeg<0)angDeg+=360.0
angDeg=Math.round(angDeg)
let g=my.can.g
g.beginPath()
g.strokeStyle='hsla(60,100%,20%,1)'
g.fillStyle='hsla(60,100%,80%,0.5)'
if(angDeg==90){g.drawBox(pt.x,pt.y,30,a1)}else{g.moveTo(pt.x,pt.y)
g.arc(pt.x,pt.y,30,a1,a2)
g.lineTo(pt.x,pt.y)
g.fill()}
g.stroke()
g.font='20px Arial'
g.fillStyle=my.clrHi
g.textAlign='center'
let midAngle=(a1+a2)/2
if(a1>a2)midAngle+=Math.PI
let lblX=Math.cos(midAngle)*50
let lblY=Math.sin(midAngle)*50
g.fillText(angTxt(angDeg),pt.x+lblX,pt.y+lblY+10)
g.beginPath()
g.strokeStyle=my.clrHi
g.lineWidth=1
g.moveTo(pts[0].x,pts[0].y)
g.lineTo(pt.x,pt.y)
g.lineTo(pts[2].x,pts[2].y)
g.stroke()}
function angTxt(angDeg){return my.toggles.deg?angDeg.toString()+'°':(angDeg*(3.1416/180)).toFixed(3)}
function drawThales(pts){let ptm1={x:my.circle.x-my.circle.rad,y:my.circle.y}
let pt=pts[0]
let ptp1={x:my.circle.x+my.circle.rad,y:my.circle.y}
let a1=Math.atan2(ptm1.y-pt.y,ptm1.x-pt.x)
let a2=Math.atan2(ptp1.y-pt.y,ptp1.x-pt.x)
if(a1>a2)a2+=2*Math.PI
if(a2-a1>Math.PI){let temp=a1
a1=a2
a2=temp}
let angDeg=((a2-a1)*180.0)/Math.PI
if(angDeg<0)angDeg+=360.0
angDeg=Math.round(angDeg)
let g=my.can.g
g.beginPath()
g.strokeStyle='hsla(60,100%,20%,1)'
g.fillStyle='hsla(60,100%,80%,0.5)'
if(angDeg==90){g.drawBox(pt.x,pt.y,25,a1)}else{g.moveTo(pt.x,pt.y)
g.arc(pt.x,pt.y,30,a1,a2)
g.fill()}
g.stroke()
let midAngle=(a1+a2)/2
if(a1>a2)midAngle+=Math.PI
let lblX=Math.cos(midAngle)*50
let lblY=Math.sin(midAngle)*50
g.font='20px Arial'
g.fillStyle=my.clrHi
g.textAlign='center'
g.fillText(angTxt(angDeg),pt.x+lblX,pt.y+lblY+10)
g.beginPath()
g.strokeStyle=my.circle.clr
g.lineWidth=1
g.moveTo(ptm1.x,ptm1.y)
g.lineTo(ptp1.x,ptp1.y)
g.stroke()
g.beginPath()
g.strokeStyle=my.clrHi
g.lineWidth=1
g.moveTo(ptm1.x,ptm1.y)
g.lineTo(pt.x,pt.y)
g.lineTo(ptp1.x,ptp1.y)
g.stroke()}
function angleDeg(angleRad,snap90sQ){let angle=(angleRad*180.0)/Math.PI
if(snap90sQ){if(angle<=1||angle>=359)angle=0
if(angle>=89&&angle<92)angle=90
if(angle>=179&&angle<182)angle=180
if(angle>=269&&angle<272)angle=270}
return angle}
CanvasRenderingContext2D.prototype.drawBox=function(midX,midY,radius,angle){let g=this
g.beginPath()
let pts=[[0,0],[Math.cos(angle),Math.sin(angle)],[Math.cos(angle)+Math.cos(angle+Math.PI/2),Math.sin(angle)+Math.sin(angle+Math.PI/2)],[Math.cos(angle+Math.PI/2),Math.sin(angle+Math.PI/2)],[0,0],]
for(let i=0;i<pts.length;i++){if(i==0){g.moveTo(midX+radius*pts[i][0],midY+radius*pts[i][1])}else{g.lineTo(midX+radius*pts[i][0],midY+radius*pts[i][1])}}
g.stroke()}
function dist(dx,dy){return Math.sqrt(dx*dx+dy*dy)}
function getJSQueryVar(varName,defaultVal){let scripts=document.getElementsByTagName('script')
let lastScript=scripts[scripts.length-1]
let scriptName=lastScript.src
let bits=scriptName.split('?')
if(bits.length<2)return defaultVal
let query=bits[1]
console.log('query: ',query)
let vars=query.split('&')
for(let i=0;i<vars.length;i++){let pair=vars[i].split('=')
if(pair[0]==varName){return pair[1]}}
return defaultVal}
function docInsert(s){let div=document.createElement('div')
div.innerHTML=s
let script=document.currentScript
script.parentElement.insertBefore(div,script)}
class Can{constructor(id,wd,ht,ratio){this.id=id
this.ratio=ratio
this.el=document.getElementById(id)
this.g=this.el.getContext('2d')
this.resize(wd,ht)
return this}
resize(wd,ht){this.wd=wd
this.ht=ht
this.el.width=wd*this.ratio
this.el.style.width=wd+'px'
this.el.height=ht*this.ratio
this.el.style.height=ht+'px'
this.g.setTransform(this.ratio,0,0,this.ratio,0,0)}
clear(){this.g.clearRect(0,0,this.wd,this.ht)}
mousePos(ev){let bRect=this.el.getBoundingClientRect()
let mouseX=(ev.clientX-bRect.left)*(this.el.width/this.ratio/bRect.width)
let mouseY=(ev.clientY-bRect.top)*(this.el.height/this.ratio/bRect.height)
return[mouseX,mouseY]}}
function wrap({id='',cls='',pos='rel',style='',txt='',tag='div',lbl='',fn='',opts=[]},...mores){let s=''
s+='\n'
txt+=mores.join('')
s+={btn:()=>{if(cls.length==0)cls='btn'
return '<button onclick="'+fn+'"'},can:()=>'<canvas',div:()=>{let s='<div'
s+=fn.length>0?' onclick="'+fn+'" ':''
style+=fn.length>0?' cursor:pointer;':''
return s},edit:()=>{let s=''
s+=lbl.length>0?'<label class="label">'+lbl+' ':''
s+='<textarea onkeyup="'+fn+'" onchange="'+fn+'"'
return s},inp:()=>{if(cls.length==0)cls='input'
let s=''
s+=lbl.length>0?'<label class="label">'+lbl+' ':''
s+='<input value="'+txt+'"'
s+=fn.length>0?'  oninput="'+fn+'" onchange="'+fn+'"':''
return s},out:()=>{pos='dib'
if(cls.length==0)cls='output'
let s=''
s+=lbl.length>0?'<label class="label">'+lbl+' ':''
s+='<span '
return s},radio:()=>{if(cls.length==0)cls='radio'
return '<div '},sel:()=>{if(cls.length==0)cls='select'
let s=''
s+=lbl.length>0?'<label class="label">'+lbl+' ':''
s+='<select '
s+=fn.length>0?'  onchange="'+fn+'"':''
return s},sld:()=>'<input type="range" '+txt+' oninput="'+fn+'" onchange="'+fn+'"',}[tag]()||''
if(id.length>0)s+=' id="'+id+'"'
if(cls.length>0)s+=' class="'+cls+'"'
if(pos=='dib')s+=' style="position:relative; display:inline-block;'+style+'"'
if(pos=='rel')s+=' style="position:relative; '+style+'"'
if(pos=='abs')s+=' style="position:absolute; '+style+'"'
s+={btn:()=>'>'+txt+'</button>',can:()=>'></canvas>',div:()=>' >'+txt+'</div>',edit:()=>' >'+txt+'</textarea>',inp:()=>'>'+(lbl.length>0?'</label>':''),out:()=>' >'+txt+'</span>'+(lbl.length>0?'</label>':''),radio:()=>{let s=''
s+='>\n'
for(let i=0;i<opts.length;i++){let chk=''
if(i==0)chk='checked'
let idi=id+i
let lbl=opts[i]
s+='<input id="'+idi+'" type="radio" name="'+id+'" value="'+lbl.name+'" onclick="'+fn+'('+i+');" '+chk+' >'
s+='<label for="'+idi+'">'+lbl.name+' </label>'}
s+='</div>'
return s},sel:()=>{let s=''
s+='>\n'
for(let i=0;i<opts.length;i++){let opt=opts[i]
let idStr=id+i
let chkStr=opt.descr==txt?' selected ':''
s+='<option id="'+idStr+'" value="'+opt.name+'"'+chkStr+'>'+opt.descr+'</option>\n'}
s+='</select>'
if(lbl.length>0)s+='</label>'
return s},sld:()=>'>',}[tag]()||''
s+='\n'
return s.trim()}
init()