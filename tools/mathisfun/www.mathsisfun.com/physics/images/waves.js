let my={}
function init(mode){let version='0.61'
my.type=typeof mode!=='undefined'?mode:'longitudinal'
my.wd=440
my.ht=170
let s=''
s+='<div style="z-index:11;position: absolute; top:5px; left:3px; font: 14px Arial;">'
s+='Wave Type: '
s+=getDropdownHTML(['Longitudinal','Transverse','Both'],'typeChg','typSel')
s+='</div>'
s+='<div style="z-index:11;position: absolute; top:5px; left:190px; font: 14px Arial;">'
s+='Color: '
s+=getDropdownHTML(['Blue','Multi'],'clrChg','clr')
s+='</div>'
s+=wrap({pos:'abs',style:'top:2px; right:1px; z-index: 10;'},playHTML(36))
s+='<div style="position:relative;">'
s+='<canvas id="clock1" style="position: absolute; left: 0px; top: 0px; z-index: 2; border: none;"></canvas>'
s+='</div>'
s+=wrap({cls:'copyrt',pos:'abs',style:'right:1px; top:'+my.ht+'px'},`&copy; 2022 Rod Pierce  v${version}`)
s=wrap({cls:'js',style:'width:'+my.wd+'px;'},s)
docInsert(s)
my.can=new Can('clock1',my.wd,my.ht,2)
my.clrs=[['Blue','#0000FF'],['Red','#FF0000'],['Green','#00cc00'],['Orange','#FFA500'],['Slate Blue','#6A5ACD'],['Lime','#00FF00'],['Spring Green','#00FF7F'],['Teal','#008080'],['Gold','#ffd700'],['Med Purple','#aa00aa'],['Light Blue','#ADD8E6'],['Navy','#000080'],['Purple','#800080'],['Dark SeaGreen','#8FBC8F'],]
my.clrNum=0
this.frame=0
my.nx=31
my.ny=6
my.gap=15
my.clrType='Blue'
ballsMake(5)
my.playQ=true
anim()}
function playHTML(w){let s=''
s+='<style type="text/css">'
s+='.playBtn {display: inline-block; position: relative; width:'+w+'px; height:'+w+'px; margin-right:'+w*0.2+'px; padding: .6em; border: 0 solid rgba(208,208,248,1); border-radius: 10em; background: linear-gradient(#fff, #ccf), #c9c5c9; box-shadow: 0 3 4 rgba(0,0,0,.4); }'
s+='.playBtn:hover {background: linear-gradient(#f5f5f5, #b9b9b9), #c9c5c9; }'
s+='.playBtn:before, button:after {content: " "; position: absolute; }'
s+='.playBtn:active {top:'+w*0.05+'px; box-shadow: 0 '+w*0.02+'px '+w*0.03+'px rgba(0,0,0,.4); }'
s+='.play:before {  left: '+w*0.36+'px; top: '+w*0.22+'px; width: 0; height: 0; border: '+w*0.3+'px solid transparent; border-left-width: '+w*0.4+'px; border-left-color: blue;  }'
s+='.play:hover:before {border-left-color: yellow; }'
s+='.pause:before, .pause:after {display: block; left: '+w*0.29+'px; top: '+w*0.28+'px; width: '+w*0.19+'px; height: '+w*0.47+'px; background-color: blue; }'
s+='.pause:after {left: '+w*0.54+'px; }'
s+='.pause:hover:before, .pause:hover:after {background-color: yellow; }'
s+='</style>'
s+='<button id="playBtn" class="playBtn play" onclick="playToggle()" ></button>'
return s}
function playToggle(){let btn='playBtn'
if(my.playQ){my.playQ=false
document.getElementById(btn).classList.add('play')
document.getElementById(btn).classList.remove('pause')}else{my.playQ=true
document.getElementById(btn).classList.add('pause')
document.getElementById(btn).classList.remove('play')
anim()}}
function ballsMake(radius){my.balls=[]
for(let i=0;i<my.ny;i++){for(let j=0;j<my.nx;j++){let ball=new Ball()
ball.x=j*my.gap-3
ball.y=70+i*my.gap
ball.midx=ball.x
ball.midy=ball.y
ball.radius=radius
switch(my.clrType){case 'blue':ball.clr='blue'
break
case 'multi':my.clrNum=(Math.random()*my.clrs.length)<<0
ball.clr=my.clrs[my.clrNum][1]
break
default:}
my.balls.push(ball)}}}
function ballsMove(){let r=my.gap*0.8
for(let i=0;i<my.balls.length;i++){let ball=my.balls[i]
let a=2*Math.PI*(1-this.frame/100)
switch(my.type){case 'longitudinal':ball.x=ball.midx+Math.sin(a+ball.midx/30)*r
break
case 'transverse':ball.y=ball.midy+Math.sin(a+ball.midx/30)*r
break
case 'both':let cosa=Math.cos(a+ball.midx/30)
let sina=Math.sin(a+ball.midx/30)
ball.x=ball.midx+r*cosa
ball.y=ball.midy+r*sina
break
default:}}}
function ballsDraw(){let g=my.can.g
my.can.clear()
for(let i=0;i<my.balls.length;i++){let ball=my.balls[i]
g.beginPath()
g.fillStyle=ball.clr
g.arc(ball.x,ball.y,ball.radius,0,Math.PI*2,true)
g.fill()
g.closePath()}}
function Ball(){this.x=0
this.y=0
this.midx=0
this.midy=0
this.vx=0
this.vy=0
this.mass=1
this.radius=5
this.clr='blue'
this.clr2='white'}
function anim(){this.frame=++this.frame%100
ballsMove()
ballsDraw()
if(my.playQ)requestAnimationFrame(anim)}
function typeChg(){let div=document.getElementById('typSel')
my.type=div.options[div.selectedIndex].text
my.type=my.type.toLowerCase()
console.log('typeChg',my.type)
restart()}
function clrChg(){let div=document.getElementById('clr')
my.clrType=div.options[div.selectedIndex].text
my.clrType=my.clrType.toLowerCase()
console.log('clrChg',my.clrType)
restart()}
function restart(){ballsMake(5)}
function getDropdownHTML(opts,funcName,id){let s=''
s+='<select id="'+id+'" style="font: 15px Arial; color: #6600cc; background: rgba(200,220,256,0.7); padding: 1px; border-radius: 6px;" onchange="'+funcName+'()" autocomplete="off" >'
for(let i=0;i<opts.length;i++){let idStr=id+i
let chkStr=i==0?'selected':''
s+='<option id="'+idStr+'" value="'+opts[i]+'" style="height:18px;" '+chkStr+' >'+opts[i]+'</option>'}
s+='</select>'
return s}
CanvasRenderingContext2D.prototype.ball=function(ball,x,y){let size=ball.radius
this.beginPath()
this.fillStyle=ball.color
this.arc(x,y,size,0,Math.PI*2,true)
let gradient=this.createRadialGradient(x-size/2,y-size/2,0,x,y,size)
gradient.addColorStop(0,ball.clr2)
gradient.addColorStop(1,ball.clr)
this.fillStyle=gradient
this.fill()
this.closePath()
this.beginPath()
this.arc(x,y,size*0.85,(Math.PI/180)*270,(Math.PI/180)*200,true)
gradient=this.createRadialGradient(x-size*0.99,y-size*0.99,0,x,y,size)
gradient.addColorStop(0,ball.clr2)
gradient.addColorStop(0.99,'transparent')
this.fillStyle=gradient
this.fill()}
my.theme=localStorage.getItem('theme')
my.lineClr=my.theme=='dark'?'white':'black'
my.opts={name:'user'}
function optGet(name){let val=localStorage.getItem(`mif.${name}`)
if(val==null)val=my.opts[name]
return val}
function optSet(name,val){localStorage.setItem(`mif.${name}`,val)
my.opts[name]=val}
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
return '<button onclick="'+fn+'"'},can:()=>'<canvas',div:()=>'<div',edit:()=>{let s=''
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