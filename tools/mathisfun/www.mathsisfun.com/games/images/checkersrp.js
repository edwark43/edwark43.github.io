var w,h,el,turn,my={}
function checkersrpMain(){my.version='0.853';my.wd=60;my.bdTypes=[{name:'8x8',name2:'American Checkers',size:8,rowFill:3,sttClr:0,multiQ:true},{name:'10x10',name2:'International Draughts',size:10,rowFill:4,sttClr:0,multiQ:true},{name:'12x12',name2:'Canadian Checkers',size:12,rowFill:5,sttClr:0,multiQ:true}]
my.bdType=my.bdTypes[0]
my.bdSize=my.bdType.size
w=my.wd*my.bdSize+8;h=w+55;my.multiJumpQ=true
my.imgHome=(document.domain=='localhost')?'/mathsisfun/games/images/':'/games/images/'
my.imgSets=[{name:'Blue/Red',names:['Blue','Red'],clrs:['blue','red'],glow:['#88f','#f88'],man:['chkr-blu.svg','chkr-red.svg'],king:['chkr-blu-k.svg','chkr-red-k.svg']},{name:'White/Black',names:['White','Black'],clrs:['#ccc','#333'],glow:['#ccc','black'],man:['chkr-wht.svg','chkr-blk.svg'],king:['chkr-wht-k.svg','chkr-blk-k.svg']}];my.imgSet=my.imgSets[0];my.hist=''
var s=''
my.sndHome=(document.domain=='localhost')?'/mathsisfun/images/sounds/':'/images/sounds/'
s+='<audio id="sndmove" src="'+my.sndHome+'click3.mp3" preload="auto"></audio>'
s+='<audio id="sndtake" src="'+my.sndHome+'take.mp3" preload="auto"></audio>'
s+='<audio id="sndking" src="'+my.sndHome+'tish.mp3" preload="auto"></audio>'
s+='<audio id="sndwin" src="'+my.sndHome+'success2.mp3" preload="auto"></audio>'
my.snds=[]
s+='<div id="main" style="position:relative; text-align:center;  margin: 0 auto; display:block;  padding:0;">';s+=optPopHTML();s+=histPopHTML();s+='<button id="newBtn" style=" z-index:44;" class="btn"  onclick="newGame()" >New&nbsp;Game</button>';s+='<button id="optBtn" style=" z-index:44;" class="btn"  onclick="optpop()" >Options</button>';s+='<button id="histBtn" style=" z-index:44;" class="btn"  onclick="histPop()" >History</button>';my.soundQ=true
s+=soundBtnHTML()
s+='<div style="text-align: center; font: 16px Verdana; height: 30px;">';s+='<div id="msg" style="font: 20px Verdana; color: darkgreen;"></div>';s+='</div>';s+='<div id="board" style="position:relative; text-align:center; margin:auto; ">';s+=getBdHTML();s+='</div>';s+='<div id="copyrt" style="font: 10px Arial; color: #6600cc; position:absolute; right:5px; top:3px;">&copy; 2019 MathsIsFun.com  v'+my.version+'</div>';s+='</div>';document.write(s);my.timeout=null;my.players=[{aiq:false,skill:1},{aiq:true,skill:0}];setPlayers()
s='';for(var i=my.players.length-1;i>=0;i--){var p=my.players[i];var chosen=0;if(i==1)chosen=2;s+='<div style="font: 15px Verdana; background-color: #eee; color: '+p.clr+'; padding: 0 0 10px 0; margin: 5px; border-radius: 10px;  border: 3px 3px 3px 3px;">';s+='<div style="font: bold 15px Verdana; padding:5px;">'+p.name+' player:</div>';s+='Type: ';s+=getDropdownHTML(['Human','Computer (Easy)','Computer (Medium)','Computer (Hard)'],'funcy','playerType'+i,chosen);s+='</div>';}
s+='<div style="font: 14px Verdana; background-color: #ddd; color: black; padding: 5px; margin: 5px; border-radius: 10px;  border: 3px 3px 3px 3px;">';s+=getRadioHTML('Size','bdType',my.bdTypes,'chgBdType');s+=getRadioHTML('Style','imgSets',my.imgSets,'chgimgSet');s+='<div style="display:inline-block; border: 1px solid white; border-radius:5px; padding:3px; margin:3px; background-color:rgba(255,255,255,0.5);">';s+='<label for="multijump">Multiple Jumps?</label>'
s+='<input type="checkbox" id="multijump" name="multijump" onclick="multiClick()" checked>'
s+='</div>';s+='</div>';document.getElementById('optInside').innerHTML=s;el=document.getElementById('board');el.addEventListener("mousedown",mouseDownListener,false);el.addEventListener('touchstart',ontouchstart,false);el.addEventListener("mousemove",dopointer,false);my.drag={on:false,index:0,hold:{x:0,y:0}}
optpop();var isIE=!!navigator.userAgent.match(/Trident/g)||!!navigator.userAgent.match(/MSIE/g);if(isIE){alert("You may have trouble playing Checkers on Internet Explorer.\n\nIf so, please try Firefox, Edge or Chrome.");}}
function chgBdType(n){console.log('chgBdType')
my.bdType=my.bdTypes[n];my.bdSize=my.bdType.size
document.getElementById('board').innerHTML=getBdHTML()}
function chgimgSet(n){console.log('chgimgSet')
my.imgSet=my.imgSets[n]
setPlayers()
document.getElementById('board').innerHTML=getBdHTML()}
function setPlayers(){for(var i=0;i<2;i++){var p=my.players[i]
p.name=my.imgSet.names[i];p.clr=my.imgSet.clrs[i];p.glow='drop-shadow(2px 2px 5px '+my.imgSet.glow[i]+') drop-shadow(-2px -2px 5px '+my.imgSet.glow[i]+')'}}
function multiClick(){var div=document.getElementById('multijump')
my.multiJumpQ=div.checked
console.log('multiClick',div.checked,my.multiJumpQ)}
function newGame(){clearTimeout(my.timeout);my.hist='';for(var i=0;i<my.players.length;i++){var p=my.players[i];var div=document.getElementById("playerType"+i);var typ=div.options[div.selectedIndex].text;switch(typ){case 'Human':p.aiq=false;break;case 'Computer (Easy)':p.aiq=true;p.skill=0;break;case 'Computer (Medium)':p.aiq=true;p.skill=1;break;case 'Computer (Hard)':p.aiq=true;p.skill=2;break;default:}
my.hist+=p.name+': '+typ+'\n';}
var div=document.getElementById('board');div.innerHTML=getBdHTML();turn=1;nextTurn();}
function getBdHTML(){var s='';my.wd=Math.min(50,(window.innerWidth-30)/my.bdSize)
my.bdWd=my.wd*my.bdSize
my.bdHt=my.bdWd
console.log('getBdHTML',window.innerWidth,my.bdSize,my.wd)
s+='<div id="bd2" style="position: relative; margin:auto; width:'+my.bdWd+'px; height:'+my.bdWd+'px; border: 4px solid #333; text-align: center; ">';var wd=my.wd
var ltBG='background: radial-gradient(#777 15%, transparent 16%) 0 0,radial-gradient(#777 15%, transparent 16%) 6px 6px,	radial-gradient(rgba(220,220,220,.1) 15%, transparent 20%) 0 1px,	radial-gradient(rgba(220,220,220,.1) 15%, transparent 20%) 6px 6px; 	background-color:#888;	background-size:12px 12px;';var dkBG='background: radial-gradient(#222 15%, transparent 16%) 0 0,radial-gradient(#222 15%, transparent 16%) 8px 8px,	radial-gradient(rgba(255,255,255,.1) 15%, transparent 20%) 0 1px,	radial-gradient(rgba(255,255,255,.1) 15%, transparent 20%) 8px 9px; 	background-color:#222;	background-size:16px 16px;';my.pcs=[];var id=0;for(var i=0;i<my.bdSize;i++){s+='<div style="height:'+wd+'px;">';for(var j=0;j<my.bdSize;j++){if((i+j)%2==0){s+='<div id="sq_'+i+'_'+j+'" style="display: inline-block; height:'+wd+'px; width:'+wd+'px; '+ltBG+'" class="square redsquare"" >';s+='</div>';}else{s+='<div id="sq_'+i+'_'+j+'" style="display: inline-block; height:'+wd+'px; width:'+wd+'px; '+dkBG+'" class="square blacksquare" >';var xp=j*wd;var yp=i*wd;var clrNum=-1
if(i>=my.bdSize-my.bdType.rowFill)clrNum=0
if(i<my.bdType.rowFill)clrNum=1
if(clrNum>=0){var pc=new Piece(clrNum,xp,yp,wd,wd,j,i,id);my.pcs.push(pc);s+='<img id="pc'+id+'" alt="'+id+'" style="position: absolute; left:'+xp+'px; top:'+yp+'px; width:'+(my.wd-2)+'px; margin: 1px;" src="'+my.imgHome+my.imgSet.man[clrNum]+'">';id++}
s+='</div>';}}
s+='</div>';}
s+='</div>';return s;}
function ontouchstart(evt){var touch=evt.targetTouches[0];evt.clientX=touch.clientX;evt.clientY=touch.clientY;evt.touchQ=true;mouseDownListener(evt)}
function ontouchmove(evt){var touch=evt.targetTouches[0];evt.clientX=touch.clientX;evt.clientY=touch.clientY;evt.touchQ=true;evt.preventDefault();mouseMoveListener(evt);}
function ontouchend(){el.addEventListener('touchstart',ontouchstart,false);window.removeEventListener("touchend",ontouchend,false);if(my.drag.on){my.drag.on=false;pcDrop();window.removeEventListener("touchmove",ontouchmove,false);}}
function dopointer(e){var div=document.getElementById('sq_0_0')
var bRect=div.getBoundingClientRect();var mouseX=(e.clientX-bRect.left);var mouseY=(e.clientY-bRect.top);var overQ=false;for(var i=0;i<my.pcs.length;i++){if(hitTest(my.pcs[i],mouseX,mouseY)){overQ=true;}}
if(overQ){document.body.style.cursor="pointer";}else{document.body.style.cursor="default";}}
function hitTest(shape,mx,my){if(mx<shape.x)return false;if(my<shape.y)return false;if(mx>(shape.x+shape.wd))return false;if(my>(shape.y+shape.ht))return false;return true;}
function mouseDownListener(evt){var i;var highestIndex=-1;var div=document.getElementById('sq_0_0')
var bRect=div.getBoundingClientRect();var mouseX=(evt.clientX-bRect.left);var mouseY=(evt.clientY-bRect.top);for(i=0;i<my.pcs.length;i++){var pc=my.pcs[i]
if(hitTest(pc,mouseX,mouseY)){my.drag.on=true;if(i>highestIndex){my.drag.hold.x=mouseX-pc.x;my.drag.hold.y=mouseY-pc.y;highestIndex=i;my.drag.index=i;}}}
if(my.drag.on){my.pcs[my.drag.index].shadowQ=true;if(evt.touchQ){window.addEventListener('touchmove',ontouchmove,false);}else{window.addEventListener("mousemove",mouseMoveListener,false);}}
if(evt.touchQ){el.removeEventListener("touchstart",ontouchstart,false);window.addEventListener("touchend",ontouchend,false);}else{el.removeEventListener("mousedown",mouseDownListener,false);window.addEventListener("mouseup",mouseUpListener,false);}
evt.preventDefault();return false;}
function mouseUpListener(){el.addEventListener("mousedown",mouseDownListener,false);window.removeEventListener("mouseup",mouseUpListener,false);if(my.drag.on){my.drag.on=false;pcDrop();window.removeEventListener("mousemove",mouseMoveListener,false);}}
function mouseMoveListener(evt){if(my.drag.index<0)return;var div=document.getElementById('sq_0_0')
var bRect=div.getBoundingClientRect();var mouseX=(evt.clientX-bRect.left);var mouseY=(evt.clientY-bRect.top);var pcDrag=my.pcs[my.drag.index]
var minX=-pcDrag.wd/2;var maxX=my.bdWd-pcDrag.wd/2;var posX=mouseX-my.drag.hold.x;posX=(posX<minX)?minX:((posX>maxX)?maxX:posX);var minY=-pcDrag.ht*0.7;var maxY=my.bdHt-pcDrag.ht*0.3;var posY=mouseY-my.drag.hold.y;posY=(posY<minY)?minY:((posY>maxY)?maxY:posY);pcDrag.x=posX;pcDrag.y=posY;var div=document.getElementById('pc'+pcDrag.id);div.style.left=posX+'px';div.style.top=posY+'px';if(pcDrag.shadowQ){div.style.filter=my.players[pcDrag.clr].glow;div.style.webkitFilter=my.players[pcDrag.clr].glow;}else{div.style.filter='none';div.style.webkitFilter='none';}}
function pcDrop(){var me=my.pcs[my.drag.index];var nx=(me.x/my.wd+0.5)<<0;var ny=(me.y/my.wd+0.5)<<0;me.dnx=nx;me.dny=ny;playerMove(me);}
function playerMove(pc){if(pc.clr!=turn){pc.showMeAt(pc.nx,pc.ny);return;}
var jumps=getJumps(turn);if(isLegalMove(pc)){if(jumps.length){console.log("playerMove","Should Jump");setMsg(my.players[turn].name+' Must Jump!');pc.showMeAt(pc.nx,pc.ny);}else{addHist(pc,null);tryKingMe(pc);pc.showMeAt(pc.dnx,pc.dny);nextTurn();}}else{var jumpedPc=isLegalJump(pc);if(jumpedPc){removePc(jumpedPc);addHist(pc,jumpedPc);tryKingMe(pc);pc.showMeAt(pc.dnx,pc.dny);if(my.multiJumpQ){jumps=getJumps(turn);if(jumps.length){var moreJumpsQ=false;for(var i=0;i<jumps.length;i++){var jumpPc=jumps[i][0];if(jumpPc.nx==pc.nx&&jumpPc.ny==pc.ny){moreJumpsQ=true;}}
if(moreJumpsQ){console.log("more jumps available, no next turn yet");setMsg(my.players[turn].name+' Has Another Jump!');}else{console.log("another jump available, but not by piece that just jumped");nextTurn();}}else{nextTurn();}}else{nextTurn();}}else{pc.showMeAt(pc.nx,pc.ny);}}
pc.showMeAt(pc.nx,pc.ny);}
function removePc(pc){var div=document.getElementById('pc'+pc.id);div.parentNode.removeChild(div);for(var i=0;i<my.pcs.length;i++){if(pc==my.pcs[i]){my.pcs.splice(i,1);return;}}}
function addHist(pc,jumpedPc){var s='';s+=my.players[pc.clr].name+' '+pc.nx+','+pc.ny+' to '+pc.dnx+','+pc.dny;if(jumpedPc==null){s=s.replace('to','->');soundPlay('sndmove')}else{s=s.replace('to','('+jumpedPc.nx+','+jumpedPc.ny+')');soundPlay('sndtake')}
my.hist+=s;my.hist+='\n';}
function getDiags(pc){var diags;if(pc.typ=='KING'){diags=[[-1,-1],[1,-1],[-1,1],[1,1]];}else{if(pc.clr==0){diags=[[-1,-1],[1,-1]];}else{diags=[[-1,1],[1,1]];}}
return diags;}
function getJumps(clr){var jumps=[];for(var i=0;i<my.pcs.length;i++){var pc=my.pcs[i];if(pc.clr==clr){var diags=getDiags(pc);for(var j=0;j<diags.length;j++){var diag=diags[j];var diagPc=getPcAtSquare(pc.nx+diag[0],pc.ny+diag[1]);if(typeof diagPc!="number"){if(diagPc.clr!=clr){var destPc=getPcAtSquare(pc.nx+diag[0]*2,pc.ny+diag[1]*2);if(destPc==0){jumps.push([pc,diag]);}}}}}}
return jumps;}
function getPcAtSquare(nx,ny){if(nx<0)return-1;if(ny<0)return-1;if(nx>=my.bdSize)return-1;if(ny>=my.bdSize)return-1;for(var i=0;i<my.pcs.length;i++){var pc=my.pcs[i];if(pc.nx==nx&&pc.ny==ny){return pc;}}
return 0;}
function win(winner){setMsg(my.players[winner].name+' WINS!',my.players[winner].clr);soundPlay('sndwin')}
function nextTurn(){if(checkWin())return;turn=1-turn;setMsg(my.players[turn].name+'\'s Turn',my.players[turn].clr);if(my.players[turn].aiq){my.timeout=setTimeout(aimove,1000);}}
function checkWin(){var counts=[0,0];for(var i=0;i<my.pcs.length;i++){var pc=my.pcs[i];counts[pc.clr]++}
console.log("checkWin",counts);if(counts[0]==0){win(1);return true;}
if(counts[1]==0){win(0);return true;}
return false;}
function tryKingMe(pc){if(pc.clr==0&&pc.dny==0||pc.clr==1&&pc.dny==my.bdSize-1){if(pc.typ!='KING'){pc.typ='KING'
var div=document.getElementById('pc'+pc.id)
div.src=my.imgHome+my.imgSet.king[pc.clr];soundPlay('sndking',true)}}}
function aimove(){var pc=null
var diag=null
var jumps=getJumps(turn);if(jumps.length){var jump=jumps[Math.floor(Math.random()*jumps.length)];var pc=jump[0];var diag=jump[1];var diagPc=getPcAtSquare(pc.nx+diag[0],pc.ny+diag[1]);removePc(diagPc);pc.dnx=pc.nx+diag[0]*2;pc.dny=pc.ny+diag[1]*2;addHist(pc,diagPc);tryKingMe(pc);pc.showMeAt(pc.dnx,pc.dny);jumps=getJumps(turn);var moreJumpsQ=false;for(var i=0;i<jumps.length;i++){var jumpPc=jumps[i][0];if(jumpPc.nx==pc.nx&&jumpPc.ny==pc.ny){moreJumpsQ=true;}}
if(moreJumpsQ&&my.multiJumpQ){my.timeout=setTimeout(aimove,700);}else{nextTurn();}
return;}
var moves=[];for(var i=0;i<my.pcs.length;i++){pc=my.pcs[i];if(pc.clr==turn){var diags=getDiags(pc);for(var j=0;j<diags.length;j++){diag=diags[j];var diagPc=getPcAtSquare(pc.nx+diag[0],pc.ny+diag[1]);if(diagPc==0){moves.push([pc,diag]);}}}}
if(!moves.length){win(1-turn);return;}
switch(my.players[turn].skill){case 0:var move=moves[Math.floor(Math.random()*moves.length)];pc=move[0];diag=move[1];break;case 1:move=getBestMove(moves);pc=move[0];diag=move[1];break;case 2:var ai=new AI();move=ai.getBest(my.pcs,turn);console.log("move",move);pc=getPcAtSquare(move[1][1],move[1][0]);diag=[move[2][1]-move[1][1],move[2][0]-move[1][0]];break;default:}
pc.dnx=pc.nx+diag[0];pc.dny=pc.ny+diag[1];addHist(pc,null);tryKingMe(pc);pc.showMeAt(pc.dnx,pc.dny);nextTurn();}
function getBestMove(moves){var bestMove=[];var bestWt=-100;for(var i=0;i<moves.length;i++){var move=moves[i];var wt=0;wt+=getRandomInt(0,2);var pc=move[0];var diag=move[1];var movePc=getPcAtSquare(pc.nx+diag[0],pc.ny+diag[1]);if(pc.clr==0&&pc.ny==my.bdSize-1)wt-=6;if(pc.clr==1&&pc.ny==0)wt-=6;if(pc.clr==0&&movePc.ny==0)wt+=9;if(pc.clr==1&&movePc.ny==my.bdSize-1)wt+=9;var frontLPc=getPcAtSquare(pc.nx+diag[0]-diag[0],pc.ny+diag[1]+diag[1]);var frontRPc=getPcAtSquare(pc.nx+diag[0]+diag[0],pc.ny+diag[1]+diag[1]);var backLPc=getPcAtSquare(pc.nx-diag[0],pc.ny-diag[1]);var backRPc=getPcAtSquare(pc.nx+3*diag[0],pc.ny-diag[1]);if(typeof frontLPc!='number'&&frontLPc.clr!=pc.clr){wt-=10;if(typeof backRPc!='number'&&backRPc.clr==pc.clr){wt+=10;}}
if(typeof frontRPc!='number'&&frontRPc.clr!=pc.clr){wt-=10;if(typeof backLPc!='number'&&backLPc.clr==pc.clr){wt+=10;}}
if(wt>bestWt){bestWt=wt;bestMove=move;}}
return bestMove;}
function isLegalMove(pc){var destinationEmpty=isEmpty(pc.dnx,pc.dny);var dCol=pc.dnx;var dRow=pc.dny;var oCol=pc.nx;var oRow=pc.ny;var color=pc.clr;var type=pc.typ;var blackMove=color===0&&dRow+1===oRow;var redMove=color===1&&dRow-1===oRow;var kingMove=type==='KING'&&(dRow+1===oRow||dRow-1===oRow);var legalMove=(dCol+1===oCol||dCol-1===oCol)&&(blackMove||redMove||kingMove);return destinationEmpty&&legalMove;}
function isEmpty(nx,ny){for(var i=0;i<my.pcs.length;i++){var pc=my.pcs[i];if(pc.nx==nx&&pc.ny==ny)return false;}
return true;}
function isLegalJump(pc){var destinationEmpty=isEmpty(pc.dnx,pc.dny);var dCol=pc.dnx;var dRow=pc.dny;var oCol=pc.nx;var oRow=pc.ny;var color=pc.clr;var type=pc.typ;var avgCol=(dCol+oCol)/2;var avgRow=(dRow+oRow)/2;var blackMove=color===0&&dRow+2===oRow;var redMove=color===1&&dRow-2===oRow;var kingMove=type==='KING'&&(dRow+2===oRow||dRow-2===oRow);var legalMove=(dCol+2===oCol||dCol-2===oCol)&&(blackMove||redMove||kingMove);var jumpedPc=getPcAtSquare(avgCol,avgRow);if(jumpedPc==null)return false;var jumpedClr=jumpedPc.clr;if(destinationEmpty&&legalMove&&jumpedClr!==color){return jumpedPc;}}
function setMsg(s,clr){clr=typeof clr!=='undefined'?clr:'black';var div=document.getElementById('msg')
div.innerHTML=s;div.style.color=clr}
function Piece(clr,x,y,wd,ht,nx,ny,id){this.clr=clr;this.typ="CHECKER";this.x=x;this.y=y;this.wd=wd;this.ht=ht;this.nx=nx;this.ny=ny;this.dnx=0;this.dny=0;this.id=id;this.info='a';}
Piece.prototype.getPos=function(){return this.id+':('+this.nx+','+this.ny+')';};Piece.prototype.showMeAt=function(nx,ny){this.nx=nx;this.ny=ny;this.x=nx*this.wd;this.y=ny*this.wd;var div=document.getElementById('pc'+this.id);div.style.filter='none';div.style.webkitFilter='none';div.alt=this.info;div.style.left=(nx*my.wd)+'px';div.style.top=(ny*my.wd)+'px';this.shadowQ=false;};function histPopHTML(){var s='';s+='<div id="histpop" style="position:absolute; left:-450px; top:30px; width:310px; height:360px; padding: 5px; border-radius: 9px; background-color: #ffe; box-shadow: 10px 10px 5px 0px rgba(40,40,40,0.75); transition: all linear 0.3s; opacity:0; text-align: center; ">';s+='<textarea id="hist" style="margin: 5px auto 5px auto; width:300px; height:300px; font: 12px Arial;">';s+='</textarea>';s+='<div style="float:right; margin: 0 0 5px 10px;">';s+='<button id="optYes" onclick="histYes()" style="z-index:2; font: 22px Arial;" class="btn" >&#x2714;</button>';s+='</div>';s+='</div>';return s;}
function histPop(){document.getElementById('hist').value=my.hist;var pop=document.getElementById('histpop');pop.style.transitionDuration="0.3s";pop.style.opacity=1;pop.style.zIndex=12;pop.style.left=(w-320)/2+'px';}
function histYes(){var pop=document.getElementById('histpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-999px';}
function optPopHTML(){var s='';s+='<div id="optpop" style="position:absolute; left:-450px; top:70px; width:300px; padding: 5px; border-radius: 9px; background-color: rgba(220,220,220,0.9); box-shadow: 10px 10px 5px 0px rgba(40,40,40,0.75); transition: all linear 0.3s; opacity:0; text-align: center; ">';s+='<div id="optInside" style="margin: 5px auto 5px auto;">';s+='</div>';s+='<div style="float:right; margin: 0 0 5px 10px;">';s+='<button id="optYes" onclick="optYes()" style="z-index:2; font: 22px Arial;" class="btn" >&#x2714;</button>';s+='<button onclick="optNo()" style="z-index:2; font: 22px Arial;" class="btn" >&#x2718;</button>';s+='</div>';s+='</div>';return s;}
function optpop(){var pop=document.getElementById('optpop');pop.style.transitionDuration="0.3s";pop.style.opacity=1;pop.style.zIndex=12;pop.style.left=(Math.min(window.innerWidth,760)-340)/2+'px';}
function optYes(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-999px';newGame();}
function optNo(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-999px';}
function optChoose(n){console.log("optChoose",n);optYes();}
function getDropdownHTML(opts,funcName,id,chkNo){var s='';s+='<select id="'+id+'" style="font: 14px Arial; padding: 1px;line-height:30px; border-radius: 5px;">';for(var i=0;i<opts.length;i++){var idStr=id+i;var chkStr=i==chkNo?'selected':'';s+='<option id="'+idStr+'" value="'+opts[i]+'" style="height:21px;" '+chkStr+' >'+opts[i]+'</option>';}
s+='</select>';return s;}
function getRandomInt(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
function AI(){}
AI.prototype.fmtBd=function(b){var s='';for(var i=0;i<my.bdSize;i++){for(var j=0;j<my.bdSize;j++){switch(b[i][j]){case 0:s+='b';break;case 1:s+='r';break;case 2:s+='B';break;case 3:s+='R';break;default:s+='-';}}
s+='  ';}
s+=this.getScore(b);return s;};AI.prototype.setFromPcs=function(pcs){var b=[];for(var i=0;i<my.bdSize;i++){b[i]=[];for(var j=0;j<my.bdSize;j++){b[i][j]=9;}}
for(i=0;i<pcs.length;i++){var pc=pcs[i];b[pc.ny][pc.nx]=pc.clr;if(pc.typ=='KING'){b[pc.ny][pc.nx]+=2;}}
return b;};AI.prototype.getBest=function(pcs,turn){var b=this.setFromPcs(pcs);var moves=this.getMoves(b,turn);if(moves.length==0)return[];var dirn=turn==0?1:-1;console.log("getBest moves2 ",turn,dirn);var best=-1e9;var besti=0;for(var i=0;i<moves.length;i++){var move2s=this.getMoves(moves[i][0],1-turn);var worst=1e9;for(var j=0;j<move2s.length;j++){var score=this.getScore(move2s[j][0])*dirn;if(score<worst)worst=score;}
if(worst>best){best=worst;besti=i;}}
return moves[besti];};AI.prototype.copyBd=function(b){var newb=[];for(var i=0;i<my.bdSize;i++){newb[i]=[];for(var j=0;j<my.bdSize;j++){newb[i][j]=b[i][j];}}
return newb;};AI.prototype.makeMove=function(b,frSqr,toSqr){var newb=this.copyBd(b);newb[toSqr[0]][toSqr[1]]=newb[frSqr[0]][frSqr[1]];newb[frSqr[0]][frSqr[1]]=9;this.tryKing(b,toSqr,'makeMove');return[newb,frSqr,toSqr];};AI.prototype.tryKing=function(b,toSqr){if(b[toSqr[0]][toSqr[1]]==0&&toSqr[0]==0)b[toSqr[0]][toSqr[1]]=2;if(b[toSqr[0]][toSqr[1]]==1&&toSqr[0]==my.bdSize-1)b[toSqr[0]][toSqr[1]]=3;};AI.prototype.getJumps=function(b,turn){var moves=[];for(var i=0;i<my.bdSize;i++){for(var j=0;j<my.bdSize;j++){var diags=this.getDiags(b[i][j],turn);for(var k=0;k<diags.length;k++){var diag=diags[k];var diagClr=this.getAt(b,i+diag[0],j+diag[1]);if(diagClr!=9){if(diagClr!=turn&&diagClr!=(turn+2)){var destClr=this.getAt(b,i+diag[0]*2,j+diag[1]*2);if(destClr==9){var b1=this.copyBd(b);b1[i+diag[0]*2][j+diag[1]*2]=b1[i][j];b1[i][j]=9;b1[i+diag[0]][j+diag[1]]=9;this.tryKing(b1,[i+diag[0]*2,j+diag[1]*2],'jump1');var jumps=this.getJumpsAt(b1,i+diag[0]*2,j+diag[1]*2,turn);if(jumps.length){console.log("MORE JUMPS!");for(var l=0;l<jumps.length;l++){var jmp2=jumps[l];var b2=this.copyBd(b1);b2[jmp2[2][0]][jmp2[2][1]]=b2[jmp2[0][0]][jmp2[0][1]];b2[jmp2[1][0]][jmp2[1][1]]=9;b2[jmp2[0][0]][jmp2[0][1]]=9;this.tryKing(b2,jmp2[2],'jump2');moves.push([b2,[],[]]);}}else{moves.push([b1,[],[]]);}}}}}}}
var s='';for(var i=0;i<moves.length;i++){s+=this.fmtBd(b,moves[i][0])+'\n';}
return moves;};AI.prototype.getMoves=function(b,turn){var moves=this.getJumps(b,turn);if(moves.length){return moves;}
for(var i=0;i<my.bdSize;i++){for(var j=0;j<my.bdSize;j++){var diags=this.getDiags(b[i][j],turn);for(var k=0;k<diags.length;k++){var diag=diags[k];if(this.getAt(b,i+diag[0],j+diag[1])==9){moves.push(this.makeMove(b,[i,j],[i+diag[0],j+diag[1]]));}}}}
var s='';for(var i=0;i<moves.length;i++){s+=this.fmtBd(moves[i][0])+'\n';}
return moves;};AI.prototype.getDiags=function(currClr,wantClr){var diags=[];switch(currClr){case wantClr:if(currClr==0){diags=[[-1,-1],[-1,1]];}else{diags=[[1,-1],[1,1]];}
break;case wantClr+2:diags=[[-1,-1],[1,-1],[-1,1],[1,1]];break;default:}
return diags;};AI.prototype.getJumpsAt=function(b,r,c,clr){var jumps=[];var wantClr=clr;if(wantClr>1)wantClr-=2;var diags=this.getDiags(clr,wantClr);for(var k=0;k<diags.length;k++){var diag=diags[k];var diagClr=this.getAt(b,r+diag[0],c+diag[1]);if(diagClr!=9){if(diagClr!=clr&&diagClr!=(clr+2)){var destClr=this.getAt(b,r+diag[0]*2,c+diag[1]*2);if(destClr==9){jumps.push([[r,c],[r+diag[0],c+diag[1]],[r+diag[0]*2,c+diag[1]*2]]);}}}}
return jumps;};AI.prototype.getAt=function(b,r,c){if(r<0)return-1;if(c<0)return-1;if(r>=my.bdSize)return-1;if(c>=my.bdSize)return-1;return b[r][c];};AI.prototype.getScore=function(b){var v=0;for(var i=0;i<my.bdSize;i++){for(var j=0;j<my.bdSize;j++){v+=this.valAt(b,i,j);}}
return v;};AI.prototype.valAt=function(b,r,c){var n=b[r][c];var v=0;if(n==9)return 0;if(n==0){v=100+(my.bdSize-r-1);if(r==(my.bdSize-1))v+=10;return v;}
if(n==1){v=-100-r;if(r==0)v-=10;return v;}
var pos_i=Math.abs(3.5-r);var pos_c=Math.abs(r-c);if(n==2){return 120-(pos_c+pos_i)/500;}
if(n==3){return-120+(pos_c+pos_i)/1000;}
return 0;};function getRadioHTML(prompt,id,lbls,func){var s='';s+='<div style="display:inline-block; border: 1px solid white; border-radius:5px; padding:3px; margin:3px; background-color:rgba(255,255,255,0.5);">';s+=prompt+':';for(var i=0;i<lbls.length;i++){var idi=id+i;var lbl=lbls[i].name;var chk=(i==0)?' checked ':''
s+='<input id="'+idi+'" type="radio" name="'+id+'" value="'+lbl+'" onclick="'+func+'('+i+');"'+chk+'>';s+='<label for="'+idi+'">'+lbl+' </label>';}
s+='</div>';return s;}
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