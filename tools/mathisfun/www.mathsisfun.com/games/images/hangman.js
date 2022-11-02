var w,h,my={};function hangmanMain(){let version='0.52';w=360;h=430;my.activeQ=true
my.bdSz=9
my.score=0
my.opt={dict:'math'}
my.apples=[{id:"apple0",x:74,y:111},{id:"apple1",x:81,y:49},{id:"apple2",x:110,y:89},{id:"apple4",x:155,y:78},{id:"apple5",x:183,y:58},{id:"apple6",x:215,y:52},{id:"apple7",x:242,y:92},{id:"apple8",x:264,y:115},{id:"apple10",x:310,y:88}]
my.alphas=[]
for(let i=0;i<26;i++){my.alphas.push(String.fromCharCode(65+i))}
my.wordStr='angle,area,Apex,Calculate,centimetre,Circle,Cone,decimal,degrees,diameter,Digit,equation,equilateral,Estimate,factor,Fraction,Hexagon,integer,isosceles,litre,multiple,negative,Pentagon,positive,prime,Prism,quotient,radius,Random,Spiral,times,Volume,Zero'
my.dicts={math:{name:'Mathematics',type:'file',url:'math-large.txt',words:''},measure:{name:'Measurement',type:'file',url:'measure.txt',words:''},time:{name:'Time',type:'file',url:'time.txt',words:''},seasons:{name:'Seasons',type:'file',url:'seasons.txt',words:''},money:{name:'Money',type:'file',url:'money.txt',words:''},shapes:{name:'Shapes',type:'file',url:'shapes.txt',words:''},comp:{name:'Computers',type:'file',url:'computers.txt',words:''},energy:{name:'Energy',type:'file',url:'energy.txt',words:''},elements:{name:'Elements',type:'file',url:'elements.txt',words:''},science:{name:'Science',type:'file',url:'science.txt',words:''},plants:{name:'Plants',type:'file',url:'plants.txt',words:''},happy:{name:'Happy',type:'file',url:'happy.txt',words:''},positive:{name:'Positive',type:'file',url:'positive.txt',words:''},dogs:{name:'Dogs',type:'file',url:'dogs.txt',words:''},pals:{name:'Palindromes',type:'file',url:'palindromes.txt',words:''},country:{name:'Countries',type:'file',url:'country.txt',words:''},adjectives:{name:'Adjectives',type:'file',url:'adjectives.txt',words:''},adverbs:{name:'Adverbs',type:'file',url:'adverbs.txt',words:''},verbs:{name:'Verbs',type:'file',url:'verbs.txt',words:''},preps:{name:'Prepositions',type:'file',url:'prepositions.txt',words:''},prons:{name:'Pronouns',type:'file',url:'pronouns.txt',words:''},cons:{name:'Conjunctions',type:'file',url:'conjunctions.txt',words:''},}
my.fmts=[{name:'play',border:'4px solid white',bg:'linear-gradient(to bottom right, rgba(156,175,251,0.5) 0%, rgba(255,255,255,0.5) 40%, rgba(156,175,241,0.5) 100%)'},{name:'win',border:'4px solid gold',bg:'#ffc'},{name:'win2',border:'4px solid white',bg:'#ffe'},{name:'fail',border:'4px solid grey',bg:'#888'},]
var s='';s+='<style>'
s+='.btn { display: inline-block; position: relative; text-align: center; margin: 2px; text-decoration: none; font: 15px/25px Arial, sans-serif; color: #268; border: 1px solid #88aaff; border-radius: 10px;cursor: pointer; background: linear-gradient(to top right, rgba(170,190,255,1) 0%, rgba(255,255,255,1) 100%); outline-style:none;}'
s+='.btn:hover { background: linear-gradient(to top, rgba(255,255,0,1) 0%, rgba(255,255,255,1) 100%); }'
s+='.yy { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(255,220,130,1) 0%, rgba(255,255,255,1) 100%);  }'
s+='.hi { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(130,220,255,1) 0%, rgba(255,255,255,1) 100%); box-shadow: 2px 2px 6px #66a; }'
s+='.lo { border: solid 1px #888888; background: linear-gradient(to top, rgba(170,170,170,1) 0%, rgba(205,205,205,1) 100%);  }'
s+='</style>'
my.imgHome=(document.domain=='localhost')?'/mathsisfun/images/':'/images/'
my.sndHome=(document.domain=='localhost')?'/mathsisfun/images/sounds/':'/images/sounds/'
s+='<audio id="sndNew" src="'+my.sndHome+'click4.mp3" preload="auto"></audio>'
s+='<audio id="sndYes" src="'+my.sndHome+'yes2.mp3" preload="auto"></audio>';s+='<audio id="sndNo" src="'+my.sndHome+'drop.mp3" preload="auto"></audio>';s+='<audio id="sndWin" src="'+my.sndHome+'fanfare.mp3" preload="auto"></audio>';s+='<audio id="sndFail" src="'+my.sndHome+'fail.mp3" preload="auto"></audio>';my.snds=[];s+='<div id="main" style="position:relative; width:'+w+'px; min-height:'+h+'px;  margin:auto; display:block; background: #ffe;  border-radius: 10px;">';s+='<div id="top" style="font: 24px Arial; text-align:center; margin-top:3px; height:34px">'
s+='<div id="btns" style="position:absolute; left: 3px; font: 18px Arial;">'
s+='<button id="optBtn" type="button" style="z-index:2;" class="btn" onclick="optPop()">Options</button>'
s+='</div>';s+='<div style="position:absolute; right:0px; ">';s+='<img id="appleTree" src="'+my.imgHome+'apple-tree.svg" />'
s+='</div>';my.apples.map(apple=>{s+=`<img id="${apple.id}" src="${my.imgHome}apple.svg" style="position:absolute; width:40px; height:40px; z-index:3;" />`})
s+='<div style="position:absolute; right:15px; ">';s+='<button id="nextBtn" type="button" style="z-index:2; border: 3px solid blue;" class="btn" onclick="gameNext()">Next</button>'
my.soundQ=true
s+='&nbsp;'
s+=soundBtnHTML()
s+='</div>';s+='<div id="scores" style="position:absolute; right: 3px; font: bold 24px Arial;" onclick="start()">'
s+='</div>'
s+='</div>'
s+='<div id="score" style="font: 30px Arial; text-align:left; margin-left: 7px; margin-top:2px; color: blue;">0</div>'
s+='<div id="msg" style="font: 24px Arial; text-align:center; margin-top:285px;">&nbsp;</div>'
s+='<div id="word" style="position:absolute; left:0; top:170px; width:'+(w-6)+'px; font: 34px Arial;background-color:hsla(240,100%,90%,0.8); padding: 3px; text-align:center; overflow: visible;"></div>';s+='<div id="board" style="position:absolute; top:230px;"></div>';s+=optPopHTML();s+='<div style="font: 11px Arial; color: #bb0; position:absolute; bottom:5px; text-align:center;"> &copy; 2020 MathsIsFun.com  v'+version+'</div>';s+='</div>';document.write(s);my.puzN=0
my.opt.dict=my.dicts.math
gameNew()}
function gameNew(){soundPlay('sndNew')
my.activeQ=true
if(my.opt.dict.words.length==0){dictLoad()
return}
msg(my.opt.dict.name)
var myNode=document.getElementById("board");while(myNode.firstChild){myNode.removeChild(myNode.firstChild);}
my.moveN=0
document.getElementById('nextBtn').style.visibility='hidden'
my.boxWd=36
my.boxHt=my.boxWd
console.log('my',my)
bdDraw()
fmtSet(0)
my.apples.map(apple=>{apple.hangQ=true
apple.div=document.getElementById(apple.id)
apple.div.style.left=apple.x+'px'
apple.div.style.top=apple.y+'px'
apple.div.style.height='40px'
apple.div.style.transition='top 0.4s ease-out, height 0.1s ease-in-out 0.3s'})
let words=parseWords(my.opt.dict.words)
my.word=words[Math.floor(Math.random()*words.length)];my.ltrs=[]
for(let i=0;i<my.word.length;i++){my.ltrs.push({ltr:my.word[i].toUpperCase(),foundQ:false})}
document.getElementById('word').innerHTML=wordFmt()}
function gameNext(){gameNew()}
function msg(s){document.getElementById('msg').innerHTML=s}
function wordFmt(){let s=my.ltrs.reduce((s,ltr)=>{s+=s.length==0?'':'&nbsp;'
s+=ltr.foundQ?ltr.ltr:'_'
return s},'')
return s}
function bdDraw(){my.borderLt=(w-my.bdSz*my.boxWd)/2
my.borderTp=0
let x=my.borderLt
let y=my.borderTp
my.bd=[]
my.alphas.map(alpha=>{var tile=new Tile(my.boxWd,my.boxHt,x,y,alpha)
my.bd.push(tile)
x+=my.boxWd
if(x>w-my.boxWd){x=my.borderLt
y+=my.boxHt}})}
function gameCheck(c){console.log('gameCheck',c)
let blankN=0
let newQ=false
my.ltrs.map(ltr=>{if(ltr.ltr==c){ltr.foundQ=true
newQ=true}
if(!ltr.foundQ){blankN++}})
if(newQ){soundPlay('sndYes')}else{soundPlay('sndNo')
let hangs=my.apples.filter(apple=>apple.hangQ==true)
if(hangs.length>0){let hang=hangs[Math.floor(Math.random()*hangs.length)];console.log('hang',hang)
hang.hangQ=false
hang.div.style.top='400px'
hang.div.style.height='15px'
if(hangs.length==1){soundPlay('sndFail')
my.ltrs.map(ltr=>{ltr.foundQ=true})
document.getElementById('nextBtn').style.visibility='visible'
my.activeQ=false
fmtSet(3)}}}
document.getElementById('word').innerHTML=wordFmt()
console.log('blankN',blankN)
let successQ=blankN==0
if(successQ){console.log('successQ')
let hangs=my.apples.filter(apple=>apple.hangQ==true)
my.score+=hangs.length
document.getElementById('score').innerHTML=my.score
document.getElementById('nextBtn').style.visibility='visible'
soundPlay('sndWin')
fmtSet(1)}else{}}
function fmtSet(n){let fmt=my.fmts[n];console.log('fmtSet',n,fmt)
document.getElementById('main').style.border=fmt.border
document.getElementById('main').style.background=fmt.bg}
function radioHTML(prompt,id,lbls,func){var s='';s+='<div style="display:inline-block; border: 1px solid white; border-radius:5px; padding:3px; margin:3px; background-xnor:rgba(255,255,255,0.5);">';s+=prompt;for(var i=0;i<lbls.length;i++){var lbl=lbls[i];var idi=id+i;var chkStr=(i==0)?' checked ':'';s+='<input id="'+idi+'" type="radio" name="'+id+'" value="'+lbl+'" onclick="'+func+'('+i+');" autocomplete="off" '+chkStr+' >';s+='<label for="'+idi+'">'+lbl+' </label>';}
s+='</div>';return s;}
var seed=1;var seed=+new Date();function random(){var x=Math.sin(seed++)*10000;return x-Math.floor(x);}
function getRandomArbitrary(min,max){return Math.random()*(max-min)+min;}
function getRandomInt(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
function optPopHTML(){var s='';s+='<div id="optpop" style="position:absolute; left:-500px; top:0px; width:360px; padding: 5px; border-radius: 9px; background-color: #bcd; box-shadow: 10px 10px 5px 0px rgba(40,40,40,0.75); transition: all linear 0.3s; opacity:0; text-align: center; ">';s+='<div id="optInside" style="margin: 5px auto 5px auto;">';s+='</div>';s+='<div style="position:relative; margin:auto; text-align:center; font:14px Arial; background-color:lightblue;  margin: 5px 0 1px 0; padding: 5px 0 5px 0;">';s+='<div style="position:relative; margin:auto; text-align:center; font:14px Arial; background-color:lightblue;  margin: 5px 0 1px 0; padding: 5px 0 5px 0;">';s+=radioHTMLa('Words:','dict',my.dicts,'',0);s+='</div>'
s+='</div>'
s+='<div style="float:right; margin: 0 0 5px 10px;">';s+='<button id="optYes" onclick="optYes()" style="z-index:2; font: 22px Arial;" class="togglebtn" >&#x2714;</button>';s+='<button onclick="optNo()" style="z-index:2; font: 22px Arial;" class="togglebtn" >&#x2718;</button>';s+='</div>';s+='</div>';return s;}
function optPop(){var pop=document.getElementById('optpop');pop.style.transitionDuration="0.3s";pop.style.opacity=1;pop.style.zIndex=12;pop.style.left=(w-400)/2+'px';}
function optYes(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-999px';var div=document.querySelector('input[name="'+'dict'+'"]:checked')
my.opt.dict=my.dicts[div.id];gameNew()}
function optNo(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-999px';}
function getDropdownHTML(opts,funcName,id,chkNo){var s='';s+='<select id="'+id+'" style="font: 14px Arial; color: #6600cc; background: white; padding: 1px;line-height:30px; border-radius: 5px;">';for(var i=0;i<opts.length;i++){var idStr=id+i;var chkStr=i==chkNo?'selected':'';s+='<option id="'+idStr+'" value="'+i+'" style="height:21px;" '+chkStr+' >'+'Puzzle '+(i+1)+'</option>';}
s+='</select>';return s;}
function soundBtnHTML(){var onClr='blue'
var offClr='#bbb'
var s=''
s+='<style> '
s+=' .speaker { height: 30px; width: 30px; position: relative; overflow: hidden; display: inline-block; vertical-align:top; } '
s+=' .speaker span { display: block; width: 9px; height: 9px; background-color:'+onClr+'; margin: 10px 0 0 1px; }'
s+=' .speaker span:after { content: ""; position: absolute; width: 0; height: 0; border-style: solid; border-color: transparent '+onClr+' transparent transparent; border-width: 10px 16px 10px 15px; left: -13px; top: 5px; }'
s+=' .speaker span:before { transform: rotate(45deg); border-radius: 0 60px 0 0; content: ""; position: absolute; width: 5px; height: 5px; border-style: double; border-color:'+onClr+'; border-width: 7px 7px 0 0; left: 18px; top: 9px; transition: all 0.2s ease-out; }'
s+=' .speaker:hover span:before { transform: scale(.8) translate(-3px, 0) rotate(42deg); }'
s+=' .speaker.mute span:before { transform: scale(.5) translate(-15px, 0) rotate(36deg); opacity: 0; }'
s+=' .speaker.mute span { background-color:'+offClr+'; }'
s+=' .speaker.mute span:after {border-color: transparent '+offClr+' transparent '+offClr+';}'
s+=' </style>'
s+='<div id="sound" onClick="soundToggle()" class="speaker"><span></span></div>'
return s}
function soundPlay(id,simulQ=true){if(!my.soundQ)return
if(simulQ){if(id.length>0)document.getElementById(id).play()}else{my.snds.push(id)
soundPlayQueue(id)}}
function soundPlayQueue(id){var div=document.getElementById(my.snds[0])
div.play().then(_=>{}).catch(error=>{my.snds.shift();});div.onended=function(){my.snds.shift();if(my.snds.length>0)soundPlayQueue(my.snds[0]);};}
function soundToggle(){var btn='sound'
if(my.soundQ){my.soundQ=false
document.getElementById(btn).classList.add("mute")}else{my.soundQ=true
document.getElementById(btn).classList.remove("mute")}}
class Tile{constructor(wd,ht,lt,tp,txt){this.wd=wd;this.ht=ht;this.txt=txt
this.bgClr='#ffe';this.bdrClr='grey';this.overClr='#dc8'
this.offClr='#fff';this.onClr='#dd0';this.onQ=false
this.hiliteQ=false
var div=document.createElement("div");div.style.width=wd+'px';div.style.height=ht+'px';div.style.position='absolute';div.style.top=tp+'px';div.style.left=lt+'px';this.div=div;var me=this;div.addEventListener('mouseover',function(){if(!my.activeQ)return;me.hilite()
me.overQ=true});div.addEventListener('mouseleave',function(){if(!my.activeQ)return;me.overQ=false
me.draw();});div.addEventListener('click',function(){if(!my.activeQ)return;me.overQ=false
me.flip();my.moveN++
gameCheck(me.txt)});var can=document.createElement('canvas');can.style.position="absolute";can.style.top='0px';can.style.left='0px';can.style.width='100%';can.style.height='100%';can.width=wd;can.height=ht;this.g=can.getContext("2d");div.appendChild(can);document.getElementById('board').appendChild(div);this.draw();}
draw(){var g=this.g;g.clearRect(0,0,this.wd,this.ht);let type=this.onQ?4:2
g.pieceDraw(this.wd/2,this.wd/2,this.wd*0.45,type,this.hiliteQ)
g.fillStyle='black'
g.textAlign='center'
g.font='20px Arial'
g.fillText(this.txt,this.wd/2,this.ht/2+8)
return
if(this.onQ){if(this.overQ){g.strokeStyle=this.overClr
g.lineWidth=2;g.beginPath();g.arc(this.wd/2,this.ht/2,this.wd/3,0,2*Math.PI);g.stroke();}else{g.strokeStyle=this.onClr
g.lineWidth=2;g.beginPath();g.arc(this.wd/2,this.ht/2,this.wd/3,0,2*Math.PI);g.stroke();}}else{if(this.overQ){g.strokeStyle=this.overClr
g.lineWidth=2;g.beginPath();g.arc(this.wd/2,this.ht/2,this.wd/3,0,2*Math.PI);g.stroke();}else{g.strokeStyle=this.offClr;g.lineWidth=2;g.beginPath();g.arc(this.wd/2,this.ht/2,this.wd/3,0,2*Math.PI);g.stroke();}}}
flip(){this.onQ=!this.onQ
this.draw()}
hilite(){this.hiliteQ=true
this.draw();this.hiliteQ=false}
win(){this.bgClr='#ffe';this.draw();}
setxy(lt,tp){this.div.style.left=lt+'px';this.div.style.top=tp+'px';}}
function radioHTMLa(prompt,id,lbls,checkId){var s='';s+='<div style="position:relative; margin:auto; background-color:lightblue;  ">';s+='<div style="display:inline-block; font: bold 16px Arial; margin-right: 1vmin;">';s+=prompt;s+='</div>';s+='<div style="display:inline-block; border: 1px solid white; border-radius:5px; padding:3px; margin:3px; background-color:rgba(255,255,255,0.5);">';for(var prop in lbls){var lbl=lbls[prop]
var idi=prop
var chkStr=(lbl.id==checkId)?' checked ':'';s+='<label for="'+idi+'" style="white-space: nowrap; ">'
s+='<input id="'+idi+'" type="radio" name="'+id+'" value="'+lbl.id+'" autocomplete="off" '+chkStr+' >';s+=lbl.name
s+='</label> ';}
s+='</div>';s+='</div>';return s;}
function radioSet(name,setValue){var divs=document.querySelectorAll('input[name="'+name+'"]')
for(var i=0;i<divs.length;i++){var div=divs[i]
div.checked=(div.id==setValue)}}
function dictLoad(){console.log('dictLoad',my.opt.dict)
var url=my.imgHome+'words/'+my.opt.dict.url
var rawFile=new XMLHttpRequest();rawFile.open("GET.html",url,true);rawFile.onreadystatechange=function(){if(rawFile.readyState===4){if(rawFile.status===200||rawFile.status==0){my.opt.dict.words=rawFile.responseText
if(my.opt.dict.words.length==0)my.opt.dict.words=my.wordStr
gameNew()}}}
rawFile.send(null);}
function parseWords(s){var LF=String.fromCharCode(10);var CR=String.fromCharCode(13);s=s.split(CR+LF).join(",");s=s.split(CR).join(",");s=s.split(LF).join(",");var words=s.split(",")
words.sort()
var goods=[]
var prevWord=''
var regex=new RegExp(/^[a-zA-Z0-9 ]+$/i);for(var i=0;i<words.length;i++){var word=words[i]
if(word.length<3)continue
if(word.length>11)continue
if(word==prevWord)continue
if(word.indexOf(' ')>-1)continue
prevWord=word
word=word.toLowerCase()
if(!regex.test(word))continue
goods.push(word)}
console.log('goods',words.length,goods.length)
console.log('goods',goods.join(','))
return goods}
CanvasRenderingContext2D.prototype.pieceDraw=function(x,y,size,type,hoverq){if(hoverq){this.beginPath()
this.fillStyle='hsla(60,90%,10%,0.2)'
this.arc(x+size*0.1,y+size*0.1,size*1.03,0,Math.PI*2,true)
this.fill()
this.beginPath()
this.lineWidth=6
this.strokeStyle='hsla(120,100%,45%,1)'
this.arc(x,y,size,0,Math.PI*2,true)
this.stroke()}else{this.beginPath()
this.fillStyle='hsla(120,100%,10%,0.3)'
this.arc(x+size*0.1,y+size*0.1,size*1.03,0,Math.PI*2,true)
this.fill()}
var gradient
switch(type){case 0:this.beginPath()
gradient=this.createRadialGradient(x+size*0.3,y+size*0.2,0,x,y,size*1.6);gradient.addColorStop(0,'hsla(240,10%,50%,1)');gradient.addColorStop(1,'black');this.fillStyle=gradient
this.arc(x,y,size,0,Math.PI*2,true)
this.fill()
this.beginPath()
gradient=this.createRadialGradient(x-size*0.5,y-size*0.5,0,x,y,size*1.6);gradient.addColorStop(0,'hsla(0,0%,70%,1)');gradient.addColorStop(0.3,'hsla(0,100%,100%,0)');this.fillStyle=gradient
this.arc(x,y,size*1,0,Math.PI*2,true)
this.fill()
break
case 1:this.beginPath()
gradient=this.createRadialGradient(x-size*0.4,y-size*0.6,0,x,y,size*1.4);gradient.addColorStop(0,'white');gradient.addColorStop(0.4,'hsla(240,100%,93%,1)');this.fillStyle=gradient
this.arc(x,y,size,0,Math.PI*2,true)
this.fill()
break
case 2:this.beginPath()
gradient=this.createRadialGradient(x-size*0.4,y-size*0.6,0,x,y,size*1.4);gradient.addColorStop(0,'white');gradient.addColorStop(0.4,'hsla(120,70%,70%,1)');this.fillStyle=gradient
this.arc(x,y,size,0,Math.PI*2,true)
this.fill()
this.beginPath()
gradient=this.createRadialGradient(x+size*0.2,y+size*0.2,0,x,y,size);gradient.addColorStop(0,'hsla(0,0%,100%,0.7)');gradient.addColorStop(1,'hsla(0,0%,100%,0)');this.fillStyle=gradient
this.arc(x,y,size*1,0,Math.PI*2,true)
this.fill()
break
case 3:this.beginPath()
gradient=this.createRadialGradient(x+size*0.3,y+size*0.2,0,x,y,size*1.6);gradient.addColorStop(0,'hsla(240,10%,50%,1)');gradient.addColorStop(1,'hsla(240,10%,20%,1)');this.fillStyle=gradient
this.arc(x,y,size,0,Math.PI*2,true)
this.fill()
this.beginPath()
gradient=this.createRadialGradient(x-size*0.5,y-size*0.5,0,x,y,size*1.6);gradient.addColorStop(0,'hsla(0,0%,70%,1)');gradient.addColorStop(0.3,'hsla(0,100%,100%,0)');this.fillStyle=gradient
this.arc(x,y,size*1,0,Math.PI*2,true)
this.fill()
break
case 4:this.beginPath()
gradient=this.createRadialGradient(x+size*0.3,y+size*0.2,0,x,y,size*1.6);gradient.addColorStop(0,'hsla(120,20%,50%,1)');gradient.addColorStop(1,'hsla(120,20%,10%,1)');this.fillStyle=gradient
this.arc(x,y,size,0,Math.PI*2,true)
this.fill()
this.beginPath()
gradient=this.createRadialGradient(x-size*0.5,y-size*0.5,0,x,y,size*1.6);gradient.addColorStop(0,'hsla(0,0%,70%,1)');gradient.addColorStop(0.3,'hsla(0,100%,100%,0)');this.fillStyle=gradient
this.arc(x,y,size*1,0,Math.PI*2,true)
this.fill()
break
default:}}