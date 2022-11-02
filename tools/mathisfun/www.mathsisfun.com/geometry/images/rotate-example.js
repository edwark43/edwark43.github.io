let my={}
function init(){let version='0.82'
my.mode=getJSQueryVar('mode','rect')
let w=300
let h=300
my.imgHome=(document.domain=='localhost'?'/mathsisfun':'')+'/images/'
let s=''
s+='<div style="position:relative; width:'+w+'px; min-height:'+h+'px; border: none; border-radius: 20px; background-color: #def; margin:auto; display:block;">'
s+='<canvas id="canvasId" style="position: absolute; width:'+w+'px; height:'+h+'px; left: 0; top:; border: none;"></canvas>'
s+='<div id="descr" style="position:absolute; left:70px; top:140px; width: 140px; font: 16px Arial; text-align: center; color: grey;">center</div>'
s+='<img id="pin" src="'+my.imgHome+'push-pin.gif" width="26" height="43" style="position: absolute; left:130px; top:99px; vertical-align: middle;">'
s+='<div style="position:absolute; right:3px; top:5px;">'
s+=playHTML(40)
s+='</div>'
s+=wrap({cls:'copyrt',pos:'abs',style:'left:5px; bottom:3px'},`&copy; 2022 Rod Pierce  v${version}`)
s+='</div>'
docInsert(s)
my.can=new Can('canvasId',w,h,2)
this.midX=140
this.midY=140
this.scale=0.044
this.radius=110
this.frame=0
my.pts1=[new Point(120,50),new Point(-40,50),new Point(-40,-20),new Point(120,-20)]
my.pts2=[new Point(90,80),new Point(10,50),new Point(60,20)]
my.pts=my.pts1
my.ptsNo=0
this.playQ=false
playToggle()}
function animate(){this.frame=++this.frame%800
if(my.mode=='rect')doFrameRect(this.frame)
if(this.playQ)requestAnimationFrame(animate)}
function doFrameRect(frame){my.can.clear()
let g=my.can.g
g.fillStyle='#bbb'
g.beginPath()
g.arc(this.midX,this.midY,4,0,2*Math.PI)
g.fill()
rotShape(0.02)
drawShape(frame)
if(frame>=200&&frame<500){drawCirc(1)}
if(frame>=500){drawCirc(my.pts.length)}
if(frame==0){my.ptsNo=++my.ptsNo%2
switch(my.ptsNo){case 0:my.pts=my.pts1
break
case 1:my.pts=my.pts2
break
default:}}}
function drawShape(){let g=my.can.g
g.strokeStyle='blue'
g.fillStyle='rgba(255,255,0,0.07)'
g.lineWidth=1
g.beginPath()
for(let i=0,len=my.pts.length;i<len;i++){let pt=my.pts[i]
if(i==0){g.moveTo(this.midX+pt.x,this.midY+pt.y)}else{g.lineTo(this.midX+pt.x,this.midY+pt.y)}}
g.closePath()
g.stroke()
g.fill()}
function rotShape(angle){for(let i=0,len=my.pts.length;i<len;i++){let pt=my.pts[i]
pt.rotate(angle)}}
function drawCirc(n){let g=my.can.g
g.fillStyle='orange'
for(let i=0;i<n;i++){let pt=my.pts[i]
g.beginPath()
g.arc(this.midX+pt.x,this.midY+pt.y,4,0,2*Math.PI)
g.fill()
g.strokeStyle='#8af'
g.lineWidth=1
g.beginPath()
let radius=Math.sqrt(pt.x*pt.x+pt.y*pt.y)
g.arc(this.midX,this.midY,radius,0,2*Math.PI)
g.stroke()
if(n==1){g.fillStyle='orange'
g.strokeStyle='orange'
g.beginPath()
g.drawLineArrows(new Point(this.midX,this.midY),new Point(this.midX+pt.x,this.midY+pt.y))
g.stroke()
g.fill()}}}
class Point{constructor(x,y){this.x=x
this.y=y}
setXY(x,y){this.x=x
this.y=y}
rotate(angle){let cosa=Math.cos(angle)
let sina=Math.sin(angle)
let xPos=this.x*cosa+this.y*sina
let yPos=-this.x*sina+this.y*cosa
this.x=xPos
this.y=yPos}}
function playHTML(w){let s=''
s+='<style type="text/css">'
s+='.btn {display: inline-block; position: relative; width:'+w+'px; height:'+w+'px; margin-right:'+w*0.2+'px; padding: .6em; border: 0 solid rgba(208,208,248,1); border-radius: 10em; background: linear-gradient(#fff, #ccf), #c9c5c9; box-shadow: 0 3 4 rgba(0,0,0,.4); }'
s+='.btn:hover {background: linear-gradient(#f5f5f5, #b9b9b9), #c9c5c9; }'
s+='.btn:before, button:after {content: " "; position: absolute; }'
s+='.btn:active {top:'+w*0.05+'px; box-shadow: 0 '+w*0.02+'px '+w*0.03+'px rgba(0,0,0,.4); }'
s+='.play:before {  left: '+w*0.36+'px; top: '+w*0.22+'px; width: 0; height: 0; border: '+w*0.3+'px solid transparent; border-left-width: '+w*0.4+'px; border-left-color: blue;  }'
s+='.play:hover:before {border-left-color: yellow; }'
s+='.pause:before, .pause:after {display: block; left: '+w*0.29+'px; top: '+w*0.28+'px; width: '+w*0.19+'px; height: '+w*0.47+'px; background-color: blue; }'
s+='.pause:after {left: '+w*0.54+'px; }'
s+='.pause:hover:before, .pause:hover:after {background-color: yellow; }'
s+='</style>'
s+='<button id="playBtn" class="btn play" onclick="playToggle()" ></button>'
return s}
function playToggle(){let btn='playBtn'
if(this.playQ){this.playQ=false
document.getElementById(btn).classList.add('play')
document.getElementById(btn).classList.remove('pause')}else{this.playQ=true
document.getElementById(btn).classList.add('pause')
document.getElementById(btn).classList.remove('play')
animate()}}
CanvasRenderingContext2D.prototype.drawLineArrows=function(pt1,pt2){let g=this
g.moveTo(pt1.x,pt1.y)
g.lineTo(pt2.x,pt2.y)
let ang=Math.atan2(pt2.x-pt1.x,pt2.y-pt1.y)
g.drawArrow(pt1.x,pt1.y,20,2,30,15,ang+Math.PI/2)
g.drawArrow(pt2.x,pt2.y,20,2,30,15,ang-Math.PI/2)}
CanvasRenderingContext2D.prototype.drawArrow=function(x0,y0,totLen,shaftHt,headLen,headHt,angle,sweep,invertQ){let g=this
let pts=[[0,0],[-headLen,-headHt/2],[-headLen+sweep,-shaftHt/2],[-totLen,-shaftHt/2],[-totLen,shaftHt/2],[-headLen+sweep,shaftHt/2],[-headLen,headHt/2],[0,0],]
if(invertQ){pts.push([0,-headHt/2],[-totLen,-headHt/2],[-totLen,headHt/2],[0,headHt/2])}
for(let i=0;i<pts.length;i++){let cosa=Math.cos(-angle)
let sina=Math.sin(-angle)
let xPos=pts[i][0]*cosa+pts[i][1]*sina
let yPos=pts[i][0]*sina-pts[i][1]*cosa
if(i==0){g.moveTo(x0+xPos,y0+yPos)}else{g.lineTo(x0+xPos,y0+yPos)}}}
function docInsert(s){let div=document.createElement('div')
div.innerHTML=s
let script=document.currentScript
script.parentElement.insertBefore(div,script)}
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
let s2=''
s2+={btn:()=>{if(cls.length==0)cls='btn'
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
return s},sld:()=>{s+=lbl.length>0?'<label class="label">'+lbl+' ':''
s+='<input type="range" '+txt+' oninput="'+fn+'" onchange="'+fn+'"'
return s},}[tag]()||''
let tags={btn:{stt:'<div '+(fn.length>0?' onclick="'+fn+'" ':''),cls:'btn',fin:''},can:{stt:'<button onclick="'+fn+'"',cls:'',fin:''},div:{stt:'<div '+(fn.length>0?' onclick="'+fn+'" ':''),cls:'',fin:''},edit:{stt:(lbl.length>0?'<label class="label">'+lbl+' ':'')+'<textarea onkeyup="'+fn+'" onchange="'+fn+'"',cls:'',fin:''},input:{stt:(lbl.length>0?'<label class="label">'+lbl+' ':'')+'<input value="'+txt+'"'+(fn.length>0?'  oninput="'+fn+'" onchange="'+fn+'"':''),cls:'input',fin:''},}
let type=tags[tag]
console.log('type',tag,type)
s+=type.stt
if(cls.length==0)cls=type.cls
if(tag=='div')style+=fn.length>0?' cursor:pointer;':''
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
return s},sld:()=>{let s='>'
if(lbl.length>0)s+='</label>'
if(lbl.length>0)s+='<span id="'+id+'0">0</span>'
return s},}[tag]()||''
s+='\n'
return s.trim()}
init()