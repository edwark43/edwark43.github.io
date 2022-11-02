var w,h,my={};function tictactoewsMain(){var version='0.54';console.log('ver',version)
w=360;my.borderTp=220
h=w+my.borderTp+15
my.opts={name:'user'}
my.bdSzs=[3,4,5,6,7,8]
my.winLens=[3,4,5]
my.replaceQ=false
my.playerTypes=[{name:'Human',aiQ:false,sockQ:false},{name:'Human (Remote)',aiQ:false,sockQ:true},{name:'Computer (Beginner)',aiQ:true,levelMax:1,timeMax:3000,sockQ:false},{name:'Computer (Medium)',aiQ:true,levelMax:3,timeMax:3000,sockQ:false},{name:'Computer (Challenging)',aiQ:true,levelMax:4,timeMax:10000,sockQ:false},{name:'Computer (Hard)',aiQ:true,levelMax:6,timeMax:10000,sockQ:false}]
my.players=[{name:"O",type:my.playerTypes[0],score:0},{name:"X",type:my.playerTypes[0],score:0}];my.playerN=0
my.playerStartN=0
my.sockQ=false
my.sock=new Sock('tic')
my.sockPlayerN=0
my.nick='Me'
my.partnerQ=false
my.AI=new AI()
my.gameOverQ=false
var s='';my.sndHome='../images/sounds/index.html'
if(document.domain=='localhost')my.sndHome='../node/images/sounds/index.html'
if(document.domain=='www.mathsisfun.com')my.sndHome='../images/sounds/index.html'
console.log('sounds',document.domain,my.sndHome)
s+='<audio id="sndDrop" src="'+my.sndHome+'click1.mp3" preload="auto"></audio>';s+='<audio id="sndWin" src="'+my.sndHome+'yes2.mp3" preload="auto"></audio>';s+='<audio id="sndDraw" src="'+my.sndHome+'wibble.mp3" preload="auto"></audio>'
s+='<audio id="sndFail" src="'+my.sndHome+'wibble.mp3" preload="auto"></audio>'
s+='<audio id="sndStart" src="'+my.sndHome+'kalimba.mp3" preload="auto"></audio>'
my.snds=[];s+='<style>'
s+='.btn { display: inline-block; position: relative; text-align: center; margin: 2px; text-decoration: none; font: bold 14px/25px Arial, sans-serif; color: #268; border: 1px solid #88aaff; border-radius: 10px;cursor: pointer; background: linear-gradient(to top right, rgba(170,190,255,1) 0%, rgba(255,255,255,1) 100%); outline-style:none;}'
s+='.btn:hover { background: linear-gradient(to top, rgba(255,255,0,1) 0%, rgba(255,255,255,1) 100%); }'
s+='.yy { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(255,220,130,1) 0%, rgba(255,255,255,1) 100%);  }'
s+='.hi { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(130,220,255,1) 0%, rgba(255,255,255,1) 100%); box-shadow: 2px 2px 6px #66a; }'
s+='.lo { border: solid 1px #888888; background: linear-gradient(to top, rgba(170,170,170,1) 0%, rgba(205,205,205,1) 100%);  }'
s+='</style>'
s+='<div id="main" style="position:relative; width:'+w+'px; min-height:'+h+'px; background-xnor: white; margin:auto; display:block; border: 1px solid black; border-radius: 10px;">';s+='<div id="top" style="font: 24px Arial; text-align:center; margin-top:3px; height:34px">'
s+='<div id="btns" style="position:absolute; left: 3px; font: 18px Arial;">'
s+='<button id="optBtn" type="button" style="z-index:2;" class="btn" onclick="optPop()">Options</button>'
s+='<button id="newBtn" type="button" style="z-index:2;" class="btn" onclick="gameNew()">New Game</button>'
my.soundQ=true
s+='&nbsp;'
s+=soundBtnHTML()
s+='</div>'
s+='<div id="scores" style="position:absolute; right: 3px; font: bold 24px Arial;" onclick="start()">'
s+='</div>'
s+='</div>'
s+='<div id="names" style="font: 24px Arial; text-align:center; margin-top:5px;">';s+='<div id="nameUs" style="display:inline-block; font: 24px Arial; ">'+optGet('name')+'</div>'
s+=' vs '
s+='<div id="nameThem" style="display:inline-block; font: 24px Arial;">Them</div>'
s+='</div>'
s+='<textarea id="sockTxt" style="width: 99%; height:'+(my.borderTp-120)+'px; border-radius: 10px; font: 15px Arial; background-color: #eeffee; " value="" ></textarea>';s+='<div id="msg" style="font: 24px Arial; text-align:center; margin-top:5px;">Player X</div>'
s+='<div id="board" style=""></div>';s+=optPopHTML();s+='<canvas id="timercanvas" width="100" height="100" style="z-index:2;  width:100px;"></canvas>';s+='<div id="copyrt" style="font: 11px Arial; color: #6600cc; position:absolute; bottom:5px; left:5px; text-align:center;">&copy; 2019 MathsIsFun.com  v'+version+'</div>';s+='</div>';document.write(s);this.clrs=[["Blue",'#0000FF'],["Red",'#FF0000'],["Black",'#000000'],["Green",'#00cc00'],["Orange",'#FFA500'],["Slate Blue",'#6A5ACD'],["Lime",'#00FF00'],["Spring Green",'#00FF7F'],["Teal",'#008080'],["Gold",'#ffd700'],["Med Purple",'#aa00aa'],["Light Blue",'#ADD8E6'],["Navy",'#000080'],["Purple",'#800080'],["Dark SeaGreen",'#8FBC8F']];my.clrNum=0;radioSet('bdSz',my.bdSzs,3)
radioSet('winLen',my.winLens,3)
optPop()}
function gameNew(rmtAskQ){if(false){my.sockQ=false
my.sock=new Sock()
my.sockPlayerN=0
my.nick='Me'
my.partnerQ=false}
rmtAskQ=typeof rmtAskQ!=='undefined'?rmtAskQ:false
console.log('gameNew rmtAskQ='+rmtAskQ)
my.bdSz=Math.floor(document.querySelector('input[name="bdSz"]:checked').value)
my.winLen=Math.floor(document.querySelector('input[name="winLen"]:checked').value)
optSet('name',document.getElementById('name').value)
my.code=document.getElementById('code').value
my.publicQ=!document.getElementById("privateQ").checked
console.log('bdSz,winLen,publicQ',my.bdSz,my.winLen,my.publicQ)
my.sockQ=false
my.localPlayerN=0
for(var i=0;i<my.players.length;i++){var div=document.getElementById("playerType"+i);var n=div.selectedIndex
my.players[i].type=my.playerTypes[n]
if(my.players[i].type.sockQ){my.sockQ=true
my.localPlayerN=1-i}}
bdReset()
if(my.sockQ){my.playerStartN=1-my.playerStartN
console.log('my.playerStartN',my.playerStartN)}else{my.playerN=my.playerStartN
console.log('my.playerN',my.playerN)
my.playerStartN=1-my.playerStartN
console.log('my.playerStartN',my.playerStartN)}
turnMsg()
if(my.sockQ){if(!rmtAskQ){if(my.partnerQ){my.sock.gameStartNew(my.bdSz,my.winLen,my.localPlayerN,my.playerN)}else{my.sock.gameFind(my.bdSz,my.winLen,my.playerN)}}else{}}
my.gameOverQ=false}
function bdReset(){var myNode=document.getElementById("board");while(myNode.firstChild){myNode.removeChild(myNode.firstChild);}
my.boxWd=Math.min(70,(Math.min(w,h-90))/my.bdSz)
console.log('my',my)
bdDraw()}
function activeQ(){if(my.gameOverQ)return false
if(my.players[my.playerN].type.aiQ){my.reason='AI working'
return false}
if(my.sockQ){if(my.partnerQ){if(my.localPlayerN==my.playerN){my.reason='Local Turn'
return true}else{my.reason='Remote Turn'
return false}}else{my.reason='No partner'
return false}}
my.reason='Human Turn'
return true}
function turnMsg(){console.log('turnMsg',my.playerN,my.localPlayerN)
var msgStr=my.players[my.playerN].name+"'s Turn"
if(my.sockQ){if(my.partnerQ){if(my.players[my.playerN].type.sockQ){msgStr='Their Turn'}else{msgStr='Your Turn'}
msgStr+=' ('+my.players[my.playerN].name+')'}else{msgStr='Waiting for partner, code '+my.code}}
msg(msgStr)}
function msg(s){document.getElementById('msg').innerHTML=s}
function bdDraw(){my.borderLt=(w-my.bdSz*my.boxWd)/2
my.bd=[]
for(var xn=0;xn<my.bdSz;xn++){my.bd[xn]=[]
for(var yn=0;yn<my.bdSz;yn++){var tile=new Tile(my.boxWd,my.boxWd,boxLeft(xn),boxTop(yn))
tile.xn=xn;tile.yn=yn;my.bd[xn][yn]=tile}}}
function boxLeft(xn){return my.borderLt+my.boxWd*xn}
function boxTop(yn){return my.borderTp+my.boxWd*yn}
function update(me){var line=winLine(bdSimple(),me.xn,me.yn,my.playerN)
if(line.length>0){my.gameOverQ=true
msg(my.players[my.playerN].name+' wins!')
winShow(line)
my.players[my.playerN].score++
if(my.localPlayerN==my.playerN){soundPlay('sndWin')}else{soundPlay('sndFail')}
var s=''
for(var i=0;i<my.players.length;i++){var p=my.players[i]
s+=p.name+':'+p.score+' '}
document.getElementById('scores').innerHTML=s}else{if(gameOverQ(bdSimple())){soundPlay('sndDraw')
msg('DRAW!')
my.gameOverQ=true}else{soundPlay('sndDrop')
my.playerN=1-my.playerN
console.log('Change Player to:',my.players[my.playerN])
turnMsg()
if(my.players[my.playerN].type.aiQ){setTimeout(doAI,300)}else{if(my.players[my.playerN].type.sockQ){console.log('waiting for other person')}}}}}
function doAI(){var move=my.AI.moveBest(bdSimple(),my.playerN)
console.log('AI.moveBest = ',move)
var tile=my.bd[move[0]][move[1]]
tile.playerN=my.playerN
tile.draw()
update(tile)}
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
function radioSet(id,lbls,setValue){for(var i=0;i<lbls.length;i++){var idi=id+i;var div=document.getElementById(idi)
if(div.value==setValue){div.checked=true}else{div.checked=false}}}
var seed=1;var seed=+new Date();function random(){var x=Math.sin(seed++)*10000;return x-Math.floor(x);}
function getRandomArbitrary(min,max){return Math.random()*(max-min)+min;}
function getRandomInt(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
function optPopHTML(){var s='';s+='<div id="optpop" style="position:absolute; left:-500px; top:0px; width:360px; padding: 5px; border-radius: 9px; background-color: #bcd; box-shadow: 10px 10px 5px 0px rgba(40,40,40,0.75); transition: all linear 0.3s; opacity:0; text-align: center; ">';s+='<div id="optInside" style="margin: 5px auto 5px auto; display:none;">';for(var i=0;i<my.players.length;i++){var p=my.players[i];s+='<div style="font: 15px Verdana; color:white; background-color: #57a; padding: 0 0 15px 0; border-radius: 10px;  border: 3px 3px 3px 3px; margin:3px; ">';s+='<div style="font: 20px Verdana; color:lightblue; padding:7px 0 6px 0;">'+p.name+' player:</div>';s+='Type: ';s+=getDropdownHTML(my.playerTypes,'','playerType'+i,i);s+='</div>';}
s+='</div>';s+='<div style="position:relative; margin:auto; text-align:center; font:14px Arial; background-color:lightblue;  margin: 5px 0 1px 0; padding: 5px 0 5px 0;">';s+=radioHTML('Board Size','bdSz',my.bdSzs,'');s+=radioHTML('Winning Length','winLen',my.winLens,'');s+='</div>'
var url=(document.domain=='localhost')?'http://localhost:3001':'https://mathbro.com:3001'
s+='<div style="display:none; position:relative; margin:auto; text-align:center; font:14px Arial; background-color:lightblue;  margin: 5px 0 1px 0; padding: 5px 0 5px 0;">';s+='Server: '
s+='<input id="serverURL" style="width: 320px; border-radius: 10px; font: 15px Arial; background-color: #eeffee; " value="'+url+'" />';s+='</div>'
my.code=nameRand()
s+='<div style="position:relative; margin:auto; text-align:center; font:14px Arial; background-color:lightblue;  margin: 5px 0 1px 0; padding: 5px 0 5px 0;">';s+='Name (optional): '
s+='<input id="name" style="width: 80px; border-radius: 10px; font: 18px Arial; background-color: #eeffee; text-align:center;" value="'+optGet('name')+'" />';s+='<br>'
s+='Code: '
s+='<input id="code" style="width: 80px; border-radius: 10px; font: 18px Arial; background-color: #eeffee; text-align:center;" value="'+my.code+'" />';s+='<br>'
s+='Partner must have code: '
s+='<input type="checkbox" id="privateQ" checked>'
s+='</div>'
s+='<div style="float:right; margin: 0 0 5px 10px;">';s+='<button id="optYes" onclick="optYes()" style="z-index:2; font: 22px Arial;" class="btn" >&#x2714;</button>';s+='<button onclick="optNo()" style="z-index:2; font: 22px Arial;" class="btn" >&#x2718;</button>';s+='</div>';s+='</div>';return s;}
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
try{div.play()}catch(e){console.log('soundPlayQueue fail',my.snds)}
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
div.addEventListener('mouseover',function(){if(!activeQ())return
if(my.replaceQ){if(me.playerN!=my.playerN){}}else{if(me.playerN==-1){me.drawPlayer(my.playerN,'#bcf')}}})
div.addEventListener('mouseleave',function(){if(!activeQ())return
if(my.replaceQ){if(me.playerN!=my.playerN){}}else{if(me.playerN==-1){me.drawPlayer(-1)}}})
div.addEventListener('click',function(){if(!activeQ())return
if(my.replaceQ){if(me.playerN!=my.playerN){me.playerN=my.playerN
me.draw()
update(me)
if(my.sockQ)my.sock.moveSend(me.xn,me.yn,me.playerN)}}else{if(me.playerN==-1){me.playerN=my.playerN
me.draw()
update(me)
if(my.sockQ)my.sock.moveSend(me.xn,me.yn,me.playerN)}}})
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
function optGet(name){var val=localStorage.getItem(`remote.${name}`)
if(val==null)val=my.opts[name]
return val}
function optSet(name,val){localStorage.setItem(`remote.${name}`,val)
my.opts[name]=val}
class Sock{constructor(gameType){this.socket=null
this.queue=[]
this.lines=[]
this.gameType=gameType}
send(msg){if(this.socket==null){this.queue.push(msg)
this.connect()}
if(this.socket.readyState===1){this.socket.send(msg)}}
waitForConnection(callback,interval){if(this.socket.readyState===1){callback();}else{var that=this;interval*=2
setTimeout(function(){that.waitForConnection(callback,interval);},interval);}}
connect(){var that=this
var socket=new WebSocket('wss://www.mathbro.com:3002/echo');socket.onopen=function(ev){console.log("[open] Connection established");console.log("Sending to server");for(var i=0;i<that.queue.length;i++){var msg=that.queue[i]
socket.send(msg);}}
socket.onclose=function(ev){console.log(ev.wasClean?'Disconnected':'Connection break: '+ev.code+' '+ev.reason);that.histAdd('Lost Server')
this.partnerQ=false}
socket.onmessage=function(ev){that.msgRcv(parse(ev.data))}
socket.onerror=function(err){console.log('Socket Error '+err.message);}
this.socket=socket
console.log('socket running:'+this.socket)}
msgRcv(data){console.log('msgRcv',JSON.stringify(data))
switch(data.msg){case 'wait':console.log('wait:',data)
this.histAdd('Waiting for partner, code '+my.code)
msg('Waiting for partner')
my.partnerQ=false
break
case 'waitOver':console.log('waitOver:',data)
this.histAdd('New partner found: '+data.name)
my.nameThem=data.name
my.partnerQ=true
msg('')
soundPlay('sndStart')
this.gameStartNew(my.bdSz,my.winLen,my.localPlayerN,my.playerN)
break
case 'gone':this.histAdd('Partner gone!')
my.nameThem=data.name
namesUpdate()
turnMsg('Partner gone!')
document.getElementById('nameThem').innerHTML=''
my.partnerQ=false
soundPlay('sndFail')
break
case 'gameNew':console.log('Recvd gameNew:',data)
this.histAdd('Told about a new game, size='+data.bdSz+', win length='+data.winLen)
my.partnerQ=true
radioSet('bdSz',my.bdSzs,data.bdSz)
radioSet('winLen',my.winLens,data.winLen)
document.getElementById('nameThem').innerHTML=data.name
my.localPlayerN=1-data.playingAsPlayerN
my.playerN=data.nextMoveIsPlayerN
var types=[];types[data.playingAsPlayerN]=1
types[my.localPlayerN]=0
for(var i=0;i<my.players.length;i++){var div=document.getElementById("playerType"+i);div.selectedIndex=types[i]
my.players[i].type=my.playerTypes[types[i]]}
console.log('socket.on gameNew my.players',my.players)
my.partnerQ=true
soundPlay('sndStart')
gameNew(true)
break
case 'move':this.moveRecv(data)
soundPlay('sndDrop')
break
default:}}
histAdd(s){console.log('hist',s)
this.lines=this.lines.slice(Math.max(this.lines.length-4,0))
this.lines.push(s)
var div=document.getElementById('sockTxt')
div.value=this.lines.join('\n')}
gameFind(bdSz,winLen,playerN){console.log('Sock gameFind',bdSz,winLen,playerN)
var data={msg:"gameFind",type:this.gameType,name:optGet('name'),code:my.code,publicQ:my.publicQ,bdSz:bdSz,winLen:winLen,playerN:playerN}
this.send(JSON.stringify(data));this.histAdd('Find a Partner for size='+bdSz+', win length='+winLen)}
gameStartNew(bdSz,winLen,playingAsPlayerN,nextMoveIsPlayerN){var data={msg:"gameNew",type:this.gameType,name:optGet('name'),code:my.code,publicQ:my.publicQ,bdSz:bdSz,winLen:winLen,playingAsPlayerN:playingAsPlayerN,nextMoveIsPlayerN:nextMoveIsPlayerN}
this.send(JSON.stringify(data))
this.histAdd('New game, size='+data.bdSz+', win length='+data.winLen)
bdReset()
turnMsg()}
moveSend(xn,yn,playerN){if(this.socket==null)this.run()
this.socket.send(JSON.stringify({msg:'move',xn:xn,yn:yn,playerN:playerN}));}
moveRecv(data){var tile=my.bd[data.xn][data.yn]
tile.playerN=data.playerN
tile.draw()
update(tile)
my.playerN=1-data.playerN}}
function parse(s){try{var data=JSON.parse(s)
return data}catch(e){return{}}}
function nameRand(){var alpha='abcdefghijlmnoprstuvwxyz'
var word=''
for(var i=0;i<4;i++){var ltr=alpha[Math.floor(Math.random()*alpha.length)];word+=ltr}
if(isRude(word)){word=nameRand()}
return word;}
function isRude(s){return(removeRude(s)!==s);}
function removeRude(word){var rudies=["(?:[f F]|[ph pH Ph PH])[u U v V](?:[c C (]|[k K])","[s S $ 5][h H][i I l ! 1][t T 7]","[b B 3][u U v V][g G 6][g G 6][e E 3][r R]","[b B 3][u U v V][m M]","[a A @][r R][s S $ 5][e E 3]","\b[a A @][s S $ 5][s S $ 5]\b","[b B I3 l3 i3][a A @][s S $ 5][t T 7][a A @][r R][d D]","[b B I3 l3 i3][i I l ! 1][t T 7](?:[c C (]|[k K])[h H]","(?:[c C (]|[k K])[l L 1 ! i][i I l ! 1][t T 7]","\b(?:[c C (]|[k K])[r R][a A @][p P]","(?:[c C (]|[k K])[u U v V][n N][t T 7]","[d D][i I l ! 1](?:[c C (]|[k K])","[n N][i I l ! 1][g G 6][g G 6][e E 3][r R]","[p P][e E 3][n N][i I l ! 1][s S $ 5]","[v V u U][a A @][g G 6][i I l ! 1][n N][a A @]","[t T 7][w W vv VV][a A @][t T 7]","[w W][a A @][n N](?:[c C (]|[k K])","[a A @][n N][u U v V][s S $ 5]","[p P][o O 0][o O 0]\b","[p P][u U v V][s S $ 5][s S $ 5][y Y]","[p P][i I l ! 1][s S $ 5][s S $ 5]","[t T 7][i I l ! 1][t T 7][s S $ 5]","[s S $ 5][u U v V](?:[c C (]|[k K])","(?:[c C (]|[k K])[o O 0](?:[c C (]|[k K])","[s S $ 5][e E 3][x X]","[r R][a A @][p P][e E 3]","[d D][a A @][m M][n N]"]
for(var i=0;i<rudies.length;i++){word=word.replace(new RegExp(rudies[i],'gi'),"*");}
return(word)}