let my={}
function init(){let version='0.84'
my.mode=getJSQueryVar('mode','par')
my.dragging=false
let w=360
let h=300
my.wd=w
my.ht=h
let s=''
s+='<div class="js" style="position: relative; text-align: center; margin:auto; max-width:'+w+'px;">'
s+='<canvas id="canPar" style="z-index:4;"></canvas>'
s+='<button id="nextBtn" onclick="next()" style="z-index:2; position:absolute; right:3px; bottom:22px;" class="btn" >Next</button>'
s+='<br>'
s+=wrap({cls:'copyrt',pos:'abs',style:'left:5px; bottom:3px'},`&copy; 2022 Rod Pierce  v${version}`)
s+='</div>'
docInsert(s)
switch(my.mode){case 'par':my.typeDescr='parallel'
break
case 'perp':my.typeDescr='perpendicular'
break
default:}
my.can=new Can('canPar',w,h,2)
my.exerPts=[[50,-50],[50,25],[50,-5],[5,50],[50,-1],]
my.exerPtNo=-1
my.startQ=true
my.draggingQ=false
let el=my.can.el
let imgHome=document.domain=='localhost'?'/mathsisfun/images/style/':'/images/style/'
el.style.cursor='url('+imgHome+'pencil.svg), crosshair'
el.addEventListener('mousedown',onmouseDown,false)
el.addEventListener('mousemove',onmouseMove,false)
el.addEventListener('touchstart',ontouchstart,false)
el.addEventListener('touchmove',ontouchmove,false)
next()}
function next(){my.exerPtNo=++my.exerPtNo%my.exerPts.length
let midX=my.wd/2+Math.random()*50
let midY=my.ht/2+Math.random()*50
my.exerLn=new Line(new Pt(midX,midY),new Pt(midX+my.exerPts[my.exerPtNo][0],midY+my.exerPts[my.exerPtNo][1]))
my.userLn=new Line(new Pt(0,0),new Pt(0,0))
my.startQ=true
drawMe()}
function goodQ(){let successQ=false
if(my.userLn.getLength()>10){switch(my.mode){case 'par':if(my.userLn.isParallel(my.exerLn,0.06))successQ=true
break
case 'perp':if(my.userLn.isPerp(my.exerLn,0.06))successQ=true
break
default:}}
return successQ}
function drawBG(w,h){let g=my.can.g
g.lineWidth=1
for(let i=0;i<10;i++){let xPix=i*60
g.beginPath()
if(i%2){g.strokeStyle='rgba(0,0,2556,0.2)'}else{g.strokeStyle='rgba(0,0,255,0.2)'}
g.moveTo(xPix,0)
g.lineTo(xPix,h)
g.stroke()}
for(let i=0;i<6;i++){let yPix=i*60
g.beginPath()
if(i%2){g.strokeStyle='rgba(0,0,255,0.2)'}else{g.strokeStyle='rgba(0,0,255,0.2)'}
g.moveTo(0,yPix)
g.lineTo(w,yPix)
g.stroke()}}
function ontouchstart(ev){let touch=ev.targetTouches[0]
ev.clientX=touch.clientX
ev.clientY=touch.clientY
ev.touchQ=true
onmouseDown(ev)}
function ontouchmove(ev){let touch=ev.targetTouches[0]
ev.clientX=touch.clientX
ev.clientY=touch.clientY
ev.touchQ=true
onmouseMove(ev)
ev.preventDefault()}
function ontouchend(ev){let el=my.can.el
el.addEventListener('touchstart',ontouchstart,false)
window.removeEventListener('touchend',ontouchend,false)
if(my.draggingQ){my.draggingQ=false
checkSuccess()}}
function onmouseDown(ev){let[mouseX,mouseY]=my.can.mousePos(ev)
my.userLn.a.x=mouseX
my.userLn.a.y=mouseY
my.draggingQ=true
if(ev.touchQ){}else{}
let el=my.can.el
if(ev.touchQ){el.removeEventListener('touchstart',ontouchstart,false)
window.addEventListener('touchend',ontouchend,false)}else{el.removeEventListener('mousedown',onmouseDown,false)
window.addEventListener('mouseup',onmouseUp,false)}
if(ev.preventDefault){ev.preventDefault()}
else if(ev.returnValue){ev.returnValue=false}
return false}
function onmouseUp(ev){let el=my.can.el
el.addEventListener('mousedown',onmouseDown,false)
window.removeEventListener('mouseup',onmouseUp,false)
if(my.draggingQ){my.draggingQ=false
checkSuccess()}}
function onmouseMove(ev){let[mouseX,mouseY]=my.can.mousePos(ev)
my.userLn.b.x=mouseX
my.userLn.b.y=mouseY
if(my.draggingQ){drawMe()}}
function checkSuccess(){let g=my.can.g
if(goodQ()){g.fillStyle='gold'
g.font='bold 24px Arial'
g.fillText('Yes, they are '+my.typeDescr+'!',my.wd/2,30)
g.fillStyle='hsla(240,100%,70%,1)'
g.font='16px Arial'
g.fillText('Try more, or press Next',my.wd/2,50)}else{g.fillStyle='red'
g.font='16px Arial'
g.fillText('Ooops, not right. Try again.',my.wd/2,30)}}
function drawMe(){let g=my.can.g
my.can.clear()
if(my.startQ){g.fillStyle='hsla(240,100%,70%,1)'
g.font='bold 16px Arial'
g.textAlign='center'
g.fillText('Draw a line segment '+my.typeDescr+' to this line',my.wd/2,20)
my.startQ=false}
drawBG(g.canvas.width,g.canvas.height)
g.lineWidth=2
my.exerLn.setLen(1000,true)
g.strokeStyle='hsla(240,100%,70%,1)'
my.exerLn.drawMe(g)
if(goodQ()){g.strokeStyle='gold'}else{g.strokeStyle='rgba(0,0,256,1)'}
my.userLn.drawMe(g)}
function Pt(ix,iy){this.x=ix
this.y=iy
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
Pt.prototype.setAvg=function(pts){let newPt=this.getAvg(pts)
this.x=newPt.x
this.y=newPt.y}
Pt.prototype.interpolate=function(pt1,pt2,f){this.x=pt1.x*f+pt2.x*(1-f)
this.y=pt1.y*f+pt2.y*(1-f)}
Pt.prototype.translate=function(pt,addQ){addQ=typeof addQ!=='undefined'?addQ:true
let t=new Pt(this.x,this.y)
t.x=this.x
t.y=this.y
if(addQ){t.x+=pt.x
t.y+=pt.y}else{t.x-=pt.x
t.y-=pt.y}
return t}
Pt.prototype.multiply=function(fact){return new Pt(this.x*fact,this.y*fact)}
Pt.prototype.multiplyMe=function(fact){this.x*=fact
this.y*=fact}
function constrain(min,val,max){return Math.min(Math.max(min,val),max)}
function Line(pt1,pt2){this.a=pt1
this.b=pt2}
Line.prototype.drawMe=function(g){g.beginPath()
g.moveTo(this.a.x,this.a.y)
g.lineTo(this.b.x,this.b.y)
g.closePath()
g.stroke()}
Line.prototype.getSlope=function(){if(this.a.x==this.b.x)return NaN
return(this.a.y-this.b.y)/(this.a.x-this.b.x)}
Line.prototype.getIntercept=function(){if(this.a.x==this.b.x)return NaN
return this.a.y-this.getSlope()*this.a.x}
Line.prototype.getLength=function(){let dx=this.b.x-this.a.x
let dy=this.b.y-this.a.y
return Math.sqrt(dx*dx+dy*dy)}
Line.prototype.isParallel=function(vsLine,toler){let sameSlopeQ=false
if(isNaN(this.getSlope())){if(isNaN(vsLine.getSlope())){sameSlopeQ=true}}else{if(isNear(this.getSlope()/vsLine.getSlope(),1,toler)){sameSlopeQ=true}}
if(sameSlopeQ){let sameInterceptQ=false
if(isNaN(this.getIntercept())){if(isNaN(vsLine.getIntercept())){sameInterceptQ=true}}else{if(isNear(this.getIntercept()/vsLine.getIntercept(),1,toler/3)){sameInterceptQ=true}}
return!sameInterceptQ}else{return false}}
Line.prototype.isPerp=function(vsLine,toler){if(true){let degDiff=this.getAngle()-vsLine.getAngle()
degDiff=Math.abs(degDiff)
if(degDiff>Math.PI)degDiff-=Math.PI
if(isNear(degDiff,Math.PI/2,toler)){return true}
return false}}
Line.prototype.getMidPt=function(){return new Pt((this.a.x+this.b.x)/2,(this.a.y+this.b.y)/2)}
Line.prototype.getClosestPoint=function(toPt,inSegmentQ){let AP=toPt.translate(this.a,false)
let AB=this.b.translate(this.a,false)
let ab2=AB.x*AB.x+AB.y*AB.y
let ap_ab=AP.x*AB.x+AP.y*AB.y
let t=ap_ab/ab2
if(inSegmentQ){t=constrain(0,t,1)}
return this.a.translate(AB.multiply(t))}
Line.prototype.setLen=function(newLen,fromMidQ){let len=this.getLength()
if(fromMidQ){let midPt=this.getMidPt()
let halfPt=new Pt(this.a.x-midPt.x,this.a.y-midPt.y)
halfPt.multiplyMe(newLen/len)
this.a=midPt.translate(halfPt)
this.b=midPt.translate(halfPt,false)}else{let diffPt=new Pt(this.a.x-this.b.x,this.a.y-this.b.y)
diffPt.multiplyMe(newLen/len)
this.b=this.a.translate(diffPt,false)}}
Line.prototype.getAngle=function(){return Math.atan2(this.b.y-this.a.y,this.b.x-this.a.x)}
Line.prototype.setAngle=function(angle){let len=dist(this.b.x-this.a.x,this.b.y-this.a.y)
if(len==0){len=100
this.a.x=this.a.x-(len/2)*Math.cos(angle)
this.a.y=this.a.y-(len/2)*Math.sin(angle)
this.b.x=this.a.x+len*Math.cos(angle)
this.b.y=this.a.y+len*Math.sin(angle)}else{this.b.x=this.a.x+len*Math.cos(angle)
this.b.y=this.a.y+len*Math.sin(angle)}}
function dist(dx,dy){return Math.sqrt(dx*dx+dy*dy)}
function isNear(checkVal,centralVal,limitVal){if(checkVal<centralVal-limitVal)return false
if(checkVal>centralVal+limitVal)return false
return true}
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