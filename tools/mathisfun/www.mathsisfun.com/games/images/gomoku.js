var w,h,ratio,el,el2,g,g2,my={};function gomokuMain(mode){var version='0.64';my.typ=typeof mode!=='undefined'?mode:'bla';my.last={xn:-1,yn:-1}
my.hdrHt=65
w=Math.min(500,window.innerWidth,window.innerHeight-my.hdrHt)
h=w+my.hdrHt
my.bdSzs=[{title:'9 by 9',sz:9},{title:'13 by 13',sz:13},{title:'19 by 19',sz:19}];my.bdSz=19
my.game={board:[]}
my.players=[{name:'empty'},{name:'Black',clr:'black',lvl:0},{name:'White',clr:'white',lvl:1},];my.playerNo=1
my.player=my.players[my.playerNo]
my.lvls=[{name:'Human',title:'Human'},{name:'Easy',title:'AI Easy',depth:0,bestn:3},{name:'Medium',title:'AI Medium',depth:1,bestn:2},{name:'Hard',title:'AI Hard',depth:2,bestn:0},]
var s='';my.sndHome=(document.domain=='localhost')?'/mathsisfun/images/sounds/':'/images/sounds/'
s+='<audio id="sndmove" src="'+my.sndHome+'click3.mp3" preload="auto"></audio>'
s+='<audio id="sndwin" src="'+my.sndHome+'kids-cheer.mp3" preload="metadata"></audio>'
s+='<audio id="sndlose" src="'+my.sndHome+'fail.mp3" preload="metadata"></audio>'
my.snds=[];my.imgHome=(document.domain=='localhost')?'/mathsisfun/games/images/':'/games/images/'
s+='<div id="main" style="position:relative; width:'+w+'px; min-height:'+h+'px; background-color: lightbrown; background-image: url('+my.imgHome+'wood6.jpg); margin:auto; display:block; border: 1px solid lightbrown; border-radius: 5px;">';s+='<canvas id="canvas1" width="'+w+'" height="'+h+'" style="z-index:1; position: absolute; top: 0; left: 0;"></canvas>';s+='<canvas id="canvas2" width="'+w+'" height="'+h+'" style="z-index:2; position: absolute; top: 0; left: 0;"></canvas>';s+='<button id="startBtn" onclick="gameNew()" class="togglebtn hi" style="z-index:2; position: absolute; left: 2px; top: 1px; ">New</button>';s+='<button id="optBtn" onclick="popShow()" class="togglebtn hi" style="z-index:2; position: absolute; left: 50px; top: 1px; ">Options</button>';s+='<div style="position:absolute; right:5px; top:5px;  z-index:2; ">'
my.soundQ=true
s+=soundBtnHTML()
s+='</div>';s+=popHTML()
s+='<div style="font: 20px Arial; background-color: hsla(120,100%,20%,0.2); position:absolute; left:'+(w-200)/2+'px; top:35px; width:'+200+'px; margin:auto; text-align:center; border-radius:10px; z-index:2; ">'
s+='<div id="info" style="display:inline-block; font: 22px Arial; color: black; text-align:left; padding:3px;">Black</div>';s+='</div>';s+='<div id="copyrt" style="font: 11px Arial; color: white; position:absolute; left:0px; bottom:1px; width:'+w+'px; text-align:left;">&copy; 2018 MathsIsFun.com  v'+version+'</div>';s+='</div>';document.write(s);ratio=3;el=document.getElementById('canvas1');el.width=w*ratio;el.height=h*ratio;el.style.width=w+"px";el.style.height=h+"px";g=el.getContext("2d");g.setTransform(ratio,0,0,ratio,0,0)
el2=document.getElementById('canvas2');el2.width=w*ratio;el2.height=h*ratio;el2.style.width=w+"px";el2.style.height=h+"px";g2=el2.getContext("2d");g2.setTransform(ratio,0,0,ratio,0,0)
el2.addEventListener('touchstart',touchStart,false);el2.addEventListener("mousemove",mouseMove,false);el2.addEventListener("mousedown",mouseDown,false);my.playQ=true
gameNew()}
function gameNew(){clearTimeout(my.timeid)
var pcWd=Math.min(60,w/my.bdSz,(h-my.hdrHt)/my.bdSz)
var bdWd=pcWd*(my.bdSz-1)
my.rect={lt:pcWd/2,tp:pcWd/2+my.hdrHt,wd:bdWd,ht:bdWd}
my.rect.rt=my.rect.lt+my.rect.wd
my.rect.bt=my.rect.tp+my.rect.ht
my.rect.pcWd=pcWd
console.log('my.rect',my,my.rect)
my.moveN=0
var player=my.players[my.playerNo]
document.getElementById('info').style.color=player.clr
document.getElementById('info').innerHTML=player.name+" goes first"
var b=[]
for(var i=0;i<my.bdSz;i++){b[i]=[]
for(var j=0;j<my.bdSz;j++){b[i][j]=0}}
my.game.board=b
boardDraw()
if(my.players[my.playerNo].lvl>0){my.playQ=false
var mid=Math.round(my.bdSz/2)-1
my.game.board[mid][mid]=my.playerNo
soundPlay('sndmove')
turnNext()}else{my.playQ=true}}
function boardDraw(){var rowN=my.bdSz
var colN=my.bdSz
g.clearRect(0,0,g.canvas.width,g.canvas.height)
g.lineWidth=0.7
var bit=0.8
for(var i=0;i<rowN;i++){g.strokeStyle='#eee'
g.beginPath()
g.moveTo(my.rect.lt,my.rect.tp+i*my.rect.pcWd+bit)
g.lineTo(my.rect.rt,my.rect.tp+i*my.rect.pcWd+bit)
g.stroke()}
for(var i=0;i<colN;i++){g.strokeStyle='#eee'
g.beginPath()
g.moveTo(my.rect.lt+i*my.rect.pcWd+bit,my.rect.tp)
g.lineTo(my.rect.lt+i*my.rect.pcWd+bit,my.rect.bt)
g.stroke()}
for(var i=0;i<rowN;i++){g.strokeStyle='#333'
g.beginPath()
g.moveTo(my.rect.lt,my.rect.tp+i*my.rect.pcWd)
g.lineTo(my.rect.rt,my.rect.tp+i*my.rect.pcWd)
g.stroke()}
for(var i=0;i<colN;i++){g.strokeStyle='#333'
g.beginPath()
g.moveTo(my.rect.lt+i*my.rect.pcWd,my.rect.tp)
g.lineTo(my.rect.lt+i*my.rect.pcWd,my.rect.bt)
g.stroke()}
var dots=[]
if(my.bdSz==19)dots=[[3,3],[9,3],[15,3],[3,9],[9,9],[15,9],[3,15],[9,15],[15,15]]
for(var i=0;i<dots.length;i++){var dot=dots[i]
g.fillStyle='#555'
g.beginPath()
g.arc(my.rect.lt+dot[0]*my.rect.pcWd,my.rect.tp+dot[1]*my.rect.pcWd,2,0,2*Math.PI)
g.fill()}
var b=my.game.board
for(var i=0;i<colN;i++){for(var j=0;j<rowN;j++){if(b[i][j]!=0){g.pieceDraw(i,j,b[i][j],false)}}}}
function touchStart(evt){var touch=evt.targetTouches[0];evt.clientX=touch.clientX;evt.clientY=touch.clientY;evt.touchQ=true;mouseDown(evt)}
function mouseMove(ev){var bRect=el2.getBoundingClientRect();var mousex=(ev.clientX-bRect.left)*(el2.width/ratio/bRect.width);var mousey=(ev.clientY-bRect.top)*(el2.height/ratio/bRect.height);var g=g2
g.clearRect(0,0,g.canvas.width,g.canvas.height)
var xn=Math.round((mousex-my.rect.lt)/my.rect.pcWd)
var yn=Math.round((mousey-my.rect.tp)/my.rect.pcWd)
if(my.playQ){if(posLegal(xn,yn)){g.pieceDraw(xn,yn,my.playerNo,true)}}}
function mouseDown(ev){var bRect=el2.getBoundingClientRect();var mousex=(ev.clientX-bRect.left)*(el2.width/ratio/bRect.width);var mousey=(ev.clientY-bRect.top)*(el2.height/ratio/bRect.height);var g=g2
g.clearRect(0,0,g.canvas.width,g.canvas.height)
var xn=Math.round((mousex-my.rect.lt)/my.rect.pcWd)
var yn=Math.round((mousey-my.rect.tp)/my.rect.pcWd)
mousex=xn*my.rect.pcWd+my.rect.lt
mousey=yn*my.rect.pcWd+my.rect.tp
if(my.playQ){if(posLegal(xn,yn)){my.game.board[xn][yn]=my.playerNo
soundPlay('sndmove')
turnNext()}}}
function popShow(){var pop=document.getElementById('optpop');pop.style.transitionDuration="0.3s";pop.style.opacity=1;pop.style.zIndex=12;pop.style.left='10px';}
function popYes(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-500px';for(var i=0;i<my.lvls.length;i++){var div=document.getElementById('blackLvl'+i)
if(div.checked)my.players[1].lvl=i}
for(var i=0;i<my.lvls.length;i++){var div=document.getElementById('whiteLvl'+i)
if(div.checked)my.players[2].lvl=i}
for(var i=0;i<my.bdSzs.length;i++){var div=document.getElementById('bdSz'+i)
if(div.checked)my.bdSz=my.bdSzs[i].sz}
console.log("popYes",my.players,my.bdSz);gameNew()}
function popNo(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-500px';}
function popHTML(){var s='';var wd=Math.min(w-30,380)
s+='<div id="optpop" style="position:absolute; left:-450px; top:30px; width:'+wd+'px; padding: 5px; border-radius: 9px; font: 15px Arial; background-color: #88aaff; box-shadow: 10px 10px 5px 0px rgba(40,40,40,0.75); transition: all linear 0.3s; opacity:0; text-align: center; ">';s+='<div style="float:left; margin: 0 0 5px 10px;">Black:<br>'
s+=radioHTML('','blackLvl',my.lvls,'',my.players[1].lvl)
s+='</div>'
s+='<div style="float:right; margin: 0 10px 5px 0;">White:<br>'
s+=radioHTML('','whiteLvl',my.lvls,'',my.players[2].lvl)
s+='</div>'
s+='<br>'
s+='<br>'
s+='<div>Board Size:<br>'
s+=radioHTML('','bdSz',my.bdSzs,'',2);s+='</div>'
s+='<br>'
s+='<div style="float:right; margin: 0 0 5px 10px;">';s+='(will start new game) &nbsp;'
s+='<button onclick="popYes()" style="z-index:2; font: 22px Arial; " class="togglebtn" >&#x2714;</button>';s+='<button onclick="popNo()" style="z-index:2; font: 22px Arial; width:40px;" class="togglebtn" >&#x2718;</button>';s+='</div>';s+='</div>';return s;}
function radioHTML(prompt,id,lbls,func,n){var s='';s+='<div style="display:inline-block; border: 1px solid white; border-radius:5px; padding:3px;  background-color:rgba(255,255,255,0.5);">';s+=prompt;for(var i=0;i<lbls.length;i++){var lbl=lbls[i];var idi=id+i;var chkStr=(i==n)?' checked ':'';s+='<input id="'+idi+'" type="radio" name="'+id+'" value="'+lbl.name+'" onclick="'+func+'('+i+');" autocomplete="off" '+chkStr+' >';s+='<label for="'+idi+'">'+lbl.title+' </label>';s+='<br>'}
s+='</div>';return s;}
function posLegal(xn,yn){if(xn<0)return false
if(yn<0)return false
if(xn>=my.bdSz)return false
if(yn>=my.bdSz)return false
if(my.game.board[xn][yn]>0)return false
return true}
function turnNext(){my.playQ=false
var c=new AI()
if(c.full(my.game.board)){boardDraw()
document.getElementById('info').style.color='red'
document.getElementById('info').innerHTML="A Draw!"
my.playQ=false
soundPlay('sndlose')
return}
if(c.terminalState(my.game.board)){boardDraw()
var player=my.players[my.playerNo]
document.getElementById('info').style.color=player.clr
document.getElementById('info').innerHTML=player.name+" Wins!"
my.playQ=false
if(player.lvl==0){soundPlay('sndwin')}else{soundPlay('sndlose')}
return}
my.playerNo=(my.playerNo==1)?2:1
var player=my.players[my.playerNo]
document.getElementById('info').style.color=player.clr
document.getElementById('info').innerHTML=player.name
boardDraw()
my.moveN++
if(my.players[my.playerNo].lvl>0){my.playQ=false
my.timeid=setTimeout(aiMove,1000)}else{my.playQ=true}}
function aiMove(){var c=new AI()
var move=c.getMove(my.game.board)
console.log('move',move)
if(typeof move==="undefined"){boardDraw()
document.getElementById('info').style.color='red'
document.getElementById('info').innerHTML="AI stuck!"
my.playQ=false
soundPlay('sndlose')
return}
var xn=move[0]
var yn=move[1]
my.last={xn:xn,yn:yn}
my.game.board[xn][yn]=my.playerNo
soundPlay('sndmove')
turnNext()
my.last={xn:-1,yn:-1}
setTimeout(boardDraw,2000);}
CanvasRenderingContext2D.prototype.pieceDraw=function(xn,yn,type,hoverq){var size=my.rect.pcWd/2
var x=my.rect.lt+xn*my.rect.pcWd
var y=my.rect.tp+yn*my.rect.pcWd
if(hoverq){this.beginPath()
this.fillStyle='hsla(60,90%,10%,0.2)'
this.arc(x+size*0.35,y+size*0.35,size*1.1,0,Math.PI*2,true)
this.fill()
this.beginPath()
this.lineWidth=4
this.strokeStyle='hsla(50,100%,90%,0.3)'
this.arc(x,y,size*1.1,0,Math.PI*2,true)
this.stroke()}else{this.beginPath()
this.fillStyle='hsla(240,0%,0%,0.3)'
this.arc(x+size*0.13,y+size*0.13,size*1.03,0,Math.PI*2,true)
this.fill()}
let hiliteQ=(xn==my.last.xn&&yn==my.last.yn)
if(hiliteQ){this.beginPath()
this.fillStyle='hsla(240,100%,50%,0.3)'
this.arc(x,y,size*1.15,0,Math.PI*2,true)
this.fill()}
var gradient
if(type==1){this.beginPath()
gradient=this.createRadialGradient(x+size*0.3,y+size*0.2,0,x,y,size*1.6);gradient.addColorStop(0,'hsla(240,10%,50%,1)');gradient.addColorStop(1,'black');this.fillStyle=gradient
this.arc(x,y,size,0,Math.PI*2,true)
this.fill()
this.beginPath()
gradient=this.createRadialGradient(x-size*0.5,y-size*0.5,0,x,y,size*1.6);gradient.addColorStop(0,'hsla(0,0%,70%,1)');gradient.addColorStop(0.3,'hsla(0,100%,100%,0)');this.fillStyle=gradient
this.arc(x,y,size*1,0,Math.PI*2,true)
this.fill()}else{this.beginPath()
gradient=this.createRadialGradient(x-size*0.4,y-size*0.6,0,x,y,size*1.4);gradient.addColorStop(0,'white');gradient.addColorStop(0.4,'hsla(240,100%,93%,1)');this.fillStyle=gradient
this.arc(x,y,size,0,Math.PI*2,true)
this.fill()}}
CanvasRenderingContext2D.prototype.ball=function(size,clr,hiClr,x,y){this.beginPath();var gradient=this.createRadialGradient(x-size*0.4,y-size*0.6,0,x,y,size*1.4);gradient.addColorStop(0,hiClr);gradient.addColorStop(0.6,clr);this.fillStyle=gradient;this.arc(x,y,size,0,Math.PI*2,true);this.fill();}
function soundBtnHTML(){var onClr='#444'
var offClr='#888'
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
function AI(){this.minimaxCache={};}
AI.prototype.nearbyMoves=function(grid){var nearby=[];for(var i=0;i<grid.length;i++){nearby[i]=[];}
for(var i=0;i<grid.length;i++){for(var j=0;j<grid.length;j++){if(grid[i][j]){var xMax=Math.min(i+1,grid.length-1);var yMax=Math.min(j+1,grid.length-1);for(var x=Math.max(i-1,0);x<=xMax;x++){for(var y=Math.max(j-1,0);y<=yMax;y++){nearby[x][y]=true;}}}}}
return nearby;}
AI.prototype.getMove=function(grid){var timeStt=performance.now()
var board={}
board.stoneCount=1
if(board.stoneCount===0)return[7,7];var possibleMoves=this.nearbyMoves(grid);var player=my.players[my.playerNo]
var lvl=my.lvls[player.lvl]
var minimaxCurrentDepth=board.stoneCount+1;var minimaxTargetDepth=board.stoneCount+1+lvl.depth;var cpuColor=board.stoneCount%2===0?2:1;var oppColor=cpuColor===1?2:1;var winningPosition=this.winningPosition(grid,cpuColor);var oppWinningPosition=this.winningPosition(grid,oppColor);if(winningPosition)return winningPosition;if(oppWinningPosition)return oppWinningPosition;var openFour=this.checkOpenFour(grid,cpuColor);if(openFour)return openFour;var position;var score=Number.NEGATIVE_INFINITY;var bests=[]
var bestlow=Number.NEGATIVE_INFINITY
for(var i=0;i<grid.length;i++){for(var j=0;j<grid.length;j++){if(possibleMoves[i][j]&&!grid[i][j]){grid[i][j]=cpuColor;var moveScore=this.minimax(grid,minimaxCurrentDepth,minimaxTargetDepth,false,Number.NEGATIVE_INFINITY,Number.POSITIVE_INFINITY,possibleMoves,cpuColor);grid[i][j]=0;if(moveScore>score){score=moveScore;position=[i,j];}
if(moveScore>bestlow){if(bests.length==0){bests.push({pos:[i,j],score:moveScore})}else{for(var n=0;n<bests.length;n++){if(moveScore>bests[n].score){bests.splice(n,0,{pos:[i,j],score:moveScore})
break}}
if(bests.length>4)bests.length=4}
bestlow=bests[bests.length-1].score}}}}
this.minimaxCache={};console.log('bests final',bestsFmt(bests),position)
var choosen=Math.floor(Math.random()*lvl.bestn)
choosen=Math.min(choosen,bests.length-1)
position=bests[choosen].pos
var elapsed=(performance.now()-timeStt)/1000
console.log('position',player.name,choosen,elapsed,position)
return position;}
function bestsFmt(bests){var s=''
for(var i=0;i<bests.length;i++){s+=bests[i].pos+'='+bests[i].score+' '}
return s}
AI.prototype.minimax=function(grid,currentDepth,targetDepth,isMaximizingPlayer,alpha,beta,possibleMoves,cpuColor){if(currentDepth===targetDepth||this.terminalState(grid)){var gridHash=this.hashFunction(grid);if(this.minimaxCache[gridHash]){return this.minimaxCache[gridHash];}else{var value=this.evaluate(grid,cpuColor);this.minimaxCache[gridHash]=value;return value;}}
var currentColor=currentDepth%2===0?2:1;if(isMaximizingPlayer){var bestVal=Number.NEGATIVE_INFINITY;for(var i=0;i<grid.length;i++){for(var j=0;j<grid.length;j++){if(possibleMoves[i][j]&&!grid[i][j]){grid[i][j]=currentColor;var gridHash=this.hashFunction(grid);var value;if(this.minimaxCache[gridHash]){value=this.minimaxCache[gridHash];}else{var newMoves=this.nearbyMoves(grid);value=this.minimax(grid,currentDepth+1,targetDepth,false,alpha,beta,newMoves,cpuColor);this.minimaxCache[gridHash]=value;}
grid[i][j]=0;bestVal=Math.max(bestVal,value);alpha=Math.max(alpha,bestVal);if(beta<=alpha)break;}}}
return bestVal;}else{var bestVal=Number.POSITIVE_INFINITY;for(var i=0;i<grid.length;i++){for(var j=0;j<grid.length;j++){if(possibleMoves[i][j]&&!grid[i][j]){grid[i][j]=currentColor;var gridHash=this.hashFunction(grid);var value;if(this.minimaxCache[gridHash]){value=this.minimaxCache[gridHash];}else{var newMoves=this.nearbyMoves(grid);value=this.minimax(grid,currentDepth+1,targetDepth,true,alpha,beta,newMoves,cpuColor);this.minimaxCache[gridHash]=value;}
grid[i][j]=0;bestVal=Math.min(bestVal,value);beta=Math.min(beta,bestVal);if(beta<=alpha)break;}}}
return bestVal;}}
AI.prototype.hashFunction=function(grid){var hash=0;var gridString=grid.toString();if(gridString.length===0){return hash;}
for(var i=0;i<gridString.length;i++){var char=gridString.charCodeAt(i);hash=((hash<<5)-hash)+char;hash=hash&hash;}
return hash;}
AI.prototype.checkOpenFour=function(grid,color){for(var i=0;i<grid.length;i++){for(var j=0;j<grid.length;j++){if((j+5)in grid&&!grid[i][j]&&!grid[i][j+1]&&grid[i][j+2]===color&&grid[i][j+3]===color&&grid[i][j+4]===color&&!grid[i][j+5])return[i,j+1];if((j+5)in grid&&!grid[i][j]&&grid[i][j+1]===color&&grid[i][j+2]===color&&grid[i][j+3]===color&&!grid[i][j+4]&&!grid[i][j+5])return[i,j+4];if((i+5)in grid&&!grid[i][j]&&!grid[i+1][j]&&grid[i+2][j]===color&&grid[i+3][j]===color&&grid[i+4][j]===color&&!grid[i+5][j])return[i+1,j];if((i+5)in grid&&!grid[i][j]&&grid[i+1][j]===color&&grid[i+2][j]===color&&grid[i+3][j]===color&&!grid[i+4][j]&&!grid[i+5][j])return[i+4,j];if((i+5)in grid&&(j+5)in grid&&!grid[i][j]&&!grid[i+1][j+1]&&grid[i+2][j+2]===color&&grid[i+3][j+3]===color&&grid[i+4][j+4]===color&&!grid[i+5][j+5])return[i+1,j+1];if((i+5)in grid&&(j+5)in grid&&!grid[i][j]&&grid[i+1][j+1]===color&&grid[i+2][j+2]===color&&grid[i+3][j+3]===color&&!grid[i+4][j+4]&&!grid[i+5][j+5])return[i+4,j+4];if((i-5)in grid&&(j+5)in grid&&!grid[i][j]&&!grid[i-1][j+1]&&grid[i-2][j+2]===color&&grid[i-3][j+3]===color&&grid[i-4][j+4]===color&&!grid[i-5][j+5])return[i-1,j+1];if((i-5)in grid&&(j+5)in grid&&!grid[i][j]&&grid[i-1][j+1]===color&&grid[i-2][j+2]===color&&grid[i-3][j+3]===color&&!grid[i-4][j+4]&&!grid[i-5][j+5])return[i-4,j+4];}}}
AI.prototype.winningPosition=function(grid,color){for(var i=0;i<grid.length;i++){for(var j=0;j<grid.length;j++){for(var offsetCoord=0;offsetCoord<=4;offsetCoord++){var otherCoords=[0,1,2,3,4].filter(coord=>coord!==offsetCoord);if((j+4)in grid&&!grid[i][j+offsetCoord]&&grid[i][j+otherCoords[0]]===color&&grid[i][j+otherCoords[1]]===color&&grid[i][j+otherCoords[2]]===color&&grid[i][j+otherCoords[3]]===color)return[i,j+offsetCoord];if((i+4)in grid&&!grid[i+offsetCoord][j]&&grid[i+otherCoords[0]][j]===color&&grid[i+otherCoords[1]][j]===color&&grid[i+otherCoords[2]][j]===color&&grid[i+otherCoords[3]][j]===color)return[i+offsetCoord,j];if((i+4)in grid&&(j+4)in grid&&!grid[i+offsetCoord][j+offsetCoord]&&grid[i+otherCoords[0]][j+otherCoords[0]]===color&&grid[i+otherCoords[1]][j+otherCoords[1]]===color&&grid[i+otherCoords[2]][j+otherCoords[2]]===color&&grid[i+otherCoords[3]][j+otherCoords[3]]===color)return[i+offsetCoord,j+offsetCoord];if((i-4)in grid&&(j+4)in grid&&!grid[i-offsetCoord][j+offsetCoord]&&grid[i-otherCoords[0]][j+otherCoords[0]]===color&&grid[i-otherCoords[1]][j+otherCoords[1]]===color&&grid[i-otherCoords[2]][j+otherCoords[2]]===color&&grid[i-otherCoords[3]][j+otherCoords[3]]===color)return[i-offsetCoord,j+offsetCoord];}}}}
AI.prototype.full=function(grid){for(var i=0;i<my.bdSz;i++){for(var j=0;j<my.bdSz;j++){if(grid[i][j]===0)return false}}
return true}
AI.prototype.terminalState=function(grid){for(var i=0;i<grid.length;i++){for(var j=0;j<grid.length;j++){if(((j+4)in grid&&grid[i][j]===1&&grid[i][j+1]===1&&grid[i][j+2]===1&&grid[i][j+3]===1&&grid[i][j+4]===1)||((j+4)in grid&&grid[i][j]===2&&grid[i][j+1]===2&&grid[i][j+2]===2&&grid[i][j+3]===2&&grid[i][j+4]===2))return true;if(((i+4)in grid&&grid[i][j]===1&&grid[i+1][j]===1&&grid[i+2][j]===1&&grid[i+3][j]===1&&grid[i+4][j]===1)||((i+4)in grid&&grid[i][j]===2&&grid[i+1][j]===2&&grid[i+2][j]===2&&grid[i+3][j]===2&&grid[i+4][j]===2))return true;if(((i+4)in grid&&(j+4)in grid&&grid[i][j]===1&&grid[i+1][j+1]===1&&grid[i+2][j+2]===1&&grid[i+3][j+3]===1&&grid[i+4][j+4]===1)||((i+4)in grid&&(j+4)in grid&&grid[i][j]===2&&grid[i+1][j+1]===2&&grid[i+2][j+2]===2&&grid[i+3][j+3]===2&&grid[i+4][j+4]===2))return true;if(((i-4)in grid&&(j+4)in grid&&grid[i][j]===1&&grid[i-1][j+1]===1&&grid[i-2][j+2]===1&&grid[i-3][j+3]===1&&grid[i-4][j+4]===1)||((i-4)in grid&&(j+4)in grid&&grid[i][j]===2&&grid[i-1][j+1]===2&&grid[i-2][j+2]===2&&grid[i-3][j+3]===2&&grid[i-4][j+4]===2))return true;}}}
AI.prototype.evaluate=function(grid,cpuColor){var oppColor=cpuColor===2?1:2;function hasFive(color){var count=0;for(var i=0;i<grid.length;i++){for(var j=0;j<grid.length;j++){if((j+4)in grid&&grid[i][j]===color&&grid[i][j+1]===color&&grid[i][j+2]===color&&grid[i][j+3]===color&&grid[i][j+4]===color)count++;else if((i+4)in grid&&grid[i][j]===color&&grid[i+1][j]===color&&grid[i+2][j]===color&&grid[i+3][j]===color&&grid[i+4][j]===color)count++;else if((i+4)in grid&&(j+4)in grid&&grid[i][j]===color&&grid[i+1][j+1]===color&&grid[i+2][j+2]===color&&grid[i+3][j+3]===color&&grid[i+4][j+4]===color)count++;else if((i-4)in grid&&(j+4)in grid&&grid[i][j]===color&&grid[i-1][j+1]===color&&grid[i-2][j+2]===color&&grid[i-3][j+3]===color&&grid[i-4][j+4]===color)count++;}}
return count;}
function hasOpenFour(color){var count=0;for(var i=0;i<grid.length;i++){for(var j=0;j<grid.length;j++){if((j+5)in grid&&!grid[i][j]&&grid[i][j+1]===color&&grid[i][j+2]===color&&grid[i][j+3]===color&&grid[i][j+4]===color&&!grid[i][j+5])count++;else if((i+5)in grid&&!grid[i][j]&&grid[i+1][j]===color&&grid[i+2][j]===color&&grid[i+3][j]===color&&grid[i+4][j]===color&&!grid[i+5][j])count++;else if((i+5)in grid&&(j+5)in grid&&!grid[i][j]&&grid[i+1][j+1]===color&&grid[i+2][j+2]===color&&grid[i+3][j+3]===color&&grid[i+4][j+4]===color&&!grid[i+5][j+5])count++;else if((i-5)in grid&&(j+5)in grid&&!grid[i][j]&&grid[i-1][j+1]===color&&grid[i-2][j+2]===color&&grid[i-3][j+3]===color&&grid[i-4][j+4]===color&&!grid[i-5][j+5])count++;}}
return count;}
function hasFour(color){var count=0;for(var i=0;i<grid.length;i++){for(var j=0;j<grid.length;j++){if(((j+4)in grid&&!grid[i][j]&&grid[i][j+1]===color&&grid[i][j+2]===color&&grid[i][j+3]===color&&grid[i][j+4]===color)||((j+4)in grid&&grid[i][j]===color&&grid[i][j+1]===color&&grid[i][j+2]===color&&grid[i][j+3]===color&&!grid[i][j+4]))count++;if(((i+4)in grid&&!grid[i][j]&&grid[i+1][j]===color&&grid[i+2][j]===color&&grid[i+3][j]===color&&grid[i+4][j]===color)||((i+4)in grid&&grid[i][j]===color&&grid[i+1][j]===color&&grid[i+2][j]===color&&grid[i+3][j]===color&&!grid[i+4][j]))count++;if(((i+4)in grid&&(j+4)in grid&&!grid[i][j]&&grid[i+1][j+1]===color&&grid[i+2][j+2]===color&&grid[i+3][j+3]===color&&grid[i+4][j+4]===color)||((i+4)in grid&&(j+4)in grid&&grid[i][j]===color&&grid[i+1][j+1]===color&&grid[i+2][j+2]===color&&grid[i+3][j+3]===color&&!grid[i+4][j+4]))count++;if(((i-4)in grid&&(j+4)in grid&&!grid[i][j]&&grid[i-1][j+1]===color&&grid[i-2][j+2]===color&&grid[i-3][j+3]===color&&grid[i-4][j+4]===color)||((i-4)in grid&&(j+4)in grid&&grid[i][j]===color&&grid[i-1][j+1]===color&&grid[i-2][j+2]===color&&grid[i-3][j+3]===color&&!grid[i-4][j+4]))count++;}}
return count;}
function hasOpenThree(color){var count=0;for(var i=0;i<grid.length;i++){for(var j=0;j<grid.length;j++){if(((j+5)in grid&&!grid[i][j]&&!grid[i][j+1]&&grid[i][j+2]===color&&grid[i][j+3]===color&&grid[i][j+4]===color&&!grid[i][j+5])||((j+5)in grid&&!grid[i][j]&&grid[i][j+1]===color&&grid[i][j+2]===color&&grid[i][j+3]===color&&!grid[i][j+4]&&!grid[i][j+5]))count++;if(((i+5)in grid&&!grid[i][j]&&!grid[i+1][j]&&grid[i+2][j]===color&&grid[i+3][j]===color&&grid[i+4][j]===color&&!grid[i+5][j])||((i+5)in grid&&!grid[i][j]&&grid[i+1][j]===color&&grid[i+2][j]===color&&grid[i+3][j]===color&&!grid[i+4][j]&&!grid[i+5][j]))count++;if(((i+5)in grid&&(j+5)in grid&&!grid[i][j]&&!grid[i+1][j+1]&&grid[i+2][j+2]===color&&grid[i+3][j+3]===color&&grid[i+4][j+4]===color&&!grid[i+5][j+5])||((i+5)in grid&&(j+5)in grid&&!grid[i][j]&&grid[i+1][j+1]===color&&grid[i+2][j+2]===color&&grid[i+3][j+3]===color&&!grid[i+4][j+4]&&!grid[i+5][j+5]))count++;if(((i-5)in grid&&(j+5)in grid&&!grid[i][j]&&!grid[i-1][j+1]&&grid[i-2][j+2]===color&&grid[i-3][j+3]===color&&grid[i-4][j+4]===color&&!grid[i-5][j+5])||((i-5)in grid&&(j+5)in grid&&!grid[i][j]&&grid[i-1][j+1]===color&&grid[i-2][j+2]===color&&grid[i-3][j+3]===color&&!grid[i-4][j+4]&&!grid[i-5][j+5]))count++;}}
return count;}
function hasThree(color){var count=0;for(var i=0;i<grid.length;i++){for(var j=0;j<grid.length;j++){if(((j+4)in grid&&!grid[i][j]&&!grid[i][j+1]&&grid[i][j+2]===color&&grid[i][j+3]===color&&grid[i][j+4]===color)||((j+4)in grid&&grid[i][j]===color&&grid[i][j+1]===color&&grid[i][j+2]===color&&!grid[i][j+3]&&!grid[i][j+4]))count++;if(((i+4)in grid&&!grid[i][j]&&!grid[i+1][j]&&grid[i+2][j]===color&&grid[i+3][j]===color&&grid[i+4][j]===color)||((i+4)in grid&&grid[i][j]===color&&grid[i+1][j]===color&&grid[i+2][j]===color&&!grid[i+3][j]&&!grid[i+4][j]))count++;if(((i+4)in grid&&(j+4)in grid&&!grid[i][j]&&!grid[i+1][j+1]&&grid[i+2][j+2]===color&&grid[i+3][j+3]===color&&grid[i+4][j+4]===color)||((i+4)in grid&&(j+4)in grid&&grid[i][j]===color&&grid[i+1][j+1]===color&&grid[i+2][j+2]===color&&!grid[i+3][j+3]&&!grid[i+4][j+4]))count++;if(((i-4)in grid&&(j+4)in grid&&!grid[i][j]&&!grid[i-1][j+1]&&grid[i-2][j+2]===color&&grid[i-3][j+3]===color&&grid[i-4][j+4]===color)||((i-4)in grid&&(j+4)in grid&&grid[i][j]===color&&grid[i-1][j+1]===color&&grid[i-2][j+2]===color&&!grid[i-3][j+3]&&!grid[i-4][j+4]))count++;}}
return count;}
function hasOpenTwo(color){var count=0;for(var i=0;i<grid.length;i++){for(var j=0;j<grid.length;j++){if((j+7)in grid&&!grid[i][j]&&!grid[i][j+1]&&!grid[i][j+2]&&grid[i][j+3]===color&&grid[i][j+4]===color&&!grid[i][j+5]&&!grid[i][j+6]&&!grid[i][j+7])count++;if((i+7)in grid&&!grid[i][j]&&!grid[i+1][j]&&!grid[i+2][j]&&grid[i+3][j]===color&&grid[i+4][j]===color&&!grid[i+5][j]&&!grid[i+6][j]&&!grid[i+7][j])count++;if((i+7)in grid&&(j+7)in grid&&!grid[i][j]&&!grid[i+1][j+1]&&!grid[i+2][j+2]&&grid[i+3][j+3]===color&&grid[i+4][j+4]===color&&!grid[i+5][j+5]&&!grid[i+6][j+6]&&!grid[i+7][j+7])count++;if((i-7)in grid&&(j+7)in grid&&!grid[i][j]&&!grid[i-1][j+1]&&!grid[i-2][j+2]&&grid[i-3][j+3]===color&&grid[i-4][j+4]===color&&!grid[i-5][j+5]&&!grid[i-6][j+6]&&!grid[i-7][j+7])count++;}}
return count;}
function hasTwo(color){var count=0;for(var i=0;i<grid.length;i++){for(var j=0;j<grid.length;j++){if(((j+4)in grid&&!grid[i][j]&&!grid[i][j+1]&&!grid[i][j+2]&&grid[i][j+3]===color&&grid[i][j+4]===color)||((j+4)in grid&&grid[i][j]===color&&grid[i][j+1]===color&&!grid[i][j+2]&&!grid[i][j+3]&&!grid[i][j+4]))count++;if(((i+4)in grid&&!grid[i][j]&&!grid[i+1][j]&&!grid[i+2][j]&&grid[i+3][j]===color&&grid[i+4][j]===color)||((i+4)in grid&&grid[i][j]===color&&grid[i+1][j]===color&&!grid[i+2][j]&&!grid[i+3][j]&&!grid[i+4][j]))count++;if(((i+4)in grid&&(j+4)in grid&&!grid[i][j]&&!grid[i+1][j+1]&&!grid[i+2][j+2]&&grid[i+3][j+3]===color&&grid[i+4][j+4]===color)||((i+4)in grid&&(j+4)in grid&&grid[i][j]===color&&grid[i+1][j+1]===color&&!grid[i+2][j+2]&&!grid[i+3][j+3]&&!grid[i+4][j+4]))count++;if(((i-4)in grid&&(j+4)in grid&&!grid[i][j]&&!grid[i-1][j+1]&&!grid[i-2][j+2]&&grid[i-3][j+3]===color&&grid[i-4][j+4]===color)||((i-4)in grid&&(j+4)in grid&&grid[i][j]===color&&grid[i-1][j+1]===color&&!grid[i-2][j+2]&&!grid[i-3][j+3]&&!grid[i-4][j+4]))count++;}}
return count;}
var openFours=hasOpenFour(cpuColor);var closedFours=hasFour(cpuColor)-openFours;var openThrees=hasOpenThree(cpuColor);var closedThrees=hasThree(cpuColor)-openThrees;var openTwos=hasOpenTwo(cpuColor);var closedTwos=hasTwo(cpuColor)-openTwos;var oppOpenFours=hasOpenFour(oppColor);var oppClosedFours=hasFour(oppColor)-oppOpenFours;var oppOpenThrees=hasOpenThree(oppColor);var oppClosedThrees=hasThree(oppColor)-oppOpenThrees;var oppOpenTwos=hasOpenTwo(oppColor);var oppClosedTwos=hasTwo(oppColor)-oppOpenTwos;return(((2*openTwos)+(1*closedTwos)+
(200*openThrees)+(2*closedThrees)+
(2000*openFours)+(200*closedFours)+
(2000*hasFive(cpuColor)))-
((2*oppOpenTwos)+(1*oppClosedTwos)+
(2000*oppOpenThrees)+(20*oppClosedThrees)+
(20000*oppOpenFours)+(2000*oppClosedFours)+
(20000*hasFive(oppColor))));}