let s,i,my={}
function init(imode){my.version='0.891'
my.mode=typeof imode!=='undefined'?imode:'equn'
my.modes=[]
my.modes['equn']={extendQ:true,slopeQ:false}
my.modes['slope']={extendQ:true,slopeQ:true}
my.modes['intery']={extendQ:true,slopeQ:false}
my.modes['pt']={extendQ:true,slopeQ:false}
my.modes['mid']={extendQ:false,slopeQ:false}
canvasid='canvas4'
titleid='title4'
infoid='info4'
dragging=false
w=540
h=360
let s=''
s+='<style>'
s+='.togglebtn { display: inline-block; position: relative; text-align: center; margin: 2px; text-decoration: none;  font: bold 14px/25px Arial, sans-serif; color: #19667d; border: 1px solid #88aaff; border-radius: 10px; cursor: pointer; background: linear-gradient(to top right, rgba(170,190,255,1) 0%, rgba(255,255,255,1) 100%); }'
s+='.togglebtn:hover { background: linear-gradient(to top, rgba(255,255,0,1) 0%, rgba(255,255,255,1) 100%); }'
s+='.hi { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(130,220,255,1) 0%, rgba(255,255,255,1) 100%);  }'
s+='.lo { border: solid 1px #888888; background: linear-gradient(to top, rgba(170,170,170,1) 0%, rgba(205,205,205,1) 100%);  }'
s+='</style>'
s+='<div style="position:relative; width:'+w+'px; height:'+h+'px; border: none; border-radius: 9px; margin:auto; display:block; box-shadow: 0px 0px 19px 10px rgba(0,0,68,0.46); ">'
s+='<canvas id="'+canvasid+'" width="'+w+'" height="'+h+'" style="z-index:10;"></canvas>'
s+='<div id="descr" style="position:absolute; left:0px; top:10px; width:'+w+'px; font: bold 30px Arial; text-align: center;"></div>'
s+='<div id="btns2" style="position:absolute; right:3px; bottom:5px;">'
if(my.mode=='pt'){my.slope=0.5
s+='<span style="font: bold 20px arial;">Slope:</span>'
s+='<input type="range" id="r1" value="'+my.slope+'" min="-4" max="4" step="0.1"  style="z-index:2; width:200px; height:10px; border: none; "  autocomplete="off" oninput="onSlopeChg(0,this.value)" onchange="onSlopeChg(1,this.value)" />'
s+='<div id="slope" style="display: inline-block; width:50px; font: bold 20px Arial; color: #6600cc; text-align: left;">'+my.slope+'</div>'}
s+='<button id="coordsBtn" onclick="toggleCoords()" style="z-index:2;" class="togglebtn hi" >Coords</button>'
s+='<button id="resetBtn" onclick="reset()" style="z-index:2;" class="togglebtn" >Reset</button>'
s+='</div>'
s+='<div id="copyrt" style="position: absolute; right:0px; top:40px; font: 10px Arial; color: #6600cc; transform: rotate(-90deg); transform-origin: right bottom 0;">&copy; 2018 MathsIsFun.com  v'+my.version+'</div>'
s+='</div>'
docInsert(s)
el=document.getElementById(canvasid)
ratio=2
el.width=w*ratio
el.height=h*ratio
el.style.width=w+'px'
el.style.height=h+'px'
g=el.getContext('2d')
g.setTransform(ratio,0,0,ratio,0,0)
this.coords=new Coords(0,0,w,h,-2,-1.9,15,11,true)
this.graph=new Graph(g,coords)
this.coordsQ=true
shapes=[]
makeShapes()
drawPts()
el.addEventListener('mousedown',mouseDownListener,false)
el.addEventListener('touchstart',ontouchstart,false)
el.addEventListener('mousemove',domousemove,false)
doType()}
function onSlopeChg(n,v){v=Number(v)
my.slope=v
document.getElementById('slope').innerHTML=v
update()}
function reset(){makeShapes()
update()}
function update(){doType()}
function toggleCoords(){this.coordsQ=!this.coordsQ
toggleBtn('coordsBtn',this.coordsQ)
update()}
function toggleBtn(btn,onq){if(onq){document.getElementById(btn).classList.add('hi')
document.getElementById(btn).classList.remove('lo')}else{document.getElementById(btn).classList.add('lo')
document.getElementById(btn).classList.remove('hi')}}
function ontouchstart(evt){let touch=evt.targetTouches[0]
evt.clientX=touch.clientX
evt.clientY=touch.clientY
evt.touchQ=true
mouseDownListener(evt)}
function ontouchmove(evt){let touch=evt.targetTouches[0]
evt.clientX=touch.clientX
evt.clientY=touch.clientY
evt.touchQ=true
mouseMoveListener(evt)
evt.preventDefault()}
function ontouchend(evt){el.addEventListener('touchstart',ontouchstart,false)
window.removeEventListener('touchend',ontouchend,false)
if(dragging){dragging=false
window.removeEventListener('touchmove',ontouchmove,false)}}
function domousemove(e){document.body.style.cursor='default'
let bRect=el.getBoundingClientRect()
let mouseX=(e.clientX-bRect.left)*(el.width/ratio/bRect.width)
let mouseY=(e.clientY-bRect.top)*(el.height/ratio/bRect.height)
for(let i=0;i<shapes.length;i++){if(hitTest(shapes[i],mouseX,mouseY)){dragNo=i
document.body.style.cursor='pointer'}}}
function mouseDownListener(evt){let i
let highestIndex=-1
let bRect=el.getBoundingClientRect()
let mouseX=(evt.clientX-bRect.left)*(el.width/ratio/bRect.width)
let mouseY=(evt.clientY-bRect.top)*(el.height/ratio/bRect.height)
for(i=0;i<shapes.length;i++){if(hitTest(shapes[i],mouseX,mouseY)){dragNo=i
dragging=true
if(i>highestIndex){dragHoldX=mouseX-shapes[i].x
dragHoldY=mouseY-shapes[i].y
highestIndex=i
dragIndex=i}}}
if(dragging){if(evt.touchQ){window.addEventListener('touchmove',ontouchmove,false)}else{window.addEventListener('mousemove',mouseMoveListener,false)}
doType()}
if(evt.touchQ){el.removeEventListener('touchstart',ontouchstart,false)
window.addEventListener('touchend',ontouchend,false)}else{el.removeEventListener('mousedown',mouseDownListener,false)
window.addEventListener('mouseup',mouseUpListener,false)}
if(evt.preventDefault){evt.preventDefault()}
else if(evt.returnValue){evt.returnValue=false}
return false}
function mouseUpListener(evt){el.addEventListener('mousedown',mouseDownListener,false)
window.removeEventListener('mouseup',mouseUpListener,false)
if(dragging){dragging=false
window.removeEventListener('mousemove',mouseMoveListener,false)}}
function mouseMoveListener(evt){let posX
let posY
let shapeRad=shapes[dragIndex].rad
let minX=shapeRad
let maxX=el.width-shapeRad
let minY=shapeRad
let maxY=el.height-shapeRad
let bRect=el.getBoundingClientRect()
let mouseX=(evt.clientX-bRect.left)*(el.width/ratio/bRect.width)
let mouseY=(evt.clientY-bRect.top)*(el.height/ratio/bRect.height)
posX=mouseX-dragHoldX
posX=posX<minX?minX:posX>maxX?maxX:posX
posY=mouseY-dragHoldY
posY=posY<minY?minY:posY>maxY?maxY:posY
shapes[dragIndex].x=posX
shapes[dragIndex].y=posY
doType()}
function hitTest(shape,mx,my){let dx
let dy
dx=mx-shape.x
dy=my-shape.y
return dx*dx+dy*dy<shape.rad*shape.rad}
function doType(){g.clearRect(0,0,el.width,el.height)
this.graph.drawGraph()
drawPts()}
function makeShapes(){let xys=[]
if(my.mode=='pt'){xys=[[312,140]]}else{xys=[[145,223],[312,140],]}
shapes=[]
for(let i=0;i<xys.length;i++){let xy=xys[i]
shapes.push(new Pt(xy[0],xy[1]))}}
function drawPts(){let i
g.strokeStyle='rgba(0, 0, 150, 0.8)'
g.fillStyle='rgba(255, 255, 100, 0.1)'
g.lineWidth=2
g.beginPath()
if(my.mode=='slope'){g.strokeStyle='blue'
g.beginPath()
g.moveTo(shapes[0].x,shapes[0].y)
g.lineTo(shapes[1].x,shapes[0].y)
g.stroke()
g.strokeStyle='red'
g.beginPath()
g.moveTo(shapes[1].x,shapes[0].y)
g.lineTo(shapes[1].x,shapes[1].y)
g.stroke()
g.beginPath()}
let ln
if(my.mode=='pt'){let shape1=new Pt(shapes[0].x+100,shapes[0].y-100*my.slope)
ln=new Line(shapes[0],shape1)}else{ln=new Line(shapes[0],shapes[1])}
if(my.mode=='mid'){let midPt=new Pt((shapes[0].x+shapes[1].x)/2,(shapes[0].y+shapes[1].y)/2)
let lbl='M'
if(this.coordsQ){let xLbl=round2((round1(this.coords.toXVal(shapes[0].x))+round1(this.coords.toXVal(shapes[1].x)))/2)
let yLbl=round2((round1(this.coords.toYVal(shapes[0].y))+round1(this.coords.toYVal(shapes[1].y)))/2)
lbl+=' = ('+xLbl+','+yLbl+')'}
ptDraw(midPt,true,lbl,'hsla(0,0%,30%,0.4)')}else{ln.setLen(1500,true)}
g.strokeStyle='rgba(0, 150, 0, 0.8)'
g.moveTo(ln.a.x,ln.a.y)
g.lineTo(ln.b.x,ln.b.y)
g.stroke()
let pt0,pt1,slope,b
if(my.mode=='pt'){let x1=round1(this.coords.toXVal(shapes[0].x))
let y1=round1(this.coords.toYVal(shapes[0].y))
let xstr
if(x1<0){xstr='(x + '+-x1+')'}else{if(x1>0){xstr='(x &minus; '+x1+')'}else{xstr='x'}}
let ystr
if(y1<0){ystr=' + '+-y1}else{if(y1>0){ystr=' &minus; '+y1}else{ystr=''}}
if(my.slope==1){let simplifyQ=false
if(simplifyQ){let diff=round2(y1-x1)
if(diff<0){s='y = x &minus; '+-diff}else{if(diff>0){s='y = x + '+diff}else{s='y = x'}}}else{s='y '+ystr+' = '+my.slope+xstr}}else{if(my.slope==0){s='y = '+y1}else{s='y '+ystr+' = '+my.slope+xstr}}
document.getElementById('descr').innerHTML=s}else{pt0=new Pt(round1(this.coords.toXVal(shapes[0].x)),round1(this.coords.toYVal(shapes[0].y)))
pt1=new Pt(round1(this.coords.toXVal(shapes[1].x)),round1(this.coords.toYVal(shapes[1].y)))
let dx=pt1.x-pt0.x
let dy=pt1.y-pt0.y
slope=dy/dx
b=pt0.y-pt0.x*slope}
if(my.mode=='equn'){let s=''
if(pt0.x==pt1.x){if(pt0.y==pt1.y){s='Need 2 different points'}else{s='x = '+pt0.x}}else{s='y = '+linearPhrase([round2(slope),round2(b)])}
document.getElementById('descr').innerHTML=s}
if(my.mode=='slope'){let s=''
if(pt0.x==pt1.x){if(pt0.y==pt1.y){s='Need 2 different points'}else{s='?'}}else{s='slope = '+'<span class="intbl"><em style="color:red;">'+round2(dy)+'</em><strong style="color:blue;">'+round2(dx)+'</strong></span> = '+round2(slope)
g.fillStyle='blue'
g.fillStyle='blue'
g.textAlign='center'
g.fillText(round2(dx).toString(),(shapes[0].x+shapes[1].x)/2,shapes[0].y+20)
g.fillStyle='red'
g.textAlign='left'
g.fillText(round2(dy),shapes[1].x+5,(shapes[0].y+shapes[1].y)/2)}
document.getElementById('descr').innerHTML=s}
if(my.mode=='intery'){let s=''
if(pt0.x==pt1.x){if(pt0.y==pt1.y){s='Need 2 different points'}else{s='?'}}else{if(b>this.coords.yStt&&b<this.coords.yEnd){s='y-intercept = (0,'+round2(b)+')'
let slope1=(shapes[1].y-shapes[0].y)/(shapes[1].x-shapes[0].x)
let b1=shapes[0].y-(shapes[0].x-this.coords.toXPix(0))*slope1
let ptb=new Pt(this.coords.toXPix(0),b1)
g.fillStyle='blue'
g.beginPath()
g.arc(ptb.x,ptb.y,3,0,2*Math.PI,false)
g.fill()
g.strokeStyle='blue'
g.beginPath()
g.moveTo(ptb.x+10,ptb.y)
g.lineTo(ptb.x+45,ptb.y)
g.drawArrow(ptb.x+10,ptb.y,15,2,20,10,Math.PI,10,false)
g.stroke()
g.textAlign='left'
g.fillText('(0,'+round2(b).toString()+')',ptb.x+50,ptb.y+10)}}
document.getElementById('descr').innerHTML=s}
for(i=0;i<shapes.length;i++){ptDraw(shapes[i],!this.coordsQ,String.fromCharCode(65+i),'rgba(0, 0, 255, 0.4)')}}
function ptDraw(pt,lblQ,lbl,clr){g.fillStyle=clr
g.beginPath()
g.arc(pt.x,pt.y,10,0,2*Math.PI,false)
g.closePath()
g.fill()
g.fillStyle='orange'
g.beginPath()
g.arc(pt.x,pt.y,2,0,2*Math.PI,false)
g.closePath()
g.fill()
g.textAlign='left'
if(lblQ){g.font='14px Arial'
g.fillText(lbl,pt.x+5,pt.y-9)}else{g.font='bold 14px Arial'
let txt='('
txt+=round1(this.coords.toXVal(pt.x))
txt+=','
txt+=round1(this.coords.toYVal(pt.y))
txt+=')'
g.fillText(txt,pt.x+14,pt.y+3)}}
function round1(v){return Math.round(v*10)/10}
function round2(v){return Math.round(v*100)/100}
function linearPhrase(a){let s=''
for(let k=0;k<a.length;k++){let v=a[k]
if(v!=0){if(v<0){if(s.length>0){s+=' &minus; '}else{s+=' &minus;'}
v=-v}else{if(s.length>0){s+=' + '}}
switch(k){case 0:if(v!=1){s+=v}
s+='x'
break
case 1:s+=v
break
default:if(v!=1){s+=v}
s+='('+k+')'
break}}}
if(s.length==0){s='0'}
return s}
function Pt(ix,iy){this.x=ix
this.y=iy
this.rad=9
this.color='rgb('+0+','+0+','+255+')'
angleIn=0
angleOut=0}
Pt.prototype.setxy=function(ix,iy){this.x=ix
this.y=iy}
Pt.prototype.getAngle=function(){return this.angleOut-this.angleIn}
Pt.prototype.drawMe=function(g){g.fillStyle='rgba(0, 0, 255, 0.3)'
g.beginPath()
g.arc(this.x,this.y,20,0,2*Math.PI,false)
g.closePath()
g.fill()}
Pt.prototype.getAvg=function(pts){let xSum=0
let ySum=0
for(let i=0;i<pts.length;i++){xSum+=pts[i].x
ySum+=pts[i].y}
let newPt=new Pt(xSum/pts.length,ySum/pts.length)
newPt.x=xSum/pts.length
newPt.y=ySum/pts.length
return newPt}
Pt.prototype.setAvg=function(pts){this.setPrevPt()
let newPt=this.getAvg(pts)
this.x=newPt.x
this.y=newPt.y
validPtQ=true}
Pt.prototype.interpolate=function(pt1,pt2,f){this.setPrevPt()
this.x=pt1.x*f+pt2.x*(1-f)
this.y=pt1.y*f+pt2.y*(1-f)
validPtQ=true}
Pt.prototype.translate=function(pt,addQ){addQ=typeof addQ!=='undefined'?addQ:true
t=new Pt(this.x,this.y)
t.x=this.x
t.y=this.y
if(addQ){t.x+=pt.x
t.y+=pt.y}else{t.x-=pt.x
t.y-=pt.y}
return t}
Pt.prototype.multiply=function(fact){return new Pt(this.x*fact,this.y*fact)}
Pt.prototype.multiplyMe=function(fact){this.x*=fact
this.y*=fact}
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
let xLogQ=false
let yLogQ=false
let skewQ=true
this.xScale
let xLogScale
this.yScale
console.log('Coords: ',this.xStt,this.yStt,this.xEnd,this.yEnd)
this.calcScale()}
Coords.prototype.calcScale=function(){console.log('calcScale: ',this.xStt,this.yStt,this.xEnd,this.yEnd)
if(this.xLogQ){if(this.xStt<=0)this.xStt=1
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
Coords.prototype.toXPix=function(val){if(this.xLogQ){return this.left+(Math.log(val)-Math.log(xStt))/xLogScale}else{return this.left+(val-this.xStt)/this.xScale}}
Coords.prototype.toYPix=function(val){if(this.yLogQ){return this.top+(Math.log(yEnd)-Math.log(val))/yLogScale}else{return this.top+(this.yEnd-val)/this.yScale}}
Coords.prototype.toPtVal=function(pt,useCornerQ){return new Pt(toXVal(pt.x,useCornerQ),toYVal(pt.y,useCornerQ))}
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
for(i=0;i<ticks.length;i++){let t=ticks[i][0]
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
let xClr=0x4444ff
let yClr=0xff4444
this.xLinesQ=true
this.yLinesQ=true
this.xArrowQ=true
this.yArrowQ=true
this.xValsQ=true
this.yValsQ=true
this.skewQ=false}
Graph.prototype.drawGraph=function(){if(coords.xLogQ){this.drawLinesLogX()}else{if(this.xLinesQ){this.drawLinesX()}}
if(coords.yLogQ){this.drawLinesLogY()}else{if(this.yLinesQ){this.drawLinesY()}}}
Graph.prototype.drawLinesX=function(){let xAxisPos=coords.toYPix(0)
let yAxisPos=coords.toXPix(0)
let numAtAxisQ=yAxisPos>=0&&yAxisPos<coords.width
let g=this.g
g.lineWidth=1
let ticks=coords.getTicks(coords.xStt,coords.xEnd-coords.xStt)
for(let i=0;i<ticks.length;i++){let tick=ticks[i]
let xVal=tick[0]
let tickLevel=tick[1]
if(tickLevel==0){g.strokeStyle='rgba(0,0,256,0.3)'}else{g.strokeStyle='rgba(0,0,256,0.1)'}
let xPix=coords.toXPix(xVal,false)
g.beginPath()
g.moveTo(xPix,coords.toYPix(coords.yStt,false))
g.lineTo(xPix,coords.toYPix(coords.yEnd,false))
g.stroke()
if(tickLevel==0&&this.xValsQ){g.fillStyle='#0000ff'
g.font='12px Verdana'
g.textAlign='center'
let lbly=0
if(numAtAxisQ&&xAxisPos>0&&xAxisPos<coords.height){lbly=xAxisPos+15}else{lbly=coords.height-20}
g.fillText(fmt(xVal),xPix,xAxisPos+15)}}
if(this.skewQ)return
if(yAxisPos>=0&&yAxisPos<coords.width){g.lineWidth=2
g.strokeStyle='rgba(256,0,0,0.4)'
g.beginPath()
g.moveTo(yAxisPos,coords.toYPix(coords.yStt,false))
g.lineTo(yAxisPos,coords.toYPix(coords.yEnd,false))
g.stroke()
g.beginPath()
g.fillStyle=g.strokeStyle
g.drawArrow(yAxisPos,coords.toYPix(coords.yEnd),15,2,20,10,Math.PI/2,10,false)
g.stroke()
g.fill()
g.font='bold 24px Arial'
g.fillText('y',yAxisPos+12,coords.toYPix(coords.yEnd)+15)}}
Graph.prototype.drawLinesY=function(){let xAxisPos=coords.toYPix(0)
let yAxisPos=coords.toXPix(0)
let numAtAxisQ=xAxisPos>=0&&xAxisPos<coords.height
let g=this.g
g.lineWidth=1
let ticks=coords.getTicks(coords.yStt,coords.yEnd-coords.yStt)
for(let i=0;i<ticks.length;i++){let tick=ticks[i]
let yVal=tick[0]
let tickLevel=tick[1]
if(tickLevel==0){g.strokeStyle='rgba(0,0,256,0.3)'}else{g.strokeStyle='rgba(0,0,256,0.1)'}
let yPix=coords.toYPix(yVal,false)
g.beginPath()
g.moveTo(coords.toXPix(coords.xStt,false),yPix)
g.lineTo(coords.toXPix(coords.xEnd,false),yPix)
g.stroke()
if(tickLevel==0&&this.yValsQ){g.fillStyle='#ff0000'
g.font='12px Verdana'
g.textAlign='right'
g.fillText(fmt(yVal),yAxisPos-5,yPix+5)}}
if(this.skewQ)return
if(xAxisPos>=0&&xAxisPos<coords.height){g.lineWidth=2
g.strokeStyle='rgba(0,0,256,0.4)'
g.beginPath()
g.moveTo(coords.toXPix(coords.xStt,false),xAxisPos)
g.lineTo(coords.toXPix(coords.xEnd,false),xAxisPos)
g.stroke()
g.beginPath()
g.fillStyle=g.strokeStyle
g.drawArrow(coords.toXPix(coords.xEnd,false),xAxisPos,15,2,20,10,0,10,false)
g.stroke()
g.fill()
g.font='bold 24px Arial'
g.fillText('x',coords.toXPix(coords.xEnd,false)-5,xAxisPos-7)}}
function Line(pt1,pt2){this.a=pt1
this.b=pt2}
Line.prototype.getLength=function(){let dx=this.b.x-this.a.x
let dy=this.b.y-this.a.y
return Math.sqrt(dx*dx+dy*dy)}
Line.prototype.setLen=function(newLen,fromMidQ){let len=this.getLength()
if(fromMidQ){let midPt=this.getMidPt()
let halfPt=new Pt(this.a.x-midPt.x,this.a.y-midPt.y)
halfPt.multiplyMe(newLen/len)
this.a=midPt.translate(halfPt)
this.b=midPt.translate(halfPt,false)}else{let diffPt=new Pt(this.a.x-this.b.x,this.a.y-this.b.y)
diffPt.multiplyMe(newLen/len)
this.b=this.a.translate(diffPt,false)}}
Line.prototype.getMidPt=function(){return new Pt((this.a.x+this.b.x)/2,(this.a.y+this.b.y)/2)}
CanvasRenderingContext2D.prototype.drawArrow=function(x0,y0,totLen,shaftHt,headLen,headHt,angle,sweep,invertQ){let g=this
let pts=[[0,0],[-headLen,-headHt/2],[-headLen+sweep,-shaftHt/2],[-totLen,-shaftHt/2],[-totLen,shaftHt/2],[-headLen+sweep,shaftHt/2],[-headLen,headHt/2],[0,0],]
if(invertQ){pts.push([0,-headHt/2],[-totLen,-headHt/2],[-totLen,headHt/2],[0,headHt/2])}
for(let i=0;i<pts.length;i++){let cosa=Math.cos(-angle)
let sina=Math.sin(-angle)
let xPos=pts[i][0]*cosa+pts[i][1]*sina
let yPos=pts[i][0]*sina-pts[i][1]*cosa
if(i==0){g.moveTo(x0+xPos,y0+yPos)}else{g.lineTo(x0+xPos,y0+yPos)}}}
function fmt(num,digits){digits=14
if(num==Number.POSITIVE_INFINITY)return 'undefined'
if(num==Number.NEGATIVE_INFINITY)return 'undefined'
num=num.toPrecision(digits)
num=num.replace(/0+$/,'')
if(num.charAt(num.length-1)=='.')num=num.substr(0,num.length-1)
if(Math.abs(num)<1e-15)num=0
return num}
function docInsert(s){let div=document.createElement('div')
div.innerHTML=s
let script=document.currentScript
console.log('docInsert',script.parentElement)
script.parentElement.insertBefore(div,script)}
function wrap({id='',cls='',pos='rel',style='',txt='',tag='div',lbl='',fn='',opts=[]},...mores){let s=''
s+='\n'
txt+=mores.join('')
let noProp='event.stopPropagation(); '
let tags={btn:{stt:'<button '+(fn.length>0?' onclick="'+noProp+fn+'" ':''),cls:'btn',fin:'>'+txt+'</button>'},can:{stt:'<canvas ',cls:'',fin:'></canvas>'},div:{stt:'<div '+(fn.length>0?' onclick="'+fn+'" ':''),cls:'',fin:' >'+txt+'</div>'},edit:{stt:'<textarea onkeyup="'+fn+'" onchange="'+fn+'"',cls:'',fin:' >'+txt+'</textarea>'},inp:{stt:'<input value="'+txt+'"'+(fn.length>0?'  oninput="'+fn+'" onchange="'+fn+'"':''),cls:'input',fin:'>'+(lbl.length>0?'</label>':'')},out:{stt:'<span ',cls:'output',fin:' >'+txt+'</span>'+(lbl.length>0?'</label>':'')},radio:{stt:'<div ',cls:'radio',fin:'>\n'},sel:{stt:'<select '+(fn.length>0?' onchange="'+fn+'"':''),cls:'select',fin:'>\n'},sld:{stt:'<input type="range" '+txt+' oninput="'+noProp+fn+'" onchange="'+noProp+fn+'"',cls:'select',fin:'>'+(lbl.length>0?'</label>':'')+'<span id="'+id+'0">0</span>'},}
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