var w,h,my={}
function init(){my.version='0.82'
w=490
h=120
my.sliderWd=430
var s=wrap({cls:'js'},'<div style="position:relative; width:'+w+'px; height:'+h+'px; border: none;  margin:auto; display:block;">','<canvas id="canvasId" width="'+w+'" height="'+h+'" style="z-index:1; border-radius:10px;"></canvas>','<div id="24hr" style="font-size: 13pt; color: #000000; position:absolute; top:15px; left:25px; text-align:center;">24 Hour</div>','<div id="ampm" style="font-size: 13pt; color: #000000; position:absolute; top:84px; left:25px; text-align:center;">AM/PM</div>','<input type="range" id="r1"  value="168" min="0" max="288" step="1" style="z-index:2; position:absolute; top:50px; left:20px; width:'+my.sliderWd+'px; height:17px; border: none;"  oninput="update()" onchange="update()" />',wrap({id:'val1',tag:'out',pos:'abs',style:'top:9px; left:30px;'}),wrap({id:'val2',tag:'out',pos:'abs',style:'top:79px; left:30px;'}))
docInsert(s)
my.can=new Can('canvasId',w,h,3)
update()}
function update(){var timeEl=document.getElementById('r1')
var timeVal=Number(timeEl.value)
var hr=parseInt(timeVal/12)
var mn=(timeVal-hr*12)*5
if(mn<10)mn='0'+mn
if(hr==24){hr=0}
var valEl=document.getElementById('val1')
var xpos=timeVal*(my.sliderWd/288)-10
xpos=Math.max(xpos,0)
xpos=Math.min(xpos,my.sliderWd-30)
valEl.style.left=xpos+'px'
var str24=hr+':'+mn
if(hr<10){str24='0'+hr+':'+mn}
valEl.innerHTML=str24
var ampmEl=document.getElementById('val2')
var ampm=''
if(hr==0){ampm='12:'+mn+' AM'
if(mn==0)ampm='12 Midnight'}
if(hr>0&&hr<12){ampm=hr+':'+mn+' AM'}
if(hr==12){ampm='12:'+mn+' PM'
if(mn==0)ampm='12 Noon'}
if(hr>12){ampm=hr-12+':'+mn+' PM'}
ampmEl.style.left=xpos-10+'px'
ampmEl.innerHTML=ampm
var ratio=timeVal/288
let clr=[255,255,220]
if(ratio<0.15){clr=[0,0,50]}
if(ratio>=0.15&&ratio<0.35){clr=gradientClr([0,0,50],[255,255,220],(ratio-0.15)*5)}
if(ratio>=0.7&&ratio<0.9){clr=gradientClr([255,255,220],[0,0,50],(ratio-0.7)*5)}
if(ratio>=0.9){clr=[0,0,50]}
let g=my.can.g
g.fillStyle='rgba('+clr[0]+','+clr[1]+','+clr[2]+',1)'
g.rect(0,0,g.canvas.width,120)
g.fill()
var txtClr='#000000'
if(clr[0]<70){txtClr='#ffffff'}
document.getElementById('24hr').style.color=txtClr
document.getElementById('ampm').style.color=txtClr}
function gradientClr(fromClr,toClr,ratio){return[parseInt(ratio*toClr[0]+(1-ratio)*fromClr[0]),parseInt(ratio*toClr[1]+(1-ratio)*fromClr[1]),parseInt(ratio*toClr[2]+(1-ratio)*fromClr[2])]}
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
return s},out:()=>{if(cls.length==0)cls='output'
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