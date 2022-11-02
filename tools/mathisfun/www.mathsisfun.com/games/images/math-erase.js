let w,h,my={};function matheraseMain(){let version='0.521';w=360;h=480;my.opts={name:'user',bdSzN:3}
my.boxWd=40
my.unitsQ=true
my.canHoverQ=false
my.qLen=4
my.score=0
my.scoreMults=[0,1,2,4,10,20,40,100,200]
my.bdSzs=[]
for(let i=4;i<=9;i++){my.bdSzs.push({id:'sz'+i,name:i+'x'+i,n:i})}
my.bdSz=7
my.modes=[{id:'add',name:'Add',min:1,max:9,op:'add'},{id:'multp3',name:'Multiply 0 to 3',min:0,max:3,op:'mult'},{id:'multn1',name:'Multiply -1 to 1',min:-1,max:1,op:'mult'},{id:'multn2',name:'Multiply -2 to 2',min:-2,max:2,op:'mult'},]
my.mode=my.modes[0]
let s='';s+='<style>'
s+='.btn { display: inline-block; position: relative; text-align: center; margin: 2px; text-decoration: none; font: bold 14px/25px Arial, sans-serif; color: #268; border: 1px solid #88aaff; border-radius: 10px;cursor: pointer; background: linear-gradient(to top right, rgba(170,190,255,1) 0%, rgba(255,255,255,1) 100%); outline-style:none;}'
s+='.btn:hover { background: linear-gradient(to top, rgba(255,255,0,1) 0%, rgba(255,255,255,1) 100%); }'
s+='.yy { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(255,220,130,1) 0%, rgba(255,255,255,1) 100%);  }'
s+='.hi { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(130,220,255,1) 0%, rgba(255,255,255,1) 100%); box-shadow: 2px 2px 6px #66a; }'
s+='.lo { border: solid 1px #888888; background: linear-gradient(to top, rgba(170,170,170,1) 0%, rgba(205,205,205,1) 100%);  }'
s+='</style>'
my.sndHome=(document.domain=='localhost')?'/mathsisfun/images/sounds/':'/images/sounds/'
s+='<audio id="sndWin" src="'+my.sndHome+'yes2.mp3" preload="auto"></audio>';s+='<audio id="sndDrop" src="'+my.sndHome+'click1.mp3" preload="auto"></audio>';s+='<audio id="sndErase" src="'+my.sndHome+'flip2.mp3" preload="auto"></audio>';s+='<audio id="sndDraw" src="'+my.sndHome+'wibble.mp3" preload="auto"></audio>'
my.snds=[];s+='<div id="main" style="position:relative; width:'+w+'px; min-height:'+h+'px; background-color: white; margin:auto; display:block; border: 1px solid orange; border-radius: 10px;">';s+='<div id="top" style="font: 24px Arial; text-align:center; margin-top:3px; width:100%; height:34px;">'
s+='<div id="btns" style="position:absolute; left: 3px; font: 18px Arial;">'
s+='<button id="optBtn" type="button" style="z-index:2;" class="btn" onclick="optPop()">Options</button>'
s+='<button id="newBtn" type="button" style="z-index:2;" class="btn" onclick="gameNew()">New Game</button>'
my.soundQ=true
s+='&nbsp;'
s+=soundBtnHTML()
s+='</div>'
s+='<div id="score"    style="font: 34px Arial; text-align:center; position:absolute; right: 20px; top: 1px; width:50px; height:42px; color:blue;">0</div>'
s+='<div id="scoreLbl" style="font: 12px Arial; text-align:center; position:absolute; right: 20px; top: 33px; width:50px; height:42px;  color:blue;">score</div>'
s+='<div id="moveN"   style="font: 24px Arial; text-align:center; position:absolute; right: 20px; top: 55px; width:50px; height:42px;  color:orange;">0</div>'
s+='<div id="moveLbl" style="font: 12px Arial; text-align:center; position:absolute; right: 20px; top: 77px; width:50px; height:42px;  color:orange;">moves</div>'
s+=`<div id="qOverlay" style="position:absolute; left: 50px; top: 50px; width:150px; height:42px;  
  background: linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,.5) 100%); z-index:3; ">`
s+='</div>'
s+='<div id="board" style=""></div>';s+=optPopHTML();s+='<canvas id="timercanvas" width="100" height="100" style="z-index:2;  width:100px;"></canvas>';s+='<div style="font: 11px Arial; color: #6600cc; position:absolute; bottom:1px; left:5px; text-align:center;">&copy; 2020 MathsIsFun.com  v'+version+'</div>';s+='</div>';s+='</div>';document.write(s);my.clrs=[["Blue",'#0000FF'],["Orange",'#FFA500'],["Slate Blue",'#6A5ACD'],["Green",'#00cc00'],["Lime",'#00FF00'],["Teal",'#008080'],["Gold",'#ffd700'],["Med Purple",'#aa00aa'],["Navy",'#000080'],["Purple",'#800080'],["Dark SeaGreen",'#8FBC8F']];my.clrNum=0;document.getElementById("bdSzs").selectedIndex=optGet('bdSzN')
document.getElementById("modes").selectedIndex=optGet('modeN')
gameNew()}
function gameNew(){let myNode=document.getElementById("board");while(myNode.firstChild){myNode.removeChild(myNode.firstChild);}
my.qTiles=[]
for(let i=0;i<my.qLen;i++){let tile=new Tile(my.boxWd,my.boxWd,200-i*my.boxWd,50)
tile.valSet(1)
my.qTiles.push(tile)}
let index=document.getElementById("bdSzs").selectedIndex
optSet('bdSzN',index)
my.bdSz=my.bdSzs[index].n
index=document.getElementById("modes").selectedIndex
optSet('modeN',index)
my.mode=my.modes[index]
document.getElementById('optMsg').innerHTML=''
console.log('my',my)
bdDraw()
bdFill()
queueFill()
my.score=0
document.getElementById('score').innerHTML=my.score
my.moveN=(my.bdSz-2)*(my.bdSz-2)+2
document.getElementById('moveN').innerHTML=my.moveN
my.activeQ=true}
function bdFill(){my.tiles.map(tile=>{if(tile.xn>0&&tile.yn>0&&tile.xn<my.bdSz-1&&tile.yn<my.bdSz-1){let val=getRandomInt(my.mode.min,my.mode.max)
tile.valSet(val)}})}
function bdDraw(){console.log('bdDraw',my)
my.borderTp=105
my.borderLt=(w-my.bdSz*my.boxWd)/2
my.bd=[]
my.tiles=[]
for(let xn=0;xn<my.bdSz;xn++){my.bd[xn]=[]
for(let yn=0;yn<my.bdSz;yn++){let tile=new Tile(my.boxWd,my.boxWd,boxLeft(xn),boxTop(yn))
tile.xn=xn;tile.yn=yn;my.bd[xn][yn]=tile
my.tiles.push(tile)}}}
function boxLeft(xn){return my.borderLt+my.boxWd*xn}
function boxTop(yn){return my.borderTp+my.boxWd*yn}
function queueVals(){let queue=[]
my.tiles.map(tile=>{if(tile.emptyQ){let nbors=nborsGet(tile)
if(nbors.length>0){let val=nborsCalc(nbors)
queue.push(val)}}})
console.log('queue',queue)
return queue}
function nborsCalc(nbors){switch(my.mode.op){case 'add':let sum=nbors.reduce((tot,nbor)=>{return nbor.emptyQ?tot:tot+nbor.val},0)
return unitsGet(sum)
break
case 'mult':let prod=nbors.reduce((tot,nbor)=>{return nbor.emptyQ?tot:tot*nbor.val},1)
return unitsGet(prod)
break
default:return 0}}
function queueFill(){console.log('queueMake')
let queue=queueVals()
shuffleArray(queue)
for(let i=0;i<my.qLen;i++){my.qTiles[i].valSet(queue[i])}}
function queueShift(){console.log('queueShift')
let queue=queueVals()
if(queue.length<1){bdFull()
return;}
let currEndVal=my.qTiles[my.qTiles.length-1].val
let tries=0
let num=0
do{num=queue[Math.floor(Math.random()*queue.length)];}while(num==currEndVal&&tries++<3);my.qTiles[0].valSet(num)
my.qTiles.push(my.qTiles.shift())
let lt=200
my.qTiles.map((tile,i)=>{if(i<my.qLen-1){tile.div.style.transition='all 1s ease-in-out'
tile.div.style.left=lt+'px';}else{tile.div.style.transition='none'
tile.div.style.opacity=0
tile.div.style.left=lt+'px';setTimeout(function(){tile.div.style.transition='all 1s ease-in-out'
tile.div.style.opacity=1},500)}
lt-=my.boxWd})}
function update(me){console.log('update',me)
if(!me.emptyQ)return
my.moveN--
document.getElementById('moveN').innerHTML=my.moveN
me.valSet(my.qTiles[0].val)
let nbors=nborsGet(me)
let tot=nborsCalc(nbors)
console.log('nbors',nbors,tot)
if(unitsGet(tot)==unitsGet(me.val)){soundPlay('sndErase')
me.empty()
let emptyN=0
nbors.map(nbor=>{if(!nbor.emptyQ)emptyN++;nbor.empty();})
let score=my.scoreMults[emptyN]
me.wow(score)
my.score+=score
document.getElementById('score').innerHTML=my.score
let count=my.tiles.reduce((tot,tile)=>{return tot+(tile.emptyQ?0:1)},0)
console.log('left to do: ',count)
if(count<=0){success()
return}}else{soundPlay('sndDrop')}
if(my.moveN<=0){movesDone()
return}
queueShift()}
function bdFull(){my.activeQ=false
console.log('board full')
soundPlay('sndDraw')
document.getElementById('optMsg').innerHTML='End of Game: Board is Full!'
optPop()}
function movesDone(){my.activeQ=false
console.log('moves over')
soundPlay('sndDraw')
let s=''
s+="Game Over"
s+='<br>'
s+='<p style="font-size: 160%;">'
s+="Your score is <b>"+my.score+'</b>'
s+='</p>'
s+='<br>'
s+="New Game?"
document.getElementById('optMsg').innerHTML=s
optPop()}
function success(){my.activeQ=false
console.log('success')
my.tiles.map(tile=>{tile.empty()})
soundPlay('sndWin')
let s=''
s+="Well done, you cleared the board!"
s+='<br>'
s+="Bonus 20"
my.score+=20
document.getElementById('score').innerHTML=my.score
s+='<br>'
s+='<p style="font-size: 160%;">'
s+="Your score is <b>"+my.score+'</b>'
s+='</p>'
s+='<br>'
s+="New Game?"
document.getElementById('optMsg').innerHTML=s
optPop()}
function unitsGet(num){return num%10}
function nborsGet(tile){let nbors=[]
let xn=tile.xn
let yn=tile.yn
let rels=[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1],]
rels.map(rel=>{let xrel=xn+rel[0]
if(xrel>=0&&xrel<my.bdSz){let yrel=yn+rel[1]
if(yrel>=0&&yrel<my.bdSz){if(!my.bd[xrel][yrel].emptyQ)nbors.push(my.bd[xrel][yrel])}}})
return nbors}
function radioHTML(prompt,id,lbls,func){let s='';s+='<div style="display:inline-block; border: 1px solid white; border-radius:5px; padding:3px; margin:3px; background-xnor:rgba(255,255,255,0.5);">';s+=prompt;for(let i=0;i<lbls.length;i++){let lbl=lbls[i];let idi=id+i;let chkStr=(i==0)?' checked ':'';s+='<input id="'+idi+'" type="radio" name="'+id+'" value="'+lbl+'" onclick="'+func+'('+i+');" autocomplete="off" '+chkStr+' >';s+='<label for="'+idi+'">'+lbl+' </label>';}
s+='</div>';return s;}
let seed=+new Date();function random(){let x=Math.sin(seed++)*10000;return x-Math.floor(x);}
function getRandomArbitrary(min,max){return Math.random()*(max-min)+min;}
function getRandomInt(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
function optPopHTML(){let s='';s+='<div id="optpop" style="position:absolute; left:-500px; top:100px; width:360px; padding: 5px; border-radius: 9px; background-color: hsla(240,80%,80%,0.95); box-shadow: 10px 10px 5px 0px rgba(40,40,40,0.75); transition: all linear 0.3s; opacity:0; text-align: center; ">';s+='<div id="optMsg" style="font:18px Arial; margin: 5px auto 15px auto; color: darkblue;"></div>';s+='<div id="optInside" style="font:14px Arial; margin: 5px auto 5px auto;">';s+='Size: ';s+=getDropdownHTML(my.bdSzs,'','bdSzs',0);s+='<br>';s+='Type: ';s+=getDropdownHTML(my.modes,'','modes',0);s+='</div>';s+='<div style="float:right; margin: 0 0 5px 10px;">';s+='<button id="optYes" onclick="optYes()" style="z-index:2; font: 22px Arial;" class="btn" >&#x2714;</button>';s+='<button onclick="optNo()" style="z-index:2; font: 22px Arial;" class="btn" >&#x2718;</button>';s+='</div>';s+='</div>';return s;}
function optPop(){let pop=document.getElementById('optpop');pop.style.transitionDuration="0.3s";pop.style.opacity=1;pop.style.zIndex=12;pop.style.left=(w-400)/2+'px';}
function optYes(){let pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-999px';gameNew()}
function optNo(){let pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-999px';}
function optGet(name){var val=localStorage.getItem(`MathErase.${name}`)
if(val==null)val=my.opts[name]
return val}
function optSet(name,val){localStorage.setItem(`MathErase.${name}`,val)
my.opts[name]=val}
function getDropdownHTML(opts,funcName,id,chkNo){let s='';s+='<select id="'+id+'" style="font: 14px Arial; color: #6600cc; background: white; padding: 1px;line-height:30px; border-radius: 5px;">';for(let i=0;i<opts.length;i++){let idStr=id+i;let chkStr=i==chkNo?'selected':'';s+='<option id="'+idStr+'" value="'+opts[i].name+'" style="height:21px;" '+chkStr+' >'+opts[i].name+'</option>';}
s+='</select>';return s;}
function soundBtnHTML(){let onClr='blue'
let offClr='#bbb'
let s=''
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
function soundPlay(id,simulQ){if(!my.soundQ)return
simulQ=typeof simulQ!=='undefined'?simulQ:false
if(simulQ){if(id.length>0)document.getElementById(id).play()}else{my.snds.push(id)
soundPlayQueue(id)}}
function soundPlayQueue(id){let div=document.getElementById(my.snds[0])
div.play()
div.onended=function(){my.snds.shift();if(my.snds.length>0)soundPlayQueue(my.snds[0]);};}
function soundToggle(){let btn='sound'
if(my.soundQ){my.soundQ=false
document.getElementById(btn).classList.add("mute")}else{my.soundQ=true
document.getElementById(btn).classList.remove("mute")}}
class Tile{constructor(wd,ht,lt,tp){this.wd=wd;this.ht=ht;this.bgClr='#def';this.fgClr='black';this.val=0;this.emptyQ=true;this.overQ=false;let div=document.createElement("div");document.getElementById('board').appendChild(div);div.style.width=wd+'px';div.style.height=ht+'px';div.style.position='absolute';div.style.top=tp+'px';div.style.left=lt+'px';div.style.transition='all 1s ease-in-out'
this.div=div;let me=this;div.addEventListener('mouseover',function(){if(!my.activeQ)return;console.log('mouseover')
me.overQ=true;me.draw()
my.canHoverQ=true;});div.addEventListener('mouseleave',function(){if(!my.activeQ)return;me.overQ=false;me.draw();});div.addEventListener('click',function(){if(!my.activeQ)return;me.overQ=false;update(me);});let can=document.createElement('canvas');can.style.position="absolute";can.style.top='0px';can.style.left='0px';can.style.width='100%';can.style.height='100%';can.width=wd;can.height=ht;this.g=can.getContext("2d");div.appendChild(can);let txtBox=document.createElement("div");txtBox.style="font: 22px Arial; position: absolute; text-align: center;";txtBox.style.top=Math.floor(-(23-my.boxWd)/2)+'px';txtBox.style.left='0px';txtBox.style.width='100%';txtBox.style.height='100%';div.appendChild(txtBox);this.txtBox=txtBox;let wowBox=document.createElement("div");wowBox.style="font: 20px Arial; position: absolute; right: 2px; top: 2px; text-align: right; color: goldenrod;  opacity:0;";div.appendChild(wowBox);this.wowBox=wowBox;this.draw();}
wow(n){let box=this.wowBox
box.style.transition='none'
box.style.opacity=1
box.innerHTML='+'+n
setTimeout(function(){box.style.transition='all 1s ease-in-out'
box.style.opacity=0},500)}
valSet(n){this.val=n;this.emptyQ=false;this.txtBox.innerHTML=n;this.draw()}
empty(){this.val=0;this.emptyQ=true
this.overQ=false
this.txtBox.innerHTML='';this.draw()}
draw(){if(this.overQ){console.trace('draw ',this.overQ);}
let fgClr='#def';let bgClr=my.clrs[Math.abs(this.val)][1]
if(this.val>=0){}else{fgClr='#fed';}
if(this.emptyQ){bgClr=fgClr
if(this.overQ){fgClr='#acf';this.txtBox.innerHTML=my.qTiles[0].val}else{this.txtBox.innerHTML=''}}
let g=this.g;g.clearRect(0,0,this.wd,this.ht);let gradient=g.createRadialGradient(this.wd/2,this.wd/2,this.wd*1.09,this.wd/2,this.wd/2,this.wd*0.01);gradient.addColorStop(0,bgClr);gradient.addColorStop(0.7,fgClr);gradient.addColorStop(1,fgClr);g.fillStyle=gradient;g.strokeStyle='white';g.lineWidth=1;g.beginPath();let gap=0.2
g.rect(gap,gap,this.wd-2*gap,this.ht-2*gap);g.fill();}
win(){this.bgClr='#ffe';this.draw();}
setxy(lt,tp){this.div.style.left=lt+'px';this.div.style.top=tp+'px';}
setLt(lt){this.div.style.transition=fastQ?'none':'all 1s ease-in-out'
this.div.style.left=lt+'px';}}
function shuffleArray(array){for(let i=array.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));let temp=array[i];array[i]=array[j];array[j]=temp;}}