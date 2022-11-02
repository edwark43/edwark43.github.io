let my={}
function init(){let version='0.68'
my.nums=['0','1','2','3','4','5','6','7','8','9']
my.ltrs=['A','B','C','D','E','F']
my.clrs=[['Med Blue','#88aaff'],['Orange','#FFA500'],['Gold','#ffd700'],['Yellow','#ffff00'],['Light Blue','#ADD8ff'],['Blue','#0000cc'],['Red','#FF0000'],['Pink','#FFaaaa'],['Dark Blue','#000066'],]
my.games=[{mode:'3Num',title:'3 Codes: 0 to 9',type:'alpha',codeLen:3,codes:my.nums},{mode:'4Num',title:'4 Codes: 0 to 9',type:'alpha',codeLen:4,codes:my.nums},{mode:'5Num',title:'5 Codes: 0 to 9',type:'alpha',codeLen:5,codes:my.nums},{mode:'3A2F',title:'3 Codes: A to F',type:'alpha',codeLen:3,codes:my.ltrs},{mode:'4A2F',title:'4 Codes: A to F',type:'alpha',codeLen:4,codes:my.ltrs},{mode:'5A2F',title:'5 Codes: A to F',type:'alpha',codeLen:5,codes:my.ltrs},{mode:'3Clr',title:'3 out of 9 Colors',type:'clr',codeLen:3,codes:my.clrs},{mode:'4Clr',title:'4 out of 9 Colors',type:'clr',codeLen:4,codes:my.clrs},{mode:'5Clr',title:'5 out of 9 Colors',type:'clr',codeLen:5,codes:my.clrs},]
my.keybdQ=false
my.imgHome=(document.domain=='localhost'?'/mathsisfun':'')+'/images/style/'
let w=380
let h=300
let s=''
s+='<style>'
s+='.code { display:inline-block; width:22px; height:26px; font:20px Verdana; background-color: #def; margin:3px 5px; border: 1px solid white; user-select: none; }'
s+='.bull { display:inline-block; width:50px; color:darkgreen; margin:3px; border: none; }'
s+='.cow { display:inline-block; width:50px; color:blue; margin:3px; border: none; }'
s+='.keybd { text-align: center; margin-bottom:0.9em; }'
s+=`.key { display:inline-block; width:2em;  border-radius: .25em; padding:0.05em; margin:0.1em; cursor:pointer; user-select: none;
        background-color: hsl(200, 20%, calc(var(--light-chg, 0%) + var(--light, 60%)));}`
s+='.key:hover, .key:focus { --light-chg: 20%; }'
s+='</style>'
s+='<div id="rows" style="position:relative; width:360px; z-index:2; text-align: center; margin-bottom:30px; transition: 0.5s all;"></div>'
s+='<div id="keybd"></div>'
s+='<input type="button" class="btn"  style="z-index:2; position:relative; width:85px;" value="New Game" onclick="gameNew()"/>'
s+='<input type="button" class="btn"  style="z-index:2; position:relative; width:85px;" value="Give Up" onclick="giveUp()"/>'
s+='<input type="button" class="btn"  style="z-index:2; position:relative; width:85px;" value="Options" onclick="options()"/>'
s+='<div id="ansBox" class="arrowTop" style="position: absolute; left: 50px; top: 6px; z-index:3;"></div>'
s+=popHTML()
s+=wrap({cls:'copyrt',style:'margin-top:3px;'},`&copy; 2022 Rod Pierce  v${version}`)
s=wrap({cls:'js',style:'width:'+w+'px; min-height:'+h+'px;'},s)
docInsert(s)
window.addEventListener('keydown',key,false)
my.inGameQ=false
gameChg(1)}
function key(ev){if(!my.inGameQ)return
let keyCode=ev.keyCode
switch(keyCode){case 37:rowCurr().moveSel(-1)
update()
ev.preventDefault()
break
case 39:rowCurr().moveSel(1)
update()
ev.preventDefault()
break
case 38:rowCurr().incr(1)
update()
ev.preventDefault()
break
case 40:rowCurr().incr(-1)
update()
ev.preventDefault()
break
default:}
if(keyCode==9||keyCode==13||keyCode==32){}
if(keyCode>=96&&keyCode<=105){rowCurr().setVal(keyCode-96)}
if(keyCode>=48&&keyCode<=57){rowCurr().setVal(keyCode-48)}}
function options(){optpop()}
function optpop(){let pop=document.getElementById('optpop')
pop.style.transitionDuration='0.3s'
pop.style.opacity=1
pop.style.zIndex=12
pop.style.left='10px'}
function popYes(){let pop=document.getElementById('optpop')
pop.style.opacity=0
pop.style.zIndex=1
pop.style.left='-500px'}
function popNo(){let pop=document.getElementById('optpop')
pop.style.opacity=0
pop.style.zIndex=1
pop.style.left='-500px'}
function popHTML(){let s=''
s+='<div id="optpop" style="position:absolute; left:-450px; top:10px; width:380px; padding: 5px; border-radius: 9px; background-color: '+my.cellBgClr+'; box-shadow: 10px 10px 5px 0px rgba(40,40,40,0.75); transition: all linear 0.3s; opacity:0; text-align: center; ">'
s+=radioHTML('','game',my.games,'gameChg',1)
s+='<div style="float:right; margin: 0 0 5px 10px;">'
s+='<button onclick="popYes()" style="z-index:2; font: 22px Arial;" class="btn" >&#x2714;</button>'
s+='<button onclick="popNo()" style="z-index:2; font: 22px Arial;" class="btn" >&#x2718;</button>'
s+='</div>'
s+='</div>'
return s}
function radioHTML(prompt,id,lbls,func,n){let s=''
s+='<div style="display:inline-block; border: 1px solid white; border-radius:5px; padding:3px; margin:3px; background-color:rgba(255,255,255,0.5);">'
s+=prompt
for(let i=0;i<lbls.length;i++){let lbl=lbls[i]
let idi=id+i
let chkStr=i==n?' checked ':''
s+='<input id="'+idi+'" type="radio" name="'+id+'" value="'+lbl.title+'" onclick="'+func+'('+i+');" autocomplete="off" '+chkStr+' >'
s+='<label for="'+idi+'">'+lbl.title+' </label>'
s+='<br>'}
s+='</div>'
return s}
function gameChg(n){my.game=my.games[n]
gameNew()}
function gameNew(){let attempt=0
let count
do{my.codes=shuffle(my.game.codes.slice()).slice(0,my.game.codeLen)
my.rows=[]
my.rows.push(new Row('hidden',my.game.codeLen,my.codes))
rowAdd()
count=countBovine(my.codes,rowCurr().codes)}while(count.bulls*2+count.cows>=my.game.codeLen&&attempt++<10)
document.getElementById('keybd').innerHTML=keybdHTML()
update()
my.inGameQ=true}
function update(){let s=''
for(let i=0;i<my.rows.length;i++){let row=my.rows[i]
s+=row.html()}
document.getElementById('rows').innerHTML=s}
function shuffle(array){let counter=array.length
while(counter>0){let index=Math.floor(Math.random()*counter)
counter--
let temp=array[counter]
array[counter]=array[index]
array[index]=temp}
return array}
function chg(col){rowCurr().sel(col)
if(my.keybdQ){}else{rowCurr().incr(1)}
update()}
function hasDups(a){let t=a.concat().sort()
for(let i=1;i<t.length;i++){if(t[i]==t[i-1])return true}
return false}
function giveUp(){my.rows[0].hideQ=false
if(my.rows.length>1)my.rows.pop()
update()}
function guess(){let row=rowCurr()
if(hasDups(row.codes)){document.getElementById('info').innerHTML='Duplicates'
return}
let count=row.guess()
if(count==my.game.codeLen){console.log('success!')
success()}else{row.type='done'
rowAdd()}
update()}
function success(){my.inGameQ=false
my.rows[0].hideQ=false
rowCurr().type='done'
my.rows.push(new Row('success',my.game.codeLen,[]))
update()}
function keybdHTML(){let s=''
let anss=my.game.codes
let rowN=parseInt(anss.length/3+0.99)
let n=0
s+='<div class="keybd" style="">'
for(let j=0;j<anss.length;j++){let id=anss[n]
if(my.game.type=='clr'){s+='<div id="'+id+'" class="key" style="background-color: '+my.clrs[j][1]+';" onmousedown="keybdClick('+n+')">'
s+='&nbsp;'}else{s+='<div id="'+id+'" class="key" style="" onmousedown="keybdClick('+n+')">'
let ans=anss[n]
if(ans=='?')ans='&nbsp;'
s+=ans}
s+='</div>'
n++}
s+='</div>'
return s}
function keybdClick(n){console.log('keybdClick',n,rowCurr())
rowCurr().setVal(n)}
function rowAdd(){console.log('rowAdd')
let codes=[]
if(my.rows.length<2){codes=my.game.codes.slice()}else{codes=rowCurr().codes}
my.rows.push(new Row('input',my.game.codeLen,codes))}
function rowCurr(){return my.rows[my.rows.length-1]}
class Row{constructor(type,n,codes){this.type=type
this.n=n
this.bulls=0
this.cows=0
this.col=0
this.hideQ=false
switch(type){case 'hidden':this.codes=codes.slice(0,n)
this.bulls='Bulls'
this.cows='Cows'
this.hideQ=true
break
case 'input':this.codes=codes.slice(0,n)
break
default:}}
setVal(n){this.codes[this.col]=my.game.codes[n]
this.col++
if(this.col>=this.n)this.col=0
update()}
sel(n){this.col=n
if(this.col>=this.n)this.col=0
if(this.col<0)this.col=this.n-1}
moveSel(n){this.col+=n
if(this.col>=this.n)this.col=0
if(this.col<0)this.col=this.n-1}
incr(n){if(!my.inGameQ)return
let found=-1
for(let i=0;i<my.game.codes.length;i++){if(this.codes[this.col]==my.game.codes[i]){found=i
break}}
found+=n
if(found>my.game.codes.length-1)found=0
if(found<0)found=my.game.codes.length-1
this.codes[this.col]=my.game.codes[found]}
guess(){let count=countBovine(my.codes,this.codes)
this.bulls=count.bulls
this.cows=count.cows
return count.bulls}
html(){let s=''
if(this.type=='success'){s+='<div id="row" style="position:relative; width:360px; height:60px; z-index:2;  background-color: hsla(60,100%,50%,0.1);  text-align: center; border-radius:15px; ">'
s+='<div style="display:inline-block; font: bold 25px Arial; color:gold; margin-right:10px; ">'
s+='Well Done !'
s+='</div>'
s+='<div style="display:inline-block; vertical-align:middle;  ">'
s+='<img src="'+my.imgHome+'tick.png">'
s+='</div>'
s+='</div>'
return s}
s+='<div id="row" style="position:relative; width:360px; height:35px; z-index:2;  background-color:'+my.rowBgClr+'; text-align: center; border: 2px outset hsla(240,10%,90%,0.2); border-radius:15px; ">'
s+='<div id="left" style="display:inline-block; width:180px; font: bold 18px Verdana; text-align: center; ">'
for(let i=0;i<this.n;i++){let code=this.codes[i]
switch(this.type){case 'hidden':s+=this.cellHTML(code,-1)
break
case 'done':s+=this.cellHTML(code,-1)
break
case 'input':s+=this.cellHTML(code,i)
break
default:}}
s+='</div>'
s+='<div id="right" style="display:inline-block; width:160px; text-align: center; font: 18px Verdana; ">'
switch(this.type){case 'hidden':s+='<div class="bull" style="">'
s+=this.bulls
s+='</div>'
s+='<div class="cow" style="">'
s+=this.cows
s+='</div>'
break
case 'done':s+='<div class="bull" style="">'
s+=this.bulls
s+='</div>'
s+='<div class="cow" style="">'
s+=this.cows
s+='</div>'
break
case 'input':s+='<input id="optBtn" type="button" class="btn" style="text-align:left" value="Go" onclick="guess()" />'
s+='<span id="info" style="display:inline-block; font: 16px Verdana; margin:3px 6px;"</span>'
break
default:}
s+='</div>'
s+='</div>'
return s}
cellHTML(code,n){let s=''
switch(my.game.type){case 'alpha':if(n>=0){let clr=n==this.col?my.cellHiClr:my.cellBDrClr
s+='<div class="code" style="background-color: '+my.cellBgHiClr+'; color: '+my.cellFgClr+'; border: 1px solid '+clr+'; cursor:pointer;" onmousedown="chg('+n+')">'}else{s+='<div class="code" style="background-color: '+my.cellBgClr+'; color: '+my.cellFgClr+'; border: 1px solid '+my.cellBDrClr+'; ">'}
s+=this.hideQ?'?':code
s+='</div>'
break
case 'clr':if(n>=0){let clr=n==this.col?my.cellHiClr:my.cellBDrClr
s+='<div class="code" style="border: 1px solid '+clr+'; cursor:pointer; background-color:'+code[1]+';" onclick="chg('+n+')">'}else{if(this.hideQ){s+='<div class="code" style="background-color:white;">'}else{s+='<div class="code" style="background-color:'+code[1]+';">'}}
s+='&nbsp;'
s+='</div>'
break
default:}
return s}}
function countBovine(master,guess){let count={bulls:0,cows:0}
let g=guess.join('')
for(let i=0;i<master.length;i++){let digPresent=g.search(master[i])!=-1
if(master[i]==guess[i])count.bulls++
else if(digPresent)count.cows++}
return count}
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
if(my.theme=='dark'){my.rowBgClr='hsla(60,100%,2%,1)'
my.cellBgClr='hsla(60,100%,12%,1)'
my.cellBgHiClr='hsla(60,100%,18%,1)'
my.cellFgClr='yellow'
my.cellBDrClr='black'
my.cellHiClr='gold'}else{my.rowBgClr='hsla(60,100%,92%,1)'
my.cellBgClr='hsla(240,100%,90%,1)'
my.cellBgHiClr='hsla(60,100%,82%,1)'
my.cellFgClr='black'
my.cellBDrClr='gold'
my.cellHiClr='black'}}
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