var w,h,g,my={};function sudokuMain(){my.version='0.562';w=360;h=454
my.bdSzs=[9]
my.levels=[{name:'Beginner',type:"easy",blankN:19},{name:'Medium',type:"medium",blankN:28},{name:'Challenging',type:"hard",blankN:37},{name:'Hard',type:"very-hard",blankN:46},{name:'Tough',type:"insane",blankN:55},{name:'Brutal',type:"inhuman",blankN:64},]
my.bdStyles=[{name:'simple',checkQ:false},{name:'fancy',checkQ:false}]
my.bdStyle=my.bdStyles[1];my.activeQ=false
var s='';s+=arrowBoxHTML()
s+='<style>'
s+='.btn { display: inline-block; position: relative; text-align: center; margin: 2px; text-decoration: none; font: 15px/25px Arial, sans-serif; color: #268; border: 1px solid #88aaff; border-radius: 10px;cursor: pointer; background: linear-gradient(to top right, rgba(170,190,255,1) 0%, rgba(255,255,255,1) 100%); outline-style:none;}'
s+='.btn:hover { background: linear-gradient(to top, rgba(255,255,0,1) 0%, rgba(255,255,255,1) 100%); }'
s+='.yy { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(255,220,130,1) 0%, rgba(255,255,255,1) 100%);  }'
s+='.hi { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(130,220,255,1) 0%, rgba(255,255,255,1) 100%); box-shadow: 2px 2px 6px #66a; }'
s+='.lo { border: solid 1px #888888; background: linear-gradient(to top, rgba(170,170,170,1) 0%, rgba(205,205,205,1) 100%);  }'
s+='</style>'
my.sndHome=(document.domain=='localhost')?'/mathsisfun/images/sounds/':'/images/sounds/'
s+='<audio id="sndWin" src="'+my.sndHome+'kids-cheer.mp3" preload="auto"></audio>';s+='<audio id="sndPlace" src="'+my.sndHome+'click1.mp3" preload="auto"></audio>';s+='<audio id="sndClear" src="'+my.sndHome+'pheew.mp3" preload="auto"></audio>';my.snds=[];s+='<div id="main" style="position:relative; width:'+w+'px; min-height:'+h+'px; background-xnor: white; margin:auto; display:block; border: none; border-radius: 10px;">';s+='<div id="top" style="font: 24px Arial; text-align:left; margin:3px; height:34px;">'
s+='<div id="btns" style="position:absolute; left: 3px; font: 18px Arial; width:99%;">'
s+='<button type="button" style="z-index:2;" class="btn" onclick="optPop()">Options</button>'
s+='<button type="button" style="z-index:2;" class="btn" onclick="gameNew()">New Game</button>'
s+='<button type="button" style="z-index:2;" class="btn" onclick="gameSolve()">Solve</button>'
s+='<button type="button" style="z-index:2;" class="btn" onclick="gameReset()">Reset</button>'
my.soundQ=true
s+='&nbsp;'
s+=soundBtnHTML()
s+='<br>'
s+='<button type="button" style="z-index:2; margin-top:7px;" class="btn" onclick="gameUndo()">Undo</button>'
s+='<button type="button" style="z-index:2; margin-top:7px; float:right;" class="btn" onclick="gameSolveCheck()">Check</button>'
s+='</div>'
s+='</div>'
s+='<div id="msg" style="font: 24px Arial; text-align:center; padding-top:5px; height:30px; background-color:#ffffe8; border-radius: 10px;">?</div>'
s+='<canvas id="canvas1" style="position: absolute; width:'+w+'px; height:'+w+'px; left: 0px; top: 0px; border: none; pointer-events: none; z-index:2;"></canvas>';s+='<div id="board" style=""></div>';s+='<div id="ansBox" class="arrowTop" style="position: absolute; left: 50px; top: 6px; visibility: hidden;  z-index:3;"></div>';s+=optPopHTML();s+='<canvas id="timercanvas" width="100" height="100" style="z-index:2;  width:100px;"></canvas>';s+='<div id="copyrt" style="font: 11px Arial; color: #6600cc; position:absolute; bottom:5px; left:5px; text-align:center;">&copy; 2019 MathsIsFun.com  v'+my.version+'</div>';s+='</div>';document.write(s);var el=document.getElementById('canvas1');var ratio=3;el.width=w*ratio;el.height=h*ratio;el.style.width=w+"px";el.style.height=h+"px";g=el.getContext("2d");g.setTransform(ratio,0,0,ratio,0,0);my.clrs=[["Blue",'#0000FF'],["Red",'#FF0000'],["Black",'#000000'],["Green",'#00cc00'],["Orange",'#FFA500'],["Slate Blue",'#6A5ACD'],["Lime",'#00FF00'],["Spring Green",'#00FF7F'],["Teal",'#008080'],["Gold",'#ffd700'],["Med Purple",'#aa00aa'],["Light Blue",'#ADD8E6'],["Navy",'#000080'],["Purple",'#800080'],["Dark SeaGreen",'#8FBC8F']];my.clrNum=0;my.game=new Sudoku()
my.hintQ=false
my.clrNumQ=false
my.bd=[]
optPop()}
function gameNew(){my.bdSz=9
bdMake()
document.getElementById('ansBox').style.visibility='hidden';my.hist=[]
var levelStr=document.querySelector('input[name="level"]:checked').value
my.level=my.levels[0]
for(var i=0;i<my.levels.length;i++){var level=my.levels[i]
if(level.name==levelStr){my.level=my.levels[i]
break}}
console.log('gameNew',levelStr,my.level)
var starttime=performance.now()
var blankN=my.level.blankN
var uniq=uniquePuzzleGen(blankN)
uniq=uniq.join('').split(',').join('')
console.log('unique: '+uniq);var bdStr=uniq
var elapsed=performance.now()-starttime;console.log('Solver elapsed time: '+elapsed+'ms');var n=0
for(var i=0;i<9;i++){for(var j=0;j<9;j++){var val=bdStr.charAt(n++)
var tile=my.bd[i][j]
if(val>=1&&val<=9){tile.val=val
tile.origQ=true}}}
bdCandUpdate()
bdDraw()
my.activeQ=true
msg('New game')}
function bdCandUpdate(){for(var i=0;i<9;i++){for(var j=0;j<9;j++){var tile=my.bd[i][j]
var cands=[1,2,3,4,5,6,7,8,9]
if(tile.val==''){for(var k=0;k<9;k++){var index=cands.indexOf(parseInt(my.bd[i][k].val))
if(index>-1)cands.splice(index,1)}
for(var k=0;k<9;k++){var index=cands.indexOf(parseInt(my.bd[k][j].val))
if(index>-1)cands.splice(index,1)}
var iStt=parseInt(i/3)*3
var jStt=parseInt(j/3)*3
for(var k=iStt;k<iStt+3;k++){for(var l=jStt;l<jStt+3;l++){var index=cands.indexOf(parseInt(my.bd[k][l].val))
if(index>-1)cands.splice(index,1)}}
var was=tile.cands.join()
tile.cands=cands
if(was!=cands.join()){tile.draw()}}}}}
function gameSolve(){var bdStr=''
for(var i=0;i<9;i++){for(var j=0;j<9;j++){var tile=my.bd[i][j]
if(tile.origQ){bdStr+=tile.val}else{bdStr+='.'}}}
var soln=my.game.solve(bdStr)
console.log('gameSolve',bdStr)
console.log('gameSolve',soln)
console.log('gameSolve',gameSolvable())
var bdStr=soln
var n=0
for(var i=0;i<9;i++){for(var j=0;j<9;j++){var val=bdStr.charAt(n++)
var tile=my.bd[i][j]
if(val>=1&&val<=9){tile.val=val
tile.draw()}}}
msg('Solution')
my.activeQ=false}
function gameSolvable(){var bdStr=bdString(my.bd,false)
var soln=my.game.solve(bdStr)
return(!!soln)}
function gameWinCheck(){var bdStr=bdString(my.bd,false)
var n=0
for(var i=0;i<bdStr.length;i++){var c=bdStr.charAt(i)
if(c>=1&&c<=9){}else{n++}}
if(n<5){msg(n+' left to go')}else{msg('')}
if(n==0){if(gameSolvable()){msg('You win!','gold')
soundPlay('sndWin')}else{msg('(not solved)','red')}}}
function gameSolveCheck(){msg(gameSolvable()?'Solvable':'Not Solvable')}
function gameReset(){for(var i=0;i<9;i++){for(var j=0;j<9;j++){var tile=my.bd[i][j]
if(!tile.origQ){tile.val=''
tile.draw()}}}
msg('Reset')
my.activeQ=true}
function gameUndo(){if(!my.activeQ)return
var step=my.hist.pop()
if(step){var tile=my.bd[step.xn][step.yn]
tile.valSet(step.was,false)}
gameWinCheck()
bdCandUpdate()}
function msg(s,clr){clr=typeof clr!=='undefined'?clr:'black'
var div=document.getElementById('msg')
div.innerHTML=s
div.style.color=clr}
function bdMake(){my.border=1
my.boxWd=Math.min(70,(Math.min(w-my.border*5,h-90))/my.bdSz)
my.borderTp=75
my.borderLt=(w-my.bdSz*my.boxWd)/2+my.border
var myNode=document.getElementById("board");while(myNode.firstChild){myNode.removeChild(myNode.firstChild);}
my.bd=[]
for(var xn=0;xn<my.bdSz;xn++){my.bd[xn]=[]
for(var yn=0;yn<my.bdSz;yn++){var tile=new Tile(my.boxWd,my.boxWd,xn,yn)
tile.xn=xn;tile.yn=yn;my.bd[xn][yn]=tile}}}
function bdDraw(){if(my.bd.length==0)return
for(var i=0;i<9;i++){for(var j=0;j<9;j++){var tile=my.bd[i][j]
tile.draw()}}
g.strokeStyle='#6aa'
g.lineWidth=2
g.fillStyle='#abc'
var wd=my.boxWd*3
for(var i=0;i<3;i++){var xp=boxLeft(i*3)
for(var j=0;j<3;j++){var yp=boxTop(j*3)
g.beginPath()
g.rect(xp,yp,wd,wd)
g.stroke()}}
g.strokeStyle='black'
g.fillStyle='black'
g.beginPath()
g.rect(boxLeft(0)-my.border,boxTop(0)-my.border,my.boxWd*9+my.border*2,my.boxWd*9+my.border*2)
g.stroke()}
function boxLeft(xn){return my.borderLt+my.boxWd*xn}
function boxTop(yn){return my.borderTp+my.boxWd*yn}
function arrowBoxHTML(){var s='';var bgClr='#cdf'
var borderClr='darkblue'
s+='<style type="text/css">';for(var i=0;i<2;i++){var classStr=(i==0)?'.arrowTop':'.arrowBot'
var topStr=(i==0)?'bottom':'top'
s+=classStr+' {position: relative; border: 2px solid '+borderClr+'; background: '+bgClr+'; width:98px; }';s+=classStr+':after, '+classStr+':before {'+topStr+': 100%; left: 50%; border: solid transparent; content: " "; height: 0; width: 0; position: absolute; pointer-events: none; }';s+=classStr+':after {border-color: rgba(0, 0, 0, 0); border-'+topStr+'-color: '+bgClr+'; border-width: 30px; margin-left: -29px; }';s+=classStr+':before {border-color: rgba(0, 0, 0, 0); border-'+topStr+'-color: '+borderClr+'; border-width: 32px; margin-left: -31px; }';}
s+='</style>';return s;}
function showOpts(me){var div=document.getElementById('ansBox')
if(me.origQ){div.style.visibility='hidden';return}
div.style.left=(boxLeft(me.xn-0.67))+'px'
if(me.yn<1){div.style.top=(boxTop(me.yn+1.5))+'px'
div.classList.remove("arrowBot")
div.classList.add("arrowTop")}else{div.style.top=(boxTop(me.yn-2.9))+'px'
div.classList.remove("arrowTop")
div.classList.add("arrowBot")}
div.style.visibility='visible';var s='';var anss=['-','-','X',1,2,3,4,5,6,7,8,9];var n=0;for(var i=0;i<4;i++){s+='<div style="font: 18px Verdana;">';for(var j=0;j<3;j++){var id=me.xn+'-'+me.yn+'-'+anss[n];s+='<div id="'+id+'" style="display: inline-block; width:30px; height:24px; line-height:24px; text-align: center;  border: 1px solid white; cursor:pointer;" onmousedown="doAns(this)">';var ans=anss[n]
if(ans=='-')ans='&nbsp;'
s+=ans
s+='</div>';n++;}
s+='</div>';}
div.innerHTML=s;}
function getChoices(xn,yn){var keys=[1,2,3,4,5,6,7,8,9];var choices=candFill(xn,yn)
for(var i=0;i<9;i++){if(choices.indexOf(keys[i])==-1){keys[i]='-'}}
return keys}
function bdString(bd,origQ){var s=''
for(var i=0;i<9;i++){for(var j=0;j<9;j++){var val=bd[i][j].val
if(origQ&&!bd[i][j].origQ){val='.'}else{if(val>=1&&val<=9){}else{val='.'}}
s+=val}}
return s}
function candFill(xn,yn){var starttime=performance.now()
var alpha='ABCDEFGHI'
var id=alpha.charAt(xn)+(yn+1)
var bdStr=bdString(my.bd)
my.cands=my.game._get_candidates_map(bdStr);console.log('my.cands',id,my.cands[id],my.cands)
var elapsed=performance.now()-starttime;console.log('Cand elapsed time: '+elapsed+'ms');return my.cands[id]}
function doAns(me){var ids=me.id.split('-');var xn=ids[0]
var yn=ids[1]
var tile=my.bd[xn][yn]
var div=document.getElementById('ansBox')
div.style.visibility='hidden';var val=ids[2]
if(val>=1&&val<=9)tile.valSet(val)
if(val=='')tile.valSet(val)
gameWinCheck()
bdCandUpdate()}
function radioHTML(prompt,id,lbls,func){var s='';s+='<div style="font: bold 16px Arial;">';s+=prompt;s+='</div>';s+='<div style="display:inline-block; border: 1px solid white; border-radius:5px; padding:3px; margin:3px; background-xnor:rgba(255,255,255,0.5);">';for(var i=0;i<lbls.length;i++){var lbl=lbls[i].name
var idi=id+i;var chkStr=(i==0)?' checked ':'';s+='<input id="'+idi+'" type="radio" name="'+id+'" value="'+lbl+'" onclick="'+func+'('+i+');" autocomplete="off" '+chkStr+' >';s+='<label for="'+idi+'">'+lbl+' </label>';}
s+='</div>';return s;}
function optPopHTML(){var s='';s+='<div id="optpop" style="position:absolute; left:-500px; top:20px; width:320px; padding: 5px; border-radius: 9px; font:14px Arial; background-color: #bcd; box-shadow: 10px 10px 5px 0px rgba(40,40,40,0.75); transition: all linear 0.3s; opacity:0; text-align: center; ">';s+='<div style="position:relative; margin:auto; background-color:lightblue;  margin: 5px 0 1px 0; padding: 5px 0 5px 0;">';s+=radioHTML('Level:','level',my.levels,'');s+='</div>'
s+='<div style="position:relative; margin:auto; background-color:lightblue;  margin: 5px 0 1px 0; padding: 5px 0 5px 0;">';s+='<button type="button" id="hintBtn" style="z-index:2;" class="btn lo" onclick="hintToggle()">Hints</button>'
s+='<button type="button" id="clrNumBtn" style="z-index:2;" class="btn lo" onclick="clrNumToggle()">Colored Numbers</button>'
s+='</div>'
s+='<div style="float:right; margin: 0 0 5px 10px; font:16px Arial;">';s+='New game? '
s+='<button id="optYes" onclick="optYes()" style="z-index:2; font: 22px Arial;" class="btn" >&#x2714;</button>';s+=' '
s+='<button onclick="optNo()" style="z-index:2; font: 22px Arial;" class="btn" >&#x2718;</button>';s+='</div>';s+='</div>';return s;}
function optPop(){var pop=document.getElementById('optpop');pop.style.transitionDuration="0.3s";pop.style.opacity=1;pop.style.zIndex=12;pop.style.left=(w-340)/2+'px';}
function optYes(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-999px';gameNew()}
function optNo(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-999px';}
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
function hintToggle(){my.hintQ=!my.hintQ;toggleBtn("hintBtn",my.hintQ);bdDraw()}
function clrNumToggle(){my.clrNumQ=!my.clrNumQ;toggleBtn("clrNumBtn",my.clrNumQ);bdDraw()}
function toggleBtn(btn,onq){if(onq){document.getElementById(btn).classList.add("hi");document.getElementById(btn).classList.remove("lo");}else{document.getElementById(btn).classList.add("lo");document.getElementById(btn).classList.remove("hi");}}
function soundPlay(name,simulQ){if(!my.soundQ)return
simulQ=typeof simulQ!=='undefined'?simulQ:true
if(simulQ){if(name.length>0){var div=document.getElementById(name)
if(div.currentTime>0&&div.currentTime<div.duration){console.log('soundPlay cloned',div.currentTime,div.duration)
div.cloneNode(true).play()}else{div.play()}}}else{my.snds.push(name)
soundPlayQueue()}}
function soundPlayQueue(){var div=document.getElementById(my.snds[0])
div.play()
div.onended=function(){my.snds.shift();if(my.snds.length>0)soundPlayQueue();};}
function soundToggle(){var btn='sound'
if(my.soundQ){my.soundQ=false
document.getElementById(btn).classList.add("mute")}else{my.soundQ=true
document.getElementById(btn).classList.remove("mute")}}
function Timer(g,rad,secs,clr,funcEnd){this.g=g;this.rad=rad;this.secs=secs;this.clr=clr;this.funcEnd=funcEnd;this.x=rad;this.y=rad;this.stt=performance.now();this.stopQ=false;}
Timer.prototype.update=function(){};Timer.prototype.restart=function(secs){this.secs=secs;this.stt=performance.now();this.stopQ=false;requestAnimationFrame(this.draw.bind(this));};Timer.prototype.more=function(secs){this.stt+=secs*1000;};Timer.prototype.stop=function(){this.stopQ=true;};Timer.prototype.draw=function(){if(this.stopQ)return;var now=performance.now();var elapsed=now-this.stt;var ratio=Math.min(1,elapsed/this.secs/1000);var g=this.g;g.beginPath();g.fillStyle="#def";g.arc(this.x,this.y,this.rad,0,2*Math.PI);g.fill();g.beginPath();g.moveTo(this.x,this.y);g.fillStyle=this.clr;g.arc(this.x,this.y,this.rad,-Math.PI/2,ratio*2*Math.PI-Math.PI/2);g.fill();if(ratio<1){requestAnimationFrame(this.draw.bind(this));}else{this.funcEnd();}};function Tile(wd,ht,xn,yn){this.wd=wd
this.ht=ht
this.xn=xn
this.yn=yn
this.bgClr='#fef'
this.fgClr='black'
this.val=''
this.origQ=false
this.cands=[]
var div=document.createElement("div");div.style.width=wd+'px'
div.style.height=ht+'px'
div.style.position='absolute'
div.style.left=boxLeft(xn)+'px'
div.style.top=boxTop(yn)+'px'
this.div=div
var me=this
div.addEventListener('mouseover',function(){if(!my.activeQ)return})
div.addEventListener('mouseleave',function(){if(!my.activeQ)return})
div.addEventListener('click',function(){if(!my.activeQ)return
showOpts(me)})
var can=document.createElement('canvas');can.style.position="absolute";can.style.top='0px'
can.style.left='0px'
can.style.width='100%'
can.style.height='100%'
can.width=wd
can.height=ht
this.g=can.getContext("2d");div.appendChild(can)
document.getElementById('board').appendChild(div);this.draw()}
Tile.prototype.valSet=function(v,histQ){histQ=typeof histQ!=='undefined'?histQ:true
var was=this.val
if(v>=1&&v<=9){this.val=parseInt(v)
soundPlay('sndPlace')}else{this.val=''
soundPlay('sndClear')}
this.origQ=false
if(histQ)my.hist.push({xn:this.xn,yn:this.yn,was:was})
this.draw()}
Tile.prototype.draw=function(){var fgClr=this.origQ?'black':'orange'
if(this.val>=1&&this.val<=9){this.drawNum(this.val,fgClr)}else{this.drawHints('#444')}}
Tile.prototype.drawHints=function(clr){var g=this.g
g.clearRect(0,0,this.wd,this.ht)
if(my.hintQ){for(var i=0;i<this.cands.length;i++){var cand=this.cands[i]
var n=cand-1
var nx=(n%3)
var ny=parseInt(n/3)
g.fillStyle=clr
g.font="12px Arial";g.beginPath()
g.fillText(cand,5+nx*11,14+ny*11)
g.fill()}}}
Tile.prototype.drawNum=function(v,clr){var g=this.g
g.clearRect(0,0,this.wd,this.ht)
g.strokeStyle='black'
g.lineWidth=1
g.fillStyle=this.bgClr
if(my.clrNumQ&&!this.origQ)g.fillStyle='#ffe'
g.beginPath()
var gap=1
g.rect(gap,gap,this.wd-2*gap,this.ht-2*gap)
g.fill()
if(my.clrNumQ)clr=my.clrs[v][1];g.fillStyle=clr
g.font="21px Arial";g.beginPath()
g.fillText(v,15,28)
g.fill()}
Tile.prototype.win=function(){this.bgClr='#ffe'
this.draw()}
Tile.prototype.setxy=function(lt,tp){this.div.style.left=lt+'px';this.div.style.top=tp+'px';}
function Sudoku(){this.DIGITS="123456789";this.ROWS="ABCDEFGHI";this.COLS=this.DIGITS;this.SQUARES=null;this.UNITS=null;this.SQUARE_UNITS_MAP=null;this.SQUARE_PEERS_MAP=null;this.MIN_GIVENS=17;this.NR_SQUARES=81;this.DIFFICULTY={"easy":62,"medium":53,"hard":44,"very-hard":35,"insane":26,"inhuman":17,};this.BLANK_CHAR='.';this.BLANK_BOARD="...................................................."+
".............................";this.SQUARES=this._cross(this.ROWS,this.COLS);this.UNITS=this._get_all_units(this.ROWS,this.COLS);this.SQUARE_UNITS_MAP=this._get_square_units_map(this.SQUARES,this.UNITS);this.SQUARE_PEERS_MAP=this._get_square_peers_map(this.SQUARES,this.SQUARE_UNITS_MAP);}
Sudoku.prototype.generate=function(difficulty,unique){if(typeof difficulty==="string"||typeof difficulty==="undefined"){difficulty=this.DIFFICULTY[difficulty]||this.DIFFICULTY.easy;}
difficulty=this._force_range(difficulty,this.NR_SQUARES+1,this.MIN_GIVENS);unique=unique||true;var blank_board="";for(var i=0;i<this.NR_SQUARES;++i){blank_board+='.';}
var candidates=this._get_candidates_map(blank_board);var shuffled_squares=this._shuffle(this.SQUARES);for(var si in shuffled_squares){var square=shuffled_squares[si];var rand_candidate_idx=this._rand_range(candidates[square].length);var rand_candidate=candidates[square][rand_candidate_idx];if(!this._assign(candidates,square,rand_candidate)){break;}
var single_candidates=[];for(var si in this.SQUARES){var square=this.SQUARES[si];if(candidates[square].length==1){single_candidates.push(candidates[square]);}}
if(single_candidates.length>=difficulty&&this._strip_dups(single_candidates).length>=8){var board="";var givens_idxs=[];for(var i in this.SQUARES){var square=this.SQUARES[i];if(candidates[square].length==1){board+=candidates[square];givens_idxs.push(i);}else{board+=this.BLANK_CHAR;}}
var nr_givens=givens_idxs.length;if(nr_givens>difficulty){givens_idxs=this._shuffle(givens_idxs);for(var i=0;i<nr_givens-difficulty;++i){var target=parseInt(givens_idxs[i]);board=board.substr(0,target)+this.BLANK_CHAR+
board.substr(target+1);}}
if(this.solve(board)){console.log('board',board,candidates)
return board;}}}
return this.generate(difficulty);};Sudoku.prototype.solve=function(board,reverse){var report=this.validate_board(board);if(report!==true){throw report;}
var nr_givens=0;for(var i in board){if(board[i]!==this.BLANK_CHAR&&this._in(board[i],this.DIGITS)){++nr_givens;}}
if(nr_givens<this.MIN_GIVENS){throw "Too few givens. Minimum givens is "+this.MIN_GIVENS;}
reverse=reverse||false;var candidates=this._get_candidates_map(board);var result=this._search(candidates,reverse);if(result){var solution="";for(var square in result){solution+=result[square];}
return solution;}
return false;};Sudoku.prototype.get_candidates=function(board){var report=this.validate_board(board);if(report!==true){throw report;}
var candidates_map=this._get_candidates_map(board);if(!candidates_map){return false;}
var rows=[];var cur_row=[];var i=0;for(var square in candidates_map){var candidates=candidates_map[square];cur_row.push(candidates);if(i%9==8){rows.push(cur_row);cur_row=[];}
++i;}
return rows;}
Sudoku.prototype._get_candidates_map=function(board){var report=this.validate_board(board);if(report!==true){throw report;}
var candidate_map={};var squares_values_map=this._get_square_vals_map(board);for(var si in this.SQUARES){candidate_map[this.SQUARES[si]]=this.DIGITS;}
for(var square in squares_values_map){var val=squares_values_map[square];if(this._in(val,this.DIGITS)){var new_candidates=this._assign(candidate_map,square,val);if(!new_candidates){return false;}}}
return candidate_map;};Sudoku.prototype._search=function(candidates,reverse){if(!candidates){return false;}
reverse=reverse||false;var max_nr_candidates=0;var max_candidates_square=null;for(var si in this.SQUARES){var square=this.SQUARES[si];var nr_candidates=candidates[square].length;if(nr_candidates>max_nr_candidates){max_nr_candidates=nr_candidates;max_candidates_square=square;}}
if(max_nr_candidates===1){return candidates;}
var min_nr_candidates=10;var min_candidates_square=null;for(si in this.SQUARES){var square=this.SQUARES[si];var nr_candidates=candidates[square].length;if(nr_candidates<min_nr_candidates&&nr_candidates>1){min_nr_candidates=nr_candidates;min_candidates_square=square;}}
var min_candidates=candidates[min_candidates_square];if(!reverse){for(var vi in min_candidates){var val=min_candidates[vi];var candidates_copy=JSON.parse(JSON.stringify(candidates));var candidates_next=this._search(this._assign(candidates_copy,min_candidates_square,val));if(candidates_next){return candidates_next;}}}else{for(var vi=min_candidates.length-1;vi>=0;--vi){var val=min_candidates[vi];var candidates_copy=JSON.parse(JSON.stringify(candidates));var candidates_next=this._search(this._assign(candidates_copy,min_candidates_square,val),reverse);if(candidates_next){return candidates_next;}}}
return false;};Sudoku.prototype._assign=function(candidates,square,val){var other_vals=candidates[square].replace(val,"");for(var ovi in other_vals){var other_val=other_vals[ovi];var candidates_next=this._eliminate(candidates,square,other_val);if(!candidates_next){return false;}}
return candidates;};Sudoku.prototype._eliminate=function(candidates,square,val){if(!this._in(val,candidates[square])){return candidates;}
candidates[square]=candidates[square].replace(val,'');var nr_candidates=candidates[square].length;if(nr_candidates===1){var target_val=candidates[square];for(var pi in this.SQUARE_PEERS_MAP[square]){var peer=this.SQUARE_PEERS_MAP[square][pi];var candidates_new=this._eliminate(candidates,peer,target_val);if(!candidates_new){return false;}}}
if(nr_candidates===0){return false;}
for(var ui in this.SQUARE_UNITS_MAP[square]){var unit=this.SQUARE_UNITS_MAP[square][ui];var val_places=[];for(var si in unit){var unit_square=unit[si];if(this._in(val,candidates[unit_square])){val_places.push(unit_square);}}
if(val_places.length===0){return false;}else if(val_places.length===1){var candidates_new=this._assign(candidates,val_places[0],val);if(!candidates_new){return false;}}}
return candidates;};Sudoku.prototype._get_square_vals_map=function(board){var squares_vals_map={};if(board.length!=this.SQUARES.length){throw "Board/squares length mismatch.";}else{for(var i in this.SQUARES){squares_vals_map[this.SQUARES[i]]=board[i];}}
return squares_vals_map;};Sudoku.prototype._get_square_units_map=function(squares,units){var square_unit_map={};for(var si in squares){var cur_square=squares[si];var cur_square_units=[];for(var ui in units){var cur_unit=units[ui];if(cur_unit.indexOf(cur_square)!==-1){cur_square_units.push(cur_unit);}}
square_unit_map[cur_square]=cur_square_units;}
return square_unit_map;};Sudoku.prototype._get_square_peers_map=function(squares,units_map){var square_peers_map={};for(var si in squares){var cur_square=squares[si];var cur_square_units=units_map[cur_square];var cur_square_peers=[];for(var sui in cur_square_units){var cur_unit=cur_square_units[sui];for(var ui in cur_unit){var cur_unit_square=cur_unit[ui];if(cur_square_peers.indexOf(cur_unit_square)===-1&&cur_unit_square!==cur_square){cur_square_peers.push(cur_unit_square);}}}
square_peers_map[cur_square]=cur_square_peers;}
return square_peers_map;};Sudoku.prototype._get_all_units=function(rows,cols){var units=[];for(var ri in rows){units.push(this._cross(rows[ri],cols));}
for(var ci in cols){units.push(this._cross(rows,cols[ci]));}
var row_squares=["ABC","DEF","GHI"];var col_squares=["123","456","789"];for(var rsi in row_squares){for(var csi in col_squares){units.push(this._cross(row_squares[rsi],col_squares[csi]));}}
return units;};Sudoku.prototype.board_string_to_grid=function(board_string){var rows=[];var cur_row=[];for(var i in board_string){cur_row.push(board_string[i]);if(i%9==8){rows.push(cur_row);cur_row=[];}}
return rows;};Sudoku.prototype.board_grid_to_string=function(board_grid){var board_string="";for(var r=0;r<9;++r){for(var c=0;c<9;++c){board_string+=board_grid[r][c];}}
return board_string;};Sudoku.prototype.print_board=function(board){var report=this.validate_board(board);if(report!==true){throw report;}
var V_PADDING=" ";var H_PADDING='\n';var V_BOX_PADDING="  ";var H_BOX_PADDING='\n';var display_string="";for(var i in board){var square=board[i];display_string+=square+V_PADDING;if(i%3===2){display_string+=V_BOX_PADDING;}
if(i%9===8){display_string+=H_PADDING;}
if(i%27===26){display_string+=H_BOX_PADDING;}}
console.log(display_string);};Sudoku.prototype.validate_board=function(board){if(!board){return "Empty board";}
if(board.length!==this.NR_SQUARES){return "Invalid board size. Board must be exactly "+this.NR_SQUARES+" squares.";}
for(var i in board){if(!this._in(board[i],this.DIGITS)&&board[i]!==this.BLANK_CHAR){return "Invalid board character encountered at index "+i+
": "+board[i];}}
return true;};Sudoku.prototype._cross=function(a,b){var result=[];for(var ai in a){for(var bi in b){result.push(a[ai]+b[bi]);}}
return result;};Sudoku.prototype._in=function(v,seq){return seq.indexOf(v)!==-1;};Sudoku.prototype._first_true=function(seq){for(var i in seq){if(seq[i]){return seq[i];}}
return false;};Sudoku.prototype._shuffle=function(seq){var shuffled=[];for(var i=0;i<seq.length;++i){shuffled.push(false);}
for(var i in seq){var ti=this._rand_range(seq.length);while(shuffled[ti]){ti=(ti+1)>(seq.length-1)?0:(ti+1);}
shuffled[ti]=seq[i];}
return shuffled;};Sudoku.prototype._rand_range=function(max,min){min=min||0;if(max){return Math.floor(Math.random()*(max-min))+min;}else{throw "Range undefined";}};Sudoku.prototype._strip_dups=function(seq){var seq_set=[];var dup_map={};for(var i in seq){var e=seq[i];if(!dup_map[e]){seq_set.push(e);dup_map[e]=true;}}
return seq_set;};Sudoku.prototype._force_range=function(nr,max,min){min=min||0
nr=nr||0
if(nr<min){return min;}
if(nr>max){return max;}
return nr}
function emptyCellCoordinatesGen(puzz){var emptyCells=[];for(var i=0;i<9;i++){for(var j=0;j<9;j++){if(puzz[i][j]===0)
emptyCells.push([i,j]);}}
return emptyCells;}
function emptyPuzzleGenerator(){var emptyPuzz=[];for(var i=0;i<9;i++){emptyPuzz[i]=[];for(var j=0;j<9;j++){emptyPuzz[i][j]=0;}}
return emptyPuzz;}
var stdSolveArray=[1,2,3,4,5,6,7,8,9];function shuffleArray(arr){arr=arr.slice();var randomArray=[];var arrLength=arr.length;while(randomArray.length<arrLength){var randomIndex=Math.floor(Math.random()*arr.length);randomArray.push(arr.splice(randomIndex,1)[0]);}
return randomArray;}
function isUnique(puzz){var origSolution=solve(false,stdSolveArray,puzz);for(var i=0;i<=10;i++){var newSolution=solve(false,shuffleArray(stdSolveArray),puzz);if(origSolution.toString()!=newSolution.toString())
return false;}
return true;}
function uniquePuzzleGen(emptyN,startPuzzle){if(!startPuzzle){startPuzzle=emptyPuzzleGenerator();}
var randomPuzzle=solve(true,[],startPuzzle);var randomCoordinates=shuffleArray(emptyCellCoordinatesGen(emptyPuzzleGenerator()));var n=0
while(randomCoordinates.length>0&&n<emptyN){var temp=randomPuzzle[randomCoordinates[0][0]][randomCoordinates[0][1]];randomPuzzle[randomCoordinates[0][0]][randomCoordinates[0][1]]=0;if(!isUnique(randomPuzzle)){randomPuzzle[randomCoordinates[0][0]][randomCoordinates[0][1]]=temp;}
randomCoordinates.shift();n++}
return randomPuzzle;}
function clonePuzzle(puzz){var clonedPuzz=[];for(var i=0;i<puzz.length;i++){clonedPuzz.push(puzz[i].slice(0));}
return clonedPuzz;}
function solve(randomize,solveArray,puzz1){var puzz=clonePuzzle(puzz1);function inRow(num,rowIndex){return puzz[rowIndex].indexOf(num)>-1;}
function inCol(num,colIndex){var col=[];puzz.forEach(function(row){col.push(row[colIndex]);});return col.indexOf(num)>-1;}
function inBox(num,rowIndex,colIndex){var boxTopLeftCoordinates=[[0,0],[0,3],[0,6],[3,0],[3,3],[3,6],[6,0],[6,3],[6,6]];var correspondingBox=boxTopLeftCoordinates.filter(function(box){return(rowIndex>=box[0]&&rowIndex<box[0]+3)&&(colIndex>=box[1]&&colIndex<box[1]+3);});var boxArray=[];for(var i=correspondingBox[0][0];i<=correspondingBox[0][0]+2;i++){for(var j=correspondingBox[0][1];j<=correspondingBox[0][1]+2;j++){boxArray.push(puzz[i][j]);}}
return boxArray.indexOf(num)>-1;}
function isValid(num,rowIndex,colIndex){return!inRow(num,rowIndex,colIndex)&&!inCol(num,colIndex)&&!inBox(num,rowIndex,colIndex);}
var i=0
var steps=0
var emptyCell=emptyCellCoordinatesGen(puzz)
var n
while(i<emptyCell.length){steps++;if(steps>1000000)
return false;if(randomize)
solveArray=shuffleArray(stdSolveArray);if(puzz[emptyCell[i][0]][emptyCell[i][1]]===0)
n=0;else
n=solveArray.indexOf(puzz[emptyCell[i][0]][emptyCell[i][1]])+1;while(!isValid(solveArray[n],emptyCell[i][0],emptyCell[i][1])&&n<=solveArray.length-1){n++;}
if(n==solveArray.length){puzz[emptyCell[i][0]][emptyCell[i][1]]=0;i--;if(i==-1)
return false;continue;}
puzz[emptyCell[i][0]][emptyCell[i][1]]=solveArray[n];i++;}
return puzz;}
function sudoku(puzz){var solveArray=[1,2,3,4,5,6,7,8,9];return solve(false,solveArray,puzz);}