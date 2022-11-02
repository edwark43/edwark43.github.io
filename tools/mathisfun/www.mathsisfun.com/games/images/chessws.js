var my={};var g_startOffset=null;var g_selectedPiece=null;var moveNumber=1;var g_allMoves=[];var g_playerWhite=true;var g_changingFen=false;var g_analyzing=false;var g_uiBoard;var g_cellSize;function chesswsMain(){var version='0.84';my.sttTime=performance.now()
my.opts={name:'user'}
my.bdSize=8
my.pcWd=Math.min(60,(window.innerWidth-30)/my.bdSize,(window.innerHeight-150)/my.bdSize)
g_cellSize=my.pcWd
my.bdWd=my.pcWd*my.bdSize
my.bdHt=my.bdWd
my.msg=''
my.dragQ=false;my.players=[{name:'White',clr:'white',typeN:0,time:'endless',style:'drop-shadow(2px 2px 5px #88f) drop-shadow(-2px -2px 5px #88f)'},{name:'Black',clr:'black',typeN:1,time:'endless',style:'drop-shadow(2px 2px 5px #f88) drop-shadow(-2px -2px 5px #f88)'}];my.currPlayerNum=0
my.playerTypes=[{name:'Human',aiQ:false,sockQ:false},{name:'Human (Remote)',aiQ:false,sockQ:true},{name:'Computer (Beginner)',aiQ:true,aiLevel:1,timeMax:3000,sockQ:false},{name:'Computer (Medium)',aiQ:true,aiLevel:2,sockQ:false},{name:'Computer (Challenging)',aiQ:true,aiLevel:3,sockQ:false},{name:'Computer (Hard)',aiQ:true,aiLevel:4,sockQ:false}]
my.imgSets=[{name:'Standard',prefix:'std',ext:'.png'},{name:'Maya',prefix:'maya',ext:'.svg'},{name:'Leipzig',prefix:'lpz',ext:'.svg'},{name:'Merida',prefix:'mer',ext:'.svg'},];my.imgSetN=0
my.times=[{name:'Endless',mm:60},{name:'1 Hour',mm:60},{name:'30 min',mm:30},{name:'20 min',mm:20},{name:'15 min',mm:15},{name:'10 min',mm:10},{name:'7 min',mm:7},{name:'5 min',mm:5}];my.timeN=0
my.sockQ=true
my.sock=new Sock('chess')
my.partnerQ=false
var s=''
my.sndHome='../images/sounds/index.html'
console.log('sounds',document.domain,my.sndHome)
s+='<audio id="sndmove" src="'+my.sndHome+'clook.mp3" preload="auto"></audio>'
s+='<audio id="sndtake" src="'+my.sndHome+'take.mp3" preload="auto"></audio>'
s+='<audio id="sndcheck" src="'+my.sndHome+'no.mp3" preload="auto"></audio>'
s+='<audio id="sndFail" src="'+my.sndHome+'wibble.mp3" preload="auto"></audio>'
s+='<audio id="sndStart" src="'+my.sndHome+'kalimba.mp3" preload="auto"></audio>'
my.snds=[];s+='<div id="main" style="position:relative; width:'+my.bdWd+'px; min-height:'+(my.bdHt+150)+'px; border: none;  background-color: white; margin:auto; display:block;">';s+='<div style="margin: 0 0 5px 0; height:40px; ">';s+='<div style="float:left;">';s+='<button id="newBtn" type="button" style="z-index:2;" class="clickbtn"  onclick="optpop()">New Game</button>';s+='</div>';s+='<div style="float:right">';my.soundQ=true
s+=soundBtnHTML()
s+='</div>';s+='<div id="msg" style="margin: 5px 0 0 0; font: bold 20px Arial; color: blue; text-align:center;"></div>';s+='</div>';s+='<div id="timers" style="display:none; margin:0 0 5px 0; height:44px; background-color:#cdf;border-radius:15px;">'
s+='<div style="display:inline-block; float:left;">'
s+='<div style="display:inline-block;" id="timer0"></div>'
s+='<div style="display:inline-block; height:11px; width:20px; padding-top:10px;  border-radius:15px; background-color:white; vertical-align:top; margin-top:12px; margin-left:3px;"></div>'
s+='</div>'
s+='<div style="display:inline-block; float:right; ">'
s+='<div style="display:inline-block; height:11px; width:20px; padding-top:10px; border-radius:15px; background-color:black; vertical-align:top; margin-top:12px; margin-right:3px;"></div>'
s+='<span id="timer1"></span>'
s+='</div>'
s+='</div>'
s+='<div id="names" style="font: 24px Arial; text-align:center; margin-top:5px;">';s+='<div id="nameUs" style="display:inline-block; font: 24px Arial; ">'+optGet('name')+'</div>'
s+=' vs '
s+='<div id="nameThem" style="display:inline-block; font: 24px Arial;">Them</div>'
s+=' '
s+='<div id="dbg" style="display:inline-block; font: 24px Arial;">Them</div>'
s+='</div>'
s+='<div style="position: relative; width:'+my.bdWd+'px; height:'+my.bdWd+'px;  text-align:center; margin:auto;">';s+='<div id="board" style="position: absolute; top: 0;"></div> ';s+='<div id="mouser" style="position: absolute; top: 0; width:'+my.bdWd+'px; height:'+my.bdWd+'px;"></div> ';s+='<div id="drag" style="position:absolute; pointer-events: none; "></div>';s+='</div>';s+=optPopHTML();s+='<div style="position: relative; margin: 5px 0 0 0; width:'+my.bdWd+'px; height: 100px; ">';s+='<textarea style="width:99%; height: 100px;" id="movelist"></textarea>';s+='</div>';if(false){s+='<div>';s+='<a id="AnalysisToggleLink" href="UIAnalyzeToggle()">Analysis: Off</a>';s+='</div>';}
s+='<textarea id="sockTxt" style="display:none; margin-top:9px; width: 99%; height:120px; border-radius: 10px; font: 14px Arial; background-color: #eeffee; " value="" ></textarea>';s+='<div id="output" style="display: none;"></div>';s+='<input id="FenTextBox" style="width:'+my.bdWd+'px; display: none;" onchange="UIChangeFEN()"/>';s+='<div style="position:relative; margin: 5px 0 0 0; text-align:center;font: 10px Arial; color: #aaa;">&copy; 2020 MathsIsFun.com  v'+version+'</div>';s+='</div>';document.write(s);soundToggle()
for(var i=0;i<my.players.length;i++){my.players[i].clock=new DigiClock(27,'24','timer'+i)}
el=document.getElementById('mouser');el.addEventListener("mousedown",onMouseDown,false);el.addEventListener('touchstart',ontouchstart,false);optpop();}
function namesUpdate(){document.getElementById('nameUs').innerHTML=optGet('name')
document.getElementById('nameThem').innerHTML=my.nameThem
document.getElementById('dbg').innerHTML='(loc='+my.localPlayerNum+', num='+my.currPlayerNum+')'
var s=''
if(my.msg.length>0)s+=my.msg+'<br>'
if(my.partnerQ){if(my.localPlayerNum==my.currPlayerNum){s+='Your Turn ('+my.players[my.currPlayerNum].name+")"}else{s+='Waiting for '+my.players[my.currPlayerNum].name}}
document.getElementById("msg").innerHTML=s}
function playerChg(){my.currPlayerNum=1-my.currPlayerNum
console.log('playerChg',my.currPlayerNum,my.players[my.currPlayerNum].name)
my.players[my.currPlayerNum].clock.resume()
my.players[1-my.currPlayerNum].clock.stop()}
function gameOver(){my.gameOverQ=true
for(var i=0;i<my.players.length;i++){my.players[i].clock.stop()}}
function gameNew(rmtAskQ){rmtAskQ=typeof rmtAskQ!=='undefined'?rmtAskQ:false
console.log('gameNew rmtAskQ='+rmtAskQ)
var timersQ=false
if(rmtAskQ){my.localPlayerNum=1
my.currPlayerNum=0}else{my.localPlayerNum=0
my.currPlayerNum=0}
msg('')
optSet('name',document.getElementById('name').value)
document.getElementById('nameUs').innerHTML=optGet('name')
my.code=document.getElementById('code').value
my.publicQ=!document.getElementById("privateQ").checked
console.log('gameNew privateQ='+document.getElementById("privateQ").checked,my.publicQ)
var div=document.getElementById("imgSet");my.imgSetN=div.selectedIndex;if(timersQ){my.players[my.currPlayerNum].clock.start()
var div=document.getElementById('timers')
div.style.display='block'}else{var div=document.getElementById('timers')
div.style.display='none'}
moveNumber=1;document.getElementById("movelist").value="";bdReset()
my.randCount=1;my.gameOverQ=false
var currType=my.players[my.currPlayerNum].typeN
console.log('currType',currType,my.playerTypes[currType])
if(my.playerTypes[currType].aiQ){aiMove();}
if(my.sockQ){if(!rmtAskQ){if(my.partnerQ){my.sock.gameStartNew()}else{my.sock.gameFind()}}else{}}}
function bdReset(){EnsureAnalysisStopped();ResetGame();if(InitializeBackgroundEngine()){g_backgroundEngine.postMessage("go");}
g_allMoves=[];RedrawBoard();}
function ontouchstart(evt){console.log("ontouchstart",evt);var touch=evt.targetTouches[0];evt.clientX=touch.clientX;evt.clientY=touch.clientY;evt.touchQ=true;evt.preventDefault();onMouseDown(evt)}
function ontouchmove(evt){var touch=evt.targetTouches[0];evt.clientX=touch.clientX;evt.clientY=touch.clientY;evt.touchQ=true;onMouseMove(evt);}
function ontouchend(evt){console.log("ontouchend");el.addEventListener('touchstart',ontouchstart,false);window.removeEventListener("touchend",ontouchend,false);if(my.dragQ){my.dragQ=false;var bRect=el.getBoundingClientRect();var mouseX=(evt.changedTouches[0].clientX-bRect.left);var mouseY=(evt.changedTouches[0].clientY-bRect.top);console.log("ontouchend",evt,mouseX,mouseY);pcDrop(mouseX,mouseY);window.removeEventListener("touchmove",ontouchmove,false);}}
function onMouseDown(evt){if(my.localPlayerNum!=my.currPlayerNum)return
var bRect=el.getBoundingClientRect();var mouseX=(evt.clientX-bRect.left);var mouseY=(evt.clientY-bRect.top);my.startX=Math.floor(mouseX/g_cellSize);my.startY=Math.floor(mouseY/g_cellSize);my.dragHoldX=mouseX-(my.startX*g_cellSize);my.dragHoldY=mouseY-(my.startY*g_cellSize);var piece=g_board[((my.startY+2)*0x10)+(g_playerWhite?my.startX:7-my.startX)+4];console.log('onMouseDown',piece,g_playerWhite,my.currPlayerNum,my.playerType,my.localPlayerNum)
var moves=GenerateValidMoves();var okMoves=[];for(var i=0;i<moves.length;i++){if((moves[i]&0xFF)==MakeSquare(my.startY,my.startX)){okMoves.push(moves[i]);}}
if(okMoves.length>0){my.dragQ=true;my.dragDiv=document.getElementById('drag');my.dragDiv.innerHTML='<img src="'+pcName(piece)+'" style="width:'+my.pcWd+'px;">';my.dragDiv.style.left=(mouseX-my.dragHoldX)+'px';my.dragDiv.style.top=(mouseY-my.dragHoldY)+'px';my.dragDiv.style.visibility='visible';hilite();for(i=0;i<okMoves.length;i++){var move=okMoves[i];var td=move2td(move,false);hilite(td,'#eee');if(i==0){td=move2td(move,true);while(td.firstChild){td.removeChild(td.firstChild);}}}
if(evt.touchQ){console.log("touchq");window.addEventListener("touchmove",ontouchmove,false);window.addEventListener("touchend",ontouchend,false);}else{window.addEventListener("mousemove",onMouseMove,false);window.addEventListener("mouseup",onMouseUp,false);}}}
function onMouseMove(evt){if(!my.dragQ)return;var bRect=el.getBoundingClientRect();var mouseX=(evt.clientX-bRect.left);var mouseY=(evt.clientY-bRect.top);my.dragDiv.style.left=(mouseX-my.dragHoldX)+'px';my.dragDiv.style.top=(mouseY-my.dragHoldY)+'px';}
function onMouseUp(evt){var bRect=el.getBoundingClientRect();var mouseX=(evt.clientX-bRect.left);var mouseY=(evt.clientY-bRect.top);window.removeEventListener("mousemove",onMouseUp,false);window.removeEventListener("mouseup",onMouseUp,false);if(my.dragQ){my.dragQ=false;pcDrop(mouseX,mouseY);window.removeEventListener("mousemove",onMouseMove,false);}}
function pcDrop(mouseX,mouseY){console.log('pcDrop',elapsed())
msg('')
soundPlay('sndmove')
my.dragDiv.style.visibility='hidden';my.endX=Math.floor(mouseX/g_cellSize);my.endY=Math.floor(mouseY/g_cellSize);my.dragQ=false;var moves=GenerateValidMoves();var move=null;for(var i=0;i<moves.length;i++){if((moves[i]&0xFF)==MakeSquare(my.startY,my.startX)&&((moves[i]>>8)&0xFF)==MakeSquare(my.endY,my.endX)){move=moves[i];}}
moveDo(move,false)}
function moveDo(move,toldAboutMoveQ){console.log('Chosen move: '+move,move2coords(move))
if(move!=null){my.players[my.currPlayerNum].clock.stop()
UpdatePgnTextBox(move);g_allMoves[g_allMoves.length]=move;MakeMove(move);my.currPlayerNum=1-my.currPlayerNum
my.players[my.currPlayerNum].clock.resume()
console.log('player changed to:',my.currPlayerNum,my.players[my.currPlayerNum].name,'type '+my.players[my.currPlayerNum].typeN,elapsed())
namesUpdate()
var currType=my.players[my.currPlayerNum].typeN
console.log('currType',currType,my.playerTypes[currType])
if(my.playerTypes[currType].aiQ){if(InitializeBackgroundEngine()){g_backgroundEngine.postMessage('move '+FormatMove(move));}
UpdateFromMove(move);document.getElementById("FenTextBox").value=GetFen()
aiMove()}else{if(my.sockQ){if(!toldAboutMoveQ){my.sock.moveSend({move:move})}}
RedrawPieces();}}else{RedrawPieces();}
hilite();}
function setTime(ms){my.timeout=ms;}
function hilite(td,clr){if(td==null){for(y=0;y<8;++y){for(x=0;x<8;++x){var td=g_uiBoard[bdIndex(x,y)];td.style.boxShadow='';}}}else{var inset='inset 0px 0px 18px '+clr;td.style.boxShadow=inset+', '+inset;}}
function move2td(move,fromQ){var n=fromQ?move&0xFF:(move>>8)&0xFF;var row=((n-36)/16)<<0;var col=(n-4)%16;var td=g_uiBoard[bdIndex(col,row)];return td;}
function move2coords(move){var coords=[]
for(var i=0;i<2;i++){var fromQ=(i==0)
var n=fromQ?move&0xFF:(move>>8)&0xFF;var row=((n-36)/16)<<0;var col=(n-4)%16;coords.push([row,col])}
return coords}
function getRandomInt(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
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
function soundPlay(id,simulQ){if(!my.soundQ)return
simulQ=typeof simulQ!=='undefined'?simulQ:false
if(simulQ){if(id.length>0)document.getElementById(id).play()}else{my.snds.push(id)
soundPlayQueue(id)}}
function soundPlayQueue(id){var div=document.getElementById(my.snds[0])
div.play()
div.onended=function(){my.snds.shift();if(my.snds.length>0)soundPlayQueue(my.snds[0]);};}
function optPopHTML(){var s='';s+='<div id="optpop" style="position:absolute; left:-500px; top:0px; width:'+(my.bdWd-40)+'px; padding: 5px; border-radius: 9px; background-color: #bcd; box-shadow: 10px 10px 5px 0px rgba(40,40,40,0.75); transition: all linear 0.3s; opacity:0; text-align: center; ">';s+='<div style="float:right; margin: 0 0 5px 10px;">';s+='<button id="optYes" onclick="optYes()" style="z-index:2; font: 22px Arial;" class="togglebtn" >&#x2714;</button>';s+='<button onclick="optNo()" style="z-index:2; font: 22px Arial;" class="togglebtn" >&#x2718;</button>';s+='</div>';var times=[]
for(var i=0;i<my.times.length;i++){times.push(my.times[i].name)}
s+='<div id="optInside" style="display:none; margin: 5px auto 5px auto;">';var playerTypes=[]
for(var i=0;i<my.playerTypes.length;i++)playerTypes.push(my.playerTypes[i].name)
for(var i=my.players.length-1;i>=0;i--){var p=my.players[i];s+='<div style="font: 15px Verdana; color:'+p.clr+'; background-color: #57a; padding: 0 0 15px 0; border-radius: 10px;  border: 3px 3px 3px 3px;">';s+='<p style="font: 20px Verdana; height:15px; ">'+p.name+' player:</p>';s+='Type: ';s+=getDropdownHTML(playerTypes,'','playerType'+i,p.typeN);s+='<div style="margin-top:5px;">'
s+='Time: '
s+=getDropdownHTML(times,'','timeType'+i,0);s+='</div>';s+='</div>';}
s+='</div>';s+='<div id="optInside" style="margin: 5px auto 5px auto;">';var imgSets=[]
for(var i=0;i<my.imgSets.length;i++)imgSets.push(my.imgSets[i].name)
s+='Image Set: '
s+=getDropdownHTML(imgSets,'','imgSet',my.ingSetN);s+='</div>';my.code=nameRand()
s+='<div style="position:relative; margin:auto; text-align:center; font:14px Arial; background-color:lightblue;  margin: 5px 0 1px 0; padding: 5px 0 5px 0;">';s+='Name (optional): '
s+='<input id="name" style="width: 80px; border-radius: 10px; font: 18px Arial; background-color: #eeffee; text-align:center;" value="'+optGet('name')+'" />';s+='<br>'
s+='Code: '
s+='<input id="code" style="width: 80px; border-radius: 10px; font: 18px Arial; background-color: #eeffee; text-align:center;" value="'+my.code+'" />';s+='<br>'
s+='Partner must have code: '
s+='<input type="checkbox" id="privateQ" checked>'
s+='</div>'
s+='</div>';return s;}
function getDropdownHTML(opts,funcName,id,chkNo){var s='';s+='<select id="'+id+'" style="font: 14px Arial; color: #6600cc; background: white; padding: 1px;line-height:30px; border-radius: 5px;">';for(var i=0;i<opts.length;i++){var idStr=id+i;var chkStr=i==chkNo?'selected':'';s+='<option id="'+idStr+'" value="'+opts[i]+'" style="height:21px;" '+chkStr+' >'+opts[i]+'</option>';}
s+='</select>';return s;}
function optpop(){var pop=document.getElementById('optpop');pop.style.transitionDuration="0.3s";pop.style.opacity=1;pop.style.zIndex=12;pop.style.left='10px';}
function optYes(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-999px';gameNew(false);}
function optNo(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-999px';}
function EnsureAnalysisStopped(){if(g_analyzing&&g_backgroundEngine!=null){g_backgroundEngine.terminate();g_backgroundEngine=null;}}
function UIAnalyzeToggle(){if(InitializeBackgroundEngine()){if(!g_analyzing){g_backgroundEngine.postMessage("analyze");}else{EnsureAnalysisStopped();}
g_analyzing=!g_analyzing;document.getElementById("AnalysisToggleLink").innerText=g_analyzing?"Analysis: On":"Analysis: Off";}else{alert("Your browser must support web workers for analysis - (chrome4, ff4, safari)");}}
function UIChangeFEN(){if(!g_changingFen){var fenTextBox=document.getElementById("FenTextBox");var result=InitializeFromFen(fenTextBox.value);if(result.length!=0){UpdatePVDisplay(result);return;}else{UpdatePVDisplay('');}
g_allMoves=[];EnsureAnalysisStopped();InitializeBackgroundEngine();g_playerWhite=!!g_toMove;g_backgroundEngine.postMessage("position "+GetFen());RedrawBoard();}}
function moveListAdd(s){var div=document.getElementById("movelist")
div.value+=s+' '}
function UpdatePgnTextBox(move){var s=''
if(g_toMove!=0){if(moveNumber>1)s+=' '
s+=moveNumber+'. '
moveNumber++;}
console.log('UpdatePgnTextBox',move)
var mv=GetMoveSAN(move);s+=mv
moveListAdd(s)
if(mv.charAt(mv.length-1)=='+'){msg('Check')
soundPlay('sndcheck',true)}
if(mv.charAt(mv.length-1)=='#'){msg('CheckMate!')
console.log('CheckMate!')
gameOver()
soundPlay('sndcheck',true)}
if(mv.indexOf('x')>0){soundPlay('sndtake',true)}}
function msg(s){my.msg=s
namesUpdate()}
function UIChangeTimePerMove(){var timePerMove=document.getElementById("TimePerMove");g_timeout=parseInt(timePerMove.value,10);}
function FinishMove(bestMove,value,timeTaken,ply){if(bestMove!=null){UIPlayMove(bestMove,BuildPVMessage(bestMove,value,timeTaken,ply));}else{alert("Checkmate!");}}
function UIPlayMove(move,pv){UpdatePgnTextBox(move);g_allMoves[g_allMoves.length]=move;MakeMove(move);UpdatePVDisplay(pv);UpdateFromMove(move);td=move2td(move,false);hilite(td,'#dd0');td=move2td(move,true);hilite(td,'green');}
function UIUndoMove(){if(g_allMoves.length==0){return;}
if(g_backgroundEngine!=null){g_backgroundEngine.terminate();g_backgroundEngine=null;}
var curTyp=my.players[my.currPlayerNum].typeN
var nxtTyp=my.players[1-my.currPlayerNum].typeN
if(curTyp==0&&nxtTyp==0){UnmakeMove(g_allMoves[g_allMoves.length-1]);g_allMoves.pop();moveListAdd('Undo')
my.currPlayerNum=1-my.currPlayerNum}else{if(g_allMoves.length>=2){UnmakeMove(g_allMoves[g_allMoves.length-1]);g_allMoves.pop();UnmakeMove(g_allMoves[g_allMoves.length-1]);g_allMoves.pop();moveListAdd('Undo2')}}
RedrawBoard();}
function UpdatePVDisplay(pv){if(pv!=null){var outputDiv=document.getElementById("output");if(outputDiv.firstChild!=null){outputDiv.removeChild(outputDiv.firstChild);}
outputDiv.appendChild(document.createTextNode(pv));}}
function aiMove(){console.log('aiMove',moveNumber,my.currPlayerNum,my.players[my.currPlayerNum].name,elapsed())
if(moveNumber>250){msg('Draw (too many moves)')
return;}
if(my.gameOverQ)return
hilite()
if(g_analyzing){EnsureAnalysisStopped();InitializeBackgroundEngine();g_backgroundEngine.postMessage("position "+GetFen());g_backgroundEngine.postMessage("analyze");return;}
var currType=my.players[my.currPlayerNum].typeN;var playerType=my.playerTypes[currType];var aiLevel=playerType.aiLevel
console.log('ai',currType,playerType,aiLevel)
var maxPly=1;var rand='n';switch(aiLevel){case 1:var prevRate=my.randCount/moveNumber;if(prevRate>0.3){rand='n';}else{if(prevRate<0.1){rand='y';}else{if(Math.random()<0.2){rand='y';}}}
if(rand=='y')my.randCount++;maxPly=1;g_timeout=40;break;case 2:maxPly=getRandomInt(1,3);g_timeout=100;break;case 3:maxPly=getRandomInt(2,5);g_timeout=500;break;case 4:maxPly=99;g_timeout=3000;break;}
if(InitializeBackgroundEngine()){console.log('aiMove postMessage ',g_timeout,maxPly,rand,elapsed())
g_backgroundEngine.postMessage("search "+g_timeout+' '+maxPly+' '+rand);}else{console.log('QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ')
Search(FinishMove,2,null);}
setTimeout("aiDone()",g_timeout+300);}
function aiDone(){soundPlay('sndmove')
console.log('aiDone',my.currPlayerNum,my.players[my.currPlayerNum].name,elapsed())
if(my.gameOverQ)return
msg('')
my.players[my.currPlayerNum].clock.stop()
my.currPlayerNum=1-my.currPlayerNum
my.players[my.currPlayerNum].clock.resume()
var currType=my.players[my.currPlayerNum].typeN
console.log('aiDone type',currType,my.playerTypes[currType])
if(my.playerTypes[currType].aiQ){aiMove();}}
function plyDone(bestMove,value,timeTaken,ply){console.log("plyDone",bestMove,value,timeTaken,ply);}
var g_backgroundEngineValid=true;var g_backgroundEngine;function InitializeBackgroundEngine(){if(!g_backgroundEngineValid){return false;}
if(g_backgroundEngine==null){g_backgroundEngineValid=true;try{g_backgroundEngine=new Worker("images/garbochess.js");g_backgroundEngine.onmessage=function(e){if(e.data.match("^pv")=="pv"){UpdatePVDisplay(e.data.substr(3,e.data.length-3));}else if(e.data.match("^message")=="message"){EnsureAnalysisStopped();UpdatePVDisplay(e.data.substr(8,e.data.length-8));}else{UIPlayMove(GetMoveFromString(e.data),null);}}
g_backgroundEngine.error=function(e){console.log("Error from background worker:"+e.message);}
g_backgroundEngine.postMessage("position "+GetFen());}catch(error){g_backgroundEngineValid=false;}}
return g_backgroundEngineValid;}
function UpdateFromMove(move){var fromX=(move&0xF)-4;var fromY=((move>>4)&0xF)-2;var toX=((move>>8)&0xF)-4;var toY=((move>>12)&0xF)-2;if(!g_playerWhite){fromY=7-fromY;toY=7-toY;fromX=7-fromX;toX=7-toX;}
if((move&moveflagCastleKing)||(move&moveflagCastleQueen)||(move&moveflagEPC)||(move&moveflagPromotion)){RedrawPieces();}else{var fromSquare=g_uiBoard[bdIndex(fromX,fromY)];var toDiv=g_uiBoard[bdIndex(toX,toY)];toDiv.innerHTML='';RedrawPieces();}}
function pcName(piece){var pcTyp=null;switch(piece&0x7){case piecePawn:pcTyp='p';break;case pieceKnight:pcTyp='n';break;case pieceBishop:pcTyp='b';break;case pieceRook:pcTyp='r';break;case pieceQueen:pcTyp='q';break;case pieceKing:pcTyp='k';break;}
if(pcTyp==null){return null;}else{var imgSet=my.imgSets[my.imgSetN];var pcClr=(piece&0x8)?"w":"b";return 'images/chess/'+imgSet.prefix+pcClr+pcTyp+imgSet.ext}}
function bdIndex(xn,yn,flipQ){flipQ=typeof flipQ!=='undefined'?flipQ:false
if(flipQ){return yn*8+xn}else{return(7-yn)*8+(7-xn)}}
function RedrawPieces(){for(y=0;y<8;++y){for(x=0;x<8;++x){var td=g_uiBoard[bdIndex(x,y)];var pieceY=g_playerWhite?y:7-y;var piece=g_board[((pieceY+2)*0x10)+(g_playerWhite?x:7-x)+4];var pieceName=pcName(piece);if(pieceName!=null){var img=document.createElement("div");var setNo=1;var pcClr=(piece&0x8)?"w":"b";img.style.backgroundImage='url("'+pieceName+'")';img.style.backgroundSize=g_cellSize+'px '+g_cellSize+'px';img.style.width=g_cellSize+'px';img.style.height=g_cellSize+'px';var divimg=document.createElement("div");divimg.appendChild(img);td.innerHTML='';td.appendChild(divimg);}else{td.innerHTML='';}}}}
function RedrawBoard(){var div=document.getElementById('board');var table=document.createElement("table");table.cellPadding="0px";table.cellSpacing="0px";if(table.classList)
table.classList.add('no-highlight');else
table.className+=' '+'no-highlight';var tbody=document.createElement("tbody");g_uiBoard=[];for(y=0;y<8;++y){var tr=document.createElement("tr");for(x=0;x<8;++x){var td=document.createElement("td");td.style.width=g_cellSize+"px";td.style.height=g_cellSize+"px";td.style.backgroundColor=((y^x)&1)?"#b58863":"#f0d9b5";tr.appendChild(td);g_uiBoard[bdIndex(x,y)]=td;}
tbody.appendChild(tr);}
table.appendChild(tbody);RedrawPieces();div.innerHTML='';div.appendChild(table);g_changingFen=true;document.getElementById("FenTextBox").value=GetFen();g_changingFen=false;}
function timesUp(me){console.log('timesUp',me.id)
var p=my.players[me.id]
msg(p.name+"'s Time is Up! ")}
function DigiClock(ht,mode,divName){this.numHt=ht
this.mode=mode
this.upQ=true
this.fromTime=0
this.hhQ=false
this.mmQ=true
this.ssQ=true
this.msQ=false
this.numWd=this.numHt*0.45
this.numGap=this.numWd*0.5
this.border=this.numHt*0.3
this.ht=this.numHt+this.border*2
var wd=0
var colonWd=this.numWd*0.7
if(this.hhQ)wd+=2*(this.numWd+this.numGap)+colonWd
if(this.mmQ)wd+=2*(this.numWd+this.numGap)+colonWd
if(this.ssQ)wd+=2*(this.numWd+this.numGap)+colonWd
if(this.msQ)wd+=3*(this.numWd+this.numGap)+colonWd
wd-=this.numGap
wd-=colonWd
wd+=this.numGap/2
this.wd=wd+this.border*2
this.type='led'
switch(this.type){case 'lcd':this.clr={bg:'#ccc',border:'2px solid #888',on:'#222',off:'#ccc',shadow:'#ccc',shadowBlur:0}
break
case 'led':this.clr={bg:'#222',border:'2px solid black',on:'rgb(100, 255, 0)',off:'rgb(50, 80, 0)',shadow:'rgb(100, 255, 0)',shadowBlur:33}
break
default:}
var div=document.getElementById(divName)
div.style.height=this.ht+'px'
div.style.width=this.wd+'px'
this.el=document.createElement("canvas");div.appendChild(this.el)
this.el.style.backgroundColor=this.clr.bg;this.el.style.borderRadius="10px";var ratio=2;this.el.width=this.wd*ratio;this.el.height=this.ht*ratio;this.el.style.width=this.wd+"px";this.el.style.height=this.ht+"px";this.g=this.el.getContext("2d");this.g.setTransform(ratio,0,0,ratio,0,0);this.numbers={n0:[1,1,1,0,1,1,1],n1:[0,0,1,0,0,1,0],n2:[1,0,1,1,1,0,1],n3:[1,0,1,1,0,1,1],n4:[0,1,1,1,0,1,0],n5:[1,1,0,1,0,1,1],n6:[0,1,0,1,1,1,1],n7:[1,0,1,0,0,1,0],n8:[1,1,1,1,1,1,1],n9:[1,1,1,1,0,1,1],A:[1,1,1,1,1,1,0],P:[1,1,1,1,1,0,0]};this.stt=performance.now();this.sofar=0
this.update()}
DigiClock.prototype.setTime=function(h,m,s){this.fromTime=(((h*60)+m)*60+s)*1000
this.sofar=0
this.stt=performance.now();this.update()}
DigiClock.prototype.start=function(){this.stt=performance.now();this.stopQ=false;this.sofar=0
this.loop()}
DigiClock.prototype.stop=function(){this.stopQ=true
this.sofar=this.total()}
DigiClock.prototype.resume=function(){this.stt=performance.now()
this.stopQ=false
console.log('resume',this.id,this.sofar/1000,elapsed(),this.resume.caller.name)
this.loop()}
DigiClock.prototype.loop=function(){if(!this.stopQ){this.update()
requestAnimationFrame(this.loop.bind(this));}}
DigiClock.prototype.total=function(){var elapsed=performance.now()-this.stt
elapsed+=this.sofar
return elapsed}
DigiClock.prototype.clear=function(){this.g.clearRect(0,0,this.wd,this.ht);}
DigiClock.prototype.update=function(){this.g.clearRect(0,0,this.wd,this.ht);var elapsed=this.total();if(!this.upQ){elapsed=this.fromTime-elapsed
if(elapsed<0){if(!this.stopQ){this.stopQ=true
timesUp(this);elapsed=0}}}
var hours=elapsed/3.6e6|0;var minutes=elapsed%3.6e6/6e4|0;var seconds=elapsed%6e4/1e3|0;var millis=elapsed%1e3|0;if(hours<10){hours='0'+hours;}
if(minutes<10){minutes='0'+minutes;}
if(seconds<10){seconds='0'+seconds;}
millis=pad('000',''+millis,true)
var timeStr=''
if(this.hhQ)timeStr+=hours
if(this.mmQ)timeStr+=minutes
if(this.ssQ)timeStr+=seconds
if(this.msQ)timeStr+=millis
var posX=this.border
var posY=this.border
for(var i=0;i<timeStr.length;i++){if('n'+timeStr[i]in this.numbers){this.drawNum(posX,posY,this.numbers['n'+timeStr[i]]);posX+=this.numWd
posX+=this.numGap
if(i%2&&i<timeStr.length-2){this.setClr(seconds%2);posX+=this.numWd*0.15
this.colon(posX,posY+this.numHt/2,seconds)
posX+=this.numWd*0.55}}}}
DigiClock.prototype.drawNum=function(x,y,numArray,scale){scale=typeof scale!=='undefined'?scale:1
for(var i=0;i<numArray.length;i++){this.segment(x,y,numArray[i],i,scale);}}
DigiClock.prototype.segment=function(x,y,onQ,position,scale){this.setClr(onQ);var startX=x;var startY=y
var m=this.numHt*0.09
var wd,ht;if(position===0||position===3||position===6){wd=this.numHt*0.36
ht=this.numHt*0.09}else{wd=this.numHt*0.09
ht=this.numHt*0.36}
if(scale!=1){m*=scale
wd*=scale
ht*=scale}
var g=this.g
switch(position){case 0:g.bar(startX+m,startY,wd,ht);break;case 1:g.bar(startX,startY+m,wd,ht);break;case 2:g.bar(startX+wd+ht,startY+m,wd,ht);break;case 3:g.bar(startX+m,startY+wd+ht,wd,ht);break;case 4:g.bar(startX,startY+m+wd+ht,wd,ht);break;case 5:g.bar(startX+wd+ht,startY+m+wd+ht,wd,ht);break;case 6:g.bar(startX+m,startY+2*wd+ht+m,wd,ht);break;}}
DigiClock.prototype.colon=function(x,y,sec){var height=this.numHt*0.15;var width=height*0.5
var yLen=height*0.4
var g=this.g
if(sec%2){g.fillStyle=this.clr.on;}
g.bar(x,y-yLen-height,width,height);g.bar(x,y+yLen,width,height);}
DigiClock.prototype.setClr=function(onQ){var g=this.g
g.shadowColor=this.clr.shadow;if(onQ){g.fillStyle=this.clr.on
g.shadowBlur=this.clr.shadowBlur}else{g.fillStyle=this.clr.off
g.shadowBlur=0}}
CanvasRenderingContext2D.prototype.bar=function(x,y,w,h){var g=this;if(h<w){g.beginPath();g.moveTo(x,y);g.lineTo(x+w,y);g.lineTo(x+w+h/2,y+h/2);g.lineTo(x+w,y+h);g.lineTo(x,y+h);g.lineTo(x-h/2,y+h/2);g.closePath();g.fill();}else{g.beginPath();g.moveTo(x,y);g.lineTo(x+w/2,y-w/2);g.lineTo(x+w,y);g.lineTo(x+w,y+h);g.lineTo(x+w/2,y+h+w/2);g.lineTo(x,y+h);g.closePath();g.fill();}}
function PlayBtn(w,id,fn,onClass,offClass){this.w=w
this.id=id
this.fn=fn
this.onClass=onClass
this.offClass=offClass}
PlayBtn.prototype.html=function(){var w=this.w
var s='';s+='<style type="text/css">';s+='.btn {display: inline-block; position: relative; width:'+w+'px; height:'+w+'px; margin-right:'+w*0.2+'px; padding: .6em; border: 0 solid rgba(208,208,248,1); border-radius: 10em; background: linear-gradient(#fff, #ccf), #c9c5c9; box-shadow: 0 3 4 rgba(0,0,0,.4); }';s+='.btn:hover {background: linear-gradient(#f5f5f5, #b9b9b9), #c9c5c9; }';s+='.btn:before, button:after {content: " "; position: absolute; }';s+='.btn:active {top:'+w*0.05+'px; box-shadow: 0 '+w*0.02+'px '+w*0.03+'px rgba(0,0,0,.4); }';s+='.play:before {  left: '+w*0.36+'px; top: '+w*0.22+'px; width: 0; height: 0; border: '+w*0.3+'px solid transparent; border-left-width: '+w*0.4+'px; border-left-color: blue;  }';s+='.play:hover:before {border-left-color: yellow; }';s+='.pause:before, .pause:after {display: block; left: '+w*0.29+'px; top: '+w*0.28+'px; width: '+w*0.19+'px; height: '+w*0.47+'px; background-color: blue; }';s+='.pause:after {left: '+w*0.54+'px; }';s+='.pause:hover:before, .pause:hover:after {background-color: yellow; }';s+='.stop:before, .stop:after {display: block; left: '+w*0.26+'px; top: '+w*0.26+'px; width: '+w*0.47+'px; height: '+w*0.47+'px; background-color: blue; border: none;}';s+='.stop:hover:before, .stop:hover:after {background-color: yellow; }';s+='</style>';s+='<button id="'+this.id+'" class="btn play" onclick="'+this.fn+'" ></button>';return s;}
PlayBtn.prototype.toggle=function(){var div=document.getElementById(this.id)
if(my.playQ){my.playQ=false;div.classList.add(this.offClass);div.classList.remove(this.onClass);my.digi.stop()}else{my.playQ=true;div.classList.add(this.onClass);div.classList.remove(this.offClass);my.digi.resume()}}
function pad(padFull,str,leftPadded){if(str==undefined)return padFull;if(leftPadded){return(padFull+str).slice(-padFull.length);}else{return(str+padFull).substring(0,padFull.length);}}
function elapsed(){return(performance.now()-my.sttTime)/1000}
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
msg('Waiting for partner, code '+my.code)
my.partnerQ=false
break
case 'waitOver':console.log('waitOver:',data)
this.histAdd('New partner found: '+data.name)
my.nameThem=data.name
my.localPlayerNum=0
my.currPlayerNum=0
my.partnerQ=true
msg('')
soundPlay('sndStart')
this.gameStartNew()
break
case 'gone':this.histAdd('Partner gone!')
my.nameThem=data.name
namesUpdate()
msg('Partner gone!')
my.partnerQ=false
soundPlay('sndFail')
break
case 'gameNew':console.log('Recvd gameNew:',data)
this.histAdd('Told about a new game:'+JSON.stringify(data))
my.partnerQ=true
my.localPlayerNum=1
my.currPlayerNum=0
my.nameThem=data.name
namesUpdate()
var types=[];soundPlay('sndStart')
gameNew(true)
break
case 'move':this.moveRecv(data)
soundPlay('sndmove')
break
default:}}
histAdd(s){console.log('hist',s)
this.lines=this.lines.slice(Math.max(this.lines.length-4,0))
this.lines.push(s)
var div=document.getElementById('sockTxt')
div.value=this.lines.join('\n')}
gameFind(){console.log('Sock gameFind')
var data={msg:"gameFind",type:this.gameType,name:optGet('name'),code:my.code,publicQ:my.publicQ}
this.send(JSON.stringify(data));this.histAdd('Find a Partner for game: '+JSON.stringify(data))}
gameStartNew(){var data={msg:"gameNew",type:this.gameType,name:optGet('name'),code:my.code,publicQ:my.publicQ,}
this.send(JSON.stringify(data))
this.histAdd('New game: '+JSON.stringify(data))
bdReset()}
moveSend(data){if(this.socket==null)this.run()
data.msg='move'
this.socket.send(JSON.stringify(data));}
moveRecv(data){this.histAdd('Move received '+JSON.stringify(data))
moveDo(data.move,true)}}
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