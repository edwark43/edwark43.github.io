var w,h,my={};function alloutMain(){let version='0.52';w=360;h=450;my.activeQ=true
my.bdSz=5
var s='';s+='<style>'
s+='.btn { display: inline-block; position: relative; text-align: center; margin: 2px; text-decoration: none; font: 15px/25px Arial, sans-serif; color: #268; border: 1px solid #88aaff; border-radius: 10px;cursor: pointer; background: linear-gradient(to top right, rgba(170,190,255,1) 0%, rgba(255,255,255,1) 100%); outline-style:none;}'
s+='.btn:hover { background: linear-gradient(to top, rgba(255,255,0,1) 0%, rgba(255,255,255,1) 100%); }'
s+='.yy { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(255,220,130,1) 0%, rgba(255,255,255,1) 100%);  }'
s+='.hi { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(130,220,255,1) 0%, rgba(255,255,255,1) 100%); box-shadow: 2px 2px 6px #66a; }'
s+='.lo { border: solid 1px #888888; background: linear-gradient(to top, rgba(170,170,170,1) 0%, rgba(205,205,205,1) 100%);  }'
s+='</style>'
my.sndHome=(document.domain=='localhost')?'/mathsisfun/images/sounds/':'/images/sounds/'
s+='<audio id="sndNew" src="'+my.sndHome+'click4.mp3" preload="auto"></audio>'
s+='<audio id="sndWin" src="'+my.sndHome+'yes2.mp3" preload="auto"></audio>';s+='<audio id="sndClick" src="'+my.sndHome+'click1.mp3" preload="auto"></audio>';my.snds=[];s+='<div id="main" style="position:relative; width:'+w+'px; min-height:'+h+'px;  margin:auto; display:block; background: #ffe;  border-radius: 10px;">';s+='<div id="top" style="font: 24px Arial; text-align:center; margin-top:3px; height:34px">'
s+='<div id="btns" style="position:absolute; left: 3px; font: 18px Arial;">'
s+='<button id="optBtn" type="button" style="z-index:2;" class="btn" onclick="optPop()">Options</button>'
s+='<button id="newBtn" type="button" style="z-index:2;" class="btn" onclick="gameNew()">Restart</button>'
s+='<button id="hintBtn" type="button" style="z-index:2;" class="btn" onclick="gameHint()">Hint</button>'
s+='</div>';s+='<div style="position:absolute; right:15px; ">';s+='<button id="nextBtn" type="button" style="z-index:2; border: 3px solid blue;" class="btn" onclick="gameNext()">Next</button>'
my.soundQ=true
s+='&nbsp;'
s+=soundBtnHTML()
s+='</div>';s+='<div id="scores" style="position:absolute; right: 3px; font: bold 24px Arial;" onclick="start()">'
s+='</div>'
s+='</div>'
s+='<div id="msg" style="font: 24px Arial; text-align:center; margin-top:5px;">&nbsp;</div>'
s+='<div id="board" style=""></div>';s+=optPopHTML();s+='<canvas id="timercanvas" width="100" height="100" style="z-index:2;  width:100px;"></canvas>';s+='<div style="font: 11px Arial; color: #bb0; position:absolute; bottom:5px; text-align:center;"> &copy; 2019 MathsIsFun.com  v'+version+'</div>';s+='</div>';document.write(s);this.clrs=[["Blue",'#0000FF'],["Red",'#FF0000'],["Black",'#000000'],["Green",'#00cc00'],["Orange",'#FFA500'],["Slate Blue",'#6A5ACD'],["Lime",'#00FF00'],["Spring Green",'#00FF7F'],["Teal",'#008080'],["Gold",'#ffd700'],["Med Purple",'#aa00aa'],["Light Blue",'#ADD8E6'],["Navy",'#000080'],["Purple",'#800080'],["Dark SeaGreen",'#8FBC8F']];my.clrNum=0;my.puzN=0
gameNew()}
function gameNew(){soundPlay('sndNew')
var myNode=document.getElementById("board");while(myNode.firstChild){myNode.removeChild(myNode.firstChild);}
my.moveN=0
document.getElementById('nextBtn').style.visibility='hidden'
my.boxWd=Math.min(70,(Math.min(w,h-90))/my.bdSz)
console.log('my',my)
bdDraw()
let puz=puzGet(my.puzN)
var mat=puz2Mat(puz)
mat2bd(mat)
bdCheck()}
function gameNext(){my.puzN++
if(my.puzN>=my.puzzles.length)my.puzN=0
gameNew()}
function msg(s){document.getElementById('msg').innerHTML=s}
function bdDraw(){my.borderTp=75
my.borderLt=(w-my.bdSz*my.boxWd)/2
my.bd=[]
for(var xn=0;xn<my.bdSz;xn++){my.bd[xn]=[]
for(var yn=0;yn<my.bdSz;yn++){var tile=new Tile(my.boxWd,my.boxWd,boxLeft(xn),boxTop(yn))
tile.xn=xn;tile.yn=yn;my.bd[xn][yn]=tile}}}
function bdFlip(xn,yn){var nbors=[[-1,0],[1,0],[0,1],[0,-1]]
for(var i=0;i<nbors.length;i++){var nbor=nbors[i];var xi=xn+nbor[0]
var yi=yn+nbor[1]
if(xi<0)continue
if(yi<0)continue
if(xi>=my.bdSz)continue
if(yi>=my.bdSz)continue
my.bd[xi][yi].flip()}
bdCheck()}
function bdCheck(){let n=0
for(var yn=0;yn<my.bdSz;yn++){for(var xn=0;xn<my.bdSz;xn++){var tile=my.bd[xn][yn]
if(tile.onQ)n++}}
console.log('bdCheck',n+' on')
var successQ=n==0
my.fmts=[{hi:{border:'4px solid gold',bg:'#ffc'},lo:{border:'4px solid white',bg:'#ffe'}},{lo:{border:'none',bg:'#ffe'},hi:{border:'none',bg:'linear-gradient(to bottom right, rgba(156,175,251,0.5) 0%, rgba(255,255,255,0.5) 40%, rgba(156,175,241,0.5) 100%)'}},]
let fmt=my.fmts[1];if(successQ){console.log('successQ')
msg('Success in '+my.moveN+' moves')
document.getElementById('main').style.border=fmt.hi.border
document.getElementById('main').style.background=fmt.hi.bg
document.getElementById('nextBtn').style.visibility='visible'
soundPlay('sndWin')}else{msg('Puzzle '+(my.puzN+1))
document.getElementById('main').style.border=fmt.lo.border
document.getElementById('main').style.background=fmt.lo.bg
document.getElementById('nextBtn').style.visibility='hidden'}}
function boxLeft(xn){return my.borderLt+my.boxWd*xn}
function boxTop(yn){return my.borderTp+my.boxWd*yn}
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
function radioHTML(prompt,id,lbls,func){var s='';s+='<div style="display:inline-block; border: 1px solid white; border-radius:5px; padding:3px; margin:3px; background-xnor:rgba(255,255,255,0.5);">';s+=prompt;for(var i=0;i<lbls.length;i++){var lbl=lbls[i];var idi=id+i;var chkStr=(i==0)?' checked ':'';s+='<input id="'+idi+'" type="radio" name="'+id+'" value="'+lbl+'" onclick="'+func+'('+i+');" autocomplete="off" '+chkStr+' >';s+='<label for="'+idi+'">'+lbl+' </label>';}
s+='</div>';return s;}
function endGameCallback(){}
var seed=1;var seed=+new Date();function random(){var x=Math.sin(seed++)*10000;return x-Math.floor(x);}
function getRandomArbitrary(min,max){return Math.random()*(max-min)+min;}
function getRandomInt(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
function optPopHTML(){var s='';s+='<div id="optpop" style="position:absolute; left:-500px; top:0px; width:360px; padding: 5px; border-radius: 9px; background-color: #bcd; box-shadow: 10px 10px 5px 0px rgba(40,40,40,0.75); transition: all linear 0.3s; opacity:0; text-align: center; ">';s+='<div id="optInside" style="margin: 5px auto 5px auto;">';s+='</div>';s+='<div style="position:relative; margin:auto; text-align:center; font:14px Arial; background-color:lightblue;  margin: 5px 0 1px 0; padding: 5px 0 5px 0;">';s+=getDropdownHTML(my.puzzles,'gameNew','puz',0)
s+='</div>'
s+='<div style="float:right; margin: 0 0 5px 10px;">';s+='<button id="optYes" onclick="optYes()" style="z-index:2; font: 22px Arial;" class="togglebtn" >&#x2714;</button>';s+='<button onclick="optNo()" style="z-index:2; font: 22px Arial;" class="togglebtn" >&#x2718;</button>';s+='</div>';s+='</div>';return s;}
function optPop(){var pop=document.getElementById('optpop');pop.style.transitionDuration="0.3s";pop.style.opacity=1;pop.style.zIndex=12;pop.style.left=(w-400)/2+'px';}
function optYes(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-999px';var div=document.getElementById("puz");my.puzN=div.selectedIndex;console.log('puzzle num',my.puzN)
gameNew()}
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
function soundPlay(id,simulQ){if(!my.soundQ)return
simulQ=typeof simulQ!=='undefined'?simulQ:false
if(simulQ){if(id.length>0)document.getElementById(id).play()}else{my.snds.push(id)
soundPlayQueue(id)}}
function soundPlayQueue(id){var div=document.getElementById(my.snds[0])
div.play().then(_=>{}).catch(error=>{my.snds.shift();});div.onended=function(){my.snds.shift();if(my.snds.length>0)soundPlayQueue(my.snds[0]);};}
function soundToggle(){var btn='sound'
if(my.soundQ){my.soundQ=false
document.getElementById(btn).classList.add("mute")}else{my.soundQ=true
document.getElementById(btn).classList.remove("mute")}}
function Timer(g,rad,secs,clr,funcEnd){this.g=g;this.rad=rad;this.secs=secs;this.clr=clr;this.funcEnd=funcEnd;this.x=rad;this.y=rad;this.stt=performance.now();this.stopQ=false;}
Timer.prototype.update=function(){};Timer.prototype.restart=function(secs){this.secs=secs;this.stt=performance.now();this.stopQ=false;requestAnimationFrame(this.draw.bind(this));};Timer.prototype.more=function(secs){this.stt+=secs*1000;};Timer.prototype.stop=function(){this.stopQ=true;};Timer.prototype.draw=function(){if(this.stopQ)return;var now=performance.now();var elapsed=now-this.stt;var ratio=Math.min(1,elapsed/this.secs/1000);var g=this.g;g.beginPath();g.fillStyle="#def";g.arc(this.x,this.y,this.rad,0,2*Math.PI);g.fill();g.beginPath();g.moveTo(this.x,this.y);g.fillStyle=this.clr;g.arc(this.x,this.y,this.rad,-Math.PI/2,ratio*2*Math.PI-Math.PI/2);g.fill();if(ratio<1){requestAnimationFrame(this.draw.bind(this));}else{this.funcEnd();}};class Tile{constructor(wd,ht,lt,tp){this.wd=wd;this.ht=ht;this.bgClr='#ffe';this.bdrClr='grey';this.overClr='#dc8'
this.offClr='#fff';this.onClr='#dd0';this.onQ=false
this.hiliteQ=false
var div=document.createElement("div");div.style.width=wd+'px';div.style.height=ht+'px';div.style.position='absolute';div.style.top=tp+'px';div.style.left=lt+'px';this.div=div;var me=this;div.addEventListener('mouseover',function(){if(!my.activeQ)return;me.overQ=true
me.draw();});div.addEventListener('mouseleave',function(){if(!my.activeQ)return;me.overQ=false
me.draw();});div.addEventListener('click',function(){if(!my.activeQ)return;me.overQ=false
me.flip();my.moveN++
soundPlay('sndClick')
bdFlip(me.xn,me.yn)});var can=document.createElement('canvas');can.style.position="absolute";can.style.top='0px';can.style.left='0px';can.style.width='100%';can.style.height='100%';can.width=wd;can.height=ht;this.g=can.getContext("2d");div.appendChild(can);document.getElementById('board').appendChild(div);this.draw();}
draw(){var g=this.g;g.clearRect(0,0,this.wd,this.ht);let style=this.onQ?2:4
g.pieceDraw(this.wd/2,this.ht/2,this.wd*0.44,style,this.overQ)
if(this.hiliteQ){g.strokeStyle='#0cc'
g.lineWidth=5
g.beginPath();g.arc(this.wd*0.508,this.ht*0.508,this.wd*0.44,0,2*Math.PI)
g.stroke();}
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
my.puzzles=[[2,7,10,28,8],[0,0,0,28,42,28],[0,0,21,0,0],[21,21,0,21,21],[10,27,27,27,10],[0,27,0,17,27],[15,23,23,24,27],[0,0,21,21,14],[15,17,17,17,15],[0,4,10,21,10],[10,31,14,26,7],[14,14,14,0,0],[21,21,21,21,14],[31,10,27,14,10],[8,20,10,5,2],[0,0,2,2,2],[0,2,0,2,0],[1,1,1,1,31],[0,0,4,14,31],[4,10,21,10,4],[21,0,21,0,21],[0,0,17,0,0],[30,2,14,2,2],[14,17,17,17,14],[0,0,28,12,4],[0,0,17,31,18],[1,3,7,15,30],[17,17,31,17,17],[4,14,4,4,4],[0,0,28,28,28],[0,2,0,0,0],[0,0,4,0,0],[17,19,21,25,17],[31,8,4,2,31],[8,8,21,17,25],[20,17,17,22,30],[24,10,17,21,0],[4,10,17,31,17],[0,14,14,14,0],[21,10,21,10,21],[10,1,3,12,10],[0,0,10,0,0],[17,10,4,4,4],[7,9,7,9,7],[17,11,7,2,14],[0,27,31,4,14],[14,5,28,15,21],[4,14,31,14,4],[4,31,5,18,16],[0,17,4,17,0],[17,10,4,10,17],[31,31,31,31,31],[27,0,27,0,27],[31,4,0,4,31],[31,10,4,10,31],[10,17,0,27,17],[4,6,27,12,4],[10,31,21,31,10],[21,17,27,17,21],[0,0,14,2,0],[16,8,4,6,5],[0,21,17,21,17],[31,14,14,14,31],[17,10,0,10,17],[14,10,14,8,14],[15,9,15,7,9],[21,21,21,21,14],[14,2,14,8,14],[31,17,21,17,31],[21,0,21,0,21],[10,21,14,21,10],[21,0,0,0,21],[31,29,27,23,31],[31,4,31,17,17],[27,10,27,10,27],[4,10,31,17,31],[17,27,21,17,17],[31,21,31,21,31],[14,4,4,4,14],[14,10,31,14,27],[0,0,4,0,0],[17,0,4,0,17],[27,27,0,27,27],[10,0,17,14,4],[21,14,27,14,21],[17,19,21,25,17],[21,21,27,21,21],[4,4,14,21,21],[21,21,21,21,31],[0,14,14,14,0],[4,10,17,31,17],[21,10,21,10,21],[17,14,10,14,17],[4,10,17,10,4],[21,0,10,0,21],[10,31,10,31,10],[31,21,31,29,31],[17,10,4,10,17],[31,4,31,4,31],[31,14,4,14,31],[4,21,31,21,4],[31,31,31,31,31]];function gameHint(){console.log('gameHint')
let mat=bd2mat(my.bd)
console.log('mat',mat)
let puz=[]
puz[0]=0
for(let i=0;i<mat.length;i++){let row=mat[i];var val=0
for(let j=0;j<row.length;j++){val+=row[j]*Math.pow(2,j)}
puz.push(val*2)}
console.log('puz',puz)
let hnt=solveFull(puz)
let pnts=puz2Pts(hnt)
if(pnts.length>0){let pnt=pnts[Math.floor(pnts.length/2)];my.bd[pnt[1]][pnt[0]].hilite()}}
var qbit=[1,2,4,8,16,32,64,128]
let msk=qbit[6]-2;function puzGet(n){let puz=[];for(let i=0;i<=5;i++){puz[i]=(i==0)?0:2*my.puzzles[n][i-1];}
console.log('puzGet',puz)
return puz}
function solveAlmost(puz,hnt){for(let i=2;i<=5;i++){var c=puz[i-1]&msk;puz[i]^=c^(c+c)^(c>>1);puz[i+1]^=c;puz[i-1]=0;hnt[i]^=c;}}
function solveFull(puz){let backup=[];for(let i=0;i<=5;i++)backup[i]=puz[i];let hnt=[]
for(let i=0;i<=5;i++)hnt[i]=0;solveAlmost(puz,hnt);let aim=puz[5];puz[5]=0;let bot=[34,20,56,0,0];let inv=[6,14,12,54,42];let m=0;for(let k=1;k<=5;k++){let c=qbit[k];if(bot[m]&c){if(aim&c){aim^=bot[m];let d=inv[m];hnt[1]^=d;puz[1]=(puz[1]^d^(d+d)^(d>>1))&msk;puz[2]^=d;}
m++;}}
if(aim&msk){for(let i=0;i<=5;i++)puz[i]=backup[i];return(false);}
solveAlmost(puz,hnt);aim=countHnt(hnt);var backhnt=[];for(var i=1;i<=5;i++)backhnt[i]=hnt[i];console.log('A',hnt)
let invar=[];invar[0]=[54,0,54,0,54];invar[1]=[42,42,0,42,42];invar[2]=[28,42,54,42,28];for(let c=0;c<=2;c++){for(let i=1;i<=5;i++)hnt[i]=backhnt[i]^invar[c][i-1];let j=countHnt(hnt);if(j<aim){for(let i=1;i<=5;i++)backhnt[i]=hnt[i];aim=j;}}
for(let i=1;i<=5;i++)hnt[i]=backhnt[i];for(let i=1;i<=5;i++)puz[i]=backup[i];return hnt}
let qcnt=[0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4,1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5];function countHnt(hnt){let c=0;for(let i=1;i<=5;i++){c+=qcnt[hnt[i]>>1]+qcnt[hnt[i]>>6];}
return c}
function puz2Mat(puz){let mat=[];for(let i=0;i<my.bdSz;i++){let row=[];let num=puz[i+1]
for(let j=0;j<my.bdSz;j++){num=parseInt(num/2)
row.push(num%2)}
mat.push(row)}
console.log('puz2Mat',mat)
return mat}
function puz2Pts(puz){let pts=[];console.log('puz2Mat',puz)
for(let i=0;i<my.bdSz;i++){let row=[];let num=puz[i+1]
for(let j=0;j<my.bdSz;j++){num=parseInt(num/2)
if(num%2){pts.push([i,j])}}}
console.log('puz2Pts',pts)
return pts}
function mat2bd(mat){for(let i=0;i<my.bdSz;i++){for(let j=0;j<my.bdSz;j++){let bin=mat[i][j]
let tile=my.bd[j][i]
tile.onQ=bin
tile.draw()}}}
function bd2mat(bd){let mat=[]
for(let i=0;i<my.bdSz;i++){let row=[]
for(let j=0;j<my.bdSz;j++){row.push(bd[j][i].onQ?1:0)}
mat.push(row)}
return mat}