let my={}
function init(){let version='0.61'
my.wd=300
my.ht=250
let bdStr=''
my.doneClr='#cde'
my.clrs=['#669','#336']
let curnum=0
let clrN=0
for(let i=0;i<8;i++){bdStr+='<div style="cursor:pointer;cursor:hand; padding:0; margin:0; height:50px;">'
clrN=1-clrN
for(let j=0;j<8;j++){clrN=1-clrN
let clr=my.clrs[clrN]
bdStr+='<div id="cell'+curnum+'" style="border: 1px solid #003; display:inline-block; cursor:pointer;cursor:hand;  width:50px; height:50px;  background-color:'+clr+';" onclick="moveto(this)">'
bdStr+='</div>'
curnum++}
bdStr+='</div>'}
let s=wrap({style:'text-align:center;'},wrap({id:'scoretxt',cls:'large',pos:'dib',style:'left:3px; bottom:3px'}),wrap({tag:'btn',pos:'dib',style:'margin-left:30px',fn:'restart()'},'Restart'),bdStr)
docInsert(s)
my.imgHome=(document.domain=='localhost'?'/mathsisfun':'')+'/games/images/'
my.chgs=[-17,-15,-10,-6,6,10,15,17]
restart()
scoreUpdate()}
function restart(){my.squares=[]
let clrN=0
for(var i=0;i<64;i++){my.squares[i]=false
document.getElementById('cell'+i).innerHTML=''
document.getElementById('cell'+i).style.backgroundColor=my.clrs[clrN]
if((i+1)%8)clrN=1-clrN}
document.getElementById('cell0').innerHTML='<img src="'+my.imgHome+'wn.svg" style="width:50px; height:50px;" >'
document.getElementById('cell0').style.backgroundColor=my.doneClr
my.squares[0]=true
my.oldPos=0
my.score=0
scoreUpdate()}
function moveto(square){let currPos=parseInt(square.id.substr(4))
let validQ=false
for(let i=0;i<my.chgs.length;i++){if(my.oldPos+my.chgs[i]==currPos){validQ=true
break}}
if(validQ){my.score++
document.getElementById('cell'+my.oldPos).innerHTML=' '
document.getElementById('cell'+currPos).innerHTML='<img src="'+my.imgHome+'wn.svg" style="width:50px; height:50px;" >'
document.getElementById('cell'+currPos).style.backgroundColor=my.doneClr
my.oldPos=currPos
my.squares[currPos]=true}
scoreUpdate()}
function scoreUpdate(){let notN=0
for(var i=0;i<64;i++)if(my.squares[i]!=true)notN++
let s='Moves: '+my.score+' ('+notN+' squares left)'
if(notN==0){s='You WIN, in only '+my.score+' moves'}
document.getElementById('scoretxt').innerHTML=s}
function docInsert(s){let div=document.createElement('div')
div.innerHTML=s
let script=document.currentScript
script.parentElement.insertBefore(div,script)}
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