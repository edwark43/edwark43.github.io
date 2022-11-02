let el,w,h,my={};function spreadMain(wd,ht){let version='0.38';w=typeof wd!=='undefined'?wd:'500';h=typeof ht!=='undefined'?ht:'400';my.opts={gameN:2}
let ltBG='background: radial-gradient(#bbb 15%, transparent 16%) 0 0,radial-gradient(#bbb 15%, transparent 16%) 6px 6px,	radial-gradient(rgba(240,240,240,.1) 15%, transparent 20%) 0 1px,	radial-gradient(rgba(240,240,240,.1) 15%, transparent 20%) 6px 6px; background-color:#abc;	background-size:12px 12px;';my.mates=[{name:'Blue',bgClr:'rgba(120,250,128,0.1)',fgClr:'rgba(120,250,128,0.1)',ai:1},{name:'Red',bgClr:'rgba(255,0,0,1)',fgClr:'rgba(120,250,128,0.1)',ai:0},{name:'Green',bgClr:'rgba(0,255,0,1)',fgClr:'rgba(120,250,128,0.1)',ai:1}];my.mateMax=2;my.vals=[{clr:'rgba(66,88,255,1)'},{clr:'rgba(255,0,0,1)'},{clr:'rgba(0,255,0,1)'},{clr:'rgba(0,255,255,1)'},{clr:'rgba(255,155,255,1)'},{clr:'rgba(0,0,0,1)'},]
my.hards=[{title:'Easy',worst:4},{title:'Basic',worst:2},{title:'Hard',worst:0}];my.gameN=optGet('gameN')
my.games=[{name:'10x9  (3)',xn:10,yn:9,allEdgesQ:true,clrN:3,clickMax:6},{name:'14x12 (3)',xn:14,yn:12,allEdgesQ:true,clrN:3,clickMax:7},{name:'14x12 (4)',xn:14,yn:12,allEdgesQ:true,clrN:4,clickMax:11},{name:'16x14 (4)',xn:16,yn:14,allEdgesQ:true,clrN:4,clickMax:11},{name:'17x15 (4)',xn:17,yn:15,allEdgesQ:true,clrN:4,clickMax:12},{name:'17x15 (5)',xn:17,yn:15,allEdgesQ:true,clrN:5,clickMax:14},{name:'17x15 (6)',xn:17,yn:15,allEdgesQ:true,clrN:6,clickMax:17},{name:'20x18 (6)',xn:20,yn:18,allEdgesQ:true,clrN:6,clickMax:19},{name:'24x22 (6)',xn:24,yn:22,allEdgesQ:true,clrN:6,clickMax:21},{name:'28x25 (6)',xn:28,yn:25,allEdgesQ:true,clrN:6,clickMax:24},{name:'33x28 (6)',xn:33,yn:28,allEdgesQ:true,clrN:6,clickMax:27},]
my.game=my.games[my.gameN]
let s='';my.sndHome=(document.domain=='localhost')?'/mathsisfun/images/sounds/':'/images/sounds/'
s+='<audio id="sndwin" src="'+my.sndHome+'success.mp3" preload="auto"></audio>'
s+='<audio id="sndmove" src="'+my.sndHome+'click1.mp3" preload="auto"></audio>'
s+='<div id="main" class="js" style="position: relative; width:'+w+'px; height:'+h+'px;">';s+='<div id="score" style="font: 23px Arial; position:absolute; left:220px; top:5px; text-align: right;">0</div>';s+='<div id="win" style="position:absolute; left:-500px; top:60px; width:380px; padding: 5px; border-radius: 9px; color: white; background-color: rgba(0,0,60,0.8); box-shadow: 5px 5px 3px 0px rgba(0,0,0,0.3); transition: all linear 0.3s; opacity:0; text-align: center; font: 24px Arial;  z-index:20;">';s+='<div id="winTxt">Completed</div>';s+='<button onclick="winClose(true)" style="float:right; font: 22px Arial;" class="btn" >&#x2714;</button>';s+='<button onclick="winClose(false)" style="float:right; font: 22px Arial;" class="btn" >&#x2718;</button>';s+='</div>';s+='<div style="position: absolute; left:3px; top:3px; ">';s+='<button id="restart" style="font: 14px Arial; height:30px; vertical-align:middle; z-index: 10;" class="btn" onclick="optPop()" >New Game</button>';s+='<button id="resize" style="font: 14px Arial; height:30px; vertical-align:middle; z-index: 10;" class="btn" onclick="sizeToggle()" >Resize</button>';my.soundQ=true
s+=soundBtnHTML()
s+='</div>';s+='<div style="font: 9px arial; color: blue; position:absolute; right:10px; top:3px;">&copy; 2021 MathsIsFun.com  v'+version+'</div>';s+='<canvas id="can1" style="position: absolute; width:'+w+'px; height:'+h+'px; left: 0; top:0; border: none;"></canvas>';s+='<canvas id="can2" style="position: absolute; width:'+w+'px; height:'+h+'px; left: 0; top:0; border: none;"></canvas>';s+=optPopHTML();s+='</div>';document.write(s);el=document.getElementById('can1');canResize(el,w,h);g=el.getContext("2d");el2=document.getElementById('can2');canResize(el2,w,h);g2=el2.getContext("2d");this.clrs=[["Blue",'#0000FF'],["Red",'#FF0000'],["Black",'#000000'],["Green",'#00cc00'],["Violet",'#EE82EE'],["Orange",'#FFA500'],["Light Salmon",'#FFA07A'],["Slate Blue",'#6A5ACD'],["Yellow",'#FFFF00'],["Aquamarine",'#7FFFD4'],["Pink",'#FFC0CB'],["Coral",'#FF7F50'],["Lime",'#00FF00'],["Pale Green",'#98FB98'],["Spring Green",'#00FF7F'],["Teal",'#008080'],["Hot Pink",'#FF69B4'],["Yellow",'#ffff00'],["Aqua",'#00ffff'],["Gold",'#ffd700'],["Khaki",'#F0E68C'],["Thistle",'#D8BFD8'],["Med Purple",'#aa00aa'],["Light Blue",'#ADD8E6'],["Sky Blue",'#87CEEB'],["Navy",'#000080'],["Purple",'#800080'],["Wheat",'#F5DEB3'],["Tan",'#D2B48C'],["Silver",'#C0C0C0']];el2=document.getElementById('can2');el2.addEventListener('touchstart',touchStart,false);el2.addEventListener('touchmove',touchMove,false);window.addEventListener('touchend',touchEnd,false);el2.addEventListener("mousedown",mouseDown,false);el2.addEventListener("mousemove",mouseMove,false);window.addEventListener("mouseup",mouseUp,false);my.holesQ=false;my.turn=0;my.turnQ=true;my.turns=[0,0,0];my.bd=new Board();my.maxQ=false;window.addEventListener('resize',resize,false);window.addEventListener('orientationchange',resize,false);mateMaxChg(0,0);optPop();}
function hardChg(n){my.hard=my.hards[n];console.log('hardChg',n,my.hard);}
function sizeToggle(){my.maxQ=!my.maxQ;resize();}
function resize(){let wd=500;let ht=400;let tpGap=50
let gap=20
if(my.maxQ){wd=window.innerWidth
ht=window.innerHeight-tpGap}
let xSz=(wd-gap)/((my.game.xn+0.5)*2*0.866)
let ySz=(ht-gap)/(my.game.yn*1.5)
my.cellWd=Math.min(xSz,ySz)
let xExcess=wd-my.cellWd*(my.game.xn+0.5)*2*0.866
my.bd.lt=my.cellWd+xExcess/2
my.bd.tp=my.cellWd
console.log("resize",xExcess,my.maxQ,xSz,ySz,my.cellWd,wd,ht);let div=document.getElementById('main');let dadStyle=getComputedStyle(div.parentNode);let dadWd=parseInt(dadStyle.width)
div.style.left=(dadWd-wd)/2+"px";div.style.top=2+"px";div.style.width=(wd<<0)+"px";div.style.height=((ht+tpGap)<<0)+"px";canResize(el,0,tpGap,wd,ht);canResize(el2,0,tpGap,wd,ht);my.bd.redraw();}
function canResize(can,lt,tp,wd,ht){ratio=2;can.left=lt;can.top=tp;can.style.left=lt+"px";can.style.top=tp+"px";can.width=wd*ratio;can.height=ht*ratio;can.style.width=wd+"px";can.style.height=ht+"px";can.getContext("2d").setTransform(ratio,0,0,ratio,0,0);}
function turnNext(){return
g2.clearRect(0,0,el.width,el.height);if(my.bd.getLeft()<=0){my.bd.redraw();win();return;}
my.turn=loop(my.turn,0,my.mateMax-1);let player=my.mates[my.turn];console.log('turnNext',player,my)
let val=player.rounds[player.roundN++];val=Math.max(1,Math.min(val,20));my.turns[my.turn]+=val;my.bd.redraw();if(my.mates[my.turn].ai==1){my.turnQ=false;setTimeout(aimove,1000);}}
function aimove(){my.bd.aimove();my.turnQ=true;}
class Cell{constructor(xn,yn,val){this.xn=xn
this.yn=yn
this.val=val
this.typ=-1}
draw(g,setClrQ=true){let jig=0;if(this.yn%2)jig=my.cellWd*(0.866);let xc=this.xn*my.cellWd*2*0.866+jig;let yc=this.yn*my.cellWd*1.5;if(setClrQ){g.strokeStyle='#99a';if(this.typ>=-1){g.lineWidth=1;if(this.typ==-1){g.fillStyle=my.vals[this.val].clr;}else{g.fillStyle=my.mates[my.turn].bgClr
g.strokeStyle=my.mates[my.turn].fgClr}}}
if(this.typ==-2){g.lineWidth=0;g.strokeStyle='transparent';g.fillStyle='transparent';}
for(let i=0;i<1;i++){drawHex(g,my.bd.lt+xc,my.bd.tp+yc,my.cellWd-i);g.fill();g.stroke();}
let s=(this.typ==-1)?'':'😀'
if(s.length>0){g.textAlign='center';g.font=((my.cellWd*0.8)<<0)+'px Arial';let endClr=g.fillStyle;g.fillStyle='black';g.fillText(s,my.bd.lt+xc,my.bd.tp+yc+my.cellWd*0.3);g.fillStyle=endClr}}
click(){if(my.soundQ)document.getElementById('sndmove').play();my.mates[my.turn].clickN+=1
this.typ=my.turn
console.log('Cell click',my.turn,this)
this.draw(g)
if(my.game.allEdgesQ){let edges=[]
do{edges=my.bd.chgEdges(this.val)}while(edges.length>0)}else{this.nborChg(this.val)}
my.bd.redraw()
let leftN=my.bd.getLeft()
if(leftN==0&&my.mates[my.turn].clickN<=my.mates[my.turn].clickMax){win(true)
return}
if(my.mates[my.turn].clickN>=my.mates[my.turn].clickMax){win(false)}}
nborChg(v){let nbors=my.bd.getNbors(this.xn,this.yn);for(let i=0;i<nbors.length;i++){let cell=nbors[i]
if(cell.typ==-1&&cell.val==v){cell.typ=my.turn
cell.draw(g)
cell.nborChg(v)}}}}
class Board{constructor(){this.lt=my.cellWd
this.tp=my.cellWd
this.cells=[]
this.edges=[]
this.scores=[];this.frame=0}
fill(){for(let i=0;i<my.game.xn;i++){this.cells[i]=[]
for(let j=0;j<my.game.yn-1;j++){let val=(Math.random()*(my.game.clrN))<<0
this.cells[i][j]=new Cell(i,j,val)}}
console.log('this.cells',this.cells)}
setRand(typ){let xn=(Math.random()*my.game.xn)<<0
let yn=(Math.random()*my.game.yn-1)<<0
console.log('setRand',xn,yn,this.cells)
let cell=this.cells[xn][yn]
cell.typ=typ
this.edges=this.getEdges()
return cell}
aiStt(){this.frame=0
this.aiLoop()}
aiLoop(){if(this.frame++>99){if(1==0){this.edges=this.getEdges()
if(this.edges.length>0){let n=(Math.random()*this.edges.length)<<0
let edge=this.edges[n];edge.click()}}
if(1==0){if(my.game.allEdgesQ){for(let i=0;i<my.game.clrN;i++){my.mates[my.turn].clickN+=1
let backup=my.bd.cells.slice(0)
let cnt=0
let edges=[]
do{edges=my.bd.chgEdges(i)
cnt+=edges.length}while(edges.length>0)
my.bd.cells=backup.slice(0)
my.bd.redraw()}}}
console.log('yippee',this.frame)
this.frame=0
if(this.getLeft()<=0)return}
requestAnimationFrame(this.aiLoop.bind(this));}
aimove(){let orig=copy2d(this.cells);let bests=[];for(let i=0;i<my.game.xn;i++){for(let j=0;j<my.game.yn-1;j++){this.cells=copy2d(orig);if(this.cells[i][j].typ!=-1)
continue;this.doCell(i,j);let diff=this.scoreGet();bests.push([diff,i,j]);}}
bests.sort(function(a,b){return b[0]-a[0];});let bestNo=randomInt(0,Math.min(my.hard.worst,bests.length-1));console.log("aimove BEST NO:",bestNo);let best=bests[bestNo];this.cells=copy2d(orig);this.doCell(best[1],best[2]);turnNext();}
getLeft(){let n=0;for(let i=0;i<my.game.xn;i++){for(let j=0;j<my.game.yn-1;j++){if(this.cells[i][j].typ==-1){n++;}}}
console.log("getLeft",n);return n;}
scoreGet(typ){let x=0;for(let i=0;i<my.game.xn;i++){for(let j=0;j<my.game.yn;j++){let cell=this.cells[i][j];if(cell.typ==my.turn)
x+=cell.val;}}
return x;}
hiCell(xc,yc){xc-=this.lt;yc-=this.tp;let yn=(yc/(my.cellWd*1.5)+0.5)<<0;let xn=(xc/(my.cellWd*2*0.866)+0.5)<<0;if(yn%2){xn=(xc/(my.cellWd*2*0.866))<<0;}else{}
this.hilite(xn,yn);}
click(xc,yc){xc-=this.lt;yc-=this.tp;let yn=(yc/(my.cellWd*1.5)+0.5)<<0;let xn=(xc/(my.cellWd*2*0.866)+0.5)<<0;if(yn%2)xn=(xc/(my.cellWd*2*0.866))<<0;if(xn<0)return;if(yn<0)return;if(xn>=my.game.xn)return;if(yn>=my.game.yn)return;let edgeQ=false
for(let i=0;i<this.edges.length;i++){let edge=this.edges[i];if(edge.xn==xn&&edge.yn==yn)edgeQ=true}
if(!edgeQ)return
let cell=this.cells[xn][yn];cell.click()
this.edges=this.getEdges()
turnNext();}
inq(xn,yn){if(xn<0)return false;if(yn<0)return false;if(xn>=my.game.xn)return false;if(yn>=my.game.yn-1)return false;return true;}
hilite(xn,yn){g2.clearRect(0,0,el2.width,el2.height);if(!this.inq(xn,yn))return;let edgeQ=false
for(let i=0;i<this.edges.length;i++){let edge=this.edges[i];if(edge.xn==xn&&edge.yn==yn)edgeQ=true}
if(!edgeQ)return
let cell=this.cells[xn][yn];g2.strokeStyle='yellow';g2.lineWidth=3;if(my.turn==0){g2.fillStyle='rgba(0,0,255,0.6)';}else{g2.fillStyle='rgba(255,0,0,0.6)';}
g2.fillStyle='rgba(0,0,255,0)';cell.draw(g2,false);}
getEdges(){let edges=[]
for(let i=0;i<my.game.xn;i++){for(let j=0;j<my.game.yn-1;j++){let cell=this.cells[i][j]
if(cell.typ==-1){let edgeQ=false
let nbors=this.getNbors(i,j)
for(let k=0;k<nbors.length;k++){let nbor=nbors[k];if(nbor.typ>-1)edgeQ=true}
if(edgeQ)edges.push(cell)}}}
return edges}
chgEdges(val){let edges=[]
for(let i=0;i<my.game.xn;i++){for(let j=0;j<my.game.yn-1;j++){let cell=this.cells[i][j]
if(cell.typ==-1){let edgeQ=false
let nbors=this.getNbors(i,j)
for(let k=0;k<nbors.length;k++){let nbor=nbors[k];if(nbor.typ>-1&&cell.val==val)edgeQ=true}
if(edgeQ)edges.push(cell)}}}
for(let i=0;i<edges.length;i++){let edge=edges[i];if(edge.val==val)
edge.val=my.turn
edge.typ=my.turn}
return edges}
getNbors(xn,yn){let maybes=[[xn-1,yn],[xn+1,yn]];let inc=yn%2?1:0;maybes.push([xn-1+inc,yn-1]);maybes.push([xn+inc,yn-1]);maybes.push([xn-1+inc,yn+1]);maybes.push([xn+inc,yn+1]);let nbors=[];for(let i=0;i<maybes.length;i++){let maybe=maybes[i];if(this.inq(maybe[0],maybe[1])){nbors.push(this.cells[maybe[0]][maybe[1]]);}}
return nbors;}
restart(){this.cells=[];for(let i=0;i<my.game.xn;i++){let row=[];for(let j=0;j<my.game.yn;j++){let c=new Cell(i,j,0)
if(my.holesQ){if(Math.random()<0.1){c.typ=-2;}}
row.push(c);}
this.cells.push(row);}
this.scores=[0,0];}
redraw(){g.clearRect(0,0,el.width,el.height);this.scores=[0,0,0];for(let i=0;i<my.game.xn;i++){for(let j=0;j<my.game.yn-1;j++){let cell=this.cells[i][j];if(cell.typ==-2){g.lineWidth=0;g.strokeStyle='transparent';g.fillStyle='transparent';}
cell.draw(g)}}
let s='<div style="background-color:rgba(88,88,255,0.2); padding:2px 6px; border-radius:5px; vertical-align:center; ">';s+=my.mates[0].clickN
s+='<span style="color:grey; font-size:80%;"> of '+my.mates[my.turn].clickMax+' </span>';s+='</div>';document.getElementById('score').innerHTML=s;}}
function drawHex(g,xc,yc,r){g.beginPath();for(let i=0;i<6;i++){a=(i+0.5)*Math.PI/3;x=Math.cos(a)*r;y=Math.sin(a)*r;if(i==0){g.moveTo(xc+x,yc+y);}else{g.lineTo(xc+x,yc+y);}}
g.closePath();}
function touchStart(evt){let touch=evt.targetTouches[0];evt.clientX=touch.clientX;evt.clientY=touch.clientY;evt.touchQ=true;mouseDown(evt)}
function touchMove(evt){let touch=evt.targetTouches[0];evt.clientX=touch.clientX;evt.clientY=touch.clientY;evt.touchQ=true;mouseMove(evt)}
function touchEnd(){draggingQ=false;}
function mouseDown(evt){let bRect=el.getBoundingClientRect();mouseX=(evt.clientX-bRect.left)*(el.width/ratio/bRect.width);mouseY=(evt.clientY-bRect.top)*(el.height/ratio/bRect.height);if(my.turnQ)my.bd.click(mouseX,mouseY);draggingQ=true;frames=0;evt.preventDefault();return false;}
function mouseMove(evt){let bRect=el.getBoundingClientRect();mouseX=(evt.clientX-bRect.left)*(el.width/ratio/bRect.width);mouseY=(evt.clientY-bRect.top)*(el.height/ratio/bRect.height);if(my.turnQ)my.bd.hiCell(mouseX,mouseY);if(evt.preventDefault){evt.preventDefault();}
return false;}
function mouseUp(){draggingQ=false;}
function holesToggle(){my.holesQ=!my.holesQ;btnToggle("holesBtn",my.holesQ);}
function btnToggle(btn,onq){console.log('btnToggle',btn,onq)
if(onq){document.getElementById(btn).classList.add("hi");document.getElementById(btn).classList.remove("lo");}else{document.getElementById(btn).classList.add("lo");document.getElementById(btn).classList.remove("hi");}}
function optPopHTML(){let s='';s+='<div id="optpop" style="position:absolute; left:-500px; top:20px; width:320px; padding: 5px; border-radius: 9px; font:14px Arial; background-color: #bcd; box-shadow: 10px 10px 5px 0px rgba(40,40,40,0.75); transition: all linear 0.3s; opacity:0; text-align: center; ">';s+='<style>input[type="radio"]:checked+label {font-weight: bold;}</style>';s+=radioHTML('Game','game',my.games,my.gameN,'radioClick');s+='<div style="float:right; margin: 0 0 5px 10px; font:16px Arial;">';s+='New game? '
s+='<button onclick="optYes()" style="z-index:2; font: 22px Arial;" class="btn" >&#x2714;</button>';s+=' '
s+='<button onclick="optNo()" style="font: 22px Arial;" class="btn" >&#x2718;</button>';s+='</div>';s+='</div>';return s;}
function optPop(){console.log("optpop");var pop=document.getElementById('optpop');pop.style.transitionDuration="0.3s";pop.style.opacity=1;pop.style.zIndex=102;pop.style.left=(w-340)/2+'px';}
function optYes(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-999px';my.gameN=radioNGet('game')
console.log('optYes',my.gameN)
optSet('gameN',my.gameN)
my.game=my.games[my.gameN]
gameNew()}
function optNo(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-999px';}
function optGet(name){var val=localStorage.getItem(`yacht.${name}`)
if(val==null)val=my.opts[name]
return val}
function optSet(name,val){localStorage.setItem(`yacht.${name}`,val)
my.opts[name]=val}
function radioHTML(prompt,id,lbls,checkN,func){let s='';s+='<div style="position:relative; margin:auto; background-color:lightblue;  margin: 5px 0 1px 0; padding: 5px 0 5px 0;">';s+='<div style="font: bold 16px Arial;">';s+=prompt;s+='</div>';s+='<div class="radio" style="display:inline-block; border-radius:5px; padding:3px; margin:3px; ">';for(let i=0;i<lbls.length;i++){let lbl=lbls[i]
let idi=id+i;let chkStr=(i==checkN)?' checked ':'';s+='<input id="'+idi+'" type="radio" name="'+id+'" value="'+lbl.id+'" onclick="'+func+'('+i+');" autocomplete="off" '+chkStr+' >';s+='<label for="'+idi+'">'+lbl.name+' </label>';s+='<br>';}
s+='</div>';s+='</div>';return s;}
function mateTypChg(n,i){console.log("mateTyp",n,i);my.mates[n].ai=i;}
function mateMaxChg(n,i){console.log("mateMaxChg",i);my.mateMax=i+2;}
function gameNew(){g.clearRect(0,0,el.width,el.height);g2.clearRect(0,0,el.width,el.height);winClose();my.turn=0;my.turns=[0,0,0];my.mates.map(mate=>{mate.clickN=0})
my.cellWd=(w-15)/(my.game.xn*2*0.866);my.bd.lt=my.cellWd
my.bd.tp=my.cellWd
my.bd.fill()
let cell=my.bd.setRand(my.turn)
let far=Math.abs(cell.xn-my.game.xn/2)+Math.abs(cell.yn-my.game.yn/2)
console.log('far',far)
my.mates[my.turn].clickMax=my.game.clickMax+(far/4)<<0
my.bd.redraw()
resize();}
function roundsNew(){let roundN=my.bd.getLeft()/my.mateMax;let rounds=[];for(let i=1;i<=roundN;i++){let n=Math.ceil(20*i/roundN);rounds.push(n);}
for(let i=0;i<my.mateMax;i++){let p=my.mates[i];let rs=rounds.slice();rs.shuffle();rs.push(randomInt(1,5));p.rounds=rs;p.roundN=0;console.log("roundsNew",i,p);}}
function win(winQ){let div=document.getElementById('win');div.style.opacity=1;let dadDiv=document.getElementById('main');div.style.left=(parseInt(dadDiv.style.width)-parseInt(div.style.width))/2+'px';let s='';s+='<div style="margin-top:10px;">'
if(winQ){s+='You wIn'}else{s+='You have run out of moves :)'}
s+='</div>';document.getElementById('winTxt').innerHTML=s;}
function winClose(newQ){console.log('winClose',newQ)
div=document.getElementById('win');div.style.opacity=0;div.style.left='-999px';if(newQ)gameNew()}
function copy2d(a){let b=[];for(let i=0;i<a.length;i++)
b[i]=a[i].slice();return b;}
function randomInt(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
function loop(currNo,minNo,maxNo,incr){if(incr===undefined)incr=1;currNo+=incr;let range=maxNo-minNo+1;if(currNo<minNo){currNo=maxNo-(-currNo+maxNo)%range;}
if(currNo>maxNo){currNo=minNo+(currNo-minNo)%range;}
return currNo;}
Array.prototype.shuffle=function(){let counter=this.length,temp,index;while(counter>0){index=(Math.random()*counter--)|0;temp=this[counter];this[counter]=this[index];this[index]=temp;}};function soundBtnHTML(){let s=''
s+='<style> '
s+=' .speaker { height: 30px; width: 30px; position: relative; overflow: hidden; display: inline-block; vertical-align:top; } '
s+=' .speaker span { display: block; width: 9px; height: 9px; background-color: blue; margin: 10px 0 0 1px; }'
s+=' .speaker span:after { content: ""; position: absolute; width: 0; height: 0; border-style: solid; border-color: transparent blue transparent transparent; border-width: 10px 16px 10px 15px; left: -13px; top: 5px; }'
s+=' .speaker span:before { transform: rotate(45deg); border-radius: 0 60px 0 0; content: ""; position: absolute; width: 5px; height: 5px; border-style: double; border-color: blue; border-width: 7px 7px 0 0; left: 18px; top: 9px; transition: all 0.2s ease-out; }'
s+=' .speaker:hover span:before { transform: scale(.8) translate(-3px, 0) rotate(42deg); }'
s+=' .speaker.mute span:before { transform: scale(.5) translate(-15px, 0) rotate(36deg); opacity: 0; }'
s+=' </style>'
s+='<div id="sound" onClick="soundToggle()" class="speaker"><span></span></div>'
return s}
function radioClick(n){}
function radioNGet(name){var div=document.querySelector('input[name="'+name+'"]:checked')
var id=div.id
var n=(id.match(/\d+$/)||[]).pop();return n}
function soundToggle(){let btn='sound'
if(my.soundQ){my.soundQ=false
document.getElementById(btn).classList.add("mute")}else{my.soundQ=true
document.getElementById(btn).classList.remove("mute")}}