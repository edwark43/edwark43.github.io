var w,h,my={};function battleshipMain(){var version='0.52';w=360;h=500;my.shipSets=[[2,3,4,5],[2,3,3,4,5],[2,3,4,5,6],[6]];my.shipSetN=2
my.bdSzs=[8,10,12];my.playerTypes=[{name:'Human',aiQ:false},{name:'Computer (Beginner)',aiQ:true,levelMax:1,timeMax:3000},{name:'Computer (Medium)',aiQ:true,levelMax:3,timeMax:3000},{name:'Computer (Challenging)',aiQ:true,levelMax:4,timeMax:10000},{name:'Computer (Hard)',aiQ:true,levelMax:6,timeMax:10000}];my.clrs0=[["Light Blue Grey",'#D8D8e8'],["Silver",'#d0d0d0'],["Grey 1",'#a898a8'],["Grey 2",'#b8a8a8']];my.clrs1=[["Blue 1",'#bDD8E6'],["Sky Blue",'#97CEEB'],["Aqua",'#aaffff'],["Antique White",'#FAEBD7'],["Blue 2",'#7A9ACD']];my.players=[new Player('Human','blue','rgba(0,0,255,0.3)','board0',my.clrs0),new Player('Computer','red','rgba(255,0,0,0.4)','board1',my.clrs1)]
my.playerN=0
my.playerStartN=0
my.borderTp=123
var s='';my.sndHome=(document.domain=='localhost')?'/mathsisfun/images/sounds/':'/images/sounds/'
s+='<audio id="sndWin" src="'+my.sndHome+'kids-cheer.mp3" preload="auto"></audio>';s+='<audio id="sndWinAI" src="'+my.sndHome+'computer-happy.mp3" preload="auto"></audio>';s+='<audio id="sndHit" src="'+my.sndHome+'boom-quiet.mp3" preload="auto"></audio>';s+='<audio id="sndMiss" src="'+my.sndHome+'splash-quiet.mp3" preload="auto"></audio>';s+='<audio id="sndSunk" src="'+my.sndHome+'water-echo.mp3" preload="auto"></audio>';my.snds=[];s+='<style>'
s+='.btn { display: inline-block; position: relative; text-align: center; margin: 2px; text-decoration: none; font: bold 14px/25px Arial, sans-serif; color: #268; border: 1px solid #88aaff; border-radius: 10px;cursor: pointer; background: linear-gradient(to top right, rgba(170,190,255,1) 0%, rgba(255,255,255,1) 100%); outline-style:none;}'
s+='.btn:hover { background: linear-gradient(to top, rgba(255,255,0,1) 0%, rgba(255,255,255,1) 100%); }'
s+='.yy { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(255,220,130,1) 0%, rgba(255,255,255,1) 100%);  }'
s+='.hi { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(130,220,255,1) 0%, rgba(255,255,255,1) 100%); }'
s+='.lo { border: solid 1px #888888; background: linear-gradient(to top, rgba(170,170,170,1) 0%, rgba(205,205,205,1) 100%);  }'
s+='</style>'
s+='<div id="main" style="position:relative; width:'+w+'px; min-height:'+h+'px; margin:auto; display:block; border: 1px solid black; border-radius: 10px;">';s+='<div id="top" style="font: 24px Arial; text-align:center; margin-top:3px; height:95px; ">'
s+='<div id="btns" style="font: 18px Arial;">'
s+='<button id="optBtn" type="button" style="z-index:2;" class="btn" onclick="optPop()">Options</button>'
s+='<button id="newBtn" type="button" style="z-index:2;" class="btn" onclick="gameNew()">New Game</button>'
my.soundQ=true
s+='&nbsp;'
s+=soundBtnHTML()
s+='<div id="scores" style="font: 18px Arial; background-color:#def; margin:2px;"></div>'
s+='<button id="readyBtn" type="button" style="z-index:2;" class="btn" onclick="playerReady()">Ready!</button>'
s+='<button id="nextBtn" type="button" style="z-index:2;" class="btn" onclick="next()">Next</button>'
s+='</div>'
s+='<div id="msg" style="font: 24px Arial; text-align:center; margin-top:3px;">Player X</div>'
s+='</div>'
s+='<div id="board0" style="transition: opacity 2s linear;"></div>';s+='<div id="board1" style="transition: opacity 2s linear;"></div>';s+=optPopHTML();s+='<div style="font: 11px Arial; color: #6600cc; position:absolute; bottom:5px; left:5px; text-align:center;">&copy; 2020 MathsIsFun.com  v'+version+'</div>';s+='</div>';document.write(s);document.getElementById('scores').innerHTML='Human:0 Computer:0'
gameNew()}
function gameNew(){my.placedQ=false
my.activeQ=false
my.nextQ=false
my.bdSz=Math.floor(document.querySelector('input[name="bdSz"]:checked').value)
console.log('bdSz',my.bdSz)
var id=document.querySelector('input[name="shipSet"]:checked').id
my.shipSetN=(id.match(/\d+$/)||[]).pop();console.log('my.shipSetN',my.shipSetN)
my.boxWd=Math.min(70,(Math.min(w,h-90))/my.bdSz)
for(var i=0;i<my.players.length;i++){var p=my.players[i]
var div=document.getElementById("playerType"+i);p.type=my.playerTypes[div.selectedIndex]
p.bdClear()}
for(var i=0;i<my.players.length;i++){var p=my.players[i]
if(p.type.aiQ){p.bd=bdMake(p.bgClr,p.bdName,p.clrs)
p.autoPlace()}else{p.bd=bdMake(p.bgClr,p.bdName,p.clrs)
p.autoPlace()
p.shipsDrag(true)}}
my.playerN=my.playerStartN
my.playerN=0
my.players[my.playerN].bdShow(false)
my.players[my.playerN].shipsShow(true)
my.players[1-my.playerN].bdShow(true)
my.players[1-my.playerN].shipsShow(true)
msg(my.players[my.playerN].name+"'s Turn")
if(my.players[my.playerN].type.aiQ){console.log('gameNew ai move')
var xn=randomInt(0,my.bdSz-1)
var yn=randomInt(0,my.bdSz-1)
var tile=my.players[my.playerN].bd[xn][yn]
tile.playerN=my.playerN
tile.draw()
update(tile)}
btnVis('readyBtn',true)
btnVis('nextBtn',false)
placeCheck()
msg('Place your ships')}
function msg(s){document.getElementById('msg').innerHTML=s}
function placeCheck(){console.log('placeCheck')
var p=my.players[1]
console.log('p1',p)
var ships=p.ships
var othrs=[]
var outsideN=0
var collideN=0
for(var i=0;i<ships.length;i++){var ship=ships[i];if(!ship.insideQ()){outsideN++}
if(ship.intersectsQ(othrs)){collideN++}
othrs.push(ship)}
var s=''
if(outsideN>0)s+='Ship Outside! '
if(collideN>0)s+='Ship Collision!'
msg(s)
if(s.length>0){btnVis('readyBtn',false)}else{btnVis('readyBtn',true)}
console.log('placeCheck',s)}
function bdMake(clr,bdName,clrs){my.borderLt=(w-my.bdSz*my.boxWd)/2
var pts=getRandomPts(my.bdSz,my.bdSz,3,clrs);var bd=[]
for(var xn=0;xn<my.bdSz;xn++){bd[xn]=[]
for(var yn=0;yn<my.bdSz;yn++){var clr=getClrAt(pts,xn,yn);var tile=new Tile(my.boxWd,my.boxWd,boxLeft(xn),boxTop(yn),clr,bdName)
tile.xn=xn;tile.yn=yn;bd[xn][yn]=tile}}
return bd}
function boxLeft(xn){return my.borderLt+my.boxWd*xn}
function boxTop(yn){return my.borderTp+my.boxWd*yn}
function update(tile){var hiti=hitCheck(tile)
console.log('hiti=',hiti)
tile.hit(hiti>=0)
var p=my.players[my.playerN];var winQ=p.winCheck()
if(winQ){msg(p.name+' wins!')
if(p.type.aiQ){soundPlay('sndWinAI')}else{soundPlay('sndWin')}
my.activeQ=false
btnVis('nextBtn',false)
my.players[my.playerN].score++
var s=''
for(var i=0;i<my.players.length;i++){var p=my.players[i]
s+=p.name+':'+p.score+' '}
document.getElementById('scores').innerHTML=s}else{my.nextQ=false
btnVis('nextBtn',true)
setTimeout(nextIfNotAlready,2000)}}
function nextIfNotAlready(){if(!my.nextQ){btnVis('nextBtn',false)
next()}}
function btnVis(name,onQ){var div=document.getElementById(name)
if(onQ){div.style.visibility='visible'}else{div.style.visibility='hidden'}}
function hitCheck(tile){var p0=my.players[my.playerN]
return p0.hitCheck(tile.xn,tile.yn)}
function playerReady(){my.placedQ=true
my.activeQ=true
var p0=my.players[0]
var p1=my.players[1]
p0.shipsDrag(false)
p0.bdShow(true)
p0.shipsShow(false)
p1.bdShow(false)
p1.shipsShow(false)
btnVis('readyBtn',false)
btnVis('nextBtn',false)
my.nextQ=false
msg('Fire!')}
function next(){my.nextQ=true
btnVis('nextBtn',false)
my.players[my.playerN].bdShow(false)
my.playerN=1-my.playerN
my.players[my.playerN].bdShow(true)
var msgStr=my.players[my.playerN].name+"'s Turn"
if(my.players[my.playerN].type.aiQ){my.activeQ=false
setTimeout(doAI,500)}else{my.activeQ=true}
msg(msgStr)}
function doAI(){my.players[my.playerN].doAI()}
function bdPlayer(bd,xn,yn){if(xn<0)return-1
if(yn<0)return-1
if(xn>=my.bdSz)return-1
if(yn>=my.bdSz)return-1
return bd[xn][yn]}
function bdFmt(bd){var s=''
for(var yn=0;yn<my.bdSz;yn++){for(var xn=0;xn<my.bdSz;xn++){var playerN=bd[xn][yn]
if(playerN==-1){s+='~'}else{s+=+playerN}}
s+='\n'}
return s}
function radioHTML(prompt,id,lbls,func,chkN){var s='';s+='<div style="display:inline-block; border: 1px solid white; border-radius:5px; padding:3px; margin:3px; background-xnor:rgba(255,255,255,0.5);">';s+=prompt;for(var i=0;i<lbls.length;i++){var lbl=lbls[i];var idi=id+i;var chkStr=(i==chkN)?' checked ':'';s+='<input id="'+idi+'" type="radio" name="'+id+'" value="'+lbl+'" onclick="'+func+'('+i+');" autocomplete="off" '+chkStr+' >';s+='<label for="'+idi+'">'+lbl+' </label>';}
s+='</div>';return s;}
function randomInt(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
function optPopHTML(){var s='';s+='<div id="optpop" style="position:absolute; left:-500px; top:0px; width:360px; padding: 5px; border-radius: 9px; background-color: #bcd; box-shadow: 10px 10px 5px 0px rgba(40,40,40,0.75); transition: all linear 0.3s; opacity:0; text-align: center; font: 14px Arial;">';s+='<div id="optInside" style=" display:none; margin: 5px auto 5px auto;">';for(var i=0;i<my.players.length;i++){var p=my.players[i];s+='<div style="font: 15px Verdana; color:white; background-color: #57a; padding: 0 0 15px 0; border-radius: 10px;  border: 3px 3px 3px 3px; margin:3px; ">';s+='<div style="font: 20px Verdana; color:lightblue; padding:7px 0 6px 0;">'+p.name+' player:</div>';s+='Type: ';s+=dropdownHTML(my.playerTypes,'','playerType'+i,i);s+='</div>';}
s+='</div>';s+='<div style="position:relative; margin:auto; text-align:center; font:14px Arial; background-color:lightblue;  margin: 5px 0 1px 0; padding: 5px 0 5px 0;">';s+=radioHTML('Board Size','bdSz',my.bdSzs,'',0);s+='</div>'
s+='<div style="position:relative; margin:auto; text-align:center; font:14px Arial; background-color:lightblue;  margin: 5px 0 1px 0; padding: 5px 0 5px 0;">';s+=radioHTML('Ships','shipSet',my.shipSets,'',0);s+='</div>'
s+='<div style="float:right; margin: 0 0 5px 10px;">';s+='(starts new game)'
s+='<button id="optYes" onclick="optYes()" style="z-index:2; font: 22px Arial;" class="btn" >&#x2714;</button>';s+=' '
s+='<button onclick="optNo()" style="z-index:2; font: 22px Arial;" class="btn" >&#x2718;</button>';s+='</div>';s+='</div>';return s;}
function optPop(){var pop=document.getElementById('optpop');pop.style.transitionDuration="0.3s";pop.style.opacity=1;pop.style.zIndex=12;pop.style.left=(w-400)/2+'px';}
function optYes(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-999px';gameNew()}
function optNo(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-999px';}
function dropdownHTML(opts,funcName,id,chkN){var s='';s+='<select id="'+id+'" style="font: 14px Arial; color: #6600cc; background: white; padding: 1px;line-height:30px; border-radius: 5px;">';for(var i=0;i<opts.length;i++){var idStr=id+i;var chkStr=i==chkN?'selected':'';s+='<option id="'+idStr+'" value="'+opts[i].name+'" style="height:21px;" '+chkStr+' >'+opts[i].name+'</option>';}
s+='</select>';return s;}
function soundBtnHTML(){var s=''
s+='<style> '
s+=' .speaker { height: 30px; width: 30px; position: relative; overflow: hidden; display: inline-block; vertical-align:top; } '
s+=' .speaker span { display: block; width: 9px; height: 9px; background-color: blue; margin: 10px 0 0 1px; }'
s+=' .speaker span:after { content: ""; position: absolute; width: 0; height: 0; border-style: solid; border-color: transparent blue transparent transparent; border-width: 10px 16px 10px 15px; left: -13px; top: 5px; }'
s+=' .speaker span:before { transform: rotate(45deg); border-radius: 0 60px 0 0; content: ""; position: absolute; width: 5px; height: 5px; border-style: double; border-color: blue; border-width: 7px 7px 0 0; left: 18px; top: 9px; transition: all 0.2s ease-out; }'
s+=' .speaker:hover span:before { transform: scale(.8) translate(-3px, 0) rotate(42deg); }'
s+=' .speaker.mute span:before { transform: scale(.5) translate(-15px, 0) rotate(36deg); opacity: 0; }'
s+=' .speaker.mute span { background-color: #bbb; }'
s+=' .speaker.mute span:after {border-color: transparent #bbb transparent #bbb;}'
s+=' </style>'
s+='<div id="sound" onClick="soundToggle()" class="speaker"><span></span></div>'
return s}
function soundToggle(){var btn='sound'
if(my.soundQ){my.soundQ=false
document.getElementById(btn).classList.add("mute")}else{my.soundQ=true
document.getElementById(btn).classList.remove("mute")}}
function soundPlay(name,simulQ){if(!my.soundQ)return
simulQ=typeof simulQ!=='undefined'?simulQ:true
if(simulQ){if(name.length>0){var div=document.getElementById(name)
if(div.currentTime>0&&div.currentTime<div.duration){console.log('soundPlay cloned',div.currentTime,div.duration)
div.cloneNode(true).play()}else{div.play()}}}else{my.snds.push(name)
soundPlayQueue()}}
function soundPlayQueue(){var div=document.getElementById(my.snds[0])
div.play()
div.onended=function(){my.snds.shift();if(my.snds.length>0)soundPlayQueue();};}
function Tile(wd,ht,lt,tp,clr,bdName){this.wd=wd
this.ht=ht
this.xn=Math.round(lt/my.boxWd)
this.yn=Math.round(tp/my.boxWd)
this.bgClr=clr
this.fgClr='black'
this.status='clear'
this.sunkQ=false
var div=document.createElement("div");div.style.width=wd+'px'
div.style.height=ht+'px'
div.style.position='absolute'
div.style.top=tp+'px'
div.style.left=lt+'px'
this.div=div
var me=this
div.addEventListener('mouseover',function(){if(!my.activeQ)return
if(me.status!='clear')return
me.drawStatus('over')})
div.addEventListener('mouseleave',function(){if(!my.activeQ)return
if(me.status!='clear')return
if(!me.onQ)return
me.drawStatus()})
div.addEventListener('click',function(){if(!my.activeQ)return
if(me.status!='clear')return
my.activeQ=false
update(me)})
var can=document.createElement('canvas');can.style.position="absolute";can.style.top='0px'
can.style.left='0px'
can.style.width='100%'
can.style.height='100%'
can.width=wd
can.height=ht
this.g=can.getContext("2d");div.appendChild(can)
document.getElementById(bdName).appendChild(div);this.draw()}
Tile.prototype.hit=function(onQ){if(onQ){this.status='hit'
soundPlay('sndHit')}else{this.status='miss'
soundPlay('sndMiss')}
this.draw()}
Tile.prototype.draw=function(onQ){this.onQ=typeof onQ!=='undefined'?onQ:true
if(this.onQ){this.div.style.pointerEvents="auto";var fgClr=(this.playerN==0)?'darkblue':'darkred'
this.drawStatus(this.status,fgClr)}else{var g=this.g
g.clearRect(0,0,g.canvas.width,g.canvas.height)
this.div.style.pointerEvents="none";}}
Tile.prototype.drawStatus=function(status,fgClr){status=typeof status!=='undefined'?status:this.status
this.fgClr=typeof fgClr!=='undefined'?fgClr:'black'
var g=this.g
g.clearRect(0,0,g.canvas.width,g.canvas.height)
g.fillStyle=this.bgClr
g.beginPath()
g.rect(0,0,this.wd,this.ht)
g.fill()
g.strokeStyle=this.fgClr
switch(status){case 'over':g.strokeStyle='blue'
g.lineWidth=2
g.beginPath()
g.arc(this.wd/2,this.ht/2,this.wd/3,0,2*Math.PI)
g.stroke()
break
case 'hit':g.strokeStyle='black'
g.fillStyle='red'
g.lineWidth=3
g.beginPath()
g.arc(this.wd/2,this.ht/2,this.wd/3,0,2*Math.PI)
g.stroke()
g.fill()
break
case 'miss':g.strokeStyle='rgba(255,255,255,0.3)'
g.fillStyle='rgba(0,0,255,0.2)'
g.lineWidth=3
g.beginPath()
g.arc(this.wd/2,this.ht/2,this.wd/3,0,2*Math.PI)
g.stroke()
g.fill()
break
case 'x':g.lineWidth=2
var edge=this.wd*0.2
g.beginPath()
g.moveTo(edge,edge)
g.lineTo(this.wd-edge,this.wd-edge)
g.stroke()
g.beginPath()
g.moveTo(edge,this.wd-edge)
g.lineTo(this.wd-edge,edge)
g.stroke()
break
default:}}
Tile.prototype.win=function(){this.bgClr='#ffe'
this.draw()}
Tile.prototype.setxy=function(lt,tp){this.div.style.left=lt+'px';this.div.style.top=tp+'px';}
function Player(name,clr,bgClr,bdName,clrs){this.name=name
this.clr=clr
this.clrs=clrs
this.bgClr=bgClr
this.bdName=bdName
this.score=0
this.ships=[];this.bd=[];}
Player.prototype.bestMove=function(){var dirs=[[0,-1],[1,0],[0,1],[-1,0]]
var best={score:-9,xn:0,yn:0}
for(var i=0;i<my.bdSz;i++){for(var j=0;j<my.bdSz;j++){var scoreTot=0
scoreTot+=Math.random()
var t0=tileType(this.bd,i,j)
if(t0!=0)scoreTot-=99
for(var dn=0;dn<dirs.length;dn++){var score=0
var dir=dirs[dn]
var t1=tileType(this.bd,i+dir[0],j+dir[1])
var t2=tileType(this.bd,i+2*dir[0],j+2*dir[1])
switch(t1){case 0:break
case 1:score+=6
if(t2==1){score+=6}
break
case 2:score-=2
break
case 9:score-=2
break
default:}
scoreTot+=score}
if(scoreTot>best.score)best={score:scoreTot,xn:i,yn:j}}}
return best}
function tileType(bd,xn,yn){if(xn<0)return 0
if(yn<0)return 0
if(xn>=my.bdSz)return 0
if(yn>=my.bdSz)return 0
var tile=bd[xn][yn]
if(tile.sunkQ)return 9
if(tile.status=='hit')return 1
if(tile.status=='miss')return 2
return 0}
Player.prototype.autoPlace=function(){this.ships=[];my.zIndex=1;var shipLens=my.shipSets[my.shipSetN];for(var i=0;i<shipLens.length;i++){var len=shipLens[i]
var ship=new Ship('a',len,this.bgClr,this.bdName)
var OKQ=false
var tryN=0
do{ship.pos.x=randomInt(0,my.bdSz-1)
ship.pos.y=randomInt(0,my.bdSz-1)
if(Math.random()<0.5){ship.xn=len
ship.yn=1}else{ship.xn=1
ship.yn=len}
OKQ=ship.validPosQ(this.ships)}while(!OKQ&&tryN++<100)
ship.setSize()
this.ships.push(ship)}}
Player.prototype.bdClear=function(){var div=document.getElementById(this.bdName);while(div.firstChild){div.removeChild(div.firstChild);}}
Player.prototype.bdShow=function(onQ){var div=document.getElementById(this.bdName)
if(onQ){div.style.display='block'}else{div.style.display='none'}}
Player.prototype.hitCheck=function(xn,yn){for(var i=0;i<this.ships.length;i++){var ship=this.ships[i]
if(ship.hitQ(xn,yn)){console.log('HIT on ship',i)
ship.hit(this.bd)
return i}}
return-1}
Player.prototype.shipsShow=function(onQ){console.log('shipsShow',this.name,onQ)
for(var i=0;i<this.ships.length;i++){var ship=this.ships[i]
ship.show(onQ)}}
Player.prototype.shipsDrag=function(onQ){for(var i=0;i<this.ships.length;i++){var ship=this.ships[i]
if(onQ){ship.div.style.pointerEvents="auto";}else{ship.div.style.pointerEvents="none";}}}
Player.prototype.winCheck=function(){for(var i=0;i<this.ships.length;i++){var ship=this.ships[i]
console.log('winCheck',ship.hitN,ship.sz)
if(ship.hitN<ship.sz)return false}
return true}
Player.prototype.doAI=function(){var best=this.bestMove()
console.log('doAI best',best)
var tile=this.bd[best.xn][best.yn]
tile.playerN=my.playerN
tile.draw()
update(tile)}
function Ship(name,sz,clr,bdName){this.name=name
this.sz=sz
this.clr=clr
this.hitN=0
this.sunkQ=false
this.bdName=bdName
this.showQ=true
this.xn=sz
this.yn=1
this.pos={x:0,y:0}
this.pad=0
this.div=document.createElement("div")
this.div.style.zIndex=my.zIndex++;this.can=document.createElement('canvas');this.g=this.can.getContext("2d");this.div.appendChild(this.can)
document.getElementById(bdName).appendChild(this.div);this.setSize()
var div=this.div
var me=this
me.drag={onQ:false,x:0,y:0}
div.addEventListener('touchstart',function(ev){if(!me.showQ)return
console.log('touchstart')
me.drag.onQ=true
me.drag.x=ev.clientX
me.drag.y=ev.clientY
me.div.style.zIndex=my.zIndex++;me.goneOutQ=true
var touch=ev.targetTouches[0];ev.clientX=touch.clientX;ev.clientY=touch.clientY;ev.touchQ=true;ev.preventDefault();})
div.addEventListener('touchmove',function(ev){if(!me.showQ)return
var touch=ev.targetTouches[0];ev.clientX=touch.clientX;ev.clientY=touch.clientY;ev.touchQ=true;me.moveMe(me,ev)})
div.addEventListener('touchend',function(ev){me.dropMe(me)})
div.addEventListener('mouseover',function(){if(!me.showQ)return
document.body.style.cursor="pointer";})
div.addEventListener('mousedown',function(ev){if(!me.showQ)return
console.log('mousedown')
me.drag.onQ=true
me.drag.x=ev.clientX
me.drag.y=ev.clientY
me.div.style.zIndex=my.zIndex++;me.goneOutQ=true})
div.addEventListener('mouseleave',function(){if(!me.showQ)return
me.drag.onQ=false
document.body.style.cursor="default";})
div.addEventListener('mouseup',function(){if(!me.showQ)return
me.dropMe(me)})
div.addEventListener('mousemove',function(ev){if(!me.showQ)return
me.moveMe(me,ev)})}
Ship.prototype.dropMe=function(me){me.drag.onQ=false
me.pos.x=Math.round((parseFloat(me.div.style.left)-my.borderLt)/my.boxWd)
var lt=me.pos.x*my.boxWd+my.borderLt
me.div.style.left=lt+'px'
me.pos.y=Math.round((parseFloat(me.div.style.top)-my.borderTp)/my.boxWd)
var tp=me.pos.y*my.boxWd+my.borderTp
me.div.style.top=tp+'px'
placeCheck()}
Ship.prototype.moveMe=function(me,ev){if(me.drag.onQ){var lt=parseFloat(me.div.style.left)+ev.clientX-me.drag.x
me.div.style.left=lt+'px'
me.drag.x=ev.clientX
var tp=parseFloat(me.div.style.top)+ev.clientY-me.drag.y
me.div.style.top=tp+'px'
me.drag.y=ev.clientY
var el=document.getElementById(this.bdName)
var bRect=el.getBoundingClientRect();var gap=5
var lilRect={lt:bRect.left+gap,tp:bRect.top+gap,rt:bRect.right-gap,bt:bRect.top+my.boxWd*my.bdSz-gap}
var bigRect={lt:bRect.left-gap,tp:bRect.top-gap,rt:bRect.right+gap,bt:bRect.top+my.boxWd*my.bdSz+gap}
if(me.goneOutQ){if(insideRect(ev.clientX,ev.clientY,lilRect)){me.goneOutQ=false
console.log('gone in')}}else{if(!insideRect(ev.clientX,ev.clientY,bigRect)){me.goneOutQ=true
console.log('gone out 1:',ev.clientX,ev.clientY,lt,tp,bRect.left,bRect.top)
var temp=me.xn
me.xn=me.yn
me.yn=temp
var toMouseX=ev.clientX-lt-bRect.left+my.borderLt
var toMouseY=ev.clientY-tp-bRect.top+my.borderTp
me.pos.x=(lt-my.borderLt+toMouseX-toMouseY)/my.boxWd
me.pos.y=(tp-my.borderTp-toMouseX+toMouseY)/my.boxWd
me.setSize()
me.draw()}}
ev.preventDefault()}}
Ship.prototype.bdMoveTo=function(bdName){document.getElementById(this.bdName).removeChild(this.div)
document.getElementById(bdName).appendChild(this.div)
this.bdName=bdName}
Ship.prototype.hitQ=function(xn,yn){var rect={lt:xn,tp:yn,wd:1,ht:1,rt:xn+0.99,bt:yn+0.99}
if(intersectRect(this.rect(),rect)){console.log('intersects',this.rect(),rect)
return true}
return false}
Ship.prototype.hit=function(bd){this.hitN++
console.log('ship hit',this.hitN,this.sz)
if(!this.sunkQ&&this.hitN>=this.sz){this.sunkQ=true
soundPlay('sndSunk')
this.show(true)
console.log('ship just sunk')
for(var i=0;i<this.xn;i++){for(var j=0;j<this.yn;j++){var xn=this.pos.x+i
var yn=this.pos.y+j
bd[xn][yn].sunkQ=true}}}}
Ship.prototype.setSize=function(){var tp=0
var lt=0
var canWd=(this.xn*my.boxWd+this.pad*2);var canHt=(this.yn*my.boxWd+this.pad*2);var div=this.div
div.style.width=canWd+'px'
div.style.height=canHt+'px'
div.style.position='absolute'
div.style.top=tp+'px'
div.style.left=lt+'px'
var can=this.can
can.style.position="absolute";can.style.top='0px'
can.style.left='0px'
var ratio=1
can.width=canWd*ratio;can.height=canHt*ratio;can.style.width=canWd+"px";can.style.height=canHt+"px";}
Ship.prototype.rect=function(){return{lt:this.pos.x,tp:this.pos.y,wd:this.xn,ht:this.yn,rt:this.pos.x+this.xn-0.01,bt:this.pos.y+this.yn-0.01}}
Ship.prototype.validPosQ=function(ships){if(!this.insideQ())return false
if(this.intersectsQ(ships))return false
return true}
Ship.prototype.insideQ=function(){if(this.pos.x<0)return false
if(this.pos.y<0)return false
if(this.pos.x+this.xn>my.bdSz)return false
if(this.pos.y+this.yn>my.bdSz)return false
return true}
Ship.prototype.intersectsQ=function(ships){for(var i=0;i<ships.length;i++){var othr=ships[i]
if(intersectRect(this.rect(),othr.rect())){console.log('intersects',this.rect(),othr.rect())
return true}}
return false}
Ship.prototype.show=function(onQ){console.log('Ship show',onQ)
if(onQ){this.draw()}else{var g=this.g
g.clearRect(0,0,g.canvas.width,g.canvas.height)}}
Ship.prototype.draw=function(){var g=this.g
var shipWd=this.xn*my.boxWd
var shipHt=this.yn*my.boxWd
g.clearRect(0,0,g.canvas.width,g.canvas.height)
g.strokeStyle='black'
g.lineWidth=2
g.fillStyle=this.clr
g.beginPath()
console.log('ship',this,my.boxWd,shipHt)
g.roundRect(2,2,shipWd-4,shipHt-4,my.boxWd/2)
g.fill()
g.stroke()
this.div.style.left=boxLeft(this.pos.x)+'px'
this.div.style.top=boxTop(this.pos.y)+'px'}
Ship.prototype.setxy=function(lt,tp){this.div.style.left=lt+'px';this.div.style.top=tp+'px';}
CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){if(w<2*r)r=w/2;if(h<2*r)r=h/2;this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+h,r);this.arcTo(x+w,y+h,x,y+h,r);this.arcTo(x,y+h,x,y,r);this.arcTo(x,y,x+w,y,r);return this;};function insideRect(x,y,r){if(x<r.lt)return false
if(x>r.rt)return false
if(y<r.tp)return false
if(y>r.bt)return false
return true}
function intersectRect(r1,r2){return!(r2.lt>r1.rt||r2.rt<r1.lt||r2.tp>r1.bt||r2.bt<r1.tp);}
function getRandomPts(width,height,ptCount,clrs){var pts=[];for(var i=0;i<ptCount;i++){var ptX=Math.random()*width;var ptY=Math.random()*height;var ptClr=clrs[randomInt(0,clrs.length-1)][1];pts.push([ptX,ptY,ptClr]);}
return pts;}
function getClrAt(pts,width,height){var sumClrs=[];var sumFact=0;sumClrs=[0,0,0];for(var i=0;i<pts.length;i++){var d=dist(pts[i][0]-width,pts[i][1]-height);var fact=1/d;var rgb=hex2rgb(pts[i][2]);sumClrs[0]+=rgb[0]*fact;sumClrs[1]+=rgb[1]*fact;sumClrs[2]+=rgb[2]*fact;sumFact+=fact;}
var clr=rgb2hex([sumClrs[0]/sumFact,sumClrs[1]/sumFact,sumClrs[2]/sumFact]);return(clr);}
function hex2rgb(hex){hex=hex.replace('#','');var rr=parseInt(hex.substring(0,2),16);var gg=parseInt(hex.substring(2,4),16);var bb=parseInt(hex.substring(4,6),16);return[rr,gg,bb];}
function rgb2hex(clrs){var hex=[];for(var i=0;i<3;i++){hex.push(((clrs[i])<<0).toString(16));if(hex[i].length<2){hex[i]="0"+hex[i];}}
return "#"+hex[0]+hex[1]+hex[2];}
function dist(dx,dy){return(Math.sqrt(dx*dx+dy*dy));}