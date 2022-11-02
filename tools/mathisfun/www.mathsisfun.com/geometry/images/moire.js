let my={}
function init(){let version='0.84'
my.wd=300
my.ht=my.wd
my.sz=250
my.alps=[0.1,0.25,0.5,0.75,1]
my.thks=[1,3,6,9,18,40]
my.clrs=[['Black','#000000'],['White','#ffffff'],['Blue','#0000FF'],['Red','#FF0000'],['Green','#00cc00'],['Violet','#EE82EE'],['Orange','#FFA500'],['Light Salmon','#FFA07A'],['Slate Blue','#6A5ACD'],['Yellow','#FFFF00'],['Aquamarine','#7FFFD4'],['Pink','#FFC0CB'],['Coral','#FF7F50'],['Lime','#00FF00'],['Pale Green','#98FB98'],['Spring Green','#00FF7F'],['Teal','#008080'],['Hot Pink','#FF69B4'],['Aqua','#00ffff'],['Gold','#ffd700'],['Khaki','#F0E68C'],['Thistle','#D8BFD8'],['Med Purple','#aa00aa'],['Light Blue','#ADD8E6'],['Sky Blue','#87CEEB'],['Navy','#000080'],['Purple','#800080'],['Wheat','#F5DEB3'],['Tan','#D2B48C'],['Antique White','#FAEBD7'],['Silver','#C0C0C0'],]
my.presets=[['Doubled',[20,2],[40,-2],[60,2],[80,3]],['Yarn',[61,1],[122,-1.23],[0,0],[0,0]],['Cardioid',[120,1],[60,2],[0,0],[0,0]],['Astroid',[90,1],[30,-3],[0,0],[0,0]],['4 Petals',[90,1],[90,-3],[0,0],[0,0]],['Straight Line',[90,1],[90,-1],[0,0],[0,0]],['Ellipse',[30,1],[90,-1],[0,0],[0,0]],['Square-ish',[15,3],[101,-1],[0,0],[0,0]],['Spirals',[65,6],[60,6.5],[0,0],[0,0]],]
my.instr='The values are [radius, radiusAdd, radiusMultiply, speed, speedAdd, speedMultiply] for each circle.'
my.txtClr='darkblue'
my.pats=[new Pat('lines','#000000',2,5,140,150),new Pat('lines','#000000',2,5,160,150)]
my.pat=0
my.styles=['lines','grid','circles','radials']
let lt=362
my.bgClr='#def'
let s=''
s+='<div style="position:relative; width:'+(lt+my.wd)+'px; height:'+my.ht+'px; border: none; background-color: '+my.bgClr+'; margin:auto; display:block; ">'
s+='<canvas id="gfx1" style="position: absolute; left:'+lt+'px; z-index: 2; border: none;"></canvas>'
s+='<canvas id="gfx2" style="position: absolute; left:'+lt+'px; z-index: 3; border: none;"></canvas>'
s+='<div id="options" style="position: absolute; width:'+lt+'px; left:0px; top:5px; background-color: '+my.bgClr+'; font: 20px arial; color: black; text-align:center;">'
let lblStyle='display: inline-block; font:15px Arial; width: 80px; text-align: right; margin-right:10px;'
let txtStyle='display: inline-block; width:50px; font: 18px Arial; color: #6600cc; text-align: left;'
s+='<div style="font: 20px arial; ">'
let temp=[]
for(let i=0;i<my.pats.length;i++){temp.push(i+1)}
s+=getRadioHTML('Pattern','pat',temp,'chgPat')
s+='</div>'
s+='<div id="group" style="font: 16px arial; ">'
s+=getRadioHTML('Style','style',my.styles,'chgStyle')
s+='<div style="'+lblStyle+'">Thickness:</div>'
s+='<input type="range" id="r1"  value="3" min="0" max="5" step="0.1"  style="z-index:2; width:200px; height:10px; border: none; " oninput="onSizeChg(0,this.value)" onchange="onSizeChg(1,this.value)" />'
s+='<div id="thk" style="'+txtStyle+'">2</div>'
s+='<br>'
s+='<div style="'+lblStyle+'">Space:</div>'
s+='<input type="range" id="r2"  value="3" min="0" max="5" step="0.1"  style="z-index:2; width:200px; height:10px; border: none; " oninput="onSpcChg(0,this.value)" onchange="onSpcChg(1,this.value)" />'
s+='<div id="spc" style="'+txtStyle+'">2</div>'
s+='<br>'
s+='<div style="visibility:hidden;">'
s+='<div style="'+lblStyle+'">Alpha:</div>'
s+='<input type="range" id="r3"  value="1" min="0" max="1" step="0.01"  style="z-index:2; width:200px; height:10px; border: none; " oninput="onAlpChg(0,this.value)" onchange="onAlpChg(1,this.value)" />'
s+='<div id="alp" style="'+txtStyle+'">2</div>'
s+='</div>'
s+='</div>'
s+='<div style="'+lblStyle+'">Color:</div>'
s+=getClrHTML()
s+='<br>'
s+='<div style="'+lblStyle+'">Speed:</div>'
s+='<input type="range" id="r5"  value="10" min="0" max="20" step=".1"  style="z-index:2; width:200px; height:10px; border: none; " oninput="onSpeedChg(0,this.value)" onchange="onSpeedChg(1,this.value)" />'
s+='<div id="speed" style="'+txtStyle+'">1</div>'
s+='<div id="editpop" style="position:absolute; left:-450px; top:40px; padding: 5px; border: 1px solid red; border-radius: 9px; background-color: #88aaff; box-shadow: 10px 10px 5px 0px rgba(40,40,40,0.75); z-index:1; transition: all linear 0.3s; opacity:0; ">'
s+='<div style="position: relative; width:260px; height:145px; font: 20px arial; color: black; text-align:center;">'
s+='<textarea id="string" style="width: 250px; height: 140px; text-align: center; border-radius: 10px; font: 18px Arial; color: #0000ff; color: blue; background-color: #eeffee; " value="" onKeyUp="chgString()"></textarea>'
s+='</div>'
s+='<div style="position: relative; width:260px; font: 14px arial; color: black; text-align:center;">'
s+=my.instr
s+='</div>'
s+='<div style="float:right; margin: 0 0 5px 10px;">'
s+='<button onclick="editYes()" style="z-index:2; font: 22px Arial;" class="btn" >&#x2714;</button>'
s+='<button onclick="editNo()" style="z-index:2; font: 22px Arial;" class="btn" >&#x2718;</button>'
s+='</div>'
s+='</div>'
s+='</div>'
s+='<div style="position:absolute; right:250px; bottom:-40px;">'
s+=getPlayHTML(36)
s+='</div>'
s+='<button style="font: 16px Arial; position:absolute; right:51px; bottom:-30px;" class="btn"  onclick="canvasSave()" >Save</button>'
s+='<button style="font: 16px Arial; position:absolute; right:1px; bottom:-30px;" class="btn"  onclick="canvasPrint()" >Print</button>'
s+=wrap({cls:'copyrt',pos:'abs',style:'left:5px; bottom:3px'},`&copy; 2022 Rod Pierce  v${version}`)
s+='</div>'
docInsert(s)
my.can=new Can('gfx1',my.wd,my.ht,2)
my.can2=new Can('gfx2',my.wd,my.ht,2)
chgClr(0)
my.mid={x:my.wd/2,y:my.ht/2,}
my.prev={}
my.props=[['radius','rad'],['speed','w'],]
document.getElementById('pat'+0).checked=true
setPat(0)
my.speed=document.getElementById('r5').value
document.getElementById('speed').innerHTML=my.speed
my.playQ=false
togglePlay()}
function Pat(style,clr,thk,spc,x,y){this.style=style
this.clr=clr
this.thk=thk
this.spc=spc
this.alp=1
this.ang=0
this.x=x
this.y=y}
function getRadioHTML(prompt,id,lbls,func){let s=''
s+='<div style="display:inline-block; border: 1px solid white; border-radius:5px; padding:3px; margin:3px; background-color:rgba(255,255,255,0.5);">'
s+=prompt+':'
for(let i=0;i<lbls.length;i++){let idi=id+i
let lbl=lbls[i]
s+='<input id="'+idi+'" type="radio" name="'+id+'" value="'+lbl+'" onclick="'+func+'('+i+');">'
s+='<label for="'+idi+'">'+lbl+' </label>'}
s+='</div>'
return s}
function chgPat(n){console.log('chgPat='+n)
my.pat=n
setPat(my.pat)
drawCircs()}
function setPat(n){console.log('setPat',my.pats[n],my.pats[n].style)
document.getElementById('r1').value=my.pats[n].thk
document.getElementById('thk').innerHTML=document.getElementById('r1').value
document.getElementById('r2').value=my.pats[n].spc
document.getElementById('spc').innerHTML=document.getElementById('r2').value
document.getElementById('r3').value=my.pats[n].alpha
document.getElementById('alp').innerHTML=document.getElementById('r3').value
let styleNo=my.styles.indexOf(my.pats[n].style)
document.getElementById('style'+styleNo).checked=true
let clrNo=my.clrs.map(function(e){return e[1]}).indexOf(my.pats[n].clr)
console.log('clrNo',clrNo)
radioPress(my.clrs,'clr',clrNo)}
function chgStyle(n){console.log('chgStyle='+n)
my.pats[my.pat].style=my.styles[n]}
function onSizeChg(n,v){console.log('onSizeChg='+n,v,my.pat,my.pats)
v=Number(v)
if(v<0.1)v=0.1
my.pats[my.pat].thk=v
drawCircs()
document.getElementById('thk').innerHTML=v}
function onSpcChg(n,v){console.log('onSpcChg='+n,v,my.pat)
v=Number(v)
if(v<0.1)v=0.1
my.pats[my.pat].spc=v
drawCircs()
document.getElementById('spc').innerHTML=v}
function onAlpChg(n,v){console.log('onAlpChg='+n,v,my.pat)
v=Number(v)
my.pats[my.pat].alp=v
drawCircs()
document.getElementById('alp').innerHTML=v}
function onSpeedChg(n,v){console.log('onSpeedChg='+n,v,my.pat)
v=Number(v)
my.speed=v
drawCircs()
document.getElementById('speed').innerHTML=v}
function anim(){if(my.playQ){drawCircs()
requestAnimationFrame(anim)}}
function drawCircs(){my.can.clear()
my.can2.clear()
let m0=my.pats[0]
let m1=my.pats[1]
m0.ang+=my.speed*0.0005
m1.ang-=my.speed*0.0005
drawWheel(my.can.g,m0)
drawWheel(my.can2.g,m1)}
function drawWheel(g,moire){let style=moire.style
let thick=moire.thk
let space=moire.spc
let rot=moire.ang
g.strokeStyle=moire.clr
g.lineWidth=thick
let both=thick+space
if(both<0.2)return
let lineCount=my.sz/both
switch(style){case 'circles':drawCircles(g,moire.x,moire.y,both,lineCount/2)
break
case 'lines':drawParaLines(g,moire.x,moire.y,my.sz,rot,both,lineCount)
break
case 'grid':drawParaLines(g,moire.x,moire.y,my.sz,rot,both,lineCount)
drawParaLines(g,moire.x,moire.y,my.sz,-Math.PI/2+rot,both,lineCount)
break
case 'radials':drawRadials(g,moire.x,moire.y,rot,both)
break
default:}}
function drawCircles(g,x,y,space,lineCount){for(let i=0;i<lineCount;i++){g.beginPath()
g.arc(x,y,(i+1)*space,0,2*Math.PI)
g.stroke()}}
function drawRadials(g,x,y,rot,space){space=space-(360%space)/space
if(space<1)return
for(let i=0;i<360;i+=space){g.beginPath()
g.moveTo(x,y)
g.lineTo(x+(Math.sin(rot+(i*Math.PI)/180)*my.sz)/2,y+(Math.cos(rot+(i*Math.PI)/180)*my.sz)/2)
g.stroke()}}
function drawParaLines(g,x,y,wd,angle,space,n){g.beginPath()
let p
for(let i=0;i<=n;i++){p=rotPt(new Pt(i*space-wd/2,wd/2),angle)
g.moveTo(x+p.x,y+p.y)
p=rotPt(new Pt(i*space-wd/2,-wd/2),angle)
g.lineTo(x+p.x,y+p.y)}
g.stroke()}
function rotPt(p,angle){let cosa=Math.cos(-angle)
let sina=Math.sin(-angle)
return new Pt(p.x*cosa+p.y*sina,p.x*sina-p.y*cosa)}
function randSpiral(){my.circs=[]
let circN=3
let tgtSize=my.wd/2-20
for(let i=0;i<circN;i++){let size=(Math.random()*Math.min(my.wd/circN,tgtSize))<<0
if(i==circN-1){size=tgtSize}else{tgtSize-=size}
let speed=((Math.random()*60-30)<<0)/10
if(speed==0)speed=0.1
my.circs.push(new Circ(size,speed))}
for(let i=circN;i<4;i++){my.circs.push(new Circ(0,0))}
clear2()
let div=document.getElementById('table')
div.innerHTML=getPresetHTML()
updateString()}
function chgPreset(){console.log('chgPreset')
let div=document.getElementById('presets')
let s=div.options[div.selectedIndex].text
choosePreset(div.selectedIndex)
console.log('presets',s)}
function toggleBtn(btn,onq){if(onq){document.getElementById(btn).classList.add('hi')
document.getElementById(btn).classList.remove('lo')}else{document.getElementById(btn).classList.add('lo')
document.getElementById(btn).classList.remove('hi')}}
function chgVal(i,j,val){let circ=my.circs[i]
console.log('chgVala',i,j,val,circ)
circ[my.props[j][1]]=parseFloat(val)
updateString()}
function clear2(){console.log('clear2')
g2.clearRect(0,0,el2.width,el2.height)
g2.beginPath()
my.prev=[]}
function go(){my.frames=0
anim()}
function getClrHTML(){let s=''
s+='<div style="width:320px; text-align:center; overflow: hidden; word-wrap: break-word; z-index:20;">'
for(let i=0;i<my.clrs.length;i++){let clr=my.clrs[i]
s+='<button  id="clr'+i+'" style="float:left; width:40px; height:30px; background-color:'+clr[1]+'; border: 2px inset white; border-radius: 6px; padding:0; font: 11px Arial; overflow: hidden; cursor: pointer;" onclick="chgClr('+i+')" >'+clr[0]+'</button>'}
s+='</div>'
return s}
function getDropdownHTML(opts,funcName,id){let s=''
s+='<select id="'+id+'" style="font: 13px Arial; color: #6600cc; background: rgba(200,220,256,0.7); padding: 1px; border-radius: 6px;" onchange="'+funcName+'()" autocomplete="off">'
for(let i=0;i<opts.length;i++){let idStr=id+i
let chkStr=i==0?'selected':''
s+='<option id="'+idStr+'" value="'+opts[i][0]+'" style="height:18px;" '+chkStr+' >'+opts[i][0]+'</option>'}
s+='</select>'
return s}
function getPlayHTML(w){let s=''
s+='<style type="text/css">'
s+='.circbtn {display: inline-block; position: relative; width:'+w+'px; height:'+w+'px; margin-right:'+w*0.2+'px; padding: .6em; border: 0 solid rgba(208,208,248,1); border-radius: 10em; background: linear-gradient(#fff, #ccf), #c9c5c9; box-shadow: 0 3 4 rgba(0,0,0,.4); }'
s+='.circbtn:hover {background: linear-gradient(#f5f5f5, #b9b9b9), #c9c5c9; }'
s+='.circbtn:before, button:after {content: " "; position: absolute; }'
s+='.circbtn:active {top:'+w*0.05+'px; box-shadow: 0 '+w*0.02+'px '+w*0.03+'px rgba(0,0,0,.4); }'
s+='.play:before {  left: '+w*0.36+'px; top: '+w*0.22+'px; width: 0; height: 0; border: '+w*0.3+'px solid transparent; border-left-width: '+w*0.4+'px; border-left-color: blue;  }'
s+='.play:hover:before {border-left-color: yellow; }'
s+='.pause:before, .pause:after {display: block; left: '+w*0.29+'px; top: '+w*0.28+'px; width: '+w*0.19+'px; height: '+w*0.47+'px; background-color: blue; }'
s+='.pause:after {left: '+w*0.54+'px; }'
s+='.pause:hover:before, .pause:hover:after {background-color: yellow; }'
s+='</style>'
s+='<button id="playBtn" class="circbtn play" onclick="togglePlay()" ></button>'
return s}
function togglePlay(){let btn='playBtn'
if(my.playQ){my.playQ=false
document.getElementById(btn).classList.add('play')
document.getElementById(btn).classList.remove('pause')}else{my.playQ=true
document.getElementById(btn).classList.add('pause')
document.getElementById(btn).classList.remove('play')
anim()}
if(my.colNo<my.colMax)my.cols[my.colNo].anim()}
function chgClr(n){my.pats[my.pat].clr=my.clrs[n][1]
console.log('chgClr='+n)
radioPress(my.clrs,'clr',n)}
function radioPress(vals,id,n){for(let i=0;i<vals.length;i++){let div=document.getElementById(id+i)
if(i==n){div.style.borderStyle='inset'}else{div.style.borderStyle='outset'}}}
function keyOver(t,n){let div=document.getElementById(t+n)
div.style.background='yellow'}
function keyOut(t,n){let div=document.getElementById(t+n)
div.style.background='#fed'}
function convertHexClr(hex,opacity){hex=hex.replace('#','')
let r=parseInt(hex.substring(0,2),16)
let g=parseInt(hex.substring(2,4),16)
let b=parseInt(hex.substring(4,6),16)
return 'rgba('+r+','+g+','+b+','+opacity+')'}
function editpop(){console.log('editpop')
let pop=document.getElementById('editpop')
pop.style.transitionDuration='0.3s'
pop.style.opacity=1
pop.style.zIndex=12
pop.style.left='100px'}
function editYes(){let pop=document.getElementById('editpop')
pop.style.opacity=0
pop.style.zIndex=1
pop.style.left='-500px'
console.log('editYes',my.fn)
chgString()
clear2()}
function editNo(){let pop=document.getElementById('editpop')
pop.style.opacity=0
pop.style.zIndex=1
pop.style.left='-500px'}
function canvasAdd(can1,can2){let ctx1=can1.getContext('2d')
let ctx2=can2.getContext('2d')
let can3=document.createElement('canvas')
let ratio=2
can3.width=my.wd*ratio
can3.height=my.ht*ratio
can3.style.width=my.wd+'px'
can3.style.height=my.ht+'px'
let ctx3=can3.getContext('2d')
ctx3.drawImage(can1,0,0)
ctx3.drawImage(can2,0,0)
return can3}
function canvasSave(typ){typ=typ==undefined?'png':typ
if(typ=='jpg')typ='jpeg'
let can=canvasAdd(document.getElementById('gfx1'),document.getElementById('gfx2'))
let dataUrl=can.toDataURL('image/'+typ)
let win=window.open()
win.document.write("<img src='"+dataUrl+"'/>")
win.document.location='#'}
function canvasPrint(){let can=canvasAdd(document.getElementById('gfx1'),document.getElementById('gfx2'))
let dataUrl=can.toDataURL('image/png')
let win=window.open()
win.document.write("<img src='"+dataUrl+"'/>")
win.document.location='#'
win.setTimeout(function(){win.focus()
win.print()},500)}
function Clr(rr,gg,bb){this.clrs=[rr<<0,gg<<0,bb<<0]
this.dirs=[1,1,1]}
Clr.prototype.rand=function(){for(let i=0;i<3;i++){this.clrs[i]=(Math.random()*256)<<0}}
Clr.prototype.getHex=function(){let s='#'+hex2(this.clrs[0])+hex2(this.clrs[1])+hex2(this.clrs[2])
return s}
Clr.prototype.setHex=function(clr){let result=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(clr)
this.clrs=result?[parseInt(result[1],16),parseInt(result[2],16),parseInt(result[3],16)]:null}
Clr.prototype.randChg=function(){for(let i=0;i<3;i++){if(Math.random()<0.01)this.dirs[i]*=-1
if(this.clrs[i]>=255)this.dirs[i]=-1
if(this.clrs[i]<=0)this.dirs[i]=1
this.clrs[i]+=this.dirs[i]}}
function hex2(n){let s=n.toString(16)
if(s.length==1)s='0'+s
return s}
function Pt(ix,iy){this.x=ix
this.y=iy
this.rad=9
this.color='lightblue'}
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