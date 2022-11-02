let my={}
function init(){let version='0.61'
let w=getJSQueryVar('w',300)
let h=w
my.style=getJSQueryVar('style','gold')
my.drag={n:-1,overN:-1,onq:false,holdX:0,holdY:0}
my.currTimeQ=true
let s=wrap({cls:'js',style:'width:'+w+'px; border:none;'},'<canvas id="clock1" style="position: absolute; left:0;"></canvas>','<canvas id="clock2" style="position: absolute; left:0;"></canvas>')
docInsert(s)
my.can=new Can('clock1',w,h,3)
my.can2=new Can('clock2',w,h,3)
my.dragType=''
my.clock=new Clock(w)
my.clock.drawFace()
my.clock.drawMinuteMarkers()
anim()
let moose=new Mouse(my.can2.el)}
function anim(){if(my.currTimeQ)my.clock.update()
requestAnimationFrame(anim)}
class Clock{constructor(w){this.center={x:w/2,y:w/2,}
this.secondOpt={clr:'#cd151c',thickRat:0.011,foreRad:0.92,backRad:0.2,}
this.minuteOpt={clr:'rgba(255,0,0,1)',thickRat:0.06,foreRad:0.78,backRad:0.25,}
this.hourOpt={clr:'#44f',thickRat:0.08,foreRad:0.56,backRad:0.2,}
let grads={antique2:[[0,'#ffffff'],[1,'#fed']],antique3:[[0,'#f2ede0'],[0.5,'#eca'],[1,'#f2ede0']],silver2:[[0,'#ddf'],[1,'#aaa']],silver3:[[0,'#999'],[0.5,'#eef'],[1,'#999']]}
let styles={antique:{numDist:0.28,numSz:0.28,dotDist:0.9,boldN:5,numN:5,edge:0.075,shad:0.15,shadClr:'rgba(100,0,0,0.5)',faceGrad:grads.antique2,edgeGrad:grads.antique3},}
this.style=styles.antique
this.radius=w*(0.5-this.style.shad/10-this.style.edge/2)
this.hh=0
this.mm=0
this.ss=0
if(true){}
this.update()}
update(){this.dt=new Date()
this.hh=this.dt.getHours()+this.dt.getMinutes()/60
if(this.hh>=12)this.hh-=12
this.mm=this.dt.getMinutes()+this.dt.getSeconds()/60
this.ss=this.dt.getSeconds()+this.dt.getMilliseconds()/1000
this.redraw()}
redraw(){my.can2.clear()
this.drawHand(this.getHourAngle(),this.hourOpt,my.drag.overN==2)
this.drawHand(this.getMinuteAngle(),this.minuteOpt,my.drag.overN==1)
this.drawHand(this.getSecondAngle(),this.secondOpt,false)
this.drawPin()}
drawFace(){let g=my.can.g
let faceGradient=g.createRadialGradient(this.center.x,this.center.y,0,this.center.x,this.center.y,this.radius)
for(let i=0;i<this.style.faceGrad.length;i++){let stop=this.style.faceGrad[i]
faceGradient.addColorStop(stop[0],stop[1])}
g.fillStyle=faceGradient
g.beginPath()
g.arc(this.center.x,this.center.y,this.radius,0,2*Math.PI)
g.fillStyle='#fff'
g.fill()
g.fillStyle=faceGradient
g.fill()
let edgeGradient=g.createLinearGradient(0,this.center.y-this.radius,0,this.center.y+this.radius)
for(let i=0;i<this.style.edgeGrad.length;i++){let stop=this.style.edgeGrad[i]
edgeGradient.addColorStop(stop[0],stop[1])}
g.fillStyle=edgeGradient
g.beginPath()
g.arc(this.center.x,this.center.y,this.radius,0,2*Math.PI)
g.arc(this.center.x,this.center.y,this.radius+this.radius*this.style.edge,0,2*Math.PI,true)
g.shadowColor=this.style.shadClr
g.shadowBlur=this.radius*this.style.shad
g.shadowOffsetY=1
g.fill()
g.shadowBlur=0
g.shadowOffsetY=0}
drawPin(){let g=my.can2.g
g.fillStyle='#888'
g.beginPath()
g.arc(this.center.x,this.center.y,4,0,2*Math.PI)
g.fill()}
drawMinuteMarkers(){let g=my.can.g
g.font=' '+((this.radius*this.style.numSz)>>0)+'px Arial'
g.textAlign='center'
g.fillStyle='#444'
let dotSize=2
let i=1
while(i<=60){let angle=Math.PI*2*(-i/60)
let dotRad=this.radius*this.style.dotDist
let dotX=Math.sin(angle)*dotRad+this.center.x
let dotY=Math.cos(angle)*dotRad+this.center.y
if(i%this.style.boldN){dotSize=1}else{dotSize=3}
if(i%this.style.numN){}else{g.fillStyle='#004'
g.strokeStyle='#fff'
g.lineWidth=1
let numRad=this.radius*(1-this.style.numDist)
let numX=Math.sin(angle)*numRad+this.center.x
let numY=Math.cos(angle)*numRad+this.center.y+this.radius*0.09
let h=Math.floor(i/5)+6
if(h>12)h-=12
g.font=' '+((this.radius*this.style.numSz)>>0)+'px Arial'
g.fillText(h.toString(),numX,numY)
numX=Math.sin(angle)*numRad*0.7+this.center.x
numY=Math.cos(angle)*numRad*0.7+this.center.y+this.radius*0.05
if(0){h+=12
if(h==24)h='00'
g.font=' '+((0.5*this.radius*this.style.numSz)>>0)+'px Arial'
g.fillStyle='black'
g.fillText(h.toString(),numX,numY)}}
g.fillStyle='#444'
g.beginPath()
g.arc(dotX,dotY,dotSize,0,Math.PI*2)
g.fill()
i++}}
getSecondAngle(){return Math.PI*2*(-this.ss/60)}
getMinuteAngle(){return Math.PI*2*(-this.mm/60)}
getHourAngle(){return Math.PI*2*(-this.hh/12)}
drawHand(angle,opts,hiQ){let back=this.radius*opts.backRad
let fore=this.radius*opts.foreRad
let thk=(opts.thickRat*this.radius)/2
let sina=Math.sin(angle)
let cosa=Math.cos(angle)
let xys=[[-thk,back],[thk,back],[thk,-fore+thk*2],[0,-fore-thk*2],[-thk,-fore+thk*2],]
for(let i=0,len=xys.length;i<len;i++){let xy=xys[i]
let xPos=xy[0]*cosa+xy[1]*sina
let yPos=-xy[0]*sina+xy[1]*cosa
xy[0]=xPos+this.center.x
xy[1]=yPos+this.center.y}
let g=my.can2.g
g.shadowColor='rgba(0,0,0,0.8)'
g.shadowBlur=this.radius*0.1
if(hiQ){g.shadowColor='rgba(255,255,0,1)'}
g.shadowOffsetY=this.radius*0.05
g.fillStyle=opts.clr
g.beginPath()
for(let i=0,len=xys.length;i<len;i++){let xy=xys[i]
if(i==0){g.moveTo(xy[0],xy[1])}else{g.lineTo(xy[0],xy[1])}}
g.closePath()
g.fill()
g.shadowBlur=0
g.shadowOffsetY=0}}
function isNear(a,b,tol){return Math.abs(a-b)<=tol}
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
window.addEventListener('storage',themeChg)
themeChg()
function themeChg(){my.theme=localStorage.getItem('theme')
console.log('themeChg to',my.theme)
if(my.theme=='dark'){my.noClr='black'
my.yesClr='#036'}else{my.noClr='#f8f8f8'
my.yesClr='#dfd'}}
class Mouse{constructor(el){console.log('new moose')
el.addEventListener('touchstart',this.onTouchStart.bind(this),false)
el.addEventListener('touchmove',this.onTouchMove.bind(this),false)
window.addEventListener('touchend',this.onTouchEnd.bind(this),false)
el.addEventListener('mousedown',this.onMouseDown.bind(this),false)
el.addEventListener('mousemove',this.onMouseMove.bind(this),false)
window.addEventListener('mouseup',this.onMouseUp.bind(this),false)
this.el=el
this.ratio=1}
onTouchStart(ev){console.log('onTouchStart',this)
let touch=ev.targetTouches[0]
ev.clientX=touch.clientX
ev.clientY=touch.clientY
ev.touchQ=true
this.onMouseDown(ev)}
onTouchMove(ev){let touch=ev.targetTouches[0]
ev.clientX=touch.clientX
ev.clientY=touch.clientY
ev.touchQ=true
this.onMouseMove(ev)}
onTouchEnd(ev){my.moose.onMouseUp(ev)}
onMouseDown(ev){let mouse=this.mousePos(ev)
my.drag.onQ=false
my.drag.n=this.hitFind(my.shapes,mouse)
my.currTimeQ=my.drag.n<0
ev.preventDefault()}
onMouseMove(ev){let mouse=this.mousePos(ev)
if(my.drag.n>0){let angle1
switch(my.drag.n){case 2:angle1=Math.atan2(my.clock.center.y-mouse.y,mouse.x-my.clock.center.x)
let hr=3-(6*angle1)/Math.PI
if(hr<0)hr+=12
my.clock.hh=hr
my.clock.mm=(my.clock.hh-(my.clock.hh>>0))*60
my.clock.redraw()
break
case 1:angle1=Math.atan2(my.clock.center.y-mouse.y,mouse.x-my.clock.center.x)
let mn=15-(30*angle1)/Math.PI
if(mn<0)mn+=60
my.clock.mm=mn
let oldHrMin=(my.clock.hh-(my.clock.hh>>0))*60
let diff=mn-oldHrMin
if(diff<-30)diff+=60
if(diff>30)diff-=60
my.clock.hh+=diff/60
my.clock.redraw()
break
default:}}else{my.drag.overN=this.hitFind(my.shapes,mouse)
if(my.drag.overN>=0){document.body.style.cursor='pointer'}else{document.body.style.cursor='default'}}}
onMouseUp(){my.drag.n=-1
my.drag.overN=-1
document.body.style.cursor='default'}
mousePos(ev){let bRect=this.el.getBoundingClientRect()
return{x:(ev.clientX-bRect.left)*(bRect.width/this.ratio/bRect.width),y:(ev.clientY-bRect.top)*(bRect.height/this.ratio/bRect.height),}}
hitFind(pts,mouse){let angle=Math.atan2(mouse.y-my.clock.center.y,my.clock.center.x-mouse.x)
angle-=(3*Math.PI)/2
if(angle<-2*Math.PI)angle+=2*Math.PI
if(isNear(angle,my.clock.getMinuteAngle(),0.1))return 1
if(isNear(angle,my.clock.getHourAngle(),0.1))return 2
return-1}
hitTest(shape,mouse){if(mouse.x<shape.x)return false
if(mouse.y<shape.y)return false
if(mouse.x>shape.x+shape.wd)return false
if(mouse.y>shape.y+shape.ht)return false
return true}}
function docInsert(s){let div=document.createElement('div')
div.innerHTML=s
let script=document.currentScript
script.parentElement.insertBefore(div,script)}
class Can{constructor(id,wd,ht,ratio){this.id=id
this.wd=wd
this.ht=ht
this.ratio=ratio
let el=document.getElementById(id)
el.width=wd*ratio
el.style.width=wd+'px'
el.height=ht*ratio
el.style.height=ht+'px'
this.g=el.getContext('2d')
this.g.setTransform(ratio,0,0,ratio,0,0)
this.el=el
return this}
clear(){this.g.clearRect(0,0,this.wd,this.ht)}
mousePos(ev){let bRect=this.el.getBoundingClientRect()
let mouseX=(ev.clientX-bRect.left)*(this.el.width/this.ratio/bRect.width)
let mouseY=(ev.clientY-bRect.top)*(this.el.height/this.ratio/bRect.height)
return[mouseX,mouseY]}}
function wrap({id='',cls='',pos='rel',style='',txt='',tag='div',lbl='',fn='',opts=[]},...mores){let s=''
s+='\n'
txt+=mores.join('')
s+={btn:()=>{if(cls.length==0)cls='btn'
return '<button onclick="'+fn+'"'},can:()=>'<canvas',div:()=>'<div',edit:()=>'<textarea onkeyup="'+fn+'" onchange="'+fn+'"',inp:()=>{if(cls.length==0)cls='input'
let s=''
s+=lbl.length>0?'<label class="label">'+lbl+' ':''
s+='<input value="'+txt+'"'
s+=fn.length>0?'  oninput="'+fn+'" onchange="'+fn+'"':''
return s},out:()=>{pos='dib'
if(cls.length==0)cls='output'
let s=''
s+=lbl.length>0?'<label class="label">'+lbl+' ':''
s+='<span '
return s},rad:()=>{if(cls.length==0)cls='radio'
return '<form'+(fn.length>0?(s+=' onclick="'+fn+'"'):'')},sel:()=>{if(cls.length==0)cls='select'
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
s+={btn:()=>'>'+txt+'</button>',can:()=>'></canvas>',div:()=>' >'+txt+'</div>',edit:()=>' >'+txt+'</textarea>',inp:()=>'>'+(lbl.length>0?'</label>':''),out:()=>' >'+txt+'</span>'+(lbl.length>0?'</label>':''),rad:()=>{let s=''
s+='>\n'
for(let i=0;i<opts.length;i++){let chk=''
if(i==0)chk='checked'
s+='<input type="radio" id="r'+i+'" name="typ" style="cursor:pointer;" value="'+opts[i][0]+'" '+chk+' />\n'
s+='<label for="r'+i+'" style="cursor:pointer;">'+opts[i][1]+'</label><br/>\n'}
s+='</form>'
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