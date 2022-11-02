let my={}
function init(){let version='0.83'
my.wd=700
console.log('my.wd',my.wd)
let s=''
s+='<div style="position:relative; margin:auto;  text-align:center;">'
s+='<div id="digiDiv" style="display:inline-block;text-align:center; vertical-align:top;padding-bottom: 20px; background-color:#333; z-index:2; border-radius:10px; ">'
s+='<canvas id="clock2" style=""></canvas>'
s+='<div id="dayText" style="color:white;"></div>'
s+='</div>'
s+='<div  id="anaDiv" style="position: relative; display:inline-block; z-index:3; margin-left:-60px;  ">'
s+='<canvas id="clock1"></canvas>'
s+='<div style="position: absolute; right:2px; bottom:3px;">'
s+=wrap({id:'amBtn',tag:'btn',fn:'toggleAm()'},'AM/PM')
s+=wrap({id:'secBtn',tag:'btn',fn:'toggleSec()'},'Sec')
s+='</div>'
s+='</div>'
s+=wrap({cls:'copyrt'},`&copy; 2022 Rod Pierce  v${version}`)
s+='</div>'
docInsert(s)
let ana=new Clock(my.wd*0.5,'clock1')
ana.loop()
this.digi=new DigiClock(my.wd*0.5,'24','clock2')
this.digi.loop()
let day=new Day('dayText')
day.loop()
my.amQ=true
toggleAm()
my.secQ=true
toggleSec()}
function toggleAm(){my.amQ=!my.amQ
btn('amBtn',my.amQ)
this.digi.mode=my.amQ?'am':'24'}
function toggleSec(){my.secQ=!my.secQ
btn('secBtn',my.secQ)
this.digi.secQ=my.secQ}
function btn(btn,onq){if(onq){document.getElementById(btn).classList.add('hi')
document.getElementById(btn).classList.remove('lo')}else{document.getElementById(btn).classList.add('lo')
document.getElementById(btn).classList.remove('hi')}}
let Day=function(divName){this.div=document.getElementById(divName)
this.months=['January','February','March','April','May','June','July','August','September','October','November','December']
this.days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
this.dayFulls=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
this.strLast=''
this.tmLast=performance.now()
this.update()}
Day.prototype.loop=function(){let tm=performance.now()
if(tm>this.tmLast+1000){this.tmLast=performance.now()
this.update()}
requestAnimationFrame(this.loop.bind(this))}
Day.prototype.update=function(){this.dt=new Date()
let s=''
s+='<span style="font:'+((my.wd*0.05)<<0)+'px Arial;">'
s+=this.dayFulls[this.dt.getDay()]+'<br>'
s+='<b style="font-size:160%;">'+this.dt.getDate()+'</b>'+'<br>'
s+=this.months[this.dt.getMonth()]+'<br>'
s+=this.dt.getFullYear()
s+='</span>'
if(s!=this.strLast){console.log('s',s)
this.div.innerHTML=s
this.strLast=s}}
class Clock{constructor(diam,canName){this.radius=diam*0.41
this.ratio=2
this.can=new Can(canName,diam,diam,this.ratio)
this.g=this.can.g
this.center={x:(this.can.el.width*0.5)/this.ratio,y:(this.can.el.height*0.5)/this.ratio,}
this.secondOpt={color:'#060',thickRatio:0.011,forwardRadiusRatio:0.75,backwardRadiusRatio:0.2,tipRadiusRatio:0.075,}
this.minuteOpt={color:'#f00',thickRatio:0.03,forwardRadiusRatio:0.75,backwardRadiusRatio:0.2,}
this.hourOpt={color:'#00f',thickRatio:0.04,forwardRadiusRatio:0.6,backwardRadiusRatio:0.2,}
this.faceOpt={color:'#000',numDistRatio:0.28,numSizeRatio:0.28,edgeDistRatio:0.12,thickRatio:0.005,lengthRatio:0.04,keyMarkers:5,keyMarkerThicknessRatio:0.175,keyMarkerLengthRatio:0.01,}
this.redrawEvery=0
this.update()}
loop(){this.redrawEvery++
if(this.redrawEvery>2){this.redrawEvery=0
this.update()}
requestAnimationFrame(this.loop.bind(this))}
update(){this.can.clear()
this.dt=new Date()
this.drawFace()
this.drawMarkers()
this.drawHourHand()
this.drawMinuteHand()
this.drawSecondHand()
this.drawPin()}
drawFace(){let g=this.g
let faceGradient=g.createRadialGradient(this.center.x,this.center.y,0,this.center.x,this.center.y,this.radius)
faceGradient.addColorStop(0,'rgba(255, 231, 180, 0)')
faceGradient.addColorStop(1,'rgba(182, 157, 100, 0.3)')
g.fillStyle=faceGradient
g.beginPath()
g.arc(this.center.x,this.center.y,this.radius,0,2*Math.PI)
g.fillStyle='#fff'
g.fill()
g.fillStyle=faceGradient
g.fill()
let edgeGradient=this.g.createLinearGradient(0,this.center.y-this.radius,0,this.center.y+this.radius)
edgeGradient.addColorStop(0,'#999')
edgeGradient.addColorStop(0.5,'#fff')
edgeGradient.addColorStop(1,'#999')
g.fillStyle=edgeGradient
g.beginPath()
g.arc(this.center.x,this.center.y,this.radius,0,2*Math.PI)
g.closePath()
g.arc(this.center.x,this.center.y,this.radius+this.radius*0.075,0,2*Math.PI,true)
g.shadowColor='rgba(0,0,0,0.7)'
g.shadowBlur=this.radius*0.3
g.shadowOffsetY=1
g.fill()
g.shadowBlur=0
g.shadowOffsetY=0}
drawPin(){this.g.fillStyle='#999'
this.g.beginPath()
this.g.arc(this.center.x,this.center.y,this.radius*0.04,0,2*Math.PI)
this.g.fill()}
drawMarkers(){let g=this.g
g.font='bold '+this.radius*this.faceOpt.numSizeRatio+'px Arial'
g.textAlign='center'
let dotA=-0.4
let dotB=1-dotA
let i=1
while(i<=60){let angle=Math.PI*2*(-i/60)
let startX=Math.sin(angle)*(this.radius-this.radius*this.faceOpt.edgeDistRatio)+this.center.x
let startY=Math.cos(angle)*(this.radius-this.radius*this.faceOpt.edgeDistRatio)+this.center.y
let endX=Math.sin(angle)*(this.radius-this.radius*this.faceOpt.lengthRatio-this.radius*this.faceOpt.edgeDistRatio)+this.center.x
let endY=Math.cos(angle)*(this.radius-this.radius*this.faceOpt.lengthRatio-this.radius*this.faceOpt.edgeDistRatio)+this.center.y
if(i%this.faceOpt.keyMarkers){g.lineWidth=this.faceOpt.thickRatio*this.radius*2}else{g.lineWidth=this.faceOpt.thickRatio*this.radius*5}
let markType='line'
switch(markType){case 'line':g.beginPath()
g.moveTo(startX,startY)
g.lineTo(endX,endY)
g.stroke()
break
case 'dot':g.fillStyle='#cdf'
g.beginPath()
let dotRad=0
if(i%this.faceOpt.keyMarkers){dotRad=this.radius*0.015}else{dotRad=this.radius*0.03}
g.arc(startX*dotA+endX*dotB,startY*dotA+endY*dotB,dotRad,0,2*Math.PI)
g.stroke()
g.fill()
break
default:}
i++}
i=1
while(i<=60){let angle=Math.PI*2*(-i/60)
if(i%this.faceOpt.keyMarkers){}else{g.fillStyle='#000'
g.strokeStyle='#fff'
g.miterLimit=2
g.lineWidth=1
let numRad=this.radius*(1-this.faceOpt.numDistRatio)
let numX=Math.sin(angle)*numRad+this.center.x
let numY=Math.cos(angle)*numRad+this.center.y+this.radius*0.09
let h=Math.floor(i/5)+6
if(h>12)h-=12
if(h==10){numX+=this.radius*0.04
numY+=this.radius*0.03}
if(h==11){numX+=this.radius*0.02
numY+=this.radius*0.03}
g.fillText(h.toString(),numX,numY)
g.strokeText(h.toString(),numX,numY)}
i++}}
drawSecondHand(){let secs=this.dt.getSeconds()
secs+=this.dt.getMilliseconds()/1000
let handAngle=Math.PI*2*(-secs/60)
this.drawHand(handAngle,this.secondOpt)}
drawMinuteHand(){let minutes=this.dt.getMinutes()+this.dt.getSeconds()/60
let handAngle=Math.PI*2*(-minutes/60)
this.drawHand(handAngle,this.minuteOpt)}
drawHourHand(){let h=this.dt.getHours()+this.dt.getMinutes()/60
if(h>=12)h-=12
let handAngle=Math.PI*2*(-h/12)
this.drawHand(handAngle,this.hourOpt)}
drawHand(angle,handOptions){let startX=Math.sin(angle)*(this.radius*handOptions.backwardRadiusRatio)+this.center.x
let startY=Math.cos(angle)*(this.radius*handOptions.backwardRadiusRatio)+this.center.y
let endX=Math.sin(angle-Math.PI)*(this.radius*handOptions.forwardRadiusRatio)+this.center.x
let endY=Math.cos(angle-Math.PI)*(this.radius*handOptions.forwardRadiusRatio)+this.center.y
let g=this.g
g.shadowColor='rgba(0,0,0,0.8)'
g.shadowBlur=this.radius*0.075
g.shadowOffsetY=1
g.strokeStyle=handOptions.color
g.lineWidth=handOptions.thickRatio*this.radius
g.beginPath()
g.moveTo(startX,startY)
g.lineTo(endX,endY)
g.stroke()
g.fillStyle=handOptions.color
g.beginPath()
g.arc(endX,endY,g.lineWidth/2,0,2*Math.PI)
g.fill()
g.shadowBlur=0
g.shadowOffsetY=0
if(handOptions.tipRadiusRatio){g.beginPath()
g.moveTo(startX,startY)
g.lineTo(endX,endY)
g.stroke()}}}
function DigiClock(wd,mode,canName){this.wd=wd
this.mode=mode
if(this.mode=='am'){this.ht=this.wd/2}else{this.ht=this.wd/3}
if(this.mode=='am'){this.numHt=this.wd*0.3}else{this.numHt=this.wd*0.19}
this.numWd=this.numHt*0.45
this.numGap=this.numHt*0.2
this.midX=this.wd/2
this.midY=this.ht/2
this.typ='led'
switch(this.typ){case 'lcd':this.clr={bg:'rgb(80, 133, 255)',border:'2px solid #888',on:'rgb(25, 38, 107)',off:'rgb(80, 133, 255)',shadow:'rgb(100, 255, 0)',shadowBlur:0}
break
case 'led':this.clr={bg:'#222',border:'2px solid black',on:'rgb(100, 255, 0)',off:'rgb(50, 50, 0)',shadow:'rgb(100, 255, 0)',shadowBlur:33}
break
default:}
this.el=document.getElementById(canName)
this.el.style.backgroundColor=this.clr.bg
this.el.style.borderRadius='10px'
this.el.style.border=this.clr.border
let ratio=2
this.el.width=this.wd*ratio
this.el.height=this.ht*ratio
this.el.style.width=this.wd+'px'
this.el.style.height=this.ht+'px'
this.g=this.el.getContext('2d')
this.g.setTransform(ratio,0,0,ratio,0,0)
this.numbers={n0:[1,1,1,0,1,1,1],n1:[0,0,1,0,0,1,0],n2:[1,0,1,1,1,0,1],n3:[1,0,1,1,0,1,1],n4:[0,1,1,1,0,1,0],n5:[1,1,0,1,0,1,1],n6:[0,1,0,1,1,1,1],n7:[1,0,1,0,0,1,0],n8:[1,1,1,1,1,1,1],n9:[1,1,1,1,0,1,1],A:[1,1,1,1,1,1,0],P:[1,1,1,1,1,0,0],}
this.tmLast=performance.now()
this.update}
DigiClock.prototype.loop=function(){let tm=performance.now()
if(tm>this.tmLast+100){this.tmLast=performance.now()
this.update()}
requestAnimationFrame(this.loop.bind(this))}
DigiClock.prototype.update=function(){this.g.clearRect(0,0,this.wd,this.ht)
let time=new Date()
let hours=time.getHours().toString()
if(this.mode=='am'){if(hours>12)hours-=12
if(hours==0){hours='12'}else if(hours<10){hours='0'+hours}else{hours=''+hours}}else{if(hours<10){hours='0'+hours}}
let minutes=time.getMinutes().toString()
if(minutes.length==1){minutes='0'+minutes}
let seconds=time.getSeconds().toString()
if(seconds.length==1){seconds='0'+seconds}
let timeStr
if(this.mode=='am'){timeStr=hours+minutes}else{if(my.secQ){timeStr=hours+minutes+seconds}else{timeStr=hours+minutes}}
for(let i=0;i<timeStr.length;i++){this.drawNum(i,this.midX,this.midY,this.numbers['n'+timeStr[i]])}
if(this.mode=='am'){let pos=timeStr.length
if(time.getHours()<12){this.drawNum(pos,this.midX,this.midY,this.numbers['A'],0.6)}else{this.drawNum(pos,this.midX,this.midY,this.numbers['P'],0.6)}}
this.setClr(seconds%2)
this.colonDraw(seconds)}
DigiClock.prototype.drawNum=function(pos,x,y,numArray,scale){scale=typeof scale!=='undefined'?scale:1
let xShift
if(this.mode=='am'||!my.secQ){xShift=(pos-3)*this.numWd+this.numGap*pos
xShift+=Math.floor(pos/2)*this.numGap*2}else{switch(pos){case 0:xShift=(this.numWd*3+this.numGap*2)*-1-20
break
case 1:xShift=(this.numWd*2+this.numGap*1)*-1-20
break
case 2:xShift=this.numWd*-1
break
case 3:xShift=this.numGap
break
case 4:xShift=this.numWd+this.numGap*2+20
break
case 5:xShift=this.numWd*2+this.numGap*3+20
break}
xShift-=5}
for(let i=0;i<numArray.length;i++){this.segment(this.midX+xShift-this.numWd*0.2,this.midY-this.numHt/2,numArray[i],i,scale)}}
DigiClock.prototype.segment=function(x,y,onQ,position,scale){this.setClr(onQ)
let startX=x
let startY=y
let m=this.numHt/11
let wd,ht
if(position===0||position===3||position===6){wd=this.numHt/2.75
ht=this.numHt/11}else{wd=this.numHt/11
ht=this.numHt/2.75}
m*=scale
wd*=scale
ht*=scale
let g=this.g
switch(position){case 0:g.bar(startX+m,startY,wd,ht)
break
case 1:g.bar(startX,startY+m,wd,ht)
break
case 2:g.bar(startX+wd+ht,startY+m,wd,ht)
break
case 3:g.bar(startX+m,startY+wd+ht,wd,ht)
break
case 4:g.bar(startX,startY+m+wd+ht,wd,ht)
break
case 5:g.bar(startX+wd+ht,startY+m+wd+ht,wd,ht)
break
case 6:g.bar(startX+m,startY+2*wd+ht+m,wd,ht)
break}}
DigiClock.prototype.colonDraw=function(s){let height=this.numHt*0.15
let width=height/2
let margin=height/3
let g=this.g
if(s%2){g.fillStyle=this.clr.on}
if(this.mode=='am'){g.bar(this.midX,this.midY-margin-height,width,height)
g.bar(this.midX,this.midY+margin,width,height)}else{if(my.secQ){g.bar(this.midX-this.numWd-this.numWd*0.9,this.midY-margin-height,width,height)
g.bar(this.midX-this.numWd-this.numWd*0.9,this.midY+margin,width,height)
g.bar(this.midX+this.numWd+this.numWd*0.75,this.midY+margin,width,height)
g.bar(this.midX+this.numWd+this.numWd*0.75,this.midY-margin-height,width,height)}else{g.bar(this.midX,this.midY-margin-height,width,height)
g.bar(this.midX,this.midY+margin,width,height)}}}
DigiClock.prototype.setClr=function(onQ){let g=this.g
this.clr={bg:'#111',border:'2px solid black',on:'rgb(100, 255, 0)',off:'rgb(50, 80, 0)',shadow:'rgb(100, 255, 0)',shadowBlur:33}
g.shadowColor=this.clr.shadow
if(onQ){g.fillStyle=this.clr.on
g.shadowBlur=this.clr.shadowBlur}else{g.fillStyle=this.clr.off
g.shadowBlur=0}}
CanvasRenderingContext2D.prototype.bar=function(x,y,w,h){let g=this
if(h<w){g.beginPath()
g.moveTo(x,y)
g.lineTo(x+w,y)
g.lineTo(x+w+h/2,y+h/2)
g.lineTo(x+w,y+h)
g.lineTo(x,y+h)
g.lineTo(x-h/2,y+h/2)
g.closePath()
g.fill()}else{g.beginPath()
g.moveTo(x,y)
g.lineTo(x+w/2,y-w/2)
g.lineTo(x+w,y)
g.lineTo(x+w,y+h)
g.lineTo(x+w/2,y+h+w/2)
g.lineTo(x,y+h)
g.closePath()
g.fill()}}
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
function docInsert(s){let div=document.createElement('div')
div.innerHTML=s
let script=document.currentScript
script.parentElement.insertBefore(div,script)}
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
let idi=id+i
let lbl=opts[i]
if(lbl.name==txt)chk='checked'
s+='<div style="display:inline-block; white-space: nowrap;">'
s+='<input id="'+idi+'" type="radio" name="'+id+'" value="'+lbl.name+'" onclick="'+fn+'('+i+');" '+chk+' >'
s+='<label for="'+idi+'"  onclick="'+fn+'('+i+');">'
s+=lbl.name+'</label>&nbsp;'
s+='</div>'}
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