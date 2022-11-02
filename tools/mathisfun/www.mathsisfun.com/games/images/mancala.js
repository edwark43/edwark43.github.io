var my={};var player=0;var inPlay=false
function mancalaMain(){var version='0.52';document.documentElement.style.setProperty('vw',`5px`);my.players=[{name:'Player 1',sttN:0,bankN:6},{name:'Player 2',sttN:7,bankN:13},]
my.opts={playerN:1,beadN:4}
my.pit={wd:12,ht:14,bankHt:37.5}
my.pits=[];for(var i=0;i<6;i++){my.pits[i]=new Pit(73-i*11.5,4,my.pit.wd,my.pit.ht,false)
my.pits[i+7]=new Pit(15.5+i*11.5,28,my.pit.wd,my.pit.ht,false)}
my.pits[6]=new Pit(3,4,my.pit.wd,my.pit.bankHt,true)
my.pits[13]=new Pit(85,4,my.pit.wd,my.pit.bankHt,true)
console.log('pits',my.pits)
my.playerNs=[{id:1,name:1},{id:2,name:2}];my.beadNs=[{id:2,name:2},{id:3,name:3},{id:4,name:4},{id:5,name:5},{id:6,name:6},{id:7,name:7}];my.computerTry=0;my.timers=[];my.timerCount=0
my.imgHome=(document.domain=='localhost')?'/mathsisfun/games/images/':'/games/images/'
var s='';s+=`<style>
  .btn { display: inline-block; position: relative; text-align: center; margin: 1vw; text-decoration: none; 
    font: 2.5vw Arial, sans-serif; color: #268; border: 1px solid #88aaff; border-radius: 2vw; 
    cursor: pointer; background: linear-gradient(to top right, rgba(170,190,255,1) 0%, rgba(255,255,255,1) 100%); 
    outline-style:none;}
  .btn:hover { background: linear-gradient(to top, rgba(255,255,0,1) 0%, rgba(255,255,255,1) 100%); }
  .yy { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(255,220,130,1) 0%, rgba(255,255,255,1) 100%);  }
  .hi { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(130,220,255,1) 0%, rgba(255,255,255,1) 100%); box-shadow: 2px 2px 6px #66a; }
  .lo { border: solid 1px #888888; background: linear-gradient(to top, rgba(170,170,170,1) 0%, rgba(205,205,205,1) 100%);  }
  </style>`
s+=`<style>.beads {position: absolute; 
    transition-property: left, top, -webkit-transform;
    transition-duration: 1s, 1s, 1s, 1s;
  	transition-timing-function: ease-in, ease-out, linear, cubic-bezier(0,1,1,0);
    z-index: 6;
    </style>`
my.sndHome=(document.domain=='localhost')?'/mathsisfun/images/sounds/':'/images/sounds/'
s+='<audio id="sndPickup" src="'+my.sndHome+'ambient-click.mp3" preload="auto"></audio>';s+='<audio id="sndDrop" src="'+my.sndHome+'rollover.mp3" preload="auto"></audio>';s+='<audio id="sndBonus" src="'+my.sndHome+'up.mp3" preload="auto"></audio>';s+='<audio id="sndSteal" src="'+my.sndHome+'success.mp3" preload="none"></audio>';s+='<audio id="sndWin" src="'+my.sndHome+'fanfare.mp3" preload="none"></audio>';s+='<audio id="sndTie" src="'+my.sndHome+'wibble.mp3" preload="none"></audio>';s+='<audio id="sndLose" src="'+my.sndHome+'pop2.mp3" preload="none"></audio>';s+='<div id="main" style="position:relative; width:97%; margin:auto; display:block; border-radius: 10px;">';s+='<div id="btns" style="position:absolute; left: 3px; width:100%;">'
s+='<button type="button" style="z-index:2;" class="btn" onclick="optPop()">Options</button>'
my.snds=[];my.soundQ=true
s+=' &nbsp; '
s+=soundBtnHTML()
s+=' &nbsp; '
s+='</div>'
s+=optPopHTML()
s+=`
  <p id="msg" style="position: absolute; padding-top: 1%; width: 40%; left: 31%; margin: 0; text-align: center;
  font: 4vw Arial; color: #d3511f; z-index:2; cursor:default;"></p>
  
  <div id="gamediv" style="position: absolute; width: 100%; padding-bottom: 100%; top:5vw; display: none;">

  <p id="player1-score_text" style="position: absolute; font: 5vw Arial; left: ${my.pits[6].x}%; top: ${my.pits[6].y-4}%; 
  width: 12%; text-align:center; color: #65a9c2; 
  text-shadow: -1px 0 white, 0 1px white, 1px 0 white, 0 -1px white; cursor:default; z-index:55;"></p>

  <p id="player2-score_text" style="position: absolute; font: 5vw Arial; left: ${my.pits[13].x}%; top: ${my.pits[13].y+26}%; 
  width: 12%;  text-align:center; color: #e67c1f; 
  text-shadow: -1px 0 white, 0 1px white, 1px 0 white, 0 -1px white; cursor:default; z-index:55;"></p>

  <img src="${my.imgHome}mancala-wood.jpg" style="position: absolute; left: 1%; top:1%; width:100%; 
  border-radius: 8vw; z-index:1;" />
  `
for(var i=0;i<14;i++){var pit=my.pits[i]
if(pit.bankQ){s+=`<img id="pit${i}bg" src="%24%7bmy.imgHome%7dmancala-bank.html" 
      style="position: absolute; left: ${pit.x}%; top: ${pit.y}%; width: ${pit.wd}%; height: ${pit.ht}%; z-index:6;" />`}else{s+=`<img id="pit${i}bg" src="%24%7bmy.imgHome%7dmancala-pit.html" 
      style="position: absolute; left: ${pit.x}%; top: ${pit.y}%; width: ${pit.wd}%; height: ${pit.ht}%; z-index:6;" />`
s+=`<img id="pit${i}" src="%24%7bmy.imgHome%7dmancala-hilite.html" 
      style="position: absolute; left: ${pit.x}%; top: ${pit.y}%; width: ${pit.wd}%; height: ${pit.ht}%; z-index:7;" />`}}
for(var i=0;i<13;i++){var pit=my.pits[i]
if(pit.bankQ)continue
var clr=(i<6)?'#65a9c2':'#e67c1f'
var yplus=(i<6)?11:-7
s+=`<p id="pit${i}_count" style="position: absolute; left: ${(pit.x)+0.2}%; top: ${(pit.y+yplus)}%; width: ${my.pit.wd}%; 
    z-index: 10; font: 3vw Arial; color:${clr}; 
    text-shadow: -1px 0 white, 0 1px white, 1px 0 white, 0 -1px white; text-align: center; cursor: default;"></p>`}
s+='</div>'
s+='<div style="width: 100%; text-align: right;">';s+=`<div style="font: 1.5% Arial; color: #acf; ">&copy; 2019 MathsIsFun.com  v${version} &nbsp;</div>`
s+='</div>';s+='</div>'
document.write(s);my.zIndex=20;pitEventHandlers();gameNew()}
function msg(s,clr){clr=typeof clr!=='undefined'?clr:'black'
var div=document.getElementById('msg')
div.innerHTML=s
div.style.color=clr}
function pitEventHandlers(){var makePitClickHandler=function(pitNo){return function(){pitSelected(pitNo,true);};};for(var pitNo=0;pitNo<13;pitNo++){if(pitNo!=6){document.getElementById(`pit${pitNo}`).addEventListener('click',makePitClickHandler(pitNo),false);}}}
function gameNew(){var playerN=optGet('playerN')
if(playerN==1){my.players[0].name='Human'
my.players[1].name='Computer'}else{my.players[0].name='Player 1'
my.players[1].name='Player 2'}
console.log('playerN',playerN,my.players)
document.getElementById("gamediv").style.display="inline";boardReset()
scoresUpdate()}
function scoresUpdate(){document.getElementById("player1-score_text").innerHTML=my.player1score
document.getElementById("player2-score_text").innerHTML=my.player2score}
function beadsDraw(pit){var count=pit.n
pit.beads=[]
for(var i=0;i<count;i++){var locn=pitLocnBest(pit)
var beadImg=document.createElement("img");beadImg.setAttribute('src',`${my.imgHome}marble.svg`);beadImg.setAttribute('alt','bead');beadImg.style.pointerEvents='none'
beadImg.style.width='4%'
beadImg.setAttribute('class','beads')
var x=pit.x+locn.x
var y=pit.y+locn.y
beadImg.style.left=x+"%"
beadImg.style.top=y+"%"
var container=document.getElementById("gamediv");container.appendChild(beadImg);pit.beads.push({x:x,y:y,stt:{x:x,y:y},img:beadImg})}}
function pitLocnBest(pit){var wd=4
var locnBest={x:pit.wd*(0.5+(Math.random()-0.5)*0.1)-wd,y:pit.ht*(0.5+(Math.random()-0.5)*0.1)-wd}
var valBest=-100
for(var t=0;t<10;t++){var ang=2*Math.PI*t/10+Math.random()/100
var rad=Math.random()
var x=pit.wd/2+Math.cos(ang)*rad*pit.wd*0.25-wd/2
var y=pit.ht/2+Math.sin(ang)*rad*pit.ht*0.25-wd/2
var val=-dist(x-pit.wd/2,y-pit.ht/2)
for(var i=0;i<pit.beads.length;i++){var bead=pit.beads[i]
var relx=bead.x-pit.x
var rely=bead.y-pit.y
var d=dist(x-relx,y-rely)
if(d<1)val-=100
val+=d}
if(val>valBest){valBest=val
locnBest={x:x,y:y}}}
return locnBest}
function dist(dx,dy){return Math.sqrt(dx*dx+dy*dy)}
function beadMove(fromPitN,toPitN){my.timerCount--;var fromPit=my.pits[fromPitN]
if(fromPit.beads.count==0)return
var toPit=my.pits[toPitN]
var locn=pitLocnBest(toPit)
var bead=fromPit.beads[0]
fromPit.beads.shift()
toPit.beads.push(bead)
bead.x=toPit.x+locn.x
bead.y=toPit.y+locn.y
var xdiff=toPit.x+locn.x-bead.stt.x
var ydiff=toPit.y+locn.y-bead.stt.y
var div=document.getElementById('gamediv')
console.log('pctToPx',div.clientWidth)
var pctToPx=div.clientWidth/100
bead.img.style.transform='translate('+xdiff*pctToPx+'px,'+ydiff*pctToPx+'px)';bead.img.style.zIndex=my.zIndex++
my.pits[fromPitN].n--;my.pits[toPitN].n++;window.setTimeout('countShow('+fromPitN+', '+my.pits[fromPitN].n+')',1000);window.setTimeout('countShow('+toPitN+', '+my.pits[toPitN].n+')',1000);}
function isGameEnd(){var winner=-1;for(var p=0;p<2;p++){var p2=1-p
var isEmpty=true;for(var cnt=my.players[p].sttN;cnt<my.players[p].bankN;cnt++){if(my.pits[cnt].n!=0){isEmpty=false;break;}}
if(isEmpty){for(var cnt=my.players[p2].sttN;cnt<my.players[p2].bankN;cnt++){if(my.pits[cnt].n>0){while(my.pits[cnt].n>0){beadMove(cnt,my.players[p2].bankN);}
countShow(cnt,0);}}
if(my.pits[my.players[0].bankN].n>my.pits[my.players[1].bankN].n){winner=0;}else if(my.pits[my.players[0].bankN].n<my.pits[my.players[1].bankN].n){winner=1;}else if(my.pits[my.players[0].bankN].n===my.pits[my.players[1].bankN].n){winner=2;}
console.log('winner',winner,my.pits[my.players[0].bankN].n,my.pits[my.players[1].bankN].n,my.pits)}}
return winner}
function isFreeTurn(num,stones){if(num==my.players[0].bankN||num==my.players[1].bankN){return false;}
var mod=stones%13;var difference=0;if(((player==0)&&(num<my.players[0].bankN))||(player==1)&&(num>6&&num<my.players[1].bankN)){difference=((6+7*player)-num);if(mod==difference){return true;}}
return false;}
function isValidSteal(playerPit){if(((player==0)&&(playerPit<my.players[0].bankN))||((player==1)&&(playerPit>my.players[0].bankN&&playerPit<my.players[1].bankN))){var otherside=12-playerPit;if((my.pits[otherside].n>0)&&(my.pits[playerPit].n==1)){return true;}}
return false;}
function stealStones(end){var otherside=12-end;for(var x=0;x<my.pits[otherside].n;x++){if(player==0){var object=window.setTimeout('beadMove('+otherside+', '+my.players[0].bankN+')',my.timerCount*400);my.timers[my.timerCount++]=object;}else{var object=window.setTimeout('beadMove('+otherside+', '+my.players[1].bankN+')',my.timerCount*400);my.timers[my.timerCount++]=object;}}
if(player==0){var object=window.setTimeout('beadMove('+end+', '+my.players[0].bankN+')',my.timerCount*400);my.timers[my.timerCount++]=object;}else{var object=window.setTimeout('beadMove('+end+', '+my.players[1].bankN+')',my.timerCount*400);my.timers[my.timerCount++]=object;}
var turndelay=my.pits[otherside].n+1;soundPlay('sndSteal',true)
msg('Good steal!')
window.setTimeout('changeTurns()',turndelay*500);}
function checkStealState(end){if(((player==0)&&(end<my.players[0].bankN))||(player==1)&&(end>my.players[0].bankN&&end<my.players[1].bankN)){if(isValidSteal(end)){stealStones(end);return;}}
changeTurns();}
function pitSelected(num,isHuman){if(inPlay&&isHuman){return;}else if(isHuman&&!inPlay){inPlay=true;}
if(isHuman&&(player==1)&&(optGet('playerN')==1)){return;}
soundPlay('sndPickup',true)
var start=num+1;var stones=my.pits[num].n
var origStones=my.pits[num].n
var pitMoveFrom=num;if(stones==0){if((player==1)&&(optGet('playerN')==1)){pitSelected(my.computerTry++,false);}else{msg('Pit is empty, try another pit')
inPlay=false;}
return;}
my.keepThisPlayer=isFreeTurn(num,stones);if((player==0&&num>=my.players[0].bankN)||(player==1&&(num<=my.players[0].bankN||num==my.players[1].bankN))){msg('Not one of your pits')
setHighlight();inPlay=false;}else{msg('')
for(var i=0;i<6;i++){document.getElementById(`pit${i}`).style.opacity=0}
for(var i=7;i<13;i++){document.getElementById(`pit${i}`).style.opacity=0}
for(stones;stones>0;stones--){if((player==0)&&(start==my.players[1].bankN)){start=0;}else if((player==1)&&(start==my.players[0].bankN)){start=7;}
var object=window.setTimeout('beadMove('+pitMoveFrom+', '+start+')',my.timerCount*400);my.timers[my.timerCount++]=object;if(stones===1){window.setTimeout('checkStealState('+start+')',origStones*500);}
start++;if(start==14){start=0;}}}}
function optGet(name){var val=localStorage.getItem(`mancala.${name}`)
if(val==null)val=my.opts[name]
return val}
function optSet(name,val){localStorage.setItem(`mancala.${name}`,val)
my.opts[name]=val}
function changeTurns(){var winner=isGameEnd();if(winner==0||winner==1){console.log('changeTurns',winner,optGet('playerN'))
if(optGet('playerN')==1&&winner==1){soundPlay('sndLose',true)}else{soundPlay('sndWin',true)}
msg(`${my.players[winner].name} Wins!`)
inPlay=false;return;}else if(winner==2){soundPlay('sndTie',true)
msg(`It's a tie!`)
inPlay=false;return;}else{if(my.keepThisPlayer){msg('Bonus turn')
soundPlay('sndBonus',true)
setHighlight();inPlay=false;}else{if(player==1){player=0;msg(`${my.players[player].name}'s turn`)}else{player=1;msg(`${my.players[player].name}'s turn`)}
inPlay=false;setHighlight();}
if((player==1)&&(optGet("playerN")==1)){var computerChoice=Math.floor(Math.random()*5+7);my.computerTry=7;setTimeout('pitSelected('+computerChoice+', false)',500);}}}
function boardReset(){var div=document.getElementById("gamediv");for(var i=0;i<my.pits.length;i++){var pit=my.pits[i]
for(var j=0;j<pit.beads.length;j++){var bead=pit.beads[j]
div.removeChild(bead.img)}}
var beadN=parseInt(optGet('beadN'));for(var i=0;i<my.pits.length;i++){var pit=my.pits[i]
pit.n=pit.bankQ?0:beadN
beadsDraw(pit);countShow(i,pit.n);}
my.player1score=0
my.player2score=0
scoresUpdate()
for(var key in my.timers){clearTimeout(my.timers[key]);}
my.timers=[];my.timerCount=0;player=0;setHighlight();msg(`${my.players[0].name}'s turn`)}
function countShow(pitN,beadN){var pit=my.pits[pitN]
if(pit.bankQ){if(pitN==6)my.player1score=beadN
if(pitN==13)my.player2score=beadN
scoresUpdate()}else{document.getElementById(`pit${pitN}_count`).innerText=beadN}
soundPlay('sndDrop',true)}
function setHighlight(){if(player==0){for(var i=0;i<=5;i++){document.getElementById(`pit${i}`).style.opacity=1;document.getElementById(`pit${i}`).style.cursor="pointer";}
for(var i=7;i<=12;i++){document.getElementById(`pit${i}`).style.opacity=0;document.getElementById(`pit${i}`).style.cursor="default";}}else{for(var i=0;i<=5;i++){document.getElementById(`pit${i}`).style.opacity=0;document.getElementById(`pit${i}`).style.cursor="default";}
for(var i=7;i<=12;i++){document.getElementById(`pit${i}`).style.opacity=1;document.getElementById(`pit${i}`).style.cursor="pointer";}}}
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
function soundPlay(name,simulQ){if(!my.soundQ)return
simulQ=typeof simulQ!=='undefined'?simulQ:true
if(simulQ){if(name.length>0){var div=document.getElementById(name)
if(div.currentTime>0&&div.currentTime<div.duration){div.cloneNode(true).play()}else{div.play()}}}else{my.snds.push(name)
soundPlayQueue()}}
function soundPlayQueue(){var div=document.getElementById(my.snds[0])
div.play()
div.onended=function(){my.snds.shift();if(my.snds.length>0)soundPlayQueue();};}
function soundToggle(){var btn='sound'
if(my.soundQ){my.soundQ=false
document.getElementById(btn).classList.add("mute")}else{my.soundQ=true
document.getElementById(btn).classList.remove("mute")}}
function radioHTML(prompt,id,lbls,checkId,func){var s='';s+='<div style="position:relative; margin:auto; background-color:lightblue;  margin: 5px 0 1px 0; padding: 5px 0 5px 0;">';s+='<div style="font: bold 16px Arial;">';s+=prompt;s+='</div>';s+='<div style="display:inline-block; border: 1px solid white; border-radius:5px; padding:3px; margin:3px; background-xnor:rgba(255,255,255,0.5);">';for(var i=0;i<lbls.length;i++){var lbl=lbls[i]
var idi=id+i;var chkStr=(lbl.id==checkId)?' checked ':'';s+='<input id="'+idi+'" type="radio" name="'+id+'" value="'+lbl.id+'" onclick="'+func+'('+i+');" autocomplete="off" '+chkStr+' >';s+='<label for="'+idi+'">'+lbl.name+' </label>';}
s+='</div>';s+='</div>';return s;}
function optPopHTML(){var s='';s+=`<div id="optpop" style="position:absolute; left:-500px; top:20px; width:320px; padding: 5px; border-radius: 9px;
   font:14px Arial; background-color: #bcd; box-shadow: 10px 10px 5px 0px rgba(40,40,40,0.75); transition: all linear 0.3s;
    opacity:0; text-align: center; ">`
s+=radioHTML('Players:','playerN',my.playerNs,optGet('playerN'),'');s+=radioHTML('Beads per pit:','beadN',my.beadNs,optGet('beadN'),'');s+='<div style="float:right; margin: 0 0 5px 10px; font:16px Arial;">';s+='<button onclick="optYes()" style="z-index:2; font: 22px Arial;" class="btn" >&#x2714;</button>';s+=' '
s+='<button onclick="optNo()" style="z-index:2; font: 22px Arial;" class="btn" >&#x2718;</button>';s+='</div>';s+='</div>';return s;}
function optPop(){var pop=document.getElementById('optpop');pop.style.transitionDuration="0.3s";pop.style.opacity=1;pop.style.zIndex=my.zIndex+1
pop.style.left='25vw';}
function optYes(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-200vw';var playerN=document.querySelector('input[name="playerN"]:checked').value
var beadN=document.querySelector('input[name="beadN"]:checked').value
console.log('optYes',playerN,beadN)
optSet('playerN',playerN)
optSet('beadN',beadN)
gameNew()}
function optNo(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-200vw';}
function toggleBtn(btn,onq){if(onq){document.getElementById(btn).classList.add("hi");document.getElementById(btn).classList.remove("lo");}else{document.getElementById(btn).classList.add("lo");document.getElementById(btn).classList.remove("hi");}}
class Pit{constructor(x,y,wd,ht,bankQ){this.x=x
this.y=y
this.bankQ=bankQ
this.wd=wd
this.ht=ht
this.n=0
this.beads=[]
this.div=null}}