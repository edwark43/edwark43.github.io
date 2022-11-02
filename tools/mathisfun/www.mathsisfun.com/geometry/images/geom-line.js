let my={}
function init(){let version='0.94'
my.mode=getJSQueryVar('mode','bisect')
if(my.mode=='seg')my.mode='line segment'
my.lineTyps=['line','ray','line segment']
let canvasid='canvas'+my.mode
my.dragging=false
let w=540
let h=360
let s=''
s+='<div style="position:relative; width:'+w+'px; height:'+h+'px; border: none; border-radius: 9px; margin:auto; display:block; box-shadow: 0px 0px 19px 10px rgba(0,0,68,0.46); ">'
s+='<canvas id="'+canvasid+'" width="'+w+'" height="'+h+'" style="z-index:10;"></canvas>'
if(my.lineTyps.indexOf(my.mode)!=-1){s+='<form onclick="doType()" id="formtype" style="position:absolute; left:5px; top:5px; text-align: left; padding: 5px; font: bold 11pt arial; color: #6600cc; background: rgba(200,220,256,0.7); border-radius: 9px; z-index:3; ">'
for(let i=0;i<my.lineTyps.length;i++){s+='<input type="radio" id="r'+i+'" name="typ" value="'+my.lineTyps[i]+'" />'
s+='<label for="r'+i+'" style="height:18px; cursor:pointer;">'+my.lineTyps[i]+'</label><br/>'}
s+='</form>'}
s+='<div id="btns2" style="position:absolute; right:3px; top:3px;">'
s+='<button id="appBtn" onclick="winNew()" style="z-index:2;" class="btn">'+winnewSvg()+'</button>'
s+='</div>'
s+='<div id="btns2" style="position:absolute; right:3px; bottom:3px;">'
s+='<button id="coordsBtn" onclick="toggleCoords()" style="z-index:2;" class="btn lo" >Coords</button>'
s+='<button id="resetBtn" onclick="reset()" style="z-index:2;" class="btn" >Reset</button>'
s+='</div>'
s+=wrap({cls:'copyrt',pos:'abs',style:'left:5px; bottom:3px'},`&copy; 2022 Rod Pierce  v${version}`)
s+='</div>'
docInsert(s)
my.can=new Can(canvasid,w,h,2)
my.coords=new Coords(0,0,w,h,-2,-1.9,15,11,true)
my.graph=new Graph(my.can.g,my.coords)
my.dragNo=0
my.coordsQ=false
my.shapes=[]
switch(my.mode){case 'equi':break
case 'bisect':break
case 'reflect':break
case 'pts':break
default:setType()}
makeShapes()
let el=my.can.el
el.addEventListener('mousedown',mouseDownListener,false)
el.addEventListener('touchstart',ontouchstart,false)
el.addEventListener('mousemove',domousemove,false)
doType()}
function reflect(){let g=my.can.g
let ln=new Ln(my.shapes[0],my.shapes[1])
let wall=new Ln(my.shapes[2],my.shapes[3])
wall.setLen(1200)
g.strokeStyle='hsla(0,100%,60%,1)'
g.lineWidth=3
wall.draw(g)
let iPt=ln.getIntersection(wall,false)
console.log('iPt',iPt)
let ln3=new Ln(my.shapes[0],iPt)
g.strokeStyle='hsla(240,100%,75%,1)'
g.lineWidth=2
ln3.draw(g)
let ln4=ln.reflect(wall)
ln4.setLen(1200,false)
g.strokeStyle='hsla(240,100%,85%,1)'
g.lineWidth=2
ln4.draw(g)
return}
function winnewSvg(){let s=''
s+='<svg xmlns="http://www.w3.org/2000/svg" width="26" height="21" version="1.1" style="stroke-width:2; fill:none; vertical-align:middle;">'
s+='<rect style="stroke:grey;" x="1" y="6" ry="4" width="19" height="13" />'
s+='<path style="stroke:#cdf;stroke-width:3;" d="m 14,6 h 6 v 6"/>'
s+='<path style="stroke:black;" d="m 16,2 h 8 v 8"/>'
s+='<path style="stroke:black;" d="m 14,12 10,-10"/>'
s+='</svg>'
return s}
function winNew(){if(my.mode=='line segment')my.mode='seg'
window.open(toLoc('../appeb7b.html?folder=geometry&amp;file=geom-line&amp;p='+my.mode))}
function toLoc(s){if(window.location.href.indexOf('localhost')>0)s='/mathsisfun'+s
return s}
function getType(){let typeStr=''
if(my.lineTyps.indexOf(my.mode)!=-1){let buttons=document.getElementsByName('typ')
for(let i=0;i<buttons.length;i++){let button=buttons[i]
if(button.checked){typeStr=button.value}}}else{typeStr=my.mode}
return typeStr}
function setType(){let buttons=document.getElementsByName('typ')
for(let i=0;i<buttons.length;i++){let button=buttons[i]
if(button.value==my.mode){button.checked=true}}}
function reset(){makeShapes()
update()}
function update(){doType()}
function toggleCoords(){my.coordsQ=!my.coordsQ
toggleBtn('coordsBtn',my.coordsQ)
update()}
function toggleBtn(btn,onq){if(onq){document.getElementById(btn).classList.add('hi')
document.getElementById(btn).classList.remove('lo')}else{document.getElementById(btn).classList.add('lo')
document.getElementById(btn).classList.remove('hi')}}
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
if(my.dragging){my.dragging=false
window.removeEventListener('touchmove',ontouchmove,false)}}
function domousemove(ev){document.body.style.cursor='default'
let pt=my.can.mousePos(ev)
for(let i=0;i<my.shapes.length;i++){if(hitTest(my.shapes[i],pt.x,pt.y)){my.dragNo=i
document.body.style.cursor='pointer'}}}
function mouseDownListener(ev){let i
let highestIndex=-1
let pt=my.can.mousePos(ev)
for(i=0;i<my.shapes.length;i++){if(hitTest(my.shapes[i],pt.x,pt.y)){my.dragNo=i
my.dragging=true
if(i>highestIndex){my.dragHoldX=pt.x-my.shapes[i].x
my.dragHoldY=pt.y-my.shapes[i].y
highestIndex=i
my.dragNo=i}}}
if(my.dragging){if(ev.touchQ){window.addEventListener('touchmove',ontouchmove,false)}else{window.addEventListener('mousemove',mouseMoveListener,false)}
doType()}
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
if(my.dragging){my.dragging=false
window.removeEventListener('mousemove',mouseMoveListener,false)}}
function mouseMoveListener(ev){let posX
let posY
let el=my.can.el
let shapeRad=my.shapes[my.dragNo].rad
let minX=shapeRad
let maxX=el.width-shapeRad
let minY=shapeRad
let maxY=el.height-shapeRad
let pt=my.can.mousePos(ev)
posX=pt.x-my.dragHoldX
posX=posX<minX?minX:posX>maxX?maxX:posX
posY=pt.y-my.dragHoldY
posY=posY<minY?minY:posY>maxY?maxY:posY
my.shapes[my.dragNo].x=posX
my.shapes[my.dragNo].y=posY
doType()}
function hitTest(shape,mx,my){let dx
let dy
dx=mx-shape.x
dy=my-shape.y
return dx*dx+dy*dy<shape.rad*shape.rad}
function doType(){my.mode=getType()
my.can.clear()
my.graph.drawGraph()
drawPts()}
function makeShapes(){let xys=[]
switch(my.mode){case 'reflect':xys=[[320,100],[200,230],[309,309],[195,87],]
break
case 'bisect':xys=[[150,220],[350,150],[309,309],[195,87],]
break
case 'collinear':xys=[[99,151,'A'],[217.45,196.2,'B'],[300,100,'C'],[400,100,'D'],]
break
case 'equi':xys=[[150,220],[350,150],[215,87],]
break
case 'pts':xys=[[150,220],[350,150],[215,87],]
break
default:xys=[[150,220],[350,150],]}
my.shapes=[]
for(let i=0;i<xys.length;i++){let xy=xys[i]
my.shapes.push(new Pt(xy[0],xy[1]))}}
function drawPts(){let i
let g=my.can.g
g.strokeStyle='rgba(0, 0, 255, 0.5)'
g.fillStyle='rgba(5, 5, 200, 1)'
g.lineWidth=2
let pt
let ln
switch(my.mode){case 'line':ln=new Ln(my.shapes[0],my.shapes[1])
ln.setLen(1500,true)
g.beginPath()
g.moveTo(ln.a.x,ln.a.y)
g.lineTo(ln.b.x,ln.b.y)
g.stroke()
break
case 'ray':ln=new Ln(my.shapes[0],my.shapes[1])
ln.setLen(1500,false)
g.beginPath()
g.moveTo(ln.a.x,ln.a.y)
g.lineTo(ln.b.x,ln.b.y)
g.stroke()
break
case 'line segment':g.beginPath()
g.moveTo(my.shapes[0].x,my.shapes[0].y)
g.lineTo(my.shapes[1].x,my.shapes[1].y)
g.stroke()
break
case 'bisect':g.beginPath()
g.moveTo(my.shapes[0].x,my.shapes[0].y)
g.lineTo(my.shapes[1].x,my.shapes[1].y)
g.stroke()
let midPt=new Pt((my.shapes[0].x+my.shapes[1].x)/2,(my.shapes[0].y+my.shapes[1].y)/2)
g.strokeStyle='orange'
g.lineWidth=2
g.beginPath()
g.arc(midPt.x,midPt.y,3,0,Math.PI*2)
g.stroke()
g.fillStyle='orange'
g.font='bold 16px Arial'
g.fillText('Mid',midPt.x+5,midPt.y+12)
g.fill()
let fix=2
let mov=3
if(my.dragNo==3){fix=3
mov=2}
let dx=my.shapes[fix].x-midPt.x
let dy=my.shapes[fix].y-midPt.y
my.shapes[mov].x=midPt.x-dx
my.shapes[mov].y=midPt.y-dy
ln=new Ln(my.shapes[0],my.shapes[1])
let ln2=new Ln(my.shapes[2],my.shapes[3])
ln2.setLen(1200,true)
g.strokeStyle='red'
g.lineWidth=1
g.beginPath()
g.moveTo(ln2.a.x,ln2.a.y)
g.lineTo(ln2.b.x,ln2.b.y)
g.stroke()
let ang=Math.atan2(dy,dx)
let s='Bisector'
if(ln.isPerp(ln2,0.03)){s='Perpendicular Bisector'
g.strokeStyle='orange'
g.lineWidth=1
g.beginPath()
g.drawBox(midPt.x,midPt.y,25,ln2.getAngle())
g.stroke()}
g.fillStyle='red'
g.font='bold 14px Arial'
g.save()
g.translate(my.shapes[mov].x+5,my.shapes[mov].y+12)
g.rotate(ang)
g.beginPath()
g.fillText(s,0,0)
g.restore()
g.fill()
break
case 'reflect':reflect()
break
case 'collinear':let drag=my.shapes[my.dragNo]
let maxDist=-1
let maxPtNo=-1
for(let i=0;i<my.shapes.length;i++){let pt=my.shapes[i]
let d=dist(drag.x-pt.x,drag.y-pt.y)
if(d>maxDist){maxDist=d
maxPtNo=i}}
ln=new Ln(drag,my.shapes[maxPtNo])
for(i=0;i<my.shapes.length;i++){pt=my.shapes[i]
if(pt!=drag){let ptNew=ln.getClosestPoint(pt)
pt.setxy(ptNew.x,ptNew.y)}}
break
case 'equi':ln=new Ln(my.shapes[0],my.shapes[1])
ln.rotateMidMe(Math.PI/2)
ln.setLen(1200,true)
g.strokeStyle='orange'
g.lineWidth=2
g.beginPath()
g.moveTo(ln.a.x,ln.a.y)
g.lineTo(ln.b.x,ln.b.y)
g.stroke()
let pNew=ln.getClosestPoint(my.shapes[2])
my.shapes[2].x=pNew.x
my.shapes[2].y=pNew.y
g.strokeStyle='grey'
g.lineWidth=1
g.beginPath()
g.moveTo(my.shapes[0].x,my.shapes[0].y)
g.lineTo(my.shapes[2].x,my.shapes[2].y)
g.stroke()
g.beginPath()
g.moveTo(my.shapes[1].x,my.shapes[1].y)
g.lineTo(my.shapes[2].x,my.shapes[2].y)
g.stroke()
break
default:}
let dbg=''
for(i=0;i<my.shapes.length;i++){g.fillStyle='rgba(120, 120, 255, 0.5)'
g.beginPath()
g.arc(my.shapes[i].x,my.shapes[i].y,my.shapes[i].rad,0,2*Math.PI,false)
g.closePath()
g.fill()
g.fillStyle='orange'
g.beginPath()
g.arc(my.shapes[i].x,my.shapes[i].y,2,0,2*Math.PI,false)
g.closePath()
g.fill()
g.textAlign='left'
if(my.coordsQ){g.font='bold 14px Arial'
let txt='('
txt+=my.coords.toXVal(my.shapes[i].x).toFixed(1)
txt+=','
txt+=my.coords.toYVal(my.shapes[i].y).toFixed(1)
txt+=')'
g.fillText(txt,my.shapes[i].x+5,my.shapes[i].y-9)}else{g.font='14px Arial'
g.fillText(String.fromCharCode(65+i),my.shapes[i].x+5,my.shapes[i].y-9)}
dbg+='['+Math.floor(my.shapes[i].x)+','+Math.floor(my.shapes[i].y)+'],'}}
class Pt{constructor(ix,iy){this.x=ix
this.y=iy
this.rad=9
this.color='rgb('+0+','+0+','+255+')'
this.angleIn=0
this.angleOut=0}
setxy(ix,iy){this.x=ix
this.y=iy}
getAngle(){return this.angleOut-this.angleIn}
drawMe(g){g.fillStyle='rgba(0, 0, 255, 0.3)'
g.beginPath()
g.arc(this.x,this.y,20,0,2*Math.PI,false)
g.closePath()
g.fill()}
getAvg(pts){let xSum=0
let ySum=0
for(let i=0;i<pts.length;i++){xSum+=pts[i].x
ySum+=pts[i].y}
let newPt=new Pt(xSum/pts.length,ySum/pts.length)
newPt.x=xSum/pts.length
newPt.y=ySum/pts.length
return newPt}
setAvg(pts){this.setPrevPt()
let newPt=this.getAvg(pts)
this.x=newPt.x
this.y=newPt.y}
interpolate(pt1,pt2,f){this.setPrevPt()
this.x=pt1.x*f+pt2.x*(1-f)
this.y=pt1.y*f+pt2.y*(1-f)}
translate(pt,addQ){addQ=typeof addQ!=='undefined'?addQ:true
let t=new Pt(this.x,this.y)
t.x=this.x
t.y=this.y
if(addQ){t.x+=pt.x
t.y+=pt.y}else{t.x-=pt.x
t.y-=pt.y}
return t}
translateMe(pt,addQ){addQ=typeof addQ!=='undefined'?addQ:true
if(addQ){this.x+=pt.x
this.y+=pt.y}else{this.x-=pt.x
this.y-=pt.y}}
rotate(angle){let cosa=Math.cos(angle)
let sina=Math.sin(angle)
let xPos=this.x*cosa+this.y*sina
let yPos=-this.x*sina+this.y*cosa
return new Pt(xPos,yPos)}
rotateMe(angle){let t=new Pt(this.x,this.y).rotate(angle)
this.x=t.x
this.y=t.y}
multiply(fact){return new Pt(this.x*fact,this.y*fact)}
multiplyMe(fact){this.x*=fact
this.y*=fact}}
function dist(dx,dy){return Math.sqrt(dx*dx+dy*dy)}
function loop(currNo,minNo,maxNo,incr){currNo+=incr
let range=maxNo-minNo+1
if(currNo<minNo){currNo=maxNo-((-currNo+maxNo)%range)}
if(currNo>maxNo){currNo=minNo+((currNo-minNo)%range)}
return currNo}
function constrain(min,val,max){return Math.min(Math.max(min,val),max)}
function Coords(left,top,width,height,xStt,yStt,xEnd,yEnd,uniScaleQ){this.left=left
this.top=top
this.width=width
this.height=height
this.xStt=xStt
this.yStt=yStt
this.xEnd=xEnd
this.yEnd=yEnd
this.uniScaleQ=uniScaleQ
this.xLogQ=false
this.yLogQ=false
this.skewQ=false
this.xScale
this.xLogScale
this.yScale
this.calcScale()}
Coords.prototype.calcScale=function(){if(this.xLogQ){if(this.xStt<=0)this.xStt=1
if(this.xEnd<=0)this.xEnd=1}
if(this.yLogQ){if(this.yStt<=0)this.yStt=1
if(this.yEnd<=0)this.yEnd=1}
let temp
if(this.xStt>this.xEnd){temp=this.xStt
this.xStt=this.xEnd
this.xEnd=temp}
if(this.yStt>this.yEnd){temp=this.yStt
this.yStt=this.yEnd
this.yEnd=temp}
let xSpan=this.xEnd-this.xStt
if(xSpan<=0)xSpan=0.1
this.xScale=xSpan/this.width
this.xLogScale=(Math.log(this.xEnd)-Math.log(this.xStt))/this.width
let ySpan=this.yEnd-this.yStt
if(ySpan<=0)ySpan=0.1
this.yScale=ySpan/this.height
this.yLogScale=(Math.log(this.yEnd)-Math.log(this.yStt))/this.height
if(this.uniScaleQ&&!this.xLogQ&&!this.yLogQ){let newScale=Math.max(this.xScale,this.yScale)
this.xScale=newScale
xSpan=this.xScale*this.width
let xMid=(this.xStt+this.xEnd)/2
this.xStt=xMid-xSpan/2
this.xEnd=xMid+xSpan/2
this.yScale=newScale
ySpan=this.yScale*this.height
let yMid=(this.yStt+this.yEnd)/2
this.yStt=yMid-ySpan/2
this.yEnd=yMid+ySpan/2}}
Coords.prototype.getXScale=function(){return this.xScale}
Coords.prototype.getYScale=function(){return this.yScale}
Coords.prototype.toXPix=function(val){if(this.xLogQ){return this.left+(Math.log(val)-Math.log(this.xStt))/this.xLogScale}else{return this.left+(val-this.xStt)/this.xScale}}
Coords.prototype.toYPix=function(val){if(this.yLogQ){return this.top+(Math.log(this.yEnd)-Math.log(val))/this.yLogScale}else{return this.top+(this.yEnd-val)/this.yScale}}
Coords.prototype.toPtVal=function(pt,useCornerQ){return new Pt(this.toXVal(pt.x,useCornerQ),this.toYVal(pt.y,useCornerQ))}
Coords.prototype.toXVal=function(pix,useCornerQ){if(useCornerQ){return this.xStt+(pix-this.left)*this.xScale}else{return this.xStt+pix*this.xScale}}
Coords.prototype.toYVal=function(pix,useCornerQ){if(useCornerQ){return this.yEnd-(pix-this.top)*this.yScale}else{return this.yEnd-pix*this.yScale}}
Coords.prototype.getTicks=function(stt,span){let ticks=[]
let inter=this.tickInterval(span/5,false)
let tickStt=Math.ceil(stt/inter)*inter
let i=0
let tick
do{tick=i*inter
tick=Number(tick.toPrecision(5))
ticks.push([tickStt+tick,1])
i++}while(tick<span)
inter=this.tickInterval(span/4,true)
for(let i=0;i<ticks.length;i++){let t=ticks[i][0]
if(Math.abs(Math.round(t/inter)-t/inter)<0.001){ticks[i][1]=0}}
return ticks}
Coords.prototype.tickInterval=function(span,majorQ){let pow10=Math.pow(10,Math.floor(Math.log(span)*Math.LOG10E))
let mantissa=span/pow10
if(mantissa>=5){if(majorQ){return 5*pow10}else{return 2*pow10}}
if(mantissa>=2){if(majorQ){return 2*pow10}else{return 1*pow10}}
if(mantissa>=1){if(majorQ){return 1*pow10}else{return 0.2*pow10}}
if(majorQ){return 1*pow10}else{return 0.2*pow10}}
Coords.prototype.xTickInterval=function(tickDensity,majorQ){return this.tickInterval((this.xEnd-this.xStt)/tickDensity,majorQ)}
Coords.prototype.yTickInterval=function(tickDensity,majorQ){return this.tickInterval((this.yEnd-this.yStt)/tickDensity,majorQ)}
function Graph(g,coords){this.g=g
this.coords=coords
this.xLinesQ=true
this.yLinesQ=true
this.xValsQ=true
this.yValsQ=true
this.skewQ=false}
Graph.prototype.drawGraph=function(){this.hzAxisY=this.coords.toYPix(0)
if(this.hzAxisY<0)this.hzAxisY=0
if(this.hzAxisY>this.coords.height)this.hzAxisY=this.coords.height
this.hzNumsY=this.hzAxisY+14
if(this.hzAxisY>this.coords.height-10)this.hzNumsY=this.coords.height-3
this.vtAxisX=this.coords.toXPix(0)
if(this.vtAxisX<0)this.vtAxisX=0
if(this.vtAxisX>this.coords.width)this.vtAxisX=this.coords.width
this.vtNumsX=this.vtAxisX-5
if(this.vtAxisX<10)this.vtNumsX=20
if(this.coords.xLogQ){this.drawLinesLogX()}else{if(this.xLinesQ){this.drawHzLines()}}
if(this.coords.yLogQ){this.drawLinesLogY()}else{if(this.yLinesQ){this.drawVtLines()}}}
Graph.prototype.drawVtLines=function(){let g=this.g
g.lineWidth=1
let ticks=this.coords.getTicks(this.coords.xStt,this.coords.xEnd-this.coords.xStt)
for(let i=0;i<ticks.length;i++){let tick=ticks[i]
let xVal=tick[0]
let tickLevel=tick[1]
if(tickLevel==0){g.strokeStyle='rgba(0,0,256,0.2)'}else{g.strokeStyle='rgba(0,0,256,0.1)'}
let xPix=this.coords.toXPix(xVal,false)
g.beginPath()
g.moveTo(xPix,this.coords.toYPix(this.coords.yStt,false))
g.lineTo(xPix,this.coords.toYPix(this.coords.yEnd,false))
g.stroke()
if(my.coordsQ&&tickLevel==0&&this.xValsQ){g.fillStyle='#0000ff'
g.font='12px Verdana'
g.textAlign='center'
g.fillText(fmt(xVal),xPix,this.hzNumsY)}}
if(this.skewQ)return
if(my.coordsQ){g.lineWidth=1.5
g.strokeStyle='#ff0000'
g.beginPath()
g.moveTo(this.vtAxisX,this.coords.toYPix(this.coords.yStt,false))
g.lineTo(this.vtAxisX,this.coords.toYPix(this.coords.yEnd,false))
g.stroke()
g.beginPath()
g.fillStyle=g.strokeStyle
g.drawArrow(this.vtAxisX,this.coords.toYPix(this.coords.yEnd),15,2,20,10,Math.PI/2,10,false)
g.stroke()
g.fill()}}
Graph.prototype.drawHzLines=function(){let g=this.g
g.lineWidth=1
let ticks=this.coords.getTicks(this.coords.yStt,this.coords.yEnd-this.coords.yStt)
for(let i=0;i<ticks.length;i++){let tick=ticks[i]
let yVal=tick[0]
let tickLevel=tick[1]
if(tickLevel==0){g.strokeStyle='rgba(0,0,256,0.2)'}else{g.strokeStyle='rgba(0,0,256,0.1)'}
let yPix=this.coords.toYPix(yVal,false)
g.beginPath()
g.moveTo(this.coords.toXPix(this.coords.xStt,false),yPix)
g.lineTo(this.coords.toXPix(this.coords.xEnd,false),yPix)
g.stroke()
if(my.coordsQ&&tickLevel==0&&this.yValsQ){g.fillStyle='#ff0000'
g.font='12px Verdana'
g.textAlign='right'
g.fillText(fmt(yVal),this.vtNumsX,yPix+5)}}
if(this.skewQ)return
if(my.coordsQ){g.lineWidth=2
g.strokeStyle='#0000ff'
g.beginPath()
g.moveTo(this.coords.toXPix(this.coords.xStt,false),this.hzAxisY)
g.lineTo(this.coords.toXPix(this.coords.xEnd,false),this.hzAxisY)
g.stroke()
g.beginPath()
g.fillStyle=g.strokeStyle
g.drawArrow(this.coords.toXPix(this.coords.xEnd,false),this.hzAxisY,15,2,20,10,0,10,false)
g.stroke()
g.fill()}}
class Ln{constructor(pt1,pt2){this.a=new Pt(pt1.x,pt1.y)
this.b=new Pt(pt2.x,pt2.y)}
get lt(){return Math.min(this.a.x,this.b.x)}
get tp(){return Math.min(this.a.y,this.b.y)}
get rt(){return Math.max(this.a.x,this.b.x)}
get bt(){return Math.max(this.a.y,this.b.y)}
get wd(){return Math.abs(this.a.x-this.b.x)}
get ht(){return Math.abs(this.a.y-this.b.y)}
get dx(){return this.b.x-this.a.x}
get dy(){return this.b.y-this.a.y}
get len(){let dx=this.b.x-this.a.x
let dy=this.b.y-this.a.y
return Math.sqrt(dx*dx+dy*dy)}
setLen(newLen,fromMidQ=true){let len=this.len
if(fromMidQ){let midPt=this.getMidPt()
let halfPt=new Pt(this.a.x-midPt.x,this.a.y-midPt.y)
halfPt.multiplyMe(newLen/len)
this.a=midPt.translate(halfPt)
this.b=midPt.translate(halfPt,false)}else{let diffPt=new Pt(this.a.x-this.b.x,this.a.y-this.b.y)
diffPt.multiplyMe(newLen/len)
this.b=this.a.translate(diffPt,false)}}
draw(g){g.beginPath()
g.moveTo(this.a.x,this.a.y)
g.lineTo(this.b.x,this.b.y)
g.stroke()}
reflect(wall){let dbgQ=false
let g=my.can.g
let iPt=this.getIntersection(wall)
if(dbgQ)iPt.drawMe(g)
let nearPt=wall.getClosestPoint(this.a)
if(dbgQ)nearPt.drawMe(g)
if(dbgQ){let farPt=new Pt(iPt.x+(iPt.x-nearPt.x),iPt.y+(iPt.y-nearPt.y))
farPt.drawMe(g)}
let reflPt=new Pt(iPt.x+(iPt.x-nearPt.x)+(this.a.x-nearPt.x),iPt.y+(iPt.y-nearPt.y)+(this.a.y-nearPt.y))
if(dbgQ)reflPt.drawMe(g)
return new Ln(iPt,reflPt)}
normal(){let A=this.a
let B=this.b
console.log('normal',A,B)
let d=1
let C=new Ln(B,new Pt(B.x+(d*(A.y-B.y))/Math.sqrt(Math.pow(A.x-B.x,2)+Math.pow(A.y-B.y,2)),B.y-(d*(A.x-B.x))/Math.sqrt(Math.pow(A.x-B.x,2)+Math.pow(A.y-B.y,2))))
return C}
dot(v2){let v1=this
let a=0
a+=v1.x*v2.x
a+=v1.y*v2.y}
getMidPt(){return new Pt((this.a.x+this.b.x)/2,(this.a.y+this.b.y)/2)}
rotateMidMe(angle){let midPt=this.getMidPt()
this.a.translateMe(midPt,false)
this.b.translateMe(midPt,false)
this.a.rotateMe(angle)
this.b.rotateMe(angle)
this.a.translateMe(midPt)
this.b.translateMe(midPt)}
getClosestPoint(toPt,inSegmentQ){let AP=toPt.translate(this.a,false)
let AB=this.b.translate(this.a,false)
let ab2=AB.x*AB.x+AB.y*AB.y
let ap_ab=AP.x*AB.x+AP.y*AB.y
let t=ap_ab/ab2
if(inSegmentQ){t=constrain(0,t,1)}
return this.a.translate(AB.multiply(t))}
perp(){let dx=this.a.x-this.b.x
let dy=this.a.y-this.b.y
return new Pt(dy,-dx)}
rectIntersectQ(ln){let r1=this
let r2=ln
if(r2.lt>r1.lt+r1.wd)return false
if(r2.lt+r2.wd<r1.lt)return false
if(r2.tp>r1.tp+r1.ht)return false
if(r2.tp+r2.ht<r1.tp)return false
return true}
getIntersection(ln,asSegmentsQ=false){let aPt=this.a
let bPt=this.b
let ePt=ln.a
let fPt=ln.b
let a1=bPt.y-aPt.y
let b1=aPt.x-bPt.x
let c1=bPt.x*aPt.y-aPt.x*bPt.y
let a2=fPt.y-ePt.y
let b2=ePt.x-fPt.x
let c2=fPt.x*ePt.y-ePt.x*fPt.y
let denom=a1*b2-a2*b1
if(denom==0){return null}
let ip=new Pt()
ip.x=(b1*c2-b2*c1)/denom
ip.y=(a2*c1-a1*c2)/denom
if(asSegmentsQ){if(Math.pow(ip.x-bPt.x,2)+Math.pow(ip.y-bPt.y,2)>Math.pow(aPt.x-bPt.x,2)+Math.pow(aPt.y-bPt.y,2))return null
if(Math.pow(ip.x-aPt.x,2)+Math.pow(ip.y-aPt.y,2)>Math.pow(aPt.x-bPt.x,2)+Math.pow(aPt.y-bPt.y,2))return null
if(Math.pow(ip.x-fPt.x,2)+Math.pow(ip.y-fPt.y,2)>Math.pow(ePt.x-fPt.x,2)+Math.pow(ePt.y-fPt.y,2))return null
if(Math.pow(ip.x-ePt.x,2)+Math.pow(ip.y-ePt.y,2)>Math.pow(ePt.x-fPt.x,2)+Math.pow(ePt.y-fPt.y,2))return null}
return ip}
line_intersect(x1,y1,x2,y2,x3,y3,x4,y4){var ua,ub,denom=(y4-y3)*(x2-x1)-(x4-x3)*(y2-y1)
if(denom==0){return null}
ua=((x4-x3)*(y1-y3)-(y4-y3)*(x1-x3))/denom
ub=((x2-x1)*(y1-y3)-(y2-y1)*(x1-x3))/denom
return{x:x1+ua*(x2-x1),y:y1+ua*(y2-y1),seg1:ua>=0&&ua<=1,seg2:ub>=0&&ub<=1,}}
getAngle(){return Math.atan2(this.b.y-this.a.y,this.b.x-this.a.x)}
isPerp(vsLine,toler){if(true){let degDiff=this.getAngle()-vsLine.getAngle()
degDiff=Math.abs(degDiff)
if(degDiff>Math.PI)degDiff-=Math.PI
if(isNear(degDiff,Math.PI/2,toler)){return true}
return false}else{}}}
function fmt(num,digits){digits=14
if(num==Number.POSITIVE_INFINITY)return 'undefined'
if(num==Number.NEGATIVE_INFINITY)return 'undefined'
num=num.toPrecision(digits)
num=num.replace(/0+$/,'')
if(num.charAt(num.length-1)=='.')num=num.substr(0,num.length-1)
if(Math.abs(num)<1e-15)num=0
return num}
function isNear(checkVal,centralVal,limitVal){if(checkVal<centralVal-limitVal)return false
if(checkVal>centralVal+limitVal)return false
return true}
CanvasRenderingContext2D.prototype.drawArrow=function(x0,y0,totLen,shaftHt,headLen,headHt,angle,sweep,invertQ){let g=this
let pts=[[0,0],[-headLen,-headHt/2],[-headLen+sweep,-shaftHt/2],[-totLen,-shaftHt/2],[-totLen,shaftHt/2],[-headLen+sweep,shaftHt/2],[-headLen,headHt/2],[0,0],]
if(invertQ){pts.push([0,-headHt/2],[-totLen,-headHt/2],[-totLen,headHt/2],[0,headHt/2])}
for(let i=0;i<pts.length;i++){let cosa=Math.cos(-angle)
let sina=Math.sin(-angle)
let xPos=pts[i][0]*cosa+pts[i][1]*sina
let yPos=pts[i][0]*sina-pts[i][1]*cosa
if(i==0){g.moveTo(x0+xPos,y0+yPos)}else{g.lineTo(x0+xPos,y0+yPos)}}}
CanvasRenderingContext2D.prototype.drawBox=function(midX,midY,radius,angle){let g=this
g.beginPath()
let pts=[[0,0],[Math.cos(angle),Math.sin(angle)],[Math.cos(angle)+Math.cos(angle+Math.PI/2),Math.sin(angle)+Math.sin(angle+Math.PI/2)],[Math.cos(angle+Math.PI/2),Math.sin(angle+Math.PI/2)],[0,0],]
for(let i=0;i<pts.length;i++){if(i==0){g.moveTo(midX+radius*pts[i][0],midY+radius*pts[i][1])}else{g.lineTo(midX+radius*pts[i][0],midY+radius*pts[i][1])}}
g.stroke()}
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
my.theme=localStorage.getItem('theme')
my.lineClr=my.theme=='dark'?'white':'black'
window.addEventListener('storage',themeChg)
themeChg()
function themeChg(){my.theme=localStorage.getItem('theme')
console.log('themeChg to',my.theme)
if(my.theme=='dark'){my.noClr='black'
my.yesClr='#036'}else{my.noClr='#f8f8f8'
my.yesClr='#dfd'}}
class Pop{constructor(id,btns=[{txt:'&#x2714;',fn:null},{txt:'&#x2718;',fn:null}]){this.id=id
this.btns=btns
this.div=document.getElementById(this.id)
this.div.classList.add('pop')
this.div.style='position:absolute; left:-450px; top:10px; width:auto; transition: all linear 0.3s; opacity:0; text-align: center; '
this.bodyDiv=document.createElement('div')
this.div.appendChild(this.bodyDiv)
for(let i=0;i<btns.length;i++){let btn=btns[i]
let btnDiv=document.createElement('button')
this.div.appendChild(btnDiv)
btnDiv.classList.add('btn')
btnDiv.innerHTML=btn.txt
btnDiv.onclick=this.btnClick.bind(this,i)}
return this}
open(){let div=this.div
div.style.transitionDuration='0.3s'
div.style.opacity=1
div.style.zIndex=12
div.style.left=(window.innerWidth-300)/2+'px'}
close(){this.div.style.opacity=0
this.div.style.zIndex=1
this.div.style.left='-999px'
my.pauseQ=false}
btnClick(n){let btn=this.btns[n]
console.log('btnClick',n,this.btns,btn)
this.close()
if(typeof btn.fn==='function')btn.fn()}
htmlSet(s){this.bodyDiv.innerHTML=s
return s}}
function docInsert(s){let div=document.createElement('div')
div.innerHTML=s
let script=document.currentScript
script.parentElement.insertBefore(div,script)}
class Can{constructor(id,wd,ht,ratio){this.ratio=ratio
this.el=typeof id=='string'?document.getElementById(id):id
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
let x=(ev.clientX-bRect.left)*(this.el.width/this.ratio/bRect.width)
let y=(ev.clientY-bRect.top)*(this.el.height/this.ratio/bRect.height)
return{x:x,y:y}}}
function wrap({id='',cls='',pos='rel',style='',txt='',tag='div',lbl='',fn='',opts=[]},...mores){let s=''
s+='\n'
txt+=mores.join('')
let tags={btn:{stt:'<button '+(fn.length>0?' onclick="'+fn+'" ':''),cls:'btn',fin:'>'+txt+'</button>'},can:{stt:'<canvas ',cls:'',fin:'></canvas>'},div:{stt:'<div '+(fn.length>0?' onclick="'+fn+'" ':''),cls:'',fin:' >'+txt+'</div>'},edit:{stt:'<textarea onkeyup="'+fn+'" onchange="'+fn+'"',cls:'',fin:' >'+txt+'</textarea>'},inp:{stt:'<input value="'+txt+'"'+(fn.length>0?'  oninput="'+fn+'" onchange="'+fn+'"':''),cls:'input',fin:'>'+(lbl.length>0?'</label>':'')},out:{stt:'<span ',cls:'output',fin:' >'+txt+'</span>'+(lbl.length>0?'</label>':'')},radio:{stt:'<div ',cls:'radio',fin:'>\n'},sel:{stt:'<select '+(fn.length>0?' onchange="'+fn+'"':''),cls:'select',fin:'>\n'},sld:{stt:'<input type="range" '+txt+' oninput="'+fn+'" onchange="'+fn+'"',fin:(lbl.length>0?'</label>':'<span id="'+id+'0">0</span>')},}
let type=tags[tag]
if(lbl.length>0)s+='<label class="label">'+lbl+' '
s+=type.stt
if(cls.length==0)cls=type.cls
if(tag=='div')style+=fn.length>0?' cursor:pointer;':''
if(id.length>0)s+=' id="'+id+'"'
if(cls.length>0)s+=' class="'+cls+'"'
if(pos=='dib')s+=' style="position:relative; display:inline-block;'+style+'"'
if(pos=='rel')s+=' style="position:relative; '+style+'"'
if(pos=='abs')s+=' style="position:absolute; '+style+'"'
s+=type.fin
if(tag=='radio'){for(let i=0;i<opts.length;i++){let chk=''
if(i==0)chk='checked'
let idi=id+i
let lbl=opts[i]
s+='<input id="'+idi+'" type="radio" name="'+id+'" value="'+lbl.name+'" onclick="'+fn+'('+i+');" '+chk+' >'
s+='<label for="'+idi+'">'+lbl.name+' </label>'}
s+='</div>'}
if(tag=='sel'){for(let i=0;i<opts.length;i++){let opt=opts[i]
let idStr=id+i
let chkStr=opt.descr==txt?' selected ':''
s+='<option id="'+idStr+'" value="'+opt.name+'"'+chkStr+'>'+opt.descr+'</option>\n'}
s+='</select>'
if(lbl.length>0)s+='</label>'}
s+='\n'
return s.trim()}
init()