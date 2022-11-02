let my={}
function init(){this.version='0.87'
let w=getJSQueryVar('w',360)
this.mode=getJSQueryVar('mode','24')
let s=''
s+='<div id="clock" style="position:relative; margin:auto; display:inline-block; text-align:center; ">'
s+='<canvas id="can1" style="width:'+5+'px; height:'+5+'px;"></canvas>'
s+='</div>'
docInsert(s)
let digi=new DigiClock(w,this.mode,'can1')
digi.loop()}
function DigiClock(wd,mode,canName){this.wd=wd
this.mode=mode
if(this.mode=='am'){this.ht=this.wd/2}else{this.ht=this.wd/3}
if(this.mode=='am'){this.numHt=this.wd*0.3}else{this.numHt=this.wd*0.19}
this.numWd=this.numHt*0.45
this.numGap=this.numHt*0.2
this.midX=this.wd/2
this.midY=this.ht/2
this.el=document.getElementById(canName)
this.el.style.backgroundColor='#222'
this.el.style.borderRadius='10px'
this.el.style.border='2px solid black'
let ratio=2
this.el.width=this.wd*ratio
this.el.height=this.ht*ratio
this.el.style.width=this.wd+'px'
this.el.style.height=this.ht+'px'
this.g=this.el.getContext('2d')
this.g.setTransform(ratio,0,0,ratio,0,0)
this.numbers={n0:[1,1,1,0,1,1,1],n1:[0,0,1,0,0,1,0],n2:[1,0,1,1,1,0,1],n3:[1,0,1,1,0,1,1],n4:[0,1,1,1,0,1,0],n5:[1,1,0,1,0,1,1],n6:[0,1,0,1,1,1,1],n7:[1,0,1,0,0,1,0],n8:[1,1,1,1,1,1,1],n9:[1,1,1,1,0,1,1],}
this.update}
DigiClock.prototype.loop=function(){this.update()
requestAnimationFrame(this.loop.bind(this))}
DigiClock.prototype.update=function(){this.g.clearRect(0,0,this.wd,this.ht)
let time=new Date()
let hours=time.getHours().toString()
if(hours==0){hours='12'}else if(hours.length==1){hours='0'+hours}
let minutes=time.getMinutes().toString()
if(minutes.length==1){minutes='0'+minutes}
let seconds=time.getSeconds().toString()
if(seconds.length==1){seconds='0'+seconds}
let timeStr
if(this.mode=='am'){timeStr=hours+minutes}else{timeStr=hours+minutes+seconds}
for(let i=0;i<timeStr.length;i++){this.drawNum(i,this.midX,this.midY,this.numbers['n'+timeStr[i]])}
this.setClr(seconds%2)
this.colon(seconds)}
DigiClock.prototype.drawNum=function(pos,x,y,numArray){let xShift
if(this.mode=='am'){xShift=(pos-3)*this.numWd+this.numGap*pos
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
for(let i=0;i<numArray.length;i++){this.segment(this.midX+xShift-this.numWd*0.2,this.midY-this.numHt/2,numArray[i],i)}}
DigiClock.prototype.segment=function(x,y,onQ,position){this.setClr(onQ)
let startX=x
let startY=y
let m=this.numHt/11
let wd,ht
if(position===0||position===3||position===6){wd=this.numHt/2.75
ht=this.numHt/11}else{wd=this.numHt/11
ht=this.numHt/2.75}
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
DigiClock.prototype.colon=function(s){let height=this.numHt*0.15
let width=height/2
let margin=height/3
let g=this.g
if(s%2){g.fillStyle='rgb(0, 255, 0)'}
if(this.mode=='am'){g.bar(this.midX,this.midY-margin-height,width,height)
g.bar(this.midX,this.midY+margin,width,height)}else{g.bar(this.midX-this.numWd-this.numWd*0.9,this.midY-margin-height,width,height)
g.bar(this.midX-this.numWd-this.numWd*0.9,this.midY+margin,width,height)
g.bar(this.midX+this.numWd+this.numWd*0.75,this.midY+margin,width,height)
g.bar(this.midX+this.numWd+this.numWd*0.75,this.midY-margin-height,width,height)}}
DigiClock.prototype.setClr=function(onQ){let g=this.g
if(onQ){g.shadowColor='rgb(100, 255, 0)'
g.shadowBlur=33
g.fillStyle='rgb(100, 255, 0)'}else{g.shadowBlur=0
g.fillStyle='rgb(50, 50, 0)'}}
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
return s},sld:()=>{s+=lbl.length>0?'<label class="label">'+lbl+' ':''
s+='<input type="range" '+txt+' oninput="'+fn+'" onchange="'+fn+'"'
return s},}[tag]()||''
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
console.log('wrap',s+'\n')
return s.trim()}
init()