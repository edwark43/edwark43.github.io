var w,h,my={};function tictactoeMain(){my.version='0.52';w=360;h=450;my.winLens=[3,4,5]
my.bdSzs=[3,4,5,6,7,8]
my.replaceQ=false
my.playerTypes=[{name:'Human',aiQ:false},{name:'Computer (Beginner)',aiQ:true,levelMax:1,timeMax:3000},{name:'Computer (Medium)',aiQ:true,levelMax:3,timeMax:3000},{name:'Computer (Challenging)',aiQ:true,levelMax:4,timeMax:10000},{name:'Computer (Hard)',aiQ:true,levelMax:6,timeMax:10000}]
my.players=[{name:"O",type:my.playerTypes[0],score:0},{name:"X",type:my.playerTypes[0],score:0}];my.playerN=0
my.playerStartN=0
my.AI=new AI()
my.activeQ=false
var s='';my.sndHome=(document.domain=='localhost')?'/mathsisfun/images/sounds/':'/images/sounds/'
s+='<audio id="sndWin" src="'+my.sndHome+'yes2.mp3" preload="auto"></audio>';s+='<audio id="sndDrop" src="'+my.sndHome+'click1.mp3" preload="auto"></audio>';s+='<audio id="sndDraw" src="'+my.sndHome+'wibble.mp3" preload="auto"></audio>'
my.snds=[];s+='<div id="main" style="position:relative; width:'+w+'px; min-height:'+h+'px; background-xnor: white; margin:auto; display:block; border: 1px solid black; border-radius: 10px;">';s+='<div id="top" style="font: 24px Arial; text-align:center; margin-top:3px; height:34px">'
s+='<div id="btns" style="position:absolute; left: 3px; font: 18px Arial;">'
s+='<button id="optBtn" type="button" style="z-index:2;" class="togglebtn" onclick="optPop()">Options</button>'
s+='<button id="newBtn" type="button" style="z-index:2;" class="togglebtn" onclick="gameNew()">New Game</button>'
my.soundQ=true
s+='&nbsp;'
s+=soundBtnHTML()
s+='</div>'
s+='<div id="scores" style="position:absolute; right: 3px; font: bold 24px Arial;" onclick="start()">'
s+='</div>'
s+='</div>'
s+='<div id="msg" style="font: 24px Arial; text-align:center; margin-top:5px;">Player X</div>'
s+='<div id="board" style=""></div>';s+=optPopHTML();s+='<canvas id="timercanvas" width="100" height="100" style="z-index:2;  width:100px;"></canvas>';s+='<div id="copyrt" style="font: 11px Arial; color: #6600cc; position:absolute; bottom:5px; left:5px; text-align:center;">&copy; 2019 MathsIsFun.com  v'+my.version+'</div>';s+='</div>';document.write(s);this.clrs=[["Blue",'#0000FF'],["Red",'#FF0000'],["Black",'#000000'],["Green",'#00cc00'],["Orange",'#FFA500'],["Slate Blue",'#6A5ACD'],["Lime",'#00FF00'],["Spring Green",'#00FF7F'],["Teal",'#008080'],["Gold",'#ffd700'],["Med Purple",'#aa00aa'],["Light Blue",'#ADD8E6'],["Navy",'#000080'],["Purple",'#800080'],["Dark SeaGreen",'#8FBC8F']];my.clrNum=0;optPop()}
function gameNew(){my.winLen=Math.floor(document.querySelector('input[name="winLen"]:checked').value)
my.bdSz=Math.floor(document.querySelector('input[name="bdSz"]:checked').value)
console.log('bdSz,winLen',my.bdSz,my.winLen)
for(var i=0;i<my.players.length;i++){var div=document.getElementById("playerType"+i);var n=div.selectedIndex
my.players[i].type=my.playerTypes[n]
console.log("my.players",my.players[i]);}
var myNode=document.getElementById("board");while(myNode.firstChild){myNode.removeChild(myNode.firstChild);}
my.boxWd=Math.min(70,(Math.min(w,h-90))/my.bdSz)
console.log('my',my)
bdDraw()
my.playerN=my.playerStartN
msg(my.players[my.playerN].name+"'s Turn")
if(my.players[my.playerN].type.aiQ){console.log('gameNew ai move')
var xn=getRandomInt(0,my.bdSz-1)
var yn=getRandomInt(0,my.bdSz-1)
var tile=my.bd[xn][yn]
tile.playerN=my.playerN
tile.draw()
update(tile)}
my.activeQ=true
my.playerStartN=1-my.playerStartN}
function msg(s){document.getElementById('msg').innerHTML=s}
function bdDraw(){my.borderTp=75
my.borderLt=(w-my.bdSz*my.boxWd)/2
my.bd=[]
for(var xn=0;xn<my.bdSz;xn++){my.bd[xn]=[]
for(var yn=0;yn<my.bdSz;yn++){var tile=new Tile(my.boxWd,my.boxWd,boxLeft(xn),boxTop(yn))
tile.xn=xn;tile.yn=yn;my.bd[xn][yn]=tile}}}
function boxLeft(xn){return my.borderLt+my.boxWd*xn}
function boxTop(yn){return my.borderTp+my.boxWd*yn}
function update(me){var line=winLine(bdSimple(),me.xn,me.yn,my.playerN)
if(line.length>0){msg(my.players[my.playerN].name+' wins!')
soundPlay('sndWin')
my.activeQ=false
winShow(line)
my.players[my.playerN].score++
var s=''
for(var i=0;i<my.players.length;i++){var p=my.players[i]
s+=p.name+':'+p.score+' '}
document.getElementById('scores').innerHTML=s}else{if(gameOverQ(bdSimple())){soundPlay('sndDraw')
msg('DRAW!')
my.activeQ=false}else{soundPlay('sndDrop')
my.playerN=1-my.playerN
console.log('Change Player to:',my.players[my.playerN])
var msgStr=my.players[my.playerN].name+"'s Turn"
if(my.players[my.playerN].type.aiQ){my.activeQ=false
msgStr+=' (wait)'
setTimeout(doAI,300)}
msg(msgStr)}}}
function doAI(){var move=my.AI.moveBest(bdSimple(),my.playerN)
console.log('AI.moveBest = ',move)
var tile=my.bd[move[0]][move[1]]
tile.playerN=my.playerN
tile.draw()
update(tile)
my.activeQ=true}
function winShow(line){for(var i=0;i<line.length;i++){var pos=line[i]
my.bd[pos[0]][pos[1]].win()}}
function winLine(bd,xn,yn,playerN){var dirs=[[1,0],[0,1],[1,1],[1,-1]];for(var i=0;i<dirs.length;i++){var dir=dirs[i]
for(var j=1-my.winLen;j<my.winLen;j++){var sttxn=xn+dir[0]*j
var sttyn=yn+dir[1]*j
var s=''
var winQ=true
var line=[];for(var k=0;k<my.winLen;k++){var xi=sttxn+dir[0]*k
var yi=sttyn+dir[1]*k
line.push([xi,yi])
s+='('+xi+','+yi+','+bdPlayer(bd,xi,yi)+')'
if(bdPlayer(bd,xi,yi)!=playerN){winQ=false
continue}}
if(winQ){return line}}}
return[];}
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
function bdSimple(){var bd=[]
for(var xn=0;xn<my.bdSz;xn++){bd[xn]=[]
for(var yn=0;yn<my.bdSz;yn++){bd[xn][yn]=my.bd[xn][yn].playerN}}
return bd}
function gameOverQ(bd){for(var xn=0;xn<my.bdSz;xn++){for(var yn=0;yn<my.bdSz;yn++){if(bdPlayer(bd,xn,yn)==-1)return false}}
return true}
function AI(){}
AI.prototype.moveBest=function(bd,playerN){this.choice=[]
this.aiplayer=playerN
this.currPlayer=playerN
this.stt=performance.now()
this.alphaBetaMinimax(bd,0,[0,0],playerN,-Infinity,+Infinity);this.elapsed=performance.now()-this.stt
console.log(my.players[this.aiplayer].name+' elapsed: '+this.elapsed/1000)
return this.choice}
AI.prototype.alphaBetaMinimax=function(bd,depth,move,playerN,alpha,beta){var playerPrev=1-playerN
var line=winLine(bd,move[0],move[1],playerPrev)
if(line.length>0){if(playerPrev==this.aiplayer){return 20-depth;}else{return depth-20;}}
if(depth>my.players[this.aiplayer].type.levelMax)return getRandomInt(-5,5)
var elapsed=performance.now()-this.stt
if(depth>3&&elapsed>my.players[this.aiplayer].type.timeMax)return 0
depth+=1;var availableMoves=this.getAvailableMoves(bd);if(availableMoves.length==0){return getRandomInt(-5,5)}
var move,result;if(playerN===this.aiplayer){for(var i=0;i<availableMoves.length;i++){move=availableMoves[i];bd[move[0]][move[1]]=playerN
result=this.alphaBetaMinimax(bd,depth,move,1-playerN,alpha,beta);bd[move[0]][move[1]]=-1
if(result>alpha){alpha=result;if(depth==1){this.choice=move;}}else if(alpha>=beta){return alpha;}}
return alpha;}else{for(var i=0;i<availableMoves.length;i++){move=availableMoves[i];bd[move[0]][move[1]]=playerN
result=this.alphaBetaMinimax(bd,depth,move,1-playerN,alpha,beta);bd[move[0]][move[1]]=-1
if(result<beta){beta=result;if(depth==1){this.choice=move;console.log('this.choice = ',move)}}else if(beta<=alpha){return beta;}}
return beta;}}
AI.prototype.getAvailableMoves=function(bd){var moves=[];if(my.bdSz<=5){for(var xn=0;xn<my.bdSz;xn++){for(var yn=0;yn<my.bdSz;yn++){if(bd[xn][yn]==-1)moves.push([xn,yn]);}}}else{for(var xn=0;xn<my.bdSz;xn++){for(var yn=0;yn<my.bdSz;yn++){if(bd[xn][yn]==-1){if(bdNear(bd,xn,yn,2)){moves.push([xn,yn])}}}}}
return moves}
function bdNear(bd,xn,yn,n){var dirs=[[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];for(var k=0;k<dirs.length;k++){var dir=dirs[k];for(var m=1;m<=n;m++){if(bdPlayer(bd,xn+dir[0]*m,yn+dir[1]*m)!=-1)return true}}
return false}
function radioHTML(prompt,id,lbls,func){var s='';s+='<div style="display:inline-block; border: 1px solid white; border-radius:5px; padding:3px; margin:3px; background-xnor:rgba(255,255,255,0.5);">';s+=prompt;for(var i=0;i<lbls.length;i++){var lbl=lbls[i];var idi=id+i;var chkStr=(i==0)?' checked ':'';s+='<input id="'+idi+'" type="radio" name="'+id+'" value="'+lbl+'" onclick="'+func+'('+i+');" autocomplete="off" '+chkStr+' >';s+='<label for="'+idi+'">'+lbl+' </label>';}
s+='</div>';return s;}
function cutoffCallback(){}
function endGameCallback(){}
var seed=1;var seed=+new Date();function random(){var x=Math.sin(seed++)*10000;return x-Math.floor(x);}
function getRandomArbitrary(min,max){return Math.random()*(max-min)+min;}
function getRandomInt(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
function optPopHTML(){var s='';s+='<div id="optpop" style="position:absolute; left:-500px; top:0px; width:360px; padding: 5px; border-radius: 9px; background-color: #bcd; box-shadow: 10px 10px 5px 0px rgba(40,40,40,0.75); transition: all linear 0.3s; opacity:0; text-align: center; ">';s+='<div id="optInside" style="margin: 5px auto 5px auto;">';for(var i=0;i<my.players.length;i++){var p=my.players[i];s+='<div style="font: 15px Verdana; color:white; background-color: #57a; padding: 0 0 15px 0; border-radius: 10px;  border: 3px 3px 3px 3px; margin:3px; ">';s+='<div style="font: 20px Verdana; color:lightblue; padding:7px 0 6px 0;">'+p.name+' player:</div>';s+='Type: ';s+=getDropdownHTML(my.playerTypes,'','playerType'+i,p.typ);s+='</div>';}
s+='</div>';s+='<div style="position:relative; margin:auto; text-align:center; font:14px Arial; background-color:lightblue;  margin: 5px 0 1px 0; padding: 5px 0 5px 0;">';s+=radioHTML('Board Size','bdSz',my.bdSzs,'');s+=radioHTML('Winning Length','winLen',my.winLens,'');s+='</div>'
s+='<div style="float:right; margin: 0 0 5px 10px;">';s+='<button id="optYes" onclick="optYes()" style="z-index:2; font: 22px Arial;" class="togglebtn" >&#x2714;</button>';s+='<button onclick="optNo()" style="z-index:2; font: 22px Arial;" class="togglebtn" >&#x2718;</button>';s+='</div>';s+='</div>';return s;}
function optPop(){var pop=document.getElementById('optpop');pop.style.transitionDuration="0.3s";pop.style.opacity=1;pop.style.zIndex=12;pop.style.left=(w-400)/2+'px';}
function optYes(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-999px';gameNew()}
function optNo(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-999px';}
function getDropdownHTML(opts,funcName,id,chkNo){var s='';s+='<select id="'+id+'" style="font: 14px Arial; color: #6600cc; background: white; padding: 1px;line-height:30px; border-radius: 5px;">';for(var i=0;i<opts.length;i++){var idStr=id+i;var chkStr=i==chkNo?'selected':'';s+='<option id="'+idStr+'" value="'+opts[i].name+'" style="height:21px;" '+chkStr+' >'+opts[i].name+'</option>';}
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
function soundPlay(id,simulQ){if(!my.soundQ)return
simulQ=typeof simulQ!=='undefined'?simulQ:false
if(simulQ){if(id.length>0)document.getElementById(id).play()}else{my.snds.push(id)
soundPlayQueue(id)}}
function soundPlayQueue(id){var div=document.getElementById(my.snds[0])
div.play()
div.onended=function(){my.snds.shift();if(my.snds.length>0)soundPlayQueue(my.snds[0]);};}
function soundToggle(){var btn='sound'
if(my.soundQ){my.soundQ=false
document.getElementById(btn).classList.add("mute")}else{my.soundQ=true
document.getElementById(btn).classList.remove("mute")}}
function Timer(g,rad,secs,clr,funcEnd){this.g=g;this.rad=rad;this.secs=secs;this.clr=clr;this.funcEnd=funcEnd;this.x=rad;this.y=rad;this.stt=performance.now();this.stopQ=false;}
Timer.prototype.update=function(){};Timer.prototype.restart=function(secs){this.secs=secs;this.stt=performance.now();this.stopQ=false;requestAnimationFrame(this.draw.bind(this));};Timer.prototype.more=function(secs){this.stt+=secs*1000;};Timer.prototype.stop=function(){this.stopQ=true;};Timer.prototype.draw=function(){if(this.stopQ)return;var now=performance.now();var elapsed=now-this.stt;var ratio=Math.min(1,elapsed/this.secs/1000);var g=this.g;g.beginPath();g.fillStyle="#def";g.arc(this.x,this.y,this.rad,0,2*Math.PI);g.fill();g.beginPath();g.moveTo(this.x,this.y);g.fillStyle=this.clr;g.arc(this.x,this.y,this.rad,-Math.PI/2,ratio*2*Math.PI-Math.PI/2);g.fill();if(ratio<1){requestAnimationFrame(this.draw.bind(this));}else{this.funcEnd();}};function Tile(wd,ht,lt,tp){this.wd=wd
this.ht=ht
this.bgClr='#def'
this.fgClr='black'
this.playerN=-1
var div=document.createElement("div");div.style.width=wd+'px'
div.style.height=ht+'px'
div.style.position='absolute'
div.style.top=tp+'px'
div.style.left=lt+'px'
this.div=div
var me=this
div.addEventListener('mouseover',function(){if(!my.activeQ)return
if(my.replaceQ){if(me.playerN!=my.playerN){}}else{if(me.playerN==-1){me.drawPlayer(my.playerN,'#bcf')}}})
div.addEventListener('mouseleave',function(){if(!my.activeQ)return
if(my.replaceQ){if(me.playerN!=my.playerN){}}else{if(me.playerN==-1){me.drawPlayer(-1)}}})
div.addEventListener('click',function(){if(!my.activeQ)return
if(my.replaceQ){if(me.playerN!=my.playerN){me.playerN=my.playerN
me.draw()
update(me)}}else{if(me.playerN==-1){me.playerN=my.playerN
me.draw()
update(me)}}})
var can=document.createElement('canvas');can.style.position="absolute";can.style.top='0px'
can.style.left='0px'
can.style.width='100%'
can.style.height='100%'
can.width=wd
can.height=ht
this.g=can.getContext("2d");div.appendChild(can)
document.getElementById('board').appendChild(div);this.draw()}
Tile.prototype.draw=function(){var fgClr='darkblue'
if(this.playerN==1)fgClr='darkred'
this.drawPlayer(this.playerN,fgClr)}
Tile.prototype.drawPlayer=function(playerN,fgClr){fgClr=typeof fgClr!=='undefined'?fgClr:'black'
this.fgClr=fgClr
var g=this.g
g.clearRect(0,0,this.wd,this.ht)
g.strokeStyle='black'
g.lineWidth=1
g.fillStyle=this.bgClr
g.beginPath()
g.rect(2,2,this.wd-4,this.ht-4)
g.stroke()
g.fill()
if(playerN>=0){g.strokeStyle=this.fgClr
switch(my.players[playerN].name){case 'O':g.lineWidth=2
g.beginPath()
g.arc(this.wd/2,this.ht/2,this.wd/3,0,2*Math.PI)
g.stroke()
break
case 'X':g.lineWidth=2
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
default:}}}
Tile.prototype.win=function(){this.bgClr='#ffe'
this.draw()}
Tile.prototype.setxy=function(lt,tp){this.div.style.left=lt+'px';this.div.style.top=tp+'px';}